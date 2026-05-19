/**
 * API 网关模块
 * 
 * 功能：
 * 1. 多服务商支持 (DeepSeek, SiliconFlow, OpenAI)
 * 2. 统一充值接口
 * 3. 网络代理 / 重试机制
 * 4. 余额查询 / 消费统计
 * 5. 错误统一处理
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { database } from '../database/index.js';

const STORE_KEY = 'apiGateway';

// 支持的 AI 服务商
export const AI_PROVIDERS = {
    DEEPSEEK: {
        id: 'deepseek',
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com',
        apiKeyUrl: 'https://platform.deepseek.com/api_keys',
        rechargeUrl: 'https://platform.deepseek.com/billing',
        docsUrl: 'https://platform.deepseek.com/docs',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat', contextWindow: 32768 },
            { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', contextWindow: 65536 }
        ]
    },
    SILICONFLOW: {
        id: 'siliconflow',
        name: '硅基流动',
        baseUrl: 'https://api.siliconflow.cn/v1',
        apiKeyUrl: 'https://cloud.siliconflow.cn/account/api-keys',
        rechargeUrl: 'https://cloud.siliconflow.cn/billing',
        docsUrl: 'https://docs.siliconflow.cn',
        models: [
            { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen2.5 7B', contextWindow: 32768 },
            { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen2.5 72B', contextWindow: 131072 },
            { id: 'THUDM/glm-4-9b-chat', name: 'GLM-4 9B', contextWindow: 131072 },
            { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B', contextWindow: 131072 }
        ]
    },
    OPENAI: {
        id: 'openai',
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        apiKeyUrl: 'https://platform.openai.com/api-keys',
        rechargeUrl: 'https://platform.openai.com/billing',
        docsUrl: 'https://platform.openai.com/docs',
        models: [
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16384 },
            { id: 'gpt-4', name: 'GPT-4', contextWindow: 8192 },
            { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000 }
        ]
    }
};

// 网络错误类型
export const NETWORK_ERRORS = {
    CONNECTION_FAILED: 'CONNECTION_FAILED',
    TIMEOUT: 'TIMEOUT',
    CORS_BLOCKED: 'CORS_BLOCKED',
    SSL_ERROR: 'SSL_ERROR',
    DNS_FAILED: 'DNS_FAILED',
    NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE'
};

// ==================== 网关初始化 ====================

export function initApiGateway() {
    store.setState(STORE_KEY, {
        providers: Object.keys(AI_PROVIDERS).map(k => AI_PROVIDERS[k]),
        currentProvider: 'deepseek',
        apiKeys: {},           // { providerId: key }
        balances: {},          // { providerId: balance }
        usageStats: {},        // 消费统计
        networkConfig: {
            timeout: 30000,    // 30秒超时
            maxRetries: 3,     // 最多重试3次
            retryDelay: 1000,  // 重试间隔
            useProxy: false,
            proxyUrl: ''
        },
        isOnline: navigator.onLine
    });
    
    // 监听网络状态
    window.addEventListener('online', () => {
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, { ...state, isOnline: true });
        eventBus.emit('api:networkOnline');
    });
    
    window.addEventListener('offline', () => {
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, { ...state, isOnline: false });
        eventBus.emit('api:networkOffline');
    });
    
    console.log('[ApiGateway] API 网关初始化完成');
    eventBus.emit('module:ready', 'apiGateway');
}

// ==================== 服务商配置 ====================

export function setCurrentProvider(providerId) {
    if (!AI_PROVIDERS[providerId.toUpperCase()]) {
        throw new Error(`不支持的服务商: ${providerId}`);
    }
    
    const state = store.getState(STORE_KEY);
    store.setState(STORE_KEY, {
        ...state,
        currentProvider: providerId
    });
    
    eventBus.emit('api:providerChanged', providerId);
}

export function getCurrentProvider() {
    const state = store.getState(STORE_KEY);
    return AI_PROVIDERS[state.currentProvider.toUpperCase()];
}

export function setApiKey(providerId, apiKey) {
    const state = store.getState(STORE_KEY);
    store.setState(STORE_KEY, {
        ...state,
        apiKeys: {
            ...state.apiKeys,
            [providerId]: apiKey
        }
    });
    
    // 保存到数据库
    saveProviderConfig(providerId, { apiKey });
    
    eventBus.emit('api:apiKeySet', providerId);
}

export function getApiKey(providerId) {
    const state = store.getState(STORE_KEY);
    return state.apiKeys[providerId] || '';
}

// 保存服务商配置到数据库
async function saveProviderConfig(providerId, config) {
    const key = `api_config_${providerId}`;
    const existing = await database.read('appConfigs', key);
    
    if (existing) {
        await database.update('appConfigs', {
            ...existing,
            ...config,
            updatedAt: new Date().toISOString()
        });
    } else {
        await database.create('appConfigs', {
            id: key,
            providerId,
            ...config,
            createdAt: new Date().toISOString()
        });
    }
}

// ==================== 网络层：重试 + 代理 ====================

export async function fetchWithRetry(url, options = {}, providerId = null) {
    const state = store.getState(STORE_KEY);
    const { timeout, maxRetries, retryDelay, useProxy, proxyUrl } = state.networkConfig;
    
    const provider = providerId ? AI_PROVIDERS[providerId.toUpperCase()] : getCurrentProvider();
    
    // 构建最终 URL（代理模式）
    let finalUrl = url;
    if (useProxy && proxyUrl) {
        finalUrl = `${proxyUrl}/${url.replace(provider.baseUrl, '')}`;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(finalUrl, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // 成功响应
            if (response.ok) {
                eventBus.emit('api:requestSuccess', { provider: provider.id, url });
                return response;
            }
            
            // HTTP 错误处理
            const errorData = await response.json().catch(() => ({}));
            
            switch (response.status) {
                case 401:
                    throw new ApiError('API Key 无效或已过期', 'INVALID_API_KEY', 401, errorData);
                case 402:
                    throw new ApiError('余额不足，请充值', 'INSUFFICIENT_BALANCE', 402, errorData);
                case 403:
                    throw new ApiError('权限不足', 'FORBIDDEN', 403, errorData);
                case 429:
                    throw new ApiError('请求频率超限，请稍后再试', 'RATE_LIMITED', 429, errorData);
                case 500:
                case 502:
                case 503:
                case 504:
                    // 服务器错误，可以重试
                    if (attempt < maxRetries) {
                        await delay(retryDelay * attempt);
                        continue;
                    }
                    throw new ApiError('服务器暂时不可用', 'SERVER_ERROR', response.status, errorData);
                default:
                    throw new ApiError(`请求失败: ${response.status}`, 'HTTP_ERROR', response.status, errorData);
            }
            
        } catch (error) {
            lastError = error;
            
            // 网络错误判断
            if (error.name === 'AbortError') {
                throw new ApiError('请求超时，请检查网络', 'TIMEOUT', 0, { url });
            }
            
            if (error.message.includes('Failed to fetch') || 
                error.message.includes('NetworkError')) {
                // 网络错误，可以重试
                if (attempt < maxRetries) {
                    eventBus.emit('api:networkRetry', { attempt, maxRetries });
                    await delay(retryDelay * attempt);
                    continue;
                }
                throw new ApiError('网络连接失败，请检查网络设置', 'NETWORK_FAILED', 0, { url });
            }
            
            if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
                throw new ApiError('跨域请求被阻止，请使用代理', 'CORS_BLOCKED', 0, { url });
            }
            
            // 其他错误不重试
            if (error instanceof ApiError) {
                throw error;
            }
            
            throw new ApiError(error.message, 'UNKNOWN_ERROR', 0, { originalError: error });
        }
    }
    
    throw lastError;
}

// 自定义 API 错误类
class ApiError extends Error {
    constructor(message, code, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== 余额查询 ====================

export async function checkBalance(providerId = null) {
    const provider = providerId ? AI_PROVIDERS[providerId.toUpperCase()] : getCurrentProvider();
    const apiKey = getApiKey(provider.id);
    
    if (!apiKey) {
        throw new ApiError('请先配置 API Key', 'NO_API_KEY', 0);
    }
    
    try {
        // 注意：不同服务商的余额查询接口不同，这里需要根据实际调整
        const balanceUrl = provider.id === 'deepseek' 
            ? `${provider.baseUrl}/user/balance`
            : `${provider.baseUrl}/dashboard/billing/credit_grants`;
        
        const response = await fetchWithRetry(balanceUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        }, provider.id);
        
        const data = await response.json();
        
        // 解析余额（不同服务商返回格式不同）
        let balance = 0;
        if (provider.id === 'deepseek') {
            balance = data.balance || data.data?.balance || 0;
        } else {
            balance = data.total_available || data.total_granted || 0;
        }
        
        // 更新状态
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, {
            ...state,
            balances: {
                ...state.balances,
                [provider.id]: balance
            }
        });
        
        eventBus.emit('api:balanceUpdated', { provider: provider.id, balance });
        return balance;
        
    } catch (error) {
        console.warn(`[ApiGateway] 查询 ${provider.name} 余额失败:`, error.message);
        // 余额查询失败不阻断，返回 null
        return null;
    }
}

// ==================== 充值功能 ====================

export function getRechargeUrl(providerId = null) {
    const provider = providerId ? AI_PROVIDERS[providerId.toUpperCase()] : getCurrentProvider();
    return provider.rechargeUrl;
}

export function openRechargePage(providerId = null) {
    const provider = providerId ? AI_PROVIDERS[providerId.toUpperCase()] : getCurrentProvider();
    
    // 在新窗口打开充值页面
    window.open(provider.rechargeUrl, '_blank');
    
    eventBus.emit('api:rechargePageOpened', provider.id);
}

// 充值后刷新余额
export async function refreshBalanceAfterRecharge(providerId = null) {
    // 等待充值系统同步
    await delay(2000);
    return await checkBalance(providerId);
}

// ==================== 消费统计 ====================

export async function recordUsage(providerId, model, tokens, cost) {
    const record = {
        id: `usage_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        providerId,
        model,
        promptTokens: tokens.prompt || 0,
        completionTokens: tokens.completion || 0,
        totalTokens: tokens.total || 0,
        cost: cost || 0,
        timestamp: new Date().toISOString()
    };
    
    await database.create('apiUsageRecords', record);
    
    // 更新统计
    const state = store.getState(STORE_KEY);
    const today = new Date().toISOString().split('T')[0];
    const todayKey = `${providerId}_${today}`;
    
    if (!state.usageStats[todayKey]) {
        state.usageStats[todayKey] = { tokens: 0, cost: 0, requests: 0 };
    }
    
    state.usageStats[todayKey].tokens += tokens.total || 0;
    state.usageStats[todayKey].cost += cost || 0;
    state.usageStats[todayKey].requests += 1;
    
    store.setState(STORE_KEY, { ...state });
    eventBus.emit('api:usageRecorded', record);
}

// ==================== 网络配置 ====================

export function setNetworkConfig(config) {
    const state = store.getState(STORE_KEY);
    store.setState(STORE_KEY, {
        ...state,
        networkConfig: {
            ...state.networkConfig,
            ...config
        }
    });
    
    eventBus.emit('api:networkConfigUpdated', config);
}

// 网络诊断
export async function runNetworkDiagnostics() {
    const results = {
        internet: navigator.onLine,
        dns: false,
        cors: false,
        latency: 0,
        providers: {}
    };
    
    // 测试 DNS 和延迟
    const startTime = Date.now();
    try {
        await fetch('https://1.1.1.1', { method: 'HEAD', mode: 'no-cors' });
        results.dns = true;
        results.latency = Date.now() - startTime;
    } catch (e) {
        // 忽略
    }
    
    // 测试各服务商连通性
    for (const provider of Object.values(AI_PROVIDERS)) {
        try {
            const response = await fetch(provider.baseUrl, { 
                method: 'HEAD',
                mode: 'no-cors'
            });
            results.providers[provider.id] = true;
        } catch (e) {
            results.providers[provider.id] = false;
        }
    }
    
    return results;
}

// ==================== 导出 ====================

const apiGateway = {
    PROVIDERS: AI_PROVIDERS,
    init: initApiGateway,
    setCurrentProvider,
    getCurrentProvider,
    setApiKey,
    getApiKey,
    fetch: fetchWithRetry,
    checkBalance,
    getRechargeUrl,
    openRechargePage,
    refreshBalanceAfterRecharge,
    recordUsage,
    setNetworkConfig,
    runNetworkDiagnostics
};

export default apiGateway;

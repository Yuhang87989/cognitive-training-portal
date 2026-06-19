/* DeepSeek AI 数据库模块
 * 管理对话历史、上下文、提示词模板、API 配置等
 */

import { database } from './index.js';
import { eventBus } from '../event-bus.js';

// 对话会话数据库
export const conversationDB = {
    async create(userId, title = '新对话') {
        const conversation = {
            id: `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            userId,
            title,
            mode: 'fast', // fast, expert, creative
            messages: [],
            context: {
                systemPrompt: '',
                knowledgeBase: [],
                temperature: 0.7,
                maxTokens: 2000
            },
            tags: [],
            star: false,
            lastMessageAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        eventBus.emit('deepseek:conversationCreated', conversation);
        return await database.create('deepseekConversations', conversation);
    },
    
    async get(conversationId) {
        return await database.read('deepseekConversations', conversationId);
    },
    
    async update(conversationId, updates) {
        const conv = await this.get(conversationId);
        if (!conv) throw new Error('对话不存在');
        
        const updated = {
            ...conv,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        eventBus.emit('deepseek:conversationUpdated', updated);
        return await database.update('deepseekConversations', updated);
    },
    
    async delete(conversationId) {
        eventBus.emit('deepseek:conversationDeleted', conversationId);
        return await database.delete('deepseekConversations', conversationId);
    },
    
    async getByUser(userId) {
        const all = await database.getByIndex('deepseekConversations', 'userId', userId);
        return all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    
    async getRecent(userId, limit = 10) {
        const all = await this.getByUser(userId);
        return all.slice(0, limit);
    },
    
    // 添加消息
    async addMessage(conversationId, message) {
        const conv = await this.get(conversationId);
        if (!conv) throw new Error('对话不存在');
        
        const newMessage = {
            id: `msg_${Date.now()}`,
            role: message.role, // user, assistant, system
            content: message.content,
            timestamp: new Date().toISOString(),
            tokens: message.tokens || 0,
            model: message.model || '',
            metadata: message.metadata || {}
        };
        
        conv.messages.push(newMessage);
        conv.lastMessageAt = newMessage.timestamp;
        conv.updatedAt = new Date().toISOString();
        
        // 自动更新标题（首条用户消息）
        if (conv.messages.filter(m => m.role === 'user').length === 1) {
            conv.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }
        
        eventBus.emit('deepseek:messageAdded', { conversationId, message: newMessage });
        return await database.update('deepseekConversations', conv);
    },
    
    // 获取消息历史
    async getMessages(conversationId) {
        const conv = await this.get(conversationId);
        return conv ? conv.messages : [];
    },
    
    // 获取对话上下文（用于 API 调用）
    async getContext(conversationId) {
        const conv = await this.get(conversationId);
        if (!conv) return [];
        
        // 返回最近 N 条消息作为上下文
        const contextMessages = conv.messages.slice(-20);
        return contextMessages.map(m => ({
            role: m.role,
            content: m.content
        }));
    },
    
    // 清空对话消息
    async clearMessages(conversationId) {
        const conv = await this.get(conversationId);
        if (!conv) throw new Error('对话不存在');
        
        conv.messages = [];
        conv.lastMessageAt = null;
        conv.updatedAt = new Date().toISOString();
        
        return await database.update('deepseekConversations', conv);
    },
    
    // 统计
    async getStats(userId) {
        const all = await this.getByUser(userId);
        const totalMessages = all.reduce((sum, conv) => sum + conv.messages.length, 0);
        const totalTokens = all.reduce((sum, conv) => sum + conv.messages.reduce((s, m) => s + (m.tokens || 0), 0), 0);
        
        return {
            conversations: all.length,
            messages: totalMessages,
            tokens: totalTokens,
            starred: all.filter(c => c.star).length
        };
    }
};

// 提示词模板数据库
export const promptTemplateDB = {
    async create(templateData) {
        const template = {
            id: templateData.id || `prompt_${Date.now()}`,
            name: templateData.name || '',
            category: templateData.category || 'general', // study, creative, code, etc.
            prompt: templateData.prompt || '',
            description: templateData.description || '',
            variables: templateData.variables || [],
            tags: templateData.tags || [],
            isSystem: templateData.isSystem || false,
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('deepseekPrompts', template);
    },
    
    async get(templateId) {
        return await database.read('deepseekPrompts', templateId);
    },
    
    async update(templateId, updates) {
        const template = await this.get(templateId);
        if (!template) throw new Error('模板不存在');
        
        const updated = {
            ...template,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('deepseekPrompts', updated);
    },
    
    async delete(templateId) {
        return await database.delete('deepseekPrompts', templateId);
    },
    
    async getAll() {
        return await database.getAll('deepseekPrompts');
    },
    
    async getByCategory(category) {
        return await database.getByIndex('deepseekPrompts', 'category', category);
    },
    
    // 增加使用次数
    async incrementUsage(templateId) {
        const template = await this.get(templateId);
        if (!template) return;
        
        template.usageCount += 1;
        return await database.update('deepseekPrompts', template);
    },
    
    // 渲染模板（替换变量）
    async render(templateId, variables = {}) {
        const template = await this.get(templateId);
        if (!template) return '';
        
        let result = template.prompt;
        Object.entries(variables).forEach(([key, value]) => {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        
        return result;
    }
};

// API 配置数据库
export const apiConfigDB = {
    async get(userId = 'default') {
        const configs = await database.getByIndex('deepseekConfig', 'userId', userId);
        if (configs.length > 0) return configs[0];
        
        // 返回默认配置
        return {
            id: `config_${userId}`,
            userId,
            apiKey: '',
            baseUrl: 'https://api.deepseek.com',
            defaultModel: 'deepseek-chat',
            defaultTemperature: 0.7,
            defaultMaxTokens: 2000,
            autoSave: true,
            showTokenCount: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    },
    
    async save(userId, configData) {
        const existing = await this.get(userId);
        
        const config = {
            ...existing,
            ...configData,
            userId,
            updatedAt: new Date().toISOString()
        };
        
        if (existing.id) {
            return await database.update('deepseekConfig', config);
        } else {
            return await database.create('deepseekConfig', config);
        }
    },
    
    async clearApiKey(userId) {
        const config = await this.get(userId);
        if (config.id) {
            config.apiKey = '';
            return await database.update('deepseekConfig', config);
        }
    }
};

// 使用统计数据库
export const usageStatsDB = {
    async record(userId, usageData) {
        const record = {
            userId,
            model: usageData.model || 'deepseek-chat',
            promptTokens: usageData.promptTokens || 0,
            completionTokens: usageData.completionTokens || 0,
            totalTokens: usageData.totalTokens || 0,
            conversationId: usageData.conversationId || '',
            endpoint: usageData.endpoint || '',
            responseTime: usageData.responseTime || 0,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        
        return await database.create('deepseekUsage', record);
    },
    
    async getByUser(userId, days = 30) {
        const all = await database.getByIndex('deepseekUsage', 'userId', userId);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        
        return all.filter(r => r.date >= cutoffStr);
    },
    
    async getSummary(userId, days = 30) {
        const records = await this.getByUser(userId, days);
        const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0);
        const totalRequests = records.length;
        const avgResponseTime = totalRequests > 0 
            ? records.reduce((sum, r) => sum + r.responseTime, 0) / totalRequests 
            : 0;
        
        // 按日期统计
        const byDate = {};
        records.forEach(r => {
            if (!byDate[r.date]) {
                byDate[r.date] = { tokens: 0, requests: 0 };
            }
            byDate[r.date].tokens += r.totalTokens;
            byDate[r.date].requests += 1;
        });
        
        return {
            totalTokens,
            totalRequests,
            avgResponseTime: Math.round(avgResponseTime),
            byDate
        };
    }
};

// 知识库数据库（RAG）
export const knowledgeBaseDB = {
    async create(kbData) {
        const kb = {
            id: kbData.id || `kb_${Date.now()}`,
            userId: kbData.userId || 'default',
            name: kbData.name || '新知识库',
            description: kbData.description || '',
            documents: [],
            tags: kbData.tags || [],
            isPublic: kbData.isPublic || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('deepseekKnowledge', kb);
    },
    
    async get(kbId) {
        return await database.read('deepseekKnowledge', kbId);
    },
    
    async addDocument(kbId, document) {
        const kb = await this.get(kbId);
        if (!kb) throw new Error('知识库不存在');
        
        const newDoc = {
            id: `doc_${Date.now()}`,
            title: document.title || '',
            content: document.content || '',
            source: document.source || '',
            chunks: [], // 用于 RAG 的分块
            embedding: null,
            addedAt: new Date().toISOString()
        };
        
        kb.documents.push(newDoc);
        kb.updatedAt = new Date().toISOString();
        
        return await database.update('deepseekKnowledge', kb);
    },
    
    async getByUser(userId) {
        return await database.getByIndex('deepseekKnowledge', 'userId', userId);
    },
    
    // 语义搜索（简单版）
    async search(kbId, query, limit = 5) {
        const kb = await this.get(kbId);
        if (!kb) return [];
        
        // 简单关键词匹配（实际应使用向量相似度）
        const keywords = query.toLowerCase().split(/\s+/);
        const results = kb.documents.map(doc => {
            const score = keywords.reduce((s, kw) => 
                s + (doc.content.toLowerCase().includes(kw) ? 1 : 0), 0);
            return { ...doc, score };
        });
        
        return results
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
};

export default {
    conversation: conversationDB,
    promptTemplate: promptTemplateDB,
    apiConfig: apiConfigDB,
    usageStats: usageStatsDB,
    knowledgeBase: knowledgeBaseDB
};

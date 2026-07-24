/* 设置模块 - ES6 Modules 标准
 * 管理应用所有配置项：界面设置、数据管理、关于信息等
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

// 设置存储键
const STORAGE_KEY = 'app_settings';

// 默认设置配置
const DEFAULT_SETTINGS = {
    // 界面设置
    theme: 'default',
    language: 'zh-CN',
    fontSize: 'medium',
    animationEnabled: true,
    soundEnabled: false,
    
    // 训练设置
    autoNextQuestion: true,
    showHint: true,
    pomodoroDuration: 25,
    breakDuration: 5,
    
    // 数据设置
    autoBackup: true,
    cloudSync: false,
    
    // 通知设置
    reminderEnabled: true,
    reminderTime: '09:00',
    
    // 高级设置
    developerMode: false,
    debugMode: false
};

// 主题配置
const THEMES = {
    default: {
        name: '默认主题',
        primary: '#667eea',
        secondary: '#764ba2',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    ocean: {
        name: '海洋蓝',
        primary: '#00c6fb',
        secondary: '#005bea',
        background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)'
    },
    sunset: {
        name: '日落橙',
        primary: '#fa709a',
        secondary: '#fee140',
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    forest: {
        name: '森林绿',
        primary: '#43e97b',
        secondary: '#38f9d7',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    dark: {
        name: '暗黑模式',
        primary: '#434343',
        secondary: '#000000',
        background: 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    }
};

// 字体大小配置
const FONT_SIZES = {
    small: { name: '小', multiplier: 0.9 },
    medium: { name: '中', multiplier: 1.0 },
    large: { name: '大', multiplier: 1.1 }
};

// 初始化设置模块
export function initSettings() {
    // 从存储加载设置
    const savedSettings = storage.get(STORAGE_KEY, {});
    const settings = { ...DEFAULT_SETTINGS, ...savedSettings };
    
    // 初始化 store
    store.setState('settings', settings);
    
    // 应用主题
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
    
    console.log('[Settings] 设置模块初始化完成');
    eventBus.emit('module:ready', 'settings');
}

// 获取设置
export function getSettings() {
    return store.getState('settings');
}

// 更新设置
export function updateSetting(key, value) {
    const settings = { ...getSettings() };
    settings[key] = value;
    
    // 保存到存储
    storage.set(STORAGE_KEY, settings);
    
    // 更新 store
    store.setState('settings', settings);
    
    // 应用设置效果
    applySettingEffect(key, value);
    
    // 广播变化
    eventBus.emit('settings:changed', { key, value });
    
    console.log(`[Settings] 设置已更新: ${key} = ${value}`);
    return settings;
}

// 批量更新设置
export function updateSettings(newSettings) {
    const settings = { ...getSettings(), ...newSettings };
    
    storage.set(STORAGE_KEY, settings);
    store.setState('settings', settings);
    
    // 应用所有变化的设置
    Object.keys(newSettings).forEach(key => {
        applySettingEffect(key, newSettings[key]);
    });
    
    eventBus.emit('settings:batchChanged', newSettings);
    return settings;
}

// 应用设置效果
function applySettingEffect(key, value) {
    switch (key) {
        case 'theme':
            applyTheme(value);
            break;
        case 'fontSize':
            applyFontSize(value);
            break;
        case 'animationEnabled':
            document.body.style.setProperty('--animation-enabled', value ? '1' : '0');
            break;
    }
}

// 应用主题
function applyTheme(themeName) {
    const theme = THEMES[themeName] || THEMES.default;
    
    // 更新 CSS 变量
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    
    // 更新背景（如果在设置页面）
    const body = document.body;
    if (body.classList.contains('settings-page')) {
        body.style.background = theme.background;
    }
    
    eventBus.emit('settings:themeChanged', theme);
}

// 应用字体大小
function applyFontSize(sizeName) {
    const size = FONT_SIZES[sizeName] || FONT_SIZES.medIUM;
    document.documentElement.style.setProperty('--font-multiplier', size.multiplier);
    eventBus.emit('settings:fontSizeChanged', size);
}

// 重置为默认设置
export function resetToDefaults() {
    storage.set(STORAGE_KEY, { ...DEFAULT_SETTINGS });
    store.setState('settings', { ...DEFAULT_SETTINGS });
    
    // 重新应用所有默认设置
    applyTheme(DEFAULT_SETTINGS.theme);
    applyFontSize(DEFAULT_SETTINGS.fontSize);
    
    eventBus.emit('settings:reset');
    showToast('已恢复默认设置');
    return { ...DEFAULT_SETTINGS };
}

// 导出所有数据
export function exportAllData() {
    const data = {
        settings: getSettings(),
        user: store.getState('user'),
        trainingProgress: storage.get('training_progress', {}),
        gameProgress: storage.get('training_game', {}),
        wrongBook: storage.get('wrong_book', []),
        exportTime: new Date().toISOString(),
        version: '1.0.0'
    };
    
    // 转换为 JSON 并下载
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `认知训练门户_备份_${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('数据导出成功！');
    eventBus.emit('settings:dataExported');
    return data;
}

// 导入数据
export function importData(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        // 验证数据格式
        if (!data.version || !data.exportTime) {
            throw new Error('无效的数据文件格式');
        }
        
        // 导入设置
        if (data.settings) {
            updateSettings(data.settings);
        }
        
        // 导入用户数据
        if (data.user) {
            storage.set('user_data', data.user);
        }
        
        // 导入训练进度
        if (data.trainingProgress) {
            storage.set('training_progress', data.trainingProgress);
        }
        
        // 导入游戏进度
        if (data.gameProgress) {
            storage.set('training_game', data.gameProgress);
        }
        
        // 导入错题本
        if (data.wrongBook) {
            storage.set('wrong_book', data.wrongBook);
        }
        
        showToast('数据导入成功！页面即将刷新');
        eventBus.emit('settings:dataImported');
        
        // 延迟刷新页面
        setTimeout(() => location.reload(), 1500);
        
        return true;
    } catch (error) {
        showToast(`导入失败: ${error.message}`);
        console.error('[Settings] 数据导入失败:', error);
        return false;
    }
}

// 清除所有数据
export function clearAllData() {
    if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        return false;
    }
    
    // 清除所有存储数据
    storage.clear();
    
    // 重置为默认设置
    resetToDefaults();
    
    showToast('所有数据已清除！页面即将刷新');
    eventBus.emit('settings:dataCleared');
    
    setTimeout(() => location.reload(), 1500);
    return true;
}

// 获取所有主题列表
export function getThemes() {
    return Object.entries(THEMES).map(([key, theme]) => ({
        id: key,
        name: theme.name,
        primary: theme.primary,
        secondary: theme.secondary
    }));
}

// 获取字体大小列表
export function getFontSizes() {
    return Object.entries(FONT_SIZES).map(([key, size]) => ({
        id: key,
        name: size.name,
        multiplier: size.multiplier
    }));
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hour}${minute}`;
}

// 获取应用信息
export function getAppInfo() {
    return {
        name: '认知训练门户',
        version: '1.0.0',
        buildDate: '2026-05-19',
        architecture: 'ES6 Modules',
        features: [
            '认知训练周计划',
            '训练游戏（问题+同学）',
            '番茄钟专注工具',
            '智能错题本',
            '学霸方法库',
            '思维训练题库'
        ],
        credits: {
            developer: 'AI Assistant',
            framework: '纯原生 ES6 JavaScript',
            storage: 'localStorage + IndexedDB'
        }
    };
}

// 打开调试模式
export function enableDebugMode() {
    updateSetting('debugMode', true);
    updateSetting('developerMode', true);
    showToast('开发者模式已启用！');
    
    // 暴露调试工具到全局
    window.debug = {
        store,
        storage,
        eventBus,
        exportAllData,
        clearAllData,
        getAppInfo
    };
    
    console.log('🔧 调试模式已启用，window.debug 可用');
}

export default {
    init: initSettings,
    getSettings,
    updateSetting,
    updateSettings,
    resetToDefaults,
    exportAllData,
    importData,
    clearAllData,
    getThemes,
    getFontSizes,
    getAppInfo,
    enableDebugMode
};

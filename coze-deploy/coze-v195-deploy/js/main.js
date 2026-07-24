// ============================================================
// ES6 Module 入口文件 - V231
// 认知训练门户ES6改造第四阶段：GitHub Pages子目录部署路径修复
// ============================================================

// V231: 关键修复 - 使用 import.meta.url 获取脚本所在目录
// 动态 import() 是相对于当前URL的，不是相对于脚本位置的
// 部署在子目录时（如 GitHub Pages），需要正确构建模块路径
const SCRIPT_URL = new URL(import.meta.url);
const SCRIPT_DIR = SCRIPT_URL.pathname.substring(0, SCRIPT_URL.pathname.lastIndexOf('/'));

// 构建相对于当前脚本的绝对路径
function resolveModulePath(relativePath) {
    // 去掉开头的 './' 并构建完整路径
    const cleanPath = relativePath.replace(/^\.\//, '');
    return SCRIPT_DIR + '/' + cleanPath;
}

// 导出路径解析函数供其他模块使用
window.resolveModulePath = resolveModulePath;
window.SCRIPT_DIR = SCRIPT_DIR;

console.log('[V231] 脚本目录:', SCRIPT_DIR);

import './config.js';
import './ctm.js';
import './db.js';
import './storage.js';
import './utils.js';
import './user.js';
import './audio.js';
import './modules/ui.js';

// 数据模块 - 这些是配置数据，需要预先加载
import './data/topics.js';
import './data/week-plans.js';
import './data/podcasts.js';
import './data/videos.js';
import './data/games-config.js';

console.log('[ES6 Module] 核心模块 + 数据模块加载完成！');

// ============================================================
// 模块懒加载映射配置 - V231 使用绝对路径修复子目录部署问题
// ============================================================
window.MODULE_LAZY_LOAD_MAP = {
    // 业务模块 - 点击时动态加载
    'practice':   { path: resolveModulePath('./modules/practice.js'),   render: 'renderPractice' },
    'plan':       { path: resolveModulePath('./modules/plan.js'),       render: 'renderPlan' },
    'games':      { path: resolveModulePath('./modules/games.js'),      render: 'renderGames' },
    'deepseek':   { path: resolveModulePath('./modules/deepseek.js'),   render: 'renderDeepseek' },
    'wrongbook':  { path: resolveModulePath('./modules/wrongbook.js'),  render: 'renderWrongbook' },
    'podcast':    { path: resolveModulePath('./modules/podcast.js'),    render: 'renderPodcast' },
    'video':      { path: resolveModulePath('./modules/video.js'),      render: 'renderVideo' },
    'thinking':   { path: resolveModulePath('./modules/thinking.js'),   render: 'renderThinking' },
    'topics':     { path: resolveModulePath('./modules/topics.js'),     render: 'renderTopics' },
    'method':     { path: resolveModulePath('./modules/method.js'),     render: 'renderMethod' },
    'pomodoro':   { path: resolveModulePath('./modules/pomodoro.js'),   render: 'renderPomodoro' },
    'calculator': { path: resolveModulePath('./modules/calculator.js'), render: 'renderCalculator' },
    'notepad':    { path: resolveModulePath('./modules/notepad.js'),    render: 'renderNotepad' },
    'map':        { path: resolveModulePath('./modules/map.js'),        render: 'renderMap' },
    'selfdrive':  { path: resolveModulePath('./modules/self-drive.js'), render: 'renderSelfDrive' },
    'weekly':     { path: resolveModulePath('./modules/stats.js'),      render: 'renderWeeklyReview' },
    'progress':   { path: resolveModulePath('./modules/stats.js'),      render: 'renderProgressChart' },
    'my':         { path: resolveModulePath('./modules/my-page.js'),    render: 'renderMyPage' },
    'usage-stats':{ path: resolveModulePath('./modules/my-page.js'),    render: 'renderUsageStats' },
    'backup':     { path: resolveModulePath('./modules/local-db.js'),   render: 'renderBackupManager' },
    
    // player.js 由其他模块依赖，不单独懒加载
};

// 已加载的模块缓存
window.LOADED_MODULES = new Set();

// 正在加载中的模块Promise缓存（防止重复加载）
window.LOADING_MODULES = new Map();

// ============================================================
// 懒加载核心函数
// ============================================================

/**
 * 动态加载模块
 * @param {string} moduleKey - 模块键名
 * @returns {Promise} 加载完成的Promise
 */
window.lazyLoadModule = async function(moduleKey) {
    const moduleConfig = MODULE_LAZY_LOAD_MAP[moduleKey];
    
    if (!moduleConfig) {
        console.warn(`[LazyLoad] 未找到模块配置: ${moduleKey}`);
        return null;
    }
    
    // 如果模块已加载，直接返回
    if (LOADED_MODULES.has(moduleConfig.path)) {
        console.log(`[LazyLoad] 模块已缓存: ${moduleKey}`);
        return window[moduleConfig.render];
    }
    
    // 如果模块正在加载中，等待Promise完成
    if (LOADING_MODULES.has(moduleConfig.path)) {
        console.log(`[LazyLoad] 模块正在加载中，等待: ${moduleKey}`);
        return LOADING_MODULES.get(moduleConfig.path);
    }
    
    console.log(`[LazyLoad] 开始动态加载: ${moduleKey}`);
    
    // 创建加载Promise并缓存
    const loadPromise = (async () => {
        try {
            // 动态import加载模块
            await import(moduleConfig.path);
            LOADED_MODULES.add(moduleConfig.path);
            console.log(`[LazyLoad] 模块加载完成: ${moduleKey}`);
            return window[moduleConfig.render];
        } catch (error) {
            console.error(`[LazyLoad] 模块加载失败: ${moduleKey}`, error);
            throw error;
        } finally {
            LOADING_MODULES.delete(moduleConfig.path);
        }
    })();
    
    LOADING_MODULES.set(moduleConfig.path, loadPromise);
    return loadPromise;
};

/**
 * 显示模块加载状态
 * @param {HTMLElement} container - 容器元素
 * @param {string} moduleName - 模块名称
 */
window.showModuleLoading = function(container, moduleName) {
    container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:20px;">
            <div style="width:50px;height:50px;border:4px solid #f3f3f3;border-top:4px solid #667eea;border-radius:50%;animation:spin 1s linear infinite;"></div>
            <div style="color:#666;font-size:16px;">正在加载 ${moduleName}...</div>
            <div style="color:#999;font-size:13px;">首次加载可能需要几秒钟</div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
};

// ============================================================
// 空闲时预加载优化 - requestIdleCallback
// ============================================================

// 常用模块预加载列表（按使用频率排序）
const PRELOAD_PRIORITY = [
    'practice',     // AI精准练 - 最常用
    'games',        // 训练游戏 - 常用
    'deepseek',     // AI对话 - 常用
    'wrongbook',    // 错题本 - 常用
    'podcast',      // 播客课堂
    'video',        // 视频课堂
    'thinking',     // 思维训练
    'topics',       // 母题训练
    'method',       // 学习方法
    'pomodoro',     // 番茄钟
    'map',          // 认知地图
    'my',           // 我的页面
];

let preloadIndex = 0;

/**
 * 空闲时预加载模块
 */
function preloadModulesOnIdle() {
    if (typeof requestIdleCallback === 'undefined') {
        // 不支持requestIdleCallback时，使用setTimeout延迟
        setTimeout(preloadNextModule, 3000);
        return;
    }
    
    requestIdleCallback((deadline) => {
        while (deadline.timeRemaining() > 50 && preloadIndex < PRELOAD_PRIORITY.length) {
            const moduleKey = PRELOAD_PRIORITY[preloadIndex];
            // 静默预加载，不等待结果
            lazyLoadModule(moduleKey).catch(() => {});
            preloadIndex++;
        }
        
        // 如果还有模块需要预加载，继续调度
        if (preloadIndex < PRELOAD_PRIORITY.length) {
            setTimeout(preloadModulesOnIdle, 1000);
        }
    }, { timeout: 2000 });
}

// 页面加载完成3秒后开始预加载
window.addEventListener('load', () => {
    setTimeout(preloadModulesOnIdle, 3000);
    console.log('[LazyLoad] 3秒后将在空闲时预加载常用模块');
});

// 标记ES6模块已加载
window.ES6_MODULES_LOADED = true;

// 触发核心模块加载完成事件
if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('es6ModulesLoaded'));
}

console.log('[ES6 Module V229] 动态懒加载系统初始化完成！');

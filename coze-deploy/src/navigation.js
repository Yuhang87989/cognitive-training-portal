/**
 * ES6 标准导航系统
 * 
 * 设计原则：
 * 1. 纯模块设计，不污染全局命名空间
 * 2. import/export 标准语法
 * 3. 单一数据源（Store）
 * 4. 不可变状态（每次更新创建新数组）
 * 5. 统一入口：navigateTo / goBack
 */

import { store } from './store.js';
import { eventBus } from './event-bus.js';

const STORE_KEY = 'navigation';
const MAX_HISTORY_LENGTH = 50;

// 页面名称常量（避免魔法字符串）
export const PAGES = {
    HOME: 'home',
    TRAINING: 'training',
    POMODORO: 'pomodoro',
    DEEPSEEK: 'deepseek',
    WRONG_BOOK: 'wrongbook',
    LIBRARY: 'library',
    METHOD: 'method',
    THINKING: 'thinking',
    SELFDRIVE: 'selfdrive',
    SETTINGS: 'settings'
};

// 页面显示名称
const PAGE_DISPLAY_NAMES = {
    [PAGES.HOME]: '首页',
    [PAGES.TRAINING]: '认知训练',
    [PAGES.POMODORO]: '番茄钟',
    [PAGES.DEEPSEEK]: 'AI 助手',
    [PAGES.WRONG_BOOK]: '错题本',
    [PAGES.LIBRARY]: '学习图书馆',
    [PAGES.METHOD]: '学习方法',
    [PAGES.THINKING]: '思维训练',
    [PAGES.SELFDRIVE]: '自驱力',
    [PAGES.SETTINGS]: '设置'
};

/**
 * 初始化导航系统
 * ES6 标准：导出具名函数，无副作用
 */
export function initNavigation() {
    try {
        store.setState(STORE_KEY, {
        history: [PAGES.HOME],  // 不可变数组，初始栈
        currentPage: PAGES.HOME,
        canGoBack: false,
        params: {}
    });
    
    eventBus.emit('navigation:initialized');
    console.log('[Navigation] ES6 导航系统就绪');
}

/**
 * 导航到指定页面
 * @param {string} pageName - 页面名称（使用 PAGES 常量）
 * @param {object} params - 导航参数
 * 
 * ES6 原则：纯函数，不修改原数组，返回新状态
 */
export function navigateTo(pageName, params = {}) {
    const nav = store.getState(STORE_KEY);
    
    // 避免重复导航
    if (nav.currentPage === pageName) {
        return;
    }
    
    // 创建新数组（不可变原则）
    const newHistory = [...nav.history, pageName];
    
    // 限制长度
    if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift();
    }
    
    try {
        store.setState(STORE_KEY, {
        history: newHistory,
        currentPage: pageName,
        canGoBack: newHistory.length > 1,
        params
    });
    
        eventBus.emit('navigation:changed', { page: pageName, params });
    } catch (error) {
        console.error('[Navigation] 导航失败:', error.message);
        eventBus.emit('navigation:error', { from: getCurrentPage(), to: pageName, error: error.message });
        throw error;
    }
    
    return true;
    eventBus.emit('navigation:changed',  { page: pageName, params });
    console.log(`[Navigation] → ${pageName} (栈深: ${newHistory.length})`);
}

/**
 * 返回上一级（唯一的返回入口）
 * ES6 原则：单一职责，只有这一个方法可以返回
 * 
 * @returns {string|null} 返回的页面名称，无法返回则为 null
 */
export function goBack() {
    const nav = store.getState(STORE_KEY);
    
    if (nav.history.length <= 1) {
        console.warn('[Navigation] 已到根页面，无法继续返回');
        return null;
    }
    
    // 创建新数组（不可变原则）
    const newHistory = nav.history.slice(0, -1);
    const targetPage = newHistory[newHistory.length - 1];
    
    try {
        store.setState(STORE_KEY, {
        history: newHistory,
        currentPage: targetPage,
        canGoBack: newHistory.length > 1,
        params: {}
    });
    
    eventBus.emit('navigation:back', { 
        from: nav.currentPage, 
        to: targetPage 
    });
    
    console.log(`[Navigation] ← 从 ${nav.currentPage} 返回 ${targetPage}`);
    return targetPage;
}

/**
 * 直接返回首页（清空导航栈）
 * 注意：这是特殊操作，日常返回应使用 goBack()
 */
export function goHome() {
    try {
        store.setState(STORE_KEY, {
        history: [PAGES.HOME],
        currentPage: PAGES.HOME,
        canGoBack: false,
        params: {}
    });
    
    eventBus.emit('navigation:home');
    console.log('[Navigation] ⌂ 回到首页');
}

// ========== 只读 Getter 方法（ES6 纯函数） ==========

export function getCurrentPage() {
    const nav = store.getState(STORE_KEY);
    return nav.currentPage;
}

export function canGoBack() {
    const nav = store.getState(STORE_KEY);
    return nav.canGoBack;
}

export function getNavigationParams() {
    const nav = store.getState(STORE_KEY);
    return { ...nav.params };  // 返回副本，避免外部修改
}

export function getHistory() {
    const nav = store.getState(STORE_KEY);
    return [...nav.history];  // 返回副本，不可变原则
}

export function getPageDisplayName(pageName) {
    return PAGE_DISPLAY_NAMES[pageName] || pageName;
}

// ========== UI 渲染辅助方法 ==========

/**
 * 渲染返回按钮
 * ES6 原则：纯渲染函数，不包含业务逻辑
 */
export function renderBackButton() {
    const nav = store.getState(STORE_KEY);
    
    if (!nav.canGoBack) {
        return '';
    }
    
    const previousPage = nav.history[nav.history.length - 2];
    const displayName = getPageDisplayName(previousPage);
    
    return `
        <button 
            type="button"
            class="nav-back-button"
            data-action="go-back"
        >
            <span class="nav-back-icon">←</span>
            <span class="nav-back-text">返回${displayName}</span>
        </button>
    `;
}

/**
 * 渲染关闭按钮（行为和返回按钮一致）
 */
export function renderCloseButton() {
    const nav = store.getState(STORE_KEY);
    
    if (!nav.canGoBack) {
        return '';
    }
    
    return `
        <button 
            type="button"
            class="nav-close-button"
            data-action="go-back"
        >
            <span class="nav-close-icon">✕</span>
            <span class="nav-close-text">关闭</span>
        </button>
    `;
}

/**
 * 渲染面包屑导航
 */
export function renderBreadcrumb() {
    const nav = store.getState(STORE_KEY);
    
    return nav.history.map((page, index) => {
        const isLast = index === nav.history.length - 1;
        const displayName = getPageDisplayName(page);
        
        if (isLast) {
            return `<span class="breadcrumb-current">${displayName}</span>`;
        }
        
        return `
            <span class="breadcrumb-item" data-page="${page}">${displayName}</span>
            <span class="breadcrumb-separator">›</span>
        `;
    }).join('');
}

/**
 * 绑定导航事件（统一事件处理入口）
 * ES6 原则：事件委托，避免大量 inline onclick
 */
export function bindNavigationEvents(container) {
    container.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        
        switch (action) {
            case 'go-back':
                goBack();
                break;
            case 'go-home':
                goHome();
                break;
            case 'navigate':
                navigateTo(target.dataset.page);
                break;
        }
    });
}

// ========== ES6 默认导出 ==========

const navigation = {
    PAGES,
    init: initNavigation,
    navigateTo,
    goBack,
    goHome,
    getCurrentPage,
    canGoBack,
    getParams: getNavigationParams,
    getHistory,
    getPageDisplayName,
    renderBackButton,
    renderCloseButton,
    renderBreadcrumb,
    bindEvents: bindNavigationEvents
};

export default navigation;

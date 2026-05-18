/**
 * UI 模块 - ES6 Modules 版本
 * 负责页面渲染、导航、模态框管理
 */

import { showToast } from '../utils.js';
import { getCurrentUser, getAllUsers, UserModule } from '../user.js';

// ========== 导航系统 ==========

// 页面路由配置
const routes = {
    home: renderHomePage,
    method: renderMethodPage,
    thinking: renderThinkingPage,
    'wrong-book': renderWrongBookPage,
    pomodoro: renderPomodoroPage,
    deepseek: renderDeepSeekPage,
    'self-drive': renderSelfDrivePage,
    growth: renderGrowthPage,
};

// 渲染首页
export function renderHomePage(container) {
    const modules = [
        { id: 'method', icon: '📚', name: '学霸方法', color: '#667eea' },
        { id: 'thinking', icon: '🧠', name: '思维训练', color: '#764ba2' },
        { id: 'wrong-book', icon: '📕', name: '错题本', color: '#ff6b6b' },
        { id: 'pomodoro', icon: '🍅', name: '番茄钟', color: '#FF9A63' },
        { id: 'deepseek', icon: '🤖', name: 'AI 助手', color: '#43E97B' },
        { id: 'self-drive', icon: '🎯', name: '自驱力', color: '#4facfe' },
        { id: 'growth', icon: '📈', name: '成长轨迹', color: '#f6d365' },
    ];
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; font-size: 20px;">👋 你好，${getCurrentUser()?.name || '同学'}！</h2>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                ${modules.map(m => `
                    <div 
                        class="module-card" 
                        data-module="${m.id}"
                        style="background: white; padding: 20px; border-radius: 16px; text-align: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s;"
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';"
                        onmouseout="this.style.transform=''; this.style.boxShadow='';"
                    >
                        <div style="font-size: 36px; margin-bottom: 8px;">${m.icon}</div>
                        <div style="font-size: 14px; font-weight: 500; color: #333;">${m.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定模块卡片点击事件
    container.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            navigateTo(moduleId);
        });
    });
}

// 占位页面渲染函数
function renderMethodPage(container) { renderPlaceholderPage(container, '📚', '学霸方法'); }
function renderThinkingPage(container) { renderPlaceholderPage(container, '🧠', '思维训练'); }
function renderWrongBookPage(container) { renderPlaceholderPage(container, '📕', '错题本'); }
function renderPomodoroPage(container) { renderPlaceholderPage(container, '🍅', '番茄钟'); }
function renderDeepSeekPage(container) { renderPlaceholderPage(container, '🤖', 'AI 助手'); }
function renderSelfDrivePage(container) { renderPlaceholderPage(container, '🎯', '自驱力'); }
function renderGrowthPage(container) { renderPlaceholderPage(container, '📈', '成长轨迹'); }

// 通用占位页面
function renderPlaceholderPage(container, icon, name) {
    container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <button id="back-btn" style="position: absolute; top: 16px; left: 16px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                ← 返回
            </button>
            <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
            <h2 style="margin-bottom: 12px;">${name}</h2>
            <p style="color: #999;">模块开发中，敬请期待...</p>
        </div>
    `;
    
    // 返回按钮
    document.getElementById('back-btn')?.addEventListener('click', () => {
        navigateTo('home');
    });
}

// 页面导航
export function navigateTo(pageId) {
    const container = document.getElementById('app-container') || document.body;
    const renderFn = routes[pageId];
    
    if (renderFn) {
        renderFn(container);
        console.log(`📍 导航到: ${pageId}`);
    } else {
        console.warn(`❌ 未找到页面: ${pageId}`);
        renderHomePage(container);
    }
}

// ========== 模态框系统 ==========

// 打开模态框
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        return true;
    }
    return false;
}

// 关闭模态框
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        return true;
    }
    return false;
}

// ========== 初始化 UI ==========

// 初始化导航事件
function initNavigation() {
    // 头像点击打开用户菜单（兼容旧代码）
    const avatar = document.getElementById('header-avatar');
    if (avatar) {
        avatar.addEventListener('click', () => {
            UserModule.showUserSwitchModal();
        });
    }
    
    console.log('✅ 导航系统初始化完成');
}

// UI 模块初始化
export function initUI() {
    console.log('🎨 初始化 UI 模块...');
    
    initNavigation();
    
    // 渲染首页
    const container = document.getElementById('app-container');
    if (container) {
        renderHomePage(container);
    }
    
    showToast('UI 模块初始化成功！', 1500);
    console.log('✅ UI 模块初始化完成');
}

console.log('✅ ui 模块加载完成');

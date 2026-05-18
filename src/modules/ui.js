/**
 * UI 模块 - ES6 Modules 版本
 * 负责页面渲染、导航、模态框管理
 */

import { showToast } from '../utils.js';
import { getCurrentUser } from '../user.js';
import { renderSelfDrive } from './selfdrive.js';
import { renderDeepSeekPage } from './deepseek.js';
import { renderWrongBookPage } from './wrongbook.js';
import { renderPomodoroPage } from './pomodoro.js';
import { renderMethodPage } from './method.js';

// ========== 导航系统 ==========

// 页面路由配置
const routes = {
    home: renderHomePage,
    method: renderMethodModule,
    thinking: renderThinkingPage,
    wrongbook: renderWrongBookModule,
    pomodoro: renderPomodoroModule,
    deepseek: renderDeepSeekModule,
    selfdrive: renderSelfDrive,
    growth: renderGrowthPage,
};

// 渲染首页
export function renderHomePage(container) {
    const modules = [
        { id: 'method', icon: '📚', name: '学霸方法', color: '#667eea' },
        { id: 'thinking', icon: '🧠', name: '思维训练', color: '#764ba2' },
        { id: 'wrongbook', icon: '📕', name: '错题本', color: '#ff6b6b' },
        { id: 'pomodoro', icon: '🍅', name: '番茄钟', color: '#FF9A63' },
        { id: 'deepseek', icon: '🤖', name: 'AI 助手', color: '#43E97B' },
        { id: 'selfdrive', icon: '🎯', name: '自驱力', color: '#4facfe' },
    ];
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="welcome-section" style="margin-bottom: 20px;">
                <h2 style="font-size: 20px; margin-bottom: 8px;">👋 你好，${getCurrentUser()?.name || '同学'}！</h2>
                <p style="color: #666; font-size: 14px;">今天也要加油哦 ~</p>
            </div>
            
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                ${modules.map(m => `
                    <div 
                        class="module-card" 
                        data-module="${m.id}"
                        style="background: white; padding: 20px; border-radius: 16px; text-align: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s;"
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';"
                        onmouseout="this.style.transform=''; this.style.boxShadow='';">
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
function renderPlaceholderPage(container, icon, name, color) {
    container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <button id="back-btn" style="position: absolute; top: 16px; left: 16px; padding: 8px 16px; background: ${color}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                ← 返回首页
            </button>
            <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
            <h2 style="margin-bottom: 12px; color: ${color};">${name}</h2>
            <p style="color: #999;">模块开发中，敬请期待...</p>
            <button onclick="window.showToast('${name}模块开发中 🚧')" style="margin-top: 20px; padding: 12px 24px; background: ${color}; color: white; border: none; border-radius: 8px; cursor: pointer;">
                点我测试
            </button>
        </div>
    `;
    
    // 返回按钮
    document.getElementById('back-btn')?.addEventListener('click', () => {
        navigateTo('home');
    });
}

function renderMethodModule(container) {
    container.innerHTML = '';
    renderMethodPage(container);
}
function renderThinkingPage(container) { renderPlaceholderPage(container, '🧠', '思维训练', '#764ba2'); }
function renderWrongBookModule(container) {
    container.innerHTML = '';
    renderWrongBookPage(container);
}
function renderPomodoroModule(container) {
    container.innerHTML = '';
    renderPomodoroPage(container);
}
function renderDeepSeekModule(container) {
    container.innerHTML = renderDeepSeekPage();
}
function renderGrowthPage(container) { renderPlaceholderPage(container, '📈', '成长轨迹', '#f6d365'); }

// 页面导航
export function navigateTo(pageId) {
    const container = document.getElementById('app-container') || document.body;
    const renderFn = routes[pageId];
    
    if (renderFn) {
        renderFn(container);
        showToast(`已打开: ${pageId} 模块 ✨`);
        console.log(`📍 导航到: ${pageId}`);
    } else {
        console.warn(`❌ 未找到页面: ${pageId}`);
        showToast('页面开发中... 🚧');
        renderHomePage(container);
    }
}

// ========== 模态框系统 ==========

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        return true;
    }
    return false;
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        return true;
    }
    return false;
}

// ========== 初始化 UI ==========

function initNavigation() {
    const avatar = document.getElementById('header-avatar');
    if (avatar) {
        avatar.addEventListener('click', () => {
            showToast('用户管理功能开发中... 👤');
        });
    }
    
    console.log('✅ 导航系统初始化完成');
}

export function initUI() {
    console.log('🎨 初始化 UI 模块...');
    
    initNavigation();
    
    const container = document.getElementById('app-container');
    if (container) {
        renderHomePage(container);
    }
    
    showToast('UI 模块初始化成功！', 1500);
    console.log('✅ UI 模块初始化完成');
}

console.log('✅ ui 模块加载完成');

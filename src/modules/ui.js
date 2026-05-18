/**
 * UI 模块 - ES6 Modules 版本
 * 负责页面渲染、导航、模态框管理
 */

import { showToast } from '../utils.js';
import { getCurrentUser, UserModule } from '../user.js';
import { renderSelfDrive } from './selfdrive.js';
import { renderDeepSeekPage } from './deepseek.js';
import { renderWrongBookPage } from './wrongbook.js';
import { renderPomodoroPage } from './pomodoro.js';
import { renderMethodPage } from './method.js';
import { renderThinkingPage } from './thinking.js';

// ========== 导航系统 ==========

// 页面路由配置
const routes = {
    home: renderHomePage,
    method: renderMethodModule,
    thinking: renderThinkingModule,
    wrongbook: renderWrongBookModule,
    pomodoro: renderPomodoroModule,
    deepseek: renderDeepSeekModule,
    selfdrive: renderSelfDrive,
    growth: renderGrowthPage,
};

// 渲染首页
export function renderHomePage(container) {
    // 已迁移完成的模块
    const migratedModules = [
        { id: 'method', icon: '📚', name: '学霸方法', color: '#667eea', status: 'done' },
        { id: 'thinking', icon: '🧠', name: '思维训练', color: '#764ba2', status: 'done' },
        { id: 'wrongbook', icon: '📕', name: '错题本', color: '#ff6b6b', status: 'done' },
        { id: 'pomodoro', icon: '🍅', name: '番茄钟', color: '#FF9A63', status: 'done' },
        { id: 'deepseek', icon: '🤖', name: 'AI 助手', color: '#43E97B', status: 'done' },
        { id: 'selfdrive', icon: '🎯', name: '自驱力', color: '#4facfe', status: 'done' },
    ];
    
    // 迁移中的模块 - 全部放开，缺失的渲染函数会显示开发中提示
    const inProgressModules = [
        { id: 'ai', icon: '💡', name: 'AI 工具', color: '#FFD700', status: 'done' },
        { id: 'games', icon: '🎮', name: '游戏化', color: '#FF6B9D', status: 'done' },
        { id: 'plan', icon: '📋', name: '计划', color: '#A855F7', status: 'done' },
        { id: 'practice', icon: '✍️', name: '练习', color: '#06B6D4', status: 'done' },
        { id: 'journal', icon: '📔', name: '日记', color: '#F97316', status: 'done' },
        { id: 'library', icon: '📖', name: '图书馆', color: '#84CC16', status: 'done' },
        { id: 'stats', icon: '📊', name: '统计', color: '#EC4899', status: 'done' },
        { id: 'topics', icon: '🎯', name: '题库', color: '#14B8A6', status: 'done' },
        { id: 'podcast', icon: '🎧', name: '播客', color: '#8B5CF6', status: 'done' },
        { id: 'video', icon: '🎬', name: '视频', color: '#EF4444', status: 'done' },
        { id: 'player', icon: '📱', name: '播放器', color: '#F59E0B', status: 'done' },
        { id: 'map', icon: '🗺️', name: '知识地图', color: '#10B981', status: 'done' },
        { id: 'mindmap', icon: '🌳', name: '思维导图', color: '#3B82F6', status: 'done' },
        { id: 'notepad', icon: '📝', name: '记事本', color: '#6366F1', status: 'done' },
        { id: 'calculator', icon: '🔢', name: '计算器', color: '#8B5CF6', status: 'done' },
        { id: 'mypage', icon: '👤', name: '我的', color: '#EC4899', status: 'done' },
    ];
    
    const allModules = [...migratedModules, ...inProgressModules];
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="welcome-section" style="margin-bottom: 20px;">
                <h2 style="font-size: 20px; margin-bottom: 8px;">👋 你好，${getCurrentUser()?.name || '同学'}！</h2>
                <p style="color: #666; font-size: 14px;">ES6 Modules 版本 - 模块迁移中 🔄</p>
            </div>
            
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                ${allModules.map(m => `
                    <div 
                        class="module-card" 
                        data-module="${m.id}"
                        data-status="${m.status}"
                        style="background: linear-gradient(135deg, ${m.color}, ${m.color}dd); padding: 14px 10px; border-radius: 16px; text-align: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; position: relative; min-height: 90px;"
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
                        onmouseout="this.style.transform=''; this.style.boxShadow='';">
                        ${m.status === 'progress' ? '<span style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.25);color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:500;">迁移中</span>' : ''}
                        <div style="font-size: 28px; margin-bottom: 6px;">${m.icon}</div>
                        <div style="font-size: 13px; font-weight: 600; color: white;">${m.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定模块卡片点击事件
    container.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            const status = card.dataset.status;
            
            if (status === 'progress') {
                showToast('该模块迁移中，敬请期待... 🚧');
                return;
            }
            
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
function renderThinkingModule(container) {
    container.innerHTML = '';
    renderThinkingPage(container);
}
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
        console.warn(`⚠️ 模块正在迁移中，显示占位页面: ${pageId}`);
        // 显示通用占位页面
        renderPlaceholderPage(container, '🚧', pageId + ' 模块', '#667eea');
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
            if (UserModule && UserModule.showUserSwitchModal) {
                UserModule.showUserSwitchModal();
            } else {
                showToast('用户系统加载中... 👤');
            }
        });
    }
    
    // 更新头像显示
    const user = getCurrentUser();
    if (user) {
        const avatarEl = document.getElementById('header-avatar');
        const userNameEl = document.getElementById('user-name-display');
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (userNameEl) userNameEl.textContent = user.name;
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

// 挂载常用函数到 window.App，供 HTML onclick 调用
if (typeof window !== 'undefined') {
    if (!window.App) window.App = {};
    // 同时挂载到两个路径，兼容不同的调用方式
    window.App.ui = {
        goHome: () => navigateTo('home'),
        navigateTo: navigateTo
    };
    window.App.navigateTo = navigateTo;
    window.App.goHome = () => navigateTo('home');
}

console.log('✅ ui 模块加载完成');

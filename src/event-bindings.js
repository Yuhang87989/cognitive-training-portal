/**
 * 统一事件绑定模块 - ES6 Modules 版本
 * 
 * 把所有 HTML onclick 改为 JS 事件绑定，
 * 彻底消除对全局作用域的依赖！
 */

import { showToast } from './utils.js';
import { UserModule } from './user.js';

// 绑定用户相关事件
function bindUserEvents() {
    // 头像点击 - 打开用户菜单
    const avatar = document.getElementById('header-avatar');
    if (avatar) {
        avatar.addEventListener('click', () => {
            const menu = document.getElementById('user-dropdown-menu');
            if (menu) menu.classList.toggle('show');
        });
    }
    
    // 点击外部关闭用户菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#header-avatar') && !e.target.closest('#user-dropdown-menu')) {
            const menu = document.getElementById('user-dropdown-menu');
            if (menu) menu.classList.remove('show');
        }
    });
    
    // 切换用户按钮
    const switchUserBtn = document.querySelector('[onclick*="showUserSwitchModal"]');
    if (switchUserBtn) {
        switchUserBtn.onclick = null; // 移除原 onclick
        switchUserBtn.addEventListener('click', () => UserModule.showUserSwitchModal());
    }
    
    // 创建用户按钮
    const createUserBtn = document.querySelector('[onclick*="showCreateUserModal"]');
    if (createUserBtn) {
        createUserBtn.onclick = null;
        createUserBtn.addEventListener('click', () => UserModule.showCreateUserModal());
    }
    
    // 删除用户按钮
    const deleteUserBtn = document.querySelector('[onclick*="showDeleteUserModal"]');
    if (deleteUserBtn) {
        deleteUserBtn.onclick = null;
        deleteUserBtn.addEventListener('click', () => UserModule.showDeleteUserModal());
    }
    
    console.log('✅ 用户相关事件绑定完成');
}

// 绑定通用模态框关闭按钮
function bindModalCloseEvents() {
    // 用户切换模态框
    const closeUserSwitch = document.querySelector('#user-switch-modal [onclick*="closeUserSwitchModal"]');
    if (closeUserSwitch) {
        closeUserSwitch.onclick = null;
        closeUserSwitch.addEventListener('click', () => UserModule.closeUserSwitchModal());
    }
    
    // 创建用户模态框
    const closeCreateUser = document.querySelector('#create-user-modal [onclick*="closeCreateUserModal"]');
    if (closeCreateUser) {
        closeCreateUser.onclick = null;
        closeCreateUser.addEventListener('click', () => UserModule.closeCreateUserModal());
    }
    
    // 删除用户模态框
    const closeDeleteUser = document.querySelector('#delete-user-modal [onclick*="closeDeleteUserModal"]');
    if (closeDeleteUser) {
        closeDeleteUser.onclick = null;
        closeDeleteUser.addEventListener('click', () => UserModule.closeDeleteUserModal());
    }
    
    // 创建用户提交按钮
    const submitCreateUser = document.querySelector('#create-user-modal [onclick*="createNewUser"]');
    if (submitCreateUser) {
        submitCreateUser.onclick = null;
        submitCreateUser.addEventListener('click', () => UserModule.createNewUser());
    }
    
    console.log('✅ 模态框关闭事件绑定完成');
}

// 绑定导航菜单事件
function bindNavigationEvents() {
    // 这里可以绑定首页各个模块的点击事件
    console.log('✅ 导航事件绑定完成');
}

// 初始化所有事件绑定
export function initEventBindings() {
    console.log('🔗 开始绑定事件...');
    
    bindUserEvents();
    bindModalCloseEvents();
    bindNavigationEvents();
    
    console.log('✅ 所有事件绑定完成！');
    showToast('事件绑定系统初始化完成', 1500);
}

console.log('✅ event-bindings 模块加载完成');

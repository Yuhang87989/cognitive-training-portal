/**
 * ES6 Modules 主入口文件
 * 唯一的 <script type="module"> 入口
 */

console.log('🚀 ES6 Modules 模式启动...');

// ========== 全局错误处理 - 尽早设置 ==========
window.addEventListener('error', (event) => {
    console.error('❌ 全局错误:', event.error);
    const showToast = window.showToast;
    if (showToast) {
        showToast('发生错误: ' + (event.message || '未知错误'), 3000);
    }
    return false;
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ 未处理的 Promise 拒绝:', event.reason);
    const showToast = window.showToast;
    if (showToast) {
        showToast('异步操作失败，请重试', 3000);
    }
});

// 导入核心模块
import * as config from './config.js';
import * as storage from './storage.js';
import * as utils from './utils.js';
import * as db from './db.js';
import { UserModule } from './user.js';

// 导入功能模块
import { initUI, navigateTo } from './modules/ui.js';

// 导入事件绑定模块
import { initEventBindings } from './event-bindings.js';

// ========== 立即挂载全局对象（确保模块初始化时就能访问）==========
// 核心模块
window.Config = config;
window.Storage = storage;
window.Utils = utils;
window.DB = db;
window.UserModule = UserModule;

// 功能模块
window.UI = {
    initUI,
    navigateTo,
};

// 快捷函数（兼容旧代码 onclick 调用）
window.showToast = utils.showToast;
window.loadData = storage.loadData;
window.saveData = storage.saveData;
window.getCurrentUser = storage.getCurrentUser;

// ========== 增强的导航函数 - 包含导航栏状态更新和特殊页面处理 ==========
function enhancedNavigateTo(page) {
    // 更新导航栏状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const targetItem = document.querySelector(`.nav-item[onclick*="${page}"]`);
    if (targetItem) {
        targetItem.classList.add('active');
    }
    
    // 特殊页面处理
    if (page === 'profile') {
        UserModule.showUserSwitchModal();
        return;
    }
    if (page === 'practice') {
        utils.showToast('训练模块开发中... 🚧');
        return;
    }
    
    // 导航到对应页面
    navigateTo(page);
}

// 初始化应用
async function initApp() {
    console.log('📦 初始化应用...');
    
    // 1. 初始化存储
    storage.init();
    
    // 2. 显示当前用户
    const currentUser = storage.getCurrentUser();
    console.log('👤 当前用户:', currentUser?.name || '无');
    
    // 3. 初始化 UI（渲染页面）
    initUI();
    
    // 4. 绑定所有事件（这是关键！替代 HTML onclick）
    initEventBindings();
    
    console.log('✅ ES6 Modules 应用初始化完成！');
    console.log('📦 已加载所有模块: config, utils, storage, db, user, ui, selfdrive, deepseek, wrongbook, pomodoro, method, thinking');
    
    // 显示就绪提示
    setTimeout(() => {
        utils.showToast('🎉 ES6 Modules 版本加载成功！', 3000);
    }, 500);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ========== 继续挂载其他全局函数 ==========
// 兼容底部导航栏的调用路径
if (!window.App) window.App = {};
window.App.navigateTo = enhancedNavigateTo;

// 其他快捷函数
window.switchUser = storage.switchUser;
window.createUser = storage.createUser;
window.deleteUser = UserModule.confirmDeleteUser;
window.quickLogin = UserModule.quickLogin;
window.switchToUser = UserModule.switchToUser;
window.showUserSwitchModal = UserModule.showUserSwitchModal;
window.closeUserSwitchModal = UserModule.closeUserSwitchModal;
window.showCreateUserModal = UserModule.showCreateUserModal;
window.closeCreateUserModal = UserModule.closeCreateUserModal;
window.createNewUser = UserModule.createNewUser;
window.showDeleteUserModal = UserModule.showDeleteUserModal;
window.closeDeleteUserModal = UserModule.closeDeleteUserModal;
window.navigateTo = enhancedNavigateTo;

// 初始化函数
window.initApp = initApp;

console.log('🌍 全局对象已就绪: Config, Storage, Utils, DB, UserModule, UI');
console.log('💡 可在控制台直接调用: UI.navigateTo("deepseek")');
console.log('🔗 事件绑定系统已就绪 - HTML onclick 不再是必须的！');

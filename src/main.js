/**
 * ES6 Modules 主入口文件
 * 唯一的 <script type="module"> 入口
 */

console.log('🚀 ES6 Modules 模式启动...');

// 导入核心模块
import * as config from './config.js';
import * as storage from './storage.js';
import * as utils from './utils.js';
import * as db from './db.js';
import { UserModule } from './user.js';

// 导入事件绑定模块
import { initEventBindings } from './event-bindings.js';

// 导入功能模块（后续添加）
// import * as ui from './modules/ui.js';
// import * as deepseek from './modules/deepseek.js';
// import * as selfdrive from './modules/self-drive.js';

// 初始化应用
async function initApp() {
    console.log('📦 初始化应用...');
    
    // 初始化存储
    storage.init();
    
    // 显示当前用户
    const currentUser = storage.getCurrentUser();
    console.log('👤 当前用户:', currentUser?.name || '无');
    
    // 绑定所有事件（这是关键！替代 HTML onclick）
    initEventBindings();
    
    console.log('✅ ES6 Modules 应用初始化完成！');
    
    // 显示就绪提示
    if (typeof utils.showToast === 'function') {
        utils.showToast('ES6 Modules 加载成功！', 3000);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ========== 导出到全局 ==========
// 注意：这是过渡方案，最终目标是完全通过 JS 绑定事件

// 核心模块
window.Config = config;
window.Storage = storage;
window.Utils = utils;
window.DB = db;
window.UserModule = UserModule;

// 快捷函数（兼容旧代码 onclick 调用）
window.showToast = utils.showToast;
window.loadData = storage.loadData;
window.saveData = storage.saveData;
window.getCurrentUser = storage.getCurrentUser;
window.switchUser = storage.switchUser;
window.createUser = storage.createUser;
window.deleteUser = UserModule.confirmDeleteUser;  // 用带确认的版本
window.quickLogin = UserModule.quickLogin;
window.switchToUser = UserModule.switchToUser;
window.showUserSwitchModal = UserModule.showUserSwitchModal;
window.closeUserSwitchModal = UserModule.closeUserSwitchModal;
window.showCreateUserModal = UserModule.showCreateUserModal;
window.closeCreateUserModal = UserModule.closeCreateUserModal;
window.createNewUser = UserModule.createNewUser;
window.showDeleteUserModal = UserModule.showDeleteUserModal;
window.closeDeleteUserModal = UserModule.closeDeleteUserModal;

// 初始化函数
window.initApp = initApp;

console.log('🌍 全局对象已就绪: Config, Storage, Utils, DB, UserModule');
console.log('💡 可在控制台直接调用: UserModule.showUserSwitchModal()');
console.log('🔗 事件绑定系统已就绪 - HTML onclick 不再是必须的！');

/**
 * 全局对象挂载模块 - 确保所有需要的全局函数都可用
 */

// 先导入所有需要的模块
import * as utils from './utils.js';
import * as storage from './storage.js';
import { UserModule } from './user.js';
import { initUI, navigateTo } from './modules/ui.js';

// 挂载到 window
window.showToast = utils.showToast;
window.loadData = storage.loadData;
window.saveData = storage.saveData;
window.getCurrentUser = storage.getCurrentUser;
window.switchUser = storage.switchUser;
window.createUser = storage.createUser;
window.deleteUser = UserModule.confirmDeleteUser;
window.UserModule = UserModule;
window.UI = { initUI, navigateTo };
if (!window.App) window.App = {};
window.App.navigateTo = navigateTo;
window.App.goHome = () => navigateTo('home');

console.log('✅ 全局对象挂载完成');

export { utils, storage, UserModule, initUI, navigateTo };

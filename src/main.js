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
import * as user from './user.js';

// 导入功能模块
import * as ui from './modules/ui.js';
import * as deepseek from './modules/deepseek.js';
import * as selfdrive from './modules/self-drive.js';

// 初始化应用
async function initApp() {
    console.log('📦 初始化应用...');
    
    // 初始化存储
    storage.init();
    
    // 初始化 UI
    ui.init();
    
    console.log('✅ ES6 Modules 应用初始化完成！');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// 导出到全局（供 HTML onclick 调用，过渡方案）
window.App = {
    config,
    storage,
    utils,
    db,
    user,
    ui,
    deepseek,
    selfdrive,
    init: initApp
};

console.log('🌍 全局对象 window.App 已就绪');

// ============================================================
// ES6 Module 入口文件 - V228
// 认知训练门户ES6改造第二阶段：业务模块迁移（全部完成）
// ============================================================

import './config.js';
import './ctm.js';
import './db.js';
import './storage.js';
import './utils.js';
import './user.js';
import './audio.js';
import './modules/ui.js';

// 业务模块 - 第二阶段迁移
import './modules/practice.js';
import './modules/plan.js';
import './modules/games.js';
import './modules/deepseek.js';
import './modules/wrongbook.js';
import './modules/player.js';

// 业务模块 - 第二阶段第二批迁移
import './modules/pomodoro.js';
import './modules/calculator.js';
import './modules/notepad.js';
import './modules/map.js';
import './modules/self-drive.js';
import './modules/podcast.js';
import './modules/video.js';
import './modules/thinking.js';
import './modules/topics.js';
import './modules/method.js';

// 业务模块 - 第二阶段第三批迁移（最后一批）
import './modules/my-page.js';
import './modules/stats.js';
import './modules/fix_all_deepseek_buttons.js';

// 数据模块
import './data/topics.js';
import './data/week-plans.js';
import './data/podcasts.js';
import './data/videos.js';
import './data/games-config.js';

console.log('[ES6 Module] 核心模块 + 业务模块加载完成！');

// 标记ES6模块已加载
window.ES6_MODULES_LOADED = true;

// 触发核心模块加载完成事件
if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('es6ModulesLoaded'));
}

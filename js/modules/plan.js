// ============================================================
// V354 学习计划模块 - 增加游戏跳转和自动同步
// ============================================================

// 训练开始日期：2026年5月20日
var TRAINING_START_DATE = new Date('2026-05-20');

// V353: 任务类型→游戏/模块映射
var TASK_ACTION_MAP = {
    // 注意力类 → 游戏ID
    'attention_schulte': 'schulte',       // 舒尔特方格
    'attention_visual': 'visual',         // 视觉搜索
    'attention_tap': 'tap',               // 快速点击
    'attention_color': 'color',           // 色彩识别
    'attention_diff': 'diff',             // 找不同
    'attention_tracking': 'attention',    // 注意力追踪
    'attention_stroop': 'stroop',         // Stroop冲突
    // 记忆力类
    'memory_digit': 'digit',              // 数字记忆
    'memory_text': 'text',               // 文字记忆
    'memory_palace': 'palace',            // 记忆宫殿
    'memory_flipcard': 'flipcard',        // 翻牌记忆
    // 思维类
    'thinking_pattern': 'pattern',        // 图案匹配
    'thinking_reason': 'reason',          // 逻辑推理
    'thinking_shape': 'shape',            // 图形推理
    'thinking_classify': 'classify',      // 分类归纳
    'thinking_network': 'network',        // 知识网络
    'thinking_reverse': 'reverse',        // 逆向推理
    'thinking_experiment': 'experiment',   // 实验设计
    // 数理类
    'math_calc': 'math',                  // 数学速算
    'math_numshape': 'numshape',          // 数形结合
    'math_conserve': 'conserve',          // 守恒推理
    'math_space': 'space',               // 空间旋转
    // 其他
    'audio_position': 'audio',            // 听音辨位
    'word_assoc': 'word',                // 词汇联想
    // 娱乐游戏
    'game_snake': 'snake',
    'game_tetris': 'tetris',
    'game_2048': 'g2048',
    'game_whack': 'whack',
    'game_linkup': 'linkup',
    'game_slide': 'slide',
    'game_eliminate': 'eliminate'
};

// V354: 根据任务标题智能匹配游戏（所有类型都先按标题匹配）
window.getTaskAction = function(task) {
    // 1. 如果任务有gameId字段，直接用
    if (task.gameId) return { type: 'game', id: task.gameId };
    
    var title = (task.title || '').toLowerCase();
    var type = task.type || '';
    
    // 2. 所有类型统一按标题关键词匹配游戏（优先级最高）
    if (title.indexOf('舒尔特') >= 0) return { type: 'game', id: 'schulte' };
    if (title.indexOf('视觉') >= 0 && title.indexOf('追踪') >= 0) return { type: 'game', id: 'attention' };
    if (title.indexOf('视觉') >= 0 || title.indexOf('搜索') >= 0) return { type: 'game', id: 'visual' };
    if (title.indexOf('听觉') >= 0 || title.indexOf('声音') >= 0 || title.indexOf('听音') >= 0) return { type: 'game', id: 'audio' };
    if (title.indexOf('数字记忆') >= 0) return { type: 'game', id: 'digit' };
    if (title.indexOf('文字记忆') >= 0 || title.indexOf('词语链') >= 0 || title.indexOf('词语') >= 0) return { type: 'game', id: 'text' };
    if (title.indexOf('图片记忆') >= 0 || title.indexOf('位置记忆') >= 0) return { type: 'game', id: 'flipcard' };
    if (title.indexOf('记忆宫殿') >= 0) return { type: 'game', id: 'palace' };
    if (title.indexOf('图案') >= 0 || title.indexOf('匹配') >= 0 || title.indexOf('配对') >= 0) return { type: 'game', id: 'pattern' };
    if (title.indexOf('逻辑') >= 0 || title.indexOf('推理') >= 0) return { type: 'game', id: 'reason' };
    if (title.indexOf('图形推理') >= 0) return { type: 'game', id: 'shape' };
    if (title.indexOf('速算') >= 0 || title.indexOf('计算') >= 0 || title.indexOf('数学') >= 0) return { type: 'game', id: 'math' };
    if (title.indexOf('空间') >= 0 || title.indexOf('旋转') >= 0) return { type: 'game', id: 'space' };
    if (title.indexOf('词汇') >= 0 || title.indexOf('联想') >= 0) return { type: 'game', id: 'word' };
    if (title.indexOf('分类') >= 0 || title.indexOf('归纳') >= 0) return { type: 'game', id: 'classify' };
    if (title.indexOf('注意') >= 0 || title.indexOf('追踪') >= 0 || title.indexOf('警觉') >= 0) return { type: 'game', id: 'attention' };
    if (title.indexOf('stroop') >= 0 || title.indexOf('冲突') >= 0 || title.indexOf('干扰') >= 0) return { type: 'game', id: 'stroop' };
    if (title.indexOf('数形') >= 0) return { type: 'game', id: 'numshape' };
    if (title.indexOf('守恒') >= 0) return { type: 'game', id: 'conserve' };
    if (title.indexOf('知识网络') >= 0 || title.indexOf('概念图') >= 0 || title.indexOf('思维导图') >= 0) return { type: 'game', id: 'network' };
    if (title.indexOf('逆向') >= 0) return { type: 'game', id: 'reverse' };
    if (title.indexOf('实验') >= 0) return { type: 'game', id: 'experiment' };
    if (title.indexOf('色彩') >= 0 || title.indexOf('辨色') >= 0 || title.indexOf('颜色') >= 0) return { type: 'game', id: 'color' };
    if (title.indexOf('找不同') >= 0 || title.indexOf('对比') >= 0) return { type: 'game', id: 'diff' };
    if (title.indexOf('快速') >= 0 || title.indexOf('反应') >= 0 || title.indexOf('点击') >= 0) return { type: 'game', id: 'tap' };
    if (title.indexOf('翻牌') >= 0) return { type: 'game', id: 'flipcard' };
    if (title.indexOf('故事') >= 0 && title.indexOf('记忆') >= 0) return { type: 'game', id: 'text' };
    if (title.indexOf('策略') >= 0 || title.indexOf('方法') >= 0 || title.indexOf('技巧') >= 0) return { type: 'game', id: 'reason' };
    if (title.indexOf('反思') >= 0 || title.indexOf('评估') >= 0 || title.indexOf('总结') >= 0 || title.indexOf('记录') >= 0 || title.indexOf('撰写') >= 0) return { type: 'module', id: 'notepad' };
    
    // 3. 按type映射默认游戏（标题匹配失败后的兜底）
    if (type === 'attention') return { type: 'game', id: 'attention' };
    if (type === 'memory') return { type: 'game', id: 'digit' };
    if (type === 'practice') return { type: 'game', id: null };
    
    // 4. 只有确实不是游戏训练的type才走模块
    if (type === 'video') return { type: 'module', id: 'video' };
    if (type === 'podcast') return { type: 'module', id: 'podcast' };
    if (type === 'rest' || type === 'social' || type === 'planning') return { type: null, id: null };
    
    return { type: null, id: null };
};

// V353: 从学习计划跳转到游戏/模块
window.goToTraining = function(taskId, gameId, moduleType) {
    if (moduleType === 'game' && gameId) {
        // 记录当前要完成的任务ID，游戏结束后自动标记
        window._pendingPlanTaskId = taskId;
        window._pendingPlanTaskTime = Date.now();
        console.log('[Plan] 跳转到游戏:', gameId, '待完成任务:', taskId);
        // 直接启动游戏
        if (typeof startGame === 'function') {
            startGame(gameId);
        }
    } else if (moduleType === 'module' && gameId) {
        // 跳转到其他模块
        window._pendingPlanTaskId = taskId;
        window._pendingPlanTaskTime = Date.now();
        if (typeof openFullscreenPage === 'function') {
            openFullscreenPage(gameId);
        }
    }
};

window.planState = {
    currentDate: null,
    completedTasks: {},
    customTasks: {}  // 自定义任务：按日期存储 { "2026-05-20": [task1, task2, ...] }
};

window.initPlanState = function() {
    var saved = window.DataSync.get('plan');
    if (!saved) {
        window.planState.currentDate = new Date().toISOString().split('T')[0];
        window.planState.completedTasks = {};
        window.planState.customTasks = {};
    } else {
        window.planState.currentDate = saved.currentDate || new Date().toISOString().split('T')[0];
        window.planState.completedTasks = saved.completedTasks || {};
        window.planState.customTasks = saved.customTasks || {};
    }
    console.log('[Plan] initPlanState:', window.planState.currentDate);
};

window.savePlanState = function() {
    var saved = window.DataSync.get('plan') || {};
    saved.currentDate = window.planState.currentDate;
    saved.completedTasks = window.planState.completedTasks;
    saved.customTasks = window.planState.customTasks;
    window.DataSync.set('plan', saved);
    console.log('[Plan] savePlanState:', window.planState.currentDate);
};

// 根据日期计算对应的Week和Day
window.getWeekDayFromDate = function(dateStr) {
    var targetDate = new Date(dateStr);
    var diffTime = targetDate.getTime() - TRAINING_START_DATE.getTime();
    var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    var totalDays = diffDays + 1;
    var weekNum = Math.ceil(totalDays / 7);
    var dayInWeek = ((totalDays - 1) % 7) + 1;
    return { week: weekNum, day: dayInWeek };
};

window.renderPlan = function(container) {
    console.log('[Plan] renderPlan called');
    window.initPlanState();
    
    var currentDate = new Date(window.planState.currentDate);
    var weekDay = window.getWeekDayFromDate(window.planState.currentDate);
    
    var html = '<div style="padding:20px;background:#f8f9fa;min-height:100vh;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
    html += '<button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>';
    html += '<h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>';
    html += '<div style="width:60px;"></div></div>';
    
    if (typeof window.weekPlans === 'undefined' || !window.weekPlans) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">⏳</div>';
        html += '<div>周计划数据加载中...</div></div></div>';
        container.innerHTML = html;
        return;
    }
    
    var weekKey = 'week' + weekDay.week;
    var currentWeekData = window.weekPlans[weekKey];
    var isInTraining = weekDay.week >= 1 && weekDay.week <= 10 && currentWeekData;
    
    var completedCount = 0;
    var totalCount = 0;
    if (isInTraining && currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    totalCount++;
                    if (window.planState.completedTasks[day.tasks[j].id]) {
                        completedCount++;
                    }
                }
            }
        }
    }
    var progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var dateDisplay = currentDate.getFullYear() + '年' + (currentDate.getMonth() + 1) + '月' + currentDate.getDate() + '日 ' + weekdays[currentDate.getDay()];
    
    html += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
    html += '<span style="font-size:16px;font-weight:bold;">' + dateDisplay + '</span>';
    if (isInTraining) {
        html += '<span style="font-size:14px;">Week' + weekDay.week + ' Day' + weekDay.day + '</span>';
    } else {
        html += '<span style="font-size:14px;">训练周期外</span>';
    }
    html += '</div>';
    
    if (isInTraining) {
        html += '<div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">';
        html += '<div style="background:white;height:100%;width:' + progress + '%;border-radius:4px;"></div></div>';
        html += '<div style="margin-top:8px;font-size:12px;opacity:0.9;">本周已完成 ' + completedCount + ' / ' + totalCount + ' 个任务</div>';
        html += '<div style="margin-top:4px;font-size:11px;opacity:0.7;">' + (currentWeekData.weekDesc || '') + '</div>';
    } else {
        html += '<div style="font-size:12px;opacity:0.9;">该日期不在训练周期内</div>';
        html += '<div style="font-size:11px;opacity:0.7;margin-top:4px;">训练周期：2026年5月20日 - 2026年7月28日</div>';
    }
    html += '</div>';
    
    html += '<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
    html += '<button onclick="changeDate(-1)" style="padding:8px 16px;background:#f0f0f0;border:none;border-radius:8px;font-size:14px;cursor:pointer;">◀ 前一天</button>';
    html += '<div style="text-align:center;"><div style="font-size:15px;font-weight:bold;color:#333;">' + dateDisplay + '</div></div>';
    html += '<button onclick="changeDate(1)" style="padding:8px 16px;background:#f0f0f0;border:none;border-radius:8px;font-size:14px;cursor:pointer;">后一天 ▶</button>';
    html += '</div>';
    
    // 保持原有布局，在周切换按钮后面增加多个自定义按钮
    html += '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;">';
    html += '<button onclick="changeDate(-7)" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">上周</button>';
    html += '<button onclick="goToToday()" style="padding:6px 12px;background:#43e97b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">今天</button>';
    html += '<button onclick="changeDate(7)" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">下周</button>';
    html += '<button onclick="showAddCustomTask()" style="padding:6px 12px;background:#ff9800;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">+ 添加任务</button>';
    html += '<button onclick="showAllCustomTasks()" style="padding:6px 12px;background:#9c27b0;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📋 全部自定义</button>';
    html += '<button onclick="clearCompletedCustom()" style="padding:6px 12px;background:#f44336;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">🧹 清理已完成</button>';
    html += '</div>';
    
    if (isInTraining) {
        var typeIcons = {
            attention:'👁️', memory:'🧠', strategy:'📚', practice:'✏️', creative:'🎨', 
            video:'🎬', podcast:'🎧', game:'🎮', review:'📝', test:'📊', writing:'✍️', 
            rest:'😴', social:'🤝', planning:'📋', quiz:'❓'
        };
        
        if (currentWeekData.days && currentWeekData.days.length > 0) {
            var currentDayData = null;
            for (var i = 0; i < currentWeekData.days.length; i++) {
                if (currentWeekData.days[i].day === weekDay.day) {
                    currentDayData = currentWeekData.days[i];
                    break;
                }
            }
            
            if (currentDayData) {
                html += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
                html += '<h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">🎯 ' + currentDayData.title + '</h4>';
                
                // 原有训练任务
                if (currentDayData.tasks && currentDayData.tasks.length > 0) {
                    for (var j = 0; j < currentDayData.tasks.length; j++) {
                        var task = currentDayData.tasks[j];
                        var done = window.planState.completedTasks[task.id];
                        var icon = typeIcons[task.type] || '📌';
                        
                        // V353: 获取任务对应的训练动作
                        var action = window.getTaskAction(task);
                        var actionBtn = '';
                        if (action.type && action.id) {
                            var actionLabel = action.type === 'game' ? '🎮 去训练' : '📂 去学习';
                            actionBtn = '<button onclick="event.stopPropagation();goToTraining(\'' + task.id + '\',\'' + action.id + '\',\'' + action.type + '\')" style="padding:3px 10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:11px;cursor:pointer;margin-right:6px;white-space:nowrap;">' + actionLabel + '</button>';
                        }
                        
                        html += '<div onclick="toggleTaskComplete(\'' + task.id + '\')" style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;border:2px solid ' + (done ? '#81c784' : '#eee') + ';">';
                        html += '<span style="font-size:18px;margin-right:10px;">' + icon + '</span>';
                        html += '<div style="flex:1;"><div style="font-size:13px;color:#333;text-decoration:' + (done ? 'line-through' : 'none') + ';opacity:' + (done ? '0.6' : '1') + ';">' + task.title + '</div></div>';
                        html += actionBtn;
                        html += '<span style="font-size:16px;">' + (done ? '✅' : '⬜') + '</span>';
                        html += '</div>';
                    }
                }
                
                // 自定义任务（跟在原有任务后面，同一个卡片内）
                var dateKey = window.planState.currentDate;
                var dayCustomTasks = window.planState.customTasks[dateKey] || [];
                for (var k = 0; k < dayCustomTasks.length; k++) {
                    var customTask = dayCustomTasks[k];
                    var customDone = window.planState.completedTasks[customTask.id];
                    var timeDisplay = customTask.time ? '<span style="font-size:11px;color:#999;margin-right:8px;">[' + customTask.time + ']</span>' : '';
                    html += '<div style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (customDone ? '#fff3e0' : '#fafafa') + ';border:2px solid ' + (customDone ? '#ffb74d' : '#eee') + ';">';
                    html += '<span style="font-size:18px;margin-right:10px;cursor:pointer;" onclick="toggleTaskComplete(\'' + customTask.id + '\')">✏️</span>';
                    html += '<div style="flex:1;cursor:pointer;" onclick="toggleTaskComplete(\'' + customTask.id + '\')">';
                    html += '<div style="font-size:13px;color:#333;text-decoration:' + (customDone ? 'line-through' : 'none') + ';opacity:' + (customDone ? '0.6' : '1') + ';">' + timeDisplay + customTask.title + '</div></div>';
                    html += '<button onclick="event.stopPropagation();showEditCustomTask(\'' + customTask.id + '\')" style="padding:4px 8px;background:#2196f3;color:white;border:none;border-radius:4px;font-size:10px;cursor:pointer;margin-right:4px;">编辑</button>';
                    html += '<button onclick="event.stopPropagation();deleteCustomTask(\'' + customTask.id + '\')" style="padding:4px 8px;background:#f44336;color:white;border:none;border-radius:4px;font-size:10px;cursor:pointer;">删除</button>';
                    html += '</div>';
                }
                
                html += '</div>';
            }
        }
    } else {
        html += '<div style="text-align:center;padding:40px;color:#666;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
        html += '<div style="font-size:32px;margin-bottom:12px;">📌</div>';
        html += '<div>该日期不在训练周期内</div>';
        html += '<div style="font-size:12px;margin-top:8px;color:#999;">请选择2026年5月20日 - 2026年7月28日之间的日期</div>';
        html += '</div>';
    }
    
    html += '<div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">';
    html += '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V354 - 学习计划智能跳转训练游戏，游戏完成自动同步</div>';
    html += '</div></div>';
    
    container.innerHTML = html;
    console.log('[Plan] 渲染完成，当前日期:', window.planState.currentDate);
};

window.changeDate = function(days) {
    console.log('[Plan] changeDate called, days:', days);
    var currentDate = new Date(window.planState.currentDate);
    currentDate.setDate(currentDate.getDate() + days);
    window.planState.currentDate = currentDate.toISOString().split('T')[0];
    window.savePlanState();
    var container = document.getElementById('app-container');
    console.log('[Plan] container:', container);
    if (container) {
        window.renderPlan(container);
    } else {
        console.log('[Plan] 找不到app-container');
    }
};

window.goToToday = function() {
    console.log('[Plan] goToToday called');
    window.planState.currentDate = new Date().toISOString().split('T')[0];
    window.savePlanState();
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

window.toggleTaskComplete = function(taskId) {
    console.log('[Plan] toggleTaskComplete called, taskId:', taskId);
    window.planState.completedTasks[taskId] = !window.planState.completedTasks[taskId];
    window.savePlanState();
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

// 显示添加自定义任务弹窗
window.showAddCustomTask = function() {
    var taskTitle = prompt('请输入自定义任务名称：');
    if (!taskTitle || !taskTitle.trim()) {
        return;
    }
    
    var taskTime = prompt('请输入任务时间（可选，如：09:00）：', '');
    window.addCustomTask(taskTitle.trim(), taskTime && taskTime.trim() ? taskTime.trim() : '');
};

// 显示编辑自定义任务弹窗
window.showEditCustomTask = function(taskId) {
    var dateKey = window.planState.currentDate;
    var tasks = window.planState.customTasks[dateKey] || [];
    var task = null;
    
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            task = tasks[i];
            break;
        }
    }
    
    if (!task) {
        alert('找不到该任务');
        return;
    }
    
    var newTitle = prompt('请修改任务名称：', task.title);
    if (newTitle === null || !newTitle.trim()) {
        return;
    }
    
    var newTime = prompt('请修改任务时间：', task.time || '');
    
    task.title = newTitle.trim();
    task.time = newTime && newTime.trim() ? newTime.trim() : '';
    
    window.savePlanState();
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
    alert('任务修改成功！');
};

// 添加自定义任务
window.addCustomTask = function(taskTitle, taskTime) {
    var dateKey = window.planState.currentDate;
    if (!window.planState.customTasks[dateKey]) {
        window.planState.customTasks[dateKey] = [];
    }
    
    var taskId = 'custom_' + dateKey + '_' + Date.now();
    window.planState.customTasks[dateKey].push({
        id: taskId,
        title: taskTitle,
        time: taskTime || '',
        type: 'custom',
        createdAt: new Date().toISOString()
    });
    
    // 按时间排序
    window.planState.customTasks[dateKey].sort(function(a, b) {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });
    
    window.savePlanState();
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
    alert('自定义任务添加成功！');
};

// 删除自定义任务
window.deleteCustomTask = function(taskId) {
    if (!confirm('确定要删除这个自定义任务吗？')) {
        return;
    }
    
    var dateKey = window.planState.currentDate;
    if (window.planState.customTasks[dateKey]) {
        window.planState.customTasks[dateKey] = window.planState.customTasks[dateKey].filter(function(task) {
            return task.id !== taskId;
        });
        
        // 同时删除完成状态
        delete window.planState.completedTasks[taskId];
        
        window.savePlanState();
        var container = document.getElementById('app-container');
        if (container) {
            window.renderPlan(container);
        }
    }
};

// 显示所有自定义任务
window.showAllCustomTasks = function() {
    var allTasks = [];
    var dates = Object.keys(window.planState.customTasks);
    
    if (dates.length === 0) {
        alert('还没有任何自定义任务');
        return;
    }
    
    dates.sort();
    for (var i = 0; i < dates.length; i++) {
        var tasks = window.planState.customTasks[dates[i]];
        for (var j = 0; j < tasks.length; j++) {
            var done = window.planState.completedTasks[tasks[j].id] ? '✅' : '⬜';
            allTasks.push(dates[i] + ' ' + done + ' ' + tasks[j].title);
        }
    }
    
    alert('所有自定义任务：\n\n' + allTasks.join('\n'));
};

// 清理已完成的自定义任务
window.clearCompletedCustom = function() {
    if (!confirm('确定要清理所有已完成的自定义任务吗？')) {
        return;
    }
    
    var dates = Object.keys(window.planState.customTasks);
    for (var i = 0; i < dates.length; i++) {
        window.planState.customTasks[dates[i]] = window.planState.customTasks[dates[i]].filter(function(task) {
            var isDone = window.planState.completedTasks[task.id];
            if (isDone) {
                delete window.planState.completedTasks[task.id];
            }
            return !isDone;
        });
        
        // 如果当天没有任务了，删除这个日期
        if (window.planState.customTasks[dates[i]].length === 0) {
            delete window.planState.customTasks[dates[i]];
        }
    }
    
    window.savePlanState();
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
    alert('已清理完成的自定义任务！');
};

console.log('[V351] 学习计划模块加载完成 - 保持原布局，增加多个自定义按钮');

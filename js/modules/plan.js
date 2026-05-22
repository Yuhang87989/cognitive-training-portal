// ============================================================
// V347 学习计划模块 - 修复切换后不重新渲染问题
// ============================================================

// 训练开始日期：2026年5月20日
var TRAINING_START_DATE = new Date('2026-05-20');

window.planState = {
    currentDate: null,
    completedTasks: {}
};

// 从本地存储读取状态
window.loadPlanState = function() {
    var saved = window.DataSync.get('plan');
    if (!saved) {
        window.planState.currentDate = new Date().toISOString().split('T')[0];
        window.planState.completedTasks = {};
    } else {
        window.planState.currentDate = saved.currentDate || new Date().toISOString().split('T')[0];
        window.planState.completedTasks = saved.completedTasks || {};
    }
};

// 保存状态到本地存储
window.savePlanState = function() {
    var saved = window.DataSync.get('plan') || {};
    saved.currentDate = window.planState.currentDate;
    saved.completedTasks = window.planState.completedTasks;
    window.DataSync.set('plan', saved);
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

window.renderPlan = function() {
    window.loadPlanState();
    
    var container = document.getElementById('app-container');
    if (!container) {
        console.log('[Plan] 找不到app-container');
        return;
    }
    
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
    
    html += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:20px;">';
    html += '<button onclick="changeDate(-7)" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">上周</button>';
    html += '<button onclick="goToToday()" style="padding:6px 12px;background:#43e97b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">今天</button>';
    html += '<button onclick="changeDate(7)" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">下周</button>';
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
                
                if (currentDayData.tasks && currentDayData.tasks.length > 0) {
                    for (var j = 0; j < currentDayData.tasks.length; j++) {
                        var task = currentDayData.tasks[j];
                        var done = window.planState.completedTasks[task.id];
                        var icon = typeIcons[task.type] || '📌';
                        html += '<div onclick="toggleTaskComplete(\'' + task.id + '\')" style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;border:2px solid ' + (done ? '#81c784' : '#eee') + ';">';
                        html += '<span style="font-size:18px;margin-right:10px;">' + icon + '</span>';
                        html += '<div style="flex:1;"><div style="font-size:13px;color:#333;text-decoration:' + (done ? 'line-through' : 'none') + ';opacity:' + (done ? '0.6' : '1') + ';">' + task.title + '</div></div>';
                        html += '<span style="font-size:16px;">' + (done ? '✅' : '⬜') + '</span>';
                        html += '</div>';
                    }
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
    html += '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V347 - 修复切换后不重新渲染问题</div>';
    html += '</div></div>';
    
    container.innerHTML = html;
    console.log('[V347] 渲染完成，当前日期:', window.planState.currentDate);
};

window.changeDate = function(days) {
    window.loadPlanState();
    var currentDate = new Date(window.planState.currentDate);
    currentDate.setDate(currentDate.getDate() + days);
    window.planState.currentDate = currentDate.toISOString().split('T')[0];
    window.savePlanState();
    window.renderPlan();
};

window.goToToday = function() {
    window.loadPlanState();
    window.planState.currentDate = new Date().toISOString().split('T')[0];
    window.savePlanState();
    window.renderPlan();
};

window.toggleTaskComplete = function(taskId) {
    window.loadPlanState();
    window.planState.completedTasks[taskId] = !window.planState.completedTasks[taskId];
    window.savePlanState();
    window.renderPlan();
};

console.log('[V347] 学习计划模块加载完成');

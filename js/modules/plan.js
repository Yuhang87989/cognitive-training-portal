// ============================================================
// V345 学习计划模块 - 真实日历视图
// ============================================================

// 训练开始日期：2026年5月20日
var TRAINING_START_DATE = new Date('2026-05-20');

window.getPlanState = function() {
    var saved = window.DataSync.get('plan');
    if (!saved) {
        return { currentDate: new Date().toISOString().split('T')[0], completedTasks: {} };
    }
    return {
        currentDate: saved.currentDate || new Date().toISOString().split('T')[0],
        completedTasks: saved.completedTasks || {}
    };
};

window.savePlanState = function(state) {
    var saved = window.DataSync.get('plan') || {};
    saved.currentDate = state.currentDate;
    saved.completedTasks = state.completedTasks;
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

window.renderPlan = function(container) {
    var state = window.getPlanState();
    var currentDate = new Date(state.currentDate);
    var weekDay = window.getWeekDayFromDate(state.currentDate);
    
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
    
    if (weekDay.week < 1 || weekDay.week > 10 || !currentWeekData) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">📌</div>';
        html += '<div>该日期不在训练周期内</div>';
        html += '<div style="font-size:12px;margin-top:8px;color:#999;">训练周期：2026年5月20日 - 2026年7月28日</div></div></div>';
        container.innerHTML = html;
        return;
    }
    
    var completedCount = 0;
    var totalCount = 0;
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    totalCount++;
                    if (state.completedTasks[day.tasks[j].id]) {
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
    html += '<span style="font-size:14px;">Week' + weekDay.week + ' Day' + weekDay.day + '</span></div>';
    html += '<div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">';
    html += '<div style="background:white;height:100%;width:' + progress + '%;border-radius:4px;"></div></div>';
    html += '<div style="margin-top:8px;font-size:12px;opacity:0.9;">本周已完成 ' + completedCount + ' / ' + totalCount + ' 个任务</div>';
    html += '<div style="margin-top:4px;font-size:11px;opacity:0.7;">' + (currentWeekData.weekDesc || '') + '</div></div>';
    
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
                    var done = state.completedTasks[task.id];
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
    
    html += '<div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">';
    html += '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V345 - 真实日历视图</div>';
    html += '<div style="font-size:11px;color:#666;text-align:center;margin-top:4px;">训练周期：2026年5月20日 - 2026年7月28日（Week1-Week10）</div>';
    html += '</div></div>';
    
    container.innerHTML = html;
};

window.changeDate = function(days) {
    var state = window.getPlanState();
    var currentDate = new Date(state.currentDate);
    currentDate.setDate(currentDate.getDate() + days);
    state.currentDate = currentDate.toISOString().split('T')[0];
    window.savePlanState(state);
    location.reload();
};

window.goToToday = function() {
    var state = window.getPlanState();
    state.currentDate = new Date().toISOString().split('T')[0];
    window.savePlanState(state);
    location.reload();
};

window.toggleTaskComplete = function(taskId) {
    var state = window.getPlanState();
    state.completedTasks[taskId] = !state.completedTasks[taskId];
    window.savePlanState(state);
    location.reload();
};

console.log('[V345] 学习计划模块加载完成');

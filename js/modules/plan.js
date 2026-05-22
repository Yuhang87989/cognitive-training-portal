// ============================================================
// V344 学习计划模块 - 按周/日切换显示
// ============================================================

window.getPlanState = function() {
    var saved = window.DataSync.get('plan');
    if (!saved) {
        return { currentWeek: 1, currentDay: 1, completedTasks: {} };
    }
    return {
        currentWeek: saved.currentWeek || 1,
        currentDay: saved.currentDay || 1,
        completedTasks: saved.completedTasks || {}
    };
};

window.savePlanState = function(state) {
    var saved = window.DataSync.get('plan') || {};
    saved.currentWeek = state.currentWeek;
    saved.currentDay = state.currentDay;
    saved.completedTasks = state.completedTasks;
    window.DataSync.set('plan', saved);
};

window.renderPlan = function(container) {
    var state = window.getPlanState();
    
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
    
    var weekKey = 'week' + state.currentWeek;
    var currentWeekData = window.weekPlans[weekKey];
    
    if (!currentWeekData) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">❌</div>';
        html += '<div>未找到Week' + state.currentWeek + '数据</div></div></div>';
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
    
    html += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
    html += '<span style="font-size:16px;font-weight:bold;">' + (currentWeekData.weekTitle || weekKey) + '</span>';
    html += '<span style="font-size:24px;font-weight:bold;">' + progress + '%</span></div>';
    html += '<div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">';
    html += '<div style="background:white;height:100%;width:' + progress + '%;border-radius:4px;"></div></div>';
    html += '<div style="margin-top:8px;font-size:12px;opacity:0.9;">已完成 ' + completedCount + ' / ' + totalCount + ' 个任务</div>';
    html += '<div style="margin-top:4px;font-size:11px;opacity:0.7;">' + (currentWeekData.weekDesc || '') + '</div></div>';
    
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
    html += '<div style="width:100%;font-size:13px;font-weight:bold;color:#666;margin-bottom:8px;">选择周</div>';
    for (var w = 1; w <= 10; w++) {
        var wk = 'week' + w;
        var hasData = window.weekPlans[wk] ? true : false;
        var isActive = w === state.currentWeek;
        var bgColor = isActive ? '#667eea' : (hasData ? '#ffffff' : '#f0f0f0');
        var textColor = isActive ? '#ffffff' : (hasData ? '#666666' : '#ccc');
        html += '<button onclick="switchWeek(' + w + ')" style="padding:6px 12px;background:' + bgColor + ';color:' + textColor + ';border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;margin:2px;">Week' + w + '</button>';
    }
    html += '</div>';
    
    var dayCount = currentWeekData.days ? currentWeekData.days.length : 7;
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
    html += '<div style="width:100%;font-size:13px;font-weight:bold;color:#666;margin-bottom:8px;">选择日</div>';
    for (var d = 1; d <= dayCount; d++) {
        var isDayActive = d === state.currentDay;
        var dayBgColor = isDayActive ? '#f093fb' : '#ffffff';
        var dayTextColor = isDayActive ? '#ffffff' : '#666666';
        html += '<button onclick="switchDay(' + d + ')" style="padding:6px 12px;background:' + dayBgColor + ';color:' + dayTextColor + ';border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;margin:2px;">Day' + d + '</button>';
    }
    html += '</div>';
    
    var typeIcons = {
        attention:'👁️', memory:'🧠', strategy:'📚', practice:'✏️', creative:'🎨', 
        video:'🎬', podcast:'🎧', game:'🎮', review:'📝', test:'📊', writing:'✍️', 
        rest:'😴', social:'🤝', planning:'📋', quiz:'❓'
    };
    
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        var currentDayData = null;
        for (var i = 0; i < currentWeekData.days.length; i++) {
            if (currentWeekData.days[i].day === state.currentDay) {
                currentDayData = currentWeekData.days[i];
                break;
            }
        }
        
        if (currentDayData) {
            html += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
            html += '<h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">Day ' + currentDayData.day + '：' + currentDayData.title + '</h4>';
            
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
    html += '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V344 - 按周/日切换显示</div>';
    html += '</div></div>';
    
    container.innerHTML = html;
};

window.switchWeek = function(weekNum) {
    if (weekNum >= 1 && weekNum <= 10) {
        var state = window.getPlanState();
        state.currentWeek = weekNum;
        state.currentDay = 1;
        window.savePlanState(state);
        location.reload();
    }
};

window.switchDay = function(dayNum) {
    var state = window.getPlanState();
    state.currentDay = dayNum;
    window.savePlanState(state);
    location.reload();
};

window.toggleTaskComplete = function(taskId) {
    var state = window.getPlanState();
    state.completedTasks[taskId] = !state.completedTasks[taskId];
    window.savePlanState(state);
    location.reload();
};

console.log('[V344] 学习计划模块加载完成');

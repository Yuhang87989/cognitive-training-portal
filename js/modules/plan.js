// ============================================================
// V337 学习计划模块 - 自动加载Week1-Week7训练数据
// ============================================================

window.planState = {
    currentWeek: 1
};

// 获取用户任务完成状态
window.getUserPlanTasks = function() {
    var savedData = window.DataSync.get('plan');
    return savedData && savedData.completedTasks ? savedData.completedTasks : {};
};

// 保存用户任务完成状态
window.saveUserPlanTasks = function(completedTasks) {
    window.DataSync.set('plan', { 
        completedTasks: completedTasks,
        version: 2 
    });
};

window.renderPlan = function(container) {
    console.log('[V337] renderPlan 被调用');
    
    // 顶部栏
    var html = '<div style="padding:20px;background:#f8f9fa;min-height:100vh;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
    html += '<button onclick="history.back()' style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>';
    html += '<h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>';
    html += '<div style="width:60px;"></div></div>';
    
    // 检查数据
    if (typeof window.weekPlans === 'undefined' || !window.weekPlans) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">⏳</div>';
        html += '<div>周计划数据加载中...</div></div></div>';
        container.innerHTML = html;
        return;
    }
    
    var weekKey = 'week' + window.planState.currentWeek;
    var currentWeekData = window.weekPlans[weekKey];
    
    if (!currentWeekData) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">❌</div>';
        html += '<div>未找到Week' + window.planState.currentWeek + '数据</div></div></div>';
        container.innerHTML = html;
        return;
    }
    
    var completedTasks = window.getUserPlanTasks();
    
    // 计算本周完成统计
    var completedCount = 0;
    var totalCount = 0;
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    totalCount++;
                    if (completedTasks[day.tasks[j].id]) {
                        completedCount++;
                    }
                }
            }
        }
    }
    var progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    // 进度卡片
    html += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
    html += '<span style="font-size:16px;font-weight:bold;">' + (currentWeekData.weekTitle || weekKey) + '</span>';
    html += '<span style="font-size:24px;font-weight:bold;">' + progress + '%</span></div>';
    html += '<div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">';
    html += '<div style="background:white;height:100%;width:' + progress + '%;border-radius:4px;"></div></div>';
    html += '<div style="margin-top:8px;font-size:12px;opacity:0.9;">已完成 ' + completedCount + ' / ' + totalCount + ' 个任务</div>';
    html += '<div style="margin-top:4px;font-size:11px;opacity:0.7;">' + (currentWeekData.weekDesc || '') + '</div></div>';
    
    // 周选择按钮
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
    for (var w = 1; w <= 10; w++) {
        var wk = 'week' + w;
        var hasData = window.weekPlans[wk] ? true : false;
        var isActive = w === window.planState.currentWeek;
        var bgColor = isActive ? '#667eea' : (hasData ? '#ffffff' : '#f0f0f0');
        var textColor = isActive ? '#ffffff' : (hasData ? '#666666' : '#ccc');
        html += '<button onclick='window.switchPlanWeek(' + w + ')' style="padding:6px 12px;background:' + bgColor + ';color:' + textColor + ';border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;margin:2px;">Week' + w + '</button>';
    }
    html += '</div>';
    
    // 类型图标映射
    var typeIcons = {
        attention:'👁️', memory:'🧠', strategy:'📚', practice:'✏️', creative:'🎨', 
        video:'🎬', podcast:'🎧', game:'🎮', review:'📝', test:'📊', writing:'✍️', 
        rest:'😴', social:'🤝', planning:'📋', quiz:'❓'
    };
    
    // 显示每日任务
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            html += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
            html += '<h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">Day ' + day.day + '：' + day.title + '</h4>';
            
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    var task = day.tasks[j];
                    var done = completedTasks[task.id];
                    var icon = typeIcons[task.type] || '📌';
                    
                    html += '<div onclick='window.togglePlanTaskComplete(\'' + task.id + '\')' style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;border:2px solid ' + (done ? '#81c784' : '#eee') + ';">';
                    html += '<span style="font-size:18px;margin-right:10px;">' + icon + '</span>';
                    html += '<div style="flex:1;"><div style="font-size:13px;color:#333;text-decoration:' + (done ? 'line-through' : 'none') + ';opacity:' + (done ? '0.6' : '1') + ';">' + task.title + '</div></div>';
                    html += '<span style="font-size:16px;">' + (done ? '✅' : '⬜') + '</span>';
                    html += '</div>';
                }
            }
            html += '</div>';
        }
    }
    
    // 版本提示
    html += '<div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">';
    html += '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V337 - 学习计划自动加载Week1-Week7训练数据</div>';
    html += '</div></div>';
    
    container.innerHTML = html;
    console.log('[V337] 渲染完成，当前周:', window.planState.currentWeek);
};

// 切换周
window.switchPlanWeek = function(weekNum) {
    if (weekNum >= 1 && weekNum <= 10) {
        window.planState.currentWeek = weekNum;
        var container = document.getElementById('app-container');
        if (container) {
            window.renderPlan(container);
        }
    }
};

// 切换任务完成状态
window.togglePlanTaskComplete = function(taskId) {
    var completedTasks = window.getUserPlanTasks();
    completedTasks[taskId] = !completedTasks[taskId];
    window.saveUserPlanTasks(completedTasks);
    
    // 重新渲染
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

console.log('[V337] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);
console.log('[V337] window.weekPlans:', typeof window.weekPlans);

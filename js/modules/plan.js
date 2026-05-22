// ============================================================
// V330 学习计划模块 - 自动加载Week1-Week10训练数据
// ============================================================

window.planState = {
    currentWeek: 1,
    currentDay: 1
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
    console.log('[Plan] 数据已保存');
};

window.renderPlan = function(container) {
    console.log('[V330] renderPlan 被调用，container:', container);
    
    // 检查周计划数据
    if (typeof weekPlans === 'undefined' || !weekPlans) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;"><div style="font-size:32px;margin-bottom:12px;">⏳</div><div>正在加载周计划数据...</div></div>';
        return;
    }
    
    var completedTasks = window.getUserPlanTasks();
    var weekKey = 'week' + window.planState.currentWeek;
    var currentWeekData = weekPlans[weekKey];
    
    if (!currentWeekData) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;"><div style="font-size:32px;margin-bottom:12px;">❌</div><div>未找到Week' + window.planState.currentWeek + '数据</div></div>';
        return;
    }
    
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
    
    var weekNames = {
        week1: 'Week1：注意力与记忆力基础训练周',
        week2: 'Week2：学霸方法与听课习惯培养周',
        week3: 'Week3：数学物理思维系统化整合入门周',
        week4: 'Week4：解题策略与实验思维深化周',
        week5: 'Week5：系统性思维与守恒思维综合周',
        week6: 'Week6：学科深度整合与自主学习能力培养周',
        week7: 'Week7：元认知深化与综合能力迁移周',
        week8: 'Week8：跨学科综合应用与创新思维周',
        week9: 'Week9：高阶思维与复杂问题解决周',
        week10: 'Week10：认知能力整合与终身学习体系构建周'
    };
    
    var typeIcons = {
        attention:'👁️', memory:'🧠', strategy:'📚', practice:'✏️', creative:'🎨', 
        video:'🎬', podcast:'🎧', game:'🎮', review:'📝', test:'📊', writing:'✍️', 
        rest:'😴', social:'🤝', planning:'📋', quiz:'❓'
    };
    
    var dayNames = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    // 生成周选择按钮HTML
    var weekButtonsHtml = '';
    for (var w = 1; w <= 10; w++) {
        var isActive = w === window.planState.currentWeek;
        var bgColor = isActive ? '#667eea' : '#ffffff';
        var textColor = isActive ? '#ffffff' : '#666666';
        weekButtonsHtml += '<button onclick="window.switchPlanWeek(' + w + ')" style="padding:6px 12px;background:' + bgColor + ';color:' + textColor + ';border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;margin:2px;">Week' + w + '</button>';
    }
    
    // 生成每日任务HTML
    var daysHtml = '';
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            var tasksHtml = '';
            
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    var task = day.tasks[j];
                    var done = completedTasks[task.id];
                    var icon = typeIcons[task.type] || '📌';
                    
                    tasksHtml += '<div onclick="window.togglePlanTaskComplete(\'' + task.id + '\')" style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;border:2px solid ' + (done ? '#81c784' : '#eee') + ';">';
                    tasksHtml += '<span style="font-size:18px;margin-right:10px;">' + icon + '</span>';
                    tasksHtml += '<div style="flex:1;"><div style="font-size:13px;color:#333;text-decoration:' + (done ? 'line-through' : 'none') + ';opacity:' + (done ? '0.6' : '1') + ';">' + task.title + '</div></div>';
                    tasksHtml += '<span style="font-size:16px;">' + (done ? '✅' : '⬜') + '</span>';
                    tasksHtml += '</div>';
                }
            }
            
            daysHtml += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
            daysHtml += '<h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">Day ' + day.day + '：' + day.title + '</h4>';
            daysHtml += tasksHtml;
            daysHtml += '</div>';
        }
    }
    
    container.innerHTML = '<div style="padding:20px;background:#f8f9fa;min-height:100vh;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
            '<button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>' +
            '<h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>' +
            '<div style="width:60px;"></div>' +
        '</div>' +
        
        '<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                '<span style="font-size:16px;font-weight:bold;">' + (weekNames[weekKey] || 'Week' + window.planState.currentWeek) + '</span>' +
                '<span style="font-size:24px;font-weight:bold;">' + progress + '%</span>' +
            '</div>' +
            '<div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">' +
                '<div style="background:white;height:100%;width:' + progress + '%;border-radius:4px;transition:width 0.3s;"></div>' +
            '</div>' +
            '<div style="margin-top:8px;font-size:12px;opacity:0.9;">已完成 ' + completedCount + ' / ' + totalCount + ' 个任务</div>' +
        '</div>' +
        
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">' +
            weekButtonsHtml +
        '</div>' +
        
        daysHtml +
        
        '<div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">' +
            '<div style="font-size:12px;color:#1976d2;text-align:center;">✅ V330 - 学习计划自动加载Week1-Week10训练数据</div>' +
        '</div>' +
    '</div>';
    
    console.log('[V330] 学习计划渲染完成，当前周:', window.planState.currentWeek, '任务数:', totalCount);
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

console.log('[V330] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);

// ============================================================
// V332 学习计划模块 - 简化版，确保能显示内容
// ============================================================

window.planState = {
    currentWeek: 1
};

window.renderPlan = function(container) {
    console.log('[V332] renderPlan 被调用');
    
    // 先显示一个简单的测试内容
    var html = '<div style="padding:20px;background:#f8f9fa;min-height:100vh;">';
    
    // 顶部栏
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">';
    html += '<button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>';
    html += '<h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>';
    html += '<div style="width:60px;"></div></div>';
    
    // 检查数据
    if (typeof window.weekPlans === 'undefined' || !window.weekPlans) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">⏳</div>';
        html += '<div>周计划数据未加载</div>';
        html += '<div style="font-size:12px;margin-top:8px;color:#999;">window.weekPlans = ' + typeof window.weekPlans + '</div>';
        html += '</div></div>';
        container.innerHTML = html;
        return;
    }
    
    var weekKey = 'week' + window.planState.currentWeek;
    var currentWeekData = window.weekPlans[weekKey];
    
    if (!currentWeekData) {
        html += '<div style="text-align:center;padding:40px;color:#666;">';
        html += '<div style="font-size:32px;margin-bottom:12px;">❌</div>';
        html += '<div>未找到' + weekKey + '数据</div>';
        html += '<div style="font-size:12px;margin-top:8px;color:#999;">可用的key: ' + Object.keys(window.weekPlans).join(', ') + '</div>';
        html += '</div></div>';
        container.innerHTML = html;
        return;
    }
    
    // 显示周标题
    html += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">';
    html += '<div style="font-size:16px;font-weight:bold;">' + (currentWeekData.weekTitle || weekKey) + '</div>';
    html += '<div style="font-size:12px;margin-top:8px;opacity:0.9;">' + (currentWeekData.weekDesc || '') + '</div>';
    html += '</div>';
    
    // 周选择按钮
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
    for (var w = 1; w <= 10; w++) {
        var wk = 'week' + w;
        var hasData = window.weekPlans[wk] ? true : false;
        var isActive = w === window.planState.currentWeek;
        var bgColor = isActive ? '#667eea' : (hasData ? '#ffffff' : '#f0f0f0');
        var textColor = isActive ? '#ffffff' : (hasData ? '#666666' : '#ccc');
        html += '<button onclick="window.switchPlanWeek(' + w + ')" style="padding:6px 12px;background:' + bgColor + ';color:' + textColor + ';border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;margin:2px;">Week' + w + (hasData ? '' : '❌') + '</button>';
    }
    html += '</div>';
    
    // 显示每日任务
    if (currentWeekData.days && currentWeekData.days.length > 0) {
        for (var i = 0; i < currentWeekData.days.length; i++) {
            var day = currentWeekData.days[i];
            html += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">';
            html += '<h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">Day ' + day.day + '：' + day.title + '</h4>';
            
            if (day.tasks && day.tasks.length > 0) {
                for (var j = 0; j < day.tasks.length; j++) {
                    var task = day.tasks[j];
                    html += '<div style="padding:10px 12px;margin-bottom:6px;border-radius:10px;background:#fafafa;border:2px solid #eee;">';
                    html += '<span style="font-size:16px;margin-right:10px;">📌</span>';
                    html += '<span style="font-size:13px;color:#333;">' + task.title + '</span>';
                    html += '</div>';
                }
            }
            html += '</div>';
        }
    } else {
        html += '<div style="text-align:center;padding:40px;color:#999;">没有days数据</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    console.log('[V332] 渲染完成，当前周:', window.planState.currentWeek);
};

window.switchPlanWeek = function(weekNum) {
    window.planState.currentWeek = weekNum;
    var container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

console.log('[V332] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);
console.log('[V332] window.weekPlans:', typeof window.weekPlans);

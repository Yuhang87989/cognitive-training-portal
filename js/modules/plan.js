// ====== plan模块 ======
// 版本: V140

CTM.registerModule('plan', {
    name: 'plan',
    icon: '🎯',
    render: renderPlan
});

function renderPlan(container) {
    const user = getCurrentUserData();
    const currentWeek = user.currentWeek || 1;
    const today = new Date().getDay() || 7;
    
    if (!window._planWeek) window._planWeek = currentWeek;
    if (!window._planDay) window._planDay = today;
    
    const plan = getWeekPlan('week' + window._planWeek);
    const userTasks = (user.weekTasks || {});
    
    CTM.triggerHook('beforeRenderPlan', {week: window._planWeek, plan});
    
    // 计算本周完成统计
    let completedCount = 0, totalCount = 0;
    if (plan && plan.days) {
        plan.days.forEach(d => {
            d.tasks.forEach(t => {
                totalCount++;
                if (userTasks[t.id]) completedCount++;
            });
        });
    }
    
    const weekNames = ['','Week1：注意力与记忆力','Week2：学霸方法与听课习惯','Week3：数学物理思维入门','Week4：解题策略与实验思维','Week5：系统性思维与守恒思维','Week6：学科深度整合与自主学习','Week7：元认知深化与能力迁移'];
    
    const typeIcons = {attention:'👁️',memory:'🧠',strategy:'📚',practice:'✏️',creative:'🎨',video:'🎬',podcast:'🎧',game:'🎮',review:'📝',test:'📊',writing:'✍️',rest:'😴',social:'🤝',planning:'📋',quiz:'❓'};
    
    const dayNames = ['','周一','周二','周三','周四','周五','周六','周日'];
    
    let html = '';
    
    // 周次导航
    html += '<div class="card">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
    html += '<span onclick="changeWeek(-1)" style="cursor:pointer;font-size:20px;padding:4px 12px;border-radius:8px;background:#f0f0f0;">◀</span>';
    html += '<div style="text-align:center;"><div style="font-size:16px;font-weight:bold;color:#1A6BFF;">第 ' + window._planWeek + ' 周</div>';
    html += '<div style="font-size:12px;color:#666;margin-top:2px;">' + (weekNames[window._planWeek] || '') + '</div></div>';
    html += '<span onclick="changeWeek(1)" style="cursor:pointer;font-size:20px;padding:4px 12px;border-radius:8px;background:#f0f0f0;">▶</span>';
    html += '</div>';
    
    // 7天日历
    if (plan && plan.days) {
        html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px;">';
        plan.days.forEach(d => {
            const isToday = d.day === window._planDay;
            const dayTasks = d.tasks.length;
            const dayDone = d.tasks.filter(t => userTasks[t.id]).length;
            const dayComplete = dayDone === dayTasks;
            const bgColor = dayComplete ? '#43E97B' : isToday ? '#1A6BFF' : '#f5f5f5';
            const textColor = (dayComplete || isToday) ? 'white' : '#333';
            html += '<div onclick="switchPlanDay(' + d.day + ')" style="text-align:center;padding:8px 2px;border-radius:10px;cursor:pointer;background:' + bgColor + ';color:' + textColor + ';">';
            html += '<div style="font-size:11px;">' + dayNames[d.day] + '</div>';
            html += '<div style="font-size:13px;font-weight:bold;">D' + d.day + '</div>';
            if (dayDone > 0) html += '<div style="font-size:9px;">' + dayDone + '/' + dayTasks + '</div>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // 当日任务
    if (plan && plan.days) {
        const dayData = plan.days.find(d => d.day === window._planDay);
        if (dayData) {
            html += '<div style="margin-bottom:8px;font-size:14px;font-weight:bold;color:#333;">📋 ' + dayData.title + '</div>';
            dayData.tasks.forEach(task => {
                const done = userTasks[task.id];
                const icon = typeIcons[task.type] || '📌';
                html += '<div class="plan-task ' + (done ? 'completed' : '') + '" onclick="toggleWeekTask(\'' + task.id + '\')" style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;">';
                html += '<div class="task-checkbox ' + (done ? 'checked' : '') + '" style="width:22px;height:22px;border-radius:6px;border:2px solid ' + (done ? '#43E97B' : '#ccc') + ';display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;">' + (done ? '✓' : '') + '</div>';
                html += '<div style="flex:1;"><div style="font-size:13px;' + (done ? 'text-decoration:line-through;color:#999;' : '') + '">' + icon + ' ' + task.title + '</div></div>';
                html += '<div style="font-size:11px;color:#999;margin-left:8px;">' + task.duration + '分钟</div>';
                html += '</div>';
            });
        }
    }
    html += '</div>';
    
    // 学习进度
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 学习进度</div>';
    html += '<div style="display:flex;justify-content:space-around;text-align:center;">';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#1A6BFF;">' + completedCount + '</div><div style="font-size:11px;color:#666;">本周完成</div></div>';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#43E97B;">' + (totalCount > 0 ? Math.round(completedCount/totalCount*100) : 0) + '%</div><div style="font-size:11px;color:#666;">完成率</div></div>';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#667eea;">' + (user.streak || 0) + '</div><div style="font-size:11px;color:#666;">连续天数</div></div>';
    html += '</div>';
    html += '</div>';
    
    // 周度描述
    if (plan && plan.weekDesc) {
        html += '<div class="card" style="margin-top:12px;">';
        html += '<div style="font-size:13px;color:#666;line-height:1.6;">💡 ' + plan.weekDesc + '</div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    CTM.triggerHook('afterRenderPlan', {week: window._planWeek});
}

function renderWeekPlan(weekId) {
    const plan = getWeekPlan(weekId);
    if (!plan) return '<div>暂无训练计划</div>';
    let html = '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">' + plan.weekTitle + '</div>';
    html += '<div style="font-size:13px;color:#666;margin-bottom:16px;">' + plan.weekDesc + '</div>';
    plan.days.forEach(day => {
        html += '<div class="card" style="margin-bottom:12px;">';
        html += '<div style="font-weight:600;margin-bottom:10px;">Day' + day.day + '：' + day.title + '</div>';
        day.tasks.forEach(task => {
            const typeIcons = {video:'📹',practice:'✏️',creative:'🎨',social:'💬',review:'📖',test:'📝',writing:'📄',podcast:'🎧',planning:'📋',quiz:'❓',rest:'😴'};
            const typeNames = {video:'视频学习',practice:'练习',creative:'创作',social:'讨论',review:'复习',test:'测试',writing:'写作',podcast:'播客',planning:'计划',quiz:'测评',rest:'休息'};
            html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;">';
            html += '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleWeekTask(\'' + task.id + '\')">';
            html += '<span style="font-size:16px;">' + (typeIcons[task.type] || '📋') + '</span>';
            html += '<div style="flex:1;"><div style="font-size:13px;">' + task.title + '</div>';
            html += '<div style="font-size:11px;color:#999;">' + typeNames[task.type] + (task.duration ? ' · ' + task.duration + '分钟' : '') + '</div></div></div>';
        });
        html += '</div>';
    });
    html += '</div><button class="login-btn login-btn-secondary" onclick="closeDetail()">关闭</button>';
    return html;
}

function renderSlide() {
    const container = document.getElementById('slide-container');
    if(!container) return;
    container.innerHTML = '';
    slideBoard.forEach((num,i) => {
        const x = i%4, y = Math.floor(i/4);
        const cell = document.createElement('div');
        if(num===0) {
            cell.style.cssText = 'width:65px;height:65px;background:#ddd;border-radius:8px;';
        } else {
            cell.style.cssText = 'width:65px;height:65px;background:linear-gradient(135deg,#FB8C00,#FFA726);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:white;cursor:pointer;';
            cell.textContent = num;
            cell.onclick = () => moveSlide(x,y);
        }
        container.appendChild(cell);
    });
}

function changeWeek(dir) {
    CTM.triggerHook('beforeWeekChange', {from: window._planWeek, dir: dir});
    window._planWeek = Math.max(1, Math.min(7, (window._planWeek || 1) + dir));
    window._planDay = 1;
    CTM.triggerHook('afterWeekChange', {to: window._planWeek});
    const el = document.getElementById('module-content');
    if (el) renderPlan(el);
}

function toggleWeekTask(taskId) {
    const user = getCurrentUserData();
    user.weekTasks = user.weekTasks || {};
    user.weekTasks[taskId] = !user.weekTasks[taskId];
    saveUserData(user);
    CTM.triggerHook('onTaskComplete', {taskId: taskId, completed: user.weekTasks[taskId]});
    const el = document.getElementById('module-content');
    if (el) renderPlan(el);
}

window.renderPlan = renderPlan;
window.renderWeekPlan = renderWeekPlan;
window.renderSlide = renderSlide;
window.changeWeek = changeWeek;
window.toggleWeekTask = toggleWeekTask;

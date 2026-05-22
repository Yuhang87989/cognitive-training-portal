// ============================================================
// V297 学习计划模块 - 完善日期切换、数据保存、任务管理
// ============================================================

// ============================================================
// V324 学习计划模块 - 添加周视图，支持Week1-Week10
// ============================================================

window.planState = {
    currentDate: new Date().toISOString().split('T')[0],
    viewMode: 'day', // 'day' 或 'week'
    currentWeek: 'week1'
};

// 切换视图模式
window.switchPlanViewMode = function(mode) {
    window.planState.viewMode = mode;
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

// 切换周
window.switchWeek = function(weekId) {
    window.planState.currentWeek = weekId;
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

window.getPlanTasks = function() {
    const savedData = window.DataSync.get('plan');
    return savedData && savedData.tasks ? savedData.tasks : [];
};

// 保存任务数据
window.savePlanTasks = function(tasks) {
    window.DataSync.set('plan', { 
        tasks: tasks, 
        categories: ['语文', '数学', '英语', '其他'], 
        version: 1 
    });
    console.log('[Plan] 数据已保存');
};

window.renderPlan = function(container) {
    console.log('[V297] renderPlan 被调用，container:', container);
    
    const tasks = window.getPlanTasks();
    const todayTasks = tasks.filter(t => t.date === window.planState.currentDate);
    const completedCount = todayTasks.filter(t => t.completed).length;
    const totalCount = todayTasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    // 格式化日期显示
    const dateObj = new Date(window.planState.currentDate);
    const dateDisplay = dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const isToday = window.planState.currentDate === new Date().toISOString().split('T')[0];
    
    container.innerHTML = `
        <div style="padding:20px;background:#f8f9fa;min-height:100vh;">
            <!-- 顶部栏 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>
                <div style="width:60px;"></div>
            </div>
            
            
            <!-- 视图切换 -->
            <div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;">
                <button onclick="window.switchPlanViewMode('day')" id="view-day-btn" style="padding:8px 16px;background:white;color:#666;border:1px solid #ddd;border-radius:8px;font-size:14px;cursor:pointer;">日视图</button>
                <button onclick="window.switchPlanViewMode('week')" id="view-week-btn" style="padding:8px 16px;background:white;color:#666;border:1px solid #ddd;border-radius:8px;font-size:14px;cursor:pointer;">周视图</button>
            </div>

            <div id="day-view-container">
            <!-- 日期选择 -->
            <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:20px;">
                <button onclick="window.changePlanDate(-1)" style="padding:10px 14px;background:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.05);font-size:16px;">◀</button>
                <div style="text-align:center;">
                    <div style="font-size:16px;font-weight:bold;color:#333;">${dateDisplay}</div>
                    <div style="font-size:12px;color:#666;">${isToday ? '（今天）' : ''}</div>
                </div>
                <button onclick="window.changePlanDate(1)" style="padding:10px 14px;background:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.05);font-size:16px;">▶</button>
            </div>
            
            <!-- 快捷日期选择 -->
            <div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;flex-wrap:wrap;">
                <button onclick="window.goToToday()" style="padding:6px 12px;background:${isToday ? '#667eea' : '#fff'};color:${isToday ? 'white' : '#666'};border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;">今天</button>
                <button onclick="window.changePlanDate(-7)" style="padding:6px 12px;background:#fff;color:#666;border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;">一周前</button>
                <button onclick="window.changePlanDate(7)" style="padding:6px 12px;background:#fff;color:#666;border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;">一周后</button>
            </div>
            
            <!-- 进度卡片 -->
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <span style="font-size:16px;font-weight:bold;">今日完成度</span>
                    <span style="font-size:24px;font-weight:bold;">${progress}%</span>
                </div>
                <div style="background:rgba(255,255,255,0.3);height:8px;border-radius:4px;overflow:hidden;">
                    <div style="background:white;height:100%;width:${progress}%;border-radius:4px;transition:width 0.3s;"></div>
                </div>
                <div style="margin-top:8px;font-size:12px;opacity:0.9;">已完成 ${completedCount} / ${totalCount} 个任务</div>
            </div>
            
            <!-- 任务列表 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">今日任务</h3>
                
                <div id="plan-task-list" style="display:flex;flex-direction:column;gap:12px;">
                    ${todayTasks.length > 0 ? todayTasks.map(task => `
                        <div class="plan-task-item" data-id="${task.id}" style="display:flex;align-items:center;gap:12px;padding:14px;background:${task.completed ? '#e8f5e9' : '#fafafa'};border-radius:12px;border:2px solid ${task.completed ? '#81c784' : '#eee'};cursor:pointer;transition:all 0.2s;" onclick="window.togglePlanTask(${task.id})">
                            <span style="font-size:22px;">${task.icon}</span>
                            <div style="flex:1;">
                                <div style="font-size:15px;color:#333;text-decoration:${task.completed ? 'line-through' : 'none'};opacity:${task.completed ? '0.6' : '1'};">${task.text}</div>
                                <div style="font-size:12px;color:#999;">${task.time}</div>
                            </div>
                            <span style="font-size:20px;">${task.completed ? '✅' : '⬜'}</span>
                        </div>
                    `).join('') : `
                        <div style="text-align:center;padding:40px;color:#999;">
                            <div style="font-size:48px;margin-bottom:12px;">📋</div>
                            <div>今天还没有任务</div>
                            <div style="font-size:13px;margin-top:8px;">点击下方按钮添加新任务</div>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- 添加任务按钮 -->
            <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
                <button onclick="window.addPlanTask()" style="padding:12px 20px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;flex:1;min-width:120px;">➕ 添加新任务</button>
                <button onclick="window.importWeekPlanFromCoze()" style="padding:12px 20px;background:#43e97b;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;flex:1;min-width:120px;">🔗 同步Week计划</button>
                <button onclick="window.clearCompletedTasks()" style="padding:12px 20px;background:#fa709a;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🗑️ 清理已完成</button>
            </div>
            
            <!-- 版本提示 -->
            <div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">
                <div style="font-size:12px;color:#1976d2;text-align:center;">✅ V297 - 学习计划完整功能版 | 数据已同步</div>
            </div>
            </div>
            
            <!-- 周视图容器 -->
            <div id="week-view-container" style="display:none;"></div>
        </div>
    `;
    
    console.log('[V297] 学习计划渲染完成，当前日期:', window.planState.currentDate, '任务数:', todayTasks.length);
    
    // 设置视图按钮样式
    setTimeout(function() {
        const dayBtn = document.getElementById("view-day-btn");
        const weekBtn = document.getElementById("view-week-btn");
        if (dayBtn && weekBtn) {
            if (window.planState.viewMode === "day") {
                dayBtn.style.background = "#667eea";
                dayBtn.style.color = "white";
                weekBtn.style.background = "white";
                weekBtn.style.color = "#666";
            } else {
                dayBtn.style.background = "white";
                dayBtn.style.color = "#666";
                weekBtn.style.background = "#667eea";
                weekBtn.style.color = "white";
            }
        }
        
        // 显示/隐藏视图
        const dayContainer = document.getElementById("day-view-container");
        const weekContainer = document.getElementById("week-view-container");
        if (dayContainer && weekContainer) {
            if (window.planState.viewMode === "day") {
                dayContainer.style.display = "block";
                weekContainer.style.display = "none";
            } else {
                dayContainer.style.display = "none";
                weekContainer.style.display = "block";
                // 渲染周视图
                window.renderWeekView(weekContainer);
            }
        }
    }, 10);
};

// 切换任务完成状态
window.togglePlanTask = function(taskId) {
    const tasks = window.getPlanTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        window.savePlanTasks(tasks);
        
        // 重新渲染
        const container = document.getElementById('app-container');
        if (container) {
            window.renderPlan(container);
        }
    }
};

// 切换日期
window.changePlanDate = function(days) {
    const current = new Date(window.planState.currentDate);
    current.setDate(current.getDate() + days);
    window.planState.currentDate = current.toISOString().split('T')[0];
    
    console.log('[Plan] 切换日期到:', window.planState.currentDate);
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

// 回到今天
window.goToToday = function() {
    window.planState.currentDate = new Date().toISOString().split('T')[0];
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

// 添加新任务
window.addPlanTask = function() {
    const text = prompt('请输入任务名称：', '新任务');
    if (!text) return;
    
    const time = prompt('请输入时间（如：09:00 - 10:00）：', '09:00 - 10:00');
    if (!time) return;
    
    const icons = ['🔤', '🔢', '📖', '📜', '🌍', '🧪', '🎨', '🎵', '⚽', '📝', '💻', '📚'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    
    const tasks = window.getPlanTasks();
    const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
    
    tasks.push({
        id: newId,
        text: text,
        time: time,
        icon: icon,
        completed: false,
        date: window.planState.currentDate
    });
    
    window.savePlanTasks(tasks);
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

// 清理已完成任务
window.clearCompletedTasks = function() {
    const tasks = window.getPlanTasks();
    const todayCompletedTasks = tasks.filter(t => t.date === window.planState.currentDate && t.completed);
    
    if (todayCompletedTasks.length === 0) {
        alert('今天没有已完成的任务需要清理');
        return;
    }
    
    if (confirm(`确定要删除今天已完成的 ${todayCompletedTasks.length} 个任务吗？`)) {
        const newTasks = tasks.filter(t => !(t.date === window.planState.currentDate && t.completed));
        window.savePlanTasks(newTasks);
        
        // 重新渲染
        const container = document.getElementById('app-container');
        if (container) {
            window.renderPlan(container);
        }
    }
};

// 从扣子同步Week学习计划
window.importWeekPlanFromCoze = function() {
    const weekNum = prompt('请输入要同步的周数（1-10）：', '1');
    if (!weekNum || isNaN(weekNum) || weekNum < 1 || weekNum > 10) {
        alert('请输入有效的周数（1-10）');
        return;
    }
    
    if (!confirm(`确定要同步 Week${weekNum} 的学习计划吗？这将添加到当前日期的任务列表中。`)) {
        return;
    }
    
    // 直接打开扣子数据同步页面
    alert('即将跳转到扣子数据同步页面，请选择对应的Week进行同步');
    
    // 跳转到同步页面
    const container = document.getElementById('app-container');
    if (container && typeof window.renderCozeSyncPage === 'function') {
        window.renderCozeSyncPage(container);
    } else {
        alert('请从头像菜单进入扣子数据同步页面');
    }
};
// 渲染周视图
window.renderWeekView = function(container) {
    // 检查周计划数据
    if (typeof weekPlans === "undefined" || !weekPlans) {
        container.innerHTML = "<div style="padding:40px;text-align:center;color:#666;">周计划数据加载中...</div>";
        return;
    }
    
    const weekKeys = Object.keys(weekPlans).sort();
    const currentWeekData = weekPlans[window.planState.currentWeek];
    
    if (!currentWeekData) {
        container.innerHTML = "<div style="padding:40px;text-align:center;color:#666;">未找到该周数据</div>";
        return;
    }
    
    let weekButtonsHtml = weekKeys.map(function(weekKey) {
        const weekInfo = weekPlans[weekKey];
        const isActive = weekKey === window.planState.currentWeek;
        return `<button onclick="window.switchWeek()" style="padding:8px 14px;background:${isActive ? #667eea : #fff};color:${isActive ? white : #666};border:1px solid #ddd;border-radius:8px;font-size:13px;cursor:pointer;margin:4px;">${weekInfo.weekTitle.split(：)[0]}</button>`;
    }).join();
    
    let daysHtml = "";
    if (currentWeekData.days && Array.isArray(currentWeekData.days)) {
        daysHtml = currentWeekData.days.map(function(day) {
            let tasksHtml = day.tasks.map(function(task) {
                return `<div style="padding:10px 14px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;font-size:13px;border-left:3px solid #667eea;">
                    <div style="font-weight:bold;color:#333;">${task.title}</div>
                    <div style="font-size:11px;color:#666;margin-top:4px;">类型: ${task.type} | 时长: ${task.duration}分钟</div>
                </div>`;
            }).join();
            
            return `<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <h4 style="margin:0 0 12px 0;font-size:15px;color:#333;">Day ${day.day}：${day.title}</h4>
                ${tasksHtml}
            </div>`;
        }).join();
    }
    
    container.innerHTML = `
        <div style="margin-bottom:20px;">
            <div style="font-size:16px;font-weight:bold;color:#333;margin-bottom:8px;">${currentWeekData.weekTitle}</div>
            <div style="font-size:13px;color:#666;">${currentWeekData.weekDesc}</div>
        </div>
        
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            ${weekButtonsHtml}
        </div>
        
        ${daysHtml}
    `;
};


console.log('[V305] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);

// ============================================================
// V295 学习计划模块 - 恢复完整交互功能
// ============================================================

window.planState = {
    currentDate: new Date().toISOString().split('T')[0],
    tasks: []
};

// 初始化任务数据
window.initPlanTasks = function() {
    const saved = localStorage.getItem('learningPlanTasks');
    if (saved) {
        window.planState.tasks = JSON.parse(saved);
    } else {
        // 默认任务
        window.planState.tasks = [
            { id: 1, text: '背诵20个英语单词', time: '09:00 - 09:30', icon: '🔤', completed: false, date: window.planState.currentDate },
            { id: 2, text: '完成数学练习', time: '10:00 - 11:00', icon: '🔢', completed: false, date: window.planState.currentDate },
            { id: 3, text: '阅读语文课文', time: '14:00 - 14:30', icon: '📖', completed: false, date: window.planState.currentDate },
            { id: 4, text: '复习历史知识点', time: '16:00 - 17:00', icon: '📜', completed: false, date: window.planState.currentDate }
        ];
        window.savePlanTasks();
    }
};

// 保存任务
window.savePlanTasks = function() {
    localStorage.setItem('learningPlanTasks', JSON.stringify(window.planState.tasks));
};

window.renderPlan = function(container) {
    console.log('[V295] renderPlan 被调用，container:', container);
    
    // 初始化数据
    window.initPlanTasks();
    
    // 获取当天任务
    const todayTasks = window.planState.tasks.filter(t => t.date === window.planState.currentDate);
    const completedCount = todayTasks.filter(t => t.completed).length;
    const totalCount = todayTasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    // 格式化日期显示
    const dateObj = new Date(window.planState.currentDate);
    const dateDisplay = dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    
    container.innerHTML = `
        <div style="padding:20px;background:#f8f9fa;min-height:100vh;">
            <!-- 顶部栏 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 日期选择 -->
            <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:20px;">
                <button onclick="window.changeDate(-1)" style="padding:8px 12px;background:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.05);">◀</button>
                <div style="font-size:15px;font-weight:bold;color:#333;">${dateDisplay}</div>
                <button onclick="window.changeDate(1)" style="padding:8px 12px;background:white;border:none;border-radius:8px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.05);">▶</button>
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
                            <div>今天还没有任务哦</div>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- 添加任务按钮 -->
            <div style="margin-top:20px;text-align:center;">
                <button onclick="window.addPlanTask()" style="padding:12px 20px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;width:100%;">➕ 添加新任务</button>
            </div>
            
            <!-- 版本提示 -->
            <div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">
                <div style="font-size:12px;color:#1976d2;text-align:center;">✅ V295 - 学习计划完整功能版</div>
            </div>
        </div>
    `;
    
    console.log('[V295] 学习计划渲染完成');
};

// 切换任务完成状态
window.togglePlanTask = function(taskId) {
    const task = window.planState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        window.savePlanTasks();
        
        // 重新渲染更新进度
        const container = document.getElementById('app-container');
        if (container) {
            window.renderPlan(container);
        }
    }
};

// 切换日期
window.changeDate = function(days) {
    const current = new Date(window.planState.currentDate);
    current.setDate(current.getDate() + days);
    window.planState.currentDate = current.toISOString().split('T')[0];
    
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
    
    const icons = ['🔤', '🔢', '📖', '📜', '🌍', '🧪', '🎨', '🎵', '⚽', '📝'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    
    const newId = Math.max(0, ...window.planState.tasks.map(t => t.id)) + 1;
    
    window.planState.tasks.push({
        id: newId,
        text: text,
        time: time,
        icon: icon,
        completed: false,
        date: window.planState.currentDate
    });
    
    window.savePlanTasks();
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderPlan(container);
    }
};

console.log('[V295] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);

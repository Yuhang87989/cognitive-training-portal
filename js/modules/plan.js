// ============================================================
// 学习计划模块
// ============================================================

function renderPlan(container) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date().getDay();
    const currentWeek = 1;
    
    // 示例任务数据
    const tasks = getPlanTasks();
    
    container.innerHTML = `
        <div style="padding:16px;min-height:100%;background:#f8f9fa;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 周选择 -->
            <div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <button onclick="changeWeek(-1)" style="padding:6px 12px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;">◀</button>
                    <span style="font-weight:bold;font-size:16px;">第 ${currentWeek} 周</span>
                    <button onclick="changeWeek(1)" style="padding:6px 12px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;">▶</button>
                </div>
                
                <!-- 星期栏 -->
                <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px;">
                    ${weekDays.map((day, i) => `
                        <div onclick="selectDay(${i})" id="day-${i}" style="text-align:center;padding:8px 4px;border-radius:8px;font-size:13px;cursor:pointer;background:${i === today ? '#667eea' : '#f5f5f5'};color:${i === today ? 'white' : '#666'};">
                            ${day}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 今日任务 -->
            <div style="background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-weight:bold;font-size:15px;margin-bottom:16px;color:#333;">📋 今日任务</div>
                <div id="taskList" style="display:flex;flex-direction:column;gap:10px;">
                    ${tasks.map((task, i) => `
                        <div onclick="toggleTask(${i})" id="task-${i}" style="display:flex;align-items:center;gap:12px;padding:12px;background:${task.done ? '#e8f5e9' : '#fafafa'};border-radius:12px;cursor:pointer;border:2px solid ${task.done ? '#4caf50' : '#eee'};transition:all 0.2s;">
                            <div style="width:24px;height:24px;border-radius:50%;background:${task.done ? '#4caf50' : '#e0e0e0'};display:flex;align-items:center;justify-content:center;color:white;font-size:14px;flex-shrink:0;">
                                ${task.done ? '✓' : ''}
                            </div>
                            <div style="flex:1;">
                                <div style="font-size:14px;color:${task.done ? '#999' : '#333'};text-decoration:${task.done ? 'line-through' : 'none'};">${task.text}</div>
                                <div style="font-size:12px;color:#999;margin-top:2px;">${task.time || ''}</div>
                            </div>
                            <div style="font-size:18px;">${task.emoji || '📝'}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 添加任务 -->
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee;">
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="newTaskInput" placeholder="添加新任务..." style="flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;">
                        <button onclick="addTask()" style="padding:10px 16px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">➕</button>
                    </div>
                </div>
            </div>
            
            <!-- 进度统计 -->
            <div style="margin-top:16px;background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-weight:bold;font-size:15px;margin-bottom:12px;color:#333;">📊 今日进度</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;text-align:center;">
                    <div>
                        <div style="font-size:28px;font-weight:bold;color:#667eea;">${tasks.filter(t => t.done).length}/${tasks.length}</div>
                        <div style="font-size:12px;color:#999;">已完成</div>
                    </div>
                    <div>
                        <div style="font-size:28px;font-weight:bold;color:#4caf50;">${tasks.length > 0 ? Math.round(tasks.filter(t => t.done).length / tasks.length * 100) : 0}%</div>
                        <div style="font-size:12px;color:#999;">完成率</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 获取任务数据
function getPlanTasks() {
    const saved = localStorage.getItem('learning_plan_tasks');
    if (saved) return JSON.parse(saved);
    
    // 默认任务
    return [
        { text: '背诵20个英语单词', time: '09:00 - 09:30', emoji: '🔤', done: false },
        { text: '完成数学练习', time: '10:00 - 11:00', emoji: '🔢', done: false },
        { text: '阅读语文课文', time: '14:00 - 14:30', emoji: '📖', done: false },
        { text: '错题本复习', time: '16:00 - 16:30', emoji: '📒', done: false },
        { text: '体育锻炼', time: '17:00 - 18:00', emoji: '🏃', done: false }
    ];
}

// 保存任务
function saveTasks(tasks) {
    localStorage.setItem('learning_plan_tasks', JSON.stringify(tasks));
}

// 切换任务状态
function toggleTask(index) {
    const tasks = getPlanTasks();
    tasks[index].done = !tasks[index].done;
    saveTasks(tasks);
    renderPlan(document.getElementById('fullscreen-content'));
}

// 添加任务
function addTask() {
    const input = document.getElementById('newTaskInput');
    const text = input.value.trim();
    if (!text) return;
    
    const tasks = getPlanTasks();
    tasks.push({
        text: text,
        time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
        emoji: '📝',
        done: false
    });
    saveTasks(tasks);
    renderPlan(document.getElementById('fullscreen-content'));
}

// 选择日期
function selectDay(dayIndex) {
    // 简单提示
    window.showToast(`已切换到${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayIndex]}`);
}

// 切换周
function changeWeek(delta) {
    window.showToast(delta > 0 ? '下一周' : '上一周');
}

// 挂载到window
window.renderPlan = renderPlan;
window.toggleTask = toggleTask;
window.addTask = addTask;
window.selectDay = selectDay;
window.changeWeek = changeWeek;

// ============================================================
// V292 学习计划模块 - 彻底修复缩进问题
// ============================================================

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let currentWeek = 1;
let selectedDay = new Date().getDay();

// 获取所有任务数据
function getPlanTasks() {
    try {
        const saved = localStorage.getItem('learning_plan_tasks');
        if (saved) return JSON.parse(saved);
    } catch(e) {
        console.error('读取学习计划失败:', e);
    }
    
    // 默认任务
    const today = new Date().getDay();
    return [
        { text: '背诵20个英语单词', time: '09:00 - 09:30', emoji: '🔤', done: false, day: today },
        { text: '完成数学练习', time: '10:00 - 11:00', emoji: '🔢', done: false, day: today },
        { text: '阅读语文课文', time: '14:00 - 14:30', emoji: '📖', done: false, day: today },
        { text: '复习物理公式', time: '15:00 - 15:30', emoji: '⚛️', done: false, day: today }
    ];
}

// 保存任务数据
function savePlanTasks(tasks) {
    localStorage.setItem('learning_plan_tasks', JSON.stringify(tasks));
}

// 获取某天的任务
function getTasksForDay(day) {
    const allTasks = getPlanTasks();
    return allTasks.filter(t => (t.day === undefined || t.day === day));
}

// 切换任务完成状态
function toggleTask(index) {
    const tasks = getPlanTasks();
    const todayTasks = getTasksForDay(selectedDay);
    if (todayTasks[index]) {
        todayTasks[index].done = !todayTasks[index].done;
        savePlanTasks(tasks);
        
        // 记录统计
        if (todayTasks[index].done && window.DataSync && window.DataSync.stats) {
            window.DataSync.stats.recordCompleted('plan', todayTasks[index].text);
        }
        
        renderPlan(document.getElementById('fullscreen-content'));
    }
}

// 添加新任务
function addTask() {
    const taskText = prompt('请输入新任务：');
    if (taskText && taskText.trim()) {
        const tasks = getPlanTasks();
        tasks.push({
            text: taskText.trim(),
            time: '全天',
            emoji: '✅',
            done: false,
            day: selectedDay
        });
        savePlanTasks(tasks);
        renderPlan(document.getElementById('fullscreen-content'));
    }
}

// 选择日期
function selectDay(dayIndex) {
    selectedDay = dayIndex;
    renderPlan(document.getElementById('fullscreen-content'));
}

// 切换周
function changeWeek(delta) {
    currentWeek = Math.max(1, currentWeek + delta);
    renderPlan(document.getElementById('fullscreen-content'));
}

// 渲染学习计划
function renderPlan(container) {
    const tasks = getPlanTasks();
    const todayTasks = getTasksForDay(selectedDay);
    
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
                    <button onclick="window.changeWeekPlan(-1)" style="padding:6px 12px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;">◀</button>
                    <span style="font-weight:bold;font-size:16px;">第 ${currentWeek} 周</span>
                    <button onclick="window.changeWeekPlan(1)" style="padding:6px 12px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;">▶</button>
                </div>
                
                <!-- 星期栏 -->
                <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px;">
                    ${weekDays.map((day, i) => `
                        <div onclick="window.selectDayPlan(${i})" id="day-${i}" style="text-align:center;padding:8px 4px;border-radius:8px;font-size:13px;cursor:pointer;background:${i === selectedDay ? '#667eea' : '#f5f5f5'};color:${i === selectedDay ? 'white' : '#666'};transition:all 0.2s;">
                            ${day}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 任务列表 -->
            <div style="background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="margin:0;font-size:16px;color:#333;">今日任务</h3>
                    <span style="font-size:13px;color:#667eea;">${todayTasks.filter(t => t.done).length}/${todayTasks.length} 已完成</span>
                </div>
                
                <div style="display:flex;flex-direction:column;gap:10px;">
                    ${todayTasks.length === 0 ? `
                        <div style="text-align:center;padding:30px;color:#999;font-size:14px;">
                            📝 暂无任务，点击下方按钮添加
                        </div>
                    ` : todayTasks.map((task, i) => `
                        <div onclick="window.toggleTaskPlan(${i})" id="task-${i}" style="display:flex;align-items:center;gap:12px;padding:12px;background:${task.done ? '#e8f5e9' : '#fafafa'};border-radius:12px;cursor:pointer;border:2px solid ${task.done ? '#4caf50' : '#eee'};transition:all 0.2s;">
                            <span style="font-size:20px;">${task.emoji || '✅'}</span>
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:14px;color:#333;${task.done ? 'text-decoration:line-through;color:#999;' : ''}">${task.text}</div>
                                <div style="font-size:12px;color:#999;">${task.time}</div>
                            </div>
                            <span style="font-size:18px;">${task.done ? '✅' : '⬜'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 添加任务按钮 -->
            <div style="text-align:center;">
                <button onclick="window.addTaskPlan()" style="padding:10px 16px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">➕ 添加新任务</button>
            </div>
        </div>
    `;
}

// 导出到window
window.renderPlan = renderPlan;
window.toggleTaskPlan = toggleTask;
window.addTaskPlan = addTask;
window.selectDayPlan = selectDay;
window.changeWeekPlan = changeWeek;

console.log('[V292] 学习计划模块加载完成');

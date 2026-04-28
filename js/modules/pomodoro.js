// ====== pomodoro模块 ======
// 版本: V140

CTM.registerModule('pomodoro', {
    name: 'pomodoro',
    icon: '🎯',
    render: renderPomodoro
});

function renderPomodoro(container) {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    
    container.innerHTML = `
        <div class="card" style="text-align:center;">
            <h3 style="margin-bottom:12px;">🍅 番茄闹钟</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">专注学习，高效时间管理</p>
            
            <div style="width:200px;height:200px;margin:20px auto;border-radius:50%;background:linear-gradient(135deg,#FF6B6B,#FF9A63);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(255,107,107,0.3);">
                <div id="pomodoro-display" style="font-size:48px;font-weight:bold;color:white;">${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}</div>
            </div>
            
            <div style="display:flex;justify-content:center;gap:12px;margin:20px 0;">
                <button onclick="setPomodoroTime(25)" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">25分钟</button>
                <button onclick="setPomodoroTime(15)" style="padding:10px 20px;background:#43E97B;color:white;border:none;border-radius:8px;cursor:pointer;">15分钟</button>
                <button onclick="setPomodoroTime(5)" style="padding:10px 20px;background:#FFD93D;color:#333;border:none;border-radius:8px;cursor:pointer;">5分钟</button>
            </div>
            
            <div style="display:flex;justify-content:center;gap:16px;">
                <button id="pomodoro-start-btn" onclick="togglePomodoro()" style="padding:16px 40px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:18px;font-weight:bold;cursor:pointer;">${pomodoroRunning ? '暂停' : '开始'}</button>
                <button onclick="resetPomodoro()" style="padding:16px 24px;background:#f5f7ff;color:#667eea;border:2px solid #667eea;border-radius:12px;font-size:16px;cursor:pointer;">重置</button>
            </div>
            
            <div style="margin-top:24px;padding:16px;background:#f5f7ff;border-radius:12px;">
                <div style="font-size:14px;color:#666;margin-bottom:8px;">今日专注统计</div>
                <div style="display:flex;justify-content:center;gap:24px;">
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#FF6B6B;" id="pomodoro-count">${getCurrentUserData()?.pomodoroCount || 0}</div>
                        <div style="font-size:12px;color:#666;">番茄数</div>
                    </div>
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#667eea;" id="pomodoro-minutes">${getCurrentUserData()?.pomodoroMinutes || 0}</div>
                        <div style="font-size:12px;color:#666;">专注分钟</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.renderPomodoro = renderPomodoro;

// ============================================================
// 版本: V145
// 番茄钟模块 - V433: 首页内嵌模式
// ============================================================

window.pomodoroTime = 25 * 60;
window.pomodoroTimer = null;
var pomodoroRunning = false;
var pomodoroMode = 'work'; // work, break

// 获取当前活跃的番茄钟容器
function _getPomodoroContainer() {
    var inlineContainer = document.getElementById('pomodoro-inline-container');
    if (inlineContainer && inlineContainer.style.display !== 'none') {
        return inlineContainer;
    }
    return document.getElementById('fullscreen-content');
}

// 切换首页内嵌番茄闹钟
window.toggleInlinePomodoro = function() {
    var container = document.getElementById('pomodoro-inline-container');
    if (!container) return;
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        renderPomodoro(container);
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
        clearInterval(window.pomodoroTimer);
        pomodoroRunning = false;
    }
};

function renderPomodoro(container) {
    var isInline = container && container.id === 'pomodoro-inline-container';
    var minutes = Math.floor(window.pomodoroTime / 60);
    var seconds = window.pomodoroTime % 60;
    
    var closeBtn = isInline 
        ? '<button onclick="toggleInlinePomodoro()" style="margin-top:16px;padding:10px 20px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">收起</button>'
        : '<button onclick="closeFullscreenPage()" style="margin-top:20px;padding:12px 24px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>';
    
    container.innerHTML = '<div class="card" style="text-align:center;' + (isInline ? 'margin:0;' : '') + '">' +
        '<h3 style="margin-bottom:12px;">🍅 番茄闹钟</h3>' +
        '<p style="color:#666;font-size:13px;margin-bottom:16px;">专注学习，高效时间管理</p>' +
        '<div style="width:180px;height:180px;margin:16px auto;border-radius:50%;background:linear-gradient(135deg,#FF6B6B,#FF9A63);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(255,107,107,0.3);">' +
            '<div id="pomodoro-display" style="font-size:44px;font-weight:bold;color:white;">' + String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0') + '</div>' +
        '</div>' +
        '<div style="display:flex;justify-content:center;gap:12px;margin:16px 0;">' +
            '<button onclick="setPomodoroTime(25)" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">25分钟</button>' +
            '<button onclick="setPomodoroTime(15)" style="padding:10px 20px;background:#43E97B;color:white;border:none;border-radius:8px;cursor:pointer;">15分钟</button>' +
            '<button onclick="setPomodoroTime(5)" style="padding:10px 20px;background:#FFD93D;color:#333;border:none;border-radius:8px;cursor:pointer;">5分钟</button>' +
        '</div>' +
        '<div style="display:flex;justify-content:center;gap:16px;">' +
            '<button id="pomodoro-start-btn" onclick="togglePomodoro()" style="padding:16px 40px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:18px;font-weight:bold;cursor:pointer;">' + (pomodoroRunning ? '暂停' : '开始') + '</button>' +
            '<button onclick="resetPomodoro()" style="padding:16px 24px;background:#f5f7ff;color:#667eea;border:2px solid #667eea;border-radius:12px;font-size:16px;cursor:pointer;">重置</button>' +
        '</div>' +
        '<div style="margin-top:20px;padding:16px;background:#f5f7ff;border-radius:12px;">' +
            '<div style="font-size:14px;color:#666;margin-bottom:8px;">今日专注统计</div>' +
            '<div style="display:flex;justify-content:center;gap:24px;">' +
                '<div>' +
                    '<div style="font-size:24px;font-weight:bold;color:#FF6B6B;" id="pomodoro-count">' + ((window.getCurrentUserData() || {}).pomodoroCount || 0) + '</div>' +
                    '<div style="font-size:12px;color:#666;">番茄数</div>' +
                '</div>' +
                '<div>' +
                    '<div style="font-size:24px;font-weight:bold;color:#667eea;" id="pomodoro-minutes">' + ((window.getCurrentUserData() || {}).pomodoroMinutes || 0) + '</div>' +
                    '<div style="font-size:12px;color:#666;">专注分钟</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        closeBtn +
    '</div>';
}

function resetPomodoro() {
    clearInterval(window.pomodoroTimer);
    pomodoroRunning = false;
    window.pomodoroTime = 25 * 60;
    renderPomodoro(_getPomodoroContainer());
}

function setPomodoroTime(minutes) {
    window.pomodoroTime = minutes * 60;
    pomodoroMode = minutes >= 15 ? 'work' : 'break';
    var display = document.getElementById('pomodoro-display');
    if (display) {
        display.textContent = String(minutes).padStart(2,'0') + ':00';
    }
}

function togglePomodoro() {
    if (pomodoroRunning) {
        clearInterval(window.pomodoroTimer);
        pomodoroRunning = false;
    } else {
        pomodoroRunning = true;
        window.pomodoroTimer = setInterval(function() {
            window.pomodoroTime--;
            if (window.pomodoroTime <= 0) {
                clearInterval(window.pomodoroTimer);
                pomodoroRunning = false;
                if (typeof SoundEffects !== 'undefined' && SoundEffects.playComplete) {
                    SoundEffects.playComplete();
                }
                window.showToast('🍅 番茄时间到！休息一下吧~');
                var user = window.getCurrentUserData();
                if (user) {
                    user.pomodoroCount = (user.pomodoroCount || 0) + 1;
                    user.pomodoroMinutes = (user.pomodoroMinutes || 0) + 25;
                    syncUserData(user);
                }
                window.pomodoroTime = 25 * 60;
                renderPomodoro(_getPomodoroContainer());
            }
            var display = document.getElementById('pomodoro-display');
            if (display) {
                var m = Math.floor(window.pomodoroTime / 60);
                var s = window.pomodoroTime % 60;
                display.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
            }
        }, 1000);
    }
    var btn = document.getElementById('pomodoro-start-btn');
    if (btn) btn.textContent = pomodoroRunning ? '暂停' : '开始';
}

// 导出到window，供onclick调用
window.renderPomodoro = renderPomodoro;
window.resetPomodoro = resetPomodoro;
window.setPomodoroTime = setPomodoroTime;
window.togglePomodoro = togglePomodoro;

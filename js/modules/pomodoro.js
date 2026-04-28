// 版本: V140

function resetPomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroRunning = false;
    pomodoroTime = 25 * 60;
    renderPomodoro(document.getElementById('fullscreen-content'));
}

function setPomodoroTime(minutes) {
    pomodoroTime = minutes * 60;
    pomodoroMode = minutes >= 15 ? 'work' : 'break';
    const display = document.getElementById('pomodoro-display');
    if (display) {
        display.textContent = `${String(minutes).padStart(2,'0')}:00`;
    }
}

function togglePomodoro() {
    if (pomodoroRunning) {
        clearInterval(pomodoroTimer);
        pomodoroRunning = false;
    } else {
        pomodoroRunning = true;
        pomodoroTimer = setInterval(() => {
            pomodoroTime--;
            if (pomodoroTime <= 0) {
                clearInterval(pomodoroTimer);
                pomodoroRunning = false;
                // 播放提示音
                SoundEffects.playComplete();
                showToast('🍅 番茄时间到！休息一下吧~');
                // 更新统计
                const user = getCurrentUserData();
                if (user) {
                    user.pomodoroCount = (user.pomodoroCount || 0) + 1;
                    user.pomodoroMinutes = (user.pomodoroMinutes || 0) + 25;
                    syncUserData(user);
                }
                // 重置
                pomodoroTime = 25 * 60;
                renderPomodoro(document.getElementById('fullscreen-content'));
            }
            const display = document.getElementById('pomodoro-display');
            if (display) {
                const m = Math.floor(pomodoroTime / 60);
                const s = pomodoroTime % 60;
                display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            }
        }, 1000);
    }
    const btn = document.getElementById('pomodoro-start-btn');
    if (btn) btn.textContent = pomodoroRunning ? '暂停' : '开始';
}


// ============================================================
// UI - 用户界面
// ============================================================
// 番茄钟模块 - ES6 Modules 版本
import { showToast, formatDate } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 模块状态
let timerState = {
    isRunning: false,
    isPaused: false,
    mode: 'work', // work | shortBreak | longBreak
    duration: 25 * 60,
    remaining: 25 * 60,
    interval: null,
    startTime: null,
    completedPomodoros: 0,
    totalFocusTime: 0
};

// 默认配置
const DEFAULT_CONFIG = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakAfter: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
};

/**
 * 获取番茄钟配置
 */
export function getPomodoroConfig() {
    const user = getCurrentUserData();
    return user?.pomodoroConfig || { ...DEFAULT_CONFIG };
}

/**
 * 更新番茄钟配置
 */
export function updatePomodoroConfig(config) {
    const user = getCurrentUserData();
    if (!user) return false;

    user.pomodoroConfig = { ...DEFAULT_CONFIG, ...config };
    updateCurrentUser(user);
    
    // 如果计时器没有运行，更新当前模式的时长
    if (!timerState.isRunning) {
        updateDurationByMode(timerState.mode);
    }
    
    showToast('配置已更新 ✅');
    return true;
}

/**
 * 根据模式更新时长
 */
function updateDurationByMode(mode) {
    const config = getPomodoroConfig();
    
    switch (mode) {
        case 'work':
            timerState.duration = config.workDuration * 60;
            break;
        case 'shortBreak':
            timerState.duration = config.shortBreakDuration * 60;
            break;
        case 'longBreak':
            timerState.duration = config.longBreakDuration * 60;
            break;
    }
    timerState.remaining = timerState.duration;
}

/**
 * 获取今日番茄记录
 */
export function getTodayPomodoros() {
    const user = getCurrentUserData();
    const today = formatDate(new Date());
    const records = user?.pomodoroRecords || [];
    return records.filter(r => formatDate(new Date(r.startTime)) === today);
}

/**
 * 开始计时
 */
export function startTimer() {
    if (timerState.isRunning && !timerState.isPaused) {
        showToast('番茄钟已在运行中');
        return false;
    }

    timerState.isRunning = true;
    timerState.isPaused = false;
    timerState.startTime = Date.now();
    
    timerState.interval = setInterval(() => {
        timerState.remaining--;
        
        if (timerState.remaining <= 0) {
            completePomodoro();
        }
        
        // 更新显示
        updateTimerDisplay();
    }, 1000);
    
    showToast(timerState.mode === 'work' ? '🍅 专注开始！' : '☕ 休息开始！');
    return true;
}

/**
 * 暂停计时
 */
export function pauseTimer() {
    if (!timerState.isRunning || timerState.isPaused) return false;
    
    clearInterval(timerState.interval);
    timerState.isPaused = true;
    
    showToast('已暂停 ⏸️');
    return true;
}

/**
 * 继续计时
 */
export function resumeTimer() {
    if (!timerState.isPaused) return false;
    
    timerState.isPaused = false;
    timerState.startTime = Date.now();
    
    timerState.interval = setInterval(() => {
        timerState.remaining--;
        
        if (timerState.remaining <= 0) {
            completePomodoro();
        }
        
        updateTimerDisplay();
    }, 1000);
    
    showToast('继续计时 ⏱️');
    return true;
}

/**
 * 停止计时
 */
export function stopTimer() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.remaining = timerState.duration;
    updateTimerDisplay();
    showToast('已停止');
    return true;
}

/**
 * 重置计时器
 */
export function resetTimer() {
    stopTimer();
    showToast('已重置');
    return true;
}

/**
 * 跳过当前阶段
 */
export function skipTimer() {
    completePomodoro();
    showToast('已跳过当前阶段');
}
/**
 * 完成当前番茄/休息阶段
 */
function completePomodoro() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    if (timerState.mode === 'work') {
        timerState.completedPomodoros++;
        savePomodoroRecord();
        showToast('🍅 专注完成！休息一下吧');
        
        // 检查是否需要长休息
        if (timerState.completedPomodoros % getPomodoroConfig().longBreakAfter === 0) {
            switchMode('longBreak');
        } else {
            switchMode('shortBreak');
        }
    } else {
        showToast('☕ 休息结束！继续专注吧');
        switchMode('work');
    }
    
    updateTimerDisplay();
}

/**
 * 保存番茄记录
 */
function savePomodoroRecord() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const record = {
        id: Date.now(),
        startTime: new Date().toISOString(),
        duration: getPomodoroConfig().workDuration * 60,
        mode: timerState.mode
    };
    
    if (!user.pomodoroRecords) {
        user.pomodoroRecords = [];
    }
    user.pomodoroRecords.push(record);
    updateCurrentUser(user);
}

/**
 * 切换模式
 */
export function switchMode(mode) {
    stopTimer();
    timerState.mode = mode;
    timerState.remaining = getModeDuration(mode);
    updateTimerDisplay();
}

/**
 * 获取模式时长
 */
function getModeDuration(mode) {
    const config = getPomodoroConfig();
    switch (mode) {
        case 'work':
            return config.workDuration * 60;
        case 'shortBreak':
            return config.shortBreakDuration * 60;
        case 'longBreak':
            return config.longBreakDuration * 60;
        default:
            return 25 * 60;
    }
}

/**
 * 获取当前模式的剩余时间显示
 */
function getRemainingDisplay() {
    const minutes = Math.floor(timerState.remaining / 60);
    const seconds = timerState.remaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const modeLabel = document.getElementById('mode-label');
    const progressBar = document.getElementById('timer-progress');
    
    if (display) {
        display.textContent = getRemainingDisplay();
    }
    
    if (modeLabel) {
        const labels = {
            work: '🍅 专注中',
            shortBreak: '☕ 短休息',
            longBreak: '🌴 长休息'
        };
        modeLabel.textContent = labels[timerState.mode];
    }
    
    if (progressBar) {
        const total = timerState.duration;
        const progress = ((total - timerState.remaining) / total) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * 格式化时间显示
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * 渲染番茄钟页面
 */
export function renderPomodoroPage(container) {
    const todayPomodoros = getTodayPomodoros();
    const config = getPomodoroConfig();
    
    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🍅 番茄钟</h2>
                <button class="settings-btn" onclick="window.App.pomodoro.openSettingsModal()">⚙️</button>
            </div>
            
            <div class="pomodoro-container">
                <div class="stats-bar">
                    <div class="stat-item">
                        <span class="stat-icon">🍅</span>
                        <span class="stat-value">${todayPomodoros.length}</span>
                        <span class="stat-label">今日完成</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-value">${Math.floor(todayPomodoros.reduce((acc, r) => acc + r.duration, 0) / 60)}</span>
                        <span class="stat-label">专注分钟</span>
                    </div>
                </div>
                
                <div class="mode-selector">
                    <button class="mode-btn ${timerState.mode === 'work' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('work')">专注</button>
                    <button class="mode-btn ${timerState.mode === 'shortBreak' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('shortBreak')">短休息</button>
                    <button class="mode-btn ${timerState.mode === 'longBreak' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('longBreak')">长休息</button>
                </div>
                
                <div class="timer-circle">
                    <svg viewBox="0 0 200 200">
                        <circle class="timer-bg" cx="100" cy="100" r="90" stroke-width="8" />
                        <circle id="timer-progress" class="timer-progress" cx="100" cy="100" r="90" stroke-width="8" />
                    </svg>
                    <div class="timer-content">
                        <div id="timer-display" class="timer-display">${formatTime(timerState.remaining)}</div>
                        <div id="mode-label" class="mode-label">${timerState.mode === 'work' ? '🍅 专注中' : timerState.mode === 'shortBreak' ? '☕ 短休息' : '🌴 长休息'}</div>
                    </div>
                </div>
                
                <div class="timer-controls">
                    ${!timerState.isRunning || timerState.isPaused ? `
                        <button class="control-btn primary" onclick="window.App.pomodoro.${timerState.isPaused ? 'resumeTimer' : 'startTimer'}()">
                            ${timerState.isPaused ? '▶️ 继续' : '▶️ 开始'}
                        </button>
                    ` : `
                        <button class="control-btn pause" onclick="window.App.pomodoro.pauseTimer()">⏸️ 暂停</button>
                    `}
                    <button class="control-btn secondary" onclick="window.App.pomodoro.resetTimer()">🔄 重置</button>
                    <button class="control-btn skip" onclick="window.App.pomodoro.skipTimer()">⏭️ 跳过</button>
                </div>
                
                <div class="pomodoros-dots">
                    ${Array(config.longBreakAfter).fill(0).map((_, i) => `
                        <div class="dot ${i < timerState.completedPomodoros % config.longBreakAfter ? 'completed' : ''}"></div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // 更新进度条
    updateTimerDisplay();
}

/**
 * 打开设置模态框
 */
export function openSettingsModal() {
    const config = getPomodoroConfig();
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="modal-title">⚙️ 番茄钟设置</div>
        <div class="form-group">
            <label>专注时长（分钟）</label>
            <input type="number" id="pomodoro-work" value="${config.workDuration}" min="1" max="60" />
        </div>
        <div class="form-group">
            <label>短休息时长（分钟）</label>
            <input type="number" id="pomodoro-short" value="${config.shortBreakDuration}" min="1" max="30" />
        </div>
        <div class="form-group">
            <label>长休息时长（分钟）</label>
            <input type="number" id="pomodoro-long" value="${config.longBreakDuration}" min="1" max="60" />
        </div>
        <div class="form-group">
            <label>长休息间隔（番茄数）</label>
            <input type="number" id="pomodoro-interval" value="${config.longBreakAfter}" min="1" max="10" />
        </div>
        <button class="login-btn" onclick="window.App.pomodoro.saveSettings()">保存设置</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 保存设置
 */
export function saveSettings() {
    const workDuration = parseInt(document.getElementById('pomodoro-work')?.value) || 25;
    const shortBreakDuration = parseInt(document.getElementById('pomodoro-short')?.value) || 5;
    const longBreakDuration = parseInt(document.getElementById('pomodoro-long')?.value) || 15;
    const longBreakAfter = parseInt(document.getElementById('pomodoro-interval')?.value) || 4;
    
    updatePomodoroConfig({
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakAfter
    });
    
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新页面
    const container = document.getElementById('app-container');
    if (container) {
        renderPomodoroPage(container);
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.pomodoro = {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    skipTimer,
    switchMode,
    openSettingsModal,
    saveSettings
};

console.log('✅ pomodoro 模块加载完成');

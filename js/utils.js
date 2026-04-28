// 版本: V140

function showToast(message, duration = 2000) {
    const existing = document.getElementById('custom-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function cleanupModuleState() {
    // 停止所有游戏计时器
    if (typeof gameTimer !== 'undefined' && gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    if (typeof gameTimerDisplay !== 'undefined' && gameTimerDisplay) {
        clearInterval(gameTimerDisplay);
        gameTimerDisplay = null;
    }
    
    // 停止贪吃蛇计时器
    if (typeof snakeGame !== 'undefined' && snakeGame) {
        clearInterval(snakeGame);
        snakeGame = null;
    }
    
    // 停止俄罗斯方块计时器
    if (typeof tetrisGame !== 'undefined' && tetrisGame) {
        clearInterval(tetrisGame);
        tetrisGame = null;
    }
    
    // 停止打地鼠计时器
    if (typeof whackTimer !== 'undefined' && whackTimer) {
        clearInterval(whackTimer);
        whackTimer = null;
    }
    
    // 停止消消乐计时器
    if (typeof elimTimer !== 'undefined' && elimTimer) {
        clearInterval(elimTimer);
        elimTimer = null;
    }
    
    // 停止番茄钟计时器
    if (typeof pomodoroTimer !== 'undefined' && pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
    }
    
    // 清理游戏Canvas
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 停止音频播放
    if (typeof currentAudio !== 'undefined' && currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // 停止视频播放
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
    
    // 停止TTS朗读
    stopTTSSpeech();
    
    // 停止语音识别
    if (isRecording && deepseekRecognition) {
        deepseekRecognition.stop();
        isRecording = false;
    }
    
    // 清理DeepSeek图片
    if (currentDeepSeekImage) {
        currentDeepSeekImage = null;
    }
    
    // 关闭全屏音频播放器
    const audioPlayerFullscreen = document.getElementById('audio-player-fullscreen');
    if (audioPlayerFullscreen) {
        audioPlayerFullscreen.classList.remove('show');
    }
    
    // 关闭迷你播放器
    const miniPlayer = document.getElementById('mini-player');
    if (miniPlayer) {
        miniPlayer.classList.remove('show');
    }
    
    // 关闭视频全屏播放器
    const videoPlayerFullscreen = document.getElementById('enhanced-video-player');
    if (videoPlayerFullscreen) {
        videoPlayerFullscreen.style.display = 'none';
    }
    
    // 重置游戏全屏容器
    const gameFullscreen = document.getElementById('game-fullscreen-container');
    if (gameFullscreen) {
        gameFullscreen.style.display = 'none';
    }
    
    console.log('模块状态已清理');
}

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}

function openSettingsPanel() {
    const user = getCurrentUserData();
    if (user) {
        // 更新用户信息卡片
        const avatarEl = document.getElementById('settings-avatar');
        const nameEl = document.getElementById('settings-name');
        const gradeEl = document.getElementById('settings-grade');
        const diffEl = document.getElementById('settings-difficulty-display');
        const wrongCountEl = document.getElementById('settings-wrong-count');
        const trainCountEl = document.getElementById('settings-train-count');
        
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (nameEl) nameEl.textContent = user.name;
        if (gradeEl) gradeEl.textContent = gradeNames[user.grade] + ' · Lv.' + user.difficulty;
        if (diffEl) diffEl.textContent = 'Lv.' + user.difficulty;
        
        // 更新错题数量
        const wrongNotes = user.wrongNotes || [];
        if (wrongCountEl) wrongCountEl.textContent = '共 ' + wrongNotes.length + ' 道错题';
        
        // 更新训练次数
        const trainCount = user.trainCount || 8;
        if (trainCountEl) trainCountEl.value = trainCount;
        
        // 更新数据统计显示
        if (typeof updateDataStatsDisplay === 'function') {
            updateDataStatsDisplay();
        }
    }
    
    // 更新API配置状态显示
    if (typeof updateApiStatusDisplay === 'function') {
        updateApiStatusDisplay();
    }
    
    document.getElementById('settings-panel').style.display = 'block';
}

function closeSettingsPanel(e) {
    if (!e || e.target === document.getElementById('settings-panel')) {
        document.getElementById('settings-panel').style.display = 'none';
    }
}

function toggleSettingsGroup(groupId) {
    const group = document.getElementById('group-' + groupId);
    if (group) {
        group.classList.toggle('open');
    }
}

function exitSystem() {
    // 停止所有媒体
    if (typeof currentAudio !== 'undefined' && currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio.src = ''; }
    if (evpVideo) { evpVideo.pause(); evpVideo.src = ''; }
    stopTTSSpeech();
    
    // 隐藏所有播放器
    var miniEl = document.getElementById('mini-player');
    var audioEl = document.getElementById('audio-player-fullscreen');
    var videoEl = document.getElementById('enhanced-video-player');
    if (miniEl) miniEl.classList.remove('show');
    if (audioEl) audioEl.classList.remove('show');
    if (videoEl) videoEl.style.display = 'none';
    
    // 关闭设置面板
    closeSettingsPanel();
    
    // 显示告别弹窗
    var user = getCurrentUserData();
    if (user) {
        showGoodbyeModal(user);
        // 延迟后执行退出
        setTimeout(function() { doExitSystem(); }, 3000);
    } else {
        doExitSystem();
    }
}

function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
            <div style="font-size:48px;margin-bottom:12px;">🧠</div>
            <div style="font-size:20px;font-weight:bold;color:#333;margin-bottom:8px;">认知训练门户</div>
            <div style="font-size:13px;color:#999;margin-bottom:20px;">版本 V139</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📱 产品介绍</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                认知训练门户是一款专为12-16岁青少年设计的注意力和记忆力训练应用。通过科学系统的训练方法，帮助学生提升学习效率，培养良好的学习习惯。
            </div>
        </div>
        <div style="background:#fff3e0;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">✨ 核心功能</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                • 12大训练模块（AI分身、母题、播客等）<br>
                • 23个认知训练游戏<br>
                • 378道经典母题库<br>
                • DeepSeek AI 智能辅导<br>
                • 个性化学习计划
            </div>
        </div>
        <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">👨‍💻 开发团队</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                Coze AI Agent 智能助手<br>
                技术支持：DeepSeek API
            </div>
        </div>
        <div style="text-align:center;font-size:12px;color:#999;margin-bottom:16px;">
            © 2026 认知训练门户 版权所有
        </div>
        <button class="modal-close" onclick="closeModal()" style="width:100%;">关闭</button>
    `;
}


// ===== "关于"页面函数（重写版本）=====
function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div style="text-align:center;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#3377FF,#FF9A63);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">🧠</div>
            <h2 style="font-size:20px;font-weight:bold;margin-bottom:8px;">认知训练门户</h2>
            <div style="color:#3377FF;font-size:14px;margin-bottom:20px;">V140</div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>产品介绍</strong></p>
                    <p style="font-size:13px;color:#666;">专为12-16岁青少年设计的科学认知训练系统，通过系统化的训练提升学习能力。</p>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>Week1-7 训练目标</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week1-2:</strong> 注意力与记忆力基础 → 专注力提升30%</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week3-4:</strong> 数学思维与物理思维入门 → 逻辑推理能力提升</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week5:</strong> 系统性思维与守恒思维 → 跨学科整合能力</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week6:</strong> 学科深度整合与自主学习 → 独立学习能力</p>
                        <p style="margin-bottom:0;"><strong style="color:#3377FF;">Week7:</strong> 综合应用与创新思维 → 创造性解决问题能力</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;">
                    <p style="margin-bottom:8px;"><strong>核心功能</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p>• 12大训练模块</p>
                        <p>• 23个认知游戏</p>
                        <p>• DeepSeek AI智能辅导</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:center;color:#999;font-size:12px;margin-top:20px;">
                <p>开发团队：Coze AI Agent</p>
            </div>
        </div>
        <button onclick="closeModal()" style="width:100%;padding:14px;background:#3377FF;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:16px;">关闭</button>
    `;
    modal.classList.add('show');
}
window.openAbout = openAbout;


// ============================================================
// User - 用户管理
// ============================================================
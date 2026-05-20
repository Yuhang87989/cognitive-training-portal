// ============================================================
// Config - 全局配置
// ============================================================

// 版本: V144

function closeUserMenu() {
    var el = document.getElementById('user-dropdown');
    if (el) el.classList.remove('show');
}

function toggleUserMenu() {
    var el = document.getElementById("user-dropdown");
    if (el) el.classList.toggle("show");
}

function closeAboutModal() {
    const modal = document.getElementById('about-modal');
    if (modal) modal.classList.remove('show');
}

function closeAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    if (modal) modal.classList.remove('show');
}

function closeUpdateModal() {
    const modal = document.getElementById('update-modal');
    if (modal) modal.classList.remove('show');
}

function closeGoodbyeModal() {
    var modal = document.getElementById('goodbye-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(function() { modal.remove(); doExitSystem(); }, 300);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('show'); }

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

function closeApiConfigModal() {
    const modal = document.getElementById('api-config-modal');
    if (modal) modal.classList.remove('show');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('show');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('show');
}

function showWelcomeModal(msg, userName, streakDays) {
    // 创建欢迎弹窗
    const modal = document.createElement('div');
    modal.id = 'welcome-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const hour = new Date().getHours();
    let bgGradient = '';
    if (hour >= 5 && hour < 12) {
        bgGradient = 'linear-gradient(135deg, #667eea, #764ba2)';
    } else if (hour >= 12 && hour < 18) {
        bgGradient = 'linear-gradient(135deg, #f093fb, #f5576c)';
    } else {
        bgGradient = 'linear-gradient(135deg, #4facfe, #00f2fe)';
    }
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
            max-width: 320px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div style="font-size:64px;margin-bottom:16px;">
                ${streakDays >= 7 ? '🏆' : streakDays >= 3 ? '🔥' : '👋'}
            </div>
            <div style="font-size:22px;font-weight:bold;color:#333;margin-bottom:12px;white-space:pre-line;">
                ${msg.split('\n')[0]}
            </div>
            ${streakDays > 0 ? `
                <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin:16px 0;">
                    <div style="font-size:14px;color:#666;">连续学习</div>
                    <div style="font-size:36px;font-weight:bold;color:#1A6BFF;">${streakDays} 天</div>
                </div>
            ` : ''}
            <div style="font-size:14px;color:#666;margin-bottom:20px;">
                ${streakDays >= 7 ? '坚持就是胜利，你是学习之星！' : streakDays >= 3 ? '保持好习惯，继续加油！' : '每天进步一点点！'}
            </div>
            <button onclick="closeWelcomeModal()" style="
                width: 100%;
                padding: 14px;
                background: ${bgGradient};
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">开始学习</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 3秒后自动关闭
    setTimeout(() => {
        closeWelcomeModal();
    }, 5000);
}

function showGoodbyeModal(user) {
    // 计算今日学习数据
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = user.studyDays?.[today] || 0;
    const todayQuestions = user.todayStats?.questions || 0;
    const todayCorrect = user.todayStats?.correct || 0;
    const accuracy = todayQuestions > 0 ? Math.round(todayCorrect / todayQuestions * 100) : 0;
    const streakDays = calculateStreakDays(user);
    
    // 构建告别语
    let voiceMsg = '';
    let summaryHtml = '';
    
    if (todayMinutes > 0 || todayQuestions > 0) {
        // 有学习记录
        voiceMsg = `${user.name}，今天学习了${todayMinutes}分钟，完成了${todayQuestions}道题目，正确率${accuracy}%。`;
        
        if (streakDays >= 7) {
            voiceMsg += `你已经连续学习${streakDays}天了，太厉害了！明天继续加油！`;
        } else if (streakDays >= 3) {
            voiceMsg += `继续保持，你是最棒的！`;
        } else {
            voiceMsg += `期待明天见！`;
        }
        
        summaryHtml = `
            <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin:16px 0;">
                <div style="font-size:14px;color:#666;margin-bottom:12px;">📊 今日学习总结</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#1A6BFF;">${todayMinutes}</div>
                        <div style="font-size:11px;color:#999;">分钟</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#43E97B;">${todayQuestions}</div>
                        <div style="font-size:11px;color:#999;">题目</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${accuracy}%</div>
                        <div style="font-size:11px;color:#999;">正确率</div>
                    </div>
                </div>
            </div>
            ${streakDays > 0 ? `
                <div style="background:linear-gradient(135deg,#FFD93D,#FF6B6B);border-radius:12px;padding:12px;margin-bottom:16px;color:white;">
                    🔥 已连续学习 <strong>${streakDays}</strong> 天
                </div>
            ` : ''}
        `;
    } else {
        // 无学习记录
        voiceMsg = `${user.name}，今天还没有学习哦，明天记得来学习！`;
        summaryHtml = `
            <div style="background:#fff3e0;border-radius:12px;padding:16px;margin:16px 0;">
                <div style="font-size:14px;color:#e65100;">📚 今天还没有学习记录</div>
                <div style="font-size:12px;color:#666;margin-top:8px;">明天记得来学习哦！</div>
            </div>
        `;
    }
    
    // 创建告别弹窗
    const modal = document.createElement('div');
    modal.id = 'goodbye-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
            max-width: 320px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div style="font-size:64px;margin-bottom:16px;">👋</div>
            <div style="font-size:22px;font-weight:bold;color:#333;margin-bottom:8px;">
                再见，${user.name}！
            </div>
            <div style="font-size:14px;color:#666;">辛苦了，休息一下吧</div>
            ${summaryHtml}
            <div style="font-size:13px;color:#999;margin-bottom:20px;">
                ${todayMinutes > 30 ? '🌟 今天的努力会变成明天的收获！' : '💪 明天继续加油！'}
            </div>
            <button onclick="closeGoodbyeModal()" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">确定退出</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 语音播报
    setTimeout(() => {
        speakText(voiceMsg);
    }, 300);
    
    // 3秒后自动关闭并退出
    setTimeout(function() {
        var modal = document.getElementById('goodbye-modal');
        if (modal) { modal.style.animation = 'fadeOut 0.3s ease'; setTimeout(function() { modal.remove(); doExitSystem(); }, 300); }
    }, 3000);
}

function openRegisterModal() {
    // 清空表单
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-phone').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password-confirm').value = '';
    document.getElementById('reg-grade').value = '';
    document.getElementById('reg-difficulty').value = '2';
    document.getElementById('reg-level').value = '1';
    
    document.getElementById('register-modal').classList.add('show');
}

function checkAndShowRegisterModal() {
    // 已禁用，直接更新UI
    updateUI();
}

function openHelp() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📖 使用帮助</div>
        <div style="max-height:300px;overflow-y:auto;">
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">🎯 训练模块</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • 每日完成8次训练可获得积分奖励<br>
                    • 难度级别影响题目难度和积分倍数<br>
                    • 连续训练可获得额外奖励
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">📚 母题训练</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • 选择年级和科目开始训练<br>
                    • 支持拍照上传题目获取AI解析<br>
                    • 错题自动加入错题本
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">🤖 AI功能</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • DeepSeek AI 支持多学科问答<br>
                    • AI数字分身提供个性化辅导<br>
                    • 拍照识别自动解题
                </div>
            </div>
        </div>
        <button class="modal-close" onclick="window.closeModal()" style="margin-top:12px;">关闭</button>
    `;
}

function openFullscreenPage(module) {
    window.cleanupModuleState(); // 清理上一个模块的状态
    closeUserMenu();
    const container = document.getElementById('fullscreen-container');
    const titleEl = document.getElementById('fullscreen-title');
    const contentEl = document.getElementById('fullscreen-content');
    if (!container || !titleEl || !contentEl) return;
    
    const moduleTitles = {
        'ai': '🎯 AI精准练',
        'practice': '📚 母题训练',
        'map': '🧠 认知地图',
        'plan': '📅 学习计划',
        'topics': '📚 母题训练',
        'method': '💡 学霸方法',
        'thinking': '🧩 思维训练',
        'podcast': '🎧 播客课堂',
        'video': '📺 视频课堂',
        'games': '🎮 训练游戏',
        'deepseek': '🤖 DeepSeek',
        'wrongbook': '📒 错题本',
        'pomodoro': '🍅 番茄闹钟',
        'calculator': '🧮 计算器',
        'notepad': '📝 记事本',
        'usage-stats': '📊 AI使用统计',
        'settings': '⚙️ 设置',
        'my': '👤 我的',
        'selfdrive': '💪 自驱力训练',
        'backup': '💾 数据备份',
        'weekly': '📅 每周回顾',
        'progress': '📉 进步曲线',
        'mindmap': '🌳 思维导图'
    };
    
    titleEl.textContent = moduleTitles[module] || '模块';
    contentEl.innerHTML = ''; // 先清空内容，避免上一个模块的内容残留
    
    // settings模块特殊处理
    if (module === 'settings') {
        openSettingsPanel();
        closeFullscreenPage();
        return;
    }
    
    // V255: 直接调用渲染函数（所有模块已预先加载）
    switch(module) {
        case 'ai': if (typeof window.renderDeepseek === 'function') window.renderDeepseek(contentEl); break;
        case 'practice': if (typeof window.renderPractice === 'function') window.renderPractice(contentEl); break;
        case 'map': if (typeof window.renderMap === 'function') window.renderMap(contentEl); break;
        case 'plan': if (typeof window.renderPlan === 'function') window.renderPlan(contentEl); break;
        case 'topics': if (typeof window.renderTopics === 'function') window.renderTopics(contentEl); break;
        case 'method': if (typeof window.renderMethod === 'function') window.renderMethod(contentEl); break;
        case 'thinking': if (typeof window.renderThinking === 'function') window.renderThinking(contentEl); break;
        case 'podcast': if (typeof window.renderPodcast === 'function') window.renderPodcast(contentEl); break;
        case 'video': if (typeof window.renderVideo === 'function') window.renderVideo(contentEl); break;
        case 'games': if (typeof window.renderGames === 'function') window.renderGames(contentEl); break;
        case 'deepseek': if (typeof window.renderDeepseek === 'function') window.renderDeepseek(contentEl); break;
        case 'wrongbook': if (typeof window.renderWrongbook === 'function') window.renderWrongbook(contentEl); break;
        case 'pomodoro': if (typeof window.renderPomodoro === 'function') window.renderPomodoro(contentEl); break;
        case 'my': if (typeof window.renderMyPage === 'function') window.renderMyPage(contentEl); break;
        case 'calculator': if (typeof window.renderCalculator === 'function') window.renderCalculator(contentEl); break;
        case 'backup': if (typeof window.renderBackupManager === 'function') window.renderBackupManager(contentEl); break;
        case 'progress': if (typeof window.renderProgressChart === 'function') window.renderProgressChart(contentEl); break;
        case 'usage-stats': if (typeof window.renderUsageStats === 'function') window.renderUsageStats(contentEl); break;
        case 'weekly': if (typeof window.renderWeeklyReview === 'function') window.renderWeeklyReview(contentEl); break;
        case 'journal': 
            if (typeof window.renderNotepad === 'function') {
                window.renderNotepad(contentEl);
            } else {
                import('./modules/notepad.js').then(module => {
                    if (module.renderNotepad) module.renderNotepad(contentEl);
                });
            }
            break;
        case 'library': 
            if (typeof window.renderMindMap === 'function') {
                window.renderMindMap(contentEl);
            } else {
                contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>学习图书馆开发中...</p></div>';
            }
            break;
        case 'selfdrive': 
            if (typeof window.renderGoalPage === 'function') {
                // 自驱力训练使用模态框方式
                const modal = document.getElementById('detail-modal');
                if (modal) modal.classList.add('show');
                window.renderGoalPage();
            } else {
                contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>自驱力训练开发中...</p></div>';
            }
            break;
        case 'pet': 
            if (typeof window.renderPet === 'function') {
                window.renderPet(contentEl);
            } else {
                import('./ui-pet.js').then(module => {
                    if (module.renderPetPage) module.renderPetPage(contentEl);
                });
            }
            break;
        case 'growth': 
            contentEl.innerHTML = `
                <div style="padding:20px;">
                    <h3 style="margin-bottom:20px;font-size:18px;">📈 成长轨迹</h3>
                    <div style="background:white;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <canvas id="growth-chart-canvas" width="320" height="240" style="width:100%;height:auto;"></canvas>
                    </div>
                </div>
            `;
            setTimeout(() => {
                if (typeof window.renderGrowthChart === 'function') {
                    window.renderGrowthChart('growth-chart-canvas', 'week');
                }
            }, 100);
            break;
        default: contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>模块开发中...</p></div>';
    }
    
    // 统一添加返回按钮
    addBackButtonToModule(contentEl);
    
    container.classList.add('active');
}

/**
 * 为模块页面添加返回按钮（V229: 抽离为独立函数）
 */
function addBackButtonToModule(contentEl) {
    if (!contentEl) return;
    
    const existingBack = contentEl.querySelector('.module-back-btn');
    if (!existingBack) {
        const backBtn = document.createElement('button');
        backBtn.className = 'module-back-btn';
        backBtn.textContent = '← 返回首页';
        backBtn.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 32px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:24px;font-size:14px;cursor:pointer;z-index:100;backdrop-filter:blur(10px);box-shadow:0 2px 12px rgba(0,0,0,0.3);';
        backBtn.onclick = function() { closeFullscreenPage(); };
        contentEl.style.position = 'relative';
        contentEl.appendChild(backBtn);
    }
}

function closeFullscreenPage() { window.cleanupModuleState(); const el = document.getElementById('fullscreen-container'); if (el) el.classList.remove('active'); }

function handleLogin() {
    const data = window.loadData();
    const btn = document.querySelector('.user-select-btn');
    if (!btn || !btn.dataset.userId) {
        window.showToast('请先选择学习者');
        return;
    }
    const userId = btn.dataset.userId;
    const diffEl = document.getElementById('login-difficulty');
    const difficulty = diffEl ? parseInt(diffEl.value) : 1;
    const user = data.users.find(u => u.id === userId);
    if (user) { 
        user.difficulty = difficulty; 
        user.lastLogin = Date.now(); 
        data.currentUser = userId; 
        window.saveData(data); 
        // 先切换页面，再更新UI
        showPage('home');
        setTimeout(() => {
            updateUI();
            syncTodayStats();
            // 登录成功后显示欢迎语并语音播报
            showWelcomeMessage(user);
        }, 50);
    } else {
        window.showToast('用户不存在，请重新选择');
    }
}

function logoutAndReturn() {
    const user = window.getCurrentUserData();
    
    // 停止TTS
    stopTTSSpeech();
    
    // 显示今日学习总结（如果有用户）
    if (user) {
        showGoodbyeModal(user);
    }
    
    // 保留当前用户，不清除currentUser（用户名保留）
    closeUserMenu();
    closeSettingsPanel();
}

// ============================================================
// 完整退出系统函数 - 清除所有状态并返回未登录状态
// 版本: V144
// ============================================================
function doExitSystem() {
    console.log("执行完整退出系统...");
    
    // 1. 保留currentUser（用户名保留），只重置运行时状态
    var data = window.loadData();
    // 不清除currentUser，保留用户名
    window.saveData(data);
    
    // 2. 停止TTS语音
    if (typeof stopTTSSpeech === "function") {
        stopTTSSpeech();
    }
    
    // 3. 停止所有音视频播放
    var hiddenAudio = document.getElementById("hidden-audio");
    if (hiddenAudio) { hiddenAudio.pause(); hiddenAudio.removeAttribute("src"); hiddenAudio.load(); }
    
    var evpVideo = document.getElementById("evp-video");
    if (evpVideo) { evpVideo.pause(); evpVideo.removeAttribute("src"); evpVideo.load(); }
    
    var vpVideo = document.getElementById("vp-video");
    if (vpVideo) { vpVideo.pause(); vpVideo.removeAttribute("src"); vpVideo.load(); }
    
    var mpAudio = document.getElementById("mp-audio-element");
    var mpVideo = document.getElementById("mp-video-element");
    if (mpAudio) { mpAudio.pause(); mpAudio.removeAttribute("src"); mpAudio.load(); }
    if (mpVideo) { mpVideo.pause(); mpVideo.removeAttribute("src"); mpVideo.load(); }
    
    // 4. 重置所有播放器状态
    if (typeof audioCtx !== "undefined") {
        audioCtx.isPlaying = false;
        audioCtx.currentTrack = null;
        audioCtx.currentIndex = -1;
    }
    
    if (typeof videoCtx !== "undefined") {
        videoCtx.isPlaying = false;
        videoCtx.currentVideo = null;
    }
    
    if (typeof mediaPlayer !== "undefined") {
        mediaPlayer.isPlaying = false;
        mediaPlayer.currentMedia = null;
        mediaPlayer.currentIndex = -1;
    }
    
    // 5. 停止所有定时器
    if (typeof window.pomodoroTimer !== "undefined" && window.pomodoroTimer) {
        clearInterval(window.pomodoroTimer);
        window.pomodoroTimer = null;
    }
    
    if (typeof CTM !== "undefined" && CTM.timers) {
        Object.keys(CTM.timers).forEach(function(key) {
            clearInterval(CTM.timers[key]);
        });
        CTM.timers = {};
    }
    
    if (typeof allTimers !== "undefined") {
        allTimers.forEach(function(timer) { clearInterval(timer); });
        window.allTimers = [];
    }
    
    // 6. 关闭所有弹窗
    document.querySelectorAll(".modal, .modal-overlay, .show").forEach(function(modal) {
        modal.classList.remove("show");
    });
    
    var goodbyeModal = document.getElementById("goodbye-modal");
    if (goodbyeModal) goodbyeModal.remove();
    
    var videoModal = document.getElementById("video-player-modal");
    if (videoModal) videoModal.classList.remove("show");
    
    var audioPlayer = document.getElementById("audio-player-fullscreen");
    if (audioPlayer) audioPlayer.classList.remove("show");
    
    var enhancedVideo = document.getElementById("enhanced-video-player");
    if (enhancedVideo) enhancedVideo.style.display = "none";
    
    var mediaPlayerFs = document.getElementById("media-player-fullscreen");
    if (mediaPlayerFs) mediaPlayerFs.classList.remove("show");
    
    var userDropdown = document.getElementById("user-dropdown");
    if (userDropdown) userDropdown.classList.remove("show");
    
    var settingsPanel = document.getElementById("settings-panel");
    if (settingsPanel) settingsPanel.classList.remove("show");
    
    // 7. 关闭所有全屏页面
    var fullscreenEl = document.getElementById("fullscreen-container");
    if (fullscreenEl) {
        fullscreenEl.classList.remove("active");
        var fullscreenContent = document.getElementById("fullscreen-content");
        if (fullscreenContent) fullscreenContent.innerHTML = "";
    }
    
    // 8. 关闭游戏全屏
    var gameArea = document.getElementById("game-area");
    if (gameArea) {
        gameArea.classList.remove("active");
        gameArea.innerHTML = "";
    }
    
    // 9. 回到首页，保留用户数据
    showPage("home");
    
    // 重置UI显示（用户数据保留，直接显示当前用户信息）
    updateUI();
    syncTodayStats();
    
    console.log("系统已退出，用户数据已保留");
}

// 辅助函数：收集并清除所有定时器
window.allTimers = [];
var originalSetInterval = window.setInterval;
window.setInterval = function(func, delay) {
    var timer = originalSetInterval(func, delay);
    window.allTimers.push(timer);
    return timer;
};
// V148-fix: 切换用户后关闭全屏页面，回到首页刷新
function switchToUser(userId) {
    var data = window.loadData();
    var user = data.users.find(function(u) { return u.id === userId; });
    
    if (!user) {
        window.showToast('用户不存在');
        return;
    }
    
    data.currentUser = userId;
    window.saveData(data);
    closeUserSwitchModal();
    
    // 切换用户后关闭全屏页面，回到首页刷新
    closeFullscreenPage();
    showPage('home');
    updateUI();
    syncTodayStats();
    window.showToast('已切换到: ' + user.name);
}

function deleteUser(userId) {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return;
    
    var data = window.loadData();
    var userIndex = data.users.findIndex(function(u) { return u.id === userId; });
    
    if (userIndex === -1) {
        window.showToast('用户不存在');
        return;
    }
    
    var userName = data.users[userIndex].name;
    data.users.splice(userIndex, 1);
    
    // 如果删除的是当前用户，切换到第一个用户
    if (data.currentUser === userId) {
        if (data.users.length > 0) {
            data.currentUser = data.users[0].id;
        } else {
            data.currentUser = null;
        }
    }
    
    window.saveData(data);
    showUserSwitchModal(); // 刷新用户列表
    updateUI();
    window.showToast('已删除用户: ' + userName);
}

function registerNewUser() {
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-password-confirm').value;
    const grade = document.getElementById('reg-grade').value;
    const difficulty = parseInt(document.getElementById('reg-difficulty').value);
    const level = parseInt(document.getElementById('reg-level').value);
    
    // 验证姓名
    if (!name) {
        window.showToast('请输入姓名');
        return;
    }
    if (name.length > 10) {
        window.showToast('姓名不能超过10个字符');
        return;
    }
    
    // 验证手机号
    if (!phone) {
        window.showToast('请输入手机号');
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        window.showToast('请输入正确的手机号');
        return;
    }
    
    // 检查手机号是否已注册
    const data = window.loadData();
    if (data.users.find(u => u.phone === phone)) {
        window.showToast('该手机号已注册，请直接登录或切换用户');
        return;
    }
    
    // 验证密码
    if (!password) {
        window.showToast('请输入密码');
        return;
    }
    if (password.length < 6) {
        window.showToast('密码长度至少6位');
        return;
    }
    
    // 验证确认密码
    if (password !== confirmPassword) {
        window.showToast('两次输入的密码不一致');
        return;
    }
    
    // 验证年级
    if (!grade) {
        window.showToast('请选择年级');
        return;
    }
    
    // 创建新用户
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        phone: phone,
        password: password,
        grade: parseInt(grade),
        difficulty: difficulty,
        level: level,
        points: 0,
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            totalMinutes: 0,
            streakDays: 0,
            lastActiveDate: null
        },
        wrongNotes: [],
        completedTopics: [],
        weeklyProgress: {},
        gameScores: {},
        gameCounts: {},
        gameTimes: {},
        createTime: new Date().toISOString(),
        lastLoginTime: new Date().toISOString()
    };
    
    // 保存用户
    data.users.push(newUser);
    data.currentUser = newUser.id;
    window.saveData(data);
    
    // 关闭注册模态框
    document.getElementById('register-modal').classList.remove('show');
    
    // 更新UI
    updateUI();
    syncTodayStats();
    
    // 显示欢迎提示
    window.showToast('欢迎 ' + name + '！开始你的认知训练之旅吧！');
}

function openChangePasswordModal() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('change-password-modal').classList.add('show');
}

function closeCreateUserModal() { document.getElementById('create-user-modal').classList.remove('show'); document.getElementById('create-name').value = ''; }

function showCreateUserModal() { document.getElementById('create-user-modal').classList.add('show'); }

function openDifficultyModal() {
    const userData = window.getCurrentUserData();
    const currentLevel = userData ? userData.difficulty : 1;
    // 高亮当前选中的按钮
    document.querySelectorAll('.diff-btn').forEach(btn => {
        const isSelected = btn.dataset.level == currentLevel;
        btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
        btn.style.background = isSelected ? '#E8F4FF' : 'white';
    });
    document.getElementById('difficulty-modal').classList.add('show');
}

function closeDifficultyModal() {
    document.getElementById('difficulty-modal').classList.remove('show');
}

function setDifficulty(level) {
    const userData = window.getCurrentUserData();
    if (userData) {
        userData.difficulty = level;
        syncUserData(userData);
        // 更新首页难度显示
        const diffText = document.getElementById('difficulty-text');
        if (diffText) diffText.textContent = 'Lv.' + level;
        // 更新设置面板难度显示
        const settingsDiff = document.getElementById('settings-difficulty-display');
        if (settingsDiff) settingsDiff.textContent = 'Lv.' + level;
        // 更新下拉菜单中的难度信息
        const dropInfoEl = document.getElementById('dropdown-info');
        if (dropInfoEl) {
            dropInfoEl.textContent = gradeNames[userData.grade] + ' · Lv.' + level;
        }
        // 高亮当前选中的按钮
        document.querySelectorAll('.diff-btn').forEach(btn => {
            const isSelected = btn.dataset.level == level;
            btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
            btn.style.background = isSelected ? '#E8F4FF' : 'white';
        });
        window.showToast('难度已调整为 Lv.' + level);
    }
    closeDifficultyModal();
}

function toggleUserSelect() {
    document.getElementById('user-select-dropdown').classList.toggle('show');
    document.querySelector('.user-select-btn').classList.toggle('active');
}

function switchMainTab(tab, element) {
    // 更新导航栏状态
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');
    
    // 如果是首页，关闭所有全屏页面并清理状态
    if (tab === 'home') {
        closeFullscreenPage();
        closeSettingsPanel();
        window.cleanupModuleState(); // 清理所有模块状态，包括播放器
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function formatTimeFull(seconds) { if (!seconds || isNaN(seconds)) return '0:00'; var mins = Math.floor(seconds / 60); var secs = Math.floor(seconds % 60); return mins + ':' + (secs < 10 ? '0' : '') + secs; }

function generateCalendar() {
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    let html = '';
    days.forEach((d, i) => {
        const isToday = i === new Date().getDay() - 1;
        const checked = Math.random() > 0.5;
        html += '<div class="calendar-day ' + (isToday ? 'today' : '') + ' ' + (checked ? 'checked' : '') + '">' + d + '</div>';
    });
    return html;
}

function generateHeatmap() {
    let html = '';
    const colors = ['#f0f0f0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    for (let i = 0; i < 28; i++) {
        const level = Math.floor(Math.random() * 5);
        html += '<div class="heatmap-cell" style="background:' + colors[level] + ';"></div>';
    }
    return html;
}

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

function updateUI() {
    updateAllAvatarDisplays();

    const user = window.getCurrentUserData();
    if (!user) return;
    const greetingEl = document.getElementById('greeting-name');
    const diffEl = document.getElementById('difficulty-text');
    const avatarEl = document.getElementById('header-avatar');
    const dropNameEl = document.getElementById('dropdown-name');
    const dropInfoEl = document.getElementById('dropdown-info');
    if (greetingEl) greetingEl.textContent = user.name;
    if (diffEl) diffEl.textContent = 'Lv.' + user.difficulty;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0);
    if (dropNameEl) dropNameEl.textContent = user.name;
    if (dropInfoEl) dropInfoEl.textContent = gradeNames[user.grade] + ' · Lv.' + user.difficulty;
    
    // 更新首页推荐卡片
}

// 更新首页推荐卡片 - 从播客课程中随机选取
function updateRecommendCard() {
    // V151: 推荐卡片已禁用
    return;
}

function toggleSettingsGroup(groupId) {
    const group = document.getElementById('group-' + groupId);
    if (group) {
        group.classList.toggle('open');
    }
}

function openSettingsPanel() {
    const user = window.getCurrentUserData();
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

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('show');
    }
}

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // 显示目标页面
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        target.style.display = pageId === 'login' ? 'flex' : 'block';
    }
    
    // 登录页面隐藏底部导航
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = pageId === 'login' ? 'none' : 'flex';
    }
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


function selectThinkingOpt(el, selectedIdx, questionIdx) {
    const parent = el.parentElement;
    parent.querySelectorAll('.thinking-opt').forEach(opt => {
        opt.style.background = 'white';
        opt.style.borderColor = '#e0e0e0';
    });
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    el.dataset.selected = selectedIdx;
}

function drawRadarChart(data) {
    const svg = document.getElementById('cognitive-radar');
    if (!svg) return;
    
    const centerX = 200, centerY = 200;
    const maxRadius = 120;
    const labels = ['专注力', '记忆力', '思维力', '反应力', '坚持力', '元认知'];
    const values = [data.attention, data.memory, data.thinking, data.reaction, data.persistence, data.metacognition];
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#f093fb', '#fa709a'];
    const icons = ['🎯', '🧠', '💡', '⚡', '🏃', '🔮'];
    const numAxes = 6;
    const angleStep = (2 * Math.PI) / numAxes;
    
    let svgContent = '';
    
    // 定义渐变
    svgContent += `<defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.4"/>
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.3"/>
        </linearGradient>
    </defs>`;
    
    // 绘制背景网格（渐变色）
    for (let level = 1; level <= 5; level++) {
        const r = (maxRadius / 5) * level;
        let points = [];
        for (let i = 0; i < numAxes; i++) {
            const angle = -Math.PI / 2 + i * angleStep;
            points.push(`${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`);
        }
        const opacity = level === 5 ? 0.3 : 0.15;
        svgContent += `<polygon points="${points.join(' ')}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`;
    }
    
    // 绘制轴线（带颜色指示）
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        svgContent += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="${colors[i]}33" stroke-width="2"/>`;
        
        // 标签（带图标和数值）
        const labelX = centerX + (maxRadius + 30) * Math.cos(angle);
        const labelY = centerY + (maxRadius + 30) * Math.sin(angle);
        svgContent += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="bold" fill="${colors[i]}">${labels[i]}</text>`;
        
        // 数值标签
        const valueX = centerX + (maxRadius + 55) * Math.cos(angle);
        const valueY = centerY + (maxRadius + 55) * Math.sin(angle);
        svgContent += `<text x="${valueX}" y="${valueY}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#999">${values[i]}</text>`;
    }
    
    // 绘制数据区域（渐变填充）
    let dataPoints = [];
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const value = values[i] / 100;
        const r = maxRadius * value;
        dataPoints.push(`${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`);
    }
    svgContent += `<polygon points="${dataPoints.join(' ')}" fill="url(#radarGradient)" stroke="#667eea" stroke-width="2.5"/>`;
    
    // 绘制数据点（每个点不同颜色）
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const value = values[i] / 100;
        const r = maxRadius * value;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        // 外圈光晕
        svgContent += `<circle cx="${x}" cy="${y}" r="8" fill="${colors[i]}33"/>`;
        // 内圈实心点
        svgContent += `<circle cx="${x}" cy="${y}" r="5" fill="${colors[i]}" stroke="white" stroke-width="2"/>`;
    }
    
    svg.innerHTML = svgContent;
}

function calculateCognitiveData() {
    const user = window.getCurrentUserData();
    if (!user) {
        return getDefaultCognitiveData();
    }
    
    // 获取各类统计数据
    const gameScores = user.gameScores || {};
    const gameCounts = user.gameCounts || {};
    const methodStats = user.methodStats || {};
    const thinkingStats = user.thinkingStats || {};
    let todayStats = user.todayStats || { questions: 0, correct: 0, minutes: 0 };


// ====== 1. 专注力计算 ======
// 来源：舒尔特方格、视觉搜索、快速点击
    let attentionScore = 50; // 基础分
    const attentionGames = ['schulte', 'visual', 'tap'];
    attentionGames.forEach(g => {
        if (gameScores[g]) attentionScore += Math.min(gameScores[g] / 10, 12);
        if (gameCounts[g]) attentionScore += Math.min(gameCounts[g] * 2, 6);
    });


// ====== 2. 记忆力计算 ======
// 来源：数字记忆、图形记忆、学霸方法记忆训练
    let memoryScore = 50;
    const memoryGames = ['digit', 'pattern'];
    memoryGames.forEach(g => {
        if (gameScores[g]) memoryScore += Math.min(gameScores[g] / 8, 15);
        if (gameCounts[g]) memoryScore += Math.min(gameCounts[g] * 3, 8);
    });
    // 学霸方法 - 记忆法训练 (methodId: memory)
    if (methodStats['memory']) {
        const stats = methodStats['memory'];
        memoryScore += Math.min(stats.completed * 3, 15);
        if (stats.completed > 0) memoryScore += Math.round((stats.correct / stats.completed) * 10);
    }


// ====== 3. 思维力计算 ======
// 来源：图形推理、找不同、思维训练（逻辑、批判、系统、逆向、抽象）
    let thinkingScore = 50;
    const thinkingGames = ['reason', 'diff'];
    thinkingGames.forEach(g => {
        if (gameScores[g]) thinkingScore += Math.min(gameScores[g] / 10, 12);
        if (gameCounts[g]) thinkingScore += Math.min(gameCounts[g] * 2, 6);
    });
    // 思维训练统计 (type: logic, critical, system, reverse, abstract)
    const thinkingTypes = ['logic', 'critical', 'system', 'reverse', 'abstract'];
    thinkingTypes.forEach(t => {
        if (thinkingStats[t]) {
            thinkingScore += Math.min(thinkingStats[t].completed * 2, 5);
        }
    });


// ====== 4. 反应力计算 ======
// 来源：快速点击、颜色识别、反应速度游戏
    let reactionScore = 50;
    const reactionGames = ['tap', 'color', 'schulte'];
    reactionGames.forEach(g => {
        if (gameScores[g]) reactionScore += Math.min(gameScores[g] / 10, 15);
        if (gameCounts[g]) reactionScore += Math.min(gameCounts[g] * 3, 10);
    });
    // 快速反应训练 (type: quick)
    if (thinkingStats['quick']) {
        reactionScore += Math.min(thinkingStats['quick'].completed * 4, 12);
    }


// ====== 5. 坚持力计算 ======
// 来源：学习连续性、总训练量、连续打卡天数
    let persistenceScore = 50;
    // 连续学习天数
    const streakDays = calculateStreakDays(user);
    persistenceScore += Math.min(streakDays * 3, 15);
    // 今日学习时长
    if (todayStats.minutes > 0) persistenceScore += Math.min(todayStats.minutes / 5, 10);
    // 总训练量（游戏完成总数）
    const totalGamesPlayed = Object.values(gameCounts).reduce((sum, count) => sum + count, 0);
    persistenceScore += Math.min(totalGamesPlayed * 2, 15);


// ====== 6. 元认知计算 ======
// 来源：学霸方法训练总数、思维训练总数、AI问答次数
    let metacognitionScore = 50;
    // 学霸方法总训练量
    const methodTotal = Object.values(methodStats).reduce((sum, s) => sum + (s.completed || 0), 0);
    metacognitionScore += Math.min(methodTotal * 2, 15);
    // 思维训练总完成量
    const thinkingTotal = Object.values(thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0);
    metacognitionScore += Math.min(thinkingTotal * 2, 15);
    // AI问答次数
    if (user.aiChatCount) metacognitionScore += Math.min(user.aiChatCount, 10);
    
    // 限制在 20-100 范围
    return {
        attention: Math.max(20, Math.min(100, Math.round(attentionScore))),
        memory: Math.max(20, Math.min(100, Math.round(memoryScore))),
        thinking: Math.max(20, Math.min(100, Math.round(thinkingScore))),
        reaction: Math.max(20, Math.min(100, Math.round(reactionScore))),
        persistence: Math.max(20, Math.min(100, Math.round(persistenceScore))),
        metacognition: Math.max(20, Math.min(100, Math.round(metacognitionScore))),
        // 额外数据用于详情展示
        sources: {
            attention: { games: attentionGames.filter(g => gameCounts[g]), method: false },
            memory: { games: memoryGames.filter(g => gameCounts[g]), method: !!methodStats['memory'] },
            thinking: { games: thinkingGames.filter(g => gameCounts[g]), training: thinkingTypes.filter(t => thinkingStats[t]) },
            reaction: { games: reactionGames.filter(g => gameCounts[g]), training: thinkingStats['quick'] ? ['quick'] : [] },
            persistence: { streakDays, minutes: todayStats.minutes },
            metacognition: { methodTotal, thinkingTotal, aiChats: user.aiChatCount || 0 }
        }
    };
}

function getDefaultCognitiveData() {
    return {
        attention: 50,
        memory: 50,
        thinking: 50,
        reaction: 50,
        persistence: 50,
        metacognition: 50,
        sources: { attention: {}, memory: {}, thinking: {}, reaction: {}, persistence: {}, metacognition: {} }
    };
}

function renderCognitiveDetails(data) {
    const details = [
        { 
            key: 'attention', 
            label: '专注力', 
            icon: '🎯', 
            color: '#667eea',
            desc: '注意力集中与抗干扰能力',
            tip: '多玩舒尔特方格、视觉搜索、快速点击可提升'
        },
        { 
            key: 'memory', 
            label: '记忆力', 
            icon: '🧠', 
            color: '#764ba2',
            desc: '信息存储与提取能力',
            tip: '数字记忆、图形记忆游戏和记忆法训练可提升'
        },
        { 
            key: 'thinking', 
            label: '思维力', 
            icon: '💡', 
            color: '#f093fb',
            desc: '逻辑推理与问题解决能力',
            tip: '图形推理、找不同游戏和思维训练可提升'
        },
        { 
            key: 'reaction', 
            label: '反应力', 
            icon: '⚡', 
            color: '#f5576c',
            desc: '快速反应与应变能力',
            tip: '快速点击、颜色识别、舒尔特方格可提升'
        },
        { 
            key: 'persistence', 
            label: '坚持力', 
            icon: '🏃', 
            color: '#f093fb',
            desc: '持续学习与坚韧不拔',
            tip: '保持连续学习、完成多种训练可提升'
        },
        { 
            key: 'metacognition', 
            label: '元认知', 
            icon: '🔮', 
            color: '#fa709a',
            desc: '自我监控与反思能力',
            tip: '学霸方法训练、思维训练、AI问答可提升'
        }
    ];
    
    return details.map(d => `
        <div class="cognitive-detail-card">
            <div class="detail-header">
                <div class="detail-icon" style="background: ${d.color}20;">${d.icon}</div>
                <div>
                    <div class="detail-title">${d.label}</div>
                    <div style="font-size:11px;color:#999;">${d.desc}</div>
                </div>
                <div class="detail-score" style="color: ${d.color};">${data[d.key]}</div>
            </div>
            <div class="detail-bar">
                <div class="detail-bar-fill" style="width: ${data[d.key]}%; background: ${d.color};"></div>
            </div>
            <div class="detail-sources">💡 ${d.tip}</div>
        </div>
    `).join('');
}

function renderCognitiveRadar(container) {
    // 获取用户认知数据（基于真实训练数据计算）
    const cognitiveData = calculateCognitiveData();
    
    const html = `
        <div class="cognitive-map-container">
            <div class="radar-chart-wrapper">
                <svg id="cognitive-radar" viewBox="0 0 400 400"></svg>
            </div>
            <div class="cognitive-stats">
                <h3 style="font-size:16px;font-weight:bold;margin-bottom:8px;">六维能力分析</h3>
                <p style="font-size:12px;color:#666;margin-bottom:12px;">基于你的训练数据实时计算</p>
                <div class="stat-grid">
                    ${renderStatItems(cognitiveData)}
                </div>
            </div>
            <div class="cognitive-detail" style="width:100%;margin-top:16px;">
                <h4 style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 能力详情</h4>
                ${renderCognitiveDetails(cognitiveData)}
            </div>
        </div>
        <style>
            .cognitive-map-container { display: flex; flex-direction: column; align-items: center; padding: 16px; }
            .radar-chart-wrapper { width: 280px; height: 280px; }
            .cognitive-stats { width: 100%; margin-top: 16px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
            .stat-item { padding: 12px 8px; border-radius: 12px; text-align: center; color: white; position: relative; }
            .stat-value { font-size: 22px; font-weight: bold; }
            .stat-label { font-size: 11px; opacity: 0.9; margin-top: 2px; }
            .stat-trend { font-size: 10px; position: absolute; top: 4px; right: 8px; }
            .cognitive-detail-card { background: white; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .detail-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .detail-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
            .detail-title { font-size: 14px; font-weight: 600; }
            .detail-score { margin-left: auto; font-size: 18px; font-weight: bold; }
            .detail-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
            .detail-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
            .detail-sources { font-size: 11px; color: #999; margin-top: 8px; }
        </style>
    `;
    container.innerHTML = html;
    
    // 绘制雷达图
    setTimeout(() => drawRadarChart(cognitiveData), 100);
}

function renderStatItems(data) {
    const items = [
        {label: '专注力', value: data.attention, color: '#667eea', icon: '🎯'},
        {label: '记忆力', value: data.memory, color: '#764ba2', icon: '🧠'},
        {label: '思维力', value: data.thinking, color: '#f093fb', icon: '💡'},
        {label: '反应力', value: data.reaction, color: '#f5576c', icon: '⚡'},
        {label: '坚持力', value: data.persistence, color: '#f093fb', icon: '🏃'},
        {label: '元认知', value: data.metacognition, color: '#fa709a', icon: '🔮'}
    ];
    
    return items.map(item => `
        <div class="stat-item" style="background: linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%);">
            <div style="font-size:16px;margin-bottom:2px;">${item.icon}</div>
            <div class="stat-value">${item.value}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

function updateAllAvatarDisplays() {
    const user = window.getCurrentUserData();
    if (!user) return;
    
    const avatar = user.avatar || AVATAR_LIST[0].emoji;
    const headerAvatar = document.getElementById('header-avatar');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const settingsAvatar = document.getElementById('settings-avatar');
    
    if (headerAvatar) headerAvatar.textContent = avatar;
    if (dropdownAvatar) dropdownAvatar.textContent = avatar;
    if (settingsAvatar) settingsAvatar.textContent = user.name.charAt(0);
}

function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
            <div style="font-size:48px;margin-bottom:12px;">🧠</div>
            <div style="font-size:20px;font-weight:bold;color:#333;margin-bottom:8px;">认知训练门户</div>
            <div style="font-size:13px;color:#999;margin-bottom:20px;">版本 V144</div>
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
        <button class="modal-close" onclick="window.closeModal()" style="width:100%;">关闭</button>
    `;
}

function selectAvatar(emoji) {
    const user = window.getCurrentUserData();
    if (user) {
        user.avatar = emoji;
        syncUserData(user);
        updateAllAvatarDisplays();
        window.showToast('头像已更换');
    }
    closeAvatarModal();
}

function updateMethodStats() {
    const user = window.getCurrentUserData();
    const stats = user?.methodStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('method-completed');
    const accuracyEl = document.getElementById('method-accuracy');
    const notesEl = document.getElementById('method-notes');
    
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
    if (notesEl) notesEl.textContent = (user?.methodNotes?.length || 0);
}

function updateThinkingStats() {
    const user = window.getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('thinking-completed');
    const accuracyEl = document.getElementById('thinking-accuracy');
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
}

function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

function switchPlanDay(day) {
    window._planDay = day;
    const el = document.getElementById('module-content');
    if (el) window.renderPlan(el);
}

// ============================================================
// 暴露全局函数到 window 对象
// ============================================================
window.closeChangePasswordModal = closeChangePasswordModal;
window.closeCreateUserModal = closeCreateUserModal;
window.closeDifficultyModal = closeDifficultyModal;
window.closeEditProfileModal = closeEditProfileModal;
window.closeFullscreenPage = closeFullscreenPage;
window.closeUserMenu = closeUserMenu;
window.exitSystem = exitSystem;
window.logoutAndReturn = logoutAndReturn;
window.doExitSystem = doExitSystem;
window.openAbout = openAbout;
window.openChangePasswordModal = openChangePasswordModal;
window.openDifficultyModal = openDifficultyModal;
window.openEditProfileModal = openEditProfileModal;
window.openFullscreenPage = openFullscreenPage;
window.openHelp = openHelp;
window.openSettingsPanel = openSettingsPanel;
window.closeSettingsPanel = closeSettingsPanel;
window.savePasswordChanges = savePasswordChanges;
window.setDifficulty = setDifficulty;
window.toggleUserMenu = toggleUserMenu;
window.switchMainTab = switchMainTab;
window.updateHomeUserInfo = updateHomeUserInfo;
window.openRegisterModal = openRegisterModal;
window.handleLogin = handleLogin;
window.selectAvatar = selectAvatar;
window.selectGrade = selectGrade;
window.selectSubject = selectSubject;
window.closeAboutModal = closeAboutModal;
window.closeApiConfigModal = closeApiConfigModal;
window.closeAvatarModal = closeAvatarModal;
window.closeModal = closeModal;
window.closeUpdateModal = closeUpdateModal;
window.closeWelcomeModal = closeWelcomeModal;
window.deleteUser = deleteUser;
window.registerNewUser = registerNewUser;
window.showToast = showToast;
window.escapeHtml = escapeHtml;
window.switchToUser = switchToUser;
window.updateUI = updateUI;
window.switchPlanDay = switchPlanDay;
window.showWelcomeMessage = showWelcomeMessage;
window.toggleTask = toggleTask;

function showWelcomeMessage(user) {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let emoji = '';
    
    if (hour >= 5 && hour < 12) {
        timeGreeting = '早上好';
        emoji = '🌅';
    } else if (hour >= 12 && hour < 14) {
        timeGreeting = '中午好';
        emoji = '☀️';
    } else if (hour >= 14 && hour < 18) {
        timeGreeting = '下午好';
        emoji = '🌤️';
    } else if (hour >= 18 && hour < 22) {
        timeGreeting = '晚上好';
        emoji = '🌙';
    } else {
        timeGreeting = '夜深了';
        emoji = '🌟';
    }
    
    // 计算连续学习天数
    const streakDays = calculateStreakDays(user);
    
    // 构建欢迎语
    let welcomeMsg = `${emoji} ${timeGreeting}，${user.name}！`;
    let voiceMsg = `${timeGreeting}，${user.name}！`;
    
    if (streakDays > 0) {
        welcomeMsg += `\n🔥 已连续学习 ${streakDays} 天，太棒了！`;
        voiceMsg += `你已经连续学习${streakDays}天了，太棒了！继续加油！`;
    } else {
        welcomeMsg += '\n📚 今天是新的一天，开始你的学习之旅吧！';
        voiceMsg += '今天是新的一天，开始你的学习之旅吧！';
    }
    
    // 显示欢迎弹窗
    showWelcomeModal(welcomeMsg, user.name, streakDays);
    
    // 语音播报
    speakText(voiceMsg);
}

function toggleSoundEffects() {
    const enabled = SoundEffects.toggle();
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
        if (enabled) {
            btn.textContent = '已开启';
            btn.style.background = '#43E97B';
            // 播放提示音
            SoundEffects.playClick();
        } else {
            btn.textContent = '已关闭';
            btn.style.background = '#f0f0f0';
            btn.style.color = '#666';
        }
    }
}

function toggleTask(el) {
    const checkbox = el.querySelector('.task-checkbox');
    checkbox.classList.toggle('checked');
    el.classList.toggle('completed');
}





if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}



// ============================================================
// 初始化函数 - 页面加载完成后执行
// ============================================================

// 更新首页用户信息显示
function updateHomeUserInfo(user) {
    if (!user) {
        user = window.getCurrentUserData();
    }
    if (!user) return;
    
    const gradeNames = {5:'五年级',6:'六年级',7:'初一',8:'初二',9:'初三'};
    const name = user.name || '同学';
    const grade = gradeNames[user.grade] || '未知';
    const difficulty = user.difficulty || 1;
    const avatar = user.avatar || '👤';
    
    // 更新问候语
    const greetingEl = document.getElementById('greeting-name');
    if (greetingEl) greetingEl.textContent = name;
    
    // 更新下拉菜单
    const dropdownNameEl = document.getElementById('dropdown-name');
    if (dropdownNameEl) dropdownNameEl.textContent = name;
    
    const dropdownInfoEl = document.getElementById('dropdown-info');
    if (dropdownInfoEl) dropdownInfoEl.textContent = grade + ' · Lv.' + difficulty;
    
    // 更新难度标签
    const diffTextEl = document.getElementById('difficulty-text');
    if (diffTextEl) diffTextEl.textContent = 'Lv.' + difficulty;
    
    // 更新头像
    updateAllAvatarDisplays();
    
    // 更新今日统计
    updateTodayStats();
}

// 更新今日统计
function updateTodayStats() {
    const user = window.getCurrentUserData();
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { date: today, questions: 0, correct: 0, minutes: 0 };
    
    // 如果不是今天，重置统计
    if (todayStats.date !== today) {
        todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
        user.todayStats = todayStats;
        syncUserData(user);
    }
    
    // 计算连续学习天数（基于studyDays）
    const studyDays = user.studyDays || {};
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (studyDays[dateStr]) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    // 更新显示
    const questionsEl = document.getElementById('today-questions');
    const correctEl = document.getElementById('today-correct');
    const minutesEl = document.getElementById('today-minutes');
    const streakEl = document.getElementById('today-streak');
    
    if (questionsEl) questionsEl.textContent = todayStats.questions || 0;
    if (correctEl) correctEl.textContent = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) + '%' : '0%';
    if (minutesEl) minutesEl.textContent = todayStats.minutes || 0;
    if (streakEl) streakEl.textContent = streak;
}

// 注意：initPortal函数现在在main.js中定义，这里不再重复定义

// ============================================================

// ====== 删除用户功能 ======
function showDeleteUserModal() {
    closeUserMenu();
    var data = window.loadData();
    
    if (data.users.length === 0) {
        window.showToast('暂无用户');
        return;
    }
    
    var container = document.getElementById('delete-user-list');
    if (!container) {
        window.showToast('页面加载异常');
        return;
    }
    
    var colors = ['#667eea', '#FF9A63', '#43E97B'];
    var htmlContent = '';
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:10px;padding:10px;background:' + (isCurrent ? '#fff3f3' : '#f8f9fa') + ';border-radius:8px;margin-bottom:8px;">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div style="flex:1;">';
        htmlContent += '<div style="font-weight:600;">' + u.name + (isCurrent ? ' (当前用户)' : '') + '</div>';
        htmlContent += '<div style="font-size:11px;color:#999;">' + (gradeNames ? gradeNames[u.grade] || '' : '') + ' · Lv.' + u.difficulty + '</div>';
        htmlContent += '</div>';
        if (isCurrent) {
            htmlContent += '<span style="font-size:11px;color:#ff6b6b;">不可删除</span>';
        } else {
            htmlContent += '<button onclick="deleteUser(\'' + u.id + '\');showDeleteUserModal();" style="background:#ff6b6b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('delete-user-modal').classList.add('show');
}

function closeDeleteUserModal() {
    var el = document.getElementById('delete-user-modal');
    if (el) el.classList.remove('show');
}

window.showDeleteUserModal = showDeleteUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.updateRecommendCard = updateRecommendCard;

// ============================================================
// 数据导入导出功能
// ============================================================

// 显示数据统计弹窗
function showDataStatsModal() {
    const user = window.getCurrentUserData();
    if (!user) {
        window.showToast('请先登录');
        return;
    }
    
    const wrongNotes = user.wrongNotes || [];
    const stats = user.stats || {};
    const studyDays = user.studyDays || {};
    
    // 计算统计数据
    const totalDays = Object.keys(studyDays).length;
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { questions: 0, correct: 0, minutes: 0 };
    const accuracy = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) : 0;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    modal.classList.add('show');
    content.innerHTML = '<div class="modal-header" style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><div class="modal-title">📊 学习数据统计</div></div><div style="max-height:400px;overflow-y:auto;"><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;color:white;margin-bottom:16px;"><div style="font-size:14px;opacity:0.9;margin-bottom:8px;">今日学习</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;"><div><div style="font-size:24px;font-weight:bold;">' + (todayStats.questions || 0) + '</div><div style="font-size:11px;opacity:0.8;">完成题目</div></div><div><div style="font-size:24px;font-weight:bold;">' + accuracy + '%</div><div style="font-size:11px;opacity:0.8;">正确率</div></div><div><div style="font-size:24px;font-weight:bold;">' + (todayStats.minutes || 0) + '</div><div style="font-size:11px;opacity:0.8;">学习分钟</div></div></div></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;"><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#FF6B6B;">' + wrongNotes.length + '</div><div style="font-size:11px;color:#666;">错题数量</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#43E97B;">' + totalDays + '</div><div style="font-size:11px;color:#666;">学习天数</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#667eea;">' + (stats.totalQuestions || 0) + '</div><div style="font-size:11px;color:#666;">累计题目</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#FF9A63;">' + (stats.totalMinutes || 0) + '</div><div style="font-size:11px;color:#666;">累计分钟</div></div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;"><div style="font-size:13px;font-weight:600;margin-bottom:8px;color:#333;">📈 历史正确率</div><div style="font-size:28px;font-weight:bold;color:#43E97B;">' + (stats.totalQuestions > 0 ? Math.round((stats.correctAnswers || 0) / stats.totalQuestions * 100) : 0) + '%</div><div style="font-size:11px;color:#999;margin-top:4px;">' + (stats.correctAnswers || 0) + ' / ' + (stats.totalQuestions || 0) + ' 题</div></div></div><button class="modal-close" onclick="window.closeModal()" style="margin-top:16px;width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">关闭</button>';
}

// 导出数据
function exportData() {
    const data = window.loadData();
    if (!data) {
        window.showToast('导出失败，无数据');
        return;
    }
    const exportData = {
        version: 'V144',
        exportTime: new Date().toISOString(),
        users: data.users.map(function(u) {
            return {
                id: u.id, name: u.name, grade: u.grade, difficulty: u.difficulty, points: u.points,
                createdAt: u.createdAt, stats: u.stats, weeklyProgress: u.weeklyProgress,
                wrongNotes: u.wrongNotes, completedTopics: u.completedTopics, studyDays: u.studyDays,
                todayStats: u.todayStats, methodStats: u.methodStats, thinkingStats: u.thinkingStats,
                gameScores: u.gameScores, gameCounts: u.gameCounts, aiChatCount: u.aiChatCount
            };
        }),
        currentUser: data.currentUser
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognitive_training_backup_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast('数据导出成功！');
}

// 导入数据
function importData() {
    const fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.click();
}

// 处理导入文件
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData || !importedData.users || !Array.isArray(importedData.users)) {
                window.showToast('文件格式错误');
                return;
            }
            if (!confirm('确定要导入数据吗？这将覆盖当前所有用户数据！')) return;
            const currentData = window.loadData();
            importedData.users.forEach(function(u) {
                const existingIdx = currentData.users.findIndex(function(cu) { return cu.id === u.id; });
                if (existingIdx >= 0) currentData.users[existingIdx] = u;
                else currentData.users.push(u);
            });
            if (importedData.currentUser && currentData.users.find(u => u.id === importedData.currentUser)) {
                currentData.currentUser = importedData.currentUser;
            }
            window.saveData(currentData);
            updateUI();
            window.showToast('数据导入成功！');
        } catch(err) {
            console.error('导入失败:', err);
            window.showToast('导入失败：' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

window.showDataStatsModal = showDataStatsModal;
window.exportData = exportData;
window.importData = importData;
window.handleImportFile = handleImportFile;

// V195-fix: 暴露认知地图相关函数到全局
window.calculateCognitiveData = calculateCognitiveData;
window.getDefaultCognitiveData = getDefaultCognitiveData;
window.drawRadarChart = drawRadarChart;

// ============================================================
// 新增/修复的功能函数
// ============================================================

// 清除当前用户数据
function clearCurrentUserData() {
    const user = window.getCurrentUserData();
    if (!user) {
        window.showToast('请先登录');
        return;
    }
    
    if (!confirm('确定要清除 ' + user.name + ' 的所有数据吗？')) return;
    
    user.stats = { totalQuestions: 0, correctAnswers: 0, totalMinutes: 0, streakDays: 0 };
    user.wrongNotes = [];
    user.completedTopics = [];
    user.weeklyProgress = {};
    user.studyDays = {};
    user.todayStats = { questions: 0, correct: 0, minutes: 0 };
    user.methodStats = {};
    user.thinkingStats = {};
    user.gameScores = {};
    user.gameCounts = {};
    user.points = 0;
    
    syncUserData(user);
    updateUI();
    window.showToast('数据已清除');
    closeUserMenu();
}

// 清除所有数据
function clearAllData() {
    if (!confirm('⚠️ 确定要清除所有本地数据吗？此操作不可恢复！')) return;
    
    localStorage.removeItem('cognitive_training_data');
    localStorage.removeItem('self_drive_goals');
    localStorage.removeItem('self_drive_habits');
    localStorage.removeItem('self_drive_achievements');
    localStorage.removeItem('self_drive_diary');
    localStorage.removeItem('self_drive_checkins');
    
    closeSettingsPanel();
    window.showToast('所有数据已清除，页面即将刷新');
    setTimeout(() => location.reload(), 1500);
}

// 同步数据（简化版 - 仅保存到本地）
function syncData() {
    const data = window.loadData();
    if (!data) {
        window.showToast('无数据可同步');
        return;
    }
    
    window.saveData(data);
    const syncBtn = document.getElementById('sync-btn');
    const syncTimeEl = document.getElementById('last-sync-time');
    if (syncBtn) {
        syncBtn.textContent = '同步中...';
        syncBtn.disabled = true;
    }
    
    setTimeout(() => {
        if (syncBtn) {
            syncBtn.textContent = '同步';
            syncBtn.disabled = false;
        }
        if (syncTimeEl) {
            syncTimeEl.textContent = '上次同步：' + new Date().toLocaleString();
        }
        window.showToast('数据同步完成');
    }, 1000);
}

// 打开API配置弹窗
function openApiConfigModal(type) {
    const modal = document.getElementById('api-config-modal');
    if (!modal) {
        window.showToast('功能加载中，请稍后再试');
        return;
    }
    
    const titleEl = document.getElementById('api-config-title');
    const keyEl = document.getElementById('api-key-input');
    const keyDisplay = document.getElementById('api-' + type + '-status');
    
    if (titleEl) {
        const titles = { 'deepseek': 'DeepSeek API Key 配置', 'peerjs': 'PeerJS 服务器配置' };
        titleEl.textContent = titles[type] || 'API 配置';
    }
    
    if (keyEl) {
        const savedKey = localStorage.getItem('api_' + type + '_key') || '';
        keyEl.value = savedKey;
        keyEl.dataset.type = type;
    }
    
    modal.classList.add('show');
}

// 保存API配置
function saveApiConfig() {
    const keyEl = document.getElementById('api-key-input');
    if (!keyEl) return;
    
    const type = keyEl.dataset.type || 'deepseek';
    const key = keyEl.value.trim();
    
    localStorage.setItem('api_' + type + '_key', key);
    
    // 更新状态显示
    const statusEl = document.getElementById('api-' + type + '-status');
    if (statusEl) {
        statusEl.textContent = key ? '已配置' : '状态：未配置';
    }
    
    closeApiConfigModal();
    window.showToast('配置已保存');
}

// 显示用户切换模态框
function showUserSwitchModal() {
    closeUserMenu();
    const data = window.loadData();
    
    if (data.users.length === 0) {
        window.showToast('暂无用户，请先创建');
        return;
    }
    
    const container = document.getElementById('user-switch-list');
    if (!container) {
        window.showToast('页面加载异常');
        return;
    }
    
    const colors = ['#667eea', '#FF9A63', '#43E97B'];
    let htmlContent = '';
    
    data.users.forEach(function(u, i) {
        const isCurrent = u.id === data.currentUser;
        htmlContent += '<div onclick="switchToUser(\'' + u.id + '\')" style="display:flex;align-items:center;gap:10px;padding:12px;background:' + (isCurrent ? '#fff3f3' : '#f8f9fa') + ';border-radius:8px;margin-bottom:8px;cursor:pointer;' + (isCurrent ? 'border:2px solid #667eea;' : '') + '">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:bold;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div style="flex:1;">';
        htmlContent += '<div style="font-weight:600;font-size:15px;">' + u.name + '</div>';
        htmlContent += '<div style="font-size:12px;color:#999;">' + (gradeNames[u.grade] || '') + ' · Lv.' + u.difficulty + '</div>';
        htmlContent += '</div>';
        if (isCurrent) {
            htmlContent += '<span style="font-size:12px;color:#667eea;font-weight:600;">当前登录</span>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('user-switch-modal').classList.add('show');
}

function closeUserSwitchModal() {
    document.getElementById('user-switch-modal').classList.remove('show');
}

// 打开头像选择弹窗
function openAvatarModal() {
    closeUserMenu();
    
    const emojis = ['👤', '😊', '😎', '🤓', '🥳', '🌟', '🚀', '💪', '🎯', '📚', '🧠', '💡', '🔥', '⭐', '🌈', '🎨', '🏆', '💎', '🎮', '🎵', '📖', '✏️', '🎓', '💫'];
    
    const modal = document.getElementById('avatar-modal');
    const grid = document.getElementById('avatar-grid');
    
    if (!modal || !grid) {
        window.showToast('头像功能加载中');
        return;
    }
    
    grid.innerHTML = emojis.map(emoji => 
        '<div onclick="selectAvatar(\'' + emoji + '\')" style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;border-radius:12px;background:#f8f9fa;transition:all 0.2s;" onmouseover="this.style.background=\'#e8f4ff\'" onmouseout="this.style.background=\'#f8f9fa\'">' + emoji + '</div>'
    ).join('');
    
    modal.classList.add('show');
}

// ============================================================
// 额外的全局函数导出
// ============================================================
window.clearCurrentUserData = clearCurrentUserData;
window.clearAllData = clearAllData;
window.syncData = syncData;
window.openApiConfigModal = openApiConfigModal;
window.saveApiConfig = saveApiConfig;
window.showUserSwitchModal = showUserSwitchModal;
window.closeUserSwitchModal = closeUserSwitchModal;
window.openAvatarModal = openAvatarModal;
window.updateHomeUserInfo = updateHomeUserInfo;
window.openFullscreenPage = openFullscreenPage;
window.switchToUser = switchToUser;
window.deleteUser = deleteUser;
window.closeDetail = closeDetail;
window.closeModal = closeModal;
window.showToast = showToast;
window.closeWelcomeModal = closeWelcomeModal;
window.closeGoodbyeModal = closeGoodbyeModal;
window.closeAboutModal = closeAboutModal;
window.closeAvatarModal = closeAvatarModal;
window.closeApiConfigModal = closeApiConfigModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.closeEditProfileModal = closeEditProfileModal;
window.openChangePasswordModal = openChangePasswordModal;
window.openDifficultyModal = openDifficultyModal;
window.closeDifficultyModal = closeDifficultyModal;
window.closeCreateUserModal = closeCreateUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.closeFullscreenPage = closeFullscreenPage;
window.exitSystem = exitSystem;
window.logoutAndReturn = logoutAndReturn;
window.doExitSystem = doExitSystem;
window.openAbout = openAbout;

// ============================================================
// ES6 Module Export - V225 ES6改造
// ============================================================


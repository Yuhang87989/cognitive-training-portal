// 版本: V151

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
    
    // 停止播客音频 - V150: 优先调用专用函数（先解绑事件再暂停，防止onended/podcastNext重新播放）
    if (typeof stopPodcastAudio === 'function') {
        stopPodcastAudio();
    } else {
        // 降级方案
        var hiddenAudio = document.getElementById('hidden-audio');
        if (hiddenAudio) {
            hiddenAudio.pause();
            hiddenAudio.currentTime = 0;
            hiddenAudio.src = '';
        }
        if (typeof podcastPlayerState !== 'undefined' && podcastPlayerState) {
            podcastPlayerState.isPlaying = false;
            podcastPlayerState.currentPodcast = null;
            podcastPlayerState.currentTime = 0;
        }
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
    if (typeof isRecording !== 'undefined' && isRecording && typeof deepseekRecognition !== 'undefined' && deepseekRecognition) {
        deepseekRecognition.stop();
        isRecording = false;
    }
    
    // 清理DeepSeek图片
    if (typeof currentDeepSeekImage !== 'undefined' && currentDeepSeekImage) {
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

// 注意：openSettingsPanel、closeSettingsPanel、toggleSettingsGroup 函数已移至 js/modules/ui.js 中统一管理，避免命名冲突

function exitSystem() {
    // 停止所有媒体
    if (typeof currentAudio !== 'undefined' && currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio.src = ''; }
    if (typeof evpVideo !== 'undefined' && evpVideo) { evpVideo.pause(); evpVideo.src = ''; }
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
window.closeSettingsPanel = closeSettingsPanel;
window.exitSystem = exitSystem;
window.openSettingsPanel = openSettingsPanel;
window.toggleSettingsGroup = toggleSettingsGroup;


// ============================================================
// V224: 第三方库按需加载
// ============================================================

// 动态加载脚本通用函数
function loadScript(url, callback, onerror) {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
        if (callback) callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = url;
    script.onload = function() {
        console.log('[按需加载] 已加载:', url);
        if (callback) callback();
    };
    script.onerror = function() {
        console.error('[按需加载] 加载失败:', url);
        if (onerror) onerror();
    };
    document.head.appendChild(script);
}

// PeerJS 动态加载
let peerJsLoading = false;
let peerJsLoaded = false;
const peerJsCallbacks = [];

function loadPeerJS(callback) {
    if (typeof Peer !== 'undefined') {
        if (callback) callback();
        return;
    }
    
    if (peerJsLoaded) {
        if (callback) callback();
        return;
    }
    
    if (callback) peerJsCallbacks.push(callback);
    
    if (peerJsLoading) {
        return;
    }
    
    peerJsLoading = true;
    showToast('正在加载音视频库...', 1000);
    
    loadScript('https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js', function() {
        peerJsLoading = false;
        peerJsLoaded = true;
        peerJsCallbacks.forEach(cb => {
            try { cb(); } catch(e) {}
        });
        peerJsCallbacks.length = 0;
    }, function() {
        peerJsLoading = false;
        showToast('音视频库加载失败', 2000);
    });
}
window.loadPeerJS = loadPeerJS;

// Tesseract.js 动态加载
let tesseractLoading = false;
let tesseractLoaded = false;
const tesseractCallbacks = [];

function loadTesseract(callback) {
    if (typeof Tesseract !== 'undefined') {
        if (callback) callback();
        return;
    }
    
    if (tesseractLoaded) {
        if (callback) callback();
        return;
    }
    
    if (callback) tesseractCallbacks.push(callback);
    
    if (tesseractLoading) {
        return;
    }
    
    tesseractLoading = true;
    showToast('正在加载OCR识别库...', 1000);
    
    loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js', function() {
        tesseractLoading = false;
        tesseractLoaded = true;
        tesseractCallbacks.forEach(cb => {
            try { cb(); } catch(e) {}
        });
        tesseractCallbacks.length = 0;
    }, function() {
        tesseractLoading = false;
        showToast('OCR识别库加载失败', 2000);
    });
}
window.loadTesseract = loadTesseract;


// ============================================================
// V224: 数据文件按需加载
// ============================================================

// 已加载的数据模块缓存
const loadedDataModules = {};

// 数据模块URL映射
const dataModuleUrls = {
    'week-plans': 'js/data/week-plans.js',
    'topics': 'js/data/topics.js',
    'podcasts': 'js/data/podcasts.js',
    'videos': 'js/data/videos.js',
    'games-config': 'js/data/games-config.js'
};

// 加载中的回调队列
const dataLoadingCallbacks = {};

function loadModuleData(moduleName, callback) {
    // 如果已加载，直接回调
    if (loadedDataModules[moduleName]) {
        if (callback) callback();
        return;
    }
    
    const url = dataModuleUrls[moduleName];
    if (!url) {
        console.error('[数据加载] 未知模块:', moduleName);
        if (callback) callback();
        return;
    }
    
    // 如果正在加载，加入回调队列
    if (dataLoadingCallbacks[moduleName]) {
        if (callback) dataLoadingCallbacks[moduleName].push(callback);
        return;
    }
    
    // 初始化回调队列
    dataLoadingCallbacks[moduleName] = [];
    if (callback) dataLoadingCallbacks[moduleName].push(callback);
    
    showToast('正在加载数据...', 800);
    
    loadScript(url, function() {
        loadedDataModules[moduleName] = true;
        const callbacks = dataLoadingCallbacks[moduleName] || [];
        delete dataLoadingCallbacks[moduleName];
        callbacks.forEach(cb => {
            try { cb(); } catch(e) {}
        });
    }, function() {
        const callbacks = dataLoadingCallbacks[moduleName] || [];
        delete dataLoadingCallbacks[moduleName];
        showToast('数据加载失败', 2000);
        callbacks.forEach(cb => {
            try { cb(); } catch(e) {}
        });
    });
}
window.loadModuleData = loadModuleData;


// ============================================================
// User - 用户管理
// ============================================================
// ============================================================
// ES6 Module Export - V225 ES6改造
// ============================================================
export {
    showToast,
    cleanupModuleState,
    loadScript,
    loadModuleData
};

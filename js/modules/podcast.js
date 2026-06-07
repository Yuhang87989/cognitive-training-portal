// 简化版播客模块 - V144
// 设计原则：简单、不乱、好用、兼容旧版浏览器

var currentPodcastId = null;

// 播客课程数据 - 默认空数组，加载后自动填充
var podcastCourses = window.podcastList || [];

// 播放状态
var podcastPlayerState = {
    currentPodcast: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
};

// ============================================================
// 辅助函数：生成下拉选项HTML
// ============================================================
function getPodcastSelectOptions() {
    var html = '<option value="">-- 请选择播客 --</option>';
    var categories = ['学霸方法', '数学', '英语', '物理', '化学', '语文'];
    var categoryIcons = {'学霸方法':'🎓', '数学':'📐', '英语':'📖', '物理':'⚡', '化学':'🧪', '语文':'📝'};
    var i, j, podcast;
    
    for (i = 0; i < categories.length; i++) {
        html += '<optgroup label="' + categoryIcons[categories[i]] + ' ' + categories[i] + '">';
        for (j = 0; j < podcastCourses.length; j++) {
            podcast = podcastCourses[j];
            if (podcast.category === categories[i]) {
                html += '<option value="' + podcast.id + '">' + podcast.icon + ' ' + podcast.title + ' (' + podcast.duration + ')</option>';
            }
        }
        html += '</optgroup>';
    }
    return html;
}

// ============================================================
// 简化版UI渲染
// ============================================================
function renderPodcast(container) {
    var html = '';
    html += '<!-- 顶部固定播放器 -->';
    html += '<div class="podcast-player-fixed">';
    html += '<div class="podcast-player-info">';
    html += '<span class="podcast-player-icon">🎧</span>';
    html += '<div class="podcast-player-text">';
    html += '<div class="podcast-player-title" id="podcast-player-title">选择播客开始收听</div>';
    html += '<div class="podcast-player-subtitle" id="podcast-player-subtitle">-</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="podcast-player-controls">';
    html += '<button class="podcast-btn" id="podcast-prev-btn" onclick="podcastPrev()" title="上一首">⏮</button>';
    html += '<button class="podcast-btn podcast-btn-play" id="podcast-play-btn" onclick="podcastTogglePlay()" title="播放/暂停">▶</button>';
    html += '<button class="podcast-btn" id="podcast-next-btn" onclick="podcastNext()" title="下一首">⏭</button>';
    html += '<button class="podcast-btn podcast-btn-speed" id="podcast-speed-btn" onclick="podcastCycleSpeed()" title="播放速度">1x</button>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 进度条 -->';
    html += '<div class="podcast-progress-container" id="podcast-progress-container" style="display:none;">';
    html += '<div class="podcast-progress-bar" id="podcast-progress-bar">';
    html += '<div class="podcast-progress-fill" id="podcast-progress-fill"></div>';
    html += '</div>';
    html += '<div class="podcast-time-display">';
    html += '<span id="podcast-current-time">0:00</span>';
    html += '<span id="podcast-total-time">0:00</span>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 下拉选择列表 -->';
    html += '<div class="card" style="margin-top:0;">';
    html += '<div class="podcast-select-wrapper">';
    html += '<label class="podcast-select-label">选择播客：</label>';
    html += '<select class="podcast-select" id="podcast-select" onchange="onPodcastSelectChange(this.value)">';
    html += getPodcastSelectOptions();
    html += '</select>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 播客列表（可折叠） -->';
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div class="podcast-list-header" onclick="togglePodcastList()">';
    html += '<span>📋 播客列表</span>';
    html += '<span id="podcast-list-toggle">▼</span>';
    html += '</div>';
    html += '<div id="podcast-list-container" class="podcast-list-container">';
    html += '<div class="podcast-list-grid" id="podcast-list">';
    html += renderPodcastListItems(podcastCourses);
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- AI互动问答 -->';
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">';
    html += '<span style="font-size:18px;">🤖</span>';
    html += '<span style="font-weight:600;font-size:14px;">AI互动问答</span>';
    html += '<span style="font-size:11px;color:#999;">听课有问题？随时问AI</span>';
    html += '</div>';
    html += '<div id="podcast-chat-messages" style="max-height:200px;overflow-y:auto;margin-bottom:8px;padding:8px;background:#f8f9fa;border-radius:8px;min-height:60px;">';
    html += '<div style="text-align:center;color:#999;font-size:12px;padding:16px;">👋 听课时有任何疑问，随时提问</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<button id="podcast-voice-btn" class="podcast-btn" style="padding:8px 10px;font-size:16px;background:#f0f0f0;" onclick="togglePodcastVoice()" title="语音输入">🎤</button>';
    html += '<input type="text" id="podcast-chat-input" placeholder="输入问题..." style="flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;" onkeypress="if(event.key===\'Enter\')askPodcastAI()"/>';
    html += '<button class="podcast-btn" style="padding:8px 12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:13px;border-radius:8px;" onclick="askPodcastAI()">发送</button>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
    
    // 初始化音频元素
    initPodcastAudio();
}

// ============================================================
// 渲染播客列表项 - 使用字符串拼接，兼容旧版浏览器
// ============================================================
function renderPodcastListItems(podcasts) {
    var html = '';
    var i, p, isActive, isPlayingNow, itemHtml, indicator;
    
    for (i = 0; i < podcasts.length; i++) {
        p = podcasts[i];
        isActive = (podcastPlayerState.currentPodcast && podcastPlayerState.currentPodcast.id === p.id);
        isPlayingNow = isActive && podcastPlayerState.isPlaying;
        indicator = isPlayingNow ? '<span class="podcast-playing-indicator">🔊</span>' : '<span class="podcast-play-icon">▶</span>';
        
        itemHtml = '<div class="podcast-list-item' + (isActive ? ' active' : '') + '" data-podcast-id="' + p.id + '" onclick="playPodcastById(\'' + p.id + '\')">';
        itemHtml += '<span class="podcast-list-icon" style="background:' + p.gradient + ';">' + p.icon + '</span>';
        itemHtml += '<div class="podcast-list-info">';
        itemHtml += '<div class="podcast-list-title">' + p.title + '</div>';
        itemHtml += '<div class="podcast-list-meta">' + p.teacher + ' · ' + p.duration + '</div>';
        itemHtml += '</div>';
        itemHtml += indicator;
        itemHtml += '</div>';
        
        html += itemHtml;
    }
    
    return html;
}

// ============================================================
// 切换播客列表显示
// ============================================================
function togglePodcastList() {
    var container = document.getElementById('podcast-list-container');
    var toggle = document.getElementById('podcast-list-toggle');
    if (container && toggle) {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            toggle.textContent = '▲';
        } else {
            container.style.display = 'none';
            toggle.textContent = '▼';
        }
    }
}

// ============================================================
// 下拉选择变化
// ============================================================
function onPodcastSelectChange(podcastId) {
    if (podcastId) {
        playPodcastById(podcastId);
    }
}

// ============================================================
// 根据ID播放播客
// ============================================================
function playPodcastById(podcastId) {
    var i, podcast;
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id == podcastId) {
            podcast = podcastCourses[i];
            break;
        }
    }
    if (podcast) {
        podcastPlay(podcast);
    }
}

// ============================================================
// 播放播客 - 音频播放优先，UI更新在try-catch中
// ============================================================
function podcastPlay(podcast) {
    var audio, select, list, btn, titleEl, subtitleEl, progressEl, timeEl, self = this;
    
    // 1. 首先设置当前播客状态
    podcastPlayerState.currentPodcast = podcast;
    podcastPlayerState.isPlaying = true;
    
    // 2. 立即播放音频（最重要！）
    audio = document.getElementById('hidden-audio');
    if (audio && podcast.url) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = podcast.url;
        audio.playbackRate = podcastPlayerState.playbackRate;
        audio.load();
        
        // 使用回调处理自动播放结果
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // 播放成功
                podcastPlayerState.isPlaying = true;
                updatePodcastUI();
                if (typeof showToast === 'function') {
                    window.showToast('正在播放: ' + podcast.title);
                }
            }).catch(function(e) {
                // 自动播放被阻止，等待用户交互
                podcastPlayerState.isPlaying = false;
                btn = document.getElementById('podcast-play-btn');
                if (btn) btn.textContent = '▶';
                if (typeof showToast === 'function') {
                    window.showToast('点击播放按钮开始收听');
                }
            });
        }
        
        // 音频加载错误处理
        audio.onerror = function() {
            podcastPlayerState.isPlaying = false;
            updatePodcastUI();
            window.showToast('音频加载失败，请稍后重试');
        };
    } else if (!podcast.url) {
        if (typeof showToast === 'function') {
            window.showToast('该播客暂无音频');
        }
    }
    
    // 3. UI更新放在后面，用try-catch保护
    updatePodcastUI();
}

// ============================================================
// 更新播客UI（被podcast.js内部调用）
// ============================================================
function updatePodcastUI() {
    var podcast, titleEl, subtitleEl, btn, progressEl, timeEl, list, select;
    
    try {
        podcast = podcastPlayerState.currentPodcast;
        if (!podcast) return;
        
        titleEl = document.getElementById('podcast-player-title');
        subtitleEl = document.getElementById('podcast-player-subtitle');
        btn = document.getElementById('podcast-play-btn');
        progressEl = document.getElementById('podcast-progress-container');
        timeEl = document.getElementById('podcast-total-time');
        list = document.getElementById('podcast-list');
        select = document.getElementById('podcast-select');
        
        if (titleEl) titleEl.textContent = podcast.title;
        if (subtitleEl) subtitleEl.textContent = podcast.teacher + ' · ' + podcast.category;
        if (btn) btn.textContent = podcastPlayerState.isPlaying ? '⏸' : '▶';
        if (progressEl) progressEl.style.display = 'block';
        if (timeEl) timeEl.textContent = podcast.duration;
        
        // V397: 轻量更新列表
        updatePodcastListActive();
        
        // 更新下拉选择
        if (select) select.value = podcast.id;
        
    } catch (e) {
        console.warn('更新播客UI失败:', e);
    }
    
    // 更新迷你播放器（如果有）
    try {
        if (typeof showMiniPlayer === 'function' && podcast) {
            showMiniPlayer({
                title: podcast.title,
                teacher: podcast.teacher,
                icon: podcast.icon,
                gradient: podcast.gradient,
                type: 'podcast'
            });
        }
    } catch (e) {
        console.warn('迷你播放器不可用:', e);
    }
}

// ============================================================
// 切换播放/暂停
// ============================================================
function podcastTogglePlay() {
    var audio = document.getElementById('hidden-audio');
    var btn = document.getElementById('podcast-play-btn');
    var list = document.getElementById('podcast-list');
    
    if (!audio || !podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            window.showToast('请先选择播客');
        }
        return;
    }
    
    if (podcastPlayerState.isPlaying) {
        audio.pause();
        podcastPlayerState.isPlaying = false;
        if (btn) btn.textContent = '▶';
    } else {
        audio.play();
        podcastPlayerState.isPlaying = true;
        if (btn) btn.textContent = '⏸';
    }
    
    // V397: 轻量更新
    updatePodcastListActive();
}

// ============================================================
// 上一首
// ============================================================
function podcastPrev() {
    var currentIndex, prevIndex, i;
    
    if (!podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            window.showToast('请先选择播客');
        }
        return;
    }
    
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id === podcastPlayerState.currentPodcast.id) {
            currentIndex = i;
            break;
        }
    }
    
    prevIndex = currentIndex > 0 ? currentIndex - 1 : podcastCourses.length - 1;
    podcastPlay(podcastCourses[prevIndex]);
}

// ============================================================
// 下一首
// ============================================================
function podcastNext() {
    var currentIndex, nextIndex, i;
    
    if (!podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            window.showToast('请先选择播客');
        }
        return;
    }
    
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id === podcastPlayerState.currentPodcast.id) {
            currentIndex = i;
            break;
        }
    }
    
    nextIndex = currentIndex < podcastCourses.length - 1 ? currentIndex + 1 : 0;
    podcastPlay(podcastCourses[nextIndex]);
}

// ============================================================
// 切换播放速度
// ============================================================
function podcastCycleSpeed() {
    var speeds = [1, 1.5, 2];
    var currentIndex = -1;
    var nextIndex, audio, btn, i;
    
    for (i = 0; i < speeds.length; i++) {
        if (speeds[i] === podcastPlayerState.playbackRate) {
            currentIndex = i;
            break;
        }
    }
    
    nextIndex = (currentIndex + 1) % speeds.length;
    podcastPlayerState.playbackRate = speeds[nextIndex];
    
    audio = document.getElementById('hidden-audio');
    if (audio) audio.playbackRate = podcastPlayerState.playbackRate;
    
    btn = document.getElementById('podcast-speed-btn');
    if (btn) btn.textContent = speeds[nextIndex] + 'x';
    
    if (typeof showToast === 'function') {
        window.showToast('播放速度: ' + speeds[nextIndex] + 'x');
    }
}

// ============================================================
// 初始化音频元素
// ============================================================
// V397: 轻量更新播客列表活跃状态（不全量重建DOM）
function updatePodcastListActive() {
    if (!podcastPlayerState.currentPodcast) return;
    var items = document.querySelectorAll('.podcast-list-item');
    for (var i = 0; i < items.length; i++) {
        var itemId = items[i].getAttribute('data-podcast-id');
        var isActive = itemId == podcastPlayerState.currentPodcast.id;
        if (isActive && !items[i].classList.contains('active')) {
            items[i].classList.add('active');
        } else if (!isActive && items[i].classList.contains('active')) {
            items[i].classList.remove('active');
        }
        // Update play indicator
        var indicator = items[i].querySelector('.podcast-playing-indicator, .podcast-play-icon');
        if (indicator) {
            if (isActive && podcastPlayerState.isPlaying) {
                indicator.className = 'podcast-playing-indicator';
                indicator.textContent = '🔊';
            } else if (isActive) {
                indicator.className = 'podcast-play-icon';
                indicator.textContent = '▶';
            }
        }
    }
}

function initPodcastAudio() {
    var audio = document.getElementById('hidden-audio');
    
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'hidden-audio';
        audio.style.display = 'none';
        document.body.appendChild(audio);
    }
    
    // 播放开始 - V397: 轻量更新而非全量重建
    audio.onplay = function() {
        var playBtn;
        podcastPlayerState.isPlaying = true;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        updatePodcastListActive();
    };
    
    // 暂停 - V397: 轻量更新
    audio.onpause = function() {
        var playBtn;
        podcastPlayerState.isPlaying = false;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '▶';
        updatePodcastListActive();
    };
    
    // 时间更新
    audio.ontimeupdate = function() {
        var progressFill, currentTimeEl, duration;
        podcastPlayerState.currentTime = audio.currentTime;
        
        // 获取时长（优先使用实际duration，否则用预设值）
        duration = audio.duration;
        if (!duration || isNaN(duration)) {
            duration = (podcastPlayerState.currentPodcast && podcastPlayerState.currentPodcast.durationSec) 
                ? podcastPlayerState.currentPodcast.durationSec : 0;
        }
        podcastPlayerState.duration = duration;
        
        // 更新进度条
        progressFill = document.getElementById('podcast-progress-fill');
        currentTimeEl = document.getElementById('podcast-current-time');
        
        if (progressFill && podcastPlayerState.duration > 0) {
            var percent = (podcastPlayerState.currentTime / podcastPlayerState.duration) * 100;
            progressFill.style.width = percent + '%';
        }
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(podcastPlayerState.currentTime);
        }
    };
    
    // 播放结束 - V150: 加保护，如果正在清理则不自动播放下一首
    audio.onended = function() {
        if (!podcastPlayerState.currentPodcast) return;
        podcastNext();
    };
    
    // 点击进度条跳转
    var progressBar = document.getElementById('podcast-progress-bar');
    if (progressBar) {
        progressBar.onclick = function(e) {
            var rect, percent;
            if (!podcastPlayerState.duration) return;
            rect = progressBar.getBoundingClientRect();
            percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * podcastPlayerState.duration;
        };
    }
}

// ============================================================
// 格式化时间
// ============================================================
function formatTime(seconds) {
    var mins, secs;
    if (!seconds || isNaN(seconds)) return '0:00';
    mins = Math.floor(seconds / 60);
    secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}


// ============================================================
// 远程加载播客数据 - V144
// ============================================================
function loadPodcastData() {
    var dataUrl = './podcast-data.json';
    var cacheKey = 'cached_podcast_data';
    var cachedData, i, container, list, select;
    
    // 1. 先尝试从远程fetch
    fetch(dataUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function(data) {
            // 成功获取远程数据
            if (data && Array.isArray(data)) {
                // 填充到podcastCourses
                for (i = 0; i < data.length; i++) {
                    podcastCourses.push(data[i]);
                }
                // 缓存到localStorage
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) {
                    console.warn('localStorage缓存失败:', e);
                }
                // 更新UI
                refreshPodcastUI();
                console.log('播客数据加载成功: ' + data.length + '条');
            }
        })
        .catch(function(error) {
            console.warn('远程加载失败，尝试使用缓存:', error);
            // 2. fetch失败则从localStorage读取缓存
            try {
                cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    cachedData = JSON.parse(cachedData);
                    if (Array.isArray(cachedData)) {
                        for (i = 0; i < cachedData.length; i++) {
                            podcastCourses.push(cachedData[i]);
                        }
                        refreshPodcastUI();
                        console.log('从缓存加载播客数据: ' + cachedData.length + '条');
                    }
                }
            } catch (e) {
                console.warn('缓存读取失败:', e);
            }
        });
}

// ============================================================
// 刷新播客UI - 数据加载后调用
// ============================================================
function refreshPodcastUI() {
    var container, list, select, playBtn;
    
    // 如果当前在播客页面，刷新列表和下拉选择
    list = document.getElementById('podcast-list');
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
    
    select = document.getElementById('podcast-select');
    if (select) {
        select.innerHTML = getPodcastSelectOptions();
    }
    
    playBtn = document.getElementById('podcast-play-btn');
    if (playBtn && !podcastPlayerState.currentPodcast) {
        playBtn.textContent = '▶';
    }
}

// 自动加载播客数据
loadPodcastData();

// ============================================================
// AI互动问答 - DeepSeek
// ============================================================
var podcastChatHistory = [];

async function askPodcastAI() {
    var input = document.getElementById('podcast-chat-input');
    var messagesEl = document.getElementById('podcast-chat-messages');
    if (!input || !messagesEl) return;
    
    var msg = input.value.trim();
    if (!msg) {
        window.showToast('请输入问题');
        return;
    }
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息到界面
    var userMsgHtml = '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">';
    userMsgHtml += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:8px 12px;border-radius:12px 12px 2px 12px;max-width:80%;font-size:13px;line-height:1.5;">' + escapeHtml(msg) + '</div>';
    userMsgHtml += '</div>';
    messagesEl.innerHTML += userMsgHtml;
    
    // 添加loading
    var loadingId = 'podcast-loading-' + Date.now();
    messagesEl.innerHTML += '<div id="' + loadingId + '" style="display:flex;justify-content:flex-start;margin-bottom:8px;"><div style="background:#f0f0f0;color:#666;padding:8px 12px;border-radius:12px 12px 12px 2px;max-width:80%;font-size:13px;">思考中...</div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // 构建上下文 - 包含当前播客信息
    var context = '你是一位耐心的学习辅导老师。';
    if (podcastPlayerState.currentPodcast) {
        context += '学生正在收听播客课程《' + podcastPlayerState.currentPodcast.title + '》，由' + podcastPlayerState.currentPodcast.teacher + '老师讲授。';
        if (podcastPlayerState.currentPodcast.category) {
            context += '学科：' + podcastPlayerState.currentPodcast.category + '。';
        }
    }
    
    // 维护对话历史
    podcastChatHistory.push({role: 'user', content: msg});
    if (podcastChatHistory.length > 10) {
        podcastChatHistory = podcastChatHistory.slice(-10);
    }
    
    var apiMessages = [{role: 'system', content: context}];
    for (var i = 0; i < podcastChatHistory.length; i++) {
        apiMessages.push(podcastChatHistory[i]);
    }
    
    try {
        var result = await callDeepSeekAPI(apiMessages);
        var loadingEl = document.getElementById(loadingId);
        
        if (result.error) {
            if (loadingEl) loadingEl.innerHTML = '<div style="background:#fff3f3;color:#ff6b6b;padding:8px 12px;border-radius:12px;font-size:13px;">❌ ' + (result.type === 'balance' ? '余额不足' : '请求失败') + '</div>';
            return;
        }
        
        // 记录AI回复到历史
        podcastChatHistory.push({role: 'assistant', content: result.content});
        
        // 显示AI回复
        var aiMsgHtml = '<div style="display:flex;justify-content:flex-start;margin-bottom:8px;">';
        aiMsgHtml += '<div style="background:#f0f0f0;color:#333;padding:8px 12px;border-radius:12px 12px 12px 2px;max-width:85%;font-size:13px;line-height:1.6;">';
        aiMsgHtml += result.content.replace(/\n/g, '<br>');
        aiMsgHtml += '<div style="margin-top:4px;text-align:right;"><button onclick="window.speakText(this.parentElement.previousElementSibling ? this.parentElement.parentElement.innerText : \'\')" style="padding:2px 6px;background:#667eea;color:white;border:none;border-radius:4px;font-size:10px;cursor:pointer;">🔊</button></div>';
        aiMsgHtml += '</div></div>';
        
        if (loadingEl) {
            loadingEl.outerHTML = aiMsgHtml;
        } else {
            messagesEl.innerHTML += aiMsgHtml;
        }
        
        messagesEl.scrollTop = messagesEl.scrollHeight;
        
        // 记录AI调用
        if (typeof recordDeepSeekCall === 'function') {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
        }
    } catch (err) {
        var loadingEl2 = document.getElementById(loadingId);
        if (loadingEl2) loadingEl2.innerHTML = '<div style="background:#fff3f3;color:#ff6b6b;padding:8px 12px;border-radius:12px;font-size:13px;">❌ 网络错误</div>';
    }
}

function togglePodcastVoice() {
    if (typeof toggleVoiceInput === 'function') {
        var btn = document.getElementById('podcast-voice-btn');
        toggleVoiceInput(btn, 'podcast-chat-input');
    } else {
        window.showToast('语音输入未就绪');
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}


// ============================================================
// 停止播客音频 - V150修复：返回时音频不停
// 必须先解绑事件再暂停，否则onended/podcastNext会重新触发播放
// ============================================================
function stopPodcastAudio() {
    var audio = document.getElementById('hidden-audio');
    if (audio) {
        // 1. 先解绑所有事件回调，防止pause/src变更触发回调导致重新播放
        audio.onplay = null;
        audio.onpause = null;
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onerror = null;
        // 2. 暂停并清除
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
    }
    // 3. 重置播放状态
    if (typeof podcastPlayerState !== 'undefined' && podcastPlayerState) {
        podcastPlayerState.isPlaying = false;
        podcastPlayerState.currentPodcast = null;
        podcastPlayerState.currentTime = 0;
        podcastPlayerState.duration = 0;
    }
    // 4. 更新UI按钮状态
    var playBtn = document.getElementById('podcast-play-btn');
    if (playBtn) playBtn.textContent = '▶';
    var titleEl = document.getElementById('podcast-player-title');
    if (titleEl) titleEl.textContent = '选择播客开始收听';
    var subtitleEl = document.getElementById('podcast-player-subtitle');
    if (subtitleEl) subtitleEl.textContent = '-';
    var progressFill = document.getElementById('podcast-progress-fill');
    if (progressFill) progressFill.style.width = '0%';
    var progressContainer = document.getElementById('podcast-progress-container');
    if (progressContainer) progressContainer.style.display = 'none';
    var currentTimeEl = document.getElementById('podcast-current-time');
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    var totalTimeEl = document.getElementById('podcast-total-time');
    if (totalTimeEl) totalTimeEl.textContent = '0:00';
}

// ============================================================
// Window Exports - 确保全局可用
// ============================================================
window.renderPodcast = renderPodcast;
window.playPodcastById = playPodcastById;
window.podcastTogglePlay = podcastTogglePlay;
window.podcastPrev = podcastPrev;
window.podcastNext = podcastNext;
window.podcastCycleSpeed = podcastCycleSpeed;
window.onPodcastSelectChange = onPodcastSelectChange;
window.togglePodcastList = togglePodcastList;
window.podcastCourses = podcastCourses;
window.podcastPlay = podcastPlay;
window.askPodcastAI = askPodcastAI;
window.togglePodcastVoice = togglePodcastVoice;
window.stopPodcastAudio = stopPodcastAudio;

// ============================================================
// ES6 Module 导出
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderPodcast,
        renderPodcastListItems,
        togglePodcastList,
        onPodcastSelectChange,
        playPodcastById,
        podcastPlay,
        podcastTogglePlay,
        podcastPrev,
        podcastNext,
        podcastCycleSpeed,
        askPodcastAI,
        togglePodcastVoice,
        stopPodcastAudio,
        podcastCourses,
        podcastPlayerState
    };
}

    renderPodcast,
    playPodcastById,
    podcastTogglePlay,
    podcastPrev,
    podcastNext,
    podcastCycleSpeed,
    stopPodcastAudio

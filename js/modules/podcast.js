// 简化版播客模块 - V144
// 设计原则：简单、不乱、好用、兼容旧版浏览器

var currentPodcastId = null;

// 播客课程数据 - 默认空数组，加载后自动填充
var podcastCourses = [];

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
        
        itemHtml = '<div class="podcast-list-item' + (isActive ? ' active' : '') + '" onclick="playPodcastById(\'' + p.id + '\')">';
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
        if (podcastCourses[i].id === podcastId) {
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
                    showToast('正在播放: ' + podcast.title);
                }
            }).catch(function(e) {
                // 自动播放被阻止，等待用户交互
                podcastPlayerState.isPlaying = false;
                btn = document.getElementById('podcast-play-btn');
                if (btn) btn.textContent = '▶';
                if (typeof showToast === 'function') {
                    showToast('点击播放按钮开始收听');
                }
            });
        }
    } else if (!podcast.url) {
        if (typeof showToast === 'function') {
            showToast('该播客暂无音频');
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
        
        // 更新列表
        if (list) {
            list.innerHTML = renderPodcastListItems(podcastCourses);
        }
        
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
            showToast('请先选择播客');
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
    
    // 更新列表图标
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
}

// ============================================================
// 上一首
// ============================================================
function podcastPrev() {
    var currentIndex, prevIndex, i;
    
    if (!podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            showToast('请先选择播客');
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
            showToast('请先选择播客');
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
        showToast('播放速度: ' + speeds[nextIndex] + 'x');
    }
}

// ============================================================
// 初始化音频元素
// ============================================================
function initPodcastAudio() {
    var audio = document.getElementById('hidden-audio');
    
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'hidden-audio';
        audio.style.display = 'none';
        document.body.appendChild(audio);
    }
    
    // 播放开始
    audio.onplay = function() {
        var playBtn, list;
        podcastPlayerState.isPlaying = true;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
    };
    
    // 暂停
    audio.onpause = function() {
        var playBtn, list;
        podcastPlayerState.isPlaying = false;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '▶';
        list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
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
    
    // 播放结束
    audio.onended = function() {
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

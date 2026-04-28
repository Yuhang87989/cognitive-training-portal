// ====== podcast模块 ======
// 版本: V140

CTM.registerModule('podcast', {
    name: 'podcast',
    icon: '🎯',
    render: renderPodcast
});

function renderPodcast(container) {
    // 使用全局podcastCourses数组
    const podcasts = podcastCourses;
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎧 播客课堂 <span style="font-size:12px;color:#999;">共${podcasts.length}个音频</span></h3>
            <div id="coze-login-banner" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
                <div style="color:white;">
                    <div style="font-size:14px;font-weight:600;">🔑 登录扣子平台</div>
                    <div style="font-size:11px;opacity:0.8;margin-top:2px;">登录后可在线播放原声音频</div>
                </div>
                <button onclick="loginCozePlatform()" style="background:white;color:#667eea;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">去登录</button>
            </div>
            <div id="coze-login-status" style="display:none;background:#e8f5e9;border-radius:12px;padding:14px 16px;margin-bottom:12px;display:none;">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div style="color:#2e7d32;">
                        <div style="font-size:14px;font-weight:600;">✅ 扣子已登录</div>
                        <div style="font-size:11px;margin-top:2px;">可以正常播放原声音频</div>
                    </div>
                    <button onclick="checkCozeLogin()" style="background:#2e7d32;color:white;border:none;padding:6px 12px;border-radius:8px;font-size:12px;cursor:pointer;">刷新状态</button>
                </div>
            </div>
            <div class="subject-tab" style="flex-wrap:wrap;">
                <button class="subject-tab-btn active" onclick="filterPodcast('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterPodcast('学霸方法', this)">学霸方法</button>
                <button class="subject-tab-btn" onclick="filterPodcast('数学', this)">数学</button>
                <button class="subject-tab-btn" onclick="filterPodcast('物理', this)">物理</button>
                <button class="subject-tab-btn" onclick="filterPodcast('化学', this)">化学</button>
                <button class="subject-tab-btn" onclick="filterPodcast('语文', this)">语文</button>
                <button class="subject-tab-btn" onclick="filterPodcast('英语', this)">英语</button>
            </div>
        </div>
        
        <!-- 上传音频区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin:12px 0;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传本地音频</div>
            <div class="upload-zone" onclick="document.getElementById('audio-upload-input').click()">
                <div class="upload-icon">🎵</div>
                <div class="upload-text">点击上传音频文件</div>
                <div class="upload-hint">支持 MP3、WAV、M4A 格式</div>
            </div>
            <input type="file" id="audio-upload-input" accept="audio/*" style="display:none" onchange="handleAudioUpload(this)">
            <div id="local-audio-list" style="margin-top:12px;"></div>
        </div>
        
        <div id="podcast-list">
            ${podcasts.map(p => `
            <div class="podcast-item" onclick="playPodcastCourse('${p.id}')">
                <div class="podcast-thumb" style="background:${p.gradient};">${p.icon}</div>
                <div class="podcast-info">${p.title}<div class="podcast-meta">${p.teacher} · ${p.duration} · ${p.category}</div></div>
                <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;" onclick="event.stopPropagation();">
                    ${p.shareUrl ? `<a href="${p.shareUrl}" target="_blank" style="font-size:11px;color:#3377FF;text-decoration:none;">🔗</a>` : ''}
                    <label style="cursor:pointer;font-size:11px;color:#4CAF50;">📤<input type="file" accept="audio/mp3,audio/mpeg,.mp3" style="display:none;" onchange="uploadPodcastFile('${p.id}', this)"></label>
                    <button onclick="downloadPodcastFromCoze('${p.id}')" style="font-size:11px;color:#FF6B6B;background:none;border:none;cursor:pointer;padding:0;">⬇️</button>
                </div>
            </div>
            `).join('')}
        </div>
    `;
    
    // 渲染本地音频列表
    renderLocalAudioList();
}

function renderLocalAudioList() {
    const user = getCurrentUserData();
    const localAudios = user?.localAudios || [];
    const listEl = document.getElementById('local-audio-list');

    if (!listEl) return;

    if (localAudios.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无本地音频</div>';
        return;
    }

    listEl.innerHTML = localAudios.map(audio => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f7ff;border-radius:8px;margin-bottom:8px;">
            <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;">${audio.title}</div>
                <div style="font-size:11px;color:#999;">${audio.duration} · ${audio.uploadTime}</div>
            </div>
            <button onclick="playLocalAudio('${audio.id}')" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">播放</button>
            <button onclick="deleteLocalAudio('${audio.id}')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
        </div>
    `).join('');
}

function playPodcastAudio(id) {
    const podcast = podcastList.find(p => p.id === id);
    if (podcast) {
        const audio = document.getElementById('hidden-audio');
        if (!audio) return;
        audio.src = podcast.url;
        audio.play().catch(e => {
            showToast('播放失败，请检查网络连接');
        });
        showMiniPlayer(podcast.title, podcast.duration);
        currentPodcastId = id;
    }
}

window.renderPodcast = renderPodcast;
window.renderLocalAudioList = renderLocalAudioList;
window.playPodcastAudio = playPodcastAudio;

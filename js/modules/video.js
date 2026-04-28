// 版本: V140

var videoCourses = [
    {id:"video1",title:"测试视频 - Big Buck Bunny",teacher:"系统测试",duration:"0:10",durationSec:10,category:"测试",gradient:"linear-gradient(135deg,#667eea,#764ba2)",icon:"🎬",url:"https://www.w3schools.com/html/mov_bbb.mp4",views:1000}
];

CTM.registerModule('video', {
    name: 'video',
    icon: '🎯',
    render: renderVideo
});

function renderVideo(container) {
    // 使用videoCourses数组渲染21个视频
    const videos = videoCourses.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">📺 视频课堂 <span style="font-size:12px;color:#999;">共${videoCourses.length}个课程</span></h3>
            <div class="subject-tab" style="flex-wrap:wrap;">
                <button class="subject-tab-btn active" onclick="filterVideoCourse('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('学习方法', this)">学习方法</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('数学', this)">数学</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('英语', this)">英语</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('物理', this)">物理</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('化学', this)">化学</button>
            </div>
        </div>
        
        <!-- 上传视频区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin:12px 0;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传本地视频</div>
            <div class="upload-zone" onclick="document.getElementById('video-upload-input').click()">
                <div class="upload-icon">🎬</div>
                <div class="upload-text">点击上传视频文件</div>
                <div class="upload-hint">支持 MP4、WebM、MOV 格式（最大100MB）</div>
            </div>
            <input type="file" id="video-upload-input" accept="video/*" style="display:none" onchange="handleVideoUpload(this)">
            <div id="local-video-list" style="margin-top:12px;"></div>
        </div>
        
        <div id="video-list">${videos}</div>
    `;
    
    // 渲染本地视频列表
    renderLocalVideoList();
}

function renderLocalVideoList() {
    const user = getCurrentUserData();
    const localVideos = user?.localVideos || [];
    const listEl = document.getElementById('local-video-list');
    
    if (!listEl) return;
    
    if (localVideos.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无本地视频</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">📁 已上传 ${localVideos.length} 个视频</div>
        ${localVideos.map(video => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:24px;">🎬</div>
                <div style="flex:1;">
                    <div style="font-size:13px;font-weight:500;">${video.title}</div>
                    <div style="font-size:11px;color:#999;">${video.duration} · ${(video.size / 1024 / 1024).toFixed(1)}MB</div>
                </div>
                <button onclick="playLocalVideo('${video.id}')" style="background:#1A6BFF;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">播放</button>
                <button onclick="deleteLocalVideo('${video.id}')" style="background:#ff6b6b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
            </div>
        `).join('')}
    `;
}

window.renderVideo = renderVideo;
window.renderLocalVideoList = renderLocalVideoList;


// ============================================================
// Player - 播放器
// ============================================================


// ============================================================
// 从V139提取的缺失函数
// ============================================================

function filterVideoCourse(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    
    var videos = videoCourses.filter(function(v) { return category === 'all' || v.category === category; });
    var videoHtml = videos.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    document.getElementById('video-list').innerHTML = videoHtml;
}

function playVideoFromList(id) {
    var course = videoCourses.find(function(v) { return v.id === id; });
    if (course) {
        // 使用增强版视频播放器，传入videoId用于记录观看进度
        openEnhancedVideoPlayer(course.title, course.url, course.id);
    }
}

// ============================================================
// Window Exports
// ============================================================
window.filterVideoCourse = filterVideoCourse;
window.playVideoFromList = playVideoFromList;
window.playLocalVideo = playLocalVideo;
window.deleteLocalVideo = deleteLocalVideo;

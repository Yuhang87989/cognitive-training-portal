// 版本: V144

// V397: 视频懒加载 - 不预加载视频文件
window.videoCourses = [
    {id:"video0",title:"🐻 小熊掉苹果",teacher:"测试视频",duration:"0:10",durationSec:10,category:"测试",gradient:"linear-gradient(135deg,#f5af19,#f12711)",icon:"🐻",url:"https://www.w3schools.com/html/mov_bbb.mp4",views:9999,isTest:true},
    {id:"video1",title:"专注力训练",teacher:"认知训练",duration:"5:23",durationSec:323,category:"学习方法",gradient:"linear-gradient(135deg,#667eea,#764ba2)",icon:"🎯",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/focus-training.mp4",views:5680},
    {id:"video2",title:"学霸深度理解法",teacher:"认知训练",duration:"6:18",durationSec:378,category:"学习方法",gradient:"linear-gradient(135deg,#f093fb,#f5576c)",icon:"📚",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/deep-understanding-ep1.mp4",views:4320},
    {id:"video3",title:"数学抽象推理",teacher:"认知训练",duration:"5:06",durationSec:306,category:"数学",gradient:"linear-gradient(135deg,#4facfe,#00f2fe)",icon:"🔢",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/math-abstract-reasoning.mp4",views:3890},
    {id:"video4",title:"物理因果守恒",teacher:"认知训练",duration:"5:41",durationSec:341,category:"物理",gradient:"linear-gradient(135deg,#43e97b,#38f9d7)",icon:"⚡",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/physics-conservation-ep1.mp4",views:2950},
    {id:"video5",title:"逆向思维训练",teacher:"认知训练",duration:"3:27",durationSec:207,category:"思维训练",gradient:"linear-gradient(135deg,#fa709a,#fee140)",icon:"🧩",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/reverse-thinking-ep1.mp4",views:2150}
];

CTM.registerModule('video', {
    name: 'video',
    icon: '🎯',
    render: renderVideo
});

function renderVideo(container) {
    // 使用videoCourses数组渲染21个视频
    const videos = videoCourses.map(function(v) {
        return '<div class="video-item" data-video-id="' + v.id + '" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">📺 视频课堂 <span style="font-size:12px;color:#999;">共${window.videoCourses.length}个课程</span></h3>
            <div class="subject-tab" style="flex-wrap:wrap;">
                <button class="subject-tab-btn active" onclick="filterVideoCourse('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('学习方法', this)">学习方法</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('数学', this)">数学</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('英语', this)">英语</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('物理', this)">物理</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('化学', this)">化学</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('测试', this)">测试</button>
            </div>
        </div>
        
        <!-- 上传视频区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin:12px 0;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传本地视频</div>
            <div class="upload-zone" onclick="document.getElementById('video-upload-input').click()">
                <div class="upload-icon">🎬</div>
                <div class="upload-text">点击上传视频文件</div>
                <div class="upload-hint">支持 MP4、WebM、MOV 格式（最大100MB，大视频自动压缩缓存）</div>
            </div>
            <input type="file" id="video-upload-input" accept="video/*" style="display:none" onchange="handleVideoUpload(this)">
            <div id="local-video-list" style="margin-top:12px;"></div>
        </div>
        
        <div id="video-list">${videos}</div>
    `;
    
    // 渲染本地视频列表
    renderLocalVideoList();
    
    // 确保视频播放器已初始化
    setTimeout(function() {
        if (typeof window.initEnhancedVideoPlayer === 'function' && window.videoCtx && !window.videoCtx.isInitialized) {
            window.initEnhancedVideoPlayer();
        }
    }, 300);
}

function renderLocalVideoList() {
    const user = window.getCurrentUserData();
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
// 从V144提取的缺失函数
// ============================================================

function filterVideoCourse(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    
    var videos = window.videoCourses.filter(function(v) { return category === 'all' || v.category === category; });
    var videoHtml = videos.map(function(v) {
        return '<div class="video-item" data-video-id="' + v.id + '" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    document.getElementById('video-list').innerHTML = videoHtml;
}

function playVideoFromList(id) {
    var course = window.videoCourses.find(function(v) { return v.id === id; });
    if (course) {
        // 确保播放器已加载
        if (typeof window.openEnhancedVideoPlayer === 'function') {
            window.openEnhancedVideoPlayer(course.title, course.url, course.id);
        } else {
            // 播放器未加载，尝试初始化后播放
            console.warn('[Video] 播放器未就绪，尝试初始化...');
            if (typeof window.initEnhancedVideoPlayer === 'function') {
                window.initEnhancedVideoPlayer();
            }
            setTimeout(function() {
                if (typeof window.openEnhancedVideoPlayer === 'function') {
                    window.openEnhancedVideoPlayer(course.title, course.url, course.id);
                } else {
                    window.showToast('视频播放器加载中，请稍后重试');
                }
            }, 500);
        }
    }
}

// ============================================================
// Window Exports
// ============================================================
window.filterVideoCourse = filterVideoCourse;
window.playVideoFromList = playVideoFromList;
if (typeof playLocalVideo !== 'undefined') window.playLocalVideo = playLocalVideo;
window.deleteLocalVideo = deleteLocalVideo;


// ============================================================
// ES6 Module 导出
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderVideo,
        renderLocalVideoList,
        filterVideoCourse,
        playVideoFromList,
        // playLocalVideo defined in player.js
        deleteLocalVideo,
        videoCourses: window.videoCourses
    };
}

    renderVideo,
    renderLocalVideoList,
    filterVideoCourse,
    playVideoFromList

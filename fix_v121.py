import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 替换播客课堂页面，添加上传按钮
old_podcast_header = '''<!-- 播客课堂页面 - V32完善版 -->
<div id="page-podcast" class="page">
    <div class="page-header">
        <div class="back-btn" onclick="showPage('home')">←</div>
        <span class="page-title">播客课堂</span>
    </div>'''

new_podcast_header = '''<!-- 播客课堂页面 - V121完整版 -->
<div id="page-podcast" class="page">
    <div class="page-header">
        <div class="back-btn" onclick="showPage('home')">←</div>
        <span class="page-title">播客课堂</span>
        <button onclick="document.getElementById('podcast-upload-modal').classList.add('show')" style="margin-left:auto;background:none;border:none;color:var(--blue);font-size:12px;cursor:pointer;">➕ 上传</button>
    </div>'''

content = content.replace(old_podcast_header, new_podcast_header)

# 2. 在</body>前添加播客上传弹窗
podcast_upload_modal = '''
<!-- V121: 播客上传弹窗 -->
<div class="modal-overlay" id="podcast-upload-modal">
    <div class="modal-content">
        <div class="modal-title">上传音频/视频</div>
        <div style="margin-bottom:16px;">
            <input type="file" id="podcast-file-upload" accept="audio/*,video/*" style="display:none;" onchange="handlePodcastUpload(event)">
            <button onclick="document.getElementById('podcast-file-upload').click()" style="width:100%;padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:12px;color:white;font-size:14px;cursor:pointer;">
                📁 选择音频或视频文件
            </button>
        </div>
        <div id="podcast-upload-preview" style="display:none;margin-bottom:16px;">
            <video id="podcast-upload-video" controls style="width:100%;border-radius:8px;display:none;"></video>
            <audio id="podcast-upload-audio" controls style="width:100%;display:none;"></audio>
        </div>
        <input type="text" id="podcast-upload-title" placeholder="输入标题（可选）" style="width:100%;padding:12px;border:2px solid #f0f0f0;border-radius:10px;margin-bottom:12px;box-sizing:border-box;">
        <button onclick="savePodcastUpload()" style="width:100%;padding:14px;background:linear-gradient(135deg,#43E97B,#38F9D7);border:none;border-radius:12px;color:white;font-size:14px;font-weight:600;cursor:pointer;">✅ 保存</button>
        <button onclick="document.getElementById('podcast-upload-modal').classList.remove('show')" style="width:100%;padding:14px;background:#f0f0f0;border:none;border-radius:12px;color:#666;font-size:14px;margin-top:8px;cursor:pointer;">取消</button>
    </div>
</div>

<!-- V121: 视频上传弹窗 -->
<div class="modal-overlay" id="video-upload-modal">
    <div class="modal-content">
        <div class="modal-title">上传视频/音频</div>
        <div style="margin-bottom:16px;">
            <input type="file" id="video-file-upload" accept="audio/*,video/*" style="display:none;" onchange="handleVideoUploadNew(event)">
            <button onclick="document.getElementById('video-file-upload').click()" style="width:100%;padding:20px;background:linear-gradient(135deg,#FF9A63,#E87A4E);border:none;border-radius:12px;color:white;font-size:14px;cursor:pointer;">
                📁 选择视频或音频文件
            </button>
        </div>
        <div id="video-upload-preview" style="display:none;margin-bottom:16px;">
            <video id="video-upload-video" controls style="width:100%;border-radius:8px;display:none;"></video>
            <audio id="video-upload-audio" controls style="width:100%;display:none;"></audio>
        </div>
        <input type="text" id="video-upload-title" placeholder="输入标题（可选）" style="width:100%;padding:12px;border:2px solid #f0f0f0;border-radius:10px;margin-bottom:12px;box-sizing:border-box;">
        <button onclick="saveVideoUpload()" style="width:100%;padding:14px;background:linear-gradient(135deg,#43E97B,#38F9D7);border:none;border-radius:12px;color:white;font-size:14px;font-weight:600;cursor:pointer;">✅ 保存</button>
        <button onclick="document.getElementById('video-upload-modal').classList.remove('show')" style="width:100%;padding:14px;background:#f0f0f0;border:none;border-radius:12px;color:#666;font-size:14px;margin-top:8px;cursor:pointer;">取消</button>
    </div>
</div>
'''

content = content.replace('</body>', podcast_upload_modal + '</body>')

# 3. 添加上传处理函数
upload_funcs = '''
// V121: 播客上传功能
let tempPodcastFile = null;
let tempVideoFile = null;

function handlePodcastUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    tempPodcastFile = file;
    const isVideo = file.type.startsWith('video/');
    const preview = document.getElementById('podcast-upload-preview');
    const videoEl = document.getElementById('podcast-upload-video');
    const audioEl = document.getElementById('podcast-upload-audio');
    
    preview.style.display = 'block';
    
    if (isVideo) {
        videoEl.style.display = 'block';
        audioEl.style.display = 'none';
        videoEl.src = URL.createObjectURL(file);
    } else {
        videoEl.style.display = 'none';
        audioEl.style.display = 'block';
        audioEl.src = URL.createObjectURL(file);
    }
    
    document.getElementById('podcast-upload-title').value = file.name.replace(/\.[^/.]+$/, '');
}

function savePodcastUpload() {
    if (!tempPodcastFile) {
        alert('请先选择文件');
        return;
    }
    
    const title = document.getElementById('podcast-upload-title').value.trim() || tempPodcastFile.name;
    const url = URL.createObjectURL(tempPodcastFile);
    const isVideo = tempPodcastFile.type.startsWith('video/');
    
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.myPodcasts = user.myPodcasts || [];
        user.myPodcasts.push({
            id: Date.now(),
            title: title,
            type: isVideo ? 'video' : 'audio',
            url: url,
            date: Date.now()
        });
        saveData(data);
        renderMyPodcasts();
        alert('上传成功！');
        document.getElementById('podcast-upload-modal').classList.remove('show');
        document.getElementById('podcast-upload-preview').style.display = 'none';
        tempPodcastFile = null;
    }
}

function handleVideoUploadNew(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    tempVideoFile = file;
    const isVideo = file.type.startsWith('video/');
    const preview = document.getElementById('video-upload-preview');
    const videoEl = document.getElementById('video-upload-video');
    const audioEl = document.getElementById('video-upload-audio');
    
    preview.style.display = 'block';
    
    if (isVideo) {
        videoEl.style.display = 'block';
        audioEl.style.display = 'none';
        videoEl.src = URL.createObjectURL(file);
    } else {
        videoEl.style.display = 'none';
        audioEl.style.display = 'block';
        audioEl.src = URL.createObjectURL(file);
    }
    
    document.getElementById('video-upload-title').value = file.name.replace(/\.[^/.]+$/, '');
}

function saveVideoUpload() {
    if (!tempVideoFile) {
        alert('请先选择文件');
        return;
    }
    
    const title = document.getElementById('video-upload-title').value.trim() || tempVideoFile.name;
    const url = URL.createObjectURL(tempVideoFile);
    const isVideo = tempVideoFile.type.startsWith('video/');
    
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.myVideos = user.myVideos || [];
        user.myVideos.push({
            id: Date.now(),
            title: title,
            type: isVideo ? 'video' : 'audio',
            url: url,
            date: Date.now()
        });
        saveData(data);
        renderMyVideos();
        alert('上传成功！');
        document.getElementById('video-upload-modal').classList.remove('show');
        document.getElementById('video-upload-preview').style.display = 'none';
        tempVideoFile = null;
    }
}

function renderMyPodcasts() {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    const container = document.getElementById('my-podcast-list');
    if (!container) return;
    
    if (!user || !user.myPodcasts || user.myPodcasts.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;font-size:13px;">点击右上角上传音频或视频</div>';
        return;
    }
    
    container.innerHTML = user.myPodcasts.map((p, i) => `
        <div style="display:flex;align-items:center;padding:12px;background:#f8f9fa;border-radius:12px;margin-bottom:8px;cursor:pointer;" onclick="playMyPodcast(${i})">
            <div style="width:44px;height:44px;background:${p.type === 'video' ? 'linear-gradient(135deg,#FF6B6B,#E87A4E)' : 'linear-gradient(135deg,#667eea,#764ba2)'};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;">${p.type === 'video' ? '🎬' : '🎵'}</div>
            <div style="flex:1;margin-left:12px;">
                <div style="font-size:14px;font-weight:600;">${p.title}</div>
                <div style="font-size:12px;color:#999;">${p.type === 'video' ? '视频' : '音频'}</div>
            </div>
            <button onclick="event.stopPropagation();deleteMyPodcast(${i})" style="background:none;border:none;font-size:16px;cursor:pointer;">🗑️</button>
        </div>
    `).join('');
}

function playMyPodcast(index) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (!user || !user.myPodcasts) return;
    
    const p = user.myPodcasts[index];
    if (!p) return;
    
    const audio = document.getElementById('podcast-audio');
    audio.src = p.url;
    document.getElementById('podcast-title').textContent = p.title;
    document.getElementById('podcast-subtitle').textContent = '我的上传';
    audio.play();
    document.getElementById('audio-play-btn').textContent = '⏸';
}

function deleteMyPodcast(index) {
    if (!confirm('确定删除？')) return;
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user && user.myPodcasts) {
        user.myPodcasts.splice(index, 1);
        saveData(data);
        renderMyPodcasts();
    }
}

function renderMyVideos() {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    const container = document.getElementById('my-video-list');
    if (!container) return;
    
    if (!user || !user.myVideos || user.myVideos.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;font-size:13px;">点击"添加"上传视频或音频</div>';
        return;
    }
    
    container.innerHTML = user.myVideos.map((v, i) => `
        <div class="video-card" onclick="playMyVideo(${i})">
            <div class="video-thumb">${v.type === 'video' ? '🎬' : '🎵'}<div class="video-play-overlay">▶</div></div>
            <div class="video-info">
                <div class="video-title">${v.title}</div>
                <div class="video-source">${v.type === 'video' ? '视频' : '音频'}</div>
            </div>
        </div>
    `).join('');
}

function playMyVideo(index) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (!user || !user.myVideos) return;
    
    const v = user.myVideos[index];
    if (!v) return;
    
    playExternalVideo(v.url);
}

function deleteMyVideo(index) {
    if (!confirm('确定删除？')) return;
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user && user.myVideos) {
        user.myVideos.splice(index, 1);
        saveData(data);
        renderMyVideos();
    }
}

function showVideoUploadModal() {
    document.getElementById('video-upload-modal').classList.add('show');
}

'''

# 在updateUI函数前添加
content = re.sub(r'(function updateUI\(\))', upload_funcs + r'\n\1', content)

# 4. 在播放列表后添加"我的上传"区域
content = re.sub(
    r'(<div id="podcast-list" class="topic-list"></div>\s*</div>\s*</div>\s*<audio)',
    r'''<div id="podcast-list" class="topic-list"></div>
    </div>
    
    <!-- V121: 我的上传 -->
    <div class="card">
        <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📁 我的上传</div>
        <div id="my-podcast-list"></div>
    </div>
    
    <audio''',
    content
)

# 5. 修改视频课堂添加按钮
content = content.replace(
    '''<button onclick="showVideoModal()" style="margin-left:auto;background:none;border:none;color:var(--blue);font-size:12px;cursor:pointer;">添加</button>''',
    '''<button onclick="document.getElementById('video-upload-modal').classList.add('show')" style="margin-left:auto;background:none;border:none;color:var(--blue);font-size:12px;cursor:pointer;">➕ 上传</button>'''
)

content = content.replace(
    '''<div class="upload-zone" onclick="showVideoModal()">''',
    '''<div class="upload-zone" onclick="document.getElementById('video-upload-modal').classList.add('show')">'''
)

# 6. 更新updateUI渲染
content = re.sub(
    r'renderPodcastList\(\);\s*\n\s*renderUserList',
    'renderPodcastList();\n    renderMyPodcasts();\n    renderMyVideos();\n    renderUserList',
    content
)

# 7. 更新标题
content = content.replace('<title>认知训练V120</title>', '<title>认知训练V121</title>')
if '<title>认知训练V106</title>' in content:
    content = content.replace('<title>认知训练V106</title>', '<title>认知训练V121</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V121修复完成')

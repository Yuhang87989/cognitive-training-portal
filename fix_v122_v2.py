import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复renderMyPodcasts函数
old_render_my_podcasts = '''function renderMyPodcasts() {
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
}'''

new_render_my_podcasts = '''function renderMyPodcasts() {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    const container = document.getElementById('my-podcast-list');
    if (!container) return;
    
    if (!user || !user.myPodcasts || user.myPodcasts.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;font-size:13px;">点击右上角上传音频或视频</div>';
        return;
    }
    
    let html = '';
    user.myPodcasts.forEach((p, i) => {
        const bgColor = p.type === 'video' ? 'linear-gradient(135deg,#FF6B6B,#E87A4E)' : 'linear-gradient(135deg,#667eea,#764ba2)';
        const icon = p.type === 'video' ? '🎬' : '🎵';
        const typeName = p.type === 'video' ? '视频' : '音频';
        html += '<div style="display:flex;align-items:center;padding:12px;background:#f8f9fa;border-radius:12px;margin-bottom:8px;cursor:pointer;" onclick="playMyPodcast(' + i + ')">';
        html += '<div style="width:44px;height:44px;background:' + bgColor + ';border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;">' + icon + '</div>';
        html += '<div style="flex:1;margin-left:12px;">';
        html += '<div style="font-size:14px;font-weight:600;">' + p.title + '</div>';
        html += '<div style="font-size:12px;color:#999;">' + typeName + '</div>';
        html += '</div>';
        html += '<button onclick="event.stopPropagation();deleteMyPodcast(' + i + ')" style="background:none;border:none;font-size:16px;cursor:pointer;">🗑️</button>';
        html += '</div>';
    });
    container.innerHTML = html;
}'''

content = content.replace(old_render_my_podcasts, new_render_my_podcasts)

# 修复renderMyVideos函数
old_render_my_videos = '''function renderMyVideos() {
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
}'''

new_render_my_videos = '''function renderMyVideos() {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    const container = document.getElementById('my-video-list');
    if (!container) return;
    
    if (!user || !user.myVideos || user.myVideos.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#999;font-size:13px;">点击"添加"上传视频或音频</div>';
        return;
    }
    
    let html = '';
    user.myVideos.forEach((v, i) => {
        const icon = v.type === 'video' ? '🎬' : '🎵';
        const typeName = v.type === 'video' ? '视频' : '音频';
        html += '<div class="video-card" onclick="playMyVideo(' + i + ')">';
        html += '<div class="video-thumb">' + icon + '<div class="video-play-overlay">▶</div></div>';
        html += '<div class="video-info">';
        html += '<div class="video-title">' + v.title + '</div>';
        html += '<div class="video-source">' + typeName + '</div>';
        html += '</div></div>';
    });
    container.innerHTML = html;
}'''

content = content.replace(old_render_my_videos, new_render_my_videos)

# 更新标题
content = content.replace('<title>认知训练V122</title>', '<title>认知训练V122</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V122修复完成 - 播客和视频列表渲染')

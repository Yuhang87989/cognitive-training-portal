import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复视频播放器模态框，添加点击背景关闭和修复关闭按钮
old_video_modal = '''<div class="modal-overlay" id="video-player-modal">
    <div class="modal-content" style="max-width:90%;max-height:90vh;padding:0;background:#000;border-radius:16px;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#1a1a1a;">
            <span id="video-player-title" style="color:white;font-size:14px;">视频播放</span>
            <button onclick="closeVideoPlayer()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">✕</button>
        </div>'''

new_video_modal = '''<div class="modal-overlay" id="video-player-modal" onclick="if(event.target===this)closeVideoPlayer()">
    <div class="modal-content" style="max-width:90%;max-height:90vh;padding:0;background:#000;border-radius:16px;overflow:hidden;position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#1a1a1a;position:relative;z-index:10;">
            <span id="video-player-title" style="color:white;font-size:14px;">视频播放</span>
            <button onclick="closeVideoPlayer()" style="background:rgba(255,255,255,0.2);border:none;color:white;font-size:20px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>'''

content = content.replace(old_video_modal, new_video_modal)

# 修复关闭函数，增加iframe清理
old_close = '''function closeVideoPlayer() {
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('main-video-player');
    video.pause();
    video.src = '';
    modal.classList.remove('show');
}'''

new_close = '''function closeVideoPlayer() {
    console.log('关闭视频播放器');
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('main-video-player');
    const container = document.getElementById('video-container');
    
    // 暂停并清除视频
    if (video) {
        video.pause();
        video.src = '';
    }
    
    // 清除可能的iframe
    if (container) {
        container.innerHTML = '<video id="main-video-player" controls style="width:100%;height:100%;">您的浏览器不支持视频播放</video>';
    }
    
    modal.classList.remove('show');
}'''

content = content.replace(old_close, new_close)

# 更新标题
content = content.replace('<title>认知训练V123</title>', '<title>认知训练V124</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V124修复完成')

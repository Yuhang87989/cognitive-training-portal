import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改sendAvatarChat函数，让它调用DeepSeek API
old_sendAvatarChat = '''function sendAvatarChat() {
    const input = document.getElementById('avatar-chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    const messages = document.getElementById('avatar-chat-messages');
    const teacher = teachers[currentAvatarTeacher];
    
    avatarHistory[currentAvatarTeacher].push({ role: 'user', content: text });
    messages.innerHTML += `<div class="chat-msg user"><div class="chat-avatar">😊</div><div class="chat-bubble">${text}</div></div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) { user.todayQuestions++; saveData(data); }
    
    setTimeout(() => {
        const response = getTeacherResponse(currentAvatarTeacher, text);
        avatarHistory[currentAvatarTeacher].push({ role: 'assistant', content: response });
        messages.innerHTML += `<div class="chat-msg"><div class="chat-avatar">${teacher.icon}</div><div class="chat-bubble">${response}</div></div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 800);
}'''

new_sendAvatarChat = '''async function sendAvatarChat() {
    const input = document.getElementById('avatar-chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    const messages = document.getElementById('avatar-chat-messages');
    const teacher = teachers[currentAvatarTeacher];
    
    avatarHistory[currentAvatarTeacher].push({ role: 'user', content: text });
    messages.innerHTML += `<div class="chat-msg user"><div class="chat-avatar">😊</div><div class="chat-bubble">${text}</div></div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) { user.todayQuestions++; saveData(data); }
    
    // 显示加载中
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-msg';
    loadingDiv.id = 'avatar-loading';
    loadingDiv.innerHTML = `<div class="chat-avatar">${teacher.icon}</div><div class="chat-bubble">⏳ 思考中...</div>`;
    messages.appendChild(loadingDiv);
    messages.scrollTop = messages.scrollHeight;
    
    // 调用DeepSeek API
    const response = await callTeacherDeepSeek(currentAvatarTeacher, text);
    
    // 移除加载提示
    document.getElementById('avatar-loading')?.remove();
    
    avatarHistory[currentAvatarTeacher].push({ role: 'assistant', content: response });
    messages.innerHTML += `<div class="chat-msg"><div class="chat-avatar">${teacher.icon}</div><div class="chat-bubble">${response}</div></div>`;
    messages.scrollTop = messages.scrollHeight;
}

// V119: AI分身调用DeepSeek
async function callTeacherDeepSeek(subject, question) {
    const apiKey = localStorage.getItem('deepseek_api_key') || 'sk-8413f72a3f084fb08c84389555a76d37';
    const subjectPrompts = {
        math: '你是一位专业的数学老师，擅长用简单易懂的方式讲解数学概念和解题思路。请用中文回答。',
        chinese: '你是一位专业的语文老师，擅长阅读理解、写作指导和文言文讲解。请用中文回答。',
        english: 'You are a professional English teacher. Please answer in English or Chinese as appropriate.',
        physics: '你是一位专业的物理老师，擅长讲解物理概念和实验原理。请用中文回答。',
        chemistry: '你是一位专业的化学老师，擅长讲解化学原理和实验。请用中文回答。'
    };
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: subjectPrompts[subject] || subjectPrompts.math },
                    { role: 'user', content: question }
                ]
            })
        });
        
        if (!response.ok) throw new Error('API调用失败');
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch(e) {
        console.error('DeepSeek API error:', e);
        return getTeacherResponse(subject, question);
    }
}'''

content = content.replace(old_sendAvatarChat, new_sendAvatarChat)

# 2. 添加视频播放器模态框
video_player_modal = '''
<!-- V119: 视频播放器模态框 -->
<div class="modal-overlay" id="video-player-modal">
    <div class="modal-content" style="max-width:90%;max-height:90vh;padding:0;background:#000;border-radius:16px;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#1a1a1a;">
            <span id="video-player-title" style="color:white;font-size:14px;">视频播放</span>
            <button onclick="closeVideoPlayer()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">✕</button>
        </div>
        <div id="video-container" style="width:100%;aspect-ratio:16/9;background:#000;">
            <video id="main-video-player" controls style="width:100%;height:100%;">
                您的浏览器不支持视频播放
            </video>
        </div>
        <div style="padding:12px;background:#1a1a1a;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <input type="text" id="video-url-input" placeholder="粘贴视频链接或上传本地视频" style="flex:1;padding:10px;border:none;border-radius:8px;font-size:13px;">
                <input type="file" id="video-file-input" accept="video/*" style="display:none;" onchange="handleVideoUpload(event)">
                <button onclick="document.getElementById('video-file-input').click()" style="padding:10px 16px;background:#3377FF;border:none;border-radius:8px;color:white;cursor:pointer;">📁 本地视频</button>
                <button onclick="loadVideoUrl()" style="padding:10px 16px;background:#43E97B;border:none;border-radius:8px;color:white;cursor:pointer;">▶ 播放链接</button>
            </div>
        </div>
    </div>
</div>
'''

# 在</body>前添加
content = content.replace('</body>', video_player_modal + '</body>')

# 3. 修改playExternalVideo函数，使用内置播放器
old_playExternalVideo = '''function playExternalVideo(url) {
    // 尝试在新窗口打开外部视频链接
    window.open(url, '_blank');
}'''

new_playExternalVideo = '''function playExternalVideo(url) {
    // V119: 使用内置播放器
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('main-video-player');
    const title = document.getElementById('video-player-title');
    
    // 尝试识别视频类型
    if (url.includes('bilibili.com')) {
        // B站视频
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        if (bvMatch) {
            title.textContent = '📺 B站视频';
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&high_quality=1`;
            iframe.style.cssText = 'width:100%;height:100%;border:none;';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            const container = document.getElementById('video-container');
            container.innerHTML = '';
            container.appendChild(iframe);
        }
    } else {
        // 其他视频链接
        title.textContent = '📺 视频播放';
        video.src = url;
        video.play();
    }
    
    modal.classList.add('show');
}

function closeVideoPlayer() {
    const modal = document.getElementById('video-player-modal');
    const video = document.getElementById('main-video-player');
    video.pause();
    video.src = '';
    modal.classList.remove('show');
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const video = document.getElementById('main-video-player');
        const url = URL.createObjectURL(file);
        video.src = url;
        document.getElementById('video-player-title').textContent = '📺 ' + file.name;
        video.play();
    }
}

function loadVideoUrl() {
    const url = document.getElementById('video-url-input').value.trim();
    if (url) {
        playExternalVideo(url);
    } else {
        alert('请输入视频链接');
    }
}

function showVideoModal() {
    const modal = document.getElementById('video-player-modal');
    document.getElementById('video-url-input').value = '';
    document.getElementById('video-player-title').textContent = '📺 视频播放';
    modal.classList.add('show');
}'''

content = content.replace(old_playExternalVideo, new_playExternalVideo)

# 4. 更新标题
content = content.replace('<title>认知训练V118</title>', '<title>认知训练V119</title>')
content = content.replace('认知训练V117', '认知训练V119')
if '<title>认知训练V106</title>' in content:
    content = content.replace('<title>认知训练V106</title>', '<title>认知训练V119</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V119修复完成')

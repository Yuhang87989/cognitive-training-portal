import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复renderPodcastList函数
old_render = '''function renderPodcastList() {
    const list = podcastData[currentPodcastCategory] || [];
    const container = document.getElementById('podcast-list');
    
    container.innerHTML = list.map((p, i) => `
        <div class="topic-item ${i === currentAudioIndex ? 'active' : ''}" onclick="selectAudio(${i})" style="${i === currentAudioIndex ? 'border:2px solid #667eea;' : ''}">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:24px;">${p.icon}</span>
                <div style="flex:1;">
                    <div style="font-weight:600;font-size:14px;">${p.title}</div>
                    <div style="font-size:11px;color:var(--text-light);">${p.author} · ${formatTime(p.duration)}</div>
                </div>
                <div style="color:var(--blue);">▶</div>
            </div>
        </div>
    `).join('');
}'''

new_render = '''function renderPodcastList() {
    const list = podcastData[currentPodcastCategory] || [];
    const container = document.getElementById('podcast-list');
    
    let html = '';
    list.forEach((p, i) => {
        const isActive = i === currentAudioIndex;
        html += '<div class="topic-item" onclick="selectAudio(' + i + ')" style="padding:12px;background:' + (isActive ? 'rgba(102,126,234,0.1)' : 'white') + ';border-radius:12px;margin-bottom:8px;cursor:pointer;' + (isActive ? 'border:2px solid #667eea;' : '') + '">';
        html += '<div style="display:flex;align-items:center;gap:10px;">';
        html += '<div style="width:44px;height:44px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;">' + p.icon + '</div>';
        html += '<div style="flex:1;">';
        html += '<div style="font-weight:600;font-size:14px;">' + p.title + '</div>';
        html += '<div style="font-size:11px;color:#999;">' + p.author + ' · ' + formatTime(p.duration) + '</div>';
        html += '</div>';
        html += '<div style="width:36px;height:36px;background:' + (isActive ? '#667eea' : '#f0f0f0') + ';border-radius:50%;display:flex;align-items:center;justify-content:center;color:' + (isActive ? 'white' : '#666') + ';font-size:14px;">' + (isActive ? '⏸' : '▶') + '</div>';
        html += '</div></div>';
    });
    container.innerHTML = html;
}'''

content = content.replace(old_render, new_render)

# 更新标题
content = content.replace('<title>认知训练V121</title>', '<title>认知训练V122</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V122修复完成')

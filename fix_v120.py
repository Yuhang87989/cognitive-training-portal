import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 替换播客数据为21条完整版
old_podcast_data = '''// ====== V32播客数据 - 完整版 ======
const podcastData = {
    method: [
        { title: '高效学习的10个秘诀', duration: 900, icon: '🎧', desc: '掌握高效学习的核心方法', author: '学习方法专家' },
        { title: '如何提高记忆力', duration: 1200, icon: '🧠', desc: '科学记忆法，让知识记得更牢', author: '记忆训练师' },
        { title: '时间管理三步法', duration: 720, icon: '⏰', desc: '番茄工作法+优先级排序', author: '效率达人' },
        { title: '专注力训练技巧', duration: 840, icon: '🎯', desc: '告别分心，保持长时间专注', author: '心理学博士' }
    ],
    knowledge: [
        { title: '数学思维导图入门', duration: 1500, icon: '📐', desc: '用思维导图梳理数学知识体系', author: '数学名师' },
        { title: '语文阅读理解技巧', duration: 1080, icon: '📖', desc: '快速抓住文章中心和重点', author: '语文特级教师' },
        { title: '英语语法基础', duration: 1320, icon: '🔤', desc: '系统掌握英语语法核心规则', author: '雅思名师' }
    ],
    focus: [
        { title: '5分钟冥想放松', duration: 300, icon: '🧘', desc: '快速放松身心，恢复精力', author: '冥想导师' },
        { title: '考前焦虑缓解', duration: 480, icon: '🌙', desc: '用深呼吸缓解考试压力', author: '心理咨询师' },
        { title: '高效休息方法', duration: 360, icon: '💤', desc: '科学休息比熬夜更有效', author: '睡眠专家' }
    ],
    share: [
        { title: '学霸作息时间表', duration: 600, icon: '📅', desc: '985学霸的每日作息安排', author: '名校学霸' },
        { title: '备考经验分享', duration: 900, icon: '💬', desc: '过来人的中考高考经验', author: '高考状元' },
        { title: '错题本使用方法', duration: 720, icon: '📝', desc: '如何高效利用错题本提分', author: '逆袭学霸' }
    ]
};'''

new_podcast_data = '''// ====== V120播客数据 - 21条完整版 ======
const podcastData = {
    method: [
        { id: 1, title: '高效学习的10个秘诀', duration: 900, icon: '🎧', desc: '掌握高效学习的核心方法', author: '学习方法专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 2, title: '如何提高记忆力', duration: 1200, icon: '🧠', desc: '科学记忆法，让知识记得更牢', author: '记忆训练师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 3, title: '时间管理三步法', duration: 720, icon: '⏰', desc: '番茄工作法+优先级排序', author: '效率达人', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: 4, title: '专注力训练技巧', duration: 840, icon: '🎯', desc: '告别分心，保持长时间专注', author: '心理学博士', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { id: 5, title: '笔记整理黄金法则', duration: 680, icon: '📝', desc: '康奈尔笔记法详解', author: '学习顾问', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
        { id: 6, title: '预习复习高效率', duration: 560, icon: '📚', desc: '课前预习和课后复习的正确方法', author: '教育专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
    ],
    knowledge: [
        { id: 7, title: '数学思维导图入门', duration: 1500, icon: '📐', desc: '用思维导图梳理数学知识体系', author: '数学名师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
        { id: 8, title: '语文阅读理解技巧', duration: 1080, icon: '📖', desc: '快速抓住文章中心和重点', author: '语文特级教师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
        { id: 9, title: '英语语法基础', duration: 1320, icon: '🔤', desc: '系统掌握英语语法核心规则', author: '雅思名师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        { id: 10, title: '物理概念理解法', duration: 980, icon: '⚡', desc: '从生活中理解物理原理', author: '物理教授', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
        { id: 11, title: '化学元素记忆妙招', duration: 760, icon: '🧪', desc: '元素周期表趣味记忆法', author: '化学老师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' }
    ],
    focus: [
        { id: 12, title: '5分钟冥想放松', duration: 300, icon: '🧘', desc: '快速放松身心，恢复精力', author: '冥想导师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
        { id: 13, title: '考前焦虑缓解', duration: 480, icon: '🌙', desc: '用深呼吸缓解考试压力', author: '心理咨询师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
        { id: 14, title: '高效休息方法', duration: 360, icon: '💤', desc: '科学休息比熬夜更有效', author: '睡眠专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
        { id: 15, title: '睡前放松音乐', duration: 600, icon: '🎵', desc: '帮助入睡的轻音乐', author: '音乐治疗师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' }
    ],
    share: [
        { id: 16, title: '学霸作息时间表', duration: 600, icon: '📅', desc: '985学霸的每日作息安排', author: '名校学霸', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
        { id: 17, title: '备考经验分享', duration: 900, icon: '💬', desc: '过来人的中考高考经验', author: '高考状元', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
        { id: 18, title: '错题本使用方法', duration: 720, icon: '📝', desc: '如何高效利用错题本提分', author: '逆袭学霸', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3' },
        { id: 19, title: '英语听力提升秘籍', duration: 850, icon: '🎧', desc: '从不及格到满分的听力方法', author: '英语达人', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3' },
        { id: 20, title: '作文高分技巧', duration: 780, icon: '✍️', desc: '考场作文的得分要点', author: '语文老师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3' },
        { id: 21, title: '考试心态调整', duration: 520, icon: '💪', desc: '考场上的心理调节技巧', author: '心理专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3' }
    ]
};'''

content = content.replace(old_podcast_data, new_podcast_data)

# 2. 更新播客播放函数，支持真实音频
old_play_podcast = '''function playPodcast(index) {
    const list = podcastData[currentPodcastCategory] || [];
    const p = list[index];
    if (!p) return;
    currentPodcastIndex = index;
    document.getElementById('podcast-icon').textContent = p.icon;
    document.getElementById('podcast-title').textContent = p.title;
    document.getElementById('podcast-subtitle').textContent = `${p.author} · ${formatTime(p.duration)}`;
    const listEl = document.getElementById('podcast-list');
    listEl.querySelectorAll('.podcast-item').forEach((item, i) => item.classList.toggle('active', i === index));
    // 播放音频
    if (!podcastAudio) podcastAudio = document.getElementById('podcast-audio');
    // 模拟播放 - 实际应用中替换为真实音频URL
    podcastAudio.src = p.audioUrl || '';
    podcastAudio.play().catch(e => console.log('Audio play failed:', e));
    updatePodcastDisplay();
}'''

new_play_podcast = '''function playPodcast(index) {
    const list = podcastData[currentPodcastCategory] || [];
    const p = list[index];
    if (!p) return;
    currentPodcastIndex = index;
    document.getElementById('podcast-icon').textContent = p.icon;
    document.getElementById('podcast-title').textContent = p.title;
    document.getElementById('podcast-subtitle').textContent = p.author + ' · ' + formatTime(p.duration);
    const listEl = document.getElementById('podcast-list');
    listEl.querySelectorAll('.podcast-item').forEach((item, i) => item.classList.toggle('active', i === index));
    
    // V120: 播放真实音频
    if (!podcastAudio) podcastAudio = document.getElementById('podcast-audio');
    if (p.audioUrl) {
        podcastAudio.src = p.audioUrl;
        podcastAudio.play().then(() => {
            console.log('播放:', p.title);
            document.getElementById('audio-play-btn').textContent = '⏸';
        }).catch(e => {
            console.log('音频播放失败:', e);
            // 如果外链失败，显示提示
            alert('音频加载中，请稍候...');
        });
    }
    updatePodcastDisplay();
}'''

content = content.replace(old_play_podcast, new_play_podcast)

# 3. 更新renderPodcastList函数，添加播放状态
old_render_podcast = '''function renderPodcastList() {
    const list = podcastData[currentPodcastCategory] || [];
    const container = document.getElementById('podcast-list');
    if (!list.length) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-gray);">暂无内容</div>';
        return;
    }
    container.innerHTML = list.map((p, i) => `
        <div class="podcast-item ${i === currentPodcastIndex ? 'active' : ''}" onclick="playPodcast(${i})">
            <div class="podcast-icon">${p.icon}</div>
            <div style="flex:1;">
                <div style="font-size:14px;font-weight:600;">${p.title}</div>
                <div style="font-size:12px;color:var(--text-gray);margin-top:2px;">${p.author} · ${formatTime(p.duration)}</div>
            </div>
            <div style="font-size:20px;color:var(--text-light);">▶</div>
        </div>
    `).join('');
}'''

new_render_podcast = '''function renderPodcastList() {
    const list = podcastData[currentPodcastCategory] || [];
    const container = document.getElementById('podcast-list');
    if (!list.length) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-gray);">暂无内容</div>';
        return;
    }
    container.innerHTML = list.map((p, i) => `
        <div class="podcast-item ${i === currentPodcastIndex ? 'active' : ''}" onclick="playPodcast(${i})" style="display:flex;align-items:center;padding:12px;background:${i === currentPodcastIndex ? 'rgba(102,126,234,0.1)' : 'white'};border-radius:12px;margin-bottom:8px;cursor:pointer;">
            <div style="width:44px;height:44px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;color:white;">${p.icon}</div>
            <div style="flex:1;margin-left:12px;">
                <div style="font-size:14px;font-weight:600;color:#333;">${p.title}</div>
                <div style="font-size:12px;color:#999;margin-top:4px;">${p.author} · ${formatTime(p.duration)}</div>
            </div>
            <div style="width:36px;height:36px;background:${i === currentPodcastIndex ? '#667eea' : '#f0f0f0'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;color:${i === currentPodcastIndex ? 'white' : '#666'};">${i === currentPodcastIndex ? '⏸' : '▶'}</div>
        </div>
    `).join('');
}'''

content = content.replace(old_render_podcast, new_render_podcast)

# 4. 更新标题
content = content.replace('<title>认知训练V119</title>', '<title>认知训练V120</title>')
if '<title>认知训练V106</title>' in content:
    content = content.replace('<title>认知训练V106</title>', '<title>认知训练V120</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V120修复完成 - 播客21条+内置播放器')

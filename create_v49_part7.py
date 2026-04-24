import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 14. 添加游戏全屏页面HTML（在video-player-modal之后）
game_fullscreen_html = '''

<!-- 游戏全屏页面 -->
<div id="fullscreen-game" class="fullscreen-page" style="z-index:500;">
    <div class="fp-header" style="background:var(--blue);color:white;">
        <div class="fp-back" onclick="closeGameFullscreen()" style="color:white;">←</div>
        <div class="fp-title" id="game-title" style="color:white;">游戏</div>
        <div style="display:flex;align-items:center;gap:8px;">
            <span id="game-level" style="font-size:12px;background:rgba(255,255,255,0.2);padding:4px 8px;border-radius:10px;">Lv.1</span>
            <span id="game-score" style="font-size:14px;font-weight:bold;">0</span>
        </div>
    </div>
    <div class="fp-content" id="game-board" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
    </div>
    <div class="fp-nav" style="background:white;">
        <div class="fp-nav-item" onclick="closeGameFullscreen()">
            <div class="fp-nav-icon">🏠</div><div>退出</div>
        </div>
        <div class="fp-nav-item" onclick="resetGame()">
            <div class="fp-nav-icon">🔄</div><div>重玩</div>
        </div>
    </div>
</div>

'''

# 找到video-player-modal结束位置并插入
pos = content.find('<!-- 通用模态框 -->')
if pos > 0:
    content = content[:pos] + game_fullscreen_html + content[pos:]

# 15. 添加播放播客函数（在</script>之前）
podcast_functions = '''
// ====== 播客音频播放 ======
const audioResources = {
    'audio1': { url: '', title: '英语听力训练技巧' },
    'audio2': { url: '', title: '费曼学习法详解' },
    'audio3': { url: '', title: '时间管理秘诀' },
    'audio4': { url: '', title: '数学思维培养' },
    'audio5': { url: '', title: '古诗词鉴赏技巧' },
    'audio6': { url: '', title: '物理概念入门' },
    'audio7': { url: '', title: '化学元素周期表' },
    'audio8': { url: '', title: '番茄工作法实践' },
    'audio9': { url: '', title: '艾宾浩斯记忆法' },
    'audio10': { url: '', title: '阅读理解技巧' },
    'audio11': { url: '', title: '写作能力提升' },
    'audio12': { url: '', title: '光学原理讲解' },
    'audio13': { url: '', title: '力学基础入门' },
    'audio14': { url: '', title: '化学反应原理' },
    'audio15': { url: '', title: '思维导图绘制' },
    'audio16': { url: '', title: '完形填空技巧' },
    'audio17': { url: '', title: '文言文学习方法' },
    'audio18': { url: '', title: '声学基础知识' },
    'audio19': { url: '', title: '酸碱盐专题' },
    'audio20': { url: '', title: '数学解题思路' },
    'audio21': { url: '', title: '学霸时间表分享' }
};

const videoResources = {
    'video1': { url: '', title: '勾股定理证明' },
    'video2': { url: '', title: '一元二次方程解法' },
    'video3': { url: '', title: '力的合成与分解' },
    'video4': { url: '', title: '欧姆定律精讲' },
    'video5': { url: '', title: '化学方程式配平技巧' },
    'video6': { url: '', title: '质量守恒定律' },
    'video7': { url: '', title: '三角形全等证明' },
    'video8': { url: '', title: '浮力计算方法' },
    'video9': { url: '', title: '溶液配制计算' },
    'video10': { url: '', title: '函数图像变换' },
    'video11': { url: '', title: '机械效率计算' },
    'video12': { url: '', title: '酸碱盐反应规律' },
    'video13': { url: '', title: '圆与直线的位置关系' },
    'video14': { url: '', title: '电功率计算专题' },
    'video15': { url: '', title: '金属活动性顺序应用' },
    'video16': { url: '', title: '相似三角形判定' },
    'video17': { url: '', title: '能量转化与守恒' },
    'video18': { url: '', title: '物质的分类' },
    'video19': { url: '', title: '概率统计初步' },
    'video20': { url: '', title: '压强计算专题' },
    'video21': { url: '', title: '化学实验操作规范' }
};

let currentAudio = null;
let audioPlayer = null;

function playPodcast(title, audioId) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = \`
        <div style="text-align:center;margin-bottom:20px;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">🎧</div>
            <div style="font-size:16px;font-weight:bold;">\${title}</div>
        </div>
        <div class="audio-controls" style="margin:20px 0;">
            <button class="audio-btn" onclick="toggleAudioPlay()" id="audio-play-btn">▶</button>
            <div style="flex:1;">
                <div class="audio-progress" onclick="seekAudio(event)">
                    <div class="audio-progress-bar" id="audio-progress-bar" style="width:0%;"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:8px;">
                    <span id="audio-current-time" style="font-size:11px;color:var(--text-gray);">0:00</span>
                    <span id="audio-duration" style="font-size:11px;color:var(--text-gray);">--:--</span>
                </div>
            </div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
            <div style="font-size:13px;color:var(--text-gray);">音频课程正在播放</div>
            <div style="font-size:12px;color:var(--text-light);margin-top:4px;">实际使用时替换为真实音频链接</div>
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    \`;
    currentAudio = { id: audioId, title: title, isPlaying: false, currentTime: 0, duration: 600 };
    showToast('正在播放: ' + title);
}

function toggleAudioPlay() {
    if (!currentAudio) return;
    const btn = document.getElementById('audio-play-btn');
    currentAudio.isPlaying = !currentAudio.isPlaying;
    btn.textContent = currentAudio.isPlaying ? '⏸' : '▶';
    if (currentAudio.isPlaying) {
        // 模拟播放进度
        if (!window.audioInterval) {
            window.audioInterval = setInterval(() => {
                if (currentAudio && currentAudio.isPlaying) {
                    currentAudio.currentTime += 1;
                    updateAudioProgress();
                }
            }, 1000);
        }
    }
}

function updateAudioProgress() {
    if (!currentAudio) return;
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    document.getElementById('audio-progress-bar').style.width = progress + '%';
    document.getElementById('audio-current-time').textContent = formatTime(currentAudio.currentTime);
    document.getElementById('audio-duration').textContent = formatTime(currentAudio.duration);
}

function seekAudio(e) {
    if (!currentAudio) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentAudio.currentTime = Math.floor(percent * currentAudio.duration);
    updateAudioProgress();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function playVideoCourse(title, videoId) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = \`
        <div style="text-align:center;margin-bottom:20px;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#FF9A63,#E87A4E);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">🎬</div>
            <div style="font-size:16px;font-weight:bold;">\${title}</div>
        </div>
        <div style="background:#f0f0f0;border-radius:12px;padding:60px 20px;text-align:center;margin-bottom:16px;">
            <div style="font-size:48px;margin-bottom:12px;">▶</div>
            <div style="font-size:13px;color:var(--text-gray);">视频课程</div>
            <div style="font-size:12px;color:var(--text-light);margin-top:4px;">实际使用时替换为真实视频链接</div>
        </div>
        <div style="display:flex;gap:8px;">
            <button class="login-btn login-btn-outline" style="flex:1;" onclick="closeModal()">关闭</button>
            <button class="login-btn login-btn-primary" style="flex:1;">收藏</button>
        </div>
    \`;
    showToast('视频课程: ' + title);
}

function filterVideo(category, btn) {
    document.querySelectorAll('#video-list .video-item').forEach(item => {
        if (category === 'all') {
            item.style.display = 'flex';
        } else {
            const meta = item.querySelector('.video-meta').textContent;
            item.style.display = meta.includes(category === 'math' ? '数学' : category === 'physics' ? '物理' : '化学') ? 'flex' : 'none';
        }
    });
    document.querySelectorAll('.grade-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ====== 学霸方法训练 ======
const methodPractices = {
    feyman: {
        title: '🧠 费曼学习法训练',
        tasks: [
            '选择一个你学过的知识点',
            '用最简单的语言解释给"小白"听',
            '找出讲解中不清楚的地方',
            '重新组织语言，简化解释',
            '用比喻或类比让解释更生动'
        ]
    },
    pomodoro: {
        title: '🍅 番茄工作法练习',
        tasks: [
            '选择一个学习任务',
            '设定25分钟倒计时',
            '专注完成，中途不休息',
            '计时结束后休息5分钟',
            '完成4个番茄后休息15-30分钟'
        ]
    },
    ebbinghaus: {
        title: '🧮 艾宾浩斯记忆测试',
        tasks: [
            '记忆10个无规律数字',
            '1小时后尝试回忆',
            '记录正确数量',
            '24小时后再回忆',
            '比较记忆效果曲线'
        ]
    },
    mindmap: {
        title: '🎨 思维导图绘制',
        tasks: [
            '选择一个主题词',
            '在中心画出主题',
            '展开3-5个主要分支',
            '每个分支添加细节',
            '用颜色和图标美化'
        ]
    },
    cornell: {
        title: '📋 康奈尔笔记练习',
        tasks: [
            '准备康奈尔笔记本',
            '右侧记录课堂笔记',
            '左侧写下关键词线索',
            '底部写总结和疑问',
            '课后24小时内复习'
        ]
    },
    sq3r: {
        title: '📖 SQ3R阅读训练',
        tasks: [
            'Survey: 预览文章结构和标题',
            'Question: 提出你想了解的问题',
            'Read: 仔细阅读全文',
            'Recite: 复述主要内容',
            'Review: 复习并整理笔记'
        ]
    }
};

function startMethodPractice(method) {
    const practice = methodPractices[method];
    if (!practice) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    let html = \`<div class="modal-title">\${practice.title}</div>\`;
    practice.tasks.forEach((task, i) => {
        html += \`
            <div class="plan-task" onclick="this.classList.toggle('completed')">
                <div class="task-checkbox" id="task-\${i}"></div>
                <div class="task-text">\${task}</div>
            </div>
        \`;
    });
    html += \`<button class="modal-close" onclick="closeModal()">完成训练</button>\`;
    content.innerHTML = html;
}

function filterPodcast(category, btn) {
    document.querySelectorAll('#podcast-list .podcast-item').forEach(item => {
        if (category === 'all') {
            item.style.display = 'flex';
        } else {
            const meta = item.querySelector('.podcast-meta').textContent;
            const catMap = { study: '学习方法', science: '科普', story: '名人故事' };
            item.style.display = meta.includes(catMap[category]) ? 'flex' : 'none';
        }
    });
    document.querySelectorAll('.grade-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

'''

# 找到</script>结束位置并插入
pos = content.rfind('</script>')
if pos > 0:
    content = content[:pos] + podcast_functions + '\n' + content[pos:]

print("Step 14-15 completed: Added game fullscreen page and podcast/video functions")
print(f"File length: {len(content)} characters")

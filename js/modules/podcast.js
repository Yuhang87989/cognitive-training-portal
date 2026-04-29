// 简化版播客模块 - V141
// 设计原则：简单、不乱、好用

let currentPodcastId = null;
var podcastCourses = [
    {id:'podcast1',title:'告别背书苦海！3个记忆妙招助你逆袭',teacher:'学习方法专家',duration:'6:14',durationSec:374,category:'学霸方法',gradient:'linear-gradient(135deg,#667eea,#764ba2)',icon:'🧠',shareUrl:'https://www.coze.cn/s/3rTjJ7Xbdc0/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_b2ff66a9-c071-4912-84a7-51f174fd69a2.mp3?sign=1808822218-8a2b090761-0-db0b581cf15d5b549a623ffb6c882f7614bd5a52476bb36c7923398ca409fa2e',views:25000},
    {id:'podcast2',title:'青少年高效笔记法，学习效率翻倍',teacher:'学习方法专家',duration:'5:48',durationSec:348,category:'学霸方法',gradient:'linear-gradient(135deg,#FF9A63,#E87A4E)',icon:'📝',shareUrl:'https://www.coze.cn/s/HAjMzHnxwvY/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_2fd6258b-4ebd-49a9-b1a8-20e8a3bfc750.mp3?sign=1808822237-742cb735e5-0-7c9279fb8f5480d82654cddd5352da5266e2f317c6d5b82d9ba9d0b0ad27e949',views:18000},
    {id:'podcast3',title:'3招让24小时变48小时',teacher:'时间管理导师',duration:'7:22',durationSec:442,category:'学霸方法',gradient:'linear-gradient(135deg,#43E97B,#38F9D7)',icon:'⏰',shareUrl:'https://www.coze.cn/s/uPgU_c9cAIY/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_c5a06139-dfe9-4a14-94ba-c4d7b4625415.mp3?sign=1808822260-6f500b4d28-0-22cd0458027452b72a475fefc73d0a0ba5b3d3751d601e4212544fb2a1aa9f76',views:22000},
    {id:'podcast4',title:'告别无效复习！3个高效策略学起来',teacher:'心理学专家',duration:'5:55',durationSec:355,category:'学霸方法',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)',icon:'🎯',shareUrl:'https://www.coze.cn/s/-FFxXRTedN0/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_07040e43-b7ad-46d4-9713-21a6c6042b74.mp3?sign=1808822280-ffd1dd4d3b-0-6431d1416b2b2a3b1f95d5f6f9e83aaef2d488610c77c115f7821dfa2f28f0d6',views:19500},
    {id:'podcast5',title:'3招提升专注力，学习不走神',teacher:'特级教师',duration:'8:30',durationSec:510,category:'学霸方法',gradient:'linear-gradient(135deg,#fa709a,#fee140)',icon:'💡',shareUrl:'https://www.coze.cn/s/ymrXMhQcvNY/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_de865d7b-5968-40eb-ab49-1c2c8267b91a.mp3?sign=1808822299-57d9bb9b64-0-3ea6ff42e8b9c864cf4cd90b0ffb7d65cb7b7b751cb41db81e82e6eb62cdd9db',views:28000},
    {id:'podcast6',title:'解锁语文思维，成绩飞升秘籍',teacher:'数学特级教师',duration:'9:15',durationSec:555,category:'数学',gradient:'linear-gradient(135deg,#667eea,#764ba2)',icon:'📐',shareUrl:'https://www.coze.cn/s/-w-VgFqqOrY/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_dd67352a-9393-459b-a1f1-6bda3e18f981.mp3?sign=1808822317-56d7f651b3-0-28417c62e06224c9cf80f35f8af989626ffc33d2e2502c3130785368e9ce09bd',views:15600},
    {id:'podcast7',title:'青少年英语思维训练秘籍大公开',teacher:'英语教学专家',duration:'10:20',durationSec:620,category:'英语',gradient:'linear-gradient(135deg,#FF9A63,#E87A4E)',icon:'📖',shareUrl:'https://www.coze.cn/s/FxptvND8qlo/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_ac794835-56ea-4d8b-9235-c66734d871fd.mp3?sign=1808822337-025aeaf324-0-61003ca935760bda5b4b100466e092f616ea1e54b4ac66c50ca03d1a7aeaa13c',views:21000},
    {id:'podcast8',title:'考试总失常？三大秘籍助你超常发挥',teacher:'物理特级教师',duration:'8:45',durationSec:525,category:'物理',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)',icon:'⚡',shareUrl:'https://www.coze.cn/s/mLuQHON0Zzk/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_3c6ecfdb-240c-4c43-ae42-517e9500191a.mp3?sign=1808822357-e1bb3cce5d-0-d9f0b91e85630533e0f17758561b9a94fc854681da05897c006f1648ecf0789c',views:12800},
    {id:'podcast9',title:'学霸私藏！高效解题策略大公开',teacher:'化学教学专家',duration:'7:55',durationSec:475,category:'化学',gradient:'linear-gradient(135deg,#43E97B,#38F9D7)',icon:'🧪',shareUrl:'https://www.coze.cn/s/UUMhRMn7SDg/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_7fde4727-ef0e-4223-b2a6-6cfb161ebe1e.mp3?sign=1808822377-6614d63cf1-0-c26f088cbea7ffde60aa608f4cb3447409f90aec8daaecef46f9f66f0bf211d5',views:9800},
    {id:'podcast10',title:'背了知识点还不会做题？学霸秘籍来了',teacher:'语文特级教师',duration:'6:30',durationSec:390,category:'语文',gradient:'linear-gradient(135deg,#667eea,#764ba2)',icon:'📜',shareUrl:'https://www.coze.cn/s/t6s2x0F0XAs/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_0aba77f8-7f80-40ff-8162-cb05249a77d4.mp3?sign=1808822396-aff28ed097-0-aed572ea8f7a273ef46a32d5c1e0251a9e5bda3c0c4b89b8c01ea57d9a34e466',views:14200},
    {id:'podcast11',title:'数学不难！五大思维轻松学',teacher:'语文教学专家',duration:'7:10',durationSec:430,category:'语文',gradient:'linear-gradient(135deg,#FF9A63,#E87A4E)',icon:'✍️',shareUrl:'https://www.coze.cn/s/YiJe4WN8ErI/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_fce14f3a-0b27-4031-a759-b98a9b4f5462.mp3?sign=1808822415-02cbf44b7d-0-aec82b483efb8d5167092306269e819aa51c07b96585b476935c5c9a8dfdf916',views:11500},
    {id:'podcast12',title:'数学难题克星：抽象思维与逻辑推理',teacher:'学习方法专家',duration:'5:40',durationSec:340,category:'学霸方法',gradient:'linear-gradient(135deg,#fa709a,#fee140)',icon:'🧠',shareUrl:'https://www.coze.cn/s/TcqwrK5jqWM/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_74377773-4613-433b-8770-6e71617143c5.mp3?sign=1808822437-e3fc320231-0-1fd1d97d9432139f1306256dcf8c0a28134fc0a1ffb56143dce1b7603e4000a2',views:32000},
    {id:'podcast13',title:'青少年数学思维：数形结合专项',teacher:'时间管理导师',duration:'4:50',durationSec:290,category:'学霸方法',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)',icon:'🍅',shareUrl:null,url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_a9c2d6ef-39f7-4e9e-9ad0-dfbd617da342.mp3?sign=1808822460-e852b8517d-0-d3931869e74bedc74ff0dfea0159aa447af3b9f6f32b697fd5deca9f0e7a3697',views:24500},
    {id:'podcast14',title:'生活中的数学建模：从选套餐到做决策',teacher:'心理学专家',duration:'6:15',durationSec:375,category:'学霸方法',gradient:'linear-gradient(135deg,#43E97B,#38F9D7)',icon:'🧮',shareUrl:'https://www.coze.cn/s/9cS58bZwn1g/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_9a49ac3b-fc52-4b46-b49a-f167b9f69666.mp3?sign=1808822480-b008c57b10-0-a7decfcb0caafc899c866bddac69113034895e0a21ef1c703b501e2025a63435',views:19800},
    {id:'podcast15',title:'数学解题新思路：逆向思维超实用',teacher:'学习方法专家',duration:'5:25',durationSec:325,category:'学霸方法',gradient:'linear-gradient(135deg,#667eea,#764ba2)',icon:'🎨',shareUrl:'https://www.coze.cn/s/0QgmPaZ9sUI/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_e4133953-42e9-40ab-8d38-353a0af47b67.mp3?sign=1808822502-b4486d965a-0-1963b371579adcde889413e4f09cc769baeaf20133ffa8362a8eb69bcb0f2258',views:17600},
    {id:'podcast16',title:'物理学的两把解题钥匙',teacher:'学习方法专家',duration:'4:35',durationSec:275,category:'学霸方法',gradient:'linear-gradient(135deg,#FF9A63,#E87A4E)',icon:'📋',shareUrl:'https://www.coze.cn/s/qAgLfdh6aPE/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_cf2e54de-0e8d-4e99-961d-177c36d77c85.mp3?sign=1808822523-a5faca0e98-0-7b07032ede86cf98f91fceceea78d5ae43de8e2fa60e8f31016865c6b780a0b9',views:15900},
    {id:'podcast17',title:'揭秘物理学家的模型思维',teacher:'语文教学专家',duration:'5:05',durationSec:305,category:'学霸方法',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)',icon:'📖',shareUrl:'https://www.coze.cn/s/9zZnticB374/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_acbd098a-be94-4246-bcb2-31648cb28f74.mp3?sign=1808822546-5f85da809d-0-4d2e65d676727ae5fb4818d7b0e886cf21d6cce96a5e72771bb5dd041988f56e',views:13400},
    {id:'podcast18',title:'Week1复盘&Week2记忆训练计划',teacher:'心理学专家',duration:'6:45',durationSec:405,category:'学霸方法',gradient:'linear-gradient(135deg,#fa709a,#fee140)',icon:'🚀',shareUrl:null,url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_8fa2b6e8-39f5-4e9f-b1d3-efad618da243.mp3?sign=1808822560-b008c57b10-1-c26f088cbea7ffde60aa608f4cb3447409f90aec8daaecef46f9f66f0bf211d5',views:24500},
    {id:'podcast19',title:'如何培养数学直觉',teacher:'数学特级教师',duration:'8:00',durationSec:480,category:'数学',gradient:'linear-gradient(135deg,#667eea,#764ba2)',icon:'🔢',shareUrl:'https://www.coze.cn/s/abc123456789/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_1abc2345-56cd-4e8f-a2d3-1abc2345def6.mp3?sign=1808822580-abc1234567-1-abc1234567def8',views:18600},
    {id:'podcast20',title:'英语听力提升三步法',teacher:'英语教学专家',duration:'6:50',durationSec:410,category:'英语',gradient:'linear-gradient(135deg,#43E97B,#38F9D7)',icon:'🔊',shareUrl:'https://www.coze.cn/s/def789012345/',url:'https://coze-coding-project.tos.coze.site/coze_storage_7630375842421407780/audio/tts_2bcd3456-78ef-4a9f-b3e4-2bcd3456ghi7.mp3?sign=1808822600-def7890123-2-def7890123ghi4',views:22300}
];

// 播放状态
var podcastPlayerState = {
    currentPodcast: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
};

// ============================================================
// 简化版UI渲染
// ============================================================
function renderPodcast(container) {
    container.innerHTML = `
        <!-- 顶部固定播放器 -->
        <div class="podcast-player-fixed">
            <div class="podcast-player-info">
                <span class="podcast-player-icon">🎧</span>
                <div class="podcast-player-text">
                    <div class="podcast-player-title" id="podcast-player-title">选择播客开始收听</div>
                    <div class="podcast-player-subtitle" id="podcast-player-subtitle">-</div>
                </div>
            </div>
            <div class="podcast-player-controls">
                <button class="podcast-btn" id="podcast-prev-btn" onclick="podcastPrev()" title="上一首">⏮</button>
                <button class="podcast-btn podcast-btn-play" id="podcast-play-btn" onclick="podcastTogglePlay()" title="播放/暂停">▶</button>
                <button class="podcast-btn" id="podcast-next-btn" onclick="podcastNext()" title="下一首">⏭</button>
                <button class="podcast-btn podcast-btn-speed" id="podcast-speed-btn" onclick="podcastCycleSpeed()" title="播放速度">1x</button>
            </div>
        </div>
        
        <!-- 进度条 -->
        <div class="podcast-progress-container" id="podcast-progress-container" style="display:none;">
            <div class="podcast-progress-bar" id="podcast-progress-bar">
                <div class="podcast-progress-fill" id="podcast-progress-fill"></div>
            </div>
            <div class="podcast-time-display">
                <span id="podcast-current-time">0:00</span>
                <span id="podcast-total-time">0:00</span>
            </div>
        </div>
        
        <!-- 下拉选择列表 -->
        <div class="card" style="margin-top:0;">
            <div class="podcast-select-wrapper">
                <label class="podcast-select-label">选择播客：</label>
                <select class="podcast-select" id="podcast-select" onchange="onPodcastSelectChange(this.value)">
                    <option value="">-- 请选择播客 --</option>
                    <optgroup label="🎓 学霸方法">
                        ${podcastCourses.filter(p => p.category === '学霸方法').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                    <optgroup label="📐 数学">
                        ${podcastCourses.filter(p => p.category === '数学').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                    <optgroup label="📖 英语">
                        ${podcastCourses.filter(p => p.category === '英语').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                    <optgroup label="⚡ 物理">
                        ${podcastCourses.filter(p => p.category === '物理').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                    <optgroup label="🧪 化学">
                        ${podcastCourses.filter(p => p.category === '化学').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                    <optgroup label="📝 语文">
                        ${podcastCourses.filter(p => p.category === '语文').map(p => 
                            `<option value="${p.id}">${p.icon} ${p.title} (${p.duration})</option>`
                        ).join('')}
                    </optgroup>
                </select>
            </div>
        </div>
        
        <!-- 播客列表（可折叠） -->
        <div class="card" style="margin-top:12px;">
            <div class="podcast-list-header" onclick="togglePodcastList()">
                <span>📋 播客列表</span>
                <span id="podcast-list-toggle">▼</span>
            </div>
            <div id="podcast-list-container" class="podcast-list-container">
                <div class="podcast-list-grid" id="podcast-list">
                    ${renderPodcastListItems(podcastCourses)}
                </div>
            </div>
        </div>
    `;
    
    // 初始化音频元素
    initPodcastAudio();
}

// 渲染播客列表项
function renderPodcastListItems(podcasts) {
    return podcasts.map(p => `
        <div class="podcast-list-item ${podcastPlayerState.currentPodcast?.id === p.id ? 'active' : ''}" 
             onclick="playPodcastById('${p.id}')">
            <span class="podcast-list-icon" style="background:${p.gradient};">${p.icon}</span>
            <div class="podcast-list-info">
                <div class="podcast-list-title">${p.title}</div>
                <div class="podcast-list-meta">${p.teacher} · ${p.duration}</div>
            </div>
            ${podcastPlayerState.currentPodcast?.id === p.id && podcastPlayerState.isPlaying ? 
                '<span class="podcast-playing-indicator">🔊</span>' : 
                '<span class="podcast-play-icon">▶</span>'
            }
        </div>
    `).join('');
}

// 切换播客列表显示
function togglePodcastList() {
    const container = document.getElementById('podcast-list-container');
    const toggle = document.getElementById('podcast-list-toggle');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        container.style.display = 'none';
        toggle.textContent = '▼';
    }
}

// 下拉选择变化
function onPodcastSelectChange(podcastId) {
    if (podcastId) {
        playPodcastById(podcastId);
        // 更新下拉选择
        document.getElementById('podcast-select').value = podcastId;
    }
}

// 根据ID播放播客
function playPodcastById(podcastId) {
    const podcast = podcastCourses.find(p => p.id === podcastId);
    if (!podcast) return;
    
    playPodcast(podcast);
}

// 播放播客
function playPodcast(podcast) {
    podcastPlayerState.currentPodcast = podcast;
    podcastPlayerState.isPlaying = true;
    
    // 更新UI
    document.getElementById('podcast-player-title').textContent = podcast.title;
    document.getElementById('podcast-player-subtitle').textContent = podcast.teacher + ' · ' + podcast.category;
    document.getElementById('podcast-play-btn').textContent = '⏸';
    document.getElementById('podcast-progress-container').style.display = 'block';
    document.getElementById('podcast-total-time').textContent = podcast.duration;
    
    // 更新列表选中状态
    const list = document.getElementById('podcast-list');
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
    
    // 更新下拉选择
    const select = document.getElementById('podcast-select');
    if (select) select.value = podcast.id;
    
    // 播放音频
    const audio = document.getElementById('hidden-audio');
    if (audio) {
        audio.src = podcast.url;
        audio.playbackRate = podcastPlayerState.playbackRate;
        audio.play().catch(e => {
            console.warn('播放失败:', e);
            showToast('播放失败，请稍后重试');
        });
    }
    
    // 同时更新迷你播放器
    showMiniPlayer({
        title: podcast.title,
        teacher: podcast.teacher,
        icon: podcast.icon,
        gradient: podcast.gradient,
        type: 'podcast'
    });
}

// 切换播放/暂停
function podcastTogglePlay() {
    const audio = document.getElementById('hidden-audio');
    if (!audio || !podcastPlayerState.currentPodcast) {
        showToast('请先选择播客');
        return;
    }
    
    if (podcastPlayerState.isPlaying) {
        audio.pause();
        podcastPlayerState.isPlaying = false;
        document.getElementById('podcast-play-btn').textContent = '▶';
    } else {
        audio.play();
        podcastPlayerState.isPlaying = true;
        document.getElementById('podcast-play-btn').textContent = '⏸';
    }
    
    // 更新列表图标
    const list = document.getElementById('podcast-list');
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
}

// 上一首
function podcastPrev() {
    if (!podcastPlayerState.currentPodcast) {
        showToast('请先选择播客');
        return;
    }
    const currentIndex = podcastCourses.findIndex(p => p.id === podcastPlayerState.currentPodcast.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : podcastCourses.length - 1;
    playPodcast(podcastCourses[prevIndex]);
}

// 下一首
function podcastNext() {
    if (!podcastPlayerState.currentPodcast) {
        showToast('请先选择播客');
        return;
    }
    const currentIndex = podcastCourses.findIndex(p => p.id === podcastPlayerState.currentPodcast.id);
    const nextIndex = currentIndex < podcastCourses.length - 1 ? currentIndex + 1 : 0;
    playPodcast(podcastCourses[nextIndex]);
}

// 切换播放速度
function podcastCycleSpeed() {
    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(podcastPlayerState.playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    podcastPlayerState.playbackRate = speeds[nextIndex];
    
    const audio = document.getElementById('hidden-audio');
    if (audio) audio.playbackRate = podcastPlayerState.playbackRate;
    
    document.getElementById('podcast-speed-btn').textContent = speeds[nextIndex] + 'x';
    showToast('播放速度: ' + speeds[nextIndex] + 'x');
}

// 初始化音频元素
function initPodcastAudio() {
    // 确保页面中有隐藏的音频元素
    let audio = document.getElementById('hidden-audio');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'hidden-audio';
        audio.style.display = 'none';
        document.body.appendChild(audio);
    }
    
    // 绑定事件
    audio.onplay = function() {
        podcastPlayerState.isPlaying = true;
        const playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        const list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
    };
    
    audio.onpause = function() {
        podcastPlayerState.isPlaying = false;
        const playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '▶';
        const list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
    };
    
    audio.ontimeupdate = function() {
        podcastPlayerState.currentTime = audio.currentTime;
        podcastPlayerState.duration = audio.duration || podcastPlayerState.currentPodcast?.durationSec || 0;
        
        // 更新进度条
        const progressFill = document.getElementById('podcast-progress-fill');
        const currentTimeEl = document.getElementById('podcast-current-time');
        if (progressFill && podcastPlayerState.duration > 0) {
            const percent = (podcastPlayerState.currentTime / podcastPlayerState.duration) * 100;
            progressFill.style.width = percent + '%';
        }
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(podcastPlayerState.currentTime);
        }
    };
    
    audio.onended = function() {
        // 播放结束，自动播放下一首
        podcastNext();
    };
    
    // 点击进度条跳转
    const progressBar = document.getElementById('podcast-progress-bar');
    if (progressBar) {
        progressBar.onclick = function(e) {
            if (!podcastPlayerState.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * podcastPlayerState.duration;
        };
    }
}

// 格式化时间
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ============================================================
// Window Exports
// ============================================================
window.renderPodcast = renderPodcast;
window.playPodcastById = playPodcastById;
window.podcastTogglePlay = podcastTogglePlay;
window.podcastPrev = podcastPrev;
window.podcastNext = podcastNext;
window.podcastCycleSpeed = podcastCycleSpeed;
window.onPodcastSelectChange = onPodcastSelectChange;
window.togglePodcastList = togglePodcastList;
window.podcastCourses = podcastCourses;

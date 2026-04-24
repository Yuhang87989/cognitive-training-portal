import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 8. 更新播客课堂，添加更多音频课程
old_podcast = '''podcast: {
        title: '🎧 播客课堂',
        content: `
            <div class="card">
                <div class="grade-tab">
                    <button class="grade-tab-btn active" onclick="filterPodcast('study',this)">学习方法</button>
                    <button class="grade-tab-btn" onclick="filterPodcast('science',this)">科普知识</button>
                    <button class="grade-tab-btn" onclick="filterPodcast('story',this)">名人故事</button>
                </div>
            </div>
            <div id="podcast-list" style="padding:0 12px;">
                <div class="podcast-item" onclick="playPodcast('英语听力训练技巧')">
                    <div class="podcast-thumb">🎧</div>
                    <div class="podcast-info">
                        <div class="podcast-title">英语听力训练技巧</div>
                        <div class="podcast-meta">王老师 · 12:30</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('费曼学习法详解')">
                    <div class="podcast-thumb">🧠</div>
                    <div class="podcast-info">
                        <div class="podcast-title">费曼学习法详解</div>
                        <div class="podcast-meta">李老师 · 8:45</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('时间管理秘诀')">
                    <div class="podcast-thumb">⏰</div>
                    <div class="podcast-info">
                        <div class="podcast-title">时间管理秘诀</div>
                        <div class="podcast-meta">张老师 · 10:20</div>
                    </div>
                </div>
            </div>
        `
    },'''

new_podcast = '''podcast: {
        title: '🎧 播客课堂',
        content: `
            <div class="card">
                <div class="grade-tab">
                    <button class="grade-tab-btn active" onclick="filterPodcast('study',this)">学习方法</button>
                    <button class="grade-tab-btn" onclick="filterPodcast('science',this)">科普知识</button>
                    <button class="grade-tab-btn" onclick="filterPodcast('story',this)">名人故事</button>
                    <button class="grade-tab-btn" onclick="filterPodcast('all',this)">全部课程</button>
                </div>
            </div>
            <div id="podcast-list" style="padding:0 12px;">
                <div class="podcast-item" onclick="playPodcast('英语听力训练技巧', 'audio1')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);">🎧</div>
                    <div class="podcast-info">
                        <div class="podcast-title">英语听力训练技巧</div>
                        <div class="podcast-meta">王老师 · 12:30 · 英语</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('费曼学习法详解', 'audio2')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);">🧠</div>
                    <div class="podcast-info">
                        <div class="podcast-title">费曼学习法详解</div>
                        <div class="podcast-meta">李老师 · 8:45 · 学习方法</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('时间管理秘诀', 'audio3')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);">⏰</div>
                    <div class="podcast-info">
                        <div class="podcast-title">时间管理秘诀</div>
                        <div class="podcast-meta">张老师 · 10:20 · 学习方法</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('数学思维培养', 'audio4')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);">📐</div>
                    <div class="podcast-info">
                        <div class="podcast-title">数学思维培养</div>
                        <div class="podcast-meta">赵老师 · 15:00 · 数学</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('古诗词鉴赏技巧', 'audio5')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);">📝</div>
                    <div class="podcast-info">
                        <div class="podcast-title">古诗词鉴赏技巧</div>
                        <div class="podcast-meta">陈老师 · 11:30 · 语文</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('物理概念入门', 'audio6')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);">⚡</div>
                    <div class="podcast-info">
                        <div class="podcast-title">物理概念入门</div>
                        <div class="podcast-meta">林老师 · 14:00 · 物理</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('化学元素周期表', 'audio7')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);">🧪</div>
                    <div class="podcast-info">
                        <div class="podcast-title">化学元素周期表</div>
                        <div class="podcast-meta">周老师 · 13:45 · 化学</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('番茄工作法实践', 'audio8')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#FF6B6B,#FF4757);">🍅</div>
                    <div class="podcast-info">
                        <div class="podcast-title">番茄工作法实践</div>
                        <div class="podcast-meta">刘老师 · 9:15 · 学习方法</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('艾宾浩斯记忆法', 'audio9')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);">🔄</div>
                    <div class="podcast-info">
                        <div class="podcast-title">艾宾浩斯记忆法</div>
                        <div class="podcast-meta">孙老师 · 10:30 · 学习方法</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('阅读理解技巧', 'audio10')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);">📖</div>
                    <div class="podcast-info">
                        <div class="podcast-title">阅读理解技巧</div>
                        <div class="podcast-meta">吴老师 · 12:00 · 英语</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('写作能力提升', 'audio11')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);">✍️</div>
                    <div class="podcast-info">
                        <div class="podcast-title">写作能力提升</div>
                        <div class="podcast-meta">郑老师 · 11:00 · 语文</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('光学原理讲解', 'audio12')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);">💡</div>
                    <div class="podcast-info">
                        <div class="podcast-title">光学原理讲解</div>
                        <div class="podcast-meta">林老师 · 16:00 · 物理</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('力学基础入门', 'audio13')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);">🔧</div>
                    <div class="podcast-info">
                        <div class="podcast-title">力学基础入门</div>
                        <div class="podcast-meta">陈老师 · 14:30 · 物理</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('化学反应原理', 'audio14')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);">⚗️</div>
                    <div class="podcast-info">
                        <div class="podcast-title">化学反应原理</div>
                        <div class="podcast-meta">周老师 · 15:30 · 化学</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('思维导图绘制', 'audio15')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);">🎨</div>
                    <div class="podcast-info">
                        <div class="podcast-title">思维导图绘制</div>
                        <div class="podcast-meta">钱老师 · 8:00 · 学习方法</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('完形填空技巧', 'audio16')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);">📝</div>
                    <div class="podcast-info">
                        <div class="podcast-title">完形填空技巧</div>
                        <div class="podcast-meta">冯老师 · 9:45 · 英语</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('文言文学习方法', 'audio17')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);">📜</div>
                    <div class="podcast-info">
                        <div class="podcast-title">文言文学习方法</div>
                        <div class="podcast-meta">卫老师 · 13:00 · 语文</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('声学基础知识', 'audio18')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);">🔊</div>
                    <div class="podcast-info">
                        <div class="podcast-title">声学基础知识</div>
                        <div class="podcast-meta">蒋老师 · 10:15 · 物理</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('酸碱盐专题', 'audio19')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);">🧪</div>
                    <div class="podcast-info">
                        <div class="podcast-title">酸碱盐专题</div>
                        <div class="podcast-meta">沈老师 · 14:15 · 化学</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('数学解题思路', 'audio20')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);">📐</div>
                    <div class="podcast-info">
                        <div class="podcast-title">数学解题思路</div>
                        <div class="podcast-meta">韩老师 · 16:30 · 数学</div>
                    </div>
                </div>
                <div class="podcast-item" onclick="playPodcast('学霸时间表分享', 'audio21')">
                    <div class="podcast-thumb" style="background:linear-gradient(135deg,#FF6B6B,#FF4757);">⏱️</div>
                    <div class="podcast-info">
                        <div class="podcast-title">学霸时间表分享</div>
                        <div class="podcast-meta">杨老师 · 7:30 · 学习方法</div>
                    </div>
                </div>
            </div>
            <div style="padding:12px;text-align:center;color:var(--text-light);font-size:12px;">
                共21个音频课程
            </div>
        `
    },'''

content = content.replace(old_podcast, new_podcast)

print("Step 8 completed: Updated podcast content")
print(f"File length: {len(content)} characters")

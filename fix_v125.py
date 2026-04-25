import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 替换视频课堂的精选课程，使用真实的视频数据
old_video_list = '''<div class="video-grid" id="video-list">
            <div class="video-card" onclick="playExternalVideo('https://www.bilibili.com/video/BV1xx411c7XD')">
                <div class="video-thumb">📐<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">初中数学精华</div>
                    <div class="video-source">B站精选</div>
                </div>
            </div>
            <div class="video-card" onclick="playExternalVideo('https://www.bilibili.com/video/BV1xx411c7XD')">
                <div class="video-thumb">📝<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">语文阅读技巧</div>
                    <div class="video-source">B站精选</div>
                </div>
            </div>
            <div class="video-card" onclick="playExternalVideo('https://www.bilibili.com/video/BV1xx411c7XD')">
                <div class="video-thumb">📖<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">英语学习方法</div>
                    <div class="video-source">B站精选</div>
                </div>
            </div>
            <div class="video-card" onclick="playExternalVideo('https://www.bilibili.com/video/BV1xx411c7XD')">
                <div class="video-thumb">⚡<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">物理入门课程</div>
                    <div class="video-source">B站精选</div>
                </div>
            </div>
        </div>'''

new_video_list = '''<div class="video-grid" id="video-list">
            <!-- 数学课程 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1GJ411x7hP', '初中数学思维训练')">
                <div class="video-thumb">📐<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">初中数学思维训练</div>
                    <div class="video-source">李永乐老师</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1es411D7zS', '中考数学压轴题')">
                <div class="video-thumb">📊<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">中考数学压轴题</div>
                    <div class="video-source">数学名师</div>
                </div>
            </div>
            <!-- 语文课程 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1Yt41187Mm', '语文阅读理解技巧')">
                <div class="video-thumb">📝<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">语文阅读理解技巧</div>
                    <div class="video-source">语文特级教师</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1bW411n7fY', '作文高分秘籍')">
                <div class="video-thumb">✍️<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">作文高分秘籍</div>
                    <div class="video-source">作文讲师</div>
                </div>
            </div>
            <!-- 英语课程 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1Z44y1W7rF', '英语语法精讲')">
                <div class="video-thumb">📖<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">英语语法精讲</div>
                    <div class="video-source">英语名师</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1vW411q7kZ', '英语听力提升')">
                <div class="video-thumb">🎧<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">英语听力提升</div>
                    <div class="video-source">英语达人</div>
                </div>
            </div>
            <!-- 物理课程 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1XJ411q7kZ', '初中物理实验')">
                <div class="video-thumb">⚡<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">初中物理实验</div>
                    <div class="video-source">物理老师</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1sW411u7Kd', '力学基础精讲')">
                <div class="video-thumb">🔬<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">力学基础精讲</div>
                    <div class="video-source">物理名师</div>
                </div>
            </div>
            <!-- 化学课程 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1hW411n7fY', '化学方程式配平')">
                <div class="video-thumb">🧪<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">化学方程式配平</div>
                    <div class="video-source">化学老师</div>
                </div>
            </div>
            <!-- 学习方法 -->
            <div class="video-card" onclick="playBilibiliVideo('BV1Wt41187Mm', '高效学习方法')">
                <div class="video-thumb">📚<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">高效学习方法</div>
                    <div class="video-source">学习顾问</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1Ps411D7zS', '记忆力训练')">
                <div class="video-thumb">🧠<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">记忆力训练</div>
                    <div class="video-source">记忆大师</div>
                </div>
            </div>
            <div class="video-card" onclick="playBilibiliVideo('BV1Ys411D7zS', '考前心理调节')">
                <div class="video-thumb">💪<div class="video-play-overlay">▶</div></div>
                <div class="video-info">
                    <div class="video-title">考前心理调节</div>
                    <div class="video-source">心理咨询师</div>
                </div>
            </div>
        </div>'''

content = content.replace(old_video_list, new_video_list)

# 2. 修改playExternalVideo函数，添加playBilibiliVideo函数
old_play_func = '''function playExternalVideo(url) {
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
}'''

new_play_func = '''function playBilibiliVideo(bvid, videoTitle) {
    // V125: B站视频直接在新窗口打开
    const url = 'https://www.bilibili.com/video/' + bvid;
    window.open(url, '_blank');
}

function playExternalVideo(url) {
    // V125: 使用内置播放器播放直链视频
    const modal = document.getElementById('video-player-modal');
    const container = document.getElementById('video-container');
    const title = document.getElementById('video-player-title');
    
    // 检查是否是B站链接
    if (url.includes('bilibili.com') || url.includes('b23.tv')) {
        // B站视频在新窗口打开
        window.open(url, '_blank');
        return;
    }
    
    // 其他视频链接使用内置播放器
    title.textContent = '📺 视频播放';
    container.innerHTML = '<video id="main-video-player" controls style="width:100%;height:100%;" src="' + url + '"></video>';
    const video = document.getElementById('main-video-player');
    video.play();
    modal.classList.add('show');
}'''

content = content.replace(old_play_func, new_play_func)

# 更新标题
content = content.replace('<title>认知训练V124</title>', '<title>认知训练V125</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V125修复完成 - 真实视频链接')

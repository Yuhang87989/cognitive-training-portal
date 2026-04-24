import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 9. 添加视频课程数据（在pageContent.video之前）
# 首先找到video部分并更新
old_video_section = '''video: {
        title: '📺 视频课堂',
        content: `
            <div class="card" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);color:white;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size:32px;">🎬</div>
                    <div>
                        <div style="font-size:15px;font-weight:bold;">视频学习中心</div>
                        <div style="font-size:12px;opacity:0.9;margin-top:4px;">支持本地视频上传与管理</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="upload-zone" onclick="document.getElementById('video-upload').click()">
                    <div class="upload-icon">📤</div>
                    <div class="upload-text">点击上传本地视频</div>
                    <div class="upload-hint">支持 mp4、webm、mov 格式</div>
                </div>
                <input type="file" id="video-upload" accept="video/*" style="display:none" onchange="handleVideoUpload(this)"/>
            </div>
            <div class="card">
                <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📋 已上传视频</div>
                <div id="video-list">
                    <div style="padding:12px;text-align:center;color:var(--text-light);">暂无上传视频</div>
                </div>
            </div>
        `
    },'''

new_video_section = '''video: {
        title: '📺 视频课堂',
        content: `
            <div class="card" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);color:white;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size:32px;">🎬</div>
                    <div>
                        <div style="font-size:15px;font-weight:bold;">视频学习中心</div>
                        <div style="font-size:12px;opacity:0.9;margin-top:4px;">精选21个视频课程 + 本地上传</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="grade-tab">
                    <button class="grade-tab-btn active" onclick="filterVideo('all',this)">全部</button>
                    <button class="grade-tab-btn" onclick="filterVideo('math',this)">数学</button>
                    <button class="grade-tab-btn" onclick="filterVideo('physics',this)">物理</button>
                    <button class="grade-tab-btn" onclick="filterVideo('chemistry',this)">化学</button>
                </div>
            </div>
            <div id="video-list" style="padding:0 12px;">
                <div class="video-item" onclick="playVideoCourse('勾股定理证明', 'video1')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">勾股定理证明</div>
                        <div class="video-meta">数学 · 15分钟 · 赵老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('一元二次方程', 'video2')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">一元二次方程解法</div>
                        <div class="video-meta">数学 · 20分钟 · 赵老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('力的合成与分解', 'video3')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">力的合成与分解</div>
                        <div class="video-meta">物理 · 18分钟 · 陈老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('欧姆定律', 'video4')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">欧姆定律精讲</div>
                        <div class="video-meta">物理 · 22分钟 · 陈老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('化学方程式配平', 'video5')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">化学方程式配平技巧</div>
                        <div class="video-meta">化学 · 16分钟 · 周老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('质量守恒定律', 'video6')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">质量守恒定律</div>
                        <div class="video-meta">化学 · 14分钟 · 周老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('三角形全等证明', 'video7')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">三角形全等证明</div>
                        <div class="video-meta">数学 · 19分钟 · 赵老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('浮力计算方法', 'video8')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#FF6B6B,#FF4757);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">浮力计算方法</div>
                        <div class="video-meta">物理 · 17分钟 · 陈老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('溶液配制计算', 'video9')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">溶液配制计算</div>
                        <div class="video-meta">化学 · 15分钟 · 林老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('函数图像变换', 'video10')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">函数图像变换</div>
                        <div class="video-meta">数学 · 21分钟 · 韩老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('机械效率', 'video11')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">机械效率计算</div>
                        <div class="video-meta">物理 · 16分钟 · 林老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('酸碱盐反应', 'video12')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">酸碱盐反应规律</div>
                        <div class="video-meta">化学 · 18分钟 · 沈老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('圆与直线的位置关系', 'video13')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">圆与直线的位置关系</div>
                        <div class="video-meta">数学 · 20分钟 · 韩老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('电功率计算', 'video14')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#FF9A63,#E87A4E);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">电功率计算专题</div>
                        <div class="video-meta">物理 · 23分钟 · 蒋老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('金属活动性顺序', 'video15')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">金属活动性顺序应用</div>
                        <div class="video-meta">化学 · 14分钟 · 沈老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('相似三角形', 'video16')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#43E97B,#38F9D7);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">相似三角形判定</div>
                        <div class="video-meta">数学 · 19分钟 · 钱老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('能量转化与守恒', 'video17')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#fa709a,#fee140);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">能量转化与守恒</div>
                        <div class="video-meta">物理 · 17分钟 · 蒋老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('物质的分类', 'video18')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#f6d365,#fda085);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">物质的分类</div>
                        <div class="video-meta">化学 · 12分钟 · 周老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('概率统计初步', 'video19')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#667eea,#764ba2);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">概率统计初步</div>
                        <div class="video-meta">数学 · 18分钟 · 冯老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('压强计算', 'video20')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#FF6B6B,#FF4757);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">压强计算专题</div>
                        <div class="video-meta">物理 · 15分钟 · 林老师</div>
                    </div>
                </div>
                <div class="video-item" onclick="playVideoCourse('化学实验操作', 'video21')">
                    <div class="video-thumb" style="background:linear-gradient(135deg,#4facfe,#00f2fe);"><div class="play-icon">▶</div></div>
                    <div class="video-info">
                        <div class="video-title">化学实验操作规范</div>
                        <div class="video-meta">化学 · 20分钟 · 林老师</div>
                    </div>
                </div>
            </div>
            <div class="card" style="margin:12px;">
                <div class="upload-zone" onclick="document.getElementById('video-upload').click()">
                    <div class="upload-icon">📤</div>
                    <div class="upload-text">上传本地视频</div>
                    <div class="upload-hint">支持 mp4、webm、mov 格式</div>
                </div>
                <input type="file" id="video-upload" accept="video/*" style="display:none" onchange="handleVideoUpload(this)"/>
            </div>
            <div style="padding:12px;text-align:center;color:var(--text-light);font-size:12px;">
                精选21个视频课程
            </div>
        `
    },'''

content = content.replace(old_video_section, new_video_section)

print("Step 9 completed: Updated video content with 21 courses")
print(f"File length: {len(content)} characters")

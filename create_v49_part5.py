import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 10. 更新学霸方法模块，添加训练题目
old_method = '''method: {
        title: '💡 学霸方法',
        content: `
            <div class="card">
                <div style="font-size:16px;font-weight:bold;margin-bottom:12px;">🚀 高效学习方法</div>
                <div class="method-card" onclick="showMethodDetail('feynman')">
                    <div class="method-title">🧠 费曼学习法</div>
                    <div class="method-content">把学到的知识用自己的话讲给别人听，如果别人能听懂，说明你真正掌握了。</div>
                </div>
                <div class="method-card" onclick="showMethodDetail('pomodoro')">
                    <div class="method-title">⏰ 番茄工作法</div>
                    <div class="method-content">25分钟专注学习，5分钟休息，循环进行，提高效率。</div>
                </div>
                <div class="method-card" onclick="showMethodDetail('ebbinghaus')">
                    <div class="method-title">🔄 艾宾浩斯记忆法</div>
                    <div class="method-content">学习后1天、3天、7天、14天、30天分别复习，加深长期记忆。</div>
                </div>
                <div class="method-card" onclick="showMethodDetail('mindmap')">
                    <div class="method-title">🎨 思维导图法</div>
                    <div class="method-content">用图形和关键词将知识点连接起来，形成系统化的知识结构。</div>
                </div>
                <div class="method-card" onclick="showMethodDetail('cornell')">
                    <div class="method-title">📝 康奈尔笔记法</div>
                    <div class="method-content">将笔记分为要点、线索、总结三个区域，提高复习效率。</div>
                </div>
                <div class="method-card" onclick="showMethodDetail('sq3r')">
                    <div class="method-title">📖 SQ3R阅读法</div>
                    <div class="method-content">Survey泛读、Question提问、Read阅读、Recite复述、Review复习。</div>
                </div>
            </div>
        `
    },'''

new_method = '''method: {
        title: '💡 学霸方法',
        content: `
            <div class="card">
                <div style="font-size:16px;font-weight:bold;margin-bottom:12px;">🚀 高效学习方法</div>
                <div class="method-card" onclick="showMethodDetail('feynman')">
                    <div class="method-title">🧠 费曼学习法</div>
                    <div class="method-content">把学到的知识用自己的话讲给别人听，如果别人能听懂，说明你真正掌握了。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-blue" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('feynman')">🗣️ 开始练习</button></div>
                </div>
                <div class="method-card" onclick="showMethodDetail('pomodoro')">
                    <div class="method-title">⏰ 番茄工作法</div>
                    <div class="method-content">25分钟专注学习，5分钟休息，循环进行，提高效率。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-orange" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('pomodoro')">🍅 开始计时</button></div>
                </div>
                <div class="method-card" onclick="showMethodDetail('ebbinghaus')">
                    <div class="method-title">🔄 艾宾浩斯记忆法</div>
                    <div class="method-content">学习后1天、3天、7天、14天、30天分别复习，加深长期记忆。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-green" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('ebbinghaus')">🧮 记忆测试</button></div>
                </div>
                <div class="method-card" onclick="showMethodDetail('mindmap')">
                    <div class="method-title">🎨 思维导图法</div>
                    <div class="method-content">用图形和关键词将知识点连接起来，形成系统化的知识结构。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-blue" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('mindmap')">🎨 绘制练习</button></div>
                </div>
                <div class="method-card" onclick="showMethodDetail('cornell')">
                    <div class="method-title">📝 康奈尔笔记法</div>
                    <div class="method-content">将笔记分为要点、线索、总结三个区域，提高复习效率。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-orange" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('cornell')">📋 笔记练习</button></div>
                </div>
                <div class="method-card" onclick="showMethodDetail('sq3r')">
                    <div class="method-title">📖 SQ3R阅读法</div>
                    <div class="method-content">Survey泛读、Question提问、Read阅读、Recite复述、Review复习。</div>
                    <div style="margin-top:8px;"><button class="game-btn btn-green" style="padding:6px 12px;font-size:12px;" onclick="event.stopPropagation();startMethodPractice('sq3r')">📖 阅读训练</button></div>
                </div>
            </div>
        `
    },'''

content = content.replace(old_method, new_method)

print("Step 10 completed: Updated method content with practice buttons")
print(f"File length: {len(content)} characters")

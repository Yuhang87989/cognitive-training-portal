import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 5. 修复难度选择中文提示
old_difficulty = '''<select id="difficulty-select" class="input-field" onchange="saveDifficulty(this.value)">
                    <option value="1">难度1</option>
                    <option value="2">难度2</option>
                    <option value="3">难度3</option>
                    <option value="4">难度4</option>
                    <option value="5">难度5</option>
                </select>'''

new_difficulty = '''<select id="difficulty-select" class="input-field" onchange="saveDifficulty(this.value)">
                    <option value="1">1级 - 简单入门</option>
                    <option value="2">2级 - 基础巩固</option>
                    <option value="3">3级 - 稳步提升</option>
                    <option value="4">4级 - 挑战提高</option>
                    <option value="5">5级 - 精英冲刺</option>
                </select>'''

content = content.replace(old_difficulty, new_difficulty)

# 6. 更新难度下拉选择（登录页）
old_login_diff = '''<select id="login-difficulty" class="input-field">
                    <option value="1">难度1</option>
                    <option value="2">难度2</option>
                    <option value="3">难度3</option>
                    <option value="4">难度4</option>
                    <option value="5">难度5</option>
                </select>'''

new_login_diff = '''<select id="login-difficulty" class="input-field">
                    <option value="1">1级 - 简单入门</option>
                    <option value="2">2级 - 基础巩固</option>
                    <option value="3">3级 - 稳步提升</option>
                    <option value="4">4级 - 挑战提高</option>
                    <option value="5">5级 - 精英冲刺</option>
                </select>'''

content = content.replace(old_login_diff, new_login_diff)

# 7. 添加物理化学科目标签到母题页面
old_subject_tabs = '''<div class="subject-tab" id="subject-tabs">
                    <button class="subject-tab-btn active" onclick="filterSubjects('math',this)">📐数学</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('chinese',this)">📝语文</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('english',this)">📖英语</button>
                </div>'''

new_subject_tabs = '''<div class="subject-tab" id="subject-tabs">
                    <button class="subject-tab-btn active" onclick="filterSubjects('math',this)">📐数学</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('chinese',this)">📝语文</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('english',this)">📖英语</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('physics',this)">⚡物理</button>
                    <button class="subject-tab-btn" onclick="filterSubjects('chemistry',this)">🧪化学</button>
                </div>'''

content = content.replace(old_subject_tabs, new_subject_tabs)

print("Step 5-7 completed: Difficulty labels and subject tabs updated")
print(f"File length: {len(content)} characters")

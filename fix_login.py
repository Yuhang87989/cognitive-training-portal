import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 在page-home开头添加登录遮罩
home_login_overlay = '''
<!-- V117: 首页登录卡片 -->
<div id="home-login-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,#E8F4FF,#D4ECFF);z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;">
    <div style="background:white;border-radius:20px;padding:24px;width:100%;max-width:340px;box-shadow:0 4px 20px rgba(51,119,255,0.2);">
        <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:48px;margin-bottom:8px;">🧠</div>
            <div style="font-size:20px;font-weight:bold;">认知训练</div>
            <div style="font-size:12px;color:#666;margin-top:4px;">青少年注意力和记忆力训练</div>
        </div>
        <input type="text" id="home-name" placeholder="请输入你的名字" maxlength="10" style="width:100%;padding:12px;border:2px solid #f0f0f0;border-radius:10px;margin-bottom:12px;font-size:14px;box-sizing:border-box;">
        <select id="home-grade" style="width:100%;padding:12px;border:2px solid #f0f0f0;border-radius:10px;margin-bottom:12px;font-size:14px;box-sizing:border-box;">
            <option value="5">五年级</option>
            <option value="6">六年级</option>
            <option value="7" selected>初一</option>
            <option value="8">初二</option>
            <option value="9">初三</option>
        </select>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
            <span style="font-size:13px;color:#666;">难度</span>
            <input type="range" id="home-difficulty" min="1" max="5" value="1" style="flex:1;">
            <span id="home-diff-display" style="font-size:13px;color:#3377FF;font-weight:bold;">Lv.1</span>
        </div>
        <button onclick="handleHomeLogin()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3377FF,#FF9A63);border:none;border-radius:12px;color:white;font-size:15px;font-weight:600;cursor:pointer;">🚀 开始训练</button>
        <div id="home-user-list" style="margin-top:12px;font-size:12px;color:#999;"></div>
    </div>
</div>
'''

# 找到page-home并插入登录卡片
content = re.sub(
    r'(<div id="page-home" class="page active"[^>]*>)',
    r'\1\n' + home_login_overlay,
    content
)

# 2. 删除整个page-login
content = re.sub(
    r'<!-- 登录页 -->\s*<div id="page-login"[^>]*>[\s\S]*?</div>\s*</div>\s*(?=<!-- 主页 -->|<!-- )',
    '',
    content
)

# 3. 简化delayedInit函数
new_delayed_init = '''function delayedInit() {
    console.log('[V117] 初始化开始');
    
    const homePage = document.getElementById('page-home');
    const loginOverlay = document.getElementById('home-login-overlay');
    
    if (homePage) {
        homePage.style.display = 'block';
        homePage.classList.add('active');
    }
    
    try {
        let data = loadData();
        
        // 难度滑块事件
        const diffSlider = document.getElementById('home-difficulty');
        if (diffSlider) {
            diffSlider.addEventListener('input', function() {
                document.getElementById('home-diff-display').textContent = 'Lv.' + this.value;
            });
        }
        
        // 显示已有用户
        const userListDiv = document.getElementById('home-user-list');
        if (userListDiv && data.users && data.users.length > 0) {
            userListDiv.innerHTML = '已有学习者: ' + data.users.map(u => u.name).join('、');
        }
        
        // 检查登录状态
        if (!data.currentUser || data.users.length === 0) {
            if (loginOverlay) loginOverlay.style.display = 'flex';
        } else {
            if (loginOverlay) loginOverlay.style.display = 'none';
            updateUI();
        }
        
        console.log('[V117] 初始化完成, 用户:', data.currentUser);
    } catch(e) {
        console.error('[V117] 初始化错误:', e);
        if (loginOverlay) loginOverlay.style.display = 'flex';
    }
}'''

content = re.sub(
    r'function delayedInit\(\)[\s\S]*?^(?=// ====== 页面初始化)',
    new_delayed_init + '\n\n',
    content,
    flags=re.MULTILINE
)

# 4. 添加handleHomeLogin函数
home_login_func = '''
// V117: 首页登录处理
function handleHomeLogin() {
    const name = document.getElementById('home-name').value.trim();
    const grade = parseInt(document.getElementById('home-grade').value);
    const difficulty = parseInt(document.getElementById('home-difficulty').value);
    
    if (!name) { alert('请输入名字'); return; }
    
    const data = loadData();
    const userId = 'user_' + Date.now();
    data.users.push({
        id: userId, name, grade, difficulty,
        score: 0, streak: 0, 
        todayQuestions: 0, todayCorrect: 0, todayMinutes: 0,
        wrongTopics: [], completedTopics: [],
        createdAt: Date.now()
    });
    data.currentUser = userId;
    saveData(data);
    
    document.getElementById('home-login-overlay').style.display = 'none';
    updateUI();
    alert('欢迎 ' + name + '！');
}

'''

# 在delayedInit后面添加
content = re.sub(
    r'(// ====== 页面初始化)',
    home_login_func + r'\1',
    content
)

# 5. 修改标题
content = content.replace('<title>认知训练V106</title>', '<title>认知训练V117</title>')
content = content.replace('认知训练V105', '认知训练V117')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V117修改完成')

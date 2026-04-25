import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 在page-home开头添加登录遮罩（如果不存在）
if 'home-login-overlay' not in content:
    home_login_overlay = '''
<!-- V118: 首页登录卡片 -->
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
    content = re.sub(
        r'(<div id="page-home" class="page active"[^>]*>)',
        r'\1\n' + home_login_overlay,
        content
    )

# 2. 删除独立的page-login页面
content = re.sub(
    r'<!-- 登录页 -->\s*<div id="page-login"[^>]*>[\s\S]*?</div>\s*</div>\s*(?=<!-- 主页 -->|<!-- 飞书)',
    '',
    content
)

# 3. 修改showPage函数
old_showPage_pattern = r'function showPage\(pageId\)\s*\{[\s\S]*?document\.getElementById\(\'difficulty-modal\'\)\.classList\.remove\(\'show\'\);'
new_showPage = '''function showPage(pageId) {
    console.log('[V118] showPage:', pageId);
    
    // 隐藏登录遮罩
    const loginOverlay = document.getElementById('home-login-overlay');
    if (loginOverlay) loginOverlay.style.display = 'none';
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // 显示目标页面
    const page = document.getElementById('page-' + pageId);
    if (page) {
        page.classList.add('active');
        page.style.display = 'block';
    }
    
    // 更新底部导航
    document.querySelectorAll('.bottom-nav .nav-item').forEach((n, i) => {
        const navMap = {home:0, avatar:1, deepseek:1, ai:1, practice:2, games:2, map:3, plan:4, topics:4, method:4, thinking:4, podcast:4, video:4, wrong:4, 'ai-chat':1};
        n.classList.toggle('active', navMap[pageId] === i);
    });
    
    const diffModal = document.getElementById('difficulty-modal');
    if (diffModal) diffModal.classList.remove('show');'''

content = re.sub(old_showPage_pattern, new_showPage, content)

# 4. 修改delayedInit函数
old_delayedInit_pattern = r'function delayedInit\(\)\s*\{[\s\S]*?console\.log\(\'\[V\d+\] 初始化完成'
new_delayedInit = '''function delayedInit() {
    console.log('[V118] 初始化开始');
    
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
                const display = document.getElementById('home-diff-display');
                if (display) display.textContent = 'Lv.' + this.value;
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
        
        console.log('[V118] 初始化完成'''

content = re.sub(old_delayedInit_pattern, new_delayedInit, content)

# 5. 添加handleHomeLogin函数（在delayedInit之后）
if 'function handleHomeLogin' not in content:
    home_login_func = '''
// V118: 首页登录处理
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
}

'''
    content = re.sub(
        r'(// ====== 页面初始化 ======)',
        home_login_func + r'\1',
        content
    )

# 6. 更新标题
content = content.replace('<title>认知训练V106</title>', '<title>认知训练V118</title>')
content = content.replace('认知训练V105', '认知训练V118')

# 7. 删除initLoginPageProtection的调用
content = re.sub(r'initLoginPageProtection\(\);?\s*\n', '', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V118修复完成')

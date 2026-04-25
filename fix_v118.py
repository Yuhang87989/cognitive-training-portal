import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修复showPage函数，移除对page-login的引用
old_showPage = '''function showPage(pageId) {
    // 隐藏登录页面
    const loginPage = document.getElementById('page-login');
    if (loginPage) {
        loginPage.style.setProperty('display', 'none', 'important');
        loginPage.style.setProperty('visibility', 'hidden', 'important');
    }
    
    // 隐藏所有普通页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // 显示目标页面
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
    
    document.querySelectorAll('.bottom-nav .nav-item').forEach((n, i) => {
        const navMap = {home:0, avatar:1, deepseek:1, ai:1, practice:2, games:2, map:3, plan:4, topics:4, method:4, thinking:4, podcast:4, video:4, wrong:4, 'ai-chat':1};
        n.classList.toggle('active', navMap[pageId] === i);
    });
    
    document.getElementById('difficulty-modal').classList.remove('show');'''

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
    
    // 关闭难度弹窗
    const diffModal = document.getElementById('difficulty-modal');
    if (diffModal) diffModal.classList.remove('show');'''

content = content.replace(old_showPage, new_showPage)

# 2. 更新标题
content = content.replace('<title>认知训练V117</title>', '<title>认知训练V118</title>')
content = content.replace('认知训练V117', '认知训练V118')

# 3. 添加openGameModal和closeGameModal函数（如果不存在）
if 'function openGameModal' not in content:
    game_funcs = '''
// V118: 游戏弹窗函数
function openGameModal(gameType) {
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.add('show');
    if (typeof startGame === 'function') startGame(gameType);
}

function closeGameModal() {
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.remove('show');
}

'''
    content = re.sub(r'(function showPage\(pageId\))', game_funcs + r'\1', content)

# 4. 删除initLoginPageProtection函数的调用（如果有的话）
content = re.sub(r'initLoginPageProtection\(\);?\s*', '', content)

# 5. 确保所有页面都有正确的初始样式
content = re.sub(r'<div id="page-(avatar|deepseek|practice|map|plan|topics|method|thinking|podcast|video|games|settings|wrong|ai|ai-chat|game-play)" class="page"', r'<div id="page-\1" class="page" style="display:none;"', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('V118修复完成')

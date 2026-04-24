// V71版本修改脚本

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. 修改登录页面样式，隐藏它
html = html.replace(
  /<div id="page-login" class="page login-page active">/g,
  '<div id="page-login" class="page login-page" style="display:none !important;">'
);

// 2. 修改首页为默认active
html = html.replace(
  /<div id="page-home" class="page">/g,
  '<div id="page-home" class="page active" style="display:block;">'
);

// 3. 在用户下拉菜单中添加"创建新账号"选项（在切换用户后面）
html = html.replace(
  /<div class="user-dropdown-item" onclick="showUserSwitchModal\(\)">👥<\/span><span>切换用户<\/span><\/div>/,
  '<div class="user-dropdown-item" onclick="showUserSwitchModal()"><span>👥</span><span>切换用户</span></div>\n                        <div class="user-dropdown-item" onclick="showCreateUserModal()"><span>➕</span><span>创建新账号</span></div>'
);

// 4. 修改初始化逻辑：直接进入首页，自动创建默认用户
const newInit = `// ====== 初始化 ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('认知训练门户 V71 加载完成');
    
    // 初始化数据
    let data = loadData();
    console.log('用户数量:', data.users.length);
    
    // 如果没有用户，自动创建默认用户"邱宇菲"
    if (data.users.length === 0) {
        console.log('无用户，自动创建默认用户');
        const defaultUser = {
            id: 'user_' + Date.now(),
            name: '邱宇菲',
            grade: 7,
            difficulty: 1,
            points: 1142,
            createdAt: new Date().toISOString(),
            stats: {
                totalQuestions: 0,
                correctAnswers: 0,
                totalMinutes: 0,
                streakDays: 0,
                lastActiveDate: null
            },
            weeklyProgress: {},
            wrongNotes: [],
            completedTopics: []
        };
        data.users.push(defaultUser);
        data.currentUser = defaultUser.id;
        saveData(data);
        console.log('默认用户创建成功:', defaultUser.name);
        data = loadData(); // 重新加载数据
    }
    
    // 直接显示首页
    showPage('home');
    updateUI();
    syncTodayStats();
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
        try {
            if (!e.target.closest('.user-select-wrapper')) { 
                const dropdown = document.getElementById('user-select-dropdown');
                if (dropdown) dropdown.classList.remove('show'); 
            }
            if (!e.target.closest('.user-menu-wrapper')) { 
                const userDropdown = document.getElementById('user-dropdown');
                if (userDropdown) userDropdown.classList.remove('show'); 
            }
        } catch(err) {}
    });
});`;

// 找到并替换初始化代码
const initStart = html.indexOf('// ====== 初始化 ======');
const initEnd = html.indexOf('// ====== 播客音频播放 ======', initStart);
if (initStart !== -1 && initEnd !== -1) {
    html = html.substring(0, initStart) + newInit + '\n\n' + html.substring(initEnd);
}

fs.writeFileSync('index.html', html);
console.log('V71版本修改完成');

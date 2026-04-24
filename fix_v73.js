const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('===== V73 修复（基于多向思维诊断）=====\n');

// 1. 添加closeUserMenu函数
if (!html.includes('function closeUserMenu()')) {
    html = html.replace(
        /function toggleUserMenu\(\) \{ const el = document\.getElementById\('user-dropdown'\); if \(el\) el\.classList\.toggle\('show'\); \}/,
        `function toggleUserMenu() { 
    const el = document.getElementById('user-dropdown'); 
    if (el) el.classList.toggle('show'); 
}

function closeUserMenu() { 
    const el = document.getElementById('user-dropdown'); 
    if (el) el.classList.remove('show'); 
}`
    );
    console.log('✓ 添加closeUserMenu()函数');
}

// 2. 添加.item-info样式
if (!html.includes('.user-select-item .item-info{')) {
    html = html.replace(
        /.user-select-item .item-name{font-size:14px;font-weight:600}/,
        `.user-select-item .item-info{flex:1}
.user-select-item .item-name{font-size:14px;font-weight:600}`
    );
    console.log('✓ 添加.item-info样式');
}

// 3. 增强showUserSwitchModal，添加调试日志
html = html.replace(
    /function showUserSwitchModal\(\) \{[\s\S]*?classList\.add\('show'\);[\s\s]*\}/,
    `function showUserSwitchModal() {
    console.log('>>> 打开用户切换模态框');
    try {
        closeUserMenu();
        const data = loadData();
        console.log('>>> 用户数量:', data.users.length);
        const container = document.getElementById('switch-user-list');
        if (!container) {
            console.error('>>> switch-user-list容器不存在');
            return;
        }
        const colors = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#FF9A63,#E87A4E)', 'linear-gradient(135deg,#43E97B,#38F9D7)'];
        let htmlContent = '';
        data.users.forEach((u, i) => {
            htmlContent += '<div class="user-select-item" onclick="switchToUser(\\'' + u.id + '\\')" style="' + (u.id === data.currentUser ? 'background:#f0f7ff;' : '') + '">';
            htmlContent += '<div class="item-avatar" style="background:' + colors[i % 3] + ';color:white;">' + u.name.charAt(0) + '</div>';
            htmlContent += '<div class="item-info">';
            htmlContent += '<div class="item-name">' + u.name + (u.id === data.currentUser ? ' (当前)' : '') + '</div>';
            htmlContent += '<div class="item-grade">' + gradeNames[u.grade] + ' · Lv.' + u.difficulty + '</div>';
            htmlContent += '</div></div>';
        });
        container.innerHTML = htmlContent;
        console.log('>>> 用户列表渲染完成');
        document.getElementById('user-switch-modal').classList.add('show');
    } catch(err) {
        console.error('>>> showUserSwitchModal错误:', err);
    }
}`
);
console.log('✓ 增强showUserSwitchModal函数');

fs.writeFileSync('index.html', html);
console.log('\n✓ V73修复完成');

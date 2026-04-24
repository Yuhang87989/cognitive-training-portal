const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('===== V74 增强诊断修复 =====\n');

// 1. 确保模态框z-index足够高
html = html.replace(
    /.modal-overlay.show{display:flex;animation:fadeIn 0\.2s}/,
    `.modal-overlay.show{display:flex !important;animation:fadeIn 0.2s;z-index:9999}`
);
console.log('✓ 增强模态框z-index');

// 2. 添加用户友好的错误提示
html = html.replace(
    /function showUserSwitchModal\(\) \{[\s\S]*?\n\}/,
    `function showUserSwitchModal() {
    console.log('>>> 打开用户切换模态框');
    try {
        closeUserMenu();
        const data = loadData();
        console.log('>>> 用户数量:', data.users.length);
        
        if (data.users.length === 0) {
            showToast('暂无用户，请先创建账号');
            return;
        }
        
        if (data.users.length === 1) {
            showToast('只有一个用户，无需切换');
            return;
        }
        
        const container = document.getElementById('switch-user-list');
        if (!container) {
            console.error('>>> switch-user-list容器不存在');
            showToast('页面加载异常，请刷新重试');
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
        console.log('>>> 用户列表渲染完成，显示模态框');
        
        const modal = document.getElementById('user-switch-modal');
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        showToast('请选择要切换的用户');
    } catch(err) {
        console.error('>>> showUserSwitchModal错误:', err);
        showToast('切换失败: ' + err.message);
    }
}`
);
console.log('✓ 增强showUserSwitchModal错误处理');

// 3. 增强switchToUser
html = html.replace(
    /function switchToUser\(userId\) \{[\s\S]*?showToast\([^)]+\);[\s\S]*?\}/,
    `function switchToUser(userId) { 
    try {
        console.log('>>> 切换到用户:', userId);
        const data = loadData(); 
        const user = data.users.find(u => u.id === userId);
        if (!user) {
            showToast('用户不存在');
            return;
        }
        data.currentUser = userId; 
        saveData(data); 
        closeUserSwitchModal(); 
        updateUI(); 
        syncTodayStats(); 
        showToast('已切换到: ' + user.name);
    } catch(err) {
        console.error('>>> switchToUser错误:', err);
        showToast('切换失败: ' + err.message);
    }
}`
);
console.log('✓ 增强switchToUser错误处理');

fs.writeFileSync('index.html', html);
console.log('\n✓ V74修复完成');

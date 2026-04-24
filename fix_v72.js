const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. 添加item-info样式（在user-select-item样式后面）
html = html.replace(
  /.user-select-item .item-grade{font-size:11px;color:var(--text-light)}/,
  `.user-select-item .item-info{flex:1}
.user-select-item .item-grade{font-size:11px;color:var(--text-light)}`
);

// 2. 确保模态框样式正确（添加动画效果）
html = html.replace(
  /.modal-overlay.show{display:flex}/,
  `.modal-overlay.show{display:flex;animation:fadeIn 0.2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}`
);

// 3. 增强switchToUser函数，添加提示
html = html.replace(
  /function switchToUser\(userId\) \{ const data = loadData\(\); data\.currentUser = userId; saveData\(data\); closeUserSwitchModal\(\); updateUI\(\); syncTodayStats\(\); \}/,
  `function switchToUser(userId) { 
    const data = loadData(); 
    const user = data.users.find(u => u.id === userId);
    data.currentUser = userId; 
    saveData(data); 
    closeUserSwitchModal(); 
    updateUI(); 
    syncTodayStats(); 
    showToast('已切换到: ' + (user ? user.name : '用户'));
}`
);

fs.writeFileSync('index.html', html);
console.log('V72修复完成');

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('╔════════════════════════════════════════════════╗');
console.log('║      多向思维全面检查 - 用户切换功能问题       ║');
console.log('╚════════════════════════════════════════════════╝\n');

// ========== 1. 正向思维：用户操作流程追踪 ==========
console.log('【1. 正向思维：用户操作流程追踪】');
console.log('用户操作路径：点击头像 → toggleUserMenu() → 下拉菜单显示 → 点击"切换用户" → showUserSwitchModal()\n');

// 检查每个环节
const flow = [
    { step: '头像点击', code: 'onclick="toggleUserMenu()"', target: 'header-avatar' },
    { step: '下拉菜单项', code: 'onclick="showUserSwitchModal()"', target: 'user-dropdown-item' },
    { step: '模态框HTML', code: 'id="user-switch-modal"', target: 'modal-overlay' },
    { step: '用户列表容器', code: 'id="switch-user-list"', target: 'div' }
];

flow.forEach(item => {
    if (html.includes(item.code)) {
        console.log(`  ✓ ${item.step}: ${item.code}`);
    } else {
        console.log(`  ✗ ${item.step}缺失: ${item.code}`);
    }
});

console.log('\n正向流程关键函数调用链：');
console.log('  toggleUserMenu() → 显示user-dropdown');
console.log('  showUserSwitchModal() → 调用closeUserMenu() → 渲染用户列表 → 显示modal\n');

// 检查函数定义
if (html.includes('function toggleUserMenu()')) {
    const fn = html.match(/function toggleUserMenu\(\)[\s\S]*?\n}/);
    if (fn) console.log('  toggleUserMenu定义:\n    ' + fn[0].replace(/\n/g, '\n    '));
}
if (html.includes('function closeUserMenu()')) {
    console.log('  ✓ closeUserMenu()已定义');
} else {
    console.log('  ✗✗✗ 关键错误：closeUserMenu()未定义！showUserSwitchModal()会调用它！');
}

console.log('\n');

// ========== 2. 逆向思维：从错误反推 ==========
console.log('【2. 逆向思维：从错误反推原因】');
console.log('假设：用户点击"切换用户"无反应\n');
console.log('可能原因链：');
console.log('  1. 事件未绑定 → 检查onclick属性');
console.log('  2. 函数执行报错 → 检查函数内部调用的函数是否存在');
console.log('  3. DOM元素不存在 → 检查getElementById目标');
console.log('  4. 样式导致不可见 → 检查display属性\n');

// 提取showUserSwitchModal函数
const showUserSwitchMatch = html.match(/function showUserSwitchModal\(\)[\s\S]*?\n\s*\}/);
if (showUserSwitchMatch) {
    console.log('showUserSwitchModal函数内容：');
    const fnCode = showUserSwitchMatch[0];
    console.log(fnCode);
    
    // 检查函数内调用的所有函数
    const calledFuncs = fnCode.match(/(\w+)\(\)/g) || [];
    console.log('\n该函数调用了以下函数：');
    calledFuncs.forEach(f => {
        const fnName = f.replace('()', '');
        if (html.includes(`function ${fnName}()`)) {
            console.log(`  ✓ ${fnName}() 存在`);
        } else {
            console.log(`  ✗✗✗ ${fnName}() 不存在 - 这会导致ReferenceError！`);
        }
    });
}

console.log('\n');

// ========== 3. 系统思维：整体架构分析 ==========
console.log('【3. 系统思维：整体架构分析】');
console.log('用户系统架构：');
console.log('  ├── 数据层：loadData() / saveData()');
console.log('  ├── 状态层：currentUser, users[]');
console.log('  ├── UI层：头像、下拉菜单、模态框');
console.log('  └── 事件层：点击事件绑定\n');

// 检查数据流
console.log('数据流完整性检查：');
const dataFlow = ['loadData', 'saveData', 'getCurrentUserData', 'createNewUser'];
dataFlow.forEach(fn => {
    if (html.includes(`function ${fn}()`)) {
        console.log(`  ✓ ${fn}() 数据函数存在`);
    }
});

// 检查UI更新函数
console.log('\nUI更新函数检查：');
const uiFuncs = ['updateUI', 'syncTodayStats', 'renderUserList'];
uiFuncs.forEach(fn => {
    if (html.includes(`function ${fn}()`)) {
        console.log(`  ✓ ${fn}() 存在`);
    } else {
        console.log(`  ✗ ${fn}() 缺失`);
    }
});

console.log('\n');

// ========== 4. 用户思维：用户体验角度 ==========
console.log('【4. 用户思维：用户体验角度】');
console.log('用户期望操作：');
console.log('  1. 打开页面 → 看到首页 ✓');
console.log('  2. 点击头像 → 看到下拉菜单');
console.log('  3. 点击"切换用户" → 看到用户列表弹窗');
console.log('  4. 点击某个用户 → 切换成功并提示\n');

// 检查视觉反馈
console.log('视觉反馈检查：');
if (html.includes('.user-dropdown.show')) {
    console.log('  ✓ 下拉菜单显示样式存在');
} else {
    console.log('  ✗ 下拉菜单.show样式缺失');
}

if (html.includes('.modal-overlay.show')) {
    console.log('  ✓ 模态框显示样式存在');
} else {
    console.log('  ✗ 模态框.show样式缺失');
}

console.log('\n');

// ========== 5. 数据流思维：数据传递分析 ==========
console.log('【5. 数据流思维：数据传递分析】');
console.log('用户切换数据流：');
console.log('  用户点击 → switchToUser(userId)');
console.log('  → loadData() 获取数据');
console.log('  → data.currentUser = userId');
console.log('  → saveData(data) 保存');
console.log('  → updateUI() 更新界面\n');

// 检查switchToUser
const switchMatch = html.match(/function switchToUser\([^)]*\)[\s\S]*?\n\s*\}/);
if (switchMatch) {
    console.log('switchToUser函数：');
    console.log(switchMatch[0]);
}

console.log('\n');

// ========== 6. 状态思维：状态变化追踪 ==========
console.log('【6. 状态思维：状态变化追踪】');
console.log('关键状态：');
console.log('  - user-dropdown.classList: "" ↔ "show"');
console.log('  - user-switch-modal.classList: "" ↔ "show"');
console.log('  - data.currentUser: 用户ID\n');

// 检查状态切换函数
console.log('状态切换函数检查：');
const toggleFuncs = ['toggleUserMenu', 'showUserSwitchModal', 'closeUserSwitchModal', 'closeUserMenu'];
toggleFuncs.forEach(fn => {
    if (html.includes(`function ${fn}()`)) {
        console.log(`  ✓ ${fn}() 存在`);
    } else {
        console.log(`  ✗ ${fn}() 缺失 - 状态切换可能失败！`);
    }
});

console.log('\n');

// ========== 综合诊断 ==========
console.log('╔════════════════════════════════════════════════╗');
console.log('║                  综合诊断结果                   ║');
console.log('╚════════════════════════════════════════════════╝\n');

let criticalErrors = [];
let warnings = [];

// 检查closeUserMenu
if (!html.includes('function closeUserMenu()')) {
    criticalErrors.push('closeUserMenu()函数未定义，showUserSwitchModal()调用会报错');
}

// 检查样式
if (!html.includes('.item-info{') && !html.includes('.item-info {')) {
    warnings.push('.item-info样式缺失，用户列表可能显示异常');
}

// 检查母题
const grade5Math = html.match(/const topicsMath5 = \[[\s\S]*?\];/);
const grade6Math = html.match(/const topicsMath6 = \[[\s\S]*?\];/);
if (grade5Math && grade6Math) {
    console.log('✓ 母题数据：五年级、六年级母题均存在');
    const g5count = (grade5Math[0].match(/\{id:/g) || []).length;
    const g6count = (grade6Math[0].match(/\{id:/g) || []).length;
    console.log(`  - 五年级数学: ${g5count}题`);
    console.log(`  - 六年级数学: ${g6count}题`);
}

if (criticalErrors.length > 0) {
    console.log('\n🔴 关键错误：');
    criticalErrors.forEach(err => console.log(`  ✗ ${err}`));
}

if (warnings.length > 0) {
    console.log('\n🟡 警告：');
    warnings.forEach(warn => console.log(`  ⚠ ${warn}`));
}

if (criticalErrors.length === 0 && warnings.length === 0) {
    console.log('\n✅ 所有检查通过，未发现明显问题');
} else {
    console.log(`\n📊 发现 ${criticalErrors.length} 个关键错误，${warnings.length} 个警告`);
}

console.log('\n========== 多向思维检查完成 ==========');

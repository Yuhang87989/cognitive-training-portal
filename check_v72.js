const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('========== 系统全面检查 V72 ==========\n');

// 1. 检查用户切换模态框HTML
console.log('【1. 用户切换模态框HTML检查】');
const switchModalMatch = html.match(/<div class="modal-overlay" id="user-switch-modal">[\s\S]*?<\/div>\s*<\/div>\s*<!-- 难度调整/);
if (switchModalMatch) {
    console.log('✓ 模态框HTML存在');
    console.log(switchModalMatch[0].substring(0, 300) + '...\n');
} else {
    console.log('✗ 模态框HTML缺失或格式错误\n');
}

// 2. 检查关键函数
console.log('【2. 关键函数检查】');
const functions = ['showUserSwitchModal', 'closeUserSwitchModal', 'switchToUser', 'toggleUserMenu', 'closeUserMenu'];
functions.forEach(fn => {
    const regex = new RegExp(`function ${fn}\\s*\\(`);
    if (regex.test(html)) {
        console.log(`✓ ${fn}() 存在`);
    } else {
        console.log(`✗ ${fn}() 缺失`);
    }
});

// 3. 检查样式
console.log('\n【3. 样式检查】');
const styles = ['.modal-overlay', '.modal-content', '.user-select-item', '.item-info', '.item-avatar', '.item-name'];
styles.forEach(style => {
    if (html.includes(style + '{') || html.includes(style + ' {')) {
        console.log(`✓ ${style} 样式存在`);
    } else {
        console.log(`✗ ${style} 样式缺失`);
    }
});

// 4. 检查母题数据
console.log('\n【4. 母题数据检查】');
const grades = [5, 6, 7, 8, 9];
const subjects = ['math', 'chinese', 'english'];
grades.forEach(grade => {
    subjects.forEach(subject => {
        const varName = `topics${subject.charAt(0).toUpperCase() + subject.slice(1)}${grade}`;
        if (html.includes(`const ${varName} = [`)) {
            // 统计题目数量
            const match = html.match(new RegExp(`const ${varName} = \\[([\\s\\S]*?)\\];`));
            if (match) {
                const count = (match[1].match(/\{id:/g) || []).length;
                console.log(`✓ ${grade}年级${subject === 'math' ? '数学' : subject === 'chinese' ? '语文' : '英语'}: ${count}题`);
            }
        } else {
            console.log(`✗ ${grade}年级${subject}母题缺失`);
        }
    });
});

// 5. 检查数据初始化逻辑
console.log('\n【5. 初始化逻辑检查】');
if (html.includes('data.users.length === 0')) {
    console.log('✓ 默认用户创建逻辑存在');
} else {
    console.log('✗ 默认用户创建逻辑缺失');
}

if (html.includes("name: '邱宇菲'")) {
    console.log('✓ 默认用户"邱宇菲"配置存在');
} else {
    console.log('✗ 默认用户配置缺失');
}

// 6. 检查事件绑定
console.log('\n【6. 事件绑定检查】');
if (html.includes("onclick=\"showUserSwitchModal()\"")) {
    console.log('✓ 切换用户按钮事件绑定正确');
} else {
    console.log('✗ 切换用户按钮事件绑定错误');
}

if (html.includes("onclick=\"toggleUserMenu()\"")) {
    console.log('✓ 头像点击事件绑定正确');
} else {
    console.log('✗ 头像点击事件绑定错误');
}

// 7. 检查可能的冲突
console.log('\n【7. 潜在问题检查】');
const switchToUserDef = html.match(/function switchToUser\([^)]*\)\s*\{[\s\S]*?\n\s*\}/);
if (switchToUserDef) {
    console.log('switchToUser函数定义:');
    console.log(switchToUserDef[0]);
}

console.log('\n========== 检查完成 ==========');

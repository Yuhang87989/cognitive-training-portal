const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 检查关键函数
const functions = [
    'loadData', 'saveData', 'getCurrentUserData', 'updateUI', 'showPage',
    'handleHomeLogin', 'delayedInit', 'selectTeacher', 'sendAvatarChat',
    'renderTopics', 'renderWrongTopics', 'renderGameLeaderboard',
    'openGameModal', 'closeGameModal', 'startGame', 'renderPodcastList',
    'initLoginPageProtection'
];

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/g);
let allCode = '';
if (scriptMatch) {
    scriptMatch.forEach(s => {
        allCode += s.replace(/<script>|<\/script>/g, '\n');
    });
}

console.log('=== 检查关键函数定义 ===');
functions.forEach(fn => {
    const regex = new RegExp(`function\\s+${fn}\\s*\\(|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=|var\\s+${fn}\\s*=`);
    const found = regex.test(allCode);
    console.log(found ? '✓' : '✗', fn);
});

// 检查showPage函数是否正确
console.log('\n=== showPage函数内容 ===');
const showPageMatch = allCode.match(/function showPage\(pageId\)[\s\S]{0,500}/);
if (showPageMatch) {
    console.log(showPageMatch[0].substring(0, 300) + '...');
}

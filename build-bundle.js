const fs = require('fs');
const path = require('path');

const files = [
    'js/config.js',
    'js/ctm.js',
    'js/audio.js',
    'js/db.js',
    'js/storage.js',
    'js/utils.js',
    'js/user.js',
    'js/data/week-plans.js',
    'js/data/topics.js',
    'js/data/podcasts.js',
    'js/data/videos.js',
    'js/data/games-config.js',
    'js/data/ability-model.js',
    'js/modules/practice.js',
    'js/modules/map.js',
    'js/modules/plan.js',
    'js/modules/topics.js',
    'js/modules/method.js',
    'js/modules/thinking.js',
    'js/modules/podcast.js',
    'js/modules/video.js',
    'js/modules/player.js',
    'js/modules/games.js',
    'js/modules/ai.js',
    'js/modules/deepseek.js',
    'js/modules/wrongbook.js',
    'js/modules/pomodoro.js',
    'js/modules/radar-chart.js',
    'js/modules/growth-chart.js',
    'js/modules/local-db.js',
    'js/modules/self-drive.js',
    'js/modules/my-page.js',
    'js/modules/journal.js',
    'js/modules/library.js',
    'js/modules/v255-modules.js',
    'js/modules/ui.js'
];

let bundle = '// ==========================================\n';
bundle += '// 认知训练门户 V246 Bundle\n';
bundle += '// 构建时间: ' + new Date().toISOString() + '\n';
bundle += '// ==========================================\n\n';

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        bundle += '\n// ===== ' + file + ' =====\n';
        bundle += content;
        bundle += '\n';
        console.log('OK: ' + file);
    } else {
        console.log('MISSING: ' + file);
    }
}

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

fs.writeFileSync('dist/bundle.esm.js', bundle, 'utf-8');
console.log('');
console.log('Bundle built: dist/bundle.esm.js');
console.log('Size: ' + (bundle.length / 1024).toFixed(2) + ' KB');

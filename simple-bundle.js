#!/usr/bin/env node
/**
 * 简单的Bundle构建脚本 - 将所有JS文件打包成一个文件
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 开始构建 Bundle...\n');

// 要打包的文件顺序（按依赖顺序）
const files = [
    // 配置和核心模块
    'js/config.js',
    'js/utils.js',
    'js/storage.js',
    'js/db.js',
    'js/user.js',
    'js/ctm.js',
    
    // 基础模块
    'js/modules/ui.js',
    
    // 数据模块
    'js/modules/games.js',
    'js/modules/method.js',
    
    // 功能模块
    'js/modules/deepseek.js',
    'js/modules/my-page.js',
    'js/modules/notepad.js',
    'js/modules/plan.js',
    'js/modules/stats.js',
    'js/modules/self-drive.js',
    'js/modules/practice.js',
    'js/modules/map.js',
    'js/modules/video.js',
    'js/modules/podcast.js',
    'js/modules/player.js',
    'js/modules/mindmap.js',
    'js/modules/pomodoro.js',
    'js/modules/calculator.js',
    'js/modules/ai.js',
    'js/modules/local-db.js',
    'js/modules/fix_all_deepseek_buttons.js',
    
    // 主入口
    'js/main.js'
];

// 确保输出目录存在
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// 合并所有文件
let bundleContent = `// ============================================
// 认知训练门户 Bundle (ESM 版本)
// 构建时间: ${new Date().toISOString()}
// ============================================

'use strict';

// 全局命名空间
if (typeof window === 'undefined') {
    globalThis.window = {};
}

`;

let totalSize = 0;
let successCount = 0;

for (const file of files) {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        bundleContent += `\n// ===== ${file} =====\n`;
        bundleContent += content.replace(/^['"]use strict['"];?/gm, ''); // 移除重复的use strict
        bundleContent += '\n';
        totalSize += content.length;
        successCount++;
        console.log(`✓ ${file} (${(content.length / 1024).toFixed(1)} KB)`);
    } else {
        console.log(`⚠ 跳过: ${file} (不存在)`);
    }
}

// 添加版本信息
bundleContent += `\n// ===== 构建完成 =====\n`;
bundleContent += `console.log('[Bundle] V247 ESM 版本加载完成，共 ${successCount} 个模块，${(totalSize / 1024 / 1024).toFixed(2)} MB');\n`;

// 输出 ESM 版本
fs.writeFileSync('dist/bundle.esm.js', bundleContent, 'utf-8');

console.log(`\n✅ 构建完成！`);
console.log(`📦 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📁 输出文件: dist/bundle.esm.js`);
console.log(`\n⚠  注意: 所有全局函数已通过 window.xxx 方式调用，确保 Bundle 兼容性`);

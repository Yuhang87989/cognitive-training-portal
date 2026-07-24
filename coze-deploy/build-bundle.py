#!/usr/bin/env python3
"""
Bundle构建脚本 - 将所有JS文件打包成一个文件
"""

import os
from datetime import datetime

print('🔨 开始构建 Bundle...\n')

# 要打包的文件顺序（按依赖顺序）
files = [
    # 配置和核心模块
    'js/config.js',
    'js/utils.js',
    'js/storage.js',
    'js/db.js',
    'js/user.js',
    'js/ctm.js',
    
    # 基础模块
    'js/modules/ui.js',
    
    # 数据模块
    'js/modules/games.js',
    'js/modules/method.js',
    
    # 功能模块
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
    
    # 主入口
    'js/main.js'
]

# 确保输出目录存在
if not os.path.exists('dist'):
    os.makedirs('dist')

# 合并所有文件
bundle_content = f'''// ============================================
// 认知训练门户 Bundle (ESM 版本) V247
// 构建时间: {datetime.now().isoformat()}
// ============================================

'use strict';

'''

total_size = 0
success_count = 0

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 移除重复的 use strict
        import re
        content = re.sub(r"^['\"]use strict['\"];?", '', content, flags=re.MULTILINE)
        
        bundle_content += f'\n// ===== {file} =====\n'
        bundle_content += content
        bundle_content += '\n'
        
        file_size = len(content.encode('utf-8'))
        total_size += file_size
        success_count += 1
        print(f'✓ {file} ({file_size / 1024:.1f} KB)')
    else:
        print(f'⚠ 跳过: {file} (不存在)')

# 添加版本信息
bundle_content += f'''
// ===== 构建完成 =====
console.log('[Bundle] V247 ESM 版本加载完成，共 {success_count} 个模块，{(total_size / 1024 / 1024):.2f} MB');
'''

# 输出 ESM 版本
with open('dist/bundle.esm.js', 'w', encoding='utf-8') as f:
    f.write(bundle_content)

# 更新版本号
print(f'\n✅ 构建完成！')
print(f'📦 总大小: {total_size / 1024 / 1024:.2f} MB')
print(f'📁 输出文件: dist/bundle.esm.js')
print(f'\n⚠  注意: 所有全局函数已通过 window.xxx 方式调用，确保 Bundle 兼容性')

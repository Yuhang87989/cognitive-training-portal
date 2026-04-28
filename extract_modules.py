#!/usr/bin/env python3
"""精确提取index.html中各模块内容"""

import os

# 读取单文件版
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 转换为按行处理
lines = content.split('\n')

def get_line_content(start, end):
    """获取指定行范围的内容"""
    if end:
        return '\n'.join(lines[start-1:end])
    return '\n'.join(lines[start-1:])

# 定义各模块的精确行范围
modules = {
    'js/config.js': (948, 959),      # 全局配置文件 - 包含const STORAGE_KEY等
    'js/ctm.js': (963, 1008),         # CTM模块管理器
    'js/storage.js': (1012, 1323),    # 数据存储模块
    'js/audio.js': (1327, 1488),      # 音效系统模块
    'js/utils.js': (1492, 1812),      # 公共工具模块
    'js/user.js': (1816, 2226),       # 用户系统模块
    'js/data/week-plans.js': (2230, 2548),  # Week1-7训练计划数据
    'js/data/topics.js': (2552, 2824),      # 母题数据结构
    'js/data/podcasts.js': (2828, 2855),    # 播客数据结构
    'js/data/videos.js': (2859, 2870),     # 视频数据结构
    'js/data/games-config.js': (2874, 2938), # 游戏配置文件
    'js/modules/practice.js': (3063, 3128), # practice模块
    'js/modules/map.js': (3132, 3296),      # map模块
    'js/modules/plan.js': (3300, 3476),     # plan模块
    'js/modules/topics.js': (3480, 3597),   # topics模块
    'js/modules/method.js': (3601, 3838),   # method模块
    'js/modules/thinking.js': (3842, 4183), # thinking模块
    'js/modules/podcast.js': (4187, 5380),  # podcast模块
    'js/modules/video.js': (5384, 5467),    # video模块
    'js/modules/player.js': (5471, 6306),   # 播放器模块
    'js/modules/games.js': (6310, 12445),    # 游戏模块
    'js/modules/deepseek.js': (12449, 13214), # DeepSeek AI
    'js/modules/wrongbook.js': (13218, 13688), # 错题本模块
    'js/modules/pomodoro.js': (13692, 13749), # 番茄钟模块
    'js/modules/ui.js': (13753, None),        # UI模块 - 到文件末尾
}

# 确保目录存在
for path in modules.keys():
    dir_path = os.path.dirname(path)
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)

# 保存各模块
for path, (start, end) in modules.items():
    content = get_line_content(start, end)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    line_count = len(content.split('\n'))
    print(f"已提取: {path} ({line_count} 行)")

# 提取CSS (行15-314)
css_content = get_line_content(15, 314)
with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css_content)
print(f"已提取: css/style.css ({len(css_content.split(chr(10)))} 行)")

print("\n所有模块提取完成！")

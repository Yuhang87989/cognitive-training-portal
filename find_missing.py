#!/usr/bin/env python3
"""找出遗漏的函数在原始文件中的位置"""

import re

# 读取单文件版
with open('index.html.bak_v108', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到遗漏的函数
missing = ['askAvatarTemplate', 'getTeacherGradient', 'initAvatarHistory', 'playSound', 
           'renderAvatar', 'renderThinking', 'selectTeacher', 'sendToAvatar', 
           'toggleAvatarVoice', 'updatePracticeStats']

for func in missing:
    # 搜索函数定义
    pattern = rf'function\s+{func}|const\s+{func}\s*=|{func}\s*:\s*function'
    match = re.search(pattern, content)
    if match:
        pos = match.start()
        # 计算行号
        line_num = content[:pos].count('\n') + 1
        # 获取上下文
        start = max(0, pos - 100)
        end = min(len(content), pos + 100)
        context = content[start:end].replace('\n', ' ')
        print(f"{func}: 行{line_num}, 位置{pos}")
    else:
        print(f"{func}: 未找到")

import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_mode = None
skip_start = 0

i = 0
while i < len(lines):
    line = lines[i]
    line_num = i + 1
    
    # 跳过第二个 podcastList (第646-668行)
    if line.strip().startswith('const podcastList = [') and line_num > 640 and not skip_mode:
        print(f"跳过重复 podcastList: 第{line_num}-668行")
        # 找到结束
        while i < len(lines) and not ('].' in lines[i] and lines[i].strip().endswith('];')):
            i += 1
        i += 1  # 跳过结束行
        continue
    
    # 跳过重复的 methodTraining (第3038行)
    if line.strip() == 'const methodTraining = methodTrainingQuestions;' and line_num > 3020 and not skip_mode:
        print(f"跳过重复 methodTraining: 第{line_num}行")
        i += 1
        continue
    
    # 处理 methodDetails: 找到闭合大括号，删除后面的重复内容
    if 'testStrategy:' in line and '};' in line and not skip_mode:
        new_lines.append(line)
        # 开始跳过模式：跳过直到找到下一个函数
        skip_mode = 'methodDetails_cleanup'
        i += 1
        continue
    
    if skip_mode == 'methodDetails_cleanup':
        # 如果找到下一个函数，停止跳过
        if 'function showMethodDetail' in line:
            skip_mode = None
            new_lines.append(line)
        # 否则跳过
        i += 1
        continue
    
    new_lines.append(line)
    i += 1

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ 修复完成")

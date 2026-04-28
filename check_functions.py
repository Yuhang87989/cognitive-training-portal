#!/usr/bin/env python3
"""提取并对比函数列表"""

import re
import os

def extract_functions(content):
    """提取JavaScript中的所有函数定义"""
    # 匹配 function name() 或 const name = function() 或 name: function()
    patterns = [
        r'function\s+(\w+)\s*\(',
        r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?function\s*\(',
        r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>',
        r'(\w+)\s*:\s*(?:async\s*)?function\s*\(',
        r'(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{',
    ]
    
    functions = set()
    for pattern in patterns:
        matches = re.findall(pattern, content)
        functions.update(matches)
    
    # 过滤掉常见的非函数词
    exclude = {'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 
               'return', 'try', 'catch', 'finally', 'throw', 'new', 'delete', 'typeof',
               'instanceof', 'in', 'of', 'this', 'true', 'false', 'null', 'undefined',
               'async', 'await', 'static', 'get', 'set', 'constructor', 'undefined'}
    functions = {f for f in functions if f not in exclude and not f.startswith('_')}
    
    return functions

# 读取单文件版
with open('index.html.bak_v108', 'r', encoding='utf-8') as f:
    single_content = f.read()

# 提取所有函数
single_functions = extract_functions(single_content)
print(f"单文件版函数数: {len(single_functions)}")

# 读取所有模块文件
module_functions = set()
for root, dirs, files in os.walk('js'):
    for file in files:
        if file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            module_functions.update(extract_functions(content))

print(f"模块化版本函数数: {len(module_functions)}")

# 对比
only_in_single = single_functions - module_functions
only_in_modules = module_functions - single_functions

if only_in_single:
    print(f"\n只在单文件版中的函数 ({len(only_in_single)}):")
    for f in sorted(only_in_single)[:30]:
        print(f"  - {f}")
    if len(only_in_single) > 30:
        print(f"  ... 还有 {len(only_in_single) - 30} 个")

if only_in_modules:
    print(f"\n只在模块化版本中的函数 ({len(only_in_modules)}):")
    for f in sorted(only_in_modules)[:30]:
        print(f"  - {f}")
    if len(only_in_modules) > 30:
        print(f"  ... 还有 {len(only_in_modules) - 30} 个")

if not only_in_single and not only_in_modules:
    print("\n✓ 函数完整性验证通过!")

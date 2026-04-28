#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
认知训练门户V140 单文件拆分脚本 - 精确版
按 // ====== 标题 ====== 分区注释将index.html完整拆分到模块化文件
"""

import re
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent

def read_html():
    html_path = PROJECT_ROOT / 'index.html'
    with open(html_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_style(html):
    """提取style内容到css/style.css"""
    style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
    if style_match:
        style_content = style_match.group(1).strip()
        css_path = PROJECT_ROOT / 'css' / 'style.css'
        os.makedirs(css_path.parent, exist_ok=True)
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(style_content)
        print(f"✓ 提取CSS到 {css_path}")
        return style_content
    return ""

def extract_script(html):
    """提取主script内容"""
    style_end = html.find('</style>')
    if style_end == -1:
        script_start = html.find('<script>')
    else:
        script_start = html.find('<script>', style_end)
    
    if script_start == -1:
        return ""
    
    script_end = html.rfind('</script>')
    if script_end == -1:
        return ""
    
    script_content = html[script_start + len('<script>'):script_end]
    return script_content

def split_by_sections(script_content):
    """按分区注释分割代码 - 精确匹配 // ====== 标题 ====== 格式"""
    # 匹配: // ====== 标题 ======
    section_pattern = r'// ====== (.+?) ======'
    
    sections = []
    current_section = {'name': '__HEADER__', 'content': '', 'start': 0}
    
    for match in re.finditer(section_pattern, script_content):
        section_name = match.group(1).strip()
        current_section['content'] = script_content[current_section['start']:match.start()]
        sections.append(current_section.copy())
        current_section = {
            'name': section_name,
            'content': '',
            'start': match.end()
        }
    
    current_section['content'] = script_content[current_section['start']:]
    sections.append(current_section)
    
    return sections

def map_section_to_file(section_name):
    """将分区名称映射到文件路径"""
    mapping = {
        '全局配置文件': 'js/config.js',
        'CTM模块管理器': 'js/ctm.js',
        '数据存储模块': 'js/storage.js',
        '默认用户配置': 'js/storage.js',
        '音效系统模块': 'js/audio.js',
        '公共工具模块': 'js/utils.js',
        '"关于"页面函数（重写版本）': 'js/utils.js',
        '用户系统模块': 'js/user.js',
        'Week1-7训练计划数据': 'js/data/week-plans.js',
        'Week2训练计划': 'js/data/week-plans.js',
        'Week3训练计划': 'js/data/week-plans.js',
        'Week4训练计划': 'js/data/week-plans.js',
        'Week7训练计划': 'js/data/week-plans.js',
        'Week Plans 映射': 'js/data/week-plans.js',
        '母题数据结构': 'js/data/topics.js',
        '播客数据结构': 'js/data/podcasts.js',
        '视频数据结构': 'js/data/videos.js',
        '游戏配置文件': 'js/data/games-config.js',
        'practice模块': 'js/modules/practice.js',
        'map模块': 'js/modules/map.js',
        'plan模块': 'js/modules/plan.js',
        'topics模块': 'js/modules/topics.js',
        '方法训练': 'js/modules/method.js',
        '思维训练': 'js/modules/thinking.js',
        '播客模块': 'js/modules/podcast.js',
        'video模块': 'js/modules/video.js',
        '播放器模块': 'js/modules/player.js',
        '游戏模块': 'js/modules/games.js',
        'DeepSeek AI': 'js/modules/deepseek.js',
        '错题本模块': 'js/modules/wrongbook.js',
        '番茄钟模块': 'js/modules/pomodoro.js',
        'UI模块': 'js/modules/ui.js',
        'AI模块': 'js/modules/ai.js',
    }
    return mapping.get(section_name, None)

def count_functions(content):
    """统计函数数量"""
    pattern = r'function\s+\w+\s*\('
    return len(re.findall(pattern, content))

def extract_modules():
    """主提取函数"""
    print("=" * 60)
    print("开始提取V140单文件...")
    print("=" * 60)
    
    html = read_html()
    print(f"✓ 读取index.html完成，大小: {len(html)} bytes")
    
    extract_style(html)
    
    script_content = extract_script(html)
    print(f"✓ 提取script完成，大小: {len(script_content)} bytes")
    
    sections = split_by_sections(script_content)
    print(f"✓ 分割到 {len(sections)} 个分区")
    
    file_contents = {}
    
    for section in sections:
        name = section['name']
        content = section['content'].strip()
        
        if name == '__HEADER__':
            if content:
                file_contents.setdefault('js/modules/ui.js', []).append(content)
            continue
        
        file_path = map_section_to_file(name)
        if file_path:
            file_contents.setdefault(file_path, []).append(content)
            print(f"  → [{name}] → {file_path}")
        else:
            file_contents.setdefault('js/modules/ui.js', []).append(f'\n// ====== {name} ======\n{content}')
            print(f"  ⚠ [{name}] → ui.js")
    
    total_funcs = 0
    for file_path, contents in file_contents.items():
        full_path = PROJECT_ROOT / file_path
        os.makedirs(full_path.parent, exist_ok=True)
        
        final_content = '\n\n'.join(contents)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        funcs = count_functions(final_content)
        total_funcs += funcs
        print(f"✓ {file_path}: {len(final_content)} bytes, {funcs} 函数")
    
    print("=" * 60)
    print(f"提取完成！共 {total_funcs} 个函数")
    print("=" * 60)
    
    return total_funcs

def create_modular_index():
    """创建模块化index.html"""
    print("\n创建模块化index.html...")
    
    html_path = PROJECT_ROOT / 'index.html'
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 构建新HTML
    new_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<meta name="theme-color" content="#3377FF"/>
<title>认知训练 V140</title>
<link rel="manifest" href="manifest.json"/>
<link rel="icon" type="image/x-icon" href="favicon.ico"/>
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png"/>
<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
<link rel="stylesheet" href="css/style.css"/>
<!-- PeerJS 音视频库 -->
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
</head>
<body>
'''
    
    # 提取body内容
    body_match = re.search(r'<body>(.*)</body>', html, re.DOTALL)
    if body_match:
        new_html += body_match.group(1)
    
    # 底部脚本引用
    new_html += '''
<script>
// ============================================================
// 认知训练门户 V140 模块化加载器
// ============================================================
(function() {
    // 加载顺序：核心 -> 数据 -> 模块
    const loadOrder = [
        // 核心模块
        'js/config.js',
        'js/ctm.js',
        'js/audio.js', 
        'js/storage.js',
        'js/utils.js',
        'js/user.js',
        // 数据层
        'js/data/week-plans.js',
        'js/data/topics.js',
        'js/data/podcasts.js',
        'js/data/videos.js',
        'js/data/games-config.js',
        // 功能模块
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
        'js/modules/ui.js'
    ];
    
    let loaded = 0;
    function loadNext() {
        if (loaded >= loadOrder.length) {
            // 全部加载完成后，注册Service Worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW registration failed:', err));
            }
            return;
        }
        const script = document.createElement('script');
        script.src = loadOrder[loaded++];
        script.onload = loadNext;
        script.onerror = function() {
            console.warn('Failed to load:', script.src);
            loadNext();
        };
        document.head.appendChild(script);
    }
    
    // 等待DOM就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNext);
    } else {
        loadNext();
    }
})();
</script>
</body>
</html>'''
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print(f"✓ 写入模块化index.html ({len(new_html)} bytes)")

if __name__ == '__main__':
    funcs = extract_modules()
    create_modular_index()

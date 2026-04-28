#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
认知训练门户 V140 模块化重构脚本
将单文件 index.html 拆分为多文件模块化架构
"""

import re
import os

BASE_DIR = './cognitive-training-portal'
INDEX_FILE = os.path.join(BASE_DIR, 'index.html')

def read_index():
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {path} ({len(content)} chars)")

def extract_css(content):
    """提取CSS到css/style.css"""
    match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if match:
        css = match.group(1).strip()
        # 修复CSS中的注释问题
        css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
        return css
    return ""

def extract_script(content):
    """提取script标签内容"""
    match = re.search(r'<script>\s*//\s*(.*?)\s*</script>', content, re.DOTALL)
    if match:
        return match.group(1)
    
    # 查找<script>标签开始
    script_start = content.find('<script>')
    script_end = content.rfind('</script>')
    if script_start != -1 and script_end != -1:
        return content[script_start+8:script_end].strip()
    return ""

def get_line_number(content, text, start=0):
    """获取文本在内容中的行号"""
    return content[:start].count('\n') + 1

# 读取index.html
print("Reading index.html...")
content = read_index()
lines = content.split('\n')
total_lines = len(lines)

# 1. 提取CSS
print("\n=== Step 1: Extracting CSS ===")
css_content = extract_css(content)
write_file('css/style.css', css_content)

# 2. 提取script内容
print("\n=== Step 2: Extracting Script ===")
script_content = extract_script(content)

# 找到script开始的行
script_start_idx = content.find('<script>')
script_start_line = content[:script_start_idx].count('\n') + 1

# 分析脚本结构
print(f"Script starts at line: {script_start_line}")

# 查找关键数据定义的位置
def find_line(text):
    idx = script_content.find(text)
    if idx != -1:
        # 计算在原始文件中的行号
        script_start = content.find('<script>')
        before_script = content[:script_start]
        before_text = content[:script_start + idx]
        return before_text.count('\n') + 1
    return -1

# 分析关键位置
key_positions = {
    'config_start': find_line('DEEPSEEK_API_KEY'),
    'CTM_start': find_line('const CTM'),
    'week1Plan': find_line('const week1Plan'),
    'week2Plan': find_line('const week2Plan'),
    'week3Plan': find_line('const week3Plan'),
    'week4Plan': find_line('const week4Plan'),
    'week5Plan': find_line('const week5Plan'),
    'week6Plan': find_line('const week6Plan'),
    'week7Plan': find_line('const week7Plan'),
    'topicsMath5': find_line('topicsMath5'),
    'topicsMath6': find_line('topicsMath6'),
    'topicsMath7': find_line('topicsMath7'),
    'topicsMath8': find_line('topicsMath8'),
    'topicsMath9': find_line('topicsMath9'),
    'topicsChinese5': find_line('topicsChinese5'),
    'topicsChinese6': find_line('topicsChinese6'),
    'topicsChinese7': find_line('topicsChinese7'),
    'topicsChinese8': find_line('topicsChinese8'),
    'topicsChinese9': find_line('topicsChinese9'),
    'topicsEnglish5': find_line('topicsEnglish5'),
    'topicsEnglish6': find_line('topicsEnglish6'),
    'topicsEnglish7': find_line('topicsEnglish7'),
    'topicsEnglish8': find_line('topicsEnglish8'),
    'topicsEnglish9': find_line('topicsEnglish9'),
    'topicsPhysics6': find_line('topicsPhysics6'),
    'topicsPhysics7': find_line('topicsPhysics7'),
    'topicsPhysics8': find_line('topicsPhysics8'),
    'topicsPhysics9': find_line('topicsPhysics9'),
    'topicsData': find_line('const topicsData'),
    'podcastList': find_line('const podcastList'),
    'videoList': find_line('const videoList'),
    'games': find_line('const games'),
    'gameConfig': find_line('const gameConfig'),
    'OLD_KEYS': find_line('OLD_KEYS'),
}

print("\nKey positions found:")
for k, v in key_positions.items():
    if v > 0:
        print(f"  {k}: line {v}")

# 创建 config.js
print("\n=== Step 3: Creating js/config.js ===")
config_pattern = r'''// ====== 全局配置 ======
const DEEPSEEK_API_KEY = '[^']*';
const DEEPSEEK_API_URL = '[^']*';
const DEEPSEEK_MODEL = '[^']*';
const STORAGE_KEY = '[^']*';
const API_CONFIG_KEY = '[^']*';
const OLD_KEYS = \[.*?\];'''

config_match = re.search(config_pattern, script_content, re.DOTALL)
if config_match:
    config_content = config_match.group(0)
    # 添加注释
    config_content = '''// ====== 全局配置文件 ======
// 包含API配置、存储键名等全局常量
// 版本: V140

''' + config_match.group(0)
    write_file('js/config.js', config_content)

# 创建 ctm.js
print("\n=== Step 4: Creating js/ctm.js ===")
ctm_start = script_content.find('// ===== CTM模块管理器 =====')
ctm_end = script_content.find('// ===== 用户数据管理 =====')

# 查找CTM模块结束位置
ctm_end_patterns = ['// ===== 音效系统 =====', 'const SoundEffects', 'const gradeNames']
ctm_end = len(script_content)
for pattern in ctm_end_patterns:
    idx = script_content.find(pattern)
    if idx != -1 and idx > ctm_start:
        ctm_end = min(ctm_end, idx)

ctm_content = script_content[ctm_start:ctm_end].strip()
ctm_content = '''// ====== CTM模块管理器 ======
// Cognitive Training Manager - 模块注册与钩子系统
// 版本: V140

''' + ctm_content
write_file('js/ctm.js', ctm_content)

print(f"CTM module extracted: {ctm_end - ctm_start} chars")

# 查找topicsData结束位置
topics_data_end = script_content.find('// ===== 音效系统 =====')
if topics_data_end == -1:
    topics_data_end = script_content.find('const SoundEffects')
if topics_data_end == -1:
    topics_data_end = script_content.find('// ===== 学霸方法数据 =====')

# 创建 topics.js
print("\n=== Step 5: Creating js/data/topics.js ===")
topics_start = script_content.find('// ===== 母题数据结构 =====')
if topics_start == -1:
    topics_start = script_content.find('topicsMath5')
    
topics_end = script_content.find('// ===== 播客数据结构 =====')
if topics_end == -1:
    topics_end = topics_data_end

# 确保找到有效范围
if topics_start > 0 and topics_end > topics_start:
    topics_content = script_content[topics_start:topics_end].strip()
    # 确保以 topicsData 定义结束
    if 'const topicsData' not in topics_content and 'topicsData' in script_content[topics_start:topics_end+5000]:
        topics_content = script_content[topics_start:topics_end+5000]
    
    topics_content = '''// ====== 母题数据结构 ======
// 包含五年级到初三的数学、语文、英语、物理母题
// 版本: V140

''' + topics_content
    write_file('js/data/topics.js', topics_content)

# 创建 podcasts.js
print("\n=== Step 6: Creating js/data/podcasts.js ===")
podcast_start = script_content.find('// ===== 播客数据结构 =====')
if podcast_start == -1:
    podcast_start = script_content.find('const podcastList')

video_start = script_content.find('// ===== 视频数据结构 =====')
if video_start == -1:
    video_start = script_content.find('const videoList')

if podcast_start > 0 and video_start > podcast_start:
    podcast_content = script_content[podcast_start:video_start].strip()
    podcast_content = '''// ====== 播客数据结构 ======
// 包含21个认知训练播客课程
// 版本: V140

''' + podcast_content
    write_file('js/data/podcasts.js', podcast_content)

# 创建 videos.js
print("\n=== Step 7: Creating js/data/videos.js ===")
# 视频数据可能在不同位置
video_end = script_content.find('// ===== 学霸方法数据 =====')
if video_end == -1:
    video_end = script_content.find('// ===== CTM模块管理器 =====')
    
if video_start > 0 and video_end > video_start:
    video_content = script_content[video_start:video_end].strip()
    video_content = '''// ====== 视频数据结构 ======
// 版本: V140

''' + video_content
    write_file('js/data/videos.js', video_content)

# 创建 week-plans.js
print("\n=== Step 8: Creating js/data/week-plans.js ===")
# 从原始index.html获取完整的week plans
with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    index_content = f.read()

# 提取week1-week7计划
week_start_patterns = ['const week1Plan', 'const week2Plan', 'const week3Plan', 
                       'const week4Plan', 'const week5Plan', 'const week6Plan', 'const week7Plan']
week_contents = []

for i, pattern in enumerate(week_start_patterns, 1):
    idx = index_content.find(pattern)
    if idx != -1:
        # 找到对应的结束位置
        end_idx = index_content.find('};', idx) + 2
        week_content = index_content[idx:end_idx]
        week_contents.append(week_content)
        print(f"  Found week{i}: {len(week_content)} chars")

week_plans_content = '''// ====== Week1-7训练计划数据 ======
// 版本: V140

''' + '\n\n'.join(week_contents) + '''

// ===== Week Plans 映射 =====
const weekPlans = {
    week1: week1Plan,
    week2: week2Plan,
    week3: week3Plan,
    week4: week4Plan,
    week5: week5Plan,
    week6: week6Plan,
    week7: week7Plan
};
'''
write_file('js/data/week-plans.js', week_plans_content)

# 创建 games-config.js
print("\n=== Step 9: Creating js/data/games-config.js ===")
games_start = script_content.find('// ===== 游戏配置 =====')
if games_start == -1:
    games_start = script_content.find('const games')

# 查找games结束位置 - 在topics数据之前
games_end = script_content.find('// ===== 母题数据结构 =====')
if games_end == -1:
    games_end = script_content.find('topicsMath5')

if games_start > 0 and games_end > games_start:
    games_content = script_content[games_start:games_end].strip()
    games_content = '''// ====== 游戏配置文件 ======
// 包含23个认知训练游戏的配置
// 版本: V140

''' + games_content
    write_file('js/data/games-config.js', games_content)

# 创建 storage.js
print("\n=== Step 10: Creating js/storage.js ===")
# 查找loadData函数
storage_funcs = ['loadData', 'saveData', 'clearCurrentUserData', 'getApiConfig', 
                 'saveApiConfig', 'resetApiConfig', 'updateApiStatusDisplay', 
                 'clearAllData', 'exportData', 'importData', 'handleImportFile', 
                 'syncData', 'showDataStatsModal', 'updateTrainCount', 
                 'viewWrongNotes', 'clearWrongNotes']

storage_content = '''// ====== 数据存储模块 ======
// 负责localStorage数据存取、导入导出、API配置
// 版本: V140

'''

# 从脚本中提取storage相关函数
storage_start = script_content.find('// ===== 用户数据管理 =====')
if storage_start == -1:
    storage_start = script_content.find('function loadData')

storage_end = script_content.find('// ===== 音效系统 =====')
if storage_end == -1:
    storage_end = script_content.find('const SoundEffects')

if storage_start > 0 and storage_end > storage_start:
    storage_content += script_content[storage_start:storage_end].strip()

write_file('js/storage.js', storage_content)

# 创建 audio.js
print("\n=== Step 11: Creating js/audio.js ===")
audio_start = script_content.find('// ===== 音效系统 =====')
if audio_start == -1:
    audio_start = script_content.find('const SoundEffects')

# 查找audio结束
audio_end_patterns = ['// ===== Toast提示系统 =====', 'function showToast', 
                       '// ===== 公共工具函数 =====', 'gradeNames']
audio_end = len(script_content)
for pattern in audio_end_patterns:
    idx = script_content.find(pattern)
    if idx != -1 and idx > audio_start:
        audio_end = min(audio_end, idx)

if audio_start > 0 and audio_end > audio_start:
    audio_content = script_content[audio_start:audio_end].strip()
    audio_content = '''// ====== 音效系统模块 ======
// 版本: V140

''' + audio_content
    write_file('js/audio.js', audio_content)

# 创建 utils.js
print("\n=== Step 12: Creating js/utils.js ===")
utils_content = '''// ====== 公共工具模块 ======
// 版本: V140

'''

# 查找showToast和公共函数
toast_start = script_content.find('// ===== Toast提示系统 =====')
if toast_start == -1:
    toast_start = script_content.find('function showToast')

# 查找函数结束 - 找到用户系统开始
user_func_end = script_content.find('// ===== 用户系统 =====')
if user_func_end == -1:
    user_func_end = script_content.find('function toggleUserMenu')

if toast_start > 0:
    utils_content += script_content[toast_start:user_func_end].strip() + '\n'

# 添加openAbout函数（重写版本）
utils_content += '''
// ===== "关于"页面函数 =====
function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = \`
        <div style="text-align:center;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#3377FF,#FF9A63);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">🧠</div>
            <h2 style="font-size:20px;font-weight:bold;margin-bottom:8px;">认知训练门户</h2>
            <div style="color:#3377FF;font-size:14px;margin-bottom:20px;">V140</div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>产品介绍</strong></p>
                    <p style="font-size:13px;color:#666;">专为12-16岁青少年设计的科学认知训练系统，通过系统化的训练提升学习能力。</p>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>Week1-7 训练目标</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week1-2:</strong> 注意力与记忆力基础 → 专注力提升30%</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week3-4:</strong> 数学思维与物理思维入门 → 逻辑推理能力提升</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week5:</strong> 系统性思维与守恒思维 → 跨学科整合能力</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week6:</strong> 学科深度整合与自主学习 → 独立学习能力</p>
                        <p style="margin-bottom:0;"><strong style="color:#3377FF;">Week7:</strong> 综合应用与创新思维 → 创造性解决问题能力</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;">
                    <p style="margin-bottom:8px;"><strong>核心功能</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p>• 12大训练模块</p>
                        <p>• 23个认知游戏</p>
                        <p>• DeepSeek AI智能辅导</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:center;color:#999;font-size:12px;margin-top:20px;">
                <p>开发团队：Coze AI Agent</p>
            </div>
        </div>
        <button onclick="closeModal()" style="width:100%;padding:14px;background:#3377FF;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:16px;">关闭</button>
    \`;
    modal.classList.add('show');
}
window.openAbout = openAbout;
'''

write_file('js/utils.js', utils_content)

# 创建 user.js
print("\n=== Step 13: Creating js/user.js ===")
user_start = script_content.find('// ===== 用户系统 =====')
if user_start == -1:
    user_start = script_content.find('function toggleUserMenu')

# 查找gradeNames结束
grade_names_end = script_content.find('// ===== 用户数据管理 =====')
if grade_names_end == -1:
    grade_names_end = script_content.find('function loadData')

user_content = script_content[user_start:grade_names_end].strip()

# 添加关闭按钮功能和点击外部关闭功能
user_content = '''// ====== 用户系统模块 ======
// 版本: V140

// 用户下拉菜单点击外部关闭
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('user-dropdown');
    const avatar = document.getElementById('header-avatar');
    if (dropdown && avatar) {
        if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});

''' + user_content

write_file('js/user.js', user_content)

print("\n=== Module extraction completed ===")
print("Creating module files...")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
认知训练门户 V140 模块化重构 - 完整版
"""

import re
import os

BASE_DIR = './cognitive-training-portal'
INDEX_FILE = os.path.join(BASE_DIR, 'index.html')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ {path} ({len(content)} chars)")

def extract_block(content, start_pattern, end_patterns):
    """提取代码块"""
    start_idx = content.find(start_pattern)
    if start_idx == -1:
        return None, -1, -1
    
    end_idx = len(content)
    for pattern in end_patterns:
        idx = content.find(pattern, start_idx + len(start_pattern))
        if idx != -1:
            end_idx = min(end_idx, idx)
    
    return content[start_idx:end_idx], start_idx, end_idx

def main():
    print("=" * 60)
    print("认知训练门户 V140 模块化重构")
    print("=" * 60)
    
    # 读取原始文件
    print("\n📖 读取 index.html...")
    content = read_file(INDEX_FILE)
    print(f"   文件大小: {len(content)} chars")
    
    # 创建目录结构
    os.makedirs(os.path.join(BASE_DIR, 'css'), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, 'js', 'data'), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, 'js', 'modules'), exist_ok=True)
    print("✓ 目录结构创建完成")
    
    # 1. 提取CSS
    print("\n📦 提取CSS...")
    css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if css_match:
        css = css_match.group(1).strip()
        # 清理CSS注释
        css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
        write_file('css/style.css', css)
    
    # 提取script内容
    script_start = content.find('<script>')
    script_end = content.rfind('</script>')
    script = content[script_start + 8:script_end].strip()
    
    # 2. 创建 js/config.js
    print("\n📦 创建 js/config.js...")
    config_match = re.search(
        r"const DEEPSEEK_API_KEY = '[^']*';\s*"
        r"const DEEPSEEK_API_URL = '[^']*';\s*"
        r"const DEEPSEEK_MODEL = '[^']*';\s*"
        r"const STORAGE_KEY = '[^']*';",
        script
    )
    if config_match:
        config = '''// ====== 全局配置文件 ======
// 版本: V140
// 包含API配置、存储键名等全局常量

''' + config_match.group(0) + '''
// API配置存储键
const API_CONFIG_KEY = 'cognitive_api_config';
'''
        write_file('js/config.js', config)
    
    # 3. 创建 js/ctm.js
    print("\n📦 创建 js/ctm.js...")
    ctm_match = re.search(
        r'(// ===== CTM模块管理器 =====.*?)(?=// ===== [^=])',
        script, re.DOTALL
    )
    if ctm_match:
        ctm = '''// ====== CTM模块管理器 ======
// Cognitive Training Manager - 模块注册与钩子系统
// 版本: V140

''' + ctm_match.group(1)
        write_file('js/ctm.js', ctm)
    
    # 4. 创建 js/data/week-plans.js
    print("\n📦 创建 js/data/week-plans.js...")
    # 从原始文件提取完整的week plans
    week_blocks = []
    for i in range(1, 8):
        pattern = f'const week{i}Plan = \\{{'
        idx = content.find(pattern)
        if idx != -1:
            end = content.find('};', idx) + 2
            week_blocks.append(content[idx:end])
    
    week_plans = '''// ====== Week1-7训练计划数据 ======
// 版本: V140

''' + '\n\n'.join(week_blocks) + '''

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
    write_file('js/data/week-plans.js', week_plans)
    
    # 5. 创建 js/data/topics.js
    print("\n📦 创建 js/data/topics.js...")
    topics_match = re.search(
        r'(// ===== 母题数据结构 =====.*?topicsData\s*=\s*\{)',
        script, re.DOTALL
    )
    if topics_match:
        # 找到topicsData的完整定义
        td_start = script.find('topicsData = {')
        td_end = script.find('};', td_start) + 2
        topics = script[topics_match.start():td_start] + script[td_start:td_end]
        topics = '''// ====== 母题数据结构 ======
// 版本: V140

''' + topics
        write_file('js/data/topics.js', topics)
    
    # 6. 创建 js/data/podcasts.js
    print("\n📦 创建 js/data/podcasts.js...")
    podcast_match = re.search(
        r'(const podcastList = \[.*?\];)',
        script, re.DOTALL
    )
    if podcast_match:
        podcasts = '''// ====== 播客数据结构 ======
// 版本: V140

''' + podcast_match.group(1)
        write_file('js/data/podcasts.js', podcasts)
    
    # 7. 创建 js/data/videos.js
    print("\n📦 创建 js/data/videos.js...")
    video_match = re.search(
        r'(const videoList = \[.*?\];)',
        script, re.DOTALL
    )
    if video_match:
        videos = '''// ====== 视频数据结构 ======
// 版本: V140

''' + video_match.group(1)
        write_file('js/data/videos.js', videos)
    
    # 8. 创建 js/data/games-config.js
    print("\n📦 创建 js/data/games-config.js...")
    games_match = re.search(
        r'(// ===== 游戏配置 =====.*?)(?=// ===== 母题数据结构 =====)',
        script, re.DOTALL
    )
    if games_match:
        games = '''// ====== 游戏配置文件 ======
// 版本: V140

''' + games_match.group(1)
        write_file('js/data/games-config.js', games)
    
    # 9. 创建 js/storage.js
    print("\n📦 创建 js/storage.js...")
    storage_funcs = ['loadData', 'saveData', 'clearCurrentUserData', 'getApiConfig', 
                     'saveApiConfig', 'resetApiConfig', 'updateApiStatusDisplay']
    storage_content = '''// ====== 数据存储模块 ======
// 版本: V140

'''
    for func in storage_funcs:
        pattern = f'function {func}'
        idx = script.find(pattern)
        if idx != -1:
            # 找到函数结束
            brace_count = 0
            started = False
            end = idx
            for i in range(idx, min(idx + 5000, len(script))):
                if script[i] == '{':
                    brace_count += 1
                    started = True
                elif script[i] == '}':
                    brace_count -= 1
                    if started and brace_count == 0:
                        end = i + 1
                        break
            storage_content += script[idx:end] + '\n\n'
    write_file('js/storage.js', storage_content)
    
    # 10. 创建 js/audio.js
    print("\n📦 创建 js/audio.js...")
    audio_match = re.search(
        r'(const SoundEffects = \{.*?\};)',
        script, re.DOTALL
    )
    if audio_match:
        audio = '''// ====== 音效系统模块 ======
// 版本: V140

''' + audio_match.group(1)
        write_file('js/audio.js', audio)
    
    # 11. 创建 js/user.js
    print("\n📦 创建 js/user.js...")
    user_funcs = ['toggleUserMenu', 'closeUserMenu', 'showUserSwitchModal', 'showCreateUserModal',
                   'quickLogin', 'openEditProfileModal', 'openDifficultyModal', 'openAvatarModal',
                   'renderUserList', 'createNewUser', 'closeCreateUserModal', 'closeUserSwitchModal',
                   'setDifficulty', 'closeDifficultyModal', 'saveProfileChanges', 'closeEditProfileModal',
                   'savePasswordChanges', 'closeChangePasswordModal', 'openApiConfigModal',
                   'renderAvatarGrid', 'selectAvatar', 'openChangePasswordModal']
    
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

'''
    
    # 添加gradeNames
    grade_match = re.search(r'(const gradeNames = \{[^}]+\};)', script)
    if grade_match:
        user_content += grade_match.group(1) + '\n\n'
    
    for func in user_funcs:
        pattern = f'function {func}'
        idx = script.find(pattern)
        if idx != -1:
            brace_count = 0
            started = False
            end = idx
            for i in range(idx, min(idx + 3000, len(script))):
                if script[i] == '{':
                    brace_count += 1
                    started = True
                elif script[i] == '}':
                    brace_count -= 1
                    if started and brace_count == 0:
                        end = i + 1
                        break
            user_content += script[idx:end] + '\n\n'
    
    write_file('js/user.js', user_content)
    
    # 12. 创建 js/utils.js
    print("\n📦 创建 js/utils.js...")
    utils_funcs = ['showToast', 'cleanupModuleState', 'closeModal', 'switchModule', 
                   'openSettingsPanel', 'closeSettingsPanel', 'toggleSettingsGroup',
                   'exitSystem', 'openAbout']
    
    utils_content = '''// ====== 公共工具模块 ======
// 版本: V140

'''
    
    for func in utils_funcs:
        pattern = f'function {func}'
        idx = script.find(pattern)
        if idx != -1:
            brace_count = 0
            started = False
            end = idx
            for i in range(idx, min(idx + 5000, len(script))):
                if script[i] == '{':
                    brace_count += 1
                    started = True
                elif script[i] == '}':
                    brace_count -= 1
                    if started and brace_count == 0:
                        end = i + 1
                        break
            utils_content += script[idx:end] + '\n\n'
    
    # 添加重写的openAbout函数
    utils_content += '''
// ===== "关于"页面函数（重写版本）=====
function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
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
    `;
    modal.classList.add('show');
}
window.openAbout = openAbout;
'''
    
    write_file('js/utils.js', utils_content)
    
    print("\n" + "=" * 60)
    print("基础模块创建完成")
    print("=" * 60)

if __name__ == '__main__':
    main()

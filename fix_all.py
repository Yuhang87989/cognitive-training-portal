#!/usr/bin/env python3
"""
修复：1.用户切换和数据存储 2.自驱力返回关闭按钮
直接修改 Bundle
"""

with open('dist/bundle.esm.js', 'r', encoding='utf-8') as f:
    bundle = f.read()

print("开始修复...\n")

# ========== 修复 1: 用户切换相关 ==========
# quickLogin
bundle = bundle.replace('onclick="quickLogin(\'', 'onclick="window.quickLogin(\'')
print("✓ 修复 quickLogin onclick")

# deleteUser
bundle = bundle.replace('onclick="event.stopPropagation();deleteUser(', 'onclick="event.stopPropagation();window.deleteUser(')
print("✓ 修复 deleteUser onclick")

# switchToUser
bundle = bundle.replace('onclick="switchToUser(\'', 'onclick="window.switchToUser(\'')
print("✓ 修复 switchToUser onclick")

# 挂载用户切换函数到 window
user_mount = '''
// ===== 修复: 挂载用户切换和数据存储函数到 window =====
if (typeof quickLogin === 'function' && !window.quickLogin) {
    window.quickLogin = quickLogin;
}
if (typeof loadData === 'function' && !window.loadData) {
    window.loadData = loadData;
}
if (typeof saveData === 'function' && !window.saveData) {
    window.saveData = saveData;
}
if (typeof switchToUser === 'function' && !window.switchToUser) {
    window.switchToUser = switchToUser;
}
if (typeof deleteUser === 'function' && !window.deleteUser) {
    window.deleteUser = deleteUser;
}
'''

if '修复: 挂载用户切换和数据存储函数到 window' not in bundle:
    bundle += user_mount
    print("✓ 挂载用户切换函数")
else:
    print("✓ 用户切换函数已挂载")

# ========== 修复 2: 自驱力模块详细检查 ==========
# 检查 renderGoalPage 函数
import re

# 找到 renderGoalPage 函数的位置
goalpage_match = re.search(r'function renderGoalPage\(\)\s*\{([\s\S]*?)\n\}', bundle)
if goalpage_match:
    print("✓ 找到 renderGoalPage 函数")
    
    # 检查函数内的所有 onclick 调用
    func_content = goalpage_match.group(1)
    
    # 检查是否有关闭按钮
    if 'closeSelfDriveModal' not in func_content:
        print("⚠ 自驱力模块中没有关闭按钮")
        
        # 在我的目标标题位置添加关闭按钮
        old_header = '<h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>'
        new_header = '''<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px 0;">
            <h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>
            <button onclick="window.closeSelfDriveModal()" style="padding:6px 12px;background:#f0f0f0;color:#666;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✕ 关闭</button>
        </div>'''
        
        bundle = bundle.replace(old_header, new_header)
        print("✓ 添加关闭按钮到目标页面")

# 添加 closeSelfDriveModal 函数
if 'function closeSelfDriveModal' not in bundle:
    close_func = '''
// ===== 修复: 添加自驱力关闭按钮函数 =====
function closeSelfDriveModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('show');
}
if (!window.closeSelfDriveModal) {
    window.closeSelfDriveModal = closeSelfDriveModal;
}
'''
    bundle += close_func
    print("✓ 添加 closeSelfDriveModal 函数")
else:
    print("✓ closeSelfDriveModal 函数已存在")

# 确保自驱力所有 onclick 都加 window.
selfdrive_funcs = ['addGoal', 'toggleGoal', 'deleteGoal', 'addHabit', 'toggleHabit', 'deleteHabit', 'addAchievement', 'deleteAchievement', 'saveDiary', 'saveMethodNote', 'renderHabitPage', 'renderAchievementPage', 'renderDiaryPage', 'renderMethodPage', 'checkInToday', 'renderSelfDrive', 'renderGoalPage']

for func in selfdrive_funcs:
    bundle = bundle.replace(f'onclick="{func}(', f'onclick="window.{func}(')
print(f"✓ 自驱力 {len(selfdrive_funcs)} 个函数 onclick 加 window.")

with open('dist/bundle.esm.js', 'w', encoding='utf-8') as f:
    f.write(bundle)

print("\n✅ 所有修复完成！")

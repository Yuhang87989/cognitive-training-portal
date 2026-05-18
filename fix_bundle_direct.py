#!/usr/bin/env python3
"""
直接修改 Bundle 文件，只修复自驱力相关问题
不重新构建整个 Bundle，避免破坏其他功能
"""

# 读取当前能正常工作的 Bundle
with open('dist/bundle.esm.js', 'r', encoding='utf-8') as f:
    bundle = f.read()

original_size = len(bundle)
print(f"原始 Bundle 大小: {original_size / 1024 / 1024:.2f} MB")

# ========== 修复 1: selfdrive 的 typeof 检查 ==========
old1 = "case 'selfdrive': \n            if (typeof renderGoalPage === 'function') {"
new1 = "case 'selfdrive': \n            if (typeof window.renderGoalPage === 'function') {"
bundle = bundle.replace(old1, new1)
print("✓ 修复 1: selfdrive 的 typeof 检查")

# ========== 修复 2: growth 的 typeof 检查 ==========
old2 = "if (typeof renderGrowthChart === 'function') {\n                    renderGrowthChart('growth-chart-canvas', 'week');"
new2 = "if (typeof window.renderGrowthChart === 'function') {\n                    window.renderGrowthChart('growth-chart-canvas', 'week');"
bundle = bundle.replace(old2, new2)
print("✓ 修复 2: growth 的 typeof 和函数调用")

# ========== 修复 3: self-drive.js 中的 onclick 调用 ==========
# 批量替换 self-drive 相关的 onclick
selfdrive_funcs = [
    'addGoal', 'toggleGoal', 'deleteGoal',
    'addHabit', 'toggleHabit', 'deleteHabit',
    'addAchievement', 'deleteAchievement',
    'saveDiary', 'saveMethodNote',
    'renderHabitPage', 'renderAchievementPage',
    'renderDiaryPage', 'renderMethodPage',
    'checkInToday', 'renderSelfDrive',
]

for func in selfdrive_funcs:
    bundle = bundle.replace(f'onclick="{func}(', f'onclick="window.{func}(')
print(f"✓ 修复 3: self-drive 的 {len(selfdrive_funcs)} 个 onclick 调用")

# ========== 修复 4: deepseek.js 中的 onclick 调用 ==========
deepseek_funcs = [
    'renderDeepseek', 'startNewDeepSeekChat',
    'clearDeepSeekConversation', 'toggleDeepSeekVoice',
    'triggerDeepSeekImage', 'clearDeepSeekImage',
    'ocrImageAndSend', 'toggleDeepseekMode',
    'sendToDeepSeek', 'loadSavedDeepSeekChat',
    'deleteSavedDeepSeekChat', 'toggleDeepSeekHistory',
]

for func in deepseek_funcs:
    bundle = bundle.replace(f'onclick="{func}(', f'onclick="window.{func}(')
print(f"✓ 修复 4: deepseek 的 {len(deepseek_funcs)} 个 onclick 调用")

# ========== 修复 5: method.js 中的 onclick 调用 ==========
method_funcs = [
    'analyzeMethodWithAI', 'analyzeThinkingWithAI',
    'analyzeMethodPhotoWithAI', 'viewMethodNote',
    'deleteMethodNote', 'selectThinkingOpt',
    'filterMethod', 'submitTopicAnswer',
    'submitMethodAnswers', 'submitThinkingAnswers',
]

for func in method_funcs:
    bundle = bundle.replace(f'onclick="{func}(', f'onclick="window.{func}(')
print(f"✓ 修复 5: method 的 {len(method_funcs)} 个 onclick 调用")

# ========== 修复 6: 给自驱力添加关闭按钮 ==========
# 在我的目标标题旁边添加关闭按钮
old_header = '''<h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>
            <button onclick="addGoal()"'''
new_header = '''<h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>
            <div style="display:flex;gap:8px;">
                <button onclick="window.closeSelfDriveModal()" style="padding:8px 12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">✕ 关闭</button>
                <button onclick="window.addGoal()"'''
bundle = bundle.replace(old_header, new_header)
print("✓ 修复 6: 自驱力添加关闭按钮")

# 在文件末尾添加 closeSelfDriveModal 函数
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
print("✓ 修复 7: 添加 closeSelfDriveModal 函数")

# 保存修改后的 Bundle
with open('dist/bundle.esm.js', 'w', encoding='utf-8') as f:
    f.write(bundle)

new_size = len(bundle)
print(f"\n修改后 Bundle 大小: {new_size / 1024 / 1024:.2f} MB")
print(f"大小变化: {new_size - original_size} 字节")
print("\n✅ Bundle 直接修改完成！")

#!/usr/bin/env python3
"""
修复ui.js中的模块调用添加window.前缀，确保Bundle版本能正确调用
"""

with open('js/modules/ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

# 需要修复的函数调用列表
fixes = [
    # 渲染函数调用
    ('renderMyPage(', 'window.renderMyPage('),
    ('renderJournalModule(', 'window.renderJournalModule('),
    ('renderLibraryModule(', 'window.renderLibraryModule('),
    ('renderGoalPage(', 'window.renderGoalPage('),
    ('renderDeepseek(', 'window.renderDeepseek('),
    ('renderNotepad(', 'window.renderNotepad('),
    ('renderWeeklyReview(', 'window.renderWeeklyReview('),
    ('renderStats(', 'window.renderStats('),
    ('renderPlan(', 'window.renderPlan('),
    ('renderPractice(', 'window.renderPractice('),
    ('renderMap(', 'window.renderMap('),
    ('renderVideo(', 'window.renderVideo('),
    ('renderPodcast(', 'window.renderPodcast('),
    ('renderPlayer(', 'window.renderPlayer('),
    ('renderMethod(', 'window.renderMethod('),
    # 辅助函数
    ('showModuleLoading(', 'window.showModuleLoading('),
    ('closeDetail(', 'window.closeDetail('),
    ('closeModal(', 'window.closeModal('),
    ('viewMethodNote(', 'window.viewMethodNote('),
    ('deleteMethodNote(', 'window.deleteMethodNote('),
    ('submitTopicAnswer(', 'window.submitTopicAnswer('),
    ('submitMethodAnswers(', 'window.submitMethodAnswers('),
    ('submitThinkingAnswers(', 'window.submitThinkingAnswers('),
    ('selectThinkingOpt(', 'window.selectThinkingOpt('),
    ('filterBooks(', 'window.filterBooks('),
    ('filterMethod(', 'window.filterMethod('),
    # 类型检查
    ('typeof renderMyPage', 'typeof window.renderMyPage'),
    ('typeof renderJournalModule', 'typeof window.renderJournalModule'),
    ('typeof renderLibraryModule', 'typeof window.renderLibraryModule'),
    ('typeof renderGoalPage', 'typeof window.renderGoalPage'),
    ('typeof renderDeepseek', 'typeof window.renderDeepseek'),
    ('typeof renderNotepad', 'typeof window.renderNotepad'),
    ('typeof renderWeeklyReview', 'typeof window.renderWeeklyReview'),
    ('typeof renderStats', 'typeof window.renderStats'),
    ('typeof renderPlan', 'typeof window.renderPlan'),
    ('typeof showModuleLoading', 'typeof window.showModuleLoading'),
]

for old, new in fixes:
    ui_content = ui_content.replace(old, new)

with open('js/modules/ui.js', 'w', encoding='utf-8') as f:
    f.write(ui_content)

print("✓ ui.js中所有函数调用已添加 window. 前缀")

# 2. 修复 notepad.js - 添加 renderJournalModule 别名
with open('js/modules/notepad.js', 'r', encoding='utf-8') as f:
    notepad_content = f.read()

# 确保 renderNotepad 挂载到window
if 'window.renderNotepad' not in notepad_content:
    # 找到函数定义并挂载
    notepad_content = notepad_content.replace(
        'function renderNotepad(container) {',
        'function renderNotepad(container) {'
    )
    # 在文件末尾添加挂载
    notepad_content += '\n\n// Bundle 兼容性：挂载到window\nif (!window.renderNotepad) window.renderNotepad = renderNotepad;\n'
    # 添加别名 renderJournalModule
    notepad_content += 'if (!window.renderJournalModule) window.renderJournalModule = renderNotepad;\n'

with open('js/modules/notepad.js', 'w', encoding='utf-8') as f:
    f.write(notepad_content)

print("✓ notepad.js renderNotepad 挂载到window，并添加 renderJournalModule 别名")

# 3. 修复 stats.js - 添加 renderStats 别名（指向 renderWeeklyReview）
with open('js/modules/stats.js', 'r', encoding='utf-8') as f:
    stats_content = f.read()

if 'window.renderWeeklyReview' not in stats_content:
    stats_content = stats_content.replace(
        'function renderWeeklyReview(container) {',
        'function renderWeeklyReview(container) {'
    )
    # 在文件末尾添加挂载
    stats_content += '\n\n// Bundle 兼容性：挂载到window\nif (!window.renderWeeklyReview) window.renderWeeklyReview = renderWeeklyReview;\n'
    stats_content += 'if (!window.renderStats) window.renderStats = renderWeeklyReview;\n'

with open('js/modules/stats.js', 'w', encoding='utf-8') as f:
    f.write(stats_content)

print("✓ stats.js renderWeeklyReview 挂载到window，并添加 renderStats 别名")

# 4. 创建 renderLibraryModule 函数 - 暂时重定向到AI图书馆
# 检查是否存在 renderLibraryModule
import subprocess
result = subprocess.run(['grep', '-l', 'renderLibraryModule', 'js/modules/*.js'], capture_output=True, text=True)
if not result.stdout.strip():
    # 创建一个简单的 library 模块
    library_code = '''
// ==================== Bundle 兼容性：学习图书馆模块 ====================
// 学习图书馆渲染函数
window.renderLibraryModule = function(container) {
    // 确保 LIBRARY_BOOKS 存在
    if (!window.LIBRARY_BOOKS) {
        window.LIBRARY_BOOKS = [
            { id: 1, title: '学习之道', author: '芭芭拉·奥克利', category: '学习方法' },
            { id: 2, title: '刻意练习', author: '安德斯·艾利克森', category: '学习方法' },
            { id: 3, title: '认知天性', author: '彼得·布朗', category: '认知科学' },
            { id: 4, title: '思考，快与慢', author: '丹尼尔·卡尼曼', category: '思维方式' },
            { id: 5, title: '深度工作', author: '卡尔·纽波特', category: '效率提升' },
            { id: 6, title: '原子习惯', author: '詹姆斯·克利尔', category: '习惯养成' }
        ];
    }

    container.innerHTML = `
        <div style="padding:20px;">
            <h2 style="margin-bottom:20px;">📚 学习图书馆</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
                ${window.LIBRARY_BOOKS.map(book => `
                    <div style="background:white;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        <div style="font-size:18px;font-weight:600;margin-bottom:8px;">${book.title}</div>
                        <div style="color:#666;margin-bottom:8px;">${book.author}</div>
                        <div style="display:inline-block;background:#e3f2fd;color:#1976d2;padding:4px 12px;border-radius:20px;font-size:12px;">
                            ${book.category}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

console.log('[Library] renderLibraryModule 已挂载到window');
'''

    # 添加到 games.js 末尾
    with open('js/modules/games.js', 'a', encoding='utf-8') as f:
        f.write('\n' + library_code)
    print("✓ 创建了 renderLibraryModule 函数并挂载到window")
else:
    print("✓ renderLibraryModule 已存在")

print("\n=== 所有UI调用修复完成！ ===")
print("请重新运行 build-bundle.js 生成新的Bundle文件")

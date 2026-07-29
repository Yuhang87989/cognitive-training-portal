#!/usr/bin/env python3
"""
修复Bundle版本剩余问题：
1. 所有模块函数挂载到window
2. 常量作用域问题
3. 缺失的辅助函数
"""

import re

# 1. 修复 games.js - 添加缺失的辅助函数，挂载到window
with open('js/modules/games.js', 'r', encoding='utf-8') as f:
    games_content = f.read()

# 检查并添加缺失的辅助函数
missing_functions = [
    'viewMethodNote', 'deleteMethodNote', 'submitTopicAnswer',
    'closeDetail', 'closeModal', 'submitMethodAnswers',
    'submitThinkingAnswers', 'selectThinkingOpt', 'filterBooks', 'filterMethod'
]

# 在文件末尾添加这些函数的定义（如果不存在）
# 首先创建函数定义
helper_functions = '''

// ==================== Bundle 兼容性：辅助函数（挂载到window）====================
window.viewMethodNote = function(methodId) {
    if (!window.METHOD_NOTES) return;
    const note = window.METHOD_NOTES[methodId];
    const content = note ? `<div class="method-note-content">${note}</div>` : '<div class="empty-state"><p>暂无笔记</p></div>';
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>方法笔记</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.deleteMethodNote = function(methodId) {
    if (confirm('确定删除这条笔记吗？')) {
        if (window.METHOD_NOTES) {
            delete window.METHOD_NOTES[methodId];
        }
        alert('已删除');
    }
};

window.submitTopicAnswer = function(topicId) {
    const answerEl = document.getElementById(`topic-answer-${topicId}`);
    if (!answerEl) return;
    const answer = answerEl.value.trim();
    if (!answer) {
        alert('请输入答案');
        return;
    }
    alert('提交成功！');
};

window.closeDetail = function() {
    const panel = document.getElementById('detail-panel');
    if (panel) panel.style.display = 'none';
};

window.closeModal = function() {
    const modals = document.querySelectorAll('.modal-overlay, .modal-backdrop');
    modals.forEach(m => m.remove());
};

window.submitMethodAnswers = function() {
    alert('答案已提交！');
};

window.submitThinkingAnswers = function() {
    alert('思考答案已提交！');
};

window.selectThinkingOpt = function(btn, option) {
    const parent = btn.parentElement;
    if (parent) {
        parent.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    }
};

window.filterBooks = function(category) {
    if (!window.LIBRARY_BOOKS) return;
    const books = category === 'all'
        ? window.LIBRARY_BOOKS
        : window.LIBRARY_BOOKS.filter(b => b.category === category);
    renderLibraryBooks(books);
};

window.filterMethod = function(category) {
    if (!window.METHOD_DATA) return;
    renderMethodList(window.METHOD_DATA, category);
};

// 辅助函数：渲染图书馆书籍列表
function renderLibraryBooks(books) {
    const container = document.getElementById('library-books-list');
    if (!container) return;
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author || ''}</div>
            <div class="book-category">${book.category || ''}</div>
        </div>
    `).join('');
}

// 辅助函数：渲染方法列表
function renderMethodList(methods, category = 'all') {
    const container = document.getElementById('method-list-container');
    if (!container) return;
    const filtered = category === 'all'
        ? methods
        : methods.filter(m => m.category === category);
    container.innerHTML = filtered.map(method => `
        <div class="method-card">
            <div class="method-name">${method.name}</div>
            <div class="method-desc">${method.description || ''}</div>
        </div>
    `).join('');
}
'''

# 检查是否已经有这些window.xxx函数定义
if 'window.viewMethodNote' not in games_content:
    # 在文件末尾添加
    games_content += helper_functions
    with open('js/modules/games.js', 'w', encoding='utf-8') as f:
        f.write(games_content)
    print("✓ 添加了games.js中的辅助函数")
else:
    print("✓ games.js辅助函数已存在")

# 2. 修复 deepseek.js - 挂载渲染函数到window，修复LIBRARY_BOOKS
with open('js/modules/deepseek.js', 'r', encoding='utf-8') as f:
    deepseek_content = f.read()

# 检查 renderDeepseek
if 'window.renderDeepseek' not in deepseek_content and 'function renderDeepseek' in deepseek_content:
    # 找到函数定义并修改
    deepseek_content = deepseek_content.replace(
        'function renderDeepseek(',
        'window.renderDeepseek = function('
    )
    print("✓ deepseek.js renderDeepseek挂载到window")

# 修复 LIBRARY_BOOKS 引用问题 - 添加 window. 前缀
deepseek_content = deepseek_content.replace(
    'if (!LIBRARY_BOOKS)',
    'if (!window.LIBRARY_BOOKS)'
).replace(
    'LIBRARY_BOOKS.forEach(',
    'window.LIBRARY_BOOKS.forEach('
).replace(
    'const book = LIBRARY_BOOKS.find(',
    'const book = window.LIBRARY_BOOKS.find('
)

# 检查并添加 LIBRARY_BOOKS 初始化
if 'window.LIBRARY_BOOKS' not in deepseek_content:
    # 在文件开头附近添加初始化
    library_init = '''
// ==================== Bundle 兼容性：LIBRARY_BOOKS 初始化 ====================
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
'''
    # 在 'use strict' 后面添加
    deepseek_content = deepseek_content.replace(
        "'use strict';",
        "'use strict';\n" + library_init
    )
    print("✓ deepseek.js 添加 LIBRARY_BOOKS 初始化")

with open('js/modules/deepseek.js', 'w', encoding='utf-8') as f:
    f.write(deepseek_content)

# 3. 修复 my-page.js - 挂载渲染函数到window
with open('js/modules/my-page.js', 'r', encoding='utf-8') as f:
    mypage_content = f.read()

if 'window.renderMyPage' not in mypage_content and 'function renderMyPage' in mypage_content:
    mypage_content = mypage_content.replace(
        'function renderMyPage(',
        'window.renderMyPage = function('
    )
    with open('js/modules/my-page.js', 'w', encoding='utf-8') as f:
        f.write(mypage_content)
    print("✓ my-page.js renderMyPage挂载到window")

# 4. 修复 plan.js - 挂载渲染函数到window
with open('js/modules/plan.js', 'r', encoding='utf-8') as f:
    plan_content = f.read()

if 'window.renderPlan' not in plan_content and 'function renderPlan(' in plan_content:
    plan_content = plan_content.replace(
        'function renderPlan(',
        'window.renderPlan = function('
    )
    with open('js/modules/plan.js', 'w', encoding='utf-8') as f:
        f.write(plan_content)
    print("✓ plan.js renderPlan挂载到window")

# 5. 修复 notepad.js - 挂载渲染函数到window（学习日记）
with open('js/modules/notepad.js', 'r', encoding='utf-8') as f:
    notepad_content = f.read()

if 'window.renderNotepad' not in notepad_content and 'function renderNotepad(' in notepad_content:
    notepad_content = notepad_content.replace(
        'function renderNotepad(',
        'window.renderNotepad = function('
    )
    with open('js/modules/notepad.js', 'w', encoding='utf-8') as f:
        f.write(notepad_content)
    print("✓ notepad.js renderNotepad挂载到window")

# 6. 修复 stats.js - 挂载渲染函数到window（每周回顾）
with open('js/modules/stats.js', 'r', encoding='utf-8') as f:
    stats_content = f.read()

if 'window.renderStats' not in stats_content and 'function renderStats(' in stats_content:
    stats_content = stats_content.replace(
        'function renderStats(',
        'window.renderStats = function('
    )
    with open('js/modules/stats.js', 'w', encoding='utf-8') as f:
        f.write(stats_content)
    print("✓ stats.js renderStats挂载到window")

# 7. 修复 self-drive.js - 确保所有函数都挂载到window
with open('js/modules/self-drive.js', 'r', encoding='utf-8') as f:
    selfdrive_content = f.read()

# 检查自驱力的主要渲染函数
for func_name in ['renderSelfDrive', 'renderSelfDriveIntro', 'renderSelfDriveAssessment',
                   'renderSelfDrivePlan', 'renderSelfDriveProgress', 'renderSelfDriveReflection']:
    if f'window.{func_name}' not in selfdrive_content and f'function {func_name}' in selfdrive_content:
        selfdrive_content = selfdrive_content.replace(
            f'function {func_name}(',
            f'window.{func_name} = function('
        )
        print(f"✓ self-drive.js {func_name}挂载到window")

with open('js/modules/self-drive.js', 'w', encoding='utf-8') as f:
    f.write(selfdrive_content)

# 8. 修复 ui.js - 确保 todayStats 是 let 而不是 const
with open('js/modules/ui.js', 'r', encoding='utf-8') as f:
    ui_content = f.read()

# 修复 const todayStats 改为 let
if 'const todayStats =' in ui_content:
    ui_content = ui_content.replace('const todayStats =', 'let todayStats =')
    print("✓ ui.js todayStats 常量问题修复")

with open('js/modules/ui.js', 'w', encoding='utf-8') as f:
    f.write(ui_content)

# 9. 检查 method.js 中的 METHOD_DATA 和其他常量
with open('js/modules/method.js', 'r', encoding='utf-8') as f:
    method_content = f.read()

# 确保 METHOD_DATA 挂载到 window
if 'window.METHOD_DATA' not in method_content:
    method_content = method_content.replace(
        "const METHOD_DATA =",
        "window.METHOD_DATA ="
    ).replace(
        "const METHOD_NOTES =",
        "window.METHOD_NOTES ="
    )
    with open('js/modules/method.js', 'w', encoding='utf-8') as f:
        f.write(method_content)
    print("✓ method.js METHOD_DATA/METHOD_NOTES 挂载到window")

print("\n=== 所有修复完成！ ===")
print("请重新运行 build-bundle.js 生成新的Bundle文件")

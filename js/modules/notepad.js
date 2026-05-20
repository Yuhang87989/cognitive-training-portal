// ============================================================
// 版本: V144
// 记事本模块
// ============================================================

const NOTEPAD_STORAGE_KEY = 'notepad_content';
const NOTEPAD_NOTES_KEY = 'notepad_notes';

// 加载笔记列表
function loadNotes() {
    const notes = localStorage.getItem(NOTEPAD_NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
}

// 保存笔记列表
function saveNotes(notes) {
    localStorage.setItem(NOTEPAD_NOTES_KEY, JSON.stringify(notes));
}

function renderNotepad(container) {
    const notes = loadNotes();
    
    container.innerHTML = `
        <div class="card" style="max-width:500px;margin:0 auto;">
            <h3 style="text-align:center;margin-bottom:16px;">📝 学习日记</h3>
            
            <div style="margin-bottom:16px;">
                <input type="text" id="note-title" placeholder="标题（可选）" style="width:100%;padding:12px;margin-bottom:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box;">
                <textarea id="note-content" placeholder="在这里写下你的笔记..." style="width:100%;height:150px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;resize:vertical;box-sizing:border-box;"></textarea>
                <button onclick="saveNote()" style="width:100%;margin-top:10px;padding:12px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;">💾 保存笔记</button>
            </div>
            
            <div id="notes-list" style="max-height:300px;overflow-y:auto;">
                ${notes.length === 0 ? 
                    '<p style="text-align:center;color:#999;padding:20px;">暂无笔记，开始记录你的第一个笔记吧！</p>' : 
                    notes.map((note, index) => `
                        <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                                <div style="flex:1;">
                                    ${note.title ? `<div style="font-weight:bold;color:#333;margin-bottom:4px;">${escapeHtml(note.title)}</div>` : ''}
                                    <div style="color:#666;font-size:13px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                                    <div style="font-size:11px;color:#999;margin-top:6px;">${formatDate(note.timestamp)}</div>
                                </div>
                                <button onclick="deleteNote(${index})" style="margin-left:10px;padding:6px 10px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            
            <button onclick="history.back()" style="margin-top:20px;width:100%;padding:12px 24px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
        </div>
    `;
}

function saveNote() {
    const titleEl = document.getElementById('note-title');
    const contentEl = document.getElementById('note-content');
    const title = titleEl.value.trim();
    const content = contentEl.value.trim();
    
    if (!content) {
        window.showToast('请输入笔记内容');
        return;
    }
    
    const notes = loadNotes();
    notes.unshift({
        title: title,
        content: content,
        timestamp: Date.now()
    });
    saveNotes(notes);
    
    titleEl.value = '';
    contentEl.value = '';
    window.showToast('笔记已保存');
    renderNotepad(document.getElementById('fullscreen-content'));
}

function deleteNote(index) {
    if (confirm('确定要删除这条笔记吗？')) {
        const notes = loadNotes();
        notes.splice(index, 1);
        saveNotes(notes);
        window.showToast('笔记已删除');
        renderNotepad(document.getElementById('fullscreen-content'));
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 导出到window，供onclick调用
window.renderNotepad = renderNotepad;
window.saveNote = saveNote;
window.deleteNote = deleteNote;

// ============================================================
// ES6 Module 导出
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderNotepad,
        saveNote,
        deleteNote,
        loadNotes,
        escapeHtml,
        formatDate,
        NOTEPAD_STORAGE_KEY,
        NOTEPAD_NOTES_KEY
    };
}

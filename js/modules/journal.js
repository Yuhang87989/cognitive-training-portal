// V255: 学习日记模块 - 支持分页、JSON导出、数据统计

window.JOURNAL_ITEMS_PER_PAGE = 20;

function renderJournalModule(container) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    
    // 数据统计
    var total = journals.length;
    var currentMonth = new Date().getMonth();
    var currentYear = new Date().getFullYear();
    var monthCount = journals.filter(function(j) {
        var d = new Date(j.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    
    // 今日是否已写
    var todayStr = new Date().toISOString().split('T')[0];
    var wroteToday = journals.some(function(j) { return j.date.startsWith(todayStr); });
    
    container.innerHTML = `
        <div style="padding: 16px;">
            <!-- 数据统计卡片 -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + total + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">总日记数</div>
                </div>
                <div style="background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + monthCount + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">本月新增</div>
                </div>
                <div style="background: linear-gradient(135deg, ` + ('#4facfe, #00f2fe' if wroteToday else '#9e9e9e, #757575') + `); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + ('✅' if wroteToday else '📝') + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">今日已写</div>
                </div>
            </div>
            
            <!-- 操作按钮 -->
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                <button onclick="openJournalEditor()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    ✏️ 写日记
                </button>
                <button onclick="exportJournals()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    📤 导出备份
                </button>
            </div>
            
            <!-- 分页导航 -->
            <div id="journal-pagination" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;"></div>
            
            <!-- 日记列表 -->
            <div id="journal-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
    
    // 渲染第一页
    renderJournalPage(1);
}

function renderJournalPage(page) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    var totalPages = Math.ceil(journals.length / JOURNAL_ITEMS_PER_PAGE) || 1;
    page = Math.max(1, Math.min(page, totalPages));
    
    var start = (page - 1) * JOURNAL_ITEMS_PER_PAGE;
    var end = start + JOURNAL_ITEMS_PER_PAGE;
    var pageItems = journals.slice(start, end).reverse(); // 最新在前
    
    var listEl = document.getElementById('journal-list');
    var pagEl = document.getElementById('journal-pagination');
    
    if (pageItems.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 16px;">📓</div>
                <div>还没有日记，开始记录你的学习成长吧！</div>
            </div>
        `;
        pagEl.innerHTML = '';
        return;
    }
    
    // 渲染日记列表
    listEl.innerHTML = pageItems.map(function(j, i) {
        var dateStr = new Date(j.date).toLocaleDateString('zh-CN', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        var moodEmoji = {1: '😢', 2: '😔', 3: '😐', 4: '😊', 5: '😄'}[j.mood] || '😊';
        var preview = j.content.substring(0, 80) + (j.content.length > 80 ? '...' : '');
        
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 13px; color: #667eea; font-weight: 600;">` + dateStr + `</div>
                    <div style="font-size: 20px;">` + moodEmoji + `</div>
                </div>
                <div style="font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 8px;">` + preview + `</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ` + (j.tags ? j.tags.split(',').map(function(t) {
                        return '<span style="background: #f0f3ff; color: #667eea; padding: 2px 8px; border-radius: 10px; font-size: 11px;">' + t.trim() + '</span>';
                    }).join('') : '') + `
                </div>
                <div style="text-align: right; margin-top: 12px;">
                    <button onclick="viewJournalDetail(` + (start + pageItems.length - 1 - i) + `)" style="background: none; border: none; color: #667eea; font-size: 13px; cursor: pointer;">查看详情 →</button>
                </div>
            </div>
        `;
    }).join('');
    
    // 渲染分页
    var pagHtml = '';
    if (totalPages > 1) {
        pagHtml += '<button onclick="renderJournalPage(' + (page - 1) + ')" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;" ' + (page === 1 ? 'disabled' : '') + '>上一页</button>';
        for (var p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) {
            pagHtml += '<button onclick="renderJournalPage(' + p + ')" style="padding: 8px 12px; border: none; background: ' + (p === page ? '#667eea' : '#f5f5f5') + '; color: ' + (p === page ? 'white' : '#333') + '; border-radius: 8px; cursor: pointer; min-width: 36px;">' + p + '</button>';
        }
        pagHtml += '<button onclick="renderJournalPage(' + (page + 1) + ')" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;" ' + (page === totalPages ? 'disabled' : '') + '>下一页</button>';
    }
    pagEl.innerHTML = pagHtml;
}

function openJournalEditor() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; text-align: center;">✏️ 写学习日记</h3>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">今日心情</label>
                <div id="mood-selector" style="display: flex; justify-content: center; gap: 16px; font-size: 28px;">
                    <span onclick="selectMood(1)" style="cursor: pointer; opacity: 0.5;">😢</span>
                    <span onclick="selectMood(2)" style="cursor: pointer; opacity: 0.5;">😔</span>
                    <span onclick="selectMood(3)" style="cursor: pointer; opacity: 1; transform: scale(1.2);">😐</span>
                    <span onclick="selectMood(4)" style="cursor: pointer; opacity: 0.5;">😊</span>
                    <span onclick="selectMood(5)" style="cursor: pointer; opacity: 0.5;">😄</span>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">日记内容</label>
                <textarea id="journal-content" rows="8" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; resize: vertical; box-sizing: border-box;" placeholder="记录今天的学习收获、心得体会..."></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">标签（逗号分隔）</label>
                <input id="journal-tags" type="text" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; box-sizing: border-box;" placeholder="例如: 数学, 错题, 进步">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">取消</button>
                <button onclick="saveJournal()" style="flex: 2; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">💾 保存日记</button>
            </div>
        </div>
    `;
    
    window.selectedMood = 3;
}

function selectMood(mood) {
    window.selectedMood = mood;
    var spans = document.querySelectorAll('#mood-selector span');
    for (var i = 0; i < spans.length; i++) {
        spans[i].style.opacity = (i + 1 === mood) ? '1' : '0.5';
        spans[i].style.transform = (i + 1 === mood) ? 'scale(1.2)' : 'scale(1)';
    }
}

function saveJournal() {
    var content = document.getElementById('journal-content').value.trim();
    var tags = document.getElementById('journal-tags').value.trim();
    
    if (!content) {
        showToast('请输入日记内容');
        return;
    }
    
    var user = getCurrentUserData();
    if (!user.journals) user.journals = [];
    
    user.journals.push({
        id: Date.now(),
        date: new Date().toISOString(),
        content: content,
        tags: tags,
        mood: window.selectedMood || 3
    });
    
    saveCurrentUserData(user);
    closeModal();
    showToast('日记保存成功！🎉');
    
    // 刷新列表
    var container = document.getElementById('fullscreen-content');
    if (container) renderJournalModule(container);
}

function viewJournalDetail(index) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    var journal = journals[index];
    if (!journal) return;
    
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    var dateStr = new Date(journal.date).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'
    });
    var moodEmoji = {1: '😢', 2: '😔', 3: '😐', 4: '😊', 5: '😄'}[journal.mood] || '😊';
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="font-size: 14px; color: #667eea; font-weight: 600;">` + dateStr + `</div>
                <div style="font-size: 24px;">` + moodEmoji + `</div>
            </div>
            
            <div style="background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; max-height: 300px; overflow-y: auto;">
                <div style="font-size: 15px; color: #333; line-height: 1.8; white-space: pre-wrap;">` + journal.content + `</div>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                ` + (journal.tags ? journal.tags.split(',').map(function(t) {
                    return '<span style="background: #f0f3ff; color: #667eea; padding: 4px 12px; border-radius: 12px; font-size: 12px;">' + t.trim() + '</span>';
                }).join('') : '') + `
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="deleteJournal(` + index + `)" style="flex: 1; padding: 12px; background: #fff5f5; color: #ff6b6b; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">🗑️ 删除</button>
                <button onclick="closeModal()" style="flex: 2; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">关闭</button>
            </div>
        </div>
    `;
}

function deleteJournal(index) {
    if (!confirm('确定要删除这篇日记吗？')) return;
    
    var user = getCurrentUserData();
    user.journals.splice(index, 1);
    saveCurrentUserData(user);
    closeModal();
    showToast('日记已删除');
    
    // 刷新列表
    var container = document.getElementById('fullscreen-content');
    if (container) renderJournalModule(container);
}

function exportJournals() {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    
    if (journals.length === 0) {
        showToast('还没有日记可导出');
        return;
    }
    
    var exportData = {
        version: 'V255',
        exportDate: new Date().toISOString(),
        user: user.name,
        totalCount: journals.length,
        journals: journals
    };
    
    var jsonStr = JSON.stringify(exportData, null, 2);
    var blob = new Blob([jsonStr], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = '学习日记备份_' + user.name + '_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('导出成功！已下载JSON备份文件');
}

window.renderJournalPage = renderJournalPage;
window.openJournalEditor = openJournalEditor;
window.selectMood = selectMood;
window.saveJournal = saveJournal;
window.viewJournalDetail = viewJournalDetail;
window.deleteJournal = deleteJournal;
window.exportJournals = exportJournals;
window.renderJournalModule = renderJournalModule;

// 兼容函数
function renderJournalPage(container) {
    renderJournalModule(container);
}
window.renderJournalPage = renderJournalPage;

// ============================================================
// 学习日记模块
// 功能：日记记录、心情打卡、学习时长、标签分类、搜索
// ============================================================

const DIARY_STORAGE_KEY = 'learning_diary';

function loadDiary() {
    const data = localStorage.getItem(DIARY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveDiary(data) {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(data));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

function formatDateShort(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
        return '今天';
    } else if (diff < 48 * 60 * 60 * 1000) {
        return '昨天';
    } else {
        return `${date.getMonth()+1}月${date.getDate()}日`;
    }
}

const MOODS = [
    { emoji: '😊', name: '开心', color: '#4caf50' },
    { emoji: '😌', name: '平静', color: '#2196f3' },
    { emoji: '😤', name: '烦躁', color: '#ff9800' },
    { emoji: '😫', name: '疲惫', color: '#9c27b0' },
    { emoji: '🤔', name: '思考', color: '#3f51b5' },
    { emoji: '🎉', name: '充实', color: '#e91e63' }
];

const TAGS = ['📐 数学', '📖 语文', '🔤 英语', '🔬 科学', '🎨 兴趣', '💭 感想', '📝 计划', '❓ 问题'];

function renderNotepad(container) {
    const diary = loadDiary();
    
    container.innerHTML = `
        <div style="padding:20px;max-width:600px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="window.closeFullscreenPage()" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;">📝 学习日记</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 今日打卡卡片 -->
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:16px;padding:20px;margin-bottom:20px;">
                <div style="font-size:16px;font-weight:bold;margin-bottom:12px;">✨ 今日学习打卡</div>
                
                <!-- 心情选择 -->
                <div style="margin-bottom:12px;">
                    <div style="font-size:13px;opacity:0.9;margin-bottom:8px;">今天心情：</div>
                    <div style="display:flex;gap:8px;" id="moodSelector">
                        ${MOODS.map((m, i) => `
                            <span onclick="selectMood(${i})" id="mood_${i}" style="padding:6px 10px;background:rgba(255,255,255,0.2);border-radius:20px;cursor:pointer;font-size:18px;transition:all 0.2s;" title="${m.name}">${m.emoji}</span>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 学习时长 -->
                <div style="margin-bottom:12px;">
                    <div style="font-size:13px;opacity:0.9;margin-bottom:8px;">学习时长：</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <button onclick="adjustTime(-10)" style="width:36px;height:36px;background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;font-size:18px;cursor:pointer;">-</button>
                        <span id="studyTime" style="font-size:20px;font-weight:bold;min-width:80px;text-align:center;">60分钟</span>
                        <button onclick="adjustTime(10)" style="width:36px;height:36px;background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;font-size:18px;cursor:pointer;">+</button>
                    </div>
                </div>
            </div>
            
            <!-- 标签选择 -->
            <div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:14px;font-weight:bold;margin-bottom:10px;">🏷️ 标签（可多选）</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;" id="tagSelector">
                    ${TAGS.map((tag, i) => `
                        <span onclick="toggleTag(${i})" id="tag_${i}" style="padding:6px 12px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;transition:all 0.2s;">${tag}</span>
                    `).join('')}
                </div>
            </div>
            
            <!-- 日记输入 -->
            <div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <input type="text" id="diaryTitle" placeholder="📌 标题（今天学了什么？）" style="width:100%;padding:12px;margin-bottom:12px;border:1px solid #eee;border-radius:10px;font-size:14px;box-sizing:border-box;">
                <textarea id="diaryContent" placeholder="✍️ 写下今天的学习心得、收获、遇到的问题..." style="width:100%;height:120px;padding:12px;border:1px solid #eee;border-radius:10px;font-size:14px;resize:vertical;box-sizing:border-box;font-family:inherit;line-height:1.6;"></textarea>
                <button onclick="saveDiaryEntry()" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;">💾 保存日记</button>
            </div>
            
            <!-- 搜索和筛选 -->
            <div style="display:flex;gap:10px;margin-bottom:16px;">
                <input type="text" id="diarySearch" placeholder="🔍 搜索日记..." style="flex:1;padding:10px 14px;border:1px solid #eee;border-radius:10px;font-size:13px;" oninput="searchDiary()">
            </div>
            
            <!-- 日记列表 -->
            <div id="diaryList">
                ${renderDiaryList(diary)}
            </div>
            
            <!-- 统计 -->
            <div style="margin-top:20px;background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 学习统计</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                    <div>
                        <div style="font-size:22px;font-weight:bold;color:#667eea;">${diary.length}</div>
                        <div style="font-size:11px;color:#999;">篇日记</div>
                    </div>
                    <div>
                        <div style="font-size:22px;font-weight:bold;color:#4caf50;">${Math.round(diary.reduce((sum, d) => sum + (d.duration || 60), 0) / 60)}</div>
                        <div style="font-size:11px;color:#999;">总小时</div>
                    </div>
                    <div>
                        <div style="font-size:22px;font-weight:bold;color:#ff9800;">${new Set(diary.map(d => new Date(d.timestamp).toDateString())).size}</div>
                        <div style="font-size:11px;color:#999;">学习天数</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 初始化选中状态
    window.selectedMood = -1;
    window.selectedTags = [];
    window.studyMinutes = 60;
}

function renderDiaryList(diary) {
    if (diary.length === 0) {
        return '<div style="text-align:center;padding:40px;color:#999;">📝 还没有日记，开始记录今天的学习吧！</div>';
    }
    
    return diary.map((entry, index) => {
        const mood = entry.mood >= 0 && entry.mood < MOODS.length ? MOODS[entry.mood] : null;
        return `
            <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                    <div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            ${mood ? `<span style="font-size:18px;">${mood.emoji}</span>` : ''}
                            <span style="font-weight:bold;font-size:15px;">${entry.title || '无标题'}</span>
                        </div>
                        <div style="font-size:12px;color:#999;">
                            ${formatDate(entry.timestamp)} · ⏱️ ${entry.duration || 60}分钟
                        </div>
                    </div>
                    <button onclick="deleteDiary(${index})" style="padding:6px 10px;background:#f5f5f5;color:#f44336;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
                </div>
                
                ${entry.tags && entry.tags.length > 0 ? `
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                        ${entry.tags.map(t => `<span style="padding:4px 8px;background:#e8eaf6;color:#667eea;border-radius:12px;font-size:11px;">${TAGS[t]}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div style="color:#555;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">${escapeHtml(entry.content)}</div>
            </div>
        `;
    }).join('');
}

function selectMood(index) {
    if (window.selectedMood >= 0) {
        const prev = document.getElementById(`mood_${window.selectedMood}`);
        if (prev) {
            prev.style.background = 'rgba(255,255,255,0.2)';
            prev.style.transform = 'scale(1)';
        }
    }
    
    if (window.selectedMood === index) {
        window.selectedMood = -1;
    } else {
        window.selectedMood = index;
        const el = document.getElementById(`mood_${index}`);
        if (el) {
            el.style.background = 'rgba(255,255,255,0.5)';
            el.style.transform = 'scale(1.15)';
        }
    }
}

function toggleTag(index) {
    const idx = window.selectedTags.indexOf(index);
    const el = document.getElementById(`tag_${index}`);
    
    if (idx >= 0) {
        window.selectedTags.splice(idx, 1);
        el.style.background = '#f5f5f5';
        el.style.color = '#666';
    } else {
        window.selectedTags.push(index);
        el.style.background = '#667eea';
        el.style.color = 'white';
    }
}

function adjustTime(delta) {
    window.studyMinutes = Math.max(10, Math.min(480, window.studyMinutes + delta));
    const el = document.getElementById('studyTime');
    if (el) el.textContent = `${window.studyMinutes}分钟`;
}

function saveDiaryEntry() {
    const title = document.getElementById('diaryTitle').value.trim();
    const content = document.getElementById('diaryContent').value.trim();
    
    if (!content) {
        window.showToast('请写下日记内容~');
        return;
    }
    
    const diary = loadDiary();
    diary.unshift({
        title: title,
        content: content,
        mood: window.selectedMood,
        tags: [...window.selectedTags],
        duration: window.studyMinutes,
        timestamp: Date.now()
    });
    saveDiary(diary);
    
    window.showToast('✅ 日记已保存！');
    renderNotepad(document.getElementById('fullscreen-content'));
}

function deleteDiary(index) {
    if (!confirm('确定要删除这篇日记吗？')) return;
    
    const diary = loadDiary();
    diary.splice(index, 1);
    saveDiary(diary);
    
    window.showToast('已删除');
    renderNotepad(document.getElementById('fullscreen-content'));
}

function searchDiary() {
    const keyword = document.getElementById('diarySearch').value.toLowerCase().trim();
    const diary = loadDiary();
    
    let filtered = diary;
    if (keyword) {
        filtered = diary.filter(d => 
            (d.title && d.title.toLowerCase().includes(keyword)) ||
            d.content.toLowerCase().includes(keyword)
        );
    }
    
    document.getElementById('diaryList').innerHTML = renderDiaryList(filtered);
}

// 挂载到window
window.renderNotepad = renderNotepad;
window.selectMood = selectMood;
window.toggleTag = toggleTag;
window.adjustTime = adjustTime;
window.saveDiaryEntry = saveDiaryEntry;
window.deleteDiary = deleteDiary;
window.searchDiary = searchDiary;

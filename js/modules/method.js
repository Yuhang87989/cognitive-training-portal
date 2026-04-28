// ====== method模块 ======
// 版本: V140

CTM.registerModule('method', {
    name: 'method',
    icon: '🎯',
    render: renderMethod
});

function renderMethod(container) {
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">💡 学霸方法 <span style="font-size:12px;color:#999;">高效学习技巧</span></h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">掌握科学学习方法，事半功倍！</p>
            
            <!-- 学习方法分类 -->
            <div class="subject-tab" style="flex-wrap:wrap;margin-bottom:16px;">
                <button class="subject-tab-btn active" onclick="filterMethod('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterMethod('费曼学习法', this)">费曼学习</button>
                <button class="subject-tab-btn" onclick="filterMethod('番茄工作法', this)">番茄工作</button>
                <button class="subject-tab-btn" onclick="filterMethod('艾宾浩斯', this)">遗忘曲线</button>
                <button class="subject-tab-btn" onclick="filterMethod('思维导图', this)">思维导图</button>
                <button class="subject-tab-btn" onclick="filterMethod('康奈尔', this)">康奈尔</button>
                <button class="subject-tab-btn" onclick="filterMethod('SQ3R', this)">SQ3R</button>
                <button class="subject-tab-btn" onclick="filterMethod('时间管理', this)">时间管理</button>
            </div>
        </div>
        
        <!-- 学习统计 -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#1A6BFF;" id="method-completed">0</div>
                <div style="font-size:12px;color:#666;">已完成</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#4CAF50;" id="method-accuracy">0%</div>
                <div style="font-size:12px;color:#666;">正确率</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF9800;" id="method-notes">0</div>
                <div style="font-size:12px;color:#666;">我的笔记</div>
            </div>
        </div>
        
        <!-- 上传笔记区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传学习笔记</div>
            <div class="upload-zone" onclick="document.getElementById('method-note-input').click()">
                <div class="upload-icon">📝</div>
                <div class="upload-text">点击上传笔记图片</div>
                <div class="upload-hint">支持 JPG、PNG 格式</div>
            </div>
            <input type="file" id="method-note-input" accept="image/*" style="display:none" onchange="handleMethodNoteUpload(this)">
            <div id="method-notes-list" style="margin-top:12px;"></div>
        </div>
        
        <!-- 练习题目区域 -->
        <div id="method-questions-container">
            ${renderMethodQuestions()}
        </div>
    `;
    
    // 更新统计数据
    updateMethodStats();
    // 渲染笔记列表
    renderMethodNotes();
}

function renderMethodQuestions() {
    const questions = [
        {id:'feyman', title:'费曼学习法', icon:'📚', color:'#667eea', count:5},
        {id:'pomodoro', title:'番茄工作法', icon:'🍅', color:'#FF6B6B', count:5},
        {id:'ebbinghaus', title:'艾宾浩斯遗忘曲线', icon:'🧠', color:'#4CAF50', count:5},
        {id:'mindmap', title:'思维导图法', icon:'🗺️', color:'#FF9800', count:5},
        {id:'cornell', title:'康奈尔笔记法', icon:'📝', color:'#9C27B0', count:5},
        {id:'sq3r', title:'SQ3R阅读法', icon:'📖', color:'#00BCD4', count:5},
        {id:'timeManagement', title:'时间管理法', icon:'⏰', color:'#E91E63', count:5}
    ];
    
    return questions.map(q => `
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size:32px;background:${q.color};width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;">${q.icon}</div>
                    <div>
                        <div style="font-size:15px;font-weight:600;">${q.title}</div>
                        <div style="font-size:12px;color:#999;">${q.count}道练习题</div>
                    </div>
                </div>
                <button onclick="startMethodQuiz('${q.id}')" style="background:${q.color};color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">开始练习</button>
            </div>
            <div style="background:#f5f7ff;border-radius:8px;padding:12px;">
                <div style="font-size:12px;color:#666;margin-bottom:8px;">练习进度</div>
                <div style="height:6px;background:#e0e0e0;border-radius:3px;">
                    <div style="height:100%;background:${q.color};border-radius:3px;width:0%;" id="progress-${q.id}"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMethodNotes() {
    const user = getCurrentUserData();
    const notes = user?.methodNotes || [];
    const listEl = document.getElementById('method-notes-list');
    
    if (!listEl) return;
    
    if (notes.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无笔记</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 个笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.map(note => `
                <div style="position:relative;">
                    <img src="${note.image}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="viewMethodNote('${note.id}')">
                    <button onclick="deleteMethodNote('${note.id}')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

window.renderMethod = renderMethod;
window.renderMethodQuestions = renderMethodQuestions;
window.renderMethodNotes = renderMethodNotes;

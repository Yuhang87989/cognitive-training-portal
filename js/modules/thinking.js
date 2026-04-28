// ====== thinking模块 ======
// 版本: V140

CTM.registerModule('thinking', {
    name: 'thinking',
    icon: '🎯',
    render: renderThinking
});

function renderThinking(container) {
    const user = getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const thinkingTypes = [
        {id:'logic',icon:'🧮',name:'逻辑思维',desc:'推理与分析',color:'#667eea'},
        {id:'creative',icon:'🎨',name:'创意思维',desc:'创新与想象',color:'#f5576c'},
        {id:'critical',icon:'🔍',name:'批判思维',desc:'质疑与判断',color:'#4facfe'},
        {id:'system',icon:'🌐',name:'系统思维',desc:'全局与关联',color:'#43e97b'},
        {id:'reverse',icon:'🔄',name:'逆向思维',desc:'反向思考',color:'#fa709a'},
        {id:'divergent',icon:'💫',name:'发散思维',desc:'多向探索',color:'#fee140'},
        {id:'converge',icon:'🎯',name:'收敛思维',desc:'聚焦归纳',color:'#a8edea'},
        {id:'spatial',icon:'🎲',name:'空间思维',desc:'立体想象',color:'#d299c2'},
        {id:'abstract',icon:'🔷',name:'抽象思维',desc:'本质概括',color:'#ffecd2'}
    ];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🧩 思维训练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">八大思维能力全面提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
                ${thinkingTypes.map(t => `
                    <div style="background:linear-gradient(135deg,${t.color},${t.color}dd);color:white;padding:14px;border-radius:12px;cursor:pointer;" onclick="showThinkingType('${t.id}')">
                        <div style="font-size:18px;margin-bottom:6px;">${t.icon}</div>
                        <div style="font-size:13px;font-weight:600;">${t.name}</div>
                        <div style="font-size:10px;opacity:0.9;margin-top:3px;">${t.desc}</div>
                        <div style="font-size:11px;margin-top:6px;opacity:0.8;">${thinkingQuestions[t.id].length}题</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📊 思维训练统计</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;" id="thinking-completed">${totalCompleted}</div>
                    <div style="font-size:11px;color:#666;">已完成</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;" id="thinking-accuracy">${totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%'}</div>
                    <div style="font-size:11px;color:#666;">正确率</div>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📝 学习笔记</h4>
            <div style="margin-bottom:12px;">
                <label class="upload-btn" style="display:inline-block;padding:10px 16px;background:#1A6BFF;color:white;border-radius:8px;cursor:pointer;font-size:13px;">
                    📤 上传笔记
                    <input type="file" accept="image/*" style="display:none" onchange="handleThinkingNoteUpload(this)">
                </label>
            </div>
            <div id="thinking-notes-list"></div>
        </div>
    `;
    
    renderThinkingNotes();
}

function renderThinkingNotes() {
    const user = getCurrentUserData();
    const notes = user?.thinkingNotes || [];
    const listEl = document.getElementById('thinking-notes-list');
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
                    <img src="${note.image}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="viewThinkingNote('${note.id}')">
                    <button onclick="deleteThinkingNote('${note.id}')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

window.renderThinking = renderThinking;
window.renderThinkingNotes = renderThinkingNotes;

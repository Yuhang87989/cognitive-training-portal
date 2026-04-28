// 版本: V140

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

function submitThinkingAnswers(type, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = thinkingQuestions[type];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">第 ${page + 1} / ${totalPages} 页</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => {
                let userAnswer = '';
                let isCorrect = false;
                
                if (q.opts) {
                    const optsContainer = document.getElementById(`opts-${idx}`);
                    const selectedOpt = optsContainer?.querySelector('.thinking-opt[style*="background: rgb(227, 242, 253)"]') || optsContainer?.querySelector('.thinking-opt[data-selected]');
                    const selectedIdx = selectedOpt?.dataset?.selected;
                    userAnswer = selectedIdx !== undefined ? q.opts[selectedIdx] : '未作答';
                    isCorrect = selectedIdx == q.a;
                } else {
                    const input = document.getElementById(`thinking-answer-${idx}`);
                    userAnswer = input?.value?.trim() || '未作答';
                    isCorrect = userAnswer !== '未作答' && userAnswer.length > 5;
                }
                
                return `
                    <div style="margin-bottom:16px;">
                        <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题：${q.q}</div>
                        <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                            <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                            <div style="font-size:13px;color:#333;line-height:1.5;">${userAnswer}</div>
                        </div>
                        ${q.a !== undefined ? `
                            <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                                <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                                <div style="font-size:13px;color:#333;line-height:1.5;">${q.opts ? q.opts[q.a] : q.a}</div>
                            </div>
                        ` : ''}
                        <div style="display:flex;gap:8px;">
                            <button onclick="rateThinkingAnswer('${type}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                            <button onclick="rateThinkingAnswer('${type}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                        </div>
                        <button onclick="analyzeThinkingWithAI('${type}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                        <div id="thinking-ai-result-${type}-${startIndex + idx}" style="margin-top:8px;"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startThinkingQuiz('${type}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function showThinkingType(type) {
    currentThinkingType = type;
    currentThinkingPage[type] = 0;
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const typeIcons = {
        logic: '🧮', creative: '🎨', critical: '🔍', system: '🌐',
        reverse: '🔄', divergent: '💫', converge: '🎯', spatial: '🎲',
        abstract: '🔷'
    };
    
    const typeDescs = {
        logic: '培养逻辑推理能力，学会从已知条件推导结论。',
        creative: '激发创造力，培养发散思维和创新意识。',
        critical: '学会质疑和独立思考，不盲从权威和流行观点。',
        system: '培养全局观，学会分析问题的系统性解决方案。',
        reverse: '从反面思考问题，寻找创新的解决路径。',
        divergent: '从一个点出发，探索多种可能性和答案。',
        converge: '从众多信息中提炼核心，找到最优解。',
        spatial: '培养空间想象力，理解立体和图形关系。',
        abstract: '学会透过现象看本质，提取事物核心特征。'
    };
    
    const questions = thinkingQuestions[type];
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${typeIcons[type]} ${typeNames[type]}训练</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}题 · 点击下方按钮开始练习
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;color:#333;margin-bottom:8px;"><strong>训练目标：</strong></div>
            <div style="font-size:13px;color:#666;line-height:1.6;">${typeDescs[type]}</div>
        </div>
        <button onclick="startThinkingQuiz('${type}', 0)" class="login-btn login-btn-primary" style="margin-bottom:8px;">开始练习</button>
        <button class="modal-close" onclick="closeModal()">返回</button>
    `;
}

function selectThinkingOpt(el, selectedIdx, questionIdx) {
    const parent = el.parentElement;
    parent.querySelectorAll('.thinking-opt').forEach(opt => {
        opt.style.background = 'white';
        opt.style.borderColor = '#e0e0e0';
    });
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    el.dataset.selected = selectedIdx;
}

function rateThinkingAnswer(type, isCorrect, questionIdx) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingStats) user.thinkingStats = {};
    if (!user.thinkingStats[type]) user.thinkingStats[type] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    if (!user.thinkingStats[type].answeredQuestions.includes(questionIdx)) {
        user.thinkingStats[type].completed++;
        if (isCorrect) user.thinkingStats[type].correct++;
        user.thinkingStats[type].answeredQuestions.push(questionIdx);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = thinkingQuestions[type];
        const question = questions[questionIdx];
        const typeNames = {
            logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
            reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
            abstract: '抽象思维'
        };
        if (question) {
            const wrongKey = 'thinking-' + type + '-' + questionIdx;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'thinking',
                    sourceName: typeNames[type] || '思维训练',
                    topicId: questionIdx,
                    question: question.q,
                    answer: question.opts ? question.opts[question.a] : question.a,
                    explanation: '参考答案：' + (question.opts ? question.opts[question.a] : question.a),
                    userAnswer: '回答错误',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateThinkingStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
}

function updateThinkingStats() {
    const user = getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('thinking-completed');
    const accuracyEl = document.getElementById('thinking-accuracy');
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
}

function handleThinkingNoteUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast('请上传图片文件');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingNotes) user.thinkingNotes = [];
    
    const imageUrl = URL.createObjectURL(file);
    user.thinkingNotes.push({
        id: 'thinking-note-' + Date.now(),
        image: imageUrl,
        name: file.name,
        uploadTime: new Date().toLocaleString()
    });
    syncUserData(user);
    showToast('笔记上传成功！');
    renderThinkingNotes();
}

function viewThinkingNote(noteId) {
    const user = getCurrentUserData();
    const note = user?.thinkingNotes?.find(n => n.id === noteId);
    if (!note) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📝 思维训练笔记</div>
        <img src="${note.image}" style="width:100%;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#999;margin-bottom:16px;">上传时间：${note.uploadTime}</div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function deleteThinkingNote(noteId) {
    if (!confirm('确定删除这个笔记吗？')) return;
    const user = getCurrentUserData();
    user.thinkingNotes = user.thinkingNotes.filter(n => n.id !== noteId);
    syncUserData(user);
    renderThinkingNotes();
    showToast('笔记已删除');
}


// ============================================================
// Podcast - 播客模块
// ============================================================
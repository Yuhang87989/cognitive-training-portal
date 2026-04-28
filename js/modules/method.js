// 版本: V140

function showConserveQuestion() {
    const data = window._conserveData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#a18cd1,#fbc2eb)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:12px;">⚖️ 守恒推理</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:15px;margin:16px 0;padding:16px;background:rgba(255,255,255,0.5);border-radius:16px;line-height:1.5;">' + q.q + '</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="conserveAnswer(' + i + ')" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;">' + opt + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function showMethodDetail(id) {
    const m = methodDetails[id];
    if (!m) return;
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:48px;margin-bottom:8px;">${m.title.split(' ')[0]}</div>
            <div style="font-size:18px;font-weight:bold;">${m.title.split(' ').slice(1).join(' ')}</div>
        </div>
        <div style="background:#f5f7ff;padding:12px;border-radius:10px;margin-bottom:16px;font-size:14px;">${m.desc}</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;">📋 具体步骤：</div>
        ${m.steps.map((s,i) => `<div style="display:flex;gap:10px;margin-bottom:8px;"><div style="width:22px;height:22px;background:var(--blue);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">${i+1}</div><div style="font-size:13px;color:var(--text-gray);">${s}</div></div>`).join('')}
        <div style="background:#fff3cd;padding:12px;border-radius:10px;font-size:12px;color:#856404;margin-top:16px;">${m.tip}</div>
        <button class="login-btn login-btn-primary" style="margin-top:16px;" onclick="closeDetail()">我学会了</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
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

function submitMethodAnswers(methodId, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = methodTrainingQuestions[methodId];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    // 收集所有答案
    const answers = [];
    let hasEmpty = false;
    
    for (let i = 0; i < pageQuestions.length; i++) {
        const input = document.getElementById(`method-answer-${i}`);
        const answer = input?.value?.trim() || '';
        if (!answer) hasEmpty = true;
        answers.push(answer);
    }
    
    if (hasEmpty && !confirm('有未填写的题目，确定提交吗？')) {
        return;
    }
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    // 显示答案对比
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${page + 1} / ${totalPages} 页
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="margin-bottom:16px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题：${q.q}
                    </div>
                    <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${answers[idx] || '<span style="color:#999;">未作答</span>'}</div>
                    </div>
                    <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${q.a}</div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="rateMethodAnswer('${methodId}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                        <button onclick="rateMethodAnswer('${methodId}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                    </div>
                    <button onclick="analyzeMethodWithAI('${methodId}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                    <div id="method-ai-result-${methodId}-${startIndex + idx}" style="margin-top:8px;"></div>
                </div>
            `).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
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


// ============================================================
// Thinking - 思维训练
// ============================================================
// ============================================================
// renderMethod - 学霸方法模块渲染
// ============================================================

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
        
        <!-- 返回按钮 -->
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
    `;
    
    // 更新统计数据
    updateMethodStats();
    // 渲染笔记列表
    renderMethodNotes();
}

// 渲染练习题目
function renderMethodQuestions() {
    const questions = [
        {id:'feyman', title:'费曼学习法', icon:'📚', color:'#667eea', count:5},
        {id:'pomodoro', title:'番茄工作法', icon:'🍅', color:'#FF6B6B', count:5},
        {id:'ebbinghaus', title:'艾宾浩斯遗忘曲线', icon:'🧠', color:'#4facfe', count:5},
        {id:'mindmap', title:'思维导图法', icon:'🗺️', color:'#43E97B', count:5},
        {id:'cornell', title:'康奈尔笔记法', icon:'📋', color:'#fa709a', count:5},
        {id:'sq3r', title:'SQ3R阅读法', icon:'📖', color:'#a18cd1', count:5},
        {id:'timeManagement', title:'时间管理法', icon:'⏰', color:'#f6d365', count:5},
        {id:'testStrategy', title:'考试技巧', icon:'📝', color:'#FF9A63', count:5}
    ];
    
    return `
        <div class="card">
            <h4 style="margin-bottom:12px;">📝 选择学习方法开始练习</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${questions.map(q => `
                    <div onclick="openMethodQuestions('${q.id}')" style="background:${q.color};color:white;padding:16px;border-radius:16px;cursor:pointer;text-align:center;">
                        <div style="font-size:28px;margin-bottom:8px;">${q.icon}</div>
                        <div style="font-size:14px;font-weight:600;">${q.title}</div>
                        <div style="font-size:11px;opacity:0.9;margin-top:4px;">${q.count}道练习题</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openMethodQuestions(methodId) {
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法',
        noteTaking: '笔记技巧',
        testStrategy: '考试技巧'
    };
    
    const methodIcons = {
        feyman: '📚', pomodoro: '🍅', ebbinghaus: '🧠',
        mindmap: '🗺️', cornell: '📋', sq3r: '📖',
        timeManagement: '⏰', noteTaking: '📝', testStrategy: '✍️'
    };
    
    const questions = methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('该学习方法暂无练习题');
        return;
    }
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">${methodIcons[methodId] || '📖'} ${methodNames[methodId] || methodId}</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}道练习题
        </div>
        <div id="method-questions-list" style="max-height:400px;overflow-y:auto;">
            ${questions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:12px;">${q.q}</div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的理解或答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', 0)" class="login-btn login-btn-primary" style="margin-top:12px;width:100%;">提交答案</button>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;width:100%;">返回</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

function submitMethodAnswers(methodId, page) {
    SoundEffects.playSubmit();
    
    const questions = methodTrainingQuestions[methodId];
    if (!questions) return;
    
    const answers = [];
    let hasEmpty = false;
    
    for (let i = 0; i < questions.length; i++) {
        const input = document.getElementById('method-answer-' + i);
        const answer = input?.value?.trim() || '';
        if (!answer) hasEmpty = true;
        answers.push(answer);
    }
    
    if (hasEmpty && !confirm('有未填写的题目，确定提交吗？')) {
        return;
    }
    
    const methodNames = {
        feyman: '费曼学习法', pomodoro: '番茄工作法', ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法', cornell: '康奈尔笔记法', sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法', noteTaking: '笔记技巧', testStrategy: '考试技巧'
    };
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId] || methodId} - 答案对比</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${questions.map((q, idx) => `
                <div style="margin-bottom:16px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${idx + 1}题：${q.q}
                    </div>
                    <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${answers[idx] || '<span style="color:#999;">未作答</span>'}</div>
                    </div>
                    <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${q.a}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="modal-close" onclick="closeModal()" style="width:100%;">关闭</button>
    `;
    
    // 更新统计
    updateMethodStats();
}

function updateMethodStats() {
    const user = getCurrentUserData();
    const stats = user?.methodStats || {};
    
    let totalCompleted = 0;
    let totalAnswered = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalAnswered += s.answered || 0;
    });
    
    const completedEl = document.getElementById('method-completed');
    const accuracyEl = document.getElementById('method-accuracy');
    const notesEl = document.getElementById('method-notes');
    
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalAnswered > 0 ? Math.round(totalCompleted / totalAnswered * 100) + '%' : '0%';
    if (notesEl) notesEl.textContent = user?.methodNotes?.length || 0;
}

function filterMethod(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // 重新渲染题目列表
    const container = document.getElementById('method-questions-container');
    if (container) {
        container.innerHTML = renderMethodQuestions();
    }
}

function handleMethodNoteUpload(input) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const user = getCurrentUserData();
        user.methodNotes = user.methodNotes || [];
        user.methodNotes.push({
            id: Date.now(),
            image: e.target.result,
            time: Date.now()
        });
        syncUserData(user);
        showToast('笔记上传成功！');
        renderMethodNotes();
        input.value = '';
    };
    reader.readAsDataURL(file);
}

function renderMethodNotes() {
    const container = document.getElementById('method-notes-list');
    if (!container) return;
    
    const user = getCurrentUserData();
    const notes = user?.methodNotes || [];
    
    if (notes.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <div style="font-size:13px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 张笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.slice().reverse().slice(0, 6).map(n => `
                <div style="position:relative;">
                    <img src="${n.image}" style="width:100%;height:60px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="showMethodNote('${n.image}')"/>
                </div>
            `).join('')}
        </div>
    `;
}

function showMethodNote(image) {
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📷 笔记预览</div>
        <img src="${image}" style="width:100%;border-radius:12px;"/>
        <button class="modal-close" onclick="closeModal()" style="margin-top:12px;width:100%;">关闭</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

// 导出函数到window
window.renderMethod = renderMethod;
window.openMethodQuestions = openMethodQuestions;
window.submitMethodAnswers = submitMethodAnswers;
window.updateMethodStats = updateMethodStats;
window.filterMethod = filterMethod;
window.handleMethodNoteUpload = handleMethodNoteUpload;
window.renderMethodNotes = renderMethodNotes;
window.showMethodNote = showMethodNote;


// ============================================================
// 从V139提取的缺失函数
// ============================================================

function startMethodQuiz(methodId, page = 0) {
    const questions = methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    // 初始化页码
    if (!currentMethodPage[methodId]) currentMethodPage[methodId] = 0;
    if (page !== undefined) currentMethodPage[methodId] = page;
    
    const currentPage = currentMethodPage[methodId];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题
                    </div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">
                        ${q.q}
                    </div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function rateMethodAnswer(methodId, isCorrect, questionIndex) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.methodStats) user.methodStats = {};
    if (!user.methodStats[methodId]) user.methodStats[methodId] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    // 避免重复统计同一题
    if (!user.methodStats[methodId].answeredQuestions.includes(questionIndex)) {
        user.methodStats[methodId].completed++;
        if (isCorrect) user.methodStats[methodId].correct++;
        user.methodStats[methodId].answeredQuestions.push(questionIndex);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = methodTrainingQuestions[methodId];
        const question = questions[questionIndex];
        if (question) {
            const wrongKey = 'method-' + methodId + '-' + questionIndex;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'method',
                    sourceName: '学霸方法',
                    topicId: questionIndex,
                    question: question.q,
                    answer: question.a,
                    explanation: '参考答案：' + question.a,
                    userAnswer: '未达标',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateMethodStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
}

async function analyzeMethodWithAI(methodId, questionIdx) {
    try {
        const questions = methodTrainingQuestions[methodId];
        if (!questions || !questions[questionIdx]) {
            showToast('题目数据不存在');
            return;
        }
        const q = questions[questionIdx];
        const resultId = 'method-ai-result-' + methodId + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (!resultEl) {
            showToast('结果区域未找到，请重新打开此模块');
            return;
        }
        resultEl.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在深度分析中...</div></div>';

        const prompt = '请详细讲解这道学习方法题目：\n题目：' + q.q + '\n' + (q.a ? '参考答案：' + q.a : '') + '\n\n请提供：\n1. 知识点分析\n2. 详细解题步骤\n3. 易错点提示\n4. 举一反三的类似题目（2-3道）';

        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { role: 'system', content: '你是一位专业的青少年教育辅导老师，擅长详细讲解学习方法题目，帮助学生理解知识点并举一反三。请用简洁易懂的语言回答。' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (response.status === 402) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足，请先充值后再使用AI功能<br><button onclick="showDeepSeekBalanceAlert()" style="margin-top:8px;padding:6px 16px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            return;
        }

        const data = await response.json();
        const aiContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'AI分析失败，请稍后重试';

        resultEl.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:400px;overflow-y:auto;">' +
            '<div style="font-size:12px;color:#667eea;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:4px;">🤖 AI深度分析</div>' +
            '<div style="font-size:14px;line-height:1.8;color:#333;">' + aiContent.replace(/\n/g, '<br>') + '</div>' +
            '</div>';
    } catch (err) {
        const resultId = 'method-ai-result-' + methodId + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (resultEl) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">AI分析失败，请检查网络连接</div>';
        }
    }
}

function conserveAnswer(idx) {
    const data = window._conserveData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showConserveQuestion();
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('show'); }

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}


// ============================================================
// Window Exports
// ============================================================
window.startMethodQuiz = startMethodQuiz;
window.rateMethodAnswer = rateMethodAnswer;
window.analyzeMethodWithAI = analyzeMethodWithAI;
window.conserveAnswer = conserveAnswer;
window.closeDetail = closeDetail;
window.closeModal = closeModal;
window.startThinkingQuiz = startThinkingQuiz;
window.rateThinkingAnswer = rateThinkingAnswer;
window.analyzeThinkingWithAI = analyzeThinkingWithAI;

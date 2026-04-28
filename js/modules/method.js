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
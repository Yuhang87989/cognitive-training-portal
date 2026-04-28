// 版本: V140

const methodTrainingQuestions = {
    feyman: [
        {q:'用费曼学习法解释"光合作用"',a:'把植物比作工厂，叶绿素是工人，阳光是能量，产出葡萄糖和O₂'},
        {q:'用费曼学习法解释"欧姆定律"',a:'把电流比作水流，电压比作水压，电阻比作管道粗细'},
        {q:'用费曼学习法解释"通货膨胀"',a:'钱像蛋糕，定量时每块大；多印钱后蛋糕变大，每块变小了'},
        {q:'用费曼学习法解释"光的折射"',a:'把光比喻成军队过河，垂直走最快，斜着走会变向'},
        {q:'用费曼学习法解释"自然选择"',a:'长颈鹿脖子长的能吃到树叶活下来，短脖子的饿死'}
    ],
    pomodoro: [
        {q:'为什么番茄工作法建议25分钟为一个周期？',a:'研究表明，成人注意力集中时间约为25分钟'},
        {q:'番茄工作法中"5分钟休息"应该做什么？',a:'离开工作区，活动身体，远眺放松'},
        {q:'如何处理番茄工作法中被中断的情况？',a:'记录中断，评估紧急程度，紧急则停止'},
        {q:'为什么每4个番茄钟后要长休息？',a:'大脑需要更长时间的放松来巩固学习成果'},
        {q:'如何确定适合自己的番茄时长？',a:'从25分钟开始测试，逐渐调整'}
    ],
    ebbinghaus: [
        {q:'艾宾浩斯遗忘曲线告诉我们什么规律？',a:'遗忘速度先快后慢'},
        {q:'为什么"临时抱佛脚"效果不好？',a:'没有按遗忘曲线复习，知识会快速遗忘'},
        {q:'如何用艾宾浩斯记忆法背单词？',a:'设定复习时间点：1天、3天、7天、14天、30天复习'},
        {q:'艾宾浩斯记忆法的核心是什么？',a:'在即将遗忘时复习，加深记忆痕迹'},
        {q:'为什么间隔重复比集中复习更有效？',a:'间隔让大脑需要"努力"回忆，记忆更持久'}
    ],
    mindmap: [
        {q:'思维导图为什么比线性笔记更有效？',a:'符合大脑放射性思维，刺激多感官'},
        {q:'如何选择思维导图的中心主题？',a:'选择最核心的概念或问题'},
        {q:'思维导图每个分支应放几个关键词？',a:'每个分支1个关键词，最多不超过4个'},
        {q:'为什么思维导图要用不同颜色？',a:'颜色帮助区分主题，刺激视觉记忆'},
        {q:'思维导图的层次如何规划？',a:'主分支→子分支→孙分支，不超过5层'}
    ],
    cornell: [
        {q:'康奈尔笔记法的三区域分别记录什么？',a:'右侧：详细笔记；左侧：关键词；底部：总结'},
        {q:'康奈尔笔记法什么时候复习效果最好？',a:'课后24小时内'},
        {q:'如何用康奈尔笔记法进行自测？',a:'遮住右侧笔记，尝试回忆完整内容'},
        {q:'康奈尔笔记法适合哪些场景？',a:'课堂笔记、读书笔记、讲座记录'},
        {q:'为什么康奈尔笔记法能提高学习效率？',a:'主动回忆比被动阅读更有效'}
    ],
    sq3r: [
        {q:'SQ3R中"Survey"阶段的目的是什么？',a:'快速了解文章结构和主要内容'},
        {q:'为什么要在阅读前先提出问题？',a:'带着问题阅读更有针对性'},
        {q:'SQ3R中"Recite"阶段应该如何做？',a:'合上书本，用自己的话复述主要内容'},
        {q:'为什么"Review"阶段很重要？',a:'巩固记忆，查漏补缺'},
        {q:'SQ3R阅读法与传统阅读相比有什么优势？',a:'更主动、更系统、记忆更深'}
    ],
    timeManagement: [
        {q:'如何区分"重要"和"紧急"的事？',a:'重要：不紧急但有价值；紧急：需要立即处理'},
        {q:'根据四象限法则，应该优先处理哪类事务？',a:'重要且紧急的事'},
        {q:'为什么制定每日计划能提高效率？',a:'明确目标，减少决策时间'},
        {q:'如何利用"碎片时间"学习？',a:'背单词、听音频、回忆知识点'},
        {q:'睡前复习为什么效果好？',a:'睡眠时大脑会自动整理和巩固学习内容'}
    ],
    noteTaking: [
        {q:'高效笔记的三个原则是什么？',a:'简洁、结构化、有个人思考'},
        {q:'为什么课堂笔记不是越多越好？',a:'记太多会错过讲解'},
        {q:'如何让笔记更有条理？',a:'使用编号、颜色、符号'},
        {q:'课后如何整理笔记？',a:'补充完整、标注重难点'},
        {q:'电子笔记和手写笔记各有什么优势？',a:'电子：易搜索；手写：加深记忆'}
    ],
    testStrategy: [
        {q:'考试时遇到不会的题应该怎么办？',a:'先跳过，确保会做的题不丢分'},
        {q:'为什么先浏览试卷再答题是个好策略？',a:'了解题目分布和难度，合理分配时间'},
        {q:'选择题有哪些答题技巧？',a:'排除法、对比法、验证法'},
        {q:'如何检查才能减少错题？',a:'重新读题、换角度思考'},
        {q:'考前复习应该如何安排？',a:'先全面后重点'}
    ]
};

const methodDetails = {
    feyman: {title:'🧠 费曼学习法',desc:'把学到的知识用自己的话讲给别人听，如果别人能听懂，说明你真正掌握了。',steps:['选择一个你想要理解的概念','想象你要把这个概念教给一个完全不懂的人','如果讲解过程中卡住了，就回顾原始材料','用自己的话重新组织，确保通俗易懂'],tip:'💡 最佳实践：每天用费曼学习法复习一个知识点，坚持21天形成习惯。'},
    pomodoro: {title:'⏰ 番茄工作法',desc:'25分钟专注学习，5分钟休息，循环进行，提高效率。',steps:['选择一个待完成的任务','设定25分钟倒计时（一个番茄钟）','专注工作，中途不做其他事','计时结束后休息5分钟','每4个番茄钟后休息15-30分钟'],tip:'💡 建议：使用手机闹钟或专门的番茄钟APP来计时。'},
    ebbinghaus: {title:'🔄 艾宾浩斯记忆法',desc:'学习后1天、3天、7天、14天、30天分别复习，加深长期记忆。',steps:['初次学习新知识','24小时后进行第一次复习','3天后再复习一次','7天后第三次复习','14天后第四次复习','30天后最后一次复习'],tip:'💡 关键：严格按照时间节点复习，不要偷懒！'},
    mindmap: {title:'🎨 思维导图法',desc:'用图形和关键词将知识点连接起来，形成系统化的知识结构。',steps:['在纸中央写下核心主题','从中心向外画出主分支','在每个主分支写上关键词','从关键词继续延伸子分支','用不同颜色区分不同主题','添加图标和符号增强记忆'],tip:'💡 工具推荐：可以使用XMind、幕布等软件制作数字思维导图。'},
    cornell: {title:'📝 康奈尔笔记法',desc:'将笔记分为要点、线索、总结三个区域，提高复习效率。',steps:['把笔记页面分为三部分','右侧大的区域记录主要内容','左侧区域记录提示词/关键词','底部区域写总结和问题','用笔记时遮住右侧，回忆内容','用总结区进行自测'],tip:'💡 最佳使用场景：课堂笔记、读书笔记、讲座记录。'},

    timeManagement: {title:'⏱️ 时间管理法',desc:'合理安排学习时间，提高学习效率。',steps:['列出所有待办事项','按重要性和紧急性分类','设定每个任务的完成时间','使用番茄工作法保持专注','定期回顾和调整计划'],tip:'💡 建议：每天晚上规划第二天的任务，早上执行最重要的任务。'},
    noteTaking: {title:'📒 高效笔记法',desc:'科学记笔记，让学习更高效。',steps:['使用简洁的语言和缩写','用颜色区分重点内容','建立层次分明的结构','课后及时整理和补充','定期回顾和更新笔记'],tip:'💡 工具推荐：印象笔记、有道云笔记、Notion等。'},
    testStrategy: {title:'📝 考试策略',desc:'科学应考，减少失误，提高成绩。',steps:['先浏览试卷，了解题量和难度','按先易后难的顺序答题','遇到难题先跳过，不要卡住','留出时间检查会的题','注意答题规范和卷面整洁'],tip:'💡 关键：保持平和心态，相信自己的第一判断。'},
    sq3r: {title:'📖 SQ3R阅读法',desc:'Survey泛读、Question提问、Read阅读、Recite复述、Review复习。',steps:['Survey（泛读）：快速浏览标题、目录、图表','Question（提问）：写下你想知道的问题','Read（阅读）：仔细阅读章节内容','Recite（复述）：合上书复述要点','Review（复习）：定期回顾已读内容'],tip:'💡 适合：教科书、论文、长篇文章的阅读。'}
};


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
}function conserveAnswer(idx) {
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
window.methodTrainingQuestions = methodTrainingQuestions;
window.methodDetails = methodDetails;

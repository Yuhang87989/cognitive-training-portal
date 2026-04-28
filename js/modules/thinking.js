// 版本: V140 - 思维训练模块（从V139完整重建）

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
    
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
`;
    
    renderThinkingNotes();
}


const thinkingQuestions = {
    logic: [
        {q:'如果A>B，B>C，那么A和C的关系是？',opts:['A>C','A<C','A=C','无法确定'],a:0},
        {q:'找规律：2, 4, 8, 16, ?',opts:['20','24','32','30'],a:2},
        {q:'小明比小华高，小红比小华矮，谁最高？',opts:['小明','小华','小红','一样高'],a:0},
        {q:'所有鸟都会飞，企鹅是鸟，所以企鹅会飞吗？',opts:['会飞','不会飞','不确定','前提错误'],a:3},
        {q:'找规律：1, 1, 2, 3, 5, 8, ?',opts:['11','12','13','14'],a:2}
    ],
    creative: [
        {q:'列举砖头的5种创意用途',a:'建筑、垫脚石、装饰画、门挡、锤子、镇纸等'},
        {q:'如何让学习变得更有趣？说出你的3个想法',a:'游戏化学习、与朋友比赛、设立奖励机制等'},
        {q:'如果你是校长，会做哪些改变？',a:'增加户外活动、减少作业、开设兴趣班等'},
        {q:'一个空塑料瓶可以用来做什么？',a:'花瓶、笔筒、储物罐、漏斗、洒水器等'},
        {q:'如何让不爱学习的同学爱上学习？',a:'找到兴趣点、设定小目标、给予正向反馈等'}
    ],
    critical: [
        {q:'有人说"玩游戏浪费时间"，你同意吗？为什么？',a:'需分析游戏的利弊，适度游戏可锻炼思维、反应能力，过度沉迷才有害'},
        {q:'新闻说"XX公司业绩增长200%"，你怎么看这个数据？',a:'需了解基数、增长原因、是否可持续、有无水分等'},
        {q:'"学好数学就能赚大钱"这个观点对吗？',a:'过于绝对，数学是基础，但赚钱还需其他能力如沟通、创新等'},
        {q:'广告说"喝了这杯饮料就能变聪明"，可信吗？',a:'不可信，没有食物能直接提高智商，只能提供营养支持'},
        {q:'有人说"成绩好的学生都自私"，你怎么看？',a:'以偏概全，成绩和品格无关，很多优秀学生乐于助人'}
    ],
    system: [
        {q:'分析学校食堂存在的问题及解决方案',a:'问题：排队久、菜品少、卫生差等；解决：增加窗口、丰富菜单、加强监管等'},
        {q:'如何优化你的学习方法？请系统分析',a:'诊断问题→寻找方法→制定计划→执行反馈→持续改进'},
        {q:'分析交通拥堵的原因和解决思路',a:'原因：车多路少、信号灯不合理、事故等；解决：限行、修路、智能交通等'},
        {q:'如何提高班级的学习氛围？',a:'树立榜样、小组竞赛、奖励机制、定期分享、互帮互助等'},
        {q:'分析青少年近视率上升的原因和对策',a:'原因：用眼过度、户外活动少、电子产品等；对策：控制时间、增加户外、定期检查等'}
    ],
    reverse: [
        {q:'用逆向思维解决：如何让课堂更安静？',a:'逆向思考：让学生想说话时必须说话，设置讨论时间，反而会更珍惜安静时间'},
        {q:'如何用逆向思维提高学习成绩？',a:'先分析为什么成绩差，从反面找原因：拖延、分心、方法不当，逐一解决'},
        {q:'用逆向思维：如何让更多人参加活动？',a:'不宣传活动的优点，而是宣传不参加会错过什么，制造稀缺感'},
        {q:'逆向思考：如何减少上课走神？',a:'不是强迫自己不走神，而是允许短时间走神，但设置"走神闹钟"提醒回来'},
        {q:'用逆向思维解决背单词难题',a:'不追求一次记住，而是允许忘记，用艾宾浩斯曲线在遗忘点复习'}
    ],
    divergent: [
        {q:'"圆"可以是什么？请说出10种可能',a:'太阳、月亮、钟表、盘子、球、车轮、硬币、眼睛、泡泡、甜甜圈等'},
        {q:'如何利用一根绳子？发散思考',a:'绑东西、跳绳、晾衣绳、翻花绳、测量工具、拉力训练、装饰品等'},
        {q:'说出水的10种用途',a:'饮用、洗漱、浇花、游泳、发电、灭火、制冰、烹饪、清洁、养鱼等'},
        {q:'"时间"像什么？请发散联想',a:'流水、沙漏、金钱、生命、火车、河流、季节、钟表、阳光、音乐等'},
        {q:'如何利用一个废弃纸箱？',a:'储物盒、猫窝、玩具屋、画板、包装盒、纸飞机、临时桌垫、堆叠玩具等'}
    ],
    converge: [
        {q:'怎样高效记忆英语单词？（收敛最优方案）',a:'词根词缀法+艾宾浩斯复习+语境记忆，三者结合效果最佳'},
        {q:'面对考试焦虑，最好的解决办法是什么？',a:'充分准备+正确认知+放松训练+作息调整，综合方案最有效'},
        {q:'如何提高阅读理解能力？收敛核心方法',a:'精读训练+关键词提取+总结归纳+背景知识积累'},
        {q:'解决数学难题的最佳策略是什么？',a:'理解题意→画图分析→找已知条件→选择方法→验算答案'},
        {q:'如何快速适应新环境？',a:'观察学习+主动交流+保持开放+制定计划+循序渐进'}
    ],
    spatial: [
        {q:'一个正方体有几个面、几条棱、几个顶点？',opts:['6面12棱8顶点','6面8棱12顶点','4面12棱8顶点','8面12棱6顶点'],a:0},
        {q:'从上面看是圆形，从侧面看是长方形，这是什么立体？',opts:['球体','圆柱','圆锥','长方体'],a:1},
        {q:'将一张正方形纸对折两次，剪一刀，展开后是什么形状？',a:'根据剪的位置不同，可能是星形、十字形或四边形'},
        {q:'一个立方体展开图有几种形式？',a:'11种基本形式，包括一字型、Z字型、L型等'},
        {q:'用6根火柴棒最多能摆出几个正三角形？',a:'4个（摆成正四面体，立体思维）'}
    ],
    abstract: [
        {q:'"学习"的本质是什么？请抽象概括',a:'信息的获取、处理、存储和应用的过程'},
        {q:'什么是"成功"的本质？抽象定义',a:'实现预期目标的过程和结果，包括个人成长和价值实现'},
        {q:'"友谊"的核心特征是什么？',a:'信任、互助、理解、尊重、情感连接'},
        {q:'抽象概括"考试"的本质功能',a:'检测知识掌握程度和学习效果的工具'},
        {q:'什么是"教育"的本质？',a:'促进人的全面发展，培养独立思考和解决问题能力'}
    ]
};

let currentThinkingType = 'logic';
let currentThinkingPage = {};

// 显示思维类型详情
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

// 开始做题（每页5题）
function startThinkingQuiz(type, page = 0) {
    const questions = thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

// 选择选项
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

// 提交全部答案
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

// 评价答案
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

// 更新统计
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

// 上传笔记
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

// 渲染笔记
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

// 查看/删除笔记
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


// Window exports
window.renderThinking = renderThinking;
window.showThinkingType = showThinkingType;
window.startThinkingQuiz = startThinkingQuiz;
window.selectThinkingOpt = selectThinkingOpt;
window.submitThinkingAnswer = submitThinkingAnswer;
window.renderThinkingNotes = renderThinkingNotes;
window.handleThinkingNoteUpload = handleThinkingNoteUpload;
window.deleteThinkingNote = deleteThinkingNote;
window.updateThinkingStats = updateThinkingStats;

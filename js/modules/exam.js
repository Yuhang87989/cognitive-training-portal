// 模拟考试模块
// 功能：随机出题、计时、打分、错题记录

function renderExam(container) {
    const data = window.loadData();
    const examData = data.examHistory || [];
    
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;">📝 模拟考试</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 考试模式选择 -->
            <div id="examMenu">
                <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    <h3 style="margin:0 0 16px 0;font-size:16px;">选择考试模式</h3>
                    
                    <div onclick="startQuickExam()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:12px;margin-bottom:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">⚡ 快速测验</div>
                        <div style="font-size:13px;opacity:0.9;">10道题 · 10分钟 · 随机科目</div>
                    </div>
                    
                    <div onclick="startSubjectExam('math')" style="background:linear-gradient(135deg,#f093fb,#f5576c);color:white;padding:20px;border-radius:12px;margin-bottom:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">🔢 数学专练</div>
                        <div style="font-size:13px;opacity:0.9;">15道题 · 20分钟</div>
                    </div>
                    
                    <div onclick="startSubjectExam('chinese')" style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;padding:20px;border-radius:12px;margin-bottom:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">📖 语文专练</div>
                        <div style="font-size:13px;opacity:0.9;">15道题 · 20分钟</div>
                    </div>
                    
                    <div onclick="startSubjectExam('english')" style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;padding:20px;border-radius:12px;margin-bottom:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">🔤 英语专练</div>
                        <div style="font-size:13px;opacity:0.9;">15道题 · 20分钟</div>
                    </div>
                    
                    <div onclick="window.renderPaperTool(document.getElementById('fullscreen-content'))" style="background:linear-gradient(135deg,#fa709a,#fee140);color:white;padding:20px;border-radius:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">📄 试卷工具</div>
                        <div style="font-size:13px;opacity:0.9;">仿真手写 · 擦除笔迹 · 还原试卷</div>
                    </div>
                </div>
                
                <!-- 历史记录 -->
                <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    <h3 style="margin:0 0 16px 0;font-size:16px;">📊 历史记录</h3>
                    ${examData.length === 0 ? 
                        '<div style="text-align:center;color:#999;padding:20px;">暂无考试记录</div>' :
                        examData.slice(0, 5).map((e, i) => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f0f0f0;">
                                <div>
                                    <div style="font-weight:bold;">${e.subjectName || '快速测验'}</div>
                                    <div style="font-size:12px;color:#999;">${new Date(e.time).toLocaleDateString()}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:18px;font-weight:bold;color:${e.score >= 80 ? '#4caf50' : e.score >= 60 ? '#ff9800' : '#f44336'};">${e.score}分</div>
                                    <div style="font-size:12px;color:#999;">${e.correct}/${e.total}题</div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <!-- 考试界面（默认隐藏） -->
            <div id="examInterface" style="display:none;">
            </div>
        </div>
    `;
}

// 题库
const EXAM_QUESTIONS = {
    math: [
        { q: '25 × 16 = ?', options: ['380', '400', '420', '440'], answer: 1 },
        { q: '144 ÷ 12 = ?', options: ['10', '11', '12', '13'], answer: 2 },
        { q: '36 × 25 = ?', options: ['800', '850', '900', '950'], answer: 2 },
        { q: '729 ÷ 9 = ?', options: ['79', '81', '83', '85'], answer: 1 },
        { q: '15² = ?', options: ['205', '215', '225', '235'], answer: 2 },
        { q: '一个三角形，底是8cm，高是5cm，面积是多少？', options: ['20 cm²', '30 cm²', '40 cm²', '50 cm²'], answer: 0 },
        { q: '圆的半径是7cm，周长约是多少？', options: ['38.98 cm', '43.96 cm', '48.96 cm', '53.98 cm'], answer: 1 },
        { q: '1+2+3+4+...+10 = ?', options: ['45', '50', '55', '60'], answer: 2 },
        { q: '如果a+b=10，a-b=4，那么a=？', options: ['5', '6', '7', '8'], answer: 2 },
        { q: '一个正方形边长增加2cm，周长增加多少？', options: ['4 cm', '6 cm', '8 cm', '10 cm'], answer: 2 },
        { q: '2⁴ = ?', options: ['8', '12', '16', '20'], answer: 2 },
        { q: '5个连续自然数的和是100，中间数是？', options: ['18', '19', '20', '21'], answer: 2 },
        { q: '一件商品打八折后卖80元，原价是多少？', options: ['90元', '96元', '100元', '105元'], answer: 2 },
        { q: '小明从1楼走到3楼用了6分钟，按同样速度走到6楼需要多少分钟？', options: ['12分钟', '15分钟', '18分钟', '21分钟'], answer: 1 },
        { q: '有一列数：1,1,2,3,5,8,13,... 第10个数是？', options: ['34', '55', '89', '144'], answer: 1 },
    ],
    chinese: [
        { q: '"一丝不苟"中的"苟"是什么意思？', options: ['马虎', '认真', '仔细', '用心'], answer: 0 },
        { q: '"守株待兔"这个成语故事中，农夫是哪国人？', options: ['齐国', '楚国', '宋国', '晋国'], answer: 2 },
        { q: '下列哪个词语不是成语？', options: ['亡羊补牢', '揠苗助长', '打草惊蛇', '吃饭睡觉'], answer: 3 },
        { q: '"水"字的笔顺第二笔是？', options: ['横撇', '竖钩', '撇', '捺'], answer: 0 },
        { q: '下列哪个是李白的作品？', options: ['《春晓》', '《静夜思》', '《登鹳雀楼》', '《相思》'], answer: 1 },
        { q: '"北京"的"京"字一共有几画？', options: ['6画', '7画', '8画', '9画'], answer: 2 },
        { q: '"森林"这两个字都是什么结构？', options: ['左右结构', '上下结构', '品字结构', '独体字'], answer: 2 },
        { q: '下列哪个词语是褒义词？', options: ['骄傲', '虚伪', '善良', '狡猾'], answer: 2 },
        { q: '"一"字在什么情况下读第二声？', options: ['在第四声前面', '在第一声前面', '单独读', '在第三声前面'], answer: 0 },
        { q: '"马"字的部首是什么？', options: ['一', '丨', '马', '乙'], answer: 2 },
        { q: '下列哪个不是四大名著？', options: ['《红楼梦》', '《西游记》', '《西厢记》', '《水浒传》'], answer: 2 },
        { q: '"春天像个害羞的小姑娘"这句话用了什么修辞手法？', options: ['比喻', '拟人', '夸张', '排比'], answer: 1 },
        { q: '"举头望明月"的下一句是？', options: ['疑是地上霜', '低头思故乡', '月是故乡明', '低头望明月'], answer: 1 },
        { q: '下列哪个字的读音不是"fā"？', options: ['发', '法', '乏', '罚'], answer: 1 },
        { q: '"好"字是多音字，除了读第三声，还读第几声？', options: ['第一声', '第二声', '第四声', '轻声'], answer: 2 },
    ],
    english: [
        { q: '"apple"是什么意思？', options: ['香蕉', '苹果', '橙子', '梨子'], answer: 1 },
        { q: '下列哪个是"蓝色"？', options: ['red', 'blue', 'green', 'yellow'], answer: 1 },
        { q: '"cat"的意思是？', options: ['狗', '猫', '鸟', '鱼'], answer: 1 },
        { q: '数字"15"的英文是？', options: ['fifteen', 'fiveteen', 'fivety', 'fifty'], answer: 0 },
        { q: '"book"是什么意思？', options: ['笔', '尺子', '书', '书包'], answer: 2 },
        { q: '下列哪个是"大的"？', options: ['small', 'big', 'tall', 'short'], answer: 1 },
        { q: '"teacher"的意思是？', options: ['学生', '医生', '老师', '工人'], answer: 2 },
        { q: '"星期一"的英文是？', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], answer: 1 },
        { q: '下列哪个不是动物？', options: ['dog', 'cat', 'desk', 'bird'], answer: 2 },
        { q: '"run"的意思是？', options: ['走', '跑', '跳', '飞'], answer: 1 },
        { q: '表示"谢谢"的英文是？', options: ['sorry', 'please', 'thank you', 'excuse me'], answer: 2 },
        { q: '"mother"的意思是？', options: ['爸爸', '妈妈', '哥哥', '姐姐'], answer: 1 },
        { q: '下列哪个是颜色？', options: ['desk', 'chair', 'red', 'book'], answer: 2 },
        { q: '"five" + "three" = ?', options: ['seven', 'eight', 'nine', 'ten'], answer: 1 },
        { q: '"我有一本书"用英文怎么说？', options: ['I have a book', 'I has a book', 'I am a book', 'I book'], answer: 0 },
    ]
};

// 当前考试状态
let currentExam = null;
let examTimer = null;

// 开始快速测验
function startQuickExam() {
    const allQuestions = [
        ...EXAM_QUESTIONS.math,
        ...EXAM_QUESTIONS.chinese,
        ...EXAM_QUESTIONS.english
    ];
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    startExam(shuffled.slice(0, 10), '快速测验', 10 * 60);
}

// 开始科目考试
function startSubjectExam(subject) {
    const subjectNames = { math: '数学专练', chinese: '语文专练', english: '英语专练' };
    const questions = [...EXAM_QUESTIONS[subject]].sort(() => Math.random() - 0.5);
    startExam(questions, subjectNames[subject], 20 * 60);
}

// 开始考试
function startExam(questions, subjectName, timeLimit) {
    currentExam = {
        questions: questions,
        subjectName: subjectName,
        answers: new Array(questions.length).fill(null),
        currentIndex: 0,
        startTime: Date.now(),
        timeLimit: timeLimit,
        remainingTime: timeLimit
    };
    
    document.getElementById('examMenu').style.display = 'none';
    document.getElementById('examInterface').style.display = 'block';
    
    renderCurrentQuestion();
    startTimer();
}

// 渲染当前题目
function renderCurrentQuestion() {
    const container = document.getElementById('examInterface');
    const q = currentExam.questions[currentExam.currentIndex];
    const progress = ((currentExam.currentIndex + 1) / currentExam.questions.length) * 100;
    
    container.innerHTML = `
        <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <!-- 进度条 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <span style="font-size:14px;color:#666;">第 ${currentExam.currentIndex + 1} / ${currentExam.questions.length} 题</span>
                <span id="examTimer" style="font-size:14px;color:${currentExam.remainingTime < 60 ? '#f44336' : '#667eea'};font-weight:bold;">${formatTime(currentExam.remainingTime)}</span>
            </div>
            <div style="height:4px;background:#f0f0f0;border-radius:2px;margin-bottom:20px;">
                <div style="height:100%;background:#667eea;border-radius:2px;width:${progress}%;transition:width 0.3s;"></div>
            </div>
            
            <!-- 题目 -->
            <div style="font-size:18px;font-weight:bold;margin-bottom:24px;line-height:1.6;">
                ${currentExam.currentIndex + 1}. ${q.q}
            </div>
            
            <!-- 选项 -->
            <div style="display:grid;gap:12px;">
                ${q.options.map((opt, i) => `
                    <div onclick="selectAnswer(${i})" style="padding:16px;border:2px solid ${currentExam.answers[currentExam.currentIndex] === i ? '#667eea' : '#e0e0e0'};border-radius:12px;cursor:pointer;background:${currentExam.answers[currentExam.currentIndex] === i ? '#f0f4ff' : 'white'};transition:all 0.2s;" id="option_${i}">
                        <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${currentExam.answers[currentExam.currentIndex] === i ? '#667eea' : '#f0f0f0'};color:${currentExam.answers[currentExam.currentIndex] === i ? 'white' : '#666'};border-radius:50%;margin-right:12px;font-size:14px;">${String.fromCharCode(65 + i)}</span>
                        ${opt}
                    </div>
                `).join('')}
            </div>
            
            <!-- 导航按钮 -->
            <div style="display:flex;justify-content:space-between;margin-top:24px;">
                <button onclick="prevQuestion()" style="padding:12px 24px;background:${currentExam.currentIndex === 0 ? '#f0f0f0' : '#f5f5f5'};color:${currentExam.currentIndex === 0 ? '#ccc' : '#666'};border:none;border-radius:8px;font-size:14px;cursor:pointer;" ${currentExam.currentIndex === 0 ? 'disabled' : ''}>
                    上一题
                </button>
                ${currentExam.currentIndex === currentExam.questions.length - 1 ? `
                    <button onclick="submitExam()" style="padding:12px 32px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:bold;">
                        提交试卷
                    </button>
                ` : `
                    <button onclick="nextQuestion()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
                        下一题
                    </button>
                `}
            </div>
        </div>
        
        <!-- 答题卡预览 -->
        <div style="margin-top:16px;background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📋 答题卡</div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
                ${currentExam.questions.map((_, i) => `
                    <div onclick="jumpToQuestion(${i})" style="width:36px;height:36px;line-height:36px;text-align:center;border-radius:8px;background:${currentExam.answers[i] !== null ? '#667eea' : '#f0f0f0'};color:${currentExam.answers[i] !== null ? 'white' : '#999'};font-size:14px;cursor:pointer;font-weight:bold;">
                        ${i + 1}
                    </div>
                `).join('')}
            </div>
            <div style="display:flex;gap:16px;margin-top:12px;font-size:12px;color:#999;">
                <span>⬤ 已答: ${currentExam.answers.filter(a => a !== null).length}</span>
                <span>○ 未答: ${currentExam.answers.filter(a => a === null).length}</span>
            </div>
        </div>
    `;
}

// 选择答案
function selectAnswer(index) {
    currentExam.answers[currentExam.currentIndex] = index;
    renderCurrentQuestion();
}

// 上一题
function prevQuestion() {
    if (currentExam.currentIndex > 0) {
        currentExam.currentIndex--;
        renderCurrentQuestion();
    }
}

// 下一题
function nextQuestion() {
    if (currentExam.currentIndex < currentExam.questions.length - 1) {
        currentExam.currentIndex++;
        renderCurrentQuestion();
    }
}

// 跳转到题目
function jumpToQuestion(index) {
    currentExam.currentIndex = index;
    renderCurrentQuestion();
}

// 开始计时器
function startTimer() {
    if (examTimer) clearInterval(examTimer);
    examTimer = setInterval(() => {
        currentExam.remainingTime--;
        const timerEl = document.getElementById('examTimer');
        if (timerEl) {
            timerEl.textContent = formatTime(currentExam.remainingTime);
            if (currentExam.remainingTime < 60) {
                timerEl.style.color = '#f44336';
            }
        }
        
        if (currentExam.remainingTime <= 0) {
            clearInterval(examTimer);
            submitExam();
        }
    }, 1000);
}

// 格式化时间
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 提交试卷
function submitExam() {
    if (examTimer) clearInterval(examTimer);
    
    let correct = 0;
    currentExam.questions.forEach((q, i) => {
        if (currentExam.answers[i] === q.answer) {
            correct++;
        }
    });
    
    const score = Math.round((correct / currentExam.questions.length) * 100);
    const wrongCount = currentExam.questions.length - correct;
    
    // 保存到历史记录
    const data = window.loadData();
    if (!data.examHistory) data.examHistory = [];
    data.examHistory.unshift({
        time: Date.now(),
        subjectName: currentExam.subjectName,
        score: score,
        correct: correct,
        total: currentExam.questions.length,
        duration: currentExam.timeLimit - currentExam.remainingTime
    });
    window.saveData(data);
    
    // 显示详细结果
    const container = document.getElementById('examInterface');
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:64px;margin-bottom:8px;">${score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}</div>
                <h2 style="margin:0 0 8px 0;font-size:22px;">考试完成！</h2>
                <div style="font-size:48px;font-weight:bold;color:${score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336'};margin:16px 0;">
                    ${score}分
                </div>
                <div style="font-size:14px;color:#666;">
                    共 ${currentExam.questions.length} 题，答对 ${correct} 题，答错 ${wrongCount} 题
                </div>
            </div>
            
            <!-- AI批改按钮 -->
            <div style="margin-bottom:16px;">
                <button onclick="aiCheckExam()" id="aiCheckBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;cursor:pointer;font-weight:bold;">
                    🤖 AI智能批改解析
                </button>
                <div style="text-align:center;font-size:11px;color:#999;margin-top:6px;">AI逐题分析错因，给出解题思路和知识点讲解</div>
            </div>
            
            <!-- 一键加入错题本 -->
            ${wrongCount > 0 ? `
            <div style="margin-bottom:16px;">
                <button onclick="addAllWrongToWrongbook()" style="width:100%;padding:14px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:15px;cursor:pointer;font-weight:bold;">
                    📒 全部错题加入错题本（${wrongCount}题）
                </button>
            </div>
            ` : ''}
            
            <!-- 逐题详情 -->
            <div style="background:white;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">
                <div style="padding:12px 16px;font-size:15px;font-weight:bold;border-bottom:1px solid #f0f0f0;">📋 逐题详情</div>
                ${currentExam.questions.map((q, i) => {
                    const isCorrect = currentExam.answers[i] === q.answer;
                    const userAns = currentExam.answers[i] !== null ? String.fromCharCode(65 + currentExam.answers[i]) : '未作答';
                    const correctAns = String.fromCharCode(65 + q.answer);
                    return `
                    <div style="padding:14px 16px;border-bottom:1px solid #f5f5f5;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <span style="font-size:13px;color:#999;">第${i+1}题</span>
                            <span style="font-size:13px;font-weight:bold;color:${isCorrect ? '#4caf50' : '#f44336'};">${isCorrect ? '✅ 正确' : '❌ 错误'}</span>
                        </div>
                        <div style="font-size:14px;color:#333;margin-bottom:8px;line-height:1.5;">${q.q}</div>
                        <div style="display:flex;gap:12px;font-size:13px;margin-bottom:8px;">
                            <span style="color:${isCorrect ? '#4caf50' : '#f44336'};">你的答案：${userAns}${currentExam.answers[i] !== null ? '. ' + q.options[currentExam.answers[i]] : ''}</span>
                            ${!isCorrect ? '<span style="color:#4caf50;">正确答案：' + correctAns + '. ' + q.options[q.answer] + '</span>' : ''}
                        </div>
                        ${!isCorrect ? `
                        <div style="display:flex;gap:8px;">
                            <button onclick="addSingleWrongToWrongbook(${i})" style="padding:6px 12px;background:#FF6B6B;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📒 加入错题本</button>
                            <button onclick="aiAnalyzeSingleQuestion(${i})" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">🤖 AI分析</button>
                        </div>
                        ` : ''}
                        <div id="aiAnalysis_${i}" style="display:none;margin-top:10px;"></div>
                    </div>
                    `;
                }).join('')}
            </div>
            
            <!-- 底部按钮 -->
            <div style="display:grid;gap:12px;margin-top:20px;">
                <button onclick="renderExam(document.getElementById('fullscreen-content'))" style="padding:14px;background:#667eea;color:white;border:none;border-radius:12px;font-size:15px;cursor:pointer;font-weight:bold;">
                    返回考试首页
                </button>
                <button onclick="history.back()" style="padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:15px;cursor:pointer;">
                    返回首页
                </button>
            </div>
        </div>
    `;
}

// ========== AI智能批改 ==========
async function aiCheckExam() {
    const btn = document.getElementById('aiCheckBtn');
    if (btn) {
        btn.textContent = '🤖 AI正在批改中...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
    }
    
    // 收集错题信息
    const wrongQuestions = [];
    currentExam.questions.forEach((q, i) => {
        if (currentExam.answers[i] !== q.answer) {
            wrongQuestions.push({
                index: i,
                question: q.q,
                options: q.options.map((opt, j) => String.fromCharCode(65 + j) + '. ' + opt).join('；'),
                userAnswer: currentExam.answers[i] !== null ? String.fromCharCode(65 + currentExam.answers[i]) + '. ' + q.options[currentExam.answers[i]] : '未作答',
                correctAnswer: String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer]
            });
        }
    });
    
    if (wrongQuestions.length === 0) {
        if (btn) { btn.textContent = '🎉 全部正确，无需批改！'; btn.style.background = '#4caf50'; }
        return;
    }
    
    const prompt = `请对以下考试错题进行逐题分析，帮助学生理解错因和掌握知识点：

${wrongQuestions.map((wq, idx) => `
第${idx+1}题（原试卷第${wq.index+1}题）：
题目：${wq.question}
选项：${wq.options}
学生答案：${wq.userAnswer}
正确答案：${wq.correctAnswer}
`).join('\n')}

请对每道错题分析：
1. 错误原因（为什么选错了）
2. 正确解法（应该怎么想）
3. 涉及知识点
4. 一句话提醒

请用以下格式回复（每题一段）：
【第X题】
❌ 错因：...
✅ 解法：...
📚 知识点：...
💡 提醒：...`;

    const messages = [
        { role: 'system', content: '你是一位专业、耐心的中小学老师，擅长分析学生的错题，给出简洁易懂的讲解。请用清晰结构回答。' },
        { role: 'user', content: prompt }
    ];
    
    try {
        const result = await callDeepSeekAPI(messages, 0.7);
        
        if (result.success) {
            // 解析AI返回结果，逐题填充
            const analysisText = result.content;
            const blocks = analysisText.split(/【第\d+题】/).filter(b => b.trim());
            
            wrongQuestions.forEach((wq, idx) => {
                const el = document.getElementById('aiAnalysis_' + wq.index);
                if (el) {
                    const content = idx < blocks.length ? blocks[idx].trim() : '暂无分析';
                    el.style.display = 'block';
                    el.innerHTML = `
                        <div style="background:#f5f7ff;border-radius:8px;padding:12px;font-size:13px;line-height:1.8;color:#333;">
                            ${content.replace(/\n/g, '<br>')}
                        </div>
                    `;
                }
            });
            
            if (btn) { btn.textContent = '✅ AI批改完成'; btn.style.background = '#4caf50'; }
            
            // 记录DeepSeek使用
            if (typeof recordDeepSeekCall === 'function') {
                recordDeepSeekCall(Math.ceil(result.content.length / 4));
            }
        } else {
            if (btn) { btn.textContent = '❌ AI批改失败：' + (result.message || '请检查API配置'); btn.style.background = '#f44336'; }
        }
    } catch(e) {
        if (btn) { btn.textContent = '❌ AI批改出错，请重试'; btn.style.background = '#f44336'; }
    }
}

// 单题AI分析
async function aiAnalyzeSingleQuestion(questionIndex) {
    const q = currentExam.questions[questionIndex];
    const el = document.getElementById('aiAnalysis_' + questionIndex);
    if (!el) return;
    
    el.style.display = 'block';
    el.innerHTML = '<div style="background:#f5f7ff;border-radius:8px;padding:12px;font-size:13px;color:#667eea;">🤖 AI分析中...</div>';
    
    const userAns = currentExam.answers[questionIndex] !== null ? String.fromCharCode(65 + currentExam.answers[questionIndex]) + '. ' + q.options[currentExam.answers[questionIndex]] : '未作答';
    const correctAns = String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer];
    
    const prompt = `请分析这道错题：
题目：${q.q}
选项：${q.options.map((opt, j) => String.fromCharCode(65 + j) + '. ' + opt).join('；')}
学生答案：${userAns}
正确答案：${correctAns}

请简洁分析：1.为什么选错了 2.正确思路 3.知识点 4.一句话提醒`;

    try {
        const result = await callDeepSeekAPI([
            { role: 'system', content: '你是专业中小学老师，简洁分析错题，200字以内。' },
            { role: 'user', content: prompt }
        ], 0.7);
        
        if (result.success) {
            el.innerHTML = `
                <div style="background:#f5f7ff;border-radius:8px;padding:12px;font-size:13px;line-height:1.8;color:#333;">
                    ${result.content.replace(/\n/g, '<br>')}
                </div>
            `;
            if (typeof recordDeepSeekCall === 'function') recordDeepSeekCall(Math.ceil(result.content.length / 4));
        } else {
            el.innerHTML = '<div style="background:#fff0f0;border-radius:8px;padding:12px;font-size:13px;color:#f44336;">AI分析失败：' + (result.message || '请检查API配置') + '</div>';
        }
    } catch(e) {
        el.innerHTML = '<div style="background:#fff0f0;border-radius:8px;padding:12px;font-size:13px;color:#f44336;">分析出错，请重试</div>';
    }
}

// ========== 错题转入错题本 ==========

// 单题加入错题本
function addSingleWrongToWrongbook(questionIndex) {
    const q = currentExam.questions[questionIndex];
    const user = window.getCurrentUserData();
    if (!user) { window.showToast('请先登录'); return; }
    
    user.wrongNotes = user.wrongNotes || [];
    
    const wrongKey = 'exam-' + Date.now() + '-' + questionIndex;
    // 防止重复添加
    if (user.wrongNotes.some(n => n.question === q.q && n.source === 'exam')) {
        window.showToast('该题已在错题本中');
        return;
    }
    
    const userAns = currentExam.answers[questionIndex] !== null ? String.fromCharCode(65 + currentExam.answers[questionIndex]) + '. ' + q.options[currentExam.answers[questionIndex]] : '未作答';
    const correctAns = q.options[q.answer];
    
    user.wrongNotes.push({
        wrongKey: wrongKey,
        source: 'exam',
        sourceName: '模拟考试',
        topicId: null,
        question: q.q,
        type: 'choice',
        options: q.options,
        answer: correctAns,
        correctIndex: q.answer,
        explanation: '',
        userAnswer: userAns,
        time: Date.now(),
        reviewed: false
    });
    
    syncUserData(user);
    window.showToast('✅ 已加入错题本');
}

// 全部错题加入错题本
function addAllWrongToWrongbook() {
    const user = window.getCurrentUserData();
    if (!user) { window.showToast('请先登录'); return; }
    
    user.wrongNotes = user.wrongNotes || [];
    let added = 0;
    
    currentExam.questions.forEach((q, i) => {
        if (currentExam.answers[i] === q.answer) return; // 只加错题
        
        // 防止重复
        if (user.wrongNotes.some(n => n.question === q.q && n.source === 'exam')) return;
        
        const userAns = currentExam.answers[i] !== null ? String.fromCharCode(65 + currentExam.answers[i]) + '. ' + q.options[currentExam.answers[i]] : '未作答';
        const correctAns = q.options[q.answer];
        
        user.wrongNotes.push({
            wrongKey: 'exam-' + Date.now() + '-' + i,
            source: 'exam',
            sourceName: '模拟考试',
            topicId: null,
            question: q.q,
            type: 'choice',
            options: q.options,
            answer: correctAns,
            correctIndex: q.answer,
            explanation: '',
            userAnswer: userAns,
            time: Date.now(),
            reviewed: false
        });
        added++;
    });
    
    syncUserData(user);
    window.showToast(added > 0 ? '✅ 已将' + added + '道错题加入错题本' : '所有错题已在错题本中');
}

// 挂载到window
window.renderExam = renderExam;
window.startQuickExam = startQuickExam;
window.startSubjectExam = startSubjectExam;
window.selectAnswer = selectAnswer;
window.prevQuestion = prevQuestion;
window.nextQuestion = nextQuestion;
window.jumpToQuestion = jumpToQuestion;
window.submitExam = submitExam;
window.aiCheckExam = aiCheckExam;
window.aiAnalyzeSingleQuestion = aiAnalyzeSingleQuestion;
window.addSingleWrongToWrongbook = addSingleWrongToWrongbook;
window.addAllWrongToWrongbook = addAllWrongToWrongbook;

// ========== 拍照上传 & 导入导出 ==========

// 自定义试卷题库
window.customExamQuestions = [];

// 显示拍照上传界面
function showExamUpload() {
    const container = document.getElementById('examInterface');
    container.style.display = 'block';
    document.getElementById('examMenu').style.display = 'none';
    
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="renderExam(document.getElementById('fullscreen-content'))" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;">📷 拍照上传试卷</h2>
                <div style="width:60px;"></div>
            </div>
            
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <!-- 拍照/上传区域 -->
                <div style="border:2px dashed #ddd;border-radius:12px;padding:40px 20px;text-align:center;margin-bottom:20px;cursor:pointer;" onclick="document.getElementById('examPhotoInput').click()">
                    <div style="font-size:48px;margin-bottom:12px;">📸</div>
                    <div style="font-size:16px;color:#667eea;font-weight:bold;margin-bottom:8px;">点击拍照或选择图片</div>
                    <div style="font-size:12px;color:#999;">支持JPG、PNG格式</div>
                    <input type="file" id="examPhotoInput" accept="image/*" capture="environment" style="display:none;" onchange="handleExamPhotoUpload(event)">
                </div>
                
                <!-- 预览区域 -->
                <div id="photoPreview" style="display:none;margin-bottom:20px;">
                    <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📷 图片预览</div>
                    <img id="previewImage" style="width:100%;border-radius:8px;">
                </div>
                
                <!-- OCR识别结果 -->
                <div id="ocrResult" style="display:none;">
                    <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📝 识别结果</div>
                    <textarea id="ocrText" style="width:100%;height:150px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;resize:vertical;"></textarea>
                    <div style="margin-top:12px;color:#999;font-size:12px;">💡 提示：每行一道题，格式：题目|选项A|选项B|选项C|选项D|正确答案序号(0-3)</div>
                </div>
                
                <!-- 操作按钮 -->
                <div id="ocrButtons" style="display:none;display:grid;gap:12px;margin-top:20px;">
                    <button onclick="convertToQuestions()" style="padding:14px;background:#667eea;color:white;border:none;border-radius:12px;font-size:14px;cursor:pointer;font-weight:bold;">
                        🔄 转换为题目
                    </button>
                    <button onclick="startCustomExam()" id="startCustomBtn" style="display:none;padding:14px;background:#4caf50;color:white;border:none;border-radius:12px;font-size:14px;cursor:pointer;font-weight:bold;">
                        🚀 开始自定义考试
                    </button>
                </div>
            </div>
            
            <!-- 导入导出 -->
            <div style="margin-top:16px;background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:16px;font-weight:bold;margin-bottom:16px;">📁 导入导出</div>
                <div style="display:grid;gap:12px;">
                    <button onclick="exportQuestions()" style="padding:12px;background:#2196f3;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
                        📤 导出自定义题库
                    </button>
                    <div style="position:relative;">
                        <button onclick="document.getElementById('importQuestions').click()" style="width:100%;padding:12px;background:#ff9800;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
                            📥 导入题库文件
                        </button>
                        <input type="file" id="importQuestions" accept=".json" style="display:none;" onchange="importQuestions(event)">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 处理图片上传
function handleExamPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('photoPreview').style.display = 'block';
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('ocrResult').style.display = 'block';
        document.getElementById('ocrButtons').style.display = 'grid';
        document.getElementById('ocrText').value = '识别中...\n\n（提示：纯前端OCR功能需要加载OCR库，这里模拟识别结果）\n\n1+1=?|1|2|3|4|1\n2+2=?|2|3|4|5|2\n3+3=?|4|5|6|7|2';
        
        // 模拟识别延迟
        setTimeout(() => {
            window.showToast('📷 图片已上传，OCR识别功能开发中');
        }, 1000);
    };
    reader.readAsDataURL(file);
}

// 转换为题目
function convertToQuestions() {
    const text = document.getElementById('ocrText').value;
    const lines = text.trim().split('\n').filter(line => line.trim());
    
    window.customExamQuestions = [];
    
    lines.forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 6) {
            window.customExamQuestions.push({
                q: parts[0].trim(),
                options: [parts[1].trim(), parts[2].trim(), parts[3].trim(), parts[4].trim()],
                answer: parseInt(parts[5])
            });
        }
    });
    
    if (window.customExamQuestions.length > 0) {
        document.getElementById('startCustomBtn').style.display = 'block';
        window.showToast(`✅ 成功转换 ${window.customExamQuestions.length} 道题目`);
    } else {
        window.showToast('❌ 未能识别题目，请检查格式');
    }
}

// 开始自定义考试
function startCustomExam() {
    if (window.customExamQuestions.length === 0) {
        window.showToast('请先上传或导入题目');
        return;
    }
    startExam(window.customExamQuestions, '自定义试卷', window.customExamQuestions.length * 60);
}

// 导出自定义题库
function exportQuestions() {
    const data = {
        questions: window.customExamQuestions,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `题库_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast('✅ 题库已导出');
}

// 导入题库
function importQuestions(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            window.customExamQuestions = data.questions || [];
            window.showToast(`✅ 成功导入 ${window.customExamQuestions.length} 道题目`);
        } catch (err) {
            window.showToast('❌ 导入失败，文件格式错误');
        }
    };
    reader.readAsText(file);
}

// ========== 仿真笔迹功能 ==========
let handwritingCanvas = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 显示仿真笔迹答题卡
function showHandwritingAnswer() {
    const container = document.getElementById('examInterface');
    
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="renderCurrentQuestion()" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回题目</button>
                <h2 style="margin:0;font-size:18px;">✍️ 仿真笔迹答题</h2>
                <div style="width:60px;"></div>
            </div>
            
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <!-- 工具栏 -->
                <div style="display:flex;gap:8px;margin-bottom:16px;">
                    <button onclick="setPenColor('#000000')" style="width:32px;height:32px;background:#000;border:none;border-radius:50%;cursor:pointer;"></button>
                    <button onclick="setPenColor('#1a1a1a')" style="width:32px;height:32px;background:#1a1a1a;border:none;border-radius:50%;cursor:pointer;"></button>
                    <button onclick="setPenColor('#333333')" style="width:32px;height:32px;background:#333;border:none;border-radius:50%;cursor:pointer;"></button>
                    <button onclick="setPenColor('#0066cc')" style="width:32px;height:32px;background:#0066cc;border:none;border-radius:50%;cursor:pointer;"></button>
                    <div style="width:1px;background:#ddd;margin:0 8px;"></div>
                    <button onclick="setPenSize(2)" style="padding:4px 12px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">细</button>
                    <button onclick="setPenSize(4)" style="padding:4px 12px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">中</button>
                    <button onclick="setPenSize(6)" style="padding:4px 12px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">粗</button>
                    <div style="width:1px;background:#ddd;margin:0 8px;"></div>
                    <button onclick="undoStroke()" style="padding:4px 12px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">↩️ 撤销</button>
                    <button onclick="clearCanvas()" style="padding:4px 12px;background:#f5f5f5;border:none;border-radius:4px;cursor:pointer;">🗑️ 清空</button>
                </div>
                
                <!-- 绘图画布 -->
                <div style="border:1px solid #ddd;border-radius:8px;overflow:hidden;background:#fffef8;">
                    <canvas id="handwritingCanvas" width="600" height="400" style="width:100%;cursor:crosshair;touch-action:none;"></canvas>
                </div>
                
                <!-- 操作按钮 -->
                <div style="display:flex;gap:12px;margin-top:20px;">
                    <button onclick="saveHandwriting()" style="flex:1;padding:14px;background:#4caf50;color:white;border:none;border-radius:12px;font-size:14px;cursor:pointer;font-weight:bold;">
                        💾 保存笔迹
                    </button>
                    <button onclick="renderCurrentQuestion()" style="flex:1;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">
                        返回
                    </button>
                </div>
            </div>
            
            <div style="margin-top:16px;padding:16px;background:#e3f2fd;border-radius:12px;">
                <div style="font-size:14px;font-weight:bold;color:#1976d2;margin-bottom:8px;">💡 使用提示</div>
                <div style="font-size:13px;color:#1976d2;line-height:1.6;">
                    用手指或鼠标在画布上书写答案，笔迹会自动模拟手写效果。可以选择不同颜色和粗细。
                </div>
            </div>
        </div>
    `;
    
    initHandwritingCanvas();
}

// 初始化笔迹画布
function initHandwritingCanvas() {
    handwritingCanvas = document.getElementById('handwritingCanvas');
    const ctx = handwritingCanvas.getContext('2d');
    
    // 设置画布样式
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    
    // 存储笔迹历史
    window.strokeHistory = [];
    window.currentStroke = [];
    
    // 鼠标事件
    handwritingCanvas.addEventListener('mousedown', startDrawing);
    handwritingCanvas.addEventListener('mousemove', draw);
    handwritingCanvas.addEventListener('mouseup', stopDrawing);
    handwritingCanvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸事件
    handwritingCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = handwritingCanvas.getBoundingClientRect();
        const scaleX = handwritingCanvas.width / rect.width;
        const scaleY = handwritingCanvas.height / rect.height;
        startDrawing({
            offsetX: (touch.clientX - rect.left) * scaleX,
            offsetY: (touch.clientY - rect.top) * scaleY
        });
    });
    handwritingCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = handwritingCanvas.getBoundingClientRect();
        const scaleX = handwritingCanvas.width / rect.width;
        const scaleY = handwritingCanvas.height / rect.height;
        draw({
            offsetX: (touch.clientX - rect.left) * scaleX,
            offsetY: (touch.clientY - rect.top) * scaleY
        });
    });
    handwritingCanvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    window.currentStroke = [{x: e.offsetX, y: e.offsetY}];
}

function draw(e) {
    if (!isDrawing) return;
    
    const ctx = handwritingCanvas.getContext('2d');
    
    // 模拟手写抖动效果
    const jitter = 0.5;
    const jitterX = (Math.random() - 0.5) * jitter;
    const jitterY = (Math.random() - 0.5) * jitter;
    
    ctx.beginPath();
    ctx.moveTo(lastX + jitterX, lastY + jitterY);
    
    // 模拟压力效果（越慢越粗）
    const dist = Math.sqrt(Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2));
    const speed = dist || 1;
    const pressure = Math.max(1, ctx.lineWidth * (1 - Math.min(0.3, speed / 50)));
    ctx.lineWidth = pressure;
    
    ctx.lineTo(e.offsetX + jitterX, e.offsetY + jitterY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
    window.currentStroke.push({x: e.offsetX, y: e.offsetY});
}

function stopDrawing() {
    if (isDrawing && window.currentStroke.length > 0) {
        window.strokeHistory.push([...window.currentStroke]);
    }
    isDrawing = false;
    window.currentStroke = [];
}

function setPenColor(color) {
    if (handwritingCanvas) {
        handwritingCanvas.getContext('2d').strokeStyle = color;
    }
}

function setPenSize(size) {
    if (handwritingCanvas) {
        handwritingCanvas.getContext('2d').lineWidth = size;
    }
}

function undoStroke() {
    if (!handwritingCanvas || window.strokeHistory.length === 0) return;
    
    window.strokeHistory.pop();
    redrawCanvas();
}

function clearCanvas() {
    if (!handwritingCanvas) return;
    
    const ctx = handwritingCanvas.getContext('2d');
    ctx.clearRect(0, 0, handwritingCanvas.width, handwritingCanvas.height);
    window.strokeHistory = [];
}

function redrawCanvas() {
    if (!handwritingCanvas) return;
    
    const ctx = handwritingCanvas.getContext('2d');
    ctx.clearRect(0, 0, handwritingCanvas.width, handwritingCanvas.height);
    
    // 重画所有笔迹
    window.strokeHistory.forEach(stroke => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
    });
}

function saveHandwriting() {
    if (!handwritingCanvas) return;
    
    const dataUrl = handwritingCanvas.toDataURL('image/png');
    
    // 保存到本地存储
    const key = `handwriting_${Date.now()}`;
    localStorage.setItem(key, dataUrl);
    
    window.showToast('✅ 笔迹已保存');
}

// 在考试菜单中添加上传按钮
const originalRenderExam = window.renderExam;
window.renderExam = function(container) {
    originalRenderExam(container);
    
    // 添加上传入口按钮
    setTimeout(() => {
        const menu = document.getElementById('examMenu');
        if (menu) {
            const uploadBtn = document.createElement('div');
            uploadBtn.innerHTML = `
                <div onclick="showExamUpload()" style="background:linear-gradient(135deg,#fa709a,#fee140);color:white;padding:20px;border-radius:12px;margin-bottom:12px;cursor:pointer;">
                    <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">📷 拍照上传试卷</div>
                    <div style="font-size:13px;opacity:0.9;">拍照识别题目 · 导入导出 · 仿真笔迹答题</div>
                </div>
            `;
            menu.insertBefore(uploadBtn.firstChild, menu.firstChild.nextSibling);
        }
    }, 100);
};

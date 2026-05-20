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
                    
                    <div onclick="startSubjectExam('english')" style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;padding:20px;border-radius:12px;cursor:pointer;">
                        <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">🔤 英语专练</div>
                        <div style="font-size:13px;opacity:0.9;">15道题 · 20分钟</div>
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
    
    // 显示结果
    const container = document.getElementById('examInterface');
    container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:64px;margin-bottom:16px;">${score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}</div>
            <h2 style="margin:0 0 8px 0;font-size:24px;">考试完成！</h2>
            <div style="font-size:48px;font-weight:bold;color:${score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336'};margin:20px 0;">
                ${score}分
            </div>
            <div style="font-size:16px;color:#666;margin-bottom:32px;">
                共 ${currentExam.questions.length} 题，答对 ${correct} 题，答错 ${currentExam.questions.length - correct} 题
            </div>
            
            <div style="display:grid;gap:12px;max-width:300px;margin:0 auto;">
                <button onclick="renderExam(document.getElementById('fullscreen-content'))" style="padding:14px;background:#667eea;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;font-weight:bold;">
                    返回考试首页
                </button>
                <button onclick="history.back()" style="padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:16px;cursor:pointer;">
                    返回首页
                </button>
            </div>
        </div>
    `;
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

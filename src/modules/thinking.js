// 思维训练模块 - ES6 Modules 版本
import { showToast, escapeHtml } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 思维训练类型
const THINKING_TYPES = [
    {
        id: 'logic',
        name: '逻辑思维',
        icon: '🔍',
        color: '#3498db',
        description: '通过分析、推理、判断来锻炼逻辑思维能力',
        difficulty: '中等'
    },
    {
        id: 'creative',
        name: '创新思维',
        icon: '💡',
        color: '#e74c3c',
        description: '打破常规，激发创意，培养发散性思维',
        difficulty: '挑战'
    },
    {
        id: 'critical',
        name: '批判思维',
        icon: '🤔',
        color: '#9b59b6',
        description: '学会质疑、分析和评估，培养独立思考能力',
        difficulty: '中等'
    },
    {
        id: 'system',
        name: '系统思维',
        icon: '🌐',
        color: '#1abc9c',
        description: '从整体出发，理解事物之间的联系和影响',
        difficulty: '进阶'
    },
    {
        id: 'reverse',
        name: '逆向思维',
        icon: '🔄',
        color: '#f39c12',
        description: '反方向思考问题，发现新的解决方案',
        difficulty: '挑战'
    },
    {
        id: 'spatial',
        name: '空间思维',
        icon: '🧩',
        color: '#2ecc71',
        description: '锻炼空间想象和几何认知能力',
        difficulty: '入门'
    }
];

// 思维训练题目
const THINKING_QUESTIONS = {
    logic: [
        {
            id: 'l1',
            question: '如果所有的玫瑰都是花，有些花会很快凋谢，我们可以得出什么结论？',
            options: ['所有玫瑰都会很快凋谢', '有些玫瑰会很快凋谢', '不能得出结论'],
            answer: 2,
            explanation: '有些花会凋谢，但我们不知道这些花是否包括玫瑰，所以不能确定玫瑰是否会凋谢。'
        },
        {
            id: 'l2',
            question: '甲、乙、丙三人中，只有一人会游泳。甲说："我会"，乙说："我不会"，丙说："甲不会"。如果只有一人说真话，那么谁会游泳？',
            options: ['甲', '乙', '丙'],
            answer: 1,
            explanation: '甲和丙的话矛盾，必有一真一假。因为只有一人说真话，所以乙说的是假话，乙会游泳。'
        },
        {
            id: 'l3',
            question: '找规律填数：1, 1, 2, 3, 5, 8, ___',
            options: ['11', '12', '13'],
            answer: 2,
            explanation: '这是斐波那契数列，每个数是前两个数之和：5+8=13。'
        }
    ],
    creative: [
        {
            id: 'c1',
            question: '砖头除了盖房子，还能有多少种用途？（至少想出5种）',
            type: 'open',
            hint: '思考不同维度：工具、武器、艺术、教育、生活用品...'
        },
        {
            id: 'c2',
            question: '如果人类不需要睡觉，世界会发生什么变化？',
            type: 'open',
            hint: '从工作、生活、经济、社会、建筑、健康等方面思考'
        },
        {
            id: 'c3',
            question: '如何让一个普通的纸杯卖到100元？',
            type: 'open',
            hint: '附加价值、特殊意义、创意改造、稀缺性...'
        }
    ],
    critical: [
        {
            id: 'cr1',
            question: '"这个药有效，因为90%的人说有用"——这句话有什么逻辑漏洞？',
            options: ['没有漏洞', '样本可能有偏差', '数据肯定是假的'],
            answer: 1,
            explanation: '样本可能存在选择偏差、幸存者偏差，也可能没有对照组进行比较。'
        },
        {
            id: 'cr2',
            question: '"他是好人，因为他经常捐款"——这个论证的问题在哪里？',
            options: ['没问题', '因果关系可能不成立', '捐款肯定有目的'],
            answer: 1,
            explanation: '经常捐款不能证明是"好人"，这是不完全归纳，可能有其他动机。'
        }
    ],
    system: [
        {
            id: 's1',
            question: '为什么过度捕捞会导致渔民收入反而下降？',
            type: 'open',
            hint: '思考整个生态系统、经济系统的连锁反应'
        },
        {
            id: 's2',
            question: '城市里增加更多的道路会缓解交通拥堵吗？为什么？',
            type: 'open',
            hint: '考虑"诱发交通"现象和系统反馈'
        }
    ],
    reverse: [
        {
            id: 'r1',
            question: '如何通过"增加问题"来解决问题？',
            type: 'open',
            hint: '有时候增加一些小问题可以解决更大的问题'
        },
        {
            id: 'r2',
            question: '如果想让一本书更受欢迎，为什么有时候可以故意让它"被禁"？',
            type: 'open',
            hint: '反向思维：禁书反而增加了好奇心和稀缺性'
        }
    ],
    spatial: [
        {
            id: 'sp1',
            question: '一个立方体从中间切开，切面是什么形状？',
            options: ['只能是正方形', '可以是三角形', '可以是六边形', '以上都对'],
            answer: 3,
            explanation: '立方体的切面可以是三角形、四边形、五边形甚至六边形，取决于切割角度。'
        },
        {
            id: 'sp2',
            question: '如果把一张纸对折3次，然后在中间剪一个洞，展开后会有几个洞？',
            options: ['3个', '4个', '8个', '1个'],
            answer: 1,
            explanation: '每次对折层数翻倍，但洞是连通的，对折3次后展开只有1个洞。'
        }
    ]
};

/**
 * 获取所有思维训练类型
 */
export function getThinkingTypes() {
    return THINKING_TYPES;
}

/**
 * 获取指定类型的题目
 */
export function getQuestions(typeId) {
    return THINKING_QUESTIONS[typeId] || [];
}

/**
 * 获取用户的训练记录
 */
export function getUserTrainingRecords() {
    const user = getCurrentUserData();
    return user?.thinkingRecords || {};
}

/**
 * 保存训练记录
 */
export function saveTrainingRecord(typeId, questionId, isCorrect) {
    const user = getCurrentUserData();
    if (!user) return false;

    if (!user.thinkingRecords) {
        user.thinkingRecords = {};
    }
    if (!user.thinkingRecords[typeId]) {
        user.thinkingRecords[typeId] = {
            completed: [],
            correctCount: 0,
            totalCount: 0
        };
    }

    const record = user.thinkingRecords[typeId];
    if (!record.completed.includes(questionId)) {
        record.completed.push(questionId);
        record.totalCount++;
        if (isCorrect) {
            record.correctCount++;
        }
    }

    updateCurrentUser(user);
    return true;
}

/**
 * 渲染思维训练主页
 */
export function renderThinkingPage(container) {
    const types = getThinkingTypes();
    const records = getUserTrainingRecords();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🧠 思维训练</h2>
                <div style="width: 60px;"></div>
            </div>
            
            <div class="thinking-container">
                <div class="thinking-intro">
                    <p>选择一种思维类型，开始你的大脑训练！</p>
                </div>
                
                <div class="thinking-types-grid">
                    ${types.map(type => {
                        const record = records[type.id] || { completed: [], correctCount: 0, totalCount: 0 };
                        const questions = getQuestions(type.id);
                        const completedCount = record.completed.length;
                        const totalCount = questions.length;
                        const progressPercent = Math.round((completedCount / totalCount) * 100);
                        
                        return `
                            <div class="thinking-type-card" onclick="window.App.thinking.openTraining('${type.id}')">
                                <div class="type-icon" style="background: ${type.color}20; color: ${type.color};">
                                    ${type.icon}
                                </div>
                                <div class="type-info">
                                    <div class="type-header">
                                        <h3 class="type-name">${type.name}</h3>
                                        <span class="type-difficulty" style="background: ${type.color}20; color: ${type.color};">${type.difficulty}</span>
                                    </div>
                                    <p class="type-desc">${type.description}</p>
                                    <div class="type-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progressPercent}%; background: ${type.color};"></div>
                                        </div>
                                        <span class="progress-text">${completedCount}/${totalCount} 题目</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 打开训练
 */
export function openTraining(typeId) {
    const type = THINKING_TYPES.find(t => t.id === typeId);
    const questions = getQuestions(typeId);
    const records = getUserTrainingRecords();
    const record = records[typeId] || { completed: [] };
    
    // 找到第一个未完成的题目
    const firstUncompleted = questions.find(q => !record.completed.includes(q.id));
    if (firstUncompleted) {
        showQuestion(typeId, firstUncompleted.id);
    } else if (questions.length > 0) {
        // 所有题目都完成了，从第一个开始
        showQuestion(typeId, questions[0].id);
    } else {
        showToast('该类型暂无题目');
    }
}

/**
 * 显示题目
 */
export function showQuestion(typeId, questionId) {
    const type = THINKING_TYPES.find(t => t.id === typeId);
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!type || !question) return;

    const currentIndex = questions.findIndex(q => q.id === questionId);
    const records = getUserTrainingRecords();
    const record = records[typeId] || { completed: [] };
    const isCompleted = record.completed.includes(questionId);

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    let optionsHtml = '';
    if (question.options) {
        optionsHtml = `
            <div class="question-options">
                ${question.options.map((opt, index) => `
                    <button class="option-btn" data-index="${index}" onclick="window.App.thinking.checkAnswer('${typeId}', '${questionId}', ${index})">
                        ${String.fromCharCode(65 + index)}. ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    } else {
        optionsHtml = `
            <div class="open-question-hint">
                <p>💡 ${question.hint || '这是一个开放性思考题'}</p>
                <textarea class="answer-textarea" placeholder="写下你的想法..."></textarea>
                <button class="show-answer-btn" onclick="window.App.thinking.showExplanation('${typeId}', '${questionId}')">
                    查看参考答案
                </button>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="thinking-training">
            <div class="training-header" style="background: linear-gradient(135deg, ${type.color}, ${type.color}dd);">
                <div class="training-type">
                    <span class="type-icon-small">${type.icon}</span>
                    <span>${type.name}</span>
                </div>
                <div class="question-progress">
                    第 ${currentIndex + 1} / ${questions.length} 题
                </div>
            </div>
            
            <div class="training-content">
                <div class="question-text">
                    ${question.question}
                </div>
                
                <div id="answer-area">
                    ${optionsHtml}
                </div>
                
                <div id="explanation-area" style="display: none;">
                    ${question.explanation ? `
                        <div class="explanation-box">
                            <h4>💡 解析</h4>
                            <p>${question.explanation}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="training-footer">
                <button class="nav-btn ${currentIndex === 0 ? 'disabled' : ''}" 
                        onclick="window.App.thinking.prevQuestion('${typeId}', '${questionId}')"
                        ${currentIndex === 0 ? 'disabled' : ''}>
                    ← 上一题
                </button>
                <button class="nav-btn ${currentIndex === questions.length - 1 ? 'disabled' : ''}" 
                        onclick="window.App.thinking.nextQuestion('${typeId}', '${questionId}')"
                        ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
                    下一题 →
                </button>
            </div>
        </div>
        
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')" style="margin: 16px;">
            关闭
        </button>
    `;

    modal.classList.add('show');
}

/**
 * 检查答案
 */
export function checkAnswer(typeId, questionId, selectedIndex) {
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedIndex === question.answer;
    saveTrainingRecord(typeId, questionId, isCorrect);

    // 高亮显示正确和错误选项
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.answer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // 显示解析
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea && question.explanation) {
        explanationArea.style.display = 'block';
    }

    showToast(isCorrect ? '🎉 回答正确！' : '💪 继续加油！');
}

/**
 * 显示解析
 */
export function showExplanation(typeId, questionId) {
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    saveTrainingRecord(typeId, questionId, true);

    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) {
        explanationArea.style.display = 'block';
    }
    showToast('已完成本题 ✅');
}

/**
 * 上一题
 */
export function prevQuestion(typeId, currentQuestionId) {
    const questions = getQuestions(typeId);
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
        showQuestion(typeId, questions[currentIndex - 1].id);
    }
}

/**
 * 下一题
 */
export function nextQuestion(typeId, currentQuestionId) {
    const questions = getQuestions(typeId);
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex < questions.length - 1) {
        showQuestion(typeId, questions[currentIndex + 1].id);
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.thinking = {
    openTraining,
    showQuestion,
    checkAnswer,
    showExplanation,
    prevQuestion,
    nextQuestion
};

console.log('✅ thinking 模块加载完成');

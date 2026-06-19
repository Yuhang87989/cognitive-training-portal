/* 认知训练游戏模块
 * 包含游戏问题库、同学系统、游戏逻辑
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'training_game';

// 游戏问题库（分类题目）
const questionBank = {
    attention: [
        {
            id: 'q_att_001',
            type: 'choice',
            category: 'attention',
            difficulty: 1,
            question: '在嘈杂环境中，以下哪种方法最能帮助你集中注意力？',
            options: [
                'A. 完全屏蔽所有声音',
                'B. 播放熟悉的背景白噪音',
                'C. 不断切换注意力焦点',
                'D. 用更大的声音盖过噪音'
            ],
            answer: 'B',
            explanation: '白噪音可以掩盖不规则的环境噪音，帮助大脑建立稳定的注意力背景。完全屏蔽声音可能导致听力敏感，反而不利于专注。',
            classmates: ['小明：我选B，亲测有效！', '小红：白噪音确实很有用', '小李：C不对，切换会分心']
        },
        {
            id: 'q_att_002',
            type: 'choice',
            category: 'attention',
            difficulty: 2,
            question: '舒尔特方格训练的核心原理是什么？',
            options: [
                'A. 训练眼球快速移动',
                'B. 训练视觉广度和注意力分配',
                'C. 训练数字记忆能力',
                'D. 训练手眼协调'
            ],
            answer: 'B',
            explanation: '舒尔特方格不仅训练眼球移动，更重要的是扩大视觉注意广度，提高注意力的分配和转移能力。',
            classmates: ['小王：原来如此，我以为只是练眼力', '小张：B是对的，我看过相关研究', '小陈：这个训练确实有效']
        },
        {
            id: 'q_att_003',
            type: 'choice',
            category: 'attention',
            difficulty: 2,
            question: '以下哪种注意力训练方法被科学证明最有效？',
            options: [
                'A. 长时间静坐什么都不想',
                'B. 正念冥想 + 有节奏的呼吸',
                'C. 反复做同一道难题',
                'D. 边听音乐边背书'
            ],
            answer: 'B',
            explanation: '正念冥想结合有节奏的呼吸是目前科学研究中证明最有效的注意力训练方法，能够激活前额叶皮层。',
            classmates: ['小赵：我每天都做正念，确实专注多了', '小钱：B正确，心理学课上学过', '小孙：A会让人走神的']
        }
    ],
    memory: [
        {
            id: 'q_mem_001',
            type: 'choice',
            category: 'memory',
            difficulty: 1,
            question: '记忆宫殿法的核心是什么？',
            options: [
                'A. 把要记的内容写在纸上',
                'B. 将信息与熟悉的空间位置关联',
                'C. 反复大声朗读',
                'D. 用彩色笔做标记'
            ],
            answer: 'B',
            explanation: '记忆宫殿法利用人脑对空间位置的超强记忆能力，将抽象信息转化为空间中的具体物体，大幅提升记忆效果。',
            classmates: ['小林：这个方法太神奇了！', '小冯：我用这个记单词超好用', '小陈：空间记忆确实是强项']
        },
        {
            id: 'q_mem_002',
            type: 'choice',
            category: 'memory',
            difficulty: 2,
            question: '艾宾浩斯遗忘曲线告诉我们什么？',
            options: [
                'A. 学习后立刻复习最有效',
                'B. 遗忘是匀速的',
                'C. 学习后1天、3天、7天分阶段复习效果最好',
                'D. 只要足够聪明就不会遗忘'
            ],
            answer: 'C',
            explanation: '遗忘不是匀速的，而是先快后慢。在关键时间点（1天、3天、7天）复习，能将短期记忆转化为长期记忆。',
            classmates: ['小周：这个原理太重要了', '小吴：我就是按这个节奏复习的', '小郑：A不对，立刻复习不是最优的']
        },
        {
            id: 'q_mem_003',
            type: 'choice',
            category: 'memory',
            difficulty: 2,
            question: '联想记忆法的科学依据是什么？',
            options: [
                'A. 大脑对图像的记忆远优于文字',
                'B. 联想会让人分心',
                'C. 联想需要很高的智商',
                'D. 只有作家才能用好联想'
            ],
            answer: 'A',
            explanation: '人类大脑进化使得我们对视觉图像和故事情节的记忆能力远强于抽象文字。联想记忆法正是利用了这一特点。',
            classmates: ['小王：图像记忆确实强', '小张：编故事记东西超好用', '小李：我要好好练习联想']
        }
    ],
    strategy: [
        {
            id: 'q_str_001',
            type: 'choice',
            category: 'strategy',
            difficulty: 1,
            question: '费曼技巧的核心步骤是什么？',
            options: [
                'A. 死记硬背概念定义',
                'B. 用最简单的语言向他人解释概念',
                'C. 大量做题',
                'D. 看教学视频'
            ],
            answer: 'B',
            explanation: '费曼技巧的核心是：如果你不能用简单的语言向一个小学生解释清楚一个概念，说明你自己还没有真正理解。',
            classmates: ['小明：这个方法帮我搞定了好多难题', '小红：教别人就是最好的学习', '小李：B选项完全正确']
        },
        {
            id: 'q_str_002',
            type: 'choice',
            category: 'strategy',
            difficulty: 2,
            question: '学习金字塔理论中，学习留存率最高的是？',
            options: [
                'A. 听讲：5%',
                'B. 阅读：10%',
                'C. 实践练习：75%',
                'D. 教别人：90%'
            ],
            answer: 'D',
            explanation: '学习金字塔研究表明，主动学习（教别人、实践）的学习留存率远高于被动学习（听讲、阅读）。',
            classmates: ['小王：教别人确实学得最扎实', '小张：我教同桌后自己理解更深了', '小陈：实践也很重要，但教别人更高']
        },
        {
            id: 'q_str_003',
            type: 'choice',
            category: 'strategy',
            difficulty: 2,
            question: '番茄工作法25分钟专注的科学依据是什么？',
            options: [
                'A. 25分钟是任意设定的',
                'B. 人能够保持高度专注的时间大约是20-30分钟',
                'C. 这是番茄的成熟时间',
                'D. 每25分钟老板会检查一次'
            ],
            answer: 'B',
            explanation: '认知科学研究表明，大多数成年人能够保持高度专注的时间是20-30分钟，超过这个时间注意力会明显下降。',
            classmates: ['小赵：原来如此，不是随便定的', '小钱：我觉得25分钟刚好', '小孙：专注后需要休息一下']
        }
    ],
    mindset: [
        {
            id: 'q_ms_001',
            type: 'choice',
            category: 'mindset',
            difficulty: 1,
            question: '成长型思维 vs 固定型思维，以下哪个是成长型思维？',
            options: [
                'A. 我天生就不是学习的料',
                'B. 只要努力，我一定能学会',
                'C. 这个太难了，我放弃',
                'D. 别人比我聪明，我比不上'
            ],
            answer: 'B',
            explanation: '成长型思维相信能力可以通过努力和学习不断提升，而固定型思维认为能力是天生的、不可改变的。',
            classmates: ['小林：这个太重要了，心态决定一切', '小冯：我以前是固定型，现在改了', '小陈：努力真的可以改变']
        },
        {
            id: 'q_ms_002',
            type: 'choice',
            category: 'mindset',
            difficulty: 2,
            question: '遇到挫折时，以下哪种反应最有利于成长？',
            options: [
                'A. 自责为什么这么笨',
                'B. 分析问题出在哪里，寻找改进方法',
                'C. 逃避问题，去做简单的事',
                'D. 抱怨运气不好'
            ],
            answer: 'B',
            explanation: '面对挫折时，分析问题并寻找改进方案是成长型思维的体现，而自责、逃避和抱怨都会阻碍个人成长。',
            classmates: ['小周：我以前总是A，现在学会B了', '小吴：B是正确的，分析比抱怨有用', '小郑：从失败中学习才是王道']
        },
        {
            id: 'q_ms_003',
            type: 'choice',
            category: 'mindset',
            difficulty: 2,
            question: '自我效能感指的是什么？',
            options: [
                'A. 认为自己什么都能做到',
                'B. 对自己能否完成某项任务的信念',
                'C. 自恋的表现',
                'D. 对他人的评价'
            ],
            answer: 'B',
            explanation: '自我效能感是班杜拉提出的重要概念，指个体对自己能否完成某一任务的能力判断和信念，它直接影响努力程度和坚持性。',
            classmates: ['小王：这个概念很重要', '小张：B是正确答案，心理学课上学的', '小李：自我效能感可以通过成功经验提升']
        }
    ]
};

// 同学系统（虚拟同学配置）
const classmates = [
    { id: 'xiaoming', name: '小明', avatar: '🧒', personality: '认真好学，总是第一个回答问题', score: 850 },
    { id: 'xiaohong', name: '小红', avatar: '👧', personality: '细心体贴，喜欢帮大家解释问题', score: 920 },
    { id: 'xiaoli', name: '小李', avatar: '🧑', personality: '逻辑清晰，擅长分析问题', score: 880 },
    { id: 'xiaowang', name: '小王', avatar: '🧔', personality: '幽默风趣，总能让学习变轻松', score: 790 },
    { id: 'xiaozhang', name: '小张', avatar: '👨', personality: '学霸级人物，答案总是很专业', score: 950 },
    { id: 'xiaozhao', name: '小赵', avatar: '🧕', personality: '勤奋努力，每天都在进步', score: 820 },
    { id: 'xiaolin', name: '小林', avatar: '👩', personality: '创造力强，总有新奇想法', score: 860 },
    { id: 'xiaozhou', name: '小周', avatar: '🧒', personality: '坚持不懈，不轻易放弃', score: 800 }
];

// 初始化游戏模块
export function initTrainingGame() {
    // 从存储加载游戏数据
    const savedData = storage.get(STORAGE_KEY, {
        currentQuestion: null,
        score: 0,
        answeredQuestions: [],
        classmateInteractions: {},
        ranking: generateRanking()
    });

    // 初始化 store
    store.setState('trainingGame', {
        questionBank,
        classmates,
        currentQuestion: null,
        currentCategory: null,
        score: savedData.score,
        answeredQuestions: savedData.answeredQuestions,
        ranking: savedData.ranking,
        gameHistory: []
    });

    // 监听游戏事件
    eventBus.on('game:answerQuestion', handleAnswer);
    eventBus.on('game:selectCategory', selectCategory);
    eventBus.on('game:nextQuestion', getNextQuestion);

    console.log('[TrainingGame] 游戏模块初始化完成');
    eventBus.emit('module:ready', 'trainingGame');
}

// 生成排行榜
function generateRanking() {
    return classmates
        .map(c => ({ ...c }))
        .sort((a, b) => b.score - a.score);
}

// 选择题目分类
export function selectCategory(category) {
    const game = store.getState('trainingGame');
    store.setState('trainingGame', {
        ...game,
        currentCategory: category,
        currentQuestion: null
    });

    eventBus.emit('game:categorySelected', category);
    return getNextQuestion(category);
}

// 获取下一题
export function getNextQuestion(category = null) {
    const game = store.getState('trainingGame');
    const targetCategory = category || game.currentCategory;

    if (!targetCategory || !questionBank[targetCategory]) {
        return null;
    }

    const questions = questionBank[targetCategory];
    const unanswered = questions.filter(q => !game.answeredQuestions.includes(q.id));

    if (unanswered.length === 0) {
        // 所有题目都做完了，重置
        store.setState('trainingGame', {
            ...game,
            answeredQuestions: []
        });
        showToast('恭喜！你完成了这个分类的所有题目，开始新一轮！');
        return questions[0];
    }

    // 随机选一道未做的题
    const randomIndex = Math.floor(Math.random() * unanswered.length);
    const nextQuestion = unanswered[randomIndex];

    store.setState('trainingGame', {
        ...game,
        currentQuestion: nextQuestion
    });

    eventBus.emit('game:newQuestion', nextQuestion);
    return nextQuestion;
}

// 处理答题
export function handleAnswer({ questionId, answer }) {
    const game = store.getState('trainingGame');
    const question = findQuestion(questionId);

    if (!question) {
        showToast('题目不存在');
        return null;
    }

    const isCorrect = answer === question.answer;
    const scoreGain = isCorrect ? (question.difficulty * 10) : 0;

    // 更新分数和答题记录
    const newScore = game.score + scoreGain;
    const newAnswered = [...game.answeredQuestions, questionId];

    // 更新排行榜（用户分数）
    const updatedRanking = game.ranking.map(c => ({ ...c }));

    store.setState('trainingGame', {
        ...game,
        score: newScore,
        answeredQuestions: newAnswered,
        ranking: updatedRanking
    });

    // 保存到存储
    storage.set(STORAGE_KEY, {
        score: newScore,
        answeredQuestions: newAnswered,
        ranking: updatedRanking
    });

    const result = {
        question,
        userAnswer: answer,
        isCorrect,
        scoreGain,
        newScore,
        classmatesComments: question.classmates || []
    };

    eventBus.emit('game:answerResult', result);

    if (isCorrect) {
        showToast(`回答正确！+${scoreGain}分`);
    } else {
        showToast('回答错误，再想想吧！');
    }

    return result;
}

// 查找题目
function findQuestion(questionId) {
    for (const category of Object.keys(questionBank)) {
        const found = questionBank[category].find(q => q.id === questionId);
        if (found) return found;
    }
    return null;
}

// 获取同学评论
export function getClassmateComments(questionId) {
    const question = findQuestion(questionId);
    return question?.classmates || [];
}

// 获取排行榜
export function getRanking() {
    const game = store.getState('trainingGame');
    return game.ranking;
}

// 获取当前分数
export function getCurrentScore() {
    const game = store.getState('trainingGame');
    return game.score;
}

// 获取学习进度
export function getGameProgress() {
    const game = store.getState('trainingGame');
    const total = Object.values(questionBank).flat().length;
    const answered = game.answeredQuestions.length;

    return {
        total,
        answered,
        progress: total > 0 ? Math.round((answered / total) * 100) : 0,
        score: game.score
    };
}

// 获取分类列表
export function getCategories() {
    return [
        { id: 'attention', name: '注意力训练', icon: '👁️', count: questionBank.attention.length },
        { id: 'memory', name: '记忆力训练', icon: '🧠', count: questionBank.memory.length },
        { id: 'strategy', name: '学习策略', icon: '📚', count: questionBank.strategy.length },
        { id: 'mindset', name: '思维模式', icon: '💡', count: questionBank.mindset.length }
    ];
}

// 同学互动：发起讨论
export function startClassDiscussion(questionId) {
    const question = findQuestion(questionId);
    if (!question) return null;

    // 随机选择3-5个同学参与讨论
    const numClassmates = Math.floor(Math.random() * 3) + 3;
    const selectedClassmates = [...classmates]
        .sort(() => Math.random() - 0.5)
        .slice(0, numClassmates);

    const discussion = selectedClassmates.map(classmate => ({
        classmate,
        message: generateClassmateComment(classmate, question)
    }));

    eventBus.emit('game:discussion', { questionId, discussion });
    return discussion;
}

// 生成同学评论
function generateClassmateComment(classmate, question) {
    const comments = {
        xiaoming: ['这道题我想了好久，终于明白了！', '认真读题，答案就在题目里', '我觉得这个知识点很重要'],
        xiaohong: ['大家别急，慢慢分析~', '我来给大家解释一下吧', '这个地方确实容易出错'],
        xiaoli: ['从逻辑上看，应该是这样的...', '我们可以从几个角度分析', '让我来梳理一下思路'],
        xiaowang: ['哈哈，这题我猜对了！', '学习也要开心呀~', '这题太有意思了'],
        xiaozhang: ['根据研究表明...', '这个理论的核心是...', '从专业角度来看...'],
        xiaozhao: ['我要记下来，以后复习', '今天又学到新知识了！', '继续加油！'],
        xiaolin: ['我有一个新奇的想法...', '我们可以换个角度看问题', '这个方法很有创意'],
        xiaozhou: ['坚持就是胜利！', '再难的题也能搞定', '我相信大家都能学会']
    };

    const classmateComments = comments[classmate.id] || comments.xiaoming;
    return classmateComments[Math.floor(Math.random() * classmateComments.length)];
}

// 重置游戏
export function resetGame() {
    const game = store.getState('trainingGame');

    storage.set(STORAGE_KEY, {
        score: 0,
        answeredQuestions: [],
        ranking: generateRanking()
    });

    store.setState('trainingGame', {
        ...game,
        score: 0,
        answeredQuestions: [],
        currentQuestion: null,
        currentCategory: null,
        ranking: generateRanking()
    });

    showToast('游戏已重置，重新开始！');
    eventBus.emit('game:reset');
}

export default {
    initTrainingGame,
    selectCategory,
    getNextQuestion,
    handleAnswer,
    getClassmateComments,
    getRanking,
    getCurrentScore,
    getGameProgress,
    getCategories,
    startClassDiscussion,
    resetGame
};

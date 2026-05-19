/* 母题库模块 - ES6 Modules 标准
 * 完整的认知训练题库管理系统
 * 包含：母题、变式题、难度分级、知识点标签、解析
 */

import { store } from '../store.js';
import { eventBus } from '../eventBus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'question_bank_data';

// 难度等级
const DIFFICULTY = {
    EASY: { id: 'easy', name: '入门', color: '#52c41a', stars: 1 },
    MEDIUM: { id: 'medium', name: '进阶', color: '#faad14', stars: 2 },
    HARD: { id: 'hard', name: '挑战', color: '#f5222d', stars: 3 },
    EXPERT: { id: 'expert', name: '大师', color: '#722ed1', stars: 4 }
};

// 知识点分类
const KNOWLEDGE_POINTS = {
    memory: { id: 'memory', name: '记忆力', icon: '🧠' },
    logic: { id: 'logic', name: '逻辑思维', icon: '🔢' },
    spatial: { id: 'spatial', name: '空间想象', icon: '🧩' },
    creativity: { id: 'creativity', name: '创造力', icon: '💡' },
    attention: { id: 'attention', name: '注意力', icon: '🎯' },
    language: { id: 'language', name: '语言能力', icon: '📝' },
    math: { id: 'math', name: '数学思维', icon: '📊' }
};

// 母题库数据（包含母题及变式）
const DEFAULT_QUESTIONS = [
    // ===== 第一组：数字记忆 =====
    {
        id: 'q_m_001',
        type: 'memory',
        title: '数字记忆 - 母题',
        category: 'memory',
        difficulty: 'easy',
        isMaster: true,
        variants: ['q_m_001_v1', 'q_m_001_v2', 'q_m_001_v3'],
        question: '请记住以下数字序列，然后按顺序复述：',
        content: { numbers: [3, 7, 2, 9, 1, 5, 8, 4] },
        timeLimit: 30,
        points: 10,
        explanation: '使用分组记忆法：将数字分成两组：3729 和 1584',
        tips: ['分组记忆', '谐音联想', '位置记忆'],
        tags: ['数字记忆', '短时记忆', '序列记忆']
    },
    {
        id: 'q_m_001_v1',
        type: 'memory',
        title: '数字记忆 - 变式1',
        category: 'memory',
        difficulty: 'easy',
        isMaster: false,
        parentId: 'q_m_001',
        question: '请记住以下数字序列，然后按顺序复述：',
        content: { numbers: [5, 2, 8, 3, 9, 1, 6, 4, 7] },
        timeLimit: 35,
        points: 12,
        explanation: '增加一个数字，使用故事联想法',
        tags: ['数字记忆', '进阶练习']
    },
    {
        id: 'q_m_001_v2',
        type: 'memory',
        title: '数字记忆 - 变式2',
        category: 'memory',
        difficulty: 'medium',
        isMaster: false,
        parentId: 'q_m_001',
        question: '请记住以下数字序列，然后倒序复述：',
        content: { numbers: [4, 6, 2, 8, 5, 3, 9, 1] },
        timeLimit: 40,
        points: 15,
        explanation: '需要先正序记忆再反转，使用地点桩法',
        tags: ['倒序记忆', '进阶练习']
    },
    {
        id: 'q_m_001_v3',
        type: 'memory',
        title: '数字记忆 - 变式3',
        category: 'memory',
        difficulty: 'hard',
        isMaster: false,
        parentId: 'q_m_001',
        question: '请记住以下16个数字，然后按顺序复述：',
        content: { numbers: [7, 2, 5, 9, 1, 4, 8, 3, 6, 2, 9, 5, 1, 7, 4, 8] },
        timeLimit: 60,
        points: 25,
        explanation: '使用记忆宫殿，每4个数字一个房间',
        tags: ['大容量记忆', '记忆宫殿']
    },

    // ===== 第二组：逻辑推理 =====
    {
        id: 'q_l_001',
        type: 'logic',
        title: '数列推理 - 母题',
        category: 'logic',
        difficulty: 'easy',
        isMaster: true,
        variants: ['q_l_001_v1', 'q_l_001_v2', 'q_l_001_v3'],
        question: '找出下一个数字：',
        content: { sequence: [2, 4, 6, 8, 10, '?'], options: ['11', '12', '13', '14'], answer: '12' },
        timeLimit: 45,
        points: 10,
        explanation: '等差数列，公差为2。观察规律：每个数比前一个数大2',
        tips: ['找公差', '看趋势', '验证规律'],
        tags: ['数列推理', '等差数列']
    },
    {
        id: 'q_l_001_v1',
        type: 'logic',
        title: '数列推理 - 变式1',
        category: 'logic',
        difficulty: 'medium',
        isMaster: false,
        parentId: 'q_l_001',
        question: '找出下一个数字：',
        content: { sequence: [1, 1, 2, 3, 5, 8, '?'], options: ['11', '12', '13', '14'], answer: '13' },
        timeLimit: 60,
        points: 15,
        explanation: '斐波那契数列，每个数是前两个数之和',
        tags: ['斐波那契', '递推数列']
    },
    {
        id: 'q_l_001_v2',
        type: 'logic',
        title: '数列推理 - 变式2',
        category: 'logic',
        difficulty: 'hard',
        isMaster: false,
        parentId: 'q_l_001',
        question: '找出下一个数字：',
        content: { sequence: [2, 6, 12, 20, 30, '?'], options: ['40', '42', '44', '46'], answer: '42' },
        timeLimit: 75,
        points: 20,
        explanation: 'n*(n+1) 规律，或相邻差为4,6,8,10递增',
        tags: ['复合规律', '高阶等差数列']
    },
    {
        id: 'q_l_001_v3',
        type: 'logic',
        title: '数列推理 - 变式3',
        category: 'logic',
        difficulty: 'expert',
        isMaster: false,
        parentId: 'q_l_001',
        question: '找出下一个数字：',
        content: { sequence: [3, 14, 39, 84, '?'], options: ['155', '160', '165', '170'], answer: '155' },
        timeLimit: 90,
        points: 30,
        explanation: 'n³ + n² + n 的规律',
        tags: ['高阶推理', '立方规律']
    },

    // ===== 第三组：空间想象 =====
    {
        id: 'q_s_001',
        type: 'spatial',
        title: '图形折叠 - 母题',
        category: 'spatial',
        difficulty: 'easy',
        isMaster: true,
        variants: ['q_s_001_v1', 'q_s_001_v2'],
        question: '将正方形沿虚线折叠，得到的图形是？',
        content: { shape: 'square', foldType: 'diagonal' },
        timeLimit: 60,
        points: 15,
        explanation: '沿对角线折叠后，正方形变为三角形',
        tips: ['想象折叠过程', '关注边的重合', '手画辅助'],
        tags: ['平面折叠', '空间转换']
    },

    // ===== 更多题目 =====
    // 创造力
    {
        id: 'q_c_001',
        type: 'creativity',
        title: '发散思维 - 物体用途',
        category: 'creativity',
        difficulty: 'easy',
        isMaster: true,
        variants: ['q_c_001_v1', 'q_c_001_v2'],
        question: '尽可能多地说出"回形针"的用途：',
        content: { object: '回形针', minAnswers: 5 },
        timeLimit: 120,
        points: 20,
        explanation: '从属性出发：金属、弯曲、形状、重量...',
        tips: ['属性列举', '场景转换', '组合创新'],
        tags: ['发散思维', '用途列举']
    },

    // 注意力
    {
        id: 'q_a_001',
        type: 'attention',
        title: '舒尔特方格 - 母题',
        category: 'attention',
        difficulty: 'easy',
        isMaster: true,
        variants: ['q_a_001_v1', 'q_a_001_v2'],
        question: '按顺序点击1-25的数字：',
        content: { gridSize: 5, numbers: [21, 11, 7, 1, 18, 15, 25, 3, 22, 9, 13, 5, 19, 17, 2, 20, 10, 24, 8, 14, 4, 16, 6, 23, 12] },
        timeLimit: 60,
        points: 15,
        explanation: '专注搜索，眼动训练，提升注意力广度',
        tips: ['视线居中', '不默念', '保持节奏'],
        tags: ['舒尔特方格', '注意力广度', '眼动训练']
    }
];

const DEFAULT_DATA = {
    questions: DEFAULT_QUESTIONS,
    userProgress: {},
    masterCompleted: [],
    studyPlan: {
        dailyGoal: 5,
        categories: ['memory', 'logic', 'spatial'],
        difficultyRange: ['easy', 'medium']
    },
    stats: {
        totalAnswered: 0,
        correctCount: 0,
        totalPoints: 0,
        studyDays: 0
    },
    favorites: [],
    wrongQuestions: []
};

// 初始化模块
export function initQuestionBank() {
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    store.setState('questionBank', data);
    console.log('[QuestionBank] 母题库模块初始化完成');
    eventBus.emit('module:ready', 'questionBank');
}

// 获取数据
export function getQuestionBankData() {
    return store.getState('questionBank');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('questionBank', data);
    eventBus.emit('questionBank:updated', data);
}

// ===== 题库查询 =====

// 获取所有母题
export function getMasterQuestions(category = null, difficulty = null) {
    const data = getQuestionBankData();
    let questions = data.questions.filter(q => q.isMaster);
    
    if (category) {
        questions = questions.filter(q => q.category === category);
    }
    if (difficulty) {
        questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    return questions;
}

// 获取题目变式
export function getVariants(questionId) {
    const data = getQuestionBankData();
    const question = data.questions.find(q => q.id === questionId);
    
    if (!question || !question.variants) return [];
    
    return data.questions.filter(q => question.variants.includes(q.id));
}

// 按分类获取题目
export function getQuestionsByCategory(category, includeVariants = true) {
    const data = getQuestionBankData();
    let questions = data.questions.filter(q => q.category === category);
    
    if (!includeVariants) {
        questions = questions.filter(q => q.isMaster);
    }
    
    return questions;
}

// 按难度获取题目
export function getQuestionsByDifficulty(difficulty) {
    const data = getQuestionBankData();
    return data.questions.filter(q => q.difficulty === difficulty);
}

// 随机获取题目
export function getRandomQuestions(count, category = null, difficulty = null) {
    let pool = getQuestionsByCategory(category || 'memory');
    
    if (difficulty) {
        pool = pool.filter(q => q.difficulty === difficulty);
    }
    
    // 打乱顺序
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 获取单个题目
export function getQuestionById(id) {
    const data = getQuestionBankData();
    return data.questions.find(q => q.id === id);
}

// 搜索题目
export function searchQuestions(keyword) {
    const data = getQuestionBankData();
    const kw = keyword.toLowerCase();
    return data.questions.filter(q => 
        q.title.toLowerCase().includes(kw) ||
        q.question.toLowerCase().includes(kw) ||
        q.tags.some(t => t.toLowerCase().includes(kw))
    );
}

// ===== 学习记录 =====

// 记录答题结果
export function recordAnswer(questionId, isCorrect, timeSpent, userAnswer = null) {
    const data = getQuestionBankData();
    
    if (!data.userProgress[questionId]) {
        data.userProgress[questionId] = {
            attempts: 0,
            correctCount: 0,
            lastAttempt: null,
            history: []
        };
    }
    
    const progress = data.userProgress[questionId];
    progress.attempts++;
    if (isCorrect) progress.correctCount++;
    progress.lastAttempt = new Date().toISOString();
    progress.history.push({
        time: new Date().toISOString(),
        isCorrect,
        timeSpent,
        userAnswer
    });
    
    data.stats.totalAnswered++;
    if (isCorrect) data.stats.correctCount++;
    
    saveData(data);
    return progress;
}

// 获取题目进度
export function getQuestionProgress(questionId) {
    const data = getQuestionBankData();
    return data.userProgress[questionId] || null;
}

// 获取掌握度
export function getMasteryLevel(questionId) {
    const progress = getQuestionProgress(questionId);
    if (!progress) return 0;
    
    const accuracy = progress.correctCount / progress.attempts;
    const attempts = progress.attempts;
    
    // 掌握度算法
    if (attempts >= 5 && accuracy >= 0.9) return 5;
    if (attempts >= 3 && accuracy >= 0.8) return 4;
    if (attempts >= 2 && accuracy >= 0.6) return 3;
    if (attempts >= 1 && accuracy >= 0.5) return 2;
    if (attempts >= 1) return 1;
    return 0;
}

// ===== 收藏功能 =====

export function addToFavorites(questionId) {
    const data = getQuestionBankData();
    if (!data.favorites.includes(questionId)) {
        data.favorites.push(questionId);
        saveData(data);
        return true;
    }
    return false;
}

export function removeFromFavorites(questionId) {
    const data = getQuestionBankData();
    const index = data.favorites.indexOf(questionId);
    if (index > -1) {
        data.favorites.splice(index, 1);
        saveData(data);
        return true;
    }
    return false;
}

export function isFavorite(questionId) {
    const data = getQuestionBankData();
    return data.favorites.includes(questionId);
}

export function getFavorites() {
    const data = getQuestionBankData();
    return data.favorites.map(id => getQuestionById(id)).filter(Boolean);
}

// ===== 错题本 =====

export function addToWrongQuestions(questionId, wrongAnswer, reason = '') {
    const data = getQuestionBankData();
    const existing = data.wrongQuestions.find(w => w.questionId === questionId);
    
    if (existing) {
        existing.wrongCount++;
        existing.lastWrong = new Date().toISOString();
        existing.reasons.push({ answer: wrongAnswer, reason, time: new Date().toISOString() });
    } else {
        data.wrongQuestions.push({
            questionId,
            wrongCount: 1,
            firstWrong: new Date().toISOString(),
            lastWrong: new Date().toISOString(),
            reasons: [{ answer: wrongAnswer, reason, time: new Date().toISOString() }]
        });
    }
    
    saveData(data);
    return data.wrongQuestions;
}

export function getWrongQuestions() {
    const data = getQuestionBankData();
    return data.wrongQuestions.map(w => ({
        ...w,
        question: getQuestionById(w.questionId)
    }));
}

// ===== 统计功能 =====

export function getStats() {
    const data = getQuestionBankData();
    const accuracy = data.stats.totalAnswered > 0 
        ? (data.stats.correctCount / data.stats.totalAnswered * 100).toFixed(1)
        : 0;
    
    return {
        ...data.stats,
        accuracy: parseFloat(accuracy)
    };
}

export function getCategoryStats() {
    const categories = Object.keys(KNOWLEDGE_POINTS);
    const result = {};
    
    categories.forEach(cat => {
        const questions = getQuestionsByCategory(cat, false);
        const answered = questions.filter(q => getQuestionProgress(q.id));
        const mastered = questions.filter(q => getMasteryLevel(q.id) >= 4);
        
        result[cat] = {
            total: questions.length,
            answered: answered.length,
            mastered: mastered.length,
            progress: questions.length > 0 
                ? Math.round((answered.length / questions.length) * 100) 
                : 0
        };
    });
    
    return result;
}

// ===== 学习计划 =====

export function getStudyPlan() {
    const data = getQuestionBankData();
    return data.studyPlan;
}

export function updateStudyPlan(plan) {
    const data = getQuestionBankData();
    data.studyPlan = { ...data.studyPlan, ...plan };
    saveData(data);
    return data.studyPlan;
}

// 获取今日推荐题目
export function getDailyRecommendations() {
    const plan = getStudyPlan();
    const recommendations = [];
    
    plan.categories.forEach(cat => {
        const questions = getRandomQuestions(2, cat, plan.difficultyRange[0]);
        recommendations.push(...questions);
    });
    
    // 打乱并按每日目标数量返回
    return recommendations.sort(() => Math.random() - 0.5).slice(0, plan.dailyGoal);
}

// 获取难度配置
export function getDifficultyConfig() {
    return DIFFICULTY;
}

// 获取知识点配置
export function getKnowledgePoints() {
    return KNOWLEDGE_POINTS;
}

export default {
    init: initQuestionBank,
    getData: getQuestionBankData,
    getMasterQuestions,
    getVariants,
    getQuestionsByCategory,
    getQuestionsByDifficulty,
    getRandomQuestions,
    getQuestionById,
    searchQuestions,
    recordAnswer,
    getQuestionProgress,
    getMasteryLevel,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    addToWrongQuestions,
    getWrongQuestions,
    getStats,
    getCategoryStats,
    getStudyPlan,
    updateStudyPlan,
    getDailyRecommendations,
    getDifficultyConfig,
    getKnowledgePoints
};

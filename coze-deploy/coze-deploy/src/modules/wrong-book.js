/* 错题本模块
 * 整合数据库 + 状态管理 + 事件同步
 * 实现跨模块错题数据实时同步
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { wrongBookDB, questionDB } from '../database/question-db.js';

const STORE_KEY = 'wrongBook';

// 初始化错题本模块
export function initWrongBook() {
    // 初始化 store 状态
    store.setState(STORE_KEY, {
        todayWrong: [],      // 今日错题
        toReview: [],        // 待复习
        mastered: [],        // 已掌握
        stats: {             // 统计
            total: 0,
            today: 0,
            mastered: 0,
            toReview: 0
        },
        lastSync: null
    });
    
    // 监听错题添加事件
    eventBus.on('question:wrong', async ({ userId, questionId, wrongAnswer, note }) => {
        await addWrongQuestion(userId, questionId, wrongAnswer, note);
    });
    
    // 监听题目重做事件
    eventBus.on('question:retry', async ({ userId, questionId, correct }) => {
        if (correct) {
            // 做对了，检查是否可以标记为已掌握
            await checkMastery(userId, questionId);
        } else {
            // 又错了，增加错误次数
            const wrongItems = await wrongBookDB.getByUserAndQuestion(userId, questionId);
            if (wrongItems) {
                await wrongBookDB.add(userId, questionId, '', '再次错误');
            }
        }
    });
    
    console.log('[WrongBook] 模块初始化完成');
    eventBus.emit('module:ready', 'wrongBook');
}

// 添加错题（自动调用）
export async function addWrongQuestion(userId, questionId, wrongAnswer, note = '') {
    try {
        const result = await wrongBookDB.add(userId, questionId, wrongAnswer, note);
        
        // 同步更新 store 状态
        await refreshStats(userId);
        
        // 广播事件
        eventBus.emit('wrongbook:added', {
            questionId,
            wrongAnswer,
            timestamp: new Date().toISOString()
        });
        
        console.log(`[WrongBook] 错题已记录: ${questionId}`);
        return result;
    } catch (error) {
        console.error('[WrongBook] 添加错题失败:', error);
        throw error;
    }
}

// 标记已掌握
export async function markAsMastered(userId, questionId, mastered = true) {
    const item = await wrongBookDB.getByUserAndQuestion(userId, questionId);
    if (!item) return;
    
    await wrongBookDB.markMastered(item.id, mastered);
    await refreshStats(userId);
    
    eventBus.emit('wrongbook:mastered', { questionId, mastered });
}

// 智能检查掌握程度（连续做对3次自动标记）
async function checkMastery(userId, questionId) {
    const item = await wrongBookDB.getByUserAndQuestion(userId, questionId);
    if (!item) return;
    
    // 错误次数 <= 1 且最近都做对了，自动标记为已掌握
    if (item.wrongCount <= 1) {
        await markAsMastered(userId, questionId, true);
        eventBus.emit('wrongbook:autoMastered', { questionId });
    }
}

// 刷新统计数据
export async function refreshStats(userId) {
    const stats = await wrongBookDB.getStats(userId);
    const today = await wrongBookDB.getToday(userId);
    const toReview = await wrongBookDB.getForReview(userId, 7);
    const mastered = (await wrongBookDB.getByUser(userId)).filter(w => w.mastered);
    
    store.setState(STORE_KEY, {
        ...store.getState(STORE_KEY),
        todayWrong: today,
        toReview: toReview,
        mastered: mastered,
        stats: stats,
        lastSync: new Date().toISOString()
    });
    
    eventBus.emit('wrongbook:statsUpdated', stats);
}

// 获取今日错题列表（带题目详情）
export async function getTodayWrong(userId) {
    const today = await wrongBookDB.getToday(userId);
    return await populateQuestions(today);
}

// 获取待复习题目
export async function getForReview(userId, days = 7) {
    const review = await wrongBookDB.getForReview(userId, days);
    return await populateQuestions(review);
}

// 获取已掌握题目
export async function getMastered(userId) {
    const all = await wrongBookDB.getByUser(userId);
    const mastered = all.filter(w => w.mastered);
    return await populateQuestions(mastered);
}

// 填充题目详情
async function populateQuestions(wrongItems) {
    const result = [];
    for (const item of wrongItems) {
        const question = await questionDB.get(item.questionId);
        if (question) {
            result.push({
                ...item,
                question: question
            });
        }
    }
    return result;
}

// 按学科分组统计
export async function getStatsBySubject(userId) {
    const all = await wrongBookDB.getByUser(userId);
    const stats = {};
    
    for (const item of all) {
        const question = await questionDB.get(item.questionId);
        if (question) {
            const subject = question.subject || '未分类';
            if (!stats[subject]) {
                stats[subject] = { total: 0, mastered: 0, toReview: 0 };
            }
            stats[subject].total++;
            if (item.mastered) {
                stats[subject].mastered++;
            } else {
                stats[subject].toReview++;
            }
        }
    }
    
    return stats;
}

// 按错误次数排序（高频错题）
export async function getTopWrong(userId, limit = 10) {
    const all = await wrongBookDB.getByUser(userId);
    const sorted = all
        .filter(w => !w.mastered)
        .sort((a, b) => b.wrongCount - a.wrongCount);
    
    return await populateQuestions(sorted.slice(0, limit));
}

// 删除错题记录
export async function removeWrongItem(userId, wrongBookId) {
    await wrongBookDB.remove(wrongBookId);
    await refreshStats(userId);
    eventBus.emit('wrongbook:removed', { wrongBookId });
}

// 清空所有错题（慎用）
export async function clearAll(userId) {
    const all = await wrongBookDB.getByUser(userId);
    for (const item of all) {
        await wrongBookDB.remove(item.id);
    }
    await refreshStats(userId);
    eventBus.emit('wrongbook:cleared');
}

// 获取统计概览
export function getCurrentStats() {
    const state = store.getState(STORE_KEY);
    return state.stats;
}

// 导出模块
export const wrongBook = {
    init: initWrongBook,
    add: addWrongQuestion,
    markMastered: markAsMastered,
    refreshStats,
    getToday: getTodayWrong,
    getForReview,
    getMastered,
    getStatsBySubject,
    getTopWrong,
    remove: removeWrongItem,
    clearAll,
    getStats: getCurrentStats
};

export default wrongBook;

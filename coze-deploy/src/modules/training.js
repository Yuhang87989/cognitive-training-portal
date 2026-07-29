/* 认知训练周计划模块
 * 管理 Week1-Week9 的训练计划、进度、完成状态
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';

const STORAGE_KEY = 'training_progress';

// 周计划数据（静态配置）
const weekPlans = {
    week1: {
        weekId: 'week1',
        weekTitle: 'Week1：注意力与记忆力基础训练周',
        weekDesc: '建立每日训练习惯，掌握基础注意力与记忆力训练方法',
        days: [
            {
                day: 1,
                title: '视觉注意力基础训练',
                tasks: [
                    { id: 'w1d1t1', title: '视觉追踪训练', type: 'attention', duration: 7, completed: false },
                    { id: 'w1d1t2', title: '图片记忆训练', type: 'memory', duration: 7, completed: false },
                    { id: 'w1d1t3', title: '记忆宫殿法学习与实践', type: 'strategy', duration: 6, completed: false }
                ]
            },
            {
                day: 2,
                title: '听觉注意力强化',
                tasks: [
                    { id: 'w1d2t1', title: '听觉警觉与声音识别', type: 'attention', duration: 7, completed: false },
                    { id: 'w1d2t2', title: '故事记忆与词语链训练', type: 'memory', duration: 7, completed: false },
                    { id: 'w1d2t3', title: '费曼技巧学习与实践', type: 'strategy', duration: 6, completed: false }
                ]
            },
            {
                day: 3,
                title: '多感官协同训练',
                tasks: [
                    { id: 'w1d3t1', title: '视听整合训练', type: 'attention', duration: 8, completed: false },
                    { id: 'w1d3t2', title: '多感官记忆练习', type: 'memory', duration: 8, completed: false },
                    { id: 'w1d3t3', title: '构建个人记忆宫殿', type: 'strategy', duration: 7, completed: false }
                ]
            },
            {
                day: 4,
                title: '专注力深度训练',
                tasks: [
                    { id: 'w1d4t1', title: '舒尔特方格训练', type: 'attention', duration: 10, completed: false },
                    { id: 'w1d4t2', title: '数字记忆挑战', type: 'memory', duration: 10, completed: false },
                    { id: 'w1d4t3', title: '费曼技巧实践讲解', type: 'strategy', duration: 8, completed: false }
                ]
            },
            {
                day: 5,
                title: '抗干扰能力训练',
                tasks: [
                    { id: 'w1d5t1', title: '背景噪音下的注意力训练', type: 'attention', duration: 10, completed: false },
                    { id: 'w1d5t2', title: '干扰环境记忆练习', type: 'memory', duration: 10, completed: false },
                    { id: 'w1d5t3', title: '记忆宫殿实战应用', type: 'strategy', duration: 8, completed: false }
                ]
            },
            {
                day: 6,
                title: '综合能力测评',
                tasks: [
                    { id: 'w1d6t1', title: '注意力综合测试', type: 'quiz', duration: 15, completed: false },
                    { id: 'w1d6t2', title: '记忆力综合测试', type: 'quiz', duration: 15, completed: false },
                    { id: 'w1d6t3', title: 'Week1学习总结', type: 'writing', duration: 10, completed: false }
                ]
            },
            {
                day: 7,
                title: '休息与复盘',
                tasks: [
                    { id: 'w1d7t1', title: '收听Week1复盘播客', type: 'podcast', duration: 15, completed: false },
                    { id: 'w1d7t2', title: '复盘本周训练效果', type: 'review', duration: 20, completed: false },
                    { id: 'w1d7t3', title: '自由休息', type: 'rest', duration: 0, completed: false }
                ]
            }
        ]
    }
};

// 初始化训练模块
export function initTraining() {
    // 从存储加载进度
    const savedProgress = storage.get(STORAGE_KEY, {});
    
    // 初始化 store
    store.setState('training', {
        currentWeek: 'week1',
        currentDay: 1,
        weekPlans: weekPlans,
        progress: savedProgress,
        stats: calculateStats(savedProgress)
    });
    
    // 监听任务完成事件
    eventBus.on('task:complete', ({ weekId, day, taskId }) => {
        markTaskComplete(weekId, day, taskId);
    });
    
    console.log('[Training] 模块初始化完成');
    eventBus.emit('module:ready', 'training');
}

// 标记任务完成
export function markTaskComplete(weekId, day, taskId) {
    const training = store.getState('training');
    const progress = { ...training.progress };
    
    if (!progress[weekId]) {
        progress[weekId] = {};
    }
    if (!progress[weekId][day]) {
        progress[weekId][day] = {};
    }
    
    progress[weekId][day][taskId] = {
        completed: true,
        completedAt: new Date().toISOString()
    };
    
    // 保存到存储
    storage.set(STORAGE_KEY, progress);
    
    // 更新 store
    store.setState('training', {
        ...training,
        progress: progress,
        stats: calculateStats(progress)
    });
    
    // 广播变化
    eventBus.emit('training:progress', { weekId, day, taskId, progress });
    eventBus.emit('stats:update', store.getState('training').stats);
    
    console.log(`[Training] 任务完成: ${weekId} Day${day} ${taskId}`);
}

// 检查任务是否完成
export function isTaskCompleted(weekId, day, taskId) {
    const training = store.getState('training');
    return training.progress?.[weekId]?.[day]?.[taskId]?.completed || false;
}

// 获取周计划
export function getWeekPlan(weekId) {
    const training = store.getState('training');
    return training.weekPlans[weekId];
}

// 获取某天的任务
export function getDayTasks(weekId, day) {
    const plan = getWeekPlan(weekId);
    if (!plan) return [];
    
    const dayPlan = plan.days.find(d => d.day === day);
    if (!dayPlan) return [];
    
    // 注入完成状态
    return dayPlan.tasks.map(task => ({
        ...task,
        completed: isTaskCompleted(weekId, day, task.id)
    }));
}

// 计算统计数据
function calculateStats(progress) {
    let totalTasks = 0;
    let completedTasks = 0;
    const weekStats = {};
    
    for (const weekId of Object.keys(weekPlans)) {
        const plan = weekPlans[weekId];
        let weekTotal = 0;
        let weekCompleted = 0;
        
        plan.days.forEach(day => {
            day.tasks.forEach(task => {
                weekTotal++;
                totalTasks++;
                if (progress[weekId]?.[day.day]?.[task.id]?.completed) {
                    weekCompleted++;
                    completedTasks++;
                }
            });
        });
        
        weekStats[weekId] = {
            total: weekTotal,
            completed: weekCompleted,
            progress: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
        };
    }
    
    return {
        totalTasks,
        completedTasks,
        overallProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        weekStats
    };
}

// 获取统计数据
export function getTrainingStats() {
    const training = store.getState('training');
    return training.stats;
}

// 重置周进度
export function resetWeekProgress(weekId) {
    const training = store.getState('training');
    const progress = { ...training.progress };
    
    delete progress[weekId];
    
    storage.set(STORAGE_KEY, progress);
    
    store.setState('training', {
        ...training,
        progress: progress,
        stats: calculateStats(progress)
    });
    
    eventBus.emit('training:reset', { weekId });
}

export default {
    initTraining,
    markTaskComplete,
    isTaskCompleted,
    getWeekPlan,
    getDayTasks,
    getTrainingStats,
    resetWeekProgress
};

/* 自驱力模块 - ES6 Modules 标准
 * 自我驱动能力培养：目标管理、习惯养成、打卡系统、成就感激励
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'self_drive_data';

// 默认数据结构
const DEFAULT_DATA = {
    goals: [],              // 目标列表
    habits: [],             // 习惯列表
    checkins: [],           // 打卡记录
    achievements: [],       // 成就徽章
    stats: {
        totalDays: 0,       // 总打卡天数
        currentStreak: 0,   // 当前连续天数
        maxStreak: 0,       // 最长连续天数
        totalGoals: 0,      // 完成目标数
        totalHabits: 0      // 养成习惯数
    },
    dailyQuote: null        // 每日励志语录
};

// 成就徽章配置
const ACHIEVEMENTS = [
    { id: 'first_goal', name: '起步者', icon: '🌱', desc: '创建第一个目标', condition: 'goals >= 1' },
    { id: 'streak_7', name: '坚持一周', icon: '📅', desc: '连续打卡7天', condition: 'streak >= 7' },
    { id: 'streak_30', name: '月度战士', icon: '🏆', desc: '连续打卡30天', condition: 'streak >= 30' },
    { id: 'goal_5', name: '目标达人', icon: '🎯', desc: '完成5个目标', condition: 'completedGoals >= 5' },
    { id: 'habit_3', name: '习惯养成者', icon: '🔄', desc: '养成3个习惯', condition: 'habits >= 3' },
    { id: 'days_100', name: '百日达人', icon: '💯', desc: '累计打卡100天', condition: 'totalDays >= 100' }
];

// 励志语录库
const QUOTES = [
    { text: "成功不是终点，失败也不是致命的，重要的是继续前进的勇气。", author: "温斯顿·丘吉尔" },
    { text: "唯一能限制你的就是你自己。", author: "未知" },
    { text: "每天进步一点点，坚持带来大改变。", author: "未知" },
    { text: "种一棵树最好的时间是十年前，其次是现在。", author: "非洲谚语" },
    { text: "你的时间有限，不要浪费在重复别人的生活上。", author: "史蒂夫·乔布斯" },
    { text: "痛苦是暂时的，成就是永恒的。", author: "未知" },
    { text: "行动不一定带来快乐，但没有行动就一定没有快乐。", author: "本杰明·迪斯雷利" },
    { text: "优秀不是一种行为，而是一种习惯。", author: "亚里士多德" }
];

// 初始化自驱力模块
export function initSelfDrive() {
    // 从存储加载数据
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    // 确保统计数据存在
    data.stats = { ...DEFAULT_DATA.stats, ...data.stats };
    
    // 初始化 store
    store.setState('selfDrive', data);
    
    // 检查并更新今日语录
    updateDailyQuote(data);
    
    // 检查连续打卡
    checkStreak(data);
    
    console.log('[SelfDrive] 自驱力模块初始化完成');
    eventBus.emit('module:ready', 'selfDrive');
}

// 获取数据
export function getSelfDriveData() {
    return store.getState('selfDrive');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('selfDrive', data);
    eventBus.emit('selfDrive:updated', data);
}

// ========== 目标管理 ==========

// 添加目标
export function addGoal(goalData) {
    const data = getSelfDriveData();
    const newGoal = {
        id: `goal_${Date.now()}`,
        title: goalData.title,
        desc: goalData.desc || '',
        category: goalData.category || 'study',
        targetDate: goalData.targetDate || null,
        progress: 0,
        milestones: goalData.milestones || [],
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    data.goals.push(newGoal);
    saveData(data);
    
    // 检查成就
    checkAchievements(data);
    
    showToast('目标已创建！');
    return newGoal;
}

// 更新目标进度
export function updateGoalProgress(goalId, progress) {
    const data = getSelfDriveData();
    const goal = data.goals.find(g => g.id === goalId);
    
    if (goal) {
        goal.progress = Math.min(100, Math.max(0, progress));
        
        // 检查是否完成
        if (goal.progress >= 100 && !goal.completed) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
            data.stats.totalGoals++;
            showToast('🎉 恭喜！目标已完成！');
            checkAchievements(data);
        }
        
        saveData(data);
        return goal;
    }
    return null;
}

// 删除目标
export function deleteGoal(goalId) {
    const data = getSelfDriveData();
    const index = data.goals.findIndex(g => g.id === goalId);
    
    if (index > -1) {
        data.goals.splice(index, 1);
        saveData(data);
        showToast('目标已删除');
        return true;
    }
    return false;
}

// ========== 习惯管理 ==========

// 添加习惯
export function addHabit(habitData) {
    const data = getSelfDriveData();
    const newHabit = {
        id: `habit_${Date.now()}`,
        name: habitData.name,
        icon: habitData.icon || '✅',
        frequency: habitData.frequency || 'daily',
        reminderTime: habitData.reminderTime || null,
        checkinDays: [],
        streak: 0,
        createdAt: new Date().toISOString()
    };
    
    data.habits.push(newHabit);
    saveData(data);
    
    showToast('习惯已创建！');
    return newHabit;
}

// 习惯打卡
export function checkinHabit(habitId, date = null) {
    const data = getSelfDriveData();
    const habit = data.habits.find(h => h.id === habitId);
    const checkinDate = date || new Date().toDateString();
    
    if (habit) {
        if (!habit.checkinDays.includes(checkinDate)) {
            habit.checkinDays.push(checkinDate);
            habit.streak = calculateHabitStreak(habit);
            saveData(data);
            showToast('✅ 打卡成功！');
            return true;
        } else {
            showToast('今天已经打卡过啦~');
            return false;
        }
    }
    return false;
}

// 取消打卡
export function uncheckinHabit(habitId, date = null) {
    const data = getSelfDriveData();
    const habit = data.habits.find(h => h.id === habitId);
    const checkinDate = date || new Date().toDateString();
    
    if (habit) {
        const index = habit.checkinDays.indexOf(checkinDate);
        if (index > -1) {
            habit.checkinDays.splice(index, 1);
            habit.streak = calculateHabitStreak(habit);
            saveData(data);
            showToast('已取消打卡');
            return true;
        }
    }
    return false;
}

// 删除习惯
export function deleteHabit(habitId) {
    const data = getSelfDriveData();
    const index = data.habits.findIndex(h => h.id === habitId);
    
    if (index > -1) {
        data.habits.splice(index, 1);
        saveData(data);
        showToast('习惯已删除');
        return true;
    }
    return false;
}

// 计算习惯连续天数
function calculateHabitStreak(habit) {
    if (habit.checkinDays.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
        const dateStr = currentDate.toDateString();
        if (habit.checkinDays.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// ========== 每日打卡系统 ==========

// 今日打卡
export function dailyCheckin() {
    const data = getSelfDriveData();
    const today = new Date().toDateString();
    
    if (!data.checkins.includes(today)) {
        data.checkins.push(today);
        data.stats.totalDays++;
        
        // 更新连续打卡
        data.stats.currentStreak = calculateOverallStreak(data.checkins);
        data.stats.maxStreak = Math.max(data.stats.maxStreak, data.stats.currentStreak);
        
        saveData(data);
        checkAchievements(data);
        
        showToast(`🌟 打卡成功！已连续 ${data.stats.currentStreak} 天`);
        return true;
    } else {
        showToast('今天已经打卡过啦~');
        return false;
    }
}

// 计算整体连续打卡天数
function calculateOverallStreak(checkins) {
    if (checkins.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
        const dateStr = currentDate.toDateString();
        if (checkins.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// 检查今日是否已打卡
export function hasCheckedInToday() {
    const data = getSelfDriveData();
    const today = new Date().toDateString();
    return data.checkins.includes(today);
}

// ========== 成就系统 ==========

// 检查成就
function checkAchievements(data) {
    const newAchievements = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        if (data.achievements.includes(achievement.id)) return;
        
        let unlocked = false;
        
        switch (achievement.condition.split(' ')[0]) {
            case 'goals':
                unlocked = data.goals.length >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'streak':
                unlocked = data.stats.currentStreak >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'completedGoals':
                unlocked = data.goals.filter(g => g.completed).length >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'habits':
                unlocked = data.habits.length >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'totalDays':
                unlocked = data.stats.totalDays >= parseInt(achievement.condition.split('>=')[1]);
                break;
        }
        
        if (unlocked) {
            data.achievements.push(achievement.id);
            newAchievements.push(achievement);
        }
    });
    
    if (newAchievements.length > 0) {
        newAchievements.forEach(a => {
            setTimeout(() => {
                showToast(`🏆 解锁成就：${a.name}！`);
            }, 500);
        });
        eventBus.emit('selfDrive:achievementUnlocked', newAchievements);
    }
}

// 获取所有成就（包含未解锁）
export function getAllAchievements() {
    const data = getSelfDriveData();
    return ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: data.achievements.includes(a.id)
    }));
}

// ========== 每日励志语录 ==========

// 更新每日语录
function updateDailyQuote(data) {
    const today = new Date().toDateString();
    
    if (!data.dailyQuote || data.dailyQuote.date !== today) {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        data.dailyQuote = {
            ...randomQuote,
            date: today
        };
        saveData(data);
    }
}

// 获取今日语录
export function getDailyQuote() {
    const data = getSelfDriveData();
    return data.dailyQuote;
}

// ========== 统计数据 ==========

// 获取统计数据
export function getSelfDriveStats() {
    const data = getSelfDriveData();
    return {
        ...data.stats,
        activeGoals: data.goals.filter(g => !g.completed).length,
        completedGoals: data.goals.filter(g => g.completed).length,
        totalHabits: data.habits.length,
        unlockedAchievements: data.achievements.length,
        totalAchievements: ACHIEVEMENTS.length
    };
}

// 检查连续打卡（每日启动时）
function checkStreak(data) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasToday = data.checkins.includes(today.toDateString());
    const hasYesterday = data.checkins.includes(yesterday.toDateString());
    
    if (!hasToday && !hasYesterday && data.stats.currentStreak > 0) {
        // 连续打卡中断
        data.stats.currentStreak = 0;
        saveData(data);
        showToast('💔 连续打卡中断了，重新开始吧！');
    }
}

export default {
    init: initSelfDrive,
    getData: getSelfDriveData,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addHabit,
    checkinHabit,
    uncheckinHabit,
    deleteHabit,
    dailyCheckin,
    hasCheckedInToday,
    getAllAchievements,
    getDailyQuote,
    getStats: getSelfDriveStats
};

/* 我的个人中心模块 - ES6 Modules 标准
 * 个人数据、每周回顾、学习统计、成就徽章、设置入口
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'my_center_data';

// 成就徽章配置
const ACHIEVEMENTS = [
    { id: 'first_week', name: '初学者', icon: '🌱', desc: '完成第一次周回顾', condition: 'weeklyReviews >= 1' },
    { id: 'week_streak_3', name: '坚持者', icon: '🔥', desc: '连续3周完成周回顾', condition: 'weeklyStreak >= 3' },
    { id: 'week_streak_7', name: '周更达人', icon: '⭐', desc: '连续7周完成周回顾', condition: 'weeklyStreak >= 7' },
    { id: 'total_hours_10', name: '学习达人', icon: '📚', desc: '累计学习10小时', condition: 'totalHours >= 10' },
    { id: 'total_hours_50', name: '学习专家', icon: '🎓', desc: '累计学习50小时', condition: 'totalHours >= 50' },
    { id: 'mindmap_5', name: '思维大师', icon: '🧠', desc: '创建5个思维导图', condition: 'mindmapCount >= 5' },
    { id: 'goals_10', name: '目标达人', icon: '🎯', desc: '完成10个目标', condition: 'completedGoals >= 10' },
    { id: 'habit_7', name: '习惯养成者', icon: '✅', desc: '连续打卡习惯7天', condition: 'habitStreak >= 7' },
    { id: 'all_round', name: '全能选手', icon: '🏆', desc: '同时激活3个以上学习模块', condition: 'activeModules >= 3' }
];

// 学习模块列表（仅首页没有的功能，避免重复）
const LEARNING_MODULES = [
    { id: 'pomodoro', name: '番茄专注', icon: '🍅', color: '#f093fb' },
    { id: 'wrongbook', name: '错题本', icon: '📒', color: '#43e97b' }
];

// 默认数据结构
const DEFAULT_DATA = {
    weeklyReviews: [],
    currentStreak: 0,
    maxStreak: 0,
    totalStudyHours: 0,
    studyRecords: [],
    unlockedAchievements: [],
    userProfile: {
        avatar: '🧑‍🎓',
        nickname: '学习者',
        motto: '每天进步一点点',
        level: 1,
        exp: 0
    }
};

// 周回顾模板问题
const WEEKLY_REVIEW_QUESTIONS = [
    { id: 'highlights', type: 'text', label: '✨ 本周亮点', placeholder: '本周最有成就感的事情是什么？' },
    { id: 'learned', type: 'text', label: '📚 学到了什么', placeholder: '这周学到了哪些新知识？' },
    { id: 'challenges', type: 'text', label: '⚡ 遇到的挑战', placeholder: '这周遇到了什么困难？如何解决的？' },
    { id: 'improve', type: 'text', label: '💡 需要改进的地方', placeholder: '下周可以在哪些方面做得更好？' },
    { id: 'nextWeekGoals', type: 'text', label: '🎯 下周目标', placeholder: '写下下周的学习目标' },
    { id: 'gratitude', type: 'text', label: '🙏 感恩事项', placeholder: '这周有什么值得感恩的事情？' },
    { id: 'rating', type: 'rating', label: '⭐ 本周评分', max: 5 }
];

// 初始化个人中心模块
export function initMyCenter() {
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    store.setState('myCenter', data);
    
    console.log('[MyCenter] 个人中心模块初始化完成');
    eventBus.emit('module:ready', 'myCenter');
}

// 获取数据
export function getMyCenterData() {
    return store.getState('myCenter');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('myCenter', data);
    eventBus.emit('myCenter:updated', data);
}

// ========== 周回顾功能 ==========

// 创建周回顾
export function createWeeklyReview(answers) {
    const data = getMyCenterData();
    const now = new Date();
    
    // 计算本周的周一日期（作为周ID）
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    const weekId = weekStart.toISOString().split('T')[0];
    
    // 检查是否已存在本周回顾
    const existingIndex = data.weeklyReviews.findIndex(r => r.weekId === weekId);
    
    const reviewData = {
        id: `review_${Date.now()}`,
        weekId,
        weekLabel: formatWeekLabel(weekStart),
        answers,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };
    
    if (existingIndex >= 0) {
        // 更新现有回顾
        reviewData.id = data.weeklyReviews[existingIndex].id;
        reviewData.createdAt = data.weeklyReviews[existingIndex].createdAt;
        data.weeklyReviews[existingIndex] = reviewData;
        showToast('周回顾已更新！');
    } else {
        // 新增回顾
        data.weeklyReviews.unshift(reviewData);
        data.currentStreak++;
        data.maxStreak = Math.max(data.maxStreak, data.currentStreak);
        showToast('🎉 周回顾已完成！继续加油！');
    }
    
    saveData(data);
    checkAchievements(data);
    
    return reviewData;
}

// 获取本周周回顾
export function getCurrentWeekReview() {
    const data = getMyCenterData();
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    const weekId = weekStart.toISOString().split('T')[0];
    
    return data.weeklyReviews.find(r => r.weekId === weekId);
}

// 获取所有周回顾
export function getAllWeeklyReviews() {
    const data = getMyCenterData();
    return data.weeklyReviews;
}

// 获取周回顾问题
export function getWeeklyReviewQuestions() {
    return WEEKLY_REVIEW_QUESTIONS;
}

// 格式化周标签
function formatWeekLabel(date) {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    
    return `${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
}

// ========== 学习记录功能 ==========

// 记录学习时间
export function recordStudyTime(minutes, module = 'general') {
    const data = getMyCenterData();
    const today = new Date().toISOString().split('T')[0];
    
    const record = {
        id: `record_${Date.now()}`,
        date: today,
        minutes,
        module,
        timestamp: new Date().toISOString()
    };
    
    data.studyRecords.unshift(record);
    data.totalStudyHours += minutes / 60;
    
    // 增加经验值
    addExp(minutes);
    
    saveData(data);
    checkAchievements(data);
    
    return record;
}

// 获取今日学习时长
export function getTodayStudyTime() {
    const data = getMyCenterData();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = data.studyRecords.filter(r => r.date === today);
    return todayRecords.reduce((sum, r) => sum + r.minutes, 0);
}

// 获取本周学习时长
export function getWeekStudyTime() {
    const data = getMyCenterData();
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekRecords = data.studyRecords.filter(r => new Date(r.timestamp) >= weekStart);
    return weekRecords.reduce((sum, r) => sum + r.minutes, 0);
}

// ========== 经验值与等级系统 ==========

// 增加经验值
function addExp(minutes) {
    const data = getMyCenterData();
    const expGain = Math.floor(minutes * 0.5); // 每分钟0.5经验值
    data.userProfile.exp += expGain;
    
    // 计算升级所需经验 (每级100经验)
    const expNeeded = data.userProfile.level * 100;
    if (data.userProfile.exp >= expNeeded) {
        data.userProfile.level++;
        data.userProfile.exp -= expNeeded;
        showToast(`🎉 恭喜升级！当前等级 Lv.${data.userProfile.level}`);
    }
}

// 获取等级进度
export function getLevelProgress() {
    const data = getMyCenterData();
    const { level, exp } = data.userProfile;
    const needed = level * 100;
    return {
        level,
        exp,
        needed,
        percentage: Math.round((exp / needed) * 100)
    };
}

// ========== 成就系统 ==========

// 检查成就解锁
function checkAchievements(data) {
    const stats = getStatistics(data);
    const newUnlocks = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        if (data.unlockedAchievements.includes(achievement.id)) return;
        
        let unlocked = false;
        
        switch (achievement.condition.split(' ')[0]) {
            case 'weeklyReviews':
                unlocked = data.weeklyReviews.length >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'weeklyStreak':
                unlocked = data.currentStreak >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'totalHours':
                unlocked = data.totalStudyHours >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'mindmapCount':
                unlocked = stats.mindmapCount >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'completedGoals':
                unlocked = stats.completedGoals >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'habitStreak':
                unlocked = stats.habitStreak >= parseInt(achievement.condition.split('>=')[1]);
                break;
            case 'activeModules':
                unlocked = stats.activeModules >= parseInt(achievement.condition.split('>=')[1]);
                break;
        }
        
        if (unlocked) {
            data.unlockedAchievements.push(achievement.id);
            newUnlocks.push(achievement);
        }
    });
    
    if (newUnlocks.length > 0) {
        newUnlocks.forEach(a => {
            setTimeout(() => {
                showToast(`🏆 解锁成就：${a.name}！`);
            }, 500);
        });
        eventBus.emit('myCenter:achievementUnlocked', newUnlocks);
    }
}

// 获取所有成就
export function getAllAchievements() {
    const data = getMyCenterData();
    return ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: data.unlockedAchievements.includes(a.id)
    }));
}

// ========== 个人资料 ==========

// 更新个人资料
export function updateProfile(profile) {
    const data = getMyCenterData();
    data.userProfile = { ...data.userProfile, ...profile };
    saveData(data);
    showToast('资料已更新！');
    return data.userProfile;
}

// 获取个人资料
export function getProfile() {
    const data = getMyCenterData();
    return data.userProfile;
}

// ========== 统计数据 ==========

// 获取统计数据
export function getStatistics(customData = null) {
    const data = customData || getMyCenterData();
    
    // 计算活跃模块数
    const activeModules = new Set();
    data.studyRecords.forEach(r => {
        if (r.module && r.module !== 'general') {
            activeModules.add(r.module);
        }
    });
    
    // 这里需要从其他模块获取数据，暂时用模拟数据
    const mindmapCount = storage.get('mindmap_data', { mindmaps: [] }).mindmaps?.length || 0;
    const selfDriveData = storage.get('self_drive_data', {});
    const completedGoals = selfDriveData.goals?.filter(g => g.completed).length || 0;
    const habitStreak = selfDriveData.stats?.currentStreak || 0;
    
    return {
        totalReviewCount: data.weeklyReviews.length,
        currentStreak: data.currentStreak,
        maxStreak: data.maxStreak,
        totalStudyHours: Math.round(data.totalStudyHours * 10) / 10,
        todayStudyMinutes: getTodayStudyTime(),
        weekStudyMinutes: getWeekStudyTime(),
        unlockedAchievements: data.unlockedAchievements.length,
        totalAchievements: ACHIEVEMENTS.length,
        activeModules: activeModules.size,
        mindmapCount,
        completedGoals,
        habitStreak
    };
}

// 获取学习模块列表
export function getLearningModules() {
    return LEARNING_MODULES;
}


// 导出所有个人数据
export function exportAllUserData() {
    const data = getMyCenterData();
    
    const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        module: 'my-center',
        data: {
            profile: data.profile,
            weeklyReviews: data.weeklyReviews,
            studyRecords: data.studyRecords,
            achievements: data.achievements,
            unlockedAchievements: data.unlockedAchievements,
            learningModules: data.learningModules,
            level: data.level,
            exp: data.exp
        }
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `认知训练-个人数据-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('✅ 个人数据导出成功！');
    return exportData;
}

// 导入个人数据
export function importUserData(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        if (!data.version || !data.data) {
            showToast('❌ 数据格式不正确');
            return false;
        }
        
        const myData = getMyCenterData();
        
        // 合并数据
        if (data.data.profile) {
            myData.profile = { ...myData.profile, ...data.data.profile };
        }
        if (data.data.weeklyReviews) {
            myData.weeklyReviews = data.data.weeklyReviews;
        }
        if (data.data.studyRecords) {
            myData.studyRecords = data.data.studyRecords;
        }
        if (data.data.achievements) {
            myData.achievements = data.data.achievements;
        }
        if (data.data.unlockedAchievements) {
            myData.unlockedAchievements = data.data.unlockedAchievements;
        }
        if (data.data.learningModules) {
            myData.learningModules = data.data.learningModules;
        }
        if (data.data.level) {
            myData.level = data.data.level;
        }
        if (data.data.exp) {
            myData.exp = data.data.exp;
        }
        
        storage.set(STORAGE_KEY, myData);
        store.setState('myCenter', myData);
        eventBus.emit('my-center:updated', myData);
        
        showToast('✅ 个人数据导入成功！');
        return true;
    } catch (e) {
        console.error('导入失败:', e);
        showToast('❌ 数据导入失败');
        return false;
    }
}

// 创建备份点
export function createBackupPoint(description = '') {
    const data = getMyCenterData();
    const backup = {
        id: `backup_${Date.now()}`,
        createdAt: new Date().toISOString(),
        description: description || '手动备份',
        data: {
            profile: data.profile,
            weeklyReviews: data.weeklyReviews,
            studyRecords: data.studyRecords,
            achievements: data.achievements,
            unlockedAchievements: data.unlockedAchievements,
            level: data.level,
            exp: data.exp
        }
    };
    
    if (!data.backups) {
        data.backups = [];
    }
    
    data.backups.unshift(backup);
    
    // 只保留最近10个备份
    if (data.backups.length > 10) {
        data.backups = data.backups.slice(0, 10);
    }
    
    storage.set(STORAGE_KEY, data);
    store.setState('myCenter', data);
    
    showToast('✅ 备份创建成功！');
    return backup;
}

// 获取所有备份
export function getAllBackups() {
    const data = getMyCenterData();
    return data.backups || [];
}

// 恢复到某个备份
export function restoreFromBackup(backupId) {
    const data = getMyCenterData();
    const backup = data.backups?.find(b => b.id === backupId);
    
    if (!backup) {
        showToast('❌ 备份不存在');
        return false;
    }
    
    // 恢复数据
    Object.assign(data, backup.data);
    
    storage.set(STORAGE_KEY, data);
    store.setState('myCenter', data);
    eventBus.emit('my-center:updated', data);
    
    showToast('✅ 已恢复到选中的备份！');
    return true;
}

// 删除备份
export function deleteBackup(backupId) {
    const data = getMyCenterData();
    
    if (data.backups) {
        data.backups = data.backups.filter(b => b.id !== backupId);
        storage.set(STORAGE_KEY, data);
        store.setState('myCenter', data);
    }
    
    showToast('备份已删除');
    return true;
}

export default {
    init: initMyCenter,
    getData: getMyCenterData,
    createWeeklyReview,
    getCurrentWeekReview,
    getAllWeeklyReviews,
    getWeeklyReviewQuestions,
    recordStudyTime,
    getTodayStudyTime,
    getWeekStudyTime,
    getLevelProgress,
    getAllAchievements,
    updateProfile,
    getProfile,
    getStatistics,
    getLearningModules,
    exportAllUserData,
    importUserData,
    createBackupPoint,
    getAllBackups,
    restoreFromBackup,
    deleteBackup
};

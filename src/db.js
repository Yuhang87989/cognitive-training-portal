/**
 * 数据库模块 - ES6 Modules 版本
 */

import { loadData, saveData, getCurrentUser } from './storage.js';

// 获取设置
export async function getSetting(key, defaultValue = null) {
    const data = loadData();
    return data.settings?.[key] ?? defaultValue;
}

// 保存设置
export async function saveSetting(key, value) {
    const data = loadData();
    if (!data.settings) data.settings = {};
    data.settings[key] = value;
    return saveData(data);
}

// 获取所有设置
export async function getAllSettings() {
    const data = loadData();
    return data.settings || {};
}

// 添加学习记录
export async function addRecord(record) {
    const data = loadData();
    if (!data.records) data.records = [];
    
    const newRecord = {
        id: 'record_' + Date.now(),
        userId: data.currentUser,
        ...record,
        createdAt: new Date().toISOString()
    };
    
    data.records.push(newRecord);
    saveData(data);
    return newRecord;
}

// 获取用户的学习记录
export async function getUserRecords(userId = null, limit = 100) {
    const data = loadData();
    const targetUserId = userId || data.currentUser;
    let records = data.records?.filter(r => r.userId === targetUserId) || [];
    records = records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return records.slice(0, limit);
}

// 获取统计数据
export async function getStats(userId = null) {
    const data = loadData();
    const targetUserId = userId || data.currentUser;
    const records = data.records?.filter(r => r.userId === targetUserId) || [];
    
    return {
        totalRecords: records.length,
        todayRecords: records.filter(r => {
            const recordDate = new Date(r.createdAt).toDateString();
            return recordDate === new Date().toDateString();
        }).length,
        streakDays: calculateStreak(records)
    };
}

// 计算连续学习天数
function calculateStreak(records) {
    if (records.length === 0) return 0;
    
    const dates = [...new Set(records.map(r => new Date(r.createdAt).toDateString()))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // 检查今天或昨天是否有记录
    if (dates[0] !== today && dates[0] !== yesterday) {
        return 0;
    }
    
    streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
        const current = new Date(dates[i]);
        const next = new Date(dates[i + 1]);
        const diffDays = (current - next) / (1000 * 60 * 60 * 24);
        
        if (diffDays <= 1) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// 导出所有数据
export function exportAllData() {
    return loadData();
}

// 导入数据
export function importAllData(newData, merge = false) {
    if (merge) {
        const currentData = loadData();
        const merged = {
            ...currentData,
            ...newData,
            users: [...(currentData.users || []), ...(newData.users || [])],
            records: [...(currentData.records || []), ...(newData.records || [])],
            settings: { ...currentData.settings, ...newData.settings }
        };
        return saveData(merged);
    } else {
        return saveData(newData);
    }
}

console.log('✅ db 模块加载完成');

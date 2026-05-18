/**
 * 存储模块 - ES6 Modules 版本
 */

import { STORAGE_KEY, OLD_KEYS } from './config.js';

// 默认用户
const DEFAULT_USER = {
    id: 'user_001',
    name: '学习者',
    grade: '未设置',
    difficulty: 1,
    createdAt: new Date().toISOString()
};

// 加载数据
export function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            // 确保数据结构完整
            if (!parsed.users || parsed.users.length === 0) {
                parsed.users = [{ ...DEFAULT_USER }];
            }
            if (!parsed.currentUser) {
                parsed.currentUser = parsed.users[0].id;
            }
            return parsed;
        }
    } catch (e) {
        console.warn('加载数据失败，尝试迁移旧数据:', e);
    }
    
    // 尝试迁移旧数据
    for (const oldKey of OLD_KEYS) {
        try {
            const oldData = localStorage.getItem(oldKey);
            if (oldData) {
                const parsed = JSON.parse(oldData);
                saveData(parsed);
                console.log('✅ 数据迁移成功:', oldKey);
                return parsed;
            }
        } catch (e) {
            // 继续尝试下一个key
        }
    }
    
    // 返回默认数据
    return {
        users: [{ ...DEFAULT_USER }],
        currentUser: DEFAULT_USER.id,
        records: [],
        settings: {}
    };
}

// 保存数据
export function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        return false;
    }
}

// 获取当前用户
export function getCurrentUser() {
    const data = loadData();
    if (!data.currentUser) return null;
    return data.users.find(u => u.id === data.currentUser) || null;
}

// 切换用户
export function switchUser(userId) {
    const data = loadData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
        data.currentUser = userId;
        saveData(data);
        return true;
    }
    return false;
}

// 创建新用户
export function createUser(userData) {
    const data = loadData();
    const newUser = {
        id: 'user_' + Date.now(),
        name: userData.name || '新用户',
        grade: userData.grade || '未设置',
        difficulty: userData.difficulty || 1,
        createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    data.currentUser = newUser.id;
    saveData(data);
    return newUser;
}

// 删除用户
export function deleteUser(userId) {
    const data = loadData();
    const index = data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
        data.users.splice(index, 1);
        // 如果删除的是当前用户，切换到第一个用户
        if (data.currentUser === userId && data.users.length > 0) {
            data.currentUser = data.users[0].id;
        } else if (data.users.length === 0) {
            data.currentUser = null;
        }
        saveData(data);
        return true;
    }
    return false;
}

// 初始化存储
export function init() {
    const data = loadData();
    console.log('✅ storage 模块初始化完成，当前用户:', data.currentUser);
}

console.log('✅ storage 模块加载完成');

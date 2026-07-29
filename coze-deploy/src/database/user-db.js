/* 用户数据库模块
 * 管理用户信息、学习进度、偏好设置等用户数据
 */

import { database } from './index.js';
import { eventBus } from '../event-bus.js';

// 用户 CRUD
export const userDB = {
    async create(userData) {
        const user = {
            id: userData.id || `user_${Date.now()}`,
            name: userData.name || '新用户',
            avatar: userData.avatar || '👤',
            email: userData.email || '',
            settings: userData.settings || {
                theme: 'light',
                language: 'zh-CN',
                notifications: true
            },
            profile: userData.profile || {
                grade: '',
                subject: '',
                studyGoal: ''
            },
            stats: userData.stats || {
                totalStudyTime: 0,
                completedTasks: 0,
                streakDays: 0,
                joinDate: new Date().toISOString().split('T')[0]
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('users', user);
    },
    
    async get(userId) {
        return await database.read('users', userId);
    },
    
    async update(userId, updates) {
        const user = await this.get(userId);
        if (!user) throw new Error('用户不存在');
        
        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('users', updatedUser);
    },
    
    async delete(userId) {
        return await database.delete('users', userId);
    },
    
    async getAll() {
        return await database.getAll('users');
    },
    
    // 更新学习统计
    async updateStats(userId, statUpdates) {
        const user = await this.get(userId);
        if (!user) throw new Error('用户不存在');
        
        user.stats = {
            ...user.stats,
            ...statUpdates
        };
        user.updatedAt = new Date().toISOString();
        
        return await database.update('users', user);
    },
    
    // 增加学习时间
    async addStudyTime(userId, minutes) {
        const user = await this.get(userId);
        if (!user) throw new Error('用户不存在');
        
        user.stats.totalStudyTime += minutes;
        user.updatedAt = new Date().toISOString();
        
        eventBus.emit('user:statsUpdated', { userId, addedTime: minutes });
        return await database.update('users', user);
    }
};

// 学习进度记录
export const progressDB = {
    async record(userId, moduleId, data) {
        return await database.create('userProgress', {
            userId,
            moduleId,
            data: data || {},
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        });
    },
    
    async getByUser(userId) {
        return await database.getByIndex('userProgress', 'userId', userId);
    },
    
    async getByModule(userId, moduleId) {
        const all = await this.getByUser(userId);
        return all.filter(p => p.moduleId === moduleId);
    },
    
    async getToday(userId) {
        const today = new Date().toISOString().split('T')[0];
        const all = await this.getByUser(userId);
        return all.filter(p => p.date === today);
    }
};

// 学习记录
export const studyRecordDB = {
    async record(userId, resourceId, resourceType, durationSeconds) {
        return await database.create('studyRecords', {
            userId,
            resourceId,
            resourceType,
            duration: durationSeconds,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        });
    },
    
    async getByUser(userId, days = 30) {
        const all = await database.getByIndex('studyRecords', 'userId', userId);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        
        return all.filter(r => r.date >= cutoffStr);
    }
};

// 笔记
export const noteDB = {
    async create(userId, resourceId, content) {
        return await database.create('notes', {
            userId,
            resourceId,
            content,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        });
    },
    
    async getByUser(userId) {
        return await database.getByIndex('notes', 'userId', userId);
    },
    
    async getByResource(userId, resourceId) {
        const all = await this.getByUser(userId);
        return all.filter(n => n.resourceId === resourceId);
    }
};

export default {
    user: userDB,
    progress: progressDB,
    studyRecord: studyRecordDB,
    note: noteDB
};

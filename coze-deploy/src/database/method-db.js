/**
 * 学霸方法数据库模块
 * ES6 标准模块化设计
 * 
 * 数据表：
 * - methods: 方法库（学习方法、记忆技巧、思维模型等）
 * - methodCategories: 方法分类
 * - userMethodProgress: 用户学习进度
 * - methodNotes: 用户笔记
 */

import { database } from './index.js';
import { eventBus } from '../event-bus.js';

// 方法分类常量
export const METHOD_CATEGORIES = {
    MEMORY: 'memory',           // 记忆技巧
    THINKING: 'thinking',       // 思维方法
    TIME: 'time',               // 时间管理
    READING: 'reading',         // 高效阅读
    NOTE: 'note',               // 笔记方法
    PROBLEM_SOLVING: 'problem', // 解题技巧
    CREATIVE: 'creative',       // 创意方法
    HABIT: 'habit'              // 习惯养成
};

// ==================== 方法库 CRUD ====================

export const methodDB = {
    /** 创建新方法 */
    async create(methodData) {
        const method = {
            id: methodData.id || `method_${Date.now()}`,
            title: methodData.title || '',
            category: methodData.category || METHOD_CATEGORIES.THINKING,
            description: methodData.description || '',
            content: methodData.content || '',
            tags: methodData.tags || [],
            difficulty: methodData.difficulty || 1, // 1-5
            estimatedTime: methodData.estimatedTime || 15, // 分钟
            author: methodData.author || '系统',
            source: methodData.source || '',
            thumbnail: methodData.thumbnail || '',
            examples: methodData.examples || [],
            exercises: methodData.exercises || [],
            relatedMethods: methodData.relatedMethods || [],
            viewCount: 0,
            likeCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        eventBus.emit('method:created', method);
        return await database.create('methods', method);
    },
    
    /** 获取方法详情 */
    async get(methodId) {
        return await database.read('methods', methodId);
    },
    
    /** 更新方法 */
    async update(methodId, updates) {
        const method = await this.get(methodId);
        if (!method) throw new Error('方法不存在');
        
        const updated = {
            ...method,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        eventBus.emit('method:updated', updated);
        return await database.update('methods', updated);
    },
    
    /** 删除方法 */
    async delete(methodId) {
        eventBus.emit('method:deleted', methodId);
        return await database.delete('methods', methodId);
    },
    
    /** 获取所有方法 */
    async getAll() {
        return await database.getAll('methods');
    },
    
    /** 按分类获取 */
    async getByCategory(category) {
        return await database.getByIndex('methods', 'category', category);
    },
    
    /** 按标签搜索 */
    async getByTag(tag) {
        const all = await this.getAll();
        return all.filter(m => m.tags && m.tags.includes(tag));
    },
    
    /** 增加浏览次数 */
    async incrementView(methodId) {
        const method = await this.get(methodId);
        if (!method) return;
        
        method.viewCount += 1;
        return await database.update('methods', method);
    },
    
    /** 点赞 */
    async incrementLike(methodId) {
        const method = await this.get(methodId);
        if (!method) return;
        
        method.likeCount += 1;
        eventBus.emit('method:liked', methodId);
        return await database.update('methods', method);
    },
    
    /** 搜索方法 */
    async search(keyword) {
        const all = await this.getAll();
        const kw = keyword.toLowerCase();
        return all.filter(m => 
            m.title.toLowerCase().includes(kw) ||
            m.description.toLowerCase().includes(kw) ||
            m.content.toLowerCase().includes(kw)
        );
    }
};

// ==================== 方法分类 ====================

export const methodCategoryDB = {
    async create(categoryData) {
        const category = {
            id: categoryData.id || `cat_${Date.now()}`,
            name: categoryData.name || '',
            icon: categoryData.icon || '📚',
            color: categoryData.color || '#667eea',
            description: categoryData.description || '',
            sort: categoryData.sort || 0,
            createdAt: new Date().toISOString()
        };
        
        return await database.create('methodCategories', category);
    },
    
    async getAll() {
        const all = await database.getAll('methodCategories');
        return all.sort((a, b) => a.sort - b.sort);
    },
    
    async getWithCount() {
        const categories = await this.getAll();
        const methods = await methodDB.getAll();
        
        return categories.map(cat => ({
            ...cat,
            count: methods.filter(m => m.category === cat.id).length
        }));
    }
};

// ==================== 用户学习进度 ====================

export const methodProgressDB = {
    /** 开始学习一个方法 */
    async startLearning(userId, methodId) {
        const existing = await this.getProgress(userId, methodId);
        
        if (existing) {
            // 已存在，更新时间
            existing.lastStudyAt = new Date().toISOString();
            return await database.update('userMethodProgress', existing);
        }
        
        const progress = {
            userId,
            methodId,
            status: 'learning',  // learning, mastered, reviewing
            progress: 0,         // 0-100
            studyCount: 1,
            notes: '',
            lastStudyAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        eventBus.emit('method:startLearning', { userId, methodId });
        return await database.create('userMethodProgress', progress);
    },
    
    /** 获取用户对某个方法的进度 */
    async getProgress(userId, methodId) {
        const all = await database.getByIndex('userMethodProgress', 'userId', userId);
        return all.find(p => p.methodId === methodId);
    },
    
    /** 获取用户所有学习进度 */
    async getByUser(userId) {
        return await database.getByIndex('userMethodProgress', 'userId', userId);
    },
    
    /** 更新学习进度 */
    async updateProgress(userId, methodId, progressPercent, notes = '') {
        const progress = await this.getProgress(userId, methodId);
        if (!progress) throw new Error('学习记录不存在');
        
        progress.progress = Math.min(100, Math.max(0, progressPercent));
        progress.studyCount += 1;
        progress.lastStudyAt = new Date().toISOString();
        
        if (notes) {
            progress.notes = notes;
        }
        
        // 进度 100% 标记为已掌握
        if (progress.progress >= 100) {
            progress.status = 'mastered';
            eventBus.emit('method:mastered', { userId, methodId });
        }
        
        eventBus.emit('method:progressUpdated', { userId, methodId, progress: progress.progress });
        return await database.update('userMethodProgress', progress);
    },
    
    /** 获取统计 */
    async getStats(userId) {
        const all = await this.getByUser(userId);
        return {
            total: all.length,
            learning: all.filter(p => p.status === 'learning').length,
            mastered: all.filter(p => p.status === 'mastered').length,
            recent: all.filter(p => {
                const days = (new Date() - new Date(p.lastStudyAt)) / (1000 * 60 * 60 * 24);
                return days < 7;
            }).length
        };
    }
};

// ==================== 用户笔记 ====================

export const methodNoteDB = {
    async create(userId, methodId, content) {
        const note = {
            userId,
            methodId,
            content,
            highlight: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        eventBus.emit('method:noteCreated', { userId, methodId });
        return await database.create('methodNotes', note);
    },
    
    async getByUserAndMethod(userId, methodId) {
        const all = await database.getByIndex('methodNotes', 'userId', userId);
        return all.filter(n => n.methodId === methodId);
    },
    
    async toggleHighlight(noteId) {
        const note = await database.read('methodNotes', noteId);
        if (!note) return;
        
        note.highlight = !note.highlight;
        note.updatedAt = new Date().toISOString();
        return await database.update('methodNotes', note);
    }
};

// ES6 默认导出
export default {
    method: methodDB,
    category: methodCategoryDB,
    progress: methodProgressDB,
    note: methodNoteDB,
    CATEGORIES: METHOD_CATEGORIES
};

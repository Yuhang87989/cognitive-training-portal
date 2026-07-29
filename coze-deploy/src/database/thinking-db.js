/**
 * 思维训练题库数据库模块
 * ES6 标准模块化设计
 * 
 * 数据表：
 * - thinkingExercises: 训练题目库
 * - thinkingCategories: 训练分类
 * - userThinkingProgress: 用户训练进度
 * - thinkingRecords: 训练记录
 */

import { database } from './index.js';
import { eventBus } from '../event-bus.js';

// 思维训练分类常量
export const THINKING_CATEGORIES = {
    LOGIC: 'logic',               // 逻辑思维
    CRITICAL: 'critical',         // 批判性思维
    CREATIVE: 'creative',         // 创造性思维
    SYSTEM: 'system',             // 系统思维
    DEDUCTIVE: 'deductive',       // 演绎推理
    INDUCTIVE: 'inductive',       // 归纳推理
    ANALOGY: 'analogy',           // 类比思维
    MATH: 'math'                  // 数学思维
};

// 难度等级
export const DIFFICULTY_LEVELS = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    EXPERT: 4,
    MASTER: 5
};

// ==================== 题库 CRUD ====================

export const thinkingExerciseDB = {
    /** 创建新题目 */
    async create(exerciseData) {
        const exercise = {
            id: exerciseData.id || `think_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            category: exerciseData.category,
            title: exerciseData.title,
            description: exerciseData.description || '',
            content: exerciseData.content || '',
            question: exerciseData.question || '',
            options: exerciseData.options || [],
            correctAnswer: exerciseData.correctAnswer || '',
            explanation: exerciseData.explanation || '',
            hints: exerciseData.hints || [],
            category: exerciseData.category || THINKING_CATEGORIES.LOGIC,
            difficulty: exerciseData.difficulty || DIFFICULTY_LEVELS.MEDIUM,
            estimatedTime: exerciseData.estimatedTime || 5, // 分钟
            points: exerciseData.points || 10,
            tags: exerciseData.tags || [],
            source: exerciseData.source || '',
            solvedCount: 0,
            correctRate: 0,
            createdAt: new Date().toISOString()
        };
        
        const result = await database.create('thinkingExercises', exercise);
        eventBus.emit('thinking:exerciseCreated', result);
        return result;
    },
    
    /** 获取题目 */
    async get(exerciseId) {
        return await database.read('thinkingExercises', exerciseId);
    },
    
    /** 更新题目 */
    async update(exerciseId, updates) {
        const exercise = await this.get(exerciseId);
        if (!exercise) throw new Error('题目不存在');
        
        const updated = {
            ...exercise,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('thinkingExercises', updated);
    },
    
    /** 获取所有题目 */
    async getAll() {
        return await database.getAll('thinkingExercises');
    },
    
    /** 按分类获取 */
    async getByCategory(category) {
        return await database.getByIndex('thinkingExercises', 'category', category);
    },
    
    /** 按难度获取 */
    async getByDifficulty(difficulty) {
        const all = await this.getAll();
        return all.filter(e => e.difficulty === difficulty);
    },
    
    /** 随机出题 */
    async getRandom(category = null, difficulty = null, count = 5) {
        let exercises = await this.getAll();
        
        if (category) {
            exercises = exercises.filter(e => e.category === category);
        }
        
        if (difficulty) {
            exercises = exercises.filter(e => e.difficulty === difficulty);
        }
        
        // Fisher-Yates 洗牌
        for (let i = exercises.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
        }
        
        return exercises.slice(0, count);
    },
    
    /** 根据用户水平推荐 */
    async getRecommended(userId, count = 10) {
        // 获取用户历史记录，分析正确率
        const records = await thinkingRecordDB.getByUser(userId);
        const categoryStats = {};
        
        records.forEach(r => {
            if (!categoryStats[r.category]) {
                categoryStats[r.category] = { total: 0, correct: 0 };
            }
            categoryStats[r.category].total++;
            if (r.correct) {
                categoryStats[r.category].correct++;
            }
        });
        
        // 找出正确率低的分类
        const weakCategories = Object.entries(categoryStats)
            .filter(([, stat]) => stat.total > 0)
            .map(([cat, stat]) => ({
                category: cat,
                correctRate: stat.correct / stat.total
            }))
            .sort((a, b) => a.correctRate - b.correctRate)
            .slice(0, 3)
            .map(x => x.category);
        
        // 如果没有弱分类，随机出题
        if (weakCategories.length === 0) {
            return this.getRandom(null, null, count);
        }
        
        // 从弱分类中出题
        let recommendations = [];
        for (const cat of weakCategories) {
            const catExercises = await this.getByCategory(cat);
            recommendations = recommendations.concat(catExercises.slice(0, 5));
        }
        
        return recommendations.slice(0, count);
    }
};

// ==================== 训练分类 ====================

export const thinkingCategoryDB = {
    async create(categoryData) {
        const category = {
            id: categoryData.id,
            name: categoryData.name,
            icon: categoryData.icon || '🧠',
            color: categoryData.color || '#667eea',
            description: categoryData.description || '',
            totalExercises: 0,
            unlockedLevel: 1,
            maxLevel: 10,
            sort: categoryData.sort || 0,
            createdAt: new Date().toISOString()
        };
        
        return await database.create('thinkingCategories', category);
    },
    
    async getAll() {
        const all = await database.getAll('thinkingCategories');
        return all.sort((a, b) => a.sort - b.sort);
    },
    
    async getWithStats(userId) {
        const categories = await this.getAll();
        const progress = await thinkingProgressDB.getByUser(userId);
        
        return categories.map(cat => {
            const userProg = progress.find(p => p.category === cat.id) || {};
            return {
                ...cat,
                userLevel: userProg.level || 1,
                userPoints: userProg.totalPoints || 0,
                exercisesSolved: userProg.exercisesSolved || 0
            };
        });
    }
};

// ==================== 用户训练进度 ====================

export const thinkingProgressDB = {
    async getByUser(userId) {
        return await database.getByIndex('userThinkingProgress', 'userId', userId);
    },
    
    async getProgress(userId, category) {
        const all = await this.getByUser(userId);
        return all.find(p => p.category === category);
    },
    
    /** 记录完成题目，更新进度 */
    async recordComplete(userId, category, exerciseId, correct, timeSpent, points) {
        let progress = await this.getProgress(userId, category);
        
        if (!progress) {
            progress = {
                userId,
                category,
                level: 1,
                currentPoints: 0,
                totalPoints: 0,
                exercisesSolved: 0,
                correctCount: 0,
                totalTimeSpent: 0,
                lastPracticeAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
        }
        
        progress.exercisesSolved += 1;
        progress.totalTimeSpent += timeSpent;
        progress.lastPracticeAt = new Date().toISOString();
        
        if (correct) {
            progress.correctCount += 1;
            progress.currentPoints += points;
            progress.totalPoints += points;
            
            // 升级判断（每 100 分升一级）
            const newLevel = Math.floor(progress.currentPoints / 100) + 1;
            if (newLevel > progress.level) {
                progress.level = newLevel;
                eventBus.emit('thinking:levelUp', { 
                    userId, category, newLevel 
                });
            }
        }
        
        if (progress.id) {
            return await database.update('userThinkingProgress', progress);
        }
        return await database.create('userThinkingProgress', progress);
    },
    
    async getStats(userId) {
        const progress = await this.getByUser(userId);
        const records = await thinkingRecordDB.getByUser(userId);
        
        const totalCorrect = progress.reduce((sum, p) => sum + p.correctCount, 0);
        const totalSolved = progress.reduce((sum, p) => sum + p.exercisesSolved, 0);
        
        return {
            totalExercises: totalSolved,
            correctRate: totalSolved > 0 ? (totalCorrect / totalSolved * 100).toFixed(1) : 0,
            totalPoints: progress.reduce((sum, p) => sum + p.totalPoints, 0),
            highestLevel: Math.max(...progress.map(p => p.level), 1),
            categoriesUnlocked: progress.length,
            streakDays: this.calculateStreak(records),
            totalTime: progress.reduce((sum, p) => sum + p.totalTimeSpent, 0)
        };
    },
    
    calculateStreak(records) {
        if (records.length === 0) return 0;
        
        const dates = new Set(records.map(r => r.createdAt.split('T')[0]));
        const sortedDates = Array.from(dates).sort().reverse();
        
        let streak = 0;
        let checkDate = new Date();
        
        for (let i = 0; i < sortedDates.length; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (sortedDates[i] === dateStr) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (i === 0 && sortedDates[i] < dateStr) {
                break; // 今天没练，连续中断
            }
        }
        
        return streak;
    }
};

// ==================== 训练记录 ====================

export const thinkingRecordDB = {
    async create(recordData) {
        const record = {
            userId: recordData.userId,
            exerciseId: recordData.exerciseId,
            category: recordData.category,
            userAnswer: recordData.userAnswer,
            correctAnswer: recordData.correctAnswer,
            correct: recordData.correct,
            timeSpent: recordData.timeSpent,
            pointsEarned: recordData.pointsEarned || 0,
            hintsUsed: recordData.hintsUsed || 0,
            createdAt: new Date().toISOString()
        };
        
        eventBus.emit('thinking:recordCreated', record);
        return await database.create('thinkingRecords', record);
    },
    
    async getByUser(userId) {
        const all = await database.getByIndex('thinkingRecords', 'userId', userId);
        return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    async getRecent(userId, days = 7) {
        const all = await this.getByUser(userId);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return all.filter(r => new Date(r.createdAt) >= cutoff);
    }
};

// ES6 默认导出
export default {
    exercise: thinkingExerciseDB,
    category: thinkingCategoryDB,
    progress: thinkingProgressDB,
    record: thinkingRecordDB,
    CATEGORIES: THINKING_CATEGORIES,
    DIFFICULTY: DIFFICULTY_LEVELS
};

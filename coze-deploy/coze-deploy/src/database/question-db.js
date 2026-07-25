/* 母题数据库模块
 * 管理题库、题目分类、错题本等
 */

import { database } from './index.js';
import { eventBus } from '../event-bus.js';

// 题目数据库
export const questionDB = {
    async create(questionData) {
        const question = {
            id: questionData.id || `q_${Date.now()}`,
            subject: questionData.subject || '',
            type: questionData.type || 'choice', // choice, blank, essay, etc.
            difficulty: questionData.difficulty || 1, // 1-5
            title: questionData.title || '',
            content: questionData.content || '',
            options: questionData.options || [],
            answer: questionData.answer || '',
            analysis: questionData.analysis || '',
            tags: questionData.tags || [],
            knowledgePoints: questionData.knowledgePoints || [],
            source: questionData.source || '',
            createdBy: questionData.createdBy || 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('questions', question);
    },
    
    async get(questionId) {
        return await database.read('questions', questionId);
    },
    
    async update(questionId, updates) {
        const question = await this.get(questionId);
        if (!question) throw new Error('题目不存在');
        
        const updated = {
            ...question,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('questions', updated);
    },
    
    async delete(questionId) {
        return await database.delete('questions', questionId);
    },
    
    async getAll() {
        return await database.getAll('questions');
    },
    
    // 按学科查询
    async getBySubject(subject) {
        return await database.getByIndex('questions', 'subject', subject);
    },
    
    // 按难度查询
    async getByDifficulty(difficulty) {
        return await database.getByIndex('questions', 'difficulty', difficulty);
    },
    
    // 按类型查询
    async getByType(type) {
        return await database.getByIndex('questions', 'type', type);
    },
    
    // 按标签查询
    async getByTag(tag) {
        const all = await this.getAll();
        return all.filter(q => q.tags && q.tags.includes(tag));
    },
    
    // 随机出题
    async random(subject = null, count = 10, difficulty = null) {
        let questions = subject ? await this.getBySubject(subject) : await this.getAll();
        
        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        // 随机打乱
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        return questions.slice(0, count);
    },
    
    // 批量导入
    async bulkImport(questions) {
        return await database.bulkCreate('questions', questions.map(q => ({
            ...q,
            id: q.id || `q_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })));
    }
};

// 题集
export const questionSetDB = {
    async create(setData) {
        const set = {
            id: setData.id || `set_${Date.now()}`,
            name: setData.name || '无题集名称',
            subject: setData.subject || '',
            grade: setData.grade || '',
            description: setData.description || '',
            questionIds: setData.questionIds || [],
            tags: setData.tags || [],
            createdBy: setData.createdBy || 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('questionSets', set);
    },
    
    async get(setId) {
        return await database.read('questionSets', setId);
    },
    
    async getQuestions(setId) {
        const set = await this.get(setId);
        if (!set) return [];
        
        const questions = [];
        for (const qId of set.questionIds) {
            const q = await questionDB.get(qId);
            if (q) questions.push(q);
        }
        return questions;
    },
    
    async getAll() {
        return await database.getAll('questionSets');
    }
};

// 错题本
export const wrongBookDB = {
    async add(userId, questionId, wrongAnswer, note = '') {
        // 检查是否已存在
        const existing = await this.getByUserAndQuestion(userId, questionId);
        
        if (existing) {
            // 更新错误次数
            existing.wrongCount = (existing.wrongCount || 1) + 1;
            existing.lastWrongDate = new Date().toISOString();
            if (note) existing.notes = (existing.notes || '') + '\n' + note;
            
            return await database.update('wrongBook', existing);
        }
        
        return await database.create('wrongBook', {
            userId,
            questionId,
            wrongAnswer,
            wrongCount: 1,
            notes: note || '',
            mastered: false,
            firstWrongDate: new Date().toISOString(),
            lastWrongDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });
    },
    
    async getByUser(userId) {
        return await database.getByIndex('wrongBook', 'userId', userId);
    },
    
    async getByUserAndQuestion(userId, questionId) {
        const all = await this.getByUser(userId);
        return all.find(w => w.questionId === questionId);
    },
    
    async getToday(userId) {
        const today = new Date().toISOString().split('T')[0];
        const all = await this.getByUser(userId);
        return all.filter(w => w.lastWrongDate && w.lastWrongDate.startsWith(today));
    },
    
    async markMastered(wrongBookId, mastered = true) {
        const item = await database.read('wrongBook', wrongBookId);
        if (!item) throw new Error('记录不存在');
        
        item.mastered = mastered;
        item.masteredAt = mastered ? new Date().toISOString() : null;
        
        return await database.update('wrongBook', item);
    },
    
    async remove(wrongBookId) {
        return await database.delete('wrongBook', wrongBookId);
    },
    
    // 获取需要复习的题目
    async getForReview(userId, days = 7) {
        const all = await this.getByUser(userId);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString();
        
        return all.filter(w => !w.mastered && w.lastWrongDate >= cutoffStr);
    },
    
    // 获得统计
    async getStats(userId) {
        const all = await this.getByUser(userId);
        const mastered = all.filter(w => w.mastered).length;
        const total = all.length;
        
        return {
            total,
            mastered,
            toReview: total - mastered,
            todayCount: (await this.getToday(userId)).length
        };
    }
};

export default {
    question: questionDB,
    questionSet: questionSetDB,
    wrongBook: wrongBookDB
};

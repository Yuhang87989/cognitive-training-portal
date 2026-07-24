/* 学习图书馆数据库模块
 * 管理书籍、文章、视频、音频等学习资源
 */

import { database, RESOURCE_PATHS } from './index.js';
import { eventBus } from '../event-bus.js';

// 书籍数据库
export const bookDB = {
    async create(bookData) {
        const book = {
            id: bookData.id || `book_${Date.now()}`,
            title: bookData.title || '',
            author: bookData.author || '',
            category: bookData.category || '',
            description: bookData.description || '',
            cover: bookData.cover || '',
            filename: bookData.filename || '',
            pages: bookData.pages || 0,
            isbn: bookData.isbn || '',
            publisher: bookData.publisher || '',
            publishDate: bookData.publishDate || '',
            tags: bookData.tags || [],
            rating: bookData.rating || 0,
            readCount: bookData.readCount || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('books', book);
    },
    
    async get(bookId) {
        return await database.read('books', bookId);
    },
    
    async update(bookId, updates) {
        const book = await this.get(bookId);
        if (!book) throw new Error('书籍不存在');
        
        const updated = {
            ...book,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('books', updated);
    },
    
    async getAll() {
        return await database.getAll('books');
    },
    
    async getByCategory(category) {
        return await database.getByIndex('books', 'category', category);
    },
    
    async getByAuthor(author) {
        return await database.getByIndex('books', 'author', author);
    },
    
    async getByTag(tag) {
        const all = await this.getAll();
        return all.filter(b => b.tags && b.tags.includes(tag));
    },
    
    // 获取书籍文件路径
    getFilePath(book) {
        return RESOURCE_PATHS.book.getPath(book.filename);
    }
};

// 文章数据库
export const articleDB = {
    async create(articleData) {
        const article = {
            id: articleData.id || `article_${Date.now()}`,
            title: articleData.title || '',
            author: articleData.author || '',
            category: articleData.category || '',
            content: articleData.content || '',
            summary: articleData.summary || '',
            cover: articleData.cover || '',
            source: articleData.source || '',
            url: articleData.url || '',
            wordCount: articleData.wordCount || 0,
            readTime: articleData.readTime || 0,
            tags: articleData.tags || [],
            readCount: articleData.readCount || 0,
            date: articleData.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('articles', article);
    },
    
    async get(articleId) {
        return await database.read('articles', articleId);
    },
    
    async update(articleId, updates) {
        const article = await this.get(articleId);
        if (!article) throw new Error('文章不存在');
        
        const updated = {
            ...article,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('articles', updated);
    },
    
    async getAll() {
        return await database.getAll('articles');
    },
    
    async getByCategory(category) {
        return await database.getByIndex('articles', 'category', category);
    },
    
    async getByDate(date) {
        return await database.getByIndex('articles', 'date', date);
    },
    
    async getRecent(days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        
        const all = await this.getAll();
        return all.filter(a => a.date >= cutoffStr)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};

// 视频数据库
export const videoDB = {
    async create(videoData) {
        const video = {
            id: videoData.id || `video_${Date.now()}`,
            title: videoData.title || '',
            author: videoData.author || '',
            category: videoData.category || '',
            description: videoData.description || '',
            cover: videoData.cover || '',
            filename: videoData.filename || '',
            url: videoData.url || '',
            duration: videoData.duration || 0, // 秒
            resolution: videoData.resolution || '',
            tags: videoData.tags || [],
            viewCount: videoData.viewCount || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('videos', video);
    },
    
    async get(videoId) {
        return await database.read('videos', videoId);
    },
    
    async update(videoId, updates) {
        const video = await this.get(videoId);
        if (!video) throw new Error('视频不存在');
        
        const updated = {
            ...video,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('videos', updated);
    },
    
    async getAll() {
        return await database.getAll('videos');
    },
    
    async getByCategory(category) {
        return await database.getByIndex('videos', 'category', category);
    },
    
    // 获取视频文件路径
    getFilePath(video) {
        if (video.url) return video.url;
        return RESOURCE_PATHS.video.getPath(video.filename);
    }
};

// 音频数据库（播音课堂）
export const audioDB = {
    async create(audioData) {
        const audio = {
            id: audioData.id || `audio_${Date.now()}`,
            title: audioData.title || '',
            author: audioData.author || '',
            category: audioData.category || '',
            description: audioData.description || '',
            cover: audioData.cover || '',
            filename: audioData.filename || '',
            url: audioData.url || '',
            duration: audioData.duration || 0, // 秒
            transcript: audioData.transcript || '', // 文字稿
            tags: audioData.tags || [],
            playCount: audioData.playCount || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await database.create('audios', audio);
    },
    
    async get(audioId) {
        return await database.read('audios', audioId);
    },
    
    async update(audioId, updates) {
        const audio = await this.get(audioId);
        if (!audio) throw new Error('音频不存在');
        
        const updated = {
            ...audio,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        return await database.update('audios', updated);
    },
    
    async getAll() {
        return await database.getAll('audios');
    },
    
    async getByCategory(category) {
        return await database.getByIndex('audios', 'category', category);
    },
    
    // 获取音频文件路径
    getFilePath(audio) {
        if (audio.url) return audio.url;
        return RESOURCE_PATHS.audio.getPath(audio.filename);
    }
};

// 用户图书馆（用户收藏、阅读记录）
export const userLibraryDB = {
    async add(userId, resourceId, resourceType) {
        // 检查是否已存在
        const existing = await this.getByUserAndResource(userId, resourceId, resourceType);
        
        if (existing) {
            existing.lastAccessAt = new Date().toISOString();
            return await database.update('userLibrary', existing);
        }
        
        return await database.create('userLibrary', {
            userId,
            resourceId,
            resourceType, // book, article, video, audio
            addedAt: new Date().toISOString(),
            lastAccessAt: new Date().toISOString(),
            progress: 0, // 阅读/观看进度 0-100
            notes: '',
            favorite: false
        });
    },
    
    async getByUser(userId, resourceType = null) {
        const all = await database.getByIndex('userLibrary', 'userId', userId);
        if (resourceType) {
            return all.filter(item => item.resourceType === resourceType);
        }
        return all;
    },
    
    async getByUserAndResource(userId, resourceId, resourceType) {
        const all = await this.getByUser(userId);
        return all.find(item => item.resourceId === resourceId && item.resourceType === resourceType);
    },
    
    async updateProgress(userId, resourceId, resourceType, progress) {
        const item = await this.getByUserAndResource(userId, resourceId, resourceType);
        if (!item) {
            // 自动添加
            const newItem = await this.add(userId, resourceId, resourceType);
            newItem.progress = progress;
            return await database.update('userLibrary', newItem);
        }
        
        item.progress = progress;
        item.lastAccessAt = new Date().toISOString();
        return await database.update('userLibrary', item);
    },
    
    async toggleFavorite(userLibraryId) {
        const item = await database.read('userLibrary', userLibraryId);
        if (!item) throw new Error('记录不存在');
        
        item.favorite = !item.favorite;
        return await database.update('userLibrary', item);
    },
    
    async getFavorites(userId) {
        const all = await this.getByUser(userId);
        return all.filter(item => item.favorite);
    }
};

// 图书馆统计
export const libraryStats = {
    async get() {
        return {
            books: await database.count('books'),
            articles: await database.count('articles'),
            videos: await database.count('videos'),
            audios: await database.count('audios')
        };
    }
};

export default {
    book: bookDB,
    article: articleDB,
    video: videoDB,
    audio: audioDB,
    userLibrary: userLibraryDB,
    stats: libraryStats
};

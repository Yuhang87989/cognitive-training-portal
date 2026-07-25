/* 统一数据库访问层
 * 管理 IndexedDB 数据库，提供统一的数据访问接口
 * 支持用户数据库、母题数据库、学习图书馆
 */

import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';

const DB_NAME = 'CognitiveTrainingDB';
const DB_VERSION = 1;

let db = null;
let initPromise = null;

// 数据库表定义
const STORES = {
    // 用户相关
    users: { keyPath: 'id', autoIncrement: false },
    userProgress: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'moduleId', 'date'] },
    
    // 母题数据库
    questions: { keyPath: 'id', autoIncrement: false, indexes: ['subject', 'difficulty', 'type', 'tags'] },
    questionSets: { keyPath: 'id', autoIncrement: false, indexes: ['subject', 'grade'] },
    wrongBook: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'questionId', 'date'] },
    
    // 学习图书馆
    books: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'author', 'tags'] },
    articles: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'author', 'date'] },
    videos: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'author', 'duration'] },
    audios: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'author', 'duration'] },
    userLibrary: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'resourceId', 'resourceType'] },
    
    // DeepSeek AI
    deepseekConversations: { keyPath: 'id', autoIncrement: false, indexes: ['userId', 'mode', 'createdAt'] },
    deepseekPrompts: { keyPath: 'id', autoIncrement: false, indexes: ['category'] },
    deepseekConfig: { keyPath: 'id', autoIncrement: false, indexes: ['userId'] },
    deepseekUsage: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'model', 'date'] },
    deepseekKnowledge: { keyPath: 'id', autoIncrement: false, indexes: ['userId'] },
    

    // 学霸方法库
    methods: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'difficulty', 'tags'] },
    methodCategories: { keyPath: 'id', autoIncrement: false, indexes: ['sort'] },
    userMethodProgress: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'methodId', 'status'] },
    methodNotes: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'methodId'] },
    
    // 思维训练题库
    thinkingExercises: { keyPath: 'id', autoIncrement: false, indexes: ['category', 'difficulty', 'tags'] },
    thinkingCategories: { keyPath: 'id', autoIncrement: false, indexes: ['sort'] },
    userThinkingProgress: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'category'] },
    thinkingRecords: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'exerciseId', 'category'] },


    // API 网关
    appConfigs: { keyPath: 'id', autoIncrement: false, indexes: ['providerId'] },
    apiUsageRecords: { keyPath: 'id', autoIncrement: false, indexes: ['providerId', 'timestamp'] },

    // 学习记录
    studyRecords: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'resourceId', 'date', 'duration'] },
    notes: { keyPath: 'id', autoIncrement: true, indexes: ['userId', 'resourceId', 'date'] }
};

// 初始化数据库
export function initDatabase() {
    if (initPromise) return initPromise;
    
    initPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('[Database] 打开数据库失败');
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('[Database] 数据库打开成功');
            eventBus.emit('database:ready');
            eventBus.emit('module:ready', 'database');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // 创建所有表
            Object.entries(STORES).forEach(([storeName, config]) => {
                if (!database.objectStoreNames.contains(storeName)) {
                    const store = database.createObjectStore(storeName, {
                        keyPath: config.keyPath,
                        autoIncrement: config.autoIncrement
                    });
                    
                    // 创建索引
                    if (config.indexes) {
                        config.indexes.forEach(indexName => {
                            store.createIndex(indexName, indexName, { unique: false });
                        });
                    }
                    
                    console.log(`[Database] 创建表: ${storeName}`);
                }
            });
        };
    });
    
    return initPromise;
}

// 获取数据库实例
export function getDB() {
    return db;
}

// 通用 CRUD 操作
export function create(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
        
        request.onsuccess = () => {
            eventBus.emit(`database:${storeName}:created`, data);
            resolve(request.result);
        };
        request.onerror = () => reject(request.error);
    });
}

export function read(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function update(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onsuccess = () => {
            eventBus.emit(`database:${storeName}:updated`, data);
            resolve(request.result);
        };
        request.onerror = () => reject(request.error);
    });
}

export function remove(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onsuccess = () => {
            eventBus.emit(`database:${storeName}:deleted`, id);
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

export function getAll(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 按索引查询
export function getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 批量操作
export function bulkCreate(storeName, items) {
    return Promise.all(items.map(item => create(storeName, item)));
}

export function bulkUpdate(storeName, items) {
    return Promise.all(items.map(item => update(storeName, item)));
}

// 清空表
export function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 计数
export function count(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 资源路径管理（解决音频、视频等资源地址问题）
export const RESOURCE_PATHS = {
    audio: {
        basePath: '../audio/',
        getPath: (filename) => `${RESOURCE_PATHS.audio.basePath}${filename}`,
        extensions: ['.mp3', '.wav', '.m4a']
    },
    video: {
        basePath: '../videos/',
        getPath: (filename) => `${RESOURCE_PATHS.video.basePath}${filename}`,
        extensions: ['.mp4', '.webm', '.mkv']
    },
    image: {
        basePath: '../images/',
        getPath: (filename) => `${RESOURCE_PATHS.image.basePath}${filename}`,
        extensions: ['.jpg', '.png', '.gif', '.svg']
    },
    book: {
        basePath: '../books/',
        getPath: (filename) => `${RESOURCE_PATHS.book.basePath}${filename}`,
        extensions: ['.pdf', '.epub', '.txt']
    },
    userUpload: {
        basePath: '../user-uploads/',
        getPath: (userId, filename) => `${RESOURCE_PATHS.userUpload.basePath}${userId}/${filename}`,
        extensions: ['*']
    }
};

// 检查资源是否存在
export async function checkResourceExists(path) {
    try {
        const response = await fetch(path, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// 用户上传数据管理
export const userUploads = {
    async saveUploadRecord(userId, uploadData) {
        return create('userLibrary', {
            userId,
            resourceId: uploadData.id,
            resourceType: uploadData.type,
            name: uploadData.name,
            path: uploadData.path,
            size: uploadData.size,
            uploadDate: new Date().toISOString(),
            tags: uploadData.tags || [],
            notes: uploadData.notes || ''
        });
    },
    
    async getUserUploads(userId, resourceType = null) {
        const all = await getByIndex('userLibrary', 'userId', userId);
        if (resourceType) {
            return all.filter(item => item.resourceType === resourceType);
        }
        return all;
    },
    
    async getUploadPath(userId, filename) {
        // 确保用户目录存在（这里是浏览器端，实际路径由后端处理）
        return RESOURCE_PATHS.userUpload.getPath(userId, filename);
    }
};

// 导出数据库对象
export const database = {
    init: initDatabase,
    getDB,
    create,
    read,
    update,
    delete: remove,
    getAll,
    getByIndex,
    bulkCreate,
    bulkUpdate,
    clear: clearStore,
    count,
    STORES,
    RESOURCE_PATHS,
    checkResourceExists,
    userUploads
};

export default database;

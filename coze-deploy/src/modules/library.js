/* 学习图书馆模块 - ES6 Modules 标准
 * 书籍、文章、视频、音频资源管理系统
 * 分类浏览、搜索、收藏、阅读记录
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'library_data';

// 资源类型枚举
const RESOURCE_TYPES = {
    BOOK: 'book',
    ARTICLE: 'article',
    VIDEO: 'video',
    AUDIO: 'audio'
};

// 默认分类
const CATEGORIES = [
    { id: 'learning', name: '学习方法', icon: '📚', color: '#667eea' },
    { id: 'thinking', name: '思维训练', icon: '🧠', color: '#f093fb' },
    { id: 'memory', name: '记忆技巧', icon: '💡', color: '#43e97b' },
    { id: 'habit', name: '习惯养成', icon: '🔄', color: '#fa709a' },
    { id: 'psychology', name: '心理学', icon: '❤️', color: '#4facfe' },
    { id: 'productivity', name: '效率提升', icon: '⚡', color: '#ffd93d' }
];

// 默认书籍数据
const DEFAULT_BOOKS = [
    {
        id: 'book_1',
        type: RESOURCE_TYPES.BOOK,
        title: '认知天性',
        author: '彼得·布朗',
        cover: '📘',
        category: 'learning',
        rating: 4.8,
        readCount: 12580,
        desc: '让学习轻而易举的心理学规律，揭示人类学习的本质机制',
        content: '这是一本由11位世界顶尖认知科学家合著的经典著作...',
        chapters: ['第一章：学习的本质', '第二章：记忆的机制', '第三章：间隔效应', '第四章：检索练习'],
        addedAt: '2026-01-15'
    },
    {
        id: 'book_2',
        type: RESOURCE_TYPES.BOOK,
        title: '刻意练习',
        author: '安德斯·艾利克森',
        cover: '📗',
        category: 'learning',
        rating: 4.9,
        readCount: 28960,
        desc: '如何从新手到大师，发现天赋的训练方法',
        content: '杰出不是一种天赋，而是一种人人都可以学会的技巧...',
        chapters: ['第一章：有目的的练习', '第二章：大脑的适应能力', '第三章：心理表征', '第四章：黄金标准'],
        addedAt: '2026-01-10'
    },
    {
        id: 'book_3',
        type: RESOURCE_TYPES.BOOK,
        title: '思考，快与慢',
        author: '丹尼尔·卡尼曼',
        cover: '📕',
        category: 'thinking',
        rating: 4.7,
        readCount: 35420,
        desc: '诺贝尔经济学奖得主揭示人类思维的两个系统',
        content: '我们的大脑有快与慢两种作决定的方式...',
        chapters: ['第一章：系统1和系统2', '第二章：注意力和努力', '第三章：惰性思维与延迟满足', '第四章：联想的神奇力量'],
        addedAt: '2026-01-08'
    },
    {
        id: 'book_4',
        type: RESOURCE_TYPES.BOOK,
        title: '深度工作',
        author: '卡尔·纽波特',
        cover: '📙',
        category: 'productivity',
        rating: 4.6,
        readCount: 18750,
        desc: '如何有效使用每一点脑力，在碎片化时代专注地做事',
        content: '深度工作是在无干扰的状态下专注进行职业活动...',
        chapters: ['第一章：深度工作的价值', '第二章：深度工作的准则', '第三章：拥抱无聊', '第四章：摒弃浮浅'],
        addedAt: '2026-01-20'
    },
    {
        id: 'book_5',
        type: RESOURCE_TYPES.BOOK,
        title: '微习惯',
        author: '斯蒂芬·盖斯',
        cover: '📓',
        category: 'habit',
        rating: 4.5,
        readCount: 21340,
        desc: '简单到不可能失败的自我管理法则',
        content: '微习惯是一种非常微小的积极行为，你需要每天强迫自己完成它...',
        chapters: ['第一章：微习惯是什么', '第二章：大脑的工作原理', '第三章：微习惯的独特之处', '第四章：微习惯策略'],
        addedAt: '2026-02-01'
    },
    {
        id: 'book_6',
        type: RESOURCE_TYPES.BOOK,
        title: '记忆宫殿',
        author: '东尼·博赞',
        cover: '📒',
        category: 'memory',
        rating: 4.4,
        readCount: 15680,
        desc: '世界最先进的记忆法，让你的记忆力提升10倍',
        content: '记忆宫殿是一种最古老也最有效的记忆方法...',
        chapters: ['第一章：记忆的基础', '第二章：联想的力量', '第三章：位置记忆法', '第四章：建立你的宫殿'],
        addedAt: '2026-01-25'
    }
];

// 默认文章数据
const DEFAULT_ARTICLES = [
    {
        id: 'article_1',
        type: RESOURCE_TYPES.ARTICLE,
        title: '费曼学习法：为什么你应该用教别人的方式来学习',
        author: '学习君',
        cover: '✍️',
        category: 'learning',
        readTime: 8,
        readCount: 8956,
        desc: '教别人是检验学习效果最好的方式，也是加深理解最有效的方法',
        content: '费曼学习法是诺贝尔物理学奖得主理查德·费曼发明的学习方法...',
        addedAt: '2026-05-10'
    },
    {
        id: 'article_2',
        type: RESOURCE_TYPES.ARTICLE,
        title: '番茄工作法深度解析：25分钟背后的科学',
        author: '效率达人',
        cover: '⏰',
        category: 'productivity',
        readTime: 6,
        readCount: 12450,
        desc: '为什么25分钟是科学的专注时长？如何最大化番茄钟的效果',
        content: '番茄工作法由弗朗西斯科·西里洛在1992年创立...',
        addedAt: '2026-05-12'
    },
    {
        id: 'article_3',
        type: RESOURCE_TYPES.ARTICLE,
        title: '艾宾浩斯遗忘曲线：如何科学地复习',
        author: '记忆大师',
        cover: '📈',
        category: 'memory',
        readTime: 5,
        readCount: 15680,
        desc: '掌握遗忘规律，让你的学习效率提升300%',
        content: '德国心理学家赫尔曼·艾宾浩斯在1885年发现了遗忘曲线...',
        addedAt: '2026-05-08'
    },
    {
        id: 'article_4',
        type: RESOURCE_TYPES.ARTICLE,
        title: '成长型思维：为什么说能力是可以培养的',
        author: '心理学者',
        cover: '🌱',
        category: 'psychology',
        readTime: 7,
        readCount: 9870,
        desc: '斯坦福大学心理学教授卡罗尔·德韦克的经典研究',
        content: '在过去的几十年里，心理学家一直在探讨成功的根源...',
        addedAt: '2026-05-15'
    }
];

// 默认视频数据
const DEFAULT_VIDEOS = [
    {
        id: 'video_1',
        type: RESOURCE_TYPES.VIDEO,
        title: '如何高效学习 | 完整课程',
        author: '学习频道',
        cover: '🎬',
        category: 'learning',
        duration: '45:30',
        videoUrl: 'https://example.com/videos/video_1.mp4',
        thumbnail: 'https://example.com/thumbnails/video_1.jpg',
        viewCount: 125680,
        desc: '一套完整的高效学习方法论课程',
        addedAt: '2026-04-20'
    },
    {
        id: 'video_2',
        type: RESOURCE_TYPES.VIDEO,
        title: '思维导图入门教程',
        author: '思维训练',
        cover: '🎥',
        category: 'thinking',
        duration: '28:15',
        videoUrl: 'https://example.com/videos/video_2.mp4',
        thumbnail: 'https://example.com/thumbnails/video_2.jpg',
        viewCount: 89420,
        desc: '从零开始学习思维导图，提升你的思维能力',
        addedAt: '2026-04-25'
    },
    {
        id: 'video_3',
        type: RESOURCE_TYPES.VIDEO,
        title: '催眠式记忆训练 | 30天记忆力提升计划',
        author: '记忆学院',
        cover: '📺',
        category: 'memory',
        duration: '1:02:45',
        videoUrl: 'https://example.com/videos/video_3.mp4',
        thumbnail: 'https://example.com/thumbnails/video_3.jpg',
        viewCount: 156890,
        desc: '每天10分钟，30天显著提升你的记忆力',
        addedAt: '2026-05-01'
    }
];

// 默认音频数据
const DEFAULT_AUDIOS = [
    {
        id: 'audio_1',
        type: RESOURCE_TYPES.AUDIO,
        title: '睡前冥想：提升专注力',
        author: '冥想导师',
        cover: '🎧',
        category: 'psychology',
        duration: '15:00',
        audioUrl: 'https://example.com/audios/audio_1.mp3',
        playCount: 45680,
        desc: '每天睡前15分钟，提升你的专注力和记忆力',
        addedAt: '2026-05-05'
    },
    {
        id: 'audio_2',
        type: RESOURCE_TYPES.AUDIO,
        title: '学习时的背景音乐',
        author: '音乐工作室',
        cover: '🎵',
        category: 'productivity',
        duration: '60:00',
        audioUrl: 'https://example.com/audios/audio_2.mp3',
        playCount: 128900,
        desc: 'Alpha波背景音，提升学习效率',
        addedAt: '2026-05-08'
    },
    {
        id: 'audio_3',
        type: RESOURCE_TYPES.AUDIO,
        title: '记忆宫殿引导音频',
        author: '记忆大师',
        cover: '🎶',
        category: 'memory',
        duration: '20:30',
        audioUrl: 'https://example.com/audios/audio_3.mp3',
        playCount: 34560,
        desc: '跟随引导，建立你的第一个记忆宫殿',
        addedAt: '2026-05-12'
    }
];

// 默认数据结构
const DEFAULT_DATA = {
    resources: [...DEFAULT_BOOKS, ...DEFAULT_ARTICLES, ...DEFAULT_VIDEOS, ...DEFAULT_AUDIOS],
    favorites: [],
    readingHistory: [],
    currentReading: null,
    readingProgress: {}
};

// 初始化图书馆模块
export function initLibrary() {
    // 从存储加载数据
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    // 确保资源数据是最新的（合并默认资源和用户资源）
    if (!savedData.resources || savedData.resources.length < DEFAULT_DATA.resources.length) {
        data.resources = [...DEFAULT_DATA.resources, ...(savedData.resources || [])];
    }
    
    // 初始化 store
    store.setState('library', data);
    
    console.log('[Library] 学习图书馆模块初始化完成');
    eventBus.emit('module:ready', 'library');
}

// 获取数据
export function getLibraryData() {
    return store.getState('library');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('library', data);
    eventBus.emit('library:updated', data);
}

// ========== 资源查询 ==========

// 获取所有资源
export function getAllResources() {
    const data = getLibraryData();
    return data.resources;
}

// 按类型获取资源
export function getResourcesByType(type) {
    const data = getLibraryData();
    return data.resources.filter(r => r.type === type);
}

// 按分类获取资源
export function getResourcesByCategory(category) {
    const data = getLibraryData();
    return data.resources.filter(r => r.category === category);
}

// 搜索资源
export function searchResources(keyword) {
    const data = getLibraryData();
    const kw = keyword.toLowerCase();
    return data.resources.filter(r => 
        r.title.toLowerCase().includes(kw) ||
        r.author.toLowerCase().includes(kw) ||
        r.desc.toLowerCase().includes(kw)
    );
}

// 获取单个资源详情
export function getResourceById(id) {
    const data = getLibraryData();
    return data.resources.find(r => r.id === id);
}

// 获取所有分类
export function getCategories() {
    return CATEGORIES;
}

// ========== 收藏功能 ==========

// 添加收藏
export function addToFavorites(resourceId) {
    const data = getLibraryData();
    
    if (!data.favorites.includes(resourceId)) {
        data.favorites.push(resourceId);
        saveData(data);
        showToast('已添加到收藏 ❤️');
        return true;
    }
    return false;
}

// 取消收藏
export function removeFromFavorites(resourceId) {
    const data = getLibraryData();
    const index = data.favorites.indexOf(resourceId);
    
    if (index > -1) {
        data.favorites.splice(index, 1);
        saveData(data);
        showToast('已取消收藏');
        return true;
    }
    return false;
}

// 检查是否已收藏
export function isFavorite(resourceId) {
    const data = getLibraryData();
    return data.favorites.includes(resourceId);
}

// 获取收藏列表
export function getFavorites() {
    const data = getLibraryData();
    return data.resources.filter(r => data.favorites.includes(r.id));
}

// ========== 阅读记录 ==========

// 记录阅读
export function recordReading(resourceId, progress = 0) {
    const data = getLibraryData();
    const today = new Date().toDateString();
    
    // 添加到阅读历史
    if (!data.readingHistory.includes(today)) {
        data.readingHistory.unshift(today);
        if (data.readingHistory.length > 365) {
            data.readingHistory = data.readingHistory.slice(0, 365);
        }
    }
    
    // 保存阅读进度
    if (!data.readingProgress[resourceId]) {
        data.readingProgress[resourceId] = { startTime: new Date().toISOString() };
    }
    data.readingProgress[resourceId].progress = progress;
    data.readingProgress[resourceId].lastReadAt = new Date().toISOString();
    
    // 设置当前阅读
    data.currentReading = resourceId;
    
    saveData(data);
}

// 获取阅读进度
export function getReadingProgress(resourceId) {
    const data = getLibraryData();
    return data.readingProgress[resourceId] || { progress: 0 };
}

// 获取最近阅读
export function getRecentReading(limit = 10) {
    const data = getLibraryData();
    const progressList = Object.entries(data.readingProgress)
        .sort((a, b) => new Date(b[1].lastReadAt) - new Date(a[1].lastReadAt))
        .slice(0, limit)
        .map(([id]) => getResourceById(id))
        .filter(Boolean);
    
    return progressList;
}

// ========== 统计功能 ==========

// 获取统计数据
export function getLibraryStats() {
    const data = getLibraryData();
    
    return {
        totalResources: data.resources.length,
        books: data.resources.filter(r => r.type === RESOURCE_TYPES.BOOK).length,
        articles: data.resources.filter(r => r.type === RESOURCE_TYPES.ARTICLE).length,
        videos: data.resources.filter(r => r.type === RESOURCE_TYPES.VIDEO).length,
        audios: data.resources.filter(r => r.type === RESOURCE_TYPES.AUDIO).length,
        favorites: data.favorites.length,
        readingDays: data.readingHistory.length,
        categories: CATEGORIES.length
    };
}

// ========== 添加自定义资源 ==========

// 添加自定义资源
export function addCustomResource(resourceData) {
    const data = getLibraryData();
    const newResource = {
        id: `custom_${Date.now()}`,
        ...resourceData,
        readCount: 0,
        addedAt: new Date().toISOString(),
        isCustom: true
    };
    
    data.resources.unshift(newResource);
    saveData(data);
    showToast('资源添加成功！');
    return newResource;
}

// 删除自定义资源
export function deleteCustomResource(resourceId) {
    const data = getLibraryData();
    const resource = data.resources.find(r => r.id === resourceId);
    
    if (resource && resource.isCustom) {
        data.resources = data.resources.filter(r => r.id !== resourceId);
        saveData(data);
        showToast('资源已删除');
        return true;
    }
    
    showToast('只能删除自定义资源');
    return false;
}


// 播放历史记录
const PLAY_HISTORY_KEY = 'library_play_history';

// 获取播放历史
export function getPlayHistory() {
    return storage.get(PLAY_HISTORY_KEY, []);
}

// 记录播放
export function recordPlay(resourceId, progress = 0, duration = 0) {
    const history = getPlayHistory();
    
    const existingIndex = history.findIndex(h => h.resourceId === resourceId);
    const playRecord = {
        resourceId,
        progress,
        duration,
        lastPlayedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        history[existingIndex] = { ...history[existingIndex], ...playRecord };
    } else {
        history.unshift(playRecord);
    }
    
    // 只保留最近50条
    if (history.length > 50) {
        history.splice(50);
    }
    
    storage.set(PLAY_HISTORY_KEY, history);
    eventBus.emit('library:play-history-updated', history);
    return history;
}

// 获取资源播放进度
export function getPlayProgress(resourceId) {
    const history = getPlayHistory();
    const record = history.find(h => h.resourceId === resourceId);
    return record ? record.progress : 0;
}

// 继续播放
export function continuePlay(resourceId) {
    const progress = getPlayProgress(resourceId);
    return {
        progress,
        resource: getResourceById(resourceId)
    };
}

// 添加播放次数
export function incrementPlayCount(resourceId) {
    const data = getLibraryData();
    const resource = data.resources.find(r => r.id === resourceId);
    if (resource) {
        if (resource.playCount !== undefined) {
            resource.playCount = (resource.playCount || 0) + 1;
        }
        if (resource.viewCount !== undefined) {
            resource.viewCount = (resource.viewCount || 0) + 1;
        }
        storage.set(STORAGE_KEY, data);
        store.setState('library', data);
    }
}

// 收藏播放列表
const PLAYLIST_KEY = 'library_playlists';

export function getPlaylists() {
    return storage.get(PLAYLIST_KEY, []);
}

export function createPlaylist(name, description = '') {
    const playlists = getPlaylists();
    const newPlaylist = {
        id: `playlist_${Date.now()}`,
        name,
        description,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    playlists.unshift(newPlaylist);
    storage.set(PLAYLIST_KEY, playlists);
    eventBus.emit('library:playlist-created', newPlaylist);
    return newPlaylist;
}

export function addToPlaylist(playlistId, resourceId) {
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.items.includes(resourceId)) {
        playlist.items.unshift(resourceId);
        playlist.updatedAt = new Date().toISOString();
        storage.set(PLAYLIST_KEY, playlists);
        eventBus.emit('library:playlist-updated', playlist);
        return true;
    }
    return false;
}

export function removeFromPlaylist(playlistId, resourceId) {
    const playlists = getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
        playlist.items = playlist.items.filter(id => id !== resourceId);
        playlist.updatedAt = new Date().toISOString();
        storage.set(PLAYLIST_KEY, playlists);
        eventBus.emit('library:playlist-updated', playlist);
        return true;
    }
    return false;
}

export function deletePlaylist(playlistId) {
    let playlists = getPlaylists();
    playlists = playlists.filter(p => p.id !== playlistId);
    storage.set(PLAYLIST_KEY, playlists);
    eventBus.emit('library:playlist-deleted', playlistId);
    return true;
}

export default {
    init: initLibrary,
    getData: getLibraryData,
    getAllResources,
    getResourcesByType,
    getResourcesByCategory,
    searchResources,
    getResourceById,
    getCategories,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    recordReading,
    getReadingProgress,
    getRecentReading,
    getStats: getLibraryStats,
    addCustomResource,
    deleteCustomResource,
    getPlayHistory,
    recordPlay,
    getPlayProgress,
    continuePlay,
    incrementPlayCount,
    getPlaylists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
};

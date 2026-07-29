/* 学生日记模块
 * 每日日记记录、心情追踪、标签分类、搜索回顾
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';

const STORE_KEY = 'diary';
const STORAGE_KEY = 'student_diary';

// 心情选项
const MOODS = [
    { id: 'happy', emoji: '😊', label: '开心', color: '#FFD700' },
    { id: 'excited', emoji: '🤩', label: '兴奋', color: '#FF6B6B' },
    { id: 'calm', emoji: '😌', label: '平静', color: '#4ECDC4' },
    { id: 'tired', emoji: '😫', label: '疲惫', color: '#95E1D3' },
    { id: 'sad', emoji: '😢', label: '难过', color: '#74B9FF' },
    { id: 'anxious', emoji: '😰', label: '焦虑', color: '#FD79A8' },
    { id: 'angry', emoji: '😠', label: '生气', color: '#FC5C65' },
    { id: 'proud', emoji: '🥰', label: '自豪', color: '#A29BFE' }
];

// 默认标签
const DEFAULT_TAGS = ['学习', '生活', '心情', '感悟', '目标', '反思', '感恩', '计划'];

// 初始化日记模块
export function initDiary() {
    // 从存储加载数据
    const savedData = storage.get(STORAGE_KEY, {
        entries: [],
        tags: [...DEFAULT_TAGS],
        streak: 0,
        lastEntryDate: null
    });
    
    store.setState(STORE_KEY, savedData);
    
    console.log('[Diary] 模块初始化完成');
    eventBus.emit('module:ready', 'diary');
}

// 保存数据到存储
function saveToStorage() {
    const state = store.getState(STORE_KEY);
    storage.set(STORAGE_KEY, state);
}

// 获取所有日记
export function getAllDiaries() {
    const state = store.getState(STORE_KEY);
    return state.entries || [];
}

// 获取某一天的日记
export function getDiaryByDate(dateStr) {
    const entries = getAllDiaries();
    return entries.find(e => e.date === dateStr);
}

// 获取本月日记
export function getMonthDiaries(year, month) {
    const entries = getAllDiaries();
    return entries.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

// 保存日记
export function saveDiary(dateStr, data) {
    const state = store.getState(STORE_KEY);
    const entries = [...state.entries];
    
    const existingIndex = entries.findIndex(e => e.date === dateStr);
    
    const entry = {
        id: existingIndex >= 0 ? entries[existingIndex].id : Date.now().toString(),
        date: dateStr,
        content: data.content || '',
        mood: data.mood || 'happy',
        tags: data.tags || [],
        weather: data.weather || '',
        highlight: data.highlight || '',
        challenge: data.challenge || '',
        gratitude: data.gratitude || '',
        createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        entries[existingIndex] = entry;
    } else {
        entries.unshift(entry);
    }
    
    // 更新连续天数
    const today = new Date().toDateString();
    const lastDate = state.lastEntryDate ? new Date(state.lastEntryDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = state.streak;
    if (!lastDate || lastDate === yesterday || lastDate === today) {
        if (!lastDate || lastDate !== today) {
            newStreak = state.streak + 1;
        }
    } else {
        newStreak = 1;
    }
    
    store.setState(STORE_KEY, {
        ...state,
        entries,
        streak: newStreak,
        lastEntryDate: dateStr
    });
    
    saveToStorage();
    eventBus.emit('diary:saved', { date: dateStr });
    
    return entry;
}

// 删除日记
export function deleteDiary(entryId) {
    const state = store.getState(STORE_KEY);
    const entries = state.entries.filter(e => e.id !== entryId);
    
    store.setState(STORE_KEY, {
        ...state,
        entries
    });
    
    saveToStorage();
    eventBus.emit('diary:deleted', { id: entryId });
}

// 获取统计数据
export function getDiaryStats() {
    const state = store.getState(STORE_KEY);
    const entries = state.entries || [];
    
    const moodCounts = {};
    const tagCounts = {};
    
    entries.forEach(entry => {
        // 心情统计
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        
        // 标签统计
        (entry.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    return {
        totalEntries: entries.length,
        streak: state.streak || 0,
        moodCounts,
        tagCounts,
        thisMonthEntries: getMonthDiaries(new Date().getFullYear(), new Date().getMonth()).length
    };
}

// 获取心情列表
export function getMoods() {
    return MOODS;
}

// 获取标签列表
export function getTags() {
    const state = store.getState(STORE_KEY);
    return state.tags || DEFAULT_TAGS;
}

// 添加新标签
export function addTag(tagName) {
    const state = store.getState(STORE_KEY);
    const tags = [...state.tags];
    
    if (!tags.includes(tagName)) {
        tags.push(tagName);
        store.setState(STORE_KEY, { ...state, tags });
        saveToStorage();
    }
    
    return tags;
}

// 搜索日记
export function searchDiaries(keyword) {
    const entries = getAllDiaries();
    const kw = keyword.toLowerCase();
    
    return entries.filter(e => 
        e.content.toLowerCase().includes(kw) ||
        e.tags.some(t => t.toLowerCase().includes(kw)) ||
        (e.highlight && e.highlight.toLowerCase().includes(kw))
    );
}

// 获取当前状态
export function getState() {
    return store.getState(STORE_KEY);
}

export default {
    init: initDiary,
    getAll: getAllDiaries,
    getByDate: getDiaryByDate,
    save: saveDiary,
    delete: deleteDiary,
    getStats: getDiaryStats,
    getMoods,
    getTags,
    addTag,
    search: searchDiaries,
    getState
};

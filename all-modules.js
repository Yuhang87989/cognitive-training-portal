/**
 * 配置模块 - ES6 Modules 版本
 */

// DeepSeek API
export const DEEPSEEK_API_KEY = 'sk-8413f72a3f084fb08c84389555a76d37';
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
export const DEEPSEEK_MODEL = 'deepseek-chat';

// 存储配置
export const STORAGE_KEY = 'cognitive_training_v137';
export const API_CONFIG_KEY = 'cognitive_api_config';

// 旧版本key（用于数据迁移）
export const OLD_KEYS = [
    'cognitive_training_v135','cognitive_training_v119','cognitive_training_v118',
    'cognitive_training_v43', 'cognitive_training_v42', 'cognitive_training_v41',
    'cognitive_training_v40', 'cognitive_training_v33', 'cognitive_training_v32'
];

// 头像列表
export const AVATAR_LIST = [
    { emoji: '👤', gradient: 'linear-gradient(135deg,#FFD4B8,#FFB6C1)' },
    { emoji: '🧠', gradient: 'linear-gradient(135deg,#B8D4FF,#A8C4FF)' },
    { emoji: '📚', gradient: 'linear-gradient(135deg,#B8FFD4,#A8E4C1)' },
    { emoji: '🎯', gradient: 'linear-gradient(135deg,#E4B8FF,#D4A8FF)' },
    { emoji: '⭐', gradient: 'linear-gradient(135deg,#FFE4B8,#FFD8A8)' },
    { emoji: '🚀', gradient: 'linear-gradient(135deg,#B8E4FF,#A8D8FF)' },
    { emoji: '💡', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { emoji: '🔥', gradient: 'linear-gradient(135deg,#ff6b6b,#ff4757)' },
    { emoji: '⚡', gradient: 'linear-gradient(135deg,#FF9A63,#E87A4E)' },
    { emoji: '✅', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
    { emoji: '💎', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { emoji: '🎨', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' }
];

// 视觉AI API (硅基流动)
export const VISION_API_KEY = 'sk-upymyvbtqdunkmmksrmtqugootqqysvgevwkllyomqcvskrw';
export const VISION_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
export const VISION_MODEL = 'Qwen/Qwen3-VL-30B-A3B-Instruct';

console.log('✅ config 模块加载完成');
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
/**
 * 工具函数模块 - ES6 Modules 版本
 */

// 显示 Toast 提示
export function showToast(message, duration = 2000) {
    // 移除现有 toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 99999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// HTML 转义
export function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化日期
export function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 格式化时间
export function formatDateTime(date) {
    const d = new Date(date);
    return `${formatDate(date)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 生成唯一ID
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 防抖函数
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 深拷贝
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

// 格式化AI响应
export function formatAIResponse(text) {
    if (typeof text !== 'string') return text;
    
    // 处理代码块
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 处理加粗
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理换行
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// 语音朗读
export function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    
    // 停止之前的朗读
    stopTTSSpeech();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
}

// 停止语音朗读
export function stopTTSSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// 将常用函数挂载到 window，方便全局访问
if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.escapeHtml = escapeHtml;
    window.formatDate = formatDate;
    window.formatDateTime = formatDateTime;
    window.generateId = generateId;
}

console.log('✅ utils 模块加载完成');
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
/**
 * 用户模块 - ES6 Modules 版本
 */

import { loadData, saveData, getCurrentUser, createUser, deleteUser } from './storage.js';
import { showToast } from './utils.js';

// 获取所有用户
export function getAllUsers() {
    const data = loadData();
    return data.users || [];
}

// 快速登录（用户选择）
export function quickLogin(userId) {
    const data = loadData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
        data.currentUser = userId;
        saveData(data);
        showToast(`已切换到: ${user.name}`);
        // 刷新页面
        setTimeout(() => location.reload(), 500);
        return true;
    }
    showToast('用户不存在');
    return false;
}

// 切换到用户
export function switchToUser(userId) {
    return quickLogin(userId);
}

// 显示用户菜单模态框
export function showUserSwitchModal() {
    // 先更新用户菜单UI
    updateUserMenuUI();
    document.getElementById('user-switch-modal')?.classList.add('show');
}

// 关闭用户菜单模态框
export function closeUserSwitchModal() {
    document.getElementById('user-switch-modal')?.classList.remove('show');
}

// 显示用户列表/切换模态框
export function showUserListModal() {
    closeUserSwitchModal();
    
    const data = loadData();
    const container = document.getElementById('user-list-content');
    const modal = document.getElementById('user-list-modal');
    
    if (!container || !modal) {
        showToast('页面加载异常');
        return;
    }
    
    const colors = ['#667eea', '#FF9A63', '#43E97B'];
    let html = '';
    
    data.users.forEach((u, i) => {
        const isCurrent = u.id === data.currentUser;
        html += `
            <div onclick="window.UserModule.switchToUser('${u.id}')" style="display:flex;align-items:center;gap:12px;padding:12px;background:${isCurrent ? '#e8f4ff' : 'white'};border-radius:12px;margin-bottom:8px;cursor:pointer;">
                <div style="background:${colors[i % 3]};color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">
                    ${u.avatar || u.name.charAt(0)}
                </div>
                <div>
                    <div style="font-weight:600;">${u.name} ${isCurrent ? '(当前)' : ''}</div>
                    <div style="font-size:12px;color:#999;">${u.grade} · Lv.${u.difficulty}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    modal.classList.add('show');
}

// 关闭用户列表模态框
export function closeUserListModal() {
    document.getElementById('user-list-modal')?.classList.remove('show');
}

// 显示难度调整模态框
export function showDifficultyModal() {
    closeUserSwitchModal();
    document.getElementById('difficulty-modal')?.classList.add('show');
}

// 关闭难度调整模态框
export function closeDifficultyModal() {
    document.getElementById('difficulty-modal')?.classList.remove('show');
}

// 设置难度
export function setDifficulty(level) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.difficulty = level;
        saveData(data);
        showToast(`难度已调整为 Lv.${level}`);
        closeDifficultyModal();
        setTimeout(() => location.reload(), 500);
    }
}

// 显示头像选择模态框
export function showAvatarModal() {
    closeUserSwitchModal();
    
    const container = document.getElementById('avatar-options');
    const modal = document.getElementById('avatar-modal');
    
    if (!container || !modal) {
        showToast('页面加载异常');
        return;
    }
    
    const avatars = ['👤', '😊', '😎', '🤓', '🥳', '😄', '😍', '🤩', '😇', '🧐', '🤔', '😋', '🙂', '😌', '😀'];
    container.innerHTML = avatars.map(avatar => `
        <div onclick="window.UserModule.setAvatar('${avatar}')" style="padding:16px;text-align:center;font-size:32px;cursor:pointer;border-radius:12px;transition:background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
            ${avatar}
        </div>
    `).join('');
    
    modal.classList.add('show');
}

// 关闭头像选择模态框
export function closeAvatarModal() {
    document.getElementById('avatar-modal')?.classList.remove('show');
}

// 设置头像
export function setAvatar(avatar) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.avatar = avatar;
        saveData(data);
        showToast('头像已更新');
        closeAvatarModal();
        setTimeout(() => location.reload(), 500);
    }
}

// 清除当前用户数据
export function clearCurrentUserData() {
    if (confirm('确定要清除当前用户的所有数据吗？此操作不可恢复！')) {
        const data = loadData();
        const user = data.users.find(u => u.id === data.currentUser);
        if (user) {
            user.goals = [];
            user.wrongQuestions = [];
            user.pomodoroHistory = [];
            user.learningRecords = [];
            saveData(data);
            showToast('数据已清除');
            closeUserSwitchModal();
            setTimeout(() => location.reload(), 500);
        }
    }
}

// 显示设置模态框
export function showSettingsModal() {
    closeUserSwitchModal();
    document.getElementById('settings-modal')?.classList.add('show');
}

// 关闭设置模态框
export function closeSettingsModal() {
    document.getElementById('settings-modal')?.classList.remove('show');
}

// 更新用户菜单UI
function updateUserMenuUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    const avatarEl = document.getElementById('menu-user-avatar');
    const nameEl = document.getElementById('menu-user-name');
    const infoEl = document.getElementById('menu-user-info');
    const difficultyEl = document.getElementById('menu-difficulty');
    
    if (avatarEl) avatarEl.textContent = user.avatar || user.name.charAt(0);
    if (nameEl) nameEl.textContent = user.name;
    if (infoEl) infoEl.textContent = `${user.grade || '未设置'} · Lv.${user.difficulty || 1}`;
    if (difficultyEl) difficultyEl.textContent = `Lv.${user.difficulty || 1}`;
}

// 显示创建用户模态框
export function showCreateUserModal() {
    document.getElementById('create-user-modal')?.classList.add('show');
}

// 关闭创建用户模态框
export function closeCreateUserModal() {
    document.getElementById('create-user-modal')?.classList.remove('show');
}

// 创建新用户
export function createNewUser() {
    const nameInput = document.getElementById('new-user-name');
    const gradeInput = document.getElementById('new-user-grade');
    const difficultyInput = document.getElementById('new-user-difficulty');
    
    const name = nameInput?.value?.trim();
    if (!name) {
        showToast('请输入用户名');
        return;
    }
    
    const newUser = createUser({
        name,
        grade: gradeInput?.value || '未设置',
        difficulty: parseInt(difficultyInput?.value || '1')
    });
    
    closeCreateUserModal();
    showToast(`用户 ${newUser.name} 创建成功`);
    setTimeout(() => location.reload(), 500);
}

// 显示删除用户模态框
export function showDeleteUserModal() {
    document.getElementById('delete-user-modal')?.classList.add('show');
}

// 关闭删除用户模态框
export function closeDeleteUserModal() {
    document.getElementById('delete-user-modal')?.classList.remove('show');
}

// 确认删除用户
export function confirmDeleteUser(userId) {
    if (confirm('确定要删除这个用户吗？所有数据将被清除！')) {
        const success = deleteUser(userId);
        if (success) {
            showToast('用户已删除');
            closeDeleteUserModal();
            setTimeout(() => location.reload(), 500);
        }
    }
}

// 更新用户信息
export function updateUser(userId, updates) {
    const data = loadData();
    const index = data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        saveData(data);
        return true;
    }
    return false;
}

// 重新导出 storage 中的函数
export { getCurrentUser } from './storage.js';

// 兼容其他模块的导入名称
export function getCurrentUserData() {
    return getCurrentUser();
}

export function updateCurrentUser(updates) {
    const user = getCurrentUser();
    if (user) {
        return updateUser(user.id, updates);
    }
    return false;
}

// 导出所有函数到全局对象
export const UserModule = {
    getAllUsers,
    getCurrentUser,
    quickLogin,
    switchToUser,
    showUserSwitchModal,
    closeUserSwitchModal,
    showUserListModal,
    closeUserListModal,
    showCreateUserModal,
    closeCreateUserModal,
    createNewUser,
    showDeleteUserModal,
    closeDeleteUserModal,
    confirmDeleteUser,
    showDifficultyModal,
    closeDifficultyModal,
    setDifficulty,
    showAvatarModal,
    closeAvatarModal,
    setAvatar,
    clearCurrentUserData,
    showSettingsModal,
    closeSettingsModal,
    updateUser,
    createUser,
    deleteUser
};

// 挂载到全局
if (typeof window !== 'undefined') {
    window.UserModule = UserModule;
}

console.log('✅ user 模块加载完成');
/**
 * 全局对象挂载模块 - 确保所有需要的全局函数都可用
 */

// 先导入所有需要的模块
import * as utils from './utils.js';
import * as storage from './storage.js';
import { UserModule } from './user.js';
import { initUI, navigateTo } from './modules/ui.js';

// 挂载到 window
window.showToast = utils.showToast;
window.loadData = storage.loadData;
window.saveData = storage.saveData;
window.getCurrentUser = storage.getCurrentUser;
window.switchUser = storage.switchUser;
window.createUser = storage.createUser;
window.deleteUser = UserModule.confirmDeleteUser;
window.UserModule = UserModule;
window.UI = { initUI, navigateTo };
if (!window.App) window.App = {};
window.App.navigateTo = navigateTo;
window.App.goHome = () => navigateTo('home');

console.log('✅ 全局对象挂载完成');

export { utils, storage, UserModule, initUI, navigateTo };
/**
 * UI 模块 - ES6 Modules 版本
 * 负责页面渲染、导航、模态框管理
 */

import { showToast } from '../utils.js';
import { getCurrentUser, UserModule } from '../user.js';
import { renderSelfDrive } from './selfdrive.js';
import { renderDeepSeekPage } from './deepseek.js';
import { renderWrongBookPage } from './wrongbook.js';
import { renderPomodoroPage } from './pomodoro.js';
import { renderMethodPage } from './method.js';
import { renderThinkingPage } from './thinking.js';

// ========== 导航系统 ==========

// 页面路由配置
const routes = {
    home: renderHomePage,
    method: renderMethodModule,
    thinking: renderThinkingModule,
    wrongbook: renderWrongBookModule,
    pomodoro: renderPomodoroModule,
    deepseek: renderDeepSeekModule,
    selfdrive: renderSelfDrive,
    growth: renderGrowthPage,
};

// 渲染首页
export function renderHomePage(container) {
    // 已迁移完成的模块
    const migratedModules = [
        { id: 'method', icon: '📚', name: '学霸方法', color: '#667eea', status: 'done' },
        { id: 'thinking', icon: '🧠', name: '思维训练', color: '#764ba2', status: 'done' },
        { id: 'wrongbook', icon: '📕', name: '错题本', color: '#ff6b6b', status: 'done' },
        { id: 'pomodoro', icon: '🍅', name: '番茄钟', color: '#FF9A63', status: 'done' },
        { id: 'deepseek', icon: '🤖', name: 'AI 助手', color: '#43E97B', status: 'done' },
        { id: 'selfdrive', icon: '🎯', name: '自驱力', color: '#4facfe', status: 'done' },
    ];
    
    // 迁移中的模块 - 全部放开，缺失的渲染函数会显示开发中提示
    const inProgressModules = [
        { id: 'ai', icon: '💡', name: 'AI 工具', color: '#FFD700', status: 'done' },
        { id: 'games', icon: '🎮', name: '游戏化', color: '#FF6B9D', status: 'done' },
        { id: 'plan', icon: '📋', name: '计划', color: '#A855F7', status: 'done' },
        { id: 'practice', icon: '✍️', name: '练习', color: '#06B6D4', status: 'done' },
        { id: 'journal', icon: '📔', name: '日记', color: '#F97316', status: 'done' },
        { id: 'library', icon: '📖', name: '图书馆', color: '#84CC16', status: 'done' },
        { id: 'stats', icon: '📊', name: '统计', color: '#EC4899', status: 'done' },
        { id: 'topics', icon: '🎯', name: '题库', color: '#14B8A6', status: 'done' },
        { id: 'podcast', icon: '🎧', name: '播客', color: '#8B5CF6', status: 'done' },
        { id: 'video', icon: '🎬', name: '视频', color: '#EF4444', status: 'done' },
        { id: 'player', icon: '📱', name: '播放器', color: '#F59E0B', status: 'done' },
        { id: 'map', icon: '🗺️', name: '知识地图', color: '#10B981', status: 'done' },
        { id: 'mindmap', icon: '🌳', name: '思维导图', color: '#3B82F6', status: 'done' },
        { id: 'notepad', icon: '📝', name: '记事本', color: '#6366F1', status: 'done' },
        { id: 'calculator', icon: '🔢', name: '计算器', color: '#8B5CF6', status: 'done' },
        { id: 'mypage', icon: '👤', name: '我的', color: '#EC4899', status: 'done' },
    ];
    
    const allModules = [...migratedModules, ...inProgressModules];
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="welcome-section" style="margin-bottom: 20px;">
                <h2 style="font-size: 20px; margin-bottom: 8px;">👋 你好，${getCurrentUser()?.name || '同学'}！</h2>
                <p style="color: #666; font-size: 14px;">ES6 Modules 版本 - 模块迁移中 🔄</p>
            </div>
            
            <div class="modules-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                ${allModules.map(m => `
                    <div 
                        class="module-card" 
                        data-module="${m.id}"
                        data-status="${m.status}"
                        style="background: linear-gradient(135deg, ${m.color}, ${m.color}dd); padding: 14px 10px; border-radius: 16px; text-align: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; position: relative; min-height: 90px;"
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
                        onmouseout="this.style.transform=''; this.style.boxShadow='';">
                        ${m.status === 'progress' ? '<span style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.25);color:white;padding:2px 6px;border-radius:10px;font-size:9px;font-weight:500;">迁移中</span>' : ''}
                        <div style="font-size: 28px; margin-bottom: 6px;">${m.icon}</div>
                        <div style="font-size: 13px; font-weight: 600; color: white;">${m.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定模块卡片点击事件
    container.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            const status = card.dataset.status;
            
            if (status === 'progress') {
                showToast('该模块迁移中，敬请期待... 🚧');
                return;
            }
            
            navigateTo(moduleId);
        });
    });
}

// 占位页面渲染函数
function renderPlaceholderPage(container, icon, name, color) {
    container.innerHTML = `
        <div style="padding: 40px 20px; text-align: center;">
            <button id="back-btn" style="position: absolute; top: 16px; left: 16px; padding: 8px 16px; background: ${color}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                ← 返回首页
            </button>
            <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
            <h2 style="margin-bottom: 12px; color: ${color};">${name}</h2>
            <p style="color: #999;">模块开发中，敬请期待...</p>
            <button onclick="window.showToast('${name}模块开发中 🚧')" style="margin-top: 20px; padding: 12px 24px; background: ${color}; color: white; border: none; border-radius: 8px; cursor: pointer;">
                点我测试
            </button>
        </div>
    `;
    
    // 返回按钮
    document.getElementById('back-btn')?.addEventListener('click', () => {
        navigateTo('home');
    });
}

function renderMethodModule(container) {
    container.innerHTML = '';
    renderMethodPage(container);
}
function renderThinkingModule(container) {
    container.innerHTML = '';
    renderThinkingPage(container);
}
function renderWrongBookModule(container) {
    container.innerHTML = '';
    renderWrongBookPage(container);
}
function renderPomodoroModule(container) {
    container.innerHTML = '';
    renderPomodoroPage(container);
}
function renderDeepSeekModule(container) {
    container.innerHTML = renderDeepSeekPage();
}
function renderGrowthPage(container) { renderPlaceholderPage(container, '📈', '成长轨迹', '#f6d365'); }

// 页面导航
export function navigateTo(pageId) {
    const container = document.getElementById('app-container') || document.body;
    const renderFn = routes[pageId];
    
    if (renderFn) {
        renderFn(container);
        showToast(`已打开: ${pageId} 模块 ✨`);
        console.log(`📍 导航到: ${pageId}`);
    } else {
        console.warn(`⚠️ 模块正在迁移中，显示占位页面: ${pageId}`);
        // 显示通用占位页面
        renderPlaceholderPage(container, '🚧', pageId + ' 模块', '#667eea');
    }
}

// ========== 模态框系统 ==========

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        return true;
    }
    return false;
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        return true;
    }
    return false;
}

// ========== 初始化 UI ==========

function initNavigation() {
    const avatar = document.getElementById('header-avatar');
    if (avatar) {
        avatar.addEventListener('click', () => {
            if (UserModule && UserModule.showUserSwitchModal) {
                UserModule.showUserSwitchModal();
            } else {
                showToast('用户系统加载中... 👤');
            }
        });
    }
    
    // 更新头像显示
    const user = getCurrentUser();
    if (user) {
        const avatarEl = document.getElementById('header-avatar');
        const userNameEl = document.getElementById('user-name-display');
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (userNameEl) userNameEl.textContent = user.name;
    }
    
    console.log('✅ 导航系统初始化完成');
}

export function initUI() {
    console.log('🚀 initUI 函数被调用！');
    console.log('🎨 初始化 UI 模块...');
    
    initNavigation();
    
    const container = document.getElementById('app-container');
    if (container) {
        renderHomePage(container);
    }
    
    showToast('UI 模块初始化成功！', 1500);
    console.log('✅ UI 模块初始化完成');
}

// 挂载常用函数到 window.App，供 HTML onclick 调用
if (typeof window !== 'undefined') {
    if (!window.App) window.App = {};
    // 同时挂载到两个路径，兼容不同的调用方式
    window.App.ui = {
        goHome: () => navigateTo('home'),
        navigateTo: navigateTo
    };
    window.App.navigateTo = navigateTo;
    window.App.goHome = () => navigateTo('home');
}

console.log('✅ ui 模块加载完成');
/**
 * 自驱力模块 - ES6 Modules 版本
 */

import { showToast } from '../utils.js';

// ========== 数据管理 ==========
const STORAGE_KEY = 'self_drive_data';

function getDriveData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function saveDriveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 获取目标列表
export function getGoals() {
    const data = getDriveData();
    return data.goals || [];
}

// 保存目标列表
export function saveGoals(goals) {
    const data = getDriveData();
    data.goals = goals;
    saveDriveData(data);
}

// 添加目标
export function addGoal(title) {
    const goals = getGoals();
    goals.push({
        id: 'goal_' + Date.now(),
        title,
        completed: false,
        createdAt: new Date().toISOString()
    });
    saveGoals(goals);
    showToast('目标添加成功！🎯');
    return goals;
}

// 切换目标完成状态
export function toggleGoal(goalId) {
    const goals = getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = !goal.completed;
        saveGoals(goals);
        showToast(goal.completed ? '目标完成！✅' : '目标已重置 🎯');
    }
    return goals;
}

// 删除目标
export function deleteGoal(goalId) {
    const goals = getGoals().filter(g => g.id !== goalId);
    saveGoals(goals);
    showToast('目标已删除 🗑️');
    return goals;
}

// ========== 页面渲染 ==========

// 渲染自驱力首页
export function renderSelfDrive(container) {
    const goals = getGoals();
    const completedCount = goals.filter(g => g.completed).length;
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px;">🎯 自驱力训练</h2>
                <button id="sd-back-btn" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ← 返回
                </button>
            </div>
            
            <div style="background: linear-gradient(135deg,#667eea15,#764ba215); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">今日目标进度</div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${goals.length > 0 ? (completedCount / goals.length * 100) : 0}%; height: 100%; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 4px; transition: width 0.3s;"></div>
                    </div>
                    <span style="font-weight: 600; color: #667eea;">${completedCount}/${goals.length}</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                <input 
                    type="text" 
                    id="new-goal-input" 
                    placeholder="输入新目标..." 
                    style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
                >
                <button id="add-goal-btn" style="padding: 12px 20px; background: linear-gradient(135deg,#667eea,#764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    + 添加
                </button>
            </div>
            
            <div id="goals-list" style="display: flex; flex-direction: column; gap: 10px;">
                ${goals.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <div style="font-size: 48px; margin-bottom: 12px;">🎯</div>
                        <div>还没有设定目标</div>
                        <div style="font-size: 12px; margin-top: 8px;">设定一个小目标，开始行动吧！</div>
                    </div>
                ` : goals.map(goal => `
                    <div class="goal-item" data-id="${goal.id}" style="background: white; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <div class="goal-checkbox" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${goal.completed ? '#43E97B' : '#ddd'}; background: ${goal.completed ? '#43E97B' : 'white'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">
                            ${goal.completed ? '✓' : ''}
                        </div>
                        <div style="flex: 1; text-decoration: ${goal.completed ? 'line-through' : 'none'}; color: ${goal.completed ? '#999' : '#333'};">
                            ${goal.title}
                        </div>
                        <button class="delete-goal-btn" data-id="${goal.id}" style="padding: 6px 12px; background: #ff6b6b; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
                            删除
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定事件
    bindSelfDriveEvents(container);
}

// 绑定自驱力页面事件
function bindSelfDriveEvents(container) {
    // 返回按钮
    container.querySelector('#sd-back-btn')?.addEventListener('click', () => {
        // 这里会由主应用处理导航
        window.App.ui.goHome();
    });
    
    // 添加目标按钮
    container.querySelector('#add-goal-btn')?.addEventListener('click', () => {
        const input = container.querySelector('#new-goal-input');
        if (input && input.value.trim()) {
            addGoal(input.value.trim());
            renderSelfDrive(container); // 重新渲染
        } else {
            showToast('请输入目标内容');
        }
    });
    
    // 回车添加目标
    container.querySelector('#new-goal-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            container.querySelector('#add-goal-btn')?.click();
        }
    });
    
    // 切换目标状态
    container.querySelectorAll('.goal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const goalItem = e.target.closest('.goal-item');
            if (goalItem) {
                toggleGoal(goalItem.dataset.id);
                renderSelfDrive(container); // 重新渲染
            }
        });
    });
    
    // 删除目标
    container.querySelectorAll('.delete-goal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteGoal(btn.dataset.id);
            renderSelfDrive(container); // 重新渲染
        });
    });
}

// ========== 模块初始化 ==========
export function initSelfDrive() {
    console.log('✅ 自驱力模块初始化完成');
    return {
        getGoals,
        addGoal,
        toggleGoal,
        deleteGoal,
        renderSelfDrive
    };
}

console.log('✅ selfdrive 模块加载完成');
// DeepSeek AI 助手模块 - ES6 Modules 版本
import { showToast, escapeHtml, formatAIResponse, speakText, stopTTSSpeech } from '../utils.js';
import { DEEPSEEK_API_URL, DEEPSEEK_API_KEY, DEEPSEEK_MODEL, VISION_API_KEY, VISION_API_URL, VISION_MODEL } from '../config.js';
import { getCurrentUserData } from '../user.js';

// 模块内部状态
let currentDeepSeekImage = null;
let deepseekConversationHistory = [];

/**
 * 视觉API - 图片理解
 */
export async function callVisionAPI(imageDataUrl, question) {
    if (VISION_API_KEY && VISION_API_URL) {
        try {
            const messages = [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: imageDataUrl } },
                    { type: 'text', text: question }
                ]
            }];
            const response = await fetch(VISION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + VISION_API_KEY },
                body: JSON.stringify({ model: VISION_MODEL, messages: messages, max_tokens: 1000 })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0]) return { success: true, content: data.choices[0].message.content };
            }
        } catch (e) {
            console.warn('Vision API failed:', e.message);
        }
    }
    return { success: false, content: '' };
}

/**
 * 调用DeepSeek API
 */
export async function callDeepSeekAPI(messages, temperature = 0.7) {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: messages, temperature: temperature, max_tokens: 2000 })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 402 || response.status === 400) {
                return { error: true, type: 'balance', message: 'DeepSeek账户余额不足，请先充值后再使用AI功能。前往: https://platform.deepseek.com' };
            }
            throw new Error(errorData.error?.message || 'API调用失败');
        }
        const data = await response.json();
        return { success: true, content: data.choices[0].message.content };
    } catch (error) {
        return { error: true, type: 'network', message: error.message };
    }
}

/**
 * 发送消息到DeepSeek
 */
export async function sendToDeepSeek() {
    const input = document.getElementById('deepseek-input');
    if (!input) return;
    const msg = input.value.trim();

    if (!msg && !currentDeepSeekImage) {
        showToast('请输入问题或上传图片');
        return;
    }

    const messagesEl = document.getElementById('deepseek-messages');
    if (!messagesEl) return;

    stopTTSSpeech();

    let userMsgHtml = '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble">';
    if (currentDeepSeekImage) {
        userMsgHtml += '<img src="' + currentDeepSeekImage + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:8px;display:block;"/>';
    }
    if (msg) {
        userMsgHtml += escapeHtml(msg);
    }
    userMsgHtml += '</div></div>';
    messagesEl.innerHTML += userMsgHtml;
    input.value = '';
    messagesEl.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble ai-loading">思考中<span class="loading-dots"><span></span><span></span><span></span></span></div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;

    let userContent;
    const hasImage = !!currentDeepSeekImage;
    const imageDataUrl = currentDeepSeekImage;

    if (hasImage) {
        const visionResult = await callVisionAPI(imageDataUrl, msg || '请分析这张图片');
        if (visionResult.success) {
            userContent = '[AI图片分析：' + visionResult.content + ']\n\n' + (msg || '请基于以上图片分析进一步回答');
        } else if (msg) {
            userContent = msg + '\n（已附上图片，但图片理解API未配置）';
            showToast('💡 图片分析需配置VISION_API_KEY，已按文字处理');
        } else {
            userContent = '请帮我分析这张图片';
            showToast('⚠️ 请输入文字描述图片内容');
        }
    } else {
        userContent = msg;
    }

    deepseekConversationHistory.push({ role: 'user', content: userContent });
    clearDeepSeekImage();

    try {
        const result = await callDeepSeekAPI(deepseekConversationHistory);
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');

        if (result.error) {
            if (bubbles.length > 0) {
                if (result.type === 'balance') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="window.App.deepseek.openDeepSeekRecharge()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;cursor:pointer;">前往充值</button>';
                } else {
                    bubbles[bubbles.length - 1].innerHTML = '❌ 抱歉，' + result.message;
                }
            }
        } else {
            const responseContent = result.content;
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent);
            }
            deepseekConversationHistory.push({ role: 'assistant', content: responseContent });
            speakText(responseContent);
        }
    } catch (error) {
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (bubbles.length > 0) {
            bubbles[bubbles.length - 1].innerHTML = '❌ 发生错误，请稍后重试。';
        }
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

/**
 * 清除DeepSeek图片
 */
export function clearDeepSeekImage() {
    currentDeepSeekImage = null;
    const preview = document.getElementById('deepseek-image-preview');
    if (preview) {
        preview.style.display = 'none';
    }
}

/**
 * 处理DeepSeek图片上传
 */
export function handleDeepSeekImage(input) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        currentDeepSeekImage = e.target.result;

        const preview = document.getElementById('deepseek-image-preview');
        const previewImg = document.getElementById('deepseek-preview-img');
        if (preview && previewImg) {
            previewImg.src = currentDeepSeekImage;
            preview.style.display = 'block';
        }

        showToast('图片已添加，输入问题后发送');
        input.value = '';
    };
    reader.readAsDataURL(file);
}

/**
 * 打开DeepSeek充值页面
 */
export function openDeepSeekRecharge() {
    window.open('https://platform.deepseek.com', '_blank');
}

/**
 * 显示DeepSeek余额提示
 */
export function showDeepSeekBalanceAlert() {
    const modal = document.getElementById('detail-modal');
    const contentDiv = document.getElementById('detail-content');
    if (modal && contentDiv) {
        modal.classList.add('show');
        contentDiv.innerHTML = '<div class="modal-title">⚠️ AI功能提示</div>' +
            '<div style="background:#fff3cd;border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">' +
            '<div style="font-size:48px;margin-bottom:12px;">💰</div>' +
            '<div style="font-size:15px;font-weight:bold;color:#856404;margin-bottom:8px;">DeepSeek账户余额不足</div>' +
            '<div style="font-size:13px;color:#856404;line-height:1.6;">当前账户无法继续使用AI功能，请前往DeepSeek平台充值后再试。</div></div>' +
            '<button class="login-btn" style="width:100%;" onclick="window.open(\'https://platform.deepseek.com\',\'_blank\')">前往充值</button>' +
            '<button class="login-btn login-btn-secondary" style="margin-top:12px;width:100%;" onclick="document.getElementById(\'detail-modal\').classList.remove(\'show\')">关闭</button>';
    }
}

/**
 * 查询DeepSeek余额
 */
export async function queryDeepSeekBalance(showToastFlag = false) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/users/me/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('无法获取余额');
        }

        const data = await response.json();
        const balance = data.is_available ? (data.balance / 100).toFixed(2) : '0.00';
        const tokens = data.is_available ? Math.floor(data.balance / 0.001) : 0;

        const user = getCurrentUserData();
        const todayCalls = user?.deepSeekCalls?.today || 0;
        const totalCalls = user?.deepSeekCalls?.total || 0;

        if (showToastFlag) {
            showToast('余额已更新');
        }

        return {
            balance: '¥' + balance,
            tokens: tokens.toLocaleString(),
            todayCalls: todayCalls,
            totalCalls: totalCalls,
            lastUpdate: new Date().toLocaleTimeString()
        };
    } catch (error) {
        return {
            balance: '¥--',
            tokens: '--',
            todayCalls: 0,
            totalCalls: 0,
            lastUpdate: '查询失败',
            error: error.message
        };
    }
}

/**
 * 渲染DeepSeek聊天页面
 */
export function renderDeepSeekPage() {
    return `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🤖 DeepSeek AI 助手</h2>
            </div>
            <div class="deepseek-container">
                <div id="deepseek-messages" class="deepseek-messages"></div>
                <div id="deepseek-image-preview" class="image-preview" style="display:none;">
                    <img id="deepseek-preview-img" />
                    <button class="clear-image-btn" onclick="window.App.deepseek.clearDeepSeekImage()">×</button>
                </div>
                <div class="deepseek-input-area">
                    <label class="image-upload-btn">
                        <input type="file" accept="image/*" onchange="window.App.deepseek.handleDeepSeekImage(this)" />
                        📷
                    </label>
                    <textarea id="deepseek-input" placeholder="输入问题..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();window.App.deepseek.sendToDeepSeek()}"></textarea>
                    <button class="send-btn" onclick="window.App.deepseek.sendToDeepSeek()">➤</button>
                </div>
            </div>
        </div>
    `;
}

// 挂载到window.App，供HTML onclick调用
if (!window.App) window.App = {};
window.App.deepseek = {
    sendToDeepSeek,
    handleDeepSeekImage,
    clearDeepSeekImage,
    openDeepSeekRecharge,
    showDeepSeekBalanceAlert
};
// 错题本模块 - ES6 Modules 版本
import { showToast, escapeHtml, formatDate, generateId } from '../utils.js';
import { saveData, loadData } from '../storage.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

/**
 * 获取错题列表
 */
export function getWrongQuestions() {
    const user = getCurrentUserData();
    return user?.wrongQuestions || [];
}

/**
 * 添加错题
 */
export function addWrongQuestion(question) {
    const user = getCurrentUserData();
    if (!user) {
        showToast('请先登录');
        return null;
    }

    const newQuestion = {
        id: generateId('wq'),
        ...question,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewedAt: null
    };

    if (!user.wrongQuestions) {
        user.wrongQuestions = [];
    }
    user.wrongQuestions.unshift(newQuestion);
    updateCurrentUser(user);
    
    showToast('错题添加成功 ✅');
    return newQuestion;
}

/**
 * 更新错题
 */
export function updateWrongQuestion(id, updates) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    const index = user.wrongQuestions.findIndex(q => q.id === id);
    if (index === -1) return false;

    user.wrongQuestions[index] = {
        ...user.wrongQuestions[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    updateCurrentUser(user);
    
    showToast('错题更新成功 ✅');
    return true;
}

/**
 * 删除错题
 */
export function deleteWrongQuestion(id) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    user.wrongQuestions = user.wrongQuestions.filter(q => q.id !== id);
    updateCurrentUser(user);
    
    showToast('错题已删除');
    return true;
}

/**
 * 标记已复习
 */
export function markAsReviewed(id) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    const question = user.wrongQuestions.find(q => q.id === id);
    if (question) {
        question.reviewCount = (question.reviewCount || 0) + 1;
        question.lastReviewedAt = new Date().toISOString();
        updateCurrentUser(user);
        showToast('已标记为已复习 ✅');
    }
    return true;
}

/**
 * 获取科目列表
 */
export function getSubjects() {
    const questions = getWrongQuestions();
    const subjects = new Set(questions.map(q => q.subject).filter(Boolean));
    return Array.from(subjects);
}

/**
 * 按科目筛选错题
 */
export function filterBySubject(subject) {
    const questions = getWrongQuestions();
    if (!subject) return questions;
    return questions.filter(q => q.subject === subject);
}

/**
 * 渲染错题本页面
 */
export function renderWrongBookPage(container) {
    const questions = getWrongQuestions();
    const subjects = getSubjects();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>📕 错题本</h2>
                <button class="add-btn" onclick="window.App.wrongbook.openAddModal()">+ 添加</button>
            </div>
            
            <div class="wrongbook-container">
                <div class="filter-section">
                    <select id="subject-filter" onchange="window.App.wrongbook.filterQuestions(this.value)">
                        <option value="">全部科目</option>
                        ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <span class="count-badge">共 ${questions.length} 道错题</span>
                </div>
                
                <div id="questions-list" class="questions-list">
                    ${questions.length === 0 ? renderEmptyState() : questions.map(q => renderQuestionCard(q)).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染空状态
 */
function renderEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <p>还没有错题哦</p>
            <p class="empty-desc">点击右上角添加第一道错题</p>
        </div>
    `;
}

/**
 * 渲染错题卡片
 */
function renderQuestionCard(q) {
    const masteryLevel = getMasteryLevel(q.reviewCount || 0);
    
    return `
        <div class="question-card" data-id="${q.id}">
            <div class="question-header">
                <span class="subject-tag">${q.subject || '未分类'}</span>
                <span class="mastery-badge ${masteryLevel.class}">${masteryLevel.text}</span>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="window.App.wrongbook.openEditModal('${q.id}')">✏️</button>
                    <button class="action-btn delete" onclick="window.App.wrongbook.confirmDelete('${q.id}')">🗑️</button>
                </div>
            </div>
            <div class="question-content">
                <p class="question-text">${escapeHtml(q.question || '无题目内容')}</p>
                ${q.image ? `<img src="${q.image}" class="question-image" />` : ''}
            </div>
            <div class="question-answer">
                <div class="answer-label">正确答案：</div>
                <div class="answer-text">${escapeHtml(q.answer || '未填写')}</div>
            </div>
            ${q.note ? `
                <div class="question-note">
                    <div class="note-label">📝 笔记：</div>
                    <div class="note-text">${escapeHtml(q.note)}</div>
                </div>
            ` : ''}
            <div class="question-footer">
                <span class="review-info">已复习 ${q.reviewCount || 0} 次</span>
                <span class="date-info">${formatDate(q.createdAt)}</span>
                <button class="review-btn" onclick="window.App.wrongbook.markAsReviewed('${q.id}')">
                    ✓ 标记已复习
                </button>
            </div>
        </div>
    `;
}

/**
 * 获取掌握程度
 */
function getMasteryLevel(reviewCount) {
    if (reviewCount === 0) return { class: 'mastery-new', text: '未复习' };
    if (reviewCount < 3) return { class: 'mastery-learning', text: '学习中' };
    if (reviewCount < 5) return { class: 'mastery-good', text: '掌握良好' };
    return { class: 'mastery-excellent', text: '完全掌握' };
}

/**
 * 筛选错题
 */
export function filterQuestions(subject) {
    const questions = filterBySubject(subject);
    const listContainer = document.getElementById('questions-list');
    if (listContainer) {
        listContainer.innerHTML = questions.length === 0 
            ? renderEmptyState() 
            : questions.map(q => renderQuestionCard(q)).join('');
    }
}

/**
 * 打开添加错题模态框
 */
export function openAddModal() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="modal-title">📝 添加错题</div>
        <div class="form-group">
            <label>科目</label>
            <input type="text" id="wb-subject" placeholder="如：数学、语文、英语" />
        </div>
        <div class="form-group">
            <label>题目内容</label>
            <textarea id="wb-question" rows="4" placeholder="输入题目内容..."></textarea>
        </div>
        <div class="form-group">
            <label>正确答案</label>
            <textarea id="wb-answer" rows="2" placeholder="输入正确答案..."></textarea>
        </div>
        <div class="form-group">
            <label>错题笔记（可选）</label>
            <textarea id="wb-note" rows="2" placeholder="记录错误原因、解题思路..."></textarea>
        </div>
        <button class="login-btn" onclick="window.App.wrongbook.saveQuestion()">保存错题</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 保存错题
 */
export function saveQuestion() {
    const subject = document.getElementById('wb-subject')?.value?.trim();
    const question = document.getElementById('wb-question')?.value?.trim();
    const answer = document.getElementById('wb-answer')?.value?.trim();
    const note = document.getElementById('wb-note')?.value?.trim();

    if (!question) {
        showToast('请输入题目内容');
        return;
    }

    addWrongQuestion({ subject, question, answer, note });
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新列表
    const container = document.getElementById('app-container');
    if (container) {
        renderWrongBookPage(container);
    }
}

/**
 * 打开编辑模态框
 */
export function openEditModal(id) {
    const questions = getWrongQuestions();
    const q = questions.find(x => x.id === id);
    if (!q) return;

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="modal-title">✏️ 编辑错题</div>
        <div class="form-group">
            <label>科目</label>
            <input type="text" id="wb-subject" value="${escapeHtml(q.subject || '')}" placeholder="如：数学、语文、英语" />
        </div>
        <div class="form-group">
            <label>题目内容</label>
            <textarea id="wb-question" rows="4" placeholder="输入题目内容...">${escapeHtml(q.question || '')}</textarea>
        </div>
        <div class="form-group">
            <label>正确答案</label>
            <textarea id="wb-answer" rows="2" placeholder="输入正确答案...">${escapeHtml(q.answer || '')}</textarea>
        </div>
        <div class="form-group">
            <label>错题笔记（可选）</label>
            <textarea id="wb-note" rows="2" placeholder="记录错误原因、解题思路...">${escapeHtml(q.note || '')}</textarea>
        </div>
        <button class="login-btn" onclick="window.App.wrongbook.updateQuestion('${id}')">保存修改</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 更新错题
 */
export function updateQuestion(id) {
    const subject = document.getElementById('wb-subject')?.value?.trim();
    const question = document.getElementById('wb-question')?.value?.trim();
    const answer = document.getElementById('wb-answer')?.value?.trim();
    const note = document.getElementById('wb-note')?.value?.trim();

    if (!question) {
        showToast('请输入题目内容');
        return;
    }

    updateWrongQuestion(id, { subject, question, answer, note });
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新列表
    const container = document.getElementById('app-container');
    if (container) {
        renderWrongBookPage(container);
    }
}

/**
 * 确认删除
 */
export function confirmDelete(id) {
    if (confirm('确定要删除这道错题吗？')) {
        deleteWrongQuestion(id);
        const container = document.getElementById('app-container');
        if (container) {
            renderWrongBookPage(container);
        }
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.wrongbook = {
    openAddModal,
    saveQuestion,
    openEditModal,
    updateQuestion,
    confirmDelete,
    markAsReviewed,
    filterQuestions
};

console.log('✅ wrongbook 模块加载完成');
// 番茄钟模块 - ES6 Modules 版本
import { showToast, formatDate } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 模块状态
let timerState = {
    isRunning: false,
    isPaused: false,
    mode: 'work', // work | shortBreak | longBreak
    duration: 25 * 60,
    remaining: 25 * 60,
    interval: null,
    startTime: null,
    completedPomodoros: 0,
    totalFocusTime: 0
};

// 默认配置
const DEFAULT_CONFIG = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakAfter: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
};

/**
 * 获取番茄钟配置
 */
export function getPomodoroConfig() {
    const user = getCurrentUserData();
    return user?.pomodoroConfig || { ...DEFAULT_CONFIG };
}

/**
 * 更新番茄钟配置
 */
export function updatePomodoroConfig(config) {
    const user = getCurrentUserData();
    if (!user) return false;

    user.pomodoroConfig = { ...DEFAULT_CONFIG, ...config };
    updateCurrentUser(user);
    
    // 如果计时器没有运行，更新当前模式的时长
    if (!timerState.isRunning) {
        updateDurationByMode(timerState.mode);
    }
    
    showToast('配置已更新 ✅');
    return true;
}

/**
 * 根据模式更新时长
 */
function updateDurationByMode(mode) {
    const config = getPomodoroConfig();
    
    switch (mode) {
        case 'work':
            timerState.duration = config.workDuration * 60;
            break;
        case 'shortBreak':
            timerState.duration = config.shortBreakDuration * 60;
            break;
        case 'longBreak':
            timerState.duration = config.longBreakDuration * 60;
            break;
    }
    timerState.remaining = timerState.duration;
}

/**
 * 获取今日番茄记录
 */
export function getTodayPomodoros() {
    const user = getCurrentUserData();
    const today = formatDate(new Date());
    const records = user?.pomodoroRecords || [];
    return records.filter(r => formatDate(new Date(r.startTime)) === today);
}

/**
 * 开始计时
 */
export function startTimer() {
    if (timerState.isRunning && !timerState.isPaused) {
        showToast('番茄钟已在运行中');
        return false;
    }

    timerState.isRunning = true;
    timerState.isPaused = false;
    timerState.startTime = Date.now();
    
    timerState.interval = setInterval(() => {
        timerState.remaining--;
        
        if (timerState.remaining <= 0) {
            completePomodoro();
        }
        
        // 更新显示
        updateTimerDisplay();
    }, 1000);
    
    showToast(timerState.mode === 'work' ? '🍅 专注开始！' : '☕ 休息开始！');
    return true;
}

/**
 * 暂停计时
 */
export function pauseTimer() {
    if (!timerState.isRunning || timerState.isPaused) return false;
    
    clearInterval(timerState.interval);
    timerState.isPaused = true;
    
    showToast('已暂停 ⏸️');
    return true;
}

/**
 * 继续计时
 */
export function resumeTimer() {
    if (!timerState.isPaused) return false;
    
    timerState.isPaused = false;
    timerState.startTime = Date.now();
    
    timerState.interval = setInterval(() => {
        timerState.remaining--;
        
        if (timerState.remaining <= 0) {
            completePomodoro();
        }
        
        updateTimerDisplay();
    }, 1000);
    
    showToast('继续计时 ⏱️');
    return true;
}

/**
 * 停止计时
 */
export function stopTimer() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.remaining = timerState.duration;
    updateTimerDisplay();
    showToast('已停止');
    return true;
}

/**
 * 重置计时器
 */
export function resetTimer() {
    stopTimer();
    showToast('已重置');
    return true;
}

/**
 * 跳过当前阶段
 */
export function skipTimer() {
    completePomodoro();
    showToast('已跳过当前阶段');
}
/**
 * 完成当前番茄/休息阶段
 */
function completePomodoro() {
    clearInterval(timerState.interval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    if (timerState.mode === 'work') {
        timerState.completedPomodoros++;
        savePomodoroRecord();
        showToast('🍅 专注完成！休息一下吧');
        
        // 检查是否需要长休息
        if (timerState.completedPomodoros % getPomodoroConfig().longBreakAfter === 0) {
            switchMode('longBreak');
        } else {
            switchMode('shortBreak');
        }
    } else {
        showToast('☕ 休息结束！继续专注吧');
        switchMode('work');
    }
    
    updateTimerDisplay();
}

/**
 * 保存番茄记录
 */
function savePomodoroRecord() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const record = {
        id: Date.now(),
        startTime: new Date().toISOString(),
        duration: getPomodoroConfig().workDuration * 60,
        mode: timerState.mode
    };
    
    if (!user.pomodoroRecords) {
        user.pomodoroRecords = [];
    }
    user.pomodoroRecords.push(record);
    updateCurrentUser(user);
}

/**
 * 切换模式
 */
export function switchMode(mode) {
    stopTimer();
    timerState.mode = mode;
    timerState.remaining = getModeDuration(mode);
    updateTimerDisplay();
}

/**
 * 获取模式时长
 */
function getModeDuration(mode) {
    const config = getPomodoroConfig();
    switch (mode) {
        case 'work':
            return config.workDuration * 60;
        case 'shortBreak':
            return config.shortBreakDuration * 60;
        case 'longBreak':
            return config.longBreakDuration * 60;
        default:
            return 25 * 60;
    }
}

/**
 * 获取当前模式的剩余时间显示
 */
function getRemainingDisplay() {
    const minutes = Math.floor(timerState.remaining / 60);
    const seconds = timerState.remaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const modeLabel = document.getElementById('mode-label');
    const progressBar = document.getElementById('timer-progress');
    
    if (display) {
        display.textContent = getRemainingDisplay();
    }
    
    if (modeLabel) {
        const labels = {
            work: '🍅 专注中',
            shortBreak: '☕ 短休息',
            longBreak: '🌴 长休息'
        };
        modeLabel.textContent = labels[timerState.mode];
    }
    
    if (progressBar) {
        const total = timerState.duration;
        const progress = ((total - timerState.remaining) / total) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * 格式化时间显示
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * 渲染番茄钟页面
 */
export function renderPomodoroPage(container) {
    const todayPomodoros = getTodayPomodoros();
    const config = getPomodoroConfig();
    
    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🍅 番茄钟</h2>
                <button class="settings-btn" onclick="window.App.pomodoro.openSettingsModal()">⚙️</button>
            </div>
            
            <div class="pomodoro-container">
                <div class="stats-bar">
                    <div class="stat-item">
                        <span class="stat-icon">🍅</span>
                        <span class="stat-value">${todayPomodoros.length}</span>
                        <span class="stat-label">今日完成</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-value">${Math.floor(todayPomodoros.reduce((acc, r) => acc + r.duration, 0) / 60)}</span>
                        <span class="stat-label">专注分钟</span>
                    </div>
                </div>
                
                <div class="mode-selector">
                    <button class="mode-btn ${timerState.mode === 'work' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('work')">专注</button>
                    <button class="mode-btn ${timerState.mode === 'shortBreak' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('shortBreak')">短休息</button>
                    <button class="mode-btn ${timerState.mode === 'longBreak' ? 'active' : ''}" onclick="window.App.pomodoro.switchMode('longBreak')">长休息</button>
                </div>
                
                <div class="timer-circle">
                    <svg viewBox="0 0 200 200">
                        <circle class="timer-bg" cx="100" cy="100" r="90" stroke-width="8" />
                        <circle id="timer-progress" class="timer-progress" cx="100" cy="100" r="90" stroke-width="8" />
                    </svg>
                    <div class="timer-content">
                        <div id="timer-display" class="timer-display">${formatTime(timerState.remaining)}</div>
                        <div id="mode-label" class="mode-label">${timerState.mode === 'work' ? '🍅 专注中' : timerState.mode === 'shortBreak' ? '☕ 短休息' : '🌴 长休息'}</div>
                    </div>
                </div>
                
                <div class="timer-controls">
                    ${!timerState.isRunning || timerState.isPaused ? `
                        <button class="control-btn primary" onclick="window.App.pomodoro.${timerState.isPaused ? 'resumeTimer' : 'startTimer'}()">
                            ${timerState.isPaused ? '▶️ 继续' : '▶️ 开始'}
                        </button>
                    ` : `
                        <button class="control-btn pause" onclick="window.App.pomodoro.pauseTimer()">⏸️ 暂停</button>
                    `}
                    <button class="control-btn secondary" onclick="window.App.pomodoro.resetTimer()">🔄 重置</button>
                    <button class="control-btn skip" onclick="window.App.pomodoro.skipTimer()">⏭️ 跳过</button>
                </div>
                
                <div class="pomodoros-dots">
                    ${Array(config.longBreakAfter).fill(0).map((_, i) => `
                        <div class="dot ${i < timerState.completedPomodoros % config.longBreakAfter ? 'completed' : ''}"></div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // 更新进度条
    updateTimerDisplay();
}

/**
 * 打开设置模态框
 */
export function openSettingsModal() {
    const config = getPomodoroConfig();
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="modal-title">⚙️ 番茄钟设置</div>
        <div class="form-group">
            <label>专注时长（分钟）</label>
            <input type="number" id="pomodoro-work" value="${config.workDuration}" min="1" max="60" />
        </div>
        <div class="form-group">
            <label>短休息时长（分钟）</label>
            <input type="number" id="pomodoro-short" value="${config.shortBreakDuration}" min="1" max="30" />
        </div>
        <div class="form-group">
            <label>长休息时长（分钟）</label>
            <input type="number" id="pomodoro-long" value="${config.longBreakDuration}" min="1" max="60" />
        </div>
        <div class="form-group">
            <label>长休息间隔（番茄数）</label>
            <input type="number" id="pomodoro-interval" value="${config.longBreakAfter}" min="1" max="10" />
        </div>
        <button class="login-btn" onclick="window.App.pomodoro.saveSettings()">保存设置</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 保存设置
 */
export function saveSettings() {
    const workDuration = parseInt(document.getElementById('pomodoro-work')?.value) || 25;
    const shortBreakDuration = parseInt(document.getElementById('pomodoro-short')?.value) || 5;
    const longBreakDuration = parseInt(document.getElementById('pomodoro-long')?.value) || 15;
    const longBreakAfter = parseInt(document.getElementById('pomodoro-interval')?.value) || 4;
    
    updatePomodoroConfig({
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        longBreakAfter
    });
    
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新页面
    const container = document.getElementById('app-container');
    if (container) {
        renderPomodoroPage(container);
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.pomodoro = {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    skipTimer,
    switchMode,
    openSettingsModal,
    saveSettings
};

console.log('✅ pomodoro 模块加载完成');
// 学霸方法模块 - ES6 Modules 版本
import { showToast, escapeHtml } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 学习方法数据
const LEARNING_METHODS = [
    {
        id: 'feynman',
        name: '费曼学习法',
        icon: '🎓',
        color: '#667eea',
        description: '通过教授他人来验证自己是否真正理解知识',
        steps: [
            '选择一个概念或主题',
            '尝试向一个新手解释这个概念',
            '遇到解释困难的地方，回到材料重新学习',
            '简化解释，用更简单的语言表达'
        ],
        tips: [
            '用自己的话写下来',
            '避免使用专业术语',
            '想象在教一个10岁孩子',
            '用比喻和类比帮助理解'
        ]
    },
    {
        id: 'pomodoro',
        name: '番茄工作法',
        icon: '🍅',
        color: '#FF9A63',
        description: '25分钟专注 + 5分钟休息，高效时间管理',
        steps: [
            '选择一个任务',
            '设置25分钟倒计时',
            '专注工作直到时间结束',
            '休息5分钟',
            '每4个番茄后长休息15-30分钟'
        ],
        tips: [
            '远离手机干扰',
            '一个番茄时间不可分割',
            '保护你的番茄，拒绝打断',
            '记录每天完成的番茄数'
        ]
    },
    {
        id: 'spaced',
        name: '间隔重复法',
        icon: '📅',
        color: '#43E97B',
        description: '根据遗忘曲线，在恰当时间点复习，强化记忆',
        steps: [
            '第1天：学习新知识',
            '第2天：第一次复习',
            '第7天：第二次复习',
            '第14天：第三次复习',
            '第30天：第四次复习'
        ],
        tips: [
            '使用Anki等工具',
            '制作闪卡辅助记忆',
            '越难的内容复习间隔越短',
            '主动回忆比被动阅读更有效'
        ]
    },
    {
        id: 'mindmap',
        name: '思维导图',
        icon: '🧠',
        color: '#f39c12',
        description: '可视化思维，构建知识网络',
        steps: [
            '在中心写下核心主题',
            '向四周发散主要分支',
            '每个分支继续细化子主题',
            '使用关键词和图像',
            '用颜色区分不同类别'
        ],
        tips: [
            '关键词而不是句子',
            '多用图像和符号',
            '颜色编码帮助记忆',
            '从中心向外扩展'
        ]
    },
    {
        id: 'sq3r',
        name: 'SQ3R阅读法',
        icon: '📚',
        color: '#9b59b6',
        description: '浏览-提问-阅读-复述-复习，高效阅读',
        steps: [
            'Survey（浏览）：快速浏览全书结构',
            'Question（提问）：提出自己想了解的问题',
            'Read（阅读）：带着问题仔细阅读',
            'Recite（复述）：用自己的话复述内容',
            'Review（复习）：回顾和复习'
        ],
        tips: [
            '先看目录和标题',
            '每个章节都要提问',
            '做笔记但不要抄书',
            '定期回顾总结'
        ]
    },
    {
        id: 'active',
        name: '主动回忆法',
        icon: '💡',
        color: '#e74c3c',
        description: '合上书本，主动回忆比反复阅读更有效',
        steps: [
            '阅读学习材料',
            '合上书，尝试回忆所有内容',
            '写下你能记住的一切',
            '打开书本对照检查',
            '重点关注遗漏和错误的部分'
        ],
        tips: [
            '回忆比重读更有效',
            '可以用自测题检验',
            '给别人讲解是最好的回忆',
            '定期进行"空白纸回忆'
        ]
    }
];

/**
 * 获取所有学习方法
 */
export function getLearningMethods() {
    return LEARNING_METHODS;
}

/**
 * 获取用户的学习进度
 */
export function getUserMethodProgress() {
    const user = getCurrentUserData();
    return user?.methodProgress || {};
}

/**
 * 更新学习方法进度
 */
export function updateMethodProgress(methodId, progress) {
    const user = getCurrentUserData();
    if (!user) return false;

    if (!user.methodProgress) {
        user.methodProgress = {};
    }
    user.methodProgress[methodId] = {
        ...user.methodProgress[methodId],
        ...progress,
        lastUpdated: new Date().toISOString()
    };
    updateCurrentUser(user);
    return true;
}

/**
 * 标记步骤完成
 */
export function markStepCompleted(methodId, stepIndex) {
    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };
    
    if (!methodProgress.completedSteps.includes(stepIndex)) {
        methodProgress.completedSteps.push(stepIndex);
        updateMethodProgress(methodId, methodProgress);
        showToast('步骤已完成 ✅');
    }
    return true;
}

/**
 * 渲染学霸方法主页
 */
export function renderMethodPage(container) {
    const methods = getLearningMethods();
    const progress = getUserMethodProgress();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>📚 学霸方法</h2>
                <div style="width: 60px;"></div>
            </div>
            
            <div class="method-container">
                <div class="method-intro">
                    <p>选择一个学习方法，提升你的学习效率！</p>
                </div>
                
                <div class="methods-grid">
                    ${methods.map(method => {
                        const methodProgress = progress[method.id] || { completedSteps: [] };
                        const completedCount = methodProgress.completedSteps.length;
                        const totalSteps = method.steps.length;
                        const progressPercent = Math.round((completedCount / totalSteps) * 100);
                        
                        return `
                            <div class="method-card" onclick="window.App.method.openMethodDetail('${method.id}')">
                                <div class="method-icon" style="background: ${method.color}20;">
                                    ${method.icon}
                                </div>
                                <div class="method-info">
                                    <h3 class="method-name">${method.name}</h3>
                                    <p class="method-desc">${method.description}</p>
                                    <div class="method-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progressPercent}%; background: ${method.color};"></div>
                                        </div>
                                        <span class="progress-text">${completedCount}/${totalSteps} 步骤</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 打开学习方法详情
 */
export function openMethodDetail(methodId) {
    const method = LEARNING_METHODS.find(m => m.id === methodId);
    if (!method) return;

    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="method-detail">
            <div class="detail-header" style="background: linear-gradient(135deg, ${method.color}, ${method.color}dd);">
                <div class="detail-icon">${method.icon}</div>
                <h2>${method.name}</h2>
                <p>${method.description}</p>
            </div>
            
            <div class="detail-section">
                <h3>📋 实施步骤</h3>
                <div class="steps-list">
                    ${method.steps.map((step, index) => `
                        <div class="step-item ${methodProgress.completedSteps.includes(index) ? 'completed' : ''}" onclick="window.App.method.toggleStep('${methodId}', ${index})">
                            <div class="step-checkbox">
                                ${methodProgress.completedSteps.includes(index) ? '✓' : ''}
                            </div>
                            <div class="step-content">
                                <span class="step-number">步骤 ${index + 1}</span>
                                <p class="step-text">${step}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>💡 实用技巧</h3>
                <ul class="tips-list">
                    ${method.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <button class="start-practice-btn" onclick="window.App.method.startPractice('${methodId}')">
                🚀 开始实践
            </button>
            
            <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')" style="margin-top: 12px;">
                关闭
            </button>
        </div>
    `;

    modal.classList.add('show');
}

/**
 * 切换步骤完成状态
 */
export function toggleStep(methodId, stepIndex) {
    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };
    
    if (methodProgress.completedSteps.includes(stepIndex)) {
        methodProgress.completedSteps = methodProgress.completedSteps.filter(i => i !== stepIndex);
    } else {
        methodProgress.completedSteps.push(stepIndex);
    }
    
    updateMethodProgress(methodId, methodProgress);
    
    // 刷新详情页
    openMethodDetail(methodId);
}

/**
 * 开始实践
 */
export function startPractice(methodId) {
    showToast('功能开发中，敬请期待 🚀');
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.method = {
    openMethodDetail,
    toggleStep,
    startPractice
};

console.log('✅ method 模块加载完成');
// 思维训练模块 - ES6 Modules 版本
import { showToast, escapeHtml } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 思维训练类型
const THINKING_TYPES = [
    {
        id: 'logic',
        name: '逻辑思维',
        icon: '🔍',
        color: '#3498db',
        description: '通过分析、推理、判断来锻炼逻辑思维能力',
        difficulty: '中等'
    },
    {
        id: 'creative',
        name: '创新思维',
        icon: '💡',
        color: '#e74c3c',
        description: '打破常规，激发创意，培养发散性思维',
        difficulty: '挑战'
    },
    {
        id: 'critical',
        name: '批判思维',
        icon: '🤔',
        color: '#9b59b6',
        description: '学会质疑、分析和评估，培养独立思考能力',
        difficulty: '中等'
    },
    {
        id: 'system',
        name: '系统思维',
        icon: '🌐',
        color: '#1abc9c',
        description: '从整体出发，理解事物之间的联系和影响',
        difficulty: '进阶'
    },
    {
        id: 'reverse',
        name: '逆向思维',
        icon: '🔄',
        color: '#f39c12',
        description: '反方向思考问题，发现新的解决方案',
        difficulty: '挑战'
    },
    {
        id: 'spatial',
        name: '空间思维',
        icon: '🧩',
        color: '#2ecc71',
        description: '锻炼空间想象和几何认知能力',
        difficulty: '入门'
    }
];

// 思维训练题目
const THINKING_QUESTIONS = {
    logic: [
        {
            id: 'l1',
            question: '如果所有的玫瑰都是花，有些花会很快凋谢，我们可以得出什么结论？',
            options: ['所有玫瑰都会很快凋谢', '有些玫瑰会很快凋谢', '不能得出结论'],
            answer: 2,
            explanation: '有些花会凋谢，但我们不知道这些花是否包括玫瑰，所以不能确定玫瑰是否会凋谢。'
        },
        {
            id: 'l2',
            question: '甲、乙、丙三人中，只有一人会游泳。甲说："我会"，乙说："我不会"，丙说："甲不会"。如果只有一人说真话，那么谁会游泳？',
            options: ['甲', '乙', '丙'],
            answer: 1,
            explanation: '甲和丙的话矛盾，必有一真一假。因为只有一人说真话，所以乙说的是假话，乙会游泳。'
        },
        {
            id: 'l3',
            question: '找规律填数：1, 1, 2, 3, 5, 8, ___',
            options: ['11', '12', '13'],
            answer: 2,
            explanation: '这是斐波那契数列，每个数是前两个数之和：5+8=13。'
        }
    ],
    creative: [
        {
            id: 'c1',
            question: '砖头除了盖房子，还能有多少种用途？（至少想出5种）',
            type: 'open',
            hint: '思考不同维度：工具、武器、艺术、教育、生活用品...'
        },
        {
            id: 'c2',
            question: '如果人类不需要睡觉，世界会发生什么变化？',
            type: 'open',
            hint: '从工作、生活、经济、社会、建筑、健康等方面思考'
        },
        {
            id: 'c3',
            question: '如何让一个普通的纸杯卖到100元？',
            type: 'open',
            hint: '附加价值、特殊意义、创意改造、稀缺性...'
        }
    ],
    critical: [
        {
            id: 'cr1',
            question: '"这个药有效，因为90%的人说有用"——这句话有什么逻辑漏洞？',
            options: ['没有漏洞', '样本可能有偏差', '数据肯定是假的'],
            answer: 1,
            explanation: '样本可能存在选择偏差、幸存者偏差，也可能没有对照组进行比较。'
        },
        {
            id: 'cr2',
            question: '"他是好人，因为他经常捐款"——这个论证的问题在哪里？',
            options: ['没问题', '因果关系可能不成立', '捐款肯定有目的'],
            answer: 1,
            explanation: '经常捐款不能证明是"好人"，这是不完全归纳，可能有其他动机。'
        }
    ],
    system: [
        {
            id: 's1',
            question: '为什么过度捕捞会导致渔民收入反而下降？',
            type: 'open',
            hint: '思考整个生态系统、经济系统的连锁反应'
        },
        {
            id: 's2',
            question: '城市里增加更多的道路会缓解交通拥堵吗？为什么？',
            type: 'open',
            hint: '考虑"诱发交通"现象和系统反馈'
        }
    ],
    reverse: [
        {
            id: 'r1',
            question: '如何通过"增加问题"来解决问题？',
            type: 'open',
            hint: '有时候增加一些小问题可以解决更大的问题'
        },
        {
            id: 'r2',
            question: '如果想让一本书更受欢迎，为什么有时候可以故意让它"被禁"？',
            type: 'open',
            hint: '反向思维：禁书反而增加了好奇心和稀缺性'
        }
    ],
    spatial: [
        {
            id: 'sp1',
            question: '一个立方体从中间切开，切面是什么形状？',
            options: ['只能是正方形', '可以是三角形', '可以是六边形', '以上都对'],
            answer: 3,
            explanation: '立方体的切面可以是三角形、四边形、五边形甚至六边形，取决于切割角度。'
        },
        {
            id: 'sp2',
            question: '如果把一张纸对折3次，然后在中间剪一个洞，展开后会有几个洞？',
            options: ['3个', '4个', '8个', '1个'],
            answer: 1,
            explanation: '每次对折层数翻倍，但洞是连通的，对折3次后展开只有1个洞。'
        }
    ]
};

/**
 * 获取所有思维训练类型
 */
export function getThinkingTypes() {
    return THINKING_TYPES;
}

/**
 * 获取指定类型的题目
 */
export function getQuestions(typeId) {
    return THINKING_QUESTIONS[typeId] || [];
}

/**
 * 获取用户的训练记录
 */
export function getUserTrainingRecords() {
    const user = getCurrentUserData();
    return user?.thinkingRecords || {};
}

/**
 * 保存训练记录
 */
export function saveTrainingRecord(typeId, questionId, isCorrect) {
    const user = getCurrentUserData();
    if (!user) return false;

    if (!user.thinkingRecords) {
        user.thinkingRecords = {};
    }
    if (!user.thinkingRecords[typeId]) {
        user.thinkingRecords[typeId] = {
            completed: [],
            correctCount: 0,
            totalCount: 0
        };
    }

    const record = user.thinkingRecords[typeId];
    if (!record.completed.includes(questionId)) {
        record.completed.push(questionId);
        record.totalCount++;
        if (isCorrect) {
            record.correctCount++;
        }
    }

    updateCurrentUser(user);
    return true;
}

/**
 * 渲染思维训练主页
 */
export function renderThinkingPage(container) {
    const types = getThinkingTypes();
    const records = getUserTrainingRecords();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🧠 思维训练</h2>
                <div style="width: 60px;"></div>
            </div>
            
            <div class="thinking-container">
                <div class="thinking-intro">
                    <p>选择一种思维类型，开始你的大脑训练！</p>
                </div>
                
                <div class="thinking-types-grid">
                    ${types.map(type => {
                        const record = records[type.id] || { completed: [], correctCount: 0, totalCount: 0 };
                        const questions = getQuestions(type.id);
                        const completedCount = record.completed.length;
                        const totalCount = questions.length;
                        const progressPercent = Math.round((completedCount / totalCount) * 100);
                        
                        return `
                            <div class="thinking-type-card" onclick="window.App.thinking.openTraining('${type.id}')">
                                <div class="type-icon" style="background: ${type.color}20; color: ${type.color};">
                                    ${type.icon}
                                </div>
                                <div class="type-info">
                                    <div class="type-header">
                                        <h3 class="type-name">${type.name}</h3>
                                        <span class="type-difficulty" style="background: ${type.color}20; color: ${type.color};">${type.difficulty}</span>
                                    </div>
                                    <p class="type-desc">${type.description}</p>
                                    <div class="type-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progressPercent}%; background: ${type.color};"></div>
                                        </div>
                                        <span class="progress-text">${completedCount}/${totalCount} 题目</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 打开训练
 */
export function openTraining(typeId) {
    const type = THINKING_TYPES.find(t => t.id === typeId);
    const questions = getQuestions(typeId);
    const records = getUserTrainingRecords();
    const record = records[typeId] || { completed: [] };
    
    // 找到第一个未完成的题目
    const firstUncompleted = questions.find(q => !record.completed.includes(q.id));
    if (firstUncompleted) {
        showQuestion(typeId, firstUncompleted.id);
    } else if (questions.length > 0) {
        // 所有题目都完成了，从第一个开始
        showQuestion(typeId, questions[0].id);
    } else {
        showToast('该类型暂无题目');
    }
}

/**
 * 显示题目
 */
export function showQuestion(typeId, questionId) {
    const type = THINKING_TYPES.find(t => t.id === typeId);
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!type || !question) return;

    const currentIndex = questions.findIndex(q => q.id === questionId);
    const records = getUserTrainingRecords();
    const record = records[typeId] || { completed: [] };
    const isCompleted = record.completed.includes(questionId);

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    let optionsHtml = '';
    if (question.options) {
        optionsHtml = `
            <div class="question-options">
                ${question.options.map((opt, index) => `
                    <button class="option-btn" data-index="${index}" onclick="window.App.thinking.checkAnswer('${typeId}', '${questionId}', ${index})">
                        ${String.fromCharCode(65 + index)}. ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    } else {
        optionsHtml = `
            <div class="open-question-hint">
                <p>💡 ${question.hint || '这是一个开放性思考题'}</p>
                <textarea class="answer-textarea" placeholder="写下你的想法..."></textarea>
                <button class="show-answer-btn" onclick="window.App.thinking.showExplanation('${typeId}', '${questionId}')">
                    查看参考答案
                </button>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="thinking-training">
            <div class="training-header" style="background: linear-gradient(135deg, ${type.color}, ${type.color}dd);">
                <div class="training-type">
                    <span class="type-icon-small">${type.icon}</span>
                    <span>${type.name}</span>
                </div>
                <div class="question-progress">
                    第 ${currentIndex + 1} / ${questions.length} 题
                </div>
            </div>
            
            <div class="training-content">
                <div class="question-text">
                    ${question.question}
                </div>
                
                <div id="answer-area">
                    ${optionsHtml}
                </div>
                
                <div id="explanation-area" style="display: none;">
                    ${question.explanation ? `
                        <div class="explanation-box">
                            <h4>💡 解析</h4>
                            <p>${question.explanation}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="training-footer">
                <button class="nav-btn ${currentIndex === 0 ? 'disabled' : ''}" 
                        onclick="window.App.thinking.prevQuestion('${typeId}', '${questionId}')"
                        ${currentIndex === 0 ? 'disabled' : ''}>
                    ← 上一题
                </button>
                <button class="nav-btn ${currentIndex === questions.length - 1 ? 'disabled' : ''}" 
                        onclick="window.App.thinking.nextQuestion('${typeId}', '${questionId}')"
                        ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
                    下一题 →
                </button>
            </div>
        </div>
        
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')" style="margin: 16px;">
            关闭
        </button>
    `;

    modal.classList.add('show');
}

/**
 * 检查答案
 */
export function checkAnswer(typeId, questionId, selectedIndex) {
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedIndex === question.answer;
    saveTrainingRecord(typeId, questionId, isCorrect);

    // 高亮显示正确和错误选项
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.answer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // 显示解析
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea && question.explanation) {
        explanationArea.style.display = 'block';
    }

    showToast(isCorrect ? '🎉 回答正确！' : '💪 继续加油！');
}

/**
 * 显示解析
 */
export function showExplanation(typeId, questionId) {
    const questions = getQuestions(typeId);
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    saveTrainingRecord(typeId, questionId, true);

    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) {
        explanationArea.style.display = 'block';
    }
    showToast('已完成本题 ✅');
}

/**
 * 上一题
 */
export function prevQuestion(typeId, currentQuestionId) {
    const questions = getQuestions(typeId);
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
        showQuestion(typeId, questions[currentIndex - 1].id);
    }
}

/**
 * 下一题
 */
export function nextQuestion(typeId, currentQuestionId) {
    const questions = getQuestions(typeId);
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex < questions.length - 1) {
        showQuestion(typeId, questions[currentIndex + 1].id);
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.thinking = {
    openTraining,
    showQuestion,
    checkAnswer,
    showExplanation,
    prevQuestion,
    nextQuestion
};

console.log('✅ thinking 模块加载完成');

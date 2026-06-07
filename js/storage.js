// 版本: V152

const DEFAULT_USER = {
    id: 'user_default_qiuyufei',
    name: '邱宇菲',
    grade: 7, // 初一
    difficulty: 1, // 难度级别1
    points: 1142, // 初始积分
    createdAt: new Date().toISOString(),
    stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        totalMinutes: 0,
        streakDays: 0,
        lastActiveDate: null
    },
    weeklyProgress: {},
    wrongNotes: [],
    completedTopics: [],
    studyDays: {},
    todayStats: { date: new Date().toISOString().split('T')[0], questions: 0, correct: 0, minutes: 0 }
};

function loadData() {
    try {
        // 尝试从IndexedDB迁移（异步，首次可能还没完成）
        if (window.DB) {
            try { DB.checkAndMigrate(); } catch(e) {}
        }
        // 尝试迁移旧数据
        migrateData();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // 首次访问，创建默认用户
            const defaultData = {
                users: [{ ...DEFAULT_USER }],
                currentUser: DEFAULT_USER.id
            };
            window.saveData(defaultData);
            console.log('已创建默认用户:', DEFAULT_USER.name);
            return defaultData;
        }
        const data = JSON.parse(raw);
        // 验证数据格式
        if (!data || typeof data !== 'object') {
            console.log('数据格式错误，创建默认用户');
            const defaultData = {
                users: [{ ...DEFAULT_USER }],
                currentUser: DEFAULT_USER.id
            };
            window.saveData(defaultData);
            return defaultData;
        }
        if (!Array.isArray(data.users)) data.users = [];
        
        // 如果没有用户，创建默认用户
        if (data.users.length === 0) {
            data.users = [{ ...DEFAULT_USER }];
            data.currentUser = DEFAULT_USER.id;
            window.saveData(data);
            console.log('用户列表为空，已创建默认用户:', DEFAULT_USER.name);
        }
        
        if (!data.currentUser && data.users.length > 0) {
            data.currentUser = data.users[0].id;
        }
        return data;
    } catch(e) {
        console.log('数据加载错误，创建默认用户:', e.message);
        // 清除损坏的数据并创建默认用户
        try { localStorage.removeItem(STORAGE_KEY); } catch(e2) {}
        const defaultData = {
            users: [{ ...DEFAULT_USER }],
            currentUser: DEFAULT_USER.id
        };
        window.saveData(defaultData);
        return defaultData;
    }
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
    // IndexedDB双写
    if (window.DB && data && data.users) {
        try {
            DB.saveAllUsers(data.users);
            if (data.currentUser) DB.saveSetting('currentUser', data.currentUser);
        } catch(e) {
            console.warn('[Storage] IndexedDB写入失败:', e);
        }
    }
}

// 保存单个用户数据（更新到localStorage）
function saveUserData(user) {
    try {
        var data = window.loadData();
        var idx = -1;
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].id === user.id) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            data.users[idx] = user;
        } else {
            data.users.push(user);
        }
        window.saveData(data);
        // V403: 云数据库同步
        if (window.CloudSync && CloudSync.isEnabled()) {
            CloudSync.saveUserData('core', user);
        }
    } catch(e) {
        console.warn('saveUserData失败:', e);
    }
}

function clearCurrentUserData() {
    if (!confirm('确定要清除当前用户的所有数据吗？')) return;
    
    var data = window.loadData();
    var user = data.users.find(function(u) { return u.id === data.currentUser; });
    
    if (!user) {
        window.showToast('用户不存在');
        return;
    }
    
    // 重置用户数据
    user.points = 0;
    user.stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalMinutes: 0,
        streakDays: 0,
        lastActiveDate: null
    };
    user.wrongNotes = [];
    user.completedTopics = [];
    user.weeklyProgress = {};
    
    window.saveData(data);
    updateUI();
    syncTodayStats();
    closeUserMenu();
    window.showToast('已清除 ' + user.name + ' 的数据');
}

function getApiConfig() {
    try {
        const config = localStorage.getItem(API_CONFIG_KEY);
        return config ? JSON.parse(config) : { deepseek: '', peerjs: '0.peerjs.com' };
    } catch(e) {
        return { deepseek: '', peerjs: '0.peerjs.com' };
    }
}

function saveApiConfig(config) {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
}

function resetApiConfig() {
    if (!confirm('确定要恢复默认配置吗？')) return;
    
    localStorage.removeItem(API_CONFIG_KEY);
    window.showToast('API配置已重置为默认值');
    updateApiStatusDisplay();
}

function updateApiStatusDisplay() {
    const config = getApiConfig();
    const deepseekStatus = document.getElementById('api-deepseek-status');
    if (deepseekStatus) {
        deepseekStatus.textContent = '状态：' + (config.deepseek ? '已配置' : '未配置');
    }
}

function getCurrentUserData() {
    const data = window.loadData();
    if (!data.currentUser) return null;
    return data.users.find(u => u.id === data.currentUser) || null;
}

function getGradeSubjectTopics(grade, subject) {
    const gradeMap = {5:'5',6:'6',7:'7',8:'8',9:'9'};
    const key = (subject || 'math') + gradeMap[grade];
    return topics[key] || [];
}

function getMethodTraining(methodId) {
    return methodTraining[methodId] || [];
}

// getTopicsList moved to topics.js module

// V224: 支持数据文件按需加载的版本
function getWeekPlan(weekId, callback) {
    // 如果数据已加载，直接返回
    if (typeof weekPlans !== 'undefined') {
        const result = weekPlans[weekId] || null;
        if (callback) callback(result);
        return result;
    }
    
    // 如果有回调函数，异步加载后返回
    if (callback && typeof loadModuleData === 'function') {
        loadModuleData('week-plans', function() {
            const result = typeof weekPlans !== 'undefined' ? (weekPlans[weekId] || null) : null;
            callback(result);
        });
        return null;
    }
    
    // 兼容旧调用方式（同步）
    return null;
}

function confirmClearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        clearAllData();
    }
}

function clearAllData() {
    if (!confirm('⚠️ 确定要清除所有数据吗？')) return;
    localStorage.removeItem(STORAGE_KEY);
    // IndexedDB清理
    if (window.DB) {
        try { DB.clearAll(); } catch(e) {
            console.warn('[Storage] IndexedDB清理失败:', e);
        }
    }
    location.reload();
}

function syncUserData(user) {
    const data = window.loadData();
    const idx = data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) { data.users[idx] = user; window.saveData(data); }
    // IndexedDB同步
    if (window.DB) {
        try { DB.saveUser(user); } catch(e) {
            console.warn('[Storage] IndexedDB同步失败:', e);
        }
    }
    // V403: 云数据库同步
    if (window.CloudSync && CloudSync.isEnabled()) {
        CloudSync.saveUserData('core', user);
    }
}

function syncData() {
    const btn = document.getElementById('sync-btn');
    const syncTimeEl = document.getElementById('last-sync-time');
    
    if (btn) {
        btn.textContent = '同步中...';
        btn.disabled = true;
    }
    
    const user = window.getCurrentUserData();
    if (user) {
        // 更新同步时间
        const now = new Date();
        const syncTime = now.toLocaleString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // 保存同步时间到用户数据
        user.lastSyncTime = now.toISOString();
        syncUserData(user);
        
        // 更新显示
        if (syncTimeEl) {
            syncTimeEl.textContent = `上次同步：${syncTime}`;
        }
        
        setTimeout(() => {
            if (btn) {
                btn.textContent = '同步';
                btn.disabled = false;
            }
            window.showToast('✅ 数据同步成功');
            
            // 更新数据统计
            updateDataStatsDisplay();
        }, 800);
    } else {
        if (btn) {
            btn.textContent = '同步';
            btn.disabled = false;
        }
        window.showToast('请先登录');
    }
}

function syncTodayStats() {
    const user = window.getCurrentUserData();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { date: today, questions: 0, correct: 0, minutes: 0 };
    if (todayStats.date !== today) { 
        todayStats = { date: today, questions: 0, correct: 0, minutes: 0 }; 
        user.todayStats = todayStats; 
        syncUserData(user); 
    }
    // 安全地更新DOM元素
    const questionsEl = document.getElementById('today-questions');
    const correctEl = document.getElementById('today-correct');
    const minutesEl = document.getElementById('today-minutes');
    const streakEl = document.getElementById('today-streak');
    if (questionsEl) questionsEl.textContent = todayStats.questions || 0;
    if (correctEl) correctEl.textContent = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) + '%' : '0%';
    if (minutesEl) minutesEl.textContent = todayStats.minutes || 0;
    const studyDays = user.studyDays || {};
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date(); 
        d.setDate(d.getDate() - i);
        if (studyDays[d.toISOString().split('T')[0]]) streak++; 
        else if (i > 0) break;
    }
    if (streakEl) streakEl.textContent = streak;
}

// 记录练习数据 - V145修复
window.recordPractice = function(questionCount, correctCount, minutesSpent) {
    const user = window.getCurrentUserData();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    // 初始化数据结构
    if (!user.todayStats) user.todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
    if (!user.stats) user.stats = { totalQuestions: 0, correctAnswers: 0, totalMinutes: 0, streakDays: 0, lastActiveDate: null };
    if (!user.studyDays) user.studyDays = {};
    
    // 重置今日统计（如果是新的一天）
    if (user.todayStats.date !== today) {
        user.todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
    }
    
    // 更新今日统计
    user.todayStats.questions += (questionCount || 0);
    user.todayStats.correct += (correctCount || 0);
    user.todayStats.minutes += (minutesSpent || 0);
    
    // 更新总统计
    user.stats.totalQuestions += (questionCount || 0);
    user.stats.correctAnswers += (correctCount || 0);
    user.stats.totalMinutes += (minutesSpent || 0);
    user.stats.lastActiveDate = new Date().toISOString();
    
    // 更新学习天数
    user.studyDays[today] = true;
    
    // 保存并刷新UI
    saveUserData(user);
    if (typeof updateTodayStats === 'function') updateTodayStats();
    if (typeof syncTodayStats === 'function') syncTodayStats();
};

function migrateData() {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData) {
        try {
            const parsed = JSON.parse(currentData);
            if (parsed && Array.isArray(parsed.users)) {
                // 修复重复ID：如果多个用户共享同一个ID，给后续用户分配唯一ID
                var idMap = {};
                var needSave = false;
                for (var i = 0; i < parsed.users.length; i++) {
                    var uid = parsed.users[i].id;
                    if (idMap[uid]) {
                        // 重复ID，生成新ID
                        var newId = 'user_' + Date.now() + '_' + i;
                        // 如果重复ID是当前用户，更新currentUser到第一个匹配的用户
                        if (parsed.currentUser === uid && parsed.users[0].id === uid) {
                            parsed.currentUser = uid; // 保留第一个
                        }
                        parsed.users[i].id = newId;
                        needSave = true;
                        console.log('修复重复ID:', uid, '->', newId, '(用户:', parsed.users[i].name + ')');
                    } else {
                        idMap[uid] = true;
                    }
                }
                if (needSave) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                    console.log('重复ID已修复并保存');
                }
                return;
            }
        } catch(e) {}
    }
    // 尝试从旧key迁移
    for (const key of OLD_KEYS) {
        try {
            const old = localStorage.getItem(key);
            if (old) {
                const parsed = JSON.parse(old);
                if (parsed && Array.isArray(parsed.users)) {
                    localStorage.setItem(STORAGE_KEY, old);
                    console.log('数据已迁移:', key, '->', STORAGE_KEY);
                    return;
                }
            }
        } catch(e) {}
    }
}

function calculateStreakDays(user) {
    if (!user.studyDays) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (user.studyDays[dateStr] && user.studyDays[dateStr] > 0) {
            streak++;
        } else if (i > 0) {
            // 不是今天，且没有学习记录，连续中断
            break;
        }
    }
    
    return streak;
}



// ============================================================
// Audio - 音频管理
// ============================================================

// Window exports for onclick handlers
window.clearAllData = clearAllData;
window.clearCurrentUserData = clearCurrentUserData;
window.resetApiConfig = resetApiConfig;
window.syncData = syncData;
window.saveUserData = saveUserData;
window.getCurrentUserData = getCurrentUserData;
window.loadData = loadData;
window.saveData = saveData;


// ============================================================
// IndexedDB 视频文件持久化存储
// ============================================================

const VIDEO_DB_NAME = 'CognitiveTrainingVideoDB';
const VIDEO_DB_VERSION = 2; // 版本升级以支持图片存储
const VIDEO_STORE_NAME = 'videoFiles';
const IMAGE_STORE_NAME = 'imageFiles';

let videoDB = null;

// 初始化 IndexedDB
function initVideoDB() {
    return new Promise(function(resolve, reject) {
        if (videoDB) {
            resolve(videoDB);
            return;
        }
        
        if (!window.indexedDB) {
            console.warn('浏览器不支持 IndexedDB');
            reject(new Error('浏览器不支持 IndexedDB'));
            return;
        }
        
        var request = indexedDB.open(VIDEO_DB_NAME, VIDEO_DB_VERSION);
        
        request.onerror = function(e) {
            console.error('IndexedDB 打开失败:', e);
            reject(e);
        };
        
        request.onsuccess = function(e) {
            videoDB = e.target.result;
            console.log('IndexedDB 初始化成功');
            resolve(videoDB);
        };
        
        request.onupgradeneeded = function(e) {
            var db = e.target.result;
            // 创建视频文件存储仓库
            if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
                db.createObjectStore(VIDEO_STORE_NAME, { keyPath: 'videoId' });
            }
            // 创建图片文件存储仓库
            if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
                db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'imageId' });
            }
            console.log('IndexedDB 升级完成');
        };
    });
}

// 存储视频文件到 IndexedDB
function saveVideoFile(videoId, blob) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.put({
                videoId: videoId,
                blob: blob,
                savedAt: new Date().toISOString()
            });
            
            request.onsuccess = function() {
                console.log('视频文件已保存:', videoId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('保存视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取视频文件
function getVideoFile(videoId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readonly');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.get(videoId);
            
            request.onsuccess = function() {
                var result = request.result;
                if (result) {
                    console.log('从 IndexedDB 读取视频:', videoId);
                    resolve(result.blob);
                } else {
                    console.warn('未找到视频文件:', videoId);
                    resolve(null);
                }
            };
            
            request.onerror = function(e) {
                console.error('读取视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 删除视频文件
function deleteVideoFile(videoId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.delete(videoId);
            
            request.onsuccess = function() {
                console.log('视频文件已删除:', videoId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('删除视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 清除所有视频文件
function clearAllVideoFiles() {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.clear();
            
            request.onsuccess = function() {
                console.log('所有视频文件已清除');
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('清除视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// Window exports for video storage
window.initVideoDB = initVideoDB;
window.saveVideoFile = saveVideoFile;
window.getVideoFile = getVideoFile;
window.deleteVideoFile = deleteVideoFile;
window.clearAllVideoFiles = clearAllVideoFiles;

// ============================================================
// IndexedDB 图片文件持久化存储（用于错题本）
// ============================================================

// 存储图片文件到 IndexedDB
function saveImageFile(imageId, blob) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.put({
                imageId: imageId,
                blob: blob,
                savedAt: new Date().toISOString()
            });
            
            request.onsuccess = function() {
                console.log('图片文件已保存:', imageId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('保存图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取图片文件（返回 Promise<Blob>）
function getImageFile(imageId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.get(imageId);
            
            request.onsuccess = function() {
                var result = request.result;
                if (result) {
                    console.log('从 IndexedDB 读取图片:', imageId);
                    resolve(result.blob);
                } else {
                    console.warn('未找到图片文件:', imageId);
                    resolve(null);
                }
            };
            
            request.onerror = function(e) {
                console.error('读取图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取图片并转换为 base64 DataURL
function getImageFileAsDataUrl(imageId) {
    return new Promise(function(resolve, reject) {
        getImageFile(imageId).then(function(blob) {
            if (blob) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(e) {
                    reject(e);
                };
                reader.readAsDataURL(blob);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}

// 从 IndexedDB 删除图片文件
function deleteImageFile(imageId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.delete(imageId);
            
            request.onsuccess = function() {
                console.log('图片文件已删除:', imageId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('删除图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 清除所有图片文件
function clearAllImageFiles() {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.clear();
            
            request.onsuccess = function() {
                console.log('所有图片文件已清除');
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('清除图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// Window exports for image storage
window.saveImageFile = saveImageFile;
window.getImageFile = getImageFile;
window.getImageFileAsDataUrl = getImageFileAsDataUrl;
window.deleteImageFile = deleteImageFile;
window.clearAllImageFiles = clearAllImageFiles;

// 页面加载时初始化 IndexedDB
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoDB);
} else {
    initVideoDB();
}

// ============================================================
// ES6 Module Export - V225 ES6改造
// ============================================================
    loadData,
    saveData,
    saveUserData,
    getCurrentUserData,
    migrateData,
    saveImageFile,
    getImageFile,
    getImageFileAsDataUrl,
    deleteImageFile,
    clearAllImageFiles

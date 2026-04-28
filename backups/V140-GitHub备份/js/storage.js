// 版本: V140

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
    todayStats: { date: new Date().toDateString(), questions: 0, correct: 0, minutes: 0 }
};

function loadData() {
    try {
        // 尝试迁移旧数据
        migrateData();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // 首次访问，创建默认用户
            const defaultData = {
                users: [{ ...DEFAULT_USER }],
                currentUser: DEFAULT_USER.id
            };
            saveData(defaultData);
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
            saveData(defaultData);
            return defaultData;
        }
        if (!Array.isArray(data.users)) data.users = [];
        
        // 如果没有用户，创建默认用户
        if (data.users.length === 0) {
            data.users = [{ ...DEFAULT_USER }];
            data.currentUser = DEFAULT_USER.id;
            saveData(data);
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
        saveData(defaultData);
        return defaultData;
    }
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
}

function clearCurrentUserData() {
    if (!confirm('确定要清除当前用户的所有数据吗？')) return;
    
    var data = loadData();
    var user = data.users.find(function(u) { return u.id === data.currentUser; });
    
    if (!user) {
        showToast('用户不存在');
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
    
    saveData(data);
    updateUI();
    syncTodayStats();
    closeUserMenu();
    showToast('已清除 ' + user.name + ' 的数据');
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
    showToast('API配置已重置为默认值');
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
    const data = loadData();
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

function getTopicsList() {
    const key = currentTopicsSubject + currentTopicsGrade;
    return topics[key] || [];
}

function getWeekPlan(weekId) { return weekPlans[weekId] || null; }

function confirmClearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        clearAllData();
    }
}

function clearAllData() {
    if (!confirm('⚠️ 确定要清除所有数据吗？')) return;
    localStorage.removeItem(STORAGE_KEY); location.reload();
}

function syncUserData(user) {
    const data = loadData();
    const idx = data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) { data.users[idx] = user; saveData(data); }
}

function syncData() {
    const btn = document.getElementById('sync-btn');
    const syncTimeEl = document.getElementById('last-sync-time');
    
    if (btn) {
        btn.textContent = '同步中...';
        btn.disabled = true;
    }
    
    const user = getCurrentUserData();
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
            showToast('✅ 数据同步成功');
            
            // 更新数据统计
            updateDataStatsDisplay();
        }, 800);
    } else {
        if (btn) {
            btn.textContent = '同步';
            btn.disabled = false;
        }
        showToast('请先登录');
    }
}

function syncTodayStats() {
    const user = getCurrentUserData();
    if (!user) return;
    const today = new Date().toDateString();
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
    if (questionsEl) questionsEl.textContent = user.aiChatCount || 0;
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

function migrateData() {
    const currentData = localStorage.getItem(STORAGE_KEY);
    // 如果已有有效数据，跳过迁移
    if (currentData) {
        try {
            const parsed = JSON.parse(currentData);
            if (parsed && Array.isArray(parsed.users)) return;
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

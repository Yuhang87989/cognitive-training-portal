// ====== 数据存储模块 ======
// 版本: V140

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


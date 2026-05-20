/* 虚拟宠物模块 - ES6 Modules标准
 * 陪伴小孩学习成长的虚拟宠物系统
 * 通过完成训练、打卡、专注获得经验值
 */

// V264: 移除不存在的ES6依赖，改用window上的storage
const STORAGE_KEY = 'pet_data';

// 简单的store模拟，直接用localStorage
const store = {
    getState: function(key) {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    },
    setState: function(key, data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch(e) {}
    }
};

// 简单的eventBus模拟，空实现，因为其他模块可能不发射这些事件
const eventBus = {
    on: function(event, callback) {
        // 暂时不处理事件监听
        console.log('[Pet] eventBus.on:', event);
    },
    emit: function(event, data) {
        // 暂时不处理事件发射
        console.log('[Pet] eventBus.emit:', event, data);
    }
};

// 使用window上的storage
const storage = window;

// 宠物皮肤配置
const PET_SKINS = [
    { id: 'cat', name: '小橘猫', emoji: '🐱', unlockLevel: 1, desc: '初始宠物' },
    { id: 'dog', name: '小柴犬', emoji: '🐕', unlockLevel: 5, desc: '5级解锁' },
    { id: 'rabbit', name: '小白兔', emoji: '🐰', unlockLevel: 10, desc: '10级解锁' },
    { id: 'panda', name: '小熊猫', emoji: '🐼', unlockLevel: 15, desc: '15级解锁' },
    { id: 'dragon', name: '小神龙', emoji: '🐲', unlockLevel: 20, desc: '20级解锁' },
    { id: 'unicorn', name: '独角兽', emoji: '🦄', unlockLevel: 30, desc: '30级传说级' }
];

// 心情状态
const MOOD_STATES = [
    { threshold: 20, emoji: '😢', name: '难过', desc: '需要陪伴' },
    { threshold: 40, emoji: '😐', name: '一般', desc: '有点无聊' },
    { threshold: 60, emoji: '🙂', name: '开心', desc: '心情不错' },
    { threshold: 80, emoji: '😄', name: '快乐', desc: '非常开心' },
    { threshold: 100, emoji: '🥰', name: '超幸福', desc: '简直太开心啦！' }
];

// 默认数据
const DEFAULT_DATA = {
    name: '小助手',
    skin: 'cat',
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    mood: 80,
    health: 100,
    lastFeed: null,
    lastPlay: null,
    totalInteractions: 0,
    unlockedSkins: ['cat'],
    equippedItems: [],
    birthDate: new Date().toISOString(),
    achievements: []
};

// 初始化宠物模块
function initPet() {
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    store.setState('pet', data);
    
    console.log('[Pet] 虚拟宠物模块初始化完成');
    eventBus.emit('module:ready', 'pet');
    
    // 监听全局事件获得经验
    setupEventListeners();
}

// 设置事件监听
function setupEventListeners() {
    // 番茄专注完成
    eventBus.on('pomodoro:complete', () => {
        addExp(20);
        addMood(10);
        window.showToast('🍅 番茄专注完成！宠物+20经验 +10心情');
    });
    
    // 完成训练
    eventBus.on('training:complete', () => {
        addExp(30);
        addMood(15);
        window.showToast('🧠 训练完成！宠物+30经验 +15心情');
    });
    
    // 自驱力打卡
    eventBus.on('selfdrive:checkin', () => {
        addExp(15);
        addMood(5);
        window.showToast('✅ 打卡成功！宠物+15经验 +5心情');
    });
    
    // 完成目标
    eventBus.on('goal:complete', () => {
        addExp(50);
        addMood(20);
        window.showToast('🎯 目标达成！宠物+50经验 +20心情');
    });
    
    // 阅读书籍
    eventBus.on('library:read', () => {
        addExp(25);
        addMood(10);
        window.showToast('📚 阅读完成！宠物+25经验 +10心情');
    });
    
    // 完成思维导图
    eventBus.on('mindmap:complete', () => {
        addExp(40);
        addMood(15);
        window.showToast('🗺️ 思维导图完成！宠物+40经验 +15心情');
    });
}

// 获取宠物数据
function getPetData() {
    return store.getState('pet');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('pet', data);
    eventBus.emit('pet:updated', data);
}

// 增加经验值
function addExp(amount) {
    const data = getPetData();
    data.exp += amount;
    
    // 检查升级
    while (data.exp >= data.expToNextLevel) {
        data.exp -= data.expToNextLevel;
        data.level++;
        data.expToNextLevel = Math.floor(100 * Math.pow(1.2, data.level - 1));
        
        // 检查解锁新皮肤
        PET_SKINS.forEach(skin => {
            if (skin.unlockLevel === data.level && !data.unlockedSkins.includes(skin.id)) {
                data.unlockedSkins.push(skin.id);
                window.showToast(`🎉 恭喜升级到Lv.${data.level}！解锁新宠物：${skin.emoji} ${skin.name}`);
            }
        });
        
        eventBus.emit('pet:levelup', { level: data.level });
    }
    
    saveData(data);
    return data;
}

// 增加心情
function addMood(amount) {
    const data = getPetData();
    data.mood = Math.min(100, Math.max(0, data.mood + amount));
    saveData(data);
    return data;
}

// 喂食
function feedPet() {
    const data = getPetData();
    const now = new Date().toISOString();
    
    // 冷却检查
    if (data.lastFeed) {
        const lastTime = new Date(data.lastFeed);
        const cooldown = 2 * 60 * 60 * 1000; // 2小时
        if (Date.now() - lastTime.getTime() < cooldown) {
            window.showToast('🍽️ 宠物刚刚吃过啦，等会儿再喂吧~');
            return null;
        }
    }
    
    data.lastFeed = now;
    data.health = Math.min(100, data.health + 15);
    data.mood = Math.min(100, data.mood + 10);
    data.totalInteractions++;
    
    saveData(data);
    window.showToast('🍖 喂食成功！健康+15，心情+10');
    return data;
}

// 玩耍
function playWithPet() {
    const data = getPetData();
    const now = new Date().toISOString();
    
    if (data.lastPlay) {
        const lastTime = new Date(data.lastPlay);
        const cooldown = 1 * 60 * 60 * 1000; // 1小时
        if (Date.now() - lastTime.getTime() < cooldown) {
            window.showToast('🎮 宠物刚刚玩过啦，休息一下吧~');
            return null;
        }
    }
    
    data.lastPlay = now;
    data.mood = Math.min(100, data.mood + 25);
    data.totalInteractions++;
    
    saveData(data);
    window.showToast('🎾 玩耍成功！心情+25');
    return data;
}

// 抚摸
function petPet() {
    const data = getPetData();
    data.mood = Math.min(100, data.mood + 5);
    data.totalInteractions++;
    saveData(data);
    return data;
}

// 改名字
function renamePet(newName) {
    const data = getPetData();
    data.name = newName;
    saveData(data);
    window.showToast(`✨ 宠物改名为「${newName}」啦！`);
    return data;
}

// 切换皮肤
function changeSkin(skinId) {
    const data = getPetData();
    if (!data.unlockedSkins.includes(skinId)) {
        window.showToast('❌ 还没有解锁这个皮肤哦');
        return null;
    }
    
    data.skin = skinId;
    const skin = PET_SKINS.find(s => s.id === skinId);
    saveData(data);
    window.showToast(`✨ 成功换上${skin.emoji} ${skin.name}！`);
    return data;
}

// 获取当前皮肤信息
function getCurrentSkin() {
    const data = getPetData();
    return PET_SKINS.find(s => s.id === data.skin) || PET_SKINS[0];
}

// 获取所有皮肤
function getAllSkins() {
    return PET_SKINS;
}

// 获取心情状态
function getMoodState() {
    const data = getPetData();
    for (let i = MOOD_STATES.length - 1; i >= 0; i--) {
        if (data.mood >= MOOD_STATES[i].threshold) {
            return MOOD_STATES[i];
        }
    }
    return MOOD_STATES[0];
}

// 获取当前状态
function getState() {
    return store.getState('pet');
}


// V264: 将宠物模块函数挂载到window
window.petModule = {
    init: initPet,
    getData: getPetData,
    addExp: addExp,
    addMood: addMood,
    feed: feedPet,
    play: playWithPet,
    pet: petPet,
    rename: renamePet,
    changeSkin: changeSkin,
    getCurrentSkin: getCurrentSkin,
    getAllSkins: getAllSkins,
    getMoodState: getMoodState,
    getState: getState
};
console.log('[V264] 宠物模块已挂载到window.petModule');

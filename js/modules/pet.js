// ============================================================
// 虚拟宠物模块
// ============================================================

const PET_STORAGE_KEY = 'virtual_pet_data';

// 默认宠物数据
const DEFAULT_PET = {
    name: '小橘猫',
    level: 1,
    exp: 0,
    expToNext: 100,
    mood: 80, // 心情 0-100
    health: 100, // 健康 0-100
    hunger: 50, // 饥饿 0-100
    energy: 80, // 精力 0-100
    skin: '🐱',
    birthDate: Date.now(),
    totalInteractions: 0,
    lastFeed: null,
    lastPlay: null
};

// 获取宠物数据
function getPetData() {
    const saved = localStorage.getItem(PET_STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return { ...DEFAULT_PET };
}

// 保存宠物数据
function savePetData(data) {
    localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(data));
}

// 初始化宠物
function initPet() {
    // 自动恢复心情
    const data = getPetData();
    const now = Date.now();
    const hoursSinceLastPlay = data.lastPlay ? (now - data.lastPlay) / (1000 * 60 * 60) : 24;
    
    // 每小时恢复2点心情
    if (hoursSinceLastPlay > 1) {
        data.mood = Math.min(100, data.mood + Math.floor(hoursSinceLastPlay) * 2);
        savePetData(data);
    }
}

// 喂食
function feedPet() {
    const data = getPetData();
    data.hunger = Math.min(100, data.hunger + 30);
    data.mood = Math.min(100, data.mood + 10);
    data.lastFeed = Date.now();
    data.totalInteractions++;
    addExp(10);
    savePetData(data);
    return data;
}

// 玩耍
function playWithPet() {
    const data = getPetData();
    data.energy = Math.max(0, data.energy - 20);
    data.mood = Math.min(100, data.mood + 20);
    data.lastPlay = Date.now();
    data.totalInteractions++;
    addExp(15);
    savePetData(data);
    return data;
}

// 抚摸
function petPet() {
    const data = getPetData();
    data.mood = Math.min(100, data.mood + 5);
    data.totalInteractions++;
    savePetData(data);
    return data;
}

// 增加经验值
function addExp(amount) {
    const data = getPetData();
    data.exp += amount;
    
    // 升级判断
    while (data.exp >= data.expToNext) {
        data.exp -= data.expToNext;
        data.level++;
        data.expToNext = Math.floor(data.expToNext * 1.2); // 升级所需经验递增
        window.showToast(`🎉 恭喜！升到 ${data.level} 级啦！`);
    }
    
    savePetData(data);
    return data;
}

// 重命名
function renamePet(newName) {
    const data = getPetData();
    data.name = newName || '小宠物';
    savePetData(data);
    return data;
}

// 获取心情状态描述
function getMoodState() {
    const data = getPetData();
    if (data.mood >= 90) return { text: '超级开心', emoji: '🥰', color: '#e91e63' };
    if (data.mood >= 70) return { text: '很开心', emoji: '😊', color: '#4caf50' };
    if (data.mood >= 50) return { text: '还不错', emoji: '🙂', color: '#2196f3' };
    if (data.mood >= 30) return { text: '有点无聊', emoji: '😐', color: '#ff9800' };
    return { text: '不开心', emoji: '😢', color: '#f44336' };
}

// 获取等级称号
function getLevelTitle() {
    const data = getPetData();
    if (data.level >= 30) return '传说宠物';
    if (data.level >= 20) return '神兽';
    if (data.level >= 15) return '精英宠物';
    if (data.level >= 10) return '高级宠物';
    if (data.level >= 5) return '成长中';
    return '小宝贝';
}

// 挂载到window
window.petModule = {
    init: initPet,
    getData: getPetData,
    addExp: addExp,
    feed: feedPet,
    play: playWithPet,
    pet: petPet,
    rename: renamePet,
    getMoodState: getMoodState,
    getLevelTitle: getLevelTitle
};

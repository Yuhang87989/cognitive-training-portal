// ============================================================
// V287 虚拟宠物模块 - 多宠物 + 动画增强版
// ============================================================

(function() {
    const PET_STORAGE_KEY = 'virtual_pet_data';
    
    // 宠物列表 - 多种宠物可选
    const PET_SKINS = [
        { id: 'cat', name: '小橘猫', emoji: '🐱', color: '#ff9800', desc: '活泼可爱的小猫咪' },
        { id: 'dog', name: '小柴犬', emoji: '🐕', color: '#8b4513', desc: '忠诚友善的小狗狗' },
        { id: 'rabbit', name: '小白兔', emoji: '🐰', color: '#ffb6c1', desc: '软萌可爱的小兔子' },
        { id: 'panda', name: '小熊猫', emoji: '🐼', color: '#333333', desc: '国宝级的萌宠' },
        { id: 'fox', name: '小狐狸', emoji: '🦊', color: '#ff6b35', desc: '聪明伶俐的小狐狸' },
        { id: 'bear', name: '小熊熊', emoji: '🐻', color: '#8b4513', desc: '憨厚可爱的小熊' }
    ];
    
    // 默认宠物数据
    const DEFAULT_PET = {
        name: '小橘猫',
        level: 1,
        exp: 0,
        expToNext: 100,
        mood: 80,
        health: 100,
        hunger: 50,
        energy: 80,
        skin: '🐱',
        skinId: 'cat',
        unlockedSkins: ['cat'],
        birthDate: Date.now(),
        totalInteractions: 0,
        lastFeed: null,
        lastPlay: null,
        lastPet: null,
        coins: 0,
        animationState: 'idle'
    };
    
    // 当前动画帧
    let currentAnimationFrame = 0;
    let animationInterval = null;
    
    // 获取宠物数据
    function getPetData() {
        try {
            const saved = localStorage.getItem(PET_STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (!data.unlockedSkins) data.unlockedSkins = ['cat'];
                if (!data.skinId) data.skinId = 'cat';
                if (!data.coins) data.coins = 0;
                return data;
            }
        } catch(e) { console.error('读取宠物数据失败:', e); }
        return { ...DEFAULT_PET };
    }
    
    // 保存宠物数据
    function savePetData(data) {
        localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(data));
        if (window.DataSync) window.DataSync.set('pet', data);
    }
    
    // 切换宠物皮肤
    function changePetSkin(skinId) {
        const data = getPetData();
        const skin = PET_SKINS.find(s => s.id === skinId);
        if (skin && data.unlockedSkins.includes(skinId)) {
            data.skin = skin.emoji;
            data.skinId = skinId;
            data.name = skin.name;
            savePetData(data);
            return true;
        }
        return false;
    }
    
    // 解锁新宠物
    function unlockPet(skinId) {
        const data = getPetData();
        const skin = PET_SKINS.find(s => s.id === skinId);
        if (skin && !data.unlockedSkins.includes(skinId)) {
            const unlockLevel = PET_SKINS.findIndex(s => s.id === skinId) + 2;
            if (data.level >= unlockLevel) {
                data.unlockedSkins.push(skinId);
                savePetData(data);
                window.showToast(`🎉 解锁了 ${skin.name}！`);
                return true;
            } else {
                window.showToast(`需要达到 Lv.${unlockLevel} 才能解锁`);
                return false;
            }
        }
        return false;
    }
    
    // 喂食
    function feedPet() {
        const data = getPetData();
        data.hunger = Math.min(100, data.hunger + 30);
        data.mood = Math.min(100, data.mood + 10);
        data.health = Math.min(100, data.health + 5);
        data.lastFeed = Date.now();
        data.totalInteractions++;
        data.coins += 2;
        addExp(10, data);
        savePetData(data);
        return data;
    }
    
    // 玩耍
    function playWithPet() {
        const data = getPetData();
        if (data.energy < 20) {
            window.showToast('😴 宠物太累了，让它休息一下吧');
            return data;
        }
        data.energy = Math.max(0, data.energy - 20);
        data.mood = Math.min(100, data.mood + 20);
        data.lastPlay = Date.now();
        data.totalInteractions++;
        data.coins += 5;
        addExp(15, data);
        savePetData(data);
        return data;
    }
    
    // 抚摸
    function petPet() {
        const data = getPetData();
        data.mood = Math.min(100, data.mood + 5);
        data.lastPet = Date.now();
        data.totalInteractions++;
        data.coins += 1;
        addExp(5, data);
        savePetData(data);
        return data;
    }
    
    // 睡觉/休息
    function sleepPet() {
        const data = getPetData();
        data.energy = Math.min(100, data.energy + 40);
        data.health = Math.min(100, data.health + 10);
        data.mood = Math.min(100, data.mood + 5);
        savePetData(data);
        return data;
    }
    
    // 增加经验值
    function addExp(amount, existingData = null) {
        const data = existingData || getPetData();
        data.exp += amount;
        while (data.exp >= data.expToNext) {
            data.exp -= data.expToNext;
            data.level++;
            data.expToNext = Math.floor(data.expToNext * 1.2);
            const nextLockedPet = PET_SKINS.find(s => !data.unlockedSkins.includes(s.id));
            if (nextLockedPet && data.level >= PET_SKINS.findIndex(s => s.id === nextLockedPet.id) + 2) {
                data.unlockedSkins.push(nextLockedPet.id);
                window.showToast(`🎉 升级到 Lv.${data.level}！解锁了 ${nextLockedPet.name}！`);
            } else {
                window.showToast(`🎉 恭喜！升到 Lv.${data.level} 啦！`);
            }
        }
        if (!existingData) savePetData(data);
        if (window.DataSync && window.DataSync.user) window.DataSync.user.addExp(Math.floor(amount / 2));
        return data;
    }
    
    // 获取宠物表情
    function getPetExpression(data) {
        if (data.mood < 20) return '😿';
        if (data.hunger < 20) return '😋';
        if (data.energy < 20) return '😴';
        if (data.mood > 80) return '😸';
        return data.skin;
    }
    
    // 获取状态颜色
    function getStatusColor(value) {
        if (value > 70) return '#4caf50';
        if (value > 40) return '#ff9800';
        return '#f44336';
    }
    
    // 宠物动画CSS
    const PET_ANIMATION_CSS = `
        .pet-container { position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px; }
        .pet-display { font-size: 80px; cursor: pointer; transition: transform 0.2s; user-select: none; }
        .pet-display:hover { transform: scale(1.1); }
        .pet-idle { animation: petBounce 2s ease-in-out infinite; }
        @keyframes petBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .pet-happy { animation: petJump 0.5s ease-in-out; }
        @keyframes petJump { 0% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-20px) rotate(-10deg); } 50% { transform: translateY(-30px) rotate(0deg); } 75% { transform: translateY(-20px) rotate(10deg); } 100% { transform: translateY(0) rotate(0deg); } }
        .pet-eating { animation: petEat 0.3s ease-in-out 3; }
        @keyframes petEat { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } }
        .pet-sleeping { animation: petSleep 2s ease-in-out infinite; }
        @keyframes petSleep { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
        .speech-bubble { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); animation: bubbleFade 2s ease-in-out forwards; white-space: nowrap; z-index: 10; }
        .speech-bubble::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid white; }
        @keyframes bubbleFade { 0% { opacity: 0; transform: translateX(-50%) translateY(10px); } 20% { opacity: 1; transform: translateX(-50%) translateY(0); } 80% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); } }
        .status-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
        .status-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .pet-action-btn { flex: 1; padding: 12px 8px; border: none; border-radius: 12px; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .pet-action-btn:hover { transform: translateY(-2px); }
        .pet-action-btn:active { transform: translateY(0); }
        .pet-action-icon { font-size: 24px; }
        .pet-card { padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: center; border: 2px solid transparent; }
        .pet-card:hover { background: #f5f5f5; }
        .pet-card.selected { border-color: #667eea; background: #f0f4ff; }
        .pet-card.locked { opacity: 0.5; filter: grayscale(100%); }
        .pet-card-emoji { font-size: 40px; margin-bottom: 8px; }
    `;
    
    // 宠物说话内容
    const PET_SPEECHES = {
        hungry: ['好饿呀~', '想吃东西！', '咕咕咕~', '有吃的吗？'],
        happy: ['好开心！', '嘻嘻~', '主人真好！', '最喜欢你了！'],
        sleepy: ['好困呀...', '想睡觉了', '眼皮好重', '晚安~'],
        bored: ['好无聊~', '陪我玩吧！', '想出去玩', '发呆中...'],
        default: ['喵~', '你好呀！', '今天也要加油哦！', '摸摸我~']
    };
    
    // 让宠物说话
    function petSpeak(type, container) {
        const speeches = PET_SPEECHES[type] || PET_SPEECHES.default;
        const speech = speeches[Math.floor(Math.random() * speeches.length)];
        const oldBubble = container.querySelector('.speech-bubble');
        if (oldBubble) oldBubble.remove();
        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.textContent = speech;
        container.insertBefore(bubble, container.firstChild);
        setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 2000);
    }
    
    // 播放动画
    function playAnimation(animationType) {
        const petDisplay = document.getElementById('pet-display-anim');
        if (!petDisplay) return;
        petDisplay.className = petDisplay.className.replace(/pet-\w+/g, '');
        setTimeout(() => {
            petDisplay.classList.add(`pet-${animationType}`);
            if (animationType !== 'idle' && animationType !== 'sleeping') {
                setTimeout(() => {
                    petDisplay.className = petDisplay.className.replace(/pet-\w+/g, 'pet-idle');
                }, animationType === 'happy' ? 500 : 900);
            }
        }, 10);
    }
    
    // 渲染虚拟宠物页面
    function renderPet(container) {
        const pet = getPetData();
        const expression = getPetExpression(pet);
        container.innerHTML = `
            <style>${PET_ANIMATION_CSS}</style>
            <div style="padding:16px;min-height:100vh;background:linear-gradient(135deg,#fff3e0,#ffe0b2);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <button onclick="history.back()" style="padding:8px 14px;background:white;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);">← 返回</button>
                    <h2 style="margin:0;font-size:18px;color:#333;">🐾 我的宠物</h2>
                    <button onclick="window.openPetSelector()" style="padding:8px 14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🎨 换宠物</button>
                </div>
                
                <div style="background:white;border-radius:20px;padding:20px;margin-bottom:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                    <div style="text-align:center;margin-bottom:16px;">
                        <div style="font-size:20px;font-weight:bold;color:#333;margin-bottom:4px;">${pet.name}</div>
                        <div style="font-size:14px;color:#999;">Lv.${pet.level} | 💰 ${pet.coins} 金币</div>
                    </div>
                    <div class="pet-container" id="pet-container" onclick="window.petOnClick()">
                        <div id="pet-display-anim" class="pet-display pet-idle">${expression}</div>
                    </div>
                    <div style="margin-top:16px;">
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:#999;margin-bottom:4px;">
                            <span>经验值</span><span>${pet.exp} / ${pet.expToNext}</span>
                        </div>
                        <div class="status-bar"><div class="status-bar-fill" style="width:${pet.exp / pet.expToNext * 100}%;background:linear-gradient(90deg,#667eea,#764ba2);"></div></div>
                    </div>
                </div>
                
                <div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                    <div style="font-weight:bold;font-size:15px;margin-bottom:16px;color:#333;">📊 宠物状态</div>
                    <div style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                            <span>😊 心情</span><span style="color:${getStatusColor(pet.mood)};">${pet.mood}%</span>
                        </div>
                        <div class="status-bar"><div class="status-bar-fill" style="width:${pet.mood}%;background:${getStatusColor(pet.mood)};"></div></div>
                    </div>
                    <div style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                            <span>🍖 饱食度</span><span style="color:${getStatusColor(pet.hunger)};">${pet.hunger}%</span>
                        </div>
                        <div class="status-bar"><div class="status-bar-fill" style="width:${pet.hunger}%;background:${getStatusColor(pet.hunger)};"></div></div>
                    </div>
                    <div style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                            <span>⚡ 精力</span><span style="color:${getStatusColor(pet.energy)};">${pet.energy}%</span>
                        </div>
                        <div class="status-bar"><div class="status-bar-fill" style="width:${pet.energy}%;background:${getStatusColor(pet.energy)};"></div></div>
                    </div>
                    <div>
                        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                            <span>❤️ 健康</span><span style="color:${getStatusColor(pet.health)};">${pet.health}%</span>
                        </div>
                        <div class="status-bar"><div class="status-bar-fill" style="width:${pet.health}%;background:${getStatusColor(pet.health)};"></div></div>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                    <button class="pet-action-btn" style="background:#fff3e0;color:#e65100;" onclick="window.feedPetAnim()">
                        <span class="pet-action-icon">🍖</span><span>喂食</span>
                    </button>
                    <button class="pet-action-btn" style="background:#e3f2fd;color:#1565c0;" onclick="window.playWithPetAnim()">
                        <span class="pet-action-icon">🎾</span><span>玩耍</span>
                    </button>
                    <button class="pet-action-btn" style="background:#fce4ec;color:#c2185b;" onclick="window.petPetAnim()">
                        <span class="pet-action-icon">✋</span><span>抚摸</span>
                    </button>
                    <button class="pet-action-btn" style="background:#e8f5e9;color:#2e7d32;" onclick="window.sleepPetAnim()">
                        <span class="pet-action-icon">💤</span><span>休息</span>
                    </button>
                </div>
                
                <div style="margin-top:16px;background:white;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                    <div style="font-weight:bold;font-size:15px;margin-bottom:12px;color:#333;">📈 成长统计</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                        <div><div style="font-size:24px;font-weight:bold;color:#667eea;">${pet.totalInteractions}</div><div style="font-size:12px;color:#999;">互动次数</div></div>
                        <div><div style="font-size:24px;font-weight:bold;color:#4caf50;">${Math.floor((Date.now() - pet.birthDate) / (1000 * 60 * 60 * 24))}</div><div style="font-size:12px;color:#999;">陪伴天数</div></div>
                        <div><div style="font-size:24px;font-weight:bold;color:#ff9800;">${pet.unlockedSkins.length}/${PET_SKINS.length}</div><div style="font-size:12px;color:#999;">已解锁宠物</div></div>
                    </div>
                </div>
            </div>
        `;
        startRandomSpeech();
    }
    
    function startRandomSpeech() {
        if (window._petInterval) clearInterval(window._petInterval);
        window._petInterval = setInterval(() => {
            const container = document.getElementById('pet-container');
            const pet = getPetData();
            if (container && Math.random() < 0.3) {
                let speechType = 'default';
                if (pet.hunger < 30) speechType = 'hungry';
                else if (pet.energy < 30) speechType = 'sleepy';
                else if (pet.mood > 70) speechType = 'happy';
                else if (pet.mood < 30) speechType = 'bored';
                petSpeak(speechType, container);
            }
        }, 8000);
    }
    
    function petOnClick() {
        const container = document.getElementById('pet-container');
        petPet();
        playAnimation('happy');
        petSpeak('happy', container);
        setTimeout(() => {
            const petDisplay = document.getElementById('pet-display-anim');
            if (petDisplay) petDisplay.textContent = getPetExpression(getPetData());
        }, 500);
    }
    
    function feedPetAnim() {
        const container = document.getElementById('pet-container');
        feedPet();
        playAnimation('eating');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 900);
    }
    
    function playWithPetAnim() {
        const container = document.getElementById('pet-container');
        playWithPet();
        playAnimation('happy');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 500);
    }
    
    function petPetAnim() {
        const container = document.getElementById('pet-container');
        petPet();
        playAnimation('happy');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 500);
    }
    
    function sleepPetAnim() {
        const container = document.getElementById('pet-container');
        sleepPet();
        playAnimation('sleeping');
        petSpeak('sleepy', container);
        setTimeout(() => {
            refreshPetDisplay();
            setTimeout(() => {
                const petDisplay = document.getElementById('pet-display-anim');
                if (petDisplay) petDisplay.classList.replace('pet-sleeping', 'pet-idle');
            }, 3000);
        }, 2000);
    }
    
    function refreshPetDisplay() {
        const fullscreenContent = document.getElementById('fullscreen-content');
        if (fullscreenContent) renderPet(fullscreenContent);
    }
    
    function openPetSelector() {
        const pet = getPetData();
        const selectorHTML = `
            <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;">
                <div style="background:white;border-radius:20px;padding:24px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                        <h3 style="margin:0;font-size:18px;color:#333;">🎨 选择宠物</h3>
                        <button onclick="this.closest('.modal-backdrop').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">×</button>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                        ${PET_SKINS.map(skin => {
                            const unlocked = pet.unlockedSkins.includes(skin.id);
                            const selected = pet.skinId === skin.id;
                            const unlockLevel = PET_SKINS.findIndex(s => s.id === skin.id) + 2;
                            return `
                                <div class="pet-card ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}" onclick="${unlocked ? `window.selectPet('${skin.id}')` : `window.tryUnlockPet('${skin.id}')`}">
                                    <div class="pet-card-emoji">${skin.emoji}</div>
                                    <div style="font-size:13px;font-weight:500;">${skin.name}</div>
                                    ${!unlocked ? `<div style="font-size:10px;color:#999;">Lv.${unlockLevel}解锁</div>` : ''}
                                    ${selected ? '<div style="font-size:10px;color:#667eea;">当前使用</div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div style="margin-top:20px;padding:12px;background:#f5f5f5;border-radius:12px;font-size:12px;color:#666;">
                        💡 提示：提升等级可以解锁更多可爱的宠物哦！
                    </div>
                </div>
            </div>
        `;
        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-backdrop';
        modalWrapper.innerHTML = selectorHTML;
        document.body.appendChild(modalWrapper);
    }
    
    function selectPet(skinId) {
        changePetSkin(skinId);
        document.querySelector('.modal-backdrop').remove();
        refreshPetDisplay();
    }
    
    function tryUnlockPet(skinId) {
        unlockPet(skinId);
        document.querySelector('.modal-backdrop').remove();
        refreshPetDisplay();
    }
    
    window.renderPet = renderPet;
    window.feedPetAnim = feedPetAnim;
    window.playWithPetAnim = playWithPetAnim;
    window.petPetAnim = petPetAnim;
    window.sleepPetAnim = sleepPetAnim;
    window.petOnClick = petOnClick;
    window.openPetSelector = openPetSelector;
    window.selectPet = selectPet;
    window.tryUnlockPet = tryUnlockPet;
    console.log('[V287] 虚拟宠物模块加载完成 - 多宠物+动画版');
})();

// ============================================================
// V357 虚拟宠物模块 - 动漫风格 + 语音回应版
// ============================================================

(function() {
    const PET_STORAGE_KEY = 'virtual_pet_data';
    
    // 动漫宠物配置 - 每种宠物有不同的颜色和特征
    const PET_SKINS = [
        { id: 'cat', name: '小橘猫', emoji: '🐱', color: '#ff9800', desc: '活泼可爱的小猫咪',
          img: { idle: 'imgs/pets/pet-cat.jpg', happy: 'imgs/pets/pet-cat.jpg', eating: 'imgs/pets/pet-cat-eat.jpg', sleeping: 'imgs/pets/pet-cat-sleep.jpg', sad: 'imgs/pets/pet-cat-sad.jpg' }},
        { id: 'dog', name: '小柴犬', emoji: '🐕', color: '#8d6e63', desc: '忠诚友善的小狗狗',
          img: { idle: 'imgs/pets/pet-dog.jpg', happy: 'imgs/pets/pet-dog.jpg', eating: 'imgs/pets/pet-dog.jpg', sleeping: 'imgs/pets/pet-dog.jpg', sad: 'imgs/pets/pet-dog.jpg' }},
        { id: 'rabbit', name: '小白兔', emoji: '🐰', color: '#f8bbd0', desc: '软萌可爱的小兔子',
          img: { idle: 'imgs/pets/pet-rabbit.jpg', happy: 'imgs/pets/pet-rabbit.jpg', eating: 'imgs/pets/pet-rabbit.jpg', sleeping: 'imgs/pets/pet-rabbit.jpg', sad: 'imgs/pets/pet-rabbit.jpg' }},
        { id: 'panda', name: '小熊猫', emoji: '🐼', color: '#fafafa', desc: '国宝级的萌宠',
          img: { idle: 'imgs/pets/pet-panda.jpg', happy: 'imgs/pets/pet-panda.jpg', eating: 'imgs/pets/pet-panda.jpg', sleeping: 'imgs/pets/pet-panda.jpg', sad: 'imgs/pets/pet-panda.jpg' }},
        { id: 'fox', name: '小狐狸', emoji: '🦊', color: '#ff6b35', desc: '聪明伶俐的小狐狸',
          img: { idle: 'imgs/pets/pet-fox.jpg', happy: 'imgs/pets/pet-fox.jpg', eating: 'imgs/pets/pet-fox.jpg', sleeping: 'imgs/pets/pet-fox.jpg', sad: 'imgs/pets/pet-fox.jpg' }},
        { id: 'bear', name: '小熊熊', emoji: '🐻', color: '#a1887f', desc: '憨厚可爱的小熊',
          img: { idle: 'imgs/pets/pet-bear.jpg', happy: 'imgs/pets/pet-bear.jpg', eating: 'imgs/pets/pet-bear.jpg', sleeping: 'imgs/pets/pet-bear.jpg', sad: 'imgs/pets/pet-bear.jpg' }}
    ];
    
    const DEFAULT_PET = {
        name: '小橘猫', level: 1, exp: 0, expToNext: 100,
        mood: 80, health: 100, hunger: 50, energy: 80,
        skin: '🐱', skinId: 'cat', unlockedSkins: ['cat'],
        birthDate: Date.now(), totalInteractions: 0,
        lastFeed: null, lastPlay: null, lastPet: null,
        coins: 0, animationState: 'idle', voiceEnabled: true
    };
    
    let currentAnimationFrame = 0;
    
    function getPetData() {
        try {
            const saved = localStorage.getItem(PET_STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (!data.unlockedSkins) data.unlockedSkins = ['cat'];
                if (!data.skinId) data.skinId = 'cat';
                if (!data.coins) data.coins = 0;
                if (data.voiceEnabled === undefined) data.voiceEnabled = true;
                return data;
            }
        } catch(e) {}
        return { ...DEFAULT_PET };
    }
    
    function savePetData(data) {
        localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(data));
        if (window.DataSync) window.DataSync.set('pet', data);
    }
    
    function changePetSkin(skinId) {
        const data = getPetData();
        const skin = PET_SKINS.find(s => s.id === skinId);
        if (skin && data.unlockedSkins.includes(skinId)) {
            data.skin = skin.emoji; data.skinId = skinId; data.name = skin.name;
            savePetData(data); return true;
        }
        return false;
    }
    
    function unlockPet(skinId) {
        const data = getPetData();
        const skin = PET_SKINS.find(s => s.id === skinId);
        if (skin && !data.unlockedSkins.includes(skinId)) {
            const unlockLevel = PET_SKINS.findIndex(s => s.id === skinId) + 2;
            if (data.level >= unlockLevel) {
                data.unlockedSkins.push(skinId); savePetData(data);
                window.showToast('🎉 解锁了 ' + skin.name + '！');
                petVoiceSay('太棒了！解锁了' + skin.name + '！');
                return true;
            } else {
                window.showToast('需要达到 Lv.' + unlockLevel + ' 才能解锁');
                return false;
            }
        }
        return false;
    }
    
    function feedPet() {
        const data = getPetData();
        data.hunger = Math.min(100, data.hunger + 30);
        data.mood = Math.min(100, data.mood + 10);
        data.health = Math.min(100, data.health + 5);
        data.lastFeed = Date.now(); data.totalInteractions++; data.coins += 2;
        addExp(10, data); savePetData(data); return data;
    }
    
    function playWithPet() {
        const data = getPetData();
        if (data.energy < 20) { window.showToast('😴 宠物太累了，让它休息一下吧'); petVoiceSay('好累呀，让我休息一下'); return data; }
        data.energy = Math.max(0, data.energy - 20);
        data.mood = Math.min(100, data.mood + 20);
        data.lastPlay = Date.now(); data.totalInteractions++; data.coins += 5;
        addExp(15, data); savePetData(data); return data;
    }
    
    function petPet() {
        const data = getPetData();
        data.mood = Math.min(100, data.mood + 5);
        data.lastPet = Date.now(); data.totalInteractions++; data.coins += 1;
        addExp(5, data); savePetData(data); return data;
    }
    
    function sleepPet() {
        const data = getPetData();
        data.energy = Math.min(100, data.energy + 40);
        data.health = Math.min(100, data.health + 10);
        data.mood = Math.min(100, data.mood + 5);
        savePetData(data); return data;
    }
    
    function addExp(amount, existingData) {
        const data = existingData || getPetData();
        data.exp += amount;
        while (data.exp >= data.expToNext) {
            data.exp -= data.expToNext; data.level++;
            data.expToNext = Math.floor(data.expToNext * 1.2);
            const nextLockedPet = PET_SKINS.find(s => !data.unlockedSkins.includes(s.id));
            if (nextLockedPet && data.level >= PET_SKINS.findIndex(s => s.id === nextLockedPet.id) + 2) {
                data.unlockedSkins.push(nextLockedPet.id);
                window.showToast('🎉 升级到 Lv.' + data.level + '！解锁了 ' + nextLockedPet.name + '！');
                petVoiceSay('升级啦！解锁了' + nextLockedPet.name);
            } else {
                window.showToast('🎉 恭喜！升到 Lv.' + data.level + ' 啦！');
                petVoiceSay('升级啦！等级' + data.level);
            }
        }
        if (!existingData) savePetData(data);
        if (window.DataSync && window.DataSync.user) window.DataSync.user.addExp(Math.floor(amount / 2));
        return data;
    }
    
    // 语音合成
    function petVoiceSay(text) {
        const data = getPetData();
        if (!data.voiceEnabled) return;
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = 'zh-CN';
                utter.rate = 1.3;
                utter.pitch = 1.8; // 高音调，更可爱
                utter.volume = 0.8;
                // 尝试选中文女声
                const voices = window.speechSynthesis.getVoices();
                const zhVoice = voices.find(v => v.lang.startsWith('zh') && v.name.includes('Female')) ||
                                voices.find(v => v.lang.startsWith('zh')) || voices[0];
                if (zhVoice) utter.voice = zhVoice;
                window.speechSynthesis.speak(utter);
            }
        } catch(e) {}
    }
    
    // 获取宠物图片URL
    function getPetImageUrl(skinId, expression) {
        const skin = PET_SKINS.find(s => s.id === skinId) || PET_SKINS[0];
        if (skin.img && skin.img[expression]) return skin.img[expression];
        if (skin.img && skin.img.idle) return skin.img.idle;
        return '';
    }
    
    // 生成宠物图片HTML
    function renderAnimePet(skinId, expression) {
        const url = getPetImageUrl(skinId, expression);
        if (url) {
            return '<img src="' + url + '" style="width:140px;height:140px;object-fit:contain;" alt="pet" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<span style=\'font-size:80px\'>' + (PET_SKINS.find(s => s.id === skinId) || PET_SKINS[0]).emoji + '</span>\'">';
        }
        // Fallback to emoji
        const skin = PET_SKINS.find(s => s.id === skinId) || PET_SKINS[0];
        return '<span style="font-size:80px;">' + skin.emoji + '</span>';
    }
    function getPetExpression(data) {
        if (data.mood < 20) return 'sad';
        if (data.hunger < 20) return 'eating';
        if (data.energy < 20) return 'sleeping';
        if (data.mood > 80) return 'happy';
        return 'idle';
    }
    
    function getStatusColor(value) {
        if (value > 70) return '#4caf50';
        if (value > 40) return '#ff9800';
        return '#f44336';
    }
    
    // 动漫宠物CSS
    const PET_ANIMATION_CSS = `
        .pet-container { position: relative; display: flex; flex-direction: column; align-items: center; padding: 10px; }
        .pet-display-anime { cursor: pointer; transition: transform 0.2s; user-select: none; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15)); }
        .pet-display-anime:hover { transform: scale(1.08); }
        .pet-idle { animation: animeBounce 2s ease-in-out infinite; }
        @keyframes animeBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .pet-happy { animation: animeJump 0.6s ease-in-out; }
        @keyframes animeJump { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(-25px) scale(1.1); } 50% { transform: translateY(-30px) scale(1.05) rotate(-5deg); } 70% { transform: translateY(-15px) scale(1.1) rotate(5deg); } 100% { transform: translateY(0) scale(1); } }
        .pet-eating { animation: animeEat 0.3s ease-in-out 3; }
        @keyframes animeEat { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
        .pet-sleeping { animation: animeSleep 2.5s ease-in-out infinite; }
        @keyframes animeSleep { 0%, 100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.05); opacity: 1; } }
        .pet-sad { animation: animeSad 1.5s ease-in-out infinite; }
        @keyframes animeSad { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
        .speech-bubble-anime { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: white; padding: 10px 18px; border-radius: 20px; font-size: 15px; font-weight: 600; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.12); animation: bubbleAnime 2.5s ease-in-out forwards; white-space: nowrap; z-index: 10; border: 2px solid #667eea; }
        .speech-bubble-anime::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white; }
        .speech-bubble-anime::before { content: ''; position: absolute; bottom: -13px; left: 50%; transform: translateX(-50%); border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 12px solid #667eea; }
        @keyframes bubbleAnime { 0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); } 15% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.05); } 25% { transform: translateX(-50%) translateY(0) scale(1); } 80% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 100% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.9); } }
        .status-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
        .status-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .pet-action-btn { flex: 1; padding: 12px 8px; border: none; border-radius: 12px; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .pet-action-btn:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .pet-action-btn:active { transform: translateY(0); }
        .pet-action-icon { font-size: 24px; }
        .pet-card { padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: center; border: 2px solid transparent; }
        .pet-card:hover { background: #f5f5f5; }
        .pet-card.selected { border-color: #667eea; background: #f0f4ff; }
        .pet-card.locked { opacity: 0.5; filter: grayscale(100%); }
    `;
    
    // 宠物说话内容（更动漫风格）
    const PET_SPEECHES = {
        hungry: ['肚子好饿呀~', '给我吃的嘛！', '咕噜咕噜~', '想吃好吃的！'],
        happy: ['好开心呀！', '嘻嘻嘻~', '主人最好了！', '最喜欢你了！', '耶耶耶！'],
        sleepy: ['好困呀...', '想睡觉了~', '眼皮好重...', '晚安~zzZ'],
        bored: ['好无聊呀~', '陪我玩嘛！', '想出去~', '一起玩吧！'],
        default: ['你好呀！', '今天也要加油哦！', '摸摸我嘛~', '嗯嗯~', '我在这里哦！']
    };
    
    function petSpeak(type, container) {
        const speeches = PET_SPEECHES[type] || PET_SPEECHES.default;
        const speech = speeches[Math.floor(Math.random() * speeches.length)];
        const oldBubble = container.querySelector('.speech-bubble-anime');
        if (oldBubble) oldBubble.remove();
        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble-anime';
        bubble.textContent = speech;
        container.insertBefore(bubble, container.firstChild);
        // 语音回应
        petVoiceSay(speech.replace(/~|…|！/g, ''));
        setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 2500);
    }
    
    function playAnimation(animationType) {
        const petDisplay = document.getElementById('pet-display-anim');
        if (!petDisplay) return;
        petDisplay.className = petDisplay.className.replace(/pet-\w+/g, '');
        setTimeout(() => {
            petDisplay.classList.add('pet-' + animationType);
            if (animationType !== 'idle' && animationType !== 'sleeping') {
                setTimeout(() => {
                    petDisplay.className = petDisplay.className.replace(/pet-\w+/g, 'pet-idle');
                    // 恢复idle表情
                    updatePetExpression('idle');
                }, animationType === 'happy' ? 600 : 900);
            }
        }, 10);
    }
    
    function updatePetExpression(expression) {
        const data = getPetData();
        const petDisplay = document.getElementById('pet-display-anim');
        if (!petDisplay) return;
        const expr = expression || getPetExpression(data);
        petDisplay.innerHTML = renderAnimePet(data.skinId, expr);
    }
    
    function renderPet(container) {
        const pet = getPetData();
        const expression = getPetExpression(pet);
        container.innerHTML = '<style>' + PET_ANIMATION_CSS + '</style>' +
        '<div style="padding:16px;min-height:100vh;background:linear-gradient(135deg,#f3e5f5,#e1bee7,#bbdefb);">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
                '<button onclick="history.back()" style="padding:8px 14px;background:white;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);">← 返回</button>' +
                '<h2 style="margin:0;font-size:18px;color:#333;">🐾 我的宠物</h2>' +
                '<div style="display:flex;gap:8px;">' +
                    '<button onclick="window.togglePetVoice()" style="padding:8px 10px;background:' + (pet.voiceEnabled ? '#667eea' : '#ccc') + ';color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🔊</button>' +
                    '<button onclick="window.openPetSelector()" style="padding:8px 14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🎨 换宠物</button>' +
                '</div>' +
            '</div>' +
            '<div style="background:white;border-radius:24px;padding:24px;margin-bottom:16px;box-shadow:0 6px 25px rgba(0,0,0,0.1);">' +
                '<div style="text-align:center;margin-bottom:12px;">' +
                    '<div style="font-size:22px;font-weight:bold;color:#333;margin-bottom:4px;">' + pet.name + '</div>' +
                    '<div style="font-size:14px;color:#999;">Lv.' + pet.level + ' | 💰 ' + pet.coins + ' 金币</div>' +
                '</div>' +
                '<div class="pet-container" id="pet-container" onclick="window.petOnClick()">' +
                    '<div id="pet-display-anim" class="pet-display-anime pet-idle">' + renderAnimePet(pet.skinId, expression) + '</div>' +
                '</div>' +
                '<div style="margin-top:12px;">' +
                    '<div style="display:flex;justify-content:space-between;font-size:12px;color:#999;margin-bottom:4px;"><span>经验值</span><span>' + pet.exp + ' / ' + pet.expToNext + '</span></div>' +
                    '<div class="status-bar"><div class="status-bar-fill" style="width:' + (pet.exp / pet.expToNext * 100) + '%;background:linear-gradient(90deg,#667eea,#764ba2);"></div></div>' +
                '</div>' +
            '</div>' +
            '<div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">' +
                '<div style="font-weight:bold;font-size:15px;margin-bottom:16px;color:#333;">📊 宠物状态</div>' +
                renderStatusBar('😊 心情', pet.mood) +
                renderStatusBar('🍖 饱食度', pet.hunger) +
                renderStatusBar('⚡ 精力', pet.energy) +
                renderStatusBar('❤️ 健康', pet.health) +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">' +
                '<button class="pet-action-btn" style="background:#fff3e0;color:#e65100;" onclick="window.feedPetAnim()"><span class="pet-action-icon">🍖</span><span>喂食</span></button>' +
                '<button class="pet-action-btn" style="background:#e3f2fd;color:#1565c0;" onclick="window.playWithPetAnim()"><span class="pet-action-icon">🎾</span><span>玩耍</span></button>' +
                '<button class="pet-action-btn" style="background:#fce4ec;color:#c2185b;" onclick="window.petPetAnim()"><span class="pet-action-icon">✋</span><span>抚摸</span></button>' +
                '<button class="pet-action-btn" style="background:#e8f5e9;color:#2e7d32;" onclick="window.sleepPetAnim()"><span class="pet-action-icon">💤</span><span>休息</span></button>' +
            '</div>' +
            '<div style="margin-top:16px;background:white;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">' +
                '<div style="font-weight:bold;font-size:15px;margin-bottom:12px;color:#333;">📈 成长统计</div>' +
                '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">' +
                    '<div><div style="font-size:24px;font-weight:bold;color:#667eea;">' + pet.totalInteractions + '</div><div style="font-size:12px;color:#999;">互动次数</div></div>' +
                    '<div><div style="font-size:24px;font-weight:bold;color:#4caf50;">' + Math.floor((Date.now() - pet.birthDate) / (1000 * 60 * 60 * 24)) + '</div><div style="font-size:12px;color:#999;">陪伴天数</div></div>' +
                    '<div><div style="font-size:24px;font-weight:bold;color:#ff9800;">' + pet.unlockedSkins.length + '/' + PET_SKINS.length + '</div><div style="font-size:12px;color:#999;">已解锁宠物</div></div>' +
                '</div>' +
            '</div>' +
        '</div>';
        startRandomSpeech();
    }
    
    function renderStatusBar(label, value) {
        return '<div style="margin-bottom:12px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span>' + label + '</span><span style="color:' + getStatusColor(value) + ';">' + value + '%</span></div>' +
            '<div class="status-bar"><div class="status-bar-fill" style="width:' + value + '%;background:' + getStatusColor(value) + ';"></div></div>' +
        '</div>';
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
        updatePetExpression('happy');
        petSpeak('happy', container);
        setTimeout(() => updatePetExpression('idle'), 600);
    }
    
    function feedPetAnim() {
        feedPet();
        playAnimation('eating');
        updatePetExpression('eating');
        const container = document.getElementById('pet-container');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 900);
    }
    
    function playWithPetAnim() {
        playWithPet();
        playAnimation('happy');
        updatePetExpression('happy');
        const container = document.getElementById('pet-container');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 600);
    }
    
    function petPetAnim() {
        petPet();
        playAnimation('happy');
        updatePetExpression('happy');
        const container = document.getElementById('pet-container');
        petSpeak('happy', container);
        setTimeout(() => refreshPetDisplay(), 600);
    }
    
    function sleepPetAnim() {
        sleepPet();
        playAnimation('sleeping');
        updatePetExpression('sleeping');
        const container = document.getElementById('pet-container');
        petSpeak('sleepy', container);
        setTimeout(() => {
            refreshPetDisplay();
            setTimeout(() => {
                const petDisplay = document.getElementById('pet-display-anim');
                if (petDisplay) petDisplay.classList.replace('pet-sleeping', 'pet-idle');
                updatePetExpression('idle');
            }, 3000);
        }, 2000);
    }
    
    function togglePetVoice() {
        const data = getPetData();
        data.voiceEnabled = !data.voiceEnabled;
        savePetData(data);
        window.showToast(data.voiceEnabled ? '🔊 宠物语音已开启' : '🔇 宠物语音已关闭');
        refreshPetDisplay();
    }
    
    function refreshPetDisplay() {
        const fullscreenContent = document.getElementById('fullscreen-content');
        if (fullscreenContent) renderPet(fullscreenContent);
    }
    
    function openPetSelector() {
        const pet = getPetData();
        let cardsHtml = '';
        PET_SKINS.forEach(skin => {
            const unlocked = pet.unlockedSkins.includes(skin.id);
            const selected = pet.skinId === skin.id;
            const unlockLevel = PET_SKINS.findIndex(s => s.id === skin.id) + 2;
            cardsHtml += '<div class="pet-card ' + (selected ? 'selected' : '') + ' ' + (!unlocked ? 'locked' : '') + '" onclick="' + (unlocked ? "window.selectPet('" + skin.id + "')" : "window.tryUnlockPet('" + skin.id + "')") + '">' +
                '<div style="width:60px;height:70px;margin:0 auto 6px;">' + (unlocked ? renderAnimePet(skin.id, 'happy') : renderAnimePet(skin.id, 'idle')) + '</div>' +
                '<div style="font-size:13px;font-weight:500;">' + skin.name + '</div>' +
                (!unlocked ? '<div style="font-size:10px;color:#999;">Lv.' + unlockLevel + '解锁</div>' : '') +
                (selected ? '<div style="font-size:10px;color:#667eea;">当前使用</div>' : '') +
            '</div>';
        });
        
        const selectorHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">' +
            '<div style="background:white;border-radius:24px;padding:24px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
                    '<h3 style="margin:0;font-size:18px;color:#333;">🎨 选择宠物</h3>' +
                    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + cardsHtml + '</div>' +
                '<div style="margin-top:20px;padding:12px;background:#f3e5f5;border-radius:12px;font-size:12px;color:#666;">💡 提示：提升等级可以解锁更多可爱的动漫宠物哦！</div>' +
            '</div>' +
        '</div>';
        
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = selectorHTML;
        document.body.appendChild(modalWrapper.firstElementChild);
    }
    
    function selectPet(skinId) {
        changePetSkin(skinId);
        const overlay = document.querySelector('div[style*="position:fixed"]');
        if (overlay) overlay.remove();
        refreshPetDisplay();
        const data = getPetData();
        const skin = PET_SKINS.find(s => s.id === skinId);
        petVoiceSay('你好！我是' + (skin ? skin.name : '你的宠物') + '！');
    }
    
    function tryUnlockPet(skinId) {
        unlockPet(skinId);
        const overlay = document.querySelector('div[style*="position:fixed"]');
        if (overlay) overlay.remove();
        refreshPetDisplay();
    }
    
    // 预加载语音列表
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
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
    window.togglePetVoice = togglePetVoice;
    console.log('[V357] 虚拟宠物模块加载完成 - 动漫风格+语音回应版');
})();

// 虚拟宠物UI渲染模块
// 直接使用window.showToast，避免ES6 import问题

import pet from './modules/pet.js';

// 渲染宠物主页
export function renderPetPage(container) {
    // 初始化宠物模块
    pet.init();
    
    const data = pet.getData();
    const currentSkin = pet.getCurrentSkin();
    const moodState = pet.getMoodState();
    const allSkins = pet.getAllSkins();
    
    container.innerHTML = `
        <div class="pet-container">
            <!-- 返回按钮栏 -->
            <div class="module-nav-bar">
                <button class="back-btn" id="petBackBtn">← 返回</button>
                <h2>🐾 我的宠物</h2>
                <button class="edit-btn" id="renamePetBtn">✏️</button>
            </div>

            <!-- 宠物展示区 -->
            <div class="pet-display-card">
                <div class="pet-avatar-area">
                    <div class="pet-emoji" id="petEmoji">${currentSkin.emoji}</div>
                    <div class="pet-level-badge">Lv.${data.level}</div>
                </div>
                <div class="pet-info">
                    <h3 class="pet-name">${data.name}</h3>
                    <p class="pet-mood">${moodState.emoji} ${moodState.name} · ${moodState.desc}</p>
                </div>
                
                <!-- 经验条 -->
                <div class="pet-stats">
                    <div class="stat-row">
                        <span class="stat-label">经验值</span>
                        <div class="exp-bar">
                            <div class="exp-fill" style="width: ${(data.exp / data.expToNextLevel) * 100}%"></div>
                        </div>
                        <span class="stat-value">${data.exp} / ${data.expToNextLevel}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">❤️ 健康</span>
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${data.health}%"></div>
                        </div>
                        <span class="stat-value">${data.health}/100</span>
                    </div>
                </div>
            </div>

            <!-- 互动按钮 -->
            <div class="section-card">
                <h3>🎮 互动一下</h3>
                <div class="action-buttons pet-actions">
                    <button class="action-btn" id="feedPetBtn">
                        <span class="action-icon">🍖</span>
                        <span>喂食</span>
                    </button>
                    <button class="action-btn" id="playPetBtn">
                        <span class="action-icon">🎾</span>
                        <span>玩耍</span>
                    </button>
                    <button class="action-btn" id="touchPetBtn">
                        <span class="action-icon">🤚</span>
                        <span>抚摸</span>
                    </button>
                </div>
            </div>

            <!-- 宠物皮肤 -->
            <div class="section-card">
                <h3>🎨 宠物皮肤</h3>
                <div class="skins-grid">
                    ${allSkins.map(skin => {
                        const unlocked = data.unlockedSkins.includes(skin.id);
                        const equipped = data.skin === skin.id;
                        return `
                            <div class="skin-card ${unlocked ? '' : 'locked'} ${equipped ? 'equipped' : ''}" data-skin="${skin.id}">
                                <div class="skin-emoji">${skin.emoji}</div>
                                <div class="skin-name">${skin.name}</div>
                                <div class="skin-desc">${skin.desc}</div>
                                ${equipped ? '<span class="equipped-tag">使用中</span>' : ''}
                                ${!unlocked ? '<span class="locked-tag">🔒 Lv.' + skin.unlockLevel + '解锁</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- 宠物档案 -->
            <div class="section-card">
                <h3>📋 宠物档案</h3>
                <div class="pet-stats-detail">
                    <div class="stat-item">
                        <span class="stat-icon">🎂</span>
                        <span class="stat-text">生日：${new Date(data.birthDate).toLocaleDateString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">👆</span>
                        <span class="stat-text">互动次数：${data.totalInteractions}次</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🎁</span>
                        <span class="stat-text">已解锁皮肤：${data.unlockedSkins.length}/${allSkins.length}</span>
                    </div>
                </div>
            </div>

            <!-- 成长说明 -->
            <div class="section-card">
                <h3>💡 如何获得经验？</h3>
                <div class="tips-list">
                    <div class="tip-item">🍅 完成番茄专注 → +20经验</div>
                    <div class="tip-item">🧠 完成认知训练 → +30经验</div>
                    <div class="tip-item">✅ 每日打卡 → +15经验</div>
                    <div class="tip-item">🎯 完成目标 → +50经验</div>
                    <div class="tip-item">📚 阅读书籍 → +25经验</div>
                    <div class="tip-item">🗺️ 完成思维导图 → +40经验</div>
                </div>
            </div>
        </div>
    `;
    
    // 绑定事件
    bindPetEvents(container, pet, data);
}

// 绑定宠物页面事件
function bindPetEvents(container, pet, data) {
    // 返回按钮
    container.querySelector('#petBackBtn').addEventListener('click', () => {
        // 返回我的页面
        renderMyCenter(container);
    });
    
    // 喂食
    container.querySelector('#feedPetBtn').addEventListener('click', () => {
        const result = pet.feed();
        if (result) {
            animatePet(container);
            updatePetDisplay(container, pet);
        }
    });
    
    // 玩耍
    container.querySelector('#playPetBtn').addEventListener('click', () => {
        const result = pet.play();
        if (result) {
            animatePet(container);
            updatePetDisplay(container, pet);
        }
    });
    
    // 抚摸
    container.querySelector('#touchPetBtn').addEventListener('click', () => {
        pet.pet();
        animatePet(container);
        updatePetDisplay(container, pet);
        const hearts = ['❤️', '💕', '💖', '💗'];
        window.showToast(hearts[Math.floor(Math.random() * hearts.length)] + ' 喵~');
    });
    
    // 改名
    container.querySelector('#renamePetBtn').addEventListener('click', () => {
        const newName = prompt('给宠物取个新名字吧：', data.name);
        if (newName && newName.trim()) {
            pet.rename(newName.trim());
            renderPetPage(container);
        }
    });
    
    // 切换皮肤
    container.querySelectorAll('.skin-card:not(.locked)').forEach(card => {
        card.addEventListener('click', () => {
            const skinId = card.dataset.skin;
            if (skinId !== data.skin) {
                pet.changeSkin(skinId);
                renderPetPage(container);
            }
        });
    });
}

// 更新宠物显示
function updatePetDisplay(container, pet) {
    const data = pet.getData();
    const currentSkin = pet.getCurrentSkin();
    const moodState = pet.getMoodState();
    
    container.querySelector('.pet-emoji').textContent = currentSkin.emoji;
    container.querySelector('.pet-level-badge').textContent = 'Lv.' + data.level;
    container.querySelector('.pet-name').textContent = data.name;
    container.querySelector('.pet-mood').textContent = moodState.emoji + ' ' + moodState.name + ' · ' + moodState.desc;
    container.querySelector('.exp-fill').style.width = (data.exp / data.expToNextLevel) * 100 + '%';
    container.querySelector('.stat-value').textContent = data.exp + ' / ' + data.expToNextLevel;
    container.querySelector('.health-fill').style.width = data.health + '%';
}

// 宠物动画
function animatePet(container) {
    const emoji = container.querySelector('.pet-emoji');
    emoji.style.transform = 'scale(1.3)';
    setTimeout(() => {
        emoji.style.transform = 'scale(1)';
    }, 300);
}

// 挂载到window，供ui.js调用
window.renderPet = renderPetPage;

export default {
    renderPetPage
};

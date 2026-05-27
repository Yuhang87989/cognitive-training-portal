// ============================================================
// 虚拟宠物UI渲染模块
// ============================================================

function renderPetPage(container) {
    const pet = window.petModule;
    if (!pet) {
        // pet.js有自己的renderPet，直接调用它
        if (typeof window._renderPetOriginal === 'function') {
            window._renderPetOriginal(container);
            return;
        }
        // 最后回退
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">🐾 宠物模块加载中...</div>';
        return;
    }
    
    pet.init();
    const data = pet.getData();
    const moodState = pet.getMoodState();
    const levelTitle = pet.getLevelTitle();
    
    container.innerHTML = `
        <div style="padding:16px;min-height:100%;background:linear-gradient(180deg,#e3f2fd,#fce4ec);">
            <!-- 顶部栏 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:8px 14px;background:white;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">🐾 我的宠物</h2>
                <button onclick="showRenameDialog()" style="padding:8px 14px;background:white;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.1);">✏️</button>
            </div>
            
            <!-- 宠物展示卡 -->
            <div style="background:white;border-radius:24px;padding:24px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.1);margin-bottom:16px;">
                <div style="font-size:80px;margin-bottom:12px;animation:bounce 2s infinite;">${data.skin}</div>
                <h3 style="margin:0 0 4px 0;font-size:22px;color:#333;">${data.name}</h3>
                <div style="font-size:14px;color:#999;margin-bottom:16px;">Lv.${data.level} ${levelTitle}</div>
                
                <!-- 心情状态 -->
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;">
                    <span style="font-size:24px;">${moodState.emoji}</span>
                    <span style="font-size:16px;color:${moodState.color};font-weight:bold;">${moodState.text}</span>
                </div>
                
                <!-- 经验条 -->
                <div style="text-align:left;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:#999;margin-bottom:6px;">
                        <span>经验值</span>
                        <span>${data.exp} / ${data.expToNext}</span>
                    </div>
                    <div style="height:10px;background:#f0f0f0;border-radius:5px;overflow:hidden;">
                        <div style="height:100%;width:${(data.exp / data.expToNext) * 100}%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:5px;transition:width 0.3s;"></div>
                    </div>
                </div>
            </div>
            
            <!-- 属性状态 -->
            <div style="background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:16px;">
                <div style="font-weight:bold;font-size:15px;margin-bottom:16px;color:#333;">📊 状态</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                    <div style="background:#fff3e0;padding:12px;border-radius:12px;">
                        <div style="font-size:12px;color:#ff9800;margin-bottom:4px;">🍖 饱食度</div>
                        <div style="height:6px;background:#ffe0b2;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${data.hunger}%;background:#ff9800;border-radius:3px;"></div>
                        </div>
                        <div style="font-size:11px;color:#999;margin-top:4px;">${data.hunger}%</div>
                    </div>
                    <div style="background:#e3f2fd;padding:12px;border-radius:12px;">
                        <div style="font-size:12px;color:#2196f3;margin-bottom:4px;">⚡ 精力</div>
                        <div style="height:6px;background:#bbdefb;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${data.energy}%;background:#2196f3;border-radius:3px;"></div>
                        </div>
                        <div style="font-size:11px;color:#999;margin-top:4px;">${data.energy}%</div>
                    </div>
                    <div style="background:#fce4ec;padding:12px;border-radius:12px;">
                        <div style="font-size:12px;color:#e91e63;margin-bottom:4px;">❤️ 健康</div>
                        <div style="height:6px;background:#f8bbd9;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${data.health}%;background:#e91e63;border-radius:3px;"></div>
                        </div>
                        <div style="font-size:11px;color:#999;margin-top:4px;">${data.health}%</div>
                    </div>
                    <div style="background:#e8f5e9;padding:12px;border-radius:12px;">
                        <div style="font-size:12px;color:#4caf50;margin-bottom:4px;">💝 亲密度</div>
                        <div style="height:6px;background:#c8e6c9;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${Math.min(100, data.totalInteractions)}%;background:#4caf50;border-radius:3px;"></div>
                        </div>
                        <div style="font-size:11px;color:#999;margin-top:4px;">${data.totalInteractions}次互动</div>
                    </div>
                </div>
            </div>
            
            <!-- 互动按钮 -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                <button onclick="doPetAction('feed')" style="padding:16px;background:#ff9800;color:white;border:none;border-radius:16px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 8px rgba(255,152,0,0.3);">
                    🍖 喂食
                </button>
                <button onclick="doPetAction('play')" style="padding:16px;background:#e91e63;color:white;border:none;border-radius:16px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 8px rgba(233,30,99,0.3);">
                    🎾 玩耍
                </button>
                <button onclick="doPetAction('pet')" style="padding:16px;background:#9c27b0;color:white;border:none;border-radius:16px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 8px rgba(156,39,176,0.3);">
                    🤚 抚摸
                </button>
            </div>
        </div>
        
        <style>
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>
    `;
}

// 执行宠物动作
function doPetAction(action) {
    const pet = window.petModule;
    if (!pet) return;
    
    let message = '';
    switch(action) {
        case 'feed':
            pet.feed();
            message = '🍖 吃得饱饱的！心情+10 经验+10';
            break;
        case 'play':
            pet.play();
            message = '🎾 玩得超开心！心情+20 经验+15';
            break;
        case 'pet':
            pet.pet();
            message = '🤚 舒服地呼噜噜~ 心情+5';
            break;
    }
    
    window.showToast(message);
    renderPetPage(document.getElementById('fullscreen-content'));
}

// 重命名对话框
function showRenameDialog() {
    const pet = window.petModule;
    if (!pet) return;
    
    const data = pet.getData();
    const newName = prompt('给你的宠物起个新名字吧：', data.name);
    if (newName && newName.trim()) {
        pet.rename(newName.trim());
        window.showToast('✅ 名字已更新！');
        renderPetPage(document.getElementById('fullscreen-content'));
    }
}

// 挂载到window - 先保存pet.js原始renderPet
if (typeof window.renderPet === 'function') {
    window._renderPetOriginal = window.renderPet;
}
window.renderPet = renderPetPage;
window.renderPetPage = renderPetPage;

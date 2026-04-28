// ====== games模块 ======
// 版本: V140

CTM.registerModule('games', {
    name: '训练游戏',
    icon: '🎮',
    render: renderGames
});

function renderGames(container) {
    const user = getCurrentUserData();
    const gameScores = user?.gameScores || {};
    const gameCounts = user?.gameCounts || {};
    const gameTimes = user?.gameTimes || {};
    
	    ;
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎮 认知训练游戏</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">16大游戏全面提升认知能力！</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${games.map(g => `
                    <div onclick="startGame('${g.id}')" style="background:${g.gradient};color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                        <div style="font-size:28px;margin-bottom:8px;">${g.icon}</div>
                        <div style="font-size:14px;font-weight:600;">${g.name}</div>
                        <div style="font-size:11px;opacity:0.9;margin-top:4px;">${g.desc}</div>
                        ${gameScores[g.id] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores[g.id]}</div>` : ''}
                        <div style="margin-top:8px;font-size:10px;opacity:0.8;">
                            ${gameCounts[g.id] ? `已玩${gameCounts[g.id]}次` : '未开始'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h3 style="margin-bottom:12px;">🎮 娱乐游戏</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">轻松一刻，享受游戏乐趣！</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                <div onclick="startGame('snake')" style="background:linear-gradient(135deg,#43A047,#66BB6A);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🐍</div>
                    <div style="font-size:14px;font-weight:600;">贪吃蛇</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">经典益智</div>
                    ${gameScores['snake'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['snake']}</div>` : ''}
                </div>
                <div onclick="startGame('tetris')" style="background:linear-gradient(135deg,#E53935,#EF5350);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🧱</div>
                    <div style="font-size:14px;font-weight:600;">俄罗斯方块</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">经典益智</div>
                    ${gameScores['tetris'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['tetris']}</div>` : ''}
                </div>
                <div onclick="startGame('flipcard')" style="background:linear-gradient(135deg,#1E88E5,#42A5F5);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🃏</div>
                    <div style="font-size:14px;font-weight:600;">记忆翻牌</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">记忆力挑战</div>
                    ${gameScores['flipcard'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['flipcard']}</div>` : ''}
                </div>
                <div onclick="startGame('slide')" style="background:linear-gradient(135deg,#FB8C00,#FFA726);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔢</div>
                    <div style="font-size:14px;font-weight:600;">数字华容道</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">益智解谜</div>
                    ${gameScores['slide'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['slide']}</div>` : ''}
                </div>
                <div onclick="startGame('g2048')" style="background:linear-gradient(135deg,#EDC22E,#F0D060);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🎮</div>
                    <div style="font-size:14px;font-weight:600;">2048</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">数字合并</div>
                    ${gameScores['g2048'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['g2048']}</div>` : ''}
                </div>
                <div onclick="startGame('whack')" style="background:linear-gradient(135deg,#8E24AA,#AB47BC);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔨</div>
                    <div style="font-size:14px;font-weight:600;">打地鼠</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">反应速度</div>
                    ${gameScores['whack'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['whack']}</div>` : ''}
                </div>
                <div onclick="startGame('linkup')" style="background:linear-gradient(135deg,#00897B,#26A69A);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔗</div>
                    <div style="font-size:14px;font-weight:600;">连连看</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">图案配对</div>
                    ${gameScores['linkup'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['linkup']}</div>` : ''}
                </div>
                <div onclick="startGame('eliminate')" style="background:linear-gradient(135deg,#F4511E,#FF7043);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">💎</div>
                    <div style="font-size:14px;font-weight:600;">消消乐</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">宝石消除</div>
                    ${gameScores['eliminate'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['eliminate']}</div>` : ''}
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📊 游戏统计</h4>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#3377FF;">${Object.keys(gameCounts).reduce((sum, k) => sum + (gameCounts[k] || 0), 0)}</div>
                    <div style="font-size:11px;color:#666;">总游戏次数</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#43E97B;">${Object.keys(gameScores).length}</div>
                    <div style="font-size:11px;color:#666;">已解锁游戏</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#FF6B6B;">${Object.keys(gameTimes).reduce((sum, k) => sum + Math.round((gameTimes[k] || 0) / 60), 0)}分钟</div>
                    <div style="font-size:11px;color:#666;">总游戏时长</div>
                </div>
            </div>
        </div>
    `;
}

// 导出到window
window.renderGames = renderGames;
window.startGame = startGame;

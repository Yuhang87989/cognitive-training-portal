import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 11. 修改游戏启动函数，使其使用全屏页面
old_startGame = '''function startGame(type) {
    gameType = type; gameScore = 0; gameLevel = 1;
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('game-score').textContent = '0';
    switch(type) {
        case 'schulte': startSchulte(); break;
        case 'visual': startVisual(); break;
        case 'digit': startDigit(); break;
        case 'pattern': startPattern(); break;
        case 'tap': startTap(); break;
        case 'color': startColor(); break;
        case 'diff': startDiff(); break;
        case 'reason': startReason(); break;
    }
}'''

new_startGame = '''function startGame(type) {
    gameType = type; gameScore = 0; gameLevel = 1;
    // 进入全屏游戏模式
    const fullscreenGame = document.getElementById('fullscreen-game');
    if (fullscreenGame) {
        fullscreenGame.classList.add('active');
        document.getElementById('game-score').textContent = '0';
        document.getElementById('game-level').textContent = 'Lv.1';
        switch(type) {
            case 'schulte': startSchulte(); break;
            case 'visual': startVisual(); break;
            case 'digit': startDigit(); break;
            case 'pattern': startPattern(); break;
            case 'tap': startTap(); break;
            case 'color': startColor(); break;
            case 'diff': startDiff(); break;
            case 'reason': startReason(); break;
        }
    } else {
        // 兼容模式
        document.getElementById('game-area').style.display = 'block';
        document.getElementById('game-score').textContent = '0';
        switch(type) {
            case 'schulte': startSchulte(); break;
            case 'visual': startVisual(); break;
            case 'digit': startDigit(); break;
            case 'pattern': startPattern(); break;
            case 'tap': startTap(); break;
            case 'color': startColor(); break;
            case 'diff': startDiff(); break;
            case 'reason': startReason(); break;
        }
    }
}

function closeGameFullscreen() {
    const fullscreenGame = document.getElementById('fullscreen-game');
    if (fullscreenGame) {
        fullscreenGame.classList.remove('active');
    }
    if (gameTimer) clearInterval(gameTimer);
}'''

content = content.replace(old_startGame, new_startGame)

# 12. 修改endGame函数
old_endGame = '''function endGame() {
    if (gameTimer) clearInterval(gameTimer);
    const timeSpent = Math.round((Date.now()-gameStartTime)/1000);
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:200px;';
    board.innerHTML = `<div style="text-align:center;"><div style="font-size:48px;margin-bottom:12px;">🎉</div><div style="font-size:20px;font-weight:bold;color:var(--blue);">游戏结束！</div><div style="font-size:36px;font-weight:bold;margin:16px 0;">得分：${gameScore}</div><div style="font-size:14px;color:var(--text-gray);">用时：${timeSpent}秒 · 到达关卡 ${gameLevel}</div></div>`;
    const user = getCurrentUserData();
    if (user) {
        user.gameScores = user.gameScores || {};
        user.gameScores[gameType] = Math.max(user.gameScores[gameType]||0, gameScore);
        user.todayStats = user.todayStats || { questions:0, correct:0, minutes:0 };
        user.todayStats.minutes += Math.ceil(timeSpent/60);
        const today = new Date().toISOString().split('T')[0];
        user.studyDays = user.studyDays || {};
        user.studyDays[today] = (user.studyDays[today]||0) + Math.ceil(timeSpent/60);
        syncUserData(user);
        syncTodayStats();
    }
}'''

new_endGame = '''function endGame() {
    if (gameTimer) clearInterval(gameTimer);
    const timeSpent = Math.round((Date.now()-gameStartTime)/1000);
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:200px;';
    board.innerHTML = `<div style="text-align:center;padding:20px;"><div style="font-size:48px;margin-bottom:12px;">🎉</div><div style="font-size:20px;font-weight:bold;color:var(--blue);">游戏结束！</div><div style="font-size:36px;font-weight:bold;margin:16px 0;">得分：${gameScore}</div><div style="font-size:14px;color:var(--text-gray);margin-bottom:20px;">用时：${timeSpent}秒 · 到达关卡 ${gameLevel}</div><div style="display:flex;gap:12px;justify-content:center;"><button class="game-btn btn-blue" onclick="resetGame()">再玩一次</button><button class="game-btn btn-orange" onclick="closeGameFullscreen()">返回</button></div></div>`;
    const user = getCurrentUserData();
    if (user) {
        user.gameScores = user.gameScores || {};
        user.gameScores[gameType] = Math.max(user.gameScores[gameType]||0, gameScore);
        user.todayStats = user.todayStats || { questions:0, correct:0, minutes:0 };
        user.todayStats.minutes += Math.ceil(timeSpent/60);
        const today = new Date().toISOString().split('T')[0];
        user.studyDays = user.studyDays || {};
        user.studyDays[today] = (user.studyDays[today]||0) + Math.ceil(timeSpent/60);
        syncUserData(user);
        syncTodayStats();
    }
}'''

content = content.replace(old_endGame, new_endGame)

# 13. 修改closeGame函数
old_closeGame = '''function closeGame() { if (gameTimer) clearInterval(gameTimer); document.getElementById('game-area').style.display = 'none'; }'''
new_closeGame = '''function closeGame() { if (gameTimer) clearInterval(gameTimer); closeGameFullscreen(); document.getElementById('game-area').style.display = 'none'; }'''

content = content.replace(old_closeGame, new_closeGame)

print("Step 11-13 completed: Updated game functions for fullscreen mode")
print(f"File length: {len(content)} characters")

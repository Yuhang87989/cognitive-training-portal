// 版本: V226 - ES6 Module
// 训练游戏模块


// 安全声明 - 防止游戏加载时序问题
var playSound = playSound || function() {};
var gameTimerDisplay = gameTimerDisplay || null;
var gameTimer = gameTimer || null;
var snakeGame = typeof snakeGame !== 'undefined' ? snakeGame : null;
var tetrisGame = typeof tetrisGame !== 'undefined' ? tetrisGame : null;
var whackTimer = typeof whackTimer !== 'undefined' ? whackTimer : null;
var gameType = "";
var gameScore = 0;
var gameLevel = 1;
var gameStartTime = 0;
var elimTimer = typeof elimTimer !== 'undefined' ? elimTimer : null;
var elimColors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFD93D','#DDA0DD'];


// startGame moved to end of file (with metacognitive prediction)

function startSchulte() {
    const config = gameConfig['schulte'];
    document.getElementById('game-title').textContent = config?.name || '🎯 舒尔特方格';
    const sizes = [3,4,5,6];
    const size = sizes[Math.min(gameLevel-1,3)];
    const nums = Array.from({length:size*size},(_,i)=>i+1).sort(()=>Math.random()-0.5);
    const board = document.getElementById('game-board');
    board.className = 'game-board size-'+size; 
    board.style.display = 'grid';
    board.innerHTML = nums.map(n => `<div class="game-cell" onclick="checkSchulte(this,${n})" style="background:white;font-size:${28-size*2}px;font-weight:bold;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">${n}</div>`).join('');
    schulteNext = 1; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => { 
        if (Date.now()-gameStartTime > 20000) { 
            clearInterval(gameTimer); 
            endGame(); 
        } 
    }, 1000);
}

function startWhack() {
    document.getElementById('game-title').textContent = '🔨 打地鼠';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div style="text-align:center;margin-bottom:16px;"><span id="whack-timer" style="font-size:24px;font-weight:bold;color:#8E24AA;">30</span>秒</div><div id="whack-container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px;max-width:320px;margin:0 auto;"></div>';
    
    whackMoles = Array(9).fill(0);
    whackTimeLeft = 30;
    whackActive = 0;
    
    const container = document.getElementById('whack-container');
    for(let i=0;i<9;i++) {
        const hole = document.createElement('div');
        hole.style.cssText = 'width:80px;height:80px;background:#8B4513;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;';
        hole.innerHTML = '<div id="whack-'+i+'" style="position:absolute;bottom:-50px;width:50px;height:50px;background:#D2691E;border-radius:50%;transition:bottom 0.15s;font-size:32px;text-align:center;line-height:50px;">🐹</div>';
        hole.onclick = () => whackMole(i);
        container.appendChild(hole);
    }
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
    
    if(whackTimer) clearInterval(whackTimer);
    whackTimer = setInterval(()=>{
        whackTimeLeft--;
        document.getElementById('whack-timer').textContent = whackTimeLeft;
        
        if(whackTimeLeft<=0) {
            clearInterval(whackTimer);
            whackTimer = null;
            endGame();
        } else {
            showMole();
        }
    },1000);
}

function startSnake() {
    document.getElementById('game-title').textContent = '🐍 贪吃蛇';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="snake-container" style="display:flex;justify-content:center;align-items:center;height:100%;"><canvas id="snake-canvas" style="border:3px solid #43A047;border-radius:8px;"></canvas></div>';
    
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    const gridSize = 15;
    const gridCount = size / gridSize;
    
    let snake = [{x:5,y:5}];
    let direction = {x:1,y:0};
    let nextDirection = {x:1,y:0};
    let food = {x:10,y:10};
    let score = 0;
    let gameOver = false;
    let speed = 150;
    
    function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }
    
    function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }
    
    function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }
    
    placeFood();
    draw();
    
    if(snakeGame) clearInterval(snakeGame);
    snakeGame = setInterval(update,speed);
    
    // 触屏控制
    let touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>Math.abs(dy)) {
            if(dx>20&&direction.x!==-1) nextDirection={x:1,y:0};
            else if(dx<-20&&direction.x!==1) nextDirection={x:-1,y:0};
        } else {
            if(dy>20&&direction.y!==-1) nextDirection={x:0,y:1};
            else if(dy<-20&&direction.y!==1) nextDirection={x:0,y:-1};
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp'&&direction.y!==1) nextDirection={x:0,y:-1};
        else if(e.key==='ArrowDown'&&direction.y!==-1) nextDirection={x:0,y:1};
        else if(e.key==='ArrowLeft'&&direction.x!==1) nextDirection={x:-1,y:0};
        else if(e.key==='ArrowRight'&&direction.x!==-1) nextDirection={x:1,y:0};
    });
    
    score = 0;
}

function startTetris() {
    document.getElementById('game-title').textContent = '🧱 俄罗斯方块';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="tetris-container" style="display:flex;justify-content:center;align-items:center;height:100%;gap:20px;"><canvas id="tetris-canvas" style="border:3px solid #E53935;border-radius:8px;"></canvas><div id="tetris-next" style="padding:10px;background:#fff;border-radius:8px;"><div style="font-size:12px;color:#666;margin-bottom:8px;">下一个</div><canvas id="tetris-next-canvas" width="80" height="80"></canvas></div></div>';
    
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('tetris-next-canvas');
    const nextCtx = nextCanvas.getContext('2d');
    
    const cols = 10, rows = 16, cellSize = 20;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cols * cellSize * dpr;
    canvas.height = rows * cellSize * dpr;
    canvas.style.width = (cols * cellSize) + 'px';
    canvas.style.height = (rows * cellSize) + 'px';
    ctx.scale(dpr, dpr);
    
    const pieces = [
        {shape:[[1,1,1,1]],color:'#3498db'},
        {shape:[[1,1],[1,1]],color:'#f1c40f'},
        {shape:[[0,1,0],[1,1,1]],color:'#9b59b6'},
        {shape:[[1,0,0],[1,1,1]],color:'#e67e22'},
        {shape:[[0,0,1],[1,1,1]],color:'#1abc9c'},
        {shape:[[1,1,0],[0,1,1]],color:'#e74c3c'},
        {shape:[[0,1,1],[1,1,0]],color:'#2ecc71'}
    ];
    
    let board2d = Array.from({length:rows},()=>Array(cols).fill(0));
    let current = null, nextPiece = null;
    let x = 0, y = 0;
    let score = 0, lines = 0;
    let gameOver = false;
    let speed = 500;
    let lastDrop = Date.now();
    
    function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }
    
    function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }
    
    function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }
    
    function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }
    
    function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }
    
    function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }
    
    function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }
    
    function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }
    
    function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }
    
    current = randomPiece();
    nextPiece = randomPiece();
    x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
    y = 0;
    drawNext();
    
    if(tetrisGame) clearInterval(tetrisGame);
    tetrisGame = setInterval(tick,speed);
    
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(dy<-30) { // 上滑旋转
                const rotated = rotate(current.shape);
                if(canMove(rotated,x,y)) current.shape = rotated;
            } else if(dy>30) { // 下滑加速
                while(canMove(current.shape,x,y+1)) y++;
            } else if(dx>30) {
                if(canMove(current.shape,x+1,y)) x++;
            } else if(dx<-30) {
                if(canMove(current.shape,x-1,y)) x--;
            }
        }
    });
    
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'&&canMove(current.shape,x-1,y)) x--;
        else if(e.key==='ArrowRight'&&canMove(current.shape,x+1,y)) x++;
        else if(e.key==='ArrowDown'&&canMove(current.shape,x,y+1)) y++;
        else if(e.key==='ArrowUp') {
            const rotated = rotate(current.shape);
            if(canMove(rotated,x,y)) current.shape = rotated;
        }
    });
    
    score = 0; lines = 0;
}

function startColor() {
    const config = gameConfig['color'];
    document.getElementById('game-title').textContent = config?.name || '🌈 颜色识别';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;gap:16px;';
    const colorWords = [
        {w:'红',c:'#FF6B6B'},
        {w:'蓝',c:'#3377FF'},
        {w:'绿',c:'#43E97B'},
        {w:'黄',c:'#FFD93D'},
        {w:'紫',c:'#9B59B6'}
    ];
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 20000) { clearInterval(gameTimer); endGame(); return; }
        const word = colorWords[Math.floor(Math.random()*5)];
        const wrongColor = colorWords.filter(c=>c.c!==word.c)[Math.floor(Math.random()*4)];
        board.innerHTML = `
            <div id="color-word" style="font-size:48px;font-weight:bold;padding:20px;color:${wrongColor.c}">${word.w}</div>
            <div style="display:flex;gap:12px;margin-top:10px;">
                <button onclick="gameScore++;document.getElementById('game-score').textContent=gameScore;SoundEffects.playCorrect();" style="padding:12px 24px;background:#43E97B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✓ 正确</button>
                <button onclick="SoundEffects.playWrong();" style="padding:12px 24px;background:#FF6B6B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✗ 错误</button>
            </div>
        `;
    }, 2500);
}

function startAttentionTrack() {
    document.getElementById('game-title').textContent = '🎯 注意力追踪';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const counts = [6, 9, 12, 16, 20];
    const numCount = counts[Math.min(gameLevel - 1, 4)];
    const gridSize = Math.ceil(Math.sqrt(numCount));
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B', '#FF9A9E'];
    attentionSequence = [];
    for (let i = 0; i < numCount; i++) attentionSequence.push({ color: colors[i % colors.length], number: i + 1 });
    attentionSequence = attentionSequence.sort(() => Math.random() - 0.5);
    attentionIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">记住数字顺序，然后按顺序点击：</div><div id="attention-grid" style="display:grid;grid-template-columns:repeat(' + gridSize + ',1fr);gap:8px;margin-bottom:16px;">' + attentionSequence.map((item, i) => '<div id="att-item-' + i + '" style="aspect-ratio:1;background:' + item.color + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;color:white;opacity:0;transition:opacity 0.3s;cursor:pointer;" onclick="clickAttention(' + i + ')"></div>').join('') + '</div><button onclick="startAttentionSeq()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">开始记忆</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startAttentionSeq() {
    const sequence = attentionSequence.map((_, i) => i);
    let i = 0;
    const interval = setInterval(() => {
        if (i > 0) {
            const prevEl = document.getElementById('att-item-' + sequence[i-1]);
            if (prevEl) prevEl.textContent = '';
        }
        if (i < sequence.length) {
            const el = document.getElementById('att-item-' + sequence[i]);
            if (el) { el.textContent = attentionSequence[sequence[i]].number; el.style.opacity = '1'; }
            playAudioTone3(400 + i * 50);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                attentionSequence.forEach((_, idx) => {
                    const el = document.getElementById('att-item-' + idx);
                    if (el) { el.textContent = ''; el.style.opacity = '1'; }
                });
                attentionIndex = 0;
            }, 500);
        }
    }, 600);
}

function startFlipCard() {
    document.getElementById('game-title').textContent = '🃏 记忆翻牌';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="flip-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;"></div>';
    
    const icons = ['🍎','🍌','🍇','🍓','🌟','🌙','🔥','💎'];
    flipCards = [...icons,...icons].sort(()=>Math.random()-0.5);
    flipped = []; matched = 0; flips = 0;
    
    const container = document.getElementById('flip-container');
    flipCards.forEach((icon,i) => {
        const card = document.createElement('div');
        card.id = 'flip-'+i;
        card.style.cssText = 'width:70px;height:70px;background:linear-gradient(135deg,#1E88E5,#42A5F5);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;transition:transform 0.3s;transform-style:preserve-3d;';
        card.innerHTML = '<span style="opacity:0.3;">❓</span>';
        card.onclick = () => flipCard(i, card);
        container.appendChild(card);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startVisualTracking() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>👁️ 视觉追踪训练</h3>
            <p>请用眼睛追踪移动的目标，保持注意力集中</p>
            <div class="game-area" id="visual-game-area" style="position:relative;width:100%;height:300px;background:#f5f5f5;border-radius:12px;overflow:hidden;">
                <div id="tracking-target" style="position:absolute;width:40px;height:40px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);"></div>
            </div>
            <div class="game-stats">
                <div>用时: <span id="visual-time">0</span>秒</div>
                <div>追踪次数: <span id="visual-count">0</span></div>
            </div>
            <button class="btn-primary" onclick="startVisualTracking()">开始训练</button>
        </div>
    `;
    
    let count = 0;
    let startTime = Date.now();
    const target = document.getElementById('tracking-target');
    const area = document.getElementById('visual-game-area');
    
    target.onmouseenter = function() {
        count++;
        document.getElementById('visual-count').textContent = count;
    };
    
    function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }
    
    moveTarget();
    const interval = setInterval(moveTarget, 1500);
    setTimeout(() => {
        clearInterval(interval);
        const time = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('visual-time').textContent = time;
        alert(`训练完成！追踪了 ${count} 次，用时 ${time} 秒`);
    }, 30000);
}

function startSpatialMemory() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🧠 空间记忆挑战</h3>
            <p>记住方块的位置，然后按顺序点击它们</p>
            <div class="game-area" id="spatial-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:320px;margin:0 auto;"></div>
            <div id="spatial-status" style="text-align:center;margin:15px;">关卡: <span id="spatial-level">1</span></div>
            <div class="game-stats">
                <div>正确: <span id="spatial-correct">0</span></div>
                <div>序列: <span id="spatial-sequence">0</span></div>
            </div>
        </div>
    `;
    
    let level = 1;
    let sequence = [];
    let playerSequence = [];
    let showing = false;
    
    function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }
    
    function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }
    
    function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }
    
    function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }
    
    initGrid();
    showLevel();
}

function startDigit() {
    const config = gameConfig['digit'];
    document.getElementById('game-title').textContent = config?.name || '🔢 数字记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;';
    const count = 3 + gameLevel;
    const digits = Array.from({length:count},()=>Math.floor(Math.random()*10)).join('');
    board.innerHTML = `<div style="font-size:48px;font-weight:bold;color:#1A6BFF;letter-spacing:8px;">${digits}</div><div style="margin-top:20px;font-size:14px;color:#666;">记住这些数字！</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        board.innerHTML = `<div style="font-size:18px;color:#666;margin-bottom:12px;">请输入你看到的数字：</div><input type="text" id="digit-input" style="width:200px;text-align:center;font-size:24px;padding:12px;border:2px solid #1A6BFF;border-radius:12px;" maxlength="${count}"/><button onclick="checkDigit('${digits}')" style="margin-top:16px;padding:12px 24px;background:#1A6BFF;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">确认</button>`;
    }, 1500+count*200);
}

function startPattern() {
    const config = gameConfig['pattern'];
    document.getElementById('game-title').textContent = config?.name || '🎨 图形记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const emojis = ['🍎','🍊','🍋','🍇','🌸','🌺','⭐','🌙','🔥','💎','🎁','🎈'];
    const count = 4 + gameLevel;
    const selected = emojis.slice(0,count);
    board.innerHTML = selected.map(e => `<div class="game-cell" style="background:#f0f7ff;font-size:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${e}</div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        const shuffled = [...emojis,'🍀','🌈'].slice(0,12).sort(()=>Math.random()-0.5);
        patternCorrect = [...selected]; patternFound = [];
        board.innerHTML = shuffled.map(e => `<div class="game-cell" onclick="checkPattern(this,'${e}')" style="background:white;font-size:24px;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">?</div>`).join('');
    }, 2000+count*300);
}

function startMathCalc() {
    document.getElementById('game-title').textContent = '🔢 数学速算';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const difficulties = [{ ops: ['+', '-'], max: 20 }, { ops: ['+', '-'], max: 50 }, { ops: ['+', '-', '×'], max: 12 }, { ops: ['+', '-', '×'], max: 20 }, { ops: ['+', '-', '×', '÷'], max: 20 }];
    const diff = difficulties[Math.min(gameLevel - 1, 4)];
    const op = diff.ops[Math.floor(Math.random() * diff.ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * diff.max) + 1; b = Math.floor(Math.random() * diff.max) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * diff.max) + 5; b = Math.floor(Math.random() * Math.min(a, diff.max)) + 1; answer = a - b; }
    else if (op === '×') { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
    else { b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 1; a = b * answer; }
    mathCorrectAnswer = answer;
    const options = [answer];
    while (options.length < 4) { const wrong = answer + Math.floor(Math.random() * 11) - 5; if (wrong > 0 && wrong !== answer && !options.includes(wrong)) options.push(wrong); }
    options.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:16px;color:#666;margin-bottom:20px;">请快速计算：</div><div style="font-size:36px;font-weight:bold;text-align:center;margin-bottom:24px;color:#333;">' + a + ' ' + op + ' ' + b + ' = ?</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + options.map(o => '<button onclick="checkMathAnswer(' + o + ')" style="padding:20px;font-size:24px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-weight:bold;" id="math-opt-' + o + '">' + o + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startLinkUp() {
    document.getElementById('game-title').textContent = '🔗 连连看';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="link-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:10px;max-width:340px;margin:0 auto;"></div>';
    
    const emojis = ['🍎','🍊','🍋','🍇','🍓','🍒','🥝','🌟','❤️','🔵','💜','💚'];
    linkIcons = emojis.slice(0,18);
    linkBoard = [...linkIcons,...linkIcons].sort(()=>Math.random()-0.5);
    linkSelected = [];
    linkPairs = 0;
    
    const container = document.getElementById('link-container');
    linkBoard.forEach((icon,i)=>{
        const cell = document.createElement('div');
        cell.id = 'link-'+i;
        cell.style.cssText = 'width:50px;height:50px;background:#00897B;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;';
        cell.textContent = icon;
        cell.onclick = () => clickLink(i);
        container.appendChild(cell);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startSlide() {
    document.getElementById('game-title').textContent = '🔢 数字华容道';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="slide-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;max-width:300px;margin:0 auto;"></div><div style="text-align:center;margin-top:16px;"><button onclick="shuffleSlide()" style="padding:10px 24px;background:#FB8C00;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    slideBoard = [];
    for(let i=1;i<16;i++) slideBoard.push(i);
    slideBoard.push(0);
    slideEmpty = {x:3,y:3};
    slideMoves = 0;
    shuffleSlide();
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startTap() {
    const config = gameConfig['tap'];
    document.getElementById('game-title').textContent = config?.name || '⚡ 快速点击';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-3'; 
    board.style.cssText = 'display:grid;position:relative;min-height:200px;';
    board.innerHTML = Array(9).fill('<div class="game-cell" style="position:relative;border-radius:8px;"></div>').join('');
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 10000) { clearInterval(gameTimer); endGame(); return; }
        board.querySelectorAll('.game-cell').forEach(c => c.innerHTML = '');
        const targetCell = board.querySelectorAll('.game-cell')[Math.floor(Math.random()*9)];
        targetCell.innerHTML = '<div onclick="event.stopPropagation();tapTarget(this)" style="width:100%;height:100%;background:#1A6BFF;border-radius:8px;cursor:pointer;"></div>';
    }, 800);
}

function startTextMemory() {
    document.getElementById('game-title').textContent = '📝 文字记忆';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const wordCounts = [4, 5, 6, 7, 8];
    const count = wordCounts[Math.min(gameLevel - 1, 4)];
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    textMemoryWords = allWords.sort(() => Math.random() - 0.5).slice(0, count);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请记住以下词语：</div><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + textMemoryWords.map(w => '<span style="background:#667eea;color:white;padding:8px 14px;border-radius:8px;font-size:14px;">' + w + '</span>').join('') + '</div><button onclick="textMemoryStartTest()" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">我记住了，开始测试</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startAuditoryTraining() {
    const container = document.getElementById('fullscreen-content');
    const sounds = [
        { freq: 440, name: '标准音A' },
        { freq: 523, name: '高音C' },
        { freq: 659, name: '高音E' },
        { freq: 880, name: '高音A' }
    ];
    
    container.innerHTML = `
        <div class="game-container">
            <h3>🎵 听觉分辨训练</h3>
            <p>仔细聆听音调，点击正确的音符</p>
            <div class="game-area" style="display:flex;justify-content:center;gap:15px;flex-wrap:wrap;padding:20px;">
                ${sounds.map((s, i) => `
                    <button class="sound-btn" onclick="playSound(${s.freq}, ${i})" id="sound-${i}">
                        ${s.name}
                    </button>
                `).join('')}
            </div>
            <div id="auditory-feedback" style="text-align:center;font-size:18px;margin:20px;">点击上方按钮听音调</div>
            <div class="game-stats">
                <div>得分: <span id="auditory-score">0</span></div>
                <div>回合: <span id="auditory-round">0</span>/5</div>
            </div>
        </div>
    `;
    
    let currentTarget = 0;
    let score = 0;
    let round = 0;
    
    function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }
    
    window.playSound = function(freq, btnIndex) {
        // 使用Web Audio API播放音效
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            
            // btnIndex === -1 只播放不检查，btnIndex >= 0 需要检查答案
            if (btnIndex >= 0) {
                if (btnIndex === currentTarget) {
                    score++;
                    document.getElementById('auditory-score').textContent = score;
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#43e97b;">✅ 正确！</span>`;
                } else {
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#fa709a;">❌ 错误，正确答案是: ${sounds[currentTarget].name}</span>`;
                }
                setTimeout(newRound, 1500);
            }
        } catch(e) {
            document.getElementById('auditory-feedback').textContent = '浏览器不支持音频功能';
        }
    };
    
    newRound();
}

function startFocusChallenge() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🎯 专注力挑战</h3>
            <p>在限定时间内，点击所有蓝色方块，避免红色方块</p>
            <div class="game-area" id="focus-game-area" style="position:relative;width:100%;height:350px;background:#1a1a2e;border-radius:12px;overflow:hidden;"></div>
            <div class="game-stats">
                <div>得分: <span id="focus-score">0</span></div>
                <div>时间: <span id="focus-time">30</span>秒</div>
                <div>正确率: <span id="focus-accuracy">100</span>%</div>
            </div>
        </div>
    `;
    
    let score = 0;
    let wrongClicks = 0;
    let timeLeft = 30;
    const gameArea = document.getElementById('focus-game-area');
    
    function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }
    
    function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }
    
    const spawnInterval = setInterval(spawnTarget, 500);
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('focus-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(spawnInterval);
            clearInterval(timer);
            alert(`🎉 挑战结束！得分: ${score}，正确率: ${document.getElementById('focus-accuracy').textContent}%`);
        }
    }, 1000);
}

function startWordAssociation() {
    document.getElementById('game-title').textContent = '💬 词汇联想';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const categories = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const target = cat.words[Math.floor(Math.random() * cat.words.length)];
    const correct = cat.words.filter(w => w !== target);
    const otherWords = categories.filter(c => c.name !== cat.name).flatMap(c => c.words).sort(() => Math.random() - 0.5).slice(0, 3);
    const wordOptions = [...correct.slice(0, 3), ...otherWords].sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">哪个词与"' + target + '"属于同一类别？</div><div style="font-size:20px;font-weight:bold;text-align:center;margin-bottom:20px;color:#667eea;">' + target + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + wordOptions.map((w, i) => '<button onclick="checkWordAssoc(\'' + w + '\', \'' + cat.name + '\')" style="padding:16px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-size:14px;font-weight:500;">' + w + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startClassification() {
    document.getElementById('game-title').textContent = '📂 分类归纳';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const sets = [
        { cat1: '学习用品', cat2: '生活用品', items1: ['铅笔', '橡皮', '尺子'], items2: ['毛巾', '牙刷', '杯子'] },
        { cat1: '水果', cat2: '蔬菜', items1: ['苹果', '香蕉', '橙子'], items2: ['白菜', '萝卜', '黄瓜'] },
        { cat1: '交通工具', cat2: '学习用品', items1: ['汽车', '火车', '飞机'], items2: ['课本', '作业', '文具盒'] }
    ];
    classifySet = sets[Math.floor(Math.random() * sets.length)];
    const items = [...classifySet.items1, ...classifySet.items2].sort(() => Math.random() - 0.5);
    classifyBox0 = [];
    classifyBox1 = [];
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请将物品分成两类：</div><div id="classify-items" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + items.map((item, i) => '<div onclick="classifyItem(this, \'' + item + '\')" style="padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;">' + item + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px;"><div style="padding:12px;background:rgba(102,126,234,0.1);border-radius:12px;text-align:center;border:2px dashed #667eea;"><div style="font-size:12px;color:#667eea;margin-bottom:8px;">第一类</div><div id="classify-box-0" style="min-height:60px;"></div></div><div style="padding:12px;background:rgba(255,107,107,0.1);border-radius:12px;text-align:center;border:2px dashed #FF6B6B;"><div style="font-size:12px;color:#FF6B6B;margin-bottom:8px;">第二类</div><div id="classify-box-1" style="min-height:60px;"></div></div></div><button onclick="checkClassification()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">确认分类</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startDiff() {
    const config = gameConfig['diff'];
    document.getElementById('game-title').textContent = config?.name || '🔍 找不同';
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;';
    const symbols = ['🌟','⭐','🌙','☀️','🔴','🔵'];
    const left = [...symbols]; 
    const right = [...symbols];
    const diffIdx = Math.floor(Math.random()*6);
    right[diffIdx] = ['🟢','🟡','⬜','⬛'][Math.floor(Math.random()*4)];
    board.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${left.map(s=>`<div style="text-align:center;font-size:24px;">${s}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${right.map((s,i)=>`<div style="text-align:center;font-size:24px;cursor:pointer;padding:4px;border-radius:4px;" onclick="checkDiff(this,${i},${diffIdx})">${s}</div>`).join('')}
        </div>
    `;
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0/1';
}

function startReason() {
    const config = gameConfig['reason'];
    document.getElementById('game-title').textContent = config?.name || '🧩 图形推理';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:250px;gap:16px;';
    const patterns = [
        {seq:['○','○○','○○○'],a:0,opt:['○○○○','○○○','○○○○○']},
        {seq:['△','△△','△△△'],a:1,opt:['△△','△△△','△△△△']},
        {seq:['□','□□','□□□'],a:2,opt:['□□','□□□','□□□□']}
    ];
    const p = patterns[Math.min(gameLevel-1,2)];
    board.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:12px;">${p.seq.map(s=>`<div style="padding:8px 12px;background:#f0f7ff;border-radius:8px;font-size:20px;">${s}</div>`).join('')}<div style="padding:8px 12px;background:#ddd;border-radius:8px;font-size:20px;">？</div></div><div style="display:flex;gap:12px;">${p.opt.map((o,i)=>`<button onclick="checkReason(${i},${p.a})" style="padding:10px 16px;font-size:16px;border:none;border-radius:8px;cursor:pointer;background:${i===0?'#3377FF':i===1?'#FF6B6B':'#43E97B'};color:white;">${o}</button>`).join('')}</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startShapeReason() {
    document.getElementById('game-title').textContent = '🔷 图形推理';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['●', '■', '▲', '◆', '★'], colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B'];
    const baseShapes = [];
    for (let i = 0; i < 4; i++) baseShapes.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapePattern = [...baseShapes];
    shapeCorrect = Math.floor(Math.random() * 4);
    const correctAnswer = baseShapes[shapeCorrect];
    shapeOptions = [correctAnswer];
    for (let i = 0; i < 3; i++) shapeOptions.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapeOptions = shapeOptions.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">找出规律，预测缺失的图形：</div><div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">' + shapePattern.map((s, i) => i === shapeCorrect ? '<div style="width:50px;height:50px;border:2px dashed #999;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;">?</div>' : '<div style="width:50px;height:50px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;color:' + s.color + ';">' + s.shape + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + shapeOptions.map((s, i) => '<div onclick="checkShapeReason(' + i + ')" style="width:60px;height:60px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="shape-opt-' + i + '">' + s.shape + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startVisual() {
    const config = gameConfig['visual'];
    document.getElementById('game-title').textContent = config?.name || '👁️ 视觉搜索';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const targetIdx = Math.floor(Math.random()*16);
    const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFD93D'];
    const targetColor = colors[Math.floor(Math.random()*colors.length)];
    const baseColor = colors.filter(c=>c!==targetColor)[Math.floor(Math.random()*4)];
    board.innerHTML = Array.from({length:16},(_,i)=>`<div class="game-cell" onclick="checkVisual(this,${i},${targetIdx},'${targetColor}')" style="background:${i===targetIdx?targetColor:baseColor};border-radius:8px;cursor:pointer;"></div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startSpaceRotate() {
    document.getElementById('game-title').textContent = '🎲 空间旋转';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['↑', '→', '↓', '←'];
    const original = shapes[Math.floor(Math.random() * shapes.length)];
    const rotations = [0, 90, 180, 270];
    const targetRotation = rotations[Math.floor(Math.random() * rotations.length)];
    const degrees = { '↑': 0, '→': 90, '↓': 180, '←': 270 };
    const getShape = (base, rot) => { const baseDeg = degrees[base]; const newDeg = (baseDeg + rot) % 360; return Object.entries(degrees).find(([_, d]) => d === newDeg)?.[0] || '↑'; };
    const rotatedShape = getShape(original, targetRotation);
    const options = [rotatedShape, ...shapes.filter(s => s !== rotatedShape)].slice(0, 4).sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">原图形旋转后是什么方向？</div><div style="display:flex;gap:24px;justify-content:center;margin-bottom:16px;align-items:center;"><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">原图形</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">' + original + '</div></div><div style="font-size:24px;color:#667eea;">→</div><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">旋转' + targetRotation + '°</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">？</div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + options.map((s, i) => '<div onclick="checkSpaceRotate(\'' + s + '\', \'' + rotatedShape + '\')" style="width:60px;height:60px;background:#f5f7ff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="space-opt-' + i + '">' + s + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startEliminate() {
    document.getElementById('game-title').textContent = '💎 消消乐';
    const board = document.getElementById('game-board');
    board.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;overflow:auto;min-height:0;';
    board.innerHTML = '<div style="text-align:center;margin-bottom:8px;"><span id="elim-timer" style="font-size:20px;font-weight:bold;color:#F4511E;">30</span>秒 | <span id="elim-score" style="font-size:16px;font-weight:bold;">0</span>分</div><div id="elim-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:6px;width:100%;max-width:300px;margin:0 auto;"></div>';
    
    elimScore = 0;
    elimTime = 30;
    elimSelected = null;
    elimBoard = [];
    
    for(let i=0;i<36;i++) elimBoard.push(Math.floor(Math.random()*6));
    renderElim();
    
    document.getElementById('game-score').textContent = '0';
    
    if(elimTimer) clearInterval(elimTimer);
    elimTimer = setInterval(()=>{
        elimTime--;
        document.getElementById('elim-timer').textContent = elimTime;
        if(elimTime<=0) {
            clearInterval(elimTimer);
            elimTimer = null;
            endGame();
        }
    },1000);
}

function startStroop() {
    const diff = (window.getCurrentUserData().difficulty || 1);
    const totalTime = diff <= 2 ? 45 : diff <= 3 ? 30 : 20;
    const colors = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA'];
    const colorNames = ['红色','蓝色','绿色','橙色','紫色'];
    
    window._stroopData = {score: 0, total: 0, timeLeft: totalTime, colors, colorNames};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = 'white';
    
    showStroopQuestion();
    
    window._stroopTimer = setInterval(() => {
        window._stroopData.timeLeft--;
        const el = document.getElementById('stroop-timer');
        if (el) el.textContent = window._stroopData.timeLeft + '秒';
        if (window._stroopData.timeLeft <= 0) {
            clearInterval(window._stroopTimer);
            const d = window._stroopData;
            showGameOver(d.score * 10, d.total * 10);
        }
    }, 1000);
}

function startPalace() {
    const config = CTM.games.palace || {};
    const diff = (window.getCurrentUserData().difficulty || 1);
    const itemCount = diff <= 2 ? 5 : diff <= 3 ? 7 : 9;
    const memorizeTime = diff <= 2 ? 30 : diff <= 3 ? 20 : 15;
    
    const items = ['📚','🍎','🔑','⭐','🎯','🎈','🎵','🌈','🏆','💡','🎁','🌙','🔔','❤️','🦋','🌸','⚽','🎸'];
    const shuffled = items.sort(() => Math.random() - 0.5).slice(0, itemCount);
    const positions = [];
    const cols = 4, rows = 3;
    for (let i = 0; i < itemCount; i++) {
        let pos;
        do { pos = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
        } while (positions.some(p => p.x === pos.x && p.y === pos.y));
        positions.push(pos);
    }
    
    let gameData = {items: shuffled, positions, phase: 'memorize', selected: [], score: 0};
    window._palaceData = gameData;
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    container.innerHTML = '<div style="text-align:center;"><div style="font-size:24px;font-weight:bold;margin-bottom:12px;">🏛️ 记忆宫殿</div><div style="font-size:16px;margin-bottom:20px;">记住每个物品的位置！</div><div style="font-size:48px;">⏳</div><div id="palace-timer" style="font-size:20px;margin-top:12px;">' + memorizeTime + '秒</div></div>';
    
    // 记忆阶段倒计时
    let timeLeft = memorizeTime;
    window._palaceTimer = setInterval(() => {
        timeLeft--;
        const el = document.getElementById('palace-timer');
        if (el) el.textContent = timeLeft + '秒';
        if (timeLeft <= 0) {
            clearInterval(window._palaceTimer);
            renderPalaceRecall();
        }
    }, 1000);
    
    // 先显示物品
    setTimeout(() => renderPalaceMemorize(shuffled, positions, memorizeTime), 100);
}

function startNumshape() {
    const diff = (window.getCurrentUserData().difficulty || 1);
    const questions = [
        {expr:'y = x', correct:0, opts:['直线(45°)','抛物线(向上)','双曲线','正弦曲线']},
        {expr:'y = x²', correct:1, opts:['直线','抛物线(向上)','抛物线(向下)','V字形']},
        {expr:'y = -x²', correct:2, opts:['直线','抛物线(向上)','抛物线(向下)','双曲线']},
        {expr:'y = |x|', correct:3, opts:['直线','抛物线','双曲线','V字形']},
        {expr:'y = 2x + 1', correct:0, opts:['直线(斜向上)','抛物线','水平线','垂直线']},
        {expr:'y = 1/x', correct:2, opts:['直线','抛物线','双曲线','正弦曲线']},
        {expr:'y = x³', correct:1, opts:['直线','S形曲线','抛物线','双曲线']},
        {expr:'y = √x', correct:0, opts:['半抛物线(右延伸)','抛物线','双曲线','直线']},
        {expr:'y = sin(x)', correct:2, opts:['直线','抛物线','正弦波','方波']},
        {expr:'y = 3', correct:1, opts:['垂直线','水平线','抛物线','斜线']}
    ];
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._numshapeData = {questions: selected, current: 0, score: 0, total: count};
    
    showNumshapeQuestion();
}

function startConserve() {
    const questions = [
        {q:'将水从矮胖杯倒入高瘦杯，水量如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'体积守恒'},
        {q:'一块橡皮泥从球形捏成长条形，质量如何？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'质量守恒'},
        {q:'弹簧被压缩后，弹性势能和动能之和如何？', opts:['增加','减少','不变','取决于速度'], correct:2, explain:'机械能守恒(无摩擦)'},
        {q:'两车碰撞前后，总动量如何？', opts:['增加','减少','不变','取决于碰撞类型'], correct:2, explain:'动量守恒'},
        {q:'封闭容器内气体被压缩，分子总数如何？', opts:['增加','减少','不变','取决于温度'], correct:2, explain:'粒子数守恒'},
        {q:'化学反应前后，原子总数如何？', opts:['增加','减少','不变','取决于反应类型'], correct:2, explain:'质量守恒'},
        {q:'电路中流入节点的电流和流出的电流关系？', opts:['流入>流出','流入<流出','相等','不确定'], correct:2, explain:'电荷守恒'},
        {q:'自由下落过程中，动能增加量与势能减少量关系？', opts:['增加>减少','增加<减少','相等','不确定'], correct:2, explain:'能量守恒'},
        {q:'两个人分别绕操场跑一圈，位移相同吗？', opts:['相同','不同','取决于速度','取决于方向'], correct:0, explain:'位移只看起终点'},
        {q:'冰融化成水，分子数如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'粒子数守恒'}
    ];
    const diff = (window.getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._conserveData = {questions: selected, current: 0, score: 0, total: count};
    showConserveQuestion();
}

function startNetwork() {
    const topics = [
        {nodes:['光合作用','二氧化碳','氧气','叶绿体','阳光','葡萄糖'], edges:[[0,1],[0,2],[0,3],[0,4],[0,5]]},
        {nodes:['牛顿','万有引力','苹果','运动定律','力','加速度'], edges:[[0,1],[0,2],[0,3],[4,5],[3,4]]},
        {nodes:['细胞','DNA','蛋白质','基因','染色体','遗传'], edges:[[0,1],[1,3],[1,4],[2,5],[3,4]]},
        {nodes:['水','蒸发','凝结','雨','云','河流'], edges:[[0,1],[1,3],[1,4],[3,2],[4,2],[5,0]]}
    ];
    const diff = (window.getCurrentUserData().difficulty || 1);
    const topicIdx = Math.floor(Math.random() * topics.length);
    const topic = topics[topicIdx];
    window._networkData = {topic, selected: [], correct: 0, total: topic.edges.length};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    let html = '<div style="text-align:center;max-width:360px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🕸️ 知识网络</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击两个节点建立连接，找出正确关系</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">';
    topic.nodes.forEach((n, i) => {
        html += '<div onclick="networkSelect(' + i + ')" id="net-node-' + i + '" style="padding:8px 14px;background:rgba(255,255,255,0.2);border-radius:20px;cursor:pointer;font-size:13px;">' + n + '</div>';
    });
    html += '</div>';
    html += '<div style="font-size:12px;" id="net-status">请选择第一个节点</div>';
    html += '<div style="margin-top:8px;font-size:13px;">已建立: <span id="net-count">0</span>/' + topic.edges.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function startReverse() {
    const questions = [
        {conclusion:'三角形内角和为180°', opts:['三条边等长','任意三角形','直角三角形','等腰三角形'], correct:1},
        {conclusion:'物体加速运动', opts:['合外力为零','合外力不为零','速度为零','质量很大'], correct:1},
        {conclusion:'x²=4', opts:['x必须大于0','x=2或x=-2','x只能是2','x必须是整数'], correct:1},
        {conclusion:'化学反应发生了', opts:['颜色没变','产生新物质','温度不变','体积不变'], correct:1},
        {conclusion:'该数为偶数', opts:['该数能被3整除','该数末位是0,2,4,6,8','该数大于10','该数是质数'], correct:1},
        {conclusion:'植物能进行光合作用', opts:['没有根','有叶绿体','在黑暗中','没有水'], correct:1},
        {conclusion:'分数有意义', opts:['分子为0','分母不为0','分母为0','分子大于分母'], correct:1},
        {conclusion:'水会沸腾', opts:['温度100°C以下','达到沸点且继续加热','在密闭容器中','气压很高'], correct:1},
        {conclusion:'两个力平衡', opts:['大小不等','方向相同','大小相等方向相反','作用在不同物体上'], correct:2},
        {conclusion:'该数为质数', opts:['能被2整除','只能被1和自身整除','是偶数','大于10'], correct:1}
    ];
    const diff = (window.getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._reverseData = {questions: selected, current: 0, score: 0, total: count};
    showReverseQuestion();
}

function startExperiment() {
    const experiments = [
        {title:'验证植物光合作用需要光', steps:['选取两盆相同植物','一盆放暗处一盆放光照下','相同时间后取叶片','碘液检测淀粉','对比结果得出结论'], distractors:['给植物浇水','测量植物高度']},
        {title:'验证空气中有水蒸气', steps:['准备干燥玻璃片','对着玻璃片哈气','观察玻璃片表面','看到水珠形成','得出空气含水蒸气的结论'], distractors:['称量玻璃片质量','加热玻璃片']},
        {title:'验证声音需要介质传播', steps:['准备密封玻璃罩和闹钟','闹钟放入罩内通电响铃','用抽气机逐渐抽出空气','观察声音逐渐减弱','推论真空不能传声'], distractors:['调节闹钟音量','打开窗户']},
        {title:'验证浮力与排开液体体积的关系', steps:['准备弹簧测力计和物体','测空气中物体重力','将物体部分浸入水中读数','将物体全部浸入水中读数','比较两次浮力大小'], distractors:['测量水温','换用不同颜色水']},
        {title:'验证欧姆定律', steps:['搭建含电阻的电路','调节电压到不同值','记录各电压下的电流值','计算电压与电流的比值','比值恒定即验证欧姆定律'], distractors:['测量电阻颜色','断开所有开关']}
    ];
    const expIdx = Math.floor(Math.random() * experiments.length);
    const exp = experiments[expIdx];
    const diff = (window.getCurrentUserData().difficulty || 1);
    
    // 混入干扰项
    let allSteps = [...exp.steps.map((s,i) => ({text:s, isCorrect:true, order:i}))];
    if (diff >= 2) {
        exp.distractors.forEach(d => allSteps.push({text:d, isCorrect:false, order:-1}));
    }
    allSteps.sort(() => Math.random() - 0.5);
    
    window._experimentData = {experiment: exp, allSteps, selected: [], score: 0};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#89f7fe,#66a6ff)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🧪 实验设计</div>';
    html += '<div style="font-size:15px;font-weight:bold;margin-bottom:8px;padding:10px;background:rgba(255,255,255,0.5);border-radius:12px;">' + exp.title + '</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">按正确顺序点击步骤（排除干扰项）</div>';
    html += '<div id="exp-steps">';
    allSteps.forEach((s, i) => {
        html += '<div onclick="experimentSelect(' + i + ')" id="exp-step-' + i + '" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;text-align:left;">' + s.text + '</div>';
    });
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:13px;">已选: <span id="exp-count">0</span>/' + exp.steps.length + ' 步</div>';
    html += '</div>';
    container.innerHTML = html;
}

function start2048() {
    document.getElementById('game-title').textContent = '🎮 2048';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="g2048-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;background:#bbada0;border-radius:12px;"></div><div style="text-align:center;margin-top:12px;"><button onclick="reset2048()" style="padding:10px 20px;background:#8f7a66;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    g2048Board = Array(16).fill(0);
    g2048Score = 0;
    add2048Tile();
    add2048Tile();
    render2048();
    
    document.getElementById('game-score').textContent = '0';
    
    // 触屏滑动控制
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(Math.abs(dx)>Math.abs(dy)) {
                move2048(dx>0?2:4); // 右:2, 左:4
            } else {
                move2048(dy>0?1:3); // 下:1, 上:3
            }
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp') move2048(3);
        else if(e.key==='ArrowDown') move2048(1);
        else if(e.key==='ArrowLeft') move2048(4);
        else if(e.key==='ArrowRight') move2048(2);
    });
}

async function startAudioSeq() {
    const freqs = [440, 554, 659];
    for (let i = 0; i < audioSequence.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                playAudioTone3(freqs[audioSequence[i]]);
                const el = document.getElementById('audio-seq-' + i);
                if (el) { el.style.background = '#667eea'; el.style.color = 'white'; }
                setTimeout(resolve, 500);
            }, 500);
        });
    }
}

function startMethodPractice(method) {
    const practice = methodPractices[method];
    if (!practice) return;
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    let html = '<div class="modal-title">' + practice.title + '</div>';
    practice.tasks.forEach((task, i) => {
        html += '<div class="plan-task" onclick="this.classList.toggle(\'completed\')"><div class="task-checkbox" id="task-' + i + '"></div><div class="task-text">' + task + '</div></div>';
    });
    html += '<button class="modal-close" onclick="window.closeModal()">完成训练</button>';
    content.innerHTML = html;
}

function startMethodQuiz(methodId, page = 0) {
    const questions = methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        window.showToast('暂无练习题');
        return;
    }
    
    // 初始化页码
    if (!currentMethodPage[methodId]) currentMethodPage[methodId] = 0;
    if (page !== undefined) currentMethodPage[methodId] = page;
    
    const currentPage = currentMethodPage[methodId];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题
                    </div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">
                        ${q.q}
                    </div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="window.closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startMethodTraining(methodId) {
    const questions = getMethodTraining(methodId);
    if (questions.length === 0) { window.showToast('暂无训练题'); return; }
    const methodNames = {
        feyman:'费曼学习法',pomodoro:'番茄工作法',ebbinghaus:'艾宾浩斯记忆法',
        mindmap:'思维导图法',cornell:'康奈尔笔记法',sq3r:'SQ3R阅读法',
        timeManagement:'时间管理法',noteTaking:'高效笔记法',testStrategy:'考试策略'
    };
    let html = '<div style="max-height:70vh;overflow-y:auto;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:16px;text-align:center;">' + methodNames[methodId] + ' 训练 (' + questions.length + '题)</div>';
    questions.forEach((q, i) => {
        html += '<div class="method-card" style="margin-bottom:16px;">';
        html += '<div style="font-size:14px;font-weight:600;margin-bottom:8px;">' + (i+1) + '. ' + q.q + '</div>';
        html += '<div class="method-content" style="background:#f5f7ff;padding:10px;border-radius:8px;">';
        html += '<strong>参考答案：</strong>' + q.a + '</div></div>';
    });
    html += '</div><button class="login-btn login-btn-primary" onclick="closeDetail()" style="width:100%;">完成训练</button>';
    const contentEl = document.getElementById('detail-content');
    if (contentEl) { contentEl.innerHTML = html; document.getElementById('detail-modal').classList.add('show'); }
}

function startThinkingQuiz(type, page = 0) {
    const questions = thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        window.showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="window.closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startPractice(topicId) {
    window.showToast('正在加载练习...');
    const topic = topicsMath7.find(t => t.id === topicId) || 
                  topicsEnglish7.find(t => t.id === topicId) ||
                  topicsChinese7.find(t => t.id === topicId);
    if (topic) {
        const container = document.getElementById('fullscreen-content');
        container.innerHTML = `
            <div class="practice-card">
                <div class="practice-question">${topic.q}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="请输入你的答案" />
                    <button onclick="submitTopicAnswer(${topic.id})">提交</button>
                </div>
                <div id="practice-result"></div>
            </div>
        `;
    }
}

function render2048() {
    const container = document.getElementById('g2048-container');
    if(!container) return;
    container.innerHTML = '';
    const colors = {0:'#cdc1b4',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
    g2048Board.forEach((v,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `width:70px;height:70px;background:${colors[v]||'#3c3a32'};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:${v>=1000?20:24}px;font-weight:bold;color:${v<=4?'#776e65':'#fff'};`;
        if(v) cell.textContent = v;
        container.appendChild(cell);
    });
}

function renderElim() {
    const container = document.getElementById('elim-container');
    if(!container) return;
    container.innerHTML = '';
    elimBoard.forEach((c,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `aspect-ratio:1;background:${elimColors[c]};border-radius:6px;cursor:pointer;transition:transform 0.2s;min-height:30px;`;
        cell.id = 'elim-'+i;
        cell.onclick = () => clickElim(i);
        container.appendChild(cell);
    });
}

function renderPalaceMemorize(items, positions, timeLeft) {
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 记忆阶段</div>';
    html += '<div id="palace-timer" style="font-size:14px;margin-bottom:12px;color:#ffd700;">⏱️ ' + timeLeft + '秒</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            const idx = positions.findIndex(p => p.x === x && p.y === y);
            if (idx >= 0) {
                html += '<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:32px;background:rgba(255,255,255,0.2);border-radius:12px;">' + items[idx] + '</div>';
            } else {
                html += '<div style="width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:12px;"></div>';
            }
        }
    }
    html += '</div></div>';
    container.innerHTML = html;
}

function renderPalaceRecall() {
    const data = window._palaceData;
    if (!data) return;
    data.phase = 'recall';
    data.selected = [];
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 回忆阶段</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;color:#ffd700;">点击正确的位置放置物品</div>';
    html += '<div style="font-size:28px;margin-bottom:12px;" id="palace-current-item">' + data.items[0] + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;" id="palace-grid">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            html += '<div onclick="palaceClick(' + x + ',' + y + ')" style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(255,255,255,0.1);border-radius:12px;cursor:pointer;" id="palace-' + x + '-' + y + '"></div>';
        }
    }
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:14px;">得分: <span id="palace-score">0</span>/' + data.items.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
    data.currentIdx = 0;
}

function reset2048() { start2048(); }

function checkSchulte(el, n) {
    if (n === schulteNext) {
        el.style.background = '#43E97B'; el.style.color = 'white';
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        schulteNext++;
        if (schulteNext > el.parentElement.children.length) {
            if (gameLevel < 4) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
                startSchulte(); 
            }
            else endGame();
        }
    } else { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => el.style.background = 'white', 200); 
    }
}

function whackMole(idx) {
    if(whackMoles[idx]===1) {
        whackMoles[idx] = 0;
        const el = document.getElementById('whack-'+idx);
        if(el) el.style.bottom = '-50px';
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect();
    }
}

function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }

function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }

function canMove2048() {
    for(let i=0;i<16;i++) {
        if(g2048Board[i]===0) return true;
        if(i%4!==3&&g2048Board[i]===g2048Board[i+1]) return true;
        if(i<12&&g2048Board[i]===g2048Board[i+4]) return true;
    }
    return false;
}

function move2048(dir) {
    const old = [...g2048Board];
    const rotate = (b,times) => {let r=[...b];for(let t=0;t<times;t++){const n=Array(16).fill(0);for(let i=0;i<16;i++)n[(3-i%4)*4+i%4]=b[i];r=n;}return r;};
    let b = rotate(g2048Board,dir);
    
    for(let r=0;r<4;r++) {
        let row = b.slice(r*4,r*4+4).filter(v=>v);
        for(let i=0;i<row.length-1;i++) if(row[i]===row[i+1]){row[i]*=2;g2048Score+=row[i];row.splice(i+1,1);}
        while(row.length<4) row.push(0);
        for(let c=0;c<4;c++) b[r*4+c]=row[c];
    }
    
    g2048Board = rotate(b,(4-dir)%4);
    gameScore = g2048Score;
    document.getElementById('game-score').textContent = g2048Score;
    
    if(JSON.stringify(old)!==JSON.stringify(g2048Board)) {
        add2048Tile();
        render2048();
        
        if(g2048Board.includes(2048)) {
            SoundEffects.playComplete();
            setTimeout(()=>{gameLevel++;updateGameLevelBadge();reset2048();},500);
        } else if(g2048Board.every(v=>v!==0)&&!canMove2048()) {
            endGame();
        }
    }
}

function add2048Tile() {
    const empty = [];
    g2048Board.forEach((v,i)=>{if(v===0)empty.push(i);});
    if(empty.length) g2048Board[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
}

function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }

function resetGame() { startGame(gameType); }

function endGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 播放游戏结束音效
    SoundEffects.playComplete();
    
    const timeSpent = Math.round((Date.now()-gameStartTime)/1000);
    const config = gameConfig[gameType];
    
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:200px;';
    
    board.innerHTML = `
        <div style="text-align:center;width:100%;max-width:300px;">
            <div style="font-size:64px;margin-bottom:16px;">${gameScore > 10 ? '🏆' : gameScore > 5 ? '🎉' : '👏'}</div>
            <div style="font-size:24px;font-weight:bold;color:${config?.color || '#1A6BFF'};margin-bottom:8px;">游戏结束！</div>
            <div style="font-size:48px;font-weight:bold;margin:16px 0;color:#333;">${gameScore}</div>
            <div style="font-size:14px;color:#666;margin-bottom:16px;">得分</div>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;">
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">用时</div>
                    <div style="font-size:18px;font-weight:bold;color:#1A6BFF;">${timeSpent}秒</div>
                </div>
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">到达关卡</div>
                    <div style="font-size:18px;font-weight:bold;color:#43E97B;">第${gameLevel}关</div>
                </div>
            </div>
            
            <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
                <button onclick="resetGame()" style="padding:14px 24px;background:${config?.gradient || '#1A6BFF'};color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔄 再来一次</button>
                <button onclick="closeGame()" style="padding:14px 24px;background:#f5f5f5;color:#333;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">返回列表</button>
            </div>
        </div>
    `;
    
    // 保存统计数据
    const user = window.getCurrentUserData();
    if (user) {
        // 最高分
        user.gameScores = user.gameScores || {};
        user.gameScores[gameType] = Math.max(user.gameScores[gameType]||0, gameScore);
        
        // 游戏次数
        user.gameCounts = user.gameCounts || {};
        user.gameCounts[gameType] = (user.gameCounts[gameType] || 0) + 1;
        
        // 游戏时长
        user.gameTimes = user.gameTimes || {};
        user.gameTimes[gameType] = (user.gameTimes[gameType] || 0) + timeSpent;
        
        // 今日统计
        user.todayStats = user.todayStats || { questions:0, correct:0, minutes:0 };
        user.todayStats.minutes += Math.ceil(timeSpent/60);
        
        const today = new Date().toISOString().split('T')[0];
        user.studyDays = user.studyDays || {};
        user.studyDays[today] = (user.studyDays[today]||0) + Math.ceil(timeSpent/60);
        
        syncUserData(user);
        syncTodayStats();
    }
}

function exitGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }

function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }

function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }

function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }

function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }

function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }

function showMole() {
    // 隐藏所有
    whackMoles.forEach((_,i)=>{
        const el = document.getElementById('whack-'+i);
        if(el) el.style.bottom = '-50px';
    });
    whackMoles = whackMoles.map(()=>0);
    
    // 显示新的
    const moleSpeed = Math.max(300,800-gameLevel*50);
    const count = Math.min(3,1+Math.floor(gameLevel/2));
    for(let i=0;i<count;i++) {
        setTimeout(()=>{
            const idx = Math.floor(Math.random()*9);
            const el = document.getElementById('whack-'+idx);
            if(el && whackMoles[idx]===0) {
                whackMoles[idx] = 1;
                el.style.bottom = '15px';
                setTimeout(()=>{
                    if(whackMoles[idx]===1) {
                        whackMoles[idx] = 0;
                        el.style.bottom = '-50px';
                    }
                },moleSpeed);
            }
        },i*200);
    }
}

function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }

function tapTarget(el) { 
    el.style.background = '#43E97B'; 
    gameScore++; 
    document.getElementById('game-score').textContent = gameScore; 
    SoundEffects.playClick(); // 点击音效
}

function canConnect(a,b) {
    const r1=Math.floor(a/6),c1=a%6,r2=Math.floor(b/6),c2=b%6;
    // 直线连接
    if(r1===r2) {
        for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r1*6+c]!=='') return false;
        return true;
    }
    if(c1===c2) {
        for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c1]!=='') return false;
        return true;
    }
    // 一个拐角
    if(linkBoard[r1*6+c2]==='') return true;
    if(linkBoard[r2*6+c1]==='') return true;
    // 两个拐角
    for(let r=0;r<6;r++) {
        if(linkBoard[r*6+c1]===''&&linkBoard[r*6+c2]==='') {
            let clear=true;
            for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    for(let c=0;c<6;c++) {
        if(linkBoard[r1*6+c]===''&&linkBoard[r2*6+c]==='') {
            let clear=true;
            for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    return false;
}

function flipCard(idx, el) {
    if(flipped.length>=2||flipped.includes(idx)||matched>=8) return;
    el.style.transform = 'rotateY(180deg)';
    el.innerHTML = '<span>'+flipCards[idx]+'</span>';
    flipped.push(idx);
    
    if(flipped.length===2) {
        flips++;
        gameScore = flips;
        document.getElementById('game-score').textContent = flips;
        
        if(flipCards[flipped[0]]===flipCards[flipped[1]]) {
            matched++;
            SoundEffects.playCorrect();
            if(matched===8) {
                setTimeout(()=>{
                    gameLevel++;
                    updateGameLevelBadge();
                    startFlipCard();
                },1000);
            }
            flipped = [];
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                const c1 = document.getElementById('flip-'+flipped[0]);
                const c2 = document.getElementById('flip-'+flipped[1]);
                if(c1) {c1.style.transform='';c1.innerHTML='<span style="opacity:0.3;">❓</span>';}
                if(c2) {c2.style.transform='';c2.innerHTML='<span style="opacity:0.3;">❓</span>';}
                flipped = [];
            },800);
        }
    }
}

function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }

function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }

function isSolved() {
    for(let i=0;i<15;i++) if(slideBoard[i]!==i+1) return false;
    return slideBoard[15]===0;
}

function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }

function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }

function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }

function textMemoryStartTest() {
    const board = document.getElementById('game-board');
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    textMemoryIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请判断这些词是否在刚才的记忆中：</div><div id="text-memory-word" style="font-size:24px;font-weight:bold;text-align:center;margin-bottom:20px;color:#333;">' + testWords[0] + '</div><div style="display:flex;gap:12px;"><button onclick="textMemoryCheck(true)" style="flex:1;padding:14px;background:#43E97B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✓ 见过</button><button onclick="textMemoryCheck(false)" style="flex:1;padding:14px;background:#FF6B6B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✗ 没见</button></div></div>';
}

function textMemoryCheck(answeredYes) {
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    const currentWord = testWords[textMemoryIndex];
    const wasInMemory = textMemoryWords.includes(currentWord);
    if (answeredYes === wasInMemory) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    textMemoryIndex++;
    if (textMemoryIndex >= testWords.length) {
        const board = document.getElementById('game-board');
        board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (gameScore >= testWords.length * 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确 ' + gameScore + '/' + testWords.length + '</div><button onclick="textMemoryNext()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
    } else {
        document.getElementById('text-memory-word').textContent = testWords[textMemoryIndex];
    }
}

function textMemoryNext() { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startTextMemory(); }

function showStroopQuestion() {
    const data = window._stroopData;
    if (!data || data.timeLeft <= 0) return;
    
    const wordIdx = Math.floor(Math.random() * data.colors.length);
    const colorIdx = Math.floor(Math.random() * data.colors.length);
    data.correctIdx = colorIdx;
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🎯 Stroop冲突</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击文字的<strong>书写颜色</strong>，不是文字内容！</div>';
    html += '<div style="font-size:56px;font-weight:bold;margin:20px 0;color:' + data.colors[colorIdx] + ';">' + data.colorNames[wordIdx] + '</div>';
    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">';
    data.colors.forEach((c, i) => {
        html += '<div onclick="stroopAnswer(' + i + ')" style="width:50px;height:50px;border-radius:50%;background:' + c + ';cursor:pointer;border:3px solid rgba(255,255,255,0.3);"></div>';
    });
    html += '</div>';
    html += '<div style="margin-top:16px;font-size:14px;">⏱️ <span id="stroop-timer">' + data.timeLeft + '</span>秒 | 得分: ' + data.score + '/' + data.total + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function stroopAnswer(idx) {
    const data = window._stroopData;
    if (!data) return;
    data.total++;
    if (idx === data.correctIdx) data.score++;
    showStroopQuestion();
}

function showReverseQuestion() {
    const data = window._reverseData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🔄 逆向推理</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:13px;margin-bottom:4px;">已知结论：</div>';
    html += '<div style="font-size:16px;font-weight:bold;margin:12px 0;padding:12px;background:rgba(255,255,255,0.5);border-radius:12px;">' + q.conclusion + '</div>';
    html += '<div style="font-size:13px;margin-bottom:8px;">哪个条件能推出此结论？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="reverseAnswer(' + i + ')" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;">' + opt + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function reverseAnswer(idx) {
    const data = window._reverseData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showReverseQuestion();
}

function conserveAnswer(idx) {
    const data = window._conserveData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showConserveQuestion();
}

function showNumshapeQuestion() {
    const data = window._numshapeData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:12px;">📐 数形结合</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:32px;font-weight:bold;margin:20px 0;padding:16px;background:rgba(255,255,255,0.5);border-radius:16px;">' + q.expr + '</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;">这个函数的图像是什么形状？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="numshapeAnswer(' + i + ')" style="padding:12px;margin:6px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:14px;">' + opt + '</div>';
    });
    html += '<div style="margin-top:12px;font-size:13px;">得分: ' + data.score * 10 + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function numshapeAnswer(idx) {
    const data = window._numshapeData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showNumshapeQuestion();
}

function networkSelect(idx) {
    const data = window._networkData;
    if (!data) return;
    
    const nodeEl = document.getElementById('net-node-' + idx);
    if (!nodeEl) return;
    
    if (data.selected.length === 0) {
        data.selected = [idx];
        nodeEl.style.background = 'rgba(67,233,123,0.5)';
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第二个节点';
    } else if (data.selected.length === 1) {
        const a = data.selected[0], b = idx;
        if (a === b) { data.selected = []; nodeEl.style.background = 'rgba(255,255,255,0.2)'; return; }
        
        const isCorrect = data.topic.edges.some(e => (e[0]===a && e[1]===b) || (e[0]===b && e[1]===a));
        const nodeA = document.getElementById('net-node-' + a);
        
        if (isCorrect) {
            data.correct++;
            nodeA.style.background = 'rgba(67,233,123,0.3)';
            nodeEl.style.background = 'rgba(67,233,123,0.3)';
        } else {
            nodeA.style.background = 'rgba(255,100,100,0.3)';
            nodeEl.style.background = 'rgba(255,100,100,0.3)';
            setTimeout(() => {
                nodeA.style.background = 'rgba(255,255,255,0.2)';
                nodeEl.style.background = 'rgba(255,255,255,0.2)';
            }, 500);
        }
        
        data.selected = [];
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第一个节点';
        const cnt = document.getElementById('net-count');
        if (cnt) cnt.textContent = data.correct;
        
        if (data.correct >= data.total) {
            setTimeout(() => showGameOver(data.correct * 10 + 20, data.total * 10 + 20), 500);
        }
    }
}

function experimentSelect(idx) {
    const data = window._experimentData;
    if (!data) return;
    const step = data.allSteps[idx];
    const el = document.getElementById('exp-step-' + idx);
    if (!el || step._selected) return;
    
    step._selected = true;
    
    if (step.isCorrect && step.order === data.selected.length) {
        data.selected.push(step);
        data.score++;
        el.style.background = 'rgba(67,233,123,0.5)';
        el.style.cursor = 'default';
    } else if (step.isCorrect && step.order !== data.selected.length) {
        el.style.background = 'rgba(255,200,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    } else {
        el.style.background = 'rgba(255,100,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    }
    
    const cnt = document.getElementById('exp-count');
    if (cnt) cnt.textContent = data.selected.length;
    
    if (data.selected.length >= data.experiment.steps.length) {
        setTimeout(() => showGameOver(data.score * 10 + 20, data.experiment.steps.length * 10 + 20), 500);
    }
}

function palaceClick(x, y) {
    const data = window._palaceData;
    if (!data || data.phase !== 'recall') return;
    const idx = data.currentIdx;
    if (idx >= data.items.length) return;
    
    const cell = document.getElementById('palace-' + x + '-' + y);
    if (!cell || cell.textContent) return; // 已占据
    
    const correct = data.positions[idx].x === x && data.positions[idx].y === y;
    if (correct) {
        cell.textContent = data.items[idx];
        cell.style.background = 'rgba(67,233,123,0.3)';
        data.score++;
    } else {
        cell.textContent = '❌';
        cell.style.background = 'rgba(255,100,100,0.3)';
    }
    
    const scoreEl = document.getElementById('palace-score');
    if (scoreEl) scoreEl.textContent = data.score;
    
    data.currentIdx++;
    if (data.currentIdx >= data.items.length) {
        setTimeout(() => showGameOver(data.score * 10 + (data.score === data.items.length ? 20 : 0), data.items.length * 10 + 20), 500);
    } else {
        const itemEl = document.getElementById('palace-current-item');
        if (itemEl) itemEl.textContent = data.items[data.currentIdx];
    }
}

function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }

function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }

function updateTrainCount(count) {
    const user = window.getCurrentUserData();
    if (user) {
        user.trainCount = parseInt(count);
        syncUserData(user);
        window.showToast('已设置每日训练 ' + count + ' 次');
    }
}

function checkClassification() {
    if (!classifySet) return;
    let correct0 = 0;
    classifyBox0.forEach(item => { if (classifySet.items1.includes(item)) correct0++; });
    let correct1 = 0;
    classifyBox1.forEach(item => { if (classifySet.items2.includes(item)) correct1++; });
    const total = classifyBox0.length + classifyBox1.length;
    const correctTotal = correct0 + correct1;
    const accuracy = total > 0 ? correctTotal / (classifySet.items1.length + classifySet.items2.length) : 0;
    if (accuracy >= 0.7) { gameScore = Math.round(accuracy * 100); SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    document.getElementById('game-score').textContent = gameScore;
    const board = document.getElementById('game-board');
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (accuracy >= 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确率 ' + Math.round(accuracy * 100) + '%</div><button onclick="startClassification()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
}

function checkDiff(el, idx, correctIdx) {
    if (idx === correctIdx) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore+'/1'; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
        setTimeout(() => startDiff(), 500); 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkDigit(correct) {
    const input = document.getElementById('digit-input');
    if (input && input.value === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        window.showToast('正确！');
    } else {
        SoundEffects.playWrong(); // 错误音效
        window.showToast('错误，正确答案是 ' + correct);
    }
    setTimeout(() => startDigit(), 500);
}

function checkMathAnswer(answer) {
    const isCorrect = answer === mathCorrectAnswer;
    document.querySelectorAll('[id^="math-opt-"]').forEach(el => {
        const val = parseInt(el.textContent);
        el.style.background = val === mathCorrectAnswer ? '#43E97B' : (val === answer ? '#FF6B6B' : '#f5f7ff');
        el.style.color = (val === mathCorrectAnswer || val === answer) ? 'white' : '#333';
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startMathCalc(); }, 800);
}

function checkPattern(el, emoji) {
    if (el.textContent === '?' && patternCorrect.includes(emoji) && !patternFound.includes(emoji)) {
        el.textContent = emoji; el.style.background = '#f0f7ff'; patternFound.push(emoji);
        SoundEffects.playCorrect(); // 正确音效
        if (patternFound.length === patternCorrect.length) {
            gameScore++; document.getElementById('game-score').textContent = gameScore;
            if (gameScore >= 2) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
            }
            setTimeout(() => startPattern(), 500);
        }
    } else if (el.textContent === '?') { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => { el.textContent = '?'; el.style.background = 'white'; }, 300); 
    }
}

function checkReason(selected, correct) { 
    if (selected === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
    setTimeout(() => startReason(), 500); 
}

function checkShapeReason(index) {
    const option = shapeOptions[index];
    const correct = option.shape === shapePattern[shapeCorrect].shape && option.color === shapePattern[shapeCorrect].color;
    shapeOptions.forEach((s, i) => {
        const el = document.getElementById('shape-opt-' + i);
        const isCorrectOption = s.shape === shapePattern[shapeCorrect].shape && s.color === shapePattern[shapeCorrect].color;
        el.style.borderColor = isCorrectOption ? '#43E97B' : '#FF6B6B';
        el.style.pointerEvents = 'none';
    });
    if (correct) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startShapeReason(); }, 1000);
}

function checkSpaceRotate(answer, correct) {
    const isCorrect = answer === correct;
    document.querySelectorAll('[id^="space-opt-"]').forEach(el => {
        const val = el.textContent;
        el.style.borderColor = val === correct ? '#43E97B' : (val === answer && !isCorrect ? '#FF6B6B' : 'transparent');
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startSpaceRotate(); }, 1000);
}

function checkVisual(el, idx, targetIdx, targetColor) {
    if (idx === targetIdx) {
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 10) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        }
        setTimeout(() => startVisual(), 300);
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkWordAssoc(answer, catName) {
    const cat = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ].find(c => c.name === catName);
    const isCorrect = cat && cat.words.includes(answer);
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startWordAssociation(); }, 800);
}

function classifyItem(el, item) {
    el.remove();
    if (classifyBox0.length <= classifyBox1.length) {
        classifyBox0.push(item);
        document.getElementById('classify-box-0').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 0)" style="display:inline-block;padding:6px 10px;background:#667eea;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    } else {
        classifyBox1.push(item);
        document.getElementById('classify-box-1').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 1)" style="display:inline-block;padding:6px 10px;background:#FF6B6B;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    }
}

function unclassifyItem(el, item, box) {
    el.remove();
    if (box === 0) classifyBox0 = classifyBox0.filter(i => i !== item);
    else classifyBox1 = classifyBox1.filter(i => i !== item);
    const itemsDiv = document.getElementById('classify-items');
    if (itemsDiv) {
        const newEl = document.createElement('div');
        newEl.style.cssText = 'padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;';
        newEl.textContent = item;
        newEl.onclick = function() { classifyItem(this, item); };
        itemsDiv.appendChild(newEl);
    }
}

function findMatches() {
    const matches = new Set();
    // 横向
    for(let r=0;r<6;r++) {
        for(let c=0;c<4;c++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[r*6+c+1]&&v===elimBoard[r*6+c+2]) {
                matches.add(r*6+c);matches.add(r*6+c+1);matches.add(r*6+c+2);
            }
        }
    }
    // 纵向
    for(let c=0;c<6;c++) {
        for(let r=0;r<4;r++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[(r+1)*6+c]&&v===elimBoard[(r+2)*6+c]) {
                matches.add(r*6+c);matches.add((r+1)*6+c);matches.add((r+2)*6+c);
            }
        }
    }
    return [...matches];
}

function processMatches(matches) {
    elimScore += matches.length * 10;
    gameScore = elimScore;
    document.getElementById('game-score').textContent = elimScore;
    document.getElementById('elim-score').textContent = elimScore;
    
    matches.forEach(i => elimBoard[i] = -1);
    
    // 下落
    for(let c=0;c<6;c++) {
        let col = [];
        for(let r=5;r>=0;r--) if(elimBoard[r*6+c]>=0) col.push(elimBoard[r*6+c]);
        while(col.length<6) col.push(Math.floor(Math.random()*6));
        for(let r=5;r>=0;r--) elimBoard[r*6+c] = col[5-r];
    }
    
    setTimeout(()=>{
        const more = findMatches();
        if(more.length>0) processMatches(more);
        else renderElim();
    },300);
}

function clickAttention(index) {
    const expectedIndex = attentionSequence[attentionIndex].number - 1;
    const el = document.getElementById('att-item-' + index);
    if (index === expectedIndex) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        if (el) { el.textContent = attentionSequence[index].number; el.style.background = '#43E97B'; }
        SoundEffects.playCorrect();
        attentionIndex++;
        if (attentionIndex >= attentionSequence.length) setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startAttentionTrack(); }, 1000);
    } else {
        if (el) el.style.background = '#FF6B6B';
        SoundEffects.playWrong();
        setTimeout(() => { startAttentionTrack(); }, 1000);
    }
}

function clickElim(idx) {
    const el = document.getElementById('elim-'+idx);
    if(!el||elimBoard[idx]<0) return;
    
    if(elimSelected===null) {
        elimSelected = idx;
        el.style.transform = 'scale(1.1)';
    } else {
        const [r1,c1] = [Math.floor(elimSelected/6),elimSelected%6];
        const [r2,c2] = [Math.floor(idx/6),idx%6];
        
        if((Math.abs(r1-r2)===1&&c1===c2)||(Math.abs(c1-c2)===1&&r1===r2)) {
            // 交换
            [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
            const matches = findMatches();
            
            if(matches.length>0) {
                SoundEffects.playCorrect();
                processMatches(matches);
            } else {
                // 换回来
                [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
                SoundEffects.playWrong();
            }
        }
        
        document.getElementById('elim-'+elimSelected).style.transform = '';
        elimSelected = null;
        renderElim();
    }
}

function clickLink(idx) {
    const el = document.getElementById('link-'+idx);
    if(!el||el.style.background==='#ccc'||linkSelected.length>=2) return;
    
    linkSelected.push(idx);
    el.style.transform = 'scale(1.1)';
    
    if(linkSelected.length===2) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        
        const [i1,i2] = linkSelected;
        if(linkBoard[i1]===linkBoard[i2]&&canConnect(i1,i2)) {
            SoundEffects.playCorrect();
            setTimeout(()=>{
                document.getElementById('link-'+i1).style.background = '#ccc';
                document.getElementById('link-'+i2).style.background = '#ccc';
                document.getElementById('link-'+i1).style.pointerEvents = 'none';
                document.getElementById('link-'+i2).style.pointerEvents = 'none';
                linkPairs++;
                linkSelected = [];
                
                if(linkPairs===18) {
                    gameLevel++;
                    updateGameLevelBadge();
                    startLinkUp();
                }
            },200);
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                linkSelected.forEach(i=>{
                    const e = document.getElementById('link-'+i);
                    if(e) e.style.transform = '';
                });
                linkSelected = [];
            },500);
        }
    }
}

function shuffleSlide() {
    for(let i=0;i<100;i++) {
        const dirs = [];
        if(slideEmpty.x>0) dirs.push({x:-1,y:0});
        if(slideEmpty.x<3) dirs.push({x:1,y:0});
        if(slideEmpty.y>0) dirs.push({x:0,y:-1});
        if(slideEmpty.y<3) dirs.push({x:0,y:1});
        const d = dirs[Math.floor(Math.random()*dirs.length)];
        const nx = slideEmpty.x + d.x;
        const ny = slideEmpty.y + d.y;
        const idx = ny*4+nx;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x:nx,y:ny};
    }
    renderSlide();
}

function moveSlide(x,y) {
    if((Math.abs(x-slideEmpty.x)===1&&y===slideEmpty.y)||(Math.abs(y-slideEmpty.y)===1&&x===slideEmpty.x)) {
        const idx = y*4+x;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x,y};
        slideMoves++;
        gameScore = slideMoves;
        document.getElementById('game-score').textContent = slideMoves;
        renderSlide();
        
        if(isSolved()) {
            SoundEffects.playComplete();
            gameLevel++;
            updateGameLevelBadge();
            setTimeout(()=>startSlide(),1000);
        }
    }
}

function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }

function closeGame() { 
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }

function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }

function calculateDataStats() {
    const data = window.loadData();
    const user = window.getCurrentUserData();
    
    const stats = {
        totalUsers: data.users?.length || 0,
        totalStudyDays: 0,
        totalGamesPlayed: 0,
        totalMethodTraining: 0,
        totalThinkingTraining: 0,
        totalAIChats: 0,
        totalPoints: 0
    };
    
    if (data.users) {
        data.users.forEach(u => {
            // 学习天数
            if (u.studyDays) stats.totalStudyDays += Object.keys(u.studyDays).length;
            // 游戏次数
            if (u.gameCounts) stats.totalGamesPlayed += Object.values(u.gameCounts).reduce((a, b) => a + b, 0);
            // 学霸方法训练
            if (u.methodStats) {
                stats.totalMethodTraining += Object.values(u.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // 思维训练
            if (u.thinkingStats) {
                stats.totalThinkingTraining += Object.values(u.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // AI问答
            stats.totalAIChats += u.aiChatCount || 0;
            // 积分
            stats.totalPoints += u.points || 0;
        });
    }
    
    // 当前用户统计
    if (user) {
        stats.currentUser = {
            name: user.name,
            grade: gradeNames[user.grade],
            difficulty: user.difficulty,
            points: user.points || 0,
            gamesPlayed: user.gameCounts ? Object.values(user.gameCounts).reduce((a, b) => a + b, 0) : 0,
            methodCompleted: user.methodStats ? Object.values(user.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            thinkingCompleted: user.thinkingStats ? Object.values(user.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            streakDays: calculateStreakDays(user)
        };
    }
    
    return stats;
}


    name: 'games',
    icon: '🎮',
    render: typeof renderGames !== 'undefined' ? renderGames : null
};

// 导出主要函数
    startGame,
    exitGame,
    resetGame,
    checkSchulte,
    clickAttention,
    startAttentionSeq,
    checkDigit,
    checkPattern,
    checkMathAnswer,
    checkVisual,
    textMemoryStartTest,
    textMemoryCheck,
    textMemoryNext,
    checkWordAssoc,
    classifyItem,
    unclassifyItem,
    checkClassification,
    checkDiff,
    checkReason,
    checkShapeReason,
    checkSpaceRotate,
    playSound,
    shuffleSlide,
    tapTarget,
    reset2048,
    whackMole,
    startSchulte,
    startWhack,
    startSnake
};

console.log('[ES6 Module] games.js 模块加载完成');
window.renderGames = renderGames;


// ==================== Bundle 兼容性：辅助函数（挂载到window）====================
window.viewMethodNote = function(methodId) {
    if (!window.METHOD_NOTES) return;
    const note = window.METHOD_NOTES[methodId];
    const content = note ? `<div class="method-note-content">${note}</div>` : '<div class="empty-state"><p>暂无笔记</p></div>';
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>方法笔记</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.deleteMethodNote = function(methodId) {
    if (confirm('确定删除这条笔记吗？')) {
        if (window.METHOD_NOTES) {
            delete window.METHOD_NOTES[methodId];
        }
        alert('已删除');
    }
};

window.submitTopicAnswer = function(topicId) {
    const answerEl = document.getElementById(`topic-answer-${topicId}`);
    if (!answerEl) return;
    const answer = answerEl.value.trim();
    if (!answer) {
        alert('请输入答案');
        return;
    }
    alert('提交成功！');
};

window.closeDetail = function() {
    const panel = document.getElementById('detail-panel');
    if (panel) panel.style.display = 'none';
};

window.closeModal = function() {
    const modals = document.querySelectorAll('.modal-overlay, .modal-backdrop');
    modals.forEach(m => m.remove());
};

window.submitMethodAnswers = function() {
    alert('答案已提交！');
};

window.submitThinkingAnswers = function() {
    alert('思考答案已提交！');
};

window.selectThinkingOpt = function(btn, option) {
    const parent = btn.parentElement;
    if (parent) {
        parent.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    }
};

window.filterBooks = function(category) {
    if (!window.LIBRARY_BOOKS) return;
    const books = category === 'all'
        ? window.LIBRARY_BOOKS
        : window.LIBRARY_BOOKS.filter(b => b.category === category);
    renderLibraryBooks(books);
};

window.filterMethod = function(category) {
    if (!window.METHOD_DATA) return;
    renderMethodList(window.METHOD_DATA, category);
};

// 辅助函数：渲染图书馆书籍列表
function renderLibraryBooks(books) {
    const container = document.getElementById('library-books-list');
    if (!container) return;
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author || ''}</div>
            <div class="book-category">${book.category || ''}</div>
        </div>
    `).join('');
}

// 辅助函数：渲染方法列表
function renderMethodList(methods, category = 'all') {
    const container = document.getElementById('method-list-container');
    if (!container) return;
    const filtered = category === 'all'
        ? methods
        : methods.filter(m => m.category === category);
    container.innerHTML = filtered.map(method => `
        <div class="method-card">
            <div class="method-name">${method.name}</div>
            <div class="method-desc">${method.description || ''}</div>
        </div>
    `).join('');
}


// ==================== Bundle 兼容性：学习图书馆模块 ====================
// 学习图书馆渲染函数
window.renderLibraryModule = function(container) {
    // 确保 LIBRARY_BOOKS 存在
    if (!window.LIBRARY_BOOKS) {
        window.LIBRARY_BOOKS = [
            { id: 1, title: '学习之道', author: '芭芭拉·奥克利', category: '学习方法' },
            { id: 2, title: '刻意练习', author: '安德斯·艾利克森', category: '学习方法' },
            { id: 3, title: '认知天性', author: '彼得·布朗', category: '认知科学' },
            { id: 4, title: '思考，快与慢', author: '丹尼尔·卡尼曼', category: '思维方式' },
            { id: 5, title: '深度工作', author: '卡尔·纽波特', category: '效率提升' },
            { id: 6, title: '原子习惯', author: '詹姆斯·克利尔', category: '习惯养成' }
        ];
    }

    container.innerHTML = `
        <div style="padding:20px;">
            <h2 style="margin-bottom:20px;">📚 学习图书馆</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
                ${window.LIBRARY_BOOKS.map(book => `
                    <div style="background:white;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                        <div style="font-size:18px;font-weight:600;margin-bottom:8px;">${book.title}</div>
                        <div style="color:#666;margin-bottom:8px;">${book.author}</div>
                        <div style="display:inline-block;background:#e3f2fd;color:#1976d2;padding:4px 12px;border-radius:20px;font-size:12px;">
                            ${book.category}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

console.log('[Library] renderLibraryModule 已挂载到window');

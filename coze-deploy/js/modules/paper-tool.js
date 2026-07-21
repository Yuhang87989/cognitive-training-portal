// V392: 试卷工具 - 直接在试卷上手写 + 擦除笔迹

var _hwFontsLoaded = false;
function loadHWFonts() {
    if (_hwFontsLoaded) return;
    _hwFontsLoaded = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css';
    document.head.appendChild(link);
}

// ============= 试卷工具主界面 =============
window.renderPaperTool = function(container) {
    loadHWFonts();
    container.innerHTML = '';
    container.style.cssText = 'padding:0;background:#f5f5f5;min-height:100vh;';
    
    container.innerHTML = '\
    <div style="padding:12px;">\
        <div style="display:flex;gap:6px;margin-bottom:12px;">\
            <button id="pt-tab-write" onclick="window.ptSwitch(\'write\')" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#667eea,#764ba2);color:white;">✍️ 试卷手写</button>\
            <button id="pt-tab-erase" onclick="window.ptSwitch(\'erase\')" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:bold;cursor:pointer;background:#e0e0e0;color:#666;">🧹 擦除笔迹</button>\
        </div>\
        <div id="pt-write-panel"></div>\
        <div id="pt-erase-panel" style="display:none;"></div>\
    </div>';
    
    ptRenderWrite();
    ptRenderErase();
};

window.ptSwitch = function(tab) {
    var wBtn = document.getElementById('pt-tab-write');
    var eBtn = document.getElementById('pt-tab-erase');
    var wP = document.getElementById('pt-write-panel');
    var eP = document.getElementById('pt-erase-panel');
    if (tab === 'write') {
        wBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)'; wBtn.style.color = 'white';
        eBtn.style.background = '#e0e0e0'; eBtn.style.color = '#666';
        wP.style.display = 'block'; eP.style.display = 'none';
    } else {
        eBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)'; eBtn.style.color = 'white';
        wBtn.style.background = '#e0e0e0'; wBtn.style.color = '#666';
        eP.style.display = 'block'; wP.style.display = 'none';
    }
};

// ============= 试卷手写 =============

var _ptDrawing = false;
var _ptPenColor = '#1a1a6e';
var _ptPenSize = 2;
var _ptTool = 'pen';
var _ptPaperImg = null;
var _ptStrokes = [];
var _ptCurrentStroke = [];
var _ptCtx = null;

function ptRenderWrite() {
    var p = document.getElementById('pt-write-panel');
    if (!p) return;
    p.innerHTML = '\
    <div style="background:white;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div id="pt-upload-area" onclick="document.getElementById(\'pt-paper-file\').click()" style="border:2px dashed #c0c0c0;border-radius:10px;padding:24px;text-align:center;cursor:pointer;background:#fafafa;">\
            <div style="font-size:28px;">📄</div>\
            <div style="font-size:14px;color:#888;margin-top:4px;">上传试卷图片，直接在上面写字</div>\
            <div style="font-size:12px;color:#aaa;margin-top:2px;">拍照或从相册选择</div>\
        </div>\
        <input type="file" id="pt-paper-file" accept="image/*" style="display:none;" onchange="window.ptLoadPaper(event)">\
    </div>\
    \
    <div id="pt-toolbar" style="display:none;background:white;border-radius:12px;padding:10px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">\
            <button id="pt-btn-pen" onclick="window.ptSetTool(\'pen\')" style="padding:8px 12px;border:none;border-radius:8px;font-size:13px;cursor:pointer;background:#667eea;color:white;font-weight:bold;">✏️ 笔</button>\
            <button id="pt-btn-eraser" onclick="window.ptSetTool(\'eraser\')" style="padding:8px 12px;border:none;border-radius:8px;font-size:13px;cursor:pointer;background:#f0f0f0;color:#666;">🧹 橡皮</button>\
            <div style="width:1px;height:24px;background:#e0e0e0;"></div>\
            <button onclick="window.ptSetColor(\'#1a1a6e\')" style="width:28px;height:28px;border-radius:50%;border:2px solid #1a1a6e;background:#1a1a6e;cursor:pointer;" title="蓝笔"></button>\
            <button onclick="window.ptSetColor(\'#1a1a1a\')" style="width:28px;height:28px;border-radius:50%;border:2px solid #1a1a1a;background:#1a1a1a;cursor:pointer;" title="黑笔"></button>\
            <button onclick="window.ptSetColor(\'#cc0000\')" style="width:28px;height:28px;border-radius:50%;border:2px solid #cc0000;background:#cc0000;cursor:pointer;" title="红笔"></button>\
            <div style="width:1px;height:24px;background:#e0e0e0;"></div>\
            <div style="display:flex;align-items:center;gap:4px;">\
                <span style="font-size:12px;color:#888;">粗细</span>\
                <input type="range" id="pt-pen-size" min="1" max="8" value="2" style="width:60px;" oninput="_ptPenSize=parseInt(this.value)">\
            </div>\
            <div style="flex:1;"></div>\
            <button onclick="window.ptUndo()" style="padding:6px 10px;border:1px solid #ddd;border-radius:8px;background:white;font-size:12px;cursor:pointer;">↩️ 撤销</button>\
            <button onclick="window.ptClearStrokes()" style="padding:6px 10px;border:1px solid #ddd;border-radius:8px;background:white;font-size:12px;cursor:pointer;">🗑️ 清除</button>\
        </div>\
    </div>\
    \
    <div id="pt-canvas-area" style="display:none;position:relative;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);touch-action:none;">\
        <canvas id="pt-paper-canvas" style="display:block;width:100%;"></canvas>\
    </div>\
    \
    <div id="pt-download-bar" style="display:none;margin-top:10px;">\
        <button onclick="window.ptDownloadPaper()" style="width:100%;padding:12px;background:linear-gradient(135deg,#4caf50,#2e7d32);color:white;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;">📥 下载写好的试卷</button>\
    </div>';
}

window.ptLoadPaper = function(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            _ptPaperImg = img;
            _ptStrokes = [];
            var canvas = document.getElementById('pt-paper-canvas');
            var maxW = 800;
            var scale = img.width > maxW ? maxW / img.width : 1;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            _ptCtx = canvas.getContext('2d');
            _ptCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
            document.getElementById('pt-toolbar').style.display = 'block';
            document.getElementById('pt-canvas-area').style.display = 'block';
            document.getElementById('pt-download-bar').style.display = 'block';
            document.getElementById('pt-upload-area').innerHTML = '<div style="font-size:13px;color:#4caf50;">✅ 试卷已加载，点击可更换</div>';
            canvas.onmousedown = function(e2) { ptStartDraw(e2); };
            canvas.onmousemove = function(e2) { ptMoveDraw(e2); };
            canvas.onmouseup = function(e2) { ptEndDraw(e2); };
            canvas.onmouseleave = function(e2) { ptEndDraw(e2); };
            canvas.ontouchstart = function(e2) { e2.preventDefault(); ptStartDraw(e2.touches[0]); };
            canvas.ontouchmove = function(e2) { e2.preventDefault(); ptMoveDraw(e2.touches[0]); };
            canvas.ontouchend = function(e2) { e2.preventDefault(); ptEndDraw(e2); };
        };
        img.src = e.target.result;
    };
    r.readAsDataURL(f);
};

function ptGetPos(e) {
    var canvas = document.getElementById('pt-paper-canvas');
    var rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function ptStartDraw(e) {
    _ptDrawing = true;
    var pos = ptGetPos(e);
    _ptCurrentStroke = [{x:pos.x, y:pos.y, color:_ptPenColor, size:_ptPenSize, tool:_ptTool}];
}

function ptMoveDraw(e) {
    if (!_ptDrawing) return;
    var pos = ptGetPos(e);
    var point = {x:pos.x, y:pos.y, color:_ptPenColor, size:_ptPenSize, tool:_ptTool};
    _ptCurrentStroke.push(point);
    var ctx = _ptCtx;
    if (_ptCurrentStroke.length >= 2) {
        var prev = _ptCurrentStroke[_ptCurrentStroke.length - 2];
        var curr = _ptCurrentStroke[_ptCurrentStroke.length - 1];
        ptDrawSegment(ctx, prev, curr);
    }
}

function ptEndDraw() {
    if (!_ptDrawing) return;
    _ptDrawing = false;
    if (_ptCurrentStroke.length > 0) {
        _ptStrokes.push(_ptCurrentStroke.slice());
        _ptCurrentStroke = [];
    }
}

function ptDrawSegment(ctx, from, to) {
    ctx.save();
    if (from.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(to.x, to.y, from.size * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (_ptPaperImg) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.drawImage(_ptPaperImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }
    } else {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = from.color;
        ctx.lineWidth = from.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    ctx.restore();
}

function ptRedrawAll() {
    if (!_ptCtx || !_ptPaperImg) return;
    var ctx = _ptCtx;
    var canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(_ptPaperImg, 0, 0, canvas.width, canvas.height);
    for (var s = 0; s < _ptStrokes.length; s++) {
        var stroke = _ptStrokes[s];
        for (var i = 1; i < stroke.length; i++) {
            ptDrawSegment(ctx, stroke[i-1], stroke[i]);
        }
    }
}

window.ptSetTool = function(tool) {
    _ptTool = tool;
    var penBtn = document.getElementById('pt-btn-pen');
    var erBtn = document.getElementById('pt-btn-eraser');
    if (tool === 'pen') {
        penBtn.style.background = '#667eea'; penBtn.style.color = 'white';
        erBtn.style.background = '#f0f0f0'; erBtn.style.color = '#666';
    } else {
        erBtn.style.background = '#667eea'; erBtn.style.color = 'white';
        penBtn.style.background = '#f0f0f0'; penBtn.style.color = '#666';
    }
};

window.ptSetColor = function(color) {
    _ptPenColor = color;
    _ptTool = 'pen';
    window.ptSetTool('pen');
};

window.ptUndo = function() {
    if (_ptStrokes.length === 0) return;
    _ptStrokes.pop();
    ptRedrawAll();
};

window.ptClearStrokes = function() {
    if (_ptStrokes.length === 0) return;
    if (!confirm('确定清除所有手写内容？')) return;
    _ptStrokes = [];
    ptRedrawAll();
};

window.ptDownloadPaper = function() {
    var canvas = document.getElementById('pt-paper-canvas');
    if (!canvas) return;
    var a = document.createElement('a');
    a.download = '试卷_' + Date.now() + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
};

// ============= 试卷擦除 =============

var _erImg = null, _erColor = null;

function ptRenderErase() {
    var p = document.getElementById('pt-erase-panel');
    if (!p) return;
    p.innerHTML = '\
    <div style="background:white;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:10px;">📷 上传已做的试卷</div>\
        <div id="pt-er-upload" onclick="document.getElementById(\'pt-er-file\').click()" style="border:2px dashed #c0c0c0;border-radius:10px;padding:24px;text-align:center;cursor:pointer;background:#fafafa;">\
            <div style="font-size:28px;">📤</div><div style="font-size:14px;color:#888;margin-top:4px;">上传有笔迹的试卷</div>\
        </div>\
        <input type="file" id="pt-er-file" accept="image/*" style="display:none;" onchange="window.ptErLoad(event)">\
    </div>\
    <div id="pt-er-ctrl" style="display:none;">\
        <div style="background:white;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
            <div style="font-size:14px;font-weight:bold;color:#333;margin-bottom:8px;">🎯 擦除设置</div>\
            <div style="font-size:12px;color:#666;margin-bottom:6px;">点击原图选颜色，或用快捷按钮</div>\
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">\
                <div id="pt-er-clr" style="width:24px;height:24px;border-radius:6px;border:2px solid #ccc;background:#ccc;"></div>\
                <span id="pt-er-txt" style="font-size:12px;color:#888;">未选择</span>\
                <button onclick="_erColor=null;document.getElementById(\'pt-er-clr\').style.background=\'#ccc\';document.getElementById(\'pt-er-txt\').textContent=\'未选择\'" style="padding:3px 8px;border:1px solid #ddd;border-radius:6px;background:white;font-size:11px;cursor:pointer;">重选</button>\
            </div>\
            <div style="margin-bottom:8px;"><div style="font-size:12px;color:#666;">容差 <span id="pt-er-tol-v">40</span></div><input type="range" id="pt-er-tol" min="10" max="100" value="40" style="width:100%;" oninput="document.getElementById(\'pt-er-tol-v\').textContent=this.value"></div>\
            <div style="display:flex;gap:6px;">\
                <button onclick="window.ptErQuick(\'blue\')" style="padding:5px 10px;border:1px solid #ddd;border-radius:6px;background:#e8e8ff;font-size:12px;cursor:pointer;">🔵蓝笔</button>\
                <button onclick="window.ptErQuick(\'red\')" style="padding:5px 10px;border:1px solid #ddd;border-radius:6px;background:#ffe8e8;font-size:12px;cursor:pointer;">🔴红笔</button>\
                <button onclick="window.ptErQuick(\'black\')" style="padding:5px 10px;border:1px solid #ddd;border-radius:6px;background:#f0f0f0;font-size:12px;cursor:pointer;">⚫黑笔</button>\
            </div>\
        </div>\
        <button onclick="window.ptErDo()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:white;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:10px;">🧹 擦除笔迹</button>\
        <div style="background:white;border-radius:12px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">\
                <span style="font-size:14px;font-weight:bold;color:#333;">对比</span>\
                <button id="pt-er-dl" onclick="window.ptErDown()" style="padding:5px 12px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:12px;cursor:pointer;display:none;">📥 下载</button>\
            </div>\
            <div style="display:flex;gap:4px;">\
                <div style="flex:1;text-align:center;"><div style="font-size:11px;color:#888;margin-bottom:2px;">原图</div><canvas id="pt-er-src" style="width:100%;border:1px solid #eee;border-radius:6px;"></canvas></div>\
                <div style="flex:1;text-align:center;"><div style="font-size:11px;color:#888;margin-bottom:2px;">擦除后</div><canvas id="pt-er-dst" style="width:100%;border:1px solid #eee;border-radius:6px;"></canvas></div>\
            </div>\
        </div>\
    </div>';
}

window.ptErLoad = function(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            _erImg = img;
            var c = document.getElementById('pt-er-src');
            var s = img.width > 800 ? 800/img.width : 1;
            c.width = img.width*s; c.height = img.height*s;
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            var d = document.getElementById('pt-er-dst');
            d.width = c.width; d.height = c.height;
            d.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            c.onclick = function(e2) {
                var rect = c.getBoundingClientRect();
                var px = c.getContext('2d').getImageData(Math.floor((e2.clientX-rect.left)*(c.width/rect.width)), Math.floor((e2.clientY-rect.top)*(c.height/rect.height)), 1, 1).data;
                _erColor = {r:px[0],g:px[1],b:px[2]};
                var hex = '#'+((1<<24)+(px[0]<<16)+(px[1]<<8)+px[2]).toString(16).slice(1);
                document.getElementById('pt-er-clr').style.background = hex;
                document.getElementById('pt-er-txt').textContent = hex;
            };
            document.getElementById('pt-er-ctrl').style.display = 'block';
            document.getElementById('pt-er-upload').innerHTML = '<div style="font-size:13px;color:#4caf50;">✅ 已加载</div>';
        };
        img.src = e.target.result;
    };
    r.readAsDataURL(f);
};

window.ptErQuick = function(t) {
    if (t==='blue') _erColor={r:30,g:30,b:140};
    else if (t==='red') _erColor={r:200,g:30,b:30};
    else _erColor={r:30,g:30,b:30};
    var hex = '#'+((1<<24)+(_erColor.r<<16)+(_erColor.g<<8)+_erColor.b).toString(16).slice(1);
    document.getElementById('pt-er-clr').style.background = hex;
    document.getElementById('pt-er-txt').textContent = hex + ' (快捷)';
};

window.ptErDo = function() {
    if (!_erImg) { alert('请先上传图片'); return; }
    if (!_erColor) { alert('请选择要擦除的颜色'); return; }
    var tol = parseInt(document.getElementById('pt-er-tol').value);
    var c = document.getElementById('pt-er-dst');
    var sc = document.getElementById('pt-er-src');
    var ctx = c.getContext('2d');
    ctx.drawImage(_erImg, 0, 0, c.width, c.height);
    var id = ctx.getImageData(0, 0, c.width, c.height);
    var d = id.data;
    var tr=_erColor.r, tg=_erColor.g, tb=_erColor.b, ts=tol*tol;
    var br=0,bg2=0,bb=0,bn=0;
    [[5,5],[c.width-6,5],[5,c.height-6],[c.width-6,c.height-6]].forEach(function(p){
        var s=sc.getContext('2d').getImageData(p[0],p[1],1,1).data;
        if((s[0]-tr)*(s[0]-tr)+(s[1]-tg)*(s[1]-tg)+(s[2]-tb)*(s[2]-tb)>ts){br+=s[0];bg2+=s[1];bb+=s[2];bn++;}
    });
    if(!bn){br=250;bg2=250;bb=248;}else{br=Math.round(br/bn);bg2=Math.round(bg2/bn);bb=Math.round(bb/bn);}
    for(var i=0;i<d.length;i+=4){
        var dist=(d[i]-tr)*(d[i]-tr)+(d[i+1]-tg)*(d[i+1]-tg)+(d[i+2]-tb)*(d[i+2]-tb);
        if(dist<ts){
            var ratio=dist/ts;
            if(ratio<0.3){d[i]=br;d[i+1]=bg2;d[i+2]=bb;}
            else{var bl=(ratio-0.3)/0.7;d[i]=Math.round(d[i]*bl+br*(1-bl));d[i+1]=Math.round(d[i+1]*bl+bg2*(1-bl));d[i+2]=Math.round(d[i+2]*bl+bb*(1-bl));}
        }
    }
    ctx.putImageData(id,0,0);
    document.getElementById('pt-er-dl').style.display='inline-block';
};

window.ptErDown = function() {
    var c = document.getElementById('pt-er-dst'); if(!c) return;
    var a = document.createElement('a'); a.download='擦除试卷_'+Date.now()+'.png'; a.href=c.toDataURL('image/png'); a.click();
};

console.log('[V392] 试卷工具模块加载完成');

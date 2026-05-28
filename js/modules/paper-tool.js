// V390: 试卷工具 - 仿真手写 + 试卷擦除（嵌入模拟考试模块）

// ============= 手写字体加载 =============
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
    <div style="padding:16px;">\
        <div style="display:flex;gap:8px;margin-bottom:16px;">\
            <button id="pt-tab-hw" onclick="window.ptSwitch(\'hw\')" style="flex:1;padding:12px;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#667eea,#764ba2);color:white;">✍️ 文字转手写</button>\
            <button id="pt-tab-er" onclick="window.ptSwitch(\'er\')" style="flex:1;padding:12px;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;background:#e0e0e0;color:#666;">🧹 试卷擦除</button>\
        </div>\
        <div id="pt-hw-panel"></div>\
        <div id="pt-er-panel" style="display:none;"></div>\
    </div>';
    
    ptRenderHW();
    ptRenderER();
};

window.ptSwitch = function(tab) {
    var hwBtn = document.getElementById('pt-tab-hw');
    var erBtn = document.getElementById('pt-tab-er');
    var hwP = document.getElementById('pt-hw-panel');
    var erP = document.getElementById('pt-er-panel');
    if (tab === 'hw') {
        hwBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)'; hwBtn.style.color = 'white';
        erBtn.style.background = '#e0e0e0'; erBtn.style.color = '#666';
        hwP.style.display = 'block'; erP.style.display = 'none';
    } else {
        erBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)'; erBtn.style.color = 'white';
        hwBtn.style.background = '#e0e0e0'; hwBtn.style.color = '#666';
        erP.style.display = 'block'; hwP.style.display = 'none';
    }
};

// ============= 文字转手写 =============
function ptRenderHW() {
    var p = document.getElementById('pt-hw-panel');
    if (!p) return;
    p.innerHTML = '\
    <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:10px;">📝 输入文字</div>\
        <textarea id="pt-text" rows="4" placeholder="输入要转换的文字..." style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:14px;box-sizing:border-box;resize:vertical;">春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。</textarea>\
    </div>\
    <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:10px;">⚙️ 设置</div>\
        <div style="margin-bottom:8px;">\
            <select id="pt-font" style="width:100%;padding:10px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px;">\
                <option value="LXGW WenKai">霞鹜文楷（推荐）</option>\
                <option value="KaiTi, STKaiti, serif">系统楷体</option>\
            </select>\
        </div>\
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">\
            <div><div style="font-size:12px;color:#666;">字号 <span id="pt-sz-v">28</span>px</div><input type="range" id="pt-sz" min="16" max="48" value="28" style="width:100%;" oninput="document.getElementById(\'pt-sz-v\').textContent=this.value"></div>\
            <div><div style="font-size:12px;color:#666;">行距 <span id="pt-ln-v">50</span>px</div><input type="range" id="pt-ln" min="30" max="80" value="50" style="width:100%;" oninput="document.getElementById(\'pt-ln-v\').textContent=this.value"></div>\
            <div><div style="font-size:12px;color:#666;">间距 <span id="pt-sp-v">2</span>px</div><input type="range" id="pt-sp" min="0" max="15" value="2" style="width:100%;" oninput="document.getElementById(\'pt-sp-v\').textContent=this.value"></div>\
            <div><div style="font-size:12px;color:#666;">扰动 <span id="pt-pb-v">3</span></div><input type="range" id="pt-pb" min="0" max="8" value="3" style="width:100%;" oninput="document.getElementById(\'pt-pb-v\').textContent=this.value"></div>\
        </div>\
        <div style="margin-top:8px;display:flex;gap:8px;">\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-clr" value="#1a1a6e" checked> 🔵蓝笔</label>\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-clr" value="#1a1a1a"> ⚫黑笔</label>\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-clr" value="#cc0000"> 🔴红笔</label>\
        </div>\
        <div style="margin-top:8px;display:flex;gap:8px;">\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-bg" value="white" checked> 白纸</label>\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-bg" value="lined"> 横线纸</label>\
            <label style="cursor:pointer;font-size:13px;"><input type="radio" name="pt-bg" value="grid"> 方格纸</label>\
        </div>\
    </div>\
    <button onclick="window.ptGenHW()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;margin-bottom:12px;">✍️ 生成手写</button>\
    <div id="pt-hw-preview" style="background:white;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);display:none;">\
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">\
            <span style="font-size:15px;font-weight:bold;color:#333;">👁️ 预览</span>\
            <button onclick="window.ptDownHW()" style="padding:6px 14px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">📥 下载</button>\
        </div>\
        <canvas id="pt-canvas" style="width:100%;border:1px solid #eee;border-radius:8px;"></canvas>\
    </div>';
}

window.ptGenHW = function() {
    var text = document.getElementById('pt-text').value.trim();
    if (!text) { alert('请输入文字'); return; }
    
    var ff = document.getElementById('pt-font').value;
    var sz = parseInt(document.getElementById('pt-sz').value);
    var ln = parseInt(document.getElementById('pt-ln').value);
    var sp = parseInt(document.getElementById('pt-sp').value);
    var pb = parseInt(document.getElementById('pt-pb').value);
    var clr = (document.querySelector('input[name="pt-clr"]:checked') || {}).value || '#1a1a6e';
    var bg = (document.querySelector('input[name="pt-bg"]:checked') || {}).value || 'white';
    
    var canvas = document.getElementById('pt-canvas');
    document.getElementById('pt-hw-preview').style.display = 'block';
    
    var W = 600, ML = 50, MT = 60, MR = 40, MW = W - ML - MR;
    var ctx = canvas.getContext('2d');
    ctx.font = sz + 'px "' + ff + '"';
    
    // 分行
    var lines = [];
    text.split('\n').forEach(function(para) {
        if (!para) { lines.push(''); return; }
        var cur = '';
        for (var i = 0; i < para.length; i++) {
            var test = cur + para[i];
            if (ctx.measureText(test).width > MW && cur) { lines.push(cur); cur = para[i]; }
            else cur = test;
        }
        if (cur) lines.push(cur);
    });
    
    var H = MT + lines.length * ln + 60;
    canvas.width = W; canvas.height = H;
    
    // 背景
    ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, W, H);
    if (bg === 'lined') {
        ctx.strokeStyle = '#d0d0e8'; ctx.lineWidth = 0.5;
        for (var y = MT; y < H - 30; y += ln) { ctx.beginPath(); ctx.moveTo(40, y+ln-2); ctx.lineTo(W-30, y+ln-2); ctx.stroke(); }
        ctx.strokeStyle = '#e8a0a0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(45, 30); ctx.lineTo(45, H-20); ctx.stroke();
    } else if (bg === 'grid') {
        ctx.strokeStyle = '#c8d8e8'; ctx.lineWidth = 0.5;
        var gs = sz + 6;
        for (var x = 50; x < W-30; x += gs) { ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, H-20); ctx.stroke(); }
        for (var y = 60; y < H-20; y += gs) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W-30, y); ctx.stroke(); }
    }
    
    // 逐字手写
    ctx.textBaseline = 'top';
    for (var l = 0; l < lines.length; l++) {
        var line = lines[l]; if (!line) continue;
        var x = ML, y = MT + l * ln;
        for (var c = 0; c < line.length; c++) {
            var dx = (Math.random()-0.5)*pb, dy = (Math.random()-0.5)*pb*0.6;
            var ang = (Math.random()-0.5)*pb*0.008, sv = 1+(Math.random()-0.5)*pb*0.02;
            ctx.globalAlpha = 0.85+Math.random()*0.15;
            ctx.fillStyle = clr;
            ctx.save(); ctx.translate(x+dx, y+dy); ctx.rotate(ang); ctx.scale(sv, sv);
            ctx.font = sz + 'px "' + ff + '"'; ctx.fillText(line[c], 0, 0);
            ctx.restore();
            ctx.font = sz + 'px "' + ff + '"'; x += ctx.measureText(line[c]).width + sp + (Math.random()-0.3)*1.5;
        }
    }
    ctx.globalAlpha = 1;
    document.getElementById('pt-hw-preview').scrollIntoView({behavior:'smooth'});
};

window.ptDownHW = function() {
    var c = document.getElementById('pt-canvas'); if (!c) return;
    var a = document.createElement('a'); a.download = '手写_' + Date.now() + '.png'; a.href = c.toDataURL('image/png'); a.click();
};

// ============= 试卷擦除 =============
var _erImg = null, _erColor = null;

function ptRenderER() {
    var p = document.getElementById('pt-er-panel');
    if (!p) return;
    p.innerHTML = '\
    <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
        <div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:10px;">📷 上传试卷</div>\
        <div id="pt-upload" onclick="document.getElementById(\'pt-file\').click()" style="border:2px dashed #c0c0c0;border-radius:10px;padding:30px;text-align:center;cursor:pointer;background:#fafafa;">\
            <div style="font-size:30px;">📤</div><div style="font-size:14px;color:#888;margin-top:4px;">点击上传试卷图片</div>\
        </div>\
        <input type="file" id="pt-file" accept="image/*" style="display:none;" onchange="window.ptLoadImg(event)">\
    </div>\
    <div id="pt-er-ctrl" style="display:none;">\
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
            <div style="font-size:15px;font-weight:bold;color:#333;margin-bottom:10px;">🎯 擦除设置</div>\
            <div style="font-size:13px;color:#666;margin-bottom:6px;">点击原图选择要擦除的笔迹颜色</div>\
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">\
                <div id="pt-clr-box" style="width:28px;height:28px;border-radius:6px;border:2px solid #ccc;background:#ccc;"></div>\
                <span id="pt-clr-txt" style="font-size:13px;color:#888;">未选择</span>\
                <button onclick="_erColor=null;document.getElementById(\'pt-clr-box\').style.background=\'#ccc\';document.getElementById(\'pt-clr-txt\').textContent=\'未选择\'" style="padding:4px 8px;border:1px solid #ddd;border-radius:6px;background:white;font-size:12px;cursor:pointer;">重选</button>\
            </div>\
            <div style="margin-bottom:8px;"><div style="font-size:12px;color:#666;">容差 <span id="pt-tol-v">40</span></div><input type="range" id="pt-tol" min="10" max="100" value="40" style="width:100%;" oninput="document.getElementById(\'pt-tol-v\').textContent=this.value"></div>\
            <div style="display:flex;gap:8px;">\
                <button onclick="window.ptQuickClr(\'blue\')" style="padding:6px 12px;border:1px solid #ddd;border-radius:8px;background:#e8e8ff;font-size:13px;cursor:pointer;">🔵擦蓝笔</button>\
                <button onclick="window.ptQuickClr(\'red\')" style="padding:6px 12px;border:1px solid #ddd;border-radius:8px;background:#ffe8e8;font-size:13px;cursor:pointer;">🔴擦红笔</button>\
                <button onclick="window.ptQuickClr(\'black\')" style="padding:6px 12px;border:1px solid #ddd;border-radius:8px;background:#f0f0f0;font-size:13px;cursor:pointer;">⚫擦黑笔</button>\
            </div>\
        </div>\
        <button onclick="window.ptErase()" style="width:100%;padding:14px;background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;margin-bottom:12px;">🧹 开始擦除</button>\
        <div style="background:white;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">\
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">\
                <span style="font-size:15px;font-weight:bold;color:#333;">📋 对比</span>\
                <button id="pt-dl-er" onclick="window.ptDownER()" style="padding:6px 14px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;display:none;">📥 下载</button>\
            </div>\
            <div style="display:flex;gap:6px;">\
                <div style="flex:1;text-align:center;"><div style="font-size:12px;color:#888;margin-bottom:4px;">原图</div><canvas id="pt-src" style="width:100%;border:1px solid #eee;border-radius:6px;"></canvas></div>\
                <div style="flex:1;text-align:center;"><div style="font-size:12px;color:#888;margin-bottom:4px;">擦除后</div><canvas id="pt-dst" style="width:100%;border:1px solid #eee;border-radius:6px;"></canvas></div>\
            </div>\
        </div>\
    </div>';
}

window.ptLoadImg = function(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            _erImg = img;
            var c = document.getElementById('pt-src');
            var s = img.width > 800 ? 800/img.width : 1;
            c.width = img.width*s; c.height = img.height*s;
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            var d = document.getElementById('pt-dst');
            d.width = c.width; d.height = c.height;
            d.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            c.onclick = function(e2) {
                var rect = c.getBoundingClientRect();
                var px = c.getContext('2d').getImageData(Math.floor((e2.clientX-rect.left)*(c.width/rect.width)), Math.floor((e2.clientY-rect.top)*(c.height/rect.height)), 1, 1).data;
                _erColor = {r:px[0],g:px[1],b:px[2]};
                var hex = '#'+((1<<24)+(px[0]<<16)+(px[1]<<8)+px[2]).toString(16).slice(1);
                document.getElementById('pt-clr-box').style.background = hex;
                document.getElementById('pt-clr-txt').textContent = hex;
            };
            document.getElementById('pt-er-ctrl').style.display = 'block';
            document.getElementById('pt-upload').innerHTML = '<div style="font-size:14px;color:#4caf50;">✅ 已加载，点击重新上传</div>';
        };
        img.src = e.target.result;
    };
    r.readAsDataURL(f);
};

window.ptQuickClr = function(t) {
    if (t==='blue') _erColor={r:30,g:30,b:140};
    else if (t==='red') _erColor={r:200,g:30,b:30};
    else _erColor={r:30,g:30,b:30};
    var hex = '#'+((1<<24)+(_erColor.r<<16)+(_erColor.g<<8)+_erColor.b).toString(16).slice(1);
    document.getElementById('pt-clr-box').style.background = hex;
    document.getElementById('pt-clr-txt').textContent = hex + ' (快捷)';
};

window.ptErase = function() {
    if (!_erImg) { alert('请先上传图片'); return; }
    if (!_erColor) { alert('请先选择要擦除的颜色'); return; }
    
    var tol = parseInt(document.getElementById('pt-tol').value);
    var c = document.getElementById('pt-dst');
    var sc = document.getElementById('pt-src');
    var ctx = c.getContext('2d');
    ctx.drawImage(_erImg, 0, 0, c.width, c.height);
    var id = ctx.getImageData(0, 0, c.width, c.height);
    var d = id.data;
    var tr=_erColor.r, tg=_erColor.g, tb=_erColor.b, ts=tol*tol;
    
    // 取四角采样背景色
    var br=0,bg=0,bb=0,bn=0;
    [[5,5],[c.width-6,5],[5,c.height-6],[c.width-6,c.height-6]].forEach(function(p){
        var s=sc.getContext('2d').getImageData(p[0],p[1],1,1).data;
        if((s[0]-tr)*(s[0]-tr)+(s[1]-tg)*(s[1]-tg)+(s[2]-tb)*(s[2]-tb)>ts){br+=s[0];bg+=s[1];bb+=s[2];bn++;}
    });
    if(!bn){br=250;bg=250;bb=248;}else{br=Math.round(br/bn);bg=Math.round(bg/bn);bb=Math.round(bb/bn);}
    
    for(var i=0;i<d.length;i+=4){
        var dist=(d[i]-tr)*(d[i]-tr)+(d[i+1]-tg)*(d[i+1]-tg)+(d[i+2]-tb)*(d[i+2]-tb);
        if(dist<ts){
            var ratio=dist/ts;
            if(ratio<0.3){d[i]=br;d[i+1]=bg;d[i+2]=bb;}
            else{var bl=(ratio-0.3)/0.7;d[i]=Math.round(d[i]*bl+br*(1-bl));d[i+1]=Math.round(d[i+1]*bl+bg*(1-bl));d[i+2]=Math.round(d[i+2]*bl+bb*(1-bl));}
        }
    }
    ctx.putImageData(id,0,0);
    document.getElementById('pt-dl-er').style.display='inline-block';
};

window.ptDownER = function() {
    var c = document.getElementById('pt-dst'); if(!c) return;
    var a = document.createElement('a'); a.download='擦除试卷_'+Date.now()+'.png'; a.href=c.toDataURL('image/png'); a.click();
};

console.log('[V390] 试卷工具模块加载完成');

// 版本: V144

CTM.registerModule('map', {
    name: 'map',
    icon: '🎯',
    render: renderMap
});

function renderMap(container) {
    let assess = null;
    try { assess = JSON.parse(localStorage.getItem('cognitive_assessment') || 'null'); } catch(e) { assess = null; }
    let banner = '';
    if (assess) {
        const d = new Date(assess.date);
        banner = `<div style="background:linear-gradient(135deg,#eef2ff,#f5f3ff);border-radius:12px;padding:12px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:24px;">🧩</span>
            <div style="flex:1;font-size:13px;color:#4b5563;">已建立能力基线（${d.getMonth()+1}月${d.getDate()}日 · 第${assess.times||1}次测评）</div>
            <button onclick="openFullscreenPage('assessment')" style="border:none;background:#667eea;color:#fff;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;">重新测评</button>
        </div>`;
    } else {
        banner = `<div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fdba74;border-radius:12px;padding:14px;margin-bottom:14px;">
            <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:4px;">🎉 第一次使用？花 5 分钟做个能力测评</div>
            <div style="font-size:12px;color:#9a3412;opacity:.85;margin-bottom:10px;">测出孩子六维能力基线，获得专属训练推荐，比盲练更有效</div>
            <button onclick="openFullscreenPage('assessment')" style="border:none;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;">开始能力测评 🧩</button>
        </div>`;
    }
    container.innerHTML = `
        ${banner}
        <div class="card">
            <h3 style="margin-bottom:12px;">🧠 认知地图 - 六维能力分析</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">基于测评基线与学习数据，绘制专属认知能力雷达图</p>
            <div id="radar-container"></div>
            <div id="rehab-progress-box" style="margin-top:16px;"></div>
            <div id="as-recommend-box" style="margin-top:16px;"></div>
        </div>
    `;
    setTimeout(() => {
        const radarContainer = document.getElementById('radar-container');
        if (radarContainer) renderCognitiveRadar(radarContainer);
        renderRehabProgress(document.getElementById('rehab-progress-box'));
        renderRecommendBox(document.getElementById('as-recommend-box'));
    }, 100);
}

// V449: 康复进步区块——六维快照趋势（快照随主档案云同步，换设备不丢）
function renderRehabProgress(box) {
    if (!box) return;
    if (typeof window.recordAbilitySnapshot === 'function') window.recordAbilitySnapshot(true);
    var user = null;
    try { user = window.getCurrentUserData && window.getCurrentUserData(); } catch(e) {}
    var snaps = (user && user.abilitySnapshots) || [];
    if (!snaps.length) {
        box.innerHTML = `<div style="background:#f5f6fb;border-radius:12px;padding:16px;text-align:center;font-size:13px;color:#6b7280;">
            🌱 完成一次训练游戏后，这里会开始记录能力进步曲线</div>`;
        return;
    }
    var first = snaps[0], last = snaps[snaps.length - 1];
    var dAvg = last.avg - first.avg;
    var dims = [
        {k:'a', name:'专注力', icon:'🎯'}, {k:'m', name:'记忆力', icon:'🧠'},
        {k:'th', name:'思维力', icon:'💡'}, {k:'r', name:'反应力', icon:'⚡'},
        {k:'p', name:'坚持力', icon:'🏃'}, {k:'me', name:'元认知', icon:'🔮'}
    ];
    var counts = (user && user.gameCounts) || {};
    var times = (user && user.gameTimes) || {};
    var totalGames = Object.keys(counts).reduce(function(s,k){return s+counts[k];},0);
    var totalMin = Math.round(Object.keys(times).reduce(function(s,k){return s+(times[k]||0);},0)/60);
    var daySet = {};
    snaps.forEach(function(s){ daySet[new Date(s.t).toDateString()] = 1; });
    var days = Object.keys(daySet).length;

    // 趋势折线（内联SVG）
    var W = 320, H = 110, pad = 26;
    var linePts = '', areaPts = '';
    if (snaps.length === 1) {
        var cx = W/2, cy = H/2;
        linePts = '<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="#667eea"/>';
    } else {
        var vals = snaps.map(function(s){return s.avg;});
        var minV = Math.min.apply(null, vals), maxV = Math.max.apply(null, vals);
        if (maxV - minV < 6) { minV -= 3; maxV += 3; }
        var pts = snaps.map(function(s, i) {
            var x = pad + i * (W - 2*pad) / (snaps.length - 1);
            var y = H - pad - (s.avg - minV) / (maxV - minV) * (H - 2*pad);
            return [x, y];
        });
        var pstr = pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ');
        linePts = '<polyline points="'+pstr+'" fill="none" stroke="#667eea" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
            + pts.map(function(p){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3" fill="#fff" stroke="#667eea" stroke-width="2"/>';}).join('');
        areaPts = '<polygon points="'+pts[0][0].toFixed(1)+','+(H-pad)+' '+pstr+' '+pts[pts.length-1][0].toFixed(1)+','+(H-pad)+'" fill="url(#rehabGrad)" opacity="0.25"/>';
    }

    var dimHtml = dims.map(function(d) {
        var diff = last[d.k] - first[d.k];
        var color = diff > 0 ? '#16a34a' : (diff < 0 ? '#dc2626' : '#9ca3af');
        var txt = (diff > 0 ? '+' : '') + diff;
        return `<div style="background:#f8f9ff;border-radius:10px;padding:8px 6px;text-align:center;">
            <div style="font-size:16px;">${d.icon}</div>
            <div style="font-size:11px;color:#6b7280;margin:2px 0;">${d.name}</div>
            <div style="font-size:14px;font-weight:800;color:${color};">${txt}</div>
        </div>`;
    }).join('');

    var cheer;
    if (snaps.length === 1) cheer = '📍 已记录能力起点，接下来每次训练都会画出进步曲线';
    else if (dAvg >= 10) cheer = '🌟 进步非常明显！康复训练效果显著，继续保持';
    else if (dAvg >= 4) cheer = '💪 稳中有进，坚持每天训练，变化会越来越明显';
    else if (dAvg >= -2) cheer = '🌱 刚开始积累，坚持训练一到两周再看趋势';
    else cheer = '🔄 能力有波动很正常，关注长期趋势、保证训练频率';

    box.innerHTML = `<div style="border:1px solid #e5e7eb;border-radius:14px;padding:14px;background:linear-gradient(180deg,#fafbff,#fff);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:16px;">📈</span>
            <b style="font-size:15px;">康复进步追踪</b>
            <span style="margin-left:auto;font-size:13px;font-weight:800;color:${dAvg>0?'#16a34a':(dAvg<0?'#dc2626':'#6b7280')};">
                综合 ${dAvg>0?'+':''}${dAvg} 分</span>
        </div>
        <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;">${cheer}</div>
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;">
            <defs><linearGradient id="rehabGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#667eea" stop-opacity="0"/>
            </linearGradient></defs>
            ${[0.25,0.5,0.75].map(function(r){var y=(pad+(H-2*pad)*r).toFixed(1);return '<line x1="'+pad+'" y1="'+y+'" x2="'+(W-pad)+'" y2="'+y+'" stroke="#f0f0f5" stroke-width="1"/>';}).join('')}
            ${areaPts}${linePts}
        </svg>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin:12px 0 10px;">${dimHtml}</div>
        <div style="display:flex;gap:8px;font-size:12px;color:#4b5563;">
            <span style="background:#eef2ff;border-radius:8px;padding:4px 10px;">🗓️ 记录 ${days} 天</span>
            <span style="background:#eef2ff;border-radius:8px;padding:4px 10px;">🎮 训练 ${totalGames} 次</span>
            <span style="background:#eef2ff;border-radius:8px;padding:4px 10px;">⏱️ 累计 ${totalMin} 分钟</span>
        </div>
    </div>`;
}
window.renderRehabProgress = renderRehabProgress;

// 弱项推荐卡片（由 assessment.js 提供 window.getWeakRecommendations）
function renderRecommendBox(box) {
    if (!box) return;
    if (typeof window.getWeakRecommendations !== 'function') { box.innerHTML = ''; return; }
    const recs = window.getWeakRecommendations();
    if (!recs || recs.length === 0) {
        box.innerHTML = `<div style="background:#f5f6fb;border-radius:12px;padding:14px;text-align:center;font-size:13px;color:#6b7280;">
            先完成「能力测评」建立基线，这里会根据最弱的两项能力推荐训练
        </div>`;
        return;
    }
    let html = `<div style="border-top:1px solid #f0f0f0;padding-top:14px;margin-top:6px;">
        <h4 style="font-size:15px;font-weight:800;margin-bottom:4px;">🎯 为你推荐</h4>
        <div style="font-size:12px;color:#999;margin-bottom:10px;">优先练最弱的两项能力，进步最明显</div>`;
    recs.forEach(r => {
        html += `<div style="margin-bottom:14px;">
            <div style="font-weight:700;font-size:14px;color:${r.color};">${r.icon} ${r.label} <span style="font-weight:800;">${r.score}</span> 分</div>
            <div style="font-size:12px;color:#999;margin:2px 0 6px;">${r.advice}</div>`;
        r.games.forEach(g => {
            html += `<div onclick="window.startGame && window.startGame('${g.id}')" style="display:flex;align-items:center;gap:10px;background:#f5f6fb;border-radius:12px;padding:10px 12px;margin-bottom:6px;cursor:pointer;">
                <span style="font-size:20px;">🎮</span>
                <div style="flex:1;"><div style="font-weight:700;font-size:14px;color:#1f2937;">${g.name}</div>
                <div style="font-size:11px;color:#9ca3af;">${g.reason}</div></div>
                <span style="color:#667eea;font-size:18px;">›</span>
            </div>`;
        });
        html += `</div>`;
    });
    html += `</div>`;
    box.innerHTML = html;
}

function renderCognitiveRadar(container) {
    // 获取用户认知数据（基于真实训练数据计算）
    const cognitiveData = calculateCognitiveData();
    
    const html = `
        <div class="cognitive-map-container">
            <div class="radar-chart-wrapper">
                <svg id="cognitive-radar" viewBox="0 0 400 400"></svg>
            </div>
            <div class="cognitive-stats">
                <h3 style="font-size:16px;font-weight:bold;margin-bottom:8px;">六维能力分析</h3>
                <p style="font-size:12px;color:#666;margin-bottom:12px;">基于你的训练数据实时计算</p>
                <div class="stat-grid">
                    ${renderStatItems(cognitiveData)}
                </div>
            </div>
            <div class="cognitive-detail" style="width:100%;margin-top:16px;">
                <h4 style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 能力详情</h4>
                ${renderCognitiveDetails(cognitiveData)}
            </div>
        </div>
        <style>
            .cognitive-map-container { display: flex; flex-direction: column; align-items: center; padding: 16px; }
            .radar-chart-wrapper { width: 280px; height: 280px; }
            .cognitive-stats { width: 100%; margin-top: 16px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
            .stat-item { padding: 12px 8px; border-radius: 12px; text-align: center; color: white; position: relative; }
            .stat-value { font-size: 22px; font-weight: bold; }
            .stat-label { font-size: 11px; opacity: 0.9; margin-top: 2px; }
            .stat-trend { font-size: 10px; position: absolute; top: 4px; right: 8px; }
            .cognitive-detail-card { background: white; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .detail-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .detail-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
            .detail-title { font-size: 14px; font-weight: 600; }
            .detail-score { margin-left: auto; font-size: 18px; font-weight: bold; }
            .detail-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
            .detail-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
            .detail-sources { font-size: 11px; color: #999; margin-top: 8px; }
        </style>
    `;
    container.innerHTML = html;
    
    // 绘制雷达图
    setTimeout(() => drawRadarChart(cognitiveData), 100);
}

function renderCognitiveDetails(data) {
    const details = [
        { 
            key: 'attention', 
            label: '专注力', 
            icon: '🎯', 
            color: '#667eea',
            desc: '注意力集中与抗干扰能力',
            tip: '多玩舒尔特方格、视觉搜索、快速点击可提升'
        },
        { 
            key: 'memory', 
            label: '记忆力', 
            icon: '🧠', 
            color: '#764ba2',
            desc: '信息存储与提取能力',
            tip: '数字记忆、图形记忆游戏和记忆法训练可提升'
        },
        { 
            key: 'thinking', 
            label: '思维力', 
            icon: '💡', 
            color: '#f093fb',
            desc: '逻辑推理与问题解决能力',
            tip: '图形推理、找不同游戏和思维训练可提升'
        },
        { 
            key: 'reaction', 
            label: '反应力', 
            icon: '⚡', 
            color: '#f5576c',
            desc: '快速反应与应变能力',
            tip: '快速点击、颜色识别、舒尔特方格可提升'
        },
        { 
            key: 'persistence', 
            label: '坚持力', 
            icon: '🏃', 
            color: '#f093fb',
            desc: '持续学习与坚韧不拔',
            tip: '保持连续学习、完成多种训练可提升'
        },
        { 
            key: 'metacognition', 
            label: '元认知', 
            icon: '🔮', 
            color: '#fa709a',
            desc: '自我监控与反思能力',
            tip: '学霸方法训练、思维训练、AI问答可提升'
        }
    ];
    
    return details.map(d => `
        <div class="cognitive-detail-card">
            <div class="detail-header">
                <div class="detail-icon" style="background: ${d.color}20;">${d.icon}</div>
                <div>
                    <div class="detail-title">${d.label}</div>
                    <div style="font-size:11px;color:#999;">${d.desc}</div>
                </div>
                <div class="detail-score" style="color: ${d.color};">${data[d.key]}</div>
            </div>
            <div class="detail-bar">
                <div class="detail-bar-fill" style="width: ${data[d.key]}%; background: ${d.color};"></div>
            </div>
            <div class="detail-sources">💡 ${d.tip}</div>
        </div>
    `).join('');
}

function renderStatItems(data) {
    const items = [
        {label: '专注力', value: data.attention, color: '#667eea', icon: '🎯'},
        {label: '记忆力', value: data.memory, color: '#764ba2', icon: '🧠'},
        {label: '思维力', value: data.thinking, color: '#f093fb', icon: '💡'},
        {label: '反应力', value: data.reaction, color: '#f5576c', icon: '⚡'},
        {label: '坚持力', value: data.persistence, color: '#f093fb', icon: '🏃'},
        {label: '元认知', value: data.metacognition, color: '#fa709a', icon: '🔮'}
    ];
    
    return items.map(item => `
        <div class="stat-item" style="background: linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%);">
            <div style="font-size:16px;margin-bottom:2px;">${item.icon}</div>
            <div class="stat-value">${item.value}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

window.renderMap = renderMap;
window.renderCognitiveRadar = renderCognitiveRadar;
window.renderCognitiveDetails = renderCognitiveDetails;
window.renderStatItems = renderStatItems;


// ============================================================
// Plan - 训练计划
// ============================================================
// calculateCognitiveData 在 ui.js 中定义，无需在此处重新赋值
// 加载顺序：ui.js 在 map.js 之后，函数会由 ui.js 暴露到全局
// ============================================================
// ES6 Module 导出
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderMap,
        renderCognitiveRadar,
        renderCognitiveDetails,
        renderStatItems,
        renderCognitiveMap
    };
}

    renderMap,
    renderCognitiveRadar,
    renderCognitiveDetails,
    renderStatItems

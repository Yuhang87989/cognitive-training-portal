// 版本: V144

CTM.registerModule('map', {
    name: 'map',
    icon: '🎯',
    render: renderMap
});

function renderMap(container) {
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🧠 认知地图 - 六维能力分析</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">基于你的学习数据，绘制专属认知能力雷达图</p>
            <div id="radar-container"></div>
        </div>
    `;
    setTimeout(() => {
        const radarContainer = document.getElementById('radar-container');
        if (radarContainer) renderCognitiveRadar(radarContainer);
    }, 100);
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

export {
    renderMap,
    renderCognitiveRadar,
    renderCognitiveDetails,
    renderStatItems
};

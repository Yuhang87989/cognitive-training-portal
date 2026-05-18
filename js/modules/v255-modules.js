// V255: 其他模块占位渲染函数

function renderTrainingModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '🧠 认知训练', '综合认知能力训练正在开发中...');
    }
}

function renderAttentionModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '👁️ 注意力训练', '舒尔特方格、找不同等注意力训练游戏');
    }
}

function renderMemoryModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '📝 记忆力训练', '数字记忆、图片记忆等训练游戏');
    }
}

function renderFocusModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '🎯 专注力训练', '持续专注力提升训练');
    }
}

function renderReactionModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '⚡ 反应力训练', '反应速度测试与训练');
    }
}

function renderMindmapModule(container) {
    renderFallbackPage(container, '🌳 思维导图', '知识结构梳理与思维导图工具');
}

function renderGrowthModule(container) {
    if (typeof renderMap === 'function') {
        renderMap(container);
    } else {
        renderFallbackPage(container, '📈 成长记录', '学习成长数据统计与分析');
    }
}

function renderFallbackPage(container, title, desc) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; margin-bottom: 20px;">` + title.split(' ')[0] + `</div>
            <h3 style="margin: 0 0 12px 0; font-size: 18px;">` + title + `</h3>
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">` + desc + `</p>
            <button onclick="openFullscreenPage('games')" style="padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">🎮 前往训练游戏</button>
        </div>
    `;
}

window.renderTrainingModule = renderTrainingModule;
window.renderAttentionModule = renderAttentionModule;
window.renderMemoryModule = renderMemoryModule;
window.renderFocusModule = renderFocusModule;
window.renderReactionModule = renderReactionModule;
window.renderMindmapModule = renderMindmapModule;
window.renderGrowthModule = renderGrowthModule;
window.renderFallbackPage = renderFallbackPage;

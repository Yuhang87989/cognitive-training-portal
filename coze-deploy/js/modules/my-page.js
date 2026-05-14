// ==========================================
// V195 我的 - 个人中心页面
// 折叠菜单式布局重构
// ==========================================

// 全局状态：记录各折叠面板展开状态
window.accordionState = {
    'basic': true,      // 默认展开第一个
    'learning': false,
    'ai': false,
    'data': false,
    'api': false,
    'system': false
};

// 切换折叠面板
window.toggleAccordion = function(id) {
    window.accordionState[id] = !window.accordionState[id];
    const content = document.getElementById('accordion-' + id);
    const icon = document.getElementById('accordion-icon-' + id);
    
    if (window.accordionState[id]) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        icon.style.transform = 'rotate(0deg)';
    }
};

// 切换难度级别
window.changeDifficulty = function(direction) {
    const user = getCurrentUserData();
    if (user) {
        let newDiff = user.difficulty + direction;
        newDiff = Math.max(1, Math.min(10, newDiff)); // 限制1-10级
        user.difficulty = newDiff;
        saveUserData(user);
        renderMyPage(document.getElementById('app-container'));
        showToast('难度已调整为 Lv.' + newDiff);
    }
};

// 更新每日训练次数
window.updateDailyGoal = function(value) {
    const user = getCurrentUserData();
    if (user) {
        user.dailyGoal = parseInt(value);
        saveUserData(user);
    }
};

// 切换提示音
window.toggleSound = function() {
    const enabled = localStorage.getItem('sound_enabled') !== 'false';
    localStorage.setItem('sound_enabled', (!enabled).toString());
    renderMyPage(document.getElementById('app-container'));
    showToast(enabled ? '提示音已关闭' : '提示音已开启');
};

// 清空错题本
window.clearWrongBook = function() {
    if (confirm('确定要清空所有错题吗？此操作不可恢复！')) {
        const user = getCurrentUserData();
        if (user) {
            user.wrongNotes = [];
            saveUserData(user);
            renderMyPage(document.getElementById('app-container'));
            showToast('错题本已清空');
        }
    }
};

// 切换DeepSeek模式
window.toggleDeepSeekMode = function(mode) {
    localStorage.setItem('deepseek_mode', mode);
    renderMyPage(document.getElementById('app-container'));
    showToast(mode === 'fast' ? '已切换为快速模式' : '已切换为专家模式');
};

// 清除AI上下文
window.clearAIContext = function() {
    if (typeof clearDeepSeekChatHistory === 'function') {
        clearDeepSeekChatHistory();
    }
    if (typeof clearDeepSeekConversation === 'function') {
        clearDeepSeekConversation();
    }
    showToast('AI上下文已清除');
};

// 数据备份
window.doBackup = function() {
    if (typeof exportData === 'function') {
        exportData();
    } else if (typeof LocalDB !== 'undefined' && LocalDB.exportAll) {
        LocalDB.exportAll().then(function(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '认知训练备份_' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            showToast('备份成功，文件已下载');
        });
    }
};

// 数据恢复
window.doRestore = function() {
    if (typeof LocalDB !== 'undefined' && LocalDB.importFromFile) {
        LocalDB.importFromFile(function(result) {
            if (result && result.success) {
                showToast('数据恢复成功');
                location.reload();
            }
        });
    }
};

// 保存API Key
window.saveApiKey = function() {
    const key = document.getElementById('deepseek-api-key').value.trim();
    if (key) {
        localStorage.setItem('deepseek_api_key', key);
        showToast('API Key已保存');
    } else {
        localStorage.removeItem('deepseek_api_key');
        showToast('API Key已清除，将使用默认配置');
    }
};

// 清除缓存
window.clearAppCache = function() {
    if (confirm('确定要清除所有缓存吗？这会重置应用状态。')) {
        localStorage.clear();
        if (typeof caches !== 'undefined') {
            caches.keys().then(function(names) {
                names.forEach(function(name) {
                    caches.delete(name);
                });
            });
        }
        showToast('缓存已清除，页面即将刷新');
        setTimeout(function() { location.reload(); }, 1500);
    }
};

// 显示关于信息
window.showAbout = function() {
    alert('认知训练门户 V195\n\n一个专注于提升认知能力的训练平台。\n包含多种思维训练游戏、AI辅导、错题管理等功能。\n\n© 2024 认知训练团队');
};

window.renderMyPage = function(container) {
    const user = getCurrentUserData();
    const streakDays = calculateStreakDays();
    const wrongCount = (user && user.wrongNotes) ? user.wrongNotes.length : 0;
    const dailyGoal = user && user.dailyGoal ? user.dailyGoal : 8;
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    const deepseekMode = localStorage.getItem('deepseek_mode') || 'fast';
    const customApiKey = localStorage.getItem('deepseek_api_key') || '';
    
    // 折叠面板通用CSS
    const accordionStyle = `
        .accordion-section {
            background: white;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .accordion-header {
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
            user-select: none;
        }
        .accordion-header:hover {
            background: #f5f5f5;
        }
        .accordion-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            font-weight: 600;
            color: #333;
        }
        .accordion-icon {
            font-size: 18px;
            transition: transform 0.3s ease;
        }
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 0;
        }
        .accordion-content-inner {
            padding: 16px;
        }
        .setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
        }
        .setting-row:last-child {
            border-bottom: none;
        }
        .setting-label {
            font-size: 14px;
            color: #333;
        }
        .setting-desc {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }
        .btn-small {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            border: none;
            cursor: pointer;
        }
        .btn-primary {
            background: linear-gradient(135deg,#667eea,#764ba2);
            color: white;
        }
        .btn-danger {
            background: #ff4757;
            color: white;
        }
        .btn-secondary {
            background: #f0f0f0;
            color: #666;
        }
        .toggle-switch {
            width: 44px;
            height: 24px;
            border-radius: 12px;
            background: #ddd;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        .toggle-switch.active {
            background: #667eea;
        }
        .toggle-switch::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: left 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-switch.active::after {
            left: 22px;
        }
        .mode-btn {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            border: 2px solid #e0e0e0;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
        }
        .mode-btn.active {
            border-color: #667eea;
            background: #667eea10;
            color: #667eea;
            font-weight: 600;
        }
        .input-field {
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
        }
        .input-field:focus {
            outline: none;
            border-color: #667eea;
        }
    `;
    
    container.innerHTML = `
    <style>${accordionStyle}</style>
    <div style="padding:16px;">
        <!-- 用户信息卡片 -->
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">
                    ${user.avatar || '👤'}
                </div>
                <div>
                    <div style="font-size:18px;font-weight:600;">${user.name || '同学'}</div>
                    <div style="font-size:12px;opacity:0.8;">连续学习 ${streakDays} 天</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.totalTime || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">学习分钟</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.completedTasks || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">完成任务</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${(user.accuracy || 0).toFixed(0)}%</div>
                    <div style="font-size:11px;opacity:0.8;">正确率</div>
                </div>
            </div>
        </div>
        
        <!-- 基础设置 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('basic')">
                <div class="accordion-title">
                    <span>⚙️</span>
                    <span>基础设置</span>
                </div>
                <span id="accordion-icon-basic" class="accordion-icon" style="transform:rotate(${window.accordionState.basic ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-basic" class="accordion-content" style="max-height:${window.accordionState.basic ? '500px' : '0'};opacity:${window.accordionState.basic ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">难度级别</div>
                            <div class="setting-desc">调整训练题目难度</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <button class="btn-small btn-secondary" onclick="changeDifficulty(-1)">-</button>
                            <span style="font-size:16px;font-weight:600;color:#667eea;min-width:40px;text-align:center;">Lv.${user.difficulty || 1}</span>
                            <button class="btn-small btn-secondary" onclick="changeDifficulty(1)">+</button>
                        </div>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">每日训练次数</div>
                            <div class="setting-desc">每天目标完成次数</div>
                        </div>
                        <select class="input-field" style="width:80px;" onchange="updateDailyGoal(this.value)">
                            ${[4,6,8,10,12,15,20].map(n => `<option value="${n}" ${n === dailyGoal ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">提示音</div>
                            <div class="setting-desc">答题反馈音效</div>
                        </div>
                        <div class="toggle-switch ${soundEnabled ? 'active' : ''}" onclick="toggleSound()"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 学习管理 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('learning')">
                <div class="accordion-title">
                    <span>📚</span>
                    <span>学习管理</span>
                </div>
                <span id="accordion-icon-learning" class="accordion-icon" style="transform:rotate(${window.accordionState.learning ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-learning" class="accordion-content" style="max-height:${window.accordionState.learning ? '500px' : '0'};opacity:${window.accordionState.learning ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">错题数量</div>
                            <div class="setting-desc">待复习的错题</div>
                        </div>
                        <span style="font-size:18px;font-weight:600;color:${wrongCount > 0 ? '#ff4757' : '#52c41a'};">${wrongCount} 道</span>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">错题本操作</div>
                            <div class="setting-desc">管理错题记录</div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="btn-small btn-primary" onclick="openFullscreenPage('wrongbook')">查看</button>
                            <button class="btn-small btn-danger" onclick="clearWrongBook()">清空</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- AI能力 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('ai')">
                <div class="accordion-title">
                    <span>🤖</span>
                    <span>AI能力</span>
                </div>
                <span id="accordion-icon-ai" class="accordion-icon" style="transform:rotate(${window.accordionState.ai ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-ai" class="accordion-content" style="max-height:${window.accordionState.ai ? '500px' : '0'};opacity:${window.accordionState.ai ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">DeepSeek模式</div>
                            <div class="setting-desc">平衡速度和质量</div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="mode-btn ${deepseekMode === 'fast' ? 'active' : ''}" onclick="toggleDeepSeekMode('fast')">快速</button>
                            <button class="mode-btn ${deepseekMode === 'expert' ? 'active' : ''}" onclick="toggleDeepSeekMode('expert')">专家</button>
                        </div>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">上下文管理</div>
                            <div class="setting-desc">清除AI对话历史</div>
                        </div>
                        <button class="btn-small btn-secondary" onclick="clearAIContext()">清除上下文</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 数据管理 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('data')">
                <div class="accordion-title">
                    <span>💾</span>
                    <span>数据管理</span>
                </div>
                <span id="accordion-icon-data" class="accordion-icon" style="transform:rotate(${window.accordionState.data ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-data" class="accordion-content" style="max-height:${window.accordionState.data ? '500px' : '0'};opacity:${window.accordionState.data ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">数据备份</div>
                            <div class="setting-desc">导出数据到本地</div>
                        </div>
                        <button class="btn-small btn-primary" onclick="doBackup()">立即备份</button>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">数据恢复</div>
                            <div class="setting-desc">从备份文件恢复</div>
                        </div>
                        <button class="btn-small btn-secondary" onclick="doRestore()">导入恢复</button>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">更多选项</div>
                            <div class="setting-desc">完整备份管理器</div>
                        </div>
                        <button class="btn-small btn-secondary" onclick="openFullscreenPage('backup')">打开</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- API配置 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('api')">
                <div class="accordion-title">
                    <span>🔑</span>
                    <span>API配置</span>
                </div>
                <span id="accordion-icon-api" class="accordion-icon" style="transform:rotate(${window.accordionState.api ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-api" class="accordion-content" style="max-height:${window.accordionState.api ? '500px' : '0'};opacity:${window.accordionState.api ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row" style="flex-direction:column;align-items:flex-start;gap:12px;">
                        <div>
                            <div class="setting-label">DeepSeek API Key</div>
                            <div class="setting-desc">使用自己的API Key（留空使用默认）</div>
                        </div>
                        <div style="width:100%;display:flex;gap:8px;">
                            <input type="password" id="deepseek-api-key" class="input-field" placeholder="sk-..." value="${customApiKey}" style="flex:1;">
                            <button class="btn-small btn-primary" onclick="saveApiKey()">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 系统操作 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('system')">
                <div class="accordion-title">
                    <span>🛠️</span>
                    <span>系统操作</span>
                </div>
                <span id="accordion-icon-system" class="accordion-icon" style="transform:rotate(${window.accordionState.system ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-system" class="accordion-content" style="max-height:${window.accordionState.system ? '500px' : '0'};opacity:${window.accordionState.system ? 1 : 0};">
                <div class="accordion-content-inner">
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">版本信息</div>
                            <div class="setting-desc">当前应用版本</div>
                        </div>
                        <span style="font-size:14px;color:#667eea;font-weight:600;">V195</span>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">清除缓存</div>
                            <div class="setting-desc">重置所有本地数据</div>
                        </div>
                        <button class="btn-small btn-danger" onclick="clearAppCache()">清除</button>
                    </div>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">关于</div>
                            <div class="setting-desc">应用信息</div>
                        </div>
                        <button class="btn-small btn-secondary" onclick="showAbout()">查看</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#43e97b20,#38f9d720);border-radius:12px;padding:16px;margin-top:16px;">
            <div style="font-size:12px;color:#43e97b;font-weight:600;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${typeof SelfDrive !== 'undefined' && SelfDrive.getRandomQuote ? SelfDrive.getRandomQuote() : '持续学习，每天进步一点点！'}</div>
        </div>
    </div>`;
};

// 注册备份页面全屏显示
function openBackupPage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💾 数据备份';
        renderBackupManager(content);
    }
}

// 注册自驱力训练全屏页面
function openSelfDrivePage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💪 自驱力训练';
        renderSelfDrive(content);
    }
}

// 注册到CTM
if (typeof CTM !== 'undefined') {
    CTM.registerModule('my', {
        name: '我的',
        icon: '👤',
        render: renderMyPage
    });
    
    CTM.registerModule('backup', {
        name: '数据备份',
        icon: '💾',
        render: renderBackupManager
    });
    
    CTM.registerModule('selfdrive', {
        name: '自驱力训练',
        icon: '💪',
        render: renderSelfDrive
    });
}

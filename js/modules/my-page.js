// ==========================================
// V199 我的 - 个人中心页面
// 功能：2x2快捷功能卡片 + 5个折叠分区
// ==========================================

// 全局状态：记录各折叠面板展开状态
window.accordionState = {
    'study': true,      // 默认展开第一个
    'data': false,
    'tools': false,
    'user': false,
    'about': false
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

// 打开AI使用统计
window.openUsageStats = function() {
    if (window.UsageStatsModule) {
        window.UsageStatsModule.openUsageStatsModal();
    } else {
        showToast('使用统计模块加载中，请稍后再试');
    }
};

// 渲染AI使用统计（用于全屏页面）
function renderUsageStats(container) {
    if (window.UsageStatsModule) {
        window.UsageStatsModule.openUsageStatsModal();
        closeFullscreenPage();
    } else {
        container.innerHTML = '<div class="card"><p style="text-align:center;">使用统计模块加载中...</p></div>';
    }
}
window.renderUsageStats = renderUsageStats;

// DeepSeek帮助文档模态框
window.openDeepseekHelpModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>🔮 DeepSeek 使用帮助</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <h4 style="color: #667eea; margin-bottom: 10px;">📋 目录</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><a href="#mode-diff" style="color: #667eea;">快速模式 vs 专家模式</a></li>
                        <li><a href="#token-explain" style="color: #667eea;">Token 消耗说明</a></li>
                        <li><a href="#api-config" style="color: #667eea;">API Key 配置方法</a></li>
                    </ul>
                </div>
                
                <div id="mode-diff" style="margin-bottom: 25px;">
                    <h4 style="color: #667eea; margin-bottom: 10px;">⚡ 快速模式 vs 专家模式</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background: #667eea; color: white;">
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">特性</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">快速模式</th>
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">专家模式</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>模型</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Chat</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Reasoner</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>响应速度</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">🚀 快速 (~3-5秒)</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">🐢 较慢 (~10-20秒)</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>推理能力</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐⭐⭐</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Token消耗</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">💰 较低</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">💰💰 较高</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>适用场景</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">日常问答、简单解释</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">复杂题目、深度分析</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div id="token-explain" style="margin-bottom: 25px;">
                    <h4 style="color: #667eea; margin-bottom: 10px;">💰 Token 消耗说明</h4>
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0 0 10px 0;"><strong>什么是 Token？</strong></p>
                        <p style="margin: 0;">Token 是 AI 模型处理文本的基本单位。中文中，大约 1-2 个汉字 = 1 个 Token。</p>
                    </div>
                    <div style="margin-top: 15px;">
                        <p style="margin-bottom: 8px;"><strong>计费标准：</strong></p>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li><strong>输入</strong>：¥1.00 / 百万 Token</li>
                            <li><strong>输出</strong>：¥2.00 / 百万 Token</li>
                            <li><strong>一次对话</strong>：通常消耗 500-2000 Token（约 ¥0.001-¥0.004）</li>
                        </ul>
                    </div>
                    <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
                        <p style="margin: 0;"><strong>💡 省钱小贴士：</strong> 对话越长，Token 消耗越多。适时开启新对话可以节省费用。</p>
                    </div>
                </div>
                
                <div id="api-config">
                    <h4 style="color: #667eea; margin-bottom: 10px;">🔑 API Key 配置方法</h4>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">
                            <strong>获取 API Key</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">访问 <a href="https://platform.deepseek.com/" target="_blank" style="color: #667eea;">DeepSeek 开放平台</a>，注册登录后在「API Keys」页面创建新的 Key</p>
                        </li>
                        <li style="margin-bottom: 10px;">
                            <strong>充值余额</strong>
                            <p style="margin: 0; font-size: 14px; color: #666;">在「费用中心」充值，最低 ¥10 起充</p>
                        </li>
                        <li style="margin-bottom: 10px;">
                            <strong>配置到应用</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">在 DeepSeek 聊天页面点击「设置」按钮，输入你的 API Key</p>
                        </li>
                        <li>
                            <strong>验证配置</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">发送一句简单的问候，如"你好"，如果能正常回复则配置成功</p>
                        </li>
                    </ol>
                </div>
            </div>
            <div class="modal-footer" style="text-align: center;">
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">我知道了</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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
    alert('认知训练门户 V199\n\n一个专注于提升认知能力的训练平台。\n包含多种思维训练游戏、AI辅导、错题管理等功能。\n\n© 2024 认知训练团队');
};

// 打开设置页面
window.openSystemSettings = function() {
    showToast('设置功能开发中，敬请期待');
};

// 打开自驱力训练
window.openSelfDrivePage = function() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💪 自驱力训练';
        if (typeof renderSelfDriveContent === 'function') {
            renderSelfDriveContent(content);
        } else {
            content.innerHTML = '<div style="padding:20px;text-align:center;"><h3>💪 自驱力训练</h3><p>功能开发中...</p></div>';
        }
    }
};

// 打开番茄钟
window.openPomodoro = function() {
    openFullscreenPage('pomodoro');
};

// 打开计算器
window.openCalculator = function() {
    openFullscreenPage('calculator');
};

// 打开记事本
window.openNotepad = function() {
    openFullscreenPage('notepad');
};

// 打开修改资料
window.openEditProfileModal = function() {
    showToast('修改资料功能开发中');
};

// 打开更换头像
window.openAvatarModal = function() {
    showToast('更换头像功能开发中');
};

// 打开难度设置
window.openDifficultyModal = function() {
    showToast('难度设置功能开发中');
};

// 打开使用帮助
window.openHelp = function() {
    showToast('帮助文档开发中');
};

// 打开意见反馈
window.openFeedback = function() {
    showToast('意见反馈功能开发中');
};

// 打开每周回顾
window.openWeeklyReview = function() {
    openFullscreenPage('weekly');
};

// 打开进步曲线
window.openProgressChart = function() {
    openFullscreenPage('progress');
};

// 数据同步
window.syncData = function() {
    showToast('数据同步功能开发中');
};

// 显示数据报告
window.showDataStatsModal = function() {
    showToast('数据报告功能开发中');
};

window.renderMyPage = function(container) {
    // ✅ 确保 DeepSeek 帮助文档函数已正确导出
    if (typeof window.openDeepseekHelpModal !== 'function') {
        console.warn('⚠️ openDeepseekHelpModal 函数未找到，重新导出...');
        window.openDeepseekHelpModal = function() {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🔮 DeepSeek 使用帮助</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">📋 目录</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <ul style="margin: 0; padding-left: 20px;">
                                <li><a href="#mode-diff" style="color: #667eea;">快速模式 vs 专家模式</a></li>
                                <li><a href="#token-explain" style="color: #667eea;">Token 消耗说明</a></li>
                                <li><a href="#api-config" style="color: #667eea;">API Key 配置方法</a></li>
                            </ul>
                        </div>
                        
                        <div id="mode-diff" style="margin-bottom: 25px;">
                            <h4 style="color: #667eea; margin-bottom: 10px;">⚡ 快速模式 vs 专家模式</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <thead>
                                    <tr style="background: #667eea; color: white;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">特性</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">快速模式</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">专家模式</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>模型</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Chat</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Reasoner</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>响应速度</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">🚀 快速 (~3-5秒)</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">🐢 较慢 (~10-20秒)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>推理能力</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐⭐⭐</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Token消耗</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">💰 较低</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">💰💰 较高</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>适用场景</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">日常问答、简单解释</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">复杂题目、深度分析</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="token-explain" style="margin-bottom: 25px;">
                            <h4 style="color: #667eea; margin-bottom: 10px;">💰 Token 消耗说明</h4>
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0 0 10px 0;"><strong>什么是 Token？</strong></p>
                                <p style="margin: 0;">Token 是 AI 模型处理文本的基本单位。中文中，大约 1-2 个汉字 = 1 个 Token。</p>
                            </div>
                            <div style="margin-top: 15px;">
                                <p style="margin-bottom: 8px;"><strong>计费标准：</strong></p>
                                <ul style="margin: 0; padding-left: 20px;">
                                    <li><strong>输入</strong>：¥1.00 / 百万 Token</li>
                                    <li><strong>输出</strong>：¥2.00 / 百万 Token</li>
                                    <li><strong>一次对话</strong>：通常消耗 500-2000 Token（约 ¥0.001-¥0.004）</li>
                                </ul>
                            </div>
                            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
                                <p style="margin: 0;"><strong>💡 省钱小贴士：</strong> 对话越长，Token 消耗越多。适时开启新对话可以节省费用。</p>
                            </div>
                        </div>
                        
                        <div id="api-config">
                            <h4 style="color: #667eea; margin-bottom: 10px;">🔑 API Key 配置方法</h4>
                            <ol style="margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">
                                    <strong>获取 API Key</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">访问 <a href="https://platform.deepseek.com/" target="_blank" style="color: #667eea;">DeepSeek 开放平台</a>，注册登录后在「API Keys」页面创建新的 Key</p>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>充值余额</strong>
                                    <p style="margin: 0; font-size: 14px; color: #666;">在「费用中心」充值，最低 ¥10 起充</p>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>配置到应用</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">在 DeepSeek 聊天页面点击「设置」按钮，输入你的 API Key</p>
                                </li>
                                <li>
                                    <strong>验证配置</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">发送一句简单的问候，如"你好"，如果能正常回复则配置成功</p>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="modal-footer" style="text-align: center;">
                        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">我知道了</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        };
    }
    
    const user = getCurrentUserData();
    const streakDays = calculateStreakDays();
    const wrongCount = (user && user.wrongNotes) ? user.wrongNotes.length : 0;
    const dailyGoal = user && user.dailyGoal ? user.dailyGoal : 8;
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    const deepseekMode = localStorage.getItem('deepseek_mode') || 'fast';
    const customApiKey = localStorage.getItem('deepseek_api_key') || '';
    
    // 折叠面板和快捷卡片CSS
    const myPageStyle = `
        .quick-cards-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }
        .quick-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .quick-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .quick-card:active {
            transform: translateY(0);
        }
        .quick-card-icon {
            font-size: 32px;
        }
        .quick-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
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
        .foldable-btn {
            width: 100%;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: none;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            text-align: left;
            transition: background 0.2s;
        }
        .foldable-btn:hover {
            background: #e9ecef;
        }
        .foldable-btn:last-child {
            margin-bottom: 0;
        }
    `;
    
    container.innerHTML = `
    <style>${myPageStyle}</style>
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
        
        <!-- 2x2 快捷功能卡片 -->
        <div class="quick-cards-section">
            <div class="quick-card" onclick="openFullscreenPage('wrongbook')">
                <div class="quick-card-icon">📝</div>
                <div class="quick-card-title">错题本</div>
            </div>
            <div class="quick-card" onclick="openFullscreenPage('selfdrive')">
                <div class="quick-card-icon">💪</div>
                <div class="quick-card-title">自驱力训练</div>
            </div>
            <div class="quick-card" onclick="openFullscreenPage('backup')">
                <div class="quick-card-icon">💾</div>
                <div class="quick-card-title">数据备份</div>
            </div>
            <div class="quick-card" onclick="openSettingsPanel()">
                <div class="quick-card-icon">⚙️</div>
                <div class="quick-card-title">设置</div>
            </div>
        </div>
        
        <!-- 折叠分区1: 📊 学习统计 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('study')">
                <div class="accordion-title">
                    <span>📊</span>
                    <span>学习统计</span>
                </div>
                <span id="accordion-icon-study" class="accordion-icon" style="transform:rotate(${window.accordionState.study ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-study" class="accordion-content" style="max-height:${window.accordionState.study ? '500px' : '0'};opacity:${window.accordionState.study ? 1 : 0};">
                <div class="accordion-content-inner">
                    <button class="foldable-btn" onclick="showDataStatsModal()">
                        <span>📈</span> 学习数据报告
                    </button>
                    <button class="foldable-btn" onclick="openWeeklyReview()">
                        <span>📅</span> 每周回顾
                    </button>
                    <button class="foldable-btn" onclick="openProgressChart()">
                        <span>📉</span> 进步曲线
                    </button>
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">错题数量</div>
                            <div class="setting-desc">待复习的错题</div>
                        </div>
                        <span style="font-size:18px;font-weight:600;color:${wrongCount > 0 ? '#ff4757' : '#52c41a'};">${wrongCount} 道</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 折叠分区2: 💾 数据管理 -->
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
                    <button class="foldable-btn" onclick="openFullscreenPage('backup')">
                        <span>📤</span> 导出备份
                    </button>
                    <button class="foldable-btn" onclick="doRestore()">
                        <span>📥</span> 导入恢复
                    </button>
                    <button class="foldable-btn" onclick="syncData()">
                        <span>🔄</span> 数据同步
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 折叠分区3: 🛠️ 实用工具 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('tools')">
                <div class="accordion-title">
                    <span>🛠️</span>
                    <span>实用工具</span>
                </div>
                <span id="accordion-icon-tools" class="accordion-icon" style="transform:rotate(${window.accordionState.tools ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-tools" class="accordion-content" style="max-height:${window.accordionState.tools ? '500px' : '0'};opacity:${window.accordionState.tools ? 1 : 0};">
                <div class="accordion-content-inner">
                    <button class="foldable-btn" onclick="openPomodoro()">
                        <span>🍅</span> 番茄钟
                    </button>
                    <button class="foldable-btn" onclick="openCalculator()">
                        <span>🔢</span> 计算器
                    </button>
                    <button class="foldable-btn" onclick="openNotepad()">
                        <span>📝</span> 记事本
                    </button>
                    <button class="foldable-btn" onclick="openUsageStats()">
                        <span>📊</span> AI使用统计
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 折叠分区4: 👥 用户设置 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('user')">
                <div class="accordion-title">
                    <span>👥</span>
                    <span>用户设置</span>
                </div>
                <span id="accordion-icon-user" class="accordion-icon" style="transform:rotate(${window.accordionState.user ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-user" class="accordion-content" style="max-height:${window.accordionState.user ? '500px' : '0'};opacity:${window.accordionState.user ? 1 : 0};">
                <div class="accordion-content-inner">
                    <button class="foldable-btn" onclick="openEditProfileModal()">
                        <span>✏️</span> 修改资料
                    </button>
                    <button class="foldable-btn" onclick="openAvatarModal()">
                        <span>🎨</span> 更换头像
                    </button>
                    <button class="foldable-btn" onclick="openDifficultyModal()">
                        <span>⚙️</span> 难度设置
                    </button>
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
        
        <!-- 折叠分区5: ℹ️ 关于帮助 -->
        <div class="accordion-section">
            <div class="accordion-header" onclick="toggleAccordion('about')">
                <div class="accordion-title">
                    <span>ℹ️</span>
                    <span>关于帮助</span>
                </div>
                <span id="accordion-icon-about" class="accordion-icon" style="transform:rotate(${window.accordionState.about ? 180 : 0}deg);">▼</span>
            </div>
            <div id="accordion-about" class="accordion-content" style="max-height:${window.accordionState.about ? '600px' : '0'};opacity:${window.accordionState.about ? 1 : 0};">
                <div class="accordion-content-inner">
                    <button class="foldable-btn" onclick="showAbout()">
                        <span>📋</span> 版本信息
                    </button>
                    <button class="foldable-btn" onclick="openHelp()">
                        <span>❓</span> 使用帮助
                    </button>
                    <button class="foldable-btn" onclick="openFeedback()">
                        <span>💬</span> 意见反馈
                    </button>
                    <button class="foldable-btn" onclick="openDeepseekHelpModal()">
                        <span>🔮</span> DeepSeek帮助文档
                    </button>
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
                    <div class="setting-row">
                        <div>
                            <div class="setting-label">清除缓存</div>
                            <div class="setting-desc">重置所有本地数据</div>
                        </div>
                        <button class="btn-small btn-danger" onclick="clearAppCache()">清除</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#43e97b20,#38f9d720);border-radius:12px;padding:16px;margin-top:16px;">
            <div style="font-size:12px;color:#43e97b;font-weight:600;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${typeof SelfDrive !== 'undefined' && SelfDrive.getRandomQuote ? SelfDrive.getRandomQuote() : '持续学习，每天进步一点点！'}</div>
        </div>
        
        <!-- 底部间距 -->
        <div style="height: 80px;"></div>
    </div>`;
    
    // ✅ 确保 DeepSeek 帮助文档按钮样式与其他按钮完全一致
    setTimeout(() => {
        const buttons = container.querySelectorAll('button.foldable-btn');
        buttons.forEach(btn => {
            // 移除所有内联样式，确保 class 样式生效
            btn.removeAttribute('style');
            btn.disabled = false;
            
            // 确保按钮样式与其他按钮完全一致
            btn.style.background = '#f8f9fa';
            btn.style.color = '#333';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
    }, 10);
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

console.log('✅ V199 my-page.js 已加载 - 2x2快捷功能卡片 + 5个折叠分区');

// ==========================================
// V403o 我的 - 个人中心页面 + 角色切换
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
    const user = window.getCurrentUserData();
    if (user) {
        let newDiff = user.difficulty + direction;
        newDiff = Math.max(1, Math.min(10, newDiff)); // 限制1-10级
        user.difficulty = newDiff;
        saveUserData(user);
        renderMyPage(document.getElementById('app-container'));
        window.showToast('难度已调整为 Lv.' + newDiff);
    }
};

// 更新每日训练次数
window.updateDailyGoal = function(value) {
    const user = window.getCurrentUserData();
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
    window.showToast(enabled ? '提示音已关闭' : '提示音已开启');
};

// 清空错题本
window.clearWrongBook = function() {
    if (confirm('确定要清空所有错题吗？此操作不可恢复！')) {
        const user = window.getCurrentUserData();
        if (user) {
            user.wrongNotes = [];
            saveUserData(user);
            renderMyPage(document.getElementById('app-container'));
            window.showToast('错题本已清空');
        }
    }
};

// 切换DeepSeek模式
window.toggleDeepSeekMode = function(mode) {
    localStorage.setItem('deepseek_mode', mode);
    renderMyPage(document.getElementById('app-container'));
    window.showToast(mode === 'fast' ? '已切换为快速模式' : '已切换为专家模式');
};

// 清除AI上下文
window.clearAIContext = function() {
    if (typeof clearDeepSeekChatHistory === 'function') {
        clearDeepSeekChatHistory();
    }
    if (typeof clearDeepSeekConversation === 'function') {
        clearDeepSeekConversation();
    }
    window.showToast('AI上下文已清除');
};

// 打开AI使用统计
window.openUsageStats = function() {
    if (window.UsageStatsModule) {
        window.UsageStatsModule.openUsageStatsModal();
    } else {
        window.showToast('使用统计模块加载中，请稍后再试');
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
    modal.className = 'modal-overlay show';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
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
                
                <div id="how-to-use" style="margin-bottom: 25px;">
                    <h4 style="color: #667eea; margin-bottom: 10px;">💬 如何使用 DeepSeek 提问</h4>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">
                            <strong>打开 DeepSeek 聊天</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">从首页或「我的」页面进入 DeepSeek AI 聊天页面</p>
                        </li>
                        <li style="margin-bottom: 10px;">
                            <strong>选择模式</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                                • 「快速模式」：适合日常问答、简单解释，响应快，消耗少<br>
                                • 「专家模式」：适合复杂题目、深度分析，思考更深入，答案更详细
                            </p>
                        </li>
                        <li style="margin-bottom: 10px;">
                            <strong>输入问题</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">在底部输入框输入你的问题，支持中英文提问</p>
                        </li>
                        <li style="margin-bottom: 10px;">
                            <strong>发送消息</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">点击发送按钮或按回车键发送，等待 AI 回复</p>
                        </li>
                        <li>
                            <strong>继续对话</strong>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">可以基于之前的回复继续追问，AI 会记住上下文</p>
                        </li>
                    </ol>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-top: 15px;">
                        <p style="margin: 0;"><strong>💡 使用提示：</strong> 描述问题越详细，得到的答案越准确。例如："请帮我详细讲解一下勾股定理的推导过程" 比 "什么是勾股定理" 效果更好。</p>
                    </div>
                </div>
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
                
                <div id="prompt-tips" style="margin-bottom: 25px;">
                    <h4 style="color: #667eea; margin-bottom: 10px;">💡 高级提问技巧</h4>
                    
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #333; margin-bottom: 8px;">🎯 原则1：描述越详细，答案越精准</h5>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            <strong>❌ 不好的提问：</strong>"什么是相对论？"<br>
                            <strong>✅ 好的提问：</strong>"请用通俗易懂的语言解释爱因斯坦的相对论，假设我是初中生，尽量少用公式"
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #333; margin-bottom: 8px;">📝 原则2：明确输出格式</h5>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            告诉AI你想要什么格式的回答：分点列出、表格形式、思维导图大纲、对话体、故事化表述等
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #333; margin-bottom: 8px;">🎭 原则3：角色扮演法</h5>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            让AI扮演特定角色："作为一名高中数学老师，请用5分钟的试讲风格讲解三角函数的应用"
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #333; margin-bottom: 8px;">🔄 原则4：迭代优化</h5>
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            第一次回答不满意时，可以继续追问："太复杂了，请再简化一下"、"能不能举个具体的例子？"、"补充XX方面的内容"
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #333; margin-bottom: 8px;">📐 原则5：结构化提问模板</h5>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; font-size: 14px; color: #666;">
                            <p style="margin: 0 0 8px 0;"><strong>【背景】</strong>我是XX年级学生，正在学习...</p>
                            <p style="margin: 0 0 8px 0;"><strong>【问题】</strong>我不理解...</p>
                            <p style="margin: 0 0 8px 0;"><strong>【要求】</strong>请用XX风格讲解，包含XX个例子，字数控制在...</p>
                            <p style="margin: 0;"><strong>【输出格式】</strong>分3段回答，每段不超过...</p>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea10, #764ba210); padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                        <p style="margin: 0;"><strong>✨ 记住：</strong> AI 的回答质量取决于你的提问质量。花 10 秒钟把问题说清楚，可以节省几分钟的反复沟通！</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">我知道了</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add("show");
};

// V286 数据备份 - 使用DataSync模块
window.doBackup = function() {
    if (typeof DataSync !== 'undefined' && DataSync.downloadBackup) {
        DataSync.downloadBackup();
        window.showToast('备份成功，文件已下载');
    } else if (typeof exportData === 'function') {
        exportData();
    } else if (typeof LocalDB !== 'undefined' && LocalDB.exportAll) {
        LocalDB.exportAll().then(function(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '认知训练备份_' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            window.showToast('备份成功，文件已下载');
        });
    }
};

// V286 数据恢复 - 使用DataSync模块
window.doRestore = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                if (typeof DataSync !== 'undefined' && DataSync.importAll) {
                    DataSync.importAll(backupData, function(result) {
                        if (result && result.success) {
                            window.showToast('数据恢复成功，共恢复 ' + result.success + ' 个模块');
                            setTimeout(function() { location.reload(); }, 1000);
                        } else {
                            window.showToast('数据恢复失败');
                        }
                    });
                } else {
                    window.showToast('数据同步模块未就绪，请稍后再试');
                }
            } catch (err) {
                console.error('恢复失败:', err);
                window.showToast('恢复失败：文件格式错误');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
};

// V286 数据同步 - 同步到IndexedDB
window.syncData = function() {
    if (typeof DataSync !== 'undefined' && DataSync.syncAllToIndexedDB) {
        DataSync.syncAllToIndexedDB();
        window.showToast('数据同步完成');
    } else {
        window.showToast('数据同步模块未就绪');
    }
};

// 保存API Key
window.saveApiKey = function() {
    const key = document.getElementById('deepseek-api-key').value.trim();
    if (key) {
        localStorage.setItem('deepseek_api_key', key);
        window.showToast('API Key已保存');
    } else {
        localStorage.removeItem('deepseek_api_key');
        window.showToast('API Key已清除，将使用默认配置');
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
        window.showToast('缓存已清除，页面即将刷新');
        setTimeout(function() { location.reload(); }, 1500);
    }
};

// 显示关于信息
window.showAbout = function() {
    alert('认知训练门户 V199\n\n一个专注于提升认知能力的训练平台。\n包含多种思维训练游戏、AI辅导、错题管理等功能。\n\n© 2024 认知训练团队');
};

// 打开设置页面

// 打开自驱力训练
window.openSelfDrivePage = function() {
    openFullscreenPage("selfdrive");
};

// 打开番茄钟
window.openPomodoro = function() {
    openFullscreenPage('pomodoro');
};

// 打开计算器
window.openCalculator = function() {
    openFullscreenPage('calculator');
};

// 打开学习日记
window.openNotepad = function() {
    openFullscreenPage('notepad');
};

// 打开修改资料

// 打开更换头像

// 打开难度设置

// 打开使用帮助

// 打开意见反馈

// 打开每周回顾
window.openWeeklyReview = function() {
    openFullscreenPage('weekly');
};

// 打开进步曲线
window.openProgressChart = function() {
    openFullscreenPage('progress');
};

// 数据同步

// 显示数据报告

window.renderMyPage = function(container) {
    // ✅ 确保 DeepSeek 帮助文档函数已正确导出
    if (typeof window.openDeepseekHelpModal !== 'function') {
        console.warn('⚠️ openDeepseekHelpModal 函数未找到，重新导出...');
        window.openDeepseekHelpModal = function() {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay show';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
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
            
            modal.classList.add("show");
            document.body.appendChild(modal);
        };
    }
    
    const user = window.getCurrentUserData();
    
    // V286 使用DataSync获取用户统计信息
    let userStats = {
        level: 1,
        exp: 0,
        totalTime: 0,
        totalDays: 1
    };
    
    if (typeof DataSync !== 'undefined' && DataSync.user) {
        userStats = DataSync.user.getStats();
        userStats.level = DataSync.user.getCurrent().level || 1;
        userStats.exp = DataSync.user.getCurrent().exp || 0;
        userStats.totalTime = DataSync.user.getCurrent().totalStudyTime || 0;
        userStats.totalDays = DataSync.user.getCurrent().totalDays || 1;
    }
    
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
            grid-template-columns: repeat(3, 1fr);
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
        <!-- 用户信息卡片 V286 -->
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">
                    ${user.avatar || '👤'}
                </div>
                <div>
                    <div style="font-size:18px;font-weight:600;">${user.name || '同学'}</div>
                    <div style="font-size:12px;opacity:0.8;">Lv.${userStats.level} | 经验 ${userStats.exp}/${userStats.level * 100}</div>
                </div>
            </div>
            <!-- 经验条 V286 -->
            <div style="background:rgba(255,255,255,0.2);border-radius:10px;height:6px;margin-bottom:12px;">
                <div style="width:${Math.min(100, (userStats.exp / (userStats.level * 100)) * 100)}%;height:100%;background:white;border-radius:10px;transition:width 0.3s;"></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
                <div>
                    <div style="font-size:18px;font-weight:bold;">${userStats.totalDays}</div>
                    <div style="font-size:11px;opacity:0.8;">学习天数</div>
                </div>
                <div>
                    <div style="font-size:18px;font-weight:bold;">${userStats.totalTime}</div>
                    <div style="font-size:11px;opacity:0.8;">学习分钟</div>
                </div>
                <div>
                    <div style="font-size:18px;font-weight:bold;">${streakDays}</div>
                    <div style="font-size:11px;opacity:0.8;">连续天数</div>
                </div>
                <div>
                    <div style="font-size:18px;font-weight:bold;">${(user.accuracy || 0).toFixed(0)}%</div>
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
            <div class="quick-card" onclick="openFullscreenPage('plan')">
                <div class="quick-card-icon">📋</div>
                <div class="quick-card-title">学习计划</div>
            </div>
            <div class="quick-card" onclick="openFullscreenPage('backup')">
                <div class="quick-card-icon">💾</div>
                <div class="quick-card-title">数据备份</div>
            </div>
            <div class="quick-card" onclick="openSettingsPanel()">
                <div class="quick-card-icon">⚙️</div>
                <div class="quick-card-title">设置</div>
            </div>
            <div class="quick-card" onclick="openFullscreenPage('pomodoro')">
                <div class="quick-card-icon">🍅</div>
                <div class="quick-card-title">番茄闹钟</div>
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
                    <button class="foldable-btn" onclick="openFullscreenPage('pomodoro')">
                        <span>🍅</span> 番茄钟
                    </button>
                    <button class="foldable-btn" onclick="openFullscreenPage('calculator')">
                        <span>🔢</span> 计算器
                    </button>
                    <button class="foldable-btn" onclick="openFullscreenPage('notepad')">
                        <span>📝</span> 学习日记
                    </button>
                    <button class="foldable-btn" onclick="openFullscreenPage('usage-stats')">
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


// ========== V403o: 角色切换 + 家长/管理员界面 ==========

// 角色名称映射
var ROLE_MAP = {
    student: { name: '学生', icon: '🧒', desc: '进行认知训练和学习' },
    parent: { name: '家长', icon: '👨‍👩‍👧', desc: '查看孩子学习数据' },
    admin: { name: '管理员', icon: '🔧', desc: '管理平台和用户' }
};

// 获取当前角色
window.getCurrentRole = function() {
    if (typeof CloudSync !== 'undefined' && CloudSync.isEnabled && CloudSync.isEnabled()) {
        return CloudSync.getRole ? CloudSync.getRole() : 'student';
    }
    return localStorage.getItem('user_role') || 'student';
};

// 切换角色
window.switchUserRole = function(newRole) {
    if (['student', 'parent', 'admin'].indexOf(newRole) === -1) return;
    
    // 保存到本地
    localStorage.setItem('user_role', newRole);
    
    // 如果云同步可用，同步到云端
    if (typeof CloudSync !== 'undefined' && CloudSync.isEnabled && CloudSync.isEnabled() && CloudSync.switchRole) {
        CloudSync.switchRole(newRole);
    }
    
    // 更新UI
    var label = document.getElementById('current-role-label');
    if (label) label.textContent = '(' + ROLE_MAP[newRole].name + ')';
    
    window.showToast('已切换为' + ROLE_MAP[newRole].name + '模式');
    
    // 关闭弹窗
    var modal = document.querySelector('.role-switch-modal');
    if (modal) modal.remove();
    
    // 如果切换到家长/管理员，打开对应页面
    if (newRole === 'parent') {
        showParentDashboard();
    } else if (newRole === 'admin') {
        showAdminDashboard();
    }
};

// 角色切换弹窗
window.showRoleSwitchModal = function() {
    var currentRole = window.getCurrentRole();
    
    var modal = document.createElement('div');
    modal.className = 'modal-overlay show role-switch-modal';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    
    var roleCards = '';
    var roles = ['student', 'parent', 'admin'];
    for (var i = 0; i < roles.length; i++) {
        var r = roles[i];
        var info = ROLE_MAP[r];
        var isActive = r === currentRole;
        roleCards += '<div onclick="switchUserRole(this.dataset.role)" data-role="' + r + '" style="' +
            'background:' + (isActive ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f8f9fa') + ';' +
            'color:' + (isActive ? 'white' : '#333') + ';' +
            'padding:20px;border-radius:12px;cursor:pointer;text-align:center;' +
            'border:2px solid ' + (isActive ? '#667eea' : '#e0e0e0') + ';' +
            'transition:all 0.2s;">' +
            '<div style="font-size:36px;margin-bottom:8px;">' + info.icon + '</div>' +
            '<div style="font-size:16px;font-weight:600;margin-bottom:4px;">' + info.name + '</div>' +
            '<div style="font-size:12px;opacity:0.7;">' + info.desc + '</div>' +
            (isActive ? '<div style="margin-top:8px;font-size:12px;opacity:0.8;">✓ 当前</div>' : '') +
            '</div>';
    }
    
    modal.innerHTML = '<div class="modal-content" style="max-width:400px;">' +
        '<div class="modal-header"><h3>👥 角色切换</h3>' +
        '<button class="modal-close" onclick="this.closest(&#39;.role-switch-modal&#39;).remove()">×</button></div>' +
        '<div style="padding:20px;">' +
        '<p style="color:#666;font-size:14px;margin-bottom:16px;">选择你的身份以进入对应功能界面</p>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' + roleCards + '</div>' +
        '</div></div>';
    
    document.body.appendChild(modal);
};

// 家长看板
window.showParentDashboard = function() {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'parent-dashboard';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = '<div class="modal-content" style="max-width:600px;max-height:85vh;overflow-y:auto;">' +
        '<div class="modal-header"><h3>👨‍👩‍👧 家长看板</h3>' +
        '<button class="modal-close" onclick="document.getElementById(&#39;parent-dashboard&#39;).remove()">×</button></div>' +
        '<div style="padding:20px;" id="parent-dashboard-content">' +
        '<div style="text-align:center;padding:40px 0;">' +
        '<div style="font-size:48px;margin-bottom:16px;">👨‍👩‍👧</div>' +
        '<div style="font-size:16px;font-weight:600;margin-bottom:8px;">家长监管模式</div>' +
        '<div style="color:#666;font-size:14px;margin-bottom:24px;">绑定孩子账号后，可查看学习数据和训练报告</div>' +
        '<div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;text-align:left;">' +
        '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">🔗 绑定孩子账号</div>' +
        '<div style="display:flex;gap:8px;">' +
        '<input type="text" id="child-openid-input" placeholder="输入孩子的用户ID" style="flex:1;padding:10px 12px;border:1px solid #e0e0e0;border-radius:8px;font-size:14px;">' +
        '<button onclick="bindChild()" style="padding:10px 16px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;">绑定</button>' +
        '</div></div>' +
        '<div id="children-list" style="text-align:left;"></div>' +
        '</div></div></div>';
    
    document.body.appendChild(modal);
    loadChildren();
};

// 绑定孩子
window.bindChild = function() {
    var input = document.getElementById('child-openid-input');
    if (!input || !input.value.trim()) {
        window.showToast('请输入孩子的用户ID');
        return;
    }
    
    var childId = input.value.trim();
    
    if (typeof CloudSync !== 'undefined' && CloudSync.requestBindChild) {
        CloudSync.requestBindChild(childId).then(function() {
            window.showToast('绑定请求已发送');
            input.value = '';
            loadChildren();
        }).catch(function(e) {
            window.showToast('绑定失败: ' + (e.message || e));
        });
    } else {
        // 本地模式：保存到localStorage
        var bindings = JSON.parse(localStorage.getItem('parent_bindings') || '[]');
        if (bindings.indexOf(childId) === -1) {
            bindings.push(childId);
            localStorage.setItem('parent_bindings', JSON.stringify(bindings));
            window.showToast('已绑定孩子账号');
            input.value = '';
            loadChildren();
        } else {
            window.showToast('该账号已绑定');
        }
    }
};

// 加载孩子列表
window.loadChildren = function() {
    var listEl = document.getElementById('children-list');
    if (!listEl) return;
    
    var bindings = JSON.parse(localStorage.getItem('parent_bindings') || '[]');
    
    if (bindings.length === 0) {
        listEl.innerHTML = '<div style="color:#999;font-size:14px;text-align:center;padding:16px;">暂无绑定的孩子账号</div>';
        return;
    }
    
    var html = '<div style="font-size:14px;font-weight:600;margin-bottom:8px;">📋 已绑定的孩子</div>';
    bindings.forEach(function(id, idx) {
        html += '<div style="display:flex;align-items:center;justify-content:space-between;background:white;border-radius:8px;padding:12px;margin-bottom:8px;border:1px solid #f0f0f0;">' +
            '<div><div style="font-weight:600;font-size:14px;">🧒 孩子 ' + (idx + 1) + '</div>' +
            '<div style="font-size:12px;color:#999;">ID: ' + id.substring(0, 8) + '...</div></div>' +
            '<div style="display:flex;gap:8px;">' +
            '<button onclick="viewChildData(idx)" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">查看数据</button>' +
            '<button onclick="unbindChild(idx)" style="padding:6px 12px;background:#ff4757;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">解绑</button>' +
            '</div></div>';
    });
    
    listEl.innerHTML = html;
};

// 查看孩子数据
window.viewChildData = function(idx) {
    var bindings = JSON.parse(localStorage.getItem('parent_bindings') || '[]');
    var childId = bindings[idx] || '';
    window.showToast('正在加载孩子数据...');
    // TODO: 实现从云端拉取数据的详情页面
};

// 解绑孩子
window.unbindChild = function(index) {
    if (!confirm('确定要解绑吗？')) return;
    var bindings = JSON.parse(localStorage.getItem('parent_bindings') || '[]');
    bindings.splice(index, 1);
    localStorage.setItem('parent_bindings', JSON.stringify(bindings));
    window.showToast('已解绑');
    loadChildren();
};

// 管理员看板
window.showAdminDashboard = function() {
    var modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'admin-dashboard';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = '<div class="modal-content" style="max-width:600px;max-height:85vh;overflow-y:auto;">' +
        '<div class="modal-header"><h3>🔧 管理员看板</h3>' +
        '<button class="modal-close" onclick="document.getElementById(&#39;admin-dashboard&#39;).remove()">×</button></div>' +
        '<div style="padding:20px;" id="admin-dashboard-content">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">' +
        '<div style="background:linear-gradient(135deg,#667eea20,#764ba220);border-radius:12px;padding:20px;text-align:center;">' +
        '<div style="font-size:32px;margin-bottom:4px;">👥</div>' +
        '<div style="font-size:24px;font-weight:bold;color:#667eea;" id="admin-total-users">--</div>' +
        '<div style="font-size:12px;color:#666;">总用户数</div></div>' +
        '<div style="background:linear-gradient(135deg,#43e97b20,#38f9d720);border-radius:12px;padding:20px;text-align:center;">' +
        '<div style="font-size:32px;margin-bottom:4px;">📊</div>' +
        '<div style="font-size:24px;font-weight:bold;color:#43e97b;" id="admin-today-records">--</div>' +
        '<div style="font-size:12px;color:#666;">今日训练</div></div>' +
        '</div>' +
        '<div style="background:#f8f9fa;border-radius:12px;padding:16px;">' +
        '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">📋 管理功能</div>' +
        '<button onclick="adminViewUsers()" style="width:100%;padding:12px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:14px;margin-bottom:8px;text-align:left;">👥 用户管理</button>' +
        '<button onclick="adminViewLogs()" style="width:100%;padding:12px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:14px;margin-bottom:8px;text-align:left;">📝 操作日志</button>' +
        '<button onclick="adminExportData()" style="width:100%;padding:12px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:14px;text-align:left;">📤 导出数据</button>' +
        '</div></div></div>';
    
    document.body.appendChild(modal);
    loadAdminStats();
};

// 加载管理员统计
window.loadAdminStats = function() {
    var totalUsersEl = document.getElementById('admin-total-users');
    var todayRecordsEl = document.getElementById('admin-today-records');
    
    if (typeof CloudSync !== 'undefined' && CloudSync.getAdminStats) {
        CloudSync.getAdminStats().then(function(stats) {
            if (totalUsersEl) totalUsersEl.textContent = stats[0].total || 0;
            if (todayRecordsEl) todayRecordsEl.textContent = stats[1].total || 0;
        }).catch(function() {
            if (totalUsersEl) totalUsersEl.textContent = '0';
            if (todayRecordsEl) todayRecordsEl.textContent = '0';
        });
    } else {
        // 本地模式：显示本地统计
        var localUsers = JSON.parse(localStorage.getItem('local_user_count') || '1');
        if (totalUsersEl) totalUsersEl.textContent = localUsers;
        if (todayRecordsEl) todayRecordsEl.textContent = '0';
    }
};

// 管理员功能占位
window.adminViewUsers = function() { window.showToast('用户管理功能开发中'); };
window.adminViewLogs = function() { window.showToast('操作日志功能开发中'); };
window.adminExportData = function() { window.showToast('数据导出功能开发中'); };

// 初始化角色标签
(function() {
    var role = window.getCurrentRole();
    setTimeout(function() {
        var label = document.getElementById('current-role-label');
        if (label && ROLE_MAP[role]) {
            label.textContent = '(' + ROLE_MAP[role].name + ')';
        }
    }, 500);
})();


// ============================================================
// ES6 Module 导出
// ============================================================

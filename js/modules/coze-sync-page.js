// ============================================================
// V298 扣子数据同步 - 可视化页面
// ============================================================

window.renderCozeSyncPage = function(container) {
    console.log('[V298] 渲染扣子数据同步页面');
    
    const status = window.CozeSync ? window.CozeSync.getSyncStatus() : { configured: false };
    
    container.innerHTML = `
        <div style="padding:20px;background:#f8f9fa;min-height:100vh;">
            <!-- 顶部栏 -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="window.closeCozeSyncPage()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">🔗 扣子数据同步</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 配置卡片 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:20px;">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">⚙️ API 配置</h3>
                
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">Access Token (PAT)</label>
                        <input type="password" id="coze-token" placeholder="pat_xxxxxxxxxx" value="${window.CozeSync ? window.CozeSync.config.accessToken : ''}" style="width:100%;padding:12px 16px;border:2px solid #eee;border-radius:10px;font-size:14px;box-sizing:border-box;" />
                    </div>
                    
                    <div>
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">Bot ID</label>
                        <input type="text" id="coze-bot-id" placeholder="734286681234567890" value="${window.CozeSync ? window.CozeSync.config.botId : ''}" style="width:100%;padding:12px 16px;border:2px solid #eee;border-radius:10px;font-size:14px;box-sizing:border-box;" />
                    </div>
                    
                    <button onclick="window.saveCozeConfig()" style="padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;width:100%;">
                        💾 保存配置
                    </button>
                </div>
            </div>
            
            <!-- 状态卡片 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:20px;">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">📊 同步状态</h3>
                
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="padding:12px;background:${status.configured ? '#e8f5e9' : '#fff3e0'};border-radius:10px;text-align:center;">
                        <div style="font-size:24px;">${status.configured ? '✅' : '⚠️'}</div>
                        <div style="font-size:13px;color:#666;">配置状态</div>
                        <div style="font-size:14px;font-weight:bold;color:${status.configured ? '#4caf50' : '#ff9800'};">${status.configured ? '已配置' : '未配置'}</div>
                    </div>
                    
                    <div style="padding:12px;background:#f5f5f5;border-radius:10px;text-align:center;">
                        <div style="font-size:24px;">📋</div>
                        <div style="font-size:13px;color:#666;">学习计划</div>
                        <div style="font-size:14px;font-weight:bold;color:#333;">${status.planTaskCount || 0} 个任务</div>
                    </div>
                    
                    <div style="padding:12px;background:#f5f5f5;border-radius:10px;text-align:center;">
                        <div style="font-size:24px;">🗺️</div>
                        <div style="font-size:13px;color:#666;">思维导图</div>
                        <div style="font-size:14px;font-weight:bold;color:#333;">${status.mindmapCount || 0} 个导图</div>
                    </div>
                    
                    <div style="padding:12px;background:#f5f5f5;border-radius:10px;text-align:center;">
                        <div style="font-size:24px;">🕐</div>
                        <div style="font-size:13px;color:#666;">上次同步</div>
                        <div style="font-size:12px;font-weight:bold;color:#666;">${status.planLastSync ? new Date(status.planLastSync).toLocaleDateString() : '从未同步'}</div>
                    </div>
                </div>
            </div>
            
            <!-- 同步操作卡片 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:20px;">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">🔄 同步操作</h3>
                
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <button onclick="window.syncAllWeeksFromCoze()" style="padding:14px;background:#e91e63;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:bold;">
                        <span style="font-size:18px;">📚</span>
                        批量同步Week1-Week10学习计划
                    </button>
                    
                    <button onclick="window.syncPlanFromCoze()" style="padding:14px;background:#4caf50;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                        <span style="font-size:18px;">📋</span>
                        从扣子同步学习计划
                    </button>
                    
                    <button onclick="window.syncMindMapFromCoze()" style="padding:14px;background:#9c27b0;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                        <span style="font-size:18px;">🗺️</span>
                        AI生成并导入思维导图
                    </button>
                    
                    <button onclick="window.uploadPlanToCoze()" style="padding:14px;background:#2196f3;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                        <span style="font-size:18px;">⬆️</span>
                        上传学习计划到扣子
                    </button>
                    
                    <button onclick="window.uploadMindMapToCoze()" style="padding:14px;background:#ff9800;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                        <span style="font-size:18px;">⬆️</span>
                        上传思维导图到扣子
                    </button>
                </div>
            </div>
            
            <!-- AI生成卡片 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:20px;">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">🤖 AI 工具</h3>
                
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div style="display:flex;gap:8px;">
                        <select id="ai-subject" style="flex:1;padding:12px;border:2px solid #eee;border-radius:10px;font-size:14px;">
                            <option value="数学">数学</option>
                            <option value="语文">语文</option>
                            <option value="英语">英语</option>
                            <option value="物理">物理</option>
                            <option value="化学">化学</option>
                        </select>
                        <select id="ai-difficulty" style="flex:1;padding:12px;border:2px solid #eee;border-radius:10px;font-size:14px;">
                            <option value="简单">简单</option>
                            <option value="中等" selected>中等</option>
                            <option value="困难">困难</option>
                        </select>
                    </div>
                    
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span style="font-size:14px;color:#666;">生成数量：</span>
                        <input type="number" id="ai-count" value="5" min="1" max="20" style="width:80px;padding:10px;border:2px solid #eee;border-radius:10px;font-size:14px;" />
                        <button onclick="window.generateQuestions()" style="flex:1;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">
                            🎯 生成练习题
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 日志区域 -->
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">📝 操作日志</h3>
                <div id="coze-log" style="background:#fafafa;border-radius:10px;padding:12px;font-family:monospace;font-size:12px;color:#666;max-height:200px;overflow-y:auto;min-height:100px;border:2px solid #eee;">
                    <div style="color:#999;">等待操作...</div>
                </div>
            </div>
            
            <!-- 版本提示 -->
            <div style="margin-top:20px;padding:12px;background:#e3f2fd;border-radius:12px;">
                <div style="font-size:12px;color:#1976d2;text-align:center;">✅ V298 - 扣子数据同步可视化面板</div>
            </div>
        </div>
    `;
    
    // 如果未配置，自动填入已有的Token和默认Bot ID
    if (window.CozeSync) {
        if (!window.CozeSync.config.accessToken) {
            document.getElementById('coze-token').value = 'pat_kaqK0gILxJXypmRXoo76YBV5YPe68CzkD6jX4JxDAdjywcSngSExOtFIgS5olupW';
        }
        if (!window.CozeSync.config.botId) {
            document.getElementById('coze-bot-id').value = '7642285667988586496';
        }
    }
};

// 保存配置
window.saveCozeConfig = function() {
    if (!window.CozeSync) {
        window.addCozeLog('❌ CozeSync模块未加载', 'error');
        return;
    }
    
    const token = document.getElementById('coze-token').value;
    const botId = document.getElementById('coze-bot-id').value;
    
    window.CozeSync.config.accessToken = token;
    window.CozeSync.config.botId = botId;
    window.CozeSync.saveConfig();
    
    window.addCozeLog('✅ 配置已保存', 'success');
    
    // 重新渲染以更新状态
    setTimeout(function() {
        const container = document.getElementById('app-container');
        if (container) {
            window.renderCozeSyncPage(container);
        }
    }, 500);
};

// 批量同步Week1-Week10学习计划
window.syncAllWeeksFromCoze = function() {
    window.addCozeLog('🔄 正在批量同步Week1-Week10学习计划...', 'info');
    
    window.CozeSync.syncAllWeeksFromCoze()
    .then(function(result) {
        if (result.success) {
            window.addCozeLog('✅ 同步成功！新增 ' + result.count + ' 个任务', 'success');
            // 刷新页面显示新数据
            setTimeout(function() {
                const container = document.getElementById('app-container');
                if (container) {
                    window.renderCozeSyncPage(container);
                }
            }, 500);
        } else {
            window.addCozeLog('❌ 同步失败: ' + (result.error || '未知错误'), 'error');
        }
    })
    .catch(function(error) {
        window.addCozeLog('❌ 同步异常: ' + error.message, 'error');
    });
};

// 同步学习计划
window.syncPlanFromCoze = function() {
    window.addCozeLog('🔄 正在从扣子同步学习计划...', 'info');
    
    window.CozeSync.syncPlanFromCoze()
    .then(function(result) {
        if (result.success) {
            window.addCozeLog('✅ 同步成功！导入 ' + result.count + ' 个任务', 'success');
            // 刷新页面显示新数据
            setTimeout(function() {
                const container = document.getElementById('app-container');
                if (container) {
                    window.renderCozeSyncPage(container);
                }
            }, 500);
        } else {
            window.addCozeLog('❌ 同步失败: ' + (result.error || '未知错误'), 'error');
        }
    })
    .catch(function(error) {
        window.addCozeLog('❌ 同步异常: ' + error.message, 'error');
    });
};

// 同步思维导图
window.syncMindMapFromCoze = function() {
    window.addCozeLog('🔄 正在请求AI生成思维导图...', 'info');
    
    window.CozeSync.syncMindMapFromCoze()
    .then(function(result) {
        if (result.success) {
            window.addCozeLog('✅ 生成成功！导图ID: ' + result.mapId, 'success');
        } else {
            window.addCozeLog('❌ 生成失败', 'error');
        }
    })
    .catch(function(error) {
        window.addCozeLog('❌ 生成异常: ' + error.message, 'error');
    });
};

// 上传学习计划
window.uploadPlanToCoze = function() {
    window.addCozeLog('⬆️ 正在上传学习计划到扣子...', 'info');
    
    window.CozeSync.uploadDataToCoze('plan')
    .then(function(result) {
        if (result.success) {
            window.addCozeLog('✅ 上传成功！', 'success');
        } else {
            window.addCozeLog('❌ 上传失败', 'error');
        }
    })
    .catch(function(error) {
        window.addCozeLog('❌ 上传异常: ' + error.message, 'error');
    });
};

// 上传思维导图
window.uploadMindMapToCoze = function() {
    window.addCozeLog('⬆️ 正在上传思维导图到扣子...', 'info');
    
    window.CozeSync.uploadDataToCoze('mindmap')
    .then(function(result) {
        if (result.success) {
            window.addCozeLog('✅ 上传成功！', 'success');
        } else {
            window.addCozeLog('❌ 上传失败', 'error');
        }
    })
    .catch(function(error) {
        window.addCozeLog('❌ 上传异常: ' + error.message, 'error');
    });
};

// 生成练习题
window.generateQuestions = function() {
    const subject = document.getElementById('ai-subject').value;
    const difficulty = document.getElementById('ai-difficulty').value;
    const count = document.getElementById('ai-count').value;
    
    window.addCozeLog('🤖 正在生成' + subject + '练习题（' + difficulty + '，' + count + '道）...', 'info');
    
    window.CozeSync.generateQuestions(subject, difficulty, count)
    .then(function(result) {
        window.addCozeLog('✅ 生成完成！', 'success');
        console.log('生成结果:', result);
    })
    .catch(function(error) {
        window.addCozeLog('❌ 生成异常: ' + error.message, 'error');
    });
};

// 添加日志
window.addCozeLog = function(message, type) {
    const logDiv = document.getElementById('coze-log');
    if (!logDiv) return;
    
    const time = new Date().toLocaleTimeString();
    const color = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';
    
    const entry = document.createElement('div');
    entry.style.cssText = 'padding:4px 0;border-bottom:1px solid #eee;color:' + color + ';';
    entry.innerHTML = '[' + time + '] ' + message;
    
    if (logDiv.firstChild && logDiv.firstChild.innerHTML.indexOf('等待操作') > -1) {
        logDiv.innerHTML = '';
    }
    
    logDiv.insertBefore(entry, logDiv.firstChild);
};

// 打开同步页面（从菜单调用）
window.openCozeSyncPage = function() {
    // 关闭用户菜单
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // 隐藏首页，显示同步页面
    const homePage = document.getElementById('page-home');
    if (homePage) {
        homePage.style.display = 'none';
    }
    
    // 创建或获取app容器
    let appContainer = document.getElementById('app-container');
    if (!appContainer) {
        appContainer = document.createElement('div');
        appContainer.id = 'app-container';
        appContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#f8f9fa;z-index:9999;overflow-y:auto;';
        document.body.appendChild(appContainer);
    }
    
    appContainer.style.display = 'block';
    window.renderCozeSyncPage(appContainer);
    
    console.log('[CozeSync] 已打开数据同步页面');
};

// 关闭同步页面，返回首页
window.closeCozeSyncPage = function() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.style.display = 'none';
    }
    
    const homePage = document.getElementById('page-home');
    if (homePage) {
        homePage.style.display = 'block';
    }
    
    console.log('[CozeSync] 已返回首页');
};

console.log('[V299] 扣子数据同步可视化页面加载完成');

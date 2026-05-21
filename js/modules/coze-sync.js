// ============================================================
// V297 扣子(Coze)平台数据同步模块
// ============================================================

window.CozeSync = {
    version: 'V297',
    inited: false,
    config: {
        apiBaseUrl: 'https://api.coze.cn',
        accessToken: '',
        botId: '',
        userId: 'cognitive_train_user_' + Date.now()
    },
    
    // 初始化
    init: function(config) {
        if (config) {
            Object.assign(this.config, config);
        }
        
        // 从localStorage读取token
        const savedToken = localStorage.getItem('coze_access_token');
        const savedBotId = localStorage.getItem('coze_bot_id');
        
        if (savedToken) {
            this.config.accessToken = savedToken;
        }
        if (savedBotId) {
            this.config.botId = savedBotId;
        }
        
        this.inited = true;
        console.log('[CozeSync] 扣子数据同步模块初始化完成');
    },
    
    // 保存配置
    saveConfig: function() {
        localStorage.setItem('coze_access_token', this.config.accessToken);
        localStorage.setItem('coze_bot_id', this.config.botId);
        console.log('[CozeSync] 配置已保存');
    },
    
    // 检查是否已配置
    isConfigured: function() {
        return this.config.accessToken && this.config.accessToken.length > 10 && 
               this.config.botId && this.config.botId.length > 5;
    },
    
    // ============= 核心API调用 =============
    
    // 发起对话
    chat: function(query, options) {
        const self = this;
        
        return new Promise(function(resolve, reject) {
            if (!self.isConfigured()) {
                reject(new Error('请先配置扣子API Token和Bot ID'));
                return;
            }
            
            const url = self.config.apiBaseUrl + '/v3/chat';
            const data = {
                bot_id: self.config.botId,
                user_id: self.config.userId,
                stream: options && options.stream ? true : false,
                additional_messages: [{
                    role: 'user',
                    content: query,
                    content_type: 'text'
                }]
            };
            
            if (options && options.conversationId) {
                data.conversation_id = options.conversationId;
            }
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + self.config.accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('API请求失败: ' + response.status);
                }
                return response.json();
            })
            .then(function(result) {
                console.log('[CozeSync] 对话响应:', result);
                resolve(result);
            })
            .catch(function(error) {
                console.error('[CozeSync] 对话失败:', error);
                reject(error);
            });
        });
    },
    
    // ============= 数据同步功能 =============
    
    // 同步学习计划：从扣子平台获取任务列表
    syncPlanFromCoze: function() {
        const self = this;
        
        return this.chat('请返回我的学习计划任务列表，使用JSON格式返回，格式为：[{"text":"任务名称","time":"09:00 - 10:00","icon":"📚","date":"2026-05-21"}]')
        .then(function(result) {
            try {
                // 解析AI返回的JSON
                const content = result.data.choices[0].message.content;
                const tasks = JSON.parse(content);
                
                if (Array.isArray(tasks)) {
                    // 获取现有任务
                    const savedData = window.DataSync.get('plan');
                    const existingTasks = savedData && savedData.tasks ? savedData.tasks : [];
                    
                    // 合并新任务（避免重复）
                    tasks.forEach(function(newTask) {
                        const exists = existingTasks.some(function(t) {
                            return t.text === newTask.text && t.date === newTask.date;
                        });
                        
                        if (!exists) {
                            const newId = Math.max(0, ...existingTasks.map(function(t) { return t.id; })) + 1;
                            existingTasks.push({
                                id: newId,
                                text: newTask.text,
                                time: newTask.time,
                                icon: newTask.icon || '📋',
                                completed: false,
                                date: newTask.date || new Date().toISOString().split('T')[0]
                            });
                        }
                    });
                    
                    // 保存到DataSync
                    window.DataSync.set('plan', {
                        tasks: existingTasks,
                        categories: ['语文', '数学', '英语', '其他'],
                        version: 1,
                        lastSync: new Date().toISOString()
                    });
                    
                    console.log('[CozeSync] 学习计划同步完成，共', tasks.length, '个任务');
                    return { success: true, count: tasks.length };
                }
            } catch (e) {
                console.error('[CozeSync] 解析学习计划失败:', e);
            }
            
            return { success: false, error: '解析失败' };
        });
    },
    
    // 同步思维导图：从扣子平台获取节点结构
    syncMindMapFromCoze: function() {
        const self = this;
        
        return this.chat('请返回一个学习思维导图的节点结构，使用JSON格式返回，格式为：{"name":"导图名称","nodes":[{"id":1,"text":"中心主题","x":50,"y":50,"color":"#667eea","isRoot":true},{"id":2,"text":"子节点","x":25,"y":28,"color":"#f093fb","parent":1}]}')
        .then(function(result) {
            try {
                const content = result.data.choices[0].message.content;
                const mapData = JSON.parse(content);
                
                if (mapData.nodes) {
                    // 获取现有导图
                    const savedData = window.DataSync.get('mindmap');
                    const maps = savedData && savedData.maps ? savedData.maps : {};
                    
                    // 创建新导图
                    const newId = 'coze_map_' + Date.now();
                    maps[newId] = {
                        id: newId,
                        name: mapData.name || 'AI生成导图',
                        createTime: new Date().toISOString(),
                        nodes: mapData.nodes
                    };
                    
                    // 保存到DataSync
                    window.DataSync.set('mindmap', {
                        maps: maps,
                        currentMapId: newId,
                        currentStyle: savedData && savedData.currentStyle ? savedData.currentStyle : 'default',
                        version: 1,
                        lastSync: new Date().toISOString()
                    });
                    
                    console.log('[CozeSync] 思维导图同步完成');
                    return { success: true, mapId: newId };
                }
            } catch (e) {
                console.error('[CozeSync] 解析思维导图失败:', e);
            }
            
            return { success: false, error: '解析失败' };
        });
    },
    
    // 上传本地数据到扣子平台
    uploadDataToCoze: function(moduleName) {
        const self = this;
        let data;
        
        switch(moduleName) {
            case 'plan':
                data = window.DataSync.get('plan');
                break;
            case 'mindmap':
                data = window.DataSync.get('mindmap');
                break;
            default:
                data = window.DataSync.get(moduleName);
        }
        
        return this.chat('请保存以下' + moduleName + '数据：\n' + JSON.stringify(data, null, 2))
        .then(function(result) {
            console.log('[CozeSync] 数据上传完成');
            return { success: true, result: result };
        });
    },
    
    // 生成练习题
    generateQuestions: function(subject, difficulty, count) {
        const prompt = '请生成' + count + '道' + subject + '练习题，难度' + difficulty + '，使用JSON格式返回：[{"id":1,"question":"题目内容","options":["A","B","C","D"],"answer":"A","analysis":"解析"}]';
        return this.chat(prompt);
    },
    
    // ============= 状态同步 =============
    
    // 获取同步状态
    getSyncStatus: function() {
        const planData = window.DataSync.get('plan');
        const mindmapData = window.DataSync.get('mindmap');
        
        return {
            configured: this.isConfigured(),
            planLastSync: planData && planData.lastSync ? planData.lastSync : null,
            mindmapLastSync: mindmapData && mindmapData.lastSync ? mindmapData.lastSync : null,
            planTaskCount: planData && planData.tasks ? planData.tasks.length : 0,
            mindmapCount: mindmapData && mindmapData.maps ? Object.keys(mindmapData.maps).length : 0
        };
    }
};

// 自动初始化
window.CozeSync.init();

console.log('[V297] 扣子数据同步模块加载完成');

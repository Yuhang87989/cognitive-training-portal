// ==========================================
// V286 统一数据同步与管理系统
// 统一管理所有模块的数据存储、同步、备份、用户信息
// ==========================================

window.DataSync = {
    version: 'V286',
    inited: false,
    
    // 所有模块的数据存储Key映射
    modules: {
        // 用户信息
        user: {
            storageKey: 'cognitive_user',
            defaultData: { 
                id: 'user_' + Date.now(),
                name: '学习者',
                avatar: '👤',
                level: 1,
                exp: 0,
                totalStudyTime: 0,
                totalDays: 1,
                joinDate: new Date().toISOString().slice(0, 10),
                settings: {
                    soundEnabled: true,
                    theme: 'light',
                    notification: true
                },
                version: 1
            }
        },
        // 思维导图
        mindmap: {
            storageKey: 'mindmap_data',
            defaultData: { nodes: [], connections: [], version: 1 }
        },
        // 学习图书馆
        library: {
            storageKey: 'learning_library_data',
            defaultData: { books: [], collections: [], readingProgress: {}, version: 1 }
        },
        // 虚拟宠物
        pet: {
            storageKey: 'virtual_pet_data',
            defaultData: { name: '小助手', level: 1, exp: 0, health: 100, happiness: 100, version: 1 }
        },
        // 学习计划
        plan: {
            storageKey: 'learning_plan_tasks',
            defaultData: { tasks: [], categories: ['语文', '数学', '英语', '其他'], version: 1 }
        },
        // 学习日记
        notepad: {
            storageKey: 'learning_diary_data',
            defaultData: { entries: [], version: 1 }
        },
        // 模拟考试
        exam: {
            storageKey: 'exam_data',
            defaultData: { papers: [], records: [], version: 1 }
        },
        // AI对话历史
        aiHistory: {
            storageKey: 'ai_chat_history',
            defaultData: { conversations: [], version: 1 }
        },
        // 学习统计
        stats: {
            storageKey: 'learning_stats',
            defaultData: { 
                dailyRecords: {},
                weeklyGoals: {},
                achievements: [],
                version: 1
            }
        }
    },
    
    // ===== 用户管理 =====
    user: {
        // 获取当前用户
        getCurrent: function() {
            return DataSync.get('user');
        },
        
        // 更新用户信息
        update: function(userData) {
            var current = DataSync.get('user');
            var updated = Object.assign({}, current, userData);
            return DataSync.set('user', updated);
        },
        
        // 获取用户等级
        getLevel: function() {
            var user = this.getCurrent();
            return user.level || 1;
        },
        
        // 增加经验值
        addExp: function(exp) {
            var user = this.getCurrent();
            user.exp = (user.exp || 0) + exp;
            
            // 检查升级
            var levelUpExp = user.level * 100;
            while (user.exp >= levelUpExp) {
                user.exp -= levelUpExp;
                user.level = (user.level || 1) + 1;
                levelUpExp = user.level * 100;
                console.log('[DataSync] 用户升级到 Lv.' + user.level);
            }
            
            return DataSync.set('user', user);
        },
        
        // 增加学习时间
        addStudyTime: function(minutes) {
            var user = this.getCurrent();
            user.totalStudyTime = (user.totalStudyTime || 0) + minutes;
            
            // 同时更新每日统计
            DataSync.stats.addDailyStudyTime(minutes);
            
            return DataSync.set('user', user);
        },
        
        // 记录连续学习天数
        recordStudyDay: function() {
            var today = new Date().toISOString().slice(0, 10);
            var stats = DataSync.get('stats');
            
            if (!stats.dailyRecords[today]) {
                stats.dailyRecords[today] = {
                    date: today,
                    studyTime: 0,
                    completed: []
                };
                
                // 更新总天数
                var user = this.getCurrent();
                user.totalDays = Object.keys(stats.dailyRecords).length;
                DataSync.set('user', user);
            }
            
            DataSync.set('stats', stats);
        },
        
        // 获取学习统计
        getStats: function(days) {
            var stats = DataSync.get('stats');
            var user = this.getCurrent();
            var records = stats.dailyRecords || {};
            var dates = Object.keys(records).sort().reverse();
            
            if (days) {
                dates = dates.slice(0, days);
            }
            
            var totalTime = 0;
            dates.forEach(function(date) {
                totalTime += records[date].studyTime || 0;
            });
            
            return {
                totalDays: user.totalDays || 1,
                totalStudyTime: user.totalStudyTime || 0,
                level: user.level || 1,
                exp: user.exp || 0,
                recentDays: dates.length,
                recentStudyTime: totalTime,
                dailyRecords: records
            };
        }
    },
    
    // ===== 每日统计 =====
    stats: {
        // 增加每日学习时间
        addDailyStudyTime: function(minutes) {
            var today = new Date().toISOString().slice(0, 10);
            var stats = DataSync.get('stats');
            
            if (!stats.dailyRecords[today]) {
                stats.dailyRecords[today] = {
                    date: today,
                    studyTime: 0,
                    completed: []
                };
            }
            
            stats.dailyRecords[today].studyTime += minutes;
            DataSync.set('stats', stats);
        },
        
        // 记录完成的任务
        recordCompleted: function(moduleName, itemId) {
            var today = new Date().toISOString().slice(0, 10);
            var stats = DataSync.get('stats');
            
            if (!stats.dailyRecords[today]) {
                stats.dailyRecords[today] = {
                    date: today,
                    studyTime: 0,
                    completed: []
                };
            }
            
            var record = {
                module: moduleName,
                itemId: itemId,
                time: new Date().toISOString()
            };
            
            stats.dailyRecords[today].completed.push(record);
            DataSync.set('stats', stats);
            
            // 增加经验值
            DataSync.user.addExp(5);
        },
        
        // 获取连续学习天数
        getStreakDays: function() {
            var stats = DataSync.get('stats');
            var records = stats.dailyRecords || {};
            var dates = Object.keys(records).sort().reverse();
            
            if (dates.length === 0) return 0;
            
            var streak = 0;
            var today = new Date();
            
            for (var i = 0; i < dates.length; i++) {
                var recordDate = new Date(dates[i]);
                var diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === i) {
                    streak++;
                } else {
                    break;
                }
            }
            
            return streak;
        }
    },
    
    // ===== 数据同步核心 =====
    
    // 初始化
    init: function() {
        if (this.inited) return;
        
        console.log('[DataSync] 数据同步系统初始化 V286');
        
        // 初始化所有模块的默认数据结构
        this._initModuleDefaults();
        
        // 启动定时自动保存（5秒间隔）
        setInterval(function() {
            DataSync.autoSave();
        }, 5000);
        
        // 监听页面关闭前自动保存
        window.addEventListener('beforeunload', function() {
            DataSync.syncAllToIndexedDB();
        });
        
        // 初始化用户学习记录
        this.user.recordStudyDay();
        
        this.inited = true;
    },
    
    // 初始化模块默认数据结构
    _initModuleDefaults: function() {
        for (var moduleName in this.modules) {
            var module = this.modules[moduleName];
            var existing = localStorage.getItem(module.storageKey);
            
            if (!existing) {
                // 没有数据，设置默认值
                localStorage.setItem(module.storageKey, JSON.stringify(module.defaultData));
                console.log('[DataSync] 初始化 ' + moduleName + ' 默认数据');
            } else {
                // 数据迁移检查
                this._migrateData(moduleName, existing);
            }
        }
    },
    
    // 数据迁移：处理版本差异
    _migrateData: function(moduleName, existingData) {
        try {
            var data = JSON.parse(existingData);
            var module = this.modules[moduleName];
            
            // 如果没有版本号或者版本号过低，执行迁移
            if (!data.version || data.version < module.defaultData.version) {
                console.log('[DataSync] 迁移 ' + moduleName + ' 数据 v' + (data.version || 0) + ' -> v' + module.defaultData.version);
                
                // 合并默认数据结构，保留现有数据
                var mergedData = Object.assign({}, module.defaultData, data);
                mergedData.version = module.defaultData.version;
                
                localStorage.setItem(module.storageKey, JSON.stringify(mergedData));
            }
        } catch (e) {
            console.error('[DataSync] 数据迁移失败 ' + moduleName, e);
        }
    },
    
    // 获取模块数据
    get: function(moduleName) {
        var module = this.modules[moduleName];
        if (!module) {
            console.error('[DataSync] 未知模块: ' + moduleName);
            return null;
        }
        
        try {
            var data = localStorage.getItem(module.storageKey);
            return data ? JSON.parse(data) : module.defaultData;
        } catch (e) {
            console.error('[DataSync] 读取数据失败 ' + moduleName, e);
            return module.defaultData;
        }
    },
    
    // 保存模块数据
    set: function(moduleName, data) {
        var module = this.modules[moduleName];
        if (!module) {
            console.error('[DataSync] 未知模块: ' + moduleName);
            return false;
        }
        
        try {
            // 添加版本号
            if (!data.version) {
                data.version = module.defaultData.version;
            }
            
            localStorage.setItem(module.storageKey, JSON.stringify(data));
            
            // 异步同步到IndexedDB
            this._syncToIndexedDB(moduleName, data);
            
            return true;
        } catch (e) {
            console.error('[DataSync] 保存数据失败 ' + moduleName, e);
            return false;
        }
    },
    
    // 同步到IndexedDB（持久化备份）
    _syncToIndexedDB: function(moduleName, data) {
        if (window.LocalDB && window.LocalDB.save) {
            window.LocalDB.save('moduleData', data, moduleName).catch(function(e) {
                console.warn('[DataSync] IndexedDB同步失败 ' + moduleName, e);
            });
        }
    },
    
    // 自动保存：将所有内存数据同步到存储
    autoSave: function() {
        console.log('[DataSync] 执行自动保存检查');
    },
    
    // 同步所有数据到IndexedDB
    syncAllToIndexedDB: function() {
        console.log('[DataSync] 同步所有数据到IndexedDB');
        
        for (var moduleName in this.modules) {
            var data = this.get(moduleName);
            if (data) {
                this._syncToIndexedDB(moduleName, data);
            }
        }
    },
    
    // 从IndexedDB恢复所有数据
    restoreFromIndexedDB: function(callback) {
        console.log('[DataSync] 从IndexedDB恢复数据');
        
        if (!window.LocalDB || !window.LocalDB.getAll) {
            if (callback) callback({ success: false, error: 'LocalDB不可用' });
            return;
        }
        
        window.LocalDB.getAll('moduleData').then(function(items) {
            var restored = 0;
            
            items.forEach(function(item) {
                var moduleName = item.id;
                if (DataSync.modules[moduleName]) {
                    localStorage.setItem(DataSync.modules[moduleName].storageKey, JSON.stringify(item.data));
                    restored++;
                }
            });
            
            console.log('[DataSync] 恢复了 ' + restored + ' 个模块数据');
            
            if (callback) callback({ success: true, restored: restored });
        }).catch(function(e) {
            console.error('[DataSync] 恢复失败', e);
            if (callback) callback({ success: false, error: e });
        });
    },
    
    // 导出所有数据
    exportAll: function() {
        var exportData = {
            version: this.version,
            exportTime: new Date().toISOString(),
            modules: {}
        };
        
        for (var moduleName in this.modules) {
            exportData.modules[moduleName] = this.get(moduleName);
        }
        
        return exportData;
    },
    
    // 导入所有数据
    importAll: function(exportData, callback) {
        console.log('[DataSync] 开始导入数据');
        
        var success = 0;
        var errors = [];
        
        for (var moduleName in exportData.modules) {
            if (this.modules[moduleName]) {
                var result = this.set(moduleName, exportData.modules[moduleName]);
                if (result) {
                    success++;
                } else {
                    errors.push(moduleName);
                }
            }
        }
        
        console.log('[DataSync] 导入完成: 成功 ' + success + ', 失败 ' + errors.length);
        
        if (callback) callback({ success: success, errors: errors });
        
        return { success: success, errors: errors };
    },
    
    // 下载备份文件
    downloadBackup: function() {
        var exportData = this.exportAll();
        var dataStr = JSON.stringify(exportData, null, 2);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        var exportFileDefaultName = 'cognitive-training-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        
        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('[DataSync] 备份文件已下载');
    },
    
    // 清除所有数据（谨慎使用）
    clearAll: function(confirm) {
        if (!confirm) {
            console.warn('[DataSync] 请确认清除操作');
            return;
        }
        
        for (var moduleName in this.modules) {
            var module = this.modules[moduleName];
            localStorage.removeItem(module.storageKey);
        }
        
        console.log('[DataSync] 所有数据已清除');
        
        // 重新初始化
        this._initModuleDefaults();
    },
    
    // 获取数据大小统计
    getStorageStats: function() {
        var stats = {
            totalSize: 0,
            modules: {}
        };
        
        for (var moduleName in this.modules) {
            var module = this.modules[moduleName];
            var data = localStorage.getItem(module.storageKey);
            var size = data ? data.length : 0;
            
            stats.modules[moduleName] = {
                size: size,
                sizeKB: Math.round(size / 1024 * 100) / 100
            };
            
            stats.totalSize += size;
        }
        
        stats.totalSizeKB = Math.round(stats.totalSize / 1024 * 100) / 100;
        
        return stats;
    },
    
    // 检查存储空间使用情况
    checkStorageQuota: function() {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(function(estimate) {
                var usedKB = Math.round(estimate.usage / 1024);
                var totalKB = Math.round(estimate.quota / 1024);
                var percent = Math.round(estimate.usage / estimate.quota * 100);
                
                console.log('[DataSync] 存储空间: ' + usedKB + 'KB / ' + totalKB + 'KB (' + percent + '%)');
            });
        }
    }
};

// 挂载到window
window.dataSync = DataSync;

// 自动初始化
setTimeout(function() {
    DataSync.init();
}, 100);

console.log('[DataSync] 模块已加载 V286');

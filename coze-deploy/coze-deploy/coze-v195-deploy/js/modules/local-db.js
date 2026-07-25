// ==========================================
// V195 本地IndexedDB数据库
// 防止系统更新丢失数据
// ==========================================

window.LocalDB = {
    dbName: 'CognitiveTrainingDB',
    version: 1,
    db: null,
    
    // 初始化数据库
    init: function(callback) {
        if (this.db) {
            if (callback) callback(this.db);
            return;
        }
        
        const request = indexedDB.open(this.dbName, this.version);
        
        request.onerror = function(e) {
            console.error('IndexedDB打开失败:', e);
            if (callback) callback(null);
        };
        
        request.onupgradeneeded = function(e) {
            const db = e.target.result;
            
            // 创建表
            if (!db.objectStoreNames.contains('userInfo')) {
                db.createObjectStore('userInfo', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('questionBank')) {
                db.createObjectStore('questionBank', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('studyMethods')) {
                db.createObjectStore('studyMethods', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('thinkingTraining')) {
                db.createObjectStore('thinkingTraining', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('wrongBook')) {
                db.createObjectStore('wrongBook', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('chatHistory')) {
                db.createObjectStore('chatHistory', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('trainingRecords')) {
                db.createObjectStore('trainingRecords', { keyPath: 'id' });
            }
            
            console.log('IndexedDB表创建完成');
        };
        
        request.onsuccess = function(e) {
            LocalDB.db = e.target.result;
            console.log('IndexedDB初始化成功');
            if (callback) callback(LocalDB.db);
        };
    },
    
    // 保存数据
    save: function(storeName, data, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const item = { id: id || Date.now().toString(), data: data, timestamp: Date.now() };
                
                const req = store.put(item);
                req.onsuccess = function() { resolve(true); };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 获取数据
    get: function(storeName, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.get(id);
                
                req.onsuccess = function() {
                    resolve(req.result ? req.result.data : null);
                };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 获取所有数据
    getAll: function(storeName) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.getAll();
                
                req.onsuccess = function() {
                    resolve(req.result || []);
                };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 删除数据
    delete: function(storeName, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const req = store.delete(id);
                
                req.onsuccess = function() { resolve(true); };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 导出全部数据为JSON
    exportAll: function() {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const stores = ['userInfo', 'questionBank', 'studyMethods', 
                               'thinkingTraining', 'wrongBook', 'chatHistory', 'trainingRecords'];
                const exportData = {
                    version: LocalDB.version,
                    exportTime: new Date().toISOString(),
                    data: {}
                };
                
                let done = 0;
                stores.forEach(function(storeName) {
                    LocalDB.getAll(storeName).then(function(items) {
                        exportData.data[storeName] = items;
                        done++;
                        if (done === stores.length) {
                            resolve(exportData);
                        }
                    }).catch(reject);
                });
            });
        });
    },
    
    // 从JSON导入全部数据
    importAll: function(exportData) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const stores = Object.keys(exportData.data || {});
                let done = 0;
                let errors = [];
                
                stores.forEach(function(storeName) {
                    const items = exportData.data[storeName] || [];
                    let itemDone = 0;
                    
                    if (items.length === 0) {
                        done++;
                        if (done === stores.length) resolve({ success: done, errors: errors });
                        return;
                    }
                    
                    items.forEach(function(item) {
                        LocalDB.save(storeName, item.data, item.id).then(function() {
                            itemDone++;
                            if (itemDone === items.length) {
                                done++;
                                if (done === stores.length) resolve({ success: done, errors: errors });
                            }
                        }).catch(function(e) {
                            errors.push(storeName + ': ' + e);
                            itemDone++;
                            if (itemDone === items.length) {
                                done++;
                                if (done === stores.length) resolve({ success: done, errors: errors });
                            }
                        });
                    });
                });
            });
        });
    },
    
    // 下载备份文件
    downloadBackup: function() {
        LocalDB.exportAll().then(function(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '认知训练备份_' + new Date().toISOString().slice(0, 10) + '.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('✅ 备份已下载');
        }).catch(function() {
            showToast('❌ 备份失败');
        });
    },
    
    // 选择备份文件导入
    importFromFile: function(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    LocalDB.importAll(data).then(function(result) {
                        showToast('✅ 导入完成，恢复了' + result.success + '项数据');
                        if (callback) callback(true);
                        // 同时同步到localStorage
                        syncDBToLocalStorage();
                    }).catch(function() {
                        showToast('❌ 导入失败');
                        if (callback) callback(false);
                    });
                } catch(e) {
                    showToast('❌ 文件格式错误');
                    if (callback) callback(false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
};

// 数据双向同步：IndexedDB <-> localStorage
window.syncDBToLocalStorage = function() {
    // 从localStorage同步到IndexedDB
    const user = getCurrentUserData();
    if (user) LocalDB.save('userInfo', user, 'currentUser');
    
    // 错题本同步
    if (window.wrongBook && window.wrongBook.questions) {
        LocalDB.save('wrongBook', window.wrongBook.questions, 'all');
    }
    
    console.log('数据已同步到本地数据库');
};

window.syncLocalStorageToDB = function() {
    // 从IndexedDB恢复到localStorage
    LocalDB.get('userInfo', 'currentUser').then(function(user) {
        if (user) localStorage.setItem('cognitive_user', JSON.stringify(user));
    });
};

// 页面关闭时自动保存
window.addEventListener('beforeunload', syncDBToLocalStorage);

// 初始化
LocalDB.init();

// ==========================================
// 自动备份配置
// ==========================================
window.AutoBackup = {
    enabled: localStorage.getItem('auto_backup_enabled') === 'true',
    intervalHours: parseInt(localStorage.getItem('auto_backup_interval')) || 24,
    lastBackupTime: parseInt(localStorage.getItem('last_backup_time')) || 0,
    
    toggle: function(enabled) {
        this.enabled = enabled;
        localStorage.setItem('auto_backup_enabled', enabled ? 'true' : 'false');
        showToast(enabled ? '✅ 自动备份已开启' : '自动备份已关闭');
    },
    
    setInterval: function(hours) {
        this.intervalHours = hours;
        localStorage.setItem('auto_backup_interval', hours);
    },
    
    shouldBackup: function() {
        if (!this.enabled) return false;
        const now = Date.now();
        const intervalMs = this.intervalHours * 60 * 60 * 1000;
        return now - this.lastBackupTime > intervalMs;
    },
    
    doBackup: function() {
        return new Promise(function(resolve) {
            LocalDB.exportAll().then(function(data) {
                localStorage.setItem('auto_backup_data', JSON.stringify(data));
                localStorage.setItem('last_backup_time', Date.now().toString());
                AutoBackup.lastBackupTime = Date.now();
                console.log('自动备份完成:', new Date().toLocaleString());
                resolve(true);
            }).catch(function() {
                resolve(false);
            });
        });
    },
    
    getLastBackupTime: function() {
        if (this.lastBackupTime === 0) return '从未备份';
        return new Date(this.lastBackupTime).toLocaleString();
    }
};

// 页面加载时检查是否需要自动备份
setTimeout(function() {
    if (AutoBackup.shouldBackup()) {
        AutoBackup.doBackup();
    }
}, 3000); // 页面加载3秒后检查

// 渲染备份管理界面
window.renderBackupManager = function(container) {
    const html = `
    <div style="padding:16px;">
        <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">💾 数据备份与恢复</h3>
        
        <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-size:14px;font-weight:600;">🔄 自动备份</span>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                    <input type="checkbox" id="auto-backup-toggle" 
                        ${AutoBackup.enabled ? 'checked' : ''} 
                        onchange="AutoBackup.toggle(this.checked)"
                        style="width:18px;height:18px;">
                    <span style="font-size:13px;">开启</span>
                </label>
            </div>
            <div style="font-size:12px;color:#666;">
                <div>备份频率：每 ${AutoBackup.intervalHours} 小时一次</div>
                <div>上次备份：${AutoBackup.getLastBackupTime()}</div>
            </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <button onclick="LocalDB.downloadBackup()" 
                style="padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">
                📥 下载备份文件
            </button>
            <button onclick="LocalDB.importFromFile()" 
                style="padding:12px;background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">
                📤 从文件恢复
            </button>
        </div>
        
        <div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;font-size:12px;color:#856404;">
            ⚠️ 提示：更新系统前建议先下载备份文件，更新后导入即可恢复所有数据
        </div>
    </div>`;
    
    container.innerHTML = html;
};

// 注册备份模块
if (typeof CTM !== 'undefined') {
    CTM.registerModule('backup', {
        name: '数据备份',
        icon: '💾',
        render: renderBackupManager
    });
}

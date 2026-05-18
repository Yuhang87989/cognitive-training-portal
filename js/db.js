// 版本: V152
// IndexedDB 本地数据库模块

window.DB = (function() {
    const DB_NAME = 'CognitiveTrainingDB';
    const DB_VERSION = 1;
    let dbInstance = null;

    // 初始化数据库
    function init() {
        return new Promise(function(resolve, reject) {
            if (dbInstance) {
                resolve(dbInstance);
                return;
            }
            var request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                // 用户表 - 以用户id为key
                if (!db.objectStoreNames.contains('users')) {
                    var userStore = db.createObjectStore('users', { keyPath: 'id' });
                    userStore.createIndex('name', 'name', { unique: false });
                }
                // 设置表 - 全局设置
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                console.log('[DB] 数据库创建/升级完成');
            };
            
            request.onsuccess = function(event) {
                dbInstance = event.target.result;
                console.log('[DB] 数据库打开成功');
                resolve(dbInstance);
            };
            
            request.onerror = function(event) {
                console.error('[DB] 数据库打开失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 通用事务操作
    function transaction(storeName, mode) {
        if (!dbInstance) throw new Error('[DB] 数据库未初始化');
        var tx = dbInstance.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    // 获取单个用户
    function getUser(userId) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readonly');
                var request = store.get(userId);
                request.onsuccess = function() { resolve(request.result || null); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取所有用户
    function getAllUsers() {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readonly');
                var request = store.getAll();
                request.onsuccess = function() { resolve(request.result || []); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存用户
    function saveUser(user) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readwrite');
                var request = store.put(user);
                request.onsuccess = function() { resolve(user); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存所有用户
    function saveAllUsers(users) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var tx = dbInstance.transaction('users', 'readwrite');
                var store = tx.objectStore('users');
                // 先清空再写入
                store.clear();
                users.forEach(function(user) {
                    store.put(user);
                });
                tx.oncomplete = function() { resolve(); };
                tx.onerror = function() { reject(tx.error); };
            }).catch(reject);
        });
    }

    // 删除用户
    function deleteUser(userId) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readwrite');
                var request = store.delete(userId);
                request.onsuccess = function() { resolve(); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取设置
    function getSetting(key) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('settings', 'readonly');
                var request = store.get(key);
                request.onsuccess = function() { 
                    resolve(request.result ? request.result.value : null); 
                };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存设置
    function saveSetting(key, value) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('settings', 'readwrite');
                var request = store.put({ key: key, value: value });
                request.onsuccess = function() { resolve(); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取当前用户
    function getCurrentUser() {
        return getSetting('currentUser').then(function(userId) {
            if (!userId) return null;
            return getUser(userId);
        });
    }

    // 设置当前用户
    function setCurrentUser(userId) {
        return saveSetting('currentUser', userId);
    }

    // 获取当前用户ID
    function getCurrentUserId() {
        return getSetting('currentUser');
    }

    // 清空所有数据
    function clearAll() {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var tx = dbInstance.transaction(['users', 'settings'], 'readwrite');
                tx.objectStore('users').clear();
                tx.objectStore('settings').clear();
                tx.oncomplete = function() { resolve(); };
                tx.onerror = function() { reject(tx.error); };
            }).catch(reject);
        });
    }

    // 从localStorage迁移数据
    function migrateFromLocalStorage() {
        return new Promise(function(resolve, reject) {
            var STORAGE_KEY = 'cognitive_training_portal_data';
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    console.log('[Migration] localStorage无数据，跳过迁移');
                    resolve(false);
                    return;
                }
                var data = JSON.parse(raw);
                if (!data || !data.users || data.users.length === 0) {
                    console.log('[Migration] localStorage数据为空，跳过迁移');
                    resolve(false);
                    return;
                }
                
                console.log('[Migration] 开始从localStorage迁移 ' + data.users.length + ' 个用户');
                
                init().then(function() {
                    var tx = dbInstance.transaction(['users', 'settings'], 'readwrite');
                    var userStore = tx.objectStore('users');
                    var settingsStore = tx.objectStore('settings');
                    
                    // 迁移用户数据
                    data.users.forEach(function(user) {
                        userStore.put(user);
                        console.log('[Migration] 迁移用户:', user.name || user.id);
                    });
                    
                    // 迁移设置
                    if (data.currentUser) {
                        settingsStore.put({ key: 'currentUser', value: data.currentUser });
                    }
                    settingsStore.put({ key: 'migrated', value: true });
                    settingsStore.put({ key: 'migrateTime', value: new Date().toISOString() });
                    
                    tx.oncomplete = function() {
                        console.log('[Migration] 迁移完成！共迁移 ' + data.users.length + ' 个用户');
                        // 保留localStorage数据作为备份，不删除
                        resolve(true);
                    };
                    tx.onerror = function() {
                        console.error('[Migration] 迁移失败:', tx.error);
                        reject(tx.error);
                    };
                }).catch(reject);
            } catch(e) {
                console.error('[Migration] 迁移异常:', e);
                resolve(false);
            }
        });
    }

    // 检查并执行迁移
    function checkAndMigrate() {
        return new Promise(function(resolve) {
            init().then(function() {
                return getSetting('migrated');
            }).then(function(migrated) {
                if (migrated) {
                    console.log('[Migration] 已迁移过，跳过');
                    resolve(false);
                    return;
                }
                return migrateFromLocalStorage();
            }).then(function(result) {
                resolve(result);
            }).catch(function(e) {
                console.error('[Migration] 检查迁移失败:', e);
                resolve(false);
            });
        });
    }

    // 导出提示
    console.log('[DB] IndexedDB模块已加载');

    return {
        init: init,
        getUser: getUser,
        getAllUsers: getAllUsers,
        saveUser: saveUser,
        saveAllUsers: saveAllUsers,
        deleteUser: deleteUser,
        getSetting: getSetting,
        saveSetting: saveSetting,
        getCurrentUser: getCurrentUser,
        getCurrentUserId: getCurrentUserId,
        setCurrentUser: setCurrentUser,
        clearAll: clearAll,
        migrateFromLocalStorage: migrateFromLocalStorage,
        checkAndMigrate: checkAndMigrate
    };
})();

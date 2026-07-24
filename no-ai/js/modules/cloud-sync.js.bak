// ==========================================
// CloudBase 云数据库同步模块
// V403 新增：微信小程序云开发数据库接入
// 支持：用户数据云端持久化、训练记录实时保存、家长监管、后台管理
// 兼容：浏览器访问时降级为纯localStorage模式
// ==========================================

window.CloudSync = {
    version: 'V403',
    enabled: false,       // 是否启用云同步（仅在小程序web-view环境启用）
    envId: '',            // CloudBase 环境ID
    openid: '',           // 当前用户微信OpenID
    role: 'student',      // 当前角色：student | parent | admin
    db: null,             // 云数据库引用
    syncQueue: [],        // 待同步队列（离线时缓存）
    syncing: false,       // 是否正在同步
    lastSyncTime: 0,      // 上次同步时间戳
    initRetryCount: 0,    // 初始化重试次数
    
    // ===== 初始化 =====
    init: function() {
        // 检测是否在微信小程序 web-view 环境
        var params = this._getUrlParams();
        var isWxMini = /miniProgram/i.test(navigator.userAgent) || params.openid;
        
        if (!isWxMini) {
            console.log('[CloudSync] 非小程序环境，使用纯本地模式');
            this.enabled = false;
            return;
        }
        
        this.openid = params.openid || '';
        this.envId = params.env || '';
        
        if (!this.openid) {
            console.warn('[CloudSync] 缺少openid参数，云同步不可用');
            this.enabled = false;
            return;
        }
        
        console.log('[CloudSync] 小程序环境检测到，openid:', this.openid);
        
        // 尝试初始化 CloudBase SDK
        this._initCloudBase();
    },
    
    // 初始化 CloudBase SDK
    _initCloudBase: function() {
        var self = this;
        
        // 检查是否已加载 CloudBase SDK
        if (typeof cloudbase !== 'undefined') {
            this._connectCloudBase();
            return;
        }
        
        // 动态加载 CloudBase JS SDK
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/@cloudbase/js-sdk@latest/dist/cloudbase.full.js';
        script.onload = function() {
            console.log('[CloudSync] CloudBase SDK 加载成功');
            self._connectCloudBase();
        };
        script.onerror = function() {
            console.warn('[CloudSync] CloudBase SDK 加载失败，降级为本地模式');
            self.enabled = false;
        };
        document.head.appendChild(script);
    },
    
    // 连接 CloudBase
    _connectCloudBase: function() {
        try {
            var app = cloudbase.init({
                env: this.envId || 'cognitive-training-12345'
            });
            
            // 匿名登录（web-view内已通过小程序获取openid）
            var self = this;
            app.auth().anonymousAuthProvider().signIn().then(function() {
                self.db = app.database();
                self.enabled = true;
                console.log('[CloudSync] CloudBase 连接成功');
                
                // 首次同步：从云端拉取数据
                self.pullAll();
                
                // 注册定时同步（30秒）
                setInterval(function() {
                    self._processSyncQueue();
                }, 30000);
                
                // 页面关闭前同步
                window.addEventListener('beforeunload', function() {
                    self._processSyncQueue();
                });
            }).catch(function(err) {
                console.warn('[CloudSync] CloudBase 登录失败:', err);
                self.enabled = false;
            });
        } catch(e) {
            console.warn('[CloudSync] CloudBase 初始化异常:', e);
            this.enabled = false;
        }
    },
    
    // ===== URL参数解析 =====
    _getUrlParams: function() {
        var params = {};
        var search = window.location.search.substring(1);
        var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair[0]) {
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
        }
        return params;
    },
    
    // ===== 用户管理 =====
    
    // 获取或创建云端用户
    getOrCreateUser: function() {
        if (!this.enabled || !this.db) return Promise.resolve(null);
        
        var self = this;
        return this.db.collection('users').where({
            _openid: this.openid
        }).get().then(function(res) {
            if (res.data && res.data.length > 0) {
                // 用户已存在
                var cloudUser = res.data[0];
                self.role = cloudUser.role || 'student';
                console.log('[CloudSync] 云端用户已存在:', cloudUser.name, '角色:', self.role);
                return cloudUser;
            } else {
                // 首次使用，从本地数据创建云端用户
                var localUser = window.getCurrentUserData ? window.getCurrentUserData() : null;
                var newUser = {
                    _openid: self.openid,
                    role: 'student',
                    name: localUser ? localUser.name : '学习者',
                    avatar: localUser ? (localUser.avatar || '🧒') : '🧒',
                    grade: localUser ? (localUser.grade || 7) : 7,
                    difficulty: localUser ? (localUser.difficulty || 1) : 1,
                    points: localUser ? (localUser.points || 0) : 0,
                    settings: {
                        soundEnabled: true,
                        theme: 'light',
                        notification: true
                    },
                    parentOpenid: '',
                    children: [],
                    createdAt: new Date().toISOString(),
                    lastActiveAt: new Date().toISOString()
                };
                
                return self.db.collection('users').add({
                    data: newUser
                }).then(function(addRes) {
                    console.log('[CloudSync] 云端用户创建成功');
                    newUser._id = addRes._id;
                    return newUser;
                });
            }
        }).catch(function(err) {
            console.warn('[CloudSync] 获取用户失败:', err);
            return null;
        });
    },
    
    // ===== 数据同步核心 =====
    
    // 保存用户数据到云端
    saveUserData: function(type, data) {
        if (!this.enabled || !this.db) return;
        
        var self = this;
        var query = {
            _openid: this.openid,
            type: type
        };
        
        this.db.collection('user_data').where(query).get().then(function(res) {
            var updateData = {
                data: data,
                version: (data.version || 0) + 1,
                updatedAt: new Date().toISOString()
            };
            
            if (res.data && res.data.length > 0) {
                // 更新已有记录
                self.db.collection('user_data').doc(res.data[0]._id).update({
                    data: updateData
                });
            } else {
                // 新增记录
                updateData._openid = self.openid;
                updateData.type = type;
                self.db.collection('user_data').add({
                    data: updateData
                });
            }
        }).catch(function(err) {
            console.warn('[CloudSync] 保存数据失败:', type, err);
            // 加入重试队列
            self.syncQueue.push({ type: type, data: data, action: 'save' });
        });
    },
    
    // 记录训练行为
    recordTraining: function(module, action, data, pointsEarned) {
        if (!this.enabled || !this.db) return;
        
        this.db.collection('training_records').add({
            data: {
                _openid: this.openid,
                module: module,
                action: action,
                data: data || {},
                pointsEarned: pointsEarned || 0,
                createdAt: new Date().toISOString()
            }
        }).catch(function(err) {
            console.warn('[CloudSync] 记录训练行为失败:', err);
        });
    },
    
    // 从云端拉取所有数据
    pullAll: function() {
        if (!this.enabled || !this.db) return;
        
        var self = this;
        
        // 1. 拉取用户信息
        this.getOrCreateUser().then(function(cloudUser) {
            if (cloudUser) {
                self._mergeCloudUserToLocal(cloudUser);
            }
        });
        
        // 2. 拉取用户数据
        this.db.collection('user_data').where({
            _openid: this.openid
        }).get().then(function(res) {
            if (res.data && res.data.length > 0) {
                self._mergeCloudDataToLocal(res.data);
            }
            console.log('[CloudSync] 云端数据拉取完成，共', res.data ? res.data.length : 0, '条');
        }).catch(function(err) {
            console.warn('[CloudSync] 拉取数据失败:', err);
        });
    },
    
    // 合并云端用户数据到本地
    _mergeCloudUserToLocal: function(cloudUser) {
        try {
            var localData = window.loadData ? window.loadData() : null;
            if (!localData) return;
            
            var localUser = null;
            for (var i = 0; i < localData.users.length; i++) {
                if (localData.users[i].id === localData.currentUser) {
                    localUser = localData.users[i];
                    break;
                }
            }
            
            if (!localUser) return;
            
            // 合并策略：云端有值则用云端的，本地有值云端没有则保留本地
            if (cloudUser.name && cloudUser.name !== '学习者') localUser.name = cloudUser.name;
            if (cloudUser.grade) localUser.grade = cloudUser.grade;
            if (cloudUser.difficulty) localUser.difficulty = cloudUser.difficulty;
            if (cloudUser.points) localUser.points = cloudUser.points;
            if (cloudUser.avatar) localUser.avatar = cloudUser.avatar;
            
            // 保存合并后的数据
            if (window.saveData) window.saveData(localData);
            
            // 更新角色
            this.role = cloudUser.role || 'student';
            
            console.log('[CloudSync] 用户数据合并完成');
        } catch(e) {
            console.warn('[CloudSync] 合并用户数据异常:', e);
        }
    },
    
    // 合并云端模块数据到本地
    _mergeCloudDataToLocal: function(cloudRecords) {
        if (!window.DataSync) return;
        
        for (var i = 0; i < cloudRecords.length; i++) {
            var record = cloudRecords[i];
            var moduleName = record.type;
            var cloudData = record.data;
            
            if (!cloudData || !DataSync.modules[moduleName]) continue;
            
            var localData = DataSync.get(moduleName);
            if (!localData) continue;
            
            // 简单合并：如果云端版本更新，用云端数据覆盖
            if (record.version > (localData._cloudVersion || 0)) {
                var merged = Object.assign({}, localData, cloudData);
                merged._cloudVersion = record.version;
                DataSync.set(moduleName, merged);
            }
        }
    },
    
    // 处理同步队列
    _processSyncQueue: function() {
        if (!this.enabled || this.syncing || this.syncQueue.length === 0) return;
        
        this.syncing = true;
        var item = this.syncQueue.shift();
        
        if (item.action === 'save') {
            this.saveUserData(item.type, item.data);
        }
        
        this.syncing = false;
    },
    
    // ===== 家长监管 =====
    
    // 请求绑定学生
    requestBindChild: function(childOpenid) {
        if (!this.enabled || !this.db) return Promise.reject('云同步未启用');
        
        return this.db.collection('parent_bindings').add({
            data: {
                parentOpenid: this.openid,
                childOpenid: childOpenid,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        });
    },
    
    // 获取关联学生的学习数据
    getChildData: function(childOpenid) {
        if (!this.enabled || !this.db) return Promise.reject('云同步未启用');
        if (this.role !== 'parent' && this.role !== 'admin') return Promise.reject('无权限');
        
        return this.db.collection('training_records').where({
            _openid: childOpenid
        }).orderBy('createdAt', 'desc').limit(100).get();
    },
    
    // 获取关联学生列表
    getChildren: function() {
        if (!this.enabled || !this.db) return Promise.reject('云同步未启用');
        if (this.role !== 'parent' && this.role !== 'admin') return Promise.reject('无权限');
        
        return this.db.collection('parent_bindings').where({
            parentOpenid: this.openid,
            status: 'approved'
        }).get();
    },
    
    // ===== 后台管理 =====
    
    // 获取全平台统计
    getAdminStats: function() {
        if (!this.enabled || !this.db || this.role !== 'admin') return Promise.reject('无权限');
        
        var self = this;
        return Promise.all([
            self.db.collection('users').count(),
            self.db.collection('training_records').where({
                createdAt: self._todayStr()
            }).count()
        ]);
    },
    
    _todayStr: function() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    },
    
    // ===== 便捷方法 =====
    
    // 检查是否已启用
    isEnabled: function() {
        return this.enabled;
    },
    
    // 获取当前角色
    getRole: function() {
        return this.role;
    },
    
    // 切换角色
    switchRole: function(newRole) {
        if (!this.enabled || !this.db) return;
        if (['student', 'parent', 'admin'].indexOf(newRole) === -1) return;
        
        this.role = newRole;
        this.db.collection('users').where({
            _openid: this.openid
        }).update({
            data: { role: newRole }
        });
    },
    
    // 上传本地所有数据到云端（首次迁移）
    uploadLocalData: function() {
        if (!this.enabled || !this.db) return;
        
        var self = this;
        
        // 上传核心用户数据
        var user = window.getCurrentUserData ? window.getCurrentUserData() : null;
        if (user) {
            this.saveUserData('core', user);
        }
        
        // 上传所有模块数据
        if (window.DataSync) {
            for (var moduleName in DataSync.modules) {
                var data = DataSync.get(moduleName);
                if (data) {
                    this.saveUserData(moduleName, data);
                }
            }
        }
        
        // 上传localStorage核心数据
        var storageKey = 'cognitive_training_v137';
        var localRaw = localStorage.getItem(storageKey);
        if (localRaw) {
            try {
                var localData = JSON.parse(localRaw);
                this.saveUserData('localStorage_full', localData);
            } catch(e) {}
        }
        
        console.log('[CloudSync] 本地数据上传完成');
    }
};

// 自动初始化（延迟执行，等待其他模块加载完成）
setTimeout(function() {
    CloudSync.init();
}, 500);

console.log('[CloudSync] 模块已加载 V403');

// ==========================================
// CloudSync 云同步模块 - V416
// 微信登录：确认即入 + 手机号可选绑定
// ==========================================

window.CloudSync = {
    version: 'V416',
    enabled: false,
    envId: '',
    openid: '',
    phone: '',
    role: 'student',
    db: null,
    syncQueue: [],
    syncing: false,
    _wxUser: null,

    // ===== 初始化 =====
    init: function() {
        var params = this._getUrlParams();
        var isWxMini = /miniProgram/i.test(navigator.userAgent) || params.openid;

        if (!isWxMini) {
            console.log('[CloudSync] 非小程序环境，纯本地模式');
            this.enabled = false;
            return;
        }

        this.openid = params.openid || '';
        this.envId = params.env || '';

        if (!this.openid) {
            console.warn('[CloudSync] 缺少openid');
            this.enabled = false;
            return;
        }

        console.log('[CloudSync] 微信环境，openid:', this.openid);
        this._wxAutoLogin();

        // CloudBase云同步（环境ID有效时才启用）
        if (this.envId && this.envId !== 'cognitive-training-12345') {
            this._initCloudBase();
        }
    },

    // ===== 微信一键登录 =====
    _wxAutoLogin: function() {
        var STORAGE_KEY = 'cognitive_training_v137';
        var openid = this.openid;

        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var data = raw ? JSON.parse(raw) : null;
            if (!data) data = { users: [], currentUser: null };
            if (!Array.isArray(data.users)) data.users = [];

            // 查找已绑定此openid的用户
            for (var i = 0; i < data.users.length; i++) {
                if (data.users[i].wxOpenid === openid) {
                    data.currentUser = data.users[i].id;
                    this.phone = data.users[i].phone || '';
                    this.role = data.users[i].role || 'student';
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    console.log('[CloudSync] 微信用户自动登录:', data.users[i].name);
                    this._wxUser = data.users[i];
                    this._notifyWxLogin(data.users[i]);
                    return; // 已有用户，直接进入
                }
            }

            // 首次进入 → 弹出确认页
            this._showWxWelcome(data);

        } catch (e) {
            console.error('[CloudSync] 微信登录异常:', e);
        }
    },

    // ===== 微信欢迎确认页 =====
    _showWxWelcome: function(data) {
        var self = this;
        var STORAGE_KEY = 'cognitive_training_v137';
        var openid = this.openid;

        var overlay = document.createElement('div');
        overlay.id = 'wx-welcome-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background:linear-gradient(180deg,#E8F4FF,#f0f4ff);display:flex;align-items:center;justify-content:center;padding:24px;';

        overlay.innerHTML = [
            '<div style="width:100%;max-width:340px;text-align:center;">',
            '  <div style="font-size:56px;margin-bottom:20px;">🧠</div>',
            '  <div style="font-size:26px;font-weight:700;color:#333;margin-bottom:8px;">认知训练门户</div>',
            '  <div style="font-size:14px;color:#666;margin-bottom:32px;line-height:1.6;">科学训练认知能力<br>让学习更高效</div>',
            '  <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">',
            '    <div style="font-size:16px;font-weight:600;color:#333;margin-bottom:4px;">微信一键登录</div>',
            '    <div style="font-size:12px;color:#999;margin-bottom:20px;">点击确认即可开始使用</div>',
            '    <div style="margin-bottom:16px;">',
            '      <input id="wx-welcome-name" type="text" placeholder="你的昵称（可修改）" maxlength="10" style="width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;text-align:center;">',
            '    </div>',
            '    <div style="margin-bottom:16px;">',
            '      <select id="wx-welcome-grade" style="width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:15px;outline:none;box-sizing:border-box;text-align:center;">',
            '        <option value="7">初一</option><option value="8">初二</option><option value="9">初三</option>',
            '        <option value="10">高一</option><option value="11">高二</option><option value="12">高三</option>',
            '        <option value="6">六年级</option><option value="5">五年级</option><option value="4">四年级</option>',
            '        <option value="0">其他</option>',
            '      </select>',
            '    </div>',
            '    <button id="wx-welcome-confirm" style="width:100%;padding:14px;background:linear-gradient(135deg,#07c160,#06ad56);color:white;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;letter-spacing:1px;">确认进入</button>',
            '  </div>',
            '  <div style="margin-top:16px;font-size:11px;color:#bbb;">数据保存在本设备，可在设置中绑定手机号跨设备同步</div>',
            '</div>'
        ].join('');

        document.body.appendChild(overlay);

        // 绑定确认按钮
        document.getElementById('wx-welcome-confirm').onclick = function() {
            var nameInput = document.getElementById('wx-welcome-name');
            var gradeSelect = document.getElementById('wx-welcome-grade');
            var name = (nameInput ? nameInput.value.trim() : '') || '学习者';
            var grade = gradeSelect ? parseInt(gradeSelect.value) : 7;

            // 创建微信用户
            var newUser = {
                id: 'wx_' + openid.substring(0, 12) + '_' + Date.now(),
                wxOpenid: openid,
                phone: '',
                name: name,
                grade: grade,
                difficulty: 1,
                points: 1000,
                avatar: '🧒',
                isWxUser: true,
                role: 'student',
                createdAt: new Date().toISOString(),
                stats: { totalQuestions: 0, correctAnswers: 0, totalMinutes: 0, streakDays: 0, lastActiveDate: null },
                weeklyProgress: {},
                wrongNotes: [],
                completedTopics: [],
                methodStats: {},
                thinkingStats: {},
                gameScores: {},
                gameCounts: {},
                gameTimes: {},
                studyDays: {},
                todayStats: { date: new Date().toISOString().split('T')[0], questions: 0, correct: 0, minutes: 0 }
            };

            data.users.push(newUser);
            data.currentUser = newUser.id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

            self._wxUser = newUser;
            self._notifyWxLogin(newUser);

            // 移除欢迎页
            overlay.remove();
            window.showToast && window.showToast('欢迎，' + name + '！');
        };
    },

    // 通知UI更新
    _notifyWxLogin: function(user) {
        function updateUI() {
            if (typeof window.updateHomeUserInfo === 'function') {
                var userData = window.getCurrentUserData ? window.getCurrentUserData() : user;
                window.updateHomeUserInfo(userData);
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateUI);
        } else {
            setTimeout(updateUI, 300);
        }
    },

    // ===== 手机号绑定（「我的」页面调用） =====
    showPhoneBindModal: function() {
        var self = this;
        var STORAGE_KEY = 'cognitive_training_v137';

        var existing = document.getElementById('wx-phone-bind-modal');
        if (existing) existing.remove();

        // 获取当前用户手机号状态
        var raw = localStorage.getItem(STORAGE_KEY);
        var data = raw ? JSON.parse(raw) : null;
        var currentUser = null;
        if (data && data.users) {
            for (var i = 0; i < data.users.length; i++) {
                if (data.users[i].id === data.currentUser) {
                    currentUser = data.users[i];
                    break;
                }
            }
        }

        var isBound = currentUser && currentUser.phone;
        var phoneDisplay = isBound ? currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定';

        var modal = document.createElement('div');
        modal.id = 'wx-phone-bind-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;padding:20px;';

        modal.innerHTML = [
            '<div style="background:white;border-radius:16px;padding:24px;width:100%;max-width:340px;">',
            '  <div style="font-size:18px;font-weight:700;color:#333;margin-bottom:8px;">📱 手机号绑定</div>',
            '  <div style="font-size:13px;color:#666;margin-bottom:16px;">绑定后可跨设备同步学习数据</div>',
            isBound ? (
                '  <div style="background:#f0fff4;border-radius:10px;padding:14px;margin-bottom:16px;text-align:center;">' +
                '    <div style="font-size:13px;color:#43e97b;margin-bottom:4px;">已绑定</div>' +
                '    <div style="font-size:18px;font-weight:600;color:#333;">' + phoneDisplay + '</div>' +
                '  </div>' +
                '  <button onclick="document.getElementById(\'wx-phone-bind-modal\').remove()" style="width:100%;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">关闭</button>'
            ) : (
                '  <div style="margin-bottom:12px;">' +
                '    <input id="wx-modal-phone" type="tel" maxlength="11" placeholder="请输入手机号" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;outline:none;box-sizing:border-box;">' +
                '  </div>' +
                '  <div style="margin-bottom:16px;">' +
                '    <div style="display:flex;gap:8px;">' +
                '      <input id="wx-modal-code" type="text" maxlength="6" placeholder="验证码" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;outline:none;">' +
                '      <button id="wx-modal-send-btn" style="padding:12px 14px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;white-space:nowrap;cursor:pointer;">获取验证码</button>' +
                '    </div>' +
                '  </div>' +
                '  <button id="wx-modal-bind-btn" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">确认绑定</button>' +
                '  <button onclick="document.getElementById(\'wx-phone-bind-modal\').remove()" style="width:100%;padding:10px;background:none;border:none;color:#999;font-size:13px;cursor:pointer;margin-top:6px;">取消</button>'
            ),
            '</div>'
        ].join('');

        document.body.appendChild(modal);

        // 绑定事件（仅在未绑定时）
        if (!isBound) {
            var sendBtn = document.getElementById('wx-modal-send-btn');
            var bindBtn = document.getElementById('wx-modal-bind-btn');

            if (sendBtn) {
                sendBtn.onclick = function() {
                    var phoneInput = document.getElementById('wx-modal-phone');
                    var phone = phoneInput ? phoneInput.value.trim() : '';
                    if (!/^1\d{10}$/.test(phone)) {
                        window.showToast && window.showToast('请输入正确的11位手机号');
                        return;
                    }
                    // 验证码模拟（后续对接短信API）
                    window._wxVerifyCode = '888888';
                    window._wxVerifyPhone = phone;
                    window.showToast && window.showToast('验证码已发送（测试码：888888）');

                    // 倒计时
                    sendBtn.disabled = true;
                    sendBtn.style.opacity = '0.5';
                    var count = 60;
                    var timer = setInterval(function() {
                        count--;
                        sendBtn.textContent = count + 's';
                        if (count <= 0) {
                            clearInterval(timer);
                            sendBtn.textContent = '获取验证码';
                            sendBtn.disabled = false;
                            sendBtn.style.opacity = '1';
                        }
                    }, 1000);
                };
            }

            if (bindBtn) {
                bindBtn.onclick = function() {
                    var phoneInput = document.getElementById('wx-modal-phone');
                    var codeInput = document.getElementById('wx-modal-code');
                    var phone = phoneInput ? phoneInput.value.trim() : '';
                    var code = codeInput ? codeInput.value.trim() : '';

                    if (!/^1\d{10}$/.test(phone)) {
                        window.showToast && window.showToast('请输入正确的手机号');
                        return;
                    }
                    if (!code || code.length < 4) {
                        window.showToast && window.showToast('请输入验证码');
                        return;
                    }
                    if (window._wxVerifyCode && code !== window._wxVerifyCode) {
                        window.showToast && window.showToast('验证码错误');
                        return;
                    }

                    self._doBindPhone(phone);
                    document.getElementById('wx-phone-bind-modal').remove();
                };
            }
        }
    },

    // 核心绑定逻辑
    _doBindPhone: function(phone) {
        var STORAGE_KEY = 'cognitive_training_v137';
        var openid = this.openid;

        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var data = raw ? JSON.parse(raw) : null;
            if (!data || !data.users) return;

            // 查找手机号是否已存在
            var existUser = null;
            for (var i = 0; i < data.users.length; i++) {
                if (data.users[i].phone === phone) {
                    existUser = data.users[i];
                    break;
                }
            }

            if (existUser && existUser.id !== data.currentUser) {
                // 手机号匹配到另一个用户 → 合并：把openid绑到已有用户
                existUser.wxOpenid = openid;
                existUser.isWxUser = true;
                data.currentUser = existUser.id;
                this.phone = phone;
                this.role = existUser.role || 'student';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                this._wxUser = existUser;
                this._notifyWxLogin(existUser);
                window.showToast && window.showToast('已关联已有账号：' + existUser.name);
            } else {
                // 手机号无匹配 → 给当前用户绑上
                for (var j = 0; j < data.users.length; j++) {
                    if (data.users[j].id === data.currentUser) {
                        data.users[j].phone = phone;
                        data.users[j].wxOpenid = openid;
                        this.phone = phone;
                        this._wxUser = data.users[j];
                        break;
                    }
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                this._notifyWxLogin(this._wxUser);
                window.showToast && window.showToast('手机号绑定成功');
            }

        } catch (e) {
            console.error('[CloudSync] 手机号绑定异常:', e);
        }
    },

    // ===== 便捷方法 =====
    getWxUser: function() { return this._wxUser; },
    isWxEnvironment: function() { return !!this.openid; },
    getPhone: function() { return this.phone || ''; },
    isEnabled: function() { return this.enabled; },
    getRole: function() { return this.role; },

    findUserByPhone: function(phone) {
        var STORAGE_KEY = 'cognitive_training_v137';
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var data = raw ? JSON.parse(raw) : null;
            if (!data || !data.users) return null;
            for (var i = 0; i < data.users.length; i++) {
                if (data.users[i].phone === phone) return data.users[i];
            }
            return null;
        } catch (e) { return null; }
    },

    switchRole: function(newRole) {
        if (['student', 'parent', 'admin'].indexOf(newRole) === -1) return;
        this.role = newRole;
    },

    // ===== CloudBase（后续对接） =====
    _initCloudBase: function() {
        var self = this;
        if (typeof cloudbase !== 'undefined') { this._connectCloudBase(); return; }
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/@cloudbase/js-sdk@latest/dist/cloudbase.full.js';
        script.onload = function() { self._connectCloudBase(); };
        script.onerror = function() { self.enabled = false; };
        document.head.appendChild(script);
    },

    _connectCloudBase: function() {
        try {
            var app = cloudbase.init({ env: this.envId });
            var self = this;
            app.auth().anonymousAuthProvider().signIn().then(function() {
                self.db = app.database();
                self.enabled = true;
                self.pullAll();
                setInterval(function() { self._processSyncQueue(); }, 30000);
            }).catch(function() { self.enabled = false; });
        } catch (e) { this.enabled = false; }
    },

    _getUrlParams: function() {
        var params = {};
        var search = window.location.search.substring(1);
        var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair[0]) params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return params;
    },

    pullAll: function() { if (this.enabled && this.db) { /* 后续实现 */ } },
    saveUserData: function() { if (this.enabled && this.db) { /* 后续实现 */ } },
    recordTraining: function() { if (this.enabled && this.db) { /* 后续实现 */ } },
    _processSyncQueue: function() { if (!this.enabled || this.syncing || !this.syncQueue.length) return; this.syncing = true; this.syncQueue.shift(); this.syncing = false; }
};

// 全局入口
setTimeout(function() { CloudSync.init(); }, 500);
console.log('[CloudSync] V416 已加载');

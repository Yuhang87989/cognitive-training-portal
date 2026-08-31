// ============================================================
// 云同步模块 V2（sync.js）
// 手机号+密码登录，一个手机号=一份成长档案
// 后端接口：/portal-api/phone/login, /portal-api/sync 等
// ============================================================
(function () {
    'use strict';

    var PHONE_KEY = 'portal_phone';        // 存的手机号
    var PWD_KEY   = 'portal_pwd';          // 存的密码（明文，本地仅缓存）
    var DC_KEY    = 'portal_device_code';  // 登录后拿到的device_code
    var META_KEY  = 'portal_sync_meta';    // 同步元数据
    var NICK_KEY  = 'portal_nickname';     // 昵称

    // API地址：同域名走相对路径，跨域走绝对路径
    var API_BASE = 'https://erp.qiuyhang1688.com.cn/portal-api';

    // 要同步的localStorage key
    var MASTER_KEY = 'cognitive_training_v137';  // 主档案：多用户账号、积分、错题本、训练进度
    var SYNC_KEYS = [
        MASTER_KEY,
        'cognitive_user',
        'cognitive_assessment',
        'cognitive_training_data',
        'learning_diary',
        'learning_diary_data',
        'virtual_pet_data',
        'mindmap_data',
        'learning_plan_tasks',
        'exam_data',
        'learning_stats',
        'learning_library_data',
        'self_drive_goals',
        'self_drive_habits',
        'self_drive_achievements',
        'self_drive_diary',
        'self_drive_checkins',
        'parent_bindings',
        'parent_messages',
        'parent_settings'
    ];

    // -------- 工具 --------
    function api(path, opts) {
        return fetch(API_BASE + path, Object.assign({
            headers: { 'Content-Type': 'application/json' }
        }, opts)).then(function (r) {
            if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || ('HTTP ' + r.status)); });
            return r.json();
        });
    }

    function getMeta() {
        try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch (e) { return {}; }
    }
    function setMeta(m) { localStorage.setItem(META_KEY, JSON.stringify(m)); }

    // -------- 登录/注册 --------
    function login(phone, password, nickname) {
        return api('/phone/login', {
            method: 'POST',
            body: JSON.stringify({ phone: phone, password: password || undefined, nickname: nickname || undefined })
        }).then(function (resp) {
            if (resp.code === 0) {
                localStorage.setItem(PHONE_KEY, phone);
                localStorage.setItem(DC_KEY, resp.data.device_code);
                if (password) localStorage.setItem(PWD_KEY, password);
                if (resp.data.nickname) localStorage.setItem(NICK_KEY, resp.data.nickname);
                return resp.data;
            }
            throw new Error(resp.message || '登录失败');
        });
    }

    function checkPhone(phone) {
        return api('/phone/check?phone=' + encodeURIComponent(phone)).then(function (r) {
            return r.code === 0 && r.data.exists;
        }).catch(function () { return null; }); // 网络错误时返回null
    }

    function changePassword(oldPwd, newPwd) {
        var phone = localStorage.getItem(PHONE_KEY);
        if (!phone) return Promise.reject(new Error('未登录'));
        return api('/phone/change-password', {
            method: 'POST',
            body: JSON.stringify({ phone: phone, old_password: oldPwd, new_password: newPwd })
        });
    }

    function logout() {
        localStorage.removeItem(PHONE_KEY);
        localStorage.removeItem(PWD_KEY);
        localStorage.removeItem(DC_KEY);
        localStorage.removeItem(NICK_KEY);
        localStorage.removeItem(META_KEY);
    }

    // -------- 数据同步 --------
    var syncing = false;
    var statusCb = null;

    function setStatus(s) {
        if (statusCb) statusCb(s);
    }

    function pullAll(deviceCode) {
        return api('/sync?device_code=' + encodeURIComponent(deviceCode)).then(function (resp) {
            if (resp.code !== 0) throw new Error('拉取失败');
            var serverItems = resp.data.items || {};
            var meta = getMeta();
            meta.keys = meta.keys || {};

            Object.keys(serverItems).forEach(function (key) {
                var sItem = serverItems[key];
                var m = meta.keys[key] || {};
                var localRaw = localStorage.getItem(key);
                var localChanged = localRaw !== null && localRaw !== (m.localJson || null);

                if (key === MASTER_KEY) {
                    // 主档案合并策略（V448）：多孩子设备间不互相覆盖
                    var serverData = sItem.data;
                    if (!localRaw) {
                        // 新设备/新浏览器：直接使用云端档案
                        localStorage.setItem(key, JSON.stringify(serverData));
                    } else {
                        try {
                            var localData = JSON.parse(localRaw);
                            if (localData && serverData && Array.isArray(serverData.users)) {
                                serverData.users.forEach(function (su) {
                                    var matchedIdx = -1;
                                    for (var i = 0; i < localData.users.length; i++) {
                                        var lu = localData.users[i];
                                        if (lu.id === su.id || (su.phone && lu.phone === su.phone)) { matchedIdx = i; break; }
                                    }
                                    if (matchedIdx >= 0) {
                                        // 同一用户：云端进度合并进来，本地密码保留
                                        var localPwd = localData.users[matchedIdx].password;
                                        var merged = Object.assign({}, localData.users[matchedIdx], su);
                                        if (localPwd) merged.password = localPwd;
                                        localData.users[matchedIdx] = merged;
                                    } else {
                                        // 云端的新用户（如另一个孩子）加入本机
                                        localData.users.push(su);
                                    }
                                });
                                // currentUser 不被云端覆盖，避免切换孩子后被冲回
                                var curExists = localData.users.some(function (u) { return u.id === localData.currentUser; });
                                if (!curExists && serverData.currentUser) localData.currentUser = serverData.currentUser;
                                localStorage.setItem(key, JSON.stringify(localData));
                            }
                        } catch (e) {}
                    }
                    meta.keys[key] = { updated: sItem.updated, localJson: localStorage.getItem(key) };
                } else if (!localChanged) {
                    // 本地没改，覆盖为服务端版本
                    localStorage.setItem(key, JSON.stringify(sItem.data));
                    meta.keys[key] = { updated: sItem.updated, localJson: JSON.stringify(sItem.data) };
                }
                // 本地有改动则保留本地，等push覆盖
            });
            setMeta(meta);
        });
    }

    function pushAll(deviceCode) {
        var meta = getMeta();
        meta.keys = meta.keys || {};
        var pushItems = {};

        SYNC_KEYS.forEach(function (key) {
            var localRaw = localStorage.getItem(key);
            if (localRaw === null) return;
            var m = meta.keys[key] || {};
            if (localRaw !== (m.localJson || null)) {
                // 本地有改动
                var now = Date.now();
                try {
                    var parsed = JSON.parse(localRaw);
                    // 主档案脱敏：密码不上传云端
                    if (key === MASTER_KEY && parsed && Array.isArray(parsed.users)) {
                        parsed = JSON.parse(localRaw);
                        parsed.users = parsed.users.map(function (u) {
                            var copy = Object.assign({}, u);
                            delete copy.password;
                            return copy;
                        });
                    }
                    pushItems[key] = { data: parsed, updated: now };
                } catch (e) {}
            }
        });

        if (Object.keys(pushItems).length === 0) return Promise.resolve(0);

        return api('/sync', {
            method: 'POST',
            body: JSON.stringify({ device_code: deviceCode, items: pushItems })
        }).then(function (resp) {
            if (resp.code === 0) {
                Object.keys(pushItems).forEach(function (key) {
                    meta.keys[key] = {
                        updated: pushItems[key].updated,
                        localJson: key === MASTER_KEY ? localStorage.getItem(key) : JSON.stringify(pushItems[key].data)
                    };
                });
                setMeta(meta);
            }
            return resp.data ? resp.data.accepted : 0;
        });
    }

    function syncNow(silent) {
        if (syncing) return Promise.resolve(false);
        var deviceCode = localStorage.getItem(DC_KEY);
        if (!deviceCode) {
            if (!silent) setStatus('need_login');
            return Promise.resolve(false);
        }
        syncing = true;
        setStatus('syncing');

        return pullAll(deviceCode)
            .then(function () { return pushAll(deviceCode); })
            .then(function () {
                var meta = getMeta();
                meta.lastSync = Date.now();
                setMeta(meta);
                syncing = false;
                setStatus('ok');
                return true;
            })
            .catch(function (e) {
                syncing = false;
                setStatus('offline');
                if (!silent && window.showToast) {
                    window.showToast('☁️ 同步失败：' + (e.message || '网络异常'));
                }
                return false;
            });
    }

    // 自动同步：页面可见时、网络恢复时
    var debounceTimer = null;
    function scheduleSync(delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () { syncNow(true); }, delay || 3000);
    }

    function init() {
        // 如果已有device_code，自动同步
        if (localStorage.getItem(DC_KEY)) {
            setTimeout(function () { syncNow(true); }, 2000);
        }
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && localStorage.getItem(DC_KEY)) {
                scheduleSync(1500);
            }
        });
        window.addEventListener('online', function () {
            if (localStorage.getItem(DC_KEY)) scheduleSync(500);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // -------- 对外暴露 --------
    window.portalSync = {
        login: login,
        checkPhone: checkPhone,
        changePassword: changePassword,
        logout: logout,
        syncNow: function () { return syncNow(false); },
        onStatus: function (cb) { statusCb = cb; },
        getStatus: function () {
            var dc = localStorage.getItem(DC_KEY);
            return dc ? 'logged_in' : 'not_logged_in';
        },
        getPhone: function () { return localStorage.getItem(PHONE_KEY); },
        getNickname: function () { return localStorage.getItem(NICK_KEY); },
        getDeviceCode: function () { return localStorage.getItem(DC_KEY); },
        getLastSync: function () { return (getMeta().lastSync) || 0; },
        isLoggedIn: function () { return !!localStorage.getItem(DC_KEY); }
    };
})();

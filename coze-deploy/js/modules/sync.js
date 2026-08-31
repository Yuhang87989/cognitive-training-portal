// ============================================================
// 云同步模块（sync.js）V440
// 不依赖微信云函数，数据走ERP服务器MySQL（/portal-api）
// 机制：首次打开自动生成设备码；按数据key比对时间戳双向同步
// 服务器不可达时静默降级为纯本地，不影响使用
// ============================================================
(function () {
    var DEVICE_KEY = 'portal_device_id';
    var INFO_KEY = 'portal_device_info';
    var META_KEY = 'portal_sync_meta';
    var API_BASE = '/portal-api';

    // 纳入云同步的业务数据key（其余本地缓存不同步）
    var SYNC_KEYS = [
        'cognitive_user',       // 训练数据（六维雷达来源）
        'cognitive_assessment', // 能力测评结果
        'learning_diary',       // 学习日记
        'learning_diary_data',  // 日记（兼容旧key）
        'virtual_pet_data',     // 虚拟宠物
        'mindmap_data',         // 思维导图
        'learning_plan_tasks',  // 学习计划
        'exam_data',            // 模拟考试
        'learning_stats',       // 学习统计
        'learning_library_data' // 图书馆
    ];

    function genUUID() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getDeviceCode() {
        var d = localStorage.getItem(DEVICE_KEY);
        if (!d) { d = 'h5-' + genUUID(); localStorage.setItem(DEVICE_KEY, d); }
        return d;
    }

    function getDeviceInfo() {
        try { return JSON.parse(localStorage.getItem(INFO_KEY) || '{}'); }
        catch (e) { return {}; }
    }

    function setDeviceInfo(info) {
        var cur = getDeviceInfo();
        if (info.imei !== undefined) cur.imei = info.imei;
        if (info.nickname !== undefined) cur.nickname = info.nickname;
        localStorage.setItem(INFO_KEY, JSON.stringify(cur));
    }

    function getMeta() {
        try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); }
        catch (e) { return {}; }
    }
    function setMeta(m) { localStorage.setItem(META_KEY, JSON.stringify(m)); }

    function readKey(key) {
        var raw = localStorage.getItem(key);
        if (raw === null || raw === undefined) return null;
        try { return JSON.parse(raw); }
        catch (e) { return null; }
    }

    var syncing = false;

    function api(path, opts) {
        return fetch(API_BASE + path, Object.assign({
            headers: { 'Content-Type': 'application/json' }
        }, opts)).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        });
    }

    // 设备注册（带IMEI/昵称）
    function registerDevice() {
        var info = getDeviceInfo();
        return api('/device/register', {
            method: 'POST',
            body: JSON.stringify({
                device_code: getDeviceCode(),
                imei: info.imei || null,
                nickname: info.nickname || null
            })
        }).catch(function () { return null; });
    }

    /**
     * 双向同步
     * @param {boolean} silent 静默模式（自动同步用，失败不弹提示）
     */
    function syncNow(silent) {
        if (syncing) return Promise.resolve(false);
        syncing = true;
        updateStatus('syncing', silent);

        return registerDevice().then(function () {
            return api('/sync?device_code=' + encodeURIComponent(getDeviceCode()));
        }).then(function (resp) {
            if (!resp || resp.code !== 0) throw new Error('bad resp');
            var serverItems = (resp.data && resp.data.items) || {};
            var meta = getMeta();
            meta.keys = meta.keys || {};
            var pushItems = {};

            // ---- 1. 拉取合并：服务端比本地新的写入本地 ----
            Object.keys(serverItems).forEach(function (key) {
                var sItem = serverItems[key];
                var m = meta.keys[key] || {};
                var localVal = readKey(key);
                var localChanged = localVal !== null &&
                    JSON.stringify(localVal) !== (m.localJson || '');
                if (!localChanged) {
                    // 本地无改动，直接接受服务端版本
                    localStorage.setItem(key, JSON.stringify(sItem.data));
                    meta.keys[key] = { updated: sItem.updated, localJson: JSON.stringify(sItem.data) };
                }
                // 本地有改动则保留本地，稍后push
            });

            // ---- 2. 推送：本地比已同步版本新的 ----
            SYNC_KEYS.forEach(function (key) {
                var localVal = readKey(key);
                if (localVal === null) return;
                var localStr = JSON.stringify(localVal);
                var m = meta.keys[key] || {};
                var sItem = serverItems[key];
                if (localStr !== (m.localJson || '')) {
                    // 本地有改动；服务端若更新则以时间戳大者胜
                    var now = Date.now();
                    if (!sItem || now >= sItem.updated) {
                        pushItems[key] = { data: localVal, updated: now };
                    }
                }
            });

            var pushPromise = Object.keys(pushItems).length > 0
                ? api('/sync', {
                    method: 'POST',
                    body: JSON.stringify({ device_code: getDeviceCode(), items: pushItems })
                  }).then(function (r) {
                      if (r && r.code === 0) {
                          Object.keys(pushItems).forEach(function (key) {
                              meta.keys[key] = { updated: pushItems[key].updated, localJson: JSON.stringify(pushItems[key].data) };
                          });
                      }
                  })
                : Promise.resolve();

            return pushPromise.then(function () {
                // 把只拉取未推送的key的meta也补好
                Object.keys(serverItems).forEach(function (key) {
                    if (!meta.keys[key]) {
                        meta.keys[key] = { updated: serverItems[key].updated, localJson: JSON.stringify(serverItems[key].data) };
                    }
                });
                meta.lastSync = Date.now();
                setMeta(meta);
                syncing = false;
                updateStatus('ok', silent);
                return true;
            });
        }).catch(function (e) {
            syncing = false;
            updateStatus('offline', silent);
            return false;
        });
    }

    var statusCb = null;
    function onStatus(cb) { statusCb = cb; }
    function updateStatus(state, silent) {
        if (statusCb) statusCb(state);
        if (!silent && state === 'offline' && window.showToast) {
            window.showToast('☁️ 服务器未连接，数据暂存本机');
        }
    }

    // ---- 自动同步时机 ----
    var debounceTimer = null;
    function scheduleSync(delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () { syncNow(true); }, delay || 3000);
    }

    function init() {
        getDeviceCode(); // 确保生成
        setTimeout(function () { syncNow(true); }, 3500);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') scheduleSync(1500);
        });
        window.addEventListener('online', function () { scheduleSync(500); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 对外接口
    window.portalSync = {
        getDeviceCode: getDeviceCode,
        getDeviceInfo: getDeviceInfo,
        setDeviceInfo: function (info) { setDeviceInfo(info); return syncNow(false); },
        syncNow: function () { return syncNow(false); },
        onStatus: onStatus,
        getLastSync: function () { return (getMeta().lastSync) || 0; }
    };
})();

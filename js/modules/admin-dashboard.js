// ============================================================
// 管理员看板模块 - V416
// 提供用户管理、全局统计、内容管理、系统设置等功能
// ============================================================

(function() {
    'use strict';

    // 管理员看板主渲染函数
    window.renderAdminDashboard = function(container) {
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];

        container.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <!-- 顶部标题 -->
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#e74c3c,#c0392b);display:flex;align-items:center;justify-content:center;font-size:20px;">🛡️</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">管理员看板</div>
                        <div style="font-size:12px;color:#999;">系统管理与数据监控</div>
                    </div>
                </div>

                <!-- 全局统计卡片 -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:12px;padding:16px;">
                        <div style="font-size:24px;font-weight:700;">${users.length}</div>
                        <div style="font-size:12px;opacity:0.9;">注册用户</div>
                    </div>
                    <div style="background:linear-gradient(135deg,#f093fb,#f5576c);color:white;border-radius:12px;padding:16px;">
                        <div style="font-size:24px;font-weight:700;">${users.filter(function(u){return u.isWxUser;}).length}</div>
                        <div style="font-size:12px;opacity:0.9;">微信用户</div>
                    </div>
                    <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border-radius:12px;padding:16px;">
                        <div style="font-size:24px;font-weight:700;">${_countActiveToday(users)}</div>
                        <div style="font-size:12px;opacity:0.9;">今日活跃</div>
                    </div>
                    <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border-radius:12px;padding:16px;">
                        <div style="font-size:24px;font-weight:700;">${_countTotalQuestions(users)}</div>
                        <div style="font-size:12px;opacity:0.9;">总答题量</div>
                    </div>
                </div>

                <!-- 用户管理 -->
                <div style="background:#f8f9ff;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">👥 用户管理</div>
                    <div style="display:flex;gap:8px;margin-bottom:12px;">
                        <input id="admin-search-user" type="text" placeholder="搜索用户名/ID" style="flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
                        <button onclick="window._adminSearchUser()" style="padding:10px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">搜索</button>
                    </div>
                    <div id="admin-user-list" style="max-height:300px;overflow-y:auto;">
                        ${_renderUserList(users)}
                    </div>
                </div>

                <!-- AI使用统计 -->
                <div style="background:#fff8f0;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">🤖 AI调用统计</div>
                    <div id="admin-ai-stats" style="font-size:13px;color:#666;line-height:1.8;">
                        ${_renderAIStats(users)}
                    </div>
                    <button onclick="window._adminRefreshBalance()" style="margin-top:8px;padding:8px 14px;background:#ff9800;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">刷新余额</button>
                    <div id="admin-balance-display" style="margin-top:8px;font-size:13px;color:#999;"></div>
                </div>

                <!-- 内容管理 -->
                <div style="background:#f0fff4;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📚 内容管理</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <button onclick="window._adminManageContent('topics')" style="padding:12px;background:white;border:1px solid #e0e0e0;border-radius:10px;font-size:13px;cursor:pointer;text-align:left;">
                            <div style="font-weight:600;color:#333;">📖 母题管理</div>
                            <div style="font-size:11px;color:#999;margin-top:4px;">查看/编辑母题库</div>
                        </button>
                        <button onclick="window._adminManageContent('methods')" style="padding:12px;background:white;border:1px solid #e0e0e0;border-radius:10px;font-size:13px;cursor:pointer;text-align:left;">
                            <div style="font-weight:600;color:#333;">💡 方法管理</div>
                            <div style="font-size:11px;color:#999;margin-top:4px;">学霸方法维护</div>
                        </button>
                        <button onclick="window._adminManageContent('podcasts')" style="padding:12px;background:white;border:1px solid #e0e0e0;border-radius:10px;font-size:13px;cursor:pointer;text-align:left;">
                            <div style="font-weight:600;color:#333;">🎧 播客管理</div>
                            <div style="font-size:11px;color:#999;margin-top:4px;">播客内容更新</div>
                        </button>
                        <button onclick="window._adminManageContent('videos')" style="padding:12px;background:white;border:1px solid #e0e0e0;border-radius:10px;font-size:13px;cursor:pointer;text-align:left;">
                            <div style="font-weight:600;color:#333;">📺 视频管理</div>
                            <div style="font-size:11px;color:#999;margin-top:4px;">视频资源管理</div>
                        </button>
                    </div>
                </div>

                <!-- 系统设置 -->
                <div style="background:#f5f0ff;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">⚙️ 系统设置</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #eee;">
                            <div>
                                <div style="font-size:13px;font-weight:600;color:#333;">AI调用开关</div>
                                <div style="font-size:11px;color:#999;">全局控制AI功能</div>
                            </div>
                            <div id="admin-ai-toggle" class="admin-toggle active" onclick="window._adminToggleAI()">ON</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #eee;">
                            <div>
                                <div style="font-size:13px;font-weight:600;color:#333;">注册限制</div>
                                <div style="font-size:11px;color:#999;">限制新用户注册</div>
                            </div>
                            <div id="admin-reg-toggle" class="admin-toggle" onclick="window._adminToggleReg()">OFF</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">
                            <div>
                                <div style="font-size:13px;font-weight:600;color:#333;">维护模式</div>
                                <div style="font-size:11px;color:#999;">临时关闭系统</div>
                            </div>
                            <div id="admin-maint-toggle" class="admin-toggle" onclick="window._adminToggleMaint()">OFF</div>
                        </div>
                    </div>
                </div>

                <!-- 操作日志 -->
                <div style="background:#f9f9f9;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📋 操作日志</div>
                    <div id="admin-log-list" style="font-size:12px;color:#666;line-height:2;max-height:200px;overflow-y:auto;">
                        ${_renderLogs()}
                    </div>
                    <button onclick="window._adminClearLogs()" style="margin-top:8px;padding:6px 12px;background:#eee;color:#666;border:none;border-radius:6px;font-size:12px;cursor:pointer;">清空日志</button>
                </div>
            </div>
        `;

        // 注入toggle样式
        _injectToggleStyles();
    };

    // ===== 辅助函数 =====

    function _countActiveToday(users) {
        var today = new Date().toISOString().split('T')[0];
        return users.filter(function(u) {
            return u.stats && u.stats.lastActiveDate === today;
        }).length;
    }

    function _countTotalQuestions(users) {
        var total = 0;
        users.forEach(function(u) {
            if (u.stats && u.stats.totalQuestions) total += u.stats.totalQuestions;
        });
        return total;
    }

    function _renderUserList(users) {
        if (!users.length) return '<div style="text-align:center;color:#999;padding:20px;">暂无用户数据</div>';
        return users.slice(0, 20).map(function(u) {
            var roleLabel = u.role === 'admin' ? '🛡️管理员' : (u.role === 'parent' ? '👨‍👩‍👧家长' : '🧒学生');
            var wxTag = u.isWxUser ? '<span style="background:#07c160;color:white;padding:1px 6px;border-radius:4px;font-size:10px;">微信</span>' : '';
            var phoneTag = u.phone ? '<span style="background:#4facfe;color:white;padding:1px 6px;border-radius:4px;font-size:10px;">已绑定</span>' : '';
            var qCount = (u.stats && u.stats.totalQuestions) || 0;
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #f0f0f0;">' +
                '<div>' +
                    '<div style="font-size:13px;font-weight:600;color:#333;">' + (u.avatar || '🧒') + ' ' + (u.name || '未知') + '</div>' +
                    '<div style="font-size:11px;color:#999;">' + roleLabel + ' ' + wxTag + ' ' + phoneTag + ' · 答题' + qCount + '</div>' +
                '</div>' +
                '<button onclick="window._adminViewUser(\'' + u.id + '\')" style="padding:4px 10px;background:#667eea;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">详情</button>' +
            '</div>';
        }).join('');
    }

    function _renderAIStats(users) {
        var totalAI = 0;
        users.forEach(function(u) {
            if (u.aiUsageCount) totalAI += u.aiUsageCount;
        });
        return '<div>总AI调用次数：<strong>' + totalAI + '</strong></div>' +
               '<div>平均每用户：<strong>' + (users.length ? Math.round(totalAI / users.length) : 0) + '</strong></div>' +
               '<div>预估Token消耗：<strong>~' + (totalAI * 500) + '</strong></div>';
    }

    function _renderLogs() {
        var logs = JSON.parse(localStorage.getItem('_admin_logs') || '[]');
        if (!logs.length) return '<div style="color:#bbb;">暂无操作日志</div>';
        return logs.slice(-10).reverse().map(function(log) {
            return '<div>[' + log.time + '] ' + log.action + '</div>';
        }).join('');
    }

    function _addLog(action) {
        var logs = JSON.parse(localStorage.getItem('_admin_logs') || '[]');
        logs.push({ time: new Date().toLocaleString('zh-CN'), action: action });
        if (logs.length > 100) logs = logs.slice(-100);
        localStorage.setItem('_admin_logs', JSON.stringify(logs));
    }

    function _injectToggleStyles() {
        if (document.getElementById('admin-toggle-style')) return;
        var style = document.createElement('style');
        style.id = 'admin-toggle-style';
        style.textContent = '.admin-toggle{display:inline-block;padding:4px 14px;border-radius:14px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.admin-toggle.active{background:#07c160;color:#fff}.admin-toggle:not(.active){background:#ddd;color:#999}';
        document.head.appendChild(style);
    }

    // ===== 全局操作函数 =====

    window._adminSearchUser = function() {
        var keyword = (document.getElementById('admin-search-user').value || '').trim().toLowerCase();
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        var filtered = keyword ? users.filter(function(u) {
            return (u.name || '').toLowerCase().indexOf(keyword) >= 0 || (u.id || '').indexOf(keyword) >= 0;
        }) : users;
        document.getElementById('admin-user-list').innerHTML = _renderUserList(filtered);
    };

    window._adminViewUser = function(userId) {
        var data = window.loadData ? window.loadData() : { users: [] };
        var user = data.users.find(function(u) { return u.id === userId; });
        if (!user) return;

        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:flex-end;justify-content:center;';
        modal.innerHTML = '<div style="background:white;width:100%;max-width:420px;border-radius:20px 20px 0 0;padding:24px;max-height:80vh;overflow-y:auto;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
                '<div style="font-size:18px;font-weight:700;">用户详情</div>' +
                '<div onclick="this.closest(\'div[style]\').parentElement.remove()" style="cursor:pointer;font-size:22px;padding:4px;">✕</div>' +
            '</div>' +
            '<div style="font-size:14px;line-height:2;">' +
                '<div><strong>ID:</strong> ' + user.id + '</div>' +
                '<div><strong>昵称:</strong> ' + (user.name || '未设置') + '</div>' +
                '<div><strong>年级:</strong> ' + (user.grade || '未设置') + '</div>' +
                '<div><strong>角色:</strong> ' + (user.role || 'student') + '</div>' +
                '<div><strong>微信:</strong> ' + (user.isWxUser ? '是 (' + (user.wxOpenid || '').substring(0, 8) + '...)' : '否') + '</div>' +
                '<div><strong>手机:</strong> ' + (user.phone || '未绑定') + '</div>' +
                '<div><strong>难度:</strong> Lv.' + (user.difficulty || 1) + '</div>' +
                '<div><strong>积分:</strong> ' + (user.points || 0) + '</div>' +
                '<div><strong>答题:</strong> ' + ((user.stats && user.stats.totalQuestions) || 0) + ' 题</div>' +
                '<div><strong>正确率:</strong> ' + ((user.stats && user.stats.totalQuestions) ? Math.round(((user.stats.correctAnswers || 0) / user.stats.totalQuestions) * 100) : 0) + '%</div>' +
                '<div><strong>创建:</strong> ' + (user.createdAt || '未知') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-top:16px;">' +
                '<button onclick="window._adminChangeRole(\'' + user.id + '\')" style="flex:1;padding:10px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">切换角色</button>' +
                '<button onclick="window._adminResetUser(\'' + user.id + '\')" style="flex:1;padding:10px;background:#e74c3c;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">重置数据</button>' +
            '</div>' +
        '</div>';
        document.body.appendChild(modal);
        modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    };

    window._adminChangeRole = function(userId) {
        var data = window.loadData ? window.loadData() : { users: [] };
        var user = data.users.find(function(u) { return u.id === userId; });
        if (!user) return;
        var roles = ['student', 'parent', 'admin'];
        var currentIdx = roles.indexOf(user.role || 'student');
        user.role = roles[(currentIdx + 1) % roles.length];
        localStorage.setItem('cognitive_training_v137', JSON.stringify(data));
        _addLog('切换用户 ' + user.name + ' 角色为 ' + user.role);
        alert('已将 ' + user.name + ' 切换为 ' + user.role);
        if (window.renderAdminDashboard) {
            var container = document.getElementById('admin-dashboard-container') || document.querySelector('[data-page="admin-dashboard"]');
            if (container) window.renderAdminDashboard(container);
        }
    };

    window._adminResetUser = function(userId) {
        if (!confirm('确认重置该用户的所有训练数据？此操作不可恢复。')) return;
        var data = window.loadData ? window.loadData() : { users: [] };
        var user = data.users.find(function(u) { return u.id === userId; });
        if (!user) return;
        user.stats = { totalQuestions: 0, correctAnswers: 0, totalMinutes: 0, streakDays: 0, lastActiveDate: null };
        user.wrongNotes = [];
        user.completedTopics = [];
        user.methodStats = {};
        user.thinkingStats = {};
        user.gameScores = {};
        user.gameCounts = {};
        localStorage.setItem('cognitive_training_v137', JSON.stringify(data));
        _addLog('重置用户 ' + user.name + ' 的训练数据');
        alert('已重置 ' + user.name + ' 的训练数据');
    };

    window._adminRefreshBalance = function() {
        var display = document.getElementById('admin-balance-display');
        if (display) display.textContent = '查询中...';
        if (window.updateDeepSeekBalance) {
            window.updateDeepSeekBalance(function(balance) {
                if (display) display.textContent = 'DeepSeek余额：¥' + (balance || '未知');
                _addLog('查询AI余额：¥' + (balance || '未知'));
            });
        } else {
            if (display) display.textContent = '余额查询功能未加载';
        }
    };

    window._adminManageContent = function(type) {
        var labels = { topics: '母题', methods: '学霸方法', podcasts: '播客', videos: '视频' };
        alert(labels[type] + '内容管理功能将在后续版本开放，当前请通过代码直接编辑数据文件。');
        _addLog('访问' + labels[type] + '管理');
    };

    window._adminToggleAI = function() {
        var toggle = document.getElementById('admin-ai-toggle');
        if (!toggle) return;
        var isOn = toggle.classList.contains('active');
        toggle.classList.toggle('active');
        toggle.textContent = isOn ? 'OFF' : 'ON';
        localStorage.setItem('_admin_ai_enabled', isOn ? '0' : '1');
        _addLog(isOn ? '关闭AI调用' : '开启AI调用');
    };

    window._adminToggleReg = function() {
        var toggle = document.getElementById('admin-reg-toggle');
        if (!toggle) return;
        var isOn = toggle.classList.contains('active');
        toggle.classList.toggle('active');
        toggle.textContent = isOn ? 'OFF' : 'ON';
        localStorage.setItem('_admin_reg_enabled', isOn ? '0' : '1');
        _addLog(isOn ? '开启注册限制' : '关闭注册限制');
    };

    window._adminToggleMaint = function() {
        var toggle = document.getElementById('admin-maint-toggle');
        if (!toggle) return;
        var isOn = toggle.classList.contains('active');
        toggle.classList.toggle('active');
        toggle.textContent = isOn ? 'OFF' : 'ON';
        localStorage.setItem('_admin_maint_mode', isOn ? '0' : '1');
        _addLog(isOn ? '进入维护模式' : '退出维护模式');
    };

    window._adminClearLogs = function() {
        localStorage.setItem('_admin_logs', '[]');
        var logEl = document.getElementById('admin-log-list');
        if (logEl) logEl.innerHTML = '<div style="color:#bbb;">日志已清空</div>';
    };

})();

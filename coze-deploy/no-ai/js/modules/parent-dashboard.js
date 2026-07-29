// ============================================================
// 家长看板模块 - V416
// 提供学习监控、报告查看、时间管控等功能
// ============================================================

(function() {
    'use strict';

    // 家长看板主渲染函数
    window.renderParentDashboard = function(container) {
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        
        container.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <!-- 顶部标题 -->
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:20px;">👨‍👩‍👧</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">家长看板</div>
                        <div style="font-size:12px;color:#999;">关注孩子学习，科学陪伴成长</div>
                    </div>
                </div>

                <!-- 绑定孩子区域 -->
                <div id="parent-bind-section" style="background:#f8f9ff;border-radius:14px;padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">🔗 绑定孩子账号</div>
                    <div id="parent-bind-list" style="margin-bottom:12px;"></div>
                    <div style="display:flex;gap:8px;">
                        <input id="parent-bind-code" type="text" placeholder="输入孩子的绑定码" style="flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;">
                        <button onclick="window.bindChildAccount()" style="padding:10px 16px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">绑定</button>
                    </div>
                    <div style="font-size:11px;color:#999;margin-top:8px;">绑定码在孩子设备的「我的→用户设置」中获取</div>
                </div>

                <!-- 孩子学习概览 -->
                <div id="parent-children-overview"></div>

                <!-- 快捷功能 -->
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px;">
                    <div onclick="window.showParentReport()" style="background:linear-gradient(135deg,#43e97b,#38f9d7);border-radius:14px;padding:16px;cursor:pointer;">
                        <div style="font-size:24px;margin-bottom:6px;">📊</div>
                        <div style="font-size:14px;font-weight:600;color:#333;">学习报告</div>
                        <div style="font-size:11px;color:#666;">周报/月报</div>
                    </div>
                    <div onclick="window.showParentTimeControl()" style="background:linear-gradient(135deg,#fa709a,#fee140);border-radius:14px;padding:16px;cursor:pointer;">
                        <div style="font-size:24px;margin-bottom:6px;">⏰</div>
                        <div style="font-size:14px;font-weight:600;color:#333;">时间管控</div>
                        <div style="font-size:11px;color:#666;">使用时长限制</div>
                    </div>
                    <div onclick="window.showParentWrongBookReview()" style="background:linear-gradient(135deg,#a18cd1,#fbc2eb);border-radius:14px;padding:16px;cursor:pointer;">
                        <div style="font-size:24px;margin-bottom:6px;">📒</div>
                        <div style="font-size:14px;font-weight:600;color:#333;">错题关注</div>
                        <div style="font-size:11px;color:#666;">薄弱点提醒</div>
                    </div>
                    <div onclick="window.showParentEncouragement()" style="background:linear-gradient(135deg,#ffecd2,#fcb69f);border-radius:14px;padding:16px;cursor:pointer;">
                        <div style="font-size:24px;margin-bottom:6px;">💌</div>
                        <div style="font-size:14px;font-weight:600;color:#333;">鼓励留言</div>
                        <div style="font-size:11px;color:#666;">给孩子打气</div>
                    </div>
                </div>
            </div>
        `;

        // 渲染已绑定的孩子列表
        renderBindList();
        // 渲染孩子学习概览
        renderChildrenOverview();
    };

    // 渲染绑定列表
    function renderBindList() {
        var bindListEl = document.getElementById('parent-bind-list');
        if (!bindListEl) return;
        
        var bindings = getParentBindings();
        
        if (bindings.length === 0) {
            bindListEl.innerHTML = '<div style="text-align:center;color:#999;font-size:13px;padding:8px;">暂未绑定孩子账号</div>';
            return;
        }

        bindListEl.innerHTML = bindings.map(function(b) {
            return '<div style="display:flex;align-items:center;justify-content:space-between;background:white;border-radius:8px;padding:10px 12px;margin-bottom:8px;">' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                '<span style="font-size:20px;">' + (b.avatar || '👦') + '</span>' +
                '<div><div style="font-size:14px;font-weight:600;color:#333;">' + (b.name || '孩子') + '</div>' +
                '<div style="font-size:11px;color:#999;">' + (b.grade ? '年级：' + b.grade : '') + '</div></div>' +
                '</div>' +
                '<button onclick="window.unbindChild(\'' + b.id + '\')" style="padding:4px 10px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">解除</button>' +
                '</div>';
        }).join('');
    }

    // 渲染孩子学习概览
    function renderChildrenOverview() {
        var overviewEl = document.getElementById('parent-children-overview');
        if (!overviewEl) return;
        
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        var bindings = getParentBindings();
        
        // 本地模式：显示所有用户的学习概览
        var displayUsers = bindings.length > 0 ? bindings : users.map(function(u) {
            return { id: u.id, name: u.name, avatar: '👦', grade: u.grade };
        });

        if (displayUsers.length === 0) {
            overviewEl.innerHTML = '';
            return;
        }

        overviewEl.innerHTML = '<div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📈 学习概览</div>' +
            displayUsers.map(function(child) {
                var userData = users.find(function(u) { return u.id === child.id; });
                if (!userData) {
                    userData = { stats: {}, wrongNotes: [], studyDays: {} };
                }
                var stats = userData.stats || {};
                var totalQ = stats.totalQuestions || 0;
                var correctA = stats.correctAnswers || 0;
                var accuracy = totalQ > 0 ? Math.round(correctA / totalQ * 100) : 0;
                var totalMin = stats.totalMinutes || 0;
                var streak = stats.streakDays || 0;
                var wrongCount = (userData.wrongNotes || []).length;
                
                // 今日学习
                var today = new Date().toISOString().split('T')[0];
                var todayMin = 0;
                var todayQ = 0;
                if (userData.studyDays && userData.studyDays[today]) {
                    todayMin = userData.studyDays[today].minutes || 0;
                    todayQ = userData.studyDays[today].questions || 0;
                }

                return '<div style="background:white;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">' +
                    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
                    '<span style="font-size:20px;">' + (child.avatar || '👦') + '</span>' +
                    '<span style="font-size:15px;font-weight:600;color:#333;">' + (child.name || '孩子') + '</span>' +
                    '</div>' +
                    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' +
                    '<div style="background:#f0f4ff;border-radius:8px;padding:10px;text-align:center;">' +
                    '<div style="font-size:20px;font-weight:700;color:#667eea;">' + todayMin + '</div>' +
                    '<div style="font-size:11px;color:#666;">今日分钟</div></div>' +
                    '<div style="background:#f0fff4;border-radius:8px;padding:10px;text-align:center;">' +
                    '<div style="font-size:20px;font-weight:700;color:#43e97b;">' + accuracy + '%</div>' +
                    '<div style="font-size:11px;color:#666;">正确率</div></div>' +
                    '<div style="background:#fff5f5;border-radius:8px;padding:10px;text-align:center;">' +
                    '<div style="font-size:20px;font-weight:700;color:#ff6b6b;">' + wrongCount + '</div>' +
                    '<div style="font-size:11px;color:#666;">错题数</div></div>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0;font-size:12px;color:#999;">' +
                    '<span>🔥 连续' + streak + '天</span>' +
                    '<span>累计' + totalQ + '题 / ' + totalMin + '分钟</span>' +
                    '</div>' +
                    '</div>';
            }).join('');
    }

    // 获取绑定列表（本地存储）
    function getParentBindings() {
        try {
            var bindings = JSON.parse(localStorage.getItem('parent_bindings') || '[]');
            return bindings;
        } catch(e) {
            return [];
        }
    }

    // 保存绑定列表
    function saveParentBindings(bindings) {
        localStorage.setItem('parent_bindings', JSON.stringify(bindings));
    }

    // 绑定孩子账号
    window.bindChildAccount = function() {
        var codeInput = document.getElementById('parent-bind-code');
        if (!codeInput) return;
        var code = codeInput.value.trim();
        if (!code) {
            window.showToast && window.showToast('请输入绑定码');
            return;
        }

        // 在本地用户中查找匹配的绑定码
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        var targetUser = users.find(function(u) {
            return u.bindCode === code || u.id === code || u.name === code;
        });

        if (!targetUser) {
            // 本地模式：允许用用户名绑定
            targetUser = users.find(function(u) { return u.name === code; });
        }

        var bindings = getParentBindings();
        
        if (targetUser) {
            if (bindings.find(function(b) { return b.id === targetUser.id; })) {
                window.showToast && window.showToast('该孩子已绑定');
                return;
            }
            bindings.push({
                id: targetUser.id,
                name: targetUser.name,
                avatar: '👦',
                grade: targetUser.grade || '',
                bindTime: new Date().toISOString()
            });
        } else {
            // 没找到对应用户，创建一个虚拟绑定
            bindings.push({
                id: 'child_' + Date.now(),
                name: code,
                avatar: '👦',
                grade: '',
                bindTime: new Date().toISOString()
            });
        }

        saveParentBindings(bindings);
        codeInput.value = '';
        window.showToast && window.showToast('绑定成功');
        renderBindList();
        renderChildrenOverview();
    };

    // 解除绑定
    window.unbindChild = function(childId) {
        var bindings = getParentBindings();
        bindings = bindings.filter(function(b) { return b.id !== childId; });
        saveParentBindings(bindings);
        window.showToast && window.showToast('已解除绑定');
        renderBindList();
        renderChildrenOverview();
    };

    // 学习报告
    window.showParentReport = function() {
        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        var content = document.getElementById('fullscreen-content');
        if (!content) return;

        // 计算全局统计
        var totalQuestions = 0, totalCorrect = 0, totalMinutes = 0, totalWrong = 0;
        var subjectStats = {};
        
        users.forEach(function(u) {
            var s = u.stats || {};
            totalQuestions += s.totalQuestions || 0;
            totalCorrect += s.correctAnswers || 0;
            totalMinutes += s.totalMinutes || 0;
            totalWrong += (u.wrongNotes || []).length;

            // 科目统计
            if (u.topicStats) {
                Object.keys(u.topicStats).forEach(function(key) {
                    if (!subjectStats[key]) subjectStats[key] = { total: 0, correct: 0 };
                    subjectStats[key].total += u.topicStats[key].total || 0;
                    subjectStats[key].correct += u.topicStats[key].correct || 0;
                });
            }
        });

        var overallAccuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;

        // 近7天趋势
        var days = [];
        for (var i = 6; i >= 0; i--) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            var dateStr = d.toISOString().split('T')[0];
            var dayMin = 0, dayQ = 0;
            users.forEach(function(u) {
                if (u.studyDays && u.studyDays[dateStr]) {
                    dayMin += u.studyDays[dateStr].minutes || 0;
                    dayQ += u.studyDays[dateStr].questions || 0;
                }
            });
            days.push({ date: (d.getMonth()+1) + '/' + d.getDate(), minutes: dayMin, questions: dayQ });
        }

        var maxMin = Math.max.apply(null, days.map(function(d) { return d.minutes; })) || 1;

        content.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#43e97b,#38f9d7);display:flex;align-items:center;justify-content:center;font-size:20px;">📊</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">学习报告</div>
                        <div style="font-size:12px;color:#999;">数据截至今日</div>
                    </div>
                </div>

                <!-- 总览 -->
                <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:14px;padding:20px;color:white;margin-bottom:16px;">
                    <div style="font-size:14px;opacity:0.9;margin-bottom:12px;">整体学习情况</div>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
                        <div><div style="font-size:22px;font-weight:700;">${totalQuestions}</div><div style="font-size:10px;opacity:0.8;">总题数</div></div>
                        <div><div style="font-size:22px;font-weight:700;">${overallAccuracy}%</div><div style="font-size:10px;opacity:0.8;">正确率</div></div>
                        <div><div style="font-size:22px;font-weight:700;">${totalMinutes}</div><div style="font-size:10px;opacity:0.8;">总分钟</div></div>
                        <div><div style="font-size:22px;font-weight:700;">${totalWrong}</div><div style="font-size:10px;opacity:0.8;">错题数</div></div>
                    </div>
                </div>

                <!-- 近7天趋势 -->
                <div style="background:white;border-radius:14px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📈 近7天学习趋势</div>
                    <div style="display:flex;align-items:flex-end;gap:6px;height:120px;">
                        ${days.map(function(d) {
                            var h = Math.max(4, Math.round(d.minutes / maxMin * 100));
                            return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">' +
                                '<div style="font-size:10px;color:#667eea;font-weight:600;">' + d.minutes + '</div>' +
                                '<div style="width:100%;height:' + h + 'px;background:linear-gradient(180deg,#667eea,#a18cd1);border-radius:4px 4px 0 0;min-height:4px;"></div>' +
                                '<div style="font-size:10px;color:#999;">' + d.date + '</div>' +
                                '</div>';
                        }).join('')}
                    </div>
                </div>

                <!-- 科目分析 -->
                <div style="background:white;border-radius:14px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📚 科目分析</div>
                    ${Object.keys(subjectStats).length === 0 ? 
                        '<div style="text-align:center;color:#999;font-size:13px;padding:20px;">暂无科目数据</div>' :
                        Object.keys(subjectStats).map(function(key) {
                            var s = subjectStats[key];
                            var acc = s.total > 0 ? Math.round(s.correct / s.total * 100) : 0;
                            return '<div style="margin-bottom:10px;">' +
                                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">' +
                                '<span style="color:#333;font-weight:500;">' + key + '</span>' +
                                '<span style="color:#667eea;">' + acc + '% (' + s.total + '题)</span></div>' +
                                '<div style="background:#f0f0f0;border-radius:4px;height:6px;overflow:hidden;">' +
                                '<div style="width:' + acc + '%;height:100%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:4px;"></div>' +
                                '</div></div>';
                        }).join('')
                    }
                </div>

                <!-- 建议 -->
                <div style="background:#fff8e1;border-radius:14px;padding:16px;">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">💡 建议</div>
                    ${generateAdvice(totalQuestions, overallAccuracy, totalWrong, totalMinutes)}
                </div>
            </div>
        `;
    };

    // 生成建议
    function generateAdvice(totalQ, accuracy, wrongCount, totalMin) {
        var advices = [];
        if (totalQ === 0) {
            advices.push('<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:6px;">• 还没有做题记录，鼓励孩子开始每日训练吧</div>');
        } else {
            if (accuracy < 60) {
                advices.push('<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:6px;">• 正确率偏低，建议降低难度，先巩固基础</div>');
            } else if (accuracy > 90) {
                advices.push('<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:6px;">• 正确率很高！可以适当提升难度挑战</div>');
            }
            if (wrongCount > 20) {
                advices.push('<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:6px;">• 错题较多，建议重点复习错题本</div>');
            }
            if (totalMin < 30) {
                advices.push('<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:6px;">• 学习时间较短，建议每天至少30分钟</div>');
            }
        }
        if (advices.length === 0) {
            advices.push('<div style="font-size:13px;color:#666;line-height:1.6;">• 学习状态良好，继续保持！</div>');
        }
        return advices.join('');
    }

    // 时间管控
    window.showParentTimeControl = function() {
        var content = document.getElementById('fullscreen-content');
        if (!content) return;

        var settings = getParentSettings();

        content.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#fa709a,#fee140);display:flex;align-items:center;justify-content:center;font-size:20px;">⏰</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">时间管控</div>
                        <div style="font-size:12px;color:#999;">合理控制学习时间</div>
                    </div>
                </div>

                <div style="background:white;border-radius:14px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">⏱️ 每日学习时长限制</div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <input type="range" id="daily-time-limit" min="15" max="120" step="15" value="${settings.dailyTimeLimit || 60}" 
                            style="flex:1;accent-color:#667eea;" oninput="document.getElementById('time-limit-display').textContent=this.value">
                        <span id="time-limit-display" style="font-size:18px;font-weight:700;color:#667eea;min-width:40px;text-align:center;">${settings.dailyTimeLimit || 60}</span>
                        <span style="font-size:13px;color:#999;">分钟</span>
                    </div>
                </div>

                <div style="background:white;border-radius:14px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">🌙 休息提醒</div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
                        <div><div style="font-size:13px;color:#333;">每学习30分钟提醒休息</div></div>
                        <div class="toggle-switch ${settings.breakReminder ? 'active' : ''}" onclick="this.classList.toggle('active');window.saveParentTimeSettings()" style="width:44px;height:24px;background:${settings.breakReminder ? '#667eea' : '#ddd'};border-radius:12px;position:relative;cursor:pointer;transition:background 0.3s;">
                            <div style="width:20px;height:20px;background:white;border-radius:50%;position:absolute;top:2px;${settings.breakReminder ? 'right:2px' : 'left:2px'};transition:all 0.3s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;">
                        <div><div style="font-size:13px;color:#333;">22:00后禁止使用</div></div>
                        <div class="toggle-switch ${settings.nightLimit ? 'active' : ''}" onclick="this.classList.toggle('active');window.saveParentTimeSettings()" style="width:44px;height:24px;background:${settings.nightLimit ? '#667eea' : '#ddd'};border-radius:12px;position:relative;cursor:pointer;transition:background 0.3s;">
                            <div style="width:20px;height:20px;background:white;border-radius:50%;position:absolute;top:2px;${settings.nightLimit ? 'right:2px' : 'left:2px'};transition:all 0.3s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                        </div>
                    </div>
                </div>

                <button onclick="window.saveParentTimeSettings()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">保存设置</button>
            </div>
        `;
    };

    // 保存家长时间设置
    window.saveParentTimeSettings = function() {
        var limitSlider = document.getElementById('daily-time-limit');
        var settings = getParentSettings();
        if (limitSlider) {
            settings.dailyTimeLimit = parseInt(limitSlider.value);
        }
        settings.breakReminder = true; // 简化：从DOM状态读取
        localStorage.setItem('parent_settings', JSON.stringify(settings));
        window.showToast && window.showToast('设置已保存');
    };

    // 获取家长设置
    function getParentSettings() {
        try {
            return JSON.parse(localStorage.getItem('parent_settings') || '{}');
        } catch(e) {
            return {};
        }
    }

    // 错题关注
    window.showParentWrongBookReview = function() {
        var content = document.getElementById('fullscreen-content');
        if (!content) return;

        var data = window.loadData ? window.loadData() : { users: [] };
        var users = data.users || [];
        var allWrong = [];
        
        users.forEach(function(u) {
            (u.wrongNotes || []).forEach(function(w) {
                allWrong.push({ user: u.name, question: w.question || w.content || '', subject: w.subject || w.topic || '未分类', date: w.date || w.addedAt || '', analysis: w.analysis || '' });
            });
        });

        // 按科目分组
        var bySubject = {};
        allWrong.forEach(function(w) {
            if (!bySubject[w.subject]) bySubject[w.subject] = [];
            bySubject[w.subject].push(w);
        });

        content.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#a18cd1,#fbc2eb);display:flex;align-items:center;justify-content:center;font-size:20px;">📒</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">错题关注</div>
                        <div style="font-size:12px;color:#999;">共${allWrong.length}道错题</div>
                    </div>
                </div>

                ${Object.keys(bySubject).length === 0 ? 
                    '<div style="text-align:center;color:#999;padding:40px 0;">暂无错题记录，继续加油！</div>' :
                    Object.keys(bySubject).map(function(subject) {
                        var items = bySubject[subject];
                        return '<div style="background:white;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">' +
                            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
                            '<span style="font-size:14px;font-weight:600;color:#333;">' + subject + '</span>' +
                            '<span style="font-size:12px;color:#ff6b6b;font-weight:600;">' + items.length + '题</span></div>' +
                            items.slice(0, 5).map(function(w) {
                                return '<div style="padding:8px 0;border-top:1px solid #f5f5f5;">' +
                                    '<div style="font-size:13px;color:#333;line-height:1.5;">' + (w.question.substring(0, 80) + (w.question.length > 80 ? '...' : '')) + '</div>' +
                                    (w.analysis ? '<div style="font-size:11px;color:#999;margin-top:4px;">解析：' + w.analysis.substring(0, 60) + '</div>' : '') +
                                    '</div>';
                            }).join('') +
                            (items.length > 5 ? '<div style="text-align:center;font-size:12px;color:#667eea;padding-top:8px;">还有' + (items.length - 5) + '题...</div>' : '') +
                            '</div>';
                    }).join('')
                }
            </div>
        `;
    };

    // 鼓励留言
    window.showParentEncouragement = function() {
        var content = document.getElementById('fullscreen-content');
        if (!content) return;

        var messages = getParentMessages();

        content.innerHTML = `
            <div style="padding:16px;max-width:480px;margin:0 auto;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#ffecd2,#fcb69f);display:flex;align-items:center;justify-content:center;font-size:20px;">💌</div>
                    <div>
                        <div style="font-size:18px;font-weight:700;color:#333;">鼓励留言</div>
                        <div style="font-size:12px;color:#999;">给孩子温暖的力量</div>
                    </div>
                </div>

                <div style="background:white;border-radius:14px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <textarea id="parent-msg-input" placeholder="写下你想对孩子说的话..." style="width:100%;height:80px;border:1px solid #ddd;border-radius:8px;padding:10px;font-size:14px;resize:none;outline:none;font-family:inherit;"></textarea>
                    <div style="display:flex;gap:8px;margin-top:8px;">
                        <button onclick="window.quickMsg('你今天很棒！继续加油！💪')" style="padding:6px 12px;background:#f0f4ff;color:#667eea;border:none;border-radius:6px;font-size:12px;cursor:pointer;">💪 加油</button>
                        <button onclick="window.quickMsg('学习累了就休息一下，不要勉强哦 😊')" style="padding:6px 12px;background:#f0fff4;color:#43e97b;border:none;border-radius:6px;font-size:12px;cursor:pointer;">😊 休息</button>
                        <button onclick="window.quickMsg('错题不可怕，每次改正都是进步！🌟')" style="padding:6px 12px;background:#fff5f5;color:#ff6b6b;border:none;border-radius:6px;font-size:12px;cursor:pointer;">🌟 进步</button>
                    </div>
                    <button onclick="window.sendParentMessage()" style="width:100%;margin-top:10px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">发送留言</button>
                </div>

                <div id="parent-msg-list">
                    ${messages.length === 0 ? '<div style="text-align:center;color:#999;padding:20px;">还没有留言</div>' :
                    messages.map(function(m) {
                        return '<div style="background:white;border-radius:12px;padding:14px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">' +
                            '<div style="font-size:13px;color:#333;line-height:1.6;">' + m.text + '</div>' +
                            '<div style="font-size:11px;color:#999;margin-top:6px;">' + m.time + '</div>' +
                            '</div>';
                    }).join('')}
                </div>
            </div>
        `;
    };

    // 快捷留言
    window.quickMsg = function(text) {
        var input = document.getElementById('parent-msg-input');
        if (input) input.value = text;
    };

    // 发送留言
    window.sendParentMessage = function() {
        var input = document.getElementById('parent-msg-input');
        if (!input || !input.value.trim()) {
            window.showToast && window.showToast('请输入留言内容');
            return;
        }
        var messages = getParentMessages();
        messages.unshift({
            text: input.value.trim(),
            time: new Date().toLocaleString('zh-CN')
        });
        localStorage.setItem('parent_messages', JSON.stringify(messages));
        input.value = '';
        window.showToast && window.showToast('留言已发送');
        // 重新渲染
        window.showParentEncouragement();
    };

    // 获取留言列表
    function getParentMessages() {
        try {
            return JSON.parse(localStorage.getItem('parent_messages') || '[]');
        } catch(e) {
            return [];
        }
    }

    console.log('[V416] 家长看板模块加载完成');

})();

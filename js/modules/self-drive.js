// ==========================================
// V432 自驱力与内驱力训练模块
// 恢复：子页面使用 detail-modal 小窗口模式
// 修复：返回按钮使用 closeModal 关闭弹窗
// 培养学习动力、目标感、意志力
// ==========================================

window.SelfDrive = {
    goals: JSON.parse(localStorage.getItem('self_drive_goals') || '[]'),
    habits: JSON.parse(localStorage.getItem('self_drive_habits') || '[]'),
    achievements: JSON.parse(localStorage.getItem('self_drive_achievements') || '[]'),
    diary: JSON.parse(localStorage.getItem('self_drive_diary') || '[]'),
    
    save: function() {
        localStorage.setItem('self_drive_goals', JSON.stringify(this.goals));
        localStorage.setItem('self_drive_habits', JSON.stringify(this.habits));
        localStorage.setItem('self_drive_achievements', JSON.stringify(this.achievements));
        localStorage.setItem('self_drive_diary', JSON.stringify(this.diary));
    },
    
    quotes: [
        "每天进步一点点，坚持带来大改变 💪",
        "学习不是为了别人，是为了遇见更好的自己 ✨",
        "现在的每一分努力，都是未来的底气 🎯",
        "困难是成长的阶梯，跨过去就是新高度 🪜",
        "自律的前期是兴奋，中期是痛苦，后期是享受 🌟",
        "你背不下来的书，总有人能背下来；你做不出的题，总有人能做出来 📚",
        "今天不想学，所以才要学 ❤️",
        "学习是性价比最高的投资 💰",
        "那些你熬夜努力的时光，那才是梦想的力量 🌙",
        "每一个想要学习的念头，都是未来的你在向现在的你求救 📞"
    ],
    
    getRandomQuote: function() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }
};

// 渲染自驱力训练主页面
window.renderSelfDrive = function(container) {
    var todayQuote = SelfDrive.getRandomQuote();
    var streakDays = calculateStreakDays();
    
    container.innerHTML = '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">💪 自驱力训练</h3>' +
        '<div style="background:linear-gradient(135deg,#667eea20,#764ba220);border-radius:12px;padding:16px;margin-bottom:16px;">' +
            '<div style="font-size:12px;color:#667eea;margin-bottom:8px;">✨ 今日能量</div>' +
            '<div style="font-size:14px;color:#333;line-height:1.6;">' + todayQuote + '</div>' +
        '</div>' +
        '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
                '<span style="font-size:14px;font-weight:600;">🔥 连续打卡</span>' +
                '<span style="font-size:28px;font-weight:bold;color:#ff6b6b;">' + streakDays + '天</span>' +
            '</div>' +
            '<button onclick="checkInToday()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff6b6b,#ff9a63);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">' +
                (hasCheckedInToday() ? '✅ 今日已打卡' : '📝 今日打卡') +
            '</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">' +
            '<button onclick="renderGoalPage()" style="padding:16px 12px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">🎯 目标设定</button>' +
            '<button onclick="renderHabitPage()" style="padding:16px 12px;background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">📅 习惯追踪</button>' +
            '<button onclick="renderAchievementPage()" style="padding:16px 12px;background:linear-gradient(135deg,#fa709a,#fee140);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">🏆 成就墙</button>' +
            '<button onclick="renderDiaryPage()" style="padding:16px 12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">📝 每日反思</button>' +
        '</div>' +
        '<button onclick="renderMethodPage()" style="width:100%;padding:16px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px;">📚 科学训练方法</button>' +
        '<div style="background:white;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">' +
            '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">📊 训练概览</div>' +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">' +
                '<div><div style="font-size:24px;font-weight:bold;color:#667eea;">' + SelfDrive.goals.length + '</div><div style="font-size:11px;color:#999;">目标</div></div>' +
                '<div><div style="font-size:24px;font-weight:bold;color:#43e97b;">' + SelfDrive.habits.length + '</div><div style="font-size:11px;color:#999;">习惯</div></div>' +
                '<div><div style="font-size:24px;font-weight:bold;color:#fa709a;">' + SelfDrive.achievements.length + '</div><div style="font-size:11px;color:#999;">成就</div></div>' +
            '</div>' +
        '</div>' +
    '</div>';
};

function calculateStreakDays() {
    var checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    if (checkins.length === 0) return 0;
    
    var today = new Date().toDateString();
    var streak = 0;
    var current = new Date();
    
    while (true) {
        var dateStr = current.toDateString();
        if (checkins.includes(dateStr)) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function hasCheckedInToday() {
    var checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    return checkins.includes(new Date().toDateString());
}

function checkInToday() {
    var checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    var today = new Date().toDateString();
    
    if (!checkins.includes(today)) {
        checkins.push(today);
        localStorage.setItem('self_drive_checkins', JSON.stringify(checkins));
        
        // 添加成就
        if (calculateStreakDays() >= 7) {
            addAchievement('连续打卡7天', '坚持一周，棒极了！ 🔥');
        }
        if (calculateStreakDays() >= 30) {
            addAchievement('连续打卡30天', '一个月的坚持，了不起！ 🌟');
        }
        
        showToast('打卡成功！继续加油 💪');
        var container = document.getElementById('fullscreen-content');
        if (container) window.renderSelfDrive(container);
    } else {
        showToast('今日已打卡 ✅');
    }
}

function addAchievement(title, desc) {
    if (!SelfDrive.achievements.find(a => a.title === title)) {
        SelfDrive.achievements.push({
            title: title,
            desc: desc,
            date: new Date().toLocaleDateString()
        });
        SelfDrive.save();
    }
}

function showToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#333;color:white;padding:12px 24px;border-radius:8px;z-index:10000;font-size:14px;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2000);
}

// ==========================================
// 子页面渲染函数
// ==========================================

// 目标设定页面
window.renderGoalPage = function() {
    var container = document.getElementById('detail-content') || document.body;
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = '<div style="background:white;border-radius:16px;margin:4px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f0f0f0;"><button onclick="window.closeModal()" style="padding:8px 16px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">← 返回</button></div>' +
    '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:15px;color:#333;">🎯 目标设定</h3>' +
        '<div style="margin-bottom:16px;">' +
            '<input id="goal-input" type="text" placeholder="输入新目标..." style="width:calc(100% - 80px);padding:10px;border:1px solid #ddd;border-radius:8px;font-size:13px;">' +
            '<button onclick="addGoal()" style="width:70px;padding:10px;background:#4facfe;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">添加</button>' +
        '</div>' +
        '<div id="goals-list" style="max-height:300px;overflow-y:auto;"></div>' +
    '</div></div>';
    
    renderGoalsList();
};

function renderGoalsList() {
    var list = document.getElementById('goals-list');
    if (!list) return;
    
    var html = '';
    SelfDrive.goals.forEach(function(goal, i) {
        html += '<div style="background:#f8f9fa;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div style="flex:1;">' +
                '<div style="font-size:13px;color:#333;">' + goal.text + '</div>' +
                '<div style="font-size:11px;color:#999;margin-top:4px;">' + goal.date + '</div>' +
            '</div>' +
            '<button onclick="deleteGoal(' + i + ')" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">删除</button>' +
        '</div>';
    });
    
    if (SelfDrive.goals.length === 0) {
        html = '<div style="text-align:center;color:#999;padding:20px;">暂无目标，添加一个吧！</div>';
    }
    
    list.innerHTML = html;
}

function addGoal() {
    var input = document.getElementById('goal-input');
    if (!input || !input.value.trim()) return;
    
    SelfDrive.goals.push({
        text: input.value.trim(),
        date: new Date().toLocaleDateString()
    });
    SelfDrive.save();
    input.value = '';
    renderGoalsList();
    showToast('目标添加成功 🎯');
}

function deleteGoal(index) {
    SelfDrive.goals.splice(index, 1);
    SelfDrive.save();
    renderGoalsList();
    showToast('目标已删除');
}

// 习惯追踪页面
window.renderHabitPage = function() {
    var container = document.getElementById('detail-content') || document.body;
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = '<div style="background:white;border-radius:16px;margin:4px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f0f0f0;"><button onclick="window.closeModal()" style="padding:8px 16px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">← 返回</button></div>' +
    '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:15px;color:#333;">📅 习惯追踪</h3>' +
        '<div style="margin-bottom:16px;">' +
            '<input id="habit-input" type="text" placeholder="输入新习惯..." style="width:calc(100% - 80px);padding:10px;border:1px solid #ddd;border-radius:8px;font-size:13px;">' +
            '<button onclick="addHabit()" style="width:70px;padding:10px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">添加</button>' +
        '</div>' +
        '<div id="habits-list" style="max-height:300px;overflow-y:auto;"></div>' +
    '</div></div>';
    
    renderHabitsList();
};

function renderHabitsList() {
    var list = document.getElementById('habits-list');
    if (!list) return;
    
    var today = new Date().toDateString();
    var html = '';
    SelfDrive.habits.forEach(function(habit, i) {
        var checked = habit.checkins && habit.checkins.includes(today);
        html += '<div style="background:#f8f9fa;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div style="flex:1;display:flex;align-items:center;">' +
                '<button onclick="checkHabit(' + i + ')" style="width:24px;height:24px;border-radius:50%;border:2px solid ' + (checked ? '#43e97b' : '#ddd') + ';background:' + (checked ? '#43e97b' : 'transparent') + ';cursor:pointer;margin-right:12px;">' + (checked ? '✓' : '') + '</button>' +
                '<div>' +
                    '<div style="font-size:13px;color:#333;">' + habit.text + '</div>' +
                    '<div style="font-size:11px;color:#999;">连续 ' + (habit.streak || 0) + ' 天</div>' +
                '</div>' +
            '</div>' +
            '<button onclick="deleteHabit(' + i + ')" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">删除</button>' +
        '</div>';
    });
    
    if (SelfDrive.habits.length === 0) {
        html = '<div style="text-align:center;color:#999;padding:20px;">暂无习惯，添加一个吧！</div>';
    }
    
    list.innerHTML = html;
}

function addHabit() {
    var input = document.getElementById('habit-input');
    if (!input || !input.value.trim()) return;
    
    SelfDrive.habits.push({
        text: input.value.trim(),
        streak: 0,
        checkins: []
    });
    SelfDrive.save();
    input.value = '';
    renderHabitsList();
    showToast('习惯添加成功 📅');
}

function checkHabit(index) {
    var habit = SelfDrive.habits[index];
    var today = new Date().toDateString();
    
    if (!habit.checkins) habit.checkins = [];
    
    if (!habit.checkins.includes(today)) {
        habit.checkins.push(today);
        habit.streak = (habit.streak || 0) + 1;
        SelfDrive.save();
        
        if (habit.streak >= 7) {
            addAchievement('坚持习惯7天', habit.text + ' 坚持7天！ 🌟');
        }
        
        showToast('打卡成功！继续加油 💪');
    } else {
        showToast('今日已完成 ✅');
    }
    
    renderHabitsList();
}

function deleteHabit(index) {
    SelfDrive.habits.splice(index, 1);
    SelfDrive.save();
    renderHabitsList();
    showToast('习惯已删除');
}

// 成就墙页面
window.renderAchievementPage = function() {
    var container = document.getElementById('detail-content') || document.body;
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = '<div style="background:white;border-radius:16px;margin:4px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f0f0f0;"><button onclick="window.closeModal()" style="padding:8px 16px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">← 返回</button></div>' +
    '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:15px;color:#333;">🏆 成就墙</h3>' +
        '<div id="achievements-list" style="max-height:350px;overflow-y:auto;"></div>' +
    '</div></div>';
    
    renderAchievementsList();
};

function renderAchievementsList() {
    var list = document.getElementById('achievements-list');
    if (!list) return;
    
    var html = '';
    SelfDrive.achievements.forEach(function(ach) {
        html += '<div style="background:#f8f9fa;border-radius:8px;padding:12px;margin-bottom:8px;">' +
            '<div style="font-size:13px;font-weight:600;color:#333;">' + ach.title + '</div>' +
            '<div style="font-size:11px;color:#999;margin-top:4px;">' + ach.desc + '</div>' +
            '<div style="font-size:10px;color:#999;margin-top:4px;">' + ach.date + '</div>' +
        '</div>';
    });
    
    if (SelfDrive.achievements.length === 0) {
        html = '<div style="text-align:center;color:#999;padding:40px;">暂无成就，开始训练吧！ 🏆</div>';
    }
    
    list.innerHTML = html;
}

// 每日反思页面
window.renderDiaryPage = function() {
    var container = document.getElementById('detail-content') || document.body;
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = '<div style="background:white;border-radius:16px;margin:4px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f0f0f0;"><button onclick="window.closeModal()" style="padding:8px 16px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">← 返回</button></div>' +
    '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:15px;color:#333;">📝 每日反思</h3>' +
        '<div style="margin-bottom:16px;">' +
            '<textarea id="diary-input" placeholder="今天的收获和反思..." style="width:100%;height:100px;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:13px;resize:none;"></textarea>' +
        '</div>' +
        '<button onclick="saveDiary()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">保存反思</button>' +
        '<div id="diary-list" style="max-height:200px;overflow-y:auto;margin-top:16px;"></div>' +
    '</div></div>';
    
    renderDiaryList();
};

function renderDiaryList() {
    var list = document.getElementById('diary-list');
    if (!list) return;
    
    var html = '';
    SelfDrive.diary.forEach(function(entry, i) {
        html += '<div style="background:#f8f9fa;border-radius:8px;padding:12px;margin-bottom:8px;">' +
            '<div style="font-size:11px;color:#999;margin-bottom:4px;">' + entry.date + '</div>' +
            '<div style="font-size:13px;color:#333;">' + entry.text + '</div>' +
        '</div>';
    });
    
    if (SelfDrive.diary.length === 0) {
        html = '<div style="text-align:center;color:#999;padding:20px;">暂无反思记录</div>';
    }
    
    list.innerHTML = html;
}

function saveDiary() {
    var input = document.getElementById('diary-input');
    if (!input || !input.value.trim()) return;
    
    SelfDrive.diary.push({
        text: input.value.trim(),
        date: new Date().toLocaleDateString()
    });
    SelfDrive.save();
    input.value = '';
    renderDiaryList();
    showToast('反思已保存 📝');
}

// 科学训练方法页面
window.renderMethodPage = function() {
    var container = document.getElementById('detail-content') || document.body;
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    var methods = [
        { title: '番茄工作法', desc: '25分钟专注+5分钟休息，提高效率', icon: '🍅' },
        { title: 'SMART目标', desc: '具体、可衡量、可达成、相关、有时限', icon: '🎯' },
        { title: '习惯堆叠', desc: '将新习惯绑定到现有习惯上', icon: '📦' },
        { title: '奖励机制', desc: '完成目标后给自己小奖励', icon: '🎁' },
        { title: '环境设计', desc: '减少干扰，创造专注环境', icon: '🏠' },
        { title: '记录追踪', desc: '记录进度，可视化成长', icon: '📊' }
    ];
    
    var html = '<div style="background:white;border-radius:16px;margin:4px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #f0f0f0;"><button onclick="window.closeModal()" style="padding:8px 16px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">← 返回</button></div>' +
    '<div style="padding:16px;">' +
        '<h3 style="margin:0 0 16px 0;font-size:15px;color:#333;">📚 科学训练方法</h3>';
    
    methods.forEach(function(m) {
        html += '<div style="background:#f8f9fa;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;align-items:center;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:20px;margin-right:12px;">' + m.icon + '</div>' +
            '<div>' +
                '<div style="font-size:13px;font-weight:600;color:#333;">' + m.title + '</div>' +
                '<div style="font-size:11px;color:#999;">' + m.desc + '</div>' +
            '</div>' +
        '</div>';
    });
    
    html += '</div></div>';
    container.innerHTML = html;
};

// V255: 将函数挂载到window（确保全局可访问）
window.renderGoalPage = renderGoalPage;
window.renderHabitPage = renderHabitPage;
window.renderAchievementPage = renderAchievementPage;
window.renderDiaryPage = renderDiaryPage;
window.renderMethodPage = renderMethodPage;
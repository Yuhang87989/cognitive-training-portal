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
    var streak = 0;
    var today = new Date().toDateString();
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    checkins.sort().reverse();
    for (var i = 0; i < checkins.length; i++) {
        var checkDate = new Date(checkins[i]).toDateString();
        var expectedDate = new Date(Date.now() - i * 86400000).toDateString();
        if (checkDate === expectedDate || (i === 0 && checkDate === yesterday)) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function hasCheckedInToday() {
    var checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    var today = new Date().toDateString();
    return checkins.some(function(c) { return new Date(c).toDateString() === today; });
}

function checkInToday() {
    if (hasCheckedInToday()) {
        window.showToast('今天已经打过卡啦！');
        return;
    }
    var checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    checkins.push(new Date().toISOString());
    localStorage.setItem('self_drive_checkins', JSON.stringify(checkins));
    window.showToast('🎉 打卡成功！继续加油！');
    renderSelfDrive(document.getElementById('fullscreen-content') || document.getElementById('main-content') || document.querySelector('.content'));
}

// ============================================================
// V432: 子页面使用 detail-modal 小窗口模式
// ============================================================

window._sdOpenSubPage = function() {
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
};

window._sdBackToMain = function() {
    var modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('show');
    var mainContainer = document.getElementById('fullscreen-content') || document.getElementById('main-content') || document.querySelector('.content');
    if (mainContainer && typeof window.renderSelfDrive === 'function') {
        window.renderSelfDrive(mainContainer);
    }
};

// 目标页面
function renderGoalPage() {
    window._sdOpenSubPage();
    var container = document.getElementById('detail-content') || document.body;
    
    container.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>' +
        '<button onclick="addGoal()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>' +
    '</div>' +
    (SelfDrive.goals.length === 0 ?
        '<div style="text-align:center;padding:40px;color:#999;"><div style="font-size:48px;margin-bottom:12px;">🎯</div><div>还没有设定目标</div><div style="font-size:12px;margin-top:8px;">设定一个小目标，开始行动吧！</div></div>'
    :
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
            SelfDrive.goals.map(function(goal, i) {
                return '<div style="background:#f8f9fa;padding:16px;border-radius:12px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
                        '<div style="flex:1;">' +
                            '<div style="font-size:14px;font-weight:600;color:#333;">' + goal.title + '</div>' +
                            '<div style="font-size:12px;color:#999;margin-top:4px;">截止日期：' + (goal.deadline || '无') + '</div>' +
                            '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' +
                                goal.steps.map(function(step, si) {
                                    return '<span onclick="toggleGoalStep(' + i + ',' + si + ')" style="font-size:11px;padding:4px 8px;background:' + (step.done ? '#43e97b' : '#e0e0e0') + ';color:' + (step.done ? 'white' : '#666') + ';border-radius:12px;cursor:pointer;">' + (step.done ? '✅' : '○') + ' ' + step.text + '</span>';
                                }).join('') +
                            '</div>' +
                        '</div>' +
                        '<button onclick="deleteGoal(' + i + ')" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;margin-left:8px;">删除</button>' +
                    '</div>' +
                '</div>';
            }).join('') +
        '</div>'
    ) +
    '<button onclick="window._sdBackToMain()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;margin-top:20px;">← 返回</button>';
}

function addGoal() {
    var title = prompt('🎯 输入目标名称：');
    if (!title) return;
    var deadline = prompt('📅 截止日期（如：2025-12-31，可留空）：') || '';
    var stepsText = prompt('📝 分解步骤（用逗号分隔，如：第一步,第二步,第三步）：') || '';
    var steps = stepsText.split(',').filter(function(s) { return s.trim(); }).map(function(s) {
        return { text: s.trim(), done: false };
    });
    
    SelfDrive.goals.push({ title: title, deadline: deadline, steps: steps });
    SelfDrive.save();
    window.showToast('✅ 目标已添加');
    renderGoalPage();
}

function toggleGoalStep(goalIndex, stepIndex) {
    SelfDrive.goals[goalIndex].steps[stepIndex].done = !SelfDrive.goals[goalIndex].steps[stepIndex].done;
    SelfDrive.save();
    renderGoalPage();
}

function deleteGoal(index) {
    if (!confirm('确定删除这个目标吗？')) return;
    SelfDrive.goals.splice(index, 1);
    SelfDrive.save();
    renderGoalPage();
}

// 习惯追踪页面
function renderHabitPage() {
    window._sdOpenSubPage();
    var container = document.getElementById('detail-content') || document.body;
    
    container.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h3 style="margin:0;font-size:18px;">📅 习惯追踪</h3>' +
        '<button onclick="addHabit()" style="padding:8px 16px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>' +
    '</div>' +
    (SelfDrive.habits.length === 0 ?
        '<div style="text-align:center;padding:40px;color:#999;"><div style="font-size:48px;margin-bottom:12px;">📅</div><div>还没有追踪习惯</div><div style="font-size:12px;margin-top:8px;">添加一个想养成的习惯吧！</div></div>'
    :
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
            SelfDrive.habits.map(function(habit, i) {
                return '<div style="background:#f8f9fa;padding:16px;border-radius:12px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                        '<div style="flex:1;">' +
                            '<div style="font-size:14px;font-weight:600;color:#333;">' + habit.icon + ' ' + habit.name + '</div>' +
                            '<div style="font-size:12px;color:#999;margin-top:4px;">连续 ' + (habit.streak || 0) + ' 天</div>' +
                        '</div>' +
                        '<div style="display:flex;gap:8px;">' +
                            '<button onclick="checkHabit(' + i + ')" style="padding:4px 12px;background:#43e97b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">打卡</button>' +
                            '<button onclick="deleteHabit(' + i + ')" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('') +
        '</div>'
    ) +
    '<button onclick="window._sdBackToMain()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;margin-top:20px;">← 返回</button>';
}

function addHabit() {
    var name = prompt('📅 输入习惯名称（如：每天背10个单词）：');
    if (!name) return;
    SelfDrive.habits.push({ name: name, icon: '✅', streak: 0, checkins: [] });
    SelfDrive.save();
    window.showToast('✅ 习惯已添加');
    renderHabitPage();
}

function checkHabit(index) {
    var habit = SelfDrive.habits[index];
    var today = new Date().toDateString();
    if (!habit.checkins) habit.checkins = [];
    var lastCheckin = habit.checkins.length > 0 ? new Date(habit.checkins[habit.checkins.length - 1]).toDateString() : null;
    if (lastCheckin === today) { window.showToast('今天已经打过卡啦！'); return; }
    habit.checkins.push(new Date().toISOString());
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastCheckin === yesterday) { habit.streak = (habit.streak || 0) + 1; } else { habit.streak = 1; }
    SelfDrive.save();
    window.showToast('🎉 打卡成功！继续坚持！');
    renderHabitPage();
}

function deleteHabit(index) {
    if (!confirm('确定删除这个习惯吗？')) return;
    SelfDrive.habits.splice(index, 1);
    SelfDrive.save();
    renderHabitPage();
}

// 成就墙页面
function renderAchievementPage() {
    window._sdOpenSubPage();
    var container = document.getElementById('detail-content') || document.body;
    
    var presetAchievements = [
        { id: 'first_goal', name: '设定目标', desc: '设定第一个目标', icon: '🎯', cond: SelfDrive.goals.length >= 1 },
        { id: 'checkin_7', name: '一周坚持', desc: '连续打卡7天', icon: '🔥', cond: calculateStreakDays() >= 7 },
        { id: 'checkin_30', name: '月度坚持', desc: '连续打卡30天', icon: '🏆', cond: calculateStreakDays() >= 30 },
        { id: 'habit_3', name: '习惯养成', desc: '同时追踪3个习惯', icon: '📅', cond: SelfDrive.habits.length >= 3 },
        { id: 'diary_5', name: '反思达人', desc: '写了5篇反思日记', icon: '📝', cond: SelfDrive.diary.length >= 5 },
        { id: 'achievement_unlock', name: '解锁成就', desc: '解锁3个成就', icon: '🏅', cond: SelfDrive.achievements.length >= 3 }
    ];
    
    presetAchievements.forEach(function(pa) {
        if (pa.cond && !SelfDrive.achievements.find(function(a) { return a.id === pa.id; })) {
            SelfDrive.achievements.push({ id: pa.id, name: pa.name, desc: pa.desc, icon: pa.icon, unlockedAt: new Date().toISOString() });
        }
    });
    SelfDrive.save();
    
    var achievementsHtml = presetAchievements.map(function(pa) {
        var unlocked = SelfDrive.achievements.find(function(a) { return a.id === pa.id; });
        return '<div style="text-align:center;padding:12px;background:' + (unlocked ? 'white' : '#f5f5f5') + ';border-radius:12px;opacity:' + (unlocked ? 1 : 0.5) + ';box-shadow:' + (unlocked ? '0 2px 8px rgba(0,0,0,0.05)' : 'none') + ';">' +
            '<div style="font-size:32px;margin-bottom:4px;">' + pa.icon + '</div>' +
            '<div style="font-size:12px;font-weight:600;color:#333;">' + pa.name + '</div>' +
            '<div style="font-size:10px;color:#999;margin-top:2px;">' + pa.desc + '</div>' +
            (unlocked ? '<div style="font-size:9px;color:#43e97b;margin-top:4px;">✅ 已解锁</div>' : '<div style="font-size:9px;color:#999;margin-top:4px;">🔒 未解锁</div>') +
        '</div>';
    }).join('');
    
    container.innerHTML = '<h3 style="margin:0 0 20px 0;font-size:18px;">🏆 成就墙</h3>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' + achievementsHtml + '</div>' +
        '<button onclick="window._sdBackToMain()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;margin-top:20px;">← 返回</button>';
}

// 每日反思页面
function renderDiaryPage() {
    window._sdOpenSubPage();
    var container = document.getElementById('detail-content') || document.body;
    
    container.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h3 style="margin:0;font-size:18px;">📝 每日反思</h3>' +
        '<button onclick="addDiary()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 写反思</button>' +
    '</div>' +
    (SelfDrive.diary.length === 0 ?
        '<div style="text-align:center;padding:40px;color:#999;"><div style="font-size:48px;margin-bottom:12px;">📝</div><div>还没有反思记录</div><div style="font-size:12px;margin-top:8px;">记录今天的收获与思考吧！</div></div>'
    :
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
            SelfDrive.diary.slice().reverse().map(function(entry, i) {
                return '<div style="background:#f8f9fa;padding:16px;border-radius:12px;">' +
                    '<div style="font-size:11px;color:#999;margin-bottom:8px;">' + entry.date + '</div>' +
                    '<div style="font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap;">' + entry.text + '</div>' +
                    '<div style="text-align:right;margin-top:8px;">' +
                        '<button onclick="deleteDiary(' + (SelfDrive.diary.length - 1 - i) + ')" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>' +
                    '</div>' +
                '</div>';
            }).join('') +
        '</div>'
    ) +
    '<button onclick="window._sdBackToMain()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;margin-top:20px;">← 返回</button>';
}

function addDiary() {
    var text = prompt('📝 今天有什么收获或感悟？');
    if (!text) return;
    SelfDrive.diary.push({ text: text, date: new Date().toLocaleString() });
    SelfDrive.save();
    window.showToast('✅ 已保存');
    renderDiaryPage();
}

function deleteDiary(index) {
    if (!confirm('确定删除这条反思吗？')) return;
    SelfDrive.diary.splice(index, 1);
    SelfDrive.save();
    renderDiaryPage();
}

// 训练方法库页面
function renderMethodPage() {
    window._sdOpenSubPage();
    var container = document.getElementById('detail-content') || document.body;
    
    var methods = [
        { icon: '🎯', title: '1. 强化"自主感"', desc: '把"我必须做"转变为"我选择做"', tips: ['改变语言：不说"我得去运动"，而说"我选择运动，因为它让我精力更好"', '给选项：不想写作业？可以"先写10分钟"或"先列大纲"。选其一，立刻行动'] },
        { icon: '💪', title: '2. 制造"胜任感"', desc: '动力来源于"我能做好"的预期', tips: ['拆解任务：把大目标分解到"不可能失败"的小步骤（如"背1个单词"）', '记录成就：每天写下3件完成的小事，哪怕只是"准时起床"'] },
        { icon: '💡', title: '3. 连接"价值感"', desc: '明确"为什么做"比"怎么做"更能激发持久动力', tips: ['追问5层：针对目标连续追问"为什么"，直到触及内在价值观', '视觉化结果：想象完成任务后的具体感受（如成就感、自由感），并写下来'] },
        { icon: '🌱', title: '4. 设计"低阻力"环境', desc: '自驱力脆弱时，环境是关键推手', tips: ['降低启动成本：想看书就把书放在枕头边；想学习就提前把文具准备好', '移除诱惑：学习时把手机放在另一个房间'] },
        { icon: '❓', title: '5. 用"好奇心"驱动探索', desc: '内驱力常源于未知。对过程而非结果好奇', tips: ['问"如果……会怎样"：如"如果我每天写100字，一个月后会写出什么？"', '允许无目的尝试：每周花1小时纯粹因为"觉得有趣"做一件事，不设目标'] },
        { icon: '🔄', title: '6. 建立正向反馈闭环', desc: '大脑依赖多巴胺维持动力', tips: ['即时奖励：完成任务后立即给自己一个小奖励（如听一首喜欢的歌）', '追踪进度：用可视化方式（如进度条、打卡记录）让成长"被看见"'] },
        { icon: '⚡', title: '7. 管理"认知资源"', desc: '自驱力像肌肉会疲劳，需要节能和恢复', tips: ['意志力配额：把最重要的决策放在精力最好的时段做', '主动休息：每45-90分钟强制休息，避免意志力耗尽'] }
    ];
    
    var methodsHtml = methods.map(function(m) {
        var tipsHtml = m.tips.map(function(t) { return '<div style="font-size:12px;color:#666;margin-bottom:4px;">• ' + t + '</div>'; }).join('');
        return '<div style="background:#f8f9fa;padding:16px;border-radius:12px;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
                '<span style="font-size:20px;">' + m.icon + '</span>' +
                '<span style="font-size:14px;font-weight:600;color:#333;">' + m.title + '</span>' +
            '</div>' +
            '<div style="font-size:12px;color:#667eea;margin-bottom:8px;">' + m.desc + '</div>' +
            '<div style="padding-left:28px;">' + tipsHtml + '</div>' +
        '</div>';
    }).join('');
    
    container.innerHTML = '<h3 style="margin:0 0 20px 0;font-size:18px;">📚 自驱力科学训练方法</h3>' +
        '<div style="font-size:12px;color:#666;margin-bottom:16px;">核心：由内在需求或兴趣驱动的行动力，而非依赖外部奖励或压力</div>' +
        '<div style="display:flex;flex-direction:column;gap:12px;">' + methodsHtml + '</div>' +
        '<button onclick="window._sdBackToMain()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;margin-top:20px;">← 返回</button>';
}

// 注册模块
if (typeof CTM !== 'undefined') {
    CTM.registerModule('selfdrive', { name: '自驱力训练', icon: '💪', render: renderSelfDrive });
}

// 将函数挂载到window，确保全局可访问
window.renderGoalPage = renderGoalPage;
window.renderHabitPage = renderHabitPage;
window.renderAchievementPage = renderAchievementPage;
window.renderDiaryPage = renderDiaryPage;
window.renderMethodPage = renderMethodPage;

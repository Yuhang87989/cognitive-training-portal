// ==========================================
// V195 自驱力与内驱力训练模块
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
    
    // 激励语录库
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
    const todayQuote = SelfDrive.getRandomQuote();
    const streakDays = calculateStreakDays();
    
    container.innerHTML = `
    <div style="padding:16px;">
        <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">💪 自驱力训练</h3>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#667eea20,#764ba220);border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:12px;color:#667eea;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${todayQuote}</div>
        </div>
        
        <!-- 连续打卡 -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-size:14px;font-weight:600;">🔥 连续打卡</span>
                <span style="font-size:28px;font-weight:bold;color:#ff6b6b;">${streakDays}天</span>
            </div>
            <button onclick="checkInToday()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff6b6b,#ff9a63);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">
                ${hasCheckedInToday() ? '✅ 今日已打卡' : '📝 今日打卡'}
            </button>
        </div>
        
        <!-- 功能入口 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <button onclick="renderGoalPage()" style="padding:20px 12px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">
                🎯 目标设定
            </button>
            <button onclick="renderHabitPage()" style="padding:20px 12px;background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">
                📅 习惯追踪
            </button>
            <button onclick="renderAchievementPage()" style="padding:20px 12px;background:linear-gradient(135deg,#fa709a,#fee140);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">
                🏆 成就墙
            </button>
            <button onclick="renderDiaryPage()" style="padding:20px 12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">
                📝 每日反思
            </button>
        </div>
        
        <!-- 成就概览 -->
        <div style="background:white;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📊 训练概览</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                <div><div style="font-size:24px;font-weight:bold;color:#667eea;">${SelfDrive.goals.length}</div><div style="font-size:11px;color:#999;">目标</div></div>
                <div><div style="font-size:24px;font-weight:bold;color:#43e97b;">${SelfDrive.habits.length}</div><div style="font-size:11px;color:#999;">习惯</div></div>
                <div><div style="font-size:24px;font-weight:bold;color:#fa709a;">${SelfDrive.achievements.length}</div><div style="font-size:11px;color:#999;">成就</div></div>
            </div>
        </div>
    </div>`;
};

// 计算连续打卡天数
function calculateStreakDays() {
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    if (checkins.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    checkins.sort().reverse();
    for (let i = 0; i < checkins.length; i++) {
        const checkDate = new Date(checkins[i]).toDateString();
        const expectedDate = new Date(Date.now() - i * 86400000).toDateString();
        if (checkDate === expectedDate || (i === 0 && checkDate === yesterday)) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function hasCheckedInToday() {
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    const today = new Date().toDateString();
    return checkins.some(c => new Date(c).toDateString() === today);
}

function checkInToday() {
    if (hasCheckedInToday()) {
        showToast('今天已经打过卡啦！');
        return;
    }
    
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    checkins.push(new Date().toISOString());
    localStorage.setItem('self_drive_checkins', JSON.stringify(checkins));
    
    showToast('🎉 打卡成功！继续加油！');
    renderSelfDrive(document.getElementById('main-content') || document.querySelector('.content'));
}

// 目标页面
function renderGoalPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>
            <button onclick="addGoal()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>
        </div>
        ${SelfDrive.goals.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">🎯</div>
                <div>还没有设定目标</div>
                <div style="font-size:12px;margin-top:8px;">设定一个小目标，开始行动吧！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.goals.map((goal, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                            <div style="flex:1;">
                                <div style="font-size:14px;font-weight:600;color:#333;text-decoration:${goal.completed ? 'line-through' : 'none'};opacity:${goal.completed ? 0.5 : 1};">${goal.text}</div>
                                <div style="font-size:11px;color:#999;margin-top:4px;">${goal.date || ''}</div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button onclick="toggleGoal(${i})" style="padding:4px 8px;background:${goal.completed ? '#43e97b' : '#f0f0f0'};color:${goal.completed ? 'white' : '#666'};border:none;border-radius:6px;font-size:11px;cursor:pointer;">${goal.completed ? '✅' : '完成'}</button>
                                <button onclick="deleteGoal(${i})" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addGoal() {
    const text = prompt('🎯 输入你的目标：');
    if (!text) return;
    
    SelfDrive.goals.push({
        text: text,
        date: new Date().toLocaleDateString(),
        completed: false
    });
    SelfDrive.save();
    showToast('✅ 目标已添加');
    renderGoalPage();
}

function toggleGoal(index) {
    SelfDrive.goals[index].completed = !SelfDrive.goals[index].completed;
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
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">📅 习惯追踪</h3>
            <button onclick="addHabit()" style="padding:8px 16px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>
        </div>
        ${SelfDrive.habits.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">📅</div>
                <div>还没有添加习惯</div>
                <div style="font-size:12px;margin-top:8px;">好习惯从今天开始养成！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.habits.map((habit, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <span style="font-size:14px;font-weight:600;color:#333;">${habit.icon || '✅'} ${habit.name}</span>
                            <span style="font-size:12px;color:#43e97b;font-weight:600;">${habit.streak || 0}天</span>
                        </div>
                        <div style="display:flex;gap:4px;margin-bottom:8px;">
                            ${(habit.checkins || []).slice(-7).map(c => `
                                <div style="width:14px;height:14px;background:#43e97b;border-radius:3px;"></div>
                            `).join('')}
                            ${Array(Math.max(0, 7 - (habit.checkins || []).length)).fill(0).map(() => `
                                <div style="width:14px;height:14px;background:#f0f0f0;border-radius:3px;"></div>
                            `).join('')}
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button onclick="checkHabit(${i})" style="flex:1;padding:8px;background:#43e97b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">今日打卡</button>
                            <button onclick="deleteHabit(${i})" style="padding:8px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addHabit() {
    const name = prompt('📅 输入习惯名称（如：每天背10个单词）：');
    if (!name) return;
    
    SelfDrive.habits.push({
        name: name,
        icon: '✅',
        streak: 0,
        checkins: []
    });
    SelfDrive.save();
    showToast('✅ 习惯已添加');
    renderHabitPage();
}

function checkHabit(index) {
    const habit = SelfDrive.habits[index];
    const today = new Date().toDateString();
    
    if (!habit.checkins) habit.checkins = [];
    
    const lastCheckin = habit.checkins.length > 0 ? new Date(habit.checkins[habit.checkins.length - 1]).toDateString() : null;
    if (lastCheckin === today) {
        showToast('今天已经打过卡啦！');
        return;
    }
    
    habit.checkins.push(new Date().toISOString());
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastCheckin === yesterday) {
        habit.streak = (habit.streak || 0) + 1;
    } else {
        habit.streak = 1;
    }
    
    SelfDrive.save();
    showToast('🎉 打卡成功！继续坚持！');
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
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    // 预设成就
    const presetAchievements = [
        { id: 'first_goal', name: '设定目标', desc: '设定第一个目标', icon: '🎯', condition: () => SelfDrive.goals.length >= 1 },
        { id: 'checkin_7', name: '一周坚持', desc: '连续打卡7天', icon: '🔥', condition: () => calculateStreakDays() >= 7 },
        { id: 'checkin_30', name: '月度坚持', desc: '连续打卡30天', icon: '🏆', condition: () => calculateStreakDays() >= 30 },
        { id: 'habit_3', name: '习惯养成', desc: '同时追踪3个习惯', icon: '📅', condition: () => SelfDrive.habits.length >= 3 },
        { id: 'diary_5', name: '反思达人', desc: '写了5篇反思日记', icon: '📝', condition: () => SelfDrive.diary.length >= 5 },
        { id: 'achievement_unlock', name: '解锁成就', desc: '解锁3个成就', icon: '🏅', condition: () => SelfDrive.achievements.length >= 3 }
    ];
    
    // 检查并解锁新成就
    presetAchievements.forEach(pa => {
        if (pa.condition() && !SelfDrive.achievements.find(a => a.id === pa.id)) {
            SelfDrive.achievements.push({
                id: pa.id,
                name: pa.name,
                desc: pa.desc,
                icon: pa.icon,
                unlockedAt: new Date().toISOString()
            });
        }
    });
    SelfDrive.save();
    
    container.innerHTML = `
    <div style="padding:20px;">
        <h3 style="margin:0 0 20px 0;font-size:18px;">🏆 成就墙</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            ${presetAchievements.map(pa => {
                const unlocked = SelfDrive.achievements.find(a => a.id === pa.id);
                return `
                    <div style="text-align:center;padding:12px;background:${unlocked ? 'white' : '#f5f5f5'};border-radius:12px;opacity:${unlocked ? 1 : 0.5};box-shadow:${unlocked ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'};">
                        <div style="font-size:32px;margin-bottom:4px;">${pa.icon}</div>
                        <div style="font-size:12px;font-weight:600;color:#333;">${pa.name}</div>
                        <div style="font-size:10px;color:#999;margin-top:2px;">${pa.desc}</div>
                        ${unlocked ? '<div style="font-size:9px;color:#43e97b;margin-top:4px;">✅ 已解锁</div>' : '<div style="font-size:9px;color:#999;margin-top:4px;">🔒 未解锁</div>'}
                    </div>
                `;
            }).join('')}
        </div>
    </div>`;
}

// 每日反思页面
function renderDiaryPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">📝 每日反思</h3>
            <button onclick="addDiary()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 写反思</button>
        </div>
        ${SelfDrive.diary.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">📝</div>
                <div>还没有反思记录</div>
                <div style="font-size:12px;margin-top:8px;">记录今天的收获与思考吧！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.diary.slice().reverse().map((entry, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size:11px;color:#999;margin-bottom:8px;">${entry.date}</div>
                        <div style="font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap;">${entry.text}</div>
                        <div style="text-align:right;margin-top:8px;">
                            <button onclick="deleteDiary(${SelfDrive.diary.length - 1 - i})" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addDiary() {
    const text = prompt('📝 今天有什么收获或感悟？');
    if (!text) return;
    
    SelfDrive.diary.push({
        text: text,
        date: new Date().toLocaleString()
    });
    SelfDrive.save();
    showToast('✅ 已保存');
    renderDiaryPage();
}

function deleteDiary(index) {
    if (!confirm('确定删除这条反思吗？')) return;
    SelfDrive.diary.splice(index, 1);
    SelfDrive.save();
    renderDiaryPage();
}

// 注册模块
if (typeof CTM !== 'undefined') {
    CTM.registerModule('selfdrive', {
        name: '自驱力训练',
        icon: '💪',
        render: renderSelfDrive
    });
}

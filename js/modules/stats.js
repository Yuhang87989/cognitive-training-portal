// ============================================================
// V201 - 学习统计模块
// 功能：每周回顾、进步曲线
// ============================================================

// ============================================================
// 每周回顾功能
// ============================================================
function renderWeeklyReview(container) {
    const user = getCurrentUserData();
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    weekStart.setHours(0, 0, 0, 0);
    
    // 计算本周学习数据
    let studyDays = 0;
    let totalMinutes = 0;
    let topicsCompleted = 0;
    let methodCompleted = 0;
    let thinkingCompleted = 0;
    
    if (user && user.studyDays) {
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(weekStart);
            checkDate.setDate(weekStart.getDate() + i);
            const dateStr = checkDate.toISOString().split('T')[0];
            if (user.studyDays[dateStr]) {
                studyDays++;
                totalMinutes += user.studyDays[dateStr];
            }
        }
    }
    
    // 统计各模块完成情况
    if (user && user.topicStats) {
        Object.values(user.topicStats).forEach(s => {
            if (s.lastTime >= weekStart.getTime()) {
                topicsCompleted += s.attempts || 0;
            }
        });
    }
    
    if (user && user.methodStats) {
        Object.values(user.methodStats).forEach(s => {
            if (s.lastTime >= weekStart.getTime()) {
                methodCompleted += s.completed || 0;
            }
        });
    }
    
    if (user && user.thinkingStats) {
        Object.values(user.thinkingStats).forEach(s => {
            if (s.lastTime >= weekStart.getTime()) {
                thinkingCompleted += s.completed || 0;
            }
        });
    }
    
    // 生成鼓励语
    const encouragement = getEncouragement(studyDays, totalMinutes);
    
    container.innerHTML = `
        <div style="padding:20px;max-width:600px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:24px;">
                <h2 style="color:#333;margin:0;">📅 每周回顾</h2>
                <p style="color:#666;font-size:14px;margin-top:8px;">
                    ${weekStart.toLocaleDateString('zh-CN', {month:'long',day:'numeric'})} - ${today.toLocaleDateString('zh-CN', {month:'long',day:'numeric'})}
                </p>
            </div>
            
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:20px;">
                <div style="font-size:14px;opacity:0.9;margin-bottom:8px;">本周学习时长</div>
                <div style="font-size:48px;font-weight:bold;">${totalMinutes}<span style="font-size:20px;opacity:0.8;"> 分钟</span></div>
                <div style="font-size:14px;opacity:0.9;margin-top:4px;">共 ${studyDays} 天坚持学习 💪</div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                <div style="background:#f8f9fa;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:#667eea;">${topicsCompleted}</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">📚 母题练习</div>
                </div>
                <div style="background:#f8f9fa;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:#764ba2;">${methodCompleted}</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">💡 学霸方法</div>
                </div>
                <div style="background:#f8f9fa;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:#f093fb;">${thinkingCompleted}</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">🧩 思维训练</div>
                </div>
                <div style="background:#f8f9fa;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:28px;font-weight:bold;color:#4facfe;">${user?.wrongNotes?.length || 0}</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">📝 错题收集</div>
                </div>
            </div>
            
            <div style="background:#fff9e6;border-radius:12px;padding:20px;border:1px solid #ffeaa7;">
                <div style="font-size:16px;font-weight:bold;color:#f39c12;margin-bottom:8px;">🌟 学习建议</div>
                <div style="font-size:14px;color:#666;line-height:1.8;">
                    ${encouragement}
                </div>
            </div>
            
            <div style="margin-top:24px;text-align:center;">
                <button onclick="closeFullscreenPage()" style="background:#667eea;color:white;border:none;padding:12px 32px;border-radius:24px;font-size:14px;cursor:pointer;">
                    返回继续学习
                </button>
            </div>
        </div>
    `;
}

function getEncouragement(days, minutes) {
    if (days >= 6 && minutes >= 300) {
        return "太棒了！你本周学习非常认真，坚持了整整6天以上，学习时长超过5小时。继续保持这种学习状态，你一定会取得更大的进步！建议下周可以挑战一些更有难度的题目。";
    } else if (days >= 4 && minutes >= 180) {
        return "表现不错！本周你保持了良好的学习节奏，有4天以上的学习记录。建议下周可以适当增加一些学习时间，特别是错题的复习巩固。";
    } else if (days >= 2) {
        return "学习贵在坚持！本周你已经有了不错的开始。建议下周尽量保持每天都有学习记录，哪怕每天15分钟，坚持下来就会有很大收获。";
    } else {
        return "新的一周开始了！让我们一起加油，制定一个小目标，比如每天学习15分钟。记住，学习是一个积累的过程，坚持就是胜利！";
    }
}

// ============================================================
// 进步曲线功能
// ============================================================
function renderProgressChart(container) {
    const user = getCurrentUserData();
    const today = new Date();
    
    // 获取最近30天的数据
    const daysData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const minutes = user?.studyDays?.[dateStr] || 0;
        daysData.push({
            date: dateStr,
            label: date.toLocaleDateString('zh-CN', {month:'numeric',day:'numeric'}),
            minutes: minutes
        });
    }
    
    // 计算统计数据
    const totalDays = daysData.filter(d => d.minutes > 0).length;
    const totalMinutes = daysData.reduce((sum, d) => sum + d.minutes, 0);
    const avgMinutes = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;
    const maxMinutes = Math.max(...daysData.map(d => d.minutes));
    
    // 生成简单的图表HTML
    const chartBars = daysData.map(d => {
        const height = maxMinutes > 0 ? Math.round(d.minutes / maxMinutes * 100) : 0;
        const color = d.minutes > 60 ? '#667eea' : d.minutes > 30 ? '#4facfe' : '#a8e6cf';
        return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:120px;">
                <div style="width:8px;background:${color};height:${Math.max(height, 2)}%;border-radius:4px 4px 0 0;" 
                     title="${d.label}: ${d.minutes}分钟"></div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div style="padding:20px;max-width:700px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:24px;">
                <h2 style="color:#333;margin:0;">📉 进步曲线</h2>
                <p style="color:#666;font-size:14px;margin-top:8px;">最近30天学习记录</p>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;">
                <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;text-align:center;color:white;">
                    <div style="font-size:32px;font-weight:bold;">${totalDays}</div>
                    <div style="font-size:12px;opacity:0.9;margin-top:4px;">学习天数</div>
                </div>
                <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);border-radius:12px;padding:16px;text-align:center;color:white;">
                    <div style="font-size:32px;font-weight:bold;">${totalMinutes}</div>
                    <div style="font-size:12px;opacity:0.9;margin-top:4px;">总分钟数</div>
                </div>
                <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);border-radius:12px;padding:16px;text-align:center;color:white;">
                    <div style="font-size:32px;font-weight:bold;">${avgMinutes}</div>
                    <div style="font-size:12px;opacity:0.9;margin-top:4px;">日均分钟</div>
                </div>
            </div>
            
            <div style="background:#f8f9fa;border-radius:16px;padding:20px;margin-bottom:20px;">
                <div style="font-size:14px;color:#666;margin-bottom:12px;">每日学习时长（分钟）</div>
                <div style="display:flex;gap:2px;align-items:flex-end;padding:10px 0;border-bottom:1px solid #e0e0e0;">
                    ${chartBars}
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;color:#999;">
                    <span>${daysData[0].label}</span>
                    <span>${daysData[Math.floor(daysData.length / 2)].label}</span>
                    <span>${daysData[daysData.length - 1].label}</span>
                </div>
            </div>
            
            <div style="background:#e8f5e9;border-radius:12px;padding:20px;border:1px solid #a5d6a7;">
                <div style="font-size:16px;font-weight:bold;color:#2e7d32;margin-bottom:8px;">📈 成长分析</div>
                <div style="font-size:14px;color:#666;line-height:1.8;">
                    ${getProgressAnalysis(totalDays, totalMinutes, avgMinutes)}
                </div>
            </div>
            
            <div style="margin-top:24px;text-align:center;">
                <button onclick="closeFullscreenPage()" style="background:#667eea;color:white;border:none;padding:12px 32px;border-radius:24px;font-size:14px;cursor:pointer;">
                    返回继续学习
                </button>
            </div>
        </div>
    `;
}

function getProgressAnalysis(days, total, avg) {
    if (days >= 20 && avg >= 30) {
        return "你的学习状态非常稳定！连续20多天保持学习，日均学习时长超过30分钟。这种坚持的态度非常可贵，继续保持下去，你的能力一定会有质的飞跃！";
    } else if (days >= 15 && avg >= 20) {
        return "学习状态良好！你已经建立了不错的学习习惯。建议可以尝试每天增加5-10分钟的学习时间，或者每周设定一个具体的学习目标来挑战自己。";
    } else if (days >= 10) {
        return "学习习惯正在养成中！每一次的坚持都是进步。建议把学习融入日常生活，比如饭后学习15分钟，慢慢形成固定的学习节奏。";
    } else {
        return "学习之路才刚刚开始！不要着急，从每天10分钟开始，循序渐进。最重要的是养成每天学习的习惯，相信自己，你一定可以做到！";
    }
}

// ============================================================
// 导出函数到 window
// ============================================================
window.renderWeeklyReview = renderWeeklyReview;
window.renderProgressChart = renderProgressChart;

console.log('V201 - 学习统计模块已加载');

// ==========================================
// V195 我的 - 个人中心页面
// ==========================================

window.renderMyPage = function(container) {
    const user = getCurrentUserData();
    const streakDays = calculateStreakDays();
    
    container.innerHTML = `
    <div style="padding:16px;">
        <!-- 用户信息卡片 -->
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">
                    ${user.avatar || '👤'}
                </div>
                <div>
                    <div style="font-size:18px;font-weight:600;">${user.name || '同学'}</div>
                    <div style="font-size:12px;opacity:0.8;">连续学习 ${streakDays} 天</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.totalTime || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">学习分钟</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.completedTasks || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">完成任务</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${(user.accuracy || 0).toFixed(0)}%</div>
                    <div style="font-size:11px;opacity:0.8;">正确率</div>
                </div>
            </div>
        </div>
        
        <!-- 功能入口 -->
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
            <div onclick="openFullscreenPage('wrongbook')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">📒</div>
                <div style="font-size:14px;font-weight:600;color:#333;">错题本</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">复习巩固</div>
            </div>
            <div onclick="openFullscreenPage('selfdrive')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">💪</div>
                <div style="font-size:14px;font-weight:600;color:#333;">自驱力训练</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">目标·习惯·反思</div>
            </div>
            <div onclick="openFullscreenPage('backup')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">💾</div>
                <div style="font-size:14px;font-weight:600;color:#333;">数据备份</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">防止数据丢失</div>
            </div>
            <div onclick="openSettings()" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">⚙️</div>
                <div style="font-size:14px;font-weight:600;color:#333;">设置</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">个性化选项</div>
            </div>
        </div>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#43e97b20,#38f9d720);border-radius:12px;padding:16px;">
            <div style="font-size:12px;color:#43e97b;font-weight:600;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${SelfDrive.getRandomQuote()}</div>
        </div>
    </div>`;
};

// 注册备份页面全屏显示
function openBackupPage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💾 数据备份';
        renderBackupManager(content);
    }
}

// 注册自驱力训练全屏页面
function openSelfDrivePage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💪 自驱力训练';
        renderSelfDrive(content);
    }
}

// 注册到CTM
if (typeof CTM !== 'undefined') {
    CTM.registerModule('my', {
        name: '我的',
        icon: '👤',
        render: renderMyPage
    });
    
    CTM.registerModule('backup', {
        name: '数据备份',
        icon: '💾',
        render: renderBackupManager
    });
    
    CTM.registerModule('selfdrive', {
        name: '自驱力训练',
        icon: '💪',
        render: renderSelfDrive
    });
}

// 版本: V144

// 用户下拉菜单点击外部关闭
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('user-dropdown');
    const avatar = document.getElementById('header-avatar');
    if (dropdown && avatar) {
        if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});

const gradeNames = {5:'五年级',6:'六年级',7:'初一',8:'初二',9:'初三'};

function toggleUserMenu() {
    var el = document.getElementById('user-dropdown');
    if (el) {
        el.classList.toggle('show');
        // Add click-outside-to-close
        if (el.classList.contains('show')) {
            setTimeout(function() {
                document.addEventListener('click', closeUserMenuOutside);
            }, 10);
        }
    }
}

function closeUserMenuOutside(e) {
    var dropdown = document.getElementById('user-dropdown');
    var wrapper = document.querySelector('.user-menu-wrapper');
    if (dropdown && wrapper && !wrapper.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeUserMenuOutside);
    }
}

function showUserSwitchModal() {
    closeUserMenu();
    var data = loadData();
    
    if (data.users.length === 0) {
        showToast('暂无用户，请先创建账号');
        return;
    }
    
    if (data.users.length === 1) {
        showToast('只有一个用户：' + data.users[0].name + '，无需切换');
        return;
    }
    
    var container = document.getElementById('user-switch-list');
    if (!container) {
        showToast('页面加载异常');
        return;
    }
    
    var colors = ['#667eea', '#FF9A63', '#43E97B'];
    var htmlContent = '';
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:8px;padding:12px;background:' + (isCurrent ? '#f0f7ff' : 'white') + ';border-radius:12px;margin-bottom:8px;">';
        htmlContent += '<div onclick="switchToUser(\'' + u.id + '\')" style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer;">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div><div style="font-weight:600;">' + u.name + (isCurrent ? ' (当前)' : '') + '</div>';
        htmlContent += '<div style="font-size:12px;color:#999;">' + gradeNames[u.grade] + ' · Lv.' + u.difficulty + '</div></div></div>';
        if (!isCurrent) {
            htmlContent += '<button onclick="event.stopPropagation();deleteUser(\'' + u.id + '\')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('user-switch-modal').classList.add('show');
}

function showCreateUserModal() { document.getElementById('create-user-modal').classList.add('show'); }

function quickLogin(userId) {
    const data = loadData();
    const user = data.users.find(u => u.id === userId);
    if (!user) return;
    data.currentUser = userId;
    saveData(data);
    const displayEl = document.getElementById('selected-user-display');
    const formEl = document.getElementById('login-form-section');
    const diffEl = document.getElementById('login-difficulty');
    const btn = document.querySelector('.user-select-btn');
    const dropdown = document.getElementById('user-select-dropdown');
    if (displayEl) displayEl.innerHTML = '<span>' + user.name.charAt(0) + '</span> ' + user.name;
    if (formEl) formEl.style.display = 'block';
    if (diffEl) diffEl.value = user.difficulty || 1;
    if (btn) btn.dataset.userId = userId;
    if (dropdown) dropdown.classList.remove('show');
}

function openEditProfileModal() {
    const user = getCurrentUserData();
    if (user) {
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-grade').value = user.grade;
    }
    document.getElementById('edit-profile-modal').classList.add('show');
}

function openDifficultyModal() {
    const userData = getCurrentUserData();
    const currentLevel = userData ? userData.difficulty : 1;
    // 高亮当前选中的按钮
    document.querySelectorAll('.diff-btn').forEach(btn => {
        const isSelected = btn.dataset.level == currentLevel;
        btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
        btn.style.background = isSelected ? '#E8F4FF' : 'white';
    });
    document.getElementById('difficulty-modal').classList.add('show');
}

function openAvatarModal() {
    const user = getCurrentUserData();
    const modal = document.getElementById('avatar-modal');
    const content = document.getElementById('avatar-modal-content');
    
    if (!modal || !content) return;
    
    // 获取当前头像
    const currentAvatar = user ? user.avatar || AVATAR_LIST[0].emoji : AVATAR_LIST[0].emoji;
    
    let avatarHtml = '<div class="modal-title">🎨 选择头像</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">';
    
    AVATAR_LIST.forEach((avatar, index) => {
        const isSelected = avatar.emoji === currentAvatar;
        avatarHtml += `
            <div onclick="selectAvatar('${avatar.emoji}')" style="
                width:60px;height:60px;
                background:${avatar.gradient};
                border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                font-size:28px;
                cursor:pointer;
                border:${isSelected ? '3px solid #667eea' : '3px solid transparent'};
                box-shadow:${isSelected ? '0 4px 12px rgba(102,126,234,0.4)' : 'none'};
                transition:all 0.2s;
            ">${avatar.emoji}</div>
        `;
    });
    
    avatarHtml += '</div>';
    avatarHtml += '<button onclick="closeAvatarModal()" class="login-btn login-btn-secondary">取消</button>';
    
    content.innerHTML = avatarHtml;
    modal.classList.add('show');
    closeUserMenu();
}

function renderUserList() {
    const data = loadData();
    const container = document.getElementById('user-list-container');
    if (!container) return;
    const colors = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#FF9A63,#E87A4E)', 'linear-gradient(135deg,#43E97B,#38F9D7)'];
    const currentUserId = data.currentUser;
    container.innerHTML = data.users.length === 0 
        ? '<div style="padding:12px;text-align:center;color:var(--text-light);">暂无用户，请创建新账号</div>'
        : data.users.map((u, i) => `
            <div class="user-select-item" onclick="quickLogin('${u.id}')" style="${u.id === currentUserId ? 'background:#e8f4ff;border:1px solid #3377ff;' : ''}">
                <div class="item-avatar" style="background:${colors[i%3]};color:white;">${u.name.charAt(0)}</div>
                <div class="item-info">
                    <div class="item-name">${u.name} ${u.id === currentUserId ? '(当前)' : ''}</div>
                    <div class="item-grade">${gradeNames[u.grade]} · Lv.${u.difficulty}</div>
                </div>
            </div>
        `).join('');
}

function createNewUser() {
    var nameEl = document.getElementById('create-name');
    var gradeEl = document.getElementById('create-grade');
    var diffEl = document.getElementById('create-difficulty');
    
    var name = nameEl ? nameEl.value.trim() : '';
    var grade = gradeEl ? parseInt(gradeEl.value) : 7;
    var difficulty = diffEl ? parseInt(diffEl.value) : 1;
    
    if (!name) {
        showToast('请输入名字');
        return;
    }
    
    var data = loadData();
    
    // 检查名字是否重复
    if (data.users.some(function(u) { return u.name === name; })) {
        showToast('名字已存在，请换一个');
        return;
    }
    
    var newUser = {
        id: 'user_default_qiuyufei',
        name: name,
        grade: grade,
        difficulty: difficulty,
        points: 1000,
        createdAt: new Date().toISOString(),
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            totalMinutes: 0,
            streakDays: 0,
            lastActiveDate: null
        },
        topicStats: {},
        weeklyProgress: {},
        wrongNotes: [],
        completedTopics: [],
        methodStats: {},
        thinkingStats: {},
        gameScores: {},
        gameCounts: {},
        gameTimes: {}
    };
    
    data.users.push(newUser);
    data.currentUser = newUser.id;
    saveData(data);
    
    closeCreateUserModal();
    
    // 同步所有模块数据
    updateUI();
    syncTodayStats();
    renderUserList();
    
    // 更新所有相关显示
    var headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) headerAvatar.textContent = name.charAt(0);
    
    var greetingName = document.getElementById('greeting-name');
    if (greetingName) greetingName.textContent = name;
    
    var dropdownName = document.getElementById('dropdown-name');
    if (dropdownName) dropdownName.textContent = name;
    
    var dropdownInfo = document.getElementById('dropdown-info');
    if (dropdownInfo) dropdownInfo.textContent = gradeNames[grade] + ' · Lv.' + difficulty;
    
    var difficultyText = document.getElementById('difficulty-text');
    if (difficultyText) difficultyText.textContent = 'Lv.' + difficulty;
    
    showToast('创建成功: ' + name);
    
    // 清空表单
    if (nameEl) nameEl.value = '';
}

function closeCreateUserModal() { document.getElementById('create-user-modal').classList.remove('show'); document.getElementById('create-name').value = ''; }

function closeUserSwitchModal() { document.getElementById('user-switch-modal').classList.remove('show'); }

function setDifficulty(level) {
    const userData = getCurrentUserData();
    if (userData) {
        userData.difficulty = level;
        syncUserData(userData);
        // 更新首页难度显示
        const diffText = document.getElementById('difficulty-text');
        if (diffText) diffText.textContent = 'Lv.' + level;
        // 更新设置面板难度显示
        const settingsDiff = document.getElementById('settings-difficulty-display');
        if (settingsDiff) settingsDiff.textContent = 'Lv.' + level;
        // 更新下拉菜单中的难度信息
        const dropInfoEl = document.getElementById('dropdown-info');
        if (dropInfoEl) {
            dropInfoEl.textContent = gradeNames[userData.grade] + ' · Lv.' + level;
        }
        // 高亮当前选中的按钮
        document.querySelectorAll('.diff-btn').forEach(btn => {
            const isSelected = btn.dataset.level == level;
            btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
            btn.style.background = isSelected ? '#E8F4FF' : 'white';
        });
        showToast('难度已调整为 Lv.' + level);
    }
    closeDifficultyModal();
}

function closeDifficultyModal() {
    document.getElementById('difficulty-modal').classList.remove('show');
}

function saveProfileChanges() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const newName = document.getElementById('edit-name').value.trim();
    const newGrade = parseInt(document.getElementById('edit-grade').value);
    
    if (!newName) {
        showToast('请输入姓名');
        return;
    }
    
    user.name = newName;
    user.grade = newGrade;
    syncUserData(user);
    
    // 更新所有UI
    updateUI();
    openSettingsPanel(); // 刷新设置面板
    closeEditProfileModal();
    showToast('个人信息已更新');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('show');
}

function savePasswordChanges() {
    const currentPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;
    
    if (!currentPwd || !newPwd || !confirmPwd) {
        showToast('请填写所有密码字段');
        return;
    }
    
    if (newPwd !== confirmPwd) {
        showToast('两次输入的新密码不一致');
        return;
    }
    
    if (newPwd.length < 6) {
        showToast('密码长度至少6位');
        return;
    }
    
    // 验证当前密码（简化版，实际应做密码验证）
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data.password && data.password !== currentPwd) {
        showToast('当前密码错误');
        return;
    }
    
    // 保存新密码
    data.password = newPwd;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    closeChangePasswordModal();
    showToast('密码修改成功');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('show');
}

function openApiConfigModal(type) {
    const config = getApiConfig();
    const modal = document.getElementById('api-config-modal');
    const content = document.getElementById('api-config-content');
    
    if (!modal || !content) return;
    
    if (type === 'deepseek') {
        content.innerHTML = `
            <div class="modal-title">🔑 DeepSeek API 配置</div>
            <div style="margin-bottom:16px;">
                <label style="font-size:13px;color:#666;display:block;margin-bottom:6px;">API Key</label>
                <input type="password" id="api-key-input" class="input-field" placeholder="请输入 DeepSeek API Key" value="${config.deepseek || ''}">
                <div style="font-size:11px;color:#999;margin-top:6px;">用于AI智能助手和所有AI功能</div>
            </div>
            <button onclick="saveApiConfigModal('deepseek')" class="login-btn login-btn-primary" style="margin-bottom:8px;">保存配置</button>
            <button onclick="closeApiConfigModal()" class="login-btn login-btn-secondary">取消</button>
        `;
    } else if (type === 'peerjs') {
        content.innerHTML = `
            <div class="modal-title">🔗 PeerJS 服务器配置</div>
            <div style="margin-bottom:16px;">
                <label style="font-size:13px;color:#666;display:block;margin-bottom:6px;">服务器地址</label>
                <input type="text" id="api-key-input" class="input-field" placeholder="请输入 PeerJS 服务器地址" value="${config.peerjs || '0.peerjs.com'}">
                <div style="font-size:11px;color:#999;margin-top:6px;">用于音视频通话功能</div>
            </div>
            <button onclick="saveApiConfigModal('peerjs')" class="login-btn login-btn-primary" style="margin-bottom:8px;">保存配置</button>
            <button onclick="closeApiConfigModal()" class="login-btn login-btn-secondary">取消</button>
        `;
    }
    
    modal.classList.add('show');
}

function selectAvatar(emoji) {
    const user = getCurrentUserData();
    if (user) {
        user.avatar = emoji;
        syncUserData(user);
        updateAllAvatarDisplays();
        showToast('头像已更换');
    }
    closeAvatarModal();
}

function openChangePasswordModal() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('change-password-modal').classList.add('show');
}



// ============================================================
// WeekPlans - 周计划数据
// ============================================================

// Window exports for onclick handlers
window.closeChangePasswordModal = closeChangePasswordModal;
window.closeCreateUserModal = closeCreateUserModal;
window.closeDifficultyModal = closeDifficultyModal;
window.closeEditProfileModal = closeEditProfileModal;
window.closeUserSwitchModal = closeUserSwitchModal;
window.createNewUser = createNewUser;
window.openApiConfigModal = openApiConfigModal;
window.openAvatarModal = openAvatarModal;
window.openChangePasswordModal = openChangePasswordModal;
window.openDifficultyModal = openDifficultyModal;
window.openEditProfileModal = openEditProfileModal;
window.savePasswordChanges = savePasswordChanges;
window.saveProfileChanges = saveProfileChanges;
window.showCreateUserModal = showCreateUserModal;
window.showUserSwitchModal = showUserSwitchModal;
window.toggleUserMenu = toggleUserMenu;
window.selectAvatar = selectAvatar;
if (typeof selectGrade !== "undefined") window.selectGrade = selectGrade;

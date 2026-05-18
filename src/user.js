/**
 * 用户模块 - ES6 Modules 版本
 */

import { loadData, saveData, getCurrentUser, createUser, deleteUser } from './storage.js';
import { showToast } from './utils.js';

// 获取所有用户
export function getAllUsers() {
    const data = loadData();
    return data.users || [];
}

// 快速登录（用户选择）
export function quickLogin(userId) {
    const data = loadData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
        data.currentUser = userId;
        saveData(data);
        showToast(`已切换到: ${user.name}`);
        // 刷新页面
        setTimeout(() => location.reload(), 500);
        return true;
    }
    showToast('用户不存在');
    return false;
}

// 切换到用户
export function switchToUser(userId) {
    return quickLogin(userId);
}

// 显示用户菜单模态框
export function showUserSwitchModal() {
    // 先更新用户菜单UI
    updateUserMenuUI();
    document.getElementById('user-switch-modal')?.classList.add('show');
}

// 关闭用户菜单模态框
export function closeUserSwitchModal() {
    document.getElementById('user-switch-modal')?.classList.remove('show');
}

// 显示用户列表/切换模态框
export function showUserListModal() {
    closeUserSwitchModal();
    
    const data = loadData();
    const container = document.getElementById('user-list-content');
    const modal = document.getElementById('user-list-modal');
    
    if (!container || !modal) {
        showToast('页面加载异常');
        return;
    }
    
    const colors = ['#667eea', '#FF9A63', '#43E97B'];
    let html = '';
    
    data.users.forEach((u, i) => {
        const isCurrent = u.id === data.currentUser;
        html += `
            <div onclick="window.UserModule.switchToUser('${u.id}')" style="display:flex;align-items:center;gap:12px;padding:12px;background:${isCurrent ? '#e8f4ff' : 'white'};border-radius:12px;margin-bottom:8px;cursor:pointer;">
                <div style="background:${colors[i % 3]};color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">
                    ${u.avatar || u.name.charAt(0)}
                </div>
                <div>
                    <div style="font-weight:600;">${u.name} ${isCurrent ? '(当前)' : ''}</div>
                    <div style="font-size:12px;color:#999;">${u.grade} · Lv.${u.difficulty}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    modal.classList.add('show');
}

// 关闭用户列表模态框
export function closeUserListModal() {
    document.getElementById('user-list-modal')?.classList.remove('show');
}

// 显示难度调整模态框
export function showDifficultyModal() {
    closeUserSwitchModal();
    document.getElementById('difficulty-modal')?.classList.add('show');
}

// 关闭难度调整模态框
export function closeDifficultyModal() {
    document.getElementById('difficulty-modal')?.classList.remove('show');
}

// 设置难度
export function setDifficulty(level) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.difficulty = level;
        saveData(data);
        showToast(`难度已调整为 Lv.${level}`);
        closeDifficultyModal();
        setTimeout(() => location.reload(), 500);
    }
}

// 显示头像选择模态框
export function showAvatarModal() {
    closeUserSwitchModal();
    
    const container = document.getElementById('avatar-options');
    const modal = document.getElementById('avatar-modal');
    
    if (!container || !modal) {
        showToast('页面加载异常');
        return;
    }
    
    const avatars = ['👤', '😊', '😎', '🤓', '🥳', '😄', '😍', '🤩', '😇', '🧐', '🤔', '😋', '🙂', '😌', '😀'];
    container.innerHTML = avatars.map(avatar => `
        <div onclick="window.UserModule.setAvatar('${avatar}')" style="padding:16px;text-align:center;font-size:32px;cursor:pointer;border-radius:12px;transition:background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
            ${avatar}
        </div>
    `).join('');
    
    modal.classList.add('show');
}

// 关闭头像选择模态框
export function closeAvatarModal() {
    document.getElementById('avatar-modal')?.classList.remove('show');
}

// 设置头像
export function setAvatar(avatar) {
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        user.avatar = avatar;
        saveData(data);
        showToast('头像已更新');
        closeAvatarModal();
        setTimeout(() => location.reload(), 500);
    }
}

// 清除当前用户数据
export function clearCurrentUserData() {
    if (confirm('确定要清除当前用户的所有数据吗？此操作不可恢复！')) {
        const data = loadData();
        const user = data.users.find(u => u.id === data.currentUser);
        if (user) {
            user.goals = [];
            user.wrongQuestions = [];
            user.pomodoroHistory = [];
            user.learningRecords = [];
            saveData(data);
            showToast('数据已清除');
            closeUserSwitchModal();
            setTimeout(() => location.reload(), 500);
        }
    }
}

// 显示设置模态框
export function showSettingsModal() {
    closeUserSwitchModal();
    document.getElementById('settings-modal')?.classList.add('show');
}

// 关闭设置模态框
export function closeSettingsModal() {
    document.getElementById('settings-modal')?.classList.remove('show');
}

// 更新用户菜单UI
function updateUserMenuUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    const avatarEl = document.getElementById('menu-user-avatar');
    const nameEl = document.getElementById('menu-user-name');
    const infoEl = document.getElementById('menu-user-info');
    const difficultyEl = document.getElementById('menu-difficulty');
    
    if (avatarEl) avatarEl.textContent = user.avatar || user.name.charAt(0);
    if (nameEl) nameEl.textContent = user.name;
    if (infoEl) infoEl.textContent = `${user.grade || '未设置'} · Lv.${user.difficulty || 1}`;
    if (difficultyEl) difficultyEl.textContent = `Lv.${user.difficulty || 1}`;
}

// 显示创建用户模态框
export function showCreateUserModal() {
    document.getElementById('create-user-modal')?.classList.add('show');
}

// 关闭创建用户模态框
export function closeCreateUserModal() {
    document.getElementById('create-user-modal')?.classList.remove('show');
}

// 创建新用户
export function createNewUser() {
    const nameInput = document.getElementById('new-user-name');
    const gradeInput = document.getElementById('new-user-grade');
    const difficultyInput = document.getElementById('new-user-difficulty');
    
    const name = nameInput?.value?.trim();
    if (!name) {
        showToast('请输入用户名');
        return;
    }
    
    const newUser = createUser({
        name,
        grade: gradeInput?.value || '未设置',
        difficulty: parseInt(difficultyInput?.value || '1')
    });
    
    closeCreateUserModal();
    showToast(`用户 ${newUser.name} 创建成功`);
    setTimeout(() => location.reload(), 500);
}

// 显示删除用户模态框
export function showDeleteUserModal() {
    document.getElementById('delete-user-modal')?.classList.add('show');
}

// 关闭删除用户模态框
export function closeDeleteUserModal() {
    document.getElementById('delete-user-modal')?.classList.remove('show');
}

// 确认删除用户
export function confirmDeleteUser(userId) {
    if (confirm('确定要删除这个用户吗？所有数据将被清除！')) {
        const success = deleteUser(userId);
        if (success) {
            showToast('用户已删除');
            closeDeleteUserModal();
            setTimeout(() => location.reload(), 500);
        }
    }
}

// 更新用户信息
export function updateUser(userId, updates) {
    const data = loadData();
    const index = data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        saveData(data);
        return true;
    }
    return false;
}

// 重新导出 storage 中的函数
export { getCurrentUser } from './storage.js';

// 兼容其他模块的导入名称
export function getCurrentUserData() {
    return getCurrentUser();
}

export function updateCurrentUser(updates) {
    const user = getCurrentUser();
    if (user) {
        return updateUser(user.id, updates);
    }
    return false;
}

// 导出所有函数到全局对象
export const UserModule = {
    getAllUsers,
    getCurrentUser,
    quickLogin,
    switchToUser,
    showUserSwitchModal,
    closeUserSwitchModal,
    showUserListModal,
    closeUserListModal,
    showCreateUserModal,
    closeCreateUserModal,
    createNewUser,
    showDeleteUserModal,
    closeDeleteUserModal,
    confirmDeleteUser,
    showDifficultyModal,
    closeDifficultyModal,
    setDifficulty,
    showAvatarModal,
    closeAvatarModal,
    setAvatar,
    clearCurrentUserData,
    showSettingsModal,
    closeSettingsModal,
    updateUser,
    createUser,
    deleteUser
};

// 挂载到全局
if (typeof window !== 'undefined') {
    window.UserModule = UserModule;
}

console.log('✅ user 模块加载完成');

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

// 显示用户选择模态框
export function showUserSwitchModal() {
    const data = loadData();
    const container = document.getElementById('user-switch-list');
    const modal = document.getElementById('user-switch-modal');
    
    if (!container || !modal) {
        showToast('页面加载异常');
        return;
    }
    
    const colors = ['#667eea', '#FF9A63', '#43E97B'];
    let html = '';
    
    data.users.forEach((u, i) => {
        const isCurrent = u.id === data.currentUser;
        html += `
            <div style="display:flex;align-items:center;gap:8px;padding:12px;background:${isCurrent ? '#e8f4ff' : 'white'};border-radius:12px;margin-bottom:8px;">
                <div onclick="window.UserModule.switchToUser('${u.id}')" style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer;">
                    <div style="background:${colors[i % 3]};color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">
                        ${u.name.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight:600;">${u.name} ${isCurrent ? '(当前)' : ''}</div>
                        <div style="font-size:12px;color:#999;">${u.grade} · Lv.${u.difficulty}</div>
                    </div>
                </div>
                ${!isCurrent ? `
                    <button onclick="event.stopPropagation();window.UserModule.deleteUser('${u.id}')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">
                        删除
                    </button>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
    modal.classList.add('show');
}

// 关闭用户切换模态框
export function closeUserSwitchModal() {
    document.getElementById('user-switch-modal')?.classList.remove('show');
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

// 导出所有函数到全局对象
export const UserModule = {
    getAllUsers,
    getCurrentUser,
    quickLogin,
    switchToUser,
    showUserSwitchModal,
    closeUserSwitchModal,
    showCreateUserModal,
    closeCreateUserModal,
    createNewUser,
    showDeleteUserModal,
    closeDeleteUserModal,
    confirmDeleteUser,
    updateUser,
    createUser,
    deleteUser
};

// 挂载到全局
if (typeof window !== 'undefined') {
    window.UserModule = UserModule;
}

console.log('✅ user 模块加载完成');

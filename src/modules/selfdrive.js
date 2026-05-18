/**
 * 自驱力模块 - ES6 Modules 版本
 */

import { showToast } from '../utils.js';

// ========== 数据管理 ==========
const STORAGE_KEY = 'self_drive_data';

function getDriveData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function saveDriveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 获取目标列表
export function getGoals() {
    const data = getDriveData();
    return data.goals || [];
}

// 保存目标列表
export function saveGoals(goals) {
    const data = getDriveData();
    data.goals = goals;
    saveDriveData(data);
}

// 添加目标
export function addGoal(title) {
    const goals = getGoals();
    goals.push({
        id: 'goal_' + Date.now(),
        title,
        completed: false,
        createdAt: new Date().toISOString()
    });
    saveGoals(goals);
    showToast('目标添加成功！🎯');
    return goals;
}

// 切换目标完成状态
export function toggleGoal(goalId) {
    const goals = getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = !goal.completed;
        saveGoals(goals);
        showToast(goal.completed ? '目标完成！✅' : '目标已重置 🎯');
    }
    return goals;
}

// 删除目标
export function deleteGoal(goalId) {
    const goals = getGoals().filter(g => g.id !== goalId);
    saveGoals(goals);
    showToast('目标已删除 🗑️');
    return goals;
}

// ========== 页面渲染 ==========

// 渲染自驱力首页
export function renderSelfDrive(container) {
    const goals = getGoals();
    const completedCount = goals.filter(g => g.completed).length;
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px;">🎯 自驱力训练</h2>
                <button id="sd-back-btn" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ← 返回
                </button>
            </div>
            
            <div style="background: linear-gradient(135deg,#667eea15,#764ba215); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">今日目标进度</div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${goals.length > 0 ? (completedCount / goals.length * 100) : 0}%; height: 100%; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 4px; transition: width 0.3s;"></div>
                    </div>
                    <span style="font-weight: 600; color: #667eea;">${completedCount}/${goals.length}</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                <input 
                    type="text" 
                    id="new-goal-input" 
                    placeholder="输入新目标..." 
                    style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
                >
                <button id="add-goal-btn" style="padding: 12px 20px; background: linear-gradient(135deg,#667eea,#764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    + 添加
                </button>
            </div>
            
            <div id="goals-list" style="display: flex; flex-direction: column; gap: 10px;">
                ${goals.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <div style="font-size: 48px; margin-bottom: 12px;">🎯</div>
                        <div>还没有设定目标</div>
                        <div style="font-size: 12px; margin-top: 8px;">设定一个小目标，开始行动吧！</div>
                    </div>
                ` : goals.map(goal => `
                    <div class="goal-item" data-id="${goal.id}" style="background: white; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <div class="goal-checkbox" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${goal.completed ? '#43E97B' : '#ddd'}; background: ${goal.completed ? '#43E97B' : 'white'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">
                            ${goal.completed ? '✓' : ''}
                        </div>
                        <div style="flex: 1; text-decoration: ${goal.completed ? 'line-through' : 'none'}; color: ${goal.completed ? '#999' : '#333'};">
                            ${goal.title}
                        </div>
                        <button class="delete-goal-btn" data-id="${goal.id}" style="padding: 6px 12px; background: #ff6b6b; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
                            删除
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定事件
    bindSelfDriveEvents(container);
}

// 绑定自驱力页面事件
function bindSelfDriveEvents(container) {
    // 返回按钮
    container.querySelector('#sd-back-btn')?.addEventListener('click', () => {
        // 这里会由主应用处理导航
        window.App.ui.goHome();
    });
    
    // 添加目标按钮
    container.querySelector('#add-goal-btn')?.addEventListener('click', () => {
        const input = container.querySelector('#new-goal-input');
        if (input && input.value.trim()) {
            addGoal(input.value.trim());
            renderSelfDrive(container); // 重新渲染
        } else {
            showToast('请输入目标内容');
        }
    });
    
    // 回车添加目标
    container.querySelector('#new-goal-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            container.querySelector('#add-goal-btn')?.click();
        }
    });
    
    // 切换目标状态
    container.querySelectorAll('.goal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const goalItem = e.target.closest('.goal-item');
            if (goalItem) {
                toggleGoal(goalItem.dataset.id);
                renderSelfDrive(container); // 重新渲染
            }
        });
    });
    
    // 删除目标
    container.querySelectorAll('.delete-goal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteGoal(btn.dataset.id);
            renderSelfDrive(container); // 重新渲染
        });
    });
}

// ========== 模块初始化 ==========
export function initSelfDrive() {
    console.log('✅ 自驱力模块初始化完成');
    return {
        getGoals,
        addGoal,
        toggleGoal,
        deleteGoal,
        renderSelfDrive
    };
}

console.log('✅ selfdrive 模块加载完成');

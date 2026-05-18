// 学霸方法模块 - ES6 Modules 版本
import { showToast, escapeHtml } from '../utils.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

// 学习方法数据
const LEARNING_METHODS = [
    {
        id: 'feynman',
        name: '费曼学习法',
        icon: '🎓',
        color: '#667eea',
        description: '通过教授他人来验证自己是否真正理解知识',
        steps: [
            '选择一个概念或主题',
            '尝试向一个新手解释这个概念',
            '遇到解释困难的地方，回到材料重新学习',
            '简化解释，用更简单的语言表达'
        ],
        tips: [
            '用自己的话写下来',
            '避免使用专业术语',
            '想象在教一个10岁孩子',
            '用比喻和类比帮助理解'
        ]
    },
    {
        id: 'pomodoro',
        name: '番茄工作法',
        icon: '🍅',
        color: '#FF9A63',
        description: '25分钟专注 + 5分钟休息，高效时间管理',
        steps: [
            '选择一个任务',
            '设置25分钟倒计时',
            '专注工作直到时间结束',
            '休息5分钟',
            '每4个番茄后长休息15-30分钟'
        ],
        tips: [
            '远离手机干扰',
            '一个番茄时间不可分割',
            '保护你的番茄，拒绝打断',
            '记录每天完成的番茄数'
        ]
    },
    {
        id: 'spaced',
        name: '间隔重复法',
        icon: '📅',
        color: '#43E97B',
        description: '根据遗忘曲线，在恰当时间点复习，强化记忆',
        steps: [
            '第1天：学习新知识',
            '第2天：第一次复习',
            '第7天：第二次复习',
            '第14天：第三次复习',
            '第30天：第四次复习'
        ],
        tips: [
            '使用Anki等工具',
            '制作闪卡辅助记忆',
            '越难的内容复习间隔越短',
            '主动回忆比被动阅读更有效'
        ]
    },
    {
        id: 'mindmap',
        name: '思维导图',
        icon: '🧠',
        color: '#f39c12',
        description: '可视化思维，构建知识网络',
        steps: [
            '在中心写下核心主题',
            '向四周发散主要分支',
            '每个分支继续细化子主题',
            '使用关键词和图像',
            '用颜色区分不同类别'
        ],
        tips: [
            '关键词而不是句子',
            '多用图像和符号',
            '颜色编码帮助记忆',
            '从中心向外扩展'
        ]
    },
    {
        id: 'sq3r',
        name: 'SQ3R阅读法',
        icon: '📚',
        color: '#9b59b6',
        description: '浏览-提问-阅读-复述-复习，高效阅读',
        steps: [
            'Survey（浏览）：快速浏览全书结构',
            'Question（提问）：提出自己想了解的问题',
            'Read（阅读）：带着问题仔细阅读',
            'Recite（复述）：用自己的话复述内容',
            'Review（复习）：回顾和复习'
        ],
        tips: [
            '先看目录和标题',
            '每个章节都要提问',
            '做笔记但不要抄书',
            '定期回顾总结'
        ]
    },
    {
        id: 'active',
        name: '主动回忆法',
        icon: '💡',
        color: '#e74c3c',
        description: '合上书本，主动回忆比反复阅读更有效',
        steps: [
            '阅读学习材料',
            '合上书，尝试回忆所有内容',
            '写下你能记住的一切',
            '打开书本对照检查',
            '重点关注遗漏和错误的部分'
        ],
        tips: [
            '回忆比重读更有效',
            '可以用自测题检验',
            '给别人讲解是最好的回忆',
            '定期进行"空白纸回忆'
        ]
    }
];

/**
 * 获取所有学习方法
 */
export function getLearningMethods() {
    return LEARNING_METHODS;
}

/**
 * 获取用户的学习进度
 */
export function getUserMethodProgress() {
    const user = getCurrentUserData();
    return user?.methodProgress || {};
}

/**
 * 更新学习方法进度
 */
export function updateMethodProgress(methodId, progress) {
    const user = getCurrentUserData();
    if (!user) return false;

    if (!user.methodProgress) {
        user.methodProgress = {};
    }
    user.methodProgress[methodId] = {
        ...user.methodProgress[methodId],
        ...progress,
        lastUpdated: new Date().toISOString()
    };
    updateCurrentUser(user);
    return true;
}

/**
 * 标记步骤完成
 */
export function markStepCompleted(methodId, stepIndex) {
    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };
    
    if (!methodProgress.completedSteps.includes(stepIndex)) {
        methodProgress.completedSteps.push(stepIndex);
        updateMethodProgress(methodId, methodProgress);
        showToast('步骤已完成 ✅');
    }
    return true;
}

/**
 * 渲染学霸方法主页
 */
export function renderMethodPage(container) {
    const methods = getLearningMethods();
    const progress = getUserMethodProgress();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>📚 学霸方法</h2>
                <div style="width: 60px;"></div>
            </div>
            
            <div class="method-container">
                <div class="method-intro">
                    <p>选择一个学习方法，提升你的学习效率！</p>
                </div>
                
                <div class="methods-grid">
                    ${methods.map(method => {
                        const methodProgress = progress[method.id] || { completedSteps: [] };
                        const completedCount = methodProgress.completedSteps.length;
                        const totalSteps = method.steps.length;
                        const progressPercent = Math.round((completedCount / totalSteps) * 100);
                        
                        return `
                            <div class="method-card" onclick="window.App.method.openMethodDetail('${method.id}')">
                                <div class="method-icon" style="background: ${method.color}20;">
                                    ${method.icon}
                                </div>
                                <div class="method-info">
                                    <h3 class="method-name">${method.name}</h3>
                                    <p class="method-desc">${method.description}</p>
                                    <div class="method-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${progressPercent}%; background: ${method.color};"></div>
                                        </div>
                                        <span class="progress-text">${completedCount}/${totalSteps} 步骤</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 打开学习方法详情
 */
export function openMethodDetail(methodId) {
    const method = LEARNING_METHODS.find(m => m.id === methodId);
    if (!method) return;

    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="method-detail">
            <div class="detail-header" style="background: linear-gradient(135deg, ${method.color}, ${method.color}dd);">
                <div class="detail-icon">${method.icon}</div>
                <h2>${method.name}</h2>
                <p>${method.description}</p>
            </div>
            
            <div class="detail-section">
                <h3>📋 实施步骤</h3>
                <div class="steps-list">
                    ${method.steps.map((step, index) => `
                        <div class="step-item ${methodProgress.completedSteps.includes(index) ? 'completed' : ''}" onclick="window.App.method.toggleStep('${methodId}', ${index})">
                            <div class="step-checkbox">
                                ${methodProgress.completedSteps.includes(index) ? '✓' : ''}
                            </div>
                            <div class="step-content">
                                <span class="step-number">步骤 ${index + 1}</span>
                                <p class="step-text">${step}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h3>💡 实用技巧</h3>
                <ul class="tips-list">
                    ${method.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <button class="start-practice-btn" onclick="window.App.method.startPractice('${methodId}')">
                🚀 开始实践
            </button>
            
            <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')" style="margin-top: 12px;">
                关闭
            </button>
        </div>
    `;

    modal.classList.add('show');
}

/**
 * 切换步骤完成状态
 */
export function toggleStep(methodId, stepIndex) {
    const progress = getUserMethodProgress();
    const methodProgress = progress[methodId] || { completedSteps: [] };
    
    if (methodProgress.completedSteps.includes(stepIndex)) {
        methodProgress.completedSteps = methodProgress.completedSteps.filter(i => i !== stepIndex);
    } else {
        methodProgress.completedSteps.push(stepIndex);
    }
    
    updateMethodProgress(methodId, methodProgress);
    
    // 刷新详情页
    openMethodDetail(methodId);
}

/**
 * 开始实践
 */
export function startPractice(methodId) {
    showToast('功能开发中，敬请期待 🚀');
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.method = {
    openMethodDetail,
    toggleStep,
    startPractice
};

console.log('✅ method 模块加载完成');

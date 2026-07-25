/* UI 渲染模块
 * 管理页面渲染、导航、模块展示
 */

import { store } from './store.js';
import { eventBus } from './event-bus.js';
import { showToast } from './utils.js';
import { getCurrentUser, getUserList, setCurrentUser, addUser, updateUser } from './user.js';
import { renderPomodoro } from './modules/pomodoro.js';

// 模块配置
const MODULES = [
    { id: 'mock-exam', name: '模拟考试', icon: '📝', color: '#e91e63', desc: '仿真试卷、拍照上传、手写答题' },
    { id: 'training', name: '认知训练', icon: '🧠', color: '#667eea', desc: 'Week1-Week9 系统认知训练' },
    { id: 'training-game', name: '训练游戏', icon: '🎮', color: '#ff6b6b', desc: '趣味问答 + 同学互动' },
    { id: 'library', name: '学习图书馆', icon: '📚', color: '#a855f7', desc: '书籍、文章、视频、音频' },
    { id: 'mindmap', name: '思维导图', icon: '🗺️', color: '#f97316', desc: '思维可视化工具' },
    { id: 'deepseek', name: 'AI 助手', icon: '🤖', color: '#4facfe', desc: 'DeepSeek 智能对话' },
    { id: 'wrongbook', name: '错题本', icon: '📚', color: '#43e97b', desc: '错题整理与复习' },
    { id: 'diary', name: '学生日记', icon: '📔', color: '#FDA7DF', desc: '每日记录与心情追踪' },
    { id: 'method', name: '学习方法', icon: '💡', color: '#fa709a', desc: '学霸方法库' },
    { id: 'thinking', name: '思维训练', icon: '🎯', color: '#a8edea', desc: '逻辑思维训练' },
    { id: 'selfdrive', name: '自驱力', icon: '💪', color: '#fed6e3', desc: '自我驱动能力培养' },
    { id: 'my', name: '我的', icon: '👤', color: '#ec4899', desc: '个人中心、周回顾、成就' },
    { id: 'settings', name: '设置', icon: '⚙️', color: '#ebedee', desc: '系统配置与管理' }
];

let currentModule = null;
let moduleRenderers = {};

// 初始化 UI 模块
export function initUI() {
    console.log('[UI] 模块初始化完成');
    eventBus.emit('module:ready', 'ui');
}

// 渲染首页模块网格
export function renderModules() {
    const grid = document.getElementById('modulesGrid');
    if (!grid) return;
    
    grid.innerHTML = MODULES.map(module => `
        <div class="module-card" data-module="${module.id}">
            <div class="module-icon" style="background: ${module.color}20; color: ${module.color}">
                ${module.icon}
            </div>
            <h3>${module.name}</h3>
            <p>${module.desc}</p>
        </div>
    `).join('');
    
    // 绑定点击事件
    grid.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            openModule(moduleId);
        });
    });
}

// 注册模块渲染器
export function registerModuleRenderer(moduleId, renderer) {
    moduleRenderers[moduleId] = renderer;
    console.log(`[UI] 已注册模块渲染器: ${moduleId}`);
}

// 打开功能模块
export function openModule(moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) {
        showToast('模块不存在');
        return;
    }
    
    // 如果有自定义渲染器，使用它
    if (moduleRenderers[moduleId]) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="header" style="padding: 20px; cursor: pointer;" onclick="window.ui.goHome()">
                <h1>← ${module.icon} ${module.name}</h1>
            </div>
            <div id="moduleContent" style="background: white; border-radius: 16px; padding: 24px; min-height: 500px;"></div>
        `;
        
        moduleRenderers[moduleId](document.getElementById('moduleContent'));
        currentModule = moduleId;
        eventBus.emit('module:open', moduleId);
    } else {
        showToast(`${module.name} 模块开发中...`);
    }
}

// 返回首页
export function goHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1>🧠 认知训练门户</h1>
            <p>ES6 Modules 模块化架构版本</p>
        </div>
        <div class="modules-grid" id="modulesGrid"></div>
    `;
    
    renderModules();
    currentModule = null;
    eventBus.emit('module:home');
}

// 渲染用户菜单（右上角）
export function renderUserMenu(container) {
    const currentUser = getCurrentUser();
    const userList = getUserList();
    
    container.innerHTML = `
        <div class="user-menu">
            <button 
                type="button"
                class="user-menu-trigger"
                id="userMenuTrigger"
                aria-expanded="false"
            >
                <span class="user-avatar">${currentUser?.avatar || '👤'}</span>
                <span class="user-name">${currentUser?.name || '访客'}</span>
                <span class="menu-arrow">▼</span>
            </button>
            
            <div class="user-menu-dropdown" id="userMenuDropdown">
                <div class="menu-section">
                    <div class="menu-current-user">
                        <span class="user-avatar-large">${currentUser?.avatar || '👤'}</span>
                        <div class="user-info">
                            <div class="user-name-large">${currentUser?.name || '访客'}</div>
                            <div class="user-id">ID: ${currentUser?.id || 'guest'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="menu-divider"></div>
                
                <div class="menu-section">
                    <div class="menu-section-title">切换用户</div>
                    ${userList.map(user => `
                        <button 
                            type="button"
                            class="menu-item ${user.id === currentUser?.id ? 'active' : ''}"
                            data-action="switchUser"
                            data-user-id="${user.id}"
                        >
                            <span class="menu-item-icon">${user.avatar || '👤'}</span>
                            <span class="menu-item-text">${user.name}</span>
                            ${user.id === currentUser?.id ? '<span class="menu-item-check">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>
                
                <div class="menu-divider"></div>
                
                <div class="menu-section">
                    <button 
                        type="button"
                        class="menu-item"
                        data-action="addUser"
                    >
                        <span class="menu-item-icon">➕</span>
                        <span class="menu-item-text">添加新用户</span>
                    </button>
                    
                    <button 
                        type="button"
                        class="menu-item"
                        data-action="editProfile"
                    >
                        <span class="menu-item-icon">⚙️</span>
                        <span class="menu-item-text">编辑资料</span>
                    </button>
                </div>
                
                <div class="menu-divider"></div>
                
                <div class="menu-section">
                    <button 
                        type="button"
                        class="menu-item menu-item-danger"
                        data-action="logout"
                    >
                        <span class="menu-item-icon">🚪</span>
                        <span class="menu-item-text">退出登录</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 绑定事件
    bindUserMenuEvents(container);
}

// 切换用户菜单显示/隐藏
export function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    const trigger = document.getElementById('userMenuTrigger');
    
    if (!dropdown || !trigger) return;
    
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    trigger.setAttribute('aria-expanded', newState);
    dropdown.style.display = newState ? 'block' : 'none';
    
    eventBus.emit('ui:userMenuToggled', { visible: newState });
}

// 绑定用户菜单事件
function bindUserMenuEvents(container) {
    // 触发器点击
    const trigger = container.querySelector('#userMenuTrigger');
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu();
        });
    }
    
    // 菜单项点击
    container.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', async (e) => {
            const action = button.dataset.action;
            
            switch (action) {
                case 'switchUser':
                    const userId = button.dataset.userId;
                    await handleSwitchUser(userId);
                    break;
                    
                case 'addUser':
                    handleAddUser();
                    break;
                    
                case 'editProfile':
                    handleEditProfile();
                    break;
                    
                case 'logout':
                    handleLogout();
                    break;
            }
            
            // 关闭菜单
            toggleUserMenu();
        });
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            const dropdown = document.getElementById('userMenuDropdown');
            const trigger = document.getElementById('userMenuTrigger');
            if (dropdown && dropdown.style.display === 'block') {
                toggleUserMenu();
            }
        }
    });
}

// 切换用户处理
async function handleSwitchUser(userId) {
    try {
        setCurrentUser(userId);
        showToast(`已切换到用户: ${getCurrentUser()?.name}`);
        
        // 刷新用户数据
        eventBus.emit('user:switched', { userId });
        
        // 重新渲染页面
        const app = document.getElementById('app');
        if (app && app.querySelector('#modulesGrid')) {
            renderModules();
        }
    } catch (error) {
        showToast(`切换用户失败: ${error.message}`);
    }
}

// 添加新用户处理
function handleAddUser() {
    // 显示添加用户弹窗
    const userName = prompt('请输入新用户名称:');
    if (!userName?.trim()) return;
    
    const avatars = ['👶', '👧', '👦', '🧑', '👩', '👨', '🧔', '👴', '👵', '🤖'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    try {
        const newUser = addUser({
            name: userName.trim(),
            avatar: randomAvatar
        });
        
        showToast(`用户 "${newUser.name}" 添加成功！`);
        
        // 自动切换到新用户
        handleSwitchUser(newUser.id);
        
    } catch (error) {
        showToast(`添加用户失败: ${error.message}`);
    }
}

// 编辑资料处理
function handleEditProfile() {
    const user = getCurrentUser();
    const newName = prompt('请输入新的用户名:', user.name);
    
    if (newName?.trim() && newName.trim() !== user.name) {
        updateUser(user.id, { name: newName.trim() });
        showToast('资料已更新！');
        
        // 重新渲染菜单
        const menuContainer = document.querySelector('.user-menu')?.parentElement;
        if (menuContainer) {
            renderUserMenu(menuContainer);
        }
    }
}

// 退出登录处理
function handleLogout() {
    if (!confirm('确定要退出登录吗？')) return;
    
    // 清除当前用户状态
    store.setState('user', null);
    storage.remove('current_user_id');
    
    showToast('已退出登录');
    eventBus.emit('user:loggedOut');
    
    // 刷新页面或重定向到首页
    location.reload();
}

// ========== 训练游戏UI渲染 ==========

// 导入游戏和设置模块（动态导入，避免循环依赖）
let gameModule = null;
let settingsModule = null;

async function getGameModule() {
    if (!gameModule) {
        gameModule = await import('./modules/training-game.js');
    }
    return gameModule;
}

async function getSettingsModule() {
    if (!settingsModule) {
        settingsModule = await import('./modules/settings.js');
    }
    return settingsModule;
}

// 渲染训练游戏首页
export async function renderTrainingGame(container) {
    const game = await getGameModule();
    
    // 初始化游戏模块
    game.initTrainingGame();
    
    const categories = game.getCategories();
    const progress = game.getGameProgress();
    const ranking = game.getRanking();
    
    container.innerHTML = `
        <div class="game-container">
            <!-- 游戏头部 -->
            <div class="game-header">
                <div class="game-stats">
                    <div class="stat-item">
                        <span class="stat-label">总分数</span>
                        <span class="stat-value">${progress.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成进度</span>
                        <span class="stat-value">${progress.progress}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">已答题</span>
                        <span class="stat-value">${progress.answered}/${progress.total}</span>
                    </div>
                </div>
            </div>

            <!-- 分类选择 -->
            <div class="game-section">
                <h3>📋 选择训练分类</h3>
                <div class="category-grid">
                    ${categories.map(cat => `
                        <div class="category-card" data-category="${cat.id}">
                            <div class="category-icon">${cat.icon}</div>
                            <div class="category-name">${cat.name}</div>
                            <div class="category-count">${cat.count} 道题</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 排行榜 -->
            <div class="game-section">
                <h3>🏆 同学排行榜</h3>
                <div class="ranking-list">
                    ${ranking.map((c, index) => `
                        <div class="ranking-item ${index < 3 ? 'top' + (index + 1) : ''}">
                            <span class="ranking-number">${index + 1}</span>
                            <span class="ranking-avatar">${c.avatar}</span>
                            <span class="ranking-name">${c.name}</span>
                            <span class="ranking-score">${c.score} 分</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="game-actions">
                <button class="btn btn-secondary" id="resetGameBtn">🔄 重置游戏</button>
            </div>
        </div>
    `;

    // 绑定事件
    bindGameEvents(container, game);
}

// 渲染题目
export async function renderQuestion(container, question) {
    const game = await getGameModule();
    
    container.innerHTML = `
        <div class="question-container">
            <!-- 题目头部 -->
            <div class="question-header">
                <span class="question-category">${getCategoryName(question.category)}</span>
                <span class="question-difficulty">难度: ${'⭐'.repeat(question.difficulty)}</span>
            </div>

            <!-- 题目内容 -->
            <div class="question-content">
                <h3>${question.question}</h3>
            </div>

            <!-- 选项 -->
            <div class="options-list" id="optionsList">
                ${question.options.map((option, index) => `
                    <div class="option-item" data-answer="${String.fromCharCode(65 + index)}">
                        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="option-text">${option.substring(3)}</span>
                    </div>
                `).join('')}
            </div>

            <!-- 同学讨论区 -->
            <div class="classmates-section">
                <h4>👥 同学讨论</h4>
                <div class="classmates-comments">
                    ${question.classmates.map(comment => `
                        <div class="classmate-comment">
                            <span class="comment-bubble">💬</span>
                            <span class="comment-text">${comment}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-small" id="moreDiscussionBtn">发起更多讨论</button>
            </div>

            <!-- 返回按钮 -->
            <div class="question-actions">
                <button class="btn btn-secondary" id="backToGameBtn">← 返回游戏首页</button>
                <button class="btn btn-primary" id="nextQuestionBtn" style="display: none;">下一题 →</button>
            </div>
        </div>
    `;

    bindQuestionEvents(container, game, question);
}

// 渲染答题结果
export function renderAnswerResult(container, result) {
    const { question, userAnswer, isCorrect, scoreGain, newScore, classmatesComments } = result;

    const optionsList = document.getElementById('optionsList');
    if (optionsList) {
        // 标记正确和错误选项
        optionsList.querySelectorAll('.option-item').forEach(item => {
            const answer = item.dataset.answer;
            if (answer === question.answer) {
                item.classList.add('correct');
            } else if (answer === userAnswer && !isCorrect) {
                item.classList.add('wrong');
            }
            item.style.pointerEvents = 'none';
        });
    }

    // 显示结果卡片
    const resultHTML = `
        <div class="result-card ${isCorrect ? 'correct' : 'wrong'}">
            <div class="result-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="result-text">
                <h4>${isCorrect ? '回答正确！' : '回答错误'}</h4>
                ${isCorrect ? `<p>获得 ${scoreGain} 分，当前总分: ${newScore}</p>` : `<p>正确答案是: ${question.answer}</p>`}
            </div>
        </div>
        <div class="explanation-card">
            <h5>💡 答案解析</h5>
            <p>${question.explanation}</p>
        </div>
    `;

    // 插入到题目后面
    const questionContainer = container.querySelector('.question-container');
    const actionsDiv = container.querySelector('.question-actions');
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultHTML;
    
    questionContainer.insertBefore(tempDiv.firstElementChild, actionsDiv);
    questionContainer.insertBefore(tempDiv.firstElementChild, actionsDiv);

    // 显示下一题按钮
    document.getElementById('nextQuestionBtn').style.display = 'inline-block';
}

// 绑定游戏事件
function bindGameEvents(container, game) {
    // 分类点击
    container.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', async () => {
            const category = card.dataset.category;
            const question = game.selectCategory(category);
            await renderQuestion(container, question);
        });
    });

    // 重置游戏
    document.getElementById('resetGameBtn').addEventListener('click', () => {
        if (confirm('确定要重置游戏吗？所有进度和分数都会清空！')) {
            game.resetGame();
            renderTrainingGame(container);
        }
    });
}

// 绑定题目事件
function bindQuestionEvents(container, game, question) {
    // 选项点击
    container.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.dataset.answer;
            const result = game.handleAnswer({
                questionId: question.id,
                answer: answer
            });
            renderAnswerResult(container, result);
        });
    });

    // 返回游戏首页
    document.getElementById('backToGameBtn').addEventListener('click', () => {
        renderTrainingGame(container);
    });

    // 下一题
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        const nextQ = game.getNextQuestion();
        if (nextQ) {
            renderQuestion(container, nextQ);
        }
    });

    // 发起更多讨论
    document.getElementById('moreDiscussionBtn').addEventListener('click', () => {
        const discussion = game.startClassDiscussion(question.id);
        if (discussion) {
            const commentsSection = container.querySelector('.classmates-comments');
            discussion.forEach(({ classmate, message }) => {
                const commentEl = document.createElement('div');
                commentEl.className = 'classmate-comment';
                commentEl.innerHTML = `
                    <span class="comment-avatar">${classmate.avatar}</span>
                    <span class="comment-author">${classmate.name}:</span>
                    <span class="comment-text">${message}</span>
                `;
                commentsSection.appendChild(commentEl);
            });
            showToast('同学们加入了讨论！');
        }
    });
}

// 获取分类名称
function getCategoryName(categoryId) {
    const names = {
        attention: '注意力训练',
        memory: '记忆力训练',
        strategy: '学习策略',
        mindset: '思维模式'
    };
    return names[categoryId] || categoryId;
}

// 获取所有模块配置
export function getAllModules() {
    return [...MODULES];
}

// 获取当前打开的模块
export function getCurrentModule() {
    return currentModule;
}

// 统一导出对象
export const ui = {
    init: initUI,
    renderModules,
    registerModuleRenderer,
    openModule,
    goHome,
    renderUserMenu,
    getAllModules,
    getCurrentModule
};

// 暴露到全局，供 HTML 内联调用
window.ui = ui;

export default ui;


// ========== 设置模块UI渲染 ==========

// 渲染设置主页面
export async function renderSettings(container) {
    const settings = await getSettingsModule();
    
    // 初始化设置模块
    settings.init();
    
    const currentSettings = settings.getSettings();
    const themes = settings.getThemes();
    const fontSizes = settings.getFontSizes();
    const appInfo = settings.getAppInfo();

    container.innerHTML = `
        <div class="settings-container">
            <!-- 设置页面标题 -->
            <div class="settings-header">
                <h2>⚙️ 系统设置</h2>
                <p>管理应用的所有配置项</p>
            </div>

            <!-- 界面设置 -->
            <div class="settings-section">
                <h3 class="section-title">🎨 界面设置</h3>
                
                <!-- 主题选择 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">主题配色</span>
                        <span class="setting-desc">选择您喜欢的界面主题</span>
                    </div>
                    <div class="setting-control">
                        <select class="setting-select" id="themeSelect">
                            ${themes.map(t => `
                                <option value="${t.id}" ${currentSettings.theme === t.id ? 'selected' : ''}>
                                    ${t.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- 字体大小 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">字体大小</span>
                        <span class="setting-desc">调整界面文字大小</span>
                    </div>
                    <div class="setting-control">
                        <select class="setting-select" id="fontSizeSelect">
                            ${fontSizes.map(f => `
                                <option value="${f.id}" ${currentSettings.fontSize === f.id ? 'selected' : ''}>
                                    ${f.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- 动画效果 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">动画效果</span>
                        <span class="setting-desc">启用或禁用界面动画</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="animationToggle" ${currentSettings.animationEnabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- 训练设置 -->
            <div class="settings-section">
                <h3 class="section-title">🎯 训练设置</h3>
                
                <!-- 自动下一题 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">自动下一题</span>
                        <span class="setting-desc">答题正确后自动进入下一题</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="autoNextToggle" ${currentSettings.autoNextQuestion ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- 显示提示 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">显示提示</span>
                        <span class="setting-desc">题目中显示提示信息</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="showHintToggle" ${currentSettings.showHint ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- 番茄钟时长 -->
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">番茄钟时长</span>
                        <span class="setting-desc">专注时间（分钟）</span>
                    </div>
                    <div class="setting-control">
                        <select class="setting-select" id="pomodoroSelect">
                            ${[15, 20, 25, 30, 45, 60].map(m => `
                                <option value="${m}" ${currentSettings.pomodoroDuration === m ? 'selected' : ''}>
                                    ${m} 分钟
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <!-- 数据管理 -->
            <div class="settings-section">
                <h3 class="section-title">💾 数据管理</h3>
                
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">导出数据</span>
                        <span class="setting-desc">备份所有学习数据和设置</span>
                    </div>
                    <div class="setting-control">
                        <button class="btn btn-primary btn-small" id="exportBtn">导出</button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">导入数据</span>
                        <span class="setting-desc">从备份文件恢复数据</span>
                    </div>
                    <div class="setting-control">
                        <button class="btn btn-secondary btn-small" id="importBtn">导入</button>
                        <input type="file" id="importFileInput" accept=".json" style="display: none;">
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label">恢复默认</span>
                        <span class="setting-desc">重置所有设置为默认值</span>
                    </div>
                    <div class="setting-control">
                        <button class="btn btn-secondary btn-small" id="resetBtn">重置</button>
                    </div>
                </div>

                <div class="setting-item danger">
                    <div class="setting-info">
                        <span class="setting-label">清除数据</span>
                        <span class="setting-desc">清除所有学习数据（不可恢复）</span>
                    </div>
                    <div class="setting-control">
                        <button class="btn btn-small" style="background: #f44336; color: white;" id="clearBtn">清除</button>
                    </div>
                </div>
            </div>

            <!-- 关于信息 -->
            <div class="settings-section">
                <h3 class="section-title">ℹ️ 关于</h3>
                
                <div class="about-info">
                    <div class="about-item">
                        <span class="about-label">应用名称</span>
                        <span class="about-value">${appInfo.name}</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">版本号</span>
                        <span class="about-value">${appInfo.version}</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">构建日期</span>
                        <span class="about-value">${appInfo.buildDate}</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">架构</span>
                        <span class="about-value">${appInfo.architecture}</span>
                    </div>
                </div>

                <div class="features-list">
                    <h4>功能特性：</h4>
                    <ul>
                        ${appInfo.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- 开发者模式（隐藏） -->
            <div class="settings-section" style="opacity: 0.3;">
                <div class="setting-item">
                    <div class="setting-info">
                        <span class="setting-label" id="devModeLabel">开发者模式</span>
                        <span class="setting-desc">点击 5 次启用调试工具</span>
                    </div>
                    <div class="setting-control">
                        <span class="dev-mode-indicator" id="devModeIndicator">🔒</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 绑定所有设置事件
    bindSettingsEvents(container, settings);
}

// 绑定设置页面事件
function bindSettingsEvents(container, settings) {
    // 主题切换
    container.querySelector('#themeSelect').addEventListener('change', (e) => {
        settings.updateSetting('theme', e.target.value);
        showToast('主题已更新');
    });

    // 字体大小切换
    container.querySelector('#fontSizeSelect').addEventListener('change', (e) => {
        settings.updateSetting('fontSize', e.target.value);
        showToast('字体大小已更新');
    });

    // 动画开关
    container.querySelector('#animationToggle').addEventListener('change', (e) => {
        settings.updateSetting('animationEnabled', e.target.checked);
        showToast(e.target.checked ? '动画已启用' : '动画已禁用');
    });

    // 自动下一题开关
    container.querySelector('#autoNextToggle').addEventListener('change', (e) => {
        settings.updateSetting('autoNextQuestion', e.target.checked);
        showToast(e.target.checked ? '自动下一题已启用' : '自动下一题已禁用');
    });

    // 显示提示开关
    container.querySelector('#showHintToggle').addEventListener('change', (e) => {
        settings.updateSetting('showHint', e.target.checked);
        showToast(e.target.checked ? '提示已启用' : '提示已禁用');
    });

    // 番茄钟时长
    container.querySelector('#pomodoroSelect').addEventListener('change', (e) => {
        settings.updateSetting('pomodoroDuration', parseInt(e.target.value));
        showToast('番茄钟时长已更新');
    });

    // 导出数据
    container.querySelector('#exportBtn').addEventListener('click', () => {
        settings.exportAllData();
    });

    // 导入数据
    container.querySelector('#importBtn').addEventListener('click', () => {
        container.querySelector('#importFileInput').click();
    });

    container.querySelector('#importFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                settings.importData(event.target.result);
            };
            reader.readAsText(file);
        }
    });

    // 重置为默认
    container.querySelector('#resetBtn').addEventListener('click', () => {
        if (confirm('确定要恢复所有默认设置吗？')) {
            settings.resetToDefaults();
            // 重新渲染页面以反映变化
            renderSettings(container);
        }
    });

    // 清除数据
    container.querySelector('#clearBtn').addEventListener('click', () => {
        settings.clearAllData();
    });

    // 开发者模式 - 点击5次启用
    let devClickCount = 0;
    container.querySelector('#devModeLabel').addEventListener('click', () => {
        devClickCount++;
        const indicator = container.querySelector('#devModeIndicator');
        
        if (devClickCount >= 5) {
            settings.enableDebugMode();
            indicator.textContent = '🔓';
            container.querySelector('.settings-section:last-child').style.opacity = '1';
        } else {
            indicator.textContent = `🔒 (${5 - devClickCount})`;
            setTimeout(() => {
                if (devClickCount < 5) {
                    indicator.textContent = '🔒';
                }
            }, 2000);
        }
    });
}


// ========== 自驱力模块UI渲染 ==========

// 获取自驱力模块
async function getSelfDriveModule() {
    return await import('./modules/self-drive.js');
}

// 渲染自驱力主页面
export async function renderSelfDrive(container) {
    const selfDrive = await getSelfDriveModule();
    
    // 初始化模块
    selfDrive.init();
    
    const stats = selfDrive.getStats();
    const dailyQuote = selfDrive.getDailyQuote();
    const data = selfDrive.getData();
    const achievements = selfDrive.getAllAchievements();
    const hasCheckedIn = selfDrive.hasCheckedInToday();

    container.innerHTML = `
        <div class="selfdrive-container">
            <!-- 返回按钮栏 -->
            <div class="module-nav-bar">
                <button class="back-btn" id="selfDriveBackBtn">← 返回首页</button>
                <h2>💪 自驱力中心</h2>
                <div></div>
            </div>

            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-number">${stats.totalDays}</div>
                    <div class="stat-label">总打卡天数</div>
                </div>
                <div class="stat-card highlight">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-number">${stats.currentStreak}</div>
                    <div class="stat-label">连续打卡</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-number">${stats.maxStreak}</div>
                    <div class="stat-label">最长连续</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-number">${stats.completedGoals}/${stats.activeGoals + stats.completedGoals}</div>
                    <div class="stat-label">完成目标</div>
                </div>
            </div>

            <!-- 每日打卡 -->
            <div class="section-card">
                <h3>🌟 今日打卡</h3>
                <div class="checkin-section">
                    <button class="checkin-btn ${hasCheckedIn ? 'checked' : ''}" id="dailyCheckinBtn">
                        ${hasCheckedIn ? '✅ 已打卡' : '👆 点击打卡'}
                    </button>
                    <p class="checkin-desc">
                        ${hasCheckedIn 
                            ? `太棒了！已连续打卡 ${stats.currentStreak} 天` 
                            : '今天还没打卡哦，快来记录你的进步！'}
                    </p>
                </div>
            </div>

            <!-- 每日语录 -->
            <div class="section-card quote-card">
                <div class="quote-icon">💭</div>
                <p class="quote-text">"${dailyQuote.text}"</p>
                <p class="quote-author">— ${dailyQuote.author}</p>
            </div>

            <!-- 快捷操作 -->
            <div class="section-card">
                <h3>⚡ 快捷操作</h3>
                <div class="action-buttons">
                    <button class="action-btn" id="addGoalBtn">
                        <span class="action-icon">🎯</span>
                        <span>新建目标</span>
                    </button>
                    <button class="action-btn" id="addHabitBtn">
                        <span class="action-icon">🔄</span>
                        <span>新建习惯</span>
                    </button>
                    <button class="action-btn" id="viewGoalsBtn">
                        <span class="action-icon">📋</span>
                        <span>目标列表</span>
                    </button>
                    <button class="action-btn" id="viewHabitsBtn">
                        <span class="action-icon">✅</span>
                        <span>习惯列表</span>
                    </button>
                </div>
            </div>

            <!-- 成就徽章 -->
            <div class="section-card">
                <h3>🏆 成就徽章 (${stats.unlockedAchievements}/${stats.totalAchievements})</h3>
                <div class="achievements-grid">
                    ${achievements.map(a => `
                        <div class="achievement-badge ${a.unlocked ? '' : 'locked'}">
                            <span class="badge-icon">${a.icon}</span>
                            <span class="badge-name">${a.name}</span>
                            <span class="badge-desc">${a.desc}</span>
                            ${a.unlocked ? '<span class="unlocked-tag">已解锁</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // 绑定事件
    bindSelfDriveEvents(container, selfDrive);
}

// 绑定自驱力页面事件
function bindSelfDriveEvents(container, selfDrive) {
    // 返回按钮
    container.querySelector('#selfDriveBackBtn').addEventListener('click', () => {
        window.ui.goHome();
    });

    // 每日打卡
    container.querySelector('#dailyCheckinBtn').addEventListener('click', () => {
        selfDrive.dailyCheckin();
        renderSelfDrive(container); // 刷新页面
    });

    // 新建目标
    container.querySelector('#addGoalBtn').addEventListener('click', () => {
        showAddGoalModal(container, selfDrive);
    });

    // 新建习惯
    container.querySelector('#addHabitBtn').addEventListener('click', () => {
        showAddHabitModal(container, selfDrive);
    });

    // 查看目标列表
    container.querySelector('#viewGoalsBtn').addEventListener('click', () => {
        renderGoalsList(container, selfDrive);
    });

    // 查看习惯列表
    container.querySelector('#viewHabitsBtn').addEventListener('click', () => {
        renderHabitsList(container, selfDrive);
    });
}

// 显示新建目标弹窗
function showAddGoalModal(container, selfDrive) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎯 新建目标</h3>
                <button class="close-btn" id="closeGoalModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>目标名称</label>
                    <input type="text" id="goalTitle" placeholder="例如：30天背完1000个单词">
                </div>
                <div class="form-group">
                    <label>目标描述</label>
                    <textarea id="goalDesc" placeholder="详细描述你的目标..." rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>分类</label>
                    <select id="goalCategory">
                        <option value="study">📚 学习</option>
                        <option value="health">💪 健康</option>
                        <option value="work">💼 工作</option>
                        <option value="life">🌟 生活</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelGoalBtn">取消</button>
                <button class="btn btn-primary" id="saveGoalBtn">创建目标</button>
            </div>
        </div>
    `;

    container.appendChild(modal);

    // 关闭弹窗
    const closeModal = () => modal.remove();
    modal.querySelector('#closeGoalModal').addEventListener('click', closeModal);
    modal.querySelector('#cancelGoalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 保存目标
    modal.querySelector('#saveGoalBtn').addEventListener('click', () => {
        const title = modal.querySelector('#goalTitle').value.trim();
        const desc = modal.querySelector('#goalDesc').value.trim();
        const category = modal.querySelector('#goalCategory').value;

        if (title) {
            selfDrive.addGoal({ title, desc, category });
            closeModal();
            renderSelfDrive(container);
        } else {
            showToast('请输入目标名称');
        }
    });
}

// 显示新建习惯弹窗
function showAddHabitModal(container, selfDrive) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔄 新建习惯</h3>
                <button class="close-btn" id="closeHabitModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>习惯名称</label>
                    <input type="text" id="habitName" placeholder="例如：每天阅读30分钟">
                </div>
                <div class="form-group">
                    <label>选择图标</label>
                    <div class="icon-selector">
                        ${['📚', '💪', '🏃', '🧘', '✍️', '🎨', '🎵', '💧', '🥗', '😴'].map(icon => `
                            <span class="icon-option" data-icon="${icon}">${icon}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelHabitBtn">取消</button>
                <button class="btn btn-primary" id="saveHabitBtn">创建习惯</button>
            </div>
        </div>
    `;

    container.appendChild(modal);

    let selectedIcon = '✅';
    
    // 选择图标
    modal.querySelectorAll('.icon-option').forEach(iconEl => {
        iconEl.addEventListener('click', () => {
            modal.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
            iconEl.classList.add('selected');
            selectedIcon = iconEl.dataset.icon;
        });
    });

    // 关闭弹窗
    const closeModal = () => modal.remove();
    modal.querySelector('#closeHabitModal').addEventListener('click', closeModal);
    modal.querySelector('#cancelHabitBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 保存习惯
    modal.querySelector('#saveHabitBtn').addEventListener('click', () => {
        const name = modal.querySelector('#habitName').value.trim();

        if (name) {
            selfDrive.addHabit({ name, icon: selectedIcon });
            closeModal();
            renderSelfDrive(container);
        } else {
            showToast('请输入习惯名称');
        }
    });
}

// 渲染目标列表页面
function renderGoalsList(container, selfDrive) {
    const data = selfDrive.getData();
    const activeGoals = data.goals.filter(g => !g.completed);
    const completedGoals = data.goals.filter(g => g.completed);

    container.innerHTML = `
        <div class="selfdrive-container">
            <div class="module-nav-bar">
                <button class="back-btn" id="goalsBackBtn">← 返回</button>
                <h2>🎯 目标管理</h2>
                <button class="add-btn" id="addGoalListBtn">+ 新建</button>
            </div>

            <!-- 进行中的目标 -->
            <div class="section-card">
                <h3>📋 进行中 (${activeGoals.length})</h3>
                ${activeGoals.length === 0 ? `
                    <div class="empty-state">
                        <p>还没有目标，点击右上角创建第一个目标吧！</p>
                    </div>
                ` : activeGoals.map(goal => `
                    <div class="goal-item">
                        <div class="goal-info">
                            <h4>${goal.title}</h4>
                            <p class="goal-desc">${goal.desc || '暂无描述'}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${goal.progress}%"></div>
                            </div>
                            <span class="progress-text">${goal.progress}%</span>
                        </div>
                        <div class="goal-actions">
                            <button class="icon-btn" data-action="update" data-id="${goal.id}">📝</button>
                            <button class="icon-btn" data-action="delete" data-id="${goal.id}">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- 已完成的目标 -->
            ${completedGoals.length > 0 ? `
                <div class="section-card">
                    <h3>✅ 已完成 (${completedGoals.length})</h3>
                    ${completedGoals.map(goal => `
                        <div class="goal-item completed">
                            <div class="goal-info">
                                <h4>${goal.title}</h4>
                                <p class="goal-desc">完成于 ${new Date(goal.completedAt).toLocaleDateString()}</p>
                            </div>
                            <div class="goal-actions">
                                <button class="icon-btn" data-action="delete" data-id="${goal.id}">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    // 返回按钮
    container.querySelector('#goalsBackBtn').addEventListener('click', () => {
        renderSelfDrive(container);
    });

    // 新建目标
    container.querySelector('#addGoalListBtn').addEventListener('click', () => {
        showAddGoalModal(container, selfDrive);
    });

    // 目标操作
    container.querySelectorAll('.goal-item .icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const goalId = btn.dataset.id;

            if (action === 'delete') {
                if (confirm('确定要删除这个目标吗？')) {
                    selfDrive.deleteGoal(goalId);
                    renderGoalsList(container, selfDrive);
                }
            } else if (action === 'update') {
                const progress = prompt('设置目标进度 (0-100):', '50');
                if (progress !== null && !isNaN(progress)) {
                    selfDrive.updateGoalProgress(goalId, parseInt(progress));
                    renderGoalsList(container, selfDrive);
                }
            }
        });
    });
}

// 渲染习惯列表页面
function renderHabitsList(container, selfDrive) {
    const data = selfDrive.getData();
    const today = new Date().toDateString();

    container.innerHTML = `
        <div class="selfdrive-container">
            <div class="module-nav-bar">
                <button class="back-btn" id="habitsBackBtn">← 返回</button>
                <h2>✅ 习惯打卡</h2>
                <button class="add-btn" id="addHabitListBtn">+ 新建</button>
            </div>

            <div class="section-card">
                ${data.habits.length === 0 ? `
                    <div class="empty-state">
                        <p>还没有习惯，点击右上角创建第一个习惯吧！</p>
                    </div>
                ` : data.habits.map(habit => {
                    const hasChecked = habit.checkinDays.includes(today);
                    return `
                        <div class="habit-item">
                            <div class="habit-icon">${habit.icon}</div>
                            <div class="habit-info">
                                <h4>${habit.name}</h4>
                                <p class="habit-streak">🔥 连续 ${habit.streak} 天 · 总计 ${habit.checkinDays.length} 天</p>
                            </div>
                            <button class="habit-check-btn ${hasChecked ? 'checked' : ''}" data-id="${habit.id}">
                                ${hasChecked ? '✓' : ''}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // 返回按钮
    container.querySelector('#habitsBackBtn').addEventListener('click', () => {
        renderSelfDrive(container);
    });

    // 新建习惯
    container.querySelector('#addHabitListBtn').addEventListener('click', () => {
        showAddHabitModal(container, selfDrive);
    });

    // 打卡按钮
    container.querySelectorAll('.habit-check-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const habitId = btn.dataset.id;
            const isChecked = btn.classList.contains('checked');
            
            if (isChecked) {
                selfDrive.uncheckinHabit(habitId);
            } else {
                selfDrive.checkinHabit(habitId);
            }
            
            renderHabitsList(container, selfDrive);
        });
    });
}


// ========== 学习图书馆UI渲染 ==========

// 获取图书馆模块
async function getLibraryModule() {
    return await import('./modules/library.js');
}

// 渲染学习图书馆主页
export async function renderLibrary(container) {
    const library = await getLibraryModule();
    
    // 初始化模块
    library.init();
    
    const stats = library.getStats();
    const categories = library.getCategories();
    const recentReading = library.getRecentReading(6);
    const data = library.getData();

    container.innerHTML = `
        <div class="library-container">
            <!-- 顶部导航栏 -->
            <div class="module-nav-bar">
                <button class="back-btn" id="libraryBackBtn">← 返回首页</button>
                <h2>📚 学习图书馆</h2>
                <div></div>
            </div>

            <!-- 搜索栏 -->
            <div class="search-bar">
                <input type="text" id="librarySearch" placeholder="🔍 搜索书籍、文章、视频..." class="search-input">
            </div>

            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-number">${stats.books}</div>
                    <div class="stat-label">书籍</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📄</div>
                    <div class="stat-number">${stats.articles}</div>
                    <div class="stat-label">文章</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎬</div>
                    <div class="stat-number">${stats.videos}</div>
                    <div class="stat-label">视频</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎧</div>
                    <div class="stat-number">${stats.audios}</div>
                    <div class="stat-label">音频</div>
                </div>
            </div>

            <!-- 分类导航 -->
            <div class="section-card">
                <h3>📂 分类浏览</h3>
                <div class="category-tabs">
                    <button class="category-tab active" data-category="all">全部</button>
                    ${categories.map(cat => `
                        <button class="category-tab" data-category="${cat.id}">
                            ${cat.icon} ${cat.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 最近阅读 -->
            ${recentReading.length > 0 ? `
                <div class="section-card">
                    <h3>📖 最近阅读</h3>
                    <div class="resource-grid small-grid">
                        ${recentReading.map(r => `
                            <div class="resource-card small" data-id="${r.id}" data-type="${r.type}">
                                <div class="resource-cover">${r.cover}</div>
                                <div class="resource-info">
                                    <h4>${r.title}</h4>
                                    <p>${r.author}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- 资源类型切换 -->
            <div class="section-card">
                <div class="type-tabs">
                    <button class="type-tab active" data-type="all">全部</button>
                    <button class="type-tab" data-type="book">📘 书籍</button>
                    <button class="type-tab" data-type="article">📝 文章</button>
                    <button class="type-tab" data-type="video">🎬 视频</button>
                    <button class="type-tab" data-type="audio">🎧 音频</button>
                    <button class="type-tab" data-type="favorites">❤️ 收藏</button>
                </div>
            </div>

            <!-- 资源列表 -->
            <div class="section-card" id="resourceListContainer">
                <!-- 资源列表将动态渲染 -->
            </div>
        </div>
    `;

    // 绑定事件
    bindLibraryEvents(container, library);
    
    // 初始渲染全部资源
    renderResourceList(container, library.getAllResources(), library);
}

// 渲染资源列表
function renderResourceList(container, resources, library) {
    const listContainer = container.querySelector('#resourceListContainer');
    const isFavoriteList = listContainer.dataset.type === 'favorites';
    
    if (resources.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <p>${isFavoriteList ? '还没有收藏的资源' : '暂无相关资源'}</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = `
        <div class="resource-grid">
            ${resources.map(r => {
                const isFav = library.isFavorite(r.id);
                const progress = library.getReadingProgress(r.id);
                return `
                    <div class="resource-card" data-id="${r.id}" data-type="${r.type}">
                        <div class="resource-cover">${r.cover}</div>
                        <div class="resource-info">
                            <h4>${r.title}</h4>
                            <p class="resource-author">${r.author}</p>
                            <p class="resource-desc">${r.desc}</p>
                            <div class="resource-meta">
                                <span class="rating">⭐ ${r.rating || '-'}</span>
                                <span class="count">👁 ${(r.readCount || r.viewCount || r.playCount || 0).toLocaleString()}</span>
                                ${r.duration ? `<span class="duration">⏱ ${r.duration}</span>` : ''}
                                ${r.readTime ? `<span class="read-time">📖 ${r.readTime}分钟</span>` : ''}
                            </div>
                            ${progress.progress > 0 ? `
                                <div class="mini-progress">
                                    <div class="mini-progress-fill" style="width: ${progress.progress}%"></div>
                                </div>
                            ` : ''}
                        </div>
                        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${r.id}" onclick="event.stopPropagation()">
                            ${isFav ? '❤️' : '🤍'}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // 绑定资源卡片点击事件
    listContainer.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', () => {
            const resourceId = card.dataset.id;
            renderResourceDetail(container, library, resourceId);
        });
    });

    // 绑定收藏按钮事件
    listContainer.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const resourceId = btn.dataset.id;
            const isFav = btn.classList.contains('active');
            
            if (isFav) {
                library.removeFromFavorites(resourceId);
            } else {
                library.addToFavorites(resourceId);
            }
            
            // 刷新列表
            const currentType = listContainer.dataset.type || 'all';
            const currentCategory = listContainer.dataset.category || 'all';
            
            if (currentType === 'favorites') {
                renderResourceList(container, library.getFavorites(), library);
            } else if (currentType === 'all') {
                if (currentCategory === 'all') {
                    renderResourceList(container, library.getAllResources(), library);
                } else {
                    renderResourceList(container, library.getResourcesByCategory(currentCategory), library);
                }
            } else {
                let resources = library.getResourcesByType(currentType);
                if (currentCategory !== 'all') {
                    resources = resources.filter(r => r.category === currentCategory);
                }
                renderResourceList(container, resources, library);
            }
        });
    });
}

// 渲染资源详情页
function renderResourceDetail(container, library, resourceId) {
    const resource = library.getResourceById(resourceId);
    if (!resource) {
        showToast('资源不存在');
        return;
    }
    
    const isFav = library.isFavorite(resourceId);
    const progress = library.getReadingProgress(resourceId);

    // 记录阅读
    library.recordReading(resourceId, progress.progress || 10);

    container.innerHTML = `
        <div class="reader-container">
            <!-- 阅读器顶部栏 -->
            <div class="reader-header">
                <button class="back-btn" id="readerBackBtn">← 返回</button>
                <h2>${resource.cover} ${resource.title}</h2>
                <button class="fav-btn-large ${isFav ? 'active' : ''}" id="readerFavBtn">
                    ${isFav ? '❤️' : '🤍'}
                </button>
            </div>

            <!-- 资源信息 -->
            <div class="resource-detail-header">
                <div class="detail-cover">${resource.cover}</div>
                <div class="detail-info">
                    <h1>${resource.title}</h1>
                    <p class="detail-author">作者：${resource.author}</p>
                    <div class="detail-meta">
                        <span>⭐ ${resource.rating || '-'}</span>
                        <span>👁 ${(resource.readCount || resource.viewCount || 0).toLocaleString()}</span>
                        ${resource.duration ? `<span>⏱ ${resource.duration}</span>` : ''}
                        ${resource.readTime ? `<span>📖 ${resource.readTime}分钟阅读</span>` : ''}
                    </div>
                    <p class="detail-desc">${resource.desc}</p>
                </div>
            </div>

            <!-- 阅读进度 -->
            ${progress.progress > 0 ? `
                <div class="progress-section">
                    <span class="progress-label">阅读进度</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.progress}%"></div>
                    </div>
                    <span class="progress-value">${progress.progress}%</span>
                </div>
            ` : ''}

            <!-- 阅读/播放区域 -->
            <div class="reader-content">
                ${resource.type === 'book' ? `
                    <!-- 书籍阅读 -->
                    <div class="book-reader">
                        ${resource.chapters ? `
                            <div class="chapter-list">
                                <h3>📑 章节目录</h3>
                                ${resource.chapters.map((ch, idx) => `
                                    <div class="chapter-item" data-chapter="${idx}">
                                        <span class="chapter-num">第${idx + 1}章</span>
                                        <span class="chapter-title">${ch}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        <div class="book-content">
                            <h3>📖 内容简介</h3>
                            <p>${resource.content}</p>
                            <div class="reading-tip">
                                💡 提示：这是学习图书馆的演示版本，完整版本将包含完整书籍内容
                            </div>
                        </div>
                    </div>
                ` : resource.type === 'article' ? `
                    <!-- 文章阅读 -->
                    <div class="article-reader">
                        <p>${resource.content}</p>
                        <div class="reading-tip">
                            💡 提示：这是学习图书馆的演示版本，完整版本将包含完整文章内容
                        </div>
                    </div>
                ` : resource.type === 'video' ? `
                    <!-- 视频播放 -->
                    <div class="video-player">
                        <div class="video-placeholder">
                            <div class="play-icon">▶️</div>
                            <p>视频播放区域（演示版本）</p>
                            <p class="video-desc">完整版本将支持实际视频播放功能</p>
                        </div>
                    </div>
                ` : `
                    <!-- 音频播放 -->
                    <div class="audio-player">
                        <div class="audio-placeholder">
                            <div class="audio-icon">🎵</div>
                            <p>音频播放区域（演示版本）</p>
                            <p class="audio-desc">完整版本将支持实际音频播放功能</p>
                        </div>
                    </div>
                `}
            </div>

            <!-- 底部操作栏 -->
            <div class="reader-footer">
                <button class="btn btn-secondary" id="readerBackToListBtn">← 返回列表</button>
                <button class="btn btn-secondary" id="readerDownloadBtn">📥 下载资源</button>
                <button class="btn btn-primary" id="readerContinueBtn">继续阅读</button>
            </div>
        </div>
    `;

    // 绑定阅读器事件
    const backBtn = container.querySelector('#readerBackBtn');
    const backToListBtn = container.querySelector('#readerBackToListBtn');
    const favBtn = container.querySelector('#readerFavBtn');
    const downloadBtn = container.querySelector('#readerDownloadBtn');
    const continueBtn = container.querySelector('#readerContinueBtn');

    [backBtn, backToListBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            renderLibrary(container);
        });
    });

    favBtn.addEventListener('click', () => {
        const isCurrentlyFav = favBtn.classList.contains('active');
        if (isCurrentlyFav) {
            library.removeFromFavorites(resourceId);
            favBtn.classList.remove('active');
            favBtn.textContent = '🤍';
        } else {
            library.addToFavorites(resourceId);
            favBtn.classList.add('active');
            favBtn.textContent = '❤️';
        }
    });

    downloadBtn.addEventListener('click', () => {
        const contentText = `【${resource.title}】

作者：${resource.author}
评分：${resource.rating || '-'}

---

${resource.desc}

---

${resource.content || ''}


---
下载自：认知训练门户 - 学习图书馆`;
        const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('下载成功！ 📥');
    });

    continueBtn.addEventListener('click', () => {
        showToast('继续学习中... 💪');
        // 更新阅读进度
        const newProgress = Math.min(100, (progress.progress || 0) + 10);
        library.recordReading(resourceId, newProgress);
        renderResourceDetail(container, library, resourceId);
    });
}

// 绑定图书馆页面事件
function bindLibraryEvents(container, library) {
    // 返回按钮
    container.querySelector('#libraryBackBtn').addEventListener('click', () => {
        window.ui.goHome();
    });

    // 搜索功能
    const searchInput = container.querySelector('#librarySearch');
    let searchTimeout = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const keyword = e.target.value.trim();
            if (keyword) {
                const results = library.searchResources(keyword);
                renderResourceList(container, results, library);
            } else {
                renderResourceList(container, library.getAllResources(), library);
            }
        }, 300);
    });

    // 分类切换
    container.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // 更新激活状态
            container.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 获取当前激活的类型
            const activeTypeTab = container.querySelector('.type-tab.active');
            const currentType = activeTypeTab ? activeTypeTab.dataset.type : 'all';
            
            // 保存当前筛选状态
            const listContainer = container.querySelector('#resourceListContainer');
            listContainer.dataset.category = category;
            listContainer.dataset.type = currentType;
            
            // 筛选资源
            let resources;
            if (currentType === 'favorites') {
                resources = library.getFavorites();
                if (category !== 'all') {
                    resources = resources.filter(r => r.category === category);
                }
            } else if (currentType === 'all') {
                resources = category === 'all' 
                    ? library.getAllResources() 
                    : library.getResourcesByCategory(category);
            } else {
                resources = library.getResourcesByType(currentType);
                if (category !== 'all') {
                    resources = resources.filter(r => r.category === category);
                }
            }
            
            renderResourceList(container, resources, library);
        });
    });

    // 类型切换
    container.querySelectorAll('.type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            
            // 更新激活状态
            container.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 获取当前激活的分类
            const activeCatTab = container.querySelector('.category-tab.active');
            const currentCategory = activeCatTab ? activeCatTab.dataset.category : 'all';
            
            // 保存当前筛选状态
            const listContainer = container.querySelector('#resourceListContainer');
            listContainer.dataset.category = currentCategory;
            listContainer.dataset.type = type;
            
            // 筛选资源
            let resources;
            if (type === 'favorites') {
                resources = library.getFavorites();
                if (currentCategory !== 'all') {
                    resources = resources.filter(r => r.category === currentCategory);
                }
            } else if (type === 'all') {
                resources = currentCategory === 'all' 
                    ? library.getAllResources() 
                    : library.getResourcesByCategory(currentCategory);
            } else {
                resources = library.getResourcesByType(type);
                if (currentCategory !== 'all') {
                    resources = resources.filter(r => r.category === currentCategory);
                }
            }
            
            renderResourceList(container, resources, library);
        });
    });
}


// ========== 我的个人中心UI渲染 ==========

// 获取个人中心模块
async function getMyCenterModule() {
    return await import('./modules/my-center.js');
}

// 渲染个人中心主页
export async function renderMyCenter(container) {
    const myCenter = await getMyCenterModule();
    
    // 初始化模块
    myCenter.init();
    
    const profile = myCenter.getProfile();
    const stats = myCenter.getStatistics();
    const levelProgress = myCenter.getLevelProgress();
    const achievements = myCenter.getAllAchievements();
    const modules = myCenter.getLearningModules();
    const currentReview = myCenter.getCurrentWeekReview();
    const reviews = myCenter.getAllWeeklyReviews();

    container.innerHTML = `
        <div class="my-center-container">
            <!-- 顶部导航栏 -->
            <div class="module-nav-bar">
                <button class="back-btn" id="myCenterBackBtn">← 返回首页</button>
                <h2>👤 我的</h2>
                <button class="edit-btn" id="editProfileBtn">✏️</button>
            </div>

            <!-- 用户卡片 -->
            <div class="user-card">
                <div class="user-avatar-large">${profile.avatar}</div>
                <div class="user-info">
                    <h3>${profile.nickname}</h3>
                    <p class="user-motto">${profile.motto}</p>
                    <div class="level-badge">Lv.${profile.level}</div>
                </div>
                <div class="exp-bar">
                    <div class="exp-fill" style="width: ${levelProgress.percentage}%;"></div>
                    <span class="exp-text">${profile.exp} / ${levelProgress.needed} EXP</span>
                </div>
            </div>

            <!-- 数据统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card highlight">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-number">${stats.currentStreak}</div>
                    <div class="stat-label">连续周数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-number">${stats.weekStudyMinutes}</div>
                    <div class="stat-label">本周分钟</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-number">${stats.totalReviewCount}</div>
                    <div class="stat-label">周回顾数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-number">${stats.unlockedAchievements}/${stats.totalAchievements}</div>
                    <div class="stat-label">成就徽章</div>
                </div>
            </div>

            <!-- 本周回顾入口 -->
            <div class="section-card">
                <div class="section-header">
                    <h3>📋 本周回顾</h3>
                    <button class="btn btn-small ${currentReview ? 'btn-secondary' : 'btn-primary'}" id="weeklyReviewBtn">
                        ${currentReview ? '查看/编辑' : '开始回顾'}
                    </button>
                </div>
                ${currentReview ? `
                    <div class="review-preview">
                        <div class="review-status completed">✅ 本周已完成回顾</div>
                        <p class="review-date">${currentReview.weekLabel}</p>
                    </div>
                ` : `
                    <div class="review-preview">
                        <div class="review-status pending">⏰ 等待完成本周回顾</div>
                        <p class="review-tip">记录学习收获，让成长看得见</p>
                    </div>
                `}
            </div>

            <!-- 番茄钟入口 -->
            <div class="section-card">
                <div class="section-header">
                    <h3>🍅 番茄钟</h3>
                    <button class="btn btn-primary btn-small" id="startPomodoroBtn">开始专注</button>
                </div>
                <div class="pomodoro-preview">
                    <div class="pomodoro-info">
                        <span class="pomodoro-icon">⏱️</span>
                        <div>
                            <p class="pomodoro-title">专注时间管理</p>
                            <p class="pomodoro-desc">25分钟专注 + 5分钟休息</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 学习模块统计 -->
            <div class="section-card">
                <h3>📊 学习模块</h3>
                <div class="module-grid">
                    ${modules.map(m => `
                        <div class="module-stat-item" data-id="${m.id}">
                            <div class="module-stat-icon" style="background: ${m.color}20; color: ${m.color};">
                                ${m.icon}
                            </div>
                            <div class="module-stat-name">${m.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 成就展示 -->
            <div class="section-card">
                <div class="section-header">
                    <h3>🏆 我的成就</h3>
                </div>
                <div class="achievements-grid">
                    ${achievements.map(a => `
                        <div class="achievement-badge ${a.unlocked ? '' : 'locked'}">
                            <span class="badge-icon">${a.icon}</span>
                            <span class="badge-name">${a.name}</span>
                            <span class="badge-desc">${a.desc}</span>
                            ${a.unlocked ? '<span class="unlocked-tag">已解锁</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 历史回顾 -->
            <div class="section-card">
                <h3>📚 历史回顾</h3>
                ${reviews.length === 0 ? `
                    <div class="empty-state">
                        <p>还没有周回顾记录，开始第一次回顾吧！</p>
                    </div>
                ` : `
                    <div class="review-list">
                        ${reviews.slice(0, 5).map(r => `
                            <div class="review-item" data-id="${r.id}">
                                <div class="review-icon">📝</div>
                                <div class="review-info">
                                    <h4>${r.weekLabel}</h4>
                                    <p class="review-date">${new Date(r.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span class="review-arrow">→</span>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;

    // 绑定事件
    bindMyCenterEvents(container, myCenter);
}

// 渲染周回顾页面
export async function renderWeeklyReview(container, myCenter, reviewId = null) {
    const questions = myCenter.getWeeklyReviewQuestions();
    const existingReview = reviewId ? myCenter.getAllWeeklyReviews().find(r => r.id === reviewId) : myCenter.getCurrentWeekReview();

    container.innerHTML = `
        <div class="review-container">
            <!-- 顶部导航 -->
            <div class="module-nav-bar">
                <button class="back-btn" id="reviewBackBtn">← 返回</button>
                <h2>📋 周回顾</h2>
                <div></div>
            </div>

            <!-- 引导语 -->
            <div class="review-intro">
                <h3>✨ 回顾这一周</h3>
                <p>花几分钟回顾本周的学习与成长，让进步看得见</p>
            </div>

            <!-- 问题表单 -->
            <div class="review-form">
                ${questions.map((q, index) => `
                    <div class="question-section">
                        <label class="question-label">${q.label}</label>
                        ${q.type === 'text' ? `
                            <textarea 
                                class="review-textarea" 
                                data-question="${q.id}" 
                                placeholder="${q.placeholder}"
                                rows="3"
                            >${existingReview?.answers[q.id] || ''}</textarea>
                        ` : q.type === 'rating' ? `
                            <div class="rating-stars" data-question="${q.id}">
                                ${Array.from({ length: q.max }, (_, i) => `
                                    <span class="star ${existingReview?.answers[q.id] > i ? 'filled' : ''}" data-value="${i + 1}">
                                        ⭐
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}

                <div class="review-actions">
                    <button class="btn btn-secondary" id="cancelReviewBtn">取消</button>
                    <button class="btn btn-primary" id="saveReviewBtn">💾 保存回顾</button>
                </div>
            </div>
        </div>
    `;

    bindReviewEvents(container, myCenter);
}

// 绑定个人中心事件
function bindMyCenterEvents(container, myCenter) {
    // 返回按钮
    container.querySelector('#myCenterBackBtn').addEventListener('click', () => {
        window.ui.goHome();
    });

    // 编辑资料
    container.querySelector('#editProfileBtn').addEventListener('click', () => {
        const profile = myCenter.getProfile();
        const newNickname = prompt('修改昵称：', profile.nickname);
        if (newNickname && newNickname.trim()) {
            myCenter.updateProfile({ nickname: newNickname.trim() });
            renderMyCenter(container);
        }
    });

    // 周回顾按钮
    container.querySelector('#weeklyReviewBtn').addEventListener('click', () => {
        renderWeeklyReview(container, myCenter);
    });

    // 番茄钟按钮
    container.querySelector('#startPomodoroBtn').addEventListener('click', () => {
        renderPomodoro(container);
    });

    // 点击历史回顾项
    container.querySelectorAll('.review-item').forEach(item => {
        item.addEventListener('click', () => {
            renderWeeklyReview(container, myCenter, item.dataset.id);
        });
    });
}

// 绑定周回顾页面事件
function bindReviewEvents(container, myCenter) {
    // 返回按钮
    container.querySelector('#reviewBackBtn').addEventListener('click', () => {
        renderMyCenter(container);
    });

    // 取消按钮
    container.querySelector('#cancelReviewBtn').addEventListener('click', () => {
        renderMyCenter(container);
    });

    // 星星评分点击
    container.querySelectorAll('.rating-stars .star').forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            const starsContainer = star.parentElement;
            
            starsContainer.querySelectorAll('.star').forEach((s, i) => {
                s.classList.toggle('filled', i < value);
            });
        });
    });

    // 保存回顾
    container.querySelector('#saveReviewBtn').addEventListener('click', () => {
        const answers = {};
        
        // 收集文本答案
        container.querySelectorAll('.review-textarea').forEach(textarea => {
            answers[textarea.dataset.question] = textarea.value.trim();
        });
        
        // 收集评分答案
        container.querySelectorAll('.rating-stars').forEach(rating => {
            const filledStars = rating.querySelectorAll('.star.filled').length;
            answers[rating.dataset.question] = filledStars;
        });
        
        myCenter.createWeeklyReview(answers);
        renderMyCenter(container);
    });
}


// ==================== 思维导图模块UI ====================

let mindmapState = {
    currentMindmap: null,
    selectedNode: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
};

export function renderMindmap(container) {
    // 动态导入模块避免循环依赖
    import('./modules/mindmap.js').then((mindmapModule) => {
        const mindmap = mindmapModule.default;
        mindmapState.currentMindmap = null;
        mindmapState.selectedNode = null;
        
        const mindmaps = mindmap.getAll();
        
        container.innerHTML = `
            <div class="mindmap-container">
                <div class="module-header">
                    <h2>🗺️ 思维导图</h2>
                    <p>可视化你的思维，整理知识结构</p>
                </div>
                
                <div class="mindmap-toolbar">
                    <button class="btn btn-primary" id="createMindmapBtn">+ 新建思维导图</button>
                    <button class="btn btn-secondary" id="backFromMindmapBtn">返回首页</button>
                </div>
                
                <div id="mindmapContent">
                    ${mindmaps.length === 0 ? renderEmptyMindmapList() : renderMindmapList(mindmaps)}
                </div>
            </div>
        `;
        
        // 绑定事件
        bindMindmapEvents(container, mindmap, mindmapModule);
    });
}

function renderEmptyMindmapList() {
    return `
        <div class="empty-state">
            <div class="empty-icon">🗺️</div>
            <h3>还没有思维导图</h3>
            <p>创建你的第一张思维导图，开始整理思路</p>
            <div class="template-suggestions">
                <h4>试试这些模板：</h4>
                <div class="template-grid">
                    <div class="template-card" data-template="template_learning">
                        <div class="template-icon">📚</div>
                        <div class="template-name">学习计划</div>
                    </div>
                    <div class="template-card" data-template="template_thinking">
                        <div class="template-icon">💡</div>
                        <div class="template-name">头脑风暴</div>
                    </div>
                    <div class="template-card" data-template="template_project">
                        <div class="template-icon">📋</div>
                        <div class="template-name">项目管理</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMindmapList(mindmaps) {
    return `
        <div class="mindmap-list">
            ${mindmaps.map(m => `
                <div class="mindmap-item" data-id="${m.id}">
                    <div class="mindmap-icon">🗺️</div>
                    <div class="mindmap-info">
                        <h4>${m.name}</h4>
                        <div class="mindmap-meta">
                            <span>${m.data.nodes.length} 个节点</span>
                            <span>更新于 ${new Date(m.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="mindmap-actions">
                        <button class="btn btn-small" data-action="edit">编辑</button>
                        <button class="btn btn-small btn-danger" data-action="delete">删除</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMindmapEditor(container, mindmapData, mindmap) {
    mindmapState.currentMindmap = mindmapData;
    const nodes = mindmapData.data.nodes;
    const stats = mindmap.getStats(mindmapData.id);
    
    container.innerHTML = `
        <div class="mindmap-editor">
            <div class="editor-header">
                <div class="editor-title">
                    <input type="text" id="mindmapTitle" value="${mindmapData.name}" class="title-input">
                </div>
                <div class="editor-actions">
                    <button class="btn btn-secondary" id="addNodeBtn">+ 添加节点</button>
                    <button class="btn btn-secondary" id="exportJsonBtn">导出JSON</button>
                    <button class="btn btn-secondary" id="exportTextBtn">导出文本</button>
                    <button class="btn btn-primary" id="backToListBtn">返回列表</button>
                </div>
            </div>
            
            <div class="editor-stats">
                <span>📊 ${stats.totalNodes} 个节点</span>
                <span>📍 最大深度: ${stats.maxDepth}</span>
                <span>🍃 ${stats.leafNodes} 个叶子节点</span>
            </div>
            
            <div class="mindmap-canvas" id="mindmapCanvas">
                ${nodes.map(node => renderMindmapNode(node, nodes)).join('')}
                ${renderConnections(nodes)}
            </div>
        </div>
    `;
    
    bindEditorEvents(container, mindmapData.id, mindmap);
}

function renderMindmapNode(node, allNodes) {
    const isRoot = node.type === 'root';
    const isSelected = mindmapState.selectedNode === node.id;
    const childrenCount = allNodes.filter(n => n.parent === node.id).length;
    
    return `
        <div class="mindmap-node ${isRoot ? 'root-node' : ''} ${isSelected ? 'selected' : ''}" 
             data-id="${node.id}" 
             style="left: ${node.x}px; top: ${node.y}px; background-color: ${node.color};">
            <div class="node-content" contenteditable="true">${node.text}</div>
            ${childrenCount > 0 ? `<div class="node-badge">${childrenCount}</div>` : ''}
            ${!isRoot ? `<button class="node-delete" data-id="${node.id}">×</button>` : ''}
        </div>
    `;
}

function renderConnections(nodes) {
    let svg = '<svg class="connections-svg">';
    
    nodes.forEach(node => {
        if (node.parent) {
            const parent = nodes.find(n => n.id === node.parent);
            if (parent) {
                const startX = parent.x + 60;
                const startY = parent.y + 20;
                const endX = node.x + 60;
                const endY = node.y + 20;
                
                const midX = (startX + endX) / 2;
                svg += `<path d="M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}" 
                              stroke="${node.color}" stroke-width="2" fill="none" opacity="0.6"/>`;
            }
        }
    });
    
    svg += '</svg>';
    return svg;
}

function bindMindmapEvents(container, mindmap, mindmapModule) {
    // 创建思维导图
    container.querySelector('#createMindmapBtn')?.addEventListener('click', () => {
        showCreateMindmapModal(container, mindmap, mindmapModule);
    });
    
    // 返回首页
    container.querySelector('#backFromMindmapBtn')?.addEventListener('click', () => {
        renderModules(container);
    });
    
    // 模板快速创建
    container.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.template;
            const template = mindmapModule.getTemplates().find(t => t.id === templateId);
            const newMindmap = mindmap.createFromTemplate(templateId, template.name);
            renderMindmapEditor(container, newMindmap, mindmap);
        });
    });
    
    // 列表项操作
    container.querySelectorAll('.mindmap-item').forEach(item => {
        const id = item.dataset.id;
        
        // 编辑/打开
        item.querySelector('[data-action="edit"]').addEventListener('click', () => {
            const mindmapData = mindmap.open(id);
            renderMindmapEditor(container, mindmapData, mindmap);
        });
        
        // 删除
        item.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('确定要删除这个思维导图吗？')) {
                mindmap.delete(id);
                renderMindmap(container);
            }
        });
    });
}

function bindEditorEvents(container, mindmapId, mindmap) {
    const canvas = container.querySelector('#mindmapCanvas');
    
    // 返回列表
    container.querySelector('#backToListBtn')?.addEventListener('click', () => {
        renderMindmap(container);
    });
    
    // 添加节点
    container.querySelector('#addNodeBtn')?.addEventListener('click', () => {
        const parentId = mindmapState.selectedNode || 'root';
        mindmap.addNode(mindmapId, parentId, '新节点');
        const updated = mindmap.getById(mindmapId);
        renderMindmapEditor(container, updated, mindmap);
    });
    
    // 导出JSON
    container.querySelector('#exportJsonBtn')?.addEventListener('click', () => {
        mindmap.exportAsJSON(mindmapId);
    });
    
    // 导出文本
    container.querySelector('#exportTextBtn')?.addEventListener('click', () => {
        mindmap.exportAsText(mindmapId);
    });
    
    // 标题修改
    container.querySelector('#mindmapTitle')?.addEventListener('blur', (e) => {
        mindmap.update(mindmapId, { name: e.target.value });
    });
    
    // 节点事件
    container.querySelectorAll('.mindmap-node').forEach(node => {
        const nodeId = node.dataset.id;
        
        // 选择节点
        node.addEventListener('click', (e) => {
            if (e.target.classList.contains('node-delete')) return;
            mindmapState.selectedNode = nodeId;
            const updated = mindmap.getById(mindmapId);
            renderMindmapEditor(container, updated, mindmap);
        });
        
        // 节点文本编辑
        node.querySelector('.node-content').addEventListener('blur', (e) => {
            mindmap.updateNode(mindmapId, nodeId, { text: e.target.textContent });
        });
        
        // 节点删除
        node.querySelector('.node-delete')?.addEventListener('click', () => {
            if (confirm('确定删除此节点及其子节点吗？')) {
                mindmap.deleteNode(mindmapId, nodeId);
                mindmapState.selectedNode = null;
                const updated = mindmap.getById(mindmapId);
                renderMindmapEditor(container, updated, mindmap);
            }
        });
        
        // 拖拽开始
        node.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('node-content') || e.target.classList.contains('node-delete')) return;
            mindmapState.isDragging = true;
            mindmapState.dragOffset = {
                x: e.clientX - node.offsetLeft,
                y: e.clientY - node.offsetTop
            };
            node.classList.add('dragging');
        });
    });
    
    // 拖拽移动
    document.addEventListener('mousemove', (e) => {
        if (!mindmapState.isDragging) return;
        const node = container.querySelector('.mindmap-node.dragging');
        if (node) {
            const x = e.clientX - mindmapState.dragOffset.x;
            const y = e.clientY - mindmapState.dragOffset.y;
            node.style.left = x + 'px';
            node.style.top = y + 'px';
        }
    });
    
    // 拖拽结束
    document.addEventListener('mouseup', (e) => {
        if (mindmapState.isDragging) {
            const node = container.querySelector('.mindmap-node.dragging');
            if (node) {
                const nodeId = node.dataset.id;
                const x = parseInt(node.style.left);
                const y = parseInt(node.style.top);
                mindmap.moveNode(mindmapId, nodeId, x, y);
                node.classList.remove('dragging');
            }
            mindmapState.isDragging = false;
        }
    });
}

function showCreateMindmapModal(container, mindmap, mindmapModule) {
    const templates = mindmapModule.getTemplates();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🗺️ 新建思维导图</h3>
                <button class="close-btn" id="closeMindmapModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>思维导图名称</label>
                    <input type="text" id="newMindmapName" placeholder="输入名称...">
                </div>
                <div class="form-group">
                    <label>选择模板（可选）</label>
                    <div class="template-select">
                        <label class="template-option">
                            <input type="radio" name="template" value="" checked>
                            <span>空白画布</span>
                        </label>
                        ${templates.map(t => `
                            <label class="template-option">
                                <input type="radio" name="template" value="${t.id}">
                                <span>${t.icon} ${t.name}</span>
                                <small>${t.desc}</small>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelMindmapBtn">取消</button>
                <button class="btn btn-primary" id="createMindmapConfirmBtn">创建</button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // 关闭弹窗
    const closeModal = () => modal.remove();
    modal.querySelector('#closeMindmapModal').addEventListener('click', closeModal);
    modal.querySelector('#cancelMindmapBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // 创建
    modal.querySelector('#createMindmapConfirmBtn').addEventListener('click', () => {
        const name = modal.querySelector('#newMindmapName').value.trim() || '未命名思维导图';
        const templateId = modal.querySelector('input[name="template"]:checked').value;
        
        const newMindmap = templateId 
            ? mindmap.createFromTemplate(templateId, name)
            : mindmap.create(name);
            
        closeModal();
        renderMindmapEditor(container, newMindmap, mindmap);
    });
}


// ==================== 模拟考试模块UI ====================

let examState = {
    isDrawing: false,
    currentStroke: [],
    canvas: null,
    ctx: null,
    scale: 1
};

export function renderMockExam(container) {
    import('./modules/mock-exam.js').then((mockExamModule) => {
        const mockExam = mockExamModule.default;
        const papers = mockExam.getAllPapers();
        const exams = mockExam.getExamHistory();

        container.innerHTML = `
            <div class="mock-exam-container">
                <div class="module-header">
                    <h2>📝 模拟考试</h2>
                    <p>仿真试卷、拍照上传、手写答题</p>
                </div>

                <div class="exam-toolbar">
                    <button class="btn btn-primary" id="createPaperBtn">+ 新建试卷</button>
                    <button class="btn btn-secondary" id="uploadPaperBtn">📷 拍照上传</button>
                    <button class="btn btn-secondary" id="backFromExamBtn">返回首页</button>
                </div>

                <div class="exam-tabs">
                    <button class="tab-btn active" data-tab="papers">📄 我的试卷</button>
                    <button class="tab-btn" data-tab="history">📊 考试记录</button>
                </div>

                <div id="examContent">
                    ${papers.length === 0 ? renderEmptyPapers() : renderPapersList(papers)}
                </div>
            </div>

            <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display: none;">
        `;

        bindExamEvents(container, mockExam, mockExamModule);
    });
}

function renderEmptyPapers() {
    return `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>还没有试卷</h3>
            <p>创建一份仿真试卷，开始模拟考试</p>
            <div class="quick-actions">
                <button class="btn btn-primary" id="quickCreatePaper">快速创建默认试卷</button>
            </div>
        </div>
    `;
}

function renderPapersList(papers) {
    return `
        <div class="papers-grid">
            ${papers.map(p => `
                <div class="paper-card" data-id="${p.id}">
                    <div class="paper-preview">
                        ${p.image ? `<img src="${p.image}" alt="试卷预览">` : '<div class="paper-placeholder">📄</div>'}
                    </div>
                    <div class="paper-info">
                        <h4>${p.name}</h4>
                        <div class="paper-meta">
                            <span>${new Date(p.createdAt).toLocaleDateString()}</span>
                            <span>${p.type === 'uploaded' ? '上传试卷' : '标准试卷'}</span>
                        </div>
                    </div>
                    <div class="paper-actions">
                        <button class="btn btn-small btn-primary" data-action="start">开始考试</button>
                        <button class="btn btn-small" data-action="edit">编辑</button>
                        <button class="btn btn-small btn-danger" data-action="delete">删除</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderExamEditor(container, paper, mockExam) {
    const strokes = mockExam.getVisibleStrokes(paper.id);
    const settings = mockExam.getData().settings;

    container.innerHTML = `
        <div class="exam-editor">
            <div class="editor-header">
                <div class="paper-title">${paper.name}</div>
                <div class="editor-actions">
                    <button class="btn btn-secondary" id="undoBtn">↶ 撤销</button>
                    <button class="btn btn-secondary" id="redoBtn">↷ 重做</button>
                    <button class="btn btn-secondary" id="clearCanvasBtn">🗑️ 清空</button>
                    <button class="btn btn-primary" id="submitExamBtn">✓ 交卷</button>
                    <button class="btn btn-secondary" id="backToPapersBtn">返回</button>
                </div>
            </div>

            <div class="drawing-toolbar">
                <div class="tool-group">
                    <label>笔型:</label>
                    <select id="penTypeSelect">
                        <option value="pen" ${settings.penType === 'pen' ? 'selected' : ''}>钢笔</option>
                        <option value="marker" ${settings.penType === 'marker' ? 'selected' : ''}>马克笔</option>
                        <option value="highlighter" ${settings.penType === 'highlighter' ? 'selected' : ''}>荧光笔</option>
                    </select>
                </div>
                <div class="tool-group">
                    <label>颜色:</label>
                    <div class="color-picker">
                        ${mockExam.getColorPresets().map(c => `
                            <button class="color-btn ${settings.penColor === c ? 'active' : ''}" 
                                    data-color="${c}" style="background: ${c};"></button>
                        `).join('')}
                    </div>
                </div>
                <div class="tool-group">
                    <label>粗细:</label>
                    <input type="range" id="penSizeRange" min="1" max="20" value="${settings.penSize}">
                    <span id="penSizeValue">${settings.penSize}px</span>
                </div>
                <div class="tool-group">
                    <button class="btn btn-small ${settings.penType === 'eraser' ? 'active' : ''}" id="eraserBtn">🧽 橡皮擦</button>
                </div>
            </div>

            <div class="paper-canvas-container">
                <div class="paper-canvas-wrapper">
                    ${paper.image ? `<img src="${paper.image}" class="paper-bg-image">` : renderPaperContent(paper)}
                    <canvas id="drawingCanvas" width="800" height="1200"></canvas>
                </div>
            </div>
        </div>
    `;

    initCanvas(container, paper.id, mockExam);
    bindEditorEvents(container, paper.id, mockExam);
}

function renderPaperContent(paper) {
    let html = '<div class="paper-content">';
    html += '<div class="paper-header">';
    html += `<h1>${paper.name}</h1>`;
    html += '<div class="paper-info-bar">姓名: ________ 学号: ________ 得分: ________</div>';
    html += '</div>';

    paper.questions.forEach(q => {
        html += `<div class="question-section">`;
        html += `<h2 class="question-title">${q.title}</h2>`;

        q.items.forEach(item => {
            html += `<div class="question-item" data-no="${item.no}">`;
            html += `<div class="question-text">${item.no}. ${item.text}</div>`;

            if (q.type === 'choice' && item.options) {
                html += '<div class="choice-options">';
                item.options.forEach(opt => {
                    html += `<div class="choice-option">${opt}</div>`;
                });
                html += '</div>';
            }

            html += `<div class="answer-area" data-no="${item.no}" 
                      style="top: ${item.answerArea.y}px; left: ${item.answerArea.x}px; 
                             width: ${item.answerArea.width}px; height: ${item.answerArea.height}px;">`;
            html += '<div class="answer-area-label">答题区</div>';
            html += '</div>';
            html += '</div>';
        });

        html += '</div>';
    });

    html += '</div>';
    return html;
}

function initCanvas(container, paperId, mockExam) {
    const canvas = container.querySelector('#drawingCanvas');
    if (!canvas) return;

    examState.canvas = canvas;
    examState.ctx = canvas.getContext('2d');
    examState.ctx.lineCap = 'round';
    examState.ctx.lineJoin = 'round';

    // 重绘已有笔画
    redrawStrokes(paperId, mockExam);

    // 绑定绘图事件
    bindDrawingEvents(container, paperId, mockExam);
}

function bindDrawingEvents(container, paperId, mockExam) {
    const canvas = examState.canvas;
    const settings = mockExam.getData().settings;

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) / examState.scale,
            y: (clientY - rect.top) / examState.scale
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        examState.isDrawing = true;
        const pos = getPos(e);
        examState.currentStroke = [{
            x: pos.x, y: pos.y,
            color: settings.penType === 'eraser' ? '#ffffff' : settings.penColor,
            size: settings.penType === 'eraser' ? settings.penSize * 3 : settings.penSize,
            opacity: settings.penType === 'eraser' ? 1 : mockExam.getPenConfig(settings.penType).opacity
        }];

        examState.ctx.beginPath();
        examState.ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!examState.isDrawing) return;
        e.preventDefault();

        const pos = getPos(e);
        const point = {
            x: pos.x, y: pos.y,
            color: settings.penType === 'eraser' ? '#ffffff' : settings.penColor,
            size: settings.penType === 'eraser' ? settings.penSize * 3 : settings.penSize,
            opacity: settings.penType === 'eraser' ? 1 : mockExam.getPenConfig(settings.penType).opacity
        };
        examState.currentStroke.push(point);

        const lastPoint = examState.currentStroke[examState.currentStroke.length - 2];
        if (lastPoint) {
            examState.ctx.strokeStyle = point.color;
            examState.ctx.lineWidth = point.size;
            examState.ctx.globalAlpha = point.opacity;
            examState.ctx.beginPath();
            examState.ctx.moveTo(lastPoint.x, lastPoint.y);
            examState.ctx.lineTo(point.x, point.y);
            examState.ctx.stroke();
        }
    };

    const stopDrawing = (e) => {
        if (!examState.isDrawing) return;
        examState.isDrawing = false;

        if (examState.currentStroke.length > 1) {
            mockExam.saveStroke(paperId, [...examState.currentStroke]);
        }
        examState.currentStroke = [];
        examState.ctx.globalAlpha = 1;
    };

    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // 触摸事件
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
}

function redrawStrokes(paperId, mockExam) {
    const ctx = examState.ctx;
    if (!ctx) return;

    ctx.clearRect(0, 0, examState.canvas.width, examState.canvas.height);

    const strokes = mockExam.getVisibleStrokes(paperId);
    strokes.forEach(stroke => {
        if (stroke.length < 2) return;

        ctx.strokeStyle = stroke[0].color;
        ctx.lineWidth = stroke[0].size;
        ctx.globalAlpha = stroke[0].opacity;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);

        for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
    });

    ctx.globalAlpha = 1;
}

function bindExamEvents(container, mockExam, mockExamModule) {
    // 返回首页
    container.querySelector('#backFromExamBtn')?.addEventListener('click', () => {
        renderModules(container);
    });

    // 新建试卷
    container.querySelector('#createPaperBtn')?.addEventListener('click', () => {
        showCreatePaperModal(container, mockExam);
    });

    // 快速创建
    container.querySelector('#quickCreatePaper')?.addEventListener('click', () => {
        const paper = mockExam.createPaper('JavaScript 基础测试卷');
        renderExamEditor(container, paper, mockExam);
    });

    // 拍照上传
    container.querySelector('#uploadPaperBtn')?.addEventListener('click', () => {
        container.querySelector('#cameraInput').click();
    });

    container.querySelector('#cameraInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const paper = mockExam.createPaperFromImage('上传的试卷', event.target.result);
                renderExamEditor(container, paper, mockExam);
            };
            reader.readAsDataURL(file);
        }
    });

    // 试卷卡片操作
    container.querySelectorAll('.paper-card').forEach(card => {
        const id = card.dataset.id;

        card.querySelector('[data-action="start"]')?.addEventListener('click', () => {
            const paper = mockExam.getPaperById(id);
            if (paper) {
                mockExam.startExam(id);
                renderExamEditor(container, paper, mockExam);
            }
        });

        card.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
            const paper = mockExam.getPaperById(id);
            if (paper) {
                renderExamEditor(container, paper, mockExam);
            }
        });

        card.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            if (confirm('确定要删除这份试卷吗？')) {
                mockExam.deletePaper(id);
                renderMockExam(container);
            }
        });
    });

    // Tab切换
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.tab === 'history') {
                renderExamHistory(container, mockExam.getExamHistory());
            } else {
                const papers = mockExam.getAllPapers();
                container.querySelector('#examContent').innerHTML =
                    papers.length === 0 ? renderEmptyPapers() : renderPapersList(papers);
                bindExamEvents(container, mockExam, mockExamModule);
            }
        });
    });
}

function bindEditorEvents(container, paperId, mockExam) {
    // 返回试卷列表
    container.querySelector('#backToPapersBtn')?.addEventListener('click', () => {
        renderMockExam(container);
    });

    // 撤销
    container.querySelector('#undoBtn')?.addEventListener('click', () => {
        mockExam.undoStroke(paperId);
        redrawStrokes(paperId, mockExam);
    });

    // 重做
    container.querySelector('#redoBtn')?.addEventListener('click', () => {
        mockExam.redoStroke(paperId);
        redrawStrokes(paperId, mockExam);
    });

    // 清空画布
    container.querySelector('#clearCanvasBtn')?.addEventListener('click', () => {
        if (confirm('确定要清空所有笔迹吗？')) {
            mockExam.clearCanvas(paperId);
            redrawStrokes(paperId, mockExam);
        }
    });

    // 交卷
    container.querySelector('#submitExamBtn')?.addEventListener('click', () => {
        if (confirm('确定要交卷吗？提交后将无法修改。')) {
            const exam = mockExam.submitExam(mockExam.getData().currentExamId);
            showExamResult(container, exam, mockExam);
        }
    });

    // 笔型切换
    container.querySelector('#penTypeSelect')?.addEventListener('change', (e) => {
        mockExam.updatePenSettings({ penType: e.target.value });
    });

    // 粗细调节
    container.querySelector('#penSizeRange')?.addEventListener('input', (e) => {
        const size = e.target.value;
        container.querySelector('#penSizeValue').textContent = size + 'px';
        mockExam.updatePenSettings({ penSize: parseInt(size) });
    });

    // 颜色选择
    container.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mockExam.updatePenSettings({ penColor: btn.dataset.color });
        });
    });

    // 橡皮擦
    container.querySelector('#eraserBtn')?.addEventListener('click', (e) => {
        const btn = e.target;
        const isEraser = btn.classList.toggle('active');
        mockExam.updatePenSettings({ penType: isEraser ? 'eraser' : 'pen' });
    });
}

function renderExamHistory(container, exams) {
    const content = container.querySelector('#examContent');

    if (exams.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h3>还没有考试记录</h3>
                <p>开始一场模拟考试，记录你的学习历程</p>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="exam-history-list">
            ${exams.map(e => `
                <div class="exam-history-item">
                    <div class="exam-score">
                        <div class="score-value">${e.score ?? '--'}</div>
                        <div class="score-label">得分</div>
                    </div>
                    <div class="exam-info">
                        <h4>${e.paperName || '模拟考试'}</h4>
                        <div class="exam-meta">
                            <span>开始: ${new Date(e.startTime).toLocaleString()}</span>
                            <span>状态: ${e.status === 'submitted' ? '已提交' : '进行中'}</span>
                        </div>
                    </div>
                    <div class="exam-actions">
                        ${e.status === 'ongoing' ? `<button class="btn btn-small btn-primary" data-id="${e.id}" data-action="continue">继续考试</button>` : ''}
                        <button class="btn btn-small" data-id="${e.id}" data-action="view">查看详情</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showExamResult(container, exam, mockExam) {
    const paper = mockExam.getPaperById(exam.paperId);

    container.innerHTML = `
        <div class="exam-result">
            <div class="result-header">
                <h2>🎉 考试完成！</h2>
                <div class="result-score">
                    <div class="score-circle">
                        <span class="score-value">${exam.score}</span>
                        <span class="score-unit">分</span>
                    </div>
                    <div class="score-detail">
                        <p>正确: ${exam.totalScore} / ${exam.maxScore}</p>
                        <p>用时: ${Math.round((new Date(exam.endTime) - new Date(exam.startTime)) / 60000)} 分钟</p>
                    </div>
                </div>
            </div>

            <div class="result-actions">
                <button class="btn btn-primary" id="backToPapersFromResult">返回试卷列表</button>
                <button class="btn btn-secondary" id="reviewPaperBtn">查看试卷</button>
            </div>
        </div>
    `;

    container.querySelector('#backToPapersFromResult')?.addEventListener('click', () => {
        renderMockExam(container);
    });

    container.querySelector('#reviewPaperBtn')?.addEventListener('click', () => {
        if (paper) {
            renderExamEditor(container, paper, mockExam);
        }
    });
}

function showCreatePaperModal(container, mockExam) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📝 新建试卷</h3>
                <button class="close-btn" id="closePaperModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>试卷名称</label>
                    <input type="text" id="paperNameInput" placeholder="输入试卷名称...">
                </div>
                <div class="form-group">
                    <label>试卷类型</label>
                    <select id="paperTypeSelect">
                        <option value="standard">标准试卷（含题目）</option>
                        <option value="blank">空白试卷（仅答题区）</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelPaperBtn">取消</button>
                <button class="btn btn-primary" id="confirmCreatePaperBtn">创建试卷</button>
            </div>
        </div>
    `;

    container.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('#closePaperModal').addEventListener('click', closeModal);
    modal.querySelector('#cancelPaperBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.querySelector('#confirmCreatePaperBtn').addEventListener('click', () => {
        const name = modal.querySelector('#paperNameInput').value.trim() || '未命名试卷';
        const type = modal.querySelector('#paperTypeSelect').value;

        const paper = mockExam.createPaper(name, { type });
        closeModal();
        renderExamEditor(container, paper, mockExam);
    });
}


// 数据备份管理器
function showBackupManager(container) {
    import('./modules/my-center.js').then((myCenterModule) => {
        const myCenter = myCenterModule.default;
        const backups = myCenter.getAllBackups();

        container.innerHTML = `
            <div class="backup-manager">
                <div class="module-header">
                    <h2>📤 数据备份与恢复</h2>
                    <p>保护你的学习数据，随时可以恢复</p>
                </div>

                <div class="backup-toolbar">
                    <button class="btn btn-primary" id="createBackupBtn">+ 创建备份</button>
                    <button class="btn btn-secondary" id="exportAllBtn">导出全部数据</button>
                    <label class="btn btn-secondary">
                        导入备份
                        <input type="file" id="importBackupInput" accept=".json" style="display: none;">
                    </label>
                    <button class="btn btn-secondary" id="backFromBackupBtn">返回</button>
                </div>

                <div class="backup-list">
                    ${backups.length === 0 ? renderEmptyBackups() : renderBackupList(backups)}
                </div>
            </div>
        `;

        bindBackupEvents(container, myCenter);
    });
}

function renderEmptyBackups() {
    return `
        <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>还没有备份</h3>
            <p>创建你的第一个备份，保护学习数据不丢失</p>
        </div>
    `;
}

function renderBackupList(backups) {
    return `
        <div class="backup-items">
            ${backups.map((b, index) => `
                <div class="backup-item">
                    <div class="backup-icon">${index === 0 ? '✅' : '📦'}</div>
                    <div class="backup-info">
                        <h4>${b.description}</h4>
                        <div class="backup-meta">
                            <span>创建时间: ${new Date(b.createdAt).toLocaleString()}</span>
                            <span>ID: ${b.id.slice(-8)}</span>
                        </div>
                    </div>
                    <div class="backup-actions">
                        <button class="btn btn-small" data-action="restore" data-id="${b.id}">恢复</button>
                        <button class="btn btn-small btn-danger" data-action="delete" data-id="${b.id}">删除</button>
                        <button class="btn btn-small" data-action="download" data-id="${b.id}">下载</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function bindBackupEvents(container, myCenter) {
    // 返回
    container.querySelector('#backFromBackupBtn')?.addEventListener('click', () => {
        renderMyCenter(container);
    });

    // 创建备份
    container.querySelector('#createBackupBtn')?.addEventListener('click', () => {
        const desc = prompt('请输入备份描述（可选）:', '手动备份');
        if (desc !== null) {
            myCenter.createBackupPoint(desc || '手动备份');
            showBackupManager(container);
        }
    });

    // 导出全部数据
    container.querySelector('#exportAllBtn')?.addEventListener('click', () => {
        myCenter.exportAllUserData();
    });

    // 导入备份
    container.querySelector('#importBackupInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (confirm('确定要导入这份备份吗？这将覆盖当前数据。')) {
                        myCenter.importUserData(data);
                        showBackupManager(container);
                    }
                } catch (err) {
                    alert('文件格式错误，请选择有效的JSON备份文件');
                }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    });

    // 备份操作
    container.querySelectorAll('.backup-item [data-action="restore"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('确定要恢复到这个备份吗？当前数据将被覆盖。')) {
                myCenter.restoreFromBackup(btn.dataset.id);
                showBackupManager(container);
            }
        });
    });

    container.querySelectorAll('.backup-item [data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('确定要删除这个备份吗？')) {
                myCenter.deleteBackup(btn.dataset.id);
                showBackupManager(container);
            }
        });
    });

    container.querySelectorAll('.backup-item [data-action="download"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const backups = myCenter.getAllBackups();
            const backup = backups.find(b => b.id === btn.dataset.id);
            if (backup) {
                const jsonStr = JSON.stringify(backup, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `认知训练-备份-${new Date(backup.createdAt).toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    });
}

// 渲染资源播放器
function renderMediaPlayer(container, resource, library) {
    const isVideo = resource.type === 'video';
    const mediaUrl = resource.videoUrl || resource.audioUrl || '';
    
    const playerHtml = `
        <div class="media-player-container">
            <div class="player-wrapper">
                ${isVideo ? `
                    <video id="mediaPlayer" class="media-player" controls poster="${resource.thumbnail || ''}" preload="metadata">
                        <source src="${mediaUrl}" type="video/mp4">
                        您的浏览器不支持视频播放
                    </video>
                ` : `
                    <div class="audio-player-wrapper">
                        <div class="audio-cover">${resource.cover || '🎵'}</div>
                        <audio id="mediaPlayer" class="media-player" controls preload="metadata">
                            <source src="${mediaUrl}" type="audio/mpeg">
                            您的浏览器不支持音频播放
                        </audio>
                    </div>
                `}
            </div>
            
            <div class="player-controls">
                <div class="player-progress">
                    <div class="progress-bar" id="progressBar">
                        <div class="progress-fill" id="progressFill"></div>
                        <div class="progress-handle" id="progressHandle"></div>
                    </div>
                    <div class="time-display">
                        <span id="currentTime">0:00</span>
                        <span>/</span>
                        <span id="totalTime">${resource.duration || '0:00'}</span>
                    </div>
                </div>
                
                <div class="control-buttons">
                    <button class="control-btn" id="rewindBtn" title="后退10秒">⏮</button>
                    <button class="control-btn play-btn" id="playPauseBtn" title="播放/暂停">▶</button>
                    <button class="control-btn" id="forwardBtn" title="前进10秒">⏭</button>
                    <div class="volume-control">
                        <button class="control-btn" id="volumeBtn" title="音量">🔊</button>
                        <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="1" class="volume-slider">
                    </div>
                    ${isVideo ? `<button class="control-btn" id="fullscreenBtn" title="全屏">⛶</button>` : ''}
                    <button class="control-btn" id="speedBtn" title="播放速度">1x</button>
                </div>
            </div>
            
            <div class="player-info">
                <h3 class="player-title">${resource.title}</h3>
                <div class="player-meta">
                    <span>${resource.author || '未知作者'}</span>
                    <span>${isVideo ? `👁 ${resource.viewCount?.toLocaleString() || 0}` : `▶ ${resource.playCount?.toLocaleString() || 0}`}</span>
                    <span>⏱ ${resource.duration || ''}</span>
                </div>
            </div>
            
            <div class="player-actions">
                <button class="btn btn-secondary" id="addToFavBtn">${library.isFavorite(resource.id) ? '❤️ 已收藏' : '🤍 收藏'}</button>
                <button class="btn btn-secondary" id="addToPlaylistBtn">📋 添加到播放列表</button>
                <button class="btn btn-secondary" id="shareBtn">🔗 分享</button>
            </div>
            
            <div class="resource-description">
                <h4>简介</h4>
                <p>${resource.desc || '暂无简介'}</p>
            </div>
        </div>
    `;
    
    container.innerHTML = playerHtml;
    bindPlayerEvents(container, resource, library, isVideo);
}

// 绑定播放器事件
function bindPlayerEvents(container, resource, library, isVideo) {
    const player = container.querySelector('#mediaPlayer');
    const playPauseBtn = container.querySelector('#playPauseBtn');
    const progressBar = container.querySelector('#progressBar');
    const progressFill = container.querySelector('#progressFill');
    const progressHandle = container.querySelector('#progressHandle');
    const currentTimeEl = container.querySelector('#currentTime');
    const totalTimeEl = container.querySelector('#totalTime');
    const rewindBtn = container.querySelector('#rewindBtn');
    const forwardBtn = container.querySelector('#forwardBtn');
    const volumeBtn = container.querySelector('#volumeBtn');
    const volumeSlider = container.querySelector('#volumeSlider');
    const speedBtn = container.querySelector('#speedBtn');
    const fullscreenBtn = container.querySelector('#fullscreenBtn');
    const addToFavBtn = container.querySelector('#addToFavBtn');
    
    if (!player) return;
    
    // 恢复播放进度
    const savedProgress = library.getPlayProgress(resource.id);
    if (savedProgress > 0) {
        player.currentTime = savedProgress;
    }
    
    // 播放/暂停
    playPauseBtn?.addEventListener('click', () => {
        if (player.paused) {
            player.play();
            library.incrementPlayCount(resource.id);
        } else {
            player.pause();
        }
    });
    
    player.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸';
    });
    
    player.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶';
    });
    
    // 时间更新
    player.addEventListener('timeupdate', () => {
        const percent = (player.currentTime / player.duration) * 100;
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(player.currentTime);
        
        // 每10秒记录一次进度
        if (Math.floor(player.currentTime) % 10 === 0) {
            library.recordPlay(resource.id, player.currentTime, player.duration);
        }
    });
    
    player.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(player.duration);
    });
    
    // 进度条点击
    progressBar?.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        player.currentTime = percent * player.duration;
    });
    
    // 快进快退
    rewindBtn?.addEventListener('click', () => {
        player.currentTime = Math.max(0, player.currentTime - 10);
    });
    
    forwardBtn?.addEventListener('click', () => {
        player.currentTime = Math.min(player.duration, player.currentTime + 10);
    });
    
    // 音量控制
    volumeSlider?.addEventListener('input', (e) => {
        player.volume = e.target.value;
        updateVolumeIcon(volumeBtn, e.target.value);
    });
    
    volumeBtn?.addEventListener('click', () => {
        player.muted = !player.muted;
        volumeSlider.value = player.muted ? 0 : player.volume || 1;
        updateVolumeIcon(volumeBtn, player.muted ? 0 : player.volume);
    });
    
    // 播放速度
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    let speedIndex = 2;
    
    speedBtn?.addEventListener('click', () => {
        speedIndex = (speedIndex + 1) % speeds.length;
        player.playbackRate = speeds[speedIndex];
        speedBtn.textContent = speeds[speedIndex] + 'x';
    });
    
    // 全屏
    fullscreenBtn?.addEventListener('click', () => {
        const wrapper = container.querySelector('.player-wrapper');
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.webkitRequestFullscreen) {
            wrapper.webkitRequestFullscreen();
        }
    });
    
    // 收藏
    addToFavBtn?.addEventListener('click', () => {
        if (library.isFavorite(resource.id)) {
            library.removeFromFavorites(resource.id);
            addToFavBtn.textContent = '🤍 收藏';
        } else {
            library.addToFavorites(resource.id);
            addToFavBtn.textContent = '❤️ 已收藏';
        }
    });
    
    // 添加到播放列表
    container.querySelector('#addToPlaylistBtn')?.addEventListener('click', () => {
        showPlaylistSelector(container, resource, library);
    });
    
    // 分享
    container.querySelector('#shareBtn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.desc,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('链接已复制到剪贴板');
            });
        }
    });
    
    // 播放结束
    player.addEventListener('ended', () => {
        library.recordPlay(resource.id, player.duration, player.duration);
    });
}

function updateVolumeIcon(btn, volume) {
    if (!btn) return;
    if (volume === 0) {
        btn.textContent = '🔇';
    } else if (volume < 0.5) {
        btn.textContent = '🔉';
    } else {
        btn.textContent = '🔊';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 播放列表选择器
function showPlaylistSelector(container, resource, library) {
    const playlists = library.getPlaylists();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content playlist-modal">
            <div class="modal-header">
                <h3>📋 添加到播放列表</h3>
                <button class="close-btn" id="closePlaylistModal">✕</button>
            </div>
            <div class="modal-body">
                <div class="create-playlist">
                    <button class="btn btn-primary btn-block" id="createNewPlaylistBtn">+ 新建播放列表</button>
                </div>
                <div class="playlist-list">
                    ${playlists.length === 0 ? `
                        <div class="empty-playlists">
                            <p>还没有播放列表，创建一个吧！</p>
                        </div>
                    ` : playlists.map(p => `
                        <div class="playlist-item">
                            <div class="playlist-info">
                                <h4>${p.name}</h4>
                                <span>${p.items.length} 个内容</span>
                            </div>
                            <button class="btn btn-small" data-id="${p.id}">
                                ${p.items.includes(resource.id) ? '✓ 已添加' : '添加'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    
    // 关闭
    modal.querySelector('#closePlaylistModal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // 新建播放列表
    modal.querySelector('#createNewPlaylistBtn').addEventListener('click', () => {
        const name = prompt('请输入播放列表名称:');
        if (name?.trim()) {
            const playlist = library.createPlaylist(name.trim());
            library.addToPlaylist(playlist.id, resource.id);
            showToast('已添加到新播放列表');
            modal.remove();
        }
    });
    
    // 添加到现有播放列表
    modal.querySelectorAll('.playlist-item button').forEach(btn => {
        btn.addEventListener('click', () => {
            const playlistId = btn.dataset.id;
            const playlists = library.getPlaylists();
            const playlist = playlists.find(p => p.id === playlistId);
            
            if (playlist?.items.includes(resource.id)) {
                library.removeFromPlaylist(playlistId, resource.id);
                showToast('已从播放列表移除');
            } else {
                library.addToPlaylist(playlistId, resource.id);
                showToast('已添加到播放列表');
            }
            
            btn.textContent = playlist?.items.includes(resource.id) ? '添加' : '✓ 已添加';
        });
    });
}

// ==================== 母题库模块UI ====================
export async function renderQuestionBank(container) {
    const { default: questionBank } = await import('./src/modules/question-bank.js');
    
    const categories = questionBank.getKnowledgePoints();
    const stats = questionBank.getStats();
    const categoryStats = questionBank.getCategoryStats();
    const masterQuestions = questionBank.getMasterQuestions();
    const dailyRecs = questionBank.getDailyRecommendations();
    
    container.innerHTML = `
        <div class="question-bank-container">
            <div class="module-header">
                <h2>📚 母题库</h2>
                <p>系统化认知训练，掌握一题，会做一类</p>
            </div>
            
            <!-- 统计概览 -->
            <div class="stats-overview">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAnswered}</div>
                    <div class="stat-label">已做题目</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.accuracy}%</div>
                    <div class="stat-label">正确率</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${masterQuestions.length}</div>
                    <div class="stat-label">母题数量</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Object.keys(categories).length}</div>
                    <div class="stat-label">知识类型</div>
                </div>
            </div>
            
            <!-- 今日推荐 -->
            <div class="section-card">
                <div class="section-title">
                    <span>🎯 今日推荐</span>
                    <span class="badge">${dailyRecs.length}题</span>
                </div>
                <div class="question-list">
                    ${dailyRecs.map(q => `
                        <div class="question-item" data-id="${q.id}">
                            <div class="question-icon">${categories[q.category]?.icon || '❓'}</div>
                            <div class="question-info">
                                <h4>${q.title}</h4>
                                <div class="question-meta">
                                    <span class="difficulty-badge" style="background: ${questionBank.getDifficultyConfig()[q.difficulty]?.color || '#666'}">
                                        ${questionBank.getDifficultyConfig()[q.difficulty]?.name || q.difficulty}
                                    </span>
                                    <span>${q.points}分</span>
                                </div>
                            </div>
                            <div class="question-action">
                                <button class="btn btn-primary btn-small" data-action="start">开始练习</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 分类导航 -->
            <div class="category-grid">
                ${Object.values(categories).map(cat => `
                    <div class="category-card" data-category="${cat.id}">
                        <div class="category-icon">${cat.icon}</div>
                        <div class="category-name">${cat.name}</div>
                        <div class="category-progress">
                            <div class="progress-bar-small">
                                <div class="progress-fill" style="width: ${categoryStats[cat.id]?.progress || 0}%"></div>
                            </div>
                            <span>${categoryStats[cat.id]?.progress || 0}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定事件
    container.querySelectorAll('[data-action="start"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.question-item');
            const questionId = item.dataset.id;
            showQuestionDetail(container, questionId, questionBank);
        });
    });
    
    container.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showCategoryQuestions(container, category, questionBank);
        });
    });
}

function showQuestionDetail(container, questionId, questionBank) {
    const question = questionBank.getQuestionById(questionId);
    const categories = questionBank.getKnowledgePoints();
    const variants = questionBank.getVariants(questionId);
    const progress = questionBank.getQuestionProgress(questionId);
    const mastery = questionBank.getMasteryLevel(questionId);
    
    container.innerHTML = `
        <div class="question-detail">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <div class="detail-title">
                    <span class="category-icon">${categories[question.category]?.icon}</span>
                    <h2>${question.title}</h2>
                </div>
                <div class="detail-actions">
                    <button class="btn ${questionBank.isFavorite(questionId) ? 'btn-warning' : 'btn-secondary'}" id="favBtn">
                        ${questionBank.isFavorite(questionId) ? '⭐ 已收藏' : '☆ 收藏'}
                    </button>
                </div>
            </div>
            
            <div class="question-content">
                <div class="question-statement">
                    <h3>题目</h3>
                    <p>${question.question}</p>
                </div>
                
                ${question.content?.sequence ? `
                <div class="sequence-display">
                    ${question.content.sequence.map(n => `
                        <span class="sequence-item ${n === '?' ? 'highlight' : ''}">${n}</span>
                    `).join('')}
                </div>
                ` : ''}
                
                ${question.content?.numbers ? `
                <div class="number-grid">
                    ${question.content.numbers.map(n => `
                        <span class="number-cell">${n}</span>
                    `).join('')}
                </div>
                ` : ''}
                
                ${question.content?.options ? `
                <div class="options-list">
                    ${question.content.options.map((opt, i) => `
                        <div class="option-item" data-answer="${opt}">
                            <span class="option-label">${String.fromCharCode(65 + i)}</span>
                            <span class="option-text">${opt}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div class="question-meta-info">
                    <span>⏱️ 限时: ${Math.floor(question.timeLimit / 60)}分钟</span>
                    <span>⭐ ${question.points}分</span>
                    <span>📊 掌握度: ${'★'.repeat(mastery)}${'☆'.repeat(5-mastery)}</span>
                </div>
            </div>
            
            ${variants.length > 0 ? `
            <div class="variants-section">
                <h3>🔀 变式题目（${variants.length}个变式）</h3>
                <div class="variants-list">
                    ${variants.slice(0, 5).map(v => `
                        <div class="variant-item">
                            <span class="variant-title">${v.title}</span>
                            <span class="variant-difficulty ${v.difficulty === 'easy' ? 'easy' : v.difficulty === 'hard' ? 'hard' : ''}">${v.difficulty}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="tips-section">
                <h3>💡 解题提示</h3>
                ${question.tips ? question.tips.map(tip => `<p>• ${tip}</p>`).join('') : '<p>暂无提示</p>'}
            </div>
            
            <div class="start-btn-container">
                <button id="startPracticeBtn" class="btn btn-primary">开始练习</button>
            </div>
        </div>
    `;
    
    // 绑定事件
    container.querySelector('[data-action="back"]')?.addEventListener('click', () => {
        renderQuestionBank(container);
    });
    
    // 收藏按钮
    container.querySelector('#favBtn')?.addEventListener('click', () => {
        if (questionBank.isFavorite(questionId)) {
            questionBank.removeFromFavorites(questionId);
        } else {
            questionBank.addToFavorites(questionId);
        }
        showQuestionDetail(container, questionId, questionBank);
    });
}

function showCategoryQuestions(container, category, questionBank) {
    const categories = questionBank.getKnowledgePoints();
    const questions = questionBank.getQuestionsByCategory(category, false);
    
    container.innerHTML = `
        <div class="category-questions">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <h2>${categories[category]?.name || category}</h2>
            </div>
            
            <div class="question-list">
                ${questions.map(q => `
                    <div class="question-item" data-id="${q.id}">
                        <div class="question-icon">📝</div>
                        <div class="question-info">
                            <h4>${q.title}</h4>
                            <div class="question-meta">
                                <span class="difficulty-badge">${questionBank.getDifficultyConfig()[q.difficulty]?.name || q.difficulty}</span>
                                <span>${q.points}分</span>
                                <span>${q.variants?.length || 0}个变式</span>
                            </div>
                        </div>
                        <button class="btn btn-small btn-primary">开始练习</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderQuestionBank(container);
    });
}

// ==================== 学霸方法模块UI ====================
export async function renderMethod(container) {
    const { default: method } = await import('./src/modules/method.js');
    
    const categories = method.getCategories();
    const stats = method.getLearningStats();
    const popular = method.getPopularMethods(6);
    const dailyRec = method.getDailyRecommendation();
    
    container.innerHTML = `
        <div class="method-container">
            <div class="module-header">
                <h2>🎓 学霸方法</h2>
                <p>掌握高效学习方法，让学习事半功倍</p>
            </div>
            
            <!-- 学习进度概览 -->
            <div class="stats-overview">
                <div class="stat-card">
                    <div class="stat-value">${stats.completed}/${stats.total}</div>
                    <div class="stat-label">已学方法</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.progress}%</div>
                    <div class="stat-label">学习进度</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.floor(stats.totalPracticeTime / 60)}h</div>
                    <div class="stat-label">练习时长</div>
                </div>
            </div>
            
            <!-- 今日推荐 -->
            ${dailyRec ? `
            <div class="section-card">
                <div class="section-title">
                    <span>今日推荐</span>
                </div>
                <div class="recommendation-card">
                    <div class="rec-icon">${dailyRec.icon}</div>
                    <div class="rec-content">
                        <h3>${dailyRec.title}</h3>
                        <p class="rec-subtitle">${dailyRec.subtitle}</p>
                        <p class="rec-summary">${dailyRec.summary}</p>
                        <div class="rec-meta">
                            <span>⏱️ 学习时间: ${dailyRec.learnTime}</span>
                            <span>⭐ 效果: ${'★'.repeat(dailyRec.effectiveness)}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" data-id="${dailyRec.id}" data-action="learn">
                        开始学习
                    </button>
                </div>
            </div>
            ` : ''}
            
            <!-- 分类导航 -->
            <div class="category-tabs">
                ${Object.values(categories).map(cat => `
                    <button class="tab-btn" data-category="${cat.id}">
                        ${cat.icon} ${cat.name}
                    </button>
                `).join('')}
            </div>
            
            <!-- 热门方法展示 -->
            <div class="methods-grid">
                ${popular.map(m => `
                    <div class="method-card" data-id="${m.id}">
                        <div class="method-icon">${m.icon}</div>
                        <div class="method-info">
                            <h4>${m.title}</h4>
                            <p class="method-subtitle">${m.subtitle}</p>
                            <div class="method-meta">
                                <span class="author">👤 ${m.author}</span>
                                <span class="time">⏱️ ${m.learnTime}</span>
                                <span class="difficulty">
                                    ${m.level === 'beginner' ? '🟢' : m.level === 'intermediate' ? '🟡' : '🔴'}
                                    ${m.level === 'beginner' ? '入门' : m.level === 'intermediate' ? '进阶' : '高级'}
                                </span>
                            </div>
                            <div class="method-stats">
                                <span>效果: ${'★'.repeat(m.effectiveness)}${'☆'.repeat(5 - m.effectiveness)}</span>
                            </div>
                        </div>
                        <div class="method-action">
                            ${method.getMethodProgress(m.id)?.completedAt ? 
                                '<span class="completed-badge">✅ 已完成</span>' : 
                                `<button class="btn btn-small btn-primary" data-action="learn">开始学习</button>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 绑定分类切换
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            showCategoryMethods(container, category, method);
        });
    });
    
    // 绑定学习按钮
    container.querySelectorAll('[data-action="learn"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const methodId = btn.closest('[data-id]')?.dataset.id || btn.dataset.id;
            showMethodDetail(container, methodId, method);
        });
    });
}

function showCategoryMethods(container, category, method) {
    const categories = method.getCategories();
    const methods = method.getMethodsByCategory(category);
    
    container.innerHTML = `
        <div class="category-methods">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <h2>${categories[category]?.name || category}</h2>
            </div>
            
            <div class="methods-list">
                ${methods.map(m => `
                    <div class="method-item" data-id="${m.id}">
                        <div class="method-icon">${m.icon}</div>
                        <div class="method-info">
                            <h4>${m.title}</h4>
                            <p class="method-subtitle">${m.subtitle}</p>
                            <div class="method-meta">
                                <span>👤 ${m.author}</span>
                                <span>⏱️ ${m.learnTime}</span>
                                <span>⭐ ${'★'.repeat(m.effectiveness)}${'☆'.repeat(5 - m.effectiveness)}</span>
                            </div>
                        </div>
                        <button class="btn btn-small btn-primary">查看详情</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderMethod(container);
    });
    
    container.querySelectorAll('.method-item').forEach(item => {
        item.addEventListener('click', () => {
            showMethodDetail(container, item.dataset.id, method);
        });
    });
}

function showMethodDetail(container, methodId, methodModule) {
    const m = methodModule.getMethodById(methodId);
    const progress = methodModule.getMethodProgress(methodId);
    const isFav = methodModule.isFavorite(methodId);
    
    container.innerHTML = `
        <div class="method-detail">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <div class="detail-title">
                    <span class="method-icon">${m.icon}</span>
                    <h2>${m.title}</h2>
                    <p class="method-subtitle">${m.subtitle}</p>
                </div>
                <button class="btn ${isFav ? 'btn-warning' : 'btn-secondary'}" id="favBtn">
                    ${isFav ? '⭐ 已收藏' : '☆ 收藏'}
                </button>
            </div>
            
            <div class="method-content">
                <div class="method-summary">
                    <h3>📝 方法简介</h3>
                    <p>${m.summary}</p>
                </div>
                
                <div class="method-meta-bar">
                    <span>👤 提出者: ${m.author}</span>
                    <span>⏱️ 学习时间: ${m.learnTime}</span>
                    <span>📊 效果评级: ${'★'.repeat(m.effectiveness)}${'☆'.repeat(5 - m.effectiveness)}</span>
                    <span>🎚️ 难度: ${'★'.repeat(m.difficulty)}${'☆'.repeat(5 - m.difficulty)}</span>
                </div>
                
                <div class="method-steps">
                    <h3>📋 实施步骤</h3>
                    <ol class="steps-list">
                        ${m.steps.map((step, i) => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="method-tips">
                    <h3>💡 实践要点</h3>
                    <ul>
                        ${m.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="method-examples">
                    <h3>📌 应用示例</h3>
                    ${m.examples.map(ex => `
                        <div class="example-item">
                            <strong>${ex.item}:</strong> ${ex.description}
                        </div>
                    `).join('')}
                </div>
                
                <div class="method-resources">
                    <h3>📚 学习资源</h3>
                    <ul>
                        ${m.resources.map(r => `
                            <li>${r.type === 'video' ? '🎬' : r.type === 'article' ? '📄' : '✍️'} 
                                ${r.title} (${r.duration || r.readTime || r.practiceTime})
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="method-actions">
                ${!progress?.completedAt ? `
                    <button class="btn btn-primary btn-large" id="startLearnBtn">
                        ${progress ? '继续学习' : '开始学习'}
                    </button>
                ` : `
                    <div class="completed-message">
                        ✅ 你已掌握这个方法！
                    </div>
                `}
                <button class="btn btn-secondary btn-large" id="practiceBtn">
                    📝 记录练习
                </button>
            </div>
        </div>
    `;
    
    // 绑定返回
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderMethod(container);
    });
    
    // 绑定收藏
    container.querySelector('#favBtn')?.addEventListener('click', () => {
        if (methodModule.isFavorite(methodId)) {
            methodModule.removeFromFavorites(methodId);
        } else {
            methodModule.addToFavorites(methodId);
        }
        showMethodDetail(container, methodId, methodModule);
    });
    
    // 绑定开始学习
    container.querySelector('#startLearnBtn')?.addEventListener('click', () => {
        methodModule.startLearning(methodId);
        showMethodDetail(container, methodId, methodModule);
    });
    
    // 绑定练习记录
    container.querySelector('#practiceBtn')?.addEventListener('click', () => {
        const duration = prompt('请输入练习时长（分钟）:', '30');
        if (duration && !isNaN(duration)) {
            const notes = prompt('练习心得（可选）:', '');
            methodModule.recordPractice(methodId, parseInt(duration), notes);
            alert('练习记录已保存！');
        }
    });
}

// ==================== 思维训练模块UI ====================
export async function renderThinking(container) {
    const { default: thinking } = await import('./src/modules/thinking.js');
    
    const types = thinking.getThinkingTypes();
    const stats = thinking.getStats();
    const dailyExercises = thinking.getDailyExercises();
    const abilities = thinking.getAbilityScores();
    
    container.innerHTML = `
        <div class="thinking-container">
            <div class="module-header">
                <h2>🧠 思维训练</h2>
                <p>系统化提升你的思维能力</p>
            </div>
            
            <!-- 能力概览 -->
            <div class="abilities-overview">
                <div class="ability-card overall">
                    <div class="ability-icon">🧠</div>
                    <div class="ability-info">
                        <h4>综合思维等级</h4>
                        <div class="ability-level">Lv.${stats.overallLevel}</div>
                    </div>
                    <div class="ability-score">
                        <span>最强: ${types[stats.strongest]?.name || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="abilities-grid">
                    ${Object.entries(abilities).map(([key, ab]) => `
                        <div class="ability-mini-card">
                            <span class="ability-type-icon">${types[key]?.icon || '❓'}</span>
                            <span class="ability-name">${types[key]?.name || key}</span>
                            <div class="ability-bar">
                                <div class="bar-fill" style="width: ${ab.score}%; background: ${types[key]?.color}"></div>
                            </div>
                            <span class="ability-points">${ab.score}分 (Lv.${ab.level})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 今日训练 -->
            <div class="section-card">
                <div class="section-title">
                    <span>📋 今日训练推荐</span>
                    <span class="badge">${dailyExercises.length}题</span>
                </div>
                <div class="exercise-list">
                    ${dailyExercises.map(ex => `
                        <div class="exercise-item" data-id="${ex.id}">
                            <div class="exercise-icon">🧠</div>
                            <div class="exercise-info">
                                <h4>${ex.title}</h4>
                                <div class="exercise-meta">
                                    <span class="type-badge">${types[ex.type]?.name || ex.type}</span>
                                    <span class="difficulty-badge">${ex.difficulty}</span>
                                    <span class="points">${ex.points}分</span>
                                </div>
                            </div>
                            <button class="btn btn-small btn-primary" data-action="start">开始训练</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 训练类型选择 -->
            <div class="training-types">
                <div class="section-title">🧩 选择训练类型</div>
                <div class="types-grid">
                    ${Object.values(types).map(t => `
                        <div class="type-card" data-type="${t.id}">
                            <div class="type-icon">${t.icon}</div>
                            <div class="type-name">${t.name}</div>
                            <div class="type-exercise-count">
                                ${thinking.getExercisesByType(t.id).length} 个训练
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 训练统计 -->
            <div class="stats-summary">
                <div class="stat-item">
                    <span class="stat-value">${stats.totalExercises}</span>
                    <span class="stat-label">已完成训练</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.totalPoints}</span>
                    <span class="stat-label">累计积分</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.floor(stats.totalTime / 60)}h</span>
                    <span class="stat-label">训练时长</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.streakDays}天</span>
                    <span class="stat-label">连续训练</span>
                </div>
            </div>
        </div>
    `;
    
    // 绑定开始训练
    container.querySelectorAll('[data-action="start"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.exercise-item');
            const exerciseId = item.dataset.id;
            showExerciseDetail(container, exerciseId, thinking);
        });
    });
    
    // 绑定类型选择
    container.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            showTypeExercises(container, type, thinking);
        });
    });
}

function showTypeExercises(container, type, thinking) {
    const types = thinking.getThinkingTypes();
    const exercises = thinking.getExercisesByType(type);
    
    container.innerHTML = `
        <div class="type-exercises">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <h2>${types[type]?.name || type} 训练</h2>
            </div>
            
            <div class="exercise-list full">
                ${exercises.map(ex => `
                    <div class="exercise-item large" data-id="${ex.id}">
                        <div class="exercise-header">
                            <span class="difficulty-tag ${ex.difficulty}">
                                ${ex.difficulty === 'beginner' ? '入门' : ex.difficulty === 'intermediate' ? '进阶' : 
                                  ex.difficulty === 'advanced' ? '高级' : '专家'}
                            </span>
                            <span class="points-tag">${ex.points}分</span>
                        </div>
                        <h3>${ex.title}</h3>
                        <p class="exercise-desc">${ex.description}</p>
                        <div class="exercise-footer">
                            <span>⏱️ ${Math.floor(ex.timeLimit / 60)}分钟</span>
                            <span>📝 ${ex.questions.length}个问题</span>
                            ${ex.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary">开始训练</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderThinking(container);
    });
    
    container.querySelectorAll('.exercise-item').forEach(item => {
        item.querySelector('button').addEventListener('click', () => {
            showExerciseDetail(container, item.dataset.id, thinking);
        });
    });
}

function showExerciseDetail(container, exerciseId, thinking) {
    const ex = thinking.getExerciseById(exerciseId);
    const types = thinking.getThinkingTypes();
    const progress = thinking.getExerciseProgress(exerciseId);
    
    container.innerHTML = `
        <div class="exercise-detail">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <div class="detail-title-section">
                    <span class="type-badge large">${types[ex.type]?.name || ex.type}</span>
                    <h2>${ex.title}</h2>
                    <p class="exercise-desc">${ex.description}</p>
                </div>
                <div class="detail-stats">
                    <span>⏱️ ${Math.floor(ex.timeLimit / 60)}分钟</span>
                    <span>🎯 ${ex.points}分</span>
                    ${progress ? `<span>最佳: ${progress.bestScore}分</span>` : ''}
                </div>
            </div>
            
            <div class="exercise-content">
                <div class="scenario-box">
                    <h3>📖 训练场景</h3>
                    <p>${ex.scenario}</p>
                </div>
                
                <div class="questions-box">
                    <h3>❓ 思考问题</h3>
                    <ol class="guided-questions">
                        ${ex.questions.map((q, i) => `
                            <li class="question-item">
                                <div class="question-number">${i + 1}</div>
                                <div class="question-text">${q}</div>
                                <textarea class="answer-area" placeholder="写下你的思考..." rows="3"></textarea>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                
                <div class="hints-section">
                    <details>
                        <summary>💡 需要提示吗？点击展开</summary>
                        <div class="hints-content">
                            <ul>
                                ${ex.hints.map(hint => `<li>${hint}</li>`).join('')}
                            </ul>
                        </div>
                    </details>
                </div>
                
                <div class="criteria-section">
                    <h4>📊 评分标准</h4>
                    <ul class="criteria-list">
                        ${ex.evaluationCriteria.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="exercise-actions">
                <button class="btn btn-primary btn-large" id="startExerciseBtn">
                    🚀 开始训练
                </button>
                <button class="btn btn-secondary btn-large" id="favBtn">
                    ${thinking.isFavorite(exerciseId) ? '⭐ 已收藏' : '☆ 收藏'}
                </button>
            </div>
        </div>
    `;
    
    // 绑定返回
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderThinking(container);
    });
    
    // 绑定开始训练
    container.querySelector('#startExerciseBtn')?.addEventListener('click', () => {
        const record = thinking.startExercise(exerciseId);
        showToast('开始训练！加油！');
        // 这里可以启动计时器等逻辑
    });
    
    // 绑定收藏
    container.querySelector('#favBtn')?.addEventListener('click', () => {
        if (thinking.isFavorite(exerciseId)) {
            thinking.removeFromFavorites(exerciseId);
        } else {
            thinking.addToFavorites(exerciseId);
        }
        showExerciseDetail(container, exerciseId, thinking);
    });
}

export async function renderDeepSeek(container) {
    const { default: deepseek } = await import('./src/modules/deepseek.js');
    
    const state = deepseek.getState();
    const conversations = state.conversations || [];
    const hasKey = deepseek.hasApiKey();
    
    container.innerHTML = `
        <div class="deepseek-container">
            <div class="deepseek-header">
                <div class="header-title">
                    <span class="module-icon">🤖</span>
                    <h1>DeepSeek AI 助手</h1>
                </div>
                <div class="header-actions">
                    <button class="btn btn-secondary btn-small" id="configBtn">⚙️ 设置</button>
                    <button class="btn btn-primary btn-small" id="newChatBtn">+ 新对话</button>
                </div>
            </div>
            
            <div class="deepseek-layout">
                <div class="chat-sidebar">
                    <div class="sidebar-section">
                        <h3>📋 对话历史</h3>
                        <div class="conversation-list">
                            ${conversations.length === 0 ? `
                                <div class="empty-state">
                                    <p>暂无对话</p>
                                    <p class="hint">点击右上角开始新对话</p>
                                </div>
                            ` : conversations.map(conv => `
                                <div class="conversation-item" data-id="${conv.id}">
                                    <div class="conv-title">${conv.title || '新对话'}</div>
                                    <div class="conv-meta">
                                        <span>${new Date(conv.createdAt).toLocaleDateString()}</span>
                                        <span>${conv.messages?.length || 0} 条消息</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>📊 使用统计</h3>
                        <div class="stats-card">
                            <div class="stat-item">
                                <span class="stat-label">今日请求</span>
                                <span class="stat-value">${state.stats?.requestsToday || 0}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">今日Token</span>
                                <span class="stat-value">${state.stats?.tokensToday || 0}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">总Token</span>
                                <span class="stat-value">${state.stats?.totalTokens || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-main">
                    ${!hasKey ? `
                        <div class="no-api-key-card">
                            <div class="card-icon">🔑</div>
                            <h2>需要配置 API Key</h2>
                            <p>请先在设置中配置您的 DeepSeek API Key 才能开始使用</p>
                            <button class="btn btn-primary" id="goConfigBtn">去配置 →</button>
                        </div>
                    ` : !state.currentConversation ? `
                        <div class="welcome-card">
                            <div class="welcome-icon">✨</div>
                            <h2>开始与 AI 对话</h2>
                            <p>我可以帮您解答问题、生成内容、分析数据...</p>
                            <div class="quick-actions">
                                <button class="quick-action-btn" data-question="帮我解释一个概念">💡 解释概念</button>
                                <button class="quick-action-btn" data-question="帮我生成学习计划">📚 学习计划</button>
                                <button class="quick-action-btn" data-question="帮我分析一个问题">🔍 问题分析</button>
                                <button class="quick-action-btn" data-question="帮我写一段代码">💻 代码生成</button>
                            </div>
                        </div>
                    ` : `
                        <div class="chat-window">
                            <div class="chat-header">
                                <h3>${state.currentConversation.title || '新对话'}</h3>
                            </div>
                            <div class="chat-messages" id="chatMessages">
                                ${(state.currentConversation.messages || []).map(msg => `
                                    <div class="message ${msg.role}">
                                        <div class="message-avatar">${msg.role === 'user' ? '👤' : '🤖'}</div>
                                        <div class="message-content">
                                            <div class="message-text">${msg.content}</div>
                                            ${msg.tokens ? `<div class="message-meta">${msg.tokens} tokens</div>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="chat-input-area">
                                <textarea id="messageInput" placeholder="输入您的问题..." rows="3"></textarea>
                                <div class="input-actions">
                                    <label class="file-upload-btn">
                                        📎 上传文件
                                        <input type="file" id="fileUpload" style="display: none;">
                                    </label>
                                    <button class="btn btn-primary" id="sendBtn">发送</button>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    bindDeepSeekEvents(container, deepseek);
}

function bindDeepSeekEvents(container, deepseek) {
    container.querySelector('#configBtn')?.addEventListener('click', () => {
        showDeepSeekConfig(container, deepseek);
    });
    
    container.querySelector('#goConfigBtn')?.addEventListener('click', () => {
        showDeepSeekConfig(container, deepseek);
    });
    
    container.querySelector('#newChatBtn')?.addEventListener('click', async () => {
        await deepseek.createConversation('default', '新对话');
        renderDeepSeek(container);
    });
    
    container.querySelectorAll('.conversation-item').forEach(item => {
        item.addEventListener('click', async () => {
            await deepseek.selectConversation(item.dataset.id);
            renderDeepSeek(container);
        });
    });
    
    container.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const question = btn.dataset.question;
            const conv = await deepseek.createConversation('default', question.slice(0, 20));
            renderDeepSeek(container);
        });
    });
    
    container.querySelector('#sendBtn')?.addEventListener('click', async () => {
        const input = container.querySelector('#messageInput');
        const message = input.value.trim();
        if (!message) return;
        
        const state = deepseek.getState();
        if (!state.currentConversation) {
            await deepseek.createConversation('default', message.slice(0, 20));
        }
        
        input.value = '';
        const convId = deepseek.getState().currentConversation.id;
        
        try {
            await deepseek.sendMessage(convId, message);
            renderDeepSeek(container);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
    
    container.querySelector('#messageInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            container.querySelector('#sendBtn').click();
        }
    });
}

function showDeepSeekConfig(container, deepseek) {
    const state = deepseek.getState();
    const config = state.config || {};
    
    container.innerHTML = `
        <div class="config-container">
            <div class="config-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <h1>⚙️ DeepSeek 设置</h1>
            </div>
            
            <div class="config-form">
                <div class="form-group">
                    <label>API Key</label>
                    <input type="password" id="apiKeyInput" value="${config.apiKey || ''}" placeholder="sk-xxxxxxxxxxxxxxxx">
                    <p class="hint">请在 DeepSeek 官网获取您的 API Key</p>
                </div>
                
                <div class="form-group">
                    <label>默认模型</label>
                    <select id="modelSelect">
                        <option value="deepseek-chat" ${config.model === 'deepseek-chat' ? 'selected' : ''}>deepseek-chat</option>
                        <option value="deepseek-research" ${config.model === 'deepseek-research' ? 'selected' : ''}>deepseek-research</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Temperature (${config.temperature || 0.7})</label>
                    <input type="range" id="tempRange" min="0" max="2" step="0.1" value="${config.temperature || 0.7}">
                    <div class="range-labels">
                        <span>精确</span>
                        <span>创意</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>最大 Token</label>
                    <input type="number" id="maxTokensInput" value="${config.maxTokens || 2000}" min="100" max="8000">
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" data-action="back">取消</button>
                    <button class="btn btn-primary" id="saveConfigBtn">保存设置</button>
                </div>
            </div>
        </div>
    `;
    
    container.querySelectorAll('[data-action="back"]').forEach(btn => {
        btn.addEventListener('click', () => renderDeepSeek(container));
    });
    
    container.querySelector('#saveConfigBtn').addEventListener('click', async () => {
        const apiKey = container.querySelector('#apiKeyInput').value.trim();
        const model = container.querySelector('#modelSelect').value;
        const temperature = parseFloat(container.querySelector('#tempRange').value);
        const maxTokens = parseInt(container.querySelector('#maxTokensInput').value);
        
        if (!apiKey) {
            showToast('请输入 API Key', 'error');
            return;
        }
        
        await deepseek.saveConfig('default', {
            apiKey,
            defaultModel: model,
            defaultTemperature: temperature,
            defaultMaxTokens: maxTokens
        });
        
        showToast('设置已保存！');
        renderDeepSeek(container);
    });
}

// ========== 认知训练模块渲染 ==========
export async function renderTraining(container) {
    const { default: trainingModule } = await import('./src/modules/training.js');
    
    const progress = trainingModule.getAllProgress();
    const weeks = trainingModule.getWeekPlans();
    const currentWeek = trainingModule.getCurrentWeek();
    
    container.innerHTML = `
        <div class="training-container">
            <div class="training-header">
                <div class="header-title">
                    <span class="module-icon">🧠</span>
                    <h1>认知训练计划</h1>
                </div>
                <div class="training-stats">
                    <div class="stat-badge">
                        <span class="stat-value">${progress.completedDays}/${progress.totalDays}</span>
                        <span class="stat-label">完成天数</span>
                    </div>
                    <div class="stat-badge">
                        <span class="stat-value">${Math.round(progress.completionRate)}%</span>
                        <span class="stat-label">完成率</span>
                    </div>
                </div>
            </div>
            
            <div class="weeks-grid">
                ${Object.values(weeks).map((week, index) => {
                    const weekProgress = trainingModule.getWeekProgress(week.weekId);
                    const isCurrent = week.weekId === currentWeek;
                    const isLocked = index > 0 && !trainingModule.isWeekUnlocked(week.weekId);
                    
                    return `
                        <div class="week-card ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}" data-week="${week.weekId}">
                            <div class="week-header">
                                <span class="week-number">Week${index + 1}</span>
                                <span class="week-progress">${Math.round(weekProgress.completionRate)}%</span>
                            </div>
                            <h3>${week.weekTitle.split('：')[1] || week.weekTitle}</h3>
                            <p class="week-desc">${week.weekDesc}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${weekProgress.completionRate}%"></div>
                            </div>
                            <div class="week-days">
                                ${week.days.map(day => {
                                    const dayProgress = trainingModule.getDayProgress(week.weekId, day.day);
                                    return `
                                        <div class="day-dot ${dayProgress.completed ? 'completed' : ''}" 
                                             title="Day${day.day}: ${day.title}">
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            ${isLocked ? '<div class="lock-overlay">🔒</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // 绑定周卡片点击事件
    container.querySelectorAll('.week-card:not(.locked)').forEach(card => {
        card.addEventListener('click', () => {
            showWeekDetail(container, card.dataset.week, trainingModule);
        });
    });
}

function showWeekDetail(container, weekId, trainingModule) {
    const week = trainingModule.getWeekPlan(weekId);
    const weekProgress = trainingModule.getWeekProgress(weekId);
    
    container.innerHTML = `
        <div class="week-detail-container">
            <div class="detail-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <div>
                    <h2>${week.weekTitle}</h2>
                    <p class="week-subtitle">${week.weekDesc}</p>
                </div>
            </div>
            
            <div class="days-list">
                ${week.days.map(day => {
                    const dayProgress = trainingModule.getDayProgress(weekId, day.day);
                    return `
                        <div class="day-card" data-week="${weekId}" data-day="${day.day}">
                            <div class="day-header">
                                <span class="day-number">Day ${day.day}</span>
                                ${dayProgress.completed ? '<span class="completed-badge">✅ 已完成</span>' : ''}
                            </div>
                            <h3>${day.title}</h3>
                            <div class="tasks-list">
                                ${day.tasks.map(task => {
                                    const isTaskCompleted = trainingModule.isTaskCompleted(task.id);
                                    return `
                                        <div class="task-item ${isTaskCompleted ? 'completed' : ''}" data-task="${task.id}">
                                            <span class="task-icon">${getTaskIcon(task.type)}</span>
                                            <span class="task-title">${task.title}</span>
                                            <span class="task-duration">${task.duration}min</span>
                                            ${isTaskCompleted ? '<span class="check-mark">✓</span>' : ''}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // 返回按钮
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderTraining(container);
    });
    
    // 任务点击事件
    container.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', () => {
            trainingModule.toggleTask(item.dataset.task);
            showToast('任务状态已更新！');
            showWeekDetail(container, weekId, trainingModule);
        });
    });
}

function getTaskIcon(type) {
    const icons = {
        attention: '👁️',
        memory: '🧠',
        strategy: '💡',
        quiz: '📝',
        writing: '✍️',
        podcast: '🎧',
        review: '📊',
        rest: '😴'
    };
    return icons[type] || '📌';
}

// ========== 错题本模块渲染 ==========
export async function renderWrongBook(container) {
    const { default: wrongBookModule } = await import('./src/modules/wrong-book.js');
    
    const state = wrongBookModule.getState();
    const stats = state.stats || { total: 0, today: 0, mastered: 0, toReview: 0 };
    
    container.innerHTML = `
        <div class="wrongbook-container">
            <div class="wrongbook-header">
                <div class="header-title">
                    <span class="module-icon">📚</span>
                    <h1>错题本</h1>
                </div>
            </div>
            
            <div class="stats-row">
                <div class="stat-card today">
                    <div class="stat-icon">📅</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.today}</div>
                        <div class="stat-name">今日错题</div>
                    </div>
                </div>
                <div class="stat-card review">
                    <div class="stat-icon">⏰</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.toReview}</div>
                        <div class="stat-name">待复习</div>
                    </div>
                </div>
                <div class="stat-card mastered">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.mastered}</div>
                        <div class="stat-name">已掌握</div>
                    </div>
                </div>
                <div class="stat-card total">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-name">累计错题</div>
                    </div>
                </div>
            </div>
            
            <div class="tabs-row">
                <button class="tab-btn active" data-tab="today">今日错题</button>
                <button class="tab-btn" data-tab="review">待复习</button>
                <button class="tab-btn" data-tab="mastered">已掌握</button>
                <button class="tab-btn" data-tab="all">全部错题</button>
            </div>
            
            <div class="wrong-list" id="wrongList">
                ${renderWrongQuestions(state.todayWrong || [])}
            </div>
        </div>
    `;
    
    // 绑定标签页切换
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            let questions = [];
            
            switch(tab) {
                case 'today':
                    questions = state.todayWrong || [];
                    break;
                case 'review':
                    questions = state.toReview || [];
                    break;
                case 'mastered':
                    questions = state.mastered || [];
                    break;
                case 'all':
                    questions = await wrongBookModule.getAllWrongQuestions('default');
                    break;
            }
            
            container.querySelector('#wrongList').innerHTML = renderWrongQuestions(questions);
        });
    });
}

function renderWrongQuestions(questions) {
    if (!questions || questions.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">🎉</div>
                <h3>太棒了！</h3>
                <p>暂无错题记录，继续保持！</p>
            </div>
        `;
    }
    
    return questions.map(q => `
        <div class="wrong-item" data-id="${q.id || q.questionId}">
            <div class="wrong-header">
                <span class="subject-tag">${q.subject || '综合'}</span>
                <span class="wrong-time">${q.timestamp ? new Date(q.timestamp).toLocaleDateString() : '今天'}</span>
            </div>
            <div class="wrong-content">
                <h4>${q.question || '题目内容'}</h4>
                <div class="answer-compare">
                    <div class="wrong-answer">
                        <span class="label">你的答案：</span>
                        <span class="text">${q.wrongAnswer || '未填写'}</span>
                    </div>
                    <div class="correct-answer">
                        <span class="label">正确答案：</span>
                        <span class="text">${q.correctAnswer || '见解析'}</span>
                    </div>
                </div>
                ${q.note ? `<div class="note-box"><span class="note-label">💡 笔记：</span>${q.note}</div>` : ''}
            </div>
            <div class="wrong-actions">
                <button class="action-btn review-btn">🔄 复习</button>
                <button class="action-btn mastered-btn">✓ 已掌握</button>
                <button class="action-btn delete-btn">删除</button>
            </div>
        </div>
    `).join('');
}

// ========== 学生日记模块渲染 ==========
export async function renderDiary(container) {
    const { default: diaryModule } = await import('./src/modules/diary.js');
    
    const stats = diaryModule.getStats();
    const entries = diaryModule.getAll();
    const moods = diaryModule.getMoods();
    
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = diaryModule.getByDate(today);
    
    container.innerHTML = `
        <div class="diary-container">
            <div class="diary-header">
                <div class="header-left">
                    <span class="module-icon">📔</span>
                    <h1>学生日记</h1>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" id="newEntryBtn">✏️ 写日记</button>
                </div>
            </div>
            
            <div class="diary-stats">
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.streak}</div>
                        <div class="stat-label">连续天数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.totalEntries}</div>
                        <div class="stat-label">总日记数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-info">
                        <div class="stat-number">${stats.thisMonthEntries}</div>
                        <div class="stat-label">本月记录</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <div class="stat-number">${Math.round(stats.thisMonthEntries / 30 * 100)}%</div>
                        <div class="stat-label">本月完成率</div>
                    </div>
                </div>
            </div>
            
            ${!todayEntry ? `
                <div class="today-prompt">
                    <div class="prompt-icon">✨</div>
                    <h3>今天还没写日记哦！</h3>
                    <p>记录下今天的心情和收获吧~</p>
                    <button class="btn btn-primary" id="writeTodayBtn">开始记录</button>
                </div>
            ` : ''}
            
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input type="text" id="diarySearch" placeholder="搜索日记内容或标签...">
            </div>
            
            <div class="mood-filter">
                <span class="filter-label">心情筛选：</span>
                <button class="mood-btn active" data-mood="all">全部</button>
                ${moods.map(m => `
                    <button class="mood-btn" data-mood="${m.id}" title="${m.label}">
                        ${m.emoji}
                    </button>
                `).join('')}
            </div>
            
            <div class="diary-list" id="diaryList">
                ${entries.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <h3>还没有日记</h3>
                        <p>开始记录你的第一篇日记吧！</p>
                    </div>
                ` : entries.slice(0, 10).map(entry => renderDiaryCard(entry, moods)).join('')}
            </div>
            
            ${entries.length > 10 ? `
                <div class="load-more">
                    <button class="btn btn-secondary" id="loadMoreBtn">加载更多</button>
                </div>
            ` : ''}
        </div>
    `;
    
    bindDiaryEvents(container, diaryModule);
}

function renderDiaryCard(entry, moods) {
    const mood = moods.find(m => m.id === entry.mood) || moods[0];
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    
    return `
        <div class="diary-card" data-id="${entry.id}" data-date="${entry.date}">
            <div class="diary-date">
                <span class="date-text">${dateStr}</span>
                <span class="mood-badge" style="background: ${mood.color}20; color: ${mood.color}">
                    ${mood.emoji} ${mood.label}
                </span>
            </div>
            <div class="diary-preview">
                ${entry.content.length > 200 ? entry.content.slice(0, 200) + '...' : entry.content}
            </div>
            ${entry.tags && entry.tags.length > 0 ? `
                <div class="diary-tags">
                    ${entry.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                </div>
            ` : ''}
            ${entry.highlight ? `
                <div class="diary-highlight">
                    <span class="highlight-icon">💫</span>
                    <span class="highlight-text">${entry.highlight}</span>
                </div>
            ` : ''}
            <div class="diary-actions">
                <button class="action-btn edit-btn">编辑</button>
                <button class="action-btn delete-btn">删除</button>
            </div>
        </div>
    `;
}

function showDiaryEditor(container, diaryModule, dateStr = null, existingEntry = null) {
    const moods = diaryModule.getMoods();
    const tags = diaryModule.getTags();
    const date = dateStr ? new Date(dateStr) : new Date();
    const dateDisplay = date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    
    const entry = existingEntry || {
        content: '',
        mood: 'happy',
        tags: [],
        weather: '',
        highlight: '',
        challenge: '',
        gratitude: ''
    };
    
    container.innerHTML = `
        <div class="diary-editor">
            <div class="editor-header">
                <button class="back-btn" data-action="back">← 返回</button>
                <h2>📝 写日记</h2>
                <button class="btn btn-primary" id="saveDiaryBtn">保存日记</button>
            </div>
            
            <div class="editor-date">
                <span class="date-label">日期：</span>
                <span class="date-value">${dateDisplay}</span>
            </div>
            
            <div class="editor-section">
                <label class="section-label">😊 今天的心情</label>
                <div class="mood-selector">
                    ${moods.map(m => `
                        <button class="mood-option ${entry.mood === m.id ? 'selected' : ''}" 
                                data-mood="${m.id}" title="${m.label}">
                            <span class="mood-emoji">${m.emoji}</span>
                            <span class="mood-name">${m.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="editor-section">
                <label class="section-label">🌤️ 天气（可选）</label>
                <div class="weather-selector">
                    <button class="weather-btn ${entry.weather === 'sunny' ? 'selected' : ''}" data-weather="sunny">☀️ 晴</button>
                    <button class="weather-btn ${entry.weather === 'cloudy' ? 'selected' : ''}" data-weather="cloudy">☁️ 阴</button>
                    <button class="weather-btn ${entry.weather === 'rainy' ? 'selected' : ''}" data-weather="rainy">🌧️ 雨</button>
                    <button class="weather-btn ${entry.weather === 'snowy' ? 'selected' : ''}" data-weather="snowy">❄️ 雪</button>
                    <button class="weather-btn ${entry.weather === 'windy' ? 'selected' : ''}" data-weather="windy">💨 风</button>
                </div>
            </div>
            
            <div class="editor-section">
                <label class="section-label">✏️ 今日记录</label>
                <textarea id="diaryContent" placeholder="记录下今天发生的事情、你的想法和感受..." rows="8">${entry.content}</textarea>
            </div>
            
            <div class="editor-row">
                <div class="editor-section half">
                    <label class="section-label">✨ 今日亮点</label>
                    <input type="text" id="diaryHighlight" placeholder="今天最开心的一件事是..." value="${entry.highlight || ''}">
                </div>
                <div class="editor-section half">
                    <label class="section-label">💪 今日挑战</label>
                    <input type="text" id="diaryChallenge" placeholder="今天遇到的挑战是..." value="${entry.challenge || ''}">
                </div>
            </div>
            
            <div class="editor-section">
                <label class="section-label">🙏 感恩事项</label>
                <input type="text" id="diaryGratitude" placeholder="今天我感恩的是..." value="${entry.gratitude || ''}">
            </div>
            
            <div class="editor-section">
                <label class="section-label">🏷️ 标签</label>
                <div class="tags-container">
                    <div class="tags-selected" id="selectedTags">
                        ${entry.tags.map(t => `<span class="tag-item selected" data-tag="${t}">#${t} <span class="remove-tag">×</span></span>`).join('')}
                    </div>
                    <div class="tags-available">
                        ${tags.filter(t => !entry.tags.includes(t)).map(t => `<span class="tag-item" data-tag="${t}">#${t}</span>`).join('')}
                    </div>
                    <div class="add-tag">
                        <input type="text" id="newTagInput" placeholder="添加新标签...">
                        <button class="btn-small" id="addTagBtn">+ 添加</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    bindEditorEvents(container, diaryModule, date.toISOString().split('T')[0]);
}

function bindDiaryEvents(container, diaryModule) {
    // 新建日记
    container.querySelectorAll('#newEntryBtn, #writeTodayBtn').forEach(btn => {
        btn?.addEventListener('click', () => {
            showDiaryEditor(container, diaryModule);
        });
    });
    
    // 编辑/查看日记
    container.querySelectorAll('.diary-card').forEach(card => {
        card.querySelector('.edit-btn')?.addEventListener('click', () => {
            const entry = diaryModule.getAll().find(e => e.id === card.dataset.id);
            showDiaryEditor(container, diaryModule, card.dataset.date, entry);
        });
        
        card.querySelector('.delete-btn')?.addEventListener('click', () => {
            if (confirm('确定要删除这篇日记吗？')) {
                diaryModule.delete(card.dataset.id);
                showToast('日记已删除');
                renderDiary(container);
            }
        });
    });
    
    // 心情筛选
    container.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mood = btn.dataset.mood;
            let entries = diaryModule.getAll();
            
            if (mood !== 'all') {
                entries = entries.filter(e => e.mood === mood);
            }
            
            const moods = diaryModule.getMoods();
            container.querySelector('#diaryList').innerHTML = 
                entries.length === 0 ? 
                    '<div class="empty-state"><p>暂无该心情的日记</p></div>' :
                    entries.map(e => renderDiaryCard(e, moods)).join('');
        });
    });
    
    // 搜索
    container.querySelector('#diarySearch')?.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();
        let entries = keyword ? diaryModule.search(keyword) : diaryModule.getAll();
        
        const moods = diaryModule.getMoods();
        container.querySelector('#diaryList').innerHTML = 
            entries.length === 0 ? 
                '<div class="empty-state"><p>没有找到匹配的日记</p></div>' :
                entries.map(e => renderDiaryCard(e, moods)).join('');
    });
}

function bindEditorEvents(container, diaryModule, dateStr) {
    let selectedMood = 'happy';
    let selectedWeather = '';
    let selectedTags = [];
    
    // 返回
    container.querySelector('[data-action="back"]').addEventListener('click', () => {
        renderDiary(container);
    });
    
    // 心情选择
    container.querySelectorAll('.mood-option').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.mood-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.dataset.mood;
        });
        if (btn.classList.contains('selected')) {
            selectedMood = btn.dataset.mood;
        }
    });
    
    // 天气选择
    container.querySelectorAll('.weather-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedWeather = btn.dataset.weather;
        });
        if (btn.classList.contains('selected')) {
            selectedWeather = btn.dataset.weather;
        }
    });
    
    // 标签选择
    container.querySelectorAll('.tag-item').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagName = tag.dataset.tag;
            if (tag.classList.contains('selected')) {
                tag.classList.remove('selected');
                container.querySelector('.tags-available').appendChild(tag);
                selectedTags = selectedTags.filter(t => t !== tagName);
            } else {
                tag.classList.add('selected');
                container.querySelector('#selectedTags').appendChild(tag);
                selectedTags.push(tagName);
            }
        });
        if (tag.classList.contains('selected')) {
            selectedTags.push(tag.dataset.tag);
        }
    });
    
    // 删除标签
    container.querySelectorAll('.remove-tag').forEach(x => {
        x.addEventListener('click', (e) => {
            e.stopPropagation();
            const tagItem = x.parentElement;
            tagItem.classList.remove('selected');
            container.querySelector('.tags-available').appendChild(tagItem);
            selectedTags = selectedTags.filter(t => t !== tagItem.dataset.tag);
        });
    });
    
    // 添加新标签
    container.querySelector('#addTagBtn')?.addEventListener('click', () => {
        const input = container.querySelector('#newTagInput');
        const newTag = input.value.trim();
        if (newTag && !selectedTags.includes(newTag)) {
            diaryModule.addTag(newTag);
            selectedTags.push(newTag);
            
            const tagEl = document.createElement('span');
            tagEl.className = 'tag-item selected';
            tagEl.dataset.tag = newTag;
            tagEl.innerHTML = `#${newTag} <span class="remove-tag">×</span>`;
            
            tagEl.querySelector('.remove-tag').addEventListener('click', (e) => {
                e.stopPropagation();
                tagEl.remove();
                selectedTags = selectedTags.filter(t => t !== newTag);
            });
            
            tagEl.addEventListener('click', () => {
                tagEl.classList.remove('selected');
                container.querySelector('.tags-available').appendChild(tagEl);
                selectedTags = selectedTags.filter(t => t !== newTag);
            });
            
            container.querySelector('#selectedTags').appendChild(tagEl);
            input.value = '';
        }
    });
    
    // 保存日记
    container.querySelector('#saveDiaryBtn').addEventListener('click', () => {
        const content = container.querySelector('#diaryContent').value.trim();
        const highlight = container.querySelector('#diaryHighlight').value.trim();
        const challenge = container.querySelector('#diaryChallenge').value.trim();
        const gratitude = container.querySelector('#diaryGratitude').value.trim();
        
        if (!content) {
            showToast('请填写日记内容', 'error');
            return;
        }
        
        diaryModule.save(dateStr, {
            content,
            mood: selectedMood,
            weather: selectedWeather,
            tags: selectedTags,
            highlight,
            challenge,
            gratitude
        });
        
        showToast('日记保存成功！🎉');
        renderDiary(container);
    });
}

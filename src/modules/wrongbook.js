// 错题本模块 - ES6 Modules 版本
import { showToast, escapeHtml, formatDate, generateId } from '../utils.js';
import { saveData, loadData } from '../storage.js';
import { getCurrentUserData, updateCurrentUser } from '../user.js';

/**
 * 获取错题列表
 */
export function getWrongQuestions() {
    const user = getCurrentUserData();
    return user?.wrongQuestions || [];
}

/**
 * 添加错题
 */
export function addWrongQuestion(question) {
    const user = getCurrentUserData();
    if (!user) {
        showToast('请先登录');
        return null;
    }

    const newQuestion = {
        id: generateId('wq'),
        ...question,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewedAt: null
    };

    if (!user.wrongQuestions) {
        user.wrongQuestions = [];
    }
    user.wrongQuestions.unshift(newQuestion);
    updateCurrentUser(user);
    
    showToast('错题添加成功 ✅');
    return newQuestion;
}

/**
 * 更新错题
 */
export function updateWrongQuestion(id, updates) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    const index = user.wrongQuestions.findIndex(q => q.id === id);
    if (index === -1) return false;

    user.wrongQuestions[index] = {
        ...user.wrongQuestions[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    updateCurrentUser(user);
    
    showToast('错题更新成功 ✅');
    return true;
}

/**
 * 删除错题
 */
export function deleteWrongQuestion(id) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    user.wrongQuestions = user.wrongQuestions.filter(q => q.id !== id);
    updateCurrentUser(user);
    
    showToast('错题已删除');
    return true;
}

/**
 * 标记已复习
 */
export function markAsReviewed(id) {
    const user = getCurrentUserData();
    if (!user?.wrongQuestions) return false;

    const question = user.wrongQuestions.find(q => q.id === id);
    if (question) {
        question.reviewCount = (question.reviewCount || 0) + 1;
        question.lastReviewedAt = new Date().toISOString();
        updateCurrentUser(user);
        showToast('已标记为已复习 ✅');
    }
    return true;
}

/**
 * 获取科目列表
 */
export function getSubjects() {
    const questions = getWrongQuestions();
    const subjects = new Set(questions.map(q => q.subject).filter(Boolean));
    return Array.from(subjects);
}

/**
 * 按科目筛选错题
 */
export function filterBySubject(subject) {
    const questions = getWrongQuestions();
    if (!subject) return questions;
    return questions.filter(q => q.subject === subject);
}

/**
 * 渲染错题本页面
 */
export function renderWrongBookPage(container) {
    const questions = getWrongQuestions();
    const subjects = getSubjects();

    container.innerHTML = `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>📕 错题本</h2>
                <button class="add-btn" onclick="window.App.wrongbook.openAddModal()">+ 添加</button>
            </div>
            
            <div class="wrongbook-container">
                <div class="filter-section">
                    <select id="subject-filter" onchange="window.App.wrongbook.filterQuestions(this.value)">
                        <option value="">全部科目</option>
                        ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <span class="count-badge">共 ${questions.length} 道错题</span>
                </div>
                
                <div id="questions-list" class="questions-list">
                    ${questions.length === 0 ? renderEmptyState() : questions.map(q => renderQuestionCard(q)).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染空状态
 */
function renderEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <p>还没有错题哦</p>
            <p class="empty-desc">点击右上角添加第一道错题</p>
        </div>
    `;
}

/**
 * 渲染错题卡片
 */
function renderQuestionCard(q) {
    const masteryLevel = getMasteryLevel(q.reviewCount || 0);
    
    return `
        <div class="question-card" data-id="${q.id}">
            <div class="question-header">
                <span class="subject-tag">${q.subject || '未分类'}</span>
                <span class="mastery-badge ${masteryLevel.class}">${masteryLevel.text}</span>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="window.App.wrongbook.openEditModal('${q.id}')">✏️</button>
                    <button class="action-btn delete" onclick="window.App.wrongbook.confirmDelete('${q.id}')">🗑️</button>
                </div>
            </div>
            <div class="question-content">
                <p class="question-text">${escapeHtml(q.question || '无题目内容')}</p>
                ${q.image ? `<img src="${q.image}" class="question-image" />` : ''}
            </div>
            <div class="question-answer">
                <div class="answer-label">正确答案：</div>
                <div class="answer-text">${escapeHtml(q.answer || '未填写')}</div>
            </div>
            ${q.note ? `
                <div class="question-note">
                    <div class="note-label">📝 笔记：</div>
                    <div class="note-text">${escapeHtml(q.note)}</div>
                </div>
            ` : ''}
            <div class="question-footer">
                <span class="review-info">已复习 ${q.reviewCount || 0} 次</span>
                <span class="date-info">${formatDate(q.createdAt)}</span>
                <button class="review-btn" onclick="window.App.wrongbook.markAsReviewed('${q.id}')">
                    ✓ 标记已复习
                </button>
            </div>
        </div>
    `;
}

/**
 * 获取掌握程度
 */
function getMasteryLevel(reviewCount) {
    if (reviewCount === 0) return { class: 'mastery-new', text: '未复习' };
    if (reviewCount < 3) return { class: 'mastery-learning', text: '学习中' };
    if (reviewCount < 5) return { class: 'mastery-good', text: '掌握良好' };
    return { class: 'mastery-excellent', text: '完全掌握' };
}

/**
 * 筛选错题
 */
export function filterQuestions(subject) {
    const questions = filterBySubject(subject);
    const listContainer = document.getElementById('questions-list');
    if (listContainer) {
        listContainer.innerHTML = questions.length === 0 
            ? renderEmptyState() 
            : questions.map(q => renderQuestionCard(q)).join('');
    }
}

/**
 * 打开添加错题模态框
 */
export function openAddModal() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="modal-title">📝 添加错题</div>
        <div class="form-group">
            <label>科目</label>
            <input type="text" id="wb-subject" placeholder="如：数学、语文、英语" />
        </div>
        <div class="form-group">
            <label>题目内容</label>
            <textarea id="wb-question" rows="4" placeholder="输入题目内容..."></textarea>
        </div>
        <div class="form-group">
            <label>正确答案</label>
            <textarea id="wb-answer" rows="2" placeholder="输入正确答案..."></textarea>
        </div>
        <div class="form-group">
            <label>错题笔记（可选）</label>
            <textarea id="wb-note" rows="2" placeholder="记录错误原因、解题思路..."></textarea>
        </div>
        <button class="login-btn" onclick="window.App.wrongbook.saveQuestion()">保存错题</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 保存错题
 */
export function saveQuestion() {
    const subject = document.getElementById('wb-subject')?.value?.trim();
    const question = document.getElementById('wb-question')?.value?.trim();
    const answer = document.getElementById('wb-answer')?.value?.trim();
    const note = document.getElementById('wb-note')?.value?.trim();

    if (!question) {
        showToast('请输入题目内容');
        return;
    }

    addWrongQuestion({ subject, question, answer, note });
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新列表
    const container = document.getElementById('app-container');
    if (container) {
        renderWrongBookPage(container);
    }
}

/**
 * 打开编辑模态框
 */
export function openEditModal(id) {
    const questions = getWrongQuestions();
    const q = questions.find(x => x.id === id);
    if (!q) return;

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="modal-title">✏️ 编辑错题</div>
        <div class="form-group">
            <label>科目</label>
            <input type="text" id="wb-subject" value="${escapeHtml(q.subject || '')}" placeholder="如：数学、语文、英语" />
        </div>
        <div class="form-group">
            <label>题目内容</label>
            <textarea id="wb-question" rows="4" placeholder="输入题目内容...">${escapeHtml(q.question || '')}</textarea>
        </div>
        <div class="form-group">
            <label>正确答案</label>
            <textarea id="wb-answer" rows="2" placeholder="输入正确答案...">${escapeHtml(q.answer || '')}</textarea>
        </div>
        <div class="form-group">
            <label>错题笔记（可选）</label>
            <textarea id="wb-note" rows="2" placeholder="记录错误原因、解题思路...">${escapeHtml(q.note || '')}</textarea>
        </div>
        <button class="login-btn" onclick="window.App.wrongbook.updateQuestion('${id}')">保存修改</button>
        <button class="login-btn login-btn-secondary" onclick="document.getElementById('detail-modal').classList.remove('show')">取消</button>
    `;
    
    modal.classList.add('show');
}

/**
 * 更新错题
 */
export function updateQuestion(id) {
    const subject = document.getElementById('wb-subject')?.value?.trim();
    const question = document.getElementById('wb-question')?.value?.trim();
    const answer = document.getElementById('wb-answer')?.value?.trim();
    const note = document.getElementById('wb-note')?.value?.trim();

    if (!question) {
        showToast('请输入题目内容');
        return;
    }

    updateWrongQuestion(id, { subject, question, answer, note });
    document.getElementById('detail-modal').classList.remove('show');
    
    // 刷新列表
    const container = document.getElementById('app-container');
    if (container) {
        renderWrongBookPage(container);
    }
}

/**
 * 确认删除
 */
export function confirmDelete(id) {
    if (confirm('确定要删除这道错题吗？')) {
        deleteWrongQuestion(id);
        const container = document.getElementById('app-container');
        if (container) {
            renderWrongBookPage(container);
        }
    }
}

// 挂载到window.App
if (!window.App) window.App = {};
window.App.wrongbook = {
    openAddModal,
    saveQuestion,
    openEditModal,
    updateQuestion,
    confirmDelete,
    markAsReviewed,
    filterQuestions
};

console.log('✅ wrongbook 模块加载完成');

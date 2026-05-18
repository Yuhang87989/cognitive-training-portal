// 版本: V151

let currentTopicsGrade = 7;
let currentTopicsSubject = 'math';
let currentTopicsPage = 1;

// 动态计算每页题目数量（根据屏幕高度）
function getTopicsPerPage() {
    const screenHeight = window.innerHeight || 667;
    if (screenHeight < 600) return 5;  // 小屏手机
    if (screenHeight < 800) return 6;  // 普通手机
    if (screenHeight < 1000) return 8; // 大屏手机/平板
    return 10; // 电脑/大屏
}

function renderTopics(container) {
    const currentUser = getCurrentUserData();
    const userGrade = (currentUser && currentUser.grade) ? currentUser.grade : 7;
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">📚 母题训练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">精选母题，举一反三，掌握核心知识点</p>
        </div>
        <div class="grade-tab">
            <button class="grade-tab-btn${userGrade === 5 ? ' active' : ''}" onclick="selectTopicsGrade(this, 5)">五年级</button>
            <button class="grade-tab-btn${userGrade === 6 ? ' active' : ''}" onclick="selectTopicsGrade(this, 6)">六年级</button>
            <button class="grade-tab-btn${userGrade === 7 ? ' active' : ''}" onclick="selectTopicsGrade(this, 7)">初一</button>
            <button class="grade-tab-btn${userGrade === 8 ? ' active' : ''}" onclick="selectTopicsGrade(this, 8)">初二</button>
            <button class="grade-tab-btn${userGrade === 9 ? ' active' : ''}" onclick="selectTopicsGrade(this, 9)">初三</button>
        </div>
        <div class="subject-tab">
            <button class="subject-tab-btn active" onclick="selectTopicsSubject(this, 'math')">数学</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'chinese')">语文</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'english')">英语</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'physics')">物理</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'chemistry')">化学</button>
        </div>
        <div id="topics-list-container"></div>
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
    `;
    currentTopicsGrade = userGrade;
    loadTopicsList();
}

function selectTopicsGrade(btn, grade) {
    document.querySelectorAll('.grade-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTopicsGrade = grade;
    currentTopicsPage = 1;
    loadTopicsList();
}

function selectTopicsSubject(btn, subject) {
    document.querySelectorAll('.subject-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTopicsSubject = subject;
    currentTopicsPage = 1;
    loadTopicsList();
}

function getTopicsList() {
    const key = (currentTopicsSubject || 'math') + (currentTopicsGrade || 7);
    return typeof topics !== 'undefined' ? (topics[key] || []) : [];
}

function loadTopicsList() {
    const container = document.getElementById('topics-list-container');
    if (!container) return;
    
    const topicsList = getTopicsList();
    const topicsPerPage = getTopicsPerPage();
    const total = topicsList.length;
    const totalPages = Math.ceil(total / topicsPerPage);
    const start = (currentTopicsPage - 1) * topicsPerPage;
    const end = Math.min(start + topicsPerPage, total);
    const pageTopics = topicsList.slice(start, end);
    
    if (total === 0) {
        container.innerHTML = '<div class="card"><div style="text-align:center;padding:30px;color:#999;">暂无该科目题目</div></div>';
        return;
    }
    
    const gradients = ['gradient-blue', 'gradient-orange', 'gradient-green', 'gradient-purple', 'gradient-pink', 'gradient-cyan'];
    
    container.innerHTML = `
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;color:#666;">共 ${total} 道母题</span>
                <span style="font-size:12px;color:#999;">第 ${currentTopicsPage}/${totalPages} 页</span>
            </div>
        </div>
        ${pageTopics.map((t, i) => `
            <div class="topic-card" onclick="openTopicQuestion(${t.id})">
                <div class="topic-header ${gradients[i % gradients.length]}">
                    <div class="topic-title">${t.title}</div>
                    <div class="topic-subtitle">难度: ${'⭐'.repeat(t.diff || 2)}</div>
                </div>
                <div class="topic-footer">
                    <span class="topic-difficulty">ID: ${t.id}</span>
                    <span style="color:#3377FF;">开始练习 →</span>
                </div>
            </div>
        `).join('')}
        <div style="display:flex;gap:12px;padding:12px;">
            <button class="game-btn btn-orange" style="flex:1;" onclick="prevTopicsPage()" ${currentTopicsPage <= 1 ? 'disabled style="opacity:0.5;"' : ''}>上一页</button>
            <button class="game-btn btn-blue" style="flex:1;" onclick="nextTopicsPage()" ${currentTopicsPage >= totalPages ? 'disabled style="opacity:0.5;"' : ''}>下一页</button>
        </div>
    `;
}

function prevTopicsPage() {
    if (currentTopicsPage > 1) {
        currentTopicsPage--;
        loadTopicsList();
    }
}

function nextTopicsPage() {
    const total = getTopicsList().length;
    const totalPages = Math.ceil(total / getTopicsPerPage());
    if (currentTopicsPage < totalPages) {
        currentTopicsPage++;
        loadTopicsList();
    }
}

function findTopic(topicId) {
    if (typeof topics === 'undefined') return null;
    for (let key in topics) {
        const found = topics[key].find(t => t.id === topicId);
        if (found) return found;
    }
    return null;
}

function openTopicQuestion(topicId) {
    const topic = findTopic(topicId);
    if (!topic) {
        showToast('题目不存在');
        return;
    }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${topic.title}</div>
        <div class="card" style="margin-bottom:12px;">
            <div style="font-size:15px;line-height:1.8;margin-bottom:16px;">${topic.q}</div>
            <div class="practice-input">
                <input type="text" id="topic-answer-input" placeholder="输入你的答案..." style="flex:1;" />
                <button onclick="checkTopicAnswer(${topicId})" style="padding:10px 16px;background:#3377FF;color:white;border:none;border-radius:8px;cursor:pointer;">提交</button>
            </div>
            <div id="topic-result-area"></div>
        </div>
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照上传</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">上传你的解题过程，AI帮你分析</p>
            <input type="file" id="topic-photo-input" accept="image/*" capture="environment" style="display:none" onchange="uploadTopicPhoto(${topicId}, this)"/>
            <button class="camera-btn" onclick="document.getElementById('topic-photo-input').click()">📷 拍照上传</button>
        </div>
        <button class="login-btn login-btn-secondary" onclick="closeDetail()" style="margin-top:12px;">关闭</button>
    `;
}

function checkTopicAnswer(topicId) {
    const input = document.getElementById('topic-answer-input');
    const resultArea = document.getElementById('topic-result-area');
    const answer = input.value.trim();
    const topic = findTopic(topicId);
    
    if (!answer) {
        showToast('请输入答案');
        return;
    }
    
    const isCorrect = answer.toLowerCase() === topic.a.toLowerCase();
    
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    resultArea.className = 'practice-result ' + (isCorrect ? 'correct' : 'wrong');
    resultArea.innerHTML = isCorrect 
        ? `<div style="margin-top:12px;">✅ 回答正确！</div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`
        : `<div style="margin-top:12px;">❌ 回答错误</div>
           <div style="margin-top:8px;">正确答案：<strong style="color:#3377FF;">${topic.a}</strong></div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`;
    
    const userData = getCurrentUserData();
    if (userData) {
        if (!userData.topicStats) userData.topicStats = {};
        userData.topicStats[topicId] = { 
            correct: isCorrect, 
            attempts: (userData.topicStats[topicId]?.attempts || 0) + 1,
            lastTime: Date.now()
        };
        
        if (!isCorrect) {
            if (!userData.wrongNotes) userData.wrongNotes = [];
            const wrongKey = 'topic-' + topicId;
            if (!userData.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                userData.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'topic',
                    sourceName: '母题训练',
                    topicId: topicId,
                    question: topic.q,
                    answer: topic.a,
                    explanation: topic.e,
                    userAnswer: answer,
                    time: Date.now()
                });
            }
        }
        syncUserData(userData);
    }
}function uploadTopicPhoto(topicId, input) {
    if (!input.files[0]) return;
    showToast('照片上传成功，AI分析中...');
    analyzeTopicWithAI(topicId);
}

function closeDetail() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('show');
}

// 导出函数到window
window.renderTopics = renderTopics;
window.selectTopicsGrade = selectTopicsGrade;
window.selectTopicsSubject = selectTopicsSubject;
window.loadTopicsList = loadTopicsList;
window.findTopic = findTopic;
window.openTopicQuestion = openTopicQuestion;
window.checkTopicAnswer = checkTopicAnswer;
window.analyzeTopicWithAI = analyzeTopicWithAI;
window.uploadTopicPhoto = uploadTopicPhoto;
window.prevTopicsPage = prevTopicsPage;
window.nextTopicsPage = nextTopicsPage;
window.closeDetail = closeDetail;

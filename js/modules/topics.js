// ====== topics模块 ======
// 版本: V140

CTM.registerModule('topics', {
    name: 'topics',
    icon: '🎯',
    render: renderTopics
});

function renderTopics(container) {
    // 获取当前用户年级
    const currentUser = getCurrentUserData();
    const userGrade = currentUser ? currentUser.grade : 7;
    
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
    `;
    // 设置当前年级为用户年级
    currentTopicsGrade = userGrade;
    // 初始化加载
    loadTopicsList();
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

function submitTopicAnswer(topicId) {
    const answer = document.getElementById('practice-answer').value.trim();
    const topic = topicsMath7.find(t => t.id === topicId) || 
                  topicsEnglish7.find(t => t.id === topicId) ||
                  topicsChinese7.find(t => t.id === topicId);
    if (!topic) return;
    
    const isCorrect = answer.toLowerCase() === topic.a.toLowerCase();
    
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const resultDiv = document.getElementById('practice-result');
    resultDiv.className = 'practice-result ' + (isCorrect ? 'correct' : 'wrong');
    resultDiv.innerHTML = isCorrect 
        ? '<span class="answer-highlight">✅ 回答正确！</span>' 
        : '<span>❌ 回答错误，正确答案是：<span class="answer-highlight">' + topic.a + '</span></span><div class="explanation">📝 解析：' + topic.e + '</div>';
    resultDiv.innerHTML = isCorrect 
        ? '<span class="answer-highlight">✅ 回答正确！</span>' 
        : '<span>❌ 回答错误，正确答案是：<span class="answer-highlight">' + topic.a + '</span></span><div class="explanation">📝 解析：' + topic.e + '</div>';
    resultDiv.innerHTML = isCorrect 
        ? '<span class="answer-highlight">✅ 回答正确！</span>' 
        : '<span>❌ 回答错误，正确答案是：<span class="answer-highlight">' + topic.a + '</span></span><div class="explanation">📝 解析：' + topic.e + '</div>';
    resultDiv.innerHTML = isCorrect 
        ? '<span class="answer-highlight">✅ 回答正确！</span>' 
        : '<span>❌ 回答错误，正确答案是：<span class="answer-highlight">' + topic.a + '</span></span><div class="explanation">📝 解析：' + topic.e + '</div>';
    
    // 更新用户数据
    const userData = getCurrentUserData();
    if (userData) {
        if (!userData.topicStats) userData.topicStats = {};
        userData.topicStats[topicId] = { correct: isCorrect, attempts: (userData.topicStats[topicId]?.attempts || 0) + 1 };
        syncUserData(userData);
    }
}

window.renderTopics = renderTopics;
window.openTopicQuestion = openTopicQuestion;
window.submitTopicAnswer = submitTopicAnswer;

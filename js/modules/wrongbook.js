// 版本: V140

function openWrongPhotoCapture() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = '<div class="modal-title">📷 拍照上传错题</div>' +
        '<div class="card" style="padding:20px;text-align:center;margin-bottom:12px;">' +
            '<div style="font-size:48px;margin-bottom:12px;">📸</div>' +
            '<div style="font-size:13px;color:var(--text-gray);margin-bottom:16px;">拍照或上传错题图片</div>' +
            '<button class="camera-btn" style="margin-bottom:12px;" onclick="document.getElementById(\'wrong-photo-camera\').click()">📷 拍照</button>' +
            '<input type="file" id="wrong-photo-camera" accept="image/*" capture="environment" style="display:none" onchange="uploadWrongPhotoDirect(this)"/>' +
            '<button class="login-btn login-btn-outline" style="width:100%;" onclick="document.getElementById(\'wrong-photo-gallery\').click()">📁 从相册选择</button>' +
            '<input type="file" id="wrong-photo-gallery" accept="image/*" style="display:none" onchange="uploadWrongPhotoDirect(this)"/>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:12px;">📁 我的错题照片 (' + (getCurrentUserData()?.uploadedImages?.length || 0) + ')</div>' +
        '<button class="login-btn login-btn-secondary" style="width:100%;" onclick="showWrongPhotoGallery()">查看错题照片</button>';
}

function uploadWrongPhotoDirect(input) {
    if (!input.files[0]) return;
    var file = input.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var imageData = e.target.result;
        var user = getCurrentUserData() || {};
        user.uploadedImages = user.uploadedImages || [];
        var photoId = Date.now();
        
        user.uploadedImages.push({ 
            id: photoId, 
            topicId: null, 
            image: imageData, 
            time: Date.now() 
        });
        syncUserData(user);
        
        showToast('错题照片上传成功！');
        showWrongPhotoGallery();
        input.value = '';
    };
    reader.readAsDataURL(file);
}

function deleteWrongPhoto(photoId) {
    var user = getCurrentUserData() || {};
    user.uploadedImages = user.uploadedImages || [];
    user.uploadedImages = user.uploadedImages.filter(function(p) { return p.id !== photoId; });
    syncUserData(user);
    showToast('已删除');
    showWrongPhotoGallery();
}

function showWrongPhotoGallery() {
    var user = getCurrentUserData() || {};
    var photos = user.uploadedImages || [];
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    if (photos.length === 0) {
        content.innerHTML = '<div class="modal-title">📁 错题照片库</div>' +
            '<div style="text-align:center;padding:40px;color:var(--text-light);">' +
                '<div style="font-size:48px;margin-bottom:12px;">📂</div>' +
                '<div>暂无错题照片</div>' +
                '<div style="font-size:12px;margin-top:4px;">开始拍照上传吧！</div>' +
            '</div>' +
            '<button class="login-btn login-btn-secondary" style="width:100%;" onclick="openWrongPhotoCapture()">拍照上传</button>';
        return;
    }
    
    var photosHtml = photos.slice().reverse().map(function(p) {
        return '<div style="position:relative;display:inline-block;width:calc(50% - 6px);margin:3px;">' +
            '<img src="' + p.image + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="showPhotoPreview(\'' + p.image + '\', ' + p.topicId + ', ' + p.id + ')"/>' +
            '<button style="position:absolute;top:4px;right:4px;background:rgba(255,0,0,0.8);color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:12px;" onclick="deleteWrongPhoto(' + p.id + ')">×</button>' +
        '</div>';
    }).join('');
    
    content.innerHTML = '<div class="modal-title">📁 错题照片库 (' + photos.length + '张)</div>' +
        '<div style="text-align:right;margin-bottom:8px;">' +
            '<button class="login-btn login-btn-outline" style="padding:6px 12px;font-size:12px;" onclick="openWrongPhotoCapture()">+ 添加</button>' +
        '</div>' +
        '<div style="max-height:400px;overflow-y:auto;">' + photosHtml + '</div>' +
        '<button class="login-btn login-btn-secondary" style="margin-top:12px;width:100%;" onclick="closeDetail()">关闭</button>';
}

function showWrongNotes() {
    const user = getCurrentUserData() || {};
    const wrongNotes = user.wrongNotes || [];
    const content = document.getElementById('detail-content');
    if (wrongNotes.length === 0) {
        content.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:16px;">📝 错题本</div>
            <div style="text-align:center;padding:40px;color:var(--text-light);">
                <div style="font-size:48px;margin-bottom:12px;">✨</div>
                <div>暂无错题记录</div>
                <div style="font-size:12px;margin-top:4px;">继续保持，加油！</div>
            </div>
            <button class="login-btn login-btn-secondary" onclick="closeDetail()">关闭</button>
        `;
    } else {
        content.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:16px;">📝 错题本 (${wrongNotes.length}道)</div>
            <div style="margin-bottom:12px;">
                <button onclick="showWrongNotesBySource('all')" style="padding:6px 10px;background:#f5f5f5;border:none;border-radius:6px;font-size:12px;margin-right:6px;cursor:pointer;">全部</button>
                <button onclick="showWrongNotesBySource('topic')" style="padding:6px 10px;background:#fff3e0;border:none;border-radius:6px;font-size:12px;margin-right:6px;cursor:pointer;">母题训练</button>
                <button onclick="showWrongNotesBySource('method')" style="padding:6px 10px;background:#e3f2fd;border:none;border-radius:6px;font-size:12px;margin-right:6px;cursor:pointer;">学霸方法</button>
                <button onclick="showWrongNotesBySource('thinking')" style="padding:6px 10px;background:#f3e5f5;border:none;border-radius:6px;font-size:12px;cursor:pointer;">思维训练</button>
            </div>
            <div id="wrong-notes-list" style="max-height:400px;overflow-y:auto;">
                ${wrongNotes.map(n => `
                    <div class="wrong-note-card" onclick="handleWrongNoteClick('${n.source}', '${n.wrongKey}', ${n.topicId})">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${n.source === 'topic' ? '#FF9800' : n.source === 'method' ? '#2196F3' : '#9C27B0'};color:white;">${n.sourceName || '未知'}</span>
                            <span style="font-size:10px;color:#999;">${new Date(n.time).toLocaleDateString()}</span>
                        </div>
                        <div class="wrong-note-question">${n.question}</div>
                        <div class="wrong-note-answer">答案：${n.answer}</div>
                        ${n.explanation ? '<div style="font-size:11px;color:#666;margin-top:4px;">💡 ' + n.explanation.substring(0, 50) + '...</div>' : ''}
                    </div>
                `).join('')}
            </div>
            <button class="login-btn login-btn-secondary" onclick="closeDetail()">关闭</button>
        `;
    }
    document.getElementById('detail-modal').classList.add('show');
}

function showWrongNotesBySource(source) {
    const user = getCurrentUserData() || {};
    const wrongNotes = user.wrongNotes || [];
    const filteredNotes = source === 'all' ? wrongNotes : wrongNotes.filter(n => n.source === source);
    const container = document.getElementById('wrong-notes-list');
    if (container) {
        container.innerHTML = filteredNotes.length === 0 
            ? '<div style="text-align:center;padding:30px;color:#999;">该模块暂无错题</div>'
            : filteredNotes.map(n => `
                <div class="wrong-note-card" onclick="handleWrongNoteClick('${n.source}', '${n.wrongKey}', ${n.topicId})">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${n.source === 'topic' ? '#FF9800' : n.source === 'method' ? '#2196F3' : '#9C27B0'};color:white;">${n.sourceName || '未知'}</span>
                        <span style="font-size:10px;color:#999;">${new Date(n.time).toLocaleDateString()}</span>
                    </div>
                    <div class="wrong-note-question">${n.question}</div>
                    <div class="wrong-note-answer">答案：${n.answer}</div>
                    ${n.explanation ? '<div style="font-size:11px;color:#666;margin-top:4px;">💡 ' + n.explanation.substring(0, 50) + '...</div>' : ''}
                </div>
            `).join('');
    }
}

function removeWrongNote(index) {
    const user = getCurrentUserData();
    if (user && user.wrongNotes) {
        user.wrongNotes.splice(index, 1);
        syncUserData(user);
        showToast('已移除错题');
        const container = document.getElementById('fullscreen-content');
        if (container) renderWrongbook(container);
    }
}

function clearWrongNotes() {
    if (!confirm('确定要清空所有错题记录吗？')) return;
    
    const user = getCurrentUserData();
    if (user) {
        user.wrongNotes = [];
        syncUserData(user);
        
        // 更新设置面板显示
        const wrongCountEl = document.getElementById('settings-wrong-count');
        if (wrongCountEl) wrongCountEl.textContent = '共 0 道错题';
        
        showToast('错题本已清空');
    }
}

function handleWrongNoteClick(source, wrongKey, topicId) {
    if (source === 'topic') {
        closeDetail();
        openTopicQuestion(topicId);
    } else if (source === 'method') {
        showToast('可在学霸方法中重新练习该内容');
    } else if (source === 'thinking') {
        showToast('可在思维训练中重新练习该内容');
    }
}

function viewMethodNote(noteId) {
    const user = getCurrentUserData();
    const note = user?.methodNotes?.find(n => n.id === noteId);
    if (!note) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 学习笔记</div>
        <img src="${note.image}" style="width:100%;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#999;margin-bottom:16px;">上传时间：${note.uploadTime}</div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function viewThinkingNote(noteId) {
    const user = getCurrentUserData();
    const note = user?.thinkingNotes?.find(n => n.id === noteId);
    if (!note) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📝 思维训练笔记</div>
        <img src="${note.image}" style="width:100%;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#999;margin-bottom:16px;">上传时间：${note.uploadTime}</div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function deleteMethodNote(noteId) {
    if (!confirm('确定删除这个笔记吗？')) return;
    
    const user = getCurrentUserData();
    user.methodNotes = user.methodNotes.filter(n => n.id !== noteId);
    syncUserData(user);
    
    renderMethodNotes();
    updateMethodStats();
    showToast('笔记已删除');
}

function deleteThinkingNote(noteId) {
    if (!confirm('确定删除这个笔记吗？')) return;
    const user = getCurrentUserData();
    user.thinkingNotes = user.thinkingNotes.filter(n => n.id !== noteId);
    syncUserData(user);
    renderThinkingNotes();
    showToast('笔记已删除');
}

function handleMethodNoteUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('请上传图片文件');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.methodNotes) user.methodNotes = [];
    
    const imageUrl = URL.createObjectURL(file);
    const noteData = {
        id: 'method-note-' + Date.now(),
        image: imageUrl,
        name: file.name,
        uploadTime: new Date().toLocaleString()
    };
    
    user.methodNotes.push(noteData);
    syncUserData(user);
    
    showToast('笔记上传成功！');
    renderMethodNotes();
    updateMethodStats();
}

function handleThinkingNoteUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast('请上传图片文件');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingNotes) user.thinkingNotes = [];
    
    const imageUrl = URL.createObjectURL(file);
    user.thinkingNotes.push({
        id: 'thinking-note-' + Date.now(),
        image: imageUrl,
        name: file.name,
        uploadTime: new Date().toLocaleString()
    });
    syncUserData(user);
    showToast('笔记上传成功！');
    renderThinkingNotes();
}

function rateMethodAnswer(methodId, isCorrect, questionIndex) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.methodStats) user.methodStats = {};
    if (!user.methodStats[methodId]) user.methodStats[methodId] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    // 避免重复统计同一题
    if (!user.methodStats[methodId].answeredQuestions.includes(questionIndex)) {
        user.methodStats[methodId].completed++;
        if (isCorrect) user.methodStats[methodId].correct++;
        user.methodStats[methodId].answeredQuestions.push(questionIndex);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = methodTrainingQuestions[methodId];
        const question = questions[questionIndex];
        if (question) {
            const wrongKey = 'method-' + methodId + '-' + questionIndex;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'method',
                    sourceName: '学霸方法',
                    topicId: questionIndex,
                    question: question.q,
                    answer: question.a,
                    explanation: '参考答案：' + question.a,
                    userAnswer: '未达标',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateMethodStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
}

function rateThinkingAnswer(type, isCorrect, questionIdx) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingStats) user.thinkingStats = {};
    if (!user.thinkingStats[type]) user.thinkingStats[type] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    if (!user.thinkingStats[type].answeredQuestions.includes(questionIdx)) {
        user.thinkingStats[type].completed++;
        if (isCorrect) user.thinkingStats[type].correct++;
        user.thinkingStats[type].answeredQuestions.push(questionIdx);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = thinkingQuestions[type];
        const question = questions[questionIdx];
        const typeNames = {
            logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
            reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
            abstract: '抽象思维'
        };
        if (question) {
            const wrongKey = 'thinking-' + type + '-' + questionIdx;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'thinking',
                    sourceName: typeNames[type] || '思维训练',
                    topicId: questionIdx,
                    question: question.q,
                    answer: question.opts ? question.opts[question.a] : question.a,
                    explanation: '参考答案：' + (question.opts ? question.opts[question.a] : question.a),
                    userAnswer: '回答错误',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateThinkingStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
}

function renderWrongbook(container) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">📒 错题本</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">收录练习中的错题，定期复习巩固</p>
            <div style="display:flex;gap:12px;margin-bottom:16px;">
                <div style="flex:1;text-align:center;padding:16px;background:#fff5f5;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${wrongNotes.length}</div>
                    <div style="font-size:12px;color:#666;">错题总数</div>
                </div>
                <div style="flex:1;text-align:center;padding:16px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#667eea;">${wrongNotes.filter(n => n.reviewed).length}</div>
                    <div style="font-size:12px;color:#666;">已复习</div>
                </div>
            </div>
        </div>
        
        ${wrongNotes.length === 0 ? `
            <div class="card" style="text-align:center;padding:40px;">
                <div style="font-size:48px;margin-bottom:16px;">📝</div>
                <div style="color:#666;">暂无错题，继续加油！</div>
            </div>
        ` : `
            <div class="card">
                <h4 style="margin-bottom:12px;">错题列表</h4>
                ${wrongNotes.map((note, i) => `
                    <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:12px;">
                        <div style="font-size:14px;margin-bottom:8px;">${note.question}</div>
                        <div style="display:flex;gap:8px;margin-bottom:8px;">
                            <span style="font-size:12px;color:#FF6B6B;">你的答案：${note.userAnswer}</span>
                            <span style="font-size:12px;color:#43E97B;">正确答案：${note.answer}</span>
                        </div>
                        <div style="font-size:12px;color:#666;">解析：${note.explanation}</div>
                        <button onclick="removeWrongNote(${i})" style="margin-top:8px;padding:6px 12px;background:#FF6B6B;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">移除</button>
                    </div>
                `).join('')}
            </div>
        `}
    `;
}

function openFeedback() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">💬 反馈建议</div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <textarea id="feedback-text" style="width:100%;height:100px;border:1px solid #ddd;border-radius:8px;padding:12px;font-size:14px;resize:none;" placeholder="请描述您的问题或建议..."></textarea>
        </div>
        <button onclick="submitFeedback()" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交反馈</button>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function submitFeedback() {
    const text = document.getElementById('feedback-text').value.trim();
    if (!text) {
        showToast('请输入反馈内容');
        return;
    }
    // 模拟提交
    closeModal();
    showToast('感谢您的反馈！我们会认真处理');
}

function viewWrongNotes() {
    closeSettingsPanel();
    openFullscreenPage('wrongNotes');
}


// ============================================================
// Pomodoro - 番茄钟
// ============================================================

// Window exports for onclick handlers
window.clearWrongNotes = clearWrongNotes;
window.viewWrongNotes = viewWrongNotes;
window.openFeedback = openFeedback;

// ============================================================
// Window Exports
// ============================================================
window.handleWrongNoteClick = handleWrongNoteClick;
window.showWrongNotesBySource = showWrongNotesBySource;
window.openWrongPhotoCapture = openWrongPhotoCapture;
window.deleteWrongPhoto = deleteWrongPhoto;
window.removeWrongNote = removeWrongNote;
window.showPhotoPreview = showPhotoPreview;
window.showWrongPhotoGallery = showWrongPhotoGallery;
window.submitFeedback = submitFeedback;
window.closeDetail = closeDetail;
window.closeModal = closeModal;

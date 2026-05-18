// 版本: V151

// ============================================================
// 错题本主页
// ============================================================

function renderWrongbook(container) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const photoCount = user?.uploadedImages?.length || 0;
    
    container.innerHTML = `
        <div class="wrongbook-header">
            <div class="wrongbook-title">📒 错题本</div>
            <div class="wrongbook-subtitle">收录错题，拍照识别或手动输入，AI帮你分析</div>
        </div>
        
        <div class="wrongbook-stats">
            <div class="stat-card stat-red">
                <div class="stat-num">${wrongNotes.length}</div>
                <div class="stat-label">错题总数</div>
            </div>
            <div class="stat-card stat-green">
                <div class="stat-num">${photoCount}</div>
                <div class="stat-label">错题照片</div>
            </div>
            <div class="stat-card stat-blue">
                <div class="stat-num">${wrongNotes.filter(n => n.reviewed).length}</div>
                <div class="stat-label">已复习</div>
            </div>
        </div>
        
        <div class="wrongbook-actions">
            <button class="action-btn action-btn-red" onclick="openWrongPhotoCapture()">
                <span class="action-icon">📝</span>
                <span class="action-text">添加错题</span>
            </button>
            <button class="action-btn action-btn-purple" onclick="showWrongPhotoGallery()">
                <span class="action-icon">📁</span>
                <span class="action-text">照片库(${photoCount})</span>
            </button>
        </div>
        
        ${wrongNotes.length === 0 ? `
            <div class="wrongbook-empty">
                <div class="empty-icon">📝</div>
                <div class="empty-title">暂无错题，继续加油！</div>
                <div class="empty-desc">做错题会自动收录，也可以拍照识别或手动输入</div>
            </div>
        ` : `
            <div class="wrongbook-list-header">
                <span class="list-title">错题列表</span>
                <button class="review-all-btn" onclick="reviewAllWrongNotes()">📝 重练全部</button>
            </div>
            <div class="wrongbook-list">
                ${wrongNotes.map((note, i) => `
                    <div class="wrong-note-card" data-index="${i}">
                        <div class="note-header">
                            <span class="note-source" style="background:${getSourceColor(note.source)}">${note.sourceName || '练习'}</span>
                            <span class="note-status ${note.reviewed ? 'status-reviewed' : 'status-pending'}">
                                ${note.reviewed ? '✅ 已复习' : '❌ 未复习'}
                            </span>
                        </div>
                        <div class="note-question">${note.question}</div>
                        <div class="note-answers">
                            <span class="your-answer">你的答案：${note.userAnswer}</span>
                            <span class="correct-answer">正确答案：${note.answer}</span>
                        </div>
                        ${note.explanation ? '<div class="note-explanation">💡 ' + note.explanation.substring(0, 60) + '...</div>' : ''}
                        <div class="note-actions">
                            <button class="note-btn btn-retry" onclick="retryWrongNote(${i})">🔄 重练</button>
                            <button class="note-btn btn-ai" onclick="analyzeWrongNoteWithAI(${i})">🤖 AI分析</button>
                            <button class="note-btn btn-delete" onclick="removeWrongNote(${i})">🗑 删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
        
        <style>
            .wrongbook-header { padding: 16px; text-align: center; }
            .wrongbook-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px; }
            .wrongbook-subtitle { font-size: 13px; color: #999; }
            
            .wrongbook-stats { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 16px; }
            .stat-card { flex: 1; text-align: center; padding: 12px 8px; border-radius: 12px; }
            .stat-red { background: linear-gradient(135deg, #fff5f5, #ffe0e0); }
            .stat-green { background: linear-gradient(135deg, #f0fff0, #d4edda); }
            .stat-blue { background: linear-gradient(135deg, #f5f7ff, #e3f2fd); }
            .stat-num { font-size: 22px; font-weight: bold; }
            .stat-red .stat-num { color: #FF6B6B; }
            .stat-green .stat-num { color: #43E97B; }
            .stat-blue .stat-num { color: #667eea; }
            .stat-label { font-size: 11px; color: #666; margin-top: 2px; }
            
            .wrongbook-actions { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 16px; }
            .action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; 
                padding: 14px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
            .action-btn-red { background: linear-gradient(135deg, #FF6B6B, #FF9A63); color: white; }
            .action-btn-purple { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .action-icon { font-size: 18px; }
            
            .wrongbook-empty { text-align: center; padding: 40px 20px; background: #f9f9f9; border-radius: 16px; margin: 0 16px; }
            .empty-icon { font-size: 48px; margin-bottom: 12px; }
            .empty-title { font-size: 16px; color: #666; margin-bottom: 4px; }
            .empty-desc { font-size: 12px; color: #999; }
            
            .wrongbook-list-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
            .list-title { font-size: 15px; font-weight: 600; color: #333; }
            .review-all-btn { padding: 8px 16px; background: #43E97B; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
            
            .wrongbook-list { padding: 0 16px 20px; }
            
            .wrong-note-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
            .note-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .note-source { font-size: 11px; padding: 2px 8px; border-radius: 10px; color: white; }
            .note-status { font-size: 11px; }
            .status-reviewed { color: #43E97B; }
            .status-pending { color: #FF6B6B; }
            .note-question { font-size: 14px; color: #333; margin-bottom: 8px; line-height: 1.5; }
            .note-answers { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
            .your-answer { font-size: 12px; color: #FF6B6B; }
            .correct-answer { font-size: 12px; color: #43E97B; }
            .note-explanation { font-size: 11px; color: #666; margin-bottom: 8px; }
            .note-actions { display: flex; gap: 8px; flex-wrap: wrap; }
            .note-btn { padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
            .btn-retry { background: #667eea; color: white; }
            .btn-ai { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .btn-delete { background: #FF6B6B; color: white; }
        `;
}

// 获取来源颜色
function getSourceColor(source) {
    const colors = {
        'topic': '#FF9800',
        'method': '#2196F3',
        'thinking': '#9C27B0',
        'photo': '#E91E63',
        'manual': '#00BCD4'
    };
    return colors[source] || '#666';
}

// ============================================================
// 拍照上传错题（整合OCR+AI分析）
// ============================================================

function openWrongPhotoCapture() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    const photoCount = getCurrentUserData()?.uploadedImages?.length || 0;
    
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">📝 添加错题</div>
            <button class="close-btn" onclick="closeModal()" style="margin-left:auto;background:#f5f5f5;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div class="capture-container">
            <div class="capture-icon">📝</div>
            <div class="capture-hint">拍照自动识别文字，或手动输入题目</div>
            <div class="capture-tips">
                <div class="tip">💡 拍照后自动OCR识别为文字</div>
                <div class="tip">💡 也可以直接打字输入题目</div>
            </div>
            <div class="capture-buttons">
                <button class="capture-btn capture-btn-camera" onclick="document.getElementById('wrong-photo-camera').click()">
                    📷 拍照
                </button>
                <input type="file" id="wrong-photo-camera" accept="image/*" capture="environment" style="display:none" onchange="uploadWrongPhotoWithAI(this)"/>
                
                <button class="capture-btn capture-btn-gallery" onclick="document.getElementById('wrong-photo-gallery').click()">
                    🖼️ 从相册选择
                </button>
                <input type="file" id="wrong-photo-gallery" accept="image/*" style="display:none" onchange="uploadWrongPhotoWithAI(this)"/>
                
                <button class="capture-btn" onclick="manualInputWrongNote()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
                    ✏️ 手动输入题目
                </button>
            </div>
        </div>
        <div class="capture-footer">
            <div class="photo-count">📁 我的错题照片 (${photoCount})</div>
            <button class="footer-btn" onclick="showWrongPhotoGallery()">查看照片库</button>
        </div>
        
        <style>
            .modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .back-btn { background: #f5f5f5; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; cursor: pointer; color: #666; }
            .modal-title { font-size: 18px; font-weight: bold; color: #333; }
            
            .capture-container { text-align: center; padding: 20px; background: #f9f9f9; border-radius: 16px; margin-bottom: 16px; }
            .capture-icon { font-size: 64px; margin-bottom: 12px; }
            .capture-hint { font-size: 15px; color: #666; margin-bottom: 16px; }
            .capture-tips { margin-bottom: 20px; }
            .tip { font-size: 12px; color: #999; margin-bottom: 4px; }
            
            .capture-buttons { display: flex; flex-direction: column; gap: 10px; }
            .capture-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .capture-btn-camera { background: linear-gradient(135deg, #FF6B6B, #FF9A63); color: white; }
            .capture-btn-gallery { background: #667eea; color: white; }
            
            .capture-footer { text-align: center; }
            .photo-count { font-size: 12px; color: #999; margin-bottom: 8px; }
            .footer-btn { background: #f5f5f5; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; color: #666; cursor: pointer; }
        </style>
    `;
}

// V150: 手动输入错题
// ============================================================
function manualInputWrongNote() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 返回</button>
            <div class="modal-title">✏️ 手动输入题目</div>
            <button class="close-btn" onclick="closeModal()" style="margin-left:auto;background:#f5f5f5;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div style="padding:4px 0;">
            <div style="margin-bottom:12px;">
                <label style="font-size:13px;color:#666;margin-bottom:6px;display:block;">题目内容</label>
                <textarea id="manual-question-input" style="width:100%;height:120px;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:14px;resize:none;box-sizing:border-box;" placeholder="请输入题目内容，例如：&#10;一个三角形的三边长分别为3、4、5，求这个三角形的面积。"></textarea>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:13px;color:#666;margin-bottom:6px;display:block;">正确答案（可选）</label>
                <input id="manual-answer-input" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:14px;box-sizing:border-box;" placeholder="输入正确答案"/>
            </div>
            <button onclick="submitManualWrongNote()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">📝 AI分析并保存</button>
        </div>
    `;
}

// V150: 提交手动输入的错题
async function submitManualWrongNote() {
    var questionInput = document.getElementById('manual-question-input');
    var answerInput = document.getElementById('manual-answer-input');
    if (!questionInput || !questionInput.value.trim()) {
        showToast('请输入题目内容');
        return;
    }
    var questionText = questionInput.value.trim();
    var answerText = answerInput ? answerInput.value.trim() : '';
    
    // 调用AI解析
    var questionData = await aiParseQuestion(questionText + (answerText ? '\n正确答案：' + answerText : ''));
    
    if (questionData.error) {
        // AI解析失败，直接保存原始文字
        var user = getCurrentUserData() || {};
        user.wrongNotes = user.wrongNotes || [];
        var wrongNote = {
            wrongKey: 'manual-' + Date.now(),
            source: 'manual',
            sourceName: '手动输入',
            topicId: null,
            question: questionText,
            type: 'fill',
            options: [],
            answer: answerText || '待分析',
            explanation: 'AI解析失败，请手动查看',
            userAnswer: '',
            ocrText: questionText,
            time: Date.now()
        };
        user.wrongNotes.push(wrongNote);
        syncUserData(user);
        showToast('✅ 已保存到错题本');
        backToWrongbook();
        return;
    }
    
    // AI解析成功，保存结构化题目
    var user = getCurrentUserData() || {};
    user.wrongNotes = user.wrongNotes || [];
    var wrongKey = 'manual-' + Date.now();
    if (!user.wrongNotes.find(function(n) { return n.wrongKey === wrongKey; })) {
        var wrongNote = {
            wrongKey: wrongKey,
            source: 'manual',
            sourceName: '手动输入',
            topicId: null,
            question: questionData.question,
            type: questionData.type,
            options: questionData.options ? Object.values(questionData.options) : [],
            optionsMap: questionData.options || {},
            answer: questionData.answer,
            correctIndex: getCorrectIndex(questionData.options, questionData.answer),
            explanation: questionData.explanation,
            userAnswer: '',
            ocrText: questionText,
            time: Date.now()
        };
        user.wrongNotes.push(wrongNote);
        syncUserData(user);
    }
    showToast('✅ AI分析完成，已保存到错题本');
    backToWrongbook();
}

window.manualInputWrongNote = manualInputWrongNote;
window.submitManualWrongNote = submitManualWrongNote;

// 拍照上传错题（整合OCR+AI分析）- 完整流程
async function uploadWrongPhotoWithAI(input) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const photoId = 'photo_' + Date.now();
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    // 显示预览和进度
    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageData = e.target.result;
        
        // 显示处理中界面
        content.innerHTML = `
            <div class="processing-header">
                <button class="back-btn" onclick="openWrongPhotoCapture()">← 取消</button>
            </div>
            <div class="processing-container">
                <img src="${imageData}" class="preview-image" id="processing-preview"/>
                <div class="progress-section">
                    <div class="progress-step" id="step-ocr">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">OCR识别中...</span>
                    </div>
                    <div class="progress-step" id="step-ai">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">AI解析中...</span>
                    </div>
                    <div class="progress-step" id="step-save">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">保存中...</span>
                    </div>
                </div>
            </div>
            
            <style>
                .processing-header { margin-bottom: 16px; }
                .processing-container { text-align: center; }
                .preview-image { width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 20px; background: #f5f5f5; }
                .progress-section { background: #f9f9f9; border-radius: 12px; padding: 16px; }
                .progress-step { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #eee; }
                .progress-step:last-child { border-bottom: none; }
                .step-icon { font-size: 18px; }
                .step-text { font-size: 14px; color: #666; }
                .step-done .step-icon { color: #43E97B; }
                .step-error .step-icon { color: #FF6B6B; }
            </style>
        `;
        
        try {
            // 1. 保存图片到 IndexedDB
            updateStepStatus('step-save', 'saving');
            await saveImageFile(photoId, file);
            
            // 记录到用户数据（只存元信息，不存base64）
            const user = getCurrentUserData() || {};
            user.uploadedImages = user.uploadedImages || [];
            user.uploadedImages.push({
                id: photoId,
                imageId: photoId,  // IndexedDB中的ID
                topicId: null,
                source: 'photo',
                time: Date.now()
            });
            syncUserData(user);
            updateStepStatus('step-save', 'done');
            
            // 2. OCR 识别
            updateStepStatus('step-ocr', 'doing');
            let ocrText;
            try {
                ocrText = await ocrExtractText(imageData, function(status, progress) {
                    const stepEl = document.getElementById('step-ocr');
                    if (stepEl) stepEl.querySelector('.step-text').textContent = 'OCR识别中 ' + progress + '%';
                });
            } catch(ocrErr) {
                console.warn('OCR失败，尝试使用DeepSeek视觉:', ocrErr);
                // OCR失败时，尝试直接用DeepSeek视觉API
                ocrText = null;
            }
            
            if (!ocrText || ocrText.length < 5) {
                // OCR没识别到文字，尝试用视觉API
                const visionResult = await callVisionAPI(imageData, '请描述这张图片中的题目内容，尽可能完整地提取所有文字');
                if (visionResult.success) {
                    ocrText = visionResult.content;
                }
            }
            
            updateStepStatus('step-ocr', 'done');
            
            if (!ocrText || ocrText.length < 5) {
                // 仍然没有识别到文字
                showOcrFailedUI(photoId, imageData, '未能识别出文字，请重试或手动输入题目');
                return;
            }
            
            // 3. AI 解析题目
            updateStepStatus('step-ai', 'doing');
            const questionData = await aiParseQuestion(ocrText);
            updateStepStatus('step-ai', 'done');
            
            if (questionData.error) {
                showOcrFailedUI(photoId, imageData, 'AI解析失败: ' + questionData.error);
                return;
            }
            
            // 4. 添加到错题本
            const wrongKey = 'photo-' + photoId;
            user.wrongNotes = user.wrongNotes || [];
            
            // 避免重复添加
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                const wrongNote = {
                    wrongKey: wrongKey,
                    source: 'photo',
                    sourceName: '拍照错题',
                    topicId: null,
                    photoId: photoId,
                    question: questionData.question,
                    type: questionData.type,
                    options: questionData.options ? Object.values(questionData.options) : [],
                    optionsMap: questionData.options || {},
                    answer: questionData.answer,
                    correctIndex: getCorrectIndex(questionData.options, questionData.answer),
                    explanation: questionData.explanation,
                    userAnswer: '',
                    ocrText: ocrText,
                    time: Date.now()
                };
                user.wrongNotes.push(wrongNote);
                syncUserData(user);
            }
            
            // 显示成功结果
            showOcrSuccessUI(questionData, photoId);
            
        } catch(error) {
            console.error('OCR处理失败:', error);
            showOcrFailedUI(photoId, imageData, '处理失败: ' + error.message);
        }
    };
    reader.readAsDataURL(file);
    input.value = '';
}

// 更新步骤状态
function updateStepStatus(stepId, status) {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;
    
    const iconEl = stepEl.querySelector('.step-icon');
    const textEl = stepEl.querySelector('.step-text');
    
    if (status === 'doing') {
        iconEl.textContent = '🔄';
        textEl.style.color = '#667eea';
        stepEl.classList.add('step-doing');
    } else if (status === 'done') {
        iconEl.textContent = '✅';
        textEl.style.color = '#43E97B';
        stepEl.classList.remove('step-doing');
        stepEl.classList.add('step-done');
    } else if (status === 'saving') {
        iconEl.textContent = '💾';
        textEl.textContent = '保存图片...';
    } else if (status === 'error') {
        iconEl.textContent = '❌';
        textEl.style.color = '#FF6B6B';
        stepEl.classList.add('step-error');
    }
}

// 获取正确答案的索引
function getCorrectIndex(optionsMap, answer) {
    if (!optionsMap) return -1;
    for (const [key, val] of Object.entries(optionsMap)) {
        if (val === answer) {
            return ['A', 'B', 'C', 'D'].indexOf(key);
        }
    }
    return -1;
}

// 显示OCR成功结果
function showOcrSuccessUI(questionData, photoId) {
    const content = document.getElementById('detail-content');
    const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
    
    content.innerHTML = `
        <div class="success-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 继续拍照</button>
            <div class="modal-title">✅ 识别成功</div>
        </div>
        
        <div class="success-container">
            <div class="success-icon">🎉</div>
            <div class="success-message">已识别并添加到错题本</div>
            
            <div class="question-preview">
                <div class="q-type">${qTypeNames[questionData.type] || '题目'}</div>
                <div class="q-text">${questionData.question}</div>
                ${questionData.options ? `
                    <div class="q-options">
                        ${Object.entries(questionData.options).map(([k, v]) => `<div class="q-option">${k}. ${v}</div>`).join('')}
                    </div>
                ` : ''}
                <div class="q-answer">正确答案：${questionData.answer}</div>
            </div>
            
            <div class="success-actions">
                <button class="action-btn action-primary" onclick="doWrongQuestionFromPhoto('${photoId}')">
                    📝 开始做题
                </button>
                <button class="action-btn action-secondary" onclick="backToWrongbook()">
                    📒 查看错题本
                </button>
            </div>
        </div>
        
        <style>
            .success-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .success-container { text-align: center; }
            .success-icon { font-size: 64px; margin-bottom: 12px; }
            .success-message { font-size: 16px; color: #43E97B; font-weight: 600; margin-bottom: 20px; }
            
            .question-preview { background: #f9f9f9; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
            .q-type { font-size: 12px; color: #667eea; margin-bottom: 8px; }
            .q-text { font-size: 14px; color: #333; margin-bottom: 12px; line-height: 1.5; }
            .q-options { margin-bottom: 12px; }
            .q-option { font-size: 13px; color: #666; padding: 4px 0; }
            .q-answer { font-size: 13px; color: #43E97B; font-weight: 600; }
            
            .success-actions { display: flex; flex-direction: column; gap: 10px; }
            .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .action-secondary { background: #f5f5f5; color: #666; }
        </style>
    `;
}

// 显示OCR失败结果
function showOcrFailedUI(photoId, imageData, message) {
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="failed-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 重新拍照</button>
            <div class="modal-title">⚠️ 识别失败</div>
        </div>
        
        <div class="failed-container">
            <img src="${imageData}" class="failed-image"/>
            <div class="failed-message">${message}</div>
            
            <div class="failed-tips">
                <div class="tip-title">💡 提高识别率的方法：</div>
                <div class="tip">• 确保光线充足，避免反光</div>
                <div class="tip">• 保持手机稳定，对焦清晰</div>
                <div class="tip">• 尽量拍摄正面，避免倾斜</div>
            </div>
            
            <button class="action-btn action-primary" onclick="openWrongPhotoCapture()">
                🔄 重新拍照
            </button>
        </div>
        
        <style>
            .failed-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .failed-container { text-align: center; }
            .failed-image { width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 16px; background: #f5f5f5; }
            .failed-message { font-size: 14px; color: #FF6B6B; margin-bottom: 16px; }
            .failed-tips { background: #fff9e6; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
            .tip-title { font-size: 13px; color: #ff9500; margin-bottom: 8px; }
            .tip { font-size: 12px; color: #666; margin-bottom: 4px; }
            .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        </style>
    `;
}

// 从照片做题目
async function doWrongQuestionFromPhoto(photoId) {
    const user = getCurrentUserData();
    const note = user?.wrongNotes?.find(n => n.photoId === photoId);
    
    if (!note) {
        showToast('题目不存在');
        return;
    }
    
    // 找到索引
    const index = user.wrongNotes.indexOf(note);
    if (index >= 0) {
        retryWrongNote(index);
    }
}

// ============================================================
// 照片库
// ============================================================

function showWrongPhotoGallery() {
    const user = getCurrentUserData() || {};
    const photos = user.uploadedImages || [];
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    if (photos.length === 0) {
        content.innerHTML = `
            <div class="gallery-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">📁 错题照片库</div>
            </div>
            <div class="gallery-empty">
                <div class="empty-icon">📂</div>
                <div class="empty-title">暂无错题照片</div>
                <div class="empty-desc">开始拍照上传吧！</div>
            </div>
            <button class="action-btn action-primary" onclick="openWrongPhotoCapture()">📷 拍照上传</button>
            
            <style>
                .gallery-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .gallery-empty { text-align: center; padding: 40px 20px; }
                .empty-icon { font-size: 64px; margin-bottom: 12px; }
                .empty-title { font-size: 16px; color: #666; margin-bottom: 4px; }
                .empty-desc { font-size: 13px; color: #999; }
                .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 16px; }
                .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            </style>
        `;
        return;
    }
    
    // 加载图片
    let photosHtml = '';
    let loadedCount = 0;
    let totalCount = photos.length;
    
    photos.forEach(function(p, idx) {
        const photoId = p.imageId || p.id;
        
        // 默认显示loading占位图
        photosHtml += `<div class="photo-item" id="photo-item-${photoId}" data-index="${idx}">
            <div class="photo-placeholder">
                <div class="loading-spinner"></div>
            </div>
            <button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>
        </div>`;
    });
    
    content.innerHTML = `
        <div class="gallery-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">📁 错题照片库 (${photos.length}张)</div>
        </div>
        <button class="add-photo-btn" onclick="openWrongPhotoCapture()">+ 添加照片</button>
        <div class="photo-grid" id="photo-grid">
            ${photosHtml}
        </div>
        <button class="back-bottom-btn" onclick="backToWrongbook()">← 返回错题本</button>
        
        <style>
            .gallery-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .add-photo-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 16px; }
            .photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 400px; overflow-y: auto; margin-bottom: 16px; }
            .photo-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #f0f0f0; cursor: pointer; }
            .photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
            .loading-spinner { width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
            .photo-item img { width: 100%; height: 100%; object-fit: cover; }
            .photo-delete-btn { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; font-size: 14px; cursor: pointer; line-height: 24px; }
            .back-bottom-btn { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
    
    // 异步加载图片
    photos.forEach(async function(p, idx) {
        const photoId = p.imageId || p.id;
        const itemEl = document.getElementById('photo-item-' + photoId);
        if (!itemEl) return;
        
        try {
            let imageUrl = null;
            
            // 优先从IndexedDB读取
            if (typeof getImageFileAsDataUrl === 'function') {
                imageUrl = await getImageFileAsDataUrl(photoId);
            }
            
            // 如果没有，尝试旧的base64格式
            if (!imageUrl && p.image) {
                imageUrl = p.image;
            }
            
            if (imageUrl) {
                itemEl.innerHTML = `<img src="${imageUrl}" onclick="analyzePhotoWithAI('${photoId}')"/>` +
                    `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>` +
                    `<button class="photo-ai-btn" onclick="event.stopPropagation(); analyzePhotoWithAI('${photoId}')">🤖 AI识别</button>`;
            } else {
                itemEl.innerHTML = `<div class="photo-placeholder"><span style="font-size:24px;">🖼️</span></div>` +
                    `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>`;
            }
        } catch(e) {
            console.warn('加载图片失败:', photoId, e);
            itemEl.innerHTML = `<div class="photo-placeholder"><span style="font-size:24px;">🖼️</span></div>` +
                `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>`;
        }
    });
}

// 删除照片并清理IndexedDB
async function deleteWrongPhotoWithCleanup(photoId) {
    if (!confirm('确定要删除这张照片吗？')) return;
    
    try {
        // 从IndexedDB删除图片
        if (typeof deleteImageFile === 'function') {
            await deleteImageFile(photoId);
        }
    } catch(e) {
        console.warn('删除IndexedDB图片失败:', e);
    }
    
    // 从用户数据删除
    const user = getCurrentUserData() || {};
    user.uploadedImages = user.uploadedImages || [];
    user.uploadedImages = user.uploadedImages.filter(function(p) { 
        return (p.imageId || p.id) !== photoId; 
    });
    syncUserData(user);
    
    showToast('已删除');
    showWrongPhotoGallery();
}

// AI识别照片
async function analyzePhotoWithAI(photoId) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    // 显示加载中
    content.innerHTML = `
        <div class="analyze-header">
            <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
            <div class="modal-title">🤖 AI识别中</div>
        </div>
        <div class="analyze-loading">
            <div class="loading-icon">🔄</div>
            <div class="loading-text">正在识别题目...</div>
            <div class="loading-steps">
                <div class="step" id="analyze-step-1">⏳ 读取图片</div>
                <div class="step" id="analyze-step-2">⏳ OCR识别</div>
                <div class="step" id="analyze-step-3">⏳ AI解析</div>
            </div>
        </div>
        
        <style>
            .analyze-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .analyze-loading { text-align: center; padding: 40px 20px; }
            .loading-icon { font-size: 48px; margin-bottom: 16px; animation: spin 1s linear infinite; }
            .loading-text { font-size: 16px; color: #666; margin-bottom: 20px; }
            .loading-steps { background: #f9f9f9; border-radius: 12px; padding: 16px; }
            .step { font-size: 14px; color: #666; padding: 8px 0; }
            .step.done { color: #43E97B; }
        </style>
    `;
    
    try {
        // 1. 读取图片
        updateAnalyzeStep(1, 'doing', '读取图片');
        let imageUrl = null;
        
        if (typeof getImageFileAsDataUrl === 'function') {
            imageUrl = await getImageFileAsDataUrl(photoId);
        }
        
        // 尝试从用户数据获取旧格式
        if (!imageUrl) {
            const user = getCurrentUserData() || {};
            const photo = user.uploadedImages?.find(p => (p.imageId || p.id) === photoId);
            if (photo && photo.image) {
                imageUrl = photo.image;
            }
        }
        
        if (!imageUrl) {
            throw new Error('图片不存在');
        }
        
        updateAnalyzeStep(1, 'done', '读取图片');
        
        // 2. OCR识别
        updateAnalyzeStep(2, 'doing', 'OCR识别');
        let ocrText;
        try {
            ocrText = await ocrExtractText(imageUrl);
        } catch(ocrErr) {
            console.warn('OCR失败:', ocrErr);
        }
        
        if (!ocrText || ocrText.length < 5) {
            // 尝试用视觉API
            const visionResult = await callVisionAPI(imageUrl, '请描述这张图片中的题目内容，尽可能完整地提取所有文字');
            if (visionResult.success) {
                ocrText = visionResult.content;
            }
        }
        updateAnalyzeStep(2, 'done', 'OCR识别');
        
        if (!ocrText || ocrText.length < 5) {
            content.innerHTML = `
                <div class="analyze-header">
                    <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                    <div class="modal-title">⚠️ 识别失败</div>
                </div>
                <div class="analyze-result">
                    <div class="result-icon">😕</div>
                    <div class="result-message">未能识别出文字</div>
                    <div class="result-tips">请尝试重新拍照，确保图片清晰</div>
                </div>
                <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
            `;
            return;
        }
        
        // 3. AI解析
        updateAnalyzeStep(3, 'doing', 'AI解析');
        const questionData = await aiParseQuestion(ocrText);
        updateAnalyzeStep(3, 'done', 'AI解析');
        
        if (questionData.error) {
            content.innerHTML = `
                <div class="analyze-header">
                    <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                    <div class="modal-title">⚠️ 解析失败</div>
                </div>
                <div class="analyze-result">
                    <div class="result-icon">😅</div>
                    <div class="result-message">${questionData.error}</div>
                </div>
                <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
            `;
            return;
        }
        
        // 4. 添加到错题本
        const wrongKey = 'photo-' + photoId;
        const user = getCurrentUserData();
        
        // 检查是否已存在
        if (!user.wrongNotes) user.wrongNotes = [];
        
        const existingIndex = user.wrongNotes.findIndex(n => n.wrongKey === wrongKey);
        
        const wrongNote = {
            wrongKey: wrongKey,
            source: 'photo',
            sourceName: '拍照错题',
            topicId: null,
            photoId: photoId,
            question: questionData.question,
            type: questionData.type,
            options: questionData.options ? Object.values(questionData.options) : [],
            optionsMap: questionData.options || {},
            answer: questionData.answer,
            correctIndex: getCorrectIndex(questionData.options, questionData.answer),
            explanation: questionData.explanation,
            userAnswer: '',
            ocrText: ocrText,
            time: Date.now()
        };
        
        if (existingIndex >= 0) {
            user.wrongNotes[existingIndex] = wrongNote;
        } else {
            user.wrongNotes.push(wrongNote);
        }
        syncUserData(user);
        
        // 显示结果
        const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
        content.innerHTML = `
            <div class="analyze-header">
                <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                <div class="modal-title">✅ 识别成功</div>
            </div>
            <div class="analyze-result">
                <div class="result-icon">🎉</div>
                <div class="result-message">已添加到错题本</div>
                
                <div class="question-card">
                    <div class="q-type-tag">${qTypeNames[questionData.type] || '题目'}</div>
                    <div class="q-content">${questionData.question}</div>
                    ${questionData.options ? `
                        <div class="q-options-list">
                            ${Object.entries(questionData.options).map(([k, v]) => `<div class="q-option-item">${k}. ${v}</div>`).join('')}
                        </div>
                    ` : ''}
                    <div class="q-answer-tag">✓ 正确答案：${questionData.answer}</div>
                </div>
                
                <div class="result-actions">
                    <button class="action-btn-primary" onclick="doWrongQuestionFromPhoto('${photoId}')">📝 开始做题</button>
                    <button class="action-btn-secondary" onclick="backToWrongbook()">📒 查看错题本</button>
                </div>
            </div>
            
            <style>
                .analyze-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .analyze-result { text-align: center; }
                .result-icon { font-size: 64px; margin-bottom: 12px; }
                .result-message { font-size: 16px; color: #43E97B; font-weight: 600; margin-bottom: 20px; }
                .result-tips { font-size: 13px; color: #999; margin-bottom: 20px; }
                .question-card { background: #f9f9f9; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
                .q-type-tag { font-size: 11px; color: #667eea; background: #e8e8ff; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
                .q-content { font-size: 14px; color: #333; line-height: 1.5; margin-bottom: 12px; }
                .q-options-list { margin-bottom: 12px; }
                .q-option-item { font-size: 13px; color: #666; padding: 3px 0; }
                .q-answer-tag { font-size: 13px; color: #43E97B; font-weight: 600; }
                .result-actions { display: flex; flex-direction: column; gap: 10px; }
                .action-btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
                .action-btn-secondary { width: 100%; padding: 14px; background: #f5f5f5; color: #666; border: none; border-radius: 12px; font-size: 15px; cursor: pointer; }
                .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; margin-top: 16px; }
            </style>
        `;
        
    } catch(error) {
        console.error('AI识别失败:', error);
        content.innerHTML = `
            <div class="analyze-header">
                <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                <div class="modal-title">❌ 识别失败</div>
            </div>
            <div class="analyze-result">
                <div class="result-icon">😢</div>
                <div class="result-message">${error.message}</div>
            </div>
            <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
        `;
    }
}

// 更新识别步骤
function updateAnalyzeStep(stepNum, status, text) {
    const stepEl = document.getElementById('analyze-step-' + stepNum);
    if (!stepEl) return;
    
    if (status === 'doing') {
        stepEl.textContent = '🔄 ' + text;
        stepEl.style.color = '#667eea';
    } else if (status === 'done') {
        stepEl.textContent = '✅ ' + text;
        stepEl.style.color = '#43E97B';
        stepEl.classList.add('done');
    }
}

// ============================================================
// 错题本主页返回函数
// ============================================================

function backToWrongbook() {
    // 1. 关闭 detail-modal
    document.getElementById('detail-modal').classList.remove('show');
    
    // 2. 重新渲染错题本主页到 fullscreen-content
    var contentEl = document.getElementById('fullscreen-content');
    if (contentEl) {
        renderWrongbook(contentEl);
    }
}

// ============================================================
// 错题重练（完善版 - 支持所有题型）
// ============================================================

function retryWrongNote(index) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[index];
    if (!note) { showToast('错题不存在'); return; }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
    const noteType = note.type || (note.options && note.options.length > 0 ? 'choice' : 'fill');
    
    let questionHTML = `
        <div class="retry-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">🔄 错题重练</div>
        </div>
        
        <div class="retry-container">
            <div class="retry-source">
                <span class="source-tag" style="background:${getSourceColor(note.source)}">${note.sourceName || '练习'}</span>
                <span class="type-tag">${qTypeNames[noteType] || '题目'}</span>
            </div>
            
            <div class="retry-question">${note.question}</div>
            
            ${note.options && note.options.length > 0 ? `
                <div class="retry-options" id="retry-options-container">
                    ${note.options.map((opt, oi) => `
                        <button class="option-btn" data-index="${oi}" onclick="selectRetryOption(this, ${index}, ${oi})">
                            <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
                            <span class="option-text">${opt}</span>
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="retry-selected-option" value="-1">
            ` : `
                <div class="retry-input-area">
                    <textarea id="retry-text-answer" class="retry-textarea" placeholder="请输入你的答案..."></textarea>
                </div>
            `}
            
            <div id="retry-result-area" style="display:none;"></div>
            
            <div class="retry-actions">
                ${note.options && note.options.length > 0 ? `
                    <button class="submit-btn" id="retry-submit-btn" onclick="submitRetryChoiceAnswer(${index})" disabled>提交答案</button>
                ` : `
                    <button class="submit-btn" id="retry-submit-btn" onclick="submitRetryTextAnswer(${index})">提交答案</button>
                `}
                <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            </div>
        </div>
        
        <style>
            .retry-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .retry-container { }
            .retry-source { display: flex; gap: 8px; margin-bottom: 12px; }
            .source-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; color: white; }
            .type-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #e8e8ff; color: #667eea; }
            
            .retry-question { background: linear-gradient(135deg, #f5f7ff, #e8f4ff); border-radius: 12px; padding: 16px; font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 16px; }
            
            .retry-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
            .option-btn { display: flex; align-items: center; gap: 12px; padding: 14px; background: white; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s; }
            .option-btn:hover { border-color: #667eea; background: #f5f7ff; }
            .option-btn.selected { border-color: #667eea; background: #e8e8ff; }
            .option-btn.correct { border-color: #43E97B; background: #d4edda; }
            .option-btn.wrong { border-color: #FF6B6B; background: #f8d7da; }
            .option-letter { width: 28px; height: 28px; background: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
            .option-text { font-size: 14px; color: #333; flex: 1; }
            
            .retry-input-area { margin-bottom: 16px; }
            .retry-textarea { width: 100%; height: 100px; padding: 12px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 14px; resize: none; box-sizing: border-box; }
            .retry-textarea:focus { outline: none; border-color: #667eea; }
            
            .retry-result { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            .result-correct { background: #d4edda; border: 2px solid #43E97B; }
            .result-wrong { background: #f8d7da; border: 2px solid #FF6B6B; }
            .result-icon { font-size: 32px; margin-bottom: 8px; }
            .result-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
            .result-correct .result-title { color: #155724; }
            .result-wrong .result-title { color: #721c24; }
            .result-detail { font-size: 13px; color: #666; margin-bottom: 8px; }
            .result-explanation { font-size: 12px; color: #666; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px; margin-top: 8px; }
            
            .retry-actions { display: flex; flex-direction: column; gap: 10px; }
            .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
            .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
    
    content.innerHTML = questionHTML;
}

// 选择选项
function selectRetryOption(el, noteIndex, optionIndex) {
    // 移除其他选项的选中状态
    document.querySelectorAll('.option-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });
    
    // 选中当前选项
    el.classList.add('selected');
    
    // 保存选择
    document.getElementById('retry-selected-option').value = optionIndex;
    
    // 启用提交按钮
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

// 提交选择题答案
function submitRetryChoiceAnswer(noteIndex) {
    const selectedOption = parseInt(document.getElementById('retry-selected-option').value);
    if (selectedOption < 0) {
        showToast('请选择一个答案');
        return;
    }
    
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[noteIndex];
    if (!note) return;
    
    const correctIndex = note.correctIndex;
    const isCorrect = selectedOption === correctIndex;
    
    // 显示结果
    const resultArea = document.getElementById('retry-result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
        <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
            <div class="result-icon">${isCorrect ? '🎉' : '😢'}</div>
            <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
            ${!isCorrect ? `<div class="result-detail">你的答案：${String.fromCharCode(65 + selectedOption)}. ${note.options[selectedOption]}</div>` : ''}
            <div class="result-detail" style="color: ${isCorrect ? '#43E97B' : '#43E97B'};">正确答案：${String.fromCharCode(65 + correctIndex)}. ${note.options[correctIndex]}</div>
            ${note.explanation ? `<div class="result-explanation">💡 解析：${note.explanation}</div>` : ''}
        </div>
    `;
    
    // 更新错题状态
    note.userAnswer = String.fromCharCode(65 + selectedOption) + '. ' + note.options[selectedOption];
    if (isCorrect) {
        note.reviewed = true;
        showToast('太棒了！回答正确！');
    }
    syncUserData(user);
    
    // 禁用选项按钮
    document.querySelectorAll('.option-btn').forEach(function(btn, i) {
        btn.style.cursor = 'default';
        if (i === correctIndex) {
            btn.classList.add('correct');
        } else if (i === selectedOption && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 隐藏提交按钮
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
    // V145修复：记录练习数据
    if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
}

// 提交填空/计算题答案（AI智能批改）
async function submitRetryTextAnswer(noteIndex) {
    const textarea = document.getElementById('retry-text-answer');
    const userAns = textarea ? textarea.value.trim() : '';
    
    if (!userAns) {
        showToast('请输入答案');
        return;
    }
    
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[noteIndex];
    if (!note) return;
    
    const correctAnswer = note.answer;
    
    // 显示加载中
    const resultArea = document.getElementById('retry-result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
        <div class="retry-result" style="background: #f9f9f9;">
            <div class="loading-icon" style="font-size: 24px;">🤖 AI批改中...</div>
        </div>
    `;
    
    // 调用AI判断答案
    try {
        const prompt = `请判断用户的答案是否正确。

题目：${note.question}
正确答案：${correctAnswer}
用户答案：${userAns}

请用以下JSON格式返回判断结果：
{
    "isCorrect": true/false,
    "similarity": 0-100的相似度百分比,
    "feedback": "简短的反馈意见"
}

注意：允许合理的等价表达方式（如"2/3"和"0.666"都算正确），数学表达式等价也算正确。`;

        const messages = [
            { role: 'system', content: '你是一个智能的作业批改AI，能够理解学生答案的等价表达。' },
            { role: 'user', content: prompt }
        ];
        
        const result = await callDeepSeekAPI(messages, 0.3);
        
        let isCorrect = false;
        let feedback = '';
        
        if (result.success) {
            // 解析JSON结果
            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    isCorrect = parsed.isCorrect || parsed.similarity > 70;
                    feedback = parsed.feedback || '';
                } catch(e) {
                    // JSON解析失败，使用模糊匹配
                    isCorrect = fuzzyMatch(userAns, correctAnswer);
                }
            } else {
                isCorrect = fuzzyMatch(userAns, correctAnswer);
            }
        } else {
            // API失败，使用本地模糊匹配
            isCorrect = fuzzyMatch(userAns, correctAnswer);
        }
        
        // 显示结果
        resultArea.innerHTML = `
            <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
                <div class="result-icon">${isCorrect ? '🎉' : '😢'}</div>
                <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
                <div class="result-detail">你的答案：${userAns}</div>
                <div class="result-detail" style="color: #43E97B;">正确答案：${correctAnswer}</div>
                ${feedback ? `<div class="result-explanation">💡 ${feedback}</div>` : ''}
                ${note.explanation ? `<div class="result-explanation">📖 解析：${note.explanation}</div>` : ''}
            </div>
        `;
        
        // 更新错题状态
        note.userAnswer = userAns;
        if (isCorrect) {
            note.reviewed = true;
            showToast('太棒了！回答正确！');
        }
        syncUserData(user);
        // V145修复：记录练习数据
        if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
        
    } catch(error) {
        console.error('AI批改失败:', error);
        // 使用本地模糊匹配作为备选
        const isCorrect = fuzzyMatch(userAns, correctAnswer);
        
        resultArea.innerHTML = `
            <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
                <div class="result-icon">${isCorrect ? '🎉' : '❌'}</div>
                <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
                <div class="result-detail">你的答案：${userAns}</div>
                <div class="result-detail" style="color: #43E97B;">正确答案：${correctAnswer}</div>
                ${note.explanation ? `<div class="result-explanation">📖 解析：${note.explanation}</div>` : ''}
            </div>
        `;
        
        note.userAnswer = userAns;
        if (isCorrect) {
            note.reviewed = true;
        }
        syncUserData(user);
        // V145修复：记录练习数据（catch块也记录）
        if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
    }
    
    // 禁用输入框和提交按钮
    textarea.disabled = true;
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

// 模糊匹配答案（本地备选方案）
function fuzzyMatch(userAns, correctAns) {
    // 移除空格和标点
    const normalize = function(s) {
        return s.toLowerCase()
            .replace(/[\s\.,，。、；;]/g, '')
            .replace(/（/g, '(')
            .replace(/）/g, ')');
    };
    
    const normUser = normalize(userAns);
    const normCorrect = normalize(correctAns);
    
    // 完全匹配
    if (normUser === normCorrect) return true;
    
    // 数字比较（处理小数精度问题）
    const numUser = parseFloat(normUser);
    const numCorrect = parseFloat(normCorrect);
    if (!isNaN(numUser) && !isNaN(numCorrect)) {
        const diff = Math.abs(numUser - numCorrect);
        const tolerance = Math.max(0.001, Math.abs(numCorrect) * 0.001);
        if (diff < tolerance) return true;
    }
    
    // 包含匹配
    if (normUser.includes(normCorrect) || normCorrect.includes(normUser)) return true;
    
    // 分数比较
    const fractionMatch = normUser.match(/^(\d+)\/(\d+)$/);
    const fractionCorrect = normCorrect.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch && fractionCorrect) {
        const u = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        const c = parseInt(fractionCorrect[1]) / parseInt(fractionCorrect[2]);
        if (Math.abs(u - c) < 0.001) return true;
    }
    
    return false;
}

// ============================================================
// AI分析错题
// ============================================================

async function analyzeWrongNoteWithAI(index) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[index];
    if (!note) { showToast('错题不存在'); return; }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    // 显示加载中
    content.innerHTML = `
        <div class="ai-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">🤖 AI分析</div>
        </div>
        <div class="ai-loading">
            <div class="loading-icon">🤖</div>
            <div class="loading-text">AI正在深度分析中...</div>
        </div>
        
        <style>
            .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .ai-loading { text-align: center; padding: 40px; }
            .loading-icon { font-size: 48px; margin-bottom: 16px; }
            .loading-text { font-size: 14px; color: #666; }
        </style>
    `;
    
    try {
        const prompt = `请详细分析这道错题，帮助学生理解错误原因并掌握正确解法：

【题目】
${note.question}
${note.options ? '\n【选项】\n' + note.options.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('\n') : ''}

【正确答案】
${note.answer}

【学生的错误答案】
${note.userAnswer || '未知'}

【解析】
${note.explanation || '无'}

请从以下几个方面进行分析：
1. 错误原因分析：学生为什么会做错？
2. 知识点讲解：涉及哪些知识点？
3. 正确解题思路：应该怎么做？
4. 易错点提示：做这类题要注意什么？
5. 举一反三：出一道类似的练习题（附答案）`;

        const messages = [
            { role: 'system', content: '你是一位专业、耐心的初中数学老师，擅长分析学生的错题，给出详细易懂的讲解。请用清晰的结构回答。' },
            { role: 'user', content: prompt }
        ];
        
        const result = await callDeepSeekAPI(messages, 0.7);
        
        if (result.error) {
            content.innerHTML = `
                <div class="ai-header">
                    <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                    <div class="modal-title">⚠️ AI分析失败</div>
                </div>
                <div class="ai-error">
                    <div class="error-icon">😢</div>
                    <div class="error-message">${result.message}</div>
                    <button class="retry-btn" onclick="analyzeWrongNoteWithAI(${index})">🔄 重试</button>
                </div>
                <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            `;
            return;
        }
        
        // 显示分析结果
        const analysisContent = result.content.replace(/\n/g, '<br>');
        
        content.innerHTML = `
            <div class="ai-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">🤖 AI分析结果</div>
            </div>
            
            <div class="ai-result">
                <div class="question-brief">
                    <div class="brief-label">题目</div>
                    <div class="brief-content">${note.question}</div>
                </div>
                
                <div class="analysis-content">
                    ${analysisContent}
                </div>
                
                <button class="speak-btn" onclick="speakText(this.previousElementSibling.textContent)">🔊 朗读</button>
            </div>
            
            <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            
            <style>
                .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .ai-result { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; max-height: 400px; overflow-y: auto; }
                .question-brief { background: white; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
                .brief-label { font-size: 11px; color: #667eea; margin-bottom: 4px; }
                .brief-content { font-size: 13px; color: #333; line-height: 1.5; }
                .analysis-content { font-size: 13px; line-height: 1.8; color: #333; }
                .analysis-content br { display: block; margin: 4px 0; }
                .speak-btn { width: 100%; padding: 10px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; margin-bottom: 16px; }
                .ai-error { text-align: center; padding: 40px; }
                .error-icon { font-size: 48px; margin-bottom: 12px; }
                .error-message { font-size: 14px; color: #FF6B6B; margin-bottom: 16px; }
                .retry-btn { padding: 10px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
                .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
            </style>
        `;
        
        // 记录调用
        if (typeof recordDeepSeekCall === 'function') {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
        }
        
    } catch(error) {
        console.error('AI分析失败:', error);
        content.innerHTML = `
            <div class="ai-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">❌ 分析失败</div>
            </div>
            <div class="ai-error">
                <div class="error-icon">😢</div>
                <div class="error-message">${error.message}</div>
            </div>
            <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
        `;
    }
}

// ============================================================
// 其他功能
// ============================================================

function markWrongNoteReviewed(index) {
    const user = getCurrentUserData();
    if (!user || !user.wrongNotes || !user.wrongNotes[index]) return;
    user.wrongNotes[index].reviewed = true;
    syncUserData(user);
    showToast('✅ 已标记为已复习');
    
    // 刷新显示
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (modal && content) {
        renderWrongbook(content);
    }
}

function removeWrongNote(index) {
    if (!confirm('确定要删除这道错题吗？')) return;
    
    const user = getCurrentUserData();
    if (user && user.wrongNotes) {
        user.wrongNotes.splice(index, 1);
        syncUserData(user);
        showToast('已移除错题');
        
        // 刷新显示
        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');
        if (modal && content) {
            renderWrongbook(content);
        }
    }
}

function reviewAllWrongNotes() {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const unreviewed = wrongNotes.filter(n => !n.reviewed);
    
    if (unreviewed.length === 0) {
        showToast('所有错题已复习完毕！');
        return;
    }
    
    // 从第一个未复习的开始
    const firstUnreviewedIndex = wrongNotes.findIndex(n => !n.reviewed);
    if (firstUnreviewedIndex >= 0) {
        retryWrongNote(firstUnreviewedIndex);
    }
}

function clearWrongNotes() {
    if (!confirm('确定要清空所有错题记录吗？')) return;
    
    const user = getCurrentUserData();
    if (user) {
        user.wrongNotes = [];
        syncUserData(user);
        showToast('错题本已清空');
        
        // 刷新显示
        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');
        if (modal && content) {
            renderWrongbook(content);
        }
    }
}

// ============================================================
// Window Exports
// ============================================================
window.renderWrongbook = renderWrongbook;
window.backToWrongbook = backToWrongbook;
window.openWrongPhotoCapture = openWrongPhotoCapture;
window.uploadWrongPhotoWithAI = uploadWrongPhotoWithAI;
window.showWrongPhotoGallery = showWrongPhotoGallery;
window.analyzePhotoWithAI = analyzePhotoWithAI;
window.doWrongQuestionFromPhoto = doWrongQuestionFromPhoto;
window.retryWrongNote = retryWrongNote;
window.selectRetryOption = selectRetryOption;
window.submitRetryChoiceAnswer = submitRetryChoiceAnswer;
window.submitRetryTextAnswer = submitRetryTextAnswer;
window.analyzeWrongNoteWithAI = analyzeWrongNoteWithAI;
window.markWrongNoteReviewed = markWrongNoteReviewed;
window.removeWrongNote = removeWrongNote;
window.clearWrongNotes = clearWrongNotes;
window.reviewAllWrongNotes = reviewAllWrongNotes;
window.deleteWrongPhotoWithCleanup = deleteWrongPhotoWithCleanup;
window.viewWrongNotes = viewWrongNotes;
window.openFeedback = openFeedback;
window.submitFeedback = submitFeedback;

// V148-fix: 添加缺失的window导出，确保内联onclick能正常工作
window.updateStepStatus = updateStepStatus;
window.getSourceColor = getSourceColor;
window.getCorrectIndex = getCorrectIndex;
window.showOcrSuccessUI = showOcrSuccessUI;
window.showOcrFailedUI = showOcrFailedUI;
window.updateAnalyzeStep = updateAnalyzeStep;
window.retryWrongNote = retryWrongNote;

// 从设置面板打开错题本
function viewWrongNotes() {
    closeSettingsPanel();
    openFullscreenPage('wrongbook');
}

function openFeedback() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="closeDetail()">← 返回</button>
            <div class="modal-title">💬 反馈建议</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <textarea id="feedback-text" style="width:100%;height:120px;border:1px solid #ddd;border-radius:8px;padding:12px;font-size:14px;resize:none;box-sizing:border-box;" placeholder="请描述您的问题或建议..."></textarea>
        </div>
        <button onclick="submitFeedback()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">提交反馈</button>
        <button class="back-btn-full" onclick="closeDetail()">关闭</button>
        
        <style>
            .modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
}

function submitFeedback() {
    const text = document.getElementById('feedback-text').value.trim();
    if (!text) {
        showToast('请输入反馈内容');
        return;
    }
    closeDetail();
    showToast('感谢您的反馈！我们会认真处理');
}

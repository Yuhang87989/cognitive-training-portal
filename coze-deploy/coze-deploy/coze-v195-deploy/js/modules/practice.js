// 版本: V226 - ES6 Module
// AI精准练模块

export const practiceModule = {
    name: 'practice',
    icon: '🎯',
    render: renderPractice
};

// 注册到CTM模块系统
if (typeof CTM !== 'undefined' && CTM.registerModule) {
    CTM.registerModule('practice', practiceModule);
}

function renderPractice(container) {
    const user = getCurrentUserData();
    const stats = user?.practiceStats || {total: 0, correct: 0, weakPoints: 0};
    const wrongNotes = user?.wrongNotes || [];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎯 AI精准练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">智能诊断薄弱点，针对性练习提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div style="text-align:center;padding:16px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;">${stats.total}</div>
                    <div style="font-size:12px;color:#666;">总题数</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0fff4;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;">${stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0}%</div>
                    <div style="font-size:12px;color:#666;">正确率</div>
                </div>
                <div style="text-align:center;padding:16px;background:#fff5f5;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${wrongNotes.length}</div>
                    <div style="font-size:12px;color:#666;">薄弱点</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照识别题目</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">拍下题目图片，AI识别并生成可答题</p>
            <input type="file" id="practice-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoToQuestion(this)"/>
            <button class="camera-btn" onclick="document.getElementById('practice-photo-input').click()">📷 拍照识别</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">✏️ 手动输入题目</h4>
            <textarea id="practice-input" placeholder="输入你的问题..." style="width:100%;height:80px;padding:12px;border:1px solid #ddd;border-radius:12px;font-size:14px;resize:none;"></textarea>
            <button onclick="submitPracticeQuestion()" style="margin-top:12px;width:100%;padding:14px;background:linear-gradient(135deg,#3377FF,#4A90E2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔍 AI解答</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📒 错题本</h4>
            <button onclick="openFullscreenPage('wrongbook')" style="width:100%;padding:14px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">查看错题 (${wrongNotes.length})</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">🤖 AI解说</h4>
            <p style="color:#666;font-size:12px;margin-bottom:12px;">任何学习问题，AI帮你详细解说</p>
            <textarea id="practice-ai-question" placeholder="例如：一元二次方程怎么解？" style="width:100%;height:60px;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:13px;resize:none;"></textarea>
            <button onclick="askPracticeAI()" style="margin-top:10px;width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI解说</button>
        </div>
    `;
}

window.renderPractice = renderPractice;

// ============================================================
// 拍照上传处理函数
// ============================================================

// 处理母题训练的拍照上传
function handlePracticePhoto(input) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // 显示预览和分析弹窗
        showPracticePhotoModal(imageData);
        
        // 清空input
        input.value = '';
    };
    
    reader.onerror = function() {
        showToast('图片读取失败，请重试');
    };
    
    reader.readAsDataURL(file);
}

// 显示拍照分析弹窗
function showPracticePhotoModal(imageData) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📷 题目图片分析</div>
        <div class="card" style="padding:12px;">
            <img src="${imageData}" style="width:100%;max-height:250px;object-fit:contain;border-radius:8px;margin-bottom:12px;"/>
            <div id="practice-photo-preview-info" style="font-size:12px;color:#666;margin-bottom:8px;">✅ 图片已准备好</div>
        </div>
        <div style="margin-top:12px;">
            <textarea id="practice-photo-question" placeholder="请描述你想问的问题（可选）..." style="width:100%;height:60px;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:13px;resize:none;"></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                <button onclick="analyzePracticePhoto('${imageData.replace(/'/g, "\\'")}')" style="padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI分析</button>
                <button onclick="closeModal()" style="padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">取消</button>
            </div>
        </div>
        <div id="practice-photo-result" style="margin-top:12px;"></div>
    `;
}

// 分析拍照图片
async function analyzePracticePhoto(imageData) {
    const resultDiv = document.getElementById('practice-photo-result');
    const question = document.getElementById('practice-photo-question');
    const questionText = question ? question.value.trim() : '';
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在分析中...</div></div>';
    
    const analysisPrompt = questionText ? 
        '用户问题：' + questionText + '\n\n请分析这张图片中的题目，并回答用户的问题。' :
        '请分析这张图片中的题目内容，给出：\n1. 题目识别结果\n2. 详细解答\n3. 相关知识点\n4. 举一反三练习';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位专业的数学辅导老师，擅长分析学生拍摄的题目照片，给出详细的讲解和解答。请用清晰的结构化格式回答。'},
            {role: 'user', content: analysisPrompt}
        ];
        
        // 如果有图片，尝试使用视觉API（callVisionAPI已支持DeepSeek回退）
        const visionResult = await callVisionAPI(imageData, analysisPrompt);
        if (visionResult.success) {
            messages[1] = {role: 'user', content: '[图片内容分析结果：' + visionResult.content + ']\n\n' + analysisPrompt};
        }
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ 分析失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            // 记录调用
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#667eea;font-weight:600;">🤖 AI分析结果</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('分析失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ 网络错误，请检查网络后重试<br><button onclick="analyzePracticePhoto(\'' + imageData.replace(/'/g, "\\'") + '\')" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">重试</button></div>';
    }
}

// 通用拍照上传处理函数（供其他模块调用）
function handleQuestionPhoto(input, resultContainerId) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        const resultContainer = document.getElementById(resultContainerId);
        
        if (resultContainer) {
            // 显示预览
            resultContainer.innerHTML = '<div style="padding:8px;background:#f5f7ff;border-radius:8px;margin-bottom:8px;">' +
                '<img src="' + imageData + '" style="width:100%;max-height:150px;object-fit:contain;border-radius:6px;"/>' +
                '<div style="font-size:11px;color:#666;margin-top:4px;">✅ 图片已上传</div></div>';
        }
        
        // 存储当前图片数据供后续分析使用
        window.currentQuestionPhoto = imageData;
        showToast('图片已上传，可点击AI分析按钮');
    };
    
    reader.onerror = function() {
        showToast('图片读取失败');
    };
    
    reader.readAsDataURL(file);
}

// 导出函数
window.handlePracticePhoto = handlePracticePhoto;
window.showPracticePhotoModal = showPracticePhotoModal;
window.analyzePracticePhoto = analyzePracticePhoto;
window.handleQuestionPhoto = handleQuestionPhoto;

// ============================================================
// AI问题解答 - submitPracticeQuestion
// ============================================================
async function submitPracticeQuestion() {
    const input = document.getElementById('practice-input');
    if (!input) return;
    
    const question = input.value.trim();
    if (!question) {
        showToast('请输入你的问题');
        return;
    }
    
    // 创建结果显示区域
    let resultDiv = document.getElementById('practice-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'practice-result';
        input.parentElement.appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #3377FF;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在分析...</div></div>';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位专业的学习辅导老师，擅长解答学生的各种学科问题。请用清晰、结构化的方式回答，特别是数学题目要给出详细步骤。'},
            {role: 'user', content: question}
        ];
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 解答失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;margin-top:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#3377FF;font-weight:600;">🤖 AI解答</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#3377FF;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('解答失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请检查网络后重试</div>';
    }
}

// ============================================================
// AI学习解说 - askPracticeAI
// ============================================================
async function askPracticeAI() {
    const input = document.getElementById('practice-ai-question');
    if (!input) return;
    
    const question = input.value.trim();
    if (!question) {
        showToast('请输入你的问题');
        return;
    }
    
    // 创建结果显示区域
    let resultDiv = document.getElementById('practice-ai-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'practice-ai-result';
        input.parentElement.appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在解说...</div></div>';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位热情的学习导师，擅长用通俗易懂的语言解释复杂的概念和知识点。你会用生活例子、类比等方式帮助学生理解。请用友好的语气详细解说。'},
            {role: 'user', content: question}
        ];
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 解说失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;margin-top:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#667eea;font-weight:600;">🤖 AI解说</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('解说失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请检查网络后重试</div>';
    }
}

// 导出新函数到window
window.submitPracticeQuestion = submitPracticeQuestion;
window.askPracticeAI = askPracticeAI;


// ============================================================
// Map - 地图模块
// ============================================================
async function handlePhotoToQuestion(imageData) {
    // 复用photoToQuestion
    if (typeof photoToQuestion === 'function') { photoToQuestion(imageData); }
    else { showToast('拍照出题功能加载中，请稍后再试'); }
}
window.handlePhotoToQuestion = handlePhotoToQuestion;

// ============================================================
// ES6 Module 导出
// ============================================================

export {
    renderPractice,
    handlePracticePhoto,
    showPracticePhotoModal,
    analyzePracticePhoto,
    handleQuestionPhoto,
    submitPracticeQuestion,
    askPracticeAI,
    handlePhotoToQuestion
};

console.log('[ES6 Module] practice.js 模块加载完成');

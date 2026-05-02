// 版本: V149 - DeepSeek核心API+图片上传+语音输入彻底修复
// V148-fix: callVisionAPI添加详细日志、图片格式处理、错误处理
// V148-fix: toggleDeepSeekVoice添加微信浏览器检测
// V147修复: 添加escapeHtml到window导出，确保全局可用

// V146修复: 添加escapeHtml函数（确保在ui.js加载前可用）
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

var currentDeepSeekImage = null;
var deepseekConversationHistory = [];
// isRecording在audio.js中声明，此处直接使用
// deepseekRecognition在audio.js中声明，此处直接使用

// 检测是否在微信浏览器中
function isWeChatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

// 检测浏览器是否支持语音识别
function supportsSpeechRecognition() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
}

// V148-fix: callVisionAPI彻底重写
// 原因：DeepSeek deepseek-chat模型不支持image_url格式
// 解决方案：Tesseract.js OCR提取文字 + DeepSeek文本分析
async function callVisionAPI(imageDataUrl, question) {
    console.log('[VisionAPI] 开始处理图片请求');
    console.log('[VisionAPI] 图片数据长度:', imageDataUrl ? imageDataUrl.length : 0);
    console.log('[VisionAPI] 问题:', question);
    
    // 验证图片数据
    if (!imageDataUrl) {
        console.error('[VisionAPI] 错误：图片数据为空');
        return {success: false, content: '', message: '图片数据为空'};
    }
    
    // 确保图片是有效的base64格式
    if (!imageDataUrl.startsWith('data:')) {
        console.error('[VisionAPI] 错误：图片格式不正确');
        return {success: false, content: '', message: '图片格式不正确'};
    }
    
    var ocrText = null;
    
    // V148-fix: 步骤1：尝试Tesseract.js OCR提取文字
    if (typeof Tesseract !== 'undefined') {
        try {
            showToast('正在识别图片中的文字...');
            ocrText = await ocrExtractText(imageDataUrl);
            if (ocrText && ocrText.length > 3) {
                console.log('[VisionAPI] OCR识别成功，文字长度:', ocrText.length);
                console.log('[VisionAPI] OCR文字预览:', ocrText.substring(0, 100));
            } else {
                console.warn('[VisionAPI] OCR识别结果太短:', ocrText);
                ocrText = null;
            }
        } catch(e) {
            console.warn('[VisionAPI] OCR识别失败:', e.message);
            ocrText = null;
        }
    } else {
        console.warn('[VisionAPI] Tesseract.js未加载，尝试直接使用DeepSeek');
    }
    
    // V148-fix: 步骤2：用DeepSeek分析OCR文字
    if (ocrText) {
        try {
            var messages = [
                {role: 'system', content: '你是一个专业的图片内容分析助手。用户会发送图片的OCR识别文字，请你分析图片内容并回答问题。如果OCR文字有误请根据上下文修正。请用简洁易懂的语言回答。'},
                {role: 'user', content: '图片中的文字内容如下：\n' + ocrText + '\n\n问题：' + (question || '请分析这张图片的内容')}
            ];
            var result = await callDeepSeekAPI(messages, 0.3);
            if (!result.error && result.content) {
                console.log('[VisionAPI] DeepSeek分析成功');
                return {success: true, content: result.content};
            } else if (result.error) {
                console.warn('[VisionAPI] DeepSeek分析失败:', result.message);
            }
        } catch(e) {
            console.warn('[VisionAPI] DeepSeek分析OCR文字失败:', e.message);
        }
    }
    
    // V148-fix: 步骤3：如果OCR失败，让DeepSeek根据用户描述回答
    if (question) {
        try {
            var fallbackMessages = [
                {role: 'system', content: '用户尝试上传了一张图片，但图片文字识别失败。请根据用户的文字描述尽量帮助解答。如果用户描述了图片内容（如题目、公式等），请尽力分析和解答。'},
                {role: 'user', content: question + '\n\n（注意：图片识别失败，请仅根据文字描述回答）'}
            ];
            var fallbackResult = await callDeepSeekAPI(fallbackMessages, 0.5);
            if (!fallbackResult.error && fallbackResult.content) {
                console.log('[VisionAPI] 降级处理成功');
                return {success: true, content: fallbackResult.content + '\n\n⚠️ 图片识别失败，以上回答仅基于文字描述'};
            }
        } catch(e) {
            console.warn('[VisionAPI] 降级处理也失败:', e.message);
        }
    }
    
    console.error('[VisionAPI] 所有方法都失败');
    return {success: false, content: '', message: '图片识别失败，请手动输入文字描述'};
}

async function callDeepSeekAPI(messages, temperature) {
    try {
        var response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY},
            body: JSON.stringify({model: DEEPSEEK_MODEL, messages: messages, temperature: temperature || 0.7, max_tokens: 2000})
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (response.status === 402 || response.status === 400) {
                return {error: true, type: 'balance', message: 'DeepSeek账户余额不足，请先充值后再使用AI功能。前往: https://platform.deepseek.com'};
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        return {success: true, content: data.choices[0].message.content};
    } catch (error) {
        return {error: true, type: 'network', message: error.message};
    }
}

async function sendToDeepSeek() {
    const input = document.getElementById('deepseek-input');
    if (!input) return;
    const msg = input.value.trim();
    
    // 允许只有图片没有文字
    if (!msg && !currentDeepSeekImage) {
        showToast('请输入问题或上传图片');
        return;
    }
    
    const messagesEl = document.getElementById('deepseek-messages');
    if (!messagesEl) return;
    
    // 停止之前的 TTS
    stopTTSSpeech();
    
    // 禁用输入和发送按钮，防止重复发送
    const sendBtn = document.querySelector('.chat-send') || document.querySelector('#deepseek-send-btn');
    if (input) input.disabled = true;
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.6';
        sendBtn.style.cursor = 'not-allowed';
    }
    
    // 构建用户消息显示
    let userMsgHtml = '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble">';
    if (currentDeepSeekImage) {
        userMsgHtml += '<img src="' + currentDeepSeekImage + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:8px;display:block;"/>';
    }
    if (msg) {
        userMsgHtml += escapeHtml(msg);
    }
    userMsgHtml += '</div></div>';
    messagesEl.innerHTML += userMsgHtml;
    input.value = '';
    messagesEl.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble ai-loading">思考中<span class="loading-dots"><span></span><span></span><span></span></span></div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // 构建API消息
    let userContent;
    let hasImage = !!currentDeepSeekImage;
    let imageDataUrl = currentDeepSeekImage; // 保存图片数据用于视觉API
    
    if (hasImage) {
        const visionResult = await callVisionAPI(imageDataUrl, msg || '请分析这张图片');
        if (visionResult.success) {
            userContent = '[AI图片分析：' + visionResult.content + ']\n\n' + (msg || '请基于以上图片分析进一步回答');
        } else if (msg) {
            userContent = msg + '\n（图片识别失败，已按文字处理）';
            showToast('💡 图片识别失败，已按文字处理');
        } else {
            userContent = '请帮我分析这张图片';
            showToast('⚠️ 图片识别失败，请输入文字描述');
        }
    } else {
        userContent = msg;
    }
    
    // 添加用户消息到历史（使用纯文字格式，兼容DeepSeek API）
    deepseekConversationHistory.push({role: 'user', content: userContent});
    
    // 清除图片预览
    clearDeepSeekImage();
    
    try {
        const result = await callDeepSeekAPI(deepseekConversationHistory);
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        
        // 恢复输入框和按钮
        if (input) {
            input.disabled = false;
            input.focus();
        }
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.cursor = 'pointer';
        }
        
        if (result.error) {
            if (bubbles.length > 0) {
                if (result.type === 'balance') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="openDeepSeekRecharge()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;cursor:pointer;">前往充值</button>';
                } else {
                    bubbles[bubbles.length - 1].innerHTML = '❌ 抱歉，' + result.message;
                }
            }
        } else {
            const responseContent = result.content;
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent) + 
                    '<button onclick="speakText(this.parentElement.querySelector(\'.ai-text\').textContent || this.parentElement.textContent)" style="margin-top:8px;padding:4px 8px;background:#f0f0f0;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button>';
            }
            // 添加AI回复到历史
            deepseekConversationHistory.push({role: 'assistant', content: responseContent});
            // 记录调用
            recordDeepSeekCall(Math.ceil(responseContent.length / 4));
            // V145修复：增加AI对话计数
            const dsUser = getCurrentUserData();
            if (dsUser) {
                dsUser.aiChatCount = (dsUser.aiChatCount || 0) + 1;
                saveUserData(dsUser);
            }
            // 自动朗读AI回复
            speakText(responseContent);
        }
    } catch (error) {
        // 恢复输入框和按钮
        if (input) {
            input.disabled = false;
            input.focus();
        }
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.cursor = 'pointer';
        }
        
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (bubbles.length > 0) {
            bubbles[bubbles.length - 1].innerHTML = '❌ 发生错误，请稍后重试。错误信息：' + escapeHtml(error.message);
        }
    } finally {
        // V150: 确保无论如何都恢复输入框
        var finalInput = document.getElementById('deepseek-input');
        var finalSendBtn = document.querySelector('.chat-send') || document.querySelector('#deepseek-send-btn');
        if (finalInput) { finalInput.disabled = false; finalInput.focus(); }
        if (finalSendBtn) { finalSendBtn.disabled = false; finalSendBtn.style.opacity = '1'; finalSendBtn.style.cursor = 'pointer'; }
    }
    
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function analyzeTopicWithAI(topicId) {
    const topic = findTopic(topicId);
    if (!topic) return;
    
    const resultArea = document.getElementById('topic-result-area');
    resultArea.innerHTML = '<div class="ai-loading">🤖 AI正在分析中...</div>';
    
    const prompt = `请详细讲解这道题目：
题目：${topic.q}
正确答案：${topic.a}
基础解析：${topic.e}

请提供：
1. 知识点分析
2. 详细解题步骤
3. 易错点提示
4. 举一反三的类似题目（2-3道）`;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + DEEPSEEK_API_KEY
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一位专业的初中数学老师，擅长详细讲解题目，帮助学生理解知识点。' },
                    { role: 'user', content: prompt }
                ]
            })
        });
        
        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || 'AI分析失败，请稍后重试';
        
        resultArea.innerHTML = `
            <div style="margin-top:12px;padding:16px;background:#f5f7ff;border-radius:12px;max-height:300px;overflow-y:auto;">
                <div style="font-size:14px;line-height:1.8;">${aiContent.replace(/\n/g, '<br/>')}</div>
            </div>
        `;
    } catch (err) {
        resultArea.innerHTML = '<div style="margin-top:12px;color:#ff6b6b;">AI分析失败，请检查网络</div>';
    }
}

async function analyzeMethodWithAI(methodId, questionIdx) {
    try {
        const questions = methodTrainingQuestions[methodId];
        if (!questions || !questions[questionIdx]) {
            showToast('题目数据不存在');
            return;
        }
        const q = questions[questionIdx];
        const resultId = 'method-ai-result-' + methodId + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (!resultEl) {
            showToast('结果区域未找到，请重新打开此模块');
            return;
        }
        resultEl.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在深度分析中...</div></div>';

        const prompt = '请详细讲解这道学习方法题目：\n题目：' + q.q + '\n' + (q.a ? '参考答案：' + q.a : '') + '\n\n请提供：\n1. 知识点分析\n2. 详细解题步骤\n3. 易错点提示\n4. 举一反三的类似题目（2-3道）';

        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { role: 'system', content: '你是一位专业的青少年教育辅导老师，擅长详细讲解学习方法题目，帮助学生理解知识点并举一反三。请用简洁易懂的语言回答。' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (response.status === 402) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足，请先充值后再使用AI功能<br><button onclick="showDeepSeekBalanceAlert()" style="margin-top:8px;padding:6px 16px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            return;
        }

        if (!response.ok) {
            throw new Error('API请求失败 (HTTP ' + response.status + ')');
        }

        const data = await response.json();
        const aiContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'AI分析失败，请稍后重试';

        // 记录调用
        recordDeepSeekCall(Math.ceil(aiContent.length / 4));
        
        // 提取纯文本用于朗读
        const plainText = aiContent.replace(/\*\*/g, '').replace(/<[^>]*>/g, '');

        resultEl.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:400px;overflow-y:auto;">' +
            '<div style="font-size:12px;color:#667eea;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:4px;justify-content:space-between;">' +
            '<span>🤖 AI深度分析</span>' +
            '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
            '<div style="font-size:14px;line-height:1.8;color:#333;" class="ai-content">' + aiContent.replace(/\n/g, '<br>') + '</div>' +
            '</div>';
    } catch (err) {
        console.error('AI分析失败:', err);
        const resultId = 'method-ai-result-' + methodId + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (resultEl) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ AI分析失败<br><span style="font-size:11px;color:#999;">' + escapeHtml(err.message) + '</span><br><button onclick="analyzeMethodWithAI(\'' + methodId + '\', ' + questionIdx + ')" style="margin-top:8px;padding:6px 16px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">重试</button></div>';
        }
    }
}

async function analyzeThinkingWithAI(type, questionIdx) {
    try {
        const questions = thinkingQuestions[type];
        if (!questions || !questions[questionIdx]) {
            showToast('题目数据不存在');
            return;
        }
        const q = questions[questionIdx];
        const resultId = 'thinking-ai-result-' + type + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (!resultEl) {
            showToast('结果区域未找到，请重新打开此模块');
            return;
        }
        resultEl.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在深度分析中...</div></div>';

        const typeNames = { logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维', reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维', abstract: '抽象思维' };
        const answerText = q.opts ? q.opts[q.a] : (q.a || '');

        const prompt = '请详细讲解这道思维训练题目：\n题目：' + q.q + '\n' + (answerText ? '参考答案：' + answerText : '') + '\n\n请提供：\n1. 知识点分析\n2. 详细解题思路\n3. 易错点提示\n4. 举一反三的类似题目（2-3道）';

        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { role: 'system', content: '你是一位专业的青少年思维训练老师，擅长详细讲解思维训练题目，帮助学生提升思维能力。请用简洁易懂的语言回答。' },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (response.status === 402) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足，请先充值后再使用AI功能<br><button onclick="showDeepSeekBalanceAlert()" style="margin-top:8px;padding:6px 16px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            return;
        }

        if (!response.ok) {
            throw new Error('API请求失败 (HTTP ' + response.status + ')');
        }

        const data = await response.json();
        const aiContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'AI分析失败，请稍后重试';

        // 记录调用
        recordDeepSeekCall(Math.ceil(aiContent.length / 4));

        resultEl.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:400px;overflow-y:auto;">' +
            '<div style="font-size:12px;color:#667eea;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:4px;justify-content:space-between;">' +
            '<span>🤖 ' + (typeNames[type] || '思维训练') + ' AI深度分析</span>' +
            '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
            '<div style="font-size:14px;line-height:1.8;color:#333;" class="ai-content">' + aiContent.replace(/\n/g, '<br>') + '</div>' +
            '</div>';
    } catch (err) {
        console.error('AI分析失败:', err);
        const resultId = 'thinking-ai-result-' + type + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (resultEl) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ AI分析失败<br><span style="font-size:11px;color:#999;">' + escapeHtml(err.message) + '</span><br><button onclick="analyzeThinkingWithAI(\'' + type + '\', ' + questionIdx + ')" style="margin-top:8px;padding:6px 16px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">重试</button></div>';
        }
    }
}

async function analyzePhotoWithAI(photoId) {
    var user = getCurrentUserData() || {};
    var photo = user.uploadedImages ? user.uploadedImages.find(function(p) { return p.id.toString() === photoId.toString(); }) : null;
    if (!photo) {
        showToast('未找到照片');
        return;
    }
    
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    content.innerHTML = '<div class="modal-title">🤖 AI分析中...</div>' +
        '<div class="card" style="padding:20px;text-align:center;">' +
            '<div class="ai-loading">正在分析图片内容...</div>' +
        '</div>';
    
    var analysisPrompt = '请分析这张错题照片，' +
        '1. 识别图片中的题目内容' +
        '2. 找出错误原因' +
        '3. 提供正确解法' +
        '4. 给出类似题目的举一反三练习' +
        '请用清晰的结构化格式回答。';
    
    var messages = [
        {role: 'system', content: '你是一位专业的数学辅导老师，擅长分析学生的错题，给出详细的讲解和改进建议。'},
        {role: 'user', content: analysisPrompt}
    ];
    
    try {
        var aiResult = await callDeepSeekAPI(messages);
        if (aiResult.success) {
            content.innerHTML = '<div class="modal-title">📝 AI分析结果</div>' +
                '<div class="card" style="padding:16px;max-height:400px;overflow-y:auto;">' +
                    '<div style="font-size:14px;line-height:1.8;">' + aiResult.content.replace(/\n/g, '<br/>') + '</div>' +
                '</div>' +
                '<button class="login-btn login-btn-secondary" style="margin-top:12px;width:100%;" onclick="closeDetail()">关闭</button>';
        } else {
            content.innerHTML = '<div class="modal-title">❌ AI分析失败</div>' +
                '<div class="card" style="padding:16px;text-align:center;">' + (aiResult.message || '请稍后重试') + '</div>';
        }
    } catch(e) {
        content.innerHTML = '<div class="modal-title">❌ 错误</div>' +
            '<div class="card" style="padding:16px;text-align:center;">网络错误</div>';
    }
}

// V149: 统一处理图片/文件上传 - 自动OCR识别文字后发给AI
async function handleDeepSeekUpload(input, source) {
    if (!input.files[0]) return;
    const file = input.files[0];
    input.value = ''; // 先清空，允许重复选择
    
    // 步骤1：读取图片为base64（等待完成）
    var imageDataUrl = null;
    if (file.type.startsWith('image/')) {
        try {
            imageDataUrl = await new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onload = function(e) { resolve(e.target.result); };
                reader.onerror = function() { reject(new Error('读取图片失败')); };
                reader.readAsDataURL(file);
            });
        } catch(e) {
            showToast('读取图片失败');
            return;
        }
    } else {
        showToast('请上传图片文件');
        return;
    }
    
    // 步骤2：显示预览
    currentDeepSeekImage = imageDataUrl;
    var preview = document.getElementById('deepseek-image-preview');
    var previewImg = document.getElementById('deepseek-preview-img');
    var previewStatus = document.getElementById('deepseek-preview-status');
    if (preview && previewImg) {
        previewImg.src = imageDataUrl;
        preview.style.display = 'block';
    }
    if (previewStatus) previewStatus.textContent = '正在识别文字...';
    showToast('正在识别图片中的文字...');
    
    // 步骤3：OCR识别文字
    var ocrText = null;
    if (typeof Tesseract !== 'undefined') {
        try {
            ocrText = await ocrExtractText(imageDataUrl);
            if (ocrText && ocrText.trim().length < 2) ocrText = null;
            if (ocrText) ocrText = ocrText.trim();
        } catch(e) {
            console.warn('OCR识别失败:', e.message);
            ocrText = null;
        }
    }
    
    // 步骤4：把OCR文字填入输入框，然后清除图片（避免sendToDeepSeek再次OCR）
    var dsInput = document.getElementById('deepseek-input');
    if (ocrText) {
        if (dsInput) dsInput.value = '请分析以下图片中的文字内容并给出详细解答：\n' + ocrText;
        if (previewStatus) previewStatus.textContent = '识别成功';
        showToast('文字识别成功，正在发送给AI...');
        // 清除图片，这样sendToDeepSeek不会再走callVisionAPI
        currentDeepSeekImage = null;
        if (preview) preview.style.display = 'none';
        // 自动发送
        if (typeof sendToDeepSeek === 'function') sendToDeepSeek();
    } else {
        if (dsInput) dsInput.value = '';
        if (previewStatus) previewStatus.textContent = '识别失败，请手动输入';
        showToast('图片文字识别失败，请手动输入问题后发送');
        // 保留图片预览，用户可以手动输入问题后发送
    }
}

// 兼容旧函数名
function handleDeepSeekImage(input) {
    handleDeepSeekUpload(input, 'image');
}

function createAIInputHTML(inputId, sendCallback) {
    return '<div class="ai-input-area">' +
        '<textarea class="ai-input" id="' + inputId + '" placeholder="输入问题..." rows="1" onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();' + sendCallback + '}"></textarea>' +
        '<div class="ai-input-actions">' +
        '<button class="ai-input-btn ai-voice-btn" onclick="toggleVoiceInput(this,\'' + inputId + '\')">&#x1F3A4;</button>' +
        '<button class="ai-input-btn ai-send-btn" onclick="' + sendCallback + '">&#x27A4;</button>' +
        '</div></div>';
}

function createMentorChat(mentorId) {
    currentMentor = mentors.find(m => m.id === mentorId);
    if (!currentMentor) return;
    
    mentorChatHistory = [];
    
    const chatHtml = `
        <div class="mentor-chat-container">
            <div class="chat-header">
                <div class="mentor-avatar">${currentMentor.avatar}</div>
                <div class="mentor-info">
                    <div class="mentor-name">${currentMentor.name}</div>
                    <div class="mentor-title">${currentMentor.title}</div>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    <div class="message-content">${currentMentor.greeting}</div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="mentor-input" placeholder="向${currentMentor.name}提问..." onkeypress="if(event.key==='Enter')sendMentorMessage()">
                <button class="send-btn" onclick="sendMentorMessage()">发送</button>
            </div>
        </div>
    `;
    
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = chatHtml;
    
    // 保存到localStorage
    localStorage.setItem('currentMentor', mentorId);
}

function getMentorResponse(question, mentor) {
    const q = question.toLowerCase();
    const responses = {
        '李白': ['诗仙李白强调"铁杵成针"的精神，学习需要坚持不懈！', '李白曾言"长风破浪会有时"，遇到困难不要怕！'],
        '苏格拉底': ['我思故我在。学习需要不断追问自己，才能获得真知。', '认识你自己。这是最重要的学习起点。'],
        '居里夫人': ['科学需要坚持和勇气，就像提炼镭一样需要耐心。', '学习是发现未知的过程，要保持好奇心！'],
        '爱因斯坦': ['想象力比知识更重要！保持你的想象力。', '成功=努力+方法+少说废话。'],
        '孔子': ['学而时习之，不亦说乎。学习要注重复习和实践。', '三人行，必有我师。要善于向他人学习。']
    };
    
    const mentorResponses = responses[mentor.name] || ['让我思考一下这个问题...', '这是一个很好的问题，让我们一起探讨。'];
    return mentorResponses[Math.floor(Math.random() * mentorResponses.length)];
}

function sendMentorMessage() {
    const input = document.getElementById('mentor-input');
    const message = input.value.trim();
    if (!message || !currentMentor) return;
    
    // 添加用户消息
    addChatMessage(message, 'user');
    input.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
        const response = getMentorResponse(message, currentMentor);
        addChatMessage(response, 'bot');
    }, 500);
}

// 余额估算存储键
const DEEPSEEK_USAGE_KEY = 'deepseek_usage_stats';
const DEEPSEEK_ESTIMATED_BALANCE = 'deepseek_estimated_balance';

// 初始化DeepSeek使用统计
function initDeepSeekUsage() {
    let stats = localStorage.getItem(DEEPSEEK_USAGE_KEY);
    if (!stats) {
        stats = { totalCalls: 0, totalTokens: 0, lastReset: Date.now() };
    } else {
        stats = JSON.parse(stats);
    }
    // 每天重置统计
    const today = new Date().toDateString();
    if (new Date(stats.lastReset).toDateString() !== today) {
        stats.todayCalls = 0;
        stats.lastReset = Date.now();
    }
    return stats;
}

// 记录DeepSeek API调用
function recordDeepSeekCall(tokens) {
    const stats = initDeepSeekUsage();
    stats.totalCalls = (stats.totalCalls || 0) + 1;
    stats.todayCalls = (stats.todayCalls || 0) + 1;
    stats.totalTokens = (stats.totalTokens || 0) + (tokens || 500);
    localStorage.setItem(DEEPSEEK_USAGE_KEY, JSON.stringify(stats));
    
    // 更新用户数据中的调用统计
    const user = getCurrentUserData();
    if (!user.deepSeekCalls) user.deepSeekCalls = { today: 0, total: 0 };
    user.deepSeekCalls.today = (user.deepSeekCalls.today || 0) + 1;
    user.deepSeekCalls.total = (user.deepSeekCalls.total || 0) + 1;
    saveUserData(user);
    
    return stats;
}

async function queryDeepSeekBalance(showToast) {
    try {
        // 尝试新的余额API路径
        const response = await fetch('https://api.deepseek.com/user/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('无法获取余额 (HTTP ' + response.status + ')');
        }
        
        const data = await response.json();
        
        // 保存估算余额
        // V146修复: balance_infos[0]中没有is_available字段，需要从data.is_available获取
        let balanceInfo = { is_available: true, balance_in_use: 0, total_balance: 0 };
        if (data.balance_infos && data.balance_infos.length > 0) {
            balanceInfo = data.balance_infos[0];
            // V146修复: 如果balanceInfo没有is_available，从data中获取（data.is_available默认true）
            if (balanceInfo.is_available === undefined) {
                balanceInfo.is_available = data.is_available !== false;
            }
        }
        
        // V146修复: 确保total_balance是字符串或数字
        const totalBalance = balanceInfo.total_balance || '0';
        const balance = balanceInfo.is_available ? parseFloat(totalBalance) : 0;
        const balanceStr = '¥' + balance.toFixed(2);
        
        // 获取本地存储的调用统计
        const stats = initDeepSeekUsage();
        
        return {
            balance: balanceStr,
            tokens: Math.floor(balance / 0.0001).toLocaleString(),
            todayCalls: stats.todayCalls || 0,
            totalCalls: stats.totalCalls || 0,
            lastUpdate: new Date().toLocaleTimeString(),
            raw: data
        };
    } catch (error) {
        console.warn('DeepSeek余额查询失败:', error.message);
        // 返回本地统计作为备选
        const stats = initDeepSeekUsage();
        return {
            balance: '¥--',
            tokens: '--',
            todayCalls: stats.todayCalls || 0,
            totalCalls: stats.totalCalls || 0,
            lastUpdate: '查询失败: ' + error.message,
            error: error.message,
            isEstimate: true
        };
    }
}

// 刷新DeepSeek余额显示
async function refreshDeepSeekBalance() {
    const balanceEl = document.getElementById('deepseek-balance-value');
    if (!balanceEl) return;
    
    balanceEl.textContent = '查询中...';
    balanceEl.style.color = '#999';
    
    try {
        const balanceInfo = await queryDeepSeekBalance(false);
        
        if (balanceInfo.error) {
            balanceEl.textContent = '查询失败';
            balanceEl.style.color = '#ff6b6b';
            return;
        }
        
        const balanceText = balanceInfo.balance;
        const balanceNum = parseFloat(balanceText.replace('¥', ''));
        
        balanceEl.textContent = balanceText;
        
        // 根据余额显示不同颜色
        if (balanceNum === 0) {
            balanceEl.style.color = '#ff6b6b';
            // 余额为0时显示警告
            showToast('⚠️ DeepSeek余额为0，请先充值');
        } else if (balanceNum < 1) {
            balanceEl.style.color = '#ff9500'; // 黄色警告
            showToast('⚠️ 余额不足1元，请尽快充值');
        } else {
            balanceEl.style.color = '#43E97B'; // 绿色正常
        }
    } catch(e) {
        balanceEl.textContent = '查询失败';
        balanceEl.style.color = '#ff6b6b';
    }
}

function showDeepSeekBalanceAlert() {
    var modal = document.getElementById('detail-modal');
    var contentDiv = document.getElementById('detail-content');
    if (modal && contentDiv) {
        modal.classList.add('show');
        contentDiv.innerHTML = '<div class="modal-title">⚠️ AI功能提示</div>' +
            '<div style="background:#fff3cd;border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">' +
            '<div style="font-size:48px;margin-bottom:12px;">💰</div>' +
            '<div style="font-size:15px;font-weight:bold;color:#856404;margin-bottom:8px;">DeepSeek账户余额不足</div>' +
            '<div style="font-size:13px;color:#856404;line-height:1.6;">当前账户无法继续使用AI功能，请前往DeepSeek平台充值后再试。</div></div>' +
            '<button onclick="window.open("https://platform.deepseek.com", "_blank")" class="login-btn login-btn-primary" style="margin-bottom:8px;">🌐 前往充值</button>' +
            '<button class="login-btn login-btn-outline" onclick="closeModal()">稍后再说</button>';
    }
}

function selectRechargePackage(amount) {
    showToast('已选择 ¥' + amount + ' 套餐，请前往充值中心完成支付');
    window.open('https://platform.deepseek.com/usage', '_blank');
}

async function openDeepSeekRecharge() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    // 先显示加载状态
    content.innerHTML = `
        <div class="modal-title">💰 DeepSeek 充值中心</div>
        <div style="text-align:center;padding:30px;">
            <div style="font-size:24px;margin-bottom:12px;">⏳</div>
            <div style="font-size:14px;color:#666;">正在查询账户余额...</div>
        </div>
    `;
    
    try {
        // 调用DeepSeek API查询余额
        const balanceInfo = await queryDeepSeekBalance();
        
        content.innerHTML = `
            <div class="modal-title">💰 DeepSeek 充值中心</div>
            
            <!-- 余额卡片 -->
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:16px;padding:20px;margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div style="font-size:14px;opacity:0.9;">账户余额</div>
                    <div style="font-size:12px;opacity:0.8;">${balanceInfo.lastUpdate}</div>
                </div>
                <div style="font-size:32px;font-weight:bold;margin-bottom:8px;">${balanceInfo.balance}</div>
                <div style="font-size:12px;opacity:0.9;">约可使用 ${balanceInfo.tokens} tokens</div>
            </div>
            
            <!-- 使用统计 -->
            <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📊 使用统计</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="background:white;border-radius:8px;padding:12px;text-align:center;">
                        <div style="font-size:20px;font-weight:bold;color:#1A6BFF;">${balanceInfo.todayCalls || 0}</div>
                        <div style="font-size:12px;color:#666;">今日调用</div>
                    </div>
                    <div style="background:white;border-radius:8px;padding:12px;text-align:center;">
                        <div style="font-size:20px;font-weight:bold;color:#1A6BFF;">${balanceInfo.totalCalls || 0}</div>
                        <div style="font-size:12px;color:#666;">累计调用</div>
                    </div>
                </div>
            </div>
            
            <!-- 充值套餐 -->
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">💎 充值套餐</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                <div onclick="selectRechargePackage(10)" style="background:white;border:2px solid #e0e0e0;border-radius:12px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='#1A6BFF'" onmouseout="this.style.borderColor='#e0e0e0'">
                    <div style="font-size:20px;font-weight:bold;color:#333;">¥10</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">基础套餐</div>
                </div>
                <div onclick="selectRechargePackage(30)" style="background:white;border:2px solid #1A6BFF;border-radius:12px;padding:16px;text-align:center;cursor:pointer;position:relative;" onmouseover="this.style.borderColor='#1A6BFF'" onmouseout="this.style.borderColor='#1A6BFF'">
                    <div style="position:absolute;top:-8px;right:-8px;background:#ff6b6b;color:white;font-size:10px;padding:2px 6px;border-radius:10px;">推荐</div>
                    <div style="font-size:20px;font-weight:bold;color:#333;">¥30</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">超值套餐</div>
                </div>
                <div onclick="selectRechargePackage(50)" style="background:white;border:2px solid #e0e0e0;border-radius:12px;padding:16px;text-align:center;cursor:pointer;" onmouseover="this.style.borderColor='#1A6BFF'" onmouseout="this.style.borderColor='#e0e0e0'">
                    <div style="font-size:20px;font-weight:bold;color:#333;">¥50</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">标准套餐</div>
                </div>
                <div onclick="selectRechargePackage(100)" style="background:white;border:2px solid #e0e0e0;border-radius:12px;padding:16px;text-align:center;cursor:pointer;" onmouseover="this.style.borderColor='#1A6BFF'" onmouseout="this.style.borderColor='#e0e0e0'">
                    <div style="font-size:20px;font-weight:bold;color:#333;">¥100</div>
                    <div style="font-size:12px;color:#666;margin-top:4px;">尊享套餐</div>
                </div>
            </div>
            
            <!-- 充值步骤 -->
            <div style="background:#fff3e0;border-radius:12px;padding:12px;margin-bottom:16px;">
                <div style="font-size:12px;color:#ff9500;line-height:1.6;">
                    💡 充值说明：点击下方按钮前往DeepSeek官方平台完成充值，充值后余额将自动更新
                </div>
            </div>
            
            <button onclick="window.open('https://platform.deepseek.com/usage', '_blank')" class="login-btn login-btn-primary" style="margin-bottom:8px;background:linear-gradient(135deg,#667eea,#764ba2);">🌐 前往充值中心</button>
            <button onclick="queryDeepSeekBalance(true)" style="width:100%;padding:12px;background:#f5f5f5;border:none;border-radius:10px;font-size:14px;cursor:pointer;margin-bottom:8px;">🔄 刷新余额</button>
            <button class="modal-close" onclick="closeModal()">关闭</button>
        `;
    } catch (error) {
        content.innerHTML = `
            <div class="modal-title">💰 DeepSeek 充值中心</div>
            <div style="background:#ffebee;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#c62828;">⚠️ 无法获取余额信息</div>
                <div style="font-size:12px;color:#666;margin-top:8px;">${error.message || '请检查网络连接或稍后重试'}</div>
            </div>
            <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;margin-bottom:12px;">充值步骤：</div>
                <div style="font-size:13px;color:#666;line-height:1.8;">
                    1. 访问 platform.deepseek.com<br>
                    2. 登录您的账号<br>
                    3. 点击"充值"选项<br>
                    4. 选择充值金额<br>
                    5. 完成支付
                </div>
            </div>
            <button onclick="window.open('https://platform.deepseek.com', '_blank')" class="login-btn login-btn-primary" style="margin-bottom:8px;">🌐 前往充值</button>
            <button class="modal-close" onclick="closeModal()">关闭</button>
        `;
    }
}

function addChatMessage(content, type) {
    const messagesDiv = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}-message`;
    msgDiv.innerHTML = `<div class="message-content">${content}</div>`;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // 保存历史
    mentorChatHistory.push({type, content, time: Date.now()});
}

function formatAIResponse(text) {
    // 转义HTML
    let formatted = escapeHtml(text);
    // 处理换行
    formatted = formatted.replace(/\n/g, '<br>');
    // 处理粗体
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 处理代码块
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;">$1</code>');
    return formatted;
}

function clearDeepSeekImage() {
    currentDeepSeekImage = null;
    const preview = document.getElementById('deepseek-image-preview');
    if (preview) preview.style.display = 'none';
}

function renderDeepseek(container) {
    // 检查浏览器是否支持语音识别
    const supportsSpeechRecognition = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    const voiceBtn = supportsSpeechRecognition ? '<button class="chat-voice-btn" id="deepseek-voice-btn" onclick="toggleDeepSeekVoice()" title="语音输入">🎤</button>' : '';
    
    // 获取用户上传的图片
    const user = getCurrentUserData() || {};
    const uploadedImages = user.deepseekImages || [];
    
    container.innerHTML = `
        <div class="card" style="position:relative;">
            <h3 style="margin-bottom:8px;">🤖 DeepSeek AI 助手 <button class="tts-stop-btn" id="tts-stop-btn" onclick="stopTTSSpeech()" style="display:none;" title="停止朗读">🔇</button></h3>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <p style="color:#666;font-size:13px;margin:0;">智能学习助手，支持文字、语音和图片提问</p>
                <button onclick="openDeepSeekRecharge()" style="padding:6px 12px;background:#667eea;color:white;border:none;border-radius:20px;font-size:12px;cursor:pointer;">💰 充值</button>
            </div>
            <div id="deepseek-balance-display" onclick="refreshDeepSeekBalance()" style="background:#f5f7ff;border-radius:8px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" title="点击刷新余额">
                <span style="font-size:13px;color:#666;">账户余额</span>
                <span id="deepseek-balance-value" style="font-size:14px;font-weight:600;color:#1A6BFF;">加载中...</span>
            </div>
        </div>
        <div class="chat-container" style="height:350px;">
            <div class="chat-messages" id="deepseek-messages">
                <div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">你好！我是DeepSeek AI助手，有什么学习上的问题可以问我哦！你可以：
                    <br>• 文字输入问题
                    <br>• 📸拍照/🖼️相册/📎文件上传图片
                    <br>• 图片会自动识别文字并分析
                </div></div>
            </div>
            <div class="chat-input-area">
                ${voiceBtn}
                <input type="file" id="ds-camera-input" accept="image/*" capture="environment" style="display:none" onchange="handleDeepSeekUpload(this,'camera')"/>
                <input type="file" id="ds-album-input" accept="image/*" style="display:none" onchange="handleDeepSeekUpload(this,'album')"/>
                <input type="file" id="ds-file-input" accept="image/*,.txt" style="display:none" onchange="handleDeepSeekUpload(this,'file')"/>
                <input type="text" class="chat-input" id="deepseek-input" placeholder="输入问题..." onkeypress="if(event.key==='Enter')sendToDeepSeek()"/>
                <button class="chat-send" onclick="sendToDeepSeek()">发送</button>
            </div>
            <div style="display:flex;gap:6px;padding:4px 0;">
                <button onclick="document.getElementById('ds-camera-input').click()" style="display:flex;align-items:center;gap:4px;padding:6px 10px;background:#f0f4ff;border:none;border-radius:8px;font-size:12px;color:#667eea;cursor:pointer;">📸 拍照</button>
                <button onclick="document.getElementById('ds-album-input').click()" style="display:flex;align-items:center;gap:4px;padding:6px 10px;background:#f0f4ff;border:none;border-radius:8px;font-size:12px;color:#667eea;cursor:pointer;">🖼️ 相册</button>
                <button onclick="document.getElementById('ds-file-input').click()" style="display:flex;align-items:center;gap:4px;padding:6px 10px;background:#f0f4ff;border:none;border-radius:8px;font-size:12px;color:#667eea;cursor:pointer;">📎 文件</button>
            </div>
            <div style="text-align:center;font-size:11px;color:#999;">上传图片自动识别文字</div>
        </div>
        
        <div id="deepseek-image-preview" style="display:none;padding:12px;background:#f5f7ff;border-radius:12px;margin-top:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <img id="deepseek-preview-img" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"/>
                <span id="deepseek-preview-status" style="font-size:12px;color:#666;">图片已准备好</span>
                <button onclick="clearDeepSeekImage()" style="margin-left:auto;background:#ff6b6b;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">移除</button>
            </div>
        </div>
        
        <div class="template-btns" style="margin-top:12px;">
            <button class="template-btn" onclick="askTemplate('帮我解释一下勾股定理')">勾股定理</button>
            <button class="template-btn" onclick="askTemplate('英语语法怎么学')">英语语法</button>
            <button class="template-btn" onclick="askTemplate('提高记忆力的方法')">记忆方法</button>
        </div>
    `;

    // 进入模块时自动检查余额
    setTimeout(function() { refreshDeepSeekBalance(); }, 300);
}

async function callDeepSeekAPIWithVision(messages, model) {
    try {
        var response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY},
            body: JSON.stringify({model: model || DEEPSEEK_MODEL, messages: messages, temperature: 0.7, max_tokens: 2000})
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (response.status === 402 || response.status === 400) {
                return {error: true, type: 'balance', message: 'DeepSeek账户余额不足，请先充值后再使用AI功能。'};
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        return {success: true, content: data.choices[0].message.content};
    } catch (error) {
        return {error: true, type: 'network', message: error.message};
    }
}

// toggleDeepSeekVoice moved to audio.js
function __unused__toggleDeepSeekVoice_placeholder() { }

function showPhotoPreview(imageData, topicId, photoId) {
    var topic = findTopic(topicId);
    var topicTitle = topic ? topic.title : '未知题目';
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = '<div class="modal-title">📷 错题照片预览</div>' +
        '<div class="card" style="padding:12px;margin-bottom:12px;">' +
            '<img src="' + imageData + '" style="width:100%;max-height:300px;object-fit:contain;border-radius:8px;margin-bottom:12px;"/>' +
            '<div style="font-size:12px;color:var(--text-gray);margin-bottom:8px;">关联题目: ' + topicTitle + '</div>' +
        '</div>' +
        '<button class="login-btn login-btn-primary" style="margin-bottom:8px;width:100%;" onclick="analyzePhotoWithAI(' + photoId + ')">🤖 AI分析错题</button>' +
        '<button class="login-btn login-btn-secondary" style="width:100%;" onclick="closeDetail()">关闭</button>';
}

function askTemplate(question) {
    const input = document.getElementById('deepseek-input');
    if (input) { input.value = question; sendToDeepSeek(); }
}

function saveApiConfigModal(type) {
    const input = document.getElementById('api-key-input');
    if (!input) return;
    
    const config = getApiConfig();
    const value = input.value.trim();
    
    if (type === 'deepseek') {
        config.deepseek = value;
        showToast(value ? 'DeepSeek API Key 已保存' : 'DeepSeek API Key 已清除');
    } else if (type === 'peerjs') {
        config.peerjs = value || '0.peerjs.com';
        showToast('PeerJS 服务器已配置');
    }
    
    saveApiConfig(config);
    updateApiStatusDisplay();
    closeApiConfigModal();
}


// ============================================================
// Wrongbook - 错题本
// ============================================================

// Window exports for onclick handlers
window.openDeepSeekRecharge = openDeepSeekRecharge;

// ============================================================
// Window Exports
// ============================================================
window.renderDeepseek = renderDeepseek;
window.analyzeTopicWithAI = analyzeTopicWithAI;
window.analyzeMethodWithAI = analyzeMethodWithAI;
window.analyzeThinkingWithAI = analyzeThinkingWithAI;
window.analyzePhotoWithAI = analyzePhotoWithAI;
window.showPhotoPreview = showPhotoPreview;
window.handleDeepSeekImage = handleDeepSeekImage;
window.handleDeepSeekUpload = handleDeepSeekUpload;
window.sendToDeepSeek = sendToDeepSeek;
window.clearDeepSeekImage = clearDeepSeekImage;
window.askTemplate = askTemplate;
window.queryDeepSeekBalance = queryDeepSeekBalance;
window.refreshDeepSeekBalance = refreshDeepSeekBalance;
window.showDeepSeekBalanceAlert = showDeepSeekBalanceAlert;
window.sendMentorMessage = sendMentorMessage;
window.closeDetail = closeDetail;
window.selectRechargePackage = selectRechargePackage;
window.recordDeepSeekCall = recordDeepSeekCall;
window.initDeepSeekUsage = initDeepSeekUsage;
window.callDeepSeekAPI = callDeepSeekAPI;
window.callVisionAPI = callVisionAPI;
window.formatAIResponse = formatAIResponse;
window.escapeHtml = escapeHtml; // V147-fix: 添加escapeHtml导出供其他模块使用
window.isWeChatBrowser = isWeChatBrowser; // V148-fix: 导出微信浏览器检测函数
window.supportsSpeechRecognition = supportsSpeechRecognition; // V148-fix: 导出语音识别支持检测

// ============================================================
// OCR拍照出题模块 - Tesseract.js + DeepSeek
// ============================================================

// Tesseract.js 状态
var tesseractWorker = null;
var isTesseractInitializing = false;

// 初始化Tesseract.js（异步加载语言包）
async function initTesseract() {
    if (tesseractWorker) return tesseractWorker;
    if (isTesseractInitializing) {
        // 等待初始化完成
        while (isTesseractInitializing) {
            await new Promise(r => setTimeout(r, 100));
        }
        return tesseractWorker;
    }
    
    isTesseractInitializing = true;
    try {
        // 使用 createWorker 创建 worker，自动下载语言包
        tesseractWorker = await Tesseract.createWorker('chi_sim+eng', 1, {
            logger: m => {
                if (m.status === 'loading language api') {
                    console.log('OCR语言包加载中...', m.progress);
                }
            }
        });
        console.log('Tesseract.js 初始化完成');
        return tesseractWorker;
    } catch (e) {
        console.error('Tesseract.js 初始化失败:', e);
        isTesseractInitializing = false;
        return null;
    } finally {
        isTesseractInitializing = false;
    }
}

// OCR提取文字（使用Tesseract.js）
async function ocrExtractText(imageDataUrl, progressCallback) {
    try {
        // 检查Tesseract是否可用
        if (typeof Tesseract === 'undefined') {
            console.warn('Tesseract.js 未加载，尝试直接使用DeepSeek');
            return null;
        }
        
        // 显示进度
        if (progressCallback) progressCallback('正在初始化OCR引擎...', 0);
        
        // 初始化/获取worker
        const worker = await initTesseract();
        if (!worker) {
            return null;
        }
        
        if (progressCallback) progressCallback('正在识别文字...', 30);
        
        // 执行OCR识别
        const result = await worker.recognize(imageDataUrl);
        
        if (progressCallback) progressCallback('识别完成', 100);
        
        // 返回识别的文字
        const text = result.data.text.trim();
        console.log('OCR识别结果:', text);
        
        return text;
    } catch (e) {
        console.error('OCR识别失败:', e);
        return null;
    }
}

// AI解析OCR文字为结构化题目
async function aiParseQuestion(ocrText) {
    if (!ocrText || ocrText.length < 5) {
        return { error: '识别文字太少，请重新拍照或手动输入题目' };
    }
    
    const prompt = `请将以下OCR识别的题目文字整理成结构化格式。

要求：
1. 如果是选择题：识别题干和各选项（A/B/C/D），判断正确答案
2. 如果是填空题/计算题：识别题干和答案
3. 如果文字有误请根据上下文修正
4. 生成简洁准确的解析

OCR文字：
${ocrText}

请严格用以下JSON格式返回，不要包含其他内容：
{
    "type": "choice/fill/calculation/other",
    "question": "题目文字（修正后的）",
    "options": {"A": "选项A", "B": "选项B", "C": "选项C", "D": "选项D"},
    "answer": "正确答案",
    "explanation": "简要解析"
}`;

    try {
        const messages = [
            { role: 'system', content: '你是一个专业的题目解析AI，专门帮助学生整理和解析学习题目。请直接返回JSON格式，不要有多余内容。' },
            { role: 'user', content: prompt }
        ];
        
        const result = await callDeepSeekAPI(messages, 0.3);
        
        if (result.error) {
            return result;
        }
        
        // 尝试解析JSON
        let parsed;
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                parsed = JSON.parse(jsonMatch[0]);
            } catch (e) {
                // 尝试修复JSON
                const fixed = jsonMatch[0]
                    .replace(/[\u2018\u2019]/g, "'")
                    .replace(/[\u201C\u201D]/g, '"');
                parsed = JSON.parse(fixed);
            }
        } else {
            return { error: 'AI解析失败，请重试' };
        }
        
        // 确保必要字段存在
        if (!parsed.type) parsed.type = 'other';
        if (!parsed.question) parsed.question = ocrText;
        if (!parsed.options) parsed.options = {};
        if (!parsed.answer) parsed.answer = '';
        if (!parsed.explanation) parsed.explanation = '';
        
        return parsed;
    } catch (e) {
        console.error('AI解析失败:', e);
        return { error: 'AI解析失败: ' + e.message };
    }
}

// 渲染交互式题目
function renderInteractiveQuestion(questionData) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    const q = questionData;
    const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
    
    let questionHtml = `
        <div class="modal-title">📝 ${qTypeNames[q.type] || '题目'}</div>
        <div id="ocr-question-area" style="margin-bottom:16px;">
            <div class="card" style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#e8f4ff);">
                <div style="font-size:13px;color:#1A6BFF;margin-bottom:8px;font-weight:600;">📋 题目</div>
                <div style="font-size:15px;line-height:1.8;color:#333;">${q.question}</div>
            </div>
    `;
    
    // 根据题型显示不同答题方式
    if (q.type === 'choice' && q.options && Object.keys(q.options).length > 0) {
        questionHtml += `
            <div style="margin-top:16px;">
                <div style="font-size:12px;color:#666;margin-bottom:8px;">请选择正确答案：</div>
                <div id="ocr-options-area" style="display:grid;gap:8px;">
                    ${['A', 'B', 'C', 'D'].map(opt => q.options[opt] ? `
                        <div class="ocr-option-btn" onclick="selectOcrOption(this, '${opt}')" data-option="${opt}" style="padding:12px;background:white;border:2px solid #e0e0e0;border-radius:12px;cursor:pointer;font-size:14px;transition:all 0.2s;">
                            <span style="font-weight:600;color:#1A6BFF;margin-right:8px;">${opt}.</span>
                            <span>${q.options[opt]}</span>
                        </div>
                    ` : '').join('')}
                </div>
                <input type="hidden" id="ocr-selected-option" value="">
            </div>
        `;
    } else {
        questionHtml += `
            <div style="margin-top:16px;">
                <div style="font-size:12px;color:#666;margin-bottom:8px;">请输入你的答案：</div>
                <textarea id="ocr-user-answer" style="width:100%;height:80px;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:14px;resize:none;" placeholder="输入答案..."></textarea>
            </div>
        `;
    }
    
    questionHtml += `
            <button id="ocr-submit-btn" onclick="submitOcrAnswer()" style="width:100%;margin-top:16px;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">提交答案</button>
            <button onclick="closeModal()" style="width:100%;margin-top:8px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
        </div>
        <div id="ocr-result-area" style="display:none;"></div>
    `;
    
    content.innerHTML = questionHtml;
    
    // 保存题目数据到全局变量
    window.currentOcrQuestion = q;
}

// 选择选项
function selectOcrOption(el, opt) {
    // 移除其他选项的高亮
    document.querySelectorAll('.ocr-option-btn').forEach(btn => {
        btn.style.background = 'white';
        btn.style.borderColor = '#e0e0e0';
    });
    // 高亮当前选项
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    // 保存选择
    document.getElementById('ocr-selected-option').value = opt;
}

// 提交答案并AI批改
async function submitOcrAnswer() {
    const q = window.currentOcrQuestion;
    if (!q) {
        showToast('题目数据丢失');
        return;
    }
    
    let userAnswer = '';
    let isCorrect = false;
    
    if (q.type === 'choice') {
        const selectedOpt = document.getElementById('ocr-selected-option').value;
        if (!selectedOpt) {
            showToast('请先选择一个选项');
            return;
        }
        userAnswer = selectedOpt + '. ' + (q.options[selectedOpt] || '');
        // 检查是否正确（简化判断：比较选项字母）
        isCorrect = selectedOpt.toUpperCase() === q.answer.toUpperCase().charAt(0);
    } else {
        userAnswer = document.getElementById('ocr-user-answer').value.trim();
        if (!userAnswer) {
            showToast('请输入答案');
            return;
        }
        // 非选择题发送给AI判断
    }
    
    const submitBtn = document.getElementById('ocr-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'AI批改中...';
    }
    
    // 如果是非选择题或需要AI深度判断，发请求给AI
    if (q.type !== 'choice' || !q.answer) {
        try {
            const prompt = `请判断用户的答案是否正确。
            
原题目：${q.question}
正确答案：${q.answer}
用户答案：${userAnswer}

请分析用户答案是否正确，并给出简要评价。

请用以下JSON格式返回：
{
    "isCorrect": true/false,
    "evaluation": "简要评价"
}`;

            const messages = [
                { role: 'system', content: '你是一个严格的AI批改老师，请客观评判答案是否正确。' },
                { role: 'user', content: prompt }
            ];
            
            const result = await callDeepSeekAPI(messages, 0.1);
            
            if (result.success) {
                const jsonMatch = result.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    isCorrect = parsed.isCorrect;
                }
            }
        } catch (e) {
            console.error('AI批改失败:', e);
        }
    }
    
    // 显示结果
    const resultArea = document.getElementById('ocr-result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
        <div style="margin-top:16px;">
            <div style="padding:16px;border-radius:12px;${isCorrect ? 'background:linear-gradient(135deg,#e8f5e9,#c8e6c9);' : 'background:linear-gradient(135deg,#ffebee,#ffcdd2);'}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                    <span style="font-size:24px;">${isCorrect ? '✅' : '❌'}</span>
                    <span style="font-size:16px;font-weight:bold;${isCorrect ? 'color:#2e7d32;' : 'color:#c62828;'}">${isCorrect ? '回答正确！' : '回答错误'}</span>
                </div>
                
                <div style="background:white;border-radius:8px;padding:12px;margin-bottom:8px;">
                    <div style="font-size:12px;color:#666;margin-bottom:4px;">你的答案</div>
                    <div style="font-size:14px;color:#333;">${userAnswer}</div>
                </div>
                
                ${q.answer ? `
                <div style="background:white;border-radius:8px;padding:12px;margin-bottom:8px;">
                    <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">正确答案</div>
                    <div style="font-size:14px;color:#333;font-weight:600;">${q.answer}</div>
                </div>
                ` : ''}
                
                <div style="background:white;border-radius:8px;padding:12px;">
                    <div style="font-size:12px;color:#667eea;margin-bottom:4px;">💡 解析</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;">${q.explanation || (isCorrect ? '回答正确！' : '请查看正确答案后理解解题思路')}</div>
                </div>
            </div>
            
            <button onclick="showOcrQuestionModal()" style="width:100%;margin-top:12px;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">📷 再来一题</button>
            <button onclick="closeModal()" style="width:100%;margin-top:8px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
        </div>
    `;
    
    // 隐藏题目区域
    document.getElementById('ocr-question-area').style.display = 'none';
    
    // 记录统计
    recordOcrQuestionResult(isCorrect);
}

// 显示OCR拍照出题模态框（用于再来一题）
function showOcrQuestionModal() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📷 拍照识别题目</div>
        <div class="card" style="padding:16px;margin-bottom:16px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">📸</div>
            <p style="font-size:14px;color:#666;margin-bottom:16px;">拍下你的题目，AI帮你识别并生成可答题</p>
            
            <input type="file" id="ocr-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoToQuestion(this)"/>
            <button onclick="document.getElementById('ocr-photo-input').click()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">📷 拍照/选择图片</button>
        </div>
        
        <div class="card" style="padding:16px;background:#fff8e1;">
            <div style="font-size:13px;color:#856404;font-weight:600;margin-bottom:8px;">💡 使用提示</div>
            <div style="font-size:12px;color:#856404;line-height:1.6;">
                1. 请确保题目图片清晰<br>
                2. 光线充足可提高识别准确率<br>
                3. 如果识别有误，可以手动输入修正
            </div>
        </div>
        
        <button onclick="closeModal()" style="width:100%;margin-top:12px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">取消</button>
    `;
}

// 核心函数：拍照上传 → OCR → AI出题 → 交互答题
async function photoToQuestion(imageDataUrl) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    // 显示加载状态
    content.innerHTML = `
        <div class="modal-title">📷 正在识别题目...</div>
        <div class="card" style="padding:24px;text-align:center;">
            <img src="${imageDataUrl}" style="width:100%;max-height:200px;object-fit:contain;border-radius:12px;margin-bottom:20px;"/>
            <div id="ocr-progress" style="padding:16px;background:#f5f7ff;border-radius:12px;">
                <div style="font-size:14px;color:#1A6BFF;margin-bottom:12px;" id="ocr-progress-text">🔄 正在初始化OCR引擎...</div>
                <div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;">
                    <div id="ocr-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#667eea,#764ba2);transition:width 0.3s;"></div>
                </div>
            </div>
        </div>
    `;
    
    const progressText = document.getElementById('ocr-progress-text');
    const progressBar = document.getElementById('ocr-progress-bar');
    
    const updateProgress = (text, percent) => {
        if (progressText) progressText.textContent = text;
        if (progressBar) progressBar.style.width = percent + '%';
    };
    
    try {
        // Step 1: OCR提取文字
        updateProgress('🔄 正在识别文字...', 30);
        const ocrText = await ocrExtractText(imageDataUrl, updateProgress);
        
        if (!ocrText || ocrText.length < 5) {
            // OCR识别失败或文字太少，尝试直接用DeepSeek视觉理解
            updateProgress('🔄 OCR识别文字较少，尝试AI图片理解...', 60);
            
            // 尝试使用视觉API
            if (VISION_API_KEY && VISION_API_URL) {
                const visionResult = await callVisionAPI(imageDataUrl, '请识别这张图片中的题目内容，包括题干、选项（如果有）、答案（如果有）。用中文回答。');
                if (visionResult.success) {
                    updateProgress('🔄 AI正在解析题目...', 80);
                    const questionData = await aiParseQuestion(visionResult.content);
                    if (!questionData.error) {
                        renderInteractiveQuestion(questionData);
                        return;
                    }
                }
            }
            
            // 降级处理
            content.innerHTML = `
                <div class="modal-title">⚠️ 识别结果不理想</div>
                <div class="card" style="padding:16px;">
                    <p style="font-size:14px;color:#666;margin-bottom:16px;text-align:center;">
                        抱歉，图片识别效果不佳，可能是：
                    </p>
                    <ul style="font-size:13px;color:#666;line-height:2;margin-bottom:16px;padding-left:20px;">
                        <li>图片不够清晰</li>
                        <li>光线不足或反光</li>
                        <li>文字太小或模糊</li>
                    </ul>
                    <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
                        <div style="font-size:13px;color:#1A6BFF;margin-bottom:8px;font-weight:600;">🤖 已识别的文字</div>
                        <div style="font-size:13px;color:#333;line-height:1.6;background:white;padding:12px;border-radius:8px;max-height:150px;overflow-y:auto;">${ocrText || '(未能识别出文字)'}</div>
                    </div>
                    <textarea id="ocr-correct-input" placeholder="如果识别有误，请在此修正题目内容..." style="width:100%;height:100px;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:13px;resize:none;margin-bottom:12px;">${ocrText || ''}</textarea>
                    <button onclick="aiParseFromText(document.getElementById('ocr-correct-input').value)" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI生成题目</button>
                </div>
                <button onclick="closeModal()" style="width:100%;margin-top:8px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
            `;
            return;
        }
        
        // Step 2: AI解析为结构化题目
        updateProgress('🔄 AI正在解析题目结构...', 70);
        const questionData = await aiParseQuestion(ocrText);
        
        if (questionData.error) {
            content.innerHTML = `
                <div class="modal-title">❌ 解析失败</div>
                <div class="card" style="padding:16px;text-align:center;">
                    <div style="font-size:48px;margin-bottom:12px;">😕</div>
                    <p style="font-size:14px;color:#666;margin-bottom:16px;">${questionData.error}</p>
                    <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:16px;text-align:left;">
                        <div style="font-size:12px;color:#666;margin-bottom:4px;">已识别的文字：</div>
                        <div style="font-size:13px;color:#333;">${ocrText}</div>
                    </div>
                    <textarea id="ocr-correct-input" placeholder="请手动输入或修正题目..." style="width:100%;height:80px;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:13px;resize:none;margin-bottom:12px;">${ocrText}</textarea>
                    <button onclick="aiParseFromText(document.getElementById('ocr-correct-input').value)" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🤖 继续解析</button>
                </div>
                <button onclick="closeModal()" style="width:100%;margin-top:8px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
            `;
            return;
        }
        
        // Step 3: 渲染交互式题目
        updateProgress('✅ 识别完成！', 100);
        setTimeout(() => {
            renderInteractiveQuestion(questionData);
        }, 300);
        
    } catch (e) {
        console.error('photoToQuestion error:', e);
        content.innerHTML = `
            <div class="modal-title">❌ 出错了</div>
            <div class="card" style="padding:16px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">😕</div>
                <p style="font-size:14px;color:#666;margin-bottom:16px;">识别过程中出现错误：${escapeHtml(e.message)}</p>
                <button onclick="closeModal()" style="width:100%;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
            </div>
        `;
    }
}

// 从文本直接解析题目（OCR识别后手动修正用）
async function aiParseFromText(text) {
    if (!text || text.trim().length < 5) {
        showToast('请输入题目内容');
        return;
    }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="modal-title">🤖 正在生成题目...</div>
        <div class="card" style="padding:24px;text-align:center;">
            <div class="ai-loading">AI正在分析题目...</div>
        </div>
    `;
    
    try {
        const questionData = await aiParseQuestion(text);
        
        if (questionData.error) {
            content.innerHTML = `
                <div class="modal-title">❌ 解析失败</div>
                <div class="card" style="padding:16px;text-align:center;">
                    <p style="font-size:14px;color:#666;">${questionData.error}</p>
                    <button onclick="closeModal()" style="margin-top:12px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
                </div>
            `;
            return;
        }
        
        renderInteractiveQuestion(questionData);
    } catch (e) {
        content.innerHTML = `
            <div class="modal-title">❌ 出错了</div>
            <div class="card" style="padding:16px;text-align:center;">
                <p style="font-size:14px;color:#666;">${escapeHtml(e.message)}</p>
                <button onclick="closeModal()" style="margin-top:12px;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
            </div>
        `;
    }
}

// 处理拍照输入（统一入口）
function handlePhotoToQuestion(input) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        photoToQuestion(imageData);
        input.value = '';
    };
    
    reader.onerror = function() {
        showToast('图片读取失败，请重试');
    };
    
    reader.readAsDataURL(file);
}

// 记录OCR题目答题结果
function recordOcrQuestionResult(isCorrect) {
    const user = getCurrentUserData();
    if (!user) return;
    
    if (!user.ocrPracticeStats) {
        user.ocrPracticeStats = { total: 0, correct: 0 };
    }
    user.ocrPracticeStats.total++;
    if (isCorrect) {
        user.ocrPracticeStats.correct++;
    }
    saveUserData(user);
}

// Window exports
window.photoToQuestion = photoToQuestion;
window.ocrExtractText = ocrExtractText;
window.aiParseQuestion = aiParseQuestion;
window.renderInteractiveQuestion = renderInteractiveQuestion;
window.submitOcrAnswer = submitOcrAnswer;
window.selectOcrOption = selectOcrOption;
window.handlePhotoToQuestion = handlePhotoToQuestion;
window.showOcrQuestionModal = showOcrQuestionModal;
window.aiParseFromText = aiParseFromText;
window.recordOcrQuestionResult = recordOcrQuestionResult;

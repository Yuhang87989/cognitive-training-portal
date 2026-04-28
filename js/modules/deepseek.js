// 版本: V140

var currentDeepSeekImage = null;
var deepseekConversationHistory = [];
// isRecording在audio.js中声明，此处直接使用
// deepseekRecognition在audio.js中声明，此处直接使用


// 视觉API - 图片理解（支持硅基流动等视觉模型，未配置则优雅降级）
async function callVisionAPI(imageDataUrl, question) {
    var visionApiKey = typeof VISION_API_KEY !== 'undefined' ? VISION_API_KEY : '';
    var visionApiUrl = typeof VISION_API_URL !== 'undefined' ? VISION_API_URL : '';
    var visionModel = typeof VISION_MODEL !== 'undefined' ? VISION_MODEL : '';
    
    if (visionApiKey && visionApiUrl) {
        try {
            var messages = [{
                role: 'user',
                content: [
                    {type: 'image_url', image_url: {url: imageDataUrl}},
                    {type: 'text', text: question}
                ]
            }];
            var response = await fetch(visionApiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + visionApiKey},
                body: JSON.stringify({model: visionModel, messages: messages, max_tokens: 1000})
            });
            if (response.ok) {
                var data = await response.json();
                if (data.choices && data.choices[0]) return {success: true, content: data.choices[0].message.content};
            }
        } catch(e) { console.warn('Vision API failed:', e.message); }
    }
    return {success: false, content: ''};
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
        // 尝试使用视觉API分析图片
        const visionResult = await callVisionAPI(imageDataUrl, msg || '请分析这张图片');
        if (visionResult.success) {
            // 视觉API成功，用分析结果作为用户消息
            userContent = '[用户上传了一张图片，AI视觉分析结果：' + visionResult.content + ']\n\n' + (msg || '请基于以上图片分析进一步回答');
        } else {
            // 视觉API失败，提示用户配置API或提供文字描述
            if (msg) {
                userContent = '[用户上传了一张图片（图片分析API未配置），已附上文字问题]

' + msg;
                showToast('💡 提示：图片分析需要配置VISION_API_KEY');
            } else {
                userContent = '[用户上传了一张图片]

请描述图片内容或配置图片理解API';
                showToast('⚠️ 图片分析API未配置，请输入文字描述图片内容');
            }
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
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent);
            }
            // 添加AI回复到历史
            deepseekConversationHistory.push({role: 'assistant', content: responseContent});
            // 自动朗读AI回复
            speakText(responseContent);
        }
    } catch (error) {
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (bubbles.length > 0) {
            bubbles[bubbles.length - 1].innerHTML = '❌ 发生错误，请稍后重试。';
        }
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

        const data = await response.json();
        const aiContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'AI分析失败，请稍后重试';

        resultEl.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:400px;overflow-y:auto;">' +
            '<div style="font-size:12px;color:#667eea;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:4px;">🤖 AI深度分析</div>' +
            '<div style="font-size:14px;line-height:1.8;color:#333;">' + aiContent.replace(/\n/g, '<br>') + '</div>' +
            '</div>';
    } catch (err) {
        const resultId = 'method-ai-result-' + methodId + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (resultEl) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">AI分析失败，请检查网络连接</div>';
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

        const data = await response.json();
        const aiContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'AI分析失败，请稍后重试';

        resultEl.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:400px;overflow-y:auto;">' +
            '<div style="font-size:12px;color:#667eea;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:4px;">🤖 ' + (typeNames[type] || '思维训练') + 'AI深度分析</div>' +
            '<div style="font-size:14px;line-height:1.8;color:#333;">' + aiContent.replace(/\n/g, '<br>') + '</div>' +
            '</div>';
    } catch (err) {
        const resultId = 'thinking-ai-result-' + type + '-' + questionIdx;
        const resultEl = document.getElementById(resultId);
        if (resultEl) {
            resultEl.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">AI分析失败，请检查网络连接</div>';
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

function handleDeepSeekImage(input) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentDeepSeekImage = e.target.result;
        
        // 显示预览
        const preview = document.getElementById('deepseek-image-preview');
        const previewImg = document.getElementById('deepseek-preview-img');
        if (preview && previewImg) {
            previewImg.src = currentDeepSeekImage;
            preview.style.display = 'block';
        }
        
        showToast('图片已添加，输入问题后发送');
        input.value = '';
    };
    reader.readAsDataURL(file);
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

async function queryDeepSeekBalance(showToast) {
    try {
        const response = await fetch('https://api.deepseek.com/v1/users/me/balance', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('无法获取余额');
        }
        
        const data = await response.json();
        const balance = data.is_available ? (data.balance / 100).toFixed(2) : '0.00';
        const tokens = data.is_available ? Math.floor(data.balance / 0.001) : 0;
        
        // 获取本地存储的调用统计
        const user = getCurrentUserData();
        const todayCalls = user?.deepSeekCalls?.today || 0;
        const totalCalls = user?.deepSeekCalls?.total || 0;
        
        if (showToast) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;';
            toast.textContent = '余额已更新';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 1500);
        }
        
        return {
            balance: '¥' + balance,
            tokens: tokens.toLocaleString(),
            todayCalls: todayCalls,
            totalCalls: totalCalls,
            lastUpdate: new Date().toLocaleTimeString()
        };
    } catch (error) {
        // 返回默认数据
        return {
            balance: '¥--',
            tokens: '--',
            todayCalls: 0,
            totalCalls: 0,
            lastUpdate: '查询失败',
            error: error.message
        };
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
        <div class="card">
            <h3 style="margin-bottom:16px;">🤖 DeepSeek AI 助手 <button class="tts-stop-btn" id="tts-stop-btn" onclick="stopTTSSpeech()" style="display:none;" title="停止朗读">🔇</button></h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">智能学习助手，支持文字、语音和图片提问</p>
        </div>
        <div class="chat-container" style="height:350px;">
            <div class="chat-messages" id="deepseek-messages">
                <div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">你好！我是DeepSeek AI助手，有什么学习上的问题可以问我哦！你可以：
                    <br>• 文字输入问题
                    <br>• 点击🎤语音输入
                    <br>• 点击📷上传图片提问
                </div></div>
            </div>
            <div class="chat-input-area">
                ${voiceBtn}
                <button class="chat-voice-btn" id="deepseek-image-btn" onclick="document.getElementById('deepseek-image-input').click()" title="上传图片">📷</button>
                <input type="file" id="deepseek-image-input" accept="image/*" style="display:none" onchange="handleDeepSeekImage(this)"/>
                <input type="text" class="chat-input" id="deepseek-input" placeholder="输入问题..." onkeypress="if(event.key==='Enter')sendToDeepSeek()">
                <button class="chat-send" onclick="sendToDeepSeek()">发送</button>
            </div>
        </div>
        <div id="deepseek-image-preview" style="display:none;padding:12px;background:#f5f7ff;border-radius:12px;margin-top:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <img id="deepseek-preview-img" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"/>
                <span style="font-size:12px;color:#666;">图片已准备好</span>
                <button onclick="clearDeepSeekImage()" style="margin-left:auto;background:#ff6b6b;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">移除</button>
            </div>
        </div>
        <div class="template-btns" style="margin-top:12px;">
            <button class="template-btn" onclick="askTemplate('帮我解释一下勾股定理')">勾股定理</button>
            <button class="template-btn" onclick="askTemplate('英语语法怎么学')">英语语法</button>
            <button class="template-btn" onclick="askTemplate('提高记忆力的方法')">记忆方法</button>
        </div>
    `;
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
window.sendToDeepSeek = sendToDeepSeek;
window.clearDeepSeekImage = clearDeepSeekImage;
window.askTemplate = askTemplate;
window.queryDeepSeekBalance = queryDeepSeekBalance;
window.showDeepSeekBalanceAlert = showDeepSeekBalanceAlert;
window.analyzePhotoWithAI = analyzePhotoWithAI;
window.sendMentorMessage = sendMentorMessage;
window.toggleVoiceInput = toggleVoiceInput;
window.closeDetail = closeDetail;
window.selectRechargePackage = selectRechargePackage;
window.closeModal = closeModal;

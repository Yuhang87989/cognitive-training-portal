// 版本: V226 - ES6 Module
// AI对话模块 - DeepSeek

// V152修复: 图片识别功能改用视觉API，不再依赖Tesseract.js
// V152修复: 支持DeepSeek视觉（如果可用）或硅基流动Qwen3-VL
// V151-fix: callVisionAPI添加详细日志、图片格式处理、错误处理
// V148-fix: toggleDeepSeekVoice添加微信浏览器检测
// V147修复: 添加escapeHtml到window导出，确保全局可用

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

var currentDeepSeekImage = null;

function clearDeepSeekImage() { currentDeepSeekImage = null; }
window.clearDeepSeekImage = clearDeepSeekImage;

// === 缺失函数定义 ===
function formatAIResponse(text) {
    if (!text) return '';
    var html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#f5f5f5;padding:8px;border-radius:4px;overflow-x:auto;font-size:12px;">$1</pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-size:12px;">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n/g, '<br>');
    return html;
}
window.formatAIResponse = formatAIResponse;

function recordDeepSeekCall(tokens) {
    try {
        var today = new Date().toISOString().split('T')[0];
        var stats = JSON.parse(localStorage.getItem('ds_call_stats') || '{}');
        if (!stats[today]) stats[today] = { calls: 0, tokens: 0 };
        stats[today].calls++;
        stats[today].tokens += (tokens || 0);
        localStorage.setItem('ds_call_stats', JSON.stringify(stats));
    } catch(e) {}
}
window.recordDeepSeekCall = recordDeepSeekCall;

// 记录详细的DeepSeek使用统计
function recordDetailedUsage(inputTokens, outputTokens, questionSummary, model) {
    if (window.UsageStatsModule) {
        window.UsageStatsModule.recordUsage(inputTokens, outputTokens, questionSummary, model);
    }
    // 同时保持原有统计
    recordDeepSeekCall((inputTokens || 0) + (outputTokens || 0));
}
window.recordDetailedUsage = recordDetailedUsage;


var deepseekConversationHistory = (function() {
    try {
        var saved = localStorage.getItem('cognitive_training_ds_conversation');
        return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
})();

function saveDeepSeekConversation() {
    try {
        var toSave = deepseekConversationHistory;
        if (toSave.length > 40) { toSave = toSave.slice(toSave.length - 40); deepseekConversationHistory = toSave; }
        localStorage.setItem('cognitive_training_ds_conversation', JSON.stringify(toSave));
        // 自动保存到历史列表
        autoSaveDeepSeekHistory();
    } catch(e) { console.error('Save conversation error:', e); }
}

function autoSaveDeepSeekHistory() {
    if (!deepseekConversationHistory || deepseekConversationHistory.length < 2) return;
    var saved = getSavedDeepSeekChats();
    var title = '';
    for (var i = 0; i < deepseekConversationHistory.length; i++) {
        if (deepseekConversationHistory[i].role === 'user') {
            var c = deepseekConversationHistory[i].content;
            title = typeof c === 'string' ? c : (Array.isArray(c) ? (c.find(function(x){return x.type==='text';}) || {}).text || '图片对话' : '对话');
            break;
        }
    }
    var now = new Date();
    var timeStr = (now.getMonth()+1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    // 更新最后一条或新建
    var lastSaved = saved.length > 0 ? saved[saved.length - 1] : null;
    if (lastSaved && lastSaved._sessionId === window._dsSessionId) {
        // 更新当前会话
        lastSaved.title = title.substring(0, 30);
        lastSaved.time = timeStr;
        lastSaved.count = deepseekConversationHistory.length;
        lastSaved.messages = deepseekConversationHistory.slice();
    } else {
        // 新建会话
        if (!window._dsSessionId) window._dsSessionId = Date.now().toString();
        saved.push({
            title: title.substring(0, 30),
            time: timeStr,
            count: deepseekConversationHistory.length,
            messages: deepseekConversationHistory.slice(),
            _sessionId: window._dsSessionId
        });
    }
    if (saved.length > 1000) saved = saved.slice(saved.length - 1000);
    try { localStorage.setItem('ds_saved_chats', JSON.stringify(saved)); } catch(e) {}
}

function clearDeepSeekConversation() {
    deepseekConversationHistory = [];
    localStorage.removeItem('cognitive_training_ds_conversation');
}
window.clearDeepSeekConversation = clearDeepSeekConversation;

function isWeChatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

function supportsSpeechRecognition() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
}

// ============================================================
// 视觉API调用函数 - V152核心修改
// ============================================================

async function callSiliconFlowVisionAPI(imageDataUrl, question) {
    console.log('[VisionAPI] 使用硅基流动Qwen3-VL进行图片识别');
    if (!imageDataUrl || !imageDataUrl.startsWith('data:')) {
        return {success: false, content: '', message: '图片格式不正确'};
    }
    try {
        window.showToast('正在识别图片...');
        var messages = [
            { role: 'user', content: [
                { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } },
                { type: 'text', text: question || '请分析这张图片的内容，识别其中的文字和关键信息。' }
            ]}
        ];
        var result = await callVisionAPIEndpoint(messages, 0.3, 'siliconflow');
        return result;
    } catch(e) {
        console.warn('[VisionAPI] 硅基流动视觉识别异常:', e.message);
        return {success: false, content: '', message: e.message};
    }
}

async function callDeepSeekVisionAPI(imageDataUrl, question) {
    console.log('[VisionAPI] 尝试使用DeepSeek视觉API');
    if (!imageDataUrl || !imageDataUrl.startsWith('data:')) {
        return {success: false, content: '', message: '图片格式不正确'};
    }
    try {
        window.showToast('正在识别图片...');
        var messages = [
            { role: 'user', content: [
                { type: 'image_url', image_url: { url: imageDataUrl } },
                { type: 'text', text: question || '请分析这张图片的内容，识别其中的文字和关键信息。' }
            ]}
        ];
        var result = await callVisionAPIEndpoint(messages, 0.3, 'deepseek');
        return result;
    } catch(e) {
        console.warn('[VisionAPI] DeepSeek视觉识别异常:', e.message);
        return {success: false, content: '', message: e.message};
    }
}

async function callVisionAPIEndpoint(messages, temperature, apiType) {
    var apiKey, apiUrl, model;
    if (apiType === 'siliconflow') {
        apiKey = VISION_SILICONFLOW_KEY || DEEPSEEK_API_KEY;
        apiUrl = VISION_SILICONFLOW_URL || 'https://api.siliconflow.cn/v1/chat/completions';
        model = VISION_SILICONFLOW_MODEL || 'Qwen/Qwen3-VL-30B-A3B-Instruct';
    } else {
        apiKey = DEEPSEEK_API_KEY;
        apiUrl = DEEPSEEK_API_URL;
        model = DEEPSEEK_MODEL;
    }
    if (!apiKey) return {success: false, content: '', message: '未配置API Key'};
    try {
        var response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: model, messages: messages, temperature: temperature || 0.3, max_tokens: 2000 })
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (errorData.error && errorData.error.message && 
                (errorData.error.message.includes('image_url') || errorData.error.message.includes('unknown variant'))) {
                console.warn('[VisionAPI] 当前API不支持视觉功能:', errorData.error.message);
                return {success: false, content: '', message: 'unsupported', unsupported: true};
            }
            if (response.status === 402) {
                return {success: false, type: 'balance', message: 'API账户余额不足或请求失败'};
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        var content = data.choices[0].message.content;
        if (data.usage) {
            // 提取问题摘要
            var questionSummary = '';
            if (messages && messages.length > 0) {
                var lastUserMsg = messages.filter(function(m) { return m.role === 'user'; }).pop();
                if (lastUserMsg) {
                    if (typeof lastUserMsg.content === 'string') {
                        questionSummary = lastUserMsg.content;
                    } else if (Array.isArray(lastUserMsg.content)) {
                        var textPart = lastUserMsg.content.find(function(p) { return p.type === 'text'; });
                        if (textPart) questionSummary = textPart.text;
                    }
                }
            }
            recordDetailedUsage(
                data.usage.prompt_tokens || data.usage.input_tokens || 0,
                data.usage.completion_tokens || data.usage.output_tokens || 0,
                questionSummary,
                DEEPSEEK_MODEL
            );
        }
        return {success: true, content: content};
    } catch (error) {
        if (error.message === 'unsupported') {
            return {success: false, content: '', message: 'unsupported', unsupported: true};
        }
        return {success: false, content: '', message: error.message};
    }
}

async function callVisionAPI(imageDataUrl, question) {
    console.log('[VisionAPI] 开始处理图片请求');
    if (!imageDataUrl) return {success: false, content: '', message: '图片数据为空'};
    if (!imageDataUrl.startsWith('data:')) return {success: false, content: '', message: '图片格式不正确'};
    
    if (VISION_SILICONFLOW_KEY || DEEPSEEK_API_KEY) {
        var result = await callSiliconFlowVisionAPI(imageDataUrl, question);
        if (result.success) { window.CURRENT_VISION_API = 'siliconflow'; return result; }
        if (result.unsupported) console.log('[VisionAPI] 硅基流动不支持视觉，降级到DeepSeek');
    }
    
    if (VISION_DEEPSEEK_ENABLED) {
        var deepseekResult = await callDeepSeekVisionAPI(imageDataUrl, question);
        if (deepseekResult.success) { window.CURRENT_VISION_API = 'deepseek'; return deepseekResult; }
    }
    
    return {success: false, content: '', message: '图片识别服务暂不可用，请手动输入文字描述'};
}

async function ocrExtractText(imageDataUrl, progressCallback) {
    if (progressCallback) progressCallback('正在用AI识别图片文字...', 30);
    var messages = [
        { role: 'system', content: '你是一个专业的OCR文字识别助手。请精准提取图片中的所有文字内容，保持原始格式和排版。' },
        { role: 'user', content: [
            { type: 'image_url', image_url: { url: imageDataUrl } },
            { type: 'text', text: '请提取这张图片中的所有文字内容。' }
        ]}
    ];
    if (progressCallback) progressCallback('AI正在识别文字...', 60);
    
    if (VISION_SILICONFLOW_KEY || DEEPSEEK_API_KEY) {
        var result = await callVisionAPIEndpoint(messages, 0.1, 'siliconflow');
        if (result.success) { if (progressCallback) progressCallback('识别完成', 100); return result.content; }
    }
    if (VISION_DEEPSEEK_ENABLED) {
        var result = await callVisionAPIEndpoint(messages, 0.1, 'deepseek');
        if (result.success) { if (progressCallback) progressCallback('识别完成', 100); return result.content; }
    }
    if (progressCallback) progressCallback('识别失败', 0);
    return null;
}

async function callDeepSeekAPI(messages, temperature) {
    try {
        var response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: messages, temperature: temperature || 0.7, max_tokens: 2000 })
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (response.status === 402) {
                return { error: true, type: 'balance', message: 'DeepSeek账户余额不足，请先充值后再使用AI功能。前往: https://platform.deepseek.com' };
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        var content = data.choices[0].message.content;
        if (data.usage) {
            // 提取问题摘要
            var questionSummary = '';
            if (messages && messages.length > 0) {
                var lastUserMsg = messages.filter(function(m) { return m.role === 'user'; }).pop();
                if (lastUserMsg) {
                    if (typeof lastUserMsg.content === 'string') {
                        questionSummary = lastUserMsg.content;
                    } else if (Array.isArray(lastUserMsg.content)) {
                        var textPart = lastUserMsg.content.find(function(p) { return p.type === 'text'; });
                        if (textPart) questionSummary = textPart.text;
                    }
                }
            }
            recordDetailedUsage(
                data.usage.prompt_tokens || data.usage.input_tokens || 0,
                data.usage.completion_tokens || data.usage.output_tokens || 0,
                questionSummary,
                DEEPSEEK_MODEL
            );
        }
        return {success: true, content: content};
    } catch (error) {
        return {error: true, type: 'network', message: error.message};
    }
}

async function callVisionDeepSeekAPI(messages, temperature) {
    var hasVisionMessage = messages.some(function(m) { return Array.isArray(m.content); });
    if (hasVisionMessage) {
        // 尝试硅基流动
        if (VISION_SILICONFLOW_KEY) {
            try {
                var sfResult = await callSiliconFlowAPI(messages, temperature);
                if (sfResult.success) { window.CURRENT_VISION_API = 'siliconflow'; return sfResult; }
                if (sfResult.type === 'balance') {
                    // 余额不足，尝试DeepSeek
                } else if (!sfResult.unsupported) {
                    return sfResult;
                }
            } catch(e) { console.log('SiliconFlow error:', e); }
        }
        // 尝试DeepSeek视觉
        if (VISION_DEEPSEEK_ENABLED) {
            try {
                var dsResult = await callDeepSeekVisionEndpoint(messages, temperature);
                if (dsResult.success) { window.CURRENT_VISION_API = 'deepseek'; return dsResult; }
            } catch(e) { console.log('DeepSeek vision error:', e); }
        }
        // 所有视觉API都失败 - 用文字模式回复
        return {success: true, content: '⚠️ 图片识别服务暂不可用（硅基流动余额不足）。\n\n目前支持的功能：\n✅ 文字对话\n✅ 语音输入\n❌ 图片识别（需充值硅基流动）\n\n如需使用图片功能，请点击上方"充值"按钮。'};
    }
    return await callDeepSeekAPI(messages, temperature);
}

async function callSiliconFlowAPI(messages, temperature) {
    var apiKey = VISION_SILICONFLOW_KEY;
    var apiUrl = VISION_SILICONFLOW_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    var model = VISION_SILICONFLOW_MODEL || 'Qwen/Qwen3-VL-30B-A3B-Instruct';
    if (!apiKey) return {success: false, error: true, message: '未配置API Key'};
    try {
        var response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: model, messages: messages, temperature: temperature || 0.7, max_tokens: 2000 })
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (errorData.error && errorData.error.message) {
                if (errorData.error.message.includes('balance') || errorData.error.message.includes('insufficient')) {
                    return {success: false, error: true, type: 'balance', message: '硅基流动余额不足'};
                }
                if (errorData.error.message.includes('image_url') || errorData.error.message.includes('unsupported') || errorData.error.message.includes('model')) {
                    return {success: false, unsupported: true, message: errorData.error.message};
                }
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        return {success: true, content: data.choices[0].message.content};
    } catch (error) {
        if (error.message.includes('unsupported') || error.message.includes('model')) {
            return {success: false, unsupported: true, message: error.message};
        }
        return {success: false, error: true, message: error.message};
    }
}

async function callDeepSeekVisionEndpoint(messages, temperature) {
    try {
        var response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: messages, temperature: temperature || 0.7, max_tokens: 2000 })
        });
        if (!response.ok) {
            var errorData = await response.json().catch(function() { return {}; });
            if (errorData.error && errorData.error.message && 
                (errorData.error.message.includes('image_url') || errorData.error.message.includes('unknown variant'))) {
                return {success: false, unsupported: true, message: errorData.error.message};
            }
            throw new Error(errorData.error && errorData.error.message || 'API调用失败');
        }
        var data = await response.json();
        return {success: true, content: data.choices[0].message.content};
    } catch (error) {
        if (error.message.includes('image_url') || error.message.includes('unknown variant')) {
            return {success: false, unsupported: true, message: error.message};
        }
        return {success: false, error: true, message: error.message};
    }
}

function tipKeyboardVoice() {
    var input = document.getElementById('deepseek-input');
    if (input) { input.focus(); input.setAttribute('placeholder', '点击输入框后，用键盘🎤语音输入...'); }
    window.showToast('🎤 请点击输入框，使用键盘上的语音按钮说话', 4000);
}
window.tipKeyboardVoice = tipKeyboardVoice;

function triggerDeepSeekImage() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            var base64 = ev.target.result;
            var messagesEl = document.getElementById('deepseek-messages');
            if (messagesEl) {
                messagesEl.innerHTML += '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble"><img src="' + base64 + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:4px;display:block;"/><div style="font-size:11px;color:#999;">🔍 正在识别图片文字...</div></div></div>';
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }
            // 用Tesseract.js本地OCR识别文字
            ocrImageAndSend(base64);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}
window.triggerDeepSeekImage = triggerDeepSeekImage;

async function ocrImageAndSend(base64) {
    var messagesEl = document.getElementById('deepseek-messages');
    var sendBtn = document.getElementById('deepseek-send-btn');
    
    try {
        var ocrText = '';
        // V224: 按需加载Tesseract.js
        await new Promise(function(resolve) {
            if (typeof loadTesseract === 'function') {
                loadTesseract(resolve);
            } else {
                resolve();
            }
        });
        
        // 尝试用Tesseract.js识别
        if (typeof Tesseract !== 'undefined') {
            var result = await Tesseract.recognize(base64, 'chi_sim+eng', {
                logger: function(m) { if(m.status === 'recognizing text') { /* 进度 */ } }
            });
            ocrText = result.data.text.trim();
        }
        
        if (!ocrText) {
            // OCR没识别到文字，直接把图片发给AI描述
            if (messagesEl) {
                // 更新用户消息
                var lastBubble = messagesEl.querySelectorAll('.chat-bubble');
                if (lastBubble.length > 0) {
                    var last = lastBubble[lastBubble.length - 1];
                    var imgEl = last.querySelector('img');
                    last.innerHTML = (imgEl ? '<img src="' + imgEl.src + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:4px;display:block;"/>' : '') + '<div style="font-size:11px;color:#f90;">⚠️ 未识别到文字，图片可能是纯图像</div>';
                }
            }
            return;
        }
        
        // OCR成功 - 更新用户消息显示识别结果
        if (messagesEl) {
            var lastBubble = messagesEl.querySelectorAll('.chat-bubble');
            if (lastBubble.length > 0) {
                var last = lastBubble[lastBubble.length - 1];
                var imgEl = last.querySelector('img');
                last.innerHTML = (imgEl ? '<img src="' + imgEl.src + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:4px;display:block;"/>' : '') + '<div style="font-size:11px;color:#43a047;">✅ 识别到文字，正在分析...</div><div style="font-size:12px;color:#333;margin-top:4px;max-height:80px;overflow-y:auto;">' + ocrText.substring(0, 500) + '</div>';
            }
        }
        
        // 把识别的文字发给DeepSeek分析（只发纯文字消息，过滤掉历史中的图片消息）
        deepseekConversationHistory.push({role: 'user', content: '我上传了一张图片，识别到的文字内容如下：\n' + ocrText + '\n请帮我分析这些内容。'});
        saveDeepSeekConversation();
        
        // 添加AI思考中
        messagesEl.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble ai-loading">思考中<span class="loading-dots"><span></span><span></span><span></span></span></div></div>';
        messagesEl.scrollTop = messagesEl.scrollHeight;
        
        // 过滤历史消息，只保留纯文字（DeepSeek chat不支持图片格式）
        var textOnlyHistory = deepseekConversationHistory.map(function(m) {
            if (Array.isArray(m.content)) {
                var textParts = m.content.filter(function(c) { return c.type === 'text'; });
                if (textParts.length > 0) {
                    return {role: m.role, content: textParts.map(function(c) { return c.text; }).join('\n')};
                }
                return {role: m.role, content: '[图片]'};
            }
            return m;
        });
        var dsResult = await callDeepSeekAPI(textOnlyHistory);
        
        var bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (dsResult.error) {
            if (bubbles.length > 0) {
                bubbles[bubbles.length-1].classList.remove('ai-loading');
                bubbles[bubbles.length-1].innerHTML = '❌ ' + (dsResult.message || '分析失败');
            }
        } else {
            if (bubbles.length > 0) {
                bubbles[bubbles.length-1].classList.remove('ai-loading');
                bubbles[bubbles.length-1].innerHTML = formatAIResponse(dsResult.content) + '<button onclick="window.speakText(this.parentElement.textContent)" style="margin-top:8px;padding:4px 8px;background:#f0f0f0;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button>';
            }
            deepseekConversationHistory.push({role: 'assistant', content: dsResult.content});
            saveDeepSeekConversation();
            recordDeepSeekCall(Math.ceil(dsResult.content.length / 4));
            speakText(dsResult.content);
        }
    } catch(e) {
        console.error('OCR error:', e);
        if (messagesEl) {
            var lastBubble = messagesEl.querySelectorAll('.chat-bubble');
            if (lastBubble.length > 0) {
                lastBubble[lastBubble.length-1].innerHTML += '<div style="font-size:11px;color:#ff6b6b;">识别失败: ' + e.message + '</div>';
            }
        }
    }
}
window.ocrImageAndSend = ocrImageAndSend;



// V195: 对话模式切换
window.deepseekMode = localStorage.getItem('deepseek_mode') || 'fast'; // 'fast' | 'expert'

window.toggleDeepseekMode = function(mode) {
    window.deepseekMode = mode;
    localStorage.setItem('deepseek_mode', mode);
    document.querySelectorAll('.ds-mode-btn').forEach(btn => {
        btn.style.background = btn.dataset.mode === mode ? '#667eea' : '#f5f5f5';
        btn.style.color = btn.dataset.mode === mode ? 'white' : '#666';
    });
    window.showToast(mode === 'fast' ? '🚀 快速模式：省token、响应快' : '💎 专家模式：完整上下文、回答详细');
};

function getContextForMode() {
    const history = deepseekConversationHistory || [];
    if (window.deepseekMode === 'fast') {
        // 快速模式：只带最近5条 + 简短提示
        return history.slice(-5);
    } else {
        // 专家模式：带最近20条
        return history.slice(-20);
    }
}

async function sendToDeepSeek() {
    const input = document.getElementById('deepseek-input');
    if (!input) { return; }
    const msg = input.value.trim();
    if (!msg && !currentDeepSeekImage) { window.showToast('请输入问题或上传图片'); return; }
    const messagesEl = document.getElementById('deepseek-messages');
    if (!messagesEl) return;
    stopTTSSpeech();
    const sendBtn = document.querySelector('.chat-send') || document.querySelector('#deepseek-send-btn');
    if (input) input.disabled = true;
    if (sendBtn) { sendBtn.disabled = true; sendBtn.style.opacity = '0.6'; sendBtn.style.cursor = 'not-allowed'; }
    
    let userMsgHtml = '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble">';
    if (currentDeepSeekImage) userMsgHtml += '<img src="' + currentDeepSeekImage + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:8px;display:block;"/>';
    if (msg) userMsgHtml += escapeHtml(msg);
    userMsgHtml += '</div></div>';
    messagesEl.innerHTML += userMsgHtml;
    input.value = '';
    messagesEl.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble ai-loading">思考中<span class="loading-dots"><span></span><span></span><span></span></span></div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    const hasImage = !!currentDeepSeekImage;
    const imageDataUrl = currentDeepSeekImage;
    
    if (hasImage) {
        var userContent = [{ type: 'image_url', image_url: { url: imageDataUrl } }];
        if (msg) { userContent.push({ type: 'text', text: msg }); }
        else { userContent.push({ type: 'text', text: '请分析这张图片' }); }
        deepseekConversationHistory.push({role: 'user', content: userContent});
    } else {
        deepseekConversationHistory.push({role: 'user', content: msg});
    }
    
    clearDeepSeekImage();
    
    try {
        const contextToSend = getContextForMode();
        const result = await callVisionDeepSeekAPI(contextToSend);
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (input) { input.disabled = false; input.focus(); }
        if (sendBtn) { sendBtn.disabled = false; sendBtn.style.opacity = '1'; sendBtn.style.cursor = 'pointer'; }
        
        if (result.error) {
            if (bubbles.length > 0) {
                if (result.type === 'vision') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="window.showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:6px;cursor:pointer;">💳 充值硅基流动</button>';
                } else if (result.type === 'balance') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="window.showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:linear-gradient(135deg,#667eea,#4facfe);color:white;border:none;border-radius:6px;cursor:pointer;">💳 充值</button>';
                } else {
                    bubbles[bubbles.length - 1].innerHTML = '❌ 抱歉，' + result.message;
                }
            }
        } else {
            const responseContent = result.content;
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent) + 
                    '<button onclick="window.speakText(this.parentElement.querySelector(\'.ai-text\').textContent || this.parentElement.textContent)" style="margin-top:8px;padding:4px 8px;background:#f0f0f0;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button>';
            }
            deepseekConversationHistory.push({role: 'assistant', content: responseContent});
            saveDeepSeekConversation();
            recordDeepSeekCall(Math.ceil(responseContent.length / 4));
            const dsUser = window.getCurrentUserData();
            if (dsUser) { dsUser.aiChatCount = (dsUser.aiChatCount || 0) + 1; saveUserData(dsUser); }
            speakText(responseContent);
        }
    } catch (error) {
        if (input) { input.disabled = false; input.focus(); }
        if (sendBtn) { sendBtn.disabled = false; sendBtn.style.opacity = '1'; sendBtn.style.cursor = 'pointer'; }
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');
        if (bubbles.length > 0) bubbles[bubbles.length - 1].innerHTML = '❌ 发生错误：' + escapeHtml(error.message);
    } finally {
        var finalInput = document.getElementById('deepseek-input');
        var finalSendBtn = document.querySelector('.chat-send') || document.querySelector('#deepseek-send-btn');
        if (finalInput) finalInput.disabled = false;
        if (finalSendBtn) { finalSendBtn.disabled = false; finalSendBtn.style.opacity = '1'; finalSendBtn.style.cursor = 'pointer'; }
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
}
window.sendToDeepSeek = sendToDeepSeek;
async function analyzeTopicWithAI(topicId) {
    // 占位函数 - 话题AI分析
    window.showToast('AI分析功能开发中');
}

// ====== 充值入口 ======

// DeepSeek充值（打开DeepSeek平台充值页面）
function openDeepSeekRecharge() {
    window.open('https://platform.deepseek.com/usage', '_blank');
}

// 硅基流动充值（打开硅基流动平台充值页面）  
function openSiliconFlowRecharge() {
    window.open('https://cloud.siliconflow.cn/account/charge', '_blank');
}

// 显示API余额/充值弹窗
function showAPIRechargeModal() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    if (!modal || !content) return;
    modal.classList.add('show');
    
    content.innerHTML = '<div class="modal-title" style="margin-bottom:12px;">💳 充值</div>' +
        '<div style="padding:12px;margin-bottom:8px;background:#f5f7ff;border-radius:10px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;">' +
                '<div>' +
                    '<div style="font-size:14px;font-weight:600;color:#333;">DeepSeek</div>' +
                    '<div style="font-size:11px;color:#999;">AI对话</div>' +
                '</div>' +
                '<button onclick="window.openDeepSeekRecharge()" style="padding:6px 14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">充值</button>' +
            '</div>' +
        '</div>' +
        '<div style="padding:12px;margin-bottom:8px;background:#f0fff4;border-radius:10px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;">' +
                '<div>' +
                    '<div style="font-size:14px;font-weight:600;color:#333;">硅基流动</div>' +
                    '<div style="font-size:11px;color:#999;">图片识别 🎁送14元</div>' +
                '</div>' +
                '<button onclick="window.openSiliconFlowRecharge()" style="padding:6px 14px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">充值</button>' +
            '</div>' +
        '</div>' +
        '<button onclick="window.closeModal()" style="width:100%;padding:10px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">关闭</button>';
}

window.openDeepSeekRecharge = openDeepSeekRecharge;
window.openSiliconFlowRecharge = openSiliconFlowRecharge;
window.showAPIRechargeModal = showAPIRechargeModal;

// Restore DeepSeek chat history to UI
function restoreDeepSeekChatHistory() {
    var messagesEl = document.getElementById('deepseek-messages');
    if (!messagesEl) return;
    messagesEl.innerHTML = '';
    for (var i = 0; i < deepseekConversationHistory.length; i++) {
        var msg = deepseekConversationHistory[i];
        if (msg.role === 'user') {
            var content = msg.content;
            if (typeof content === 'string') {
                messagesEl.innerHTML += '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble">' + escapeHtml(content) + '</div></div>';
            } else if (Array.isArray(content)) {
                var html = '<div class="chat-msg user"><div class="chat-avatar">👤</div><div class="chat-bubble">';
                for (var j = 0; j < content.length; j++) {
                    if (content[j].type === 'image_url') {
                        var imgUrl = content[j].image_url && content[j].image_url.url ? content[j].image_url.url : '';
                        if (imgUrl && imgUrl.startsWith('data:')) {
                            // Skip base64 images in history (too large), show placeholder
                            html += '<div style="color:#999;font-size:12px;">[图片]</div>';
                        } else if (imgUrl) {
                            html += '<img src="' + imgUrl + '" style="max-width:150px;max-height:100px;border-radius:8px;margin-bottom:8px;"/>';
                        }
                    } else if (content[j].type === 'text') {
                        html += escapeHtml(content[j].text);
                    }
                }
                html += '</div></div>';
                messagesEl.innerHTML += html;
            }
        } else if (msg.role === 'assistant') {
            messagesEl.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">' + formatAIResponse(msg.content) + '</div></div>';
        }
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
}
window.restoreDeepSeekChatHistory = restoreDeepSeekChatHistory;

// DeepSeek页面渲染函数
function renderDeepseek(contentEl) {
    if (!contentEl) return;
    // 获取余额
    var balance = localStorage.getItem('deepseek_balance') || '0.00';
    
    contentEl.innerHTML = '<div style="display:flex;flex-direction:column;height:100%;max-width:100%;margin:0 auto;">' +
        // 顶部信息卡
        '<div style="padding:10px 12px;background:white;border-bottom:1px solid #f0f0f0;flex-shrink:0;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;">' +
                '<div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="window.toggleDeepSeekHistory()" title="点击查看聊天历史">' +
                    '<div style="width:32px;height:32px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(102,126,234,0.3);">🤖</div>' +
                    '<div><div style="font-size:13px;font-weight:600;color:#333;">DeepSeek AI 助手</div><div style="font-size:10px;color:#999;">智能学习助手 · 点击看历史</div></div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<div style="font-size:10px;color:#999;">余额 <span id="ds-balance" style="color:#43a047;font-weight:600;">¥' + balance + '</span></div>' +
        '<button onclick="window.openApiConfigModal(\'deepseek\')" style="padding:4px 8px;background:#f0f0f0;color:#666;border:none;border-radius:6px;font-size:11px;cursor:pointer;">配置</button>' +
        '<button onclick="window.showAPIRechargeModal()" style="padding:4px 8px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">充值</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // 聊天区
        '<div id="deepseek-messages" style="flex:1;overflow-y:auto;padding:10px;font-size:13px;"></div>' +
        // 模式切换按钮
        '<div style="padding:6px 10px;background:#f9f9f9;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0;">' +
        '  <button class="ds-mode-btn" data-mode="fast" onclick="window.toggleDeepseekMode(\'fast\')" style="flex:1;padding:6px 12px;border:none;border-radius:16px;font-size:11px;cursor:pointer;background:#667eea;color:white;transition:all 0.2s;">' +
        '    🚀 快速模式' +
        '  </button>' +
        '  <button class="ds-mode-btn" data-mode="expert" onclick="window.toggleDeepseekMode(\'expert\')" style="flex:1;padding:6px 12px;border:none;border-radius:16px;font-size:11px;cursor:pointer;background:#f5f5f5;color:#666;transition:all 0.2s;">' +
        '    💎 专家模式' +
        '  </button>' +
        '</div>' +
        // 输入区
        '<div style="padding:6px 8px;border-top:1px solid #eee;display:flex;gap:4px;align-items:center;background:white;flex-shrink:0;">' +
            '<button onclick="triggerDeepSeekImage()" style="width:28px;height:28px;border:none;background:#667eea;color:white;border-radius:6px;font-size:12px;cursor:pointer;flex-shrink:0;">📷</button>' +
            '<input type="text" id="deepseek-input" placeholder="输入问题..." style="flex:1;padding:5px 8px;border:1px solid #ddd;border-radius:6px;font-size:12px;min-width:0;" onkeypress="if(event.key===\'Enter\')sendToDeepSeek()"/>' +
            '<button id="deepseek-send-btn" class="chat-send" onclick="sendToDeepSeek()" style="width:28px;height:28px;border:none;background:#667eea;color:white;border-radius:6px;font-size:12px;cursor:pointer;flex-shrink:0;">➤</button>' +
            '<button onclick="toggleDeepSeekVoice()" style="width:28px;height:28px;border:none;background:#f093fb;color:white;border-radius:6px;font-size:12px;cursor:pointer;flex-shrink:0;">🎤</button>' +
        '</div>' +
    '</div>';
    // 恢复聊天历史
    restoreDeepSeekChatHistory();
    
    // 如果没有历史，显示欢迎消息
    var msgsEl = document.getElementById('deepseek-messages');
    var hasHistory = deepseekConversationHistory && deepseekConversationHistory.length > 0;
    if (msgsEl && !hasHistory) {
        msgsEl.innerHTML = '<div style="margin-bottom:8px;">' +
            '<div style="display:flex;align-items:flex-start;gap:6px;">' +
                '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">🤖</div>' +
                '<div style="background:white;border-radius:10px;padding:8px 10px;font-size:12px;color:#333;box-shadow:0 1px 3px rgba(0,0,0,0.1);max-width:85%;">你好！我是DeepSeek AI助手，有什么学习问题可以问我~ 支持文字、语音和图片提问 📸</div>' +
            '</div>' +
        '</div>';
    }
    
    // 查询余额
    updateDeepSeekBalance();
    
    // 初始化模式按钮状态
    setTimeout(function() {
        if (typeof window.deepseekMode !== 'undefined') {
            document.querySelectorAll('.ds-mode-btn').forEach(btn => {
                btn.style.background = btn.dataset.mode === window.deepseekMode ? '#667eea' : '#f5f5f5';
                btn.style.color = btn.dataset.mode === window.deepseekMode ? 'white' : '#666';
            });
        }
    }, 50);
}
window.renderDeepseek = renderDeepseek;

function updateDeepSeekBalance() {
    var apiKey = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : 
                 localStorage.getItem('deepseek_api_key') || '';
    if (!apiKey) {
        var user = window.getCurrentUserData();
        apiKey = user && user.deepseekApiKey ? user.deepseekApiKey : '';
    }
    if (!apiKey) {
        var el = document.getElementById('ds-balance');
        if (el) el.textContent = '未配置';
        return;
    }
    fetch('https://api.deepseek.com/user/balance', {
        headers: { 'Authorization': 'Bearer ' + apiKey }
    }).then(function(r) { return r.json(); }).then(function(data) {
        if (data && data.balance_infos && data.balance_infos.length > 0) {
            var bal = data.balance_infos[0].total_balance || '0';
            localStorage.setItem('deepseek_balance', bal);
            var el = document.getElementById('ds-balance');
            if (el) el.textContent = '¥' + parseFloat(bal).toFixed(2);
        }
    }).catch(function() {
        var cached = localStorage.getItem('deepseek_balance');
        if (cached) {
            var el = document.getElementById('ds-balance');
            if (el) el.textContent = '¥' + parseFloat(cached).toFixed(2);
        }
    });
}
window.updateDeepSeekBalance = updateDeepSeekBalance;


function toggleDeepSeekHistory() {
    var container = document.getElementById('fullscreen-content');
    if (!container) return;
    
    var saved = getSavedDeepSeekChats();
    
    var html = '<div style="display:flex;flex-direction:column;height:100%;background:#f5f5f5;">' +
        // 顶部栏
        '<div style="padding:12px 16px;background:white;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">' +
            '<button onclick="renderDeepseek(document.getElementById(\'fullscreen-content\'))" style="background:none;border:none;font-size:14px;color:#667eea;cursor:pointer;">← 返回对话</button>' +
            '<span style="font-size:15px;font-weight:600;color:#333;">📋 历史记录</span>' +
            '<span style="font-size:12px;color:#999;">' + saved.length + ' 条</span>' +
        '</div>' +
        // 搜索栏
        '<div style="padding:8px 12px;background:white;flex-shrink:0;">' +
            '<input id="ds-history-search" type="text" placeholder="🔍 搜索历史记录..." oninput="filterDeepSeekHistory()" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:8px;font-size:13px;box-sizing:border-box;outline:none;" />' +
        '</div>' +
        // 操作栏
        '<div style="padding:6px 12px;background:white;display:flex;gap:8px;flex-shrink:0;border-bottom:1px solid #eee;">' +
            '<button onclick="startNewDeepSeekChat();renderDeepseek(document.getElementById(\'fullscreen-content\'))" style="flex:1;padding:8px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📝 新对话</button>' +
            '<button onclick="if(confirm(\'确定清空所有历史？\')){clearAllDeepSeekHistory();toggleDeepSeekHistory();}" style="padding:8px 12px;background:#fff0f0;color:#ff6b6b;border:none;border-radius:6px;font-size:12px;cursor:pointer;">🗑 清空</button>' +
        '</div>' +
        // 列表
        '<div id="ds-history-list" style="flex:1;overflow-y:auto;padding:8px 0;">';
    
    if (saved.length === 0) {
        html += '<div style="padding:40px;text-align:center;color:#999;font-size:14px;">暂无历史记录</div>';
    } else {
        for (var i = saved.length - 1; i >= 0; i--) {
            var chat = saved[i];
            var title = chat.title || '对话';
            var time = chat.time || '';
            var count = chat.count || 0;
            var preview = '';
            for (var j = 0; j < (chat.messages || []).length; j++) {
                if (chat.messages[j].role === 'assistant') {
                    preview = (chat.messages[j].content || '').substring(0, 60);
                    break;
                }
            }
            html += '<div class="ds-history-item" data-title="' + title.toLowerCase() + '" data-preview="' + preview.toLowerCase() + '" onclick="loadSavedDeepSeekChat(' + i + ')" style="margin:0 12px 8px;padding:12px;background:white;border-radius:10px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.05);transition:transform 0.15s;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                    '<div style="font-size:14px;font-weight:500;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;margin-right:8px;">' + title + '</div>' +
                    '<button onclick="event.stopPropagation();deleteSavedDeepSeekChat(' + i + ');toggleDeepSeekHistory();" style="background:none;border:none;color:#ccc;font-size:14px;cursor:pointer;padding:4px;">✕</button>' +
                '</div>' +
                '<div style="font-size:12px;color:#999;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (preview || '...') + '</div>' +
                '<div style="display:flex;justify-content:space-between;margin-top:6px;">' +
                    '<span style="font-size:10px;color:#bbb;">🕐 ' + time + '</span>' +
                    '<span style="font-size:10px;color:#bbb;">' + count + '条消息</span>' +
                '</div>' +
            '</div>';
        }
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}
window.toggleDeepSeekHistory = toggleDeepSeekHistory;

function filterDeepSeekHistory() {
    var keyword = (document.getElementById('ds-history-search') || {}).value || '';
    keyword = keyword.toLowerCase();
    var items = document.querySelectorAll('.ds-history-item');
    items.forEach(function(item) {
        var title = item.getAttribute('data-title') || '';
        var preview = item.getAttribute('data-preview') || '';
        if (!keyword || title.includes(keyword) || preview.includes(keyword)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
window.filterDeepSeekHistory = filterDeepSeekHistory;

function clearAllDeepSeekHistory() {
    localStorage.removeItem('ds_saved_chats');
    localStorage.removeItem('cognitive_training_ds_conversation');
    deepseekConversationHistory = [];
    window.showToast('历史已清空');
}
window.clearAllDeepSeekHistory = clearAllDeepSeekHistory;

function openApiConfigModalBridge(type) {
    if (typeof openApiConfigModal === 'function') { openApiConfigModal(type); return; }
    var key = prompt('请输入 DeepSeek API Key:');
    if (key && key.trim()) {
        try { var c = JSON.parse(localStorage.getItem('api_config') || '{}'); c.deepseek = key.trim(); localStorage.setItem('api_config', JSON.stringify(c)); } catch(e) {}
        localStorage.setItem('deepseek_api_key', key.trim());
        updateDeepSeekBalance();
        window.showToast('API Key 已保存');
    }
}
window.openApiConfigModal = window.openApiConfigModal || openApiConfigModalBridge;

function getSavedDeepSeekChats() {
    try { return JSON.parse(localStorage.getItem('ds_saved_chats') || '[]'); }
    catch(e) { return []; }
}

function saveCurrentDeepSeekChat() {
    if (!deepseekConversationHistory || deepseekConversationHistory.length === 0) {
        window.showToast('当前没有对话可保存'); return;
    }
    var title = '';
    for (var i = 0; i < deepseekConversationHistory.length; i++) {
        if (deepseekConversationHistory[i].role === 'user') {
            var c = deepseekConversationHistory[i].content;
            title = typeof c === 'string' ? c : (c.find(function(x){return x.type==='text';}) || {}).text || '图片对话';
            break;
        }
    }
    var now = new Date();
    var timeStr = (now.getMonth()+1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    var saved = getSavedDeepSeekChats();
    saved.push({
        title: title.substring(0, 30),
        time: timeStr,
        count: deepseekConversationHistory.length,
        messages: deepseekConversationHistory.slice()
    });
    // 最多保存20条
    if (saved.length > 1000) saved = saved.slice(saved.length - 1000);
    try { localStorage.setItem('ds_saved_chats', JSON.stringify(saved)); } catch(e) {}
    window.showToast('对话已保存');
}
window.saveCurrentDeepSeekChat = saveCurrentDeepSeekChat;

function loadSavedDeepSeekChat(index) {
    var saved = getSavedDeepSeekChats();
    if (!saved[index]) return;
    deepseekConversationHistory = saved[index].messages || [];
    saveDeepSeekConversation();
    restoreDeepSeekChatHistory();
    toggleDeepSeekHistory();
    window.showToast('已加载: ' + saved[index].title);
}
window.loadSavedDeepSeekChat = loadSavedDeepSeekChat;

function deleteSavedDeepSeekChat(index) {
    var saved = getSavedDeepSeekChats();
    saved.splice(index, 1);
    try { localStorage.setItem('ds_saved_chats', JSON.stringify(saved)); } catch(e) {}
}
window.deleteSavedDeepSeekChat = deleteSavedDeepSeekChat;

function startNewDeepSeekChat() {
    window._dsSessionId = Date.now().toString(); // 新会话ID
    deepseekConversationHistory = [];
    saveDeepSeekConversation();
    var msgs = document.getElementById('deepseek-messages');
    if (msgs) msgs.innerHTML = '';
    toggleDeepSeekHistory();
    renderDeepseek(document.getElementById('fullscreen-content'));
    window.showToast('新对话已开始');
}
window.startNewDeepSeekChat = startNewDeepSeekChat;

function scrollToDeepSeekMessage(groupIndex) {
    // 关闭下拉
    var dd = document.getElementById('ds-history-dropdown');
    if (dd) dd.style.display = 'none';
    // 滚动到对应消息
    var msgs = document.getElementById('deepseek-messages');
    if (msgs) {
        var allMsgs = msgs.querySelectorAll('.chat-msg');
        var targetIndex = groupIndex * 2; // user+assistant
        if (allMsgs[targetIndex]) {
            allMsgs[targetIndex].scrollIntoView({behavior: 'smooth'});
        }
    }
}
window.scrollToDeepSeekMessage = scrollToDeepSeekMessage;

// ============================================================
// ES6 Module 导出
// ============================================================

// DeepSeek模块对象
const deepseekModule = {
    name: 'deepseek',
    icon: '🤖',
    render: typeof renderDeepseek !== 'undefined' ? renderDeepseek : null
};

// 导出主要函数

console.log('[ES6 Module] deepseek.js 模块加载完成');

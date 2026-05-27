// 版本: V359 - DeepSeek网页版风格重构 + IndexedDB存储
// AI对话模块 - DeepSeek
// 重构：界面改为DeepSeek网页版风格，历史记录改用IndexedDB存储

// ============================================================
// IndexedDB 数据库初始化
// ============================================================
const DB_NAME = 'cognitive_training_db';
const DB_VERSION = 1;
const STORE_NAME = 'deepseek_chats';
let dbInstance = null;

function initDeepSeekDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('[IndexedDB] 数据库打开失败');
            reject(request.error);
        };
        
        request.onsuccess = () => {
            dbInstance = request.result;
            console.log('[IndexedDB] 数据库连接成功');
            resolve(dbInstance);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('title', 'title', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
                console.log('[IndexedDB] 对象存储创建成功');
            }
        };
    });
}

// 保存一条聊天记录
function saveChatToDB(chat) {
    return new Promise((resolve, reject) => {
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(chat);
            
            request.onsuccess = () => {
                console.log('[IndexedDB] 保存聊天记录成功:', chat.id);
                resolve();
            };
            request.onerror = () => {
                console.error('[IndexedDB] 保存聊天记录失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 获取所有聊天列表（不含messages，只返回摘要）
function getChatsFromDB() {
    return new Promise((resolve, reject) => {
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                const chats = (request.result || []).map(chat => ({
                    id: chat.id,
                    title: chat.title,
                    time: chat.time,
                    createdAt: chat.createdAt,
                    messageCount: chat.messages ? chat.messages.length : 0
                })).sort((a, b) => b.createdAt - a.createdAt);
                resolve(chats);
            };
            request.onerror = () => {
                console.error('[IndexedDB] 获取聊天列表失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 获取完整聊天记录（含messages）
function getChatFromDB(id) {
    return new Promise((resolve, reject) => {
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                console.error('[IndexedDB] 获取聊天记录失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 删除一条记录
function deleteChatFromDB(id) {
    return new Promise((resolve, reject) => {
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                console.log('[IndexedDB] 删除聊天记录成功:', id);
                resolve();
            };
            request.onerror = () => {
                console.error('[IndexedDB] 删除聊天记录失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 清空所有记录
function clearAllChatsFromDB() {
    return new Promise((resolve, reject) => {
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            
            request.onsuccess = () => {
                console.log('[IndexedDB] 清空所有聊天记录成功');
                resolve();
            };
            request.onerror = () => {
                console.error('[IndexedDB] 清空聊天记录失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 按标题搜索
function searchChatsFromDB(keyword) {
    return new Promise((resolve, reject) => {
        if (!keyword) {
            getChatsFromDB().then(resolve).catch(reject);
            return;
        }
        initDeepSeekDB().then(db => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                const keywordLower = keyword.toLowerCase();
                const results = (request.result || [])
                    .filter(chat => (chat.title || '').toLowerCase().includes(keywordLower))
                    .map(chat => ({
                        id: chat.id,
                        title: chat.title,
                        time: chat.time,
                        createdAt: chat.createdAt,
                        messageCount: chat.messages ? chat.messages.length : 0
                    }))
                    .sort((a, b) => b.createdAt - a.createdAt);
                resolve(results);
            };
            request.onerror = () => {
                console.error('[IndexedDB] 搜索聊天记录失败');
                reject(request.error);
            };
        }).catch(reject);
    });
}

// 迁移localStorage中的数据到IndexedDB
async function migrateLocalStorageToIndexedDB() {
    try {
        const localData = localStorage.getItem('ds_saved_chats');
        if (!localData) {
            console.log('[迁移] 无需迁移，无localStorage数据');
            return;
        }
        
        const chats = JSON.parse(localData);
        if (!Array.isArray(chats) || chats.length === 0) {
            console.log('[迁移] 无需迁移，数据为空');
            return;
        }
        
        console.log('[迁移] 开始迁移', chats.length, '条记录到IndexedDB');
        
        await initDeepSeekDB();
        
        for (const chat of chats) {
            const chatData = {
                id: chat._sessionId || ('legacy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)),
                title: chat.title || '迁移的对话',
                time: chat.time || '',
                createdAt: chat.createdAt || Date.now(),
                messages: chat.messages || []
            };
            await saveChatToDB(chatData);
        }
        
        // 迁移成功后清空localStorage
        localStorage.removeItem('ds_saved_chats');
        console.log('[迁移] 迁移完成，localStorage已清空');
        window.showToast('历史记录已迁移到IndexedDB');
    } catch (e) {
        console.error('[迁移] 迁移失败:', e);
    }
}

// 初始化时检测并迁移
let migrationChecked = false;
function checkAndMigrate() {
    if (migrationChecked) return;
    migrationChecked = true;
    const localData = localStorage.getItem('ds_saved_chats');
    if (localData) {
        try {
            const chats = JSON.parse(localData);
            if (chats && chats.length > 0) {
                migrateLocalStorageToIndexedDB();
            }
        } catch (e) {}
    }
}

// ============================================================
// 核心函数
// ============================================================

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

var currentDeepSeekImage = null;

function clearDeepSeekImage() { currentDeepSeekImage = null; }
window.clearDeepSeekImage = clearDeepSeekImage;

// 增强版formatAIResponse - 代码块加复制按钮
function formatAIResponse(text) {
    if (!text) return '';
    var html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // 代码块处理（添加复制按钮）
    html = html.replace(/```(\w*)?\n?([\s\S]*?)```/g, function(match, lang, code) {
        const codeId = 'code_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        const escapedCode = code.replace(/`/g, '&#96;');
        return '<div class="code-block-wrapper"><pre class="code-block" id="' + codeId + '"><code class="code-content">' + escapedCode + '</code></pre><button class="copy-code-btn" onclick="copyCodeBlock(\'' + codeId + '\')">复制</button></div>';
    });
    
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // 粗体
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // 斜体
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // 数学公式（保持原样，不处理）
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$$$1$$</div>');
    html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$$$1$</span>');
    
    // 换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// 复制代码块函数
function copyCodeBlock(codeId) {
    const pre = document.getElementById(codeId);
    if (!pre) return;
    const code = pre.querySelector('.code-content');
    if (!code) return;
    const text = code.textContent;
    navigator.clipboard.writeText(text).then(() => {
        window.showToast('已复制到剪贴板');
    }).catch(() => {
        window.showToast('复制失败');
    });
}

window.formatAIResponse = formatAIResponse;
window.copyCodeBlock = copyCodeBlock;

// 使用统计
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

function recordDetailedUsage(inputTokens, outputTokens, questionSummary, model) {
    if (window.UsageStatsModule) {
        window.UsageStatsModule.recordUsage(inputTokens, outputTokens, questionSummary, model);
    }
    recordDeepSeekCall((inputTokens || 0) + (outputTokens || 0));
}
window.recordDetailedUsage = recordDetailedUsage;

// ============================================================
// 会话状态管理
// ============================================================
var deepseekConversationHistory = [];
var currentChatId = null;

function saveDeepSeekConversation() {
    if (!currentChatId || deepseekConversationHistory.length === 0) return;
    
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
    
    var chatData = {
        id: currentChatId,
        title: title.substring(0, 50) || '新对话',
        time: timeStr,
        createdAt: Date.now(),
        messages: deepseekConversationHistory.slice()
    };
    
    saveChatToDB(chatData).catch(e => console.error('[保存] 保存失败:', e));
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
// 视觉API调用函数（保持不变）
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
                return {success: false, type: 'balance', message: '余额不足'};
            }
            var errMsg = errorData.error ? errorData.error.message : 'API请求失败';
            return {success: false, content: '', message: errMsg};
        }
        var data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            var usage = data.usage || {};
            recordDetailedUsage(usage.prompt_tokens || 0, usage.completion_tokens || 0, '', model);
            return {success: true, content: data.choices[0].message.content || ''};
        }
        return {success: false, content: '', message: '响应格式异常'};
    } catch(e) {
        return {success: false, content: '', message: e.message};
    }
}

async function callVisionAPI(imageDataUrl, question) {
    var r1 = await callDeepSeekVisionAPI(imageDataUrl, question);
    if (r1.success) return r1;
    if (r1.unsupported) {
        var r2 = await callSiliconFlowVisionAPI(imageDataUrl, question);
        if (r2.success) return r2;
        if (r2.unsupported) return {success: false, message: '当前API均不支持图片识别'};
    }
    return r1;
}

async function ocrExtractText(imageDataUrl, progressCallback) {
    console.log('[OCR] 使用视觉API提取文字');
    try {
        var messages = [{ role: 'user', content: [
            { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } },
            { type: 'text', text: '请识别图片中的所有文字，完整输出。' }
        ]}];
        
        var result = await callVisionAPIEndpoint(messages, 0.1, 'siliconflow');
        if (result.success) {
            return result.content;
        }
        return '[图片文字识别失败]';
    } catch(e) {
        return '[图片处理异常]';
    }
}

// ============================================================
// DeepSeek API 调用
// ============================================================

async function callDeepSeekAPI(messages, temperature) {
    var apiKey = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : 
                 localStorage.getItem('deepseek_api_key') || '';
    if (!apiKey) {
        var user = window.getCurrentUserData();
        apiKey = user && user.deepseekApiKey ? user.deepseekApiKey : '';
    }
    if (!apiKey) return {success: false, message: '请先配置DeepSeek API Key'};
    
    var apiUrl = (typeof DEEPSEEK_API_URL !== 'undefined' && DEEPSEEK_API_URL) ? DEEPSEEK_API_URL : 
                 'https://api.deepseek.com/chat/completions';
    var model = (typeof DEEPSEEK_MODEL !== 'undefined' && DEEPSEEK_MODEL) ? DEEPSEEK_MODEL : 
                'deepseek-chat';
    
    var systemPrompt = '';
    if (typeof window.deepseekMode !== 'undefined') {
        systemPrompt = window.deepseekMode === 'deepthink' ? 
            '你是一个深度思考助手。请先进行详细分析推理，再给出最终答案。用&lt;think&gt;标签包裹思考过程。' : 
            '你是一个友好的AI助手，请简洁明了地回答问题。';
    }
    
    var fullMessages = [];
    if (systemPrompt) fullMessages.push({ role: 'system', content: systemPrompt });
    fullMessages = fullMessages.concat(messages);
    
    try {
        var response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: model, messages: fullMessages, temperature: temperature || 0.7, max_tokens: 4096 })
        });
        
        if (!response.ok) {
            if (response.status === 402) {
                return {success: false, type: 'balance', message: '余额不足，请前往充值'};
            }
            var errorData = await response.json().catch(function() { return {}; });
            var errMsg = errorData.error ? errorData.error.message : '请求失败(' + response.status + ')';
            return {success: false, message: errMsg};
        }
        
        var data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            var usage = data.usage || {};
            recordDetailedUsage(usage.prompt_tokens || 0, usage.completion_tokens || 0, messages[messages.length-1]?.content?.substring(0,50) || '', model);
            return {success: true, content: data.choices[0].message.content || ''};
        }
        return {success: false, message: '响应格式异常'};
    } catch(e) {
        return {success: false, message: e.message};
    }
}

async function callVisionDeepSeekAPI(messages, temperature) {
    return callDeepSeekAPI(messages, temperature);
}

async function callSiliconFlowAPI(messages, temperature) {
    var apiKey = (typeof SILICONFLOW_API_KEY !== 'undefined' && SILICONFLOW_API_KEY) ? SILICONFLOW_API_KEY :
                 localStorage.getItem('siliconflow_api_key') || '';
    if (!apiKey) return {success: false, message: '请先配置SiliconFlow API Key'};
    
    var apiUrl = (typeof SILICONFLOW_API_URL !== 'undefined' && SILICONFLOW_API_URL) ? SILICONFLOW_API_URL :
                 'https://api.siliconflow.cn/v1/chat/completions';
    var model = (typeof SILICONFLOW_MODEL !== 'undefined' && SILICONFLOW_MODEL) ? SILICONFLOW_MODEL :
                 'deepseek-ai/DeepSeek-V3';
    
    try {
        var response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: model, messages: messages, temperature: temperature || 0.7 })
        });
        
        if (!response.ok) {
            if (response.status === 402) {
                return {success: false, type: 'balance', message: '余额不足'};
            }
            var errorData = await response.json().catch(function() { return {}; });
            return {success: false, message: errorData.error?.message || '请求失败'};
        }
        
        var data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return {success: true, content: data.choices[0].message.content || ''};
        }
        return {success: false, message: '响应格式异常'};
    } catch(e) {
        return {success: false, message: e.message};
    }
}

async function callDeepSeekVisionEndpoint(messages, temperature) {
    return callDeepSeekAPI(messages, temperature);
}

// 语音输入提示
function tipKeyboardVoice() {
    if (isWeChatBrowser()) {
        window.showToast('请使用键盘输入');
        return;
    }
    if (!supportsSpeechRecognition()) {
        window.showToast('当前浏览器不支持语音输入');
        return;
    }
    startDeepSeekVoice();
}

// 触发图片上传
function triggerDeepSeekImage() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = async function(evt) {
            var base64 = evt.target.result;
            var ocrText = await ocrExtractText(base64);
            var inputEl = document.getElementById('ds-input');
            if (inputEl && ocrText && ocrText.length > 10 && ocrText.length < 5000) {
                inputEl.value = ocrText;
                inputEl.focus();
            } else {
                window.showToast('已选择图片，可输入问题后发送');
            }
            currentDeepSeekImage = base64;
            showImagePreview(base64);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function showImagePreview(base64) {
    var preview = document.getElementById('ds-image-preview');
    if (preview) {
        preview.innerHTML = '<img src="' + base64 + '" style="max-width:80px;max-height:80px;border-radius:8px;">';
    }
}

// 图片识别发送
async function ocrImageAndSend(base64) {
    window.showToast('正在识别图片...');
    var question = document.getElementById('ds-input')?.value || '请分析这张图片';
    var result = await callVisionAPI(base64, question);
    if (result.success) {
        deepseekConversationHistory.push({ role: 'user', content: [
            { type: 'image_url', image_url: { url: base64 } },
            { type: 'text', text: question }
        ]});
        deepseekConversationHistory.push({ role: 'assistant', content: result.content });
        renderMessages();
        saveDeepSeekConversation();
    } else {
        window.showToast(result.message || '图片识别失败');
    }
    clearDeepSeekImage();
    document.getElementById('ds-image-preview').innerHTML = '';
}

// 模式选择
function getContextForMode() {
    return '';
}

// ============================================================
// 核心：发送消息到DeepSeek
// ============================================================

async function sendToDeepSeek() {
    var inputEl = document.getElementById('ds-input');
    if (!inputEl) return;
    
    var userMessage = inputEl.value.trim();
    var hasImage = currentDeepSeekImage !== null;
    
    if (!userMessage && !hasImage) {
        window.showToast('请输入内容');
        return;
    }
    
    // 首次对话创建新会话
    if (!currentChatId) {
        currentChatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // 保存图片引用（清空前）
    var savedImage = currentDeepSeekImage;
    
    // 构建用户消息
    var userContent;
    if (hasImage && savedImage) {
        userContent = [
            { type: 'image_url', image_url: { url: savedImage } },
            { type: 'text', text: userMessage || '请分析这张图片' }
        ];
    } else {
        userContent = userMessage;
    }
    
    // 添加用户消息
    deepseekConversationHistory.push({ role: 'user', content: userContent });
    
    // 清空输入
    inputEl.value = '';
    inputEl.style.height = 'auto';
    clearDeepSeekImage();
    var previewEl = document.getElementById('ds-image-preview');
    if (previewEl) previewEl.innerHTML = '';
    
    // 渲染用户消息
    renderMessages();
    
    // 显示AI思考状态
    showThinkingIndicator();
    
    // 构建API消息
    var apiMessages = deepseekConversationHistory.map(function(m) {
        return { role: m.role, content: m.content };
    });
    
    try {
        var result;
        if (hasImage && savedImage) {
            result = await callVisionAPI(savedImage, userMessage || '请分析这张图片');
        } else {
            result = await callDeepSeekAPI(apiMessages, 0.7);
        }
        
        hideThinkingIndicator();
        
        if (result.success) {
            // 处理思考标签
            var content = result.content;
            var thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
            var thinking = thinkMatch ? thinkMatch[1].trim() : '';
            var finalContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            
            // 添加AI响应
            deepseekConversationHistory.push({ role: 'assistant', content: finalContent });
            
            // 渲染消息
            renderMessages();
            
            // 语音播报
            if (window.speechSynthesis && finalContent) {
                window.speechSynthesis.cancel();
                var utter = new SpeechSynthesisUtterance(finalContent.substring(0, 500));
                utter.lang = 'zh-CN';
                utter.rate = 1.1;
                utter.pitch = 1.0;
                window.speechSynthesis.speak(utter);
            }
            
            // 显示思考过程
            if (thinking && window.deepseekMode === 'deepthink') {
                showThinkingContent(thinking);
            }
        } else {
            if (result.type === 'balance') {
                deepseekConversationHistory.push({ role: 'assistant', content: '⚠️ ' + result.message });
                renderMessages();
                setTimeout(function() { showAPIRechargeModal(); }, 1000);
            } else {
                deepseekConversationHistory.push({ role: 'assistant', content: '❌ ' + (result.message || '请求失败') });
                renderMessages();
            }
        }
    } catch(e) {
        hideThinkingIndicator();
        deepseekConversationHistory.push({ role: 'assistant', content: '❌ 发生错误: ' + e.message });
        renderMessages();
    }
    
    // 保存会话
    saveDeepSeekConversation();
    
    // 滚动到底部
    scrollToBottom();
}
window.sendToDeepSeek = sendToDeepSeek;

// 渲染所有消息
function renderMessages() {
    var container = document.getElementById('ds-messages');
    if (!container) return;
    
    var html = '';
    for (var i = 0; i < deepseekConversationHistory.length; i++) {
        var msg = deepseekConversationHistory[i];
        if (msg.role === 'user') {
            html += renderUserMessage(msg.content);
        } else {
            html += renderAssistantMessage(msg.content);
        }
    }
    container.innerHTML = html;
}

function renderUserMessage(content) {
    var text = typeof content === 'string' ? content : '';
    var imageUrl = '';
    if (Array.isArray(content)) {
        for (var i = 0; i < content.length; i++) {
            if (content[i].type === 'text') text = content[i].text;
            if (content[i].type === 'image_url') imageUrl = content[i].image_url?.url || '';
        }
    }
    
    var html = '<div class="ds-msg ds-msg-user">' +
        '<div class="ds-msg-content">' +
        (imageUrl ? '<img src="' + imageUrl + '" class="ds-msg-image">' : '') +
        '<div class="ds-bubble ds-bubble-user">' + escapeHtml(text) + '</div>' +
        '</div>' +
        '<div class="ds-avatar ds-avatar-user">我</div>' +
        '</div>';
    return html;
}

function renderAssistantMessage(content) {
    var formatted = formatAIResponse(content);
    var html = '<div class="ds-msg ds-msg-assistant">' +
        '<div class="ds-avatar ds-avatar-assistant">' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><rect width="24" height="24" rx="6" fill="#4d6bfe"/><text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="bold">D</text></svg>' +
        '</div>' +
        '<div class="ds-msg-content">' +
        '<div class="ds-bubble ds-bubble-assistant">' + formatted + '</div>' +
        '<div class="ds-msg-actions">' +
        '<button class="ds-action-btn" onclick="copyMessage(this)" title="复制">复制</button>' +
        '<button class="ds-action-btn" onclick="speakMessage(this)" title="朗读">朗读</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    return html;
}

// 复制消息内容
function copyMessage(btn) {
    var bubble = btn.closest('.ds-msg-content').querySelector('.ds-bubble');
    if (!bubble) return;
    var text = bubble.textContent;
    navigator.clipboard.writeText(text).then(() => {
        window.showToast('已复制');
    }).catch(() => {
        window.showToast('复制失败');
    });
}

// 朗读消息
function speakMessage(btn) {
    var bubble = btn.closest('.ds-msg-content').querySelector('.ds-bubble');
    if (!bubble) return;
    var text = bubble.textContent;
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'zh-CN';
        utter.rate = 1.1;
        window.speechSynthesis.speak(utter);
        window.showToast('正在朗读...');
    } else {
        window.showToast('浏览器不支持朗读');
    }
}

// 显示思考内容
function showThinkingContent(thinking) {
    var container = document.getElementById('ds-messages');
    if (!container) return;
    var html = '<div class="ds-thinking-block">' +
        '<div class="ds-thinking-header">DeepSeek 正在思考...</div>' +
        '<div class="ds-thinking-content">' + escapeHtml(thinking) + '</div>' +
        '</div>';
    container.insertAdjacentHTML('beforeend', html);
}

// 显示思考指示器
function showThinkingIndicator() {
    var indicator = document.getElementById('ds-thinking-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

function hideThinkingIndicator() {
    var indicator = document.getElementById('ds-thinking-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// 滚动到底部
function scrollToBottom() {
    var container = document.getElementById('ds-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// ============================================================
// 语音输入
// ============================================================

function startDeepSeekVoice() {
    if (!supportsSpeechRecognition()) {
        window.showToast('浏览器不支持语音输入');
        return;
    }
    
    var recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onresult = function(event) {
        var result = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
            result += event.results[i][0].transcript;
        }
        var inputEl = document.getElementById('ds-input');
        if (inputEl) inputEl.value = result;
    };
    
    recognition.onerror = function(event) {
        if (event.error !== 'no-speech') {
            window.showToast('语音识别出错');
        }
    };
    
    recognition.onend = function() {
        var inputEl = document.getElementById('ds-input');
        if (inputEl && inputEl.value.trim()) {
            sendToDeepSeek();
        }
    };
    
    recognition.start();
    window.showToast('请说话...');
}

// ============================================================
// 主题分析
// ============================================================

async function analyzeTopicWithAI(topicId) {
    if (typeof TopicData !== 'undefined' && TopicData.getTopic) {
        var topic = TopicData.getTopic(topicId);
        if (topic) {
            deepseekConversationHistory = [];
            currentChatId = 'topic_' + topicId + '_' + Date.now();
            deepseekConversationHistory.push({
                role: 'assistant',
                content: '正在分析题目，请稍候...'
            });
            renderMessages();
            
            var prompt = '请分析这道题目并给出解题思路：\n题目：' + (topic.question || topic.title || '') + 
                        '\n选项：' + (topic.options ? topic.options.join('、') : '') +
                        '\n答案：' + (topic.answer || '未知');
            
            var result = await callDeepSeekAPI([{ role: 'user', content: prompt }], 0.5);
            if (result.success) {
                deepseekConversationHistory.push({ role: 'assistant', content: result.content });
            } else {
                deepseekConversationHistory.push({ role: 'assistant', content: '分析失败：' + result.message });
            }
            renderMessages();
            saveDeepSeekConversation();
        }
    }
}
window.analyzeTopicWithAI = analyzeTopicWithAI;

// ============================================================
// 充值相关
// ============================================================

function openDeepSeekRecharge() {
    window.open('https://platform.deepseek.com/top-up', '_blank');
}

function openSiliconFlowRecharge() {
    window.open('https://cloud.siliconflow.cn/', '_blank');
}

function showAPIRechargeModal() {
    var modal = document.createElement('div');
    modal.className = 'ds-modal-overlay';
    modal.innerHTML = '<div class="ds-modal">' +
        '<div class="ds-modal-header">API余额不足</div>' +
        '<div class="ds-modal-body">' +
        '<p>您的DeepSeek API余额已用完，请及时充值。</p>' +
        '<div class="ds-modal-btns">' +
        '<button onclick="openDeepSeekRecharge();closeDSModal();">前往DeepSeek充值</button>' +
        '<button onclick="openSiliconFlowRecharge();closeDSModal();">使用SiliconFlow</button>' +
        '<button onclick="closeDSModal()">关闭</button>' +
        '</div></div></div>';
    document.body.appendChild(modal);
}
window.showAPIRechargeModal = showAPIRechargeModal;

function closeDSModal() {
    var modal = document.querySelector('.ds-modal-overlay');
    if (modal) modal.remove();
}

// ============================================================
// 历史记录管理（使用IndexedDB）
// ============================================================

function restoreDeepSeekChatHistory() {
    // 空实现，由renderDeepseek中加载
}

// 获取历史列表
async function getSavedDeepSeekChats() {
    return await getChatsFromDB();
}

// 保存当前对话
async function saveCurrentDeepSeekChat() {
    if (!currentChatId || deepseekConversationHistory.length === 0) {
        window.showToast('当前没有对话可保存');
        return;
    }
    saveDeepSeekConversation();
    window.showToast('对话已保存');
}
window.saveCurrentDeepSeekChat = saveCurrentDeepSeekChat;

// 加载历史对话
async function loadSavedDeepSeekChat(chatId) {
    try {
        var chat = await getChatFromDB(chatId);
        if (chat) {
            currentChatId = chat.id;
            deepseekConversationHistory = chat.messages || [];
            renderMessages();
            scrollToBottom();
            // 自动关闭侧边栏
            var sidebar = document.getElementById('ds-sidebar');
            var mask = document.getElementById('ds-sidebar-mask');
            if (sidebar && window.innerWidth < 768) {
                sidebar.classList.add('hidden');
                if (mask) mask.classList.remove('active');
            }
            window.showToast('已加载: ' + chat.title);
        }
    } catch(e) {
        console.error('加载对话失败:', e);
    }
}
window.loadSavedDeepSeekChat = loadSavedDeepSeekChat;

// 删除历史对话
async function deleteSavedDeepSeekChat(chatId) {
    try {
        await deleteChatFromDB(chatId);
        window.showToast('已删除');
    } catch(e) {
        console.error('删除失败:', e);
    }
}
window.deleteSavedDeepSeekChat = deleteSavedDeepSeekChat;

// 开始新对话
function startNewDeepSeekChat() {
    // 保存当前对话
    if (currentChatId && deepseekConversationHistory.length > 0) {
        saveDeepSeekConversation();
    }
    
    currentChatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    deepseekConversationHistory = [];
    localStorage.removeItem('cognitive_training_ds_conversation');
    
    var msgs = document.getElementById('ds-messages');
    if (msgs) msgs.innerHTML = '';
    
    window.showToast('新对话已开始');
}
window.startNewDeepSeekChat = startNewDeepSeekChat;

// 切换模式
function switchDeepSeekMode(mode) {
    window.deepseekMode = mode;
    localStorage.setItem('deepseek_mode', mode);
    
    document.querySelectorAll('.ds-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    window.showToast(mode === 'deepthink' ? '已切换到深度思考模式' : '已切换到快速回答模式');
}
window.switchDeepSeekMode = switchDeepSeekMode;

// ============================================================
// DeepSeek主界面渲染
// ============================================================

function renderDeepseek(contentEl) {
    if (!contentEl) contentEl = document.getElementById('fullscreen-content') || document.body;
    
    // 设置容器动态高度（修复移动端100vh问题）
    contentEl.style.padding = '0';
    contentEl.style.overflow = 'hidden';
    
    // 初始化IndexedDB和迁移
    checkAndMigrate();
    
    // 加载保存的模式
    var savedMode = localStorage.getItem('deepseek_mode');
    if (savedMode) window.deepseekMode = savedMode;
    else window.deepseekMode = 'fast';
    
    var currentMode = window.deepseekMode || 'fast';
    
    var html = '<div class="ds-container">' +
        // 左侧边栏
        '<div class="ds-sidebar" id="ds-sidebar">' +
        '<div class="ds-sidebar-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid #2d2d30">' +
        '<button class="ds-new-chat-btn" onclick="startNewDeepSeekChat();renderDeepseek(document.getElementById(\'fullscreen-content\'));">' +
        '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 4v16m8-8H4"/></svg>' +
        '新对话</button>' +
        '<button onclick="toggleSidebar()" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:4px 8px">✕</button>' +
        '</div>' +
        '<div class="ds-sidebar-search">' +
        '<input type="text" id="ds-sidebar-search-input" placeholder="搜索历史..." oninput="searchHistory(this.value)">' +
        '</div>' +
        '<div class="ds-chat-list" id="ds-chat-list">' +
        // 历史列表将通过JS加载
        '</div>' +
        '<div class="ds-sidebar-footer">' +
        '<div class="ds-footer-row">' +
        '<div class="ds-balance-info" onclick="openApiConfigModalBridge()">' +
        '<span style="font-size:11px;color:#999;">💰 余额</span> <span id="ds-balance" style="color:#43a047;font-weight:600;">加载中...</span>' +
        '</div>' +
        '<div class="ds-footer-btns">' +
        '<button class="ds-footer-btn" onclick="openApiConfigModalBridge()" style="background:rgba(255,255,255,0.08);color:#aaa;">⚙️ 配置</button>' +
        '<button class="ds-footer-btn" onclick="showAPIRechargeModal()" style="background:linear-gradient(135deg,#4d6bfe,#764ba2);color:white;">💳 充值</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        
        // 移动端侧边栏遮罩
        '<div class="ds-sidebar-mask" id="ds-sidebar-mask" onclick="toggleSidebar()"></div>' +
        
        // 主聊天区
        '<div class="ds-main">' +
        // 顶部栏
        '<div class="ds-header">' +
        '<button class="ds-menu-btn" onclick="toggleSidebar()">☰</button>' +
        '<div class="ds-title">DeepSeek AI</div>' +
        '<div class="ds-mode-switch">' +
        '<button class="ds-mode-btn ' + (currentMode === 'fast' ? 'active' : '') + '" data-mode="fast" onclick="switchDeepSeekMode(\'fast\')">快速</button>' +
        '<button class="ds-mode-btn ' + (currentMode === 'deepthink' ? 'active' : '') + '" data-mode="deepthink" onclick="switchDeepSeekMode(\'deepthink\')">深度思考</button>' +
        '</div>' +
        '</div>' +
        
        // 消息区域
        '<div class="ds-messages" id="ds-messages">' +
        '</div>' +
        
        // 思考指示器
        '<div class="ds-thinking-indicator" id="ds-thinking-indicator" style="display:none;">' +
        '<div class="ds-spinner"></div>' +
        '<span>DeepSeek正在思考...</span>' +
        '</div>' +
        
        // 输入区域
        '<div class="ds-input-area">' +
        '<div class="ds-image-preview" id="ds-image-preview"></div>' +
        '<div class="ds-input-box">' +
        '<button class="ds-tool-btn" onclick="triggerDeepSeekImage()" title="上传图片">📷</button>' +
        '<button class="ds-tool-btn" onclick="startDeepSeekVoice()" title="语音输入">🎤</button>' +
        '<textarea id="ds-input" placeholder="给 DeepSeek 发送消息..." rows="1" onkeydown="handleInputKeydown(event)"></textarea>' +
        '<button class="ds-send-btn" id="ds-send-btn" onclick="sendToDeepSeek()">➤</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    contentEl.innerHTML = html;
    
    // 自动调整textarea高度
    var inputEl = document.getElementById('ds-input');
    if (inputEl) {
        inputEl.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
    
    // 加载历史列表
    loadChatList();
    
    // 更新余额
    updateDeepSeekBalance();
    
    // 如果没有历史，显示欢迎消息
    if (deepseekConversationHistory.length === 0) {
        var msgsEl = document.getElementById('ds-messages');
        if (msgsEl) {
            msgsEl.innerHTML = '<div class="ds-welcome">' +
                '<div class="ds-welcome-icon">' +
                '<svg viewBox="0 0 24 24" width="48" height="48"><rect width="24" height="24" rx="6" fill="#4d6bfe"/><text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-weight="bold">D</text></svg>' +
                '</div>' +
                '<div class="ds-welcome-title">我是DeepSeek AI助手</div>' +
                '<div class="ds-welcome-desc">有什么可以帮你的吗？支持文字、语音和图片提问</div>' +
                '</div>';
        }
    } else {
        renderMessages();
    }
    
    // 手机端默认隐藏侧边栏
    var dsSidebar = document.getElementById('ds-sidebar');
    if (dsSidebar && window.innerWidth < 768) {
        dsSidebar.classList.add('hidden');
    }
}
window.renderDeepseek = renderDeepseek;

// 切换侧边栏
function toggleSidebar() {
    var sidebar = document.getElementById('ds-sidebar');
    var mask = document.getElementById('ds-sidebar-mask');
    if (!sidebar) return;
    if (window.innerWidth < 768) {
        // 手机端：用open/close切换
        var isOpen = sidebar.classList.contains('open');
        if (isOpen) {
            sidebar.classList.remove('open');
            sidebar.classList.add('hidden');
            if (mask) { mask.classList.remove('active'); mask.style.display = 'none'; }
        } else {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('open');
            if (mask) { mask.classList.add('active'); mask.style.display = 'block'; }
        }
    } else {
        sidebar.classList.toggle('hidden');
        if (mask) mask.classList.toggle('active');
    }
}
window.toggleSidebar = toggleSidebar;

// 加载历史列表
async function loadChatList() {
    try {
        var chats = await getChatsFromDB();
        var listEl = document.getElementById('ds-chat-list');
        if (!listEl) return;
        
        if (chats.length === 0) {
            listEl.innerHTML = '<div class="ds-empty-list">暂无历史记录</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < chats.length; i++) {
            var chat = chats[i];
            var isActive = chat.id === currentChatId ? 'active' : '';
            html += '<div class="ds-chat-item ' + isActive + '" onclick="loadSavedDeepSeekChat(\'' + chat.id + '\')">' +
                '<div class="ds-chat-item-title">' + escapeHtml(chat.title || '新对话') + '</div>' +
                '<div class="ds-chat-item-time">' + (chat.time || '') + '</div>' +
                '<button class="ds-chat-item-delete" onclick="event.stopPropagation();deleteSavedDeepSeekChat(\'' + chat.id + '\');loadChatList();">✕</button>' +
                '</div>';
        }
        listEl.innerHTML = html;
    } catch(e) {
        console.error('加载历史列表失败:', e);
    }
}
window.loadChatList = loadChatList;

// 搜索历史
async function searchHistory(keyword) {
    try {
        var chats = await searchChatsFromDB(keyword);
        var listEl = document.getElementById('ds-chat-list');
        if (!listEl) return;
        
        if (chats.length === 0) {
            listEl.innerHTML = '<div class="ds-empty-list">' + (keyword ? '没有找到匹配的历史' : '暂无历史记录') + '</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < chats.length; i++) {
            var chat = chats[i];
            var isActive = chat.id === currentChatId ? 'active' : '';
            html += '<div class="ds-chat-item ' + isActive + '" onclick="loadSavedDeepSeekChat(\'' + chat.id + '\')">' +
                '<div class="ds-chat-item-title">' + escapeHtml(chat.title || '新对话') + '</div>' +
                '<div class="ds-chat-item-time">' + (chat.time || '') + '</div>' +
                '<button class="ds-chat-item-delete" onclick="event.stopPropagation();deleteSavedDeepSeekChat(\'' + chat.id + '\');searchHistory(\'' + keyword + '\');">✕</button>' +
                '</div>';
        }
        listEl.innerHTML = html;
    } catch(e) {
        console.error('搜索历史失败:', e);
    }
}
window.searchHistory = searchHistory;

// 处理输入框回车
function handleInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendToDeepSeek();
    }
}

// 更新余额显示
function updateDeepSeekBalance() {
    var apiKey = '';
    // Try multiple sources for API key
    try { var cfg = JSON.parse(localStorage.getItem('api_config') || '{}'); if (cfg.deepseek) apiKey = cfg.deepseek; } catch(e) {}
    if (!apiKey) apiKey = localStorage.getItem('deepseek_api_key') || '';
    if (!apiKey && typeof DEEPSEEK_API_KEY !== 'undefined') apiKey = DEEPSEEK_API_KEY;
    if (!apiKey) { try { var user = window.getCurrentUserData(); if (user && user.deepseekApiKey) apiKey = user.deepseekApiKey; } catch(e) {} }
    if (!apiKey) {
        var el = document.getElementById('ds-balance');
        if (el) el.textContent = '未配置Key';
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

// API配置
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

// 清空所有历史
async function clearAllDeepSeekHistory() {
    try {
        await clearAllChatsFromDB();
        deepseekConversationHistory = [];
        localStorage.removeItem('cognitive_training_ds_conversation');
        currentChatId = null;
        window.showToast('历史已清空');
        loadChatList();
    } catch(e) {
        console.error('清空历史失败:', e);
    }
}
window.clearAllDeepSeekHistory = clearAllDeepSeekHistory;

// 滚动到消息
function scrollToDeepSeekMessage(groupIndex) {
    var msgs = document.getElementById('ds-messages');
    if (msgs) {
        var allMsgs = msgs.querySelectorAll('.ds-msg');
        var targetIndex = groupIndex * 2;
        if (allMsgs[targetIndex]) {
            allMsgs[targetIndex].scrollIntoView({behavior: 'smooth'});
        }
    }
}
window.scrollToDeepSeekMessage = scrollToDeepSeekMessage;

// ============================================================
// 模块导出
// ============================================================

const deepseekModule = {
    name: 'deepseek',
    icon: '🤖',
    render: typeof renderDeepseek !== 'undefined' ? renderDeepseek : null
};

console.log('[Module] deepseek.js V359 加载完成 - DeepSeek网页版风格 + IndexedDB');

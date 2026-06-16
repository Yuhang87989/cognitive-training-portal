// AI对话模块 - 完整版（带历史记忆功能）

// 常量定义
var DEEPSEEK_HISTORY_KEY = 'cognitive_training_deepseek_history';
var AVATAR_HISTORY_KEY = 'cognitive_training_avatar_history';
var MAX_HISTORY_COUNT = 20;
var SYSTEM_PROMPT = '你是专业的学习助手，擅长解答数学、语文、英语、物理、化学等学科问题。回答要清晰、有条理。';

// 获取历史消息
function getChatHistory(key) {
    try {
        var data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch(e) {
        return [];
    }
}

// 保存历史消息
function saveChatHistory(key, history) {
    try {
        // 限制历史消息数量
        while (history.length > MAX_HISTORY_COUNT) {
            history.shift();
        }
        localStorage.setItem(key, JSON.stringify(history));
    } catch(e) {
        console.error('Save history error:', e);
    }
}

// 添加消息到历史
function addToHistory(key, role, content) {
    var history = getChatHistory(key);
    history.push({
        role: role,
        content: content,
        timestamp: Date.now()
    });
    saveChatHistory(key, history);
}

// 清除历史记录
function clearDeepSeekChatHistory() {
    localStorage.removeItem(DEEPSEEK_HISTORY_KEY);
}

// 清除Avatar历史记录
function clearAvatarChatHistory() {
    localStorage.removeItem(AVATAR_HISTORY_KEY);
}

// 导出清除函数
window.clearDeepSeekChatHistory = clearDeepSeekChatHistory;
window.clearAvatarChatHistory = clearAvatarChatHistory;

// 基础API调用（带历史上下文）
async function callDeepSeek(question) {
    const apiKey = localStorage.getItem('deepseek_api_key') || (typeof DEEPSEEK_API_KEY !== 'undefined' ? DEEPSEEK_API_KEY : '');
    
    // 构建消息列表：system + 历史消息 + 当前消息
    var messages = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];
    
    // 添加历史消息
    var history = getChatHistory(DEEPSEEK_HISTORY_KEY);
    for (var i = 0; i < history.length; i++) {
        messages.push({
            role: history[i].role,
            content: history[i].content
        });
    }
    
    // 添加当前消息
    messages.push({ role: 'user', content: question });
    
    try {
        const response = await fetch('https://deepseek-proxy.392430818.workers.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization由Worker处理，前端不传Key
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash',
                messages: messages
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            return 'API错误: ' + data.error.message;
        }
        
        return data.choices[0].message.content;
    } catch(e) {
        console.error('DeepSeek API error:', e);
        return 'AI服务暂时不可用，请检查网络连接';
    }
}

// 多模态API调用（支持图片）
async function callDeepSeekVision(text, imageBase64) {
    const apiKey = localStorage.getItem('deepseek_api_key') || (typeof DEEPSEEK_API_KEY !== 'undefined' ? DEEPSEEK_API_KEY : '');
    
    const messages = [
        { role: 'system', content: '你是专业的学习助手，擅长解答各学科问题，也能分析图片中的题目。' }
    ];
    
    if (imageBase64) {
        messages.push({
            role: 'user',
            content: [
                { type: 'text', text: text || '请分析这张图片' },
                { type: 'image_url', image_url: { url: imageBase64 } }
            ]
        });
    } else {
        messages.push({ role: 'user', content: text });
    }
    
    try {
        const response = await fetch('https://deepseek-proxy.392430818.workers.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization由Worker处理，前端不传Key
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash',
                messages: messages
            })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '无法获取回复';
    } catch(e) {
        return '服务暂时不可用';
    }
}

// 恢复DeepSeek聊天记录到界面
function restoreDeepSeekChatUI() {
    var messagesDiv = document.getElementById('deepseek-chat-messages');
    if (!messagesDiv) return;
    
    var history = getChatHistory(DEEPSEEK_HISTORY_KEY);
    messagesDiv.innerHTML = '';
    
    for (var i = 0; i < history.length; i++) {
        if (history[i].role === 'user') {
            messagesDiv.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + escapeHtml(history[i].content) + '</div></div>';
        } else {
            messagesDiv.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">' + escapeHtml(history[i].content) + '</div></div>';
        }
    }
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 恢复Avatar聊天记录到界面
function restoreAvatarChatUI() {
    var messagesDiv = document.getElementById('avatar-chat-messages');
    if (!messagesDiv) return;
    
    var history = getChatHistory(AVATAR_HISTORY_KEY);
    messagesDiv.innerHTML = '';
    
    for (var i = 0; i < history.length; i++) {
        if (history[i].role === 'user') {
            messagesDiv.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + escapeHtml(history[i].content) + '</div></div>';
        } else {
            messagesDiv.innerHTML += '<div class="chat-msg"><div class="chat-bubble">' + escapeHtml(history[i].content) + '</div></div>';
        }
    }
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// HTML转义函数
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 发送DeepSeek消息
async function sendDeepSeekChat() {
    const input = document.getElementById('deepseek-chat-input');
    const text = input ? input.value.trim() : '';
    
    if (!text) return;
    
    const messages = document.getElementById('deepseek-chat-messages');
    if (!messages) return;
    
    // 显示用户消息
    messages.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + escapeHtml(text) + '</div></div>';
    input.value = '';
    
    // 调用API
    const response = await callDeepSeek(text);
    
    // 显示回复
    messages.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">' + escapeHtml(response) + '</div></div>';
    messages.scrollTop = messages.scrollHeight;
    
    // 保存到历史记录
    addToHistory(DEEPSEEK_HISTORY_KEY, 'user', text);
    addToHistory(DEEPSEEK_HISTORY_KEY, 'assistant', response);
}

// AI分身聊天
async function sendAvatarChat() {
    const input = document.getElementById('avatar-chat-input');
    const text = input ? input.value.trim() : '';
    
    if (!text) return;
    
    const messages = document.getElementById('avatar-chat-messages');
    if (!messages) return;
    
    messages.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + escapeHtml(text) + '</div></div>';
    input.value = '';
    
    const response = await callDeepSeek(text);
    
    messages.innerHTML += '<div class="chat-msg"><div class="chat-bubble">' + escapeHtml(response) + '</div></div>';
    messages.scrollTop = messages.scrollHeight;
    
    // 保存到Avatar历史记录
    addToHistory(AVATAR_HISTORY_KEY, 'user', text);
    addToHistory(AVATAR_HISTORY_KEY, 'assistant', response);
}

// 导出恢复函数供外部调用
window.restoreDeepSeekChatUI = restoreDeepSeekChatUI;
window.restoreAvatarChatUI = restoreAvatarChatUI;

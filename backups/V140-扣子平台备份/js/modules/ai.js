// AI对话模块 - 完整版

// 基础API调用
async function callDeepSeek(question) {
    const apiKey = localStorage.getItem('deepseek_api_key') || 'sk-8413f72a3f084fb08c84389555a76d37';
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是专业的学习助手，擅长解答数学、语文、英语、物理、化学等学科问题。回答要清晰、有条理。' },
                    { role: 'user', content: question }
                ]
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
    const apiKey = localStorage.getItem('deepseek_api_key') || 'sk-8413f72a3f084fb08c84389555a76d37';
    
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
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages
            })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '无法获取回复';
    } catch(e) {
        return '服务暂时不可用';
    }
}

// 发送消息
async function sendDeepSeekChat() {
    const input = document.getElementById('deepseek-chat-input');
    const text = input ? input.value.trim() : '';
    
    if (!text) return;
    
    const messages = document.getElementById('deepseek-chat-messages');
    if (!messages) return;
    
    // 显示用户消息
    messages.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + text + '</div></div>';
    input.value = '';
    
    // 调用API
    const response = await callDeepSeek(text);
    
    // 显示回复
    messages.innerHTML += '<div class="chat-msg"><div class="chat-avatar">🤖</div><div class="chat-bubble">' + response + '</div></div>';
    messages.scrollTop = messages.scrollHeight;
}

// AI分身聊天
async function sendAvatarChat() {
    const input = document.getElementById('avatar-chat-input');
    const text = input ? input.value.trim() : '';
    
    if (!text) return;
    
    const messages = document.getElementById('avatar-chat-messages');
    if (!messages) return;
    
    messages.innerHTML += '<div class="chat-msg user"><div class="chat-bubble">' + text + '</div></div>';
    input.value = '';
    
    const response = await callDeepSeek(text);
    
    messages.innerHTML += '<div class="chat-msg"><div class="chat-bubble">' + response + '</div></div>';
    messages.scrollTop = messages.scrollHeight;
}

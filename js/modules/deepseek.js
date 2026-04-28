// ====== deepseek模块 ======
// 版本: V140

CTM.registerModule('deepseek', {
    name: 'deepseek',
    icon: '🎯',
    render: renderDeepseek
});

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

window.renderDeepseek = renderDeepseek;
window.callDeepSeekAPI = callDeepSeekAPI;

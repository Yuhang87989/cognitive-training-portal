// 版本: V140

const games = [
    {id:'schulte',icon:'👁',name:'舒尔特方格',desc:'注意力训练',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    {id:'visual',icon:'🔍',name:'视觉搜索',desc:'观察力训练',gradient:'linear-gradient(135deg,#f093fb,#f5576c)'},
    {id:'digit',icon:'🔢',name:'数字记忆',desc:'记忆力训练',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},
    {id:'pattern',icon:'🎨',name:'图案匹配',desc:'思维训练',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)'},
    {id:'tap',icon:'⚡',name:'快速点击',desc:'反应速度',gradient:'linear-gradient(135deg,#f6d365,#fda085)'},
    {id:'color',icon:'🌈',name:'色彩识别',desc:'辨色能力',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)'},
    {id:'diff',icon:'🔎',name:'找不同',desc:'细节观察',gradient:'linear-gradient(135deg,#fa709a,#fee140)'},
    {id:'reason',icon:'🧩',name:'逻辑推理',desc:'思维能力',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    {id:'text',icon:'📝',name:'文字记忆',desc:'记忆训练',gradient:'linear-gradient(135deg,#e0c3fc,#8ec5fc)'},
    {id:'shape',icon:'🔷',name:'图形推理',desc:'逻辑训练',gradient:'linear-gradient(135deg,#ffecd2,#fcb69f)'},
    {id:'math',icon:'🔢',name:'数学速算',desc:'计算训练',gradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)'},
    {id:'space',icon:'🎲',name:'空间旋转',desc:'空间想象',gradient:'linear-gradient(135deg,#d299c2,#fef9d7)'},
    {id:'audio',icon:'🎧',name:'听音辨位',desc:'听觉训练',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)'},
    {id:'word',icon:'💬',name:'词汇联想',desc:'语言训练',gradient:'linear-gradient(135deg,#fddb92,#d1fdff)'},
    {id:'classify',icon:'📂',name:'分类归纳',desc:'思维训练',gradient:'linear-gradient(135deg,#c1dfc4,#deecfd)'},
    {id:'attention',icon:'🎯',name:'注意力追踪',desc:'专注训练',gradient:'linear-gradient(135deg,#ff9a9e,#fecfef)'},
    {id:'palace',icon:'🏛️',name:'记忆宫殿',desc:'空间记忆法',gradient:'linear-gradient(135deg,#6a3093,#a044ff)'},
    {id:'stroop',icon:'🎯',name:'Stroop冲突',desc:'冲突抑制',gradient:'linear-gradient(135deg,#fa709a,#fee140)'},
    {id:'numshape',icon:'📐',name:'数形结合',desc:'数形转换',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)'},
    {id:'conserve',icon:'⚖️',name:'守恒推理',desc:'守恒思维',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},
    {id:'network',icon:'🕸️',name:'知识网络',desc:'系统思维',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    {id:'reverse',icon:'🔄',name:'逆向推理',desc:'逆向思维',gradient:'linear-gradient(135deg,#f093fb,#f5576c)'},
    {id:'experiment',icon:'🧪',name:'实验设计',desc:'科学探究',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)'},
];

const gameConfig = {
    schulte: {name:'🎯 舒尔特方格',color:'#3377FF',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    visual: {name:'👁️ 视觉搜索',color:'#FF6B6B',gradient:'linear-gradient(135deg,#f093fb,#f5576c)'},
    digit: {name:'🔢 数字记忆',color:'#9B59B6',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},
    pattern: {name:'🎨 图形记忆',color:'#43E97B',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)'},
    tap: {name:'⚡ 快速点击',color:'#FFD93D',gradient:'linear-gradient(135deg,#f6d365,#fda085)'},
    color: {name:'🌈 颜色识别',color:'#4ECDC4',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)'},
    diff: {name:'🔍 找不同',color:'#FA709A',gradient:'linear-gradient(135deg,#fa709a,#fee140)'},
    reason: {name:'🧩 图形推理',color:'#667eea',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    text: {name:'📝 文字记忆',color:'#E0C3FC',gradient:'linear-gradient(135deg,#e0c3fc,#8ec5fc)'},
    shape: {name:'🔷 图形推理',color:'#FFECD2',gradient:'linear-gradient(135deg,#ffecd2,#fcb69f)'},
    math: {name:'🔢 数学速算',color:'#A1C4FD',gradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)'},
    space: {name:'🎲 空间旋转',color:'#D299C2',gradient:'linear-gradient(135deg,#d299c2,#fef9d7)'},
    audio: {name:'🎧 听音辨位',color:'#89F7FE',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)'},
    word: {name:'💬 词汇联想',color:'#FDDB92',gradient:'linear-gradient(135deg,#fddb92,#d1fdff)'},
    classify: {name:'📂 分类归纳',color:'#C1DFC4',gradient:'linear-gradient(135deg,#c1dfc4,#deecfd)'},
    attention: {name:'🎯 注意力追踪',color:'#FF9A9E',gradient:'linear-gradient(135deg,#ff9a9e,#fecfef)'},
    palace: {name:'🏛️ 记忆宫殿',color:'#6a3093',gradient:'linear-gradient(135deg,#6a3093,#a044ff)'},
    stroop: {name:'🎯 Stroop冲突',color:'#fa709a',gradient:'linear-gradient(135deg,#fa709a,#fee140)'},
    numshape: {name:'📐 数形结合',color:'#43e97b',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)'},
    conserve: {name:'⚖️ 守恒推理',color:'#a18cd1',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},
    network: {name:'🕸️ 知识网络',color:'#667eea',gradient:'linear-gradient(135deg,#667eea,#764ba2)'},
    reverse: {name:'🔄 逆向推理',color:'#f093fb',gradient:'linear-gradient(135deg,#f093fb,#f5576c)'},
    experiment: {name:'🧪 实验设计',color:'#89f7fe',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)'},
    snake: {name:'🐍 贪吃蛇',color:'#43A047',gradient:'linear-gradient(135deg,#43A047,#66BB6A)'},
    tetris: {name:'🧱 俄罗斯方块',color:'#E53935',gradient:'linear-gradient(135deg,#E53935,#EF5350)'},
    flipcard: {name:'🃏 记忆翻牌',color:'#1E88E5',gradient:'linear-gradient(135deg,#1E88E5,#42A5F5)'},
    slide: {name:'🔢 数字华容道',color:'#FB8C00',gradient:'linear-gradient(135deg,#FB8C00,#FFA726)'},
    g2048: {name:'🎮 2048',color:'#EDC22E',gradient:'linear-gradient(135deg,#EDC22E,#F0D060)'},
    whack: {name:'🔨 打地鼠',color:'#8E24AA',gradient:'linear-gradient(135deg,#8E24AA,#AB47BC)'},
    linkup: {name:'🔗 连连看',color:'#00897B',gradient:'linear-gradient(135deg,#00897B,#26A69A)'},
    eliminate: {name:'💎 消消乐',color:'#F4511E',gradient:'linear-gradient(135deg,#F4511E,#FF7043)'},
};


// ============================================================
// AI - 智能问答
// ============================================================

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


// ============================================================
// Practice - 练习模块
// ============================================================
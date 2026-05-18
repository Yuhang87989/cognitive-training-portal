// DeepSeek AI 助手模块 - ES6 Modules 版本
import { showToast, escapeHtml, formatAIResponse, speakText, stopTTSSpeech } from '../utils.js';
import { DEEPSEEK_API_URL, DEEPSEEK_API_KEY, DEEPSEEK_MODEL, VISION_API_KEY, VISION_API_URL, VISION_MODEL } from '../config.js';
import { getCurrentUserData } from '../user.js';

// 模块内部状态
let currentDeepSeekImage = null;
let deepseekConversationHistory = [];

/**
 * 视觉API - 图片理解
 */
export async function callVisionAPI(imageDataUrl, question) {
    if (VISION_API_KEY && VISION_API_URL) {
        try {
            const messages = [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: imageDataUrl } },
                    { type: 'text', text: question }
                ]
            }];
            const response = await fetch(VISION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + VISION_API_KEY },
                body: JSON.stringify({ model: VISION_MODEL, messages: messages, max_tokens: 1000 })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0]) return { success: true, content: data.choices[0].message.content };
            }
        } catch (e) {
            console.warn('Vision API failed:', e.message);
        }
    }
    return { success: false, content: '' };
}

/**
 * 调用DeepSeek API
 */
export async function callDeepSeekAPI(messages, temperature = 0.7) {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
            body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: messages, temperature: temperature, max_tokens: 2000 })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 402 || response.status === 400) {
                return { error: true, type: 'balance', message: 'DeepSeek账户余额不足，请先充值后再使用AI功能。前往: https://platform.deepseek.com' };
            }
            throw new Error(errorData.error?.message || 'API调用失败');
        }
        const data = await response.json();
        return { success: true, content: data.choices[0].message.content };
    } catch (error) {
        return { error: true, type: 'network', message: error.message };
    }
}

/**
 * 发送消息到DeepSeek
 */
export async function sendToDeepSeek() {
    const input = document.getElementById('deepseek-input');
    if (!input) return;
    const msg = input.value.trim();

    if (!msg && !currentDeepSeekImage) {
        showToast('请输入问题或上传图片');
        return;
    }

    const messagesEl = document.getElementById('deepseek-messages');
    if (!messagesEl) return;

    stopTTSSpeech();

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

    let userContent;
    const hasImage = !!currentDeepSeekImage;
    const imageDataUrl = currentDeepSeekImage;

    if (hasImage) {
        const visionResult = await callVisionAPI(imageDataUrl, msg || '请分析这张图片');
        if (visionResult.success) {
            userContent = '[AI图片分析：' + visionResult.content + ']\n\n' + (msg || '请基于以上图片分析进一步回答');
        } else if (msg) {
            userContent = msg + '\n（已附上图片，但图片理解API未配置）';
            showToast('💡 图片分析需配置VISION_API_KEY，已按文字处理');
        } else {
            userContent = '请帮我分析这张图片';
            showToast('⚠️ 请输入文字描述图片内容');
        }
    } else {
        userContent = msg;
    }

    deepseekConversationHistory.push({ role: 'user', content: userContent });
    clearDeepSeekImage();

    try {
        const result = await callDeepSeekAPI(deepseekConversationHistory);
        const bubbles = messagesEl.querySelectorAll('.chat-bubble');

        if (result.error) {
            if (bubbles.length > 0) {
                if (result.type === 'balance') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="window.App.deepseek.openDeepSeekRecharge()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;cursor:pointer;">前往充值</button>';
                } else {
                    bubbles[bubbles.length - 1].innerHTML = '❌ 抱歉，' + result.message;
                }
            }
        } else {
            const responseContent = result.content;
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent);
            }
            deepseekConversationHistory.push({ role: 'assistant', content: responseContent });
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

/**
 * 清除DeepSeek图片
 */
export function clearDeepSeekImage() {
    currentDeepSeekImage = null;
    const preview = document.getElementById('deepseek-image-preview');
    if (preview) {
        preview.style.display = 'none';
    }
}

/**
 * 处理DeepSeek图片上传
 */
export function handleDeepSeekImage(input) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        currentDeepSeekImage = e.target.result;

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

/**
 * 打开DeepSeek充值页面
 */
export function openDeepSeekRecharge() {
    window.open('https://platform.deepseek.com', '_blank');
}

/**
 * 显示DeepSeek余额提示
 */
export function showDeepSeekBalanceAlert() {
    const modal = document.getElementById('detail-modal');
    const contentDiv = document.getElementById('detail-content');
    if (modal && contentDiv) {
        modal.classList.add('show');
        contentDiv.innerHTML = '<div class="modal-title">⚠️ AI功能提示</div>' +
            '<div style="background:#fff3cd;border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">' +
            '<div style="font-size:48px;margin-bottom:12px;">💰</div>' +
            '<div style="font-size:15px;font-weight:bold;color:#856404;margin-bottom:8px;">DeepSeek账户余额不足</div>' +
            '<div style="font-size:13px;color:#856404;line-height:1.6;">当前账户无法继续使用AI功能，请前往DeepSeek平台充值后再试。</div></div>' +
            '<button class="login-btn" style="width:100%;" onclick="window.open(\'https://platform.deepseek.com\',\'_blank\')">前往充值</button>' +
            '<button class="login-btn login-btn-secondary" style="margin-top:12px;width:100%;" onclick="document.getElementById(\'detail-modal\').classList.remove(\'show\')">关闭</button>';
    }
}

/**
 * 查询DeepSeek余额
 */
export async function queryDeepSeekBalance(showToastFlag = false) {
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

        const user = getCurrentUserData();
        const todayCalls = user?.deepSeekCalls?.today || 0;
        const totalCalls = user?.deepSeekCalls?.total || 0;

        if (showToastFlag) {
            showToast('余额已更新');
        }

        return {
            balance: '¥' + balance,
            tokens: tokens.toLocaleString(),
            todayCalls: todayCalls,
            totalCalls: totalCalls,
            lastUpdate: new Date().toLocaleTimeString()
        };
    } catch (error) {
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

/**
 * 渲染DeepSeek聊天页面
 */
export function renderDeepSeekPage() {
    return `
        <div class="module-page">
            <div class="page-header">
                <button class="back-btn" onclick="window.App.ui.goHome()">← 返回</button>
                <h2>🤖 DeepSeek AI 助手</h2>
            </div>
            <div class="deepseek-container">
                <div id="deepseek-messages" class="deepseek-messages"></div>
                <div id="deepseek-image-preview" class="image-preview" style="display:none;">
                    <img id="deepseek-preview-img" />
                    <button class="clear-image-btn" onclick="window.App.deepseek.clearDeepSeekImage()">×</button>
                </div>
                <div class="deepseek-input-area">
                    <label class="image-upload-btn">
                        <input type="file" accept="image/*" onchange="window.App.deepseek.handleDeepSeekImage(this)" />
                        📷
                    </label>
                    <textarea id="deepseek-input" placeholder="输入问题..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();window.App.deepseek.sendToDeepSeek()}"></textarea>
                    <button class="send-btn" onclick="window.App.deepseek.sendToDeepSeek()">➤</button>
                </div>
            </div>
        </div>
    `;
}

// 挂载到window.App，供HTML onclick调用
if (!window.App) window.App = {};
window.App.deepseek = {
    sendToDeepSeek,
    handleDeepSeekImage,
    clearDeepSeekImage,
    openDeepSeekRecharge,
    showDeepSeekBalanceAlert
};

// 版本: V146 - DeepSeek模块全功能修复

const SoundEffects = {
    audioContext: null,
    enabled: true,
    
    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // 恢复音频上下文（需要用户交互后才能播放）
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },
    
    // 播放音调
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled) return;
        this.init();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },
    
    // 正确音效 - 上升的三音和弦
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        // 创建三个振荡器形成和弦
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.start(now + i * 0.05);
            osc.stop(now + 0.3);
        });
    },
    
    // 错误音效 - 低沉的两个音
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        [200, 150].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0.15, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.start(now + i * 0.1);
            osc.stop(now + 0.3);
        });
    },
    
    // 点击音效 - 短促的提示音
    playClick() {
        this.playTone(800, 0.05, 'sine', 0.1);
    },
    
    // 提交音效
    playSubmit() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    },
    
    // 完成音效 - 胜利旋律
    playComplete() {
        if (!this.enabled) return;
        this.init();
        const now = this.audioContext.currentTime;
        
        // 胜利旋律：C-E-G-C (高八度)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const durations = [0.15, 0.15, 0.15, 0.3];
        
        let time = now;
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);
            
            osc.start(time);
            osc.stop(time + durations[i]);
            
            time += durations[i] * 0.8;
        });
    },
    
    // 倒计时音效
    playCountdown() {
        this.playTone(440, 0.1, 'square', 0.1);
    },
    
    // 切换音效开关
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// ============================================================
// Utils - 工具函数
// ============================================================
// ============================================================
// TTS - 文字转语音
// ============================================================

let ttsUtterance = null;
let isTTSPlaying = false;

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
    }
    
    // 停止之前的朗读
    stopTTSSpeech();
    
    // 清理文本（移除Markdown和多余空白）
    let cleanText = text.replace(/\*\*/g, '').replace(/`/g, '').replace(/<[^>]*>/g, '');
    
    ttsUtterance = new SpeechSynthesisUtterance(cleanText);
    ttsUtterance.lang = 'zh-CN';
    ttsUtterance.rate = 1.0;
    ttsUtterance.pitch = 1.0;
    
    // 尝试选择中文语音
    const voices = speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
    if (chineseVoice) {
        ttsUtterance.voice = chineseVoice;
    }
    
    ttsUtterance.onstart = function() {
        isTTSPlaying = true;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'inline-block';
    };
    
    ttsUtterance.onend = function() {
        isTTSPlaying = false;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
    };
    
    ttsUtterance.onerror = function() {
        isTTSPlaying = false;
        const stopBtn = document.getElementById('tts-stop-btn');
        if (stopBtn) stopBtn.style.display = 'none';
    };
    
    speechSynthesis.speak(ttsUtterance);
}

function stopTTSSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    isTTSPlaying = false;
    const stopBtn = document.getElementById('tts-stop-btn');
    if (stopBtn) stopBtn.style.display = 'none';
}

// 导出到window
window.speakText = speakText;
window.stopTTSSpeech = stopTTSSpeech;

// ============================================================
// DeepSeek语音输入
// ============================================================

let deepseekRecognition = null;
let isRecording = false;

// 检测是否在微信浏览器中
function isWeChatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

// V148-fix: 添加微信浏览器检测，提供替代方案
function toggleDeepSeekVoice() {
    const btn = document.getElementById('deepseek-voice-btn');
    const input = document.getElementById('deepseek-input');
    if (!input) return;
    
    // V148-fix: 微信浏览器不支持webkitSpeechRecognition
    if (isWeChatBrowser()) {
        showToast('📱 微信中请使用系统键盘的语音输入功能', 4000);
        return;
    }
    
    // V148-fix: 检测浏览器是否支持语音识别
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('⚠️ 当前浏览器不支持语音输入，请使用打字输入或系统键盘语音');
        return;
    }
    
    if (!deepseekRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        deepseekRecognition = new SpeechRecognition();
        deepseekRecognition.lang = 'zh-CN';
        deepseekRecognition.continuous = false;
        deepseekRecognition.interimResults = false;
        
        deepseekRecognition.onstart = function() {
            isRecording = true;
            if (btn) btn.textContent = '🔴';
            showToast('正在聆听...');
        };
        
        deepseekRecognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            // 每次重新获取input元素，避免闭包引用已失效的DOM
            const currentInput = document.getElementById('deepseek-input');
            if (currentInput) {
                currentInput.value += (currentInput.value ? ' ' : '') + transcript;
                // 触发input事件，确保框架感知到值变化
                currentInput.dispatchEvent(new Event('input', {bubbles: true}));
            }
            if (btn) btn.textContent = '🎤';
            showToast('已识别: ' + transcript);
        };
        
        deepseekRecognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            if (btn) btn.textContent = '🎤';
            if (event.error !== 'no-speech') {
                showToast('语音识别错误: ' + event.error);
            }
        };
        
        deepseekRecognition.onend = function() {
            isRecording = false;
            if (btn) btn.textContent = '🎤';
        };
    }
    
    // 每次点击时重置recognition，确保获取最新DOM元素
    deepseekRecognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const currentInput = document.getElementById('deepseek-input');
        if (currentInput) {
            currentInput.value += (currentInput.value ? ' ' : '') + transcript;
            currentInput.dispatchEvent(new Event('input', {bubbles: true}));
        }
        const currentBtn = document.getElementById('deepseek-voice-btn');
        if (currentBtn) currentBtn.textContent = '🎤';
        showToast('已识别: ' + transcript);
    };
    
    if (isRecording) {
        deepseekRecognition.stop();
        isRecording = false;
        if (btn) btn.textContent = '🎤';
    } else {
        deepseekRecognition.start();
    }
}

window.toggleDeepSeekVoice = toggleDeepSeekVoice;

// ============================================================
// toggleVoiceInput - 通用语音输入函数（供其他模块调用）
// ============================================================

let voiceInputRecognition = null;
let currentVoiceInputCallback = null;
let currentVoiceInputBtn = null;
let currentVoiceInputId = null; // 当前语音输入的目标inputId

// V148-fix: toggleVoiceInput通用语音输入函数，添加微信检测
function toggleVoiceInput(btn, inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        showToast('输入框未找到');
        return;
    }
    
    // V148-fix: 更新当前目标inputId
    currentVoiceInputId = inputId;
    currentVoiceInputBtn = btn;
    
    // V148-fix: 微信浏览器检测
    if (isWeChatBrowser()) {
        showToast('📱 微信中请使用系统键盘的语音输入', 4000);
        // 自动聚焦到输入框，提示用户使用系统语音
        input.focus();
        return;
    }
    
    // V148-fix: 检查浏览器支持
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('⚠️ 当前浏览器不支持语音输入');
        return;
    }
    
    // 初始化语音识别
    if (!voiceInputRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        voiceInputRecognition = new SpeechRecognition();
        voiceInputRecognition.lang = 'zh-CN';
        voiceInputRecognition.continuous = false;
        voiceInputRecognition.interimResults = false;
        
        voiceInputRecognition.onstart = function() {
            isRecording = true;
            if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🔴';
            showToast('正在聆听...');
        };
        
        voiceInputRecognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            // 用currentVoiceInputId而非闭包捕获的inputId，确保指向最新目标
            const targetInput = document.getElementById(currentVoiceInputId);
            if (targetInput) {
                if (targetInput.value && !targetInput.value.endsWith(' ')) {
                    targetInput.value += ' ';
                }
                targetInput.value += transcript;
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                // 聚焦输入框，让用户看到文字
                targetInput.focus();
            }
            if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
            showToast('已识别: ' + transcript);
        };
        
        voiceInputRecognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                showToast('语音识别错误: ' + event.error);
            }
        };
        
        voiceInputRecognition.onend = function() {
            isRecording = false;
            if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
        };
    }
    
    // 每次调用都更新onresult，确保使用最新的currentVoiceInputId
    voiceInputRecognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const targetInput = document.getElementById(currentVoiceInputId);
        if (targetInput) {
            if (targetInput.value && !targetInput.value.endsWith(' ')) {
                targetInput.value += ' ';
            }
            targetInput.value += transcript;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetInput.focus();
        }
        if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
        showToast('已识别: ' + transcript);
    };
    
    // 停止之前的 TTS
    stopTTSSpeech();
    
    if (isRecording) {
        // 停止当前录音
        voiceInputRecognition.stop();
        isRecording = false;
        if (btn) btn.textContent = '🎤';
    } else {
        // 开始新录音
        try {
            voiceInputRecognition.start();
        } catch(e) {
            // 如果已经在运行，先停止再开始
            voiceInputRecognition.stop();
            setTimeout(function() {
                voiceInputRecognition.start();
            }, 100);
        }
    }
}

// 导出到window
window.toggleVoiceInput = toggleVoiceInput;
window.isRecording = isRecording;

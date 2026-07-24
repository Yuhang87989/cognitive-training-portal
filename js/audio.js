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

// V151-2: 最简语音输入 - 只做一件事：识别→填入输入框
function toggleDeepSeekVoice() {
    var btn = document.getElementById('deepseek-voice-btn');
    var input = document.getElementById('deepseek-input');
    if (!input) return;
    
    var hasSR = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    if (!hasSR) {
        window.showToast('🎤 浏览器不支持语音，请手动输入');
        return;
    }
    
    // 如果正在录音，停止
    if (isRecording) {
        try { deepseekRecognition.stop(); } catch(e) {}
        isRecording = false;
        if (btn) btn.textContent = '🎤';
        return;
    }
    
    // 新建识别对象
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    deepseekRecognition = new SR();
    deepseekRecognition.lang = 'zh-CN';
    deepseekRecognition.continuous = false;
    deepseekRecognition.interimResults = false; // 不要实时，只要最终结果
    deepseekRecognition.maxAlternatives = 1;
    
    var gotText = '';
    
    deepseekRecognition.onstart = function() {
        isRecording = true;
        if (btn) btn.textContent = '⏺';
        window.showToast('🎤 请说话...', 3000);
    };
    
    deepseekRecognition.onresult = function(event) {
        // 直接取最终结果
        gotText = event.results[0][0].transcript;
        console.log('[Voice] 识别结果:', gotText);
        // 直接写入输入框
        var inp = document.getElementById('deepseek-input');
        if (inp) {
            var old = inp.value.trim();
            inp.value = old ? old + ' ' + gotText : gotText;
            inp.focus();
        }
    };
    
    deepseekRecognition.onerror = function(event) {
        isRecording = false;
        if (btn) btn.textContent = '🎤';
        if (event.error === 'no-speech') {
            window.showToast('未听到语音，请再试');
        } else if (event.error === 'not-allowed') {
            window.showToast('请允许麦克风权限');
        } else if (event.error !== 'aborted') {
            window.showToast('语音识别失败: ' + event.error);
        }
    };
    
    deepseekRecognition.onend = function() {
        isRecording = false;
        if (btn) btn.textContent = '🎤';
        if (gotText) {
            window.showToast('✅ ' + gotText);
        }
    };
    
    // 启动
    try {
        deepseekRecognition.start();
    } catch(e) {
        window.showToast('语音启动失败，请重试');
        isRecording = false;
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

// V151: toggleVoiceInput通用语音输入函数 - 同步改进
function toggleVoiceInput(btn, inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        window.showToast('输入框未找到');
        return;
    }
    
    currentVoiceInputId = inputId;
    currentVoiceInputBtn = btn;
    
    var hasSpeechRecognition = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    
    if (!hasSpeechRecognition) {
        window.showToast('🎤 请点击输入框，使用键盘的语音输入功能', 4000);
        input.focus();
        return;
    }
    
    // V151: 每次创建新的识别对象
    try {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        voiceInputRecognition = new SpeechRecognition();
        voiceInputRecognition.lang = 'zh-CN';
        voiceInputRecognition.continuous = false;
        voiceInputRecognition.interimResults = true; // V151: 开启实时转录
        voiceInputRecognition.maxAlternatives = 1;
    } catch(initErr) {
        window.showToast('🎤 语音识别初始化失败');
        return;
    }
    
    var viGotResult = false;
    var viFinalText = '';
    
    voiceInputRecognition.onstart = function() {
        isRecording = true;
        if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '⏺';
        window.showToast('🎤 正在聆听，请说话...', 5000);
    };
    
    voiceInputRecognition.onresult = function(event) {
        var interimText = '';
        var finalText = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalText += event.results[i][0].transcript;
            } else {
                interimText += event.results[i][0].transcript;
            }
        }
        if (finalText) {
            viFinalText += finalText;
            viGotResult = true;
        }
        // 实时更新输入框
        var targetInput = document.getElementById(currentVoiceInputId);
        if (targetInput && !targetInput.disabled) {
            var val = targetInput.value.replace(/\.\.\.+$/, '').trim();
            if (val && !val.endsWith(' ')) val += ' ';
            if (viFinalText) val += viFinalText + ' ';
            if (interimText) val += interimText + '...';
            else val = val.trimEnd();
            targetInput.value = val;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
    
    voiceInputRecognition.onerror = function(event) {
        isRecording = false;
        if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
        if (viGotResult && viFinalText) return; // 有结果就忽略错误
        if (event.error === 'not-allowed') {
            window.showToast('⚠️ 请允许麦克风权限后重试');
        } else if (event.error === 'no-speech') {
            window.showToast('未检测到语音，请再试一次');
        } else if (event.error !== 'aborted') {
            window.showToast('🎤 语音识别出错，请重试');
        }
    };
    
    voiceInputRecognition.onend = function() {
        isRecording = false;
        if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '🎤';
        if (viGotResult && viFinalText) {
            var targetInput = document.getElementById(currentVoiceInputId);
            if (targetInput && !targetInput.disabled) {
                var val = targetInput.value.replace(/\.\.\.+$/, '').trim();
                if (val.indexOf(viFinalText) < 0) {
                    if (val) val += ' ';
                    val += viFinalText;
                }
                targetInput.value = val;
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                targetInput.focus();
                window.showToast('✅ 已识别: ' + viFinalText);
            }
        } else if (!viGotResult) {
            window.showToast('🎤 未识别到内容，请再试一次');
        }
    };
    
    stopTTSSpeech();
    
    try {
        voiceInputRecognition.start();
    } catch(e) {
        if (e.message && e.message.indexOf('already') >= 0) {
            try { voiceInputRecognition.stop(); } catch(e2) {}
            setTimeout(function() {
                try { voiceInputRecognition.start(); } catch(e3) {
                    window.showToast('🎤 语音识别启动失败，请刷新后重试');
                }
            }, 500);
        } else {
            window.showToast('🎤 语音识别启动失败');
        }
    }
}

// 导出到window
window.toggleVoiceInput = toggleVoiceInput;

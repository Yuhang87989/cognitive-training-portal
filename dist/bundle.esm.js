// ==========================================
// 认知训练门户 V246 Bundle
// 构建时间: 2026-05-18T07:51:10.967Z
// ==========================================


// ===== js/config.js =====
// 版本: auto (基于部署时间戳)
// V177修改: 图片识别改用Tesseract.js本地OCR，硅基流动作为备选
// V177修改: DeepSeek文字/语音，Tesseract.js本地OCR+DeepSeek分析图片

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-8413f72a3f084fb08c84389555a76d37';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

// 存储键名
const STORAGE_KEY = 'cognitive_training_v137';
const API_CONFIG_KEY = 'cognitive_api_config';

// 旧版本存储键（数据迁移用）
const OLD_KEYS = ['cognitive_training_v135','cognitive_training_v119','cognitive_training_v118','cognitive_training_v43', 'cognitive_training_v42', 'cognitive_training_v41', 'cognitive_training_v40', 'cognitive_training_v33', 'cognitive_training_v32'];

// 头像列表
const AVATAR_LIST = [
    { emoji: '🧒', gradient: 'linear-gradient(135deg,#FFD4B8,#FFB6C1)' },
    { emoji: '👧', gradient: 'linear-gradient(135deg,#B8D4FF,#A8C4FF)' },
    { emoji: '👦', gradient: 'linear-gradient(135deg,#B8FFD4,#A8E4C1)' },
    { emoji: '👨', gradient: 'linear-gradient(135deg,#E4B8FF,#D4A8FF)' },
    { emoji: '👩', gradient: 'linear-gradient(135deg,#FFE4B8,#FFD8A8)' },
    { emoji: '🧑', gradient: 'linear-gradient(135deg,#B8E4FF,#A8D8FF)' },
    { emoji: '🤖', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { emoji: '🦸', gradient: 'linear-gradient(135deg,#ff6b6b,#ff4757)' },
    { emoji: '🦊', gradient: 'linear-gradient(135deg,#FF9A63,#E87A4E)' },
    { emoji: '🐱', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
    { emoji: '🐶', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { emoji: '🐰', gradient: 'linear-gradient(135deg,#f6d365,#fda085)' }
];

// ============================================================
// 视觉API配置 - V152新增
// 支持DeepSeek视觉（如果可用）或硅基流动Qwen3-VL
// ============================================================

// 方案1: 硅基流动(推荐，国内速度快，支持Qwen3-VL)
// 注册地址: https://cloud.siliconflow.com
// 获取API Key后填入下方
const VISION_SILICONFLOW_KEY = 'sk-upymyvbtqdunkmmksrmtqugootqqysvgevwkllyomqcvskrw';  // 硅基流动API Key
const VISION_SILICONFLOW_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const VISION_SILICONFLOW_MODEL = 'Qwen/Qwen3-VL-30B-A3B-Instruct';  // 高性价比视觉模型

// 方案2: DeepSeek视觉 (部分账号可能不支持)
// 如果DeepSeek不支持视觉，会自动降级到硅基流动
const VISION_DEEPSEEK_ENABLED = true;  // 硅基流动余额不足时fallback

// 当前使用的视觉API类型: 'deepseek' | 'siliconflow'
window.CURRENT_VISION_API = 'siliconflow';  // 默认使用硅基流动

// ========== 全局共享变量 ==========
window.QUESTIONS_PER_PAGE = 5;
window.currentMethodPage = {};
window.currentThinkingPage = {};


// ===== js/ctm.js =====
// Cognitive Training Manager - 模块注册与钩子系统
// 版本: V156

const CTM = {
    version: '1.5.6',
    modules: {},
    plans: {},
    games: {},
    hooks: {},
    
    registerModule(name, mod) {
        this.modules[name] = mod;
        console.log('Module registered:', name);
    },
    
    registerPlan(name, plan) {
        this.plans[name] = plan;
    },
    
    registerGame(name, game) {
        this.games[name] = game;
    },
    
    addHook(name, fn) {
        if (!this.hooks[name]) this.hooks[name] = [];
        this.hooks[name].push(fn);
    },
    
    triggerHook(name, data) {
        if (this.hooks[name]) {
            this.hooks[name].forEach(fn => fn(data));
        }
    },
    
    getCurrentWeek() {
        return Math.min(Math.ceil((Date.now() - 1745539200000) / 604800000) + 1, 7);
    },
    
    getTrainingConfig() {
        return { weeks: 7, dailyGoal: 8 };
    }
};


// ============================================================
// Storage - 数据存储
// ============================================================
window.CTM = CTM;


// ===== js/audio.js =====
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
        showToast('🎤 浏览器不支持语音，请手动输入');
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
        showToast('🎤 请说话...', 3000);
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
            showToast('未听到语音，请再试');
        } else if (event.error === 'not-allowed') {
            showToast('请允许麦克风权限');
        } else if (event.error !== 'aborted') {
            showToast('语音识别失败: ' + event.error);
        }
    };
    
    deepseekRecognition.onend = function() {
        isRecording = false;
        if (btn) btn.textContent = '🎤';
        if (gotText) {
            showToast('✅ ' + gotText);
        }
    };
    
    // 启动
    try {
        deepseekRecognition.start();
    } catch(e) {
        showToast('语音启动失败，请重试');
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
        showToast('输入框未找到');
        return;
    }
    
    currentVoiceInputId = inputId;
    currentVoiceInputBtn = btn;
    
    var hasSpeechRecognition = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
    
    if (!hasSpeechRecognition) {
        showToast('🎤 请点击输入框，使用键盘的语音输入功能', 4000);
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
        showToast('🎤 语音识别初始化失败');
        return;
    }
    
    var viGotResult = false;
    var viFinalText = '';
    
    voiceInputRecognition.onstart = function() {
        isRecording = true;
        if (currentVoiceInputBtn) currentVoiceInputBtn.textContent = '⏺';
        showToast('🎤 正在聆听，请说话...', 5000);
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
            showToast('⚠️ 请允许麦克风权限后重试');
        } else if (event.error === 'no-speech') {
            showToast('未检测到语音，请再试一次');
        } else if (event.error !== 'aborted') {
            showToast('🎤 语音识别出错，请重试');
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
                showToast('✅ 已识别: ' + viFinalText);
            }
        } else if (!viGotResult) {
            showToast('🎤 未识别到内容，请再试一次');
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
                    showToast('🎤 语音识别启动失败，请刷新后重试');
                }
            }, 500);
        } else {
            showToast('🎤 语音识别启动失败');
        }
    }
}

// 导出到window
window.toggleVoiceInput = toggleVoiceInput;


// ===== js/db.js =====
// 版本: V152
// IndexedDB 本地数据库模块

window.DB = (function() {
    const DB_NAME = 'CognitiveTrainingDB';
    const DB_VERSION = 1;
    let dbInstance = null;

    // 初始化数据库
    function init() {
        return new Promise(function(resolve, reject) {
            if (dbInstance) {
                resolve(dbInstance);
                return;
            }
            var request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                // 用户表 - 以用户id为key
                if (!db.objectStoreNames.contains('users')) {
                    var userStore = db.createObjectStore('users', { keyPath: 'id' });
                    userStore.createIndex('name', 'name', { unique: false });
                }
                // 设置表 - 全局设置
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
                console.log('[DB] 数据库创建/升级完成');
            };
            
            request.onsuccess = function(event) {
                dbInstance = event.target.result;
                console.log('[DB] 数据库打开成功');
                resolve(dbInstance);
            };
            
            request.onerror = function(event) {
                console.error('[DB] 数据库打开失败:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // 通用事务操作
    function transaction(storeName, mode) {
        if (!dbInstance) throw new Error('[DB] 数据库未初始化');
        var tx = dbInstance.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    // 获取单个用户
    function getUser(userId) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readonly');
                var request = store.get(userId);
                request.onsuccess = function() { resolve(request.result || null); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取所有用户
    function getAllUsers() {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readonly');
                var request = store.getAll();
                request.onsuccess = function() { resolve(request.result || []); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存用户
    function saveUser(user) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readwrite');
                var request = store.put(user);
                request.onsuccess = function() { resolve(user); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存所有用户
    function saveAllUsers(users) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var tx = dbInstance.transaction('users', 'readwrite');
                var store = tx.objectStore('users');
                // 先清空再写入
                store.clear();
                users.forEach(function(user) {
                    store.put(user);
                });
                tx.oncomplete = function() { resolve(); };
                tx.onerror = function() { reject(tx.error); };
            }).catch(reject);
        });
    }

    // 删除用户
    function deleteUser(userId) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('users', 'readwrite');
                var request = store.delete(userId);
                request.onsuccess = function() { resolve(); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取设置
    function getSetting(key) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('settings', 'readonly');
                var request = store.get(key);
                request.onsuccess = function() { 
                    resolve(request.result ? request.result.value : null); 
                };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 保存设置
    function saveSetting(key, value) {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var store = transaction('settings', 'readwrite');
                var request = store.put({ key: key, value: value });
                request.onsuccess = function() { resolve(); };
                request.onerror = function() { reject(request.error); };
            }).catch(reject);
        });
    }

    // 获取当前用户
    function getCurrentUser() {
        return getSetting('currentUser').then(function(userId) {
            if (!userId) return null;
            return getUser(userId);
        });
    }

    // 设置当前用户
    function setCurrentUser(userId) {
        return saveSetting('currentUser', userId);
    }

    // 获取当前用户ID
    function getCurrentUserId() {
        return getSetting('currentUser');
    }

    // 清空所有数据
    function clearAll() {
        return new Promise(function(resolve, reject) {
            init().then(function() {
                var tx = dbInstance.transaction(['users', 'settings'], 'readwrite');
                tx.objectStore('users').clear();
                tx.objectStore('settings').clear();
                tx.oncomplete = function() { resolve(); };
                tx.onerror = function() { reject(tx.error); };
            }).catch(reject);
        });
    }

    // 从localStorage迁移数据
    function migrateFromLocalStorage() {
        return new Promise(function(resolve, reject) {
            var STORAGE_KEY = 'cognitive_training_portal_data';
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) {
                    console.log('[Migration] localStorage无数据，跳过迁移');
                    resolve(false);
                    return;
                }
                var data = JSON.parse(raw);
                if (!data || !data.users || data.users.length === 0) {
                    console.log('[Migration] localStorage数据为空，跳过迁移');
                    resolve(false);
                    return;
                }
                
                console.log('[Migration] 开始从localStorage迁移 ' + data.users.length + ' 个用户');
                
                init().then(function() {
                    var tx = dbInstance.transaction(['users', 'settings'], 'readwrite');
                    var userStore = tx.objectStore('users');
                    var settingsStore = tx.objectStore('settings');
                    
                    // 迁移用户数据
                    data.users.forEach(function(user) {
                        userStore.put(user);
                        console.log('[Migration] 迁移用户:', user.name || user.id);
                    });
                    
                    // 迁移设置
                    if (data.currentUser) {
                        settingsStore.put({ key: 'currentUser', value: data.currentUser });
                    }
                    settingsStore.put({ key: 'migrated', value: true });
                    settingsStore.put({ key: 'migrateTime', value: new Date().toISOString() });
                    
                    tx.oncomplete = function() {
                        console.log('[Migration] 迁移完成！共迁移 ' + data.users.length + ' 个用户');
                        // 保留localStorage数据作为备份，不删除
                        resolve(true);
                    };
                    tx.onerror = function() {
                        console.error('[Migration] 迁移失败:', tx.error);
                        reject(tx.error);
                    };
                }).catch(reject);
            } catch(e) {
                console.error('[Migration] 迁移异常:', e);
                resolve(false);
            }
        });
    }

    // 检查并执行迁移
    function checkAndMigrate() {
        return new Promise(function(resolve) {
            init().then(function() {
                return getSetting('migrated');
            }).then(function(migrated) {
                if (migrated) {
                    console.log('[Migration] 已迁移过，跳过');
                    resolve(false);
                    return;
                }
                return migrateFromLocalStorage();
            }).then(function(result) {
                resolve(result);
            }).catch(function(e) {
                console.error('[Migration] 检查迁移失败:', e);
                resolve(false);
            });
        });
    }

    // 导出提示
    console.log('[DB] IndexedDB模块已加载');

    return {
        init: init,
        getUser: getUser,
        getAllUsers: getAllUsers,
        saveUser: saveUser,
        saveAllUsers: saveAllUsers,
        deleteUser: deleteUser,
        getSetting: getSetting,
        saveSetting: saveSetting,
        getCurrentUser: getCurrentUser,
        getCurrentUserId: getCurrentUserId,
        setCurrentUser: setCurrentUser,
        clearAll: clearAll,
        migrateFromLocalStorage: migrateFromLocalStorage,
        checkAndMigrate: checkAndMigrate
    };
})();


// ===== js/storage.js =====
// 版本: V152

const DEFAULT_USER = {
    id: 'user_default_qiuyufei',
    name: '邱宇菲',
    grade: 7, // 初一
    difficulty: 1, // 难度级别1
    points: 1142, // 初始积分
    createdAt: new Date().toISOString(),
    stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        totalMinutes: 0,
        streakDays: 0,
        lastActiveDate: null
    },
    weeklyProgress: {},
    wrongNotes: [],
    completedTopics: [],
    studyDays: {},
    todayStats: { date: new Date().toISOString().split('T')[0], questions: 0, correct: 0, minutes: 0 }
};

function loadData() {
    try {
        // 尝试从IndexedDB迁移（异步，首次可能还没完成）
        if (window.DB) {
            try { DB.checkAndMigrate(); } catch(e) {}
        }
        // 尝试迁移旧数据
        migrateData();
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // 首次访问，创建默认用户
            const defaultData = {
                users: [{ ...DEFAULT_USER }],
                currentUser: DEFAULT_USER.id
            };
            saveData(defaultData);
            console.log('已创建默认用户:', DEFAULT_USER.name);
            return defaultData;
        }
        const data = JSON.parse(raw);
        // 验证数据格式
        if (!data || typeof data !== 'object') {
            console.log('数据格式错误，创建默认用户');
            const defaultData = {
                users: [{ ...DEFAULT_USER }],
                currentUser: DEFAULT_USER.id
            };
            saveData(defaultData);
            return defaultData;
        }
        if (!Array.isArray(data.users)) data.users = [];
        
        // 如果没有用户，创建默认用户
        if (data.users.length === 0) {
            data.users = [{ ...DEFAULT_USER }];
            data.currentUser = DEFAULT_USER.id;
            saveData(data);
            console.log('用户列表为空，已创建默认用户:', DEFAULT_USER.name);
        }
        
        if (!data.currentUser && data.users.length > 0) {
            data.currentUser = data.users[0].id;
        }
        return data;
    } catch(e) {
        console.log('数据加载错误，创建默认用户:', e.message);
        // 清除损坏的数据并创建默认用户
        try { localStorage.removeItem(STORAGE_KEY); } catch(e2) {}
        const defaultData = {
            users: [{ ...DEFAULT_USER }],
            currentUser: DEFAULT_USER.id
        };
        saveData(defaultData);
        return defaultData;
    }
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
    // IndexedDB双写
    if (window.DB && data && data.users) {
        try {
            DB.saveAllUsers(data.users);
            if (data.currentUser) DB.saveSetting('currentUser', data.currentUser);
        } catch(e) {
            console.warn('[Storage] IndexedDB写入失败:', e);
        }
    }
}

// 保存单个用户数据（更新到localStorage）
function saveUserData(user) {
    try {
        var data = loadData();
        var idx = -1;
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].id === user.id) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            data.users[idx] = user;
        } else {
            data.users.push(user);
        }
        saveData(data);
    } catch(e) {
        console.warn('saveUserData失败:', e);
    }
}

function clearCurrentUserData() {
    if (!confirm('确定要清除当前用户的所有数据吗？')) return;
    
    var data = loadData();
    var user = data.users.find(function(u) { return u.id === data.currentUser; });
    
    if (!user) {
        showToast('用户不存在');
        return;
    }
    
    // 重置用户数据
    user.points = 0;
    user.stats = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalMinutes: 0,
        streakDays: 0,
        lastActiveDate: null
    };
    user.wrongNotes = [];
    user.completedTopics = [];
    user.weeklyProgress = {};
    
    saveData(data);
    updateUI();
    syncTodayStats();
    closeUserMenu();
    showToast('已清除 ' + user.name + ' 的数据');
}

function getApiConfig() {
    try {
        const config = localStorage.getItem(API_CONFIG_KEY);
        return config ? JSON.parse(config) : { deepseek: '', peerjs: '0.peerjs.com' };
    } catch(e) {
        return { deepseek: '', peerjs: '0.peerjs.com' };
    }
}

function saveApiConfig(config) {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
}

function resetApiConfig() {
    if (!confirm('确定要恢复默认配置吗？')) return;
    
    localStorage.removeItem(API_CONFIG_KEY);
    showToast('API配置已重置为默认值');
    updateApiStatusDisplay();
}

function updateApiStatusDisplay() {
    const config = getApiConfig();
    const deepseekStatus = document.getElementById('api-deepseek-status');
    if (deepseekStatus) {
        deepseekStatus.textContent = '状态：' + (config.deepseek ? '已配置' : '未配置');
    }
}

function getCurrentUserData() {
    const data = loadData();
    if (!data.currentUser) return null;
    return data.users.find(u => u.id === data.currentUser) || null;
}

function getGradeSubjectTopics(grade, subject) {
    const gradeMap = {5:'5',6:'6',7:'7',8:'8',9:'9'};
    const key = (subject || 'math') + gradeMap[grade];
    return topics[key] || [];
}

function getMethodTraining(methodId) {
    return methodTraining[methodId] || [];
}

// getTopicsList moved to topics.js module

function getWeekPlan(weekId) { return weekPlans[weekId] || null; }

function confirmClearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        clearAllData();
    }
}

function clearAllData() {
    if (!confirm('⚠️ 确定要清除所有数据吗？')) return;
    localStorage.removeItem(STORAGE_KEY);
    // IndexedDB清理
    if (window.DB) {
        try { DB.clearAll(); } catch(e) {
            console.warn('[Storage] IndexedDB清理失败:', e);
        }
    }
    location.reload();
}

function syncUserData(user) {
    const data = loadData();
    const idx = data.users.findIndex(u => u.id === user.id);
    if (idx >= 0) { data.users[idx] = user; saveData(data); }
    // IndexedDB同步
    if (window.DB) {
        try { DB.saveUser(user); } catch(e) {
            console.warn('[Storage] IndexedDB同步失败:', e);
        }
    }
}

function syncData() {
    const btn = document.getElementById('sync-btn');
    const syncTimeEl = document.getElementById('last-sync-time');
    
    if (btn) {
        btn.textContent = '同步中...';
        btn.disabled = true;
    }
    
    const user = getCurrentUserData();
    if (user) {
        // 更新同步时间
        const now = new Date();
        const syncTime = now.toLocaleString('zh-CN', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // 保存同步时间到用户数据
        user.lastSyncTime = now.toISOString();
        syncUserData(user);
        
        // 更新显示
        if (syncTimeEl) {
            syncTimeEl.textContent = `上次同步：${syncTime}`;
        }
        
        setTimeout(() => {
            if (btn) {
                btn.textContent = '同步';
                btn.disabled = false;
            }
            showToast('✅ 数据同步成功');
            
            // 更新数据统计
            updateDataStatsDisplay();
        }, 800);
    } else {
        if (btn) {
            btn.textContent = '同步';
            btn.disabled = false;
        }
        showToast('请先登录');
    }
}

function syncTodayStats() {
    const user = getCurrentUserData();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { date: today, questions: 0, correct: 0, minutes: 0 };
    if (todayStats.date !== today) { 
        todayStats = { date: today, questions: 0, correct: 0, minutes: 0 }; 
        user.todayStats = todayStats; 
        syncUserData(user); 
    }
    // 安全地更新DOM元素
    const questionsEl = document.getElementById('today-questions');
    const correctEl = document.getElementById('today-correct');
    const minutesEl = document.getElementById('today-minutes');
    const streakEl = document.getElementById('today-streak');
    if (questionsEl) questionsEl.textContent = todayStats.questions || 0;
    if (correctEl) correctEl.textContent = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) + '%' : '0%';
    if (minutesEl) minutesEl.textContent = todayStats.minutes || 0;
    const studyDays = user.studyDays || {};
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date(); 
        d.setDate(d.getDate() - i);
        if (studyDays[d.toISOString().split('T')[0]]) streak++; 
        else if (i > 0) break;
    }
    if (streakEl) streakEl.textContent = streak;
}

// 记录练习数据 - V145修复
window.recordPractice = function(questionCount, correctCount, minutesSpent) {
    const user = getCurrentUserData();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    // 初始化数据结构
    if (!user.todayStats) user.todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
    if (!user.stats) user.stats = { totalQuestions: 0, correctAnswers: 0, totalMinutes: 0, streakDays: 0, lastActiveDate: null };
    if (!user.studyDays) user.studyDays = {};
    
    // 重置今日统计（如果是新的一天）
    if (user.todayStats.date !== today) {
        user.todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
    }
    
    // 更新今日统计
    user.todayStats.questions += (questionCount || 0);
    user.todayStats.correct += (correctCount || 0);
    user.todayStats.minutes += (minutesSpent || 0);
    
    // 更新总统计
    user.stats.totalQuestions += (questionCount || 0);
    user.stats.correctAnswers += (correctCount || 0);
    user.stats.totalMinutes += (minutesSpent || 0);
    user.stats.lastActiveDate = new Date().toISOString();
    
    // 更新学习天数
    user.studyDays[today] = true;
    
    // 保存并刷新UI
    saveUserData(user);
    if (typeof updateTodayStats === 'function') updateTodayStats();
    if (typeof syncTodayStats === 'function') syncTodayStats();
};

function migrateData() {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData) {
        try {
            const parsed = JSON.parse(currentData);
            if (parsed && Array.isArray(parsed.users)) {
                // 修复重复ID：如果多个用户共享同一个ID，给后续用户分配唯一ID
                var idMap = {};
                var needSave = false;
                for (var i = 0; i < parsed.users.length; i++) {
                    var uid = parsed.users[i].id;
                    if (idMap[uid]) {
                        // 重复ID，生成新ID
                        var newId = 'user_' + Date.now() + '_' + i;
                        // 如果重复ID是当前用户，更新currentUser到第一个匹配的用户
                        if (parsed.currentUser === uid && parsed.users[0].id === uid) {
                            parsed.currentUser = uid; // 保留第一个
                        }
                        parsed.users[i].id = newId;
                        needSave = true;
                        console.log('修复重复ID:', uid, '->', newId, '(用户:', parsed.users[i].name + ')');
                    } else {
                        idMap[uid] = true;
                    }
                }
                if (needSave) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                    console.log('重复ID已修复并保存');
                }
                return;
            }
        } catch(e) {}
    }
    // 尝试从旧key迁移
    for (const key of OLD_KEYS) {
        try {
            const old = localStorage.getItem(key);
            if (old) {
                const parsed = JSON.parse(old);
                if (parsed && Array.isArray(parsed.users)) {
                    localStorage.setItem(STORAGE_KEY, old);
                    console.log('数据已迁移:', key, '->', STORAGE_KEY);
                    return;
                }
            }
        } catch(e) {}
    }
}

function calculateStreakDays(user) {
    if (!user.studyDays) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (user.studyDays[dateStr] && user.studyDays[dateStr] > 0) {
            streak++;
        } else if (i > 0) {
            // 不是今天，且没有学习记录，连续中断
            break;
        }
    }
    
    return streak;
}



// ============================================================
// Audio - 音频管理
// ============================================================

// Window exports for onclick handlers
window.clearAllData = clearAllData;
window.clearCurrentUserData = clearCurrentUserData;
window.resetApiConfig = resetApiConfig;
window.syncData = syncData;
window.saveUserData = saveUserData;


// ============================================================
// IndexedDB 视频文件持久化存储
// ============================================================

const VIDEO_DB_NAME = 'CognitiveTrainingVideoDB';
const VIDEO_DB_VERSION = 2; // 版本升级以支持图片存储
const VIDEO_STORE_NAME = 'videoFiles';
const IMAGE_STORE_NAME = 'imageFiles';

let videoDB = null;

// 初始化 IndexedDB
function initVideoDB() {
    return new Promise(function(resolve, reject) {
        if (videoDB) {
            resolve(videoDB);
            return;
        }
        
        if (!window.indexedDB) {
            console.warn('浏览器不支持 IndexedDB');
            reject(new Error('浏览器不支持 IndexedDB'));
            return;
        }
        
        var request = indexedDB.open(VIDEO_DB_NAME, VIDEO_DB_VERSION);
        
        request.onerror = function(e) {
            console.error('IndexedDB 打开失败:', e);
            reject(e);
        };
        
        request.onsuccess = function(e) {
            videoDB = e.target.result;
            console.log('IndexedDB 初始化成功');
            resolve(videoDB);
        };
        
        request.onupgradeneeded = function(e) {
            var db = e.target.result;
            // 创建视频文件存储仓库
            if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
                db.createObjectStore(VIDEO_STORE_NAME, { keyPath: 'videoId' });
            }
            // 创建图片文件存储仓库
            if (!db.objectStoreNames.contains(IMAGE_STORE_NAME)) {
                db.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'imageId' });
            }
            console.log('IndexedDB 升级完成');
        };
    });
}

// 存储视频文件到 IndexedDB
function saveVideoFile(videoId, blob) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.put({
                videoId: videoId,
                blob: blob,
                savedAt: new Date().toISOString()
            });
            
            request.onsuccess = function() {
                console.log('视频文件已保存:', videoId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('保存视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取视频文件
function getVideoFile(videoId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readonly');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.get(videoId);
            
            request.onsuccess = function() {
                var result = request.result;
                if (result) {
                    console.log('从 IndexedDB 读取视频:', videoId);
                    resolve(result.blob);
                } else {
                    console.warn('未找到视频文件:', videoId);
                    resolve(null);
                }
            };
            
            request.onerror = function(e) {
                console.error('读取视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 删除视频文件
function deleteVideoFile(videoId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.delete(videoId);
            
            request.onsuccess = function() {
                console.log('视频文件已删除:', videoId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('删除视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 清除所有视频文件
function clearAllVideoFiles() {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(VIDEO_STORE_NAME);
            
            var request = store.clear();
            
            request.onsuccess = function() {
                console.log('所有视频文件已清除');
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('清除视频文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// Window exports for video storage
window.initVideoDB = initVideoDB;
window.saveVideoFile = saveVideoFile;
window.getVideoFile = getVideoFile;
window.deleteVideoFile = deleteVideoFile;
window.clearAllVideoFiles = clearAllVideoFiles;

// ============================================================
// IndexedDB 图片文件持久化存储（用于错题本）
// ============================================================

// 存储图片文件到 IndexedDB
function saveImageFile(imageId, blob) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.put({
                imageId: imageId,
                blob: blob,
                savedAt: new Date().toISOString()
            });
            
            request.onsuccess = function() {
                console.log('图片文件已保存:', imageId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('保存图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取图片文件（返回 Promise<Blob>）
function getImageFile(imageId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.get(imageId);
            
            request.onsuccess = function() {
                var result = request.result;
                if (result) {
                    console.log('从 IndexedDB 读取图片:', imageId);
                    resolve(result.blob);
                } else {
                    console.warn('未找到图片文件:', imageId);
                    resolve(null);
                }
            };
            
            request.onerror = function(e) {
                console.error('读取图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 从 IndexedDB 读取图片并转换为 base64 DataURL
function getImageFileAsDataUrl(imageId) {
    return new Promise(function(resolve, reject) {
        getImageFile(imageId).then(function(blob) {
            if (blob) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(e) {
                    reject(e);
                };
                reader.readAsDataURL(blob);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}

// 从 IndexedDB 删除图片文件
function deleteImageFile(imageId) {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.delete(imageId);
            
            request.onsuccess = function() {
                console.log('图片文件已删除:', imageId);
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('删除图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// 清除所有图片文件
function clearAllImageFiles() {
    return new Promise(function(resolve, reject) {
        initVideoDB().then(function(db) {
            var transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            var store = transaction.objectStore(IMAGE_STORE_NAME);
            
            var request = store.clear();
            
            request.onsuccess = function() {
                console.log('所有图片文件已清除');
                resolve();
            };
            
            request.onerror = function(e) {
                console.error('清除图片文件失败:', e);
                reject(e);
            };
        }).catch(reject);
    });
}

// Window exports for image storage
window.saveImageFile = saveImageFile;
window.getImageFile = getImageFile;
window.getImageFileAsDataUrl = getImageFileAsDataUrl;
window.deleteImageFile = deleteImageFile;
window.clearAllImageFiles = clearAllImageFiles;

// 页面加载时初始化 IndexedDB
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoDB);
} else {
    initVideoDB();
}


// ===== js/utils.js =====
// 版本: V151

function showToast(message, duration = 2000) {
    const existing = document.getElementById('custom-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function cleanupModuleState() {
    // 停止所有游戏计时器
    if (typeof gameTimer !== 'undefined' && gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    if (typeof gameTimerDisplay !== 'undefined' && gameTimerDisplay) {
        clearInterval(gameTimerDisplay);
        gameTimerDisplay = null;
    }
    
    // 停止贪吃蛇计时器
    if (typeof snakeGame !== 'undefined' && snakeGame) {
        clearInterval(snakeGame);
        snakeGame = null;
    }
    
    // 停止俄罗斯方块计时器
    if (typeof tetrisGame !== 'undefined' && tetrisGame) {
        clearInterval(tetrisGame);
        tetrisGame = null;
    }
    
    // 停止打地鼠计时器
    if (typeof whackTimer !== 'undefined' && whackTimer) {
        clearInterval(whackTimer);
        whackTimer = null;
    }
    
    // 停止消消乐计时器
    if (typeof elimTimer !== 'undefined' && elimTimer) {
        clearInterval(elimTimer);
        elimTimer = null;
    }
    
    // 停止番茄钟计时器
    if (typeof pomodoroTimer !== 'undefined' && pomodoroTimer) {
        clearInterval(pomodoroTimer);
        pomodoroTimer = null;
    }
    
    // 清理游戏Canvas
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 停止音频播放
    if (typeof currentAudio !== 'undefined' && currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // 停止播客音频 - V150: 优先调用专用函数（先解绑事件再暂停，防止onended/podcastNext重新播放）
    if (typeof stopPodcastAudio === 'function') {
        stopPodcastAudio();
    } else {
        // 降级方案
        var hiddenAudio = document.getElementById('hidden-audio');
        if (hiddenAudio) {
            hiddenAudio.pause();
            hiddenAudio.currentTime = 0;
            hiddenAudio.src = '';
        }
        if (typeof podcastPlayerState !== 'undefined' && podcastPlayerState) {
            podcastPlayerState.isPlaying = false;
            podcastPlayerState.currentPodcast = null;
            podcastPlayerState.currentTime = 0;
        }
    }
    
    // 停止视频播放
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
    
    // 停止TTS朗读
    stopTTSSpeech();
    
    // 停止语音识别
    if (typeof isRecording !== 'undefined' && isRecording && typeof deepseekRecognition !== 'undefined' && deepseekRecognition) {
        deepseekRecognition.stop();
        isRecording = false;
    }
    
    // 清理DeepSeek图片
    if (typeof currentDeepSeekImage !== 'undefined' && currentDeepSeekImage) {
        currentDeepSeekImage = null;
    }
    
    // 关闭全屏音频播放器
    const audioPlayerFullscreen = document.getElementById('audio-player-fullscreen');
    if (audioPlayerFullscreen) {
        audioPlayerFullscreen.classList.remove('show');
    }
    
    // 关闭迷你播放器
    const miniPlayer = document.getElementById('mini-player');
    if (miniPlayer) {
        miniPlayer.classList.remove('show');
    }
    
    // 关闭视频全屏播放器
    const videoPlayerFullscreen = document.getElementById('enhanced-video-player');
    if (videoPlayerFullscreen) {
        videoPlayerFullscreen.style.display = 'none';
    }
    
    // 重置游戏全屏容器
    const gameFullscreen = document.getElementById('game-fullscreen-container');
    if (gameFullscreen) {
        gameFullscreen.style.display = 'none';
    }
    
    console.log('模块状态已清理');
}

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}

function openSettingsPanel() {
    const user = getCurrentUserData();
    if (user) {
        // 更新用户信息卡片
        const avatarEl = document.getElementById('settings-avatar');
        const nameEl = document.getElementById('settings-name');
        const gradeEl = document.getElementById('settings-grade');
        const diffEl = document.getElementById('settings-difficulty-display');
        const wrongCountEl = document.getElementById('settings-wrong-count');
        const trainCountEl = document.getElementById('settings-train-count');
        
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (nameEl) nameEl.textContent = user.name;
        if (gradeEl) gradeEl.textContent = gradeNames[user.grade] + ' · Lv.' + user.difficulty;
        if (diffEl) diffEl.textContent = 'Lv.' + user.difficulty;
        
        // 更新错题数量
        const wrongNotes = user.wrongNotes || [];
        if (wrongCountEl) wrongCountEl.textContent = '共 ' + wrongNotes.length + ' 道错题';
        
        // 更新训练次数
        const trainCount = user.trainCount || 8;
        if (trainCountEl) trainCountEl.value = trainCount;
        
        // 更新数据统计显示
        if (typeof updateDataStatsDisplay === 'function') {
            updateDataStatsDisplay();
        }
    }
    
    // 更新API配置状态显示
    if (typeof updateApiStatusDisplay === 'function') {
        updateApiStatusDisplay();
    }
    
    document.getElementById('settings-panel').style.display = 'block';
}

function closeSettingsPanel(e) {
    if (!e || e.target === document.getElementById('settings-panel')) {
        document.getElementById('settings-panel').style.display = 'none';
    }
}

function toggleSettingsGroup(groupId) {
    const group = document.getElementById('group-' + groupId);
    if (group) {
        group.classList.toggle('open');
    }
}

function exitSystem() {
    // 停止所有媒体
    if (typeof currentAudio !== 'undefined' && currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio.src = ''; }
    if (typeof evpVideo !== 'undefined' && evpVideo) { evpVideo.pause(); evpVideo.src = ''; }
    stopTTSSpeech();
    
    // 隐藏所有播放器
    var miniEl = document.getElementById('mini-player');
    var audioEl = document.getElementById('audio-player-fullscreen');
    var videoEl = document.getElementById('enhanced-video-player');
    if (miniEl) miniEl.classList.remove('show');
    if (audioEl) audioEl.classList.remove('show');
    if (videoEl) videoEl.style.display = 'none';
    
    // 关闭设置面板
    closeSettingsPanel();
    
    // 显示告别弹窗
    var user = getCurrentUserData();
    if (user) {
        showGoodbyeModal(user);
        // 延迟后执行退出
        setTimeout(function() { doExitSystem(); }, 3000);
    } else {
        doExitSystem();
    }
}

function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
            <div style="font-size:48px;margin-bottom:12px;">🧠</div>
            <div style="font-size:20px;font-weight:bold;color:#333;margin-bottom:8px;">认知训练门户</div>
            <div style="font-size:13px;color:#999;margin-bottom:20px;">版本 V144</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📱 产品介绍</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                认知训练门户是一款专为12-16岁青少年设计的注意力和记忆力训练应用。通过科学系统的训练方法，帮助学生提升学习效率，培养良好的学习习惯。
            </div>
        </div>
        <div style="background:#fff3e0;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">✨ 核心功能</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                • 12大训练模块（AI分身、母题、播客等）<br>
                • 23个认知训练游戏<br>
                • 378道经典母题库<br>
                • DeepSeek AI 智能辅导<br>
                • 个性化学习计划
            </div>
        </div>
        <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">👨‍💻 开发团队</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                Coze AI Agent 智能助手<br>
                技术支持：DeepSeek API
            </div>
        </div>
        <div style="text-align:center;font-size:12px;color:#999;margin-bottom:16px;">
            © 2026 认知训练门户 版权所有
        </div>
        <button class="modal-close" onclick="closeModal()" style="width:100%;">关闭</button>
    `;
}


// ===== "关于"页面函数（重写版本）=====
function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div style="text-align:center;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#3377FF,#FF9A63);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">🧠</div>
            <h2 style="font-size:20px;font-weight:bold;margin-bottom:8px;">认知训练门户</h2>
            <div style="color:#3377FF;font-size:14px;margin-bottom:20px;">V140</div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>产品介绍</strong></p>
                    <p style="font-size:13px;color:#666;">专为12-16岁青少年设计的科学认知训练系统，通过系统化的训练提升学习能力。</p>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;line-height:1.8;">
                    <p style="margin-bottom:12px;"><strong>Week1-7 训练目标</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week1-2:</strong> 注意力与记忆力基础 → 专注力提升30%</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week3-4:</strong> 数学思维与物理思维入门 → 逻辑推理能力提升</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week5:</strong> 系统性思维与守恒思维 → 跨学科整合能力</p>
                        <p style="margin-bottom:8px;"><strong style="color:#3377FF;">Week6:</strong> 学科深度整合与自主学习 → 独立学习能力</p>
                        <p style="margin-bottom:0;"><strong style="color:#3377FF;">Week7:</strong> 综合应用与创新思维 → 创造性解决问题能力</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:left;background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;color:#333;">
                    <p style="margin-bottom:8px;"><strong>核心功能</strong></p>
                    <div style="font-size:13px;color:#666;">
                        <p>• 12大训练模块</p>
                        <p>• 23个认知游戏</p>
                        <p>• DeepSeek AI智能辅导</p>
                    </div>
                </div>
            </div>
            
            <div style="text-align:center;color:#999;font-size:12px;margin-top:20px;">
                <p>开发团队：Coze AI Agent</p>
            </div>
        </div>
        <button onclick="closeModal()" style="width:100%;padding:14px;background:#3377FF;color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:16px;">关闭</button>
    `;
    modal.classList.add('show');
}
window.openAbout = openAbout;
window.closeSettingsPanel = closeSettingsPanel;
window.exitSystem = exitSystem;
window.openSettingsPanel = openSettingsPanel;
window.toggleSettingsGroup = toggleSettingsGroup;


// ============================================================
// User - 用户管理
// ============================================================

// ===== js/user.js =====
// 版本: V151

// 用户下拉菜单点击外部关闭
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('user-dropdown');
    const avatar = document.getElementById('header-avatar');
    if (dropdown && avatar) {
        if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});

const gradeNames = {5:'五年级',6:'六年级',7:'初一',8:'初二',9:'初三'};

function toggleUserMenu() {
    var el = document.getElementById('user-dropdown');
    if (el) {
        el.classList.toggle('show');
        // Add click-outside-to-close
        if (el.classList.contains('show')) {
            setTimeout(function() {
                document.addEventListener('click', closeUserMenuOutside);
            }, 10);
        }
    }
}

function closeUserMenuOutside(e) {
    var dropdown = document.getElementById('user-dropdown');
    var wrapper = document.querySelector('.user-menu-wrapper');
    if (dropdown && wrapper && !wrapper.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeUserMenuOutside);
    }
}

function showUserSwitchModal() {
    closeUserMenu();
    var data = loadData();
    
    if (data.users.length === 0) {
        showToast('暂无用户，请先创建账号');
        return;
    }
    
    if (data.users.length === 1) {
        showToast('只有一个用户：' + data.users[0].name + '，无需切换');
        return;
    }
    
    var container = document.getElementById('user-switch-list');
    if (!container) {
        showToast('页面加载异常');
        return;
    }
    
    var colors = ['#667eea', '#FF9A63', '#43E97B'];
    var htmlContent = '';
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:8px;padding:12px;background:' + (isCurrent ? '#f0f7ff' : 'white') + ';border-radius:12px;margin-bottom:8px;">';
        htmlContent += '<div onclick="switchToUser(\'' + u.id + '\')" style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer;">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div><div style="font-weight:600;">' + u.name + (isCurrent ? ' (当前)' : '') + '</div>';
        htmlContent += '<div style="font-size:12px;color:#999;">' + gradeNames[u.grade] + ' · Lv.' + u.difficulty + '</div></div></div>';
        if (!isCurrent) {
            htmlContent += '<button onclick="event.stopPropagation();deleteUser(\'' + u.id + '\')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('user-switch-modal').classList.add('show');
}

function showCreateUserModal() { document.getElementById('create-user-modal').classList.add('show'); }

function quickLogin(userId) {
    const data = loadData();
    const user = data.users.find(u => u.id === userId);
    if (!user) return;
    data.currentUser = userId;
    saveData(data);
    
    // 更新登录页元素
    const displayEl = document.getElementById('selected-user-display');
    const formEl = document.getElementById('login-form-section');
    const diffEl = document.getElementById('login-difficulty');
    const btn = document.querySelector('.user-select-btn');
    const dropdown = document.getElementById('user-select-dropdown');
    if (displayEl) displayEl.innerHTML = '<span>' + user.name.charAt(0) + '</span> ' + user.name;
    if (formEl) formEl.style.display = 'block';
    if (diffEl) diffEl.value = user.difficulty || 1;
    if (btn) btn.dataset.userId = userId;
    if (dropdown) dropdown.classList.remove('show');
    
    // 刷新主界面UI（如果主界面已加载）
    if (typeof updateUI === 'function') updateUI();
    if (typeof syncTodayStats === 'function') syncTodayStats();
    if (typeof renderUserList === 'function') renderUserList();
}

function openEditProfileModal() {
    const user = getCurrentUserData();
    if (user) {
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-grade').value = user.grade;
    }
    document.getElementById('edit-profile-modal').classList.add('show');
}

function openDifficultyModal() {
    const userData = getCurrentUserData();
    const currentLevel = userData ? userData.difficulty : 1;
    // 高亮当前选中的按钮
    document.querySelectorAll('.diff-btn').forEach(btn => {
        const isSelected = btn.dataset.level == currentLevel;
        btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
        btn.style.background = isSelected ? '#E8F4FF' : 'white';
    });
    document.getElementById('difficulty-modal').classList.add('show');
}

function openAvatarModal() {
    const user = getCurrentUserData();
    const modal = document.getElementById('avatar-modal');
    const content = document.getElementById('avatar-modal-content');
    
    if (!modal || !content) return;
    
    // 获取当前头像
    const currentAvatar = user ? user.avatar || AVATAR_LIST[0].emoji : AVATAR_LIST[0].emoji;
    
    let avatarHtml = '<div class="modal-title">🎨 选择头像</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">';
    
    AVATAR_LIST.forEach((avatar, index) => {
        const isSelected = avatar.emoji === currentAvatar;
        avatarHtml += `
            <div onclick="selectAvatar('${avatar.emoji}')" style="
                width:60px;height:60px;
                background:${avatar.gradient};
                border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                font-size:28px;
                cursor:pointer;
                border:${isSelected ? '3px solid #667eea' : '3px solid transparent'};
                box-shadow:${isSelected ? '0 4px 12px rgba(102,126,234,0.4)' : 'none'};
                transition:all 0.2s;
            ">${avatar.emoji}</div>
        `;
    });
    
    avatarHtml += '</div>';
    avatarHtml += '<button onclick="closeAvatarModal()" class="login-btn login-btn-secondary">取消</button>';
    
    content.innerHTML = avatarHtml;
    modal.classList.add('show');
    closeUserMenu();
}

function renderUserList() {
    const data = loadData();
    const container = document.getElementById('user-list-container');
    if (!container) return;
    const colors = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#FF9A63,#E87A4E)', 'linear-gradient(135deg,#43E97B,#38F9D7)'];
    const currentUserId = data.currentUser;
    container.innerHTML = data.users.length === 0 
        ? '<div style="padding:12px;text-align:center;color:var(--text-light);">暂无用户，请创建新账号</div>'
        : data.users.map((u, i) => `
            <div class="user-select-item" onclick="quickLogin('${u.id}')" style="${u.id === currentUserId ? 'background:#e8f4ff;border:1px solid #3377ff;' : ''}">
                <div class="item-avatar" style="background:${colors[i%3]};color:white;">${u.name.charAt(0)}</div>
                <div class="item-info">
                    <div class="item-name">${u.name} ${u.id === currentUserId ? '(当前)' : ''}</div>
                    <div class="item-grade">${gradeNames[u.grade]} · Lv.${u.difficulty}</div>
                </div>
            </div>
        `).join('');
}

function createNewUser() {
    var nameEl = document.getElementById('create-name');
    var gradeEl = document.getElementById('create-grade');
    var diffEl = document.getElementById('create-difficulty');
    
    var name = nameEl ? nameEl.value.trim() : '';
    var grade = gradeEl ? parseInt(gradeEl.value) : 7;
    var difficulty = diffEl ? parseInt(diffEl.value) : 1;
    
    if (!name) {
        showToast('请输入名字');
        return;
    }
    
    var data = loadData();
    
    // 检查名字是否重复
    if (data.users.some(function(u) { return u.name === name; })) {
        showToast('名字已存在，请换一个');
        return;
    }
    
    var newUser = {
        id: 'user_' + Date.now(),
        name: name,
        grade: grade,
        difficulty: difficulty,
        points: 1000,
        createdAt: new Date().toISOString(),
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            totalMinutes: 0,
            streakDays: 0,
            lastActiveDate: null
        },
        topicStats: {},
        weeklyProgress: {},
        wrongNotes: [],
        completedTopics: [],
        methodStats: {},
        thinkingStats: {},
        gameScores: {},
        gameCounts: {},
        gameTimes: {}
    };
    
    data.users.push(newUser);
    data.currentUser = newUser.id;
    saveData(data);
    
    closeCreateUserModal();
    
    // 同步所有模块数据
    updateUI();
    syncTodayStats();
    renderUserList();
    
    // 更新所有相关显示
    var headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) headerAvatar.textContent = name.charAt(0);
    
    var greetingName = document.getElementById('greeting-name');
    if (greetingName) greetingName.textContent = name;
    
    var dropdownName = document.getElementById('dropdown-name');
    if (dropdownName) dropdownName.textContent = name;
    
    var dropdownInfo = document.getElementById('dropdown-info');
    if (dropdownInfo) dropdownInfo.textContent = gradeNames[grade] + ' · Lv.' + difficulty;
    
    var difficultyText = document.getElementById('difficulty-text');
    if (difficultyText) difficultyText.textContent = 'Lv.' + difficulty;
    
    showToast('创建成功: ' + name);
    
    // 清空表单
    if (nameEl) nameEl.value = '';
}

function closeCreateUserModal() { document.getElementById('create-user-modal').classList.remove('show'); document.getElementById('create-name').value = ''; }

function closeUserSwitchModal() { document.getElementById('user-switch-modal').classList.remove('show'); }

function showDeleteUserModal() {
    closeUserMenu();
    var data = loadData();
    
    if (data.users.length === 0) {
        showToast('暂无用户');
        return;
    }
    
    if (data.users.length === 1) {
        showToast('只有一个用户，无法删除');
        return;
    }
    
    var container = document.getElementById('delete-user-list');
    if (!container) {
        showToast('页面加载异常');
        return;
    }
    
    var colors = ['#667eea', '#FF9A63', '#43E97B'];
    var htmlContent = '';
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:8px;padding:12px;background:' + (isCurrent ? '#f0f7ff' : 'white') + ';border-radius:12px;margin-bottom:8px;">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div style="flex:1;"><div style="font-weight:600;">' + u.name + (isCurrent ? ' (当前用户)' : '') + '</div>';
        htmlContent += '<div style="font-size:12px;color:#999;">' + gradeNames[u.grade] + ' · Lv.' + u.difficulty + '</div></div>';
        if (!isCurrent) {
            htmlContent += '<button onclick="confirmDeleteUser(\'' + u.id + '\')" style="padding:6px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        } else {
            htmlContent += '<span style="font-size:12px;color:#999;">不可删除</span>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('delete-user-modal').classList.add('show');
}

function closeDeleteUserModal() { 
    document.getElementById('delete-user-modal').classList.remove('show'); 
}

function confirmDeleteUser(userId) {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return;
    
    var data = loadData();
    var userIndex = data.users.findIndex(function(u) { return u.id === userId; });
    
    if (userIndex === -1) {
        showToast('用户不存在');
        return;
    }
    
    var userName = data.users[userIndex].name;
    data.users.splice(userIndex, 1);
    
    // 如果删除的是当前用户，切换到第一个用户
    if (data.currentUser === userId) {
        if (data.users.length > 0) {
            data.currentUser = data.users[0].id;
        } else {
            data.currentUser = null;
        }
    }
    
    saveData(data);
    
    // 刷新UI
    updateUI();
    syncTodayStats();
    renderUserList();
    
    // 如果只剩一个用户，关闭模态框
    if (data.users.length <= 1) {
        closeDeleteUserModal();
        showToast('已删除用户: ' + userName);
    } else {
        // 刷新删除用户列表
        showDeleteUserModal();
        showToast('已删除用户: ' + userName);
    }
}

function setDifficulty(level) {
    const userData = getCurrentUserData();
    if (userData) {
        userData.difficulty = level;
        syncUserData(userData);
        // 更新首页难度显示
        const diffText = document.getElementById('difficulty-text');
        if (diffText) diffText.textContent = 'Lv.' + level;
        // 更新设置面板难度显示
        const settingsDiff = document.getElementById('settings-difficulty-display');
        if (settingsDiff) settingsDiff.textContent = 'Lv.' + level;
        // 更新下拉菜单中的难度信息
        const dropInfoEl = document.getElementById('dropdown-info');
        if (dropInfoEl) {
            dropInfoEl.textContent = gradeNames[userData.grade] + ' · Lv.' + level;
        }
        // 高亮当前选中的按钮
        document.querySelectorAll('.diff-btn').forEach(btn => {
            const isSelected = btn.dataset.level == level;
            btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
            btn.style.background = isSelected ? '#E8F4FF' : 'white';
        });
        showToast('难度已调整为 Lv.' + level);
    }
    closeDifficultyModal();
}

function closeDifficultyModal() {
    document.getElementById('difficulty-modal').classList.remove('show');
}

function saveProfileChanges() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const newName = document.getElementById('edit-name').value.trim();
    const newGrade = parseInt(document.getElementById('edit-grade').value);
    
    if (!newName) {
        showToast('请输入姓名');
        return;
    }
    
    user.name = newName;
    user.grade = newGrade;
    syncUserData(user);
    
    // 更新所有UI
    updateUI();
    openSettingsPanel(); // 刷新设置面板
    closeEditProfileModal();
    showToast('个人信息已更新');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('show');
}

function savePasswordChanges() {
    const currentPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;
    
    if (!currentPwd || !newPwd || !confirmPwd) {
        showToast('请填写所有密码字段');
        return;
    }
    
    if (newPwd !== confirmPwd) {
        showToast('两次输入的新密码不一致');
        return;
    }
    
    if (newPwd.length < 6) {
        showToast('密码长度至少6位');
        return;
    }
    
    // 验证当前密码（简化版，实际应做密码验证）
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data.password && data.password !== currentPwd) {
        showToast('当前密码错误');
        return;
    }
    
    // 保存新密码
    data.password = newPwd;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    closeChangePasswordModal();
    showToast('密码修改成功');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('show');
}

function openApiConfigModal(type) {
    const config = getApiConfig();
    const modal = document.getElementById('api-config-modal');
    const content = document.getElementById('api-config-content');
    
    if (!modal || !content) return;
    
    if (type === 'deepseek') {
        content.innerHTML = `
            <div class="modal-title">🔑 DeepSeek API 配置</div>
            <div style="margin-bottom:16px;">
                <label style="font-size:13px;color:#666;display:block;margin-bottom:6px;">API Key</label>
                <input type="password" id="api-key-input" class="input-field" placeholder="请输入 DeepSeek API Key" value="${config.deepseek || ''}">
                <div style="font-size:11px;color:#999;margin-top:6px;">用于AI智能助手和所有AI功能</div>
            </div>
            <button onclick="saveApiConfigModal('deepseek')" class="login-btn login-btn-primary" style="margin-bottom:8px;">保存配置</button>
            <div style="margin-top:8px;">
                <button onclick="showAPIRechargeModal()" style="width:100%;padding:10px;background:linear-gradient(135deg,#667eea,#4facfe);color:white;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">💳 API平台充值</button>
            </div>
            <button onclick="closeApiConfigModal()" class="login-btn login-btn-secondary">取消</button>
        `;
    } else if (type === 'peerjs') {
        content.innerHTML = `
            <div class="modal-title">🔗 PeerJS 服务器配置</div>
            <div style="margin-bottom:16px;">
                <label style="font-size:13px;color:#666;display:block;margin-bottom:6px;">服务器地址</label>
                <input type="text" id="api-key-input" class="input-field" placeholder="请输入 PeerJS 服务器地址" value="${config.peerjs || '0.peerjs.com'}">
                <div style="font-size:11px;color:#999;margin-top:6px;">用于音视频通话功能</div>
            </div>
            <button onclick="saveApiConfigModal('peerjs')" class="login-btn login-btn-primary" style="margin-bottom:8px;">保存配置</button>
            <button onclick="closeApiConfigModal()" class="login-btn login-btn-secondary">取消</button>
        `;
    }
    
    modal.classList.add('show');
}

function selectAvatar(emoji) {
    const user = getCurrentUserData();
    if (user) {
        user.avatar = emoji;
        syncUserData(user);
        updateAllAvatarDisplays();
        showToast('头像已更换');
    }
    closeAvatarModal();
}

function openChangePasswordModal() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('change-password-modal').classList.add('show');
}



// ============================================================
// WeekPlans - 周计划数据
// ============================================================

// Window exports for onclick handlers
window.closeChangePasswordModal = closeChangePasswordModal;
window.closeCreateUserModal = closeCreateUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.closeDifficultyModal = closeDifficultyModal;
window.closeEditProfileModal = closeEditProfileModal;
window.closeUserMenu = closeUserMenu; // 从ui.js导入
window.closeUserSwitchModal = closeUserSwitchModal;
window.confirmDeleteUser = confirmDeleteUser;
window.createNewUser = createNewUser;
window.openApiConfigModal = openApiConfigModal;
window.openAvatarModal = openAvatarModal;
window.openChangePasswordModal = openChangePasswordModal;
window.openDifficultyModal = openDifficultyModal;
window.openEditProfileModal = openEditProfileModal;
window.savePasswordChanges = savePasswordChanges;
window.saveProfileChanges = saveProfileChanges;
window.showCreateUserModal = showCreateUserModal;
window.showDeleteUserModal = showDeleteUserModal;
window.showUserSwitchModal = showUserSwitchModal;
window.toggleUserMenu = toggleUserMenu;
window.selectAvatar = selectAvatar;
if (typeof selectGrade !== "undefined") window.selectGrade = selectGrade;

// ====== 管理用户功能 ======
function openManageUserModal() {
    var data = loadData();
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    modal.classList.add('show');
    
    var colors = ['#667eea', '#FF9A63', '#43E97B', '#f093fb', '#fa709a'];
    var htmlContent = '<div class="modal-title">👥 管理用户</div>';
    htmlContent += '<div style="margin-bottom:16px;">';
    
    if (data.users.length === 0) {
        htmlContent += '<div style="text-align:center;padding:20px;color:#999;">暂无用户</div>';
    }
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:' + (isCurrent ? '#f0f7ff' : '#f8f9fa') + ';border-radius:12px;margin-bottom:10px;border:' + (isCurrent ? '2px solid #3377ff' : '1px solid #eee') + ';">';
        htmlContent += '<div style="background:' + colors[i % colors.length] + ';color:white;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div style="flex:1;">';
        htmlContent += '<div style="font-weight:600;font-size:15px;">' + u.name + (isCurrent ? ' <span style="font-size:11px;color:#3377ff;">当前</span>' : '') + '</div>';
        htmlContent += '<div style="font-size:12px;color:#999;">' + (gradeNames ? gradeNames[u.grade] || '' : '') + ' · Lv.' + u.difficulty + ' · 积分 ' + (u.points || 0) + '</div>';
        htmlContent += '</div>';
        htmlContent += '<div style="display:flex;gap:6px;">';
        if (!isCurrent) {
            htmlContent += '<button onclick="switchToUser(\'' + u.id + '\');openManageUserModal();" style="padding:6px 10px;background:#3377ff;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">切换</button>';
            htmlContent += '<button onclick="deleteUser(\'' + u.id + '\');openManageUserModal();" style="padding:6px 10px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        } else {
            htmlContent += '<span style="font-size:11px;color:#999;padding:6px;">不可操作</span>';
        }
        htmlContent += '</div></div>';
    });
    
    htmlContent += '</div>';
    htmlContent += '<button onclick="showCreateUserModal()" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;margin-bottom:8px;">➕ 创建新用户</button>';
    htmlContent += '<button onclick="closeDetail()" style="width:100%;padding:12px;background:#f5f5f5;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>';
    
    content.innerHTML = htmlContent;
}

window.openManageUserModal = openManageUserModal;


// ===== js/data/week-plans.js =====
// 版本: V152

window.week5Plan = {
    weekId:'week5',weekTitle:'Week5：系统性思维与守恒思维综合周',
    weekDesc:'本周围绕系统性思维和守恒思维进行深度训练',
    days:[
        {day:1,title:'系统性思维入门',tasks:[
            {id:'w5d1t1',title:'学习系统思维概念',type:'video',duration:15,completed:false},
            {id:'w5d1t2',title:'完成系统性思维练习10题',type:'practice',duration:20,completed:false},
            {id:'w5d1t3',title:'用思维导图分析学校系统',type:'creative',duration:15,completed:false}
        ]},
        {day:2,title:'守恒思维训练',tasks:[
            {id:'w5d2t1',title:'学习守恒定律',type:'video',duration:15,completed:false},
            {id:'w5d2t2',title:'完成守恒思维练习10题',type:'practice',duration:20,completed:false},
            {id:'w5d2t3',title:'能量守恒案例分析',type:'creative',duration:15,completed:false}
        ]},
        {day:3,title:'综合应用',tasks:[
            {id:'w5d3t1',title:'观看综合案例分析',type:'video',duration:20,completed:false},
            {id:'w5d3t2',title:'完成综合练习15题',type:'practice',duration:25,completed:false},
            {id:'w5d3t3',title:'撰写学习反思',type:'writing',duration:15,completed:false}
        ]},
        {day:4,title:'思维导图深度应用',tasks:[
            {id:'w5d4t1',title:'学习高级思维导图技巧',type:'video',duration:15,completed:false},
            {id:'w5d4t2',title:'制作学科知识思维导图',type:'creative',duration:30,completed:false},
            {id:'w5d4t3',title:'同学互评思维导图',type:'social',duration:15,completed:false}
        ]},
        {day:5,title:'跨学科整合',tasks:[
            {id:'w5d5t1',title:'分析跨学科问题',type:'video',duration:20,completed:false},
            {id:'w5d5t2',title:'完成跨学科练习10题',type:'practice',duration:20,completed:false},
            {id:'w5d5t3',title:'小组讨论跨学科案例',type:'social',duration:20,completed:false}
        ]},
        {day:6,title:'知识整合与输出',tasks:[
            {id:'w5d6t1',title:'整理本周学习笔记',type:'review',duration:30,completed:false},
            {id:'w5d6t2',title:'完成本周测试',type:'test',duration:30,completed:false},
            {id:'w5d6t3',title:'制定下周学习计划',type:'planning',duration:15,completed:false}
        ]},
        {day:7,title:'周总结与复盘',tasks:[
            {id:'w5d7t1',title:'收听周度复盘播客',type:'podcast',duration:15,completed:false},
            {id:'w5d7t2',title:'完成Week5总结报告',type:'writing',duration:20,completed:false},
            {id:'w5d7t3',title:'休息与调整',type:'rest',duration:0,completed:false}
        ]}
    ]
};

window.week6Plan = {
    weekId:'week6',weekTitle:'Week6：学科深度整合与自主学习能力培养',
    weekDesc:'本周围绕学科整合和自主学习能力进行系统训练',
    days:[
        {day:1,title:'自主学习理念',tasks:[
            {id:'w6d1t1',title:'学习自主学习策略',type:'video',duration:20,completed:false},
            {id:'w6d1t2',title:'评估自己的学习风格',type:'quiz',duration:15,completed:false},
            {id:'w6d1t3',title:'制定个人学习方案',type:'planning',duration:20,completed:false}
        ]},
        {day:2,title:'深度阅读技巧',tasks:[
            {id:'w6d2t1',title:'学习SQ3R阅读法',type:'video',duration:15,completed:false},
            {id:'w6d2t2',title:'用SQ3R阅读一篇文章',type:'practice',duration:30,completed:false},
            {id:'w6d2t3',title:'分享阅读心得',type:'social',duration:15,completed:false}
        ]},
        {day:3,title:'笔记系统构建',tasks:[
            {id:'w6d3t1',title:'学习康奈尔笔记法',type:'video',duration:15,completed:false},
            {id:'w6d3t2',title:'用康奈尔法整理笔记',type:'practice',duration:30,completed:false},
            {id:'w6d3t3',title:'建立个人笔记系统',type:'creative',duration:20,completed:false}
        ]},
        {day:4,title:'时间管理实战',tasks:[
            {id:'w6d4t1',title:'学习番茄工作法',type:'video',duration:15,completed:false},
            {id:'w6d4t2',title:'完成4个番茄钟',type:'practice',duration:120,completed:false},
            {id:'w6d4t3',title:'总结番茄工作体验',type:'writing',duration:15,completed:false}
        ]},
        {day:5,title:'费曼学习法实践',tasks:[
            {id:'w6d5t1',title:'学习费曼学习法',type:'video',duration:15,completed:false},
            {id:'w6d5t2',title:'选择一个知识点讲解',type:'practice',duration:20,completed:false},
            {id:'w6d5t3',title:'反思讲解过程',type:'writing',duration:15,completed:false}
        ]},
        {day:6,title:'学科整合训练',tasks:[
            {id:'w6d6t1',title:'完成学科整合练习',type:'practice',duration:40,completed:false},
            {id:'w6d6t2',title:'制作跨学科知识图谱',type:'creative',duration:30,completed:false},
            {id:'w6d6t3',title:'参与学习讨论',type:'social',duration:20,completed:false}
        ]},
        {day:7,title:'Week6总结与展望',tasks:[
            {id:'w6d7t1',title:'完成学习能力评估',type:'quiz',duration:20,completed:false},
            {id:'w6d7t2',title:'撰写成长记录',type:'writing',duration:30,completed:false},
            {id:'w6d7t3',title:'制定长期学习规划',type:'planning',duration:20,completed:false}
        ]}
    ]
};

window.week1Plan = {
    weekId:'week1',weekTitle:'Week1：注意力与记忆力基础训练周',
    weekDesc:'建立每日训练习惯，掌握基础注意力与记忆力训练方法，学习记忆宫殿、费曼技巧等科学方法',
    days:[
        {day:1,title:'视觉注意力基础训练',tasks:[
            {id:'w1d1t1',title:'视觉追踪训练',type:'attention',duration:7,completed:false},
            {id:'w1d1t2',title:'图片记忆训练',type:'memory',duration:7,completed:false},
            {id:'w1d1t3',title:'记忆宫殿法学习与实践',type:'strategy',duration:6,completed:false}
        ]},
        {day:2,title:'听觉注意力强化',tasks:[
            {id:'w1d2t1',title:'听觉警觉与声音识别',type:'attention',duration:7,completed:false},
            {id:'w1d2t2',title:'故事记忆与词语链训练',type:'memory',duration:7,completed:false},
            {id:'w1d2t3',title:'费曼技巧学习与实践',type:'strategy',duration:6,completed:false}
        ]},
        {day:3,title:'短时记忆扩展训练',tasks:[
            {id:'w1d3t1',title:'视觉对比与持续注意',type:'attention',duration:7,completed:false},
            {id:'w1d3t2',title:'位置记忆与图片联想',type:'memory',duration:7,completed:false},
            {id:'w1d3t3',title:'间隔重复法学习与实践',type:'strategy',duration:6,completed:false}
        ]},
        {day:4,title:'反应速度与信息处理',tasks:[
            {id:'w1d4t1',title:'快速反应与警觉训练',type:'attention',duration:7,completed:false},
            {id:'w1d4t2',title:'瞬时记忆与简单配对',type:'memory',duration:7,completed:false},
            {id:'w1d4t3',title:'番茄工作法学习与实践',type:'strategy',duration:6,completed:false}
        ]},
        {day:5,title:'综合认知能力训练',tasks:[
            {id:'w1d5t1',title:'综合注意控制挑战',type:'attention',duration:7,completed:false},
            {id:'w1d5t2',title:'综合记忆策略应用',type:'memory',duration:7,completed:false},
            {id:'w1d5t3',title:'学习策略整合应用',type:'strategy',duration:6,completed:false}
        ]},
        {day:6,title:'复习与巩固',tasks:[
            {id:'w1d6t1',title:'自主选择弱项模块复习',type:'review',duration:15,completed:false},
            {id:'w1d6t2',title:'尝试提升难度级别',type:'practice',duration:10,completed:false},
            {id:'w1d6t3',title:'深化记忆策略练习',type:'strategy',duration:10,completed:false}
        ]},
        {day:7,title:'周度复盘',tasks:[
            {id:'w1d7t1',title:'查看本周训练数据',type:'review',duration:10,completed:false},
            {id:'w1d7t2',title:'反思有效策略与方法',type:'writing',duration:10,completed:false},
            {id:'w1d7t3',title:'制定Week2训练目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};
CTM.registerPlan('week1', week1Plan);

// ===== Week2训练计划 =====
window.week2Plan = {
    weekId:'week2',weekTitle:'Week2：学霸方法与听课习惯培养周',
    weekDesc:'深化注意力与记忆力训练，引入学霸学习方法专题和听课习惯培养',
    days:[
        {day:1,title:'高级视觉注意与知识建构',tasks:[
            {id:'w2d1t1',title:'多目标视觉追踪训练',type:'attention',duration:7,completed:false},
            {id:'w2d1t2',title:'复杂图像记忆与分类提取',type:'memory',duration:7,completed:false},
            {id:'w2d1t3',title:'学霸专题：深度理解与概念图构建',type:'strategy',duration:8,completed:false}
        ]},
        {day:2,title:'听觉注意与听课习惯',tasks:[
            {id:'w2d2t1',title:'多声源定位与模式识别',type:'attention',duration:7,completed:false},
            {id:'w2d2t2',title:'序列记忆扩展与刷新',type:'memory',duration:7,completed:false},
            {id:'w2d2t3',title:'听课习惯：课前预习与课中专注',type:'strategy',duration:8,completed:false}
        ]},
        {day:3,title:'多任务注意与解题策略',tasks:[
            {id:'w2d3t1',title:'双重任务协调与切换',type:'attention',duration:7,completed:false},
            {id:'w2d3t2',title:'空间记忆扩展与策略应用',type:'memory',duration:7,completed:false},
            {id:'w2d3t3',title:'学霸专题：高效解题策略与错题分析',type:'strategy',duration:8,completed:false}
        ]},
        {day:4,title:'冲突抑制与复习习惯',tasks:[
            {id:'w2d4t1',title:'Stroop冲突抑制训练',type:'attention',duration:7,completed:false},
            {id:'w2d4t2',title:'语义关联记忆与信息整合',type:'memory',duration:7,completed:false},
            {id:'w2d4t3',title:'听课习惯：课后复习与笔记整理',type:'strategy',duration:8,completed:false}
        ]},
        {day:5,title:'综合认知控制与学习方法整合',tasks:[
            {id:'w2d5t1',title:'综合认知负荷管理',type:'attention',duration:7,completed:false},
            {id:'w2d5t2',title:'记忆策略体系构建',type:'memory',duration:7,completed:false},
            {id:'w2d5t3',title:'考试技巧与长期学习规划',type:'strategy',duration:8,completed:false}
        ]},
        {day:6,title:'复习与自主强化',tasks:[
            {id:'w2d6t1',title:'自主选择弱项模块复习',type:'review',duration:15,completed:false},
            {id:'w2d6t2',title:'挑战提升难度级别',type:'practice',duration:10,completed:false},
            {id:'w2d6t3',title:'学霸方法组合应用练习',type:'strategy',duration:10,completed:false}
        ]},
        {day:7,title:'周度复盘与学霸方法评估',tasks:[
            {id:'w2d7t1',title:'查看本周训练与学霸方法数据',type:'review',duration:10,completed:false},
            {id:'w2d7t2',title:'评估听课习惯应用效果',type:'writing',duration:10,completed:false},
            {id:'w2d7t3',title:'制定Week3训练目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};
CTM.registerPlan('week2', week2Plan);

// ===== Week3训练计划 =====
window.week3Plan = {
    weekId:'week3',weekTitle:'Week3：数学物理思维系统化整合入门周',
    weekDesc:'完成从基础认知训练向学科思维训练的过渡，系统化引入数学物理思维双轨训练',
    days:[
        {day:1,title:'数学思维入门-逻辑推理基础',tasks:[
            {id:'w3d1t1',title:'逻辑推理游戏基础训练',type:'game',duration:10,completed:false},
            {id:'w3d1t2',title:'抽象思维意识建立',type:'practice',duration:10,completed:false},
            {id:'w3d1t3',title:'数形结合初步能力训练',type:'practice',duration:10,completed:false}
        ]},
        {day:2,title:'数学思维专项-逻辑谜题与逆向推理',tasks:[
            {id:'w3d2t1',title:'逻辑谜题挑战训练',type:'game',duration:10,completed:false},
            {id:'w3d2t2',title:'逆向思维基础训练',type:'practice',duration:10,completed:false},
            {id:'w3d2t3',title:'反证法初步学习',type:'strategy',duration:10,completed:false}
        ]},
        {day:3,title:'物理思维入门-模型构建基础',tasks:[
            {id:'w3d3t1',title:'物理模型构建概念学习',type:'video',duration:10,completed:false},
            {id:'w3d3t2',title:'理想化思维习惯训练',type:'practice',duration:10,completed:false},
            {id:'w3d3t3',title:'简单实验思维方法',type:'practice',duration:10,completed:false}
        ]},
        {day:4,title:'物理思维专项-现象探索与逆向分析',tasks:[
            {id:'w3d4t1',title:'物理现象探索训练',type:'practice',duration:10,completed:false},
            {id:'w3d4t2',title:'逆向分析法应用',type:'practice',duration:10,completed:false},
            {id:'w3d4t3',title:'物理因果推理训练',type:'practice',duration:10,completed:false}
        ]},
        {day:5,title:'数学物理综合应用',tasks:[
            {id:'w3d5t1',title:'数学物理交叉问题基础',type:'practice',duration:15,completed:false},
            {id:'w3d5t2',title:'数形结合实战训练',type:'game',duration:10,completed:false},
            {id:'w3d5t3',title:'听课习惯：课堂思维跟进',type:'strategy',duration:10,completed:false}
        ]},
        {day:6,title:'复习巩固-逻辑与建模能力强化',tasks:[
            {id:'w3d6t1',title:'逻辑推理能力强化',type:'review',duration:15,completed:false},
            {id:'w3d6t2',title:'物理建模能力巩固',type:'review',duration:10,completed:false},
            {id:'w3d6t3',title:'学霸方法：深度理解应用',type:'strategy',duration:10,completed:false}
        ]},
        {day:7,title:'Week3复盘报告与评估',tasks:[
            {id:'w3d7t1',title:'查看本周数学物理思维数据',type:'review',duration:10,completed:false},
            {id:'w3d7t2',title:'反思逻辑与建模进步',type:'writing',duration:10,completed:false},
            {id:'w3d7t3',title:'制定Week4训练目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};
CTM.registerPlan('week3', week3Plan);

// ===== Week4训练计划 =====
window.week4Plan = {
    weekId:'week4',weekTitle:'Week4：解题策略与实验思维深化周',
    weekDesc:'系统深化解题策略与实验思维能力，培养科学探究习惯与逆向思维进阶应用',
    days:[
        {day:1,title:'数学思维专项-解题策略系统训练',tasks:[
            {id:'w4d1t1',title:'题型分类方法学习',type:'strategy',duration:10,completed:false},
            {id:'w4d1t2',title:'解题步骤系统化训练',type:'practice',duration:15,completed:false},
            {id:'w4d1t3',title:'错题本科学用法实践',type:'strategy',duration:10,completed:false}
        ]},
        {day:2,title:'物理思维入门-实验设计基础',tasks:[
            {id:'w4d2t1',title:'实验设计原则学习',type:'video',duration:10,completed:false},
            {id:'w4d2t2',title:'简单实验设计练习',type:'practice',duration:15,completed:false},
            {id:'w4d2t3',title:'听课习惯：实验笔记记录',type:'strategy',duration:10,completed:false}
        ]},
        {day:3,title:'物理思维专项-实验思维系统培养',tasks:[
            {id:'w4d3t1',title:'数据分析方法训练',type:'practice',duration:10,completed:false},
            {id:'w4d3t2',title:'误差分析意识建立',type:'practice',duration:10,completed:false},
            {id:'w4d3t3',title:'实验设计综合训练',type:'game',duration:10,completed:false}
        ]},
        {day:4,title:'数学思维深化-逆向推理进阶',tasks:[
            {id:'w4d4t1',title:'反证法进阶应用',type:'practice',duration:10,completed:false},
            {id:'w4d4t2',title:'复杂问题逆向分析',type:'practice',duration:15,completed:false},
            {id:'w4d4t3',title:'多角度逆向推理训练',type:'game',duration:10,completed:false}
        ]},
        {day:5,title:'数学物理综合-交叉问题进阶',tasks:[
            {id:'w4d5t1',title:'数学物理交叉问题进阶',type:'practice',duration:15,completed:false},
            {id:'w4d5t2',title:'综合解题策略应用',type:'practice',duration:10,completed:false},
            {id:'w4d5t3',title:'学霸方法：考试技巧初步',type:'strategy',duration:10,completed:false}
        ]},
        {day:6,title:'复习巩固-解题策略与实验思维',tasks:[
            {id:'w4d6t1',title:'解题策略体系回顾',type:'review',duration:15,completed:false},
            {id:'w4d6t2',title:'实验思维方法巩固',type:'review',duration:10,completed:false},
            {id:'w4d6t3',title:'听课习惯：系统化复习法',type:'strategy',duration:10,completed:false}
        ]},
        {day:7,title:'Week4复盘报告与评估',tasks:[
            {id:'w4d7t1',title:'查看本周解题策略与实验数据',type:'review',duration:10,completed:false},
            {id:'w4d7t2',title:'评估解题能力进步',type:'writing',duration:10,completed:false},
            {id:'w4d7t3',title:'制定Week5训练目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};
CTM.registerPlan('week4', week4Plan);

// ===== Week7训练计划 =====
window.week7Plan = {
    weekId:'week7',weekTitle:'Week7：元认知深化与综合能力迁移周',
    weekDesc:'元认知深化+习惯固化+能力迁移三轨并行，实现从"知道方法"到"自动化运用"的跨越',
    days:[
        {day:1,title:'元认知深化-从意识到到调控好',tasks:[
            {id:'w7d1t1',title:'元认知监控训练',type:'practice',duration:10,completed:false},
            {id:'w7d1t2',title:'思维过程自我调节',type:'strategy',duration:10,completed:false},
            {id:'w7d1t3',title:'学习策略主动调控',type:'strategy',duration:10,completed:false}
        ]},
        {day:2,title:'自主学习习惯固化-让计划成为自然',tasks:[
            {id:'w7d2t1',title:'计划-执行-复盘闭环训练',type:'practice',duration:15,completed:false},
            {id:'w7d2t2',title:'自我管理效率优化',type:'strategy',duration:10,completed:false},
            {id:'w7d2t3',title:'学习节奏自然化练习',type:'strategy',duration:10,completed:false}
        ]},
        {day:3,title:'能力迁移专项-从训练场到真实战场',tasks:[
            {id:'w7d3t1',title:'认知策略迁移训练',type:'practice',duration:15,completed:false},
            {id:'w7d3t2',title:'学科场景应用实战',type:'practice',duration:10,completed:false},
            {id:'w7d3t3',title:'真实问题解决模拟',type:'game',duration:10,completed:false}
        ]},
        {day:4,title:'综合能力整合-融会贯通',tasks:[
            {id:'w7d4t1',title:'多策略综合应用训练',type:'practice',duration:15,completed:false},
            {id:'w7d4t2',title:'跨学科问题系统解决',type:'practice',duration:10,completed:false},
            {id:'w7d4t3',title:'学霸方法内化训练',type:'strategy',duration:10,completed:false}
        ]},
        {day:5,title:'真实场景实战-学校作业中的超能力',tasks:[
            {id:'w7d5t1',title:'学校作业场景模拟',type:'practice',duration:15,completed:false},
            {id:'w7d5t2',title:'考试策略实战应用',type:'practice',duration:10,completed:false},
            {id:'w7d5t3',title:'学习-训练良性互动',type:'strategy',duration:10,completed:false}
        ]},
        {day:6,title:'周度复盘与自我评估',tasks:[
            {id:'w7d6t1',title:'综合能力自我评估',type:'review',duration:15,completed:false},
            {id:'w7d6t2',title:'学习进化反思与记录',type:'writing',duration:10,completed:false},
            {id:'w7d6t3',title:'个人学习操作系统构建',type:'creative',duration:15,completed:false}
        ]},
        {day:7,title:'Week7复盘报告与Week8展望',tasks:[
            {id:'w7d7t1',title:'查看Week7综合数据',type:'review',duration:10,completed:false},
            {id:'w7d7t2',title:'撰写7周训练总结',type:'writing',duration:15,completed:false},
            {id:'w7d7t3',title:'制定Week8进阶目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};


// ===== Week8训练计划 =====
window.week8Plan = {
    weekId:'week8',weekTitle:'Week8：元认知高阶应用与学业实战整合周',
    weekDesc:'元认知高阶应用+学业实战整合+效率优化三轨并行，实现从"监控调控"到"预测预防"的升级',
    days:[
        {day:1,title:'元认知高阶应用 - 预测性监控与预防性调节',tasks:[
            {id:'w8d1t1',title:'预测性监控训练 - 规律识别与预警指标',type:'practice',duration:10,completed:false},
            {id:'w8d1t2',title:'预防性调节策略库应用',type:'strategy',duration:10,completed:false},
            {id:'w8d1t3',title:'学习状态预测表制定',type:'strategy',duration:10,completed:false}
        ]},
        {day:2,title:'期末复习策略系统准备 - 为学业评估做规划',tasks:[
            {id:'w8d2t1',title:'复习目标拆解训练',type:'strategy',duration:10,completed:false},
            {id:'w8d2t2',title:'复习时间规划与分配',type:'planning',duration:10,completed:false},
            {id:'w8d2t3',title:'复习优先级矩阵应用',type:'strategy',duration:10,completed:false}
        ]},
        {day:3,title:'学业实战整合深化 - 真题思维与综合应用',tasks:[
            {id:'w8d3t1',title:'真题思维四步法训练',type:'practice',duration:15,completed:false},
            {id:'w8d3t2',title:'综合问题拆解练习',type:'practice',duration:10,completed:false},
            {id:'w8d3t3',title:'数学物理综合思维应用',type:'strategy',duration:10,completed:false}
        ]},
        {day:4,title:'自主学习效率优化 - 流程简化与工具升级',tasks:[
            {id:'w8d4t1',title:'学习流程效率审计',type:'practice',duration:10,completed:false},
            {id:'w8d4t2',title:'学习工具升级与优化',type:'strategy',duration:10,completed:false},
            {id:'w8d4t3',title:'时间块管理实战',type:'practice',duration:10,completed:false}
        ]},
        {day:5,title:'个性化学习体系建立 - 形成自己的学习系统',tasks:[
            {id:'w8d5t1',title:'Week1-8能力盘点',type:'review',duration:10,completed:false},
            {id:'w8d5t2',title:'个性化学习体系设计',type:'creative',duration:15,completed:false},
            {id:'w8d5t3',title:'个人学习工具包构建',type:'strategy',duration:10,completed:false}
        ]},
        {day:6,title:'周度复盘与自我评估 - 学业实战的阶段总结',tasks:[
            {id:'w8d6t1',title:'Week8成长记录与评估',type:'review',duration:10,completed:false},
            {id:'w8d6t2',title:'学业实战阶段评估',type:'writing',duration:10,completed:false},
            {id:'w8d6t3',title:'效率优化总结与改进',type:'writing',duration:10,completed:false}
        ]},
        {day:7,title:'Week8复盘报告与Week9展望',tasks:[
            {id:'w8d7t1',title:'Week8复盘报告生成',type:'writing',duration:15,completed:false},
            {id:'w8d7t2',title:'个人学习体系评估',type:'review',duration:10,completed:false},
            {id:'w8d7t3',title:'制定Week9进阶目标',type:'strategy',duration:5,completed:false}
        ]}
    ]
};
CTM.registerPlan('week8', week8Plan);

window.week9Plan = {
    weekId:'week9',weekTitle:'Week9：元认知自动化与学业冲刺深化周',
    weekDesc:'在Week8基础上实现元认知自动化运行+期末冲刺实战深化+个性化体系完善+长期学习规划的四维升级',
    days:[
        {day:1,title:'元认知自动化 - 预测预防的常态化运行',tasks:[
            {id:'w9d1t1',title:'自动化触发条件设置 - 学习场景自动检查点',type:'practice',duration:15,completed:false},
            {id:'w9d1t2',title:'预警阈值校准 - 根据个人特点调整敏感度',type:'planning',duration:15,completed:false},
            {id:'w9d1t3',title:'条件反射建立 - 问题→预警→调节自动化',type:'writing',duration:10,completed:false}
        ]},
        {day:2,title:'期末冲刺策略深化 - 高效复习与提分技巧',tasks:[
            {id:'w9d2t1',title:'提分目标精准化 - 确定重点提分科目知识点',type:'planning',duration:15,completed:false},
            {id:'w9d2t2',title:'高效复习方法 - 重点突破与知识网络化',type:'practice',duration:20,completed:false},
            {id:'w9d2t3',title:'错题利用最大化 - 分类重做与规律提炼',type:'review',duration:15,completed:false}
        ]},
        {day:3,title:'学业冲刺实战深化 - 真题模拟与应试策略',tasks:[
            {id:'w9d3t1',title:'真题模拟训练 - 严格模拟真实考试场景',type:'practice',duration:30,completed:false},
            {id:'w9d3t2',title:'应试策略优化 - 时间分配与答题顺序',type:'planning',duration:15,completed:false},
            {id:'w9d3t3',title:'考试状态管理 - 考前考中状态调控',type:'relax',duration:15,completed:false}
        ]},
        {day:4,title:'个性化学习体系优化 - 持续改进与精准调整',tasks:[
            {id:'w9d4t1',title:'体系运行评估 - 六大系统效果评估',type:'review',duration:20,completed:false},
            {id:'w9d4t2',title:'瓶颈问题识别 - 根因分析与影响评估',type:'practice',duration:20,completed:false},
            {id:'w9d4t3',title:'精准优化调整 - 短期中期长期优化方案',type:'creative',duration:15,completed:false}
        ]},
        {day:5,title:'长期学习规划能力 - 学期目标与假期规划',tasks:[
            {id:'w9d5t1',title:'学期目标制定 - SMART原则应用',type:'planning',duration:20,completed:false},
            {id:'w9d5t2',title:'目标分解方法 - 金字塔分解与月周里程碑',type:'practice',duration:15,completed:false},
            {id:'w9d5t3',title:'假期学习规划 - 三三制与劳逸结合',type:'creative',duration:15,completed:false}
        ]},
        {day:6,title:'冲刺阶段学习方法应用',tasks:[
            {id:'w9d6t1',title:'数学物理冲刺思维 - 题型归类与快速破题',type:'practice',duration:25,completed:false},
            {id:'w9d6t2',title:'考试时间管理 - 如何做到既快又准',type:'planning',duration:15,completed:false},
            {id:'w9d6t3',title:'难题抢分技巧 - 不会做也能拿步骤分',type:'review',duration:10,completed:false}
        ]},
        {day:7,title:'Week9总结与未来展望',tasks:[
            {id:'w9d7t1',title:'Week9复盘报告生成',type:'writing',duration:15,completed:false},
            {id:'w9d7t2',title:'9周训练成果总结与能力评估',type:'review',duration:15,completed:false},
            {id:'w9d7t3',title:'制定下阶段深度学习目标',type:'planning',duration:10,completed:false}
        ]}
    ]
};
CTM.registerPlan('week9', week9Plan);


// ===== Week Plans 映射 =====
window.weekPlans = {
    week1: week1Plan,
    week2: week2Plan,
    week3: week3Plan,
    week4: week4Plan,
    week5: week5Plan,
    week6: week6Plan,
    week7: week7Plan,
    week8: week8Plan,
    week9: week9Plan
};


// ============================================================
// Topics - 训练主题数据
// ============================================================

// ===== js/data/topics.js =====
window.topicsMath5 = [
    {id:101,title:'小数加减法',diff:2,q:'计算：3.25+1.75=',a:'5',e:'对齐小数点相加'},
    {id:102,title:'小数乘法',diff:2,q:'计算：0.5×0.4=',a:'0.2',e:'按整数乘法计算后点小数点'},
    {id:103,title:'小数除法',diff:3,q:'计算：4.8÷0.6=',a:'8',e:'被除数和除数同时扩大10倍'},
    {id:104,title:'面积计算',diff:2,q:'长方形长5cm，宽3cm，面积是？',a:'15cm²',e:'面积=长×宽'},
    {id:105,title:'三角形面积',diff:3,q:'底8cm，高5cm的三角形面积是？',a:'20cm²',e:'面积=底×高÷2'},
    {id:106,title:'平行四边形面积',diff:3,q:'底6cm，高4cm，平行四边形面积是？',a:'24cm²',e:'面积=底×高'},
    {id:107,title:'分数意义',diff:2,q:'把一个蛋糕平均分成5份，取2份，用分数表示？',a:'2/5',e:'分子表示取的份数'},
    {id:108,title:'分数加减法',diff:3,q:'计算：1/3+1/6=',a:'1/2',e:'通分后相加'},
    {id:109,title:'公倍数',diff:3,q:'4和6的最小公倍数是？',a:'12',e:'列举法或短除法'},
    {id:110,title:'公因数',diff:3,q:'12和18的最大公因数是？',a:'6',e:'列举法或短除法'},
    {id:111,title:'方程初步',diff:2,q:'解方程：x+3=10',a:'x=7',e:'移项得x=10-3'},
    {id:112,title:'列方程解应用',diff:3,q:'小明有x本书，小红有15本，两人共25本，求x',a:'x=10',e:'x+15=25'},
    {id:113,title:'可能性',diff:2,q:'盒中有3红2白球，摸到红球的可能性是？',a:'3/5',e:'摸到红球次数/总次数'},
    {id:114,title:'统计图表',diff:2,q:'平均数怎么求？',a:'总数÷个数',e:'平均数=总和÷数量'},
    {id:115,title:'角的度量',diff:2,q:'直角是多少度？',a:'90°',e:'直角等于90度'},
    {id:116,title:'多边形内角和',diff:3,q:'五边形的内角和是？',a:'540°',e:'(5-2)×180°'},
    {id:117,title:'植树问题',diff:4,q:'在100米路两旁种树，每隔10米一棵，共几棵？',a:'22棵',e:'两端都种：棵数=段数+1'},
    {id:118,title:'周期问题',diff:3,q:'1,2,3循环排列，第10个是？',a:'1',e:'10÷3=3余1'},
    {id:119,title:'简便运算',diff:3,q:'125×8×4=',a:'4000',e:'125×8=1000'},
    {id:120,title:'体积计算',diff:3,q:'长方体长4cm，宽3cm，高2cm，体积是？',a:'24cm³',e:'体积=长×宽×高'},
    {id:121,title:'单位换算',diff:2,q:'2.5小时=多少分钟？',a:'150分钟',e:'2.5×60=150'},

    {id:122,title:'数的整除',diff:3,q:'在1-100中，既能被3整除又能被5整除的数有？',a:'33,66,99',e:'能被15整除的数'},
    {id:123,title:'最大公因数应用',diff:4,q:'用正方形地砖铺房间，长36dm宽24dm，最小需几块？',a:'6块',e:'36和24的最大公因数是12'},
    {id:124,title:'分数比大小',diff:2,q:'比较大小：3/5 ○ 5/8',a:'3/5 < 5/8',e:'通分后比较'}

    // ===== V144新增题目 =====
    ,{id:125,title:'小数乘法竖式',diff:2,q:'计算：3.7×2.5=',a:'9.25',e:'按整数乘法计算后点小数点，共三位小数'}
    ,{id:126,title:'小数除法竖式',diff:3,q:'计算：15.6÷0.24=',a:'65',e:'被除数和除数同时扩大100倍'}
    ,{id:127,title:'解方程',diff:3,q:'解方程：3x-7=14',a:'x=7',e:'3x=21,x=7'}
    ,{id:128,title:'列方程解应用',diff:3,q:'水果店卖出苹果x箱，梨比苹果少8箱，梨卖了15箱，求x',a:'x=23',e:'x-8=15,x=23'}
    ,{id:129,title:'三角形面积',diff:3,q:'底12cm，高8cm的三角形面积是？',a:'48cm²',e:'12×8÷2=48'}
    ,{id:130,title:'梯形面积',diff:3,q:'上底4cm，下底6cm，高5cm的梯形面积是？',a:'25cm²',e:'(4+6)×5÷2=25'}
    ,{id:131,title:'组合图形面积',diff:4,q:'长方形长8cm宽6cm，中间挖去一个底4cm高3cm的三角形，剩余面积是？',a:'42cm²',e:'8×6-4×3÷2=48-6=42'}
    ,{id:132,title:'2/3/5倍数',diff:2,q:'既是2的倍数又是3的倍数的最小三位数是？',a:'102',e:'6的倍数中找最小三位数'}
    ,{id:133,title:'因数倍数',diff:3,q:'24的全部因数有哪些？',a:'1,2,3,4,6,8,12,24',e:'逐个列举'}
    ,{id:134,title:'质数合数',diff:3,q:'20以内的质数有几个？分别是？',a:'8个，2,3,5,7,11,13,17,19',e:'只有1和本身两个因数'}
    ,{id:135,title:'分数意义',diff:2,q:'把3块蛋糕平均分给4个人，每人分到几分之几块？',a:'3/4块',e:'总蛋糕÷人数'}
    ,{id:136,title:'假分数带分数',diff:3,q:'把8/3化成带分数',a:'2又2/3',e:'8÷3=2余2'}
    ,{id:137,title:'分数基本性质',diff:3,q:'把2/5的分子扩大3倍，分母应怎样变化才能等于原分数？',a:'分母也扩大3倍',e:'分子分母同乘以3'}
    ,{id:138,title:'通分约分',diff:3,q:'比较3/8和5/12大小',a:'3/8 < 5/12',e:'通分后为9/24和10/24'}
    ,{id:139,title:'分数加减法',diff:3,q:'计算：5/6 - 1/4 =',a:'7/12',e:'通分为20/24-6/24=14/24=7/12'}
    ,{id:140,title:'位置与方向',diff:2,q:'在学校东偏南30度方向上，距离500米的地方是？',a:'书店',e:'根据给定条件判断'}
    ,{id:141,title:'折线统计图',diff:3,q:'某公司员工2018年50人，2019年65人，2020年60人，2021年80人，增长最多的是？',a:'2021年',e:'计算每年增长：15,-5,20'}
    ,{id:142,title:'长方体表面积',diff:3,q:'长8cm，宽5cm，高4cm的长方体表面积是？',a:'184cm²',e:'2×(8×5+8×4+5×4)=184'}
    ,{id:143,title:'正方体体积',diff:3,q:'棱长6cm的正方体体积是？',a:'216cm³',e:'6³=216'}
    ,{id:144,title:'容积单位',diff:2,q:'5升=多少毫升？',a:'5000毫升',e:'1升=1000毫升'}
    ,{id:145,title:'容积应用',diff:3,q:'长方体鱼缸长60cm，宽40cm，高50cm，倒入多少升水，水深30cm？',a:'72升',e:'60×40×30÷1000=72'}
    ,{id:146,title:'打电话问题',diff:4,q:'老师通知5个学生，每个学生再通知其他人，共通知12人至少需要几分钟？',a:'3分钟',e:'2的n次方=12，实际3分钟'}
    ,{id:147,title:'找次品问题',diff:4,q:'9个零件中有1个次品(轻一些)，至少称几次保证找到？',a:'2次',e:'9→3→1，两次搞定'}
    ,{id:148,title:'统筹优化',diff:4,q:'洗水壶1分钟，烧水8分钟，洗茶杯2分钟，泡茶1分钟，最少需要几分钟？',a:'9分钟',e:'烧水时同时洗茶杯'}
    ,{id:149,title:'周期规律',diff:3,q:'1,4,2,8,5,7循环排列，第100个数字是？',a:'7',e:'周期6，100÷6=16余4'}
    ,{id:150,title:'图形计数',diff:4,q:'每行3个正方形的网格中，共有多少个长方形？',a:'18个',e:'长方形数=C(4,2)×C(3,2)=18'}
];

window.topicsEnglish5 = [
    {id:201,title:'一般现在时',diff:2,q:'She ____ (have) a cat.',a:'has',e:'第三人称单数动词加s/es'},
    {id:202,title:'现在进行时',diff:2,q:'He ____ (read) a book now.',a:'is reading',e:'be+动词ing'},
    {id:203,title:'情态动词',diff:2,q:'I ____ swim in the river.',a:'can',e:'can表示能力'},
    {id:204,title:'方位介词',diff:2,q:'The book is ____ the table.',a:'on',e:'on表示在...上面'},
    {id:205,title:'there be句型',diff:2,q:'____ a beautiful flower in the garden.',a:'There is',e:'就近原则'},
    {id:206,title:'特殊疑问句',diff:2,q:'____ is your name?',a:'What',e:'what问姓名'},
    {id:207,title:'形容词比较级',diff:2,q:'Tom is ____ (tall) than Jim.',a:'taller',e:'比较级加er'},
    {id:208,title:'一般过去时',diff:2,q:'Yesterday, I ____ (go) to school.',a:'went',e:'过去式不规则变化'},
    {id:209,title:'时间表达',diff:1,q:'7:15用英语怎么说？',a:'Seven fifteen / Quarter past seven',e:'时间表达方式'},
    {id:210,title:'可数不可数',diff:2,q:'____ (water) is important.',a:'Water',e:'水是不可数名词'},
    {id:211,title:'some/any',diff:2,q:'Are there ____ apples on the table?',a:'any',e:'否定疑问用any'},
    {id:212,title:'祈使句',diff:2,q:'____ (not run) in the hallway!',a:"Don't run",e:'否定祈使句用Don\'t'},
    {id:213,title:'人称代词',diff:1,q:'This is ____ (I) book.',a:'my',e:'物主代词修饰名词'},
    {id:214,title:'like doing',diff:2,q:'I like ____ (swim).',a:'swimming',e:'like+动词ing'},
    {id:215,title:'选择疑问句',diff:2,q:'Is it red ____ blue?',a:'or',e:'or表示选择'},
    {id:216,title:'频率副词',diff:2,q:'He ____ (always/often) comes late.',a:'often',e:'频率副词位置'},
    {id:217,title:'现在进行时构成',diff:2,q:'____ (be) you listening?',a:'Are',e:'be+主语+动词ing'},
    {id:218,title:'名词复数',diff:2,q:'There are five ____ (child) in the room.',a:'children',e:'child的复数是children'},
    {id:219,title:'whose句型',diff:2,q:'____ coat is this?',a:'Whose',e:'whose问所属'},
    {id:220,title:'情态动词can',diff:2,q:'____ you speak English?',a:'Can',e:'can的一般疑问句'},
    {id:221,title:'词汇运用',diff:2,q:'Monday, Tuesday, ____ (Wednesday)',a:'Wednesday',e:'一周顺序'},

    {id:222,title:'一般现在时',diff:2,q:'She ___ breakfast every morning.',a:'eats',e:'第三人称单数用eats'},
    {id:223,title:'方位介词',diff:2,q:'The cat is ___ the table.',a:'under',e:'under表示在下面'},
    {id:224,title:'复数形式',diff:2,q:'How many ___ do you have?',a:'books',e:'book的复数是books'}

    // ===== V144新增题目 =====
    ,{id:225,title:'一般过去时',diff:2,q:'She ___ (go) to the park yesterday.',a:'went',e:'go的过去式是went'}
    ,{id:226,title:'过去式规则',diff:2,q:'He ___ (play) football last weekend.',a:'played',e:'动词加ed'}
    ,{id:227,title:'一般将来时',diff:2,q:'I ___ (visit) my grandparents tomorrow.',a:'will visit',e:'tomorrow用will'}
    ,{id:228,title:'be going to',diff:2,q:'She ___ (see) a movie tonight.',a:'is going to see',e:'be going to表计划'}
    ,{id:229,title:'形容词最高级',diff:3,q:'Tom is the ___ (tall) in our class.',a:'tallest',e:'最高级加est，前加the'}
    ,{id:230,title:'名词所有格',diff:2,q:'___ (Tom) books are on the desk.',a:"Tom's",e:"名词所有格加's"}
    ,{id:231,title:'介词综合',diff:2,q:'My birthday is ___ June.',a:'in',e:'月份前用in'}
    ,{id:232,title:'代词综合',diff:2,q:'___ is my teacher. ___ name is Miss Li.',a:'She / Her',e:'主格/所有格'}
    ,{id:233,title:'be动词用法',diff:1,q:'There ___ two cats on the bed.',a:'are',e:'复数用are'}
    ,{id:234,title:'祈使句综合',diff:2,q:'___ (not run) in the hallway!',a:"Don't run",e:"否定祈使句用Don't"}
    ,{id:235,title:'特殊疑问词辨析',diff:2,q:'___ is your favorite color?',a:'What',e:'What问事物'}
    ,{id:236,title:'阅读理解基础',diff:3,q:'What does the underlined word mean in the passage?',a:'见上下文',e:'根据语境猜测词义'}
    ,{id:237,title:'日常对话',diff:2,q:'How do you greet your teacher in the morning?',a:'Good morning, teacher!',e:'礼貌问候'}
    ,{id:238,title:'食物词汇',diff:1,q:'I like ___ (apple).',a:'apples',e:'可数名词用复数'}
    ,{id:239,title:'动物词汇',diff:1,q:'The ___ (fish) are swimming.',a:'fish',e:'fish单复数同形'}
    ,{id:240,title:'颜色词汇',diff:1,q:'The sky is ___.',a:'blue',e:'天空是蓝色的'}
    ,{id:241,title:'天气表达',diff:2,q:"What's the ___ like today?",a:'weather',e:'问天气用weather'}
    ,{id:242,title:'家庭成员',diff:2,q:"My mother's sister is my ___.",a:'aunt',e:'亲戚称谓'}
    ,{id:243,title:'身体部位',diff:1,q:'We have two ___ and ten ___ .',a:'eyes, fingers',e:'身体部位词汇'}
    ,{id:244,title:'节日文化',diff:2,q:'We ___ (eat) mooncakes at Mid-Autumn Festival.',a:'eat',e:'节日习俗'}
    ,{id:245,title:'时间介词',diff:2,q:"I get up ___ 6 o'clock ___ the morning.",a:'at / in',e:'at+时间点，in+早中晚'}
    ,{id:246,title:'方位介词',diff:2,q:'The school is ___ the left of the park.',a:'on',e:'on the left在左边'}
    ,{id:247,title:'数量表达',diff:2,q:'There is a ___ of milk in the fridge.',a:'bottle',e:'量词表达'}
    ,{id:248,title:'动词第三人称',diff:2,q:'She usually ___ (watch) TV.',a:'watches',e:'第三人称单数加s/es'}
    ,{id:249,title:'there be综合',diff:3,q:'___ a book and two pens on the desk.',a:'There is',e:'就近原则'}
    ,{id:250,title:'情态动词should',diff:2,q:'You ___ (should) help your parents.',a:'should',e:'should表示建议'}
];

window.topicsChinese5 = [
    {id:301,title:'拼音拼读',diff:1,q:'"骄傲"的读音是？',a:'jiāo ào',e:'骄傲是多音字'},
    {id:302,title:'字形辨析',diff:2,q:'下列词语中没有错别字的是：A决不相同 B绝不相同 C决不不相同 D绝不相同',a:'B',e:'"决"和"绝"区别'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：同学们正在____地讨论问题。',a:'热烈',e:'讨论搭配热烈'},
    {id:304,title:'标点符号',diff:2,q:'"今天天气真好呀！"这句话用了什么标点？',a:'感叹号',e:'表示强烈感情'},
    {id:305,title:'句子排序',diff:3,q:'将句子重新排序：①于是②他③跑④很快⑤因为⑥迟到',a:'⑤①②③④',e:'因为...于是...'},
    {id:306,title:'修辞手法',diff:2,q:'"星星像眼睛"用了什么修辞？',a:'比喻',e:'把星星比作眼睛'},
    {id:307,title:'古诗默写',diff:2,q:'默写《悯农》前两句',a:'锄禾日当午，汗滴禾下土',e:'李绅名篇'},
    {id:308,title:'古诗理解',diff:2,q:'《静夜思》作者是谁？',a:'李白',e:'唐代诗人'},
    {id:309,title:'阅读理解',diff:3,q:'概括段落主要内容的方法是什么？',a:'找关键句或归纳要点',e:'段落大意概括'},
    {id:310,title:'近义词辨析',diff:2,q:'"安静"和"宁静"有什么区别？',a:'宁静程度更深',e:'近义词细微差别'},
    {id:311,title:'反义词',diff:1,q:'"高大"的反义词是？',a:'矮小',e:'反义词配对'},
    {id:312,title:'词语分类',diff:2,q:'"苹果、香蕉、椅子、葡萄"中不同类的是？',a:'椅子',e:'水果vs家具'},
    {id:313,title:'句式转换',diff:2,q:'把"我完成了作业。"改成感叹句',a:'我终于完成了作业！',e:'添加感叹词'},
    {id:314,title:'病句修改',diff:3,q:'修改：春天来了，花园里开满了五颜六色的红花。',a:'春天来了，花园里开满了五颜六色的花。',e:'五颜六色和红花矛盾'},
    {id:315,title:'缩写句子',diff:2,q:'缩写：我和爸爸一起去公园散步。',a:'我和爸爸散步。',e:'保留主谓宾'},
    {id:316,title:'扩写句子',diff:2,q:'扩写：小鸟唱歌。',a:'可爱的小鸟在枝头欢快地唱歌。',e:'添加修饰语'},
    {id:317,title:'查字典',diff:2,q:'"凹"字用部首查字法，先查什么部？',a:'凵',e:'凹的部首是凵'},
    {id:318,title:'语言表达',diff:2,q:'如何用礼貌用语向别人借书？',a:'请问可以借你的书吗？',e:'使用请、好吗等'},
    {id:319,title:'口语交际',diff:2,q:'当别人帮助了你，你该怎么说？',a:'谢谢你！',e:'表达感谢'},
    {id:320,title:'写作要素',diff:2,q:'记叙文的六要素是什么？',a:'时间、地点、人物、起因、经过、结果',e:'记叙文要素'},
    {id:321,title:'名著阅读',diff:2,q:'《西游记》中孙悟空使用的兵器叫什么？',a:'如意金箍棒',e:'东海龙宫的定海神针'},

    {id:322,title:'古诗理解',diff:2,q:'《静夜思》中举头望明月的下一句是？',a:'低头思故乡',e:'李白思乡名句'},
    {id:323,title:'词语搭配',diff:2,q:'下列词语搭配正确的是？',a:'保护环境',e:'动词与名词搭配'},
    {id:324,title:'句子排序',diff:3,q:'将句子排序：(1)天黑了 (2)我回家了 (3)放学了 (4)写作业',a:'3-1-2-4',e:'按事情发展顺序'}

    // ===== V144新增题目 =====
    ,{id:325,title:'古诗词默写',diff:2,q:'默写《静夜思》全诗',a:'床前明月光，疑是地上霜。举头望明月，低头思故乡。',e:'李白名篇'}
    ,{id:326,title:'成语运用',diff:2,q:'用五光十色造句',a:'节日的灯火五光十色，美丽极了。',e:'形容色彩鲜艳、式样繁多'}
    ,{id:327,title:'关联词',diff:3,q:'___下大雨，___我们取消了野餐。(转折关系)',a:'因为...所以...',e:'因果关系'}
    ,{id:328,title:'修辞手法',diff:2,q:'荷叶圆圆的，绿绿的是什么修辞？',a:'叠词',e:'使用叠词强调特征'}
    ,{id:329,title:'修改病句',diff:3,q:'修改病句：同学们排着整齐的队伍和热烈的掌声走出校门。',a:'同学们排着整齐的队伍，带着热烈的掌声走出校门。',e:'搭配不当'}
    ,{id:330,title:'标点符号',diff:2,q:'下列句子中标点使用正确的是？',a:'妈妈问：你吃饭了吗？',e:'引用问句用引号和问号'}
    ,{id:331,title:'近义词辨析',diff:2,q:'希望和期望有什么不同？',a:'希望程度较轻，期望程度更深',e:'语意轻重区别'}
    ,{id:332,title:'反义词',diff:1,q:'粗心的反义词是？',a:'细心',e:'反义词配对'}
    ,{id:333,title:'ABB式词语',diff:2,q:'照样子写词语：绿油油 ___ ___',a:'金灿灿、亮晶晶',e:'ABB式形容词'}
    ,{id:334,title:'AABB式词语',diff:2,q:'写出两个AABB式词语',a:'高高兴兴、快快乐乐',e:'AABB结构'}
    ,{id:335,title:'造句',diff:2,q:'用一边...一边...造句',a:'妈妈一边做饭，一边听音乐。',e:'并列动作'}
    ,{id:336,title:'课文理解',diff:3,q:'《桂花雨》表达了作者怎样的思想感情？',a:'思乡之情',e:'借桂花表达思乡'}
    ,{id:337,title:'仿写句子',diff:3,q:'仿写：科学家发现，蝙蝠是用嘴和耳朵配合探路的。',a:'见课文原句',e:'注意说明方法'}
    ,{id:338,title:'说明文基础',diff:2,q:'说明文的特点是什么？',a:'准确性、严谨性',e:'说明文三要素'}
    ,{id:339,title:'概括段意',diff:3,q:'如何概括段落大意？',a:'找中心句或归纳要点',e:'段落概括方法'}
    ,{id:340,title:'缩句',diff:3,q:'缩句：可爱的小鸟在茂密的树林里快乐地唱歌。',a:'小鸟唱歌。',e:'保留主谓宾'}
    ,{id:341,title:'扩句',diff:2,q:'扩句：同学们读书。',a:'同学们在教室里认真地读书。',e:'添加修饰语'}
    ,{id:342,title:'形近字辨析',diff:2,q:'辨和辩的区别是？',a:'辨：辨别；辩：争辩',e:'部首不同，意思不同'}
    ,{id:343,title:'多音字',diff:2,q:'长的多音字组词：chang___ zhang___',a:'长短/长大',e:'多音字辨析'}
    ,{id:344,title:'古诗词理解',diff:3,q:'《所见》中意欲捕鸣蝉的下一句是？',a:'忽然闭口立',e:'袁枚名篇'}
    ,{id:345,title:'查字典',diff:2,q:'典字用音序查字法，先查什么字母？',a:'D',e:'音序查字法'}
    ,{id:346,title:'部首查字',diff:2,q:'裹字有几部分组成？',a:'5部分',e:'从上到下，从外到内'}
    ,{id:347,title:'词语搭配',diff:2,q:'改正搭配错误：提高水平、改进缺点、改正错误',a:'改进工作/提高效率',e:'动宾搭配要恰当'}
    ,{id:348,title:'比喻句',diff:2,q:'判断：她的脸红得像苹果。这是比喻句吗？',a:'是',e:'把脸比作苹果'}
    ,{id:349,title:'拟人句',diff:2,q:'把星星闪烁改成拟人句',a:'星星眨着眼睛',e:'赋予星星人的动作'}
    ,{id:350,title:'阅读策略',diff:3,q:'阅读时如何做批注？',a:'画重点、写感受、提问题',e:'边读边思'}
];

window.topicsMath6 = [
    {id:101,title:'分数乘法',diff:2,q:'计算：2/3×6=',a:'4',e:'分子分母约分'},
    {id:102,title:'分数除法',diff:3,q:'计算：3/4÷2=',a:'3/8',e:'除以一个数等于乘倒数'},
    {id:103,title:'比的意义',diff:2,q:'3:5的比值是？',a:'3/5或0.6',e:'比值=前项÷后项'},
    {id:104,title:'比的化简',diff:2,q:'化简：12:18',a:'2:3',e:'除以最大公约数'},
    {id:105,title:'百分数应用',diff:3,q:'50的20%是多少？',a:'10',e:'50×20%=10'},
    {id:106,title:'圆的认识',diff:2,q:'圆的直径和半径关系是？',a:'d=2r',e:'直径是半径的2倍'},
    {id:107,title:'圆周率',diff:1,q:'圆周率π约等于？',a:'3.14',e:'圆周率定义'},
    {id:108,title:'圆的周长',diff:2,q:'半径2cm的圆，周长是？',a:'12.56cm',e:'C=2πr'},
    {id:109,title:'圆的面积',diff:3,q:'直径6cm的圆，面积是？',a:'28.26cm²',e:'S=πr²,r=3'},
    {id:110,title:'扇形面积',diff:3,q:'圆心角90°，半径4cm的扇形面积是？',a:'12.56cm²',e:'90/360×π×4²'},
    {id:111,title:'负数认识',diff:2,q:'-5℃比-2℃高还是低？',a:'低',e:'负数比较大小'},
    {id:112,title:'数轴表示',diff:2,q:'在数轴上，-3在-5的哪边？',a:'右边',e:'数轴上右边的数大'},
    {id:113,title:'解比例',diff:3,q:'解比例：3:x=6:8',a:'x=4',e:'内向积=外向积'},
    {id:114,title:'统计图选择',diff:2,q:'表示部分与整体关系用什么统计图？',a:'扇形统计图',e:'各部分占比'},
    {id:115,title:'圆柱体积',diff:3,q:'底面半径2cm，高5cm的圆柱体积是？',a:'62.8cm³',e:'V=πr²h'},
    {id:116,title:'圆锥体积',diff:3,q:'圆锥底面积12cm²，高9cm，体积是？',a:'36cm³',e:'V=1/3Sh'},
    {id:117,title:'比例尺',diff:3,q:'比例尺1:1000，表示实际1cm，图上？',a:'1m',e:'图上距离×1000'},
    {id:118,title:'正反比例',diff:3,q:'速度一定，路程和时间成什么比例？',a:'正比例',e:'s=vt'},
    {id:119,title:'应用题',diff:4,q:'一批零件，甲单独做8天完成，乙单独做12天，两人合作几天完成？',a:'4.8天',e:'合作效率=1/8+1/12'},
    {id:120,title:'利率问题',diff:3,q:'本金1000元，年利率3%，存一年利息？',a:'30元',e:'利息=本金×利率'},
    {id:121,title:'统计量',diff:2,q:'一组数据2,3,3,4,5,5,5的众数是？',a:'3和5',e:'出现次数最多的数'},

    {id:122,title:'比例应用',diff:3,q:'图上距离5cm，实际距离100km，比例尺是？',a:'1:2000000',e:'5cm:100km=1:2000000'},
    {id:123,title:'圆周率',diff:2,q:'圆的直径是10cm，周长约是？',a:'31.4cm',e:'C=πd≈3.14×10'},
    {id:124,title:'折扣问题',diff:3,q:'原价200元，打8折后再降10%，现价？',a:'144元',e:'200×0.8×0.9=144'}

    // ===== V144新增题目 =====
    ,{id:125,title:'分数乘法应用',diff:2,q:'一个数的3/5是60，这个数是多少？',a:'100',e:'60÷3/5=60×5/3=100'}
    ,{id:126,title:'分数除法应用',diff:3,q:'小明有48张邮票，小红的是他的2/3，小红有多少张？',a:'32张',e:'48×2/3=32'}
    ,{id:127,title:'比的意义',diff:2,q:'甲、乙两数的比是3:5，乙是40，甲是多少？',a:'24',e:'3/5=甲/40,甲=24'}
    ,{id:128,title:'按比分配',diff:3,q:'把180按3:4:5分成三部分，三部分分别是？',a:'45,60,75',e:'共12份，每份15'}
    ,{id:129,title:'百分数意义',diff:2,q:'六年级有50人，近视的有10人，近视率是多少？',a:'20%',e:'10÷50×100%=20%'}
    ,{id:130,title:'百分数互化',diff:3,q:'把3/8化成百分数(保留一位小数)',a:'37.5%',e:'3÷8=0.375=37.5%'}
    ,{id:131,title:'百分数应用',diff:3,q:'一件商品原价200元，打八折后再提价10%，现价是多少？',a:'176元',e:'200×0.8×1.1=176'}
    ,{id:132,title:'圆周长应用',diff:3,q:'一个圆形花坛直径10米，绕花坛走一圈要走多少米？',a:'31.4米',e:'C=πd=3.14×10=31.4'}
    ,{id:133,title:'圆面积应用',diff:3,q:'圆形桌面直径1.2米，面积约是多少平方米？',a:'约1.13m²',e:'S=πr²=3.14×0.6²≈1.13'}
    ,{id:134,title:'圆环面积',diff:3,q:'外圆半径8cm，内圆半径5cm，圆环面积是？',a:'约122.46cm²',e:'π×(8²-5²)=3.14×39'}
    ,{id:135,title:'扇形统计图',diff:3,q:'某班图书角，科技书占40%，童话占30%，其余是其他书。其他书占百分之几？',a:'30%',e:'100%-40%-30%=30%'}
    ,{id:136,title:'位置与方向二',diff:2,q:'点A在点O北偏东30度方向200米处，点B在点O东偏北60度方向300米处。A在B的什么方向？',a:'西北方向',e:'根据方位角计算'}
    ,{id:137,title:'比例的意义',diff:3,q:'判断：4:6和2:3能组成比例吗？',a:'能',e:'4/6=2/3'}
    ,{id:138,title:'解比例',diff:3,q:'解比例：x:12=5:6',a:'x=10',e:'6x=60'}
    ,{id:139,title:'正比例',diff:3,q:'速度一定，路程和时间是什么比例关系？',a:'正比例',e:'s=vt，比值一定'}
    ,{id:140,title:'反比例',diff:3,q:'工作总量一定，工作人数和工作时间是什么比例？',a:'反比例',e:'人数×时间=总量'}
    ,{id:141,title:'比例应用',diff:4,q:'一幅地图比例尺1:500000，图上距离6cm，两地实际距离是多少千米？',a:'30km',e:'6cm×500000=30km'}
    ,{id:142,title:'负数大小比较',diff:2,q:'比较大小：-3/4 和 -0.8',a:'-3/4 > -0.8',e:'-0.75 > -0.8'}
    ,{id:143,title:'圆柱表面积',diff:3,q:'圆柱底面半径2cm，高5cm，表面积是？',a:'87.92cm²',e:'2πr²+2πrh'}
    ,{id:144,title:'圆柱体积',diff:3,q:'圆柱底面直径6cm，高10cm，体积是？',a:'282.6cm³',e:'π×3²×10=90π'}
    ,{id:145,title:'圆锥体积',diff:3,q:'圆锥底面半径6cm，高5cm，体积是？',a:'188.4cm³',e:'1/3×π×6²×5=60π'}
    ,{id:146,title:'圆柱圆锥综合',diff:4,q:'等底等高的圆柱和圆锥，体积之和是48cm³，圆柱体积是？',a:'36cm³',e:'V柱:V锥=3:1，和=4份'}
    ,{id:147,title:'鸽巢问题',diff:4,q:'5只鸽子飞进3个笼子，至少有几只鸽子飞进同一个笼子？',a:'2只',e:'5÷3=1余2，所以至少2只'}
    ,{id:148,title:'鸡兔同笼',diff:4,q:'鸡兔共10只，腿共28条，鸡、兔各几只？',a:'鸡6只，兔4只',e:'设鸡x只：2x+4(10-x)=28'}
    ,{id:149,title:'统计综合',diff:3,q:'数据5,6,6,7,8,8,8,9的众数和中位数分别是？',a:'众数8，中位数7.5',e:'众数出现最多，中位数中间两数平均'}
    ,{id:150,title:'可能性大小',diff:3,q:'盒中有红球3个，黄球2个，绿球1个。摸到红球的概率是多少？',a:'1/2',e:'红球3个，总球6个'}
];

window.topicsEnglish6 = [
    {id:201,title:'一般现在时',diff:2,q:'My mother ____ (work) in a hospital.',a:'works',e:'第三人称单数动词加s'},
    {id:202,title:'现在进行时',diff:2,q:'Look! The birds ____ (fly) in the sky.',a:'are flying',e:'现在进行时be+ing'},
    {id:203,title:'一般过去时',diff:2,q:'Last weekend, I ____ (visit) my grandparents.',a:'visited',e:'过去时间用过去式'},
    {id:204,title:'一般将来时',diff:2,q:'I ____ (go) to Beijing tomorrow.',a:'will go',e:'tomorrow用will'},
    {id:205,title:'现在完成时',diff:3,q:'I ____ (read) this book. It is very interesting.',a:'have read',e:'现在完成时强调结果'},
    {id:206,title:'情态动词must',diff:2,q:'You ____ (must) do your homework first.',a:'must',e:'must表示必须'},
    {id:207,title:'形容词比较级',diff:2,q:'The blue whale is the ____ (big) animal.',a:'biggest',e:'最高级前加the'},
    {id:208,title:'副词比较级',diff:2,q:'He runs ____ (fast) than me.',a:'faster',e:'副词比较级加er'},
    {id:209,title:'过去进行时',diff:3,q:'I ____ (read) when he called.',a:'was reading',e:'过去进行时was/were+ing'},
    {id:210,title:'there be将来时',diff:3,q:'There ____ (be) a concert tomorrow.',a:'will be / is going to be',e:'there be的一般将来时'},
    {id:211,title:'被动语态',diff:3,q:'The song ____ (sing) by millions of people.',a:'is sung',e:'一般现在时被动语态'},
    {id:212,title:'if条件句',diff:3,q:'If it ____ (rain), I will stay home.',a:'rains',e:'主将从现'},
    {id:213,title:'宾语从句',diff:3,q:'I think that he ____ (be) right.',a:'is',e:'宾语从句用陈述语序'},
    {id:214,title:'直接间接引语',diff:3,q:'She said, "I am happy." 改为间接引语',a:'She said that she was happy.',e:'人称和时态变化'},
    {id:215,title:'used to',diff:3,q:'I ____ (use to) play with dolls.',a:'used to',e:'used to表示过去习惯'},
    {id:216,title:'动名词做主语',diff:2,q:'____ (read) is my hobby.',a:'Reading',e:'动名词可做主语'},
    {id:217,title:'短语动词',diff:2,q:'Please pick ____ the book.',a:'up',e:'pick up捡起'},
    {id:218,title:'介词辨析',diff:2,q:'We will meet ____ 7 o\'clock ____ the morning.',a:'at / in',e:'at+时间点，in+早中晚'},
    {id:219,title:'复合形容词',diff:2,q:'a five-year-old boy 画线部分提问',a:'How old',e:'对年龄提问'},
    {id:220,title:'感叹句',diff:2,q:'改为感叹句：The flower is beautiful.',a:'How beautiful the flower is!',e:'How+adj+主谓'},
    {id:221,title:'阅读理解策略',diff:3,q:'阅读理解中，如何找主旨大意？',a:'看首段和末段',e:'阅读技巧'},

    {id:222,title:'一般过去时',diff:2,q:'Yesterday, I ___ to school.',a:'went',e:'go的过去式是went'},
    {id:223,title:'情态动词',diff:2,q:'___ I help you?',a:'Can',e:'can表示能力或许可'},
    {id:224,title:'there be句型',diff:2,q:'___ a book and a pen on the desk.',a:'There are',e:'复数用are'}

    // ===== V144新增题目 =====
    ,{id:225,title:'过去进行时',diff:3,q:'What ___ you ___ (do) at 8 last night?',a:'were / doing',e:'过去进行时was/were+ing'}
    ,{id:226,title:'will综合',diff:2,q:'It ___ (rain) tomorrow.',a:'will rain',e:'will表将来'}
    ,{id:227,title:'be going to',diff:2,q:'I ___ (travel) to Shanghai next week.',a:'am going to travel',e:'计划安排'}
    ,{id:228,title:'现在完成时',diff:3,q:'I ___ (live) here since 2010.',a:'have lived',e:'since+时间点，现在完成时'}
    ,{id:229,title:'比较级综合',diff:3,q:'Tom is ___ than any other student in his class.',a:'taller',e:'最高级转化'}
    ,{id:230,title:'最高级综合',diff:3,q:'She is the ___ (beautiful) girl I have ever seen.',a:'most beautiful',e:'最高级表示极致'}
    ,{id:231,title:'不定代词',diff:2,q:'___ is in the room. It is empty.',a:'Somebody/Nobody',e:'somebody/nobody'}
    ,{id:232,title:'连词综合',diff:2,q:'I like English ___ my sister likes math.',a:'but',e:'but表转折'}
    ,{id:233,title:'感叹句',diff:2,q:'改为感叹句：The movie is interesting.',a:'How interesting the movie is!',e:'How+adj+主谓'}
    ,{id:234,title:'条件状语从句',diff:3,q:'If it ___ (rain), we will stay home.',a:'rains',e:'主将从现'}
    ,{id:235,title:'宾语从句初步',diff:3,q:'I think that she ___ (be) a teacher.',a:'is',e:'宾语从句用陈述语序'}
    ,{id:236,title:'情态动词should',diff:2,q:'You ___ (should) respect your parents.',a:'should',e:'should表建议'}
    ,{id:237,title:'情态动词must',diff:2,q:'You ___ (must) finish your homework first.',a:'must',e:'must表必须'}
    ,{id:238,title:'阅读策略',diff:3,q:'阅读时如何抓住文章主旨？',a:'看首尾段，找主题句',e:'阅读技巧'}
    ,{id:239,title:'写作基础',diff:3,q:'写一篇日记的开头应该包含什么？',a:'日期、天气、星期',e:'日记格式'}
    ,{id:240,title:'文化常识',diff:2,q:'When is Thanksgiving Day in the US?',a:'The fourth Thursday of November',e:'美国节日'}
    ,{id:241,title:'副词位置',diff:2,q:'She ___ (always) comes late.',a:'always',e:'频度副词位置'}
    ,{id:242,title:'形容词顺序',diff:3,q:'a ___ (beautiful big red) flower',a:'beautiful big red',e:'形容词排序口诀'}
    ,{id:243,title:'介词综合',diff:2,q:'He arrived ___ the morning ___ April 5th.',a:'in / on',e:'in the morning, on+具体日期'}
    ,{id:244,title:'并列句',diff:2,q:'I like dancing ___ she likes singing.',a:'but/and',e:'并列连词'}
    ,{id:245,title:'过去完成时',diff:4,q:'By last year, I ___ (study) English for 5 years.',a:'had studied',e:'过去完成时'}
    ,{id:246,title:'被动语态',diff:3,q:'The book ___ (read) by millions of people.',a:'is read',e:'一般现在时被动'}
    ,{id:247,title:'直接间接引语',diff:3,q:'He said, I am happy. 变为间接引语',a:'He said that he was happy.',e:'时态人称变化'}
    ,{id:248,title:'动名词用法',diff:2,q:'___ (swim) is my favorite sport.',a:'Swimming',e:'动名词作主语'}
    ,{id:249,title:'感官动词',diff:2,q:'The food ___ (taste) delicious.',a:'tastes',e:'感官动词+adj'}
    ,{id:250,title:'短语动词',diff:2,q:'Please ___ the light. It is dark.',a:'turn on',e:'turn on打开'}
];

window.topicsChinese6 = [
    {id:301,title:'拼音拼读',diff:1,q:'"水平"的读音是？',a:'shuǐ píng',e:'声调正确标注'},
    {id:302,title:'字形辨析',diff:2,q:'"戊"和"戌"的区别是？',a:'笔画不同',e:'戊wù戌xū'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：他_____地望着远方。',a:'凝视',e:'凝视表示专注地看'},
    {id:304,title:'成语运用',diff:2,q:'用"专心致志"造句',a:'同学们专心致志地听讲。',e:'形容精神集中'},
    {id:305,title:'病句修改',diff:3,q:'修改：通过讨论，使我们提高了认识。',a:'通过讨论，我们提高了认识。',e:'缺少主语'},
    {id:306,title:'修辞手法',diff:2,q:'"月光如银"用了什么修辞？',a:'比喻',e:'把月光比作银'},
    {id:307,title:'古诗理解',diff:3,q:'《春夜喜雨》中"随风潜入夜"的"潜"是什么意思？',a:'悄悄',e:'形容春雨细密无声'},
    {id:308,title:'古诗鉴赏',diff:3,q:'《望天门山》写了什么景物？',a:'天门山、楚江、帆船',e:'李白写景诗'},
    {id:309,title:'文言文翻译',diff:3,q:'翻译：学而时习之',a:'学了知识后按时复习',e:'《论语》名句'},
    {id:310,title:'文言虚词',diff:3,q:'"之"在"学而时习之"中的用法是？',a:'代词',e:'指代所学知识'},
    {id:311,title:'说明方法',diff:2,q:'"这座塔高约50米"用了什么说明方法？',a:'列数字',e:'用具体数字说明'},
    {id:312,title:'说明文语言',diff:3,q:'说明文语言有什么特点？',a:'准确性、严谨性',e:'科学性和真实性'},
    {id:313,title:'议论文要素',diff:2,q:'议论文的三要素是？',a:'论点、论据、论证',e:'议论文结构'},
    {id:314,title:'论证方法',diff:3,q:'举例说明"勤奋出天才"，用了什么论证方法？',a:'举例论证',e:'通过事例证明'},
    {id:315,title:'段落层次',diff:3,q:'划分段落层次的方法有哪些？',a:'按时间、空间、逻辑',e:'段落结构分析'},
    {id:316,title:'标题作用',diff:3,q:'分析《桥》这篇课文的标题作用',a:'象征、激发兴趣、线索',e:'标题的多重作用'},
    {id:317,title:'人物描写',diff:2,q:'"他高高的个子"用了什么描写方法？',a:'外貌描写',e:'对人物外形的描写'},
    {id:318,title:'环境描写',diff:2,q:'小说中开头描写恶劣天气有什么作用？',a:'渲染气氛、烘托心情',e:'环境描写作用'},
    {id:319,title:'写作手法',diff:3,q:'"一切景语皆情语"是什么意思？',a:'景物描写反映人物情感',e:'情景交融'},
    {id:320,title:'名著阅读',diff:2,q:'《鲁滨逊漂流记》作者是谁？',a:'笛福',e:'英国作家'},
    {id:321,title:'综合实践',diff:2,q:'开展"读书分享会"，需要准备什么？',a:'好书推荐、分享稿',e:'活动准备'},

    {id:322,title:'修辞手法',diff:2,q:'太阳公公露出了笑脸是什么修辞？',a:'拟人',e:'把太阳当成人来写'},
    {id:323,title:'词语理解',diff:2,q:'眉开眼笑的意思是？',a:'形容高兴的样子',e:'眉头舒展，眼睛带笑'},
    {id:324,title:'段落大意',diff:3,q:'概括段落主要内容的常用方法是？',a:'找中心句',e:'中心句通常在段首或段尾'}

    // ===== V144新增题目 =====
    ,{id:325,title:'文言文翻译',diff:3,q:'翻译：温故而知新，可以为师矣',a:'温习旧知识从而获得新知识，就可以当老师了',e:'《论语》名句'}
    ,{id:326,title:'古诗词赏析',diff:3,q:'《观书有感》中源头活水的比喻义是？',a:'新知识、新方法',e:'比喻读书或学习要有新收获'}
    ,{id:327,title:'古诗词赏析',diff:3,q:'《西江月·夜行黄沙道中》表达了作者什么感情？',a:'对农村生活的热爱',e:'辛弃疾农村词'}
    ,{id:328,title:'成语故事',diff:2,q:'掩耳盗铃告诉我们什么道理？',a:'自欺欺人，欺骗别人也欺骗自己',e:'不要自己骗自己'}
    ,{id:329,title:'名著阅读',diff:2,q:'《西游记》中三打白骨精的主人公是谁？',a:'孙悟空',e:'取经团队核心'}
    ,{id:330,title:'说明方法辨析',diff:2,q:'这座塔高约50米，相当于17层楼高用了什么说明方法？',a:'列数字、作比较',e:'多种说明方法'}
    ,{id:331,title:'论证方法',diff:3,q:'用铁杵成针的例子证明坚持就是胜利，用了什么论证方法？',a:'举例论证',e:'通过事例证明观点'}
    ,{id:332,title:'写作手法',diff:3,q:'一切景语皆情语体现了什么写法？',a:'借景抒情/情景交融',e:'写景与情感的关系'}
    ,{id:333,title:'描写方法辨析',diff:2,q:'他的脸涨得通红是什么描写？',a:'神态描写',e:'描写人物的神情'}
    ,{id:334,title:'段落作用',diff:3,q:'文章开头的作用有哪些？',a:'点题、引出下文、设置悬念',e:'开头段的作用'}
    ,{id:335,title:'标题含义',diff:3,q:'《在柏林》标题有什么含义？',a:'既指地名，也指战争的残酷',e:'标题的深层含义'}
    ,{id:336,title:'概括主旨',diff:3,q:'概括《草原》这篇文章的主要内容',a:'作者第一次访问内蒙古大草原的所见所感',e:'把握文章要点'}
    ,{id:337,title:'词性辨析',diff:2,q:'飞快是什么词性？在句中做什么成分？',a:'形容词/副词，作状语',e:'词性辨析'}
    ,{id:338,title:'句子成分',diff:3,q:'划分句子成分：同学们认真地完成了老师布置的作业。',a:'同学们(主)认真地(状)完成了(谓)老师布置的(定)作业(宾)',e:'主谓宾定状补'}
    ,{id:339,title:'关联词综合',diff:3,q:'___成绩再好，___不能骄傲。(假设关系)',a:'即使...也...',e:'假设复句'}
    ,{id:340,title:'修辞与表达效果',diff:3,q:'春风又绿江南岸中绿字好在哪里？',a:'形象生动，写出了春天的生机',e:'鉴赏诗歌语言'}
    ,{id:341,title:'文言文虚词',diff:3,q:'之在学而时习之中是什么用法？',a:'代词，指代所学知识',e:'文言虚词用法'}
    ,{id:342,title:'文言实词',diff:3,q:'解释书非借不能读也中书的意思',a:'书籍',e:'古今异义'}
    ,{id:343,title:'古诗背诵',diff:2,q:'《石灰吟》中表现诗人坚贞不屈品质的诗句是？',a:'粉骨碎身浑不怕，要留清白在人间',e:'于谦名篇'}
    ,{id:344,title:'语段理解',diff:3,q:'《穷人》中桑娜收养孤儿，体现了她什么品质？',a:'善良、宁可自己受苦也要帮助别人',e:'人物形象分析'}
    ,{id:345,title:'说明文结构',diff:2,q:'说明文的常见结构有哪些？',a:'总分总、总分、分总',e:'文章结构类型'}
    ,{id:346,title:'议论文结构',diff:2,q:'议论文一般由哪几部分组成？',a:'引论、本论、结论',e:'议论文三部分'}
    ,{id:347,title:'描写角度',diff:2,q:'北风卷地百草折是什么描写？',a:'环境/自然环境描写',e:'描写角度'}
    ,{id:348,title:'表达方式',diff:2,q:'记叙文中的议论有什么作用？',a:'点明中心、升华主题',e:'记叙文中的议论'}
    ,{id:349,title:'标点作用',diff:2,q:'文中画波浪线的句子使用了什么标点？有什么作用？',a:'省略号，表示内容的省略',e:'省略号的作用'}
    ,{id:350,title:'综合运用',diff:4,q:'围绕读书这个主题，设计一个综合性学习活动',a:'读书分享会、好书推荐、读书笔记展',e:'综合性学习设计'}
];

window.topicsMath7 = [
    {id:101,title:'有理数加法',diff:2,q:'计算：(-3)+(+7)+(-5)=?',a:'-1',e:'去括号：-3+7-5=-1'},
    {id:102,title:'有理数乘法',diff:2,q:'计算：(-2)×(-3)×(+4)=?',a:'24',e:'负负得正：(-2)×(-3)=6, 6×4=24'},
    {id:103,title:'绝对值',diff:1,q:'|-5|+|+3|=?',a:'8',e:'|-5|=5, |+3|=3, 5+3=8'},
    {id:104,title:'相反数',diff:1,q:'-7的相反数是？',a:'7',e:'只有符号不同的两数互为相反数'},
    {id:105,title:'数轴',diff:2,q:'在数轴上表示：大于-3且小于4的整数有哪些？',a:'-2,-1,0,1,2,3',e:'从-2到3共6个整数'},
    {id:106,title:'整式加减',diff:2,q:'化简：3x+2y-x+5y',a:'2x+7y',e:'合并同类项：3x-x=2x, 2y+5y=7y'},
    {id:107,title:'幂的运算',diff:3,q:'计算：2³×2⁴÷2⁵',a:'4',e:'同底数幂：指数相加减'},
    {id:108,title:'一元一次方程',diff:2,q:'解方程：2x+5=13',a:'x=4',e:'移项：2x=8, x=4'},
    {id:109,title:'方程应用',diff:3,q:'小明有x本书，小红比他多3本，两人共有15本，求x',a:'x=6',e:'x+(x+3)=15, 2x=12, x=6'},
    {id:110,title:'线段计算',diff:2,q:'点A在-2，B在5，AB距离是？',a:'7',e:'|5-(-2)|=7'},
    {id:111,title:'角度计算',diff:2,q:'一个角的余角是35°，这个角是多少度？',a:'55°',e:'余角之和为90°，90-35=55'},
    {id:112,title:'平行线判定',diff:3,q:'直线a、b被c所截，若∠1=∠2，a∥b吗？',a:'能',e:'同位角相等，两直线平行'},
    {id:113,title:'三角形内角和',diff:2,q:'三角形的三个内角和是？',a:'180°',e:'三角形内角和定理'},
    {id:114,title:'方程组',diff:3,q:'解方程组：x+y=7, x-y=3',a:'x=5, y=2',e:'相加得2x=10，相减得2y=4'},
    {id:115,title:'乘法公式',diff:3,q:'计算：(a+2)(a-2)',a:'a²-4',e:'平方差公式'},
    {id:116,title:'因式分解',diff:3,q:'分解因式：x²-9',a:'(x+3)(x-3)',e:'平方差公式逆用'},
    {id:117,title:'分式运算',diff:3,q:'计算：1/2+1/3',a:'5/6',e:'通分：分母6，分子3+2=5'},
    {id:118,title:'统计初步',diff:2,q:'数据2,3,3,4,5,5,5的众数是？',a:'5',e:'出现次数最多的数'},
    {id:119,title:'概率初步',diff:2,q:'抛硬币，正面朝上的概率是？',a:'1/2',e:'等可能性事件'},
    {id:120,title:'几何证明',diff:4,q:'证明：等腰三角形两底角相等',a:'通过作高可证',e:'利用等腰三角形三线合一'},
    {id:121,title:'绝对值方程',diff:3,q:'解方程：|x-3|=5',a:'x=8或x=-2',e:'x-3=5或x-3=-5'},

    {id:122,title:'有理数比较',diff:2,q:'比较大小：-3 ○ -5',a:'-3 > -5',e:'负数比较，绝对值大的反而小'},
    {id:123,title:'整式加减',diff:3,q:'化简：3x + 2y - x + 3y = ?',a:'2x + 5y',e:'合并同类项'},
    {id:124,title:'一元一次方程',diff:3,q:'解方程：2(x+3)=10',a:'x=2',e:'去括号，移项'}
];

window.topicsEnglish7 = [
    {id:201,title:'一般现在时',diff:2,q:'He ____ (go) to school every day.',a:'goes',e:'第三人称单数动词加s'},
    {id:202,title:'现在进行时',diff:2,q:'Look! The children ____ (play) in the park.',a:'are playing',e:'look提示进行时，be+ing'},
    {id:203,title:'一般过去时',diff:2,q:'Yesterday, I ____ (visit) my grandmother.',a:'visited',e:'过去时间用过去式'},
    {id:204,title:'一般将来时',diff:2,q:'We ____ (go) to Beijing next week.',a:'will go',e:'next week提示将来时'},
    {id:205,title:'现在完成时',diff:3,q:'I ____ (read) this book three times.',a:'have read',e:'现在完成时：have/has+过去分词'},
    {id:206,title:'名词所有格',diff:2,q:'____ (Tom) books are on the desk.',a:"Tom's",e:'名词所有格加\'s'},
    {id:207,title:'人称代词',diff:1,q:'____ is my teacher. ____ name is Mrs. Li.',a:'She / Her',e:'主格作主语，所有格作定语'},
    {id:208,title:'形容词比较级',diff:2,q:'Tom is ____ (tall) than Jack.',a:'taller',e:'than提示比较级，加er'},
    {id:209,title:'形容词最高级',diff:2,q:'Lucy is the ____ (beautiful) girl in our class.',a:'most beautiful',e:'最高级前加the'},
    {id:210,title:'副词位置',diff:2,q:'She speaks English ____ (fluent).',a:'fluently',e:'修饰动词用副词'},
    {id:211,title:'情态动词',diff:2,q:'You ____ (must) finish your homework first.',a:'must',e:'must必须，表示必要性'},
    {id:212,title:'祈使句',diff:1,q:'____ (not be) late for class again!',a:"Don't be",e:'否定祈使句用Don\'t+动词原形'},
    {id:213,title:'there be句型',diff:2,q:'____ a book and two pens on the desk.',a:'There is',e:'就近原则'},
    {id:214,title:'宾语从句',diff:3,q:'I think ____ she ____ (be) a good student.',a:'that / is',e:'that可省略，陈述语序'},
    {id:215,title:'被动语态',diff:3,q:'The letter ____ (send) yesterday.',a:'was sent',e:'一般过去时的被动语态'},
    {id:216,title:'if条件句',diff:3,q:'If it ____ (rain), I will stay at home.',a:'rains',e:'主将从现原则'},
    {id:217,title:'疑问词',diff:2,q:'____ is your name?',a:'What',e:'问姓名用what'},
    {id:218,title:'连词用法',diff:2,q:'I like English ____ my sister likes math.',a:'but',e:'转折对比关系'},
    {id:219,title:'介词填空',diff:2,q:'We have classes ____ Monday ____ Friday.',a:'from / to',e:'from...to...表示从...到...'},
    {id:220,title:'时态综合',diff:3,q:'My father ____ (work) here since 2010.',a:'has worked',e:'since+过去时间点，现在完成时'},
    {id:221,title:'动词短语',diff:2,q:'Please turn ____ the radio. It\'s too noisy.',a:'down/off',e:'turn down关小/off关掉'},
    {id:222,title:'现在进行时',diff:2,q:'Look! The students ___ their homework.',a:'are doing',e:'Look提示进行时'},
    {id:223,title:'可数不可数',diff:2,q:'There is some ___ on the table.',a:'water',e:'water是不可数名词'},
    {id:224,title:'特殊疑问词',diff:2,q:'___ is your birthday?',a:'When',e:'When问时间'}
];

window.topicsChinese7 = [
    {id:301,title:'拼音拼读',diff:1,q:'"兴奋"的读音是？',a:'xīng fèn',e:'兴读xīng时表示精神旺盛'},
    {id:302,title:'字形辨析',diff:2,q:'下列词语中没有错别字的一项：A辩论 B辨论 C辩沦 D辨论',a:'A',e:'辩论的"辩"是言字旁'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：我对未来充满____的信心。',a:'无限',e:'信心搭配"无限"'},
    {id:304,title:'成语运用',diff:2,q:'使用成语"千姿百态"正确的一项是？',a:'花园里百花盛开，千姿百态',e:'形容姿态多种多样'},
    {id:305,title:'病句修改',diff:3,q:'修改：春天的杭州是一年中最美的季节。',a:'杭州的春天是一年中最美的季节',e:'主语和宾语搭配不当'},
    {id:306,title:'仿写句子',diff:2,q:'仿写：书籍是人类进步的阶梯。',a:'知识是通向成功的桥梁',e:'抓住比喻修辞'},
    {id:307,title:'记叙文阅读',diff:3,q:'概括本文的主要内容（不超过30字）',a:'见文章',e:'抓住时间、地点、人物、事件'},
    {id:308,title:'说明方法',diff:2,q:'文中画线句使用了什么说明方法？',a:'举例子/列数字/打比方',e:'常见说明方法'},
    {id:309,title:'文言实词',diff:3,q:'解释"温故而知新"中"故"的意思',a:'旧的、旧的知识',e:'故：旧也'},
    {id:310,title:'文言虚词',diff:3,q:'"之"在"学而时习之"中的用法是？',a:'代词，指代所学知识',e:'之：代词'},
    {id:311,title:'翻译句子',diff:3,q:'翻译：学而不思则罔，思而不学则殆',a:'只学习不思考会迷惑，只思考不学习会有危害',e:'孔子学习方法论'},
    {id:312,title:'文学常识',diff:2,q:'《论语》是____的经典著作',a:'儒家',e:'《论语》是儒家经典'},
    {id:313,title:'修辞手法',diff:2,q:'"春天像小姑娘"使用了什么修辞？',a:'比喻',e:'把春天比作小姑娘'},
    {id:314,title:'标点符号',diff:2,q:'下列句子中冒号使用正确的是？',a:'总说后用冒号',e:'冒号用在总说后'},
    {id:315,title:'综合性学习',diff:2,q:'开展"少年正是读书时"活动，设计两个形式',a:'读书分享会、好书推荐卡',e:'设计要有可操作性'},
    {id:316,title:'名著阅读',diff:2,q:'《西游记》中"大闹天宫"的主人公是谁？',a:'孙悟空',e:'齐天大圣孙悟空'},
    {id:317,title:'语言表达',diff:3,q:'对"开卷有益"和"开卷未必有益"进行评述',a:'见观点',e:'要有自己的思考'},
    {id:318,title:'信息提取',diff:2,q:'从新闻中提取五个W',a:'When Where Who What Why',e:'新闻要素提取'},
    {id:319,title:'口语交际',diff:2,q:'当同学向你借书时，如何礼貌拒绝？',a:'使用礼貌用语',e:'表达原因'},
    {id:320,title:'写作训练',diff:4,q:'以"我的成长故事"为题，写一篇记叙文',a:'见作文',e:'要素完整，感情真挚'},
    {id:321,title:'古诗默写',diff:2,q:'默写《静夜思》全诗',a:'床前明月光，疑是地上霜。举头望明月，低头思故乡。',e:'李白名篇'},

    {id:322,title:'文言实词',diff:2,q:'温故而知新中故的意思是？',a:'学过的知识',e:'故：旧的、以前的'},
    {id:323,title:'说明方法',diff:2,q:'赵州桥是一座石拱桥，长约50米用了什么说明方法？',a:'列数字',e:'用具体数据说明'},
    {id:324,title:'病句修改',diff:3,q:'修改病句：同学们基本都到齐了。',a:'去掉基本或都',e:'前后矛盾'}
];


window.topicsMath8 = [{id:401,title:'全等三角形',diff:3,q:'AB=DE，AC=DF，BC=EF，能判定△ABC≌△DEF吗？',a:'能，SSS',e:'三边对应相等全等'},{id:402,title:'等腰三角形',diff:3,q:'等腰三角形一个底角为50°，顶角为？',a:'80°',e:'底角×2+顶角=180°'},{id:403,title:'勾股定理',diff:3,q:'直角三角形两直角边为5和12，斜边为？',a:'13',e:'5²+12²=25+144=169=13²'},{id:404,title:'一次函数',diff:3,q:'函数y=2x-3，x=4时，y=？',a:'5',e:'代入计算：2×4-3=5'},{id:405,title:'一次函数图像',diff:3,q:'y=kx+b，k>0，b<0，图像经过哪些象限？',a:'一、三、四象限',e:'k>0过一三，b<0与y轴负半轴相交'},{id:406,title:'二元一次方程组',diff:3,q:'解方程组：3x+2y=13, x-y=3',a:'x=19/5, y=4/5',e:'代入法或加减消元法'},{id:407,title:'分式方程',diff:3,q:'解方程：1/(x-1)=2/x',a:'x=2',e:'去分母，检验增根'},{id:408,title:'反比例函数',diff:3,q:'反比例函数y=6/x，当x=3时，y=？',a:'2',e:'代入：6÷3=2'},{id:409,title:'四边形',diff:3,q:'平行四边形的对角线具有什么性质？',a:'互相平分',e:'平行四边形对角线互相平分'},{id:410,title:'菱形判定',diff:4,q:'对角线互相垂直平分的四边形是什么？',a:'菱形',e:'菱形的判定定理'},{id:411,title:'矩形性质',diff:3,q:'矩形的对角线长度相等吗？',a:'相等',e:'矩形对角线相等'},{id:412,title:'梯形中位线',diff:3,q:'梯形上底2，下底4，中位线长为？',a:'3',e:'中位线=(上底+下底)÷2'},{id:413,title:'数据分析',diff:3,q:'数据2,3,4,5,6的方差是？',a:'2',e:'先求平均数，再求方差'},{id:414,title:'概率计算',diff:3,q:'袋中有3红2白球，摸到红球的概率是？',a:'3/5',e:'概率=红球数÷总球数'},{id:415,title:'相似三角形',diff:4,q:'两个相似三角形相似比3:2，面积比是？',a:'9:4',e:'面积比=相似比的平方'},{id:416,title:'黄金分割',diff:3,q:'点C把线段AB分成AC/AB=BC/AC，则AC/AB=？',a:'(√5-1)/2≈0.618',e:'黄金分割比'},{id:417,title:'三角函数',diff:3,q:'在Rt△ABC中，∠C=90°，AC=3，BC=4，sinA=？',a:'4/5',e:'sinA=对边/斜边'},{id:418,title:'圆的基本性质',diff:3,q:'圆的半径为5，圆上一点到圆心的距离是？',a:'5',e:'圆上点到圆心距离等于半径'},{id:419,title:'一次函数与方程',diff:3,q:'直线y=2x-5与x轴的交点坐标是？',a:'(2.5,0)',e:'令y=0，解2x-5=0'},{id:420,title:'一次函数综合',diff:4,q:'已知一次函数y=kx+b，经过(1,3)和(2,5)，求k和b',a:'k=2,b=1',e:'代入两点求方程组'},{id:421,title:'四边形判定',diff:4,q:'一组邻边相等的平行四边形是什么？',a:'菱形',e:'菱形的定义'},{id:422,title:'正方形性质',diff:3,q:'正方形的对角线具有哪些性质？',a:'相等、垂直、平分',e:'正方形具有矩形和菱形的全部性质'},{id:423,title:'数据分析综合',diff:3,q:'数据3,5,7,9,11的中位数是？',a:'7',e:'中位数是排序后的中间值'},{id:424,title:'概率应用',diff:3,q:'同时抛两枚硬币，至少有一枚正面朝上的概率是？',a:'3/4',e:'总情况4种，至少一正有3种'}];

window.topicsEnglish8 = [{id:501,title:'现在完成时',diff:3,q:'I ____ (study) English for 3 years.',a:'have studied',e:'for+时间段，现在完成时'},{id:502,title:'被动语态',diff:3,q:'The book ____ (write) by Lu Xun.',a:'was written',e:'过去写的，一般过去时被动'},{id:503,title:'宾语从句',diff:3,q:'Do you know if he ____ (come) tomorrow?',a:'will come',e:'if引导宾语从句，表将来'},{id:504,title:'定语从句',diff:4,q:'The book ____ (that/who) I bought is interesting.',a:'that / which',e:'指物用that/which'},{id:505,title:'状语从句',diff:3,q:'____ you work harder, you won\'t pass.',a:'Unless',e:'unless除非=if...not'},{id:506,title:'情态动词',diff:2,q:'You ____ (must) have seen the movie.',a:'must',e:'must have done表示对过去的肯定推测'},{id:507,title:'非谓语动词',diff:4,q:'I saw him ____ (play) basketball.',a:'playing',e:'see sb doing看到...正在做'},{id:508,title:'形容词顺序',diff:3,q:'排列：a, beautiful, red, small, flower',a:'a beautiful small red flower',e:'限定词+大小+颜色+名词'},{id:509,title:'倒装句',diff:3,q:'Only then ____ (did he realize) the importance.',a:'did he realize',e:'Only+状语置于句首，主谓倒装'},{id:510,title:'主谓一致',diff:3,q:'Neither the teacher nor the students ____ happy.',a:'are',e:'就近一致原则'},{id:511,title:'虚拟语气',diff:4,q:'If I ____ (be) a bird, I would fly.',a:'were',e:'与现在事实相反，用were'},{id:512,title:'时态综合',diff:3,q:'By the time he came, I ____ (finish) my homework.',a:'had finished',e:'by the time+过去，主句过去完成时'},{id:513,title:'短语动词',diff:2,q:'Please look ____ the new words in the dictionary.',a:'up',e:'look up查字典'},{id:514,title:'词性转换',diff:2,q:'The news was very ____ (excite). We were all ____ (excite).',a:'exciting / excited',e:'-ing令人.../-ed感到...'},{id:515,title:'复合句',diff:3,q:'Make a sentence with "although...but..."',a:'Although he is young, he is tall.',e:'although和but不连用'},{id:516,title:'阅读理解',diff:3,q:'The main idea of paragraph 2 is...',a:'见短文',e:'找段落主题句'},{id:517,title:'完形填空',diff:3,q:'从A、B、C、D中选择最佳答案...',a:'见上下文',e:'上下文语境分析'},{id:518,title:'书面表达',diff:4,q:'写一篇关于"环保"的英语短文，80词左右',a:'见作文',e:'包含环保建议'},{id:519,title:'现在完成时深入',diff:3,q:'I have lived here since 2010. 对划线部分提问',a:'How long have you lived here?',e:'since+时间点，问段时间'},{id:520,title:'被动语态综合',diff:3,q:'改写：They will finish the work tomorrow.',a:'The work will be finished tomorrow.',e:'一般将来时的被动'},{id:521,title:'过去完成时',diff:4,q:'When I arrived, he ____ (leave).',a:'had left',e:'过去的过去，用过去完成时'},{id:522,title:'介词用法',diff:2,q:'He arrived ____ a rainy morning.',a:'on',e:'具体某天早上用on'},{id:523,title:'动词辨析',diff:3,q:'Choose the right word: Please _____ down your name.',a:'write',e:'write down写下'},{id:524,title:'阅读策略',diff:3,q:'阅读时，如何处理不认识的单词？',a:'根据上下文猜词义',e:'阅读技巧'}];

window.topicsMath9 = [{id:701,title:'一元二次方程',diff:3,q:'解方程：x²-5x+6=0',a:'x₁=2, x₂=3',e:'因式分解：(x-2)(x-3)=0'},{id:702,title:'配方法',diff:3,q:'用配方法解：x²+4x-5=0',a:'x₁=1, x₂=-5',e:'配成(x+2)²=9'},{id:703,title:'求根公式',diff:3,q:'求根公式中，Δ>0时方程有几根？',a:'两个不相等的实数根',e:'判别式决定根的个数'},{id:704,title:'韦达定理',diff:4,q:'方程x²-3x+2=0的两根x₁+x₂=？',a:'3',e:'韦达定理：x₁+x₂=-b/a'},{id:705,title:'二次函数最值',diff:3,q:'求y=x²-4x+3的最小值',a:'-1',e:'顶点公式或配方法'},{id:706,title:'二次函数图像',diff:3,q:'抛物线y=ax²+bx+c开口向下，则a____0',a:'<',e:'开口向下a<0'},{id:707,title:'二次函数与方程',diff:4,q:'抛物线y=x²-4x+3与x轴的交点坐标是？',a:'(1,0)和(3,0)',e:'令y=0，解方程'},{id:708,title:'圆的综合',diff:4,q:'圆O半径5，P在圆内，OP=3，P到圆的最短距离是？',a:'2',e:'最短=半径-OP'},{id:709,title:'圆心角弧长',diff:3,q:'圆心角60°，半径6，弧长=？',a:'2π',e:'弧长公式：nπr/180'},{id:710,title:'扇形面积',diff:3,q:'圆心角120°，半径3，扇形面积=？',a:'3π',e:'面积=nπr²/360'},{id:711,title:'正多边形',diff:3,q:'正六边形的每个内角是？',a:'120°',e:'内角和=(n-2)×180°'},{id:712,title:'三角函数',diff:3,q:'sin30°+cos60°=？',a:'1',e:'sin30°=1/2, cos60°=1/2'},{id:713,title:'解直角三角形',diff:3,q:'在Rt△ABC中，sinA=3/5，cosA=？',a:'4/5',e:'sin²A+cos²A=1'},{id:714,title:'相似三角形',diff:4,q:'△ABC∽△DEF，相似比3:1，面积比=？',a:'9:1',e:'面积比=相似比的平方'},{id:715,title:'位似图形',diff:4,q:'两个位似图形一定相似吗？',a:'一定',e:'位似是特殊的相似'},{id:716,title:'二次函数平移',diff:3,q:'将y=x²的图像向上平移2个单位，解析式是？',a:'y=x²+2',e:'上加下减'},{id:717,title:'圆与直线的位置关系',diff:3,q:'圆x²+y²=25，直线y=5，与圆的位置关系是？',a:'相切',e:'d=r时相切'},{id:718,title:'概率综合',diff:3,q:'同时抛两枚硬币，都是正面朝上的概率是？',a:'1/4',e:'总情况4种'},{id:719,title:'反比例函数',diff:3,q:'反比例函数y=6/x，当x=-2时，y=？',a:'-3',e:'代入计算'},{id:720,title:'方程与函数综合',diff:4,q:'若一元二次方程x²+mx+4=0有实数根，m的取值范围？',a:'m≤-4或m≥4',e:'Δ≥0'},{id:721,title:'圆内接四边形',diff:3,q:'圆内接四边形的对角有什么关系？',a:'对角互补',e:'圆内接四边形性质'},{id:722,title:'三角函数应用',diff:3,q:'山坡坡角30°，沿坡走100m，上升了多少米？',a:'50m',e:'h=100×sin30°'},{id:723,title:'统计综合',diff:3,q:'数据2,3,3,4,5,6,6,6的众数是？',a:'6',e:'出现次数最多的数'},{id:724,title:'函数图像与性质',diff:4,q:'二次函数y=ax²+bx+c，a>0，b²-4ac=0，图像特点？',a:'开口向上，与x轴只有1个交点',e:'顶点在x轴上'}];

window.topicsChinese8 = [{id:601,title:'文言实词',diff:3,q:'解释"学而不厌"中"厌"的意思',a:'满足',e:'厌：满足'},{id:602,title:'文言虚词',diff:3,q:'"而"在"人不知而不愠"中的用法是？',a:'转折，却',e:'而：表转折'},{id:603,title:'句子翻译',diff:3,q:'翻译：三人行，必有我师焉',a:'几个人同行，其中必定有可以做我老师的人',e:'孔子学习态度'},{id:604,title:'名著阅读',diff:3,q:'《骆驼祥子》中祥子的最大梦想是什么？',a:'拥有一辆自己的车',e:'祥子三起三落'},{id:605,title:'说明顺序',diff:2,q:'说明文的三种顺序是？',a:'时间、空间、逻辑顺序',e:'常考说明方法'},{id:606,title:'论证方法',diff:3,q:'议论文中引用名人名言是什么论证方法？',a:'道理论证',e:'摆事实、讲道理'},{id:607,title:'记叙顺序',diff:2,q:'文章开头回忆往事，用了什么记叙顺序？',a:'倒叙',e:'先把结果说出来'},{id:608,title:'描写方法',diff:2,q:'"她的眼睛像星星一样明亮"是什么描写？',a:'比喻描写',e:'用比喻修辞的描写'},{id:609,title:'段落作用',diff:3,q:'文章开头第一段有什么作用？',a:'引出下文/设置悬念/点明主题',e:'开头段落作用'},{id:610,title:'标题含义',diff:3,q:'分析散文标题"背影"的深层含义',a:'父亲的背影，蕴含深沉父爱',e:'表层义+深层义'},{id:611,title:'句子赏析',diff:3,q:'从修辞角度赏析："春天像刚落地的娃娃..."',a:'比喻、拟人，赞美春天的生机',e:'修辞+内容+情感'},{id:612,title:'人物形象',diff:3,q:'分析《藤野先生》中藤野先生的性格特点',a:'正直、热情、没有民族偏见',e:'结合文中事例'},{id:613,title:'古诗词鉴赏',diff:3,q:'"海内存知己，天涯若比邻"用了什么手法？',a:'对偶、夸张',e:'字数相等、结构相同'},{id:614,title:'诗歌情感',diff:3,q:'《望岳》表达了诗人怎样的情感？',a:'赞美祖国山河，抒发抱负',e:'杜甫早期诗作'},{id:615,title:'文言文断句',diff:3,q:'用"/"给"学而时习之不亦说乎"断句',a:'学而时习之/不亦说乎',e:'按意义停顿'},{id:616,title:'语法知识',diff:2,q:'下列句子中"之"的用法不同于其他的是？',a:'见选项',e:'之：代词、助词、动词'},{id:617,title:'语段压缩',diff:3,q:'将100字的段落压缩为30字',a:'见段落',e:'保留主要信息'},{id:618,title:'口语交际',diff:2,q:'如何劝导沉迷网络的同学？',a:'注意称呼、语气',e:'委婉劝导'},{id:619,title:'说明方法',diff:2,q:'"石油的储量是中东地区的三倍"用了什么说明方法？',a:'列数字',e:'用具体数字说明'},{id:620,title:'议论文结构',diff:3,q:'议论文常见的结构是？',a:'总分总',e:'引论、本论、结论'},{id:621,title:'记叙文线索',diff:3,q:'《背影》以什么为线索？',a:'父亲的背影',e:'找出贯穿全文的脉络'},{id:622,title:'古文翻译',diff:3,q:'翻译"学而不思则罔，思而不学则殆"',a:'只学习不思考会迷惑，只思考不学习会倦怠',e:'学和思要结合'},{id:623,title:'修辞手法',diff:2,q:'"飞流直下三千尺"用了什么修辞？',a:'夸张',e:'夸大事实'},{id:624,title:'作文立意',diff:3,q:'如何让作文立意更深刻？',a:'由现象到本质，由个人到社会',e:'层层深入思考'}];

window.topicsEnglish9 = [{id:801,title:'语法综合',diff:3,q:'By next year, I ____ (study) English for 5 years.',a:'will have studied',e:'by+将来时间，将来完成时'},{id:802,title:'被动语态',diff:3,q:'改写：They are building a new school.',a:'A new school is being built.',e:'现在进行时的被动'},{id:803,title:'复合句',diff:3,q:'合并：He didn\'t come. He was ill.',a:'He didn\'t come because he was ill.',e:'用because连接'},{id:804,title:'定语从句',diff:4,q:'用定语从句改写：The girl is my sister. She is singing.',a:'The girl who is singing is my sister.',e:'先行词在从句中作主语'},{id:805,title:'非谓语',diff:4,q:'I have a lot of homework ____ (do).',a:'to do',e:'have sth to do有...要做'},{id:806,title:'交际用语',diff:2,q:'如何用英语表达"我完全同意你的观点"？',a:"I can't agree more.",e:'同意的表达方式'},{id:807,title:'阅读策略',diff:3,q:'阅读理解中，如何快速找到主旨大意？',a:'看首段和末段',e:'阅读技巧'},{id:808,title:'完形技巧',diff:3,q:'完形填空中，线索词的作用是什么？',a:'帮助理解上下文，确定答案',e:'线索分析法'},{id:809,title:'写作结构',diff:3,q:'英语作文一般分为几部分？',a:'三部分：开头、主体、结尾',e:'作文结构'},{id:810,title:'词汇辨析',diff:3,q:'too much, much too, too many的用法区别',a:'too much+不可数，much too+adj，too many+复数',e:'词组辨析'},{id:811,title:'词性转换',diff:2,q:'派生：success的形容词和副词形式',a:'successful / successfully',e:'名词→形容词→副词'},{id:812,title:'句型转换',diff:3,q:'He spent two hours finishing the work. 改写',a:'It took him two hours to finish the work.',e:'spend→take句型'},{id:813,title:'疑问句',diff:2,q:'改为反意疑问句：She likes English, ____?',a:"doesn't she",e:'前肯后否'},{id:814,title:'感叹句',diff:2,q:'改为感叹句：The flower is beautiful.',a:'How beautiful the flower is!',e:'How+adj+主谓'},{id:815,title:'阅读主旨',diff:3,q:'Which is the best title for the passage?',a:'见文章内容',e:'标题要概括全文'},{id:816,title:'时态辨析',diff:3,q:'选择正确时态：Look! The baby ____ (sleep).',a:'is sleeping',e:'Look表示现在进行'},{id:817,title:'被动语态深入',diff:3,q:'改为被动语态：Someone has stolen my bike.',a:'My bike has been stolen.',e:'现在完成时的被动'},{id:818,title:'情态动词综合',diff:3,q:'You ____ (must) be tired after the long trip.',a:'must',e:'must be表示推测'},{id:819,title:'名词性从句',diff:4,q:'____ he will come is not sure.',a:'Whether',e:'if不能位于句首'},{id:820,title:'省略句',diff:3,q:'—Will you go? —Yes, I ____.',a:'will',e:'省略重复部分'},{id:821,title:'语序问题',diff:3,q:'I wonder ____.',a:'where he lives',e:'宾语从句用陈述语序'},{id:822,title:'分词作状语',diff:4,q:'____ (see) from the hill, the town looks beautiful.',a:'Seen',e:'分词作状语，主语一致用-ing'},{id:823,title:'写作开头',diff:3,q:'如何写一个吸引人的英语作文开头？',a:'用问句或引用名言',e:'写作技巧'},{id:824,title:'阅读细节',diff:3,q:'阅读时，如何快速定位细节信息？',a:'先看题目，再回原文找关键词',e:'阅读策略'}];
// 九年级语文母题
window.topicsChinese9 = [{id:'C9-001',title:'《岳阳楼记》表达了作者怎样的政治理想？',q:'《岳阳楼记》表达了作者怎样的政治理想？',options:['先天下之忧而忧，后天下之乐而乐', '安得广厦千万间', '人生自古谁无死', '采菊东篱下'],answer:0,a:0,e:'表达了作者\"先天下之忧而忧，后天下之乐而乐\"的政治理想。',explanation:'表达了作者\"先天下之忧而忧，后天下之乐而乐\"的政治理想。'},{id:'C9-002',title:'《出师表》中诸葛亮提出的治国建议的核心是什么？',q:'《出师表》中诸葛亮提出的治国建议的核心是什么？',options:['依法治国', '任人唯贤', '以德服人', '兼爱非攻'],answer:1,a:1,e:'核心是推荐人才，任人唯贤。',explanation:'核心是推荐人才，任人唯贤。'},{id:'C9-003',title:'《醉翁亭记》的主旨句是？',q:'《醉翁亭记》的主旨句是？',options:['醉翁之意不在酒', '在乎山水之间也', '山水之乐，得之心而寓之酒也', '人知从太守游而乐'],answer:0,a:0,e:'主旨句是\"醉翁之意不在酒\"，表达了作者寄情山水的情怀。',explanation:'主旨句是\"醉翁之意不在酒\"，表达了作者寄情山水的情怀。'},{id:'C9-004',title:'《鱼我所欲也》论证的核心方法是？',q:'《鱼我所欲也》论证的核心方法是？',options:['比喻论证', '对比论证', '类比论证', '举例论证'],answer:1,a:1,e:'运用了\"舍生取义\"与\"见利忘义\"的对比论证。',explanation:'运用了\"舍生取义\"与\"见利忘义\"的对比论证。'},{id:'C9-005',title:'《生于忧患，死于安乐》的中心论点是？',q:'《生于忧患，死于安乐》的中心论点是？',options:['生于忧患', '死于安乐', '然后知生于忧患而死于安乐也', '天将降大任于斯人'],answer:2,a:2,e:'文章通过列举历史人物，论证了忧患使人生存、安乐使人灭亡的道理。',explanation:'文章通过列举历史人物，论证了忧患使人生存、安乐使人灭亡的道理。'},{id:'C9-006',title:'《曹刿论战》中\"远谋\"体现在哪些方面？',q:'《曹刿论战》中\"远谋\"体现在哪些方面？',options:['政治上取信于民', '军事上知己知彼', '战争中善于观察', '战后总结经验'],answer:0,a:0,e:'曹刿认为\"小大之狱，虽不能察，必以情\"是作战的根本条件。',explanation:'曹刿认为\"小大之狱，虽不能察，必以情\"是作战的根本条件。'},{id:'C9-007',title:'《送东阳马生序》的主题是？',q:'《送东阳马生序》的主题是？',options:['送别之情', '勤奋学习', '安贫乐道', '思念故友'],answer:1,a:1,e:'通过自身经历勉励后辈勤奋学习。',explanation:'通过自身经历勉励后辈勤奋学习。'},{id:'C9-008',title:'《论语》中\"己所不欲，勿施于人\"属于儒家哪一核...',q:'《论语》中\"己所不欲，勿施于人\"属于儒家哪一核心思想？',options:['仁', '义', '礼', '孝'],answer:0,a:0,e:'体现儒家\"仁\"的核心思想。',explanation:'体现儒家\"仁\"的核心思想。'},{id:'C9-009',title:'《马说》中千里马被埋没的根本原因是？',q:'《马说》中千里马被埋没的根本原因是？',options:['食不饱', '力不足', '才美不外见', '食马者不知其能千里'],answer:3,a:3,e:'根本原因是统治者不能识别和重用人才。',explanation:'根本原因是统治者不能识别和重用人才。'},{id:'C9-010',title:'《白雪歌送武判官归京》中咏雪的千古名句是？',q:'《白雪歌送武判官归京》中咏雪的千古名句是？',options:['北风卷地白草折', '胡天八月即飞雪', '忽如一夜春风来', '纷纷暮雪下辕门'],answer:2,a:2,e:'\"忽如一夜春风来，千树万树梨花开\"以春花喻冬雪，成为咏雪名句。',explanation:'\"忽如一夜春风来，千树万树梨花开\"以春花喻冬雪，成为咏雪名句。'},{id:'C9-011',title:'《茅屋为秋风所破歌》表达了诗人怎样的情怀？',q:'《茅屋为秋风所破歌》表达了诗人怎样的情怀？',options:['个人悲叹', '忧国忧民', '隐居避世', '及时行乐'],answer:1,a:1,e:'杜甫由己及人，推己及人，表达了对天下寒士的关爱。',explanation:'杜甫由己及人，推己及人，表达了对天下寒士的关爱。'},{id:'C9-012',title:'《过零丁洋》中表明作者以死明志的诗句是？',q:'《过零丁洋》中表明作者以死明志的诗句是？',options:['辛苦遭逢起一经', '干戈寥落四周星', '人生自古谁无死', '留取丹心照汗青'],answer:3,a:3,e:'\"留取丹心照汗青\"表达了诗人以死报国的决心。',explanation:'\"留取丹心照汗青\"表达了诗人以死报国的决心。'},{id:'C9-013',title:'《天净沙·秋思》的情感基调是？',q:'《天净沙·秋思》的情感基调是？',options:['欢快', '悲凉', '激昂', '闲适'],answer:1,a:1,e:'通过萧瑟秋景和漂泊游子形象，表达浓烈的思乡之情。',explanation:'通过萧瑟秋景和漂泊游子形象，表达浓烈的思乡之情。'},{id:'C9-014',title:'《水调歌头·明月几时有》的词眼是？',q:'《水调歌头·明月几时有》的词眼是？',options:['明月几时有', '我欲乘风归去', '高处不胜寒', '但愿人长久'],answer:3,a:3,e:'\"但愿人长久，千里共婵娟\"表达了词人对亲人的美好祝愿。',explanation:'\"但愿人长久，千里共婵娟\"表达了词人对亲人的美好祝愿。'},{id:'C9-015',title:'《春望》中\"烽火连三月\"的下一句是？',q:'《春望》中\"烽火连三月\"的下一句是？',options:['家书抵万金', '白头搔更短', '恨别鸟惊心', '浑欲不胜簪'],answer:0,a:0,e:'这句诗表达了战乱时期对亲人的思念。',explanation:'这句诗表达了战乱时期对亲人的思念。'},{id:'C9-016',title:'《渔家傲·秋思》的情感是？',q:'《渔家傲·秋思》表达了怎样的情感？',options:['乐观旷达', '思乡爱国', '隐居归隐', '怀才不遇'],answer:1,a:1,e:'词中\"浊酒一杯家万里\"表达了戍边将士的思乡之情。',explanation:'词中\"浊酒一杯家万里\"表达了戍边将士的思乡之情。'},{id:'C9-017',title:'《江城子·密州出猎》的主题是？',q:'《江城子·密州出猎》的主题是？',options:['田园生活', '报国杀敌', '送别友人', '思乡之情'],answer:1,a:1,e:'表达了苏轼渴望报效国家、建功立业的壮志豪情。',explanation:'表达了苏轼渴望报效国家、建功立业的壮志豪情。'},{id:'C9-018',title:'《破阵子·为陈同甫赋壮词以寄之》的情感是？',q:'《破阵子·辛弃疾》表达了怎样的情感？',options:['田园闲适', '壮志难酬', '离愁别绪', '山水田园'],answer:1,a:1,e:'词中\"可怜白发生\"表达了壮志未酬的悲愤。',explanation:'词中\"可怜白发生\"表达了壮志未酬的悲愤。'},{id:'C9-019',title:'《满江红》作者是？',q:'《满江红·写怀》的作者是？',options:['苏轼', '辛弃疾', '岳飞', '陆游'],answer:2,a:2,e:'岳飞是南宋抗金名将，《满江红》是其代表作。',explanation:'岳飞是南宋抗金名将，《满江红》是其代表作。'},{id:'C9-020',title:'《十五从军征》反映的主题是？',q:'《十五从军征》反映了什么社会问题？',options:['科举制度', '兵役制度', '赋税繁重', '土地兼并'],answer:1,a:1,e:'反映了古代兵役制度的残酷和百姓的苦难。',explanation:'反映了古代兵役制度的残酷和百姓的苦难。'},{id:'C9-021',title:'《白雪歌送武判官归京》中的\"胡琴琵琶与羌笛\"是用来？',q:'《白雪歌送武判官归京》中的\"胡琴琵琶与羌笛\"是用来？',options:['庆祝凯旋', '送别友人', '战争动员', '宫廷演奏'],answer:1,a:1,e:'渲染了送别时的悲凉气氛。',explanation:'渲染了送别时的悲凉气氛。'},{id:'C9-022',title:'《南乡子·登京口北固亭有怀》的作者是？',q:'《南乡子·登京口北固亭有怀》的作者是？',options:['苏轼', '辛弃疾', '李清照', '岳飞'],answer:1,a:1,e:'辛弃疾的代表作，借古讽今，抒发爱国情怀。',explanation:'辛弃疾的代表作，借古讽今，抒发爱国情怀。'},{id:'C9-023',title:'《山坡羊·潼关怀古》的主旨是？',q:'《山坡羊·潼关怀古》的主旨句是？',options:['兴，百姓苦', '亡，百姓苦', '宫阙万间都做了土', '伤心秦汉经行处'],answer:1,a:1,e:'\"兴，百姓苦；亡，百姓苦\"揭示了封建社会的本质。',explanation:'\"兴，百姓苦；亡，百姓苦\"揭示了封建社会的本质。'},{id:'C9-024',title:'《定风波》表达了词人怎样的态度？',q:'《定风波·莫听穿林打叶声》表达了词人怎样的态度？',options:['消沉悲观', '旷达乐观', '愤世嫉俗', '归隐山林'],answer:1,a:1,e:'表达了苏轼面对人生风雨时的旷达超脱态度。',explanation:'表达了苏轼面对人生风雨时的旷达超脱态度。'}];

// 物理母题
window.topicsPhysics = [
    // 力学部分
    {id: 'P-001', question: '一个物体在水平面上做匀速直线运动，它受到的摩擦力为10N，若用15N的水平拉力使其运动，则摩擦力变为多少？', options: ['10N', '15N', '5N', '25N'], answer: 0, explanation: '滑动摩擦力只与压力和接触面粗糙程度有关，与拉力大小无关，仍为10N。'},
    {id: 'P-002', question: '一艘轮船从长江驶入大海，它受到的浮力如何变化？船身是上浮还是下沉？', options: ['浮力变大，船下沉', '浮力变小，船下沉', '浮力不变，船身略微上浮', '浮力不变，船身略微下沉'], answer: 2, explanation: '轮船漂浮，浮力等于重力。驶入海水后，海水密度增大，为达到相同浮力，排开体积减小，船身上浮。'},
    {id: 'P-003', question: '跳伞运动员在匀速下降过程中，其机械能如何变化？', options: ['动能不变，势能减小，机械能减小', '动能增大，势能减小，机械能不变', '动能不变，势能不变，机械能不变', '动能减小，势能减小，机械能减小'], answer: 0, explanation: '匀速下降，速度不变，动能不变；高度减小，势能减小；机械能=动能+势能，所以机械能减小（转化为内能）。'},
    {id: 'P-004', question: '用滑轮组提升重物，若物体重500N，动滑轮重50N，不计绳重和摩擦，则实际拉力为多少？', options: ['275N', '550N', '183N', '500N'], answer: 0, explanation: '使用滑轮组，n=2（假设2段绳子），F=(G物+G动)/n=(500+50)/2=275N。'},
    {id: 'P-005', question: '小明用凸透镜观察到正立放大的虚像，此时物距u与焦距f的关系是？', options: ['u>2f', 'f<u<2f', 'u<f', 'u=2f'], answer: 2, explanation: '凸透镜成虚像的条件是物距小于焦距，此时成正立放大的虚像。'},
    // 电学部分
    {id: 'P-006', question: '两个电阻R1=10Ω，R2=20Ω，串联接在电压为12V的电路中，则R1两端的电压为多少？', options: ['4V', '6V', '8V', '12V'], answer: 0, explanation: '串联分压，U1:U2=R1:R2=1:2，U1=12V×1/3=4V。'},
    {id: 'P-007', question: '将"6V 3W"的灯泡接在9V的电路中，需要串联一个多大的电阻才能正常发光？', options: ['3Ω', '6Ω', '9Ω', '12Ω'], answer: 1, explanation: '灯泡电阻R=U²/P=36/3=12Ω；正常电流I=P/U=3/6=0.5A；串联电阻R=(9-6)/0.5=6Ω。'},
    {id: 'P-008', question: '家庭电路中，电热水器单独工作30分钟，电能表转盘转过1500圈，已知电能表参数为3000r/kWh，则热水器功率为多少？', options: ['1000W', '1500W', '2000W', '3000W'], answer: 0, explanation: '1500r÷3000r/kWh=0.5kWh；P=W/t=0.5kWh÷0.5h=1000W。'},
    {id: 'P-009', question: '下列哪种情况可以防止触电？', options: ['用湿手触摸开关', '发现有人触电立即用手拉', '发现输电线断落时单脚跳离开', '用铜丝代替保险丝'], answer: 2, explanation: '发现输电线断落时，应单脚跳离开，避免形成跨步电压触电。'},
    {id: 'P-010', question: '电动机的工作原理是什么？', options: ['电磁感应', '电流的磁效应', '磁场对通电导线的作用', '磁化现象'], answer: 2, explanation: '电动机利用磁场对通电导线的作用力，将电能转化为机械能。'},
    // 热学部分
    {id: 'P-011', question: '质量为1kg的铝块，温度从20℃升高到100℃，需要吸收多少热量？（铝的比热容c=0.88×10³J/(kg·℃)）', options: ['7.04×10⁴J', '8.8×10⁴J', '7.04×10⁵J', '8.8×10⁴J'], answer: 0, explanation: 'Q=cmΔt=0.88×10³×1×80=7.04×10⁴J。'},
    {id: 'P-012', question: '下列哪种情况中，内能减小的是？', options: ['铁块熔化成铁水', '水蒸气液化', '冰块熔化', '压缩气体温度升高'], answer: 1, explanation: '水蒸气液化时对外放热，内能减小。'},
    {id: 'P-013', question: '夏天从冰箱里拿出的饮料瓶外壁出现水珠，发生的物态变化是？', options: ['汽化', '液化', '凝华', '凝固'], answer: 1, explanation: '空气中的水蒸气遇到冷的饮料瓶液化形成水珠。'},
    // 光学部分
    {id: 'P-014', question: '在清澈的湖边可以看到天空中的云彩倒影，关于这个现象说法正确的是？', options: ['是光的直线传播', '是光的反射', '是光的折射', '是光的色散'], answer: 1, explanation: '平静的水面相当于平面镜，云彩在水中的倒影是光的反射现象。'},
    {id: 'P-015', question: '物体放在凸透镜前20cm处，在光屏上得到倒立缩小的像，则凸透镜的焦距可能是？', options: ['5cm', '10cm', '15cm', '25cm'], answer: 1, explanation: '成倒立缩小像时，u>2f，即20cm>2f，所以f<10cm。'},
    // 声学部分
    {id: 'P-016', question: '一辆汽车以72km/h的速度驶向高山，司机鸣笛后4秒听到回声，则鸣笛时汽车距山脚多少米？（声速取340m/s）', options: ['640m', '680m', '700m', '1360m'], answer: 1, explanation: '汽车速度v=72km/h=20m/s，4s内汽车行驶80m，声音传播距离=340×4=1360m，鸣笛时距离=(1360+80)/2=720m...复杂计算题。'},
    {id: 'P-017', question: '下列哪种物质传播声音的速度最快？', options: ['空气', '水', '钢铁', '木头'], answer: 2, explanation: '声音在固体中传播最快，钢铁是固体，传播速度最快。'},
    // 能量部分
    {id: 'P-018', question: '下列能量转化中，机械能转化为电能的是？', options: ['发电机发电', '电动机工作', '电池充电', '电炉发热'], answer: 0, explanation: '发电机利用电磁感应原理，将机械能转化为电能。'},
    {id: 'P-019', question: '不计阻力，从同一高度自由下落的苹果和羽毛，哪个先落地？', options: ['苹果先落地', '羽毛先落地', '同时落地', '无法确定'], answer: 0, explanation: '不考虑空气阻力时，所有物体下落加速度相同，但苹果密度大，空气阻力影响小，先落地。'},
    {id: 'P-020', question: '核能属于哪种能源？', options: ['化石能源', '可再生能源', '一次能源', '二次能源'], answer: 2, explanation: '核能是直接从自然界获取的能源，属于一次能源；也是不可再生能源。'}
];

// 化学母题
window.topicsChemistry = [
    // 酸碱盐部分
    {id: 'C-001', question: '下列溶液能使紫色石蕊试液变蓝色的是？', options: ['稀盐酸', '稀硫酸', '氢氧化钠溶液', '蒸馏水'], answer: 2, explanation: '紫色石蕊遇碱变蓝，氢氧化钠是碱。'},
    {id: 'C-002', question: '胃酸过多的病人可服用含氢氧化铝的药物来中和胃酸，其化学反应类型是？', options: ['化合反应', '分解反应', '置换反应', '复分解反应'], answer: 3, explanation: 'Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O，属于酸碱中和反应，是复分解反应。'},
    {id: 'C-003', question: '下列物质中，属于有机物的是？', options: ['二氧化碳', '碳酸钠', '甲烷', '一氧化碳'], answer: 2, explanation: '甲烷(CH₄)是含碳的化合物，属于有机物。'},
    {id: 'C-004', question: 'NaCl、NaOH、Na₂SO₄三种溶液共同含有的离子是？', options: ['Na⁺', 'Cl⁻', 'OH⁻', 'SO₄²⁻'], answer: 0, explanation: '三种物质都含有钠离子Na⁺。'},
    {id: 'C-005', question: '鉴别稀盐酸和稀硫酸，最好选用下列哪种试剂？', options: ['石蕊试液', '酚酞试液', '氯化钡溶液', '氢氧化钠溶液'], answer: 2, explanation: 'BaCl₂与H₂SO₄生成BaSO₄白色沉淀，而与HCl不反应。'},
    // 金属部分
    {id: 'C-006', question: '下列金属中，活动性最强的是？', options: ['Fe', 'Zn', 'Mg', 'Cu'], answer: 2, explanation: '金属活动性顺序：K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au。'},
    {id: 'C-007', question: '将铁钉浸入硫酸铜溶液中，观察到的现象是？', options: ['铁钉表面产生红色物质，溶液由蓝色变为浅绿色', '铁钉溶解，溶液变为蓝色', '有气泡产生', '无明显现象'], answer: 0, explanation: 'Fe + CuSO₄ → FeSO₄ + Cu，铁钉表面覆盖红色铜，溶液由蓝变绿。'},
    {id: 'C-008', question: '下列金属中，不能与稀盐酸反应生成氢气的是？', options: ['Mg', 'Zn', 'Fe', 'Cu'], answer: 3, explanation: 'Cu在金属活动性顺序中位于H之后，不与酸反应生成氢气。'},
    // 物质构成部分
    {id: 'C-009', question: '保持水的化学性质的最小粒子是？', options: ['氢原子', '氧原子', '水分子', '氢气和氧气'], answer: 2, explanation: '分子是保持物质化学性质的最小粒子。'},
    {id: 'C-010', question: '下列关于原子结构的说法，正确的是？', options: ['原子核带负电', '原子核由质子和中子构成', '核外电子数等于质子数', '原子核占据原子全部质量'], answer: 2, explanation: '原子中核外电子数=质子数（原子序数），整个原子显电中性。'},
    // 化学反应部分
    {id: 'C-011', question: '化学反应前后，肯定不变的是？', options: ['物质种类', '分子种类', '原子数目', '分子数目'], answer: 2, explanation: '根据质量守恒定律，化学反应前后原子种类和数目不变。'},
    {id: 'C-012', question: '下列反应属于氧化反应但不是化合反应的是？', options: ['碳+氧气→二氧化碳', '石蜡+氧气→二氧化碳+水', '氧化汞→汞+氧气', '碳酸氢铵→氨气+水+二氧化碳'], answer: 1, explanation: '石蜡燃烧是氧化反应，但生成物有两种，不是化合反应。'},
    {id: 'C-013', question: '配平化学方程式：Fe + O₂ → Fe₂O₃，其系数正确的是？', options: ['2,3,2', '4,3,2', '3,2,1', '4,2,3'], answer: 1, explanation: '4Fe + 3O₂ → 2Fe₂O₃，满足原子守恒。'},
    // 溶液部分
    {id: 'C-014', question: '20℃时，NaCl的溶解度为36g，此时它的饱和溶液的质量分数为？', options: ['26.5%', '36%', '40%', '44%'], answer: 0, explanation: '质量分数 = 溶解度/(100+溶解度) = 36/136 ≈ 26.5%。'},
    {id: 'C-015', question: '将100g 10%的蔗糖溶液稀释到200g，稀释后溶液的质量分数为？', options: ['2.5%', '5%', '10%', '20%'], answer: 1, explanation: '溶质质量不变：100×10%=10g；稀释后质量分数=10/200=5%。'},
    // 空气与氧气部分
    {id: 'C-016', question: '空气中含量最多的气体是？', options: ['氧气', '氮气', '二氧化碳', '稀有气体'], answer: 1, explanation: '空气中氮气约占78%，氧气约占21%。'},
    {id: 'C-017', question: '下列物质在氧气中燃烧，产生刺激性气味气体的是？', options: ['铁丝', '木炭', '硫粉', '红磷'], answer: 2, explanation: 'S + O₂ → SO₂，二氧化硫是有刺激性气味的气体。'},
    // 碳和碳的氧化物
    {id: 'C-018', question: '金刚石和石墨的物理性质差异很大的原因是？', options: ['原子种类不同', '原子数目不同', '碳原子排列方式不同', '它们是完全不同的物质'], answer: 2, explanation: '金刚石和石墨都由碳原子构成，但原子排列方式不同导致物理性质差异。'},
    {id: 'C-019', question: '检验CO₂的方法是？', options: ['点燃', '加入澄清石灰水', '加入紫色石蕊', '称量质量'], answer: 1, explanation: 'CO₂能使澄清石灰水变浑浊：Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O。'},
    {id: 'C-020', question: '下列气体中，能使带火星的木条复燃的是？', options: ['空气', '氮气', '氧气', '二氧化碳'], answer: 2, explanation: '氧气能支持燃烧，使带火星的木条复燃。'}
];






// ====== 物理题目（5-9年级）======
window.topicsPhysics8 = [{id:401,title:'机械运动',diff:2,q:'一个物体做匀速直线运动，5秒内通过25米，求速度',a:'5m/s',e:'v=s/t=25/5=5m/s'},{id:402,title:'参照物',diff:2,q:'坐在行驶的汽车里，路边的树在向哪个方向运动？',a:'向后',e:'以车为参照物，树向后运动'},{id:403,title:'长度测量',diff:1,q:'用刻度尺测量物体长度，正确读数是2.35cm，测量结果应记为？',a:'2.35cm',e:'估读到分度值下一位'},{id:404,title:'时间测量',diff:2,q:'小明跑100米用了12.5秒，他的平均速度是？',a:'8m/s',e:'v=100/12.5=8m/s'},{id:405,title:'速度公式',diff:2,q:'汽车以72km/h的速度行驶，合多少m/s？',a:'20m/s',e:'72÷3.6=20m/s'},{id:406,title:'声现象',diff:2,q:'声音在15℃空气中传播速度约是多少？',a:'340m/s',e:'声速与温度有关'},{id:407,title:'音调与频率',diff:2,q:'物体振动越快，音调越？',a:'高',e:'频率越高，音调越高'},{id:408,title:'响度与振幅',diff:2,q:'用更大的力敲鼓，鼓声变？',a:'更响',e:'振幅越大，响度越大'},{id:409,title:'音色',diff:1,q:'不同乐器演奏同一首曲子，我们能区分是因为？',a:'音色不同',e:'音色由发声体本身决定'},{id:410,title:'回声测距',diff:3,q:'对着山崖喊话，2秒后听到回声，山崖距离多远？(声速340m/s)',a:'340m',e:'s=vt/2=340×2/2=340m'},{id:411,title:'温度计原理',diff:2,q:'常用温度计是利用液体什么性质制成的？',a:'热胀冷缩',e:'温度计原理'},{id:412,title:'物态变化',diff:2,q:'冬天，室外的水结冰是什么物态变化？',a:'凝固',e:'液态变固态'},{id:413,title:'熔化与凝固',diff:2,q:'0℃的冰和0℃的水，哪个内能更大？',a:'0℃的水',e:'水凝固放热，内能更大'},{id:414,title:'汽化',diff:2,q:'湿衣服变干是什么物态变化？',a:'汽化（蒸发）',e:'液态变气态'},{id:415,title:'液化',diff:2,q:'冬天呼出的白气是什么？',a:'液化的小水珠',e:'水蒸气遇冷液化'},{id:416,title:'升华与凝华',diff:3,q:'放在衣柜里的樟脑丸变小了，是什么现象？',a:'升华',e:'固态直接变气态'},{id:417,title:'光的直线传播',diff:2,q:'小孔成像说明光沿什么传播？',a:'直线',e:'光沿直线传播'},{id:418,title:'光的反射',diff:2,q:'入射光线与镜面的夹角是30°，反射角是？',a:'60°',e:'反射角=90°-30°=60°'},{id:431,title:'光的折射',diff:3,q:'光从空气斜射入水中，折射角和入射角哪个更小？',a:'折射角更小',e:'光从光疏介质进入光密介质'},{id:432,title:'凸透镜成像',diff:3,q:'物体放在凸透镜2倍焦距处，成像特点是？',a:'倒立、等大的实像',e:'u=2f时，成倒立等大的实像'},{id:433,title:'质量与密度',diff:2,q:'一块铁切去一半，剩余部分的质量和密度如何变化？',a:'质量减半，密度不变',e:'质量与体积成正比，密度是物质属性'},{id:434,title:'力的作用效果',diff:2,q:'力的三要素是？',a:'大小、方向、作用点',e:'影响力的作用效果'},{id:435,title:'二力平衡',diff:3,q:'静止在桌面上的书，受到哪两个力平衡？',a:'重力和支持力',e:'二力平衡条件'},{id:436,title:'摩擦力',diff:2,q:'滑动摩擦力与什么因素有关？',a:'压力和接触面粗糙程度',e:'与接触面积、速度无关'}];

window.topicsPhysics9 = [{id:451,title:'欧姆定律',diff:3,q:'电阻两端的电压为6V，电阻为3Ω，电流是多少？',a:'2A',e:'I=U/R=6/3=2A'},{id:452,title:'电阻',diff:2,q:'导体的电阻与什么有关？',a:'材料、长度、横截面积、温度',e:'电阻是导体本身的性质'},{id:453,title:'串联电路',diff:3,q:'两个电阻R1=5Ω，R2=10Ω串联，总电阻是？',a:'15Ω',e:'串联R=R1+R2'},{id:454,title:'并联电路',diff:3,q:'两个电阻R1=5Ω，R2=10Ω并联，总电阻是？',a:'约3.3Ω',e:'并联1/R=1/R1+1/R2'},{id:455,title:'电功率',diff:3,q:'用电器两端电压220V，电流2A，电功率是？',a:'440W',e:'P=UI=220×2=440W'},{id:456,title:'电能',diff:2,q:'一盏灯100W，供电10小时，用电多少度？',a:'1度',e:'W=Pt=0.1kW×10h=1kWh'},{id:457,title:'焦耳定律',diff:3,q:'电流通过导体产生的热量与什么成正比？',a:'电流的平方、通电时间、电阻',e:'Q=I²Rt'},{id:458,title:'家庭电路',diff:2,q:'三孔插座中接地线的颜色通常是？',a:'黄绿双色',e:'安全用电常识'},{id:459,title:'安全用电',diff:2,q:'发现有人触电时，应该首先？',a:'切断电源',e:'安全用电原则'},{id:460,title:'磁现象',diff:2,q:'磁体上磁性最强的部位叫什么？',a:'磁极',e:'每个磁体有两个磁极'},{id:461,title:'磁场',diff:2,q:'地球周围存在的磁场叫什么？',a:'地磁场',e:'地磁场的应用'},{id:462,title:'电流的磁效应',diff:2,q:'通电导体周围存在什么？',a:'磁场',e:'奥斯特实验'},{id:463,title:'电磁铁',diff:2,q:'电磁铁磁性强弱与什么有关？',a:'电流大小、线圈匝数、有无铁芯',e:'电磁铁应用'},{id:464,title:'磁场对电流的作用',diff:3,q:'通电导体在磁场中会受到什么力？',a:'安培力',e:'左手定则判断方向'},{id:465,title:'电功率公式',diff:3,q:'已知电阻8Ω，电流2A，电功率是？',a:'32W',e:'P=I²R=4×8=32W'},{id:466,title:'电能计算',diff:3,q:'用电器功率1000W，工作2小时，用电多少焦？',a:'7200000J',e:'W=Pt=1000×7200=7200000J'},{id:467,title:'电路分析',diff:3,q:'两个相同灯泡串联，总电阻是单个灯泡的多少倍？',a:'2倍',e:'串联总电阻是各电阻之和'},{id:468,title:'电压关系',diff:3,q:'串联电路中，各部分电压与电阻有什么关系？',a:'成正比',e:'U1/U2=R1/R2'},{id:469,title:'电与热综合',diff:3,q:'电流通过电阻产生的热量公式是？',a:'Q=I²Rt',e:'焦耳定律公式'},{id:470,title:'电磁感应',diff:3,q:'闭合电路的一部分导体在磁场中运动，什么时候会产生电流？',a:'切割磁感线时',e:'电磁感应原理'},{id:471,title:'电动机原理',diff:3,q:'电动机的工作原理是什么？',a:'通电导体在磁场中受力',e:'电能转化为机械能'},{id:472,title:'发电机的原理',diff:3,q:'发电机的工作原理是什么？',a:'电磁感应',e:'机械能转化为电能'},{id:473,title:'动态电路',diff:4,q:'串联电路中，滑动变阻器滑片向右移动，总电阻如何变化？',a:'变大',e:'接入电路的电阻变大'},{id:474,title:'电路故障',diff:3,q:'串联电路中，一个灯泡短路，另一个灯泡亮度如何？',a:'变亮',e:'总电阻变小，总电流变大'}];

window.topicsChemistry9 = [{id:501,title:'化学变化与物理变化',diff:2,q:'蜡烛燃烧是什么变化？',a:'化学变化',e:'有新物质生成'},{id:502,title:'分子与原子',diff:2,q:'保持水化学性质的最小粒子是？',a:'水分子',e:'分子是保持化学性质的最小粒子'},{id:503,title:'原子的构成',diff:2,q:'原子核由什么粒子构成？',a:'质子和中子',e:'原子核组成'},{id:504,title:'元素',diff:2,q:'地壳中含量最多的元素是？',a:'氧',e:'地壳元素排名'},{id:505,title:'化学式',diff:2,q:'水的化学式是什么？',a:'H₂O',e:'水由氢氧元素组成'},{id:506,title:'化合价',diff:3,q:'根据化合价，氧化铝的化学式是？',a:'Al₂O₃',e:'Al:+3, O:-2'},{id:507,title:'质量守恒定律',diff:3,q:'化学反应前后，各物质的质量总和有什么关系？',a:'相等',e:'质量守恒'},{id:508,title:'化学方程式',diff:3,q:'配平：C + O₂ → CO₂',a:'C + O₂ =点燃= CO₂',e:'方程式要配平'},{id:509,title:'空气成分',diff:2,q:'空气中最多的气体是？',a:'氮气',e:'氮气约78%'},{id:510,title:'氧气性质',diff:2,q:'氧气能支持燃烧，体现什么性质？',a:'助燃性',e:'氧气特性'},{id:511,title:'制取氧气',diff:3,q:'实验室用KMnO₄制O₂的符号表达式？',a:'KMnO₄→K₂MnO₄+MnO₂+O₂',e:'加热高锰酸钾'},{id:512,title:'燃烧条件',diff:2,q:'燃烧需要满足哪三个条件？',a:'可燃物、氧气、着火点',e:'燃烧三要素'},{id:513,title:'水的组成',diff:2,q:'电解水的实验说明水由什么组成？',a:'氢元素和氧元素',e:'正氧负氢'},{id:514,title:'硬水软水',diff:2,q:'区分硬水和软水的方法是？',a:'加肥皂水',e:'硬水泡沫少'},{id:535,title:'化学方程式配平',diff:3,q:'配平：Fe + O2 → Fe2O3',a:'4Fe + 3O2 = 2Fe2O3',e:'原子个数守恒'},{id:536,title:'溶解度',diff:3,q:'20°C时，NaCl的溶解度是36g/100g水，则该温度下的饱和溶液质量分数是？',a:'约26.5%',e:'w=36/(100+36)×100%'},{id:537,title:'酸碱指示剂',diff:2,q:'紫色石蕊试液遇酸变什么颜色？',a:'红色',e:'石蕊遇酸变红'},{id:538,title:'酸的通性',diff:3,q:'稀盐酸和稀硫酸都能与什么反应生成氢气？',a:'活泼金属',e:'酸+金属→盐+氢气'},{id:539,title:'碱的通性',diff:3,q:'氢氧化钠暴露在空气中会变质，为什么？',a:'与CO₂反应',e:'2NaOH+CO₂=Na₂CO₃+H₂O'},{id:540,title:'中和反应',diff:3,q:'胃酸过多可以服用氢氧化铝来治疗，原理是？',a:'中和反应',e:'酸+碱→盐+水'},{id:541,title:'盐的溶解性',diff:3,q:'下列物质中，能溶于水的是？',a:'NaCl',e:'钾钠铵盐都可溶'},{id:542,title:'复分解反应',diff:3,q:'复分解反应发生的条件是？',a:'有沉淀、气体或水生成',e:'三种情况之一'},{id:543,title:'粗盐提纯',diff:3,q:'粗盐提纯的步骤是？',a:'溶解、过滤、蒸发结晶',e:'分离不溶物'},{id:544,title:'离子检验',diff:3,q:'如何检验溶液中是否有Cl⁻？',a:'加AgNO₃和稀硝酸',e:'产生白色沉淀不溶于稀硝酸'}];

// ====== Topics整合对象（V99新增）======

window.topicsChemistry8 = [
    {id:801,title:'化学变化与物理变化',diff:2,q:'蜡烛燃烧是什么变化？',a:'化学变化',e:'有新物质生成'},
    {id:802,title:'分子与原子',diff:2,q:'保持水化学性质的最小粒子是？',a:'水分子',e:'分子是保持化学性质的最小粒子'},
    {id:803,title:'原子的构成',diff:2,q:'原子核由什么粒子构成？',a:'质子和中子',e:'原子核组成'},
    {id:804,title:'元素',diff:2,q:'地壳中含量最多的元素是？',a:'氧',e:'地壳元素排名'},
    {id:805,title:'化学式',diff:2,q:'水的化学式是什么？',a:'H₂O',e:'水由氢氧元素组成'},
    {id:806,title:'化合价',diff:3,q:'根据化合价，氧化铝的化学式是？',a:'Al₂O₃',e:'Al:+3, O:-2'},
    {id:807,title:'质量守恒定律',diff:3,q:'化学反应前后，各物质的质量总和有什么关系？',a:'相等',e:'质量守恒'},
    {id:808,title:'化学方程式',diff:3,q:'配平：C + O₂ → CO₂',a:'C + O₂ =点燃= CO₂',e:'方程式要配平'},
    {id:809,title:'空气成分',diff:2,q:'空气中最多的气体是？',a:'氮气',e:'氮气约78%'},
    {id:810,title:'氧气性质',diff:2,q:'氧气能支持燃烧，体现什么性质？',a:'助燃性',e:'氧气特性'},
    {id:811,title:'制取氧气',diff:3,q:'实验室用KMnO₄制O₂的符号表达式？',a:'KMnO₄→K₂MnO₄+MnO₂+O₂',e:'加热高锰酸钾'},
    {id:812,title:'燃烧条件',diff:2,q:'燃烧需要满足哪三个条件？',a:'可燃物、氧气、着火点',e:'燃烧三要素'},
    {id:813,title:'水的组成',diff:2,q:'电解水的实验说明水由什么组成？',a:'氢元素和氧元素',e:'正氧负氢'},
    {id:814,title:'硬水软水',diff:2,q:'区分硬水和软水的方法是？',a:'加肥皂水',e:'硬水泡沫少'}
]

window.topics = {
    math5: topicsMath5,
    english5: topicsEnglish5,
    chinese5: topicsChinese5,
    math6: topicsMath6,
    english6: topicsEnglish6,
    chinese6: topicsChinese6,
    math7: topicsMath7,
    english7: topicsEnglish7,
    chinese7: topicsChinese7,
    math8: topicsMath8,
    english8: topicsEnglish8,
    chinese8: topicsChinese8,
    physics8: topicsPhysics8,
    chemistry8: topicsChemistry8,
    math9: topicsMath9,
    english9: topicsEnglish9,
    chinese9: topicsChinese9,
    physics9: topicsPhysics9,
    chemistry9: topicsChemistry9
};

function getGradeSubjectTopics(grade, subject) {
    const gradeMap = {5:'5',6:'6',7:'7',8:'8',9:'9'};
    const key = (subject || 'math') + gradeMap[grade];
    return topics[key] || [];
}

// Window exports for cross-module access
window.topics = topics;
window.getGradeSubjectTopics = getGradeSubjectTopics;


// ===== js/data/podcasts.js =====
// 版本: V144

window.podcastList = [
    {id: 1, title: "青少年高效记忆法全攻略", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast1.mp3", duration: "6:14", category: "学霸方法"},
    {id: 2, title: "青少年高效笔记法大揭秘", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast2.mp3", duration: "8:10", category: "学霸方法"},
    {id: 3, title: "青少年高效时间管理秘籍", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast3.mp3", duration: "7:52", category: "学霸方法"},
    {id: 4, title: "青少年高效复习策略指南", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast4.mp3", duration: "7:30", category: "学霸方法"},
    {id: 5, title: "三招提升青少年专注力", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast5.mp3", duration: "10:54", category: "学霸方法"},
    {id: 6, title: "青少年语文思维训练秘籍", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast6.mp3", duration: "9:30", category: "思维训练"},
    {id: 7, title: "青少年英语思维训练秘籍", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast7.mp3", duration: "10:08", category: "思维训练"},
    {id: 8, title: "青少年考试通关秘籍大公开", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast8.mp3", duration: "10:51", category: "学霸方法"},
    {id: 9, title: "学霸私藏！高效解题策略大揭秘", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast9.mp3", duration: "13:12", category: "学霸方法"},
    {id: 10, title: "学霸秘籍：深度理解知识建构法", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast10.mp3", duration: "9:42", category: "学霸方法"},
    {id: 11, title: "揭秘数学五大思维，解题变简单！", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast11.mp3", duration: "3:36", category: "数学思维"},
    {id: 12, title: "青少年数学思维：抽象与推理", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast12.mp3", duration: "7:56", category: "数学思维"},
    {id: 13, title: "青少年数学思维：数形结合专项", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast13.mp3", duration: "8:58", category: "数学思维"},
    {id: 14, title: "青少年数学建模思维入门指南", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast14.mp3", duration: "8:29", category: "数学思维"},
    {id: 15, title: "青少年数学逆向思维专项课", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast15.mp3", duration: "9:04", category: "数学思维"},
    {id: 16, title: "青少年物理思维：因果与守恒", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast16.mp3", duration: "8:05", category: "物理思维"},
    {id: 17, title: "青少年物理模型思维入门指南", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast17.mp3", duration: "6:25", category: "物理思维"},
    {id: 18, title: "Week1复盘&Week2记忆训练计划", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast18.mp3", duration: "1:55", category: "周度复盘"},
    {id: 19, title: "Week2复盘&Week3训练大揭秘", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast19.mp3", duration: "1:55", category: "周度复盘"},
    {id: 20, title: "Week3复盘&Week4冲刺计划", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast20.mp3", duration: "2:10", category: "周度复盘"},
    {id: 21, title: "四周训练完结！青小年蜕变复盘", url: "https://yuhang87989.github.io/cognitive-training-portal/audio/podcast21.mp3", duration: "2:24", category: "周度复盘"}
];



// ===== js/data/videos.js =====
// 版本: V151-2
// 视频课程数据

window.videoList = [
    {id: 1, title: "专注力训练", url: "videos/专注力训练.mp4", duration: "5:23", category: "学霸方法"},
    {id: 2, title: "学霸深度理解法", url: "videos/学霸深度理解法_第1集.mp4", duration: "6:18", category: "学霸方法"},
    {id: 3, title: "数学抽象推理", url: "videos/数学抽象推理.mp4", duration: "5:06", category: "数学思维"},
    {id: 4, title: "物理因果守恒", url: "videos/物理因果守恒_第1集.mp4", duration: "5:41", category: "物理思维"},
    {id: 5, title: "逆向思维训练", url: "videos/逆向思维训练_第1集.mp4", duration: "3:27", category: "思维训练"}
];


// ===== js/data/games-config.js =====
// 版本: V144
// 23个认知训练游戏 + 7个学霸方法游戏 + 8个娱乐游戏 = 38个游戏

window.gamesConfig = [
    // === 认知训练游戏 (23个) ===
    {id:'schulte',icon:'👁',name:'舒尔特方格',desc:'注意力训练',gradient:'linear-gradient(135deg,#667eea,#764ba2)',category:'cognitive'},
    {id:'visual',icon:'🔍',name:'视觉搜索',desc:'观察力训练',gradient:'linear-gradient(135deg,#f093fb,#f5576c)',category:'cognitive'},
    {id:'digit',icon:'🔢',name:'数字记忆',desc:'记忆力训练',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)',category:'cognitive'},
    {id:'pattern',icon:'🎨',name:'图案匹配',desc:'思维训练',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)',category:'cognitive'},
    {id:'tap',icon:'⚡',name:'快速点击',desc:'反应速度',gradient:'linear-gradient(135deg,#f6d365,#fda085)',category:'cognitive'},
    {id:'color',icon:'🌈',name:'色彩识别',desc:'辨色能力',gradient:'linear-gradient(135deg,#4facfe,#00f2fe)',category:'cognitive'},
    {id:'diff',icon:'🔎',name:'找不同',desc:'细节观察',gradient:'linear-gradient(135deg,#fa709a,#fee140)',category:'cognitive'},
    {id:'reason',icon:'🧩',name:'逻辑推理',desc:'思维能力',gradient:'linear-gradient(135deg,#667eea,#764ba2)',category:'cognitive'},
    {id:'text',icon:'📝',name:'文字记忆',desc:'记忆训练',gradient:'linear-gradient(135deg,#e0c3fc,#8ec5fc)',category:'cognitive'},
    {id:'shape',icon:'🔷',name:'图形推理',desc:'逻辑训练',gradient:'linear-gradient(135deg,#ffecd2,#fcb69f)',category:'cognitive'},
    {id:'math',icon:'🔢',name:'数学速算',desc:'计算训练',gradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)',category:'cognitive'},
    {id:'space',icon:'🎲',name:'空间旋转',desc:'空间想象',gradient:'linear-gradient(135deg,#d299c2,#fef9d7)',category:'cognitive'},
    {id:'audio',icon:'🎧',name:'听音辨位',desc:'听觉训练',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)',category:'cognitive'},
    {id:'word',icon:'💬',name:'词汇联想',desc:'语言训练',gradient:'linear-gradient(135deg,#fddb92,#d1fdff)',category:'cognitive'},
    {id:'classify',icon:'📂',name:'分类归纳',desc:'思维训练',gradient:'linear-gradient(135deg,#c1dfc4,#deecfd)',category:'cognitive'},
    {id:'attention',icon:'🎯',name:'注意力追踪',desc:'专注训练',gradient:'linear-gradient(135deg,#ff9a9e,#fecfef)',category:'cognitive'},
    {id:'palace',icon:'🏛️',name:'记忆宫殿',desc:'空间记忆法',gradient:'linear-gradient(135deg,#6a3093,#a044ff)',category:'cognitive'},
    {id:'stroop',icon:'🎯',name:'Stroop冲突',desc:'冲突抑制',gradient:'linear-gradient(135deg,#fa709a,#fee140)',category:'cognitive'},
    {id:'numshape',icon:'📐',name:'数形结合',desc:'数形转换',gradient:'linear-gradient(135deg,#43e97b,#38f9d7)',category:'cognitive'},
    {id:'conserve',icon:'⚖️',name:'守恒推理',desc:'守恒思维',gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)',category:'cognitive'},
    {id:'network',icon:'🕸️',name:'知识网络',desc:'系统思维',gradient:'linear-gradient(135deg,#667eea,#764ba2)',category:'cognitive'},
    {id:'reverse',icon:'🔄',name:'逆向推理',desc:'逆向思维',gradient:'linear-gradient(135deg,#f093fb,#f5576c)',category:'cognitive'},
    {id:'experiment',icon:'🧪',name:'实验设计',desc:'科学探究',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)',category:'cognitive'},
    // === 学霸方法游戏 (7个) ===
    {id:'feyman',icon:'💡',name:'费曼学习法',desc:'以教代学',gradient:'linear-gradient(135deg,#FF6B6B,#FF9A63)',category:'method'},
    {id:'pomodoro',icon:'🍅',name:'番茄工作法',desc:'时间管理',gradient:'linear-gradient(135deg,#FF6B6B,#FF9A63)',category:'method'},
    {id:'ebbinghaus',icon:'🧠',name:'艾宾浩斯曲线',desc:'科学复习',gradient:'linear-gradient(135deg,#4CAF50,#66BB6A)',category:'method'},
    {id:'mindmap',icon:'🗺️',name:'思维导图法',desc:'结构化思维',gradient:'linear-gradient(135deg,#FF9800,#FFA726)',category:'method'},
    {id:'cornell',icon:'📝',name:'康奈尔笔记法',desc:'高效笔记',gradient:'linear-gradient(135deg,#9C27B0,#AB47BC)',category:'method'},
    {id:'sq3r',icon:'📖',name:'SQ3R阅读法',desc:'深度阅读',gradient:'linear-gradient(135deg,#00BCD4,#26C6DA)',category:'method'},
    {id:'timeManagement',icon:'⏰',name:'时间管理法',desc:'优先级管理',gradient:'linear-gradient(135deg,#E91E63,#F06292)',category:'method'},
    // === 娱乐游戏 (8个) ===
    {id:'snake',icon:'🐍',name:'贪吃蛇',desc:'经典休闲',gradient:'linear-gradient(135deg,#43A047,#66BB6A)',category:'entertainment'},
    {id:'tetris',icon:'🧱',name:'俄罗斯方块',desc:'经典益智',gradient:'linear-gradient(135deg,#E53935,#EF5350)',category:'entertainment'},
    {id:'flipcard',icon:'🃏',name:'记忆翻牌',desc:'记忆挑战',gradient:'linear-gradient(135deg,#1E88E5,#42A5F5)',category:'entertainment'},
    {id:'slide',icon:'🔢',name:'数字华容道',desc:'逻辑益智',gradient:'linear-gradient(135deg,#FB8C00,#FFA726)',category:'entertainment'},
    {id:'g2048',icon:'🎮',name:'2048',desc:'数字合成',gradient:'linear-gradient(135deg,#EDC22E,#F0D060)',category:'entertainment'},
    {id:'whack',icon:'🔨',name:'打地鼠',desc:'反应挑战',gradient:'linear-gradient(135deg,#8E24AA,#AB47BC)',category:'entertainment'},
    {id:'linkup',icon:'🔗',name:'连连看',desc:'配对挑战',gradient:'linear-gradient(135deg,#00897B,#26A69A)',category:'entertainment'},
    {id:'eliminate',icon:'💎',name:'消消乐',desc:'三消益智',gradient:'linear-gradient(135deg,#F4511E,#FF7043)',category:'entertainment'},
];

// gameConfig对象格式 - games.js内部使用
window.gameConfig = {
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
    eliminate: {name:'💎 消消乐',color:'#F4511E',gradient:'linear-gradient(135deg,#F4511E,#FF7043)'}
};


// ===== js/data/ability-model.js =====
// ==========================================
// V195 认知能力模型
// 5个核心维度，用于雷达图展示
// ==========================================

window.ABILITY_DIMENSIONS = {
  attention: {
    id: 'attention',
    name: '专注力',
    icon: '🎯',
    color: '#667eea',
    sources: ['schulte', 'visualSearch', 'colorMatch'],
    weight: 0.25,
    desc: '抗干扰能力与持续专注时长'
  },
  memory: {
    id: 'memory',
    name: '记忆力',
    icon: '🧠',
    color: '#f093fb',
    sources: ['imageMemory', 'numberMemory'],
    weight: 0.25,
    desc: '短时记忆与长时记忆能力'
  },
  thinking: {
    id: 'thinking',
    name: '思维力',
    icon: '💡',
    color: '#43e97b',
    sources: ['reasoning'],
    weight: 0.20,
    desc: '逻辑推理与问题解决能力'
  },
  speed: {
    id: 'speed',
    name: '反应力',
    icon: '⚡',
    color: '#fa709a',
    sources: ['quickClick'],
    weight: 0.15,
    desc: '信息处理与反应速度'
  },
  persistence: {
    id: 'persistence',
    name: '坚持力',
    icon: '🔥',
    color: '#fee140',
    sources: ['streakDays', 'totalDuration'],
    weight: 0.15,
    desc: '持续训练的毅力与韧性'
  }
};

// 计算用户能力得分
window.calculateAbilityScores = function(userData) {
  const scores = {};
  const trainingHistory = userData?.trainingHistory || [];
  
  Object.keys(ABILITY_DIMENSIONS).forEach(dimId => {
    const dim = ABILITY_DIMENSIONS[dimId];
    
    if (dimId === 'persistence') {
      // 坚持力基于训练天数和时长
      const streak = userData?.streakDays || 0;
      const duration = (userData?.totalDuration || 0) / 60; // 分钟
      const streakScore = Math.min(streak * 5, 50); // 最多50分
      const durationScore = Math.min(duration * 0.5, 50); // 最多50分
      scores[dimId] = Math.round(streakScore + durationScore);
    } else {
      // 其他维度基于训练历史
      const recentTrainings = trainingHistory.filter(t => 
        dim.sources.includes(t.type)).slice(-7);
      
      if (recentTrainings.length === 0) {
        scores[dimId] = 50; // 默认中等
      } else {
        // 最近7次60% + 历史所有40%
        const recentAvg = recentTrainings.reduce((sum, t) => 
          sum + (t.accuracy || 70), 0) / recentTrainings.length;
        const allTrainings = trainingHistory.filter(t => 
          dim.sources.includes(t.type));
        const allAvg = allTrainings.length > 0 
          ? allTrainings.reduce((sum, t) => 
            sum + (t.accuracy || 70), 0) / allTrainings.length 
          : 70;
        scores[dimId] = Math.round(recentAvg * 0.6 + allAvg * 0.4);
      }
    }
    
    // 限制0-100
    scores[dimId] = Math.max(0, Math.min(100, scores[dimId]));
  });
  
  return scores;
};

// 获取能力等级文字
window.getAbilityLevel = function(score) {
  if (score >= 80) return { text: '优秀', color: '#43e97b' };
  if (score >= 60) return { text: '良好', color: '#667eea' };
  if (score >= 40) return { text: '中等', color: '#f5af19' };
  return { text: '需加强', color: '#ff6b6b' };
};


// ===== js/modules/practice.js =====
// 版本: V144

CTM.registerModule('practice', {
    name: 'practice',
    icon: '🎯',
    render: renderPractice
});

function renderPractice(container) {
    const user = getCurrentUserData();
    const stats = user?.practiceStats || {total: 0, correct: 0, weakPoints: 0};
    const wrongNotes = user?.wrongNotes || [];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎯 AI精准练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">智能诊断薄弱点，针对性练习提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div style="text-align:center;padding:16px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;">${stats.total}</div>
                    <div style="font-size:12px;color:#666;">总题数</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0fff4;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;">${stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0}%</div>
                    <div style="font-size:12px;color:#666;">正确率</div>
                </div>
                <div style="text-align:center;padding:16px;background:#fff5f5;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${wrongNotes.length}</div>
                    <div style="font-size:12px;color:#666;">薄弱点</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照识别题目</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">拍下题目图片，AI识别并生成可答题</p>
            <input type="file" id="practice-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handlePhotoToQuestion(this)"/>
            <button class="camera-btn" onclick="document.getElementById('practice-photo-input').click()">📷 拍照识别</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">✏️ 手动输入题目</h4>
            <textarea id="practice-input" placeholder="输入你的问题..." style="width:100%;height:80px;padding:12px;border:1px solid #ddd;border-radius:12px;font-size:14px;resize:none;"></textarea>
            <button onclick="submitPracticeQuestion()" style="margin-top:12px;width:100%;padding:14px;background:linear-gradient(135deg,#3377FF,#4A90E2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔍 AI解答</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📒 错题本</h4>
            <button onclick="openFullscreenPage('wrongbook')" style="width:100%;padding:14px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">查看错题 (${wrongNotes.length})</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">🤖 AI解说</h4>
            <p style="color:#666;font-size:12px;margin-bottom:12px;">任何学习问题，AI帮你详细解说</p>
            <textarea id="practice-ai-question" placeholder="例如：一元二次方程怎么解？" style="width:100%;height:60px;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:13px;resize:none;"></textarea>
            <button onclick="askPracticeAI()" style="margin-top:10px;width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI解说</button>
        </div>
    `;
}

window.renderPractice = renderPractice;

// ============================================================
// 拍照上传处理函数
// ============================================================

// 处理母题训练的拍照上传
function handlePracticePhoto(input) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // 显示预览和分析弹窗
        showPracticePhotoModal(imageData);
        
        // 清空input
        input.value = '';
    };
    
    reader.onerror = function() {
        showToast('图片读取失败，请重试');
    };
    
    reader.readAsDataURL(file);
}

// 显示拍照分析弹窗
function showPracticePhotoModal(imageData) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📷 题目图片分析</div>
        <div class="card" style="padding:12px;">
            <img src="${imageData}" style="width:100%;max-height:250px;object-fit:contain;border-radius:8px;margin-bottom:12px;"/>
            <div id="practice-photo-preview-info" style="font-size:12px;color:#666;margin-bottom:8px;">✅ 图片已准备好</div>
        </div>
        <div style="margin-top:12px;">
            <textarea id="practice-photo-question" placeholder="请描述你想问的问题（可选）..." style="width:100%;height:60px;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:13px;resize:none;"></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                <button onclick="analyzePracticePhoto('${imageData.replace(/'/g, "\\'")}')" style="padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI分析</button>
                <button onclick="closeModal()" style="padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">取消</button>
            </div>
        </div>
        <div id="practice-photo-result" style="margin-top:12px;"></div>
    `;
}

// 分析拍照图片
async function analyzePracticePhoto(imageData) {
    const resultDiv = document.getElementById('practice-photo-result');
    const question = document.getElementById('practice-photo-question');
    const questionText = question ? question.value.trim() : '';
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在分析中...</div></div>';
    
    const analysisPrompt = questionText ? 
        '用户问题：' + questionText + '\n\n请分析这张图片中的题目，并回答用户的问题。' :
        '请分析这张图片中的题目内容，给出：\n1. 题目识别结果\n2. 详细解答\n3. 相关知识点\n4. 举一反三练习';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位专业的数学辅导老师，擅长分析学生拍摄的题目照片，给出详细的讲解和解答。请用清晰的结构化格式回答。'},
            {role: 'user', content: analysisPrompt}
        ];
        
        // 如果有图片，尝试使用视觉API（callVisionAPI已支持DeepSeek回退）
        const visionResult = await callVisionAPI(imageData, analysisPrompt);
        if (visionResult.success) {
            messages[1] = {role: 'user', content: '[图片内容分析结果：' + visionResult.content + ']\n\n' + analysisPrompt};
        }
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ 分析失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            // 记录调用
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#667eea;font-weight:600;">🤖 AI分析结果</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('分析失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">❌ 网络错误，请检查网络后重试<br><button onclick="analyzePracticePhoto(\'' + imageData.replace(/'/g, "\\'") + '\')" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">重试</button></div>';
    }
}

// 通用拍照上传处理函数（供其他模块调用）
function handleQuestionPhoto(input, resultContainerId) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        const resultContainer = document.getElementById(resultContainerId);
        
        if (resultContainer) {
            // 显示预览
            resultContainer.innerHTML = '<div style="padding:8px;background:#f5f7ff;border-radius:8px;margin-bottom:8px;">' +
                '<img src="' + imageData + '" style="width:100%;max-height:150px;object-fit:contain;border-radius:6px;"/>' +
                '<div style="font-size:11px;color:#666;margin-top:4px;">✅ 图片已上传</div></div>';
        }
        
        // 存储当前图片数据供后续分析使用
        window.currentQuestionPhoto = imageData;
        showToast('图片已上传，可点击AI分析按钮');
    };
    
    reader.onerror = function() {
        showToast('图片读取失败');
    };
    
    reader.readAsDataURL(file);
}

// 导出函数
window.handlePracticePhoto = handlePracticePhoto;
window.showPracticePhotoModal = showPracticePhotoModal;
window.analyzePracticePhoto = analyzePracticePhoto;
window.handleQuestionPhoto = handleQuestionPhoto;

// ============================================================
// AI问题解答 - submitPracticeQuestion
// ============================================================
async function submitPracticeQuestion() {
    const input = document.getElementById('practice-input');
    if (!input) return;
    
    const question = input.value.trim();
    if (!question) {
        showToast('请输入你的问题');
        return;
    }
    
    // 创建结果显示区域
    let resultDiv = document.getElementById('practice-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'practice-result';
        input.parentElement.appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #3377FF;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在分析...</div></div>';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位专业的学习辅导老师，擅长解答学生的各种学科问题。请用清晰、结构化的方式回答，特别是数学题目要给出详细步骤。'},
            {role: 'user', content: question}
        ];
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 解答失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;margin-top:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#3377FF;font-weight:600;">🤖 AI解答</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#3377FF;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('解答失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请检查网络后重试</div>';
    }
}

// ============================================================
// AI学习解说 - askPracticeAI
// ============================================================
async function askPracticeAI() {
    const input = document.getElementById('practice-ai-question');
    if (!input) return;
    
    const question = input.value.trim();
    if (!question) {
        showToast('请输入你的问题');
        return;
    }
    
    // 创建结果显示区域
    let resultDiv = document.getElementById('practice-ai-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'practice-ai-result';
        input.parentElement.appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #667eea;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><div style="margin-top:8px;color:#666;font-size:13px;">🤖 AI正在解说...</div></div>';
    
    try {
        const messages = [
            {role: 'system', content: '你是一位热情的学习导师，擅长用通俗易懂的语言解释复杂的概念和知识点。你会用生活例子、类比等方式帮助学生理解。请用友好的语气详细解说。'},
            {role: 'user', content: question}
        ];
        
        const result = await callDeepSeekAPI(messages);
        
        if (result.error) {
            if (result.type === 'balance') {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;text-align:center;">⚠️ DeepSeek余额不足<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:#667eea;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">前往充值</button></div>';
            } else {
                resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 解说失败：' + escapeHtml(result.message) + '</div>';
            }
        } else {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
            resultDiv.innerHTML = '<div style="padding:16px;background:linear-gradient(135deg,#f5f7ff,#eef1ff);border-radius:12px;margin-top:12px;max-height:300px;overflow-y:auto;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:#667eea;font-weight:600;">🤖 AI解说</span>' +
                '<button onclick="speakText(this.parentElement.nextElementSibling.textContent)" style="padding:4px 8px;background:#667eea;color:white;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button></div>' +
                '<div style="font-size:14px;line-height:1.8;color:#333;">' + result.content.replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }
    } catch (err) {
        console.error('解说失败:', err);
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请检查网络后重试</div>';
    }
}

// 导出新函数到window
window.submitPracticeQuestion = submitPracticeQuestion;
window.askPracticeAI = askPracticeAI;


// ============================================================
// Map - 地图模块
// ============================================================
async function handlePhotoToQuestion(imageData) {
    // 复用photoToQuestion
    if (typeof photoToQuestion === 'function') { photoToQuestion(imageData); }
    else { showToast('拍照出题功能加载中，请稍后再试'); }
}
window.handlePhotoToQuestion = handlePhotoToQuestion;


// ===== js/modules/map.js =====
// 版本: V144

CTM.registerModule('map', {
    name: 'map',
    icon: '🎯',
    render: renderMap
});

function renderMap(container) {
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🧠 认知地图 - 六维能力分析</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">基于你的学习数据，绘制专属认知能力雷达图</p>
            <div id="radar-container"></div>
        </div>
    `;
    setTimeout(() => {
        const radarContainer = document.getElementById('radar-container');
        if (radarContainer) renderCognitiveRadar(radarContainer);
    }, 100);
}

function renderCognitiveRadar(container) {
    // 获取用户认知数据（基于真实训练数据计算）
    const cognitiveData = calculateCognitiveData();
    
    const html = `
        <div class="cognitive-map-container">
            <div class="radar-chart-wrapper">
                <svg id="cognitive-radar" viewBox="0 0 400 400"></svg>
            </div>
            <div class="cognitive-stats">
                <h3 style="font-size:16px;font-weight:bold;margin-bottom:8px;">六维能力分析</h3>
                <p style="font-size:12px;color:#666;margin-bottom:12px;">基于你的训练数据实时计算</p>
                <div class="stat-grid">
                    ${renderStatItems(cognitiveData)}
                </div>
            </div>
            <div class="cognitive-detail" style="width:100%;margin-top:16px;">
                <h4 style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 能力详情</h4>
                ${renderCognitiveDetails(cognitiveData)}
            </div>
        </div>
        <style>
            .cognitive-map-container { display: flex; flex-direction: column; align-items: center; padding: 16px; }
            .radar-chart-wrapper { width: 280px; height: 280px; }
            .cognitive-stats { width: 100%; margin-top: 16px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
            .stat-item { padding: 12px 8px; border-radius: 12px; text-align: center; color: white; position: relative; }
            .stat-value { font-size: 22px; font-weight: bold; }
            .stat-label { font-size: 11px; opacity: 0.9; margin-top: 2px; }
            .stat-trend { font-size: 10px; position: absolute; top: 4px; right: 8px; }
            .cognitive-detail-card { background: white; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .detail-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .detail-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
            .detail-title { font-size: 14px; font-weight: 600; }
            .detail-score { margin-left: auto; font-size: 18px; font-weight: bold; }
            .detail-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
            .detail-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
            .detail-sources { font-size: 11px; color: #999; margin-top: 8px; }
        </style>
    `;
    container.innerHTML = html;
    
    // 绘制雷达图
    setTimeout(() => drawRadarChart(cognitiveData), 100);
}

function renderCognitiveDetails(data) {
    const details = [
        { 
            key: 'attention', 
            label: '专注力', 
            icon: '🎯', 
            color: '#667eea',
            desc: '注意力集中与抗干扰能力',
            tip: '多玩舒尔特方格、视觉搜索、快速点击可提升'
        },
        { 
            key: 'memory', 
            label: '记忆力', 
            icon: '🧠', 
            color: '#764ba2',
            desc: '信息存储与提取能力',
            tip: '数字记忆、图形记忆游戏和记忆法训练可提升'
        },
        { 
            key: 'thinking', 
            label: '思维力', 
            icon: '💡', 
            color: '#f093fb',
            desc: '逻辑推理与问题解决能力',
            tip: '图形推理、找不同游戏和思维训练可提升'
        },
        { 
            key: 'creativity', 
            label: '创造力', 
            icon: '🎨', 
            color: '#4facfe',
            desc: '发散思维与创新思考能力',
            tip: '颜色识别游戏和创意思维训练可提升'
        },
        { 
            key: 'emotion', 
            label: '情绪力', 
            icon: '❤️', 
            color: '#43e97b',
            desc: '情绪管理与学习动力',
            tip: '保持连续学习、完成多种训练可提升'
        },
        { 
            key: 'metacognition', 
            label: '元认知', 
            icon: '🔮', 
            color: '#fa709a',
            desc: '自我监控与反思能力',
            tip: '学霸方法训练、思维训练、AI问答可提升'
        }
    ];
    
    return details.map(d => `
        <div class="cognitive-detail-card">
            <div class="detail-header">
                <div class="detail-icon" style="background: ${d.color}20;">${d.icon}</div>
                <div>
                    <div class="detail-title">${d.label}</div>
                    <div style="font-size:11px;color:#999;">${d.desc}</div>
                </div>
                <div class="detail-score" style="color: ${d.color};">${data[d.key]}</div>
            </div>
            <div class="detail-bar">
                <div class="detail-bar-fill" style="width: ${data[d.key]}%; background: ${d.color};"></div>
            </div>
            <div class="detail-sources">💡 ${d.tip}</div>
        </div>
    `).join('');
}

function renderStatItems(data) {
    const items = [
        {label: '专注力', value: data.attention, color: '#667eea', icon: '🎯'},
        {label: '记忆力', value: data.memory, color: '#764ba2', icon: '🧠'},
        {label: '思维力', value: data.thinking, color: '#f093fb', icon: '💡'},
        {label: '创造力', value: data.creativity, color: '#4facfe', icon: '🎨'},
        {label: '情绪力', value: data.emotion, color: '#43e97b', icon: '❤️'},
        {label: '元认知', value: data.metacognition, color: '#fa709a', icon: '🔮'}
    ];
    
    return items.map(item => `
        <div class="stat-item" style="background: linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%);">
            <div style="font-size:16px;margin-bottom:2px;">${item.icon}</div>
            <div class="stat-value">${item.value}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

window.renderMap = renderMap;
window.renderCognitiveRadar = renderCognitiveRadar;
window.renderCognitiveDetails = renderCognitiveDetails;
window.renderStatItems = renderStatItems;


// ============================================================
// Plan - 训练计划
// ============================================================
window.calculateCognitiveData = calculateCognitiveData;

// ===== js/modules/plan.js =====
// 版本: V144

CTM.registerModule('plan', {
    name: 'plan',
    icon: '🎯',
    render: renderPlan
});

function renderPlan(container) {
    const user = getCurrentUserData();
    const currentWeek = user.currentWeek || 1;
    const today = new Date().getDay() || 7;
    
    if (!window._planWeek) window._planWeek = currentWeek;
    if (!window._planDay) window._planDay = today;
    
    const plan = getWeekPlan('week' + window._planWeek);
    const userTasks = (user.weekTasks || {});
    
    CTM.triggerHook('beforeRenderPlan', {week: window._planWeek, plan});
    
    // 计算本周完成统计
    let completedCount = 0, totalCount = 0;
    if (plan && plan.days) {
        plan.days.forEach(d => {
            d.tasks.forEach(t => {
                totalCount++;
                if (userTasks[t.id]) completedCount++;
            });
        });
    }
    
    const weekNames = ['','Week1：注意力与记忆力','Week2：学霸方法与听课习惯','Week3：数学物理思维入门','Week4：解题策略与实验思维','Week5：系统性思维与守恒思维','Week6：学科深度整合与自主学习','Week7：元认知深化与能力迁移','Week8：高阶思维训练','Week9：综合能力提升与实战'];
    
    const typeIcons = {attention:'👁️',memory:'🧠',strategy:'📚',practice:'✏️',creative:'🎨',video:'🎬',podcast:'🎧',game:'🎮',review:'📝',test:'📊',writing:'✍️',rest:'😴',social:'🤝',planning:'📋',quiz:'❓'};
    
    const dayNames = ['','周一','周二','周三','周四','周五','周六','周日'];
    
    let html = '';
    
    // 周次导航
    html += '<div class="card">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">';
    html += '<span onclick="changeWeek(-1)" style="cursor:pointer;font-size:20px;padding:4px 12px;border-radius:8px;background:#f0f0f0;">◀</span>';
    html += '<div style="text-align:center;"><div style="font-size:16px;font-weight:bold;color:#1A6BFF;">第 ' + window._planWeek + ' 周</div>';
    html += '<div style="font-size:12px;color:#666;margin-top:2px;">' + (weekNames[window._planWeek] || '') + '</div></div>';
    html += '<span onclick="changeWeek(1)" style="cursor:pointer;font-size:20px;padding:4px 12px;border-radius:8px;background:#f0f0f0;">▶</span>';
    html += '</div>';
    
    // 7天日历
    if (plan && plan.days) {
        html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px;">';
        plan.days.forEach(d => {
            const isToday = d.day === window._planDay;
            const dayTasks = d.tasks.length;
            const dayDone = d.tasks.filter(t => userTasks[t.id]).length;
            const dayComplete = dayDone === dayTasks;
            const bgColor = dayComplete ? '#43E97B' : isToday ? '#1A6BFF' : '#f5f5f5';
            const textColor = (dayComplete || isToday) ? 'white' : '#333';
            html += '<div onclick="switchPlanDay(' + d.day + ')" style="text-align:center;padding:8px 2px;border-radius:10px;cursor:pointer;background:' + bgColor + ';color:' + textColor + ';">';
            html += '<div style="font-size:11px;">' + dayNames[d.day] + '</div>';
            html += '<div style="font-size:13px;font-weight:bold;">D' + d.day + '</div>';
            if (dayDone > 0) html += '<div style="font-size:9px;">' + dayDone + '/' + dayTasks + '</div>';
            html += '</div>';
        });
        html += '</div>';
    }
    
    // 当日任务
    if (plan && plan.days) {
        const dayData = plan.days.find(d => d.day === window._planDay);
        if (dayData) {
            html += '<div style="margin-bottom:8px;font-size:14px;font-weight:bold;color:#333;">📋 ' + dayData.title + '</div>';
            dayData.tasks.forEach(task => {
                const done = userTasks[task.id];
                const icon = typeIcons[task.type] || '📌';
                html += '<div class="plan-task ' + (done ? 'completed' : '') + '" onclick="toggleWeekTask(\'' + task.id + '\')" style="display:flex;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:' + (done ? '#e8f5e9' : '#fafafa') + ';cursor:pointer;">';
                html += '<div class="task-checkbox ' + (done ? 'checked' : '') + '" style="width:22px;height:22px;border-radius:6px;border:2px solid ' + (done ? '#43E97B' : '#ccc') + ';display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;">' + (done ? '✓' : '') + '</div>';
                html += '<div style="flex:1;"><div style="font-size:13px;' + (done ? 'text-decoration:line-through;color:#999;' : '') + '">' + icon + ' ' + task.title + '</div></div>';
                html += '<div style="font-size:11px;color:#999;margin-left:8px;">' + task.duration + '分钟</div>';
                html += '</div>';
            });
        }
    }
    html += '</div>';
    
    // 学习进度
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 学习进度</div>';
    html += '<div style="display:flex;justify-content:space-around;text-align:center;">';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#1A6BFF;">' + completedCount + '</div><div style="font-size:11px;color:#666;">本周完成</div></div>';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#43E97B;">' + (totalCount > 0 ? Math.round(completedCount/totalCount*100) : 0) + '%</div><div style="font-size:11px;color:#666;">完成率</div></div>';
    html += '<div><div style="font-size:22px;font-weight:bold;color:#667eea;">' + (user.streak || 0) + '</div><div style="font-size:11px;color:#666;">连续天数</div></div>';
    html += '</div>';
    html += '</div>';
    
    // 周度描述
    if (plan && plan.weekDesc) {
        html += '<div class="card" style="margin-top:12px;">';
        html += '<div style="font-size:13px;color:#666;line-height:1.6;">💡 ' + plan.weekDesc + '</div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    CTM.triggerHook('afterRenderPlan', {week: window._planWeek});
}

function renderWeekPlan(weekId) {
    const plan = getWeekPlan(weekId);
    if (!plan) return '<div>暂无训练计划</div>';
    let html = '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">' + plan.weekTitle + '</div>';
    html += '<div style="font-size:13px;color:#666;margin-bottom:16px;">' + plan.weekDesc + '</div>';
    plan.days.forEach(day => {
        html += '<div class="card" style="margin-bottom:12px;">';
        html += '<div style="font-weight:600;margin-bottom:10px;">Day' + day.day + '：' + day.title + '</div>';
        day.tasks.forEach(task => {
            const typeIcons = {video:'📹',practice:'✏️',creative:'🎨',social:'💬',review:'📖',test:'📝',writing:'📄',podcast:'🎧',planning:'📋',quiz:'❓',rest:'😴'};
            const typeNames = {video:'视频学习',practice:'练习',creative:'创作',social:'讨论',review:'复习',test:'测试',writing:'写作',podcast:'播客',planning:'计划',quiz:'测评',rest:'休息'};
            html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;">';
            html += '<input type="checkbox" ' + (task.completed ? 'checked' : '') + ' onchange="toggleWeekTask(\'' + task.id + '\')">';
            html += '<span style="font-size:16px;">' + (typeIcons[task.type] || '📋') + '</span>';
            html += '<div style="flex:1;"><div style="font-size:13px;">' + task.title + '</div>';
            html += '<div style="font-size:11px;color:#999;">' + typeNames[task.type] + (task.duration ? ' · ' + task.duration + '分钟' : '') + '</div></div></div>';
        });
        html += '</div>';
    });
    html += '</div><button class="login-btn login-btn-secondary" onclick="closeDetail()">关闭</button>';
    return html;
}

function renderSlide() {
    const container = document.getElementById('slide-container');
    if(!container) return;
    container.innerHTML = '';
    slideBoard.forEach((num,i) => {
        const x = i%4, y = Math.floor(i/4);
        const cell = document.createElement('div');
        if(num===0) {
            cell.style.cssText = 'width:65px;height:65px;background:#ddd;border-radius:8px;';
        } else {
            cell.style.cssText = 'width:65px;height:65px;background:linear-gradient(135deg,#FB8C00,#FFA726);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:white;cursor:pointer;';
            cell.textContent = num;
            cell.onclick = () => moveSlide(x,y);
        }
        container.appendChild(cell);
    });
}

function changeWeek(dir) {
    CTM.triggerHook('beforeWeekChange', {from: window._planWeek, dir: dir});
    window._planWeek = Math.max(1, Math.min(9, (window._planWeek || 1) + dir));
    window._planDay = 1;
    CTM.triggerHook('afterWeekChange', {to: window._planWeek});
    const el = document.getElementById('module-content');
    if (el) renderPlan(el);
}

function toggleWeekTask(taskId) {
    const user = getCurrentUserData();
    user.weekTasks = user.weekTasks || {};
    user.weekTasks[taskId] = !user.weekTasks[taskId];
    saveUserData(user);
    CTM.triggerHook('onTaskComplete', {taskId: taskId, completed: user.weekTasks[taskId]});
    const el = document.getElementById('module-content');
    if (el) renderPlan(el);
}

window.renderPlan = renderPlan;
window.renderWeekPlan = renderWeekPlan;
window.renderSlide = renderSlide;
window.changeWeek = changeWeek;
window.toggleWeekTask = toggleWeekTask;


// ============================================================
// TopicsModule - 主题模块
// ============================================================

// ===== js/modules/topics.js =====
// 版本: V151

let currentTopicsGrade = 7;
let currentTopicsSubject = 'math';
let currentTopicsPage = 1;

// 动态计算每页题目数量（根据屏幕高度）
function getTopicsPerPage() {
    const screenHeight = window.innerHeight || 667;
    if (screenHeight < 600) return 5;  // 小屏手机
    if (screenHeight < 800) return 6;  // 普通手机
    if (screenHeight < 1000) return 8; // 大屏手机/平板
    return 10; // 电脑/大屏
}

function renderTopics(container) {
    const currentUser = getCurrentUserData();
    const userGrade = (currentUser && currentUser.grade) ? currentUser.grade : 7;
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">📚 母题训练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">精选母题，举一反三，掌握核心知识点</p>
        </div>
        <div class="grade-tab">
            <button class="grade-tab-btn${userGrade === 5 ? ' active' : ''}" onclick="selectTopicsGrade(this, 5)">五年级</button>
            <button class="grade-tab-btn${userGrade === 6 ? ' active' : ''}" onclick="selectTopicsGrade(this, 6)">六年级</button>
            <button class="grade-tab-btn${userGrade === 7 ? ' active' : ''}" onclick="selectTopicsGrade(this, 7)">初一</button>
            <button class="grade-tab-btn${userGrade === 8 ? ' active' : ''}" onclick="selectTopicsGrade(this, 8)">初二</button>
            <button class="grade-tab-btn${userGrade === 9 ? ' active' : ''}" onclick="selectTopicsGrade(this, 9)">初三</button>
        </div>
        <div class="subject-tab">
            <button class="subject-tab-btn active" onclick="selectTopicsSubject(this, 'math')">数学</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'chinese')">语文</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'english')">英语</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'physics')">物理</button>
            <button class="subject-tab-btn" onclick="selectTopicsSubject(this, 'chemistry')">化学</button>
        </div>
        <div id="topics-list-container"></div>
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
    `;
    currentTopicsGrade = userGrade;
    loadTopicsList();
}

function selectTopicsGrade(btn, grade) {
    document.querySelectorAll('.grade-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTopicsGrade = grade;
    currentTopicsPage = 1;
    loadTopicsList();
}

function selectTopicsSubject(btn, subject) {
    document.querySelectorAll('.subject-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTopicsSubject = subject;
    currentTopicsPage = 1;
    loadTopicsList();
}

function getTopicsList() {
    const key = (currentTopicsSubject || 'math') + (currentTopicsGrade || 7);
    return typeof topics !== 'undefined' ? (topics[key] || []) : [];
}

function loadTopicsList() {
    const container = document.getElementById('topics-list-container');
    if (!container) return;
    
    const topicsList = getTopicsList();
    const topicsPerPage = getTopicsPerPage();
    const total = topicsList.length;
    const totalPages = Math.ceil(total / topicsPerPage);
    const start = (currentTopicsPage - 1) * topicsPerPage;
    const end = Math.min(start + topicsPerPage, total);
    const pageTopics = topicsList.slice(start, end);
    
    if (total === 0) {
        container.innerHTML = '<div class="card"><div style="text-align:center;padding:30px;color:#999;">暂无该科目题目</div></div>';
        return;
    }
    
    const gradients = ['gradient-blue', 'gradient-orange', 'gradient-green', 'gradient-purple', 'gradient-pink', 'gradient-cyan'];
    
    container.innerHTML = `
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;color:#666;">共 ${total} 道母题</span>
                <span style="font-size:12px;color:#999;">第 ${currentTopicsPage}/${totalPages} 页</span>
            </div>
        </div>
        ${pageTopics.map((t, i) => `
            <div class="topic-card" onclick="openTopicQuestion(${t.id})">
                <div class="topic-header ${gradients[i % gradients.length]}">
                    <div class="topic-title">${t.title}</div>
                    <div class="topic-subtitle">难度: ${'⭐'.repeat(t.diff || 2)}</div>
                </div>
                <div class="topic-footer">
                    <span class="topic-difficulty">ID: ${t.id}</span>
                    <span style="color:#3377FF;">开始练习 →</span>
                </div>
            </div>
        `).join('')}
        <div style="display:flex;gap:12px;padding:12px;">
            <button class="game-btn btn-orange" style="flex:1;" onclick="prevTopicsPage()" ${currentTopicsPage <= 1 ? 'disabled style="opacity:0.5;"' : ''}>上一页</button>
            <button class="game-btn btn-blue" style="flex:1;" onclick="nextTopicsPage()" ${currentTopicsPage >= totalPages ? 'disabled style="opacity:0.5;"' : ''}>下一页</button>
        </div>
    `;
}

function prevTopicsPage() {
    if (currentTopicsPage > 1) {
        currentTopicsPage--;
        loadTopicsList();
    }
}

function nextTopicsPage() {
    const total = getTopicsList().length;
    const totalPages = Math.ceil(total / getTopicsPerPage());
    if (currentTopicsPage < totalPages) {
        currentTopicsPage++;
        loadTopicsList();
    }
}

function findTopic(topicId) {
    if (typeof topics === 'undefined') return null;
    for (let key in topics) {
        const found = topics[key].find(t => t.id === topicId);
        if (found) return found;
    }
    return null;
}

function openTopicQuestion(topicId) {
    const topic = findTopic(topicId);
    if (!topic) {
        showToast('题目不存在');
        return;
    }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${topic.title}</div>
        <div class="card" style="margin-bottom:12px;">
            <div style="font-size:15px;line-height:1.8;margin-bottom:16px;">${topic.q}</div>
            <div class="practice-input">
                <input type="text" id="topic-answer-input" placeholder="输入你的答案..." style="flex:1;" />
                <button onclick="checkTopicAnswer(${topicId})" style="padding:10px 16px;background:#3377FF;color:white;border:none;border-radius:8px;cursor:pointer;">提交</button>
            </div>
            <div id="topic-result-area"></div>
        </div>
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照上传</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">上传你的解题过程，AI帮你分析</p>
            <input type="file" id="topic-photo-input" accept="image/*" capture="environment" style="display:none" onchange="uploadTopicPhoto(${topicId}, this)"/>
            <button class="camera-btn" onclick="document.getElementById('topic-photo-input').click()">📷 拍照上传</button>
        </div>
        <button class="login-btn login-btn-secondary" onclick="closeDetail()" style="margin-top:12px;">关闭</button>
    `;
}

function checkTopicAnswer(topicId) {
    const input = document.getElementById('topic-answer-input');
    const resultArea = document.getElementById('topic-result-area');
    const answer = input.value.trim();
    const topic = findTopic(topicId);
    
    if (!answer) {
        showToast('请输入答案');
        return;
    }
    
    const isCorrect = answer.toLowerCase() === topic.a.toLowerCase();
    
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    resultArea.className = 'practice-result ' + (isCorrect ? 'correct' : 'wrong');
    resultArea.innerHTML = isCorrect 
        ? `<div style="margin-top:12px;">✅ 回答正确！</div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`
        : `<div style="margin-top:12px;">❌ 回答错误</div>
           <div style="margin-top:8px;">正确答案：<strong style="color:#3377FF;">${topic.a}</strong></div>
           <div style="margin-top:8px;font-size:13px;color:#666;">解析：${topic.e}</div>
           <button class="game-btn btn-blue" style="margin-top:12px;" onclick="analyzeTopicWithAI(${topicId})">🤖 AI详细解说</button>`;
    
    const userData = getCurrentUserData();
    if (userData) {
        if (!userData.topicStats) userData.topicStats = {};
        userData.topicStats[topicId] = { 
            correct: isCorrect, 
            attempts: (userData.topicStats[topicId]?.attempts || 0) + 1,
            lastTime: Date.now()
        };
        
        if (!isCorrect) {
            if (!userData.wrongNotes) userData.wrongNotes = [];
            const wrongKey = 'topic-' + topicId;
            if (!userData.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                userData.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'topic',
                    sourceName: '母题训练',
                    topicId: topicId,
                    question: topic.q,
                    answer: topic.a,
                    explanation: topic.e,
                    userAnswer: answer,
                    time: Date.now()
                });
            }
        }
        syncUserData(userData);
    }
}function uploadTopicPhoto(topicId, input) {
    if (!input.files[0]) return;
    showToast('照片上传成功，AI分析中...');
    analyzeTopicWithAI(topicId);
}

function closeDetail() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('show');
}

// 导出函数到window
window.renderTopics = renderTopics;
window.selectTopicsGrade = selectTopicsGrade;
window.selectTopicsSubject = selectTopicsSubject;
window.loadTopicsList = loadTopicsList;
window.findTopic = findTopic;
window.openTopicQuestion = openTopicQuestion;
window.checkTopicAnswer = checkTopicAnswer;
window.analyzeTopicWithAI = analyzeTopicWithAI;
window.uploadTopicPhoto = uploadTopicPhoto;
window.prevTopicsPage = prevTopicsPage;
window.nextTopicsPage = nextTopicsPage;
window.closeDetail = closeDetail;


// ===== js/modules/method.js =====
// 版本: V151

window.methodTrainingQuestions = {
    // 费曼学习法 - 用简单语言解释复杂概念
    feyman: [
        // 基础理解 (1-5)
        {q:'用费曼学习法解释"光合作用"', a:'把植物比作工厂，叶绿素是工人，阳光是能量，产出葡萄糖和氧气'},
        {q:'用费曼学习法解释"重力"', a:'重力就像地球在吸东西，吸力大小和物体重量、距离有关'},
        {q:'用费曼学习法解释"电流"', a:'想象成水管里的水流动，电子就是水管里的小水滴'},
        {q:'用费曼学习法解释"天气变化"', a:'天气就像大气层在"呼吸"，冷热空气相遇就会产生风、雨、雪'},
        {q:'用费曼学习法解释"食物链"', a:'就像接力赛，植物被虫子吃，虫子被小鸟吃，小鸟被老鹰吃'},
        // 应用场景 (6-10)
        {q:'给数学不好的同学讲解分数，你会怎么用费曼技巧？', a:'先让他解释什么是分数，如果讲不清楚就找生活中的例子（如切蛋糕）'},
        {q:'用费曼学习法向朋友介绍你最喜欢的学科知识点', a:'假装朋友完全不懂，像讲故事一样用生活例子解释'},
        {q:'如何用费曼技巧学习历史事件？', a:'想象自己是记者，要向观众报道这件事，必须说清楚时间地点人物经过'},
        {q:'学完一篇英语课文后，怎么用费曼技巧复习？', a:'合上课本，用自己的话复述内容，用简单词汇解释复杂句子'},
        {q:'用费曼技巧理解"水的三态变化"', a:'想象水分子是小朋友，温度是音乐节奏，节奏不同舞姿不同'},
        // 辨析判断 (11-15)
        {q:'费曼技巧和死记硬背有什么区别？', a:'费曼技巧要求真正理解并能解释，死记硬背只是记住文字'},
        {q:'费曼技巧适合所有学科吗？哪些学科效果最好？', a:'适合需要理解的学科如数理化，对记忆性强的如历史单词效果稍弱'},
        {q:'把概念讲给同学听就等于费曼技巧吗？', a:'不一定，要看对方是否能听懂，关键是检查自己的理解漏洞'},
        {q:'费曼技巧只适合用来学习新知识吗？', a:'也可以用来复习，能发现自己以为懂了但其实模糊的地方'},
        {q:'使用费曼技巧时，发现自己讲不清楚该怎么办？', a:'回到原始材料重新理解，直到能用简单的话讲清楚为止'},
        // 创新实践 (16-20)
        {q:'设计一个"费曼挑战赛"活动，让同学们互相教对方知识点', a:'两人一组，各自选一个知识点教对方，看谁能用最短时间让对方理解'},
        {q:'如果要给机器人编程让它使用费曼技巧，你会设计哪些步骤？', a:'1.输入概念→2.生成类比→3.简化表达→4.检测理解'},
        {q:'创作一首"费曼学习之歌"，把学习技巧写成歌词', a:'把"选概念、想类比、讲给别人、找漏洞"编成顺口溜'},
        {q:'设计一张"费曼学习法"海报，用图文结合展示步骤', a:'画四个格子：①选知识②找比喻③讲清楚④找漏洞'},
        {q:'策划一次"费曼演讲"，向全班解释一个科学原理', a:'准备3分钟演讲，用生活例子和道具让同学听懂这个原理'}
    ],

    // 番茄工作法 - 时间管理和专注力训练
    pomodoro: [
        // 基础理解 (1-5)
        {q:'什么是番茄工作法？它的核心是什么？', a:'把时间分成25分钟工作和5分钟休息的小块，核心是专注和休息交替'},
        {q:'为什么番茄工作法推荐25分钟为一个番茄钟？', a:'这个时间长度既能保持专注，又不会太累，适合青少年的注意力特点'},
        {q:'一个完整的番茄工作法流程是什么？', a:'设定任务→工作25分钟→休息5分钟→每4个番茄后休息15-30分钟'},
        {q:'番茄工作法中的"休息"为什么不能玩手机？', a:'玩手机会让大脑继续运转，无法真正恢复注意力'},
        {q:'如何计算完成一个任务需要几个番茄钟？', a:'先估计所需时间，除以25分钟，零头不足一个按一个算'},
        // 应用场景 (6-10)
        {q:'写作业时如何使用番茄工作法？', a:'把各科作业分成小块，每科用一个或多个番茄钟完成'},
        {q:'复习考试期间怎样安排番茄工作法？', a:'上午脑子清醒做数学，下午做记忆性科目，晚上轻松回顾'},
        {q:'做手抄报或手工时怎么用番茄工作法？', a:'第一个番茄钟收集素材，第二个设计排版，第三个完成内容'},
        {q:'阅读一本很厚的书怎么用番茄工作法？', a:'每次番茄钟设定阅读页数目标，读完做简短笔记'},
        {q:'在家学习时，如何让家人配合番茄工作法？', a:'告诉家人在番茄钟期间不要打扰，休息时间再交流'},
        // 辨析判断 (11-15)
        {q:'番茄钟进行到一半被中断，番茄钟算成功吗？', a:'不算，需要重新开始，培养抗干扰能力很重要'},
        {q:'25分钟太短了，可以延长到45分钟吗？', a:'可以调整，但研究表明25分钟是大多数人的最佳专注时长'},
        {q:'做喜欢的事也需要用番茄钟计时吗？', a:'喜欢的事可以不用计时，享受其中，但用计时器能提高效率意识'},
        {q:'番茄工作法适合所有人吗？有哪些人不适合？', a:'适合需要训练专注力的人，但多动症或需要深度思考的人可能需要调整'},
        {q:'完成作业后还有时间，可以用剩余时间继续学习吗？', a:'可以，但建议留出休息时间，保持可持续的学习节奏'},
        // 创新实践 (16-20)
        {q:'设计一个"番茄成就系统"，每完成番茄钟获得什么奖励？', a:'完成1个得1星，集齐5星换小奖励，10星换大奖励'},
        {q:'发明一个"番茄警报器"，你会设计什么功能？', a:'倒计时、震动提醒、完成音乐、休息提醒震动'},
        {q:'制作一个"番茄工作法手环"，记录每天的番茄数量', a:'用珠子或贴纸表示完成的番茄数，一周统计一次'},
        {q:'设计一个"双人番茄挑战"，和朋友比赛学习', a:'约定同时开始番茄钟，看谁完成得多，互相监督'},
        {q:'写一个"番茄日记"，记录每天的学习效率', a:'每天写下：完成几个番茄、遇到什么问题、明天怎么改进'}
    ],

    // 艾宾浩斯遗忘曲线 - 科学记忆方法
    ebbinghaus: [
        // 基础理解 (1-5)
        {q:'什么是艾宾浩斯遗忘曲线？', a:'描述遗忘速度的曲线，显示记忆后20分钟忘掉40%，一天后忘掉70%'},
        {q:'遗忘曲线告诉我们记忆有什么规律？', a:'先快后慢：新学的知识忘得快，之后遗忘速度变慢'},
        {q:'为什么要在遗忘发生前复习？', a:'在记忆消失前复习，可以强化记忆，让它变成长期记忆'},
        {q:'根据遗忘曲线，学习后应该在什么时候复习？', a:'20分钟后、1小时后、9小时后、1天后、2天后、4天后、7天后、15天后、30天后'},
        {q:'艾宾浩斯用什么方法研究遗忘规律？', a:'自己记无意义音节，然后测试不同时间后的记忆保持量'},
        // 应用场景 (6-10)
        {q:'背英语单词如何运用遗忘曲线？', a:'早上背新单词，20分钟后复习一次，晚上再复习，第二天、第四天继续复习'},
        {q:'准备历史考试怎么用遗忘曲线安排复习？', a:'学完一个朝代后按遗忘曲线间隔复习：当天、第二天、第四天、第七天'},
        {q:'背诵古诗词怎样结合遗忘曲线？', a:'刚背会后复习1次，睡前复习1次，第二天早上再复习'},
        {q:'学习新公式用遗忘曲线复习要注意什么？', a:'不仅要记公式，还要理解推导过程，在不同场景下应用'},
        {q:'如何把遗忘曲线用在期末复习计划中？', a:'提前1个月开始复习，按遗忘曲线间隔安排各科复习时间'},
        // 辨析判断 (11-15)
        {q:'只要按遗忘曲线复习就一定能记住吗？', a:'不一定，还需要理解内容、多次回忆、实际应用'},
        {q:'记忆无意义内容和有意义内容遗忘速度一样吗？', a:'不一样，有意义的内容因为有理解支撑，遗忘更慢'},
        {q:'睡前复习比白天复习效果更好吗？为什么？', a:'是的，睡眠时大脑会整理记忆，睡前复习的内容更深刻'},
        {q:'复习次数越多越好吗？', a:'不是，关键是在遗忘节点复习，适度重复即可'},
        {q:'遗忘曲线适合所有学科的记忆吗？', a:'适合所有需要记忆的内容，但理解性学科还需结合深度学习'},
        // 创新实践 (16-20)
        {q:'设计一个"遗忘曲线复习本"，记录每个知识的复习时间', a:'制作表格：知识名称、学习时间、第一次复习、第二次复习...'},
        {q:'发明一个"记忆闹钟"，在不同时间提醒复习', a:'设定提醒：20分钟后、1小时后、9小时后等时间点响铃'},
        {q:'用遗忘曲线原理设计一个"背单词小程序"的功能', a:'根据用户记忆情况自动安排复习时间，记忆强的间隔拉长'},
        {q:'制作"记忆特工卡"，每张卡片标注复习日期', a:'卡片正面写问题，背面写答案，标注复习日期'},
        {q:'策划"科学记忆挑战赛"，看谁坚持遗忘曲线复习最久', a:'30天挑战，每天打卡记录，到期测试看谁记忆最牢'}
    ],

    // 思维导图法 - 可视化思维工具
    mindmap: [
        // 基础理解 (1-5)
        {q:'什么是思维导图？它有什么特点？', a:'以中心词为核心，向四周发散的图形，特点是直观、层次分明、颜色丰富'},
        {q:'思维导图为什么能帮助学习？', a:'符合大脑发散思维，把复杂内容结构化，便于理解和记忆'},
        {q:'思维导图的基本结构是什么？', a:'中心主题→一级分支→二级分支→更细分支，越往外越具体'},
        {q:'画思维导图需要哪些工具？', a:'空白纸、彩笔，可以用纸质或电子工具（如XMind、幕布等）'},
        {q:'思维导图的分支用什么形状？', a:'用曲线不用直线，让导图更有活力，每个分支单独用一种颜色'},
        // 应用场景 (6-10)
        {q:'学完一单元语文课文后如何用思维导图整理？', a:'中心写课文标题，一级分支写：人物、情节、环境、主题、精彩语句'},
        {q:'用思维导图做读书笔记怎么画？', a:'书名放中心，主要人物、故事发展、个人感悟作为分支'},
        {q:'数学错题本如何用思维导图整理？', a:'错题类型放中心，分类展示易错点、正确解法、相似题'},
        {q:'制定周末计划可以用思维导图吗？', a:'可以！中心写"周末计划"，分支写学习、运动、娱乐、休息'},
        {q:'写游记时用思维导图有什么好处？', a:'按游览顺序或景点分类整理，不遗漏重要内容'},
        // 辨析判断 (11-15)
        {q:'思维导图越详细越好吗？', a:'不是，要简洁有力，抓关键词，太多内容反而失去重点'},
        {q:'思维导图和列提纲有什么区别？', a:'提纲是线性列表，思维导图是放射性图形，更能体现思维关系'},
        {q:'可以用思维导图代替课堂笔记吗？', a:'可以，但要快速记录关键词，课后补充完整'},
        {q:'思维导图只能用于学习吗？', a:'不是，还可以用于做决定、头脑风暴、时间管理等'},
        {q:'手绘和电子思维导图哪个更好？', a:'各有优势，手绘加深记忆，电子方便修改保存'},
        // 创新实践 (16-20)
        {q:'用思维导图设计一个"我的未来职业"规划', a:'中心放"未来职业"，分支：感兴趣领域、需要技能、学习路径'},
        {q:'发明一种"声音思维导图"，用语音画导图', a:'说出关键词，自动生成导图，帮助打字慢的人'},
        {q:'用思维导图设计"班级公约"', a:'中心写"班级公约"，分支：课堂规则、作业要求、值日安排'},
        {q:'策划"思维导图创意比赛"，设计比赛规则', a:'给定主题，限时画导图，评分标准：结构清晰、颜色丰富、有创意'},
        {q:'创作一首"思维导图之歌"，歌词包含画导图的步骤', a:'把"找中心、画分支、写关键词、用颜色"编成歌曲'}
    ],

    // 康奈尔笔记法 - 高效课堂笔记
    cornell: [
        // 基础理解 (1-5)
        {q:'康奈尔笔记法把笔记本分成哪三个区域？', a:'左边4厘米的"提示栏"、右边较大的"笔记栏"、下方5厘米的"总结栏"'},
        {q:'康奈尔笔记法的使用步骤是什么？', a:'记录→简化→背诵→思考→复习'},
        {q:'笔记栏主要记录什么内容？', a:'课堂上老师讲的要点、例子，可以用符号和缩写'},
        {q:'提示栏的作用是什么？', a:'课后写下关键词或问题，提示自己复习重点'},
        {q:'总结栏用来写什么？', a:'用一两句话总结这页笔记的核心内容'},
        // 应用场景 (6-10)
        {q:'上数学课时如何使用康奈尔笔记法？', a:'笔记栏记公式和例题，提示栏写"注意单位"，总结栏写"这节学了..."'},
        {q:'英语课做康奈尔笔记要注意什么？', a:'记新单词和语法点，用中文在旁边标注帮助理解'},
        {q:'物理课实验课怎么用康奈尔笔记？', a:'笔记栏记录实验步骤和观察结果，提示栏写原理'},
        {q:'课后复习康奈尔笔记的正确方法是什么？', a:'遮住笔记栏，看着提示栏回忆内容，检查记忆'},
        {q:'康奈尔笔记可以用来整理错题吗？', a:'可以！笔记栏抄错题，提示栏写错误原因，总结栏写正确方法'},
        // 辨析判断 (11-15)
        {q:'康奈尔笔记法适合所有科目吗？', a:'适合大多数科目，特别是需要理解消化后再复习的科目'},
        {q:'上课时来不及写完整笔记怎么办？', a:'先快速记关键词和符号，课后立即补全'},
        {q:'提示栏的问题是谁来写？', a:'自己写，问自己：这节课的重点是什么？容易考什么？'},
        {q:'康奈尔笔记法和普通笔记比优势在哪？', a:'强迫自己思考和总结，复习效率更高'},
        {q:'可以用电子设备做康奈尔笔记吗？', a:'可以，但手写加深记忆效果更好'},
        // 创新实践 (16-20)
        {q:'设计一个"康奈尔笔记模板"，可以打印使用', a:'画好三条线，标注"提示栏""笔记栏""总结栏"'},
        {q:'发明"康奈尔笔记APP"，包含哪些功能？', a:'分区设置、录音辅助、间隔复习提醒、自动生成测试题'},
        {q:'用康奈尔笔记法策划"一周学习总结"', a:'每天用康奈尔笔记，周末用总结栏回顾一周收获'},
        {q:'创建"康奈尔笔记交换小组"，互相出题测试', a:'用康奈尔笔记的提示栏互相出题，交换测试'},
        {q:'设计"康奈尔笔记达人赛"，比赛规则是什么？', a:'给定主题做笔记，评分：清晰度、完整性、总结质量'}
    ],

    // SQ3R阅读法 - 高效阅读策略
    sq3r: [
        // 基础理解 (1-5)
        {q:'SQ3R阅读法包括哪五个步骤？', a:'Survey浏览、Question提问、Read阅读、Recite复述、Review复习'},
        {q:'"Survey浏览"具体要做什么？', a:'快速翻看书的目录、标题、图片、表格，了解大概内容'},
        {q:'"Question提问"要问哪些问题？', a:'问自己：这段讲什么？为什么重要？和之前学的有什么关系？'},
        {q:'"Recite复述"是什么意思？', a:'读完后不看内容，用自己的话复述刚才读过的内容'},
        {q:'SQ3R为什么能提高阅读效率？', a:'让阅读有目的性，主动思考而不是被动接收'},
        // 应用场景 (6-10)
        {q:'阅读一篇语文课文如何使用SQ3R？', a:'先看标题和小结提问，再细读，划重点，复述大意，最后复习'},
        {q:'看科普书籍怎么用SQ3R？', a:'浏览目录问自己好奇什么，带着问题阅读，读完给同学讲解'},
        {q:'阅读数学教材时SQ3R怎么用？', a:'浏览章节目标提问，阅读例题，遮住答案自己做，复述解题思路'},
        {q:'看课外书做SQ3R阅读会影响阅读兴趣吗？', a:'不会，反而能更深入理解内容，增强阅读成就感'},
        {q:'读新闻报道如何用SQ3R？', a:'看标题提问，Who谁、What什么事、When时间、Where地点、Why原因'},
        // 辨析判断 (11-15)
        {q:'SQ3R适合所有类型的阅读材料吗？', a:'适合需要深入理解的文章，不太适合快速浏览新闻或娱乐内容'},
        {q:'浏览是不是浪费时间，直接读不是更快？', a:'不是，浏览能激活已有知识，让后续阅读更有针对性'},
        {q:'复述时忘了内容是不是说明没读懂？', a:'可能是阅读不专注或内容太难，可以重读重点段落'},
        {q:'SQ3R五个步骤都要严格按顺序执行吗？', a:'可以灵活调整，但复习环节不可缺少'},
        {q:'读小说可以用SQ3R吗？', a:'可以，浏览情节发展，提问人物命运等，但不必太死板'},
        // 创新实践 (16-20)
        {q:'用SQ3R设计"阅读挑战本"，记录每次阅读的收获', a:'表格含：书名、问题、关键词、复述内容、复习日期'},
        {q:'发明"SQ3R阅读助手"小程序，包含什么功能？', a:'计时阅读、提问提示、自动生成复述引导、定期复习提醒'},
        {q:'策划"家庭阅读会"，用SQ3R讨论一本书', a:'每人用SQ3R读完一章，轮流提问和复述内容'},
        {q:'用SQ3R方法写一篇读书报告，结构应该是什么？', a:'概述→我的问题→重要内容→我的复述→复习计划'},
        {q:'设计"SQ3R阅读勋章"，获得条件是什么？', a:'完成5次SQ3R阅读获铜章，10次获银章，20次获金章'}
    ],

    // 时间管理法 - 合理规划时间
    timeManagement: [
        // 基础理解 (1-5)
        {q:'什么是时间管理？为什么学生需要学时间管理？', a:'合理安排和使用时间，提高效率。学生作业多、兴趣班多，更需要规划'},
        {q:'"重要紧急"四象限法则是什么？', a:'把事情分为：重要且紧急、重要不紧急、不重要但紧急、不重要不紧急'},
        {q:'为什么要把重要的事先做？', a:'重要的事影响长远，紧急的事会催人，不规划会被紧急的事追着跑'},
        {q:'做计划时为什么要留出缓冲时间？', a:'学习任务常会超时，留缓冲避免计划被打乱'},
        {q:'怎样判断一件事是否重要？', a:'问自己：这件事对目标有帮助吗？不做会后悔吗？'},
        // 应用场景 (6-10)
        {q:'放学后如何安排作业时间？', a:'按科目和难易度分配，先做费脑的，中间休息，再做轻松的'},
        {q:'周末两天怎么安排学习和玩耍时间？', a:'周六上午学习，下午运动；周日上午复习，下午自由活动'},
        {q:'考试前一周如何做复习计划？', a:'按科目分配天数，每天分早中晚三段，每段复习一科'},
        {q:'兴趣班和学校作业冲突怎么办？', a:'评估兴趣班的重要性，如果重要就提高效率挤时间，否则调整'},
        {q:'怎样利用碎片时间学习？', a:'背单词用5分钟，等公交时听英语，看笔记用10分钟'},
        // 辨析判断 (11-15)
        {q:'把所有时间都安排满就是好的时间管理吗？', a:'不是，要留出休息和缓冲时间，人不是机器'},
        {q:'做计划很完美但总是完不成怎么办？', a:'计划太理想化了，需要调整：减少任务量、增加休息时间'},
        {q:'玩游戏是不是浪费时间？', a:'适当娱乐不是浪费，能放松大脑，但要控制时间不沉迷'},
        {q:'熬夜学习效率会高吗？', a:'不会，睡眠不足影响记忆和专注，第二天效率更低'},
        {q:'时间管理只是制定计划吗？', a:'不是，还包括执行、复盘、调整计划'},
        // 创新实践 (16-20)
        {q:'设计一个"一周时间表"模板，分配学习和活动时间', a:'表格列出周一到周日，每天分早中晚，填入任务'},
        {q:'发明"时间管理手环"，有哪些功能？', a:'震动提醒当前任务、记录完成任务数、统计浪费时间'},
        {q:'创建"时间银行"，把节省的时间存起来', a:'提前完成任务节省的时间存起来，之后可以兑换奖励'},
        {q:'写"时间日志"记录一周的时间花销，分析改进', a:'每半小时记录一次在做什么，周末分析哪些时间浪费了'},
        {q:'策划"时间管理达人赛"，比谁效率高', a:'相同任务比谁用时最短，或规定时间内比谁完成得多'}
    ],

    // 笔记整理法 - 科学记录和整理笔记
    noteTaking: [
        // 基础理解 (1-5)
        {q:'好笔记和普通笔记有什么区别？', a:'好笔记有重点、有层次、能帮助回忆，普通笔记像流水账'},
        {q:'记笔记时为什么要用不同颜色的笔？', a:'颜色可以区分重点、标题、补充内容，视觉上更清晰'},
        {q:'"康奈尔笔记法"的核心是什么？', a:'把笔记分区：主栏记内容、边栏写提示、底栏做总结'},
        {q:'记笔记时应该追求速度还是完整？', a:'先追求速度记关键词，课后补全，不要为了完整错过重点'},
        {q:'课本上的批注算笔记吗？', a:'算！课本批注是很好的笔记形式，但要和笔记本结合使用'},
        // 应用场景 (6-10)
        {q:'上语文课怎样记好笔记？', a:'记老师强调的修辞手法、描写方法、中心思想，用不同颜色标注'},
        {q:'数学课记笔记有哪些技巧？', a:'记公式、定理、例题，特别标注"注意"和"易错点"'},
        {q:'错题应该怎么记才能发挥最大作用？', a:'抄题、抄错误解法、写错误原因、写正确解法、总结规律'},
        {q:'读书时怎样做笔记？', a:'折角标重点，空白处写感想，摘抄好句，写读后感'},
        {q:'课后整理笔记的正确顺序是什么？', a:'补全课上简写的、标重点、补充资料、写出疑问、写总结'},
        // 辨析判断 (11-15)
        {q:'把老师说的每句话都记下来是好习惯吗？', a:'不是，要记重点和关键词，否则来不及思考'},
        {q:'笔记记完就不用管了吗？', a:'不是，课后要复习整理，定期翻看才能发挥作用'},
        {q:'可以直接复印别人的笔记吗？', a:'可以参考，但自己记一遍效果更好，别人的思路不一定适合你'},
        {q:'电子笔记和手写笔记哪个更好？', a:'各有优势，手写加深记忆，电子方便搜索和整理'},
        {q:'笔记越详细越好吗？', a:'不是，要记关键点和自己不懂的地方，太多反而抓不住重点'},
        // 创新实践 (16-20)
        {q:'设计一个"课堂笔记模板"，供全班同学使用', a:'包含日期、课题、重点区、疑问区、总结区'},
        {q:'发明"智能笔记扫描仪"，有什么功能？', a:'扫描手写笔记，自动识别文字，转成电子版方便搜索'},
        {q:'创建"笔记交换社团"，定期交换整理笔记的方法', a:'每月一次分享会，展示各自的好笔记和整理技巧'},
        {q:'用笔记法策划"班级百科知识竞赛"', a:'每人准备一本知识笔记，比赛时随机抽取题目'},
        {q:'设计"笔记美化大赛"，比谁的笔记既实用又好看', a:'评分：内容完整30%、重点突出30%、美观度20%、创意20%'}
    ],

    // 考试策略法 - 科学应考方法
    testStrategy: [
        // 基础理解 (1-5)
        {q:'拿到试卷后应该先做什么？', a:'先整体浏览试卷，了解题目数量和难度，合理分配时间'},
        {q:'考试时先做难题还是先做简单题？为什么？', a:'建议先做简单题，建立信心，再攻难题'},
        {q:'什么是"分段得分"策略？', a:'难题不会做完整，也要写相关步骤争取部分分数'},
        {q:'考试时遇到完全不会的题怎么办？', a:'先跳过，做完会做的再回来思考'},
        {q:'做完试卷后为什么要检查？', a:'可能发现粗心犯的错，避免白白丢分'},
        // 应用场景 (6-10)
        {q:'数学考试时间不够用怎么办？', a:'优先检查计算题和应用题，确保得分；难题放弃回头做'},
        {q:'语文阅读理解题怎么拿高分？', a:'先看题目带着问题读文章，按分值分配答题字数'},
        {q:'英语完形填空有什么技巧？', a:'先通读全文了解大意，再逐空分析，注意上下文关联'},
        {q:'遇到开放性题目不知道怎么答怎么办？', a:'分点作答，每点一句话，结合文章内容和个人理解'},
        {q:'作文考试时间紧张怎么快速构思？', a:'5分钟列提纲，确定开头结尾和中间三段要点'},
        // 辨析判断 (11-15)
        {q:'检查时发现原来的答案改了对不对？', a:'没有把握不要改，第一次选择的正确率通常更高'},
        {q:'遇到不会的题可以看别人吗？', a:'绝对不行，这是作弊，要靠策略争取分数'},
        {q:'考前熬夜复习效果更好吗？', a:'不是，要保证睡眠，休息好才能发挥正常水平'},
        {q:'平时练习时可以用考试策略吗？', a:'可以，把每次练习当考试，才能养成好习惯'},
        {q:'字写不好会影响分数吗？', a:'会的，阅卷老师看不清会影响评分，尽量写工整'},
        // 创新实践 (16-20)
        {q:'设计一个"考试检查清单"，列出检查步骤', a:'①检查姓名考号②检查漏题③检查计算题④检查格式'},
        {q:'发明"考试时间分配表"，根据题型分配时间', a:'列出每种题型用时上限，超时自动跳转下一题'},
        {q:'策划"模拟考试策略演练"，提前练习应考方法', a:'用旧卷子模拟考试，练习时间分配和检查技巧'},
        {q:'写"考试复盘日记"，分析每次考试的经验教训', a:'记录：时间分配是否合理、哪些不该丢分、下次怎么改进'},
        {q:'设计"考试心态调整法"，考前紧张怎么办', a:'深呼吸、回忆成功经历、积极心理暗示、适当运动放松'}
    ]
};

window.methodDetails = {
    feyman: {title:'🧠 费曼学习法',desc:'把学到的知识用自己的话讲给别人听，如果别人能听懂，说明你真正掌握了。',steps:['选择一个你想要理解的概念','想象你要把这个概念教给一个完全不懂的人','如果讲解过程中卡住了，就回顾原始材料','用自己的话重新组织，确保通俗易懂'],tip:'💡 最佳实践：每天用费曼学习法复习一个知识点，坚持21天形成习惯。'},
    pomodoro: {title:'⏰ 番茄工作法',desc:'25分钟专注学习，5分钟休息，循环进行，提高效率。',steps:['选择一个待完成的任务','设定25分钟倒计时（一个番茄钟）','专注工作，中途不做其他事','计时结束后休息5分钟','每4个番茄钟后休息15-30分钟'],tip:'💡 建议：使用手机闹钟或专门的番茄钟APP来计时。'},
    ebbinghaus: {title:'🔄 艾宾浩斯记忆法',desc:'学习后1天、3天、7天、14天、30天分别复习，加深长期记忆。',steps:['初次学习新知识','24小时后进行第一次复习','3天后再复习一次','7天后第三次复习','14天后第四次复习','30天后最后一次复习'],tip:'💡 关键：严格按照时间节点复习，不要偷懒！'},
    mindmap: {title:'🎨 思维导图法',desc:'用图形和关键词将知识点连接起来，形成系统化的知识结构。',steps:['在纸中央写下核心主题','从中心向外画出主分支','在每个主分支写上关键词','从关键词继续延伸子分支','用不同颜色区分不同主题','添加图标和符号增强记忆'],tip:'💡 工具推荐：可以使用XMind、幕布等软件制作数字思维导图。'},
    cornell: {title:'📝 康奈尔笔记法',desc:'将笔记分为要点、线索、总结三个区域，提高复习效率。',steps:['把笔记页面分为三部分','右侧大的区域记录主要内容','左侧区域记录提示词/关键词','底部区域写总结和问题','用笔记时遮住右侧，回忆内容','用总结区进行自测'],tip:'💡 最佳使用场景：课堂笔记、读书笔记、讲座记录。'},

    timeManagement: {title:'⏱️ 时间管理法',desc:'合理安排学习时间，提高学习效率。',steps:['列出所有待办事项','按重要性和紧急性分类','设定每个任务的完成时间','使用番茄工作法保持专注','定期回顾和调整计划'],tip:'💡 建议：每天晚上规划第二天的任务，早上执行最重要的任务。'},
    noteTaking: {title:'📒 高效笔记法',desc:'科学记笔记，让学习更高效。',steps:['使用简洁的语言和缩写','用颜色区分重点内容','建立层次分明的结构','课后及时整理和补充','定期回顾和更新笔记'],tip:'💡 工具推荐：印象笔记、有道云笔记、Notion等。'},
    testStrategy: {title:'📝 考试策略',desc:'科学应考，减少失误，提高成绩。',steps:['先浏览试卷，了解题量和难度','按先易后难的顺序答题','遇到难题先跳过，不要卡住','留出时间检查会的题','注意答题规范和卷面整洁'],tip:'💡 关键：保持平和心态，相信自己的第一判断。'},
    sq3r: {title:'📖 SQ3R阅读法',desc:'Survey泛读、Question提问、Read阅读、Recite复述、Review复习。',steps:['Survey（泛读）：快速浏览标题、目录、图表','Question（提问）：写下你想知道的问题','Read（阅读）：仔细阅读章节内容','Recite（复述）：合上书复述要点','Review（复习）：定期回顾已读内容'],tip:'💡 适合：教科书、论文、长篇文章的阅读。'}
};


function showConserveQuestion() {
    const data = window._conserveData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#a18cd1,#fbc2eb)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:12px;">⚖️ 守恒推理</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:15px;margin:16px 0;padding:16px;background:rgba(255,255,255,0.5);border-radius:16px;line-height:1.5;">' + q.q + '</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="conserveAnswer(' + i + ')" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;">' + opt + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function showMethodDetail(id) {
    const m = window.methodDetails[id];
    if (!m) return;
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:48px;margin-bottom:8px;">${m.title.split(' ')[0]}</div>
            <div style="font-size:18px;font-weight:bold;">${m.title.split(' ').slice(1).join(' ')}</div>
        </div>
        <div style="background:#f5f7ff;padding:12px;border-radius:10px;margin-bottom:16px;font-size:14px;">${m.desc}</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;">📋 具体步骤：</div>
        ${m.steps.map((s,i) => `<div style="display:flex;gap:10px;margin-bottom:8px;"><div style="width:22px;height:22px;background:var(--blue);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">${i+1}</div><div style="font-size:13px;color:var(--text-gray);">${s}</div></div>`).join('')}
        <div style="background:#fff3cd;padding:12px;border-radius:10px;font-size:12px;color:#856404;margin-top:16px;">${m.tip}</div>
        <button class="login-btn login-btn-primary" style="margin-top:16px;" onclick="closeDetail()">我学会了</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

function showThinkingType(type) {
    currentThinkingType = type;
    currentThinkingPage[type] = 0;
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const typeIcons = {
        logic: '🧮', creative: '🎨', critical: '🔍', system: '🌐',
        reverse: '🔄', divergent: '💫', converge: '🎯', spatial: '🎲',
        abstract: '🔷'
    };
    
    const typeDescs = {
        logic: '培养逻辑推理能力，学会从已知条件推导结论。',
        creative: '激发创造力，培养发散思维和创新意识。',
        critical: '学会质疑和独立思考，不盲从权威和流行观点。',
        system: '培养全局观，学会分析问题的系统性解决方案。',
        reverse: '从反面思考问题，寻找创新的解决路径。',
        divergent: '从一个点出发，探索多种可能性和答案。',
        converge: '从众多信息中提炼核心，找到最优解。',
        spatial: '培养空间想象力，理解立体和图形关系。',
        abstract: '学会透过现象看本质，提取事物核心特征。'
    };
    
    const questions = thinkingQuestions[type];
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${typeIcons[type]} ${typeNames[type]}训练</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}题 · 点击下方按钮开始练习
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;color:#333;margin-bottom:8px;"><strong>训练目标：</strong></div>
            <div style="font-size:13px;color:#666;line-height:1.6;">${typeDescs[type]}</div>
        </div>
        <button onclick="startThinkingQuiz('${type}', 0)" class="login-btn login-btn-primary" style="margin-bottom:8px;">开始练习</button>
        <button class="modal-close" onclick="closeModal()">返回</button>
    `;
}

function submitMethodAnswers(methodId, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = window.methodTrainingQuestions[methodId];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    // 收集所有答案
    const answers = [];
    let hasEmpty = false;
    
    for (let i = 0; i < pageQuestions.length; i++) {
        const input = document.getElementById(`method-answer-${i}`);
        const answer = input?.value?.trim() || '';
        if (!answer) hasEmpty = true;
        answers.push(answer);
    }
    
    if (hasEmpty && !confirm('有未填写的题目，确定提交吗？')) {
        return;
    }
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    // 显示答案对比
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${page + 1} / ${totalPages} 页
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="margin-bottom:16px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题：${q.q}
                    </div>
                    <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${answers[idx] || '<span style="color:#999;">未作答</span>'}</div>
                    </div>
                    <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${q.a}</div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="rateMethodAnswer('${methodId}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                        <button onclick="rateMethodAnswer('${methodId}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                    </div>
                    <button onclick="analyzeMethodWithAI('${methodId}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                    <div id="method-ai-result-${methodId}-${startIndex + idx}" style="margin-top:8px;"></div>
                </div>
            `).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function submitThinkingAnswers(type, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = thinkingQuestions[type];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">第 ${page + 1} / ${totalPages} 页</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => {
                let userAnswer = '';
                let isCorrect = false;
                
                if (q.opts) {
                    const optsContainer = document.getElementById(`opts-${idx}`);
                    const selectedOpt = optsContainer?.querySelector('.thinking-opt[style*="background: rgb(227, 242, 253)"]') || optsContainer?.querySelector('.thinking-opt[data-selected]');
                    const selectedIdx = selectedOpt?.dataset?.selected;
                    userAnswer = selectedIdx !== undefined ? q.opts[selectedIdx] : '未作答';
                    isCorrect = selectedIdx == q.a;
                } else {
                    const input = document.getElementById(`thinking-answer-${idx}`);
                    userAnswer = input?.value?.trim() || '未作答';
                    isCorrect = userAnswer !== '未作答' && userAnswer.length > 5;
                }
                
                return `
                    <div style="margin-bottom:16px;">
                        <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题：${q.q}</div>
                        <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                            <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                            <div style="font-size:13px;color:#333;line-height:1.5;">${userAnswer}</div>
                        </div>
                        ${q.a !== undefined ? `
                            <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                                <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                                <div style="font-size:13px;color:#333;line-height:1.5;">${q.opts ? q.opts[q.a] : q.a}</div>
                            </div>
                        ` : ''}
                        <div style="display:flex;gap:8px;">
                            <button onclick="rateThinkingAnswer('${type}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                            <button onclick="rateThinkingAnswer('${type}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                        </div>
                        <button onclick="analyzeThinkingWithAI('${type}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                        <div id="thinking-ai-result-${type}-${startIndex + idx}" style="margin-top:8px;"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startThinkingQuiz('${type}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}


// ============================================================
// Thinking - 思维训练
// ============================================================
// ============================================================
// renderMethod - 学霸方法模块渲染
// ============================================================

function renderMethod(container) {
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">💡 学霸方法 <span style="font-size:12px;color:#999;">高效学习技巧</span></h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">掌握科学学习方法，事半功倍！</p>
            
            <!-- 学习方法分类 -->
            <div class="subject-tab" style="flex-wrap:wrap;margin-bottom:16px;">
                <button class="subject-tab-btn active" onclick="filterMethod('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterMethod('费曼学习法', this)">费曼学习</button>
                <button class="subject-tab-btn" onclick="filterMethod('番茄工作法', this)">番茄工作</button>
                <button class="subject-tab-btn" onclick="filterMethod('艾宾浩斯', this)">遗忘曲线</button>
                <button class="subject-tab-btn" onclick="filterMethod('思维导图', this)">思维导图</button>
                <button class="subject-tab-btn" onclick="filterMethod('康奈尔', this)">康奈尔</button>
                <button class="subject-tab-btn" onclick="filterMethod('SQ3R', this)">SQ3R</button>
                <button class="subject-tab-btn" onclick="filterMethod('时间管理', this)">时间管理</button>
            </div>
        </div>
        
        <!-- 学习统计 -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#1A6BFF;" id="method-completed">0</div>
                <div style="font-size:12px;color:#666;">已完成</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#4CAF50;" id="method-accuracy">0%</div>
                <div style="font-size:12px;color:#666;">正确率</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF9800;" id="method-notes">0</div>
                <div style="font-size:12px;color:#666;">我的笔记</div>
            </div>
        </div>
        
        <!-- 上传笔记区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传学习笔记</div>
            <div class="upload-zone" onclick="document.getElementById('method-note-input').click()">
                <div class="upload-icon">📝</div>
                <div class="upload-text">点击上传笔记图片</div>
                <div class="upload-hint">支持 JPG、PNG 格式</div>
            </div>
            <input type="file" id="method-note-input" accept="image/*" style="display:none" onchange="handleMethodNoteUpload(this)">
            <div id="method-notes-list" style="margin-top:12px;"></div>
        </div>
        
        <!-- 练习题目区域 -->
        <div id="method-questions-container">
            ${renderMethodQuestions()}
        </div>
        
        <!-- 返回按钮 -->
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
    `;
    
    // 更新统计数据
    updateMethodStats();
    // 渲染笔记列表
    renderMethodNotes();
}

// 渲染练习题目
function renderMethodQuestions() {
    const questions = [
        {id:'feyman', title:'费曼学习法', icon:'📚', color:'#667eea', count:5},
        {id:'pomodoro', title:'番茄工作法', icon:'🍅', color:'#FF6B6B', count:5},
        {id:'ebbinghaus', title:'艾宾浩斯遗忘曲线', icon:'🧠', color:'#4facfe', count:5},
        {id:'mindmap', title:'思维导图法', icon:'🗺️', color:'#43E97B', count:5},
        {id:'cornell', title:'康奈尔笔记法', icon:'📋', color:'#fa709a', count:5},
        {id:'sq3r', title:'SQ3R阅读法', icon:'📖', color:'#a18cd1', count:5},
        {id:'timeManagement', title:'时间管理法', icon:'⏰', color:'#f6d365', count:5},
        {id:'testStrategy', title:'考试技巧', icon:'📝', color:'#FF9A63', count:5}
    ];
    
    return `
        <div class="card">
            <h4 style="margin-bottom:12px;">📝 选择学习方法开始练习</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${questions.map(q => `
                    <div onclick="openMethodQuestions('${q.id}')" style="background:${q.color};color:white;padding:16px;border-radius:16px;cursor:pointer;text-align:center;">
                        <div style="font-size:28px;margin-bottom:8px;">${q.icon}</div>
                        <div style="font-size:14px;font-weight:600;">${q.title}</div>
                        <div style="font-size:11px;opacity:0.9;margin-top:4px;">${q.count}道练习题</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openMethodQuestions(methodId) {
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法',
        noteTaking: '笔记技巧',
        testStrategy: '考试技巧'
    };
    
    const methodIcons = {
        feyman: '📚', pomodoro: '🍅', ebbinghaus: '🧠',
        mindmap: '🗺️', cornell: '📋', sq3r: '📖',
        timeManagement: '⏰', noteTaking: '📝', testStrategy: '✍️'
    };
    
    const questions = window.methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('该学习方法暂无练习题');
        return;
    }
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">${methodIcons[methodId] || '📖'} ${methodNames[methodId] || methodId}</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}道练习题
        </div>
        
        <!-- 拍照上传区域 -->
        <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:16px;">
            <div style="font-size:13px;color:#666;margin-bottom:8px;">📷 拍照上传题目图片（可选）</div>
            <input type="file" id="method-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handleQuestionPhoto(this, 'method-photo-preview')"/>
            <div style="display:flex;gap:8px;">
                <button onclick="document.getElementById('method-photo-input').click()" style="flex:1;padding:10px;background:white;border:1px solid #ddd;border-radius:8px;font-size:13px;cursor:pointer;">📷 拍照/选择图片</button>
                <button onclick="analyzeMethodPhotoWithAI()" style="flex:1;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">🤖 AI分析图片</button>
            </div>
            <div id="method-photo-preview" style="margin-top:8px;display:none;"></div>
        </div>
        
        <div id="method-questions-list" style="max-height:300px;overflow-y:auto;">
            ${questions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:12px;">${q.q}</div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的理解或答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', 0)" class="login-btn login-btn-primary" style="margin-top:12px;width:100%;">提交答案</button>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;width:100%;">返回</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

// AI分析学霸方法的图片
async function analyzeMethodPhotoWithAI() {
    const photoPreview = document.getElementById('method-photo-preview');
    const imageData = window.currentQuestionPhoto;
    
    if (!imageData) {
        showToast('请先上传图片');
        return;
    }
    
    // 直接使用新的OCR出题流程
    photoToQuestion(imageData);
}

// 导出函数
window.analyzeMethodPhotoWithAI = analyzeMethodPhotoWithAI;

function submitMethodAnswers(methodId, page) {
    SoundEffects.playSubmit();
    
    const questions = window.methodTrainingQuestions[methodId];
    if (!questions) return;
    
    const answers = [];
    let hasEmpty = false;
    
    for (let i = 0; i < questions.length; i++) {
        const input = document.getElementById('method-answer-' + i);
        const answer = input?.value?.trim() || '';
        if (!answer) hasEmpty = true;
        answers.push(answer);
    }
    
    if (hasEmpty && !confirm('有未填写的题目，确定提交吗？')) {
        return;
    }
    
    const methodNames = {
        feyman: '费曼学习法', pomodoro: '番茄工作法', ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法', cornell: '康奈尔笔记法', sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法', noteTaking: '笔记技巧', testStrategy: '考试技巧'
    };
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId] || methodId} - 答案对比</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${questions.map((q, idx) => `
                <div style="margin-bottom:16px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${idx + 1}题：${q.q}
                    </div>
                    <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${answers[idx] || '<span style="color:#999;">未作答</span>'}</div>
                    </div>
                    <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                        <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                        <div style="font-size:13px;color:#333;line-height:1.5;">${q.a}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="modal-close" onclick="closeModal()" style="width:100%;">关闭</button>
    `;
    
    // 更新统计
    updateMethodStats();
}

function updateMethodStats() {
    const user = getCurrentUserData();
    const stats = user?.methodStats || {};
    
    let totalCompleted = 0;
    let totalAnswered = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalAnswered += s.answered || 0;
    });
    
    const completedEl = document.getElementById('method-completed');
    const accuracyEl = document.getElementById('method-accuracy');
    const notesEl = document.getElementById('method-notes');
    
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalAnswered > 0 ? Math.round(totalCompleted / totalAnswered * 100) + '%' : '0%';
    if (notesEl) notesEl.textContent = user?.methodNotes?.length || 0;
}

function filterMethod(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // 重新渲染题目列表
    const container = document.getElementById('method-questions-container');
    if (container) {
        container.innerHTML = renderMethodQuestions();
    }
}

function handleMethodNoteUpload(input) {
    if (!input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const user = getCurrentUserData();
        user.methodNotes = user.methodNotes || [];
        user.methodNotes.push({
            id: Date.now(),
            image: e.target.result,
            time: Date.now()
        });
        syncUserData(user);
        showToast('笔记上传成功！');
        renderMethodNotes();
        input.value = '';
    };
    reader.readAsDataURL(file);
}

function renderMethodNotes() {
    const container = document.getElementById('method-notes-list');
    if (!container) return;
    
    const user = getCurrentUserData();
    const notes = user?.methodNotes || [];
    
    if (notes.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <div style="font-size:13px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 张笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.slice().reverse().slice(0, 6).map(n => `
                <div style="position:relative;">
                    <img src="${n.image}" style="width:100%;height:60px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="showMethodNote('${n.image}')"/>
                </div>
            `).join('')}
        </div>
    `;
}

function showMethodNote(image) {
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📷 笔记预览</div>
        <img src="${image}" style="width:100%;border-radius:12px;"/>
        <button class="modal-close" onclick="closeModal()" style="margin-top:12px;width:100%;">关闭</button>
    `;
    document.getElementById('detail-modal').classList.add('show');
}

// 导出函数到window
window.renderMethod = renderMethod;
window.openMethodQuestions = openMethodQuestions;
window.submitMethodAnswers = submitMethodAnswers;
window.updateMethodStats = updateMethodStats;
window.filterMethod = filterMethod;
window.handleMethodNoteUpload = handleMethodNoteUpload;
window.renderMethodNotes = renderMethodNotes;
window.showMethodNote = showMethodNote;


// ============================================================
// 从V144提取的缺失函数
// ============================================================

function startMethodQuiz(methodId, page = 0) {
    const questions = window.methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    // 初始化页码
    if (!currentMethodPage[methodId]) currentMethodPage[methodId] = 0;
    if (page !== undefined) currentMethodPage[methodId] = page;
    
    const currentPage = currentMethodPage[methodId];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题
                    </div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">
                        ${q.q}
                    </div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function rateMethodAnswer(methodId, isCorrect, questionIndex) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.methodStats) user.methodStats = {};
    if (!user.methodStats[methodId]) user.methodStats[methodId] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    // 避免重复统计同一题
    if (!user.methodStats[methodId].answeredQuestions.includes(questionIndex)) {
        user.methodStats[methodId].completed++;
        if (isCorrect) user.methodStats[methodId].correct++;
        user.methodStats[methodId].answeredQuestions.push(questionIndex);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = window.methodTrainingQuestions[methodId];
        const question = questions[questionIndex];
        if (question) {
            const wrongKey = 'method-' + methodId + '-' + questionIndex;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'method',
                    sourceName: '学霸方法',
                    topicId: questionIndex,
                    question: question.q,
                    answer: question.a,
                    explanation: '参考答案：' + question.a,
                    userAnswer: '未达标',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateMethodStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
    // V145修复：记录练习数据
    if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 1);
}

// AI分析学霸方法题目
async function analyzeMethodWithAI(methodId, questionIndex) {
    const resultDiv = document.getElementById('method-ai-result-' + methodId + '-' + questionIndex);
    if (!resultDiv) return;
    
    resultDiv.innerHTML = '<div style="padding:12px;text-align:center;color:#666;">🤖 AI分析中...</div>';
    
    const questions = window.methodTrainingQuestions[methodId];
    if (!questions || !questions[questionIndex]) {
        resultDiv.innerHTML = '<div style="padding:12px;color:#ff6b6b;">题目不存在</div>';
        return;
    }
    
    const question = questions[questionIndex];
    const methodNames = {
        'time': '时间管理法', 'note': '笔记整理法', 'memory': '记忆技巧',
        'reading': '阅读理解法', 'review': '复习策略', 'focus': '专注力训练',
        'planning': '计划制定法', 'energy': '精力管理', 'habit': '习惯养成'
    };
    
    const messages = [{
        role: 'user',
        content: '请分析这道学习方法的题目：\n题目：' + question.q + '\n选项：' + (question.opts ? question.opts.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('\n') : '') + '\n\n请给出详细解析和改进建议。'
    }];
    
    try {
        const result = await callDeepSeekAPI(messages, 0.7);
        if (result.error) {
            resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ ' + result.message + '</div>';
        } else {
            resultDiv.innerHTML = '<div style="padding:12px;background:#f5f7ff;border-radius:8px;font-size:13px;line-height:1.6;">🤖 ' + formatAIResponse(result.content) + '</div>';
            // 记录AI调用
            if (typeof recordDeepSeekCall === 'function') {
                recordDeepSeekCall(Math.ceil(result.content.length / 4));
            }
        }
    } catch(e) {
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请稍后重试</div>';
    }
}

function conserveAnswer(idx) {
    const data = window._conserveData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showConserveQuestion();
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('show'); }

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}


// ============================================================
// Window Exports
// ============================================================
window.startMethodQuiz = startMethodQuiz;
window.rateMethodAnswer = rateMethodAnswer;
window.analyzeMethodWithAI = analyzeMethodWithAI;
window.conserveAnswer = conserveAnswer;
window.closeDetail = closeDetail;
window.closeModal = closeModal;

// 拍照出题：OCR识别图片文字 + AI生成题目
async function photoToQuestion(imageData) {
    var modal = document.getElementById('modal');
    var content = document.getElementById('modal-content');
    if (!modal || !content) return;
    
    content.innerHTML = '<div class="modal-title">📷 拍照出题</div>' +
        '<div style="text-align:center;padding:20px;">' +
            '<img src="' + imageData + '" style="max-width:200px;max-height:150px;border-radius:8px;margin-bottom:12px;"/>' +
            '<div id="photo-ocr-status" style="font-size:13px;color:#666;">🔍 正在识别图片文字...</div>' +
        '</div>';
    modal.classList.add('show');
    
    try {
        var ocrText = '';
        if (typeof Tesseract !== 'undefined') {
            var result = await Tesseract.recognize(imageData, 'chi_sim+eng', {});
            ocrText = result.data.text.trim();
        }
        
        if (!ocrText) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 未识别到文字，请重新拍照</span>';
            return;
        }
        
        document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#43a047;">✅ 识别成功，正在生成题目...</span><br><div style="font-size:11px;color:#999;margin-top:4px;text-align:left;max-height:60px;overflow-y:auto;">' + ocrText.substring(0,300) + '</div>';
        
        // 用DeepSeek根据识别文字出题
        var messages = [
            {role: 'system', content: '你是一位专业的中学教师。根据学生上传的图片文字内容，出3道相关的练习题。每题包含题目、4个选项和正确答案。格式：\n1. 题目\nA. 选项A B. 选项B C. 选项C D. 选项D\n答案：X\n'},
            {role: 'user', content: '图片中识别到的文字内容：\n' + ocrText + '\n\n请根据这些内容出3道选择题。'}
        ];
        
        var dsResult = await callDeepSeekAPI(messages);
        
        if (dsResult.error) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ AI出题失败: ' + (dsResult.message || '未知错误') + '</span>';
            return;
        }
        
        content.innerHTML = '<div class="modal-title">📷 拍照出题结果</div>' +
            '<div style="padding:10px;font-size:13px;line-height:1.8;max-height:400px;overflow-y:auto;">' +
                formatAIResponse(dsResult.content) +
            '</div>' +
            '<button onclick="closeModal()" class="login-btn login-btn-secondary" style="margin-top:8px;">关闭</button>';
        
    } catch(e) {
        if (document.getElementById('photo-ocr-status')) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 识别失败: ' + e.message + '</span>';
        }
    }
}
window.photoToQuestion = photoToQuestion;

function showGameOver(score, total) {
    var modal = document.getElementById('modal');
    var content = document.getElementById('modal-content');
    if (!modal || !content) return;
    content.innerHTML = '<div class="modal-title">🎮 游戏结束</div>' +
        '<div style="text-align:center;padding:20px;">' +
            '<div style="font-size:36px;font-weight:bold;color:#667eea;">' + score + ' / ' + total + '</div>' +
            '<div style="font-size:14px;color:#666;margin-top:8px;">正确率: ' + (total > 0 ? Math.round(score/total*100) : 0) + '%</div>' +
        '</div>' +
        '<button onclick="closeModal()" class="login-btn login-btn-primary">确定</button>';
    modal.classList.add('show');
}
window.showGameOver = showGameOver;


// ===== js/modules/thinking.js =====
// 版本: V151

function renderThinking(container) {
    const user = getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const thinkingTypes = [
        {id:'logic',icon:'🧮',name:'逻辑思维',desc:'推理与分析',color:'#667eea'},
        {id:'creative',icon:'🎨',name:'创意思维',desc:'创新与想象',color:'#f5576c'},
        {id:'critical',icon:'🔍',name:'批判思维',desc:'质疑与判断',color:'#4facfe'},
        {id:'system',icon:'🌐',name:'系统思维',desc:'全局与关联',color:'#43e97b'},
        {id:'reverse',icon:'🔄',name:'逆向思维',desc:'反向思考',color:'#fa709a'},
        {id:'divergent',icon:'💫',name:'发散思维',desc:'多向探索',color:'#fee140'},
        {id:'converge',icon:'🎯',name:'收敛思维',desc:'聚焦归纳',color:'#a8edea'},
        {id:'spatial',icon:'🎲',name:'空间思维',desc:'立体想象',color:'#d299c2'},
        {id:'abstract',icon:'🔷',name:'抽象思维',desc:'本质概括',color:'#ffecd2'}
    ];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🧩 思维训练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">八大思维能力全面提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
                ${thinkingTypes.map(t => `
                    <div style="background:linear-gradient(135deg,${t.color},${t.color}dd);color:white;padding:14px;border-radius:12px;cursor:pointer;" onclick="showThinkingType('${t.id}')">
                        <div style="font-size:18px;margin-bottom:6px;">${t.icon}</div>
                        <div style="font-size:13px;font-weight:600;">${t.name}</div>
                        <div style="font-size:10px;opacity:0.9;margin-top:3px;">${t.desc}</div>
                        <div style="font-size:11px;margin-top:6px;opacity:0.8;">${window.thinkingQuestions[t.id].length}题</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📊 思维训练统计</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;" id="thinking-completed">${totalCompleted}</div>
                    <div style="font-size:11px;color:#666;">已完成</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;" id="thinking-accuracy">${totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%'}</div>
                    <div style="font-size:11px;color:#666;">正确率</div>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📝 学习笔记</h4>
            <div style="margin-bottom:12px;">
                <label class="upload-btn" style="display:inline-block;padding:10px 16px;background:#1A6BFF;color:white;border-radius:8px;cursor:pointer;font-size:13px;">
                    📤 上传笔记
                    <input type="file" accept="image/*" style="display:none" onchange="handleThinkingNoteUpload(this)">
                </label>
            </div>
            <div id="thinking-notes-list"></div>
        </div>
    
        <button onclick="closeFullscreenPage()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
`;
    
    renderThinkingNotes();
}


// ============================================================
window.thinkingQuestions = {
    // 逻辑思维 - 推理与分析
    logic: [
        // 基础理解 (1-5)
        {q:'如果"所有鸟都会飞"是真的，"企鹅是鸟"也是真的，那么企鹅会飞吗？', opts:['会飞','不会飞','不知道','无法判断'], a:1},
        {q:'A比B高，B比C高，C比D高。那么谁最高？', opts:['A','B','C','D'], a:0},
        {q:'小明说"所有苹果都是水果"，下列哪个能证明他说的是对的？', opts:['香蕉是水果','苹果酱是水果','梨是水果','苹果是水果'], a:3},
        {q:'"如果明天下雨，运动会延期"这句话，在什么情况下一定为假？', opts:['下雨，运动会延期','下雨，运动会不延期','不下雨，运动会延期','不下雨，运动会不延期'], a:1},
        {q:'逻辑推理中的"三段论"由哪三部分组成？', opts:['原因、经过、结果','大前提、小前提、结论','问题、分析、答案','条件、假设、推断'], a:1},
        // 应用场景 (6-10)
        {q:'数学证明题：因为∠1=∠2，∠2=∠3，所以∠1=∠3。这用了什么推理？', opts:['归纳推理','演绎推理','类比推理','跳跃推理'], a:1},
        {q:'已知A>B，C>D，那么A+C和B+D哪个大？', opts:['A+C一定大于B+D','B+D一定大于A+C','无法确定','两者相等'], a:0},
        {q:'语文阅读理解：根据"他高兴地跳了起来，眼里闪着泪光"可以推断出什么？', opts:['他很难过','他很激动','他很生气','他很害怕'], a:1},
        {q:'如果"努力学习的人会取得好成绩"是真的，且"小李努力学习"，能推出什么结论？', opts:['小李一定取得好成绩','小李可能取得好成绩','小李不会取得好成绩','无法推出结论'], a:1},
        {q:'判断推理："有的科学家是艺术家"和"所有科学家都是艺术家"的关系是什么？', opts:['第一个包含第二个','第二个包含第一个','两者可以同时为真','两者矛盾'], a:2},
        // 辨析判断 (11-15)
        {q:'下列哪个是"诉诸权威"的逻辑谬误？', opts:['因为爱因斯坦这么说，所以是对的','因为实验证明，所以是对的','因为大家都这么说','因为数学推理正确'], a:0},
        {q:'"小红学习好，所以她一定很聪明"这个推理有什么问题？', opts:['学习好和聪明不是同一概念','学习好的人都不聪明','聪明的人学习都不好','没有逻辑问题'], a:0},
        {q:'如果"明天要么下雨要么不下雨"是真的，这句话提供了什么信息？', opts:['确定信息','概率信息','没有实质信息','矛盾信息'], a:2},
        {q:'下列哪种情况属于"循环论证"？', opts:['A成立因为B，B成立因为A','因为A所以B，因为B所以C','A和B互相独立','A和B都成立'], a:0},
        {q:'从"有些猫是黑色的"可以推出什么？', opts:['所有猫都是黑色的','存在一只黑色的猫','没有猫是黑色的','所有黑色的都是猫'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"逻辑推理游戏"，说明规则', a:'设计一个需要玩家根据线索推理出答案的游戏，每条线索只能排除一种可能'},
        {q:'用逻辑推理解决：如果5个人5分钟能做5个零件，100个人做100个零件需要几分钟？', opts:['5分钟','20分钟','100分钟','500分钟'], a:0},
        {q:'发明一个"逻辑思维训练APP"的功能，它应该包含什么？', a:'包含数独、推理题、真话假话游戏等逻辑训练模块'},
        {q:'设计一个"谁是凶手"的推理故事，需要给出哪些线索？', a:'给出嫌疑人、时间线、不在场证明、关键物证等线索，让玩家推理'},
        {q:'用逻辑树分析法分析"为什么学生不喜欢上学"', a:'从原因、影响、解决方案等角度展开，画成树状图'}
    ],

    // 创意思维 - 创新与想象
    creative: [
        // 基础理解 (1-5)
        {q:'"创造性思维"和"常规思维"的主要区别是什么？', opts:['速度不同','解决问题的方式不同','参与者不同','时间长短不同'], a:1},
        {q:'头脑风暴的基本规则是什么？', opts:['批评别人的想法','数量越多越好','等别人说完再开口','只提现实可行的想法'], a:1},
        {q:'"发散思维"是什么？', opts:['从一个点向四周扩散的思考方式','按顺序一步步思考','只看一个方向的思考','模仿别人的思考'], a:0},
        {q:'以下哪个不是培养创造力的方法？', opts:['多角度思考','大量阅读','限制时间','跨界学习'], a:2},
        {q:'"横向思维"通常用什么方式寻找答案？', opts:['深挖一个方向','从不同角度切入','按步骤分析','验证已知答案'], a:1},
        // 应用场景 (6-10)
        {q:'用6根火柴棒最多能摆出几个三角形？', opts:['2个','3个','4个','5个'], a:2},
        {q:'"1+1=？"可以有创意的回答是什么？', opts:['等于2','王、田、由','一夫一妻','一群羊加一群羊还是一群羊'], a:1},
        {q:'为"环保"主题想3个创意口号，思路是什么？', a:'从不同角度：威胁角度（不环保的后果）、愿景角度（环保后的美好）、行动角度（号召行动）'},
        {q:'如何用5个相同的圆画出不同的表情？', a:'改变圆的大小、位置，添加不同五官，画出喜怒哀乐惊等表情'},
        {q:'给"手机"想出5种除了通讯以外的用途', a:'闹钟、相机、地图、计算器、手电筒、音乐播放器、阅读器等'},
        // 辨析判断 (11-15)
        {q:'创意一定是"前所未有"的吗？', opts:['一定是','不一定是','一定不是','无法判断'], a:1},
        {q:'以下哪个说法正确？', opts:['创意只能来自天才','创意可以训练和培养','创意不需要知识基础','创意和逻辑思维对立'], a:1},
        {q:'一个想法很疯狂但无法实现，还有创意价值吗？', opts:['没有','有','要看具体内容','取决于谁提出的'], a:1},
        {q:'创造力是天生的还是可以通过学习提高的？', opts:['天生的','可以提高','两者都不是','无法改变'], a:1},
        {q:'"思维导图"为什么能帮助产生创意？', a:'因为它以视觉方式展示想法之间的关系，激发更多联想'},
        // 创新实践 (16-20)
        {q:'设计一个"创意垃圾桶"，它有什么特殊功能？', a:'自动分类、能压缩垃圾、会提醒倒垃圾、外观美观等'},
        {q:'发明一种"未来学校"，描述3个创意点', a:'虚拟教室、AI老师、个性化学习路径、游戏化学习等'},
        {q:'用废旧物品做一个创意作品，说明你的设计理念', a:'用废物利用的方式，做出美观实用的物品，体现环保理念'},
        {q:'策划一个"创意市集"活动，设计3个环节', a:'想法拍卖会、创意展示区、DIY工作坊等'},
        {q:'写一个"如果我能发明一样东西"的创意故事', a:'想象发明一种解决生活中某个问题的新产品，描述功能和影响'}
    ],

    // 批判思维 - 质疑与判断
    critical: [
        // 基础理解 (1-5)
        {q:'"批判性思维"的核心是什么？', opts:['批评别人','不加思考地接受','主动质疑和分析','相信权威'], a:2},
        {q:'判断信息可信度时，首先应该问什么？', opts:['这个消息是谁说的','这个消息的来源是什么','我喜不喜欢这个信息','有没有人同意'], a:1},
        {q:'以下哪个不是批判性思维的特质？', opts:['好奇心','开放心态','急于下结论','逻辑分析'], a:2},
        {q:'"证据"和"观点"的区别是什么？', opts:['没有区别','证据是事实，观点是看法','观点是事实','证据是看法'], a:1},
        {q:'如何判断一个论证是否有效？', opts:['看说话者的身份','看是否有逻辑依据','看是否被多数人接受','看是否符合常识'], a:1},
        // 应用场景 (6-10)
        {q:'看到"吃保健品可以延长寿命10年"的广告，应该怎么思考？', a:'查看研究来源、了解样本量、考虑其他因素、识别广告夸大'},
        {q:'同学说"大家都这么做，所以是对的"，这个论证有什么问题？', opts:['没有逻辑问题','诉诸大众谬误','论据不足','结论错误'], a:1},
        {q:'如何评估一篇网络文章的可信度？', a:'查作者背景、看引用来源、对比其他信息、注意发布时间'},
        {q:'判断一道数学题的解法是否正确，应该检查什么？', a:'计算过程、公式运用、逻辑推理、结果验证'},
        {q:'历史资料说"某战役歼敌十万"，如何核实？', a:'查阅多方史料、对比其他记载、分析来源可靠性'},
        // 辨析判断 (11-15)
        {q:'"专家说的肯定是对的"，这种想法有什么问题？', opts:['没有问题','可能存在"诉诸权威"谬误','专家从不说错','应该完全相信'], a:1},
        {q:'以下哪个是"因果谬误"的例子？', opts:['公鸡叫后天亮了','努力学习成绩好','下雨地湿','天热冰棒融化'], a:0},
        {q:'看到"研究表明XX有害"的消息，应该怎么分析？', a:'看研究机构、样本数量、实验设计、是否有利益关联'},
        {q:'社交媒体上的热门话题一定是真实的吗？', opts:['一定是','不一定是','一定不是','取决于点赞数'], a:1},
        {q:'为什么"幸存者偏差"是一种思维谬误？', a:'只看到成功案例而忽略失败案例，导致错误结论'},
        // 创新实践 (16-20)
        {q:'设计一个"新闻真假辨别游戏"，说明规则', a:'展示真假新闻，玩家判断真假并说明理由，提高辨别能力'},
        {q:'分析一则你看到的广告，指出其中可能存在的误导', a:'分析广告语、数据引用、图片处理等可能的夸大或误导'},
        {q:'策划"批判性思维训练营"，设计3个活动', a:'辩论赛、案例分析、逻辑谬误识别游戏等'},
        {q:'发明"事实核查助手"APP，说明功能', a:'输入新闻，自动搜索多方信源，显示可信度评分'},
        {q:'写一篇"如何不被网络谣言欺骗"的小文章', a:'包含信息来源核查、逻辑分析、多方验证等方法'}
    ],

    // 系统思维 - 全局与关联
    system: [
        // 基础理解 (1-5)
        {q:'"系统思维"强调整什么？', opts:['单一因素','局部优化','整体性和关联性','线性因果'], a:2},
        {q:'生态系统是一个系统，它包含哪些要素？', opts:['只有动物','只有植物','动植物和它们的环境','只有微生物'], a:2},
        {q:'"蝴蝶效应"说明了什么？', opts:['蝴蝶很美','系统中的微小变化可能引起大影响','蝴蝶很危险','效应不重要'], a:1},
        {q:'在学校系统中，哪个不是重要组成部分？', opts:['学生','老师','家长','校服的款式'], a:3},
        {q:'"因果循环"和"线性因果"的区别是什么？', opts:['没有区别','循环是双向的，线性是单向的','循环更简单','线性更复杂'], a:1},
        // 应用场景 (6-10)
        {q:'解决交通拥堵问题，为什么不能只修更多路？', a:'因为可能诱导更多购车，形成"诱导需求"，治标不治本'},
        {q:'用系统思维分析"为什么学生压力大"', a:'从学校、家庭、社会、个人多层面分析，找根本原因'},
        {q:'"踢猫效应"说明什么？', a:'负面情绪会在系统中传递，从高层传到底层'},
        {q:'为什么要保护生物多样性？', a:'生态系统各部分相互关联，物种消失会影响整个系统平衡'},
        {q:'分析"网购兴起"对实体店的影响', a:'网购和实体店形成竞争，但也催生新业态，需要系统分析'},
        // 辨析判断 (11-15)
        {q:'头痛医头、脚痛医脚的问题是什么？', opts:['太便宜','太复杂','忽视系统关联','效果太好'], a:2},
        {q:'一个系统中，各部分的关系一定是线性的吗？', opts:['一定是','一定不是','有时候是','无法判断'], a:1},
        {q:'"系统思维"和"分析思维"哪个更重要？', opts:['系统思维','分析思维','两者都重要','都不重要'], a:2},
        {q:'为什么解决一个问题可能产生新问题？', a:'因为系统是关联的，局部变化可能影响其他部分'},
        {q:'家庭是一个系统，谁是核心？', opts:['父亲','母亲','孩子','没有固定核心，相互依存'], a:3},
        // 创新实践 (16-20)
        {q:'画一个"学校生态系统图"，包含所有重要元素', a:'包含学生、教师、家长、管理、课程、资源等及其关系'},
        {q:'设计"校园改进方案"，用系统思维分析', a:'分析现状、找关键点、设计干预、评估影响'},
        {q:'用系统思维分析"手机对青少年的影响"', a:'从积极、消极、短期、长期等多角度分析'},
        {q:'发明"系统模拟器"软件，能模拟什么？', a:'模拟城市发展、生态系统、公司运营等复杂系统的运行'},
        {q:'策划"系统思维工作坊"，设计3个练习', a:'因果循环图练习、系统模型搭建、杠杆点分析等'}
    ],

    // 逆向思维 - 反向思考
    reverse: [
        // 基础理解 (1-5)
        {q:'"逆向思维"的核心是什么？', opts:['从结果倒推原因','从正面思考','重复别人的方法','按部就班'], a:0},
        {q:'司马光砸缸用的是什么思维？', opts:['正向思维','逆向思维','发散思维','逻辑思维'], a:1},
        {q:'数学中的"反证法"属于什么思维？', opts:['正向思维','逆向思维','形象思维','直觉思维'], a:1},
        {q:'"假如失败了你怎么办？"这个问题训练什么思维？', opts:['正向思维','逆向思维','发散思维','逻辑思维'], a:1},
        {q:'"反面教材"利用了什么原理？', opts:['正向强化','从错误中学习','模仿','记忆'], a:1},
        // 应用场景 (6-10)
        {q:'如何用逆向思维证明"√2是无理数"？', a:'假设是有理数，推出矛盾，从而证明'},
        {q:'做菜太咸了，正向思维是加水，逆向思维怎么办？', a:'可以加糖或土豆吸盐，或增加其他食材稀释'},
        {q:'如何逆向思考"如何让更多人不喜欢你的产品"？', a:'列出这些方法，反其道而行之就是改进方法'},
        {q:'用逆向思维想一个"防盗"的好方法', a:'让小偷觉得这里没东西偷，比装报警器更有效'},
        {q:'如何逆向理解"失败是成功之母"？', a:'成功也可能导致失败，骄傲自满会让人失败'},
        // 辨析判断 (11-15)
        {q:'逆向思维适用于所有问题吗？', opts:['适用','不适用','有些问题适用','完全适用'], a:2},
        {q:'逆向思考得到的答案一定是正确的吗？', opts:['一定是','一定不是','不一定，需要验证','无法判断'], a:2},
        {q:'逆向思维和"钻牛角尖"有什么区别？', opts:['没有区别','逆向思维有逻辑，钻牛角尖没有','正好相反','无法区分'], a:1},
        {q:'什么时候逆向思维特别有用？', opts:['常规方法无效时','任何时候','简单问题','所有人都知道答案时'], a:0},
        {q:'逆向思维和批判性思维有什么关系？', opts:['完全相同','逆向是批判的一部分','批判是逆向的一部分','没有关系'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"逆向创新"游戏，怎么玩？', a:'给一个问题，先想常规解法，再想完全相反的解法'},
        {q:'用逆向思维发明一个"反向雨伞"，有什么功能？', a:'收伞时雨水向内流，不会弄湿地面或衣服'},
        {q:'策划"假如我是反派"写作练习，有什么好处？', a:'从对立面思考，理解不同立场，培养逆向思维能力'},
        {q:'用逆向思维设计"如何让学生爱上写作业"', a:'分析学生讨厌作业的原因，从根源反向解决'},
        {q:'发明"逆向日历"，它有什么特别功能？', a:'从目标倒推到今天，列出每天需要做什么'}
    ],

    // 发散思维 - 多向探索
    divergent: [
        // 基础理解 (1-5)
        {q:'"发散思维"的特点是什么？', opts:['只找一个答案','追求多个创意答案','按固定模式思考','模仿他人'], a:1},
        {q:'发散思维主要训练什么能力？', opts:['记忆力','创造力','计算能力','书写能力'], a:1},
        {q:'以下哪个不是发散思维的特点？', opts:['流畅性','变通性','独创性','唯一性'], a:3},
        {q:'"砖头有什么用？"这个问题训练什么思维？', opts:['逻辑思维','收敛思维','发散思维','逆向思维'], a:2},
        {q:'发散思维和"胡思乱想"有什么区别？', opts:['没有区别','发散思维有创意价值，胡思乱想没有','正好相反','无法区分'], a:1},
        // 应用场景 (6-10)
        {q:'想出5种方法让房间更凉爽', a:'开空调、开风扇、开窗、洒水、放冰块、挂遮阳帘、换薄窗帘等'},
        {q:'如何用发散思维解决"零花钱不够花"？', a:'节流（少买）、开源（赚取）、改变消费方式、调整期望值等'},
        {q:'给"水"想出10种不同的用途', a:'喝、洗、灭火、发电、灌溉、游泳、养鱼、稀释、制冷、发电等'},
        {q:'用发散思维给"快乐"下10个定义', a:'笑、成功、被爱、自由、健康、实现目标、有朋友、被尊重等'},
        {q:'面对"怎么保护视力"，发散思维能想到什么方案？', a:'少看屏幕、做眼保健操、吃护眼食物、定期检查、正确坐姿等'},
        // 辨析判断 (11-15)
        {q:'发散思维产生的想法越多越好吗？', opts:['是','不是，要看质量','数量最重要','无所谓'], a:1},
        {q:'发散思维训练对学习其他科目有帮助吗？', opts:['没有','有，帮助拓宽思路','有负面影响','不确定'], a:1},
        {q:'发散思维和专注思维哪个更重要？', opts:['发散','专注','两者都重要，不同阶段用不同','都不重要'], a:2},
        {q:'内向的人发散思维能力会弱吗？', opts:['会','不会','取决于其他因素','无法判断'], a:2},
        {q:'发散思维只能用于创意工作吗？', opts:['只能用于创意','不只用于创意','完全不适用','无法判断'], a:1},
        // 创新实践 (16-20)
        {q:'举办"30秒创意赛"，比谁的想法多', a:'给定主题，30秒内写下所有想到的想法，数量多者获胜'},
        {q:'用发散思维设计"未来的交通工具"', a:'飞行汽车、传送门、瞬间移动、胶囊公交等'},
        {q:'发明一个"随机词联想器"，怎么工作？', a:'随机给出两个不相关词，练习把它们联系起来'},
        {q:'策划"发散思维马拉松"，设计规则', a:'长时间头脑风暴，从一个问题发散到多个领域'},
        {q:'用发散思维解决"全球变暖"问题', a:'从能源、交通、饮食、建筑、个人行为等多角度发散思考'}
    ],

    // 收敛思维 - 聚焦归纳
    converge: [
        // 基础理解 (1-5)
        {q:'"收敛思维"的特点是什么？', opts:['发散多答案','从多到一','没有方向','不断扩展'], a:1},
        {q:'收敛思维和"优柔寡断"有什么区别？', opts:['没有区别','收敛思维有标准，优柔寡断没有','正好相反','无法区分'], a:1},
        {q:'以下哪种情况适合用收敛思维？', opts:['发明新产品','做出决策','绘画创作','写小说'], a:1},
        {q:'"归纳法"属于什么思维？', opts:['发散思维','收敛思维','逆向思维','形象思维'], a:1},
        {q:'收敛思维追求的目标是什么？', opts:['更多答案','最优答案','最新答案','所有答案'], a:1},
        // 应用场景 (6-10)
        {q:'有5个解决问题的方案，如何用收敛思维选择最优？', a:'设定评估标准，给每个方案打分，综合比较'},
        {q:'"归纳推理"：从苹果落下、石头落下、水落下，能归纳出什么？', a:'都受地球引力作用向下落'},
        {q:'面对多门功课，用收敛思维制定复习计划', a:'分析各科重要性、薄弱点、时间分配，确定复习重点'},
        {q:'从多个新闻事件中收敛出一个核心主题', a:'找出共同点、归纳规律、提炼本质'},
        {q:'如何用收敛思维从众多错题中找出重点？', a:'分类整理、找错误规律、确定薄弱知识点'},
        // 辨析判断 (11-15)
        {q:'收敛思维会限制创造力吗？', opts:['会','不会，反而帮助筛选创意','完全限制','无法判断'], a:1},
        {q:'"排除法"是收敛思维的应用吗？', opts:['是','不是','无法判断','可能'], a:0},
        {q:'收敛思维需要什么基础？', opts:['发散思维结果','逻辑推理','知识储备','以上都要'], a:3},
        {q:'收敛思维和"面面俱到"有什么区别？', opts:['没有区别','收敛是提炼，面面俱到是罗列','正好相反','无法区分'], a:1},
        {q:'什么时候收敛思维比发散思维更重要？', opts:['创意阶段','决策阶段','探索阶段','实验阶段'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"最优方案评估表"', a:'列出评估维度、权重、评分方法，帮助做出最佳选择'},
        {q:'用收敛思维分析"什么样的学生是好学生"', a:'从品德、学习、实践、社交等多维度归纳标准'},
        {q:'发明"智能决策助手"APP，说明功能', a:'输入选项和考虑因素，AI帮助分析并给出建议'},
        {q:'策划"收敛思维竞赛"，怎么比？', a:'给定多个信息，比谁先归纳出正确结论'},
        {q:'用收敛思维写"我的优点和缺点"自我分析', a:'收集多方面反馈、归纳共同点、确定核心特质'}
    ],

    // 空间思维 - 立体想象
    spatial: [
        // 基础理解 (1-5)
        {q:'"空间思维"主要训练什么能力？', opts:['语言能力','想象物体在空间中的形状和位置','记忆能力','计算能力'], a:1},
        {q:'以下哪个职业最需要空间思维？', opts:['会计','建筑师','作家','音乐家'], a:1},
        {q:'看地图时，分不清东西南北说明什么？', opts:['记忆力差','空间思维弱','视力不好','注意力不集中'], a:1},
        {q:'立方体有几个面？', opts:['6个','8个','12个','4个'], a:0},
        {q:'"三视图"包括哪三个视图？', opts:['上、下、侧面','正视图、侧视图、俯视图','大、中、小','远、中、近'], a:1},
        // 应用场景 (6-10)
        {q:'一个正方形纸片，对折一次变成什么图形？', opts:['三角形','长方形','圆形','无法确定'], a:1},
        {q:'从不同角度观察同一个物体，看到的一样吗？', opts:['完全一样','完全不一样','可能不一样','无法判断'], a:2},
        {q:'学习立体几何时，空间思维有什么作用？', a:'帮助理解立体图形性质、想象图形变换、解决证明题'},
        {q:'搭积木需要什么空间思维？', a:'理解上下左右关系、平衡感、形状组合能力'},
        {q:'如何用空间思维理解"对面""相邻""相邻的对角"？', a:'在正方体中，对面不相邻，相邻的两个面共享一条棱'},
        // 辨析判断 (11-15)
        {q:'空间思维是天生的还是可以通过训练提高的？', opts:['天生的','可以训练提高','无法改变','部分天生部分可训练'], a:3},
        {q:'男生比女生空间思维能力更强吗？', opts:['是','不是，因人而异','完全相反','无法判断'], a:1},
        {q:'玩电子游戏能提高空间思维吗？', opts:['能','不能','可能有害','不确定'], a:0},
        {q:'空间思维对学习物理有用吗？', opts:['没有','有，特别是力学和光学','有负面影响','不确定'], a:1},
        {q:'3D打印技术体现了什么空间思维能力？', a:'把虚拟三维模型转化为实物的能力'},
        // 创新实践 (16-20)
        {q:'设计一个"立体城市"模型，说明创意', a:'用纸盒、积木等制作包含建筑、道路、绿化等的微型城市'},
        {q:'发明"空间思维训练游戏"，说明玩法', a:'拼立体图形、找对面、纸盒展开图练习等'},
        {q:'用空间思维设计"理想卧室"', a:'考虑功能分区、光线流向、动线设计等'},
        {q:'策划"空间想象大赛"，比什么？', a:'比谁最快说出展开图对应的立体图形、谁画的立体图形最准确'},
        {q:'用折纸艺术训练空间思维，做一个复杂作品', a:'通过折叠纸张理解空间关系，培养动手能力'}
    ],

    // 抽象思维 - 本质概括
    abstract: [
        // 基础理解 (1-5)
        {q:'"抽象思维"的核心是什么？', opts:['具体操作','从具体事物中提取本质','看表面现象','记忆细节'], a:1},
        {q:'以下哪个是抽象概念？', opts:['苹果','水果','红富士','一个苹果'], a:1},
        {q:'"1+1=2"是抽象思维的结果吗？', opts:['是','不是','无法判断','部分是'], a:0},
        {q:'数学公式为什么是抽象的？', a:'代表一类问题的共同规律'},
        {q:'抽象思维和形象思维的主要区别是什么？', opts:['没有区别','抽象用概念，形象用图像','抽象更简单','形象更复杂'], a:1},
        // 应用场景 (6-10)
        {q:'从"猫抓老鼠、狗看家、牛耕地"能抽象出什么？', a:'动物可以被人类驯养并利用'},
        {q:'用抽象思维理解"诚信"这个概念', a:'诚信是言行一致、说到做到、守信用的品质'},
        {q:'如何用抽象思维总结一类题的解法？', a:'不记具体题目，而是总结这类题型的共同特点和通用方法'},
        {q:'从多个成功人士的故事中抽象出成功要素', a:'勤奋、坚持、创新、机遇、团队等'},
        {q:'用抽象思维理解"时间管理"', a:'时间管理是合理分配和有效利用时间以达成目标的能力'},
        // 辨析判断 (11-15)
        {q:'抽象思维能力强的人学数学一定好吗？', opts:['一定','不一定','一定不好','无法判断'], a:1},
        {q:'小学生也能进行抽象思维吗？', opts:['不能','能，但是有限','完全不能','不确定'], a:1},
        {q:'抽象概念越少越好吗？', opts:['是','不是','无法判断','视情况而定'], a:3},
        {q:'哲学思考主要运用什么思维？', opts:['形象思维','抽象思维','发散思维','逆向思维'], a:1},
        {q:'抽象思维和批判思维有什么关系？', opts:['完全独立','抽象是批判的基础','批判是抽象的基础','没有关系'], a:1},
        // 创新实践 (16-20)
        {q:'设计"概念图"，用图形表示概念关系', a:'用圆圈、箭头等表示核心概念及其从属、因果关系'},
        {q:'用抽象思维分析"什么是好的教育"', a:'从知识、能力、品德、创新等多维度概括好的教育的本质'},
        {q:'发明"抽象概念可视化工具"，说明功能', a:'把抽象概念转化成具体图像、故事或模型帮助理解'},
        {q:'策划"抽象概念辩论赛"，辩题例如"人性本善还是本恶"', a:'训练从具体事例抽象出普遍规律的能力'},
        {q:'用抽象思维写一篇"论友谊"的议论文', a:'从具体友谊经历中提炼友谊的本质、价值和维持方法'}
    ]
};


let currentThinkingType = 'logic';
let currentThinkingPage = {};

// 显示思维类型详情
function showThinkingType(type) {
    currentThinkingType = type;
    currentThinkingPage[type] = 0;
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const typeIcons = {
        logic: '🧮', creative: '🎨', critical: '🔍', system: '🌐',
        reverse: '🔄', divergent: '💫', converge: '🎯', spatial: '🎲',
        abstract: '🔷'
    };
    
    const typeDescs = {
        logic: '培养逻辑推理能力，学会从已知条件推导结论。',
        creative: '激发创造力，培养发散思维和创新意识。',
        critical: '学会质疑和独立思考，不盲从权威和流行观点。',
        system: '培养全局观，学会分析问题的系统性解决方案。',
        reverse: '从反面思考问题，寻找创新的解决路径。',
        divergent: '从一个点出发，探索多种可能性和答案。',
        converge: '从众多信息中提炼核心，找到最优解。',
        spatial: '培养空间想象力，理解立体和图形关系。',
        abstract: '学会透过现象看本质，提取事物核心特征。'
    };
    
    const questions = window.thinkingQuestions[type];
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${typeIcons[type]} ${typeNames[type]}训练</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}题 · 点击下方按钮开始练习
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;color:#333;margin-bottom:8px;"><strong>训练目标：</strong></div>
            <div style="font-size:13px;color:#666;line-height:1.6;">${typeDescs[type]}</div>
        </div>
        <button onclick="startThinkingQuiz('${type}', 0)" class="login-btn login-btn-primary" style="margin-bottom:8px;">开始练习</button>
        <button class="modal-close" onclick="closeModal()">返回</button>
    `;
}

// 开始做题（每页5题）
function startThinkingQuiz(type, page = 0) {
    const questions = window.thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        
        <!-- 拍照上传区域 -->
        <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:16px;">
            <div style="font-size:13px;color:#666;margin-bottom:8px;">📷 拍照上传题目图片（可选）</div>
            <input type="file" id="thinking-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handleQuestionPhoto(this, 'thinking-photo-preview')"/>
            <div style="display:flex;gap:8px;">
                <button onclick="document.getElementById('thinking-photo-input').click()" style="flex:1;padding:10px;background:white;border:1px solid #ddd;border-radius:8px;font-size:13px;cursor:pointer;">📷 拍照/选择图片</button>
                <button onclick="analyzeThinkingPhotoWithAI()" style="flex:1;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">🤖 AI分析图片</button>
            </div>
            <div id="thinking-photo-preview" style="margin-top:8px;display:none;"></div>
        </div>
        
        <div style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

// AI分析思维训练的图片
async function analyzeThinkingPhotoWithAI() {
    const photoPreview = document.getElementById('thinking-photo-preview');
    const imageData = window.currentQuestionPhoto;
    
    if (!imageData) {
        showToast('请先上传图片');
        return;
    }
    
    // 直接使用新的OCR出题流程
    photoToQuestion(imageData);
}

// 导出函数
window.analyzeThinkingPhotoWithAI = analyzeThinkingPhotoWithAI;

// 选择选项
function selectThinkingOpt(el, selectedIdx, questionIdx) {
    const parent = el.parentElement;
    parent.querySelectorAll('.thinking-opt').forEach(opt => {
        opt.style.background = 'white';
        opt.style.borderColor = '#e0e0e0';
    });
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    el.dataset.selected = selectedIdx;
}

// 提交全部答案
function submitThinkingAnswers(type, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = window.thinkingQuestions[type];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">第 ${page + 1} / ${totalPages} 页</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => {
                let userAnswer = '';
                let isCorrect = false;
                
                if (q.opts) {
                    const optsContainer = document.getElementById(`opts-${idx}`);
                    const selectedOpt = optsContainer?.querySelector('.thinking-opt[style*="background: rgb(227, 242, 253)"]') || optsContainer?.querySelector('.thinking-opt[data-selected]');
                    const selectedIdx = selectedOpt?.dataset?.selected;
                    userAnswer = selectedIdx !== undefined ? q.opts[selectedIdx] : '未作答';
                    isCorrect = selectedIdx == q.a;
                } else {
                    const input = document.getElementById(`thinking-answer-${idx}`);
                    userAnswer = input?.value?.trim() || '未作答';
                    isCorrect = userAnswer !== '未作答' && userAnswer.length > 5;
                }
                
                return `
                    <div style="margin-bottom:16px;">
                        <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题：${q.q}</div>
                        <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                            <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                            <div style="font-size:13px;color:#333;line-height:1.5;">${userAnswer}</div>
                        </div>
                        ${q.a !== undefined ? `
                            <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                                <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                                <div style="font-size:13px;color:#333;line-height:1.5;">${q.opts ? q.opts[q.a] : q.a}</div>
                            </div>
                        ` : ''}
                        <div style="display:flex;gap:8px;">
                            <button onclick="rateThinkingAnswer('${type}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                            <button onclick="rateThinkingAnswer('${type}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                        </div>
                        <button onclick="analyzeThinkingWithAI('${type}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                        <div id="thinking-ai-result-${type}-${startIndex + idx}" style="margin-top:8px;"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startThinkingQuiz('${type}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

// 评价答案
function rateThinkingAnswer(type, isCorrect, questionIdx) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingStats) user.thinkingStats = {};
    if (!user.thinkingStats[type]) user.thinkingStats[type] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    if (!user.thinkingStats[type].answeredQuestions.includes(questionIdx)) {
        user.thinkingStats[type].completed++;
        if (isCorrect) user.thinkingStats[type].correct++;
        user.thinkingStats[type].answeredQuestions.push(questionIdx);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = window.thinkingQuestions[type];
        const question = questions[questionIdx];
        const typeNames = {
            logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
            reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
            abstract: '抽象思维'
        };
        if (question) {
            const wrongKey = 'thinking-' + type + '-' + questionIdx;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'thinking',
                    sourceName: typeNames[type] || '思维训练',
                    topicId: questionIdx,
                    question: question.q,
                    answer: question.opts ? question.opts[question.a] : question.a,
                    explanation: '参考答案：' + (question.opts ? question.opts[question.a] : question.a),
                    userAnswer: '回答错误',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateThinkingStats();
    showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
    // V145修复：记录练习数据
    if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 1);
}

// 更新统计
function updateThinkingStats() {
    const user = getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('thinking-completed');
    const accuracyEl = document.getElementById('thinking-accuracy');
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
}

// 上传笔记
function handleThinkingNoteUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast('请上传图片文件');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.thinkingNotes) user.thinkingNotes = [];
    
    const imageUrl = URL.createObjectURL(file);
    user.thinkingNotes.push({
        id: 'thinking-note-' + Date.now(),
        image: imageUrl,
        name: file.name,
        uploadTime: new Date().toLocaleString()
    });
    syncUserData(user);
    showToast('笔记上传成功！');
    renderThinkingNotes();
}

// 渲染笔记
function renderThinkingNotes() {
    const user = getCurrentUserData();
    const notes = user?.thinkingNotes || [];
    const listEl = document.getElementById('thinking-notes-list');
    if (!listEl) return;
    
    if (notes.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无笔记</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 个笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.map(note => `
                <div style="position:relative;">
                    <img src="${note.image}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="viewThinkingNote('${note.id}')">
                    <button onclick="deleteThinkingNote('${note.id}')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

// 查看/删除笔记
function viewThinkingNote(noteId) {
    const user = getCurrentUserData();
    const note = user?.thinkingNotes?.find(n => n.id === noteId);
    if (!note) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📝 思维训练笔记</div>
        <img src="${note.image}" style="width:100%;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#999;margin-bottom:16px;">上传时间：${note.uploadTime}</div>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    `;
}

function deleteThinkingNote(noteId) {
    if (!confirm('确定删除这个笔记吗？')) return;
    const user = getCurrentUserData();
    user.thinkingNotes = user.thinkingNotes.filter(n => n.id !== noteId);
    syncUserData(user);
    renderThinkingNotes();
    showToast('笔记已删除');
}


// Window exports
window.renderThinking = renderThinking;
window.showThinkingType = showThinkingType;
window.startThinkingQuiz = startThinkingQuiz;
window.selectThinkingOpt = selectThinkingOpt;
window.submitThinkingAnswers = submitThinkingAnswers;
window.renderThinkingNotes = renderThinkingNotes;
window.handleThinkingNoteUpload = handleThinkingNoteUpload;
window.deleteThinkingNote = deleteThinkingNote;
window.updateThinkingStats = updateThinkingStats;


// ============================================================
// 从V144提取的缺失函数
// ============================================================

// AI分析思维训练题目
async function analyzeThinkingWithAI(type, questionIndex) {
    const resultDiv = document.getElementById('thinking-ai-result-' + type + '-' + questionIndex);
    if (!resultDiv) return;
    
    resultDiv.innerHTML = '<div style="padding:12px;text-align:center;color:#666;">🤖 AI分析中...</div>';
    
    const questions = window.thinkingQuestions[type];
    if (!questions || !questions[questionIndex]) {
        resultDiv.innerHTML = '<div style="padding:12px;color:#ff6b6b;">题目不存在</div>';
        return;
    }
    
    const question = questions[questionIndex];
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const messages = [{
        role: 'user',
        content: '请分析这道' + (typeNames[type] || '思维训练') + '的题目：\n题目：' + question.q + '\n选项：' + (question.opts ? question.opts.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('\n') : '') + '\n\n请给出详细解析和改进建议，帮助提升思维能力。'
    }];
    
    try {
        const result = await callDeepSeekAPI(messages, 0.7);
        if (result.error) {
            resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ ' + result.message + '</div>';
        } else {
            resultDiv.innerHTML = '<div style="padding:12px;background:#f5f7ff;border-radius:8px;font-size:13px;line-height:1.6;">🤖 ' + formatAIResponse(result.content) + '</div>';
            // 记录AI调用
            if (typeof recordDeepSeekCall === 'function') {
                recordDeepSeekCall(Math.ceil(result.content.length / 4));
            }
        }
    } catch(e) {
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请稍后重试</div>';
    }
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('show'); }

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}


// ============================================================
// Window Exports
// ============================================================
window.rateThinkingAnswer = rateThinkingAnswer;
window.viewThinkingNote = viewThinkingNote;
window.analyzeThinkingWithAI = analyzeThinkingWithAI;

window.closeDetail = closeDetail;
window.closeModal = closeModal;

// 拍照出题：OCR识别图片文字 + AI生成题目
async function photoToQuestion(imageData) {
    var modal = document.getElementById('modal');
    var content = document.getElementById('modal-content');
    if (!modal || !content) return;
    
    content.innerHTML = '<div class="modal-title">📷 拍照出题</div>' +
        '<div style="text-align:center;padding:20px;">' +
            '<img src="' + imageData + '" style="max-width:200px;max-height:150px;border-radius:8px;margin-bottom:12px;"/>' +
            '<div id="photo-ocr-status" style="font-size:13px;color:#666;">🔍 正在识别图片文字...</div>' +
        '</div>';
    modal.classList.add('show');
    
    try {
        var ocrText = '';
        if (typeof Tesseract !== 'undefined') {
            var result = await Tesseract.recognize(imageData, 'chi_sim+eng', {});
            ocrText = result.data.text.trim();
        }
        
        if (!ocrText) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 未识别到文字，请重新拍照</span>';
            return;
        }
        
        document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#43a047;">✅ 识别成功，正在生成题目...</span><br><div style="font-size:11px;color:#999;margin-top:4px;text-align:left;max-height:60px;overflow-y:auto;">' + ocrText.substring(0,300) + '</div>';
        
        // 用DeepSeek根据识别文字出题
        var messages = [
            {role: 'system', content: '你是一位专业的中学教师。根据学生上传的图片文字内容，出3道相关的练习题。每题包含题目、4个选项和正确答案。格式：\n1. 题目\nA. 选项A B. 选项B C. 选项C D. 选项D\n答案：X\n'},
            {role: 'user', content: '图片中识别到的文字内容：\n' + ocrText + '\n\n请根据这些内容出3道选择题。'}
        ];
        
        var dsResult = await callDeepSeekAPI(messages);
        
        if (dsResult.error) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ AI出题失败: ' + (dsResult.message || '未知错误') + '</span>';
            return;
        }
        
        content.innerHTML = '<div class="modal-title">📷 拍照出题结果</div>' +
            '<div style="padding:10px;font-size:13px;line-height:1.8;max-height:400px;overflow-y:auto;">' +
                formatAIResponse(dsResult.content) +
            '</div>' +
            '<button onclick="closeModal()" class="login-btn login-btn-secondary" style="margin-top:8px;">关闭</button>';
        
    } catch(e) {
        if (document.getElementById('photo-ocr-status')) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 识别失败: ' + e.message + '</span>';
        }
    }
}
window.photoToQuestion = photoToQuestion;


// ===== js/modules/podcast.js =====
// 简化版播客模块 - V144
// 设计原则：简单、不乱、好用、兼容旧版浏览器

var currentPodcastId = null;

// 播客课程数据 - 默认空数组，加载后自动填充
var podcastCourses = [];

// 播放状态
var podcastPlayerState = {
    currentPodcast: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
};

// ============================================================
// 辅助函数：生成下拉选项HTML
// ============================================================
function getPodcastSelectOptions() {
    var html = '<option value="">-- 请选择播客 --</option>';
    var categories = ['学霸方法', '数学', '英语', '物理', '化学', '语文'];
    var categoryIcons = {'学霸方法':'🎓', '数学':'📐', '英语':'📖', '物理':'⚡', '化学':'🧪', '语文':'📝'};
    var i, j, podcast;
    
    for (i = 0; i < categories.length; i++) {
        html += '<optgroup label="' + categoryIcons[categories[i]] + ' ' + categories[i] + '">';
        for (j = 0; j < podcastCourses.length; j++) {
            podcast = podcastCourses[j];
            if (podcast.category === categories[i]) {
                html += '<option value="' + podcast.id + '">' + podcast.icon + ' ' + podcast.title + ' (' + podcast.duration + ')</option>';
            }
        }
        html += '</optgroup>';
    }
    return html;
}

// ============================================================
// 简化版UI渲染
// ============================================================
function renderPodcast(container) {
    var html = '';
    html += '<!-- 顶部固定播放器 -->';
    html += '<div class="podcast-player-fixed">';
    html += '<div class="podcast-player-info">';
    html += '<span class="podcast-player-icon">🎧</span>';
    html += '<div class="podcast-player-text">';
    html += '<div class="podcast-player-title" id="podcast-player-title">选择播客开始收听</div>';
    html += '<div class="podcast-player-subtitle" id="podcast-player-subtitle">-</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="podcast-player-controls">';
    html += '<button class="podcast-btn" id="podcast-prev-btn" onclick="podcastPrev()" title="上一首">⏮</button>';
    html += '<button class="podcast-btn podcast-btn-play" id="podcast-play-btn" onclick="podcastTogglePlay()" title="播放/暂停">▶</button>';
    html += '<button class="podcast-btn" id="podcast-next-btn" onclick="podcastNext()" title="下一首">⏭</button>';
    html += '<button class="podcast-btn podcast-btn-speed" id="podcast-speed-btn" onclick="podcastCycleSpeed()" title="播放速度">1x</button>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 进度条 -->';
    html += '<div class="podcast-progress-container" id="podcast-progress-container" style="display:none;">';
    html += '<div class="podcast-progress-bar" id="podcast-progress-bar">';
    html += '<div class="podcast-progress-fill" id="podcast-progress-fill"></div>';
    html += '</div>';
    html += '<div class="podcast-time-display">';
    html += '<span id="podcast-current-time">0:00</span>';
    html += '<span id="podcast-total-time">0:00</span>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 下拉选择列表 -->';
    html += '<div class="card" style="margin-top:0;">';
    html += '<div class="podcast-select-wrapper">';
    html += '<label class="podcast-select-label">选择播客：</label>';
    html += '<select class="podcast-select" id="podcast-select" onchange="onPodcastSelectChange(this.value)">';
    html += getPodcastSelectOptions();
    html += '</select>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- 播客列表（可折叠） -->';
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div class="podcast-list-header" onclick="togglePodcastList()">';
    html += '<span>📋 播客列表</span>';
    html += '<span id="podcast-list-toggle">▼</span>';
    html += '</div>';
    html += '<div id="podcast-list-container" class="podcast-list-container">';
    html += '<div class="podcast-list-grid" id="podcast-list">';
    html += renderPodcastListItems(podcastCourses);
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    html += '<!-- AI互动问答 -->';
    html += '<div class="card" style="margin-top:12px;">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">';
    html += '<span style="font-size:18px;">🤖</span>';
    html += '<span style="font-weight:600;font-size:14px;">AI互动问答</span>';
    html += '<span style="font-size:11px;color:#999;">听课有问题？随时问AI</span>';
    html += '</div>';
    html += '<div id="podcast-chat-messages" style="max-height:200px;overflow-y:auto;margin-bottom:8px;padding:8px;background:#f8f9fa;border-radius:8px;min-height:60px;">';
    html += '<div style="text-align:center;color:#999;font-size:12px;padding:16px;">👋 听课时有任何疑问，随时提问</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<button id="podcast-voice-btn" class="podcast-btn" style="padding:8px 10px;font-size:16px;background:#f0f0f0;" onclick="togglePodcastVoice()" title="语音输入">🎤</button>';
    html += '<input type="text" id="podcast-chat-input" placeholder="输入问题..." style="flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;" onkeypress="if(event.key===\'Enter\')askPodcastAI()"/>';
    html += '<button class="podcast-btn" style="padding:8px 12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:13px;border-radius:8px;" onclick="askPodcastAI()">发送</button>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
    
    // 初始化音频元素
    initPodcastAudio();
}

// ============================================================
// 渲染播客列表项 - 使用字符串拼接，兼容旧版浏览器
// ============================================================
function renderPodcastListItems(podcasts) {
    var html = '';
    var i, p, isActive, isPlayingNow, itemHtml, indicator;
    
    for (i = 0; i < podcasts.length; i++) {
        p = podcasts[i];
        isActive = (podcastPlayerState.currentPodcast && podcastPlayerState.currentPodcast.id === p.id);
        isPlayingNow = isActive && podcastPlayerState.isPlaying;
        indicator = isPlayingNow ? '<span class="podcast-playing-indicator">🔊</span>' : '<span class="podcast-play-icon">▶</span>';
        
        itemHtml = '<div class="podcast-list-item' + (isActive ? ' active' : '') + '" onclick="playPodcastById(\'' + p.id + '\')">';
        itemHtml += '<span class="podcast-list-icon" style="background:' + p.gradient + ';">' + p.icon + '</span>';
        itemHtml += '<div class="podcast-list-info">';
        itemHtml += '<div class="podcast-list-title">' + p.title + '</div>';
        itemHtml += '<div class="podcast-list-meta">' + p.teacher + ' · ' + p.duration + '</div>';
        itemHtml += '</div>';
        itemHtml += indicator;
        itemHtml += '</div>';
        
        html += itemHtml;
    }
    
    return html;
}

// ============================================================
// 切换播客列表显示
// ============================================================
function togglePodcastList() {
    var container = document.getElementById('podcast-list-container');
    var toggle = document.getElementById('podcast-list-toggle');
    if (container && toggle) {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            toggle.textContent = '▲';
        } else {
            container.style.display = 'none';
            toggle.textContent = '▼';
        }
    }
}

// ============================================================
// 下拉选择变化
// ============================================================
function onPodcastSelectChange(podcastId) {
    if (podcastId) {
        playPodcastById(podcastId);
    }
}

// ============================================================
// 根据ID播放播客
// ============================================================
function playPodcastById(podcastId) {
    var i, podcast;
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id === podcastId) {
            podcast = podcastCourses[i];
            break;
        }
    }
    if (podcast) {
        podcastPlay(podcast);
    }
}

// ============================================================
// 播放播客 - 音频播放优先，UI更新在try-catch中
// ============================================================
function podcastPlay(podcast) {
    var audio, select, list, btn, titleEl, subtitleEl, progressEl, timeEl, self = this;
    
    // 1. 首先设置当前播客状态
    podcastPlayerState.currentPodcast = podcast;
    podcastPlayerState.isPlaying = true;
    
    // 2. 立即播放音频（最重要！）
    audio = document.getElementById('hidden-audio');
    if (audio && podcast.url) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = podcast.url;
        audio.playbackRate = podcastPlayerState.playbackRate;
        audio.load();
        
        // 使用回调处理自动播放结果
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // 播放成功
                podcastPlayerState.isPlaying = true;
                updatePodcastUI();
                if (typeof showToast === 'function') {
                    showToast('正在播放: ' + podcast.title);
                }
            }).catch(function(e) {
                // 自动播放被阻止，等待用户交互
                podcastPlayerState.isPlaying = false;
                btn = document.getElementById('podcast-play-btn');
                if (btn) btn.textContent = '▶';
                if (typeof showToast === 'function') {
                    showToast('点击播放按钮开始收听');
                }
            });
        }
        
        // 音频加载错误处理
        audio.onerror = function() {
            podcastPlayerState.isPlaying = false;
            updatePodcastUI();
            showToast('音频加载失败，请稍后重试');
        };
    } else if (!podcast.url) {
        if (typeof showToast === 'function') {
            showToast('该播客暂无音频');
        }
    }
    
    // 3. UI更新放在后面，用try-catch保护
    updatePodcastUI();
}

// ============================================================
// 更新播客UI（被podcast.js内部调用）
// ============================================================
function updatePodcastUI() {
    var podcast, titleEl, subtitleEl, btn, progressEl, timeEl, list, select;
    
    try {
        podcast = podcastPlayerState.currentPodcast;
        if (!podcast) return;
        
        titleEl = document.getElementById('podcast-player-title');
        subtitleEl = document.getElementById('podcast-player-subtitle');
        btn = document.getElementById('podcast-play-btn');
        progressEl = document.getElementById('podcast-progress-container');
        timeEl = document.getElementById('podcast-total-time');
        list = document.getElementById('podcast-list');
        select = document.getElementById('podcast-select');
        
        if (titleEl) titleEl.textContent = podcast.title;
        if (subtitleEl) subtitleEl.textContent = podcast.teacher + ' · ' + podcast.category;
        if (btn) btn.textContent = podcastPlayerState.isPlaying ? '⏸' : '▶';
        if (progressEl) progressEl.style.display = 'block';
        if (timeEl) timeEl.textContent = podcast.duration;
        
        // 更新列表
        if (list) {
            list.innerHTML = renderPodcastListItems(podcastCourses);
        }
        
        // 更新下拉选择
        if (select) select.value = podcast.id;
        
    } catch (e) {
        console.warn('更新播客UI失败:', e);
    }
    
    // 更新迷你播放器（如果有）
    try {
        if (typeof showMiniPlayer === 'function' && podcast) {
            showMiniPlayer({
                title: podcast.title,
                teacher: podcast.teacher,
                icon: podcast.icon,
                gradient: podcast.gradient,
                type: 'podcast'
            });
        }
    } catch (e) {
        console.warn('迷你播放器不可用:', e);
    }
}

// ============================================================
// 切换播放/暂停
// ============================================================
function podcastTogglePlay() {
    var audio = document.getElementById('hidden-audio');
    var btn = document.getElementById('podcast-play-btn');
    var list = document.getElementById('podcast-list');
    
    if (!audio || !podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            showToast('请先选择播客');
        }
        return;
    }
    
    if (podcastPlayerState.isPlaying) {
        audio.pause();
        podcastPlayerState.isPlaying = false;
        if (btn) btn.textContent = '▶';
    } else {
        audio.play();
        podcastPlayerState.isPlaying = true;
        if (btn) btn.textContent = '⏸';
    }
    
    // 更新列表图标
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
}

// ============================================================
// 上一首
// ============================================================
function podcastPrev() {
    var currentIndex, prevIndex, i;
    
    if (!podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            showToast('请先选择播客');
        }
        return;
    }
    
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id === podcastPlayerState.currentPodcast.id) {
            currentIndex = i;
            break;
        }
    }
    
    prevIndex = currentIndex > 0 ? currentIndex - 1 : podcastCourses.length - 1;
    podcastPlay(podcastCourses[prevIndex]);
}

// ============================================================
// 下一首
// ============================================================
function podcastNext() {
    var currentIndex, nextIndex, i;
    
    if (!podcastPlayerState.currentPodcast) {
        if (typeof showToast === 'function') {
            showToast('请先选择播客');
        }
        return;
    }
    
    for (i = 0; i < podcastCourses.length; i++) {
        if (podcastCourses[i].id === podcastPlayerState.currentPodcast.id) {
            currentIndex = i;
            break;
        }
    }
    
    nextIndex = currentIndex < podcastCourses.length - 1 ? currentIndex + 1 : 0;
    podcastPlay(podcastCourses[nextIndex]);
}

// ============================================================
// 切换播放速度
// ============================================================
function podcastCycleSpeed() {
    var speeds = [1, 1.5, 2];
    var currentIndex = -1;
    var nextIndex, audio, btn, i;
    
    for (i = 0; i < speeds.length; i++) {
        if (speeds[i] === podcastPlayerState.playbackRate) {
            currentIndex = i;
            break;
        }
    }
    
    nextIndex = (currentIndex + 1) % speeds.length;
    podcastPlayerState.playbackRate = speeds[nextIndex];
    
    audio = document.getElementById('hidden-audio');
    if (audio) audio.playbackRate = podcastPlayerState.playbackRate;
    
    btn = document.getElementById('podcast-speed-btn');
    if (btn) btn.textContent = speeds[nextIndex] + 'x';
    
    if (typeof showToast === 'function') {
        showToast('播放速度: ' + speeds[nextIndex] + 'x');
    }
}

// ============================================================
// 初始化音频元素
// ============================================================
function initPodcastAudio() {
    var audio = document.getElementById('hidden-audio');
    
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'hidden-audio';
        audio.style.display = 'none';
        document.body.appendChild(audio);
    }
    
    // 播放开始
    audio.onplay = function() {
        var playBtn, list;
        podcastPlayerState.isPlaying = true;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
    };
    
    // 暂停
    audio.onpause = function() {
        var playBtn, list;
        podcastPlayerState.isPlaying = false;
        playBtn = document.getElementById('podcast-play-btn');
        if (playBtn) playBtn.textContent = '▶';
        list = document.getElementById('podcast-list');
        if (list) list.innerHTML = renderPodcastListItems(podcastCourses);
    };
    
    // 时间更新
    audio.ontimeupdate = function() {
        var progressFill, currentTimeEl, duration;
        podcastPlayerState.currentTime = audio.currentTime;
        
        // 获取时长（优先使用实际duration，否则用预设值）
        duration = audio.duration;
        if (!duration || isNaN(duration)) {
            duration = (podcastPlayerState.currentPodcast && podcastPlayerState.currentPodcast.durationSec) 
                ? podcastPlayerState.currentPodcast.durationSec : 0;
        }
        podcastPlayerState.duration = duration;
        
        // 更新进度条
        progressFill = document.getElementById('podcast-progress-fill');
        currentTimeEl = document.getElementById('podcast-current-time');
        
        if (progressFill && podcastPlayerState.duration > 0) {
            var percent = (podcastPlayerState.currentTime / podcastPlayerState.duration) * 100;
            progressFill.style.width = percent + '%';
        }
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(podcastPlayerState.currentTime);
        }
    };
    
    // 播放结束 - V150: 加保护，如果正在清理则不自动播放下一首
    audio.onended = function() {
        if (!podcastPlayerState.currentPodcast) return;
        podcastNext();
    };
    
    // 点击进度条跳转
    var progressBar = document.getElementById('podcast-progress-bar');
    if (progressBar) {
        progressBar.onclick = function(e) {
            var rect, percent;
            if (!podcastPlayerState.duration) return;
            rect = progressBar.getBoundingClientRect();
            percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * podcastPlayerState.duration;
        };
    }
}

// ============================================================
// 格式化时间
// ============================================================
function formatTime(seconds) {
    var mins, secs;
    if (!seconds || isNaN(seconds)) return '0:00';
    mins = Math.floor(seconds / 60);
    secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}


// ============================================================
// 远程加载播客数据 - V144
// ============================================================
function loadPodcastData() {
    var dataUrl = './podcast-data.json';
    var cacheKey = 'cached_podcast_data';
    var cachedData, i, container, list, select;
    
    // 1. 先尝试从远程fetch
    fetch(dataUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function(data) {
            // 成功获取远程数据
            if (data && Array.isArray(data)) {
                // 填充到podcastCourses
                for (i = 0; i < data.length; i++) {
                    podcastCourses.push(data[i]);
                }
                // 缓存到localStorage
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) {
                    console.warn('localStorage缓存失败:', e);
                }
                // 更新UI
                refreshPodcastUI();
                console.log('播客数据加载成功: ' + data.length + '条');
            }
        })
        .catch(function(error) {
            console.warn('远程加载失败，尝试使用缓存:', error);
            // 2. fetch失败则从localStorage读取缓存
            try {
                cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    cachedData = JSON.parse(cachedData);
                    if (Array.isArray(cachedData)) {
                        for (i = 0; i < cachedData.length; i++) {
                            podcastCourses.push(cachedData[i]);
                        }
                        refreshPodcastUI();
                        console.log('从缓存加载播客数据: ' + cachedData.length + '条');
                    }
                }
            } catch (e) {
                console.warn('缓存读取失败:', e);
            }
        });
}

// ============================================================
// 刷新播客UI - 数据加载后调用
// ============================================================
function refreshPodcastUI() {
    var container, list, select, playBtn;
    
    // 如果当前在播客页面，刷新列表和下拉选择
    list = document.getElementById('podcast-list');
    if (list) {
        list.innerHTML = renderPodcastListItems(podcastCourses);
    }
    
    select = document.getElementById('podcast-select');
    if (select) {
        select.innerHTML = getPodcastSelectOptions();
    }
    
    playBtn = document.getElementById('podcast-play-btn');
    if (playBtn && !podcastPlayerState.currentPodcast) {
        playBtn.textContent = '▶';
    }
}

// 自动加载播客数据
loadPodcastData();

// ============================================================
// AI互动问答 - DeepSeek
// ============================================================
var podcastChatHistory = [];

async function askPodcastAI() {
    var input = document.getElementById('podcast-chat-input');
    var messagesEl = document.getElementById('podcast-chat-messages');
    if (!input || !messagesEl) return;
    
    var msg = input.value.trim();
    if (!msg) {
        showToast('请输入问题');
        return;
    }
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息到界面
    var userMsgHtml = '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">';
    userMsgHtml += '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:8px 12px;border-radius:12px 12px 2px 12px;max-width:80%;font-size:13px;line-height:1.5;">' + escapeHtml(msg) + '</div>';
    userMsgHtml += '</div>';
    messagesEl.innerHTML += userMsgHtml;
    
    // 添加loading
    var loadingId = 'podcast-loading-' + Date.now();
    messagesEl.innerHTML += '<div id="' + loadingId + '" style="display:flex;justify-content:flex-start;margin-bottom:8px;"><div style="background:#f0f0f0;color:#666;padding:8px 12px;border-radius:12px 12px 12px 2px;max-width:80%;font-size:13px;">思考中...</div></div>';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // 构建上下文 - 包含当前播客信息
    var context = '你是一位耐心的学习辅导老师。';
    if (podcastPlayerState.currentPodcast) {
        context += '学生正在收听播客课程《' + podcastPlayerState.currentPodcast.title + '》，由' + podcastPlayerState.currentPodcast.teacher + '老师讲授。';
        if (podcastPlayerState.currentPodcast.category) {
            context += '学科：' + podcastPlayerState.currentPodcast.category + '。';
        }
    }
    
    // 维护对话历史
    podcastChatHistory.push({role: 'user', content: msg});
    if (podcastChatHistory.length > 10) {
        podcastChatHistory = podcastChatHistory.slice(-10);
    }
    
    var apiMessages = [{role: 'system', content: context}];
    for (var i = 0; i < podcastChatHistory.length; i++) {
        apiMessages.push(podcastChatHistory[i]);
    }
    
    try {
        var result = await callDeepSeekAPI(apiMessages);
        var loadingEl = document.getElementById(loadingId);
        
        if (result.error) {
            if (loadingEl) loadingEl.innerHTML = '<div style="background:#fff3f3;color:#ff6b6b;padding:8px 12px;border-radius:12px;font-size:13px;">❌ ' + (result.type === 'balance' ? '余额不足' : '请求失败') + '</div>';
            return;
        }
        
        // 记录AI回复到历史
        podcastChatHistory.push({role: 'assistant', content: result.content});
        
        // 显示AI回复
        var aiMsgHtml = '<div style="display:flex;justify-content:flex-start;margin-bottom:8px;">';
        aiMsgHtml += '<div style="background:#f0f0f0;color:#333;padding:8px 12px;border-radius:12px 12px 12px 2px;max-width:85%;font-size:13px;line-height:1.6;">';
        aiMsgHtml += result.content.replace(/\n/g, '<br>');
        aiMsgHtml += '<div style="margin-top:4px;text-align:right;"><button onclick="speakText(this.parentElement.previousElementSibling ? this.parentElement.parentElement.innerText : \'\')" style="padding:2px 6px;background:#667eea;color:white;border:none;border-radius:4px;font-size:10px;cursor:pointer;">🔊</button></div>';
        aiMsgHtml += '</div></div>';
        
        if (loadingEl) {
            loadingEl.outerHTML = aiMsgHtml;
        } else {
            messagesEl.innerHTML += aiMsgHtml;
        }
        
        messagesEl.scrollTop = messagesEl.scrollHeight;
        
        // 记录AI调用
        if (typeof recordDeepSeekCall === 'function') {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
        }
    } catch (err) {
        var loadingEl2 = document.getElementById(loadingId);
        if (loadingEl2) loadingEl2.innerHTML = '<div style="background:#fff3f3;color:#ff6b6b;padding:8px 12px;border-radius:12px;font-size:13px;">❌ 网络错误</div>';
    }
}

function togglePodcastVoice() {
    if (typeof toggleVoiceInput === 'function') {
        var btn = document.getElementById('podcast-voice-btn');
        toggleVoiceInput(btn, 'podcast-chat-input');
    } else {
        showToast('语音输入未就绪');
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}


// ============================================================
// 停止播客音频 - V150修复：返回时音频不停
// 必须先解绑事件再暂停，否则onended/podcastNext会重新触发播放
// ============================================================
function stopPodcastAudio() {
    var audio = document.getElementById('hidden-audio');
    if (audio) {
        // 1. 先解绑所有事件回调，防止pause/src变更触发回调导致重新播放
        audio.onplay = null;
        audio.onpause = null;
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onerror = null;
        // 2. 暂停并清除
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
    }
    // 3. 重置播放状态
    if (typeof podcastPlayerState !== 'undefined' && podcastPlayerState) {
        podcastPlayerState.isPlaying = false;
        podcastPlayerState.currentPodcast = null;
        podcastPlayerState.currentTime = 0;
        podcastPlayerState.duration = 0;
    }
    // 4. 更新UI按钮状态
    var playBtn = document.getElementById('podcast-play-btn');
    if (playBtn) playBtn.textContent = '▶';
    var titleEl = document.getElementById('podcast-player-title');
    if (titleEl) titleEl.textContent = '选择播客开始收听';
    var subtitleEl = document.getElementById('podcast-player-subtitle');
    if (subtitleEl) subtitleEl.textContent = '-';
    var progressFill = document.getElementById('podcast-progress-fill');
    if (progressFill) progressFill.style.width = '0%';
    var progressContainer = document.getElementById('podcast-progress-container');
    if (progressContainer) progressContainer.style.display = 'none';
    var currentTimeEl = document.getElementById('podcast-current-time');
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    var totalTimeEl = document.getElementById('podcast-total-time');
    if (totalTimeEl) totalTimeEl.textContent = '0:00';
}

// ============================================================
// Window Exports - 确保全局可用
// ============================================================
window.renderPodcast = renderPodcast;
window.playPodcastById = playPodcastById;
window.podcastTogglePlay = podcastTogglePlay;
window.podcastPrev = podcastPrev;
window.podcastNext = podcastNext;
window.podcastCycleSpeed = podcastCycleSpeed;
window.onPodcastSelectChange = onPodcastSelectChange;
window.togglePodcastList = togglePodcastList;
window.podcastCourses = podcastCourses;
window.podcastPlay = podcastPlay;
window.askPodcastAI = askPodcastAI;
window.togglePodcastVoice = togglePodcastVoice;
window.stopPodcastAudio = stopPodcastAudio;


// ===== js/modules/video.js =====
// 版本: V144

window.videoCourses = [
    {id:"video0",title:"🐻 小熊掉苹果",teacher:"测试视频",duration:"0:10",durationSec:10,category:"测试",gradient:"linear-gradient(135deg,#f5af19,#f12711)",icon:"🐻",url:"https://www.w3schools.com/html/mov_bbb.mp4",views:9999,isTest:true},
    {id:"video1",title:"专注力训练",teacher:"认知训练",duration:"5:23",durationSec:323,category:"学习方法",gradient:"linear-gradient(135deg,#667eea,#764ba2)",icon:"🎯",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/专注力训练.mp4",views:5680},
    {id:"video2",title:"学霸深度理解法",teacher:"认知训练",duration:"6:18",durationSec:378,category:"学习方法",gradient:"linear-gradient(135deg,#f093fb,#f5576c)",icon:"📚",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/学霸深度理解法_第1集.mp4",views:4320},
    {id:"video3",title:"数学抽象推理",teacher:"认知训练",duration:"5:06",durationSec:306,category:"数学",gradient:"linear-gradient(135deg,#4facfe,#00f2fe)",icon:"🔢",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/数学抽象推理.mp4",views:3890},
    {id:"video4",title:"物理因果守恒",teacher:"认知训练",duration:"5:41",durationSec:341,category:"物理",gradient:"linear-gradient(135deg,#43e97b,#38f9d7)",icon:"⚡",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/物理因果守恒_第1集.mp4",views:2950},
    {id:"video5",title:"逆向思维训练",teacher:"认知训练",duration:"3:27",durationSec:207,category:"思维训练",gradient:"linear-gradient(135deg,#fa709a,#fee140)",icon:"🧩",url:"https://yuhang87989.github.io/cognitive-training-portal/videos/逆向思维训练_第1集.mp4",views:2150}
];

CTM.registerModule('video', {
    name: 'video',
    icon: '🎯',
    render: renderVideo
});

function renderVideo(container) {
    // 使用videoCourses数组渲染21个视频
    const videos = videoCourses.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">📺 视频课堂 <span style="font-size:12px;color:#999;">共${window.videoCourses.length}个课程</span></h3>
            <div class="subject-tab" style="flex-wrap:wrap;">
                <button class="subject-tab-btn active" onclick="filterVideoCourse('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('学习方法', this)">学习方法</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('数学', this)">数学</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('英语', this)">英语</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('物理', this)">物理</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('化学', this)">化学</button>
                <button class="subject-tab-btn" onclick="filterVideoCourse('测试', this)">测试</button>
            </div>
        </div>
        
        <!-- 上传视频区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin:12px 0;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传本地视频</div>
            <div class="upload-zone" onclick="document.getElementById('video-upload-input').click()">
                <div class="upload-icon">🎬</div>
                <div class="upload-text">点击上传视频文件</div>
                <div class="upload-hint">支持 MP4、WebM、MOV 格式（最大100MB，大视频自动压缩缓存）</div>
            </div>
            <input type="file" id="video-upload-input" accept="video/*" style="display:none" onchange="handleVideoUpload(this)">
            <div id="local-video-list" style="margin-top:12px;"></div>
        </div>
        
        <div id="video-list">${videos}</div>
    `;
    
    // 渲染本地视频列表
    renderLocalVideoList();
}

function renderLocalVideoList() {
    const user = getCurrentUserData();
    const localVideos = user?.localVideos || [];
    const listEl = document.getElementById('local-video-list');
    
    if (!listEl) return;
    
    if (localVideos.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无本地视频</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">📁 已上传 ${localVideos.length} 个视频</div>
        ${localVideos.map(video => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
                <div style="font-size:24px;">🎬</div>
                <div style="flex:1;">
                    <div style="font-size:13px;font-weight:500;">${video.title}</div>
                    <div style="font-size:11px;color:#999;">${video.duration} · ${(video.size / 1024 / 1024).toFixed(1)}MB</div>
                </div>
                <button onclick="playLocalVideo('${video.id}')" style="background:#1A6BFF;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">播放</button>
                <button onclick="deleteLocalVideo('${video.id}')" style="background:#ff6b6b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
            </div>
        `).join('')}
    `;
}

window.renderVideo = renderVideo;
window.renderLocalVideoList = renderLocalVideoList;


// ============================================================
// Player - 播放器
// ============================================================


// ============================================================
// 从V144提取的缺失函数
// ============================================================

function filterVideoCourse(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    
    var videos = window.videoCourses.filter(function(v) { return category === 'all' || v.category === category; });
    var videoHtml = videos.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    document.getElementById('video-list').innerHTML = videoHtml;
}

function playVideoFromList(id) {
    var course = window.videoCourses.find(function(v) { return v.id === id; });
    if (course) {
        // 使用增强版视频播放器，传入videoId用于记录观看进度
        openEnhancedVideoPlayer(course.title, course.url, course.id);
    }
}

// ============================================================
// Window Exports
// ============================================================
window.filterVideoCourse = filterVideoCourse;
window.playVideoFromList = playVideoFromList;
window.playLocalVideo = playLocalVideo;
window.deleteLocalVideo = deleteLocalVideo;



// ===== js/modules/player.js =====
// 版本: V144 - 视频播放器优化版本

// ========== 视频播放器全局状态 ==========
window.videoCtx = {
    isPlaying: false,
    playbackSpeed: 1,
    volume: 0.8,
    lastVolume: 0.8,
    currentVideo: null,
    isInitialized: false
};

function playPodcast(title, id) { if (id) { for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === id) { playPodcastCourse(id); return; } } } for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].title === title) { playPodcastCourse(podcastCourses[i].id); return; } } showToast('播放: ' + title); }

function playVideo(title, url) {
    document.getElementById('vp-title').textContent = title;
    document.getElementById('video-player-modal').classList.add('show');
    vpVideo = document.getElementById('vp-video');
    vpVideo.src = url;
    vpVideo.onloadedmetadata = () => { document.getElementById('vp-time').textContent = '0:00 / ' + formatTime(vpVideo.duration); };
    vpVideo.ontimeupdate = () => {
        if (vpVideo.duration) {
            document.getElementById('vp-progress-bar').style.width = (vpVideo.currentTime/vpVideo.duration*100) + '%';
            document.getElementById('vp-time').textContent = formatTime(vpVideo.currentTime) + ' / ' + formatTime(vpVideo.duration);
        }
    };
    vpVideo.onplay = () => { vpPlaying = true; document.getElementById('vp-play-btn').textContent = '⏸'; };
    vpVideo.onpause = () => { vpPlaying = false; document.getElementById('vp-play-btn').textContent = '▶'; };
    vpVideo.play();
}

function playPodcastCourse(courseId) {
    var audioEl = document.getElementById('hidden-audio');
    if (!audioEl) {
        showToast('播放器初始化失败，请刷新页面');
        return;
    }
    var course = null;
    for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === courseId) { course = podcastCourses[i]; break; } }
    if (!course) return;
    audioCtx.currentTrack = course;
    audioCtx.currentIndex = -1;
    for (var i = 0; i < podcastCourses.length; i++) { if (podcastCourses[i].id === courseId) { audioCtx.currentIndex = i; break; } }
    var titleEl = document.getElementById('ap-title');
    var coverEl = document.getElementById('ap-cover');
    var courseTitleEl = document.getElementById('ap-course-title');
    var courseTeacherEl = document.getElementById('ap-course-teacher');
    if (titleEl) titleEl.textContent = '音频课程';
    if (coverEl) { coverEl.innerHTML = course.icon; coverEl.style.background = course.gradient; }
    if (courseTitleEl) courseTitleEl.textContent = course.title;
    if (courseTeacherEl) courseTeacherEl.textContent = course.teacher + ' · ' + course.category;
    
    if (!course.shareUrl) {
        showToast('该播客暂不可用');
        return;
    }
    
    // 显示播放器UI
    showMiniPlayer(course);
    var playerEl = document.getElementById('audio-player-fullscreen');
    var coverPlayingEl = document.getElementById('ap-cover');
    if (playerEl) playerEl.classList.add('show');
    if (coverPlayingEl) coverPlayingEl.classList.add('playing');
    updatePodcastListState(courseId);
    
    // 尝试获取播客数据（包含字幕文本）
    showToast('正在加载播客...');
    fetch(course.shareUrl, {redirect: 'follow'}).then(function(resp) {
        if (!resp.ok) throw new Error('fetch failed');
        return resp.json();
    }).then(function(podcastData) {
        // 保存字幕数据供TTS使用
        if (podcastData.captions) {
            window._currentPodcastCaptions = podcastData.captions;
        }
        // 保存audio_uri
        var audioUri = podcastData.audio_uri;
        if (audioUri) {
            window._currentAudioUri = audioUri;
        }
        
        // 尝试获取签名音频URL
        return tryGetSignedAudioUrl(audioUri, courseId, audioEl);
    }).then(function(signedUrl) {
        if (signedUrl) {
            // 有签名URL，直接播放原声
            audioEl.src = signedUrl;
            if (savedPositions[courseId]) audioEl.currentTime = savedPositions[courseId];
            audioEl.playbackRate = audioCtx.playbackSpeed;
            audioEl.volume = audioCtx.volume;
            audioEl.play().then(function() {
                audioCtx.isPlaying = true;
                updatePlayButtons();
                showToast('正在播放: ' + course.title);
            }).catch(function(e) {
                showToast('播放失败，尝试语音朗读模式');
                startPodcastTTS();
            });
        } else {
            // 没有签名URL，使用TTS朗读模式
            showToast('使用语音朗读模式播放');
            startPodcastTTS();
        }
    }).catch(function(e) {
        console.error('播客加载失败:', e);
        showToast('加载失败，尝试语音朗读');
        startPodcastTTS();
    });
}

function playVideoCourse(courseId) {
    var course = null;
    for (var i = 0; i < videoCourses.length; i++) { if (videoCourses[i].id === courseId) { course = videoCourses[i]; break; } }
    if (!course) return;
    videoCtx.currentVideo = course;
    var titleEl = document.getElementById('evp-title');
    if (titleEl) titleEl.textContent = course.title;
    evpVideo.src = course.url;
    evpVideo.playbackRate = videoCtx.playbackSpeed;
    evpVideo.volume = videoCtx.volume;
    var playerEl = document.getElementById('enhanced-video-player');
    var bigPlayEl = document.getElementById('evp-big-play');
    if (playerEl) playerEl.style.display = 'flex';
    if (bigPlayEl) bigPlayEl.style.display = 'none';
    updateVideoListState(courseId);
    evpVideo.play().then(function() { videoCtx.isPlaying = true; showToast('正在播放: ' + course.title); }).catch(function(e) { videoCtx.isPlaying = false; });
}

function playLocalAudio(audioId) {
    const user = getCurrentUserData();
    const audio = user?.localAudios?.find(a => a.id === audioId);
    if (!audio) return;

    // 播放音频
    const tempAudio = new Audio(audio.url);
    tempAudio.play();
    showToast('正在播放: ' + audio.title);
}

function playLocalVideo(videoId) {
    const user = getCurrentUserData();
    const video = user?.localVideos?.find(v => v.id === videoId);
    if (!video) {
        showToast('视频信息不存在');
        return;
    }
    
    // 显示加载提示
    showToast('正在加载视频...');
    
    // 从 IndexedDB 读取视频文件
    getVideoFile(videoId).then(function(blob) {
        if (blob) {
            // 生成临时 URL 播放
            const videoUrl = URL.createObjectURL(blob);
            openEnhancedVideoPlayer(video.title, videoUrl, videoId);
        } else {
            // 视频文件已丢失
            showToast('视频文件已丢失，请重新上传');
        }
    }).catch(function(e) {
        console.error('读取视频失败:', e);
        showToast('视频加载失败，请检查网络或重新上传');
    });
}

function playMediaCourse(courseId) {
    var course = null;
    for (var i = 0; i < allMediaCourses.length; i++) {
        if (allMediaCourses[i].id === courseId) {
            course = allMediaCourses[i];
            break;
        }
    }
    if (!course) return;
    
    mediaPlayer.currentMedia = course;
    mediaPlayer.currentIndex = -1;
    for (var i = 0; i < allMediaCourses.length; i++) {
        if (allMediaCourses[i].id === courseId) {
            mediaPlayer.currentIndex = i;
            break;
        }
    }
    
    mediaPlayer.isAudio = (course.type === 'audio');
    
    // 更新UI
    var typeLabel = document.getElementById('mp-type-label');
    var audioCover = document.getElementById('mp-audio-cover');
    var videoEl = document.getElementById('mp-video-element');
    var titleEl = document.getElementById('mp-title');
    var teacherEl = document.getElementById('mp-teacher');
    
    if (typeLabel) typeLabel.textContent = mediaPlayer.isAudio ? '🎧 音频课程' : '📺 视频课程';
    
    if (mediaPlayer.isAudio) {
        if (audioCover) { audioCover.style.display = 'flex'; audioCover.innerHTML = course.icon; audioCover.style.background = course.gradient; }
        if (videoEl) videoEl.style.display = 'none';
        var audioEl = document.getElementById('mp-audio-element');
        if (audioEl) { audioEl.src = course.url; audioEl.playbackRate = mediaPlayer.playbackSpeed; audioEl.volume = mediaPlayer.volume; audioEl.play().catch(function(e) {}); }
    } else {
        if (audioCover) audioCover.style.display = 'none';
        if (videoEl) { videoEl.style.display = 'block'; videoEl.src = course.url; videoEl.playbackRate = mediaPlayer.playbackSpeed; videoEl.volume = mediaPlayer.volume; videoEl.play().catch(function(e) {}); }
    }
    
    if (titleEl) titleEl.textContent = course.title;
    if (teacherEl) teacherEl.textContent = course.teacher + ' · ' + course.category;
    
    // 恢复播放进度
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (mediaPlayer.savedPositions[courseId]) {
        if (mediaPlayer.isAudio && audioEl) audioEl.currentTime = mediaPlayer.savedPositions[courseId];
        if (!mediaPlayer.isAudio && videoEl) videoEl.currentTime = mediaPlayer.savedPositions[courseId];
    }
    
    // 显示播放器
    var playerEl = document.getElementById('media-player');
    if (playerEl) playerEl.style.display = 'flex';
    
    // 更新列表状态
    updateMediaListState(courseId);
    
    showToast('正在播放: ' + course.title);
}

function playAudioPos(pos) {
    const freqs = [440, 554, 659];
    playAudioTone3(freqs[pos]);
    const isCorrect = pos === audioSequence[audioIndex];
    if (isCorrect) {
        const el = document.getElementById('audio-seq-' + audioIndex);
        if (el) { el.style.background = '#43E97B'; el.style.color = 'white'; }
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        audioIndex++;
        SoundEffects.playCorrect();
        if (audioIndex >= audioSequence.length) setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startAudioPosition(); }, 1000);
    } else {
        SoundEffects.playWrong();
        const el = document.getElementById('audio-seq-' + audioIndex);
        if (el) el.style.background = '#FF6B6B';
        audioIndex = 0;
        setTimeout(() => {
            for (let i = 0; i < audioSequence.length; i++) {
                const seqEl = document.getElementById('audio-seq-' + i);
                if (seqEl) { seqEl.style.background = '#f0f0f0'; seqEl.style.color = '#333'; }
            }
        }, 500);
    }
}

function playAudioTone3(freq) {
    SoundEffects.init();
    const osc = SoundEffects.audioContext.createOscillator();
    const gain = SoundEffects.audioContext.createGain();
    osc.connect(gain);
    gain.connect(SoundEffects.audioContext.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, SoundEffects.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundEffects.audioContext.currentTime + 0.4);
    osc.start();
    osc.stop(SoundEffects.audioContext.currentTime + 0.4);
}

function initAudioPlayer() {
    currentAudio = document.getElementById('hidden-audio');
    if (!currentAudio) return;
    currentAudio.addEventListener('timeupdate', updateAudioProgress);
    currentAudio.addEventListener('loadedmetadata', onAudioLoaded);
    currentAudio.addEventListener('ended', onAudioEnded);
    currentAudio.addEventListener('play', function() { audioCtx.isPlaying = true; updatePlayButtons(); });
    currentAudio.addEventListener('pause', function() { audioCtx.isPlaying = false; updatePlayButtons(); });
    try { var saved = localStorage.getItem('podcastPositions'); if (saved) savedPositions = JSON.parse(saved); } catch(e) {}
}

function initUnifiedPlayer() {
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (!audioEl || !videoEl) return;
    
    audioEl.addEventListener('timeupdate', updateMediaProgress);
    audioEl.addEventListener('loadedmetadata', onMediaLoaded);
    audioEl.addEventListener('ended', playNextMedia);
    audioEl.addEventListener('play', function() { mediaPlayer.isPlaying = true; updateMediaPlayButtons(); });
    audioEl.addEventListener('pause', function() { mediaPlayer.isPlaying = false; updateMediaPlayButtons(); });
    
    videoEl.addEventListener('timeupdate', updateMediaProgress);
    videoEl.addEventListener('loadedmetadata', onMediaLoaded);
    videoEl.addEventListener('ended', playNextMedia);
    videoEl.addEventListener('play', function() { mediaPlayer.isPlaying = true; updateMediaPlayButtons(); });
    videoEl.addEventListener('pause', function() { mediaPlayer.isPlaying = false; updateMediaPlayButtons(); });
    
    try { 
        var saved = localStorage.getItem('mediaPositions'); 
        if (saved) mediaPlayer.savedPositions = JSON.parse(saved); 
        else mediaPlayer.savedPositions = {};
    } catch(e) { mediaPlayer.savedPositions = {}; }
    
    initMediaCourses();
}

function initEnhancedVideoPlayer() {
    // 避免重复初始化
    if (videoCtx.isInitialized) return;
    
    evpVideo = document.getElementById('evp-video');
    if (!evpVideo) return;
    
    // 使用命名函数引用，便于后续移除
    const boundPlayHandler = function() { videoCtx.isPlaying = true; updateEnhancedPlayButtons(); };
    const boundPauseHandler = function() { videoCtx.isPlaying = false; updateEnhancedPlayButtons(); };
    
    evpVideo.addEventListener('timeupdate', updateEnhancedVideoProgress);
    evpVideo.addEventListener('loadedmetadata', onEnhancedVideoLoaded);
    evpVideo.addEventListener('ended', onEnhancedVideoEnded);
    evpVideo.addEventListener('play', boundPlayHandler);
    evpVideo.addEventListener('pause', boundPauseHandler);
    evpVideo.addEventListener('error', onEnhancedVideoError);
    evpVideo.addEventListener('waiting', onEnhancedVideoWaiting);
    evpVideo.addEventListener('canplay', onEnhancedVideoCanPlay);
    
    // 标记为已初始化
    videoCtx.isInitialized = true;
}

function closeAudioPlayer() { 
    // 停止音频和TTS
    if (currentAudio) { currentAudio.pause(); audioCtx.isPlaying = false; }
    stopPodcastTTS();
    // 隐藏全屏播放器
    var playerEl = document.getElementById('audio-player-fullscreen'); 
    var coverEl = document.getElementById('ap-cover'); 
    if (playerEl) playerEl.classList.remove('show'); 
    if (coverEl) coverEl.classList.remove('playing');
    // 显示迷你播放器
    if (audioCtx.currentTrack) {
        var miniEl = document.getElementById('mini-player');
        if (miniEl) miniEl.classList.add('show');
    }
    updatePlayButtons();
}

function closeMediaPlayer() {
    var playerEl = document.getElementById('media-player');
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (playerEl) playerEl.style.display = 'none';
    if (audioEl) { audioEl.pause(); audioEl.currentTime = 0; }
    if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
    mediaPlayer.isPlaying = false;
    document.querySelectorAll('.media-item').forEach(function(item) { item.classList.remove('playing'); });
}

function closeMiniPlayer() { 
    // 完全停止音频和TTS
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio.src = ''; } 
    stopPodcastTTS();
    audioCtx.isPlaying = false; 
    audioCtx.currentTrack = null;
    window._currentPodcastCaptions = null;
    window._currentAudioUri = null;
    // 隐藏迷你播放器和全屏播放器
    var miniEl = document.getElementById('mini-player'); 
    var playerEl = document.getElementById('audio-player-fullscreen'); 
    if (miniEl) miniEl.classList.remove('show'); 
    if (playerEl) playerEl.classList.remove('show');
    // 清除播放状态
    document.querySelectorAll('.podcast-item-enhanced').forEach(function(item) { item.classList.remove('playing'); });
    updatePlayButtons();
}

function closeEnhancedVideoPlayer() { 
    if (evpVideo) { evpVideo.pause(); evpVideo.src = ''; } 
    videoCtx.isPlaying = false; 
    videoCtx.currentVideo = null;
    var playerEl = document.getElementById('enhanced-video-player'); 
    if (playerEl) playerEl.style.display = 'none';
    // 退出全屏模式
    if (document.fullscreenElement) { document.exitFullscreen().catch(function() {}); }
}

function toggleAudioPlay() {
    // 如果正在TTS朗读，控制TTS
    if (window._currentPodcastCaptions && !currentAudio.src) {
window.closeEnhancedVideoPlayer = closeEnhancedVideoPlayer;
window.closeVideoPlayer = closeVideoPlayer;
window.seekEnhancedVideo = seekEnhancedVideo;
window.seekEnhancedVideoBackward = seekEnhancedVideoBackward;
window.seekEnhancedVideoForward = seekEnhancedVideoForward;
window.seekVideo = seekVideo;
window.toggleEnhancedFullscreen = toggleEnhancedFullscreen;
window.toggleEnhancedMute = toggleEnhancedMute;
window.toggleEnhancedSpeedDropdown = toggleEnhancedSpeedDropdown;
window.toggleEnhancedVideoPlay = toggleEnhancedVideoPlay;
window.togglePictureInPicture = togglePictureInPicture;
window.toggleVolume = toggleVolume;
window.toggleVpPlay = toggleVpPlay;
window.onEnhancedVideoError = onEnhancedVideoError;
window.onEnhancedVideoWaiting = onEnhancedVideoWaiting;
window.onEnhancedVideoCanPlay = onEnhancedVideoCanPlay;
window.initEnhancedVideoPlayer = initEnhancedVideoPlayer;
        if (audioCtx.isPlaying) { stopPodcastTTS(); }
        else { audioCtx.isPlaying = true; updatePlayButtons(); speakNextCaption(); }
        return;
    }
    if (!currentAudio) return;
    if (audioCtx.isPlaying) currentAudio.pause(); else currentAudio.play();
}

function toggleMediaPlay() {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl) return;
    if (mediaPlayer.isPlaying) mediaEl.pause();
    else mediaEl.play();
}

function toggleEnhancedVideoPlay() {
    if (!evpVideo) return;
    if (videoCtx.isPlaying) { evpVideo.pause(); var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'flex'; }
    else { evpVideo.play(); var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'none'; }
}

function togglePlayPause() {
    const audio = document.getElementById('hidden-audio');
    const btn = document.getElementById('mp-play-btn');
    if (audio && btn) {
        if (audio.paused) {
            audio.play();
            btn.textContent = '⏸';
        } else {
            audio.pause();
            btn.textContent = '▶';
        }
    }
}

function seekAudio(e) {
    if (!currentAudio) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentAudio.currentTime = Math.floor(percent * currentAudio.duration);
    updateAudioProgress();
}

function seekVideo(e) { if (!vpVideo || !vpVideo.duration) return; const rect = e.target.getBoundingClientRect(); vpVideo.currentTime = ((e.clientX-rect.left)/rect.width)*vpVideo.duration; }

function seekMediaPlayer(e) {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl || !mediaEl.duration) return;
    var bar = document.getElementById('mp-progress-bar');
    if (!bar) return;
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mediaEl.currentTime = percent * mediaEl.duration;
}

function seekEnhancedVideo(e) { if (!evpVideo || !evpVideo.duration) return; var bar = document.getElementById('evp-progress'); if (!bar) return; var rect = bar.getBoundingClientRect(); var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); evpVideo.currentTime = percent * evpVideo.duration; }

function seekEnhancedVideoBackward() { seekEnhancedVideoBy(-10); }

function seekEnhancedVideoForward() { seekEnhancedVideoBy(10); }

function seekEnhancedVideoBy(seconds) { if (!evpVideo) return; evpVideo.currentTime = Math.max(0, Math.min(evpVideo.duration, evpVideo.currentTime + seconds)); }

function seekAudioPlayer(e) {
    if (!currentAudio || !currentAudio.duration) return;
    var bar = document.getElementById('ap-progress-bar');
    if (!bar) return;
    var rect = bar.getBoundingClientRect();
    var percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    currentAudio.currentTime = percent * currentAudio.duration;
}

function setVolume(value) { audioCtx.volume = value / 100; if (currentAudio) currentAudio.volume = audioCtx.volume; updateVolumeIcon(value); }

function toggleVolume() { if (!evpVideo) return; evpVideo.muted = !evpVideo.muted; var btn = document.getElementById('vp-volume-btn'); if (btn) btn.textContent = evpVideo.muted ? '🔇' : '🔊'; }

function setEnhancedVolume(value) { videoCtx.volume = value / 100; if (evpVideo) evpVideo.volume = videoCtx.volume; updateEnhancedVolumeIcon(value); }

function toggleMute() {
    if (audioCtx.volume > 0) { audioCtx.lastVolume = audioCtx.volume; setVolume(0); var sliderEl = document.getElementById('ap-volume-slider'); if (sliderEl) sliderEl.value = 0; }
    else { setVolume((audioCtx.lastVolume || 0.8) * 100); var sliderEl = document.getElementById('ap-volume-slider'); if (sliderEl) sliderEl.value = (audioCtx.lastVolume || 0.8) * 100; }
}

function toggleEnhancedMute() {
    if (videoCtx.volume > 0) { videoCtx.lastVolume = videoCtx.volume; setEnhancedVolume(0); var sliderEl = document.getElementById('evp-volume-slider'); if (sliderEl) sliderEl.value = 0; }
    else { setEnhancedVolume((videoCtx.lastVolume || 0.8) * 100); var sliderEl = document.getElementById('evp-volume-slider'); if (sliderEl) sliderEl.value = (videoCtx.lastVolume || 0.8) * 100; }
}

function toggleMediaMute() {
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (mediaPlayer.volume > 0) {
        mediaPlayer.lastVolume = mediaPlayer.volume;
        mediaPlayer.volume = 0;
    } else {
        mediaPlayer.volume = mediaPlayer.lastVolume || 0.8;
    }
    if (audioEl) audioEl.volume = mediaPlayer.volume;
    if (videoEl) videoEl.volume = mediaPlayer.volume;
    updateVolumeIcon();
}

function setPlaybackSpeed(speed) {
    audioCtx.playbackSpeed = speed;
    if (currentAudio) currentAudio.playbackRate = speed;
    var speedBtnEl = document.getElementById('ap-speed-btn');
    var dropdownEl = document.getElementById('ap-speed-dropdown');
    if (speedBtnEl) speedBtnEl.textContent = speed + 'x';
    if (dropdownEl) dropdownEl.classList.remove('show');
    document.querySelectorAll('.ap-speed-option').forEach(function(opt) { opt.classList.toggle('active', opt.textContent.trim() === speed + 'x'); });
}

function setEnhancedPlaybackSpeed(speed) { videoCtx.playbackSpeed = speed; if (evpVideo) evpVideo.playbackRate = speed; var speedBtnEl = document.getElementById('evp-speed-btn'); if (speedBtnEl) speedBtnEl.textContent = speed + 'x'; }

function cyclePlaybackSpeed() {
    var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    var currentIndex = speeds.indexOf(mediaPlayer.playbackSpeed);
    if (currentIndex < 0) currentIndex = 2;
    currentIndex = (currentIndex + 1) % speeds.length;
    mediaPlayer.playbackSpeed = speeds[currentIndex];
    
    var audioEl = document.getElementById('mp-audio-element');
    var videoEl = document.getElementById('mp-video-element');
    if (audioEl) audioEl.playbackRate = mediaPlayer.playbackSpeed;
    if (videoEl) videoEl.playbackRate = mediaPlayer.playbackSpeed;
    
    var speedBtnEl = document.getElementById('mp-speed-btn');
    if (speedBtnEl) speedBtnEl.textContent = mediaPlayer.playbackSpeed + 'x';
}

function toggleSpeedDropdown() { var dropdownEl = document.getElementById('ap-speed-dropdown'); if (dropdownEl) dropdownEl.classList.toggle('show'); }

function toggleEnhancedSpeedDropdown() { var speeds = [0.5, 1, 1.25, 1.5, 2]; var currentIndex = speeds.indexOf(videoCtx.playbackSpeed); var nextIndex = (currentIndex + 1) % speeds.length; setEnhancedPlaybackSpeed(speeds[nextIndex]); }

function showMiniPlayer(course) { var thumbEl = document.getElementById('mini-player-thumb'); var titleEl = document.getElementById('mini-player-title'); var teacherEl = document.getElementById('mini-player-teacher'); var playerEl = document.getElementById('mini-player'); if (thumbEl) { thumbEl.innerHTML = course.icon; thumbEl.style.background = course.gradient; } if (titleEl) titleEl.textContent = course.title; if (teacherEl) teacherEl.textContent = course.teacher; if (playerEl) playerEl.classList.add('show'); }

function showVideoPlayer(title, url, videoId) {
    openEnhancedVideoPlayer(title, url, videoId);
}

function openEnhancedVideoPlayer(title, url, videoId) {
    const playerEl = document.getElementById('enhanced-video-player');
    const videoEl = document.getElementById('evp-video');
    const titleEl = document.getElementById('evp-title');
    const bigPlayEl = document.getElementById('evp-big-play');
    const loadingEl = document.getElementById('evp-loading');
    
    if (playerEl && videoEl && titleEl) {
        titleEl.textContent = title;
        
        // 显示加载状态
        if (loadingEl) loadingEl.style.display = 'flex';
        if (bigPlayEl) bigPlayEl.style.display = 'none';
        
        // 记录视频ID
        if (videoId) {
            videoEl.dataset.videoId = videoId;
        }
        
        // 先移除旧的事件监听器（避免重复）
        const onVideoLoadedForResume = function() {
            // 恢复上次观看位置
            if (videoId) {
                const record = getVideoWatchRecord(videoId);
                if (record && record.progress < 90) {
                    const savedTime = (record.progress / 100) * videoEl.duration;
                    if (savedTime > 0 && !isNaN(savedTime)) {
                        videoEl.currentTime = savedTime;
                        showToast('已恢复到上次观看位置');
                    }
                }
            }
            // 移除这个一次性监听器
            videoEl.removeEventListener('loadedmetadata', onVideoLoadedForResume);
        };
        
        // 只在需要时添加一次性恢复监听器
        if (videoId) {
            videoEl.addEventListener('loadedmetadata', onVideoLoadedForResume);
        }
        
        // 检查URL是否有效
        if (!url || url === '' || url.indexOf('undefined') !== -1 || url.indexOf('null') !== -1) {
            showToast('视频地址无效');
            if (loadingEl) loadingEl.style.display = 'none';
            if (bigPlayEl) bigPlayEl.style.display = 'flex';
            return;
        }
        
        // 设置视频兼容性属性
        videoEl.preload = 'metadata';
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('webkit-playsinline', '');
        videoEl.setAttribute('x5-video-player-type', 'h5');
        videoEl.setAttribute('x5-video-player-fullscreen', 'true');
        
        // 使用source标签方式设置视频源，浏览器可以按顺序尝试
        // 先清除旧的source标签
        while (videoEl.firstChild) {
            videoEl.removeChild(videoEl.firstChild);
        }
        
        // 优先使用本地缓存（减少网络请求，解决卡顿）
        var finalUrl = url;
        if (url && url.indexOf('http') === 0 && url.indexOf('blob:') === -1) {
            getCachedVideo(url).then(function(cachedBlob) {
                if (cachedBlob) {
                    var cachedUrl = URL.createObjectURL(cachedBlob);
                    var sourceEl = document.createElement('source');
                    sourceEl.src = cachedUrl;
                    sourceEl.type = 'video/mp4';
                    videoEl.appendChild(sourceEl);
                    videoEl.src = cachedUrl;
                    console.log('使用缓存视频:', title);
                } else {
                    setVideoSourceFromUrl(videoEl, url);
                    // 播放后缓存视频
                    cacheVideoFromUrl(url);
                }
            }).catch(function() {
                setVideoSourceFromUrl(videoEl, url);
                cacheVideoFromUrl(url);
            });
        } else {
            setVideoSourceFromUrl(videoEl, url);
        }
        
        // 重置错误状态和重试计数
        videoEl.dataset.videoRetryCount = '0';
        
        videoEl.playbackRate = videoCtx.playbackSpeed;
        videoEl.volume = videoCtx.volume;
        
        playerEl.style.display = 'flex';
        
        // 确保视频元素引用是最新的
        evpVideo = videoEl;
        
        // 尝试播放，处理自动播放限制（移动端）
        const attemptPlay = function() {
            videoEl.play().then(function() {
                videoCtx.isPlaying = true;
                if (bigPlayEl) bigPlayEl.style.display = 'none';
                showToast('正在播放: ' + title);
            }).catch(function(e) {
                // 自动播放被阻止（常见于移动端），显示大播放按钮等待用户点击
                videoCtx.isPlaying = false;
                if (bigPlayEl) bigPlayEl.style.display = 'flex';
                console.log('自动播放被阻止，等待用户交互:', e.message);
            });
        };
        
        // 延迟执行播放尝试，确保 loadedmetadata 已触发
        setTimeout(attemptPlay, 100);
    }
}

function toggleMiniPlayer() { if (!currentAudio) return; if (audioCtx.isPlaying) currentAudio.pause(); else currentAudio.play(); }

function toggleEnhancedFullscreen() { var playerEl = document.getElementById('enhanced-video-player'); if (!playerEl) return; if (document.fullscreenElement) { document.exitFullscreen().catch(function(e) {}); } else { playerEl.requestFullscreen().catch(function(e) {}); } }

function togglePictureInPicture() { if (!evpVideo) return; if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(function(e) {}); } else { evpVideo.requestPictureInPicture().catch(function(e) { showToast('画中画模式不支持'); }); } }

function updateMediaProgress() {
    var mediaEl = getCurrentMediaElement();
    if (!mediaEl || !mediaEl.duration) return;
    
    var progress = (mediaEl.currentTime / mediaEl.duration) * 100;
    var fillEl = document.getElementById('mp-progress-fill');
    var currentTimeEl = document.getElementById('mp-current-time');
    
    if (fillEl) fillEl.style.width = progress + '%';
    if (currentTimeEl) currentTimeEl.textContent = formatMediaTime(mediaEl.currentTime);
    
    // 保存进度
    if (mediaPlayer.currentMedia) {
        mediaPlayer.savedPositions[mediaPlayer.currentMedia.id] = mediaEl.currentTime;
        try { localStorage.setItem('mediaPositions', JSON.stringify(mediaPlayer.savedPositions)); } catch(e) {}
    }
}

function updateAudioProgress() {
    if (!currentAudio) return;
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    document.getElementById('audio-progress-bar').style.width = progress + '%';
    document.getElementById('audio-current-time').textContent = formatTime(currentAudio.currentTime);
    document.getElementById('audio-duration').textContent = formatTime(currentAudio.duration);
}

function updateEnhancedVideoProgress() { if (!evpVideo || !evpVideo.duration) return; var progress = (evpVideo.currentTime / evpVideo.duration) * 100; var barEl = document.getElementById('evp-progress-bar'); var timeEl = document.getElementById('evp-time'); if (barEl) barEl.style.width = progress + '%'; if (timeEl) timeEl.textContent = formatTimeFull(evpVideo.currentTime) + ' / ' + formatTimeFull(evpVideo.duration); }

function onAudioEnded() { playNextTrack(); }

function onAudioLoaded() { var totalEl = document.getElementById('ap-total-time'); if (totalEl) totalEl.textContent = formatTimeFull(currentAudio.duration); }

function onEnhancedVideoEnded() { videoCtx.isPlaying = false; var bigPlayEl = document.getElementById('evp-big-play'); if (bigPlayEl) bigPlayEl.style.display = 'flex'; updateEnhancedPlayButtons(); }

function onEnhancedVideoLoaded() { 
    var timeEl = document.getElementById('evp-time'); 
    var loadingEl = document.getElementById('evp-loading');
    if (timeEl) timeEl.textContent = '0:00 / ' + formatTimeFull(evpVideo.duration); 
    if (loadingEl) loadingEl.style.display = 'none';
}

// 视频错误处理
function onEnhancedVideoError(e) {
    videoCtx.isPlaying = false;
    var loadingEl = document.getElementById('evp-loading');
    var bigPlayEl = document.getElementById('evp-big-play');
    var playerEl = document.getElementById('enhanced-video-player');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (bigPlayEl) bigPlayEl.style.display = 'flex';
    
    // 获取视频元素
    var videoEl = document.getElementById('evp-video');
    
    // 检查播放器是否可见，如果不可见说明是自动加载失败，不显示toast
    var isPlayerVisible = false;
    if (playerEl && playerEl.style.display !== 'none') {
        isPlayerVisible = true;
    }
    
    // 如果播放器不可见，不显示任何错误提示（避免首页自动加载失败弹窗）
    if (!isPlayerVisible) {
        console.warn('视频加载失败但播放器不可见，已忽略');
        return;
    }
    
    // 获取重试次数
    var retryCount = 0;
    if (videoEl && videoEl.dataset) {
        retryCount = parseInt(videoEl.dataset.videoRetryCount) || 0;
    }
    
    // 检查是否是src为空的情况
    var isEmptySrc = false;
    if (videoEl && (!videoEl.src || videoEl.src === '' || videoEl.src.indexOf('undefined') !== -1 || videoEl.src.indexOf('null') !== -1)) {
        isEmptySrc = true;
    }
    
    // 判断是否是本地视频（blob URL）还是网络视频
    var isLocalVideo = false;
    if (videoEl && videoEl.src && videoEl.src.indexOf('blob:') === 0) {
        isLocalVideo = true;
    }
    
    var errorMsg = '视频加载失败';
    var errorCode = 0;
    if (videoEl && videoEl.error) {
        errorCode = videoEl.error.code;
    }
    
    // 判断是否应该重试（网络视频可以重试，blob本地视频不需要）
    if (retryCount === 0 && !isEmptySrc && errorCode === 4 && !isLocalVideo) {
        // error code 4 在移动端经常是网络/自动播放问题，不一定是格式不支持
        // 第一次失败时自动重试一次（仅针对网络视频）
        if (videoEl && videoEl.src && videoEl.src.indexOf('blob:') !== 0) {
            videoEl.dataset.videoRetryCount = '1';
            // 减少重试提示频率，只在重试时提示一次
            setTimeout(function() {
                var currentSrc = videoEl.src;
                videoEl.load(); // 重置错误状态
                // 重新设置src触发加载
                var tempSrc = currentSrc;
                videoEl.src = '';
                setTimeout(function() {
                    videoEl.src = tempSrc;
                    videoEl.load();
                }, 50);
            }, 1000);
            return; // 不显示错误提示，等待重试
        }
    }
    
    // 重试后仍然失败，显示更友好的错误提示
    if (isEmptySrc || (videoEl && (!videoEl.src || videoEl.src === ''))) {
        errorMsg = isLocalVideo ? '视频文件已丢失，请重新上传' : '视频加载失败，请检查网络';
    } else if (isLocalVideo) {
        // 本地视频的错误提示
        switch(errorCode) {
            case 1: errorMsg = '视频读取被中断'; break;
            case 2: errorMsg = '视频文件损坏，请重新上传'; break;
            case 3: errorMsg = '视频格式不支持'; break;
            case 4: errorMsg = '视频加载失败，请重新上传'; break;
            default: errorMsg = '视频加载失败，请重新上传'; break;
        }
    } else {
        // 网络视频的错误提示
        switch(errorCode) {
            case 1: errorMsg = '视频加载被中断'; break;
            case 2: errorMsg = '网络错误，请检查网络连接'; break;
            case 3: errorMsg = '视频解码失败，请稍后重试'; break;
            case 4: errorMsg = '视频加载失败，请检查网络或稍后重试'; break;
            default: errorMsg = '网络视频加载失败，请检查网络连接'; break;
        }
    }
    
    // 重置重试计数
    if (videoEl && videoEl.dataset) {
        videoEl.dataset.videoRetryCount = '0';
    }
    
    showToast(errorMsg);
    if (videoEl && videoEl.error) {
        console.error('视频加载错误:', videoEl.error);
    }
}

// 视频缓冲等待状态
function onEnhancedVideoWaiting() {
    var loadingEl = document.getElementById('evp-loading');
    if (loadingEl) loadingEl.style.display = 'flex';
}

// 视频可以播放状态
function onEnhancedVideoCanPlay() {
    var loadingEl = document.getElementById('evp-loading');
    if (loadingEl) loadingEl.style.display = 'none';
}

function onMediaLoaded() {
    var mediaEl = getCurrentMediaElement();
    var totalEl = document.getElementById('mp-total-time');
    if (totalEl && mediaEl) totalEl.textContent = formatMediaTime(mediaEl.duration);
}

function playNextMedia() {
    if (allMediaCourses.length === 0) return;
    mediaPlayer.currentIndex = (mediaPlayer.currentIndex + 1) % allMediaCourses.length;
    var course = allMediaCourses[mediaPlayer.currentIndex];
    if (course) playMediaCourse(course.id);
}

function playPrevMedia() {
    if (allMediaCourses.length === 0) return;
    mediaPlayer.currentIndex = (mediaPlayer.currentIndex - 1 + allMediaCourses.length) % allMediaCourses.length;
    var course = allMediaCourses[mediaPlayer.currentIndex];
    if (course) playMediaCourse(course.id);
}

function playNextTrack() { if (podcastCourses.length === 0) return; audioCtx.currentIndex = (audioCtx.currentIndex + 1) % podcastCourses.length; var course = podcastCourses[audioCtx.currentIndex]; if (course) playPodcastCourse(course.id); }

function playPrevTrack() { if (podcastCourses.length === 0) return; audioCtx.currentIndex = (audioCtx.currentIndex - 1 + podcastCourses.length) % podcastCourses.length; var course = podcastCourses[audioCtx.currentIndex]; if (course) playPodcastCourse(course.id); }

function playVideoFromList(id) {
    var course = videoCourses.find(function(v) { return v.id === id; });
    if (course) {
        // 使用增强版视频播放器，传入videoId用于记录观看进度
        openEnhancedVideoPlayer(course.title, course.url, course.id);
    }
}

function handleAudioUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
        showToast('请上传音频文件');
        return;
    }

    // 检查文件大小（限制50MB）
    if (file.size > 50 * 1024 * 1024) {
        showToast('音频文件不能超过50MB');
        return;
    }

    const user = getCurrentUserData();
    if (!user.localAudios) user.localAudios = [];

    // 创建音频URL
    const audioUrl = URL.createObjectURL(file);

    // 添加到用户数据
    const audioData = {
        id: 'local-audio-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: audioUrl,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toLocaleString(),
        duration: '未知'
    };

    user.localAudios.push(audioData);
    syncUserData(user);

    // 获取音频时长
    const tempAudio = new Audio();
    tempAudio.src = audioUrl;
    tempAudio.onloadedmetadata = function() {
        const mins = Math.floor(tempAudio.duration / 60);
        const secs = Math.floor(tempAudio.duration % 60);
        audioData.duration = mins + ':' + (secs < 10 ? '0' : '') + secs;
        syncUserData(user);
        renderLocalAudioList();
    };

    showToast('音频上传成功！');
    renderLocalAudioList();
}


function setVideoSourceFromUrl(videoEl, url) {
    var sourceEl = document.createElement('source');
    sourceEl.src = url;
    sourceEl.type = 'video/mp4';
    videoEl.appendChild(sourceEl);
    videoEl.src = url;
}

function cacheVideoFromUrl(url) {
    if (!url || url.indexOf('http') !== 0) return;
    fetch(url).then(function(r) {
        if (r.ok) return r.blob();
        throw new Error('fetch failed');
    }).then(function(blob) {
        cacheVideo(url, blob);
    }).catch(function() {});
}

// ========== 视频压缩功能 ==========
var VIDEO_COMPRESS_CONFIG = {
    maxSize: 854,        // 最大宽度(480p)
    videoBitrate: 800000, // 视频码率800kbps
    audioBitrate: 128000, // 音频码率128kbps
    minSize: 5 * 1024 * 1024, // 5MB以下不压缩
    timeout: 30000        // 30秒超时
};

function compressVideo(file, callback) {
    if (file.size < VIDEO_COMPRESS_CONFIG.minSize) {
        callback(file);
        return;
    }
    
    showToast('正在压缩视频，请稍候...');
    
    var compressDiv = document.createElement('div');
    compressDiv.id = 'compress-progress';
    compressDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:white;padding:24px 32px;border-radius:16px;z-index:9999;text-align:center;';
    compressDiv.innerHTML = '<div style="font-size:16px;margin-bottom:12px;">🎬 视频压缩中...</div><div style="background:#333;border-radius:8px;height:8px;width:200px;"><div id="compress-bar" style="background:#667eea;height:100%;border-radius:8px;width:0%;transition:width 0.3s;"></div></div><div id="compress-text" style="font-size:12px;color:#aaa;margin-top:8px;">0%</div>';
    document.body.appendChild(compressDiv);
    
    var video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    var url = URL.createObjectURL(file);
    video.src = url;
    
    var timeoutId = setTimeout(function() {
        cleanup();
        showToast('压缩超时，使用原视频');
        callback(file);
    }, VIDEO_COMPRESS_CONFIG.timeout);
    
    function cleanup() {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        var el = document.getElementById('compress-progress');
        if (el) el.remove();
    }
    
    video.onloadedmetadata = function() {
        var w = video.videoWidth;
        var h = video.videoHeight;
        var scale = 1;
        if (w > VIDEO_COMPRESS_CONFIG.maxSize) {
            scale = VIDEO_COMPRESS_CONFIG.maxSize / w;
        }
        var nw = Math.round(w * scale);
        var nh = Math.round(h * scale);
        
        var canvas = document.createElement('canvas');
        canvas.width = nw;
        canvas.height = nh;
        var ctx = canvas.getContext('2d');
        
        var mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8,opus';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
        }
        
        var recorder;
        try {
            recorder = new MediaRecorder(canvas.captureStream(30), {
                mimeType: mimeType,
                videoBitsPerSecond: VIDEO_COMPRESS_CONFIG.videoBitrate,
                audioBitsPerSecond: VIDEO_COMPRESS_CONFIG.audioBitrate
            });
        } catch(e) {
            cleanup();
            showToast('浏览器不支持压缩，使用原视频');
            callback(file);
            return;
        }
        
        var chunks = [];
        recorder.ondataavailable = function(e) {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        
        recorder.onstop = function() {
            var ext = mimeType.indexOf('mp4') > -1 ? 'video/mp4' : 'video/webm';
            var compressed = new Blob(chunks, { type: ext });
            
            var barEl = document.getElementById('compress-bar');
            var textEl = document.getElementById('compress-text');
            if (barEl) barEl.style.width = '100%';
            if (textEl) textEl.textContent = '完成！' + (file.size/1024/1024).toFixed(1) + 'MB → ' + (compressed.size/1024/1024).toFixed(1) + 'MB';
            
            setTimeout(function() {
                cleanup();
                if (compressed.size < file.size * 0.9) {
                    showToast('压缩完成：' + (file.size/1024/1024).toFixed(1) + 'MB → ' + (compressed.size/1024/1024).toFixed(1) + 'MB');
                    callback(compressed);
                } else {
                    showToast('压缩效果不明显，使用原视频');
                    callback(file);
                }
            }, 500);
        };
        
        recorder.start(1000);
        video.play();
        
        var startTime = Date.now();
        var duration = video.duration || 60;
        
        function drawFrame() {
            if (video.ended || video.paused) {
                recorder.stop();
                return;
            }
            ctx.drawImage(video, 0, 0, nw, nh);
            
            var progress = Math.min(((Date.now() - startTime) / (duration * 1000)) * 100, 95);
            var barEl = document.getElementById('compress-bar');
            var textEl = document.getElementById('compress-text');
            if (barEl) barEl.style.width = progress + '%';
            if (textEl) textEl.textContent = Math.round(progress) + '%';
            
            requestAnimationFrame(drawFrame);
        }
        
        video.onplay = function() {
            drawFrame();
        };
        
        video.onended = function() {
            if (recorder.state === 'recording') {
                recorder.stop();
            }
        };
    };
    
    video.onerror = function() {
        cleanup();
        showToast('视频读取失败，使用原文件');
        callback(file);
    };
}

// ========== 视频缓存功能（Cache API）==========
var VIDEO_CACHE_NAME = 'video-cache-v1';

function cacheVideo(url, blob) {
    if (!('caches' in window)) return Promise.resolve();
    return caches.open(VIDEO_CACHE_NAME).then(function(cache) {
        var response = new Response(blob, { headers: { 'Content-Type': blob.type || 'video/mp4' } });
        return cache.put(url, response);
    }).catch(function(e) {
        console.warn('视频缓存失败:', e);
    });
}

function getCachedVideo(url) {
    if (!('caches' in window)) return Promise.resolve(null);
    return caches.open(VIDEO_CACHE_NAME).then(function(cache) {
        return cache.match(url);
    }).then(function(response) {
        if (response) return response.blob();
        return null;
    }).catch(function() {
        return null;
    });
}

function handleVideoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('video/')) {
        showToast('请上传视频文件');
        return;
    }
    
    // 检查文件大小（限制100MB）
    if (file.size > 100 * 1024 * 1024) {
        showToast('视频文件不能超过100MB');
        return;
    }
    
    const user = getCurrentUserData();
    if (!user.localVideos) user.localVideos = [];
    
    // 生成视频ID（不存储 blob URL）
    const videoId = 'local-video-' + Date.now();
    
    // 添加到用户数据（只存元信息，不存url）
    const videoData = {
        id: videoId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        size: file.size,
        type: file.type,
        uploadTime: new Date().toLocaleString(),
        duration: '未知'
    };
    
    user.localVideos.push(videoData);
    syncUserData(user);
    
    // 获取视频时长（使用临时URL）
    const tempVideo = document.createElement('video');
    const tempUrl = URL.createObjectURL(file);
    tempVideo.src = tempUrl;
    tempVideo.onloadedmetadata = function() {
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        videoData.duration = mins + ':' + (secs < 10 ? '0' : '') + secs;
        syncUserData(user);
        renderLocalVideoList();
        // 释放临时URL
        URL.revokeObjectURL(tempUrl);
    };
    tempVideo.onerror = function() {
        URL.revokeObjectURL(tempUrl);
    };
    
    // 压缩后存储
    compressVideo(file, function(processedFile) {
        videoData.size = processedFile.size;
        videoData.type = processedFile.type || file.type;
        syncUserData(user);
        renderLocalVideoList();
        
        saveVideoFile(videoId, processedFile).then(function() {
            console.log('视频文件已持久化存储:', videoId, '大小:', (processedFile.size/1024/1024).toFixed(1) + 'MB');
        }).catch(function(e) {
            console.error('视频持久化存储失败:', e);
            showToast('视频存储可能不稳定，请刷新重试');
        });
    });
    
    showToast('视频上传成功！' + (file.size > 5*1024*1024 ? ' 大视频将自动压缩' : ''));
    renderLocalVideoList();
}

function deleteLocalAudio(audioId) {
    if (!confirm('确定要删除这个音频吗？')) return;

    const user = getCurrentUserData();
    if (!user.localAudios) return;

    user.localAudios = user.localAudios.filter(a => a.id !== audioId);
    syncUserData(user);
    renderLocalAudioList();
    showToast('音频已删除');
}

function deleteLocalVideo(videoId) {
    if (!confirm('确定删除这个视频吗？')) return;
    
    const user = getCurrentUserData();
    user.localVideos = user.localVideos.filter(v => v.id !== videoId);
    syncUserData(user);
    
    // 同时从 IndexedDB 删除视频文件
    deleteVideoFile(videoId).then(function() {
        console.log('视频已从存储中删除:', videoId);
    }).catch(function(e) {
        console.error('删除视频文件失败:', e);
    });
    
    renderLocalVideoList();
    showToast('视频已删除');
}

function initMediaCourses() {
    allMediaCourses = [];
    podcastCourses.forEach(function(course) {
        allMediaCourses.push({
            id: course.id,
            title: course.title,
            teacher: course.teacher,
            duration: course.duration,
            category: course.category,
            gradient: course.gradient,
            icon: course.icon,
            url: course.url,
            type: 'audio'
        });
    });
    videoCourses.forEach(function(course) {
        allMediaCourses.push({
            id: course.id,
            title: course.title,
            teacher: course.teacher,
            duration: course.duration,
            category: course.category,
            gradient: course.gradient,
            icon: course.icon,
            url: course.url,
            type: 'video'
        });
    });
}

function filterVideoCourse(category, btn) {
    document.querySelectorAll('.subject-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    
    var videos = videoCourses.filter(function(v) { return category === 'all' || v.category === category; });
    var videoHtml = videos.map(function(v) {
        return '<div class="video-item" onclick="playVideoFromList(\'' + v.id + '\')">' +
               '<div class="video-thumb"><span class="play-icon">▶</span></div>' +
               '<div class="video-info"><div class="video-title">' + v.title + '</div>' +
               '<div class="video-meta">' + v.teacher + ' · ' + v.duration + '</div>' +
               '<div class="media-views">👁 ' + (v.views ? (v.views/1000).toFixed(1) + '万' : '0') + '</div></div></div>';
    }).join('');
    
    document.getElementById('video-list').innerHTML = videoHtml;
}

function updateMediaListState(courseId) {
    document.querySelectorAll('.media-item').forEach(function(item) {
        var id = item.getAttribute('data-id');
        if (id === courseId) {
            item.classList.add('playing');
            var indicator = item.querySelector('.media-playing-indicator');
            if (indicator) indicator.style.display = 'flex';
        } else {
            item.classList.remove('playing');
            var indicator = item.querySelector('.media-playing-indicator');
            if (indicator) indicator.style.display = 'none';
        }
    });
}

function updateVideoListState(courseId) { document.querySelectorAll('.video-item-enhanced').forEach(function(item) { var id = item.getAttribute('data-id'); item.classList.toggle('playing', id === courseId); }); }

function updatePodcastListState(courseId) { document.querySelectorAll('.podcast-item-enhanced').forEach(function(item) { var id = item.getAttribute('data-id'); if (id === courseId) { item.classList.add('playing'); var indicator = item.querySelector('.podcast-playing-indicator'); if (indicator) indicator.style.display = 'flex'; } else { item.classList.remove('playing'); var indicator = item.querySelector('.podcast-playing-indicator'); if (indicator) indicator.style.display = 'none'; } }); }

function updatePlayButtons() { var icon = audioCtx.isPlaying ? '⏸' : '▶'; var apPlayBtn = document.getElementById('ap-play-btn'); var miniBtn = document.getElementById('mini-player-btn'); if (apPlayBtn) apPlayBtn.innerHTML = icon; if (miniBtn) miniBtn.innerHTML = icon; }

function updateEnhancedPlayButtons() { var icon = videoCtx.isPlaying ? '⏸' : '▶'; var playBtnEl = document.getElementById('evp-play-btn'); var bigPlayEl = document.getElementById('evp-big-play'); if (playBtnEl) playBtnEl.innerHTML = icon; if (bigPlayEl) bigPlayEl.innerHTML = icon; }

function getCurrentMediaElement() {
    if (mediaPlayer.isAudio) return document.getElementById('mp-audio-element');
    return document.getElementById('mp-video-element');
}

function formatMediaTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function startAudioPosition() {
    document.getElementById('game-title').textContent = '🎧 听音辨位';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const lengths = [3, 4, 5, 6, 7];
    const seqLength = lengths[Math.min(gameLevel - 1, 4)];
    audioSequence = [];
    for (let i = 0; i < seqLength; i++) audioSequence.push(Math.floor(Math.random() * 3));
    audioIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">仔细听，按顺序点击播放顺序：</div><div id="audio-sequence-display" style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;">' + audioSequence.map((_, i) => '<div id="audio-seq-' + i + '" style="width:36px;height:36px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;">' + (i + 1) + '</div>').join('') + '</div><div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;"><button onclick="playAudioPos(0)" style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👈 左</button><button onclick="playAudioPos(1)" style="width:80px;height:80px;background:linear-gradient(135deg,#4ECDC4,#38F9D7);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👆 中</button><button onclick="playAudioPos(2)" style="width:80px;height:80px;background:linear-gradient(135deg,#FF6B6B,#FF4757);border:none;border-radius:16px;color:white;font-size:14px;cursor:pointer;">👉 右</button></div><button onclick="startAudioSeq()" style="margin-top:16px;padding:12px 24px;background:#43E97B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">开始播放序列</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function toggleVpPlay() { if (!vpVideo) return; vpPlaying ? vpVideo.pause() : vpVideo.play(); }

function updateEnhancedVolumeIcon(value) { var icon = value == 0 ? '🔇' : (value < 50 ? '🔉' : '🔊'); var btnEl = document.getElementById('evp-volume-btn'); if (btnEl) btnEl.innerHTML = icon; }

function updateVolumeIcon() {
    var icon = mediaPlayer.volume == 0 ? '🔇' : (mediaPlayer.volume < 50 ? '🔉' : '🔊');
    var btnEl = document.getElementById('mp-volume-btn');
    if (btnEl) btnEl.innerHTML = icon;
}

function closeVideoPlayer() { if (vpVideo) { vpVideo.pause(); vpVideo.src = ''; } document.getElementById('video-player-modal').classList.remove('show'); }

function updateMediaPlayButtons() {
    var icon = mediaPlayer.isPlaying ? '⏸' : '▶';
    var apPlayBtn = document.getElementById('mp-play-btn');
    if (apPlayBtn) apPlayBtn.innerHTML = icon;
}


// ============================================================
// Games - 游戏模块
// ============================================================
window.playAudioPos = playAudioPos;
window.startAudioSeq = startAudioSeq;
// ========== 视频观看记录功能 ==========
function getVideoWatchRecord(videoId) {
    try {
        const user = getCurrentUserData();
        if (!user || !user.videoWatchRecords) return null;
        return user.videoWatchRecords[videoId] || null;
    } catch (e) {
        return null;
    }
}

function saveVideoWatchRecord(videoId, progress, duration) {
    try {
        const user = getCurrentUserData();
        if (!user) return;
        if (!user.videoWatchRecords) user.videoWatchRecords = {};
        user.videoWatchRecords[videoId] = {
            progress: Math.min(progress, 100),
            duration: duration,
            timestamp: Date.now()
        };
        saveCurrentUserData(user);
    } catch (e) {}
}

function updateVideoProgress() {
    try {
        const videoEl = document.getElementById('evp-video');
        if (!videoEl || !videoEl.dataset.videoId) return;
        const videoId = videoEl.dataset.videoId;
        const progress = videoEl.duration > 0 ? (videoEl.currentTime / videoEl.duration) * 100 : 0;
        saveVideoWatchRecord(videoId, progress, videoEl.duration);
    } catch (e) {}
}

// ========== 本地视频相关函数导出 ==========
window.playLocalVideo = playLocalVideo;
window.handleVideoUpload = handleVideoUpload;
window.compressVideo = compressVideo;
window.cacheVideo = cacheVideo;
window.getCachedVideo = getCachedVideo;
window.deleteLocalVideo = deleteLocalVideo;


// ===== js/modules/games.js =====
// 版本: V144

// 安全声明 - 防止游戏加载时序问题
var playSound = playSound || function() {};
var gameTimerDisplay = gameTimerDisplay || null;
var gameTimer = gameTimer || null;
var snakeGame = typeof snakeGame !== 'undefined' ? snakeGame : null;
var tetrisGame = typeof tetrisGame !== 'undefined' ? tetrisGame : null;
var whackTimer = typeof whackTimer !== 'undefined' ? whackTimer : null;
var gameType = "";
var gameScore = 0;
var gameLevel = 1;
var gameStartTime = 0;
var elimTimer = typeof elimTimer !== 'undefined' ? elimTimer : null;
var elimColors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFD93D','#DDA0DD'];


// startGame moved to end of file (with metacognitive prediction)

function startSchulte() {
    const config = gameConfig['schulte'];
    document.getElementById('game-title').textContent = config?.name || '🎯 舒尔特方格';
    const sizes = [3,4,5,6];
    const size = sizes[Math.min(gameLevel-1,3)];
    const nums = Array.from({length:size*size},(_,i)=>i+1).sort(()=>Math.random()-0.5);
    const board = document.getElementById('game-board');
    board.className = 'game-board size-'+size; 
    board.style.display = 'grid';
    board.innerHTML = nums.map(n => `<div class="game-cell" onclick="checkSchulte(this,${n})" style="background:white;font-size:${28-size*2}px;font-weight:bold;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">${n}</div>`).join('');
    schulteNext = 1; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => { 
        if (Date.now()-gameStartTime > 20000) { 
            clearInterval(gameTimer); 
            endGame(); 
        } 
    }, 1000);
}

function startWhack() {
    document.getElementById('game-title').textContent = '🔨 打地鼠';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div style="text-align:center;margin-bottom:16px;"><span id="whack-timer" style="font-size:24px;font-weight:bold;color:#8E24AA;">30</span>秒</div><div id="whack-container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px;max-width:320px;margin:0 auto;"></div>';
    
    whackMoles = Array(9).fill(0);
    whackTimeLeft = 30;
    whackActive = 0;
    
    const container = document.getElementById('whack-container');
    for(let i=0;i<9;i++) {
        const hole = document.createElement('div');
        hole.style.cssText = 'width:80px;height:80px;background:#8B4513;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;';
        hole.innerHTML = '<div id="whack-'+i+'" style="position:absolute;bottom:-50px;width:50px;height:50px;background:#D2691E;border-radius:50%;transition:bottom 0.15s;font-size:32px;text-align:center;line-height:50px;">🐹</div>';
        hole.onclick = () => whackMole(i);
        container.appendChild(hole);
    }
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
    
    if(whackTimer) clearInterval(whackTimer);
    whackTimer = setInterval(()=>{
        whackTimeLeft--;
        document.getElementById('whack-timer').textContent = whackTimeLeft;
        
        if(whackTimeLeft<=0) {
            clearInterval(whackTimer);
            whackTimer = null;
            endGame();
        } else {
            showMole();
        }
    },1000);
}

function startSnake() {
    document.getElementById('game-title').textContent = '🐍 贪吃蛇';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="snake-container" style="display:flex;justify-content:center;align-items:center;height:100%;"><canvas id="snake-canvas" style="border:3px solid #43A047;border-radius:8px;"></canvas></div>';
    
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    const gridSize = 15;
    const gridCount = size / gridSize;
    
    let snake = [{x:5,y:5}];
    let direction = {x:1,y:0};
    let nextDirection = {x:1,y:0};
    let food = {x:10,y:10};
    let score = 0;
    let gameOver = false;
    let speed = 150;
    
    function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }
    
    function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }
    
    function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }
    
    placeFood();
    draw();
    
    if(snakeGame) clearInterval(snakeGame);
    snakeGame = setInterval(update,speed);
    
    // 触屏控制
    let touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>Math.abs(dy)) {
            if(dx>20&&direction.x!==-1) nextDirection={x:1,y:0};
            else if(dx<-20&&direction.x!==1) nextDirection={x:-1,y:0};
        } else {
            if(dy>20&&direction.y!==-1) nextDirection={x:0,y:1};
            else if(dy<-20&&direction.y!==1) nextDirection={x:0,y:-1};
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp'&&direction.y!==1) nextDirection={x:0,y:-1};
        else if(e.key==='ArrowDown'&&direction.y!==-1) nextDirection={x:0,y:1};
        else if(e.key==='ArrowLeft'&&direction.x!==1) nextDirection={x:-1,y:0};
        else if(e.key==='ArrowRight'&&direction.x!==-1) nextDirection={x:1,y:0};
    });
    
    score = 0;
}

function startTetris() {
    document.getElementById('game-title').textContent = '🧱 俄罗斯方块';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="tetris-container" style="display:flex;justify-content:center;align-items:center;height:100%;gap:20px;"><canvas id="tetris-canvas" style="border:3px solid #E53935;border-radius:8px;"></canvas><div id="tetris-next" style="padding:10px;background:#fff;border-radius:8px;"><div style="font-size:12px;color:#666;margin-bottom:8px;">下一个</div><canvas id="tetris-next-canvas" width="80" height="80"></canvas></div></div>';
    
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('tetris-next-canvas');
    const nextCtx = nextCanvas.getContext('2d');
    
    const cols = 10, rows = 16, cellSize = 20;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cols * cellSize * dpr;
    canvas.height = rows * cellSize * dpr;
    canvas.style.width = (cols * cellSize) + 'px';
    canvas.style.height = (rows * cellSize) + 'px';
    ctx.scale(dpr, dpr);
    
    const pieces = [
        {shape:[[1,1,1,1]],color:'#3498db'},
        {shape:[[1,1],[1,1]],color:'#f1c40f'},
        {shape:[[0,1,0],[1,1,1]],color:'#9b59b6'},
        {shape:[[1,0,0],[1,1,1]],color:'#e67e22'},
        {shape:[[0,0,1],[1,1,1]],color:'#1abc9c'},
        {shape:[[1,1,0],[0,1,1]],color:'#e74c3c'},
        {shape:[[0,1,1],[1,1,0]],color:'#2ecc71'}
    ];
    
    let board2d = Array.from({length:rows},()=>Array(cols).fill(0));
    let current = null, nextPiece = null;
    let x = 0, y = 0;
    let score = 0, lines = 0;
    let gameOver = false;
    let speed = 500;
    let lastDrop = Date.now();
    
    function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }
    
    function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }
    
    function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }
    
    function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }
    
    function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }
    
    function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }
    
    function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }
    
    function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }
    
    function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }
    
    current = randomPiece();
    nextPiece = randomPiece();
    x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
    y = 0;
    drawNext();
    
    if(tetrisGame) clearInterval(tetrisGame);
    tetrisGame = setInterval(tick,speed);
    
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(dy<-30) { // 上滑旋转
                const rotated = rotate(current.shape);
                if(canMove(rotated,x,y)) current.shape = rotated;
            } else if(dy>30) { // 下滑加速
                while(canMove(current.shape,x,y+1)) y++;
            } else if(dx>30) {
                if(canMove(current.shape,x+1,y)) x++;
            } else if(dx<-30) {
                if(canMove(current.shape,x-1,y)) x--;
            }
        }
    });
    
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'&&canMove(current.shape,x-1,y)) x--;
        else if(e.key==='ArrowRight'&&canMove(current.shape,x+1,y)) x++;
        else if(e.key==='ArrowDown'&&canMove(current.shape,x,y+1)) y++;
        else if(e.key==='ArrowUp') {
            const rotated = rotate(current.shape);
            if(canMove(rotated,x,y)) current.shape = rotated;
        }
    });
    
    score = 0; lines = 0;
}

function startColor() {
    const config = gameConfig['color'];
    document.getElementById('game-title').textContent = config?.name || '🌈 颜色识别';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;gap:16px;';
    const colorWords = [
        {w:'红',c:'#FF6B6B'},
        {w:'蓝',c:'#3377FF'},
        {w:'绿',c:'#43E97B'},
        {w:'黄',c:'#FFD93D'},
        {w:'紫',c:'#9B59B6'}
    ];
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 20000) { clearInterval(gameTimer); endGame(); return; }
        const word = colorWords[Math.floor(Math.random()*5)];
        const wrongColor = colorWords.filter(c=>c.c!==word.c)[Math.floor(Math.random()*4)];
        board.innerHTML = `
            <div id="color-word" style="font-size:48px;font-weight:bold;padding:20px;color:${wrongColor.c}">${word.w}</div>
            <div style="display:flex;gap:12px;margin-top:10px;">
                <button onclick="gameScore++;document.getElementById('game-score').textContent=gameScore;SoundEffects.playCorrect();" style="padding:12px 24px;background:#43E97B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✓ 正确</button>
                <button onclick="SoundEffects.playWrong();" style="padding:12px 24px;background:#FF6B6B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✗ 错误</button>
            </div>
        `;
    }, 2500);
}

function startAttentionTrack() {
    document.getElementById('game-title').textContent = '🎯 注意力追踪';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const counts = [6, 9, 12, 16, 20];
    const numCount = counts[Math.min(gameLevel - 1, 4)];
    const gridSize = Math.ceil(Math.sqrt(numCount));
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B', '#FF9A9E'];
    attentionSequence = [];
    for (let i = 0; i < numCount; i++) attentionSequence.push({ color: colors[i % colors.length], number: i + 1 });
    attentionSequence = attentionSequence.sort(() => Math.random() - 0.5);
    attentionIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">记住数字顺序，然后按顺序点击：</div><div id="attention-grid" style="display:grid;grid-template-columns:repeat(' + gridSize + ',1fr);gap:8px;margin-bottom:16px;">' + attentionSequence.map((item, i) => '<div id="att-item-' + i + '" style="aspect-ratio:1;background:' + item.color + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;color:white;opacity:0;transition:opacity 0.3s;cursor:pointer;" onclick="clickAttention(' + i + ')"></div>').join('') + '</div><button onclick="startAttentionSeq()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">开始记忆</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startAttentionSeq() {
    const sequence = attentionSequence.map((_, i) => i);
    let i = 0;
    const interval = setInterval(() => {
        if (i > 0) {
            const prevEl = document.getElementById('att-item-' + sequence[i-1]);
            if (prevEl) prevEl.textContent = '';
        }
        if (i < sequence.length) {
            const el = document.getElementById('att-item-' + sequence[i]);
            if (el) { el.textContent = attentionSequence[sequence[i]].number; el.style.opacity = '1'; }
            playAudioTone3(400 + i * 50);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                attentionSequence.forEach((_, idx) => {
                    const el = document.getElementById('att-item-' + idx);
                    if (el) { el.textContent = ''; el.style.opacity = '1'; }
                });
                attentionIndex = 0;
            }, 500);
        }
    }, 600);
}

function startFlipCard() {
    document.getElementById('game-title').textContent = '🃏 记忆翻牌';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="flip-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;"></div>';
    
    const icons = ['🍎','🍌','🍇','🍓','🌟','🌙','🔥','💎'];
    flipCards = [...icons,...icons].sort(()=>Math.random()-0.5);
    flipped = []; matched = 0; flips = 0;
    
    const container = document.getElementById('flip-container');
    flipCards.forEach((icon,i) => {
        const card = document.createElement('div');
        card.id = 'flip-'+i;
        card.style.cssText = 'width:70px;height:70px;background:linear-gradient(135deg,#1E88E5,#42A5F5);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;transition:transform 0.3s;transform-style:preserve-3d;';
        card.innerHTML = '<span style="opacity:0.3;">❓</span>';
        card.onclick = () => flipCard(i, card);
        container.appendChild(card);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startVisualTracking() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>👁️ 视觉追踪训练</h3>
            <p>请用眼睛追踪移动的目标，保持注意力集中</p>
            <div class="game-area" id="visual-game-area" style="position:relative;width:100%;height:300px;background:#f5f5f5;border-radius:12px;overflow:hidden;">
                <div id="tracking-target" style="position:absolute;width:40px;height:40px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);"></div>
            </div>
            <div class="game-stats">
                <div>用时: <span id="visual-time">0</span>秒</div>
                <div>追踪次数: <span id="visual-count">0</span></div>
            </div>
            <button class="btn-primary" onclick="startVisualTracking()">开始训练</button>
        </div>
    `;
    
    let count = 0;
    let startTime = Date.now();
    const target = document.getElementById('tracking-target');
    const area = document.getElementById('visual-game-area');
    
    target.onmouseenter = function() {
        count++;
        document.getElementById('visual-count').textContent = count;
    };
    
    function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }
    
    moveTarget();
    const interval = setInterval(moveTarget, 1500);
    setTimeout(() => {
        clearInterval(interval);
        const time = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('visual-time').textContent = time;
        alert(`训练完成！追踪了 ${count} 次，用时 ${time} 秒`);
    }, 30000);
}

function startSpatialMemory() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🧠 空间记忆挑战</h3>
            <p>记住方块的位置，然后按顺序点击它们</p>
            <div class="game-area" id="spatial-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:320px;margin:0 auto;"></div>
            <div id="spatial-status" style="text-align:center;margin:15px;">关卡: <span id="spatial-level">1</span></div>
            <div class="game-stats">
                <div>正确: <span id="spatial-correct">0</span></div>
                <div>序列: <span id="spatial-sequence">0</span></div>
            </div>
        </div>
    `;
    
    let level = 1;
    let sequence = [];
    let playerSequence = [];
    let showing = false;
    
    function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }
    
    function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }
    
    function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }
    
    function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }
    
    initGrid();
    showLevel();
}

function startDigit() {
    const config = gameConfig['digit'];
    document.getElementById('game-title').textContent = config?.name || '🔢 数字记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;';
    const count = 3 + gameLevel;
    const digits = Array.from({length:count},()=>Math.floor(Math.random()*10)).join('');
    board.innerHTML = `<div style="font-size:48px;font-weight:bold;color:#1A6BFF;letter-spacing:8px;">${digits}</div><div style="margin-top:20px;font-size:14px;color:#666;">记住这些数字！</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        board.innerHTML = `<div style="font-size:18px;color:#666;margin-bottom:12px;">请输入你看到的数字：</div><input type="text" id="digit-input" style="width:200px;text-align:center;font-size:24px;padding:12px;border:2px solid #1A6BFF;border-radius:12px;" maxlength="${count}"/><button onclick="checkDigit('${digits}')" style="margin-top:16px;padding:12px 24px;background:#1A6BFF;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">确认</button>`;
    }, 1500+count*200);
}

function startPattern() {
    const config = gameConfig['pattern'];
    document.getElementById('game-title').textContent = config?.name || '🎨 图形记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const emojis = ['🍎','🍊','🍋','🍇','🌸','🌺','⭐','🌙','🔥','💎','🎁','🎈'];
    const count = 4 + gameLevel;
    const selected = emojis.slice(0,count);
    board.innerHTML = selected.map(e => `<div class="game-cell" style="background:#f0f7ff;font-size:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${e}</div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        const shuffled = [...emojis,'🍀','🌈'].slice(0,12).sort(()=>Math.random()-0.5);
        patternCorrect = [...selected]; patternFound = [];
        board.innerHTML = shuffled.map(e => `<div class="game-cell" onclick="checkPattern(this,'${e}')" style="background:white;font-size:24px;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">?</div>`).join('');
    }, 2000+count*300);
}

function startMathCalc() {
    document.getElementById('game-title').textContent = '🔢 数学速算';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const difficulties = [{ ops: ['+', '-'], max: 20 }, { ops: ['+', '-'], max: 50 }, { ops: ['+', '-', '×'], max: 12 }, { ops: ['+', '-', '×'], max: 20 }, { ops: ['+', '-', '×', '÷'], max: 20 }];
    const diff = difficulties[Math.min(gameLevel - 1, 4)];
    const op = diff.ops[Math.floor(Math.random() * diff.ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * diff.max) + 1; b = Math.floor(Math.random() * diff.max) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * diff.max) + 5; b = Math.floor(Math.random() * Math.min(a, diff.max)) + 1; answer = a - b; }
    else if (op === '×') { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
    else { b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 1; a = b * answer; }
    mathCorrectAnswer = answer;
    const options = [answer];
    while (options.length < 4) { const wrong = answer + Math.floor(Math.random() * 11) - 5; if (wrong > 0 && wrong !== answer && !options.includes(wrong)) options.push(wrong); }
    options.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:16px;color:#666;margin-bottom:20px;">请快速计算：</div><div style="font-size:36px;font-weight:bold;text-align:center;margin-bottom:24px;color:#333;">' + a + ' ' + op + ' ' + b + ' = ?</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + options.map(o => '<button onclick="checkMathAnswer(' + o + ')" style="padding:20px;font-size:24px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-weight:bold;" id="math-opt-' + o + '">' + o + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startLinkUp() {
    document.getElementById('game-title').textContent = '🔗 连连看';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="link-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:10px;max-width:340px;margin:0 auto;"></div>';
    
    const emojis = ['🍎','🍊','🍋','🍇','🍓','🍒','🥝','🌟','❤️','🔵','💜','💚'];
    linkIcons = emojis.slice(0,18);
    linkBoard = [...linkIcons,...linkIcons].sort(()=>Math.random()-0.5);
    linkSelected = [];
    linkPairs = 0;
    
    const container = document.getElementById('link-container');
    linkBoard.forEach((icon,i)=>{
        const cell = document.createElement('div');
        cell.id = 'link-'+i;
        cell.style.cssText = 'width:50px;height:50px;background:#00897B;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;';
        cell.textContent = icon;
        cell.onclick = () => clickLink(i);
        container.appendChild(cell);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startSlide() {
    document.getElementById('game-title').textContent = '🔢 数字华容道';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="slide-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;max-width:300px;margin:0 auto;"></div><div style="text-align:center;margin-top:16px;"><button onclick="shuffleSlide()" style="padding:10px 24px;background:#FB8C00;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    slideBoard = [];
    for(let i=1;i<16;i++) slideBoard.push(i);
    slideBoard.push(0);
    slideEmpty = {x:3,y:3};
    slideMoves = 0;
    shuffleSlide();
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startTap() {
    const config = gameConfig['tap'];
    document.getElementById('game-title').textContent = config?.name || '⚡ 快速点击';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-3'; 
    board.style.cssText = 'display:grid;position:relative;min-height:200px;';
    board.innerHTML = Array(9).fill('<div class="game-cell" style="position:relative;border-radius:8px;"></div>').join('');
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 10000) { clearInterval(gameTimer); endGame(); return; }
        board.querySelectorAll('.game-cell').forEach(c => c.innerHTML = '');
        const targetCell = board.querySelectorAll('.game-cell')[Math.floor(Math.random()*9)];
        targetCell.innerHTML = '<div onclick="event.stopPropagation();tapTarget(this)" style="width:100%;height:100%;background:#1A6BFF;border-radius:8px;cursor:pointer;"></div>';
    }, 800);
}

function startTextMemory() {
    document.getElementById('game-title').textContent = '📝 文字记忆';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const wordCounts = [4, 5, 6, 7, 8];
    const count = wordCounts[Math.min(gameLevel - 1, 4)];
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    textMemoryWords = allWords.sort(() => Math.random() - 0.5).slice(0, count);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请记住以下词语：</div><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + textMemoryWords.map(w => '<span style="background:#667eea;color:white;padding:8px 14px;border-radius:8px;font-size:14px;">' + w + '</span>').join('') + '</div><button onclick="textMemoryStartTest()" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">我记住了，开始测试</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startAuditoryTraining() {
    const container = document.getElementById('fullscreen-content');
    const sounds = [
        { freq: 440, name: '标准音A' },
        { freq: 523, name: '高音C' },
        { freq: 659, name: '高音E' },
        { freq: 880, name: '高音A' }
    ];
    
    container.innerHTML = `
        <div class="game-container">
            <h3>🎵 听觉分辨训练</h3>
            <p>仔细聆听音调，点击正确的音符</p>
            <div class="game-area" style="display:flex;justify-content:center;gap:15px;flex-wrap:wrap;padding:20px;">
                ${sounds.map((s, i) => `
                    <button class="sound-btn" onclick="playSound(${s.freq}, ${i})" id="sound-${i}">
                        ${s.name}
                    </button>
                `).join('')}
            </div>
            <div id="auditory-feedback" style="text-align:center;font-size:18px;margin:20px;">点击上方按钮听音调</div>
            <div class="game-stats">
                <div>得分: <span id="auditory-score">0</span></div>
                <div>回合: <span id="auditory-round">0</span>/5</div>
            </div>
        </div>
    `;
    
    let currentTarget = 0;
    let score = 0;
    let round = 0;
    
    function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }
    
    window.playSound = function(freq, btnIndex) {
        // 使用Web Audio API播放音效
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            
            // btnIndex === -1 只播放不检查，btnIndex >= 0 需要检查答案
            if (btnIndex >= 0) {
                if (btnIndex === currentTarget) {
                    score++;
                    document.getElementById('auditory-score').textContent = score;
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#43e97b;">✅ 正确！</span>`;
                } else {
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#fa709a;">❌ 错误，正确答案是: ${sounds[currentTarget].name}</span>`;
                }
                setTimeout(newRound, 1500);
            }
        } catch(e) {
            document.getElementById('auditory-feedback').textContent = '浏览器不支持音频功能';
        }
    };
    
    newRound();
}

function startFocusChallenge() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🎯 专注力挑战</h3>
            <p>在限定时间内，点击所有蓝色方块，避免红色方块</p>
            <div class="game-area" id="focus-game-area" style="position:relative;width:100%;height:350px;background:#1a1a2e;border-radius:12px;overflow:hidden;"></div>
            <div class="game-stats">
                <div>得分: <span id="focus-score">0</span></div>
                <div>时间: <span id="focus-time">30</span>秒</div>
                <div>正确率: <span id="focus-accuracy">100</span>%</div>
            </div>
        </div>
    `;
    
    let score = 0;
    let wrongClicks = 0;
    let timeLeft = 30;
    const gameArea = document.getElementById('focus-game-area');
    
    function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }
    
    function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }
    
    const spawnInterval = setInterval(spawnTarget, 500);
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('focus-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(spawnInterval);
            clearInterval(timer);
            alert(`🎉 挑战结束！得分: ${score}，正确率: ${document.getElementById('focus-accuracy').textContent}%`);
        }
    }, 1000);
}

function startWordAssociation() {
    document.getElementById('game-title').textContent = '💬 词汇联想';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const categories = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const target = cat.words[Math.floor(Math.random() * cat.words.length)];
    const correct = cat.words.filter(w => w !== target);
    const otherWords = categories.filter(c => c.name !== cat.name).flatMap(c => c.words).sort(() => Math.random() - 0.5).slice(0, 3);
    const wordOptions = [...correct.slice(0, 3), ...otherWords].sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">哪个词与"' + target + '"属于同一类别？</div><div style="font-size:20px;font-weight:bold;text-align:center;margin-bottom:20px;color:#667eea;">' + target + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + wordOptions.map((w, i) => '<button onclick="checkWordAssoc(\'' + w + '\', \'' + cat.name + '\')" style="padding:16px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-size:14px;font-weight:500;">' + w + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startClassification() {
    document.getElementById('game-title').textContent = '📂 分类归纳';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const sets = [
        { cat1: '学习用品', cat2: '生活用品', items1: ['铅笔', '橡皮', '尺子'], items2: ['毛巾', '牙刷', '杯子'] },
        { cat1: '水果', cat2: '蔬菜', items1: ['苹果', '香蕉', '橙子'], items2: ['白菜', '萝卜', '黄瓜'] },
        { cat1: '交通工具', cat2: '学习用品', items1: ['汽车', '火车', '飞机'], items2: ['课本', '作业', '文具盒'] }
    ];
    classifySet = sets[Math.floor(Math.random() * sets.length)];
    const items = [...classifySet.items1, ...classifySet.items2].sort(() => Math.random() - 0.5);
    classifyBox0 = [];
    classifyBox1 = [];
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请将物品分成两类：</div><div id="classify-items" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + items.map((item, i) => '<div onclick="classifyItem(this, \'' + item + '\')" style="padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;">' + item + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px;"><div style="padding:12px;background:rgba(102,126,234,0.1);border-radius:12px;text-align:center;border:2px dashed #667eea;"><div style="font-size:12px;color:#667eea;margin-bottom:8px;">第一类</div><div id="classify-box-0" style="min-height:60px;"></div></div><div style="padding:12px;background:rgba(255,107,107,0.1);border-radius:12px;text-align:center;border:2px dashed #FF6B6B;"><div style="font-size:12px;color:#FF6B6B;margin-bottom:8px;">第二类</div><div id="classify-box-1" style="min-height:60px;"></div></div></div><button onclick="checkClassification()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">确认分类</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startDiff() {
    const config = gameConfig['diff'];
    document.getElementById('game-title').textContent = config?.name || '🔍 找不同';
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;';
    const symbols = ['🌟','⭐','🌙','☀️','🔴','🔵'];
    const left = [...symbols]; 
    const right = [...symbols];
    const diffIdx = Math.floor(Math.random()*6);
    right[diffIdx] = ['🟢','🟡','⬜','⬛'][Math.floor(Math.random()*4)];
    board.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${left.map(s=>`<div style="text-align:center;font-size:24px;">${s}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${right.map((s,i)=>`<div style="text-align:center;font-size:24px;cursor:pointer;padding:4px;border-radius:4px;" onclick="checkDiff(this,${i},${diffIdx})">${s}</div>`).join('')}
        </div>
    `;
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0/1';
}

function startReason() {
    const config = gameConfig['reason'];
    document.getElementById('game-title').textContent = config?.name || '🧩 图形推理';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:250px;gap:16px;';
    const patterns = [
        {seq:['○','○○','○○○'],a:0,opt:['○○○○','○○○','○○○○○']},
        {seq:['△','△△','△△△'],a:1,opt:['△△','△△△','△△△△']},
        {seq:['□','□□','□□□'],a:2,opt:['□□','□□□','□□□□']}
    ];
    const p = patterns[Math.min(gameLevel-1,2)];
    board.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:12px;">${p.seq.map(s=>`<div style="padding:8px 12px;background:#f0f7ff;border-radius:8px;font-size:20px;">${s}</div>`).join('')}<div style="padding:8px 12px;background:#ddd;border-radius:8px;font-size:20px;">？</div></div><div style="display:flex;gap:12px;">${p.opt.map((o,i)=>`<button onclick="checkReason(${i},${p.a})" style="padding:10px 16px;font-size:16px;border:none;border-radius:8px;cursor:pointer;background:${i===0?'#3377FF':i===1?'#FF6B6B':'#43E97B'};color:white;">${o}</button>`).join('')}</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startShapeReason() {
    document.getElementById('game-title').textContent = '🔷 图形推理';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['●', '■', '▲', '◆', '★'], colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B'];
    const baseShapes = [];
    for (let i = 0; i < 4; i++) baseShapes.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapePattern = [...baseShapes];
    shapeCorrect = Math.floor(Math.random() * 4);
    const correctAnswer = baseShapes[shapeCorrect];
    shapeOptions = [correctAnswer];
    for (let i = 0; i < 3; i++) shapeOptions.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapeOptions = shapeOptions.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">找出规律，预测缺失的图形：</div><div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">' + shapePattern.map((s, i) => i === shapeCorrect ? '<div style="width:50px;height:50px;border:2px dashed #999;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;">?</div>' : '<div style="width:50px;height:50px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;color:' + s.color + ';">' + s.shape + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + shapeOptions.map((s, i) => '<div onclick="checkShapeReason(' + i + ')" style="width:60px;height:60px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="shape-opt-' + i + '">' + s.shape + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startVisual() {
    const config = gameConfig['visual'];
    document.getElementById('game-title').textContent = config?.name || '👁️ 视觉搜索';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const targetIdx = Math.floor(Math.random()*16);
    const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFD93D'];
    const targetColor = colors[Math.floor(Math.random()*colors.length)];
    const baseColor = colors.filter(c=>c!==targetColor)[Math.floor(Math.random()*4)];
    board.innerHTML = Array.from({length:16},(_,i)=>`<div class="game-cell" onclick="checkVisual(this,${i},${targetIdx},'${targetColor}')" style="background:${i===targetIdx?targetColor:baseColor};border-radius:8px;cursor:pointer;"></div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startSpaceRotate() {
    document.getElementById('game-title').textContent = '🎲 空间旋转';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['↑', '→', '↓', '←'];
    const original = shapes[Math.floor(Math.random() * shapes.length)];
    const rotations = [0, 90, 180, 270];
    const targetRotation = rotations[Math.floor(Math.random() * rotations.length)];
    const degrees = { '↑': 0, '→': 90, '↓': 180, '←': 270 };
    const getShape = (base, rot) => { const baseDeg = degrees[base]; const newDeg = (baseDeg + rot) % 360; return Object.entries(degrees).find(([_, d]) => d === newDeg)?.[0] || '↑'; };
    const rotatedShape = getShape(original, targetRotation);
    const options = [rotatedShape, ...shapes.filter(s => s !== rotatedShape)].slice(0, 4).sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">原图形旋转后是什么方向？</div><div style="display:flex;gap:24px;justify-content:center;margin-bottom:16px;align-items:center;"><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">原图形</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">' + original + '</div></div><div style="font-size:24px;color:#667eea;">→</div><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">旋转' + targetRotation + '°</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">？</div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + options.map((s, i) => '<div onclick="checkSpaceRotate(\'' + s + '\', \'' + rotatedShape + '\')" style="width:60px;height:60px;background:#f5f7ff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="space-opt-' + i + '">' + s + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startEliminate() {
    document.getElementById('game-title').textContent = '💎 消消乐';
    const board = document.getElementById('game-board');
    board.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;overflow:auto;min-height:0;';
    board.innerHTML = '<div style="text-align:center;margin-bottom:8px;"><span id="elim-timer" style="font-size:20px;font-weight:bold;color:#F4511E;">30</span>秒 | <span id="elim-score" style="font-size:16px;font-weight:bold;">0</span>分</div><div id="elim-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:6px;width:100%;max-width:300px;margin:0 auto;"></div>';
    
    elimScore = 0;
    elimTime = 30;
    elimSelected = null;
    elimBoard = [];
    
    for(let i=0;i<36;i++) elimBoard.push(Math.floor(Math.random()*6));
    renderElim();
    
    document.getElementById('game-score').textContent = '0';
    
    if(elimTimer) clearInterval(elimTimer);
    elimTimer = setInterval(()=>{
        elimTime--;
        document.getElementById('elim-timer').textContent = elimTime;
        if(elimTime<=0) {
            clearInterval(elimTimer);
            elimTimer = null;
            endGame();
        }
    },1000);
}

function startStroop() {
    const diff = (getCurrentUserData().difficulty || 1);
    const totalTime = diff <= 2 ? 45 : diff <= 3 ? 30 : 20;
    const colors = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA'];
    const colorNames = ['红色','蓝色','绿色','橙色','紫色'];
    
    window._stroopData = {score: 0, total: 0, timeLeft: totalTime, colors, colorNames};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = 'white';
    
    showStroopQuestion();
    
    window._stroopTimer = setInterval(() => {
        window._stroopData.timeLeft--;
        const el = document.getElementById('stroop-timer');
        if (el) el.textContent = window._stroopData.timeLeft + '秒';
        if (window._stroopData.timeLeft <= 0) {
            clearInterval(window._stroopTimer);
            const d = window._stroopData;
            showGameOver(d.score * 10, d.total * 10);
        }
    }, 1000);
}

function startPalace() {
    const config = CTM.games.palace || {};
    const diff = (getCurrentUserData().difficulty || 1);
    const itemCount = diff <= 2 ? 5 : diff <= 3 ? 7 : 9;
    const memorizeTime = diff <= 2 ? 30 : diff <= 3 ? 20 : 15;
    
    const items = ['📚','🍎','🔑','⭐','🎯','🎈','🎵','🌈','🏆','💡','🎁','🌙','🔔','❤️','🦋','🌸','⚽','🎸'];
    const shuffled = items.sort(() => Math.random() - 0.5).slice(0, itemCount);
    const positions = [];
    const cols = 4, rows = 3;
    for (let i = 0; i < itemCount; i++) {
        let pos;
        do { pos = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
        } while (positions.some(p => p.x === pos.x && p.y === pos.y));
        positions.push(pos);
    }
    
    let gameData = {items: shuffled, positions, phase: 'memorize', selected: [], score: 0};
    window._palaceData = gameData;
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    container.innerHTML = '<div style="text-align:center;"><div style="font-size:24px;font-weight:bold;margin-bottom:12px;">🏛️ 记忆宫殿</div><div style="font-size:16px;margin-bottom:20px;">记住每个物品的位置！</div><div style="font-size:48px;">⏳</div><div id="palace-timer" style="font-size:20px;margin-top:12px;">' + memorizeTime + '秒</div></div>';
    
    // 记忆阶段倒计时
    let timeLeft = memorizeTime;
    window._palaceTimer = setInterval(() => {
        timeLeft--;
        const el = document.getElementById('palace-timer');
        if (el) el.textContent = timeLeft + '秒';
        if (timeLeft <= 0) {
            clearInterval(window._palaceTimer);
            renderPalaceRecall();
        }
    }, 1000);
    
    // 先显示物品
    setTimeout(() => renderPalaceMemorize(shuffled, positions, memorizeTime), 100);
}

function startNumshape() {
    const diff = (getCurrentUserData().difficulty || 1);
    const questions = [
        {expr:'y = x', correct:0, opts:['直线(45°)','抛物线(向上)','双曲线','正弦曲线']},
        {expr:'y = x²', correct:1, opts:['直线','抛物线(向上)','抛物线(向下)','V字形']},
        {expr:'y = -x²', correct:2, opts:['直线','抛物线(向上)','抛物线(向下)','双曲线']},
        {expr:'y = |x|', correct:3, opts:['直线','抛物线','双曲线','V字形']},
        {expr:'y = 2x + 1', correct:0, opts:['直线(斜向上)','抛物线','水平线','垂直线']},
        {expr:'y = 1/x', correct:2, opts:['直线','抛物线','双曲线','正弦曲线']},
        {expr:'y = x³', correct:1, opts:['直线','S形曲线','抛物线','双曲线']},
        {expr:'y = √x', correct:0, opts:['半抛物线(右延伸)','抛物线','双曲线','直线']},
        {expr:'y = sin(x)', correct:2, opts:['直线','抛物线','正弦波','方波']},
        {expr:'y = 3', correct:1, opts:['垂直线','水平线','抛物线','斜线']}
    ];
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._numshapeData = {questions: selected, current: 0, score: 0, total: count};
    
    showNumshapeQuestion();
}

function startConserve() {
    const questions = [
        {q:'将水从矮胖杯倒入高瘦杯，水量如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'体积守恒'},
        {q:'一块橡皮泥从球形捏成长条形，质量如何？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'质量守恒'},
        {q:'弹簧被压缩后，弹性势能和动能之和如何？', opts:['增加','减少','不变','取决于速度'], correct:2, explain:'机械能守恒(无摩擦)'},
        {q:'两车碰撞前后，总动量如何？', opts:['增加','减少','不变','取决于碰撞类型'], correct:2, explain:'动量守恒'},
        {q:'封闭容器内气体被压缩，分子总数如何？', opts:['增加','减少','不变','取决于温度'], correct:2, explain:'粒子数守恒'},
        {q:'化学反应前后，原子总数如何？', opts:['增加','减少','不变','取决于反应类型'], correct:2, explain:'质量守恒'},
        {q:'电路中流入节点的电流和流出的电流关系？', opts:['流入>流出','流入<流出','相等','不确定'], correct:2, explain:'电荷守恒'},
        {q:'自由下落过程中，动能增加量与势能减少量关系？', opts:['增加>减少','增加<减少','相等','不确定'], correct:2, explain:'能量守恒'},
        {q:'两个人分别绕操场跑一圈，位移相同吗？', opts:['相同','不同','取决于速度','取决于方向'], correct:0, explain:'位移只看起终点'},
        {q:'冰融化成水，分子数如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'粒子数守恒'}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._conserveData = {questions: selected, current: 0, score: 0, total: count};
    showConserveQuestion();
}

function startNetwork() {
    const topics = [
        {nodes:['光合作用','二氧化碳','氧气','叶绿体','阳光','葡萄糖'], edges:[[0,1],[0,2],[0,3],[0,4],[0,5]]},
        {nodes:['牛顿','万有引力','苹果','运动定律','力','加速度'], edges:[[0,1],[0,2],[0,3],[4,5],[3,4]]},
        {nodes:['细胞','DNA','蛋白质','基因','染色体','遗传'], edges:[[0,1],[1,3],[1,4],[2,5],[3,4]]},
        {nodes:['水','蒸发','凝结','雨','云','河流'], edges:[[0,1],[1,3],[1,4],[3,2],[4,2],[5,0]]}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const topicIdx = Math.floor(Math.random() * topics.length);
    const topic = topics[topicIdx];
    window._networkData = {topic, selected: [], correct: 0, total: topic.edges.length};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    let html = '<div style="text-align:center;max-width:360px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🕸️ 知识网络</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击两个节点建立连接，找出正确关系</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">';
    topic.nodes.forEach((n, i) => {
        html += '<div onclick="networkSelect(' + i + ')" id="net-node-' + i + '" style="padding:8px 14px;background:rgba(255,255,255,0.2);border-radius:20px;cursor:pointer;font-size:13px;">' + n + '</div>';
    });
    html += '</div>';
    html += '<div style="font-size:12px;" id="net-status">请选择第一个节点</div>';
    html += '<div style="margin-top:8px;font-size:13px;">已建立: <span id="net-count">0</span>/' + topic.edges.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function startReverse() {
    const questions = [
        {conclusion:'三角形内角和为180°', opts:['三条边等长','任意三角形','直角三角形','等腰三角形'], correct:1},
        {conclusion:'物体加速运动', opts:['合外力为零','合外力不为零','速度为零','质量很大'], correct:1},
        {conclusion:'x²=4', opts:['x必须大于0','x=2或x=-2','x只能是2','x必须是整数'], correct:1},
        {conclusion:'化学反应发生了', opts:['颜色没变','产生新物质','温度不变','体积不变'], correct:1},
        {conclusion:'该数为偶数', opts:['该数能被3整除','该数末位是0,2,4,6,8','该数大于10','该数是质数'], correct:1},
        {conclusion:'植物能进行光合作用', opts:['没有根','有叶绿体','在黑暗中','没有水'], correct:1},
        {conclusion:'分数有意义', opts:['分子为0','分母不为0','分母为0','分子大于分母'], correct:1},
        {conclusion:'水会沸腾', opts:['温度100°C以下','达到沸点且继续加热','在密闭容器中','气压很高'], correct:1},
        {conclusion:'两个力平衡', opts:['大小不等','方向相同','大小相等方向相反','作用在不同物体上'], correct:2},
        {conclusion:'该数为质数', opts:['能被2整除','只能被1和自身整除','是偶数','大于10'], correct:1}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._reverseData = {questions: selected, current: 0, score: 0, total: count};
    showReverseQuestion();
}

function startExperiment() {
    const experiments = [
        {title:'验证植物光合作用需要光', steps:['选取两盆相同植物','一盆放暗处一盆放光照下','相同时间后取叶片','碘液检测淀粉','对比结果得出结论'], distractors:['给植物浇水','测量植物高度']},
        {title:'验证空气中有水蒸气', steps:['准备干燥玻璃片','对着玻璃片哈气','观察玻璃片表面','看到水珠形成','得出空气含水蒸气的结论'], distractors:['称量玻璃片质量','加热玻璃片']},
        {title:'验证声音需要介质传播', steps:['准备密封玻璃罩和闹钟','闹钟放入罩内通电响铃','用抽气机逐渐抽出空气','观察声音逐渐减弱','推论真空不能传声'], distractors:['调节闹钟音量','打开窗户']},
        {title:'验证浮力与排开液体体积的关系', steps:['准备弹簧测力计和物体','测空气中物体重力','将物体部分浸入水中读数','将物体全部浸入水中读数','比较两次浮力大小'], distractors:['测量水温','换用不同颜色水']},
        {title:'验证欧姆定律', steps:['搭建含电阻的电路','调节电压到不同值','记录各电压下的电流值','计算电压与电流的比值','比值恒定即验证欧姆定律'], distractors:['测量电阻颜色','断开所有开关']}
    ];
    const expIdx = Math.floor(Math.random() * experiments.length);
    const exp = experiments[expIdx];
    const diff = (getCurrentUserData().difficulty || 1);
    
    // 混入干扰项
    let allSteps = [...exp.steps.map((s,i) => ({text:s, isCorrect:true, order:i}))];
    if (diff >= 2) {
        exp.distractors.forEach(d => allSteps.push({text:d, isCorrect:false, order:-1}));
    }
    allSteps.sort(() => Math.random() - 0.5);
    
    window._experimentData = {experiment: exp, allSteps, selected: [], score: 0};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#89f7fe,#66a6ff)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🧪 实验设计</div>';
    html += '<div style="font-size:15px;font-weight:bold;margin-bottom:8px;padding:10px;background:rgba(255,255,255,0.5);border-radius:12px;">' + exp.title + '</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">按正确顺序点击步骤（排除干扰项）</div>';
    html += '<div id="exp-steps">';
    allSteps.forEach((s, i) => {
        html += '<div onclick="experimentSelect(' + i + ')" id="exp-step-' + i + '" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;text-align:left;">' + s.text + '</div>';
    });
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:13px;">已选: <span id="exp-count">0</span>/' + exp.steps.length + ' 步</div>';
    html += '</div>';
    container.innerHTML = html;
}

function start2048() {
    document.getElementById('game-title').textContent = '🎮 2048';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="g2048-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;background:#bbada0;border-radius:12px;"></div><div style="text-align:center;margin-top:12px;"><button onclick="reset2048()" style="padding:10px 20px;background:#8f7a66;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    g2048Board = Array(16).fill(0);
    g2048Score = 0;
    add2048Tile();
    add2048Tile();
    render2048();
    
    document.getElementById('game-score').textContent = '0';
    
    // 触屏滑动控制
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(Math.abs(dx)>Math.abs(dy)) {
                move2048(dx>0?2:4); // 右:2, 左:4
            } else {
                move2048(dy>0?1:3); // 下:1, 上:3
            }
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp') move2048(3);
        else if(e.key==='ArrowDown') move2048(1);
        else if(e.key==='ArrowLeft') move2048(4);
        else if(e.key==='ArrowRight') move2048(2);
    });
}

async function startAudioSeq() {
    const freqs = [440, 554, 659];
    for (let i = 0; i < audioSequence.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                playAudioTone3(freqs[audioSequence[i]]);
                const el = document.getElementById('audio-seq-' + i);
                if (el) { el.style.background = '#667eea'; el.style.color = 'white'; }
                setTimeout(resolve, 500);
            }, 500);
        });
    }
}

function startMethodPractice(method) {
    const practice = methodPractices[method];
    if (!practice) return;
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    let html = '<div class="modal-title">' + practice.title + '</div>';
    practice.tasks.forEach((task, i) => {
        html += '<div class="plan-task" onclick="this.classList.toggle(\'completed\')"><div class="task-checkbox" id="task-' + i + '"></div><div class="task-text">' + task + '</div></div>';
    });
    html += '<button class="modal-close" onclick="closeModal()">完成训练</button>';
    content.innerHTML = html;
}

function startMethodQuiz(methodId, page = 0) {
    const questions = methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    // 初始化页码
    if (!currentMethodPage[methodId]) currentMethodPage[methodId] = 0;
    if (page !== undefined) currentMethodPage[methodId] = page;
    
    const currentPage = currentMethodPage[methodId];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题
                    </div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">
                        ${q.q}
                    </div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startMethodTraining(methodId) {
    const questions = getMethodTraining(methodId);
    if (questions.length === 0) { showToast('暂无训练题'); return; }
    const methodNames = {
        feyman:'费曼学习法',pomodoro:'番茄工作法',ebbinghaus:'艾宾浩斯记忆法',
        mindmap:'思维导图法',cornell:'康奈尔笔记法',sq3r:'SQ3R阅读法',
        timeManagement:'时间管理法',noteTaking:'高效笔记法',testStrategy:'考试策略'
    };
    let html = '<div style="max-height:70vh;overflow-y:auto;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:16px;text-align:center;">' + methodNames[methodId] + ' 训练 (' + questions.length + '题)</div>';
    questions.forEach((q, i) => {
        html += '<div class="method-card" style="margin-bottom:16px;">';
        html += '<div style="font-size:14px;font-weight:600;margin-bottom:8px;">' + (i+1) + '. ' + q.q + '</div>';
        html += '<div class="method-content" style="background:#f5f7ff;padding:10px;border-radius:8px;">';
        html += '<strong>参考答案：</strong>' + q.a + '</div></div>';
    });
    html += '</div><button class="login-btn login-btn-primary" onclick="closeDetail()" style="width:100%;">完成训练</button>';
    const contentEl = document.getElementById('detail-content');
    if (contentEl) { contentEl.innerHTML = html; document.getElementById('detail-modal').classList.add('show'); }
}

function startThinkingQuiz(type, page = 0) {
    const questions = thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startPractice(topicId) {
    showToast('正在加载练习...');
    const topic = topicsMath7.find(t => t.id === topicId) || 
                  topicsEnglish7.find(t => t.id === topicId) ||
                  topicsChinese7.find(t => t.id === topicId);
    if (topic) {
        const container = document.getElementById('fullscreen-content');
        container.innerHTML = `
            <div class="practice-card">
                <div class="practice-question">${topic.q}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="请输入你的答案" />
                    <button onclick="submitTopicAnswer(${topic.id})">提交</button>
                </div>
                <div id="practice-result"></div>
            </div>
        `;
    }
}

function render2048() {
    const container = document.getElementById('g2048-container');
    if(!container) return;
    container.innerHTML = '';
    const colors = {0:'#cdc1b4',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
    g2048Board.forEach((v,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `width:70px;height:70px;background:${colors[v]||'#3c3a32'};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:${v>=1000?20:24}px;font-weight:bold;color:${v<=4?'#776e65':'#fff'};`;
        if(v) cell.textContent = v;
        container.appendChild(cell);
    });
}

function renderElim() {
    const container = document.getElementById('elim-container');
    if(!container) return;
    container.innerHTML = '';
    elimBoard.forEach((c,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `aspect-ratio:1;background:${elimColors[c]};border-radius:6px;cursor:pointer;transition:transform 0.2s;min-height:30px;`;
        cell.id = 'elim-'+i;
        cell.onclick = () => clickElim(i);
        container.appendChild(cell);
    });
}

function renderPalaceMemorize(items, positions, timeLeft) {
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 记忆阶段</div>';
    html += '<div id="palace-timer" style="font-size:14px;margin-bottom:12px;color:#ffd700;">⏱️ ' + timeLeft + '秒</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            const idx = positions.findIndex(p => p.x === x && p.y === y);
            if (idx >= 0) {
                html += '<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:32px;background:rgba(255,255,255,0.2);border-radius:12px;">' + items[idx] + '</div>';
            } else {
                html += '<div style="width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:12px;"></div>';
            }
        }
    }
    html += '</div></div>';
    container.innerHTML = html;
}

function renderPalaceRecall() {
    const data = window._palaceData;
    if (!data) return;
    data.phase = 'recall';
    data.selected = [];
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 回忆阶段</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;color:#ffd700;">点击正确的位置放置物品</div>';
    html += '<div style="font-size:28px;margin-bottom:12px;" id="palace-current-item">' + data.items[0] + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;" id="palace-grid">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            html += '<div onclick="palaceClick(' + x + ',' + y + ')" style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(255,255,255,0.1);border-radius:12px;cursor:pointer;" id="palace-' + x + '-' + y + '"></div>';
        }
    }
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:14px;">得分: <span id="palace-score">0</span>/' + data.items.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
    data.currentIdx = 0;
}

function reset2048() { start2048(); }

function checkSchulte(el, n) {
    if (n === schulteNext) {
        el.style.background = '#43E97B'; el.style.color = 'white';
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        schulteNext++;
        if (schulteNext > el.parentElement.children.length) {
            if (gameLevel < 4) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
                startSchulte(); 
            }
            else endGame();
        }
    } else { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => el.style.background = 'white', 200); 
    }
}

function whackMole(idx) {
    if(whackMoles[idx]===1) {
        whackMoles[idx] = 0;
        const el = document.getElementById('whack-'+idx);
        if(el) el.style.bottom = '-50px';
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect();
    }
}

function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }

function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }

function canMove2048() {
    for(let i=0;i<16;i++) {
        if(g2048Board[i]===0) return true;
        if(i%4!==3&&g2048Board[i]===g2048Board[i+1]) return true;
        if(i<12&&g2048Board[i]===g2048Board[i+4]) return true;
    }
    return false;
}

function move2048(dir) {
    const old = [...g2048Board];
    const rotate = (b,times) => {let r=[...b];for(let t=0;t<times;t++){const n=Array(16).fill(0);for(let i=0;i<16;i++)n[(3-i%4)*4+i%4]=b[i];r=n;}return r;};
    let b = rotate(g2048Board,dir);
    
    for(let r=0;r<4;r++) {
        let row = b.slice(r*4,r*4+4).filter(v=>v);
        for(let i=0;i<row.length-1;i++) if(row[i]===row[i+1]){row[i]*=2;g2048Score+=row[i];row.splice(i+1,1);}
        while(row.length<4) row.push(0);
        for(let c=0;c<4;c++) b[r*4+c]=row[c];
    }
    
    g2048Board = rotate(b,(4-dir)%4);
    gameScore = g2048Score;
    document.getElementById('game-score').textContent = g2048Score;
    
    if(JSON.stringify(old)!==JSON.stringify(g2048Board)) {
        add2048Tile();
        render2048();
        
        if(g2048Board.includes(2048)) {
            SoundEffects.playComplete();
            setTimeout(()=>{gameLevel++;updateGameLevelBadge();reset2048();},500);
        } else if(g2048Board.every(v=>v!==0)&&!canMove2048()) {
            endGame();
        }
    }
}

function add2048Tile() {
    const empty = [];
    g2048Board.forEach((v,i)=>{if(v===0)empty.push(i);});
    if(empty.length) g2048Board[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
}

function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }

function resetGame() { startGame(gameType); }

function endGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 播放游戏结束音效
    SoundEffects.playComplete();
    
    const timeSpent = Math.round((Date.now()-gameStartTime)/1000);
    const config = gameConfig[gameType];
    
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:200px;';
    
    board.innerHTML = `
        <div style="text-align:center;width:100%;max-width:300px;">
            <div style="font-size:64px;margin-bottom:16px;">${gameScore > 10 ? '🏆' : gameScore > 5 ? '🎉' : '👏'}</div>
            <div style="font-size:24px;font-weight:bold;color:${config?.color || '#1A6BFF'};margin-bottom:8px;">游戏结束！</div>
            <div style="font-size:48px;font-weight:bold;margin:16px 0;color:#333;">${gameScore}</div>
            <div style="font-size:14px;color:#666;margin-bottom:16px;">得分</div>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;">
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">用时</div>
                    <div style="font-size:18px;font-weight:bold;color:#1A6BFF;">${timeSpent}秒</div>
                </div>
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">到达关卡</div>
                    <div style="font-size:18px;font-weight:bold;color:#43E97B;">第${gameLevel}关</div>
                </div>
            </div>
            
            <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
                <button onclick="resetGame()" style="padding:14px 24px;background:${config?.gradient || '#1A6BFF'};color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔄 再来一次</button>
                <button onclick="closeGame()" style="padding:14px 24px;background:#f5f5f5;color:#333;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">返回列表</button>
            </div>
        </div>
    `;
    
    // 保存统计数据
    const user = getCurrentUserData();
    if (user) {
        // 最高分
        user.gameScores = user.gameScores || {};
        user.gameScores[gameType] = Math.max(user.gameScores[gameType]||0, gameScore);
        
        // 游戏次数
        user.gameCounts = user.gameCounts || {};
        user.gameCounts[gameType] = (user.gameCounts[gameType] || 0) + 1;
        
        // 游戏时长
        user.gameTimes = user.gameTimes || {};
        user.gameTimes[gameType] = (user.gameTimes[gameType] || 0) + timeSpent;
        
        // 今日统计
        user.todayStats = user.todayStats || { questions:0, correct:0, minutes:0 };
        user.todayStats.minutes += Math.ceil(timeSpent/60);
        
        const today = new Date().toISOString().split('T')[0];
        user.studyDays = user.studyDays || {};
        user.studyDays[today] = (user.studyDays[today]||0) + Math.ceil(timeSpent/60);
        
        syncUserData(user);
        syncTodayStats();
    }
}

function exitGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }

function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }

function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }

function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }

function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }

function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }

function showMole() {
    // 隐藏所有
    whackMoles.forEach((_,i)=>{
        const el = document.getElementById('whack-'+i);
        if(el) el.style.bottom = '-50px';
    });
    whackMoles = whackMoles.map(()=>0);
    
    // 显示新的
    const moleSpeed = Math.max(300,800-gameLevel*50);
    const count = Math.min(3,1+Math.floor(gameLevel/2));
    for(let i=0;i<count;i++) {
        setTimeout(()=>{
            const idx = Math.floor(Math.random()*9);
            const el = document.getElementById('whack-'+idx);
            if(el && whackMoles[idx]===0) {
                whackMoles[idx] = 1;
                el.style.bottom = '15px';
                setTimeout(()=>{
                    if(whackMoles[idx]===1) {
                        whackMoles[idx] = 0;
                        el.style.bottom = '-50px';
                    }
                },moleSpeed);
            }
        },i*200);
    }
}

function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }

function tapTarget(el) { 
    el.style.background = '#43E97B'; 
    gameScore++; 
    document.getElementById('game-score').textContent = gameScore; 
    SoundEffects.playClick(); // 点击音效
}

function canConnect(a,b) {
    const r1=Math.floor(a/6),c1=a%6,r2=Math.floor(b/6),c2=b%6;
    // 直线连接
    if(r1===r2) {
        for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r1*6+c]!=='') return false;
        return true;
    }
    if(c1===c2) {
        for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c1]!=='') return false;
        return true;
    }
    // 一个拐角
    if(linkBoard[r1*6+c2]==='') return true;
    if(linkBoard[r2*6+c1]==='') return true;
    // 两个拐角
    for(let r=0;r<6;r++) {
        if(linkBoard[r*6+c1]===''&&linkBoard[r*6+c2]==='') {
            let clear=true;
            for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    for(let c=0;c<6;c++) {
        if(linkBoard[r1*6+c]===''&&linkBoard[r2*6+c]==='') {
            let clear=true;
            for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    return false;
}

function flipCard(idx, el) {
    if(flipped.length>=2||flipped.includes(idx)||matched>=8) return;
    el.style.transform = 'rotateY(180deg)';
    el.innerHTML = '<span>'+flipCards[idx]+'</span>';
    flipped.push(idx);
    
    if(flipped.length===2) {
        flips++;
        gameScore = flips;
        document.getElementById('game-score').textContent = flips;
        
        if(flipCards[flipped[0]]===flipCards[flipped[1]]) {
            matched++;
            SoundEffects.playCorrect();
            if(matched===8) {
                setTimeout(()=>{
                    gameLevel++;
                    updateGameLevelBadge();
                    startFlipCard();
                },1000);
            }
            flipped = [];
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                const c1 = document.getElementById('flip-'+flipped[0]);
                const c2 = document.getElementById('flip-'+flipped[1]);
                if(c1) {c1.style.transform='';c1.innerHTML='<span style="opacity:0.3;">❓</span>';}
                if(c2) {c2.style.transform='';c2.innerHTML='<span style="opacity:0.3;">❓</span>';}
                flipped = [];
            },800);
        }
    }
}

function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }

function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }

function isSolved() {
    for(let i=0;i<15;i++) if(slideBoard[i]!==i+1) return false;
    return slideBoard[15]===0;
}

function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }

function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }

function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }

function textMemoryStartTest() {
    const board = document.getElementById('game-board');
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    textMemoryIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请判断这些词是否在刚才的记忆中：</div><div id="text-memory-word" style="font-size:24px;font-weight:bold;text-align:center;margin-bottom:20px;color:#333;">' + testWords[0] + '</div><div style="display:flex;gap:12px;"><button onclick="textMemoryCheck(true)" style="flex:1;padding:14px;background:#43E97B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✓ 见过</button><button onclick="textMemoryCheck(false)" style="flex:1;padding:14px;background:#FF6B6B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✗ 没见</button></div></div>';
}

function textMemoryCheck(answeredYes) {
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    const currentWord = testWords[textMemoryIndex];
    const wasInMemory = textMemoryWords.includes(currentWord);
    if (answeredYes === wasInMemory) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    textMemoryIndex++;
    if (textMemoryIndex >= testWords.length) {
        const board = document.getElementById('game-board');
        board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (gameScore >= testWords.length * 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确 ' + gameScore + '/' + testWords.length + '</div><button onclick="textMemoryNext()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
    } else {
        document.getElementById('text-memory-word').textContent = testWords[textMemoryIndex];
    }
}

function textMemoryNext() { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startTextMemory(); }

function showStroopQuestion() {
    const data = window._stroopData;
    if (!data || data.timeLeft <= 0) return;
    
    const wordIdx = Math.floor(Math.random() * data.colors.length);
    const colorIdx = Math.floor(Math.random() * data.colors.length);
    data.correctIdx = colorIdx;
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🎯 Stroop冲突</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击文字的<strong>书写颜色</strong>，不是文字内容！</div>';
    html += '<div style="font-size:56px;font-weight:bold;margin:20px 0;color:' + data.colors[colorIdx] + ';">' + data.colorNames[wordIdx] + '</div>';
    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">';
    data.colors.forEach((c, i) => {
        html += '<div onclick="stroopAnswer(' + i + ')" style="width:50px;height:50px;border-radius:50%;background:' + c + ';cursor:pointer;border:3px solid rgba(255,255,255,0.3);"></div>';
    });
    html += '</div>';
    html += '<div style="margin-top:16px;font-size:14px;">⏱️ <span id="stroop-timer">' + data.timeLeft + '</span>秒 | 得分: ' + data.score + '/' + data.total + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function stroopAnswer(idx) {
    const data = window._stroopData;
    if (!data) return;
    data.total++;
    if (idx === data.correctIdx) data.score++;
    showStroopQuestion();
}

function showReverseQuestion() {
    const data = window._reverseData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🔄 逆向推理</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:13px;margin-bottom:4px;">已知结论：</div>';
    html += '<div style="font-size:16px;font-weight:bold;margin:12px 0;padding:12px;background:rgba(255,255,255,0.5);border-radius:12px;">' + q.conclusion + '</div>';
    html += '<div style="font-size:13px;margin-bottom:8px;">哪个条件能推出此结论？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="reverseAnswer(' + i + ')" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;">' + opt + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function reverseAnswer(idx) {
    const data = window._reverseData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showReverseQuestion();
}

function conserveAnswer(idx) {
    const data = window._conserveData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showConserveQuestion();
}

function showNumshapeQuestion() {
    const data = window._numshapeData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:12px;">📐 数形结合</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:32px;font-weight:bold;margin:20px 0;padding:16px;background:rgba(255,255,255,0.5);border-radius:16px;">' + q.expr + '</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;">这个函数的图像是什么形状？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="numshapeAnswer(' + i + ')" style="padding:12px;margin:6px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:14px;">' + opt + '</div>';
    });
    html += '<div style="margin-top:12px;font-size:13px;">得分: ' + data.score * 10 + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function numshapeAnswer(idx) {
    const data = window._numshapeData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showNumshapeQuestion();
}

function networkSelect(idx) {
    const data = window._networkData;
    if (!data) return;
    
    const nodeEl = document.getElementById('net-node-' + idx);
    if (!nodeEl) return;
    
    if (data.selected.length === 0) {
        data.selected = [idx];
        nodeEl.style.background = 'rgba(67,233,123,0.5)';
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第二个节点';
    } else if (data.selected.length === 1) {
        const a = data.selected[0], b = idx;
        if (a === b) { data.selected = []; nodeEl.style.background = 'rgba(255,255,255,0.2)'; return; }
        
        const isCorrect = data.topic.edges.some(e => (e[0]===a && e[1]===b) || (e[0]===b && e[1]===a));
        const nodeA = document.getElementById('net-node-' + a);
        
        if (isCorrect) {
            data.correct++;
            nodeA.style.background = 'rgba(67,233,123,0.3)';
            nodeEl.style.background = 'rgba(67,233,123,0.3)';
        } else {
            nodeA.style.background = 'rgba(255,100,100,0.3)';
            nodeEl.style.background = 'rgba(255,100,100,0.3)';
            setTimeout(() => {
                nodeA.style.background = 'rgba(255,255,255,0.2)';
                nodeEl.style.background = 'rgba(255,255,255,0.2)';
            }, 500);
        }
        
        data.selected = [];
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第一个节点';
        const cnt = document.getElementById('net-count');
        if (cnt) cnt.textContent = data.correct;
        
        if (data.correct >= data.total) {
            setTimeout(() => showGameOver(data.correct * 10 + 20, data.total * 10 + 20), 500);
        }
    }
}

function experimentSelect(idx) {
    const data = window._experimentData;
    if (!data) return;
    const step = data.allSteps[idx];
    const el = document.getElementById('exp-step-' + idx);
    if (!el || step._selected) return;
    
    step._selected = true;
    
    if (step.isCorrect && step.order === data.selected.length) {
        data.selected.push(step);
        data.score++;
        el.style.background = 'rgba(67,233,123,0.5)';
        el.style.cursor = 'default';
    } else if (step.isCorrect && step.order !== data.selected.length) {
        el.style.background = 'rgba(255,200,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    } else {
        el.style.background = 'rgba(255,100,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    }
    
    const cnt = document.getElementById('exp-count');
    if (cnt) cnt.textContent = data.selected.length;
    
    if (data.selected.length >= data.experiment.steps.length) {
        setTimeout(() => showGameOver(data.score * 10 + 20, data.experiment.steps.length * 10 + 20), 500);
    }
}

function palaceClick(x, y) {
    const data = window._palaceData;
    if (!data || data.phase !== 'recall') return;
    const idx = data.currentIdx;
    if (idx >= data.items.length) return;
    
    const cell = document.getElementById('palace-' + x + '-' + y);
    if (!cell || cell.textContent) return; // 已占据
    
    const correct = data.positions[idx].x === x && data.positions[idx].y === y;
    if (correct) {
        cell.textContent = data.items[idx];
        cell.style.background = 'rgba(67,233,123,0.3)';
        data.score++;
    } else {
        cell.textContent = '❌';
        cell.style.background = 'rgba(255,100,100,0.3)';
    }
    
    const scoreEl = document.getElementById('palace-score');
    if (scoreEl) scoreEl.textContent = data.score;
    
    data.currentIdx++;
    if (data.currentIdx >= data.items.length) {
        setTimeout(() => showGameOver(data.score * 10 + (data.score === data.items.length ? 20 : 0), data.items.length * 10 + 20), 500);
    } else {
        const itemEl = document.getElementById('palace-current-item');
        if (itemEl) itemEl.textContent = data.items[data.currentIdx];
    }
}

function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }

function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }

function updateTrainCount(count) {
    const user = getCurrentUserData();
    if (user) {
        user.trainCount = parseInt(count);
        syncUserData(user);
        showToast('已设置每日训练 ' + count + ' 次');
    }
}

function checkClassification() {
    if (!classifySet) return;
    let correct0 = 0;
    classifyBox0.forEach(item => { if (classifySet.items1.includes(item)) correct0++; });
    let correct1 = 0;
    classifyBox1.forEach(item => { if (classifySet.items2.includes(item)) correct1++; });
    const total = classifyBox0.length + classifyBox1.length;
    const correctTotal = correct0 + correct1;
    const accuracy = total > 0 ? correctTotal / (classifySet.items1.length + classifySet.items2.length) : 0;
    if (accuracy >= 0.7) { gameScore = Math.round(accuracy * 100); SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    document.getElementById('game-score').textContent = gameScore;
    const board = document.getElementById('game-board');
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (accuracy >= 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确率 ' + Math.round(accuracy * 100) + '%</div><button onclick="startClassification()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
}

function checkDiff(el, idx, correctIdx) {
    if (idx === correctIdx) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore+'/1'; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
        setTimeout(() => startDiff(), 500); 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkDigit(correct) {
    const input = document.getElementById('digit-input');
    if (input && input.value === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        showToast('正确！');
    } else {
        SoundEffects.playWrong(); // 错误音效
        showToast('错误，正确答案是 ' + correct);
    }
    setTimeout(() => startDigit(), 500);
}

function checkMathAnswer(answer) {
    const isCorrect = answer === mathCorrectAnswer;
    document.querySelectorAll('[id^="math-opt-"]').forEach(el => {
        const val = parseInt(el.textContent);
        el.style.background = val === mathCorrectAnswer ? '#43E97B' : (val === answer ? '#FF6B6B' : '#f5f7ff');
        el.style.color = (val === mathCorrectAnswer || val === answer) ? 'white' : '#333';
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startMathCalc(); }, 800);
}

function checkPattern(el, emoji) {
    if (el.textContent === '?' && patternCorrect.includes(emoji) && !patternFound.includes(emoji)) {
        el.textContent = emoji; el.style.background = '#f0f7ff'; patternFound.push(emoji);
        SoundEffects.playCorrect(); // 正确音效
        if (patternFound.length === patternCorrect.length) {
            gameScore++; document.getElementById('game-score').textContent = gameScore;
            if (gameScore >= 2) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
            }
            setTimeout(() => startPattern(), 500);
        }
    } else if (el.textContent === '?') { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => { el.textContent = '?'; el.style.background = 'white'; }, 300); 
    }
}

function checkReason(selected, correct) { 
    if (selected === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
    setTimeout(() => startReason(), 500); 
}

function checkShapeReason(index) {
    const option = shapeOptions[index];
    const correct = option.shape === shapePattern[shapeCorrect].shape && option.color === shapePattern[shapeCorrect].color;
    shapeOptions.forEach((s, i) => {
        const el = document.getElementById('shape-opt-' + i);
        const isCorrectOption = s.shape === shapePattern[shapeCorrect].shape && s.color === shapePattern[shapeCorrect].color;
        el.style.borderColor = isCorrectOption ? '#43E97B' : '#FF6B6B';
        el.style.pointerEvents = 'none';
    });
    if (correct) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startShapeReason(); }, 1000);
}

function checkSpaceRotate(answer, correct) {
    const isCorrect = answer === correct;
    document.querySelectorAll('[id^="space-opt-"]').forEach(el => {
        const val = el.textContent;
        el.style.borderColor = val === correct ? '#43E97B' : (val === answer && !isCorrect ? '#FF6B6B' : 'transparent');
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startSpaceRotate(); }, 1000);
}

function checkVisual(el, idx, targetIdx, targetColor) {
    if (idx === targetIdx) {
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 10) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        }
        setTimeout(() => startVisual(), 300);
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkWordAssoc(answer, catName) {
    const cat = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ].find(c => c.name === catName);
    const isCorrect = cat && cat.words.includes(answer);
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startWordAssociation(); }, 800);
}

function classifyItem(el, item) {
    el.remove();
    if (classifyBox0.length <= classifyBox1.length) {
        classifyBox0.push(item);
        document.getElementById('classify-box-0').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 0)" style="display:inline-block;padding:6px 10px;background:#667eea;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    } else {
        classifyBox1.push(item);
        document.getElementById('classify-box-1').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 1)" style="display:inline-block;padding:6px 10px;background:#FF6B6B;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    }
}

function unclassifyItem(el, item, box) {
    el.remove();
    if (box === 0) classifyBox0 = classifyBox0.filter(i => i !== item);
    else classifyBox1 = classifyBox1.filter(i => i !== item);
    const itemsDiv = document.getElementById('classify-items');
    if (itemsDiv) {
        const newEl = document.createElement('div');
        newEl.style.cssText = 'padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;';
        newEl.textContent = item;
        newEl.onclick = function() { classifyItem(this, item); };
        itemsDiv.appendChild(newEl);
    }
}

function findMatches() {
    const matches = new Set();
    // 横向
    for(let r=0;r<6;r++) {
        for(let c=0;c<4;c++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[r*6+c+1]&&v===elimBoard[r*6+c+2]) {
                matches.add(r*6+c);matches.add(r*6+c+1);matches.add(r*6+c+2);
            }
        }
    }
    // 纵向
    for(let c=0;c<6;c++) {
        for(let r=0;r<4;r++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[(r+1)*6+c]&&v===elimBoard[(r+2)*6+c]) {
                matches.add(r*6+c);matches.add((r+1)*6+c);matches.add((r+2)*6+c);
            }
        }
    }
    return [...matches];
}

function processMatches(matches) {
    elimScore += matches.length * 10;
    gameScore = elimScore;
    document.getElementById('game-score').textContent = elimScore;
    document.getElementById('elim-score').textContent = elimScore;
    
    matches.forEach(i => elimBoard[i] = -1);
    
    // 下落
    for(let c=0;c<6;c++) {
        let col = [];
        for(let r=5;r>=0;r--) if(elimBoard[r*6+c]>=0) col.push(elimBoard[r*6+c]);
        while(col.length<6) col.push(Math.floor(Math.random()*6));
        for(let r=5;r>=0;r--) elimBoard[r*6+c] = col[5-r];
    }
    
    setTimeout(()=>{
        const more = findMatches();
        if(more.length>0) processMatches(more);
        else renderElim();
    },300);
}

function clickAttention(index) {
    const expectedIndex = attentionSequence[attentionIndex].number - 1;
    const el = document.getElementById('att-item-' + index);
    if (index === expectedIndex) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        if (el) { el.textContent = attentionSequence[index].number; el.style.background = '#43E97B'; }
        SoundEffects.playCorrect();
        attentionIndex++;
        if (attentionIndex >= attentionSequence.length) setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startAttentionTrack(); }, 1000);
    } else {
        if (el) el.style.background = '#FF6B6B';
        SoundEffects.playWrong();
        setTimeout(() => { startAttentionTrack(); }, 1000);
    }
}

function clickElim(idx) {
    const el = document.getElementById('elim-'+idx);
    if(!el||elimBoard[idx]<0) return;
    
    if(elimSelected===null) {
        elimSelected = idx;
        el.style.transform = 'scale(1.1)';
    } else {
        const [r1,c1] = [Math.floor(elimSelected/6),elimSelected%6];
        const [r2,c2] = [Math.floor(idx/6),idx%6];
        
        if((Math.abs(r1-r2)===1&&c1===c2)||(Math.abs(c1-c2)===1&&r1===r2)) {
            // 交换
            [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
            const matches = findMatches();
            
            if(matches.length>0) {
                SoundEffects.playCorrect();
                processMatches(matches);
            } else {
                // 换回来
                [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
                SoundEffects.playWrong();
            }
        }
        
        document.getElementById('elim-'+elimSelected).style.transform = '';
        elimSelected = null;
        renderElim();
    }
}

function clickLink(idx) {
    const el = document.getElementById('link-'+idx);
    if(!el||el.style.background==='#ccc'||linkSelected.length>=2) return;
    
    linkSelected.push(idx);
    el.style.transform = 'scale(1.1)';
    
    if(linkSelected.length===2) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        
        const [i1,i2] = linkSelected;
        if(linkBoard[i1]===linkBoard[i2]&&canConnect(i1,i2)) {
            SoundEffects.playCorrect();
            setTimeout(()=>{
                document.getElementById('link-'+i1).style.background = '#ccc';
                document.getElementById('link-'+i2).style.background = '#ccc';
                document.getElementById('link-'+i1).style.pointerEvents = 'none';
                document.getElementById('link-'+i2).style.pointerEvents = 'none';
                linkPairs++;
                linkSelected = [];
                
                if(linkPairs===18) {
                    gameLevel++;
                    updateGameLevelBadge();
                    startLinkUp();
                }
            },200);
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                linkSelected.forEach(i=>{
                    const e = document.getElementById('link-'+i);
                    if(e) e.style.transform = '';
                });
                linkSelected = [];
            },500);
        }
    }
}

function shuffleSlide() {
    for(let i=0;i<100;i++) {
        const dirs = [];
        if(slideEmpty.x>0) dirs.push({x:-1,y:0});
        if(slideEmpty.x<3) dirs.push({x:1,y:0});
        if(slideEmpty.y>0) dirs.push({x:0,y:-1});
        if(slideEmpty.y<3) dirs.push({x:0,y:1});
        const d = dirs[Math.floor(Math.random()*dirs.length)];
        const nx = slideEmpty.x + d.x;
        const ny = slideEmpty.y + d.y;
        const idx = ny*4+nx;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x:nx,y:ny};
    }
    renderSlide();
}

function moveSlide(x,y) {
    if((Math.abs(x-slideEmpty.x)===1&&y===slideEmpty.y)||(Math.abs(y-slideEmpty.y)===1&&x===slideEmpty.x)) {
        const idx = y*4+x;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x,y};
        slideMoves++;
        gameScore = slideMoves;
        document.getElementById('game-score').textContent = slideMoves;
        renderSlide();
        
        if(isSolved()) {
            SoundEffects.playComplete();
            gameLevel++;
            updateGameLevelBadge();
            setTimeout(()=>startSlide(),1000);
        }
    }
}

function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }

function closeGame() { 
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }

function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }

function calculateDataStats() {
    const data = loadData();
    const user = getCurrentUserData();
    
    const stats = {
        totalUsers: data.users?.length || 0,
        totalStudyDays: 0,
        totalGamesPlayed: 0,
        totalMethodTraining: 0,
        totalThinkingTraining: 0,
        totalAIChats: 0,
        totalPoints: 0
    };
    
    if (data.users) {
        data.users.forEach(u => {
            // 学习天数
            if (u.studyDays) stats.totalStudyDays += Object.keys(u.studyDays).length;
            // 游戏次数
            if (u.gameCounts) stats.totalGamesPlayed += Object.values(u.gameCounts).reduce((a, b) => a + b, 0);
            // 学霸方法训练
            if (u.methodStats) {
                stats.totalMethodTraining += Object.values(u.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // 思维训练
            if (u.thinkingStats) {
                stats.totalThinkingTraining += Object.values(u.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // AI问答
            stats.totalAIChats += u.aiChatCount || 0;
            // 积分
            stats.totalPoints += u.points || 0;
        });
    }
    
    // 当前用户统计
    if (user) {
        stats.currentUser = {
            name: user.name,
            grade: gradeNames[user.grade],
            difficulty: user.difficulty,
            points: user.points || 0,
            gamesPlayed: user.gameCounts ? Object.values(user.gameCounts).reduce((a, b) => a + b, 0) : 0,
            methodCompleted: user.methodStats ? Object.values(user.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            thinkingCompleted: user.thinkingStats ? Object.values(user.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            streakDays: calculateStreakDays(user)
        };
    }
    
    return stats;
}


function add2048Tile() {
    const empty = [];
    g2048Board.forEach((v,i)=>{if(v===0)empty.push(i);});
    if(empty.length) g2048Board[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
}

function calculateDataStats() {
    const data = loadData();
    const user = getCurrentUserData();
    
    const stats = {
        totalUsers: data.users?.length || 0,
        totalStudyDays: 0,
        totalGamesPlayed: 0,
        totalMethodTraining: 0,
        totalThinkingTraining: 0,
        totalAIChats: 0,
        totalPoints: 0
    };
    
    if (data.users) {
        data.users.forEach(u => {
            // 学习天数
            if (u.studyDays) stats.totalStudyDays += Object.keys(u.studyDays).length;
            // 游戏次数
            if (u.gameCounts) stats.totalGamesPlayed += Object.values(u.gameCounts).reduce((a, b) => a + b, 0);
            // 学霸方法训练
            if (u.methodStats) {
                stats.totalMethodTraining += Object.values(u.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // 思维训练
            if (u.thinkingStats) {
                stats.totalThinkingTraining += Object.values(u.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0);
            }
            // AI问答
            stats.totalAIChats += u.aiChatCount || 0;
            // 积分
            stats.totalPoints += u.points || 0;
        });
    }
    
    // 当前用户统计
    if (user) {
        stats.currentUser = {
            name: user.name,
            grade: gradeNames[user.grade],
            difficulty: user.difficulty,
            points: user.points || 0,
            gamesPlayed: user.gameCounts ? Object.values(user.gameCounts).reduce((a, b) => a + b, 0) : 0,
            methodCompleted: user.methodStats ? Object.values(user.methodStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            thinkingCompleted: user.thinkingStats ? Object.values(user.thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0) : 0,
            streakDays: calculateStreakDays(user)
        };
    }
    
    return stats;
}

function canConnect(a,b) {
    const r1=Math.floor(a/6),c1=a%6,r2=Math.floor(b/6),c2=b%6;
    // 直线连接
    if(r1===r2) {
        for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r1*6+c]!=='') return false;
        return true;
    }
    if(c1===c2) {
        for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c1]!=='') return false;
        return true;
    }
    // 一个拐角
    if(linkBoard[r1*6+c2]==='') return true;
    if(linkBoard[r2*6+c1]==='') return true;
    // 两个拐角
    for(let r=0;r<6;r++) {
        if(linkBoard[r*6+c1]===''&&linkBoard[r*6+c2]==='') {
            let clear=true;
            for(let c=Math.min(c1,c2)+1;c<Math.max(c1,c2);c++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    for(let c=0;c<6;c++) {
        if(linkBoard[r1*6+c]===''&&linkBoard[r2*6+c]==='') {
            let clear=true;
            for(let r=Math.min(r1,r2)+1;r<Math.max(r1,r2);r++) if(linkBoard[r*6+c]!=='') clear=false;
            if(clear) return true;
        }
    }
    return false;
}

function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }

function canMove2048() {
    for(let i=0;i<16;i++) {
        if(g2048Board[i]===0) return true;
        if(i%4!==3&&g2048Board[i]===g2048Board[i+1]) return true;
        if(i<12&&g2048Board[i]===g2048Board[i+4]) return true;
    }
    return false;
}

function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }

function checkSchulte(el, n) {
    if (n === schulteNext) {
        el.style.background = '#43E97B'; el.style.color = 'white';
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        schulteNext++;
        if (schulteNext > el.parentElement.children.length) {
            if (gameLevel < 4) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
                startSchulte(); 
            }
            else endGame();
        }
    } else { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => el.style.background = 'white', 200); 
    }
}

function checkClassification() {
    if (!classifySet) return;
    let correct0 = 0;
    classifyBox0.forEach(item => { if (classifySet.items1.includes(item)) correct0++; });
    let correct1 = 0;
    classifyBox1.forEach(item => { if (classifySet.items2.includes(item)) correct1++; });
    const total = classifyBox0.length + classifyBox1.length;
    const correctTotal = correct0 + correct1;
    const accuracy = total > 0 ? correctTotal / (classifySet.items1.length + classifySet.items2.length) : 0;
    if (accuracy >= 0.7) { gameScore = Math.round(accuracy * 100); SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    document.getElementById('game-score').textContent = gameScore;
    const board = document.getElementById('game-board');
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (accuracy >= 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确率 ' + Math.round(accuracy * 100) + '%</div><button onclick="startClassification()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
}

function checkDiff(el, idx, correctIdx) {
    if (idx === correctIdx) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore+'/1'; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
        setTimeout(() => startDiff(), 500); 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkDigit(correct) {
    const input = document.getElementById('digit-input');
    if (input && input.value === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        showToast('正确！');
    } else {
        SoundEffects.playWrong(); // 错误音效
        showToast('错误，正确答案是 ' + correct);
    }
    setTimeout(() => startDigit(), 500);
}

function checkMathAnswer(answer) {
    const isCorrect = answer === mathCorrectAnswer;
    document.querySelectorAll('[id^="math-opt-"]').forEach(el => {
        const val = parseInt(el.textContent);
        el.style.background = val === mathCorrectAnswer ? '#43E97B' : (val === answer ? '#FF6B6B' : '#f5f7ff');
        el.style.color = (val === mathCorrectAnswer || val === answer) ? 'white' : '#333';
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startMathCalc(); }, 800);
}

function checkPattern(el, emoji) {
    if (el.textContent === '?' && patternCorrect.includes(emoji) && !patternFound.includes(emoji)) {
        el.textContent = emoji; el.style.background = '#f0f7ff'; patternFound.push(emoji);
        SoundEffects.playCorrect(); // 正确音效
        if (patternFound.length === patternCorrect.length) {
            gameScore++; document.getElementById('game-score').textContent = gameScore;
            if (gameScore >= 2) { 
                gameLevel++; 
                updateGameLevelBadge(); 
                SoundEffects.playComplete(); // 过关音效
            }
            setTimeout(() => startPattern(), 500);
        }
    } else if (el.textContent === '?') { 
        el.style.background = '#ff6b6b'; 
        SoundEffects.playWrong(); // 错误音效
        setTimeout(() => { el.textContent = '?'; el.style.background = 'white'; }, 300); 
    }
}

function checkReason(selected, correct) { 
    if (selected === correct) { 
        gameScore++; 
        document.getElementById('game-score').textContent = gameScore; 
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 3) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        } 
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
    setTimeout(() => startReason(), 500); 
}

function checkShapeReason(index) {
    const option = shapeOptions[index];
    const correct = option.shape === shapePattern[shapeCorrect].shape && option.color === shapePattern[shapeCorrect].color;
    shapeOptions.forEach((s, i) => {
        const el = document.getElementById('shape-opt-' + i);
        const isCorrectOption = s.shape === shapePattern[shapeCorrect].shape && s.color === shapePattern[shapeCorrect].color;
        el.style.borderColor = isCorrectOption ? '#43E97B' : '#FF6B6B';
        el.style.pointerEvents = 'none';
    });
    if (correct) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startShapeReason(); }, 1000);
}

function checkSpaceRotate(answer, correct) {
    const isCorrect = answer === correct;
    document.querySelectorAll('[id^="space-opt-"]').forEach(el => {
        const val = el.textContent;
        el.style.borderColor = val === correct ? '#43E97B' : (val === answer && !isCorrect ? '#FF6B6B' : 'transparent');
    });
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startSpaceRotate(); }, 1000);
}

function checkVisual(el, idx, targetIdx, targetColor) {
    if (idx === targetIdx) {
        gameScore++; document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect(); // 正确音效
        if (gameScore >= 10) { 
            gameLevel++; 
            updateGameLevelBadge(); 
            SoundEffects.playComplete(); // 过关音效
        }
        setTimeout(() => startVisual(), 300);
    } else {
        SoundEffects.playWrong(); // 错误音效
    }
}

function checkWordAssoc(answer, catName) {
    const cat = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ].find(c => c.name === catName);
    const isCorrect = cat && cat.words.includes(answer);
    if (isCorrect) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    setTimeout(() => { startWordAssociation(); }, 800);
}

function classifyItem(el, item) {
    el.remove();
    if (classifyBox0.length <= classifyBox1.length) {
        classifyBox0.push(item);
        document.getElementById('classify-box-0').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 0)" style="display:inline-block;padding:6px 10px;background:#667eea;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    } else {
        classifyBox1.push(item);
        document.getElementById('classify-box-1').innerHTML += '<div onclick="unclassifyItem(this, \'' + item + '\', 1)" style="display:inline-block;padding:6px 10px;background:#FF6B6B;color:white;border-radius:6px;font-size:12px;margin:4px;cursor:pointer;">' + item + '</div>';
    }
}

function clickAttention(index) {
    const expectedIndex = attentionSequence[attentionIndex].number - 1;
    const el = document.getElementById('att-item-' + index);
    if (index === expectedIndex) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        if (el) { el.textContent = attentionSequence[index].number; el.style.background = '#43E97B'; }
        SoundEffects.playCorrect();
        attentionIndex++;
        if (attentionIndex >= attentionSequence.length) setTimeout(() => { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startAttentionTrack(); }, 1000);
    } else {
        if (el) el.style.background = '#FF6B6B';
        SoundEffects.playWrong();
        setTimeout(() => { startAttentionTrack(); }, 1000);
    }
}

function clickElim(idx) {
    const el = document.getElementById('elim-'+idx);
    if(!el||elimBoard[idx]<0) return;
    
    if(elimSelected===null) {
        elimSelected = idx;
        el.style.transform = 'scale(1.1)';
    } else {
        const [r1,c1] = [Math.floor(elimSelected/6),elimSelected%6];
        const [r2,c2] = [Math.floor(idx/6),idx%6];
        
        if((Math.abs(r1-r2)===1&&c1===c2)||(Math.abs(c1-c2)===1&&r1===r2)) {
            // 交换
            [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
            const matches = findMatches();
            
            if(matches.length>0) {
                SoundEffects.playCorrect();
                processMatches(matches);
            } else {
                // 换回来
                [elimBoard[elimSelected],elimBoard[idx]] = [elimBoard[idx],elimBoard[elimSelected]];
                SoundEffects.playWrong();
            }
        }
        
        document.getElementById('elim-'+elimSelected).style.transform = '';
        elimSelected = null;
        renderElim();
    }
}

function clickLink(idx) {
    const el = document.getElementById('link-'+idx);
    if(!el||el.style.background==='#ccc'||linkSelected.length>=2) return;
    
    linkSelected.push(idx);
    el.style.transform = 'scale(1.1)';
    
    if(linkSelected.length===2) {
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        
        const [i1,i2] = linkSelected;
        if(linkBoard[i1]===linkBoard[i2]&&canConnect(i1,i2)) {
            SoundEffects.playCorrect();
            setTimeout(()=>{
                document.getElementById('link-'+i1).style.background = '#ccc';
                document.getElementById('link-'+i2).style.background = '#ccc';
                document.getElementById('link-'+i1).style.pointerEvents = 'none';
                document.getElementById('link-'+i2).style.pointerEvents = 'none';
                linkPairs++;
                linkSelected = [];
                
                if(linkPairs===18) {
                    gameLevel++;
                    updateGameLevelBadge();
                    startLinkUp();
                }
            },200);
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                linkSelected.forEach(i=>{
                    const e = document.getElementById('link-'+i);
                    if(e) e.style.transform = '';
                });
                linkSelected = [];
            },500);
        }
    }
}

function closeGame() { 
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function conserveAnswer(idx) {
    const data = window._conserveData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showConserveQuestion();
}

function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }

function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }

function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }

function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }

function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }

function endGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 播放游戏结束音效
    SoundEffects.playComplete();
    
    const timeSpent = Math.round((Date.now()-gameStartTime)/1000);
    const config = gameConfig[gameType];
    
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:200px;';
    
    board.innerHTML = `
        <div style="text-align:center;width:100%;max-width:300px;">
            <div style="font-size:64px;margin-bottom:16px;">${gameScore > 10 ? '🏆' : gameScore > 5 ? '🎉' : '👏'}</div>
            <div style="font-size:24px;font-weight:bold;color:${config?.color || '#1A6BFF'};margin-bottom:8px;">游戏结束！</div>
            <div style="font-size:48px;font-weight:bold;margin:16px 0;color:#333;">${gameScore}</div>
            <div style="font-size:14px;color:#666;margin-bottom:16px;">得分</div>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;">
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">用时</div>
                    <div style="font-size:18px;font-weight:bold;color:#1A6BFF;">${timeSpent}秒</div>
                </div>
                <div style="background:#f5f7ff;padding:12px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#999;">到达关卡</div>
                    <div style="font-size:18px;font-weight:bold;color:#43E97B;">第${gameLevel}关</div>
                </div>
            </div>
            
            <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
                <button onclick="resetGame()" style="padding:14px 24px;background:${config?.gradient || '#1A6BFF'};color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔄 再来一次</button>
                <button onclick="closeGame()" style="padding:14px 24px;background:#f5f5f5;color:#333;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">返回列表</button>
            </div>
        </div>
    `;
    
    // 保存统计数据
    const user = getCurrentUserData();
    if (user) {
        // 最高分
        user.gameScores = user.gameScores || {};
        user.gameScores[gameType] = Math.max(user.gameScores[gameType]||0, gameScore);
        
        // 游戏次数
        user.gameCounts = user.gameCounts || {};
        user.gameCounts[gameType] = (user.gameCounts[gameType] || 0) + 1;
        
        // 游戏时长
        user.gameTimes = user.gameTimes || {};
        user.gameTimes[gameType] = (user.gameTimes[gameType] || 0) + timeSpent;
        
        // 今日统计
        user.todayStats = user.todayStats || { questions:0, correct:0, minutes:0 };
        user.todayStats.minutes += Math.ceil(timeSpent/60);
        
        const today = new Date().toISOString().split('T')[0];
        user.studyDays = user.studyDays || {};
        user.studyDays[today] = (user.studyDays[today]||0) + Math.ceil(timeSpent/60);
        
        syncUserData(user);
        syncTodayStats();
    }
}

function exitGame() {
    // 清理所有游戏计时器
    if (gameTimer) clearInterval(gameTimer);
    if (gameTimerDisplay) clearInterval(gameTimerDisplay);
    if (snakeGame) clearInterval(snakeGame);
    if (tetrisGame) clearInterval(tetrisGame);
    if (whackTimer) clearInterval(whackTimer);
    if (elimTimer) clearInterval(elimTimer);
    
    // 清理游戏变量
    snakeGame = null;
    tetrisGame = null;
    whackTimer = null;
    elimTimer = null;
    gameTimer = null;
    gameTimerDisplay = null;
    
    // 隐藏游戏容器
    const gameContainer = document.getElementById('game-fullscreen-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    // 清理游戏板
    const board = document.getElementById('game-board');
    if (board) {
        board.innerHTML = '';
        board.style.cssText = '';
    }
    
    // 返回游戏列表
    if (typeof openFullscreenPage === 'function') {
        openFullscreenPage('games');
    }
}

function experimentSelect(idx) {
    const data = window._experimentData;
    if (!data) return;
    const step = data.allSteps[idx];
    const el = document.getElementById('exp-step-' + idx);
    if (!el || step._selected) return;
    
    step._selected = true;
    
    if (step.isCorrect && step.order === data.selected.length) {
        data.selected.push(step);
        data.score++;
        el.style.background = 'rgba(67,233,123,0.5)';
        el.style.cursor = 'default';
    } else if (step.isCorrect && step.order !== data.selected.length) {
        el.style.background = 'rgba(255,200,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    } else {
        el.style.background = 'rgba(255,100,100,0.5)';
        setTimeout(() => { el.style.background = 'rgba(255,255,255,0.7)'; step._selected = false; }, 500);
    }
    
    const cnt = document.getElementById('exp-count');
    if (cnt) cnt.textContent = data.selected.length;
    
    if (data.selected.length >= data.experiment.steps.length) {
        setTimeout(() => showGameOver(data.score * 10 + 20, data.experiment.steps.length * 10 + 20), 500);
    }
}

function findMatches() {
    const matches = new Set();
    // 横向
    for(let r=0;r<6;r++) {
        for(let c=0;c<4;c++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[r*6+c+1]&&v===elimBoard[r*6+c+2]) {
                matches.add(r*6+c);matches.add(r*6+c+1);matches.add(r*6+c+2);
            }
        }
    }
    // 纵向
    for(let c=0;c<6;c++) {
        for(let r=0;r<4;r++) {
            const v = elimBoard[r*6+c];
            if(v>=0&&v===elimBoard[(r+1)*6+c]&&v===elimBoard[(r+2)*6+c]) {
                matches.add(r*6+c);matches.add((r+1)*6+c);matches.add((r+2)*6+c);
            }
        }
    }
    return [...matches];
}

function flipCard(idx, el) {
    if(flipped.length>=2||flipped.includes(idx)||matched>=8) return;
    el.style.transform = 'rotateY(180deg)';
    el.innerHTML = '<span>'+flipCards[idx]+'</span>';
    flipped.push(idx);
    
    if(flipped.length===2) {
        flips++;
        gameScore = flips;
        document.getElementById('game-score').textContent = flips;
        
        if(flipCards[flipped[0]]===flipCards[flipped[1]]) {
            matched++;
            SoundEffects.playCorrect();
            if(matched===8) {
                setTimeout(()=>{
                    gameLevel++;
                    updateGameLevelBadge();
                    startFlipCard();
                },1000);
            }
            flipped = [];
        } else {
            SoundEffects.playWrong();
            setTimeout(()=>{
                const c1 = document.getElementById('flip-'+flipped[0]);
                const c2 = document.getElementById('flip-'+flipped[1]);
                if(c1) {c1.style.transform='';c1.innerHTML='<span style="opacity:0.3;">❓</span>';}
                if(c2) {c2.style.transform='';c2.innerHTML='<span style="opacity:0.3;">❓</span>';}
                flipped = [];
            },800);
        }
    }
}

function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }

function isSolved() {
    for(let i=0;i<15;i++) if(slideBoard[i]!==i+1) return false;
    return slideBoard[15]===0;
}

function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }

function move2048(dir) {
    const old = [...g2048Board];
    const rotate = (b,times) => {let r=[...b];for(let t=0;t<times;t++){const n=Array(16).fill(0);for(let i=0;i<16;i++)n[(3-i%4)*4+i%4]=b[i];r=n;}return r;};
    let b = rotate(g2048Board,dir);
    
    for(let r=0;r<4;r++) {
        let row = b.slice(r*4,r*4+4).filter(v=>v);
        for(let i=0;i<row.length-1;i++) if(row[i]===row[i+1]){row[i]*=2;g2048Score+=row[i];row.splice(i+1,1);}
        while(row.length<4) row.push(0);
        for(let c=0;c<4;c++) b[r*4+c]=row[c];
    }
    
    g2048Board = rotate(b,(4-dir)%4);
    gameScore = g2048Score;
    document.getElementById('game-score').textContent = g2048Score;
    
    if(JSON.stringify(old)!==JSON.stringify(g2048Board)) {
        add2048Tile();
        render2048();
        
        if(g2048Board.includes(2048)) {
            SoundEffects.playComplete();
            setTimeout(()=>{gameLevel++;updateGameLevelBadge();reset2048();},500);
        } else if(g2048Board.every(v=>v!==0)&&!canMove2048()) {
            endGame();
        }
    }
}

function moveSlide(x,y) {
    if((Math.abs(x-slideEmpty.x)===1&&y===slideEmpty.y)||(Math.abs(y-slideEmpty.y)===1&&x===slideEmpty.x)) {
        const idx = y*4+x;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x,y};
        slideMoves++;
        gameScore = slideMoves;
        document.getElementById('game-score').textContent = slideMoves;
        renderSlide();
        
        if(isSolved()) {
            SoundEffects.playComplete();
            gameLevel++;
            updateGameLevelBadge();
            setTimeout(()=>startSlide(),1000);
        }
    }
}

function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }

function networkSelect(idx) {
    const data = window._networkData;
    if (!data) return;
    
    const nodeEl = document.getElementById('net-node-' + idx);
    if (!nodeEl) return;
    
    if (data.selected.length === 0) {
        data.selected = [idx];
        nodeEl.style.background = 'rgba(67,233,123,0.5)';
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第二个节点';
    } else if (data.selected.length === 1) {
        const a = data.selected[0], b = idx;
        if (a === b) { data.selected = []; nodeEl.style.background = 'rgba(255,255,255,0.2)'; return; }
        
        const isCorrect = data.topic.edges.some(e => (e[0]===a && e[1]===b) || (e[0]===b && e[1]===a));
        const nodeA = document.getElementById('net-node-' + a);
        
        if (isCorrect) {
            data.correct++;
            nodeA.style.background = 'rgba(67,233,123,0.3)';
            nodeEl.style.background = 'rgba(67,233,123,0.3)';
        } else {
            nodeA.style.background = 'rgba(255,100,100,0.3)';
            nodeEl.style.background = 'rgba(255,100,100,0.3)';
            setTimeout(() => {
                nodeA.style.background = 'rgba(255,255,255,0.2)';
                nodeEl.style.background = 'rgba(255,255,255,0.2)';
            }, 500);
        }
        
        data.selected = [];
        const el = document.getElementById('net-status');
        if (el) el.textContent = '请选择第一个节点';
        const cnt = document.getElementById('net-count');
        if (cnt) cnt.textContent = data.correct;
        
        if (data.correct >= data.total) {
            setTimeout(() => showGameOver(data.correct * 10 + 20, data.total * 10 + 20), 500);
        }
    }
}

function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }

function numshapeAnswer(idx) {
    const data = window._numshapeData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showNumshapeQuestion();
}

function palaceClick(x, y) {
    const data = window._palaceData;
    if (!data || data.phase !== 'recall') return;
    const idx = data.currentIdx;
    if (idx >= data.items.length) return;
    
    const cell = document.getElementById('palace-' + x + '-' + y);
    if (!cell || cell.textContent) return; // 已占据
    
    const correct = data.positions[idx].x === x && data.positions[idx].y === y;
    if (correct) {
        cell.textContent = data.items[idx];
        cell.style.background = 'rgba(67,233,123,0.3)';
        data.score++;
    } else {
        cell.textContent = '❌';
        cell.style.background = 'rgba(255,100,100,0.3)';
    }
    
    const scoreEl = document.getElementById('palace-score');
    if (scoreEl) scoreEl.textContent = data.score;
    
    data.currentIdx++;
    if (data.currentIdx >= data.items.length) {
        setTimeout(() => showGameOver(data.score * 10 + (data.score === data.items.length ? 20 : 0), data.items.length * 10 + 20), 500);
    } else {
        const itemEl = document.getElementById('palace-current-item');
        if (itemEl) itemEl.textContent = data.items[data.currentIdx];
    }
}

function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }

function processMatches(matches) {
    elimScore += matches.length * 10;
    gameScore = elimScore;
    document.getElementById('game-score').textContent = elimScore;
    document.getElementById('elim-score').textContent = elimScore;
    
    matches.forEach(i => elimBoard[i] = -1);
    
    // 下落
    for(let c=0;c<6;c++) {
        let col = [];
        for(let r=5;r>=0;r--) if(elimBoard[r*6+c]>=0) col.push(elimBoard[r*6+c]);
        while(col.length<6) col.push(Math.floor(Math.random()*6));
        for(let r=5;r>=0;r--) elimBoard[r*6+c] = col[5-r];
    }
    
    setTimeout(()=>{
        const more = findMatches();
        if(more.length>0) processMatches(more);
        else renderElim();
    },300);
}

function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }

function render2048() {
    const container = document.getElementById('g2048-container');
    if(!container) return;
    container.innerHTML = '';
    const colors = {0:'#cdc1b4',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
    g2048Board.forEach((v,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `width:70px;height:70px;background:${colors[v]||'#3c3a32'};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:${v>=1000?20:24}px;font-weight:bold;color:${v<=4?'#776e65':'#fff'};`;
        if(v) cell.textContent = v;
        container.appendChild(cell);
    });
}

function renderElim() {
    const container = document.getElementById('elim-container');
    if(!container) return;
    container.innerHTML = '';
    elimBoard.forEach((c,i)=>{
        const cell = document.createElement('div');
        cell.style.cssText = `aspect-ratio:1;background:${elimColors[c]};border-radius:6px;cursor:pointer;transition:transform 0.2s;min-height:30px;`;
        cell.id = 'elim-'+i;
        cell.onclick = () => clickElim(i);
        container.appendChild(cell);
    });
}

function renderGames(container) {
    const user = getCurrentUserData();
    const gameScores = user?.gameScores || {};
    const gameCounts = user?.gameCounts || {};
    const gameTimes = user?.gameTimes || {};
    
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
        {id:'experiment',icon:'🧪',name:'实验设计',desc:'科学探究',gradient:'linear-gradient(135deg,#89f7fe,#66a6ff)'}
	    ];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎮 认知训练游戏</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">23大认知训练游戏全面提升认知能力！</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${games.map(g => `
                    <div onclick="startGame('${g.id}')" style="background:${g.gradient};color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                        <div style="font-size:28px;margin-bottom:8px;">${g.icon}</div>
                        <div style="font-size:14px;font-weight:600;">${g.name}</div>
                        <div style="font-size:11px;opacity:0.9;margin-top:4px;">${g.desc}</div>
                        ${gameScores[g.id] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores[g.id]}</div>` : ''}
                        <div style="margin-top:8px;font-size:10px;opacity:0.8;">
                            ${gameCounts[g.id] ? `已玩${gameCounts[g.id]}次` : '未开始'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h3 style="margin-bottom:12px;">🎮 娱乐游戏</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">轻松一刻，享受游戏乐趣！</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                <div onclick="startGame('snake')" style="background:linear-gradient(135deg,#43A047,#66BB6A);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🐍</div>
                    <div style="font-size:14px;font-weight:600;">贪吃蛇</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">经典益智</div>
                    ${gameScores['snake'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['snake']}</div>` : ''}
                </div>
                <div onclick="startGame('tetris')" style="background:linear-gradient(135deg,#E53935,#EF5350);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🧱</div>
                    <div style="font-size:14px;font-weight:600;">俄罗斯方块</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">经典益智</div>
                    ${gameScores['tetris'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['tetris']}</div>` : ''}
                </div>
                <div onclick="startGame('flipcard')" style="background:linear-gradient(135deg,#1E88E5,#42A5F5);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🃏</div>
                    <div style="font-size:14px;font-weight:600;">记忆翻牌</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">记忆力挑战</div>
                    ${gameScores['flipcard'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['flipcard']}</div>` : ''}
                </div>
                <div onclick="startGame('slide')" style="background:linear-gradient(135deg,#FB8C00,#FFA726);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔢</div>
                    <div style="font-size:14px;font-weight:600;">数字华容道</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">益智解谜</div>
                    ${gameScores['slide'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['slide']}</div>` : ''}
                </div>
                <div onclick="startGame('g2048')" style="background:linear-gradient(135deg,#EDC22E,#F0D060);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🎮</div>
                    <div style="font-size:14px;font-weight:600;">2048</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">数字合并</div>
                    ${gameScores['g2048'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['g2048']}</div>` : ''}
                </div>
                <div onclick="startGame('whack')" style="background:linear-gradient(135deg,#8E24AA,#AB47BC);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔨</div>
                    <div style="font-size:14px;font-weight:600;">打地鼠</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">反应速度</div>
                    ${gameScores['whack'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['whack']}</div>` : ''}
                </div>
                <div onclick="startGame('linkup')" style="background:linear-gradient(135deg,#00897B,#26A69A);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">🔗</div>
                    <div style="font-size:14px;font-weight:600;">连连看</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">图案配对</div>
                    ${gameScores['linkup'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['linkup']}</div>` : ''}
                </div>
                <div onclick="startGame('eliminate')" style="background:linear-gradient(135deg,#F4511E,#FF7043);color:white;padding:16px;border-radius:16px;cursor:pointer;position:relative;overflow:hidden;">
                    <div style="font-size:28px;margin-bottom:8px;">💎</div>
                    <div style="font-size:14px;font-weight:600;">消消乐</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">宝石消除</div>
                    ${gameScores['eliminate'] ? `<div style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.3);padding:4px 8px;border-radius:12px;font-size:11px;">🏆 ${gameScores['eliminate']}</div>` : ''}
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📊 游戏统计</h4>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#3377FF;">${Object.keys(gameCounts).reduce((sum, k) => sum + (gameCounts[k] || 0), 0)}</div>
                    <div style="font-size:11px;color:#666;">总游戏次数</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#43E97B;">${Object.keys(gameScores).length}</div>
                    <div style="font-size:11px;color:#666;">已解锁游戏</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:20px;font-weight:bold;color:#FF6B6B;">${Object.keys(gameTimes).reduce((sum, k) => sum + Math.round((gameTimes[k] || 0) / 60), 0)}分钟</div>
                    <div style="font-size:11px;color:#666;">总游戏时长</div>
                </div>
            </div>
        </div>
    `;
}

function renderMethod(container) {
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:16px;">💡 学霸方法 <span style="font-size:12px;color:#999;">高效学习技巧</span></h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">掌握科学学习方法，事半功倍！</p>
            
            <!-- 学习方法分类 -->
            <div class="subject-tab" style="flex-wrap:wrap;margin-bottom:16px;">
                <button class="subject-tab-btn active" onclick="filterMethod('all', this)">全部</button>
                <button class="subject-tab-btn" onclick="filterMethod('费曼学习法', this)">费曼学习</button>
                <button class="subject-tab-btn" onclick="filterMethod('番茄工作法', this)">番茄工作</button>
                <button class="subject-tab-btn" onclick="filterMethod('艾宾浩斯', this)">遗忘曲线</button>
                <button class="subject-tab-btn" onclick="filterMethod('思维导图', this)">思维导图</button>
                <button class="subject-tab-btn" onclick="filterMethod('康奈尔', this)">康奈尔</button>
                <button class="subject-tab-btn" onclick="filterMethod('SQ3R', this)">SQ3R</button>
                <button class="subject-tab-btn" onclick="filterMethod('时间管理', this)">时间管理</button>
            </div>
        </div>
        
        <!-- 学习统计 -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#1A6BFF;" id="method-completed">0</div>
                <div style="font-size:12px;color:#666;">已完成</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#4CAF50;" id="method-accuracy">0%</div>
                <div style="font-size:12px;color:#666;">正确率</div>
            </div>
            <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
                <div style="font-size:24px;font-weight:bold;color:#FF9800;" id="method-notes">0</div>
                <div style="font-size:12px;color:#666;">我的笔记</div>
            </div>
        </div>
        
        <!-- 上传笔记区域 -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📤 上传学习笔记</div>
            <div class="upload-zone" onclick="document.getElementById('method-note-input').click()">
                <div class="upload-icon">📝</div>
                <div class="upload-text">点击上传笔记图片</div>
                <div class="upload-hint">支持 JPG、PNG 格式</div>
            </div>
            <input type="file" id="method-note-input" accept="image/*" style="display:none" onchange="handleMethodNoteUpload(this)">
            <div id="method-notes-list" style="margin-top:12px;"></div>
        </div>
        
        <!-- 练习题目区域 -->
        <div id="method-questions-container">
            ${renderMethodQuestions()}
        </div>
    `;
    
    // 更新统计数据
    updateMethodStats();
    // 渲染笔记列表
    renderMethodNotes();
}

function renderMethodNotes() {
    const user = getCurrentUserData();
    const notes = user?.methodNotes || [];
    const listEl = document.getElementById('method-notes-list');
    
    if (!listEl) return;
    
    if (notes.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无笔记</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 个笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.map(note => `
                <div style="position:relative;">
                    <img src="${note.image}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="viewMethodNote('${note.id}')">
                    <button onclick="deleteMethodNote('${note.id}')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMethodQuestions() {
    const questions = [
        {id:'feyman', title:'费曼学习法', icon:'📚', color:'#667eea', count:5},
        {id:'pomodoro', title:'番茄工作法', icon:'🍅', color:'#FF6B6B', count:5},
        {id:'ebbinghaus', title:'艾宾浩斯遗忘曲线', icon:'🧠', color:'#4CAF50', count:5},
        {id:'mindmap', title:'思维导图法', icon:'🗺️', color:'#FF9800', count:5},
        {id:'cornell', title:'康奈尔笔记法', icon:'📝', color:'#9C27B0', count:5},
        {id:'sq3r', title:'SQ3R阅读法', icon:'📖', color:'#00BCD4', count:5},
        {id:'timeManagement', title:'时间管理法', icon:'⏰', color:'#E91E63', count:5}
    ];
    
    return questions.map(q => `
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size:32px;background:${q.color};width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;">${q.icon}</div>
                    <div>
                        <div style="font-size:15px;font-weight:600;">${q.title}</div>
                        <div style="font-size:12px;color:#999;">${q.count}道练习题</div>
                    </div>
                </div>
                <button onclick="startMethodQuiz('${q.id}')" style="background:${q.color};color:white;border:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">开始练习</button>
            </div>
            <div style="background:#f5f7ff;border-radius:8px;padding:12px;">
                <div style="font-size:12px;color:#666;margin-bottom:8px;">练习进度</div>
                <div style="height:6px;background:#e0e0e0;border-radius:3px;">
                    <div style="height:100%;background:${q.color};border-radius:3px;width:0%;" id="progress-${q.id}"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPalaceMemorize(items, positions, timeLeft) {
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 记忆阶段</div>';
    html += '<div id="palace-timer" style="font-size:14px;margin-bottom:12px;color:#ffd700;">⏱️ ' + timeLeft + '秒</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            const idx = positions.findIndex(p => p.x === x && p.y === y);
            if (idx >= 0) {
                html += '<div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:32px;background:rgba(255,255,255,0.2);border-radius:12px;">' + items[idx] + '</div>';
            } else {
                html += '<div style="width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:12px;"></div>';
            }
        }
    }
    html += '</div></div>';
    container.innerHTML = html;
}

function renderPalaceRecall() {
    const data = window._palaceData;
    if (!data) return;
    data.phase = 'recall';
    data.selected = [];
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;width:100%;max-width:360px;">';
    html += '<div style="font-size:18px;font-weight:bold;margin-bottom:8px;">🏛️ 记忆宫殿 - 回忆阶段</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;color:#ffd700;">点击正确的位置放置物品</div>';
    html += '<div style="font-size:28px;margin-bottom:12px;" id="palace-current-item">' + data.items[0] + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px;background:rgba(255,255,255,0.15);border-radius:16px;" id="palace-grid">';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            html += '<div onclick="palaceClick(' + x + ',' + y + ')" style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(255,255,255,0.1);border-radius:12px;cursor:pointer;" id="palace-' + x + '-' + y + '"></div>';
        }
    }
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:14px;">得分: <span id="palace-score">0</span>/' + data.items.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
    data.currentIdx = 0;
}

function renderPomodoro(container) {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    
    container.innerHTML = `
        <div class="card" style="text-align:center;">
            <h3 style="margin-bottom:12px;">🍅 番茄闹钟</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">专注学习，高效时间管理</p>
            
            <div style="width:200px;height:200px;margin:20px auto;border-radius:50%;background:linear-gradient(135deg,#FF6B6B,#FF9A63);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(255,107,107,0.3);">
                <div id="pomodoro-display" style="font-size:48px;font-weight:bold;color:white;">${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}</div>
            </div>
            
            <div style="display:flex;justify-content:center;gap:12px;margin:20px 0;">
                <button onclick="setPomodoroTime(25)" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">25分钟</button>
                <button onclick="setPomodoroTime(15)" style="padding:10px 20px;background:#43E97B;color:white;border:none;border-radius:8px;cursor:pointer;">15分钟</button>
                <button onclick="setPomodoroTime(5)" style="padding:10px 20px;background:#FFD93D;color:#333;border:none;border-radius:8px;cursor:pointer;">5分钟</button>
            </div>
            
            <div style="display:flex;justify-content:center;gap:16px;">
                <button id="pomodoro-start-btn" onclick="togglePomodoro()" style="padding:16px 40px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:18px;font-weight:bold;cursor:pointer;">${pomodoroRunning ? '暂停' : '开始'}</button>
                <button onclick="resetPomodoro()" style="padding:16px 24px;background:#f5f7ff;color:#667eea;border:2px solid #667eea;border-radius:12px;font-size:16px;cursor:pointer;">重置</button>
            </div>
            
            <div style="margin-top:24px;padding:16px;background:#f5f7ff;border-radius:12px;">
                <div style="font-size:14px;color:#666;margin-bottom:8px;">今日专注统计</div>
                <div style="display:flex;justify-content:center;gap:24px;">
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#FF6B6B;" id="pomodoro-count">${getCurrentUserData()?.pomodoroCount || 0}</div>
                        <div style="font-size:12px;color:#666;">番茄数</div>
                    </div>
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#667eea;" id="pomodoro-minutes">${getCurrentUserData()?.pomodoroMinutes || 0}</div>
                        <div style="font-size:12px;color:#666;">专注分钟</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function reset2048() { start2048(); }

function resetGame() { startGame(gameType); }

function reverseAnswer(idx) {
    const data = window._reverseData;
    if (!data) return;
    if (idx === data.questions[data.current].correct) data.score++;
    data.current++;
    showReverseQuestion();
}

function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }

function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }

function showMole() {
    // 隐藏所有
    whackMoles.forEach((_,i)=>{
        const el = document.getElementById('whack-'+i);
        if(el) el.style.bottom = '-50px';
    });
    whackMoles = whackMoles.map(()=>0);
    
    // 显示新的
    const moleSpeed = Math.max(300,800-gameLevel*50);
    const count = Math.min(3,1+Math.floor(gameLevel/2));
    for(let i=0;i<count;i++) {
        setTimeout(()=>{
            const idx = Math.floor(Math.random()*9);
            const el = document.getElementById('whack-'+idx);
            if(el && whackMoles[idx]===0) {
                whackMoles[idx] = 1;
                el.style.bottom = '15px';
                setTimeout(()=>{
                    if(whackMoles[idx]===1) {
                        whackMoles[idx] = 0;
                        el.style.bottom = '-50px';
                    }
                },moleSpeed);
            }
        },i*200);
    }
}

function showNumshapeQuestion() {
    const data = window._numshapeData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#43e97b,#38f9d7)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:12px;">📐 数形结合</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:32px;font-weight:bold;margin:20px 0;padding:16px;background:rgba(255,255,255,0.5);border-radius:16px;">' + q.expr + '</div>';
    html += '<div style="font-size:13px;margin-bottom:12px;">这个函数的图像是什么形状？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="numshapeAnswer(' + i + ')" style="padding:12px;margin:6px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:14px;">' + opt + '</div>';
    });
    html += '<div style="margin-top:12px;font-size:13px;">得分: ' + data.score * 10 + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function showReverseQuestion() {
    const data = window._reverseData;
    if (!data || data.current >= data.total) {
        if (data) showGameOver(data.score * 10, data.total * 10);
        return;
    }
    const q = data.questions[data.current];
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🔄 逆向推理</div>';
    html += '<div style="font-size:14px;margin-bottom:8px;">第 ' + (data.current+1) + '/' + data.total + ' 题</div>';
    html += '<div style="font-size:13px;margin-bottom:4px;">已知结论：</div>';
    html += '<div style="font-size:16px;font-weight:bold;margin:12px 0;padding:12px;background:rgba(255,255,255,0.5);border-radius:12px;">' + q.conclusion + '</div>';
    html += '<div style="font-size:13px;margin-bottom:8px;">哪个条件能推出此结论？</div>';
    q.opts.forEach((opt, i) => {
        html += '<div onclick="reverseAnswer(' + i + ')" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;">' + opt + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }

function showStroopQuestion() {
    const data = window._stroopData;
    if (!data || data.timeLeft <= 0) return;
    
    const wordIdx = Math.floor(Math.random() * data.colors.length);
    const colorIdx = Math.floor(Math.random() * data.colors.length);
    data.correctIdx = colorIdx;
    
    const container = document.getElementById('game-fullscreen');
    let html = '<div style="text-align:center;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🎯 Stroop冲突</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击文字的<strong>书写颜色</strong>，不是文字内容！</div>';
    html += '<div style="font-size:56px;font-weight:bold;margin:20px 0;color:' + data.colors[colorIdx] + ';">' + data.colorNames[wordIdx] + '</div>';
    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">';
    data.colors.forEach((c, i) => {
        html += '<div onclick="stroopAnswer(' + i + ')" style="width:50px;height:50px;border-radius:50%;background:' + c + ';cursor:pointer;border:3px solid rgba(255,255,255,0.3);"></div>';
    });
    html += '</div>';
    html += '<div style="margin-top:16px;font-size:14px;">⏱️ <span id="stroop-timer">' + data.timeLeft + '</span>秒 | 得分: ' + data.score + '/' + data.total + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function shuffleSlide() {
    for(let i=0;i<100;i++) {
        const dirs = [];
        if(slideEmpty.x>0) dirs.push({x:-1,y:0});
        if(slideEmpty.x<3) dirs.push({x:1,y:0});
        if(slideEmpty.y>0) dirs.push({x:0,y:-1});
        if(slideEmpty.y<3) dirs.push({x:0,y:1});
        const d = dirs[Math.floor(Math.random()*dirs.length)];
        const nx = slideEmpty.x + d.x;
        const ny = slideEmpty.y + d.y;
        const idx = ny*4+nx;
        const emptyIdx = slideEmpty.y*4+slideEmpty.x;
        [slideBoard[idx],slideBoard[emptyIdx]] = [slideBoard[emptyIdx],slideBoard[idx]];
        slideEmpty = {x:nx,y:ny};
    }
    renderSlide();
}

function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }

function start2048() {
    document.getElementById('game-title').textContent = '🎮 2048';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="g2048-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;background:#bbada0;border-radius:12px;"></div><div style="text-align:center;margin-top:12px;"><button onclick="reset2048()" style="padding:10px 20px;background:#8f7a66;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    g2048Board = Array(16).fill(0);
    g2048Score = 0;
    add2048Tile();
    add2048Tile();
    render2048();
    
    document.getElementById('game-score').textContent = '0';
    
    // 触屏滑动控制
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(Math.abs(dx)>Math.abs(dy)) {
                move2048(dx>0?2:4); // 右:2, 左:4
            } else {
                move2048(dy>0?1:3); // 下:1, 上:3
            }
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp') move2048(3);
        else if(e.key==='ArrowDown') move2048(1);
        else if(e.key==='ArrowLeft') move2048(4);
        else if(e.key==='ArrowRight') move2048(2);
    });
}

function startAttentionSeq() {
    const sequence = attentionSequence.map((_, i) => i);
    let i = 0;
    const interval = setInterval(() => {
        if (i > 0) {
            const prevEl = document.getElementById('att-item-' + sequence[i-1]);
            if (prevEl) prevEl.textContent = '';
        }
        if (i < sequence.length) {
            const el = document.getElementById('att-item-' + sequence[i]);
            if (el) { el.textContent = attentionSequence[sequence[i]].number; el.style.opacity = '1'; }
            playAudioTone3(400 + i * 50);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                attentionSequence.forEach((_, idx) => {
                    const el = document.getElementById('att-item-' + idx);
                    if (el) { el.textContent = ''; el.style.opacity = '1'; }
                });
                attentionIndex = 0;
            }, 500);
        }
    }, 600);
}

function startAttentionTrack() {
    document.getElementById('game-title').textContent = '🎯 注意力追踪';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const counts = [6, 9, 12, 16, 20];
    const numCount = counts[Math.min(gameLevel - 1, 4)];
    const gridSize = Math.ceil(Math.sqrt(numCount));
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B', '#FF9A9E'];
    attentionSequence = [];
    for (let i = 0; i < numCount; i++) attentionSequence.push({ color: colors[i % colors.length], number: i + 1 });
    attentionSequence = attentionSequence.sort(() => Math.random() - 0.5);
    attentionIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">记住数字顺序，然后按顺序点击：</div><div id="attention-grid" style="display:grid;grid-template-columns:repeat(' + gridSize + ',1fr);gap:8px;margin-bottom:16px;">' + attentionSequence.map((item, i) => '<div id="att-item-' + i + '" style="aspect-ratio:1;background:' + item.color + ';border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;color:white;opacity:0;transition:opacity 0.3s;cursor:pointer;" onclick="clickAttention(' + i + ')"></div>').join('') + '</div><button onclick="startAttentionSeq()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">开始记忆</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

async function startAudioSeq() {
    const freqs = [440, 554, 659];
    for (let i = 0; i < audioSequence.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                playAudioTone3(freqs[audioSequence[i]]);
                const el = document.getElementById('audio-seq-' + i);
                if (el) { el.style.background = '#667eea'; el.style.color = 'white'; }
                setTimeout(resolve, 500);
            }, 500);
        });
    }
}

function startAuditoryTraining() {
    const container = document.getElementById('fullscreen-content');
    const sounds = [
        { freq: 440, name: '标准音A' },
        { freq: 523, name: '高音C' },
        { freq: 659, name: '高音E' },
        { freq: 880, name: '高音A' }
    ];
    
    container.innerHTML = `
        <div class="game-container">
            <h3>🎵 听觉分辨训练</h3>
            <p>仔细聆听音调，点击正确的音符</p>
            <div class="game-area" style="display:flex;justify-content:center;gap:15px;flex-wrap:wrap;padding:20px;">
                ${sounds.map((s, i) => `
                    <button class="sound-btn" onclick="playSound(${s.freq}, ${i})" id="sound-${i}">
                        ${s.name}
                    </button>
                `).join('')}
            </div>
            <div id="auditory-feedback" style="text-align:center;font-size:18px;margin:20px;">点击上方按钮听音调</div>
            <div class="game-stats">
                <div>得分: <span id="auditory-score">0</span></div>
                <div>回合: <span id="auditory-round">0</span>/5</div>
            </div>
        </div>
    `;
    
    let currentTarget = 0;
    let score = 0;
    let round = 0;
    
    function newRound() {
        if (round >= 5) {
            alert(`训练完成！得分: ${score}/5`);
            return;
        }
        currentTarget = Math.floor(Math.random() * 4);
        round++;
        document.getElementById('auditory-round').textContent = round;
        document.getElementById('auditory-feedback').innerHTML = `<span style="color:#667eea;">🎵 听一听这是什么音？</span>`;
        playSound(sounds[currentTarget].freq, -1);
    }
    
    window.playSound = function(freq, btnIndex) {
        // 使用Web Audio API播放音效
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            
            // btnIndex === -1 只播放不检查，btnIndex >= 0 需要检查答案
            if (btnIndex >= 0) {
                if (btnIndex === currentTarget) {
                    score++;
                    document.getElementById('auditory-score').textContent = score;
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#43e97b;">✅ 正确！</span>`;
                } else {
                    document.getElementById('auditory-feedback').innerHTML = `<span style="color:#fa709a;">❌ 错误，正确答案是: ${sounds[currentTarget].name}</span>`;
                }
                setTimeout(newRound, 1500);
            }
        } catch(e) {
            document.getElementById('auditory-feedback').textContent = '浏览器不支持音频功能';
        }
    };
    
    newRound();
}

function startClassification() {
    document.getElementById('game-title').textContent = '📂 分类归纳';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const sets = [
        { cat1: '学习用品', cat2: '生活用品', items1: ['铅笔', '橡皮', '尺子'], items2: ['毛巾', '牙刷', '杯子'] },
        { cat1: '水果', cat2: '蔬菜', items1: ['苹果', '香蕉', '橙子'], items2: ['白菜', '萝卜', '黄瓜'] },
        { cat1: '交通工具', cat2: '学习用品', items1: ['汽车', '火车', '飞机'], items2: ['课本', '作业', '文具盒'] }
    ];
    classifySet = sets[Math.floor(Math.random() * sets.length)];
    const items = [...classifySet.items1, ...classifySet.items2].sort(() => Math.random() - 0.5);
    classifyBox0 = [];
    classifyBox1 = [];
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请将物品分成两类：</div><div id="classify-items" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + items.map((item, i) => '<div onclick="classifyItem(this, \'' + item + '\')" style="padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;">' + item + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px;"><div style="padding:12px;background:rgba(102,126,234,0.1);border-radius:12px;text-align:center;border:2px dashed #667eea;"><div style="font-size:12px;color:#667eea;margin-bottom:8px;">第一类</div><div id="classify-box-0" style="min-height:60px;"></div></div><div style="padding:12px;background:rgba(255,107,107,0.1);border-radius:12px;text-align:center;border:2px dashed #FF6B6B;"><div style="font-size:12px;color:#FF6B6B;margin-bottom:8px;">第二类</div><div id="classify-box-1" style="min-height:60px;"></div></div></div><button onclick="checkClassification()" style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">确认分类</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startColor() {
    const config = gameConfig['color'];
    document.getElementById('game-title').textContent = config?.name || '🌈 颜色识别';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;gap:16px;';
    const colorWords = [
        {w:'红',c:'#FF6B6B'},
        {w:'蓝',c:'#3377FF'},
        {w:'绿',c:'#43E97B'},
        {w:'黄',c:'#FFD93D'},
        {w:'紫',c:'#9B59B6'}
    ];
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 20000) { clearInterval(gameTimer); endGame(); return; }
        const word = colorWords[Math.floor(Math.random()*5)];
        const wrongColor = colorWords.filter(c=>c.c!==word.c)[Math.floor(Math.random()*4)];
        board.innerHTML = `
            <div id="color-word" style="font-size:48px;font-weight:bold;padding:20px;color:${wrongColor.c}">${word.w}</div>
            <div style="display:flex;gap:12px;margin-top:10px;">
                <button onclick="gameScore++;document.getElementById('game-score').textContent=gameScore;SoundEffects.playCorrect();" style="padding:12px 24px;background:#43E97B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✓ 正确</button>
                <button onclick="SoundEffects.playWrong();" style="padding:12px 24px;background:#FF6B6B;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">✗ 错误</button>
            </div>
        `;
    }, 2500);
}

function startConserve() {
    const questions = [
        {q:'将水从矮胖杯倒入高瘦杯，水量如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'体积守恒'},
        {q:'一块橡皮泥从球形捏成长条形，质量如何？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'质量守恒'},
        {q:'弹簧被压缩后，弹性势能和动能之和如何？', opts:['增加','减少','不变','取决于速度'], correct:2, explain:'机械能守恒(无摩擦)'},
        {q:'两车碰撞前后，总动量如何？', opts:['增加','减少','不变','取决于碰撞类型'], correct:2, explain:'动量守恒'},
        {q:'封闭容器内气体被压缩，分子总数如何？', opts:['增加','减少','不变','取决于温度'], correct:2, explain:'粒子数守恒'},
        {q:'化学反应前后，原子总数如何？', opts:['增加','减少','不变','取决于反应类型'], correct:2, explain:'质量守恒'},
        {q:'电路中流入节点的电流和流出的电流关系？', opts:['流入>流出','流入<流出','相等','不确定'], correct:2, explain:'电荷守恒'},
        {q:'自由下落过程中，动能增加量与势能减少量关系？', opts:['增加>减少','增加<减少','相等','不确定'], correct:2, explain:'能量守恒'},
        {q:'两个人分别绕操场跑一圈，位移相同吗？', opts:['相同','不同','取决于速度','取决于方向'], correct:0, explain:'位移只看起终点'},
        {q:'冰融化成水，分子数如何变化？', opts:['增加','减少','不变','无法确定'], correct:2, explain:'粒子数守恒'}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._conserveData = {questions: selected, current: 0, score: 0, total: count};
    showConserveQuestion();
}

function startDiff() {
    const config = gameConfig['diff'];
    document.getElementById('game-title').textContent = config?.name || '🔍 找不同';
    const board = document.getElementById('game-board');
    board.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;';
    const symbols = ['🌟','⭐','🌙','☀️','🔴','🔵'];
    const left = [...symbols]; 
    const right = [...symbols];
    const diffIdx = Math.floor(Math.random()*6);
    right[diffIdx] = ['🟢','🟡','⬜','⬛'][Math.floor(Math.random()*4)];
    board.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${left.map(s=>`<div style="text-align:center;font-size:24px;">${s}</div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px;background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            ${right.map((s,i)=>`<div style="text-align:center;font-size:24px;cursor:pointer;padding:4px;border-radius:4px;" onclick="checkDiff(this,${i},${diffIdx})">${s}</div>`).join('')}
        </div>
    `;
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0/1';
}

function startDigit() {
    const config = gameConfig['digit'];
    document.getElementById('game-title').textContent = config?.name || '🔢 数字记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;';
    const count = 3 + gameLevel;
    const digits = Array.from({length:count},()=>Math.floor(Math.random()*10)).join('');
    board.innerHTML = `<div style="font-size:48px;font-weight:bold;color:#1A6BFF;letter-spacing:8px;">${digits}</div><div style="margin-top:20px;font-size:14px;color:#666;">记住这些数字！</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        board.innerHTML = `<div style="font-size:18px;color:#666;margin-bottom:12px;">请输入你看到的数字：</div><input type="text" id="digit-input" style="width:200px;text-align:center;font-size:24px;padding:12px;border:2px solid #1A6BFF;border-radius:12px;" maxlength="${count}"/><button onclick="checkDigit('${digits}')" style="margin-top:16px;padding:12px 24px;background:#1A6BFF;color:white;border:none;border-radius:12px;font-size:16px;cursor:pointer;">确认</button>`;
    }, 1500+count*200);
}

function startEliminate() {
    document.getElementById('game-title').textContent = '💎 消消乐';
    const board = document.getElementById('game-board');
    board.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;overflow:auto;min-height:0;';
    board.innerHTML = '<div style="text-align:center;margin-bottom:8px;"><span id="elim-timer" style="font-size:20px;font-weight:bold;color:#F4511E;">30</span>秒 | <span id="elim-score" style="font-size:16px;font-weight:bold;">0</span>分</div><div id="elim-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:6px;width:100%;max-width:300px;margin:0 auto;"></div>';
    
    elimScore = 0;
    elimTime = 30;
    elimSelected = null;
    elimBoard = [];
    
    for(let i=0;i<36;i++) elimBoard.push(Math.floor(Math.random()*6));
    renderElim();
    
    document.getElementById('game-score').textContent = '0';
    
    if(elimTimer) clearInterval(elimTimer);
    elimTimer = setInterval(()=>{
        elimTime--;
        document.getElementById('elim-timer').textContent = elimTime;
        if(elimTime<=0) {
            clearInterval(elimTimer);
            elimTimer = null;
            endGame();
        }
    },1000);
}

function startExperiment() {
    const experiments = [
        {title:'验证植物光合作用需要光', steps:['选取两盆相同植物','一盆放暗处一盆放光照下','相同时间后取叶片','碘液检测淀粉','对比结果得出结论'], distractors:['给植物浇水','测量植物高度']},
        {title:'验证空气中有水蒸气', steps:['准备干燥玻璃片','对着玻璃片哈气','观察玻璃片表面','看到水珠形成','得出空气含水蒸气的结论'], distractors:['称量玻璃片质量','加热玻璃片']},
        {title:'验证声音需要介质传播', steps:['准备密封玻璃罩和闹钟','闹钟放入罩内通电响铃','用抽气机逐渐抽出空气','观察声音逐渐减弱','推论真空不能传声'], distractors:['调节闹钟音量','打开窗户']},
        {title:'验证浮力与排开液体体积的关系', steps:['准备弹簧测力计和物体','测空气中物体重力','将物体部分浸入水中读数','将物体全部浸入水中读数','比较两次浮力大小'], distractors:['测量水温','换用不同颜色水']},
        {title:'验证欧姆定律', steps:['搭建含电阻的电路','调节电压到不同值','记录各电压下的电流值','计算电压与电流的比值','比值恒定即验证欧姆定律'], distractors:['测量电阻颜色','断开所有开关']}
    ];
    const expIdx = Math.floor(Math.random() * experiments.length);
    const exp = experiments[expIdx];
    const diff = (getCurrentUserData().difficulty || 1);
    
    // 混入干扰项
    let allSteps = [...exp.steps.map((s,i) => ({text:s, isCorrect:true, order:i}))];
    if (diff >= 2) {
        exp.distractors.forEach(d => allSteps.push({text:d, isCorrect:false, order:-1}));
    }
    allSteps.sort(() => Math.random() - 0.5);
    
    window._experimentData = {experiment: exp, allSteps, selected: [], score: 0};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#89f7fe,#66a6ff)';
    container.style.color = '#333';
    
    let html = '<div style="text-align:center;max-width:340px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🧪 实验设计</div>';
    html += '<div style="font-size:15px;font-weight:bold;margin-bottom:8px;padding:10px;background:rgba(255,255,255,0.5);border-radius:12px;">' + exp.title + '</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">按正确顺序点击步骤（排除干扰项）</div>';
    html += '<div id="exp-steps">';
    allSteps.forEach((s, i) => {
        html += '<div onclick="experimentSelect(' + i + ')" id="exp-step-' + i + '" style="padding:10px;margin:5px 0;background:rgba(255,255,255,0.7);border-radius:12px;cursor:pointer;font-size:13px;text-align:left;">' + s.text + '</div>';
    });
    html += '</div>';
    html += '<div style="margin-top:12px;font-size:13px;">已选: <span id="exp-count">0</span>/' + exp.steps.length + ' 步</div>';
    html += '</div>';
    container.innerHTML = html;
}

function startFlipCard() {
    document.getElementById('game-title').textContent = '🃏 记忆翻牌';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="flip-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;max-width:320px;margin:0 auto;"></div>';
    
    const icons = ['🍎','🍌','🍇','🍓','🌟','🌙','🔥','💎'];
    flipCards = [...icons,...icons].sort(()=>Math.random()-0.5);
    flipped = []; matched = 0; flips = 0;
    
    const container = document.getElementById('flip-container');
    flipCards.forEach((icon,i) => {
        const card = document.createElement('div');
        card.id = 'flip-'+i;
        card.style.cssText = 'width:70px;height:70px;background:linear-gradient(135deg,#1E88E5,#42A5F5);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;transition:transform 0.3s;transform-style:preserve-3d;';
        card.innerHTML = '<span style="opacity:0.3;">❓</span>';
        card.onclick = () => flipCard(i, card);
        container.appendChild(card);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startFocusChallenge() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🎯 专注力挑战</h3>
            <p>在限定时间内，点击所有蓝色方块，避免红色方块</p>
            <div class="game-area" id="focus-game-area" style="position:relative;width:100%;height:350px;background:#1a1a2e;border-radius:12px;overflow:hidden;"></div>
            <div class="game-stats">
                <div>得分: <span id="focus-score">0</span></div>
                <div>时间: <span id="focus-time">30</span>秒</div>
                <div>正确率: <span id="focus-accuracy">100</span>%</div>
            </div>
        </div>
    `;
    
    let score = 0;
    let wrongClicks = 0;
    let timeLeft = 30;
    const gameArea = document.getElementById('focus-game-area');
    
    function spawnTarget() {
        const isGood = Math.random() > 0.3;
        const target = document.createElement('div');
        target.style.cssText = `position:absolute;width:40px;height:40px;border-radius:6px;cursor:pointer;left:${Math.random()*80}%;top:${Math.random()*80}%;`;
        target.style.background = isGood ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#fa709a,#fee140)';
        target.innerHTML = isGood ? '✓' : '✗';
        target.style.color = 'white';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.fontSize = '20px';
        target.style.animation = 'pulse 0.5s ease-in-out';
        
        target.onclick = function() {
            if (isGood) {
                score += 10;
                target.remove();
            } else {
                wrongClicks++;
                score = Math.max(0, score - 5);
            }
            document.getElementById('focus-score').textContent = score;
            updateAccuracy();
        };
        
        gameArea.appendChild(target);
        setTimeout(() => target.remove(), 2000);
    }
    
    function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }
    
    const spawnInterval = setInterval(spawnTarget, 500);
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('focus-time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(spawnInterval);
            clearInterval(timer);
            alert(`🎉 挑战结束！得分: ${score}，正确率: ${document.getElementById('focus-accuracy').textContent}%`);
        }
    }, 1000);
}

function startGame(type) {
    gameType = type;
    gameScore = 0;
    gameLevel = 1;
    
    // 播放开始音效
    SoundEffects.playClick();
    
    closeFullscreenPage();
    
    // 显示元认知预测弹窗
    showMetacognitivePrediction(type, function() {
        // 用户确认预测后启动游戏
        const gameFullscreen = document.getElementById('game-fullscreen-container');
        if (gameFullscreen) gameFullscreen.style.display = 'flex';
        
        const config = gameConfig[type];
        const header = document.getElementById('game-header');
        if (header && config) header.style.background = config.gradient;
        
        const titleEl = document.getElementById('game-title');
        if (titleEl && config) titleEl.textContent = config.name;
        
        const user = getCurrentUserData();
        const bestScore = user?.gameScores?.[type] || 0;
        const bestScoreEl = document.getElementById('game-best-score');
        if (bestScoreEl) bestScoreEl.textContent = bestScore;
        
        const timerEl = document.getElementById('game-timer');
        if (timerEl) timerEl.textContent = '0s';
        
        updateGameLevelBadge();
        
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) scoreEl.textContent = '0';
        
        gameStartTime = Date.now();
        if (gameTimerDisplay) clearInterval(gameTimerDisplay);
        gameTimerDisplay = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            const timerEl2 = document.getElementById('game-timer');
            if (timerEl2) timerEl2.textContent = elapsed + 's';
        }, 1000);
        
        const gf = document.getElementById('game-fullscreen');
        const gb = document.getElementById('game-board');
        if (gf) { gf.style.display = 'none'; gf.innerHTML = ''; }
        if (gb) { gb.style.display = 'flex'; gb.innerHTML = ''; }
        
        // 启动对应游戏
        switch(type) {
            case 'schulte': startSchulte(); break;
            case 'visual': startVisual(); break;
            case 'digit': startDigit(); break;
            case 'pattern': startPattern(); break;
            case 'tap': startTap(); break;
            case 'color': startColor(); break;
            case 'diff': startDiff(); break;
            case 'reason': startReason(); break;
            case 'text': startTextMemory(); break;
            case 'shape': startShapeReason(); break;
            case 'math': startMathCalc(); break;
            case 'space': startSpaceRotate(); break;
            case 'audio': startAudioPosition(); break;
            case 'word': startWordAssociation(); break;
            case 'classify': startClassification(); break;
            case 'attention': startAttentionTrack(); break;
            case 'palace': startPalace(); break;
            case 'stroop': startStroop(); break;
            case 'numshape': startNumshape(); break;
            case 'conserve': startConserve(); break;
            case 'network': startNetwork(); break;
            case 'reverse': startReverse(); break;
            case 'experiment': startExperiment(); break;
            case 'snake': startSnake(); break;
            case 'tetris': startTetris(); break;
            case 'flipcard': startFlipCard(); break;
            case 'slide': startSlide(); break;
            case 'g2048': start2048(); break;
            case 'whack': startWhack(); break;
            case 'linkup': startLinkUp(); break;
            case 'eliminate': startEliminate(); break;
        }
    });
}

function startLinkUp() {
    document.getElementById('game-title').textContent = '🔗 连连看';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="link-container" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:10px;max-width:340px;margin:0 auto;"></div>';
    
    const emojis = ['🍎','🍊','🍋','🍇','🍓','🍒','🥝','🌟','❤️','🔵','💜','💚'];
    linkIcons = emojis.slice(0,18);
    linkBoard = [...linkIcons,...linkIcons].sort(()=>Math.random()-0.5);
    linkSelected = [];
    linkPairs = 0;
    
    const container = document.getElementById('link-container');
    linkBoard.forEach((icon,i)=>{
        const cell = document.createElement('div');
        cell.id = 'link-'+i;
        cell.style.cssText = 'width:50px;height:50px;background:#00897B;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;';
        cell.textContent = icon;
        cell.onclick = () => clickLink(i);
        container.appendChild(cell);
    });
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startMathCalc() {
    document.getElementById('game-title').textContent = '🔢 数学速算';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const difficulties = [{ ops: ['+', '-'], max: 20 }, { ops: ['+', '-'], max: 50 }, { ops: ['+', '-', '×'], max: 12 }, { ops: ['+', '-', '×'], max: 20 }, { ops: ['+', '-', '×', '÷'], max: 20 }];
    const diff = difficulties[Math.min(gameLevel - 1, 4)];
    const op = diff.ops[Math.floor(Math.random() * diff.ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * diff.max) + 1; b = Math.floor(Math.random() * diff.max) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * diff.max) + 5; b = Math.floor(Math.random() * Math.min(a, diff.max)) + 1; answer = a - b; }
    else if (op === '×') { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
    else { b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 1; a = b * answer; }
    mathCorrectAnswer = answer;
    const options = [answer];
    while (options.length < 4) { const wrong = answer + Math.floor(Math.random() * 11) - 5; if (wrong > 0 && wrong !== answer && !options.includes(wrong)) options.push(wrong); }
    options.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:16px;color:#666;margin-bottom:20px;">请快速计算：</div><div style="font-size:36px;font-weight:bold;text-align:center;margin-bottom:24px;color:#333;">' + a + ' ' + op + ' ' + b + ' = ?</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + options.map(o => '<button onclick="checkMathAnswer(' + o + ')" style="padding:20px;font-size:24px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-weight:bold;" id="math-opt-' + o + '">' + o + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startMethodPractice(method) {
    const practice = methodPractices[method];
    if (!practice) return;
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    let html = '<div class="modal-title">' + practice.title + '</div>';
    practice.tasks.forEach((task, i) => {
        html += '<div class="plan-task" onclick="this.classList.toggle(\'completed\')"><div class="task-checkbox" id="task-' + i + '"></div><div class="task-text">' + task + '</div></div>';
    });
    html += '<button class="modal-close" onclick="closeModal()">完成训练</button>';
    content.innerHTML = html;
}

function startMethodQuiz(methodId, page = 0) {
    const questions = methodTrainingQuestions[methodId];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    // 初始化页码
    if (!currentMethodPage[methodId]) currentMethodPage[methodId] = 0;
    if (page !== undefined) currentMethodPage[methodId] = page;
    
    const currentPage = currentMethodPage[methodId];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const methodNames = {
        feyman: '费曼学习法',
        pomodoro: '番茄工作法',
        ebbinghaus: '艾宾浩斯遗忘曲线',
        mindmap: '思维导图法',
        cornell: '康奈尔笔记法',
        sq3r: 'SQ3R阅读法',
        timeManagement: '时间管理法'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${methodNames[methodId]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">
                        第${startIndex + idx + 1}题
                    </div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">
                        ${q.q}
                    </div>
                    <textarea id="method-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                </div>
            `).join('')}
        </div>
        <button onclick="submitMethodAnswers('${methodId}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startMethodQuiz('${methodId}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startMethodTraining(methodId) {
    const questions = getMethodTraining(methodId);
    if (questions.length === 0) { showToast('暂无训练题'); return; }
    const methodNames = {
        feyman:'费曼学习法',pomodoro:'番茄工作法',ebbinghaus:'艾宾浩斯记忆法',
        mindmap:'思维导图法',cornell:'康奈尔笔记法',sq3r:'SQ3R阅读法',
        timeManagement:'时间管理法',noteTaking:'高效笔记法',testStrategy:'考试策略'
    };
    let html = '<div style="max-height:70vh;overflow-y:auto;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:16px;text-align:center;">' + methodNames[methodId] + ' 训练 (' + questions.length + '题)</div>';
    questions.forEach((q, i) => {
        html += '<div class="method-card" style="margin-bottom:16px;">';
        html += '<div style="font-size:14px;font-weight:600;margin-bottom:8px;">' + (i+1) + '. ' + q.q + '</div>';
        html += '<div class="method-content" style="background:#f5f7ff;padding:10px;border-radius:8px;">';
        html += '<strong>参考答案：</strong>' + q.a + '</div></div>';
    });
    html += '</div><button class="login-btn login-btn-primary" onclick="closeDetail()" style="width:100%;">完成训练</button>';
    const contentEl = document.getElementById('detail-content');
    if (contentEl) { contentEl.innerHTML = html; document.getElementById('detail-modal').classList.add('show'); }
}

function startNetwork() {
    const topics = [
        {nodes:['光合作用','二氧化碳','氧气','叶绿体','阳光','葡萄糖'], edges:[[0,1],[0,2],[0,3],[0,4],[0,5]]},
        {nodes:['牛顿','万有引力','苹果','运动定律','力','加速度'], edges:[[0,1],[0,2],[0,3],[4,5],[3,4]]},
        {nodes:['细胞','DNA','蛋白质','基因','染色体','遗传'], edges:[[0,1],[1,3],[1,4],[2,5],[3,4]]},
        {nodes:['水','蒸发','凝结','雨','云','河流'], edges:[[0,1],[1,3],[1,4],[3,2],[4,2],[5,0]]}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const topicIdx = Math.floor(Math.random() * topics.length);
    const topic = topics[topicIdx];
    window._networkData = {topic, selected: [], correct: 0, total: topic.edges.length};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    let html = '<div style="text-align:center;max-width:360px;">';
    html += '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">🕸️ 知识网络</div>';
    html += '<div style="font-size:12px;margin-bottom:12px;">点击两个节点建立连接，找出正确关系</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;">';
    topic.nodes.forEach((n, i) => {
        html += '<div onclick="networkSelect(' + i + ')" id="net-node-' + i + '" style="padding:8px 14px;background:rgba(255,255,255,0.2);border-radius:20px;cursor:pointer;font-size:13px;">' + n + '</div>';
    });
    html += '</div>';
    html += '<div style="font-size:12px;" id="net-status">请选择第一个节点</div>';
    html += '<div style="margin-top:8px;font-size:13px;">已建立: <span id="net-count">0</span>/' + topic.edges.length + '</div>';
    html += '</div>';
    container.innerHTML = html;
}

function startNumshape() {
    const diff = (getCurrentUserData().difficulty || 1);
    const questions = [
        {expr:'y = x', correct:0, opts:['直线(45°)','抛物线(向上)','双曲线','正弦曲线']},
        {expr:'y = x²', correct:1, opts:['直线','抛物线(向上)','抛物线(向下)','V字形']},
        {expr:'y = -x²', correct:2, opts:['直线','抛物线(向上)','抛物线(向下)','双曲线']},
        {expr:'y = |x|', correct:3, opts:['直线','抛物线','双曲线','V字形']},
        {expr:'y = 2x + 1', correct:0, opts:['直线(斜向上)','抛物线','水平线','垂直线']},
        {expr:'y = 1/x', correct:2, opts:['直线','抛物线','双曲线','正弦曲线']},
        {expr:'y = x³', correct:1, opts:['直线','S形曲线','抛物线','双曲线']},
        {expr:'y = √x', correct:0, opts:['半抛物线(右延伸)','抛物线','双曲线','直线']},
        {expr:'y = sin(x)', correct:2, opts:['直线','抛物线','正弦波','方波']},
        {expr:'y = 3', correct:1, opts:['垂直线','水平线','抛物线','斜线']}
    ];
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._numshapeData = {questions: selected, current: 0, score: 0, total: count};
    
    showNumshapeQuestion();
}

function startPalace() {
    const config = CTM.games.palace || {};
    const diff = (getCurrentUserData().difficulty || 1);
    const itemCount = diff <= 2 ? 5 : diff <= 3 ? 7 : 9;
    const memorizeTime = diff <= 2 ? 30 : diff <= 3 ? 20 : 15;
    
    const items = ['📚','🍎','🔑','⭐','🎯','🎈','🎵','🌈','🏆','💡','🎁','🌙','🔔','❤️','🦋','🌸','⚽','🎸'];
    const shuffled = items.sort(() => Math.random() - 0.5).slice(0, itemCount);
    const positions = [];
    const cols = 4, rows = 3;
    for (let i = 0; i < itemCount; i++) {
        let pos;
        do { pos = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
        } while (positions.some(p => p.x === pos.x && p.y === pos.y));
        positions.push(pos);
    }
    
    let gameData = {items: shuffled, positions, phase: 'memorize', selected: [], score: 0};
    window._palaceData = gameData;
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    container.style.color = 'white';
    
    container.innerHTML = '<div style="text-align:center;"><div style="font-size:24px;font-weight:bold;margin-bottom:12px;">🏛️ 记忆宫殿</div><div style="font-size:16px;margin-bottom:20px;">记住每个物品的位置！</div><div style="font-size:48px;">⏳</div><div id="palace-timer" style="font-size:20px;margin-top:12px;">' + memorizeTime + '秒</div></div>';
    
    // 记忆阶段倒计时
    let timeLeft = memorizeTime;
    window._palaceTimer = setInterval(() => {
        timeLeft--;
        const el = document.getElementById('palace-timer');
        if (el) el.textContent = timeLeft + '秒';
        if (timeLeft <= 0) {
            clearInterval(window._palaceTimer);
            renderPalaceRecall();
        }
    }, 1000);
    
    // 先显示物品
    setTimeout(() => renderPalaceMemorize(shuffled, positions, memorizeTime), 100);
}

function startPattern() {
    const config = gameConfig['pattern'];
    document.getElementById('game-title').textContent = config?.name || '🎨 图形记忆';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const emojis = ['🍎','🍊','🍋','🍇','🌸','🌺','⭐','🌙','🔥','💎','🎁','🎈'];
    const count = 4 + gameLevel;
    const selected = emojis.slice(0,count);
    board.innerHTML = selected.map(e => `<div class="game-cell" style="background:#f0f7ff;font-size:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${e}</div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
    setTimeout(() => {
        const shuffled = [...emojis,'🍀','🌈'].slice(0,12).sort(()=>Math.random()-0.5);
        patternCorrect = [...selected]; patternFound = [];
        board.innerHTML = shuffled.map(e => `<div class="game-cell" onclick="checkPattern(this,'${e}')" style="background:white;font-size:24px;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">?</div>`).join('');
    }, 2000+count*300);
}

function startPractice(topicId) {
    showToast('正在加载练习...');
    const topic = topicsMath7.find(t => t.id === topicId) || 
                  topicsEnglish7.find(t => t.id === topicId) ||
                  topicsChinese7.find(t => t.id === topicId);
    if (topic) {
        const container = document.getElementById('fullscreen-content');
        container.innerHTML = `
            <div class="practice-card">
                <div class="practice-question">${topic.q}</div>
                <div class="practice-input">
                    <input type="text" id="practice-answer" placeholder="请输入你的答案" />
                    <button onclick="submitTopicAnswer(${topic.id})">提交</button>
                </div>
                <div id="practice-result"></div>
            </div>
        `;
    }
}

function startReason() {
    const config = gameConfig['reason'];
    document.getElementById('game-title').textContent = config?.name || '🧩 图形推理';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-1'; 
    board.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:250px;gap:16px;';
    const patterns = [
        {seq:['○','○○','○○○'],a:0,opt:['○○○○','○○○','○○○○○']},
        {seq:['△','△△','△△△'],a:1,opt:['△△','△△△','△△△△']},
        {seq:['□','□□','□□□'],a:2,opt:['□□','□□□','□□□□']}
    ];
    const p = patterns[Math.min(gameLevel-1,2)];
    board.innerHTML = `<div style="display:flex;gap:8px;margin-bottom:12px;">${p.seq.map(s=>`<div style="padding:8px 12px;background:#f0f7ff;border-radius:8px;font-size:20px;">${s}</div>`).join('')}<div style="padding:8px 12px;background:#ddd;border-radius:8px;font-size:20px;">？</div></div><div style="display:flex;gap:12px;">${p.opt.map((o,i)=>`<button onclick="checkReason(${i},${p.a})" style="padding:10px 16px;font-size:16px;border:none;border-radius:8px;cursor:pointer;background:${i===0?'#3377FF':i===1?'#FF6B6B':'#43E97B'};color:white;">${o}</button>`).join('')}</div>`;
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startReverse() {
    const questions = [
        {conclusion:'三角形内角和为180°', opts:['三条边等长','任意三角形','直角三角形','等腰三角形'], correct:1},
        {conclusion:'物体加速运动', opts:['合外力为零','合外力不为零','速度为零','质量很大'], correct:1},
        {conclusion:'x²=4', opts:['x必须大于0','x=2或x=-2','x只能是2','x必须是整数'], correct:1},
        {conclusion:'化学反应发生了', opts:['颜色没变','产生新物质','温度不变','体积不变'], correct:1},
        {conclusion:'该数为偶数', opts:['该数能被3整除','该数末位是0,2,4,6,8','该数大于10','该数是质数'], correct:1},
        {conclusion:'植物能进行光合作用', opts:['没有根','有叶绿体','在黑暗中','没有水'], correct:1},
        {conclusion:'分数有意义', opts:['分子为0','分母不为0','分母为0','分子大于分母'], correct:1},
        {conclusion:'水会沸腾', opts:['温度100°C以下','达到沸点且继续加热','在密闭容器中','气压很高'], correct:1},
        {conclusion:'两个力平衡', opts:['大小不等','方向相同','大小相等方向相反','作用在不同物体上'], correct:2},
        {conclusion:'该数为质数', opts:['能被2整除','只能被1和自身整除','是偶数','大于10'], correct:1}
    ];
    const diff = (getCurrentUserData().difficulty || 1);
    const count = diff <= 2 ? 5 : diff <= 3 ? 7 : 10;
    const selected = questions.sort(() => Math.random() - 0.5).slice(0, count);
    window._reverseData = {questions: selected, current: 0, score: 0, total: count};
    showReverseQuestion();
}

function startSchulte() {
    const config = gameConfig['schulte'];
    document.getElementById('game-title').textContent = config?.name || '🎯 舒尔特方格';
    const sizes = [3,4,5,6];
    const size = sizes[Math.min(gameLevel-1,3)];
    const nums = Array.from({length:size*size},(_,i)=>i+1).sort(()=>Math.random()-0.5);
    const board = document.getElementById('game-board');
    board.className = 'game-board size-'+size; 
    board.style.display = 'grid';
    board.innerHTML = nums.map(n => `<div class="game-cell" onclick="checkSchulte(this,${n})" style="background:white;font-size:${28-size*2}px;font-weight:bold;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;">${n}</div>`).join('');
    schulteNext = 1; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => { 
        if (Date.now()-gameStartTime > 20000) { 
            clearInterval(gameTimer); 
            endGame(); 
        } 
    }, 1000);
}

function startShapeReason() {
    document.getElementById('game-title').textContent = '🔷 图形推理';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['●', '■', '▲', '◆', '★'], colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#667eea', '#43E97B'];
    const baseShapes = [];
    for (let i = 0; i < 4; i++) baseShapes.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapePattern = [...baseShapes];
    shapeCorrect = Math.floor(Math.random() * 4);
    const correctAnswer = baseShapes[shapeCorrect];
    shapeOptions = [correctAnswer];
    for (let i = 0; i < 3; i++) shapeOptions.push({ shape: shapes[Math.floor(Math.random() * shapes.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    shapeOptions = shapeOptions.sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">找出规律，预测缺失的图形：</div><div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;">' + shapePattern.map((s, i) => i === shapeCorrect ? '<div style="width:50px;height:50px;border:2px dashed #999;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;">?</div>' : '<div style="width:50px;height:50px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;color:' + s.color + ';">' + s.shape + '</div>').join('') + '</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + shapeOptions.map((s, i) => '<div onclick="checkShapeReason(' + i + ')" style="width:60px;height:60px;background:' + s.color + '20;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="shape-opt-' + i + '">' + s.shape + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startSlide() {
    document.getElementById('game-title').textContent = '🔢 数字华容道';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="slide-container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;max-width:300px;margin:0 auto;"></div><div style="text-align:center;margin-top:16px;"><button onclick="shuffleSlide()" style="padding:10px 24px;background:#FB8C00;color:white;border:none;border-radius:8px;cursor:pointer;">重新开始</button></div>';
    
    slideBoard = [];
    for(let i=1;i<16;i++) slideBoard.push(i);
    slideBoard.push(0);
    slideEmpty = {x:3,y:3};
    slideMoves = 0;
    shuffleSlide();
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startSnake() {
    document.getElementById('game-title').textContent = '🐍 贪吃蛇';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="snake-container" style="display:flex;justify-content:center;align-items:center;height:100%;"><canvas id="snake-canvas" style="border:3px solid #43A047;border-radius:8px;"></canvas></div>';
    
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    const gridSize = 15;
    const gridCount = size / gridSize;
    
    let snake = [{x:5,y:5}];
    let direction = {x:1,y:0};
    let nextDirection = {x:1,y:0};
    let food = {x:10,y:10};
    let score = 0;
    let gameOver = false;
    let speed = 150;
    
    function placeFood() {
        do {
            food = {x:Math.floor(Math.random()*gridCount),y:Math.floor(Math.random()*gridCount)};
        } while (snake.some(s=>s.x===food.x&&s.y===food.y));
    }
    
    function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,size,size);
        
        // 网格线
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=gridCount;i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize,0);
            ctx.lineTo(i*gridSize,size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0,i*gridSize);
            ctx.lineTo(size,i*gridSize);
            ctx.stroke();
        }
        
        // 食物
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2,food.y*gridSize+gridSize/2,gridSize/2-2,0,Math.PI*2);
        ctx.fill();
        
        // 蛇
        snake.forEach((seg,i) => {
            ctx.fillStyle = i===0 ? '#43A047' : '#66BB6A';
            ctx.fillRect(seg.x*gridSize+1,seg.y*gridSize+1,gridSize-2,gridSize-2);
        });
    }
    
    function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }
    
    placeFood();
    draw();
    
    if(snakeGame) clearInterval(snakeGame);
    snakeGame = setInterval(update,speed);
    
    // 触屏控制
    let touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>Math.abs(dy)) {
            if(dx>20&&direction.x!==-1) nextDirection={x:1,y:0};
            else if(dx<-20&&direction.x!==1) nextDirection={x:-1,y:0};
        } else {
            if(dy>20&&direction.y!==-1) nextDirection={x:0,y:1};
            else if(dy<-20&&direction.y!==1) nextDirection={x:0,y:-1};
        }
    });
    
    // 键盘控制
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowUp'&&direction.y!==1) nextDirection={x:0,y:-1};
        else if(e.key==='ArrowDown'&&direction.y!==-1) nextDirection={x:0,y:1};
        else if(e.key==='ArrowLeft'&&direction.x!==1) nextDirection={x:-1,y:0};
        else if(e.key==='ArrowRight'&&direction.x!==-1) nextDirection={x:1,y:0};
    });
    
    score = 0;
}

function startSpaceRotate() {
    document.getElementById('game-title').textContent = '🎲 空间旋转';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const shapes = ['↑', '→', '↓', '←'];
    const original = shapes[Math.floor(Math.random() * shapes.length)];
    const rotations = [0, 90, 180, 270];
    const targetRotation = rotations[Math.floor(Math.random() * rotations.length)];
    const degrees = { '↑': 0, '→': 90, '↓': 180, '←': 270 };
    const getShape = (base, rot) => { const baseDeg = degrees[base]; const newDeg = (baseDeg + rot) % 360; return Object.entries(degrees).find(([_, d]) => d === newDeg)?.[0] || '↑'; };
    const rotatedShape = getShape(original, targetRotation);
    const options = [rotatedShape, ...shapes.filter(s => s !== rotatedShape)].slice(0, 4).sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">原图形旋转后是什么方向？</div><div style="display:flex;gap:24px;justify-content:center;margin-bottom:16px;align-items:center;"><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">原图形</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">' + original + '</div></div><div style="font-size:24px;color:#667eea;">→</div><div style="text-align:center;"><div style="font-size:12px;color:#999;margin-bottom:8px;">旋转' + targetRotation + '°</div><div style="width:70px;height:70px;background:#f5f7ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;">？</div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + options.map((s, i) => '<div onclick="checkSpaceRotate(\'' + s + '\', \'' + rotatedShape + '\')" style="width:60px;height:60px;background:#f5f7ff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;border:2px solid transparent;" id="space-opt-' + i + '">' + s + '</div>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startSpatialMemory() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>🧠 空间记忆挑战</h3>
            <p>记住方块的位置，然后按顺序点击它们</p>
            <div class="game-area" id="spatial-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:320px;margin:0 auto;"></div>
            <div id="spatial-status" style="text-align:center;margin:15px;">关卡: <span id="spatial-level">1</span></div>
            <div class="game-stats">
                <div>正确: <span id="spatial-correct">0</span></div>
                <div>序列: <span id="spatial-sequence">0</span></div>
            </div>
        </div>
    `;
    
    let level = 1;
    let sequence = [];
    let playerSequence = [];
    let showing = false;
    
    function initGrid() {
        const grid = document.getElementById('spatial-grid');
        grid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'spatial-cell';
            cell.style.cssText = 'width:70px;height:70px;background:#e0e0e0;border-radius:8px;cursor:pointer;transition:all 0.3s;';
            cell.dataset.index = i;
            cell.onclick = () => cellClick(i);
            grid.appendChild(cell);
        }
    }
    
    function showSequence() {
        showing = true;
        sequence = [];
        for (let i = 0; i < level + 2; i++) {
            sequence.push(Math.floor(Math.random() * 16));
        }
        
        let i = 0;
        const show = setInterval(() => {
            if (i > 0) {
                document.querySelector(`[data-index="${sequence[i-1]}"]`).style.background = '#e0e0e0';
            }
            if (i < sequence.length) {
                document.querySelector(`[data-index="${sequence[i]}"]`).style.background = '#667eea';
                i++;
            } else {
                clearInterval(show);
                showing = false;
                playerSequence = [];
            }
        }, 600);
    }
    
    function cellClick(index) {
        if (showing) return;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.style.background = '#43e97b';
        setTimeout(() => cell.style.background = '#e0e0e0', 200);
        
        playerSequence.push(index);
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById('spatial-status').innerHTML = '<span style="color:#fa709a;">❌ 错误！重新开始</span>';
            setTimeout(() => { level = 1; showLevel(); }, 1500);
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            document.getElementById('spatial-correct').textContent = parseInt(document.getElementById('spatial-correct').textContent) + 1;
            level++;
            document.getElementById('spatial-level').textContent = level;
            setTimeout(showSequence, 1000);
        }
    }
    
    function showLevel() {
        document.getElementById('spatial-level').textContent = level;
        document.getElementById('spatial-correct').textContent = '0';
        showSequence();
    }
    
    initGrid();
    showLevel();
}

function startStroop() {
    const diff = (getCurrentUserData().difficulty || 1);
    const totalTime = diff <= 2 ? 45 : diff <= 3 ? 30 : 20;
    const colors = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA'];
    const colorNames = ['红色','蓝色','绿色','橙色','紫色'];
    
    window._stroopData = {score: 0, total: 0, timeLeft: totalTime, colors, colorNames};
    
    const container = document.getElementById('game-fullscreen');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.background = 'linear-gradient(135deg,#fa709a,#fee140)';
    container.style.color = 'white';
    
    showStroopQuestion();
    
    window._stroopTimer = setInterval(() => {
        window._stroopData.timeLeft--;
        const el = document.getElementById('stroop-timer');
        if (el) el.textContent = window._stroopData.timeLeft + '秒';
        if (window._stroopData.timeLeft <= 0) {
            clearInterval(window._stroopTimer);
            const d = window._stroopData;
            showGameOver(d.score * 10, d.total * 10);
        }
    }, 1000);
}

function startTap() {
    const config = gameConfig['tap'];
    document.getElementById('game-title').textContent = config?.name || '⚡ 快速点击';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-3'; 
    board.style.cssText = 'display:grid;position:relative;min-height:200px;';
    board.innerHTML = Array(9).fill('<div class="game-cell" style="position:relative;border-radius:8px;"></div>').join('');
    gameScore = 0; 
    document.getElementById('game-score').textContent = '0'; 
    gameStartTime = Date.now();
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (Date.now()-gameStartTime > 10000) { clearInterval(gameTimer); endGame(); return; }
        board.querySelectorAll('.game-cell').forEach(c => c.innerHTML = '');
        const targetCell = board.querySelectorAll('.game-cell')[Math.floor(Math.random()*9)];
        targetCell.innerHTML = '<div onclick="event.stopPropagation();tapTarget(this)" style="width:100%;height:100%;background:#1A6BFF;border-radius:8px;cursor:pointer;"></div>';
    }, 800);
}

function startTetris() {
    document.getElementById('game-title').textContent = '🧱 俄罗斯方块';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div id="tetris-container" style="display:flex;justify-content:center;align-items:center;height:100%;gap:20px;"><canvas id="tetris-canvas" style="border:3px solid #E53935;border-radius:8px;"></canvas><div id="tetris-next" style="padding:10px;background:#fff;border-radius:8px;"><div style="font-size:12px;color:#666;margin-bottom:8px;">下一个</div><canvas id="tetris-next-canvas" width="80" height="80"></canvas></div></div>';
    
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = document.getElementById('tetris-next-canvas');
    const nextCtx = nextCanvas.getContext('2d');
    
    const cols = 10, rows = 16, cellSize = 20;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cols * cellSize * dpr;
    canvas.height = rows * cellSize * dpr;
    canvas.style.width = (cols * cellSize) + 'px';
    canvas.style.height = (rows * cellSize) + 'px';
    ctx.scale(dpr, dpr);
    
    const pieces = [
        {shape:[[1,1,1,1]],color:'#3498db'},
        {shape:[[1,1],[1,1]],color:'#f1c40f'},
        {shape:[[0,1,0],[1,1,1]],color:'#9b59b6'},
        {shape:[[1,0,0],[1,1,1]],color:'#e67e22'},
        {shape:[[0,0,1],[1,1,1]],color:'#1abc9c'},
        {shape:[[1,1,0],[0,1,1]],color:'#e74c3c'},
        {shape:[[0,1,1],[1,1,0]],color:'#2ecc71'}
    ];
    
    let board2d = Array.from({length:rows},()=>Array(cols).fill(0));
    let current = null, nextPiece = null;
    let x = 0, y = 0;
    let score = 0, lines = 0;
    let gameOver = false;
    let speed = 500;
    let lastDrop = Date.now();
    
    function randomPiece() {
        const p = pieces[Math.floor(Math.random()*pieces.length)];
        return {shape:p.shape.map(row=>[...row]),color:p.color};
    }
    
    function drawCell(c, ctx2, x2, y2, color, size2=cellSize) {
        ctx2.fillStyle = color;
        ctx2.fillRect(x2*size2+1,y2*size2+1,size2-2,size2-2);
        ctx2.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2.fillRect(x2*size2+2,y2*size2+2,size2-6,3);
    }
    
    function drawBoard() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
            if(board2d[r][c]) drawCell(null,ctx,c,r,board2d[r][c]);
        }
        ctx.strokeStyle = '#ddd';
        for(let i=0;i<=cols;i++) {ctx.beginPath();ctx.moveTo(i*cellSize,0);ctx.lineTo(i*cellSize,canvas.height);ctx.stroke();}
        for(let i=0;i<=rows;i++) {ctx.beginPath();ctx.moveTo(0,i*cellSize);ctx.lineTo(canvas.width,i*cellSize);ctx.stroke();}
    }
    
    function drawCurrent() {
        if(!current) return;
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) drawCell(null,ctx,x+ci,y+ri,current.color);
        }));
    }
    
    function drawNext() {
        nextCtx.fillStyle = '#fff';
        nextCtx.fillRect(0,0,80,80);
        if(!nextPiece) return;
        const sz = 18;
        nextPiece.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(ci*sz+2,ri*sz+2,sz-4,sz-4);
            }
        }));
    }
    
    function canMove(shape, nx, ny) {
        for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) {
            if(shape[r][c]) {
                if(nx+c<0||nx+c>=cols||ny+r>=rows) return false;
                if(ny+r>=0&&board2d[ny+r][nx+c]) return false;
            }
        }
        return true;
    }
    
    function lockPiece() {
        current.shape.forEach((row,ri) => row.forEach((cell,ci) => {
            if(cell) board2d[y+ri][x+ci] = current.color;
        }));
        
        let cleared = 0;
        for(let r=rows-1;r>=0;r--) {
            if(board2d[r].every(c=>c)) {
                board2d.splice(r,1);
                board2d.unshift(Array(cols).fill(0));
                cleared++;
                r++;
            }
        }
        
        if(cleared>0) {
            lines += cleared;
            score += cleared * 100 * cleared;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            if(lines%10===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(100,speed-30);
            }
        }
        
        current = nextPiece;
        nextPiece = randomPiece();
        x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
        y = 0;
        drawNext();
        
        if(!canMove(current.shape,x,y)) {
            gameOver = true;
            clearInterval(tetrisGame);
            endGame();
        }
    }
    
    function rotate(shape) {
        const rows2 = shape.length, cols2 = shape[0].length;
        const rotated = Array.from({length:cols2},()=>Array(rows2).fill(0));
        for(let r=0;r<rows2;r++) for(let c=0;c<cols2;c++) rotated[c][rows2-1-r] = shape[r][c];
        return rotated;
    }
    
    function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }
    
    current = randomPiece();
    nextPiece = randomPiece();
    x = Math.floor(cols/2) - Math.floor(current.shape[0].length/2);
    y = 0;
    drawNext();
    
    if(tetrisGame) clearInterval(tetrisGame);
    tetrisGame = setInterval(tick,speed);
    
    let touchStartX = 0, touchStartY = 0;
    board.addEventListener('touchstart',e=>{
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    board.addEventListener('touchend',e=>{
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if(Math.abs(dx)>30||Math.abs(dy)>30) {
            if(dy<-30) { // 上滑旋转
                const rotated = rotate(current.shape);
                if(canMove(rotated,x,y)) current.shape = rotated;
            } else if(dy>30) { // 下滑加速
                while(canMove(current.shape,x,y+1)) y++;
            } else if(dx>30) {
                if(canMove(current.shape,x+1,y)) x++;
            } else if(dx<-30) {
                if(canMove(current.shape,x-1,y)) x--;
            }
        }
    });
    
    document.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'&&canMove(current.shape,x-1,y)) x--;
        else if(e.key==='ArrowRight'&&canMove(current.shape,x+1,y)) x++;
        else if(e.key==='ArrowDown'&&canMove(current.shape,x,y+1)) y++;
        else if(e.key==='ArrowUp') {
            const rotated = rotate(current.shape);
            if(canMove(rotated,x,y)) current.shape = rotated;
        }
    });
    
    score = 0; lines = 0;
}

function startTextMemory() {
    document.getElementById('game-title').textContent = '📝 文字记忆';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const wordCounts = [4, 5, 6, 7, 8];
    const count = wordCounts[Math.min(gameLevel - 1, 4)];
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    textMemoryWords = allWords.sort(() => Math.random() - 0.5).slice(0, count);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请记住以下词语：</div><div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">' + textMemoryWords.map(w => '<span style="background:#667eea;color:white;padding:8px 14px;border-radius:8px;font-size:14px;">' + w + '</span>').join('') + '</div><button onclick="textMemoryStartTest()" style="width:100%;padding:14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">我记住了，开始测试</button></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function startThinkingQuiz(type, page = 0) {
    const questions = thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

function startVisual() {
    const config = gameConfig['visual'];
    document.getElementById('game-title').textContent = config?.name || '👁️ 视觉搜索';
    const board = document.getElementById('game-board');
    board.className = 'game-board size-4'; 
    board.style.display = 'grid';
    const targetIdx = Math.floor(Math.random()*16);
    const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFD93D'];
    const targetColor = colors[Math.floor(Math.random()*colors.length)];
    const baseColor = colors.filter(c=>c!==targetColor)[Math.floor(Math.random()*4)];
    board.innerHTML = Array.from({length:16},(_,i)=>`<div class="game-cell" onclick="checkVisual(this,${i},${targetIdx},'${targetColor}')" style="background:${i===targetIdx?targetColor:baseColor};border-radius:8px;cursor:pointer;"></div>`).join('');
    gameScore = 0; document.getElementById('game-score').textContent = '0';
}

function startVisualTracking() {
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div class="game-container">
            <h3>👁️ 视觉追踪训练</h3>
            <p>请用眼睛追踪移动的目标，保持注意力集中</p>
            <div class="game-area" id="visual-game-area" style="position:relative;width:100%;height:300px;background:#f5f5f5;border-radius:12px;overflow:hidden;">
                <div id="tracking-target" style="position:absolute;width:40px;height:40px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);"></div>
            </div>
            <div class="game-stats">
                <div>用时: <span id="visual-time">0</span>秒</div>
                <div>追踪次数: <span id="visual-count">0</span></div>
            </div>
            <button class="btn-primary" onclick="startVisualTracking()">开始训练</button>
        </div>
    `;
    
    let count = 0;
    let startTime = Date.now();
    const target = document.getElementById('tracking-target');
    const area = document.getElementById('visual-game-area');
    
    target.onmouseenter = function() {
        count++;
        document.getElementById('visual-count').textContent = count;
    };
    
    function moveTarget() {
        const x = Math.random() * (area.offsetWidth - 40);
        const y = Math.random() * (area.offsetHeight - 40);
        target.style.transition = 'all 0.5s';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }
    
    moveTarget();
    const interval = setInterval(moveTarget, 1500);
    setTimeout(() => {
        clearInterval(interval);
        const time = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('visual-time').textContent = time;
        alert(`训练完成！追踪了 ${count} 次，用时 ${time} 秒`);
    }, 30000);
}

function startWhack() {
    document.getElementById('game-title').textContent = '🔨 打地鼠';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.innerHTML = '<div style="text-align:center;margin-bottom:16px;"><span id="whack-timer" style="font-size:24px;font-weight:bold;color:#8E24AA;">30</span>秒</div><div id="whack-container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px;max-width:320px;margin:0 auto;"></div>';
    
    whackMoles = Array(9).fill(0);
    whackTimeLeft = 30;
    whackActive = 0;
    
    const container = document.getElementById('whack-container');
    for(let i=0;i<9;i++) {
        const hole = document.createElement('div');
        hole.style.cssText = 'width:80px;height:80px;background:#8B4513;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;';
        hole.innerHTML = '<div id="whack-'+i+'" style="position:absolute;bottom:-50px;width:50px;height:50px;background:#D2691E;border-radius:50%;transition:bottom 0.15s;font-size:32px;text-align:center;line-height:50px;">🐹</div>';
        hole.onclick = () => whackMole(i);
        container.appendChild(hole);
    }
    
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
    
    if(whackTimer) clearInterval(whackTimer);
    whackTimer = setInterval(()=>{
        whackTimeLeft--;
        document.getElementById('whack-timer').textContent = whackTimeLeft;
        
        if(whackTimeLeft<=0) {
            clearInterval(whackTimer);
            whackTimer = null;
            endGame();
        } else {
            showMole();
        }
    },1000);
}

function startWordAssociation() {
    document.getElementById('game-title').textContent = '💬 词汇联想';
    const board = document.getElementById('game-board');
    board.style.display = 'block';
    board.style.textAlign = 'center';
    const categories = [
        { name: '水果', words: ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓'] },
        { name: '动物', words: ['狗', '猫', '鸟', '鱼', '兔子', '猴子'] },
        { name: '颜色', words: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色'] },
        { name: '职业', words: ['医生', '老师', '警察', '厨师', '司机', '护士'] }
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const target = cat.words[Math.floor(Math.random() * cat.words.length)];
    const correct = cat.words.filter(w => w !== target);
    const otherWords = categories.filter(c => c.name !== cat.name).flatMap(c => c.words).sort(() => Math.random() - 0.5).slice(0, 3);
    const wordOptions = [...correct.slice(0, 3), ...otherWords].sort(() => Math.random() - 0.5);
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">哪个词与"' + target + '"属于同一类别？</div><div style="font-size:20px;font-weight:bold;text-align:center;margin-bottom:20px;color:#667eea;">' + target + '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">' + wordOptions.map((w, i) => '<button onclick="checkWordAssoc(\'' + w + '\', \'' + cat.name + '\')" style="padding:16px;background:#f5f7ff;border:2px solid #ddd;border-radius:12px;cursor:pointer;font-size:14px;font-weight:500;">' + w + '</button>').join('') + '</div></div>';
    gameScore = 0;
    document.getElementById('game-score').textContent = '0';
}

function stroopAnswer(idx) {
    const data = window._stroopData;
    if (!data) return;
    data.total++;
    if (idx === data.correctIdx) data.score++;
    showStroopQuestion();
}

function tapTarget(el) { 
    el.style.background = '#43E97B'; 
    gameScore++; 
    document.getElementById('game-score').textContent = gameScore; 
    SoundEffects.playClick(); // 点击音效
}

function textMemoryCheck(answeredYes) {
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    const currentWord = testWords[textMemoryIndex];
    const wasInMemory = textMemoryWords.includes(currentWord);
    if (answeredYes === wasInMemory) { gameScore++; document.getElementById('game-score').textContent = gameScore; SoundEffects.playCorrect(); }
    else { SoundEffects.playWrong(); }
    textMemoryIndex++;
    if (textMemoryIndex >= testWords.length) {
        const board = document.getElementById('game-board');
        board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;text-align:center;"><div style="font-size:48px;margin-bottom:16px;">' + (gameScore >= testWords.length * 0.7 ? '🎉' : '👍') + '</div><div style="font-size:20px;font-weight:bold;margin-bottom:8px;">正确 ' + gameScore + '/' + testWords.length + '</div><button onclick="textMemoryNext()" style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">再来一次</button></div>';
    } else {
        document.getElementById('text-memory-word').textContent = testWords[textMemoryIndex];
    }
}

function textMemoryNext() { if (gameLevel < 5) { gameLevel++; updateGameLevelBadge(); } startTextMemory(); }

function textMemoryStartTest() {
    const board = document.getElementById('game-board');
    const allWords = ['苹果', '香蕉', '电脑', '书本', '桌子', '椅子', '窗户', '门', '天空', '大地', '海洋', '山峰', '河流', '森林', '沙漠', '草原', '城市', '乡村', '学校', '医院', '商店', '工厂', '车站', '机场'];
    const distractors = allWords.filter(w => !textMemoryWords.includes(w)).sort(() => Math.random() - 0.5).slice(0, textMemoryWords.length);
    const testWords = [...textMemoryWords, ...distractors].sort(() => Math.random() - 0.5);
    textMemoryIndex = 0;
    board.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:320px;"><div style="font-size:14px;color:#666;margin-bottom:16px;">请判断这些词是否在刚才的记忆中：</div><div id="text-memory-word" style="font-size:24px;font-weight:bold;text-align:center;margin-bottom:20px;color:#333;">' + testWords[0] + '</div><div style="display:flex;gap:12px;"><button onclick="textMemoryCheck(true)" style="flex:1;padding:14px;background:#43E97B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✓ 见过</button><button onclick="textMemoryCheck(false)" style="flex:1;padding:14px;background:#FF6B6B;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✗ 没见</button></div></div>';
}

function tick() {
        if(gameOver) return;
        if(!canMove(current.shape,x,y+1)) {
            lockPiece();
        } else {
            y++;
        }
        drawBoard();
        drawCurrent();
    }

function unclassifyItem(el, item, box) {
    el.remove();
    if (box === 0) classifyBox0 = classifyBox0.filter(i => i !== item);
    else classifyBox1 = classifyBox1.filter(i => i !== item);
    const itemsDiv = document.getElementById('classify-items');
    if (itemsDiv) {
        const newEl = document.createElement('div');
        newEl.style.cssText = 'padding:10px 16px;background:#f5f7ff;border:2px solid #ddd;border-radius:10px;cursor:pointer;font-size:14px;';
        newEl.textContent = item;
        newEl.onclick = function() { classifyItem(this, item); };
        itemsDiv.appendChild(newEl);
    }
}

function update() {
        if(gameOver) return;
        direction = nextDirection;
        const head = {x:snake[0].x+direction.x,y:snake[0].y+direction.y};
        
        if(head.x<0||head.x>=gridCount||head.y<0||head.y>=gridCount||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            clearInterval(snakeGame);
            snakeGame = null;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            endGame();
            return;
        }
        
        snake.unshift(head);
        if(head.x===food.x&&head.y===food.y) {
            score++;
            gameScore = score;
            document.getElementById('game-score').textContent = score;
            SoundEffects.playCorrect();
            placeFood();
            if(score%5===0) {
                gameLevel++;
                updateGameLevelBadge();
                speed = Math.max(50,speed-10);
                clearInterval(snakeGame);
                snakeGame = setInterval(update,speed);
            }
        } else {
            snake.pop();
        }
        draw();
    }

function updateAccuracy() {
        const total = score / 10 + wrongClicks;
        const acc = total > 0 ? Math.round((score / 10) / total * 100) : 100;
        document.getElementById('focus-accuracy').textContent = acc;
    }

function updateGameLevelBadge() {
    const badge = document.getElementById('game-level-badge');
    if (badge) badge.textContent = '关卡 ' + gameLevel;
}

function updateTrainCount(count) {
    const user = getCurrentUserData();
    if (user) {
        user.trainCount = parseInt(count);
        syncUserData(user);
        showToast('已设置每日训练 ' + count + ' 次');
    }
}

function whackMole(idx) {
    if(whackMoles[idx]===1) {
        whackMoles[idx] = 0;
        const el = document.getElementById('whack-'+idx);
        if(el) el.style.bottom = '-50px';
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        SoundEffects.playCorrect();
    }
}

// ============================================================
// Window Exports - 游戏模块
// ============================================================
window.startGame = startGame;
window.exitGame = exitGame;
window.resetGame = resetGame;
window.checkSchulte = checkSchulte;
window.clickAttention = clickAttention;
window.startAttentionSeq = startAttentionSeq;
window.checkDigit = checkDigit;
window.checkPattern = checkPattern;
window.checkMathAnswer = checkMathAnswer;
window.checkVisual = checkVisual;
window.textMemoryStartTest = textMemoryStartTest;
window.textMemoryCheck = textMemoryCheck;
window.textMemoryNext = textMemoryNext;
window.checkWordAssoc = checkWordAssoc;
window.classifyItem = classifyItem;
window.unclassifyItem = unclassifyItem;
window.checkClassification = checkClassification;
window.checkDiff = checkDiff;
window.checkReason = checkReason;
window.checkShapeReason = checkShapeReason;
window.checkSpaceRotate = checkSpaceRotate;
window.playSound = playSound;
window.shuffleSlide = shuffleSlide;
window.tapTarget = tapTarget;
window.reset2048 = reset2048;
window.whackMole = whackMole;
window.networkSelect = networkSelect;
window.experimentSelect = experimentSelect;
window.startClassification = startClassification;
window.startVisualTracking = startVisualTracking;
window.clickLink = clickLink;
window.flipCard = flipCard;
window.closeGame = closeGame;
window.updateGameLevelBadge = updateGameLevelBadge;
window.updateTrainCount = updateTrainCount;
window.numshapeAnswer = numshapeAnswer;
window.reverseAnswer = reverseAnswer;
window.stroopAnswer = stroopAnswer;
window.palaceClick = palaceClick;

// ========== 缺失的window导出补全 ==========
window.startMethodQuiz = startMethodQuiz;
window.submitMethodAnswers = submitMethodAnswers;
window.startThinkingQuiz = startThinkingQuiz;
window.submitThinkingAnswers = submitThinkingAnswers;
window.selectThinkingOpt = selectThinkingOpt;
window.filterMethod = filterMethod;
// 查看笔记函数
function viewMethodNote(noteId) {
    console.log('查看笔记:', noteId);
    alert('笔记详情功能开发中...');
}
// 删除笔记函数
function deleteMethodNote(noteId) {
    console.log('删除笔记:', noteId);
    if (confirm('确定删除这条笔记吗？')) {
        alert('笔记已删除');
    }
}
window.viewMethodNote = viewMethodNote;
window.deleteMethodNote = deleteMethodNote;

// 关闭详情弹窗
function closeDetail() {
    const el = document.getElementById('detail-modal');
    if (el) el.classList.remove('show');
}
// 关闭通用弹窗
function closeModal() {
    const modal = document.getElementById('game-over-modal');
    if (modal) modal.style.display = 'none';
    const overlay = document.getElementById('meta-predict-overlay');
    if (overlay) overlay.remove();
}
// 提交母题答案
function submitTopicAnswer(topicId, answerIndex) {
    console.log('提交答案:', topicId, answerIndex);
    alert('答案提交功能开发中...');
}
// 提交学霸方法答案
function submitMethodAnswers(methodId) {
    console.log('提交方法答案:', methodId);
    alert('测试提交成功！');
}
// 提交思维训练答案
function submitThinkingAnswers(type) {
    console.log('提交思维答案:', type);
    alert('测试提交成功！');
}
// 选择思维训练选项
function selectThinkingOpt(optIndex) {
    console.log('选择选项:', optIndex);
}
// 过滤学霸方法
function filterMethod(category, btn) {
    console.log('过滤方法:', category);
    // 切换激活状态
    document.querySelectorAll('.subject-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

window.closeDetail = closeDetail;
window.closeModal = closeModal;
window.submitTopicAnswer = submitTopicAnswer;
window.submitMethodAnswers = submitMethodAnswers;
window.submitThinkingAnswers = submitThinkingAnswers;
window.selectThinkingOpt = selectThinkingOpt;
window.filterMethod = filterMethod;


// ====== 元认知预测功能 ======
var currentPrediction = 0;

function showMetacognitivePrediction(gameType, callback) {
    var user = getCurrentUserData();
    var config = gameConfig[gameType];
    var bestScore = (user && user.gameScores && user.gameScores[gameType]) || 0;
    var gameCounts = (user && user.gameCounts && user.gameCounts[gameType]) || 0;
    var isFirstTime = gameCounts === 0;
    var predictions = (user && user.metacognitive && user.metacognitive.predictions) || [];
    var lastPred = 50;
    for (var i = predictions.length - 1; i >= 0; i--) {
        if (predictions[i].gameType === gameType) { lastPred = predictions[i].predicted || 50; break; }
    }
    var avgScore = gameCounts > 0 ? Math.round(bestScore / Math.max(1, gameCounts)) : 0;
    var gameName = (config && config.name) || '游戏';
    
    var overlay = document.createElement('div');
    overlay.id = 'meta-predict-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:6000;display:flex;align-items:center;justify-content:center;';
    
    overlay.innerHTML = '<div style="background:white;border-radius:20px;padding:28px 24px;width:90%;max-width:360px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);">' +
        '<div style="font-size:40px;margin-bottom:12px;">🧠</div>' +
        '<div style="font-size:18px;font-weight:700;color:#333;margin-bottom:4px;">元认知预测</div>' +
        '<div style="font-size:14px;color:#667eea;margin-bottom:20px;">' + gameName + '</div>' +
        (isFirstTime ? '<div style="background:#fff8e1;border-radius:10px;padding:10px;margin-bottom:16px;font-size:13px;color:#f57c00;">🎯 首次挑战，大胆预测！</div>' : '') +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">' +
        '<div style="background:#f0f4ff;border-radius:10px;padding:10px 8px;"><div style="font-size:11px;color:#999;">最高分</div><div style="font-size:18px;font-weight:700;color:#667eea;">' + bestScore + '</div></div>' +
        '<div style="background:#f0fff4;border-radius:10px;padding:10px 8px;"><div style="font-size:11px;color:#999;">平均分</div><div style="font-size:18px;font-weight:700;color:#43e97b;">' + (avgScore || '-') + '</div></div>' +
        '<div style="background:#fff0f6;border-radius:10px;padding:10px 8px;"><div style="font-size:11px;color:#999;">已玩</div><div style="font-size:18px;font-weight:700;color:#fa709a;">' + gameCounts + '次</div></div>' +
        '</div>' +
        '<div style="margin-bottom:24px;">' +
        '<div style="font-size:13px;color:#666;margin-bottom:10px;">预测你这次能得多少分？</div>' +
        '<input type="range" id="meta-prediction-input" min="0" max="500" value="' + lastPred + '" oninput="document.getElementById(\'meta-prediction-value\').textContent=this.value" style="width:100%;height:6px;-webkit-appearance:none;background:linear-gradient(90deg,#667eea,#fa709a);border-radius:3px;outline:none;">' +
        '<div style="display:flex;justify-content:space-between;margin-top:6px;"><span style="font-size:11px;color:#999;">0</span><span id="meta-prediction-value" style="font-size:20px;font-weight:700;color:#667eea;">' + lastPred + '</span><span style="font-size:11px;color:#999;">500</span></div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
        '<button id="meta-skip-btn" style="flex:1;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">跳过</button>' +
        '<button id="meta-confirm-btn" style="flex:1;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">开始挑战</button>' +
        '</div></div>';
    
    document.body.appendChild(overlay);
    
    document.getElementById('meta-confirm-btn').onclick = function() {
        var input = document.getElementById('meta-prediction-input');
        currentPrediction = parseInt(input && input.value) || 0;
        var ol = document.getElementById('meta-predict-overlay');
        if (ol) ol.remove();
        callback();
    };
    document.getElementById('meta-skip-btn').onclick = function() {
        currentPrediction = 0;
        var ol = document.getElementById('meta-predict-overlay');
        if (ol) ol.remove();
        callback();
    };
}
window.showMetacognitivePrediction = showMetacognitivePrediction;
window.currentPrediction = currentPrediction;

function showGameOver(score, total) {
    var modal = document.getElementById('modal');
    var content = document.getElementById('modal-content');
    if (!modal || !content) return;
    content.innerHTML = '<div class="modal-title">🎮 游戏结束</div>' +
        '<div style="text-align:center;padding:20px;">' +
            '<div style="font-size:36px;font-weight:bold;color:#667eea;">' + score + ' / ' + total + '</div>' +
            '<div style="font-size:14px;color:#666;margin-top:8px;">正确率: ' + (total > 0 ? Math.round(score/total*100) : 0) + '%</div>' +
        '</div>' +
        '<button onclick="closeModal()" class="login-btn login-btn-primary">确定</button>';
    modal.classList.add('show');
}
window.showGameOver = showGameOver;


// ===== js/modules/ai.js =====
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
    const apiKey = localStorage.getItem('deepseek_api_key') || 'sk-8413f72a3f084fb08c84389555a76d37';
    
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


// ===== js/modules/deepseek.js =====
// 版本: V152
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

function escapeHtml(text) {
    if (!text) return '';
    var d = document.createElement('div'); d.textContent = text; return d.innerHTML;
}
window.escapeHtml = escapeHtml;

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
        showToast('正在识别图片...');
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
        showToast('正在识别图片...');
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
        if (data.usage) recordDeepSeekCall(data.usage.total_tokens);
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
        if (data.usage) recordDeepSeekCall(data.usage.total_tokens);
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
    showToast('🎤 请点击输入框，使用键盘上的语音按钮说话', 4000);
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
                bubbles[bubbles.length-1].innerHTML = formatAIResponse(dsResult.content) + '<button onclick="speakText(this.parentElement.textContent)" style="margin-top:8px;padding:4px 8px;background:#f0f0f0;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button>';
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
    showToast(mode === 'fast' ? '🚀 快速模式：省token、响应快' : '💎 专家模式：完整上下文、回答详细');
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
    if (!msg && !currentDeepSeekImage) { showToast('请输入问题或上传图片'); return; }
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
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:6px;cursor:pointer;">💳 充值硅基流动</button>';
                } else if (result.type === 'balance') {
                    bubbles[bubbles.length - 1].innerHTML = '⚠️ ' + result.message + '<br><button onclick="showAPIRechargeModal()" style="margin-top:8px;padding:6px 12px;background:linear-gradient(135deg,#667eea,#4facfe);color:white;border:none;border-radius:6px;cursor:pointer;">💳 充值</button>';
                } else {
                    bubbles[bubbles.length - 1].innerHTML = '❌ 抱歉，' + result.message;
                }
            }
        } else {
            const responseContent = result.content;
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].innerHTML = formatAIResponse(responseContent) + 
                    '<button onclick="speakText(this.parentElement.querySelector(\'.ai-text\').textContent || this.parentElement.textContent)" style="margin-top:8px;padding:4px 8px;background:#f0f0f0;border:none;border-radius:4px;font-size:11px;cursor:pointer;">🔊 朗读</button>';
            }
            deepseekConversationHistory.push({role: 'assistant', content: responseContent});
            saveDeepSeekConversation();
            recordDeepSeekCall(Math.ceil(responseContent.length / 4));
            const dsUser = getCurrentUserData();
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
    showToast('AI分析功能开发中');
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
                '<button onclick="openDeepSeekRecharge()" style="padding:6px 14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">充值</button>' +
            '</div>' +
        '</div>' +
        '<div style="padding:12px;margin-bottom:8px;background:#f0fff4;border-radius:10px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;">' +
                '<div>' +
                    '<div style="font-size:14px;font-weight:600;color:#333;">硅基流动</div>' +
                    '<div style="font-size:11px;color:#999;">图片识别 🎁送14元</div>' +
                '</div>' +
                '<button onclick="openSiliconFlowRecharge()" style="padding:6px 14px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">充值</button>' +
            '</div>' +
        '</div>' +
        '<button onclick="closeModal()" style="width:100%;padding:10px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:13px;cursor:pointer;">关闭</button>';
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
                '<div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="toggleDeepSeekHistory()" title="点击查看聊天历史">' +
                    '<div style="width:32px;height:32px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(102,126,234,0.3);">🤖</div>' +
                    '<div><div style="font-size:13px;font-weight:600;color:#333;">DeepSeek AI 助手</div><div style="font-size:10px;color:#999;">智能学习助手 · 点击看历史</div></div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<div style="font-size:10px;color:#999;">余额 <span id="ds-balance" style="color:#43a047;font-weight:600;">¥' + balance + '</span></div>' +
        '<button onclick="openApiConfigModal(\'deepseek\')" style="padding:4px 8px;background:#f0f0f0;color:#666;border:none;border-radius:6px;font-size:11px;cursor:pointer;">配置</button>' +
        '<button onclick="showAPIRechargeModal()" style="padding:4px 8px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">充值</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
        // 聊天区
        '<div id="deepseek-messages" style="flex:1;overflow-y:auto;padding:10px;font-size:13px;"></div>' +
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
}
window.renderDeepseek = renderDeepseek;

function updateDeepSeekBalance() {
    var apiKey = (typeof DEEPSEEK_API_KEY !== 'undefined' && DEEPSEEK_API_KEY) ? DEEPSEEK_API_KEY : 
                 localStorage.getItem('deepseek_api_key') || '';
    if (!apiKey) {
        var user = getCurrentUserData();
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
    showToast('历史已清空');
}
window.clearAllDeepSeekHistory = clearAllDeepSeekHistory;

function openApiConfigModalBridge(type) {
    if (typeof openApiConfigModal === 'function') { openApiConfigModal(type); return; }
    var key = prompt('请输入 DeepSeek API Key:');
    if (key && key.trim()) {
        try { var c = JSON.parse(localStorage.getItem('api_config') || '{}'); c.deepseek = key.trim(); localStorage.setItem('api_config', JSON.stringify(c)); } catch(e) {}
        localStorage.setItem('deepseek_api_key', key.trim());
        updateDeepSeekBalance();
        showToast('API Key 已保存');
    }
}
window.openApiConfigModal = window.openApiConfigModal || openApiConfigModalBridge;

function getSavedDeepSeekChats() {
    try { return JSON.parse(localStorage.getItem('ds_saved_chats') || '[]'); }
    catch(e) { return []; }
}

function saveCurrentDeepSeekChat() {
    if (!deepseekConversationHistory || deepseekConversationHistory.length === 0) {
        showToast('当前没有对话可保存'); return;
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
    showToast('对话已保存');
}
window.saveCurrentDeepSeekChat = saveCurrentDeepSeekChat;

function loadSavedDeepSeekChat(index) {
    var saved = getSavedDeepSeekChats();
    if (!saved[index]) return;
    deepseekConversationHistory = saved[index].messages || [];
    saveDeepSeekConversation();
    restoreDeepSeekChatHistory();
    toggleDeepSeekHistory();
    showToast('已加载: ' + saved[index].title);
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
    showToast('新对话已开始');
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


// ===== js/modules/wrongbook.js =====
// 版本: V151

// ============================================================
// 错题本主页
// ============================================================

function renderWrongbook(container) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const photoCount = user?.uploadedImages?.length || 0;
    
    container.innerHTML = `
        <div class="wrongbook-header">
            <div class="wrongbook-title">📒 错题本</div>
            <div class="wrongbook-subtitle">收录错题，拍照识别或手动输入，AI帮你分析</div>
        </div>
        
        <div class="wrongbook-stats">
            <div class="stat-card stat-red">
                <div class="stat-num">${wrongNotes.length}</div>
                <div class="stat-label">错题总数</div>
            </div>
            <div class="stat-card stat-green">
                <div class="stat-num">${photoCount}</div>
                <div class="stat-label">错题照片</div>
            </div>
            <div class="stat-card stat-blue">
                <div class="stat-num">${wrongNotes.filter(n => n.reviewed).length}</div>
                <div class="stat-label">已复习</div>
            </div>
        </div>
        
        <div class="wrongbook-actions">
            <button class="action-btn action-btn-red" onclick="openWrongPhotoCapture()">
                <span class="action-icon">📝</span>
                <span class="action-text">添加错题</span>
            </button>
            <button class="action-btn action-btn-purple" onclick="showWrongPhotoGallery()">
                <span class="action-icon">📁</span>
                <span class="action-text">照片库(${photoCount})</span>
            </button>
        </div>
        
        ${wrongNotes.length === 0 ? `
            <div class="wrongbook-empty">
                <div class="empty-icon">📝</div>
                <div class="empty-title">暂无错题，继续加油！</div>
                <div class="empty-desc">做错题会自动收录，也可以拍照识别或手动输入</div>
            </div>
        ` : `
            <div class="wrongbook-list-header">
                <span class="list-title">错题列表</span>
                <button class="review-all-btn" onclick="reviewAllWrongNotes()">📝 重练全部</button>
            </div>
            <div class="wrongbook-list">
                ${wrongNotes.map((note, i) => `
                    <div class="wrong-note-card" data-index="${i}">
                        <div class="note-header">
                            <span class="note-source" style="background:${getSourceColor(note.source)}">${note.sourceName || '练习'}</span>
                            <span class="note-status ${note.reviewed ? 'status-reviewed' : 'status-pending'}">
                                ${note.reviewed ? '✅ 已复习' : '❌ 未复习'}
                            </span>
                        </div>
                        <div class="note-question">${note.question}</div>
                        <div class="note-answers">
                            <span class="your-answer">你的答案：${note.userAnswer}</span>
                            <span class="correct-answer">正确答案：${note.answer}</span>
                        </div>
                        ${note.explanation ? '<div class="note-explanation">💡 ' + note.explanation.substring(0, 60) + '...</div>' : ''}
                        <div class="note-actions">
                            <button class="note-btn btn-retry" onclick="retryWrongNote(${i})">🔄 重练</button>
                            <button class="note-btn btn-ai" onclick="analyzeWrongNoteWithAI(${i})">🤖 AI分析</button>
                            <button class="note-btn btn-delete" onclick="removeWrongNote(${i})">🗑 删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
        
        <style>
            .wrongbook-header { padding: 16px; text-align: center; }
            .wrongbook-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px; }
            .wrongbook-subtitle { font-size: 13px; color: #999; }
            
            .wrongbook-stats { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 16px; }
            .stat-card { flex: 1; text-align: center; padding: 12px 8px; border-radius: 12px; }
            .stat-red { background: linear-gradient(135deg, #fff5f5, #ffe0e0); }
            .stat-green { background: linear-gradient(135deg, #f0fff0, #d4edda); }
            .stat-blue { background: linear-gradient(135deg, #f5f7ff, #e3f2fd); }
            .stat-num { font-size: 22px; font-weight: bold; }
            .stat-red .stat-num { color: #FF6B6B; }
            .stat-green .stat-num { color: #43E97B; }
            .stat-blue .stat-num { color: #667eea; }
            .stat-label { font-size: 11px; color: #666; margin-top: 2px; }
            
            .wrongbook-actions { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 16px; }
            .action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; 
                padding: 14px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
            .action-btn-red { background: linear-gradient(135deg, #FF6B6B, #FF9A63); color: white; }
            .action-btn-purple { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .action-icon { font-size: 18px; }
            
            .wrongbook-empty { text-align: center; padding: 40px 20px; background: #f9f9f9; border-radius: 16px; margin: 0 16px; }
            .empty-icon { font-size: 48px; margin-bottom: 12px; }
            .empty-title { font-size: 16px; color: #666; margin-bottom: 4px; }
            .empty-desc { font-size: 12px; color: #999; }
            
            .wrongbook-list-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; }
            .list-title { font-size: 15px; font-weight: 600; color: #333; }
            .review-all-btn { padding: 8px 16px; background: #43E97B; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
            
            .wrongbook-list { padding: 0 16px 20px; }
            
            .wrong-note-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
            .note-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .note-source { font-size: 11px; padding: 2px 8px; border-radius: 10px; color: white; }
            .note-status { font-size: 11px; }
            .status-reviewed { color: #43E97B; }
            .status-pending { color: #FF6B6B; }
            .note-question { font-size: 14px; color: #333; margin-bottom: 8px; line-height: 1.5; }
            .note-answers { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
            .your-answer { font-size: 12px; color: #FF6B6B; }
            .correct-answer { font-size: 12px; color: #43E97B; }
            .note-explanation { font-size: 11px; color: #666; margin-bottom: 8px; }
            .note-actions { display: flex; gap: 8px; flex-wrap: wrap; }
            .note-btn { padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
            .btn-retry { background: #667eea; color: white; }
            .btn-ai { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .btn-delete { background: #FF6B6B; color: white; }
        `;
}

// 获取来源颜色
function getSourceColor(source) {
    const colors = {
        'topic': '#FF9800',
        'method': '#2196F3',
        'thinking': '#9C27B0',
        'photo': '#E91E63',
        'manual': '#00BCD4'
    };
    return colors[source] || '#666';
}

// ============================================================
// 拍照上传错题（整合OCR+AI分析）
// ============================================================

function openWrongPhotoCapture() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    const photoCount = getCurrentUserData()?.uploadedImages?.length || 0;
    
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">📝 添加错题</div>
            <button class="close-btn" onclick="closeModal()" style="margin-left:auto;background:#f5f5f5;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div class="capture-container">
            <div class="capture-icon">📝</div>
            <div class="capture-hint">拍照自动识别文字，或手动输入题目</div>
            <div class="capture-tips">
                <div class="tip">💡 拍照后自动OCR识别为文字</div>
                <div class="tip">💡 也可以直接打字输入题目</div>
            </div>
            <div class="capture-buttons">
                <button class="capture-btn capture-btn-camera" onclick="document.getElementById('wrong-photo-camera').click()">
                    📷 拍照
                </button>
                <input type="file" id="wrong-photo-camera" accept="image/*" capture="environment" style="display:none" onchange="uploadWrongPhotoWithAI(this)"/>
                
                <button class="capture-btn capture-btn-gallery" onclick="document.getElementById('wrong-photo-gallery').click()">
                    🖼️ 从相册选择
                </button>
                <input type="file" id="wrong-photo-gallery" accept="image/*" style="display:none" onchange="uploadWrongPhotoWithAI(this)"/>
                
                <button class="capture-btn" onclick="manualInputWrongNote()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
                    ✏️ 手动输入题目
                </button>
            </div>
        </div>
        <div class="capture-footer">
            <div class="photo-count">📁 我的错题照片 (${photoCount})</div>
            <button class="footer-btn" onclick="showWrongPhotoGallery()">查看照片库</button>
        </div>
        
        <style>
            .modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .back-btn { background: #f5f5f5; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; cursor: pointer; color: #666; }
            .modal-title { font-size: 18px; font-weight: bold; color: #333; }
            
            .capture-container { text-align: center; padding: 20px; background: #f9f9f9; border-radius: 16px; margin-bottom: 16px; }
            .capture-icon { font-size: 64px; margin-bottom: 12px; }
            .capture-hint { font-size: 15px; color: #666; margin-bottom: 16px; }
            .capture-tips { margin-bottom: 20px; }
            .tip { font-size: 12px; color: #999; margin-bottom: 4px; }
            
            .capture-buttons { display: flex; flex-direction: column; gap: 10px; }
            .capture-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .capture-btn-camera { background: linear-gradient(135deg, #FF6B6B, #FF9A63); color: white; }
            .capture-btn-gallery { background: #667eea; color: white; }
            
            .capture-footer { text-align: center; }
            .photo-count { font-size: 12px; color: #999; margin-bottom: 8px; }
            .footer-btn { background: #f5f5f5; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; color: #666; cursor: pointer; }
        </style>
    `;
}

// V150: 手动输入错题
// ============================================================
function manualInputWrongNote() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 返回</button>
            <div class="modal-title">✏️ 手动输入题目</div>
            <button class="close-btn" onclick="closeModal()" style="margin-left:auto;background:#f5f5f5;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div style="padding:4px 0;">
            <div style="margin-bottom:12px;">
                <label style="font-size:13px;color:#666;margin-bottom:6px;display:block;">题目内容</label>
                <textarea id="manual-question-input" style="width:100%;height:120px;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:14px;resize:none;box-sizing:border-box;" placeholder="请输入题目内容，例如：&#10;一个三角形的三边长分别为3、4、5，求这个三角形的面积。"></textarea>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:13px;color:#666;margin-bottom:6px;display:block;">正确答案（可选）</label>
                <input id="manual-answer-input" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:12px;font-size:14px;box-sizing:border-box;" placeholder="输入正确答案"/>
            </div>
            <button onclick="submitManualWrongNote()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">📝 AI分析并保存</button>
        </div>
    `;
}

// V150: 提交手动输入的错题
async function submitManualWrongNote() {
    var questionInput = document.getElementById('manual-question-input');
    var answerInput = document.getElementById('manual-answer-input');
    if (!questionInput || !questionInput.value.trim()) {
        showToast('请输入题目内容');
        return;
    }
    var questionText = questionInput.value.trim();
    var answerText = answerInput ? answerInput.value.trim() : '';
    
    // 调用AI解析
    var questionData = await aiParseQuestion(questionText + (answerText ? '\n正确答案：' + answerText : ''));
    
    if (questionData.error) {
        // AI解析失败，直接保存原始文字
        var user = getCurrentUserData() || {};
        user.wrongNotes = user.wrongNotes || [];
        var wrongNote = {
            wrongKey: 'manual-' + Date.now(),
            source: 'manual',
            sourceName: '手动输入',
            topicId: null,
            question: questionText,
            type: 'fill',
            options: [],
            answer: answerText || '待分析',
            explanation: 'AI解析失败，请手动查看',
            userAnswer: '',
            ocrText: questionText,
            time: Date.now()
        };
        user.wrongNotes.push(wrongNote);
        syncUserData(user);
        showToast('✅ 已保存到错题本');
        backToWrongbook();
        return;
    }
    
    // AI解析成功，保存结构化题目
    var user = getCurrentUserData() || {};
    user.wrongNotes = user.wrongNotes || [];
    var wrongKey = 'manual-' + Date.now();
    if (!user.wrongNotes.find(function(n) { return n.wrongKey === wrongKey; })) {
        var wrongNote = {
            wrongKey: wrongKey,
            source: 'manual',
            sourceName: '手动输入',
            topicId: null,
            question: questionData.question,
            type: questionData.type,
            options: questionData.options ? Object.values(questionData.options) : [],
            optionsMap: questionData.options || {},
            answer: questionData.answer,
            correctIndex: getCorrectIndex(questionData.options, questionData.answer),
            explanation: questionData.explanation,
            userAnswer: '',
            ocrText: questionText,
            time: Date.now()
        };
        user.wrongNotes.push(wrongNote);
        syncUserData(user);
    }
    showToast('✅ AI分析完成，已保存到错题本');
    backToWrongbook();
}

window.manualInputWrongNote = manualInputWrongNote;
window.submitManualWrongNote = submitManualWrongNote;

// 拍照上传错题（整合OCR+AI分析）- 完整流程
async function uploadWrongPhotoWithAI(input) {
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const photoId = 'photo_' + Date.now();
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    // 显示预览和进度
    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageData = e.target.result;
        
        // 显示处理中界面
        content.innerHTML = `
            <div class="processing-header">
                <button class="back-btn" onclick="openWrongPhotoCapture()">← 取消</button>
            </div>
            <div class="processing-container">
                <img src="${imageData}" class="preview-image" id="processing-preview"/>
                <div class="progress-section">
                    <div class="progress-step" id="step-ocr">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">OCR识别中...</span>
                    </div>
                    <div class="progress-step" id="step-ai">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">AI解析中...</span>
                    </div>
                    <div class="progress-step" id="step-save">
                        <span class="step-icon">⏳</span>
                        <span class="step-text">保存中...</span>
                    </div>
                </div>
            </div>
            
            <style>
                .processing-header { margin-bottom: 16px; }
                .processing-container { text-align: center; }
                .preview-image { width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 20px; background: #f5f5f5; }
                .progress-section { background: #f9f9f9; border-radius: 12px; padding: 16px; }
                .progress-step { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #eee; }
                .progress-step:last-child { border-bottom: none; }
                .step-icon { font-size: 18px; }
                .step-text { font-size: 14px; color: #666; }
                .step-done .step-icon { color: #43E97B; }
                .step-error .step-icon { color: #FF6B6B; }
            </style>
        `;
        
        try {
            // 1. 保存图片到 IndexedDB
            updateStepStatus('step-save', 'saving');
            await saveImageFile(photoId, file);
            
            // 记录到用户数据（只存元信息，不存base64）
            const user = getCurrentUserData() || {};
            user.uploadedImages = user.uploadedImages || [];
            user.uploadedImages.push({
                id: photoId,
                imageId: photoId,  // IndexedDB中的ID
                topicId: null,
                source: 'photo',
                time: Date.now()
            });
            syncUserData(user);
            updateStepStatus('step-save', 'done');
            
            // 2. OCR 识别
            updateStepStatus('step-ocr', 'doing');
            let ocrText;
            try {
                ocrText = await ocrExtractText(imageData, function(status, progress) {
                    const stepEl = document.getElementById('step-ocr');
                    if (stepEl) stepEl.querySelector('.step-text').textContent = 'OCR识别中 ' + progress + '%';
                });
            } catch(ocrErr) {
                console.warn('OCR失败，尝试使用DeepSeek视觉:', ocrErr);
                // OCR失败时，尝试直接用DeepSeek视觉API
                ocrText = null;
            }
            
            if (!ocrText || ocrText.length < 5) {
                // OCR没识别到文字，尝试用视觉API
                const visionResult = await callVisionAPI(imageData, '请描述这张图片中的题目内容，尽可能完整地提取所有文字');
                if (visionResult.success) {
                    ocrText = visionResult.content;
                }
            }
            
            updateStepStatus('step-ocr', 'done');
            
            if (!ocrText || ocrText.length < 5) {
                // 仍然没有识别到文字
                showOcrFailedUI(photoId, imageData, '未能识别出文字，请重试或手动输入题目');
                return;
            }
            
            // 3. AI 解析题目
            updateStepStatus('step-ai', 'doing');
            const questionData = await aiParseQuestion(ocrText);
            updateStepStatus('step-ai', 'done');
            
            if (questionData.error) {
                showOcrFailedUI(photoId, imageData, 'AI解析失败: ' + questionData.error);
                return;
            }
            
            // 4. 添加到错题本
            const wrongKey = 'photo-' + photoId;
            user.wrongNotes = user.wrongNotes || [];
            
            // 避免重复添加
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                const wrongNote = {
                    wrongKey: wrongKey,
                    source: 'photo',
                    sourceName: '拍照错题',
                    topicId: null,
                    photoId: photoId,
                    question: questionData.question,
                    type: questionData.type,
                    options: questionData.options ? Object.values(questionData.options) : [],
                    optionsMap: questionData.options || {},
                    answer: questionData.answer,
                    correctIndex: getCorrectIndex(questionData.options, questionData.answer),
                    explanation: questionData.explanation,
                    userAnswer: '',
                    ocrText: ocrText,
                    time: Date.now()
                };
                user.wrongNotes.push(wrongNote);
                syncUserData(user);
            }
            
            // 显示成功结果
            showOcrSuccessUI(questionData, photoId);
            
        } catch(error) {
            console.error('OCR处理失败:', error);
            showOcrFailedUI(photoId, imageData, '处理失败: ' + error.message);
        }
    };
    reader.readAsDataURL(file);
    input.value = '';
}

// 更新步骤状态
function updateStepStatus(stepId, status) {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;
    
    const iconEl = stepEl.querySelector('.step-icon');
    const textEl = stepEl.querySelector('.step-text');
    
    if (status === 'doing') {
        iconEl.textContent = '🔄';
        textEl.style.color = '#667eea';
        stepEl.classList.add('step-doing');
    } else if (status === 'done') {
        iconEl.textContent = '✅';
        textEl.style.color = '#43E97B';
        stepEl.classList.remove('step-doing');
        stepEl.classList.add('step-done');
    } else if (status === 'saving') {
        iconEl.textContent = '💾';
        textEl.textContent = '保存图片...';
    } else if (status === 'error') {
        iconEl.textContent = '❌';
        textEl.style.color = '#FF6B6B';
        stepEl.classList.add('step-error');
    }
}

// 获取正确答案的索引
function getCorrectIndex(optionsMap, answer) {
    if (!optionsMap) return -1;
    for (const [key, val] of Object.entries(optionsMap)) {
        if (val === answer) {
            return ['A', 'B', 'C', 'D'].indexOf(key);
        }
    }
    return -1;
}

// 显示OCR成功结果
function showOcrSuccessUI(questionData, photoId) {
    const content = document.getElementById('detail-content');
    const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
    
    content.innerHTML = `
        <div class="success-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 继续拍照</button>
            <div class="modal-title">✅ 识别成功</div>
        </div>
        
        <div class="success-container">
            <div class="success-icon">🎉</div>
            <div class="success-message">已识别并添加到错题本</div>
            
            <div class="question-preview">
                <div class="q-type">${qTypeNames[questionData.type] || '题目'}</div>
                <div class="q-text">${questionData.question}</div>
                ${questionData.options ? `
                    <div class="q-options">
                        ${Object.entries(questionData.options).map(([k, v]) => `<div class="q-option">${k}. ${v}</div>`).join('')}
                    </div>
                ` : ''}
                <div class="q-answer">正确答案：${questionData.answer}</div>
            </div>
            
            <div class="success-actions">
                <button class="action-btn action-primary" onclick="doWrongQuestionFromPhoto('${photoId}')">
                    📝 开始做题
                </button>
                <button class="action-btn action-secondary" onclick="backToWrongbook()">
                    📒 查看错题本
                </button>
            </div>
        </div>
        
        <style>
            .success-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .success-container { text-align: center; }
            .success-icon { font-size: 64px; margin-bottom: 12px; }
            .success-message { font-size: 16px; color: #43E97B; font-weight: 600; margin-bottom: 20px; }
            
            .question-preview { background: #f9f9f9; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
            .q-type { font-size: 12px; color: #667eea; margin-bottom: 8px; }
            .q-text { font-size: 14px; color: #333; margin-bottom: 12px; line-height: 1.5; }
            .q-options { margin-bottom: 12px; }
            .q-option { font-size: 13px; color: #666; padding: 4px 0; }
            .q-answer { font-size: 13px; color: #43E97B; font-weight: 600; }
            
            .success-actions { display: flex; flex-direction: column; gap: 10px; }
            .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .action-secondary { background: #f5f5f5; color: #666; }
        </style>
    `;
}

// 显示OCR失败结果
function showOcrFailedUI(photoId, imageData, message) {
    const content = document.getElementById('detail-content');
    
    content.innerHTML = `
        <div class="failed-header">
            <button class="back-btn" onclick="openWrongPhotoCapture()">← 重新拍照</button>
            <div class="modal-title">⚠️ 识别失败</div>
        </div>
        
        <div class="failed-container">
            <img src="${imageData}" class="failed-image"/>
            <div class="failed-message">${message}</div>
            
            <div class="failed-tips">
                <div class="tip-title">💡 提高识别率的方法：</div>
                <div class="tip">• 确保光线充足，避免反光</div>
                <div class="tip">• 保持手机稳定，对焦清晰</div>
                <div class="tip">• 尽量拍摄正面，避免倾斜</div>
            </div>
            
            <button class="action-btn action-primary" onclick="openWrongPhotoCapture()">
                🔄 重新拍照
            </button>
        </div>
        
        <style>
            .failed-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .failed-container { text-align: center; }
            .failed-image { width: 100%; max-height: 200px; object-fit: contain; border-radius: 12px; margin-bottom: 16px; background: #f5f5f5; }
            .failed-message { font-size: 14px; color: #FF6B6B; margin-bottom: 16px; }
            .failed-tips { background: #fff9e6; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
            .tip-title { font-size: 13px; color: #ff9500; margin-bottom: 8px; }
            .tip { font-size: 12px; color: #666; margin-bottom: 4px; }
            .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        </style>
    `;
}

// 从照片做题目
async function doWrongQuestionFromPhoto(photoId) {
    const user = getCurrentUserData();
    const note = user?.wrongNotes?.find(n => n.photoId === photoId);
    
    if (!note) {
        showToast('题目不存在');
        return;
    }
    
    // 找到索引
    const index = user.wrongNotes.indexOf(note);
    if (index >= 0) {
        retryWrongNote(index);
    }
}

// ============================================================
// 照片库
// ============================================================

function showWrongPhotoGallery() {
    const user = getCurrentUserData() || {};
    const photos = user.uploadedImages || [];
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    if (photos.length === 0) {
        content.innerHTML = `
            <div class="gallery-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">📁 错题照片库</div>
            </div>
            <div class="gallery-empty">
                <div class="empty-icon">📂</div>
                <div class="empty-title">暂无错题照片</div>
                <div class="empty-desc">开始拍照上传吧！</div>
            </div>
            <button class="action-btn action-primary" onclick="openWrongPhotoCapture()">📷 拍照上传</button>
            
            <style>
                .gallery-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .gallery-empty { text-align: center; padding: 40px 20px; }
                .empty-icon { font-size: 64px; margin-bottom: 12px; }
                .empty-title { font-size: 16px; color: #666; margin-bottom: 4px; }
                .empty-desc { font-size: 13px; color: #999; }
                .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 16px; }
                .action-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            </style>
        `;
        return;
    }
    
    // 加载图片
    let photosHtml = '';
    let loadedCount = 0;
    let totalCount = photos.length;
    
    photos.forEach(function(p, idx) {
        const photoId = p.imageId || p.id;
        
        // 默认显示loading占位图
        photosHtml += `<div class="photo-item" id="photo-item-${photoId}" data-index="${idx}">
            <div class="photo-placeholder">
                <div class="loading-spinner"></div>
            </div>
            <button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>
        </div>`;
    });
    
    content.innerHTML = `
        <div class="gallery-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">📁 错题照片库 (${photos.length}张)</div>
        </div>
        <button class="add-photo-btn" onclick="openWrongPhotoCapture()">+ 添加照片</button>
        <div class="photo-grid" id="photo-grid">
            ${photosHtml}
        </div>
        <button class="back-bottom-btn" onclick="backToWrongbook()">← 返回错题本</button>
        
        <style>
            .gallery-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .add-photo-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 16px; }
            .photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 400px; overflow-y: auto; margin-bottom: 16px; }
            .photo-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #f0f0f0; cursor: pointer; }
            .photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
            .loading-spinner { width: 24px; height: 24px; border: 3px solid #e0e0e0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
            .photo-item img { width: 100%; height: 100%; object-fit: cover; }
            .photo-delete-btn { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; font-size: 14px; cursor: pointer; line-height: 24px; }
            .back-bottom-btn { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
    
    // 异步加载图片
    photos.forEach(async function(p, idx) {
        const photoId = p.imageId || p.id;
        const itemEl = document.getElementById('photo-item-' + photoId);
        if (!itemEl) return;
        
        try {
            let imageUrl = null;
            
            // 优先从IndexedDB读取
            if (typeof getImageFileAsDataUrl === 'function') {
                imageUrl = await getImageFileAsDataUrl(photoId);
            }
            
            // 如果没有，尝试旧的base64格式
            if (!imageUrl && p.image) {
                imageUrl = p.image;
            }
            
            if (imageUrl) {
                itemEl.innerHTML = `<img src="${imageUrl}" onclick="analyzePhotoWithAI('${photoId}')"/>` +
                    `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>` +
                    `<button class="photo-ai-btn" onclick="event.stopPropagation(); analyzePhotoWithAI('${photoId}')">🤖 AI识别</button>`;
            } else {
                itemEl.innerHTML = `<div class="photo-placeholder"><span style="font-size:24px;">🖼️</span></div>` +
                    `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>`;
            }
        } catch(e) {
            console.warn('加载图片失败:', photoId, e);
            itemEl.innerHTML = `<div class="photo-placeholder"><span style="font-size:24px;">🖼️</span></div>` +
                `<button class="photo-delete-btn" onclick="event.stopPropagation(); deleteWrongPhotoWithCleanup('${photoId}')">×</button>`;
        }
    });
}

// 删除照片并清理IndexedDB
async function deleteWrongPhotoWithCleanup(photoId) {
    if (!confirm('确定要删除这张照片吗？')) return;
    
    try {
        // 从IndexedDB删除图片
        if (typeof deleteImageFile === 'function') {
            await deleteImageFile(photoId);
        }
    } catch(e) {
        console.warn('删除IndexedDB图片失败:', e);
    }
    
    // 从用户数据删除
    const user = getCurrentUserData() || {};
    user.uploadedImages = user.uploadedImages || [];
    user.uploadedImages = user.uploadedImages.filter(function(p) { 
        return (p.imageId || p.id) !== photoId; 
    });
    syncUserData(user);
    
    showToast('已删除');
    showWrongPhotoGallery();
}

// AI识别照片
async function analyzePhotoWithAI(photoId) {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    // 显示加载中
    content.innerHTML = `
        <div class="analyze-header">
            <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
            <div class="modal-title">🤖 AI识别中</div>
        </div>
        <div class="analyze-loading">
            <div class="loading-icon">🔄</div>
            <div class="loading-text">正在识别题目...</div>
            <div class="loading-steps">
                <div class="step" id="analyze-step-1">⏳ 读取图片</div>
                <div class="step" id="analyze-step-2">⏳ OCR识别</div>
                <div class="step" id="analyze-step-3">⏳ AI解析</div>
            </div>
        </div>
        
        <style>
            .analyze-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .analyze-loading { text-align: center; padding: 40px 20px; }
            .loading-icon { font-size: 48px; margin-bottom: 16px; animation: spin 1s linear infinite; }
            .loading-text { font-size: 16px; color: #666; margin-bottom: 20px; }
            .loading-steps { background: #f9f9f9; border-radius: 12px; padding: 16px; }
            .step { font-size: 14px; color: #666; padding: 8px 0; }
            .step.done { color: #43E97B; }
        </style>
    `;
    
    try {
        // 1. 读取图片
        updateAnalyzeStep(1, 'doing', '读取图片');
        let imageUrl = null;
        
        if (typeof getImageFileAsDataUrl === 'function') {
            imageUrl = await getImageFileAsDataUrl(photoId);
        }
        
        // 尝试从用户数据获取旧格式
        if (!imageUrl) {
            const user = getCurrentUserData() || {};
            const photo = user.uploadedImages?.find(p => (p.imageId || p.id) === photoId);
            if (photo && photo.image) {
                imageUrl = photo.image;
            }
        }
        
        if (!imageUrl) {
            throw new Error('图片不存在');
        }
        
        updateAnalyzeStep(1, 'done', '读取图片');
        
        // 2. OCR识别
        updateAnalyzeStep(2, 'doing', 'OCR识别');
        let ocrText;
        try {
            ocrText = await ocrExtractText(imageUrl);
        } catch(ocrErr) {
            console.warn('OCR失败:', ocrErr);
        }
        
        if (!ocrText || ocrText.length < 5) {
            // 尝试用视觉API
            const visionResult = await callVisionAPI(imageUrl, '请描述这张图片中的题目内容，尽可能完整地提取所有文字');
            if (visionResult.success) {
                ocrText = visionResult.content;
            }
        }
        updateAnalyzeStep(2, 'done', 'OCR识别');
        
        if (!ocrText || ocrText.length < 5) {
            content.innerHTML = `
                <div class="analyze-header">
                    <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                    <div class="modal-title">⚠️ 识别失败</div>
                </div>
                <div class="analyze-result">
                    <div class="result-icon">😕</div>
                    <div class="result-message">未能识别出文字</div>
                    <div class="result-tips">请尝试重新拍照，确保图片清晰</div>
                </div>
                <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
            `;
            return;
        }
        
        // 3. AI解析
        updateAnalyzeStep(3, 'doing', 'AI解析');
        const questionData = await aiParseQuestion(ocrText);
        updateAnalyzeStep(3, 'done', 'AI解析');
        
        if (questionData.error) {
            content.innerHTML = `
                <div class="analyze-header">
                    <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                    <div class="modal-title">⚠️ 解析失败</div>
                </div>
                <div class="analyze-result">
                    <div class="result-icon">😅</div>
                    <div class="result-message">${questionData.error}</div>
                </div>
                <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
            `;
            return;
        }
        
        // 4. 添加到错题本
        const wrongKey = 'photo-' + photoId;
        const user = getCurrentUserData();
        
        // 检查是否已存在
        if (!user.wrongNotes) user.wrongNotes = [];
        
        const existingIndex = user.wrongNotes.findIndex(n => n.wrongKey === wrongKey);
        
        const wrongNote = {
            wrongKey: wrongKey,
            source: 'photo',
            sourceName: '拍照错题',
            topicId: null,
            photoId: photoId,
            question: questionData.question,
            type: questionData.type,
            options: questionData.options ? Object.values(questionData.options) : [],
            optionsMap: questionData.options || {},
            answer: questionData.answer,
            correctIndex: getCorrectIndex(questionData.options, questionData.answer),
            explanation: questionData.explanation,
            userAnswer: '',
            ocrText: ocrText,
            time: Date.now()
        };
        
        if (existingIndex >= 0) {
            user.wrongNotes[existingIndex] = wrongNote;
        } else {
            user.wrongNotes.push(wrongNote);
        }
        syncUserData(user);
        
        // 显示结果
        const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
        content.innerHTML = `
            <div class="analyze-header">
                <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                <div class="modal-title">✅ 识别成功</div>
            </div>
            <div class="analyze-result">
                <div class="result-icon">🎉</div>
                <div class="result-message">已添加到错题本</div>
                
                <div class="question-card">
                    <div class="q-type-tag">${qTypeNames[questionData.type] || '题目'}</div>
                    <div class="q-content">${questionData.question}</div>
                    ${questionData.options ? `
                        <div class="q-options-list">
                            ${Object.entries(questionData.options).map(([k, v]) => `<div class="q-option-item">${k}. ${v}</div>`).join('')}
                        </div>
                    ` : ''}
                    <div class="q-answer-tag">✓ 正确答案：${questionData.answer}</div>
                </div>
                
                <div class="result-actions">
                    <button class="action-btn-primary" onclick="doWrongQuestionFromPhoto('${photoId}')">📝 开始做题</button>
                    <button class="action-btn-secondary" onclick="backToWrongbook()">📒 查看错题本</button>
                </div>
            </div>
            
            <style>
                .analyze-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .analyze-result { text-align: center; }
                .result-icon { font-size: 64px; margin-bottom: 12px; }
                .result-message { font-size: 16px; color: #43E97B; font-weight: 600; margin-bottom: 20px; }
                .result-tips { font-size: 13px; color: #999; margin-bottom: 20px; }
                .question-card { background: #f9f9f9; border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 20px; }
                .q-type-tag { font-size: 11px; color: #667eea; background: #e8e8ff; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
                .q-content { font-size: 14px; color: #333; line-height: 1.5; margin-bottom: 12px; }
                .q-options-list { margin-bottom: 12px; }
                .q-option-item { font-size: 13px; color: #666; padding: 3px 0; }
                .q-answer-tag { font-size: 13px; color: #43E97B; font-weight: 600; }
                .result-actions { display: flex; flex-direction: column; gap: 10px; }
                .action-btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
                .action-btn-secondary { width: 100%; padding: 14px; background: #f5f5f5; color: #666; border: none; border-radius: 12px; font-size: 15px; cursor: pointer; }
                .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; margin-top: 16px; }
            </style>
        `;
        
    } catch(error) {
        console.error('AI识别失败:', error);
        content.innerHTML = `
            <div class="analyze-header">
                <button class="back-btn" onclick="showWrongPhotoGallery()">← 返回</button>
                <div class="modal-title">❌ 识别失败</div>
            </div>
            <div class="analyze-result">
                <div class="result-icon">😢</div>
                <div class="result-message">${error.message}</div>
            </div>
            <button class="back-btn-full" onclick="showWrongPhotoGallery()">← 返回照片库</button>
        `;
    }
}

// 更新识别步骤
function updateAnalyzeStep(stepNum, status, text) {
    const stepEl = document.getElementById('analyze-step-' + stepNum);
    if (!stepEl) return;
    
    if (status === 'doing') {
        stepEl.textContent = '🔄 ' + text;
        stepEl.style.color = '#667eea';
    } else if (status === 'done') {
        stepEl.textContent = '✅ ' + text;
        stepEl.style.color = '#43E97B';
        stepEl.classList.add('done');
    }
}

// ============================================================
// 错题本主页返回函数
// ============================================================

function backToWrongbook() {
    // 1. 关闭 detail-modal
    document.getElementById('detail-modal').classList.remove('show');
    
    // 2. 重新渲染错题本主页到 fullscreen-content
    var contentEl = document.getElementById('fullscreen-content');
    if (contentEl) {
        renderWrongbook(contentEl);
    }
}

// ============================================================
// 错题重练（完善版 - 支持所有题型）
// ============================================================

function retryWrongNote(index) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[index];
    if (!note) { showToast('错题不存在'); return; }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    const qTypeNames = { choice: '选择题', fill: '填空题', calculation: '计算题', other: '问答题' };
    const noteType = note.type || (note.options && note.options.length > 0 ? 'choice' : 'fill');
    
    let questionHTML = `
        <div class="retry-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">🔄 错题重练</div>
        </div>
        
        <div class="retry-container">
            <div class="retry-source">
                <span class="source-tag" style="background:${getSourceColor(note.source)}">${note.sourceName || '练习'}</span>
                <span class="type-tag">${qTypeNames[noteType] || '题目'}</span>
            </div>
            
            <div class="retry-question">${note.question}</div>
            
            ${note.options && note.options.length > 0 ? `
                <div class="retry-options" id="retry-options-container">
                    ${note.options.map((opt, oi) => `
                        <button class="option-btn" data-index="${oi}" onclick="selectRetryOption(this, ${index}, ${oi})">
                            <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
                            <span class="option-text">${opt}</span>
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="retry-selected-option" value="-1">
            ` : `
                <div class="retry-input-area">
                    <textarea id="retry-text-answer" class="retry-textarea" placeholder="请输入你的答案..."></textarea>
                </div>
            `}
            
            <div id="retry-result-area" style="display:none;"></div>
            
            <div class="retry-actions">
                ${note.options && note.options.length > 0 ? `
                    <button class="submit-btn" id="retry-submit-btn" onclick="submitRetryChoiceAnswer(${index})" disabled>提交答案</button>
                ` : `
                    <button class="submit-btn" id="retry-submit-btn" onclick="submitRetryTextAnswer(${index})">提交答案</button>
                `}
                <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            </div>
        </div>
        
        <style>
            .retry-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .retry-container { }
            .retry-source { display: flex; gap: 8px; margin-bottom: 12px; }
            .source-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; color: white; }
            .type-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #e8e8ff; color: #667eea; }
            
            .retry-question { background: linear-gradient(135deg, #f5f7ff, #e8f4ff); border-radius: 12px; padding: 16px; font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 16px; }
            
            .retry-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
            .option-btn { display: flex; align-items: center; gap: 12px; padding: 14px; background: white; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; text-align: left; transition: all 0.2s; }
            .option-btn:hover { border-color: #667eea; background: #f5f7ff; }
            .option-btn.selected { border-color: #667eea; background: #e8e8ff; }
            .option-btn.correct { border-color: #43E97B; background: #d4edda; }
            .option-btn.wrong { border-color: #FF6B6B; background: #f8d7da; }
            .option-letter { width: 28px; height: 28px; background: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
            .option-text { font-size: 14px; color: #333; flex: 1; }
            
            .retry-input-area { margin-bottom: 16px; }
            .retry-textarea { width: 100%; height: 100px; padding: 12px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 14px; resize: none; box-sizing: border-box; }
            .retry-textarea:focus { outline: none; border-color: #667eea; }
            
            .retry-result { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            .result-correct { background: #d4edda; border: 2px solid #43E97B; }
            .result-wrong { background: #f8d7da; border: 2px solid #FF6B6B; }
            .result-icon { font-size: 32px; margin-bottom: 8px; }
            .result-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
            .result-correct .result-title { color: #155724; }
            .result-wrong .result-title { color: #721c24; }
            .result-detail { font-size: 13px; color: #666; margin-bottom: 8px; }
            .result-explanation { font-size: 12px; color: #666; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px; margin-top: 8px; }
            
            .retry-actions { display: flex; flex-direction: column; gap: 10px; }
            .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
            .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
            .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
    
    content.innerHTML = questionHTML;
}

// 选择选项
function selectRetryOption(el, noteIndex, optionIndex) {
    // 移除其他选项的选中状态
    document.querySelectorAll('.option-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });
    
    // 选中当前选项
    el.classList.add('selected');
    
    // 保存选择
    document.getElementById('retry-selected-option').value = optionIndex;
    
    // 启用提交按钮
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

// 提交选择题答案
function submitRetryChoiceAnswer(noteIndex) {
    const selectedOption = parseInt(document.getElementById('retry-selected-option').value);
    if (selectedOption < 0) {
        showToast('请选择一个答案');
        return;
    }
    
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[noteIndex];
    if (!note) return;
    
    const correctIndex = note.correctIndex;
    const isCorrect = selectedOption === correctIndex;
    
    // 显示结果
    const resultArea = document.getElementById('retry-result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
        <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
            <div class="result-icon">${isCorrect ? '🎉' : '😢'}</div>
            <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
            ${!isCorrect ? `<div class="result-detail">你的答案：${String.fromCharCode(65 + selectedOption)}. ${note.options[selectedOption]}</div>` : ''}
            <div class="result-detail" style="color: ${isCorrect ? '#43E97B' : '#43E97B'};">正确答案：${String.fromCharCode(65 + correctIndex)}. ${note.options[correctIndex]}</div>
            ${note.explanation ? `<div class="result-explanation">💡 解析：${note.explanation}</div>` : ''}
        </div>
    `;
    
    // 更新错题状态
    note.userAnswer = String.fromCharCode(65 + selectedOption) + '. ' + note.options[selectedOption];
    if (isCorrect) {
        note.reviewed = true;
        showToast('太棒了！回答正确！');
    }
    syncUserData(user);
    
    // 禁用选项按钮
    document.querySelectorAll('.option-btn').forEach(function(btn, i) {
        btn.style.cursor = 'default';
        if (i === correctIndex) {
            btn.classList.add('correct');
        } else if (i === selectedOption && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 隐藏提交按钮
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
    // V145修复：记录练习数据
    if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
}

// 提交填空/计算题答案（AI智能批改）
async function submitRetryTextAnswer(noteIndex) {
    const textarea = document.getElementById('retry-text-answer');
    const userAns = textarea ? textarea.value.trim() : '';
    
    if (!userAns) {
        showToast('请输入答案');
        return;
    }
    
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[noteIndex];
    if (!note) return;
    
    const correctAnswer = note.answer;
    
    // 显示加载中
    const resultArea = document.getElementById('retry-result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
        <div class="retry-result" style="background: #f9f9f9;">
            <div class="loading-icon" style="font-size: 24px;">🤖 AI批改中...</div>
        </div>
    `;
    
    // 调用AI判断答案
    try {
        const prompt = `请判断用户的答案是否正确。

题目：${note.question}
正确答案：${correctAnswer}
用户答案：${userAns}

请用以下JSON格式返回判断结果：
{
    "isCorrect": true/false,
    "similarity": 0-100的相似度百分比,
    "feedback": "简短的反馈意见"
}

注意：允许合理的等价表达方式（如"2/3"和"0.666"都算正确），数学表达式等价也算正确。`;

        const messages = [
            { role: 'system', content: '你是一个智能的作业批改AI，能够理解学生答案的等价表达。' },
            { role: 'user', content: prompt }
        ];
        
        const result = await callDeepSeekAPI(messages, 0.3);
        
        let isCorrect = false;
        let feedback = '';
        
        if (result.success) {
            // 解析JSON结果
            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    isCorrect = parsed.isCorrect || parsed.similarity > 70;
                    feedback = parsed.feedback || '';
                } catch(e) {
                    // JSON解析失败，使用模糊匹配
                    isCorrect = fuzzyMatch(userAns, correctAnswer);
                }
            } else {
                isCorrect = fuzzyMatch(userAns, correctAnswer);
            }
        } else {
            // API失败，使用本地模糊匹配
            isCorrect = fuzzyMatch(userAns, correctAnswer);
        }
        
        // 显示结果
        resultArea.innerHTML = `
            <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
                <div class="result-icon">${isCorrect ? '🎉' : '😢'}</div>
                <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
                <div class="result-detail">你的答案：${userAns}</div>
                <div class="result-detail" style="color: #43E97B;">正确答案：${correctAnswer}</div>
                ${feedback ? `<div class="result-explanation">💡 ${feedback}</div>` : ''}
                ${note.explanation ? `<div class="result-explanation">📖 解析：${note.explanation}</div>` : ''}
            </div>
        `;
        
        // 更新错题状态
        note.userAnswer = userAns;
        if (isCorrect) {
            note.reviewed = true;
            showToast('太棒了！回答正确！');
        }
        syncUserData(user);
        // V145修复：记录练习数据
        if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
        
    } catch(error) {
        console.error('AI批改失败:', error);
        // 使用本地模糊匹配作为备选
        const isCorrect = fuzzyMatch(userAns, correctAnswer);
        
        resultArea.innerHTML = `
            <div class="retry-result ${isCorrect ? 'result-correct' : 'result-wrong'}">
                <div class="result-icon">${isCorrect ? '🎉' : '❌'}</div>
                <div class="result-title">${isCorrect ? '回答正确！' : '回答错误'}</div>
                <div class="result-detail">你的答案：${userAns}</div>
                <div class="result-detail" style="color: #43E97B;">正确答案：${correctAnswer}</div>
                ${note.explanation ? `<div class="result-explanation">📖 解析：${note.explanation}</div>` : ''}
            </div>
        `;
        
        note.userAnswer = userAns;
        if (isCorrect) {
            note.reviewed = true;
        }
        syncUserData(user);
        // V145修复：记录练习数据（catch块也记录）
        if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 0.5);
    }
    
    // 禁用输入框和提交按钮
    textarea.disabled = true;
    const submitBtn = document.getElementById('retry-submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

// 模糊匹配答案（本地备选方案）
function fuzzyMatch(userAns, correctAns) {
    // 移除空格和标点
    const normalize = function(s) {
        return s.toLowerCase()
            .replace(/[\s\.,，。、；;]/g, '')
            .replace(/（/g, '(')
            .replace(/）/g, ')');
    };
    
    const normUser = normalize(userAns);
    const normCorrect = normalize(correctAns);
    
    // 完全匹配
    if (normUser === normCorrect) return true;
    
    // 数字比较（处理小数精度问题）
    const numUser = parseFloat(normUser);
    const numCorrect = parseFloat(normCorrect);
    if (!isNaN(numUser) && !isNaN(numCorrect)) {
        const diff = Math.abs(numUser - numCorrect);
        const tolerance = Math.max(0.001, Math.abs(numCorrect) * 0.001);
        if (diff < tolerance) return true;
    }
    
    // 包含匹配
    if (normUser.includes(normCorrect) || normCorrect.includes(normUser)) return true;
    
    // 分数比较
    const fractionMatch = normUser.match(/^(\d+)\/(\d+)$/);
    const fractionCorrect = normCorrect.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch && fractionCorrect) {
        const u = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        const c = parseInt(fractionCorrect[1]) / parseInt(fractionCorrect[2]);
        if (Math.abs(u - c) < 0.001) return true;
    }
    
    return false;
}

// ============================================================
// AI分析错题
// ============================================================

async function analyzeWrongNoteWithAI(index) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const note = wrongNotes[index];
    if (!note) { showToast('错题不存在'); return; }
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    // 显示加载中
    content.innerHTML = `
        <div class="ai-header">
            <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
            <div class="modal-title">🤖 AI分析</div>
        </div>
        <div class="ai-loading">
            <div class="loading-icon">🤖</div>
            <div class="loading-text">AI正在深度分析中...</div>
        </div>
        
        <style>
            .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
            .ai-loading { text-align: center; padding: 40px; }
            .loading-icon { font-size: 48px; margin-bottom: 16px; }
            .loading-text { font-size: 14px; color: #666; }
        </style>
    `;
    
    try {
        const prompt = `请详细分析这道错题，帮助学生理解错误原因并掌握正确解法：

【题目】
${note.question}
${note.options ? '\n【选项】\n' + note.options.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('\n') : ''}

【正确答案】
${note.answer}

【学生的错误答案】
${note.userAnswer || '未知'}

【解析】
${note.explanation || '无'}

请从以下几个方面进行分析：
1. 错误原因分析：学生为什么会做错？
2. 知识点讲解：涉及哪些知识点？
3. 正确解题思路：应该怎么做？
4. 易错点提示：做这类题要注意什么？
5. 举一反三：出一道类似的练习题（附答案）`;

        const messages = [
            { role: 'system', content: '你是一位专业、耐心的初中数学老师，擅长分析学生的错题，给出详细易懂的讲解。请用清晰的结构回答。' },
            { role: 'user', content: prompt }
        ];
        
        const result = await callDeepSeekAPI(messages, 0.7);
        
        if (result.error) {
            content.innerHTML = `
                <div class="ai-header">
                    <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                    <div class="modal-title">⚠️ AI分析失败</div>
                </div>
                <div class="ai-error">
                    <div class="error-icon">😢</div>
                    <div class="error-message">${result.message}</div>
                    <button class="retry-btn" onclick="analyzeWrongNoteWithAI(${index})">🔄 重试</button>
                </div>
                <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            `;
            return;
        }
        
        // 显示分析结果
        const analysisContent = result.content.replace(/\n/g, '<br>');
        
        content.innerHTML = `
            <div class="ai-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">🤖 AI分析结果</div>
            </div>
            
            <div class="ai-result">
                <div class="question-brief">
                    <div class="brief-label">题目</div>
                    <div class="brief-content">${note.question}</div>
                </div>
                
                <div class="analysis-content">
                    ${analysisContent}
                </div>
                
                <button class="speak-btn" onclick="speakText(this.previousElementSibling.textContent)">🔊 朗读</button>
            </div>
            
            <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
            
            <style>
                .ai-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .ai-result { background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; max-height: 400px; overflow-y: auto; }
                .question-brief { background: white; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
                .brief-label { font-size: 11px; color: #667eea; margin-bottom: 4px; }
                .brief-content { font-size: 13px; color: #333; line-height: 1.5; }
                .analysis-content { font-size: 13px; line-height: 1.8; color: #333; }
                .analysis-content br { display: block; margin: 4px 0; }
                .speak-btn { width: 100%; padding: 10px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; margin-bottom: 16px; }
                .ai-error { text-align: center; padding: 40px; }
                .error-icon { font-size: 48px; margin-bottom: 12px; }
                .error-message { font-size: 14px; color: #FF6B6B; margin-bottom: 16px; }
                .retry-btn { padding: 10px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
                .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
            </style>
        `;
        
        // 记录调用
        if (typeof recordDeepSeekCall === 'function') {
            recordDeepSeekCall(Math.ceil(result.content.length / 4));
        }
        
    } catch(error) {
        console.error('AI分析失败:', error);
        content.innerHTML = `
            <div class="ai-header">
                <button class="back-btn" onclick="backToWrongbook()">← 返回</button>
                <div class="modal-title">❌ 分析失败</div>
            </div>
            <div class="ai-error">
                <div class="error-icon">😢</div>
                <div class="error-message">${error.message}</div>
            </div>
            <button class="back-btn-full" onclick="backToWrongbook()">← 返回错题本</button>
        `;
    }
}

// ============================================================
// 其他功能
// ============================================================

function markWrongNoteReviewed(index) {
    const user = getCurrentUserData();
    if (!user || !user.wrongNotes || !user.wrongNotes[index]) return;
    user.wrongNotes[index].reviewed = true;
    syncUserData(user);
    showToast('✅ 已标记为已复习');
    
    // 刷新显示
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (modal && content) {
        renderWrongbook(content);
    }
}

function removeWrongNote(index) {
    if (!confirm('确定要删除这道错题吗？')) return;
    
    const user = getCurrentUserData();
    if (user && user.wrongNotes) {
        user.wrongNotes.splice(index, 1);
        syncUserData(user);
        showToast('已移除错题');
        
        // 刷新显示
        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');
        if (modal && content) {
            renderWrongbook(content);
        }
    }
}

function reviewAllWrongNotes() {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    const unreviewed = wrongNotes.filter(n => !n.reviewed);
    
    if (unreviewed.length === 0) {
        showToast('所有错题已复习完毕！');
        return;
    }
    
    // 从第一个未复习的开始
    const firstUnreviewedIndex = wrongNotes.findIndex(n => !n.reviewed);
    if (firstUnreviewedIndex >= 0) {
        retryWrongNote(firstUnreviewedIndex);
    }
}

function clearWrongNotes() {
    if (!confirm('确定要清空所有错题记录吗？')) return;
    
    const user = getCurrentUserData();
    if (user) {
        user.wrongNotes = [];
        syncUserData(user);
        showToast('错题本已清空');
        
        // 刷新显示
        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');
        if (modal && content) {
            renderWrongbook(content);
        }
    }
}

// ============================================================
// Window Exports
// ============================================================
window.renderWrongbook = renderWrongbook;
window.backToWrongbook = backToWrongbook;
window.openWrongPhotoCapture = openWrongPhotoCapture;
window.uploadWrongPhotoWithAI = uploadWrongPhotoWithAI;
window.showWrongPhotoGallery = showWrongPhotoGallery;
window.analyzePhotoWithAI = analyzePhotoWithAI;
window.doWrongQuestionFromPhoto = doWrongQuestionFromPhoto;
window.retryWrongNote = retryWrongNote;
window.selectRetryOption = selectRetryOption;
window.submitRetryChoiceAnswer = submitRetryChoiceAnswer;
window.submitRetryTextAnswer = submitRetryTextAnswer;
window.analyzeWrongNoteWithAI = analyzeWrongNoteWithAI;
window.markWrongNoteReviewed = markWrongNoteReviewed;
window.removeWrongNote = removeWrongNote;
window.clearWrongNotes = clearWrongNotes;
window.reviewAllWrongNotes = reviewAllWrongNotes;
window.deleteWrongPhotoWithCleanup = deleteWrongPhotoWithCleanup;
window.viewWrongNotes = viewWrongNotes;
window.openFeedback = openFeedback;
window.submitFeedback = submitFeedback;

// V148-fix: 添加缺失的window导出，确保内联onclick能正常工作
window.updateStepStatus = updateStepStatus;
window.getSourceColor = getSourceColor;
window.getCorrectIndex = getCorrectIndex;
window.showOcrSuccessUI = showOcrSuccessUI;
window.showOcrFailedUI = showOcrFailedUI;
window.updateAnalyzeStep = updateAnalyzeStep;
window.retryWrongNote = retryWrongNote;

// 从设置面板打开错题本
function viewWrongNotes() {
    closeSettingsPanel();
    openFullscreenPage('wrongbook');
}

function openFeedback() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-header">
            <button class="back-btn" onclick="closeDetail()">← 返回</button>
            <div class="modal-title">💬 反馈建议</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <textarea id="feedback-text" style="width:100%;height:120px;border:1px solid #ddd;border-radius:8px;padding:12px;font-size:14px;resize:none;box-sizing:border-box;" placeholder="请描述您的问题或建议..."></textarea>
        </div>
        <button onclick="submitFeedback()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:12px;">提交反馈</button>
        <button class="back-btn-full" onclick="closeDetail()">关闭</button>
        
        <style>
            .modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
            .back-btn-full { width: 100%; padding: 12px; background: #f5f5f5; border: none; border-radius: 10px; font-size: 14px; color: #666; cursor: pointer; }
        </style>
    `;
}

function submitFeedback() {
    const text = document.getElementById('feedback-text').value.trim();
    if (!text) {
        showToast('请输入反馈内容');
        return;
    }
    closeDetail();
    showToast('感谢您的反馈！我们会认真处理');
}


// ===== js/modules/pomodoro.js =====
// ============================================================
// 版本: V144
// 番茄钟模块
// ============================================================

window.pomodoroTime = 25 * 60;
window.pomodoroTimer = null;
let pomodoroRunning = false;
let pomodoroMode = 'work'; // work, break

function renderPomodoro(container) {
    const minutes = Math.floor(window.pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    
    container.innerHTML = `
        <div class="card" style="text-align:center;">
            <h3 style="margin-bottom:12px;">🍅 番茄闹钟</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">专注学习，高效时间管理</p>
            
            <div style="width:200px;height:200px;margin:20px auto;border-radius:50%;background:linear-gradient(135deg,#FF6B6B,#FF9A63);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(255,107,107,0.3);">
                <div id="pomodoro-display" style="font-size:48px;font-weight:bold;color:white;">${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}</div>
            </div>
            
            <div style="display:flex;justify-content:center;gap:12px;margin:20px 0;">
                <button onclick="setPomodoroTime(25)" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">25分钟</button>
                <button onclick="setPomodoroTime(15)" style="padding:10px 20px;background:#43E97B;color:white;border:none;border-radius:8px;cursor:pointer;">15分钟</button>
                <button onclick="setPomodoroTime(5)" style="padding:10px 20px;background:#FFD93D;color:#333;border:none;border-radius:8px;cursor:pointer;">5分钟</button>
            </div>
            
            <div style="display:flex;justify-content:center;gap:16px;">
                <button id="pomodoro-start-btn" onclick="togglePomodoro()" style="padding:16px 40px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:18px;font-weight:bold;cursor:pointer;">${pomodoroRunning ? '暂停' : '开始'}</button>
                <button onclick="resetPomodoro()" style="padding:16px 24px;background:#f5f7ff;color:#667eea;border:2px solid #667eea;border-radius:12px;font-size:16px;cursor:pointer;">重置</button>
            </div>
            
            <div style="margin-top:24px;padding:16px;background:#f5f7ff;border-radius:12px;">
                <div style="font-size:14px;color:#666;margin-bottom:8px;">今日专注统计</div>
                <div style="display:flex;justify-content:center;gap:24px;">
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#FF6B6B;" id="pomodoro-count">${getCurrentUserData()?.pomodoroCount || 0}</div>
                        <div style="font-size:12px;color:#666;">番茄数</div>
                    </div>
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#667eea;" id="pomodoro-minutes">${getCurrentUserData()?.pomodoroMinutes || 0}</div>
                        <div style="font-size:12px;color:#666;">专注分钟</div>
                    </div>
                </div>
            </div>
            
            <button onclick="closeFullscreenPage()" style="margin-top:20px;padding:12px 24px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
        </div>
    `;
}

function resetPomodoro() {
    clearInterval(window.pomodoroTimer);
    pomodoroRunning = false;
    window.pomodoroTime = 25 * 60;
    renderPomodoro(document.getElementById('fullscreen-content'));
}

function setPomodoroTime(minutes) {
    window.pomodoroTime = minutes * 60;
    pomodoroMode = minutes >= 15 ? 'work' : 'break';
    const display = document.getElementById('pomodoro-display');
    if (display) {
        display.textContent = `${String(minutes).padStart(2,'0')}:00`;
    }
}

function togglePomodoro() {
    if (pomodoroRunning) {
        clearInterval(window.pomodoroTimer);
        pomodoroRunning = false;
    } else {
        pomodoroRunning = true;
        window.pomodoroTimer = setInterval(() => {
            window.pomodoroTime--;
            if (window.pomodoroTime <= 0) {
                clearInterval(window.pomodoroTimer);
                pomodoroRunning = false;
                // 播放提示音
                if (typeof SoundEffects !== 'undefined' && SoundEffects.playComplete) {
                    SoundEffects.playComplete();
                }
                showToast('🍅 番茄时间到！休息一下吧~');
                // 更新统计
                const user = getCurrentUserData();
                if (user) {
                    user.pomodoroCount = (user.pomodoroCount || 0) + 1;
                    user.pomodoroMinutes = (user.pomodoroMinutes || 0) + 25;
                    syncUserData(user);
                }
                // 重置
                window.pomodoroTime = 25 * 60;
                renderPomodoro(document.getElementById('fullscreen-content'));
            }
            const display = document.getElementById('pomodoro-display');
            if (display) {
                const m = Math.floor(window.pomodoroTime / 60);
                const s = pomodoroTime % 60;
                display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            }
        }, 1000);
    }
    const btn = document.getElementById('pomodoro-start-btn');
    if (btn) btn.textContent = pomodoroRunning ? '暂停' : '开始';
}

// 导出到window，供onclick调用
window.renderPomodoro = renderPomodoro;
window.resetPomodoro = resetPomodoro;
window.setPomodoroTime = setPomodoroTime;
window.togglePomodoro = togglePomodoro;


// ===== js/modules/radar-chart.js =====
// ==========================================
// V195 五边形能力雷达图
// 纯Canvas实现，无第三方依赖
// ==========================================

window.renderAbilityRadar = function(canvasId, scores) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;
  
  ctx.clearRect(0, 0, width, height);
  
  const dimensions = Object.keys(ABILITY_DIMENSIONS);
  const dimCount = dimensions.length;
  const angleStep = (Math.PI * 2) / dimCount;
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    const r = radius * (i / 5);
    for (let j = 0; j <= dimCount; j++) {
      const angle = j * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
  for (let i = 0; i < dimCount; i++) {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }
  
  ctx.beginPath();
  dimensions.forEach((dimId, i) => {
    const score = scores[dimId] || 0;
    const scoreRatio = score / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * scoreRatio * Math.cos(angle);
    const y = centerY + radius * scoreRatio * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
  gradient.addColorStop(1, 'rgba(240, 147, 251, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  dimensions.forEach((dimId, i) => {
    const score = scores[dimId] || 0;
    const scoreRatio = score / 100;
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * scoreRatio * Math.cos(angle);
    const y = centerY + radius * scoreRatio * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = ABILITY_DIMENSIONS[dimId].color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const labelAngle = i * angleStep - Math.PI / 2;
    const labelR = radius + 30;
    const labelX = centerX + labelR * Math.cos(labelAngle);
    const labelY = centerY + labelR * Math.sin(labelAngle);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '18px sans-serif';
    ctx.fillText(ABILITY_DIMENSIONS[dimId].icon, labelX, labelY - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(ABILITY_DIMENSIONS[dimId].name, labelX, labelY + 10);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = ABILITY_DIMENSIONS[dimId].color;
    ctx.fillText(score + '分', labelX, labelY + 28);
  });
};

window.renderAbilityCards = function(containerId, scores) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding:16px;">';
  
  Object.keys(ABILITY_DIMENSIONS).forEach(dimId => {
    const dim = ABILITY_DIMENSIONS[dimId];
    const score = scores[dimId] || 0;
    const level = getAbilityLevel(score);
    
    html += `
      <div onclick="switchToModule('${dim.sources[0]}')" 
           style="background:linear-gradient(135deg,${dim.color}20,${dim.color}05);
                  border-radius:12px;padding:16px;cursor:pointer;
                  border-left:4px solid ${dim.color};
                  transition:transform 0.2s,box-shadow 0.2s;"
           onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
           onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:24px;">${dim.icon}</span>
          <span style="font-weight:600;font-size:14px;color:#333;">${dim.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-weight:bold;font-size:24px;color:${dim.color}">${score}</span>
          <span style="font-size:12px;color:${level.color};background:${level.color}20;padding:2px 8px;border-radius:10px;">${level.text}</span>
        </div>
        <div style="height:6px;background:#eee;border-radius:3px;margin-top:8px;overflow:hidden;">
          <div style="width:${score}%;height:100%;background:linear-gradient(90deg,${dim.color},${dim.color}cc);border-radius:3px;"></div>
        </div>
        <div style="font-size:11px;color:#999;margin-top:6px;">${dim.desc}</div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
};


// ===== js/modules/growth-chart.js =====
// ==========================================
// V195 成长曲线图
// 展示日/周/月三个维度的进步趋势
// ==========================================

window.renderGrowthChart = function(canvasId, dataType) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  
  ctx.clearRect(0, 0, width, height);
  
  const user = getCurrentUserData();
  const history = user?.trainingHistory || [];
  
  let data = [];
  let labels = [];
  
  if (dataType === 'day') {
    const today = new Date();
    const todayStr = today.toDateString();
    const todayTrainings = history.filter(t => 
      new Date(t.timestamp || Date.now()).toDateString() === todayStr
    );
    
    for (let h = 8; h <= 22; h++) {
      const hourTrainings = todayTrainings.filter(t => {
        const d = new Date(t.timestamp || Date.now());
        return d.getHours() === h;
      });
      const avgAcc = hourTrainings.length > 0
        ? hourTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / hourTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(h + ':00');
    }
  } else if (dataType === 'week') {
    for (let d = 6; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateStr = date.toDateString();
      const dayTrainings = history.filter(t => 
        new Date(t.timestamp || Date.now()).toDateString() === dateStr
      );
      const avgAcc = dayTrainings.length > 0
        ? dayTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / dayTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(date.getMonth() + 1 + '/' + date.getDate());
    }
  } else {
    const now = new Date();
    for (let m = 3; m >= 0; m--) {
      const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthStr = (date.getMonth() + 1) + '月';
      const monthTrainings = history.filter(t => {
        const d = new Date(t.timestamp || Date.now());
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });
      const avgAcc = monthTrainings.length > 0
        ? monthTrainings.reduce((s, t) => s + (t.accuracy || 70), 0) / monthTrainings.length
        : null;
      data.push(avgAcc);
      labels.push(monthStr);
    }
  }
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const validData = data.filter(d => d !== null);
  const minVal = validData.length > 0 ? Math.max(0, Math.min(...validData) - 10) : 0;
  const maxVal = validData.length > 0 ? Math.min(100, Math.max(...validData) + 10) : 100;
  
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    
    ctx.fillStyle = '#999';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - ((maxVal - minVal) / 4) * i) + '%', padding - 5, y + 3);
  }
  
  ctx.beginPath();
  let hasValidPoints = false;
  data.forEach((val, i) => {
    if (val === null) return;
    hasValidPoints = true;
    const x = padding + (chartWidth / (data.length - 1)) * i;
    const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    if (i === 0 || data.slice(0, i).every(d => d === null)) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  if (hasValidPoints) {
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');
    
    ctx.lineTo(padding + chartWidth, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    data.forEach((val, i) => {
      if (val === null) return;
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      if (i === 0 || data.slice(0, i).every(d => d === null)) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    data.forEach((val, i) => {
      if (val === null) return;
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#667eea';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  
  ctx.fillStyle = '#999';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = padding + (chartWidth / (data.length - 1)) * i;
    ctx.fillText(label, x, height - 15);
  });
};

window.renderGrowthStats = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const user = getCurrentUserData();
  const history = user?.trainingHistory || [];
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeek = history.filter(t => new Date(t.timestamp || Date.now()) > weekAgo);
  const lastWeek = history.filter(t => {
    const d = new Date(t.timestamp || Date.now());
    return d > twoWeeksAgo && d <= weekAgo;
  });
  
  const thisWeekAvg = thisWeek.length > 0
    ? Math.round(thisWeek.reduce((s, t) => s + (t.accuracy || 70), 0) / thisWeek.length)
    : 0;
  const lastWeekAvg = lastWeek.length > 0
    ? Math.round(lastWeek.reduce((s, t) => s + (t.accuracy || 70), 0) / lastWeek.length)
    : 0;
  
  const diff = thisWeekAvg - lastWeekAvg;
  const diffText = diff > 0 ? `↑ ${diff}%` : diff < 0 ? `↓ ${Math.abs(diff)}%` : '-';
  const diffColor = diff > 0 ? '#43e97b' : diff < 0 ? '#ff6b6b' : '#999';
  
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:16px;">
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#667eea10,#764ba210);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#667eea;">${thisWeek.length}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">本周训练次数</div>
      </div>
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#43e97b10,#38f9d710);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#43e97b;">${thisWeekAvg}%</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">本周正确率</div>
      </div>
      <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#fa709a10,#fee14010);border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:${diffColor};">${diffText}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">环比上周</div>
      </div>
    </div>
  `;
};


// ===== js/modules/local-db.js =====
// ==========================================
// V195 本地IndexedDB数据库
// 防止系统更新丢失数据
// ==========================================

window.LocalDB = {
    dbName: 'CognitiveTrainingDB',
    version: 1,
    db: null,
    
    // 初始化数据库
    init: function(callback) {
        if (this.db) {
            if (callback) callback(this.db);
            return;
        }
        
        const request = indexedDB.open(this.dbName, this.version);
        
        request.onerror = function(e) {
            console.error('IndexedDB打开失败:', e);
            if (callback) callback(null);
        };
        
        request.onupgradeneeded = function(e) {
            const db = e.target.result;
            
            // 创建表
            if (!db.objectStoreNames.contains('userInfo')) {
                db.createObjectStore('userInfo', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('questionBank')) {
                db.createObjectStore('questionBank', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('studyMethods')) {
                db.createObjectStore('studyMethods', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('thinkingTraining')) {
                db.createObjectStore('thinkingTraining', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('wrongBook')) {
                db.createObjectStore('wrongBook', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('chatHistory')) {
                db.createObjectStore('chatHistory', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('trainingRecords')) {
                db.createObjectStore('trainingRecords', { keyPath: 'id' });
            }
            
            console.log('IndexedDB表创建完成');
        };
        
        request.onsuccess = function(e) {
            LocalDB.db = e.target.result;
            console.log('IndexedDB初始化成功');
            if (callback) callback(LocalDB.db);
        };
    },
    
    // 保存数据
    save: function(storeName, data, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const item = { id: id || Date.now().toString(), data: data, timestamp: Date.now() };
                
                const req = store.put(item);
                req.onsuccess = function() { resolve(true); };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 获取数据
    get: function(storeName, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.get(id);
                
                req.onsuccess = function() {
                    resolve(req.result ? req.result.data : null);
                };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 获取所有数据
    getAll: function(storeName) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.getAll();
                
                req.onsuccess = function() {
                    resolve(req.result || []);
                };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 删除数据
    delete: function(storeName, id) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const req = store.delete(id);
                
                req.onsuccess = function() { resolve(true); };
                req.onerror = function(e) { reject(e); };
            });
        });
    },
    
    // 导出全部数据为JSON
    exportAll: function() {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const stores = ['userInfo', 'questionBank', 'studyMethods', 
                               'thinkingTraining', 'wrongBook', 'chatHistory', 'trainingRecords'];
                const exportData = {
                    version: LocalDB.version,
                    exportTime: new Date().toISOString(),
                    data: {}
                };
                
                let done = 0;
                stores.forEach(function(storeName) {
                    LocalDB.getAll(storeName).then(function(items) {
                        exportData.data[storeName] = items;
                        done++;
                        if (done === stores.length) {
                            resolve(exportData);
                        }
                    }).catch(reject);
                });
            });
        });
    },
    
    // 从JSON导入全部数据
    importAll: function(exportData) {
        return new Promise(function(resolve, reject) {
            LocalDB.init(function(db) {
                if (!db) { reject('DB not ready'); return; }
                
                const stores = Object.keys(exportData.data || {});
                let done = 0;
                let errors = [];
                
                stores.forEach(function(storeName) {
                    const items = exportData.data[storeName] || [];
                    let itemDone = 0;
                    
                    if (items.length === 0) {
                        done++;
                        if (done === stores.length) resolve({ success: done, errors: errors });
                        return;
                    }
                    
                    items.forEach(function(item) {
                        LocalDB.save(storeName, item.data, item.id).then(function() {
                            itemDone++;
                            if (itemDone === items.length) {
                                done++;
                                if (done === stores.length) resolve({ success: done, errors: errors });
                            }
                        }).catch(function(e) {
                            errors.push(storeName + ': ' + e);
                            itemDone++;
                            if (itemDone === items.length) {
                                done++;
                                if (done === stores.length) resolve({ success: done, errors: errors });
                            }
                        });
                    });
                });
            });
        });
    },
    
    // 下载备份文件
    downloadBackup: function() {
        LocalDB.exportAll().then(function(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '认知训练备份_' + new Date().toISOString().slice(0, 10) + '.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('✅ 备份已下载');
        }).catch(function() {
            showToast('❌ 备份失败');
        });
    },
    
    // 选择备份文件导入
    importFromFile: function(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    LocalDB.importAll(data).then(function(result) {
                        showToast('✅ 导入完成，恢复了' + result.success + '项数据');
                        if (callback) callback(true);
                        // 同时同步到localStorage
                        syncDBToLocalStorage();
                    }).catch(function() {
                        showToast('❌ 导入失败');
                        if (callback) callback(false);
                    });
                } catch(e) {
                    showToast('❌ 文件格式错误');
                    if (callback) callback(false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
};

// 数据双向同步：IndexedDB <-> localStorage
window.syncDBToLocalStorage = function() {
    // 从localStorage同步到IndexedDB
    const user = getCurrentUserData();
    if (user) LocalDB.save('userInfo', user, 'currentUser');
    
    // 错题本同步
    if (window.wrongBook && window.wrongBook.questions) {
        LocalDB.save('wrongBook', window.wrongBook.questions, 'all');
    }
    
    console.log('数据已同步到本地数据库');
};

window.syncLocalStorageToDB = function() {
    // 从IndexedDB恢复到localStorage
    LocalDB.get('userInfo', 'currentUser').then(function(user) {
        if (user) localStorage.setItem('cognitive_user', JSON.stringify(user));
    });
};

// 页面关闭时自动保存
window.addEventListener('beforeunload', syncDBToLocalStorage);

// 初始化
LocalDB.init();

// ==========================================
// 自动备份配置
// ==========================================
window.AutoBackup = {
    enabled: localStorage.getItem('auto_backup_enabled') === 'true',
    intervalHours: parseInt(localStorage.getItem('auto_backup_interval')) || 24,
    lastBackupTime: parseInt(localStorage.getItem('last_backup_time')) || 0,
    
    toggle: function(enabled) {
        this.enabled = enabled;
        localStorage.setItem('auto_backup_enabled', enabled ? 'true' : 'false');
        showToast(enabled ? '✅ 自动备份已开启' : '自动备份已关闭');
    },
    
    setInterval: function(hours) {
        this.intervalHours = hours;
        localStorage.setItem('auto_backup_interval', hours);
    },
    
    shouldBackup: function() {
        if (!this.enabled) return false;
        const now = Date.now();
        const intervalMs = this.intervalHours * 60 * 60 * 1000;
        return now - this.lastBackupTime > intervalMs;
    },
    
    doBackup: function() {
        return new Promise(function(resolve) {
            LocalDB.exportAll().then(function(data) {
                localStorage.setItem('auto_backup_data', JSON.stringify(data));
                localStorage.setItem('last_backup_time', Date.now().toString());
                AutoBackup.lastBackupTime = Date.now();
                console.log('自动备份完成:', new Date().toLocaleString());
                resolve(true);
            }).catch(function() {
                resolve(false);
            });
        });
    },
    
    getLastBackupTime: function() {
        if (this.lastBackupTime === 0) return '从未备份';
        return new Date(this.lastBackupTime).toLocaleString();
    }
};

// 页面加载时检查是否需要自动备份
setTimeout(function() {
    if (AutoBackup.shouldBackup()) {
        AutoBackup.doBackup();
    }
}, 3000); // 页面加载3秒后检查

// 渲染备份管理界面
window.renderBackupManager = function(container) {
    const html = `
    <div style="padding:16px;">
        <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">💾 数据备份与恢复</h3>
        
        <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-size:14px;font-weight:600;">🔄 自动备份</span>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                    <input type="checkbox" id="auto-backup-toggle" 
                        ${AutoBackup.enabled ? 'checked' : ''} 
                        onchange="AutoBackup.toggle(this.checked)"
                        style="width:18px;height:18px;">
                    <span style="font-size:13px;">开启</span>
                </label>
            </div>
            <div style="font-size:12px;color:#666;">
                <div>备份频率：每 ${AutoBackup.intervalHours} 小时一次</div>
                <div>上次备份：${AutoBackup.getLastBackupTime()}</div>
            </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <button onclick="LocalDB.downloadBackup()" 
                style="padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">
                📥 下载备份文件
            </button>
            <button onclick="LocalDB.importFromFile()" 
                style="padding:12px;background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">
                📤 从文件恢复
            </button>
        </div>
        
        <div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;font-size:12px;color:#856404;">
            ⚠️ 提示：更新系统前建议先下载备份文件，更新后导入即可恢复所有数据
        </div>
    </div>`;
    
    container.innerHTML = html;
};

// 注册备份模块
if (typeof CTM !== 'undefined') {
    CTM.registerModule('backup', {
        name: '数据备份',
        icon: '💾',
        render: renderBackupManager
    });
}


// ===== js/modules/self-drive.js =====
// ==========================================
// V195 自驱力与内驱力训练模块
// 培养学习动力、目标感、意志力
// ==========================================

window.SelfDrive = {
    goals: JSON.parse(localStorage.getItem('self_drive_goals') || '[]'),
    habits: JSON.parse(localStorage.getItem('self_drive_habits') || '[]'),
    achievements: JSON.parse(localStorage.getItem('self_drive_achievements') || '[]'),
    diary: JSON.parse(localStorage.getItem('self_drive_diary') || '[]'),
    
    save: function() {
        localStorage.setItem('self_drive_goals', JSON.stringify(this.goals));
        localStorage.setItem('self_drive_habits', JSON.stringify(this.habits));
        localStorage.setItem('self_drive_achievements', JSON.stringify(this.achievements));
        localStorage.setItem('self_drive_diary', JSON.stringify(this.diary));
    },
    
    // 激励语录库
    quotes: [
        "每天进步一点点，坚持带来大改变 💪",
        "学习不是为了别人，是为了遇见更好的自己 ✨",
        "现在的每一分努力，都是未来的底气 🎯",
        "困难是成长的阶梯，跨过去就是新高度 🪜",
        "自律的前期是兴奋，中期是痛苦，后期是享受 🌟",
        "你背不下来的书，总有人能背下来；你做不出的题，总有人能做出来 📚",
        "今天不想学，所以才要学 ❤️",
        "学习是性价比最高的投资 💰",
        "那些你熬夜努力的时光，那才是梦想的力量 🌙",
        "每一个想要学习的念头，都是未来的你在向现在的你求救 📞"
    ],
    
    getRandomQuote: function() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }
};

// 渲染自驱力训练主页面
window.renderSelfDrive = function(container) {
    const todayQuote = SelfDrive.getRandomQuote();
    const streakDays = calculateStreakDays();
    
    container.innerHTML = `
    <div style="padding:16px;">
        <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">💪 自驱力训练</h3>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#667eea20,#764ba220);border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:12px;color:#667eea;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${todayQuote}</div>
        </div>
        
        <!-- 连续打卡 -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-size:14px;font-weight:600;">🔥 连续打卡</span>
                <span style="font-size:28px;font-weight:bold;color:#ff6b6b;">${streakDays}天</span>
            </div>
            <button onclick="checkInToday()" style="width:100%;padding:12px;background:linear-gradient(135deg,#ff6b6b,#ff9a63);color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">
                ${hasCheckedInToday() ? '✅ 今日已打卡' : '📝 今日打卡'}
            </button>
        </div>
        
        <!-- 功能入口 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <button onclick="renderGoalPage()" style="padding:16px 12px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">
                🎯 目标设定
            </button>
            <button onclick="renderHabitPage()" style="padding:16px 12px;background:linear-gradient(135deg,#43e97b,#38f9d7);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">
                📅 习惯追踪
            </button>
            <button onclick="renderAchievementPage()" style="padding:16px 12px;background:linear-gradient(135deg,#fa709a,#fee140);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">
                🏆 成就墙
            </button>
            <button onclick="renderDiaryPage()" style="padding:16px 12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;">
                📝 每日反思
            </button>
        </div>
        
        <button onclick="renderMethodPage()" style="width:100%;padding:16px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px;">
            📚 科学训练方法
        </button>
        
        <!-- 成就概览 -->
        <div style="background:white;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">📊 训练概览</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                <div><div style="font-size:24px;font-weight:bold;color:#667eea;">${SelfDrive.goals.length}</div><div style="font-size:11px;color:#999;">目标</div></div>
                <div><div style="font-size:24px;font-weight:bold;color:#43e97b;">${SelfDrive.habits.length}</div><div style="font-size:11px;color:#999;">习惯</div></div>
                <div><div style="font-size:24px;font-weight:bold;color:#fa709a;">${SelfDrive.achievements.length}</div><div style="font-size:11px;color:#999;">成就</div></div>
            </div>
        </div>
    </div>`;
};

// 计算连续打卡天数
function calculateStreakDays() {
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    if (checkins.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    checkins.sort().reverse();
    for (let i = 0; i < checkins.length; i++) {
        const checkDate = new Date(checkins[i]).toDateString();
        const expectedDate = new Date(Date.now() - i * 86400000).toDateString();
        if (checkDate === expectedDate || (i === 0 && checkDate === yesterday)) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function hasCheckedInToday() {
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    const today = new Date().toDateString();
    return checkins.some(c => new Date(c).toDateString() === today);
}

function checkInToday() {
    if (hasCheckedInToday()) {
        showToast('今天已经打过卡啦！');
        return;
    }
    
    const checkins = JSON.parse(localStorage.getItem('self_drive_checkins') || '[]');
    checkins.push(new Date().toISOString());
    localStorage.setItem('self_drive_checkins', JSON.stringify(checkins));
    
    showToast('🎉 打卡成功！继续加油！');
    renderSelfDrive(document.getElementById('main-content') || document.querySelector('.content'));
}

// 目标页面
function renderGoalPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">🎯 我的目标</h3>
            <button onclick="addGoal()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>
        </div>
        ${SelfDrive.goals.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">🎯</div>
                <div>还没有设定目标</div>
                <div style="font-size:12px;margin-top:8px;">设定一个小目标，开始行动吧！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.goals.map((goal, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                            <div style="flex:1;">
                                <div style="font-size:14px;font-weight:600;color:#333;text-decoration:${goal.completed ? 'line-through' : 'none'};opacity:${goal.completed ? 0.5 : 1};">${goal.text}</div>
                                <div style="font-size:11px;color:#999;margin-top:4px;">${goal.date || ''}</div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button onclick="toggleGoal(${i})" style="padding:4px 8px;background:${goal.completed ? '#43e97b' : '#f0f0f0'};color:${goal.completed ? 'white' : '#666'};border:none;border-radius:6px;font-size:11px;cursor:pointer;">${goal.completed ? '✅' : '完成'}</button>
                                <button onclick="deleteGoal(${i})" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addGoal() {
    const text = prompt('🎯 输入你的目标：');
    if (!text) return;
    
    SelfDrive.goals.push({
        text: text,
        date: new Date().toLocaleDateString(),
        completed: false
    });
    SelfDrive.save();
    showToast('✅ 目标已添加');
    renderGoalPage();
}

function toggleGoal(index) {
    SelfDrive.goals[index].completed = !SelfDrive.goals[index].completed;
    SelfDrive.save();
    renderGoalPage();
}

function deleteGoal(index) {
    if (!confirm('确定删除这个目标吗？')) return;
    SelfDrive.goals.splice(index, 1);
    SelfDrive.save();
    renderGoalPage();
}

// 习惯追踪页面
function renderHabitPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">📅 习惯追踪</h3>
            <button onclick="addHabit()" style="padding:8px 16px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 新增</button>
        </div>
        ${SelfDrive.habits.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">📅</div>
                <div>还没有添加习惯</div>
                <div style="font-size:12px;margin-top:8px;">好习惯从今天开始养成！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.habits.map((habit, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <span style="font-size:14px;font-weight:600;color:#333;">${habit.icon || '✅'} ${habit.name}</span>
                            <span style="font-size:12px;color:#43e97b;font-weight:600;">${habit.streak || 0}天</span>
                        </div>
                        <div style="display:flex;gap:4px;margin-bottom:8px;">
                            ${(habit.checkins || []).slice(-7).map(c => `
                                <div style="width:14px;height:14px;background:#43e97b;border-radius:3px;"></div>
                            `).join('')}
                            ${Array(Math.max(0, 7 - (habit.checkins || []).length)).fill(0).map(() => `
                                <div style="width:14px;height:14px;background:#f0f0f0;border-radius:3px;"></div>
                            `).join('')}
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button onclick="checkHabit(${i})" style="flex:1;padding:8px;background:#43e97b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">今日打卡</button>
                            <button onclick="deleteHabit(${i})" style="padding:8px 12px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addHabit() {
    const name = prompt('📅 输入习惯名称（如：每天背10个单词）：');
    if (!name) return;
    
    SelfDrive.habits.push({
        name: name,
        icon: '✅',
        streak: 0,
        checkins: []
    });
    SelfDrive.save();
    showToast('✅ 习惯已添加');
    renderHabitPage();
}

function checkHabit(index) {
    const habit = SelfDrive.habits[index];
    const today = new Date().toDateString();
    
    if (!habit.checkins) habit.checkins = [];
    
    const lastCheckin = habit.checkins.length > 0 ? new Date(habit.checkins[habit.checkins.length - 1]).toDateString() : null;
    if (lastCheckin === today) {
        showToast('今天已经打过卡啦！');
        return;
    }
    
    habit.checkins.push(new Date().toISOString());
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastCheckin === yesterday) {
        habit.streak = (habit.streak || 0) + 1;
    } else {
        habit.streak = 1;
    }
    
    SelfDrive.save();
    showToast('🎉 打卡成功！继续坚持！');
    renderHabitPage();
}

function deleteHabit(index) {
    if (!confirm('确定删除这个习惯吗？')) return;
    SelfDrive.habits.splice(index, 1);
    SelfDrive.save();
    renderHabitPage();
}

// 成就墙页面
function renderAchievementPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    // 预设成就
    const presetAchievements = [
        { id: 'first_goal', name: '设定目标', desc: '设定第一个目标', icon: '🎯', condition: () => SelfDrive.goals.length >= 1 },
        { id: 'checkin_7', name: '一周坚持', desc: '连续打卡7天', icon: '🔥', condition: () => calculateStreakDays() >= 7 },
        { id: 'checkin_30', name: '月度坚持', desc: '连续打卡30天', icon: '🏆', condition: () => calculateStreakDays() >= 30 },
        { id: 'habit_3', name: '习惯养成', desc: '同时追踪3个习惯', icon: '📅', condition: () => SelfDrive.habits.length >= 3 },
        { id: 'diary_5', name: '反思达人', desc: '写了5篇反思日记', icon: '📝', condition: () => SelfDrive.diary.length >= 5 },
        { id: 'achievement_unlock', name: '解锁成就', desc: '解锁3个成就', icon: '🏅', condition: () => SelfDrive.achievements.length >= 3 }
    ];
    
    // 检查并解锁新成就
    presetAchievements.forEach(pa => {
        if (pa.condition() && !SelfDrive.achievements.find(a => a.id === pa.id)) {
            SelfDrive.achievements.push({
                id: pa.id,
                name: pa.name,
                desc: pa.desc,
                icon: pa.icon,
                unlockedAt: new Date().toISOString()
            });
        }
    });
    SelfDrive.save();
    
    container.innerHTML = `
    <div style="padding:20px;">
        <h3 style="margin:0 0 20px 0;font-size:18px;">🏆 成就墙</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
            ${presetAchievements.map(pa => {
                const unlocked = SelfDrive.achievements.find(a => a.id === pa.id);
                return `
                    <div style="text-align:center;padding:12px;background:${unlocked ? 'white' : '#f5f5f5'};border-radius:12px;opacity:${unlocked ? 1 : 0.5};box-shadow:${unlocked ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'};">
                        <div style="font-size:32px;margin-bottom:4px;">${pa.icon}</div>
                        <div style="font-size:12px;font-weight:600;color:#333;">${pa.name}</div>
                        <div style="font-size:10px;color:#999;margin-top:2px;">${pa.desc}</div>
                        ${unlocked ? '<div style="font-size:9px;color:#43e97b;margin-top:4px;">✅ 已解锁</div>' : '<div style="font-size:9px;color:#999;margin-top:4px;">🔒 未解锁</div>'}
                    </div>
                `;
            }).join('')}
        </div>
    </div>`;
}

// 每日反思页面
function renderDiaryPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    container.innerHTML = `
    <div style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;font-size:18px;">📝 每日反思</h3>
            <button onclick="addDiary()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">+ 写反思</button>
        </div>
        ${SelfDrive.diary.length === 0 ? `
            <div style="text-align:center;padding:40px;color:#999;">
                <div style="font-size:48px;margin-bottom:12px;">📝</div>
                <div>还没有反思记录</div>
                <div style="font-size:12px;margin-top:8px;">记录今天的收获与思考吧！</div>
            </div>
        ` : `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${SelfDrive.diary.slice().reverse().map((entry, i) => `
                    <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size:11px;color:#999;margin-bottom:8px;">${entry.date}</div>
                        <div style="font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap;">${entry.text}</div>
                        <div style="text-align:right;margin-top:8px;">
                            <button onclick="deleteDiary(${SelfDrive.diary.length - 1 - i})" style="padding:4px 8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:11px;cursor:pointer;">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    </div>`;
}

function addDiary() {
    const text = prompt('📝 今天有什么收获或感悟？');
    if (!text) return;
    
    SelfDrive.diary.push({
        text: text,
        date: new Date().toLocaleString()
    });
    SelfDrive.save();
    showToast('✅ 已保存');
    renderDiaryPage();
}

function deleteDiary(index) {
    if (!confirm('确定删除这条反思吗？')) return;
    SelfDrive.diary.splice(index, 1);
    SelfDrive.save();
    renderDiaryPage();
}


// 训练方法库页面
function renderMethodPage() {
    const container = document.getElementById('detail-content') || document.body;
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    const methods = [
        {
            icon: '🎯',
            title: '1. 强化"自主感"',
            desc: '把"我必须做"转变为"我选择做"',
            tips: [
                '改变语言：不说"我得去运动"，而说"我选择运动，因为它让我精力更好"',
                '给选项：不想写作业？可以"先写10分钟"或"先列大纲"。选其一，立刻行动'
            ]
        },
        {
            icon: '💪',
            title: '2. 制造"胜任感"',
            desc: '动力来源于"我能做好"的预期',
            tips: [
                '拆解任务：把大目标分解到"不可能失败"的小步骤（如"背1个单词"）',
                '记录成就：每天写下3件完成的小事，哪怕只是"准时起床"'
            ]
        },
        {
            icon: '💡',
            title: '3. 连接"价值感"',
            desc: '明确"为什么做"比"怎么做"更能激发持久动力',
            tips: [
                '追问5层：针对目标连续追问"为什么"，直到触及内在价值观',
                '视觉化结果：想象完成任务后的具体感受（如成就感、自由感），并写下来'
            ]
        },
        {
            icon: '🌱',
            title: '4. 设计"低阻力"环境',
            desc: '自驱力脆弱时，环境是关键推手',
            tips: [
                '降低启动成本：想看书就把书放在枕头边；想学习就提前把文具准备好',
                '移除诱惑：学习时把手机放在另一个房间'
            ]
        },
        {
            icon: '❓',
            title: '5. 用"好奇心"驱动探索',
            desc: '内驱力常源于未知。对过程而非结果好奇',
            tips: [
                '问"如果……会怎样"：如"如果我每天写100字，一个月后会写出什么？"',
                '允许无目的尝试：每周花1小时纯粹因为"觉得有趣"做一件事，不设目标'
            ]
        },
        {
            icon: '🔄',
            title: '6. 建立正向反馈闭环',
            desc: '大脑依赖多巴胺维持动力',
            tips: [
                '即时奖励：完成任务后立即给自己一个小奖励（如听一首喜欢的歌）',
                '追踪进度：用可视化方式（如进度条、打卡记录）让成长"被看见"'
            ]
        },
        {
            icon: '⚡',
            title: '7. 管理"认知资源"',
            desc: '自驱力像肌肉会疲劳，需要节能和恢复',
            tips: [
                '意志力配额：把最重要的决策放在精力最好的时段做',
                '主动休息：每45-90分钟强制休息，避免意志力耗尽'
            ]
        }
    ];
    
    container.innerHTML = `
    <div style="padding:20px;">
        <h3 style="margin:0 0 20px 0;font-size:18px;">📚 自驱力科学训练方法</h3>
        <div style="font-size:12px;color:#666;margin-bottom:16px;">核心：由内在需求或兴趣驱动的行动力，而非依赖外部奖励或压力</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            ${methods.map(m => `
                <div style="background:white;padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span style="font-size:20px;">${m.icon}</span>
                        <span style="font-size:14px;font-weight:600;color:#333;">${m.title}</span>
                    </div>
                    <div style="font-size:12px;color:#667eea;margin-bottom:8px;">${m.desc}</div>
                    <div style="padding-left:28px;">
                        ${m.tips.map(t => `<div style="font-size:12px;color:#666;margin-bottom:4px;">• ${t}</div>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

// 注册模块
if (typeof CTM !== 'undefined') {
    CTM.registerModule('selfdrive', {
        name: '自驱力训练',
        icon: '💪',
        render: renderSelfDrive
    });
}

// V246 Bundle修复：挂载函数到window
window.renderGoalPage = renderGoalPage;
window.renderHabitPage = renderHabitPage;
window.renderAchievementPage = renderAchievementPage;
window.renderDiaryPage = renderDiaryPage;
window.renderMethodPage = renderMethodPage;


// ===== js/modules/my-page.js =====
// ==========================================
// V195 我的 - 个人中心页面
// ==========================================

window.renderMyPage = function(container) {
    const user = getCurrentUserData();
    const streakDays = calculateStreakDays();
    
    container.innerHTML = `
    <div style="padding:16px;">
        <!-- 用户信息卡片 -->
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:20px;color:white;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">
                    ${user.avatar || '👤'}
                </div>
                <div>
                    <div style="font-size:18px;font-weight:600;">${user.name || '同学'}</div>
                    <div style="font-size:12px;opacity:0.8;">连续学习 ${streakDays} 天</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.totalTime || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">学习分钟</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${user.completedTasks || 0}</div>
                    <div style="font-size:11px;opacity:0.8;">完成任务</div>
                </div>
                <div>
                    <div style="font-size:20px;font-weight:bold;">${(user.accuracy || 0).toFixed(0)}%</div>
                    <div style="font-size:11px;opacity:0.8;">正确率</div>
                </div>
            </div>
        </div>
        
        <!-- 功能入口 -->
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
            <div onclick="openFullscreenPage('wrongbook')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">📒</div>
                <div style="font-size:14px;font-weight:600;color:#333;">错题本</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">复习巩固</div>
            </div>
            <div onclick="openFullscreenPage('selfdrive')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">💪</div>
                <div style="font-size:14px;font-weight:600;color:#333;">自驱力训练</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">目标·习惯·反思</div>
            </div>
            <div onclick="openFullscreenPage('backup')" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">💾</div>
                <div style="font-size:14px;font-weight:600;color:#333;">数据备份</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">防止数据丢失</div>
            </div>
            <div onclick="openSettings()" style="background:white;padding:20px 16px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);cursor:pointer;text-align:center;">
                <div style="font-size:28px;margin-bottom:8px;">⚙️</div>
                <div style="font-size:14px;font-weight:600;color:#333;">设置</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">个性化选项</div>
            </div>
        </div>
        
        <!-- 今日激励 -->
        <div style="background:linear-gradient(135deg,#43e97b20,#38f9d720);border-radius:12px;padding:16px;">
            <div style="font-size:12px;color:#43e97b;font-weight:600;margin-bottom:8px;">✨ 今日能量</div>
            <div style="font-size:14px;color:#333;line-height:1.6;">${SelfDrive.getRandomQuote()}</div>
        </div>
    </div>`;
};

// 注册备份页面全屏显示
function openBackupPage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💾 数据备份';
        renderBackupManager(content);
    }
}

// 注册自驱力训练全屏页面
function openSelfDrivePage() {
    const modal = document.getElementById('fullscreen-page');
    const content = document.getElementById('fullscreen-content');
    const title = document.getElementById('fullscreen-title');
    
    if (modal && content) {
        modal.classList.add('show');
        title.textContent = '💪 自驱力训练';
        renderSelfDrive(content);
    }
}

// 注册到CTM
if (typeof CTM !== 'undefined') {
    CTM.registerModule('my', {
        name: '我的',
        icon: '👤',
        render: renderMyPage
    });
    
    CTM.registerModule('backup', {
        name: '数据备份',
        icon: '💾',
        render: renderBackupManager
    });
    
    CTM.registerModule('selfdrive', {
        name: '自驱力训练',
        icon: '💪',
        render: renderSelfDrive
    });
}


// ===== js/modules/journal.js =====
// V255: 学习日记模块 - 支持分页、JSON导出、数据统计

window.JOURNAL_ITEMS_PER_PAGE = 20;

function renderJournalModule(container) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    
    // 数据统计
    var total = journals.length;
    var currentMonth = new Date().getMonth();
    var currentYear = new Date().getFullYear();
    var monthCount = journals.filter(function(j) {
        var d = new Date(j.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    
    // 今日是否已写
    var todayStr = new Date().toISOString().split('T')[0];
    var wroteToday = journals.some(function(j) { return j.date.startsWith(todayStr); });
    
    container.innerHTML = `
        <div style="padding: 16px;">
            <!-- 数据统计卡片 -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + total + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">总日记数</div>
                </div>
                <div style="background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + monthCount + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">本月新增</div>
                </div>
                <div style="background: linear-gradient(135deg, ` + (wroteToday ? '#4facfe, #00f2fe' : '#9e9e9e, #757575') + `); border-radius: 12px; padding: 12px; text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">` + (wroteToday ? '✅' : '📝') + `</div>
                    <div style="font-size: 12px; opacity: 0.9;">今日已写</div>
                </div>
            </div>
            
            <!-- 操作按钮 -->
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                <button onclick="openJournalEditor()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    ✏️ 写日记
                </button>
                <button onclick="exportJournals()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    📤 导出备份
                </button>
            </div>
            
            <!-- 分页导航 -->
            <div id="journal-pagination" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;"></div>
            
            <!-- 日记列表 -->
            <div id="journal-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
    
    // 渲染第一页
    renderJournalPage(1);
}

function renderJournalPage(page) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    var totalPages = Math.ceil(journals.length / JOURNAL_ITEMS_PER_PAGE) || 1;
    page = Math.max(1, Math.min(page, totalPages));
    
    var start = (page - 1) * JOURNAL_ITEMS_PER_PAGE;
    var end = start + JOURNAL_ITEMS_PER_PAGE;
    var pageItems = journals.slice(start, end).reverse(); // 最新在前
    
    var listEl = document.getElementById('journal-list');
    var pagEl = document.getElementById('journal-pagination');
    
    if (pageItems.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 16px;">📓</div>
                <div>还没有日记，开始记录你的学习成长吧！</div>
            </div>
        `;
        pagEl.innerHTML = '';
        return;
    }
    
    // 渲染日记列表
    listEl.innerHTML = pageItems.map(function(j, i) {
        var dateStr = new Date(j.date).toLocaleDateString('zh-CN', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        var moodEmoji = {1: '😢', 2: '😔', 3: '😐', 4: '😊', 5: '😄'}[j.mood] || '😊';
        var preview = j.content.substring(0, 80) + (j.content.length > 80 ? '...' : '');
        
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 13px; color: #667eea; font-weight: 600;">` + dateStr + `</div>
                    <div style="font-size: 20px;">` + moodEmoji + `</div>
                </div>
                <div style="font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 8px;">` + preview + `</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ` + (j.tags ? j.tags.split(',').map(function(t) {
                        return '<span style="background: #f0f3ff; color: #667eea; padding: 2px 8px; border-radius: 10px; font-size: 11px;">' + t.trim() + '</span>';
                    }).join('') : '') + `
                </div>
                <div style="text-align: right; margin-top: 12px;">
                    <button onclick="viewJournalDetail(` + (start + pageItems.length - 1 - i) + `)" style="background: none; border: none; color: #667eea; font-size: 13px; cursor: pointer;">查看详情 →</button>
                </div>
            </div>
        `;
    }).join('');
    
    // 渲染分页
    var pagHtml = '';
    if (totalPages > 1) {
        pagHtml += '<button onclick="renderJournalPage(' + (page - 1) + ')" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;" ' + (page === 1 ? 'disabled' : '') + '>上一页</button>';
        for (var p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) {
            pagHtml += '<button onclick="renderJournalPage(' + p + ')" style="padding: 8px 12px; border: none; background: ' + (p === page ? '#667eea' : '#f5f5f5') + '; color: ' + (p === page ? 'white' : '#333') + '; border-radius: 8px; cursor: pointer; min-width: 36px;">' + p + '</button>';
        }
        pagHtml += '<button onclick="renderJournalPage(' + (page + 1) + ')" style="padding: 8px 12px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;" ' + (page === totalPages ? 'disabled' : '') + '>下一页</button>';
    }
    pagEl.innerHTML = pagHtml;
}

function openJournalEditor() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; text-align: center;">✏️ 写学习日记</h3>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">今日心情</label>
                <div id="mood-selector" style="display: flex; justify-content: center; gap: 16px; font-size: 28px;">
                    <span onclick="selectMood(1)" style="cursor: pointer; opacity: 0.5;">😢</span>
                    <span onclick="selectMood(2)" style="cursor: pointer; opacity: 0.5;">😔</span>
                    <span onclick="selectMood(3)" style="cursor: pointer; opacity: 1; transform: scale(1.2);">😐</span>
                    <span onclick="selectMood(4)" style="cursor: pointer; opacity: 0.5;">😊</span>
                    <span onclick="selectMood(5)" style="cursor: pointer; opacity: 0.5;">😄</span>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">日记内容</label>
                <textarea id="journal-content" rows="8" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; resize: vertical; box-sizing: border-box;" placeholder="记录今天的学习收获、心得体会..."></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">标签（逗号分隔）</label>
                <input id="journal-tags" type="text" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; box-sizing: border-box;" placeholder="例如: 数学, 错题, 进步">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="closeModal()" style="flex: 1; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">取消</button>
                <button onclick="saveJournal()" style="flex: 2; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">💾 保存日记</button>
            </div>
        </div>
    `;
    
    window.selectedMood = 3;
}

function selectMood(mood) {
    window.selectedMood = mood;
    var spans = document.querySelectorAll('#mood-selector span');
    for (var i = 0; i < spans.length; i++) {
        spans[i].style.opacity = (i + 1 === mood) ? '1' : '0.5';
        spans[i].style.transform = (i + 1 === mood) ? 'scale(1.2)' : 'scale(1)';
    }
}

function saveJournal() {
    var content = document.getElementById('journal-content').value.trim();
    var tags = document.getElementById('journal-tags').value.trim();
    
    if (!content) {
        showToast('请输入日记内容');
        return;
    }
    
    var user = getCurrentUserData();
    if (!user.journals) user.journals = [];
    
    user.journals.push({
        id: Date.now(),
        date: new Date().toISOString(),
        content: content,
        tags: tags,
        mood: window.selectedMood || 3
    });
    
    saveCurrentUserData(user);
    closeModal();
    showToast('日记保存成功！🎉');
    
    // 刷新列表
    var container = document.getElementById('fullscreen-content');
    if (container) renderJournalModule(container);
}

function viewJournalDetail(index) {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    var journal = journals[index];
    if (!journal) return;
    
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    var dateStr = new Date(journal.date).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'
    });
    var moodEmoji = {1: '😢', 2: '😔', 3: '😐', 4: '😊', 5: '😄'}[journal.mood] || '😊';
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div style="font-size: 14px; color: #667eea; font-weight: 600;">` + dateStr + `</div>
                <div style="font-size: 24px;">` + moodEmoji + `</div>
            </div>
            
            <div style="background: #f9f9f9; border-radius: 12px; padding: 16px; margin-bottom: 16px; max-height: 300px; overflow-y: auto;">
                <div style="font-size: 15px; color: #333; line-height: 1.8; white-space: pre-wrap;">` + journal.content + `</div>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                ` + (journal.tags ? journal.tags.split(',').map(function(t) {
                    return '<span style="background: #f0f3ff; color: #667eea; padding: 4px 12px; border-radius: 12px; font-size: 12px;">' + t.trim() + '</span>';
                }).join('') : '') + `
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="deleteJournal(` + index + `)" style="flex: 1; padding: 12px; background: #fff5f5; color: #ff6b6b; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">🗑️ 删除</button>
                <button onclick="closeModal()" style="flex: 2; padding: 12px; background: #f5f5f5; color: #666; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">关闭</button>
            </div>
        </div>
    `;
}

function deleteJournal(index) {
    if (!confirm('确定要删除这篇日记吗？')) return;
    
    var user = getCurrentUserData();
    user.journals.splice(index, 1);
    saveCurrentUserData(user);
    closeModal();
    showToast('日记已删除');
    
    // 刷新列表
    var container = document.getElementById('fullscreen-content');
    if (container) renderJournalModule(container);
}

function exportJournals() {
    var user = getCurrentUserData();
    var journals = user.journals || [];
    
    if (journals.length === 0) {
        showToast('还没有日记可导出');
        return;
    }
    
    var exportData = {
        version: 'V255',
        exportDate: new Date().toISOString(),
        user: user.name,
        totalCount: journals.length,
        journals: journals
    };
    
    var jsonStr = JSON.stringify(exportData, null, 2);
    var blob = new Blob([jsonStr], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = '学习日记备份_' + user.name + '_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('导出成功！已下载JSON备份文件');
}

window.renderJournalPage = renderJournalPage;
window.openJournalEditor = openJournalEditor;
window.selectMood = selectMood;
window.saveJournal = saveJournal;
window.viewJournalDetail = viewJournalDetail;
window.deleteJournal = deleteJournal;
window.exportJournals = exportJournals;
window.renderJournalModule = renderJournalModule;

// 兼容函数
function renderJournalPage(container) {
    renderJournalModule(container);
}
window.renderJournalPage = renderJournalPage;


// ===== js/modules/library.js =====
// V255: 学习图书馆模块 - 60本精选书籍，8大领域分类

window.LIBRARY_BOOKS = [
    // 领域1: 学习方法
    {category: '学习方法', title: '刻意练习', author: '安德斯·艾利克森', desc: '如何从新手到大师的科学方法', icon: '🎯'},
    {category: '学习方法', title: '学习之道', author: '芭芭拉·奥克利', desc: '公认的学习经典指南', icon: '📚'},
    {category: '学习方法', title: '深度工作', author: '卡尔·纽波特', desc: '专注力是21世纪的核心竞争力', icon: '💡'},
    {category: '学习方法', title: '高效能人士的七个习惯', author: '史蒂芬·柯维', desc: '全球最具影响力的个人成长著作', icon: '⭐'},
    {category: '学习方法', title: '思考，快与慢', author: '丹尼尔·卡尼曼', desc: '诺贝尔经济学奖得主的思维科学', icon: '🧠'},
    {category: '学习方法', title: '跃迁', author: '古典', desc: '成为高手的技术', icon: '🚀'},
    {category: '学习方法', title: '精进', author: '采铜', desc: '如何成为一个很厉害的人', icon: '⚡'},
    {category: '学习方法', title: '认知觉醒', author: '周岭', desc: '开启自我改变的原动力', icon: '🌟'},
    
    // 领域2: 作文语文
    {category: '作文语文', title: '文心', author: '夏丏尊/叶圣陶', desc: '写给中学生的语文启蒙书', icon: '✍️'},
    {category: '作文语文', title: '七十二堂写作课', author: '夏丏尊/叶圣陶', desc: '讲述文章作法的经典', icon: '📝'},
    {category: '作文语文', title: '作文基本功', author: '朱自清', desc: '语文大师教你写作文', icon: '🖋️'},
    {category: '作文语文', title: '给青年的二十七堂文学课', author: '叶圣陶', desc: '文学欣赏入门指南', icon: '📖'},
    {category: '作文语文', title: '如何阅读一本书', author: '莫提默·艾德勒', desc: '阅读的方法与技巧', icon: '📕'},
    {category: '作文语文', title: '文章读法', author: '朱自清', desc: '经典文章的阅读方法', icon: '📗'},
    {category: '作文语文', title: '语文常谈', author: '吕叔湘', desc: '语言文字的经典普及读物', icon: '📘'},
    {category: '作文语文', title: '说话的艺术', author: '林语堂', desc: '语言表达的艺术', icon: '💬'},
    
    // 领域3: 数学科学
    {category: '数学科学', title: '什么是数学', author: 'R·柯朗', desc: '对思想和方法的基本研究', icon: '🔢'},
    {category: '数学科学', title: '数学之美', author: '吴军', desc: '信息论与计算机科学的数学基础', icon: '🔣'},
    {category: '数学科学', title: '从一到无穷大', author: 'G·伽莫夫', desc: '科学中的事实和臆测', icon: '∞'},
    {category: '数学科学', title: '奇妙的物理学', author: 'A·瓦尔拉莫夫', desc: '身边的物理现象', icon: '⚛️'},
    {category: '数学科学', title: '趣味物理学', author: '雅科夫·别莱利曼', desc: '让物理变得有趣', icon: '🎢'},
    {category: '数学科学', title: '化学是什么', author: '周公度', desc: '化学入门必读', icon: '🧪'},
    {category: '数学科学', title: '生物学是什么', author: '王亚辉', desc: '生命科学入门', icon: '🧬'},
    {category: '数学科学', title: '时间简史', author: '史蒂芬·霍金', desc: '从大爆炸到黑洞', icon: '🌌'},
    
    // 领域4: 百科知识
    {category: '百科知识', title: 'DK儿童大百科', author: 'DK出版社', desc: '全球最权威的儿童百科', icon: '🌍'},
    {category: '百科知识', title: '十万个为什么', author: '少年儿童出版社', desc: '中国孩子的启蒙百科', icon: '❓'},
    {category: '百科知识', title: '万物简史', author: '比尔·布莱森', desc: '现代科学发展史', icon: '🌎'},
    {category: '百科知识', title: '人类简史', author: '尤瓦尔·赫拉利', desc: '从动物到上帝', icon: '🏛️'},
    {category: '百科知识', title: '未来简史', author: '尤瓦尔·赫拉利', desc: '从智人到智神', icon: '🤖'},
    {category: '百科知识', title: '今日简史', author: '尤瓦尔·赫拉利', desc: '人类命运大议题', icon: '📰'},
    {category: '百科知识', title: '世界观', author: '理查德·德威特', desc: '现代人必须懂的科学哲学', icon: '🌐'},
    {category: '百科知识', title: '苏菲的世界', author: '乔斯坦·贾德', desc: '哲学启蒙小说', icon: '👧'},
    
    // 领域5: 漫画科普
    {category: '漫画科普', title: '半小时漫画中国史', author: '陈磊', desc: '用漫画解读历史', icon: '🇨🇳'},
    {category: '漫画科普', title: '半小时漫画世界史', author: '陈磊', desc: '世界历史轻松读', icon: '🌏'},
    {category: '漫画科普', title: '半小时漫画科学史', author: '陈磊', desc: '科学发现的故事', icon: '🔬'},
    {category: '漫画科普', title: '赛雷三分钟漫画中国史', author: '赛雷', desc: '趣味中国历史', icon: '📜'},
    {category: '漫画科普', title: '植物大战僵尸科学漫画', author: '笑江南', desc: '寓教于乐的科学漫画', icon: '🌱'},
    {category: '漫画科普', title: '这就是物理', author: '约瑟夫·米森', desc: '美国经典物理科学启蒙', icon: '⚡'},
    {category: '漫画科普', title: '这就是化学', author: '米莱童书', desc: '化学知识漫画解读', icon: '⚗️'},
    {category: '漫画科普', title: '漫画原子物理学', author: '加来道雄', desc: '量子物理轻松入门', icon: '⚛️'},
    
    // 领域6: 成长励志
    {category: '成长励志', title: '小王子', author: '圣埃克苏佩里', desc: '永远的成长经典', icon: '👑'},
    {category: '成长励志', title: '牧羊少年奇幻之旅', author: '保罗·柯艾略', desc: '追求梦想的寓言', icon: '🐑'},
    {category: '成长励志', title: '解忧杂货店', author: '东野圭吾', desc: '温暖人心的故事', icon: '🏪'},
    {category: '成长励志', title: '阿甘正传', author: '温斯顿·格鲁姆', desc: '笨小孩的人生智慧', icon: '🏃'},
    {category: '成长励志', title: '当幸福来敲门', author: '克里斯·加德纳', desc: '永不放弃的励志故事', icon: '🚪'},
    {category: '成长励志', title: '风雨哈佛路', author: '莉丝·默里', desc: '绝境中逆袭的真实故事', icon: '🎓'},
    {category: '成长励志', title: '相约星期二', author: '米奇·阿尔博姆', desc: '人生最后一堂课', icon: '📅'},
    {category: '成长励志', title: '海鸥乔纳森', author: '理查德·巴赫', desc: '追求卓越的寓言', icon: '🕊️'},
    
    // 领域7: 技术前沿
    {category: '技术前沿', title: '人工智能', author: '李开复', desc: 'AI的现在与未来', icon: '🤖'},
    {category: '技术前沿', title: '智能时代', author: '吴军', desc: '大数据与智能革命', icon: '💻'},
    {category: '技术前沿', title: '深度学习', author: 'Ian Goodfellow', desc: 'AI圣经', icon: '🧠'},
    {category: '技术前沿', title: 'Python编程：从入门到实践', author: '埃里克·马瑟斯', desc: '编程入门首选', icon: '🐍'},
    {category: '技术前沿', title: '浪潮之巅', author: '吴军', desc: '科技巨头的兴衰', icon: '🌊'},
    {category: '技术前沿', title: '硅谷之谜', author: '吴军', desc: '创新的秘密', icon: '💡'},
    {category: '技术前沿', title: '奇点临近', author: '雷·库兹韦尔', desc: '技术发展的未来', icon: '🚀'},
    {category: '技术前沿', title: '未来科技', author: '加来道雄', desc: '2100年的世界', icon: '🔮'},
    
    // 领域8: 大国重器
    {category: '大国重器', title: '中国天眼', author: '南仁东', desc: 'FAST射电望远镜的故事', icon: '📡'},
    {category: '大国重器', title: '蛟龙入海', author: '许晨', desc: '深海探测的壮举', icon: '🐉'},
    {category: '大国重器', title: '嫦娥探月', author: '国防科工局', desc: '中国探月工程纪实', icon: '🌙'},
    {category: '大国重器', title: '北斗导航', author: '中国卫星导航', desc: '北斗系统建设历程', icon: '🛰️'},
    {category: '大国重器', title: '高铁风云录', author: '高铁见闻', desc: '中国高铁发展史', icon: '🚄'},
    {category: '大国重器', title: 'C919大飞机', author: '中国商飞', desc: '国产大飞机的诞生', icon: '✈️'},
    {category: '大国重器', title: '航母之路', author: '李杰', desc: '中国航母发展历程', icon: '🚢'},
    {category: '大国重器', title: '量子科技', author: '施一公', desc: '量子计算与通信', icon: '⚛️'}
];

function renderLibraryModule(container) {
    var categories = ['学习方法', '作文语文', '数学科学', '百科知识', '漫画科普', '成长励志', '技术前沿', '大国重器'];
    
    container.innerHTML = `
        <div style="padding: 16px;">
            <!-- 下载状态统计 -->
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 16px; margin-bottom: 16px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 16px; font-weight: 600;">📚 图书馆进度</div>
                    <button onclick="openDownloadProgress()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; cursor: pointer;">查看详情</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">60</div>
                        <div style="font-size: 11px; opacity: 0.9;">总书籍数</div>
                    </div>
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">8</div>
                        <div style="font-size: 11px; opacity: 0.9;">领域分类</div>
                    </div>
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">0</div>
                        <div style="font-size: 11px; opacity: 0.9;">已下载</div>
                    </div>
                </div>
            </div>
            
            <!-- 分类导航 -->
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px;">
                <button onclick="filterBooks('全部')" id="cat-btn-all" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 20px; font-size: 13px; white-space: nowrap; cursor: pointer;">全部</button>
                ` + categories.map(function(cat) {
                    return '<button onclick="filterBooks(\'' + cat + '\')" id="cat-btn-' + cat + '" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 20px; font-size: 13px; white-space: nowrap; cursor: pointer;">' + cat + '</button>';
                }).join('') + `
            </div>
            
            <!-- 书籍列表 -->
            <div id="books-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
    
    // 渲染所有书籍
    filterBooks('全部');
}

function filterBooks(category) {
    var books = window.LIBRARY_BOOKS;
    if (category !== '全部') {
        books = books.filter(function(b) { return b.category === category; });
    }
    
    // 更新按钮样式
    document.querySelectorAll('[id^="cat-btn-"]').forEach(function(btn) {
        btn.style.background = '#f5f5f5';
        btn.style.color = '#666';
    });
    var activeBtn = document.getElementById('cat-btn-' + (category === '全部' ? 'all' : category));
    if (activeBtn) {
        activeBtn.style.background = '#667eea';
        activeBtn.style.color = 'white';
    }
    
    var listEl = document.getElementById('books-list');
    listEl.innerHTML = books.map(function(book) {
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                    ` + book.icon + `
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 4px;">` + book.title + `</div>
                    <div style="font-size: 12px; color: #999; margin-bottom: 6px;">` + book.author + `</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">` + book.desc + `</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="background: #f0f3ff; color: #667eea; padding: 2px 8px; border-radius: 10px; font-size: 11px;">` + book.category + `</span>
                        <button onclick="downloadBook('` + book.title + `')" style="background: #43e97b; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">📥 加入书单</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function downloadBook(title) {
    var user = getCurrentUserData();
    if (!user.downloadedBooks) user.downloadedBooks = [];
    
    if (!user.downloadedBooks.includes(title)) {
        user.downloadedBooks.push(title);
        saveCurrentUserData(user);
        showToast('已将《' + title + '》加入书单 📚');
    } else {
        showToast('这本书已经在你的书单中了');
    }
}

function openDownloadProgress() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    var user = getCurrentUserData();
    var downloaded = user.downloadedBooks || [];
    var progress = Math.round((downloaded.length / window.LIBRARY_BOOKS.length) * 100);
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; text-align: center;">📋 下载进度</h3>
            
            <div style="background: #f5f5f5; height: 12px; border-radius: 6px; margin-bottom: 12px; overflow: hidden;">
                <div style="width: ` + progress + `%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 6px;"></div>
            </div>
            <div style="text-align: center; color: #667eea; font-weight: 600; margin-bottom: 20px;">${progress}% (${downloaded.length}/${window.LIBRARY_BOOKS.length})</div>
            
            <div style="margin-bottom: 16px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">📚 推荐下载网站</div>
                <div style="background: #f9f9f9; border-radius: 10px; padding: 12px; font-size: 13px; line-height: 1.8;">
                    <div>• 国家数字图书馆: http://www.nlc.cn</div>
                    <div>• 微信读书: https://weread.qq.com</div>
                    <div>• 得到App: https://www.dedao.cn</div>
                    <div>• 豆瓣阅读: https://read.douban.com</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">✅ 我的书单 (' + downloaded.length + ')</div>
                <div style="max-height: 200px; overflow-y: auto;">
                    ` + (downloaded.length === 0 ? '<div style="text-align: center; color: #999; padding: 20px;">还没有加入任何书籍</div>' : 
                    downloaded.map(function(title) {
                        return '<div style="background: white; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; font-size: 13px;">📖 ' + title + '</div>';
                    }).join('')) + `
                </div>
            </div>
            
            <button onclick="closeModal()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">关闭</button>
        </div>
    `;
}

window.renderLibraryModule = renderLibraryModule;
window.filterBooks = filterBooks;
window.downloadBook = downloadBook;
window.openDownloadProgress = openDownloadProgress;

// 兼容函数
function renderLibraryPage(container) {
    renderLibraryModule(container);
}
window.renderLibraryPage = renderLibraryPage;


// ===== js/modules/v255-modules.js =====
// V255: 其他模块占位渲染函数

function renderTrainingModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '🧠 认知训练', '综合认知能力训练正在开发中...');
    }
}

function renderAttentionModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '👁️ 注意力训练', '舒尔特方格、找不同等注意力训练游戏');
    }
}

function renderMemoryModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '📝 记忆力训练', '数字记忆、图片记忆等训练游戏');
    }
}

function renderFocusModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '🎯 专注力训练', '持续专注力提升训练');
    }
}

function renderReactionModule(container) {
    if (typeof renderGames === 'function') {
        renderGames(container);
    } else {
        renderFallbackPage(container, '⚡ 反应力训练', '反应速度测试与训练');
    }
}

function renderMindmapModule(container) {
    renderFallbackPage(container, '🌳 思维导图', '知识结构梳理与思维导图工具');
}

function renderGrowthModule(container) {
    if (typeof renderMap === 'function') {
        renderMap(container);
    } else {
        renderFallbackPage(container, '📈 成长记录', '学习成长数据统计与分析');
    }
}

function renderFallbackPage(container, title, desc) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; margin-bottom: 20px;">` + title.split(' ')[0] + `</div>
            <h3 style="margin: 0 0 12px 0; font-size: 18px;">` + title + `</h3>
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">` + desc + `</p>
            <button onclick="openFullscreenPage('games')" style="padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">🎮 前往训练游戏</button>
        </div>
    `;
}

window.renderTrainingModule = renderTrainingModule;
window.renderAttentionModule = renderAttentionModule;
window.renderMemoryModule = renderMemoryModule;
window.renderFocusModule = renderFocusModule;
window.renderReactionModule = renderReactionModule;
window.renderMindmapModule = renderMindmapModule;
window.renderGrowthModule = renderGrowthModule;
window.renderFallbackPage = renderFallbackPage;


// ===== js/modules/ui.js =====
// ============================================================
// Config - 全局配置
// ============================================================

// 版本: V144

function closeUserMenu() {
    var el = document.getElementById('user-dropdown');
    if (el) el.classList.remove('show');
}

function closeAboutModal() {
    const modal = document.getElementById('about-modal');
    if (modal) modal.classList.remove('show');
}

function closeAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    if (modal) modal.classList.remove('show');
}

function closeUpdateModal() {
    const modal = document.getElementById('update-modal');
    if (modal) modal.classList.remove('show');
}

function closeGoodbyeModal() {
    var modal = document.getElementById('goodbye-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(function() { modal.remove(); doExitSystem(); }, 300);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('show'); }

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}

function closeApiConfigModal() {
    const modal = document.getElementById('api-config-modal');
    if (modal) modal.classList.remove('show');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('show');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('show');
}

function showWelcomeModal(msg, userName, streakDays) {
    // 创建欢迎弹窗
    const modal = document.createElement('div');
    modal.id = 'welcome-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const hour = new Date().getHours();
    let bgGradient = '';
    if (hour >= 5 && hour < 12) {
        bgGradient = 'linear-gradient(135deg, #667eea, #764ba2)';
    } else if (hour >= 12 && hour < 18) {
        bgGradient = 'linear-gradient(135deg, #f093fb, #f5576c)';
    } else {
        bgGradient = 'linear-gradient(135deg, #4facfe, #00f2fe)';
    }
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
            max-width: 320px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div style="font-size:64px;margin-bottom:16px;">
                ${streakDays >= 7 ? '🏆' : streakDays >= 3 ? '🔥' : '👋'}
            </div>
            <div style="font-size:22px;font-weight:bold;color:#333;margin-bottom:12px;white-space:pre-line;">
                ${msg.split('\n')[0]}
            </div>
            ${streakDays > 0 ? `
                <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin:16px 0;">
                    <div style="font-size:14px;color:#666;">连续学习</div>
                    <div style="font-size:36px;font-weight:bold;color:#1A6BFF;">${streakDays} 天</div>
                </div>
            ` : ''}
            <div style="font-size:14px;color:#666;margin-bottom:20px;">
                ${streakDays >= 7 ? '坚持就是胜利，你是学习之星！' : streakDays >= 3 ? '保持好习惯，继续加油！' : '每天进步一点点！'}
            </div>
            <button onclick="closeWelcomeModal()" style="
                width: 100%;
                padding: 14px;
                background: ${bgGradient};
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">开始学习</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 3秒后自动关闭
    setTimeout(() => {
        closeWelcomeModal();
    }, 5000);
}

function showGoodbyeModal(user) {
    // 计算今日学习数据
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = user.studyDays?.[today] || 0;
    const todayQuestions = user.todayStats?.questions || 0;
    const todayCorrect = user.todayStats?.correct || 0;
    const accuracy = todayQuestions > 0 ? Math.round(todayCorrect / todayQuestions * 100) : 0;
    const streakDays = calculateStreakDays(user);
    
    // 构建告别语
    let voiceMsg = '';
    let summaryHtml = '';
    
    if (todayMinutes > 0 || todayQuestions > 0) {
        // 有学习记录
        voiceMsg = `${user.name}，今天学习了${todayMinutes}分钟，完成了${todayQuestions}道题目，正确率${accuracy}%。`;
        
        if (streakDays >= 7) {
            voiceMsg += `你已经连续学习${streakDays}天了，太厉害了！明天继续加油！`;
        } else if (streakDays >= 3) {
            voiceMsg += `继续保持，你是最棒的！`;
        } else {
            voiceMsg += `期待明天见！`;
        }
        
        summaryHtml = `
            <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin:16px 0;">
                <div style="font-size:14px;color:#666;margin-bottom:12px;">📊 今日学习总结</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#1A6BFF;">${todayMinutes}</div>
                        <div style="font-size:11px;color:#999;">分钟</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#43E97B;">${todayQuestions}</div>
                        <div style="font-size:11px;color:#999;">题目</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${accuracy}%</div>
                        <div style="font-size:11px;color:#999;">正确率</div>
                    </div>
                </div>
            </div>
            ${streakDays > 0 ? `
                <div style="background:linear-gradient(135deg,#FFD93D,#FF6B6B);border-radius:12px;padding:12px;margin-bottom:16px;color:white;">
                    🔥 已连续学习 <strong>${streakDays}</strong> 天
                </div>
            ` : ''}
        `;
    } else {
        // 无学习记录
        voiceMsg = `${user.name}，今天还没有学习哦，明天记得来学习！`;
        summaryHtml = `
            <div style="background:#fff3e0;border-radius:12px;padding:16px;margin:16px 0;">
                <div style="font-size:14px;color:#e65100;">📚 今天还没有学习记录</div>
                <div style="font-size:12px;color:#666;margin-top:8px;">明天记得来学习哦！</div>
            </div>
        `;
    }
    
    // 创建告别弹窗
    const modal = document.createElement('div');
    modal.id = 'goodbye-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
            max-width: 320px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div style="font-size:64px;margin-bottom:16px;">👋</div>
            <div style="font-size:22px;font-weight:bold;color:#333;margin-bottom:8px;">
                再见，${user.name}！
            </div>
            <div style="font-size:14px;color:#666;">辛苦了，休息一下吧</div>
            ${summaryHtml}
            <div style="font-size:13px;color:#999;margin-bottom:20px;">
                ${todayMinutes > 30 ? '🌟 今天的努力会变成明天的收获！' : '💪 明天继续加油！'}
            </div>
            <button onclick="closeGoodbyeModal()" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            ">确定退出</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 语音播报
    setTimeout(() => {
        speakText(voiceMsg);
    }, 300);
    
    // 3秒后自动关闭并退出
    setTimeout(function() {
        var modal = document.getElementById('goodbye-modal');
        if (modal) { modal.style.animation = 'fadeOut 0.3s ease'; setTimeout(function() { modal.remove(); doExitSystem(); }, 300); }
    }, 3000);
}

function openRegisterModal() {
    // 清空表单
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-phone').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password-confirm').value = '';
    document.getElementById('reg-grade').value = '';
    document.getElementById('reg-difficulty').value = '2';
    document.getElementById('reg-level').value = '1';
    
    document.getElementById('register-modal').classList.add('show');
}

function checkAndShowRegisterModal() {
    // 已禁用，直接更新UI
    updateUI();
}

function openHelp() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📖 使用帮助</div>
        <div style="max-height:300px;overflow-y:auto;">
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">🎯 训练模块</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • 每日完成8次训练可获得积分奖励<br>
                    • 难度级别影响题目难度和积分倍数<br>
                    • 连续训练可获得额外奖励
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">📚 母题训练</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • 选择年级和科目开始训练<br>
                    • 支持拍照上传题目获取AI解析<br>
                    • 错题自动加入错题本
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:8px;">🤖 AI功能</div>
                <div style="font-size:13px;color:#666;line-height:1.6;">
                    • DeepSeek AI 支持多学科问答<br>
                    • AI数字分身提供个性化辅导<br>
                    • 拍照识别自动解题
                </div>
            </div>
        </div>
        <button class="modal-close" onclick="closeModal()" style="margin-top:12px;">关闭</button>
    `;
}

function openFullscreenPage(module) {
    cleanupModuleState(); // 清理上一个模块的状态
    closeUserMenu();
    const container = document.getElementById('fullscreen-container');
    const titleEl = document.getElementById('fullscreen-title');
    const contentEl = document.getElementById('fullscreen-content');
    if (!container || !titleEl || !contentEl) return;
    
    const moduleTitles = {
        'practice': '🎯 AI精准练',
        'map': '🧠 认知地图',
        'plan': '📅 学习计划',
        'topics': '📚 母题训练',
        'method': '💡 学霸方法',
        'thinking': '🧩 思维训练',
        'podcast': '🎧 播客课堂',
        'video': '📺 视频课堂',
        'games': '🎮 训练游戏',
        'deepseek': '🤖 DeepSeek',
        'wrongbook': '📒 错题本',
        'pomodoro': '🍅 番茄闹钟',
        'my': '👤 我的主页',
        'settings': '⚙️ 设置'
    };
    
    titleEl.textContent = moduleTitles[module] || '模块';
    
    switch(module) {
        case 'practice': window.renderPractice(contentEl); break;
        case 'map': window.renderMap(contentEl); break;
        case 'plan': window.renderPlan(contentEl); break;
        case 'topics': window.renderTopics(contentEl); break;
        case 'method': window.renderMethod(contentEl); break;
        case 'thinking': window.renderThinking(contentEl); break;
        case 'podcast': window.renderPodcast(contentEl); break;
        case 'video': window.renderVideo(contentEl); break;
        case 'games': window.renderGames(contentEl); break;
        case 'deepseek': window.renderDeepseek(contentEl); break;
        case 'wrongbook': window.renderWrongbook(contentEl); break;
        case 'pomodoro': window.renderPomodoro(contentEl); break;
        case 'my': window.renderMyPage(contentEl); break;
        case 'journal': 
            if (typeof renderJournalModule === 'function') {
                window.renderJournalModule(contentEl);
            } else {
                contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>学习日记开发中...</p></div>';
            }
            break;
        case 'library': 
            if (typeof renderLibraryModule === 'function') {
                window.renderLibraryModule(contentEl);
            } else {
                contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>学习图书馆开发中...</p></div>';
            }
            break;
        case 'selfdrive': 
            if (typeof renderGoalPage === 'function') {
                const modal = document.getElementById('detail-modal');
                if (modal) modal.classList.add('show');
                window.renderGoalPage();
            } else {
                contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>自驱力训练开发中...</p></div>';
            }
            break;
        case 'growth': 
            contentEl.innerHTML = `
                <div style="padding:20px;">
                    <h3 style="margin-bottom:20px;font-size:18px;">📈 成长轨迹</h3>
                    <div style="background:white;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                        <canvas id="growth-chart-canvas" width="320" height="240" style="width:100%;height:auto;"></canvas>
                    </div>
                </div>
            `;
            setTimeout(() => {
                if (typeof renderGrowthChart === 'function') {
                    renderGrowthChart('growth-chart-canvas', 'week');
                }
            }, 100);
            break;
        default: contentEl.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>模块开发中...</p></div>';
    }
    
    // 统一添加返回按钮
    const existingBack = contentEl.querySelector('.module-back-btn');
    if (!existingBack) {
        const backBtn = document.createElement('button');
        backBtn.className = 'module-back-btn';
        backBtn.textContent = '← 返回首页';
        backBtn.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 32px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:24px;font-size:14px;cursor:pointer;z-index:100;backdrop-filter:blur(10px);box-shadow:0 2px 12px rgba(0,0,0,0.3);';
        backBtn.onclick = function() { closeFullscreenPage(); };
        contentEl.style.position = 'relative';
        contentEl.appendChild(backBtn);
    }
    
    container.classList.add('active');
}

function closeFullscreenPage() { cleanupModuleState(); const el = document.getElementById('fullscreen-container'); if (el) el.classList.remove('active'); }

function handleLogin() {
    const data = loadData();
    const btn = document.querySelector('.user-select-btn');
    if (!btn || !btn.dataset.userId) {
        showToast('请先选择学习者');
        return;
    }
    const userId = btn.dataset.userId;
    const diffEl = document.getElementById('login-difficulty');
    const difficulty = diffEl ? parseInt(diffEl.value) : 1;
    const user = data.users.find(u => u.id === userId);
    if (user) { 
        user.difficulty = difficulty; 
        user.lastLogin = Date.now(); 
        data.currentUser = userId; 
        saveData(data); 
        // 先切换页面，再更新UI
        showPage('home');
        setTimeout(() => {
            updateUI();
            syncTodayStats();
            // 登录成功后显示欢迎语并语音播报
            showWelcomeMessage(user);
        }, 50);
    } else {
        showToast('用户不存在，请重新选择');
    }
}

function logoutAndReturn() {
    const user = getCurrentUserData();
    
    // 停止TTS
    stopTTSSpeech();
    
    // 显示今日学习总结（如果有用户）
    if (user) {
        showGoodbyeModal(user);
    }
    
    // 保留当前用户，不清除currentUser（用户名保留）
    closeUserMenu();
    closeSettingsPanel();
}

// ============================================================
// 完整退出系统函数 - 清除所有状态并返回未登录状态
// 版本: V144
// ============================================================
function doExitSystem() {
    console.log("执行完整退出系统...");
    
    // 1. 保留currentUser（用户名保留），只重置运行时状态
    var data = loadData();
    // 不清除currentUser，保留用户名
    saveData(data);
    
    // 2. 停止TTS语音
    if (typeof stopTTSSpeech === "function") {
        stopTTSSpeech();
    }
    
    // 3. 停止所有音视频播放
    var hiddenAudio = document.getElementById("hidden-audio");
    if (hiddenAudio) { hiddenAudio.pause(); hiddenAudio.removeAttribute("src"); hiddenAudio.load(); }
    
    var evpVideo = document.getElementById("evp-video");
    if (evpVideo) { evpVideo.pause(); evpVideo.removeAttribute("src"); evpVideo.load(); }
    
    var vpVideo = document.getElementById("vp-video");
    if (vpVideo) { vpVideo.pause(); vpVideo.removeAttribute("src"); vpVideo.load(); }
    
    var mpAudio = document.getElementById("mp-audio-element");
    var mpVideo = document.getElementById("mp-video-element");
    if (mpAudio) { mpAudio.pause(); mpAudio.removeAttribute("src"); mpAudio.load(); }
    if (mpVideo) { mpVideo.pause(); mpVideo.removeAttribute("src"); mpVideo.load(); }
    
    // 4. 重置所有播放器状态
    if (typeof audioCtx !== "undefined") {
        audioCtx.isPlaying = false;
        audioCtx.currentTrack = null;
        audioCtx.currentIndex = -1;
    }
    
    if (typeof videoCtx !== "undefined") {
        videoCtx.isPlaying = false;
        videoCtx.currentVideo = null;
    }
    
    if (typeof mediaPlayer !== "undefined") {
        mediaPlayer.isPlaying = false;
        mediaPlayer.currentMedia = null;
        mediaPlayer.currentIndex = -1;
    }
    
    // 5. 停止所有定时器
    if (typeof window.pomodoroTimer !== "undefined" && window.pomodoroTimer) {
        clearInterval(window.pomodoroTimer);
        window.pomodoroTimer = null;
    }
    
    if (typeof CTM !== "undefined" && CTM.timers) {
        Object.keys(CTM.timers).forEach(function(key) {
            clearInterval(CTM.timers[key]);
        });
        CTM.timers = {};
    }
    
    if (typeof allTimers !== "undefined") {
        allTimers.forEach(function(timer) { clearInterval(timer); });
        window.allTimers = [];
    }
    
    // 6. 关闭所有弹窗
    document.querySelectorAll(".modal, .modal-overlay, .show").forEach(function(modal) {
        modal.classList.remove("show");
    });
    
    var goodbyeModal = document.getElementById("goodbye-modal");
    if (goodbyeModal) goodbyeModal.remove();
    
    var videoModal = document.getElementById("video-player-modal");
    if (videoModal) videoModal.classList.remove("show");
    
    var audioPlayer = document.getElementById("audio-player-fullscreen");
    if (audioPlayer) audioPlayer.classList.remove("show");
    
    var enhancedVideo = document.getElementById("enhanced-video-player");
    if (enhancedVideo) enhancedVideo.style.display = "none";
    
    var mediaPlayerFs = document.getElementById("media-player-fullscreen");
    if (mediaPlayerFs) mediaPlayerFs.classList.remove("show");
    
    var userDropdown = document.getElementById("user-dropdown");
    if (userDropdown) userDropdown.classList.remove("show");
    
    var settingsPanel = document.getElementById("settings-panel");
    if (settingsPanel) settingsPanel.classList.remove("show");
    
    // 7. 关闭所有全屏页面
    var fullscreenEl = document.getElementById("fullscreen-container");
    if (fullscreenEl) {
        fullscreenEl.classList.remove("active");
        var fullscreenContent = document.getElementById("fullscreen-content");
        if (fullscreenContent) fullscreenContent.innerHTML = "";
    }
    
    // 8. 关闭游戏全屏
    var gameArea = document.getElementById("game-area");
    if (gameArea) {
        gameArea.classList.remove("active");
        gameArea.innerHTML = "";
    }
    
    // 9. 回到首页，保留用户数据
    showPage("home");
    
    // 重置UI显示（用户数据保留，直接显示当前用户信息）
    updateUI();
    syncTodayStats();
    
    console.log("系统已退出，用户数据已保留");
}

// 辅助函数：收集并清除所有定时器
window.allTimers = [];
var originalSetInterval = window.setInterval;
window.setInterval = function(func, delay) {
    var timer = originalSetInterval(func, delay);
    window.allTimers.push(timer);
    return timer;
};
// V148-fix: 切换用户后关闭全屏页面，回到首页刷新
function switchToUser(userId) {
    var data = loadData();
    var user = data.users.find(function(u) { return u.id === userId; });
    
    if (!user) {
        showToast('用户不存在');
        return;
    }
    
    data.currentUser = userId;
    saveData(data);
    closeUserSwitchModal();
    
    // 切换用户后关闭全屏页面，回到首页刷新
    closeFullscreenPage();
    showPage('home');
    updateUI();
    syncTodayStats();
    showToast('已切换到: ' + user.name);
}

function deleteUser(userId) {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return;
    
    var data = loadData();
    var userIndex = data.users.findIndex(function(u) { return u.id === userId; });
    
    if (userIndex === -1) {
        showToast('用户不存在');
        return;
    }
    
    var userName = data.users[userIndex].name;
    data.users.splice(userIndex, 1);
    
    // 如果删除的是当前用户，切换到第一个用户
    if (data.currentUser === userId) {
        if (data.users.length > 0) {
            data.currentUser = data.users[0].id;
        } else {
            data.currentUser = null;
        }
    }
    
    saveData(data);
    showUserSwitchModal(); // 刷新用户列表
    updateUI();
    showToast('已删除用户: ' + userName);
}

function registerNewUser() {
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-password-confirm').value;
    const grade = document.getElementById('reg-grade').value;
    const difficulty = parseInt(document.getElementById('reg-difficulty').value);
    const level = parseInt(document.getElementById('reg-level').value);
    
    // 验证姓名
    if (!name) {
        showToast('请输入姓名');
        return;
    }
    if (name.length > 10) {
        showToast('姓名不能超过10个字符');
        return;
    }
    
    // 验证手机号
    if (!phone) {
        showToast('请输入手机号');
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        showToast('请输入正确的手机号');
        return;
    }
    
    // 检查手机号是否已注册
    const data = loadData();
    if (data.users.find(u => u.phone === phone)) {
        showToast('该手机号已注册，请直接登录或切换用户');
        return;
    }
    
    // 验证密码
    if (!password) {
        showToast('请输入密码');
        return;
    }
    if (password.length < 6) {
        showToast('密码长度至少6位');
        return;
    }
    
    // 验证确认密码
    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致');
        return;
    }
    
    // 验证年级
    if (!grade) {
        showToast('请选择年级');
        return;
    }
    
    // 创建新用户
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        phone: phone,
        password: password,
        grade: parseInt(grade),
        difficulty: difficulty,
        level: level,
        points: 0,
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            totalMinutes: 0,
            streakDays: 0,
            lastActiveDate: null
        },
        wrongNotes: [],
        completedTopics: [],
        weeklyProgress: {},
        gameScores: {},
        gameCounts: {},
        gameTimes: {},
        createTime: new Date().toISOString(),
        lastLoginTime: new Date().toISOString()
    };
    
    // 保存用户
    data.users.push(newUser);
    data.currentUser = newUser.id;
    saveData(data);
    
    // 关闭注册模态框
    document.getElementById('register-modal').classList.remove('show');
    
    // 更新UI
    updateUI();
    syncTodayStats();
    
    // 显示欢迎提示
    showToast('欢迎 ' + name + '！开始你的认知训练之旅吧！');
}

function openChangePasswordModal() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('change-password-modal').classList.add('show');
}

function closeCreateUserModal() { document.getElementById('create-user-modal').classList.remove('show'); document.getElementById('create-name').value = ''; }

function showCreateUserModal() { document.getElementById('create-user-modal').classList.add('show'); }

function openDifficultyModal() {
    const userData = getCurrentUserData();
    const currentLevel = userData ? userData.difficulty : 1;
    // 高亮当前选中的按钮
    document.querySelectorAll('.diff-btn').forEach(btn => {
        const isSelected = btn.dataset.level == currentLevel;
        btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
        btn.style.background = isSelected ? '#E8F4FF' : 'white';
    });
    document.getElementById('difficulty-modal').classList.add('show');
}

function closeDifficultyModal() {
    document.getElementById('difficulty-modal').classList.remove('show');
}

function setDifficulty(level) {
    const userData = getCurrentUserData();
    if (userData) {
        userData.difficulty = level;
        syncUserData(userData);
        // 更新首页难度显示
        const diffText = document.getElementById('difficulty-text');
        if (diffText) diffText.textContent = 'Lv.' + level;
        // 更新设置面板难度显示
        const settingsDiff = document.getElementById('settings-difficulty-display');
        if (settingsDiff) settingsDiff.textContent = 'Lv.' + level;
        // 更新下拉菜单中的难度信息
        const dropInfoEl = document.getElementById('dropdown-info');
        if (dropInfoEl) {
            dropInfoEl.textContent = gradeNames[userData.grade] + ' · Lv.' + level;
        }
        // 高亮当前选中的按钮
        document.querySelectorAll('.diff-btn').forEach(btn => {
            const isSelected = btn.dataset.level == level;
            btn.style.borderColor = isSelected ? '#1A6BFF' : '#ddd';
            btn.style.background = isSelected ? '#E8F4FF' : 'white';
        });
        showToast('难度已调整为 Lv.' + level);
    }
    closeDifficultyModal();
}

function toggleUserSelect() {
    document.getElementById('user-select-dropdown').classList.toggle('show');
    document.querySelector('.user-select-btn').classList.toggle('active');
}

function switchMainTab(tab, element) {
    // 更新导航栏状态
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');
    
    // 如果是首页，关闭所有全屏页面并清理状态
    if (tab === 'home') {
        closeFullscreenPage();
        closeSettingsPanel();
        cleanupModuleState(); // 清理所有模块状态，包括播放器
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function formatTimeFull(seconds) { if (!seconds || isNaN(seconds)) return '0:00'; var mins = Math.floor(seconds / 60); var secs = Math.floor(seconds % 60); return mins + ':' + (secs < 10 ? '0' : '') + secs; }

function generateCalendar() {
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    let html = '';
    days.forEach((d, i) => {
        const isToday = i === new Date().getDay() - 1;
        const checked = Math.random() > 0.5;
        html += '<div class="calendar-day ' + (isToday ? 'today' : '') + ' ' + (checked ? 'checked' : '') + '">' + d + '</div>';
    });
    return html;
}

function generateHeatmap() {
    let html = '';
    const colors = ['#f0f0f0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    for (let i = 0; i < 28; i++) {
        const level = Math.floor(Math.random() * 5);
        html += '<div class="heatmap-cell" style="background:' + colors[level] + ';"></div>';
    }
    return html;
}

function showToast(message, duration = 2000) {
    const existing = document.getElementById('custom-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function updateUI() {
    updateAllAvatarDisplays();

    const user = getCurrentUserData();
    if (!user) return;
    const greetingEl = document.getElementById('greeting-name');
    const diffEl = document.getElementById('difficulty-text');
    const avatarEl = document.getElementById('header-avatar');
    const dropNameEl = document.getElementById('dropdown-name');
    const dropInfoEl = document.getElementById('dropdown-info');
    if (greetingEl) greetingEl.textContent = user.name;
    if (diffEl) diffEl.textContent = 'Lv.' + user.difficulty;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0);
    if (dropNameEl) dropNameEl.textContent = user.name;
    if (dropInfoEl) dropInfoEl.textContent = gradeNames[user.grade] + ' · Lv.' + user.difficulty;
    
    // 更新首页推荐卡片
}

// 更新首页推荐卡片 - 从播客课程中随机选取
function updateRecommendCard() {
    // V151: 推荐卡片已禁用
    return;
}

function toggleSettingsGroup(groupId) {
    const group = document.getElementById('group-' + groupId);
    if (group) {
        group.classList.toggle('open');
    }
}

function openSettingsPanel() {
    const user = getCurrentUserData();
    if (user) {
        // 更新用户信息卡片
        const avatarEl = document.getElementById('settings-avatar');
        const nameEl = document.getElementById('settings-name');
        const gradeEl = document.getElementById('settings-grade');
        const diffEl = document.getElementById('settings-difficulty-display');
        const wrongCountEl = document.getElementById('settings-wrong-count');
        const trainCountEl = document.getElementById('settings-train-count');
        
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (nameEl) nameEl.textContent = user.name;
        if (gradeEl) gradeEl.textContent = gradeNames[user.grade] + ' · Lv.' + user.difficulty;
        if (diffEl) diffEl.textContent = 'Lv.' + user.difficulty;
        
        // 更新错题数量
        const wrongNotes = user.wrongNotes || [];
        if (wrongCountEl) wrongCountEl.textContent = '共 ' + wrongNotes.length + ' 道错题';
        
        // 更新训练次数
        const trainCount = user.trainCount || 8;
        if (trainCountEl) trainCountEl.value = trainCount;
        
        // 更新数据统计显示
        if (typeof updateDataStatsDisplay === 'function') {
            updateDataStatsDisplay();
        }
    }
    
    // 更新API配置状态显示
    if (typeof updateApiStatusDisplay === 'function') {
        updateApiStatusDisplay();
    }
    
    document.getElementById('settings-panel').style.display = 'block';
}

function closeSettingsPanel(e) {
    if (!e || e.target === document.getElementById('settings-panel')) {
        document.getElementById('settings-panel').style.display = 'none';
    }
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('show');
    }
}

function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    
    // 显示目标页面
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        target.style.display = pageId === 'login' ? 'flex' : 'block';
    }
    
    // 登录页面隐藏底部导航
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = pageId === 'login' ? 'none' : 'flex';
    }
}

function renderSlide() {
    const container = document.getElementById('slide-container');
    if(!container) return;
    container.innerHTML = '';
    slideBoard.forEach((num,i) => {
        const x = i%4, y = Math.floor(i/4);
        const cell = document.createElement('div');
        if(num===0) {
            cell.style.cssText = 'width:65px;height:65px;background:#ddd;border-radius:8px;';
        } else {
            cell.style.cssText = 'width:65px;height:65px;background:linear-gradient(135deg,#FB8C00,#FFA726);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:white;cursor:pointer;';
            cell.textContent = num;
            cell.onclick = () => moveSlide(x,y);
        }
        container.appendChild(cell);
    });
}


function selectThinkingOpt(el, selectedIdx, questionIdx) {
    const parent = el.parentElement;
    parent.querySelectorAll('.thinking-opt').forEach(opt => {
        opt.style.background = 'white';
        opt.style.borderColor = '#e0e0e0';
    });
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    el.dataset.selected = selectedIdx;
}

function drawRadarChart(data) {
    const svg = document.getElementById('cognitive-radar');
    if (!svg) return;
    
    const centerX = 200, centerY = 200;
    const maxRadius = 120;
    const labels = ['专注力', '记忆力', '思维力', '创造力', '情绪力', '元认知'];
    const values = [data.attention, data.memory, data.thinking, data.creativity, data.emotion, data.metacognition];
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const icons = ['🎯', '🧠', '💡', '🎨', '❤️', '🔮'];
    const numAxes = 6;
    const angleStep = (2 * Math.PI) / numAxes;
    
    let svgContent = '';
    
    // 定义渐变
    svgContent += `<defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.4"/>
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.3"/>
        </linearGradient>
    </defs>`;
    
    // 绘制背景网格（渐变色）
    for (let level = 1; level <= 5; level++) {
        const r = (maxRadius / 5) * level;
        let points = [];
        for (let i = 0; i < numAxes; i++) {
            const angle = -Math.PI / 2 + i * angleStep;
            points.push(`${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`);
        }
        const opacity = level === 5 ? 0.3 : 0.15;
        svgContent += `<polygon points="${points.join(' ')}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`;
    }
    
    // 绘制轴线（带颜色指示）
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        svgContent += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="${colors[i]}33" stroke-width="2"/>`;
        
        // 标签（带图标和数值）
        const labelX = centerX + (maxRadius + 30) * Math.cos(angle);
        const labelY = centerY + (maxRadius + 30) * Math.sin(angle);
        svgContent += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="bold" fill="${colors[i]}">${labels[i]}</text>`;
        
        // 数值标签
        const valueX = centerX + (maxRadius + 55) * Math.cos(angle);
        const valueY = centerY + (maxRadius + 55) * Math.sin(angle);
        svgContent += `<text x="${valueX}" y="${valueY}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#999">${values[i]}</text>`;
    }
    
    // 绘制数据区域（渐变填充）
    let dataPoints = [];
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const value = values[i] / 100;
        const r = maxRadius * value;
        dataPoints.push(`${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`);
    }
    svgContent += `<polygon points="${dataPoints.join(' ')}" fill="url(#radarGradient)" stroke="#667eea" stroke-width="2.5"/>`;
    
    // 绘制数据点（每个点不同颜色）
    for (let i = 0; i < numAxes; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const value = values[i] / 100;
        const r = maxRadius * value;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        // 外圈光晕
        svgContent += `<circle cx="${x}" cy="${y}" r="8" fill="${colors[i]}33"/>`;
        // 内圈实心点
        svgContent += `<circle cx="${x}" cy="${y}" r="5" fill="${colors[i]}" stroke="white" stroke-width="2"/>`;
    }
    
    svg.innerHTML = svgContent;
}

function calculateCognitiveData() {
    const user = getCurrentUserData();
    if (!user) {
        return getDefaultCognitiveData();
    }
    
    // 获取各类统计数据
    const gameScores = user.gameScores || {};
    const gameCounts = user.gameCounts || {};
    const methodStats = user.methodStats || {};
    const thinkingStats = user.thinkingStats || {};
    let todayStats = user.todayStats || { questions: 0, correct: 0, minutes: 0 };


// ====== 1. 专注力计算 ======
// 来源：舒尔特方格、视觉搜索、快速点击
    let attentionScore = 50; // 基础分
    const attentionGames = ['schulte', 'visual', 'tap'];
    attentionGames.forEach(g => {
        if (gameScores[g]) attentionScore += Math.min(gameScores[g] / 10, 12);
        if (gameCounts[g]) attentionScore += Math.min(gameCounts[g] * 2, 6);
    });


// ====== 2. 记忆力计算 ======
// 来源：数字记忆、图形记忆、学霸方法记忆训练
    let memoryScore = 50;
    const memoryGames = ['digit', 'pattern'];
    memoryGames.forEach(g => {
        if (gameScores[g]) memoryScore += Math.min(gameScores[g] / 8, 15);
        if (gameCounts[g]) memoryScore += Math.min(gameCounts[g] * 3, 8);
    });
    // 学霸方法 - 记忆法训练 (methodId: memory)
    if (methodStats['memory']) {
        const stats = methodStats['memory'];
        memoryScore += Math.min(stats.completed * 3, 15);
        if (stats.completed > 0) memoryScore += Math.round((stats.correct / stats.completed) * 10);
    }


// ====== 3. 思维力计算 ======
// 来源：图形推理、找不同、思维训练（逻辑、批判、系统、逆向、抽象）
    let thinkingScore = 50;
    const thinkingGames = ['reason', 'diff'];
    thinkingGames.forEach(g => {
        if (gameScores[g]) thinkingScore += Math.min(gameScores[g] / 10, 12);
        if (gameCounts[g]) thinkingScore += Math.min(gameCounts[g] * 2, 6);
    });
    // 思维训练统计 (type: logic, critical, system, reverse, abstract)
    const thinkingTypes = ['logic', 'critical', 'system', 'reverse', 'abstract'];
    thinkingTypes.forEach(t => {
        if (thinkingStats[t]) {
            thinkingScore += Math.min(thinkingStats[t].completed * 2, 5);
        }
    });


// ====== 4. 创造力计算 ======
// 来源：颜色识别游戏、思维训练（创意、发散）
    let creativityScore = 50;
    const creativityGames = ['color'];
    creativityGames.forEach(g => {
        if (gameScores[g]) creativityScore += Math.min(gameScores[g] / 10, 15);
        if (gameCounts[g]) creativityScore += Math.min(gameCounts[g] * 3, 10);
    });
    // 创意和发散思维 (type: creative, divergent)
    ['creative', 'divergent'].forEach(t => {
        if (thinkingStats[t]) {
            creativityScore += Math.min(thinkingStats[t].completed * 4, 12);
        }
    });


// ====== 5. 情绪力计算 ======
// 来源：学习连续性、游戏表现稳定性、训练完成度
    let emotionScore = 50;
    // 连续学习天数
    const streakDays = calculateStreakDays(user);
    emotionScore += Math.min(streakDays * 3, 15);
    // 今日学习时长
    if (todayStats.minutes > 0) emotionScore += Math.min(todayStats.minutes / 5, 10);
    // 游戏完成度（玩过的游戏种类数）
    const totalGamesPlayed = Object.keys(gameCounts).length;
    emotionScore += Math.min(totalGamesPlayed * 3, 15);


// ====== 6. 元认知计算 ======
// 来源：学霸方法训练总数、思维训练总数、AI问答次数
    let metacognitionScore = 50;
    // 学霸方法总训练量
    const methodTotal = Object.values(methodStats).reduce((sum, s) => sum + (s.completed || 0), 0);
    metacognitionScore += Math.min(methodTotal * 2, 15);
    // 思维训练总完成量
    const thinkingTotal = Object.values(thinkingStats).reduce((sum, s) => sum + (s.completed || 0), 0);
    metacognitionScore += Math.min(thinkingTotal * 2, 15);
    // AI问答次数
    if (user.aiChatCount) metacognitionScore += Math.min(user.aiChatCount, 10);
    
    // 限制在 20-100 范围
    return {
        attention: Math.max(20, Math.min(100, Math.round(attentionScore))),
        memory: Math.max(20, Math.min(100, Math.round(memoryScore))),
        thinking: Math.max(20, Math.min(100, Math.round(thinkingScore))),
        creativity: Math.max(20, Math.min(100, Math.round(creativityScore))),
        emotion: Math.max(20, Math.min(100, Math.round(emotionScore))),
        metacognition: Math.max(20, Math.min(100, Math.round(metacognitionScore))),
        // 额外数据用于详情展示
        sources: {
            attention: { games: attentionGames.filter(g => gameCounts[g]), method: false },
            memory: { games: memoryGames.filter(g => gameCounts[g]), method: !!methodStats['memory'] },
            thinking: { games: thinkingGames.filter(g => gameCounts[g]), training: thinkingTypes.filter(t => thinkingStats[t]) },
            creativity: { games: creativityGames.filter(g => gameCounts[g]), training: ['creative', 'divergent'].filter(t => thinkingStats[t]) },
            emotion: { streakDays, minutes: todayStats.minutes },
            metacognition: { methodTotal, thinkingTotal, aiChats: user.aiChatCount || 0 }
        }
    };
}

function getDefaultCognitiveData() {
    return {
        attention: 50,
        memory: 50,
        thinking: 50,
        creativity: 50,
        emotion: 50,
        metacognition: 50,
        sources: { attention: {}, memory: {}, thinking: {}, creativity: {}, emotion: {}, metacognition: {} }
    };
}

function renderCognitiveDetails(data) {
    const details = [
        { 
            key: 'attention', 
            label: '专注力', 
            icon: '🎯', 
            color: '#667eea',
            desc: '注意力集中与抗干扰能力',
            tip: '多玩舒尔特方格、视觉搜索、快速点击可提升'
        },
        { 
            key: 'memory', 
            label: '记忆力', 
            icon: '🧠', 
            color: '#764ba2',
            desc: '信息存储与提取能力',
            tip: '数字记忆、图形记忆游戏和记忆法训练可提升'
        },
        { 
            key: 'thinking', 
            label: '思维力', 
            icon: '💡', 
            color: '#f093fb',
            desc: '逻辑推理与问题解决能力',
            tip: '图形推理、找不同游戏和思维训练可提升'
        },
        { 
            key: 'creativity', 
            label: '创造力', 
            icon: '🎨', 
            color: '#4facfe',
            desc: '发散思维与创新思考能力',
            tip: '颜色识别游戏和创意思维训练可提升'
        },
        { 
            key: 'emotion', 
            label: '情绪力', 
            icon: '❤️', 
            color: '#43e97b',
            desc: '情绪管理与学习动力',
            tip: '保持连续学习、完成多种训练可提升'
        },
        { 
            key: 'metacognition', 
            label: '元认知', 
            icon: '🔮', 
            color: '#fa709a',
            desc: '自我监控与反思能力',
            tip: '学霸方法训练、思维训练、AI问答可提升'
        }
    ];
    
    return details.map(d => `
        <div class="cognitive-detail-card">
            <div class="detail-header">
                <div class="detail-icon" style="background: ${d.color}20;">${d.icon}</div>
                <div>
                    <div class="detail-title">${d.label}</div>
                    <div style="font-size:11px;color:#999;">${d.desc}</div>
                </div>
                <div class="detail-score" style="color: ${d.color};">${data[d.key]}</div>
            </div>
            <div class="detail-bar">
                <div class="detail-bar-fill" style="width: ${data[d.key]}%; background: ${d.color};"></div>
            </div>
            <div class="detail-sources">💡 ${d.tip}</div>
        </div>
    `).join('');
}

function renderCognitiveRadar(container) {
    // 获取用户认知数据（基于真实训练数据计算）
    const cognitiveData = calculateCognitiveData();
    
    const html = `
        <div class="cognitive-map-container">
            <div class="radar-chart-wrapper">
                <svg id="cognitive-radar" viewBox="0 0 400 400"></svg>
            </div>
            <div class="cognitive-stats">
                <h3 style="font-size:16px;font-weight:bold;margin-bottom:8px;">六维能力分析</h3>
                <p style="font-size:12px;color:#666;margin-bottom:12px;">基于你的训练数据实时计算</p>
                <div class="stat-grid">
                    ${renderStatItems(cognitiveData)}
                </div>
            </div>
            <div class="cognitive-detail" style="width:100%;margin-top:16px;">
                <h4 style="font-size:14px;font-weight:bold;margin-bottom:12px;">📊 能力详情</h4>
                ${renderCognitiveDetails(cognitiveData)}
            </div>
        </div>
        <style>
            .cognitive-map-container { display: flex; flex-direction: column; align-items: center; padding: 16px; }
            .radar-chart-wrapper { width: 280px; height: 280px; }
            .cognitive-stats { width: 100%; margin-top: 16px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
            .stat-item { padding: 12px 8px; border-radius: 12px; text-align: center; color: white; position: relative; }
            .stat-value { font-size: 22px; font-weight: bold; }
            .stat-label { font-size: 11px; opacity: 0.9; margin-top: 2px; }
            .stat-trend { font-size: 10px; position: absolute; top: 4px; right: 8px; }
            .cognitive-detail-card { background: white; border-radius: 12px; padding: 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .detail-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .detail-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
            .detail-title { font-size: 14px; font-weight: 600; }
            .detail-score { margin-left: auto; font-size: 18px; font-weight: bold; }
            .detail-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
            .detail-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
            .detail-sources { font-size: 11px; color: #999; margin-top: 8px; }
        </style>
    `;
    container.innerHTML = html;
    
    // 绘制雷达图
    setTimeout(() => drawRadarChart(cognitiveData), 100);
}

function renderStatItems(data) {
    const items = [
        {label: '专注力', value: data.attention, color: '#667eea', icon: '🎯'},
        {label: '记忆力', value: data.memory, color: '#764ba2', icon: '🧠'},
        {label: '思维力', value: data.thinking, color: '#f093fb', icon: '💡'},
        {label: '创造力', value: data.creativity, color: '#4facfe', icon: '🎨'},
        {label: '情绪力', value: data.emotion, color: '#43e97b', icon: '❤️'},
        {label: '元认知', value: data.metacognition, color: '#fa709a', icon: '🔮'}
    ];
    
    return items.map(item => `
        <div class="stat-item" style="background: linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%);">
            <div style="font-size:16px;margin-bottom:2px;">${item.icon}</div>
            <div class="stat-value">${item.value}</div>
            <div class="stat-label">${item.label}</div>
        </div>
    `).join('');
}

function updateAllAvatarDisplays() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const avatar = user.avatar || AVATAR_LIST[0].emoji;
    const headerAvatar = document.getElementById('header-avatar');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const settingsAvatar = document.getElementById('settings-avatar');
    
    if (headerAvatar) headerAvatar.textContent = avatar;
    if (dropdownAvatar) dropdownAvatar.textContent = avatar;
    if (settingsAvatar) settingsAvatar.textContent = user.name.charAt(0);
}

function openAbout() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
            <div style="font-size:48px;margin-bottom:12px;">🧠</div>
            <div style="font-size:20px;font-weight:bold;color:#333;margin-bottom:8px;">认知训练门户</div>
            <div style="font-size:13px;color:#999;margin-bottom:20px;">版本 V144</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">📱 产品介绍</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                认知训练门户是一款专为12-16岁青少年设计的注意力和记忆力训练应用。通过科学系统的训练方法，帮助学生提升学习效率，培养良好的学习习惯。
            </div>
        </div>
        <div style="background:#fff3e0;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">✨ 核心功能</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                • 12大训练模块（AI分身、母题、播客等）<br>
                • 23个认知训练游戏<br>
                • 378道经典母题库<br>
                • DeepSeek AI 智能辅导<br>
                • 个性化学习计划
            </div>
        </div>
        <div style="background:#e8f5e9;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:600;color:#333;margin-bottom:12px;">👨‍💻 开发团队</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
                Coze AI Agent 智能助手<br>
                技术支持：DeepSeek API
            </div>
        </div>
        <div style="text-align:center;font-size:12px;color:#999;margin-bottom:16px;">
            © 2026 认知训练门户 版权所有
        </div>
        <button class="modal-close" onclick="closeModal()" style="width:100%;">关闭</button>
    `;
}

function selectAvatar(emoji) {
    const user = getCurrentUserData();
    if (user) {
        user.avatar = emoji;
        syncUserData(user);
        updateAllAvatarDisplays();
        showToast('头像已更换');
    }
    closeAvatarModal();
}

function updateMethodStats() {
    const user = getCurrentUserData();
    const stats = user?.methodStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('method-completed');
    const accuracyEl = document.getElementById('method-accuracy');
    const notesEl = document.getElementById('method-notes');
    
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
    if (notesEl) notesEl.textContent = (user?.methodNotes?.length || 0);
}

function updateThinkingStats() {
    const user = getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('thinking-completed');
    const accuracyEl = document.getElementById('thinking-accuracy');
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
}

function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

function switchPlanDay(day) {
    window._planDay = day;
window.closeChangePasswordModal = closeChangePasswordModal;
window.closeCreateUserModal = closeCreateUserModal;
window.closeDifficultyModal = closeDifficultyModal;
window.closeEditProfileModal = closeEditProfileModal;
window.closeFullscreenPage = closeFullscreenPage;
window.closeUserMenu = closeUserMenu;
window.exitSystem = exitSystem;
window.logoutAndReturn = logoutAndReturn;
window.doExitSystem = doExitSystem;
window.openAbout = openAbout;
window.openChangePasswordModal = openChangePasswordModal;
window.openDifficultyModal = openDifficultyModal;
window.openEditProfileModal = openEditProfileModal;
window.openFullscreenPage = openFullscreenPage;
window.openHelp = openHelp;
window.openSettingsPanel = openSettingsPanel;
window.savePasswordChanges = savePasswordChanges;
window.setDifficulty = setDifficulty;
window.showCreateUserModal = showCreateUserModal;
window.switchMainTab = switchMainTab;
window.toggleSettingsGroup = toggleSettingsGroup;
window.toggleSoundEffects = toggleSoundEffects;
window.toggleUserMenu = toggleUserMenu;
window.openRegisterModal = openRegisterModal;
window.handleLogin = handleLogin;
window.initPortal = initPortal;
window.selectAvatar = selectAvatar;
window.selectGrade = selectGrade;
window.selectSubject = selectSubject;
window.closeAboutModal = closeAboutModal;
window.closeApiConfigModal = closeApiConfigModal;
window.closeAvatarModal = closeAvatarModal;
window.closeModal = closeModal;
window.closeUpdateModal = closeUpdateModal;
window.closeWelcomeModal = closeWelcomeModal;
window.deleteUser = deleteUser;
window.registerNewUser = registerNewUser;
window.showToast = showToast;
window.escapeHtml = escapeHtml; // V147-fix: 添加escapeHtml导出供全局使用
window.switchToUser = switchToUser;
window.updateUI = updateUI;
    const el = document.getElementById('module-content');
    if (el) renderPlan(el);
}

function showWelcomeMessage(user) {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let emoji = '';
    
    if (hour >= 5 && hour < 12) {
        timeGreeting = '早上好';
        emoji = '🌅';
    } else if (hour >= 12 && hour < 14) {
        timeGreeting = '中午好';
        emoji = '☀️';
    } else if (hour >= 14 && hour < 18) {
        timeGreeting = '下午好';
        emoji = '🌤️';
    } else if (hour >= 18 && hour < 22) {
        timeGreeting = '晚上好';
        emoji = '🌙';
    } else {
        timeGreeting = '夜深了';
        emoji = '🌟';
    }
    
    // 计算连续学习天数
    const streakDays = calculateStreakDays(user);
    
    // 构建欢迎语
    let welcomeMsg = `${emoji} ${timeGreeting}，${user.name}！`;
    let voiceMsg = `${timeGreeting}，${user.name}！`;
    
    if (streakDays > 0) {
        welcomeMsg += `\n🔥 已连续学习 ${streakDays} 天，太棒了！`;
        voiceMsg += `你已经连续学习${streakDays}天了，太棒了！继续加油！`;
    } else {
        welcomeMsg += '\n📚 今天是新的一天，开始你的学习之旅吧！';
        voiceMsg += '今天是新的一天，开始你的学习之旅吧！';
    }
    
    // 显示欢迎弹窗
    showWelcomeModal(welcomeMsg, user.name, streakDays);
    
    // 语音播报
    speakText(voiceMsg);
}

function toggleSoundEffects() {
    const enabled = SoundEffects.toggle();
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
        if (enabled) {
            btn.textContent = '已开启';
            btn.style.background = '#43E97B';
            // 播放提示音
            SoundEffects.playClick();
        } else {
            btn.textContent = '已关闭';
            btn.style.background = '#f0f0f0';
            btn.style.color = '#666';
        }
    }
}

function toggleTask(el) {
    const checkbox = el.querySelector('.task-checkbox');
    checkbox.classList.toggle('checked');
    el.classList.toggle('completed');
}





if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}



// ============================================================
// 初始化函数 - 页面加载完成后执行
// ============================================================

// 更新首页用户信息显示
function updateHomeUserInfo(user) {
    if (!user) {
        user = getCurrentUserData();
    }
    if (!user) return;
    
    const gradeNames = {5:'五年级',6:'六年级',7:'初一',8:'初二',9:'初三'};
    const name = user.name || '同学';
    const grade = gradeNames[user.grade] || '未知';
    const difficulty = user.difficulty || 1;
    const avatar = user.avatar || '👤';
    
    // 更新问候语
    const greetingEl = document.getElementById('greeting-name');
    if (greetingEl) greetingEl.textContent = name;
    
    // 更新下拉菜单
    const dropdownNameEl = document.getElementById('dropdown-name');
    if (dropdownNameEl) dropdownNameEl.textContent = name;
    
    const dropdownInfoEl = document.getElementById('dropdown-info');
    if (dropdownInfoEl) dropdownInfoEl.textContent = grade + ' · Lv.' + difficulty;
    
    // 更新难度标签
    const diffTextEl = document.getElementById('difficulty-text');
    if (diffTextEl) diffTextEl.textContent = 'Lv.' + difficulty;
    
    // 更新头像
    updateAllAvatarDisplays();
    
    // 更新今日统计
    updateTodayStats();
}

// 更新今日统计
function updateTodayStats() {
    const user = getCurrentUserData();
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { date: today, questions: 0, correct: 0, minutes: 0 };
    
    // 如果不是今天，重置统计
    if (todayStats.date !== today) {
        todayStats = { date: today, questions: 0, correct: 0, minutes: 0 };
        user.todayStats = todayStats;
        syncUserData(user);
    }
    
    // 计算连续学习天数（基于studyDays）
    const studyDays = user.studyDays || {};
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (studyDays[dateStr]) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    // 更新显示
    const questionsEl = document.getElementById('today-questions');
    const correctEl = document.getElementById('today-correct');
    const minutesEl = document.getElementById('today-minutes');
    const streakEl = document.getElementById('today-streak');
    
    if (questionsEl) questionsEl.textContent = todayStats.questions || 0;
    if (correctEl) correctEl.textContent = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) + '%' : '0%';
    if (minutesEl) minutesEl.textContent = todayStats.minutes || 0;
    if (streakEl) streakEl.textContent = streak;
}

// 应用初始化入口函数
function initPortal() {
    // 检查是否有用户数据
    const userData = getCurrentUserData();
    
    if (userData && userData.name) {
        // 已登录，更新首页用户信息
        updateHomeUserInfo(userData);
    } else {
        // 未登录，显示默认状态（同学）
        updateHomeUserInfo(null);
    }
    
    // 显示首页（默认就是显示的，这里确保状态正确）
    const homePage = document.getElementById('page-home');
    if (homePage) {
        homePage.style.display = 'block';
        homePage.classList.add('active');
    }
    
    console.log('Portal initialized');
}

// ============================================================

// ====== 删除用户功能 ======
function showDeleteUserModal() {
    closeUserMenu();
    var data = loadData();
    
    if (data.users.length === 0) {
        showToast('暂无用户');
        return;
    }
    
    var container = document.getElementById('delete-user-list');
    if (!container) {
        showToast('页面加载异常');
        return;
    }
    
    var colors = ['#667eea', '#FF9A63', '#43E97B'];
    var htmlContent = '';
    
    data.users.forEach(function(u, i) {
        var isCurrent = u.id === data.currentUser;
        htmlContent += '<div style="display:flex;align-items:center;gap:10px;padding:10px;background:' + (isCurrent ? '#fff3f3' : '#f8f9fa') + ';border-radius:8px;margin-bottom:8px;">';
        htmlContent += '<div style="background:' + colors[i % 3] + ';color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">' + u.name.charAt(0) + '</div>';
        htmlContent += '<div style="flex:1;">';
        htmlContent += '<div style="font-weight:600;">' + u.name + (isCurrent ? ' (当前用户)' : '') + '</div>';
        htmlContent += '<div style="font-size:11px;color:#999;">' + (gradeNames ? gradeNames[u.grade] || '' : '') + ' · Lv.' + u.difficulty + '</div>';
        htmlContent += '</div>';
        if (isCurrent) {
            htmlContent += '<span style="font-size:11px;color:#ff6b6b;">不可删除</span>';
        } else {
            htmlContent += '<button onclick="deleteUser(\'' + u.id + '\');showDeleteUserModal();" style="background:#ff6b6b;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;">删除</button>';
        }
        htmlContent += '</div>';
    });
    
    container.innerHTML = htmlContent;
    document.getElementById('delete-user-modal').classList.add('show');
}

function closeDeleteUserModal() {
    var el = document.getElementById('delete-user-modal');
    if (el) el.classList.remove('show');
}

window.showDeleteUserModal = showDeleteUserModal;
window.closeDeleteUserModal = closeDeleteUserModal;
window.updateRecommendCard = updateRecommendCard;

// ============================================================
// 数据导入导出功能
// ============================================================

// 显示数据统计弹窗
function showDataStatsModal() {
    const user = getCurrentUserData();
    if (!user) {
        showToast('请先登录');
        return;
    }
    
    const wrongNotes = user.wrongNotes || [];
    const stats = user.stats || {};
    const studyDays = user.studyDays || {};
    
    // 计算统计数据
    const totalDays = Object.keys(studyDays).length;
    const today = new Date().toISOString().split('T')[0];
    let todayStats = user.todayStats || { questions: 0, correct: 0, minutes: 0 };
    const accuracy = todayStats.questions > 0 ? Math.round(todayStats.correct / todayStats.questions * 100) : 0;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    modal.classList.add('show');
    content.innerHTML = '<div class="modal-header" style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><div class="modal-title">📊 学习数据统计</div></div><div style="max-height:400px;overflow-y:auto;"><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;color:white;margin-bottom:16px;"><div style="font-size:14px;opacity:0.9;margin-bottom:8px;">今日学习</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;"><div><div style="font-size:24px;font-weight:bold;">' + (todayStats.questions || 0) + '</div><div style="font-size:11px;opacity:0.8;">完成题目</div></div><div><div style="font-size:24px;font-weight:bold;">' + accuracy + '%</div><div style="font-size:11px;opacity:0.8;">正确率</div></div><div><div style="font-size:24px;font-weight:bold;">' + (todayStats.minutes || 0) + '</div><div style="font-size:11px;opacity:0.8;">学习分钟</div></div></div></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;"><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#FF6B6B;">' + wrongNotes.length + '</div><div style="font-size:11px;color:#666;">错题数量</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#43E97B;">' + totalDays + '</div><div style="font-size:11px;color:#666;">学习天数</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#667eea;">' + (stats.totalQuestions || 0) + '</div><div style="font-size:11px;color:#666;">累计题目</div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#FF9A63;">' + (stats.totalMinutes || 0) + '</div><div style="font-size:11px;color:#666;">累计分钟</div></div></div><div style="background:#f8f9fa;border-radius:10px;padding:14px;"><div style="font-size:13px;font-weight:600;margin-bottom:8px;color:#333;">📈 历史正确率</div><div style="font-size:28px;font-weight:bold;color:#43E97B;">' + (stats.totalQuestions > 0 ? Math.round((stats.correctAnswers || 0) / stats.totalQuestions * 100) : 0) + '%</div><div style="font-size:11px;color:#999;margin-top:4px;">' + (stats.correctAnswers || 0) + ' / ' + (stats.totalQuestions || 0) + ' 题</div></div></div><button class="modal-close" onclick="closeModal()" style="margin-top:16px;width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">关闭</button>';
}

// 导出数据
function exportData() {
    const data = loadData();
    if (!data) {
        showToast('导出失败，无数据');
        return;
    }
    const exportData = {
        version: 'V144',
        exportTime: new Date().toISOString(),
        users: data.users.map(function(u) {
            return {
                id: u.id, name: u.name, grade: u.grade, difficulty: u.difficulty, points: u.points,
                createdAt: u.createdAt, stats: u.stats, weeklyProgress: u.weeklyProgress,
                wrongNotes: u.wrongNotes, completedTopics: u.completedTopics, studyDays: u.studyDays,
                todayStats: u.todayStats, methodStats: u.methodStats, thinkingStats: u.thinkingStats,
                gameScores: u.gameScores, gameCounts: u.gameCounts, aiChatCount: u.aiChatCount
            };
        }),
        currentUser: data.currentUser
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognitive_training_backup_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('数据导出成功！');
}

// 导入数据
function importData() {
    const fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.click();
}

// 处理导入文件
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData || !importedData.users || !Array.isArray(importedData.users)) {
                showToast('文件格式错误');
                return;
            }
            if (!confirm('确定要导入数据吗？这将覆盖当前所有用户数据！')) return;
            const currentData = loadData();
            importedData.users.forEach(function(u) {
                const existingIdx = currentData.users.findIndex(function(cu) { return cu.id === u.id; });
                if (existingIdx >= 0) currentData.users[existingIdx] = u;
                else currentData.users.push(u);
            });
            if (importedData.currentUser && currentData.users.find(u => u.id === importedData.currentUser)) {
                currentData.currentUser = importedData.currentUser;
            }
            saveData(currentData);
            updateUI();
            showToast('数据导入成功！');
        } catch(err) {
            console.error('导入失败:', err);
            showToast('导入失败：' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

window.showDataStatsModal = showDataStatsModal;
window.exportData = exportData;
window.importData = importData;
window.handleImportFile = handleImportFile;


// 元认知预测弹窗 - 补充函数
function updatePredictionDisplay(value) {
    const el = document.getElementById('meta-prediction-value');
    if (el) el.textContent = value;
}

function cancelPrediction() {
    const modal = document.getElementById('metacognitive-modal');
    if (modal) modal.style.display = 'none';
    if (typeof window._currentGameAfterCancel === 'function') {
        window._currentGameAfterCancel();
    }
}

function confirmPrediction() {
    const input = document.getElementById('meta-prediction-input');
    const prediction = input ? parseInt(input.value) : 50;
    
    // 保存预测
    const data = loadData();
    const user = data.users.find(u => u.id === data.currentUser);
    if (user) {
        if (!user.metacognitive) user.metacognitive = { predictions: [] };
        user.metacognitive.predictions.push({
            game: window._currentGameForPrediction || 'unknown',
            prediction: prediction,
            timestamp: Date.now()
        });
        saveData(data);
    }
    
    const modal = document.getElementById('metacognitive-modal');
    if (modal) modal.style.display = 'none';
    
    // 继续游戏
    if (typeof window._startGameAfterPrediction === 'function') {
        window._startGameAfterPrediction();
    }
}

window.updatePredictionDisplay = updatePredictionDisplay;
window.cancelPrediction = cancelPrediction;
window.confirmPrediction = confirmPrediction;


/**
 * 系统资源管理模块
 * 
 * 功能：
 * 1. 相机调用（拍照 / 录像）
 * 2. 语音识别（语音输入）
 * 3. 文字输入（IME / 剪贴板）
 * 4. 权限统一管理
 * 5. 设备状态同步
 * 
 * 说明：ES6 模块化不影响浏览器原生 API，所有 Web API 全局可用
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';

const STORE_KEY = 'systemResources';

// 权限类型
export const PERMISSIONS = {
    CAMERA: 'camera',
    MICROPHONE: 'microphone',
    CLIPBOARD: 'clipboard-read',
    NOTIFICATIONS: 'notifications'
};

// ==================== 模块初始化 ====================

export function initSystemResources() {
    store.setState(STORE_KEY, {
        permissions: {
            camera: 'unknown',      // granted, denied, prompt, unknown
            microphone: 'unknown',
            clipboard: 'unknown',
            notifications: 'unknown'
        },
        devices: {
            cameras: [],
            microphones: []
        },
        activeStreams: {},          // 当前活跃的媒体流
        inputStates: {
            speechRecognition: false,
            handwriting: false
        }
    });
    
    // 检测浏览器支持
    detectBrowserSupport();
    
    console.log('[SystemResources] 系统资源管理模块初始化完成');
    eventBus.emit('module:ready', 'systemResources');
}

// 检测浏览器支持
function detectBrowserSupport() {
    const state = store.getState(STORE_KEY);
    
    const support = {
        mediaDevices: !!navigator.mediaDevices,
        getUserMedia: !!(navigator.mediaDevices?.getUserMedia),
        speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
        clipboard: !!navigator.clipboard,
        offlineAudio: !!window.AudioContext,
        indexedDB: !!window.indexedDB
    };
    
    store.setState(STORE_KEY, {
        ...state,
        browserSupport: support
    });
}

// ==================== 权限管理 ====================

/**
 * 请求权限
 * ES6 模块不影响权限请求，使用标准浏览器 API
 */
export async function requestPermission(permissionType) {
    try {
        let result;
        
        switch (permissionType) {
            case PERMISSIONS.CAMERA:
            case PERMISSIONS.MICROPHONE:
                // 相机/麦克风权限通过 getUserMedia 请求
                const stream = await navigator.mediaDevices.getUserMedia({
                    [permissionType]: true
                });
                stream.getTracks().forEach(track => track.stop()); // 立即关闭，仅用于请求权限
                result = 'granted';
                break;
                
            case PERMISSIONS.NOTIFICATIONS:
                result = await Notification.requestPermission();
                break;
                
            case PERMISSIONS.CLIPBOARD:
                // 剪贴板权限在首次读取时自动请求
                try {
                    await navigator.clipboard.readText();
                    result = 'granted';
                } catch {
                    result = 'denied';
                }
                break;
                
            default:
                throw new Error(`不支持的权限类型: ${permissionType}`);
        }
        
        // 更新状态
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, {
            ...state,
            permissions: {
                ...state.permissions,
                [permissionType]: result
            }
        });
        
        eventBus.emit(`permission:${permissionType}`, { granted: result === 'granted' });
        
        return result === 'granted';
        
    } catch (error) {
        console.warn(`[SystemResources] 请求 ${permissionType} 权限失败:`, error.message);
        
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, {
            ...state,
            permissions: {
                ...state.permissions,
                [permissionType]: 'denied'
            }
        });
        
        return false;
    }
}

/**
 * 检查权限状态
 */
export async function checkPermission(permissionType) {
    try {
        if (navigator.permissions) {
            const permissionName = permissionType === PERMISSIONS.CAMERA 
                ? 'camera' 
                : permissionType === PERMISSIONS.MICROPHONE
                    ? 'microphone'
                    : permissionType;
                    
            const status = await navigator.permissions.query({ name: permissionName });
            return status.state;
        }
        return 'unknown';
    } catch {
        return 'unknown';
    }
}

// ==================== 相机模块 ====================

/**
 * 获取相机列表
 */
export async function getCameraList() {
    if (!navigator.mediaDevices) {
        throw new Error('浏览器不支持媒体设备 API');
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    
    const state = store.getState(STORE_KEY);
    store.setState(STORE_KEY, {
        ...state,
        devices: {
            ...state.devices,
            cameras
        }
    });
    
    return cameras;
}

/**
 * 打开相机
 * @param {Object} options - cameraId, width, height
 * @returns {MediaStream} 媒体流
 */
export async function openCamera(options = {}) {
    const constraints = {
        video: {
            deviceId: options.cameraId ? { exact: options.cameraId } : undefined,
            width: options.width ? { ideal: options.width } : undefined,
            height: options.height ? { ideal: options.height } : undefined,
            facingMode: options.facingMode || 'user'  // user 前置, environment 后置
        }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // 保存流引用
    const streamId = `camera_${Date.now()}`;
    const state = store.getState(STORE_KEY);
    store.setState(STORE_KEY, {
        ...state,
        activeStreams: {
            ...state.activeStreams,
            [streamId]: stream
        }
    });
    
    eventBus.emit('camera:opened', { streamId, stream });
    return { streamId, stream };
}

/**
 * 拍照
 * @param {MediaStream} stream - 相机流
 * @returns {string} Base64 图片
 */
export function capturePhoto(stream) {
    const videoTrack = stream.getVideoTracks()[0];
    const capture = new ImageCapture(videoTrack);
    
    return capture.takePhoto().then(blob => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    });
}

/**
 * 关闭相机
 */
export function closeCamera(streamId) {
    const state = store.getState(STORE_KEY);
    const stream = state.activeStreams[streamId];
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        
        const newStreams = { ...state.activeStreams };
        delete newStreams[streamId];
        
        store.setState(STORE_KEY, {
            ...state,
            activeStreams: newStreams
        });
        
        eventBus.emit('camera:closed', { streamId });
    }
}

// ==================== 语音识别模块 ====================

let speechRecognition = null;

/**
 * 初始化语音识别
 */
export function initSpeechRecognition(lang = 'zh-CN') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        throw new Error('浏览器不支持语音识别');
    }
    
    speechRecognition = new SpeechRecognition();
    speechRecognition.lang = lang;
    speechRecognition.continuous = false;
    speechRecognition.interimResults = true;
    
    // 事件绑定
    speechRecognition.onstart = () => {
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, {
            ...state,
            inputStates: { ...state.inputStates, speechRecognition: true }
        });
        eventBus.emit('speech:started');
    };
    
    speechRecognition.onend = () => {
        const state = store.getState(STORE_KEY);
        store.setState(STORE_KEY, {
            ...state,
            inputStates: { ...state.inputStates, speechRecognition: false }
        });
        eventBus.emit('speech:ended');
    };
    
    speechRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        const isFinal = event.results[0].isFinal;
        eventBus.emit('speech:result', { transcript, isFinal });
    };
    
    speechRecognition.onerror = (event) => {
        console.error('[SpeechRecognition] 错误:', event.error);
        eventBus.emit('speech:error', { error: event.error });
    };
    
    return speechRecognition;
}

/**
 * 开始语音识别
 */
export function startSpeechRecognition() {
    if (!speechRecognition) {
        initSpeechRecognition();
    }
    
    try {
        speechRecognition.start();
        return true;
    } catch (error) {
        console.error('[SpeechRecognition] 启动失败:', error);
        return false;
    }
}

/**
 * 停止语音识别
 */
export function stopSpeechRecognition() {
    if (speechRecognition) {
        speechRecognition.stop();
    }
}

/**
 * 检查语音识别是否在运行
 */
export function isSpeechRecognitionActive() {
    const state = store.getState(STORE_KEY);
    return state.inputStates.speechRecognition;
}

// ==================== 文字输入 / 输入法 ====================

/**
 * 读取剪贴板文本
 */
export async function readClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        eventBus.emit('clipboard:read', { text });
        return text;
    } catch (error) {
        console.warn('[Clipboard] 读取失败:', error.message);
        throw new Error('无法访问剪贴板，请检查权限');
    }
}

/**
 * 写入剪贴板
 */
export async function writeClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        eventBus.emit('clipboard:written', { text });
        return true;
    } catch (error) {
        console.warn('[Clipboard] 写入失败:', error.message);
        throw new Error('无法写入剪贴板');
    }
}

/**
 * 文本转语音 (TTS)
 */
export function speakText(text, options = {}) {
    if (!window.speechSynthesis) {
        throw new Error('浏览器不支持语音合成');
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'zh-CN';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    
    utterance.onstart = () => eventBus.emit('tts:started', { text });
    utterance.onend = () => eventBus.emit('tts:ended', { text });
    utterance.onerror = (e) => eventBus.emit('tts:error', { error: e });
    
    window.speechSynthesis.speak(utterance);
}

/**
 * 停止语音播放
 */
export function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        eventBus.emit('tts:stopped');
    }
}

/**
 * 获取可用语音列表
 */
export function getVoices() {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
}

// ==================== 文件系统 ====================

/**
 * 触发文件选择（图片 / 文档 / 视频）
 */
export function selectFile(accept = 'image/*', multiple = false) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            resolve(multiple ? files : files[0]);
        };
        
        input.click();
    });
}

/**
 * 文件下载
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// ==================== 键盘快捷键 ====================

/**
 * 注册键盘快捷键
 */
export function registerShortcut(key, callback, options = {}) {
    const handler = (e) => {
        let match = e.key.toLowerCase() === key.toLowerCase();
        
        if (options.ctrl) match = match && e.ctrlKey;
        if (options.shift) match = match && e.shiftKey;
        if (options.alt) match = match && e.altKey;
        
        if (match) {
            e.preventDefault();
            callback(e);
        }
    };
    
    document.addEventListener('keydown', handler);
    
    // 返回注销函数
    return () => document.removeEventListener('keydown', handler);
}

// ==================== 导出 ====================

const systemResources = {
    PERMISSIONS,
    init: initSystemResources,
    requestPermission,
    checkPermission,
    
    // 相机
    getCameraList,
    openCamera,
    capturePhoto,
    closeCamera,
    
    // 语音
    initSpeechRecognition,
    startSpeechRecognition,
    stopSpeechRecognition,
    isSpeechRecognitionActive,
    speakText,
    stopSpeaking,
    getVoices,
    
    // 剪贴板
    readClipboard,
    writeClipboard,
    
    // 文件
    selectFile,
    downloadFile,
    
    // 快捷键
    registerShortcut
};

export default systemResources;

/* 事件总线模块
 * 提供发布订阅模式，实现模块间解耦通信
 */

const listeners = {};

// 注册事件监听
export function on(eventName, callback) {
    if (!listeners[eventName]) {
        listeners[eventName] = [];
    }
    listeners[eventName].push(callback);
    
    // 返回取消订阅函数
    return () => off(eventName, callback);
}

// 取消事件监听
export function off(eventName, callback) {
    if (!listeners[eventName]) return;
    
    listeners[eventName] = listeners[eventName].filter(
        cb => cb !== callback
    );
}

// 触发事件
export function emit(eventName, data = null) {
    if (!listeners[eventName]) return;
    
    listeners[eventName].forEach(callback => {
        try {
            callback(data);
        } catch (error) {
            console.error(`[EventBus] 事件处理错误 ${eventName}:`, error);
        }
    });
}

// 一次性监听
export function once(eventName, callback) {
    const wrapper = (data) => {
        callback(data);
        off(eventName, wrapper);
    };
    return on(eventName, wrapper);
}

// 常用事件名称常量
export const EVENTS = {
    MODULE_READY: 'module:ready',
    USER_CHANGED: 'user:changed',
    TASK_COMPLETE: 'task:complete',
    STATS_UPDATE: 'stats:update',
    TRAINING_PROGRESS: 'training:progress',
    NOTIFICATION: 'notification',
    ERROR: 'error'
};

// 统一导出对象
export const eventBus = {
    on,
    off,
    emit,
    once,
    EVENTS
};

export default eventBus;

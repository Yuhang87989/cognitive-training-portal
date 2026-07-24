/* 全局状态管理模块
 * 提供集中式状态存储，实现模块间数据共享
 */

import { eventBus } from './event-bus.js';

// 全局状态存储
const state = {};

// 状态变化监听器
const subscribers = {};

// 获取状态
export function getState(key) {
    return key ? state[key] : { ...state };
}

// 设置状态
export function setState(key, value) {
    const oldValue = state[key];
    state[key] = value;
    
    // 通知订阅者
    if (subscribers[key]) {
        subscribers[key].forEach(callback => {
            try {
                callback(value, oldValue);
            } catch (error) {
                console.error(`[Store] 状态订阅错误 ${key}:`, error);
            }
        });
    }
    
    // 广播状态变化事件
    eventBus.emit('state:change', { key, value, oldValue });
    
    return value;
}

// 订阅状态变化
export function subscribe(key, callback) {
    if (!subscribers[key]) {
        subscribers[key] = [];
    }
    subscribers[key].push(callback);
    
    // 返回取消订阅函数
    return () => {
        subscribers[key] = subscribers[key].filter(
            cb => cb !== callback
        );
    };
}

// 批量设置状态
export function batchSetState(stateMap) {
    Object.entries(stateMap).forEach(([key, value]) => {
        setState(key, value);
    });
}

// 获取所有状态键
export function getStateKeys() {
    return Object.keys(state);
}

// 清除状态
export function clearState(key) {
    if (key) {
        delete state[key];
        eventBus.emit('state:clear', { key });
    } else {
        // 清除所有状态（谨慎使用）
        Object.keys(state).forEach(key => delete state[key]);
        eventBus.emit('state:clearAll');
    }
}

// 初始化状态
export function initializeStore(initialData = {}) {
    Object.entries(initialData).forEach(([key, value]) => {
        state[key] = value;
    });
    console.log('[Store] 状态初始化完成');
}

// 统一导出对象
export const store = {
    getState,
    setState,
    subscribe,
    batchSetState,
    getStateKeys,
    clearState,
    initializeStore
};

export default store;

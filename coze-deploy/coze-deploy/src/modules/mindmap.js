/* 思维导图模块 - ES6 Modules 标准
 * 思维导图创建、编辑、管理系统
 * 支持多种节点样式、连线、拖拽、导出
 * 通过 store 共享状态，event-bus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';
import { showToast } from '../utils.js';

const STORAGE_KEY = 'mindmap_data';

// 预设模板
const TEMPLATES = [
    {
        id: 'template_learning',
        name: '学习计划',
        icon: '📚',
        desc: '规划你的学习目标和进度',
        data: {
            nodes: [
                { id: 'root', text: '我的学习计划', x: 400, y: 300, type: 'root', color: '#667eea' },
                { id: 'n1', text: '本周目标', x: 200, y: 180, parent: 'root', color: '#4facfe' },
                { id: 'n2', text: '本月目标', x: 600, y: 180, parent: 'root', color: '#43e97b' },
                { id: 'n3', text: '长期目标', x: 200, y: 420, parent: 'root', color: '#fa709a' },
                { id: 'n4', text: '资源准备', x: 600, y: 420, parent: 'root', color: '#f093fb' }
            ]
        }
    },
    {
        id: 'template_thinking',
        name: '头脑风暴',
        icon: '💡',
        desc: '发散思维，记录创意灵感',
        data: {
            nodes: [
                { id: 'root', text: '创意中心', x: 400, y: 300, type: 'root', color: '#ff6b6b' },
                { id: 'n1', text: '灵感来源', x: 180, y: 150, parent: 'root', color: '#ffd93d' },
                { id: 'n2', text: '待验证', x: 400, y: 120, parent: 'root', color: '#6bcb77' },
                { id: 'n3', text: '已实现', x: 620, y: 150, parent: 'root', color: '#4d96ff' },
                { id: 'n4', text: '待改进', x: 180, y: 450, parent: 'root', color: '#ff8585' },
                { id: 'n5', text: '参考资料', x: 620, y: 450, parent: 'root', color: '#c44569' }
            ]
        }
    },
    {
        id: 'template_project',
        name: '项目管理',
        icon: '📋',
        desc: '项目规划、任务分解',
        data: {
            nodes: [
                { id: 'root', text: '项目名称', x: 400, y: 300, type: 'root', color: '#a855f7' },
                { id: 'n1', text: '目标', x: 150, y: 150, parent: 'root', color: '#8b5cf6' },
                { id: 'n2', text: '时间表', x: 400, y: 120, parent: 'root', color: '#6366f1' },
                { id: 'n3', text: '资源', x: 650, y: 150, parent: 'root', color: '#818cf8' },
                { id: 'n4', text: '风险', x: 150, y: 450, parent: 'root', color: '#f472b6' },
                { id: 'n5', text: '交付物', x: 400, y: 480, parent: 'root', color: '#fb7185' },
                { id: 'n6', text: '团队', x: 650, y: 450, parent: 'root', color: '#f97316' }
            ]
        }
    },
    {
        id: 'template_book',
        name: '读书笔记',
        icon: '📖',
        desc: '整理书籍要点和感悟',
        data: {
            nodes: [
                { id: 'root', text: '书名', x: 400, y: 300, type: 'root', color: '#10b981' },
                { id: 'n1', text: '核心观点', x: 180, y: 160, parent: 'root', color: '#34d399' },
                { id: 'n2', text: '重要案例', x: 620, y: 160, parent: 'root', color: '#6ee7b7' },
                { id: 'n3', text: '我的感悟', x: 180, y: 440, parent: 'root', color: '#a7f3d0' },
                { id: 'n4', text: '行动计划', x: 620, y: 440, parent: 'root', color: '#d1fae5' }
            ]
        }
    }
];

// 节点颜色主题
const COLOR_THEMES = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#a8edea', '#fed6e3', '#ffecd2', '#d299c2',
    '#89f7fe', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'
];

// 默认数据结构
const DEFAULT_DATA = {
    mindmaps: [],
    currentMindmapId: null,
    settings: {
        canvasWidth: 800,
        canvasHeight: 600,
        showGrid: true,
        snapToGrid: false,
        zoom: 1
    }
};

// 初始化思维导图模块
export function initMindmap() {
    // 从存储加载数据
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    
    // 初始化 store
    store.setState('mindmap', data);
    
    console.log('[Mindmap] 思维导图模块初始化完成');
    eventBus.emit('module:ready', 'mindmap');
}

// 获取数据
export function getMindmapData() {
    return store.getState('mindmap');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('mindmap', data);
    eventBus.emit('mindmap:updated', data);
}

// ========== 思维导图 CRUD ==========

// 创建新思维导图
export function createMindmap(name, templateId = null) {
    const data = getMindmapData();
    const id = `mindmap_${Date.now()}`;
    
    let mindmapData = {
        nodes: [
            { id: 'root', text: '中心主题', x: 400, y: 300, type: 'root', color: '#667eea' }
        ]
    };
    
    // 如果选择了模板，使用模板数据
    if (templateId) {
        const template = TEMPLATES.find(t => t.id === templateId);
        if (template) {
            mindmapData = JSON.parse(JSON.stringify(template.data));
            // 更新根节点文本为用户输入的名称
            const rootNode = mindmapData.nodes.find(n => n.type === 'root');
            if (rootNode) {
                rootNode.text = name;
            }
        }
    }
    
    const newMindmap = {
        id,
        name,
        data: mindmapData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString()
    };
    
    data.mindmaps.unshift(newMindmap);
    data.currentMindmapId = id;
    saveData(data);
    
    showToast('思维导图已创建！');
    return newMindmap;
}

// 获取所有思维导图
export function getAllMindmaps() {
    const data = getMindmapData();
    return data.mindmaps;
}

// 获取单个思维导图
export function getMindmapById(id) {
    const data = getMindmapData();
    return data.mindmaps.find(m => m.id === id);
}

// 更新思维导图
export function updateMindmap(id, updates) {
    const data = getMindmapData();
    const mindmap = data.mindmaps.find(m => m.id === id);
    
    if (mindmap) {
        Object.assign(mindmap, updates);
        mindmap.updatedAt = new Date().toISOString();
        saveData(data);
        return mindmap;
    }
    return null;
}

// 删除思维导图
export function deleteMindmap(id) {
    const data = getMindmapData();
    const index = data.mindmaps.findIndex(m => m.id === id);
    
    if (index > -1) {
        data.mindmaps.splice(index, 1);
        if (data.currentMindmapId === id) {
            data.currentMindmapId = data.mindmaps.length > 0 ? data.mindmaps[0].id : null;
        }
        saveData(data);
        showToast('思维导图已删除');
        return true;
    }
    return false;
}

// 打开思维导图
export function openMindmap(id) {
    const data = getMindmapData();
    const mindmap = data.mindmaps.find(m => m.id === id);
    
    if (mindmap) {
        mindmap.lastOpenedAt = new Date().toISOString();
        data.currentMindmapId = id;
        saveData(data);
        return mindmap;
    }
    return null;
}

// ========== 节点操作 ==========

// 添加节点
export function addNode(mindmapId, parentId, text, position = {}) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return null;
    
    const parentNode = mindmap.data.nodes.find(n => n.id === parentId);
    if (!parentNode) return null;
    
    const nodeId = `node_${Date.now()}`;
    const newNode = {
        id: nodeId,
        text: text || '新节点',
        x: position.x || (parentNode.x + (Math.random() - 0.5) * 200),
        y: position.y || (parentNode.y + (Math.random() - 0.5) * 150),
        parent: parentId,
        color: position.color || COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)],
        expanded: true
    };
    
    mindmap.data.nodes.push(newNode);
    updateMindmap(mindmapId, { data: mindmap.data });
    
    return newNode;
}

// 更新节点
export function updateNode(mindmapId, nodeId, updates) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return null;
    
    const node = mindmap.data.nodes.find(n => n.id === nodeId);
    if (node) {
        Object.assign(node, updates);
        updateMindmap(mindmapId, { data: mindmap.data });
        return node;
    }
    return null;
}

// 删除节点
export function deleteNode(mindmapId, nodeId) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return false;
    
    // 不能删除根节点
    const node = mindmap.data.nodes.find(n => n.id === nodeId);
    if (!node || node.type === 'root') return false;
    
    // 递归删除所有子节点
    const deleteChildren = (parentId) => {
        const children = mindmap.data.nodes.filter(n => n.parent === parentId);
        children.forEach(child => deleteChildren(child.id));
        mindmap.data.nodes = mindmap.data.nodes.filter(n => n.id !== parentId);
    };
    
    deleteChildren(nodeId);
    updateMindmap(mindmapId, { data: mindmap.data });
    
    return true;
}

// 移动节点
export function moveNode(mindmapId, nodeId, x, y) {
    return updateNode(mindmapId, nodeId, { x, y });
}

// 获取子节点
export function getChildNodes(mindmapId, nodeId) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return [];
    return mindmap.data.nodes.filter(n => n.parent === nodeId);
}

// ========== 模板相关 ==========

// 获取所有模板
export function getTemplates() {
    return TEMPLATES;
}

// 从模板创建
export function createFromTemplate(templateId, name) {
    return createMindmap(name, templateId);
}

// ========== 导出功能 ==========

// 导出为 JSON
export function exportAsJSON(mindmapId) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return null;
    
    const jsonStr = JSON.stringify(mindmap, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mindmap.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('导出成功！');
    return mindmap;
}

// 导出为纯文本
export function exportAsText(mindmapId) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return null;
    
    const root = mindmap.data.nodes.find(n => n.type === 'root');
    let text = `# ${mindmap.name}\n\n`;
    
    const printNode = (node, depth = 0) => {
        const indent = '  '.repeat(depth);
        const bullet = depth === 0 ? '# ' : depth === 1 ? '## ' : '- ';
        text += `${indent}${bullet}${node.text}\n`;
        
        const children = mindmap.data.nodes.filter(n => n.parent === node.id);
        children.forEach(child => printNode(child, depth + 1));
    };
    
    if (root) {
        printNode(root);
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mindmap.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('导出成功！');
    return text;
}

// ========== 统计功能 ==========

// 获取思维导图统计
export function getMindmapStats(mindmapId) {
    const mindmap = getMindmapById(mindmapId);
    if (!mindmap) return null;
    
    const nodes = mindmap.data.nodes;
    const maxDepth = calculateMaxDepth(mindmap);
    
    return {
        totalNodes: nodes.length,
        rootNodes: nodes.filter(n => n.type === 'root').length,
        leafNodes: nodes.filter(n => !nodes.some(c => c.parent === n.id)).length,
        maxDepth,
        createdAt: mindmap.createdAt,
        updatedAt: mindmap.updatedAt
    };
}

// 计算最大深度
function calculateMaxDepth(mindmap) {
    const root = mindmap.data.nodes.find(n => n.type === 'root');
    if (!root) return 0;
    
    const getDepth = (nodeId, currentDepth = 0) => {
        const children = mindmap.data.nodes.filter(n => n.parent === nodeId);
        if (children.length === 0) return currentDepth;
        return Math.max(...children.map(c => getDepth(c.id, currentDepth + 1)));
    };
    
    return getDepth(root.id);
}

// 获取颜色主题
export function getColorThemes() {
    return COLOR_THEMES;
}

export default {
    init: initMindmap,
    getData: getMindmapData,
    create: createMindmap,
    getAll: getAllMindmaps,
    getById: getMindmapById,
    update: updateMindmap,
    delete: deleteMindmap,
    open: openMindmap,
    addNode,
    updateNode,
    deleteNode,
    moveNode,
    getChildNodes,
    getTemplates,
    createFromTemplate,
    exportAsJSON,
    exportAsText,
    getStats: getMindmapStats,
    getColorThemes
};

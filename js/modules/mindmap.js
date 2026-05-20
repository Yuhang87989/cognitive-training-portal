// ============================================================
// V287 思维导图模块 - 手机适配版 + IIFE封装
// 功能：可拖拽节点、编辑节点、添加子节点、删除节点、自动保存
// ============================================================

(function() {
    const MINDMAP_STORAGE_KEY = 'mindmap_data';
    let currentMindMap = null;
    let draggedNode = null;
    let dragOffset = { x: 0, y: 0 };
    let selectedNode = null;

// 加载思维导图数据
function loadMindMap() {
    const saved = localStorage.getItem(MINDMAP_STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    // 默认思维导图
    return {
        root: {
            id: 'root',
            text: '我的学习',
            x: 0.5,
            y: 0.5,
            color: '#667eea',
            children: [
                {
                    id: 'node1',
                    text: '语文',
                    x: 0.25,
                    y: 0.25,
                    color: '#f093fb',
                    children: []
                },
                {
                    id: 'node2',
                    text: '数学',
                    x: 0.75,
                    y: 0.25,
                    color: '#4facfe',
                    children: []
                },
                {
                    id: 'node3',
                    text: '英语',
                    x: 0.25,
                    y: 0.75,
                    color: '#43e97b',
                    children: []
                },
                {
                    id: 'node4',
                    text: '计划',
                    x: 0.75,
                    y: 0.75,
                    color: '#fa709a',
                    children: []
                }
            ]
        }
    };
}

// 保存思维导图
function saveMindMap() {
    localStorage.setItem(MINDMAP_STORAGE_KEY, JSON.stringify(currentMindMap));
}

// 渲染思维导图
function renderMindMap(container) {
    currentMindMap = loadMindMap();
    
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部工具栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <button onclick="history.back()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <span style="font-weight:bold;font-size:16px;color:#333;">🧠 思维导图</span>
                <button onclick="resetMindMap()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">🔄 重置</button>
            </div>
            
            <!-- 操作提示 -->
            <div style="padding:8px 16px;background:#e3f2fd;color:#1976d2;font-size:12px;display:flex;gap:16px;justify-content:center;flex-shrink:0;">
                <span>👆 点击编辑</span>
                <span>✚ 双击添加子节点</span>
                <span>🖐️ 拖拽移动</span>
            </div>
            
            <!-- 思维导图画布 -->
            <div id="mindmapCanvas" style="flex:1;position:relative;overflow:auto;margin:16px;border-radius:16px;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.05);min-height:400px;">
            </div>
            
            <!-- 底部操作栏 -->
            <div id="nodeActions" style="padding:12px 16px;background:white;box-shadow:0 -2px 4px rgba(0,0,0,0.05);display:none;gap:12px;flex-shrink:0;">
                <button onclick="editSelectedNode()" style="flex:1;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;font-weight:bold;">✏️ 编辑</button>
                <button onclick="addChildToSelected()" style="flex:1;padding:12px;background:#4caf50;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;font-weight:bold;">➕ 子节点</button>
                <button onclick="deleteSelectedNode()" style="flex:1;padding:12px;background:#f44336;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;font-weight:bold;">🗑️ 删除</button>
            </div>
        </div>
    `;
    
    renderCanvas();
}

// 渲染画布
function renderCanvas() {
    const canvas = document.getElementById('mindmapCanvas');
    if (!canvas) return;
    
    // 计算画布实际大小
    const canvasWidth = Math.max(canvas.clientWidth, 600);
    const canvasHeight = Math.max(canvas.clientHeight, 500);
    
    let html = '';
    
    // 递归渲染节点和连线
    function renderNode(node, parent = null) {
        // 渲染连线
        if (parent) {
            const x1 = parent.x * 100;
            const y1 = parent.y * 100;
            const x2 = node.x * 100;
            const y2 = node.y * 100;
            
            html += `
                <svg style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1;">
                    <line x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" stroke="${node.color || '#ccc'}" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        }
        
        // 渲染节点
        const isSelected = selectedNode && selectedNode.id === node.id;
        html += `
            <div class="mindmap-node" 
                 id="node-${node.id}"
                 style="position:absolute;left:${node.x * 100}%;top:${node.y * 100}%;transform:translate(-50%,-50%);
                        padding:10px 16px;background:${node.color || '#667eea'};color:white;border-radius:20px;
                        font-size:14px;font-weight:bold;cursor:pointer;z-index:${isSelected ? 100 : 10};
                        box-shadow:${isSelected ? '0 0 0 3px #ffd700, 0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.2)'};;
                        white-space:nowrap;user-select:none;touch-action:none;"
                 onmousedown="startDrag(event, '${node.id}')"
                 ontouchstart="startDrag(event, '${node.id}')"
                 onclick="selectNode('${node.id}')"
                 ondblclick="promptAddChild('${node.id}')">
                ${node.text}
            </div>
        `;
        
        // 渲染子节点
        if (node.children) {
            node.children.forEach(child => renderNode(child, node));
        }
    }
    
    renderNode(currentMindMap.root);
    canvas.innerHTML = html;
    
    // 显示/隐藏操作栏
    const actions = document.getElementById('nodeActions');
    if (actions) {
        actions.style.display = selectedNode ? 'flex' : 'none';
    }
}

// 查找节点
function findNode(id, node = currentMindMap.root) {
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNode(id, child);
            if (found) return found;
        }
    }
    return null;
}

// 查找父节点
function findParentNode(id, node = currentMindMap.root, parent = null) {
    if (node.id === id) return parent;
    if (node.children) {
        for (const child of node.children) {
            const found = findParentNode(id, child, node);
            if (found) return found;
        }
    }
    return null;
}

// 选中节点
function selectNode(id) {
    selectedNode = findNode(id);
    renderCanvas();
}

// 开始拖拽
function startDrag(e, id) {
    if (e.button && e.button !== 0) return;
    
    const node = findNode(id);
    if (!node) return;
    
    draggedNode = node;
    selectedNode = node;
    
    const el = document.getElementById(`node-${id}`);
    const rect = el.getBoundingClientRect();
    const canvasRect = document.getElementById('mindmapCanvas').getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragOffset.x = clientX - rect.left - rect.width / 2;
    dragOffset.y = clientY - rect.top - rect.height / 2;
    
    e.preventDefault();
}

// 拖拽移动
document.addEventListener('mousemove', handleDrag);
document.addEventListener('touchmove', handleDrag, { passive: false });

function handleDrag(e) {
    if (!draggedNode) return;
    e.preventDefault();
    
    const canvas = document.getElementById('mindmapCanvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // 计算相对位置（百分比）
    draggedNode.x = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
    draggedNode.y = Math.max(0.05, Math.min(0.95, (clientY - rect.top) / rect.height));
    
    renderCanvas();
}

// 结束拖拽
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function endDrag() {
    if (draggedNode) {
        saveMindMap();
        draggedNode = null;
    }
}

// 编辑选中节点
function editSelectedNode() {
    if (!selectedNode) return;
    const newText = prompt('请输入节点名称：', selectedNode.text);
    if (newText && newText.trim()) {
        selectedNode.text = newText.trim();
        saveMindMap();
        renderCanvas();
    }
}

// 提示添加子节点
function promptAddChild(id) {
    const node = findNode(id);
    if (!node) return;
    
    const text = prompt('请输入子节点名称：');
    if (text && text.trim()) {
        if (!node.children) node.children = [];
        
        // 生成新ID
        const newId = 'node_' + Date.now();
        
        // 计算位置（在父节点周围）
        const angle = (node.children.length * 45 + 30) * Math.PI / 180;
        const distance = 0.2;
        
        node.children.push({
            id: newId,
            text: text.trim(),
            x: Math.max(0.05, Math.min(0.95, node.x + Math.cos(angle) * distance)),
            y: Math.max(0.05, Math.min(0.95, node.y + Math.sin(angle) * distance)),
            color: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ffd93d'][Math.floor(Math.random() * 6)],
            children: []
        });
        
        saveMindMap();
        renderCanvas();
    }
}

// 给选中节点添加子节点
function addChildToSelected() {
    if (selectedNode) {
        promptAddChild(selectedNode.id);
    }
}

// 删除选中节点
function deleteSelectedNode() {
    if (!selectedNode || selectedNode.id === 'root') {
        if (selectedNode && selectedNode.id === 'root') {
            alert('根节点不能删除');
        }
        return;
    }
    
    if (confirm(`确定要删除"${selectedNode.text}"及其所有子节点吗？`)) {
        const parent = findParentNode(selectedNode.id);
        if (parent && parent.children) {
            parent.children = parent.children.filter(c => c.id !== selectedNode.id);
            selectedNode = null;
            saveMindMap();
            renderCanvas();
        }
    }
}

// 重置思维导图
function resetMindMap() {
    if (confirm('确定要重置思维导图吗？所有更改会丢失。')) {
        localStorage.removeItem(MINDMAP_STORAGE_KEY);
        currentMindMap = loadMindMap();
        selectedNode = null;
        renderCanvas();
    }
}

    // 挂载到window
    window.renderMindMap = renderMindMap;
    window.selectNode = selectNode;
    window.startDrag = startDrag;
    window.editSelectedNode = editSelectedNode;
    window.addChildToSelected = addChildToSelected;
    window.promptAddChild = promptAddChild;
    window.deleteSelectedNode = deleteSelectedNode;
    window.resetMindMap = resetMindMap;
    
    console.log('[V287] 思维导图模块加载完成');
})();

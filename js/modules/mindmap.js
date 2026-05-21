// ============================================================
// V295 思维导图模块 - 恢复完整交互功能
// ============================================================

window.mindmapState = {
    nodes: [],
    selectedNode: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
};

window.renderMindMap = function(container) {
    console.log('[V295] renderMindMap 被调用，container:', container);
    
    // 从DataSync加载节点数据
    var savedData = window.DataSync.get('mindmap');
    if (savedData && savedData.nodes && savedData.nodes.length > 0) {
        window.mindmapState.nodes = savedData.nodes;
    } else {
        // 默认节点数据
        window.mindmapState.nodes = [
            { id: 1, text: '我的学习', x: 50, y: 50, color: '#667eea', isRoot: true },
            { id: 2, text: '🔤 语文', x: 25, y: 28, color: '#f093fb', parent: 1 },
            { id: 3, text: '🔢 数学', x: 75, y: 28, color: '#4facfe', parent: 1 },
            { id: 4, text: '📚 英语', x: 25, y: 68, color: '#43e97b', parent: 1 },
            { id: 5, text: '📅 计划', x: 75, y: 68, color: '#fa709a', parent: 1 }
        ];
    }
    
    // 保存到DataSync
    window.saveMindMapData = function() {
        window.DataSync.set('mindmap', { nodes: window.mindmapState.nodes, version: 1 });
    };
    
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部工具栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <button onclick="history.back()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <span style="font-weight:bold;font-size:16px;color:#333;">🧠 思维导图</span>
                <button onclick="window.resetMindMap()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">🔄 重置</button>
            </div>
            
            <!-- 导图区域 -->
            <div id="mindmap-canvas" style="flex:1;position:relative;overflow:hidden;background:linear-gradient(135deg,#667eea10,#764ba210);">
                <!-- SVG 连接线层 -->
                <svg id="mindmap-svg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></svg>
                <!-- 节点层 -->
                <div id="mindmap-nodes" style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>
            </div>
            
            <!-- 底部操作栏 -->
            <div style="padding:12px 16px;background:white;border-top:1px solid #eee;display:flex;gap:12px;justify-content:center;flex-shrink:0;">
                <button onclick="window.addChildNode()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">➕ 添加子节点</button>
                <button onclick="window.editSelectedNode()" style="padding:8px 16px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">✏️ 编辑节点</button>
                <button onclick="window.deleteSelectedNode()" style="padding:8px 16px;background:#fa709a;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">🗑️ 删除节点</button>
            </div>
            
            <!-- 版本提示 -->
            <div style="padding:8px 16px;background:#e3f2fd;border-top:1px solid #bbdefb;">
                <div style="font-size:12px;color:#1976d2;text-align:center;">✅ V295 - 思维导图完整功能版</div>
            </div>
        </div>
    `;
    
    // 渲染所有节点和连接线
    window.renderAllMindMapNodes();
    
    console.log('[V295] 思维导图渲染完成');
};

// 渲染所有节点和连接线
window.renderAllMindMapNodes = function() {
    const nodesContainer = document.getElementById('mindmap-nodes');
    const svgContainer = document.getElementById('mindmap-svg');
    
    if (!nodesContainer || !svgContainer) return;
    
    // 清空
    nodesContainer.innerHTML = '';
    svgContainer.innerHTML = '';
    
    // 先渲染连接线
    window.mindmapState.nodes.forEach(node => {
        if (node.parent) {
            const parentNode = window.mindmapState.nodes.find(n => n.id === node.parent);
            if (parentNode) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', node.x + '%');
                line.setAttribute('y1', node.y + '%');
                line.setAttribute('x2', parentNode.x + '%');
                line.setAttribute('y2', parentNode.y + '%');
                line.setAttribute('stroke', '#ddd');
                line.setAttribute('stroke-width', '2');
                svgContainer.appendChild(line);
            }
        }
    });
    
    // 渲染节点
    window.mindmapState.nodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.id = 'mindmap-node-' + node.id;
        nodeEl.style.cssText = `
            position:absolute;
            left:${node.x}%;
            top:${node.y}%;
            transform:translate(-50%,-50%);
            padding:${node.isRoot ? '12px 20px' : '10px 16px'};
            background:${node.color};
            color:white;
            border-radius:${node.isRoot ? '12px' : '10px'};
            font-weight:bold;
            box-shadow:0 4px 12px ${node.color}30;
            cursor:move;
            user-select:none;
            z-index:${window.mindmapState.selectedNode === node.id ? '10' : '1'};
            border:${window.mindmapState.selectedNode === node.id ? '3px solid #ffd700' : 'none'};
        `;
        nodeEl.textContent = node.text;
        
        // 点击选择
        nodeEl.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            window.selectMindMapNode(node.id);
            
            // 开始拖拽
            window.mindmapState.isDragging = true;
            const rect = nodesContainer.getBoundingClientRect();
            window.mindmapState.dragOffset = {
                x: e.clientX - rect.left - (node.x * rect.width / 100),
                y: e.clientY - rect.top - (node.y * rect.height / 100)
            };
        });
        
        // 双击编辑
        nodeEl.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            window.selectMindMapNode(node.id);
            window.editSelectedNode();
        });
        
        nodesContainer.appendChild(nodeEl);
    });
    
    // 画布点击取消选择
    document.getElementById('mindmap-canvas').addEventListener('mousedown', function(e) {
        if (e.target === this || e.target.id === 'mindmap-nodes') {
            window.selectMindMapNode(null);
        }
    });
    
    // 拖拽移动
    document.addEventListener('mousemove', function(e) {
        if (window.mindmapState.isDragging && window.mindmapState.selectedNode) {
            const canvas = document.getElementById('mindmap-canvas');
            const rect = canvas.getBoundingClientRect();
            const node = window.mindmapState.nodes.find(n => n.id === window.mindmapState.selectedNode);
            if (node) {
                const newX = Math.max(5, Math.min(95, ((e.clientX - rect.left + window.mindmapState.dragOffset.x) / rect.width) * 100));
                const newY = Math.max(5, Math.min(95, ((e.clientY - rect.top + window.mindmapState.dragOffset.y) / rect.height) * 100));
                node.x = newX;
                node.y = newY;
                window.renderAllMindMapNodes();
            }
        }
    });
    
    // 停止拖拽
    document.addEventListener('mouseup', function() {
        if (window.mindmapState.isDragging) {
            window.mindmapState.isDragging = false;
            window.saveMindMapData();
        }
    });
};

// 选择节点
window.selectMindMapNode = function(nodeId) {
    window.mindmapState.selectedNode = nodeId;
    window.renderAllMindMapNodes();
};

// 添加子节点
window.addChildNode = function() {
    if (!window.mindmapState.selectedNode) {
        alert('请先选择一个节点');
        return;
    }
    
    const parentNode = window.mindmapState.nodes.find(n => n.id === window.mindmapState.selectedNode);
    if (!parentNode) return;
    
    const text = prompt('请输入新节点名称：', '新节点');
    if (!text) return;
    
    const newId = Math.max(...window.mindmapState.nodes.map(n => n.id)) + 1;
    const colors = ['#f093fb', '#4facfe', '#43e97b', '#fa709a', '#667eea', '#ff9a9e', '#a8edea', '#fed6e3'];
    
    window.mindmapState.nodes.push({
        id: newId,
        text: text,
        x: parentNode.x + (Math.random() - 0.5) * 30,
        y: parentNode.y + (Math.random() - 0.5) * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        parent: parentNode.id
    });
    
    window.renderAllMindMapNodes();
    window.saveMindMapData();
};

// 编辑选中节点
window.editSelectedNode = function() {
    if (!window.mindmapState.selectedNode) {
        alert('请先选择一个节点');
        return;
    }
    
    const node = window.mindmapState.nodes.find(n => n.id === window.mindmapState.selectedNode);
    if (!node) return;
    
    const newText = prompt('请输入节点名称：', node.text);
    if (newText) {
        node.text = newText;
        window.renderAllMindMapNodes();
        window.saveMindMapData();
    }
};

// 删除选中节点
window.deleteSelectedNode = function() {
    if (!window.mindmapState.selectedNode) {
        alert('请先选择一个节点');
        return;
    }
    
    const node = window.mindmapState.nodes.find(n => n.id === window.mindmapState.selectedNode);
    if (!node) return;
    
    if (node.isRoot) {
        alert('根节点不能删除');
        return;
    }
    
    if (confirm('确定要删除这个节点吗？')) {
        // 递归删除子节点
        function deleteChildren(parentId) {
            const children = window.mindmapState.nodes.filter(n => n.parent === parentId);
            children.forEach(child => {
                deleteChildren(child.id);
            });
            window.mindmapState.nodes = window.mindmapState.nodes.filter(n => n.id !== parentId);
        }
        
        deleteChildren(node.id);
        window.mindmapState.selectedNode = null;
        window.renderAllMindMapNodes();
        window.saveMindMapData();
    }
};

// 重置思维导图
window.resetMindMap = function() {
    if (confirm('确定要重置思维导图吗？')) {
        window.mindmapState.nodes = [
            { id: 1, text: '我的学习', x: 50, y: 50, color: '#667eea', isRoot: true },
            { id: 2, text: '🔤 语文', x: 25, y: 28, color: '#f093fb', parent: 1 },
            { id: 3, text: '🔢 数学', x: 75, y: 28, color: '#4facfe', parent: 1 },
            { id: 4, text: '📚 英语', x: 25, y: 68, color: '#43e97b', parent: 1 },
            { id: 5, text: '📅 计划', x: 75, y: 68, color: '#fa709a', parent: 1 }
        ];
        window.mindmapState.selectedNode = null;
        window.renderAllMindMapNodes();
        window.saveMindMapData();
    }
};

console.log('[V295] 思维导图模块加载完成，window.renderMindMap:', typeof window.renderMindMap);

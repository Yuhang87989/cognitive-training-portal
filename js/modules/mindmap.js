// ============================================================
// V297 思维导图模块 - 完善拖拽、多文件、多样式
// ============================================================

window.mindmapState = {
    currentMapId: 'default',
    maps: {},
    selectedNode: null,
    draggingNode: null,
    dragStartPos: { x: 0, y: 0 },
    nodeStartPos: { x: 0, y: 0 },
    styles: ['default', 'colorful', 'minimal', 'ocean', 'sunset'],
    currentStyle: 'default'
};

// 获取样式配置
window.getMindMapStyle = function(styleName) {
    const styles = {
        default: {
            bg: 'linear-gradient(135deg,#667eea10,#764ba210)',
            rootColor: 'linear-gradient(135deg,#667eea,#764ba2)',
            colors: ['#f093fb', '#4facfe', '#43e97b', '#fa709a', '#667eea', '#ff9a9e', '#a8edea', '#fed6e3']
        },
        colorful: {
            bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)',
            rootColor: 'linear-gradient(135deg,#ff6b6b,#ffa502)',
            colors: ['#ff6b6b', '#ffa502', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6', '#e056fd', '#686de0']
        },
        minimal: {
            bg: '#f8f9fa',
            rootColor: '#333',
            colors: ['#555', '#666', '#777', '#888', '#999', '#444', '#333', '#555']
        },
        ocean: {
            bg: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)',
            rootColor: 'linear-gradient(135deg,#667eea,#764ba2)',
            colors: ['#0077b6', '#00b4d8', '#48cae4', '#90e0ef', '#caf0f8', '#023e8a', '#03045e', '#0096c7']
        },
        sunset: {
            bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)',
            rootColor: 'linear-gradient(135deg,#e87a4e,#ff9a63)',
            colors: ['#e87a4e', '#ff9a63', '#ffb347', '#ff6b6b', '#ee5a24', '#f39c12', '#e74c3c', '#d35400']
        }
    };
    return styles[styleName] || styles.default;
};

// 初始化导图列表
window.initMindMapList = function() {
    const savedData = window.DataSync.get('mindmap');
    if (savedData && savedData.maps) {
        window.mindmapState.maps = savedData.maps;
        window.mindmapState.currentMapId = savedData.currentMapId || 'default';
        window.mindmapState.currentStyle = savedData.currentStyle || 'default';
    } else {
        // 创建默认导图
        window.mindmapState.maps = {
            default: {
                id: 'default',
                name: '我的学习导图',
                createTime: new Date().toISOString(),
                nodes: [
                    { id: 1, text: '我的学习', x: 50, y: 50, color: '#667eea', isRoot: true },
                    { id: 2, text: '🔤 语文', x: 25, y: 28, color: '#f093fb', parent: 1 },
                    { id: 3, text: '🔢 数学', x: 75, y: 28, color: '#4facfe', parent: 1 },
                    { id: 4, text: '📚 英语', x: 25, y: 68, color: '#43e97b', parent: 1 },
                    { id: 5, text: '📅 计划', x: 75, y: 68, color: '#fa709a', parent: 1 }
                ]
            }
        };
        window.mindmapState.currentMapId = 'default';
    }
};

// 获取当前导图
window.getCurrentMindMap = function() {
    return window.mindmapState.maps[window.mindmapState.currentMapId];
};

// 保存所有导图数据
window.saveMindMapData = function() {
    window.DataSync.set('mindmap', {
        maps: window.mindmapState.maps,
        currentMapId: window.mindmapState.currentMapId,
        currentStyle: window.mindmapState.currentStyle,
        version: 1
    });
    console.log('[MindMap] 数据已保存');
};

window.renderMindMap = function(container) {
    console.log('[V297] renderMindMap 被调用，container:', container);
    
    // 初始化数据
    window.initMindMapList();
    
    const currentMap = window.getCurrentMindMap();
    const style = window.getMindMapStyle(window.mindmapState.currentStyle);
    
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部工具栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:10px;flex-wrap:wrap;">
                <button onclick="history.back()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <span style="font-weight:bold;font-size:16px;color:#333;flex:1;text-align:center;">🧠 ${currentMap.name}</span>
                <div style="display:flex;gap:8px;">
                    <select id="mindmap-selector" style="padding:6px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;">
                        ${Object.values(window.mindmapState.maps).map(map => 
                            `<option value="${map.id}" ${map.id === window.mindmapState.currentMapId ? 'selected' : ''}>${map.name}</option>`
                        ).join('')}
                    </select>
                    <button id="btn-new-map" style="padding:8px 12px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">+ 新建</button>
                    <button id="btn-reset-map" style="padding:8px 12px;background:#fa709a;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">重置</button>
                </div>
            </div>
            
            <!-- 样式选择 -->
            <div style="padding:8px 16px;background:#fafafa;display:flex;gap:8px;align-items:center;flex-shrink:0;flex-wrap:wrap;">
                <span style="font-size:13px;color:#666;">样式：</span>
                ${window.mindmapState.styles.map((s, index) => `
                    <button onclick="window.switchMindMapStyle('${s}')" class="style-btn" data-style="${s}" style="padding:4px 10px;background:${s === window.mindmapState.currentStyle ? '#667eea' : '#fff'};color:${s === window.mindmapState.currentStyle ? 'white' : '#666'};border:1px solid #ddd;border-radius:6px;font-size:12px;cursor:pointer;">${s === 'default' ? '默认' : s === 'colorful' ? '多彩' : s === 'minimal' ? '简约' : s === 'ocean' ? '海洋' : '日落'}</button>
                `).join('')}
            </div>
            
            <!-- 导图区域 -->
            <div id="mindmap-canvas" style="flex:1;position:relative;overflow:hidden;background:${style.bg};touch-action:pan-x pan-y;">
                <!-- SVG 连接线层 -->
                <svg id="mindmap-svg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></svg>
                <!-- 节点层 -->
                <div id="mindmap-nodes" style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>
            </div>
            
            <!-- 底部操作栏 -->
            <div style="padding:12px 16px;background:white;border-top:1px solid #eee;display:flex;gap:12px;justify-content:center;flex-shrink:0;flex-wrap:wrap;">
                <button onclick="window.addChildNode()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">➕ 添加子节点</button>
                <button onclick="window.editSelectedNode()" style="padding:8px 16px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">✏️ 编辑节点</button>
                <button onclick="window.deleteSelectedNode()" style="padding:8px 16px;background:#fa709a;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">🗑️ 删除节点</button>
                <button onclick="window.renameMindMap()" style="padding:8px 16px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">📝 重命名导图</button>
            </div>
            
            <!-- 提示 -->
            <div style="padding:8px 16px;background:#e3f2fd;border-top:1px solid #bbdefb;">
                <div style="font-size:12px;color:#1976d2;text-align:center;">💡 拖拽节点移动位置 | 双击编辑 | 下拉切换导图</div>
            </div>
        </div>
    `;
    
    // 渲染所有节点和连接线
    window.renderAllMindMapNodes();
    
    // 绑定事件监听器
    window.bindMindMapEvents(container);
    
    console.log('[V297] 思维导图渲染完成');
};

// 绑定思维导图的所有事件
window.bindMindMapEvents = function(container) {
    // 延时绑定，确保DOM完全渲染
    setTimeout(function() {
        console.log('[MindMap] 开始绑定事件，样式按钮数量:', document.querySelectorAll('.style-btn').length);
        
        // 导图选择下拉框
        const selector = document.getElementById('mindmap-selector');
        if (selector) {
            selector.addEventListener('change', function(e) {
                console.log('[MindMap] 切换导图:', e.target.value);
                window.switchMindMap(e.target.value);
            });
        }
        
        // 新建导图按钮
        const newBtn = document.getElementById('btn-new-map');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                console.log('[MindMap] 点击新建按钮');
                window.newMindMap();
            });
        }
        
        // 重置导图按钮
        const resetBtn = document.getElementById('btn-reset-map');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                console.log('[MindMap] 点击重置按钮');
                window.resetMindMap();
            });
        }
        
        // 样式切换按钮 - 使用document全局查找
        const styleBtns = document.querySelectorAll('.style-btn');
        console.log('[MindMap] 找到样式按钮数量:', styleBtns.length);
        
        styleBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const styleName = this.getAttribute('data-style');
                console.log('[MindMap] 点击样式按钮，切换样式:', styleName);
                window.switchMindMapStyle(styleName);
            });
        });
        
        console.log('[MindMap] 事件绑定完成');
    }, 50);
};

// 渲染所有节点和连接线
window.renderAllMindMapNodes = function() {
    const nodesContainer = document.getElementById('mindmap-nodes');
    const svgContainer = document.getElementById('mindmap-svg');
    const currentMap = window.getCurrentMindMap();
    const style = window.getMindMapStyle(window.mindmapState.currentStyle);
    
    if (!nodesContainer || !svgContainer) return;
    
    // 清空
    nodesContainer.innerHTML = '';
    svgContainer.innerHTML = '';
    
    // 先渲染连接线
    currentMap.nodes.forEach(node => {
        if (node.parent) {
            const parentNode = currentMap.nodes.find(n => n.id === node.parent);
            if (parentNode) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', node.x + '%');
                line.setAttribute('y1', node.y + '%');
                line.setAttribute('x2', parentNode.x + '%');
                line.setAttribute('y2', parentNode.y + '%');
                line.setAttribute('stroke', '#888');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-opacity', '0.5');
                svgContainer.appendChild(line);
            }
        }
    });
    
    // 渲染节点
    currentMap.nodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.id = 'mindmap-node-' + node.id;
        nodeEl.style.cssText = `
            position:absolute;
            left:${node.x}%;
            top:${node.y}%;
            transform:translate(-50%,-50%);
            padding:${node.isRoot ? '12px 24px' : '10px 16px'};
            background:${node.color};
            color:white;
            border-radius:${node.isRoot ? '16px' : '12px'};
            font-weight:bold;
            font-size:${node.isRoot ? '16px' : '14px'};
            box-shadow:0 4px 16px ${node.color}40;
            cursor:grab;
            user-select:none;
            z-index:${window.mindmapState.selectedNode === node.id ? '100' : '10'};
            border:${window.mindmapState.selectedNode === node.id ? '3px solid #ffd700' : 'none'};
            transition:transform 0.1s, box-shadow 0.1s;
        `;
        nodeEl.textContent = node.text;
        
        // 鼠标按下开始拖拽
        nodeEl.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            window.selectMindMapNode(node.id);
            window.mindmapState.draggingNode = node.id;
            window.mindmapState.dragStartPos = { x: e.clientX, y: e.clientY };
            window.mindmapState.nodeStartPos = { x: node.x, y: node.y };
            nodeEl.style.cursor = 'grabbing';
        });
        
        // 触摸开始（移动端）
        nodeEl.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const touch = e.touches[0];
            window.selectMindMapNode(node.id);
            window.mindmapState.draggingNode = node.id;
            window.mindmapState.dragStartPos = { x: touch.clientX, y: touch.clientY };
            window.mindmapState.nodeStartPos = { x: node.x, y: node.y };
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
        if (e.target === this || e.target.id === 'mindmap-nodes' || e.target.id === 'mindmap-svg') {
            window.selectMindMapNode(null);
        }
    });
};

// 鼠标移动 - 全局监听
document.addEventListener('mousemove', function(e) {
    if (window.mindmapState.draggingNode) {
        const canvas = document.getElementById('mindmap-canvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentMap = window.getCurrentMindMap();
        const node = currentMap.nodes.find(n => n.id === window.mindmapState.draggingNode);
        
        if (node) {
            const deltaX = e.clientX - window.mindmapState.dragStartPos.x;
            const deltaY = e.clientY - window.mindmapState.dragStartPos.y;
            
            const newX = window.mindmapState.nodeStartPos.x + (deltaX / rect.width) * 100;
            const newY = window.mindmapState.nodeStartPos.y + (deltaY / rect.height) * 100;
            
            node.x = Math.max(5, Math.min(95, newX));
            node.y = Math.max(5, Math.min(95, newY));
            
            window.renderAllMindMapNodes();
        }
    }
});

// 触摸移动（移动端）
document.addEventListener('touchmove', function(e) {
    if (window.mindmapState.draggingNode) {
        // 阻止页面滚动，只进行拖拽
        e.preventDefault();
        
        const canvas = document.getElementById('mindmap-canvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const currentMap = window.getCurrentMindMap();
        const node = currentMap.nodes.find(n => n.id === window.mindmapState.draggingNode);
        
        if (node) {
            const deltaX = touch.clientX - window.mindmapState.dragStartPos.x;
            const deltaY = touch.clientY - window.mindmapState.dragStartPos.y;
            
            const newX = window.mindmapState.nodeStartPos.x + (deltaX / rect.width) * 100;
            const newY = window.mindmapState.nodeStartPos.y + (deltaY / rect.height) * 100;
            
            node.x = Math.max(5, Math.min(95, newX));
            node.y = Math.max(5, Math.min(95, newY));
            
            window.renderAllMindMapNodes();
        }
    }
}, { passive: false });

// 鼠标/触摸抬起 - 全局监听
document.addEventListener('mouseup', function() {
    if (window.mindmapState.draggingNode) {
        window.mindmapState.draggingNode = null;
        window.saveMindMapData();
    }
});

document.addEventListener('touchend', function() {
    if (window.mindmapState.draggingNode) {
        window.mindmapState.draggingNode = null;
        window.saveMindMapData();
    }
});

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
    
    const currentMap = window.getCurrentMindMap();
    const parentNode = currentMap.nodes.find(n => n.id === window.mindmapState.selectedNode);
    if (!parentNode) return;
    
    const text = prompt('请输入新节点名称：', '新节点');
    if (!text) return;
    
    const newId = Math.max(0, ...currentMap.nodes.map(n => n.id)) + 1;
    const style = window.getMindMapStyle(window.mindmapState.currentStyle);
    const randomColor = style.colors[Math.floor(Math.random() * style.colors.length)];
    
    currentMap.nodes.push({
        id: newId,
        text: text,
        x: parentNode.x + (Math.random() - 0.5) * 30,
        y: parentNode.y + (Math.random() - 0.5) * 30,
        color: randomColor,
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
    
    const currentMap = window.getCurrentMindMap();
    const node = currentMap.nodes.find(n => n.id === window.mindmapState.selectedNode);
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
    
    const currentMap = window.getCurrentMindMap();
    const node = currentMap.nodes.find(n => n.id === window.mindmapState.selectedNode);
    if (!node) return;
    
    if (node.isRoot) {
        alert('根节点不能删除');
        return;
    }
    
    if (confirm('确定要删除这个节点吗？子节点也会一起删除！')) {
        // 递归删除子节点
        function deleteChildren(parentId) {
            const children = currentMap.nodes.filter(n => n.parent === parentId);
            children.forEach(child => {
                deleteChildren(child.id);
            });
            currentMap.nodes = currentMap.nodes.filter(n => n.id !== parentId);
        }
        
        deleteChildren(node.id);
        window.mindmapState.selectedNode = null;
        window.renderAllMindMapNodes();
        window.saveMindMapData();
    }
};

// 重置当前导图
window.resetMindMap = function() {
    if (confirm('确定要重置当前导图吗？所有节点将恢复默认！')) {
        const currentMap = window.getCurrentMindMap();
        const style = window.getMindMapStyle(window.mindmapState.currentStyle);
        currentMap.nodes = [
            { id: 1, text: currentMap.name, x: 50, y: 50, color: '#667eea', isRoot: true }
        ];
        window.mindmapState.selectedNode = null;
        window.renderAllMindMapNodes();
        window.saveMindMapData();
    }
};

// 新建导图
window.newMindMap = function() {
    const name = prompt('请输入新导图名称：', '新导图');
    if (!name) return;
    
    const newId = 'map_' + Date.now();
    const style = window.getMindMapStyle(window.mindmapState.currentStyle);
    
    window.mindmapState.maps[newId] = {
        id: newId,
        name: name,
        createTime: new Date().toISOString(),
        nodes: [
            { id: 1, text: name, x: 50, y: 50, color: '#667eea', isRoot: true }
        ]
    };
    
    window.mindmapState.currentMapId = newId;
    window.saveMindMapData();
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderMindMap(container);
    }
};

// 切换导图
window.switchMindMap = function(mapId) {
    if (window.mindmapState.maps[mapId]) {
        window.mindmapState.currentMapId = mapId;
        window.mindmapState.selectedNode = null;
        window.saveMindMapData();
        window.renderAllMindMapNodes();
        
        // 更新标题
        const currentMap = window.getCurrentMindMap();
        const container = document.getElementById('app-container');
        if (container) {
            window.renderMindMap(container);
        }
    }
};

// 重命名导图
window.renameMindMap = function() {
    const currentMap = window.getCurrentMindMap();
    const newName = prompt('请输入新名称：', currentMap.name);
    if (newName) {
        currentMap.name = newName;
        window.saveMindMapData();
        
        // 重新渲染
        const container = document.getElementById('app-container');
        if (container) {
            window.renderMindMap(container);
        }
    }
};

// 切换样式
window.switchMindMapStyle = function(styleName) {
    window.mindmapState.currentStyle = styleName;
    
    // 更新所有节点颜色，应用新样式
    const currentMap = window.getCurrentMindMap();
    const style = window.getMindMapStyle(styleName);
    
    currentMap.nodes.forEach((node, index) => {
        if (node.isRoot) {
            // 根节点使用样式的根颜色
            node.color = style.rootColor || '#667eea';
        } else {
            // 普通节点从样式颜色数组中循环选取
            const colorIndex = (index - 1) % style.colors.length;
            node.color = style.colors[colorIndex];
        }
    });
    
    window.saveMindMapData();
    
    // 重新渲染
    const container = document.getElementById('app-container');
    if (container) {
        window.renderMindMap(container);
    }
};

console.log('[V297] 思维导图模块加载完成，window.renderMindMap:', typeof window.renderMindMap);

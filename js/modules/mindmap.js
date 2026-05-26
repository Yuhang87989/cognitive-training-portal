// ============================================================
// V355 思维导图模块 - XMind风格
// 中心辐射 + 贝塞尔曲线 + 自动布局 + 分支着色 + 折叠
// ============================================================

window.mindmapState = {
    currentMapId: 'default',
    maps: {},
    selectedNode: null,
    collapsedNodes: new Set(),
    styles: ['default', 'colorful', 'minimal', 'ocean', 'sunset'],
    currentStyle: 'default',
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStart: {x:0, y:0},
    offsetStart: {x:0, y:0}
};

var BRANCH_COLORS = ['#E74C3C','#E67E22','#27AE60','#2980B9','#8E44AD','#16A085','#F39C12','#C0392B','#3498DB','#1ABC9C','#9B59B6','#D35400'];

window.getMindMapStyle = function(styleName) {
    var styles = {
        default: {bg:'linear-gradient(135deg,#f5f7fa,#e8ecf1)',rootBg:'linear-gradient(135deg,#2C3E50,#3498DB)',rootColor:'#fff',branchColors:BRANCH_COLORS},
        colorful: {bg:'linear-gradient(135deg,#fff5e6,#ffe0cc)',rootBg:'linear-gradient(135deg,#ff6b6b,#ffa502)',rootColor:'#fff',branchColors:['#ff6b6b','#ffa502','#ffd93d','#6bcb77','#4d96ff','#9b59b6','#e056fd','#686de0']},
        minimal: {bg:'#fafafa',rootBg:'#333',rootColor:'#fff',branchColors:['#555','#666','#777','#888','#999','#444','#333','#555']},
        ocean: {bg:'linear-gradient(135deg,#e0f0ff,#c8e6ff)',rootBg:'linear-gradient(135deg,#0077b6,#00b4d8)',rootColor:'#fff',branchColors:['#0077b6','#00b4d8','#48cae4','#90e0ef','#023e8a','#0096c7','#03045e','#caf0f8']},
        sunset: {bg:'linear-gradient(135deg,#fff5e6,#ffe0cc)',rootBg:'linear-gradient(135deg,#e87a4e,#ff9a63)',rootColor:'#fff',branchColors:['#e87a4e','#ff9a63','#ffb347','#ff6b6b','#ee5a24','#f39c12','#e74c3c','#d35400']}
    };
    return styles[styleName] || styles.default;
};

window.initMindMapList = function() {
    var savedData = window.DataSync.get('mindmap');
    if (savedData && savedData.maps) {
        window.mindmapState.maps = savedData.maps;
        window.mindmapState.currentMapId = savedData.currentMapId || 'default';
        window.mindmapState.currentStyle = savedData.currentStyle || 'default';
        // Migrate old x/y format to tree format
        Object.values(window.mindmapState.maps).forEach(function(map) {
            if (map.nodes && map.nodes.length && map.nodes[0].x !== undefined && !map.nodes[0].children) {
                var root = map.nodes.find(function(n){return n.isRoot;});
                if (root) {
                    var kids = map.nodes.filter(function(n){return n.parent === root.id && !n.isRoot;});
                    var leftK = kids.slice(0, Math.ceil(kids.length/2));
                    var rightK = kids.slice(Math.ceil(kids.length/2));
                    var newNodes = [{id:root.id, text:root.text, isRoot:true, children:kids.map(function(c){return c.id;})}];
                    leftK.forEach(function(c,i){newNodes.push({id:c.id, text:c.text, parent:root.id, side:'left', branchIndex:i, children:[]});});
                    rightK.forEach(function(c,i){newNodes.push({id:c.id, text:c.text, parent:root.id, side:'right', branchIndex:leftK.length+i, children:[]});});
                    map.nodes = newNodes;
                }
            }
        });
    } else {
        window.mindmapState.maps = {
            default: {id:'default', name:'我的学习导图', nodes:[
                {id:1,text:'我的学习',isRoot:true,children:[2,3,4,5]},
                {id:2,text:'语文',parent:1,side:'left',branchIndex:0,children:[]},
                {id:3,text:'数学',parent:1,side:'right',branchIndex:1,children:[]},
                {id:4,text:'英语',parent:1,side:'left',branchIndex:2,children:[]},
                {id:5,text:'计划',parent:1,side:'right',branchIndex:3,children:[]}
            ]}
        };
        window.mindmapState.currentMapId = 'default';
    }
};

window.getCurrentMindMap = function() { return window.mindmapState.maps[window.mindmapState.currentMapId]; };
window.saveMindMapData = function() { window.DataSync.set('mindmap', {maps:window.mindmapState.maps,currentMapId:window.mindmapState.currentMapId,currentStyle:window.mindmapState.currentStyle,version:2}); };

function mmGetNode(id) { return window.getCurrentMindMap().nodes.find(function(n){return n.id===id;}); }
function mmGetChildren(node) { if(!node||!node.children)return[]; return node.children.map(function(id){return mmGetNode(id);}).filter(Boolean); }

function mmCalcH(node, level) {
    var ch = mmGetChildren(node);
    if (!ch.length || window.mindmapState.collapsedNodes.has(node.id)) return 50;
    var t = 0;
    ch.forEach(function(c,i){ t += mmCalcH(c, level+1); if(i>0) t += 12; });
    return Math.max(t, 50);
}

function mmLayoutSide(nodeIds, startX, centerY, side, positions, level, branchIdx) {
    if (!nodeIds.length) return;
    var totalH = 0;
    var hs = nodeIds.map(function(id){return mmCalcH(mmGetNode(id), level);});
    hs.forEach(function(h,i){ totalH += h; if(i>0) totalH += 12; });
    var y = centerY - totalH/2;
    var gap = level===1 ? 200 : 160;
    nodeIds.forEach(function(id,i){
        var node = mmGetNode(id);
        var h = hs[i];
        positions[id] = {x:startX, y:y+h/2, level:level, side:side, branchIndex: node.branchIndex !== undefined ? node.branchIndex : branchIdx};
        var collapsed = window.mindmapState.collapsedNodes.has(id);
        var children = mmGetChildren(node);
        if (children.length && !collapsed) {
            var childX = side==='left' ? startX-gap : startX+gap;
            mmLayoutSide(node.children, childX, y+h/2, side, positions, level+1, node.branchIndex !== undefined ? node.branchIndex : branchIdx);
        }
        y += h + 12;
    });
}

function mmLayoutTree(rootId) {
    var root = mmGetNode(rootId);
    if (!root) return {};
    var positions = {};
    var cx = 3000, cy = 2000;
    positions[rootId] = {x:cx, y:cy, level:0};
    var leftKids = (root.children||[]).filter(function(id){var n=mmGetNode(id);return n&&n.side==='left';});
    var rightKids = (root.children||[]).filter(function(id){var n=mmGetNode(id);return n&&n.side!=='left';});
    mmLayoutSide(leftKids, cx-200, cy, 'left', positions, 1, 0);
    mmLayoutSide(rightKids, cx+200, cy, 'right', positions, 1, leftKids.length);
    return positions;
}

window.renderMindMap = function(container) {
    window.initMindMapList();
    var map = window.getCurrentMindMap();
    var style = window.getMindMapStyle(window.mindmapState.currentStyle);
    var styleBtns = window.mindmapState.styles.map(function(s){
        var label = {default:'默认',colorful:'多彩',minimal:'简约',ocean:'海洋',sunset:'日落'}[s];
        var bg = s===window.mindmapState.currentStyle ? '#667eea' : '#fff';
        var clr = s===window.mindmapState.currentStyle ? 'white' : '#666';
        return '<button onclick="window.switchMindMapStyle(\''+s+'\')" style="padding:3px 8px;background:'+bg+';color:'+clr+';border:1px solid #ddd;border-radius:6px;font-size:11px;cursor:pointer;">'+label+'</button>';
    }).join('');
    var mapOpts = Object.values(window.mindmapState.maps).map(function(m){
        return '<option value="'+m.id+'" '+(m.id===window.mindmapState.currentMapId?'selected':'')+'>'+m.name+'</option>';
    }).join('');

    container.innerHTML = '<div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">'
        +'<div style="padding:10px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:8px;flex-wrap:wrap;">'
        +'<button onclick="history.back()" style="padding:6px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">\u2190 \u8fd4\u56de</button>'
        +'<span style="font-weight:bold;font-size:16px;color:#333;flex:1;text-align:center;">\ud83e\udde0 '+map.name+'</span>'
        +'<div style="display:flex;gap:6px;">'
        +'<select id="mindmap-selector" onchange="window.switchMindMap(this.value)" style="padding:4px 8px;border:1px solid #ddd;border-radius:6px;font-size:12px;">'+mapOpts+'</select>'
        +'<button onclick="window.newMindMap()" style="padding:6px 10px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:12px;cursor:pointer;">+ \u65b0\u5efa</button>'
        +'</div></div>'
        +'<div style="padding:6px 16px;background:#fafafa;display:flex;gap:6px;align-items:center;flex-shrink:0;flex-wrap:wrap;">'
        +'<span style="font-size:12px;color:#666;">\u6837\u5f0f\uff1a</span>'+styleBtns
        +'<span style="margin-left:auto;font-size:11px;color:#999;" id="zoom-info">100%</span></div>'
        +'<div id="mm-canvas" style="flex:1;position:relative;overflow:hidden;background:'+style.bg+';cursor:grab;touch-action:none;">'
        +'<div id="mm-viewport" style="position:absolute;transform-origin:0 0;">'
        +'<svg id="mm-svg" style="position:absolute;top:0;left:0;width:6000px;height:4000px;pointer-events:none;"></svg>'
        +'<div id="mm-nodes" style="position:absolute;top:0;left:0;width:6000px;height:4000px;"></div>'
        +'</div></div>'
        +'<div style="padding:8px 16px;background:white;border-top:1px solid #eee;display:flex;gap:8px;justify-content:center;flex-shrink:0;flex-wrap:wrap;">'
        +'<button onclick="window.addChildNode()" style="padding:6px 14px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">\u2795 \u5b50\u8282\u70b9</button>'
        +'<button onclick="window.editSelectedNode()" style="padding:6px 14px;background:#43e97b;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">\u270f\ufe0f \u7f16\u8f91</button>'
        +'<button onclick="window.deleteSelectedNode()" style="padding:6px 14px;background:#fa709a;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">\ud83d\uddd1\ufe0f \u5220\u9664</button>'
        +'<button onclick="window.toggleCollapse()" style="padding:6px 14px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">\ud83d\udcc2 \u6298\u53e0</button>'
        +'<button onclick="window.resetMindMapView()" style="padding:6px 14px;background:#999;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">\ud83d\udd04 \u590d\u4f4d</button>'
        +'</div>'
        +'<div style="padding:6px 16px;background:#e3f2fd;border-top:1px solid #bbdefb;">'
        +'<div style="font-size:11px;color:#1976d2;text-align:center;">\ud83d\udca1 \u70b9\u51fb\u9009\u4e2d\u8282\u70b9 | \u6eda\u8f6e\u7f29\u653e | \u62d6\u62fd\u5e73\u79fb | \u53cc\u51fb\u7f16\u8f91</div>'
        +'</div></div>';

    window.renderMindMapNodes();
    window.bindMindMapCanvasEvents();
    setTimeout(function(){window.resetMindMapView();}, 100);
};

window.renderMindMapNodes = function() {
    var nodesEl = document.getElementById('mm-nodes');
    var svgEl = document.getElementById('mm-svg');
    var map = window.getCurrentMindMap();
    var style = window.getMindMapStyle(window.mindmapState.currentStyle);
    if (!nodesEl||!svgEl||!map||!map.nodes.length) return;
    nodesEl.innerHTML = '';
    svgEl.innerHTML = '';
    var root = map.nodes.find(function(n){return n.isRoot;});
    if (!root) return;
    var positions = mmLayoutTree(root.id);

    // Draw bezier curves
    map.nodes.forEach(function(node) {
        if (node.parent && positions[node.id] && positions[node.parent]) {
            var p = positions[node.parent], c = positions[node.id];
            var color = style.branchColors[c.branchIndex % style.branchColors.length] || '#999';
            var dir = c.side==='left' ? -1 : 1;
            var pw = p.level===0 ? 80 : 50;
            var cw = Math.max(40, (node.text||'').length*14+24);
            var x1 = p.x + dir*pw, y1 = p.y;
            var x2 = c.x - dir*(cw/2+4), y2 = c.y;
            var cpx = (x1+x2)/2;
            var path = document.createElementNS('http://www.w3.org/2000/svg','path');
            path.setAttribute('d','M'+x1+','+y1+' C'+cpx+','+y1+' '+cpx+','+y2+' '+x2+','+y2);
            path.setAttribute('stroke',color);
            path.setAttribute('stroke-width', c.level<=1?'3':'2');
            path.setAttribute('fill','none');
            path.setAttribute('opacity','0.5');
            path.setAttribute('stroke-linecap','round');
            svgEl.appendChild(path);
        }
    });

    // Draw nodes
    map.nodes.forEach(function(node) {
        var pos = positions[node.id];
        if (!pos) return;
        var div = document.createElement('div');
        var sel = window.mindmapState.selectedNode === node.id;
        var collapsed = window.mindmapState.collapsedNodes.has(node.id);
        var hasCh = mmGetChildren(node).length > 0;
        var color = node.isRoot ? null : style.branchColors[pos.branchIndex % style.branchColors.length];

        if (node.isRoot) {
            div.style.cssText = 'position:absolute;left:'+pos.x+'px;top:'+pos.y+'px;transform:translate(-50%,-50%);padding:14px 28px;background:'+style.rootBg+';color:'+style.rootColor+';border-radius:24px;font-weight:700;font-size:16px;box-shadow:0 4px 20px rgba(44,62,80,0.25);cursor:pointer;white-space:nowrap;z-index:10;border:'+(sel?'3px solid #FFD700':'none')+';';
        } else {
            var lv = pos.level||1;
            var fs = lv===1?'14px':'12px';
            var pd = lv===1?'8px 18px':'6px 12px';
            var rd = lv===1?'18px':'14px';
            var bg = lv===1?color:'white';
            var tc = lv===1?'white':color;
            var bd = lv===1?'none':'2px solid '+color;
            div.style.cssText = 'position:absolute;left:'+pos.x+'px;top:'+pos.y+'px;transform:translate(-50%,-50%);padding:'+pd+';background:'+bg+';color:'+tc+';border-radius:'+rd+';font-weight:'+(lv===1?'600':'500')+';font-size:'+fs+';box-shadow:0 2px 8px rgba(0,0,0,0.1);cursor:pointer;white-space:nowrap;z-index:'+(sel?10:5)+';border:'+(sel?'3px solid #FFD700':bd)+';';
        }
        div.textContent = node.text;
        if (hasCh && collapsed) {
            var b = document.createElement('span');
            b.textContent = ' +'+node.children.length;
            b.style.cssText = 'font-size:10px;opacity:0.7;';
            div.appendChild(b);
        }
        div.addEventListener('click', function(e){e.stopPropagation();window.mindmapState.selectedNode=node.id;window.renderMindMapNodes();});
        div.addEventListener('dblclick', function(e){e.stopPropagation();window.mindmapState.selectedNode=node.id;window.editSelectedNode();});
        nodesEl.appendChild(div);
    });
};

// Canvas drag/zoom
window.bindMindMapCanvasEvents = function() {
    var canvas = document.getElementById('mm-canvas');
    if (!canvas) return;
    canvas.addEventListener('mousedown',function(e){
        if(e.target!==canvas&&e.target.id!=='mm-viewport')return;
        window.mindmapState.isDragging=true;
        window.mindmapState.dragStart={x:e.clientX,y:e.clientY};
        window.mindmapState.offsetStart={x:window.mindmapState.offsetX,y:window.mindmapState.offsetY};
        canvas.style.cursor='grabbing';
    });
    window.addEventListener('mousemove',function(e){
        if(!window.mindmapState.isDragging)return;
        window.mindmapState.offsetX=window.mindmapState.offsetStart.x+(e.clientX-window.mindmapState.dragStart.x);
        window.mindmapState.offsetY=window.mindmapState.offsetStart.y+(e.clientY-window.mindmapState.dragStart.y);
        window.applyMindMapTransform();
    });
    window.addEventListener('mouseup',function(){
        window.mindmapState.isDragging=false;
        var c=document.getElementById('mm-canvas');if(c)c.style.cursor='grab';
    });
    canvas.addEventListener('touchstart',function(e){
        if(e.touches.length===1){
            window.mindmapState.isDragging=true;
            window.mindmapState.dragStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
            window.mindmapState.offsetStart={x:window.mindmapState.offsetX,y:window.mindmapState.offsetY};
        }
    },{passive:true});
    canvas.addEventListener('touchmove',function(e){
        if(e.touches.length===1&&window.mindmapState.isDragging){
            e.preventDefault();
            window.mindmapState.offsetX=window.mindmapState.offsetStart.x+(e.touches[0].clientX-window.mindmapState.dragStart.x);
            window.mindmapState.offsetY=window.mindmapState.offsetStart.y+(e.touches[0].clientY-window.mindmapState.dragStart.y);
            window.applyMindMapTransform();
        }
    },{passive:false});
    canvas.addEventListener('touchend',function(){window.mindmapState.isDragging=false;});
    canvas.addEventListener('wheel',function(e){
        e.preventDefault();
        var d=e.deltaY>0?0.9:1.1;
        var ns=Math.max(0.3,Math.min(3,window.mindmapState.scale*d));
        var r=canvas.getBoundingClientRect();
        var mx=e.clientX-r.left,my=e.clientY-r.top;
        window.mindmapState.offsetX=mx-(mx-window.mindmapState.offsetX)*(ns/window.mindmapState.scale);
        window.mindmapState.offsetY=my-(my-window.mindmapState.offsetY)*(ns/window.mindmapState.scale);
        window.mindmapState.scale=ns;
        window.applyMindMapTransform();
        var zi=document.getElementById('zoom-info');if(zi)zi.textContent=Math.round(ns*100)+'%';
    },{passive:false});
    canvas.addEventListener('click',function(e){
        if(e.target===canvas||e.target.id==='mm-viewport'){
            window.mindmapState.selectedNode=null;window.renderMindMapNodes();
        }
    });
};

window.applyMindMapTransform = function() {
    var vp=document.getElementById('mm-viewport');
    if(vp) vp.style.transform='translate('+window.mindmapState.offsetX+'px,'+window.mindmapState.offsetY+'px) scale('+window.mindmapState.scale+')';
};

window.resetMindMapView = function() {
    var canvas=document.getElementById('mm-canvas');if(!canvas)return;
    var r=canvas.getBoundingClientRect();
    window.mindmapState.scale=Math.min(r.width/600,r.height/400,1.0);
    window.mindmapState.offsetX=r.width/2-3000*window.mindmapState.scale;
    window.mindmapState.offsetY=r.height/2-2000*window.mindmapState.scale;
    window.applyMindMapTransform();
    var zi=document.getElementById('zoom-info');if(zi)zi.textContent=Math.round(window.mindmapState.scale*100)+'%';
};

// Node operations
window.addChildNode = function() {
    if(!window.mindmapState.selectedNode){window.showToast('\u8bf7\u5148\u9009\u62e9\u4e00\u4e2a\u8282\u70b9');return;}
    var map=window.getCurrentMindMap();
    var parent=map.nodes.find(function(n){return n.id===window.mindmapState.selectedNode;});
    if(!parent)return;
    var text=prompt('\u8bf7\u8f93\u5165\u65b0\u8282\u70b9\u540d\u79f0\uff1a','\u65b0\u8282\u70b9');
    if(!text)return;
    var newId=Math.max.apply(null,map.nodes.map(function(n){return n.id;}))+1;
    var side=parent.isRoot?(map.nodes.filter(function(n){return n.side==='left';}).length<=map.nodes.filter(function(n){return n.side!=='left';}).length?'left':'right'):(parent.side||'right');
    var branchIdx=parent.isRoot?map.nodes.filter(function(n){return n.parent===parent.id;}).length:parent.branchIndex;
    map.nodes.push({id:newId,text:text,parent:parent.id,side:side,branchIndex:branchIdx,children:[]});
    if(!parent.children)parent.children=[];
    parent.children.push(newId);
    window.renderMindMapNodes();window.saveMindMapData();
};

window.editSelectedNode = function() {
    if(!window.mindmapState.selectedNode){window.showToast('\u8bf7\u5148\u9009\u62e9\u4e00\u4e2a\u8282\u70b9');return;}
    var map=window.getCurrentMindMap();
    var node=map.nodes.find(function(n){return n.id===window.mindmapState.selectedNode;});
    if(!node)return;
    var t=prompt('\u8bf7\u8f93\u5165\u8282\u70b9\u540d\u79f0\uff1a',node.text);
    if(t){node.text=t;window.renderMindMapNodes();window.saveMindMapData();}
};

window.deleteSelectedNode = function() {
    if(!window.mindmapState.selectedNode){window.showToast('\u8bf7\u5148\u9009\u62e9\u4e00\u4e2a\u8282\u70b9');return;}
    var map=window.getCurrentMindMap();
    var node=map.nodes.find(function(n){return n.id===window.mindmapState.selectedNode;});
    if(!node)return;
    if(node.isRoot){window.showToast('\u6839\u8282\u70b9\u4e0d\u80fd\u5220\u9664');return;}
    if(!confirm('\u786e\u5b9a\u8981\u5220\u9664\u5417\uff1f\u5b50\u8282\u70b9\u4e5f\u4f1a\u4e00\u8d77\u5220\u9664\uff01'))return;
    function del(pid){map.nodes.filter(function(n){return n.parent===pid;}).forEach(function(c){del(c.id);});map.nodes=map.nodes.filter(function(n){return n.id!==pid;});}
    var pn=map.nodes.find(function(n){return n.id===node.parent;});
    if(pn&&pn.children)pn.children=pn.children.filter(function(id){return id!==node.id;});
    del(node.id);window.mindmapState.selectedNode=null;window.renderMindMapNodes();window.saveMindMapData();
};

window.toggleCollapse = function() {
    if(!window.mindmapState.selectedNode){window.showToast('\u8bf7\u5148\u9009\u62e9\u4e00\u4e2a\u8282\u70b9');return;}
    var id=window.mindmapState.selectedNode;
    if(window.mindmapState.collapsedNodes.has(id))window.mindmapState.collapsedNodes.delete(id);
    else window.mindmapState.collapsedNodes.add(id);
    window.renderMindMapNodes();
};

window.newMindMap = function() {
    var name=prompt('\u8bf7\u8f93\u5165\u65b0\u5bfc\u56fe\u540d\u79f0\uff1a','\u65b0\u5bfc\u56fe');if(!name)return;
    var id='map_'+Date.now();
    window.mindmapState.maps[id]={id:id,name:name,nodes:[{id:1,text:name,isRoot:true,children:[]}]};
    window.mindmapState.currentMapId=id;window.saveMindMapData();
    var c=document.getElementById('fullscreen-content')||document.getElementById('app-container');if(c)window.renderMindMap(c);
};

window.switchMindMap = function(mapId) {
    if(window.mindmapState.maps[mapId]){
        window.mindmapState.currentMapId=mapId;window.mindmapState.selectedNode=null;
        window.mindmapState.collapsedNodes.clear();window.saveMindMapData();
        var c=document.getElementById('fullscreen-content')||document.getElementById('app-container');if(c)window.renderMindMap(c);
    }
};

window.switchMindMapStyle = function(styleName) {
    window.mindmapState.currentStyle=styleName;window.saveMindMapData();
    var c=document.getElementById('fullscreen-content')||document.getElementById('app-container');if(c)window.renderMindMap(c);
};

window.resetMindMap = function() {
    if(!confirm('\u786e\u5b9a\u8981\u91cd\u7f6e\u5f53\u524d\u5bfc\u56fe\u5417\uff1f'))return;
    var map=window.getCurrentMindMap();
    map.nodes=[{id:1,text:map.name,isRoot:true,children:[]}];
    window.mindmapState.selectedNode=null;window.mindmapState.collapsedNodes.clear();
    window.renderMindMapNodes();window.saveMindMapData();
};

console.log('[V355] XMind\u98ce\u683c\u601d\u7ef4\u5bfc\u56fe\u6a21\u5757\u52a0\u8f7d\u5b8c\u6210');

// ============================================================
// V294 思维导图模块 - 最简测试版本
// ============================================================

window.renderMindMap = function(container) {
    console.log('[V294] renderMindMap 被调用，container:', container);
    
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部工具栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <button onclick="history.back()" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <span style="font-weight:bold;font-size:16px;color:#333;">🧠 思维导图</span>
                <button style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">🔄 重置</button>
            </div>
            
            <!-- 导图区域 - 简化版本，用CSS绘制 -->
            <div style="flex:1;position:relative;overflow:hidden;background:linear-gradient(135deg,#667eea10,#764ba210);">
                <!-- 中心节点 -->
                <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:12px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:12px;font-weight:bold;box-shadow:0 4px 12px rgba(102,126,234,0.3);">
                    我的学习
                </div>
                
                <!-- 语文节点 -->
                <div style="position:absolute;left:20%;top:25%;padding:10px 16px;background:#f093fb;color:white;border-radius:10px;font-weight:bold;box-shadow:0 4px 12px rgba(240,147,251,0.3);">
                    🔤 语文
                </div>
                
                <!-- 数学节点 -->
                <div style="position:absolute;left:70%;top:25%;padding:10px 16px;background:#4facfe;color:white;border-radius:10px;font-weight:bold;box-shadow:0 4px 12px rgba(79,172,254,0.3);">
                    🔢 数学
                </div>
                
                <!-- 英语节点 -->
                <div style="position:absolute;left:20%;top:65%;padding:10px 16px;background:#43e97b;color:white;border-radius:10px;font-weight:bold;box-shadow:0 4px 12px rgba(67,233,123,0.3);">
                    📚 英语
                </div>
                
                <!-- 计划节点 -->
                <div style="position:absolute;left:70%;top:65%;padding:10px 16px;background:#fa709a;color:white;border-radius:10px;font-weight:bold;box-shadow:0 4px 12px rgba(250,112,154,0.3);">
                    📅 计划
                </div>
                
                <!-- 连接线 - 用伪元素或简单边框模拟 -->
                <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">
                    <line x1="50%" y1="50%" x2="25%" y2="28%" stroke="#ddd" stroke-width="2"/>
                    <line x1="50%" y1="50%" x2="75%" y2="28%" stroke="#ddd" stroke-width="2"/>
                    <line x1="50%" y1="50%" x2="25%" y2="68%" stroke="#ddd" stroke-width="2"/>
                    <line x1="50%" y1="50%" x2="75%" y2="68%" stroke="#ddd" stroke-width="2"/>
                </svg>
            </div>
            
            <!-- 操作提示 -->
            <div style="padding:12px 16px;background:white;border-top:1px solid #eee;font-size:12px;color:#666;display:flex;gap:20px;justify-content:center;flex-shrink:0;">
                <span>👆 点击节点</span>
                <span>✏️ 编辑内容</span>
                <span>➕ 添加子节点</span>
            </div>
            
            <!-- 版本提示 -->
            <div style="padding:12px 16px;background:#e3f2fd;border-top:1px solid #bbdefb;">
                <div style="font-size:13px;color:#1976d2;text-align:center;">✅ V294 测试版本 - 思维导图模块已加载</div>
            </div>
        </div>
    `;
    
    console.log('[V294] 思维导图渲染完成');
};

console.log('[V294] 思维导图模块加载完成，window.renderMindMap:', typeof window.renderMindMap);

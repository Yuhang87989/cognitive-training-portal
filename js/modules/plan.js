// ============================================================
// V294 学习计划模块 - 最简测试版本
// ============================================================

window.renderPlan = function(container) {
    console.log('[V294] renderPlan 被调用，container:', container);
    
    container.innerHTML = `
        <div style="padding:20px;background:#f8f9fa;min-height:100vh;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:10px 16px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">📅 学习计划</h2>
                <div style="width:60px;"></div>
            </div>
            
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 16px 0;font-size:16px;color:#333;">今日任务</h3>
                
                <div style="display:flex;flex-direction:column;gap:12px;">
                    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#fafafa;border-radius:12px;border:2px solid #eee;">
                        <span style="font-size:22px;">🔤</span>
                        <div style="flex:1;">
                            <div style="font-size:15px;color:#333;">背诵20个英语单词</div>
                            <div style="font-size:12px;color:#999;">09:00 - 09:30</div>
                        </div>
                        <span style="font-size:20px;">⬜</span>
                    </div>
                    
                    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#fafafa;border-radius:12px;border:2px solid #eee;">
                        <span style="font-size:22px;">🔢</span>
                        <div style="flex:1;">
                            <div style="font-size:15px;color:#333;">完成数学练习</div>
                            <div style="font-size:12px;color:#999;">10:00 - 11:00</div>
                        </div>
                        <span style="font-size:20px;">⬜</span>
                    </div>
                    
                    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#fafafa;border-radius:12px;border:2px solid #eee;">
                        <span style="font-size:22px;">📖</span>
                        <div style="flex:1;">
                            <div style="font-size:15px;color:#333;">阅读语文课文</div>
                            <div style="font-size:12px;color:#999;">14:00 - 14:30</div>
                        </div>
                        <span style="font-size:20px;">⬜</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top:20px;text-align:center;">
                <button style="padding:12px 20px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">➕ 添加新任务</button>
            </div>
            
            <div style="margin-top:20px;padding:16px;background:#e3f2fd;border-radius:12px;">
                <div style="font-size:13px;color:#1976d2;">✅ V294 测试版本 - 学习计划模块已加载</div>
            </div>
        </div>
    `;
    
    console.log('[V294] 学习计划渲染完成');
};

console.log('[V294] 学习计划模块加载完成，window.renderPlan:', typeof window.renderPlan);

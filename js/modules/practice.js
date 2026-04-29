// 版本: V144

CTM.registerModule('practice', {
    name: 'practice',
    icon: '🎯',
    render: renderPractice
});

function renderPractice(container) {
    const user = getCurrentUserData();
    const stats = user?.practiceStats || {total: 0, correct: 0, weakPoints: 0};
    const wrongNotes = user?.wrongNotes || [];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🎯 AI精准练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">智能诊断薄弱点，针对性练习提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div style="text-align:center;padding:16px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;">${stats.total}</div>
                    <div style="font-size:12px;color:#666;">总题数</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0fff4;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;">${stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0}%</div>
                    <div style="font-size:12px;color:#666;">正确率</div>
                </div>
                <div style="text-align:center;padding:16px;background:#fff5f5;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${wrongNotes.length}</div>
                    <div style="font-size:12px;color:#666;">薄弱点</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📷 拍照上传题目</h4>
            <p style="font-size:12px;color:#666;margin-bottom:12px;">拍下你不会的题目，AI帮你分析讲解</p>
            <input type="file" id="practice-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handlePracticePhoto(this)"/>
            <button class="camera-btn" onclick="document.getElementById('practice-photo-input').click()">📷 拍照识别</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">✏️ 手动输入题目</h4>
            <textarea id="practice-input" placeholder="输入你的问题..." style="width:100%;height:80px;padding:12px;border:1px solid #ddd;border-radius:12px;font-size:14px;resize:none;"></textarea>
            <button onclick="submitPracticeQuestion()" style="margin-top:12px;width:100%;padding:14px;background:linear-gradient(135deg,#3377FF,#4A90E2);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">🔍 AI解答</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">📒 错题本</h4>
            <button onclick="openFullscreenPage('wrongbook')" style="width:100%;padding:14px;background:linear-gradient(135deg,#FF6B6B,#FF9A63);color:white;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">查看错题 (${wrongNotes.length})</button>
        </div>
        
        <div class="card">
            <h4 style="margin-bottom:12px;">🤖 AI解说</h4>
            <p style="color:#666;font-size:12px;margin-bottom:12px;">任何学习问题，AI帮你详细解说</p>
            <textarea id="practice-ai-question" placeholder="例如：一元二次方程怎么解？" style="width:100%;height:60px;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:13px;resize:none;"></textarea>
            <button onclick="askPracticeAI()" style="margin-top:10px;width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">🤖 AI解说</button>
        </div>
    `;
}

window.renderPractice = renderPractice;


// ============================================================
// Map - 地图模块
// ============================================================
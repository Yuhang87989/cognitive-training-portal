// ====== wrongbook模块 ======
// 版本: V140

CTM.registerModule('wrongbook', {
    name: 'wrongbook',
    icon: '🎯',
    render: renderWrongbook
});

function renderWrongbook(container) {
    const user = getCurrentUserData();
    const wrongNotes = user?.wrongNotes || [];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">📒 错题本</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">收录练习中的错题，定期复习巩固</p>
            <div style="display:flex;gap:12px;margin-bottom:16px;">
                <div style="flex:1;text-align:center;padding:16px;background:#fff5f5;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#FF6B6B;">${wrongNotes.length}</div>
                    <div style="font-size:12px;color:#666;">错题总数</div>
                </div>
                <div style="flex:1;text-align:center;padding:16px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#667eea;">${wrongNotes.filter(n => n.reviewed).length}</div>
                    <div style="font-size:12px;color:#666;">已复习</div>
                </div>
            </div>
        </div>
        
        ${wrongNotes.length === 0 ? `
            <div class="card" style="text-align:center;padding:40px;">
                <div style="font-size:48px;margin-bottom:16px;">📝</div>
                <div style="color:#666;">暂无错题，继续加油！</div>
            </div>
        ` : `
            <div class="card">
                <h4 style="margin-bottom:12px;">错题列表</h4>
                ${wrongNotes.map((note, i) => `
                    <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:12px;">
                        <div style="font-size:14px;margin-bottom:8px;">${note.question}</div>
                        <div style="display:flex;gap:8px;margin-bottom:8px;">
                            <span style="font-size:12px;color:#FF6B6B;">你的答案：${note.userAnswer}</span>
                            <span style="font-size:12px;color:#43E97B;">正确答案：${note.answer}</span>
                        </div>
                        <div style="font-size:12px;color:#666;">解析：${note.explanation}</div>
                        <button onclick="removeWrongNote(${i})" style="margin-top:8px;padding:6px 12px;background:#FF6B6B;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">移除</button>
                    </div>
                `).join('')}
            </div>
        `}
    `;
}

window.renderWrongbook = renderWrongbook;

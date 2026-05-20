// ============================================================
// 学习图书馆模块 - 手机适配版
// 功能：书架管理、电子书阅读、TTS听书、思维导图入口
// ============================================================

function renderLibrary(container) {
    const books = getDefaultBooks();
    
    container.innerHTML = `
        <div style="padding:16px;min-height:100%;background:#f8f9fa;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;color:#333;">📚 学习图书馆</h2>
                <div style="width:60px;"></div>
            </div>
            
            <!-- 快捷入口 -->
            <div onclick="openMindMapFromLibrary()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:16px;border-radius:16px;margin-bottom:20px;cursor:pointer;box-shadow:0 4px 12px rgba(102,126,234,0.3);">
                <div style="font-size:20px;margin-bottom:4px;">🧠 思维导图</div>
                <div style="font-size:13px;opacity:0.9;">点击打开思维导图编辑器</div>
            </div>
            
            <!-- 书架网格 -->
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
                ${books.map(book => `
                    <div onclick="openLibraryBook('${book.id}')" style="cursor:pointer;">
                        <div style="background:linear-gradient(135deg,${book.gradient || '#667eea,#764ba2'});color:white;padding:16px;border-radius:14px;height:130px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                            <div style="font-size:28px;">${book.emoji || '📖'}</div>
                            <div>
                                <div style="font-size:14px;font-weight:bold;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${book.title}</div>
                                <div style="font-size:11px;opacity:0.8;margin-top:4px;">${book.chapters.length} 章节</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- 学习统计 -->
            <div style="background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:14px;font-weight:bold;margin-bottom:12px;color:#333;">📊 学习统计</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#667eea;">${books.length}</div>
                        <div style="font-size:11px;color:#999;">本书籍</div>
                    </div>
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#4caf50;">${books.reduce((sum, b) => sum + b.chapters.length, 0)}</div>
                        <div style="font-size:11px;color:#999;">总章节</div>
                    </div>
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#ff9800;">0</div>
                        <div style="font-size:11px;color:#999;">已读完</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 从图书馆打开思维导图
function openMindMapFromLibrary() {
    window.renderMindMap(document.getElementById('fullscreen-content'));
}

// 打开书籍
function openLibraryBook(bookId) {
    const books = getDefaultBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <button onclick="renderLibrary(document.getElementById('fullscreen-content'))" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 书架</button>
                <span style="font-weight:bold;font-size:15px;color:#333;">${book.emoji} ${book.title}</span>
                <button onclick="togglePlayPause()" id="ttsBtn" style="padding:8px 14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🔊 听书</button>
            </div>
            
            <!-- 章节目录 -->
            <div style="padding:12px;background:white;border-bottom:1px solid #eee;flex-shrink:0;overflow-x:auto;">
                <div style="display:flex;gap:8px;">
                    ${book.chapters.map((ch, i) => `
                        <button onclick="readChapter('${bookId}', ${i})" id="chapter-${i}" style="padding:8px 12px;background:#f5f5f5;color:#666;border:none;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">
                            第${i + 1}章
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- 阅读内容（手机优化） -->
            <div id="readingContent" style="flex:1;overflow:auto;padding:20px;background:white;">
                <div style="max-width:700px;margin:0 auto;">
                    <h1 style="font-size:22px;margin-bottom:16px;color:#333;line-height:1.4;">${book.title}</h1>
                    <div style="font-size:14px;color:#999;margin-bottom:24px;">作者：${book.author || '未知'}</div>
                    <div id="chapterContent" style="font-size:17px;line-height:2;color:#444;">
                        ${formatContent(book.content || book.chapters[0]?.content || '暂无内容')}
                    </div>
                </div>
            </div>
            
            <!-- 底部进度条 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 -2px 4px rgba(0,0,0,0.05);flex-shrink:0;">
                <div style="height:6px;background:#eee;border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:10%;background:#667eea;border-radius:3px;transition:width 0.3s;"></div>
                </div>
                <div style="text-align:center;font-size:12px;color:#999;margin-top:8px;">阅读进度：10%</div>
            </div>
        </div>
    `;
    
    // 默认选中第一章
    setTimeout(() => {
        const firstChapter = document.getElementById('chapter-0');
        if (firstChapter) {
            firstChapter.style.background = '#667eea';
            firstChapter.style.color = 'white';
        }
    }, 100);
}

// 读取章节
function readChapter(bookId, chapterIndex) {
    const books = getDefaultBooks();
    const book = books.find(b => b.id === bookId);
    if (!book || !book.chapters[chapterIndex]) return;
    
    const contentEl = document.getElementById('chapterContent');
    if (contentEl) {
        contentEl.innerHTML = `
            <h2 style="font-size:19px;margin-bottom:16px;color:#333;">${book.chapters[chapterIndex].title}</h2>
            ${formatContent(book.chapters[chapterIndex].content)}
        `;
        contentEl.scrollTop = 0;
    }
    
    // 更新章节按钮状态
    book.chapters.forEach((_, i) => {
        const btn = document.getElementById(`chapter-${i}`);
        if (btn) {
            btn.style.background = i === chapterIndex ? '#667eea' : '#f5f5f5';
            btn.style.color = i === chapterIndex ? 'white' : '#666';
        }
    });
}

// 格式化内容（手机阅读优化）
function formatContent(text) {
    if (!text) return '';
    
    // 分段
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map(p => `
        <p style="margin-bottom:1.2em;text-indent:2em;text-align:justify;">
            ${p.trim()}
        </p>
    `).join('');
}

// TTS听书功能
let ttsPlaying = false;
let ttsUtterance = null;

function togglePlayPause() {
    const btn = document.getElementById('ttsBtn');
    const contentEl = document.getElementById('chapterContent');
    
    if (ttsPlaying) {
        // 暂停
        window.speechSynthesis.cancel();
        ttsPlaying = false;
        btn.textContent = '🔊 听书';
        btn.style.background = '#667eea';
    } else {
        // 播放
        const text = contentEl.innerText || contentEl.textContent;
        
        ttsUtterance = new SpeechSynthesisUtterance(text);
        ttsUtterance.lang = 'zh-CN';
        ttsUtterance.rate = 1.0; // 语速
        ttsUtterance.pitch = 1.0; // 音调
        
        ttsUtterance.onend = function() {
            ttsPlaying = false;
            btn.textContent = '🔊 听书';
            btn.style.background = '#667eea';
        };
        
        ttsUtterance.onerror = function() {
            ttsPlaying = false;
            btn.textContent = '🔊 听书';
            btn.style.background = '#667eea';
        };
        
        window.speechSynthesis.speak(ttsUtterance);
        ttsPlaying = true;
        btn.textContent = '⏸️ 暂停';
        btn.style.background = '#ff9800';
    }
}

// 默认书籍数据
function getDefaultBooks() {
    return [
        {
            id: 'book_1',
            title: '7步背书法',
            author: '朱福芳',
            emoji: '📖',
            gradient: '#667eea,#764ba2',
            chapters: [
                { title: '第一步：高声朗读法', content: '大声朗读是记忆的第一步。通过声音刺激听觉神经，可以将记忆效果提升3倍以上。朗读时要注意：语速适中、吐字清晰、情感投入。建议每段内容朗读3遍，边读边理解含义。' },
                { title: '第二步：快速背诵法', content: '快速背诵训练大脑的瞬时记忆能力。方法：先读一遍内容，然后立即合上书尝试背诵，忘记的地方标记出来，再读再背，直到能够完整背诵。这个过程可以在短时间内建立神经连接。' },
                { title: '第三步：专注背诵法', content: '专注是高效记忆的核心。创造无干扰的学习环境，使用番茄工作法，每25分钟专注背诵，然后休息5分钟。专注背诵时，可以闭上眼睛，在脑海中构建画面，让记忆更加深刻。' },
                { title: '第四步：利用镜子背书', content: '对着镜子背书，观察自己的表情和口型，可以增强自我反馈和记忆深度。方法：站在镜子前，看着自己的眼睛，大声背诵内容，想象自己正在给别人讲解，这样的场景可以大幅提升记忆效果。' },
                { title: '第五步：默写来补漏', content: '默写是检验记忆效果的最好方法。背诵完成后，立即进行默写，将忘记的内容和错误的地方重点标记，然后针对性地重新背诵。默写可以发现很多口头背诵时察觉不到的记忆漏洞。' },
                { title: '第六步：抓住黄金点', content: '记忆有两个黄金时间段：睡前1小时和醒来后1小时。睡前复习的内容会在睡眠中被大脑整理，醒来后大脑是空的，此时记忆不会受到前摄抑制的干扰。抓住这两个黄金点，记忆效果可以提升5倍以上。' },
                { title: '第七步：关键词备注', content: '将长篇内容提炼出关键词，建立关键词之间的逻辑联系。方法：先通读全文，划出核心关键词，然后用思维导图将关键词串联起来，形成知识网络。回忆时从关键词展开，就能还原出完整内容。' }
            ]
        },
        {
            id: 'book_2',
            title: '高效记忆法',
            author: '小枝',
            emoji: '🧠',
            gradient: '#f093fb,#f5576c',
            chapters: [
                { title: '第一章：了解你的大脑', content: '大脑有1000亿个神经元，每个神经元可以与其他神经元建立10000个连接。记忆的本质就是神经元之间建立新的连接。通过科学训练，可以让神经元连接更加紧密，记忆更加牢固。' },
                { title: '第二章：记忆的黄金时间', content: '一天中有两个记忆黄金期：早上6-8点，大脑经过睡眠整理，此时记忆不受前摄抑制干扰；晚上8-10点，睡前复习的内容会在睡眠中被大脑自动整理巩固。抓住这两个时间段，学习效率可以提升3倍以上。' }
            ]
        },
        {
            id: 'book_3',
            title: '优秀作文选',
            author: '刘威',
            emoji: '✍️',
            gradient: '#4facfe,#00f2fe',
            chapters: [
                { title: '第一章：写好开头的8种方法', content: '好的开头是成功的一半：1.开门见山法——直接点明主题；2.悬念设置法——提出问题引起好奇；3.环境描写法——用场景渲染气氛；4.引用开头法——引用名言诗句；5.对比开头法——用对比突出主题；6.倒叙开头法——先写结果再写经过。' }
            ]
        },
        {
            id: 'book_4',
            title: '数学思维',
            author: '黄冈教研室',
            emoji: '🔢',
            gradient: '#43e97b,#38f9d7',
            chapters: [
                { title: '第一章：数学思维入门', content: '数学思维不是天生的，是可以训练的。从观察、比较、分析、归纳四个方面入手，逐步培养数学思维能力。观察是基础，比较找异同，分析找规律，归纳成方法。每天坚持15分钟思维训练，3个月就能看到明显进步。' }
            ]
        }
    ];
}

// 挂载到window
window.renderLibrary = renderLibrary;
window.openLibraryBook = openLibraryBook;
window.readChapter = readChapter;
window.togglePlayPause = togglePlayPause;
window.openMindMapFromLibrary = openMindMapFromLibrary;

// ============================================================
// 学习图书馆模块 - 完整功能版
// 功能：书架、书籍阅读、目录、听书、阅读进度、笔记、收藏
// ============================================================

const LIBRARY_STORAGE_KEY = 'learning_library_data';

// 获取图书馆数据
function getLibraryData() {
    const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    // 默认数据
    return {
        currentBookId: null,
        currentChapterIndex: 0,
        books: [
            {
                id: 'book_1',
                title: '7步背书法',
                author: '朱福芳',
                emoji: '📖',
                gradient: '#667eea,#764ba2',
                favorite: true,
                progress: 0,
                chapters: [
                    { title: '第一步：高声朗读法', content: '大声朗读是记忆的第一步。通过声音刺激听觉神经，可以将记忆效果提升3倍以上。朗读时要注意：语速适中、吐字清晰、情感投入。建议每段内容朗读3遍，边读边理解含义。' },
                    { title: '第二步：快速背诵法', content: '快速背诵训练大脑的瞬时记忆能力。方法：先读一遍内容，然后立即合上书尝试背诵，忘记的地方标记出来，再读再背，直到能够完整背诵。这个过程可以在短时间内建立神经连接。' },
                    { title: '第三步：专注背诵法', content: '专注是高效记忆的核心。创造无干扰的学习环境，使用番茄工作法，每25分钟专注背诵，然后休息5分钟。专注背诵时，可以闭上眼睛，在脑海中构建画面，让记忆更加深刻。' },
                    { title: '第四步：利用镜子背书', content: '对着镜子背书，观察自己的表情和口型，可以增强自我反馈和记忆深度。方法：站在镜子前，看着自己的眼睛，大声背诵内容，想象自己正在给别人讲解，这样的场景可以大幅提升记忆效果。' },
                    { title: '第五步：默写来补漏', content: '默写是检验记忆效果的最好方法。背诵完成后，立即进行默写，将忘记的内容和错误的地方重点标记，然后针对性地重新背诵。默写可以发现很多口头背诵时察觉不到的记忆漏洞。' },
                    { title: '第六步：抓住黄金点', content: '记忆有两个黄金时间段：睡前1小时和醒来后1小时。睡前复习的内容会在睡眠中被大脑整理，醒来后大脑是空的，此时记忆不会受到前摄抑制的干扰。抓住这两个黄金点，记忆效果可以提升5倍以上。' },
                    { title: '第七步：关键词备注', content: '将长篇内容提炼出关键词，建立关键词之间的逻辑联系。方法：先通读全文，划出核心关键词，然后用思维导图将关键词串联起来，形成知识网络。回忆时从关键词展开，就能还原出完整内容。' }
                ],
                notes: []
            },
            {
                id: 'book_2',
                title: '高效记忆法',
                author: '小枝',
                emoji: '🧠',
                gradient: '#f093fb,#f5576c',
                favorite: false,
                progress: 0,
                chapters: [
                    { title: '第一章：了解你的大脑', content: '大脑有1000亿个神经元，每个神经元可以与其他神经元建立10000个连接。记忆的本质就是神经元之间建立新的连接。通过科学训练，可以让神经元连接更加紧密，记忆更加牢固。' },
                    { title: '第二章：记忆的黄金时间', content: '一天中有两个记忆黄金期：早上6-8点，大脑经过睡眠整理，此时记忆不受前摄抑制干扰；晚上8-10点，睡前复习的内容会在睡眠中被大脑自动整理巩固。抓住这两个时间段，学习效率可以提升3倍以上。' }
                ],
                notes: []
            },
            {
                id: 'book_3',
                title: '优秀作文选',
                author: '刘威',
                emoji: '✍️',
                gradient: '#4facfe,#00f2fe',
                favorite: true,
                progress: 0,
                chapters: [
                    { title: '第一章：写好开头的8种方法', content: '好的开头是成功的一半：1.开门见山法——直接点明主题；2.悬念设置法——提出问题引起好奇；3.环境描写法——用场景渲染气氛；4.引用开头法——引用名言诗句；5.对比开头法——用对比突出主题；6.倒叙开头法——先写结果再写经过。' }
                ],
                notes: []
            },
            {
                id: 'book_4',
                title: '数学思维',
                author: '黄冈教研室',
                emoji: '🔢',
                gradient: '#43e97b,#38f9d7',
                favorite: false,
                progress: 0,
                chapters: [
                    { title: '第一章：数学思维入门', content: '数学思维不是天生的，是可以训练的。从观察、比较、分析、归纳四个方面入手，逐步培养数学思维能力。观察是基础，比较找异同，分析找规律，归纳成方法。每天坚持15分钟思维训练，3个月就能看到明显进步。' }
                ],
                notes: []
            }
        ]
    };
}

// 保存图书馆数据
function saveLibraryData(data) {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(data));
}

// 渲染图书馆首页（书架）
function renderLibrary(container) {
    const data = getLibraryData();
    
    container.innerHTML = `
        <div style="padding:16px;min-height:100%;background:#f8f9fa;">
            <!-- 顶部栏 -->
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
            
            <!-- 分类标签 -->
            <div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:8px;">
                <span onclick="filterBooks('all')" id="filter-all" style="padding:6px 14px;background:#667eea;color:white;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">全部</span>
                <span onclick="filterBooks('favorite')" id="filter-favorite" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">⭐ 收藏</span>
                <span onclick="filterBooks('reading')" id="filter-reading" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">📖 阅读中</span>
            </div>
            
            <!-- 书架网格 -->
            <div id="booksGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;">
                ${renderBookCards(data.books)}
            </div>
            
            <!-- 学习统计 -->
            <div style="background:white;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:14px;font-weight:bold;margin-bottom:12px;color:#333;">📊 学习统计</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#667eea;">${data.books.length}</div>
                        <div style="font-size:11px;color:#999;">本书籍</div>
                    </div>
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#4caf50;">${data.books.reduce((sum, b) => sum + b.chapters.length, 0)}</div>
                        <div style="font-size:11px;color:#999;">总章节</div>
                    </div>
                    <div>
                        <div style="font-size:20px;font-weight:bold;color:#ff9800;">${data.books.filter(b => b.favorite).length}</div>
                        <div style="font-size:11px;color:#999;">已收藏</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染书籍卡片
function renderBookCards(books) {
    if (books.length === 0) {
        return '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">📚 暂无书籍</div>';
    }
    
    return books.map(book => `
        <div onclick="openLibraryBook('${book.id}')" style="cursor:pointer;">
            <div style="background:linear-gradient(135deg,${book.gradient});color:white;padding:16px;border-radius:14px;height:130px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,0.1);position:relative;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div style="font-size:28px;">${book.emoji}</div>
                    ${book.favorite ? '<span style="font-size:16px;">⭐</span>' : ''}
                </div>
                <div>
                    <div style="font-size:14px;font-weight:bold;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${book.title}</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">${book.chapters.length} 章节</div>
                    <div style="height:4px;background:rgba(255,255,255,0.3);border-radius:2px;margin-top:8px;overflow:hidden;">
                        <div style="height:100%;width:${book.progress}%;background:white;border-radius:2px;"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 过滤书籍
function filterBooks(type) {
    const data = getLibraryData();
    let books = data.books;
    
    if (type === 'favorite') {
        books = books.filter(b => b.favorite);
    } else if (type === 'reading') {
        books = books.filter(b => b.progress > 0 && b.progress < 100);
    }
    
    // 更新标签样式
    ['all', 'favorite', 'reading'].forEach(t => {
        const el = document.getElementById(`filter-${t}`);
        if (el) {
            el.style.background = t === type ? '#667eea' : '#f5f5f5';
            el.style.color = t === type ? 'white' : '#666';
        }
    });
    
    document.getElementById('booksGrid').innerHTML = renderBookCards(books);
}

// 从图书馆打开思维导图
function openMindMapFromLibrary() {
    window.renderMindMap(document.getElementById('fullscreen-content'));
}

// 打开书籍
function openLibraryBook(bookId) {
    const data = getLibraryData();
    const book = data.books.find(b => b.id === bookId);
    if (!book) return;
    
    data.currentBookId = bookId;
    saveLibraryData(data);
    
    renderBookReader(book, 0);
}

// 渲染书籍阅读器
function renderBookReader(book, chapterIndex) {
    const container = document.getElementById('fullscreen-content');
    const chapter = book.chapters[chapterIndex];
    
    // 更新进度
    const data = getLibraryData();
    const bookData = data.books.find(b => b.id === book.id);
    if (bookData) {
        bookData.progress = Math.round(((chapterIndex + 1) / book.chapters.length) * 100);
        saveLibraryData(data);
    }
    
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <button onclick="renderLibrary(document.getElementById('fullscreen-content'))" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 书架</button>
                <span style="font-weight:bold;font-size:15px;color:#333;">${book.emoji} ${book.title}</span>
                <button onclick="toggleBookFavorite('${book.id}')" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">${book.favorite ? '⭐' : '☆'}</button>
            </div>
            
            <!-- 章节目录 -->
            <div style="padding:12px;background:white;border-bottom:1px solid #eee;flex-shrink:0;overflow-x:auto;">
                <div style="display:flex;gap:8px;">
                    ${book.chapters.map((ch, i) => `
                        <button onclick="readLibraryChapter('${book.id}', ${i})" id="chapter-${i}" style="padding:8px 12px;background:${i === chapterIndex ? '#667eea' : '#f5f5f5'};color:${i === chapterIndex ? 'white' : '#666'};border:none;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">
                            第${i + 1}章
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- 阅读内容（手机优化） -->
            <div id="readingContent" style="flex:1;overflow:auto;padding:20px;background:white;">
                <div style="max-width:700px;margin:0 auto;">
                    <h1 style="font-size:20px;margin-bottom:8px;color:#333;line-height:1.4;">${chapter.title}</h1>
                    <div style="font-size:13px;color:#999;margin-bottom:24px;">作者：${book.author || '未知'}</div>
                    <div id="chapterContent" style="font-size:17px;line-height:2;color:#444;">
                        ${formatContent(chapter.content)}
                    </div>
                </div>
            </div>
            
            <!-- 底部控制栏 -->
            <div style="padding:12px 16px;background:white;box-shadow:0 -2px 4px rgba(0,0,0,0.05);flex-shrink:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">
                    <button onclick="prevChapter('${book.id}', ${chapterIndex})" style="flex:1;padding:10px;background:${chapterIndex === 0 ? '#eee' : '#f5f5f5'};color:${chapterIndex === 0 ? '#bbb' : '#666'};border:none;border-radius:10px;font-size:14px;cursor:pointer;" ${chapterIndex === 0 ? 'disabled' : ''}>
                        ◀ 上一章
                    </button>
                    <button onclick="toggleTTS()" id="ttsBtn" style="flex:1;padding:10px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">
                        🔊 听书
                    </button>
                    <button onclick="nextChapter('${book.id}', ${chapterIndex})" style="flex:1;padding:10px;background:${chapterIndex === book.chapters.length - 1 ? '#eee' : '#f5f5f5'};color:${chapterIndex === book.chapters.length - 1 ? '#bbb' : '#666'};border:none;border-radius:10px;font-size:14px;cursor:pointer;" ${chapterIndex === book.chapters.length - 1 ? 'disabled' : ''}>
                        下一章 ▶
                    </button>
                </div>
                <div style="height:6px;background:#eee;border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round(((chapterIndex + 1) / book.chapters.length) * 100)}%;background:#667eea;border-radius:3px;transition:width 0.3s;"></div>
                </div>
                <div style="text-align:center;font-size:12px;color:#999;margin-top:8px;">第 ${chapterIndex + 1} / ${book.chapters.length} 章</div>
            </div>
        </div>
    `;
}

// 切换收藏
function toggleBookFavorite(bookId) {
    const data = getLibraryData();
    const book = data.books.find(b => b.id === bookId);
    if (book) {
        book.favorite = !book.favorite;
        saveLibraryData(data);
        renderBookReader(book, data.currentChapterIndex || 0);
        window.showToast(book.favorite ? '⭐ 已收藏' : '取消收藏');
    }
}

// 阅读章节
function readLibraryChapter(bookId, chapterIndex) {
    const data = getLibraryData();
    const book = data.books.find(b => b.id === bookId);
    if (!book) return;
    
    data.currentChapterIndex = chapterIndex;
    saveLibraryData(data);
    
    renderBookReader(book, chapterIndex);
}

// 上一章
function prevChapter(bookId, currentIndex) {
    if (currentIndex > 0) {
        readLibraryChapter(bookId, currentIndex - 1);
        const content = document.getElementById('readingContent');
        if (content) content.scrollTop = 0;
    }
}

// 下一章
function nextChapter(bookId, currentIndex) {
    const data = getLibraryData();
    const book = data.books.find(b => b.id === bookId);
    if (book && currentIndex < book.chapters.length - 1) {
        readLibraryChapter(bookId, currentIndex + 1);
        const content = document.getElementById('readingContent');
        if (content) content.scrollTop = 0;
    }
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

function toggleTTS() {
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

// 挂载到window
window.renderLibrary = renderLibrary;
window.openLibraryBook = openLibraryBook;
window.readLibraryChapter = readLibraryChapter;
window.prevChapter = prevChapter;
window.nextChapter = nextChapter;
window.toggleTTS = toggleTTS;
window.toggleBookFavorite = toggleBookFavorite;
window.filterBooks = filterBooks;
window.openMindMapFromLibrary = openMindMapFromLibrary;

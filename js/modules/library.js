// 学习图书馆模块 - 独立书架
function renderLibrary(container) {
    const data = window.loadData();
    const books = data.libraryBooks || getDefaultBooks();
    
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="history.back()" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
                <h2 style="margin:0;font-size:18px;">📚 学习图书馆</h2>
                <button onclick="addNewBook()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">+ 新增</button>
            </div>
            
            <!-- 分类标签 -->
            <div style="display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:8px;">
                <span onclick="filterBooks('all')" id="filter_all" style="padding:6px 14px;background:#667eea;color:white;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">全部</span>
                <span onclick="filterBooks('math')" id="filter_math" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">🔢 数学</span>
                <span onclick="filterBooks('chinese')" id="filter_chinese" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">📖 语文</span>
                <span onclick="filterBooks('english')" id="filter_english" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">🔤 英语</span>
                <span onclick="filterBooks('science')" id="filter_science" style="padding:6px 14px;background:#f5f5f5;color:#666;border-radius:20px;font-size:13px;cursor:pointer;white-space:nowrap;">🔬 科学</span>
            </div>
            
            <!-- 书架网格 -->
            <div id="booksGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
                ${renderBooksGrid(books)}
            </div>
            
            <!-- 统计信息 -->
            <div style="margin-top:24px;background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 16px 0;font-size:16px;">📊 阅读统计</h3>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;text-align:center;">
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#667eea;">${books.length}</div>
                        <div style="font-size:12px;color:#999;">总书籍</div>
                    </div>
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#4caf50;">${books.filter(b => b.status === 'done').length}</div>
                        <div style="font-size:12px;color:#999;">已读完</div>
                    </div>
                    <div>
                        <div style="font-size:24px;font-weight:bold;color:#ff9800;">${books.filter(b => b.status === 'reading').length}</div>
                        <div style="font-size:12px;color:#999;">阅读中</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染书籍网格
function renderBooksGrid(books) {
    if (books.length === 0) {
        return '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">暂无书籍</div>';
    }
    
    return books.map(book => {
        const colors = {
            math: 'linear-gradient(135deg,#667eea,#764ba2)',
            chinese: 'linear-gradient(135deg,#f093fb,#f5576c)',
            english: 'linear-gradient(135deg,#4facfe,#00f2fe)',
            science: 'linear-gradient(135deg,#43e97b,#38f9d7)',
            other: 'linear-gradient(135deg,#fa709a,#fee140)'
        };
        const bg = colors[book.category] || colors.other;
        
        return `
            <div onclick="openBook(${book.id})" style="cursor:pointer;">
                <div style="background:${bg};color:white;padding:16px;border-radius:12px;height:120px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                    <div>
                        <div style="font-size:24px;margin-bottom:4px;">${book.emoji || '📕'}</div>
                        <div style="font-size:13px;font-weight:bold;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${book.title}</div>
                    </div>
                    <div style="font-size:11px;opacity:0.8;">
                        ${book.status === 'done' ? '✅ 已读完' : book.status === 'reading' ? '📖 阅读中' : '⏳ 未开始'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 默认书籍
function getDefaultBooks() {
    return [
        { id: 1, title: '小学数学公式大全', category: 'math', emoji: '🔢', status: 'done', content: '这里是小学数学所有重要公式...' },
        { id: 2, title: '小学生必背古诗75首', category: 'chinese', emoji: '📖', status: 'reading', content: '1. 静夜思 李白\n床前明月光，疑是地上霜...' },
        { id: 3, title: '英语常用单词300个', category: 'english', emoji: '🔤', status: 'reading', content: 'apple 苹果\nbanana 香蕉\ncat 猫...' },
        { id: 4, title: '十万个为什么', category: 'science', emoji: '❓', status: 'todo', content: '为什么天空是蓝色的？因为光的散射...' },
        { id: 5, title: '乘法口诀表', category: 'math', emoji: '📋', status: 'done', content: '一一得一\n一二得二...' },
        { id: 6, title: '优秀作文选', category: 'chinese', emoji: '✍️', status: 'todo', content: '我的妈妈\n我的妈妈是世界上最好的妈妈...' }
    ];
}

// 过滤书籍
function filterBooks(category) {
    // 更新标签样式
    ['all', 'math', 'chinese', 'english', 'science'].forEach(c => {
        const el = document.getElementById(`filter_${c}`);
        if (el) {
            el.style.background = c === category ? '#667eea' : '#f5f5f5';
            el.style.color = c === category ? 'white' : '#666';
        }
    });
    
    const data = window.loadData();
    let books = data.libraryBooks || getDefaultBooks();
    
    if (category !== 'all') {
        books = books.filter(b => b.category === category);
    }
    
    document.getElementById('booksGrid').innerHTML = renderBooksGrid(books);
}

// 打开书籍
function openBook(bookId) {
    const data = window.loadData();
    const books = data.libraryBooks || getDefaultBooks();
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        window.showToast('书籍不存在');
        return;
    }
    
    const container = document.getElementById('fullscreen-content');
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="renderLibrary(document.getElementById('fullscreen-content'))" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回书架</button>
                <h2 style="margin:0;font-size:16px;">${book.emoji} ${book.title}</h2>
                <button onclick="editBook(${book.id})" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">✏️ 编辑</button>
            </div>
            
            <!-- 书籍内容 -->
            <div style="background:white;border-radius:16px;padding:24px;min-height:400px;box-shadow:0 2px 8px rgba(0,0,0,0.05);line-height:1.8;font-size:15px;">
                ${book.content || '<div style="text-align:center;color:#999;padding:40px;">这本书还没有内容哦~<br><br>点击右上角"编辑"添加内容</div>'}
            </div>
            
            <!-- 阅读进度 -->
            <div style="margin-top:16px;background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size:14px;font-weight:bold;margin-bottom:12px;">📖 阅读状态</div>
                <div style="display:flex;gap:12px;">
                    <button onclick="setBookStatus(${book.id}, 'todo')" style="flex:1;padding:10px;background:${book.status === 'todo' ? '#ff9800' : '#f5f5f5'};color:${book.status === 'todo' ? 'white' : '#666'};border:none;border-radius:8px;font-size:13px;cursor:pointer;">
                        ⏳ 未开始
                    </button>
                    <button onclick="setBookStatus(${book.id}, 'reading')" style="flex:1;padding:10px;background:${book.status === 'reading' ? '#2196f3' : '#f5f5f5'};color:${book.status === 'reading' ? 'white' : '#666'};border:none;border-radius:8px;font-size:13px;cursor:pointer;">
                        📖 阅读中
                    </button>
                    <button onclick="setBookStatus(${book.id}, 'done')" style="flex:1;padding:10px;background:${book.status === 'done' ? '#4caf50' : '#f5f5f5'};color:${book.status === 'done' ? 'white' : '#666'};border:none;border-radius:8px;font-size:13px;cursor:pointer;">
                        ✅ 已读完
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 设置书籍状态
function setBookStatus(bookId, status) {
    const data = window.loadData();
    if (!data.libraryBooks) data.libraryBooks = getDefaultBooks();
    
    const book = data.libraryBooks.find(b => b.id === bookId);
    if (book) {
        book.status = status;
        window.saveData(data);
        openBook(bookId);
        window.showToast('状态已更新');
    }
}

// 新增书籍
function addNewBook() {
    showBookEditor(null);
}

// 编辑书籍
function editBook(bookId) {
    const data = window.loadData();
    const books = data.libraryBooks || getDefaultBooks();
    const book = books.find(b => b.id === bookId);
    showBookEditor(book);
}

// 显示书籍编辑器
function showBookEditor(book) {
    const isNew = !book;
    const container = document.getElementById('fullscreen-content');
    
    container.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <button onclick="renderLibrary(document.getElementById('fullscreen-content'))" style="padding:8px 16px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 取消</button>
                <h2 style="margin:0;font-size:16px;">${isNew ? '📚 新增书籍' : '✏️ 编辑书籍'}</h2>
                <button onclick="saveBook(${isNew ? 'null' : book.id})" style="padding:8px 16px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">💾 保存</button>
            </div>
            
            <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:14px;font-weight:bold;margin-bottom:8px;">书籍名称</label>
                    <input type="text" id="bookTitle" value="${book ? book.title : ''}" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;" placeholder="请输入书籍名称">
                </div>
                
                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:14px;font-weight:bold;margin-bottom:8px;">分类</label>
                    <select id="bookCategory" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;">
                        <option value="math" ${book && book.category === 'math' ? 'selected' : ''}>🔢 数学</option>
                        <option value="chinese" ${book && book.category === 'chinese' ? 'selected' : ''}>📖 语文</option>
                        <option value="english" ${book && book.category === 'english' ? 'selected' : ''}>🔤 英语</option>
                        <option value="science" ${book && book.category === 'science' ? 'selected' : ''}>🔬 科学</option>
                        <option value="other" ${book && book.category === 'other' ? 'selected' : ''}>📦 其他</option>
                    </select>
                </div>
                
                <div style="margin-bottom:16px;">
                    <label style="display:block;font-size:14px;font-weight:bold;margin-bottom:8px;">图标</label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${['📕', '📗', '📘', '📙', '📚', '📖', '🔢', '📝', '✍️', '🎯', '🧠', '❓', '🔬', '🌟'].map(e => `
                            <span onclick="selectEmoji('${e}')" id="emoji_${e}" style="padding:8px 12px;background:${book && book.emoji === e ? '#667eea' : '#f5f5f5'};color:${book && book.emoji === e ? 'white' : 'inherit'};border-radius:8px;cursor:pointer;font-size:18px;">${e}</span>
                        `).join('')}
                    </div>
                    <input type="hidden" id="bookEmoji" value="${book ? book.emoji : '📕'}">
                </div>
                
                <div>
                    <label style="display:block;font-size:14px;font-weight:bold;margin-bottom:8px;">书籍内容</label>
                    <textarea id="bookContent" style="width:100%;height:300px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;resize:vertical;font-family:inherit;line-height:1.8;" placeholder="请输入书籍内容...">${book ? book.content : ''}</textarea>
                </div>
            </div>
            
            ${!isNew ? `
                <div style="margin-top:16px;">
                    <button onclick="deleteBook(${book.id})" style="width:100%;padding:14px;background:#f44336;color:white;border:none;border-radius:12px;font-size:14px;cursor:pointer;">
                        🗑️ 删除这本书
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// 选择图标
function selectEmoji(emoji) {
    document.getElementById('bookEmoji').value = emoji;
    ['📕', '📗', '📘', '📙', '📚', '📖', '🔢', '📝', '✍️', '🎯', '🧠', '❓', '🔬', '🌟'].forEach(e => {
        const el = document.getElementById(`emoji_${e}`);
        if (el) {
            el.style.background = e === emoji ? '#667eea' : '#f5f5f5';
            el.style.color = e === emoji ? 'white' : 'inherit';
        }
    });
}

// 保存书籍
function saveBook(bookId) {
    const title = document.getElementById('bookTitle').value.trim();
    const category = document.getElementById('bookCategory').value;
    const emoji = document.getElementById('bookEmoji').value;
    const content = document.getElementById('bookContent').value;
    
    if (!title) {
        window.showToast('请输入书籍名称');
        return;
    }
    
    const data = window.loadData();
    if (!data.libraryBooks) data.libraryBooks = getDefaultBooks();
    
    if (bookId) {
        // 编辑
        const book = data.libraryBooks.find(b => b.id === bookId);
        if (book) {
            book.title = title;
            book.category = category;
            book.emoji = emoji;
            book.content = content;
        }
    } else {
        // 新增
        const newId = Math.max(0, ...data.libraryBooks.map(b => b.id)) + 1;
        data.libraryBooks.push({
            id: newId,
            title: title,
            category: category,
            emoji: emoji,
            content: content,
            status: 'todo'
        });
    }
    
    window.saveData(data);
    window.showToast('✅ 保存成功');
    renderLibrary(document.getElementById('fullscreen-content'));
}

// 删除书籍
function deleteBook(bookId) {
    if (!confirm('确定要删除这本书吗？')) return;
    
    const data = window.loadData();
    if (!data.libraryBooks) data.libraryBooks = getDefaultBooks();
    
    data.libraryBooks = data.libraryBooks.filter(b => b.id !== bookId);
    window.saveData(data);
    window.showToast('✅ 已删除');
    renderLibrary(document.getElementById('fullscreen-content'));
}

// 挂载到window
window.renderLibrary = renderLibrary;
window.filterBooks = filterBooks;
window.openBook = openBook;
window.setBookStatus = setBookStatus;
window.addNewBook = addNewBook;
window.editBook = editBook;
window.showBookEditor = showBookEditor;
window.selectEmoji = selectEmoji;
window.saveBook = saveBook;
window.deleteBook = deleteBook;

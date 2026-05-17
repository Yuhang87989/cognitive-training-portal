// V255: 学习图书馆模块 - 60本精选书籍，8大领域分类

window.LIBRARY_BOOKS = [
    // 领域1: 学习方法
    {category: '学习方法', title: '刻意练习', author: '安德斯·艾利克森', desc: '如何从新手到大师的科学方法', icon: '🎯'},
    {category: '学习方法', title: '学习之道', author: '芭芭拉·奥克利', desc: '公认的学习经典指南', icon: '📚'},
    {category: '学习方法', title: '深度工作', author: '卡尔·纽波特', desc: '专注力是21世纪的核心竞争力', icon: '💡'},
    {category: '学习方法', title: '高效能人士的七个习惯', author: '史蒂芬·柯维', desc: '全球最具影响力的个人成长著作', icon: '⭐'},
    {category: '学习方法', title: '思考，快与慢', author: '丹尼尔·卡尼曼', desc: '诺贝尔经济学奖得主的思维科学', icon: '🧠'},
    {category: '学习方法', title: '跃迁', author: '古典', desc: '成为高手的技术', icon: '🚀'},
    {category: '学习方法', title: '精进', author: '采铜', desc: '如何成为一个很厉害的人', icon: '⚡'},
    {category: '学习方法', title: '认知觉醒', author: '周岭', desc: '开启自我改变的原动力', icon: '🌟'},
    
    // 领域2: 作文语文
    {category: '作文语文', title: '文心', author: '夏丏尊/叶圣陶', desc: '写给中学生的语文启蒙书', icon: '✍️'},
    {category: '作文语文', title: '七十二堂写作课', author: '夏丏尊/叶圣陶', desc: '讲述文章作法的经典', icon: '📝'},
    {category: '作文语文', title: '作文基本功', author: '朱自清', desc: '语文大师教你写作文', icon: '🖋️'},
    {category: '作文语文', title: '给青年的二十七堂文学课', author: '叶圣陶', desc: '文学欣赏入门指南', icon: '📖'},
    {category: '作文语文', title: '如何阅读一本书', author: '莫提默·艾德勒', desc: '阅读的方法与技巧', icon: '📕'},
    {category: '作文语文', title: '文章读法', author: '朱自清', desc: '经典文章的阅读方法', icon: '📗'},
    {category: '作文语文', title: '语文常谈', author: '吕叔湘', desc: '语言文字的经典普及读物', icon: '📘'},
    {category: '作文语文', title: '说话的艺术', author: '林语堂', desc: '语言表达的艺术', icon: '💬'},
    
    // 领域3: 数学科学
    {category: '数学科学', title: '什么是数学', author: 'R·柯朗', desc: '对思想和方法的基本研究', icon: '🔢'},
    {category: '数学科学', title: '数学之美', author: '吴军', desc: '信息论与计算机科学的数学基础', icon: '🔣'},
    {category: '数学科学', title: '从一到无穷大', author: 'G·伽莫夫', desc: '科学中的事实和臆测', icon: '∞'},
    {category: '数学科学', title: '奇妙的物理学', author: 'A·瓦尔拉莫夫', desc: '身边的物理现象', icon: '⚛️'},
    {category: '数学科学', title: '趣味物理学', author: '雅科夫·别莱利曼', desc: '让物理变得有趣', icon: '🎢'},
    {category: '数学科学', title: '化学是什么', author: '周公度', desc: '化学入门必读', icon: '🧪'},
    {category: '数学科学', title: '生物学是什么', author: '王亚辉', desc: '生命科学入门', icon: '🧬'},
    {category: '数学科学', title: '时间简史', author: '史蒂芬·霍金', desc: '从大爆炸到黑洞', icon: '🌌'},
    
    // 领域4: 百科知识
    {category: '百科知识', title: 'DK儿童大百科', author: 'DK出版社', desc: '全球最权威的儿童百科', icon: '🌍'},
    {category: '百科知识', title: '十万个为什么', author: '少年儿童出版社', desc: '中国孩子的启蒙百科', icon: '❓'},
    {category: '百科知识', title: '万物简史', author: '比尔·布莱森', desc: '现代科学发展史', icon: '🌎'},
    {category: '百科知识', title: '人类简史', author: '尤瓦尔·赫拉利', desc: '从动物到上帝', icon: '🏛️'},
    {category: '百科知识', title: '未来简史', author: '尤瓦尔·赫拉利', desc: '从智人到智神', icon: '🤖'},
    {category: '百科知识', title: '今日简史', author: '尤瓦尔·赫拉利', desc: '人类命运大议题', icon: '📰'},
    {category: '百科知识', title: '世界观', author: '理查德·德威特', desc: '现代人必须懂的科学哲学', icon: '🌐'},
    {category: '百科知识', title: '苏菲的世界', author: '乔斯坦·贾德', desc: '哲学启蒙小说', icon: '👧'},
    
    // 领域5: 漫画科普
    {category: '漫画科普', title: '半小时漫画中国史', author: '陈磊', desc: '用漫画解读历史', icon: '🇨🇳'},
    {category: '漫画科普', title: '半小时漫画世界史', author: '陈磊', desc: '世界历史轻松读', icon: '🌏'},
    {category: '漫画科普', title: '半小时漫画科学史', author: '陈磊', desc: '科学发现的故事', icon: '🔬'},
    {category: '漫画科普', title: '赛雷三分钟漫画中国史', author: '赛雷', desc: '趣味中国历史', icon: '📜'},
    {category: '漫画科普', title: '植物大战僵尸科学漫画', author: '笑江南', desc: '寓教于乐的科学漫画', icon: '🌱'},
    {category: '漫画科普', title: '这就是物理', author: '约瑟夫·米森', desc: '美国经典物理科学启蒙', icon: '⚡'},
    {category: '漫画科普', title: '这就是化学', author: '米莱童书', desc: '化学知识漫画解读', icon: '⚗️'},
    {category: '漫画科普', title: '漫画原子物理学', author: '加来道雄', desc: '量子物理轻松入门', icon: '⚛️'},
    
    // 领域6: 成长励志
    {category: '成长励志', title: '小王子', author: '圣埃克苏佩里', desc: '永远的成长经典', icon: '👑'},
    {category: '成长励志', title: '牧羊少年奇幻之旅', author: '保罗·柯艾略', desc: '追求梦想的寓言', icon: '🐑'},
    {category: '成长励志', title: '解忧杂货店', author: '东野圭吾', desc: '温暖人心的故事', icon: '🏪'},
    {category: '成长励志', title: '阿甘正传', author: '温斯顿·格鲁姆', desc: '笨小孩的人生智慧', icon: '🏃'},
    {category: '成长励志', title: '当幸福来敲门', author: '克里斯·加德纳', desc: '永不放弃的励志故事', icon: '🚪'},
    {category: '成长励志', title: '风雨哈佛路', author: '莉丝·默里', desc: '绝境中逆袭的真实故事', icon: '🎓'},
    {category: '成长励志', title: '相约星期二', author: '米奇·阿尔博姆', desc: '人生最后一堂课', icon: '📅'},
    {category: '成长励志', title: '海鸥乔纳森', author: '理查德·巴赫', desc: '追求卓越的寓言', icon: '🕊️'},
    
    // 领域7: 技术前沿
    {category: '技术前沿', title: '人工智能', author: '李开复', desc: 'AI的现在与未来', icon: '🤖'},
    {category: '技术前沿', title: '智能时代', author: '吴军', desc: '大数据与智能革命', icon: '💻'},
    {category: '技术前沿', title: '深度学习', author: 'Ian Goodfellow', desc: 'AI圣经', icon: '🧠'},
    {category: '技术前沿', title: 'Python编程：从入门到实践', author: '埃里克·马瑟斯', desc: '编程入门首选', icon: '🐍'},
    {category: '技术前沿', title: '浪潮之巅', author: '吴军', desc: '科技巨头的兴衰', icon: '🌊'},
    {category: '技术前沿', title: '硅谷之谜', author: '吴军', desc: '创新的秘密', icon: '💡'},
    {category: '技术前沿', title: '奇点临近', author: '雷·库兹韦尔', desc: '技术发展的未来', icon: '🚀'},
    {category: '技术前沿', title: '未来科技', author: '加来道雄', desc: '2100年的世界', icon: '🔮'},
    
    // 领域8: 大国重器
    {category: '大国重器', title: '中国天眼', author: '南仁东', desc: 'FAST射电望远镜的故事', icon: '📡'},
    {category: '大国重器', title: '蛟龙入海', author: '许晨', desc: '深海探测的壮举', icon: '🐉'},
    {category: '大国重器', title: '嫦娥探月', author: '国防科工局', desc: '中国探月工程纪实', icon: '🌙'},
    {category: '大国重器', title: '北斗导航', author: '中国卫星导航', desc: '北斗系统建设历程', icon: '🛰️'},
    {category: '大国重器', title: '高铁风云录', author: '高铁见闻', desc: '中国高铁发展史', icon: '🚄'},
    {category: '大国重器', title: 'C919大飞机', author: '中国商飞', desc: '国产大飞机的诞生', icon: '✈️'},
    {category: '大国重器', title: '航母之路', author: '李杰', desc: '中国航母发展历程', icon: '🚢'},
    {category: '大国重器', title: '量子科技', author: '施一公', desc: '量子计算与通信', icon: '⚛️'}
];

function renderLibraryModule(container) {
    var categories = ['学习方法', '作文语文', '数学科学', '百科知识', '漫画科普', '成长励志', '技术前沿', '大国重器'];
    
    container.innerHTML = `
        <div style="padding: 16px;">
            <!-- 下载状态统计 -->
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 16px; margin-bottom: 16px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 16px; font-weight: 600;">📚 图书馆进度</div>
                    <button onclick="openDownloadProgress()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; cursor: pointer;">查看详情</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">60</div>
                        <div style="font-size: 11px; opacity: 0.9;">总书籍数</div>
                    </div>
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">8</div>
                        <div style="font-size: 11px; opacity: 0.9;">领域分类</div>
                    </div>
                    <div>
                        <div style="font-size: 20px; font-weight: bold;">0</div>
                        <div style="font-size: 11px; opacity: 0.9;">已下载</div>
                    </div>
                </div>
            </div>
            
            <!-- 分类导航 -->
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px;">
                <button onclick="filterBooks('全部')" id="cat-btn-all" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 20px; font-size: 13px; white-space: nowrap; cursor: pointer;">全部</button>
                ` + categories.map(function(cat) {
                    return '<button onclick="filterBooks(\'' + cat + '\')" id="cat-btn-' + cat + '" style="padding: 8px 16px; background: #f5f5f5; color: #666; border: none; border-radius: 20px; font-size: 13px; white-space: nowrap; cursor: pointer;">' + cat + '</button>';
                }).join('') + `
            </div>
            
            <!-- 书籍列表 -->
            <div id="books-list" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
    
    // 渲染所有书籍
    filterBooks('全部');
}

function filterBooks(category) {
    var books = LIBRARY_BOOKS;
    if (category !== '全部') {
        books = books.filter(function(b) { return b.category === category; });
    }
    
    // 更新按钮样式
    document.querySelectorAll('[id^="cat-btn-"]').forEach(function(btn) {
        btn.style.background = '#f5f5f5';
        btn.style.color = '#666';
    });
    var activeBtn = document.getElementById('cat-btn-' + (category === '全部' ? 'all' : category));
    if (activeBtn) {
        activeBtn.style.background = '#667eea';
        activeBtn.style.color = 'white';
    }
    
    var listEl = document.getElementById('books-list');
    listEl.innerHTML = books.map(function(book) {
        return `
            <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                    ` + book.icon + `
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 4px;">` + book.title + `</div>
                    <div style="font-size: 12px; color: #999; margin-bottom: 6px;">` + book.author + `</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">` + book.desc + `</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="background: #f0f3ff; color: #667eea; padding: 2px 8px; border-radius: 10px; font-size: 11px;">` + book.category + `</span>
                        <button onclick="downloadBook('` + book.title + `')" style="background: #43e97b; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">📥 加入书单</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function downloadBook(title) {
    var user = getCurrentUserData();
    if (!user.downloadedBooks) user.downloadedBooks = [];
    
    if (!user.downloadedBooks.includes(title)) {
        user.downloadedBooks.push(title);
        saveCurrentUserData(user);
        showToast('已将《' + title + '》加入书单 📚');
    } else {
        showToast('这本书已经在你的书单中了');
    }
}

function openDownloadProgress() {
    var modal = document.getElementById('detail-modal');
    var content = document.getElementById('detail-content');
    modal.classList.add('show');
    
    var user = getCurrentUserData();
    var downloaded = user.downloadedBooks || [];
    var progress = Math.round((downloaded.length / LIBRARY_BOOKS.length) * 100);
    
    content.innerHTML = `
        <div style="padding: 8px 0;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; text-align: center;">📋 下载进度</h3>
            
            <div style="background: #f5f5f5; height: 12px; border-radius: 6px; margin-bottom: 12px; overflow: hidden;">
                <div style="width: ` + progress + '%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 6px;"' + `></div>
            </div>
            <div style="text-align: center; color: #667eea; font-weight: 600; margin-bottom: 20px;">` + progress + '% (' + downloaded.length + '/' + LIBRARY_BOOKS.length + ')</div>
            
            <div style="margin-bottom: 16px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">📚 推荐下载网站</div>
                <div style="background: #f9f9f9; border-radius: 10px; padding: 12px; font-size: 13px; line-height: 1.8;">
                    <div>• 国家数字图书馆: http://www.nlc.cn</div>
                    <div>• 微信读书: https://weread.qq.com</div>
                    <div>• 得到App: https://www.dedao.cn</div>
                    <div>• 豆瓣阅读: https://read.douban.com</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">✅ 我的书单 (' + downloaded.length + ')</div>
                <div style="max-height: 200px; overflow-y: auto;">
                    ` + (downloaded.length === 0 ? '<div style="text-align: center; color: #999; padding: 20px;">还没有加入任何书籍</div>' : 
                    downloaded.map(function(title) {
                        return '<div style="background: white; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; font-size: 13px;">📖 ' + title + '</div>';
                    }).join('')) + `
                </div>
            </div>
            
            <button onclick="closeModal()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">关闭</button>
        </div>
    `;
}

window.renderLibraryModule = renderLibraryModule;
window.filterBooks = filterBooks;
window.downloadBook = downloadBook;
window.openDownloadProgress = openDownloadProgress;

// 兼容函数
function renderLibraryPage(container) {
    renderLibraryModule(container);
}
window.renderLibraryPage = renderLibraryPage;

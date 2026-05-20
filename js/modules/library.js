// ============================================================
// V288 学习图书馆模块 - 新增高效记忆书籍
// 功能：书架、书籍阅读、目录、听书、阅读进度、笔记、收藏、下载导出
// 新增：七种学霸方法教程 + 语音朗读 + 高效记忆全书
// ============================================================

(function() {
    const LIBRARY_STORAGE_KEY = 'learning_library_data';
    
    // 七种学霸方法教程
    const LEARNING_METHODS = [
        {
            id: 'method_1',
            title: '费曼学习法',
            author: '理查德·费曼',
            emoji: '🎓',
            gradient: '#667eea,#764ba2',
            category: '学霸方法',
            favorite: true,
            progress: 0,
            chapters: [
                {
                    title: '什么是费曼学习法？',
                    content: '费曼学习法是世界上最好的学习方法之一，由诺贝尔物理学奖获得者理查德·费曼发明。核心思想是：如果你不能用简单的语言把一个概念讲清楚，说明你还没有真正理解它。这个方法可以帮你快速理解任何知识，并且记得更牢。'
                },
                {
                    title: '第一步：选择一个概念',
                    content: '拿出一张白纸，在顶部写下你想要学习的概念。这个概念可以是任何东西：数学公式、物理原理、编程概念、历史事件等等。重要的是要明确你要学习什么。'
                },
                {
                    title: '第二步：模拟给小学生讲解',
                    content: '想象你正在给一个10岁的小学生讲解这个概念。用最简单的语言，避免使用专业术语。如果你发现自己卡壳了，或者需要用复杂的词，说明你还需要继续学习。回到教材重新学习，直到能够用最简单的话讲清楚。'
                },
                {
                    title: '第三步：找到知识漏洞',
                    content: '在讲解的过程中，你一定会遇到卡住的地方，这些就是你的知识漏洞。把这些地方标记出来，然后回到教材、笔记或者其他资料，把这些漏洞补上。这是最关键的一步，也是进步最快的一步。'
                },
                {
                    title: '第四步：简化和类比',
                    content: '把你学到的知识简化，用更简单的语言重新组织。尝试用生活中的例子来类比，让抽象的概念变得具体。比如把电流比作水流，把电压比作水压。找到好的类比，说明你真的理解了。'
                }
            ],
            notes: []
        },
        {
            id: 'method_2',
            title: '艾宾浩斯遗忘曲线',
            author: '赫尔曼·艾宾浩斯',
            emoji: '📈',
            gradient: '#f093fb,#f5576c',
            category: '学霸方法',
            favorite: true,
            progress: 0,
            chapters: [
                {
                    title: '遗忘的规律',
                    content: '德国心理学家艾宾浩斯研究发现，人的记忆是有规律的：学习20分钟后，就会忘记42%的内容；1小时后忘记56%；1天后忘记74%；1周后忘记77%；1个月后忘记79%。遗忘的速度是先快后慢。'
                },
                {
                    title: '为什么会遗忘？',
                    content: '遗忘不是坏事，它是大脑的自我保护机制。如果记住所有事情，大脑会负担过重。大脑会自动筛选它认为重要的信息，经常使用的信息会被标记为重要，保存在长期记忆中；不用的信息就会被遗忘。'
                },
                {
                    title: '科学的复习时间点',
                    content: '根据遗忘曲线，最佳复习时间点是：1.学习后20分钟第一次复习；2.1小时后第二次复习；3.当天晚上或第二天早上第三次复习；4.一周后第四次复习；5.一个月后第五次复习。按照这个节奏复习，可以把短期记忆转化为长期记忆。'
                },
                {
                    title: '主动回忆比被动复习有效10倍',
                    content: '不要只是反复看书，那是被动复习，效果很差。主动回忆效果要好得多：合上书，把学到的内容在脑子里过一遍，或者写下来，或者讲出来。回忆不起来的地方，就是需要重点复习的地方。'
                },
                {
                    title: '间隔重复的实操方法',
                    content: '制作学习卡片，正面写问题，背面写答案。每天复习卡片，能够马上想起来的，就放在后面再复习；想不起来的，就放在前面，第二天继续复习。连续三次都能答对的卡片，可以一周后再复习。'
                }
            ],
            notes: []
        },
        {
            id: 'method_3',
            title: '番茄工作法',
            author: '弗朗西斯科·西里洛',
            emoji: '🍅',
            gradient: '#4facfe,#00f2fe',
            category: '学霸方法',
            favorite: false,
            progress: 0,
            chapters: [
                {
                    title: '为什么专注这么难？',
                    content: '人的注意力是有限的，成年人的平均专注时间只有25分钟左右。超过这个时间，大脑就会疲劳，效率下降。番茄工作法就是利用这个规律，把工作和休息有节奏地交替进行。'
                },
                {
                    title: '番茄工作法的5个步骤',
                    content: '1.确定一个要完成的任务；2.设置25分钟倒计时；3.在这25分钟内专注工作，不受任何干扰；4.时间到后，休息5分钟；5.完成4个番茄后，休息15-30分钟。就这么简单，但效果惊人！'
                },
                {
                    title: '如何应对干扰？',
                    content: '学习过程中总会有干扰：手机消息、突然想起的事情、想喝水等等。应对方法：1.手机放远，开启飞行模式；2.准备一个小本子，突然想起的事情先写下来，等休息时再处理；3.告诉家人和同学你在学习，不要打扰。'
                },
                {
                    title: '为什么必须休息？',
                    content: '很多人觉得休息是浪费时间，其实错了。休息不是浪费时间，而是为了更好地学习。大脑就像肌肉，持续工作会疲劳，休息可以让大脑恢复精力，还可以让学到的知识得到巩固。不会休息的人就不会学习。'
                },
                {
                    title: '番茄工作法的进阶技巧',
                    content: '1.每个番茄开始前，明确目标：这个番茄我要完成什么？2.番茄结束后，记录完成情况；3.保护你的番茄，不要被打断；4.如果提前完成，就用剩下的时间检查和优化；5.根据自己的情况调整时间，不是必须25分钟。'
                }
            ],
            notes: []
        },
        {
            id: 'method_4',
            title: '思维导图学习法',
            author: '东尼·博赞',
            emoji: '🌳',
            gradient: '#43e97b,#38f9d7',
            category: '学霸方法',
            favorite: false,
            progress: 0,
            chapters: [
                {
                    title: '大脑的思考方式',
                    content: '大脑不是线性思考的，而是像一棵树一样，从一个中心向四周发散出无数的分支。思维导图就是模仿大脑的这种思考方式，把杂乱的知识整理成一张清晰的图。传统的线性笔记违背了大脑的工作方式。'
                },
                {
                    title: '思维导图的7个规则',
                    content: '1.从一张白纸的中心开始；2.用一张图或图画表达中心思想；3.使用多种颜色；4.将中心图像和主要分支连接起来；5.让分支自然弯曲；6.每条线上只用一个关键词；7.自始至终使用图形。'
                },
                {
                    title: '如何用思维导图做笔记？',
                    content: '听课时不要逐字记录，而是先听老师讲完一段，理解了之后，用思维导图的方式把核心要点画下来。关键词而不是完整句子，这样可以迫使你思考和理解，而不是机械抄写。'
                },
                {
                    title: '用思维导图复习',
                    content: '复习时，先不要看书，拿出一张白纸，尝试画出这一章的思维导图。画完后和书对照，看看哪些地方漏掉了，哪些地方理解错了。然后修改完善。这就是主动回忆，比单纯看书有效得多。'
                },
                {
                    title: '用思维导图制定计划',
                    content: '思维导图不仅可以用来学习，还可以用来制定计划、整理思路、做总结、写作文。中心写主题，分支写要点，子分支写细节。一张图胜过千言万语，思路瞬间清晰。'
                }
            ],
            notes: []
        },
        {
            id: 'method_5',
            title: '康奈尔笔记法',
            author: '康奈尔大学',
            emoji: '📝',
            gradient: '#fa709a,#fee140',
            category: '学霸方法',
            favorite: false,
            progress: 0,
            chapters: [
                {
                    title: '为什么需要好的笔记方法？',
                    content: '很多人做笔记就是抄书，抄了满满一本，考试时发现根本用不上。好的笔记不是抄得全，而是能帮助你思考、理解和复习。康奈尔笔记法是全球公认最好的笔记方法，被称为"笔记的女王"。'
                },
                {
                    title: '康奈尔笔记的布局',
                    content: '把一页纸分成三个部分：右侧约70%的空间是笔记区，用来记录课堂内容；左侧约20%的空间是问题区，课后用来写关键词、提问题；底部约10%的空间是总结区，课后用1-2句话总结这页的内容。'
                },
                {
                    title: '五步完成康奈尔笔记',
                    content: '1.记录：上课或看书时在笔记区记录要点，用短句和符号；2.简化：课后尽快把要点提炼成关键词写在左侧；3.背诵：遮住笔记区，只看关键词，尝试背诵内容；4.思考：在总结区写下自己的思考和理解；5.复习：每周花10分钟快速复习。'
                },
                {
                    title: '做笔记的常见误区',
                    content: '误区1：抄得越全越好，错！抄书时大脑根本没有思考；误区2：追求工整美观，错！笔记是给自己看的，实用最重要；误区3：从不复习，错！笔记做完不看等于白做；误区4：只用一种颜色，错！不同颜色区分重要性，复习效率更高。'
                },
                {
                    title: '如何用康奈尔笔记复习考试？',
                    content: '复习时，只看左侧的关键词，然后尝试回忆内容。回忆不起来的，就做个标记，重点复习。复习完后看底部的总结，回忆整个章节的框架。这样复习比把笔记从头到尾读一遍效率高3倍。'
                }
            ],
            notes: []
        },
        {
            id: 'method_6',
            title: 'SQ3R阅读法',
            author: '罗宾逊',
            emoji: '📖',
            gradient: '#a18cd1,#fbc2eb',
            category: '学霸方法',
            favorite: false,
            progress: 0,
            chapters: [
                {
                    title: '为什么读书越快忘得越快？',
                    content: '很多人读书追求速度，一本书几天就看完了，看完就忘，等于白看。SQ3R是一套经过验证的有效阅读方法，虽然看起来慢，但实际上学到的东西要多得多。五个字母分别代表：浏览、提问、阅读、复述、复习。'
                },
                {
                    title: '第一步：浏览(Survey)',
                    content: '不要一上来就从头读到尾。先花3-5分钟浏览整本书：看目录、标题、图片、表格、加粗的文字、开头和结尾的总结。了解整本书的框架和重点，知道哪些是重要的，哪些可以跳过。'
                },
                {
                    title: '第二步：提问(Question)',
                    content: '在正式阅读之前，先提出问题：这一章讲的是什么？我已经知道什么？我想学到什么？作者会怎么回答这些问题？带着问题读书，就像带着目的地寻宝，注意力会更集中，收获也会更大。'
                },
                {
                    title: '第三步：阅读(Read)',
                    content: '现在开始认真阅读，重点放在理解上，而不是速度。遇到不懂的地方先标记，不要停下来反复纠结，先读完再说。阅读时不要做笔记，先专注理解。一个章节一个章节地读，不要一次性读太多。'
                },
                {
                    title: '第四步：复述(Recite) + 第五步：复习(Review)',
                    content: '读完一个章节后，合上书，试着用自己的话复述刚才学到的内容。能复述出来说明真的理解了。复述完后，简单做个笔记。全部读完后，第二天再花10分钟复习一遍，一周后再复习一遍，知识就真正属于你了。'
                }
            ],
            notes: []
        },
        {
            id: 'method_7',
            title: '刻意练习',
            author: '安德斯·艾利克森',
            emoji: '🏆',
            gradient: '#30cfd0,#330867',
            category: '学霸方法',
            favorite: true,
            progress: 0,
            chapters: [
                {
                    title: '1万小时定律是错的！',
                    content: '很多人说要成为专家需要1万小时，但这是不对的。不是1万小时的重复练习，而是1万小时的刻意练习。如果你只是重复已经会的东西，练习10万小时也没用。只有在学习区练习，才能真正进步。'
                },
                {
                    title: '什么是刻意练习？',
                    content: '刻意练习有四个特点：1.有定义明确的具体目标；2.专注：练习时必须全神贯注；3.有反馈：做完后知道哪里好哪里不好；4.走出舒适区：练习你还不会的内容，而不是重复已经会的。'
                },
                {
                    title: '舒适区、学习区、恐慌区',
                    content: '舒适区：你已经熟练掌握的内容，在这里练习没有进步；学习区：对你来说有挑战性，但经过努力可以掌握的内容，这是进步最快的地方；恐慌区：对你来说太难的内容，会打击信心。有效学习的关键是始终待在学习区。'
                },
                {
                    title: '如何获得高质量的反馈？',
                    content: '反馈是刻意练习的核心。没有反馈，你不知道自己做得对不对。获得反馈的方法：1.找一个好老师或教练；2.和标准答案对比；3.录下来自己看；4.和同学讨论。错误不是坏事，发现错误才能进步。'
                },
                {
                    title: '心理表征：专家和普通人的区别',
                    content: '专家不是比普通人更聪明，而是他们脑子里有更多更好的心理表征。心理表征就是大脑对事物的认知模式。就像下棋大师，他能一眼看出整个棋盘的局势，瞬间想到几十种走法。这是成千上万小时练习积累出来的。'
                }
            ],
            notes: []
        }
    ];
    
    // 默认基础书籍
    const DEFAULT_BOOKS = [
        {
            id: 'book_1',
            title: '7步背书法',
            author: '朱福芳',
            emoji: '📕',
            gradient: '#667eea,#764ba2',
            category: '记忆方法',
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
            title: '高效记忆',
            author: '小枝',
            emoji: '🧠',
            gradient: '#f093fb,#f5576c',
            category: '记忆方法',
            favorite: true,
            progress: 0,
            chapters: [
                { title: '第一章：了解你的大脑', content: '大脑是人体最神奇的器官，拥有约860亿个神经元。记忆的本质是神经元之间建立连接，形成神经回路。理解大脑的工作原理，可以帮助我们更好地利用它进行学习和记忆。大脑分为左右半球，左脑负责逻辑、语言、数学，右脑负责图像、音乐、空间感。高效记忆需要同时调动左右脑。' },
                { title: '第二章：记忆的黄金时间', content: '一天中有四个记忆黄金时段：第一个是早上6-7点，大脑经过休息后状态最佳；第二个是上午8-10点，注意力最集中；第三个是傍晚6-8点，适合整理和复习；第四个是睡前1小时，睡前记忆的内容会在睡眠中被大脑自动整理。了解并利用这些黄金时间，可以让记忆效果翻倍。' },
                { title: '第三章：联想记忆法', content: '联想是记忆的核心。大脑更容易记住有联系的事物。方法：将要记忆的内容与已知的、有趣的、夸张的事物联系起来。比如记忆单词"ambition"（雄心），可以联想为"我必胜"。联想越夸张、越有趣、画面感越强，记忆就越深刻。' },
                { title: '第四章：位置记忆法', content: '位置记忆法是古罗马演讲家使用的经典记忆技巧。方法：选择一个你非常熟悉的路线，比如从家到学校的路，将要记忆的内容按照顺序放在路线的各个位置上。回忆时，就在脑海中走一遍这条路，每到一个位置就想起对应的内容。这种方法特别适合记忆大量有序的信息。' },
                { title: '第五章：组块记忆法', content: '人的短期记忆容量有限，一次只能记住7±2个信息单元。组块就是把小的信息单元组合成大的单元。比如记忆手机号码138****6789，可以分成138-1234-5678三个组块来记。记忆长文章时，先分段，每段提炼一个关键词，通过记忆关键词来记忆整段内容。' },
                { title: '第六章：多感官协同记忆', content: '调动越多的感官，记忆就越牢固。学习时不仅要用眼睛看，还要用嘴读、用手写、用耳朵听。看+读+写+听，四种感官同时工作，在大脑中建立多重神经连接。比如背英语单词时，边看边读边写，记忆效果是只看的5倍。' },
                { title: '第七章：克服遗忘的秘诀', content: '遗忘是正常的，关键是如何对抗遗忘。秘诀一：及时复习，学习后24小时内复习效果最好；秘诀二：过度学习，记住后再多学50%的时间；秘诀三：分散复习，不要集中在一天复习，分成几天复习效果更好；秘诀四：尝试回忆，合上书回忆比反复看书更有效。' }
            ],
            notes: []
        }
    ];
    
    // TTS语音播放状态
    let isPlaying = false;
    let currentUtterance = null;
    
    // 获取图书馆数据
    function getLibraryData() {
        try {
            const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                // 确保有七种学霸方法
                if (!data.books || data.books.findIndex(b => b.category === '学霸方法') === -1) {
                    data.books = [...(data.books || []), ...LEARNING_METHODS];
                    saveLibraryData(data);
                }
                return data;
            }
        } catch(e) {
            console.error('读取图书馆数据失败:', e);
        }
        
        // 默认数据
        return {
            currentBookId: null,
            currentChapterIndex: 0,
            books: [...DEFAULT_BOOKS, ...LEARNING_METHODS]
        };
    }
    
    // 保存图书馆数据
    function saveLibraryData(data) {
        localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(data));
        if (window.DataSync) window.DataSync.set('library', data);
    }
    
    // 获取书籍封面
    function getBookCover(book) {
        return `background:linear-gradient(135deg,${book.gradient});`;
    }
    
    // 语音朗读 - TTS
    function speakText(text, chapterTitle) {
        // 停止当前播放
        stopSpeaking();
        
        if (!window.speechSynthesis) {
            window.showToast('您的浏览器不支持语音朗读');
            return;
        }
        
        // 创建语音实例
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // 语速稍慢
        utterance.pitch = 1.0; // 正常音调
        utterance.lang = 'zh-CN'; // 中文
        
        // 找中文语音
        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        utterance.onstart = function() {
            isPlaying = true;
            updatePlayButton(true);
            window.showToast(`正在朗读：${chapterTitle}`);
        };
        
        utterance.onend = function() {
            isPlaying = false;
            updatePlayButton(false);
        };
        
        utterance.onerror = function(e) {
            console.error('语音朗读错误:', e);
            isPlaying = false;
            updatePlayButton(false);
            window.showToast('朗读出错，请重试');
        };
        
        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }
    
    // 停止语音
    function stopSpeaking() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        isPlaying = false;
        currentUtterance = null;
        updatePlayButton(false);
    }
    
    // 更新播放按钮状态
    function updatePlayButton(playing) {
        const btn = document.getElementById('tts-play-btn');
        if (btn) {
            btn.textContent = playing ? '⏸️ 暂停' : '🔊 听书';
            btn.style.background = playing ? '#f44336' : '#667eea';
        }
    }
    
    // 下载书籍为TXT文件
    function downloadBook(book) {
        let content = `【${book.title}】\n`;
        content += `作者：${book.author}\n`;
        content += `导出时间：${new Date().toLocaleString('zh-CN')}\n`;
        content += `${'='.repeat(50)}\n\n`;
        
        book.chapters.forEach((chapter, index) => {
            content += `第${index + 1}章：${chapter.title}\n`;
            content += `${'-'.repeat(30)}\n`;
            content += chapter.content;
            content += '\n\n';
        });
        
        content += `\n${'='.repeat(50)}\n`;
        content += '由认知训练学习图书馆导出\n';
        
        // 创建下载
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${book.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.showToast(`✅ 已下载：${book.title}`);
    }
    
    // 导出所有书籍
    function downloadAllBooks() {
        const data = getLibraryData();
        let content = '【认知训练 - 学习图书馆】\n';
        content += `共 ${data.books.length} 本书\n`;
        content += `导出时间：${new Date().toLocaleString('zh-CN')}\n`;
        content += `${'='.repeat(60)}\n\n\n`;
        
        data.books.forEach((book, bookIndex) => {
            content += `══════════════════════════════════\n`;
            content += `📚 第${bookIndex + 1}本书：${book.title}\n`;
            content += `👤 作者：${book.author}\n`;
            content += `══════════════════════════════════\n\n`;
            
            book.chapters.forEach((chapter, index) => {
                content += `◆ 第${index + 1}章：${chapter.title}\n`;
                content += `${chapter.content}\n\n`;
            });
            
            content += '\n';
        });
        
        content += `\n${'='.repeat(60)}\n`;
        content += '学习图书馆 - 让学习更高效\n';
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `学习图书馆_全套书籍_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.showToast(`✅ 已导出全部 ${data.books.length} 本书`);
    }
    
    // 切换收藏
    function toggleFavorite(bookId) {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === bookId);
        if (book) {
            book.favorite = !book.favorite;
            saveLibraryData(data);
            window.showToast(book.favorite ? '❤️ 已添加收藏' : '💔 已取消收藏');
            
            // 重新渲染
            const container = document.getElementById('library-main-container');
            if (container) renderLibraryHome(container);
        }
    }
    
    // 渲染图书馆首页（书架）
    function renderLibraryHome(container) {
        const data = getLibraryData();
        
        container.innerHTML = `
            <div id="library-main-container" style="padding:16px;min-height:100%;background:#f8f9fa;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <button onclick="history.back()" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回</button>
                    <h2 style="margin:0;font-size:18px;color:#333;">📚 学习图书馆</h2>
                    <button onclick="window.downloadAllLibraryBooks()" style="padding:8px 14px;background:#4caf50;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">📥 全部下载</button>
                </div>
                
                <!-- 快捷入口：思维导图 -->
                <div onclick="openMindMapFromLibrary()" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:16px;border-radius:16px;margin-bottom:20px;cursor:pointer;box-shadow:0 4px 12px rgba(102,126,234,0.3);">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:32px;">🧠</span>
                        <div>
                            <div style="font-size:16px;font-weight:bold;">打开思维导图</div>
                            <div style="font-size:12px;opacity:0.8;">创建和编辑你的知识地图</div>
                        </div>
                        <span style="margin-left:auto;font-size:20px;">→</span>
                    </div>
                </div>
                
                <!-- 分类：学霸方法 -->
                <div style="margin-bottom:24px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">🏆 学霸方法专区</h3>
                        <span style="font-size:12px;color:#999;">${data.books.filter(b => b.category === '学霸方法').length}本</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                        ${data.books.filter(b => b.category === '学霸方法').map(book => `
                            <div onclick="window.openBook('${book.id}')" style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                                <div style="${getBookCover(book)}padding:20px;text-align:center;">
                                    <span style="font-size:40px;">${book.emoji}</span>
                                </div>
                                <div style="padding:12px;">
                                    <div style="font-size:14px;font-weight:500;color:#333;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${book.title}</div>
                                    <div style="font-size:11px;color:#999;">${book.author}</div>
                                    <div style="margin-top:8px;display:flex;align-items:center;gap:4px;">
                                        <div style="flex:1;height:4px;background:#eee;border-radius:2px;overflow:hidden;">
                                            <div style="height:100%;background:linear-gradient(90deg,#667eea,#764ba2);width:${book.progress || 0}%;"></div>
                                        </div>
                                        <span style="font-size:10px;color:#999;">${Math.round(book.progress || 0)}%</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 全部书籍 -->
                <div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">📚 全部书籍</h3>
                        <span style="font-size:12px;color:#999;">${data.books.length}本</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        ${data.books.map(book => `
                            <div onclick="window.openBook('${book.id}')" style="background:white;border-radius:12px;padding:12px;display:flex;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                                <div style="${getBookCover(book)}width:56px;height:72px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span style="font-size:28px;">${book.emoji}</span>
                                </div>
                                <div style="flex:1;min-width:0;">
                                    <div style="display:flex;align-items:flex-start;justify-content:space-between;">
                                        <div style="font-size:15px;font-weight:500;color:#333;margin-bottom:4px;">${book.title}</div>
                                        <span onclick="event.stopPropagation();window.toggleBookFavorite('${book.id}')" style="font-size:16px;cursor:pointer;">${book.favorite ? '❤️' : '🤍'}</span>
                                    </div>
                                    <div style="font-size:12px;color:#999;margin-bottom:8px;">${book.author}${book.category ? ` · ${book.category}` : ''}</div>
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <div style="flex:1;height:4px;background:#eee;border-radius:2px;overflow:hidden;">
                                            <div style="height:100%;background:linear-gradient(90deg,#667eea,#764ba2);width:${book.progress || 0}%;"></div>
                                        </div>
                                        <span style="font-size:10px;color:#999;">${Math.round(book.progress || 0)}%</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 渲染图书馆
    function renderLibrary(container) {
        renderLibraryHome(container);
    }
    
    // 打开书籍阅读
    function openBook(bookId) {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === bookId);
        if (!book) return;
        
        const chapterIndex = data.currentBookId === bookId ? data.currentChapterIndex : 0;
        renderBookReader(book, chapterIndex);
    }
    
    // 渲染书籍阅读页面
    function renderBookReader(book, chapterIndex) {
        const chapter = book.chapters[chapterIndex];
        
        // 更新阅读进度
        const data = getLibraryData();
        data.currentBookId = book.id;
        data.currentChapterIndex = chapterIndex;
        book.progress = Math.round((chapterIndex + 1) / book.chapters.length * 100);
        saveLibraryData(data);
        
        const content = document.getElementById('fullscreen-content') || document.createElement('div');
        if (!document.getElementById('fullscreen-content')) {
            content.id = 'fullscreen-content';
            document.body.appendChild(content);
        }
        
        content.innerHTML = `
            <div style="padding:16px;min-height:100vh;background:white;">
                <!-- 顶部栏 -->
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:sticky;top:0;background:white;z-index:10;padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <button onclick="window.backToLibrary()" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回书架</button>
                    <div style="display:flex;gap:8px;">
                        <button id="tts-play-btn" onclick="window.toggleTTS('${chapter.content.replace(/'/g, "\\'").replace(/\n/g, ' ')}', '${chapter.title}')" style="padding:8px 14px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">🔊 听书</button>
                        <button onclick="window.downloadCurrentBook()" style="padding:8px 14px;background:#4caf50;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">📥 下载</button>
                    </div>
                </div>
                
                <!-- 书籍信息 -->
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="${getBookCover(book)}width:80px;height:100px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                        <span style="font-size:40px;">${book.emoji}</span>
                    </div>
                    <h1 style="font-size:20px;margin:0 0 4px 0;color:#333;">${book.title}</h1>
                    <div style="font-size:13px;color:#999;">${book.author}</div>
                </div>
                
                <!-- 章节标题 -->
                <div style="background:#f8f9fa;padding:16px;border-radius:12px;margin-bottom:20px;">
                    <div style="font-size:12px;color:#667eea;margin-bottom:4px;">第 ${chapterIndex + 1} / ${book.chapters.length} 章</div>
                    <h2 style="font-size:18px;margin:0;color:#333;">${chapter.title}</h2>
                </div>
                
                <!-- 阅读进度条 -->
                <div style="margin-bottom:20px;">
                    <div style="height:6px;background:#eee;border-radius:3px;overflow:hidden;">
                        <div style="height:100%;background:linear-gradient(90deg,#667eea,#764ba2);width:${(chapterIndex + 1) / book.chapters.length * 100}%;transition:width 0.3s;"></div>
                    </div>
                </div>
                
                <!-- 正文内容 -->
                <div style="font-size:16px;line-height:1.8;color:#333;letter-spacing:0.5px;">
                    ${chapter.content.split('\n').map(p => p ? `<p style="margin:0 0 16px 0;text-indent:2em;">${p}</p>` : '').join('')}
                </div>
                
                <!-- 章节导航 -->
                <div style="display:flex;gap:12px;margin-top:40px;padding-top:20px;border-top:1px solid #f0f0f0;">
                    ${chapterIndex > 0 ? `
                        <button onclick="window.prevChapter()" style="flex:1;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 上一章</button>
                    ` : '<div style="flex:1;"></div>'}
                    ${chapterIndex < book.chapters.length - 1 ? `
                        <button onclick="window.nextChapter()" style="flex:1;padding:14px;background:#667eea;color:white;border:none;border-radius:12px;font-size:14px;cursor:pointer;">下一章 →</button>
                    ` : ''}
                </div>
                
                <!-- 底部间距 -->
                <div style="height:40px;"></div>
            </div>
        `;
        
        // 滚动到顶部
        content.scrollTop = 0;
    }
    
    // 上一章
    function prevChapter() {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === data.currentBookId);
        if (book && data.currentChapterIndex > 0) {
            stopSpeaking();
            renderBookReader(book, data.currentChapterIndex - 1);
        }
    }
    
    // 下一章
    function nextChapter() {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === data.currentBookId);
        if (book && data.currentChapterIndex < book.chapters.length - 1) {
            stopSpeaking();
            renderBookReader(book, data.currentChapterIndex + 1);
        }
    }
    
    // 返回家目录
    function backToLibrary() {
        stopSpeaking();
        const content = document.getElementById('fullscreen-content');
        if (content) {
            renderLibraryHome(content);
        } else {
            history.back();
        }
    }
    
    // 从图书馆打开思维导图
    function openMindMapFromLibrary() {
        if (typeof window.renderMindMap === 'function') {
            const content = document.getElementById('fullscreen-content');
            if (content) window.renderMindMap(content);
        } else {
            window.showToast('思维导图模块加载中...');
        }
    }
    
    // 切换TTS听书
    function toggleTTS(text, title) {
        if (isPlaying) {
            stopSpeaking();
        } else {
            speakText(text, title);
        }
    }
    
    // 下载当前书籍
    function downloadCurrentBook() {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === data.currentBookId);
        if (book) {
            downloadBook(book);
        }
    }
    
    // 导出所有书籍
    function downloadAllLibraryBooks() {
        downloadAllBooks();
    }
    
    // 切换收藏
    function toggleBookFavorite(bookId) {
        toggleFavorite(bookId);
    }
    
    // 导出到window
    window.renderLibrary = renderLibrary;
    window.openBook = openBook;
    window.prevChapter = prevChapter;
    window.nextChapter = nextChapter;
    window.backToLibrary = backToLibrary;
    window.openMindMapFromLibrary = openMindMapFromLibrary;
    window.toggleTTS = toggleTTS;
    window.downloadCurrentBook = downloadCurrentBook;
    window.downloadAllLibraryBooks = downloadAllLibraryBooks;
    window.toggleBookFavorite = toggleBookFavorite;
    window.stopSpeaking = stopSpeaking;
    
    console.log('[V287] 学习图书馆模块加载完成 - 7种学霸方法+下载+听书');
})();

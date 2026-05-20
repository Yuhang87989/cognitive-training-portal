// ============================================================
// 🌳 学习图书馆模块
// 版本: V2.0 - ES6 Module
// 功能: 书架管理、电子书阅读、TTS听书、思维导图生成
// ============================================================

console.log('[学习图书馆] 模块加载中...');

// 图书馆数据
const libraryData = {
    books: [
        {
            id: 'book-1',
            title: '海马记忆法',
            author: '池谷裕二',
            cover: '🧠',
            chapters: [
                { id: 'ch-1', title: '第一章：记忆的秘密', content: '记忆分为短期记忆和长期记忆。海马体是大脑中负责记忆转换的关键区域...' },
                { id: 'ch-2', title: '第二章：间隔重复法', content: '根据艾宾浩斯遗忘曲线，最佳复习时间是：1天后、3天后、7天后、15天后...' },
                { id: 'ch-3', title: '第三章：联想记忆法', content: '将新信息与已知事物建立联系，可以大幅提升记忆效果。例如使用位置记忆法...' }
            ],
            progress: 0
        },
        {
            id: 'book-2',
            title: '费曼学习法',
            author: '理查德·费曼',
            cover: '📚',
            chapters: [
                { id: 'ch-1', title: '第一章：选择概念', content: '选择一个你想要学习的概念，写在一张纸的顶部。确保你理解这个概念的基本定义...' },
                { id: 'ch-2', title: '第二章：模拟教学', content: '想象你正在向一个8岁的孩子解释这个概念。用最简单、最通俗的语言来描述...' },
                { id: 'ch-3', title: '第三章：发现盲点', content: '在解释过程中卡住的地方，就是你理解不足的地方。回到原始材料重新学习...' },
                { id: 'ch-4', title: '第四章：简化与类比', content: '将你的解释进一步简化，使用生活中的例子进行类比，让理解更加深刻...' }
            ],
            progress: 0
        },
        {
            id: 'book-3',
            title: '高效能学习的7个习惯',
            author: '史蒂芬·柯维',
            cover: '⭐',
            chapters: [
                { id: 'ch-1', title: '第一章：积极主动', content: '对自己的学习负责，不抱怨环境，主动寻找解决方案...' },
                { id: 'ch-2', title: '第二章：以终为始', content: '明确学习目标，知道自己为什么而学，制定详细的学习计划...' },
                { id: 'ch-3', title: '第三章：要事第一', content: '把最重要的学习任务放在优先级最高的位置，避免被琐事干扰...' }
            ],
            progress: 0
        },
        {
            id: 'book-4',
            title: '7步背书法',
            author: '朱福芳',
            cover: '📖',
            chapters: [
                { id: 'ch-1', title: '第一步：高声朗读法', content: '大声朗读是记忆的第一步。通过声音刺激听觉神经，可以将记忆效果提升3倍以上。朗读时要注意：语速适中、吐字清晰、情感投入。建议每段内容朗读3遍，边读边理解含义...' },
                { id: 'ch-2', title: '第二步：快速背诵法', content: '快速背诵训练大脑的瞬时记忆能力。方法：先读一遍内容，然后立即合上书尝试背诵，忘记的地方标记出来，再读再背，直到能够完整背诵。这个过程可以在短时间内建立神经连接...' },
                { id: 'ch-3', title: '第三步：专注背诵法', content: '专注是高效记忆的核心。创造无干扰的学习环境，使用番茄工作法，每25分钟专注背诵，然后休息5分钟。专注背诵时，可以闭上眼睛，在脑海中构建画面，让记忆更加深刻...' },
                { id: 'ch-4', title: '第四步：利用镜子背书', content: '对着镜子背书，观察自己的表情和口型，可以增强自我反馈和记忆深度。方法：站在镜子前，看着自己的眼睛，大声背诵内容，想象自己正在给别人讲解，这样的场景可以大幅提升记忆效果...' },
                { id: 'ch-5', title: '第五步：默写来补漏', content: '默写是检验记忆效果的最好方法。背诵完成后，立即进行默写，将忘记的内容和错误的地方重点标记，然后针对性地重新背诵。默写可以发现很多口头背诵时察觉不到的记忆漏洞...' },
                { id: 'ch-6', title: '第六步：抓住黄金点', content: '记忆有两个黄金时间段：睡前1小时和醒来后1小时。睡前复习的内容会在睡眠中被大脑整理，醒来后大脑是空的，此时记忆不会受到前摄抑制的干扰。抓住这两个黄金点，记忆效果可以提升5倍以上...' },
                { id: 'ch-7', title: '第七步：关键词备注', content: '将长篇内容提炼出关键词，建立关键词之间的逻辑联系。方法：先通读全文，划出核心关键词，然后用思维导图将关键词串联起来，形成知识网络。回忆时从关键词展开，就能还原出完整内容...' }
            ],
            progress: 0
        },
        {
            id: 'book-5',
            title: '高效记忆',
            author: '小枝',
            cover: '🧠',
            chapters: [
                { id: 'ch-1', title: '第一章：了解你的大脑', content: '大脑有1000亿个神经元，每个神经元可以与其他神经元建立10000个连接。记忆的本质就是神经元之间建立新的连接。通过科学训练，可以让神经元连接更加紧密，记忆更加牢固...' },
                { id: 'ch-2', title: '第二章：记忆的黄金时间', content: '一天中有两个记忆黄金期：早上6-8点，大脑经过睡眠整理，此时记忆不受前摄抑制干扰；晚上8-10点，睡前复习的内容会在睡眠中被大脑自动整理巩固。抓住这两个时间段，学习效率可以提升3倍以上...' }
            ],
            progress: 0
        },
        {
            id: 'book-6',
            title: '记事作文大全',
            author: '刘威',
            cover: '✍️',
            chapters: [
                { id: 'ch-1', title: '第一章：写好开头的8种方法', content: '好的开头是成功的一半：1.开门见山法——直接点明主题；2.悬念设置法——提出问题引起好奇；3.环境描写法——用场景渲染气氛；4.引用开头法——引用名言诗句；5.对比开头法——用对比突出主题；6.倒叙开头法——先写结果再写经过...' }
            ],
            progress: 0
        },
        {
            id: 'book-7',
            title: '500字作文',
            author: '黄冈作文编写组',
            cover: '📝',
            chapters: [
                { id: 'ch-1', title: '第一章：如何凑够500字', content: '写作文最怕写不够字数！教你"扩写三招"：1.加修饰——名词前加形容词，动词前加副词；2.加细节——把一个动作分解成多个小动作；3.加心理——写出人物当时的心理活动。比如"我吃饭"可以扩写成"我端着香喷喷的白米饭，迫不及待地扒了一大口，米香瞬间充满口腔，心里美滋滋的"...' }
            ],
            progress: 0
        },
        {
            id: 'book-8',
            title: '五年级作文',
            author: '黄冈作文编写组',
            cover: '📚',
            chapters: [
                { id: 'ch-1', title: '第一章：五年级作文要求', content: '五年级作文要求400-500字，要做到：内容具体，感情真实，语句通顺，有中心，有条理，能使用常用的标点符号。要学会写简单的记实作文和想象作文，学写读书笔记和常见应用文...' }
            ],
            progress: 0
        },
        {
            id: 'book-9',
            title: '逆转思维',
            author: '德群',
            cover: '🧭',
            chapters: [
                { id: 'ch-1', title: '第一章：什么是逆转思维', content: '逆转思维就是反过来想问题。人们习惯于沿着事物发展的正方向去思考问题并寻求解决办法。其实，对于某些问题，尤其是一些特殊问题，从结论往回推，倒过来思考，从求解回到已知条件，反过去想或许会使问题简单化...' }
            ],
            progress: 0
        },
        {
            id: 'book-10',
            title: '少年学AI',
            author: '武育泰',
            cover: '🤖',
            chapters: [
                { id: 'ch-1', title: '第一章：什么是AI', content: 'AI就是人工智能，是让计算机像人一样思考、学习、解决问题的技术。AI可以听懂你说话，看懂你写的字，还能画画、写作文、解数学题。AI不是要取代人类，而是要成为人类的好帮手...' }
            ],
            progress: 0
        },
        {
            id: 'book-11',
            title: '清北学霸方法论',
            author: '李品友',
            cover: '🏫',
            chapters: [
                { id: 'ch-1', title: '第一章：学霸的学习习惯', content: '清北学霸不是天生的，而是后天养成的好习惯。他们有三个共同习惯：1.课前预习——带着问题听课；2.课堂专注——跟着老师思路走；3.课后复习——当天知识当天消化...' }
            ],
            progress: 0
        },
        {
            id: 'book-12',
            title: '世界上最神奇的24堂课',
            author: '查尔斯·哈奈尔',
            cover: '🔮',
            chapters: [
                { id: 'ch-1', title: '第一课：内在世界的力量', content: '每个人内心都有一个强大的世界，这个世界充满了力量、智慧和爱。当你学会连接内在世界，就能获得你想要的一切。内在世界是因，外在世界是果。改变内在，外在自然改变...' }
            ],
            progress: 0
        },
        {
            id: 'book-13',
            title: '成为小学霸：49天蝶变',
            author: '简易',
            cover: '🦋',
            chapters: [
                { id: 'ch-1', title: '第1-7天：建立基础习惯', content: '第一周先建立三个基础习惯：1.固定作息——每天同一时间睡觉起床；2.整理书桌——学习环境整洁才能专心；3.每天阅读30分钟——阅读是所有学习的基础...' }
            ],
            progress: 0
        },
        {
            id: 'book-14',
            title: '生命里最重要的事',
            author: '王健平',
            cover: '🌈',
            chapters: [
                { id: 'ch-1', title: '第一章：不可或缺的29堂人生课', content: '这是世界观、价值观、人生观的启蒙之旅。孩子想知道的——对友情的期许、对死亡的恐惧、对善恶的疑问、对人生的困惑，这里都有答案。让孩子在成长中找到人生的方向...' }
            ],
            progress: 0
        },
        {
            id: 'book-15',
            title: '漫画新科技：高新材料',
            author: '刘忠范',
            cover: '🔬',
            chapters: [
                { id: 'ch-1', title: '第一章：什么是高新材料', content: '让孩子先人一步，了解未来世界。听中科院院士讲前沿科技，用漫画形式讲述高新材料知识，激发孩子对科学的兴趣。新材料是科技革命的基础，是未来产业的核心...' }
            ],
            progress: 0
        },
        {
            id: 'book-16',
            title: '物理漫画启蒙书',
            author: '趣味百科编委会',
            cover: '⚛️',
            chapters: [
                { id: 'ch-1', title: '第一章：力的奥秘', content: '漫画形式讲述物理知识，激发孩子学习物理的兴趣。从牛顿摆到磁铁，从降落伞到原子结构，用生动有趣的漫画让孩子爱上物理，爱上科学探索...' }
            ],
            progress: 0
        },
        {
            id: 'book-17',
            title: '漫画新科技：智能芯片',
            author: '刘忠范',
            cover: '💻',
            chapters: [
                { id: 'ch-1', title: '第一章：芯片是怎么工作的', content: '芯片是现代科技的心脏，手机、电脑、汽车都离不开它。这本书用漫画形式讲解智能芯片的原理、制作和应用，让孩子理解科技背后的奥秘...' }
            ],
            progress: 0
        },
        {
            id: 'book-18',
            title: '漫画新科技：机器人',
            author: '刘忠范',
            cover: '🤖',
            chapters: [
                { id: 'ch-1', title: '第一章：机器人的世界', content: '机器人正在改变我们的生活！从工业机器人到服务机器人，从医疗机器人到教育机器人，这本书用漫画形式带你走进机器人的奇妙世界，了解机器人是如何工作的...' }
            ],
            progress: 0
        },
        {
            id: 'book-19',
            title: '化学漫画启蒙书',
            author: '趣味百科编委会',
            cover: '🧪',
            chapters: [
                { id: 'ch-1', title: '第一章：神奇的化学元素', content: '漫画形式讲述化学知识，激发孩子探索身边的化学知识。从烧瓶到显微镜，从原子结构到DNA双螺旋，用生动有趣的漫画让孩子爱上化学，爱上科学实验...' }
            ],
            progress: 0
        },
        {
            id: 'book-20',
            title: '有钱人想的和你不一样',
            author: '李萌',
            cover: '💰',
            chapters: [
                { id: 'ch-1', title: '第一章：财富思维', content: '像有钱人那样去思考，像有钱人那样去行动。把握富裕节拍，掌握致富奥秘，走财务自由之路。致富没有捷径，却有通行的法则。改变思维，才能改变命运...' }
            ],
            progress: 0
        },
        {
            id: 'book-21',
            title: 'DeepSeek极简入门与应用',
            author: '孟健 姚路行',
            cover: '🔍',
            chapters: [
                { id: 'ch-1', title: '第一章：快速上手DeepSeek', content: '4种特色功能玩法，多场景下的高效解决方案；8种实战应用场景，大幅提升工作和学习效率；4种高级应用技巧，精准发挥DeepSeek潜力。附赠高质量实用提示词模板，覆盖10大场景共274个...' }
            ],
            progress: 0
        },
        {
            id: 'book-22',
            title: '超级记忆',
            author: '大脑开发编委会',
            cover: '🧠',
            chapters: [
                { id: 'ch-1', title: '第一章：记忆的本质', content: '记忆不是天生的，而是可以训练的技能。通过科学的记忆方法，每个人都可以拥有过目不忘的能力。从艾宾浩斯遗忘曲线到宫殿记忆法，系统掌握超级记忆的核心秘诀...' }
            ],
            progress: 0
        },
        {
            id: 'book-23',
            title: '北大清华状元100个听课习惯',
            author: '陈年年',
            cover: '🎧',
            chapters: [
                { id: 'ch-1', title: '第一章：听讲为王', content: '会听课才会有好成绩！教你全面提高学习效率的快乐听课细节：提前预习把知识提前学到手，注重总结强化听课效果，做好笔记提升听课效率，分科听课巧妙抓住学科特点...' }
            ],
            progress: 0
        },
        {
            id: 'book-24',
            title: '今天的懒 明天的难',
            author: '读者出版社',
            cover: '💪',
            chapters: [
                { id: 'ch-1', title: '第一章：告别颓废 直面挫折', content: '你可以假装努力，但结果不会陪你演戏。今天的懒惰，都会变成明天的困难。告别拖延，直面挑战，让每一份努力都变成成长的阶梯。从今天开始，做一个行动派...' }
            ],
            progress: 0
        },
        {
            id: 'book-25',
            title: '心理疗愈师',
            author: '仇爱玲',
            cover: '💝',
            chapters: [
                { id: 'ch-1', title: '第一章：看见自己 爱上自己', content: '让每一寸伤口都能找到愈合的力量。看见自己、爱上自己、拥抱自己。学会与自己和解，接纳不完美的自己，让内心充满阳光和力量。真正的疗愈从自我接纳开始...' }
            ],
            progress: 0
        },
        {
            id: 'book-26',
            title: '打败拖延症',
            author: '郄亚威',
            cover: '⏰',
            chapters: [
                { id: 'ch-1', title: '第一章：变被动为主动', content: '每个孩子都能拥有超强执行力！拖延不是懒，而是心理问题。从根源上理解拖延，用科学的方法告别拖延，变被动为主动，让行动成为习惯，让优秀成为常态...' }
            ],
            progress: 0
        },
        {
            id: 'book-27',
            title: '漫画新科技：生物识别',
            author: '刘忠范',
            cover: '👁️',
            chapters: [
                { id: 'ch-1', title: '第一章：什么是生物识别', content: '让孩子先人一步，了解未来世界。听中科院院士讲前沿科技，用漫画形式讲解人脸识别、指纹识别、虹膜识别等生物识别技术，了解科技如何改变我们的生活...' }
            ],
            progress: 0
        },
        {
            id: 'book-28',
            title: '心理学与口才技巧',
            author: '鸿雁',
            cover: '💬',
            chapters: [
                { id: 'ch-1', title: '第一章：好口才离不开心理学', content: '不懂心理，一万句无用；懂心理，一句足矣。会说话的人懂得把每一句话都说到别人的心坎里。由嘴及心的口才心理策略，让你掌握高情商沟通的秘密...' }
            ],
            progress: 0
        },
        {
            id: 'book-29',
            title: '思维导图学习法',
            author: '思维导图编委会',
            cover: '🗺️',
            chapters: [
                { id: 'ch-1', title: '第一章：画出你的思维', content: '思维导图是革命性的思维工具，用图文并重的技巧，把各级主题的关系用相互隶属与相关的层级图表现出来。从中心主题向外发散，让思维可视化，学习效率提升10倍...' }
            ],
            progress: 0
        },
        {
            id: 'book-30',
            title: '费曼学习法',
            author: '理查德·费曼',
            cover: '🎓',
            chapters: [
                { id: 'ch-1', title: '第一章：教就是最好的学', content: '费曼学习法的核心是：选择一个概念，想象你正在把它教给一个8岁的孩子。当你卡住时，回到原始材料重新学习，然后简化语言，使用类比。这是深度学习的终极方法...' }
            ],
            progress: 0
        },
        {
            id: 'book-31',
            title: '极简学习法',
            author: '高效学习研究组',
            cover: '⚡',
            chapters: [
                { id: 'ch-1', title: '第一章：少即是多', content: '极简学习法的三大支柱：精准输入（学最本质的东西）、深度消化（用多种方法学透）、多元输出（四层输出把知识用起来）。大道至简，越简单越有效...' }
            ],
            progress: 0
        },
        {
            id: 'book-32',
            title: '主动学习法',
            author: '学习科学研究会',
            cover: '🎯',
            chapters: [
                { id: 'ch-1', title: '第一章：从被动到主动', content: '主动学习不是被迫学习，而是发自内心地想要成长。建立学习的内在驱动力，找到为什么而学的答案。从"要我学"到"我要学"，一字之差，天壤之别...' }
            ],
            progress: 0
        },
        {
            id: 'book-33',
            title: '数学哪里难了',
            author: '数学名师工作室',
            cover: '🔢',
            chapters: [
                { id: 'ch-1', title: '第一章：重新认识数学', content: '数学哪里难了？不要被表面的符号吓倒。数学是思维的体操，是逻辑的艺术。掌握正确的学习方法，每个人都可以成为数学高手。从理解基本概念开始，循序渐进...' }
            ],
            progress: 0
        },
        {
            id: 'book-34',
            title: '初中数学知识清单',
            author: '教学考试研究院',
            cover: '📐',
            chapters: [
                { id: 'ch-1', title: '第一章：代数基础', content: '从有理数到整式，从方程到函数，系统梳理初中数学所有知识点。概念清晰，公式明确，例题典型，让你轻松掌握初中数学全貌，为高中学习打下坚实基础...' }
            ],
            progress: 0
        },
        {
            id: 'book-35',
            title: '初中物理知识清单',
            author: '教学考试研究院',
            cover: '⚛️',
            chapters: [
                { id: 'ch-1', title: '第一章：力学入门', content: '从运动到力，从压强到浮力，从功到机械能，系统梳理初中物理所有知识点。图文并茂，概念清晰，实验详解，让你爱上物理，学好物理...' }
            ],
            progress: 0
        },
        {
            id: 'book-36',
            title: '初中化学知识清单',
            author: '教学考试研究院',
            cover: '🧪',
            chapters: [
                { id: 'ch-1', title: '第一章：走进化学世界', content: '从物质的变化和性质开始，走进奇妙的化学世界。掌握化学实验基本操作，认识常见的化学仪器，学习空气、氧气、水、碳等常见物质的性质和用途...' }
            ],
            progress: 0
        },
        {
            id: 'book-37',
            title: '小学生必背古诗词75+80首',
            author: '语文教育研究中心',
            cover: '📜',
            chapters: [
                { id: 'ch-1', title: '第一章：唐诗精选', content: '从骆宾王的《咏鹅》到李白的《静夜思》，从杜甫的《春夜喜雨》到白居易的《赋得古原草送别》，精选历代优秀古诗词，配以注释和赏析，让孩子爱上古诗文...' }
            ],
            progress: 0
        },
        {
            id: 'book-38',
            title: '初中生必背古诗文138篇',
            author: '教育部课程教材研究所',
            cover: '📚',
            chapters: [
                { id: 'ch-1', title: '第一章：古文观止', content: '涵盖初中语文教材所有古诗文篇目，包括古文、唐诗、宋词、元曲等。每篇配有详细注释、译文、赏析，帮助学生理解记忆，提高语文素养和应试能力...' }
            ],
            progress: 0
        },
        {
            id: 'book-39',
            title: '小学生百科',
            author: '中国大百科全书出版社',
            cover: '🌍',
            chapters: [
                { id: 'ch-1', title: '第一章：宇宙与地球', content: '从浩瀚宇宙到我们生活的地球，探索宇宙的奥秘，了解地球的形成和演化。为什么会有白天黑夜？为什么会有四季变化？火山为什么会喷发？答案都在这里...' }
            ],
            progress: 0
        },
        {
            id: 'book-40',
            title: '恐龙百科',
            author: '恐龙研究中心',
            cover: '🦕',
            chapters: [
                { id: 'ch-1', title: '第一章：恐龙时代', content: '回到2亿年前的侏罗纪，认识地球上曾经的霸主。从凶猛的霸王龙到温顺的梁龙，从天上飞的翼龙到水里游的蛇颈龙，探索恐龙世界的奥秘，了解它们为什么会灭绝...' }
            ],
            progress: 0
        },
        {
            id: 'book-41',
            title: '地球百科',
            author: '地理学会',
            cover: '🌎',
            chapters: [
                { id: 'ch-1', title: '第一章：我们的地球', content: '地球是我们唯一的家园。了解地球的结构、气候、生态系统，认识七大洲四大洋，探索自然奇观，学习环境保护知识，从小培养爱护地球的意识...' }
            ],
            progress: 0
        },
        {
            id: 'book-42',
            title: '宇宙百科',
            author: '天文馆科普部',
            cover: '🌌',
            chapters: [
                { id: 'ch-1', title: '第一章：浩瀚星空', content: '仰望星空，宇宙比你想象的更浩瀚。认识太阳系的八大行星，了解银河系的结构，探索遥远的河外星系，寻找外星生命的踪迹。天文学让人类的视野无限延伸...' }
            ],
            progress: 0
        },
        {
            id: 'book-43',
            title: '趣味数学',
            author: '数学趣味研究会',
            cover: '🔢',
            chapters: [
                { id: 'ch-1', title: '第一章：数学的乐趣', content: '数学不是枯燥的计算，而是充满乐趣的思维游戏。从数独到幻方，从七桥问题到四色定理，趣味数学让你发现数学的魅力，爱上思考，爱上数学...' }
            ],
            progress: 0
        },
        {
            id: 'book-44',
            title: '作文好词好句好段大全',
            author: '作文教学研究中心',
            cover: '✍️',
            chapters: [
                { id: 'ch-1', title: '第一章：写人篇', content: '积累丰富的词汇和句式，让你的作文文采飞扬。从外貌描写到心理描写，从动作描写到语言描写，海量好词好句好段，让写作文不再发愁...' }
            ],
            progress: 0
        },
        {
            id: 'book-45',
            title: '小学作文写作技巧',
            author: '小学语文名师工作室',
            cover: '📝',
            chapters: [
                { id: 'ch-1', title: '第一章：写好开头结尾', content: '好的开头是成功的一半，好的结尾让人回味无穷。掌握各种开头结尾技巧，让你的作文脱颖而出。从开门见山到设置悬念，从总结全文到余音绕梁...' }
            ],
            progress: 0
        },
        {
            id: 'book-46',
            title: '初中生优秀作文选',
            author: '全国优秀作文选编委会',
            cover: '📖',
            chapters: [
                { id: 'ch-1', title: '第一章：记叙文精选', content: '精选全国各地初中生优秀作文，涵盖记叙文、说明文、议论文、散文等各种文体。每篇配有名师点评，分析文章亮点，帮助你快速提高写作水平...' }
            ],
            progress: 0
        },
        {
            id: 'book-47',
            title: '万物有数学',
            author: '数学科普团队',
            cover: '🧮',
            chapters: [
                { id: 'ch-1', title: '第一章：数学就在身边', content: '数学不是抽象的符号，而是无处不在的。从蜜蜂的蜂巢到向日葵的种子排列，从建筑设计到音乐节奏，万物皆有数学。发现数学之美，爱上数学思维...' }
            ],
            progress: 0
        },
        {
            id: 'book-48',
            title: '孩子读得懂的量子力学',
            author: '量子科普工作室',
            cover: '⚛️',
            chapters: [
                { id: 'ch-1', title: '第一章：走进微观世界', content: '量子力学听起来很高深，但其实很有趣。从薛定谔的猫到量子纠缠，从量子隧穿到量子计算，用孩子能听懂的语言，讲述最前沿的科学知识...' }
            ],
            progress: 0
        },
        {
            id: 'book-49',
            title: '孩子读得懂的人工智能',
            author: 'AI科普团队',
            cover: '🤖',
            chapters: [
                { id: 'ch-1', title: '第一章：什么是人工智能', content: '从阿尔法狗到ChatGPT，从机器学习到深度学习，用通俗的语言讲述AI的原理和未来。让孩子了解人工智能是如何工作的，以及它将如何改变我们的世界...' }
            ],
            progress: 0
        },
        {
            id: 'book-50',
            title: '孩子读得懂的区块链',
            author: '科技科普工作室',
            cover: '🔗',
            chapters: [
                { id: 'ch-1', title: '第一章：区块链是什么', content: '从比特币到元宇宙，从去中心化到智能合约，用孩子能理解的方式讲解区块链技术。了解未来的互联网是什么样子，数字货币如何改变世界...' }
            ],
            progress: 0
        },
        {
            id: 'book-51',
            title: '孩子读得懂的元宇宙',
            author: '未来科技研究中心',
            cover: '🌐',
            chapters: [
                { id: 'ch-1', title: '第一章：走进元宇宙', content: '元宇宙不是虚拟世界，而是人类的数字未来。从VR/AR到数字孪生，从虚拟经济到数字身份，探索下一代互联网是什么样子，我们该如何迎接数字时代...' }
            ],
            progress: 0
        },
        {
            id: 'book-52',
            title: '孩子读得懂的5G',
            author: '通信科普团队',
            cover: '📶',
            chapters: [
                { id: 'ch-1', title: '第一章：5G改变世界', content: '从1G到5G，移动通信如何改变人类生活。5G不仅仅是网速更快，它将连接万物，让物联网、自动驾驶、远程医疗成为现实。了解通信技术的过去、现在和未来...' }
            ],
            progress: 0
        },
        {
            id: 'book-53',
            title: '孩子读得懂的大数据',
            author: '数据科学研究中心',
            cover: '📊',
            chapters: [
                { id: 'ch-1', title: '第一章：数据的力量', content: '大数据如何改变我们的生活？从推荐算法到人脸识别，从数据挖掘到人工智能，了解数据是如何收集、分析和使用的。培养数据思维，迎接数字经济时代的核心素养...' }
            ],
            progress: 0
        },
        {
            id: 'book-54',
            title: '给孩子讲中国航天科学启蒙',
            author: '中国航天科普中心',
            cover: '🚀',
            chapters: [
                { id: 'ch-1', title: '第一章：飞向太空', content: '从嫦娥探月到火星探测，从神舟飞船到空间站，了解中国航天的发展历程。了解火箭是如何工作的，宇航员在太空是怎样生活的。种下科学启蒙，激发科学强国...' }
            ],
            progress: 0
        },
        {
            id: 'book-55',
            title: '给孩子讲中国高铁',
            author: '中国铁道科学研究院',
            cover: '🚄',
            chapters: [
                { id: 'ch-1', title: '第一章：中国速度', content: '从绿皮火车到，从和谐号到复兴号，中国高铁如何从零到世界第一的发展历程。高铁为什么跑得那么快却如此平稳？了解轨道、列车、信号系统是如何协同工作的...' }
            ],
            progress: 0
        },
        {
            id: 'book-56',
            title: '给孩子讲中国航母',
            author: '军事科普中心',
            cover: '🛳️',
            chapters: [
                { id: 'ch-1', title: '第一章：大国重器', content: '从辽宁舰到山东舰到福建舰，中国航母如何保卫海疆。了解航母的结构、舰载机如何起飞降落、航母战斗群是如何作战的。激发爱国情怀，种下科技强军...' }
            ],
            progress: 0
        },
        {
            id: 'book-57',
            title: '给孩子讲中国桥梁',
            author: '桥梁工程科普中心',
            cover: '🌉',
            chapters: [
                { id: 'ch-1', title: '第一章：中国桥梁', content: '从港珠澳大桥到北盘江大桥，中国创造了多少世界第一？桥梁是如何设计和建造的？了解桥梁工程背后的科学原理，感受中国工程的伟大成就...' }
            ],
            progress: 0
        },
        {
            id: 'book-58',
            title: '给孩子讲中国天眼',
            author: '天文科普中心',
            cover: '🔭',
            chapters: [
                { id: 'ch-1', title: '第一章：聆听宇宙', content: '中国天眼FAST是世界最大的射电望远镜，它是如何寻找外星文明？天文学家是如何工作的？了解天文观测的科学原理，激发探索宇宙的好奇心...' }
            ],
            progress: 0
        },
        {
            id: 'book-59',
            title: '给孩子讲人工智能',
            author: 'AI教育研究中心',
            cover: '🧠',
            chapters: [
                { id: 'ch-1', title: '第一章：机器能思考吗', content: '从图灵测试到深度学习，人工智能是如何一步步学会"思考"的？了解机器学习、神经网络、自然语言处理等AI核心技术。AI能做什么，不能做什么...' }
            ],
            progress: 0
        },
        {
            id: 'book-60',
            title: '这就是计算机科学',
            author: '计算机科学教育协会',
            cover: '💻',
            chapters: [
                { id: 'ch-1', title: '第一章：计算机的奥秘', content: '从算盘到智能手机，计算机是如何演变的？CPU、内存、硬盘、操作系统都是如何工作的？了解算法、编程、网络、安全等计算机科学基础知识，为未来编程学习打下基础...' }
            ],
            progress: 0
        }
    ],
    currentBook: null,
    currentChapter: null,
    readingMode: 'read' // 'read' | 'listen' | 'mindmap'
};

// TTS 语音合成状态
let ttsState = {
    isPlaying: false,
    isPaused: false,
    currentUtterance: null,
    rate: 1.0,
    pitch: 1.0,
    voiceIndex: 0
};

// 思维导图状态
let mindmapState = {
    nodes: [],
    selectedNode: null
};

// ============================================================
// 主渲染函数
// ============================================================
function renderMindMap(container) {
    container.innerHTML = `
        <div style="height:100%;display:flex;flex-direction:column;background:#f8f9fa;">
            <!-- 顶部导航 -->
            <div style="padding:12px 16px;background:white;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;gap:12px;flex-shrink:0;">
                <div style="font-weight:bold;font-size:16px;color:#333;display:flex;align-items:center;gap:8px;">
                    🌳 学习图书馆
                </div>
                <div style="flex:1;"></div>
                <button onclick="showLibraryBookshelf()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">📚 书架</button>
                <button onclick="showLibraryReader()" style="padding:8px 16px;background:#11998e;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">📖 阅读</button>
                <button onclick="showLibraryMindmap()" style="padding:8px 16px;background:#f093fb;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">🌐 导图</button>
            </div>
            
            <!-- 内容区域 -->
            <div id="library-content" style="flex:1;overflow:auto;">
                ${renderBookshelf()}
            </div>
        </div>
    `;
    
    console.log('[学习图书馆] 渲染完成');
}

// ============================================================
// 书架视图
// ============================================================
function renderBookshelf() {
    return `
        <div style="padding:20px;">
            <div style="font-size:18px;font-weight:bold;color:#333;margin-bottom:20px;">📚 我的书架</div>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:20px;">
                ${libraryData.books.map(book => `
                    <div onclick="openBook('${book.id}')" style="background:white;border-radius:12px;padding:20px;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);transition:all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="font-size:48px;text-align:center;margin-bottom:12px;">${book.cover}</div>
                        <div style="font-weight:bold;color:#333;text-align:center;margin-bottom:4px;">${book.title}</div>
                        <div style="font-size:12px;color:#999;text-align:center;margin-bottom:8px;">${book.author}</div>
                        <div style="background:#f0f0f0;border-radius:4px;height:6px;overflow:hidden;">
                            <div style="background:linear-gradient(90deg,#667eea,#764ba2);height:100%;width:${book.progress}%;"></div>
                        </div>
                        <div style="font-size:11px;color:#999;text-align:center;margin-top:4px;">阅读进度 ${book.progress}%</div>
                    </div>
                `).join('')}
                
                <!-- 添加新书按钮 -->
                <div onclick="addNewBook()" style="background:#f8f9fa;border:2px dashed #ddd;border-radius:12px;padding:20px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;">
                    <div style="font-size:48px;color:#ccc;margin-bottom:12px;">➕</div>
                    <div style="font-size:14px;color:#999;">添加新书</div>
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// 阅读视图
// ============================================================
function renderReader() {
    const book = libraryData.currentBook;
    if (!book) return renderBookshelf();
    
    return `
        <div style="display:flex;height:100%;">
            <!-- 章节导航 -->
            <div style="width:220px;background:white;border-right:1px solid #e8e8e8;padding:16px;overflow:auto;flex-shrink:0;">
                <div style="font-weight:bold;color:#333;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <span onclick="showLibraryBookshelf()" style="cursor:pointer;color:#667eea;">←</span>
                    ${book.title}
                </div>
                ${book.chapters.map((ch, idx) => `
                    <div onclick="openChapter('${ch.id}')" style="padding:10px 12px;border-radius:8px;cursor:pointer;margin-bottom:4px;${libraryData.currentChapter?.id === ch.id ? 'background:#667eea;color:white;' : 'color:#666;'}" onmouseover="if(!this.style.background.includes('#667eea'))this.style.background='#f5f5f5'" onmouseout="if(!this.style.background.includes('#667eea'))this.style.background=''">
                        <div style="font-size:13px;font-weight:500;">${ch.title}</div>
                        <div style="font-size:11px;opacity:0.7;margin-top:2px;">第 ${idx + 1} 章</div>
                    </div>
                `).join('')}
            </div>
            
            <!-- 阅读区域 -->
            <div style="flex:1;padding:30px 50px;overflow:auto;max-width:800px;margin:0 auto;">
                ${libraryData.currentChapter ? renderChapterContent() : renderBookIntro(book)}
            </div>
            
            <!-- 听书控制栏 -->
            <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:white;border-radius:50px;padding:12px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:flex;align-items:center;gap:16px;z-index:100;">
                <button onclick="toggleTTSPlay()" style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;cursor:pointer;font-size:18px;">
                    ${ttsState.isPlaying && !ttsState.isPaused ? '⏸' : '▶'}
                </button>
                <button onclick="stopTTS()" style="width:36px;height:36px;border-radius:50%;background:#f5f5f5;color:#666;border:none;cursor:pointer;font-size:14px;">⏹</button>
                <div style="display:flex;flex-direction:column;gap:4px;">
                    <div style="font-size:12px;color:#333;font-weight:500;">${ttsState.isPlaying ? '正在朗读...' : '点击播放'}</div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:11px;color:#999;">语速</span>
                        <input type="range" min="0.5" max="2" step="0.1" value="${ttsState.rate}" onchange="setTTSRate(this.value)" style="width:80px;">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================================
// 渲染书籍介绍
// ============================================================
function renderBookIntro(book) {
    return `
        <div style="text-align:center;margin-bottom:40px;">
            <div style="font-size:80px;margin-bottom:20px;">${book.cover}</div>
            <h1 style="font-size:28px;color:#333;margin-bottom:8px;">${book.title}</h1>
            <div style="font-size:14px;color:#999;margin-bottom:20px;">作者：${book.author}</div>
            <div style="background:#f5f5f5;border-radius:12px;padding:20px;text-align:left;color:#666;line-height:1.8;">
                <p>本书共 ${book.chapters.length} 章，点击左侧章节列表开始阅读。</p>
                <p>支持听书功能，点击底部播放按钮即可开始语音朗读。</p>
            </div>
            <button onclick="openChapter('${book.chapters[0].id}')" style="margin-top:20px;padding:12px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:25px;font-size:14px;cursor:pointer;">
                📖 开始阅读
            </button>
        </div>
    `;
}

// ============================================================
// 渲染章节内容
// ============================================================
function renderChapterContent() {
    const chapter = libraryData.currentChapter;
    return `
        <h2 style="font-size:24px;color:#333;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #eee;">${chapter.title}</h2>
        <div id="chapter-content" style="font-size:16px;line-height:2;color:#444;letter-spacing:0.5px;">
            ${chapter.content.split('。').map(p => p.trim() ? `<p style="margin-bottom:16px;text-indent:2em;">${p}。</p>` : '').join('')}
        </div>
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;display:flex;justify-content:space-between;">
            <button onclick="prevChapter()" style="padding:10px 20px;background:#f5f5f5;color:#666;border:none;border-radius:8px;cursor:pointer;">← 上一章</button>
            <button onclick="nextChapter()" style="padding:10px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;cursor:pointer;">下一章 →</button>
        </div>
    `;
}

// ============================================================
// 思维导图视图
// ============================================================
function renderMindmapView() {
    const scheme = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    
    return `
        <div style="height:100%;display:flex;flex-direction:column;">
            <!-- 工具栏 -->
            <div style="padding:12px 16px;background:white;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;gap:12px;">
                <button onclick="generateMindmapFromBook()" style="padding:8px 16px;background:#667eea;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">📚 从书籍生成</button>
                <button onclick="addMindmapNode()" style="padding:8px 16px;background:#11998e;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">➕ 添加节点</button>
                <button onclick="exportMindmapImage()" style="padding:8px 16px;background:#f093fb;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">📷 导出图片</button>
                <div style="flex:1;"></div>
                <span style="font-size:12px;color:#999;">点击节点可编辑 · 拖动可移动</span>
            </div>
            
            <!-- 思维导图画布 -->
            <div style="flex:1;overflow:auto;background:linear-gradient(135deg,#667eea10,#764ba210);position:relative;" id="mindmap-canvas">
                <svg width="100%" height="100%" style="min-width:1000px;min-height:800px;" id="mindmap-svg">
                    <!-- 连接线 -->
                    <g id="mindmap-lines"></g>
                    <!-- 节点 -->
                    <g id="mindmap-nodes">
                        <!-- 中心节点 -->
                        <g transform="translate(500, 400)" style="cursor:move;">
                            <rect x="-80" y="-30" width="160" height="60" rx="30" fill="url(#grad1)" filter="drop-shadow(0 4px 12px rgba(102,126,234,0.3))"/>
                            <text text-anchor="middle" dominant-baseline="middle" fill="white" font-weight="bold" font-size="16">学习图书馆</text>
                        </g>
                        <!-- 分支节点 -->
                        ${renderMindmapNodes()}
                    </g>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea"/>
                            <stop offset="100%" style="stop-color:#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    `;
}

// ============================================================
// 渲染思维导图节点
// ============================================================
function renderMindmapNodes() {
    const nodes = [
        { x: 700, y: 250, text: '记忆方法', color: '#f093fb' },
        { x: 700, y: 400, text: '学习技巧', color: '#4facfe' },
        { x: 700, y: 550, text: '时间管理', color: '#11998e' },
        { x: 850, y: 200, text: '间隔重复', color: '#f5576c' },
        { x: 850, y: 300, text: '联想记忆', color: '#f5576c' },
        { x: 850, y: 380, text: '费曼技巧', color: '#00f2fe' },
        { x: 850, y: 480, text: '番茄工作法', color: '#00f2fe' },
        { x: 850, y: 580, text: '要事第一', color: '#43e97b' }
    ];
    
    return nodes.map(node => `
        <g transform="translate(${node.x}, ${node.y})" style="cursor:pointer;">
            <rect x="-60" y="-20" width="120" height="40" rx="20" fill="${node.color}" opacity="0.9"/>
            <text text-anchor="middle" dominant-baseline="middle" fill="white" font-size="12">${node.text}</text>
        </g>
    `).join('');
}

// ============================================================
// 书籍操作函数
// ============================================================
window.openBook = function(bookId) {
    libraryData.currentBook = libraryData.books.find(b => b.id === bookId);
    libraryData.currentChapter = null;
    document.getElementById('library-content').innerHTML = renderReader();
};

window.openChapter = function(chapterId) {
    libraryData.currentChapter = libraryData.currentBook.chapters.find(c => c.id === chapterId);
    document.getElementById('library-content').innerHTML = renderReader();
    
    // 更新进度
    const idx = libraryData.currentBook.chapters.findIndex(c => c.id === chapterId);
    libraryData.currentBook.progress = Math.round(((idx + 1) / libraryData.currentBook.chapters.length) * 100);
};

window.prevChapter = function() {
    if (!libraryData.currentBook || !libraryData.currentChapter) return;
    const idx = libraryData.currentBook.chapters.findIndex(c => c.id === libraryData.currentChapter.id);
    if (idx > 0) {
        openChapter(libraryData.currentBook.chapters[idx - 1].id);
    }
};

window.nextChapter = function() {
    if (!libraryData.currentBook || !libraryData.currentChapter) return;
    const idx = libraryData.currentBook.chapters.findIndex(c => c.id === libraryData.currentChapter.id);
    if (idx < libraryData.currentBook.chapters.length - 1) {
        openChapter(libraryData.currentBook.chapters[idx + 1].id);
    }
};

window.addNewBook = function() {
    const title = prompt('请输入书籍名称：');
    if (title && title.trim()) {
        const newBook = {
            id: `book-${Date.now()}`,
            title: title.trim(),
            author: '未知作者',
            cover: '📕',
            chapters: [
                { id: 'ch-1', title: '第一章：简介', content: '这是新添加的书籍内容...' }
            ],
            progress: 0
        };
        libraryData.books.push(newBook);
        document.getElementById('library-content').innerHTML = renderBookshelf();
    }
};

// ============================================================
// 视图切换
// ============================================================
window.showLibraryBookshelf = function() {
    document.getElementById('library-content').innerHTML = renderBookshelf();
};

window.showLibraryReader = function() {
    document.getElementById('library-content').innerHTML = renderReader();
};

window.showLibraryMindmap = function() {
    document.getElementById('library-content').innerHTML = renderMindmapView();
};

// ============================================================
// TTS 听书功能
// ============================================================
window.toggleTTSPlay = function() {
    if (!window.speechSynthesis) {
        alert('您的浏览器不支持语音合成功能');
        return;
    }
    
    if (ttsState.isPlaying && !ttsState.isPaused) {
        window.speechSynthesis.pause();
        ttsState.isPaused = true;
    } else if (ttsState.isPaused) {
        window.speechSynthesis.resume();
        ttsState.isPaused = false;
    } else {
        startTTS();
    }
    
    document.getElementById('library-content').innerHTML = renderReader();
};

window.stopTTS = function() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        document.getElementById('library-content').innerHTML = renderReader();
    }
};

window.setTTSRate = function(rate) {
    ttsState.rate = parseFloat(rate);
    if (ttsState.isPlaying && !ttsState.isPaused) {
        // 重新开始播放时应用新语速
        // 实际项目中可以重新开始播放
    }
};

function startTTS() {
    if (!libraryData.currentChapter) return;
    
    const text = libraryData.currentChapter.content;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = ttsState.rate;
    utterance.pitch = ttsState.pitch;
    utterance.lang = 'zh-CN';
    
    utterance.onend = function() {
        console.log('朗读完成');
    };
    
    window.speechSynthesis.speak(utterance);
}

// ============================================================
// 思维导图功能
// ============================================================
window.generateMindmapFromBook = function() {
    const bookNames = libraryData.books.map(b => b.title).join('、');
    alert(`将根据以下书籍生成思维导图：\n${bookNames}\n\n（功能开发中...）`);
};

window.addMindmapNode = function() {
    const text = prompt('请输入节点名称：');
    if (text && text.trim()) {
        // 实际项目中添加节点逻辑
        alert(`节点「${text}」已添加！`);
    }
};

window.exportMindmapImage = function() {
    alert('思维导图导出功能开发中...');
};

// ============================================================
// 挂载到 window
// ============================================================
window.renderMindMap = renderMindMap;
window.libraryData = libraryData;

console.log('[学习图书馆] 模块加载完成');

// ============================================================
// V270: 传统方式加载，移除ES6 export
// ============================================================


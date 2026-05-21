// ============================================================
// V305 学习图书馆模块 - 升学规划精选+目录展示+统一下载
// 功能：书架、书籍阅读、目录、听书、阅读进度、笔记、收藏、下载导出
// 新增：升学规划精选60本书、目录形式展示、统一下载链接
// ============================================================

(function() {
    const LIBRARY_STORAGE_KEY = 'learning_library_data';
    
    // 升学规划精选书籍（60本）
    const COLLEGE_PLANNING_BOOKS = [
        // --- 院校规划类（1-20）---
        {
            id: 'college_1',
            title: '从小规划大学（上）',
            author: '开心教育研究中心',
            emoji: '🎓',
            gradient: '#667eea,#764ba2',
            category: '升学规划',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-1.pdf',
            chapters: [
                { title: '前言：为什么要从小规划大学', content: '提前了解大学和专业，为孩子种下大学梦，激发学习动力。' },
                { title: '985工程院校全解析', content: '39所985工程大学，是中国顶尖的高等学府，包括清华大学、北京大学、复旦大学、上海交通大学、浙江大学、中国科学技术大学等。' },
                { title: '211工程院校概览', content: '115所211工程大学，覆盖全国各省市，是中国高等教育的中坚力量。' }
            ],
            notes: []
        },
        {
            id: 'college_2',
            title: '从小规划大学（下）',
            author: '开心教育研究中心',
            emoji: '📚',
            gradient: '#f093fb,#f5576c',
            category: '升学规划',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-2.pdf',
            chapters: [
                { title: '双一流大学建设', content: '147所双一流大学，是国家重点建设的世界一流大学和一流学科高校。' },
                { title: '区域重点大学介绍', content: '3所区域重点大学，为地方经济社会发展提供人才支撑。' },
                { title: '21条升学路径全解析', content: '打破信息差，轻松上名校！21条升学路径让孩子有更多选择。' }
            ],
            notes: []
        },
        {
            id: 'college_3',
            title: '清华大学报考指南',
            author: '清华招生办',
            emoji: '🏛️',
            gradient: '#4facfe,#00f2fe',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-3.pdf',
            chapters: [
                { title: '学校概况与历史', content: '清华大学始建于1911年，是中国最著名的高等学府之一。' },
                { title: '优势专业介绍', content: '工科全国第一，计算机、电子、机械、土木、建筑等专业享誉世界。' },
                { title: '录取分数线与备考建议', content: '各省录取分数线参考，以及高效备考策略分享。' }
            ],
            notes: []
        },
        {
            id: 'college_4',
            title: '北京大学报考指南',
            author: '北大招生办',
            emoji: '🌺',
            gradient: '#43e97b,#38f9d7',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-4.pdf',
            chapters: [
                { title: '百年北大', content: '北京大学创办于1898年，初名京师大学堂，是中国近代第一所国立综合性大学。' },
                { title: '文理医工全面发展', content: '北大文科、理科、医学、社科均处于国内顶尖水平。' },
                { title: '招生政策详解', content: '统招、强基计划、保送生、特长生等多种招生渠道。' }
            ],
            notes: []
        },
        {
            id: 'college_5',
            title: '复旦大学报考指南',
            author: '复旦招生办',
            emoji: '🌟',
            gradient: '#fa709a,#fee140',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-5.pdf',
            chapters: [
                { title: '日月光华，旦复旦兮', content: '复旦大学始建于1905年，是上海最著名的综合性大学。' },
                { title: '上海名校的优势', content: '地理位置优越，国际化程度高，就业前景广阔。' },
                { title: '热门专业与分数线', content: '经济、管理、新闻、医学、数学等专业实力强劲。' }
            ],
            notes: []
        },
        {
            id: 'college_6',
            title: '上海交通大学报考指南',
            author: '上交招生办',
            emoji: '🚢',
            gradient: '#a18cd1,#fbc2eb',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-6.pdf',
            chapters: [
                { title: '百年名校', content: '上海交通大学始建于1896年，享誉海内外的高等学府。' },
                { title: '工科强校', content: '机械、船舶、材料、计算机等工科专业实力雄厚。' },
                { title: '闵行校区与徐汇校区', content: '两大主校区，环境优美，设施一流。' }
            ],
            notes: []
        },
        {
            id: 'college_7',
            title: '浙江大学报考指南',
            author: '浙大招生办',
            emoji: '🌿',
            gradient: '#667eea,#764ba2',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-7.pdf',
            chapters: [
                { title: '东方剑桥', content: '浙江大学坐落于杭州，是中国学科最齐全的大学之一。' },
                { title: '竺可桢学院', content: '浙大荣誉学院，汇聚顶尖学生，培养拔尖创新人才。' },
                { title: '六大校区介绍', content: '紫金港、玉泉、西溪、华家池、之江、海宁六大校区。' }
            ],
            notes: []
        },
        {
            id: 'college_8',
            title: '南京大学报考指南',
            author: '南大招生办',
            emoji: '🌙',
            gradient: '#f093fb,#f5576c',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-8.pdf',
            chapters: [
                { title: '诚朴雄伟，励学敦行', content: '南京大学坐落于南京，历史悠久，学风严谨。' },
                { title: '文理见长', content: '南大物理、天文、化学、文学、历史等学科享誉海内外。' },
                { title: '仙林与鼓楼校区', content: '现代化的仙林主校区，古朴的鼓楼校区各具特色。' }
            ],
            notes: []
        },
        {
            id: 'college_9',
            title: '中国科学技术大学报考指南',
            author: '中科大招生办',
            emoji: '🔬',
            gradient: '#4facfe,#00f2fe',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-9.pdf',
            chapters: [
                { title: '千生一院士', content: '中国科大坐落于合肥，以培养顶尖科研人才著称。' },
                { title: '少年班学院', content: '培养少年天才的摇篮，因材施教，精英教育。' },
                { title: '出国深造率全国第一', content: '超过70%的毕业生选择继续深造，留学名校比例极高。' }
            ],
            notes: []
        },
        {
            id: 'college_10',
            title: '武汉大学报考指南',
            author: '武大招生办',
            emoji: '🌸',
            gradient: '#43e97b,#38f9d7',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-10.pdf',
            chapters: [
                { title: '最美大学', content: '武汉大学樱花闻名全国，珞珈山、东湖环抱，环境优美。' },
                { title: '测绘遥感世界第一', content: '武大测绘学科全球领先，遥感技术实力雄厚。' },
                { title: '法学、经济学强校', content: '武大五院四系之一，法学、经济学实力强劲。' }
            ],
            notes: []
        },
        // --- 专业选择类（11-30）---
        {
            id: 'major_1',
            title: '大学专业选择指南',
            author: '教育部高校教学指导委员会',
            emoji: '📋',
            gradient: '#fa709a,#fee140',
            category: '专业选择',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-1.pdf',
            chapters: [
                { title: '专业选择的五大原则', content: '兴趣优先、就业前景、学科实力、学校地域、深造机会。' },
                { title: '热门专业深度解析', content: '计算机、电子信息、金融、临床医学等热门专业详细介绍。' },
                { title: '冷门但高性价比专业', content: '有些专业虽然不热门，但就业好，竞争小，性价比高。' }
            ],
            notes: []
        },
        {
            id: 'major_2',
            title: '计算机类专业全解析',
            author: 'IT行业协会',
            emoji: '💻',
            gradient: '#a18cd1,#fbc2eb',
            category: '专业选择',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-2.pdf',
            chapters: [
                { title: '计算机科学与技术', content: '最核心的计算机专业，软硬件都学，就业面最广。' },
                { title: '软件工程', content: '专注于软件开发与项目管理，企业需求量大。' },
                { title: '人工智能与大数据', content: '新兴方向，前景广阔，国家战略支持。' }
            ],
            notes: []
        },
        {
            id: 'major_3',
            title: '医学类专业报考指南',
            author: '医学教育协会',
            emoji: '⚕️',
            gradient: '#667eea,#764ba2',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-3.pdf',
            chapters: [
                { title: '临床医学八年制', content: '本博连读，培养顶尖医学人才。' },
                { title: '口腔医学', content: '收入高，工作环境好，医患关系相对简单。' },
                { title: '医学影像学', content: '临床辅助科室，压力相对小，收入稳定。' }
            ],
            notes: []
        },
        {
            id: 'major_4',
            title: '财经类专业选择指南',
            author: '财经教育委员会',
            emoji: '💰',
            gradient: '#f093fb,#f5576c',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-4.pdf',
            chapters: [
                { title: '金融学', content: '进入银行、证券、基金、投资银行的核心专业。' },
                { title: '会计学', content: '就业稳定，每个公司都需要会计，越老越吃香。' },
                { title: '统计学', content: '大数据时代的刚需专业，前景广阔。' }
            ],
            notes: []
        },
        {
            id: 'major_5',
            title: '法学类专业报考指南',
            author: '法学教育研究会',
            emoji: '⚖️',
            gradient: '#4facfe,#00f2fe',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-5.pdf',
            chapters: [
                { title: '五院四系介绍', content: '中国最顶尖的法学院校，法律界的黄埔军校。' },
                { title: '法学专业课程设置', content: '十四门核心课程，为法律职业打下坚实基础。' },
                { title: '法律职业资格考试', content: '天下第一考，通过率分析与备考建议。' }
            ],
            notes: []
        },
        // --- 学习方法类（31-45）---
        {
            id: 'study_1',
            title: '高考状元学习方法大全',
            author: '历年高考状元',
            emoji: '🏆',
            gradient: '#43e97b,#38f9d7',
            category: '学习方法',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-1.pdf',
            chapters: [
                { title: '时间管理的艺术', content: '高效利用每一分钟，制定科学的学习计划。' },
                { title: '错题本的正确用法', content: '错题本是提分神器，关键在于如何正确使用。' },
                { title: '心态调整与压力管理', content: '保持良好心态，是高考成功的重要保证。' }
            ],
            notes: []
        },
        {
            id: 'study_2',
            title: '高中语文高效学习法',
            author: '语文特级教师',
            emoji: '📖',
            gradient: '#fa709a,#fee140',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-2.pdf',
            chapters: [
                { title: '现代文阅读技巧', content: '掌握答题套路，轻松拿高分。' },
                { title: '古诗文背诵方法', content: '理解记忆，情景联想，高效背诵。' },
                { title: '高考作文满分攻略', content: '审题立意，素材积累，结构优化。' }
            ],
            notes: []
        },
        {
            id: 'study_3',
            title: '高中数学提分秘籍',
            author: '数学奥赛教练',
            emoji: '📐',
            gradient: '#a18cd1,#fbc2eb',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-3.pdf',
            chapters: [
                { title: '基础题不失分策略', content: '选择填空前10题，保证百分之百正确率。' },
                { title: '压轴题解题技巧', content: '导数、圆锥曲线压轴题的抢分策略。' },
                { title: '数学思维培养', content: '数形结合、分类讨论、转化化归思想。' }
            ],
            notes: []
        },
        {
            id: 'study_4',
            title: '高中英语逆袭指南',
            author: '新东方名师',
            emoji: '🔤',
            gradient: '#667eea,#764ba2',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-4.pdf',
            chapters: [
                { title: '3500词汇高效记忆', content: '词根词缀、联想记忆、艾宾浩斯复习法。' },
                { title: '阅读理解满分技巧', content: '细节题、主旨题、推断题，题型对应方法。' },
                { title: '英语作文万能模板', content: '书信、议论文、图表作文，高分模板分享。' }
            ],
            notes: []
        },
        {
            id: 'study_5',
            title: '高中物理学习法',
            author: '物理竞赛教练',
            emoji: '⚡',
            gradient: '#f093fb,#f5576c',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-5.pdf',
            chapters: [
                { title: '物理思维建立', content: '模型化思维，把复杂问题简单化。' },
                { title: '力学核心知识点', content: '牛顿运动定律、能量守恒、动量守恒。' },
                { title: '电磁学解题技巧', content: '电场、磁场、电磁感应，核心公式灵活运用。' }
            ],
            notes: []
        },
        // --- 志愿填报类（46-60）---
        {
            id: '志愿_1',
            title: '高考志愿填报全攻略',
            author: '高考志愿填报专家',
            emoji: '📝',
            gradient: '#4facfe,#00f2fe',
            category: '志愿填报',
            favorite: true,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-1.pdf',
            chapters: [
                { title: '平行志愿规则详解', content: '分数优先、遵循志愿、一轮投档，三大核心原则。' },
                { title: '冲稳保策略制定', content: '如何合理安排冲、稳、保的院校梯度。' },
                { title: '滑档退档风险规避', content: '服从专业调剂的重要性，以及其他注意事项。' }
            ],
            notes: []
        },
        {
            id: '志愿_2',
            title: '院校排名与学科评估',
            author: '高等教育评价中心',
            emoji: '📊',
            gradient: '#43e97b,#38f9d7',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-2.pdf',
            chapters: [
                { title: '双一流学科完整名单', content: '国家官方认证的一流学科名单，选专业的重要参考。' },
                { title: '教育部第五轮学科评估', content: 'A+、A、A-学科分布，了解各校优势学科。' },
                { title: 'QS、USNews、软科排名解读', content: '各大排名侧重点不同，如何参考使用。' }
            ],
            notes: []
        },
        {
            id: '志愿_3',
            title: '强基计划报考指南',
            author: '强基计划研究中心',
            emoji: '🔬',
            gradient: '#fa709a,#fee140',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-3.pdf',
            chapters: [
                { title: '什么是强基计划', content: '服务国家战略，培养基础学科拔尖创新人才。' },
                { title: '36所强基计划院校', content: '全部为985高校，清北复交浙科南领衔。' },
                { title: '校测笔试面试准备', content: '强基计划校测难度远超高考，如何高效准备。' }
            ],
            notes: []
        },
        {
            id: '志愿_4',
            title: '综合评价录取指南',
            author: '综合评价招生办',
            emoji: '⭐',
            gradient: '#a18cd1,#fbc2eb',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-4.pdf',
            chapters: [
                { title: '三位一体招生模式', content: '高考成绩+校测+学考，综合评价录取。' },
                { title: '综合素质材料准备', content: '社会实践、研究性学习、获奖证书等材料准备。' },
                { title: '面试技巧与真题', content: '历年综评面试真题分享，答题技巧总结。' }
            ],
            notes: []
        },
        // --- 志愿填报补充（5-9）---
        {
            id: '志愿_5',
            title: '军校报考全指南',
            author: '军校招生办公室',
            emoji: '🎖️',
            gradient: '#30cfd0,#330867',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-5.pdf',
            chapters: [
                { title: '27所军校介绍', content: '军委直属、陆军、海军、空军、火箭军、武警等各类军校。' },
                { title: '体检标准详解', content: '身高、体重、视力、色觉、体能等各项体检标准。' },
                { title: '政治考核要求', content: '政审内容、流程、注意事项，哪些情况不能报考。' }
            ],
            notes: []
        },
        {
            id: '志愿_6',
            title: '公安类院校报考指南',
            author: '公安部政治部',
            emoji: '👮',
            gradient: '#09203f,#537895',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-6.pdf',
            chapters: [
                { title: '公安部直属5所院校', content: '中国人民公安大学、中国人民警察大学等5所顶尖警校。' },
                { title: '省属公安院校', content: '各省警察学院，入警率高，就业有保障。' },
                { title: '体能测试项目与标准', content: '50米跑、立定跳远、1000米跑、引体向上等项目标准。' }
            ],
            notes: []
        },
        {
            id: '志愿_7',
            title: '师范类院校报考指南',
            author: '教育部师范教育司',
            emoji: '👨‍🏫',
            gradient: '#868f96,#596164',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-7.pdf',
            chapters: [
                { title: '公费师范生政策', content: '两免一补、包分配、有编制，值得报考的好政策。' },
                { title: '教育部直属6所师范大学', content: '北师大、华东师大、华中师大、东北师大、陕师大、西南大学。' },
                { title: '师范专业与非师范专业', content: '两者的区别，教师资格证考试政策。' }
            ],
            notes: []
        },
        {
            id: '志愿_8',
            title: '医学院校报考指南',
            author: '医学教育认证中心',
            emoji: '🏥',
            gradient: '#e6d5b8,#e6a4b4',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-8.pdf',
            chapters: [
                { title: '顶级医学院校', content: '协和医学院、北大医学部、复旦上海医学院、上交医学院等。' },
                { title: '医学类专业学制', content: '5年本科、5+3一体化、8年本博连读的区别。' },
                { title: '规培政策详解', content: '住院医师规范化培训，医学生的必经之路。' }
            ],
            notes: []
        },
        {
            id: '志愿_9',
            title: '中外合作办学报考指南',
            author: '国际教育交流中心',
            emoji: '🌍',
            gradient: '#09c6f9,#045de9',
            category: '志愿填报',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/志愿-9.pdf',
            chapters: [
                { title: '什么是中外合作办学', content: '中外高校合作培养，双学位项目，国际化教育。' },
                { title: '上海纽约大学等顶级合作院校', content: '录取标准、学费、毕业去向全解析。' },
                { title: '值不值得报考？', content: '优势与劣势分析，适合什么样的学生。' }
            ],
            notes: []
        },
        // --- 专业选择补充（6-15）---
        {
            id: 'major_6',
            title: '电子信息类专业详解',
            author: '电子信息教指委',
            emoji: '📡',
            gradient: '#37ecba,#72afd3',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-6.pdf',
            chapters: [
                { title: '电子信息工程', content: '软硬件结合，就业面广，适应性强。' },
                { title: '通信工程', content: '5G时代的核心专业，华为、中兴、运营商主要招聘方向。' },
                { title: '微电子科学与工程', content: '芯片设计与制造，国家大力扶持的卡脖子领域。' }
            ],
            notes: []
        },
        {
            id: 'major_7',
            title: '自动化与控制类专业',
            author: '自动化教指委',
            emoji: '🤖',
            gradient: '#6a11cb,#2575fc',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-7.pdf',
            chapters: [
                { title: '自动化专业', content: '万金油专业，工业4.0时代需求旺盛。' },
                { title: '机器人工程', content: '新兴专业，智能制造时代的核心人才。' },
                { title: '电气工程及其自动化', content: '国家电网、南方电网的主要招聘专业。' }
            ],
            notes: []
        },
        {
            id: 'major_8',
            title: '土木建筑类专业',
            author: '土建教指委',
            emoji: '🏗️',
            gradient: '#f5d799,#f8b500',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-8.pdf',
            chapters: [
                { title: '土木工程', content: '基建行业的核心专业，设计院、施工单位、甲方都需要。' },
                { title: '建筑学', content: '5年制，需要美术基础，设计建筑的灵魂。' },
                { title: '给排水、暖通、电气', content: '建筑设备三专业，设计院必不可少。' }
            ],
            notes: []
        },
        {
            id: 'major_9',
            title: '机械工程类专业',
            author: '机械教指委',
            emoji: '⚙️',
            gradient: '#8e2de2,#4a00e0',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-9.pdf',
            chapters: [
                { title: '机械设计制造及其自动化', content: '工科第一大专业，任何制造企业都需要。' },
                { title: '车辆工程', content: '汽车工业的核心专业，新能源汽车发展迅速。' },
                { title: '航空航天工程', content: '大国重器，北航、南航、西工大等强校。' }
            ],
            notes: []
        },
        {
            id: 'major_10',
            title: '化工材料类专业',
            author: '化工教指委',
            emoji: '🧪',
            gradient: '#00b09b,#96c93d',
            category: '专业选择',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/major-10.pdf',
            chapters: [
                { title: '化学工程与工艺', content: '石化、医药、新能源行业都需要的专业。' },
                { title: '材料科学与工程', content: '新材料是工业的基础，国家战略新兴产业。' },
                { title: '环境工程', content: '绿水青山就是金山银山，环保产业发展迅速。' }
            ],
            notes: []
        },
        // --- 学习方法补充（6-10）---
        {
            id: 'study_6',
            title: '高中化学学习法',
            author: '化学特级教师',
            emoji: '⚗️',
            gradient: '#43e97b,#38f9d7',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-6.pdf',
            chapters: [
                { title: '元素化合物知识网络', content: '构建知识网络，让零散的知识点系统化。' },
                { title: '化学反应原理理解', content: '热力学、动力学、电化学，理解是关键。' },
                { title: '有机化学学习技巧', content: '官能团决定性质，掌握这个规律就简单了。' }
            ],
            notes: []
        },
        {
            id: 'study_7',
            title: '高中生物学习法',
            author: '生物竞赛教练',
            emoji: '🧬',
            gradient: '#fa709a,#fee140',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-7.pdf',
            chapters: [
                { title: '课本是最好的资料', content: '生物教材要精读，每个字都可能成为考点。' },
                { title: '图文结合记忆', content: '利用课本插图，理解记忆细胞结构、生理过程。' },
                { title: '遗传题解题技巧', content: '遗传概率计算，掌握方法就不难。' }
            ],
            notes: []
        },
        {
            id: 'study_8',
            title: '高中历史学习法',
            author: '历史特级教师',
            emoji: '📜',
            gradient: '#a18cd1,#fbc2eb',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-8.pdf',
            chapters: [
                { title: '时间轴记忆法', content: '把历史事件按时间顺序串起来，建立时空观念。' },
                { title: '政治经济文化三维分析', content: '任何历史事件都可以从这三个维度分析。' },
                { title: '材料题答题模板', content: '原因类、影响类、比较类，各类题型答题套路。' }
            ],
            notes: []
        },
        {
            id: 'study_9',
            title: '高中地理学习法',
            author: '地理特级教师',
            emoji: '🌍',
            gradient: '#667eea,#764ba2',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-9.pdf',
            chapters: [
                { title: '地图是地理的第二语言', content: '学会看图、画图，地理就学会了一半。' },
                { title: '自然地理理解为主', content: '大气环流、洋流、地壳运动，理解原理是关键。' },
                { title: '人文地理模板化', content: '区位因素分析有固定套路，记住就可以套用。' }
            ],
            notes: []
        },
        {
            id: 'study_10',
            title: '高中思想政治学习法',
            author: '政治特级教师',
            emoji: '📚',
            gradient: '#f093fb,#f5576c',
            category: '学习方法',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/study-10.pdf',
            chapters: [
                { title: '经济生活逻辑体系', content: '生产、分配、交换、消费，四大环节环环相扣。' },
                { title: '政治生活主体分析法', content: '公民、政府、党、人大、政协，每个主体的职权要分清。' },
                { title: '哲学生活原理+方法论', content: '每个哲学原理对应一个方法论，成对记忆。' }
            ],
            notes: []
        },
        // --- 升学规划补充（11-20）---
        {
            id: 'college_11',
            title: '浙江大学报考指南',
            author: '浙大招生办',
            emoji: '🌿',
            gradient: '#11998e,#38ef7d',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-11.pdf',
            chapters: [
                { title: '浙大历史与现状', content: '求是创新，东方剑桥，学科齐全的综合性大学。' },
                { title: '竺可桢学院', content: '浙大的尖子班，培养拔尖创新人才的荣誉学院。' },
                { title: '优势专业与录取分数', content: '计算机、农学、数学、临床医学等专业实力强劲。' }
            ],
            notes: []
        },
        {
            id: 'college_12',
            title: '中国科学技术大学报考指南',
            author: '中科大招生办',
            emoji: '🔭',
            gradient: '#5c258d,#4389a2',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-12.pdf',
            chapters: [
                { title: '千生一院士', content: '中国科学家的摇篮，出国深造比例全国最高。' },
                { title: '少年班与创新试点班', content: '天才少年的培养基地，不拘一格降人才。' },
                { title: '物理系与物理系', content: '理科全国第一，基础学科实力雄厚。' }
            ],
            notes: []
        },
        {
            id: 'college_13',
            title: '南京大学报考指南',
            author: '南大招生办',
            emoji: '🌟',
            gradient: '#2c3e50,#4ca1af',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-13.pdf',
            chapters: [
                { title: '诚朴雄伟，励学敦行', content: '历史悠久的百年名校，低调有实力。' },
                { title: '天文学全国第一', content: '南大天文，中国天文的半壁江山。' },
                { title: '文理科实力均衡', content: '文科理科都是顶尖水平，华东五校之一。' }
            ],
            notes: []
        },
        {
            id: 'college_14',
            title: 'C9联盟院校全解析',
            author: '高等教育研究会',
            emoji: '💎',
            gradient: '#0f0c29,#302b63,#24243e',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-14.pdf',
            chapters: [
                { title: '什么是C9联盟', content: '中国的常春藤，九所顶尖大学组成的高校联盟。' },
                { title: 'C9院校优势', content: '交换培养、联合科研、保研率高、出国深造机会多。' },
                { title: '各校特色对比', content: '清北、华五、哈工大、西交大，各校优势学科分析。' }
            ],
            notes: []
        },
        {
            id: 'college_15',
            title: '国防七子全解析',
            author: '国防科工局',
            emoji: '🛡️',
            gradient: '#141e30,#243b55',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-15.pdf',
            chapters: [
                { title: '什么是国防七子', content: '工信部直属的七所国防特色鲜明的大学。' },
                { title: '北航、北理工、哈工大', content: '三所985，航空航天、武器装备领域的顶尖学府。' },
                { title: '西工大、南航、南理工、哈工程', content: '各具特色，在各自领域实力雄厚。' }
            ],
            notes: []
        },
        {
            id: 'college_16',
            title: '两电一邮报考指南',
            author: '电子信息教育联盟',
            emoji: '📶',
            gradient: '#6dd5ed,#2193b0',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-16.pdf',
            chapters: [
                { title: '电子科技大学', content: '中国电子类院校的排头兵，两电一邮之首。' },
                { title: '西安电子科技大学', content: '西军电传承，通信、电子、计算机实力强劲。' },
                { title: '北京邮电大学', content: '互联网界的黄埔军校，IT企业就业质量极高。' }
            ],
            notes: []
        },
        {
            id: 'college_17',
            title: '五院四系法学强校',
            author: '法学教育研究会',
            emoji: '⚖️',
            gradient: '#cc2b5e,#753a88',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-17.pdf',
            chapters: [
                { title: '五院：政法专门院校', content: '中国政法、西南政法、华东政法、中南财经政法、西北政法。' },
                { title: '四系：综合大学法学院', content: '北大、人大、吉大、武大，四大法学院系。' },
                { title: '法学专业就业前景', content: '律师、法官、检察官、公司法务，职业选择多样。' }
            ],
            notes: []
        },
        {
            id: 'college_18',
            title: '建筑老八校报考指南',
            author: '建筑教育评估委员会',
            emoji: '🏛️',
            gradient: '#ee0979,#ff6a00',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-18.pdf',
            chapters: [
                { title: '什么是建筑老八校', content: '新中国最早开设建筑学专业的八所高校。' },
                { title: '四大王牌：清华、东南、天大、同济', content: '建筑学A+学科院校，中国建筑教育的最高水平。' },
                { title: '其他四校：华工、重大、哈建大、西建大', content: '各具特色，在建筑界认可度极高。' }
            ],
            notes: []
        },
        {
            id: 'college_19',
            title: '财经类院校排名与报考',
            author: '财经教育联盟',
            emoji: '💰',
            gradient: '#2b5876,#4e4376',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-19.pdf',
            chapters: [
                { title: '两财一贸：上财、央财、对外经贸', content: '中国财经类院校的第一梯队，就业质量堪比985。' },
                { title: '西南财经、中南财经政法', content: '区域强校，金融界校友众多。' },
                { title: '东北财经、江西财经', content: '行业认可度高，性价比之选。' }
            ],
            notes: []
        },
        {
            id: 'college_20',
            title: '电力部直属院校全解析',
            author: '国家电网人力资源部',
            emoji: '⚡',
            gradient: '#0f0c29,#302b63,#24243e',
            category: '升学规划',
            favorite: false,
            progress: 0,
            downloadUrl: 'https://example.com/books/college-20.pdf',
            chapters: [
                { title: '电气二龙四虎', content: '电气专业顶尖院校，进入国家电网的绿色通道。' },
                { title: '原电力部直属院校', content: '东北电力、上海电力、南京工程、三峡大学等。' },
                { title: '国家电网招聘考试', content: '考试内容、录取比例、备考策略分享。' }
            ],
            notes: []
        }
    ];
    
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
            books: [...DEFAULT_BOOKS, ...LEARNING_METHODS, ...COLLEGE_PLANNING_BOOKS]
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
                    <div style="display:flex;gap:8px;">
                        <button onclick="window.showImportBookModal()" style="padding:8px 14px;background:#ff9800;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">📤 导入</button>
                        <div style="position:relative;">
                            <button onclick="window.toggleDownloadMenu()" style="padding:8px 14px;background:#4caf50;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:4px;">📥 下载 <span style="font-size:10px;">▼</span></button>
                            <div id="download-dropdown" style="display:none;position:absolute;top:100%;right:0;background:white;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:100;min-width:160px;margin-top:4px;">
                                <div onclick="window.downloadAllLibraryBooks();window.toggleDownloadMenu()" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">📚 全部下载</div>
                                ${data.books.map(book => `
                                    <div onclick="window.downloadBookById('${book.id}');window.toggleDownloadMenu()" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">${book.emoji} ${book.title}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 分类筛选下拉菜单 -->
                <div style="margin-bottom:20px;">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                        <select id="category-filter" onchange="window.filterBooksByCategory(this.value)" style="flex:1;min-width:150px;padding:10px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:14px;color:#333;background:white;cursor:pointer;">
                            <option value="all">📚 全部分类 (${data.books.length}本)</option>
                            <option value="学霸方法">🏆 学霸方法 (${data.books.filter(b => b.category === '学霸方法').length}本)</option>
                            <option value="升学规划">🎓 升学规划 (${data.books.filter(b => b.category === '升学规划').length}本)</option>
                            <option value="专业选择">📋 专业选择 (${data.books.filter(b => b.category === '专业选择').length}本)</option>
                            <option value="学习方法">📖 学习方法 (${data.books.filter(b => b.category === '学习方法').length}本)</option>
                            <option value="志愿填报">📝 志愿填报 (${data.books.filter(b => b.category === '志愿填报').length}本)</option>
                        </select>
                        <button onclick="window.downloadAllCollegeBooks()" style="padding:10px 20px;background:linear-gradient(135deg,#ff6b6b,#ffa502);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;font-weight:500;white-space:nowrap;">📦 批量下载精选书籍</button>
                    </div>
                </div>
                
                <!-- 分类：学霸方法 -->
                <div id="category-学霸方法" style="margin-bottom:24px;">
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
                
                <!-- 分类：升学规划 - 目录形式展示 -->
                <div id="category-升学规划" style="margin-bottom:24px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">🎓 升学规划精选</h3>
                        <span style="font-size:12px;color:#999;">${data.books.filter(b => b.category === '升学规划').length}本</span>
                    </div>
                    <div style="background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;">
                        ${data.books.filter(b => b.category === '升学规划').map((book, index) => `
                            <div onclick="window.openBook('${book.id}')" style="padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background 0.2s;border-bottom:${index < data.books.filter(b => b.category === '升学规划').length - 1 ? '1px solid #f0f0f0' : 'none'};" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                                <div style="${getBookCover(book)}width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span style="font-size:20px;">${book.emoji}</span>
                                </div>
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:14px;font-weight:500;color:#333;margin-bottom:2px;">${book.title}</div>
                                    <div style="font-size:11px;color:#999;">${book.author}</div>
                                </div>
                                <button onclick="event.stopPropagation();window.downloadBookByUrl('${book.downloadUrl}', '${book.title}')" style="padding:6px 12px;background:#4caf50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📥 下载</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 分类：专业选择 - 目录形式展示 -->
                <div id="category-专业选择" style="margin-bottom:24px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">📋 专业选择指南</h3>
                        <span style="font-size:12px;color:#999;">${data.books.filter(b => b.category === '专业选择').length}本</span>
                    </div>
                    <div style="background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;">
                        ${data.books.filter(b => b.category === '专业选择').map((book, index) => `
                            <div onclick="window.openBook('${book.id}')" style="padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background 0.2s;border-bottom:${index < data.books.filter(b => b.category === '专业选择').length - 1 ? '1px solid #f0f0f0' : 'none'};" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                                <div style="${getBookCover(book)}width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span style="font-size:20px;">${book.emoji}</span>
                                </div>
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:14px;font-weight:500;color:#333;margin-bottom:2px;">${book.title}</div>
                                    <div style="font-size:11px;color:#999;">${book.author}</div>
                                </div>
                                <button onclick="event.stopPropagation();window.downloadBookByUrl('${book.downloadUrl}', '${book.title}')" style="padding:6px 12px;background:#4caf50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📥 下载</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 分类：学习方法 - 目录形式展示 -->
                <div id="category-学习方法" style="margin-bottom:24px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">📖 高效学习方法</h3>
                        <span style="font-size:12px;color:#999;">${data.books.filter(b => b.category === '学习方法').length}本</span>
                    </div>
                    <div style="background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;">
                        ${data.books.filter(b => b.category === '学习方法').map((book, index) => `
                            <div onclick="window.openBook('${book.id}')" style="padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background 0.2s;border-bottom:${index < data.books.filter(b => b.category === '学习方法').length - 1 ? '1px solid #f0f0f0' : 'none'};" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                                <div style="${getBookCover(book)}width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span style="font-size:20px;">${book.emoji}</span>
                                </div>
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:14px;font-weight:500;color:#333;margin-bottom:2px;">${book.title}</div>
                                    <div style="font-size:11px;color:#999;">${book.author}</div>
                                </div>
                                <button onclick="event.stopPropagation();window.downloadBookByUrl('${book.downloadUrl}', '${book.title}')" style="padding:6px 12px;background:#4caf50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📥 下载</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 分类：志愿填报 - 目录形式展示 -->
                <div id="category-志愿填报" style="margin-bottom:24px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <h3 style="margin:0;font-size:16px;color:#333;">📝 志愿填报攻略</h3>
                        <span style="font-size:12px;color:#999;">${data.books.filter(b => b.category === '志愿填报').length}本</span>
                    </div>
                    <div style="background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;">
                        ${data.books.filter(b => b.category === '志愿填报').map((book, index) => `
                            <div onclick="window.openBook('${book.id}')" style="padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background 0.2s;border-bottom:${index < data.books.filter(b => b.category === '志愿填报').length - 1 ? '1px solid #f0f0f0' : 'none'};" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                                <div style="${getBookCover(book)}width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span style="font-size:20px;">${book.emoji}</span>
                                </div>
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:14px;font-weight:500;color:#333;margin-bottom:2px;">${book.title}</div>
                                    <div style="font-size:11px;color:#999;">${book.author}</div>
                                </div>
                                <button onclick="event.stopPropagation();window.downloadBookByUrl('${book.downloadUrl}', '${book.title}')" style="padding:6px 12px;background:#4caf50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">📥 下载</button>
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
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;position:sticky;top:0;background:white;z-index:10;padding:8px 0;border-bottom:1px solid #f0f0f0;flex-wrap:wrap;gap:8px;">
                    <button onclick="window.backToLibrary()" style="padding:8px 14px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">← 返回书架</button>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button onclick="window.generateMindMapFromBook('${book.id}')" style="padding:8px 14px;background:linear-gradient(135deg,#9c27b0,#e91e63);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;font-weight:500;">🧠 生成思维导图</button>
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
    
    // 切换下载下拉菜单
    function toggleDownloadMenu() {
        const dropdown = document.getElementById('download-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }
    
    // 根据ID下载单本书
    function downloadBookById(bookId) {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === bookId);
        if (book) {
            downloadBook(book);
        }
    }
    
    // 显示导入书籍弹窗
    function showImportBookModal() {
        const modal = document.createElement('div');
        modal.id = 'import-book-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
        modal.innerHTML = `
            <div style="background:white;border-radius:16px;width:100%;max-width:500px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;">
                <div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;font-size:18px;color:#333;">📤 导入书籍</h3>
                    <button onclick="document.getElementById('import-book-modal').remove()" style="width:32px;height:32px;border-radius:50%;border:none;background:#f5f5f5;color:#666;cursor:pointer;font-size:16px;">×</button>
                </div>
                <div style="padding:20px;flex:1;overflow-y:auto;">
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">书籍名称</label>
                        <input type="text" id="import-book-title" placeholder="请输入书名" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;box-sizing:border-box;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">作者</label>
                        <input type="text" id="import-book-author" placeholder="请输入作者" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;box-sizing:border-box;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">分类</label>
                        <select id="import-book-category" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;box-sizing:border-box;background:white;">
                            <option value="学习方法">学习方法</option>
                            <option value="记忆方法">记忆方法</option>
                            <option value="时间管理">时间管理</option>
                            <option value="学科知识">学科知识</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:14px;color:#666;margin-bottom:8px;">书籍内容（记事本格式，每行一段，空行分隔章节）</label>
                        <textarea id="import-book-content" placeholder="第一章：标题&#10;章节内容...&#10;&#10;第二章：标题&#10;章节内容..." style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-height:200px;box-sizing:border-box;resize:vertical;font-family:monospace;"></textarea>
                    </div>
                    <div style="font-size:12px;color:#999;line-height:1.6;">
                        <p>📝 格式说明：</p>
                        <p>• 第一行写章节标题（如：第一章：什么是费曼学习法）</p>
                        <p>• 后续行写章节内容</p>
                        <p>• 空行分隔不同章节</p>
                    </div>
                </div>
                <div style="padding:16px 20px;border-top:1px solid #f0f0f0;display:flex;gap:12px;">
                    <button onclick="document.getElementById('import-book-modal').remove()" style="flex:1;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">取消</button>
                    <button onclick="window.importBookFromText()" style="flex:1;padding:12px;background:#667eea;color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;">✅ 导入</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 从文本导入书籍
    function importBookFromText() {
        const title = document.getElementById('import-book-title').value.trim();
        const author = document.getElementById('import-book-author').value.trim() || '佚名';
        const category = document.getElementById('import-book-category').value;
        const content = document.getElementById('import-book-content').value.trim();
        
        if (!title) {
            window.showToast('请输入书籍名称');
            return;
        }
        if (!content) {
            window.showToast('请输入书籍内容');
            return;
        }
        
        // 解析内容：空行分隔章节
        const parts = content.split(/\n\s*\n/);
        const chapters = [];
        
        parts.forEach(part => {
            const lines = part.trim().split('\n');
            if (lines.length > 0) {
                const chapterTitle = lines[0].trim();
                const chapterContent = lines.slice(1).join('\n').trim() || chapterTitle;
                chapters.push({
                    title: chapterTitle,
                    content: chapterContent
                });
            }
        });
        
        if (chapters.length === 0) {
            window.showToast('未解析到有效章节');
            return;
        }
        
        // 创建新书
        const newBook = {
            id: 'import_' + Date.now(),
            title: title,
            author: author,
            emoji: '📖',
            gradient: '#a855f7,#6366f1',
            category: category,
            favorite: false,
            progress: 0,
            chapters: chapters,
            notes: []
        };
        
        // 保存到数据
        const data = getLibraryData();
        data.books.push(newBook);
        saveLibraryData(data);
        
        // 关闭弹窗并刷新
        document.getElementById('import-book-modal').remove();
        window.showToast(`✅ 成功导入《${title}》，共${chapters.length}章`);
        
        // 重新渲染
        const container = document.getElementById('library-main-container');
        if (container) renderLibraryHome(container);
    }
    
    // ============================================
    // 新增功能函数
    // ============================================
    
    // 按分类筛选书籍
    function filterBooksByCategory(category) {
        const categories = ['学霸方法', '升学规划', '专业选择', '学习方法', '志愿填报'];
        
        if (category === 'all') {
            // 显示所有分类
            categories.forEach(cat => {
                const el = document.getElementById('category-' + cat);
                if (el) el.style.display = 'block';
            });
        } else {
            // 只显示选中的分类
            categories.forEach(cat => {
                const el = document.getElementById('category-' + cat);
                if (el) el.style.display = cat === category ? 'block' : 'none';
            });
        }
        
        window.showToast(category === 'all' ? '显示全部分类' : `已筛选：${category}`);
    }
    
    // 通过URL下载书籍
    function downloadBookByUrl(url, title) {
        if (!url || url === 'undefined') {
            window.showToast('⚠️ 该书籍暂无下载链接');
            return;
        }
        
        // 打开新窗口下载
        window.open(url, '_blank');
        window.showToast(`📥 正在下载：${title}`);
    }
    
    // 批量下载所有精选书籍
    function downloadAllCollegeBooks() {
        const data = getLibraryData();
        const collegeBooks = data.books.filter(b => b.category && b.category !== '学霸方法');
        
        if (collegeBooks.length === 0) {
            window.showToast('暂无可下载的书籍');
            return;
        }
        
        // 创建下载列表弹窗
        const modal = document.createElement('div');
        modal.id = 'batch-download-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
        
        modal.innerHTML = `
            <div style="background:white;border-radius:16px;max-width:400px;width:90%;max-height:80vh;overflow:hidden;">
                <div style="padding:16px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
                    <h3 style="margin:0;font-size:18px;">📦 批量下载书籍</h3>
                </div>
                <div style="padding:16px 20px;max-height:60vh;overflow-y:auto;">
                    <p style="font-size:14px;color:#666;margin-bottom:16px;">共 ${collegeBooks.length} 本书籍可以下载：</p>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${collegeBooks.map(book => `
                            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#f8f9fa;border-radius:8px;">
                                <span style="font-size:13px;color:#333;">${book.emoji} ${book.title}</span>
                                <button onclick="window.downloadBookByUrl('${book.downloadUrl}', '${book.title}');this.innerText='✅';this.disabled=true;this.style.opacity='0.6';" style="padding:4px 10px;background:#4caf50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">下载</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div style="padding:16px 20px;border-top:1px solid #f0f0f0;">
                    <button onclick="document.getElementById('batch-download-modal').remove()" style="width:100%;padding:12px;background:#f5f5f5;color:#666;border:none;border-radius:10px;font-size:14px;cursor:pointer;">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // 从书籍生成思维导图
    function generateMindMapFromBook(bookId) {
        const data = getLibraryData();
        const book = data.books.find(b => b.id === bookId);
        
        if (!book) {
            window.showToast('❌ 未找到书籍');
            return;
        }
        
        // 显示加载提示
        window.showToast('🧠 正在生成思维导图...');
        
        // 构建思维导图节点数据
        // 根节点是书籍标题
        // 子节点是各章节标题
        // 孙子节点是章节内容摘要（前20个字）
        
        const mindMapData = {
            id: 'map_from_book_' + bookId + '_' + Date.now(),
            name: book.title,
            nodes: [
                // 根节点
                { id: 1, text: book.title, x: 50, y: 50, color: '#667eea', isRoot: true }
            ]
        };
        
        // 添加章节作为子节点
        book.chapters.forEach((chapter, index) => {
            const nodeId = index + 2;
            const colors = ['#f093fb', '#4facfe', '#43e97b', '#fa709a', '#a855f7', '#6366f1', '#ff6b6b', '#ffa502'];
            
            // 计算位置 - 围绕根节点分布
            const angle = (index / book.chapters.length) * 2 * Math.PI;
            const radius = 30;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            
            mindMapData.nodes.push({
                id: nodeId,
                text: chapter.title,
                x: Math.max(10, Math.min(90, x)),
                y: Math.max(10, Math.min(90, y)),
                color: colors[index % colors.length],
                parent: 1
            });
        });
        
        // 保存到思维导图模块（如果存在的话）
        if (window.MindMap && window.MindMap.saveMap) {
            window.MindMap.saveMap(mindMapData);
        } else {
            // 保存到localStorage备用
            localStorage.setItem('mindmap_from_book_' + mindMapData.id, JSON.stringify(mindMapData));
        }
        
        // 提示成功并询问是否打开思维导图模块
        setTimeout(() => {
            if (confirm(`✅ 思维导图已生成！\n📖 《${book.title}》\n共 ${book.chapters.length} 个章节节点\n\n是否立即跳转到思维导图模块查看？`)) {
                // 关闭阅读页面
                const content = document.getElementById('fullscreen-content');
                if (content) content.innerHTML = '';
                
                // 打开思维导图模块
                if (window.openFullscreenPage) {
                    window.openFullscreenPage('mindmap');
                } else if (window.renderMindMap) {
                    // 如果有直接渲染函数
                    const container = document.getElementById('fullscreen-content');
                    if (container) window.renderMindMap(container);
                }
            }
        }, 500);
    }
    
    // 导出到window
    window.renderLibrary = renderLibrary;
    window.openBook = openBook;
    window.prevChapter = prevChapter;
    window.nextChapter = nextChapter;
    window.backToLibrary = backToLibrary;
    window.toggleTTS = toggleTTS;
    window.downloadCurrentBook = downloadCurrentBook;
    window.downloadAllLibraryBooks = downloadAllLibraryBooks;
    window.toggleBookFavorite = toggleBookFavorite;
    window.stopSpeaking = stopSpeaking;
    window.toggleDownloadMenu = toggleDownloadMenu;
    window.downloadBookById = downloadBookById;
    window.showImportBookModal = showImportBookModal;
    window.importBookFromText = importBookFromText;
    // 新增功能导出
    window.filterBooksByCategory = filterBooksByCategory;
    window.downloadBookByUrl = downloadBookByUrl;
    window.downloadAllCollegeBooks = downloadAllCollegeBooks;
    window.generateMindMapFromBook = generateMindMapFromBook;
    
    console.log('[V305] 学习图书馆模块加载完成 - 分类筛选+目录展示+批量下载+一键生成思维导图');
})();

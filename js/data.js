// 认知训练门户 - 完整数据文件 V2.0
// 包含350+道母题、21条播客、思维训练数据

const topics = {
    // 五年级 - 数学7题
    grade5_math: [
        { id: 'g5m1', title: '小数加减法', difficulty: '基础', subject: 'math', grade: 5, icon: '📊', question: '计算：3.25 + 1.78 = ?', solution: '3.25 + 1.78 = 5.03', errorTip: '小数点对齐，位数不够用0补齐' },
        { id: 'g5m2', title: '小数乘法', difficulty: '基础', subject: 'math', grade: 5, icon: '📈', question: '计算：0.5 × 0.4 = ?', solution: '0.5 × 0.4 = 0.20', errorTip: '先按整数计算，再数小数位数' },
        { id: 'g5m3', title: '三角形面积', difficulty: '进阶', subject: 'math', grade: 5, icon: '🔺', question: '三角形底6cm，高4cm，面积是多少？', solution: '面积=6×4÷2=12cm²', errorTip: '不要忘记除以2' },
        { id: 'g5m4', title: '平行四边形面积', difficulty: '进阶', subject: 'math', grade: 5, icon: '📐', question: '平行四边形底8cm，高5cm，面积是多少？', solution: '面积=8×5=40cm²', errorTip: '平行四边形面积=底×高' },
        { id: 'g5m5', title: '分数比较', difficulty: '基础', subject: 'math', grade: 5, icon: '🔢', question: '比较大小：3/5 和 2/3，哪个更大？', solution: '3/5=0.6，2/3≈0.667，所以2/3更大', errorTip: '通分比较或化成小数比较' },
        { id: 'g5m6', title: '统计图分析', difficulty: '基础', subject: 'math', grade: 5, icon: '📊', question: '五年级1班男生20人，女生18人，制成条形统计图，1格代表几人最合适？', solution: '(20+18)÷10≈4人，选4人或5人比较合适', errorTip: '根据数据大小选择合适的1格代表数' },
        { id: 'g5m7', title: '周期问题', difficulty: '进阶', subject: 'math', grade: 5, icon: '🔄', question: '按照"红黄蓝绿"顺序排列，第23个是什么颜色？', solution: '23÷4=5余3，第23个是蓝色', errorTip: '找准周期，余几就数到第几个' },
        { id: 'g5m8', title: '小数除法', difficulty: '基础', subject: 'math', grade: 5, icon: '➗', question: '计算：4.56 ÷ 3 = ?', solution: '4.56 ÷ 3 = 1.52', errorTip: '小数除以整数，商的小数点与被除数对齐' },
        { id: 'g5m9', title: '小数混合运算', difficulty: '进阶', subject: 'math', grade: 5, icon: '🔢', question: '计算：2.5 + 3.6 × 2 = ?', solution: '2.5 + 7.2 = 9.7', errorTip: '先算乘法，再算加法' },
        { id: 'g5m10', title: '组合图形面积', difficulty: '进阶', subject: 'math', grade: 5, icon: '📐', question: '正方形边长4cm，三角形底4cm高3cm，求总面积', solution: '正方形=16cm²，三角形=6cm²，总面积=22cm²', errorTip: '分割成简单图形分别计算' },
        { id: 'g5m11', title: '等式性质', difficulty: '基础', subject: 'math', grade: 5, icon: '⚖️', question: '如果x+5=12，那么x=？', solution: 'x=12-5=7', errorTip: '等式两边同时减去同一个数' },
        { id: 'g5m12', title: '方程应用', difficulty: '进阶', subject: 'math', grade: 5, icon: '📝', question: '小红有20元，买了3本笔记本后还剩5元，每本多少元？', solution: '设每本x元：20-3x=5，解得x=5元', errorTip: '找出等量关系列方程' },
        { id: 'g5m13', title: '找规律填数', difficulty: '进阶', subject: 'math', grade: 5, icon: '🔄', question: '找规律：1, 4, 9, 16, ?', solution: '25（都是平方数）', errorTip: '1², 2², 3², 4², 5²' },
        { id: 'g5m14', title: '统筹优化', difficulty: '压轴', subject: 'math', grade: 5, icon: '⏰', question: '烙饼，每面2分钟，烙3张饼最少需要几分钟？', solution: '12分钟', errorTip: '合理安排时间' },
        { id: 'g5m15', title: '体积计算', difficulty: '进阶', subject: 'math', grade: 5, icon: '📦', question: '长方体长8cm，宽5cm，高3cm，体积是多少？', solution: 'V=8×5×3=120cm³', errorTip: '体积=长×宽×高' },
        { id: 'g5m16', title: '表面积计算', difficulty: '进阶', subject: 'math', grade: 5, icon: '🔲', question: '正方体棱长4cm，表面积是多少？', solution: 'S=6×4×4=96cm²', errorTip: '正方体有6个面' },
        { id: 'g5m17', title: '最大公因数', difficulty: '基础', subject: 'math', grade: 5, icon: '🔢', question: '12和18的最大公因数是多少？', solution: '6', errorTip: '短除法或质因数分解' },
        { id: 'g5m18', title: '最小公倍数', difficulty: '基础', subject: 'math', grade: 5, icon: '🔢', question: '4和6的最小公倍数是多少？', solution: '12', errorTip: '列举法或短除法' },
        { id: 'g5m19', title: '分数的意义', difficulty: '基础', subject: 'math', grade: 5, icon: '🔢', question: '把3个苹果平均分给5个人，每人分到几个？', solution: '每人分到3/5个苹果', errorTip: '用分数表示除法结果' },
        { id: 'g5m20', title: '分数加减法', difficulty: '基础', subject: 'math', grade: 5, icon: '➕', question: '计算：1/4 + 1/6 = ?', solution: '1/4 + 1/6 = 3/12 + 2/12 = 5/12', errorTip: '先通分再计算' },
        { id: 'g5m21', title: '可能性大小', difficulty: '进阶', subject: 'math', grade: 5, icon: '🎲', question: '盒子里有5个红球、3个黄球，摸到红球的可能性是多少？', solution: 'P(红球)=5/8', errorTip: '可能性=红球数÷总球数' }
    ]
    // 五年级 - 语文7题
    grade5_chinese: [
        { id: 'g5c1', title: '古诗词默写', difficulty: '基础', subject: 'chinese', grade: 5, icon: '📜', question: '默写《静夜思》：床前明月光，____________，____________。', solution: '疑是地上霜，举头望明月', errorTip: '注意"疑"字的写法' },
        { id: 'g5c2', title: '词语搭配', difficulty: '基础', subject: 'chinese', grade: 5, icon: '📝', question: '选词填空：茂密的（树林、树枝、树叶）', solution: '茂密的树林', errorTip: '形容词修饰名词要搭配得当' },
        { id: 'g5c3', title: '修辞手法', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '🎨', question: '判断句子的修辞手法：小鸟在歌唱。', solution: '拟人', errorTip: '把事物当作人来写是拟人' },
        { id: 'g5c4', title: '标点符号', difficulty: '基础', subject: 'chinese', grade: 5, icon: '✏️', question: '给句子加标点：今天天气真好呀我们一起去公园玩吧', solution: '今天天气真好呀！我们一起去公园玩吧！', errorTip: '感叹句用感叹号' },
        { id: 'g5c5', title: '阅读理解', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '📖', question: '《桂花雨》表达了作者怎样的感情？', solution: '表达了作者对家乡和童年生活的怀念之情', errorTip: '联系课文内容和写作背景' },
        { id: 'g5c6', title: '形近字辨析', difficulty: '基础', subject: 'chinese', grade: 5, icon: '🔤', question: '选词填空：他的脸上露出了（危险、诡异）的笑容。', solution: '诡异：意思是"值得思考的、令人难以理解的"，形容笑容神秘而不寻常', errorTip: '危险的意思是不安全，诡异的意思是神秘而令人不安' },
        { id: 'g5c7', title: '作文开头', difficulty: '基础', subject: 'chinese', grade: 5, icon: '✍️', question: '以"难忘的一天"为题，写一个开头。', solution: '打开记忆的闸门，许多事情已经模糊，但那一天却深深印在我的心里...', errorTip: '开头要能吸引读者，引出主题' },
        { id: 'g5c8', title: '古诗默写', difficulty: '基础', subject: 'chinese', grade: 5, icon: '📜', question: '补全：锄禾日当午，_____________。', solution: '汗滴禾下土', errorTip: '注意每个字的写法' },
        { id: 'g5c9', title: '修辞手法辨析', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '🎨', question: '判断：太阳像一个大火球。', solution: '比喻', errorTip: '用像连接，本体和喻体' },
        { id: 'g5c10', title: '关联词使用', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '🔗', question: '用恰当的关联词：____下雨，____不去公园。', solution: '因为...所以...', errorTip: '因果关系' },
        { id: 'g5c11', title: '缩句练习', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '✂️', question: '缩句：活泼的小明在操场上欢快地跑步。', solution: '小明跑步。', errorTip: '保留主语和谓语' },
        { id: 'g5c12', title: '比喻句仿写', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '✍️', question: '仿写比喻句：月亮像什么？', solution: '月亮像弯弯的小船。', errorTip: '用恰当的喻体' },
        { id: 'g5c13', title: '词语感情色彩', difficulty: '基础', subject: 'chinese', grade: 5, icon: '💭', question: '足智多谋是褒义还是贬义？', solution: '褒义词', errorTip: '形容人聪明' },
        { id: 'g5c14', title: '句子排序', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '🔢', question: '把句子整理成一段通顺的话', solution: '按事情发展顺序排列', errorTip: '找准时间顺序' },
        { id: 'g5c15', title: '修改病句', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '✏️', question: '修改：春天的花园里开满了五颜六色的红花。', solution: '春天的花园里开满了五颜六色的花。', errorTip: '五颜六色和红花矛盾' },
        { id: 'g5c16', title: '古文理解', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '📜', question: '《守株待兔》告诉我们什么道理？', solution: '不要存有侥幸心理', errorTip: '联系故事内容' },
        { id: 'g5c17', title: '朗读重音', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '🔊', question: '朗读时重音应在不知道上的是哪句？', solution: '我不知道他是什么时候来的', errorTip: '根据句子意思' },
        { id: 'g5c18', title: '标点符号', difficulty: '基础', subject: 'chinese', grade: 5, icon: '✏️', question: '给句子加标点：你喜欢数学吗喜欢', solution: '你喜欢数学吗？喜欢！', errorTip: '问句用问号' },
        { id: 'g5c19', title: '人物描写方法', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '👤', question: '判断：她长着一双大大的眼睛。', solution: '外貌描写', errorTip: '描写外在特征' },
        { id: 'g5c20', title: '段落层次', difficulty: '进阶', subject: 'chinese', grade: 5, icon: '📑', question: '划分段落层次的方法有哪些？', solution: '时间顺序、事情发展顺序', errorTip: '根据内容选择' },
        { id: 'g5c21', title: '作文选材', difficulty: '基础', subject: 'chinese', grade: 5, icon: '✍️', question: '以我最熟悉的人为题，选择一个事例。', solution: '选取典型事例', errorTip: '选择有意义的事' }
    ]
    // 五年级 - 英语7题
    grade5_english: [
        { id: 'g5e1', title: '基数词转化', difficulty: '基础', subject: 'english', grade: 5, icon: '🔢', question: '将数字写成英语：15', solution: 'fifteen', errorTip: '13-19以teen结尾' },
        { id: 'g5e2', title: '一般现在时', difficulty: '基础', subject: 'english', grade: 5, icon: '⏰', question: '用动词适当形式填空：She (like) apples.', solution: 'She likes apples.', errorTip: '第三人称单数动词加s' },
        { id: 'g5e3', title: '人称代词', difficulty: '基础', subject: 'english', grade: 5, icon: '👤', question: '写出对应的人称代词：I → my → me', solution: 'I-my-me; you-your-you; he-his-him', errorTip: '主格、形容词性物主代词、宾语' },
        { id: 'g5e4', title: '方位介词', difficulty: '基础', subject: 'english', grade: 5, icon: '🧭', question: '选择介词：The book is (in/on/to) the table.', solution: 'The book is on the table.', errorTip: 'in在...里面，on在...上面' },
        { id: 'g5e5', title: '情景交际', difficulty: '进阶', subject: 'english', grade: 5, icon: '💬', question: '当你表示感谢时应该说：', solution: 'Thank you! / Thanks!', errorTip: '根据场景选择合适的表达' },
        { id: 'g5e6', title: '名词单复数', difficulty: '基础', subject: 'english', grade: 5, icon: '📦', question: '写出复数形式：child →', solution: 'children', errorTip: '有些不规则变化需要特殊记忆' },
        { id: 'g5e7', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 5, icon: '📖', question: '阅读短文，判断正误：Tom has three apples. He eats one. How many apples are left?', solution: 'Three minus one equals two. Two apples are left.', errorTip: '理解关键词ate(eat)和left' },
        { id: 'g5e8', title: '序数词', difficulty: '基础', subject: 'english', grade: 5, icon: '🔢', question: '写出4和5的序数词', solution: 'fourth, fifth', errorTip: '注意特殊的序数词' },
        { id: 'g5e9', title: 'be动词否定', difficulty: '基础', subject: 'english', grade: 5, icon: '❌', question: '改为否定句：I am a teacher.', solution: 'I am not a teacher.', errorTip: 'be动词加not' },
        { id: 'g5e10', title: '特殊疑问句', difficulty: '进阶', subject: 'english', grade: 5, icon: '❓', question: '提问：The book is on the desk. 对地点提问', solution: 'Where is the book?', errorTip: '询问地点用where' },
        { id: 'g5e11', title: '时态判断', difficulty: '进阶', subject: 'english', grade: 5, icon: '⏰', question: '判断：She goes to school every day.', solution: '一般现在时', errorTip: 'every day表示经常' },
        { id: 'g5e12', title: '祈使句', difficulty: '基础', subject: 'english', grade: 5, icon: '📢', question: '改祈使句：You should be quiet.', solution: 'Be quiet!', errorTip: '动词原形开头' },
        { id: 'g5e13', title: 'there be句型', difficulty: '进阶', subject: 'english', grade: 5, icon: '🏠', question: '填空：_____ some water in the glass.', solution: 'There is', errorTip: 'water是不可数名词' },
        { id: 'g5e14', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 5, icon: '📖', question: '阅读短文，完成选择题', solution: '仔细阅读原文', errorTip: '先看题目再读文章' },
        { id: 'g5e15', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 5, icon: '📝', question: '完形填空练习', solution: '联系上下文', errorTip: '先通读全文' },
        { id: 'g5e16', title: '字母大小写', difficulty: '基础', subject: 'english', grade: 5, icon: '🔤', question: '改错：my name is li ming.', solution: 'My name is Li Ming.', errorTip: '句首和专有名词大写' },
        { id: 'g5e17', title: '同义词替换', difficulty: '进阶', subject: 'english', grade: 5, icon: '🔄', question: '写出big的同义词', solution: 'large', errorTip: 'big和large都表示大' },
        { id: 'g5e18', title: '对话交际', difficulty: '进阶', subject: 'english', grade: 5, icon: '💬', question: '选择：What is the weather like today?', solution: 'It is sunny.', errorTip: '询问天气' },
        { id: 'g5e19', title: '方位词', difficulty: '基础', subject: 'english', grade: 5, icon: '🧭', question: '在桌子上面用哪个介词？', solution: 'on', errorTip: 'on表示在...上面' },
        { id: 'g5e20', title: '形容词物主代词', difficulty: '基础', subject: 'english', grade: 5, icon: '👤', question: '写出：I → ____', solution: 'my', errorTip: '放在名词前' },
        { id: 'g5e21', title: '看图写话', difficulty: '进阶', subject: 'english', grade: 5, icon: '✍️', question: '看图写一个完整的句子', solution: 'This is my family.', errorTip: '注意句子完整性' }
    ]
    // 六年级 - 数学7题
    grade6_math: [
        { id: 'g6m1', title: '分数乘法', difficulty: '基础', subject: 'math', grade: 6, icon: '🔢', question: '计算：2/3 × 6 = ?', solution: '2/3 × 6 = 12/3 = 4', errorTip: '分子与整数相乘，分母不变' },
        { id: 'g6m2', title: '分数除法', difficulty: '基础', subject: 'math', grade: 6, icon: '➗', question: '计算：4 ÷ 2/5 = ?', solution: '4 ÷ 2/5 = 4 × 5/2 = 10', errorTip: '除以一个数等于乘以它的倒数' },
        { id: 'g6m3', title: '比的应用', difficulty: '进阶', subject: 'math', grade: 6, icon: '📊', question: '甲乙两数比为3:5，乙数是20，甲数是多少？', solution: '每份=20÷5=4，甲=4×3=12', errorTip: '找准每份对应的数量' },
        { id: 'g6m4', title: '圆的周长', difficulty: '基础', subject: 'math', grade: 6, icon: '⭕', question: '圆的半径是5cm，周长是多少？', solution: 'C=2πr=2×3.14×5=31.4cm', errorTip: '公式C=2πr' },
        { id: 'g6m5', title: '圆的面积', difficulty: '进阶', subject: 'math', grade: 6, icon: '⭕', question: '圆的直径是8cm，面积是多少？', solution: 'r=4，S=πr²=3.14×16=50.24cm²', errorTip: '先求半径再算面积' },
        { id: 'g6m6', title: '百分数应用', difficulty: '进阶', subject: 'math', grade: 6, icon: '📈', question: '一件衣服原价200元，打八折后多少元？', solution: '200×0.8=160元', errorTip: '八折就是原价的80%' },
        { id: 'g6m7', title: '统计问题', difficulty: '基础', subject: 'math', grade: 6, icon: '📊', question: '六年级有200人，近视的有50人，近视率是多少？', solution: '50÷200×100%=25%', errorTip: '近视率=近视人数÷总人数×100%' },
        { id: 'g6m8', title: '比例基本性质', difficulty: '基础', subject: 'math', grade: 6, icon: '⚖️', question: '如果a:b=3:5，且b=10，则a=？', solution: 'a=6', errorTip: '外项之积=内项之积' },
        { id: 'g6m9', title: '正反比例', difficulty: '进阶', subject: 'math', grade: 6, icon: '📊', question: '速度一定，路程和时间成什么比例？', solution: '正比例', errorTip: '路程÷时间=速度不变' },
        { id: 'g6m10', title: '扇形统计图', difficulty: '进阶', subject: 'math', grade: 6, icon: '📈', question: '扇形统计图中，圆心角120度表示百分之几？', solution: '120÷360×100%≈33.3%', errorTip: '圆心角度数÷360度' },
        { id: 'g6m11', title: '圆柱体积', difficulty: '进阶', subject: 'math', grade: 6, icon: '📦', question: '圆柱底面半径2cm，高5cm，体积是多少？', solution: 'V=πr²h=3.14×4×5=62.8cm³', errorTip: '体积=底面积×高' },
        { id: 'g6m12', title: '圆锥体积', difficulty: '进阶', subject: 'math', grade: 6, icon: '🔻', question: '圆锥底面积12cm²，高9cm，体积是多少？', solution: 'V=1/3×12×9=36cm³', errorTip: '1/3×底面积×高' },
        { id: 'g6m13', title: '工程问题', difficulty: '压轴', subject: 'math', grade: 6, icon: '🏗️', question: '甲单独做10天完成，乙单独做15天完成，合作几天？', solution: '1÷(1/10+1/15)=6天', errorTip: '工作总量÷工作效率之和' },
        { id: 'g6m14', title: '浓度问题', difficulty: '压轴', subject: 'math', grade: 6, icon: '🧪', question: '50g盐溶在200g水中，盐水浓度是多少？', solution: '50÷250×100%=20%', errorTip: '溶质÷溶液×100%' },
        { id: 'g6m15', title: '经济问题', difficulty: '压轴', subject: 'math', grade: 6, icon: '💰', question: '商品进价100元，标价150元，获利25%，打了几折？', solution: '设打x折：150×x/10-100=25，x=8.3折', errorTip: '获利=售价-进价' },
        { id: 'g6m16', title: '图形变换', difficulty: '进阶', subject: 'math', grade: 6, icon: '🔄', question: '把三角形按2:1放大后，面积扩大几倍？', solution: '4倍', errorTip: '面积比=相似比的平方' },
        { id: 'g6m17', title: '数论初步', difficulty: '进阶', subject: 'math', grade: 6, icon: '🔢', question: '一个数既是2的倍数又是3的倍数，它一定是几的倍数？', solution: '6', errorTip: '2和3的最小公倍数是6' },
        { id: 'g6m18', title: '逻辑推理', difficulty: '压轴', subject: 'math', grade: 6, icon: '🧩', question: 'A比B高，B比C高，谁最高？', solution: 'A最高', errorTip: '利用不等式传递性' },
        { id: 'g6m19', title: '探索规律', difficulty: '进阶', subject: 'math', grade: 6, icon: '🔍', question: '观察数列找规律：2, 6, 12, 20, ?', solution: '30（差值为4,6,8,10）', errorTip: '找相邻两数的差' },
        { id: 'g6m20', title: '体积单位换算', difficulty: '基础', subject: 'math', grade: 6, icon: '📏', question: '5升=_____毫升', solution: '5000毫升', errorTip: '1升=1000毫升' },
        { id: 'g6m21', title: '综合应用', difficulty: '压轴', subject: 'math', grade: 6, icon: '📝', question: '鱼缸长8dm，宽5dm，高4dm，水深3dm，放石头后水面升至3.5dm，石头体积？', solution: '8×5×(3.5-3)=20dm³', errorTip: '水位上升体积=石头体积' }
    ]
    // 六年级 - 语文7题
    grade6_chinese: [
        { id: 'g6c1', title: '文言文理解', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📜', question: '《两小儿辩日》中，两个小孩争论的问题是什么？', solution: '太阳在早晨和中午离地球的远近问题', errorTip: '仔细阅读课文内容' },
        { id: 'g6c2', title: '古诗鉴赏', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🎋', question: '《草原》一文中"在天底下，一碧千里，而并不茫茫"描写了什么？', solution: '描写了草原碧绿广袤、一望无际的景色', errorTip: '抓住关键词"一碧千里""茫茫"' },
        { id: 'g6c3', title: '说明方法', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📝', question: '分析句子使用的说明方法：这座塔高约26米，有二十层楼那么高。', solution: '用了列数字和作比较的说明方法', errorTip: '找具体的数字和比较对象' },
        { id: 'g6c4', title: '病句修改', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '✏️', question: '修改病句：经过努力，我终于克服了困难。', solution: '正确（无错误）', errorTip: '检查主谓宾是否完整' },
        { id: 'g6c5', title: '课文理解', difficulty: '基础', subject: 'chinese', grade: 6, icon: '📖', question: '《草原》的作者是谁？', solution: '老舍', errorTip: '著名作家的代表作要记牢' },
        { id: 'g6c6', title: '句式转换', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🔄', question: '将陈述句改为反问句：这本书很好看。', solution: '这本书难道不好看吗？', errorTip: '加上"难道...吗？"或"怎么...呢？"' },
        { id: 'g6c7', title: '作文结尾', difficulty: '基础', subject: 'chinese', grade: 6, icon: '✍️', question: '以"感谢"为题，写一个结尾。', solution: '这件事让我明白了...我要感谢...因为他们让我学会了...', errorTip: '结尾要总结全文，点明中心' },
        { id: 'g6c8', title: '文言文翻译', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📜', question: '翻译：温故而知新，可以为师矣。', solution: '复习旧知识获得新理解，可以成为老师', errorTip: '理解重点字词' },
        { id: 'g6c9', title: '古诗理解', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🎋', question: '《春夜喜雨》中潜是什么意思？', solution: '悄悄地、不知不觉地', errorTip: '形容春雨细密无声' },
        { id: 'g6c10', title: '说明方法辨析', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📝', question: '分析：这座桥长约50米，相当于十五层楼高。', solution: '列数字、作比较', errorTip: '具体数字和比较同时' },
        { id: 'g6c11', title: '记叙顺序', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🔢', question: '《北京的春节》采用的记叙顺序是什么？', solution: '时间顺序', errorTip: '按时间先后叙述' },
        { id: 'g6c12', title: '概括段意', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📑', question: '概括段落大意的方法有哪些？', solution: '找中心句、层意合并、要素归纳', errorTip: '抓住主要内容' },
        { id: 'g6c13', title: '人物描写', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '👤', question: '分析：他的眼睛里闪着光，嘴角挂着微笑。', solution: '神态描写', errorTip: '描写人物表情神色' },
        { id: 'g6c14', title: '标点符号作用', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '✏️', question: '破折号作用：声音响亮而清脆——简直震耳。', solution: '声音的延续', errorTip: '破折号表示声音延长' },
        { id: 'g6c15', title: '修辞手法', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🎨', question: '判断：改革的春风吹遍了祖国大地。', solution: '拟人', errorTip: '把春风当作人写' },
        { id: 'g6c16', title: '文章标题含义', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '📖', question: '《藏戏》这个标题有什么含义？', solution: '西藏地区的戏曲艺术', errorTip: '理解深层含义' },
        { id: 'g6c17', title: '写作顺序', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '✍️', question: '写一件有意义的事，按什么顺序写？', solution: '事情发展顺序：起因→经过→结果', errorTip: '写清来龙去脉' },
        { id: 'g6c18', title: '古文朗读', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🔊', question: '朗读文言文时应该注意什么？', solution: '注意停顿，读准字音', errorTip: '读出节奏和韵味' },
        { id: 'g6c19', title: '词义辨析', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '🔤', question: '观察和观看有什么区别？', solution: '观察侧重仔细看并思考', errorTip: '观察有思考的成分' },
        { id: 'g6c20', title: '句子仿写', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '✍️', question: '仿写：爱是冬日里的一缕阳光。', solution: '爱是沙漠里的一泓清泉。', errorTip: '用比喻表达' },
        { id: 'g6c21', title: '作文结尾', difficulty: '进阶', subject: 'chinese', grade: 6, icon: '✍️', question: '以童年为题，写一个结尾。', solution: '童年像一本画册...', errorTip: '总结全文升华主题' }
    ]
    // 六年级 - 英语7题
    grade6_english: [
        { id: 'g6e1', title: '现在进行时', difficulty: '基础', subject: 'english', grade: 6, icon: '⏰', question: '用现在分词形式填空：Look! The children (play) games.', solution: 'The children are playing games.', errorTip: '现在进行时：be+doing' },
        { id: 'g6e2', title: '过去式变化', difficulty: '基础', subject: 'english', grade: 6, icon: '⏪', question: '写出过去式：go →', solution: 'went', errorTip: '不规则动词要特殊记忆' },
        { id: 'g6e3', title: 'there be句型', difficulty: '基础', subject: 'english', grade: 6, icon: '🏠', question: '用there is/are填空：_____ a book and two pens on the desk.', solution: 'There is a book and two pens on the desk.', errorTip: 'there be就近原则' },
        { id: 'g6e4', title: '情态动词', difficulty: '进阶', subject: 'english', grade: 6, icon: '💪', question: '选择正确的情态动词：You (can/must) swim. It is dangerous.', solution: 'You must not swim. / You cant swim.', errorTip: 'must not表示禁止' },
        { id: 'g6e5', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 6, icon: '📖', question: '阅读理解：My father works in a hospital. He helps sick people. What does your father do?', solution: 'My father is a doctor.', errorTip: '从文章中提取关键信息' },
        { id: 'g6e6', title: '特殊疑问词', difficulty: '基础', subject: 'english', grade: 6, icon: '❓', question: '填空：_____ does your mother go to work? - By bus.', solution: 'How does your mother go to work?', errorTip: 'by bus提问用how' },
        { id: 'g6e7', title: '写作训练', difficulty: '进阶', subject: 'english', grade: 6, icon: '✍️', question: '用英语写一句介绍自己朋友的句子。', solution: 'My friend Tom is tall and friendly. He likes playing football.', errorTip: '注意人称一致和时态' },
        { id: 'g6e8', title: '时态综合', difficulty: '进阶', subject: 'english', grade: 6, icon: '⏰', question: '填空：Look! The birds (fly) in the sky.', solution: 'are flying', errorTip: 'look表明正在发生' },
        { id: 'g6e9', title: '阅读策略', difficulty: '进阶', subject: 'english', grade: 6, icon: '📖', question: '阅读短文，找出文章的主旨大意。', solution: '关注首尾段落和关键词', errorTip: '主旨通常在开头或结尾' },
        { id: 'g6e10', title: '语法选择', difficulty: '进阶', subject: 'english', grade: 6, icon: '❓', question: '选择：There (is/are) a pen and two books.', solution: 'There is', errorTip: '就近原则' },
        { id: 'g6e11', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 6, icon: '📝', question: '完形填空：I usually go to school _______ bike.', solution: 'by', errorTip: 'by+交通工具' },
        { id: 'g6e12', title: '句型转换', difficulty: '进阶', subject: 'english', grade: 6, icon: '🔄', question: '改为一般疑问句：He can speak English.', solution: 'Can he speak English?', errorTip: 'can提前首字母大写' },
        { id: 'g6e13', title: '阅读判断', difficulty: '进阶', subject: 'english', grade: 6, icon: '✅', question: '阅读短文，判断True或False。', solution: '有据可查', errorTip: '仔细阅读对照' },
        { id: 'g6e14', title: '情景对话', difficulty: '进阶', subject: 'english', grade: 6, icon: '💬', question: '选择：How was your weekend?', solution: 'It was great.', errorTip: '根据语境选择' },
        { id: 'g6e15', title: '词形变换', difficulty: '进阶', subject: 'english', grade: 6, icon: '🔤', question: '写出名词复数：leaf →', solution: 'leaves', errorTip: 'f/fe结尾变-ves' },
        { id: 'g6e16', title: '阅读排序', difficulty: '进阶', subject: 'english', grade: 6, icon: '🔢', question: '根据短文内容重新排列句子顺序。', solution: '找时间词和逻辑关系', errorTip: '理解文章脉络' },
        { id: 'g6e17', title: '写作训练', difficulty: '进阶', subject: 'english', grade: 6, icon: '✍️', question: '写一篇关于你朋友的小短文（至少5句话）。', solution: 'My friend is... He likes...', errorTip: '包含基本信息爱好' },
        { id: 'g6e18', title: '连词成句', difficulty: '基础', subject: 'english', grade: 6, icon: '🔗', question: '连词成句：to/go/school/I/usually/by/bus', solution: 'I usually go to school by bus.', errorTip: '按正确语序排列' },
        { id: 'g6e19', title: '语音辨析', difficulty: '基础', subject: 'english', grade: 6, icon: '🔊', question: '选出读音不同的：read meat tea bread', solution: 'bread（ea发/e/）', errorTip: 'bread的ea发/e/' },
        { id: 'g6e20', title: '介词填空', difficulty: '进阶', subject: 'english', grade: 6, icon: '🧭', question: '填空：The cat is _______ the table.', solution: 'under', errorTip: 'under表示在...下面' },
        { id: 'g6e21', title: '阅读匹配', difficulty: '进阶', subject: 'english', grade: 6, icon: '📖', question: '阅读短文，选择正确的答案。', solution: '先看问题带问题读短文', errorTip: '找关键词定位' }
    ]
    // 初一 - 数学7题
    grade7_math: [
        { id: 'g7m1', title: '有理数加法', difficulty: '基础', subject: 'math', grade: 7, icon: '➕', question: '计算：(-3) + (+7) = ?', solution: '(-3) + (+7) = +4', errorTip: '异号相加，取绝对值大的符号' },
        { id: 'g7m2', title: '一元一次方程', difficulty: '基础', subject: 'math', grade: 7, icon: '❓', question: '解方程：2x + 5 = 13', solution: '2x = 13 - 5 = 8, x = 8 ÷ 2 = 4', errorTip: '移项要变号' },
        { id: 'g7m3', title: '整式乘法', difficulty: '基础', subject: 'math', grade: 7, icon: '✖️', question: '计算：3a × 2b = ?', solution: '3a × 2b = 6ab', errorTip: '系数相乘，同底数幂相乘' },
        { id: 'g7m4', title: '角度计算', difficulty: '进阶', subject: 'math', grade: 7, icon: '📐', question: '如果∠A = 35°，∠B = 55°，∠A + ∠B = ?', solution: '∠A + ∠B = 35° + 55° = 90°', errorTip: '角度相加直接加数字' },
        { id: 'g7m5', title: '相交线与平行线', difficulty: '进阶', subject: 'math', grade: 7, icon: '📏', question: '如果两条直线相交，有一个角是90°，这两条直线叫什么？', solution: '互相垂直', errorTip: '垂直是相交的特殊情况' },
        { id: 'g7m6', title: '统计初步', difficulty: '基础', subject: 'math', grade: 7, icon: '📊', question: '数据2,3,3,4,5的众数是多少？', solution: '众数是3', errorTip: '众数是出现次数最多的数' },
        { id: 'g7m7', title: '一元一次方程应用', difficulty: '进阶', subject: 'math', grade: 7, icon: '📝', question: '小明买了3支笔和2本笔记本，共花了16元。已知笔每支3元，笔记本每本多少元？', solution: '设笔记本每本x元：3×3 + 2x = 16，解得x = 3.5元', errorTip: '找等量关系列方程' },
        { id: 'g7m8', title: '有理数混合运算', difficulty: '基础', subject: 'math', grade: 7, icon: '➕', question: '计算：(-2) × 3 - (-4) ÷ 2 = ?', solution: '-4', errorTip: '先乘除后加减，注意符号' },
        { id: 'g7m9', title: '绝对值', difficulty: '基础', subject: 'math', grade: 7, icon: '📏', question: '若|x|=5，则x=？', solution: 'x=5或x=-5', errorTip: '绝对值等于5的数有两个' },
        { id: 'g7m10', title: '一元一次方程', difficulty: '基础', subject: 'math', grade: 7, icon: '❓', question: '解方程：3(x-2)=12', solution: 'x=6', errorTip: '先展开括号，再移项' },
        { id: 'g7m11', title: '二元一次方程组', difficulty: '进阶', subject: 'math', grade: 7, icon: '📝', question: '解方程组：x+y=5, x-y=1', solution: 'x=3, y=2', errorTip: '代入法或加减消元法' },
        { id: 'g7m12', title: '线段计算', difficulty: '进阶', subject: 'math', grade: 7, icon: '📏', question: '点C是AB中点，AB=10cm，则BC=？', solution: 'BC=5cm', errorTip: '中点到两端距离相等' },
        { id: 'g7m13', title: '角度计算', difficulty: '进阶', subject: 'math', grade: 7, icon: '📐', question: '已知角A=35度，角B=55度，角C=？', solution: '角C=90度（三角形内角和）', errorTip: '三角形内角和180度' },
        { id: 'g7m14', title: '平行线判定', difficulty: '进阶', subject: 'math', grade: 7, icon: '📏', question: '同位角相等，两直线一定平行吗？', solution: '是', errorTip: '同位角相等是判定定理' },
        { id: 'g7m15', title: '乘法公式', difficulty: '进阶', subject: 'math', grade: 7, icon: '✖️', question: '计算：(a+2)(a-2) = ?', solution: 'a²-4', errorTip: '平方差公式' },
        { id: 'g7m16', title: '一元一次不等式', difficulty: '进阶', subject: 'math', grade: 7, icon: '⚖️', question: '解不等式：2x+3>7', solution: 'x>2', errorTip: '移项要变号' },
        { id: 'g7m17', title: '数据收集', difficulty: '基础', subject: 'math', grade: 7, icon: '📊', question: '调查全班同学最喜欢的科目，应用什么调查方式？', solution: '问卷调查', errorTip: '适合调查类的题目' },
        { id: 'g7m18', title: '频数分布', difficulty: '进阶', subject: 'math', grade: 7, icon: '📈', question: '频数=总数×____', solution: '频率', errorTip: '频数=总数×频率' },
        { id: 'g7m19', title: '垂线性质', difficulty: '基础', subject: 'math', grade: 7, icon: '📐', question: '过直线外一点，能画几条垂直于该直线的线？', solution: '一条', errorTip: '垂线的唯一性' },
        { id: 'g7m20', title: '余角补角', difficulty: '进阶', subject: 'math', grade: 7, icon: '📐', question: '一个角的余角是30度，这个角是多少度？', solution: '60度', errorTip: '余角相加90度' },
        { id: 'g7m21', title: '应用题', difficulty: '压轴', subject: 'math', grade: 7, icon: '📝', question: '某商店进价100元，标价150元，按标价出售可获利多少元？', solution: '150-100=50元', errorTip: '获利=售价-进价' }
    ]
    // 初一 - 语文7题
    grade7_chinese: [
        { id: 'g7c1', title: '文言文实词', difficulty: '基础', subject: 'chinese', grade: 7, icon: '📜', question: '《论语》中"学而时习之"的"时"是什么意思？', solution: '按时、经常', errorTip: '联系上下文理解' },
        { id: 'g7c2', title: '文言文句式', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📝', question: '判断句式特点：夫君子之行，静以修身，俭以养德。', solution: '判断句，用"者...也"判断（省略）', errorTip: '判断句表示某种身份或性质' },
        { id: 'g7c3', title: '记叙文阅读', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📖', question: '《散步》主要记叙了一件什么事？', solution: '一家人散步，面对走大路还是小路产生分歧，最终母亲改变主意走小路', errorTip: '抓住主要人物和事件' },
        { id: 'g7c4', title: '古诗词理解', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '🎋', question: '《天净沙·秋思》中"夕阳西下"的下一句是什么？', solution: '断肠人在天涯', errorTip: '这首元曲的经典名句' },
        { id: 'g7c5', title: '综合性学习', difficulty: '基础', subject: 'chinese', grade: 7, icon: '🔍', question: '请你为"我的语文生活"活动设计两个栏目。', solution: '如：优秀作文展、名著品读会、成语接龙等', errorTip: '结合语文学习和日常生活' },
        { id: 'g7c6', title: '病句修改', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '✏️', question: '修改病句：通过这次活动，使我明白了团结的重要性。', solution: '去掉"通过"或"使"，改为：这次活动，使我明白了... 或 通过这次活动，我明白了...', errorTip: '介词开头造成主语残缺' },
        { id: 'g7c7', title: '作文立意', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '💡', question: '以"成长"为话题，写一个作文立意。', solution: '立意：从失败中成长，在挫折中进步。选取一次考试失利后重新努力的经历。', errorTip: '立意要积极向上' },
        { id: 'g7c8', title: '文言文词汇', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📜', question: '《论语》中敏而好学的敏是什么意思？', solution: '勤勉', errorTip: '联系上下文理解' },
        { id: 'g7c9', title: '古诗鉴赏', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '🎋', question: '《观沧海》中表达了诗人怎样的情感？', solution: '宽广的胸怀和远大的抱负', errorTip: '借景抒情' },
        { id: 'g7c10', title: '记叙文六要素', difficulty: '基础', subject: 'chinese', grade: 7, icon: '📝', question: '记叙文的六要素是什么？', solution: '时间、地点、人物、起因、经过、结果', errorTip: '六要素缺一不可' },
        { id: 'g7c11', title: '人物描写方法', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '👤', question: '分析：他敏捷地爬上了树。', solution: '动作描写', errorTip: '描写人物的动作' },
        { id: 'g7c12', title: '句子成分', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📝', question: '划分句子成分：同学们认真听讲。', solution: '同学们认真听讲', errorTip: '主谓宾是基本成分' },
        { id: 'g7c13', title: '修辞手法', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '🎨', question: '判断修辞：他的声音像银铃一样清脆。', solution: '比喻', errorTip: '有本体、喻体、比喻词' },
        { id: 'g7c14', title: '说明文语言', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📝', question: '说明文的语言有什么特点？', solution: '准确性、严密性', errorTip: '用词准确' },
        { id: 'g7c15', title: '古文翻译', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📜', question: '翻译：学而不思则罔，思而不学则殆。', solution: '只学习不思考会迷惑，只思考不学习会有害', errorTip: '理解重点字词' },
        { id: 'g7c16', title: '文学常识', difficulty: '基础', subject: 'chinese', grade: 7, icon: '📚', question: '《朝花夕拾》的作者是谁？', solution: '鲁迅', errorTip: '鲁迅的散文集' },
        { id: 'g7c17', title: '标点符号', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '✏️', question: '给句子加标点：老师说这次考试小明成绩最好', solution: '老师说：这次考试，小明的成绩最好。', errorTip: '说话人在中间用逗号' },
        { id: 'g7c18', title: '段落结构', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '📑', question: '常见的段落结构有哪些？', solution: '总分式、分总式、总分总式', errorTip: '根据内容判断' },
        { id: 'g7c19', title: '写作手法', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '✍️', question: '《春》运用了什么写作手法？', solution: '比喻、拟人、排比', errorTip: '找出文中的修辞手法' },
        { id: 'g7c20', title: '线索作用', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '🔍', question: '记叙文的线索有什么作用？', solution: '贯穿全文，使结构严谨', errorTip: '把握文章脉络' },
        { id: 'g7c21', title: '作文选材', difficulty: '进阶', subject: 'chinese', grade: 7, icon: '✍️', question: '以温暖为话题，选择一个典型事例。', solution: '选择老师或父母关心自己的事例', errorTip: '选材要真实、典型' }
    ]
    // 初一 - 英语7题
    grade7_english: [
        { id: 'g7e1', title: 'be动词用法', difficulty: '基础', subject: 'english', grade: 7, icon: 'be', question: '填空：I _____ a student. She _____ a teacher.', solution: 'I am a student. She is a teacher.', errorTip: 'I用am，she/he/it用is' },
        { id: 'g7e2', title: '可数与不可数', difficulty: '基础', subject: 'english', grade: 7, icon: '📦', question: '判断并改错：I have many informations.', solution: 'information是不可数名词，不能用many修饰。改为：I have much information. 或 I have a lot of information.', errorTip: '可数名词用many/few修饰，不可数名词用much/little修饰' },
        { id: 'g7e3', title: '现在进行时', difficulty: '基础', subject: 'english', grade: 7, icon: '⏰', question: '用括号内动词的适当形式填空：The boys (play) basketball now.', solution: 'The boys are playing basketball now.', errorTip: '现在进行时结构：be + v-ing' },
        { id: 'g7e4', title: '祈使句', difficulty: '基础', subject: 'english', grade: 7, icon: '📢', question: '将下列句子改为否定祈使句：Close the door.', solution: "Don't close the door.", errorTip: "否定祈使句在动词前加Don't" },
        { id: 'g7e5', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 7, icon: '📖', question: '阅读短文：I have a good friend. Her name is Lily. She is 12 years old. She likes singing and dancing. She has long black hair.判断：Lily is 11 years old.', solution: '错误（FALSE），因为短文明确说She is 12 years old，而不是11岁', errorTip: '仔细对比原文信息' },
        { id: 'g7e6', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 7, icon: '📝', question: '完形填空：I usually get up _______ 6 oclock in the morning.', solution: 'at', errorTip: '在具体时间点前用at' },
        { id: 'g7e7', title: '书面表达', difficulty: '进阶', subject: 'english', grade: 7, icon: '✍️', question: '用英语写一段介绍你家庭的短文（至少5句话）。', solution: 'I have a happy family. There are four people in my family: my father, my mother, my sister and me. My father is a doctor. My mother is a teacher. My sister and I are students. We love each other very much.', errorTip: '注意时态和人称一致' }
    ]
};
    // 初二 - 数学7题
    grade8_math: [
        { id: 'g8m1', title: '全等三角形', difficulty: '进阶', subject: 'math', grade: 8, icon: '🔺', question: '在△ABC和△DEF中，AB=DE，BC=EF，CA=FD，则这两个三角形的关系是？', solution: '全等（SSS）', errorTip: '三边对应相等的两个三角形全等' },
        { id: 'g8m2', title: '勾股定理', difficulty: '基础', subject: 'math', grade: 8, icon: '📐', question: '直角三角形的两边长分别为3和4，斜边长是多少？', solution: '斜边=√(3²+4²)=5', errorTip: '直角三角形两直角边的平方和等于斜边的平方' },
        { id: 'g8m3', title: '一次函数', difficulty: '进阶', subject: 'math', grade: 8, icon: '📈', question: '一次函数y=2x+3，当x=4时，y等于多少？', solution: 'y=2×4+3=11', errorTip: '代入计算' },
        { id: 'g8m4', title: '因式分解', difficulty: '基础', subject: 'math', grade: 8, icon: '✖️', question: '分解因式：x²-9', solution: 'x²-9=(x+3)(x-3)', errorTip: '识别平方差公式' },
        { id: 'g8m5', title: '分式运算', difficulty: '进阶', subject: 'math', grade: 8, icon: '➗', question: '计算：x/2 ÷ x/4 = ?', solution: 'x/2 ÷ x/4 = x/2 × 4/x = 2', errorTip: '除以一个分式等于乘以它的倒数' },
        { id: 'g8m6', title: '平行四边形', difficulty: '进阶', subject: 'math', grade: 8, icon: '📐', question: '平行四边形的对角线有什么特点？', solution: '互相平分', errorTip: '平行四边形的对角线互相平分' },
        { id: 'g8m7', title: '数据分析', difficulty: '基础', subject: 'math', grade: 8, icon: '📊', question: '数据2,3,3,4,5,6的平均数是多少？', solution: '(2+3+3+4+5+6)÷6=23÷6≈3.83', errorTip: '平均数=总和÷个数' },
        { id: 'g7e8', title: '名词所有格', difficulty: '进阶', subject: 'english', grade: 7, icon: '📝', question: '写出：Lucy's bag', solution: 'Lucy's bag', errorTip: ''s所有格用于有生命的物体' },
        { id: 'g7e9', title: '情态动词', difficulty: '进阶', subject: 'english', grade: 7, icon: '💪', question: '选择：You (must/can) finish your homework first.', solution: 'must', errorTip: 'must表示必须' },
        { id: 'g7e10', title: '宾语从句', difficulty: '进阶', subject: 'english', grade: 7, icon: '🔗', question: '改为宾语从句：I think. He is a teacher.', solution: 'I think he is a teacher.', errorTip: '连接成复合句' },
        { id: 'g7e11', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 7, icon: '📖', question: '阅读短文，完成表格。', solution: '仔细阅读提取关键信息', errorTip: '注意细节' },
        { id: 'g7e12', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 7, icon: '📝', question: '完形填空练习，注意上下文连贯。', solution: '通读全文理解大意', errorTip: '瞻前顾后' },
        { id: 'g7e13', title: '阅读回答', difficulty: '进阶', subject: 'english', grade: 7, icon: '❓', question: '阅读短文，回答问题。', solution: '用完整句子回答', errorTip: '问什么答什么' },
        { id: 'g7e14', title: '语法选择', difficulty: '进阶', subject: 'english', grade: 7, icon: '❓', question: '选择正确的介词：The boy is sitting ____ the tree.', solution: 'under', errorTip: 'under表示在...下面' },
        { id: 'g7e15', title: '词汇运用', difficulty: '进阶', subject: 'english', grade: 7, icon: '🔤', question: '用所给词的适当形式填空：She ____ (sing) every day.', solution: 'sings', errorTip: 'every day用一般现在时' },
        { id: 'g7e16', title: '阅读判断', difficulty: '进阶', subject: 'english', grade: 7, icon: '✅', question: '阅读短文，判断句子正误。', solution: '有据可查', errorTip: '原文依据' },
        { id: 'g7e17', title: '书面表达', difficulty: '进阶', subject: 'english', grade: 7, icon: '✍️', question: '写一封简短的英文邮件给老师。', solution: 'Dear Teacher, I am writing to...', errorTip: '注意邮件格式' },
        { id: 'g7e18', title: '语音辨析', difficulty: '基础', subject: 'english', grade: 7, icon: '🔊', question: '选出画线部分读音不同的：cake make name grade', solution: 'name中a发/eɪ/', errorTip: '检查画线部分' },
        { id: 'g7e19', title: '情景交际', difficulty: '进阶', subject: 'english', grade: 7, icon: '💬', question: '选择合适的应答：Nice to meet you!', solution: 'Nice to meet you too!', errorTip: '相同情景用语' },
        { id: 'g7e20', title: '阅读匹配', difficulty: '进阶', subject: 'english', grade: 7, icon: '📖', question: '将人物与信息匹配。', solution: '仔细阅读找到对应关系', errorTip: '找关键词' },
        { id: 'g7e21', title: '写作练习', difficulty: '进阶', subject: 'english', grade: 7, icon: '✍️', question: '用英语介绍自己的一天（至少8句话）。', solution: 'I get up at... I have breakfast...', errorTip: '按时间顺序写' }
    ]
    // 初二 - 语文7题
    grade8_chinese: [
        { id: 'g8c1', title: '文言文词汇', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📜', question: '《愚公移山》中"聚室而谋曰"中"室"的意思是什么？', solution: '家人', errorTip: '联系上下文理解' },
        { id: 'g8c2', title: '说明文阅读', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📖', question: '说明文按照说明对象可分为哪两类？', solution: '事物说明文和事理说明文', errorTip: '事物说明文说明事物的特征，事理说明文解释事理' },
        { id: 'g8c3', title: '古诗词鉴赏', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '🎋', question: '《春望》中"感时花溅泪，恨别鸟惊心"表达了诗人怎样的情感？', solution: '表达了诗人对战乱的痛恨和对家人的思念', errorTip: '结合写作背景理解' },
        { id: 'g8c4', title: '记叙文线索', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📝', question: '记叙文的线索有哪些类型？', solution: '以人物、事件、事物、时间、地点、感情为线索', errorTip: '线索是贯穿全文的脉络' },
        { id: 'g8c5', title: '议论文论证', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '💡', question: '《生于忧患，死于安乐》中主要运用了什么论证方法？', solution: '举例论证（列举六个历史人物）', errorTip: '分析文章内容和结构' },
        { id: 'g8c6', title: '语法知识', difficulty: '基础', subject: 'chinese', grade: 8, icon: '🔤', question: '"他的病一天一天好起来"中"一天一天"是什么短语类型？', solution: '并列短语', errorTip: '分析词语之间的结构关系' },
        { id: 'g8c7', title: '作文技巧', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '✍️', question: '如何写好一件事的作文？', solution: '1.选材要典型 2.叙事要完整 3.描写要细腻 4.中心要明确', errorTip: '叙事类作文要突出重点' },
        { id: 'g8m8', title: '全等三角形判定', difficulty: '进阶', subject: 'math', grade: 8, icon: '🔺', question: '判断：有两边和夹角相等的两个三角形全等吗？', solution: '全等（SAS）', errorTip: '两边及其夹角' },
        { id: 'g8m9', title: '等腰三角形', difficulty: '进阶', subject: 'math', grade: 8, icon: '📐', question: '等腰三角形顶角是40度，底角是多少度？', solution: '(180度-40度)÷2=70度', errorTip: '等边对等角' },
        { id: 'g8m10', title: '一次函数图像', difficulty: '进阶', subject: 'math', grade: 8, icon: '📈', question: '一次函数y=-2x+3，y随x增大而____？', solution: '减小', errorTip: 'k<0时y随x增大而减小' },
        { id: 'g8m11', title: '一次函数交点', difficulty: '进阶', subject: 'math', grade: 8, icon: '📊', question: '求直线y=2x+1和y=x-2的交点坐标', solution: '联立方程：(3,-5)', errorTip: '解方程组' },
        { id: 'g8m12', title: '因式分解', difficulty: '进阶', subject: 'math', grade: 8, icon: '✖️', question: '分解因式：x²+5x+6', solution: '(x+2)(x+3)', errorTip: '十字相乘法' },
        { id: 'g8m13', title: '分式方程', difficulty: '进阶', subject: 'math', grade: 8, icon: '➗', question: '解分式方程：1/x + 1/(x+1) = 2', solution: 'x=0.5', errorTip: '去分母化为整式方程' },
        { id: 'g8m14', title: '平行四边形判定', difficulty: '进阶', subject: 'math', grade: 8, icon: '📐', question: '平行四边形的判定定理有哪些？', solution: '两组对边分别平行/相等/互相平分', errorTip: '根据条件选择' },
        { id: 'g8m15', title: '菱形性质', difficulty: '进阶', subject: 'math', grade: 8, icon: '🔷', question: '菱形的两条对角线长分别是6cm和8cm，边长是多少？', solution: '边长=5cm（勾股定理）', errorTip: '菱形对角线互相垂直' },
        { id: 'g8m16', title: '方差计算', difficulty: '基础', subject: 'math', grade: 8, icon: '📊', question: '计算数据2,4,6,8的方差', solution: '方差=5', errorTip: '方差=平均数的平方差的平均值' },
        { id: 'g8m17', title: '中位数众数', difficulty: '基础', subject: 'math', grade: 8, icon: '📈', question: '数据3,5,7,5,9的中位数和众数分别是？', solution: '中位数5，众数5', errorTip: '中位数是中间值，众数是出现最多的' },
        { id: 'g8m18', title: '分式乘除', difficulty: '进阶', subject: 'math', grade: 8, icon: '➗', question: '计算：x/y ÷ x²/y² = ?', solution: 'y/x', errorTip: '除以一个分式等于乘以倒数' },
        { id: 'g8m19', title: '三角形内角和', difficulty: '进阶', subject: 'math', grade: 8, icon: '📐', question: '直角三角形的两个锐角有什么关系？', solution: '和为90度', errorTip: '直角三角形两锐角互余' },
        { id: 'g8m20', title: '变量关系', difficulty: '进阶', subject: 'math', grade: 8, icon: '📊', question: '判断：圆的面积与半径成正比例吗？', solution: '不是正比例，是平方关系', errorTip: '面积=πr²' },
        { id: 'g8m21', title: '综合应用', difficulty: '压轴', subject: 'math', grade: 8, icon: '📝', question: '某商品进价200元，标价300元，打折销售后获利50元，打了几折？', solution: '设打x折：300×x/10-200=50，x=8.3折', errorTip: '获利=售价-进价' }
    ]
    // 初二 - 英语7题
    grade8_english: [
        { id: 'g8e1', title: '过去进行时', difficulty: '进阶', subject: 'english', grade: 8, icon: '⏰', question: '用动词适当形式填空：I (read) a book at 8 last night.', solution: 'I was reading a book at 8 last night.', errorTip: '过去进行时：was/were + doing' },
        { id: 'g8e2', title: '状语从句', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔗', question: '用if从句填空：If it _____(rain) tomorrow, I will stay at home.', solution: 'If it rains tomorrow, I will stay at home.', errorTip: '主将从现：if引导的条件状语从句' },
        { id: 'g8e3', title: '被动语态', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔄', question: '改为被动语态：They clean the classroom every day.', solution: 'The classroom is cleaned every day.', errorTip: '一般现在时的被动语态：be + 过去分词' },
        { id: 'g8e4', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 8, icon: '📖', question: '阅读理解技巧：如何快速找到文章主旨？', solution: '关注文章的首段和末段，找反复出现的关键词', errorTip: '主旨通常在开头或结尾' },
        { id: 'g8e5', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 8, icon: '📝', question: '完形填空：The man is too tired to walk _____.', solution: 'any further / any more', errorTip: 'too...to...表示太...而不能...' },
        { id: 'g8e6', title: '词汇运用', difficulty: '基础', subject: 'english', grade: 8, icon: '📝', question: '用所给词的适当形式填空：His _____(grow) up. He is a _____(grow) man now.', solution: 'His is grown up. He is a growing man now.', errorTip: '注意词性变化' },
        { id: 'g8e7', title: '写作训练', difficulty: '进阶', subject: 'english', grade: 8, icon: '✍️', question: '写一封感谢信，感谢老师的教导。', solution: 'Dear Teacher, Thank you for teaching me so patiently...', errorTip: '注意书信格式' },
        { id: 'g8c8', title: '文言文实词', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📜', question: '《愚公移山》中毕力平险的毕是什么意思？', solution: '竭尽、全部', errorTip: '联系上下文理解' },
        { id: 'g8c9', title: '说明方法', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📝', question: '判断说明方法：恐托付不效（出自《出师表》）', solution: '介词结构后置', errorTip: '文言文句式' },
        { id: 'g8c10', title: '古诗词鉴赏', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '🎋', question: '《使至塞上》中大漠孤烟直写了怎样的意境？', solution: '雄浑壮阔的塞外风光', errorTip: '借景抒情' },
        { id: 'g8c11', title: '议论文论证', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '💡', question: '举例论证的作用是什么？', solution: '增强说服力', errorTip: '用具体事例证明观点' },
        { id: 'g8c12', title: '说明顺序', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📝', question: '说明文的说明顺序有哪些？', solution: '时间顺序、空间顺序、逻辑顺序', errorTip: '根据说明对象选择' },
        { id: 'g8c13', title: '记叙文描写', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '✍️', question: '分析描写方法：他弯下腰，捡起地上的纸屑。', solution: '动作描写', errorTip: '描写人物的具体动作' },
        { id: 'g8c14', title: '文言文翻译', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📜', question: '翻译：潭中鱼可百许头，皆若空游无所依。', solution: '潭中的鱼大约有上百条，都像在空中游动', errorTip: '理解重点词语' },
        { id: 'g8c15', title: '古诗意境', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '🎋', question: '《望岳》中会当凌绝顶表达了诗人怎样的情感？', solution: '不怕困难、敢于攀登的雄心壮志', errorTip: '借景抒情' },
        { id: 'g8c16', title: '小说人物', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📖', question: '小说中刻画人物的方法有哪些？', solution: '语言描写、动作描写、心理描写等', errorTip: '多种方法结合' },
        { id: 'g8c17', title: '语法知识', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '🔤', question: '短语类型有哪些？', solution: '并列短语、偏正短语、动宾短语、主谓短语等', errorTip: '分析词语结构' },
        { id: 'g8c18', title: '文章结构', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '📑', question: '总分总的文章结构有什么特点？', solution: '开头总起、中间分述、结尾总结', errorTip: '首尾呼应' },
        { id: 'g8c19', title: '写作技巧', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '✍️', question: '如何写好开头？', solution: '开门见山、设置悬念、引用名言等', errorTip: '开头要吸引读者' },
        { id: 'g8c20', title: '古文朗读', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '🔊', question: '朗读《核舟记》时应注意什么？', solution: '注意停顿，读出节奏', errorTip: '朗读要有韵味' },
        { id: 'g8c21', title: '作文结尾', difficulty: '进阶', subject: 'chinese', grade: 8, icon: '✍️', question: '如何写一个有深度的结尾？', solution: '总结全文，点明中心，升华主题', errorTip: '首尾呼应' }
    ]
    // 初二 - 物理7题
    grade8_physics: [
        { id: 'g8p1', title: '速度计算', difficulty: '基础', subject: 'physics', grade: 8, icon: '⚡', question: '小明步行速度为1.2m/s，他走完600m需要多少秒？', solution: 't = s/v = 600 ÷ 1.2 = 500秒', errorTip: '速度公式：v = s/t' },
        { id: 'g8p2', title: '重力与质量', difficulty: '基础', subject: 'physics', grade: 8, icon: '🏋️', question: '一个物体质量为10kg，它受到的重力是多少？', solution: 'G = mg = 10 × 10 = 100N', errorTip: 'g取10N/kg' },
        { id: 'g8p3', title: '光的反射', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔦', question: '光线与镜面的夹角为30°，则反射角为多少度？', solution: '反射角 = 90° - 30° = 60°', errorTip: '反射角是光线与法线的夹角' },
        { id: 'g8p4', title: '声音传播', difficulty: '基础', subject: 'physics', grade: 8, icon: '🔊', question: '声音在15°C的空气中传播速度约为多少？', solution: '约340m/s', errorTip: '声音在空气中速度约340m/s' },
        { id: 'g8p5', title: '力的作用效果', difficulty: '基础', subject: 'physics', grade: 8, icon: '💪', question: '力可以产生哪两种作用效果？', solution: '改变物体的运动状态或使物体发生形变', errorTip: '力的作用效果包括运动状态改变和形变' },
        { id: 'g8p6', title: '凸透镜成像', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔍', question: '物体放在凸透镜2倍焦距以外，成的是什么像？', solution: '倒立、缩小的实像', errorTip: 'u>2f，成倒立缩小实像' },
        { id: 'g8p7', title: '机械能', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🎢', question: '动能和势能统称为什么能？', solution: '机械能', errorTip: '动能和势能统称机械能' },
        { id: 'g8e8', title: '现在完成时', difficulty: '进阶', subject: 'english', grade: 8, icon: '⏰', question: '用动词适当形式填空：I (see) that movie three times.', solution: 'have seen', errorTip: 'have/has+过去分词' },
        { id: 'g8e9', title: '现在完成时vs一般过去时', difficulty: '进阶', subject: 'english', grade: 8, icon: '⏰', question: '选择：I ____ to Beijing. 去过的/我去了北京', solution: 'have been', errorTip: '去过用have been to' },
        { id: 'g8e10', title: '宾语从句语序', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔗', question: '改为宾语从句：He asked. Does Tom like English?', solution: 'He asked if Tom liked English.', errorTip: '宾语从句用陈述语序' },
        { id: 'g8e11', title: '条件状语从句', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔗', question: '填空：If he ____ (come) tomorrow, I will tell him.', solution: 'comes', errorTip: '主将从现' },
        { id: 'g8e12', title: '被动语态综合', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔄', question: '改为被动语态：They built this house in 2020.', solution: 'This house was built in 2020.', errorTip: 'be+过去分词' },
        { id: 'g8e13', title: '阅读理解推理', difficulty: '进阶', subject: 'english', grade: 8, icon: '📖', question: '阅读推断：What can we infer from the passage?', solution: '从文中信息推断', errorTip: '不能直接找到答案' },
        { id: 'g8e14', title: '完形填空技巧', difficulty: '进阶', subject: 'english', grade: 8, icon: '📝', question: '完形填空：There is a girl. She is ____ years old.', solution: '十二三（根据上下文）', errorTip: '联系上下文' },
        { id: 'g8e15', title: '词性转换', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔤', question: '用所给词适当形式填空：The news is very ____ (excite).', solution: 'exciting', errorTip: '-ing修饰物，-ed修饰人' },
        { id: 'g8e16', title: '阅读主旨', difficulty: '进阶', subject: 'english', grade: 8, icon: '📖', question: 'What is the main idea of the passage?', solution: '找出文章主题', errorTip: '关注首尾段落' },
        { id: 'g8e17', title: '写作技巧', difficulty: '进阶', subject: 'english', grade: 8, icon: '✍️', question: '写一封建议信的开头应该怎么写？', solution: 'I am writing to give you some suggestions...', errorTip: '开门见山表明目的' },
        { id: 'g8e18', title: '状语从句', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔗', question: '填空：I will call you as soon as he ____ (arrive).', solution: 'arrives', errorTip: '主将从现' },
        { id: 'g8e19', title: '复合句', difficulty: '进阶', subject: 'english', grade: 8, icon: '🔗', question: '合并句子：Tom is tall. Tom likes basketball.', solution: 'Tom who is tall likes basketball.', errorTip: '用定语从句合并' },
        { id: 'g8e20', title: '阅读细节', difficulty: '进阶', subject: 'english', grade: 8, icon: '📖', question: '找出文中具体数字或名字。', solution: '仔细阅读定位', errorTip: '细节题要准确' },
        { id: 'g8e21', title: '书面表达', difficulty: '进阶', subject: 'english', grade: 8, icon: '✍️', question: '写一篇关于保护环境的短文（80词左右）。', solution: 'We should... It is important to...', errorTip: '包含建议和原因' }
    ]
    // 初三 - 数学7题
    grade9_math: [
        { id: 'g9m1', title: '二次函数', difficulty: '进阶', subject: 'math', grade: 9, icon: '📈', question: '二次函数y=x²的顶点坐标是什么？', solution: '(0, 0)', errorTip: '顶点坐标(-b/2a, (4ac-b²)/4a)' },
        { id: 'g9m2', title: '相似三角形', difficulty: '进阶', subject: 'math', grade: 9, icon: '🔺', question: '两个相似三角形的相似比是3:5，小三角形面积是9cm²，大三角形面积是多少？', solution: '面积比=相似比的平方=9:25，大三角形面积=9÷9×25=25cm²', errorTip: '面积比等于相似比的平方' },
        { id: 'g9m3', title: '圆的综合', difficulty: '压轴', subject: 'math', grade: 9, icon: '⭕', question: '圆的半径是5cm，求圆内接正方形的边长。', solution: '正方形对角线=2r=10cm，边长=10÷√2=5√2cm', errorTip: '正方形的对角线等于圆的直径' },
        { id: 'g9m4', title: '概率计算', difficulty: '基础', subject: 'math', grade: 9, icon: '🎲', question: '袋中有3个红球、2个白球、1个黑球，摸到红球的概率是多少？', solution: 'P(红球)=3÷(3+2+1)=3/6=1/2', errorTip: '概率=所求情况数÷总情况数' },
        { id: 'g9m5', title: '锐角三角函数', difficulty: '进阶', subject: 'math', grade: 9, icon: '📐', question: '在直角三角形中，∠A的对边是3，斜边是5，则sin A = ?', solution: 'sin A = 对边/斜边 = 3/5', errorTip: '正弦=对边÷斜边' },
        { id: 'g9m6', title: '一元二次方程', difficulty: '进阶', subject: 'math', grade: 9, icon: '❓', question: '解方程：x² - 5x + 6 = 0', solution: '(x-2)(x-3)=0，x=2或x=3', errorTip: '因式分解或用求根公式' },
        { id: 'g9m7', title: '综合应用', difficulty: '压轴', subject: 'math', grade: 9, icon: '📝', question: '某商品进价100元，标价150元，打折销售后获利20元，问打了几折？', solution: '设打x折：150×x/10 - 100 = 20，解得x=8，即打8折', errorTip: '设未知数，找等量关系' },
        { id: 'g8p8', title: '速度计算', difficulty: '基础', subject: 'physics', grade: 8, icon: '⚡', question: '小明骑自行车速度4m/s，10秒能骑多少米？', solution: 's=vt=4×10=40m', errorTip: '速度公式：v=s/t' },
        { id: 'g8p9', title: '力的示意图', difficulty: '进阶', subject: 'physics', grade: 8, icon: '💪', question: '画出手对桌子向右推的力的示意图', solution: '从手指向右画箭头，标注重力', errorTip: '找准作用点和方向' },
        { id: 'g8p10', title: '惯性理解', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔄', question: '汽车突然刹车时，乘客会怎样？为什么？', solution: '向前倾倒，因为乘客具有惯性', errorTip: '惯性是物体保持原来运动状态的性质' },
        { id: 'g8p11', title: '二力平衡', difficulty: '进阶', subject: 'physics', grade: 8, icon: '⚖️', question: '物体在二力作用下做匀速直线运动，这两个力必须满足什么条件？', solution: '大小相等、方向相反、在同一直线上', errorTip: '二力平衡条件' },
        { id: 'g8p12', title: '压力与压强', difficulty: '进阶', subject: 'physics', grade: 8, icon: '📏', question: '书包带做得宽大的原因是什么？', solution: '增大受力面积，减小压强', errorTip: '压强=压力÷受力面积' },
        { id: 'g8p13', title: '液体压强', difficulty: '进阶', subject: 'physics', grade: 8, icon: '💧', question: '液体压强与什么因素有关？', solution: '深度和液体密度', errorTip: 'p=ρgh' },
        { id: 'g8p14', title: '大气压强', difficulty: '基础', subject: 'physics', grade: 8, icon: '🌬️', question: '大气压强随高度增加如何变化？', solution: '减小', errorTip: '高度越高气压越低' },
        { id: 'g8p15', title: '浮力计算', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔝', question: '物体在空气中重10N，在水中重8N，受到的浮力是多少？', solution: 'F浮=10-8=2N', errorTip: '浮力=空气中的重力-液体中的重力' },
        { id: 'g8p16', title: '光的折射', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔦', question: '光从空气斜射入水中，折射角与入射角有什么关系？', solution: '折射角小于入射角', errorTip: '空气中的角较大' },
        { id: 'g8p17', title: '凸透镜成像规律', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔍', question: 'u>2f时，成像特点是什么？', solution: '倒立、缩小的实像', errorTip: '物远像近像小' },
        { id: 'g8p18', title: '声音的特性', difficulty: '基础', subject: 'physics', grade: 8, icon: '🔊', question: '音调与什么因素有关？', solution: '振动频率', errorTip: '频率越高音调越高' },
        { id: 'g8p19', title: '机械能转化', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🎢', question: '过山车从高处滑下时，能量如何转化？', solution: '重力势能转化为动能', errorTip: '高度降低速度增大' },
        { id: 'g8p20', title: '滑轮组', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🔧', question: '使用滑轮组时，动滑轮和定滑轮的个数关系？', solution: '动滑轮比定滑轮少一个', errorTip: '省力但费距离' },
        { id: 'g8p21', title: '物理实验', difficulty: '进阶', subject: 'physics', grade: 8, icon: '🧪', question: '在测平均速度实验中，需要的测量工具是什么？', solution: '刻度尺和秒表', errorTip: '测路程和时间' }
    ]
    // 初三 - 语文7题
    grade9_chinese: [
        { id: 'g9c1', title: '文言文阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📜', question: '《岳阳楼记》中"先天下之忧而忧，后天下之乐而乐"表现了作者怎样的情怀？', solution: '表现了作者忧国忧民、以天下为己任的博大胸怀', errorTip: '结合范仲淹的生平理解' },
        { id: 'g9c2', title: '古诗词鉴赏', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '🎋', question: '《水调歌头》中"人有悲欢离合，月有阴晴圆缺"用了什么修辞手法？', solution: '对偶', errorTip: '字数相等、结构相同' },
        { id: 'g9c3', title: '议论文阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '💡', question: '议论文的三要素是什么？', solution: '论点、论据、论证', errorTip: '论点是你要证明的观点' },
        { id: 'g9c4', title: '小说阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📖', question: '小说中环境描写的作用是什么？', solution: '交代背景、渲染气氛、衬托人物心情、推动情节发展', errorTip: '根据具体语境分析' },
        { id: 'g9c5', title: '语法综合', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '🔤', question: '分析句子成分："我们学习语文。"', solution: '我们（主语）+ 学习（谓语）+ 语文（宾语）', errorTip: '主谓宾是句子的基本成分' },
        { id: 'g9c6', title: '名著导读', difficulty: '基础', subject: 'chinese', grade: 9, icon: '📚', question: '《儒林外史》的作者是谁？', solution: '吴敬梓', errorTip: '中国古代四大名著要熟记' },
        { id: 'g9c7', title: '作文冲刺', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '✍️', question: '中考作文如何得高分？', solution: '1.立意新颖深刻 2.结构清晰完整 3.语言优美流畅 4.书写工整规范', errorTip: '平时多积累素材和佳句' },
        { id: 'g9m8', title: '二次函数顶点式', difficulty: '进阶', subject: 'math', grade: 9, icon: '📈', question: '将y=x²-4x+3化成顶点式', solution: 'y=(x-2)²-1，顶点(2,-1)', errorTip: '配方' },
        { id: 'g9m9', title: '二次函数图像', difficulty: '进阶', subject: 'math', grade: 9, icon: '📈', question: '二次函数y=2x²的开口方向和大小由什么决定？', solution: 'a的正负决定开口方向，|a|决定开口大小', errorTip: 'a>0向上，a<0向下' },
        { id: 'g9m10', title: '相似三角形判定', difficulty: '进阶', subject: 'math', grade: 9, icon: '🔺', question: '有两角分别相等的两个三角形相似吗？', solution: '相似（AA）', errorTip: '两角相等即相似' },
        { id: 'g9m11', title: '锐角三角函数', difficulty: '进阶', subject: 'math', grade: 9, icon: '📐', question: '在直角三角形中，sin30度=？', solution: '1/2', errorTip: '记住特殊角的三角函数值' },
        { id: 'g9m12', title: '概率综合', difficulty: '进阶', subject: 'math', grade: 9, icon: '🎲', question: '同时抛两枚硬币，都是正面的概率是多少？', solution: '1/4', errorTip: '树状图或列表法' },
        { id: 'g9m13', title: '圆周角定理', difficulty: '压轴', subject: 'math', grade: 9, icon: '⭕', question: '同弧所对的圆周角相等吗？', solution: '相等', errorTip: '同弧或等弧所对圆周角相等' },
        { id: 'g9m14', title: '直线与圆的位置', difficulty: '进阶', subject: 'math', grade: 9, icon: '📏', question: '直线与圆相切时，圆心到直线的距离与半径有什么关系？', solution: '相等', errorTip: 'd=r' },
        { id: 'g9m15', title: '一元二次方程根', difficulty: '进阶', subject: 'math', grade: 9, icon: '❓', question: '一元二次方程x²-5x+6=0的两个根之和是多少？', solution: '5', errorTip: '根与系数的关系：x1+x2=-b/a' },
        { id: 'g9m16', title: '统计综合', difficulty: '进阶', subject: 'math', grade: 9, icon: '📊', question: '用样本估计总体时，样本容量越大越好吗？', solution: '是的，越大越有代表性', errorTip: '样本要有代表性' },
        { id: 'g9m17', title: '函数综合', difficulty: '压轴', subject: 'math', grade: 9, icon: '📈', question: '一次函数y=kx+b与反比例函数y=k/x的图像有几个交点？', solution: '两个交点', errorTip: '联立方程求解' },
        { id: 'g9m18', title: '三角形综合', difficulty: '压轴', subject: 'math', grade: 9, icon: '🔺', question: '在△ABC中，AB=AC，角A=40度，求角B。', solution: '角B=70度', errorTip: '等腰三角形两底角相等' },
        { id: 'g9m19', title: '四边形综合', difficulty: '进阶', subject: 'math', grade: 9, icon: '📐', question: '平行四边形、矩形、菱形、正方形的包含关系是什么？', solution: '正方形是特殊的菱形和矩形', errorTip: '从一般到特殊' },
        { id: 'g9m20', title: '概率应用', difficulty: '进阶', subject: 'math', grade: 9, icon: '🎲', question: '口袋中有3红2白球，不放回地摸两次，两次都是红球的概率？', solution: '(3/5)×(2/4)=3/10', errorTip: '不放回概率相乘' },
        { id: 'g9m21', title: '综合实践', difficulty: '压轴', subject: 'math', grade: 9, icon: '📝', question: '某商品定价300元，八折后仍获利20%，商品进价是多少？', solution: '设进价x元：300×0.8-x=0.2x，x=200元', errorTip: '获利=售价-进价' }
    ]
    // 初三 - 英语7题
    grade9_english: [
        { id: 'g9e1', title: '现在完成时', difficulty: '进阶', subject: 'english', grade: 9, icon: '⏰', question: '用动词适当形式填空：I _____ (live) here since 2010.', solution: 'I have lived here since 2010.', errorTip: 'since+时间点用现在完成时' },
        { id: 'g9e2', title: '宾语从句', difficulty: '进阶', subject: 'english', grade: 9, icon: '🔗', question: '合并句子：The teacher asked. "Is this your book?"', solution: 'The teacher asked if/whether this was my book.', errorTip: '宾语从句注意时态和语序' },
        { id: 'g9e3', title: '定语从句', difficulty: '压轴', subject: 'english', grade: 9, icon: '📝', question: '用定语从句合并：This is the book. I bought it yesterday.', solution: 'This is the book which/that I bought yesterday.', errorTip: '关系代词代替先行词' },
        { id: 'g9e4', title: '阅读理解', difficulty: '进阶', subject: 'english', grade: 9, icon: '📖', question: '阅读理解中推断题的解题技巧是什么？', solution: '不能直接找到答案，需根据文章内容进行推理判断', errorTip: '从文中找依据，合理推断' },
        { id: 'g9e5', title: '完形填空', difficulty: '进阶', subject: 'english', grade: 9, icon: '📝', question: '完形填空：_____ the help of my teacher, I passed the exam.', solution: 'With / Because of / Thanks to', errorTip: '介词短语可表原因' },
        { id: 'g9e6', title: '语法综合', difficulty: '压轴', subject: 'english', grade: 9, icon: '🔤', question: '选择正确选项：If he _____, please call me. (comes/came/will come)', solution: 'If he comes, please call me.', errorTip: '主将从现' },
        { id: 'g9e7', title: '书面表达', difficulty: '压轴', subject: 'english', grade: 9, icon: '✍️', question: '写一篇关于环保的英语短文（80词左右）。', solution: 'With the development of... We should... In conclusion...', errorTip: '注意衔接词和字数要求' },
        { id: 'g9c8', title: '文言文实词', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📜', question: '《鱼我所欲也》中所欲有甚于生者的甚是什么意思？', solution: '超过', errorTip: '联系上下文理解' },
        { id: 'g9c9', title: '古诗词鉴赏', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '🎋', question: '《江城子·密州出猎》中老夫聊发少年狂的狂有什么含义？', solution: '豪情壮志，不服老', errorTip: '理解诗人情感' },
        { id: 'g9c10', title: '议论文论证', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '💡', question: '道理论证和举例论证有什么区别？', solution: '道理论证用名言警句，举例论证用具体事例', errorTip: '两种论证方法结合使用' },
        { id: 'g9c11', title: '小说阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📖', question: '小说中次要人物的作用是什么？', solution: '推动情节发展、烘托主要人物', errorTip: '陪衬作用' },
        { id: 'g9c12', title: '语法综合', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '🔤', question: '分析句子：风吹过来。', solution: '风（主语）吹（谓语）过来（补语）', errorTip: '主谓宾补定状' },
        { id: 'g9c13', title: '古文翻译', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📜', question: '翻译：入则无法家拂士，出则无敌国外患者，国恒亡。', solution: '国内没有法度大臣，国外没有敌国外患，国家常常灭亡', errorTip: '对偶修辞' },
        { id: 'g9c14', title: '现代文阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📖', question: '环境描写的作用是什么？', solution: '交代背景、渲染气氛、烘托心情', errorTip: '根据语境分析' },
        { id: 'g9c15', title: '写作训练', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '✍️', question: '如何让作文语言生动形象？', solution: '运用修辞手法、描写细节', errorTip: '多种表达方式' },
        { id: 'g9c16', title: '古诗词意象', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '🎋', question: '月亮在古诗中常代表什么？', solution: '思念、团圆', errorTip: '常见意象' },
        { id: 'g9c17', title: '文言文句式', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📜', question: '判断句式：环滁皆山也。', solution: '判断句，用也表判断', errorTip: '判断句标志' },
        { id: 'g9c18', title: '文学常识', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📚', question: '《我爱这土地》的作者是谁？', solution: '艾青', errorTip: '著名现代诗人' },
        { id: 'g9c19', title: '名著阅读', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📚', question: '《钢铁是怎样炼成的》中保尔的精神是什么？', solution: '为理想而献身、钢铁般的意志', errorTip: '名著主题' },
        { id: 'g9c20', title: '中考作文', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '✍️', question: '中考作文如何做到立意深刻？', solution: '透过现象看本质、表达独特感悟', errorTip: '立意要新颖深刻' },
        { id: 'g9c21', title: '综合运用', difficulty: '进阶', subject: 'chinese', grade: 9, icon: '📝', question: '如何做好课外文言文阅读？', solution: '积累实词、了解背景、整体把握', errorTip: '多做练习' }
    ]
    // 初三 - 物理7题
    grade9_physics: [
        { id: 'g9p1', title: '欧姆定律', difficulty: '进阶', subject: 'physics', grade: 9, icon: '⚡', question: '某电阻两端电压为6V，电阻为3Ω，则电流是多少？', solution: 'I = U/R = 6/3 = 2A', errorTip: '欧姆定律：I=U/R' },
        { id: 'g9p2', title: '电功率计算', difficulty: '进阶', subject: 'physics', grade: 9, icon: '💡', question: '一个灯泡标有"220V 40W"，正常工作电流是多少？', solution: 'I = P/U = 40/220 ≈ 0.18A', errorTip: '电功率公式：P=UI' },
        { id: 'g9p3', title: '比热容', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🌡️', question: '水的比热容是4.2×10³ J/(kg·℃)，表示什么意义？', solution: '表示1kg水温度升高或降低1℃时，吸收或放出4.2×10³J的热量', errorTip: '比热容是物质的一种特性' },
        { id: 'g9p4', title: '杠杆平衡', difficulty: '基础', subject: 'physics', grade: 9, icon: '⚖️', question: '杠杆平衡时，动力×动力臂 = 阻力×阻力臂，这是什么原理？', solution: '杠杆平衡原理', errorTip: '动力臂是支点到动力作用线的距离' },
        { id: 'g9p5', title: '机械效率', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🔧', question: '有用功是300J，总功是400J，机械效率是多少？', solution: 'η = W有/W总 × 100% = 300/400 × 100% = 75%', errorTip: '机械效率 = 有用功/总功' },
        { id: 'g9p6', title: '内能变化', difficulty: '基础', subject: 'physics', grade: 9, icon: '🔥', question: '改变物体内能的两种方式是什么？', solution: '做功和热传递', errorTip: '两种方式在改变内能上是等效的' },
        { id: 'g9p7', title: '电路分析', difficulty: '压轴', subject: 'physics', grade: 9, icon: '🔌', question: '两个电阻R1=4Ω，R2=6Ω串联，总电阻是多少？', solution: 'R总 = R1 + R2 = 4 + 6 = 10Ω', errorTip: '串联电路总电阻等于各电阻之和' },
        { id: 'g9e8', title: '现在完成时', difficulty: '进阶', subject: 'english', grade: 9, icon: '⏰', question: '用动词适当形式填空：I ____ (live) here since 2010.', solution: 'have lived', errorTip: 'since+时间点用现在完成时' },
        { id: 'g9e9', title: '现在完成时与一般过去时', difficulty: '进阶', subject: 'english', grade: 9, icon: '⏰', question: '选择：I ____ to Beijing last year. / I ____ to Beijing many times.', solution: 'went / have been', errorTip: 'last year用过去时，many times用完成时' },
        { id: 'g9e10', title: '宾语从句时态', difficulty: '进阶', subject: 'english', grade: 9, icon: '🔗', question: '改为宾语从句：He said. I am busy.', solution: 'He said that he was busy.', errorTip: '主过从过' },
        { id: 'g9e11', title: '定语从句关系词', difficulty: '进阶', subject: 'english', grade: 9, icon: '📝', question: '用定语从句合并：This is the book. I bought it yesterday.', solution: 'This is the book which/that I bought yesterday.', errorTip: '用which/that代替' },
        { id: 'g9e12', title: '被动语态时态', difficulty: '进阶', subject: 'english', grade: 9, icon: '🔄', question: '改为现在完成时被动语态：They have built the house.', solution: 'The house has been built.', errorTip: 'has/have been+过去分词' },
        { id: 'g9e13', title: '阅读推断题', difficulty: '进阶', subject: 'english', grade: 9, icon: '📖', question: '推断题：What can we learn from the passage?', solution: '从文中推断出', errorTip: '不能直接抄原文' },
        { id: 'g9e14', title: '完形填空语境', difficulty: '进阶', subject: 'english', grade: 9, icon: '📝', question: '完形填空要注意什么？', solution: '上下文语境、固定搭配', errorTip: '瞻前顾后' },
        { id: 'g9e15', title: '语法综合', difficulty: '压轴', subject: 'english', grade: 9, icon: '🔤', question: '选择：If he ____ free, he ____ come. is/will', solution: 'If he is free, he will come.', errorTip: '主将从现或主现从现' },
        { id: 'g9e16', title: '阅读主旨题', difficulty: '进阶', subject: 'english', grade: 9, icon: '📖', question: 'The passage mainly tells us about ____.', solution: '文章主题', errorTip: '把握中心思想' },
        { id: 'g9e17', title: '书面表达结构', difficulty: '压轴', subject: 'english', grade: 9, icon: '✍️', question: '书面表达一般分为几段？', solution: '三段式：开头、主体、结尾', errorTip: '结构清晰' },
        { id: 'g9e18', title: '情态动词用法', difficulty: '进阶', subject: 'english', grade: 9, icon: '💪', question: 'must, have to, have got to的区别？', solution: 'must强调主观，have to强调客观', errorTip: '根据语境选择' },
        { id: 'g9e19', title: '阅读词义猜测', difficulty: '进阶', subject: 'english', grade: 9, icon: '📖', question: '猜测词义的方法有哪些？', solution: '上下文、构词法、定义', errorTip: '联系语境' },
        { id: 'g9e20', title: '写作高级句型', difficulty: '进阶', subject: 'english', grade: 9, icon: '✍️', question: '写出几个表示我认为的英语高级表达。', solution: 'I hold the opinion that... / As far as I am concerned...', errorTip: '避免重复使用I think' },
        { id: 'g9e21', title: '综合运用', difficulty: '压轴', subject: 'english', grade: 9, icon: '📝', question: '阅读短文，完成句子。', solution: '从文中提取信息', errorTip: '仔细阅读' }
    ]
    // 初三 - 化学7题
    grade9_chemistry: [
        { id: 'g9ch1', title: '化学方程式配平', difficulty: '基础', subject: 'chemistry', grade: 9, icon: '⚗️', question: '配平化学方程式：Fe + O₂ → Fe₃O₄', solution: '3Fe + 2O₂ → Fe₃O₄', errorTip: '最小公倍数法配平' },
        { id: 'g9ch2', title: '质量守恒定律', difficulty: '基础', subject: 'chemistry', grade: 9, icon: '⚖️', question: '根据质量守恒定律，化学反应前后什么不变？', solution: '物质总质量、原子种类、原子数目不变', errorTip: '宏观：质量守恒；微观：原子守恒' },
        { id: 'g9ch3', title: '金属活动性', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🔩', question: '判断反应能否发生：Zn + CuSO₄ → ?', solution: '能反应，Zn + CuSO₄ → ZnSO₄ + Cu', errorTip: '锌的活动性比铜强，可以置换出铜' },
        { id: 'g9ch4', title: '溶液配制', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🧪', question: '配制50g质量分数为10%的氯化钠溶液，需要氯化钠多少克？', solution: 'm(NaCl) = 50 × 10% = 5g', errorTip: '溶质质量 = 溶液质量 × 质量分数' },
        { id: 'g9ch5', title: '酸碱指示剂', difficulty: '基础', subject: 'chemistry', grade: 9, icon: '💧', question: '紫色石蕊试液遇到酸变成什么颜色？', solution: '红色', errorTip: '酸红碱蓝' },
        { id: 'g9ch6', title: '复分解反应', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚡', question: '复分解反应发生的条件是什么？', solution: '生成物中有沉淀、气体或水生成', errorTip: '至少满足一个条件' },
        { id: 'g9ch7', title: '化学计算', difficulty: '压轴', subject: 'chemistry', grade: 9, icon: '🔢', question: '12g碳完全燃烧，需要多少克氧气？', solution: 'C + O₂ → CO₂，12:32=12:x，x=32g', errorTip: '根据化学方程式计算' }
    ]
};

// ====== 教师数据 - 5位老师 ======


const podcastData = {
    method: [
        { id: 1, title: '高效学习的10个秘诀', duration: 900, icon: '🎧', desc: '掌握高效学习的核心方法', author: '学习方法专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 2, title: '如何提高记忆力', duration: 1200, icon: '🧠', desc: '科学记忆法，让知识记得更牢', author: '记忆训练师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 3, title: '时间管理三步法', duration: 720, icon: '⏰', desc: '番茄工作法+优先级排序', author: '效率达人', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: 4, title: '专注力训练技巧', duration: 840, icon: '🎯', desc: '告别分心，保持长时间专注', author: '心理学博士', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { id: 5, title: '笔记整理黄金法则', duration: 680, icon: '📝', desc: '康奈尔笔记法详解', author: '学习顾问', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
        { id: 6, title: '预习复习高效率', duration: 560, icon: '📚', desc: '课前预习和课后复习的正确方法', author: '教育专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
    ],
    knowledge: [
        { id: 7, title: '数学思维导图入门', duration: 1500, icon: '📐', desc: '用思维导图梳理数学知识体系', author: '数学名师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
        { id: 8, title: '语文阅读理解技巧', duration: 1080, icon: '📖', desc: '快速抓住文章中心和重点', author: '语文特级教师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
        { id: 9, title: '英语语法基础', duration: 1320, icon: '🔤', desc: '系统掌握英语语法核心规则', author: '雅思名师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        { id: 10, title: '物理概念理解法', duration: 980, icon: '⚡', desc: '从生活中理解物理原理', author: '物理教授', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
        { id: 11, title: '化学元素记忆妙招', duration: 760, icon: '🧪', desc: '元素周期表趣味记忆法', author: '化学老师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' }
    ],
    focus: [
        { id: 12, title: '5分钟冥想放松', duration: 300, icon: '🧘', desc: '快速放松身心，恢复精力', author: '冥想导师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
        { id: 13, title: '考前焦虑缓解', duration: 480, icon: '🌙', desc: '用深呼吸缓解考试压力', author: '心理咨询师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
        { id: 14, title: '高效休息方法', duration: 360, icon: '💤', desc: '科学休息比熬夜更有效', author: '睡眠专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
        { id: 15, title: '睡前放松音乐', duration: 600, icon: '🎵', desc: '帮助入睡的轻音乐', author: '音乐治疗师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' }
    ],
    share: [
        { id: 16, title: '学霸作息时间表', duration: 600, icon: '📅', desc: '985学霸的每日作息安排', author: '名校学霸', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
        { id: 17, title: '备考经验分享', duration: 900, icon: '💬', desc: '过来人的中考高考经验', author: '高考状元', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
        { id: 18, title: '错题本使用方法', duration: 720, icon: '📝', desc: '如何高效利用错题本提分', author: '逆袭学霸', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3' },
        { id: 19, title: '英语听力提升秘籍', duration: 850, icon: '🎧', desc: '从不及格到满分的听力方法', author: '英语达人', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3' },
        { id: 20, title: '作文高分技巧', duration: 780, icon: '✍️', desc: '考场作文的得分要点', author: '语文老师', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3' },
        { id: 21, title: '考试心态调整', duration: 520, icon: '💪', desc: '考场上的心理调节技巧', author: '心理专家', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3' }
    ]
};

const thinkingData = {
    logic: [
        { q: '找规律：2, 4, 8, 16, ?', options: ['20', '24', '32', '64'], answer: 2, explanation: '后一个数是前一个数的2倍' },
        { q: '找规律：1, 1, 2, 3, 5, 8, ?', options: ['10', '11', '12', '13'], answer: 3, explanation: '斐波那契数列：前两个数之和等于第三个数' },
        { q: '如果所有的A都是B，所有的B都是C，那么所有的A都是C吗？', options: ['是的', '不是', '不确定', '需要更多信息'], answer: 0, explanation: '这是逻辑学中的传递关系' },
        { q: '找规律：3, 6, 11, 18, ?', options: ['24', '27', '29', '36'], answer: 2, explanation: '差值分别为3,5,7,9...所以18+11=29' }
    ],
    creative: [
        { q: '砖头除了盖房子，还能做什么？至少说出3种', options: ['压纸', '做锤子', '当武器', '铺路'], answer: null, explanation: '发散思维，答案不唯一' },
        { q: '杯子可以有哪些创意用途？', options: ['装水', '做台灯', '种植植物', '以上都是'], answer: 3, explanation: '创意来源于生活的多个角度' },
        { q: '如果能改变历史，你最想改变什么？', options: ['科技发展', '教育制度', '环境保护', '和平事业'], answer: null, explanation: '开放性问题，培养创造性思维' }
    ],
    critical: [
        { q: '有人说"读书无用"，你会怎么反驳？', options: ['举例成功人士', '指出逻辑错误', '提供数据', '以上都是'], answer: 3, explanation: '批判性思维需要多方面论证' },
        { q: '"便宜没好货"这句话一定正确吗？', options: ['一定正确', '不一定正确', '完全错误', '无法判断'], answer: 1, explanation: '需要具体情况具体分析' },
        { q: '网络上的一条新闻一定是真实的吗？', options: ['一定是', '一定不是', '不一定', '无法判断'], answer: 2, explanation: '要学会辨别信息真伪' }
    ],
    system: [
        { q: '生态系统包括哪些组成部分？', options: ['生产者', '消费者', '分解者', '以上都是'], answer: 3, explanation: '生态系统是相互联系的整体' },
        { q: '一个公司要成功，需要考虑哪些因素？', options: ['产品质量', '团队协作', '市场营销', '以上都是'], answer: 3, explanation: '系统思维考虑多方面因素' },
        { q: '学习不好的原因可能有哪些？', options: ['学习方法', '学习态度', '外部环境', '以上都是'], answer: 3, explanation: '用系统思维分析问题' }
    ]
};

const teachers = {
    math: { name: '赵老师', subject: '数学', icon: '📐', intro: '专注数学教学10年，擅长代数、几何、函数等模块教学，善于用生动的方式讲解抽象概念。', greeting: '同学们好！我是赵老师，专注数学教学10年。有什么数学问题可以问我，我会一步步帮你分析解题思路！' },
    chinese: { name: '李老师', subject: '语文', icon: '📝', intro: '语文特级教师，深耕语文教学20年，擅长阅读理解、作文指导、文言文讲解。', greeting: '同学们好！我是李老师，语文特级教师。阅读理解、作文写作、文言文解析，我来帮你！' },
    english: { name: '王老师', subject: '英语', icon: '📖', intro: '雅思8.5分，英语专业八级，擅长口语训练、阅读技巧、写作模板。', greeting: 'Hello! 我是王老师，雅思8.5分。英语学习有问题尽管问我，口语、阅读、写作都可以！' },
    physics: { name: '陈老师', subject: '物理', icon: '⚡', intro: '物理竞赛金牌教练，擅长用实验和模型帮助学生理解物理原理。', greeting: '同学们好！我是陈老师，物理竞赛教练。力学、电学、光学，让我带你探索物理的奥秘！' },
    chemistry: { name: '周老师', subject: '化学', icon: '🧪', intro: '化学实验演示专家，擅长将抽象的化学概念通过实验可视化。', greeting: '同学们好！我是周老师，化学实验高手。化学反应、方程式、实验原理，一起来探索！' }
},
        { id: 'g9p8', title: '欧姆定律应用', difficulty: '进阶', subject: 'physics', grade: 9, icon: '⚡', question: '电阻为10Ω，两端电压为6V，电流是多少？', solution: 'I=U/R=6/10=0.6A', errorTip: '欧姆定律I=U/R' },
        { id: 'g9p9', title: '电功率计算', difficulty: '进阶', subject: 'physics', grade: 9, icon: '💡', question: '灯泡标有220V 40W，正常工作电流是多少？', solution: 'I=P/U=40/220≈0.18A', errorTip: 'P=UI' },
        { id: 'g9p10', title: '电能计算', difficulty: '进阶', subject: 'physics', grade: 9, icon: '⚡', question: '用电器工作2小时，功率1000W，消耗多少电能？', solution: 'W=Pt=1kW×2h=2kWh', errorTip: '电能=功率×时间' },
        { id: 'g9p11', title: '焦耳定律', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🔥', question: '电流通过导体产生的热量与什么成正比？', solution: '电流的平方、电阻、通电时间', errorTip: 'Q=I²Rt' },
        { id: 'g9p12', title: '比热容应用', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🌡️', question: '500g水温度从20℃升高到70℃，吸收多少热量？', solution: 'Q=cmΔt=4.2×10³×0.5×50=1.05×10⁵J', errorTip: 'Q=cmΔt' },
        { id: 'g9p13', title: '杠杆分类', difficulty: '进阶', subject: 'physics', grade: 9, icon: '⚖️', question: '镊子是什么类型的杠杆？', solution: '费力杠杆', errorTip: '动力臂小于阻力臂' },
        { id: 'g9p14', title: '滑轮组分析', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🔧', question: '用滑轮组提升重物，若动滑轮重10N，物重90N，拉力至少多少？', solution: 'F=(90+10)/2=50N（不计摩擦）', errorTip: 'F=(G物+G动)/n' },
        { id: 'g9p15', title: '热机效率', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🔥', question: '热机在某次工作中，机械转化了3×10⁷J有用功，消耗了1×10⁸J燃料，则效率是？', solution: 'η=3×10⁷/1×10⁸×100%=30%', errorTip: 'η=W有/Q总' },
        { id: 'g9p16', title: '电路分析', difficulty: '压轴', subject: 'physics', grade: 9, icon: '🔌', question: '两个电阻并联，R1=4Ω，R2=6Ω，总电阻是多少？', solution: 'R总=2.4Ω，1/R总=1/4+1/6', errorTip: '并联电阻小于任一分电阻' },
        { id: 'g9p17', title: '安全用电', difficulty: '基础', subject: 'physics', grade: 9, icon: '⚡', question: '发现有人触电时，应该怎么办？', solution: '切断电源或用绝缘体挑开电线', errorTip: '不能直接用手拉' },
        { id: 'g9p18', title: '能量转化', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🔄', question: '水电站发电时，能量如何转化？', solution: '机械能→电能', errorTip: '水轮机带动发电机' },
        { id: 'g9p19', title: '物理综合', difficulty: '压轴', subject: 'physics', grade: 9, icon: '📝', question: '电热水器功率2000W，额定电压220V，正常工作电流和电阻？', solution: 'I=P/U=2000/220≈9.1A，R=U²/P=220²/2000=24.2Ω', errorTip: '纯电阻用P=U²/R' },
        { id: 'g9p20', title: '实验设计', difficulty: '进阶', subject: 'physics', grade: 9, icon: '🧪', question: '如何测量小灯泡的电功率？', solution: '电流表、电压表测出U和I，用P=UI计算', errorTip: '伏安法测功率' },
        { id: 'g9p21', title: '创新实验', difficulty: '压轴', subject: 'physics', grade: 9, icon: '💡', question: '如何测量不规则石块的密度？', solution: '用天平测质量，用排水法测体积，ρ=m/V', errorTip: '等效替代法' },
        { id: 'g9ch8', title: '化学方程式', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚗️', question: '配平化学方程式：H₂ + O₂ → H₂O', solution: '2H₂ + O₂ → 2H₂O', errorTip: '最小公倍数法' },
        { id: 'g9ch9', title: '质量守恒应用', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚖️', question: '在反应A+2B=C+D中，若A和B质量分别为3g和8g，生成C和D的质量比为1:2，则C的质量是多少？', solution: 'C=2g', errorTip: '质量守恒，生成物总质量=反应物总质量' },
        { id: 'g9ch10', title: '原子结构', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚛️', question: '原子中质子数、电子数、中子数的关系？', solution: '质子数=电子数，中子数不一定等于质子数', errorTip: '核电荷数=质子数=电子数' },
        { id: 'g9ch11', title: '元素周期表', difficulty: '基础', subject: 'chemistry', grade: 9, icon: '📊', question: '元素周期表中同一周期的元素有什么特点？', solution: '电子层数相同', errorTip: '从左到右质子数递增' },
        { id: 'g9ch12', title: '溶液配制', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🧪', question: '如何配制100g 10%的氯化钠溶液？', solution: '称取10g NaCl，量取90mL水，混合溶解', errorTip: '溶质质量=溶液质量×质量分数' },
        { id: 'g9ch13', title: '酸碱盐性质', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '💧', question: '酸的通性有哪些？', solution: '能使指示剂变色、与活泼金属反应、与碱反应、与盐反应', errorTip: 'H⁺的性质' },
        { id: 'g9ch14', title: '复分解反应条件', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚡', question: '复分解反应发生的条件是什么？', solution: '生成沉淀、气体或水', errorTip: '至少满足一个' },
        { id: 'g9ch15', title: '化学计算', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🔢', question: '多少克氧气与24g碳完全反应？', solution: '64g', errorTip: '根据化学方程式计算' },
        { id: 'g9ch16', title: '实验现象', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🧪', question: '铁丝在氧气中燃烧的现象是什么？', solution: '剧烈燃烧，火星四射，放出热量，生成黑色固体', errorTip: '注意描述完整' },
        { id: 'g9ch17', title: '物质鉴别', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🔬', question: '如何鉴别稀盐酸和稀硫酸？', solution: '加入氯化钡溶液，有白色沉淀的是硫酸', errorTip: '利用特征反应' },
        { id: 'g9ch18', title: '化学肥料', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '🌱', question: 'NH₄Cl属于什么肥料？', solution: '氮肥', errorTip: '含有N元素' },
        { id: 'g9ch19', title: '微观粒子', difficulty: '进阶', subject: 'chemistry', grade: 9, icon: '⚛️', question: '分子和原子的区别是什么？', solution: '分子可分，原子不可分；分子由原子构成', errorTip: '化学变化中分子可分' },
        { id: 'g9ch20', title: '综合计算', difficulty: '压轴', subject: 'chemistry', grade: 9, icon: '🔢', question: '100g大理石与足量稀盐酸反应，生成22gCO₂，求大理石中CaCO₃的质量分数。', solution: 'CaCO₃质量=50g，质量分数=50%', errorTip: '利用化学方程式计算' },
        { id: 'g9ch21', title: '实验探究', difficulty: '压轴', subject: 'chemistry', grade: 9, icon: '🧪', question: '如何证明某气体是二氧化碳？', solution: '通入澄清石灰水，石灰水变浑浊', errorTip: 'CO₂的检验方法' }
    ] english: [], physics: [], chemistry: [] };
let deepseekHistory = [];
let cameraStream = null;
let currentUploadType = '';
let currentGradeTab = 'grade5';
let currentSubjectTab = 'math';

// ====== 游戏数据 ======
const gameConfig = {
    schulte: { name: '舒尔特方格', icon: '📐', ability: 'attention', desc: '按顺序点击1-16，训练注意力' },
    visual: { name: '视觉搜索', icon: '🔍', ability: 'observation', desc: '在干扰项中找到目标' },
    memory: { name: '数字记忆', icon: '🧠', ability: 'memory', desc: '记住数字显示的位置' },
    shape: { name: '图形记忆', icon: '📐', ability: 'memory', desc: '记住图形出现的格子' },
    reaction: { name: '快速点击', icon: '⚡', ability: 'reaction', desc: '等待变绿后快速点击' },
    color: { name: '颜色识别', icon: '🎨', ability: 'reaction', desc: 'Stroop效应训练' },
    difference: { name: '找不同', icon: '🔎', ability: 'observation', desc: '找出两幅图的不同' },
    pattern: { name: '图形推理', icon: '🧩', ability: 'logic', desc: '找出图形规律' }
};

// 状态变量
let currentPodcastCategory = 'method';
let currentAudioIndex = 0;
let currentThinkingType = '';
let currentThinkingPage = 1;
const THINKING_PER_PAGE = 10;
let currentThinkingMode = 'list';
let currentThinkingTrainType = '';
let currentMethodTrainingIndex = 0;
let currentMethodTrainingScore = 0;
let selectedThinkingOption = null;
let podcastAudio = null;
let videoElement = null;
let deepseekImageBase64 = null;
let deepseekVideoUrl = null;
let currentThinkingIndex = 0;
let currentThinkingScore = 0;
let audioPlaying = false;

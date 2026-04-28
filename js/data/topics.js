// 版本: V140

const topicsMath5 = [
    {id:101,title:'小数加减法',diff:2,q:'计算：3.25+1.75=',a:'5',e:'对齐小数点相加'},
    {id:102,title:'小数乘法',diff:2,q:'计算：0.5×0.4=',a:'0.2',e:'按整数乘法计算后点小数点'},
    {id:103,title:'小数除法',diff:3,q:'计算：4.8÷0.6=',a:'8',e:'被除数和除数同时扩大10倍'},
    {id:104,title:'面积计算',diff:2,q:'长方形长5cm，宽3cm，面积是？',a:'15cm²',e:'面积=长×宽'},
    {id:105,title:'三角形面积',diff:3,q:'底8cm，高5cm的三角形面积是？',a:'20cm²',e:'面积=底×高÷2'},
    {id:106,title:'平行四边形面积',diff:3,q:'底6cm，高4cm，平行四边形面积是？',a:'24cm²',e:'面积=底×高'},
    {id:107,title:'分数意义',diff:2,q:'把一个蛋糕平均分成5份，取2份，用分数表示？',a:'2/5',e:'分子表示取的份数'},
    {id:108,title:'分数加减法',diff:3,q:'计算：1/3+1/6=',a:'1/2',e:'通分后相加'},
    {id:109,title:'公倍数',diff:3,q:'4和6的最小公倍数是？',a:'12',e:'列举法或短除法'},
    {id:110,title:'公因数',diff:3,q:'12和18的最大公因数是？',a:'6',e:'列举法或短除法'},
    {id:111,title:'方程初步',diff:2,q:'解方程：x+3=10',a:'x=7',e:'移项得x=10-3'},
    {id:112,title:'列方程解应用',diff:3,q:'小明有x本书，小红有15本，两人共25本，求x',a:'x=10',e:'x+15=25'},
    {id:113,title:'可能性',diff:2,q:'盒中有3红2白球，摸到红球的可能性是？',a:'3/5',e:'摸到红球次数/总次数'},
    {id:114,title:'统计图表',diff:2,q:'平均数怎么求？',a:'总数÷个数',e:'平均数=总和÷数量'},
    {id:115,title:'角的度量',diff:2,q:'直角是多少度？',a:'90°',e:'直角等于90度'},
    {id:116,title:'多边形内角和',diff:3,q:'五边形的内角和是？',a:'540°',e:'(5-2)×180°'},
    {id:117,title:'植树问题',diff:4,q:'在100米路两旁种树，每隔10米一棵，共几棵？',a:'22棵',e:'两端都种：棵数=段数+1'},
    {id:118,title:'周期问题',diff:3,q:'1,2,3循环排列，第10个是？',a:'1',e:'10÷3=3余1'},
    {id:119,title:'简便运算',diff:3,q:'125×8×4=',a:'4000',e:'125×8=1000'},
    {id:120,title:'体积计算',diff:3,q:'长方体长4cm，宽3cm，高2cm，体积是？',a:'24cm³',e:'体积=长×宽×高'},
    {id:121,title:'单位换算',diff:2,q:'2.5小时=多少分钟？',a:'150分钟',e:'2.5×60=150'},

    {id:122,title:'数的整除',diff:3,q:'在1-100中，既能被3整除又能被5整除的数有？',a:'33,66,99',e:'能被15整除的数'},
    {id:123,title:'最大公因数应用',diff:4,q:'用正方形地砖铺房间，长36dm宽24dm，最小需几块？',a:'6块',e:'36和24的最大公因数是12'},
    {id:124,title:'分数比大小',diff:2,q:'比较大小：3/5 ○ 5/8',a:'3/5 < 5/8',e:'通分后比较'}
]

const topicsMath6 = [
    {id:101,title:'分数乘法',diff:2,q:'计算：2/3×6=',a:'4',e:'分子分母约分'},
    {id:102,title:'分数除法',diff:3,q:'计算：3/4÷2=',a:'3/8',e:'除以一个数等于乘倒数'},
    {id:103,title:'比的意义',diff:2,q:'3:5的比值是？',a:'3/5或0.6',e:'比值=前项÷后项'},
    {id:104,title:'比的化简',diff:2,q:'化简：12:18',a:'2:3',e:'除以最大公约数'},
    {id:105,title:'百分数应用',diff:3,q:'50的20%是多少？',a:'10',e:'50×20%=10'},
    {id:106,title:'圆的认识',diff:2,q:'圆的直径和半径关系是？',a:'d=2r',e:'直径是半径的2倍'},
    {id:107,title:'圆周率',diff:1,q:'圆周率π约等于？',a:'3.14',e:'圆周率定义'},
    {id:108,title:'圆的周长',diff:2,q:'半径2cm的圆，周长是？',a:'12.56cm',e:'C=2πr'},
    {id:109,title:'圆的面积',diff:3,q:'直径6cm的圆，面积是？',a:'28.26cm²',e:'S=πr²,r=3'},
    {id:110,title:'扇形面积',diff:3,q:'圆心角90°，半径4cm的扇形面积是？',a:'12.56cm²',e:'90/360×π×4²'},
    {id:111,title:'负数认识',diff:2,q:'-5℃比-2℃高还是低？',a:'低',e:'负数比较大小'},
    {id:112,title:'数轴表示',diff:2,q:'在数轴上，-3在-5的哪边？',a:'右边',e:'数轴上右边的数大'},
    {id:113,title:'解比例',diff:3,q:'解比例：3:x=6:8',a:'x=4',e:'内向积=外向积'},
    {id:114,title:'统计图选择',diff:2,q:'表示部分与整体关系用什么统计图？',a:'扇形统计图',e:'各部分占比'},
    {id:115,title:'圆柱体积',diff:3,q:'底面半径2cm，高5cm的圆柱体积是？',a:'62.8cm³',e:'V=πr²h'},
    {id:116,title:'圆锥体积',diff:3,q:'圆锥底面积12cm²，高9cm，体积是？',a:'36cm³',e:'V=1/3Sh'},
    {id:117,title:'比例尺',diff:3,q:'比例尺1:1000，表示实际1cm，图上？',a:'1m',e:'图上距离×1000'},
    {id:118,title:'正反比例',diff:3,q:'速度一定，路程和时间成什么比例？',a:'正比例',e:'s=vt'},
    {id:119,title:'应用题',diff:4,q:'一批零件，甲单独做8天完成，乙单独做12天，两人合作几天完成？',a:'4.8天',e:'合作效率=1/8+1/12'},
    {id:120,title:'利率问题',diff:3,q:'本金1000元，年利率3%，存一年利息？',a:'30元',e:'利息=本金×利率'},
    {id:121,title:'统计量',diff:2,q:'一组数据2,3,3,4,5,5,5的众数是？',a:'3和5',e:'出现次数最多的数'},

    {id:122,title:'比例应用',diff:3,q:'图上距离5cm，实际距离100km，比例尺是？',a:'1:2000000',e:'5cm:100km=1:2000000'},
    {id:123,title:'圆周率',diff:2,q:'圆的直径是10cm，周长约是？',a:'31.4cm',e:'C=πd≈3.14×10'},
    {id:124,title:'折扣问题',diff:3,q:'原价200元，打8折后再降10%，现价？',a:'144元',e:'200×0.8×0.9=144'}
]

const topicsMath7 = [
    {id:101,title:'有理数加法',diff:2,q:'计算：(-3)+(+7)+(-5)=?',a:'-1',e:'去括号：-3+7-5=-1'},
    {id:102,title:'有理数乘法',diff:2,q:'计算：(-2)×(-3)×(+4)=?',a:'24',e:'负负得正：(-2)×(-3)=6, 6×4=24'},
    {id:103,title:'绝对值',diff:1,q:'|-5|+|+3|=?',a:'8',e:'|-5|=5, |+3|=3, 5+3=8'},
    {id:104,title:'相反数',diff:1,q:'-7的相反数是？',a:'7',e:'只有符号不同的两数互为相反数'},
    {id:105,title:'数轴',diff:2,q:'在数轴上表示：大于-3且小于4的整数有哪些？',a:'-2,-1,0,1,2,3',e:'从-2到3共6个整数'},
    {id:106,title:'整式加减',diff:2,q:'化简：3x+2y-x+5y',a:'2x+7y',e:'合并同类项：3x-x=2x, 2y+5y=7y'},
    {id:107,title:'幂的运算',diff:3,q:'计算：2³×2⁴÷2⁵',a:'4',e:'同底数幂：指数相加减'},
    {id:108,title:'一元一次方程',diff:2,q:'解方程：2x+5=13',a:'x=4',e:'移项：2x=8, x=4'},
    {id:109,title:'方程应用',diff:3,q:'小明有x本书，小红比他多3本，两人共有15本，求x',a:'x=6',e:'x+(x+3)=15, 2x=12, x=6'},
    {id:110,title:'线段计算',diff:2,q:'点A在-2，B在5，AB距离是？',a:'7',e:'|5-(-2)|=7'},
    {id:111,title:'角度计算',diff:2,q:'一个角的余角是35°，这个角是多少度？',a:'55°',e:'余角之和为90°，90-35=55'},
    {id:112,title:'平行线判定',diff:3,q:'直线a、b被c所截，若∠1=∠2，a∥b吗？',a:'能',e:'同位角相等，两直线平行'},
    {id:113,title:'三角形内角和',diff:2,q:'三角形的三个内角和是？',a:'180°',e:'三角形内角和定理'},
    {id:114,title:'方程组',diff:3,q:'解方程组：x+y=7, x-y=3',a:'x=5, y=2',e:'相加得2x=10，相减得2y=4'},
    {id:115,title:'乘法公式',diff:3,q:'计算：(a+2)(a-2)',a:'a²-4',e:'平方差公式'},
    {id:116,title:'因式分解',diff:3,q:'分解因式：x²-9',a:'(x+3)(x-3)',e:'平方差公式逆用'},
    {id:117,title:'分式运算',diff:3,q:'计算：1/2+1/3',a:'5/6',e:'通分：分母6，分子3+2=5'},
    {id:118,title:'统计初步',diff:2,q:'数据2,3,3,4,5,5,5的众数是？',a:'5',e:'出现次数最多的数'},
    {id:119,title:'概率初步',diff:2,q:'抛硬币，正面朝上的概率是？',a:'1/2',e:'等可能性事件'},
    {id:120,title:'几何证明',diff:4,q:'证明：等腰三角形两底角相等',a:'通过作高可证',e:'利用等腰三角形三线合一'},
    {id:121,title:'绝对值方程',diff:3,q:'解方程：|x-3|=5',a:'x=8或x=-2',e:'x-3=5或x-3=-5'},

    {id:122,title:'有理数比较',diff:2,q:'比较大小：-3 ○ -5',a:'-3 > -5',e:'负数比较，绝对值大的反而小'},
    {id:123,title:'整式加减',diff:3,q:'化简：3x + 2y - x + 3y = ?',a:'2x + 5y',e:'合并同类项'},
    {id:124,title:'一元一次方程',diff:3,q:'解方程：2(x+3)=10',a:'x=2',e:'去括号，移项'}
]

const topicsMath8 = [{id:401,title:'全等三角形',diff:3,q:'AB=DE，AC=DF，BC=EF，能判定△ABC≌△DEF吗？',a:'能，SSS',e:'三边对应相等全等'},{id:402,title:'等腰三角形',diff:3,q:'等腰三角形一个底角为50°，顶角为？',a:'80°',e:'底角×2+顶角=180°'},{id:403,title:'勾股定理',diff:3,q:'直角三角形两直角边为5和12，斜边为？',a:'13',e:'5²+12²=25+144=169=13²'},{id:404,title:'一次函数',diff:3,q:'函数y=2x-3，x=4时，y=？',a:'5',e:'代入计算：2×4-3=5'},{id:405,title:'一次函数图像',diff:3,q:'y=kx+b，k>0，b<0，图像经过哪些象限？',a:'一、三、四象限',e:'k>0过一三，b<0与y轴负半轴相交'},{id:406,title:'二元一次方程组',diff:3,q:'解方程组：3x+2y=13, x-y=3',a:'x=19/5, y=4/5',e:'代入法或加减消元法'},{id:407,title:'分式方程',diff:3,q:'解方程：1/(x-1)=2/x',a:'x=2',e:'去分母，检验增根'},{id:408,title:'反比例函数',diff:3,q:'反比例函数y=6/x，当x=3时，y=？',a:'2',e:'代入：6÷3=2'},{id:409,title:'四边形',diff:3,q:'平行四边形的对角线具有什么性质？',a:'互相平分',e:'平行四边形对角线互相平分'},{id:410,title:'菱形判定',diff:4,q:'对角线互相垂直平分的四边形是什么？',a:'菱形',e:'菱形的判定定理'},{id:411,title:'矩形性质',diff:3,q:'矩形的对角线长度相等吗？',a:'相等',e:'矩形对角线相等'},{id:412,title:'梯形中位线',diff:3,q:'梯形上底2，下底4，中位线长为？',a:'3',e:'中位线=(上底+下底)÷2'},{id:413,title:'数据分析',diff:3,q:'数据2,3,4,5,6的方差是？',a:'2',e:'先求平均数，再求方差'},{id:414,title:'概率计算',diff:3,q:'袋中有3红2白球，摸到红球的概率是？',a:'3/5',e:'概率=红球数÷总球数'},{id:415,title:'相似三角形',diff:4,q:'两个相似三角形相似比3:2，面积比是？',a:'9:4',e:'面积比=相似比的平方'},{id:416,title:'黄金分割',diff:3,q:'点C把线段AB分成AC/AB=BC/AC，则AC/AB=？',a:'(√5-1)/2≈0.618',e:'黄金分割比'},{id:417,title:'三角函数',diff:3,q:'在Rt△ABC中，∠C=90°，AC=3，BC=4，sinA=？',a:'4/5',e:'sinA=对边/斜边'},{id:418,title:'圆的基本性质',diff:3,q:'圆的半径为5，圆上一点到圆心的距离是？',a:'5',e:'圆上点到圆心距离等于半径'},{id:419,title:'一次函数与方程',diff:3,q:'直线y=2x-5与x轴的交点坐标是？',a:'(2.5,0)',e:'令y=0，解2x-5=0'},{id:420,title:'一次函数综合',diff:4,q:'已知一次函数y=kx+b，经过(1,3)和(2,5)，求k和b',a:'k=2,b=1',e:'代入两点求方程组'},{id:421,title:'四边形判定',diff:4,q:'一组邻边相等的平行四边形是什么？',a:'菱形',e:'菱形的定义'},{id:422,title:'正方形性质',diff:3,q:'正方形的对角线具有哪些性质？',a:'相等、垂直、平分',e:'正方形具有矩形和菱形的全部性质'},{id:423,title:'数据分析综合',diff:3,q:'数据3,5,7,9,11的中位数是？',a:'7',e:'中位数是排序后的中间值'},{id:424,title:'概率应用',diff:3,q:'同时抛两枚硬币，至少有一枚正面朝上的概率是？',a:'3/4',e:'总情况4种，至少一正有3种'}]

const topicsMath9 = [{id:701,title:'一元二次方程',diff:3,q:'解方程：x²-5x+6=0',a:'x₁=2, x₂=3',e:'因式分解：(x-2)(x-3)=0'},{id:702,title:'配方法',diff:3,q:'用配方法解：x²+4x-5=0',a:'x₁=1, x₂=-5',e:'配成(x+2)²=9'},{id:703,title:'求根公式',diff:3,q:'求根公式中，Δ>0时方程有几根？',a:'两个不相等的实数根',e:'判别式决定根的个数'},{id:704,title:'韦达定理',diff:4,q:'方程x²-3x+2=0的两根x₁+x₂=？',a:'3',e:'韦达定理：x₁+x₂=-b/a'},{id:705,title:'二次函数最值',diff:3,q:'求y=x²-4x+3的最小值',a:'-1',e:'顶点公式或配方法'},{id:706,title:'二次函数图像',diff:3,q:'抛物线y=ax²+bx+c开口向下，则a____0',a:'<',e:'开口向下a<0'},{id:707,title:'二次函数与方程',diff:4,q:'抛物线y=x²-4x+3与x轴的交点坐标是？',a:'(1,0)和(3,0)',e:'令y=0，解方程'},{id:708,title:'圆的综合',diff:4,q:'圆O半径5，P在圆内，OP=3，P到圆的最短距离是？',a:'2',e:'最短=半径-OP'},{id:709,title:'圆心角弧长',diff:3,q:'圆心角60°，半径6，弧长=？',a:'2π',e:'弧长公式：nπr/180'},{id:710,title:'扇形面积',diff:3,q:'圆心角120°，半径3，扇形面积=？',a:'3π',e:'面积=nπr²/360'},{id:711,title:'正多边形',diff:3,q:'正六边形的每个内角是？',a:'120°',e:'内角和=(n-2)×180°'},{id:712,title:'三角函数',diff:3,q:'sin30°+cos60°=？',a:'1',e:'sin30°=1/2, cos60°=1/2'},{id:713,title:'解直角三角形',diff:3,q:'在Rt△ABC中，sinA=3/5，cosA=？',a:'4/5',e:'sin²A+cos²A=1'},{id:714,title:'相似三角形',diff:4,q:'△ABC∽△DEF，相似比3:1，面积比=？',a:'9:1',e:'面积比=相似比的平方'},{id:715,title:'位似图形',diff:4,q:'两个位似图形一定相似吗？',a:'一定',e:'位似是特殊的相似'},{id:716,title:'二次函数平移',diff:3,q:'将y=x²的图像向上平移2个单位，解析式是？',a:'y=x²+2',e:'上加下减'},{id:717,title:'圆与直线的位置关系',diff:3,q:'圆x²+y²=25，直线y=5，与圆的位置关系是？',a:'相切',e:'d=r时相切'},{id:718,title:'概率综合',diff:3,q:'同时抛两枚硬币，都是正面朝上的概率是？',a:'1/4',e:'总情况4种'},{id:719,title:'反比例函数',diff:3,q:'反比例函数y=6/x，当x=-2时，y=？',a:'-3',e:'代入计算'},{id:720,title:'方程与函数综合',diff:4,q:'若一元二次方程x²+mx+4=0有实数根，m的取值范围？',a:'m≤-4或m≥4',e:'Δ≥0'},{id:721,title:'圆内接四边形',diff:3,q:'圆内接四边形的对角有什么关系？',a:'对角互补',e:'圆内接四边形性质'},{id:722,title:'三角函数应用',diff:3,q:'山坡坡角30°，沿坡走100m，上升了多少米？',a:'50m',e:'h=100×sin30°'},{id:723,title:'统计综合',diff:3,q:'数据2,3,3,4,5,6,6,6的众数是？',a:'6',e:'出现次数最多的数'},{id:724,title:'函数图像与性质',diff:4,q:'二次函数y=ax²+bx+c，a>0，b²-4ac=0，图像特点？',a:'开口向上，与x轴只有1个交点',e:'顶点在x轴上'}]

const topicsChinese5 = [
    {id:301,title:'拼音拼读',diff:1,q:'"骄傲"的读音是？',a:'jiāo ào',e:'骄傲是多音字'},
    {id:302,title:'字形辨析',diff:2,q:'下列词语中没有错别字的是：A决不相同 B绝不相同 C决不不相同 D绝不相同',a:'B',e:'"决"和"绝"区别'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：同学们正在____地讨论问题。',a:'热烈',e:'讨论搭配热烈'},
    {id:304,title:'标点符号',diff:2,q:'"今天天气真好呀！"这句话用了什么标点？',a:'感叹号',e:'表示强烈感情'},
    {id:305,title:'句子排序',diff:3,q:'将句子重新排序：①于是②他③跑④很快⑤因为⑥迟到',a:'⑤①②③④',e:'因为...于是...'},
    {id:306,title:'修辞手法',diff:2,q:'"星星像眼睛"用了什么修辞？',a:'比喻',e:'把星星比作眼睛'},
    {id:307,title:'古诗默写',diff:2,q:'默写《悯农》前两句',a:'锄禾日当午，汗滴禾下土',e:'李绅名篇'},
    {id:308,title:'古诗理解',diff:2,q:'《静夜思》作者是谁？',a:'李白',e:'唐代诗人'},
    {id:309,title:'阅读理解',diff:3,q:'概括段落主要内容的方法是什么？',a:'找关键句或归纳要点',e:'段落大意概括'},
    {id:310,title:'近义词辨析',diff:2,q:'"安静"和"宁静"有什么区别？',a:'宁静程度更深',e:'近义词细微差别'},
    {id:311,title:'反义词',diff:1,q:'"高大"的反义词是？',a:'矮小',e:'反义词配对'},
    {id:312,title:'词语分类',diff:2,q:'"苹果、香蕉、椅子、葡萄"中不同类的是？',a:'椅子',e:'水果vs家具'},
    {id:313,title:'句式转换',diff:2,q:'把"我完成了作业。"改成感叹句',a:'我终于完成了作业！',e:'添加感叹词'},
    {id:314,title:'病句修改',diff:3,q:'修改：春天来了，花园里开满了五颜六色的红花。',a:'春天来了，花园里开满了五颜六色的花。',e:'五颜六色和红花矛盾'},
    {id:315,title:'缩写句子',diff:2,q:'缩写：我和爸爸一起去公园散步。',a:'我和爸爸散步。',e:'保留主谓宾'},
    {id:316,title:'扩写句子',diff:2,q:'扩写：小鸟唱歌。',a:'可爱的小鸟在枝头欢快地唱歌。',e:'添加修饰语'},
    {id:317,title:'查字典',diff:2,q:'"凹"字用部首查字法，先查什么部？',a:'凵',e:'凹的部首是凵'},
    {id:318,title:'语言表达',diff:2,q:'如何用礼貌用语向别人借书？',a:'请问可以借你的书吗？',e:'使用请、好吗等'},
    {id:319,title:'口语交际',diff:2,q:'当别人帮助了你，你该怎么说？',a:'谢谢你！',e:'表达感谢'},
    {id:320,title:'写作要素',diff:2,q:'记叙文的六要素是什么？',a:'时间、地点、人物、起因、经过、结果',e:'记叙文要素'},
    {id:321,title:'名著阅读',diff:2,q:'《西游记》中孙悟空使用的兵器叫什么？',a:'如意金箍棒',e:'东海龙宫的定海神针'},

    {id:322,title:'古诗理解',diff:2,q:'《静夜思》中举头望明月的下一句是？',a:'低头思故乡',e:'李白思乡名句'},
    {id:323,title:'词语搭配',diff:2,q:'下列词语搭配正确的是？',a:'保护环境',e:'动词与名词搭配'},
    {id:324,title:'句子排序',diff:3,q:'将句子排序：(1)天黑了 (2)我回家了 (3)放学了 (4)写作业',a:'3-1-2-4',e:'按事情发展顺序'}
]

const topicsChinese6 = [
    {id:301,title:'拼音拼读',diff:1,q:'"水平"的读音是？',a:'shuǐ píng',e:'声调正确标注'},
    {id:302,title:'字形辨析',diff:2,q:'"戊"和"戌"的区别是？',a:'笔画不同',e:'戊wù戌xū'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：他_____地望着远方。',a:'凝视',e:'凝视表示专注地看'},
    {id:304,title:'成语运用',diff:2,q:'用"专心致志"造句',a:'同学们专心致志地听讲。',e:'形容精神集中'},
    {id:305,title:'病句修改',diff:3,q:'修改：通过讨论，使我们提高了认识。',a:'通过讨论，我们提高了认识。',e:'缺少主语'},
    {id:306,title:'修辞手法',diff:2,q:'"月光如银"用了什么修辞？',a:'比喻',e:'把月光比作银'},
    {id:307,title:'古诗理解',diff:3,q:'《春夜喜雨》中"随风潜入夜"的"潜"是什么意思？',a:'悄悄',e:'形容春雨细密无声'},
    {id:308,title:'古诗鉴赏',diff:3,q:'《望天门山》写了什么景物？',a:'天门山、楚江、帆船',e:'李白写景诗'},
    {id:309,title:'文言文翻译',diff:3,q:'翻译：学而时习之',a:'学了知识后按时复习',e:'《论语》名句'},
    {id:310,title:'文言虚词',diff:3,q:'"之"在"学而时习之"中的用法是？',a:'代词',e:'指代所学知识'},
    {id:311,title:'说明方法',diff:2,q:'"这座塔高约50米"用了什么说明方法？',a:'列数字',e:'用具体数字说明'},
    {id:312,title:'说明文语言',diff:3,q:'说明文语言有什么特点？',a:'准确性、严谨性',e:'科学性和真实性'},
    {id:313,title:'议论文要素',diff:2,q:'议论文的三要素是？',a:'论点、论据、论证',e:'议论文结构'},
    {id:314,title:'论证方法',diff:3,q:'举例说明"勤奋出天才"，用了什么论证方法？',a:'举例论证',e:'通过事例证明'},
    {id:315,title:'段落层次',diff:3,q:'划分段落层次的方法有哪些？',a:'按时间、空间、逻辑',e:'段落结构分析'},
    {id:316,title:'标题作用',diff:3,q:'分析《桥》这篇课文的标题作用',a:'象征、激发兴趣、线索',e:'标题的多重作用'},
    {id:317,title:'人物描写',diff:2,q:'"他高高的个子"用了什么描写方法？',a:'外貌描写',e:'对人物外形的描写'},
    {id:318,title:'环境描写',diff:2,q:'小说中开头描写恶劣天气有什么作用？',a:'渲染气氛、烘托心情',e:'环境描写作用'},
    {id:319,title:'写作手法',diff:3,q:'"一切景语皆情语"是什么意思？',a:'景物描写反映人物情感',e:'情景交融'},
    {id:320,title:'名著阅读',diff:2,q:'《鲁滨逊漂流记》作者是谁？',a:'笛福',e:'英国作家'},
    {id:321,title:'综合实践',diff:2,q:'开展"读书分享会"，需要准备什么？',a:'好书推荐、分享稿',e:'活动准备'},

    {id:322,title:'修辞手法',diff:2,q:'太阳公公露出了笑脸是什么修辞？',a:'拟人',e:'把太阳当成人来写'},
    {id:323,title:'词语理解',diff:2,q:'眉开眼笑的意思是？',a:'形容高兴的样子',e:'眉头舒展，眼睛带笑'},
    {id:324,title:'段落大意',diff:3,q:'概括段落主要内容的常用方法是？',a:'找中心句',e:'中心句通常在段首或段尾'}
]

const topicsChinese7 = [
    {id:301,title:'拼音拼读',diff:1,q:'"兴奋"的读音是？',a:'xīng fèn',e:'兴读xīng时表示精神旺盛'},
    {id:302,title:'字形辨析',diff:2,q:'下列词语中没有错别字的一项：A辩论 B辨论 C辩沦 D辨论',a:'A',e:'辩论的"辩"是言字旁'},
    {id:303,title:'词语搭配',diff:2,q:'依次填入：我对未来充满____的信心。',a:'无限',e:'信心搭配"无限"'},
    {id:304,title:'成语运用',diff:2,q:'使用成语"千姿百态"正确的一项是？',a:'花园里百花盛开，千姿百态',e:'形容姿态多种多样'},
    {id:305,title:'病句修改',diff:3,q:'修改：春天的杭州是一年中最美的季节。',a:'杭州的春天是一年中最美的季节',e:'主语和宾语搭配不当'},
    {id:306,title:'仿写句子',diff:2,q:'仿写：书籍是人类进步的阶梯。',a:'知识是通向成功的桥梁',e:'抓住比喻修辞'},
    {id:307,title:'记叙文阅读',diff:3,q:'概括本文的主要内容（不超过30字）',a:'见文章',e:'抓住时间、地点、人物、事件'},
    {id:308,title:'说明方法',diff:2,q:'文中画线句使用了什么说明方法？',a:'举例子/列数字/打比方',e:'常见说明方法'},
    {id:309,title:'文言实词',diff:3,q:'解释"温故而知新"中"故"的意思',a:'旧的、旧的知识',e:'故：旧也'},
    {id:310,title:'文言虚词',diff:3,q:'"之"在"学而时习之"中的用法是？',a:'代词，指代所学知识',e:'之：代词'},
    {id:311,title:'翻译句子',diff:3,q:'翻译：学而不思则罔，思而不学则殆',a:'只学习不思考会迷惑，只思考不学习会有危害',e:'孔子学习方法论'},
    {id:312,title:'文学常识',diff:2,q:'《论语》是____的经典著作',a:'儒家',e:'《论语》是儒家经典'},
    {id:313,title:'修辞手法',diff:2,q:'"春天像小姑娘"使用了什么修辞？',a:'比喻',e:'把春天比作小姑娘'},
    {id:314,title:'标点符号',diff:2,q:'下列句子中冒号使用正确的是？',a:'总说后用冒号',e:'冒号用在总说后'},
    {id:315,title:'综合性学习',diff:2,q:'开展"少年正是读书时"活动，设计两个形式',a:'读书分享会、好书推荐卡',e:'设计要有可操作性'},
    {id:316,title:'名著阅读',diff:2,q:'《西游记》中"大闹天宫"的主人公是谁？',a:'孙悟空',e:'齐天大圣孙悟空'},
    {id:317,title:'语言表达',diff:3,q:'对"开卷有益"和"开卷未必有益"进行评述',a:'见观点',e:'要有自己的思考'},
    {id:318,title:'信息提取',diff:2,q:'从新闻中提取五个W',a:'When Where Who What Why',e:'新闻要素提取'},
    {id:319,title:'口语交际',diff:2,q:'当同学向你借书时，如何礼貌拒绝？',a:'使用礼貌用语',e:'表达原因'},
    {id:320,title:'写作训练',diff:4,q:'以"我的成长故事"为题，写一篇记叙文',a:'见作文',e:'要素完整，感情真挚'},
    {id:321,title:'古诗默写',diff:2,q:'默写《静夜思》全诗',a:'床前明月光，疑是地上霜。举头望明月，低头思故乡。',e:'李白名篇'},

    {id:322,title:'文言实词',diff:2,q:'温故而知新中故的意思是？',a:'学过的知识',e:'故：旧的、以前的'},
    {id:323,title:'说明方法',diff:2,q:'赵州桥是一座石拱桥，长约50米用了什么说明方法？',a:'列数字',e:'用具体数据说明'},
    {id:324,title:'病句修改',diff:3,q:'修改病句：同学们基本都到齐了。',a:'去掉基本或都',e:'前后矛盾'}
]

const topicsChinese8 = [{id:601,title:'文言实词',diff:3,q:'解释"学而不厌"中"厌"的意思',a:'满足',e:'厌：满足'},{id:602,title:'文言虚词',diff:3,q:'"而"在"人不知而不愠"中的用法是？',a:'转折，却',e:'而：表转折'},{id:603,title:'句子翻译',diff:3,q:'翻译：三人行，必有我师焉',a:'几个人同行，其中必定有可以做我老师的人',e:'孔子学习态度'},{id:604,title:'名著阅读',diff:3,q:'《骆驼祥子》中祥子的最大梦想是什么？',a:'拥有一辆自己的车',e:'祥子三起三落'},{id:605,title:'说明顺序',diff:2,q:'说明文的三种顺序是？',a:'时间、空间、逻辑顺序',e:'常考说明方法'},{id:606,title:'论证方法',diff:3,q:'议论文中引用名人名言是什么论证方法？',a:'道理论证',e:'摆事实、讲道理'},{id:607,title:'记叙顺序',diff:2,q:'文章开头回忆往事，用了什么记叙顺序？',a:'倒叙',e:'先把结果说出来'},{id:608,title:'描写方法',diff:2,q:'"她的眼睛像星星一样明亮"是什么描写？',a:'比喻描写',e:'用比喻修辞的描写'},{id:609,title:'段落作用',diff:3,q:'文章开头第一段有什么作用？',a:'引出下文/设置悬念/点明主题',e:'开头段落作用'},{id:610,title:'标题含义',diff:3,q:'分析散文标题"背影"的深层含义',a:'父亲的背影，蕴含深沉父爱',e:'表层义+深层义'},{id:611,title:'句子赏析',diff:3,q:'从修辞角度赏析："春天像刚落地的娃娃..."',a:'比喻、拟人，赞美春天的生机',e:'修辞+内容+情感'},{id:612,title:'人物形象',diff:3,q:'分析《藤野先生》中藤野先生的性格特点',a:'正直、热情、没有民族偏见',e:'结合文中事例'},{id:613,title:'古诗词鉴赏',diff:3,q:'"海内存知己，天涯若比邻"用了什么手法？',a:'对偶、夸张',e:'字数相等、结构相同'},{id:614,title:'诗歌情感',diff:3,q:'《望岳》表达了诗人怎样的情感？',a:'赞美祖国山河，抒发抱负',e:'杜甫早期诗作'},{id:615,title:'文言文断句',diff:3,q:'用"/"给"学而时习之不亦说乎"断句',a:'学而时习之/不亦说乎',e:'按意义停顿'},{id:616,title:'语法知识',diff:2,q:'下列句子中"之"的用法不同于其他的是？',a:'见选项',e:'之：代词、助词、动词'},{id:617,title:'语段压缩',diff:3,q:'将100字的段落压缩为30字',a:'见段落',e:'保留主要信息'},{id:618,title:'口语交际',diff:2,q:'如何劝导沉迷网络的同学？',a:'注意称呼、语气',e:'委婉劝导'},{id:619,title:'说明方法',diff:2,q:'"石油的储量是中东地区的三倍"用了什么说明方法？',a:'列数字',e:'用具体数字说明'},{id:620,title:'议论文结构',diff:3,q:'议论文常见的结构是？',a:'总分总',e:'引论、本论、结论'},{id:621,title:'记叙文线索',diff:3,q:'《背影》以什么为线索？',a:'父亲的背影',e:'找出贯穿全文的脉络'},{id:622,title:'古文翻译',diff:3,q:'翻译"学而不思则罔，思而不学则殆"',a:'只学习不思考会迷惑，只思考不学习会倦怠',e:'学和思要结合'},{id:623,title:'修辞手法',diff:2,q:'"飞流直下三千尺"用了什么修辞？',a:'夸张',e:'夸大事实'},{id:624,title:'作文立意',diff:3,q:'如何让作文立意更深刻？',a:'由现象到本质，由个人到社会',e:'层层深入思考'}]

const topicsChinese9 = [{id:'C9-001',title:'《岳阳楼记》表达了作者怎样的政治理想？',q:'《岳阳楼记》表达了作者怎样的政治理想？',options:['先天下之忧而忧，后天下之乐而乐', '安得广厦千万间', '人生自古谁无死', '采菊东篱下'],answer:0,a:0,e:'表达了作者\"先天下之忧而忧，后天下之乐而乐\"的政治理想。',explanation:'表达了作者\"先天下之忧而忧，后天下之乐而乐\"的政治理想。'},{id:'C9-002',title:'《出师表》中诸葛亮提出的治国建议的核心是什么？',q:'《出师表》中诸葛亮提出的治国建议的核心是什么？',options:['依法治国', '任人唯贤', '以德服人', '兼爱非攻'],answer:1,a:1,e:'核心是推荐人才，任人唯贤。',explanation:'核心是推荐人才，任人唯贤。'},{id:'C9-003',title:'《醉翁亭记》的主旨句是？',q:'《醉翁亭记》的主旨句是？',options:['醉翁之意不在酒', '在乎山水之间也', '山水之乐，得之心而寓之酒也', '人知从太守游而乐'],answer:0,a:0,e:'主旨句是\"醉翁之意不在酒\"，表达了作者寄情山水的情怀。',explanation:'主旨句是\"醉翁之意不在酒\"，表达了作者寄情山水的情怀。'},{id:'C9-004',title:'《鱼我所欲也》论证的核心方法是？',q:'《鱼我所欲也》论证的核心方法是？',options:['比喻论证', '对比论证', '类比论证', '举例论证'],answer:1,a:1,e:'运用了\"舍生取义\"与\"见利忘义\"的对比论证。',explanation:'运用了\"舍生取义\"与\"见利忘义\"的对比论证。'},{id:'C9-005',title:'《生于忧患，死于安乐》的中心论点是？',q:'《生于忧患，死于安乐》的中心论点是？',options:['生于忧患', '死于安乐', '然后知生于忧患而死于安乐也', '天将降大任于斯人'],answer:2,a:2,e:'文章通过列举历史人物，论证了忧患使人生存、安乐使人灭亡的道理。',explanation:'文章通过列举历史人物，论证了忧患使人生存、安乐使人灭亡的道理。'},{id:'C9-006',title:'《曹刿论战》中\"远谋\"体现在哪些方面？',q:'《曹刿论战》中\"远谋\"体现在哪些方面？',options:['政治上取信于民', '军事上知己知彼', '战争中善于观察', '战后总结经验'],answer:0,a:0,e:'曹刿认为\"小大之狱，虽不能察，必以情\"是作战的根本条件。',explanation:'曹刿认为\"小大之狱，虽不能察，必以情\"是作战的根本条件。'},{id:'C9-007',title:'《送东阳马生序》的主题是？',q:'《送东阳马生序》的主题是？',options:['送别之情', '勤奋学习', '安贫乐道', '思念故友'],answer:1,a:1,e:'通过自身经历勉励后辈勤奋学习。',explanation:'通过自身经历勉励后辈勤奋学习。'},{id:'C9-008',title:'《论语》中\"己所不欲，勿施于人\"属于儒家哪一核...',q:'《论语》中\"己所不欲，勿施于人\"属于儒家哪一核心思想？',options:['仁', '义', '礼', '孝'],answer:0,a:0,e:'体现儒家\"仁\"的核心思想。',explanation:'体现儒家\"仁\"的核心思想。'},{id:'C9-009',title:'《马说》中千里马被埋没的根本原因是？',q:'《马说》中千里马被埋没的根本原因是？',options:['食不饱', '力不足', '才美不外见', '食马者不知其能千里'],answer:3,a:3,e:'根本原因是统治者不能识别和重用人才。',explanation:'根本原因是统治者不能识别和重用人才。'},{id:'C9-010',title:'《白雪歌送武判官归京》中咏雪的千古名句是？',q:'《白雪歌送武判官归京》中咏雪的千古名句是？',options:['北风卷地白草折', '胡天八月即飞雪', '忽如一夜春风来', '纷纷暮雪下辕门'],answer:2,a:2,e:'\"忽如一夜春风来，千树万树梨花开\"以春花喻冬雪，成为咏雪名句。',explanation:'\"忽如一夜春风来，千树万树梨花开\"以春花喻冬雪，成为咏雪名句。'},{id:'C9-011',title:'《茅屋为秋风所破歌》表达了诗人怎样的情怀？',q:'《茅屋为秋风所破歌》表达了诗人怎样的情怀？',options:['个人悲叹', '忧国忧民', '隐居避世', '及时行乐'],answer:1,a:1,e:'杜甫由己及人，推己及人，表达了对天下寒士的关爱。',explanation:'杜甫由己及人，推己及人，表达了对天下寒士的关爱。'},{id:'C9-012',title:'《过零丁洋》中表明作者以死明志的诗句是？',q:'《过零丁洋》中表明作者以死明志的诗句是？',options:['辛苦遭逢起一经', '干戈寥落四周星', '人生自古谁无死', '留取丹心照汗青'],answer:3,a:3,e:'\"留取丹心照汗青\"表达了诗人以死报国的决心。',explanation:'\"留取丹心照汗青\"表达了诗人以死报国的决心。'},{id:'C9-013',title:'《天净沙·秋思》的情感基调是？',q:'《天净沙·秋思》的情感基调是？',options:['欢快', '悲凉', '激昂', '闲适'],answer:1,a:1,e:'通过萧瑟秋景和漂泊游子形象，表达浓烈的思乡之情。',explanation:'通过萧瑟秋景和漂泊游子形象，表达浓烈的思乡之情。'},{id:'C9-014',title:'《水调歌头·明月几时有》的词眼是？',q:'《水调歌头·明月几时有》的词眼是？',options:['明月几时有', '我欲乘风归去', '高处不胜寒', '但愿人长久'],answer:3,a:3,e:'\"但愿人长久，千里共婵娟\"表达了词人对亲人的美好祝愿。',explanation:'\"但愿人长久，千里共婵娟\"表达了词人对亲人的美好祝愿。'},{id:'C9-015',title:'《春望》中\"烽火连三月\"的下一句是？',q:'《春望》中\"烽火连三月\"的下一句是？',options:['家书抵万金', '白头搔更短', '恨别鸟惊心', '浑欲不胜簪'],answer:0,a:0,e:'这句诗表达了战乱时期对亲人的思念。',explanation:'这句诗表达了战乱时期对亲人的思念。'},{id:'C9-016',title:'《渔家傲·秋思》的情感是？',q:'《渔家傲·秋思》表达了怎样的情感？',options:['乐观旷达', '思乡爱国', '隐居归隐', '怀才不遇'],answer:1,a:1,e:'词中\"浊酒一杯家万里\"表达了戍边将士的思乡之情。',explanation:'词中\"浊酒一杯家万里\"表达了戍边将士的思乡之情。'},{id:'C9-017',title:'《江城子·密州出猎》的主题是？',q:'《江城子·密州出猎》的主题是？',options:['田园生活', '报国杀敌', '送别友人', '思乡之情'],answer:1,a:1,e:'表达了苏轼渴望报效国家、建功立业的壮志豪情。',explanation:'表达了苏轼渴望报效国家、建功立业的壮志豪情。'},{id:'C9-018',title:'《破阵子·为陈同甫赋壮词以寄之》的情感是？',q:'《破阵子·辛弃疾》表达了怎样的情感？',options:['田园闲适', '壮志难酬', '离愁别绪', '山水田园'],answer:1,a:1,e:'词中\"可怜白发生\"表达了壮志未酬的悲愤。',explanation:'词中\"可怜白发生\"表达了壮志未酬的悲愤。'},{id:'C9-019',title:'《满江红》作者是？',q:'《满江红·写怀》的作者是？',options:['苏轼', '辛弃疾', '岳飞', '陆游'],answer:2,a:2,e:'岳飞是南宋抗金名将，《满江红》是其代表作。',explanation:'岳飞是南宋抗金名将，《满江红》是其代表作。'},{id:'C9-020',title:'《十五从军征》反映的主题是？',q:'《十五从军征》反映了什么社会问题？',options:['科举制度', '兵役制度', '赋税繁重', '土地兼并'],answer:1,a:1,e:'反映了古代兵役制度的残酷和百姓的苦难。',explanation:'反映了古代兵役制度的残酷和百姓的苦难。'},{id:'C9-021',title:'《白雪歌送武判官归京》中的\"胡琴琵琶与羌笛\"是用来？',q:'《白雪歌送武判官归京》中的\"胡琴琵琶与羌笛\"是用来？',options:['庆祝凯旋', '送别友人', '战争动员', '宫廷演奏'],answer:1,a:1,e:'渲染了送别时的悲凉气氛。',explanation:'渲染了送别时的悲凉气氛。'},{id:'C9-022',title:'《南乡子·登京口北固亭有怀》的作者是？',q:'《南乡子·登京口北固亭有怀》的作者是？',options:['苏轼', '辛弃疾', '李清照', '岳飞'],answer:1,a:1,e:'辛弃疾的代表作，借古讽今，抒发爱国情怀。',explanation:'辛弃疾的代表作，借古讽今，抒发爱国情怀。'},{id:'C9-023',title:'《山坡羊·潼关怀古》的主旨是？',q:'《山坡羊·潼关怀古》的主旨句是？',options:['兴，百姓苦', '亡，百姓苦', '宫阙万间都做了土', '伤心秦汉经行处'],answer:1,a:1,e:'\"兴，百姓苦；亡，百姓苦\"揭示了封建社会的本质。',explanation:'\"兴，百姓苦；亡，百姓苦\"揭示了封建社会的本质。'},{id:'C9-024',title:'《定风波》表达了词人怎样的态度？',q:'《定风波·莫听穿林打叶声》表达了词人怎样的态度？',options:['消沉悲观', '旷达乐观', '愤世嫉俗', '归隐山林'],answer:1,a:1,e:'表达了苏轼面对人生风雨时的旷达超脱态度。',explanation:'表达了苏轼面对人生风雨时的旷达超脱态度。'}]

const topicsEnglish5 = [
    {id:201,title:'一般现在时',diff:2,q:'She ____ (have) a cat.',a:'has',e:'第三人称单数动词加s/es'},
    {id:202,title:'现在进行时',diff:2,q:'He ____ (read) a book now.',a:'is reading',e:'be+动词ing'},
    {id:203,title:'情态动词',diff:2,q:'I ____ swim in the river.',a:'can',e:'can表示能力'},
    {id:204,title:'方位介词',diff:2,q:'The book is ____ the table.',a:'on',e:'on表示在...上面'},
    {id:205,title:'there be句型',diff:2,q:'____ a beautiful flower in the garden.',a:'There is',e:'就近原则'},
    {id:206,title:'特殊疑问句',diff:2,q:'____ is your name?',a:'What',e:'what问姓名'},
    {id:207,title:'形容词比较级',diff:2,q:'Tom is ____ (tall) than Jim.',a:'taller',e:'比较级加er'},
    {id:208,title:'一般过去时',diff:2,q:'Yesterday, I ____ (go) to school.',a:'went',e:'过去式不规则变化'},
    {id:209,title:'时间表达',diff:1,q:'7:15用英语怎么说？',a:'Seven fifteen / Quarter past seven',e:'时间表达方式'},
    {id:210,title:'可数不可数',diff:2,q:'____ (water) is important.',a:'Water',e:'水是不可数名词'},
    {id:211,title:'some/any',diff:2,q:'Are there ____ apples on the table?',a:'any',e:'否定疑问用any'},
    {id:212,title:'祈使句',diff:2,q:'____ (not run) in the hallway!',a:"Don't run",e:'否定祈使句用Don\'t'},
    {id:213,title:'人称代词',diff:1,q:'This is ____ (I) book.',a:'my',e:'物主代词修饰名词'},
    {id:214,title:'like doing',diff:2,q:'I like ____ (swim).',a:'swimming',e:'like+动词ing'},
    {id:215,title:'选择疑问句',diff:2,q:'Is it red ____ blue?',a:'or',e:'or表示选择'},
    {id:216,title:'频率副词',diff:2,q:'He ____ (always/often) comes late.',a:'often',e:'频率副词位置'},
    {id:217,title:'现在进行时构成',diff:2,q:'____ (be) you listening?',a:'Are',e:'be+主语+动词ing'},
    {id:218,title:'名词复数',diff:2,q:'There are five ____ (child) in the room.',a:'children',e:'child的复数是children'},
    {id:219,title:'whose句型',diff:2,q:'____ coat is this?',a:'Whose',e:'whose问所属'},
    {id:220,title:'情态动词can',diff:2,q:'____ you speak English?',a:'Can',e:'can的一般疑问句'},
    {id:221,title:'词汇运用',diff:2,q:'Monday, Tuesday, ____ (Wednesday)',a:'Wednesday',e:'一周顺序'},

    {id:222,title:'一般现在时',diff:2,q:'She ___ breakfast every morning.',a:'eats',e:'第三人称单数用eats'},
    {id:223,title:'方位介词',diff:2,q:'The cat is ___ the table.',a:'under',e:'under表示在下面'},
    {id:224,title:'复数形式',diff:2,q:'How many ___ do you have?',a:'books',e:'book的复数是books'}
]

const topicsEnglish6 = [
    {id:201,title:'一般现在时',diff:2,q:'My mother ____ (work) in a hospital.',a:'works',e:'第三人称单数动词加s'},
    {id:202,title:'现在进行时',diff:2,q:'Look! The birds ____ (fly) in the sky.',a:'are flying',e:'现在进行时be+ing'},
    {id:203,title:'一般过去时',diff:2,q:'Last weekend, I ____ (visit) my grandparents.',a:'visited',e:'过去时间用过去式'},
    {id:204,title:'一般将来时',diff:2,q:'I ____ (go) to Beijing tomorrow.',a:'will go',e:'tomorrow用will'},
    {id:205,title:'现在完成时',diff:3,q:'I ____ (read) this book. It is very interesting.',a:'have read',e:'现在完成时强调结果'},
    {id:206,title:'情态动词must',diff:2,q:'You ____ (must) do your homework first.',a:'must',e:'must表示必须'},
    {id:207,title:'形容词比较级',diff:2,q:'The blue whale is the ____ (big) animal.',a:'biggest',e:'最高级前加the'},
    {id:208,title:'副词比较级',diff:2,q:'He runs ____ (fast) than me.',a:'faster',e:'副词比较级加er'},
    {id:209,title:'过去进行时',diff:3,q:'I ____ (read) when he called.',a:'was reading',e:'过去进行时was/were+ing'},
    {id:210,title:'there be将来时',diff:3,q:'There ____ (be) a concert tomorrow.',a:'will be / is going to be',e:'there be的一般将来时'},
    {id:211,title:'被动语态',diff:3,q:'The song ____ (sing) by millions of people.',a:'is sung',e:'一般现在时被动语态'},
    {id:212,title:'if条件句',diff:3,q:'If it ____ (rain), I will stay home.',a:'rains',e:'主将从现'},
    {id:213,title:'宾语从句',diff:3,q:'I think that he ____ (be) right.',a:'is',e:'宾语从句用陈述语序'},
    {id:214,title:'直接间接引语',diff:3,q:'She said, "I am happy." 改为间接引语',a:'She said that she was happy.',e:'人称和时态变化'},
    {id:215,title:'used to',diff:3,q:'I ____ (use to) play with dolls.',a:'used to',e:'used to表示过去习惯'},
    {id:216,title:'动名词做主语',diff:2,q:'____ (read) is my hobby.',a:'Reading',e:'动名词可做主语'},
    {id:217,title:'短语动词',diff:2,q:'Please pick ____ the book.',a:'up',e:'pick up捡起'},
    {id:218,title:'介词辨析',diff:2,q:'We will meet ____ 7 o\'clock ____ the morning.',a:'at / in',e:'at+时间点，in+早中晚'},
    {id:219,title:'复合形容词',diff:2,q:'a five-year-old boy 画线部分提问',a:'How old',e:'对年龄提问'},
    {id:220,title:'感叹句',diff:2,q:'改为感叹句：The flower is beautiful.',a:'How beautiful the flower is!',e:'How+adj+主谓'},
    {id:221,title:'阅读理解策略',diff:3,q:'阅读理解中，如何找主旨大意？',a:'看首段和末段',e:'阅读技巧'},

    {id:222,title:'一般过去时',diff:2,q:'Yesterday, I ___ to school.',a:'went',e:'go的过去式是went'},
    {id:223,title:'情态动词',diff:2,q:'___ I help you?',a:'Can',e:'can表示能力或许可'},
    {id:224,title:'there be句型',diff:2,q:'___ a book and a pen on the desk.',a:'There are',e:'复数用are'}
]

const topicsEnglish7 = [
    {id:201,title:'一般现在时',diff:2,q:'He ____ (go) to school every day.',a:'goes',e:'第三人称单数动词加s'},
    {id:202,title:'现在进行时',diff:2,q:'Look! The children ____ (play) in the park.',a:'are playing',e:'look提示进行时，be+ing'},
    {id:203,title:'一般过去时',diff:2,q:'Yesterday, I ____ (visit) my grandmother.',a:'visited',e:'过去时间用过去式'},
    {id:204,title:'一般将来时',diff:2,q:'We ____ (go) to Beijing next week.',a:'will go',e:'next week提示将来时'},
    {id:205,title:'现在完成时',diff:3,q:'I ____ (read) this book three times.',a:'have read',e:'现在完成时：have/has+过去分词'},
    {id:206,title:'名词所有格',diff:2,q:'____ (Tom) books are on the desk.',a:"Tom's",e:'名词所有格加\'s'},
    {id:207,title:'人称代词',diff:1,q:'____ is my teacher. ____ name is Mrs. Li.',a:'She / Her',e:'主格作主语，所有格作定语'},
    {id:208,title:'形容词比较级',diff:2,q:'Tom is ____ (tall) than Jack.',a:'taller',e:'than提示比较级，加er'},
    {id:209,title:'形容词最高级',diff:2,q:'Lucy is the ____ (beautiful) girl in our class.',a:'most beautiful',e:'最高级前加the'},
    {id:210,title:'副词位置',diff:2,q:'She speaks English ____ (fluent).',a:'fluently',e:'修饰动词用副词'},
    {id:211,title:'情态动词',diff:2,q:'You ____ (must) finish your homework first.',a:'must',e:'must必须，表示必要性'},
    {id:212,title:'祈使句',diff:1,q:'____ (not be) late for class again!',a:"Don't be",e:'否定祈使句用Don\'t+动词原形'},
    {id:213,title:'there be句型',diff:2,q:'____ a book and two pens on the desk.',a:'There is',e:'就近原则'},
    {id:214,title:'宾语从句',diff:3,q:'I think ____ she ____ (be) a good student.',a:'that / is',e:'that可省略，陈述语序'},
    {id:215,title:'被动语态',diff:3,q:'The letter ____ (send) yesterday.',a:'was sent',e:'一般过去时的被动语态'},
    {id:216,title:'if条件句',diff:3,q:'If it ____ (rain), I will stay at home.',a:'rains',e:'主将从现原则'},
    {id:217,title:'疑问词',diff:2,q:'____ is your name?',a:'What',e:'问姓名用what'},
    {id:218,title:'连词用法',diff:2,q:'I like English ____ my sister likes math.',a:'but',e:'转折对比关系'},
    {id:219,title:'介词填空',diff:2,q:'We have classes ____ Monday ____ Friday.',a:'from / to',e:'from...to...表示从...到...'},
    {id:220,title:'时态综合',diff:3,q:'My father ____ (work) here since 2010.',a:'has worked',e:'since+过去时间点，现在完成时'},
    {id:221,title:'动词短语',diff:2,q:'Please turn ____ the radio. It\'s too noisy.',a:'down/off',e:'turn down关小/off关掉'},
    {id:222,title:'现在进行时',diff:2,q:'Look! The students ___ their homework.',a:'are doing',e:'Look提示进行时'},
    {id:223,title:'可数不可数',diff:2,q:'There is some ___ on the table.',a:'water',e:'water是不可数名词'},
    {id:224,title:'特殊疑问词',diff:2,q:'___ is your birthday?',a:'When',e:'When问时间'}
]

const topicsEnglish8 = [{id:501,title:'现在完成时',diff:3,q:'I ____ (study) English for 3 years.',a:'have studied',e:'for+时间段，现在完成时'},{id:502,title:'被动语态',diff:3,q:'The book ____ (write) by Lu Xun.',a:'was written',e:'过去写的，一般过去时被动'},{id:503,title:'宾语从句',diff:3,q:'Do you know if he ____ (come) tomorrow?',a:'will come',e:'if引导宾语从句，表将来'},{id:504,title:'定语从句',diff:4,q:'The book ____ (that/who) I bought is interesting.',a:'that / which',e:'指物用that/which'},{id:505,title:'状语从句',diff:3,q:'____ you work harder, you won\'t pass.',a:'Unless',e:'unless除非=if...not'},{id:506,title:'情态动词',diff:2,q:'You ____ (must) have seen the movie.',a:'must',e:'must have done表示对过去的肯定推测'},{id:507,title:'非谓语动词',diff:4,q:'I saw him ____ (play) basketball.',a:'playing',e:'see sb doing看到...正在做'},{id:508,title:'形容词顺序',diff:3,q:'排列：a, beautiful, red, small, flower',a:'a beautiful small red flower',e:'限定词+大小+颜色+名词'},{id:509,title:'倒装句',diff:3,q:'Only then ____ (did he realize) the importance.',a:'did he realize',e:'Only+状语置于句首，主谓倒装'},{id:510,title:'主谓一致',diff:3,q:'Neither the teacher nor the students ____ happy.',a:'are',e:'就近一致原则'},{id:511,title:'虚拟语气',diff:4,q:'If I ____ (be) a bird, I would fly.',a:'were',e:'与现在事实相反，用were'},{id:512,title:'时态综合',diff:3,q:'By the time he came, I ____ (finish) my homework.',a:'had finished',e:'by the time+过去，主句过去完成时'},{id:513,title:'短语动词',diff:2,q:'Please look ____ the new words in the dictionary.',a:'up',e:'look up查字典'},{id:514,title:'词性转换',diff:2,q:'The news was very ____ (excite). We were all ____ (excite).',a:'exciting / excited',e:'-ing令人.../-ed感到...'},{id:515,title:'复合句',diff:3,q:'Make a sentence with "although...but..."',a:'Although he is young, he is tall.',e:'although和but不连用'},{id:516,title:'阅读理解',diff:3,q:'The main idea of paragraph 2 is...',a:'见短文',e:'找段落主题句'},{id:517,title:'完形填空',diff:3,q:'从A、B、C、D中选择最佳答案...',a:'见上下文',e:'上下文语境分析'},{id:518,title:'书面表达',diff:4,q:'写一篇关于"环保"的英语短文，80词左右',a:'见作文',e:'包含环保建议'},{id:519,title:'现在完成时深入',diff:3,q:'I have lived here since 2010. 对划线部分提问',a:'How long have you lived here?',e:'since+时间点，问段时间'},{id:520,title:'被动语态综合',diff:3,q:'改写：They will finish the work tomorrow.',a:'The work will be finished tomorrow.',e:'一般将来时的被动'},{id:521,title:'过去完成时',diff:4,q:'When I arrived, he ____ (leave).',a:'had left',e:'过去的过去，用过去完成时'},{id:522,title:'介词用法',diff:2,q:'He arrived ____ a rainy morning.',a:'on',e:'具体某天早上用on'},{id:523,title:'动词辨析',diff:3,q:'Choose the right word: Please _____ down your name.',a:'write',e:'write down写下'},{id:524,title:'阅读策略',diff:3,q:'阅读时，如何处理不认识的单词？',a:'根据上下文猜词义',e:'阅读技巧'}]

const topicsEnglish9 = [{id:801,title:'语法综合',diff:3,q:'By next year, I ____ (study) English for 5 years.',a:'will have studied',e:'by+将来时间，将来完成时'},{id:802,title:'被动语态',diff:3,q:'改写：They are building a new school.',a:'A new school is being built.',e:'现在进行时的被动'},{id:803,title:'复合句',diff:3,q:'合并：He didn\'t come. He was ill.',a:'He didn\'t come because he was ill.',e:'用because连接'},{id:804,title:'定语从句',diff:4,q:'用定语从句改写：The girl is my sister. She is singing.',a:'The girl who is singing is my sister.',e:'先行词在从句中作主语'},{id:805,title:'非谓语',diff:4,q:'I have a lot of homework ____ (do).',a:'to do',e:'have sth to do有...要做'},{id:806,title:'交际用语',diff:2,q:'如何用英语表达"我完全同意你的观点"？',a:"I can't agree more.",e:'同意的表达方式'},{id:807,title:'阅读策略',diff:3,q:'阅读理解中，如何快速找到主旨大意？',a:'看首段和末段',e:'阅读技巧'},{id:808,title:'完形技巧',diff:3,q:'完形填空中，线索词的作用是什么？',a:'帮助理解上下文，确定答案',e:'线索分析法'},{id:809,title:'写作结构',diff:3,q:'英语作文一般分为几部分？',a:'三部分：开头、主体、结尾',e:'作文结构'},{id:810,title:'词汇辨析',diff:3,q:'too much, much too, too many的用法区别',a:'too much+不可数，much too+adj，too many+复数',e:'词组辨析'},{id:811,title:'词性转换',diff:2,q:'派生：success的形容词和副词形式',a:'successful / successfully',e:'名词→形容词→副词'},{id:812,title:'句型转换',diff:3,q:'He spent two hours finishing the work. 改写',a:'It took him two hours to finish the work.',e:'spend→take句型'},{id:813,title:'疑问句',diff:2,q:'改为反意疑问句：She likes English, ____?',a:"doesn't she",e:'前肯后否'},{id:814,title:'感叹句',diff:2,q:'改为感叹句：The flower is beautiful.',a:'How beautiful the flower is!',e:'How+adj+主谓'},{id:815,title:'阅读主旨',diff:3,q:'Which is the best title for the passage?',a:'见文章内容',e:'标题要概括全文'},{id:816,title:'时态辨析',diff:3,q:'选择正确时态：Look! The baby ____ (sleep).',a:'is sleeping',e:'Look表示现在进行'},{id:817,title:'被动语态深入',diff:3,q:'改为被动语态：Someone has stolen my bike.',a:'My bike has been stolen.',e:'现在完成时的被动'},{id:818,title:'情态动词综合',diff:3,q:'You ____ (must) be tired after the long trip.',a:'must',e:'must be表示推测'},{id:819,title:'名词性从句',diff:4,q:'____ he will come is not sure.',a:'Whether',e:'if不能位于句首'},{id:820,title:'省略句',diff:3,q:'—Will you go? —Yes, I ____.',a:'will',e:'省略重复部分'},{id:821,title:'语序问题',diff:3,q:'I wonder ____.',a:'where he lives',e:'宾语从句用陈述语序'},{id:822,title:'分词作状语',diff:4,q:'____ (see) from the hill, the town looks beautiful.',a:'Seen',e:'分词作状语，主语一致用-ing'},{id:823,title:'写作开头',diff:3,q:'如何写一个吸引人的英语作文开头？',a:'用问句或引用名言',e:'写作技巧'},{id:824,title:'阅读细节',diff:3,q:'阅读时，如何快速定位细节信息？',a:'先看题目，再回原文找关键词',e:'阅读策略'}]

const topicsPhysics8 = [{id:401,title:'机械运动',diff:2,q:'一个物体做匀速直线运动，5秒内通过25米，求速度',a:'5m/s',e:'v=s/t=25/5=5m/s'},{id:402,title:'参照物',diff:2,q:'坐在行驶的汽车里，路边的树在向哪个方向运动？',a:'向后',e:'以车为参照物，树向后运动'},{id:403,title:'长度测量',diff:1,q:'用刻度尺测量物体长度，正确读数是2.35cm，测量结果应记为？',a:'2.35cm',e:'估读到分度值下一位'},{id:404,title:'时间测量',diff:2,q:'小明跑100米用了12.5秒，他的平均速度是？',a:'8m/s',e:'v=100/12.5=8m/s'},{id:405,title:'速度公式',diff:2,q:'汽车以72km/h的速度行驶，合多少m/s？',a:'20m/s',e:'72÷3.6=20m/s'},{id:406,title:'声现象',diff:2,q:'声音在15℃空气中传播速度约是多少？',a:'340m/s',e:'声速与温度有关'},{id:407,title:'音调与频率',diff:2,q:'物体振动越快，音调越？',a:'高',e:'频率越高，音调越高'},{id:408,title:'响度与振幅',diff:2,q:'用更大的力敲鼓，鼓声变？',a:'更响',e:'振幅越大，响度越大'},{id:409,title:'音色',diff:1,q:'不同乐器演奏同一首曲子，我们能区分是因为？',a:'音色不同',e:'音色由发声体本身决定'},{id:410,title:'回声测距',diff:3,q:'对着山崖喊话，2秒后听到回声，山崖距离多远？(声速340m/s)',a:'340m',e:'s=vt/2=340×2/2=340m'},{id:411,title:'温度计原理',diff:2,q:'常用温度计是利用液体什么性质制成的？',a:'热胀冷缩',e:'温度计原理'},{id:412,title:'物态变化',diff:2,q:'冬天，室外的水结冰是什么物态变化？',a:'凝固',e:'液态变固态'},{id:413,title:'熔化与凝固',diff:2,q:'0℃的冰和0℃的水，哪个内能更大？',a:'0℃的水',e:'水凝固放热，内能更大'},{id:414,title:'汽化',diff:2,q:'湿衣服变干是什么物态变化？',a:'汽化（蒸发）',e:'液态变气态'},{id:415,title:'液化',diff:2,q:'冬天呼出的白气是什么？',a:'液化的小水珠',e:'水蒸气遇冷液化'},{id:416,title:'升华与凝华',diff:3,q:'放在衣柜里的樟脑丸变小了，是什么现象？',a:'升华',e:'固态直接变气态'},{id:417,title:'光的直线传播',diff:2,q:'小孔成像说明光沿什么传播？',a:'直线',e:'光沿直线传播'},{id:418,title:'光的反射',diff:2,q:'入射光线与镜面的夹角是30°，反射角是？',a:'60°',e:'反射角=90°-30°=60°'},{id:431,title:'光的折射',diff:3,q:'光从空气斜射入水中，折射角和入射角哪个更小？',a:'折射角更小',e:'光从光疏介质进入光密介质'},{id:432,title:'凸透镜成像',diff:3,q:'物体放在凸透镜2倍焦距处，成像特点是？',a:'倒立、等大的实像',e:'u=2f时，成倒立等大的实像'},{id:433,title:'质量与密度',diff:2,q:'一块铁切去一半，剩余部分的质量和密度如何变化？',a:'质量减半，密度不变',e:'质量与体积成正比，密度是物质属性'},{id:434,title:'力的作用效果',diff:2,q:'力的三要素是？',a:'大小、方向、作用点',e:'影响力的作用效果'},{id:435,title:'二力平衡',diff:3,q:'静止在桌面上的书，受到哪两个力平衡？',a:'重力和支持力',e:'二力平衡条件'},{id:436,title:'摩擦力',diff:2,q:'滑动摩擦力与什么因素有关？',a:'压力和接触面粗糙程度',e:'与接触面积、速度无关'}]

const topicsPhysics9 = [{id:451,title:'欧姆定律',diff:3,q:'电阻两端的电压为6V，电阻为3Ω，电流是多少？',a:'2A',e:'I=U/R=6/3=2A'},{id:452,title:'电阻',diff:2,q:'导体的电阻与什么有关？',a:'材料、长度、横截面积、温度',e:'电阻是导体本身的性质'},{id:453,title:'串联电路',diff:3,q:'两个电阻R1=5Ω，R2=10Ω串联，总电阻是？',a:'15Ω',e:'串联R=R1+R2'},{id:454,title:'并联电路',diff:3,q:'两个电阻R1=5Ω，R2=10Ω并联，总电阻是？',a:'约3.3Ω',e:'并联1/R=1/R1+1/R2'},{id:455,title:'电功率',diff:3,q:'用电器两端电压220V，电流2A，电功率是？',a:'440W',e:'P=UI=220×2=440W'},{id:456,title:'电能',diff:2,q:'一盏灯100W，供电10小时，用电多少度？',a:'1度',e:'W=Pt=0.1kW×10h=1kWh'},{id:457,title:'焦耳定律',diff:3,q:'电流通过导体产生的热量与什么成正比？',a:'电流的平方、通电时间、电阻',e:'Q=I²Rt'},{id:458,title:'家庭电路',diff:2,q:'三孔插座中接地线的颜色通常是？',a:'黄绿双色',e:'安全用电常识'},{id:459,title:'安全用电',diff:2,q:'发现有人触电时，应该首先？',a:'切断电源',e:'安全用电原则'},{id:460,title:'磁现象',diff:2,q:'磁体上磁性最强的部位叫什么？',a:'磁极',e:'每个磁体有两个磁极'},{id:461,title:'磁场',diff:2,q:'地球周围存在的磁场叫什么？',a:'地磁场',e:'地磁场的应用'},{id:462,title:'电流的磁效应',diff:2,q:'通电导体周围存在什么？',a:'磁场',e:'奥斯特实验'},{id:463,title:'电磁铁',diff:2,q:'电磁铁磁性强弱与什么有关？',a:'电流大小、线圈匝数、有无铁芯',e:'电磁铁应用'},{id:464,title:'磁场对电流的作用',diff:3,q:'通电导体在磁场中会受到什么力？',a:'安培力',e:'左手定则判断方向'},{id:465,title:'电功率公式',diff:3,q:'已知电阻8Ω，电流2A，电功率是？',a:'32W',e:'P=I²R=4×8=32W'},{id:466,title:'电能计算',diff:3,q:'用电器功率1000W，工作2小时，用电多少焦？',a:'7200000J',e:'W=Pt=1000×7200=7200000J'},{id:467,title:'电路分析',diff:3,q:'两个相同灯泡串联，总电阻是单个灯泡的多少倍？',a:'2倍',e:'串联总电阻是各电阻之和'},{id:468,title:'电压关系',diff:3,q:'串联电路中，各部分电压与电阻有什么关系？',a:'成正比',e:'U1/U2=R1/R2'},{id:469,title:'电与热综合',diff:3,q:'电流通过电阻产生的热量公式是？',a:'Q=I²Rt',e:'焦耳定律公式'},{id:470,title:'电磁感应',diff:3,q:'闭合电路的一部分导体在磁场中运动，什么时候会产生电流？',a:'切割磁感线时',e:'电磁感应原理'},{id:471,title:'电动机原理',diff:3,q:'电动机的工作原理是什么？',a:'通电导体在磁场中受力',e:'电能转化为机械能'},{id:472,title:'发电机的原理',diff:3,q:'发电机的工作原理是什么？',a:'电磁感应',e:'机械能转化为电能'},{id:473,title:'动态电路',diff:4,q:'串联电路中，滑动变阻器滑片向右移动，总电阻如何变化？',a:'变大',e:'接入电路的电阻变大'},{id:474,title:'电路故障',diff:3,q:'串联电路中，一个灯泡短路，另一个灯泡亮度如何？',a:'变亮',e:'总电阻变小，总电流变大'}]



// ============================================================
// Podcasts - 播客数据
// ============================================================
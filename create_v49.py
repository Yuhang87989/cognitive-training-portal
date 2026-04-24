import re

# 读取原始文件
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修复STORAGE_KEY版本号
content = content.replace(
    "const STORAGE_KEY = 'cognitive_training_v44';",
    "const STORAGE_KEY = 'cognitive_training_v49';"
)

# 2. 添加物理和化学母题数据（在topicsMath7之前）
physics_chem_topics = '''
// 初二物理21道
const topicsPhysics8 = [
    {id:901,title:'机械运动',diff:2,q:'小明坐在行驶的汽车上，以下列哪个物体为参照物他是静止的？',a:'汽车座椅',e:'相对静止要求参照物与物体运动状态相同'},
    {id:902,title:'速度计算',diff:2,q:'汽车以60km/h的速度行驶3小时，行驶了多少公里？',a:'180km',e:'路程=速度×时间'},
    {id:903,title:'声音传播',diff:2,q:'声音在15℃空气中传播速度约为多少m/s？',a:'340m/s',e:'声音在空气中速度约为340m/s'},
    {id:904,title:'光的反射',diff:3,q:'光线与平面镜夹角30°，反射角是多少度？',a:'30°或60°',e:'反射角等于入射角，注意光线与镜面夹角的换算'},
    {id:905,title:'凸透镜成像',diff:3,q:'物体放在凸透镜2倍焦距处，成像特点是？',a:'倒立、等大、实像',e:'u=2f时，成倒立、等大的实像'},
    {id:906,title:'密度计算',diff:3,q:'一块铝块质量54g，体积20cm³，密度是多少？',a:'2.7g/cm³',e:'密度=质量÷体积'},
    {id:907,title:'力的概念',diff:2,q:'力的作用效果是什么？',a:'改变物体运动状态或使物体发生形变',e:'力可以改变运动状态或形状'},
    {id:908,title:'重力计算',diff:2,q:'质量为10kg的物体受到的重力是多少？',a:'98N',e:'G=mg，g=9.8N/kg'},
    {id:909,title:'二力平衡',diff:3,q:'静止在桌面上的书，受到的重力和支持力是什么关系？',a:'平衡力',e:'大小相等、方向相反、作用在同一直线上'},
    {id:910,title:'摩擦力',diff:3,q:'用手握住瓶子，瓶子不掉，是因为什么力？',a:'静摩擦力',e:'静摩擦力与重力平衡'},
    {id:911,title:'压强计算',diff:3,q:'重10N、底面积0.1m²的物体对水平面的压强是多少？',a:'100Pa',e:'P=F/S'},
    {id:912,title:'液体压强',diff:3,q:'在液体内部，深度越深，压强越____',a:'大',e:'液体压强随深度增加而增大'},
    {id:913,title:'大气压强',diff:2,q:'标准大气压约为多少Pa？',a:'1.01×10⁵Pa',e:'标准大气压约10⁵Pa'},
    {id:914,title:'浮力计算',diff:4,q:'在水中称量弹簧测力计示数为4N的物体，物体在水中浮力为2N，物体体积是多少？(ρ水=1×10³kg/m³)',a:'2×10⁻⁴m³',e:'F浮=ρgV排'},
    {id:915,title:'阿基米德原理',diff:3,q:'浸在液体中的物体受到的浮力等于什么？',a:'它排开的液体所受重力',e:'F浮=G排'},
    {id:916,title:'功的计算',diff:3,q:'用50N的力将物体水平移动3m，做功多少？',a:'150J',e:'W=Fs（力与移动方向一致）'},
    {id:917,title:'功率计算',diff:3,q:'机器在10s内做功500J，功率是多少W？',a:'50W',e:'P=W/t'},
    {id:918,title:'动能',diff:3,q:'物体的动能与什么因素有关？',a:'质量和速度',e:'动能与质量成正比，与速度平方成正比'},
    {id:919,title:'势能',diff:2,q:'物体的重力势能与什么因素有关？',a:'质量和高度',e:'势能与质量和高度有关'},
    {id:920,title:'机械能守恒',diff:3,q:'在只有重力或弹力做功的物体系统中，机械能____',a:'守恒',e:'机械能守恒定律'},
    {id:921,title:'杠杆平衡',diff:3,q:'杠杆动力臂是阻力臂的2倍，若阻力为100N，动力至少多少？',a:'50N',e:'F1×L1=F2×L2'}
];

// 初三化学21道
const topicsChemistry9 = [
    {id:1001,title:'化学变化',diff:2,q:'下列属于化学变化的是？',a:'燃烧',e:'燃烧有新物质生成，属于化学变化'},
    {id:1002,title:'分子原子',diff:2,q:'分子和原子的主要区别是什么？',a:'化学变化中分子可分，原子不可分',e:'分子由原子构成'},
    {id:1003,title:'元素符号',diff:1,q:'氧元素的符号是什么？',a:'O',e:'元素符号统一用拉丁文首字母'},
    {id:1004,title:'化学式',diff:2,q:'水的化学式是什么？',a:'H₂O',e:'水由氢氧两种元素组成'},
    {id:1005,title:'化合价',diff:3,q:'说出常见元素的化合价规则',a:'氢+1，氧-2，金属正价',e:'化合物中化合价代数和为零'},
    {id:1006,title:'质量守恒',diff:3,q:'在化学反应前后，什么不变？',a:'物质总质量',e:'质量守恒定律'},
    {id:1007,title:'化学方程式',diff:3,q:'配平：C + O₂ → CO₂',a:'C + O₂ =点燃= CO₂',e:'方程两边原子种类和数目相等'},
    {id:1008,title:'氧气性质',diff:2,q:'氧气能使带火星的木条怎样？',a:'复燃',e:'氧气支持燃烧'},
    {id:1009,title:'燃烧条件',diff:3,q:'燃烧需要满足哪三个条件？',a:'可燃物、氧气、温度达到着火点',e:'灭火原理：破坏任一条件'},
    {id:1010,title:'二氧化碳',diff:2,q:'二氧化碳能使澄清石灰水怎样？',a:'变浑浊',e:'CO₂+Ca(OH)₂=CaCO₃↓+H₂O'},
    {id:1011,title:'溶液组成',diff:2,q:'溶液由什么组成？',a:'溶剂和溶质',e:'溶液是均一稳定的混合物'},
    {id:1012,title:'溶解度',diff:3,q:'影响固体溶解度的因素是什么？',a:'温度',e:'气体溶解度还与压强有关'},
    {id:1013,title:'酸碱指示剂',diff:2,q:'紫色石蕊遇酸变什么色？',a:'红色',e:'石蕊遇酸变红，遇碱变蓝'},
    {id:1014,title:'中和反应',diff:3,q:'酸和碱反应生成什么？',a:'盐和水',e:'中和反应是复分解反应'},
    {id:1015,title:'pH值',diff:2,q:'pH<7的溶液呈什么性？',a:'酸性',e:'pH越小酸性越强'},
    {id:1016,title:'金属活动性',diff:3,q:'金属活动性顺序中，位置越靠前，活动性越____',a:'强',e:'K Ca Na Mg Al Zn Fe...'},
    {id:1017,title:'置换反应',diff:3,q:'Fe + CuSO₄ = ?',a:'FeSO₄ + Cu',e:'铁比铜活泼，能置换出铜'},
    {id:1018,title:'复分解反应',diff:4,q:'复分解反应发生的条件是什么？',a:'生成沉淀、气体或水',e:'必须有沉淀、气体或水生成'},
    {id:1019,title:'粗盐提纯',diff:3,q:'粗盐提纯的步骤是什么？',a:'溶解、过滤、蒸发、结晶',e:'除去不溶性杂质'},
    {id:1020,title:'离子检验',diff:3,q:'如何检验CO₃²⁻离子？',a:'加稀盐酸，将气体通入澄清石灰水',e:'产生使石灰水变浑浊的气体'},
    {id:1021,title:'化学计算',diff:4,q:'64g氧气中含有多少个氧分子？',a:'2NA或1.204×10²⁴个',e:'n=m/M, N=n×NA'}
];

'''

# 找到topicsMath7的位置并在其前插入物理化学题目
insert_pos = content.find('// 初二数学21道')
if insert_pos > 0:
    content = content[:insert_pos] + physics_chem_topics + content[insert_pos:]

# 3. 更新allTopics以包含物理和化学
old_allTopics = '''const allTopics = {
    7: { math: topicsMath7, english: topicsEnglish7, chinese: topicsChinese7 },
    8: { math: topicsMath8, english: topicsEnglish8, chinese: topicsChinese8 },
    9: { math: topicsMath9, english: topicsEnglish9 }
};'''

new_allTopics = '''const allTopics = {
    7: { math: topicsMath7, english: topicsEnglish7, chinese: topicsChinese7 },
    8: { math: topicsMath8, english: topicsEnglish8, chinese: topicsChinese8, physics: topicsPhysics8 },
    9: { math: topicsMath9, english: topicsEnglish9, chemistry: topicsChemistry9 }
};'''

content = content.replace(old_allTopics, new_allTopics)

# 4. 更新母题描述（增加题目数量提示）
content = content.replace(
    '📚 母题训练\n                <div class="module-desc">126道经典题',
    '📚 母题训练\n                <div class="module-desc">210道经典题'
)

print("Step 1-4 completed: Added physics/chemistry topics")
print(f"File length: {len(content)} characters")

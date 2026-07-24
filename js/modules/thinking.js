// 版本: V151

function renderThinking(container) {
    const user = window.getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const thinkingTypes = [
        {id:'logic',icon:'🧮',name:'逻辑思维',desc:'推理与分析',color:'#667eea'},
        {id:'creative',icon:'🎨',name:'创意思维',desc:'创新与想象',color:'#f5576c'},
        {id:'critical',icon:'🔍',name:'批判思维',desc:'质疑与判断',color:'#4facfe'},
        {id:'system',icon:'🌐',name:'系统思维',desc:'全局与关联',color:'#43e97b'},
        {id:'reverse',icon:'🔄',name:'逆向思维',desc:'反向思考',color:'#fa709a'},
        {id:'divergent',icon:'💫',name:'发散思维',desc:'多向探索',color:'#fee140'},
        {id:'converge',icon:'🎯',name:'收敛思维',desc:'聚焦归纳',color:'#a8edea'},
        {id:'spatial',icon:'🎲',name:'空间思维',desc:'立体想象',color:'#d299c2'},
        {id:'abstract',icon:'🔷',name:'抽象思维',desc:'本质概括',color:'#ffecd2'}
    ];
    
    container.innerHTML = `
        <div class="card">
            <h3 style="margin-bottom:12px;">🧩 思维训练</h3>
            <p style="color:#666;font-size:13px;margin-bottom:16px;">八大思维能力全面提升</p>
            
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
                ${thinkingTypes.map(t => `
                    <div style="background:linear-gradient(135deg,${t.color},${t.color}dd);color:white;padding:14px;border-radius:12px;cursor:pointer;" onclick="showThinkingType('${t.id}')">
                        <div style="font-size:18px;margin-bottom:6px;">${t.icon}</div>
                        <div style="font-size:13px;font-weight:600;">${t.name}</div>
                        <div style="font-size:10px;opacity:0.9;margin-top:3px;">${t.desc}</div>
                        <div style="font-size:11px;margin-top:6px;opacity:0.8;">${window.thinkingQuestions[t.id].length}题</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📊 思维训练统计</h4>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#3377FF;" id="thinking-completed">${totalCompleted}</div>
                    <div style="font-size:11px;color:#666;">已完成</div>
                </div>
                <div style="text-align:center;padding:12px;background:#f5f7ff;border-radius:12px;">
                    <div style="font-size:24px;font-weight:bold;color:#43E97B;" id="thinking-accuracy">${totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%'}</div>
                    <div style="font-size:11px;color:#666;">正确率</div>
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top:12px;">
            <h4 style="margin-bottom:12px;">📝 学习笔记</h4>
            <div style="margin-bottom:12px;">
                <label class="upload-btn" style="display:inline-block;padding:10px 16px;background:#1A6BFF;color:white;border-radius:8px;cursor:pointer;font-size:13px;">
                    📤 上传笔记
                    <input type="file" accept="image/*" style="display:none" onchange="handleThinkingNoteUpload(this)">
                </label>
            </div>
            <div id="thinking-notes-list"></div>
        </div>
    
        <button onclick="history.back()" style="width:100%;margin-top:16px;padding:14px;background:#f5f5f5;color:#666;border:none;border-radius:12px;font-size:14px;cursor:pointer;">← 返回首页</button>
`;
    
    renderThinkingNotes();
}


// ============================================================
window.thinkingQuestions = {
    // 逻辑思维 - 推理与分析
    logic: [
        // 基础理解 (1-5)
        {q:'如果"所有鸟都会飞"是真的，"企鹅是鸟"也是真的，那么企鹅会飞吗？', opts:['会飞','不会飞','不知道','无法判断'], a:1},
        {q:'A比B高，B比C高，C比D高。那么谁最高？', opts:['A','B','C','D'], a:0},
        {q:'小明说"所有苹果都是水果"，下列哪个能证明他说的是对的？', opts:['香蕉是水果','苹果酱是水果','梨是水果','苹果是水果'], a:3},
        {q:'"如果明天下雨，运动会延期"这句话，在什么情况下一定为假？', opts:['下雨，运动会延期','下雨，运动会不延期','不下雨，运动会延期','不下雨，运动会不延期'], a:1},
        {q:'逻辑推理中的"三段论"由哪三部分组成？', opts:['原因、经过、结果','大前提、小前提、结论','问题、分析、答案','条件、假设、推断'], a:1},
        // 应用场景 (6-10)
        {q:'数学证明题：因为∠1=∠2，∠2=∠3，所以∠1=∠3。这用了什么推理？', opts:['归纳推理','演绎推理','类比推理','跳跃推理'], a:1},
        {q:'已知A>B，C>D，那么A+C和B+D哪个大？', opts:['A+C一定大于B+D','B+D一定大于A+C','无法确定','两者相等'], a:0},
        {q:'语文阅读理解：根据"他高兴地跳了起来，眼里闪着泪光"可以推断出什么？', opts:['他很难过','他很激动','他很生气','他很害怕'], a:1},
        {q:'如果"努力学习的人会取得好成绩"是真的，且"小李努力学习"，能推出什么结论？', opts:['小李一定取得好成绩','小李可能取得好成绩','小李不会取得好成绩','无法推出结论'], a:1},
        {q:'判断推理："有的科学家是艺术家"和"所有科学家都是艺术家"的关系是什么？', opts:['第一个包含第二个','第二个包含第一个','两者可以同时为真','两者矛盾'], a:2},
        // 辨析判断 (11-15)
        {q:'下列哪个是"诉诸权威"的逻辑谬误？', opts:['因为爱因斯坦这么说，所以是对的','因为实验证明，所以是对的','因为大家都这么说','因为数学推理正确'], a:0},
        {q:'"小红学习好，所以她一定很聪明"这个推理有什么问题？', opts:['学习好和聪明不是同一概念','学习好的人都不聪明','聪明的人学习都不好','没有逻辑问题'], a:0},
        {q:'如果"明天要么下雨要么不下雨"是真的，这句话提供了什么信息？', opts:['确定信息','概率信息','没有实质信息','矛盾信息'], a:2},
        {q:'下列哪种情况属于"循环论证"？', opts:['A成立因为B，B成立因为A','因为A所以B，因为B所以C','A和B互相独立','A和B都成立'], a:0},
        {q:'从"有些猫是黑色的"可以推出什么？', opts:['所有猫都是黑色的','存在一只黑色的猫','没有猫是黑色的','所有黑色的都是猫'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"逻辑推理游戏"，说明规则', a:'设计一个需要玩家根据线索推理出答案的游戏，每条线索只能排除一种可能'},
        {q:'用逻辑推理解决：如果5个人5分钟能做5个零件，100个人做100个零件需要几分钟？', opts:['5分钟','20分钟','100分钟','500分钟'], a:0},
        {q:'发明一个"逻辑思维训练APP"的功能，它应该包含什么？', a:'包含数独、推理题、真话假话游戏等逻辑训练模块'},
        {q:'设计一个"谁是凶手"的推理故事，需要给出哪些线索？', a:'给出嫌疑人、时间线、不在场证明、关键物证等线索，让玩家推理'},
        {q:'用逻辑树分析法分析"为什么学生不喜欢上学"', a:'从原因、影响、解决方案等角度展开，画成树状图'}
    ],

    // 创意思维 - 创新与想象
    creative: [
        // 基础理解 (1-5)
        {q:'"创造性思维"和"常规思维"的主要区别是什么？', opts:['速度不同','解决问题的方式不同','参与者不同','时间长短不同'], a:1},
        {q:'头脑风暴的基本规则是什么？', opts:['批评别人的想法','数量越多越好','等别人说完再开口','只提现实可行的想法'], a:1},
        {q:'"发散思维"是什么？', opts:['从一个点向四周扩散的思考方式','按顺序一步步思考','只看一个方向的思考','模仿别人的思考'], a:0},
        {q:'以下哪个不是培养创造力的方法？', opts:['多角度思考','大量阅读','限制时间','跨界学习'], a:2},
        {q:'"横向思维"通常用什么方式寻找答案？', opts:['深挖一个方向','从不同角度切入','按步骤分析','验证已知答案'], a:1},
        // 应用场景 (6-10)
        {q:'用6根火柴棒最多能摆出几个三角形？', opts:['2个','3个','4个','5个'], a:2},
        {q:'"1+1=？"可以有创意的回答是什么？', opts:['等于2','王、田、由','一夫一妻','一群羊加一群羊还是一群羊'], a:1},
        {q:'为"环保"主题想3个创意口号，思路是什么？', a:'从不同角度：威胁角度（不环保的后果）、愿景角度（环保后的美好）、行动角度（号召行动）'},
        {q:'如何用5个相同的圆画出不同的表情？', a:'改变圆的大小、位置，添加不同五官，画出喜怒哀乐惊等表情'},
        {q:'给"手机"想出5种除了通讯以外的用途', a:'闹钟、相机、地图、计算器、手电筒、音乐播放器、阅读器等'},
        // 辨析判断 (11-15)
        {q:'创意一定是"前所未有"的吗？', opts:['一定是','不一定是','一定不是','无法判断'], a:1},
        {q:'以下哪个说法正确？', opts:['创意只能来自天才','创意可以训练和培养','创意不需要知识基础','创意和逻辑思维对立'], a:1},
        {q:'一个想法很疯狂但无法实现，还有创意价值吗？', opts:['没有','有','要看具体内容','取决于谁提出的'], a:1},
        {q:'创造力是天生的还是可以通过学习提高的？', opts:['天生的','可以提高','两者都不是','无法改变'], a:1},
        {q:'"思维导图"为什么能帮助产生创意？', a:'因为它以视觉方式展示想法之间的关系，激发更多联想'},
        // 创新实践 (16-20)
        {q:'设计一个"创意垃圾桶"，它有什么特殊功能？', a:'自动分类、能压缩垃圾、会提醒倒垃圾、外观美观等'},
        {q:'发明一种"未来学校"，描述3个创意点', a:'虚拟教室、AI老师、个性化学习路径、游戏化学习等'},
        {q:'用废旧物品做一个创意作品，说明你的设计理念', a:'用废物利用的方式，做出美观实用的物品，体现环保理念'},
        {q:'策划一个"创意市集"活动，设计3个环节', a:'想法拍卖会、创意展示区、DIY工作坊等'},
        {q:'写一个"如果我能发明一样东西"的创意故事', a:'想象发明一种解决生活中某个问题的新产品，描述功能和影响'}
    ],

    // 批判思维 - 质疑与判断
    critical: [
        // 基础理解 (1-5)
        {q:'"批判性思维"的核心是什么？', opts:['批评别人','不加思考地接受','主动质疑和分析','相信权威'], a:2},
        {q:'判断信息可信度时，首先应该问什么？', opts:['这个消息是谁说的','这个消息的来源是什么','我喜不喜欢这个信息','有没有人同意'], a:1},
        {q:'以下哪个不是批判性思维的特质？', opts:['好奇心','开放心态','急于下结论','逻辑分析'], a:2},
        {q:'"证据"和"观点"的区别是什么？', opts:['没有区别','证据是事实，观点是看法','观点是事实','证据是看法'], a:1},
        {q:'如何判断一个论证是否有效？', opts:['看说话者的身份','看是否有逻辑依据','看是否被多数人接受','看是否符合常识'], a:1},
        // 应用场景 (6-10)
        {q:'看到"吃保健品可以延长寿命10年"的广告，应该怎么思考？', a:'查看研究来源、了解样本量、考虑其他因素、识别广告夸大'},
        {q:'同学说"大家都这么做，所以是对的"，这个论证有什么问题？', opts:['没有逻辑问题','诉诸大众谬误','论据不足','结论错误'], a:1},
        {q:'如何评估一篇网络文章的可信度？', a:'查作者背景、看引用来源、对比其他信息、注意发布时间'},
        {q:'判断一道数学题的解法是否正确，应该检查什么？', a:'计算过程、公式运用、逻辑推理、结果验证'},
        {q:'历史资料说"某战役歼敌十万"，如何核实？', a:'查阅多方史料、对比其他记载、分析来源可靠性'},
        // 辨析判断 (11-15)
        {q:'"专家说的肯定是对的"，这种想法有什么问题？', opts:['没有问题','可能存在"诉诸权威"谬误','专家从不说错','应该完全相信'], a:1},
        {q:'以下哪个是"因果谬误"的例子？', opts:['公鸡叫后天亮了','努力学习成绩好','下雨地湿','天热冰棒融化'], a:0},
        {q:'看到"研究表明XX有害"的消息，应该怎么分析？', a:'看研究机构、样本数量、实验设计、是否有利益关联'},
        {q:'社交媒体上的热门话题一定是真实的吗？', opts:['一定是','不一定是','一定不是','取决于点赞数'], a:1},
        {q:'为什么"幸存者偏差"是一种思维谬误？', a:'只看到成功案例而忽略失败案例，导致错误结论'},
        // 创新实践 (16-20)
        {q:'设计一个"新闻真假辨别游戏"，说明规则', a:'展示真假新闻，玩家判断真假并说明理由，提高辨别能力'},
        {q:'分析一则你看到的广告，指出其中可能存在的误导', a:'分析广告语、数据引用、图片处理等可能的夸大或误导'},
        {q:'策划"批判性思维训练营"，设计3个活动', a:'辩论赛、案例分析、逻辑谬误识别游戏等'},
        {q:'发明"事实核查助手"APP，说明功能', a:'输入新闻，自动搜索多方信源，显示可信度评分'},
        {q:'写一篇"如何不被网络谣言欺骗"的小文章', a:'包含信息来源核查、逻辑分析、多方验证等方法'}
    ],

    // 系统思维 - 全局与关联
    system: [
        // 基础理解 (1-5)
        {q:'"系统思维"强调整什么？', opts:['单一因素','局部优化','整体性和关联性','线性因果'], a:2},
        {q:'生态系统是一个系统，它包含哪些要素？', opts:['只有动物','只有植物','动植物和它们的环境','只有微生物'], a:2},
        {q:'"蝴蝶效应"说明了什么？', opts:['蝴蝶很美','系统中的微小变化可能引起大影响','蝴蝶很危险','效应不重要'], a:1},
        {q:'在学校系统中，哪个不是重要组成部分？', opts:['学生','老师','家长','校服的款式'], a:3},
        {q:'"因果循环"和"线性因果"的区别是什么？', opts:['没有区别','循环是双向的，线性是单向的','循环更简单','线性更复杂'], a:1},
        // 应用场景 (6-10)
        {q:'解决交通拥堵问题，为什么不能只修更多路？', a:'因为可能诱导更多购车，形成"诱导需求"，治标不治本'},
        {q:'用系统思维分析"为什么学生压力大"', a:'从学校、家庭、社会、个人多层面分析，找根本原因'},
        {q:'"踢猫效应"说明什么？', a:'负面情绪会在系统中传递，从高层传到底层'},
        {q:'为什么要保护生物多样性？', a:'生态系统各部分相互关联，物种消失会影响整个系统平衡'},
        {q:'分析"网购兴起"对实体店的影响', a:'网购和实体店形成竞争，但也催生新业态，需要系统分析'},
        // 辨析判断 (11-15)
        {q:'头痛医头、脚痛医脚的问题是什么？', opts:['太便宜','太复杂','忽视系统关联','效果太好'], a:2},
        {q:'一个系统中，各部分的关系一定是线性的吗？', opts:['一定是','一定不是','有时候是','无法判断'], a:1},
        {q:'"系统思维"和"分析思维"哪个更重要？', opts:['系统思维','分析思维','两者都重要','都不重要'], a:2},
        {q:'为什么解决一个问题可能产生新问题？', a:'因为系统是关联的，局部变化可能影响其他部分'},
        {q:'家庭是一个系统，谁是核心？', opts:['父亲','母亲','孩子','没有固定核心，相互依存'], a:3},
        // 创新实践 (16-20)
        {q:'画一个"学校生态系统图"，包含所有重要元素', a:'包含学生、教师、家长、管理、课程、资源等及其关系'},
        {q:'设计"校园改进方案"，用系统思维分析', a:'分析现状、找关键点、设计干预、评估影响'},
        {q:'用系统思维分析"手机对青少年的影响"', a:'从积极、消极、短期、长期等多角度分析'},
        {q:'发明"系统模拟器"软件，能模拟什么？', a:'模拟城市发展、生态系统、公司运营等复杂系统的运行'},
        {q:'策划"系统思维工作坊"，设计3个练习', a:'因果循环图练习、系统模型搭建、杠杆点分析等'}
    ],

    // 逆向思维 - 反向思考
    reverse: [
        // 基础理解 (1-5)
        {q:'"逆向思维"的核心是什么？', opts:['从结果倒推原因','从正面思考','重复别人的方法','按部就班'], a:0},
        {q:'司马光砸缸用的是什么思维？', opts:['正向思维','逆向思维','发散思维','逻辑思维'], a:1},
        {q:'数学中的"反证法"属于什么思维？', opts:['正向思维','逆向思维','形象思维','直觉思维'], a:1},
        {q:'"假如失败了你怎么办？"这个问题训练什么思维？', opts:['正向思维','逆向思维','发散思维','逻辑思维'], a:1},
        {q:'"反面教材"利用了什么原理？', opts:['正向强化','从错误中学习','模仿','记忆'], a:1},
        // 应用场景 (6-10)
        {q:'如何用逆向思维证明"√2是无理数"？', a:'假设是有理数，推出矛盾，从而证明'},
        {q:'做菜太咸了，正向思维是加水，逆向思维怎么办？', a:'可以加糖或土豆吸盐，或增加其他食材稀释'},
        {q:'如何逆向思考"如何让更多人不喜欢你的产品"？', a:'列出这些方法，反其道而行之就是改进方法'},
        {q:'用逆向思维想一个"防盗"的好方法', a:'让小偷觉得这里没东西偷，比装报警器更有效'},
        {q:'如何逆向理解"失败是成功之母"？', a:'成功也可能导致失败，骄傲自满会让人失败'},
        // 辨析判断 (11-15)
        {q:'逆向思维适用于所有问题吗？', opts:['适用','不适用','有些问题适用','完全适用'], a:2},
        {q:'逆向思考得到的答案一定是正确的吗？', opts:['一定是','一定不是','不一定，需要验证','无法判断'], a:2},
        {q:'逆向思维和"钻牛角尖"有什么区别？', opts:['没有区别','逆向思维有逻辑，钻牛角尖没有','正好相反','无法区分'], a:1},
        {q:'什么时候逆向思维特别有用？', opts:['常规方法无效时','任何时候','简单问题','所有人都知道答案时'], a:0},
        {q:'逆向思维和批判性思维有什么关系？', opts:['完全相同','逆向是批判的一部分','批判是逆向的一部分','没有关系'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"逆向创新"游戏，怎么玩？', a:'给一个问题，先想常规解法，再想完全相反的解法'},
        {q:'用逆向思维发明一个"反向雨伞"，有什么功能？', a:'收伞时雨水向内流，不会弄湿地面或衣服'},
        {q:'策划"假如我是反派"写作练习，有什么好处？', a:'从对立面思考，理解不同立场，培养逆向思维能力'},
        {q:'用逆向思维设计"如何让学生爱上写作业"', a:'分析学生讨厌作业的原因，从根源反向解决'},
        {q:'发明"逆向日历"，它有什么特别功能？', a:'从目标倒推到今天，列出每天需要做什么'}
    ],

    // 发散思维 - 多向探索
    divergent: [
        // 基础理解 (1-5)
        {q:'"发散思维"的特点是什么？', opts:['只找一个答案','追求多个创意答案','按固定模式思考','模仿他人'], a:1},
        {q:'发散思维主要训练什么能力？', opts:['记忆力','创造力','计算能力','书写能力'], a:1},
        {q:'以下哪个不是发散思维的特点？', opts:['流畅性','变通性','独创性','唯一性'], a:3},
        {q:'"砖头有什么用？"这个问题训练什么思维？', opts:['逻辑思维','收敛思维','发散思维','逆向思维'], a:2},
        {q:'发散思维和"胡思乱想"有什么区别？', opts:['没有区别','发散思维有创意价值，胡思乱想没有','正好相反','无法区分'], a:1},
        // 应用场景 (6-10)
        {q:'想出5种方法让房间更凉爽', a:'开空调、开风扇、开窗、洒水、放冰块、挂遮阳帘、换薄窗帘等'},
        {q:'如何用发散思维解决"零花钱不够花"？', a:'节流（少买）、开源（赚取）、改变消费方式、调整期望值等'},
        {q:'给"水"想出10种不同的用途', a:'喝、洗、灭火、发电、灌溉、游泳、养鱼、稀释、制冷、发电等'},
        {q:'用发散思维给"快乐"下10个定义', a:'笑、成功、被爱、自由、健康、实现目标、有朋友、被尊重等'},
        {q:'面对"怎么保护视力"，发散思维能想到什么方案？', a:'少看屏幕、做眼保健操、吃护眼食物、定期检查、正确坐姿等'},
        // 辨析判断 (11-15)
        {q:'发散思维产生的想法越多越好吗？', opts:['是','不是，要看质量','数量最重要','无所谓'], a:1},
        {q:'发散思维训练对学习其他科目有帮助吗？', opts:['没有','有，帮助拓宽思路','有负面影响','不确定'], a:1},
        {q:'发散思维和专注思维哪个更重要？', opts:['发散','专注','两者都重要，不同阶段用不同','都不重要'], a:2},
        {q:'内向的人发散思维能力会弱吗？', opts:['会','不会','取决于其他因素','无法判断'], a:2},
        {q:'发散思维只能用于创意工作吗？', opts:['只能用于创意','不只用于创意','完全不适用','无法判断'], a:1},
        // 创新实践 (16-20)
        {q:'举办"30秒创意赛"，比谁的想法多', a:'给定主题，30秒内写下所有想到的想法，数量多者获胜'},
        {q:'用发散思维设计"未来的交通工具"', a:'飞行汽车、传送门、瞬间移动、胶囊公交等'},
        {q:'发明一个"随机词联想器"，怎么工作？', a:'随机给出两个不相关词，练习把它们联系起来'},
        {q:'策划"发散思维马拉松"，设计规则', a:'长时间头脑风暴，从一个问题发散到多个领域'},
        {q:'用发散思维解决"全球变暖"问题', a:'从能源、交通、饮食、建筑、个人行为等多角度发散思考'}
    ],

    // 收敛思维 - 聚焦归纳
    converge: [
        // 基础理解 (1-5)
        {q:'"收敛思维"的特点是什么？', opts:['发散多答案','从多到一','没有方向','不断扩展'], a:1},
        {q:'收敛思维和"优柔寡断"有什么区别？', opts:['没有区别','收敛思维有标准，优柔寡断没有','正好相反','无法区分'], a:1},
        {q:'以下哪种情况适合用收敛思维？', opts:['发明新产品','做出决策','绘画创作','写小说'], a:1},
        {q:'"归纳法"属于什么思维？', opts:['发散思维','收敛思维','逆向思维','形象思维'], a:1},
        {q:'收敛思维追求的目标是什么？', opts:['更多答案','最优答案','最新答案','所有答案'], a:1},
        // 应用场景 (6-10)
        {q:'有5个解决问题的方案，如何用收敛思维选择最优？', a:'设定评估标准，给每个方案打分，综合比较'},
        {q:'"归纳推理"：从苹果落下、石头落下、水落下，能归纳出什么？', a:'都受地球引力作用向下落'},
        {q:'面对多门功课，用收敛思维制定复习计划', a:'分析各科重要性、薄弱点、时间分配，确定复习重点'},
        {q:'从多个新闻事件中收敛出一个核心主题', a:'找出共同点、归纳规律、提炼本质'},
        {q:'如何用收敛思维从众多错题中找出重点？', a:'分类整理、找错误规律、确定薄弱知识点'},
        // 辨析判断 (11-15)
        {q:'收敛思维会限制创造力吗？', opts:['会','不会，反而帮助筛选创意','完全限制','无法判断'], a:1},
        {q:'"排除法"是收敛思维的应用吗？', opts:['是','不是','无法判断','可能'], a:0},
        {q:'收敛思维需要什么基础？', opts:['发散思维结果','逻辑推理','知识储备','以上都要'], a:3},
        {q:'收敛思维和"面面俱到"有什么区别？', opts:['没有区别','收敛是提炼，面面俱到是罗列','正好相反','无法区分'], a:1},
        {q:'什么时候收敛思维比发散思维更重要？', opts:['创意阶段','决策阶段','探索阶段','实验阶段'], a:1},
        // 创新实践 (16-20)
        {q:'设计一个"最优方案评估表"', a:'列出评估维度、权重、评分方法，帮助做出最佳选择'},
        {q:'用收敛思维分析"什么样的学生是好学生"', a:'从品德、学习、实践、社交等多维度归纳标准'},
        {q:'发明"智能决策助手"APP，说明功能', a:'输入选项和考虑因素，AI帮助分析并给出建议'},
        {q:'策划"收敛思维竞赛"，怎么比？', a:'给定多个信息，比谁先归纳出正确结论'},
        {q:'用收敛思维写"我的优点和缺点"自我分析', a:'收集多方面反馈、归纳共同点、确定核心特质'}
    ],

    // 空间思维 - 立体想象
    spatial: [
        // 基础理解 (1-5)
        {q:'"空间思维"主要训练什么能力？', opts:['语言能力','想象物体在空间中的形状和位置','记忆能力','计算能力'], a:1},
        {q:'以下哪个职业最需要空间思维？', opts:['会计','建筑师','作家','音乐家'], a:1},
        {q:'看地图时，分不清东西南北说明什么？', opts:['记忆力差','空间思维弱','视力不好','注意力不集中'], a:1},
        {q:'立方体有几个面？', opts:['6个','8个','12个','4个'], a:0},
        {q:'"三视图"包括哪三个视图？', opts:['上、下、侧面','正视图、侧视图、俯视图','大、中、小','远、中、近'], a:1},
        // 应用场景 (6-10)
        {q:'一个正方形纸片，对折一次变成什么图形？', opts:['三角形','长方形','圆形','无法确定'], a:1},
        {q:'从不同角度观察同一个物体，看到的一样吗？', opts:['完全一样','完全不一样','可能不一样','无法判断'], a:2},
        {q:'学习立体几何时，空间思维有什么作用？', a:'帮助理解立体图形性质、想象图形变换、解决证明题'},
        {q:'搭积木需要什么空间思维？', a:'理解上下左右关系、平衡感、形状组合能力'},
        {q:'如何用空间思维理解"对面""相邻""相邻的对角"？', a:'在正方体中，对面不相邻，相邻的两个面共享一条棱'},
        // 辨析判断 (11-15)
        {q:'空间思维是天生的还是可以通过训练提高的？', opts:['天生的','可以训练提高','无法改变','部分天生部分可训练'], a:3},
        {q:'男生比女生空间思维能力更强吗？', opts:['是','不是，因人而异','完全相反','无法判断'], a:1},
        {q:'玩电子游戏能提高空间思维吗？', opts:['能','不能','可能有害','不确定'], a:0},
        {q:'空间思维对学习物理有用吗？', opts:['没有','有，特别是力学和光学','有负面影响','不确定'], a:1},
        {q:'3D打印技术体现了什么空间思维能力？', a:'把虚拟三维模型转化为实物的能力'},
        // 创新实践 (16-20)
        {q:'设计一个"立体城市"模型，说明创意', a:'用纸盒、积木等制作包含建筑、道路、绿化等的微型城市'},
        {q:'发明"空间思维训练游戏"，说明玩法', a:'拼立体图形、找对面、纸盒展开图练习等'},
        {q:'用空间思维设计"理想卧室"', a:'考虑功能分区、光线流向、动线设计等'},
        {q:'策划"空间想象大赛"，比什么？', a:'比谁最快说出展开图对应的立体图形、谁画的立体图形最准确'},
        {q:'用折纸艺术训练空间思维，做一个复杂作品', a:'通过折叠纸张理解空间关系，培养动手能力'}
    ],

    // 抽象思维 - 本质概括
    abstract: [
        // 基础理解 (1-5)
        {q:'"抽象思维"的核心是什么？', opts:['具体操作','从具体事物中提取本质','看表面现象','记忆细节'], a:1},
        {q:'以下哪个是抽象概念？', opts:['苹果','水果','红富士','一个苹果'], a:1},
        {q:'"1+1=2"是抽象思维的结果吗？', opts:['是','不是','无法判断','部分是'], a:0},
        {q:'数学公式为什么是抽象的？', a:'代表一类问题的共同规律'},
        {q:'抽象思维和形象思维的主要区别是什么？', opts:['没有区别','抽象用概念，形象用图像','抽象更简单','形象更复杂'], a:1},
        // 应用场景 (6-10)
        {q:'从"猫抓老鼠、狗看家、牛耕地"能抽象出什么？', a:'动物可以被人类驯养并利用'},
        {q:'用抽象思维理解"诚信"这个概念', a:'诚信是言行一致、说到做到、守信用的品质'},
        {q:'如何用抽象思维总结一类题的解法？', a:'不记具体题目，而是总结这类题型的共同特点和通用方法'},
        {q:'从多个成功人士的故事中抽象出成功要素', a:'勤奋、坚持、创新、机遇、团队等'},
        {q:'用抽象思维理解"时间管理"', a:'时间管理是合理分配和有效利用时间以达成目标的能力'},
        // 辨析判断 (11-15)
        {q:'抽象思维能力强的人学数学一定好吗？', opts:['一定','不一定','一定不好','无法判断'], a:1},
        {q:'小学生也能进行抽象思维吗？', opts:['不能','能，但是有限','完全不能','不确定'], a:1},
        {q:'抽象概念越少越好吗？', opts:['是','不是','无法判断','视情况而定'], a:3},
        {q:'哲学思考主要运用什么思维？', opts:['形象思维','抽象思维','发散思维','逆向思维'], a:1},
        {q:'抽象思维和批判思维有什么关系？', opts:['完全独立','抽象是批判的基础','批判是抽象的基础','没有关系'], a:1},
        // 创新实践 (16-20)
        {q:'设计"概念图"，用图形表示概念关系', a:'用圆圈、箭头等表示核心概念及其从属、因果关系'},
        {q:'用抽象思维分析"什么是好的教育"', a:'从知识、能力、品德、创新等多维度概括好的教育的本质'},
        {q:'发明"抽象概念可视化工具"，说明功能', a:'把抽象概念转化成具体图像、故事或模型帮助理解'},
        {q:'策划"抽象概念辩论赛"，辩题例如"人性本善还是本恶"', a:'训练从具体事例抽象出普遍规律的能力'},
        {q:'用抽象思维写一篇"论友谊"的议论文', a:'从具体友谊经历中提炼友谊的本质、价值和维持方法'}
    ]
};


let currentThinkingType = 'logic';
let currentThinkingPage = {};

// 显示思维类型详情
function showThinkingType(type) {
    currentThinkingType = type;
    currentThinkingPage[type] = 0;
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const typeIcons = {
        logic: '🧮', creative: '🎨', critical: '🔍', system: '🌐',
        reverse: '🔄', divergent: '💫', converge: '🎯', spatial: '🎲',
        abstract: '🔷'
    };
    
    const typeDescs = {
        logic: '培养逻辑推理能力，学会从已知条件推导结论。',
        creative: '激发创造力，培养发散思维和创新意识。',
        critical: '学会质疑和独立思考，不盲从权威和流行观点。',
        system: '培养全局观，学会分析问题的系统性解决方案。',
        reverse: '从反面思考问题，寻找创新的解决路径。',
        divergent: '从一个点出发，探索多种可能性和答案。',
        converge: '从众多信息中提炼核心，找到最优解。',
        spatial: '培养空间想象力，理解立体和图形关系。',
        abstract: '学会透过现象看本质，提取事物核心特征。'
    };
    
    const questions = window.thinkingQuestions[type];
    
    const content = (typeof window.ensureDetailModal === 'function') ? window.ensureDetailModal() : document.getElementById('detail-content');
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">${typeIcons[type]} ${typeNames[type]}训练</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            共${questions.length}题 · 点击下方按钮开始练习
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;color:#333;margin-bottom:8px;"><strong>训练目标：</strong></div>
            <div style="font-size:13px;color:#666;line-height:1.6;">${typeDescs[type]}</div>
        </div>
        <button onclick="startThinkingQuiz('${type}', 0)" class="login-btn login-btn-primary" style="margin-bottom:8px;">开始练习</button>
        <button class="modal-close" onclick="window.closeModal()">返回</button>
    `;
}

// 开始做题（每页5题）
function startThinkingQuiz(type, page = 0) {
    const questions = window.thinkingQuestions[type];
    if (!questions || questions.length === 0) {
        window.showToast('暂无练习题');
        return;
    }
    
    if (!currentThinkingPage[type]) currentThinkingPage[type] = 0;
    if (page !== undefined) currentThinkingPage[type] = page;
    
    const currentPage = currentThinkingPage[type];
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const content = (typeof window.ensureDetailModal === 'function') ? window.ensureDetailModal() : document.getElementById('detail-content');
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 练习</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">
            第 ${currentPage + 1} / ${totalPages} 页（共${questions.length}题）
        </div>
        
        <!-- 拍照上传区域 -->
        <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:16px;">
            <div style="font-size:13px;color:#666;margin-bottom:8px;">📷 拍照上传题目图片（可选）</div>
            <input type="file" id="thinking-photo-input" accept="image/*" capture="environment" style="display:none" onchange="handleQuestionPhoto(this, 'thinking-photo-preview')"/>
            <div style="display:flex;gap:8px;">
                <button onclick="document.getElementById('thinking-photo-input').click()" style="flex:1;padding:10px;background:white;border:1px solid #ddd;border-radius:8px;font-size:13px;cursor:pointer;">📷 拍照/选择图片</button>
                <button onclick="analyzeThinkingPhotoWithAI()" style="flex:1;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;">🤖 AI分析图片</button>
            </div>
            <div id="thinking-photo-preview" style="margin-top:8px;display:none;"></div>
        </div>
        
        <div style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => `
                <div style="background:#f5f7ff;border-radius:12px;padding:12px;margin-bottom:12px;">
                    <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题</div>
                    <div style="font-size:14px;color:#333;line-height:1.6;margin-bottom:8px;">${q.q}</div>
                    ${q.opts ? `
                        <div style="display:grid;gap:8px;" id="opts-${idx}">
                            ${q.opts.map((opt, optIdx) => `
                                <div class="thinking-opt" onclick="selectThinkingOpt(this, ${optIdx}, ${idx})" style="padding:10px;background:white;border:1px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;">${opt}</div>
                            `).join('')}
                        </div>
                    ` : `
                        <textarea id="thinking-answer-${idx}" style="width:100%;height:60px;border:1px solid #ddd;border-radius:8px;padding:8px;font-size:13px;resize:none;" placeholder="输入你的答案..."></textarea>
                    `}
                </div>
            `).join('')}
        </div>
        <button onclick="submitThinkingAnswers('${type}', ${currentPage})" class="login-btn login-btn-primary" style="margin-bottom:8px;">提交全部答案</button>
        <div style="display:flex;gap:8px;">
            ${currentPage > 0 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${currentPage < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${currentPage + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="window.closeModal()" style="margin-top:8px;">关闭</button>
    `;
}

// AI分析思维训练的图片
async function analyzeThinkingPhotoWithAI() {
    const photoPreview = document.getElementById('thinking-photo-preview');
    const imageData = window.currentQuestionPhoto;
    
    if (!imageData) {
        window.showToast('请先上传图片');
        return;
    }
    
    // 直接使用新的OCR出题流程
    photoToQuestion(imageData);
}

// 导出函数
window.analyzeThinkingPhotoWithAI = analyzeThinkingPhotoWithAI;

// 选择选项
function selectThinkingOpt(el, selectedIdx, questionIdx) {
    const parent = el.parentElement;
    parent.querySelectorAll('.thinking-opt').forEach(opt => {
        opt.style.background = 'white';
        opt.style.borderColor = '#e0e0e0';
    });
    el.style.background = '#e3f2fd';
    el.style.borderColor = '#1A6BFF';
    el.dataset.selected = selectedIdx;
}

// 提交全部答案
function submitThinkingAnswers(type, page) {
    // 播放提交音效
    SoundEffects.playSubmit();
    
    const questions = window.thinkingQuestions[type];
    const startIndex = page * QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    
    const content = (typeof window.ensureDetailModal === 'function') ? window.ensureDetailModal() : document.getElementById('detail-content');
    content.innerHTML = `
        <div class="modal-title">📝 ${typeNames[type]} - 答案对比</div>
        <div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">第 ${page + 1} / ${totalPages} 页</div>
        <div style="max-height:400px;overflow-y:auto;margin-bottom:16px;">
            ${pageQuestions.map((q, idx) => {
                let userAnswer = '';
                let isCorrect = false;
                
                if (q.opts) {
                    const optsContainer = document.getElementById(`opts-${idx}`);
                    const selectedOpt = optsContainer?.querySelector('.thinking-opt[style*="background: rgb(227, 242, 253)"]') || optsContainer?.querySelector('.thinking-opt[data-selected]');
                    const selectedIdx = selectedOpt?.dataset?.selected;
                    userAnswer = selectedIdx !== undefined ? q.opts[selectedIdx] : '未作答';
                    isCorrect = selectedIdx == q.a;
                } else {
                    const input = document.getElementById(`thinking-answer-${idx}`);
                    userAnswer = input?.value?.trim() || '未作答';
                    isCorrect = userAnswer !== '未作答' && userAnswer.length > 5;
                }
                
                return `
                    <div style="margin-bottom:16px;">
                        <div style="font-size:13px;color:#1A6BFF;font-weight:600;margin-bottom:8px;">第${startIndex + idx + 1}题：${q.q}</div>
                        <div style="background:#e3f2fd;border-radius:8px;padding:10px;margin-bottom:8px;">
                            <div style="font-size:12px;color:#1A6BFF;margin-bottom:4px;">你的答案</div>
                            <div style="font-size:13px;color:#333;line-height:1.5;">${userAnswer}</div>
                        </div>
                        ${q.a !== undefined ? `
                            <div style="background:#e8f5e9;border-radius:8px;padding:10px;margin-bottom:8px;">
                                <div style="font-size:12px;color:#4CAF50;margin-bottom:4px;">参考答案</div>
                                <div style="font-size:13px;color:#333;line-height:1.5;">${q.opts ? q.opts[q.a] : q.a}</div>
                            </div>
                        ` : ''}
                        <div style="display:flex;gap:8px;">
                            <button onclick="rateThinkingAnswer('${type}', true, ${startIndex + idx})" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✓ 正确</button>
                            <button onclick="rateThinkingAnswer('${type}', false, ${startIndex + idx})" style="flex:1;padding:8px;background:#ff6b6b;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer;">✗ 改进</button>
                        </div>
                        <button onclick="analyzeThinkingWithAI('${type}', ${startIndex + idx})" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">🤖 AI深度分析</button>
                        <div id="thinking-ai-result-${type}-${startIndex + idx}" style="margin-top:8px;"></div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            ${page > 0 ? `<button onclick="startThinkingQuiz('${type}', ${page - 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">上一页</button>` : ''}
            ${page < totalPages - 1 ? `<button onclick="startThinkingQuiz('${type}', ${page + 1})" style="flex:1;padding:10px;background:#f5f5f5;border:none;border-radius:8px;font-size:14px;cursor:pointer;">下一页</button>` : ''}
        </div>
        <button class="modal-close" onclick="window.closeModal()">关闭</button>
    `;
}

// 评价答案
function rateThinkingAnswer(type, isCorrect, questionIdx) {
    // 播放正确/错误音效
    if (isCorrect) {
        SoundEffects.playCorrect();
    } else {
        SoundEffects.playWrong();
    }
    
    const user = window.getCurrentUserData();
    if (!user.thinkingStats) user.thinkingStats = {};
    if (!user.thinkingStats[type]) user.thinkingStats[type] = { completed: 0, correct: 0, answeredQuestions: [] };
    
    if (!user.thinkingStats[type].answeredQuestions.includes(questionIdx)) {
        user.thinkingStats[type].completed++;
        if (isCorrect) user.thinkingStats[type].correct++;
        user.thinkingStats[type].answeredQuestions.push(questionIdx);
    }
    
    // 如果答错，自动加入错题本
    if (!isCorrect) {
        const questions = window.thinkingQuestions[type];
        const question = questions[questionIdx];
        const typeNames = {
            logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
            reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
            abstract: '抽象思维'
        };
        if (question) {
            const wrongKey = 'thinking-' + type + '-' + questionIdx;
            if (!user.wrongNotes) user.wrongNotes = [];
            // 避免重复添加同一错题
            if (!user.wrongNotes.find(n => n.wrongKey === wrongKey)) {
                user.wrongNotes.push({
                    wrongKey: wrongKey,
                    source: 'thinking',
                    sourceName: typeNames[type] || '思维训练',
                    topicId: questionIdx,
                    question: question.q,
                    answer: question.opts ? question.opts[question.a] : question.a,
                    explanation: '参考答案：' + (question.opts ? question.opts[question.a] : question.a),
                    userAnswer: '回答错误',
                    time: Date.now()
                });
            }
        }
    }
    
    syncUserData(user);
    updateThinkingStats();
    window.showToast(isCorrect ? '回答正确！' : '已加入错题本，继续加油！');
    // V145修复：记录练习数据
    if (window.recordPractice) window.recordPractice(1, isCorrect ? 1 : 0, 1);
}

// 更新统计
function updateThinkingStats() {
    const user = window.getCurrentUserData();
    const stats = user?.thinkingStats || {};
    
    let totalCompleted = 0;
    let totalCorrect = 0;
    Object.values(stats).forEach(s => {
        totalCompleted += s.completed || 0;
        totalCorrect += s.correct || 0;
    });
    
    const completedEl = document.getElementById('thinking-completed');
    const accuracyEl = document.getElementById('thinking-accuracy');
    if (completedEl) completedEl.textContent = totalCompleted;
    if (accuracyEl) accuracyEl.textContent = totalCompleted > 0 ? Math.round(totalCorrect / totalCompleted * 100) + '%' : '0%';
}

// 上传笔记
function handleThinkingNoteUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        window.showToast('请上传图片文件');
        return;
    }
    
    const user = window.getCurrentUserData();
    if (!user.thinkingNotes) user.thinkingNotes = [];
    
    const imageUrl = URL.createObjectURL(file);
    user.thinkingNotes.push({
        id: 'thinking-note-' + Date.now(),
        image: imageUrl,
        name: file.name,
        uploadTime: new Date().toLocaleString()
    });
    syncUserData(user);
    window.showToast('笔记上传成功！');
    renderThinkingNotes();
}

// 渲染笔记
function renderThinkingNotes() {
    const user = window.getCurrentUserData();
    const notes = user?.thinkingNotes || [];
    const listEl = document.getElementById('thinking-notes-list');
    if (!listEl) return;
    
    if (notes.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:#999;text-align:center;padding:12px;">暂无笔记</div>';
        return;
    }
    
    listEl.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">已上传 ${notes.length} 个笔记</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${notes.map(note => `
                <div style="position:relative;">
                    <img src="${note.image}" style="width:100%;height:80px;object-fit:cover;border-radius:8px;cursor:pointer;" onclick="viewThinkingNote('${note.id}')">
                    <button onclick="deleteThinkingNote('${note.id}')" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:white;border:none;width:20px;height:20px;border-radius:50%;font-size:10px;cursor:pointer;">✕</button>
                </div>
            `).join('')}
        </div>
    `;
}

// 查看/删除笔记
function viewThinkingNote(noteId) {
    const user = window.getCurrentUserData();
    const note = user?.thinkingNotes?.find(n => n.id === noteId);
    if (!note) return;
    
    const content = (typeof window.ensureDetailModal === 'function') ? window.ensureDetailModal() : document.getElementById('detail-content');
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.add('show');
    content.innerHTML = `
        <div class="modal-title">📝 思维训练笔记</div>
        <img src="${note.image}" style="width:100%;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#999;margin-bottom:16px;">上传时间：${note.uploadTime}</div>
        <button class="modal-close" onclick="window.closeModal()">关闭</button>
    `;
}

function deleteThinkingNote(noteId) {
    if (!confirm('确定删除这个笔记吗？')) return;
    const user = window.getCurrentUserData();
    user.thinkingNotes = user.thinkingNotes.filter(n => n.id !== noteId);
    syncUserData(user);
    renderThinkingNotes();
    window.showToast('笔记已删除');
}


// Window exports
window.renderThinking = renderThinking;
window.showThinkingType = showThinkingType;
window.startThinkingQuiz = startThinkingQuiz;
window.selectThinkingOpt = selectThinkingOpt;
window.submitThinkingAnswers = submitThinkingAnswers;
window.renderThinkingNotes = renderThinkingNotes;
window.handleThinkingNoteUpload = handleThinkingNoteUpload;
window.deleteThinkingNote = deleteThinkingNote;
window.updateThinkingStats = updateThinkingStats;


// ============================================================
// 从V144提取的缺失函数
// ============================================================

// AI分析思维训练题目
async function analyzeThinkingWithAI(type, questionIndex) {
    const resultDiv = document.getElementById('thinking-ai-result-' + type + '-' + questionIndex);
    if (!resultDiv) return;
    
    resultDiv.innerHTML = '<div style="padding:12px;text-align:center;color:#666;">🤖 AI分析中...</div>';
    
    const questions = window.thinkingQuestions[type];
    if (!questions || !questions[questionIndex]) {
        resultDiv.innerHTML = '<div style="padding:12px;color:#ff6b6b;">题目不存在</div>';
        return;
    }
    
    const question = questions[questionIndex];
    const typeNames = {
        logic: '逻辑思维', creative: '创意思维', critical: '批判思维', system: '系统思维',
        reverse: '逆向思维', divergent: '发散思维', converge: '收敛思维', spatial: '空间思维',
        abstract: '抽象思维'
    };
    
    const messages = [{
        role: 'user',
        content: '请分析这道' + (typeNames[type] || '思维训练') + '的题目：\n题目：' + question.q + '\n选项：' + (question.opts ? question.opts.map((o, i) => String.fromCharCode(65 + i) + '. ' + o).join('\n') : '') + '\n\n请给出详细解析和改进建议，帮助提升思维能力。'
    }];
    
    try {
        const result = await callDeepSeekAPI(messages, 0.7);
        if (result.error) {
            resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ ' + result.message + '</div>';
        } else {
            resultDiv.innerHTML = '<div style="padding:12px;background:#f5f7ff;border-radius:8px;font-size:13px;line-height:1.6;">🤖 ' + formatAIResponse(result.content) + '</div>';
            // 记录AI调用
            if (typeof recordDeepSeekCall === 'function') {
                recordDeepSeekCall(Math.ceil(result.content.length / 4));
            }
        }
    } catch(e) {
        resultDiv.innerHTML = '<div style="padding:12px;background:#fff3f3;border-radius:8px;color:#ff6b6b;font-size:13px;">❌ 网络错误，请稍后重试</div>';
    }
}

function closeDetail() { var m = document.getElementById('detail-modal'); if (m) m.classList.remove('show'); }

function closeModal(modalId) {
    if (!modalId) {
        // 如果没有指定 modalId，默认关闭 detail-modal
        const modal = document.getElementById('detail-modal');
        if (modal) modal.classList.remove('show');
    } else {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }
}


// ============================================================
// Window Exports
// ============================================================
window.rateThinkingAnswer = rateThinkingAnswer;
window.viewThinkingNote = viewThinkingNote;
window.analyzeThinkingWithAI = analyzeThinkingWithAI;

window.closeDetail = closeDetail;
window.closeModal = closeModal;

// 拍照出题：OCR识别图片文字 + AI生成题目
async function photoToQuestion(imageData) {
    var modal = document.getElementById('modal');
    var content = document.getElementById('modal-content');
    if (!modal || !content) return;
    
    content.innerHTML = '<div class="modal-title">📷 拍照出题</div>' +
        '<div style="text-align:center;padding:20px;">' +
            '<img src="' + imageData + '" style="max-width:200px;max-height:150px;border-radius:8px;margin-bottom:12px;"/>' +
            '<div id="photo-ocr-status" style="font-size:13px;color:#666;">🔍 正在识别图片文字...</div>' +
        '</div>';
    if (modal) modal.classList.add('show');
    
    try {
        var ocrText = '';
        // V224: 按需加载Tesseract.js
        await new Promise(function(resolve) {
            if (typeof loadTesseract === 'function') {
                loadTesseract(resolve);
            } else {
                resolve();
            }
        });
        
        if (typeof Tesseract !== 'undefined') {
            var result = await Tesseract.recognize(imageData, 'chi_sim+eng', {});
            ocrText = result.data.text.trim();
        }
        
        if (!ocrText) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 未识别到文字，请重新拍照</span>';
            return;
        }
        
        document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#43a047;">✅ 识别成功，正在生成题目...</span><br><div style="font-size:11px;color:#999;margin-top:4px;text-align:left;max-height:60px;overflow-y:auto;">' + ocrText.substring(0,300) + '</div>';
        
        // 用DeepSeek根据识别文字出题
        var messages = [
            {role: 'system', content: '你是一位专业的中学教师。根据学生上传的图片文字内容，出3道相关的练习题。每题包含题目、4个选项和正确答案。格式：\n1. 题目\nA. 选项A B. 选项B C. 选项C D. 选项D\n答案：X\n'},
            {role: 'user', content: '图片中识别到的文字内容：\n' + ocrText + '\n\n请根据这些内容出3道选择题。'}
        ];
        
        var dsResult = await callDeepSeekAPI(messages);
        
        if (dsResult.error) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ AI出题失败: ' + (dsResult.message || '未知错误') + '</span>';
            return;
        }
        
        content.innerHTML = '<div class="modal-title">📷 拍照出题结果</div>' +
            '<div style="padding:10px;font-size:13px;line-height:1.8;max-height:400px;overflow-y:auto;">' +
                formatAIResponse(dsResult.content) +
            '</div>' +
            '<button onclick="window.closeModal()" class="login-btn login-btn-secondary" style="margin-top:8px;">关闭</button>';
        
    } catch(e) {
        if (document.getElementById('photo-ocr-status')) {
            document.getElementById('photo-ocr-status').innerHTML = '<span style="color:#ff6b6b;">❌ 识别失败: ' + e.message + '</span>';
        }
    }
}
window.photoToQuestion = photoToQuestion;

// 题库数据
const questionsDB = {
  // 母题训练 - 6大分类
  moti: {
    categories: [
      { id: 'language', name: '语言理解', icon: '📝', color: '#FF6B6B' },
      { id: 'math', name: '数理逻辑', icon: '🔢', color: '#4ECDC4' },
      { id: 'spatial', name: '空间认知', icon: '🎨', color: '#45B7D1' },
      { id: 'memory', name: '记忆宫殿', icon: '🧠', color: '#96CEB4' },
      { id: 'creative', name: '创意联想', icon: '💡', color: '#FFEAA7' },
      { id: 'analyze', name: '分析判断', icon: '🔍', color: '#DDA0DD' }
    ],
    questions: {
      language: [
        { id: 'l1', question: '请在30秒内尽可能多地列出"天空"的同义词和相关词', type: 'open', points: 10 },
        { id: 'l2', question: '将以下词语组成通顺的句子：我 科技 未来 智能 生活', type: 'order', points: 8 },
        { id: 'l3', question: '"画蛇添足"这个成语告诉我们什么道理？', type: 'choice', options: ['多此一举反而不好', '做事要充分发挥想象', '团结力量大', '要善于观察'], answer: 0, points: 10 }
      ],
      math: [
        { id: 'm1', question: '找规律：2, 6, 12, 20, 30, ?', type: 'input', answer: '42', points: 15 },
        { id: 'm2', question: '如果3只猫3分钟抓3只老鼠，那么10只猫10分钟抓几只老鼠？', type: 'choice', options: ['10只', '30只', '33只', '3只'], answer: 1, points: 20 }
      ],
      spatial: [
        { id: 's1', question: '将左侧图形折叠后会变成右侧哪个选项？', type: 'visual', image: 'cube', points: 15 },
        { id: 's2', question: '找出下图中所有的三角形数量', type: 'input', answer: '12', points: 15 }
      ],
      memory: [
        { id: 'mm1', question: '记忆以下数字：3857291046，30秒后默写', type: 'input', answer: '3857291046', points: 20 },
        { id: 'mm2', question: '使用记忆宫殿记忆：钥匙、雨伞、书本、苹果、眼镜', type: 'open', points: 15 }
      ],
      creative: [
        { id: 'c1', question: '请在2分钟内列出回形针的至少20种用途', type: 'open', points: 25 },
        { id: 'c2', question: '如果时间可以倒流，你会改变什么？', type: 'open', points: 15 }
      ],
      analyze: [
        { id: 'a1', question: '根据数据判断趋势：周一100，周二120，周三115，周四130，周五？', type: 'input', answer: '140', points: 12 },
        { id: 'a2', question: '哪种图表最适合展示占比关系？', type: 'choice', options: ['折线图', '柱状图', '饼图', '散点图'], answer: 2, points: 8 }
      ]
    }
  },

  // 学霸方法 - 9种方法
  method: {
    categories: [
      { id: ' Feynman', name: '费曼学习法', icon: '🎓', desc: '用简单语言解释复杂概念', color: '#667eea' },
      { id: ' SQ3R', name: 'SQ3R阅读法', icon: '📖', desc: '浏览-提问-阅读-复述-复习', color: '#f093fb' },
      { id: ' Cornell', name: '康奈尔笔记', icon: '📝', desc: '笔记分区高效复习', color: '#4facfe' },
      { id: ' Pomodoro', name: '番茄工作法', icon: '🍅', desc: '专注25分钟休息5分钟', color: '#43e97b' },
      { id: ' mindmap', name: '思维导图', icon: '🧠', desc: '可视化思维整理工具', color: '#fa709a' },
      { id: ' spaced', name: '间隔重复', icon: '⏰', desc: '科学遗忘曲线复习', color: '#fee140' },
      { id: ' active', name: '主动回忆', icon: '💪', desc: '测试式学习加深记忆', color: '#a8edea' },
      { id: ' chunking', name: '组块记忆', icon: '🧩', desc: '信息分组更容易记忆', color: '#ff9a9e' },
      { id: ' interleaving', name: '交错练习', icon: '🔀', desc: '混合不同类型题目', color: '#a18cd1' }
    ],
    questions: {
      ' Feynman': [
        { id: 'f1', question: '用费曼技巧解释"什么是人工智能"？试着用三岁小孩能懂的话来说', type: 'open', points: 15 },
        { id: 'f2', question: '选择一个你熟悉的概念，尝试不看书本用自己的话写出来', type: 'open', points: 20 }
      ],
      ' SQ3R': [
        { id: 'sq1', question: 'SQ3R中5个步骤的全称是什么？', type: 'choice', options: ['Survey, Question, Read, Review, Recite', 'Search, Query, Read, Remember, Recite', 'Survey, Question, Recall, Review, Recite', 'Scan, Question, Read, Review, Recall'], answer: 0, points: 10 },
        { id: 'sq2', question: '为什么"提问"这个步骤很重要？', type: 'open', points: 12 }
      ],
      ' Cornell': [
        { id: 'cn1', question: '康奈尔笔记的三大部分分别是什么？', type: 'choice', options: ['标题、正文、总结', '笔记区、问题区、总结区', '左边、右边、下边', '开头、中间、结尾'], answer: 1, points: 10 },
        { id: 'cn2', question: '用康奈尔笔记法整理今天学习的一个知识点', type: 'open', points: 18 }
      ]
    }
  },

  // 思维训练 - 9种思维
  thinking: {
    categories: [
      { id: 'logical', name: '逻辑思维', icon: '⚙️', desc: '因果推理与分析', color: '#667eea' },
      { id: 'critical', name: '批判思维', icon: '⚖️', desc: '质疑与评估信息', color: '#f093fb' },
      { id: 'systemic', name: '系统思维', icon: '🔗', desc: '整体与部分关系', color: '#4facfe' },
      { id: 'design', name: '设计思维', icon: '🎨', desc: '以用户为中心创新', color: '#43e97b' },
      { id: 'lateral', name: '横向思维', icon: '🔄', desc: '多角度解决问题', color: '#fa709a' },
      { id: 'abstract', name: '抽象思维', icon: '📐', desc: '抓住本质特征', color: '#fee140' },
      { id: 'reverse', name: '逆向思维', icon: '🔙', desc: '反其道而行之', color: '#a8edea' },
      { id: 'probabilistic', name: '概率思维', icon: '🎲', desc: '风险评估与决策', color: '#ff9a9e' },
      { id: 'firstprinciple', name: '第一性原理', icon: '🧱', desc: '从本质重新思考', color: '#a18cd1' }
    ],
    questions: {
      logical: [
        { id: 'lt1', question: '所有A是B，所有B是C，那么所有A是C吗？', type: 'choice', options: ['一定', '不一定', '绝对不是', '无法判断'], answer: 0, points: 12 },
        { id: 'lt2', question: '如果明天下雨，运动会延期。明天是晴天。运动会延期吗？', type: 'choice', options: ['会', '不会', '无法确定', '取决于其他因素'], answer: 1, points: 10 }
      ],
      critical: [
        { id: 'ct1', question: '"研究表明80%的人更喜欢X品牌"——这个结论有什么问题？', type: 'open', points: 18 },
        { id: 'ct2', question: '哪些信息可以帮助你评估这条新闻的可信度？', type: 'open', points: 15 }
      ],
      systemic: [
        { id: 'st1', question: '一个城市的交通拥堵系统包括哪些相互影响的因素？', type: 'open', points: 20 },
        { id: 'st2', question: '蝴蝶效应说明系统具有什么特征？', type: 'choice', options: ['线性', '非线性', '静止', '可预测'], answer: 1, points: 10 }
      ],
      design: [
        { id: 'dt1', question: '为老年人设计一款手机App，你会考虑哪些方面？', type: 'open', points: 18 },
        { id: 'dt2', question: '设计思维的5个步骤是？', type: 'choice', options: ['观察、定义、构思、原型、测试', '想法、计划、执行、检验、改进', '思考、讨论、决策、实施、总结', '分析、设计、开发、发布、维护'], answer: 0, points: 12 }
      ],
      lateral: [
        { id: 'lpt1', question: '如何用一根吸管穿透一个土豆？', type: 'open', points: 20 },
        { id: 'lpt2', question: '一个房间只有一盏灯，如何在门外控制它的开关？', type: 'open', points: 15 }
      ],
      abstract: [
        { id: 'at1', question: '"成功"这个概念可以抽象为什么核心要素？', type: 'open', points: 15 },
        { id: 'at2', question: '从苹果、火车、飞机中提取共同的抽象特征', type: 'open', points: 12 }
      ],
      reverse: [
        { id: 'rt1', question: '常规思维：如何防止被盗？逆向思维：如何让人主动送还？', type: 'open', points: 18 },
        { id: 'rt2', question: '与其学习如何成功，不如先研究什么导致失败，这是什么思维？', type: 'choice', options: ['横向思维', '逆向思维', '系统思维', '批判思维'], answer: 1, points: 10 }
      ],
      probabilistic: [
        { id: 'pt1', question: '连续抛硬币10次都是正面，第11次正面概率是多少？', type: 'choice', options: ['大于50%', '等于50%', '小于50%', '需要计算'], answer: 1, points: 15 },
        { id: 'pt2', question: '如果某种疾病患病率是1%，检测准确率是99%，你检测呈阳性，真正患病的概率是多少？', type: 'open', points: 25 }
      ],
      firstprinciple: [
        { id: 'fp1', question: '马斯克为什么认为电池太贵？他如何用第一性原理解决这个问题？', type: 'open', points: 20 },
        { id: 'fp2', question: '不用现成的解决方案，如何重新思考"教育"这个概念？', type: 'open', points: 18 }
      ]
    }
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = questionsDB;
}

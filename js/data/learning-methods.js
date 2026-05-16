// ============================================================
// 学霸方法7件套详细教程数据
// ============================================================

const LEARNING_METHODS = {
    feyman: {
        id: 'feyman',
        title: '费曼学习法',
        icon: '🧠',
        color: '#667eea',
        tagline: '以教促学，用最简单的话讲清复杂知识',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">🧠 费曼学习法</div>
        <div style="font-size:13px;opacity:0.9;">以教促学，用最简单的话讲清复杂知识</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        费曼学习法是一种"以教促学"的高效方法，核心是：用最简单直白的话，把复杂知识讲给完全不懂的人听，并在这个过程中发现自己哪里没真正搞懂，再回头学习，直到能清晰讲明白。
    </p>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体四步</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#667eea;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">1</div>
                <div>
                    <div style="font-weight:600;color:#333;">确定目标</div>
                    <div style="font-size:13px;color:#666;">拿出一张纸，写下你想学习的概念或知识点。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#667eea;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">2</div>
                <div>
                    <div style="font-weight:600;color:#333;">模拟教学</div>
                    <div style="font-size:13px;color:#666;">假装要讲给一个8岁孩子或完全不懂的门外汉听。用最简洁、通俗的语言写出来或讲出来，避免使用专业术语。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#667eea;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">3</div>
                <div>
                    <div style="font-weight:600;color:#333;">发现盲点</div>
                    <div style="font-size:13px;color:#666;">在讲解中，你一定会卡住或解释不清。这说明你对这部分的理解有漏洞或错误。这是学习的关键——回到原始材料，重新学习，直到能通顺解释。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#667eea;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">4</div>
                <div>
                    <div style="font-weight:600;color:#333;">简化与类比</div>
                    <div style="font-size:13px;color:#666;">最后，把语言进一步梳理、简化，尝试用生活中的例子做类比，让解释既准确又极其易懂。</div>
                </div>
            </div>
        </div>
    </div>

    <div style="background:#fff3cd;padding:16px;border-radius:10px;border-left:4px solid #ffc107;margin-bottom:20px;">
        <div style="font-weight:600;color:#856404;margin-bottom:8px;">💡 核心价值</div>
        <p style="font-size:13px;color:#856404;line-height:1.6;margin:0;">
            这个方法的威力在于：它直接暴露了"我以为我懂了，其实并没懂"的幻觉。真正的检验标准不是"输入"（听讲、阅读），而是能否做到有效的"输出"（讲解、应用）。
        </p>
    </div>
</div>
        `
    },

    pomodoro: {
        id: 'pomodoro',
        title: '番茄工作法',
        icon: '🍅',
        color: '#FF6B6B',
        tagline: '25分钟专注+5分钟休息，告别拖延',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#FF6B6B,#ff8e53);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">🍅 番茄工作法</div>
        <div style="font-size:13px;opacity:0.9;">25分钟专注+5分钟休息，告别拖延</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        番茄工作法是一种简单易行的时间管理方法，核心是：把时间切成固定的"工作—休息"小单元（通常25分钟工作+5分钟休息），每完成4个单元，来一次较长休息（15-30分钟）。
    </p>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体五步</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#FF6B6B;">1.</span>
                <div>
                    <span style="font-weight:600;">准备：</span>
                    <span style="color:#666;">列一个"待办任务"清单，把你今天要学习的内容拆成小任务。准备一个计时器。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#FF6B6B;">2.</span>
                <div>
                    <span style="font-weight:600;">启动：</span>
                    <span style="color:#666;">选择一个任务，把计时器设为25分钟，开始专心学习。原则是：这25分钟内只做这一件事。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#FF6B6B;">3.</span>
                <div>
                    <span style="font-weight:600;">休息：</span>
                    <span style="color:#666;">铃声一响，立刻停止。休息5分钟（站起来走动、喝水、闭眼，不要看屏幕）。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#FF6B6B;">4.</span>
                <div>
                    <span style="font-weight:600;">循环：</span>
                    <span style="color:#666;">重复"25分钟工作+5分钟休息"3-4次。完成4个番茄钟后，进行一次长休息（15-30分钟）。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#FF6B6B;">5.</span>
                <div>
                    <span style="font-weight:600;">记录：</span>
                    <span style="color:#666;">每完成一个番茄钟，在任务旁打一个√。如果中途被打断，可以把这件事写下来，稍后处理。</span>
                </div>
            </div>
        </div>
    </div>

    <div style="background:#e8f5e9;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:10px;color:#2e7d32;">💡 在学习上的主要作用</div>
        <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8;">
            <li><strong>提升专注力：</strong>25分钟不长，心理压力小，更容易"开始"，也更容易坚持不分心</li>
            <li><strong>减少疲劳：</strong>强制短暂休息，让大脑恢复，避免长时间学习带来的效率下降</li>
            <li><strong>增强掌控感：</strong>把大任务拆解成几个"番茄钟"，每完成一个都有小成就感，减少拖延</li>
        </ul>
    </div>
</div>
        `
    },

    ebbinghaus: {
        id: 'ebbinghaus',
        title: '艾宾浩斯遗忘曲线',
        icon: '📉',
        color: '#4facfe',
        tagline: '间隔重复，对抗遗忘，告别假努力',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">📉 艾宾浩斯遗忘曲线</div>
        <div style="font-size:13px;opacity:0.9;">间隔重复，对抗遗忘，告别假努力</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        遗忘曲线由德国心理学家艾宾浩斯提出，它描述了人类大脑对新信息的遗忘规律：刚学完的记忆量是100%，20分钟后只剩约58%，1小时后约44%，1天后约33%，1周后约25%，1个月后约21%……遗忘速度先快后慢。
    </p>

    <div style="background:#fff3cd;padding:16px;border-radius:10px;border-left:4px solid #ffc107;margin-bottom:20px;">
        <div style="font-weight:600;color:#856404;margin-bottom:8px;">⚠️ 关键发现</div>
        <p style="font-size:13px;color:#856404;line-height:1.6;margin:0;">
            遗忘在学习完的当天就发生，而且最初几小时掉得最快。学完不复习≈白学。成绩差距往往不在智商，而在有没有按规律巩固。
        </p>
    </div>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体操作（7次复习点）</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第1次</span>
                <span style="font-size:12px;color:#666;">学完后立刻 — 闭眼30秒过一遍核心内容</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第2次</span>
                <span style="font-size:12px;color:#666;">1小时后 — 做题、画思维导图、自问自答</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第3次</span>
                <span style="font-size:12px;color:#666;">当天晚上（约12小时内）— 睡前快速梳理一遍</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第4次</span>
                <span style="font-size:12px;color:#666;">1天后 — 第二天开始学新内容前，花5分钟复习</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第5次</span>
                <span style="font-size:12px;color:#666;">3天后 — 重点关注之前记错或卡壳的地方</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">第6次</span>
                <span style="font-size:12px;color:#666;">1周后 — 进行小范围阶段检测（默写、讲给别人听）</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;padding:10px;background:white;border-radius:8px;">
                <span style="width:80px;font-size:12px;font-weight:600;color:#4facfe;">后续</span>
                <span style="font-size:12px;color:#666;">1个月、3个月、半年 — 纳入定期大复习</span>
            </div>
        </div>
    </div>
</div>
        `
    },

    mindmap: {
        id: 'mindmap',
        title: '思维导图法',
        icon: '🗺️',
        color: '#43E97B',
        tagline: '5步画出知识结构，理清逻辑，辅助记忆',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#43E97B,#38F9D7);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">🗺️ 思维导图法</div>
        <div style="font-size:13px;opacity:0.9;">5步画出知识结构，理清逻辑，辅助记忆</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        思维导图是一种把大脑里的想法"画"出来的工具。它的核心不是记笔记，而是模拟大脑思考的方式：从一个中心主题出发，像树根一样向外发散出无数个分支，用关键词、图像和颜色建立联系。
    </p>

    <div style="background:#e8f5e9;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:10px;color:#2e7d32;">💡 在学习上的主要作用</div>
        <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8;">
            <li><strong>理清逻辑：</strong>把混乱的零散知识，整理成层次分明的结构，一眼就能看清全局</li>
            <li><strong>辅助记忆：</strong>大脑天生对图像、颜色和关联结构更敏感，比线性笔记更容易回忆</li>
            <li><strong>激发思考：</strong>画分支的过程中，大脑被迫寻找知识点之间的联系，容易产生新的理解</li>
            <li><strong>高效复习：</strong>一张图就是知识缩影。考前看一遍图，比翻几十页笔记快得多</li>
        </ul>
    </div>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体五步</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#43E97B;">1.</span>
                <div>
                    <span style="font-weight:600;">准备工具：</span>
                    <span style="color:#666;">一张白纸（建议A4或更大，横放）和几支不同颜色的笔；或者用软件（如XMind、幕布）。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#43E97B;">2.</span>
                <div>
                    <span style="font-weight:600;">确定中心主题：</span>
                    <span style="color:#666;">在纸中央画一个图形或写一个关键词，最好用图像+颜色。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#43E97B;">3.</span>
                <div>
                    <span style="font-weight:600;">画出主干分支：</span>
                    <span style="color:#666;">围绕中心主题，找出几个最核心的分类，画成从中心向外辐射的粗线条。每条线用一个关键词和一种颜色。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#43E97B;">4.</span>
                <div>
                    <span style="font-weight:600;">延伸细枝末节：</span>
                    <span style="color:#666;">在每个主干上，继续延伸下一级、下一级分支，用更细的线条和更具体的关键词。</span>
                </div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="font-weight:600;color:#43E97B;">5.</span>
                <div>
                    <span style="font-weight:600;">完善与美化：</span>
                    <span style="color:#666;">适当添加小图标、边框或关系线，让重点突出、关联明显。整个过程要尽量用词，不用句子，保持简洁。</span>
                </div>
            </div>
        </div>
    </div>
</div>
        `
    },

    cornell: {
        id: 'cornell',
        title: '康奈尔笔记法',
        icon: '📝',
        color: '#FF9F43',
        tagline: '系统化记笔记，知识留存率提升30%',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#FF9F43,#FF6B6B);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">📝 康奈尔笔记法</div>
        <div style="font-size:13px;opacity:0.9;">系统化记笔记，知识留存率提升30%</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        康奈尔笔记法是指由美国康奈尔大学教育学教授沃尔特·波克于1940年代提出的一种系统化的笔记与复习方法。它将一页纸划分为三个功能区：主笔记栏（右）、线索栏（左）和总结栏（底），通过"记录-提炼-思考"的流程，把记笔记变成一个主动理解、即时消化、高效复习的系统过程。
    </p>

    <div style="background:#fff3cd;padding:16px;border-radius:10px;border-left:4px solid #ffc107;margin-bottom:20px;">
        <div style="font-weight:600;color:#856404;margin-bottom:8px;">📊 效果数据</div>
        <p style="font-size:13px;color:#856404;line-height:1.6;margin:0;">
            据研究，持续使用此方法的学生，长期知识留存率可提升约30%。非常适合用于听课、阅读教材、整理复习资料。
        </p>
    </div>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体五步</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#FF9F43;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">1</div>
                <div>
                    <div style="font-weight:600;color:#333;">准备页面</div>
                    <div style="font-size:13px;color:#666;">将一页纸画成三部分：右侧70%=主笔记栏，左侧30%=线索栏，底部5-8厘米=总结栏。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#FF9F43;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">2</div>
                <div>
                    <div style="font-weight:600;color:#333;">记录 (Record)</div>
                    <div style="font-size:13px;color:#666;">在右侧主笔记栏，用常规方式记笔记。尽量用自己的话缩写，不要逐字抄写。善用符号、缩写、列表。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#FF9F43;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">3</div>
                <div>
                    <div style="font-weight:600;color:#333;">提炼 (Reduce)</div>
                    <div style="font-size:13px;color:#666;">课后2小时内，在左侧线索栏，针对右侧内容提出一个能概括全段的问题或核心关键词。遮住右侧后，只看左侧这个问题，你应该能大致复述右侧内容。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#FF9F43;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">4</div>
                <div>
                    <div style="font-weight:600;color:#333;">总结 (Summarize)</div>
                    <div style="font-size:13px;color:#666;">当天学习结束，在底部总结栏，用1-2句话写出这一页笔记的核心思想。总结不是复述，而是提炼到更高一层。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#FF9F43;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">5</div>
                <div>
                    <div style="font-weight:600;color:#333;">复习 (Review)</div>
                    <div style="font-size:13px;color:#666;">遮住右侧，只看左侧线索，尝试口头回答。然后揭开右侧核对。按照遗忘曲线的时间点，重复上述自测过程。</div>
                </div>
            </div>
        </div>
    </div>
</div>
        `
    },

    sq3r: {
        id: 'sq3r',
        title: 'SQ3R精读法',
        icon: '📚',
        color: '#9b59b6',
        tagline: '5步精读法，阅读理解得分提升25%',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">📚 SQ3R精读法</div>
        <div style="font-size:13px;opacity:0.9;">5步精读法，阅读理解得分提升25%</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        SQ3R是一种系统化的精读方法，旨在通过五个结构化步骤——纵览（Survey）、提问（Question）、阅读（Read）、复述（Recite）、复习（Review），将被动接收信息转变为主动探索和理解的过程。它由教育心理学家弗朗西斯·罗宾逊于1946年提出，专门用于应对需要深度理解的复杂文本。
    </p>

    <div style="background:#f3e5f5;padding:16px;border-radius:10px;border-left:4px solid #9b59b6;margin-bottom:20px;">
        <div style="font-weight:600;color:#7b1fa2;margin-bottom:8px;">📊 效果数据</div>
        <p style="font-size:13px;color:#7b1fa2;line-height:1.6;margin:0;">
            据研究，配合该方法可使阅读理解得分提升25%。非常适合用来精读教科书、文献等需要深度理解的材料。
        </p>
    </div>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">📋 具体五步</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:36px;height:36px;background:#9b59b6;color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;flex-shrink:0;">S</div>
                <div>
                    <div style="font-weight:600;color:#333;">纵览 (Survey)</div>
                    <div style="font-size:13px;color:#666;">在投入之前先"总览全局"，明确阅读的目标和整体框架，将新旧知识连接起来。花几分钟快速浏览标题、摘要、各级标题、图表以及章节末尾的问题。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:36px;height:36px;background:#9b59b6;color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;flex-shrink:0;">Q</div>
                <div>
                    <div style="font-weight:600;color:#333;">提问 (Question)</div>
                    <div style="font-size:13px;color:#666;">将标题转为问题，带着"目的"去阅读，为大脑设定探索任务，帮助集中注意力并提升兴趣。把每个主要标题转化为"是什么？""为什么？"等问题。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:36px;height:36px;background:#9b59b6;color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;flex-shrink:0;">R1</div>
                <div>
                    <div style="font-weight:600;color:#333;">阅读 (Read)</div>
                    <div style="font-size:13px;color:#666;">带着问题去"精读"，主动寻找答案，将被动阅读变为主动寻找信息的过程，提升理解力。可以在一个完整的番茄钟（25分钟）内保持高度专注。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:36px;height:36px;background:#9b59b6;color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;flex-shrink:0;">R2</div>
                <div>
                    <div style="font-weight:600;color:#333;">复述 (Recite)</div>
                    <div style="font-size:13px;color:#666;">读完即"输出"，用费曼学习法检验理解，这是检验理解程度的最佳方式。读完一个小节后，合上书用自己的话把核心概念讲出来，确保讲解简单易懂。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:36px;height:36px;background:#9b59b6;color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;flex-shrink:0;">R3</div>
                <div>
                    <div style="font-weight:600;color:#333;">复习 (Review)</div>
                    <div style="font-size:13px;color:#666;">遵循"遗忘曲线"规律，及时间隔复习，对抗遗忘，将信息巩固为长期记忆。在学习后的1天、1周、1个月等固定时间点进行复习。可以尝试用思维导图将知识点视觉化。</div>
                </div>
            </div>
        </div>
    </div>

    <div style="background:#e3f2fd;padding:16px;border-radius:10px;border-left:4px solid #2196f3;margin-bottom:20px;">
        <div style="font-weight:600;color:#1565c0;margin-bottom:8px;">💡 核心思想</div>
        <p style="font-size:13px;color:#1565c0;line-height:1.6;margin:0;">
            SQ3R的核心就是把"我要读这本书"变成了"我要从这本书里找到这些问题的答案"。它让阅读从一个被动接收信息的动作，变成了一个需要主动发起、主动探索、主动思考的完整认知流程。
        </p>
    </div>
</div>
        `
    },

    timeManagement: {
        id: 'timeManagement',
        title: '时间管理法',
        icon: '⏰',
        color: '#ee5a24',
        tagline: '管理注意力与优先级，3小时抵得上10小时',
        content: `
<div class="method-tutorial">
    <div style="background:linear-gradient(135deg,#ee5a24,#d63031);color:white;padding:20px;border-radius:12px;margin-bottom:20px;">
        <div style="font-size:24px;font-weight:600;margin-bottom:8px;">⏰ 时间管理</div>
        <div style="font-size:13px;opacity:0.9;">管理注意力与优先级，3小时抵得上10小时</div>
    </div>

    <p style="color:#666;line-height:1.6;margin-bottom:20px;">
        时间管理，简单说就是：主动规划和安排自己的时间，让有限的时间产生最大价值。在学习场景下，它不是把日程塞满，而是确保：把最重要的学习任务，在最适合的时段，用最高效的方法完成。
    </p>

    <div style="background:#f8f9fa;padding:16px;border-radius:10px;margin-bottom:20px;">
        <div style="font-weight:600;margin-bottom:12px;color:#333;">🎯 学习上最有效的三个核心原则</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#ee5a24;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">1</div>
                <div>
                    <div style="font-weight:600;color:#333;">要事第一</div>
                    <div style="font-size:13px;color:#666;">永远先做"重要但不紧急"的事（比如系统复习、攻克薄弱章节），而不是被"紧急但不重要"的事牵着走。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#ee5a24;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">2</div>
                <div>
                    <div style="font-weight:600;color:#333;">精力匹配难度</div>
                    <div style="font-size:13px;color:#666;">高难度的学习（如做数学大题、理解新概念）放在你精力最旺盛的时段（比如早起后2小时）；低难度任务放在精力低谷。</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <div style="width:28px;height:28px;background:#ee5a24;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;">3</div>
                <div>
                    <div style="font-weight:600;color:#333;">计划-执行-反馈</div>
                    <div style="font-size:13px;color:#666;">不做"假计划"，每天留出弹性时间，并定期检查实际完成情况。</div>
                </div>
            </div>
        </div>
    </div>

    <div style="background:#fff3cd;padding:16px;border-radius:10px;border-left:4px solid #ffc107;margin-bottom:20px;">
        <div style="font-weight:600;color:#856404;margin-bottom:8px;">⚠️ 避坑提醒</div>
        <ul style="margin:0;padding-left:20px;color:#856404;font-size:13px;line-height:1.8;">
            <li><strong>误区1：</strong>把计划排得满满当当，不留空隙 → 一旦被打乱就全盘崩溃。<strong>对策：</strong>每天只安排60%的时间给固定任务，留出40%弹性时间。</li>
            <li><strong>误区2：</strong>只做"简单"的任务，逃避"困难"的任务。<strong>对策：</strong>每天早上先吃掉那只最丑的青蛙。</li>
            <li><strong>误区3：</strong>频繁切换任务。<strong>对策：</strong>一个番茄钟内只做一件事。</li>
        </ul>
    </div>

    <div style="background:#e8f5e9;padding:16px;border-radius:10px;border-left:4px solid #4caf50;margin-bottom:20px;">
        <div style="font-weight:600;color:#2e7d32;margin-bottom:8px;">💡 最后一句心法</div>
        <p style="font-size:13px;color:#2e7d32;line-height:1.6;margin:0;">
            时间管理的本质不是管理时间，而是管理自己的注意力与优先级。哪怕你每天只学3小时，只要这3小时全部用在"要事"上并高度专注，效果远胜于坐在桌前发呆10小时。
        </p>
    </div>
</div>
        `
    }
};

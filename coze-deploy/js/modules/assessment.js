// ============================================================
// 能力测评模块（assessment.js）
// 借鉴华师大"评估→基线→推荐"闭环：6个轻量小关测出六维能力基线
// 六维：专注力attention / 记忆力memory / 思维力thinking
//       反应力reaction / 坚持力persistence / 元认知metacognition
// 纯前端、localStorage 存储，key: cognitive_assessment
// 版本: V439
// ============================================================
(function () {
    'use strict';

    var STORE_KEY = 'cognitive_assessment';
    var DIMS = [
        { key: 'attention', label: '专注力', icon: '🎯', color: '#667eea' },
        { key: 'memory', label: '记忆力', icon: '🧠', color: '#764ba2' },
        { key: 'thinking', label: '思维力', icon: '💡', color: '#f093fb' },
        { key: 'reaction', label: '反应力', icon: '⚡', color: '#f5576c' },
        { key: 'persistence', label: '坚持力', icon: '🏃', color: '#43e97b' },
        { key: 'metacognition', label: '元认知', icon: '🔮', color: '#fa709a' }
    ];

    // 维度 -> 推荐游戏（id 取自 games-config.js）
    var DIM_GAMES = {
        attention: [
            { id: 'schulte', name: '舒尔特方格', reason: '经典专注力训练，按顺序找数字' },
            { id: 'visual', name: '视觉搜索', reason: '在干扰中快速定位目标' },
            { id: 'stroop', name: 'Stroop冲突', reason: '抗干扰、抑制冲动' },
            { id: 'attention', name: '注意力追踪', reason: '持续追踪移动目标' }
        ],
        memory: [
            { id: 'digit', name: '数字记忆', reason: '短时记忆广度训练' },
            { id: 'text', name: '文字记忆', reason: '词语材料记忆' },
            { id: 'palace', name: '记忆宫殿', reason: '空间记忆法，记得更牢' }
        ],
        thinking: [
            { id: 'reason', name: '逻辑推理', reason: '规律发现与推理' },
            { id: 'pattern', name: '图案匹配', reason: '观察与归纳' },
            { id: 'classify', name: '分类归纳', reason: '抽象与概括能力' },
            { id: 'network', name: '知识网络', reason: '系统思维' }
        ],
        reaction: [
            { id: 'tap', name: '快速点击', reason: '提升反应速度' },
            { id: 'color', name: '色彩识别', reason: '快速辨色反应' },
            { id: 'diff', name: '找不同', reason: '细节快速察觉' }
        ],
        persistence: [
            { id: 'pomodoro', name: '番茄工作法', reason: '练习专注坚持25分钟' },
            { id: 'schulte', name: '舒尔特方格', reason: '耐心中完成挑战' }
        ],
        metacognition: [
            { id: 'feyman', name: '费曼学习法', reason: '以教代学，检验是否真懂' },
            { id: 'mindmap', name: '思维导图法', reason: '结构化梳理知识' },
            { id: 'ebbinghaus', name: '艾宾浩斯曲线', reason: '学会规划复习' }
        ]
    };

    // 共享状态
    var root = null;
    var raw = {};

    // ---------- 工具 ----------
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function $(id) { return root ? root.querySelector('#' + id) : document.getElementById(id); }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function getAssessment() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; }
    }

    // ---------- 弱项推荐 ----------
    // 综合测评基线与实时训练数据（calculateCognitiveData），返回最弱2维 + 推荐游戏
    function getWeakRecommendations() {
        var scores = null;
        var assess = getAssessment();
        var live = null;
        try {
            if (typeof window.calculateCognitiveData === 'function') live = window.calculateCognitiveData();
        } catch (e) { live = null; }

        if (assess && assess.scores) {
            // 有测评：以测评为基线，若有训练数据则做 40% 加权融合
            scores = {};
            DIMS.forEach(function (d) {
                var base = assess.scores[d.key];
                if (live && typeof live[d.key] === 'number') {
                    scores[d.key] = Math.round(base * 0.6 + live[d.key] * 0.4);
                } else {
                    scores[d.key] = base;
                }
            });
        } else if (live) {
            scores = {};
            DIMS.forEach(function (d) { scores[d.key] = live[d.key]; });
        } else {
            return []; // 无任何数据
        }

        var ranked = DIMS.slice().sort(function (a, b) { return scores[a.key] - scores[b.key]; });
        var weak2 = ranked.slice(0, 2);
        return weak2.map(function (d) {
            var games = DIM_GAMES[d.key].slice(0, 3);
            var advice = '';
            if (scores[d.key] < 40) advice = '这项目前是明显短板，建议每天练 5~10 分钟，坚持一周会有明显变化。';
            else if (scores[d.key] < 65) advice = '这项还有提升空间，作为每天训练的重点之一。';
            else advice = '这项基础不错，保持训练、适当挑战更高难度。';
            return { dimension: d.key, label: d.label, icon: d.icon, color: d.color, score: scores[d.key], games: games, advice: advice };
        });
    }

    // ---------- 雷达图（内联SVG六边形） ----------
    function radarSvg(scores, size) {
        size = size || 260;
        var cx = size / 2, cy = size / 2, R = size * 0.36;
        var n = DIMS.length;
        function pt(i, r) {
            var ang = -Math.PI / 2 + i * 2 * Math.PI / n;
            return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
        }
        var rings = [0.25, 0.5, 0.75, 1];
        var html = '<svg viewBox="0 0 ' + size + ' ' + size + '" style="width:100%;max-width:' + size + 'px;height:auto;">';
        // 网格
        rings.forEach(function (rr) {
            var pts = [];
            for (var i = 0; i < n; i++) { var p = pt(i, R * rr); pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
            html += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="#e5e7eb" stroke-width="1"/>';
        });
        for (var i2 = 0; i2 < n; i2++) { var p2 = pt(i2, R); html += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="#e5e7eb" stroke-width="1"/>'; }
        // 数据面
        var dpts = [];
        for (var i3 = 0; i3 < n; i3++) {
            var val = clamp((scores[DIMS[i3].key] || 0) / 100, 0, 1);
            var p3 = pt(i3, R * val);
            dpts.push(p3[0].toFixed(1) + ',' + p3[1].toFixed(1));
        }
        html += '<polygon points="' + dpts.join(' ') + '" fill="rgba(102,126,234,0.25)" stroke="#667eea" stroke-width="2"/>';
        for (var i4 = 0; i4 < n; i4++) {
            var v4 = clamp((scores[DIMS[i4].key] || 0) / 100, 0, 1);
            var p4 = pt(i4, R * v4);
            html += '<circle cx="' + p4[0].toFixed(1) + '" cy="' + p4[1].toFixed(1) + '" r="3.5" fill="#764ba2"/>';
            // 标签
            var lp = pt(i4, R * 1.22);
            var anchor = Math.abs(lp[0] - cx) < 8 ? 'middle' : (lp[0] > cx ? 'start' : 'end');
            html += '<text x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 4).toFixed(1) + '" font-size="13" fill="#374151" text-anchor="' + anchor + '" font-weight="600">' + DIMS[i4].icon + DIMS[i4].label + '</text>';
        }
        html += '</svg>';
        return html;
    }

    // ---------- 样式 ----------
    var CSS = ''
        + '.as-wrap{padding:8px 4px 40px;}'
        + '.as-card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 4px 16px rgba(102,126,234,0.08);margin-bottom:16px;}'
        + '.as-title{font-size:20px;font-weight:800;color:#1f2937;text-align:center;margin-bottom:6px;}'
        + '.as-sub{font-size:13px;color:#6b7280;text-align:center;line-height:1.7;margin-bottom:14px;}'
        + '.as-btn{display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:16px;font-weight:700;color:#fff;background:linear-gradient(135deg,#667eea,#764ba2);cursor:pointer;margin-top:10px;}'
        + '.as-btn:active{opacity:.85;}'
        + '.as-btn-ghost{background:#fff;color:#667eea;border:2px solid #667eea;}'
        + '.as-progress{height:8px;background:#eef0f6;border-radius:4px;overflow:hidden;margin-bottom:16px;}'
        + '.as-progress>i{display:block;height:100%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:4px;transition:width .3s;}'
        + '.as-step{font-size:12px;color:#9ca3af;text-align:center;margin-bottom:8px;}'
        + '.as-q{font-size:17px;font-weight:700;color:#1f2937;text-align:center;margin:10px 0 18px;line-height:1.6;}'
        + '.as-grid{display:grid;gap:10px;}'
        + '.as-cell{background:#f5f6fb;border:2px solid transparent;border-radius:12px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#4b5563;cursor:pointer;user-select:none;-webkit-user-select:none;transition:all .1s;}'
        + '.as-cell:active{transform:scale(.95);}'
        + '.as-cell.done{background:#dcfce7;color:#16a34a;border-color:#86efac;}'
        + '.as-cell.bad{background:#fee2e2;color:#dc2626;border-color:#fca5a5;}'
        + '.as-opt{display:block;width:100%;text-align:left;padding:14px 16px;margin-bottom:10px;background:#f5f6fb;border:2px solid transparent;border-radius:12px;font-size:15px;color:#374151;cursor:pointer;line-height:1.5;}'
        + '.as-opt:active{background:#e9ebf8;}'
        + '.as-react{height:200px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;cursor:pointer;user-select:none;-webkit-user-select:none;text-align:center;padding:10px;}'
        + '.as-react.wait{background:#fee2e2;color:#b91c1c;}'
        + '.as-react.go{background:#dcfce7;color:#15803d;}'
        + '.as-react.idle{background:#eef0f6;color:#6b7280;}'
        + '.as-score-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6;}'
        + '.as-score-row:last-child{border-bottom:none;}'
        + '.as-bar{flex:1;height:8px;background:#eef0f6;border-radius:4px;overflow:hidden;}'
        + '.as-bar>i{display:block;height:100%;border-radius:4px;}'
        + '.as-weak{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fdba74;border-radius:12px;padding:12px 14px;margin-top:10px;}'
        + '.as-game{display:flex;align-items:center;gap:10px;background:#f5f6fb;border-radius:12px;padding:12px;margin-top:8px;cursor:pointer;}'
        + '.as-game:active{background:#e9ebf8;}'
        + '.as-game .gico{font-size:24px;}'
        + '.as-badge{display:inline-block;background:#fee2e2;color:#dc2626;font-size:11px;font-weight:700;border-radius:10px;padding:2px 8px;margin-left:6px;}'
        + '.as-enter{background:linear-gradient(135deg,#eef2ff,#f5f3ff);border-radius:14px;padding:16px;margin-bottom:14px;}'
        + '.as-enter li{font-size:13px;color:#4b5563;line-height:2;margin-left:4px;list-style:none;}'
        ;

    // ---------- 渲染入口 ----------
    function renderAssessment(container) {
        root = container;
        root.innerHTML = '<div class="as-wrap"><style>' + CSS + '</style><div id="as-body"></div></div>';
        renderIntro();
    }

    function body() { return root.querySelector('#as-body'); }
    function setBody(html) { var b = body(); if (b) b.innerHTML = html; }

    // ===== 介绍页 =====
    function renderIntro() {
        var assess = getAssessment();
        var hist = '';
        if (assess) {
            var d = new Date(assess.date);
            hist = '<div style="text-align:center;font-size:13px;color:#6b7280;margin-bottom:10px;">上次测评：' + (d.getMonth() + 1) + '月' + d.getDate() + '日 · 已测评 ' + (assess.times || 1) + ' 次</div>';
        }
        setBody(
            '<div class="as-card">'
            + '<div style="font-size:48px;text-align:center;">🧩</div>'
            + '<div class="as-title">能力测评</div>'
            + '<div class="as-sub">6 个趣味小关，约 5 分钟<br/>测出专注力、记忆力、思维力、反应力、坚持力、元认知的基础水平，<br/>为你推荐最合适的训练。</div>'
            + '<div class="as-enter"><ul>'
            + '<li>🎯 第1关 专注力：按顺序点数字</li>'
            + '<li>🧠 第2关 记忆力：记住闪现的图案</li>'
            + '<li>💡 第3关 思维力：找规律小问答</li>'
            + '<li>⚡ 第4关 反应力：变绿就点</li>'
            + '<li>🏃 第5关 坚持力：两个小问题</li>'
            + '<li>🔮 第6关 元认知：两个小问题</li>'
            + '</ul></div>'
            + hist
            + '<button class="as-btn" onclick="window.__asStart()">' + (assess ? '重新测评' : '开始测评') + '</button>'
            + (assess ? '<button class="as-btn as-btn-ghost" onclick="window.__asResult()">查看上次结果</button>' : '')
            + '</div>'
        );
    }

    function progressHtml(idx) {
        var pct = Math.round(((idx) / 6) * 100);
        return '<div class="as-step">第 ' + (idx + 1) + ' / 6 关</div><div class="as-progress"><i style="width:' + pct + '%"></i></div>';
    }

    // ===== 第1关：专注力（舒尔特） =====
    function stageAttention() {
        var N = 9; // 3x3
        var order = shuffle(Array.from({ length: N }, function (_, i) { return i + 1; }));
        var state = { next: 1, t0: 0, mistakes: 0 };
        raw.attention = {};
        var cells = order.map(function (num) {
            return '<div class="as-cell" data-n="' + num + '" onclick="window.__asAttentionTap(this)">' + num + '</div>';
        }).join('');
        setBody(
            '<div class="as-card">' + progressHtml(0)
            + '<div class="as-q">🎯 专注力挑战<br/><span style="font-size:13px;font-weight:400;color:#6b7280;">按 1 → ' + N + ' 的顺序，又快又准地点完数字</span></div>'
            + '<div class="as-grid" style="grid-template-columns:repeat(3,1fr);max-width:320px;margin:0 auto;" id="as-att-grid">' + cells + '</div>'
            + '<div style="text-align:center;margin-top:14px;font-size:13px;color:#9ca3af;" id="as-att-info">点「1」开始计时</div>'
            + '</div>'
        );
        window.__asAttentionTap = function (el) {
            var n = parseInt(el.getAttribute('data-n'), 10);
            if (n === state.next) {
                if (state.next === 1) { state.t0 = Date.now(); }
                el.classList.add('done');
                el.onclick = null;
                state.next++;
                if (state.next > N) {
                    var sec = (Date.now() - state.t0) / 1000;
                    raw.attention = { seconds: Math.round(sec * 10) / 10, mistakes: state.mistakes };
                    setTimeout(stageMemory, 400);
                } else {
                    var info = root.querySelector('#as-att-info');
                    if (info) info.textContent = '已点到 ' + (state.next - 1) + '，继续找 ' + state.next;
                }
            } else {
                state.mistakes++;
                el.classList.add('bad');
                setTimeout(function () { el.classList.remove('bad'); }, 300);
            }
        };
    }

    // ===== 第2关：记忆力（闪现位置） =====
    function stageMemory() {
        raw.memory = {};
        var total = 9, targetCount = 4;
        var positions = shuffle(Array.from({ length: total }, function (_, i) { return i; }));
        var targets = positions.slice(0, targetCount);
        setBody(
            '<div class="as-card">' + progressHtml(1)
            + '<div class="as-q">🧠 记忆力挑战<br/><span style="font-size:13px;font-weight:400;color:#6b7280;">先记住亮起的格子，熄灭后把它们点出来</span></div>'
            + '<div class="as-grid" style="grid-template-columns:repeat(3,1fr);max-width:280px;margin:0 auto;" id="as-mem-grid">'
            + Array.from({ length: total }, function (_, i) {
                var lit = targets.indexOf(i) >= 0;
                return '<div class="as-cell" data-i="' + i + '" data-lit="' + (lit ? 1 : 0) + '" style="' + (lit ? 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-color:#764ba2;' : '') + '">' + (lit ? '⭐' : '') + '</div>';
            }).join('')
            + '</div>'
            + '<div style="text-align:center;margin-top:14px;font-size:13px;color:#9ca3af;" id="as-mem-info">盯住亮星的位置…</div>'
            + '</div>'
        );
        // 3秒后熄灭
        setTimeout(function () {
            var grid = root.querySelector('#as-mem-grid');
            if (!grid) return;
            var cs = grid.querySelectorAll('.as-cell');
            cs.forEach(function (c) {
                c.setAttribute('style', '');
                c.textContent = '';
                c.onclick = function () { window.__asMemoryTap(c); };
            });
            var info = root.querySelector('#as-mem-info');
            if (info) info.textContent = '现在把刚才亮星的位置点出来（共 ' + targetCount + ' 个）';
            window.__asMemState = { picked: [], total: targetCount };
        }, 3000);

        window.__asMemoryTap = function (el) {
            if (!window.__asMemState || el.classList.contains('done')) return;
            window.__asMemState.picked.push(parseInt(el.getAttribute('data-i'), 10));
            el.classList.add('done');
            el.textContent = el.getAttribute('data-lit') === '1' ? '⭐' : '✕';
            if (window.__asMemState.picked.length >= window.__asMemState.total) {
                var correct = 0;
                root.querySelectorAll('#as-mem-grid .as-cell').forEach(function (c) {
                    var lit = c.getAttribute('data-lit') === '1';
                    var picked = c.classList.contains('done');
                    if (lit && picked) correct++;
                    if (!lit && picked) { c.classList.add('bad'); c.textContent = '✕'; }
                });
                raw.memory = { total: window.__asMemState.total, correct: correct };
                setTimeout(stageThinking, 600);
            }
        };
    }

    // ===== 第3关：思维力（规律选择） =====
    var THINK_QUESTIONS = [
        { q: '观察规律：2, 4, 6, 8, ?  问号是几？', opts: ['9', '10', '12', '11'], a: 1 },
        { q: '找规律：△ ○ □ △ ○ ?  问号是什么？', opts: ['△', '○', '□', '☆'], a: 2 },
        { q: '小猫比小狗高，小狗比小兔高。谁最矮？', opts: ['小猫', '小狗', '小兔', '一样高'], a: 2 },
        { q: '哪一个和其他三个不是同一类？', opts: ['苹果', '香蕉', '胡萝卜', '橘子'], a: 2 },
        { q: '1, 1, 2, 3, 5, ?  （前两个相加得下一个）问号是？', opts: ['6', '7', '8', '9'], a: 2 }
    ];
    function stageThinking() {
        raw.thinking = { total: THINK_QUESTIONS.length, correct: 0, idx: 0 };
        renderThinkQ();
    }
    function renderThinkQ() {
        var idx = raw.thinking.idx;
        if (idx >= THINK_QUESTIONS.length) { stageReaction(); return; }
        var q = THINK_QUESTIONS[idx];
        setBody(
            '<div class="as-card">' + progressHtml(2)
            + '<div class="as-q">💡 思维力挑战（' + (idx + 1) + '/' + THINK_QUESTIONS.length + '）</div>'
            + '<div style="font-size:16px;font-weight:600;color:#1f2937;text-align:center;margin-bottom:18px;line-height:1.7;">' + esc(q.q) + '</div>'
            + q.opts.map(function (o, i) {
                return '<button class="as-opt" onclick="window.__asThinkPick(' + i + ')">' + String.fromCharCode(65 + i) + '. ' + esc(o) + '</button>';
            }).join('')
            + '</div>'
        );
        window.__asThinkPick = function (i) {
            if (i === THINK_QUESTIONS[idx].a) raw.thinking.correct++;
            raw.thinking.idx++;
            renderThinkQ();
        };
    }

    // ===== 第4关：反应力（变绿点击） =====
    function stageReaction() {
        raw.reaction = { times: [], round: 0, totalRounds: 3 };
        setBody(
            '<div class="as-card">' + progressHtml(3)
            + '<div class="as-q">⚡ 反应力挑战<br/><span style="font-size:13px;font-weight:400;color:#6b7280;">看到屏幕变绿，立刻点一下（共 3 次）</span></div>'
            + '<div class="as-react idle" id="as-react-box" onclick="window.__asReactClick()">准备好了，点这里开始</div>'
            + '<div style="text-align:center;margin-top:12px;font-size:13px;color:#9ca3af;" id="as-react-info"></div>'
            + '</div>'
        );
        var timer = null;
        var waiting = false;
        function setPhase(phase, text) {
            var box = root.querySelector('#as-react-box');
            if (!box) return;
            box.className = 'as-react ' + phase;
            box.textContent = text;
        }
        function nextRound() {
            waiting = false;
            if (raw.reaction.round >= raw.reaction.totalRounds) {
                var sorted = raw.reaction.times.slice().sort(function (a, b) { return a - b; });
                raw.reaction.median = sorted[Math.floor(sorted.length / 2)];
                setTimeout(stagePersistence, 500);
                return;
            }
            setPhase('wait', '等它变绿…（提前点算犯规哦）');
            waiting = true;
            var delay = 1200 + Math.random() * 2200;
            timer = setTimeout(function () {
                waiting = false;
                setPhase('go', '现在！快点！');
                window.__asReactT0 = Date.now();
            }, delay);
        }
        window.__asReactClick = function () {
            var box = root.querySelector('#as-react-box');
            if (!box) return;
            if (box.classList.contains('idle')) { if (!waiting) nextRound(); return; }
            if (box.classList.contains('wait')) {
                clearTimeout(timer);
                waiting = false;
                setPhase('idle', '太着急啦，点这里重来这一轮');
                var info = root.querySelector('#as-react-info');
                if (info) info.textContent = '抢跑了～等变绿再点';
                // 不计数，重新本轮
                window.__asReactRetry = true;
                setTimeout(nextRound, 900);
                return;
            }
            if (box.classList.contains('go')) {
                var ms = Date.now() - window.__asReactT0;
                raw.reaction.times.push(ms);
                raw.reaction.round++;
                var info2 = root.querySelector('#as-react-info');
                if (info2) info2.textContent = '第 ' + raw.reaction.round + ' 次：' + ms + ' 毫秒';
                setPhase('idle', raw.reaction.round >= raw.reaction.totalRounds ? '完成！' : '点这里继续下一次');
            }
        };
    }

    // ===== 第5/6关：问卷（坚持力 / 元认知） =====
    var PERSIST_QS = [
        { q: '遇到一道难题，你通常会？', opts: ['马上放弃去玩', '想一会儿不会就算了', '认真想10分钟以上，实在不会再问人', '非要自己做出来，不达目的不罢休'] },
        { q: '一件需要长期坚持的事（比如每天阅读），你能坚持？', opts: ['两三天', '一两周', '一两个月', '好几个月甚至更久'] },
        { q: '正在专注做事时被有趣的东西吸引，你会？', opts: ['立刻被吸引走', '犹豫一下还是去看了', '告诉自己做完再看，基本能做到', '完全不受影响'] }
    ];
    var META_QS = [
        { q: '做完作业或题目后，你会检查吗？', opts: ['从不检查', '大人催才检查', '有时会主动检查', '每次都会认真检查'] },
        { q: '你清楚自己哪类题最容易出错吗？', opts: ['完全不清楚', '好像知道一点', '比较清楚', '非常清楚，还会专门练'] },
        { q: '学完一个新知识，你会怎么确认自己真的懂了？', opts: ['看过就算懂了', '能认出答案就行', '试着讲给别人听/做题验证', '会用自己的话复述并找题练'] }
    ];
    function stagePersistence() {
        raw.persistence = { answers: [], idx: 0 };
        renderSurveyQ('persistence', PERSIST_QS, '🏃 坚持力', stageMetacognition);
    }
    function stageMetacognition() {
        raw.metacognition = { answers: [], idx: 0 };
        renderSurveyQ('metacognition', META_QS, '🔮 元认知', finishAssessment);
    }
    function renderSurveyQ(dim, qs, icon, nextFn) {
        var idx = raw[dim].idx;
        if (idx >= qs.length) { nextFn(); return; }
        var stepIdx = dim === 'persistence' ? 4 : 5;
        var q = qs[idx];
        setBody(
            '<div class="as-card">' + progressHtml(stepIdx)
            + '<div class="as-q">' + icon + '小问题（' + (idx + 1) + '/' + qs.length + '）<br/><span style="font-size:12px;font-weight:400;color:#9ca3af;">凭真实想法选就好，没有对错之分</span></div>'
            + '<div style="font-size:16px;font-weight:600;color:#1f2937;text-align:center;margin-bottom:16px;">' + esc(q.q) + '</div>'
            + q.opts.map(function (o, i) {
                return '<button class="as-opt" onclick="window.__asSurveyPick(\'' + dim + '\',' + i + ')">' + esc(o) + '</button>';
            }).join('')
            + '</div>'
        );
        window.__asSurveyPick = function (d, choice) {
            raw[d].answers.push(choice);
            raw[d].idx++;
            renderSurveyQ(d, qs, icon, nextFn);
        };
    }

    // ---------- 评分 ----------
    function calcScores() {
        var s = {};
        // 专注力：用时越短分越高（基准18秒满分，35秒及格），错误扣分
        var att = raw.attention.seconds || 30;
        var attBase = clamp(100 - (att - 12) * 4.2, 35, 100);
        s.attention = Math.round(clamp(attBase - (raw.attention.mistakes || 0) * 4, 30, 100));
        // 记忆力：正确数/总数
        s.memory = Math.round(clamp((raw.memory.correct / raw.memory.total) * 100, 30, 100));
        // 思维力：正确率
        s.thinking = Math.round(clamp((raw.thinking.correct / raw.thinking.total) * 100, 25, 100));
        // 反应力：中位数毫秒（250ms满分，600ms及格线）
        var ms = raw.reaction.median || 600;
        s.reaction = Math.round(clamp(100 - (ms - 230) * 0.18, 30, 100));
        // 坚持力：问卷选项0-3，映射
        var pAvg = raw.persistence.answers.reduce(function (a, b) { return a + b; }, 0) / raw.persistence.answers.length;
        s.persistence = Math.round(clamp(35 + pAvg * 22, 30, 100));
        // 元认知：同上
        var mAvg = raw.metacognition.answers.reduce(function (a, b) { return a + b; }, 0) / raw.metacognition.answers.length;
        s.metacognition = Math.round(clamp(35 + mAvg * 22, 30, 100));
        return s;
    }

    function dimComment(key, score) {
        if (score >= 85) return '非常出色，是你的强项！';
        if (score >= 70) return '基础不错，继续保持。';
        if (score >= 50) return '还有提升空间，多练会进步。';
        return '目前偏弱，重点练这一项。';
    }

    // ---------- 完成 & 结果 ----------
    function finishAssessment() {
        var scores = calcScores();
        var prev = getAssessment();
        var record = {
            date: new Date().toISOString(),
            times: (prev && prev.times ? prev.times : 0) + 1,
            scores: scores,
            raw: raw
        };
        try { localStorage.setItem(STORE_KEY, JSON.stringify(record)); } catch (e) {}
        if (typeof window.__asRefreshBadge === 'function') window.__asRefreshBadge();
        renderResult(scores, record);
    }

    function renderResult(scores, record) {
        scores = scores || (record && record.scores) || getDefaultScores();
        // 最弱两项
        var ranked = DIMS.slice().sort(function (a, b) { return scores[a.key] - scores[b.key]; });
        var weak = ranked.slice(0, 2);
        var d = record ? new Date(record.date) : new Date();

        var detailHtml = DIMS.map(function (dim) {
            var sc = scores[dim.key];
            var isWeak = weak.indexOf(dim) >= 0;
            return '<div class="as-score-row">'
                + '<span style="font-size:18px;">' + dim.icon + '</span>'
                + '<span style="width:56px;font-size:13px;font-weight:600;color:#374151;">' + dim.label + (isWeak ? '<span class="as-badge">重点</span>' : '') + '</span>'
                + '<div class="as-bar"><i style="width:' + sc + '%;background:' + dim.color + ';"></i></div>'
                + '<span style="width:36px;text-align:right;font-weight:800;color:' + dim.color + ';">' + sc + '</span>'
                + '</div>'
                + '<div style="font-size:11px;color:#9ca3af;margin:-4px 0 6px 26px;">' + dimComment(dim.key, sc) + '</div>';
        }).join('');

        var weakHtml = weak.map(function (dim) {
            var games = DIM_GAMES[dim.key].slice(0, 3);
            return '<div style="margin-bottom:12px;"><div style="font-weight:700;font-size:14px;color:#9a3412;">' + dim.icon + ' ' + dim.label + ' ' + scores[dim.key] + ' 分</div>'
                + games.map(function (g) {
                    return '<div class="as-game" onclick="window.__asLaunch(\'' + g.id + '\')"><span class="gico">🎮</span><div style="flex:1;"><div style="font-weight:700;font-size:14px;">' + esc(g.name) + '</div><div style="font-size:11px;color:#9ca3af;">' + esc(g.reason) + '</div></div><span style="color:#667eea;">›</span></div>';
                }).join('')
                + '</div>';
        }).join('');

        setBody(
            '<div class="as-card">'
            + '<div style="font-size:44px;text-align:center;">🎉</div>'
            + '<div class="as-title">测评完成！</div>'
            + '<div class="as-sub">这是你的六维能力基线<br/>' + (d.getMonth() + 1) + '月' + d.getDate() + '日 · 第 ' + (record ? record.times : 1) + ' 次测评</div>'
            + '<div style="max-width:320px;margin:0 auto;">' + radarSvg(scores, 280) + '</div>'
            + '</div>'
            + '<div class="as-card"><div style="font-weight:800;font-size:15px;margin-bottom:10px;">📊 各项得分</div>' + detailHtml + '</div>'
            + '<div class="as-card"><div style="font-weight:800;font-size:15px;margin-bottom:6px;">🎯 为你推荐的训练</div>'
            + '<div style="font-size:12px;color:#6b7280;margin-bottom:8px;">优先练下面两项，进步最明显</div>'
            + '<div class="as-weak">' + weakHtml + '</div></div>'
            + '<button class="as-btn" onclick="window.__asGoTrain()">开始今天的训练</button>'
            + '<button class="as-btn as-btn-ghost" onclick="window.__asGoMap()">查看认知地图</button>'
        );
    }

    function getDefaultScores() {
        var s = {}; DIMS.forEach(function (d) { s[d.key] = 50; }); return s;
    }

    // ---------- 跳转动作 ----------
    function launchGame(id) {
        try {
            if (typeof window.startGame === 'function') { window.startGame(id); return; }
        } catch (e) {}
        // 兜底：打开游戏页
        try { if (typeof window.openFullscreenPage === 'function') window.openFullscreenPage('games'); } catch (e) {}
    }
    window.__asLaunch = function (id) { launchGame(id); };
    window.__asStart = function () { raw = {}; stageAttention(); };
    window.__asResult = function () { var a = getAssessment(); if (a) renderResult(a.scores, a); else renderIntro(); };
    window.__asGoTrain = function () { try { window.openFullscreenPage('games'); } catch (e) {} };
    window.__asGoMap = function () { try { window.openFullscreenPage('map'); } catch (e) {} };

    // ---------- 暴露 ----------
    window.renderAssessment = renderAssessment;
    window.getWeakRecommendations = getWeakRecommendations;
    window.assessmentDims = DIMS;

    // 首页 NEW 角标：未做过测评时显示
    function refreshBadge() {
        try {
            var badge = document.getElementById('assessment-badge');
            if (badge) badge.style.display = getAssessment() ? 'none' : 'inline-block';
        } catch (e) {}
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refreshBadge);
    } else {
        refreshBadge();
    }
    window.__asRefreshBadge = refreshBadge;

    // 注册到 CTM
    try {
        if (typeof CTM !== 'undefined' && CTM.registerModule) {
            CTM.registerModule('assessment', { render: renderAssessment });
        }
    } catch (e) {}
})();

/* 模拟考试模块 - ES6 Modules 标准
 * 仿真试卷系统、拍照上传、手写答题
 * 通过 store 共享状态，eventBus 广播变化
 */

import { store } from '../store.js';
import { eventBus } from '../event-bus.js';
import { storage } from '../storage.js';

const STORAGE_KEY = 'mock_exam_data';

// 默认数据结构
const DEFAULT_DATA = {
    exams: [],
    papers: [],
    currentExamId: null,
    currentPaperId: null,
    settings: {
        autoSave: true,
        penColor: '#000000',
        penSize: 3,
        penType: 'pen',
        showGrid: true
    }
};

// 笔型配置
const PEN_TYPES = {
    pen: { name: '钢笔', opacity: 1, lineCap: 'round', lineJoin: 'round' },
    marker: { name: '马克笔', opacity: 0.6, lineCap: 'round', lineJoin: 'round' },
    highlighter: { name: '荧光笔', opacity: 0.3, lineCap: 'square', lineJoin: 'miter' }
};

// 颜色预设
const COLORS = ['#000000', '#1a73e8', '#ea4335', '#34a853', '#fbbc04', '#9c27b0'];

// 初始化模块
export function initMockExam() {
    const savedData = storage.get(STORAGE_KEY, {});
    const data = { ...DEFAULT_DATA, ...savedData };
    store.setState('mockExam', data);
    console.log('[MockExam] 模拟考试模块初始化完成');
    eventBus.emit('module:ready', 'mockExam');
}

// 获取数据
export function getMockExamData() {
    return store.getState('mockExam');
}

// 保存数据
function saveData(data) {
    storage.set(STORAGE_KEY, data);
    store.setState('mockExam', data);
    eventBus.emit('mockExam:updated', data);
}

// ========== 试卷管理 ==========

// 创建空白试卷
export function createPaper(name, config = {}) {
    const data = getMockExamData();
    const id = `paper_${Date.now()}`;
    
    const paper = {
        id,
        name,
        type: config.type || 'blank', // blank, template, uploaded
        image: config.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: config.questions || generateDefaultQuestions(),
        drawingData: { strokes: [], historyIndex: -1 },
        settings: {
            showAnswerArea: true,
            paperSize: 'A4',
            orientation: 'portrait'
        }
    };
    
    data.papers.unshift(paper);
    data.currentPaperId = id;
    saveData(data);
    
    return paper;
}

// 生成默认题目结构
function generateDefaultQuestions() {
    return [
        {
            id: 'q1',
            type: 'choice',
            title: '一、单项选择题（每题5分，共25分）',
            items: [
                { no: 1, text: '下列哪个不是JavaScript的数据类型？', options: ['A. String', 'B. Number', 'C. Boolean', 'D. Array'], answer: 'D', answerArea: { x: 50, y: 100, width: 200, height: 40 } },
                { no: 2, text: '以下哪个是ES6新增的特性？', options: ['A. var', 'B. let/const', 'C. function', 'D. Array'], answer: 'B', answerArea: { x: 50, y: 160, width: 200, height: 40 } },
                { no: 3, text: 'Promise的状态不包括？', options: ['A. pending', 'B. fulfilled', 'C. rejected', 'D. completed'], answer: 'D', answerArea: { x: 50, y: 220, width: 200, height: 40 } },
                { no: 4, text: '下列哪个不是数组方法？', options: ['A. map', 'B. filter', 'C. reduce', 'D. apply'], answer: 'D', answerArea: { x: 50, y: 280, width: 200, height: 40 } },
                { no: 5, text: '箭头函数的特点是？', options: ['A. 有自己的this', 'B. 没有arguments', 'C. 可以作为构造函数', 'D. 可以使用yield'], answer: 'B', answerArea: { x: 50, y: 340, width: 200, height: 40 } }
            ]
        },
        {
            id: 'q2',
            type: 'essay',
            title: '二、简答题（每题15分，共30分）',
            items: [
                { no: 6, text: '简述什么是闭包，以及闭包的应用场景。', answerArea: { x: 50, y: 420, width: 500, height: 150 } },
                { no: 7, text: '解释什么是事件循环（Event Loop）。', answerArea: { x: 50, y: 600, width: 500, height: 150 } }
            ]
        },
        {
            id: 'q3',
            type: 'coding',
            title: '三、编程题（每题22.5分，共45分）',
            items: [
                { no: 8, text: '实现一个防抖函数debounce。', answerArea: { x: 50, y: 780, width: 500, height: 200 } },
                { no: 9, text: '用ES6语法实现一个Promise.all的polyfill。', answerArea: { x: 50, y: 1010, width: 500, height: 200 } }
            ]
        }
    ];
}

// 从图片创建试卷（拍照上传）
export function createPaperFromImage(name, imageData) {
    return createPaper(name, {
        type: 'uploaded',
        image: imageData
    });
}

// 获取所有试卷
export function getAllPapers() {
    const data = getMockExamData();
    return data.papers;
}

// 获取单个试卷
export function getPaperById(id) {
    const data = getMockExamData();
    return data.papers.find(p => p.id === id);
}

// 更新试卷
export function updatePaper(id, updates) {
    const data = getMockExamData();
    const paper = data.papers.find(p => p.id === id);
    
    if (paper) {
        Object.assign(paper, updates);
        paper.updatedAt = new Date().toISOString();
        saveData(data);
        return paper;
    }
    return null;
}

// 删除试卷
export function deletePaper(id) {
    const data = getMockExamData();
    const index = data.papers.findIndex(p => p.id === id);
    
    if (index > -1) {
        data.papers.splice(index, 1);
        if (data.currentPaperId === id) {
            data.currentPaperId = data.papers.length > 0 ? data.papers[0].id : null;
        }
        saveData(data);
        return true;
    }
    return false;
}

// ========== 手写绘图功能 ==========

// 保存笔画
export function saveStroke(paperId, stroke) {
    const paper = getPaperById(paperId);
    if (!paper) return false;
    
    // 清空撤销后的历史
    const drawingData = paper.drawingData;
    if (drawingData.historyIndex < drawingData.strokes.length - 1) {
        drawingData.strokes = drawingData.strokes.slice(0, drawingData.historyIndex + 1);
    }
    
    drawingData.strokes.push(stroke);
    drawingData.historyIndex = drawingData.strokes.length - 1;
    
    updatePaper(paperId, { drawingData });
    return true;
}

// 撤销
export function undoStroke(paperId) {
    const paper = getPaperById(paperId);
    if (!paper || paper.drawingData.historyIndex < 0) return false;
    
    paper.drawingData.historyIndex--;
    updatePaper(paperId, { drawingData: paper.drawingData });
    return true;
}

// 重做
export function redoStroke(paperId) {
    const paper = getPaperById(paperId);
    if (!paper || paper.drawingData.historyIndex >= paper.drawingData.strokes.length - 1) return false;
    
    paper.drawingData.historyIndex++;
    updatePaper(paperId, { drawingData: paper.drawingData });
    return true;
}

// 清空画布
export function clearCanvas(paperId) {
    const paper = getPaperById(paperId);
    if (!paper) return false;
    
    paper.drawingData.strokes = [];
    paper.drawingData.historyIndex = -1;
    updatePaper(paperId, { drawingData: paper.drawingData });
    return true;
}

// 获取可显示的笔画
export function getVisibleStrokes(paperId) {
    const paper = getPaperById(paperId);
    if (!paper) return [];
    
    const { strokes, historyIndex } = paper.drawingData;
    return strokes.slice(0, historyIndex + 1);
}

// ========== 考试功能 ==========

// 开始考试
export function startExam(paperId, duration = 120) {
    const data = getMockExamData();
    const examId = `exam_${Date.now()}`;
    
    const exam = {
        id: examId,
        paperId,
        startTime: new Date().toISOString(),
        endTime: null,
        duration, // 分钟
        status: 'ongoing', // ongoing, submitted, paused
        answers: {},
        score: null,
        pausedAt: null,
        remainingTime: duration * 60
    };
    
    data.exams.unshift(exam);
    data.currentExamId = examId;
    saveData(data);
    
    return exam;
}

// 提交考试
export function submitExam(examId) {
    const data = getMockExamData();
    const exam = data.exams.find(e => e.id === examId);
    
    if (exam) {
        exam.status = 'submitted';
        exam.endTime = new Date().toISOString();
        
        // 自动评分（仅选择题）
        const paper = getPaperById(exam.paperId);
        if (paper) {
            let totalScore = 0;
            let maxScore = 0;
            
            paper.questions.forEach(q => {
                if (q.type === 'choice') {
                    q.items.forEach(item => {
                        maxScore += 5;
                        if (exam.answers[item.no] === item.answer) {
                            totalScore += 5;
                        }
                    });
                }
            });
            
            exam.score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : null;
            exam.totalScore = totalScore;
            exam.maxScore = maxScore;
        }
        
        saveData(data);
        return exam;
    }
    return null;
}

// 保存答案
export function saveAnswer(examId, questionNo, answer) {
    const data = getMockExamData();
    const exam = data.exams.find(e => e.id === examId);
    
    if (exam) {
        exam.answers[questionNo] = answer;
        saveData(data);
        return true;
    }
    return false;
}

// 获取考试历史
export function getExamHistory() {
    const data = getMockExamData();
    return data.exams;
}

// ========== 工具函数 ==========

// 获取笔型配置
export function getPenConfig(type) {
    return PEN_TYPES[type] || PEN_TYPES.pen;
}

// 获取所有笔型
export function getAllPenTypes() {
    return Object.entries(PEN_TYPES).map(([key, val]) => ({ id: key, ...val }));
}

// 获取颜色预设
export function getColorPresets() {
    return COLORS;
}

// 更新笔设置
export function updatePenSettings(settings) {
    const data = getMockExamData();
    Object.assign(data.settings, settings);
    saveData(data);
}

export default {
    init: initMockExam,
    getData: getMockExamData,
    createPaper,
    createPaperFromImage,
    getAllPapers,
    getPaperById,
    updatePaper,
    deletePaper,
    saveStroke,
    undoStroke,
    redoStroke,
    clearCanvas,
    getVisibleStrokes,
    startExam,
    submitExam,
    saveAnswer,
    getExamHistory,
    getPenConfig,
    getAllPenTypes,
    getColorPresets,
    updatePenSettings
};

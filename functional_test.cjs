#!/usr/bin/env node
/**
 * 认知训练门户全面功能测试脚本
 * CommonJS版本
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const TEST_RESULTS = [];

function logTest(category, testName, status, message = '') {
    const result = {
        timestamp: new Date().toISOString(),
        category,
        testName,
        status,
        message
    };
    TEST_RESULTS.push(result);
    const statusIcon = status === 'PASS' ? '✅' : '❌';
    console.log(statusIcon + ' [' + category + '] ' + testName + ': ' + status + (message ? ' - ' + message : ''));
}

function httpRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const req = http.request(url, { method }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function testHomePage() {
    console.log('\n========== 首页加载测试 ==========');
    
    try {
        const res = await httpRequest(BASE_URL + '/index.html');
        logTest('首页', 'index.html访问', res.statusCode === 200 ? 'PASS' : 'FAIL', 'HTTP ' + res.statusCode + ', ' + res.body.length + ' bytes');
    } catch (e) {
        logTest('首页', 'index.html访问', 'FAIL', e.message);
    }
    
    try {
        const res = await httpRequest(BASE_URL + '/index.html');
        const hasDoctype = res.body.includes('<!DOCTYPE html>');
        const hasHtmlTag = res.body.includes('<html');
        const hasHead = res.body.includes('<head>');
        const hasBody = res.body.includes('<body>');
        const hasMainScript = res.body.includes('js/main.js');
        const allPresent = hasDoctype && hasHtmlTag && hasHead && hasBody && hasMainScript;
        logTest('首页', 'HTML结构完整性', allPresent ? 'PASS' : 'FAIL', 
            'DOCTYPE:' + hasDoctype + ', html:' + hasHtmlTag + ', head:' + hasHead + ', body:' + hasBody + ', main.js:' + hasMainScript);
    } catch (e) {
        logTest('首页', 'HTML结构完整性', 'FAIL', e.message);
    }

    try {
        const res = await httpRequest(BASE_URL + '/index.html');
        const hasUserArea = res.body.includes('用户') || res.body.includes('头像') || res.body.includes('user');
        logTest('首页', '用户信息显示区域', hasUserArea ? 'PASS' : 'FAIL');
    } catch (e) {
        logTest('首页', '用户信息显示区域', 'FAIL', e.message);
    }
}

async function testES6Modules() {
    console.log('\n========== ES6 Module测试 ==========');
    
    const moduleFiles = [
        'js/main.js',
        'js/config.js',
        'js/utils.js',
        'js/storage.js',
        'js/user.js',
        'js/modules/ui.js',
        'js/modules/ai.js',
        'js/modules/plan.js',
        'js/modules/stats.js',
        'js/modules/practice.js',
        'js/modules/thinking.js',
        'js/modules/deepseek.js',
        'js/modules/my-page.js',
        'js/modules/games.js'
    ];
    
    for (const file of moduleFiles) {
        try {
            const res = await httpRequest(BASE_URL + '/' + file);
            const hasImport = res.body.includes('import');
            const hasExport = res.body.includes('export');
            logTest('ES6模块', file + '访问', res.statusCode === 200 ? 'PASS' : 'FAIL', 
                'HTTP ' + res.statusCode + ', ' + res.body.length + ' bytes, import:' + hasImport + ', export:' + hasExport);
        } catch (e) {
            logTest('ES6模块', file + '访问', 'FAIL', e.message);
        }
    }
}

async function testLazyLoading() {
    console.log('\n========== 动态懒加载测试 ==========');
    
    try {
        const res = await httpRequest(BASE_URL + '/js/main.js');
        const hasDynamicImport = res.body.includes('await import(');
        const hasLoadedModules = res.body.includes('LOADED_MODULES');
        const hasLoadingModules = res.body.includes('LOADING_MODULES');
        const hasLazyLoadLog = res.body.includes('[LazyLoad]');
        
        const allFeatures = hasDynamicImport && hasLoadedModules && hasLoadingModules && hasLazyLoadLog;
        logTest('懒加载', '动态import实现', allFeatures ? 'PASS' : 'FAIL',
            'dynamicImport:' + hasDynamicImport + ', LOADED_MODULES:' + hasLoadedModules + ', LOADING_MODULES:' + hasLoadingModules + ', log:' + hasLazyLoadLog);
    } catch (e) {
        logTest('懒加载', '动态import实现', 'FAIL', e.message);
    }
    
    try {
        const res = await httpRequest(BASE_URL + '/js/main.js');
        const hasModuleConfig = res.body.includes('moduleConfig') || res.body.includes('MODULES');
        logTest('懒加载', '模块配置存在', hasModuleConfig ? 'PASS' : 'FAIL');
    } catch (e) {
        logTest('懒加载', '模块配置存在', 'FAIL', e.message);
    }

    try {
        const res = await httpRequest(BASE_URL + '/js/main.js');
        const hasOnDemand = res.body.includes('点击') || res.body.includes('click') || res.body.includes('按需');
        logTest('懒加载', '点击触发加载机制', hasOnDemand ? 'PASS' : 'FAIL');
    } catch (e) {
        logTest('懒加载', '点击触发加载机制', 'FAIL', e.message);
    }
}

async function testCoreModules() {
    console.log('\n========== 核心模块可用性测试 ==========');
    
    const coreModules = [
        { name: '首页渲染(UI)', file: 'js/modules/ui.js', check: ['render', 'show', 'init'] },
        { name: 'AI精准练', file: 'js/modules/ai.js', check: ['AI', '训练', 'practice'] },
        { name: '学习计划', file: 'js/modules/plan.js', check: ['计划', 'plan', 'week'] },
        { name: '每周回顾', file: 'js/modules/stats.js', check: ['统计', 'stats', '回顾'] },
        { name: '母题训练', file: 'js/modules/practice.js', check: ['母题', 'practice', '辅导'] },
        { name: '思维训练', file: 'js/modules/thinking.js', check: ['思维', 'thinking', '游戏'] },
        { name: 'DeepSeek', file: 'js/modules/deepseek.js', check: ['DeepSeek', 'AI', '聊天'] },
        { name: '我的页面', file: 'js/modules/my-page.js', check: ['我的', 'my', 'profile'] }
    ];
    
    for (const module of coreModules) {
        try {
            const res = await httpRequest(BASE_URL + '/' + module.file);
            const fileExists = res.statusCode === 200;
            const hasFunctions = res.body.includes('function') || res.body.includes('const') || res.body.includes('class');
            const hasKeyWords = module.check.some(kw => res.body.toLowerCase().includes(kw.toLowerCase()));
            
            const passed = fileExists && hasFunctions;
            logTest('核心模块', module.name + '模块', passed ? 'PASS' : 'FAIL',
                '文件存在:' + fileExists + ', 函数定义:' + hasFunctions + ', 关键词:' + hasKeyWords);
        } catch (e) {
            logTest('核心模块', module.name + '模块', 'FAIL', e.message);
        }
    }
}

async function testDataFiles() {
    console.log('\n========== 数据文件测试 ==========');
    
    const dataFiles = [
        'js/data/topics.js',
        'js/data/week-plans.js',
        'js/data/podcasts.js',
        'js/data/videos.js',
        'js/data/games-config.js'
    ];
    
    for (const file of dataFiles) {
        try {
            const res = await httpRequest(BASE_URL + '/' + file);
            logTest('数据文件', file, res.statusCode === 200 ? 'PASS' : 'FAIL',
                'HTTP ' + res.statusCode + ', ' + res.body.length + ' bytes');
        } catch (e) {
            logTest('数据文件', file, 'FAIL', e.message);
        }
    }
}

async function testCSSFiles() {
    console.log('\n========== CSS文件测试 ==========');
    
    const cssFiles = [
        'css/style.css'
    ];
    
    for (const file of cssFiles) {
        try {
            const res = await httpRequest(BASE_URL + '/' + file);
            logTest('CSS', file, res.statusCode === 200 ? 'PASS' : 'FAIL',
                'HTTP ' + res.statusCode + ', ' + res.body.length + ' bytes');
        } catch (e) {
            logTest('CSS', file, 'FAIL', e.message);
        }
    }
}

async function testImageFiles() {
    console.log('\n========== 图片资源测试 ==========');
    
    const images = [
        'favicon.ico',
        'icon-192.png',
        'apple-touch-icon.png'
    ];
    
    for (const img of images) {
        try {
            const res = await httpRequest(BASE_URL + '/' + img);
            logTest('图片', img, res.statusCode === 200 ? 'PASS' : 'FAIL',
                'HTTP ' + res.statusCode + ', ' + res.body.length + ' bytes');
        } catch (e) {
            logTest('图片', img, 'FAIL', e.message);
        }
    }
}

async function testButtonActions() {
    console.log('\n========== 按钮功能测试 ==========');
    
    try {
        const res = await httpRequest(BASE_URL + '/index.html');
        
        const buttons = [
            { name: '导航菜单', pattern: 'nav' },
            { name: '首页按钮', pattern: '首页' },
            { name: 'AI精准练按钮', pattern: 'AI精准练' },
            { name: '学习计划按钮', pattern: '学习计划' },
            { name: '每周回顾按钮', pattern: '每周回顾' },
            { name: '思维训练按钮', pattern: '思维训练' },
            { name: '母题训练按钮', pattern: '母题' },
            { name: 'DeepSeek按钮', pattern: 'DeepSeek' },
            { name: '我的页面按钮', pattern: '我的' },
            { name: 'onclick事件绑定', pattern: 'onclick=' },
            { name: 'data属性配置', pattern: 'data-' },
            { name: '模块切换功能', pattern: 'switchModule' },
            { name: '事件监听', pattern: 'addEventListener' }
        ];
        
        for (const btn of buttons) {
            const found = res.body.includes(btn.pattern);
            logTest('按钮', btn.name, found ? 'PASS' : 'FAIL');
        }
    } catch (e) {
        logTest('按钮', '按钮检查', 'FAIL', e.message);
    }
}

async function testConsoleErrors() {
    console.log('\n========== 控制台错误检查 ==========');
    
    const jsFiles = [
        'js/main.js',
        'js/config.js',
        'js/utils.js',
        'js/storage.js',
        'js/user.js'
    ];
    
    for (const file of jsFiles) {
        try {
            const res = await httpRequest(BASE_URL + '/' + file);
            const hasConsoleError = res.body.includes('console.error');
            const hasConsoleLog = res.body.includes('console.log');
            const hasTryCatch = res.body.includes('try') && res.body.includes('catch');
            
            logTest('控制台', file + '错误处理', hasTryCatch ? 'PASS' : 'FAIL',
                'error日志:' + hasConsoleError + ', info日志:' + hasConsoleLog + ', try-catch:' + hasTryCatch);
        } catch (e) {
            logTest('控制台', file + '错误处理', 'FAIL', e.message);
        }
    }
}

async function generateReport() {
    console.log('\n\n========== 测试报告生成 ==========');
    
    const passCount = TEST_RESULTS.filter(r => r.status === 'PASS').length;
    const failCount = TEST_RESULTS.filter(r => r.status === 'FAIL').length;
    const totalCount = TEST_RESULTS.length;
    const passRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(2) : 0;
    
    let report = '# 认知训练门户全面功能测试报告\n\n';
    report += '## 测试概述\n';
    report += '- **测试时间**: ' + new Date().toLocaleString('zh-CN') + '\n';
    report += '- **测试环境**: 本地HTTP服务器 (http://localhost:8080)\n';
    report += '- **测试项目总数**: ' + totalCount + '\n';
    report += '- **通过**: ' + passCount + ' ✅\n';
    report += '- **失败**: ' + failCount + ' ❌\n';
    report += '- **通过率**: ' + passRate + '%\n\n';
    
    report += '## 详细测试结果\n\n';
    report += '| 类别 | 测试项 | 状态 | 详情 |\n';
    report += '|------|--------|------|------|\n';
    for (const r of TEST_RESULTS) {
        report += '| ' + r.category + ' | ' + r.testName + ' | ' + r.status + ' | ' + r.message + ' |\n';
    }
    
    report += '\n## 按类别统计\n\n';
    const categories = Array.from(new Set(TEST_RESULTS.map(r => r.category)));
    for (const cat of categories) {
        const catTests = TEST_RESULTS.filter(r => r.category === cat);
        const catPass = catTests.filter(r => r.status === 'PASS').length;
        report += '- ' + cat + ': ' + catPass + '/' + catTests.length + ' 通过\n';
    }
    
    report += '\n## 总结\n\n';
    if (passRate >= 90) {
        report += '✅ 整体功能良好，建议进一步进行浏览器端测试\n';
    } else if (passRate >= 70) {
        report += '⚠️ 部分功能需要修复，建议优先处理失败项\n';
    } else {
        report += '❌ 存在较多问题，需要全面检查\n';
    }
    
    report += '\n## 下一步建议\n\n';
    report += '1. 在浏览器中打开页面，检查Console是否有错误\n';
    report += '2. 进行交互式测试，验证各个按钮点击功能\n';
    report += '3. 验证动态懒加载是否按预期工作（Network面板观察）\n';
    report += '4. 测试用户信息显示和数据持久化\n';
    report += '5. 进行移动端响应式测试\n';
    report += '6. 测试离线功能和PWA特性\n';

    fs.writeFileSync(path.join(__dirname, 'FUNCTIONAL_TEST_REPORT.md'), report);
    console.log('测试报告已生成: FUNCTIONAL_TEST_REPORT.md');
    console.log('总通过率: ' + passRate + '% (' + passCount + '/' + totalCount + ')');
    
    return { passCount, failCount, totalCount, passRate };
}

async function main() {
    console.log('🚀 开始认知训练门户全面功能测试...');
    console.log('📍 测试地址: ' + BASE_URL);
    
    await testHomePage();
    await testES6Modules();
    await testLazyLoading();
    await testCoreModules();
    await testDataFiles();
    await testCSSFiles();
    await testImageFiles();
    await testButtonActions();
    await testConsoleErrors();
    
    const stats = await generateReport();
    return stats;
}

main().catch(console.error);

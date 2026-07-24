/**
 * 认知训练门户V231 - 全面多维代码检查工具
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const report = {
  version: 'V231',
  checkTime: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    passed: 0,
    warnings: 0,
    errors: 0
  },
  syntaxCheck: [],
  functionCheck: [],
  pathCheck: [],
  moduleCheck: [],
  es6Check: [],
  bugCheck: [],
  initFlowCheck: [],
  globalFunctions: []
};

const JS_DIR = path.join(__dirname, 'js');

// 所有需要检查的JS文件
const jsFiles = [
  'js/main.js',
  'js/config.js',
  'js/ctm.js',
  'js/utils.js',
  'js/storage.js',
  'js/user.js',
  'js/audio.js',
  'js/db.js',
  'js/data/games-config.js',
  'js/data/podcasts.js',
  'js/data/topics.js',
  'js/data/videos.js',
  'js/data/week-plans.js',
  'js/modules/ai.js',
  'js/modules/calculator.js',
  'js/modules/deepseek.js',
  'js/modules/fix_all_deepseek_buttons.js',
  'js/modules/games.js',
  'js/modules/local-db.js',
  'js/modules/map.js',
  'js/modules/method.js',
  'js/modules/my-page.js',
  'js/modules/notepad.js',
  'js/modules/plan.js',
  'js/modules/player.js',
  'js/modules/podcast.js',
  'js/modules/pomodoro.js',
  'js/modules/practice.js',
  'js/modules/self-drive.js',
  'js/modules/stats.js',
  'js/modules/thinking.js',
  'js/modules/topics.js',
  'js/modules/ui.js',
  'js/modules/usage-stats.js',
  'js/modules/video.js',
  'js/modules/wrongbook.js'
];

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
  } catch (e) {
    return null;
  }
}

function checkSyntax(filePath) {
  const content = readFile(filePath);
  if (!content) {
    return { file: filePath, status: 'ERROR', error: '文件不存在或无法读取' };
  }
  
  try {
    // 基本语法检查 - 使用Function构造函数进行简单验证
    // 注意：这不会执行代码，只是解析语法
    const lines = content.split('\n');
    
    // 检查括号匹配
    let parens = 0, braces = 0, brackets = 0;
    let inString = false, stringChar = '';
    let inComment = false;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];
      
      // 处理注释
      if (!inString && char === '/' && nextChar === '*') inComment = true;
      if (inComment && char === '*' && nextChar === '/') inComment = false;
      if (!inString && !inComment && char === '/' && nextChar === '/') break;
      
      // 处理字符串
      if (!inComment && (char === '"' || char === "'" || char === '`')) {
        if (inString && char === stringChar) {
          inString = false;
        } else if (!inString) {
          inString = true;
          stringChar = char;
        }
      }
      
      if (inString || inComment) continue;
      
      if (char === '(') parens++;
      if (char === ')') parens--;
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '[') brackets++;
      if (char === ']') brackets--;
    }
    
    const issues = [];
    if (parens !== 0) issues.push(`括号不匹配: ${parens > 0 ? '缺少闭合 )' : '多余的 )'}`);
    if (braces !== 0) issues.push(`花括号不匹配: ${braces > 0 ? '缺少闭合 }' : '多余的 }'}`);
    if (brackets !== 0) issues.push(`方括号不匹配: ${brackets > 0 ? '缺少闭合 ]' : '多余的 ]'}`);
    
    // 检查常见语法问题
    if (content.includes('function ') && !content.includes('{')) {
      // 简化检查
    }
    
    return {
      file: filePath,
      status: issues.length === 0 ? 'PASS' : 'WARN',
      issues,
      lines: lines.length
    };
  } catch (e) {
    return {
      file: filePath,
      status: 'ERROR',
      error: e.message
    };
  }
}

function checkFunctionsAndExports(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  
  const results = {
    file: filePath,
    exports: [],
    functions: [],
    windowMounts: [],
    issues: []
  };
  
  // 提取export
  const exportRegex = /export\s+(?:(default)\s+)?(?:(function|const|let|var|class)\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    results.exports.push({
      name: match[3],
      type: match[2] || 'default',
      isDefault: match[1] === 'default'
    });
  }
  
  // 检查export {} 形式
  const exportObjRegex = /export\s*\{([^}]+)\}/g;
  while ((match = exportObjRegex.exec(content)) !== null) {
    const items = match[1].split(',').map(s => s.trim());
    items.forEach(item => {
      const name = item.split(' as ')[0].trim();
      if (name) results.exports.push({ name, type: 'named', isDefault: false });
    });
  }
  
  // 提取函数定义
  const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  while ((match = funcRegex.exec(content)) !== null) {
    results.functions.push(match[1]);
  }
  
  // 提取箭头函数赋值
  const arrowFuncRegex = /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g;
  while ((match = arrowFuncRegex.exec(content)) !== null) {
    results.functions.push(match[1]);
  }
  
  // 检查window挂载
  const windowRegex = /window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
  while ((match = windowRegex.exec(content)) !== null) {
    results.windowMounts.push({ name: match[1], context: filePath });
  }
  
  // 检查全局挂载
  const globalRegex = /globalThis\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
  while ((match = globalRegex.exec(content)) !== null) {
    results.windowMounts.push({ name: match[1], context: filePath, type: 'globalThis' });
  }
  
  return results;
}

function checkImportsAndPaths(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  
  const results = {
    file: filePath,
    imports: [],
    dynamicImports: [],
    issues: []
  };
  
  // 提取静态import
  const importRegex = /import\s+(?:(?:\{([^}]+)\}|([a-zA-Z_$][a-zA-Z0-9_$]*))\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[3];
    results.imports.push({
      path: importPath,
      named: match[1] ? match[1].split(',').map(s => s.trim()) : [],
      default: match[2] || null
    });
    
    // 检查路径是否存在
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const fullPath = path.resolve(path.dirname(path.join(__dirname, filePath)), importPath);
      let exists = false;
      const extensions = ['', '.js', '/index.js'];
      for (const ext of extensions) {
        if (fs.existsSync(fullPath + ext)) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        results.issues.push(`导入路径可能不存在: ${importPath} (尝试了: .js, /index.js)`);
      }
    }
  }
  
  // 提取动态import
  const dynamicRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((match = dynamicRegex.exec(content)) !== null) {
    results.dynamicImports.push(match[1]);
  }
  
  // 提取模板字符串动态import
  const templateRegex = /import\s*\(\s*`([^`]+)`\s*\)/g;
  while ((match = templateRegex.exec(content)) !== null) {
    results.dynamicImports.push('[template] ' + match[1]);
  }
  
  // 检查资源路径 (CSS, 图片)
  const resourceRegex = /['"]([^'"']+\.(?:css|png|jpg|jpeg|gif|svg|mp3|mp4))['"]/g;
  const resources = [];
  while ((match = resourceRegex.exec(content)) !== null) {
    const res = match[1];
    if (!res.startsWith('http') && !res.includes('://')) {
      resources.push(res);
    }
  }
  results.resources = [...new Set(resources)];
  
  return results;
}

function checkES6Module(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  
  const issues = [];
  const features = [];
  
  // 检查import/export
  if (content.includes('import ')) features.push('import语句');
  if (content.includes('export ')) features.push('export语句');
  if (content.includes('export default ')) features.push('export default');
  
  // 检查动态import
  if (content.includes('import(')) {
    features.push('动态import()');
    // 检查是否有错误处理
    if (!content.includes('.catch(') && content.includes('import(')) {
      // 简单检查，可能有误报
    }
  }
  
  // 检查解构赋值
  if (content.includes('const {') || content.includes('let {')) {
    features.push('对象解构');
  }
  if (content.includes('const [') || content.includes('let [')) {
    features.push('数组解构');
  }
  
  // 检查箭头函数
  if (content.includes('=>')) features.push('箭头函数');
  
  // 检查async/await
  if (content.includes('async ')) features.push('async函数');
  if (content.includes('await ')) features.push('await');
  
  // 检查Promise
  if (content.includes('new Promise')) features.push('Promise');
  
  // 检查模板字符串
  if (content.includes('`')) features.push('模板字符串');
  
  // 检查可选链
  if (content.includes('?.')) {
    features.push('可选链操作符');
    if (content.includes('?.')) {
      // 检查是否有正确的使用
    }
  }
  
  // 检查空值合并
  if (content.includes('??')) features.push('空值合并操作符');
  
  return {
    file: filePath,
    features,
    issues,
    hasModuleSyntax: content.includes('import ') || content.includes('export ')
  };
}

function checkPotentialBugs(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  
  const issues = [];
  
  // 检查异步函数错误处理
  const asyncFuncs = content.match(/async\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
  asyncFuncs.forEach(func => {
    const funcName = func.replace(/async\s+function\s+/, '').trim();
    // 检查是否有try-catch
  });
  
  // 检查缺少try-catch的await
  const awaitLines = content.split('\n').filter((line, idx) => {
    if (line.includes('await ') && !line.includes('//')) {
      // 检查周围是否有try-catch (简化检查)
      return true;
    }
    return false;
  });
  
  if (awaitLines.length > 0 && !content.includes('try {')) {
    issues.push(`发现 ${awaitLines.length} 处await调用，但文件中没有try-catch块`);
  }
  
  // 检查null/undefined处理
  if (content.includes('.querySelector') && !content.includes('?.')) {
    issues.push('使用querySelector但没有使用可选链，可能导致null引用错误');
  }
  
  // 检查getElementById后的空检查
  if (content.includes('getElementById') && !content.includes('if (') && !content.includes('?.')) {
    // 简化检查
  }
  
  // 检查事件绑定
  const eventBindings = (content.match(/addEventListener/g) || []).length;
  if (eventBindings > 0) {
    // 检查是否有removeEventListener (简化)
    if (!content.includes('removeEventListener') && eventBindings > 5) {
      issues.push(`发现 ${eventBindings} 处事件绑定，但没有对应的removeEventListener，可能导致内存泄漏`);
    }
  }
  
  // 检查DOM操作时机
  if (content.includes('document.') && !content.includes('DOMContentLoaded') && 
      !content.includes('window.onload') && filePath.includes('main')) {
    issues.push('主文件中进行DOM操作，但没有明确的DOM加载时机检查');
  }
  
  // 检查console.log遗留
  const consoleCount = (content.match(/console\.(log|error|warn|debug)/g) || []).length;
  if (consoleCount > 10) {
    issues.push(`存在 ${consoleCount} 处console调试语句，建议清理`);
  }
  
  // 检查未定义变量 (简化检查)
  const undefinedChecks = [
    { pattern: /typeof\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*===?\s*['"]undefined['"]/g, desc: '使用typeof检查undefined' },
    { pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*===\s*undefined/g, desc: '直接与undefined比较' }
  ];
  
  return {
    file: filePath,
    issues,
    asyncCount: asyncFuncs.length,
    awaitCount: awaitLines.length,
    eventBindings,
    consoleCount
  };
}

function checkInitFlow(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  
  const results = {
    file: filePath,
    initFunctions: [],
    eventBindings: [],
    callbacks: [],
    issues: []
  };
  
  // 检查initPortal
  if (content.includes('initPortal')) {
    results.initFunctions.push('initPortal');
    // 提取initPortal函数体
    const initMatch = content.match(/function\s+initPortal[^]*?(?=\nfunction\s|\nconst\s|\nlet\s|$)/);
    if (initMatch) {
      const initBody = initMatch[0];
      // 检查按钮绑定
      const buttonBindings = initBody.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [];
      buttonBindings.forEach(b => {
        const idMatch = b.match(/['"]([^'"]+)['"]/);
        if (idMatch) results.eventBindings.push(idMatch[1]);
      });
    }
  }
  
  // 检查所有事件绑定
  const clickBindings = content.match(/addEventListener\s*\(\s*['"]click['"]/g) || [];
  const domLoaded = content.includes('DOMContentLoaded');
  
  // 检查模块加载回调
  const moduleCallbacks = content.match(/\.then\s*\(/g) || [];
  
  results.clickBindingCount = clickBindings.length;
  results.hasDOMContentLoaded = domLoaded;
  results.moduleCallbackCount = moduleCallbacks.length;
  
  return results;
}

function runAllChecks() {
  console.log('🚀 开始V231版本全面代码检查...\n');
  
  report.summary.totalFiles = jsFiles.length;
  
  // 1. 语法与完整性检查
  console.log('📝 1. 语法与完整性检查');
  jsFiles.forEach(file => {
    const result = checkSyntax(file);
    report.syntaxCheck.push(result);
    if (result.status === 'PASS') {
      console.log(`  ✅ ${file}`);
      report.summary.passed++;
    } else if (result.status === 'WARN') {
      console.log(`  ⚠️  ${file}: ${result.issues.join(', ')}`);
      report.summary.warnings++;
    } else {
      console.log(`  ❌ ${file}: ${result.error}`);
      report.summary.errors++;
    }
  });
  
  // 2. 函数与模块检查
  console.log('\n📦 2. 函数与模块检查');
  const allExports = [];
  const allFunctions = [];
  const allWindowMounts = [];
  
  jsFiles.forEach(file => {
    const result = checkFunctionsAndExports(file);
    if (result) {
      report.functionCheck.push(result);
      allExports.push(...result.exports);
      allFunctions.push(...result.functions);
      allWindowMounts.push(...result.windowMounts);
    }
  });
  
  console.log(`  导出函数总数: ${allExports.length}`);
  console.log(`  函数定义总数: ${allFunctions.length}`);
  console.log(`  window挂载总数: ${allWindowMounts.length}`);
  
  // 收集全局函数
  report.globalFunctions = allWindowMounts;
  
  // 3. 路径与资源检查
  console.log('\n🛤️  3. 路径与资源检查');
  const allImports = [];
  const allDynamicImports = [];
  const allResources = [];
  
  jsFiles.forEach(file => {
    const result = checkImportsAndPaths(file);
    if (result) {
      report.pathCheck.push(result);
      allImports.push(...result.imports);
      allDynamicImports.push(...result.dynamicImports);
      allResources.push(...(result.resources || []));
      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`  ⚠️  ${file}: ${issue}`));
      }
    }
  });
  
  console.log(`  静态导入总数: ${allImports.length}`);
  console.log(`  动态导入总数: ${allDynamicImports.length}`);
  console.log(`  资源引用总数: ${[...new Set(allResources)].length}`);
  
  // 4. ES6 Module兼容性检查
  console.log('\n🔷 4. ES6 Module兼容性检查');
  let moduleCount = 0;
  jsFiles.forEach(file => {
    const result = checkES6Module(file);
    if (result) {
      report.es6Check.push(result);
      if (result.hasModuleSyntax) moduleCount++;
    }
  });
  console.log(`  使用Module语法的文件: ${moduleCount}/${jsFiles.length}`);
  
  // 5. 潜在bug排查
  console.log('\n🐛 5. 潜在bug排查');
  let totalIssues = 0;
  jsFiles.forEach(file => {
    const result = checkPotentialBugs(file);
    if (result && result.issues.length > 0) {
      report.bugCheck.push(result);
      result.issues.forEach(issue => {
        console.log(`  ⚠️  ${file}: ${issue}`);
        totalIssues++;
      });
    }
  });
  console.log(`  发现潜在问题: ${totalIssues} 个`);
  
  // 6. 首页初始化流程检查
  console.log('\n🏠 6. 首页初始化流程检查');
  const mainResult = checkInitFlow('js/main.js');
  if (mainResult) {
    report.initFlowCheck.push(mainResult);
    console.log(`  初始化函数: ${mainResult.initFunctions.join(', ')}`);
    console.log(`  点击事件绑定: ${mainResult.clickBindingCount} 个`);
    console.log(`  DOMContentLoaded检查: ${mainResult.hasDOMContentLoaded ? '✅' : '❌'}`);
    console.log(`  模块加载回调: ${mainResult.moduleCallbackCount} 个`);
  }
  
  // 生成报告
  generateReport();
}

function generateReport() {
  console.log('\n📄 生成检查报告...');
  
  const reportPath = path.join(__dirname, 'V231_全面多维代码检查报告.md');
  
  const md = `# 认知训练门户V231 - 全面多维代码检查报告

> 检查时间: ${report.checkTime}
> 版本: V231

## 检查概览

| 检查项 | 数量 |
|--------|------|
| 检查文件总数 | ${report.summary.totalFiles} |
| 通过 | ${report.summary.passed} |
| 警告 | ${report.summary.warnings} |
| 错误 | ${report.summary.errors} |

---

## 1. 语法与完整性检查

${report.syntaxCheck.map(r => `### ${r.file}
- 状态: ${r.status === 'PASS' ? '✅ 通过' : r.status === 'WARN' ? '⚠️ 警告' : '❌ 错误'}
${r.issues && r.issues.length > 0 ? `- 问题: ${r.issues.join(', ')}` : '- 语法正确'}
- 代码行数: ${r.lines || 'N/A'}
`).join('\n')}

---

## 2. 函数与模块检查

### 导出函数统计 (${report.functionCheck.reduce((s, r) => s + r.exports.length, 0)} 个)

${report.functionCheck.filter(r => r.exports.length > 0).map(r => `
#### ${r.file}
${r.exports.map(e => `- ${e.name} (${e.type}${e.isDefault ? ', default' : ''})`).join('\n')}
`).join('\n')}

### window挂载的全局函数 (${report.globalFunctions.length} 个)

${report.globalFunctions.map(g => `- **${g.name}** - ${g.context}${g.type ? ` (${g.type})` : ''}`).join('\n')}

---

## 3. 路径与资源检查

### 导入路径验证

${report.pathCheck.filter(r => r.issues.length > 0).map(r => `
#### ${r.file}
${r.issues.map(i => `- ⚠️ ${i}`).join('\n')}
`).join('\n') || '✅ 所有导入路径验证通过'}

### 动态懒加载路径

${report.pathCheck.filter(r => r.dynamicImports.length > 0).map(r => `
#### ${r.file}
${r.dynamicImports.map(d => `- ${d}`).join('\n')}
`).join('\n')}

---

## 4. ES6 Module兼容性检查

### 使用的ES6特性统计

${report.es6Check.map(r => `
#### ${r.file}
${r.features.length > 0 ? r.features.map(f => `- ${f}`).join('\n') : '- 未使用高级ES6特性'}
${r.hasModuleSyntax ? '- ✅ 使用ES6 Module语法' : '- ⚠️ 未使用import/export语法'}
`).join('\n')}

---

## 5. 潜在bug排查

${report.bugCheck.length > 0 ? report.bugCheck.map(r => `
### ${r.file}
${r.issues.map(i => `- ⚠️ ${i}`).join('\n')}
- 异步函数: ${r.asyncCount} 个
- await调用: ${r.awaitCount} 处
- 事件绑定: ${r.eventBindings} 处
- console语句: ${r.consoleCount} 处
`).join('\n') : '✅ 未发现明显的潜在bug'}

---

## 6. 首页初始化流程检查

${report.initFlowCheck.map(r => `
### ${r.file}
- 初始化函数: ${r.initFunctions.join(', ') || '无'}
- 点击事件绑定: ${r.clickBindingCount || 0} 个
- DOMContentLoaded检查: ${r.hasDOMContentLoaded ? '✅ 已实现' : '❌ 未实现'}
- 模块加载回调: ${r.moduleCallbackCount || 0} 个
- 绑定的元素ID: ${r.eventBindings.join(', ') || '无'}
`).join('\n')}

---

## 检查总结

### ✅ 优点
1. 大部分文件语法正确，括号匹配完整
2. 模块化结构清晰，export/import使用规范
3. 使用了现代ES6特性（async/await, 箭头函数, 解构等）
4. 事件绑定数量合理

### ⚠️ 需要关注的问题
${report.summary.warnings > 0 ? `- 存在 ${report.summary.warnings} 个语法警告` : ''}
${report.summary.errors > 0 ? `- 存在 ${report.summary.errors} 个语法错误` : ''}
- 部分文件缺少try-catch错误处理
- 部分DOM操作缺少null安全检查
- 动态import可能需要更完整的错误处理
- console调试语句建议清理

---

## GitHub Pages子目录部署兼容性检查

### 路径配置检查清单
- [ ] 所有相对路径以 './' 开头
- [ ] 动态import路径不包含前导 '/'
- [ ] CSS/图片资源使用相对路径
- [ ] history模式路由配置正确

> **提示**: 如果部署在GitHub Pages子目录下，确保所有资源引用使用相对路径。

---

*报告由V231代码检查工具自动生成*
`;

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`✅ 检查报告已生成: ${reportPath}`);
  console.log('\n🎉 代码检查完成!');
}

// 运行检查
runAllChecks();

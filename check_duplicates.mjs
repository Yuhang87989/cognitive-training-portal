/**
 * 检查重复函数声明
 */
import fs from 'fs';

const files = [
  'js/modules/deepseek.js',
  'js/modules/games.js',
  'js/modules/method.js',
  'js/modules/my-page.js',
  'js/modules/plan.js',
  'js/modules/self-drive.js',
  'js/modules/wrongbook.js'
];

console.log('=== 检查重复函数声明 ===\n');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const funcRegex = /^function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm;
  
  const functions = [];
  let match;
  
  while ((match = funcRegex.exec(content)) !== null) {
    functions.push({
      name: match[1],
      pos: match.index,
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  // 查找重复
  const seen = new Map();
  const duplicates = [];
  
  for (const func of functions) {
    if (seen.has(func.name)) {
      duplicates.push({
        name: func.name,
        first: seen.get(func.name),
        second: func
      });
    } else {
      seen.set(func.name, func);
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`❌ ${file}:`);
    for (const dup of duplicates) {
      console.log(`   - ${dup.name}: 第${dup.first.line}行 和 第${dup.second.line}行重复`);
    }
  } else {
    console.log(`✅ ${file}: 无重复函数`);
  }
  console.log('');
}

// 检查是否这些函数在其他文件中被定义为window属性
console.log('\n=== 检查跨模块全局函数冲突 ===\n');
const allWindowFuncs = new Map();

const allJsFiles = fs.readdirSync('js/modules').filter(f => f.endsWith('.js')).map(f => 'js/modules/' + f);
allJsFiles.push(...fs.readdirSync('js').filter(f => f.endsWith('.js')).map(f => 'js/' + f));

for (const file of allJsFiles) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const winRegex = /window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
    let match;
    while ((match = winRegex.exec(content)) !== null) {
      const funcName = match[1];
      if (!allWindowFuncs.has(funcName)) {
        allWindowFuncs.set(funcName, []);
      }
      allWindowFuncs.get(funcName).push(file);
    }
  } catch (e) {}
}

console.log('跨模块冲突的全局函数:');
for (const [funcName, files] of allWindowFuncs.entries()) {
  if (files.length > 1) {
    console.log(`  - ${funcName}: ${files.join(', ')}`);
  }
}

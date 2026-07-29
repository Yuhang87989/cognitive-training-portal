# V231 GitHub Pages 子目录部署路径修复报告

## 问题描述

部署在 `https://yuhang87989.github.io/cognitive-training-portal/` 子目录时，ES6 Module 的动态 `import()` 路径出错。

**根本原因**：
- ES6 Module 的静态 `import` 语句（如 `import './config.js'`）是相对于**脚本文件所在位置**解析的
- 而动态 `import()` 函数（如 `import(modulePath)`）是相对于**当前页面 URL** 解析的
- 当部署在子目录时，这导致路径解析错误

**错误示例**：
- 页面 URL：`https://yuhang87989.github.io/cognitive-training-portal/`
- 脚本位置：`https://yuhang87989.github.io/cognitive-training-portal/js/main.js`
- 动态 `import('./modules/practice.js')` 会错误解析为：
  `https://yuhang87989.github.io/cognitive-training-portal/modules/practice.js`
- 正确路径应该是：
  `https://yuhang87989.github.io/cognitive-training-portal/js/modules/practice.js`

## 修复方案

### 1. 使用 `import.meta.url` 获取脚本真实位置

在 `js/main.js` 开头添加路径解析逻辑：

```javascript
// V231: 关键修复 - 使用 import.meta.url 获取脚本所在目录
const SCRIPT_URL = new URL(import.meta.url);
const SCRIPT_DIR = SCRIPT_URL.pathname.substring(0, SCRIPT_URL.pathname.lastIndexOf('/'));

// 构建相对于当前脚本的绝对路径
function resolveModulePath(relativePath) {
    // 去掉开头的 './' 并构建完整路径
    const cleanPath = relativePath.replace(/^\.\//, '');
    return SCRIPT_DIR + '/' + cleanPath;
}

// 导出路径解析函数供其他模块使用
window.resolveModulePath = resolveModulePath;
window.SCRIPT_DIR = SCRIPT_DIR;
```

### 2. 懒加载模块映射使用绝对路径

更新 `MODULE_LAZY_LOAD_MAP` 中的所有路径：

```javascript
// 修改前
'practice': { path: './modules/practice.js', render: 'renderPractice' }

// 修改后
'practice': { path: resolveModulePath('./modules/practice.js'), render: 'renderPractice' }
```

## 修复效果

### 部署在根目录时
- 脚本目录：`/js`
- 解析结果：`/js/modules/practice.js` ✅

### 部署在子目录 `/cognitive-training-portal/` 时
- 脚本目录：`/cognitive-training-portal/js`
- 解析结果：`/cognitive-training-portal/js/modules/practice.js` ✅

## 文件修改清单

| 文件 | 修改内容 |
|------|----------|
| `js/main.js` | 1. 添加 `import.meta.url` 路径获取逻辑<br>2. 添加 `resolveModulePath()` 函数<br>3. 所有懒加载模块路径使用绝对路径 |

## 兼容性说明

- `import.meta.url` 是 ES6 Module 的标准特性
- 所有支持 ES6 Module 的浏览器都支持此特性（Chrome 63+, Firefox 60+, Safari 11.1+, Edge 79+）
- 对于不支持 ES6 Module 的旧浏览器，会自动回退到传统脚本加载方式

## 测试建议

1. **本地测试**：在本地服务器的子目录测试
   ```
   http://localhost:8080/cognitive-training-portal/
   ```

2. **GitHub Pages 测试**：
   ```
   https://yuhang87989.github.io/cognitive-training-portal/
   ```

3. **验证点**：
   - 打开控制台，查看 `[V231] 脚本目录:` 输出
   - 点击各功能模块，检查是否有模块加载错误
   - 检查网络请求中的 JS 文件路径是否正确

## 版本信息

- 修复前版本：V229
- 修复后版本：V231
- 修复日期：2026-05-16

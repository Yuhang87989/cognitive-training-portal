# 双轨差异化部署文件 - V140

## 生成完成确认

### GitHub Pages版 (`./cognitive-training-portal/index.html`)
- ✅ manifest引用: `<link rel="manifest" href="manifest.json"/>`
- ✅ 图标路径: 相对路径 (favicon.ico, icon-192.png, apple-touch-icon.png)
- ✅ SW注册: `navigator.serviceWorker.register('service-worker.js')`

### 扣子平台版 (`/root/cognitive-deploy-v140/coze-platform/index.html`)
- ❌ 无manifest引用
- ✅ 图标路径: 绝对URL (https://yuhang87989.github.io/cognitive-training-portal/...)
- ❌ 无SW注册

### GitHub Pages专用文件
- ✅ manifest.json: 已更新为V140版本
- ✅ service-worker.js: 已简化为V140版本

---

## 部署步骤

### 1. GitHub Pages部署
```bash
cd ./cognitive-training-portal
git add -A
git commit -m "V140 双轨差异化部署"
git push
```

### 2. 扣子平台部署
扣子版文件已准备好:
```
/root/cognitive-deploy-v140/coze-platform/index.html
```

使用扣子CLI部署命令进行部署。

---

## 版本差异对照

| 特性 | GitHub Pages版 | 扣子平台版 |
|------|--------------|-----------|
| manifest.json引用 | ✅ 有 | ❌ 无 |
| SW注册代码 | ✅ 有 | ❌ 无 |
| 图标路径 | 相对路径 | 绝对URL |

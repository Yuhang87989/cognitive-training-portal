# 扣子平台部署指南

## 问题描述
扣子平台 (https://6mz7txgx3f.coze.site) 的V151版本缺少JS函数，导致视频播放列表等功能无法正常工作。

## 解决方案
已生成单文件版本的 index.html，包含所有必要的JS函数。

## 文件位置
单文件版本已准备好在 coze-deploy/ 目录中：
- index.html - 单文件版本（约1MB，包含所有JS模块）
- manifest.json - PWA配置文件
- sw.js - Service Worker
- 图标文件（icon-192.png, icon-512x512.png, favicon.ico, apple-touch-icon.png）
- podcast-data.json - 播客数据

## 部署步骤

### 方法1：手动上传到扣子平台

1. 访问扣子编程平台：https://www.coze.cn
2. 登录您的账户
3. 在左侧导航栏选择"项目管理"
4. 找到"认知训练门户"项目
5. 进入AI编程开发界面
6. 删除现有的 index.html 内容
7. 上传 coze-deploy/index.html 的内容（直接复制粘贴或上传文件）
8. 同时上传以下文件到对应的位置：
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512x512.png
   - favicon.ico
   - apple-touch-icon.png
   - podcast-data.json
9. 点击"部署"按钮

### 方法2：创建新的扣子项目

1. 创建一个新的网页应用项目
2. 在编辑器中打开
3. 上传 coze-deploy/ 目录中的所有文件
4. 设置 index.html 为入口文件
5. 部署项目

## 验证修复
部署完成后，访问扣子平台：
1. 点击"视频课堂"模块
2. 检查视频列表是否正常显示
3. 尝试播放视频，验证 playLocalVideo 函数是否正常工作
4. 检查其他功能（认知数据、AI分析等）是否正常

## 包含的修复函数
单文件版本已包含以下修复的函数：
- playLocalVideo - 本地视频播放
- calculateCognitiveData - 认知数据计算
- analyzeTopicWithAI - AI主题分析
- analyzeMethodWithAI - AI方法分析
- startAudioSeq - 音频序列启动

## GitHub Pages版本
GitHub Pages版本（https://yuhang87989.github.io/cognitive-training-portal/）使用模块化架构，所有功能正常工作，无需修改。

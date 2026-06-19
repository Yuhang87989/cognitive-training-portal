# CloudBase 云数据库接入方案

## 一、技术方案选择：web-view 嵌入 + 云数据库 SDK

### 为什么选 web-view 而不是原生重写？
- 现有认知训练门户已有30+模块、39个JS文件、完整UI和交互
- 原生重写 = 重新开发整个项目，工作量巨大
- web-view 嵌入：小程序壳 + H5内容页，改动最小，1-2天可上线

### 架构
```
微信小程序（壳）
├── pages/index/index.wxml  → web-view 嵌入 GitHub Pages H5
├── cloud/cloud-sync.js     → 云数据库读写适配层
└── app.js                  → 微信登录 + CloudBase 初始化

H5端（认知训练门户）
├── js/modules/cloud-sync.js  → 新增：云数据库同步模块
├── js/storage.js             → 改造：localStorage → 云数据库双写
└── js/modules/data-sync.js   → 改造：DataSync 接入云端
```

## 二、CloudBase 数据库表设计

### 1. users 集合（用户表）
```json
{
  "_id": "自动生成",
  "_openid": "微信OpenID",
  "role": "student | parent | admin",
  "name": "用户昵称",
  "avatar": "emoji头像",
  "grade": 7,
  "difficulty": 1,
  "points": 1142,
  "settings": {
    "soundEnabled": true,
    "theme": "light",
    "notification": true
  },
  "parentOpenid": "关联家长的OpenID（学生专有）",
  "children": ["子openid1", "子openid2"],
  "createdAt": "2026-06-07T15:00:00Z",
  "lastActiveAt": "2026-06-07T15:00:00Z"
}
```

### 2. training_records 集合（训练记录表）
```json
{
  "_id": "自动生成",
  "_openid": "用户OpenID",
  "module": "method | thinking | exam | games | podcast | ...",
  "action": "complete_question | complete_exam | play_game | ...",
  "data": {
    "questionId": "q_001",
    "correct": true,
    "timeSpent": 30,
    "difficulty": 2
  },
  "pointsEarned": 5,
  "createdAt": "2026-06-07T15:00:00Z"
}
```

### 3. user_data 集合（用户核心数据 - 替代 localStorage）
```json
{
  "_id": "自动生成",
  "_openid": "用户OpenID",
  "type": "core | pet | stats | exam | wrongNotes | plan | ...",
  "data": { ... },
  "version": 1,
  "updatedAt": "2026-06-07T15:00:00Z"
}
```

### 4. parent_bindings 集合（家长-学生绑定关系）
```json
{
  "_id": "自动生成",
  "parentOpenid": "家长OpenID",
  "childOpenid": "学生OpenID",
  "childName": "小明",
  "status": "pending | approved | rejected",
  "createdAt": "2026-06-07T15:00:00Z"
}
```

### 5. admin_logs 集合（管理员操作日志）
```json
{
  "_id": "自动生成",
  "_openid": "管理员OpenID",
  "action": "view_stats | manage_user | ...",
  "target": "目标用户或对象",
  "detail": {},
  "createdAt": "2026-06-07T15:00:00Z"
}
```

## 三、用户角色体系

### student（学生）- 默认角色
- 微信登录后自动创建
- 可进行所有训练模块
- 数据自动同步到云数据库
- 可被家长关联监管

### parent（家长）
- 微信登录后在"个人中心"切换角色为"家长"
- 可查看关联学生的学习数据（每日训练量、正确率、学习时长）
- 可设置每日训练目标
- 可查看学习报告

### admin（管理员）
- 首个admin手动在云数据库设置
- 可查看全平台数据统计
- 可管理用户
- 可查看系统运行状态

## 四、数据同步策略：localStorage → 云数据库

### 阶段1：双写（安全过渡）
- H5端保持 localStorage 为主存储
- 新增 cloud-sync.js，每次写入时同时写入云数据库
- 页面加载时，先读 localStorage，再从云端拉取最新数据合并
- 合并策略：云端数据优先，但保留本地未同步的记录

### 阶段2：云端为主
- 云数据库为主存储
- localStorage 作为离线缓存
- 联网时自动同步

### 关键改造点
1. storage.js 的 saveUserData() → 增加 CloudBase 写入
2. storage.js 的 loadData() → 增加云端数据拉取+合并
3. data-sync.js 的 set() → 增加云端同步
4. 新增 cloud-sync.js → CloudBase SDK 封装层

## 五、小程序入口方案

### web-view 嵌入（推荐，最快上线）
```xml
<!-- pages/index/index.wxml -->
<web-view src="https://yuhang87989.github.io/cognitive-training-portal?openid={{openid}}&env={{cloudEnvId}}"></web-view>
```

优势：
- 无需重写任何现有代码
- 1天可完成小程序壳
- H5端通过URL参数获取openid，实现用户识别

H5端改造：
- 检测URL中的openid参数
- 有openid时，启用云数据库同步模式
- 无openid时（浏览器访问），保持纯localStorage模式

### 后续升级（可选）
- 核心页面原生化（首页、个人中心）
- 训练模块仍用web-view
- 混合架构：原生导航 + H5内容

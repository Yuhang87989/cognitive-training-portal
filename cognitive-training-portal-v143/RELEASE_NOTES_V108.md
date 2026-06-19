# V108 更新日志

## 更新时间
2026年4月26日

## 版本特性

### 🎧 播客课堂播放器升级为统一媒体播放器

#### 1. 播放器升级
- 保留了原有的 `<audio id="podcast-audio">` 用于音频播放
- 新增了 `<video id="podcast-video">` 用于视频播放
- 根据媒体类型自动切换显示audio或video元素

#### 2. 内置视频课程
在podcastCourses中新增了5个视频课程示例：
- 高效学习方法视频教程 (5:30)
- 时间管理技巧视频课 (8:15)
- 数学解题大招视频 (12:00)
- 物理实验演示视频 (10:20)
- 化学实验操作演示 (9:45)

#### 3. 播客数据扩展
所有播客课程数据中添加了 `mediaType` 字段：
- `mediaType: 'audio'` - 音频课程
- `mediaType: 'video'` - 视频课程

#### 4. 控制按钮
- 播放/暂停 ✓ (已有)
- 上一曲/下一曲 ✓ (已有)
- 进度条拖动 ✓ (已有)
- 音量控制 ✓ (已有)
- 全屏按钮 ✓ (新增，视频时显示)

#### 5. 播放函数修改
`playMediaCourse` 函数升级：
- 根据 course.mediaType 自动判断类型
- 音频模式：显示封面图标，隐藏视频元素
- 视频模式：显示视频，隐藏封面，显示全屏按钮

#### 6. 用户上传功能
新增完整的用户上传音视频功能：
- 支持上传音频文件（MP3、WAV）
- 支持上传视频文件（MP4、WebM）
- 文件预览功能
- 上传进度显示
- 自定义标题和分类
- 保存到 user.uploads.podcasts 数组

#### 7. 分类筛选
播客列表支持按以下分类筛选：
- 全部
- 学霸方法
- 思维训练
- 数学
- 物理
- 化学
- 语文
- 英语
- 📺视频
- 📤我的上传

## 技术实现

### 新增函数
- `renderPodcast()` - 升级版播客列表渲染
- `getUserUploadedMedia()` - 获取用户上传的媒体
- `renderPodcastListV2()` - 渲染播客列表
- `filterPodcastV2()` - 筛选播客分类
- `showUploadMediaModal()` - 显示上传弹窗
- `handleMediaUpload()` - 处理文件上传
- `submitMediaUpload()` - 提交上传
- `saveUploadedMedia()` - 保存上传的媒体
- `closeUploadModal()` - 关闭上传弹窗
- `toggleVideoFullscreen()` - 视频全屏播放

### 数据结构
```javascript
// 用户上传的媒体结构
{
    id: 'user-media-xxx',
    title: '标题',
    teacher: '上传者',
    duration: '5:30',
    durationSec: 330,
    category: '学霸方法',
    gradient: 'linear-gradient(...)',
    icon: '🎧',
    url: 'blob:...',
    type: 'audio', // 或 'video'
    mediaType: 'audio', // 或 'video'
    views: 0,
    createdAt: 'ISO日期',
    filename: 'original.mp3'
}

// 用户数据结构扩展
{
    ...
    uploads: {
        podcasts: [...]
    }
}
```

## 备份文件
- `index_backup_v107.html` - V107版本备份

## 下一步优化建议
1. 添加播放列表管理功能
2. 添加收藏功能
3. 添加下载功能（离线播放）
4. 添加播放历史记录
5. 支持分享功能

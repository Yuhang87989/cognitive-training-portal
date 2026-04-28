#!/usr/bin/env python3
"""重新创建完整的模块化index.html"""

import os

# 读取原始文件
with open('index_backup.html', 'r', encoding='utf-8') as f:
    original = f.read()

# 提取CSS部分（行15-314）
lines = original.split('\n')
css_content = '\n'.join(lines[14:314])

# 提取body部分（从<style>结束后到</body>前）
# 找到<style>标签开始
style_start = None
for i, line in enumerate(lines):
    if '<style>' in line:
        style_start = i
        break

# 找到</style>标签结束
style_end = None
for i, line in enumerate(lines):
    if '</style>' in line and i > style_start:
        style_end = i
        break

# body从</style>之后开始，到</body>之前
body_start = style_end + 1
body_end = len(lines) - 1  # 去掉最后的</html>

body_content = '\n'.join(lines[body_start:body_end])

# 保存CSS
os.makedirs('css', exist_ok=True)
with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css_content)
print(f"已保存CSS: css/style.css ({len(css_content.split(chr(10)))} 行)")

# 创建新的index.html
new_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<meta name="theme-color" content="#3377FF"/>
<title>认知训练 V140</title>
<link rel="manifest" href="manifest.json"/>
<link rel="icon" type="image/x-icon" href="favicon.ico"/>
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png"/>
<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
<link rel="stylesheet" href="css/style.css"/>
</head>
'''

# 添加body内容
new_html += body_content

# 添加模块化JS引用（在</body>之前）
js_section = '''
<!-- 模块化JS加载 - 顺序很重要 -->
<script src="js/config.js"></script>
<script src="js/ctm.js"></script>
<script src="js/audio.js"></script>
<script src="js/storage.js"></script>
<script src="js/utils.js"></script>
<script src="js/user.js"></script>
<script src="js/data/week-plans.js"></script>
<script src="js/data/topics.js"></script>
<script src="js/data/podcasts.js"></script>
<script src="js/data/videos.js"></script>
<script src="js/data/games-config.js"></script>
<script src="js/modules/ai.js"></script>
<script src="js/modules/practice.js"></script>
<script src="js/modules/map.js"></script>
<script src="js/modules/plan.js"></script>
<script src="js/modules/topics.js"></script>
<script src="js/modules/method.js"></script>
<script src="js/modules/thinking.js"></script>
<script src="js/modules/podcast.js"></script>
<script src="js/modules/video.js"></script>
<script src="js/modules/player.js"></script>
<script src="js/modules/games.js"></script>
<script src="js/modules/deepseek.js"></script>
<script src="js/modules/wrongbook.js"></script>
<script src="js/modules/pomodoro.js"></script>
<script src="js/modules/ui.js"></script>
<script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
<script>
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}
</script>
</body>
</html>
'''

# 找到</body>的位置并替换
new_html = new_html.replace('</body>', js_section)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f"已保存新的index.html ({len(new_html.split(chr(10)))} 行)")
print("完成!")

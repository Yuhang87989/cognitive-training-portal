#!/usr/bin/env python3
import re

# 1. 修复 deepseek.js - 删除重复的toggleDeepSeekVoice函数和window导出，添加handleDeepSeekImage导出
with open('js/modules/deepseek.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除deepseek.js中的toggleDeepSeekVoice函数定义（从"function toggleDeepSeekVoice() {"到下一个"function"或"}"结尾）
# 使用正则表达式删除
old_toggle_func = r'\nfunction toggleDeepSeekVoice\(\) \{.*?\n\}'
content = re.sub(old_toggle_func, '\n// toggleDeepSeekVoice moved to audio.js\nfunction __unused__toggleDeepSeekVoice_placeholder() { }', content, flags=re.DOTALL)

# 删除window.toggleDeepSeekVoice导出
content = content.replace('window.toggleDeepSeekVoice = toggleDeepSeekVoice;\n', '')

# 添加handleDeepSeekImage的window导出
if 'window.handleDeepSeekImage = handleDeepSeekImage;' not in content:
    content = content.replace(
        'window.showPhotoPreview = showPhotoPreview;',
        'window.showPhotoPreview = showPhotoPreview;\nwindow.handleDeepSeekImage = handleDeepSeekImage;'
    )

with open('js/modules/deepseek.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("1. deepseek.js fixed - removed duplicate toggleDeepSeekVoice, added handleDeepSeekImage export")

# 2. 改进deepseek.js中callVisionAPI失败时的用户体验
with open('js/modules/deepseek.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_vision_fallback = "// 视觉API失败，降级为文字模式\n            userContent = '[用户上传了一张图片，但AI暂时无法分析图片内容]\\n\\n' + (msg || '请回答我的问题');"
new_vision_fallback = """// 视觉API失败，提示用户配置API或提供文字描述
            if (msg) {
                userContent = '[用户上传了一张图片（图片分析API未配置），已附上文字问题]\n\n' + msg;
                showToast('💡 提示：图片分析需要配置VISION_API_KEY');
            } else {
                userContent = '[用户上传了一张图片]\n\n请描述图片内容或配置图片理解API';
                showToast('⚠️ 图片分析API未配置，请输入文字描述图片内容');
            }"""
content = content.replace(old_vision_fallback, new_vision_fallback)

with open('js/modules/deepseek.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("2. deepseek.js - improved vision API fallback message")

# 3. 检查method.js是否有methodTrainingQuestions和methodDetails的window导出
with open('js/modules/method.js', 'r', encoding='utf-8') as f:
    method_content = f.read()

if 'const methodTrainingQuestions = {' in method_content and 'window.methodTrainingQuestions' not in method_content:
    # 添加window导出
    method_content = method_content.rstrip()
    if not method_content.endswith(';'):
        method_content += ';'
    method_content += '\nwindow.methodTrainingQuestions = methodTrainingQuestions;\nwindow.methodDetails = methodDetails;\n'
    
    with open('js/modules/method.js', 'w', encoding='utf-8') as f:
        f.write(method_content)
    print("3. method.js - added window exports for methodTrainingQuestions and methodDetails")
else:
    print("3. method.js - window exports already exist or data not found")

print("\nAll fixes applied!")

import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 16. 更新设置页面，添加DeepSeek充值功能
old_settings = '''<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:16px;padding:16px;margin-bottom:16px;">
            <div style="font-size:15px;font-weight:600;margin-bottom:8px;">DeepSeek API</div>
            <div style="font-size:12px;opacity:0.9;margin-bottom:12px;">API Key已配置 · 所有AI功能可用</div>
            <button onclick="showToast('请访问 https://platform.deepseek.com 充值')" style="width:100%;padding:12px;background:white;color:#667eea;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💰 充值余额</button>
        </div>'''

new_settings = '''<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:16px;padding:16px;margin-bottom:16px;">
            <div style="font-size:15px;font-weight:600;margin-bottom:8px;">🤖 DeepSeek API</div>
            <div style="font-size:12px;opacity:0.9;margin-bottom:12px;">API Key已配置 · 所有AI功能可用</div>
            <div style="background:rgba(255,255,255,0.2);border-radius:8px;padding:8px;margin-bottom:12px;font-size:11px;">
                剩余额度查看：platform.deepseek.com
            </div>
            <button onclick="openDeepSeekRecharge()" style="width:100%;padding:12px;background:white;color:#667eea;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💰 前往充值</button>
        </div>
        <div style="background:linear-gradient(135deg,#43E97B,#38F9D7);color:white;border-radius:16px;padding:16px;margin-bottom:16px;cursor:pointer;" onclick="window.open('https://platform.deepseek.com', '_blank')">
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="font-size:28px;">⚡</div>
                <div>
                    <div style="font-size:14px;font-weight:600;">智能助手PLUS</div>
                    <div style="font-size:11px;opacity:0.9;margin-top:4px;">解锁更强大的AI对话能力</div>
                </div>
            </div>
        </div>'''

content = content.replace(old_settings, new_settings)

# 17. 添加充值跳转函数
recharge_function = '''
// ====== DeepSeek充值 ======
function openDeepSeekRecharge() {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    modal.classList.add('show');
    content.innerHTML = \`
        <div style="text-align:center;margin-bottom:20px;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;">💰</div>
            <div style="font-size:18px;font-weight:bold;">DeepSeek 充值中心</div>
        </div>
        <div style="background:#f5f7ff;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="font-size:14px;color:var(--text-gray);margin-bottom:12px;">充值步骤：</div>
            <div style="font-size:13px;line-height:1.8;">
                1. 访问 <span style="color:var(--blue);font-weight:bold;">platform.deepseek.com</span><br>
                2. 登录或注册账号<br>
                3. 点击左侧"充值"选项<br>
                4. 选择充值金额或套餐<br>
                5. 完成支付即可
            </div>
        </div>
        <div style="background:#fff3e0;border-radius:12px;padding:12px;margin-bottom:16px;">
            <div style="font-size:12px;color:var(--orange);">💡 提示：首次充值有优惠活动</div>
        </div>
        <button onclick="window.open('https://platform.deepseek.com', '_blank')" class="login-btn login-btn-primary" style="margin-bottom:8px;">🌐 立即前往充值</button>
        <button class="modal-close" onclick="closeModal()">关闭</button>
    \`;
}

'''

# 找到</script>结束位置并插入
pos = content.rfind('</script>')
if pos > 0:
    content = content[:pos] + recharge_function + '\n' + content[pos:]

# 18. 更新版本号
content = content.replace(
    "console.log('认知训练门户 V44 加载完成');",
    "console.log('认知训练门户 V49 加载完成');"
)

print("Step 16-18 completed: Updated settings and added recharge function")
print(f"File length: {len(content)} characters")

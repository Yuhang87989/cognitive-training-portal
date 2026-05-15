// ==========================================
// 修复 DeepSeek 帮助文档按钮样式和功能
// ==========================================

(function() {
    console.log('🔧 开始修复 DeepSeek 帮助文档按钮...');
    
    // 确保 openDeepseekHelpModal 函数正确导出到 window
    if (typeof window.openDeepseekHelpModal !== 'function') {
        console.log('⚠️ openDeepseekHelpModal 函数未找到，重新定义...');
        
        window.openDeepseekHelpModal = function() {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>🔮 DeepSeek 使用帮助</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">📋 目录</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <ul style="margin: 0; padding-left: 20px;">
                                <li><a href="#mode-diff" style="color: #667eea;">快速模式 vs 专家模式</a></li>
                                <li><a href="#token-explain" style="color: #667eea;">Token 消耗说明</a></li>
                                <li><a href="#api-config" style="color: #667eea;">API Key 配置方法</a></li>
                            </ul>
                        </div>
                        
                        <div id="mode-diff" style="margin-bottom: 25px;">
                            <h4 style="color: #667eea; margin-bottom: 10px;">⚡ 快速模式 vs 专家模式</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <thead>
                                    <tr style="background: #667eea; color: white;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">特性</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">快速模式</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">专家模式</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>模型</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Chat</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">DeepSeek Reasoner</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>响应速度</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">🚀 快速 (~3-5秒)</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">🐢 较慢 (~10-20秒)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>推理能力</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">⭐⭐⭐⭐⭐</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Token消耗</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">💰 较低</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">💰💰 较高</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>适用场景</strong></td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">日常问答、简单解释</td>
                                        <td style="padding: 8px; border: 1px solid #ddd;">复杂题目、深度分析</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div id="token-explain" style="margin-bottom: 25px;">
                            <h4 style="color: #667eea; margin-bottom: 10px;">💰 Token 消耗说明</h4>
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0 0 10px 0;"><strong>什么是 Token？</strong></p>
                                <p style="margin: 0;">Token 是 AI 模型处理文本的基本单位。中文中，大约 1-2 个汉字 = 1 个 Token。</p>
                            </div>
                            <div style="margin-top: 15px;">
                                <p style="margin-bottom: 8px;"><strong>计费标准：</strong></p>
                                <ul style="margin: 0; padding-left: 20px;">
                                    <li><strong>输入</strong>：¥1.00 / 百万 Token</li>
                                    <li><strong>输出</strong>：¥2.00 / 百万 Token</li>
                                    <li><strong>一次对话</strong>：通常消耗 500-2000 Token（约 ¥0.001-¥0.004）</li>
                                </ul>
                            </div>
                            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-top: 15px;">
                                <p style="margin: 0;"><strong>💡 省钱小贴士：</strong> 对话越长，Token 消耗越多。适时开启新对话可以节省费用。</p>
                            </div>
                        </div>
                        
                        <div id="api-config">
                            <h4 style="color: #667eea; margin-bottom: 10px;">🔑 API Key 配置方法</h4>
                            <ol style="margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">
                                    <strong>获取 API Key</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">访问 <a href="https://platform.deepseek.com/" target="_blank" style="color: #667eea;">DeepSeek 开放平台</a>，注册登录后在「API Keys」页面创建新的 Key</p>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>充值余额</strong>
                                    <p style="margin: 0; font-size: 14px; color: #666;">在「费用中心」充值，最低 ¥10 起充</p>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>配置到应用</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">在 DeepSeek 聊天页面点击「设置」按钮，输入你的 API Key</p>
                                </li>
                                <li>
                                    <strong>验证配置</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">发送一句简单的问候，如"你好"，如果能正常回复则配置成功</p>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="modal-footer" style="text-align: center;">
                        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">我知道了</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        };
        
        console.log('✅ openDeepseekHelpModal 函数已重新定义并导出');
    } else {
        console.log('✅ openDeepseekHelpModal 函数已存在');
    }
    
    // 修复按钮样式：确保 DeepSeek 帮助文档按钮样式与其他按钮一致
    function fixDeepSeekButtonStyles() {
        // 查找所有包含 "DeepSeek帮助文档" 的按钮
        const buttons = document.querySelectorAll('button');
        let fixedCount = 0;
        
        buttons.forEach(btn => {
            if (btn.textContent.includes('DeepSeek帮助文档') || 
                btn.getAttribute('onclick') === 'openDeepseekHelpModal()') {
                
                // 移除 disabled 属性
                btn.disabled = false;
                
                // 确保 class 正确
                btn.className = 'foldable-btn';
                
                // 移除可能的内联样式覆盖
                btn.style.removeProperty('background');
                btn.style.removeProperty('color');
                btn.style.removeProperty('opacity');
                btn.style.removeProperty('cursor');
                
                // 确保样式与其他按钮一致
                btn.style.background = '#f8f9fa';
                btn.style.color = '#333';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            console.log(`✅ 已修复 ${fixedCount} 个 DeepSeek 帮助文档按钮的样式`);
        } else {
            console.log('⚠️ 未找到需要修复的 DeepSeek 帮助文档按钮');
        }
    }
    
    // 在页面加载后和每次渲染后修复按钮样式
    function setupStyleFix() {
        // 初始修复
        setTimeout(fixDeepSeekButtonStyles, 500);
        
        // 监听 DOM 变化，在 my-page 渲染后修复
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.innerHTML && 
                            node.innerHTML.includes('DeepSeek帮助文档')) {
                            setTimeout(fixDeepSeekButtonStyles, 100);
                        }
                    });
                }
            });
        });
        
        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupStyleFix);
    } else {
        setupStyleFix();
    }
    
    console.log('✅ DeepSeek 帮助文档按钮修复完成');
})();

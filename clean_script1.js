<script>
// V33: 立即强制隐藏登录页面，防止部署系统干扰
(function(){
    // 创建多层保护样式
    var style = document.createElement('style');
    style.id = 'v33-login-protect';
    style.textContent = `
        .login-page{display:none !important;opacity:0 !important}
        .login-page.active{display:flex !important;visibility:visible !important;position:relative !important;left:auto !important;opacity:1 !important}
    `;
    document.head.appendChild(style);
    
    // 立即隐藏登录页
    var loginPage = document.getElementById('page-login');
    if(loginPage){
        loginPage.style.cssText = 'display:none !important;opacity:0 !important';
    }
    
    // 延迟500ms后再次检查并强制隐藏
    setTimeout(function(){
        var lp = document.getElementById('page-login');
        if(lp && !lp.classList.contains('active')){
            lp.style.cssText = 'display:none !important;opacity:0 !important';
        }
    }, 500);
    
    // 延迟1秒后再次强制检查
    setTimeout(function(){
        var lp = document.getElementById('page-login');
        if(lp && !lp.classList.contains('active')){
            lp.style.cssText = 'display:none !important;opacity:0 !important';
        }
    }, 1000);
})();
</script>

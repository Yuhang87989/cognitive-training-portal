# 一键部署脚本 - 粘贴到腾讯云网页终端执行
# 服务器: 139.155.129.27 | 域名: qiuyhang1688.com.cn

set -e
echo ">>> 1. 启动Nginx..."
systemctl start nginx 2>/dev/null || true
systemctl enable nginx 2>/dev/null || true

echo ">>> 2. 安装Git..."
yum install -y git 2>&1 | tail -1

echo ">>> 3. 下载代码..."
mkdir -p /var/www && cd /var/www
rm -rf cognitive-training-portal
git clone https://github.com/Yuhang87989/cognitive-training-portal.git 2>&1 | tail -3

echo ">>> 4. 配置Nginx..."
cat > /etc/nginx/conf.d/portal.conf << 'EOF'
server {
    listen 80;
    server_name qiuyhang1688.com.cn www.qiuyhang1688.com.cn;
    root /var/www/cognitive-training-portal;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 7d;
    }
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
EOF

# 确保主配置加载了 conf.d
grep -q "include.*conf.d" /etc/nginx/nginx.conf || sed -i '/http {/a \    include /etc/nginx/conf.d/*.conf;' /etc/nginx/nginx.conf

echo ">>> 5. 测试并重载..."
nginx -t
systemctl reload nginx

echo ""
echo "=== 部署完成! ==="
curl -sI http://localhost | head -2
echo ">>> 下一步: 在腾讯云DNS添加A记录 qiuyhang1688.com.cn -> 139.155.129.27"

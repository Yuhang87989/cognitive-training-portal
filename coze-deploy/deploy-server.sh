#!/bin/bash
# 一键部署脚本 - 在腾讯云轻量服务器网页终端中执行
# 服务器 IP: 139.155.129.27
# 域名: qiuyhang1688.com.cn

set -e

echo "=== 1/5 检查环境 ==="
echo "系统: $(cat /etc/redhat-release)"
echo "Nginx: $(nginx -v 2>&1)"

echo "=== 2/5 安装 Git ==="
yum install -y git 2>&1 | tail -3

echo "=== 3/5 下载代码 ==="
mkdir -p /var/www
cd /var/www
if [ -d "cognitive-training-portal" ]; then
    echo "目录已存在，更新代码..."
    cd cognitive-training-portal
    git pull origin main
else
    echo "克隆仓库..."
    git clone https://github.com/Yuhang87989/cognitive-training-portal.git
fi

echo "=== 4/5 配置 Nginx ==="
# 备份默认配置
if [ ! -f /etc/nginx/nginx.conf.bak ]; then
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
fi

# 创建站点配置
cat > /etc/nginx/conf.d/portal.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name qiuyhang1688.com.cn www.qiuyhang1688.com.cn 139.155.129.27;
    root /var/www/cognitive-training-portal;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
NGINX_EOF

echo "=== 5/5 测试并重载 Nginx ==="
nginx -t
systemctl reload nginx
systemctl enable nginx

echo ""
echo "=== 部署完成 ==="
echo "访问地址: http://139.155.129.27"
echo ""
echo "下一步操作:"
echo "1. 在腾讯云 DNS 控制台添加 A 记录: qiuyhang1688.com.cn -> 139.155.129.27"
echo "2. 域名解析生效后执行: curl -I http://qiuyhang1688.com.cn"
echo "3. 申请 SSL 证书: certbot --nginx -d qiuyhang1688.com.cn -d www.qiuyhang1688.com.cn"
echo ""
echo "验证: curl -I http://$(hostname -I | awk '{print $1}')"

// Service Worker for 认知训练门户 PWA v140
const CACHE_NAME = 'cognitive-training-v140';

// 需要缓存的资源
const PRECACHE_RESOURCES = [
  '/cognitive-training-portal/',
  '/cognitive-training-portal/index.html'
];

// 安装事件 - 预缓存资源
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] 安装中... v140');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] 预缓存资源');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        console.log('[ServiceWorker] 安装完成');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] 预缓存失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] 激活中...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 删除所有旧版本缓存，保留当前版本
            if (cacheName.indexOf('cognitive-training') !== -1 && cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] 激活完成');
        return self.clients.claim();
      })
  );
});

// 请求拦截 - 网络优先策略 (Network First)
self.addEventListener('fetch', (event) => {
  // 忽略非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 忽略Chrome扩展等非HTTP请求
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // 导航请求使用网络优先策略
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 网络成功，返回最新内容
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // 网络失败时从缓存获取
          console.log('[ServiceWorker] 网络请求失败，从缓存获取');
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // 返回离线页面
              return caches.match('/cognitive-training-portal/');
            });
        })
    );
    return;
  }

  // 其他资源：网络优先，缓存备选
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 消息处理 - 手动清除缓存
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.indexOf('cognitive-training') !== -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] 缓存已清除');
    });
  }
});

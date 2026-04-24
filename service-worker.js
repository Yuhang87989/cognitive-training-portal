// Service Worker for 认知训练门户 PWA
const CACHE_NAME = 'cognitive-training-v1.0.0';
const OFFLINE_URL = '/training_portal_final.html';

// 需要缓存的资源
const PRECACHE_RESOURCES = [
  '/training_portal_final.html',
  '/manifest_final.json',
  '/'
];

// 安装事件 - 预缓存资源
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] 安装中...');
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
            if (cacheName !== CACHE_NAME) {
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

// 请求拦截 - 网络优先，缓存备选
self.addEventListener('fetch', (event) => {
  // 忽略非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 忽略Chrome扩展等非HTTP请求
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果是成功的响应，克隆并缓存
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
        // 网络失败时尝试从缓存获取
        console.log('[ServiceWorker] 网络请求失败，从缓存获取');
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 如果是导航请求，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            // 其他资源返回空响应
            return new Response('', {
              status: 408,
              statusText: 'Request timeout'
            });
          });
      })
  );
});

// 消息处理 - 清除缓存
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] 缓存已清除');
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});

// 后台同步 - 离线数据同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-training-data') {
    console.log('[ServiceWorker] 后台同步训练数据');
    event.waitUntil(syncTrainingData());
  }
});

async function syncTrainingData() {
  // 实际应用中这里会与服务器同步数据
  console.log('[ServiceWorker] 训练数据同步完成');
}

// 推送通知 - 可扩展功能
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '您有新的训练任务',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: '开始训练' },
      { action: 'close', title: '关闭' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('认知训练提醒', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/training_portal_final.html')
    );
  }
});

console.log('[ServiceWorker] 脚本加载完成');

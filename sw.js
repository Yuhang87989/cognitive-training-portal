// Service Worker for 认知训练门户 V151
// 缓存策略: Network First + Stale-while-revalidate (podcast-data.json)

var CACHE_NAME = 'cognitive-training-v151';
var OFFLINE_URL = './index.html';

// 关键文件列表
var PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './podcast-data.json',
    './icon-192.png',
    './icon-512x512.png',
    './apple-touch-icon.png'
];

// JS模块文件
var JS_FILES = [
    './js/main.js'
];

// 安装事件 - 预缓存关键文件
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW] 预缓存关键文件');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(function() {
                return self.skipWaiting();
            })
            .catch(function(err) {
                console.warn('[SW] 预缓存失败:', err);
            })
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] 删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

// 获取事件 - 智能缓存策略
self.addEventListener('fetch', function(event) {
    var request = event.request;
    var url = new URL(request.url);

    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }

    // podcast-data.json 使用 stale-while-revalidate 策略
    if (url.pathname.indexOf('podcast-data.json') !== -1) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // 其他文件使用 Network First 策略
    event.respondWith(networkFirst(request));
});

// Network First 策略
function networkFirst(request) {
    return fetch(request)
        .then(function(response) {
            if (response && response.ok) {
                var responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(request, responseClone);
                    });
            }
            return response;
        })
        .catch(function() {
            return caches.match(request)
                .then(function(response) {
                    if (response) {
                        return response;
                    }
                    // 离线回退
                    return caches.match(OFFLINE_URL);
                });
        });
}

// Stale-while-revalidate 策略
function staleWhileRevalidate(request) {
    return caches.match(request)
        .then(function(response) {
            var fetchPromise = fetch(request)
                .then(function(networkResponse) {
                    if (networkResponse && networkResponse.ok) {
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, networkResponse.clone());
                            });
                    }
                    return networkResponse;
                })
                .catch(function(err) {
                    console.warn('[SW] stale-while-revalidate 失败:', err);
                });

            // 立即返回缓存，后台更新
            return response || fetchPromise;
        });
}

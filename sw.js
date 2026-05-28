// Service Worker for 认知训练门户 V370
// 缓存策略: Network First (确保最新代码) + 离线回退

var CACHE_NAME = 'ct-v390';
var OFFLINE_URL = './index.html';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(['./', './index.html']).catch(function(){});
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(names.filter(function(n) {
                return n !== CACHE_NAME;
            }).map(function(n) {
                return caches.delete(n);
            }));
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;
    var url = new URL(request.url);
    
    // 只处理同源GET请求
    if (url.origin !== location.origin || request.method !== 'GET') return;
    
    // Network First: 优先网络，确保最新代码
    event.respondWith(
        fetch(request).then(function(response) {
            if (response && response.ok) {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, clone);
                });
            }
            return response;
        }).catch(function() {
            // 网络不通，回退缓存
            return caches.match(request).then(function(cached) {
                return cached || caches.match(OFFLINE_URL);
            });
        })
    );
});

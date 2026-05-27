// V361: Service Worker 自毁版 - 清空所有缓存，放行所有请求
var CACHE_NAME = 'cognitive-training-v361';

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(names.map(function(name) { return caches.delete(name); }));
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request));
});

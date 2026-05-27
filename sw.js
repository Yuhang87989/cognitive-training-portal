// V368: 简单缓存SW - 缓存优先+版本控制
var CACHE_NAME = 'ct-v368';
var CACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/ctm.js',
  './js/db.js',
  './js/storage.js',
  './js/utils.js',
  './js/user.js',
  './js/modules/ui.js',
  './js/modules/data-sync.js',
  './js/data/topics.js',
  './js/data/podcasts.js',
  './js/data/videos.js',
  './js/data/games-config.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_URLS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
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

self.addEventListener('fetch', function(e) {
  // 只缓存同源GET请求
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    }).catch(function() {
      return caches.match('./index.html');
    })
  );
});

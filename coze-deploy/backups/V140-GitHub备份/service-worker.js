const CACHE_NAME = 'cognitive-training-v140';
const OFFLINE_URL = '/index.html';
const PRECACHE_RESOURCES = [
  '/cognitive-training-portal/',
  '/cognitive-training-portal/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_RESOURCES))
    .then(() => self.skipWaiting())
    .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then(response => {
      if(response.ok){
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_URL)))
  );
});

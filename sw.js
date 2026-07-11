// Hawkeye Live service worker: cache the shell for instant PWA startup;
// data/ and airplanes.live are always network (never cached).
var SHELL = 'hawkeye-shell-v3';
var ASSETS = ['./', 'index.html', 'manifest.webmanifest',
              'icons/hawkeye-192.png', 'icons/hawkeye-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL; })
      .map(function (k) { return caches.delete(k); }));
  }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.pathname.indexOf('/data/') !== -1 || url.host.indexOf('airplanes.live') !== -1) {
    return; // network-only
  }
  e.respondWith(caches.match(e.request).then(function (hit) {
    return hit || fetch(e.request);
  }));
});

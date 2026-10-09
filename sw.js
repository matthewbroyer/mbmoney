/* mbmoney.online service worker.
   Network-first for the app's own files, so updates arrive on the next visit; the cache is only the offline fallback.
   It never touches your data (that lives in localStorage) and ignores every request that is not a same-origin GET. */
const VERSION = 'mbmoney-v5-suite';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.svg', 'favicon.ico'];
const INDEX = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const nav = req.mode === 'navigate';
  const key = nav ? INDEX : req;   // every page load (including ?query variants) shares one cached copy of index.html
  e.respondWith(
    fetch(req, { cache: 'no-cache' })   // revalidate, so GitHub Pages' 10-minute HTTP cache cannot delay an update
      .then(res => {
        if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
        return res;
      })
      .catch(() => caches.match(key))
      .then(r => r || (nav ? caches.match(INDEX) : Response.error()))
  );
});

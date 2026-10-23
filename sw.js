/* 练习记录 · 离线缓存
   目的：健身房地下层没信号时，也能从主屏幕秒开。
   策略：先用缓存立刻显示，同时后台拉一次最新版；下次打开即为新版。 */
const CACHE = 'gymlog-v1';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 读缓存：先精确匹配，再忽略查询串，最后退回 index.html
async function fromCache(req) {
  const c = await caches.open(CACHE);
  return (await c.match(req)) ||
         (await c.match(req, { ignoreSearch: true })) ||
         (await c.match('./index.html')) ||
         (await c.match('./'));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const hit = await fromCache(req);
    if (hit) return hit;
    try { return await fetch(req); }
    catch (err) {
      return new Response('离线，且本地没有缓存。请联网后再打开一次。', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());

  // 后台更新缓存，不阻塞显示
  e.waitUntil((async () => {
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
    } catch (err) { /* 断网时保持旧缓存 */ }
  })());
});

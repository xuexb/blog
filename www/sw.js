importScripts("https://cdn.staticfile.org/workbox-sw/6.5.3/workbox-sw.js");

// workbox.setConfig({
//   debug: true,
// });

const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

workbox.core.setCacheNameDetails({
  prefix: "",
  precache: "xiaowudev-precache",
  suffix: "",
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// 百度统计.js缓存7天
registerRoute(
  ({ url }) => url.origin === "https://hm.baidu.com" && url.pathname === "/hm.js",
  getRouteHandle(getCacheFirstHandle({ maxAgeSeconds: 24 * 60 * 60 * 7 }))
);

// `/post/*.html` 做1天缓存
registerRoute(
  ({ url, sameOrigin }) =>
    sameOrigin && /^\/post\/[0-9a-zA-Z-_]+\.html$/.test(url.pathname),
  getRouteHandle(getCacheFirstHandle({ maxAgeSeconds: 24 * 60 * 60 })),
);

// 首页做1小时间缓存
registerRoute(
  ({ url, sameOrigin }) =>
    sameOrigin && ["/", ""].includes(url.pathname) && !url.search.includes('page='),
  getRouteHandle(getCacheFirstHandle({ maxAgeSeconds: 60 * 60 })),
);

// 列表相关页面做3小时间缓存
registerRoute(
  ({ url, sameOrigin }) =>
    sameOrigin && /^\/(archives|tags|links)\/?$/.test(url.pathname),
  getRouteHandle(getCacheFirstHandle({ maxAgeSeconds: 3 * 60 * 60 })),
);

// 静态文件预缓存
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

function getHeaders(headers) {
  const data = {};
  for (const [key, value] of headers.entries()) {
    data[key] = value;
  }
  return data;
}

function getCacheFirstHandle({ maxAgeSeconds = 24 * 60 * 60, cacheName = "xiaowudev-page" } = {}) {
  return new CacheFirst({
    cacheName,
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => request.url.split("?")[0],
      },
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds,
        maxEntries: 100,
      })
    ]
  });
}

function getRouteHandle(CacheHandle) {
  return async ({ event, request }) => {
    let cache = "HIT";
    let body;
    let headers = {};

    try {
      const res = await CacheHandle.handle({ event, request });
      body = await res.text();
      headers = getHeaders(res.headers);
    } catch (e) {
      const res = await fetch(request);
      body = await res.text();
      cache = "MISS";
      headers = getHeaders(res.headers);
    }
    return new Response(body, {
      headers: {
        ...headers,
        "x-service-worker": cache,
      },
    });
  };
}

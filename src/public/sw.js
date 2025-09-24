const CACHE_NAME = "story-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",

  // Aset lokal Anda (pastikan jalur ini benar)
  "/styles/styles.css",
  "/scripts/index.js",
  "/manifest.json",
  "/logo.png",
  "/favicon.png",

  // Aset eksternal dari CDN
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching assets.");
        // Menggunakan Promise.all untuk menangani setiap aset secara individual
        return Promise.all(
          urlsToCache.map((url) => {
            return cache.add(url).catch((reason) => {
              console.error(`Error adding ${url} to cache: ${reason}`);
            });
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Caching complete.");
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching:", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Jika ada di cache, langsung kembalikan respons
        if (response) {
          return response;
        }

        // Jika tidak ada di cache, coba ambil dari network
        return fetch(event.request).then((networkResponse) => {
          // Jika berhasil, tambahkan ke cache untuk penggunaan berikutnya
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch((error) => {
        console.error(
          "Fetch failed; returning from cache if available.",
          error
        );
        // Kembali ke cache saat network gagal (strategi cache-first)
        return caches.match(event.request);
      })
  );
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.options.body,
      icon: "/logo.png",
      badge: "/logo.png",
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

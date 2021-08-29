self.addEventListener("install", event => {
    event.waitUntil(caches.open("offline").then(cache => {
        return cache.addAll(["/offline/", "/assets/icon-grey@64.png"])
    }))

    self.skipWaiting()
})

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => { if ("navigationPreload" in self.registration) await self.registration.navigationPreload.enable() })())

    self.clients.claim()
})

self.addEventListener("fetch", event => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    if (event.preloadResponse) return event.preloadResponse
                    else return fetch(event.request)
                } catch (error) {
                    return caches.open("offline").then(cache => { return cache.match("/offline/") })
                }
            })()
        )
    }
})
self.addEventListener("install", () => { self.skipWaiting() })
self.addEventListener("activate", () => { self.clients.claim() })

self.addEventListener("fetch", event => {
    if (event.request.mode != "navigate") {
        var cachedFiles = []
        var cachedFormats = ["png", "jpg", "jpeg", "webp", "weba", "webm", "ico", "woff", "woff2"]

        var url = event.request.url
        if (url.endsWith("/")) {
            url = url.slice(0, url.length - 1)
        }

        if (cachedFiles.includes(url.split("/")[url.split("/").length - 1]) || cachedFormats.includes(url.split(".")[url.split(".").length - 1])) {
            event.respondWith((async () => {
                var cache = await caches.open("cachedDataV2")
                var cached = await cache.match(event.request)

                if (cached == undefined) {
                    await cache.add(event.request)

                    return await cache.match(event.request)
                } else {
                    return cached
                }
            })())
        }
    }
})
self.addEventListener("install", () => {
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    event.waitUntil(caches.open("offline").then(cache => {
        return cache.addAll([
            "/offline",
            "/assets/icon-grey@64.webp"
        ])
    }))

    self.clients.claim()
})

self.addEventListener("fetch", event => {
    if (event.request.mode == "navigate") {
        (async () => {
            try {
                await fetch("/api/online?type=json").then(res => res.json()).then(data => {
                    if (data.status != "online") {
                        throw new Error(data.status)
                    }
                })
            } catch (error) {
                event.respondWith(caches.open("offline").then(async cache => {
                    return await cache.match(event.request) || await cache.match("/offline")
                }))
            }
        })()
    } else {
        var cachedFiles = ["noto-serif.css", "kaisei-harunoumi.css"]
        var cachedFormats = ["png", "jpg", "jpeg", "ico", "woff", "woff2"]

        var url = event.request.url
        if (url.endsWith("/")) {
            url = url.slice(0, url.length - 1)
        }

        if (cachedFiles.includes(url.split("/")[url.split("/").length - 1]) || cachedFormats.includes(url.split(".")[url.split(".").length - 1])) {
            event.respondWith((async () => {
                var cache = await caches.open("cachedData")
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
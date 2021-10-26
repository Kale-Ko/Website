self.addEventListener("install", event => { self.skipWaiting() })
self.addEventListener("activate", event => {
    event.waitUntil(caches.open("offline").then(cache => {
        return cache.addAll([
            "/offline/",
            "/assets/icon-grey@64.png"
        ])
    }))

    self.clients.claim()
})

self.addEventListener("fetch", event => {
    if (event.request.mode == "navigate") {
        (async () => {
            try {
                await fetch("https://api.kaleko.ga/v2/online/").then(res => { if (res.status != 200) { throw new Error("Offline") } })
            } catch (error) {
                event.respondWith(caches.open("offline").then(async cache => { return await cache.match(event.request.url) || await cache.match("/offline/") }))
            }
        })()
    } else {
        if (event.request.url.endsWith(".woff") || event.request.url.endsWith(".woff2")) {
            event.respondWith(
                (async () => {
                    var cache = await caches.open("fonts")

                    var cacheres = await cache.match(event.request)

                    if (cacheres == undefined) {
                        await cache.add(event.request)

                        return await cache.match(event.request)
                    }
                    else return cacheres
                })()
            )
        } else if (event.request.url.endsWith(".png") || event.request.url.endsWith(".jpg") || event.request.url.endsWith(".jpeg") || event.request.url.endsWith(".ico")) {
            event.respondWith(
                (async () => {
                    var cache = await caches.open("images")

                    var cacheres = await cache.match(event.request)

                    if (cacheres == undefined) {
                        await cache.add(event.request)

                        return await cache.match(event.request)
                    }
                    else return cacheres
                })()
            )
        }
    }
})
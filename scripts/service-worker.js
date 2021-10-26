self.addEventListener("install", event => { self.skipWaiting() })
self.addEventListener("activate", event => { self.clients.claim() })

self.addEventListener("fetch", event => {
    if (event.request.mode == "navigate") {
        event.waitUntil(caches.open("offline").then(cache => {
            return cache.addAll([
                "/offline/",
                "/assets/icon-grey@64.png"
            ])
        }))

        event.respondWith(
            (async () => {
                try {
                    return await fetch(event.request).then(res => { if (res.status >= 500) { throw new Error("Offline") } else return res })
                } catch (error) {
                    return caches.open("offline").then(async cache => { return await cache.match(event.request.url) || await cache.match("/offline/") })
                }
            })()
        )
    } else {
        if (event.request.url.endsWith(".woff") || event.request.url.endsWith(".woff2")) {
            event.respondWith(
                (async () => {
                    var cache = await caches.open("font")

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
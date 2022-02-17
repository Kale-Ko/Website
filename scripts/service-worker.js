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
                await fetch("https://api.kaleko.ga/v4/online/").then(res => { if (res.status != 200) { throw new Error("Offline") } })
            } catch (error) {
                event.respondWith(caches.open("offline").then(async cache => { return await cache.match(event.request) || await cache.match("/offline/") }))
            }
        })()
    } else {
        var cachedFiles = ["manifest.json"]
        var cachedFormats = ["woff", "woff2", "png", "jpg", "jpeg", "ico"]

        var url = event.request.url
        if (url.endsWith("/")) url = url.slice(0, url.length - 1)

        if ((cachedFiles.includes(url.split("/")[url.split("/").length - 1]) || cachedFormats.includes(url.split(".")[url.split(".").length - 1])) && new URL(url).hostname != "api.kaleko.ga") {
            event.respondWith(
                (async () => {
                    var cache = await caches.open("cacheddata")
                    var cachered = await cache.match(event.request)

                    if (cachered == undefined) {
                        await cache.add(event.request)

                        return await cache.match(event.request)
                    } else return cachered
                })()
            )
        }
    }
})
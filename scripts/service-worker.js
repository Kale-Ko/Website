/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

self.addEventListener("install", event => { self.skipWaiting() })
self.addEventListener("activate", event => {
    event.waitUntil(caches.open("offline").then(cache => {
        return cache.addAll([
            "/offline/"
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
        var cachedFormats = ["woff", "woff2", "png", "jpg", "jpeg", "ico"]

        if (cachedFormats.includes(event.request.url.split(".")[event.request.url.split(".").length - 1])) {
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
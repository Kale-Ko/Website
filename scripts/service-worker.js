self.addEventListener("install", event => {
    event.waitUntil(caches.open("offline").then(cache => {
        return cache.addAll(["/offline/", "/assets/icon-grey@64.png"])
    }))

    self.skipWaiting()
})

self.addEventListener("activate", event => { self.clients.claim() })

self.addEventListener("fetch", event => {
    if (event.request.mode == "navigate") {
        event.respondWith(
            (async () => {
                try {
                    return await fetch(event.request).then(res => { if (res.status > 400) { throw new Error("Offline") } else return res })
                } catch (error) {
                    return await caches.open("offline").then(async cache => { return await cache.match(event.request.url) || await cache.match("/offline/") })
                }
            })()
        )
    }
})

/*
self.addEventListener("push", event => {
    var data = event.data.json()

    var payload = {
        body: data.body || "",
        data: {
            url: data.url || ""
        }
    }

    event.waitUntil(self.registration.showNotification("Push", payload))
})

self.addEventListener("notificationclick", event => {
    var notification = event.notification

    if (event.action == "close") {
        notification.close()
    } else if (notification.data.url != "") {
        clients.openWindow(notification.data.url)

        notification.close()
    }
})
*/
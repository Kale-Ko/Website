if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js")

var settings = [
    {
        id: "darkmode", title: "Darkmode", type: "checkbox", default: false,
        handler: {
            display: () => true,
            updateElement: (element) => { element.checked = (localStorage.getItem("darkmode") == "true" ? true : false) },
            update: () => {
                if (localStorage.getItem("darkmode") == "true") document.querySelector("html").classList.add("darkmode")
                else document.querySelector("html").classList.remove("darkmode")
            },
            set: (element) => { localStorage.setItem("darkmode", element.checked) }
        }
    },
    {
        id: "fade-in", title: "Fade In", type: "checkbox", default: true,
        handler: {
            display: () => true,
            updateElement: (element) => { element.checked = (localStorage.getItem("fade-in") == "true" ? true : false) },
            update: () => {
                if (localStorage.getItem("fade-in") == "true") document.querySelector("html").classList.add("fade-in")
                else document.querySelector("html").classList.remove("fade-in")
            },
            set: (element) => { localStorage.setItem("fade-in", element.checked) }
        }
    },
    {
        id: "autoredirect", title: "Auto Redirect", type: "checkbox", default: false,
        handler: {
            display: () => true,
            updateElement: (element) => { element.checked = (localStorage.getItem("autoredirect") == "true" ? true : false) },
            update: () => { },
            set: (element) => { localStorage.setItem("autoredirect", element.checked) }
        }
    },
    {
        id: "notifications", title: "Notifications", type: "checkbox", default: false,
        handler: {
            display: () => { return Notification.permission != "denied" },
            updateElement: (element) => {
                element.checked = Notification.permission == "granted"

                element.disabled = Notification.permission != "default"
            },
            update: () => { },
            set: (element) => {
                if (element.checked == true) {
                    if (Notification.permission == "default") {
                        Notification.requestPermission().then(permission => {
                            if (permission == "granted") {
                                element.disabled = true

                                navigator.serviceWorker.getRegistration().then(reg => {
                                    reg.pushManager.subscribe({
                                        userVisibleOnly: true,
                                        applicationServerKey: "BLw7BNeS9HemIsAQakA5Z--wXft5nOXrXb-aXqhK47TWudngDcS7epJoNvLecSgTgxQnBK5uJklkXhZuMqKkuks"
                                    }).then(sub => {
                                        fetch("http://pushapi.kaleko.ga/send", {
                                            method: "POST",
                                            body: JSON.stringify({
                                                subscription: sub.toJSON(),
                                                data: JSON.stringify({
                                                    title: "Notifications Enabled!",
                                                    body: "This is what notifications will look like",
                                                    data: {
                                                        url: "/notifications"
                                                    },
                                                    actions: [
                                                        {
                                                            "action": "dismiss",
                                                            "title": "Ok"
                                                        },
                                                        {
                                                            "action": "open",
                                                            "title": "More"
                                                        }
                                                    ],
                                                    tag: "kaleko.notification.enable"
                                                })
                                            })
                                        })
                                    })
                                })
                            } else if (permission == "denied") element.parentElement.remove()
                            else element.checked = false
                        })
                    }
                }
            }
        }
    }
]

function updateSettings() {
    settings.forEach(setting => { if (localStorage.getItem(setting.id) == null) setting.handler.set({ value: setting.default, checked: setting.default }) })

    settings.forEach(setting => { setting.handler.update() })
}
updateSettings()

window.dispatchEvent(new CustomEvent("settingsloaded"))
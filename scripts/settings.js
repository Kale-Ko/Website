const settings = [
    {
        id: "darkmode", title: "Darkmode", type: "checkbox", default: ("matchMedia" in window ? window.matchMedia("(prefers-color-scheme: dark)").matches : false), export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("darkmode") == "true")
            },
            update: () => {
                if (localStorage.getItem("darkmode") == "true") {
                    document.querySelector("html").classList.add("darkmode")
                } else {
                    document.querySelector("html").classList.remove("darkmode")
                }
            },
            set: (element) => {
                localStorage.setItem("darkmode", element.checked)
            }
        }
    },
    {
        id: "quickRedirect", title: "Quick Redirect", type: "checkbox", default: false, export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("quickRedirect") == "true")
            },
            update: () => { },
            set: (element) => {
                localStorage.setItem("quickRedirect", element.checked)
            }
        }
    },
    {
        id: "noGradient", title: "No Background Gradient", type: "checkbox", default: false, export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("noGradient") == "true")
            },
            update: () => {
                if (localStorage.getItem("noGradient") == "true") {
                    document.querySelector("html").classList.add("noGradient")
                } else {
                    document.querySelector("html").classList.remove("noGradient")
                }
            },
            set: (element) => {
                localStorage.setItem("noGradient", element.checked)
            }
        }
    },
    {
        id: "allowAnalytics", title: "Allow Anonymous Analytics", type: "checkbox", default: ("doNotTrack" in navigator ? (navigator.doNotTrack != "1") : true), export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("allowAnalytics") == "true")
            },
            update: () => { },
            set: (element) => {
                localStorage.setItem("allowAnalytics", element.checked)

                window.location.reload()
            }
        }
    },
    // {
    //     id: "notifications", title: "Notifications", type: "checkbox", default: false, export: false,
    //     handler: {
    //         display: () => {
    //             return Notification.permission != "denied"
    //         },
    //         updateElement: (element) => {
    //             element.checked = Notification.permission == "granted"
    // 
    //             element.disabled = Notification.permission != "default"
    //         },
    //         update: () => { },
    //         set: (element) => {
    //             if (element.checked == true) {
    //                 if (Notification.permission == "default") {
    //                     Notification.requestPermission().then(permission => {
    //                         if (permission == "granted") {
    //                             element.disabled = true
    //                         } else if (permission == "denied") {
    //                             element.parentElement.remove()
    //                         } else {
    //                             element.checked = false
    //                         }
    //                     })
    //                 }
    //             }
    //         }
    //     }
    // }
]
window.settings = settings

function updateSettings() {
    settings.forEach(setting => {
        if (localStorage.getItem(setting.id) == null) {
            setting.handler.set({ value: setting.default, checked: setting.default })
        }
    })

    settings.forEach(setting => {
        setting.handler.update()
    })
}
updateSettings()

window.dispatchEvent(new CustomEvent("settingsLoaded"))
window.settingsLoaded = true
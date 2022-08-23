const settings = [
    {
        id: "darkmode", title: "Darkmode", type: "checkbox", default: ("matchMedia" in window ? window.matchMedia("(prefers-color-scheme: dark)").matches : false), export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("darkmode") == "true" ? true : false)
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
                element.checked = (localStorage.getItem("quickRedirect") == "true" ? true : false)
            },
            update: () => { },
            set: (element) => {
                localStorage.setItem("quickRedirect", element.checked)
            }
        }
    },
    {
        id: "no-gradient", title: "No Background Gradient", type: "checkbox", default: false, export: true,
        handler: {
            display: () => true,
            updateElement: (element) => {
                element.checked = (localStorage.getItem("no-gradient") == "true" ? true : false)
            },
            update: () => {
                if (localStorage.getItem("no-gradient") == "true") {
                    document.querySelector("html").classList.add("no-gradient")
                } else {
                    document.querySelector("html").classList.remove("no-gradient")
                }
            },
            set: (element) => {
                localStorage.setItem("no-gradient", element.checked)
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
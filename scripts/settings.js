/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

var settings = [
    {
        id: "darkmode", title: "Darkmode", type: "checkbox", default: true, export: true,
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
        id: "fade-in", title: "Fade In", type: "checkbox", default: false, export: true,
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
        id: "autoredirect", title: "Auto Redirect", type: "checkbox", default: false, export: true,
        handler: {
            display: () => true,
            updateElement: (element) => { element.checked = (localStorage.getItem("autoredirect") == "true" ? true : false) },
            update: () => { },
            set: (element) => { localStorage.setItem("autoredirect", element.checked) }
        }
    },
    {
        id: "no-fade", title: "No Background Fade", type: "checkbox", default: false, export: true,
        handler: {
            display: () => true,
            updateElement: (element) => { element.checked = (localStorage.getItem("no-fade") == "true" ? true : false) },
            update: () => {
                if (localStorage.getItem("no-fade") == "true") document.querySelector("html").classList.add("no-fade")
                else document.querySelector("html").classList.remove("no-fade")
            },
            set: (element) => { localStorage.setItem("no-fade", element.checked) }
        }
    },
    // {
    //     id: "notifications", title: "Notifications", type: "checkbox", default: false, export: false,
    //     handler: {
    //         display: () => { return Notification.permission != "denied" },
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
    //                         } else if (permission == "denied") element.parentElement.remove()
    //                         else element.checked = false
    //                     })
    //                 }
    //             }
    //         }
    //     }
    // }
]

function updateSettings() {
    settings.forEach(setting => { if (localStorage.getItem(setting.id) == null) setting.handler.set({ value: setting.default, checked: setting.default }) })

    settings.forEach(setting => { setting.handler.update() })
}
updateSettings()

window.dispatchEvent(new CustomEvent("settingsloaded"))

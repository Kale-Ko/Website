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
    }
]
window.settings = settings

function updateSettings() {
    for (var setting of settings) {
        if (localStorage.getItem(setting.id) == null) {
            setting.handler.set({ value: setting.default, checked: setting.default })
        }
    }

    for (var setting of settings) {
        setting.handler.update()
    }
}
updateSettings()

window.dispatchEvent(new CustomEvent("settingsLoaded"))
window.settingsLoaded = true
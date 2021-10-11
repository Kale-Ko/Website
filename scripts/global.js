if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js")

var settings = [
    { id: "darkmode", title: "Darkmode", type: "checkbox", default: false },
    { id: "autoredirect", title: "Auto Redirect", type: "checkbox", default: false }
]

window.dispatchEvent(new CustomEvent("settingsready"))

function updateSettings() {
    settings.forEach(setting => { if (localStorage.getItem(setting.id) == null) localStorage.setItem(setting.id, setting.default) })

    if (localStorage.getItem("darkmode") == "true") document.querySelector("html").setAttribute("class", "darkmode")
    else document.querySelector("html").setAttribute("class", "")
}
updateSettings()
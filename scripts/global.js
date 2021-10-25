if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js")

var settings = [
    { id: "darkmode", title: "Darkmode", type: "checkbox", default: false },
    { id: "fade-in", title: "Fade In", type: "checkbox", default: true },
    { id: "autoredirect", title: "Auto Redirect", type: "checkbox", default: false }
]

window.dispatchEvent(new CustomEvent("settingsready"))

function updateSettings() {
    settings.forEach(setting => { if (localStorage.getItem(setting.id) == null) localStorage.setItem(setting.id, setting.default) })

    document.querySelector("html").setAttribute("class", "")

    if (localStorage.getItem("darkmode") == "true") document.querySelector("html").classList.add("darkmode")
    if (localStorage.getItem("fade-in") == "true") document.querySelector("html").classList.add("fade-in")
}
updateSettings()
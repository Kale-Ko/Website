if (window.location.hostname != "localhost") {
    if (!window.location.hostname.startsWith("www.")) {
        window.location.replace(window.location.href.replace(window.location.hostname, "www." + window.location.hostname).replace("http:", "https:"))
    }

    if (window.location.protocol == "http:") {
        window.location.replace(window.location.href.replace("http:", "https:"))
    }
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
}

if ("matchMedia" in window && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.querySelector("html").classList.add("darkmode")
}
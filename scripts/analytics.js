if (localStorage.getItem("allowAnalytics") == "true") {
    var analyticsData = { id: "", os: "unknown", browser: "unknown", language: "unknown", usesDarkmode: null, usesQuickRedirects: null, usesNoBackgroundGradient: null, usedSecureConnection: "unknown", visited: null }

    if ("platform" in navigator) {
        analyticsData.os = (navigator.platform.toLowerCase().includes("win") ? "windows" : (navigator.platform.toLowerCase().includes("mac") ? "mac" : (navigator.platform.toLowerCase().includes("linux") ? "linux" : ((navigator.platform.toLowerCase().includes("iphone") || navigator.platform.toLowerCase().includes("ipad")) ? "ios" : (navigator.platform.toLowerCase().includes("android") ? "android" : "unknown")))))
    } else if ("oscpu" in navigator) {
        analyticsData.os = (navigator.oscpu.toLowerCase().includes("windows") ? "windows" : (navigator.oscpu.toLowerCase().includes("mac os") ? "mac" : (navigator.oscpu.toLowerCase().includes("linux") ? "linux" : "unknown")))
    }

    if ("userAgent" in navigator) {
        if (navigator.userAgent.toLowerCase().includes("chrome")) {
            analyticsData.browser = "chrome"
        } else if (navigator.userAgent.toLowerCase().includes("firefox")) {
            analyticsData.browser = "firefox"
        } else if (navigator.userAgent.toLowerCase().includes("microsoft edge")) {
            analyticsData.browser = "microsoft edge"
        } else if (navigator.userAgent.toLowerCase().includes("chromium")) {
            analyticsData.browser = "other chromium"
        } else if (navigator.userAgent.toLowerCase().includes("safari")) {
            analyticsData.browser = "safari"
        }

        if (navigator.userAgent.toLowerCase().includes("windows")) {
            analyticsData.os = "windows"
        } else if (navigator.userAgent.toLowerCase().includes("mac os")) {
            analyticsData.os = "mac os"
        } else if (navigator.userAgent.toLowerCase().includes("linux")) {
            analyticsData.os = "linux"
        } else if (navigator.userAgent.toLowerCase().includes("iphone")) {
            analyticsData.os = "iphone"
        } else if (navigator.userAgent.toLowerCase().includes("ipad")) {
            analyticsData.os = "ipad"
        } else if (navigator.userAgent.toLowerCase().includes("android")) {
            analyticsData.os = "android"
        }
    }

    if ("language" in navigator) {
        analyticsData.language = navigator.language.split("-")[0]
    } else if ("languages" in navigator) {
        analyticsData.language = navigator.languages[0].split("-")[0]
    }

    analyticsData.usesDarkmode = (localStorage.getItem("darkmode") == "true")
    analyticsData.usesQuickRedirects = (localStorage.getItem("quickRedirect") == "true")
    analyticsData.usesNoBackgroundGradient = (localStorage.getItem("noGradient") == "true")

    analyticsData.usedSecureConnection = window.location.protocol == "https:"

    if (window.location.pathname != "/" && window.location.pathname.endsWith("/")) {
        analyticsData.visited = window.location.pathname.substring(0, window.location.pathname.length - 1)
    } else {
        analyticsData.visited = window.location.pathname
    }

    var properties = ["userAgent", "platform", "oscpu", "hardwareConcurrency", "languages", "language", "product", "productSub", "vendor", "vendorSub", "appCodeName", "appName", "appVersion", "buildID"]

    properties.forEach(property => {
        if (property in navigator) {
            analyticsData.id += navigator[property]
        } else if (property in window) {
            analyticsData.id += window[property]
        }
    })

    crypto.subtle.digest("SHA-256", new TextEncoder().encode(analyticsData.id)).then(hashBuffer => {
        analyticsData.id = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")

        fetch("/api/analytics?type=json", { method: "POST", body: JSON.stringify(analyticsData) })
    })
}
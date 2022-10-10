if (!window.location.hostname.startsWith("www.") && window.location.hostname != "localhost") {
    window.location.replace(window.location.href.replace(window.location.hostname, "www." + window.location.hostname).replace("http:", "https:"))
}

if (window.location.protocol == "http:" && window.location.hostname != "localhost") {
    window.location.replace(window.location.href.replace("http:", "https:"))
}
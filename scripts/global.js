const globalapp = new Vue({
    el: "#page",
    data: {
        title: document.title.replace("Kale Ko - ", ""),
    },
    computed: {},
    methods: {}
})

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/scripts/service-worker.js")
document.title = "Kale Ko - " + document.title

const globalapp = new Vue({
    el: "#page",
    data: {
        title: document.title.replace("Kale Ko - ", ""),
    },
    computed: {},
    methods: {}
})
module.exports = {
    placeholders: {
        meta: `<link rel="icon" href="/assets/icon@64.png">
    <link rel="apple-touch-icon" href="/assets/icon@64.png">
    <link rel="stylesheet" href="/styles/global.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="My new and improved website">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Coding, Github, Games, Projects">
    <meta name="robots" content="all">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <meta name="creator" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/LICENSE">
    <link rel="manifest" href="/assets/manfiest.json">
    <meta name="theme-color" content="#ffbb00">`,

        offlinemeta: `<link rel="icon" href="/assets/icon-grey@64.png">
    <link rel="apple-touch-icon" href="/assets/icon-grey@64.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="Site offline">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Error, Offline">
    <meta name="robots" content="noindex">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <meta name="creator" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/LICENSE">
    <meta name="theme-color" content="#ffbb00">`,

        global: `<script src="/scripts/global.js"></script>
    <script src="/scripts/marked.js"></script>`
    },
    replacements: [
        { from: "<title>", to: "<title>Kale Ko - " }
    ],
    moves: [
        { from: "./scripts/service-worker.js", to: "./service-worker.js" }
    ]
}
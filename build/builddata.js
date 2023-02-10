module.exports = {
    baseUrl: "https://www.kaleko.dev",
    placeholders: {
        meta: `<link rel="icon" href="{file=/assets/icon@64.png}">
    <link rel="apple-touch-icon" href="{file=/assets/icon@64.png}">
    <link rel="stylesheet" href="{file=/styles/global.css}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:type" content="website">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="My website where I put all my projects">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="{file=/assets/icon@256.png}">
    <meta property="og:locale" content="en">

    <meta name="description" content="My website where I put all my projects">
    <meta name="keywords" content="Kale, Ko, Kale Ko, Kale-Ko, Kale_Ko, Coding, Development, Dev, Website, Personal, Github, Software, Game, Games, Snake, Projects">
    <meta name="image" content="{file=/assets/icon@256.png}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{canonical}">
    <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
    <link rel="author" href="https://github.com/Kale-Ko/">
    <link rel="license" href="{baseUrl}/license.txt">

    <script src="{file=/scripts/main.js}"></script>`,

        metaNoIndex: `<link rel="icon" href="{file=/assets/icon@64.png}">
    <link rel="apple-touch-icon" href="{file=/assets/icon@64.png}">
    <link rel="stylesheet" href="{file=/styles/global.css}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="robots" content="noindex, follow">
    <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
    <link rel="author" href="https://github.com/Kale-Ko/">
    <link rel="license" href="{baseUrl}/license.txt">

    <script src="{file=/scripts/main.js}"></script>`,

        nav: `<nav>
        <div class="dropdown"><img src="{file=/assets/menu@64.png}" alt="Menu Button" width="64" height="64"></img><div class="dropdown-content"></div></div>

        <div><a href="/"><span class="material-symbols material-symbols-large">&#xE88A;</span> Home</a></div>
        <div><a href="/projects/">Projects</a></div>
        <div><a href="/projects/snake/">Snake</a></div>
        <div><a href="https://github.com/Kale-Ko" target="_blank">Github<span class="material-symbols">&#xE89E;</span></a></div>
    </nav>`,

        global: `<script src="{file=/scripts/app.js}"></script>`
    },
    replacements: [
        { from: "<html>", to: "<html lang=\"en\" prefix=\"og: https://ogp.me/ns#\">" },
        { from: "<head>", to: "<head>\n    <meta charset=\"UTF-8\">" },
        { from: "<title>", to: "<title>kaleko.dev - " }
    ],
    moves: [
        { from: "./assets/headers", to: "./_headers" },
        { from: "./scripts/api.js", to: "./functions/api/[[path]].js" },
        { from: "./assets/icon.ico", to: "./favicon.ico", copy: true },
        { from: "./scripts/service-worker.js", to: "./service-worker.js", copy: true },
        { from: "./assets/robots.txt", to: "./robots.txt" },
        { from: "./assets/sitemap.xml", to: "./sitemap.xml" },
        { from: "./LICENSE", to: "./license.txt", copy: true }
    ],
    imageSizes: [
        16,
        32,
        48,
        64,
        96,
        128,
        256
    ]
}
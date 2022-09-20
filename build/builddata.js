module.exports = {
    baseUrl: "https://kaleko.ga",
    placeholders: {
        meta: `<meta charset="UTF-8">

    <link rel="icon" href="{file=/assets/icon@64.webp}">
    <link rel="apple-touch-icon" href="{file=/assets/icon@64.webp}">
    <link rel="stylesheet" href="{file=/styles/global.css}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:title" content="{title}">
    <meta property="og:description" content="My website where I put all my projects">
    <meta property="og:determiner" content="">
    <meta property="og:image" content="{file=/assets/icon@256.webp}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="./">
    <meta property="og:locale" content="en">

    <meta name="description" content="My website where I put all my projects">
    <meta name="keywords" content="Kale, Ko, Kale Ko, Kale-Ko, Kale_Ko, Coding, Development, Website, Github, Games, Snake, Projects">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{canonical}">
    <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
    <link rel="author" href="https://github.com/Kale-Ko/">
    <link rel="license" href="{baseUrl}/license.txt">

    <script src="{file=/scripts/service-worker-register.js}"></script>
    <script src="{file=/scripts/settings.js}"></script>`,

        offlineMeta: `<meta charset="UTF-8">
        <link rel="icon" href="{file=image/webp;/assets/icon-grey@64.webp}">
        <link rel="apple-touch-icon" href="{file=image/webp;/assets/icon-grey@64.webp}">
        <link rel="stylesheet" href="{file=/styles/style=offline.css}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <meta name="robots" content="noindex">
        <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
        <link rel="author" href="https://github.com/Kale-Ko/">
        <link rel="license" href="{baseUrl}/license.txt">`,

        nav: `<nav>
        <div class="dropdown"><img src="{file=/assets/menu@64.webp}" alt="Menu Button" width="64" height="64"></img><div class="dropdown-content"></div></div>
        <div><a href="{baseUrl}/" class="image"><img src="{file=/assets/icon@48.webp}" width="44" height="44" alt="logo"><p> Home</p></a></div>
        <div><a href="{baseUrl}/snake/">Snake</a></div>
        <div><a href="{baseUrl}/github/">Github</a></div>
        <div><a href="{baseUrl}/settings/">Settings</a></div>
    </nav>`,

        global: `<script src="{file=/scripts/analytics.js}"></script>
        <script src="{file=/scripts/navbar.js}"></script>
        <script src="{file=/scripts/backgroundfixer.js}"></script>`
    },
    replacements: [
        { from: "<html>", to: "<html lang=\"en\" prefix=\"og: https://ogp.me/ns#\">" },
        { from: "<title>", to: "<title>Kale Ko - " }
    ],
    moves: [
        { from: "./assets/redirects", to: "./_redirects" },
        { from: "./assets/headers", to: "./_headers" },
        { from: "./scripts/api.js", to: "./functions/api/[[path]].js" },
        { from: "./assets/.well-known", to: "./.well-known" },
        { from: "./assets/icon.ico", to: "./favicon.ico", copy: true },
        { from: "./scripts/service-worker.js", to: "./service-worker.js" },
        { from: "./assets/robots.txt", to: "./robots.txt" },
        { from: "./assets/sitemap.xml", to: "./sitemap.xml" },
        { from: "./LICENSE", to: "./license.txt", copy: true },
        { from: "./assets/files/publickey.gpg", to: "./publickey.gpg", copy: true }
    ],
    imageSizes: [
        16,
        32,
        48,
        64,
        96,
        128,
        256,
        512
    ]
}
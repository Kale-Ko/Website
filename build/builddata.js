module.exports = {
    placeholders: {
        meta: `<link rel="icon" href="{file=/assets/icon@64.png}">
    <link rel="apple-touch-icon" href="{file=/assets/icon@64.png}">
    {style=global}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta property="og:title" content="{title}">
    <meta property="og:description" content="My website where I put all my projects">
    <meta property="og:image" content="{file=/assets/icon@64.png}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="./">
    <meta property="og:locale" content="en">

    <meta name="description" content="My website where I put all my projects">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Coding, Development, Website, Github, Games, Snake, Projects">
    <meta name="robots" content="all">
    <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
    <link rel="author" href="https://github.com/Kale-Ko/">
    <link rel="license" href="https://kaleko.ga/license.txt">`,

        offlinemeta: `<link rel="icon" href="{file=image/png;/assets/icon-grey@64.png}">
    <link rel="apple-touch-icon" href="{file=image/png;/assets/icon-grey@64.png}">
    {style=offline}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="robots" content="noindex">
    <meta name="author" content="Kale Ko (https://github.com/Kale-Ko/)">
    <link rel="author" href="https://github.com/Kale-Ko/">
    <link rel="license" href="https://kaleko.ga/license.txt">`,

        nav: `<nav>
        <div class="dropdown"><img src="{file=/assets/menu@64.png}" alt="menu"></img><div class="dropdown-content"></div></div>
        <div><a href="/" class="image"><img src="{file=/assets/icon@48.png}" width="48" height="48" alt="logo"><p> Home</p></a></div>
        <div><a href="/snake">Snake</a></div>
        <div><a href="/github">Github</a></div>
        <div><a href="/settings">Settings</a></div>
    </nav>`,

        global: `{script=service-worker-register}
        {script=settings}
        {script=navbar}
        {script=backgroundfixer}`
    },
    replacements: [
        { from: "<html>", to: "<html lang=\"en\" prefix=\"og: https://ogp.me/ns#\">" },
        { from: "<title>", to: "<title>Kale Ko - " }
    ],
    moves: [
        { from: "./assets/redirects", to: "./_redirects" },
        { from: "./assets/icon.ico", to: "./favicon.ico" },
        { from: "./scripts/service-worker.js", to: "./service-worker.js" },
        { from: "./assets/robots.txt", to: "./robots.txt" },
        { from: "./assets/sitemap.xml", to: "./sitemap.xml" },
        { from: "./LICENSE", to: "./license.txt" },
        { from: "./assets/files/publickey.gpg", to: "./publickey.gpg" }
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
/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

module.exports = {
    placeholders: {
        meta: `<link rel="icon" href="{file=image/png;/assets/icon@64.png}">
    <link rel="apple-touch-icon" href="{file=image/png;/assets/icon@64.png}">
    {style=global}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="My new and improved website">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Coding, Github, Games, Projects">
    <meta name="robots" content="all">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/license.txt">
    <link rel="manifest" href="/assets/manifest.json">
    <meta name="theme-color" content="#ffbb00">`,

        offlinemeta: `<link rel="icon" href="{file=image/png;/assets/icon-grey@64.png}">
    <link rel="apple-touch-icon" href="{file=image/png;/assets/icon-grey@64.png}">
    {style=offline}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="Site offline">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Error, Offline">
    <meta name="robots" content="noindex">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/license.txt">
    <meta name="theme-color" content="#ffbb00">`,

        nav: `<nav>
        <div class="dropdown"><img src="{file=image/png;/assets/menu@64.png}" alt="menu"></img><div class="dropdown-content"></div></div>
        <div><a href="/" class="image"><img src="{file=image/png;/assets/icon@48.png}" width=48 height=48 alt="logo"><p> Home</p></a></div>
        <div><a href="/projects">Projects</a></div>
        <div><a href="/github">Github</a></div>
        <div><a href="/discord">Discord</a></div>
        <div><a href="/settings">Settings</a></div>
    </nav>`,

        global: `{script=service-worker-register}
        {script=navbar}
        {script=backgroundfixer}
        {script=settings}`
    },
    replacements: [
        { from: "<title>", to: "<title>Kale Ko - " }
    ],
    moves: [
        { from: "./assets/redirects", to: "./_redirects" },
        { from: "./assets/icon.ico", to: "./favicon.ico" },
        { from: "./scripts/service-worker.js", to: "./service-worker.js" },
        { from: "./assets/robots.txt", to: "./robots.txt" },
        { from: "./assets/sitemap.xml", to: "./sitemap.xml" },
        { from: "./LICENSE", to: "./license.txt" }
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
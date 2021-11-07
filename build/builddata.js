/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

module.exports = {
    placeholders: {
        meta: `<link rel="icon" href="/assets/icon@64.png">
    <link rel="apple-touch-icon" href="/assets/icon@64.png">
    {style=global}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="My new and improved website">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Coding, Github, Games, Projects">
    <meta name="robots" content="all">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/LICENSE">
    <link rel="manifest" href="/assets/manifest.json">
    <meta name="theme-color" content="#ffbb00">`,

        offlinemeta: `<link rel="icon" href="/assets/icon-grey@64.png">
    <link rel="apple-touch-icon" href="/assets/icon-grey@64.png">
    {style=offline}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="Site offline">
    <meta name="keywords" content="Kale, Ko, Kale-Ko, Error, Offline">
    <meta name="robots" content="noindex">
    <meta name="author" content="Kale Ko (https://kaleko.ga)">
    <link rel="author" href="https://kaleko.ga/">
    <link rel="license" href="/LICENSE">
    <meta name="theme-color" content="#ffbb00">`,

        nav: `<nav>
        <div><a href="/" class="image"><img src="/assets/icon@48.png"><p> Home</p></a></div>
        <div><a href="/projects">Projects</a></div>
        <div><a href="/redirect?title=Github&url=https://github.com/Kale-Ko">Github</a></div>
        <div><a href="/redirect?title=Discord&url=https://discord.com/invite/pTKcJjwJ3G">Discord</a></div>
        <div><a href="/settings">Settings</a></div>
    </nav>`,

        global: `{script=global}`
    },
    replacements: [
        { from: "<title>", to: "<title>Kale Ko - " }
    ],
    moves: [
        { from: "./scripts/service-worker.js", to: "./service-worker.js" },
        { from: "./assets/robots.txt", to: "./robots.txt" },
        { from: "./assets/sitemap.xml", to: "./sitemap.xml" }
    ]
}
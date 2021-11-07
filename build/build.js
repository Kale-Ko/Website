/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

const fs = require("fs")
const { exec } = require("child_process")

console.log("Started building pages")

if (process.argv.includes("--nodepend")) next()
else {
    console.log("Installing dependencies")

    exec("npm i trash-cli -g").on("exit", code => {
        exec("npm i html-minifier uglify-js clean-css minify-xml").on("exit", code => {
            console.log("Finished installing dependencies")

            next()
        })
    })
}

function next() {
    const builddata = require("./builddata.js")

    var pages = fs.readdirSync("./pages/")

    pages.forEach(page => {
        if (!page.endsWith(".html")) return

        var content = fs.readFileSync("./pages/" + page).toString()

        Object.keys(builddata.placeholders).forEach(key => { content = content.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key]) })
        builddata.replacements.forEach(replacement => { content = content.replace(replacement.from, replacement.to) })
        while (content.includes("{script=")) {
            var start = content.indexOf("{script=")
            var end = content.indexOf("}", content.indexOf("{script=")) + 1
            content = content.replace(content.substring(start, end), "<script>\n        " + fs.readFileSync("./scripts/" + content.substring(start + 8, end - 1) + ".js").toString().replace(/\n/g, "\n         ") + "\n    </script>")
        }
        while (content.includes("{module=")) {
            var start = content.indexOf("{module=")
            var end = content.indexOf("}", content.indexOf("{module=")) + 1
            content = content.replace(content.substring(start, end), '<script type="module">\n        ' + fs.readFileSync("./scripts/" + content.substring(start + 8, end - 1) + ".js").toString().replace(/\n/g, "\n         ") + "\n    </script>")
        }
        while (content.includes("{style=")) {
            var start = content.indexOf("{style=")
            var end = content.indexOf("}", content.indexOf("{style=")) + 1
            content = content.replace(content.substring(start, end), "<style>\n        " + fs.readFileSync("./styles/" + content.substring(start + 7, end - 1) + ".css").toString().replace(/\n/g, "\n         ") + "\n    </style>")
        }

        if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
        else {
            if (!fs.existsSync("./" + page.replace(".html", ""))) fs.mkdirSync("./" + page.replace(".html", ""))

            fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
        }
    })

    builddata.moves.forEach(move => { fs.renameSync(move.from, move.to) })

    const minify_html = require("html-minifier").minify
    const minify_js = require("uglify-js").minify
    const minify_css = require("clean-css")
    const minify_xml = require("minify-xml").minify

    function scan(dir, name) {
        var files = fs.readdirSync(dir)

        files.forEach(file => {
            if (file == "pages" || file == "styles" || file == "LICENSE" || file == "build" || file == "package-lock.json" || file == "node_modules") return

            if (fs.statSync(dir + file).isDirectory()) {
                if (dir == "fonts") return

                scan(dir + file + "/", name + "/" + file)
            }
            else {
                var contents = fs.readFileSync(dir + file).toString()

                if (file.endsWith(".html")) {
                    contents = "<!--\n    MIT License\n    Copyright (c) 2021 Kale Ko\n    See https://kaleko.ga/license.txt\n-->\n" + minify_html(contents, {
                        collapseBooleanAttributes: true, collapseInlineTagWhitespace: true, collapseWhitespace: true, quoteCharacter: '"', removeAttributeQuotes: true, removeComments: true,
                        minifyJS: text => minify_js(text).code,
                        minifyCSS: text => new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: ["local"] }).minify(text).styles
                    });
                }
                else if (file.endsWith(".js")) contents = "/**\n    MIT License\n    Copyright (c) 2021 Kale Ko\n    See https://kaleko.ga/license.txt\n**/\n" + minify_js(contents, { output: { beautify: false } }).code
                else if (file.endsWith(".css")) contents = "/**\n    MIT License\n    Copyright (c) 2021 Kale Ko\n    See https://kaleko.ga/license.txt\n**/\n" + new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: ["local"] }).minify(contents).styles
                else if (file.endsWith(".xml")) contents = (file.includes("sitemap.xml") ? minify_xml(contents) : minify_xml(contents).replace("?>", "?>\n<!--\n    MIT License\n    Copyright (c) 2021 Kale Ko\n    See https://kaleko.ga/license.txt\n-->\n"))
                else if (file.endsWith(".json")) contents = JSON.stringify(JSON.parse(contents))
                else return

                fs.writeFileSync(dir + file, contents)
            }
        })
    }
    scan("./", "/")

    if (!process.argv.includes("--nodepend")) exec("trash pages/** styles/** package.json package-lock.json node_modules/** build/**")
    else exec("trash pages/** styles/** package.json build/**")
}

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
        exec("npm i sharp html-minifier uglify-js clean-css minify-xml").on("exit", code => {
            console.log("Finished installing dependencies")

            next()
        })
    })
}

function next() {
    const builddata = require("./builddata.js")

    const sharp = require("sharp")

    const minify_html = require("html-minifier").minify
    const minify_js = require("uglify-js").minify
    const minify_css = require("clean-css")
    const minify_xml = require("minify-xml").minify

    builddata.moves.forEach(move => { fs.renameSync(move.from, move.to) })

    var pages = fs.readdirSync("./pages/")

    pages.forEach(page => {
        if (!page.endsWith(".html")) return

        var content = fs.readFileSync("./pages/" + page).toString()

        if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
        else {
            if (!fs.existsSync("./" + page.replace(".html", ""))) fs.mkdirSync("./" + page.replace(".html", ""))

            fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
        }
    })

    function resizeImages(dir, name) {
        var files = fs.readdirSync(dir)

        files.forEach(file => {
            if (fs.statSync(dir + file).isDirectory()) {
                resizeImages(dir + file + "/", name + "/" + file)
            }
            else {
                if (file.endsWith(".png")) {
                    var image = fs.readFileSync(dir + file)

                    builddata.imageSizes.forEach(size => {
                        sharp(image)
                            .png()
                            .resize(size, size)
                            .toFile(dir + file.replace(".png", "@" + size + ".png"))
                    })
                } else if (file.endsWith(".jpg")) {
                    var image = fs.readFileSync(dir + file)

                    builddata.imageSizes.forEach(size => {
                        sharp(image)
                            .jpeg()
                            .resize(size, size)
                            .toFile(dir + file.replace(".jpg", "@" + size + ".jpg"))
                    })
                } else if (file.endsWith(".jpeg")) {
                    var image = fs.readFileSync(dir + file)

                    builddata.imageSizes.forEach(size => {
                        sharp(image)
                            .jpeg()
                            .resize(size, size)
                            .toFile(dir + file.replace(".jpeg", "@" + size + ".jpeg"))
                    })
                } else return
            }
        })
    }
    resizeImages("./assets/", "/")

    function scan(dir, name) {
        var files = fs.readdirSync(dir)

        files.forEach(file => {
            if (file == "LICENSE" || file == "build" || file == "package-lock.json" || file == "node_modules") return

            if (fs.statSync(dir + file).isDirectory()) {
                if (dir == "fonts") return

                scan(dir + file + "/", name + "/" + file)
            }
            else {
                var contents = fs.readFileSync(dir + file).toString()

                Object.keys(builddata.placeholders).forEach(key => { contents = contents.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key]) })
                builddata.replacements.forEach(replacement => { contents = contents.replace(replacement.from, replacement.to) })
                while (contents.includes("{script=")) {
                    var start = contents.indexOf("{script=")
                    var end = contents.indexOf("}", contents.indexOf("{script=")) + 1
                    contents = contents.replace(contents.substring(start, end), "<script>\n        " + fs.readFileSync("./scripts/" + contents.substring(start + 8, end - 1) + ".js").toString().replace(/\n/g, "\n         ") + "\n    </script>")
                }
                while (contents.includes("{module=")) {
                    var start = contents.indexOf("{module=")
                    var end = contents.indexOf("}", contents.indexOf("{module=")) + 1
                    contents = contents.replace(contents.substring(start, end), '<script type="module">\n        ' + fs.readFileSync("./scripts/" + contents.substring(start + 8, end - 1) + ".js").toString().replace(/\n/g, "\n         ") + "\n    </script>")
                }
                while (contents.includes("{style=")) {
                    var start = contents.indexOf("{style=")
                    var end = contents.indexOf("}", contents.indexOf("{style=")) + 1
                    contents = contents.replace(contents.substring(start, end), "<style>\n        " + fs.readFileSync("./styles/" + contents.substring(start + 7, end - 1) + ".css").toString().replace(/\n/g, "\n         ") + "\n    </style>")
                }
                while (contents.includes("{file=")) {
                    var start = contents.indexOf("{file=")
                    var end = contents.indexOf("}", contents.indexOf("{file=")) + 1
                    if (fs.existsSync("." + contents.substring(start + 6, end - 1).split(";")[1])) contents = contents.replace(contents.substring(start, end), "data:" + contents.substring(start + 6, end - 1).split(";")[0] + ";base64," + fs.readFileSync("." + contents.substring(start + 6, end - 1).split(";")[1]).toString("base64"))
                }

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

    if (!process.argv.includes("--nodepend")) exec("trash pages/** scripts/** styles/** LICENSE package.json package-lock.json node_modules/** build/**")
    else exec("trash pages/** scripts/** styles/** LICENSE package.json build/**")
}
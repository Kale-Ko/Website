const fs = require("fs")
const { exec } = require("child_process")

if (process.argv.includes("--nodepend")) {
    next()
} else {
    exec("npm install sharp image-size html-minifier uglify-js clean-css minify-xml").on("exit", () => {
        next()
    })
}

function next() {
    const builddata = require("./builddata.js")

    const sharp = require("sharp")
    const imageSize = require("image-size")

    const minify_html = require("html-minifier").minify
    const minify_js = require("uglify-js").minify
    const minify_css = require("clean-css")
    const minify_xml = require("minify-xml").minify

    for (move in builddata.moves) {
        if (fs.statSync(move.from).isFile()) {
            if (!fs.existsSync(move.to.substring(0, move.to.lastIndexOf("/")))) {
                fs.mkdirSync(move.to.substring(0, move.to.lastIndexOf("/")), { recursive: true })
            }

            if (move.copy == true) {
                fs.copyFileSync(move.from, move.to)
            } else {
                fs.renameSync(move.from, move.to)
            }
        } else {
            if (!fs.existsSync(move.to)) {
                fs.mkdirSync(move.to, { recursive: true })
            }

            for (file in fs.readdirSync(move.from)) {
                if (move.copy == true) {
                    fs.copyFileSync(move.from + "/" + file, move.to + "/" + file)
                } else {
                    fs.renameSync(move.from + "/" + file, move.to + "/" + file)
                }
            }
        }
    }

    for (page in fs.readdirSync("./pages/")) {
        if (page.endsWith(".html")) {
            var content = fs.readFileSync("./pages/" + page).toString()

            if (page == "index.html" || page == "404.html") {
                fs.writeFileSync("./" + page, content)
            } else {
                if (!fs.existsSync("./" + page.replace(".html", ""))) {
                    fs.mkdirSync("./" + page.replace(".html", ""))
                }

                fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
            }
        }
    }

    function resizeImages(dir) {
        for (file in fs.readdirSync(dir)) {
            if (fs.statSync(dir + file).isDirectory()) {
                resizeImages(dir + file + "/")
            } else {
                if (file.endsWith(".png")) {
                    var image = fs.readFileSync(dir + file)
                    var size = imageSize(image)

                    if (size.width == size.height) {
                        sharp(image).png().toFile(dir + file.replace(".png", "@" + size.width + ".png"))

                        for (currentSize in builddata.imageSizes) {
                            sharp(image).png().resize(currentsize, currentsize).toFile(dir + file.replace(".png", "@" + currentsize + ".png"))
                        }
                    }
                } else if (file.endsWith(".jpg")) {
                    var image = fs.readFileSync(dir + file)
                    var size = imageSize(image)

                    if (size.width == size.height) {
                        sharp(image).jpeg().toFile(dir + file.replace(".jpg", "@" + size.width + ".jpg"))

                        for (currentsize in builddata.imageSizes) {
                            sharp(image).jpeg().resize(currentsize, currentsize).toFile(dir + file.replace(".jpg", "@" + currentsize + ".jpg"))
                        }
                    }
                } else if (file.endsWith(".jpeg")) {
                    var image = fs.readFileSync(dir + file)
                    var size = imageSize(image)

                    if (size.width == size.height) {
                        sharp(image).jpeg().toFile(dir + file.replace(".jpeg", "@" + size.width + ".jpeg"))

                        for (currentsize in builddata.imageSizes) {
                            sharp(image).jpeg().resize(currentsize, currentsize).toFile(dir + file.replace(".jpeg", "@" + currentsize + ".jpeg"))
                        }
                    }
                }
            }
        }
    }
    resizeImages("./assets/", "/")

    function scan(dir) {
        for (file in fs.readdirSync(dir)) {
            if (file != "build" && file != ".git" && file != ".gitignore" && file != "package.json" && file != "package-lock.json" && file != "node_modules" && file != ".deepsource.toml") {
                if (fs.statSync(dir + file).isDirectory()) {
                    scan(dir + file + "/")
                } else {
                    var contents = fs.readFileSync(dir + file).toString()

                    for (key in Object.keys(builddata.placeholders)) {
                        contents = contents.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key])
                    }

                    for (replacement in builddata.replacements) {
                        contents = contents.replace(replacement.from, replacement.to)
                    }

                    while (contents.includes("{file=")) {
                        var start = contents.indexOf("{file=")
                        var end = contents.indexOf("}", contents.indexOf("{file=")) + 1
                        if (contents.substring(start + 6, end - 1).includes(";")) {
                            if (fs.existsSync("." + contents.substring(start + 6, end - 1).split(";")[1])) {
                                contents = contents.replace(contents.substring(start, end), "data:" + contents.substring(start + 6, end - 1).split(";")[0] + ";base64," + fs.readFileSync("." + contents.substring(start + 6, end - 1).split(";")[1]).toString("base64"))
                            } else {
                                contents = contents.replace(contents.substring(start, end), "data:text/plain,base64;" + "404 File Not Found".toString("base64"))
                            }
                        } else {
                            contents = contents.replace(contents.substring(start, end), contents.substring(start + 6, end - 1))
                        }
                    }

                    if (file.endsWith(".html")) {
                        contents = contents.replace("{title}", contents.substring(contents.indexOf("<title>") + 7, contents.indexOf("</title>")))

                        contents = minify_html(contents, {
                            collapseBooleanAttributes: true, collapseInlineTagWhitespace: true, collapseWhitespace: true, quoteCharacter: '"', removeAttributeQuotes: true, removeComments: true,
                            minifyJS: text => minify_js(text).code,
                            minifyCSS: text => new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: ["local"] }).minify(text).styles
                        });
                    } else if (file.endsWith(".js")) {
                        contents = minify_js(contents, { output: { beautify: false } }).code
                    } else if (file.endsWith(".css")) {
                        contents = new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: ["local"] }).minify(contents).styles
                    } else if (file.endsWith(".xml")) {
                        contents = minify_xml(contents)
                    } else if (file.endsWith(".json")) {
                        contents = JSON.stringify(JSON.parse(contents))
                    } else {
                        return
                    }

                    fs.writeFileSync(dir + file, contents)
                }
            }
        }
    }
    scan("./", "/")

    if (!process.argv.includes("--nodepend")) {
        fs.rmSync("pages", { recursive: true })
        fs.rmSync("package.json")
        fs.rmSync("package-lock.json")
        fs.rmSync("node_modules", { recursive: true })
        fs.rmSync("build", { recursive: true })
    } else {
        fs.rmSync("pages", { recursive: true })
        fs.rmSync("build", { recursive: true })
    }
}
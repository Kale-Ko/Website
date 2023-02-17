const fs = require("fs")
const { exec } = require("child_process")

var noCache = false

if (process.argv.indexOf("--nocache")) {
    noCache = true
}

if (process.argv.includes("--nodepend")) {
    next()
} else {
    exec("npm install sharp image-size html-minifier uglify-js clean-css minify-xml --no-save").on("exit", () => {
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

    for (var move of builddata.moves) {
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

            for (var file of fs.readdirSync(move.from)) {
                if (move.copy == true) {
                    fs.copyFileSync(move.from + "/" + file, move.to + "/" + file)
                } else {
                    fs.renameSync(move.from + "/" + file, move.to + "/" + file)
                }
            }
        }
    }

    function scanPages(dir) {
        for (var page of fs.readdirSync(dir)) {
            if (fs.statSync(dir + "/" + page).isFile()) {
                if (page.endsWith(".html")) {
                    var content = fs.readFileSync(dir + "/" + page).toString()

                    if (page == "index.html" || page == "404.html") {
                        if (!fs.existsSync(dir.replace("./pages", "."))) {
                            fs.mkdirSync(dir.replace("./pages", "."), { recursive: true })
                        }

                        fs.writeFileSync(dir.replace("./pages", ".") + "/" + page, content)
                    } else {
                        if (!fs.existsSync(dir.replace("./pages", ".") + "/" + page.replace(".html", ""))) {
                            fs.mkdirSync(dir.replace("./pages", ".") + "/" + page.replace(".html", ""), { recursive: true })
                        }

                        fs.writeFileSync(dir.replace("./pages", ".") + "/" + page.replace(".html", "") + "/index.html", content)
                    }
                }
            } else {
                scanPages(dir + "/" + page)
            }
        }
    }
    scanPages("./pages")

    function resizeImages(dir) {
        for (var file of fs.readdirSync(dir)) {
            if (fs.statSync(dir + file).isDirectory()) {
                resizeImages(dir + file + "/")
            } else if (!file.includes("@")) {
                var image = fs.readFileSync(dir + file)
                var size = imageSize(image)

                if (size.width == size.height) {
                    if (file.endsWith(".png")) {
                        sharp(image).png({ quality: 80, effort: 8, compressionLevel: 8 }).toFile(dir + file.replace(".png", "@" + size.width + ".png").replace(".jpg", "@" + size.width + ".png").replace(".jpeg", "@" + size.width + ".png").replace(".webp", "@" + size.width + ".png"))

                        for (var currentSize of builddata.imageSizes) {
                            sharp(image).png({ quality: 80, effort: 8, compressionLevel: 8 }).resize(currentSize, currentSize).toFile(dir + file.replace(".png", "@" + currentSize + ".png").replace(".jpg", "@" + currentSize + ".png").replace(".jpeg", "@" + currentSize + ".png").replace(".webp", "@" + currentSize + ".png"))
                        }
                    } else if (file.endsWith(".jpg")) {
                        sharp(image).jpeg({ quality: 100 }).toFile(dir + file.replace(".jpg", "@" + size.width + ".jpg").replace(".png", "@" + size.width + ".jpg").replace(".jpeg", "@" + size.width + ".jpg").replace(".webp", "@" + size.width + ".jpg"))

                        for (var currentSize of builddata.imageSizes) {
                            sharp(image).jpeg({ quality: 100 }).resize(currentSize, currentSize).toFile(dir + file.replace(".jpg", "@" + currentSize + ".jpg").replace(".png", "@" + currentSize + ".jpg").replace(".jpeg", "@" + currentSize + ".jpg").replace(".webp", "@" + currentSize + ".jpg"))
                        }
                    } else if (file.endsWith(".jpeg")) {
                        sharp(image).jpeg({ quality: 100 }).toFile(dir + file.replace(".jpeg", "@" + size.width + ".jpeg").replace(".png", "@" + size.width + ".jpeg").replace(".jpg", "@" + size.width + ".jpeg").replace(".webp", "@" + size.width + ".jpeg"))

                        for (var currentSize of builddata.imageSizes) {
                            sharp(image).jpeg({ quality: 100 }).resize(currentSize, currentSize).toFile(dir + file.replace(".jpeg", "@" + currentSize + ".jpeg").replace(".png", "@" + currentSize + ".jpeg").replace(".jpg", "@" + currentSize + ".jpeg").replace(".webp", "@" + currentSize + ".jpeg"))
                        }
                    } else if (file.endsWith(".webp")) {
                        sharp(image).webp({ quality: 60, alphaQuality: 0, effort: 6 }).toFile(dir + file.replace(".webp", "@" + size.width + ".webp").replace(".png", "@" + size.width + ".webp").replace(".jpg", "@" + size.width + ".webp").replace(".jpeg", "@" + size.width + ".webp"))

                        for (var currentSize of builddata.imageSizes) {
                            sharp(image).webp({ quality: 60, alphaQuality: 0, effort: 6 }).resize(currentSize, currentSize).toFile(dir + file.replace(".webp", "@" + currentSize + ".webp").replace(".png", "@" + currentSize + ".webp").replace(".jpg", "@" + currentSize + ".webp").replace(".jpeg", "@" + currentSize + ".webp"))
                        }
                    }
                }
            }
        }
    }
    resizeImages("./assets/", "/")

    async function scan(dir) {
        for (var file of fs.readdirSync(dir)) {
            if (file != "build" && file != ".git" && file != ".gitignore" && file != "package.json" && file != "package-lock.json" && file != "node_modules" && file != ".deepsource.toml") {
                if (fs.statSync(dir + file).isDirectory()) {
                    scan(dir + file + "/")
                } else {
                    var contents = fs.readFileSync(dir + file).toString()

                    for (var key of Object.keys(builddata.placeholders)) {
                        contents = contents.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key])
                    }

                    for (var replacement of builddata.replacements) {
                        contents = contents.replace(replacement.from, replacement.to)
                    }

                    contents = contents.replace(/{baseUrl}/g, builddata.baseUrl)

                    var date = new Date()
                    date.setSeconds(0, 0)
                    contents = contents.replace(/{buildDate}/g, date.toUTCString())

                    while (contents.includes("{file=")) {
                        var start = contents.indexOf("{file=")
                        var end = contents.indexOf("}", contents.indexOf("{file=")) + 1
                        if (contents.substring(start + 6, end - 1).startsWith("http") && contents.substring(start + 6, end - 1).includes(";")) {
                            var data

                            if (!noCache && fs.existsSync("../build/cache/" + btoa(contents.substring(start + 6, end - 1).split(";")[0]))) {
                                data = fs.readFileSync("../build/cache/" + btoa(contents.substring(start + 6, end - 1).split(";")[0]), { encoding: "base64" })
                            } else {
                                data = Buffer.from(await fetch(contents.substring(start + 6, end - 1).split(";")[0]).then(res => res.arrayBuffer()))

                                if (!noCache) {
                                    if (!fs.existsSync("../build/cache")) {
                                        fs.mkdirSync("../build/cache")
                                    }

                                    fs.writeFileSync("../build/cache/" + btoa(contents.substring(start + 6, end - 1).split(";")[0]), data, { encoding: "base64" })
                                }
                            }

                            fs.mkdirSync("." + contents.substring(start + 6, end - 1).split(";")[1].split("/").slice(0, contents.substring(start + 6, end - 1).split(";")[1].split("/").length - 1).join("/"), { recursive: true })
                            fs.writeFileSync("." + contents.substring(start + 6, end - 1).split(";")[1], data, { encoding: "base64" })

                            contents = contents.replace(contents.substring(start, end), contents.substring(start + 6, end - 1).split(";")[1])
                        } else if (contents.substring(start + 6, end - 1).includes(";")) {
                            if (fs.existsSync("." + contents.substring(start + 6, end - 1).split(";")[1])) {
                                contents = contents.replace(contents.substring(start, end), "data:" + contents.substring(start + 6, end - 1).split(";")[0] + ";base64," + fs.readFileSync("." + contents.substring(start + 6, end - 1).split(";")[1]).toString("base64"))
                            } else {
                                contents = contents.replace(contents.substring(start, end), "data:text/plain," + "404")
                            }
                        } else {
                            contents = contents.replace(contents.substring(start, end), contents.substring(start + 6, end - 1))
                        }
                    }

                    if ((file.endsWith(".html") || file.endsWith(".htm")) && !dir.includes("pages")) {
                        contents = contents.replace(/{title}/g, contents.substring(contents.indexOf("<title>") + 7, contents.indexOf("</title>"))).replace(/{canonical}/g, (builddata.baseUrl + dir.replace("./", "/") + file.replace("index", "").replace(".html", "") + "/").replace(/\/\//g, "/"))
                        contents = contents.replace(/([a-zA-Z]) \<([^=])(.*)\>/g, "$1&nbsp;<$2$3>").replace(/\<(.*)([^=])\> ([a-zA-Z])/g, "<$1$2>&nbsp;$3")

                        contents = minify_html(contents, {
                            collapseBooleanAttributes: true, collapseInlineTagWhitespace: true, collapseWhitespace: true, quoteCharacter: '"', removeAttributeQuotes: false, removeComments: true,
                            minifyJS: text => minify_js(text).code,
                            minifyCSS: text => new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: [] }).minify(text).styles
                        });
                    } else if (file.endsWith(".js") || file.endsWith(".mjs")) {
                        contents = minify_js(contents, { output: { beautify: false } }).code
                    } else if (file.endsWith(".css")) {
                        contents = new minify_css({ level: { 2: { all: true, roundingPrecision: false, removeUnusedAtRules: false } }, inline: [] }).minify(contents).styles
                    } else if (file.endsWith(".xml")) {
                        contents = minify_xml(contents)
                    } else if (file.endsWith(".json") || file.endsWith(".json5")) {
                        contents = JSON.stringify(JSON.parse(contents))
                    }

                    fs.writeFileSync(dir + file, contents)
                }
            }
        }
    }
    scan("./", "/")

    if (!process.argv.includes("--nodepend")) {
        if (fs.existsSync("pages")) fs.rmSync("pages", { recursive: true })
        if (fs.existsSync("package.json")) fs.rmSync("package.json")
        if (fs.existsSync("package-lock.json")) fs.rmSync("package-lock.json")
        if (fs.existsSync("package.json")) fs.rmSync("node_modules", { recursive: true })
        if (fs.existsSync("build")) fs.rmSync("build", { recursive: true })
    } else {
        if (fs.existsSync("pages")) fs.rmSync("pages", { recursive: true })
        if (fs.existsSync("build")) fs.rmSync("build", { recursive: true })
    }
}
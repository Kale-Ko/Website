const fs = require("fs")
const { exec } = require("child_process")

console.log("Started building pages")

exec("npm i trash-cli -g").on("exit", code => {
    const builddata = require("./builddata.js")

    var pages = fs.readdirSync("./pages/")

    pages.forEach(page => {
        if (!page.endsWith(".html")) return

        var content = fs.readFileSync("./pages/" + page).toString()

        Object.keys(builddata.placeholders).forEach(key => { content = content.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key]) })
        builddata.replacements.forEach(replacement => { content = content.replace(replacement.from, replacement.to) })
        var start = content.indexOf("{style=")
        var end = content.indexOf("}", content.indexOf("{style=")) + 1
        content = content.replace(content.substring(start, end), "<style>\n        " + fs.readFileSync("./styles/" + content.substring(start + 7, end - 1) + ".css").toString().replace(/\n/g, "\n         ") + "\n    </style>")

        if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
        else {
            if (!fs.existsSync("./" + page.replace(".html", ""))) fs.mkdirSync("./" + page.replace(".html", ""))

            fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
        }
    })

    builddata.moves.forEach(move => { fs.renameSync(move.from, move.to) })

    exec("npm i html-minifier uglify-js css-minify minify-xml").on("exit", code => {
        const minify_html = require('html-minifier').minify
        const minify_js = require("uglify-js").minify
        const minify_css = require("css-minify")
        const minify_xml = require("minify-xml").minify

        function scan(dir, name) {
            var files = fs.readdirSync(dir)

            files.forEach(async file => {
                if (file == "pages" || file == "style" || file == "LICENSE" || file == "build" || file == "package-lock.json" || file == "node_modules") return

                if (fs.statSync(dir + file).isDirectory()) {
                    if (file == "fonts") return

                    scan(dir + file + "/", name + "/" + file)
                }
                else {
                    var contents = fs.readFileSync(dir + file).toString()

                    if (file.endsWith(".html")) {
                        contents = minify_html(contents, {
                            collapseBooleanAttributes: true, collapseInlineTagWhitespace: true, collapseWhitespace: true, quoteCharacter: '"', removeAttributeQuotes: true, removeComments: true,
                            minifyJS: text => { return minify_js(text).code }, minifyCSS: true
                        });
                    }
                    else if (file.endsWith(".js")) contents = minify_js(contents).code
                    else if (file.endsWith(".css")) contents = await minify_css(contents)
                    else if (file.endsWith(".xml")) contents = minify_xml(contents)
                    else if (file.endsWith(".json")) contents = JSON.stringify(JSON.parse(contents))
                    else return

                    fs.writeFileSync(dir + file, contents)
                }
            })
        }
        scan("./", "/")

        exec("trash pages/** style/** LICENSE package.json package-lock.json node_modules/** build/**")
    })
})
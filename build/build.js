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

    exec("trash pages/** LICENSE", (err, stdout, stderr) => {
        if (stdout) console.log(stdout)
        if (stderr) console.log(stderr)
    })
})
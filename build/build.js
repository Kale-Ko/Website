const fs = require("fs")
const builddata = require("./builddata.js")

console.log("Started building pages")

var pages = fs.readdirSync("./pages/")

pages.forEach(page => {
    if (!page.endsWith(".html")) return

    var content = fs.readFileSync("./pages/" + page).toString()

    Object.keys(builddata.placeholders).forEach(key => { content = content.replace(new RegExp("{" + key + "}", "g"), builddata.placeholders[key]) })
    builddata.replacements.forEach(replacement => { content = content.replace(replacement.from, replacement.to) })

    if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
    else {
        if (!fs.existsSync("./" + page.replace(".html", ""))) fs.mkdirSync("./" + page.replace(".html", ""))

        fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
    }
})

builddata.moves.forEach(move => { fs.renameSync(move.from, move.to) })
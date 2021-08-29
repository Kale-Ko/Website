const fs = require("fs")
const replacements = require("./replacements.js")

console.log("Started building pages")

var pages = fs.readdirSync("./pages/")

pages.forEach(page => {
    if (!page.endsWith(".html")) return

    var content = fs.readFileSync("./pages/" + page).toString()

    Object.keys(replacements.placeholders).forEach(key => { content = content.replace(new RegExp("{" + key + "}", "g"), replacements.placeholders[key]) })

    replacements.replacements.forEach(replacement => { content = content.replace(replacement.from, replacement.to) })

    if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
    else {
        if (!fs.existsSync("./" + page.replace(".html", ""))) fs.mkdirSync("./" + page.replace(".html", ""))

        fs.writeFileSync("./" + page.replace(".html", "") + "/index.html", content)
    }
})
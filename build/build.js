const fs = require("fs")
const placeholders = require("./placeholders.js").placeholders

console.log("Started building pages")

var pages = fs.readdirSync("./")

pages.forEach(page => {
    if (!page.endsWith(".html")) return

    var content = fs.readFileSync("./" + page).toString()

    for (var key in Object.keys(placeholders)) content = content.replace(new RegExp("{" + key + "}", "g"), placeholders[key])

    fs.writeFileSync("./" + page, content)
})
const fs = require("fs")
const placeholders = require("./placeholders.js")

console.log("Started Building")

var pages = fs.readdirSync("./")

console.log(pages)

pages.forEach(page => {
    if (!page.endsWith(".html")) return

    var content = fs.readFileSync("./" + page).toString()

    console.log(page)

    for (var key in Object.keys(placeholders)) {
        console.log("{" + key + "}", "g")

        content = content.replace(new RegExp("{" + key + "}", "g"), placeholders[key])
    }

    fs.writeFileSync("./" + page, content)
})
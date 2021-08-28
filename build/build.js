const fs = require("fs")
const placeholders = require("./placeholders.js").placeholders

console.log("Started building pages")

var pages = fs.readdirSync("./pages/")

pages.forEach(page => {
    if (!page.endsWith(".html")) return

    var content = fs.readFileSync("./pages/" + page).toString()

    Object.keys(placeholders).forEach(key => {
        content = content.replace(new RegExp("{" + key + "}", "g"), placeholders[key])
    })

    if (page == "index.html" || page == "404.html") fs.writeFileSync("./" + page, content)
    else fs.writeFileSync("./" + page.replace(".html", "") + "/index.html")
})
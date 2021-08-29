const fs = require("fs")
const { exec } = require("child_process")
const http = require("http")

console.log("Cloning files")

if (!fs.existsSync("./test")) fs.mkdirSync("./test")

function scan(dir, name) {
    var files = fs.readdirSync(dir)

    files.forEach(file => {
        if (file == ".git" || file == ".gitignore" || file == "package-lock.json" || file == "node_modules" || file == "test") return

        if (fs.statSync(dir + file).isDirectory()) {
            if (!fs.existsSync("./test/" + dir.replace("./", "") + file)) fs.mkdirSync("./test/" + dir.replace("./", "") + file)

            scan(dir + file + "/", name + "/" + file)
        }
        else fs.copyFileSync(dir + file, "./test" + name + "/" + file)
    })
}
scan("./", "/")

console.log("Building pages")

exec("cd " + "./test/ && node build/build.js", (err, stdout, stderr) => {
    if (stdout && stdout.toString() != "Started building pages\n") console.log(stdout)
    if (stderr) console.log(stderr)
})

console.log("Starting server")

const server = http.createServer((req, res) => {
    if (req.url.endsWith("/")) req.url += "index.html"

    res.end(fs.existsSync("./test" + req.url) ? fs.readFileSync("./test" + req.url) : fs.readFileSync("./test/404.html"))
})

server.listen(80, () => { console.log("Http server started on 80") })
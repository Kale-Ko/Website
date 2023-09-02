const fs = require("fs")
const childProcess = require("child_process")
const http = require("http")
const WebSocketServer = require("websocket").server

console.log("Installing dependencies")

if (!fs.existsSync("./test")) {
    fs.mkdirSync("./test")
}

childProcess.exec("cd ./test && npm install sharp image-size html-minifier uglify-js clean-css pretty-data").on("exit", () => {
    console.log("Finished installing dependencies")

    var building = false
    var wsServer

    function build() {
        if (building) {
            return
        }

        building = true

        console.log("Removing old files")

        for (var file of fs.readdirSync("./test")) {
            if (file != ".git" && file != ".gitignore" && file != "package.json" && file != "package-lock.json" && file != "node_modules" && file != ".deepsource.toml") {
                fs.rmSync("./test/" + file, { recursive: true })
            }
        }

        console.log("Cloning files")

        function scan(dir) {
            for (var file of fs.readdirSync(dir)) {
                if (file != ".git" && file != ".gitignore" && file != "package.json" && file != "package-lock.json" && file != "node_modules" && file != ".deepsource.toml" && file != "test" && file != "cache") {
                    if (fs.statSync(dir + file).isDirectory()) {
                        if (!fs.existsSync("./test/" + dir.replace("./", "") + file)) {
                            fs.mkdirSync("./test/" + dir.replace("./", "") + file)
                        }

                        scan(dir + file + "/")
                    } else {
                        fs.copyFileSync(dir + file, "./test/" + dir.replace("./", "") + "/" + file)
                    }
                }
            }
        }
        scan("./")

        console.log("Building pages")

        var buildProcess = childProcess.spawn("node", ["build/build.js", "--nodepend", "--cache"], { cwd: "./test" })

        buildProcess.stdout.on("data", (message) => {
            message = message.toString()

            while (message.endsWith(" ") || message.endsWith("\n")) {
                message = message.substring(0, message.length - 1)
            }

            console.log(message)
        })

        buildProcess.stderr.on("data", (message) => {
            message = message.toString()

            while (message.endsWith(" ") || message.endsWith("\n")) {
                message = message.substring(0, message.length - 1)
            }

            console.error(message)
        })

        buildProcess.on("exit", () => {
            console.log("Finished building")

            building = false

            wsServer.broadcast("reload")
        })
    }
    build()

    console.log("Starting server")

    const server = http.createServer((req, res) => {
        if (building) {
            res.statusCode = 200
            res.statusMessage = "Ok"
            res.setHeader("Content-Type", "text/html; charset=utf-8")
            return res.end("<html><head><title>Building site..</title></head><body>Building site..</body></html>".replace("</body>", '<script>var socket=new WebSocket(window.location.protocol.replace("http", "ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))
        }

        req.url = new URL("https://localhost" + req.url).pathname

        if (req.url.endsWith("/")) {
            req.url = req.url.slice(0, req.url.length - 1)
        }

        req.url = req.url.replace(/%20/, " ")

        var charset = "; charset=utf-8"
        var typeMappings = {
            "html": "text/html" + charset,
            "js": "text/javascript" + charset,
            "json": "application/json" + charset,
            "xml": "application/xml" + charset,
            "css": "text/css" + charset,
            "woff": "font/woff",
            "woff2": "font/woff2",
            "png": "image/png",
            "jpg": "image/jpeg",
            "webp": "image/webp",
            "gif": "image/gif",
            "ico": "image/icon",
            "svg": "image/svg+xml" + charset,
            "pdf": "application/pdf",
            "mp3": "audio/mpeg",
            "weba": "audio/weba",
            "mp4": "video/mp4",
            "webm": "video/webm",
            "zip": "application/zip",
            "txt": "text/plain" + charset,
            "anything": "application/octet-stream"
        }

        if (req.url.startsWith("/api")) {
            fetch("https://www.kaleko.dev" + req.url).then(res2 => res2.text()).then(data => {
                res.statusCode = 200
                res.statusMessage = "Ok"
                res.setHeader("Content-Type", typeMappings["json"])
                res.end(data)
            })
        } else if (fs.existsSync("./test" + req.url) && !fs.statSync("./test" + req.url).isDirectory()) {
            res.statusCode = 200
            res.statusMessage = "Ok"
            for (var key of Object.keys(typeMappings)) {
                if (req.url.endsWith("." + key)) {
                    res.setHeader("Content-Type", typeMappings[key])
                }
            }

            if (res.getHeader("Content-Type") == typeMappings["html"]) {
                res.end(fs.readFileSync("./test" + req.url).toString().replace("</body>", '<script>var socket=new WebSocket(window.location.protocol.replace("http","ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))
            } else {
                res.end(fs.readFileSync("./test" + req.url))
            }
        } else {
            if (fs.existsSync("./test" + req.url + "/index.html")) {
                res.statusCode = 200
                res.statusMessage = "Ok"
                res.setHeader("Content-Type", typeMappings["html"])
                res.end(fs.readFileSync("./test" + req.url + "/index.html").toString().replace("</body>", '<script>var socket=new WebSocket(window.location.protocol.replace("http","ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))
            } else {
                res.statusCode = 404
                res.statusMessage = "Ok"
                res.setHeader("Content-Type", typeMappings["html"])

                res.end(fs.readFileSync("./test/404.html"))
            }
        }
    })

    server.listen(8000, () => {
        console.log("Http server started on 8000")
    })

    wsServer = new WebSocketServer({ httpServer: server, autoAcceptConnections: true })

    console.log("Watching files")

    function scan(dir) {
        fs.readdirSync(dir).forEach(file => {
            if (file != ".git" && file != ".gitignore" && file != "package.json" && file != "package-lock.json" && file != "node_modules" && file != ".deepsource.toml" && file != "test" && file != "cache") {
                if (fs.statSync(dir + file).isDirectory()) {
                    scan(dir + file + "/")
                } else {
                    fs.watchFile(dir + file, { interval: 1000 }, () => {
                        if (file == "localtest.js") {
                            console.log("Changes detected, restarting..")

                            process.exit(0)
                        } else {
                            if (building) {
                                return
                            }

                            console.log("Changes detected, rebuilding..")

                            build()
                        }
                    })
                }
            }
        })
    }
    scan("./", "/")
})

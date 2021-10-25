const fs = require("fs")
const { exec } = require("child_process")
const http = require("http")
const WebSocketServer = require('websocket').server

console.log("Installing dependencies")

if (!fs.existsSync("./test")) fs.mkdirSync("./test")

exec("cd ./test/ && npm i trash-cli -g").on("exit", code => {
    exec("cd ./test/ && npm i html-minifier uglify-js css-minify minify-xml").on("exit", code => {
        console.log("Finished installing dependencies")

        var building = false
        var connections = []

        function build() {
            if (building) return

            building = true

            console.log("Cloning files")

            if (!fs.existsSync("./test")) fs.mkdirSync("./test")

            function scan(dir, name) {
                var files = fs.readdirSync(dir)

                files.forEach(file => {
                    if (file == ".git" || file == ".gitignore" || file == "package-lock.json" || file == "node_modules" || file == "test") return

                    if (fs.statSync(dir + file).isDirectory()) {
                        if (!fs.existsSync("./test/" + dir.replace("./", "") + file)) fs.mkdirSync("./test/" + dir.replace("./", "") + file)

                        scan(dir + file + "/", name + "/" + file)
                    } else fs.copyFileSync(dir + file, "./test" + name + "/" + file)
                })
            }
            scan("./", "/")

            console.log("Building pages")

            exec("cd ./test/ && node build/build.js --nodepend", (err, stdout, stderr) => {
                if (stdout && stdout != "Started building pages\n") console.log(stdout)
                if (stderr) console.log(stderr)
            }).on("exit", code => {
                console.log("Finished building")

                building = false

                connections.forEach(connection => { connection.send("reload") })
            })
        }
        build()

        console.log("Starting server")

        const server = http.createServer((req, res) => {
            if (building) return res.end("<html><body>Building site..</body></html>".replace("</body>", '<script>varsocket=new WebSocket(window.location.protocol.replace("http", "ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))

            req.url = new URL("https://localhost" + req.url).pathname

            if (req.url.endsWith("/")) req.url = req.url.slice(0, req.url.length - 1)

            req.url = req.url.replace(/%20/, " ")

            var typeMappings = {
                "html": "text/html",
                "js": "text/javascript",
                "json": "application/json",
                "xml": "application/xml",
                "css": "text/css",
                "png": "image/png",
                "jpg": "image/jpeg",
                "ico": "image/vnd.microsoft.icon",
                "svg": "image/svg+xml",
                "pdf": "application/pdf",
                "gif": "image/gif",
                "mp3": "audio/mpeg",
                "mp4": "video/mp4",
                "zip": "application/zip",
                "txt": "text/plain",
                "anything": "application/octet-stream"
            }


            if (fs.existsSync("./test" + req.url) && !fs.statSync("./test" + req.url).isDirectory()) {
                res.statusCode = 200
                res.statusMessage = "Ok"
                Object.keys(typeMappings).forEach(key => { if (req.url.endsWith("." + key)) res.setHeader("Content-Type", typeMappings[key]) })

                if (res.getHeader("Content-Type") == typeMappings["html"]) {
                    res.end(fs.readFileSync("./test" + req.url).toString().replace("</body>", '<script>var socket=new WebSocket(window.location.protocol.replace("http","ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))
                } else res.end(fs.readFileSync("./test" + req.url))
            } else {
                if (fs.existsSync("./test" + req.url + "/index.html")) {
                    res.statusCode = 200
                    res.statusMessage = "Ok"
                    res.setHeader("Content-Type", typeMappings["html"])

                    if (res.getHeader("Content-Type") == typeMappings["html"]) {
                        res.end(fs.readFileSync("./test" + req.url + "/index.html").toString().replace("</body>", '<script>var socket=new WebSocket(window.location.protocol.replace("http","ws")+"//"+window.location.host+"/livereload");socket.onmessage=(msg)=>{if(msg.data=="reload")window.location.reload()}</script></body>'))
                    } else res.end(fs.readFileSync("./test" + req.url + "/index.html"))
                } else {
                    res.statusCode = 200
                    res.statusMessage = "Ok"
                    res.setHeader("Content-Type", typeMappings["html"])

                    res.end(fs.readFileSync("./test/404.html"))
                }
            }
        })

        server.listen(8000, () => { console.log("Http server started on 8000") })

        const wsServer = new WebSocketServer({ httpServer: server })

        wsServer.on("request", request => {
            var connection = request.accept()

            connections.push(connection)
            connection.on("close", () => { connections.splice(connections.indexOf(connection), 1) })
        })

        console.log("Watching files")

        function scan(dir, name) {
            var files = fs.readdirSync(dir)

            files.forEach(file => {
                if (file == ".git" || file == ".gitignore" || file == "package-lock.json" || file == "node_modules" || file == "test") return

                if (fs.statSync(dir + file).isDirectory()) scan(dir + file + "/", name + "/" + file)
                else fs.watchFile(dir + file, { interval: 1000 }, () => {
                    if (file == "localtest.js") {
                        console.log("Changes detected, restarting..")

                        process.exit(0)
                    } else {
                        if (building) return

                        console.log("Changes detected, rebuilding..")

                        build()
                    }
                })
            })
        }
        scan("./", "/")
    })
})
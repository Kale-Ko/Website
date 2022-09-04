var TextHeaders = new Headers()
TextHeaders.set("Content-Type", "text/plain; charset=utf-8")
TextHeaders.set("Access-Control-Allow-Origin", "kaleko.ga")
TextHeaders.set("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, POST")
TextHeaders.set("Allow", "OPTIONS, HEAD, GET, POST")
TextHeaders.set("Content-Language", "en")
TextHeaders.set("Cross-Origin-Embedder-Policy", "require-corp")
TextHeaders.set("Cross-Origin-Opener-Policy", "same-origin")
TextHeaders.set("Cross-Origin-Resource-Policy", "same-origin")
TextHeaders.set("X-Frame-Options", "SAMEORIGIN")
TextHeaders.set("X-Content-Type-Options", "nosniff")
var JsonHeaders = new Headers(TextHeaders)
JsonHeaders.set("Content-Type", "application/json; charset=utf-8")
var HtmlHeaders = new Headers(TextHeaders)
HtmlHeaders.set("Content-Type", "text/html; charset=utf-8")

async function onRequestGet({ request: req, env }) {
    const CONFIG = { GITHUB_USERNAME: env.GITHUB_USERNAME, GITHUB_API_TOKEN: env.GITHUB_API_TOKEN }

    var fetchHeaders = {
        "User-Agent": "Mozilla/5.0 Cloudflare/Workers",
        "Authorization": "Bearer " + CONFIG.GITHUB_API_TOKEN
    }

    var url = new URL(req.url.replace("/api", ""))
    var endpoint = url.pathname.split("/").slice(1)
    var returnType = url.searchParams.get("type") || "json"

    if (endpoint[0] == "") {
        if (returnType == "json") {
            return new Response("Welcome to the api, try sending a request (eg GET https://kaleko.ga/api/github/profile)", { status: 200, statusText: "Ok", headers: TextHeaders })
        } else if (returnType == "text") {
            return new Response(JSON.stringify({ "code": "welcome", "message": "Welcome to the api, try sending a request (eg GET https://kaleko.ga/api/github/profile)" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
        } else {
            return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        }
    } else if (endpoint[0] == "github") {
        if (endpoint[1] == "profile") {
            var response = {}

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    databaseId
                                    login
                                    name
                                    createdAt
                                    updatedAt
                                    avatarUrl
                                    url
                                    bio
                                    email
                                    websiteUrl
                                    twitterUsername
                                    company
                                    location
                                    status {
                                        emoji
                                        message
                                        indicatesLimitedAvailability
                                        createdAt
                                        updatedAt
                                        expiresAt
                                    }
                                    followers(first: 100) {
                                        nodes {
                                            databaseId
                                            login
                                            name
                                            url
                                        }
                                    }
                                    following(first: 100) {
                                        nodes {
                                            databaseId
                                            login
                                            name
                                            url
                                        }
                                    }
                                    organizations(first: 100) {
                                        nodes {
                                            databaseId
                                            login
                                            name
                                            url
                                        }
                                    }
                                    isHireable
                                    isDeveloperProgramMember
                                    isBountyHunter
                                    isGitHubStar
                                    isCampusExpert
                                    publicKeys(first: 100) {
                                        nodes {
                                            createdAt
                                            fingerprint
                                            key
                                        }
                                    }
                                }
                            }` }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user

                data.followers = data.followers.nodes
                data.following = data.following.nodes
                data.organizations = data.organizations.nodes
                data.publicKeys = data.publicKeys.nodes

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "readme") {
            var returnType = url.searchParams.get("type") || "text"

            var response = ""

            await fetch("https://raw.githubusercontent.com/" + CONFIG.GITHUB_USERNAME + "/" + CONFIG.GITHUB_USERNAME + "/master/README.md", { headers: fetchHeaders }).then(res => res.text()).then(data => {
                if (returnType == "text") {
                    response = data
                } else if (returnType == "json") {
                    response = markedIt.parse(data)
                } else if (returnType == "html") {
                    response = markedIt.render(data)
                }
            })

            if (returnType == "text") {
                return new Response(response, { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else if (returnType == "html") {
                return new Response(response, { status: 200, statusText: "Ok", headers: HtmlHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "repositories") {
            var response = []

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    repositories(first: 100) {
                                        nodes {
                                            databaseId
                                            name
                                            owner {
                                                login
                                                url
                                            }
                                            description
                                            homepageUrl
                                            visibility
                                            isArchived
                                            isLocked
                                            lockReason
                                            isDisabled
                                            isTemplate
                                            isFork
                                            parent {
                                                databaseId
                                                name
                                                url
                                            }
                                            isMirror
                                            url
                                            pushedAt
                                            updatedAt
                                            stargazerCount
                                            forkingAllowed
                                            forkCount
                                            hasIssuesEnabled
                                            hasProjectsEnabled
                                            hasWikiEnabled
                                            collaborators(first: 100) {
                                                nodes {
                                                    databaseId
                                                    login
                                                    name
                                                    url
                                                }
                                            }
                                            contactLinks {
                                                name
                                                about
                                                url
                                            }
                                            fundingLinks {
                                                platform
                                                url
                                            }
                                            licenseInfo {
                                                key
                                                name
                                                nickname
                                                url
                                            }
                                            languages(first: 100) {
                                                nodes {
                                                    name
                                                    color
                                                }
                                            }
                                            releases(first: 100) {
                                                nodes {
                                                    databaseId
                                                    name
                                                    url
                                                }
                                            }
                                            issues(first: 100) {
                                                nodes {
                                                    databaseId
                                                    title
                                                    url
                                                }
                                            }
                                            pullRequests(first: 100) {
                                                nodes {
                                                    databaseId
                                                    title
                                                    url
                                                }
                                            }
                                        }
                                    }
                                }
                            }`
                }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user.repositories.nodes

                data.forEach(repo => {
                    if (repo.visibility != "PUBLIC") {
                        return data.splice(data.indexOf(repo), 1)
                    }

                    if (data[data.indexOf(repo)].collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                    data[data.indexOf(repo)].languages = repo.languages.nodes
                    data[data.indexOf(repo)].releases = repo.releases.nodes
                    data[data.indexOf(repo)].issues = repo.issues.nodes
                    data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                })

                data.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))
                data.sort((a, b) => b.stargazerCount - a.stargazerCount)
                data.sort((a, b) => (a.isArchived == b.isArchived) ? 0 : (a.isArchived ? 1 : -1))

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "pins") {
            var response = []

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    pinnedItems(first: 100) {
                                        nodes {
                                            ... on Repository {
                                                databaseId
                                                name
                                                owner {
                                                    login
                                                    url
                                                }
                                                description
                                                homepageUrl
                                                visibility
                                                isArchived
                                                isLocked
                                                lockReason
                                                isDisabled
                                                isTemplate
                                                isFork
                                                parent {
                                                    databaseId
                                                    name
                                                    url
                                                }
                                                isMirror
                                                url
                                                pushedAt
                                                updatedAt
                                                stargazerCount
                                                forkingAllowed
                                                forkCount
                                                hasIssuesEnabled
                                                hasProjectsEnabled
                                                hasWikiEnabled
                                                collaborators(first: 100) {
                                                    nodes {
                                                        databaseId
                                                        login
                                                        name
                                                        url
                                                    }
                                                }
                                                fundingLinks {
                                                    platform
                                                    url
                                                }
                                                licenseInfo {
                                                    key
                                                    name
                                                    nickname
                                                    url
                                                }
                                                languages(first: 100) {
                                                    nodes {
                                                        name
                                                        color
                                                    }
                                                }
                                                releases(first: 100) {
                                                    nodes {
                                                        databaseId
                                                        name
                                                        url
                                                    }
                                                }
                                                issues(first: 100) {
                                                    nodes {
                                                        databaseId
                                                        title
                                                        url
                                                    }
                                                }
                                                pullRequests(first: 100) {
                                                    nodes {
                                                        databaseId
                                                        title
                                                        url
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }`
                }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user.pinnedItems.nodes

                data.forEach(repo => {
                    if (repo.visibility != "PUBLIC") {
                        return data.splice(data.indexOf(repo), 1)
                    }

                    if (data[data.indexOf(repo)].collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                    data[data.indexOf(repo)].languages = repo.languages.nodes
                    data[data.indexOf(repo)].releases = repo.releases.nodes
                    data[data.indexOf(repo)].issues = repo.issues.nodes
                    data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                })

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "stars") {
            var response = []

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login:"${CONFIG.GITHUB_USERNAME}") {
                                    starredRepositories(first: 100) {
                                        nodes {
                                            databaseId
                                            name
                                            owner {
                                                login
                                                url
                                            }
                                            description
                                            homepageUrl
                                            visibility
                                            isArchived
                                            isLocked
                                            lockReason
                                            isDisabled
                                            isTemplate
                                            isFork
                                            parent {
                                                databaseId
                                                name
                                                url
                                            }
                                            isMirror
                                            url
                                            pushedAt
                                            updatedAt
                                            stargazerCount
                                            forkingAllowed
                                            forkCount
                                            hasIssuesEnabled
                                            hasProjectsEnabled
                                            hasWikiEnabled
                                            collaborators(first: 100) {
                                                nodes {
                                                    databaseId
                                                    login
                                                    name
                                                    url
                                                }
                                            }
                                            contactLinks {
                                                name
                                                about
                                                url
                                            }
                                            fundingLinks {
                                                platform
                                                url
                                            }
                                            licenseInfo {
                                                key
                                                name
                                                nickname
                                                url
                                            }
                                            languages(first: 100) {
                                                nodes {
                                                    name
                                                    color
                                                }
                                            }
                                            releases(first: 100) {
                                                nodes {
                                                    databaseId
                                                    name
                                                    url
                                                }
                                            }
                                            issues(first: 100) {
                                                nodes {
                                                    databaseId
                                                    title
                                                    url
                                                }
                                            }
                                            pullRequests(first: 100) {
                                                nodes {
                                                    databaseId
                                                    title
                                                    url
                                                }
                                            }
                                        }
                                    }
                                }
                            }`
                }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user.starredRepositories.nodes

                data.forEach(repo => {
                    if (repo.visibility != "PUBLIC") {
                        return data.splice(data.indexOf(repo), 1)
                    }

                    if (data[data.indexOf(repo)].collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                    data[data.indexOf(repo)].languages = repo.languages.nodes
                    data[data.indexOf(repo)].releases = repo.releases.nodes
                    data[data.indexOf(repo)].issues = repo.issues.nodes
                    data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                })

                data.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))
                data.sort((a, b) => b.stargazerCount - a.stargazerCount)

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "gists") {
            var response = {}

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    gists(first: 100) {
                                        nodes {
                                            createdAt
                                            pushedAt
                                            updatedAt
                                            name
                                            owner {
                                                login
                                                url
                                            }
                                            description
                                            isPublic
                                            isFork
                                            url
                                            stargazerCount
                                            files {
                                                name
                                                extension
                                                size
                                                language {
                                                    name
                                                    color
                                                }
                                                text
                                            }
                                        }
                                    }
                                }
                            }` }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user.gists.nodes

                data.forEach(gist => {
                    if (!gist.isPublic) {
                        return data.splice(data.indexOf(gist), 1)
                    }
                })

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "packages") {
            var response = {}

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    packages(first: 100) {
                                        nodes {
                                            name
                                            packageType
                                            versions(first: 50) {
                                                nodes {
                                                    version
                                                    preRelease
                                                    platform
                                                    files(first: 50) {
                                                        nodes {
                                                            name
                                                            url
                                                        }
                                                    }
                                                }
                                            }
                                            repository {
                                                databaseId
                                                name
                                                url
                                            }
                                        }
                                    }
                                }
                            }` }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                console.log(data)

                data = data.data.user.packages.nodes

                data.forEach(gitPackage => {
                    if (gitPackage.name.startsWith("deleted_")) {
                        return data.splice(data.indexOf(gitPackage), 1)
                    }

                    data[data.indexOf(gitPackage)].versions = gitPackage.versions.nodes
                })

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else if (endpoint[1] == "projects") {
            var response = {}

            await fetch("https://api.github.com/graphql", {
                method: "POST", body: JSON.stringify({
                    query:
                        `query {
                                user(login: "${CONFIG.GITHUB_USERNAME}") {
                                    projectsV2(first: 100) {
                                        nodes {
                                            databaseId
                                            number
                                            title
                                            createdAt
                                            creator {
                                                login
                                                url
                                            }
                                            public
                                            shortDescription
                                            readme
                                            url
                                            closed
                                            closedAt
                                        }
                                    }
                                }
                            }` }), headers: fetchHeaders
            }).then(res => res.json()).then(data => {
                data = data.data.user.projectsV2.nodes

                data.forEach(project => {
                    if (!project.public) {
                        return data.splice(data.indexOf(project), 1)
                    }
                })

                response = data
            })

            if (returnType == "text") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else {
            if (returnType == "json") {
                return new Response(JSON.stringify({ "error": { "code": "invalid_path", "message": "The specified endpoint you are trying to access does not exist", "valid": ["/profile", "/readme", "/repositories", "/pins", "/stars", "/gists", "/packages", "/projects"] } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            } else if (returnType == "text") {
                return new Response("The specified endpoint you are trying to access does not exist\n\n/profile\n/readme\n/repositories\n/pins\n/stars\n/gists\n/packages\n/projects", { status: 400, statusText: "Bad Request", headers: TextHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        }
    } else if (endpoint[0] == "online") {
        if (returnType == "text") {
            return new Response("Online", { status: 200, statusText: "Ok", headers: TextHeaders })
        } else if (returnType == "json") {
            return new Response(JSON.stringify({ "status": "online" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
        } else {
            return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        }
    } else {
        if (returnType == "json") {
            return new Response(JSON.stringify({ "error": { "code": "invalid_path", "message": "The specified endpoint you are trying to access does not exist", "valid": ["/online", "/github"] } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        } else if (returnType == "text") {
            return new Response("The specified endpoint you are trying to access does not exist\n\n/online\n/github", { status: 400, statusText: "Bad Request", headers: TextHeaders })
        } else {
            return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        }
    }
}

async function onRequestPost({ request: req, env }) {
    var url = new URL(req.url.replace("/api", ""))
    var endpoint = url.pathname.split("/").slice(1)
    var returnType = url.searchParams.get("type") || "json"

    if (endpoint[0] == "") {
        if (returnType == "json") {
            return new Response("Welcome to the api, try sending a request (eg GET https://kaleko.ga/api/github/profile)", { status: 200, statusText: "Ok", headers: TextHeaders })
        } else if (returnType == "text") {
            return new Response(JSON.stringify({ "code": "welcome", "message": "Welcome to the api, try sending a request (eg GET https://kaleko.ga/api/github/profile)" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
        } else {
            return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        }
    } else if (endpoint[0] == "analytics") {
        var data = null
        try {
            data = JSON.parse(await req.text())
        } catch {
            if (returnType == "text") {
                return new Response("Invalid payload sent for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify({ "error": { "code": "invalid_payload", "message": "Invalid payload sent for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        }

        const ANALYTICS = env.ANALYTICS

        if (ANALYTICS != undefined) {
            ANALYTICS.put("user-" + data.id, data)

            if (returnType == "text") {
                return new Response("Accepted", { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify({ "code": "accepted", "message": "Accepted" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        } else {
            if (returnType == "text") {
                return new Response("Not Enabled", { status: 200, statusText: "Ok", headers: TextHeaders })
            } else if (returnType == "json") {
                return new Response(JSON.stringify({ "code": "not-enabled", "message": "Not Enabled" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
            } else {
                return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
            }
        }
    } else {
        if (returnType == "json") {
            return new Response(JSON.stringify({ "error": { "code": "invalid_path", "message": "The specified endpoint you are trying to access does not exist", "valid": ["/online", "/github", "/analytics"] } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        } else if (returnType == "text") {
            return new Response("The specified endpoint you are trying to access does not exist\n\n/online\n/github\n/analytics", { status: 400, statusText: "Bad Request", headers: TextHeaders })
        } else {
            return new Response(JSON.stringify({ "error": { "code": "invalid_type", "message": "Invalid data type for this endpoint" } }, null, 2), { status: 400, statusText: "Bad Request", headers: JsonHeaders })
        }
    }
}

export { onRequestGet, onRequestPost }
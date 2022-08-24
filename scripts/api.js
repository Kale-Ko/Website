export async function onRequest(context) {
    try {
        const CONFIG = { GITHUB_USERNAME: context.env.GITHUB_USERNAME, GITHUB_API_TOKEN: context.env.GITHUB_API_TOKEN, ADMIN_IP: context.env.ADMIN_IP }

        var fetchHeaders = {
            "User-Agent": "Mozilla/5.0 Cloudflare/Workers",
            "Authorization": "Bearer " + CONFIG.GITHUB_API_TOKEN
        }

        var TextHeaders = new Headers()
        TextHeaders.set("Content-Type", "text/plain")
        TextHeaders.set("Access-Control-Allow-Origin", "*")
        var JsonHeaders = new Headers()
        JsonHeaders.set("Content-Type", "application/json")
        JsonHeaders.set("Access-Control-Allow-Origin", "*")
        var HtmlHeaders = new Headers()
        HtmlHeaders.set("Content-Type", "text/html")
        HtmlHeaders.set("Access-Control-Allow-Origin", "*")

        var req = context.request

        var url = new URL(req.url.replace("/api", ""))
        var version = url.pathname.split("/")[1]
        var endpoint = url.pathname.split("/").slice(2)
        var returnType = url.searchParams.get("type") || "json"

        if (version == "v1" || version == "v2" || version == "v3") {
            return new Response(version + " has been depreciated, please use a different one", { status: 400, statusText: "Bad Request", headers: TextHeaders })
        } else if (version == "v4") {
            if (endpoint[0] == "github") {
                if (endpoint[1] == "profile") {
                    if (endpoint[2] == "json") {
                        var response = {}

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        login,
                                        name,
                                        url,
                                        createdAt,
                                        avatarUrl,
                                        bio,
                                        status {
                                            emoji,
                                            message
                                        },
                                        company,
                                        websiteUrl,
                                        email,
                                        twitterUsername,
                                        location,
                                        followers(first: 100) {
                                            nodes {
                                                login,
                                                name,
                                                url
                                            }
                                        },
                                        following(first:100) {
                                            nodes {
                                                login,
                                                name,
                                                url
                                            }
                                        },
                                        organizations(first:100) {
                                            nodes {
                                                login,
                                                name,
                                                url
                                            }
                                        }
                                    }
                                }` }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user

                            data.followers = data.followers.nodes
                            data.following = data.following.nodes
                            data.organizations = data.organizations.nodes

                            response = data
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/profile/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "readme") {
                    if (endpoint[2] == "html") {
                        var response = ""

                        await fetch("https://raw.githubusercontent.com/" + CONFIG.GITHUB_USERNAME + "/" + CONFIG.GITHUB_USERNAME + "/master/README.md", { headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN } }).then(res => res.text()).then(data => {
                            if (data == undefined) return new Response("500 Internal error", { status: 500, statusText: "Internal error", headers: TextHeaders })

                            response = markedIt.render(data)
                        })

                        return new Response(response, { status: 200, statusText: "Ok", headers: HtmlHeaders })
                    } else if (endpoint[2] == "json") {
                        var response = ""

                        await fetch("https://raw.githubusercontent.com/" + CONFIG.GITHUB_USERNAME + "/" + CONFIG.GITHUB_USERNAME + "/master/README.md", { headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN } }).then(res => res.text()).then(data => {
                            if (data == undefined) return new Response("500 Internal error", { status: 500, statusText: "Internal error", headers: TextHeaders })

                            response = markedIt.parse(data)
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else if (endpoint[2] == "text") {
                        var response = ""

                        await fetch("https://raw.githubusercontent.com/" + CONFIG.GITHUB_USERNAME + "/" + CONFIG.GITHUB_USERNAME + "/master/README.md", { headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN } }).then(res => res.text()).then(data => {
                            if (data == undefined) return new Response("500 Internal error", { status: 500, statusText: "Internal error", headers: TextHeaders })

                            response = data
                        })

                        return new Response(response, { status: 200, statusText: "Ok", headers: TextHeaders })
                    } else {
                        return new Response("/github/readme/html\n/github/readme/json\n/github/readme/text", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "repositories") {
                    if (endpoint[2] == "json") {
                        var response = []

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        repositories(first:100) {
                                            nodes {
                                                name,
                                                owner {
                                                    ... on User {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                url,
                                                createdAt,
                                                description,
                                                visibility,
                                                homepageUrl,
                                                licenseInfo {
                                                    key,
                                                    name,
                                                    url
                                                },
                                                primaryLanguage {
                                                    name
                                                },
                                                collaborators(first:100) {
                                                    nodes {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                stargazerCount,
                                                forkCount,
                                                isArchived,
                                                isFork,
                                                isPrivate,
                                                issues(first:100) {
                                                    nodes {
                                                        number,
                                                        title,
                                                        url
                                                    }
                                                },
                                                pullRequests(first:100) {
                                                    nodes {
                                                        number,
                                                        title,
                                                        url
                                                    }
                                                },
                                                releases(first: 100) {
                                                    nodes {
                                                        tagName,
                                                        name,
                                                        url
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }`
                            }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user.repositories.nodes

                            data.forEach(repo => {
                                if (repo == null || repo.visibility == "PRIVATE") return data.splice(data.indexOf(repo), 1)

                                if (repo.collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                                if (data[data.indexOf(repo)].primaryLanguage != null) data[data.indexOf(repo)].primaryLanguage = repo.primaryLanguage.name
                                data[data.indexOf(repo)].issues = repo.issues.nodes
                                data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                                data[data.indexOf(repo)].releases = repo.releases.nodes
                            })

                            data.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))
                            data.sort((a, b) => b.stargazerCount - a.stargazerCount)
                            data.sort((a, b) => (a.isArchived == b.isArchived) ? 0 : (a.isArchived ? 1 : -1))

                            response = data
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/repositories/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "pins") {
                    if (endpoint[2] == "json") {
                        var response = []

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        pinnedItems(first:6) {
                                            nodes {
                                                ... on Repository {
                                                    name,
                                                    owner {
                                                        ... on User {
                                                            login,
                                                            name,
                                                            url
                                                        }
                                                    },
                                                    url,
                                                    createdAt,
                                                    description,
                                                    visibility,
                                                    homepageUrl,
                                                    licenseInfo {
                                                        key,
                                                        name,
                                                        url
                                                    },
                                                    primaryLanguage {
                                                        name
                                                    },
                                                    collaborators(first:100) {
                                                        nodes {
                                                            login,
                                                            name,
                                                            url
                                                        }
                                                    },
                                                    stargazerCount,
                                                    forkCount,
                                                    isArchived,
                                                    isFork,
                                                    isPrivate,
                                                    issues(first:100) {
                                                        nodes {
                                                            number,
                                                            title,
                                                            url
                                                        }
                                                    },
                                                    pullRequests(first:100) {
                                                        nodes {
                                                            number,
                                                            title,
                                                            url
                                                        }
                                                    },
                                                    releases(first: 100) {
                                                        nodes {
                                                            tagName,
                                                            name,
                                                            url
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }`
                            }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user.pinnedItems.nodes

                            data.forEach(repo => {
                                if (repo == null || repo.visibility == "PRIVATE") return data.splice(data.indexOf(repo), 1)

                                if (repo.collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                                if (data[data.indexOf(repo)].primaryLanguage != null) data[data.indexOf(repo)].primaryLanguage = repo.primaryLanguage.name
                                data[data.indexOf(repo)].issues = repo.issues.nodes
                                data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                                data[data.indexOf(repo)].releases = repo.releases.nodes
                            })

                            response = data
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/pins/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "stars") {
                    if (endpoint[2] == "json") {
                        var response = []

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        starredRepositories(first:100) {
                                            nodes {
                                                name,
                                                owner {
                                                    ... on User {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                url,
                                                createdAt,
                                                description,
                                                visibility,
                                                homepageUrl,
                                                licenseInfo {
                                                    key,
                                                    name,
                                                    url
                                                },
                                                primaryLanguage {
                                                    name
                                                },
                                                collaborators(first:100) {
                                                    nodes {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                stargazerCount,
                                                forkCount,
                                                isArchived,
                                                isFork,
                                                isPrivate,
                                                issues(first:100) {
                                                    nodes {
                                                        number,
                                                        title,
                                                        url
                                                    }
                                                },
                                                pullRequests(first:100) {
                                                    nodes {
                                                        number,
                                                        title,
                                                        url
                                                    }
                                                },
                                                releases(first: 100) {
                                                    nodes {
                                                        tagName,
                                                        name,
                                                        url
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }`
                            }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user.starredRepositories.nodes

                            data.forEach(repo => {
                                if (repo == null || repo.visibility == "PRIVATE") return data.splice(data.indexOf(repo), 1)

                                if (repo.collaborators != null) data[data.indexOf(repo)].collaborators = repo.collaborators.nodes
                                if (data[data.indexOf(repo)].primaryLanguage != null) data[data.indexOf(repo)].primaryLanguage = repo.primaryLanguage.name
                                data[data.indexOf(repo)].issues = repo.issues.nodes
                                data[data.indexOf(repo)].pullRequests = repo.pullRequests.nodes
                                data[data.indexOf(repo)].releases = repo.releases.nodes
                            })

                            data.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))
                            data.sort((a, b) => b.stargazerCount - a.stargazerCount)

                            response = data
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/stars/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "gists") {
                    if (endpoint[2] == "json") {
                        var response = {}

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        gists(first:100) {
                                            nodes {
                                                owner {
                                                    ... on User {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                url
                                                createdAt,
                                                description,
                                                stargazerCount
                                                isFork,
                                                isPublic,
                                                files {
                                                    name,
                                                    extension
                                                    size
                                                    language {
                                                        name
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }` }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user.gists.nodes

                            data.forEach(gist => {
                                if (gist == null || !gist.isPublic) return data.splice(data.indexOf(gist), 1)
                            })

                            response = data
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/gists/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else if (endpoint[1] == "projects") {
                    if (endpoint[2] == "json") {
                        var response = {}

                        await fetch("https://api.github.com/graphql", {
                            method: "POST", body: JSON.stringify({
                                query:
                                    `query {
                                    user(login:"${CONFIG.GITHUB_USERNAME}") {
                                        projectsNext(first:100) {
                                            nodes {
                                                number,
                                                title,
                                                owner {
                                                    ... on User {
                                                        login,
                                                        name,
                                                        url
                                                    }
                                                },
                                                url,
                                                createdAt,
                                                shortDescription,
                                                description,
                                                public,
                                                closed
                                            }
                                        }
                                    }
                                }` }), headers: { "User-Agent": "Mozilla/5.0 Cloudflare/Workers", "Authorization": "bearer " + CONFIG.GITHUB_API_TOKEN }
                        }).then(res => res.json()).then(data => {
                            data = data.data.user.projectsNext.nodes

                            response = []

                            data.forEach(project => {
                                if (project.public && !project.closed) response.push(project)
                            })
                        })

                        return new Response(JSON.stringify(response, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                    } else {
                        return new Response("/github/projects/json", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else {
                    return new Response("/github/help - Github api help page\n/github/profile\n/github/readme\n/github/repositories\n/github/pins\n/github/stars\n/github/gists\n/github/projects", { status: 200, statusText: "Ok", headers: TextHeaders })
                }
            } else if (endpoint[0] == "online") {
                return new Response("200 Online", { status: 200, statusText: "Online", headers: TextHeaders })
            } else {
                return new Response("/help - Api help page\n/online - Check your connection\n/github - Github endpoints", { status: 200, statusText: "Ok", headers: TextHeaders })
            }
        } else if (version == "v5") {
            if (endpoint[0] == "github") {
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
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
                        return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
                    }
                } else {
                    return new Response("/profile\n/readme\n/repositories\n/pins\n/stars\n/gists\n/packages\n/projects", { status: 200, statusText: "Ok", headers: TextHeaders })
                }
            } else if (endpoint[0] == "online") {
                if (returnType == "text") {
                    return new Response("Online", { status: 200, statusText: "Ok", headers: TextHeaders })
                } else if (returnType == "json") {
                    return new Response(JSON.stringify({ status: "Online" }, null, 2), { status: 200, statusText: "Ok", headers: JsonHeaders })
                } else {
                    return new Response("Invalid data type for this endpoint", { status: 200, statusText: "Ok", headers: TextHeaders })
                }
            } else if (endpoint[0] == "error") {
                throw new Error("Errors are fun :)")
            } else {
                return new Response("/online\n/github", { status: 200, statusText: "Ok", headers: TextHeaders })
            }
        } else if (version == undefined || version == "") {
            return new Response("Welcome to the api, try sending a request (eg GET https://kaleko.ga/api/v5/github/profile)", { status: 200, statusText: "Ok", headers: TextHeaders })
        } else {
            return new Response("/v5 (Current)\n/v4", { status: 200, statusText: "Ok", headers: TextHeaders })
        }
    } catch (e) {
        if (req.headers["CF-Connecting-IP"] == CONFIG.ADMIN_IP) {
            return new Response(e, { status: 500, statusText: "Internal server error", headers: TextHeaders })
        } else {
            return new Response("500 Internal server error " + req.headers["CF-Connecting-IP"], { status: 500, statusText: "Internal server error", headers: TextHeaders })
        }
    }
}
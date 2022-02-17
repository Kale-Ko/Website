var navbar = document.querySelector("nav")
var menu = navbar.querySelector("div.dropdown")
var menucontent = navbar.querySelector("div.dropdown>div.dropdown-content")

menu.addEventListener("click", () => {
    if (navbar.children.length > 1) {
        for (var index = 0; navbar.children.length > 1; index++) {
            var child = navbar.children.item(1)

            if (!child.classList.contains("dropdown")) {
                child.classList.add("visible")

                menucontent.appendChild(child)
            }
        }

        menu.classList.add("visible")
    } else {
        for (var index = 0; menucontent.children.length > 0; index++) {
            var child = menucontent.children.item(0)

            if (child.classList.contains("visible")) {
                child.classList.remove("visible")

                navbar.appendChild(child)
            }
        }

        menu.classList.remove("visible")
    }
})
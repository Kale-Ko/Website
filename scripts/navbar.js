/**
    @license
    MIT License
    Copyright (c) 2021 Kale Ko
    See https://kaleko.ga/license.txt
*/

var navbar = document.querySelector("nav")
var menu = navbar.querySelector("div.dropdown")

menu.addEventListener("click", () => {
    if (navbar.children.length > 1) {
        for (var index = 0; navbar.children.length > 1; index++) {
            var child = navbar.children.item(1)

            if (!child.classList.contains("dropdown")) {
                child.classList.add("visible")

                menu.appendChild(child)
            }
        }
    } else {
        for (var index = 0; menu.children.length > 1; index++) {
            var child = menu.children.item(1)

            if (child.classList.contains("visible")) {
                child.classList.remove("visible")

                navbar.appendChild(child)
            }
        }
    }
})
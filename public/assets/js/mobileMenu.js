export function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const menuClose = document.getElementById("menuClose")
  const mobileMenu = document.getElementById("mobileMenu")

  if (!menuToggle || !mobileMenu) return

  const menuLinks = mobileMenu.querySelectorAll("a")

  function closeMobileMenu() {
    mobileMenu.classList.remove("is-open")
    menuToggle.classList.remove("is-open")
    document.body.classList.remove("menu-open")
    menuToggle.setAttribute("aria-expanded", "false")
  }

  function openMobileMenu() {
    mobileMenu.classList.add("is-open")
    menuToggle.classList.add("is-open")
    document.body.classList.add("menu-open")
    menuToggle.setAttribute("aria-expanded", "true")
    mobileMenu.scrollTop = 0
  }

  menuToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("is-open")) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  })

  if (menuClose) {
    menuClose.addEventListener("click", closeMobileMenu)
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      closeMobileMenu()
    }
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100 && mobileMenu.classList.contains("is-open")) {
      closeMobileMenu()
    }
  })
}
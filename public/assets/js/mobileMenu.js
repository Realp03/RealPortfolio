export function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const menuClose = document.getElementById("menuClose")
  const mobileMenu = document.getElementById("mobileMenu")

  if (!menuToggle || !mobileMenu) return

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
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open")
    if (isOpen) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  })

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu()
    }
  })

  if (menuClose) {
    menuClose.addEventListener("click", closeMobileMenu)
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu()
    }
  })
}
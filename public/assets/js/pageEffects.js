export function initPageEffects() {
  const items = document.querySelectorAll(".reveal")

  items.forEach((el, i) => {
    el.style.setProperty("--delay", `${0.12 * i}s`)
  })

  document.body.classList.add("loaded")

  const links = document.querySelectorAll("a")
  links.forEach((link) => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function (e) {
        e.preventDefault()
        const url = this.href
        document.body.classList.add("fade-out")
        setTimeout(() => {
          window.location.href = url
        }, 400)
      })
    }
  })
}
function removeIntroInstant() {
  const overlay = document.getElementById("introOverlay")
  document.body.classList.remove("intro-lock", "intro-stage")
  document.body.classList.add("intro-done")
  if (overlay) overlay.remove()
}

export function initStartAnimation() {
  const overlay = document.getElementById("introOverlay")

  if (!overlay) {
    document.body.classList.add("intro-done")
    return
  }

  const alreadySeen = sessionStorage.getItem("portfolio_intro_seen") === "1"

  if (alreadySeen) {
    removeIntroInstant()
    return
  }

  document.body.classList.add("intro-lock", "intro-stage")

  const exitDelay = 1800

  window.setTimeout(() => {
    overlay.classList.add("is-exiting")
  }, exitDelay)

  overlay.addEventListener(
    "transitionend",
    (e) => {
      if (e.propertyName !== "opacity") return
      document.body.classList.remove("intro-lock", "intro-stage")
      document.body.classList.add("intro-done")
      sessionStorage.setItem("portfolio_intro_seen", "1")
      overlay.remove()
    },
    { once: true }
  )
}
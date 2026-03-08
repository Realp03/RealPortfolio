export function initSkillsThought() {
  const skillButtons = document.querySelectorAll(".skill-orb")
  const skillThought = document.getElementById("skillThought")
  const skillThoughtTitle = document.getElementById("skillThoughtTitle")
  const skillThoughtCode = document.getElementById("skillThoughtCode")
  const skillsIcons = document.getElementById("skillsIcons")

  if (
    !skillButtons.length ||
    !skillThought ||
    !skillThoughtTitle ||
    !skillThoughtCode ||
    !skillsIcons
  ) return

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")
  }

  function generateStars(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0))
    const fullStars = Math.floor(safeRating)
    const hasHalf = safeRating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

    let starsHTML = `<div class="rating-wrap" aria-label="Rating ${safeRating} out of 5">`

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<span class="star full">★</span>`
    }

    if (hasHalf) {
      starsHTML += `<span class="star half">★</span>`
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<span class="star empty">★</span>`
    }

    starsHTML += `<span class="rating-number">${safeRating}/5</span>`
    starsHTML += `</div>`

    return starsHTML
  }

  function resetThoughtPosition() {
    skillThought.style.left = ""
    skillThought.style.top = ""
    skillThought.style.removeProperty("--tail-x")
    skillThought.classList.remove("is-below")
  }

 function placeThoughtDesktop(btn) {
  const wrapRect = skillsIcons.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()
  const gap = 12

  skillThought.style.width = "220px"
  skillThought.style.left = "0px"
  skillThought.style.top = "0px"

  const thoughtRect = skillThought.getBoundingClientRect()
  const thoughtWidth = thoughtRect.width
  const thoughtHeight = thoughtRect.height

  const btnCenter = btnRect.left - wrapRect.left + btnRect.width / 2

  let left = btnCenter - thoughtWidth / 2
  let top = btnRect.top - wrapRect.top - thoughtHeight - gap

  if (left < 0) left = 0
  if (left + thoughtWidth > wrapRect.width) {
    left = wrapRect.width - thoughtWidth
  }

  if (top < 0) {
    top = btnRect.bottom - wrapRect.top + gap
    skillThought.classList.add("is-below")
  } else {
    skillThought.classList.remove("is-below")
  }

  skillThought.style.left = `${left}px`
  skillThought.style.top = `${top}px`

  const tailOffset = btnCenter - left
  skillThought.style.setProperty("--tail-x", `${tailOffset}px`)
}

  function returnThoughtHome() {
    resetThoughtPosition()
    if (skillThought.parentElement !== skillsIcons) {
      skillsIcons.appendChild(skillThought)
    }
  }

  function hideThought() {
    skillButtons.forEach((item) => item.classList.remove("is-active"))
    skillThought.classList.remove("is-visible")
    returnThoughtHome()
  }

  function showThought(btn) {
    if (window.innerWidth <= 767) return

    const title = btn.getAttribute("data-title") || "Skill"
    const rating = parseFloat(btn.getAttribute("data-rating") || "0")
    const code = btn.getAttribute("data-code") || "No sample code available."

    skillButtons.forEach((item) => item.classList.remove("is-active"))
    btn.classList.add("is-active")

    skillThoughtTitle.textContent = title
    skillThoughtCode.innerHTML = `
      ${generateStars(rating)}
      <pre class="sample-code"><code>${escapeHtml(code)}</code></pre>
    `

    placeThoughtDesktop(btn)

    skillThought.classList.remove("is-visible")
    void skillThought.offsetWidth
    skillThought.classList.add("is-visible")
  }

  skillButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 767) return

      e.stopPropagation()

      const isSameActive =
        btn.classList.contains("is-active") &&
        skillThought.classList.contains("is-visible")

      if (isSameActive) {
        hideThought()
        return
      }

      showThought(btn)
    })
  })

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 767) return

    const insideSkill = e.target.closest(".skill-orb")
    const insideThought = e.target.closest("#skillThought")

    if (!insideSkill && !insideThought) {
      hideThought()
    }
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 767) {
      hideThought()
      return
    }

    const active = document.querySelector(".skill-orb.is-active")
    if (!active || !skillThought.classList.contains("is-visible")) return

    placeThoughtDesktop(active)
  })
}
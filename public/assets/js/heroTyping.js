export function initHeroTyping() {
  const el = document.getElementById("typingLine")
  if (!el) return

  const texts = ["Hi, I'm Realp03", "Frontend Developer"]
  const typeSpeed = 120
  const deleteSpeed = 70
  const afterTypePause = 900
  const afterDeletePause = 220

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function typeText(text) {
    el.classList.add("typeCursor")
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i]
      await sleep(typeSpeed)
    }
  }

  async function deleteText() {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1)
      await sleep(deleteSpeed)
    }
  }

  async function loop() {
    let i = 0
    while (true) {
      el.textContent = ""
      await typeText(texts[i])
      await sleep(afterTypePause)
      await deleteText()
      await sleep(afterDeletePause)
      i = (i + 1) % texts.length
    }
  }

  loop()
}
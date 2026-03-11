export function initEmailMe() {
  const openBtn = document.getElementById("openEmailMe")
  const modal = document.getElementById("emailMeModal")
  const closeBtn = document.getElementById("closeEmailMe")
  const backdrop = modal?.querySelector("[data-emailme-close='true']")
  const form = document.getElementById("emailMeForm")
  const status = document.getElementById("emailMeStatus")
  const sendBtn = document.getElementById("emailMeSend")

  if (!openBtn || !modal || !closeBtn || !backdrop || !form || !status || !sendBtn) return
  if (!window.emailjs) return

  const PUBLIC_KEY = "mqQjVGjY157Vb28RC"
  const SERVICE_ID = "service_74tuuhq"
  const TEMPLATE_ID = "template_tp3nvji"
  const AUTO_REPLY_TEMPLATE = "template_la2otai"

  let sending = false

  window.emailjs.init({
    publicKey: PUBLIC_KEY
  })

  function openModal() {
    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.classList.add("emailme-open")
  }

  function closeModal() {
    modal.classList.remove("is-open")
    modal.setAttribute("aria-hidden", "true")
    document.body.classList.remove("emailme-open")
  }

  function setStatus(message, type = "") {
    status.textContent = message
    status.classList.remove("is-success", "is-error")
    if (type) status.classList.add(type)
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
  }

  async function verifyEmail(email) {
    const response = await fetch(`/api/verify-email?email=${encodeURIComponent(email)}`)
    const data = await response.json()

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Verification failed")
    }

    return data
  }

  openBtn.addEventListener("click", openModal)
  closeBtn.addEventListener("click", closeModal)
  backdrop.addEventListener("click", closeModal)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal()
    }
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (sending) return

    const nameValue = form.from_name.value.trim()
    const emailValue = form.reply_to.value.trim()
    const messageValue = form.message.value.trim()

    if (!isValidEmail(emailValue)) {
      setStatus("Please enter a valid email address.", "is-error")
      return
    }

    sending = true
    sendBtn.disabled = true
    sendBtn.textContent = "Checking..."
    setStatus("Checking email address...")

    try {
      const verification = await verifyEmail(emailValue)

      if (!verification.accepted) {
        setStatus("Please enter a real and deliverable email address.", "is-error")
        return
      }

      sendBtn.textContent = "Sending..."
      setStatus("Sending message...")

      await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)

      await window.emailjs.send(
        SERVICE_ID,
        AUTO_REPLY_TEMPLATE,
        {
          from_name: nameValue,
          reply_to: emailValue,
          message: messageValue
        }
      )

      setStatus("Message sent successfully.", "is-success")
      form.reset()

      setTimeout(() => {
        closeModal()
        setStatus("")
      }, 1600)

    } catch (error) {
      console.error("Email form error:", error)
      setStatus(error.message || "Failed to verify or send message.", "is-error")
    } finally {
      sending = false
      sendBtn.disabled = false
      sendBtn.textContent = "Send Message"
    }
  })
}
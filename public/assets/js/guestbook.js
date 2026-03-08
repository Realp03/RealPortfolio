import { db } from "./firebase.js?v=3"
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

export function initGuestBook() {
  const form = document.getElementById("guestbookForm")
  const messagesContainer = document.getElementById("guestbookMessages")

  if (!form || !messagesContainer) return

  async function loadMessages() {
    try {
      messagesContainer.classList.remove("is-rolling")
      messagesContainer.innerHTML = `<div class="guestbook-loading">Loading messages...</div>`

      const q = query(
        collection(db, "guestbook_messages"),
        orderBy("created_at", "desc")
      )

      const snapshot = await getDocs(q)

      messagesContainer.innerHTML = ""

      if (snapshot.empty) {
        messagesContainer.innerHTML = `<div class="guestbook-empty">No messages yet. Be the first to leave one.</div>`
        return
      }

      const items = []

      snapshot.forEach((doc, index) => {
        const msg = doc.data()

        const name =
          msg.is_anonymous === true
            ? "Anonymous"
            : msg.display_name || "Guest"

        const card = document.createElement("div")
        card.className = "guestbook-card guestbook-card-enter"
        card.style.animationDelay = `${index * 0.08}s`
        card.innerHTML = `
          <div class="guestbook-card-top">
            <strong>${escapeHtml(name)}</strong>
          </div>
          <p>${escapeHtml(msg.message)}</p>
        `

        items.push(card)
      })

      items.forEach((card) => {
        messagesContainer.appendChild(card)
      })

      if (items.length >= 4) {
        items.forEach((card) => {
          const clone = card.cloneNode(true)
          clone.classList.remove("guestbook-card-enter")
          clone.style.animationDelay = "0s"
          messagesContainer.appendChild(clone)
        })

        requestAnimationFrame(() => {
          messagesContainer.classList.add("is-rolling")
        })
      }
    } catch (err) {
      console.error("Failed to load messages:", err)
      messagesContainer.classList.remove("is-rolling")
      messagesContainer.innerHTML = `<div class="guestbook-error">Failed to load messages.</div>`
      alert(`Failed to load messages: ${err.message}`)
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    const name = String(formData.get("name") || "").trim()
    const message = String(formData.get("message") || "").trim()
    const anonymous = formData.get("anonymous") === "on"

    if (!message) return

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]')
    const oldBtnText = submitBtn ? submitBtn.textContent : ""

    try {
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = "Sending..."
      }

      await addDoc(collection(db, "guestbook_messages"), {
        display_name: name,
        message: message,
        is_anonymous: anonymous,
        created_at: serverTimestamp()
      })

      form.reset()
      await loadMessages()
    } catch (err) {
      console.error("Failed to send message:", err)
      alert(`Failed to send message: ${err.message}`)
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = oldBtnText || "Send Message"
      }
    }
  })

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  loadMessages()
}
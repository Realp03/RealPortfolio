let botStatusInterval = null

export function initChatWidget(AI_URL) {
  const chatFab = document.getElementById("chatFab")
  const chatBox = document.getElementById("chatBox")
  const chatClose = document.getElementById("chatClose")
  const chatForm = document.getElementById("chatForm")
  const chatInput = document.getElementById("chatInput")
  const chatMsgs = document.getElementById("chatMsgs")
  const botDot = document.getElementById("botDot")
  const botLabel = document.getElementById("botLabel")

  if (!chatFab || !chatBox || !chatClose || !chatForm || !chatInput || !chatMsgs) return

  const chatKey = "realp03_ai_chat_history_v1"
  const history = []

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  function addMsg(role, text) {
    const wrap = document.createElement("div")
    wrap.className = role === "me" ? "msg me" : "msg bot"
    wrap.innerHTML = escapeHtml(text).replace(/\n/g, "<br>")
    chatMsgs.appendChild(wrap)
    chatMsgs.scrollTop = chatMsgs.scrollHeight
  }

  function typing(on) {
    const id = "aiTyping"
    const old = document.getElementById(id)

    if (on) {
      if (old) return
      const div = document.createElement("div")
      div.id = id
      div.className = "msg bot"
      div.textContent = "Typing…"
      chatMsgs.appendChild(div)
      chatMsgs.scrollTop = chatMsgs.scrollHeight
      return
    }

    if (old) old.remove()
  }

  function loadChat() {
    try {
      const raw = localStorage.getItem(chatKey)
      const parsed = raw ? JSON.parse(raw) : []

      if (!Array.isArray(parsed)) return

      parsed.slice(-30).forEach((m) => {
        if (!m || typeof m !== "object") return
        addMsg(m.role === "user" ? "me" : "bot", m.text || "")
        history.push({ role: m.role, text: m.text || "" })
      })
    } catch {}
  }

  function saveChat() {
    try {
      localStorage.setItem(chatKey, JSON.stringify(history.slice(-30)))
    } catch {}
  }

  function setOnlineUI(online) {
    if (botDot) {
      botDot.classList.toggle("online", !!online)
      botDot.classList.toggle("offline", !online)
    }

    if (botLabel) {
      botLabel.textContent = online ? "Online" : "Offline"
    }
  }

  async function checkBotStatus() {
    if (!AI_URL) {
      setOnlineUI(false)
      return false
    }

    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 2500)

    try {
      const res = await fetch(`${AI_URL}/health`, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      })

      clearTimeout(t)

      const ok = !!res.ok
      setOnlineUI(ok)
      return ok
    } catch {
      clearTimeout(t)
      setOnlineUI(false)
      return false
    }
  }

  async function askAI(message) {
    if (!AI_URL) {
      throw new Error("AI URL missing")
    }

    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 45000)

    try {
      const res = await fetch(`${AI_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: String(message || "").slice(0, 2000),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error("Request failed")
      }

      const reply = data && typeof data.reply === "string" ? data.reply : ""
      return String(reply || "").trim()
    } finally {
      clearTimeout(t)
    }
  }

  setOnlineUI(false)

  if (botStatusInterval) {
    clearInterval(botStatusInterval)
    botStatusInterval = null
  }

  chatFab.onclick = () => {
    chatBox.classList.remove("hidden")
  }

  chatClose.onclick = () => {
    chatBox.classList.add("hidden")
  }

  loadChat()

  if (history.length === 0) {
    const hi = "Hi! I’m AskMark AI. Ask me about my projects, skills, or contact info."
    addMsg("bot", hi)
    history.push({ role: "model", text: hi })
    saveChat()
  }

  checkBotStatus()
  botStatusInterval = setInterval(checkBotStatus, 5000)

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const raw = (chatInput.value || "").trim()
    if (!raw) return

    addMsg("me", raw)
    history.push({ role: "user", text: raw })
    saveChat()

    chatInput.value = ""
    chatInput.focus()

    try {
      typing(true)

      const isOnline = await checkBotStatus()
      if (!isOnline) {
        throw new Error("AI offline")
      }

      const reply = await askAI(raw)
      typing(false)

      const finalReply = reply || "I didn't understand that."
      addMsg("bot", finalReply)
      history.push({ role: "model", text: finalReply })
      saveChat()

      checkBotStatus()
    } catch {
      typing(false)
      setOnlineUI(false)
      addMsg("bot", "AI is offline right now. Try again later.")
    }
  })
}
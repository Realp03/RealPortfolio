document.addEventListener("DOMContentLoaded", () => {
  const AI_URL = "https://pavilion-specially-henry-grid.trycloudflare.com";
  const items = document.querySelectorAll(".reveal");
  items.forEach((el, i) => {
    el.style.setProperty("--delay", `${0.12 * i}s`);
  });
  document.body.classList.add("loaded");

  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const url = this.href;
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = url;
        }, 400);
      });
    }
  });

  const gallery = document.getElementById("gallery");
  const scrollBtns = document.querySelectorAll("[data-gallery-dir]");
  scrollBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!gallery) return;
      const dir = Number(btn.dataset.galleryDir || 0);
      const scrollAmount = 250;
      gallery.scrollLeft += dir * scrollAmount;
    });
  });

  const chatFab = document.getElementById("chatFab");
  const chatBox = document.getElementById("chatBox");
  const chatClose = document.getElementById("chatClose");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMsgs = document.getElementById("chatMsgs");

  const botDot = document.getElementById("botDot");
  const botLabel = document.getElementById("botLabel");

  const chatKey = "realp03_ai_chat_history_v1";
  const history = [];

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addMsg(role, text) {
    if (!chatMsgs) return;
    const wrap = document.createElement("div");
    wrap.className = role === "me" ? "msg me" : "msg bot";
    wrap.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
    chatMsgs.appendChild(wrap);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function typing(on) {
    if (!chatMsgs) return;
    const id = "aiTyping";
    const old = document.getElementById(id);
    if (on) {
      if (old) return;
      const div = document.createElement("div");
      div.id = id;
      div.className = "msg bot";
      div.textContent = "Typing…";
      chatMsgs.appendChild(div);
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    } else {
      if (old) old.remove();
    }
  }

  function loadChat() {
    try {
      const raw = localStorage.getItem(chatKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        parsed.slice(-30).forEach((m) => {
          if (!m || typeof m !== "object") return;
          addMsg(m.role === "user" ? "me" : "bot", m.text || "");
          history.push({ role: m.role, text: m.text || "" });
        });
      }
    } catch {}
  }

  function saveChat() {
    try {
      localStorage.setItem(chatKey, JSON.stringify(history.slice(-30)));
    } catch {}
  }

  function setOnlineUI(online) {
    if (botDot) {
      botDot.classList.toggle("online", !!online);
      botDot.classList.toggle("offline", !online);
    }
    if (botLabel) botLabel.textContent = online ? "Online" : "Offline";
  }

  async function checkBotStatus() {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch(`${AI_URL}/health`, { signal: controller.signal, cache: "no-store" });
      clearTimeout(t);
      setOnlineUI(res.ok);
      return res.ok;
    } catch {
      clearTimeout(t);
      setOnlineUI(false);
      return false;
    }
  }

  async function askAI(message) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch(`${AI_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: String(message || "").slice(0, 2000),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Request failed");

      const reply = data && typeof data.reply === "string" ? data.reply : "";
      return String(reply || "").trim();
    } finally {
      clearTimeout(t);
    }
  }

  if (chatFab && chatBox) chatFab.onclick = () => chatBox.classList.remove("hidden");
  if (chatClose && chatBox) chatClose.onclick = () => chatBox.classList.add("hidden");

  if (chatMsgs && chatForm && chatInput) {
    loadChat();

    if (history.length === 0) {
      const hi = "Hi! I’m AskMark AI. Ask me about my projects, skills, or contact info.";
      addMsg("bot", hi);
      history.push({ role: "model", text: hi });
      saveChat();
    }

    checkBotStatus();
    setInterval(checkBotStatus, 5000);

    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const raw = (chatInput.value || "").trim();
      if (!raw) return;

      addMsg("me", raw);
      history.push({ role: "user", text: raw });
      saveChat();

      chatInput.value = "";
      chatInput.focus();

      try {
        typing(true);
        const reply = await askAI(raw);
        typing(false);

        const finalReply = reply || "I didn't understand that.";
        addMsg("bot", finalReply);
        history.push({ role: "model", text: finalReply });
        saveChat();
        checkBotStatus();
      } catch {
        typing(false);
        const ok = await checkBotStatus();
        addMsg("bot", ok ? "AI is busy right now. Please try again in a few seconds." : "AI is offline right now. Try again later.");
      }
    });
  }

  const modal = document.getElementById("certModal");
  if (modal) {
    const preview = document.getElementById("certPreview");
    const titleEl = document.getElementById("certModalTitle");
    const downloadBtn = document.getElementById("certDownload");
    const closeBtn = document.getElementById("certClose");

    let currentBlobUrl = null;

    async function loadPdfAsBlobUrl(pdfUrl) {
      const res = await fetch(pdfUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch PDF");
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }

    async function openModal({ title, pdf }) {
      if (!pdf) return;

      if (titleEl) titleEl.textContent = title || "Certificate";

      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
      }

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      try {
        currentBlobUrl = await loadPdfAsBlobUrl(pdf);

        if (preview) preview.src = currentBlobUrl;

        if (downloadBtn) {
          const safeName = (title || "certificate").replace(/[^\w\-]+/g, "_") + ".pdf";
          downloadBtn.href = currentBlobUrl;
          downloadBtn.setAttribute("download", safeName);
        }
      } catch {
        if (preview) preview.src = pdf;
        if (downloadBtn) {
          const safeName = (title || "certificate").replace(/[^\w\-]+/g, "_") + ".pdf";
          downloadBtn.href = pdf;
          downloadBtn.setAttribute("download", safeName);
        }
      }
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      if (preview) preview.src = "";
      if (downloadBtn) downloadBtn.href = "#";

      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
      }
    }

    document.querySelectorAll(".cert-card").forEach((card) => {
      card.addEventListener("click", () => {
        openModal({
          title: card.dataset.title,
          pdf: card.dataset.pdf,
        });
      });
    });

    closeBtn?.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target?.dataset?.close === "true") closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }
});

(function () {
  const rotators = Array.from(document.querySelectorAll(".skill-rotator"));
  if (!rotators.length) return;

  rotators.forEach((el) => {
    const items = String(el.dataset.items || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!items.length) return;

    let i = 0;
    el.textContent = items[i];
    el.classList.add("is-in");

    const step = () => {
      el.classList.remove("is-in");
      el.classList.add("is-out");

      setTimeout(() => {
        i = (i + 1) % items.length;
        el.textContent = items[i];
        el.classList.remove("is-out");
        el.classList.add("is-in");
      }, 220);
    };

    setInterval(step, 3000);
  });
})();

(function () {
  const img = document.getElementById("projectPreview");
  if (!img) return;

  const sources = [
    "https://s0.wp.com/mshots/v1/https%3A%2F%2Freaplaylist.vercel.app?w=1200&cb=" + Date.now(),
    "reaplaylist.png",
  ];

  let index = 0;

  function loadNext() {
    if (index >= sources.length) return;
    img.src = sources[index];
    index++;
  }

  img.onerror = loadNext;

  loadNext();
})();

const g = document.querySelector('img[alt="Gallereal Website Preview"]');
if (g) {
  const t = setTimeout(() => {
    if (!g.complete || g.naturalWidth === 0) g.src = "gallereal.png";
  }, 4000);
  g.onload = () => clearTimeout(t);
  g.onerror = () => {
    clearTimeout(t);
    g.onerror = null;
    g.src = "gallereal.png";
  };
}




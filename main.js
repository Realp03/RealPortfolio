document.addEventListener("DOMContentLoaded", () => {
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

  let awaitingJokePunchline = false;
  let awaitingCrushline = false;

  const replies = {
    hi: "Hello! Thank you for visiting my Portfolio Website. Feel free to explore and learn more about me.",
    love: "I appreciate the kindness 😄 but I’m here to share my professional journey and skills.",
    yown: "AHHAHAHAHAHAHA KUPAL",
    haha: "G MU!!!!!!!",
    relationship: "I prefer to keep my personal life private. Let’s focus on my IT journey and goals!",
    skills: "My technical skills include HTML, CSS, JavaScript, VB.Net, PHP, Java, and hardware troubleshooting.",
    contact: "You can contact me through the email or Facebook icon below.",
    future: "I plan to become a System or Network Administrator in the future.",
    hobby: "I enjoy playing online games and exploring new technologies.",
    default: "You can ask me about my skills, hobbies, future plans, or contact information.",
  };

  function addMsg(role, text) {
    if (!chatMsgs) return;
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  if (chatFab && chatBox) chatFab.onclick = () => chatBox.classList.remove("hidden");
  if (chatClose && chatBox) chatClose.onclick = () => chatBox.classList.add("hidden");

  addMsg("bot", "Hi! I'm Mark Daryl Pineda. Ask me about my skills, hobbies, or future plans.");

  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const raw = chatInput?.value.trim() || "";
      const text = raw.toLowerCase();
      if (!text) return;

      addMsg("me", raw);
      if (chatInput) chatInput.value = "";

      let reply = replies.default;

      if (text.includes("joke") || text.includes("patawa")) {
        awaitingJokePunchline = true;
        reply = "Sige, Ano ang Pambansang laro ng Pilipinas";
      } else if (awaitingJokePunchline && (text === "ano" || text === "ano?")) {
        awaitingJokePunchline = false;
        reply = "Edi, Scatter AHHAHAHAHAHA TANGINA MO!!!";
      }

      if (text.includes("crush") || text.includes("mahal")) {
        awaitingCrushline = true;
        reply = "Meron po hehe";
      } else if (awaitingCrushline && (text === "sino" || text === "sino?" || text === "who" || text === "who?")) {
        awaitingCrushline = false;
        reply = "Cybelle Mia ♡♡♡";
      } else if (
        text.startsWith("hi") ||
        text.startsWith("hello") ||
        text.includes("hi po") ||
        text.includes("hello po") ||
        text.includes("hey")
      ) {
        reply = replies.hi;
      } else if (text.includes("love you")) {
        reply = replies.love;
      } else if (text.includes("single") || text.includes("ex") || text.includes("relationship")) {
        reply = replies.relationship;
      } else if (text.includes("skill")) {
        reply = replies.skills;
      } else if (text.includes("yown")) {
        reply = replies.yown;
      } else if (text.includes("contact") || text.includes("email") || text.includes("facebook") || text.includes("fb")) {
        reply = replies.contact;
      } else if (text.includes("future") || text.includes("plan")) {
        reply = replies.future;
      } else if (text.includes("suntukan") || text.includes("kantutan")) {
        reply = replies.haha;
      } else if (text.includes("hobby") || text.includes("game")) {
        reply = replies.hobby;
      }

      setTimeout(() => addMsg("bot", reply), 500);
    });
  }

  // CERTIFICATE: VIEW IN WEBSITE (MODAL) + DIRECT DOWNLOAD (NO REDIRECT)
  const modal = document.getElementById("certModal");
  if (modal) {
    const preview = document.getElementById("certPreview"); // iframe
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
      } catch (err) {
        // fallback if fetch blocked
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


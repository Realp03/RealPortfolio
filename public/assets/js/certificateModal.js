export function initCertificateModal() {
  const modal = document.getElementById("certModal")
  if (!modal) return

  const preview = document.getElementById("certPreview")
  const titleEl = document.getElementById("certModalTitle")
  const downloadBtn = document.getElementById("certDownload")
  const closeBtn = document.getElementById("certClose")
  let currentBlobUrl = null

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth <= 768
  }

  async function loadPdfAsBlobUrl(pdfUrl) {
    const res = await fetch(pdfUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch PDF")
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  }

  async function openModal({ title, pdf }) {
    if (!pdf) return

    if (isMobileDevice()) {
      window.open(pdf, "_blank")
      return
    }

    if (titleEl) titleEl.textContent = title || "Certificate"

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
      currentBlobUrl = null
    }

    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"

    try {
      currentBlobUrl = await loadPdfAsBlobUrl(pdf)

      if (preview) preview.src = currentBlobUrl

      if (downloadBtn) {
        const safeName = (title || "certificate").replace(/[^\w\-]+/g, "_") + ".pdf"
        downloadBtn.href = currentBlobUrl
        downloadBtn.setAttribute("download", safeName)
      }
    } catch {
      if (preview) preview.src = pdf

      if (downloadBtn) {
        const safeName = (title || "certificate").replace(/[^\w\-]+/g, "_") + ".pdf"
        downloadBtn.href = pdf
        downloadBtn.setAttribute("download", safeName)
      }
    }
  }

  function closeModal() {
    modal.classList.remove("is-open")
    modal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = ""

    if (preview) preview.src = ""
    if (downloadBtn) downloadBtn.href = "#"

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
      currentBlobUrl = null
    }
  }

  document.querySelectorAll(".cert-card").forEach((card) => {
    card.addEventListener("click", () => {
      openModal({
        title: card.dataset.title,
        pdf: card.dataset.pdf,
      })
    })
  })

  closeBtn?.addEventListener("click", closeModal)

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close === "true") closeModal()
  })

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal()
    }
  })
}
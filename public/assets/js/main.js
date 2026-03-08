import { initThemeToggle } from "./theme.js?v=5"
import { initMobileMenu } from "./mobileMenu.js?v=5"
import { initSkillsThought } from "./skillsThought.js?v=5"
import { initHeroTyping } from "./heroTyping.js?v=5"
import { initChatWidget } from "./chatWidget.js?v=5"
import { initCertificateModal } from "./certificateModal.js?v=5"
import { initGuestBook } from "./guestbook.js?v=5"
import { initStartAnimation } from "./startAnimation.js?v=2"

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle()
  initStartAnimation()
  initMobileMenu()
  initSkillsThought()
  initHeroTyping()
  initChatWidget()
  initCertificateModal()
  initGuestBook()
})
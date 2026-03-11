import { initThemeToggle } from "./theme.js?v=3"
import { initMobileMenu } from "./mobileMenu.js?v=3"
import { initSkillsThought } from "./skillsThought.js?v=3"
import { initHeroTyping } from "./heroTyping.js?v=3"
import { initChatWidget } from "./chatWidget.js?v=3"
import { initCertificateModal } from "./certificateModal.js?v=3"
import { initGuestBook } from "./guestbook.js?v=3"
import { initStartAnimation } from "./startAnimation.js"
import { initEmailMe } from "./emailMe.js"

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle()
  initStartAnimation()
  initMobileMenu()
  initSkillsThought()
  initHeroTyping()
  initChatWidget()
  initCertificateModal()
  initGuestBook()
  initEmailMe()
})
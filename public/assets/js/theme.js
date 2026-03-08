export function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle")
  if (!themeToggle) return

  const savedTheme = localStorage.getItem("realp03_theme")
  if (savedTheme === "light") {
    document.body.classList.add("light-mode")
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode")
    localStorage.setItem(
      "realp03_theme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    )
  })
}
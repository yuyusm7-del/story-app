export function setupSkipToContent() {
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.getElementById("main-content");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.removeAttribute("tabindex");
    });
  }
}

export function initAccessibility() {
  setupSkipToContent();
}

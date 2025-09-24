import routes from "./routes/routes.js";
import { getActiveRoute } from "./routes/url-parser.js";
import { isLoggedIn, logout } from "./utils/auth.js";
import { initAccessibility } from "./utils/accessibility.js";

const OPEN_CLASS = "open";
const ACTIVE_CLASS = "active";
const AUTH_LINKS_ID = "auth-links";
const LOGOUT_LINK_ID = "logout-link";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #authLinks = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    if (!navigationDrawer || !drawerButton || !content) {
      console.error("Error: One or more required elements are missing.");
      return;
    }

    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#authLinks = this.#navigationDrawer.querySelector(`#${AUTH_LINKS_ID}`);

    this.#setupDrawer();
    this.#setupAuthLinks();
    this.#setupServiceWorker();
    initAccessibility();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle(OPEN_CLASS);
    });

    document.body.addEventListener("click", (event) => {
      const isClickInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isClickOnButton = this.#drawerButton.contains(event.target);
      const isClickOnLink = event.target.tagName === "A";

      if (!isClickInsideDrawer && !isClickOnButton) {
        this.#navigationDrawer.classList.remove(OPEN_CLASS);
      }

      if (isClickOnLink) {
        this.#navigationDrawer.classList.remove(OPEN_CLASS);
      }
    });
  }

  #setupAuthLinks() {
    this.#updateAuthLinks();
    window.addEventListener("storage", () => this.#updateAuthLinks());
  }

  #updateAuthLinks() {
    if (isLoggedIn()) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        this.#authLinks.innerHTML = `
          <li><span class="user-greeting">Halo, ${
            userData.name || "Pengguna"
          }</span></li>
          <li><a href="#" id="${LOGOUT_LINK_ID}"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        `;

        document
          .getElementById(LOGOUT_LINK_ID)
          .addEventListener("click", (e) => {
            e.preventDefault();
            logout();
            this.#updateAuthLinks();
            window.location.hash = "#/";
          });
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        // Fallback to logged-out state if data is corrupt
        this.#authLinks.innerHTML = `
          <li><a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a></li>
          <li><a href="#/register"><i class="fas fa-user-plus"></i> Register</a></li>
        `;
      }
    } else {
      this.#authLinks.innerHTML = `
        <li><a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a></li>
        <li><a href="#/register"><i class="fas fa-user-plus"></i> Register</a></li>
      `;
    }
  }

  async #setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
        console.info("Service Worker registered successfully.");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    this.#updateActiveNavLink(url);

    if (!page) {
      this.#displayNotFoundPage();
      return;
    }

    try {
      const pageContent = await page.render();
      const afterRenderCallback = page.afterRender
        ? page.afterRender.bind(page)
        : () => {};

      if (!document.startViewTransition) {
        this.#content.innerHTML = pageContent;
        await afterRenderCallback();
        return;
      }

      document.startViewTransition(async () => {
        this.#content.innerHTML = pageContent;
        await afterRenderCallback();
      });
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#displayErrorPage();
    }
  }

  #updateActiveNavLink(currentPath) {
    this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentPath}`) {
        link.classList.add(ACTIVE_CLASS);
      } else {
        link.classList.remove(ACTIVE_CLASS);
      }
    });
  }

  #displayNotFoundPage() {
    this.#content.innerHTML = `
      <section class="container">
        <h1>404 Halaman Tidak Ditemukan</h1>
        <p>Halaman yang Anda cari tidak ada. Silakan kembali ke beranda.</p>
        <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
      </section>
    `;
  }

  #displayErrorPage() {
    this.#content.innerHTML = `
      <section class="container">
        <h1>Terjadi Kesalahan</h1>
        <p>Maaf, terjadi kesalahan saat memuat halaman ini. Mohon coba lagi nanti.</p>
        <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
      </section>
    `;
  }
}

export default App;

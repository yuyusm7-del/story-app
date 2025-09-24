// src/scripts/views/HomeView.js
import { showFormattedDate } from "../utils/index.js";
import { isLoggedIn } from "../utils/auth.js";

export class HomeView {
  constructor() {
    this.container = null;
  }

  setContainer(container) {
    this.container = container;
  }

  renderLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  renderStories(stories, hasMore, currentPage) {
    if (!this.container) {
      console.error("Container element is not set.");
      return;
    }

    // Perbaikan utama: Tambahkan pengecekan stories null atau undefined
    if (!stories || stories.length === 0) {
      // Cek apakah ini render awal atau lanjutan
      if (currentPage === 1) {
        this.renderEmptyState();
      }
      return;
    }

    const isInitialRender =
      this.container.querySelector(".stories-grid") === null;
    let storiesHtml = stories
      .map((story) => this.renderStoryCard(story))
      .join("");

    if (isInitialRender) {
      this.container.innerHTML = `
        ${
          !isLoggedIn()
            ? `
          <div class="guest-notice" style="background: #e8f4fc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3><i class="fas fa-info-circle"></i> Mode Tamu</h3>
            <p>Anda sedang menjelajahi sebagai tamu. <a href="#/login">Login</a> atau <a href="#/register">daftar</a> untuk melihat semua cerita dan berbagi pengalaman Anda.</p>
          </div>
        `
            : ""
        }
        <div class="stories-grid">
          ${storiesHtml}
        </div>
        ${
          hasMore
            ? `
          <div style="text-align: center; margin-top: 24px;">
            <button id="load-more-btn" class="btn btn-primary">
              Muat Lebih Banyak
            </button>
          </div>
        `
            : stories.length > 0
            ? '<p style="text-align: center;">Tidak ada cerita lagi untuk dimuat.</p>'
            : ""
        }
      `;
    } else {
      const storiesGrid = this.container.querySelector(".stories-grid");
      if (storiesGrid) {
        storiesGrid.insertAdjacentHTML("beforeend", storiesHtml);
      } else {
        // Fallback jika .stories-grid tidak ditemukan, kemungkinan karena renderError dipanggil sebelumnya.
        // Render ulang halaman penuh untuk memastikan struktur DOM benar.
        this.renderStories(stories, hasMore, currentPage);
        return;
      }

      const loadMoreBtnContainer =
        this.container.querySelector("#load-more-btn")?.parentElement;
      if (loadMoreBtnContainer) {
        if (!hasMore) {
          loadMoreBtnContainer.outerHTML =
            '<p style="text-align: center;">Tidak ada cerita lagi untuk dimuat.</p>';
        }
      }
    }
  }

  renderStoryCard(story) {
    return `
      <article class="card" tabindex="0">
        <img src="${story.photoUrl}" alt="${
      story.description
    }" class="card-img" loading="lazy">
        <div class="card-body">
          <h2 class="card-title">${story.name}</h2>
          <p class="card-text">${story.description}</p>
          <div class="card-date">${showFormattedDate(story.createdAt)}</div>
          ${
            story.lat && story.lon
              ? `
            <div style="margin-top: 12px;">
              <small><i class="fas fa-map-marker-alt"></i> Memiliki lokasi</small>
            </div>
          `
              : ""
          }
          ${
            isLoggedIn()
              ? `
            <a href="#/stories/${story.id}" class="btn btn-outline" style="margin-top: 12px; width: 100%;">
              Baca Selengkapnya
            </a>
          `
              : `
            <button class="btn btn-outline" style="margin-top: 12px; width: 100%;" onclick="alert('Silakan login untuk melihat detail cerita')">
              Login untuk Melihat Detail
            </button>
          `
          }
        </div>
      </article>
    `;
  }

  renderEmptyState() {
    if (!this.container) return;

    if (!isLoggedIn()) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h3>Bergabunglah dengan Komunitas</h3>
          <p>Login atau daftar untuk melihat dan berbagi cerita dengan komunitas kami.</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
            <a href="#/login" class="btn btn-primary">Login</a>
            <a href="#/register" class="btn btn-secondary">Daftar</a>
          </div>
        </div>
      `;
    } else {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book-open"></i>
          <h3>Belum ada cerita</h3>
          <p>Jadilah yang pertama membagikan cerita!</p>
          <a href="#/add-story" class="btn btn-primary">Tambah Cerita</a>
        </div>
      `;
    }
  }

  renderError(message) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Terjadi Kesalahan</h3>
        <p>${message}</p>
        <a href="#/" class="btn btn-primary">Muat Ulang</a>
      </div>
    `;
  }

  bindLoadMore(handler) {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.removeEventListener("click", handler);
      loadMoreBtn.addEventListener("click", handler);
    }
  }

  bindInfiniteScroll(handler) {
    // Hapus event listener sebelumnya untuk mencegah duplikasi
    window.removeEventListener("scroll", this.scrollHandler);

    this.scrollHandler = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        handler();
      }
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.scrollHandler();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  scrollToLastStory() {
    const storiesGrid = this.container.querySelector(".stories-grid");
    if (storiesGrid) {
      const lastStoryCard = storiesGrid.lastElementChild;
      if (lastStoryCard) {
        lastStoryCard.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }
}

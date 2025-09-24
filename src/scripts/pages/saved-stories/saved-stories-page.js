import { showFormattedDate } from "../../utils/index.js";
import { isLoggedIn } from "../../utils/auth.js";

const SAVED_STORIES_CONTAINER_ID = "saved-stories-container";
const SAVED_STORIES_STORAGE_KEY = "saved-stories";

export default class SavedStoriesPage {
  async render() {
    if (!isLoggedIn()) {
      return `
        <section class="container">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Akses Dibatasi</h3>
            <p>Anda perlu login untuk melihat cerita yang disimpan.</p>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
              <a href="#/login" class="btn btn-primary">Login</a>
              <a href="#/register" class="btn btn-secondary">Daftar</a>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="container">
        <h1>Cerita yang Tersimpan</h1>
        <div id="${SAVED_STORIES_CONTAINER_ID}">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    if (!isLoggedIn()) return;

    this.renderSavedStories();
  }

  renderSavedStories() {
    const container = document.getElementById(SAVED_STORIES_CONTAINER_ID);
    if (!container) return;

    const savedStories = JSON.parse(
      localStorage.getItem(SAVED_STORIES_STORAGE_KEY) || "[]"
    );

    if (savedStories.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-box-open"></i>
          <h3>Belum ada cerita yang disimpan</h3>
          <p>Simpan cerita yang Anda suka dari halaman beranda.</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      `;
    } else {
      let storiesHtml = "";
      savedStories.forEach((story) => {
        storiesHtml += `
          <article class="story-card">
            <img src="${story.photoUrl}" alt="${
          story.description
        }" class="story-image">
            <div class="story-content">
              <h3><a href="#/stories/${story.id}">${story.name}</a></h3>
              <p class="story-date">
                <i class="fas fa-calendar-alt"></i> ${showFormattedDate(
                  story.createdAt
                )}
              </p>
              <p class="story-description">${story.description.substring(
                0,
                150
              )}...</p>
              <a href="#/stories/${
                story.id
              }" class="btn btn-outline">Baca Selengkapnya</a>
            </div>
          </article>
        `;
      });
      container.innerHTML = `<div class="story-list-grid">${storiesHtml}</div>`;
    }
  }
}

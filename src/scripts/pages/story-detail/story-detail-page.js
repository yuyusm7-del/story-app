import storyApi from "../../services/api.js";
import { showFormattedDate, showToast } from "../../utils/index.js";
import { isLoggedIn } from "../../utils/auth.js";

const STORY_DETAIL_CONTAINER_ID = "story-detail";
const SAVE_BUTTON_ID = "save-story-button";
const SAVED_STORIES_STORAGE_KEY = "saved-stories";

export default class StoryDetailPage {
  constructor() {
    this.story = null;
    this.map = null;
  }

  async render() {
    if (!isLoggedIn()) {
      return `
        <section class="container">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Akses Dibatasi</h3>
            <p>Anda perlu login untuk melihat detail cerita.</p>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
              <a href="#/login" class="btn btn-primary">Login</a>
              <a href="#/register" class="btn btn-secondary">Daftar</a>
            </div>
          </div>
        </section>
      `;
    }

    const { id } = this.getStoryIdFromUrl();

    if (!id) {
      return `
        <section class="container">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Cerita tidak ditemukan</h3>
            <p>ID cerita tidak valid.</p>
            <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
          </div>
        </section>
      `;
    }

    return `
      <section class="container">
        <div id="${STORY_DETAIL_CONTAINER_ID}">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    if (!isLoggedIn()) return;

    const { id } = this.getStoryIdFromUrl();
    if (!id) return;

    await this.loadStoryDetail(id);
  }

  getStoryIdFromUrl() {
    const path = window.location.hash.replace("#/", "");
    const segments = path.split("/");

    if (segments[0] === "stories" && segments[1]) {
      return { id: segments[1] };
    }

    return { id: null };
  }

  async loadStoryDetail(id) {
    try {
      const response = await storyApi.getStoryDetail(id);

      if (response.error) {
        throw new Error(response.message);
      }

      this.story = response.story;
      this.renderStoryDetail();

      if (this.story.lat && this.story.lon) {
        this.renderMap();
      }

      this.#setupSaveButton();
    } catch (error) {
      console.error("Error loading story detail:", error);
      this.renderError("Gagal memuat detail cerita: " + error.message);
    }
  }

  renderStoryDetail() {
    const container = document.getElementById(STORY_DETAIL_CONTAINER_ID);
    if (!container) return;

    const isSaved = this.#isStorySaved(this.story.id);
    const buttonText = isSaved ? "Saved" : "Save Story";
    const buttonIcon = isSaved ? "fas fa-bookmark" : "far fa-bookmark";

    container.innerHTML = `
      <article>
        <img src="${this.story.photoUrl}" alt="${this.story.description}" 
          style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
        
        <h1>${this.story.name}</h1>
        
        <div style="margin-bottom: 20px; color: #666;">
          <i class="fas fa-calendar-alt"></i> ${showFormattedDate(
            this.story.createdAt
          )}
        </div>
        
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px;">
          ${this.story.description}
        </p>
        
        ${
          this.story.lat && this.story.lon
            ? `
          <h2>Lokasi</h2>
          <div id="story-map" class="map-container" style="height: 300px;">
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
              <i class="fas fa-spinner fa-spin"></i>
              <span style="margin-left: 10px;">Memuat peta...</span>
            </div>
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; display: flex; gap: 10px;">
          <a href="#/" class="btn btn-outline">
            <i class="fas fa-arrow-left"></i> Kembali ke Beranda
          </a>
          <button id="${SAVE_BUTTON_ID}" class="btn btn-primary" data-saved="${isSaved}">
            <i class="${buttonIcon}"></i> ${buttonText}
          </button>
        </div>
      </article>
    `;
  }

  #setupSaveButton() {
    const saveButton = document.getElementById(SAVE_BUTTON_ID);
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        const isSaved = saveButton.dataset.saved === "true";
        if (isSaved) {
          this.#handleUnsaveStory();
        } else {
          this.#handleSaveStory();
        }
      });
    }
  }

  #isStorySaved(storyId) {
    const savedStories = JSON.parse(
      localStorage.getItem(SAVED_STORIES_STORAGE_KEY) || "[]"
    );
    return savedStories.some((story) => story.id === storyId);
  }

  #handleSaveStory() {
    const savedStories = JSON.parse(
      localStorage.getItem(SAVED_STORIES_STORAGE_KEY) || "[]"
    );

    // Check if the story is already saved
    if (this.#isStorySaved(this.story.id)) {
      showToast("Cerita ini sudah tersimpan.");
      return;
    }

    // Add the current story to the saved list
    savedStories.push(this.story);
    localStorage.setItem(
      SAVED_STORIES_STORAGE_KEY,
      JSON.stringify(savedStories)
    );

    showToast("Cerita berhasil disimpan!");
    this.#renderSaveButtonState(true);
  }

  #handleUnsaveStory() {
    let savedStories = JSON.parse(
      localStorage.getItem(SAVED_STORIES_STORAGE_KEY) || "[]"
    );

    // Filter out the story to be removed
    const updatedStories = savedStories.filter(
      (story) => story.id !== this.story.id
    );
    localStorage.setItem(
      SAVED_STORIES_STORAGE_KEY,
      JSON.stringify(updatedStories)
    );

    showToast("Cerita berhasil dihapus dari daftar simpan.");
    this.#renderSaveButtonState(false);
  }

  #renderSaveButtonState(isSaved) {
    const saveButton = document.getElementById(SAVE_BUTTON_ID);
    if (!saveButton) return;

    saveButton.dataset.saved = isSaved;
    if (isSaved) {
      saveButton.innerHTML = `<i class="fas fa-bookmark"></i> Saved`;
      saveButton.disabled = true;
    } else {
      saveButton.innerHTML = `<i class="far fa-bookmark"></i> Save Story`;
      saveButton.disabled = false;
    }
  }

  renderMap() {
    if (!this.story.lat || !this.story.lon) return;

    setTimeout(() => {
      const mapContainer = document.getElementById("story-map");
      if (!mapContainer) return;

      this.map = L.map(mapContainer).setView(
        [this.story.lat, this.story.lon],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      L.marker([this.story.lat, this.story.lon])
        .addTo(this.map)
        .bindPopup(
          `<b>${this.story.name}</b><br>${this.story.description.substring(
            0,
            100
          )}...`
        )
        .openPopup();
    }, 100);
  }

  renderError(message) {
    const container = document.getElementById(STORY_DETAIL_CONTAINER_ID);
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Terjadi Kesalahan</h3>
        <p>${message}</p>
        <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
      </div>
    `;
  }
}

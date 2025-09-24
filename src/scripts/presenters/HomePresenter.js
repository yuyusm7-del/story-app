// presenters/HomePresenter.js
import { StoryModel } from "../models/StoryModel.js";
import { HomeView } from "../views/HomeView.js";
import { showToast } from "../utils/index.js";
import { isLoggedIn } from "../utils/auth.js";

export class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    this.view.renderLoading();
    await this.loadStories();
    this.setupInfiniteScroll(); // Panggil setupInfiniteScroll setelah render awal
    this.isInitialized = true;
  }

  async loadStories(page = 1) {
    try {
      // Pastikan data tidak null atau undefined sebelum diberikan ke view
      const stories = await this.model.getAllStories(page);

      this.view.renderStories(
        stories,
        this.model.hasMoreStories(),
        this.model.getCurrentPage()
      );

      if (page > 1) {
        this.view.scrollToLastStory();
      }

      this.view.bindLoadMore(() => {
        this.loadStories(this.model.getCurrentPage() + 1);
      });
    } catch (error) {
      console.error("Error loading stories:", error);
      if (!isLoggedIn()) {
        this.view.renderStories([], false, 1);
      } else {
        this.view.renderError("Gagal memuat cerita: " + error.message);
      }
    }
  }

  setupInfiniteScroll() {
    this.view.bindInfiniteScroll(() => {
      if (this.model.hasMoreStories() && !this.model.isLoadingStories()) {
        this.loadStories(this.model.getCurrentPage() + 1);
      }
    });
  }
}

// src/scripts/models/StoryModel.js
import storyApi from "../services/api.js";

export class StoryModel {
  constructor() {
    this.stories = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.isLoading = false;
  }

  // **Perbaikan**: Tambahkan metode ini
  async addStory(formData) {
    const response = await storyApi.addNewStory(formData);
    if (response.error) {
      throw new Error(response.message);
    }
    return response;
  }

  async getAllStories(page = 1, size = 10) {
    if (this.isLoading) return null;

    this.isLoading = true;
    this.currentPage = page;

    try {
      const response = await storyApi.getAllStories(page, size);

      if (response.error) {
        throw new Error(response.message);
      }

      if (page === 1) {
        this.stories = response.listStory || [];
      } else {
        this.stories = [...this.stories, ...(response.listStory || [])];
      }

      this.hasMore = response.listStory && response.listStory.length === size;
      return this.stories;
    } catch (error) {
      console.error("Error loading stories:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  getStories() {
    return this.stories;
  }

  hasMoreStories() {
    return this.hasMore;
  }

  isLoadingStories() {
    return this.isLoading;
  }

  getCurrentPage() {
    return this.currentPage;
  }
}

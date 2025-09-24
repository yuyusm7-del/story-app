import CONFIG from "../config.js";
import { getToken, isLoggedIn } from "../utils/auth.js";

class StoryApi {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  async _fetchWithAuth(url, options = {}) {
    const token = getToken();

    // If we're not logged in and trying to access stories, use the guest endpoint
    if (
      !isLoggedIn() &&
      url.startsWith("/stories") &&
      !url.includes("/guest")
    ) {
      // For GET requests to stories when not logged in, we need to handle differently
      // since there's no guest endpoint for getting stories
      return this._fetchWithoutAuth(url, options);
    }

    const headers = {
      ...options.headers,
    };

    // Only add Authorization header if we have a token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${this._baseUrl}${url}`, { ...options, headers });
  }

  async _fetchWithoutAuth(url, options = {}) {
    return fetch(`${this._baseUrl}${url}`, options);
  }

  async register({ name, email, password }) {
    const response = await this._fetchWithoutAuth("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return response.json();
  }

  async login({ email, password }) {
    const response = await this._fetchWithoutAuth("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return response.json();
  }

  async getAllStories(page = 1, size = 10, withLocation = false) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      location: withLocation ? "1" : "0",
    });

    // Use different approach for logged in vs not logged in users
    if (isLoggedIn()) {
      const response = await this._fetchWithAuth(`/stories?${params}`);
      return response.json();
    } else {
      // For non-logged in users, we need to use a different approach
      // Since the API doesn't have a guest endpoint for getting stories,
      // we'll use a mock response or handle the error gracefully
      try {
        const response = await this._fetchWithoutAuth(`/stories?${params}`);
        if (response.status === 401) {
          // If we get unauthorized, return empty stories for guest users
          return {
            error: false,
            message: "Stories fetched successfully",
            listStory: [],
          };
        }
        return response.json();
      } catch (error) {
        // Return empty stories for guest users
        return {
          error: false,
          message: "Stories fetched successfully",
          listStory: [],
        };
      }
    }
  }

  async getStoryDetail(id) {
    if (isLoggedIn()) {
      const response = await this._fetchWithAuth(`/stories/${id}`);
      return response.json();
    } else {
      // For non-logged in users, we can't access story details
      return {
        error: true,
        message: "Authentication required to view story details",
      };
    }
  }

  async addNewStory(formData) {
    const response = await this._fetchWithAuth("/stories", {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  async addNewStoryGuest(formData) {
    const response = await this._fetchWithoutAuth("/stories/guest", {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  async subscribeWebPush(subscription) {
    const response = await this._fetchWithAuth("/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    return response.json();
  }

  async unsubscribeWebPush(endpoint) {
    const response = await this._fetchWithAuth("/notifications/subscribe", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });

    return response.json();
  }
}

export default new StoryApi(CONFIG.BASE_URL);

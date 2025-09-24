import HomePage from "../pages/home/home-page.js";
import AddStoryPage from "../pages/add-story/add-story-page.js";
import AboutPage from "../pages/about/about-page.js";
import LoginPage from "../pages/auth/login-page.js";
import RegisterPage from "../pages/auth/register-page.js";
import StoryDetailPage from "../pages/story-detail/story-detail-page.js";
import SavedStoriesPage from "../pages/saved-stories/saved-stories-page.js"; // Import halaman Saved Stories

const routes = {
  "/": new HomePage(),
  "/add-story": new AddStoryPage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/stories/:id": new StoryDetailPage(),
  "/saved-stories": new SavedStoriesPage(), // Tambahkan rute untuk Saved Stories
};

export default routes;

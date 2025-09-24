// src/scripts/pages/add-story/add-story-page.js

// Change the import paths to go up two levels
import { StoryModel } from "../../models/StoryModel.js";
import { NotificationModel } from "../../models/NotificationModel.js";
import { AddStoryView } from "../../views/AddStoryView.js";
import { AddStoryPresenter } from "../../presenters/AddStoryPresenter.js";
import { isLoggedIn } from "../../utils/auth.js";

export default class AddStoryPage {
  constructor() {
    this.view = new AddStoryView();
    this.storyModel = new StoryModel();
    this.notifModel = new NotificationModel();
    this.presenter = new AddStoryPresenter(
      this.view,
      this.storyModel,
      this.notifModel
    );
  }

  async render() {
    return `<main id="main-content"></main>`;
  }

  async afterRender() {
    const mainContent = document.getElementById("main-content");
    this.view.setContainer(mainContent);
    this.presenter.initialize();
  }
}

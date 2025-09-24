import { HomeView } from "../../views/HomeView.js";
import { StoryModel } from "../../models/StoryModel.js";
import { HomePresenter } from "../../presenters/HomePresenter.js";

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.model = new StoryModel();
    this.presenter = new HomePresenter(this.view, this.model);
  }

  async render() {
    // Render elemen HTML dasar saja.
    // View yang akan mengisi konten dinamisnya nanti.
    return `
      <section class="container">
        <h1>Cerita Terbaru</h1>
        <div id="stories-container"></div>
      </section>
    `;
  }

  async afterRender() {
    // Ambil elemen DOM yang akan menjadi wadah (container) untuk View.
    const container = document.getElementById("stories-container");

    // Berikan wadah ke View.
    this.view.setContainer(container);

    // Biarkan Presenter yang mengurus sisanya.
    this.presenter.initialize();
  }
}

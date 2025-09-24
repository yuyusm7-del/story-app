import { RegisterView } from "../../views/RegisterView.js";
import { AuthModel } from "../../models/AuthModel.js";
import { RegisterPresenter } from "../../presenters/RegisterPresenter.js";
import { isLoggedIn } from "../../utils/auth.js";

export default class RegisterPage {
  constructor() {
    if (isLoggedIn()) {
      window.location.hash = "#/";
    }
    this.view = new RegisterView();
    this.model = new AuthModel();
    this.presenter = new RegisterPresenter(this.view, this.model);
  }

  async render() {
    // Kosongkan karena View akan merender konten
    return "";
  }

  async afterRender() {
    // Render konten menggunakan View
    const container = document.querySelector("#main-content");
    this.view.setContainer(container);
    this.view.render();

    // Inisialisasi Presenter
    this.presenter.initialize();
  }
}

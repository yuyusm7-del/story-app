import { LoginView } from "../../views/LoginView.js";
import { AuthModel } from "../../models/AuthModel.js";
import { LoginPresenter } from "../../presenters/LoginPresenter.js";
import { isLoggedIn } from "../../utils/auth.js";

export default class LoginPage {
  constructor() {
    if (isLoggedIn()) {
      window.location.hash = "#/";
    }
    this.view = new LoginView();
    this.model = new AuthModel();
    this.presenter = new LoginPresenter(this.view, this.model);
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

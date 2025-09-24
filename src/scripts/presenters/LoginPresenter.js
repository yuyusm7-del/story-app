import { AuthModel } from "../models/AuthModel.js";

export class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    this.view.bindFormSubmit(this.onFormSubmit.bind(this));
    this.isInitialized = true;
  }

  async onFormSubmit(formData) {
    const { email, password } = formData;

    if (!email || !password) {
      this.view.showErrorToast("Email dan password harus diisi");
      return;
    }

    this.view.setLoading(true);
    try {
      await this.model.login(email, password);
      this.view.showSuccessToast();

      // Panggil metode navigasi dari View
      setTimeout(() => {
        this.view.navigateToHome();
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      this.view.showErrorToast(error.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}

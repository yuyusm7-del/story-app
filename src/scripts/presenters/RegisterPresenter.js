import { AuthModel } from "../models/AuthModel.js";

export class RegisterPresenter {
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
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      this.view.showErrorToast("Semua field harus diisi");
      return;
    }
    if (password.length < 8) {
      this.view.showErrorToast("Password minimal 8 karakter");
      return;
    }

    this.view.setLoading(true);
    try {
      await this.model.register(name, email, password);
      this.view.showSuccessToast();

      // Panggil metode navigasi dari View
      setTimeout(() => {
        this.view.navigateToLogin();
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      this.view.showErrorToast(error.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}

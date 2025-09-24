import { showToast } from "../utils/index.js";

export class LoginView {
  constructor() {
    this.container = null;
    this.formSubmitHandler = null;
  }

  setContainer(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="container">
        <div class="auth-container">
          <h1 class="auth-title"><i class="fas fa-sign-in-alt"></i> Login</h1>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-input" placeholder="Email Anda" required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-input" placeholder="Password Anda" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </form>
          
          <div style="text-align: center; margin-top: 20px;">
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  bindFormSubmit(handler) {
    this.formSubmitHandler = handler;
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // View menangani preventDefault
        const formData = this.getFormData();
        this.formSubmitHandler(formData); // Kirim data bersih ke Presenter
      });
    }
  }

  getFormData() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    return { email, password };
  }

  setLoading(isLoading) {
    const submitBtn = document
      .getElementById("login-form")
      .querySelector('button[type="submit"]');
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  }

  showSuccessToast() {
    showToast("Login berhasil!", "success");
  }

  showErrorToast(message) {
    showToast("Login gagal: " + message, "error");
  }

  // Tambahkan metode untuk navigasi
  navigateToHome() {
    window.location.hash = "#/";
  }
}

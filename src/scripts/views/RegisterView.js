import { showToast } from "../utils/index.js";

export class RegisterView {
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
          <h1 class="auth-title"><i class="fas fa-user-plus"></i> Daftar Akun</h1>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name" class="form-label">Nama Lengkap</label>
              <input type="text" id="name" class="form-input" placeholder="Nama lengkap Anda" required>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-input" placeholder="Email Anda" required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" class="form-input" placeholder="Password (minimal 8 karakter)" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <i class="fas fa-user-plus"></i> Daftar
            </button>
          </form>
          
          <div style="text-align: center; margin-top: 20px;">
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </div>
        </div>
      </section>
    `;
  }

  bindFormSubmit(handler) {
    this.formSubmitHandler = handler;
    const form = document.getElementById("register-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // View menangani preventDefault
        const formData = this.getFormData();
        this.formSubmitHandler(formData); // Kirim data bersih ke Presenter
      });
    }
  }

  getFormData() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    return { name, email, password };
  }

  setLoading(isLoading) {
    const submitBtn = document
      .getElementById("register-form")
      .querySelector('button[type="submit"]');
    if (submitBtn) {
      if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Daftar';
      }
    }
  }

  showSuccessToast() {
    showToast("Pendaftaran berhasil! Silakan login.", "success");
  }

  showErrorToast(message) {
    showToast("Pendaftaran gagal: " + message, "error");
  }

  // Tambahkan metode untuk navigasi
  navigateToLogin() {
    window.location.hash = "#/login";
  }
}

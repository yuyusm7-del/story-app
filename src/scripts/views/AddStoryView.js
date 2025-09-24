// views/AddStoryView.js
import { showToast } from "../utils/index.js";

export class AddStoryView {
  constructor() {
    this.container = null;
    this.mediaStream = null;
    this.map = null;
    this.marker = null;
    this.formSubmitHandler = null;
    this.startCameraHandler = null;
    this.captureImageHandler = null;
    this.uploadImageHandler = null;
    this.imageInputChangeHandler = null;
    this.getLocationHandler = null;
    this.mapClickHandler = null;
  }

  setContainer(container) {
    this.container = container;
  }

  render(isLoggedIn) {
    if (!this.container) return;

    if (!isLoggedIn) {
      this.container.innerHTML = `
        <section class="container">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Anda perlu login</h3>
            <p>Silakan login untuk menambahkan cerita.</p>
            <a href="#/login" class="btn btn-primary">Login</a>
          </div>
        </section>
      `;
    } else {
      this.container.innerHTML = `
        <section class="container">
          <h1>Tambah Cerita Baru</h1>
          
          <form id="add-story-form" class="form">
            <div class="form-group">
              <label for="description" class="form-label">Deskripsi Cerita</label>
              <textarea 
                id="description" 
                class="form-textarea" 
                placeholder="Ceritakan pengalaman Anda..." 
                required
              ></textarea>
            </div>
            
            <div class="camera-container">
              <label class="form-label">Ambil Foto</label>
              <div class="camera-preview" id="camera-preview">
                <i class="fas fa-camera" style="font-size: 3rem; color: #ccc;"></i>
              </div>
              <div class="camera-controls">
                <button type="button" id="start-camera" class="btn btn-primary">
                  <i class="fas fa-camera"></i> Buka Kamera
                </button>
                <button type="button" id="capture" class="btn btn-secondary" disabled>
                  <i class="fas fa-camera-retro"></i> Ambil Foto
                </button>
                <button type="button" id="upload-image" class="btn btn-outline">
                  <i class="fas fa-upload"></i> Unggah Gambar
                </button>
              </div>
              <input type="file" id="image-input" accept="image/*" style="display: none;">
            </div>
            
            <div class="form-group">
              <label class="form-label">Lokasi (Opsional)</label>
              <div class="map-container" id="map-container">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                  <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: #ccc;"></i>
                  <span style="margin-left: 10px;">Memuat peta...</span>
                </div>
              </div>
              <button type="button" id="get-location" class="btn btn-outline" style="margin-top: 10px;">
                <i class="fas fa-location-arrow"></i> Gunakan Lokasi Saya
              </button>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <i class="fas fa-paper-plane"></i> Publikasikan Cerita
            </button>
          </form>
        </section>
      `;

      // Inisialisasi peta setelah render
      setTimeout(() => this.initMap(), 100);
    }
  }

  // --- Metode untuk mendapatkan data dari formulir
  getFormData() {
    const description = document.getElementById("description").value.trim();
    return { description };
  }

  // --- Metode untuk mengikat event handler dari Presenter
  bindFormSubmit(handler) {
    this.formSubmitHandler = handler;
    const form = document.getElementById("add-story-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = this.getFormData();
        this.formSubmitHandler(formData);
      });
    }
  }

  bindCameraControls(
    startHandler,
    captureHandler,
    uploadHandler,
    imageChangeHandler
  ) {
    this.startCameraHandler = startHandler;
    this.captureImageHandler = captureHandler;
    this.uploadImageHandler = uploadHandler;
    this.imageInputChangeHandler = imageChangeHandler;

    const startCameraBtn = document.getElementById("start-camera");
    const captureBtn = document.getElementById("capture");
    const uploadImageBtn = document.getElementById("upload-image");
    const imageInput = document.getElementById("image-input");

    if (startCameraBtn) {
      startCameraBtn.addEventListener("click", () => this.startCameraHandler());
    }
    if (captureBtn) {
      captureBtn.addEventListener("click", () => this.captureImageHandler());
    }
    if (uploadImageBtn) {
      uploadImageBtn.addEventListener("click", () => this.uploadImageHandler());
    }
    if (imageInput) {
      imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        this.imageInputChangeHandler(file);
      });
    }
  }

  bindLocationControl(handler) {
    this.getLocationHandler = handler;
    const getLocationBtn = document.getElementById("get-location");
    if (getLocationBtn) {
      getLocationBtn.addEventListener("click", () => this.getLocationHandler());
    }
  }

  bindMapClick(handler) {
    this.mapClickHandler = handler;
    if (this.map) {
      this.map.on("click", (e) => {
        this.mapClickHandler(e);
      });
    }
  }

  // --- Metode untuk memanipulasi UI
  setLoadingState(isLoading) {
    const submitBtn = document.querySelector(
      '#add-story-form button[type="submit"]'
    );
    if (submitBtn) {
      if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-paper-plane"></i> Publikasikan Cerita';
      }
    }
  }

  showToast(message, type) {
    showToast(message, type);
  }

  resetForm() {
    const description = document.getElementById("description");
    const cameraPreview = document.getElementById("camera-preview");
    const captureBtn = document.getElementById("capture");

    if (description) description.value = "";
    if (cameraPreview) {
      cameraPreview.innerHTML =
        '<i class="fas fa-camera" style="font-size: 3rem; color: #ccc;"></i>';
    }
    if (captureBtn) captureBtn.disabled = true;

    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    // Hentikan kamera jika aktif
    this.stopCamera();
  }

  // Metode baru untuk delegasi navigasi
  navigateTo(path) {
    window.location.hash = path;
  }

  // --- Metode untuk Kamera
  async startCamera() {
    const preview = document.getElementById("camera-preview");
    const startCameraBtn = document.getElementById("start-camera");
    const captureBtn = document.getElementById("capture");

    if (this.mediaStream) {
      this.stopCamera();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      this.mediaStream = stream;
      preview.innerHTML =
        '<video autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>';
      preview.querySelector("video").srcObject = stream;
      startCameraBtn.innerHTML = '<i class="fas fa-stop"></i> Tutup Kamera';
      captureBtn.disabled = false;
    } catch (error) {
      throw new Error("Tidak dapat mengakses kamera: " + error.message);
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    const startCameraBtn = document.getElementById("start-camera");
    const captureBtn = document.getElementById("capture");

    if (startCameraBtn) {
      startCameraBtn.innerHTML = '<i class="fas fa-camera"></i> Buka Kamera';
    }
    if (captureBtn) {
      captureBtn.disabled = true;
    }
  }

  captureImage() {
    return new Promise((resolve, reject) => {
      if (!this.mediaStream) {
        reject(new Error("Tidak ada stream kamera aktif."));
        return;
      }

      const video = document.querySelector("#camera-preview video");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const preview = document.getElementById("camera-preview");
          preview.innerHTML = `<img src="${URL.createObjectURL(
            blob
          )}" alt="Captured photo" style="width: 100%; height: 100%; object-fit: cover;">`;
          this.stopCamera();
          resolve(blob);
        },
        "image/jpeg",
        0.8
      );
    });
  }

  uploadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Tidak ada file yang dipilih."));
        return;
      }

      const preview = document.getElementById("camera-preview");
      preview.innerHTML = `<img src="${URL.createObjectURL(
        file
      )}" alt="Uploaded photo" style="width: 100%; height: 100%; object-fit: cover;">`;

      if (this.mediaStream) {
        this.stopCamera();
      }

      resolve(file);
    });
  }

  // --- Metode untuk Peta dan Lokasi
  initMap() {
    if (this.map || !document.getElementById("map-container")) return;

    try {
      this.map = L.map("map-container").setView([-6.2, 106.8], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Bind map click handler jika sudah di-set
      if (this.mapClickHandler) {
        this.map.on("click", (e) => {
          this.mapClickHandler(e);
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung oleh browser Anda"));
        return;
      }

      const getLocationBtn = document.getElementById("get-location");
      if (getLocationBtn) {
        getLocationBtn.disabled = true;
        getLocationBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Mendapatkan lokasi...';
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = { lat: latitude, lng: longitude };

          this.updateMapMarker(latlng);

          if (getLocationBtn) {
            getLocationBtn.disabled = false;
            getLocationBtn.innerHTML =
              '<i class="fas fa-location-arrow"></i> Gunakan Lokasi Saya';
          }

          resolve(latlng);
        },
        (error) => {
          if (getLocationBtn) {
            getLocationBtn.disabled = false;
            getLocationBtn.innerHTML =
              '<i class="fas fa-location-arrow"></i> Gunakan Lokasi Saya';
          }

          reject(new Error("Gagal mendapatkan lokasi: " + error.message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  updateMapMarker(latlng) {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.map.setView(latlng, 15);
    this.marker = L.marker(latlng)
      .addTo(this.map)
      .bindPopup("Lokasi yang dipilih")
      .openPopup();
  }

  // Metode untuk memicu input file dari Presenter
  triggerImageInput() {
    const imageInput = document.getElementById("image-input");
    if (imageInput) {
      imageInput.click();
    }
  }
}

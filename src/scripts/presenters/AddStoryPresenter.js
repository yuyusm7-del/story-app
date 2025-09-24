// presenters/AddStoryPresenter.js
import { StoryModel } from "../models/StoryModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { AddStoryView } from "../views/AddStoryView.js";
import { isLoggedIn } from "../utils/auth.js";

export class AddStoryPresenter {
  constructor(view, storyModel, notifModel) {
    this.view = view;
    this.storyModel = storyModel;
    this.notifModel = notifModel;
    this.selectedLocation = null;
    this.capturedImage = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    if (!isLoggedIn()) {
      this.view.render(false);
      return;
    }

    this.view.render(true);
    this.view.initMap();
    this.view.bindFormSubmit(this.onFormSubmit.bind(this));
    this.view.bindCameraControls(
      this.onStartCamera.bind(this),
      this.onCaptureImage.bind(this),
      this.onUploadImageClick.bind(this),
      this.onImageInputChange.bind(this)
    );
    this.view.bindLocationControl(this.onGetLocation.bind(this));
    this.view.bindMapClick(this.onMapClick.bind(this));

    this.isInitialized = true;
  }

  async onFormSubmit(formData) {
    const { description } = formData;

    if (!description) {
      this.view.showToast("Deskripsi cerita harus diisi", "error");
      return;
    }
    if (!this.capturedImage) {
      this.view.showToast("Silakan ambil atau unggah gambar", "error");
      return;
    }

    this.view.setLoadingState(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", this.capturedImage);
      if (this.selectedLocation) {
        formData.append("lat", this.selectedLocation.lat);
        formData.append("lon", this.selectedLocation.lng);
      }

      await this.storyModel.addStory(formData);
      this.view.showToast("Cerita berhasil dipublikasikan!", "success");

      // Logika notifikasi
      await this.notifModel.subscribeUser();

      this.view.resetForm();
      this.selectedLocation = null;
      this.capturedImage = null;

      // Delegasikan navigasi ke View
      setTimeout(() => {
        this.view.navigateTo("#/");
      }, 1000);
    } catch (error) {
      console.error("Error adding story:", error);
      this.view.showToast(
        "Gagal mempublikasikan cerita: " + error.message,
        "error"
      );
    } finally {
      this.view.setLoadingState(false);
    }
  }

  async onStartCamera() {
    try {
      await this.view.startCamera();
    } catch (error) {
      this.view.showToast(error.message, "error");
    }
  }

  async onCaptureImage() {
    try {
      const blob = await this.view.captureImage();
      this.capturedImage = blob;
    } catch (error) {
      this.view.showToast(error.message, "error");
    }
  }

  onUploadImageClick() {
    this.view.triggerImageInput();
  }

  async onImageInputChange(file) {
    if (file) {
      if (file.size > 1024 * 1024) {
        this.view.showToast("Ukuran gambar maksimal 1MB", "error");
        return;
      }
      try {
        await this.view.uploadImage(file);
        this.capturedImage = file;
      } catch (error) {
        this.view.showToast(error.message, "error");
      }
    }
  }

  async onGetLocation() {
    try {
      const latlng = await this.view.getLocation();
      this.selectedLocation = latlng;
      this.view.showToast("Lokasi berhasil didapatkan", "success");
    } catch (error) {
      this.view.showToast(error.message, "error");
    }
  }

  onMapClick(e) {
    this.selectedLocation = e.latlng;
    this.view.updateMapMarker(this.selectedLocation);
    this.view.showToast(
      "Lokasi dipilih: " +
        e.latlng.lat.toFixed(4) +
        ", " +
        e.latlng.lng.toFixed(4),
      "info"
    );
  }
}

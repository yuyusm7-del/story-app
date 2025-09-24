export default class AboutPage {
  render() {
    return `
      <section class="container">
        <h1>Tentang Aplikasi</h1>
        
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <i class="fas fa-book-open" style="font-size: 4rem; color: #3498db; margin-bottom: 20px;"></i>
            <h2>Story App</h2>
            <p style="font-size: 1.2rem; color: #666;">
              Platform berbagi cerita dan pengalaman dengan komunitas secara visual dan interaktif
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 40px;">
            <div style="text-align: center;">
              <i class="fas fa-camera" style="font-size: 2.5rem; color: #2ecc71; margin-bottom: 15px;"></i>
              <h3>Bagikan Foto</h3>
              <p>Bagikan momen berharga melalui foto dengan komunitas</p>
            </div>
            
            <div style="text-align: center;">
              <i class="fas fa-map-marker-alt" style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 15px;"></i>
              <h3>Tandai Lokasi</h3>
              <p>Tandai lokasi cerita Anda di peta digital interaktif</p>
            </div>
            
            <div style="text-align: center;">
              <i class="fas fa-users" style="font-size: 2.5rem; color: #9b59b6; margin-bottom: 15px;"></i>
              <h3>Komunitas</h3>
              <p>Terhubung dengan pengguna lain dan jelajahi cerita mereka</p>
            </div>
            
            <div style="text-align: center;">
              <i class="fas fa-bell" style="font-size: 2.5rem; color: #f39c12; margin-bottom: 15px;"></i>
              <h3>Notifikasi</h3>
              <p>Dapatkan pemberitahuan ketika cerita Anda dipublikasikan</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 40px;">
            <h3 style="margin-bottom: 20px; text-align: center;">Teknologi yang Digunakan</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div>
                <h4>Frontend</h4>
                <ul>
                  <li><i class="fas fa-code"></i> HTML5</li>
                  <li><i class="fas fa-paint-brush"></i> CSS3</li>
                  <li><i class="fas fa-code"></i> JavaScript ES6+</li>
                  <li><i class="fas fa-bolt"></i> Vite</li>
                </ul>
              </div>
              
              <div>
                <h4>Libraries</h4>
                <ul>
                  <li><i class="fas fa-map"></i> Leaflet (Peta)</li>
                  <li><i class="fas fa-icons"></i> Font Awesome (Ikon)</li>
                </ul>
              </div>
              
              <div>
                <h4>API</h4>
                <ul>
                  <li><i class="fas fa-database"></i> Dicoding Story API</li>
                  <li><i class="fas fa-bell"></i> Web Push Notification</li>
                  <li><i class="fas fa-location-dot"></i> Geolocation API</li>
                  <li><i class="fas fa-camera"></i> MediaDevices API</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style="background: #e8f4fc; padding: 30px; border-radius: 8px; margin-bottom: 40px;">
            <h3 style="margin-bottom: 20px; text-align: center;">Fitur Aksesibilitas</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div>
                <h4><i class="fas fa-universal-access"></i> Navigasi</h4>
                <p>Skip to content link untuk pengguna keyboard</p>
              </div>
              <div>
                <h4><i class="fas fa-keyboard"></i> Keyboard</h4>
                <p>Navigasi lengkap menggunakan keyboard</p>
              </div>
              <div>
                <h4><i class="fas fa-eye"></i> Tampilan</h4>
                <p>Kontras warna yang baik untuk keterbacaan</p>
              </div>
              <div>
                <h4><i class="fas fa-mobile-alt"></i> Responsif</h4>
                <p>Tampilan optimal di semua perangkat</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="#/" class="btn btn-primary">
              <i class="fas fa-home"></i> Kembali ke Beranda
            </a>
            <a href="#/add-story" class="btn btn-secondary" style="margin-left: 10px;">
              <i class="fas fa-plus-circle"></i> Mulai Berbagi Cerita
            </a>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // No additional setup needed for about page
  }
}

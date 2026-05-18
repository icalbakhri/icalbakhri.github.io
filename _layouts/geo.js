<script>
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inisialisasi Tombol Bahasa
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    const currentPath = window.location.pathname;
    
    // Cek apakah user sedang berada di subfolder /id/
    const isIndonesian = currentPath.startsWith('/id/');
    langText.innerText = isIndonesian ? 'ID' : 'EN';

    // 2. Fungsi Manual Switch Bahasa
    langToggleBtn.addEventListener('click', function() {
        if (isIndonesian) {
            localStorage.setItem('user_lang', 'en'); // Simpan pilihan manual
            window.location.href = '/'; // Ke Beranda Inggris
        } else {
            localStorage.setItem('user_lang', 'id'); // Simpan pilihan manual
            window.location.href = '/id/'; // Ke Beranda Indonesia
        }
    });

    // 3. Logic AUTO DETECT GEOLOCATION IP
    const userPrefersLang = localStorage.getItem('user_lang');

    // Hanya jalankan cek IP JIKA user sedang di halaman utama (root) DAN belum pernah memilih bahasa manual
    if (!userPrefersLang && (currentPath === '/' || currentPath === '')) {
        
        // Memanggil layanan gratis GeoJS (tanpa API key)
        fetch('https://get.geojs.io/v1/ip/country.json')
            .then(response => response.json())
            .then(data => {
                // Jika IP terdeteksi dari Indonesia (ID)
                if (data.country === 'ID') {
                    // Catat ke memori agar tidak terjadi redirect berulang kali
                    localStorage.setItem('user_lang', 'id');
                    // Arahkan ke versi Bahasa Indonesia
                    window.location.replace('/id/');
                } else {
                    // Jika bukan dari Indonesia, tetapkan sebagai Inggris
                    localStorage.setItem('user_lang', 'en');
                }
            })
            .catch(error => console.log('Gagal deteksi lokasi IP:', error));
    }
});
</script>
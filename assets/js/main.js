document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================
       1. LOGIKA DARK MODE TOGGLE
       ========================================== */
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        // Sesuaikan icon saat halaman dimuat
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            themeToggleDarkIcon.classList.remove('hidden');
        }

        themeToggleBtn.addEventListener('click', function() {
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    /* ==========================================
       2. LOGIKA BILINGUAL & GEO-IP
       ========================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    const currentPath = window.location.pathname;
    
    if (langToggleBtn && langText) {
        // Cek apakah user sedang berada di subfolder /id/
        const isIndonesian = currentPath.startsWith('/id/');
        langText.innerText = isIndonesian ? 'ID' : 'EN';

        // Fungsi Manual Switch Bahasa
        langToggleBtn.addEventListener('click', function() {
            if (isIndonesian) {
                localStorage.setItem('user_lang', 'en');
                window.location.href = '/'; 
            } else {
                localStorage.setItem('user_lang', 'id');
                window.location.href = '/id/'; 
            }
        });

        // Logic AUTO DETECT GEOLOCATION IP
        const userPrefersLang = localStorage.getItem('user_lang');

        if (!userPrefersLang && (currentPath === '/' || currentPath === '')) {
            fetch('https://get.geojs.io/v1/ip/country.json')
                .then(response => response.json())
                .then(data => {
                    if (data.country === 'ID') {
                        localStorage.setItem('user_lang', 'id');
                        window.location.replace('/id/');
                    } else {
                        localStorage.setItem('user_lang', 'en');
                    }
                })
                .catch(error => console.log('Gagal deteksi lokasi IP:', error));
        }
    }
});
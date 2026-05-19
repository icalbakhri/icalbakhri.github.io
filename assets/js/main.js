document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================
       1. TOGGLE DARK MODE
       ========================================== */
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
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
       2. BILINGUAL & GEO-IP AUTOMATION
       ========================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    const currentPath = window.location.pathname;
    
    if (langToggleBtn && langText) {
        const isIndonesian = currentPath.startsWith('/id/');
        langText.innerText = isIndonesian ? 'ID' : 'EN';

        langToggleBtn.addEventListener('click', function() {
            if (isIndonesian) {
                localStorage.setItem('user_lang', 'en');
                window.location.href = '/'; 
            } else {
                localStorage.setItem('user_lang', 'id');
                window.location.href = '/id/'; 
            }
        });

        const userPrefersLang = localStorage.getItem('user_lang');

        // Jalankan Geo-IP jika user berada di root '/' dan belum punya preferensi manual
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

    /* ==========================================
       3. LIVE SEARCH FILTER BERDASARKAN BAHASA
       ========================================== */
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        const currentLang = window.location.pathname.startsWith('/id/') ? 'id' : 'en';

        fetch('/search.json')
            .then(response => response.json())
            .then(data => {
                searchInput.addEventListener('input', function() {
                    const query = this.value.toLowerCase();
                    searchResults.innerHTML = '';
                    if (query.length < 2) return;

                    // Filter artikel yang cocok, DAN harus sewarna dengan bahasa halaman aktif
                    const results = data.filter(post => 
                        post.lang === currentLang && (
                            post.title.toLowerCase().includes(query) || 
                            post.tags.toLowerCase().includes(query)
                        )
                    );

                    results.slice(0, 5).forEach(result => {
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="${result.url}" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">${result.title}</a>`;
                        searchResults.appendChild(li);
                    });

                    if (results.length === 0) {
                        searchResults.innerHTML = `<li class="text-sm text-zinc-500">${currentLang === 'id' ? 'Tidak ditemukan.' : 'No results found.'}</li>`;
                    }
                });
            });
    }
});
// Referensi Elemen UI
const ui = {
    inputView: document.getElementById('view-input'),
    loadingView: document.getElementById('view-loading'),
    resultView: document.getElementById('view-result'),
    
    urlInput: document.getElementById('spotifyUrl'),
    searchBtn: document.getElementById('searchBtn'),
    finalDownloadBtn: document.getElementById('finalDownloadBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    // Elemen Hasil
    img: document.getElementById('albumArt'),
    title: document.getElementById('trackTitle'),
    artist: document.getElementById('artistName'),
    durationTxt: document.getElementById('durationTxt'),
    sizeTxt: document.getElementById('sizeTxt'),
    
    // Elemen Loading
    loadingText: document.querySelector('#view-loading h3'),
    loadingSubtext: document.querySelector('#view-loading p')
};

// Variabel Global
let currentDownloadUrl = "";
let currentFileName = "music.mp3";

// Fungsi Validasi URL Spotify
function isValidSpotifyUrl(url) {
    // Pattern untuk berbagai format URL Spotify
    const patterns = [
        /^(https?:\/\/)?open\.spotify\.com\/track\/[a-zA-Z0-9]{22}(\?.*)?$/,
        /^(https?:\/\/)?spotify\.link\/[a-zA-Z0-9]+$/,
        /^(https?:\/\/)?open\.spotify\.com\/album\/[a-zA-Z0-9]{22}(\?.*)?$/,
        /^(https?:\/\/)?open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}(\?.*)?$/
    ];
    
    return patterns.some(pattern => pattern.test(url.trim()));
}

// Fungsi Navigasi Tampilan
function showView(viewName) {
    ui.inputView.classList.add('hidden');
    ui.loadingView.classList.add('hidden');
    ui.resultView.classList.add('hidden');

    if (viewName === 'input') ui.inputView.classList.remove('hidden');
    if (viewName === 'loading') ui.loadingView.classList.remove('hidden');
    if (viewName === 'result') ui.resultView.classList.remove('hidden');
}

// Fungsi untuk menampilkan pesan loading
function setLoadingMessage(message, submessage = "") {
    if (ui.loadingText) ui.loadingText.textContent = message;
    if (ui.loadingSubtext) ui.loadingSubtext.textContent = submessage;
}

// 1. EVENT: KLIK TOMBOL CARI/DOWNLOAD AWAL
ui.searchBtn.addEventListener('click', async () => {
    const url = ui.urlInput.value.trim();
    
    // Validasi URL
    if (!url) {
        showNotification("Please paste a Spotify URL first!", "error");
        ui.urlInput.focus();
        return;
    }
    
    if (!isValidSpotifyUrl(url)) {
        showNotification("Invalid Spotify URL format!", "error");
        ui.urlInput.focus();
        return;
    }
    
    // Tampilkan loading dengan pesan
    showView('loading');
    setLoadingMessage("Validating URL...", "Checking Spotify link format");
    
    try {
        // Tahap 1: Validasi awal
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Tahap 2: Fetch data dari backend
        setLoadingMessage("Processing track...", "Fetching track information");
        
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });
        
        // Cek response status
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cek jika status dari backend true
        if (data.status === true) {
            // Tahap 3: Menyiapkan UI
            setLoadingMessage("Preparing download...", "Almost done!");
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // --- 1. SET GAMBAR (COVER) ---
            if (data.cover && data.cover !== "https://via.placeholder.com/300?text=No+Cover") {
                ui.img.src = data.cover;
                ui.img.style.display = 'block';
                // Fallback jika gambar gagal load
                ui.img.onerror = () => {
                    ui.img.src = 'https://via.placeholder.com/180?text=No+Cover';
                };
            } else {
                ui.img.src = 'https://via.placeholder.com/180?text=No+Cover';
            }

            // --- 2. SET JUDUL DAN ARTIS ---
            ui.title.textContent = data.title || "Unknown Title";
            ui.artist.textContent = data.artist || "Unknown Artist";
            
            // --- 3. SET METADATA ---
            if (data.duration) {
                ui.durationTxt.textContent = data.duration;
            }
            if (data.size) {
                ui.sizeTxt.textContent = data.size;
            }
            
            // --- 4. SIAPKAN LINK DOWNLOAD ---
            currentDownloadUrl = data.download_url;
            
            // Buat nama file bersih untuk download nanti
            const safeTitle = (data.title || "audio").replace(/[^a-z0-9]/gi, '_').substring(0, 50);
            const safeArtist = (data.artist || "").replace(/[^a-z0-9]/gi, '_').substring(0, 30);
            currentFileName = `${safeArtist} - ${safeTitle}.mp3`.replace(/^_+\s*-\s*_+/, 'audio') || 'spotify_track.mp3';

            // Tampilkan hasil
            showView('result');
            showNotification("Track ready for download!", "success");

        } else {
            throw new Error(data.message || data.error || "Failed to process track");
        }
    } catch (error) {
        console.error('Download Error:', error);
        
        // Tampilkan pesan error yang lebih spesifik
        let errorMessage = "Failed to process link. ";
        if (error.message.includes('Network')) {
            errorMessage += "Check your internet connection.";
        } else if (error.message.includes('Server error')) {
            errorMessage += "Server is temporarily unavailable.";
        } else if (error.message.includes('Invalid Spotify URL')) {
            errorMessage += "Please check your Spotify link format.";
        } else {
            errorMessage += "Please ensure the link is valid.";
        }
        
        showNotification(errorMessage, "error");
        showView('input');
    }
});

// 2. EVENT: KLIK TOMBOL DOWNLOAD FINAL
ui.finalDownloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!currentDownloadUrl) {
        showNotification("Download link not ready!", "error");
        return;
    }
    
    // Tampilkan loading saat memulai download
    const originalText = ui.finalDownloadBtn.innerHTML;
    ui.finalDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    ui.finalDownloadBtn.disabled = true;
    
    try {
        // Cek apakah link valid
        const headResponse = await fetch(currentDownloadUrl, { method: 'HEAD' });
        if (!headResponse.ok) {
            throw new Error('Download link expired or invalid');
        }
        
        // Download file
        const link = document.createElement('a');
        link.href = currentDownloadUrl;
        link.setAttribute('download', currentFileName);
        link.setAttribute('type', 'audio/mpeg');
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            ui.finalDownloadBtn.innerHTML = originalText;
            ui.finalDownloadBtn.disabled = false;
            showNotification("Download started!", "success");
        }, 1000);
        
    } catch (error) {
        console.error('Final Download Error:', error);
        ui.finalDownloadBtn.innerHTML = originalText;
        ui.finalDownloadBtn.disabled = false;
        showNotification("Download failed! Link may be expired.", "error");
    }
});

// Fitur Reset
ui.resetBtn.addEventListener('click', () => {
    ui.urlInput.value = '';
    ui.img.src = '';
    ui.title.textContent = 'Loading...';
    ui.artist.textContent = 'Loading...';
    showView('input');
    ui.urlInput.focus();
});

// Support tombol Enter
ui.urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') ui.searchBtn.click();
});

// Auto-focus input saat halaman load
window.addEventListener('load', () => {
    ui.urlInput.focus();
    showView('input');
});

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "info") {
    // Hapus notifikasi sebelumnya
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Tampilkan animasi
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inisialisasi
showView('input');
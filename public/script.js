// Spotify Downloader - Main Script
// Referensi Elemen UI
const ui = {
    // View elements
    inputView: document.getElementById('view-input'),
    loadingView: document.getElementById('view-loading'),
    resultView: document.getElementById('view-result'),
    errorView: document.getElementById('view-error'),
    
    // Input elements
    urlInput: document.getElementById('spotifyUrl'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    
    // Result elements
    finalDownloadBtn: document.getElementById('finalDownloadBtn'),
    resetBtn: document.getElementById('resetBtn'),
    retryBtn: document.getElementById('retryBtn'),
    albumArt: document.getElementById('albumArt'),
    trackTitle: document.getElementById('trackTitle'),
    artistName: document.getElementById('artistName'),
    durationTxt: document.getElementById('durationTxt'),
    qualityTxt: document.getElementById('qualityTxt'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Toast
    toast: document.getElementById('toast')
};

// Variabel Global
let currentDownloadUrl = "";
let currentFileName = "spotify_track.mp3";
let currentFileSize = "~5 MB";

// Fungsi Navigasi Tampilan
function showView(viewName) {
    // Sembunyikan semua view
    [ui.inputView, ui.loadingView, ui.resultView, ui.errorView].forEach(view => {
        view.classList.add('hidden');
    });

    // Tampilkan view yang diminta
    switch(viewName) {
        case 'input':
            ui.inputView.classList.remove('hidden');
            break;
        case 'loading':
            ui.loadingView.classList.remove('hidden');
            break;
        case 'result':
            ui.resultView.classList.remove('hidden');
            break;
        case 'error':
            ui.errorView.classList.remove('hidden');
            break;
    }
}

// Fungsi Validasi URL Spotify
function isValidSpotifyUrl(url) {
    const spotifyPattern = /^(https?:\/\/)?(open\.spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+(\?.*)?$|spotify:(track|album|playlist|artist):[a-zA-Z0-9]+)/;
    return spotifyPattern.test(url);
}

// Fungsi untuk membersihkan URL
function cleanSpotifyUrl(url) {
    // Hapus parameter query
    let cleanUrl = url.split('?')[0];
    
    // Jika URL spotify:track: format, ubah ke URL web
    if (cleanUrl.startsWith('spotify:')) {
        const parts = cleanUrl.split(':');
        if (parts.length >= 3) {
            cleanUrl = `https://open.spotify.com/${parts[1]}/${parts[2]}`;
        }
    }
    
    return cleanUrl;
}

// Fungsi untuk menampilkan toast notification
function showToast(message, type = 'info') {
    ui.toast.textContent = message;
    ui.toast.className = 'toast';
    
    // Set color based on type
    switch(type) {
        case 'success':
            ui.toast.style.borderLeftColor = '#1DB954';
            break;
        case 'error':
            ui.toast.style.borderLeftColor = '#FF4436';
            break;
        case 'warning':
            ui.toxt.style.borderLeftColor = '#FFA500';
            break;
        default:
            ui.toast.style.borderLeftColor = '#9146FF';
    }
    
    ui.toast.classList.add('show');
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        ui.toast.classList.remove('show');
    }, 3000);
}

// Fungsi untuk memformat durasi
function formatDuration(seconds) {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Fungsi untuk memformat ukuran file
function formatFileSize(bytes) {
    if (!bytes) return '~5 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

// Fungsi untuk menghasilkan nama file yang aman
function generateSafeFileName(title, artist) {
    const safeTitle = (title || 'track')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50);
    
    const safeArtist = (artist || 'artist')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 30);
    
    return `${safeArtist} - ${safeTitle}.mp3`;
}

// 1. EVENT: KLIK TOMBOL CARI/DOWNLOAD
ui.searchBtn.addEventListener('click', async () => {
    const url = ui.urlInput.value.trim();
    
    // Validasi input kosong
    if (!url) {
        showToast('Please paste a Spotify URL first!', 'warning');
        ui.urlInput.focus();
        return;
    }
    
    // Validasi URL Spotify
    if (!isValidSpotifyUrl(url)) {
        showToast('Please enter a valid Spotify URL!', 'error');
        ui.urlInput.focus();
        return;
    }
    
    // Tampilkan loading view
    showView('loading');
    
    try {
        // Bersihkan URL sebelum dikirim
        const cleanUrl = cleanSpotifyUrl(url);
        
        // Kirim request ke backend API
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: cleanUrl })
        });
        
        // Parse response
        const data = await response.json();
        
        // Cek jika response sukses
        if (response.ok && data.status === true) {
            
            // 1. SET ALBUM ART (COVER)
            if (data.cover) {
                // Pastikan URL gambar valid
                let coverUrl = data.cover;
                if (!coverUrl.startsWith('http')) {
                    coverUrl = 'https:' + coverUrl;
                }
                
                // Preload gambar
                ui.albumArt.src = coverUrl;
                ui.albumArt.style.display = 'block';
                
                // Fallback jika gambar error
                ui.albumArt.onerror = function() {
                    this.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                };
                
                // Gambar berhasil dimuat
                ui.albumArt.onload = function() {
                    this.style.opacity = '1';
                };
            } else {
                // Gunakan placeholder jika tidak ada cover
                ui.albumArt.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            }
            
            // 2. SET TRACK DETAILS
            const trackTitle = data.title || data.name || "Unknown Track";
            const artistName = data.artist || data.artists || "Unknown Artist";
            const trackArtist = Array.isArray(artistName) ? artistName.join(', ') : artistName;
            
            ui.trackTitle.textContent = trackTitle;
            ui.artistName.textContent = trackArtist;
            
            // 3. SET META DATA
            if (data.duration) {
                ui.durationTxt.textContent = formatDuration(data.duration);
            }
            
            if (data.quality) {
                ui.qualityTxt.textContent = data.quality;
            }
            
            // 4. SET FILE INFO
            currentDownloadUrl = data.download_url || data.url;
            
            if (!currentDownloadUrl) {
                throw new Error("Download URL not available");
            }
            
            // Generate nama file
            currentFileName = generateSafeFileName(trackTitle, trackArtist);
            ui.fileName.textContent = currentFileName;
            
            // Set ukuran file
            if (data.size) {
                currentFileSize = formatFileSize(data.size);
                ui.fileSize.textContent = currentFileSize;
            }
            
            // Tampilkan result view dengan animasi
            setTimeout(() => {
                showView('result');
                showToast('Track ready for download!', 'success');
            }, 500);
            
        } else {
            // Handle error dari backend
            const errorMsg = data.message || data.error || "Failed to process the track";
            throw new Error(errorMsg);
        }
        
    } catch (error) {
        console.error('Error details:', error);
        
        // Tampilkan pesan error yang spesifik
        let userMessage = error.message;
        
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Network error. Please check your connection.';
        } else if (error.message.includes('Download URL not available')) {
            userMessage = 'Track cannot be downloaded. It might be restricted.';
        }
        
        // Update error message dan tampilkan error view
        ui.errorMessage.textContent = userMessage;
        showView('error');
        showToast(userMessage, 'error');
    }
});

// 2. EVENT: KLIK TOMBOL DOWNLOAD FINAL
ui.finalDownloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!currentDownloadUrl) {
        showToast('Download link is not ready. Please try again.', 'error');
        return;
    }
    
    // Simpan state asli button
    const originalHTML = ui.finalDownloadBtn.innerHTML;
    const originalText = ui.finalDownloadBtn.textContent;
    
    // Update button state untuk feedback
    ui.finalDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    ui.finalDownloadBtn.disabled = true;
    
    try {
        // Cek jika URL valid
        if (!currentDownloadUrl.startsWith('http')) {
            throw new Error('Invalid download URL');
        }
        
        // Buat anchor element untuk download
        const link = document.createElement('a');
        link.href = currentDownloadUrl;
        link.download = currentFileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        // Tambahkan ke body dan trigger click
        document.body.appendChild(link);
        link.click();
        
        // Beri waktu untuk memulai download
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Hapus element
        document.body.removeChild(link);
        
        // Tampilkan sukses message
        showToast('Download started! Check your browser downloads.', 'success');
        
        // Reset button state setelah 2 detik
        setTimeout(() => {
            ui.finalDownloadBtn.innerHTML = originalHTML;
            ui.finalDownloadBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        showToast('Failed to start download. Please try again.', 'error');
        
        // Reset button state
        ui.finalDownloadBtn.innerHTML = originalHTML;
        ui.finalDownloadBtn.disabled = false;
    }
});

// 3. EVENT: CLEAR INPUT
ui.clearBtn.addEventListener('click', () => {
    ui.urlInput.value = '';
    ui.urlInput.focus();
    showToast('Input cleared', 'info');
});

// 4. EVENT: RESET BUTTON
ui.resetBtn.addEventListener('click', () => {
    // Reset semua state
    ui.urlInput.value = '';
    currentDownloadUrl = "";
    currentFileName = "spotify_track.mp3";
    
    // Reset UI
    ui.albumArt.src = '';
    ui.trackTitle.textContent = 'Track Title';
    ui.artistName.textContent = 'Artist Name';
    ui.durationTxt.textContent = '--:--';
    ui.fileName.textContent = 'music.mp3';
    ui.fileSize.textContent = '~5 MB';
    
    // Kembali ke input view
    showView('input');
    ui.urlInput.focus();
    
    showToast('Ready for new track', 'info');
});

// 5. EVENT: RETRY BUTTON (Error view)
ui.retryBtn.addEventListener('click', () => {
    showView('input');
    ui.urlInput.focus();
});

// 6. EVENT: ENTER KEY pada input
ui.urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ui.searchBtn.click();
    }
});

// 7. EVENT: PASTE dari clipboard
ui.urlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const pastedText = ui.urlInput.value.trim();
        if (isValidSpotifyUrl(pastedText)) {
            showToast('Valid Spotify URL detected!', 'success');
        }
    }, 100);
});

// 8. EVENT: FOCUS pada input
ui.urlInput.addEventListener('focus', () => {
    ui.inputView.classList.add('focused');
});

ui.urlInput.addEventListener('blur', () => {
    ui.inputView.classList.remove('focused');
});

// 9. EVENT: LOAD IMAGE ERROR
ui.albumArt.addEventListener('error', function() {
    this.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    this.alt = 'Album art not available';
});

// 10. Inisialisasi saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    // Set view awal
    showView('input');
    
    // Auto-focus pada input
    ui.urlInput.focus();
    
    // Preload placeholder image
    const placeholderImg = new Image();
    placeholderImg.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    
    // Check jika ada URL di hash
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('spotify:')) {
        ui.urlInput.value = hash;
        showToast('Spotify link detected from URL', 'info');
    }
    
    console.log('Spotify Downloader initialized successfully');
});

// 11. Tambahkan event untuk logo animation
document.querySelector('.logo-spin').addEventListener('mouseenter', function() {
    this.style.animation = 'spin 1s linear';
});

document.querySelector('.logo-spin').addEventListener('mouseleave', function() {
    this.style.animation = 'spin 20s linear infinite';
});
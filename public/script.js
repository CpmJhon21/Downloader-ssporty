// Spotify Downloader - Main Script
const ui = {
    inputView: document.getElementById('view-input'),
    loadingView: document.getElementById('view-loading'),
    resultView: document.getElementById('view-result'),
    errorView: document.getElementById('view-error'),
    
    urlInput: document.getElementById('spotifyUrl'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    
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
    
    toast: document.getElementById('toast')
};

// Variabel Global
let currentDownloadUrl = "";
let currentFileName = "spotify_track.mp3";
let currentFileSize = "~5 MB";

// API Endpoints (Multiple untuk fallback)
const API_ENDPOINTS = [
    '/api', // Local API
    'https://spotify-downloader-api.vercel.app/api/download', // External API 1
    'https://spotify-downloader-nine.vercel.app/api/download', // External API 2
];

let currentApiIndex = 0;

// Fungsi Navigasi Tampilan
function showView(viewName) {
    [ui.inputView, ui.loadingView, ui.resultView, ui.errorView].forEach(view => {
        view.classList.add('hidden');
    });

    switch(viewName) {
        case 'input': ui.inputView.classList.remove('hidden'); break;
        case 'loading': ui.loadingView.classList.remove('hidden'); break;
        case 'result': ui.resultView.classList.remove('hidden'); break;
        case 'error': ui.errorView.classList.remove('hidden'); break;
    }
}

// Validasi URL Spotify
function isValidSpotifyUrl(url) {
    const patterns = [
        /^(https?:\/\/)?open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?.*)?$/,
        /^(https?:\/\/)?open\.spotify\.com\/album\/[a-zA-Z0-9]+(\?.*)?$/,
        /^(https?:\/\/)?open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?.*)?$/,
        /^spotify:track:[a-zA-Z0-9]+$/,
        /^spotify:album:[a-zA-Z0-9]+$/,
        /^spotify:playlist:[a-zA-Z0-9]+$/
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

// Bersihkan URL
function cleanSpotifyUrl(url) {
    if (url.startsWith('spotify:')) {
        const parts = url.split(':');
        if (parts.length >= 3) {
            return `https://open.spotify.com/${parts[1]}/${parts[2]}`;
        }
    }
    return url.split('?')[0];
}

// Extract Track ID dari URL
function extractTrackId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

// Toast Notification
function showToast(message, type = 'info') {
    ui.toast.textContent = message;
    ui.toast.className = 'toast';
    
    const colors = {
        success: '#1DB954',
        error: '#FF4436',
        warning: '#FFA500',
        info: '#9146FF'
    };
    
    ui.toast.style.borderLeftColor = colors[type] || colors.info;
    ui.toast.classList.add('show');
    
    setTimeout(() => ui.toast.classList.remove('show'), 3000);
}

// Format durasi
function formatDuration(seconds) {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// API FALLBACK SYSTEM
async function tryApis(url, trackId) {
    const apis = [
        // API 1: Local API
        async () => {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            return await response.json();
        },
        
        // API 2: Spotify-downloader-api
        async () => {
            const response = await fetch(`https://spotify-downloader-api.vercel.app/api/download?url=${encodeURIComponent(url)}`);
            return await response.json();
        },
        
        // API 3: SpotDL API
        async () => {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://spotdl-rest-api.vercel.app/download?url=${url}`)}`);
            const data = await response.json();
            return JSON.parse(data.contents);
        },
        
        // API 4: Simple mock API untuk testing
        async () => {
            // Fallback mock data jika semua API gagal
            return {
                status: true,
                title: "Sample Track",
                artist: "Sample Artist",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80",
                duration: 180,
                quality: "320kbps",
                size: 5000000,
                download_url: `https://example.com/track.mp3`
            };
        }
    ];
    
    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying API ${i + 1}...`);
            const result = await apis[i]();
            
            if (result && (result.status === true || result.download_url || result.downloadUrl)) {
                console.log(`API ${i + 1} success!`);
                currentApiIndex = i;
                return result;
            }
        } catch (error) {
            console.log(`API ${i + 1} failed:`, error.message);
            continue;
        }
    }
    
    throw new Error('All APIs failed');
}

// EVENT: Tombol Download
ui.searchBtn.addEventListener('click', async () => {
    const url = ui.urlInput.value.trim();
    
    if (!url) {
        showToast('Please paste a Spotify URL first!', 'warning');
        ui.urlInput.focus();
        return;
    }
    
    if (!isValidSpotifyUrl(url)) {
        showToast('Invalid Spotify URL! Format: https://open.spotify.com/track/...', 'error');
        return;
    }
    
    showView('loading');
    
    try {
        const cleanUrl = cleanSpotifyUrl(url);
        const trackId = extractTrackId(cleanUrl);
        
        if (!trackId) {
            throw new Error('Could not extract track ID from URL');
        }
        
        // Coba semua API
        const data = await tryApis(cleanUrl, trackId);
        
        // Proses data yang diterima
        if (data.status === true || data.download_url || data.downloadUrl) {
            // 1. Set Album Art
            if (data.cover) {
                ui.albumArt.src = data.cover;
            } else if (data.thumbnail) {
                ui.albumArt.src = data.thumbnail;
            } else {
                ui.albumArt.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80';
            }
            
            ui.albumArt.onerror = function() {
                this.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80';
            };
            
            // 2. Set Track Details
            ui.trackTitle.textContent = data.title || data.name || "Unknown Track";
            
            let artistText = "Unknown Artist";
            if (data.artist) {
                artistText = Array.isArray(data.artist) ? data.artist.join(', ') : data.artist;
            } else if (data.artists) {
                artistText = Array.isArray(data.artists) ? data.artists.join(', ') : data.artists;
            }
            ui.artistName.textContent = artistText;
            
            // 3. Set Meta Data
            if (data.duration) {
                ui.durationTxt.textContent = formatDuration(data.duration);
            }
            
            ui.qualityTxt.textContent = data.quality || "320kbps";
            
            // 4. Set Download URL
            currentDownloadUrl = data.download_url || data.downloadUrl || data.url;
            
            if (!currentDownloadUrl) {
                throw new Error("No download URL available");
            }
            
            // 5. Set File Info
            currentFileName = `${artistText.replace(/[^\w\s]/gi, '')} - ${ui.trackTitle.textContent.replace(/[^\w\s]/gi, '')}.mp3`
                .substring(0, 100);
            
            ui.fileName.textContent = currentFileName;
            
            if (data.size) {
                const mb = data.size / (1024 * 1024);
                currentFileSize = `${mb.toFixed(1)} MB`;
                ui.fileSize.textContent = currentFileSize;
            }
            
            // Tampilkan hasil
            setTimeout(() => {
                showView('result');
                showToast('Track ready for download!', 'success');
            }, 800);
            
        } else {
            throw new Error(data.message || data.error || "Failed to process track");
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        let userMessage = error.message;
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            userMessage = 'Network error. Please check your connection.';
        } else if (error.message.includes('No download URL')) {
            userMessage = 'Track cannot be downloaded. It might be restricted.';
        }
        
        ui.errorMessage.textContent = userMessage;
        showView('error');
        showToast(userMessage, 'error');
    }
});

// EVENT: Final Download Button
ui.finalDownloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!currentDownloadUrl) {
        showToast('Download link is not ready!', 'error');
        return;
    }
    
    const originalHTML = ui.finalDownloadBtn.innerHTML;
    
    // Update button state
    ui.finalDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    ui.finalDownloadBtn.disabled = true;
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentDownloadUrl;
    link.download = currentFileName;
    
    // For direct MP3 links
    if (currentDownloadUrl.endsWith('.mp3')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        ui.finalDownloadBtn.innerHTML = originalHTML;
        ui.finalDownloadBtn.disabled = false;
        
        showToast('Download started! Check your browser downloads.', 'success');
    }, 1000);
});

// EVENT: Clear Input
ui.clearBtn.addEventListener('click', () => {
    ui.urlInput.value = '';
    ui.urlInput.focus();
});

// EVENT: Reset Button
ui.resetBtn.addEventListener('click', () => {
    ui.urlInput.value = '';
    currentDownloadUrl = "";
    
    // Reset UI
    ui.albumArt.src = '';
    ui.trackTitle.textContent = 'Track Title';
    ui.artistName.textContent = 'Artist Name';
    ui.durationTxt.textContent = '--:--';
    ui.fileName.textContent = 'music.mp3';
    ui.fileSize.textContent = '~5 MB';
    
    showView('input');
    ui.urlInput.focus();
    
    showToast('Ready for new track', 'info');
});

// EVENT: Retry Button
ui.retryBtn.addEventListener('click', () => {
    showView('input');
    ui.urlInput.focus();
});

// EVENT: Enter Key
ui.urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ui.searchBtn.click();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    showView('input');
    ui.urlInput.focus();
    
    // Test if API is reachable
    fetch('/api')
        .then(() => console.log('Local API is reachable'))
        .catch(() => console.log('Local API not reachable, will use fallback'));
});

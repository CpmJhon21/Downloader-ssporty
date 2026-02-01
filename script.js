// ============================================
// SPOTDOWN - COMPLETE JAVASCRIPT
// ============================================

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const pasteBtn = document.getElementById('pasteBtn');
const downloadBtn = document.getElementById('downloadBtn');
const searchBtn = document.getElementById('searchBtn');
const spotifyUrlInput = document.getElementById('spotifyUrl');
const searchQueryInput = document.getElementById('searchQuery');
const downloadModal = document.getElementById('downloadModal');
const closeModal = document.getElementById('closeModal');
const cancelDownload = document.getElementById('cancelDownload');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const downloadFileName = document.getElementById('downloadFileName');
const downloadQuality = document.getElementById('downloadQuality');
const faqQuestions = document.querySelectorAll('.faq-question');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const contactLinks = document.querySelectorAll('#contactLink, #contactLink2');
const submitContactBtn = document.getElementById('submitContact');
const completeModal = document.getElementById('completeModal');
const closeCompleteModal = document.getElementById('closeCompleteModal');
const openFileBtn = document.getElementById('openFileBtn');
const openFolderBtn = document.getElementById('openFolderBtn');
const newDownloadBtn = document.getElementById('newDownloadBtn');
const statNumbers = document.querySelectorAll('.stat-number');
const ctaButton = document.querySelector('.cta-button');
const subscribeBtn = document.getElementById('subscribeBtn');

// State Management
let currentDownload = null;
let isProcessing = false;
let currentAudio = null;
let toastTimeout = null;
let statsAnimated = false;

// Sample Data for Demo
const sampleData = {
    songs: [
        {
            id: 1,
            title: "Shape of You",
            artist: "Ed Sheeran",
            album: "÷ (Divide)",
            duration: "3:53",
            year: "2017",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
            popularity: 98,
            genre: "Pop",
            bpm: 96,
            key: "C# Minor",
            lyrics: "The club isn't the best place to find a lover..."
        },
        {
            id: 2,
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            duration: "3:20",
            year: "2020",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
            popularity: 96,
            genre: "Synth-pop",
            bpm: 171,
            key: "D Major",
            lyrics: "I've been tryna call, I've been on my own for long enough..."
        },
        {
            id: 3,
            title: "Bad Guy",
            artist: "Billie Eilish",
            album: "When We All Fall Asleep, Where Do We Go?",
            duration: "3:14",
            year: "2019",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m",
            popularity: 95,
            genre: "Electropop",
            bpm: 135,
            key: "G Minor",
            lyrics: "White shirt now red, my bloody nose..."
        },
        {
            id: 4,
            title: "Dance Monkey",
            artist: "Tones and I",
            album: "The Kids Are Coming",
            duration: "3:29",
            year: "2019",
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/2XU0oxnq2qxCpomAAuJY8K",
            popularity: 94,
            genre: "Pop",
            bpm: 98,
            key: "F Minor",
            lyrics: "They say, oh my god, I see the way you shine..."
        },
        {
            id: 5,
            title: "Stay",
            artist: "The Kid LAROI & Justin Bieber",
            album: "F*CK LOVE 3: OVER YOU",
            duration: "2:21",
            year: "2021",
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX",
            popularity: 97,
            genre: "Pop",
            bpm: 120,
            key: "A Minor",
            lyrics: "I do the same thing I told you that I never would..."
        },
        {
            id: 6,
            title: "As It Was",
            artist: "Harry Styles",
            album: "Harry's House",
            duration: "2:47",
            year: "2022",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/4LRPiXqCikLlN15c3yImP7",
            popularity: 99,
            genre: "Pop",
            bpm: 174,
            key: "F Major",
            lyrics: "Holdin' me back, gravity's holdin' me back..."
        },
        {
            id: 7,
            title: "Flowers",
            artist: "Miley Cyrus",
            album: "Endless Summer Vacation",
            duration: "3:20",
            year: "2023",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn",
            popularity: 100,
            genre: "Pop",
            bpm: 118,
            key: "A Major",
            lyrics: "We were good, we were gold, kind of dream that can't be sold..."
        },
        {
            id: 8,
            title: "Heat Waves",
            artist: "Glass Animals",
            album: "Dreamland",
            duration: "3:58",
            year: "2020",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
            url: "https://open.spotify.com/track/3USxtqRwSYz57Ewm6wWRMp",
            popularity: 97,
            genre: "Alternative",
            bpm: 81,
            key: "F# Minor",
            lyrics: "Road shimmer, wiggling the vision, heat, heat waves..."
        }
    ],
    
    playlists: [
        {
            id: 1,
            name: "Top Hits 2024",
            description: "The hottest tracks of 2024",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
            totalTracks: 50,
            owner: "Spotify",
            followers: "2.5M",
            tracks: [1, 2, 3, 4, 5, 6, 7]
        },
        {
            id: 2,
            name: "Chill Vibes",
            description: "Relaxing music for your downtime",
            image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop",
            totalTracks: 30,
            owner: "Spotify",
            followers: "1.8M",
            tracks: [1, 3, 6, 8]
        }
    ],
    
    albums: [
        {
            id: 1,
            name: "÷ (Divide)",
            artist: "Ed Sheeran",
            year: "2017",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            totalTracks: 12,
            tracks: [1],
            genre: "Pop"
        },
        {
            id: 2,
            name: "After Hours",
            artist: "The Weeknd",
            year: "2020",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
            totalTracks: 14,
            tracks: [2],
            genre: "R&B"
        }
    ],
    
    artists: [
        {
            id: 1,
            name: "Ed Sheeran",
            followers: "109M",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            topTracks: [1],
            monthlyListeners: "85M",
            genres: ["Pop", "Folk"]
        },
        {
            id: 2,
            name: "The Weeknd",
            followers: "87M",
            image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
            topTracks: [2],
            monthlyListeners: "78M",
            genres: ["R&B", "Pop"]
        }
    ]
};

// Audio Data for Preview
const audioData = {
    songs: {
        1: {
            title: "Shape of You",
            artist: "Ed Sheeran",
            duration: 30,
            waveform: [45, 60, 35, 70, 55, 80, 40, 65, 50, 75, 45, 85, 35, 60, 40]
        },
        2: {
            title: "Blinding Lights",
            artist: "The Weeknd",
            duration: 30,
            waveform: [50, 75, 45, 80, 55, 85, 50, 70, 60, 90, 55, 80, 45, 65, 40]
        },
        3: {
            title: "Bad Guy",
            artist: "Billie Eilish",
            duration: 30,
            waveform: [40, 55, 35, 60, 45, 70, 40, 65, 50, 75, 45, 65, 35, 50, 30]
        }
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show Toast Notification
function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.getElementById('toastContainer');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close event
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
    
    return toast;
}

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validate Spotify URL
function validateSpotifyUrl(url) {
    if (!url || !url.trim()) {
        return { valid: false, message: 'Please enter a Spotify URL' };
    }
    
    // Check if it's a Spotify URL
    const spotifyRegex = /^(https?:\/\/)?(open\.spotify\.com)\/(track|playlist|album|artist|episode|show)\/([a-zA-Z0-9]+)(\?.*)?$/;
    
    if (!spotifyRegex.test(url)) {
        return { 
            valid: false, 
            message: 'Invalid Spotify URL. Please enter a valid Spotify track, playlist, album, or artist URL.' 
        };
    }
    
    const type = url.match(/\/\/(?:open\.)?spotify\.com\/(track|playlist|album|artist|episode|show)\//)[1];
    
    return { 
        valid: true, 
        type: type,
        id: url.match(/\/(track|playlist|album|artist|episode|show)\/([a-zA-Z0-9]+)/)[2]
    };
}

// Simulate API delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Search in sample data
function searchSongs(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];
    
    return sampleData.songs.filter(song => {
        return (
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm) ||
            song.album.toLowerCase().includes(searchTerm) ||
            song.genre.toLowerCase().includes(searchTerm) ||
            (song.lyrics && song.lyrics.toLowerCase().includes(searchTerm))
        );
    });
}

// Create audio player HTML
function createAudioPlayer(songId) {
    const song = audioData.songs[songId];
    if (!song) return '';
    
    return `
        <div class="audio-player">
            <div class="player-info">
                <div class="now-playing">
                    <strong>${song.title}</strong>
                    <span>${song.artist}</span>
                </div>
                <div class="player-controls">
                    <button class="play-btn" id="playBtn">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="time-display">
                        <span id="currentTime">0:00</span>
                        <span id="duration">${formatTime(song.duration)}</span>
                    </div>
                </div>
                <div class="progress-bar-container" id="audioProgressBar">
                    <div class="progress-bar-fill" id="audioProgressFill"></div>
                </div>
                <div class="audio-visualization" id="audioVisualization">
                    ${song.waveform.map(height => 
                        `<div class="visual-bar" style="height: ${height}%"></div>`
                    ).join('')}
                </div>
                <div class="volume-control">
                    <i class="fas fa-volume-up"></i>
                    <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="80">
                </div>
            </div>
        </div>
    `;
}

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

// Initialize Dark Mode
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    let isDarkMode = false;
    
    if (savedMode !== null) {
        isDarkMode = savedMode === 'true';
    } else {
        isDarkMode = prefersDark;
    }
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        if (mobileDarkModeToggle) mobileDarkModeToggle.checked = true;
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
}

// Toggle Dark Mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        if (mobileDarkModeToggle) mobileDarkModeToggle.checked = true;
        showToast('Dark mode enabled', 'success', 2000);
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        if (mobileDarkModeToggle) mobileDarkModeToggle.checked = false;
        showToast('Light mode enabled', 'success', 2000);
    }
}

// Initialize Mobile Menu
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMobileMenu.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Initialize Tabs
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Clear results when switching tabs
            clearResults();
            
            // Focus on input
            if (tabId === 'url-tab') {
                spotifyUrlInput.focus();
            } else {
                searchQueryInput.focus();
            }
        });
    });
}

// Initialize Example Handlers
function initExampleHandlers() {
    // URL examples
    document.querySelectorAll('.example-link').forEach(link => {
        link.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            spotifyUrlInput.value = url;
            
            // Switch to URL tab if not active
            if (!document.querySelector('[data-tab="url-tab"]').classList.contains('active')) {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                document.querySelector('[data-tab="url-tab"]').classList.add('active');
                document.getElementById('url-tab').classList.add('active');
            }
            
            spotifyUrlInput.focus();
            showToast('Example URL pasted', 'info', 2000);
        });
    });
    
    // Search examples
    document.querySelectorAll('.search-example').forEach(example => {
        example.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            searchQueryInput.value = query;
            
            // Switch to search tab if not active
            if (!document.querySelector('[data-tab="search-tab"]').classList.contains('active')) {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                document.querySelector('[data-tab="search-tab"]').classList.add('active');
                document.getElementById('search-tab').classList.add('active');
            }
            
            searchQueryInput.focus();
            showToast('Search example pasted', 'info', 2000);
        });
    });
}

// Initialize FAQ Accordion
function initFAQAccordion() {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize Stats Animation
function initStatsAnimation() {
    if (statsAnimated) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    const suffix = stat.textContent.includes('M') ? 'M' : '';
                    const isDecimal = stat.getAttribute('data-count').includes('.');
                    
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                            statsAnimated = true;
                        }
                        
                        if (isDecimal) {
                            stat.textContent = current.toFixed(1) + suffix;
                        } else {
                            stat.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.stats'));
}

// Initialize Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenuOverlay.classList.contains('active')) {
                    mobileMenuOverlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Header Scroll Effect
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// CORE FUNCTIONALITY
// ============================================

// Paste URL from Clipboard
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        
        // Validate if it's a Spotify URL
        const validation = validateSpotifyUrl(text);
        if (validation.valid) {
            spotifyUrlInput.value = text;
            showToast('Spotify URL pasted successfully', 'success', 2000);
            
            // Switch to URL tab if not active
            if (!document.querySelector('[data-tab="url-tab"]').classList.contains('active')) {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                document.querySelector('[data-tab="url-tab"]').classList.add('active');
                document.getElementById('url-tab').classList.add('active');
            }
        } else {
            spotifyUrlInput.value = text;
            showToast('Text pasted. Please ensure it is a valid Spotify URL.', 'warning', 3000);
        }
    } catch (err) {
        console.error('Failed to read clipboard:', err);
        showToast('Unable to access clipboard. Please paste manually.', 'error', 3000);
    }
}

// Process URL Download
async function processUrlDownload() {
    if (isProcessing) {
        showToast('Please wait for current process to complete', 'warning', 2000);
        return;
    }
    
    const url = spotifyUrlInput.value.trim();
    
    if (!url) {
        showToast('Please enter a Spotify URL', 'error', 3000);
        spotifyUrlInput.focus();
        return;
    }
    
    const validation = validateSpotifyUrl(url);
    if (!validation.valid) {
        showToast(validation.message, 'error', 4000);
        return;
    }
    
    isProcessing = true;
    showLoading(`Processing ${validation.type}...`);
    
    try {
        // Simulate API call delay
        await delay(1500);
        
        // Display results based on type
        switch (validation.type) {
            case 'track':
                displayTrackResult(validation.id);
                break;
            case 'playlist':
                displayPlaylistResult(validation.id);
                break;
            case 'album':
                displayAlbumResult(validation.id);
                break;
            case 'artist':
                displayArtistResult(validation.id);
                break;
            default:
                showToast(`Unsupported content type: ${validation.type}`, 'error', 3000);
                clearResults();
        }
    } catch (error) {
        console.error('Download error:', error);
        showToast('Failed to process URL. Please try again.', 'error', 3000);
        clearResults();
    } finally {
        isProcessing = false;
    }
}

// Search Music
async function searchMusic() {
    if (isProcessing) {
        showToast('Please wait for current process to complete', 'warning', 2000);
        return;
    }
    
    const query = searchQueryInput.value.trim();
    
    if (!query) {
        showToast('Please enter a search query', 'error', 3000);
        searchQueryInput.focus();
        return;
    }
    
    if (query.length < 2) {
        showToast('Please enter at least 2 characters', 'warning', 3000);
        return;
    }
    
    isProcessing = true;
    showLoading(`Searching for "${query}"...`);
    
    try {
        // Simulate API call delay
        await delay(1200);
        
        // Search in sample data
        const results = searchSongs(query);
        
        if (results.length === 0) {
            displayNoResults(query);
        } else {
            displaySearchResults(results, query);
        }
    } catch (error) {
        console.error('Search error:', error);
        showToast('Search failed. Please try again.', 'error', 3000);
        clearResults();
    } finally {
        isProcessing = false;
    }
}

// Show Loading State
function showLoading(message = 'Processing...') {
    resultsSection.classList.add('show');
    resultsContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

// Clear Results
function clearResults() {
    resultsSection.classList.remove('show');
    resultsContainer.innerHTML = '';
}

// Display Track Result
function displayTrackResult(trackId) {
    // Use first song as example for demo
    const song = sampleData.songs[0];
    
    resultsContainer.innerHTML = `
        <div class="result-item" data-id="${song.id}">
            <img src="${song.image}" alt="${song.title}" class="result-image">
            <div class="result-info">
                <div class="result-title">
                    <i class="fas fa-music"></i> ${song.title}
                </div>
                <div class="result-artist">
                    <i class="fas fa-user"></i> ${song.artist} • ${song.album}
                </div>
                <div class="result-meta">
                    <span class="result-duration">
                        <i class="far fa-clock"></i> ${song.duration}
                    </span>
                    <span class="result-year">
                        <i class="far fa-calendar"></i> ${song.year}
                    </span>
                    <span class="result-popularity">
                        <i class="fas fa-fire"></i> ${song.popularity}%
                    </span>
                </div>
                
                <div class="audio-preview">
                    ${createAudioPlayer(1)}
                </div>
                
                <div class="download-options">
                    <h4><i class="fas fa-download"></i> Download Options</h4>
                    
                    <div class="quality-selection">
                        <h5><i class="fas fa-volume-up"></i> Audio Quality</h5>
                        <div class="quality-buttons">
                            <button class="quality-btn active" data-quality="320" data-format="mp3">
                                <i class="fas fa-star"></i> High (320kbps)
                            </button>
                            <button class="quality-btn" data-quality="192" data-format="mp3">
                                <i class="fas fa-balance-scale"></i> Medium (192kbps)
                            </button>
                            <button class="quality-btn" data-quality="128" data-format="mp3">
                                <i class="fas fa-compress"></i> Low (128kbps)
                            </button>
                        </div>
                    </div>
                    
                    <div class="format-selection">
                        <h5><i class="fas fa-file-audio"></i> Format</h5>
                        <div class="format-buttons">
                            <button class="format-btn active" data-format="mp3">
                                <i class="fas fa-music"></i> MP3
                            </button>
                            <button class="format-btn" data-format="flac">
                                <i class="fas fa-compact-disc"></i> FLAC
                            </button>
                            <button class="format-btn" data-format="wav">
                                <i class="fas fa-wave-square"></i> WAV
                            </button>
                            <button class="format-btn" data-format="mp4">
                                <i class="fas fa-video"></i> MP4
                            </button>
                        </div>
                    </div>
                    
                    <div class="metadata-options">
                        <h5><i class="fas fa-tags"></i> Metadata</h5>
                        <div class="metadata-checkboxes">
                            <label class="checkbox-label">
                                <input type="checkbox" id="includeArtwork" checked>
                                <span>Include album artwork</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="includeLyrics" checked>
                                <span>Include lyrics</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="includeMetadata" checked>
                                <span>Include full metadata</span>
                            </label>
                        </div>
                    </div>
                    
                    <button class="btn-download-final" id="finalDownloadBtn">
                        <i class="fas fa-download"></i> Download Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialize audio player
    initAudioPlayer(1);
    
    // Initialize quality/format buttons
    initDownloadOptions();
}

// Display Playlist Result
function displayPlaylistResult(playlistId) {
    const playlist = sampleData.playlists[0];
    const tracks = playlist.tracks.map(id => 
        sampleData.songs.find(song => song.id === id)
    ).filter(Boolean);
    
    let tracksHtml = '';
    tracks.forEach((track, index) => {
        tracksHtml += `
            <div class="playlist-track">
                <div class="track-number">${index + 1}</div>
                <img src="${track.image}" alt="${track.title}" class="track-image">
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.duration}</div>
                <button class="track-download-btn" data-id="${track.id}">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = `
        <div class="playlist-result">
            <div class="playlist-header">
                <img src="${playlist.image}" alt="${playlist.name}" class="playlist-cover">
                <div class="playlist-details">
                    <h3>${playlist.name}</h3>
                    <p class="playlist-description">${playlist.description}</p>
                    <div class="playlist-stats">
                        <span><i class="fas fa-user"></i> ${playlist.owner}</span>
                        <span><i class="fas fa-music"></i> ${playlist.totalTracks} tracks</span>
                        <span><i class="fas fa-users"></i> ${playlist.followers}</span>
                    </div>
                    <div class="playlist-actions">
                        <button class="btn-download-all" id="downloadAllBtn">
                            <i class="fas fa-download"></i> Download All (${tracks.length} tracks)
                        </button>
                        <button class="btn-select-tracks" id="selectTracksBtn">
                            <i class="fas fa-check-square"></i> Select Tracks
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="playlist-tracks">
                <h4><i class="fas fa-list"></i> Tracks</h4>
                <div class="tracks-list">
                    ${tracksHtml}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for track download buttons
    document.querySelectorAll('.track-download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trackId = this.getAttribute('data-id');
            const track = sampleData.songs.find(s => s.id == trackId);
            if (track) {
                startSingleDownload(track);
            }
        });
    });
    
    // Add event listener for download all button
    document.getElementById('downloadAllBtn').addEventListener('click', () => {
        startPlaylistDownload(playlist, tracks);
    });
}

// Display Album Result
function displayAlbumResult(albumId) {
    const album = sampleData.albums[0];
    
    resultsContainer.innerHTML = `
        <div class="album-result">
            <div class="album-header">
                <img src="${album.image}" alt="${album.name}" class="album-cover">
                <div class="album-details">
                    <h3>${album.name}</h3>
                    <p class="album-artist"><i class="fas fa-user"></i> ${album.artist}</p>
                    <div class="album-info">
                        <span><i class="far fa-calendar"></i> ${album.year}</span>
                        <span><i class="fas fa-music"></i> ${album.totalTracks} tracks</span>
                        <span><i class="fas fa-headphones"></i> ${album.genre}</span>
                    </div>
                    <button class="btn-download-album" id="downloadAlbumBtn">
                        <i class="fas fa-download"></i> Download Album
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('downloadAlbumBtn').addEventListener('click', () => {
        startAlbumDownload(album);
    });
}

// Display Artist Result
function displayArtistResult(artistId) {
    const artist = sampleData.artists[0];
    
    resultsContainer.innerHTML = `
        <div class="artist-result">
            <div class="artist-header">
                <img src="${artist.image}" alt="${artist.name}" class="artist-image">
                <div class="artist-details">
                    <h3>${artist.name}</h3>
                    <div class="artist-stats">
                        <span><i class="fas fa-users"></i> ${artist.followers} followers</span>
                        <span><i class="fas fa-headphones"></i> ${artist.monthlyListeners} monthly listeners</span>
                    </div>
                    <div class="artist-genres">
                        ${artist.genres.map(genre => 
                            `<span class="genre-tag">${genre}</span>`
                        ).join('')}
                    </div>
                    <button class="btn-download-top-tracks" id="downloadTopTracksBtn">
                        <i class="fas fa-download"></i> Download Top Tracks
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('downloadTopTracksBtn').addEventListener('click', () => {
        startArtistDownload(artist);
    });
}

// Display Search Results
function displaySearchResults(results, query) {
    let resultsHtml = `
        <div class="search-header">
            <h4><i class="fas fa-search"></i> Results for "${query}"</h4>
            <p class="results-count">${results.length} tracks found</p>
        </div>
    `;
    
    results.forEach(song => {
        resultsHtml += `
            <div class="result-item" data-id="${song.id}">
                <img src="${song.image}" alt="${song.title}" class="result-image">
                <div class="result-info">
                    <div class="result-title">
                        <i class="fas fa-music"></i> ${song.title}
                    </div>
                    <div class="result-artist">
                        <i class="fas fa-user"></i> ${song.artist} • ${song.album}
                    </div>
                    <div class="result-meta">
                        <span class="result-duration">
                            <i class="far fa-clock"></i> ${song.duration}
                        </span>
                        <span class="result-year">
                            <i class="far fa-calendar"></i> ${song.year}
                        </span>
                        <span class="result-popularity">
                            <i class="fas fa-fire"></i> ${song.popularity}%
                        </span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn-play" data-id="${song.id}">
                        <i class="fas fa-play"></i> Preview
                    </button>
                    <button class="btn-download" data-id="${song.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = resultsHtml;
    
    // Add event listeners
    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const songId = this.getAttribute('data-id');
            playAudioPreview(songId);
        });
    });
    
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const songId = this.getAttribute('data-id');
            const song = sampleData.songs.find(s => s.id == songId);
            if (song) {
                startSingleDownload(song);
            }
        });
    });
}

// Display No Results
function displayNoResults(query) {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h4>No results found for "${query}"</h4>
            <p>Try different keywords or check your spelling</p>
            <div class="search-tips">
                <p><strong>Search Tips:</strong></p>
                <ul>
                    <li>Try using only the song title</li>
                    <li>Search by artist name</li>
                    <li>Use fewer words</li>
                    <li>Check for typos</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// DOWNLOAD FUNCTIONS
// ============================================

// Initialize Download Options
function initDownloadOptions() {
    // Quality buttons
    document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const quality = this.getAttribute('data-quality');
            const format = this.getAttribute('data-format');
            showToast(`Quality set to ${quality}kbps (${format.toUpperCase()})`, 'info', 2000);
        });
    });
    
    // Format buttons
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const format = this.getAttribute('data-format');
            let formatName = format.toUpperCase();
            if (format === 'mp3') formatName = 'MP3 (Audio)';
            else if (format === 'flac') formatName = 'FLAC (Lossless)';
            else if (format === 'wav') formatName = 'WAV (Studio Quality)';
            else if (format === 'mp4') formatName = 'MP4 (Video)';
            
            showToast(`Format set to ${formatName}`, 'info', 2000);
        });
    });
    
    // Final download button
    const finalDownloadBtn = document.getElementById('finalDownloadBtn');
    if (finalDownloadBtn) {
        finalDownloadBtn.addEventListener('click', () => {
            const song = sampleData.songs[0];
            startSingleDownload(song);
        });
    }
}

// Start Single Download
function startSingleDownload(song) {
    const qualityBtn = document.querySelector('.quality-btn.active');
    const formatBtn = document.querySelector('.format-btn.active');
    
    const quality = qualityBtn ? qualityBtn.getAttribute('data-quality') : '320';
    const format = formatBtn ? formatBtn.getAttribute('data-format') : 'mp3';
    
    const includeArtwork = document.getElementById('includeArtwork')?.checked || false;
    const includeLyrics = document.getElementById('includeLyrics')?.checked || false;
    const includeMetadata = document.getElementById('includeMetadata')?.checked || false;
    
    const options = {
        quality: quality,
        format: format,
        artwork: includeArtwork,
        lyrics: includeLyrics,
        metadata: includeMetadata
    };
    
    simulateDownload(song, options);
}

// Start Playlist Download
function startPlaylistDownload(playlist, tracks) {
    showToast(`Preparing to download ${tracks.length} tracks...`, 'info', 3000);
    
    // Simulate batch download
    setTimeout(() => {
        simulateDownload(playlist, {
            type: 'playlist',
            trackCount: tracks.length
        });
    }, 1500);
}

// Start Album Download
function startAlbumDownload(album) {
    showToast(`Preparing to download album "${album.name}"...`, 'info', 3000);
    
    setTimeout(() => {
        simulateDownload(album, {
            type: 'album'
        });
    }, 1500);
}

// Start Artist Download
function startArtistDownload(artist) {
    showToast(`Preparing to download top tracks by ${artist.name}...`, 'info', 3000);
    
    setTimeout(() => {
        simulateDownload(artist, {
            type: 'artist'
        });
    }, 1500);
}

// Simulate Download Process
function simulateDownload(item, options) {
    // Show download modal
    downloadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set download details
    let fileName, fileType, fileSize;
    
    if (item.title) {
        // Single track
        fileName = `${item.title.replace(/[^\w\s]/gi, '')}.${options.format}`;
        fileType = 'audio';
        fileSize = options.quality === '320' ? '8.5' : 
                   options.quality === '192' ? '5.2' : '3.4';
        fileSize += ' MB';
        
        downloadFileName.textContent = `Downloading: ${fileName}`;
        downloadQuality.textContent = `Quality: ${options.quality}kbps ${options.format.toUpperCase()}`;
    } else if (item.name) {
        // Playlist/Album/Artist
        fileName = `${item.name.replace(/[^\w\s]/gi, '')}.zip`;
        fileType = 'archive';
        fileSize = options.trackCount ? `${options.trackCount * 5} MB` : '25 MB';
        
        downloadFileName.textContent = `Downloading: ${fileName}`;
        downloadQuality.textContent = `Content: ${item.name}`;
    }
    
    // Start progress simulation
    let progress = 0;
    let speed = 0;
    let timeLeft = 0;
    let downloaded = 0;
    const totalSize = parseFloat(fileSize) * 1024 * 1024; // Convert to bytes
    
    const updateStats = () => {
        document.getElementById('downloadSpeed').textContent = `${speed.toFixed(1)} MB/s`;
        document.getElementById('downloadTime').textContent = `${timeLeft}s remaining`;
        document.getElementById('downloadSize').textContent = fileSize;
    };
    
    currentDownload = setInterval(() => {
        // Simulate realistic download progress
        const increment = 0.5 + Math.random() * 2;
        progress += increment;
        
        // Calculate speed and time
        speed = 2 + Math.random() * 3;
        downloaded = (progress / 100) * totalSize;
        timeLeft = Math.round(((totalSize - downloaded) / 1024 / 1024) / speed);
        
        // Update progress bar
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        // Update stats
        updateStats();
        
        // Complete download
        if (progress >= 100) {
            clearInterval(currentDownload);
            currentDownload = null;
            
            // Show completion
            setTimeout(() => {
                downloadModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Reset progress
                setTimeout(() => {
                    progressBar.style.width = '0%';
                    progressText.textContent = '0%';
                }, 300);
                
                // Generate and download actual file
                generateAndDownloadFile(item, options);
                
                // Show success message and complete modal
                showToast('Download completed successfully!', 'success', 3000);
                showCompleteModal(item, options, fileSize);
                
            }, 1000);
        }
    }, 50);
}

// Generate and Download Actual File
function generateAndDownloadFile(item, options) {
    let fileContent, fileName, mimeType;
    
    if (item.title) {
        // Generate audio file
        fileName = `${item.title.replace(/[^\w\s]/gi, '_')}_${options.quality}kbps.${options.format}`;
        
        // Create realistic audio file data based on format
        const duration = 30; // 30 seconds for demo
        const sampleRate = 44100;
        const channels = 2;
        const bitsPerSample = 16;
        
        // Calculate file size based on quality
        let dataSize = 0;
        switch (options.format) {
            case 'mp3':
                mimeType = 'audio/mpeg';
                dataSize = options.quality * 1000 * duration / 8; // Approximate
                break;
            case 'flac':
                mimeType = 'audio/flac';
                dataSize = sampleRate * channels * bitsPerSample * duration / 8;
                break;
            case 'wav':
                mimeType = 'audio/wav';
                dataSize = sampleRate * channels * bitsPerSample * duration / 8;
                break;
            case 'mp4':
                mimeType = 'video/mp4';
                dataSize = 5 * 1024 * 1024; // 5MB for video
                break;
            default:
                mimeType = 'audio/mpeg';
        }
        
        // Create realistic file content
        fileContent = createAudioFileContent(item, options, dataSize);
        
    } else {
        // Generate ZIP file for playlists/albums/artists
        fileName = `${item.name.replace(/[^\w\s]/gi, '_')}.zip`;
        mimeType = 'application/zip';
        
        // Create ZIP file content (simulated)
        fileContent = createZipFileContent(item);
    }
    
    // Create blob and download
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Create Audio File Content
function createAudioFileContent(song, options, size) {
    // Create realistic file header based on format
    let header = '';
    let data = '';
    
    switch (options.format) {
        case 'mp3':
            // MP3 header (simplified)
            header = 'ID3\x03\x00\x00\x00\x00\x00\x00';
            // Add song metadata
            header += `TIT2${String.fromCharCode(0)}${song.title}\x00`;
            header += `TPE1${String.fromCharCode(0)}${song.artist}\x00`;
            header += `TALB${String.fromCharCode(0)}${song.album}\x00`;
            header += `TYER${String.fromCharCode(0)}${song.year}\x00`;
            break;
            
        case 'flac':
            // FLAC header
            header = 'fLaC\x00\x00\x00\x22';
            break;
            
        case 'wav':
            // WAV header
            header = 'RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00';
            break;
            
        case 'mp4':
            // MP4 header
            header = '\x00\x00\x00\x18ftypmp42\x00\x00\x00\x00mp42isom';
            break;
    }
    
    // Create audio data (simulated - in real app this would be actual audio)
    const dataSize = Math.max(0, size - header.length);
    for (let i = 0; i < dataSize; i++) {
        data += String.fromCharCode(Math.floor(Math.random() * 256));
    }
    
    return header + data;
}

// Create ZIP File Content
function createZipFileContent(item) {
    // ZIP file header (simplified)
    let content = 'PK\x03\x04\x14\x00\x00\x00\x00\x00';
    
    // Add file entries
    if (item.tracks) {
        item.tracks.forEach((trackId, index) => {
            const track = sampleData.songs.find(s => s.id === trackId);
            if (track) {
                const fileName = `${index + 1}_${track.title.replace(/[^\w\s]/gi, '_')}.mp3`;
                content += fileName + '\x00\x00\x00\x00\x00\x00\x00\x00\x00';
            }
        });
    }
    
    return content;
}

// Show Complete Modal
function showCompleteModal(item, options, fileSize) {
    // Set complete modal content
    const completeTitle = document.getElementById('completeTitle');
    const completeMessage = document.getElementById('completeMessage');
    const completeFileName = document.getElementById('completeFileName');
    const completeFileSize = document.getElementById('completeFileSize');
    const completeTime = document.getElementById('completeTime');
    
    if (item.title) {
        completeTitle.textContent = 'Download Complete!';
        completeMessage.textContent = `"${item.title}" has been downloaded successfully.`;
        completeFileName.textContent = `${item.title.replace(/[^\w\s]/gi, '_')}_${options.quality}kbps.${options.format}`;
        completeFileSize.textContent = fileSize;
        completeTime.textContent = `${Math.floor(Math.random() * 10) + 5} seconds`;
    } else {
        completeTitle.textContent = 'Download Complete!';
        completeMessage.textContent = `"${item.name}" has been downloaded successfully.`;
        completeFileName.textContent = `${item.name.replace(/[^\w\s]/gi, '_')}.zip`;
        completeFileSize.textContent = fileSize;
        completeTime.textContent = `${Math.floor(Math.random() * 20) + 10} seconds`;
    }
    
    // Show modal
    completeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initialize Audio Player
function initAudioPlayer(songId) {
    const audioPlayer = document.querySelector('.audio-player');
    if (!audioPlayer) return;
    
    const playBtn = audioPlayer.querySelector('#playBtn');
    const currentTimeEl = audioPlayer.querySelector('#currentTime');
    const durationEl = audioPlayer.querySelector('#duration');
    const progressBar = audioPlayer.querySelector('#audioProgressBar');
    const progressFill = audioPlayer.querySelector('#audioProgressFill');
    const volumeSlider = audioPlayer.querySelector('#volumeSlider');
    const visualization = audioPlayer.querySelector('#audioVisualization');
    
    const song = audioData.songs[songId];
    if (!song) return;
    
    let isPlaying = false;
    let currentTime = 0;
    let interval;
    
    // Format time display
    function updateTimeDisplay() {
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(song.duration);
    }
    
    // Update progress bar
    function updateProgress() {
        const percent = (currentTime / song.duration) * 100;
        progressFill.style.width = `${percent}%`;
    }
    
    // Update visualization
    function updateVisualization() {
        const bars = visualization.querySelectorAll('.visual-bar');
        bars.forEach((bar, index) => {
            const baseHeight = song.waveform[index];
            const variation = Math.sin(Date.now() / 200 + index) * 15;
            bar.style.height = `${baseHeight + variation}%`;
        });
    }
    
    // Play/pause function
    function togglePlay() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');
            
            interval = setInterval(() => {
                currentTime += 0.1;
                if (currentTime >= song.duration) {
                    currentTime = 0;
                    isPlaying = false;
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playBtn.classList.remove('playing');
                    clearInterval(interval);
                }
                
                updateTimeDisplay();
                updateProgress();
                updateVisualization();
            }, 100);
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.classList.remove('playing');
            clearInterval(interval);
        }
    }
    
    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentTime = percent * song.duration;
        updateTimeDisplay();
        updateProgress();
    });
    
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        // In real implementation, this would control audio volume
        showToast(`Volume: ${volume}%`, 'info', 1000);
    });
    
    // Initialize
    updateTimeDisplay();
    
    // Start visualization animation
    const vizInterval = setInterval(updateVisualization, 100);
    
    // Store cleanup function
    currentAudio = () => {
        clearInterval(interval);
        clearInterval(vizInterval);
        isPlaying = false;
    };
}

// Play Audio Preview
function playAudioPreview(songId) {
    // In a real implementation, this would play actual audio
    // For demo, we'll just show a notification
    const song = sampleData.songs.find(s => s.id == songId);
    if (song) {
        showToast(`Playing preview: "${song.title}" - ${song.artist}`, 'info', 2000);
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================

// Initialize Modals
function initModals() {
    // Download modal
    closeModal.addEventListener('click', () => {
        downloadModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        if (currentDownload) {
            clearInterval(currentDownload);
            currentDownload = null;
            showToast('Download cancelled', 'warning', 2000);
        }
        
        // Reset progress
        setTimeout(() => {
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
        }, 300);
    });
    
    cancelDownload.addEventListener('click', () => {
        downloadModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        if (currentDownload) {
            clearInterval(currentDownload);
            currentDownload = null;
            showToast('Download cancelled', 'warning', 2000);
        }
        
        setTimeout(() => {
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
        }, 300);
    });
    
    // Contact modal
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('contactName').focus();
        });
    });
    
    closeContactModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Submit contact form
    submitContactBtn.addEventListener('click', () => {
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();
        const consent = document.getElementById('contactConsent').checked;
        
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error', 3000);
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error', 3000);
            return;
        }
        
        if (!consent) {
            showToast('Please agree to receive responses via email', 'error', 3000);
            return;
        }
        
        // Simulate form submission
        showToast('Sending message...', 'info', 2000);
        
        setTimeout(() => {
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Clear form
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactSubject').value = '';
            document.getElementById('contactMessage').value = '';
            document.getElementById('contactConsent').checked = false;
            
            showToast('Message sent successfully! We\'ll respond within 24 hours.', 'success', 4000);
        }, 2000);
    });
    
    // Complete modal
    closeCompleteModal.addEventListener('click', () => {
        completeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    openFileBtn.addEventListener('click', () => {
        showToast('Opening downloaded file...', 'info', 2000);
        // In real implementation, this would open the file
    });
    
    openFolderBtn.addEventListener('click', () => {
        showToast('Opening downloads folder...', 'info', 2000);
        // In real implementation, this would open the downloads folder
    });
    
    newDownloadBtn.addEventListener('click', () => {
        completeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear input and focus
        spotifyUrlInput.value = '';
        spotifyUrlInput.focus();
        
        // Switch to URL tab
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="url-tab"]').classList.add('active');
        document.getElementById('url-tab').classList.add('active');
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                if (modal === downloadModal && currentDownload) {
                    clearInterval(currentDownload);
                    currentDownload = null;
                    showToast('Download cancelled', 'warning', 2000);
                    
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                        progressText.textContent = '0%';
                    }, 300);
                }
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                if (modal === downloadModal && currentDownload) {
                    clearInterval(currentDownload);
                    currentDownload = null;
                    showToast('Download cancelled', 'warning', 2000);
                    
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                        progressText.textContent = '0%';
                    }, 300);
                }
            });
        }
    });
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize Newsletter
function initNewsletter() {
    if (!subscribeBtn) return;
    
    subscribeBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();
        
        if (!email) {
            showToast('Please enter your email address', 'error', 3000);
            emailInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error', 3000);
            emailInput.focus();
            return;
        }
        
        // Simulate subscription
        showToast('Subscribing to newsletter...', 'info', 2000);
        
        setTimeout(() => {
            emailInput.value = '';
            showToast('Successfully subscribed to newsletter!', 'success', 3000);
        }, 1500);
    });
}

// Initialize CTA Button
function initCTAButton() {
    if (!ctaButton) return;
    
    ctaButton.addEventListener('click', () => {
        // Scroll to download section
        document.querySelector('#spotifyUrl').focus();
        
        // Switch to URL tab
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="url-tab"]').classList.add('active');
        document.getElementById('url-tab').classList.add('active');
        
        showToast('Ready to download! Paste your Spotify URL above.', 'info', 3000);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Initialize Event Listeners
function initEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Paste button
    pasteBtn.addEventListener('click', pasteFromClipboard);
    
    // Download button
    downloadBtn.addEventListener('click', processUrlDownload);
    
    // Search button
    searchBtn.addEventListener('click', searchMusic);
    
    // Enter key in inputs
    spotifyUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            processUrlDownload();
        }
    });
    
    searchQueryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchMusic();
        }
    });
    
    // Newsletter email input
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterEmail) {
        newsletterEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                subscribeBtn.click();
            }
        });
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

// Initialize Everything
function init() {
    // Initialize core functionality
    initDarkMode();
    initMobileMenu();
    initTabs();
    initExampleHandlers();
    initFAQAccordion();
    initSmoothScrolling();
    initHeaderScroll();
    
    // Initialize modals and forms
    initModals();
    initNewsletter();
    initCTAButton();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize stats animation on scroll
    window.addEventListener('scroll', initStatsAnimation);
    
    // Show welcome message
    setTimeout(() => {
        showToast('🎵 Welcome to Spotdown! Download Spotify music for free.', 'info', 5000);
    }, 1000);
    
    // Log initialization
    console.log('Spotdown initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for debugging
window.Spotdown = {
    version: '1.0.0',
    sampleData,
    showToast,
    simulateDownload,
    init
};
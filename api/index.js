// api/index.js
const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi utama dari request Anda (disesuaikan untuk API Handler)
async function spotifydl(url) {
    try {
        // Validasi URL
        if (!url || typeof url !== 'string') {
            throw new Error('URL is required.');
        }
        
        // Pastikan ini URL Spotify
        const spotifyRegex = /(open\.spotify\.com|spotify\.link)/;
        if (!spotifyRegex.test(url)) {
            throw new Error('Invalid Spotify URL.');
        }
        
        console.log(`Processing: ${url}`);
        
        // Step 1: Get initial page for CSRF token
        const rynn = await axios.get('https://spotmate.online/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(rynn.data);
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        
        if (!csrfToken) {
            throw new Error('Failed to get CSRF token');
        }
        
        // Step 2: Create API instance
        const api = axios.create({
            baseURL: 'https://spotmate.online',
            headers: {
                'Cookie': rynn.headers['set-cookie'] ? rynn.headers['set-cookie'].join('; ') : '',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-CSRF-Token': csrfToken
            },
            timeout: 15000
        });
        
        // Step 3: Get track data and download URL in parallel
        const [{ data: meta }, { data: dl }] = await Promise.all([
            api.post('/getTrackData', { spotify_url: url }),
            api.post('/convert', { urls: url })
        ]);
        
        // Validate response
        if (!dl || !dl.url) {
            throw new Error('Failed to get download URL');
        }
        
        // Format response
        const result = {
            status: true,
            title: meta.title || "Unknown Track",
            artist: meta.artist || "Unknown Artist",
            cover: meta.cover || "",
            download_url: dl.url
        };
        
        console.log(`Success: ${result.title} - ${result.artist}`);
        return result;
        
    } catch (error) {
        console.error('Spotify DL Error:', error.message);
        
        // Enhanced error messages
        let errorMsg = error.message;
        if (error.code === 'ECONNABORTED') {
            errorMsg = 'Request timeout. Please try again.';
        } else if (error.response) {
            if (error.response.status === 404) {
                errorMsg = 'Track not found.';
            } else if (error.response.status === 429) {
                errorMsg = 'Too many requests. Please wait.';
            }
        }
        
        return { 
            status: false, 
            message: errorMsg 
        };
    }
}

// Simple Express server
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main API endpoint
app.post('/api', async (req, res) => {
    console.log('API Request:', req.body);
    
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    try {
        const result = await spotifydl(url);
        
        if (result.status === false) {
            return res.status(500).json({ error: result.message });
        }
        
        res.json(result);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files if needed
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║    Spotify Downloader API           ║
    ║    Server running on port ${PORT}    ║
    ║    http://localhost:${PORT}           ║
    ╚══════════════════════════════════════╝
    `);
});

// Export for Vercel/Serverless
module.exports = app;

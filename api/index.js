// api/index.js
const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi utama dari request Anda (sedikit disesuaikan untuk API Handler)
async function spotifydl(url) {
    try {
        // VALIDASI URL SPOTIFY
        const spotifyPattern = /^(https?:\/\/)?(open\.spotify\.com|spotify\.link)\/(track|album|playlist|artist)\/[a-zA-Z0-9]+(\?.*)?$/;
        if (!spotifyPattern.test(url)) {
            throw new Error('Invalid Spotify URL. Format: https://open.spotify.com/track/...');
        }
        
        const rynn = await axios.get('https://spotmate.online/', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000 // Timeout 10 detik
        });
        
        const $ = cheerio.load(rynn.data);
        const csrfToken = $('meta[name="csrf-token"]').attr('content');
        
        if (!csrfToken) {
            throw new Error('Failed to get CSRF token');
        }
        
        const api = axios.create({
            baseURL: 'https://spotmate.online',
            headers: {
                cookie: rynn.headers['set-cookie'] ? rynn.headers['set-cookie'].join('; ') : '',
                'content-type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'x-csrf-token': csrfToken
            },
            timeout: 15000
        });
        
        const [{ data: meta }, { data: dl }] = await Promise.all([
            api.post('/getTrackData', { spotify_url: url }),
            api.post('/convert', { urls: url })
        ]);
        
        if (!meta || !dl || !dl.url) {
            throw new Error('Failed to get download URL');
        }
        
        return {
            status: true,
            title: meta.title || "Unknown Track",
            artist: meta.artist || "Unknown Artist",
            cover: meta.cover || "https://via.placeholder.com/300?text=No+Cover",
            download_url: dl.url,
            duration: meta.duration || "MP3",
            size: "High Quality"
        };
    } catch (error) {
        console.error('Spotify DL Error:', error.message);
        return { 
            status: false, 
            message: error.response?.data?.message || error.message || 'Failed to process track' 
        };
    }
}

// Vercel Serverless Handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const result = await spotifydl(url);
        if (!result.status) {
            return res.status(500).json({ error: result.message });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
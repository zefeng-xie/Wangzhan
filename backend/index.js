const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
const frontendDistDir = path.resolve(__dirname, '..', 'frontend', 'dist');
const frontendIndexFile = path.join(frontendDistDir, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexFile);

app.set('trust proxy', 1);

function getAllowedOrigins(value) {
    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}

const allowedOrigins = getAllowedOrigins(CORS_ORIGIN);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    }
}));
app.use(express.json());

function getDaysSince(dateStr) {
    const start = new Date(dateStr);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

app.get('/api/stats', (req, res) => {
    res.json({
        fitnessDays: getDaysSince('2025-03-07'),
        mountains: 6,
        cities: 21,
        artworks: 6
    });
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

if (hasFrontendBuild) {
    app.use(express.static(frontendDistDir));

    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(frontendIndexFile);
    });
}

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log(
        allowedOrigins.length > 0
            ? `CORS origins: ${allowedOrigins.join(', ')}`
            : 'CORS origins: allow all'
    );
    if (hasFrontendBuild) {
        console.log(`Serving frontend build from ${frontendDistDir}`);
    } else {
        console.log('Frontend build not found. Run "npm run build" in the project root for production.');
    }
});

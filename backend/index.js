const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDistDir = path.resolve(__dirname, '..', 'frontend', 'dist');
const frontendIndexFile = path.join(frontendDistDir, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexFile);

app.use(cors());
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
    if (hasFrontendBuild) {
        console.log(`Serving frontend build from ${frontendDistDir}`);
    } else {
        console.log('Frontend build not found. Run "npm run build" in the project root for production.');
    }
});

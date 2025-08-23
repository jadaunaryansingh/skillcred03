const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Trip Planner AI is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Test endpoint for CSP
app.get('/test-csp', (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com");
    res.json({ message: 'CSP test endpoint' });
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔒 CSP test: http://localhost:${PORT}/test-csp`);
    console.log(`🌐 Main app: http://localhost:${PORT}/index.html`);
});

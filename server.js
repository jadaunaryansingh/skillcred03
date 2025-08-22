const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes
const { generateItinerary, searchPexelsImage, geocodeLocation, calculateDistance } = require('./api/itinerary');

// Itinerary generation endpoint
app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { destination, days, interests } = req.body;
        
        if (!destination || !days || !interests) {
            return res.status(400).json({
                error: 'Missing required fields: destination, days, and interests are required'
            });
        }
        
        console.log('Generating itinerary for:', { destination, days, interests });
        
        const itinerary = await generateItinerary(destination, days, interests);
        
        res.json({
            success: true,
            itinerary,
            destination,
            days,
            interests
        });
        
    } catch (error) {
        console.error('Error generating itinerary:', error);
        
        // Handle specific Google AI errors
        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Invalid or missing Google Gemini API key',
                details: 'Please check your GEMINI_API_KEY environment variable'
            });
        }
        
        if (error.message.includes('quota') || error.message.includes('limit')) {
            return res.status(429).json({
                error: 'API quota exceeded',
                details: 'Please try again later or check your Gemini API quota'
            });
        }
        
        res.status(500).json({
            error: 'Failed to generate itinerary',
            details: error.message
        });
    }
});

// Image search endpoint
app.get('/api/search-image/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const imageUrl = await searchPexelsImage(query);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Image search error:', error);
        res.status(500).json({ error: 'Failed to search image' });
    }
});

// Geocoding endpoint for getting real coordinates
app.get('/api/geocode/:location', async (req, res) => {
    try {
        const location = req.params.location;
        const coordinates = await geocodeLocation(location);
        res.json({ coordinates });
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Failed to geocode location' });
    }
});

// Distance calculation endpoint
app.get('/api/calculate-distance', async (req, res) => {
    try {
        const { from, to } = req.query;
        const distance = await calculateDistance(from, to);
        res.json({ distance });
    } catch (error) {
        console.error('Distance calculation error:', error);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
});

// AI-powered activities generation endpoint
app.post('/api/generate-activities', async (req, res) => {
    try {
        const { destination, travelStyles, prompt } = req.body;
        
        if (!destination || !travelStyles || !prompt) {
            return res.status(400).json({
                error: 'Missing required fields: destination, travelStyles, and prompt are required'
            });
        }
        
        console.log('Generating activities for:', { destination, travelStyles });
        
        // Import the Google AI Studio integration
        const { generateActivitiesWithAI } = require('./api/ai-activities');
        
        const activities = await generateActivitiesWithAI(destination, travelStyles, prompt);
        
        res.json({
            success: true,
            activities,
            destination,
            travelStyles
        });
        
    } catch (error) {
        console.error('Error generating activities:', error);
        
        // Handle specific AI service errors
        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Invalid or missing AI service API key',
                details: 'Please check your AI service configuration'
            });
        }
        
        if (error.message.includes('quota') || error.message.includes('limit')) {
            return res.status(429).json({
                error: 'AI service quota exceeded',
                details: 'Please try again later or check your AI service quota'
            });
        }
        
        res.status(500).json({
            error: 'Failed to generate activities',
            details: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve authentication page
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Serve test modal page
app.get('/test-modal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test-modal.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

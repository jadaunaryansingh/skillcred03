const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const config = require('./config');
const app = express();
const PORT = config.PORT;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes
const { generateItinerary, searchPexelsImage, geocodeLocation, calculateDistance } = require('./api/itinerary');
const { generateAIItinerary } = require('./api/gemini-itinerary');
const { generateActivitiesWithAI } = require('./api/ai-activities');
const { generatePopularPacks, generateAIReviews, generateDestinationSuggestions } = require('./api/ai-content');
const { 
    registerUser, 
    loginUser, 
    refreshAccessToken, 
    verifyToken,
    updateUserPreferences,
    saveUserItinerary,
    getUserItineraries
} = require('./api/auth');
const { 
    getCurrentWeather, 
    getWeatherForecast, 
    getWeatherSummary 
} = require('./api/weather');
const { 
    convertCurrency, 
    getExchangeRates, 
    getPopularCurrencies,
    calculateMultiCurrencyBudget
} = require('./api/currency');
const { 
    exportToPDF, 
    exportToCalendar, 
    exportToJSON, 
    exportToText 
} = require('./api/export');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// ===== AUTHENTICATION ENDPOINTS =====

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: error.message });
    }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshAccessToken(refreshToken);
        res.json(result);
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ error: error.message });
    }
});

// Update user preferences
app.put('/api/auth/preferences', authenticateToken, async (req, res) => {
    try {
        const result = await updateUserPreferences(req.user.userId, req.body);
        res.json(result);
    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Save itinerary
app.post('/api/auth/save-itinerary', authenticateToken, async (req, res) => {
    try {
        const result = await saveUserItinerary(req.user.userId, req.body);
        res.json(result);
    } catch (error) {
        console.error('Itinerary save error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get user itineraries
app.get('/api/auth/itineraries', authenticateToken, async (req, res) => {
    try {
        const itineraries = await getUserItineraries(req.user.userId);
        res.json({ success: true, itineraries });
    } catch (error) {
        console.error('Get itineraries error:', error);
        res.status(400).json({ error: error.message });
    }
});

// ===== WEATHER ENDPOINTS =====

// Get current weather
app.get('/api/weather/current/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const { country } = req.query;
        const weather = await getCurrentWeather(city, country);
        res.json(weather);
    } catch (error) {
        console.error('Weather error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get weather forecast
app.get('/api/weather/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const { country } = req.query;
        const forecast = await getWeatherForecast(city, country);
        res.json(forecast);
    } catch (error) {
        console.error('Weather forecast error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get weather summary
app.get('/api/weather/summary/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const { country } = req.query;
        const summary = await getWeatherSummary(city, country);
        res.json(summary);
    } catch (error) {
        console.error('Weather summary error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== CURRENCY ENDPOINTS =====

// Get exchange rates
app.get('/api/currency/rates/:base', async (req, res) => {
    try {
        const { base } = req.params;
        const rates = await getExchangeRates(base);
        res.json(rates);
    } catch (error) {
        console.error('Exchange rates error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Convert currency
app.post('/api/currency/convert', async (req, res) => {
    try {
        const { amount, from, to } = req.body;
        const conversion = await convertCurrency(amount, from, to);
        res.json(conversion);
    } catch (error) {
        console.error('Currency conversion error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get popular currencies
app.get('/api/currency/popular', async (req, res) => {
    try {
        const currencies = getPopularCurrencies();
        res.json(currencies);
    } catch (error) {
        console.error('Popular currencies error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Multi-currency budget
app.post('/api/currency/budget', async (req, res) => {
    try {
        const { amount, baseCurrency, targetCurrencies } = req.body;
        const budget = await calculateMultiCurrencyBudget(amount, baseCurrency, targetCurrencies);
        res.json(budget);
    } catch (error) {
        console.error('Multi-currency budget error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== AI CONTENT ENDPOINTS =====

// Generate popular trip packs
app.get('/api/ai/popular-packs', async (req, res) => {
    try {
        const { destination = 'India', count = 6 } = req.query;
        const result = await generatePopularPacks(destination, parseInt(count));
        res.json(result);
    } catch (error) {
        console.error('Popular packs generation error:', error);
        res.status(500).json({ error: 'Failed to generate popular packs' });
    }
});

// Generate AI reviews
app.get('/api/ai/reviews', async (req, res) => {
    try {
        const { count = 5 } = req.query;
        const result = await generateAIReviews(parseInt(count));
        res.json(result);
    } catch (error) {
        console.error('AI reviews generation error:', error);
        res.status(500).json({ error: 'Failed to generate reviews' });
    }
});

// Generate destination suggestions
app.get('/api/ai/suggestions', async (req, res) => {
    try {
        const { query = '', limit = 6 } = req.query;
        const result = await generateDestinationSuggestions(query, parseInt(limit));
        res.json(result);
    } catch (error) {
        console.error('Destination suggestions error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

// ===== EXPORT ENDPOINTS =====

// Export to PDF
app.post('/api/export/pdf', authenticateToken, async (req, res) => {
    try {
        const { itinerary } = req.body;
        const result = await exportToPDF(itinerary);
        res.json(result);
    } catch (error) {
        console.error('PDF export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export to Calendar
app.post('/api/export/calendar', authenticateToken, async (req, res) => {
    try {
        const { itinerary } = req.body;
        const result = await exportToCalendar(itinerary);
        res.json(result);
    } catch (error) {
        console.error('Calendar export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export to JSON
app.post('/api/export/json', authenticateToken, async (req, res) => {
    try {
        const { itinerary } = req.body;
        const result = await exportToJSON(itinerary);
        res.json(result);
    } catch (error) {
        console.error('JSON export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export to Text
app.post('/api/export/text', authenticateToken, async (req, res) => {
    try {
        const { itinerary } = req.body;
        const result = await exportToText(itinerary);
        res.json(result);
    } catch (error) {
        console.error('Text export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== EXISTING ENDPOINTS =====

// AI-Powered Itinerary generation endpoint using Google Gemini
app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { destination, days, interests, budget = 'mid' } = req.body;
        
        if (!destination || !days || !interests) {
            return res.status(400).json({
                error: 'Missing required fields: destination, days, and interests are required'
            });
        }
        
        console.log('🤖 Generating AI itinerary for:', { destination, days, interests, budget });
        
        // Use Google AI to generate the complete itinerary
        const itinerary = await generateAIItinerary(destination, days, budget, interests);
        
        res.json({
            success: true,
            itinerary,
            destination,
            days,
            interests,
            budget,
            generatedBy: itinerary.generatedBy || 'google-ai'
        });
        
    } catch (error) {
        console.error('❌ Error generating AI itinerary:', error);
        
        // Handle specific Google AI errors
        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Invalid or missing Google Gemini API key',
                details: 'Please add GEMINI_API_KEY to your .env file to use AI-powered itinerary generation'
            });
        }
        
        if (error.message.includes('quota') || error.message.includes('limit')) {
            return res.status(429).json({
                error: 'AI API quota exceeded',
                details: 'Please try again later or check your Gemini API quota'
            });
        }
        
        res.status(500).json({
            error: 'Failed to generate AI itinerary',
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

// Professional Travel Planner endpoint (Google AI format)
app.post('/api/travel-planner', async (req, res) => {
    try {
        const { city, days, budget } = req.body;
        
        if (!city || !days || !budget) {
            return res.status(400).json({
                error: 'Missing required fields: city, days, and budget are required'
            });
        }
        
        console.log('🎯 Professional Travel Planner request:', { city, days, budget });
        
        // Use Google AI to generate professional travel planner format
        const itinerary = await generateAIItinerary(city, days, budget, []);
        
        res.json({
            success: true,
            itinerary,
            city,
            days,
            budget,
            generatedBy: 'google-ai-professional-planner',
            format: 'professional-travel-planner'
        });
        
    } catch (error) {
        console.error('❌ Professional Travel Planner error:', error);
        
        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'Google AI API key required',
                details: 'Please add GEMINI_API_KEY to your .env file'
            });
        }
        
        res.status(500).json({
            error: 'Failed to generate professional travel plan',
            details: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        version: '2.0.0',
        features: [
            'AI Itinerary Generation',
            'Professional Travel Planner',
            'User Authentication',
            'Weather Integration',
            'Currency Conversion',
            'Export Capabilities',
            'Advanced Security'
        ],
        timestamp: new Date().toISOString()
    });
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

// Serve professional dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Professional Travel Itinerary Server v2.0.0 running on port ${PORT}`);
    console.log(`📱 Features: AI Planning, Auth, Weather, Currency, Export`);
    console.log(`🔒 Security: Helmet, Rate Limiting, CORS enabled`);
            console.log(`🌐 Environment: ${config.NODE_ENV}`);
});

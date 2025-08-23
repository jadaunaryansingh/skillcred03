/**
 * Travel App Configuration File
 * Contains all API keys and configuration settings
 * 
 * IMPORTANT: In production, move these to environment variables
 * Create a .env file with these values:
 * 
 * OPENWEATHER_API_KEY=89888645edb74500ab962938252308
 * EXCHANGE_RATE_API_KEY=4b4359469c1f8924fcb20a41
 * JWT_SECRET=your-super-secret-jwt-key-change-in-production
 * JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
 */

module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // JWT Authentication
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    
    // Weather API (OpenWeatherMap)
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '89888645edb74500ab962938252308',
    
    // Currency Exchange API
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY || '4b4359469c1f8924fcb20a41',
    
    // AI Services
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || 'your-google-places-api-key-here',
    FOURSQUARE_API_KEY: process.env.FOURSQUARE_API_KEY || 'your-foursquare-api-key-here',
    TRIPADVISOR_API_KEY: process.env.TRIPADVISOR_API_KEY || 'your-tripadvisor-api-key-here',
    
    // Google AI (Gemini) - for AI itinerary generation
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'your-gemini-api-key-here',
    
    // Database (if you add one later)
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/travel-app',
    DATABASE_NAME: process.env.DATABASE_NAME || 'travel-app',
    
    // Email Service (if you add email functionality later)
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: process.env.SMTP_PORT || 587,
    SMTP_USER: process.env.SMTP_USER || 'your-email@gmail.com',
    SMTP_PASS: process.env.SMTP_PASS || 'your-app-password',
    
    // File Upload (if you add file upload functionality later)
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760,
    
    // Security
    SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-here',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

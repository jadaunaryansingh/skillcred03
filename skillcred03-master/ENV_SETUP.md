# Environment Variables Setup Guide

## 🚀 Quick Setup

Create a `.env` file in your project root with the following content:

```bash
# ===== TRAVEL APP ENVIRONMENT CONFIGURATION =====

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Weather API (OpenWeatherMap)
OPENWEATHER_API_KEY=89888645edb74500ab962938252308

# Currency Exchange API
EXCHANGE_RATE_API_KEY=4b4359469c1f8924fcb20a41

# AI Services (Optional - for enhanced features)
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
FOURSQUARE_API_KEY=your-foursquare-api-key-here
TRIPADVISOR_API_KEY=your-tripadvisor-api-key-here

# Google AI (Gemini) - for AI itinerary generation
GEMINI_API_KEY=your-gemini-api-key-here
```

## 📁 File Structure

Your project now has:
- `config.js` - Central configuration file
- `.env` - Environment variables (create this file)
- All API files now use the config

## 🔑 Current API Keys

✅ **Weather API**: `89888645edb74500ab962938252308` (OpenWeatherMap)
✅ **Currency API**: `4b4359469c1f8924fcb20a41` (Exchange Rate API)

## 🚨 Important Notes

1. **Create the .env file** in your project root
2. **Never commit .env to git** (it's already in .gitignore)
3. **Replace placeholder values** with real API keys when you get them
4. **The app will work** with just the weather and currency keys you provided

## 🧪 Test Your Setup

After creating the .env file, restart your server:
```bash
node server.js
```

Your weather and currency APIs should now work with real-time data!

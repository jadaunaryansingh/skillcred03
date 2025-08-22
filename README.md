# 🌟 Wanderlust India - AI-Powered Travel Planning

A modern, intelligent travel itinerary generator that creates personalized travel plans for destinations across India using Google Gemini AI and Pexels images.

## ✨ Features

- **🤖 AI-Powered Itineraries** - Google Gemini AI generates comprehensive travel plans
- **🖼️ Rich Visual Content** - High-quality Pexels images for all activities
- **🗺️ OpenStreetMap Integration** - Interactive maps and location services
- **💰 Smart Budget Analysis** - Detailed cost breakdowns and optimization tips
- **🎯 Personalized Planning** - Customizable duration, budget, and travel interests
- **📱 Responsive Design** - Beautiful interface that works on all devices

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   - Copy `config.env` to `.env`
   - Add your `GEMINI_API_KEY` and `PEXELS_API_KEY`

3. **Start the Server**
   ```bash
   npm run server
   ```

4. **Open the Application**
   - Open `trip-planner-ai.html` in your browser
   - Or visit `http://localhost:5000`

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini AI
- **Images**: Pexels API
- **Maps**: OpenStreetMap, Leaflet.js
- **Styling**: Modern CSS with CSS Variables

## 📁 Project Structure

```
├── trip-planner-ai.html    # Main application (frontend + backend)
├── server.js               # Express server
├── api/
│   └── itinerary.js       # AI itinerary generation logic
├── package.json            # Dependencies
└── config.env              # Environment configuration
```

## 🎯 How It Works

1. **User Input** → Destination, duration, budget, travel interests
2. **AI Processing** → Gemini AI generates detailed itineraries
3. **Image Enhancement** → Pexels API adds relevant images
4. **Map Integration** → OpenStreetMap provides location services
5. **Rich Display** → Beautiful, interactive results with all details

## 🌟 Key Capabilities

- **Cultural Insights** - Local customs, language phrases, etiquette
- **Hidden Gems** - Off-the-beaten-path recommendations
- **Photography Tips** - Best spots and timing for photos
- **Safety Information** - Emergency contacts and travel tips
- **Budget Optimization** - Money-saving strategies and cost breakdowns

## 🔧 Development

- **Frontend**: Single HTML file with embedded CSS and JavaScript
- **Backend**: RESTful API with Express.js
- **AI Integration**: Robust error handling and response parsing
- **Image Management**: Automatic image search and attribution

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Future Enhancements

- User accounts and saved itineraries
- Social sharing and community features
- Offline mode support
- Multi-language support
- Advanced AI customization

---

**Built with ❤️ for travelers exploring Incredible India**

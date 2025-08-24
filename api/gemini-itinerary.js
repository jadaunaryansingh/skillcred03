/**
 * Google AI (Gemini) Powered Travel Itinerary Generator
 * Generates complete day-by-day travel itineraries using Google's Gemini AI
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Professional travel planner prompt template
const ITINERARY_PROMPT_TEMPLATE = `You are a professional travel planner.  
Generate a complete **day-by-day travel itinerary** based on the following inputs:

- Destination city: {{city}}
- Number of days: {{days}}
- Budget range: {{budget}}

### Output requirements:
1. **Day-wise Plan**  
   - Each day must have a morning, afternoon, and evening activity.  
   - Include local attractions, sightseeing, cultural experiences, and relaxation.  
   - Mention approximate travel times between locations if relevant.

2. **Dining Suggestions**  
   - Recommend at least 1 breakfast, 1 lunch, and 1 dinner spot per day.  
   - Prefer authentic, local, and budget-matching options.  

3. **Maps & Locations**  
   - Provide Google Maps-friendly names for attractions/restaurants.  
   - Avoid vague terms like "local restaurant" — be specific.  

4. **Budget Fit**  
   - Suggest activities and food within the given budget.  
   - Note free or low-cost options where possible.  

5. **Pexels Image Tags**  
   - For each place/restaurant/activity, also provide a short keyword (2–4 words) that can be used to fetch an image from the **Pexels API**.  
   - Example: "Eiffel Tower" → Image Tag: "Eiffel Tower Paris".  

6. **Summary Section**  
   - End with a short summary highlighting the overall vibe of the trip.  

### Example Format:
Day 1 – Morning: Visit XYZ Temple (opens 7 AM) → Breakfast at ABC Café.  
   - Image Tags: ["XYZ Temple", "ABC Café"]  
Afternoon: Guided tour of DEF Museum.  
   - Image Tags: ["DEF Museum Tour"]  
Evening: Sunset at GHI Beach → Dinner at JKL Restaurant.  
   - Image Tags: ["GHI Beach Sunset", "JKL Restaurant"]  

Day 2 – Morning: Hiking at MNO Trail → Breakfast at PQR Bakery.  
   - Image Tags: ["MNO Trail Hike", "PQR Bakery"]  
Afternoon: Shopping at STU Market.  
   - Image Tags: ["STU Market Shopping"]  
Evening: Local food tour → Dinner at VWX Dhaba.  
   - Image Tags: ["Local Food Tour", "VWX Dhaba"]  

...continue until all {{days}} are planned.

Please provide the response in a structured JSON format that can be easily parsed by a web application.`;

/**
 * Generate complete itinerary using Google AI
 * @param {string} destination - Destination city
 * @param {number} days - Number of days
 * @param {string} budget - Budget range (budget, mid, luxury, premium)
 * @param {Array} interests - Travel interests
 * @returns {Object} Complete AI-generated itinerary
 */
async function generateAIItinerary(destination, days, budget, interests = []) {
    try {
        console.log(`🤖 Generating AI itinerary for ${destination} (${days} days, ${budget} budget)`);
        
        // Check if Gemini API key is configured
        if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY === 'your-gemini-api-key-here') {
            throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your .env file');
        }

        // Create the prompt with user inputs
        const prompt = ITINERARY_PROMPT_TEMPLATE
            .replace('{{city}}', destination)
            .replace('{{days}}', days)
            .replace('{{budget}}', budget);

        // Add interests if provided
        const interestsPrompt = interests.length > 0 
            ? `\n\nAdditional Travel Interests: ${interests.join(', ')}`
            : '';
        
        const fullPrompt = prompt + interestsPrompt + '\n\nPlease respond with a valid JSON object.';

        // Generate content using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Try to extract JSON from the response
        let itineraryData;
        try {
            // Look for JSON content in the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                itineraryData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
            console.log('Raw AI response:', text);
            
            // Fallback: create a structured response from the text
            itineraryData = createFallbackItinerary(destination, days, budget, interests, text);
        }

        // Enhance with additional data
        const enhancedItinerary = await enhanceItineraryWithExternalData(itineraryData, destination);
        
        console.log(`✅ AI itinerary generated successfully for ${destination}`);
        return enhancedItinerary;

    } catch (error) {
        console.error('❌ Error generating AI itinerary:', error);
        
        // Return fallback itinerary if AI fails
        return createFallbackItinerary(destination, days, budget, interests);
    }
}

/**
 * Create fallback itinerary when AI generation fails
 */
function createFallbackItinerary(destination, days, budget, interests, aiText = '') {
    console.log('🔄 Creating fallback itinerary due to AI generation failure');
    
    const itinerary = {
        destination,
        days,
        budget,
        interests,
        generatedBy: 'fallback',
        aiResponse: aiText,
        dailyPlans: [],
        totalCost: calculateFallbackCost(days, budget),
        highlights: generateFallbackHighlights(destination, interests),
        localTips: generateFallbackTips(destination),
        summary: `A ${days}-day adventure in ${destination} with ${budget} budget options.`
    };

    // Generate basic daily plans
    for (let day = 1; day <= days; day++) {
        itinerary.dailyPlans.push({
            day,
            theme: `Day ${day} in ${destination}`,
            morning: {
                time: '9:00 AM - 12:00 PM',
                activity: `Explore ${destination}'s main attractions`,
                description: 'Start your day with local exploration',
                cost: '₹200-500',
                tips: 'Start early to avoid crowds',
                image: { url: '', alt: 'Morning activity', photographer: 'Pexels' }
            },
            afternoon: {
                time: '1:00 PM - 5:00 PM',
                activity: 'Cultural experience and local cuisine',
                description: 'Immerse yourself in local culture',
                cost: '₹300-800',
                tips: 'Take breaks and stay hydrated',
                image: { url: '', alt: 'Afternoon activity', photographer: 'Pexels' }
            },
            evening: {
                time: '6:00 PM - 9:00 PM',
                activity: 'Evening entertainment and dinner',
                description: 'Enjoy local evening activities',
                cost: '₹400-1000',
                tips: 'Experience local nightlife safely',
                image: { url: '', alt: 'Evening activity', photographer: 'Pexels' }
            }
        });
    }

    return itinerary;
}

/**
 * Calculate fallback cost based on days and budget
 */
function calculateFallbackCost(days, budget) {
    const baseCosts = {
        budget: 2000,
        mid: 4000,
        luxury: 8000,
        premium: 15000
    };
    
    const baseCost = baseCosts[budget] || baseCosts.mid;
    return `₹${(baseCost * days).toLocaleString()}`;
}

/**
 * Generate fallback highlights
 */
function generateFallbackHighlights(destination, interests) {
    const highlights = [
        `${destination}'s Unique Charm`,
        'Local Experiences',
        'Cultural Heritage',
        'Authentic Cuisine',
        'Memorable Moments'
    ];
    
    if (interests.includes('adventure')) highlights.push('Adventure Activities');
    if (interests.includes('culture')) highlights.push('Historical Sites');
    if (interests.includes('food')) highlights.push('Local Food Markets');
    
    return highlights.slice(0, 5);
}

/**
 * Generate fallback tips
 */
function generateFallbackTips(destination) {
    return [
        'Start early to avoid crowds',
        'Take breaks and stay hydrated',
        'Experience local nightlife safely',
        'Ask locals for hidden gems',
        'Keep your valuables secure',
        'Follow local customs and dress codes',
        'Use local transportation for authentic experience',
        'Try street food from busy stalls'
    ];
}

/**
 * Enhance itinerary with external data (weather, currency, etc.)
 */
async function enhanceItineraryWithExternalData(itinerary, destination) {
    try {
        // Add weather information
        itinerary.weather = await getWeatherInfo(destination);
        
        // Add currency information
        itinerary.currency = await getCurrencyInfo(destination);
        
        // Add destination coordinates for maps
        itinerary.coordinates = await getDestinationCoordinates(destination);
        
        // Add generation timestamp
        itinerary.generatedAt = new Date().toISOString();
        itinerary.generatedBy = 'google-ai';
        
    } catch (error) {
        console.error('Warning: Could not enhance itinerary with external data:', error);
    }
    
    return itinerary;
}

/**
 * Get weather information for destination
 */
async function getWeatherInfo(destination) {
    try {
        const axios = require('axios');
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${config.OPENWEATHER_API_KEY}&units=metric`;
        
        const response = await axios.get(weatherUrl);
        const data = response.data;
        
        return {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return null;
    }
}

/**
 * Get currency information for destination
 */
async function getCurrencyInfo(destination) {
    try {
        const axios = require('axios');
        const currencyUrl = `https://v6.exchangerate-api.com/v6/${config.EXCHANGE_RATE_API_KEY}/latest/INR`;
        
        const response = await axios.get(currencyUrl);
        const data = response.data;
        
        // Determine local currency based on destination
        let localCurrency = 'INR'; // Default to Indian Rupee
        
        if (destination.toLowerCase().includes('usa') || destination.toLowerCase().includes('united states')) {
            localCurrency = 'USD';
        } else if (destination.toLowerCase().includes('europe') || destination.toLowerCase().includes('uk')) {
            localCurrency = 'EUR';
        } else if (destination.toLowerCase().includes('japan')) {
            localCurrency = 'JPY';
        }
        
        return {
            baseCurrency: 'INR',
            localCurrency: localCurrency,
            exchangeRate: data.conversion_rates[localCurrency] || 1,
            lastUpdated: data.time_last_update_utc
        };
    } catch (error) {
        console.error('Currency API error:', error);
        return null;
    }
}

/**
 * Get destination coordinates for maps
 */
async function getDestinationCoordinates(destination) {
    // Mock coordinates for common destinations
    const coordinates = {
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Delhi': { lat: 28.7041, lng: 77.1025 },
        'Goa': { lat: 15.2993, lng: 74.1240 },
        'Jaipur': { lat: 26.9124, lng: 75.7873 },
        'Varanasi': { lat: 25.3176, lng: 82.9739 },
        'Kerala': { lat: 10.8505, lng: 76.2711 },
        'Paris': { lat: 48.8566, lng: 2.3522 },
        'London': { lat: 51.5074, lng: -0.1278 },
        'New York': { lat: 40.7128, lng: -74.0060 },
        'Tokyo': { lat: 35.6762, lng: 139.6503 }
    };
    
    return coordinates[destination] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
}

module.exports = {
    generateAIItinerary,
    createFallbackItinerary
};

const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Pexels API configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Enhanced itinerary generation with Pexels images
async function generateItinerary(destination, days, interests) {
    try {
        console.log(`🎯 Generating ${days}-day itinerary for ${destination} with interests: ${interests.join(', ')}`);
        
        // Create comprehensive prompt with multiple requirements
        const prompt = `Create a comprehensive ${days}-day travel itinerary for ${destination}, India. 
        
        Travel Focus Areas: ${interests.join(', ')}
        
        DETAILED REQUIREMENTS:
        1. Day-by-day breakdown with specific timings (9 AM onwards)
        2. Include morning, afternoon, and evening activities
        3. Blend all selected interests: ${interests.join(', ')}
        4. Specific restaurant recommendations with cuisine types and must-try dishes
        5. Transportation details and estimated costs in INR
        6. Accommodation suggestions for different budgets
        7. Cultural insights and local etiquette tips
        8. Estimated costs for each activity in INR
        9. Specific locations with addresses where possible
        10. Insider tips for each location
        11. Best photo spots and timing
        12. Safety recommendations
        
        ENHANCED REQUIREMENTS FOR BETTER RESULTS:
        13. Include specific cultural experiences unique to ${destination}
        14. Add local language phrases and greetings
        15. Provide seasonal considerations and weather tips
        16. Include hidden gems and off-the-beaten-path locations
        17. Add photography tips for each location
        18. Include local customs and dress codes
        19. Provide emergency contact information
        20. Add sustainable travel practices and eco-friendly options
        
        For restaurants, include:
        - Specific restaurant names (real places)
        - Signature dishes to try
        - Price range in INR
        - Location/area
        - Best time to visit
        
        For activities, include:
        - Entry fees in INR
        - Opening hours
        - How to reach
        - What to expect
        - Best time to visit
        
        Format the response as a valid JSON object with this exact structure:
        {
            "destination": "${destination}",
            "days": ${days},
            "interests": ${JSON.stringify(interests)},
            "overview": {
                "summary": "Brief trip overview highlighting key experiences",
                "bestTime": "Best time to visit with weather info",
                "totalBudget": "Estimated total cost in INR",
                "highlights": ["Top 3-5 trip highlights"]
            },
            "itinerary": [
                {
                    "day": 1,
                    "date": "Day 1",
                    "theme": "Day theme based on activities",
                    "morning": {
                        "activity": "Activity name",
                        "description": "Detailed description",
                        "timing": "9:00 AM - 11:30 AM",
                        "location": "Specific location with address",
                        "coordinates": {"lat": 0, "lng": 0},
                        "entryFee": "Cost in INR",
                        "highlights": ["Key highlights"],
                        "tips": "Insider tips and recommendations",
                        "transportation": "How to reach",
                        "imageQuery": "Search term for images"
                    },
                    "afternoon": {
                        "activity": "Activity name",
                        "description": "Detailed description", 
                        "timing": "2:00 PM - 5:00 PM",
                        "location": "Specific location",
                        "coordinates": {"lat": 0, "lng": 0},
                        "entryFee": "Cost in INR",
                        "highlights": ["Key highlights"],
                        "tips": "Travel tips",
                        "transportation": "How to reach",
                        "imageQuery": "Search term"
                    },
                    "evening": {
                        "activity": "Evening activity",
                        "description": "Detailed description",
                        "timing": "6:00 PM - 8:00 PM", 
                        "location": "Location",
                        "coordinates": {"lat": 0, "lng": 0},
                        "entryFee": "Cost in INR",
                        "highlights": ["Highlights"],
                        "tips": "Evening tips",
                        "transportation": "Transport info",
                        "imageQuery": "Search term"
                    },
                    "dining": {
                        "breakfast": {
                            "restaurant": "Restaurant name",
                            "cuisine": "Cuisine type",
                            "specialty": "Must-try dishes",
                            "location": "Location/area",
                            "priceRange": "INR range per person",
                            "timing": "Best time to visit",
                            "imageQuery": "Restaurant search term"
                        },
                        "lunch": {
                            "restaurant": "Restaurant name",
                            "cuisine": "Cuisine type", 
                            "specialty": "Signature dishes",
                            "location": "Location",
                            "priceRange": "INR range",
                            "timing": "Best timing",
                            "imageQuery": "Search term"
                        },
                        "dinner": {
                            "restaurant": "Restaurant name",
                            "cuisine": "Cuisine type",
                            "specialty": "Must-try items", 
                            "location": "Location",
                            "priceRange": "Cost range in INR",
                            "timing": "Best time",
                            "imageQuery": "Search term"
                        }
                    },
                    "accommodation": {
                        "budget": "Budget hotel recommendation",
                        "midRange": "Mid-range option",
                        "luxury": "Luxury recommendation",
                        "area": "Best area to stay"
                    },
                    "transportation": {
                        "localTransport": "Best local transport options",
                        "costs": "Transport costs in INR",
                        "tips": "Transportation tips"
                    }
                }
            ],
            "summary": {
                "overview": "Complete trip summary",
                "totalEstimatedCost": "Total budget in INR",
                "keyExperiences": ["Top experiences"],
                "culturalHighlights": ["Cultural highlights"],
                "foodieHighlights": ["Food experiences"],
                "practicalTips": ["Essential practical tips"]
            },
            "budgetBreakdown": {
                "accommodation": "INR range per night",
                "food": "INR range per day", 
                "activities": "INR range per day",
                "transportation": "INR range per day",
                "shopping": "INR range per day",
                "total": "Total estimated INR"
            },
            "localTips": [
                "Essential cultural etiquette",
                "Local customs to respect",
                "Safety recommendations",
                "Best photo spots",
                "Local language phrases"
            ]
        }

        IMPORTANT: Provide ONLY the JSON object, no additional text before or after. Include specific real restaurant names, actual locations, and realistic costs in INR.`;

        // Generate itinerary with Gemini AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        let itineraryData;
        try {
            // Clean the response and extract JSON
            let cleanedResponse = text
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
                .replace(/\/\/.*$/gm, '') // Remove // comments
                .replace(/```json\s*/, '') // Remove ```json markers
                .replace(/```\s*$/, '') // Remove ``` markers
                .trim();
            
            console.log('🧹 Cleaned response:', cleanedResponse);
            
            // Find JSON content in the cleaned response
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    itineraryData = JSON.parse(jsonMatch[0]);
                    console.log('✅ Successfully parsed JSON response');
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError.message);
                    console.log('🔍 Attempting to fix common JSON issues...');
                    
                    // Try to fix common JSON issues
                    let fixedJson = jsonMatch[0]
                        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
                        .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Ensure property names are quoted
                        .replace(/:\s*'([^']*)'/g, ':"$1"') // Convert single quotes to double quotes
                        .replace(/:\s*`([^`]*)`/g, ':"$1"'); // Convert backticks to double quotes
                    
                    console.log('🔧 Fixed JSON attempt:', fixedJson);
                    
                    try {
                        itineraryData = JSON.parse(fixedJson);
                        console.log('✅ Successfully parsed fixed JSON response');
                    } catch (finalError) {
                        console.error('❌ Final JSON parse error:', finalError.message);
                        throw new Error(`Failed to parse AI response: ${finalError.message}`);
                    }
                }
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            // Fallback to structured itinerary
            itineraryData = createFallbackItinerary(destination, days, interests);
        }

        // Enhance with Pexels images for each activity
        const enhancedItinerary = await enhanceItineraryWithImages(itineraryData);
        
        // Add hotel suggestions
        const hotelSuggestions = await getHotelSuggestions(destination);
        
        // Add destination overview image
        if (!enhancedItinerary.destinationImage) {
            enhancedItinerary.destinationImage = await searchPexelsImage(`${destination} city india landmarks`);
        }
        
        console.log('🎉 Enhanced itinerary with images:', {
            destination: enhancedItinerary.destination,
            days: enhancedItinerary.itinerary?.length || 0,
            imagesFound: enhancedItinerary.itinerary?.filter(day => 
                day.morning?.image || day.afternoon?.image || day.evening?.image
            ).length || 0,
            destinationImage: !!enhancedItinerary.destinationImage
        });
        
        return {
            success: true,
            itinerary: enhancedItinerary,
            hotels: hotelSuggestions,
            message: `Your ${days}-day ${destination} adventure is ready with ${enhancedItinerary.itinerary?.length || 0} days of detailed planning and beautiful images!`
        };
        
    } catch (error) {
        console.error('Error generating itinerary:', error);
        return {
            success: false,
            error: 'Failed to generate itinerary. Please try again.',
            details: error.message
        };
    }
}

// Enhance itinerary with relevant Pexels images
async function enhanceItineraryWithImages(itineraryData) {
    try {
        console.log('🖼️ Enhancing itinerary with Pexels images...');
        
        const enhancedItinerary = { ...itineraryData };
        
        // Process each day
        for (let day of enhancedItinerary.itinerary) {
            // Morning activity images
            if (day.morning && day.morning.imageQuery) {
                day.morning.image = await searchPexelsImage(day.morning.imageQuery);
            }
            
            // Afternoon activity images
            if (day.afternoon && day.afternoon.imageQuery) {
                day.afternoon.image = await searchPexelsImage(day.afternoon.imageQuery);
            }
            
            // Evening activity images
            if (day.evening && day.evening.imageQuery) {
                day.evening.image = await searchPexelsImage(day.evening.imageQuery);
            }
            
            // Dining images
            if (day.dining) {
                if (day.dining.lunch && day.dining.lunch.imageQuery) {
                    day.dining.lunch.image = await searchPexelsImage(day.dining.lunch.imageQuery);
                }
                if (day.dining.dinner && day.dining.dinner.imageQuery) {
                    day.dining.dinner.image = await searchPexelsImage(day.dining.dinner.imageQuery);
                }
            }
        }
        
        // Add destination overview image
        enhancedItinerary.destinationImage = await searchPexelsImage(`${itineraryData.destination} city india landmarks`);
        
        console.log('✅ Itinerary enhanced with images successfully');
        return enhancedItinerary;
        
    } catch (error) {
        console.error('Error enhancing itinerary with images:', error);
        return itineraryData; // Return original if enhancement fails
    }
}

// Enhanced Pexels image search with better relevance
async function searchPexelsImage(query) {
    try {
        if (!PEXELS_API_KEY) {
            console.warn('Pexels API key not found, using placeholder image');
            return getPlaceholderImage(query);
        }

        console.log(`🔍 Searching Pexels for: ${query}`);
        
        // Create more specific search queries for better results
        const enhancedQuery = `${query} india travel destination landmark`;
        const response = await axios.get(`${PEXELS_BASE_URL}/search`, {
            headers: {
                'Authorization': PEXELS_API_KEY
            },
            params: {
                query: enhancedQuery,
                per_page: 10, // Increased for better selection
                orientation: 'landscape',
                size: 'large' // Ensure high quality images
            }
        });

        if (response.data.photos && response.data.photos.length > 0) {
            // Select a random image from top results for variety
            const randomIndex = Math.floor(Math.random() * Math.min(3, response.data.photos.length));
            const photo = response.data.photos[randomIndex];
            
            console.log(`✅ Found image for "${query}": ${photo.url}`);
            return {
                url: photo.src.large,
                alt: photo.alt || query,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url
            };
        } else {
            console.log(`No images found for "${query}", using placeholder`);
            return getPlaceholderImage(query);
        }
        
    } catch (error) {
        console.error(`Error searching Pexels for "${query}":`, error.message);
        return getPlaceholderImage(query);
    }
}

// Get placeholder image when Pexels fails
function getPlaceholderImage(query) {
    const placeholders = {
        'temple': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'palace': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'fort': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'museum': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'restaurant': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'cafe': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'street food': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'market': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'park': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        'beach': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
    };
    
    // Find best matching placeholder
    for (const [key, url] of Object.entries(placeholders)) {
        if (query.toLowerCase().includes(key)) {
            return {
                url: url,
                alt: query,
                photographer: 'Placeholder',
                photographerUrl: '#'
            };
        }
    }
    
    // Default placeholder
    return {
        url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        alt: query,
        photographer: 'Placeholder',
        photographerUrl: '#'
    };
}

// Create fallback itinerary if Gemini fails
function createFallbackItinerary(destination, days, interests) {
    console.log('Creating fallback itinerary...');
    
    const fallbackItinerary = {
        destination: destination,
        days: days,
        interests: interests,
        itinerary: []
    };
    
    for (let day = 1; day <= days; day++) {
        fallbackItinerary.itinerary.push({
            day: day,
            date: `Day ${day}`,
            morning: {
                activity: `${destination} Morning Exploration`,
                description: `Start your day exploring the beautiful city of ${destination}`,
                timing: "9:00 AM - 12:00 PM",
                location: `${destination} City Center`,
                highlights: ["Local culture", "Historical sites"],
                tips: "Start early to avoid crowds",
                imageQuery: `${destination} morning city india`
            },
            afternoon: {
                activity: `${destination} Afternoon Adventure`,
                description: `Continue your journey through ${destination}'s attractions`,
                timing: "2:00 PM - 5:00 PM",
                location: `${destination} Tourist Area`,
                highlights: ["Famous landmarks", "Local experiences"],
                tips: "Stay hydrated and take breaks",
                imageQuery: `${destination} afternoon landmarks india`
            },
            evening: {
                activity: `${destination} Evening Experience`,
                description: `Enjoy the evening atmosphere of ${destination}`,
                timing: "6:00 PM - 9:00 PM",
                location: `${destination} Evening District`,
                highlights: ["Local cuisine", "Cultural shows"],
                tips: "Experience local nightlife safely",
                imageQuery: `${destination} evening city india`
            },
            dining: {
                lunch: {
                    restaurant: `${destination} Local Restaurant`,
                    cuisine: "Local Cuisine",
                    specialty: "Traditional dishes",
                    location: `${destination} Food District`,
                    imageQuery: `${destination} restaurant local food india`
                },
                dinner: {
                    restaurant: `${destination} Evening Dining`,
                    cuisine: "Regional Specialties",
                    specialty: "Evening specialties",
                    location: `${destination} Dining Area`,
                    imageQuery: `${destination} dinner restaurant india`
                }
            }
        });
    }
    
    fallbackItinerary.summary = `A wonderful ${days}-day journey through ${destination}`;
    fallbackItinerary.budget = "₹15,000 - ₹35,000";
    fallbackItinerary.bestTime = "October to March";
    fallbackItinerary.localTips = [
        "Respect local customs",
        "Try local street food",
        "Learn basic local phrases"
    ];
    
    return fallbackItinerary;
}

// Hotel suggestions with enhanced data
async function getHotelSuggestions(destination) {
    const destinationHotels = {
        'Mumbai': [
            {
                id: 1,
                name: "Taj Mahal Palace",
                location: "Colaba, Mumbai",
                price: 25000,
                originalPrice: 30000,
                rating: 4.8,
                image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
                amenities: ["Luxury", "Ocean View", "Spa", "Pool"],
                description: "Iconic luxury hotel with stunning Arabian Sea views"
            },
            {
                id: 2,
                name: "The Oberoi Mumbai",
                location: "Nariman Point, Mumbai",
                price: 18000,
                originalPrice: 22000,
                rating: 4.7,
                image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
                amenities: ["Business Center", "Restaurant", "Gym", "Spa"],
                description: "Elegant business hotel in the heart of Mumbai"
            }
        ],
        'Delhi': [
            {
                id: 3,
                name: "The Leela Palace",
                location: "Chanakyapuri, Delhi",
                price: 22000,
                originalPrice: 28000,
                rating: 4.9,
                image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
                amenities: ["Luxury", "Palace Style", "Garden", "Spa"],
                description: "Palatial luxury hotel with royal Indian architecture"
            }
        ],
        'Jaipur': [
            {
                id: 4,
                name: "Rambagh Palace",
                location: "Bani Park, Jaipur",
                price: 35000,
                originalPrice: 42000,
                rating: 4.9,
                image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
                amenities: ["Royal Palace", "Heritage", "Garden", "Luxury"],
                description: "Former royal residence turned luxury hotel"
            }
        ]
    };
    
    return destinationHotels[destination] || destinationHotels['Mumbai'];
}

// Geocoding function for map coordinates
async function geocodeLocation(location) {
    try {
        // Try OpenCage Geocoding API first
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: `${location}, India`,
                key: process.env.OPENCAGE_API_KEY || 'demo_key',
                limit: 1
            }
        });
        
        if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            return {
                lat: result.geometry.lat,
                lng: result.geometry.lng,
                formatted: result.formatted
            };
        }
    } catch (error) {
        console.log('OpenCage geocoding failed, using fallback coordinates');
    }
    
    // Fallback coordinates for major Indian cities
    const cityCoordinates = {
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Delhi': { lat: 28.7041, lng: 77.1025 },
        'Jaipur': { lat: 26.9124, lng: 75.7873 },
        'Varanasi': { lat: 25.3176, lng: 82.9739 },
        'Goa': { lat: 15.2993, lng: 74.1240 },
        'Kerala': { lat: 10.8505, lng: 76.2711 }
    };
    
    return cityCoordinates[location] || cityCoordinates['Mumbai'];
}

// Calculate distance between coordinates
function calculateDistanceBetweenCoords(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate distance between locations
async function calculateDistance(fromLocation, toLocation) {
    try {
        const fromCoords = await geocodeLocation(fromLocation);
        const toCoords = await geocodeLocation(toLocation);
        
        const distance = calculateDistanceBetweenCoords(
            fromCoords.lat, fromCoords.lng,
            toCoords.lat, toCoords.lng
        );
        
        return {
            from: fromLocation,
            to: toLocation,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
            unit: 'km'
        };
    } catch (error) {
        console.error('Error calculating distance:', error);
        return {
            from: fromLocation,
            to: toLocation,
            distance: 'Unknown',
            unit: 'km'
        };
    }
}

module.exports = {
    generateItinerary,
    searchPexelsImage,
    getHotelSuggestions,
    geocodeLocation,
    calculateDistance
};

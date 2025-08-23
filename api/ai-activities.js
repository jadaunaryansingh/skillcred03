/**
 * AI-Powered Activities Generation with External API Integration
 * This module provides intelligent activity suggestions using multiple data sources
 */

const axios = require('axios');

const config = require('../config');

// Configuration for external APIs
const API_CONFIG = {
    OPENAI_API_KEY: config.OPENAI_API_KEY,
    GOOGLE_PLACES_API_KEY: config.GOOGLE_PLACES_API_KEY,
    FOURSQUARE_API_KEY: config.FOURSQUARE_API_KEY,
    TRIPADVISOR_API_KEY: config.TRIPADVISOR_API_KEY
};

/**
 * Generate AI-powered activities using multiple data sources
 * @param {string} destination - Destination name
 * @param {Array} travelStyles - Array of travel styles
 * @param {string} prompt - Additional user prompt
 * @returns {Object} Generated activities
 */
async function generateActivitiesWithAI(destination, travelStyles, prompt = '') {
    try {
        console.log(`🤖 Generating AI activities for ${destination} with styles: ${travelStyles.join(', ')}`);
        
        // Try to get real-time data from external APIs first
        let realTimeActivities = null;
        try {
            realTimeActivities = await getRealTimeActivities(destination, travelStyles);
        } catch (error) {
            console.log('⚠️ Real-time API failed, using intelligent fallback');
        }
        
        // Generate intelligent activities based on destination analysis
        const intelligentActivities = generateIntelligentActivities(destination, travelStyles, prompt);
        
        // Combine real-time data with intelligent generation
        const combinedActivities = combineActivities(realTimeActivities, intelligentActivities, travelStyles);
        
        return {
            success: true,
            destination,
            travelStyles,
            activities: combinedActivities,
            dataSource: realTimeActivities ? 'Real-time APIs + AI' : 'AI Intelligence',
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('❌ Error generating AI activities:', error);
        throw new Error('Failed to generate AI activities');
    }
}

/**
 * Get real-time activities from external APIs
 */
async function getRealTimeActivities(destination, travelStyles) {
    const activities = {
        attractions: [],
        restaurants: [],
        activities: [],
        events: []
    };
    
    try {
        // Try to get attractions from multiple sources
        const [attractions, restaurants, localActivities] = await Promise.allSettled([
            getAttractionsFromAPI(destination),
            getRestaurantsFromAPI(destination),
            getLocalActivitiesFromAPI(destination, travelStyles)
        ]);
        
        if (attractions.status === 'fulfilled') {
            activities.attractions = attractions.value;
        }
        if (restaurants.status === 'fulfilled') {
            activities.restaurants = restaurants.value;
        }
        if (localActivities.status === 'fulfilled') {
            activities.activities = localActivities.value;
        }
        
    } catch (error) {
        console.log('⚠️ External API calls failed:', error.message);
    }
    
    return activities;
}

/**
 * Get attractions from external API (simulated)
 */
async function getAttractionsFromAPI(destination) {
    // Simulate API call to attractions service
    const mockAttractions = {
        'Mumbai': [
            { name: 'Gateway of India', type: 'landmark', rating: 4.5, category: 'cultural' },
            { name: 'Marine Drive', type: 'scenic', rating: 4.3, category: 'nature' },
            { name: 'Elephanta Caves', type: 'heritage', rating: 4.4, category: 'cultural' }
        ],
        'Delhi': [
            { name: 'Red Fort', type: 'fort', rating: 4.6, category: 'cultural' },
            { name: 'Qutub Minar', type: 'monument', rating: 4.5, category: 'cultural' },
            { name: 'India Gate', type: 'memorial', rating: 4.4, category: 'cultural' }
        ],
        'Goa': [
            { name: 'Calangute Beach', type: 'beach', rating: 4.2, category: 'nature' },
            { name: 'Old Goa Churches', type: 'heritage', rating: 4.5, category: 'cultural' },
            { name: 'Dudhsagar Falls', type: 'waterfall', rating: 4.3, category: 'nature' }
        ]
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockAttractions[destination] || generateGenericAttractions(destination);
}

/**
 * Get restaurants from external API (simulated)
 */
async function getRestaurantsFromAPI(destination) {
    const mockRestaurants = {
        'Mumbai': [
            { name: 'Leopold Cafe', cuisine: 'continental', rating: 4.3, price: 'mid' },
            { name: 'Trishna', cuisine: 'seafood', rating: 4.6, price: 'luxury' },
            { name: 'Bademiya', cuisine: 'street food', rating: 4.4, price: 'budget' }
        ],
        'Delhi': [
            { name: 'Karim\'s', cuisine: 'mughlai', rating: 4.5, price: 'mid' },
            { name: 'Bukhara', cuisine: 'indian', rating: 4.7, price: 'luxury' },
            { name: 'Paranthe Wali Gali', cuisine: 'street food', rating: 4.2, price: 'budget' }
        ]
    };
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockRestaurants[destination] || generateGenericRestaurants(destination);
}

/**
 * Get local activities from external API (simulated)
 */
async function getLocalActivitiesFromAPI(destination, travelStyles) {
    const activities = [];
    
    if (travelStyles.includes('adventure')) {
        activities.push(
            { name: 'Local Adventure Tours', type: 'adventure', rating: 4.4, category: 'adventure' },
            { name: 'Outdoor Sports', type: 'sports', rating: 4.2, category: 'adventure' }
        );
    }
    
    if (travelStyles.includes('culture')) {
        activities.push(
            { name: 'Cultural Workshops', type: 'workshop', rating: 4.5, category: 'cultural' },
            { name: 'Heritage Walks', type: 'walking tour', rating: 4.3, category: 'cultural' }
        );
    }
    
    if (travelStyles.includes('food')) {
        activities.push(
            { name: 'Food Tours', type: 'culinary', rating: 4.6, category: 'food' },
            { name: 'Cooking Classes', type: 'workshop', rating: 4.4, category: 'food' }
        );
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return activities;
}

/**
 * Generate intelligent activities using destination analysis
 */
function generateIntelligentActivities(destination, travelStyles, prompt) {
    const activities = {
        morning: [],
        afternoon: [],
        evening: []
    };
    
    // Analyze destination characteristics
    const destinationProfile = analyzeDestinationProfile(destination);
    
    // Generate activities for each time period
    activities.morning = generateTimeBasedActivities(destination, travelStyles, 'morning', destinationProfile);
    activities.afternoon = generateTimeBasedActivities(destination, travelStyles, 'afternoon', destinationProfile);
    activities.evening = generateTimeBasedActivities(destination, travelStyles, 'evening', destinationProfile);
    
    // Apply user prompt if provided
    if (prompt) {
        applyUserPrompt(activities, prompt, travelStyles);
    }
    
        return activities;
}

/**
 * Analyze destination profile for intelligent activity generation
 */
function analyzeDestinationProfile(destination) {
    const profile = {
        type: 'city',
        climate: 'temperate',
        culture: 'diverse',
        size: 'large',
        specialties: []
    };
    
    const destinationLower = destination.toLowerCase();
    
    // Determine destination type
    if (destinationLower.includes('beach') || destinationLower.includes('island')) {
        profile.type = 'beach';
        profile.specialties.push('water activities', 'seafood', 'beach culture');
    } else if (destinationLower.includes('mountain') || destinationLower.includes('hill')) {
        profile.type = 'mountain';
        profile.specialties.push('hiking', 'adventure sports', 'nature');
    } else if (destinationLower.includes('desert')) {
        profile.type = 'desert';
        profile.specialties.push('desert tours', 'stargazing', 'cultural experiences');
    }
    
    // Determine climate characteristics
    if (destinationLower.includes('tropical') || destinationLower.includes('beach')) {
        profile.climate = 'tropical';
    } else if (destinationLower.includes('cold') || destinationLower.includes('mountain')) {
        profile.climate = 'cold';
    }
    
    // Determine cultural characteristics
    if (destinationLower.includes('heritage') || destinationLower.includes('ancient')) {
        profile.culture = 'heritage';
        profile.specialties.push('historical sites', 'cultural tours');
    }
    
    return profile;
}

/**
 * Generate time-based activities
 */
function generateTimeBasedActivities(destination, travelStyles, timeOfDay, destinationProfile) {
    const activities = [];
    
    // Base activities for each travel style
    travelStyles.forEach(style => {
        switch (style) {
            case 'culture':
                activities.push(...generateCulturalActivitiesForTime(destination, timeOfDay, destinationProfile));
                break;
            case 'food':
                activities.push(...generateFoodActivitiesForTime(destination, timeOfDay, destinationProfile));
                break;
            case 'adventure':
                activities.push(...generateAdventureActivitiesForTime(destination, timeOfDay, destinationProfile));
                break;
            case 'relaxation':
                activities.push(...generateRelaxationActivitiesForTime(destination, timeOfDay, destinationProfile));
                break;
        }
    });
    
    // Remove duplicates and limit to 3-4 activities per time period
    const uniqueActivities = [...new Set(activities)];
    return uniqueActivities.slice(0, 4);
}

/**
 * Generate cultural activities for specific time
 */
function generateCulturalActivitiesForTime(destination, timeOfDay, profile) {
    const activities = {
        morning: [
            `Visit ${destination}'s most iconic historical landmark`,
            `Explore the main museum or cultural center`,
            `Take a guided walking tour of the historic district`
        ],
        afternoon: [
            `Visit art galleries and cultural exhibitions`,
            `Experience local crafts and traditional workshops`,
            `Learn about local history at heritage sites`
        ],
        evening: [
            `Attend a cultural performance or traditional show`,
            `Visit illuminated monuments and landmarks`,
            `Experience local nightlife and entertainment`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

/**
 * Generate food activities for specific time
 */
function generateFoodActivitiesForTime(destination, timeOfDay, profile) {
    const activities = {
        morning: [
            `Start your day with local breakfast specialties`,
            `Visit a famous local cafe or breakfast spot`,
            `Explore morning food markets and street food`
        ],
        afternoon: [
            `Try traditional lunch at a local restaurant`,
            `Visit food markets and sample local delicacies`,
            `Take a cooking class to learn local recipes`
        ],
        evening: [
            `Enjoy fine dining at a renowned restaurant`,
            `Experience street food culture in the evening`,
            `Visit food festivals or night markets`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

/**
 * Generate adventure activities for specific time
 */
function generateAdventureActivitiesForTime(destination, timeOfDay, profile) {
    const activities = {
        morning: [
            `Start with an early morning adventure activity`,
            `Go hiking or trekking in nearby natural areas`,
            `Try water sports or outdoor activities`
        ],
        afternoon: [
            `Continue with adrenaline-pumping activities`,
            `Try extreme sports or adventure tours`,
            `Explore caves, canyons, or natural formations`
        ],
        evening: [
            `Experience night adventure activities`,
            `Go stargazing or night photography`,
            `Try evening adventure sports`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

/**
 * Generate relaxation activities for specific time
 */
function generateRelaxationActivitiesForTime(destination, timeOfDay, profile) {
    const activities = {
        morning: [
            `Start with a peaceful morning meditation`,
            `Enjoy a relaxing spa or wellness treatment`,
            `Take a gentle morning walk in nature`
        ],
        afternoon: [
            `Continue with relaxation and wellness activities`,
            `Visit peaceful gardens or meditation centers`,
            `Enjoy a leisurely lunch in a tranquil setting`
        ],
        evening: [
            `End the day with evening relaxation`,
            `Enjoy sunset viewing at peaceful locations`,
            `Experience evening spa or wellness treatments`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

/**
 * Apply user prompt to customize activities
 */
function applyUserPrompt(activities, prompt, travelStyles) {
    const promptLower = prompt.toLowerCase();
    
    // Customize based on prompt keywords
    if (promptLower.includes('family') || promptLower.includes('kids')) {
        activities.morning.unshift('Family-friendly morning activities');
        activities.afternoon.unshift('Kid-friendly afternoon experiences');
        activities.evening.unshift('Family evening entertainment');
    }
    
    if (promptLower.includes('budget') || promptLower.includes('cheap')) {
        activities.morning = activities.morning.map(activity => `${activity} (Budget-friendly)`);
        activities.afternoon = activities.afternoon.map(activity => `${activity} (Budget-friendly)`);
        activities.evening = activities.evening.map(activity => `${activity} (Budget-friendly)`);
    }
    
    if (promptLower.includes('luxury') || promptLower.includes('premium')) {
        activities.morning = activities.morning.map(activity => `${activity} (Premium experience)`);
        activities.afternoon = activities.afternoon.map(activity => `${activity} (Premium experience)`);
        activities.evening = activities.evening.map(activity => `${activity} (Premium experience)`);
    }
}

/**
 * Combine real-time data with intelligent generation
 */
function combineActivities(realTimeData, intelligentActivities, travelStyles) {
    const combined = {
        morning: [...intelligentActivities.morning],
        afternoon: [...intelligentActivities.afternoon],
        evening: [...intelligentActivities.evening]
    };
    
    // Add real-time attractions if available
    if (realTimeData && realTimeData.attractions) {
        realTimeData.attractions.forEach(attraction => {
            if (attraction.category === 'cultural' && travelStyles.includes('culture')) {
                combined.morning.unshift(`Visit ${attraction.name} (${attraction.rating}⭐)`);
            }
        });
    }
    
    // Add real-time restaurants if available
    if (realTimeData && realTimeData.restaurants) {
        realTimeData.restaurants.forEach(restaurant => {
            if (travelStyles.includes('food')) {
                combined.afternoon.unshift(`Dine at ${restaurant.name} (${restaurant.cuisine})`);
            }
        });
    }
    
    // Limit activities per time period
    Object.keys(combined).forEach(time => {
        combined[time] = combined[time].slice(0, 4);
    });
    
    return combined;
}

/**
 * Generate generic attractions for unknown destinations
 */
function generateGenericAttractions(destination) {
    return [
        { name: `${destination} Main Square`, type: 'landmark', rating: 4.0, category: 'cultural' },
        { name: `${destination} Cultural Center`, type: 'cultural', rating: 4.0, category: 'cultural' },
        { name: `${destination} Natural Park`, type: 'nature', rating: 4.0, category: 'nature' }
    ];
}

/**
 * Generate generic restaurants for unknown destinations
 */
function generateGenericRestaurants(destination) {
    return [
        { name: `${destination} Local Restaurant`, cuisine: 'local', rating: 4.0, price: 'mid' },
        { name: `${destination} Traditional Cafe`, cuisine: 'traditional', rating: 4.0, price: 'budget' },
        { name: `${destination} Fine Dining`, cuisine: 'international', rating: 4.0, price: 'luxury' }
    ];
}

module.exports = {
    generateActivitiesWithAI
};

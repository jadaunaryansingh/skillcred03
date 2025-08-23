/**
 * Standardized Itinerary Data Structure
 * This file defines the exact structure that the backend must return
 * and the frontend expects to receive
 */

/**
 * Standard Itinerary Response Structure
 * @typedef {Object} ItineraryResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} destination - Destination name
 * @property {number} duration - Number of days
 * @property {Array<string>} interests - Travel interests/styles
 * @property {string} totalCost - Total estimated cost
 * @property {Array<string>} highlights - Key highlights of the trip
 * @property {Array<string>} localTips - Local travel tips
 * @property {Object} overview - Trip overview information
 * @property {Array<DayPlan>} days - Daily itinerary plans
 * @property {Object} recommendations - Additional recommendations
 * @property {string} timestamp - When the itinerary was generated
 */

/**
 * Day Plan Structure
 * @typedef {Object} DayPlan
 * @property {number} day - Day number (1, 2, 3, etc.)
 * @property {string} theme - Theme for the day
 * @property {Object} activities - Activities for different times
 * @property {Object} restaurants - Restaurant recommendations
 * @property {Array<string>} accommodation - Accommodation suggestions
 * @property {Array<string>} transport - Transportation options
 * @property {string} estimatedCost - Estimated cost for the day
 */

/**
 * Activities Structure
 * @typedef {Object} Activities
 * @property {Array<string>} morning - Morning activities
 * @property {Array<string>} afternoon - Afternoon activities
 * @property {Array<string>} evening - Evening activities
 */

/**
 * Restaurants Structure
 * @typedef {Object} Restaurants
 * @property {Array<string>} breakfast - Breakfast options
 * @property {Array<string>} lunch - Lunch options
 * @property {Array<string>} dinner - Dinner options
 */

/**
 * Overview Structure
 * @typedef {Object} Overview
 * @property {string} summary - Trip summary description
 * @property {string} bestTime - Best time to visit
 * @property {Array<string>} highlights - Key highlights
 * @property {string} totalCost - Total trip cost
 */

/**
 * Recommendations Structure
 * @typedef {Object} Recommendations
 * @property {Array<string>} clothing - Clothing recommendations
 * @property {Array<string>} activities - Activity recommendations
 * @property {Array<string>} precautions - Safety precautions
 * @property {string} bestTime - Best time for activities
 */

/**
 * Create a standardized itinerary response
 * @param {Object} data - Raw itinerary data
 * @returns {ItineraryResponse} Standardized response
 */
function createStandardizedItinerary(data) {
    return {
        success: true,
        destination: data.destination || 'Unknown Destination',
        duration: data.days || data.duration || 1,
        interests: data.interests || ['culture'],
        totalCost: data.totalCost || '₹0',
        highlights: data.highlights || ['Amazing Experiences', 'Local Culture', 'Unique Adventures'],
        localTips: data.localTips || ['Enjoy your trip!'],
        overview: {
            summary: data.overview?.summary || `Discover the best of ${data.destination || 'this destination'} in ${data.days || 1} days!`,
            bestTime: data.overview?.bestTime || 'Year-round',
            highlights: data.highlights || ['Amazing Experiences', 'Local Culture', 'Unique Adventures'],
            totalCost: data.totalCost || '₹0'
        },
        days: data.dailyPlans || data.days || [],
        recommendations: {
            clothing: data.recommendations?.clothing || ['Comfortable clothing', 'Weather-appropriate attire'],
            activities: data.recommendations?.activities || ['Explore local attractions', 'Try local cuisine'],
            precautions: data.recommendations?.precautions || ['Stay hydrated', 'Follow local customs'],
            bestTime: data.recommendations?.bestTime || 'anytime'
        },
        timestamp: new Date().toISOString()
    };
}

/**
 * Validate itinerary structure
 * @param {Object} itinerary - Itinerary to validate
 * @returns {Object} Validation result
 */
function validateItineraryStructure(itinerary) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!itinerary.destination) errors.push('Missing destination');
    if (!itinerary.duration && !itinerary.days) errors.push('Missing duration/days');
    if (!itinerary.interests) errors.push('Missing interests');
    
    // Structure validation
    if (!Array.isArray(itinerary.days)) {
        errors.push('Days must be an array');
    } else if (itinerary.days.length === 0) {
        warnings.push('No daily plans provided');
    }

    if (!itinerary.overview) {
        warnings.push('Missing overview section');
    }

    if (!itinerary.highlights) {
        warnings.push('Missing highlights');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        structure: itinerary
    };
}

/**
 * Transform backend response to frontend format
 * @param {Object} backendResponse - Response from backend API
 * @returns {ItineraryResponse} Frontend-ready response
 */
function transformBackendResponse(backendResponse) {
    // If it's already in the right format, return as is
    if (backendResponse.success && backendResponse.days && Array.isArray(backendResponse.days)) {
        return backendResponse;
    }

    // Transform from old format
    if (backendResponse.itinerary && Array.isArray(backendResponse.itinerary)) {
        return {
            ...backendResponse,
            days: backendResponse.itinerary,
            duration: backendResponse.days || backendResponse.itinerary.length
        };
    }

    // Transform from dailyPlans format
    if (backendResponse.dailyPlans && Array.isArray(backendResponse.dailyPlans)) {
        return {
            ...backendResponse,
            days: backendResponse.dailyPlans,
            duration: backendResponse.days || backendResponse.dailyPlans.length
        };
    }

    // Fallback transformation
    return createStandardizedItinerary(backendResponse);
}

/**
 * Example of a complete itinerary structure
 */
const EXAMPLE_ITINERARY = {
    success: true,
    destination: "Mumbai",
    duration: 3,
    interests: ["culture", "food"],
    totalCost: "₹15,000",
    highlights: [
        "Gateway of India",
        "Street Food Culture", 
        "Marine Drive Sunset",
        "Local Markets"
    ],
    localTips: [
        "Use local trains during off-peak hours",
        "Try street food from busy stalls",
        "Book popular restaurants in advance"
    ],
    overview: {
        summary: "Discover the best of Mumbai in 3 days with culture, food focused experiences.",
        bestTime: "October to March",
        highlights: [
            "Gateway of India",
            "Street Food Culture", 
            "Marine Drive Sunset",
            "Local Markets"
        ],
        totalCost: "₹15,000"
    },
    days: [
        {
            day: 1,
            theme: "Cultural & Heritage Experience",
            activities: {
                morning: [
                    "Visit Gateway of India",
                    "Explore Colaba Causeway",
                    "Elephanta Caves tour"
                ],
                afternoon: [
                    "Crawford Market shopping",
                    "Chhatrapati Shivaji Terminus",
                    "Fort district heritage walk"
                ],
                evening: [
                    "Marine Drive sunset",
                    "Juhu Beach street food",
                    "Evening entertainment"
                ]
            },
            restaurants: {
                breakfast: ["Kyani & Co. Cafe", "Local breakfast spot"],
                lunch: ["Leopold Cafe", "Traditional restaurant"],
                dinner: ["Bademiya", "Street food paradise"]
            },
            accommodation: ["3-Star Hotels", "Boutique Hotels", "Service Apartments"],
            transport: ["Local Trains", "Metro", "Taxis"],
            estimatedCost: "₹5,000"
        }
    ],
    recommendations: {
        clothing: ["Light clothing", "Comfortable shoes", "Sunscreen"],
        activities: ["Cultural tours", "Food exploration", "Shopping"],
        precautions: ["Stay hydrated", "Bargain at markets", "Use public transport"],
        bestTime: "early morning or evening"
    },
    timestamp: new Date().toISOString()
};

module.exports = {
    createStandardizedItinerary,
    validateItineraryStructure,
    transformBackendResponse,
    EXAMPLE_ITINERARY
};

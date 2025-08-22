/**
 * Trip Planner AI - Itinerary Generation Functions
 * This file contains all the helper functions for creating detailed travel itineraries
 */

// Enhanced destination activities database
const enhancedActivitiesDb = {
    'Mumbai': {
        culture: {
            morning: [
                'Gateway of India (Apollo Bunder, Mumbai) - FREE entry | Travel: ₹50-100 taxi from city center | Explore the iconic arch monument built in 1924, visit nearby Taj Mahal Palace Hotel (₹500 for heritage tour), walk around Colaba area',
                'Elephanta Caves (Elephanta Island) - Entry: ₹40 (Indians), ₹600 (Foreigners) | Ferry: ₹150 return from Gateway of India | UNESCO World Heritage rock-cut cave temples from 5th-8th century dedicated to Lord Shiva',
                'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (Fort District) - Entry: ₹70 (Indians), ₹500 (Foreigners) | Travel: ₹30-50 local train to CST | Premier museum with Indo-Saracenic architecture, ancient artifacts collection'
            ],
            afternoon: [
                'Colaba Causeway Market (Colaba) - FREE entry | Travel: ₹40 local train to Churchgate | Shopping for jewelry, handicrafts, vintage items | Budget: ₹500-2000 for shopping',
                'Crawford Market (D.N. Road, Fort) - Entry: ₹20 | Travel: ₹30 local train to CST | Historic wholesale market built in 1869, fresh fruits, spices, pets section',
                'Chhatrapati Shivaji Terminus (CST Station) - FREE entry | UNESCO World Heritage Victorian Gothic railway station built in 1887 | Heritage walk around Fort district architecture'
            ],
            evening: [
                'Marine Drive (Netaji Subhash Chandra Bose Road) - FREE | Travel: ₹30-50 local train to Churchgate | 3.6 km promenade, sunset views, street food costs ₹100-300',
                'Hanging Gardens (Malabar Hill) - Entry: ₹5 | Travel: ₹80-120 taxi from city center | Terraced gardens with city views, visit nearby Kamala Nehru Park (₹5 entry)',
                'Juhu Beach (Juhu) - FREE | Travel: ₹40 local train to Vile Parle then ₹30 auto | Street food paradise: bhel puri ₹30, pav bhaji ₹50, kulfi ₹25'
            ]
        },
        food: {
            morning: [
                'Mohammed Ali Road (Near Minara Masjid) - Travel: ₹30 local train to Mumbai Central | Famous for: Seekh kebab ₹80, roomali roti ₹25, mutton biryani ₹180 | Best time: 6-10 AM',
                'Kyani & Co. Cafe (Dhobi Talao, Marine Lines) - Travel: ₹30 local train to Marine Lines | Irani cafe since 1904: bun maska ₹25, Irani chai ₹15, mawa cake ₹35',
                'Thattu Kada (Matunga) - Travel: ₹30 local train to Matunga | South Indian breakfast: dosa ₹60, idli ₹40, filter coffee ₹25 | Authentic Kerala cuisine'
            ],
            afternoon: [
                'Leopold Cafe (Colaba Causeway) - Travel: ₹40 local train to Churchgate | Historic cafe since 1871: continental dishes ₹300-600, beer ₹200, pizza ₹400',
                'Britannia & Co. (Ballard Estate, Fort) - Travel: ₹30 local train to CST | Parsi cuisine: berry pulao ₹180, dhansak ₹200, caramel custard ₹80 | Established 1923',
                'Mahesh Lunch Home (Fort Branch) - Travel: ₹30 local train to CST | Seafood specialist: butter pepper garlic crab ₹800, koliwada prawns ₹400, fish curry rice ₹250'
            ],
            evening: [
                'Trishna Restaurant (Fort) - Travel: ₹30 local train to CST | Fine dining: tasting menu ₹2500-4000, wine pairing +₹1500 | Michelin recommended, book in advance',
                'Bademiya (Colaba) - Travel: ₹40 local train to Churchgate | Street food institution: seekh kebabs ₹100, roomali roti ₹30, chicken tikka ₹150 | Open till 4 AM',
                'Carter Road Social (Bandra West) - Travel: ₹40 local train to Bandra | Modern dining: small plates ₹200-400, cocktails ₹350-500, main course ₹500-800'
            ]
        }
    },
    'Delhi': {
        culture: {
            morning: [
                'Red Fort (Lal Qila, Old Delhi) - Entry: ₹35 (Indians), ₹550 (Foreigners) | Travel: ₹20 metro to Lal Qila station | Audio guide ₹100 | Mughal architecture, museums inside',
                'Lotus Temple (Kalkaji) - FREE entry | Travel: ₹30 metro to Kalkaji Mandir | No photography inside | Bahá\'í House of Worship, meditation sessions',
                'Akshardham Temple (Noida Mor) - Entry: FREE, exhibitions ₹170 | Travel: ₹40 metro to Akshardham | Water show ₹80, boat ride ₹85 | No phones/cameras allowed'
            ],
            afternoon: [
                'Qutub Minar (Mehrauli) - Entry: ₹35 (Indians), ₹550 (Foreigners) | Travel: ₹30 metro to Qutub Minar | UNESCO World Heritage, 73m tall minaret from 1193',
                'Humayun\'s Tomb (Nizamuddin) - Entry: ₹35 (Indians), ₹550 (Foreigners) | Travel: ₹25 metro to JLN Stadium + ₹50 auto | Mughal garden tomb, Isa Khan\'s tomb nearby',
                'National Museum (Janpath) - Entry: ₹20 (Indians), ₹650 (Foreigners) | Travel: ₹20 metro to Central Secretariat | Audio guide ₹200 | 5000 years of Indian heritage'
            ],
            evening: [
                'India Gate (Rajpath) - FREE | Travel: ₹20 metro to Central Secretariat | War memorial, evening lights, street food ₹50-150, boating nearby ₹100',
                'Rashtrapati Bhavan (Raisina Hill) - Museum entry: ₹50 | Travel: ₹20 metro to Central Secretariat | Mughal Gardens (seasonal), guided tours ₹25',
                'Chandni Chowk (Old Delhi) - FREE walking | Travel: ₹20 metro to Chandni Chowk | Heritage walk, Jama Masjid ₹50 for tower, rickshaw rides ₹100'
            ]
        }
    }
};

// Helper functions for itinerary generation
function getDestinationActivities(destination, travelStyles) {
    // This function is now handled by AI in ai-activities.js
    // Keeping this as fallback
    const activities = enhancedActivitiesDb[destination];
    if (activities && activities[travelStyles[0]]) {
        return activities[travelStyles[0]];
    }
    
    // Fallback activities
    return {
        morning: [
            `Explore ${destination}'s main attractions and landmarks`,
            `Visit top-rated museums and cultural sites`,
            `Walking tour of historic districts`
        ],
        afternoon: [
            `Experience local culture and traditions`,
            `Shopping at local markets and boutiques`,
            `Visit religious and spiritual sites`
        ],
        evening: [
            `Sunset viewing at scenic locations`,
            `Traditional dinner with local cuisine`,
            `Evening entertainment and nightlife`
        ]
    };
}

function getDestinationRestaurants(destination, budget) {
    const restaurants = {
        'Mumbai': {
            breakfast: ['Kyani & Co. Cafe', 'Thattu Kada', 'Mohammed Ali Road'],
            lunch: ['Leopold Cafe', 'Britannia & Co.', 'Mahesh Lunch Home'],
            dinner: ['Trishna Restaurant', 'Bademiya', 'Carter Road Social']
        },
        'Delhi': {
            breakfast: ['Paranthe Wali Gali', 'Karim\'s Restaurant', 'Giani Di Hatti'],
            lunch: ['Khan Market', 'Dilli Haat', 'Al Jawahar'],
            dinner: ['Connaught Place Food Court', 'Moti Mahal', 'Social']
        }
    };
    
    return restaurants[destination] || {
        breakfast: ['Local Cafe', 'Street Food Stall', 'Hotel Restaurant'],
        lunch: ['Traditional Restaurant', 'Local Market', 'Cafe'],
        dinner: ['Fine Dining', 'Local Eatery', 'Street Food']
    };
}

function getActivityCost(budget, timeOfDay) {
    const costRanges = {
        'budget': { morning: '₹200-500', afternoon: '₹300-800', evening: '₹400-1000' },
        'mid': { morning: '₹500-1000', afternoon: '₹800-1500', evening: '₹1000-2000' },
        'luxury': { morning: '₹1000-2500', afternoon: '₹1500-3000', evening: '₹2000-4000' },
        'premium': { morning: '₹2500-5000', afternoon: '₹3000-6000', evening: '₹4000-8000' }
    };
    
    return costRanges[budget]?.[timeOfDay] || '₹500-1500';
}

function getThemeForDay(destination, dayNumber, travelStyle) {
    const themes = {
        'Mumbai': ['Heritage & Culture', 'Food & Local Life', 'Modern Mumbai'],
        'Delhi': ['Historical Journey', 'Cultural Experience', 'Modern Delhi'],
        'Goa': ['Beach & Heritage', 'Adventure & Nature', 'Relaxation & Culture'],
        'Jaipur': ['Royal Heritage', 'Cultural Experience', 'Shopping & Food'],
        'Varanasi': ['Spiritual Journey', 'Cultural Immersion', 'Hidden Gems'],
        'Kerala': ['Nature & Backwaters', 'Cultural Heritage', 'Wellness & Relaxation']
    };
    
    const destinationThemes = themes[destination] || ['Cultural Experience', 'Local Exploration', 'Adventure & Discovery'];
    return destinationThemes[(dayNumber - 1) % destinationThemes.length];
}

function getRestaurantRecommendations(destination, budget) {
    const recommendations = {
        'Mumbai': {
            budget: ['Street Food Stalls', 'Local Cafes', 'Budget Restaurants'],
            mid: ['Leopold Cafe', 'Britannia & Co.', 'Mahesh Lunch Home'],
            luxury: ['Trishna Restaurant', 'The Taj Mahal Palace', 'Four Seasons'],
            premium: ['Fine Dining Restaurants', 'Celebrity Chef Restaurants', 'Exclusive Clubs']
        }
    };
    
    return recommendations[destination]?.[budget] || ['Local Restaurants', 'Cafes', 'Street Food'];
}

function getAccommodationSuggestions(destination, budget) {
    const suggestions = {
        'Mumbai': {
            budget: ['Hostels', 'Budget Hotels', 'Guest Houses'],
            mid: ['3-Star Hotels', 'Boutique Hotels', 'Service Apartments'],
            luxury: ['5-Star Hotels', 'Luxury Resorts', 'Heritage Hotels'],
            premium: ['Palace Hotels', 'Exclusive Resorts', 'Private Villas']
        }
    };
    
    return suggestions[destination]?.[budget] || ['Hotels', 'Guest Houses', 'Resorts'];
}

function getTransportationGuide(destination, budget) {
    const transport = {
        'Mumbai': {
            budget: ['Local Trains', 'Buses', 'Auto-rickshaws'],
            mid: ['Metro', 'Taxis', 'Ride-sharing'],
            luxury: ['Private Cars', 'Luxury Transfers', 'Helicopter Tours'],
            premium: ['Private Jets', 'Luxury Yachts', 'VIP Services']
        }
    };
    
    return transport[destination]?.[budget] || ['Public Transport', 'Taxis', 'Walking'];
}

function getLocalTips(destination) {
    const tips = {
        'Mumbai': [
            'Use local trains during off-peak hours (10 AM - 4 PM)',
            'Bargain at street markets but be respectful',
            'Try street food from busy stalls for freshness',
            'Book popular restaurants in advance',
            'Use metro for quick city travel',
            'Carry water and comfortable shoes',
            'Learn basic Marathi phrases for better experience'
        ],
        'Delhi': [
            'Use metro to avoid traffic congestion',
            'Bargain at markets but stay polite',
            'Try street food from popular stalls',
            'Book monuments online to skip queues',
            'Use auto-rickshaws with meters',
            'Carry water and wear comfortable clothes',
            'Learn basic Hindi phrases for better experience'
        ]
    };
    
    return tips[destination] || [
        'Research local customs and traditions',
        'Learn basic local language phrases',
        'Carry local currency and small change',
        'Use public transport when possible',
        'Try local cuisine and street food',
        'Respect local culture and traditions',
        'Keep emergency contacts handy'
    ];
}

function getBudgetBreakdown(duration, budget) {
    const baseCosts = {
        'budget': { accommodation: 1500, food: 800, transport: 300, activities: 500, misc: 200 },
        'mid': { accommodation: 3500, food: 1500, transport: 600, activities: 1000, misc: 400 },
        'luxury': { accommodation: 8000, food: 3000, transport: 1200, activities: 2000, misc: 800 },
        'premium': { accommodation: 15000, food: 5000, transport: 2000, activities: 4000, misc: 1500 }
    };
    
    const base = baseCosts[budget] || baseCosts['mid'];
    const total = Object.values(base).reduce((sum, cost) => sum + cost, 0) * duration;
    
            return {
        accommodation: `₹${(base.accommodation * duration).toLocaleString()}`,
        food: `₹${(base.food * duration).toLocaleString()}`,
        transport: `₹${(base.transport * duration).toLocaleString()}`,
        activities: `₹${(base.activities * duration).toLocaleString()}`,
        misc: `₹${(base.misc * duration).toLocaleString()}`,
        total: `₹${total.toLocaleString()}`
    };
}

function calculateTotalCost(duration, budget) {
    const breakdown = getBudgetBreakdown(duration, budget);
    return breakdown.total;
}

function getDestinationHighlights(destination) {
    const highlights = {
        'Mumbai': ['Gateway of India', 'Bollywood Culture', 'Street Food', 'Marine Drive'],
        'Delhi': ['Red Fort', 'India Gate', 'Qutub Minar', 'Chandni Chowk'],
        'Goa': ['Pristine Beaches', 'Portuguese Heritage', 'Water Sports', 'Seafood'],
        'Jaipur': ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Local Markets'],
        'Varanasi': ['Ganga Aarti', 'Kashi Vishwanath Temple', 'Ghats', 'Spiritual Experience'],
        'Kerala': ['Backwaters', 'Tea Gardens', 'Ayurveda', 'Beaches']
    };
    
    return highlights[destination] || ['Iconic Landmarks', 'Local Culture', 'Amazing Food', 'Unique Experiences'];
}

// Export all functions
module.exports = {
    getDestinationActivities,
    getDestinationRestaurants,
    getActivityCost,
    getThemeForDay,
    getRestaurantRecommendations,
    getAccommodationSuggestions,
    getTransportationGuide,
    getLocalTips,
    getBudgetBreakdown,
    calculateTotalCost,
    getDestinationHighlights,
    enhancedActivitiesDb,
    // Add missing functions that server.js needs
    generateItinerary,
    searchPexelsImage,
    geocodeLocation,
    calculateDistance
};

// Add missing functions that server.js is trying to import
async function generateItinerary(destination, days, interests) {
    try {
        console.log(`Generating ${days}-day itinerary for ${destination} with interests: ${interests.join(', ')}`);
        
        const itinerary = {
            destination,
            days,
            interests,
            dailyPlans: [],
            totalCost: '₹0',
            highlights: getDestinationHighlights(destination),
            localTips: getLocalTips(destination)
        };

        // Generate daily plans
        for (let day = 1; day <= days; day++) {
            const theme = getThemeForDay(destination, day, interests[0] || 'culture');
            const activities = getDestinationActivities(destination, interests);
            const restaurants = getDestinationRestaurants(destination, 'mid');
            
            const dailyPlan = {
                day,
                theme,
                activities: {
                    morning: activities.morning || [],
                    afternoon: activities.afternoon || [],
                    evening: activities.evening || []
                },
                restaurants: {
                    breakfast: restaurants.breakfast || [],
                    lunch: restaurants.lunch || [],
                    dinner: restaurants.dinner || []
                },
                accommodation: getAccommodationSuggestions(destination, 'mid'),
                transport: getTransportationGuide(destination, 'mid'),
                estimatedCost: getActivityCost('mid', 'morning')
            };
            
            itinerary.dailyPlans.push(dailyPlan);
        }

        // Calculate total cost (budget level)
        itinerary.totalCost = calculateTotalCost(days, 'mid');
        
        return itinerary;
        
    } catch (error) {
        console.error('Error generating itinerary:', error);
        throw new Error('Failed to generate itinerary');
    }
}

async function searchPexelsImage(query) {
    // Placeholder for Pexels image search
    // In a real implementation, you would integrate with Pexels API
    console.log(`Searching for image: ${query}`);
    return `https://images.pexels.com/photos/placeholder/${encodeURIComponent(query)}.jpg`;
}

async function geocodeLocation(location) {
    // Placeholder for geocoding
    // In a real implementation, you would integrate with Google Maps Geocoding API
    console.log(`Geocoding location: ${location}`);
    
    // Return mock coordinates for common destinations
    const mockCoordinates = {
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Delhi': { lat: 28.7041, lng: 77.1025 },
        'Goa': { lat: 15.2993, lng: 74.1240 },
        'Jaipur': { lat: 26.9124, lng: 75.7873 },
        'Varanasi': { lat: 25.3176, lng: 82.9739 },
        'Kerala': { lat: 10.8505, lng: 76.2711 }
    };
    
    return mockCoordinates[location] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
}

async function calculateDistance(from, to) {
    // Placeholder for distance calculation
    // In a real implementation, you would use Google Maps Distance Matrix API
    console.log(`Calculating distance from ${from} to ${to}`);
    
    // Return mock distance
    return {
        distance: '500 km',
        duration: '8 hours',
        mode: 'car'
    };
}


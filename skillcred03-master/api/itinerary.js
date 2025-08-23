/**
 * Trip Planner AI - Dynamic Itinerary Generation Functions
 * This file contains intelligent functions for creating dynamic travel itineraries
 */

const axios = require('axios');

// Dynamic activity generation based on destination type and travel style
function generateDynamicActivities(destination, travelStyles, timeOfDay) {
    const activities = [];
    
    // Analyze destination type (city, beach, mountain, etc.)
    const destinationType = analyzeDestinationType(destination);
    
    // Generate activities based on destination type and travel style
    if (destinationType === 'city') {
        if (travelStyles.includes('culture')) {
            activities.push(...generateCulturalActivities(destination, timeOfDay));
        }
        if (travelStyles.includes('food')) {
            activities.push(...generateFoodActivities(destination, timeOfDay));
        }
        if (travelStyles.includes('adventure')) {
            activities.push(...generateAdventureActivities(destination, timeOfDay));
        }
        if (travelStyles.includes('relaxation')) {
            activities.push(...generateRelaxationActivities(destination, timeOfDay));
        }
    } else if (destinationType === 'beach') {
        if (travelStyles.includes('adventure')) {
            activities.push(...generateBeachAdventureActivities(timeOfDay));
        }
        if (travelStyles.includes('relaxation')) {
            activities.push(...generateBeachRelaxationActivities(timeOfDay));
        }
        if (travelStyles.includes('culture')) {
            activities.push(...generateBeachCulturalActivities(destination, timeOfDay));
        }
    } else if (destinationType === 'mountain') {
        if (travelStyles.includes('adventure')) {
            activities.push(...generateMountainAdventureActivities(timeOfDay));
        }
        if (travelStyles.includes('relaxation')) {
            activities.push(...generateMountainRelaxationActivities(timeOfDay));
        }
        if (travelStyles.includes('culture')) {
            activities.push(...generateMountainCulturalActivities(destination, timeOfDay));
        }
    }
    
    // If no specific activities found, generate generic ones
    if (activities.length === 0) {
        activities.push(...generateGenericActivities(destination, travelStyles, timeOfDay));
    }
    
    return activities;
}

function analyzeDestinationType(destination) {
    const destinationLower = destination.toLowerCase();
    
    if (destinationLower.includes('beach') || destinationLower.includes('island') || 
        destinationLower.includes('coast') || destinationLower.includes('sea')) {
        return 'beach';
    } else if (destinationLower.includes('mountain') || destinationLower.includes('hill') || 
               destinationLower.includes('peak') || destinationLower.includes('valley')) {
        return 'mountain';
    } else if (destinationLower.includes('forest') || destinationLower.includes('jungle') || 
               destinationLower.includes('park') || destinationLower.includes('wildlife')) {
        return 'nature';
    } else if (destinationLower.includes('desert') || destinationLower.includes('sahara')) {
        return 'desert';
    } else {
        return 'city'; // Default to city
    }
}

function generateCulturalActivities(destination, timeOfDay) {
    const activities = {
            morning: [
            `Visit ${destination}'s most iconic historical landmark`,
            `Explore the main museum or cultural center`,
            `Take a guided walking tour of the historic district`,
            `Visit a famous temple, church, or religious site`
            ],
            afternoon: [
            `Explore local markets and traditional shopping areas`,
            `Visit art galleries and cultural exhibitions`,
            `Experience local crafts and traditional workshops`,
            `Learn about local history at heritage sites`
            ],
            evening: [
            `Attend a cultural performance or traditional show`,
            `Visit illuminated monuments and landmarks`,
            `Experience local nightlife and entertainment`,
            `Enjoy traditional dinner with local cuisine`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateFoodActivities(destination, timeOfDay) {
    const activities = {
            morning: [
            `Start your day with local breakfast specialties`,
            `Visit a famous local cafe or breakfast spot`,
            `Explore morning food markets and street food`,
            `Take a breakfast food tour of ${destination}`
            ],
            afternoon: [
            `Try traditional lunch at a local restaurant`,
            `Visit food markets and sample local delicacies`,
            `Take a cooking class to learn local recipes`,
            `Explore different neighborhoods for diverse cuisines`
            ],
            evening: [
            `Enjoy fine dining at a renowned restaurant`,
            `Experience street food culture in the evening`,
            `Visit food festivals or night markets`,
            `Take a food and wine pairing experience`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateAdventureActivities(destination, timeOfDay) {
    const activities = {
            morning: [
            `Start with an early morning adventure activity`,
            `Go hiking or trekking in nearby natural areas`,
            `Try water sports or outdoor activities`,
            `Explore off-the-beaten-path locations`
            ],
            afternoon: [
            `Continue with adrenaline-pumping activities`,
            `Try extreme sports or adventure tours`,
            `Explore caves, canyons, or natural formations`,
            `Go on a wildlife safari or nature expedition`
            ],
            evening: [
            `Experience night adventure activities`,
            `Go stargazing or night photography`,
            `Try evening adventure sports`,
            `Explore the destination after dark`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateRelaxationActivities(destination, timeOfDay) {
    const activities = {
        morning: [
            `Start with a peaceful morning meditation`,
            `Enjoy a relaxing spa or wellness treatment`,
            `Take a gentle morning walk in nature`,
            `Practice yoga or tai chi in serene surroundings`
        ],
        afternoon: [
            `Continue with relaxation and wellness activities`,
            `Visit peaceful gardens or meditation centers`,
            `Enjoy a leisurely lunch in a tranquil setting`,
            `Take a slow-paced cultural experience`
        ],
        evening: [
            `End the day with evening relaxation`,
            `Enjoy sunset viewing at peaceful locations`,
            `Experience evening spa or wellness treatments`,
            `Have a quiet dinner in a serene atmosphere`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateBeachAdventureActivities(timeOfDay) {
    const activities = {
        morning: [
            'Early morning beach jogging or yoga',
            'Sunrise kayaking or paddleboarding',
            'Beach volleyball or frisbee games',
            'Snorkeling in calm morning waters'
        ],
        afternoon: [
            'Jet skiing or parasailing adventures',
            'Scuba diving or underwater exploration',
            'Beach rock climbing or bouldering',
            'Water sports competitions and games'
        ],
        evening: [
            'Sunset sailing or boat tours',
            'Evening beach bonfire activities',
            'Night fishing or crabbing',
            'Beach camping under the stars'
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateBeachRelaxationActivities(timeOfDay) {
    const activities = {
        morning: [
            'Peaceful sunrise meditation on the beach',
            'Gentle beach walking and shell collecting',
            'Morning beach yoga or tai chi',
            'Quiet beach reading and relaxation'
        ],
        afternoon: [
            'Beachside massage and spa treatments',
            'Lazy afternoon beach lounging',
            'Beach picnic with local delicacies',
            'Gentle swimming and floating'
        ],
        evening: [
            'Romantic sunset beach dinner',
            'Evening beach meditation and reflection',
            'Stargazing from the beach',
            'Peaceful beachside accommodation'
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateMountainAdventureActivities(timeOfDay) {
    const activities = {
        morning: [
            'Early morning mountain hiking',
            'Sunrise peak climbing',
            'Mountain biking on scenic trails',
            'Rock climbing and bouldering'
        ],
        afternoon: [
            'Advanced mountain trekking',
            'Mountain rappelling and abseiling',
            'Mountain photography and exploration',
            'Wildlife spotting and nature trails'
        ],
        evening: [
            'Sunset mountain viewing',
            'Night mountain camping',
            'Evening mountain stargazing',
            'Mountain bonfire and storytelling'
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateMountainRelaxationActivities(timeOfDay) {
    const activities = {
        morning: [
            'Peaceful mountain sunrise meditation',
            'Gentle mountain hiking and nature walk',
            'Morning mountain yoga or tai chi',
            'Quiet mountain reading and relaxation'
        ],
        afternoon: [
            'Mountain side massage and spa treatments',
            'Lazy mountain lunch in a serene spot',
            'Mountain picnic with local delicacies',
            'Gentle mountain swimming and floating'
        ],
        evening: [
            'Romantic mountain sunset dinner',
            'Evening mountain meditation and reflection',
            'Stargazing from the mountain',
            'Peaceful mountainside accommodation'
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateMountainCulturalActivities(destination, timeOfDay) {
    const activities = {
        morning: [
            `Visit ${destination}'s most iconic mountain temple`,
            `Explore the main mountain monastery`,
            `Take a guided walking tour of the mountain trails`,
            `Visit a famous mountain shrine or spiritual site`
        ],
        afternoon: [
            `Experience local mountain crafts and traditions`,
            `Visit art galleries and cultural exhibitions`,
            `Learn about mountain history and folklore`,
            `Visit local mountain markets`
        ],
        evening: [
            `Attend a cultural performance or traditional show`,
            `Visit illuminated mountain landmarks`,
            `Experience local mountain nightlife and entertainment`,
            `Enjoy traditional mountain dinner with local cuisine`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateBeachCulturalActivities(destination, timeOfDay) {
    const activities = {
        morning: [
            `Visit ${destination}'s most iconic beach temple`,
            `Explore the main beach monastery`,
            `Take a guided walking tour of the beach trails`,
            `Visit a famous beach shrine or spiritual site`
        ],
        afternoon: [
            `Experience local beach crafts and traditions`,
            `Visit art galleries and cultural exhibitions`,
            `Learn about beach history and folklore`,
            `Visit local beach markets`
        ],
        evening: [
            `Attend a cultural performance or traditional show`,
            `Visit illuminated beach landmarks`,
            `Experience local beach nightlife and entertainment`,
            `Enjoy traditional beach dinner with local cuisine`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

function generateGenericActivities(destination, travelStyles, timeOfDay) {
    const activities = {
        morning: [
            `Start your day exploring ${destination}'s main attractions`,
            `Visit the most popular landmarks and monuments`,
            `Take a morning tour of the city center`,
            `Experience local morning culture and traditions`
        ],
        afternoon: [
            `Continue exploring ${destination}'s diverse offerings`,
            `Visit local markets and shopping areas`,
            `Experience local cuisine and dining culture`,
            `Learn about the destination's history and heritage`
        ],
        evening: [
            `Enjoy ${destination}'s evening atmosphere`,
            `Visit illuminated landmarks and attractions`,
            `Experience local nightlife and entertainment`,
            `End your day with traditional local experiences`
        ]
    };
    
    return activities[timeOfDay] || activities.morning;
}

// Dynamic restaurant generation
function generateDynamicRestaurants(destination, budget, mealType) {
    const restaurants = {
        breakfast: [
            `Local breakfast cafe in ${destination}`,
            `Traditional morning food spot`,
            `Popular breakfast restaurant`,
            `Street food breakfast stall`
        ],
        lunch: [
            `Traditional local restaurant`,
            `Popular lunch destination`,
            `Local food market`,
            `Cultural dining experience`
        ],
        dinner: [
            `Fine dining restaurant`,
            `Traditional evening eatery`,
            `Local night food market`,
            `Cultural dinner experience`
        ]
    };
    
    // Adjust based on budget
    if (budget === 'luxury' || budget === 'premium') {
        restaurants[mealType] = restaurants[mealType].map(r => `${r} (Premium)`);
    } else if (budget === 'budget') {
        restaurants[mealType] = restaurants[mealType].map(r => `${r} (Budget-friendly)`);
    }
    
    return restaurants[mealType] || restaurants.breakfast;
}

// Dynamic accommodation suggestions
function generateDynamicAccommodation(destination, budget) {
    const accommodations = {
        budget: [
            'Hostels and budget hotels',
            'Guest houses and homestays',
            'Budget-friendly accommodations',
            'Local family-run lodgings'
        ],
        mid: [
            '3-star hotels and resorts',
            'Boutique hotels and inns',
            'Service apartments',
            'Comfortable mid-range options'
        ],
        luxury: [
            '5-star luxury hotels',
            'Premium resorts and spas',
            'Exclusive boutique properties',
            'High-end accommodation experiences'
        ],
        premium: [
            'Palace hotels and heritage properties',
            'Exclusive luxury resorts',
            'Private villas and estates',
            'Ultra-premium accommodation'
        ]
    };
    
    return accommodations[budget] || accommodations.mid;
}

// Dynamic transportation guide
function generateDynamicTransport(destination, budget) {
    const transport = {
        budget: [
            'Public transportation (buses, trains)',
            'Local shared transport options',
            'Walking and cycling',
            'Budget-friendly taxi services'
        ],
        mid: [
            'Metro and light rail systems',
            'Regular taxi services',
            'Ride-sharing applications',
            'Comfortable public transport'
        ],
        luxury: [
            'Private car services',
            'Luxury transportation options',
            'Helicopter tours and transfers',
            'Premium travel experiences'
        ],
        premium: [
            'Exclusive private transport',
            'VIP transportation services',
            'Luxury yacht and private jet options',
            'Ultra-premium travel services'
        ]
    };
    
    return transport[budget] || transport.mid;
}

// Dynamic cost calculation
function calculateDynamicCost(days, budget, destination) {
    const baseCosts = {
        budget: { accommodation: 1500, food: 800, transport: 300, activities: 500, misc: 200 },
        mid: { accommodation: 3500, food: 1500, transport: 600, activities: 1000, misc: 400 },
        luxury: { accommodation: 8000, food: 3000, transport: 1200, activities: 2000, misc: 800 },
        premium: { accommodation: 15000, food: 5000, transport: 2000, activities: 4000, misc: 1500 }
    };
    
    // Adjust costs based on destination type
    const destinationType = analyzeDestinationType(destination);
    let multiplier = 1;
    
    if (destinationType === 'beach') multiplier = 1.2;
    else if (destinationType === 'mountain') multiplier = 1.3;
    else if (destinationType === 'nature') multiplier = 1.1;
    
    const base = baseCosts[budget] || baseCosts.mid;
    const total = Object.values(base).reduce((sum, cost) => sum + cost, 0) * days * multiplier;
    
    return `₹${Math.round(total).toLocaleString()}`;
}

// Dynamic highlights generation
function generateDynamicHighlights(destination, travelStyles) {
    const highlights = [];
    
    if (travelStyles.includes('culture')) {
        highlights.push('Cultural Heritage Sites', 'Historical Landmarks', 'Local Traditions');
    }
    if (travelStyles.includes('food')) {
        highlights.push('Local Cuisine', 'Food Markets', 'Traditional Dishes');
    }
    if (travelStyles.includes('adventure')) {
        highlights.push('Adventure Activities', 'Outdoor Experiences', 'Thrilling Activities');
    }
    if (travelStyles.includes('relaxation')) {
        highlights.push('Wellness Experiences', 'Peaceful Locations', 'Relaxation Activities');
    }
    
    // Add destination-specific highlights
    highlights.push(`${destination}'s Unique Charm`, 'Local Experiences', 'Memorable Moments');
    
    return highlights.slice(0, 5); // Return top 5 highlights
}

// Dynamic local tips generation
function generateDynamicTips(destination, travelStyles) {
    const tips = [
        `Research local customs and traditions in ${destination}`,
        'Learn basic local language phrases',
        'Carry local currency and small change',
        'Use public transport when possible',
        'Try local cuisine and street food',
        'Respect local culture and traditions',
        'Keep emergency contacts handy'
    ];
    
    // Add style-specific tips
    if (travelStyles.includes('adventure')) {
        tips.push('Check weather conditions before outdoor activities', 'Carry proper safety equipment');
    }
    if (travelStyles.includes('food')) {
        tips.push('Try food from busy stalls for freshness', 'Ask locals for restaurant recommendations');
    }
    if (travelStyles.includes('culture')) {
        tips.push('Dress appropriately for religious sites', 'Book popular attractions in advance');
    }
    
    return tips.slice(0, 8); // Return top 8 tips
}

function generateLocalTips(destination, travelStyles) {
    const tips = [
        'Start early to avoid crowds',
        'Take breaks and stay hydrated',
        'Experience local nightlife safely',
        'Ask locals for hidden gems',
        'Keep your valuables secure',
        'Follow local customs and dress codes',
        'Use local transportation for authentic experience',
        'Try street food from busy stalls'
    ];
    
    // Add destination-specific tips
    if (destination.toLowerCase().includes('mumbai')) {
        tips.push('Use local trains during off-peak hours', 'Try street food from Juhu Beach');
    } else if (destination.toLowerCase().includes('delhi')) {
        tips.push('Book popular attractions in advance', 'Use metro for easy navigation');
    } else if (destination.toLowerCase().includes('goa')) {
        tips.push('Rent a scooter for beach hopping', 'Try fresh seafood from local markets');
    }
    
    return tips;
}

// Main itinerary generation function
async function generateItinerary(destination, days, interests) {
    try {
        console.log(`Generating ${days}-day itinerary for ${destination} with interests: ${interests.join(', ')}`);
        
        const itinerary = {
            destination,
            days,
            interests,
            dailyPlans: [],
            totalCost: '₹0',
            highlights: generateDynamicHighlights(destination, interests),
            localTips: generateDynamicTips(destination, interests)
        };

        // Generate daily plans dynamically
        for (let day = 1; day <= days; day++) {
            const theme = generateDynamicTheme(destination, day, interests);
            
            // Generate structured daily plan that frontend expects
            const dailyPlan = {
                day,
                theme,
                morning: {
                    time: '9:00 AM - 12:00 PM',
                    activity: generateDynamicActivities(destination, interests, 'morning')[0] || 'Explore local attractions',
                    description: generateDynamicActivities(destination, interests, 'morning')[1] || 'Start your day with local exploration',
                    cost: '₹200-500',
                    tips: generateLocalTips(destination, interests)[0] || 'Start early to avoid crowds',
                    image: {
                        url: `https://images.pexels.com/photos/placeholder/morning-${day}.jpg`,
                        alt: 'Morning activity',
                        photographer: 'Pexels'
                    }
                },
                afternoon: {
                    time: '1:00 PM - 5:00 PM',
                    activity: generateDynamicActivities(destination, interests, 'afternoon')[0] || 'Cultural experience',
                    description: generateDynamicActivities(destination, interests, 'afternoon')[1] || 'Immerse yourself in local culture',
                    cost: '₹300-800',
                    tips: generateLocalTips(destination, interests)[1] || 'Take breaks and stay hydrated',
                    image: {
                        url: `https://images.pexels.com/photos/placeholder/afternoon-${day}.jpg`,
                        alt: 'Afternoon activity',
                        photographer: 'Pexels'
                    }
                },
                evening: {
                    time: '6:00 PM - 9:00 PM',
                    activity: generateDynamicActivities(destination, interests, 'evening')[0] || 'Evening entertainment',
                    description: generateDynamicActivities(destination, interests, 'evening')[1] || 'Enjoy local evening activities',
                    cost: '₹400-1000',
                    tips: generateLocalTips(destination, interests)[2] || 'Experience local nightlife safely',
                    image: {
                        url: `https://images.pexels.com/photos/placeholder/evening-${day}.jpg`,
                        alt: 'Evening activity',
                        photographer: 'Pexels'
                    }
                },
                restaurants: {
                    breakfast: generateDynamicRestaurants(destination, 'mid', 'breakfast'),
                    lunch: generateDynamicRestaurants(destination, 'mid', 'lunch'),
                    dinner: generateDynamicRestaurants(destination, 'mid', 'dinner')
                },
                accommodation: generateDynamicAccommodation(destination, 'mid'),
                transport: generateDynamicTransport(destination, 'mid'),
                estimatedCost: '₹500-1500'
            };
            
            itinerary.dailyPlans.push(dailyPlan);
        }

        // Calculate total cost dynamically
        itinerary.totalCost = calculateDynamicCost(days, 'mid', destination);
        
        // Use standardized structure
        const { createStandardizedItinerary } = require('./itinerary-structure');
        
        return createStandardizedItinerary({
            destination: itinerary.destination,
            days: itinerary.days,
            interests: itinerary.interests,
            totalCost: itinerary.totalCost,
            highlights: itinerary.highlights,
            localTips: itinerary.localTips,
            dailyPlans: itinerary.dailyPlans,
            recommendations: {
                clothing: generateClothingRecommendations(interests),
                activities: generateActivityRecommendations(interests),
                precautions: generatePrecautionRecommendations(destination),
                bestTime: generateBestTimeRecommendations(destination)
            }
        });
        
    } catch (error) {
        console.error('Error generating itinerary:', error);
        throw new Error('Failed to generate itinerary');
    }
}

function generateDynamicTheme(destination, dayNumber, travelStyles) {
    const themes = [
        'Cultural & Heritage Experience',
        'Adventure & Exploration',
        'Food & Culinary Journey',
        'Relaxation & Wellness',
        'Local Life & Traditions',
        'Nature & Outdoor Activities'
    ];
    
    // Create a theme based on the selected travel styles
    if (travelStyles.includes('food')) {
        return 'Food & Culinary Experience';
    } else if (travelStyles.includes('adventure')) {
        return 'Adventure & Exploration';
    } else if (travelStyles.includes('relaxation')) {
        return 'Relaxation & Wellness';
    } else if (travelStyles.includes('culture')) {
        return 'Cultural & Heritage Experience';
    } else {
        return themes[(dayNumber - 1) % themes.length];
    }
}

// Helper functions for recommendations
function generateClothingRecommendations(interests) {
    const recommendations = [];
    
    if (interests.includes('adventure')) {
        recommendations.push('Comfortable hiking shoes', 'Moisture-wicking clothing', 'Layered outfits for weather changes');
    }
    if (interests.includes('culture')) {
        recommendations.push('Modest clothing for religious sites', 'Comfortable walking shoes', 'Light, breathable fabrics');
    }
    if (interests.includes('beach')) {
        recommendations.push('Swimwear', 'Light cotton clothing', 'Sun protection gear');
    }
    if (interests.includes('food')) {
        recommendations.push('Comfortable clothing for long meals', 'Easy-to-clean fabrics', 'Casual dining attire');
    }
    
    return recommendations.length > 0 ? recommendations : ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Layered outfits'];
}

function generateActivityRecommendations(interests) {
    const recommendations = [];
    
    if (interests.includes('adventure')) {
        recommendations.push('Hiking and trekking', 'Water sports', 'Rock climbing');
    }
    if (interests.includes('culture')) {
        recommendations.push('Museum visits', 'Historical site exploration', 'Local art galleries');
    }
    if (interests.includes('food')) {
        recommendations.push('Cooking classes', 'Food tours', 'Local market visits');
    }
    if (interests.includes('relaxation')) {
        recommendations.push('Spa treatments', 'Yoga sessions', 'Meditation retreats');
    }
    
    return recommendations.length > 0 ? recommendations : ['Sightseeing', 'Local experiences', 'Cultural activities'];
}

function generatePrecautionRecommendations(destination) {
    const precautions = [
        'Keep emergency contacts handy',
        'Carry necessary medications',
        'Stay hydrated',
        'Be aware of local customs',
        'Keep valuables secure'
    ];
    
    // Add destination-specific precautions
    if (destination.toLowerCase().includes('mountain')) {
        precautions.push('Check weather conditions', 'Carry warm clothing', 'Inform someone of your route');
    }
    if (destination.toLowerCase().includes('beach')) {
        precautions.push('Follow lifeguard instructions', 'Use sun protection', 'Be aware of water conditions');
    }
    
    return precautions;
}

function generateBestTimeRecommendations(destination) {
    const destinationLower = destination.toLowerCase();
    
    if (destinationLower.includes('mumbai') || destinationLower.includes('goa')) {
        return 'October to March (pleasant weather, less rain)';
    } else if (destinationLower.includes('delhi') || destinationLower.includes('jaipur')) {
        return 'October to March (comfortable temperatures)';
    } else if (destinationLower.includes('kerala')) {
        return 'September to March (pleasant weather, less monsoon)';
    } else if (destinationLower.includes('himachal') || destinationLower.includes('manali')) {
        return 'March to June and September to November (pleasant weather)';
    } else {
        return 'October to March (generally pleasant weather across India)';
    }
}

// Placeholder functions for external API integration
async function searchPexelsImage(query) {
    console.log(`Searching for image: ${query}`);
    return `https://images.pexels.com/photos/placeholder/${encodeURIComponent(query)}.jpg`;
}

async function geocodeLocation(location) {
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
    
    return mockCoordinates[location] || { lat: 20.5937, lng: 78.9629 };
}

async function calculateDistance(from, to) {
    console.log(`Calculating distance from ${from} to ${to}`);
    return {
        distance: '500 km',
        duration: '8 hours',
        mode: 'car'
    };
}

// Export all functions
module.exports = {
    generateItinerary,
    searchPexelsImage,
    geocodeLocation,
    calculateDistance
};


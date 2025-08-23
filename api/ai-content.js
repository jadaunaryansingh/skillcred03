/**
 * AI Content Generation API
 * This handles complex content generation tasks to reduce frontend load
 */

const axios = require('axios');
const config = require('../config');

// AI-powered content generation functions
async function generatePopularPacks(destination, count = 6) {
    try {
        // Generate dynamic popular packs based on destination
        const packs = [];
        
        for (let i = 0; i < count; i++) {
            const pack = await generateSinglePack(destination, i);
            packs.push(pack);
        }
        
        return {
            success: true,
            packs: packs
        };
    } catch (error) {
        console.error('Error generating popular packs:', error);
        return {
            success: false,
            error: 'Failed to generate popular packs'
        };
    }
}

async function generateSinglePack(destination, index) {
    const packTypes = [
        'Heritage & Culture',
        'Adventure & Nature',
        'Food & Culinary',
        'Relaxation & Wellness',
        'Local Life & Traditions',
        'Photography & Art'
    ];
    
    const pack = {
        id: index + 1,
        destination: destination,
        title: `${packTypes[index]} Experience`,
        duration: Math.floor(Math.random() * 5) + 2,
        price: `₹${Math.floor(Math.random() * 20 + 10)}K`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        highlights: generateHighlights(packTypes[index]),
        description: generateDescription(packTypes[index], destination),
        image: generateImageUrl(packTypes[index], destination)
    };
    
    return pack;
}

function generateHighlights(packType) {
    const highlightsMap = {
        'Heritage & Culture': ['Historical Sites', 'Local Traditions', 'Cultural Shows'],
        'Adventure & Nature': ['Outdoor Activities', 'Natural Landscapes', 'Wildlife'],
        'Food & Culinary': ['Local Cuisine', 'Cooking Classes', 'Food Tours'],
        'Relaxation & Wellness': ['Spa Treatments', 'Yoga Sessions', 'Peaceful Retreats'],
        'Local Life & Traditions': ['Village Visits', 'Handicraft Workshops', 'Local Markets'],
        'Photography & Art': ['Scenic Spots', 'Art Galleries', 'Photography Tours']
    };
    
    return highlightsMap[packType] || ['Amazing Experiences', 'Local Culture', 'Unique Adventures'];
}

function generateDescription(packType, destination) {
    const descriptions = {
        'Heritage & Culture': `Immerse yourself in ${destination}'s rich cultural heritage with guided tours of historical sites and traditional experiences.`,
        'Adventure & Nature': `Explore the natural beauty of ${destination} with exciting outdoor activities and breathtaking landscapes.`,
        'Food & Culinary': `Discover the authentic flavors of ${destination} through local cuisine, cooking classes, and food tours.`,
        'Relaxation & Wellness': `Rejuvenate your mind and body in ${destination} with wellness activities and peaceful retreats.`,
        'Local Life & Traditions': `Experience the authentic local life of ${destination} through village visits and traditional workshops.`,
        'Photography & Art': `Capture the beauty of ${destination} through photography tours and visits to art galleries.`
    };
    
    return descriptions[packType] || `Experience the best of ${destination} with our curated travel package.`;
}

function generateImageUrl(packType, destination) {
    // Generate placeholder images based on pack type
    const imageMap = {
        'Heritage & Culture': 'https://images.pexels.com/photos/32386209/pexels-photo-32386209.jpeg',
        'Adventure & Nature': 'https://images.pexels.com/photos/3574440/pexels-photo-3574440.jpeg',
        'Food & Culinary': 'https://images.pexels.com/photos/6522114/pexels-photo-6522114.jpeg',
        'Relaxation & Wellness': 'https://images.pexels.com/photos/3574440/pexels-photo-3574440.jpeg',
        'Local Life & Traditions': 'https://images.pexels.com/photos/32386209/pexels-photo-32386209.jpeg',
        'Photography & Art': 'https://images.pexels.com/photos/6522114/pexels-photo-6522114.jpeg'
    };
    
    return imageMap[packType] || 'https://images.pexels.com/photos/placeholder/default.jpg';
}

// AI-powered review generation
async function generateAIReviews(count = 5) {
    try {
        const reviews = [];
        const names = ['Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'John', 'Maria'];
        const types = ['Solo Traveler', 'Family Traveler', 'Adventure Seeker', 'Culture Enthusiast', 'Food Lover'];
        
        for (let i = 0; i < count; i++) {
            const review = {
                id: i + 1,
                name: names[i % names.length],
                type: types[i % types.length],
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                text: generateReviewText(),
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            reviews.push(review);
        }
        
        return {
            success: true,
            reviews: reviews
        };
    } catch (error) {
        console.error('Error generating AI reviews:', error);
        return {
            success: false,
            error: 'Failed to generate reviews'
        };
    }
}

function generateReviewText() {
    const reviewTemplates = [
        "Trip Planner AI made my travel planning so much easier! The AI recommendations were spot-on and saved me hours of research.",
        "I love how personalized the itineraries are. The AI really understands my travel style and preferences.",
        "This app is a game-changer for travelers. The AI suggestions helped me discover places I never would have found on my own.",
        "The AI-powered planning is incredible. It created a perfect itinerary that matched exactly what I was looking for.",
        "Using AI for travel planning is the future! This app delivers exactly what it promises - intelligent, personalized travel experiences."
    ];
    
    return reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
}

// AI-powered destination suggestions
async function generateDestinationSuggestions(query, limit = 6) {
    try {
        const suggestions = [
            'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Varanasi', 'Kerala',
            'Paris', 'Tokyo', 'Dubai', 'New York', 'London', 'Singapore'
        ];
        
        const filtered = suggestions.filter(dest => 
            dest.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
            success: true,
            suggestions: filtered.slice(0, limit)
        };
    } catch (error) {
        console.error('Error generating destination suggestions:', error);
        return {
            success: false,
            error: 'Failed to generate suggestions'
        };
    }
}

module.exports = {
    generatePopularPacks,
    generateAIReviews,
    generateDestinationSuggestions
};

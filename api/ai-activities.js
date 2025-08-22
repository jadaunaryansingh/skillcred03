const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate activities using Google AI Studio
 * @param {string} destination - The travel destination
 * @param {Array} travelStyles - Array of travel style preferences
 * @param {string} prompt - Custom prompt for activity generation
 * @returns {Object} Generated activities with morning, afternoon, and evening activities
 */
async function generateActivitiesWithAI(destination, travelStyles, prompt) {
    try {
        console.log('🤖 Generating activities with Google AI Studio...');
        
        // Use gemini-1.5-flash model for better performance
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Construct a structured prompt for JSON output
        const fullPrompt = `${prompt}

        Please provide the response in this exact JSON format:
        {
            "morning": [
                "Detailed morning activity 1 with costs, locations, and travel info",
                "Detailed morning activity 2 with costs, locations, and travel info",
                "Detailed morning activity 3 with costs, locations, and travel info"
            ],
            "afternoon": [
                "Detailed afternoon activity 1 with costs, locations, and travel info",
                "Detailed afternoon activity 2 with costs, locations, and travel info",
                "Detailed afternoon activity 3 with costs, locations, and travel info"
            ],
            "evening": [
                "Detailed evening activity 1 with costs, locations, and travel info",
                "Detailed evening activity 2 with costs, locations, and travel info",
                "Detailed evening activity 3 with costs, locations, and travel info"
            ]
        }

        Ensure all activities are specific to ${destination} and match the travel styles: ${travelStyles.join(', ')}.`;

        // Generate content with timeout
        const result = await Promise.race([
            model.generateContent(fullPrompt),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            )
        ]);

        const response = await result.response;
        const text = response.text();
        
        console.log('✅ AI response received:', text.substring(0, 200) + '...');
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in AI response');
        }
        
        const activities = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (!activities.morning || !activities.afternoon || !activities.evening) {
            throw new Error('Invalid activities structure from AI');
        }
        
        console.log('🎯 Activities generated successfully');
        return activities;
        
    } catch (error) {
        console.error('❌ Error generating AI activities:', error.message);
        
        // Handle specific error types
        if (error.message.includes('model not found') || error.message.includes('not supported')) {
            throw new Error('AI model not available. Please try again later.');
        } else if (error.message.includes('timeout')) {
            throw new Error('Request timed out. Please try again.');
        } else if (error.message.includes('API key')) {
            throw new Error('AI service configuration error.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            throw new Error('Service temporarily unavailable due to high demand.');
        }
        
        throw new Error('Failed to generate AI activities. Please try again.');
    }
}

/**
 * Generate fallback activities when AI service fails
 * @param {string} destination - The travel destination
 * @param {Array} travelStyles - Array of travel style preferences
 * @returns {Object} Basic fallback activities
 */
function generateFallbackActivities(destination, travelStyles) {
    console.log('🔄 Using fallback activities for', destination);
    
    return {
        morning: [
            `Explore ${destination}'s main attractions and landmarks with guided tours`,
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

module.exports = {
    generateActivitiesWithAI,
    generateFallbackActivities
};

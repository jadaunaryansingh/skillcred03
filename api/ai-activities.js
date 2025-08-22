const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Google AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate destination activities using Google AI Studio
 * @param {string} destination - The destination city/country
 * @param {Array} travelStyles - Array of travel style preferences
 * @param {string} prompt - The detailed prompt for AI generation
 * @returns {Object} Structured activities for morning, afternoon, and evening
 */
async function generateActivitiesWithAI(destination, travelStyles, prompt) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Missing GEMINI_API_KEY environment variable');
        }

        // Use the most basic Gemini model for better travel content generation
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Create a structured prompt for consistent output
        const structuredPrompt = `
        ${prompt}
        
        IMPORTANT: Return ONLY a valid JSON object with this exact structure:
        {
            "morning": [
                "Activity 1 with location, cost, and practical details",
                "Activity 2 with location, cost, and practical details", 
                "Activity 3 with location, cost, and practical details"
            ],
            "afternoon": [
                "Activity 1 with location, cost, and practical details",
                "Activity 2 with location, cost, and practical details",
                "Activity 3 with location, cost, and practical details"
            ],
            "evening": [
                "Activity 1 with location, cost, and practical details",
                "Activity 2 with location, cost, and practical details",
                "Activity 3 with location, cost, and practical details"
            ]
        }
        
        Each activity should include:
        - Exact location/address
        - Current entry fees and costs
        - Transportation details and costs
        - Best visiting times
        - Cultural/historical context
        - Practical tips for visitors
        
        Do not include any text before or after the JSON. Only return the JSON object.
        `;

        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('AI request timeout')), 10000); // 10 second timeout
        });

        const aiPromise = model.generateContent(structuredPrompt);
        
        const result = await Promise.race([aiPromise, timeoutPromise]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI service');
        }

        const activities = JSON.parse(jsonMatch[0]);

        // Validate the response structure
        if (!activities.morning || !activities.afternoon || !activities.evening) {
            throw new Error('Invalid activities structure from AI service');
        }

        // Ensure each time period has exactly 3 activities
        if (activities.morning.length !== 3 || activities.afternoon.length !== 3 || activities.evening.length !== 3) {
            throw new Error('Each time period must have exactly 3 activities');
        }

        return activities;

    } catch (error) {
        console.error('Error in AI activities generation:', error);
        
        // If JSON parsing fails, provide a more helpful error
        if (error instanceof SyntaxError) {
            throw new Error('AI service returned invalid JSON format');
        }
        
        // If it's a model not found error, use fallback immediately
        if (error.message.includes('not found') || error.message.includes('not supported')) {
            console.log('AI model not available, using fallback activities');
            return generateFallbackActivities(destination, travelStyles);
        }
        
        // If it's a timeout error, use fallback
        if (error.message.includes('timeout')) {
            console.log('AI request timed out, using fallback activities');
            return generateFallbackActivities(destination, travelStyles);
        }
        
        // Re-throw the error for the main handler
        throw error;
    }
}

/**
 * Generate a fallback set of activities when AI service is unavailable
 * @param {string} destination - The destination city/country
 * @param {Array} travelStyles - Array of travel style preferences
 * @returns {Object} Basic fallback activities
 */
function generateFallbackActivities(destination, travelStyles) {
    const fallbackActivities = {
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

    return fallbackActivities;
}

module.exports = {
    generateActivitiesWithAI,
    generateFallbackActivities
};

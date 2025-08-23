const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In-memory user storage (replace with database in production)
const users = new Map();
const refreshTokens = new Map();

// JWT configuration
const config = require('../config');

const JWT_SECRET = config.JWT_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

/**
 * User registration
 * @param {Object} userData - User registration data
 * @returns {Object} Registration result
 */
async function registerUser(userData) {
    try {
        const { email, password, firstName, lastName, phone } = userData;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            throw new Error('All required fields must be provided');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        if (users.has(email)) {
            throw new Error('User already exists');
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = {
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || null,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            preferences: {
                travelStyle: 'culture',
                budget: 'mid',
                preferredDestinations: []
            },
            itineraries: []
        };

        users.set(email, user);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        return {
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                preferences: user.preferences
            },
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

/**
 * User login
 * @param {Object} credentials - Login credentials
 * @returns {Object} Login result
 */
async function loginUser(credentials) {
    try {
        const { email, password } = credentials;

        // Validation
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = users.get(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date().toISOString();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                preferences: user.preferences
            },
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Generate JWT tokens
 * @param {Object} user - User object
 * @returns {Object} Access and refresh tokens
 */
function generateTokens(user) {
    const payload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

    // Store refresh token
    refreshTokens.set(user.id, refreshToken);

    return { accessToken, refreshToken };
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New access token
 */
function refreshAccessToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = users.get(decoded.email);

        if (!user || refreshTokens.get(user.id) !== refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const { accessToken } = generateTokens(user);

        return {
            success: true,
            accessToken
        };

    } catch (error) {
        console.error('Token refresh error:', error);
        throw new Error('Invalid refresh token');
    }
}

/**
 * Verify access token
 * @param {string} token - Access token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - New preferences
 * @returns {Object} Update result
 */
function updateUserPreferences(userId, preferences) {
    try {
        const user = Array.from(users.values()).find(u => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.preferences = { ...user.preferences, ...preferences };

        return {
            success: true,
            message: 'Preferences updated successfully',
            preferences: user.preferences
        };

    } catch (error) {
        console.error('Preferences update error:', error);
        throw error;
    }
}

/**
 * Save user itinerary
 * @param {string} userId - User ID
 * @param {Object} itinerary - Itinerary data
 * @returns {Object} Save result
 */
function saveUserItinerary(userId, itinerary) {
    try {
        const user = Array.from(users.values()).find(u => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }

        const savedItinerary = {
            id: crypto.randomUUID(),
            ...itinerary,
            savedAt: new Date().toISOString()
        };

        user.itineraries.push(savedItinerary);

        return {
            success: true,
            message: 'Itinerary saved successfully',
            itinerary: savedItinerary
        };

    } catch (error) {
        console.error('Itinerary save error:', error);
        throw error;
    }
}

/**
 * Get user itineraries
 * @param {string} userId - User ID
 * @returns {Array} User itineraries
 */
function getUserItineraries(userId) {
    try {
        const user = Array.from(users.values()).find(u => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }

        return user.itineraries;

    } catch (error) {
        console.error('Get itineraries error:', error);
        throw error;
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    verifyToken,
    updateUserPreferences,
    saveUserItinerary,
    getUserItineraries
};

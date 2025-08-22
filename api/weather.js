const axios = require('axios');

// Weather API configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'your-openweather-api-key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a destination
 * @param {string} city - City name
 * @param {string} countryCode - Country code (optional)
 * @returns {Object} Current weather data
 */
async function getCurrentWeather(city, countryCode = '') {
    try {
        const location = countryCode ? `${city},${countryCode}` : city;
        const url = `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        return {
            success: true,
            location: {
                city: data.name,
                country: data.sys.country,
                coordinates: {
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }
            },
            current: {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                windDirection: data.wind.deg,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                visibility: data.visibility / 1000, // Convert m to km
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
            },
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Weather API error:', error.response?.data || error.message);
        
        if (error.response?.status === 404) {
            throw new Error('City not found');
        } else if (error.response?.status === 401) {
            throw new Error('Invalid API key');
        } else if (error.response?.status === 429) {
            throw new Error('API rate limit exceeded');
        } else {
            throw new Error('Failed to fetch weather data');
        }
    }
}

/**
 * Get 5-day weather forecast for a destination
 * @param {string} city - City name
 * @param {string} countryCode - Country code (optional)
 * @returns {Object} 5-day forecast data
 */
async function getWeatherForecast(city, countryCode = '') {
    try {
        const location = countryCode ? `${city},${countryCode}` : city;
        const url = `${WEATHER_BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        // Group forecast by day
        const dailyForecast = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    date: date,
                    minTemp: Infinity,
                    maxTemp: -Infinity,
                    humidity: [],
                    descriptions: new Set(),
                    icons: new Set()
                };
            }

            const temp = item.main.temp;
            dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, temp);
            dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, temp);
            dailyForecast[date].humidity.push(item.main.humidity);
            dailyForecast[date].descriptions.add(item.weather[0].description);
            dailyForecast[date].icons.add(item.weather[0].icon);
        });

        // Convert to array and format
        const forecast = Object.values(dailyForecast).map(day => ({
            date: day.date,
            minTemp: Math.round(day.minTemp),
            maxTemp: Math.round(day.maxTemp),
            avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            description: Array.from(day.descriptions)[0],
            icon: Array.from(day.icons)[0]
        }));

        return {
            success: true,
            location: {
                city: data.city.name,
                country: data.city.country,
                coordinates: {
                    lat: data.city.coord.lat,
                    lon: data.city.coord.lon
                }
            },
            forecast: forecast.slice(0, 5), // Return only 5 days
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Weather forecast API error:', error.response?.data || error.message);
        
        if (error.response?.status === 404) {
            throw new Error('City not found');
        } else if (error.response?.status === 401) {
            throw new Error('Invalid API key');
        } else if (error.response?.status === 429) {
            throw new Error('API rate limit exceeded');
        } else {
            throw new Error('Failed to fetch weather forecast');
        }
    }
}

/**
 * Get weather alerts for a destination
 * @param {string} city - City name
 * @param {string} countryCode - Country code (optional)
 * @returns {Object} Weather alerts data
 */
async function getWeatherAlerts(city, countryCode = '') {
    try {
        const location = countryCode ? `${city},${countryCode}` : city;
        const url = `${WEATHER_BASE_URL}/onecall?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&exclude=current,minutely,hourly,daily&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        return {
            success: true,
            location: {
                city: city,
                country: countryCode
            },
            alerts: data.alerts || [],
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Weather alerts API error:', error.response?.data || error.message);
        
        // Return empty alerts if API fails
        return {
            success: true,
            location: {
                city: city,
                country: countryCode
            },
            alerts: [],
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Get weather summary for travel planning
 * @param {string} city - City name
 * @param {string} countryCode - Country code (optional)
 * @returns {Object} Weather summary for travel
 */
async function getWeatherSummary(city, countryCode = '') {
    try {
        const [current, forecast, alerts] = await Promise.all([
            getCurrentWeather(city, countryCode),
            getWeatherForecast(city, countryCode),
            getWeatherAlerts(city, countryCode)
        ]);

        // Generate travel recommendations based on weather
        const recommendations = generateWeatherRecommendations(current, forecast);

        return {
            success: true,
            current: current.current,
            forecast: forecast.forecast,
            alerts: alerts.alerts,
            recommendations,
            location: current.location,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Weather summary error:', error);
        throw error;
    }
}

/**
 * Generate travel recommendations based on weather
 * @param {Object} current - Current weather data
 * @param {Object} forecast - Forecast data
 * @returns {Object} Weather-based recommendations
 */
function generateWeatherRecommendations(current, forecast) {
    const recommendations = {
        clothing: [],
        activities: [],
        precautions: [],
        bestTime: 'anytime'
    };

    const temp = current.temperature;
    const description = current.description.toLowerCase();

    // Clothing recommendations
    if (temp < 10) {
        recommendations.clothing.push('Warm jacket or coat', 'Thermal underwear', 'Gloves and scarf');
    } else if (temp < 20) {
        recommendations.clothing.push('Light jacket or sweater', 'Long pants', 'Comfortable walking shoes');
    } else if (temp < 30) {
        recommendations.clothing.push('Light clothing', 'Shorts or light pants', 'Sunscreen and hat');
    } else {
        recommendations.clothing.push('Very light clothing', 'Stay hydrated', 'Avoid peak sun hours');
    }

    // Activity recommendations
    if (description.includes('rain') || description.includes('storm')) {
        recommendations.activities.push('Indoor activities', 'Museums and galleries', 'Shopping malls');
        recommendations.precautions.push('Carry umbrella', 'Waterproof shoes', 'Check local transport');
    } else if (description.includes('sunny') || description.includes('clear')) {
        if (temp < 25) {
            recommendations.activities.push('Outdoor sightseeing', 'Walking tours', 'Parks and gardens');
        } else {
            recommendations.activities.push('Early morning or evening activities', 'Indoor attractions', 'Shaded areas');
        }
    } else if (description.includes('cloudy')) {
        recommendations.activities.push('Mixed indoor/outdoor activities', 'Flexible planning', 'Backup indoor options');
    }

    // Best time recommendations
    if (temp > 30) {
        recommendations.bestTime = 'early morning or evening';
    } else if (temp < 5) {
        recommendations.bestTime = 'midday when warmest';
    }

    return recommendations;
}

module.exports = {
    getCurrentWeather,
    getWeatherForecast,
    getWeatherAlerts,
    getWeatherSummary
};

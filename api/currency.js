const axios = require('axios');

// Currency API configuration
const CURRENCY_API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'your-exchange-rate-api-key';
const CURRENCY_BASE_URL = 'https://v6.exchangerate-api.com/v6';

// Fallback exchange rates (updated periodically)
const FALLBACK_RATES = {
    USD: {
        INR: 83.15,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.85,
        AUD: 1.52,
        CAD: 1.35,
        CHF: 0.88,
        CNY: 7.23
    },
    INR: {
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0095,
        JPY: 1.80,
        AUD: 0.018,
        CAD: 0.016,
        CHF: 0.011,
        CNY: 0.087
    },
    EUR: {
        USD: 1.09,
        INR: 90.38,
        GBP: 0.86,
        JPY: 162.88,
        AUD: 1.65,
        CAD: 1.47,
        CHF: 0.96,
        CNY: 7.86
    }
};

/**
 * Get real-time exchange rates
 * @param {string} baseCurrency - Base currency code (e.g., 'USD')
 * @returns {Object} Exchange rates data
 */
async function getExchangeRates(baseCurrency = 'USD') {
    try {
        if (CURRENCY_API_KEY === 'your-exchange-rate-api-key') {
            // Use fallback rates if no API key
            return getFallbackRates(baseCurrency);
        }

        const url = `${CURRENCY_BASE_URL}/${CURRENCY_API_KEY}/latest/${baseCurrency}`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.result !== 'success') {
            throw new Error('Failed to fetch exchange rates');
        }

        return {
            success: true,
            baseCurrency: data.base_code,
            lastUpdated: data.time_last_update_utc,
            rates: data.conversion_rates,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Currency API error:', error.response?.data || error.message);
        
        // Fallback to static rates
        console.log('Using fallback exchange rates');
        return getFallbackRates(baseCurrency);
    }
}

/**
 * Get fallback exchange rates
 * @param {string} baseCurrency - Base currency code
 * @returns {Object} Fallback exchange rates
 */
function getFallbackRates(baseCurrency) {
    const rates = FALLBACK_RATES[baseCurrency] || FALLBACK_RATES.USD;
    
    return {
        success: true,
        baseCurrency: baseCurrency,
        lastUpdated: 'Fallback rates (updated periodically)',
        rates: rates,
        timestamp: new Date().toISOString(),
        note: 'Using fallback rates - consider adding API key for real-time data'
    };
}

/**
 * Convert currency amount
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Object} Conversion result
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        if (fromCurrency === toCurrency) {
            return {
                success: true,
                originalAmount: amount,
                convertedAmount: amount,
                fromCurrency,
                toCurrency,
                exchangeRate: 1,
                timestamp: new Date().toISOString()
            };
        }

        const rates = await getExchangeRates(fromCurrency);
        
        if (!rates.success) {
            throw new Error('Failed to get exchange rates');
        }

        const exchangeRate = rates.rates[toCurrency];
        if (!exchangeRate) {
            throw new Error(`Exchange rate not available for ${toCurrency}`);
        }

        const convertedAmount = amount * exchangeRate;

        return {
            success: true,
            originalAmount: amount,
            convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
            fromCurrency,
            toCurrency,
            exchangeRate,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Currency conversion error:', error);
        throw error;
    }
}

/**
 * Get popular currency pairs for travel
 * @returns {Object} Popular currency pairs
 */
function getPopularCurrencies() {
    return {
        success: true,
        currencies: [
            { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
            { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
            { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
            { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
            { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
            { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
            { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
            { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
            { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
            { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' }
        ],
        timestamp: new Date().toISOString()
    };
}

/**
 * Get currency information for a specific country
 * @param {string} countryCode - Country code (e.g., 'IN', 'US')
 * @returns {Object} Country currency information
 */
function getCountryCurrency(countryCode) {
    const countryCurrencies = {
        'IN': { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        'US': { code: 'USD', name: 'US Dollar', symbol: '$' },
        'GB': { code: 'GBP', name: 'British Pound', symbol: '£' },
        'DE': { code: 'EUR', name: 'Euro', symbol: '€' },
        'FR': { code: 'EUR', name: 'Euro', symbol: '€' },
        'IT': { code: 'EUR', name: 'Euro', symbol: '€' },
        'ES': { code: 'EUR', name: 'Euro', symbol: '€' },
        'JP': { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        'AU': { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        'CA': { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        'CH': { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
        'CN': { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        'SG': { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
        'AE': { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
        'TH': { code: 'THB', name: 'Thai Baht', symbol: '฿' },
        'MY': { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
        'ID': { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
        'PH': { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
        'VN': { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
        'KR': { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
    };

    const currency = countryCurrencies[countryCode];
    if (!currency) {
        return {
            success: false,
            error: 'Currency not found for this country'
        };
    }

    return {
        success: true,
        countryCode,
        currency,
        timestamp: new Date().toISOString()
    };
}

/**
 * Calculate travel budget in multiple currencies
 * @param {number} amount - Base amount
 * @param {string} baseCurrency - Base currency
 * @param {Array} targetCurrencies - Array of target currency codes
 * @returns {Object} Multi-currency budget breakdown
 */
async function calculateMultiCurrencyBudget(amount, baseCurrency, targetCurrencies) {
    try {
        const results = {};
        
        for (const targetCurrency of targetCurrencies) {
            try {
                const conversion = await convertCurrency(amount, baseCurrency, targetCurrency);
                results[targetCurrency] = conversion;
            } catch (error) {
                results[targetCurrency] = {
                    success: false,
                    error: error.message
                };
            }
        }

        return {
            success: true,
            baseAmount: amount,
            baseCurrency,
            conversions: results,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Multi-currency budget calculation error:', error);
        throw error;
    }
}

module.exports = {
    getExchangeRates,
    convertCurrency,
    getPopularCurrencies,
    getCountryCurrency,
    calculateMultiCurrencyBudget
};

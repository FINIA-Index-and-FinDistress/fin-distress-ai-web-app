// services/worldBankAPI.js
/**
 * World Bank API service for fetching macroeconomic indicators
 */

const WORLD_BANK_BASE_URL = 'https://api.worldbank.org/v2';


class WorldBankAPIService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    /**
     * Mapping of the form fields to World Bank indicators
     */
    static INDICATOR_MAPPINGS = {
        'GDP': 'NY.GDP.MKTP.KD.ZG',           // GDP growth (annual %)
        'Credit': 'FS.AST.PRVT.GD.ZS',       // Domestic credit to private sector (% of GDP)
        'MarketCap': 'CM.MKT.LCAP.GD.ZS',    // Market capitalization (% of GDP)
        'WUI': 'SL.UEM.TOTL.ZS',             // Unemployment rate (World Uncertainty Index proxy)
        'GPR': 'MS.MIL.XPND.GD.ZS',         // Military expenditure (Geopolitical Risk proxy)
        'PRIME': 'FR.INR.RINR',              // Real interest rate (%)
        'WSI': 'NE.TRD.GNFS.ZS'              // Trade (% of GDP) - World Supply Index proxy
    };

    /**
     * Country code mappings for your application
     */
    static COUNTRY_CODE_MAPPINGS = {
        // African countries
        'Angola': 'AGO', 'Bangladesh': 'BGD', 'Benin': 'BEN', 'Botswana': 'BWA',
        'Burkina Faso': 'BFA', 'Burundi': 'BDI', 'Cameroon': 'CMR', 'Central African Republic': 'CAF',
        'Chad': 'TCD', 'Congo': 'COG', "Cote d'Ivoire": 'CIV', 'DRC': 'COD',
        'Djibouti': 'DJI', 'Egypt': 'EGY', 'Equatorial Guinea': 'GNQ', 'Eswatini': 'SWZ',
        'Ethiopia': 'ETH', 'Gabon': 'GAB', 'Gambia': 'GMB', 'Ghana': 'GHA',
        'Guinea': 'GIN', 'Guineabissau': 'GNB', 'Kenya': 'KEN', 'Lebanon': 'LBN',
        'Lesotho': 'LSO', 'Liberia': 'LBR', 'Madagascar': 'MDG', 'Malawi': 'MWI',
        'Mali': 'MLI', 'Mauritania': 'MRT', 'Mauritius': 'MUS', 'Morocco': 'MAR',
        'Mozambique': 'MOZ', 'Namibia': 'NAM', 'Niger': 'NER', 'Nigeria': 'NGA',
        'Rwanda': 'RWA', 'Senegal': 'SEN', 'Seychelles': 'SYC', 'Sierra Leone': 'SLE',
        'South Sudan': 'SSD', 'Southafrica': 'ZAF', 'Sudan': 'SDN', 'Tanzania': 'TZA',
        'Tunisia': 'TUN', 'Uganda': 'UGA', 'Zambia': 'ZMB', 'Zimbabwe': 'ZWE',

        // Rest of World countries 
        'Afghanistan': 'AFG', 'Albania': 'ALB', 'Argentina': 'ARG', 'Armenia': 'ARM',
        'Austria': 'AUT', 'Azerbaijan': 'AZE', 'Bahrain': 'BHR', 'Belarus': 'BLR',
        'Belgium': 'BEL', 'Belize': 'BLZ', 'Bhutan': 'BTN', 'Bolivia': 'BOL',
        'Bosnia and Herzegovina': 'BIH', 'Brazil': 'BRA', 'Bulgaria': 'BGR', 'Cambodia': 'KHM',
        'Canada': 'CAN', 'Chile': 'CHL', 'China': 'CHN', 'Colombia': 'COL',
        'Costa Rica': 'CRI', 'Croatia': 'HRV', 'Cyprus': 'CYP', 'Czechia': 'CZE',
        'Denmark': 'DNK', 'Dominican Republic': 'DOM', 'Ecuador': 'ECU', 'El Salvador': 'SLV',
        'Estonia': 'EST', 'Fiji': 'FJI', 'Finland': 'FIN', 'France': 'FRA',
        'Georgia': 'GEO', 'Germany': 'DEU', 'Greece': 'GRC', 'Guatemala': 'GTM',
        'Guyana': 'GUY', 'Honduras': 'HND', 'Hong Kong SAR China': 'HKG', 'Hungary': 'HUN',
        'Iceland': 'ISL', 'India': 'IND', 'Indonesia': 'IDN', 'Iraq': 'IRQ',
        'Ireland': 'IRL', 'Israel': 'ISR', 'Italy': 'ITA', 'Jamaica': 'JAM',
        'Jordan': 'JOR', 'Kazakhstan': 'KAZ', 'Korea Republic': 'KOR', 'Kosovo': 'XKX',
        'Kyrgyz Republic': 'KGZ', 'Lao PDR': 'LAO', 'Latvia': 'LVA', 'Lithuania': 'LTU',
        'Luxembourg': 'LUX', 'Malaysia': 'MYS', 'Malta': 'MLT', 'Mexico': 'MEX',
        'Moldova': 'MDA', 'Mongolia': 'MNG', 'Montenegro': 'MNE', 'Myanmar': 'MMR',
        'Nepal': 'NPL', 'Netherlands': 'NLD', 'New Zealand': 'NZL', 'Nicaragua': 'NIC',
        'North Macedonia': 'MKD', 'Pakistan': 'PAK', 'Panama': 'PAN', 'Papua New Guinea': 'PNG',
        'Paraguay': 'PRY', 'Peru': 'PER', 'Philippines': 'PHL', 'Poland': 'POL',
        'Portugal': 'PRT', 'Romania': 'ROU', 'Russia': 'RUS', 'Saudi Arabia': 'SAU',
        'Serbia': 'SRB', 'Singapore': 'SGP', 'Slovak Republic': 'SVK', 'Slovenia': 'SVN',
        'Spain': 'ESP', 'SriLanka': 'LKA', 'Sweden': 'SWE', 'Taiwan China': 'TWN',
        'Tajikistan': 'TJK', 'Thailand': 'THA', 'Timor-Leste': 'TLS', 'Trinidad and Tobago': 'TTO',
        'Turkiye': 'TUR', 'Turkmenistan': 'TKM', 'Ukraine': 'UKR', 'United Kingdom': 'GBR',
        'United States': 'USA', 'Uruguay': 'URY', 'Uzbekistan': 'UZB', 'Venezuela': 'VEN',
        'Viet Nam': 'VNM', 'West Bank And Gaza': 'PSE', 'Yemen': 'YEM'
    };

    /**
     * Get cache key for data
     */
    getCacheKey(country, indicator, year) {
        return `${country}_${indicator}_${year}`;
    }

    /**
     * Check if cached data is valid
     */
    isCacheValid(cacheEntry) {
        return cacheEntry && (Date.now() - cacheEntry.timestamp < this.cacheExpiry);
    }

    /**
     * Fetch single indicator from World Bank API
     */
    async fetchIndicator(countryCode, indicator, year = null) {
        try {
            // Use most recent year if not specified
            const targetYear = year || new Date().getFullYear() - 1;
            const cacheKey = this.getCacheKey(countryCode, indicator, targetYear);

            // Check cache first
            const cached = this.cache.get(cacheKey);
            if (this.isCacheValid(cached)) {
                console.log(`Using cached data for ${indicator} in ${countryCode}`);
                return cached.data;
            }

            console.log(`Fetching ${indicator} for ${countryCode} from World Bank API...`);

            // Fetch from World Bank API
            const response = await axios.get(
                `${WORLD_BANK_BASE_URL}/country/${countryCode}/indicator/${indicator}`,
                {
                    params: {
                        format: 'json',
                        date: `${targetYear - 2}:${targetYear}`, // Get last 3 years of data
                        per_page: 10
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            if (!response.data || response.data.length < 2) {
                throw new Error(`No data returned from World Bank API for ${indicator}`);
            }

            const data = response.data[1]; // World Bank returns metadata in [0], data in [1]

            if (!data || data.length === 0) {
                throw new Error(`No indicator data found for ${indicator} in ${countryCode}`);
            }

            // Find the most recent non-null value
            const validData = data
                .filter(item => item.value !== null)
                .sort((a, b) => b.date - a.date);

            if (validData.length === 0) {
                throw new Error(`No valid data found for ${indicator} in ${countryCode}`);
            }

            const result = {
                value: validData[0].value,
                year: validData[0].date,
                indicator: indicator,
                country: countryCode
            };

            // Cache the result
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;

        } catch (error) {
            console.error(`Error fetching ${indicator} for ${countryCode}:`, error.message);
            throw new Error(`Failed to fetch ${indicator}: ${error.message}`);
        }
    }

    /**
     * Fetch all macroeconomic indicators for a country
     */
    async fetchMacroIndicators(countryName, year = null) {
        try {
            const countryCode = WorldBankAPIService.COUNTRY_CODE_MAPPINGS[countryName];

            if (!countryCode) {
                throw new Error(`Country code not found for: ${countryName}`);
            }

            console.log(`Fetching macro indicators for ${countryName} (${countryCode})...`);

            const indicators = WorldBankAPIService.INDICATOR_MAPPINGS;
            const results = {};
            const errors = {};

            // Fetch all indicators in parallel with individual error handling
            const fetchPromises = Object.entries(indicators).map(async ([fieldName, indicatorCode]) => {
                try {
                    const data = await this.fetchIndicator(countryCode, indicatorCode, year);
                    results[fieldName] = {
                        value: data.value,
                        year: data.year,
                        source: 'World Bank',
                        indicator: indicatorCode
                    };
                } catch (error) {
                    console.warn(`Failed to fetch ${fieldName}:`, error.message);
                    errors[fieldName] = error.message;
                    // Set fallback values for missing data
                    results[fieldName] = this.getFallbackValue(fieldName);
                }
            });

            await Promise.allSettled(fetchPromises);

            return {
                success: true,
                data: results,
                errors: Object.keys(errors).length > 0 ? errors : null,
                country: countryName,
                countryCode: countryCode,
                fetchedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error fetching macro indicators:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackData()
            };
        }
    }

    /**
     * Get fallback values for when API data is unavailable
     */
    getFallbackValue(fieldName) {
        const fallbacks = {
            'GDP': { value: 3.5, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'Credit': { value: 45.0, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'MarketCap': { value: 50.0, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'WUI': { value: 0.3, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'GPR': { value: 0.2, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'PRIME': { value: 5.0, source: 'Default estimate', year: new Date().getFullYear() - 1 },
            'WSI': { value: 60.0, source: 'Default estimate', year: new Date().getFullYear() - 1 }
        };

        return fallbacks[fieldName] || { value: 0, source: 'Default', year: new Date().getFullYear() - 1 };
    }

    /**
     * Get complete fallback data set
     */
    getFallbackData() {
        const fallbacks = {};
        Object.keys(WorldBankAPIService.INDICATOR_MAPPINGS).forEach(fieldName => {
            fallbacks[fieldName] = this.getFallbackValue(fieldName);
        });
        return fallbacks;
    }

    /**
     * Clear cache 
     */
    clearCache() {
        this.cache.clear();
        console.log('World Bank API cache cleared');
    }
}

export default new WorldBankAPIService();
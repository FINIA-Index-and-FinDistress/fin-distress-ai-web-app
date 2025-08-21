// src/hooks/useWorldBankData.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for fetching World Bank macroeconomic data
 * Follows the same pattern as your usePredictionData hook
 */
const useWorldBankData = (country = null) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // Refs to prevent memory leaks (following your pattern)
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(null);

    // World Bank API configuration
    const WORLD_BANK_BASE_URL = 'https://api.worldbank.org/v2';
    const REQUEST_TIMEOUT = 15000; // 15 seconds
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // Cache for API responses
    const cache = useRef(new Map());

    /**
     * Mapping of your form fields to World Bank indicators
     */
    const INDICATOR_MAPPINGS = {
        'GDP': 'NY.GDP.MKTP.KD.ZG',           // GDP growth (annual %)
        'Credit': 'FS.AST.PRVT.GD.ZS',       // Domestic credit to private sector (% of GDP)
        'MarketCap': 'CM.MKT.LCAP.GD.ZS',    // Market capitalization (% of GDP)
        'WUI': 'SL.UEM.TOTL.ZS',             // Unemployment rate (World Uncertainty Index proxy)
        'GPR': 'MS.MIL.XPND.GD.ZS',         // Military expenditure (Geopolitical Risk proxy)
        'PRIME': 'FR.INR.RINR',              // Real interest rate (%)
        'WSI': 'NE.TRD.GNFS.ZS'              // Trade (% of GDP) - World Supply Index proxy
    };

    /**
     * Country code mappings (matching your COUNTRY_OPTIONS)
     */
    const COUNTRY_CODE_MAPPINGS = {
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
     * Get cache key for API responses
     */
    const getCacheKey = useCallback((countryCode, indicator, year) => {
        return `${countryCode}_${indicator}_${year}`;
    }, []);

    /**
     * Check if cached data is valid
     */
    const isCacheValid = useCallback((cacheEntry) => {
        return cacheEntry && (Date.now() - cacheEntry.timestamp < CACHE_DURATION);
    }, []);

    /**
     * Fetch single indicator from World Bank API
     */
    const fetchIndicator = useCallback(async (countryCode, indicator, year = null) => {
        const targetYear = year || new Date().getFullYear() - 1;
        const cacheKey = getCacheKey(countryCode, indicator, targetYear);

        // Check cache first
        const cached = cache.current.get(cacheKey);
        if (isCacheValid(cached)) {
            console.log(`Using cached data for ${indicator} in ${countryCode}`);
            return cached.data;
        }

        // Cancel previous request if needed
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const timeoutId = setTimeout(() => abortControllerRef.current.abort(), REQUEST_TIMEOUT);

        try {
            console.log(`Fetching ${indicator} for ${countryCode} from World Bank API...`);

            const url = `${WORLD_BANK_BASE_URL}/country/${countryCode}/indicator/${indicator}`;
            const params = new URLSearchParams({
                format: 'json',
                date: `${targetYear - 2}:${targetYear}`, // Get last 3 years of data
                per_page: '10'
            });

            const response = await fetch(`${url}?${params}`, {
                signal: abortControllerRef.current.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result || result.length < 2) {
                throw new Error(`No data returned from World Bank API for ${indicator}`);
            }

            const data = result[1]; // World Bank returns metadata in [0], data in [1]

            if (!data || data.length === 0) {
                throw new Error(`No indicator data found for ${indicator} in ${countryCode}`);
            }

            // Find the most recent non-null value
            const validData = data
                .filter(item => item.value !== null && item.value !== undefined)
                .sort((a, b) => parseInt(b.date) - parseInt(a.date));

            if (validData.length === 0) {
                throw new Error(`No valid data found for ${indicator} in ${countryCode}`);
            }

            const finalResult = {
                value: validData[0].value,
                year: parseInt(validData[0].date),
                indicator: indicator,
                country: countryCode,
                raw: validData[0]
            };

            // Cache the result
            cache.current.set(cacheKey, {
                data: finalResult,
                timestamp: Date.now()
            });

            return finalResult;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - World Bank API is slow to respond');
            }

            console.error(`Error fetching ${indicator} for ${countryCode}:`, error.message);
            throw new Error(`Failed to fetch ${indicator}: ${error.message}`);
        }
    }, [getCacheKey, isCacheValid]);

    /**
     * Get fallback values for when API data is unavailable
     */
    const getFallbackValues = useCallback(() => {
        return {
            'GDP': 3.5,      // Default GDP growth estimate
            'Credit': 45.0,  // Default credit to private sector
            'MarketCap': 50.0, // Default market cap estimate
            'WUI': 8.5,      // Default unemployment rate
            'GPR': 1.5,      // Default military expenditure
            'PRIME': 5.0,    // Default real interest rate
            'WSI': 60.0      // Default trade percentage
        };
    }, []);

    /**
     * Process and normalize indicator values for your model
     */
    const processIndicatorValue = useCallback((fieldName, rawValue) => {
        if (rawValue === null || rawValue === undefined) {
            return getFallbackValues()[fieldName] || 0;
        }

        let value = Number(rawValue);

        // Handle different value ranges and convert to expected format
        switch (fieldName) {
            case 'GDP':
                // GDP growth can be negative and is already in percentage
                return value;

            case 'Credit':
            case 'MarketCap':
            case 'WSI':
                // These are percentages of GDP
                return Math.max(0, Math.min(200, value));

            case 'WUI':
                // Unemployment rate, should be 0-50%
                return Math.max(0, Math.min(50, value));

            case 'GPR':
                // Military expenditure, typically 0-10% of GDP
                return Math.max(0, Math.min(10, value));

            case 'PRIME':
                // Interest rates can be negative in some economies
                return Math.max(-5, Math.min(50, value));

            default:
                return value;
        }
    }, [getFallbackValues]);

    /**
     * Main function to fetch all macro indicators for a country
     */
    const fetchMacroData = useCallback(async (targetCountry = country, forceRefresh = false) => {
        if (!targetCountry) {
            setError('No country specified');
            return null;
        }

        const countryCode = COUNTRY_CODE_MAPPINGS[targetCountry];
        if (!countryCode) {
            setError(`Country code not found for: ${targetCountry}`);
            return null;
        }

        // Don't fetch if we have recent data and not forcing refresh
        if (!forceRefresh && data && lastFetch && Date.now() - lastFetch < 300000) { // 5 minutes
            console.log(`Using cached macro data for ${targetCountry}`);
            return data;
        }

        if (isLoading && !forceRefresh) {
            console.log('Already loading macro data, skipping duplicate request');
            return data;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log(`Fetching macro indicators for ${targetCountry} (${countryCode})...`);

            const results = {};
            const errors = {};
            const fetchPromises = [];

            // Fetch all indicators in parallel
            Object.entries(INDICATOR_MAPPINGS).forEach(([fieldName, indicatorCode]) => {
                const promise = fetchIndicator(countryCode, indicatorCode)
                    .then(result => {
                        if (isMountedRef.current) {
                            const processedValue = processIndicatorValue(fieldName, result.value);
                            results[fieldName] = {
                                value: processedValue,
                                year: result.year,
                                source: 'World Bank',
                                indicator: indicatorCode,
                                original_value: result.value,
                                country: targetCountry,
                                country_code: countryCode
                            };
                        }
                    })
                    .catch(error => {
                        console.warn(`Failed to fetch ${fieldName}:`, error.message);
                        errors[fieldName] = error.message;

                        // Set fallback value
                        if (isMountedRef.current) {
                            const fallbackValue = getFallbackValues()[fieldName] || 0;
                            results[fieldName] = {
                                value: fallbackValue,
                                year: new Date().getFullYear() - 1,
                                source: 'Default estimate',
                                indicator: indicatorCode,
                                original_value: fallbackValue,
                                country: targetCountry,
                                country_code: countryCode,
                                is_fallback: true
                            };
                        }
                    });

                fetchPromises.push(promise);
            });

            await Promise.allSettled(fetchPromises);

            if (!isMountedRef.current) return null;

            const processedData = {
                success: true,
                country: targetCountry,
                countryCode: countryCode,
                data: results,
                errors: Object.keys(errors).length > 0 ? errors : null,
                fetchedAt: new Date().toISOString(),
                hasErrors: Object.keys(errors).length > 0,
                dataQuality: Object.keys(errors).length === 0 ? 'Complete' : 'Partial'
            };

            setData(processedData);
            setLastFetch(Date.now());

            if (Object.keys(errors).length > 0) {
                setError(`Some indicators failed: ${Object.keys(errors).join(', ')}`);
            } else {
                setError(null);
            }

            console.log(`Macro data fetched successfully for ${targetCountry}:`, processedData);
            return processedData;

        } catch (error) {
            if (!isMountedRef.current) return null;

            console.error('Error fetching macro data:', error);
            setError(error.message);

            // Set fallback data
            const fallbackData = {
                success: false,
                country: targetCountry,
                countryCode: countryCode,
                data: {},
                error: error.message,
                fetchedAt: new Date().toISOString(),
                hasErrors: true,
                dataQuality: 'Failed'
            };

            // Add fallback values
            Object.keys(INDICATOR_MAPPINGS).forEach(fieldName => {
                const fallbackValue = getFallbackValues()[fieldName] || 0;
                fallbackData.data[fieldName] = {
                    value: fallbackValue,
                    year: new Date().getFullYear() - 1,
                    source: 'Default estimate',
                    is_fallback: true,
                    country: targetCountry
                };
            });

            setData(fallbackData);
            return fallbackData;

        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [country, data, lastFetch, isLoading, fetchIndicator, processIndicatorValue, getFallbackValues]);

    /**
     * Get form data formatted for your prediction form
     */
    const getFormData = useCallback(() => {
        if (!data || !data.data) return {};

        const formFields = {};
        Object.entries(data.data).forEach(([fieldName, fieldData]) => {
            formFields[fieldName] = fieldData.value;
        });

        return formFields;
    }, [data]);

    /**
     * Refresh data (clear cache and refetch)
     */
    const refreshData = useCallback(async () => {
        console.log('Refreshing macro data (clearing cache)');
        cache.current.clear();
        return await fetchMacroData(country, true);
    }, [country, fetchMacroData]);

    /**
     * Clear current data
     */
    const clearData = useCallback(() => {
        setData(null);
        setError(null);
        setLastFetch(null);
    }, []);

    // Auto-fetch when country changes
    useEffect(() => {
        if (country && COUNTRY_CODE_MAPPINGS[country]) {
            // Add a small delay to debounce rapid country changes
            const timer = setTimeout(() => {
                fetchMacroData(country);
            }, 500);

            return () => clearTimeout(timer);
        } else if (country && !COUNTRY_CODE_MAPPINGS[country]) {
            setError(`Unsupported country: ${country}`);
        }
    }, [country, fetchMacroData]);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            console.log('World Bank hook unmounting - cleaning up');
            isMountedRef.current = false;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Computed values
    const hasData = data && data.data && Object.keys(data.data).length > 0;
    const dataQuality = data?.dataQuality || 'Unknown';
    const isSupported = country ? !!COUNTRY_CODE_MAPPINGS[country] : false;

    return {
        // Data
        data,
        formData: getFormData(),

        // State
        isLoading,
        error,
        hasData,
        dataQuality,
        lastFetch,
        isSupported,

        // Methods
        fetchMacroData,
        refreshData,
        clearData,

        // Utils
        getSupportedCountries: () => Object.keys(COUNTRY_CODE_MAPPINGS),
        getIndicatorMappings: () => INDICATOR_MAPPINGS
    };
};

export default useWorldBankData;
// API Configuration for FinDistress AI
const API_CONFIG = {
    // Use environment variable with fallback
    BASE_URL: import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1',

    // Request timeout in milliseconds
    TIMEOUT: 30000,

    // Default headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    // API endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '/login',
        REGISTER: '/register',
        TOKEN: '/token',

        // User management
        USER_PROFILE: '/users/me',
        USER_PREFERENCES: '/users/me/preferences',

        // Predictions
        PREDICT: '/predictions/predict',
        PREDICTION_HISTORY: '/predictions/history',
        PREDICTION_DETAIL: '/predictions',

        // Analytics and Insights
        DASHBOARD: '/dashboard',
        ANALYTICS: '/analytics',
        INSIGHTS: '/insights/fast',

        // System
        HEALTH: '/health',
    }
};

// Helper function to build full URL
export const buildUrl = (endpoint, params = {}) => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Add query parameters if provided
    if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    return url;
};

// Helper function to get auth headers
export const getAuthHeaders = (token = null) => {
    const headers = { ...API_CONFIG.DEFAULT_HEADERS };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// API client with error handling
export const apiRequest = async (endpoint, options = {}) => {
    const {
        method = 'GET',
        data = null,
        token = null,
        params = {},
        timeout = API_CONFIG.TIMEOUT,
        ...otherOptions
    } = options;

    const url = buildUrl(endpoint, params);
    const headers = getAuthHeaders(token);

    const config = {
        method,
        headers,
        ...otherOptions,
    };

    // Add body for POST/PUT requests
    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        config.body = JSON.stringify(data);
    }

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        config.signal = controller.signal;

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            throw new Error(
                typeof responseData === 'object' && responseData.detail
                    ? responseData.detail
                    : responseData || `HTTP ${response.status}: ${response.statusText}`
            );
        }

        return responseData;

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection');
        }

        if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }

        throw error;
    }
};

export default API_CONFIG;
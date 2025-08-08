import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const PredictionContext = createContext();

export const usePrediction = () => {
    const context = useContext(PredictionContext);
    if (!context) {
        throw new Error('usePrediction must be used within a PredictionProvider');
    }
    return context;
};

export const PredictionProvider = ({ children }) => {
    const [predictions, setPredictions] = useState([]);
    const [currentPrediction, setCurrentPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { authState } = useAuth();
    const { addNotification } = useNotifications();

    // API base URL with fallback
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

    /**
     * Get auth headers
     */
    const getAuthHeaders = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (authState.token) {
            headers.Authorization = `Bearer ${authState.token}`;
        }
        return headers;
    }, [authState.token]);

    /**
     * Enhanced API call wrapper with better error handling and retry logic
     */
    const apiCall = useCallback(async (endpoint, options = {}, retries = 1) => {
        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

                const config = {
                    // headers: getAuthHeaders(),
                    ...options,
                    headers: {
                        ...getAuthHeaders(),
                        ...options.headers
                    }
                };

                console.log(`API call attempt ${attempt + 1} to: ${url}`);

                const response = await fetch(url, config);

                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.detail || errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = response.statusText || errorMessage;
                    }

                    // Don't retry on authentication errors
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(errorMessage);
                    }

                    // Retry on server errors
                    if (response.status >= 500 && attempt < retries) {
                        console.log(`Server error, retrying... (attempt ${attempt + 1}/${retries + 1})`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                        continue;
                    }

                    throw new Error(errorMessage);
                }

                const data = await response.json();
                console.log(`API call successful:`, data);
                return data;

            } catch (error) {
                lastError = error;
                console.error(`API call failed for ${endpoint} (attempt ${attempt + 1}):`, error);

                // Don't retry on client errors
                if (error.message.includes('401') || error.message.includes('403') ||
                    error.message.includes('422') || error.message.includes('400')) {
                    break;
                }

                // Don't retry on network errors that won't recover quickly
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    break;
                }

                if (attempt < retries) {
                    console.log(`Retrying in ${(attempt + 1) * 1000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }

        // Enhanced error messages
        if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else if (lastError.message.includes('401')) {
            throw new Error('Token has expired');
        } else if (lastError.message.includes('403')) {
            throw new Error('Access denied. You may not have permission for this action.');
        } else if (lastError.message.includes('404')) {
            throw new Error('Service not found. The server may be experiencing issues.');
        } else if (lastError.message.includes('500')) {
            throw new Error('Server error. Please try again later.');
        }

        throw lastError;
    }, [API_BASE, getAuthHeaders]);

    /**
     * Generate prediction with enhanced error handling
     */
    const generatePrediction = useCallback(async (inputData, region = 'AFR') => {
        if (!authState.isAuthenticated) {
            throw new Error('Authentication required to generate predictions');
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('Generating prediction with data:', inputData);

            // Determine region based on country
            let predictionRegion = region;
            if (inputData.country2) {
                const africanCountries = ['Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Egypt'];
                predictionRegion = africanCountries.includes(inputData.country2) ? 'AFR' : 'ROW';
            }

            const predictionData = await apiCall('/predictions/predict', {
                method: 'POST',
                body: JSON.stringify({
                    input_data: inputData,
                    region: predictionRegion
                })
            }, 2); // Retry twice for predictions

            console.log('Prediction generated successfully:', predictionData);

            // Transform backend data to frontend format
            const transformedPrediction = {
                id: Date.now(),
                financial_distress_probability: predictionData.financial_distress_probability || 0,
                model_confidence: predictionData.model_confidence || 0,
                risk_category: predictionData.risk_category || 'Unknown',
                riskCategory: predictionData.risk_category || 'Unknown',
                analysis_message: predictionData.analysis_message || 'No analysis available',
                created_at: predictionData.created_at || new Date().toISOString(),
                input_data: inputData,
                key_influencing_factors: Array.isArray(predictionData.key_influencing_factors)
                    ? predictionData.key_influencing_factors
                    : [],

                // Frontend-specific fields
                isDistressed: (predictionData.financial_distress_probability || 0) > 0.5,
                probability: predictionData.financial_distress_probability || 0,
                confidence: predictionData.model_confidence || 0,
                riskLevel: predictionData.risk_category || 'Unknown',
                message: predictionData.analysis_message || 'No analysis available',
                timestamp: predictionData.created_at || new Date().toISOString(),
                keyFactors: (predictionData.key_influencing_factors || []).map(factor => ({
                    factor: factor.name || 'Unknown Factor',
                    impact: factor.impact_level || 'Unknown',
                    value: factor.weight || 0
                })),
                recommendations: Array.isArray(predictionData.recommendations)
                    ? predictionData.recommendations
                    : [
                        'Monitor financial indicators regularly',
                        'Maintain adequate cash reserves',
                        'Review and optimize operational efficiency'
                    ]
            };

            setCurrentPrediction(transformedPrediction);

            // Refresh predictions list
            await fetchPredictions();

            addNotification('Prediction generated successfully!', 'success');
            return transformedPrediction;

        } catch (error) {
            console.error('Prediction generation failed:', error);
            setError(error);
            addNotification(error.message || 'Failed to generate prediction', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [authState.isAuthenticated, apiCall, addNotification]);

    /**
     * Fetch predictions history with FIXED data handling
     */
    const fetchPredictions = useCallback(async () => {
        if (!authState.isAuthenticated) {
            setPredictions([]);
            return;
        }

        try {
            setError(null);
            console.log('🔄 Fetching predictions...');

            const response = await apiCall('/predictions/history?limit=20', {}, 1);

            console.log('Raw API response:', response);
            console.log('Response type:', typeof response);
            console.log('Is Array:', Array.isArray(response));

            // FIXED: Handle different response formats safely
            let predictionsData = [];

            if (Array.isArray(response)) {
                // Direct array response (our updated backend)
                predictionsData = response;
                console.log('Direct array detected');
            } else if (response && response.data && Array.isArray(response.data)) {
                // Wrapped in data object
                predictionsData = response.data;
                console.log('Wrapped data array detected');
            } else if (response && Array.isArray(response.predictions)) {
                // Wrapped in predictions array
                predictionsData = response.predictions;
                console.log('Predictions array detected');
            } else if (response && typeof response === 'object') {
                // Object response, try to find array property
                const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
                if (arrayKeys.length > 0) {
                    predictionsData = response[arrayKeys[0]];
                    console.log(`Found array in property: ${arrayKeys[0]}`);
                } else {
                    console.warn('⚠️ No array found in response object:', response);
                    predictionsData = [];
                }
            } else {
                console.warn('Unexpected response format:', response);
                predictionsData = [];
            }

            console.log('Final predictions data:', predictionsData);
            console.log('Predictions count:', predictionsData.length);

            // SAFE TRANSFORMATION: Validate each prediction object
            const transformedPredictions = (predictionsData || []).map(pred => {
                try {
                    return {
                        id: pred.id || Math.random(),
                        financial_distress_probability: pred.financial_distress_probability || 0,
                        model_confidence: pred.model_confidence || 0,
                        risk_category: pred.risk_category || 'Unknown',
                        riskCategory: pred.risk_category || 'Unknown',
                        analysis_message: pred.analysis_message || 'No analysis available',
                        created_at: pred.created_at || new Date().toISOString(),
                        input_data: pred.input_data || {},
                        key_influencing_factors: Array.isArray(pred.key_influencing_factors)
                            ? pred.key_influencing_factors
                            : [],
                        recommendations: Array.isArray(pred.recommendations)
                            ? pred.recommendations
                            : ['No recommendations available'],
                        benchmark_comparisons: pred.benchmark_comparisons || {},
                        visualization_data: pred.visualization_data || {
                            risk_gauge: { value: 0, thresholds: { low: 0.3, medium: 0.7, high: 1.0 }, color: '#6b7280' },
                            factor_chart: [],
                            comparison_data: { user_score: 0, industry_avg: 0.25, region_avg: 0.30, benchmark: 'unknown' }
                        },

                        // Frontend-specific fields for compatibility
                        isDistressed: (pred.financial_distress_probability || 0) > 0.5,
                        probability: pred.financial_distress_probability || 0,
                        confidence: pred.model_confidence || 0,
                        riskLevel: pred.risk_category || 'Unknown',
                        message: pred.analysis_message || 'No analysis available',
                        timestamp: pred.created_at || new Date().toISOString(),
                        keyFactors: (pred.key_influencing_factors || []).map(factor => ({
                            factor: factor.name || 'Unknown Factor',
                            impact: factor.impact_level || 'Unknown',
                            value: factor.weight || 0
                        }))
                    };
                } catch (transformError) {
                    console.error('Error transforming prediction:', transformError, pred);
                    // Return minimal safe object
                    return {
                        id: pred.id || Math.random(),
                        financial_distress_probability: 0,
                        model_confidence: 0,
                        risk_category: 'Unknown',
                        riskCategory: 'Unknown',
                        analysis_message: 'Error loading prediction',
                        created_at: new Date().toISOString(),
                        input_data: {},
                        key_influencing_factors: [],
                        recommendations: ['Error loading recommendations'],
                        benchmark_comparisons: {},
                        visualization_data: {
                            risk_gauge: { value: 0, thresholds: { low: 0.3, medium: 0.7, high: 1.0 }, color: '#6b7280' },
                            factor_chart: [],
                            comparison_data: { user_score: 0, industry_avg: 0.25, region_avg: 0.30, benchmark: 'unknown' }
                        },
                        isDistressed: false,
                        probability: 0,
                        confidence: 0,
                        riskLevel: 'Unknown',
                        message: 'Error loading prediction',
                        timestamp: new Date().toISOString(),
                        keyFactors: []
                    };
                }
            });

            setPredictions(transformedPredictions);
            console.log('Predictions processed successfully:', transformedPredictions.length);

        } catch (error) {
            console.error('Failed to fetch predictions:', error);
            setError(error);
            setPredictions([]); // Always set empty array on error
            // Don't show notification for silent failures during component mount
            if (error.message && !error.message.includes('Token has expired')) {
                console.log('Showing error notification for:', error.message);
            }
        }
    }, [authState.isAuthenticated, apiCall]);

    /**
     * Get prediction details
     */
    const getPredictionDetails = useCallback(async (predictionId) => {
        if (!authState.isAuthenticated) {
            throw new Error('Authentication required');
        }

        if (!predictionId) {
            throw new Error('Invalid prediction ID');
        }

        try {
            setError(null);
            console.log(`Fetching details for prediction: ${predictionId}`);

            const response = await apiCall(`/predictions/${predictionId}`, {}, 1);

            console.log('Details response:', response);

            // Handle different response formats
            let detailsData = response;

            if (response && response.data) {
                detailsData = response.data;
            }

            // Validate and transform the response
            const safeDetails = {
                id: detailsData.id || predictionId,
                financial_distress_probability: detailsData.financial_distress_probability || 0,
                model_confidence: detailsData.model_confidence || 0,
                risk_category: detailsData.risk_category || 'Unknown',
                financial_health_status: detailsData.financial_health_status || 'Unknown',
                risk_level_detail: detailsData.risk_level_detail || 'No details available',
                analysis_message: detailsData.analysis_message || 'No analysis available',
                created_at: detailsData.created_at || new Date().toISOString(),
                region: detailsData.region || 'Unknown',
                sector: detailsData.sector || 'Unknown',
                model_version: detailsData.model_version || '1.0',
                processing_time_ms: detailsData.processing_time_ms || 0,
                input_data: detailsData.input_data || {},
                key_influencing_factors: Array.isArray(detailsData.key_influencing_factors)
                    ? detailsData.key_influencing_factors
                    : [],
                recommendations: Array.isArray(detailsData.recommendations)
                    ? detailsData.recommendations
                    : ['No recommendations available'],
                benchmark_comparisons: detailsData.benchmark_comparisons || {},
                visualization_data: detailsData.visualization_data || {
                    risk_gauge: { value: 0, thresholds: { low: 0.3, medium: 0.7, high: 1.0 }, color: '#6b7280' },
                    factor_importance: [],
                    risk_breakdown: {}
                }
            };

            console.log('Details processed successfully:', safeDetails);
            return safeDetails;

        } catch (error) {
            console.error('Failed to get prediction details:', error);
            throw new Error(error.message || 'Failed to load prediction details');
        }
    }, [authState.isAuthenticated, apiCall]);

    /**
     * Delete prediction with proper error handling
     */
    const deletePrediction = useCallback(async (predictionId) => {
        if (!authState.isAuthenticated) {
            throw new Error('Authentication required');
        }

        if (!predictionId) {
            throw new Error('Invalid prediction ID');
        }

        try {
            setError(null);
            console.log(`Deleting prediction: ${predictionId}`);

            const response = await apiCall(`/predictions/${predictionId}`, {
                method: 'DELETE'
            }, 1);

            console.log('Delete response:', response);

            // Update local state immediately for better UX
            setPredictions(prev => {
                const updated = prev.filter(p => p.id !== predictionId);
                console.log(`🔄 Updated predictions count: ${updated.length}`);
                return updated;
            });

            // Clear current prediction if it was the deleted one
            if (currentPrediction?.id === predictionId) {
                setCurrentPrediction(null);
            }

            addNotification('Prediction deleted successfully', 'success');
            return response;

        } catch (error) {
            console.error('Failed to delete prediction:', error);
            setError(error);
            addNotification(error.message || 'Failed to delete prediction', 'error');
            throw error;
        }
    }, [authState.isAuthenticated, apiCall, currentPrediction, addNotification]);

    /**
     * Clear all predictions
     */
    const clearPredictions = useCallback(async () => {
        if (!authState.isAuthenticated) {
            throw new Error('Authentication required');
        }

        try {
            setError(null);
            console.log('Clearing all predictions...');

            const response = await apiCall('/predictions/clear', {
                method: 'DELETE'
            }, 1);

            console.log('Clear response:', response);

            // Update local state
            setPredictions([]);
            setCurrentPrediction(null);

            addNotification('All predictions cleared successfully', 'success');
            return response;

        } catch (error) {
            console.error('Failed to clear predictions:', error);
            setError(error);
            addNotification(error.message || 'Failed to clear predictions', 'error');
            throw error;
        }
    }, [authState.isAuthenticated, apiCall, addNotification]);

    /**
     * Load predictions when user authentication changes
     */
    useEffect(() => {
        if (authState.isAuthenticated) {
            console.log('User authenticated, loading predictions...');
            fetchPredictions();
        } else {
            console.log('User not authenticated, clearing predictions...');
            setPredictions([]);
            setCurrentPrediction(null);
            setError(null);
        }
    }, [authState.isAuthenticated, fetchPredictions]);

    /**
     * Test server connectivity
     */
    const testConnection = useCallback(async () => {
        try {
            await apiCall('/health');
            console.log('Server connection test passed');
            return true;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }, [apiCall]);

    /**
     * Refresh predictions data
     */
    const refreshPredictions = useCallback(async () => {
        console.log('🔄 Refreshing predictions...');
        await fetchPredictions();
    }, [fetchPredictions]);

    /**
     * Get prediction by ID from local state
     */
    const getPredictionById = useCallback((predictionId) => {
        if (!predictionId) return null;
        return predictions.find(p => p.id === predictionId) || null;
    }, [predictions]);

    /**
     * Update prediction in local state
     */
    const updatePredictionInState = useCallback((updatedPrediction) => {
        setPredictions(prev =>
            prev.map(p =>
                p.id === updatedPrediction.id ? { ...p, ...updatedPrediction } : p
            )
        );
    }, []);

    // Debugging: Log state changes
    useEffect(() => {
        console.log('Predictions state updated:', {
            count: predictions.length,
            isLoading,
            hasError: !!error,
            isAuthenticated: authState.isAuthenticated
        });
    }, [predictions, isLoading, error, authState.isAuthenticated]);

    const value = {
        // State
        predictions,
        currentPrediction,
        isLoading,
        error,

        // Actions
        generatePrediction,
        fetchPredictions,
        refreshPredictions,
        deletePrediction,
        clearPredictions,
        getPredictionDetails,
        setCurrentPrediction,

        // Utilities
        testConnection,
        apiCall,
        getAuthHeaders,
        getPredictionById,
        updatePredictionInState,

        // Stats
        predictionsCount: predictions.length,
        hasValidPredictions: Array.isArray(predictions) && predictions.length > 0
    };

    return (
        <PredictionContext.Provider value={value}>
            {children}
        </PredictionContext.Provider>
    );
};

export default PredictionContext;
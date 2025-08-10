import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * FIXED Custom hook for fetching and managing prediction analytics data
 * Properly handles analytics, insights, and dashboard data with correct API endpoints
 */
const usePredictionData = (dataType = 'dashboard') => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // FIXED: Add ref to prevent unnecessary re-renders
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(null);

    const { authState, getAuthHeaders } = useAuth();

    // CRITICAL FIX: API configuration with correct endpoints including /api/v1
    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

    /**
     * FIXED: Enhanced API call with abort controller and better error handling
     */
    const apiCall = useCallback(async (endpoint) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            const url = `${API_BASE}${endpoint}`;
            const headers = getAuthHeaders();

            console.log(`[${dataType}] API call attempt 1 to: ${url}`);

            const response = await fetch(url, {
                headers,
                method: 'GET',
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || response.statusText;
                } catch (e) {
                    errorMessage = response.statusText || `HTTP Error ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log(`[${dataType}] Raw data received:`, result);
            return result;

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`[${dataType}] Request aborted`);
                return null;
            }

            console.error(`[${dataType}] API call failed for ${endpoint}:`, error);

            // Enhanced error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Unable to connect to the server. Please check your internet connection.');
            } else if (error.message.includes('401')) {
                throw new Error('Authentication required. Please sign in again.');
            } else if (error.message.includes('404')) {
                throw new Error('Not Found');
            } else if (error.message.includes('500')) {
                throw new Error('Server error. Please try again later.');
            }

            throw error;
        }
    }, [API_BASE, getAuthHeaders, dataType]);

    /**
     * CRITICAL FIX: Process recommendations data safely
     */
    const processRecommendations = useCallback((recommendations) => {
        if (!recommendations) return [];

        // If it's already an array, process each item
        if (Array.isArray(recommendations)) {
            return recommendations.map(rec => {
                if (typeof rec === 'string') {
                    return {
                        title: rec,
                        priority: 'Medium',
                        action: rec,
                        reason: 'Recommended action',
                        implementation: '',
                        expected_impact: ''
                    };
                } else if (typeof rec === 'object' && rec !== null) {
                    return {
                        title: rec.title || 'Recommendation',
                        priority: rec.priority || 'Medium',
                        action: rec.action || 'Action not specified',
                        reason: rec.reason || 'Reason not provided',
                        implementation: rec.implementation || '',
                        expected_impact: rec.expected_impact || ''
                    };
                } else {
                    return {
                        title: 'Invalid Recommendation',
                        priority: 'Low',
                        action: 'Review recommendation data',
                        reason: 'Data format issue',
                        implementation: '',
                        expected_impact: ''
                    };
                }
            });
        }

        return [];
    }, []);

    /**
     * CRITICAL FIX: Process risk alerts data safely
     */
    const processRiskAlerts = useCallback((alerts) => {
        if (!alerts) return [];

        if (Array.isArray(alerts)) {
            return alerts.map(alert => {
                if (typeof alert === 'string') {
                    return {
                        title: alert,
                        severity: 'Medium',
                        message: alert,
                        impact: 'Review required',
                        action: 'Investigate further',
                        timeline: 'As needed'
                    };
                } else if (typeof alert === 'object' && alert !== null) {
                    return {
                        title: alert.title || 'Risk Alert',
                        severity: alert.severity || 'Medium',
                        message: alert.message || 'Alert message not available',
                        impact: alert.impact || 'Impact assessment pending',
                        action: alert.action || 'Action required',
                        timeline: alert.timeline || 'Timeline not specified'
                    };
                } else {
                    return {
                        title: 'Invalid Alert',
                        severity: 'Low',
                        message: 'Alert data format issue',
                        impact: 'Data review needed',
                        action: 'Check alert data',
                        timeline: 'As needed'
                    };
                }
            });
        }

        return [];
    }, []);

    /**
     * CRITICAL FIX: Process market context data safely  
     */
    const processMarketContext = useCallback((context) => {
        if (!context) return [];

        if (Array.isArray(context)) {
            return context.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return {
                        trend: item.trend || item.title || item.name || 'Market Trend',
                        impact: item.impact || item.level || 'Medium',
                        description: item.description || item.desc || 'Description not available',
                        recommendation: item.recommendation || item.action || 'No recommendation',
                        source: item.source || 'Unknown Source'
                    };
                } else {
                    return {
                        trend: String(item || 'Unknown Trend'),
                        impact: 'Medium',
                        description: 'Context data processing issue',
                        recommendation: 'Review data format',
                        source: 'Data Processing'
                    };
                }
            });
        }

        return [];
    }, []);

    /**
     * CRITICAL FIX: Process backend data structure safely
     */
    const processBackendData = useCallback((rawData, type) => {
        if (!rawData) return null;

        console.log(`[${type}] Processing backend data:`, rawData);

        try {
            switch (type) {
                case 'analytics':
                    return {
                        isEmpty: rawData.isEmpty || false,
                        totalPredictions: rawData.totalPredictions || rawData.key_metrics?.total_predictions || 0,
                        period_days: rawData.period_days || 30,
                        date_range: rawData.date_range || {},
                        key_metrics: {
                            total_predictions: rawData.key_metrics?.total_predictions || rawData.totalPredictions || 0,
                            average_risk_score: rawData.key_metrics?.average_risk_score || 0,
                            risk_distribution: Array.isArray(rawData.key_metrics?.risk_distribution) ? rawData.key_metrics.risk_distribution : [],
                            data_quality: rawData.key_metrics?.data_quality || rawData.dataQuality || 'Unknown',
                            health_score: rawData.key_metrics?.health_score || 0
                        },
                        riskDistribution: Array.isArray(rawData.key_metrics?.risk_distribution) ? rawData.key_metrics.risk_distribution : [],
                        risk_trend_analysis: Array.isArray(rawData.risk_trend_analysis) ? rawData.risk_trend_analysis : [],
                        factor_contribution: Array.isArray(rawData.factor_contribution) ? rawData.factor_contribution : [],
                        topRiskFactors: Array.isArray(rawData.factor_contribution) ? rawData.factor_contribution : [],
                        monthlyTrends: Array.isArray(rawData.risk_trend_analysis) ? rawData.risk_trend_analysis : [],
                        peer_comparison: rawData.peer_comparison || {},
                        summary_insights: rawData.summary_insights || {},
                        dataQuality: rawData.dataQuality || rawData.key_metrics?.data_quality || 'Unknown',
                        lastUpdated: rawData.lastUpdated || new Date().toISOString()
                    };

                case 'insights':
                    const rawRecommendations = rawData.actionable_recommendations || rawData.recommendations || [];
                    const rawRiskAlerts = rawData.risk_alerts || [];
                    const rawMarketContext = rawData.market_context || rawData.marketTrends || [];

                    return {
                        isEmpty: rawData.isEmpty || false,
                        actionable_recommendations: processRecommendations(rawRecommendations),
                        recommendations: processRecommendations(rawRecommendations),
                        risk_alerts: processRiskAlerts(rawRiskAlerts),
                        riskAlerts: processRiskAlerts(rawRiskAlerts),
                        market_context: processMarketContext(rawMarketContext),
                        marketTrends: processMarketContext(rawMarketContext),
                        insight_summary: rawData.insight_summary || {
                            total_insights: 0,
                            critical_risks: 0,
                            recommendations: 0,
                            alert_level: 'None'
                        },
                        key_factors_analysis: Array.isArray(rawData.key_factors_analysis) ? rawData.key_factors_analysis : [],
                        keyInsights: Array.isArray(rawData.key_insights) ? rawData.key_insights : [],
                        dataQuality: rawData.dataQuality || 'Unknown',
                        lastUpdated: rawData.lastUpdated || new Date().toISOString()
                    };

                case 'dashboard':
                default:
                    return {
                        isEmpty: rawData.isEmpty || false,
                        financial_health_snapshot: rawData.financial_health_snapshot || {
                            health_score: 0,
                            risk_category: 'Unknown',
                            score_change: 0,
                            color: '#6b7280'
                        },
                        risk_category_breakdown: rawData.risk_category_breakdown || {
                            user_distribution: [],
                            benchmark_percentile: 50
                        },
                        key_risk_drivers: Array.isArray(rawData.key_risk_drivers) ? rawData.key_risk_drivers : [],
                        trend_overview: Array.isArray(rawData.trend_overview) ? rawData.trend_overview : [],
                        summary_stats: rawData.summary_stats || {
                            total_predictions: 0
                        },
                        dataQuality: rawData.dataQuality || 'Unknown',
                        lastUpdated: rawData.lastUpdated || new Date().toISOString()
                    };
            }
        } catch (error) {
            console.error(`[${type}] Error processing backend data:`, error);
            return createFallbackData(type);
        }
    }, [processRecommendations, processRiskAlerts, processMarketContext]);

    /**
     * FIXED: Improved fallback data creation
     */
    const createFallbackData = useCallback((type) => {
        const baseData = {
            isEmpty: true,
            dataQuality: 'Error',
            lastUpdated: new Date().toISOString(),
            error: true
        };

        switch (type) {
            case 'analytics':
                return {
                    ...baseData,
                    totalPredictions: 0,
                    key_metrics: {
                        total_predictions: 0,
                        average_risk_score: 0,
                        risk_distribution: [],
                        data_quality: 'Error',
                        health_score: 0
                    },
                    riskDistribution: [],
                    risk_trend_analysis: [],
                    factor_contribution: [],
                    topRiskFactors: [],
                    monthlyTrends: [],
                    peer_comparison: {},
                    summary_insights: {}
                };

            case 'insights':
                return {
                    ...baseData,
                    actionable_recommendations: [],
                    recommendations: [],
                    risk_alerts: [],
                    riskAlerts: [],
                    market_context: [],
                    marketTrends: [],
                    insight_summary: {
                        total_insights: 0,
                        critical_risks: 0,
                        recommendations: 0,
                        alert_level: 'Error'
                    },
                    key_factors_analysis: [],
                    keyInsights: []
                };

            case 'dashboard':
            default:
                return {
                    ...baseData,
                    financial_health_snapshot: {
                        health_score: 0,
                        risk_category: 'Unknown',
                        score_change: 0,
                        color: '#6b7280'
                    },
                    risk_category_breakdown: {
                        user_distribution: [],
                        benchmark_percentile: 50
                    },
                    key_risk_drivers: [],
                    trend_overview: [],
                    summary_stats: {
                        total_predictions: 0
                    }
                };
        }
    }, []);

    /**
     * FIXED: Main fetch function with correct endpoints
     */
    const fetchData = useCallback(async (forceRefresh = false) => {
        // Don't fetch if not authenticated
        if (!authState?.isAuthenticated) {
            console.log(`[${dataType}] Not authenticated, skipping data fetch`);
            setData(null);
            setError(null);
            return null;
        }

        // Don't fetch if we have recent data and not forcing refresh
        if (!forceRefresh && data && lastFetch && Date.now() - lastFetch < 30000) {
            console.log(`[${dataType}] Using cached data (${Math.round((Date.now() - lastFetch) / 1000)}s old)`);
            return data;
        }

        // Don't start new request if already loading
        if (isLoading && !forceRefresh) {
            console.log(`[${dataType}] Already loading, skipping duplicate request`);
            return data;
        }

        setIsLoading(true);
        setError(null);

        try {
            let endpoint;
            switch (dataType) {
                case 'analytics':
                    endpoint = '/analytics';
                    break;
                case 'insights':
                    endpoint = '/insights/fast';
                    break;
                case 'dashboard':
                default:
                    endpoint = '/dashboard';
                    break;
            }

            console.log(`[${dataType}] Fetching from ${endpoint}`);
            const result = await apiCall(endpoint);

            // Check if request was aborted
            if (!result || !isMountedRef.current) {
                return null;
            }

            // Process and validate the data
            const processedData = processBackendData(result, dataType);

            if (isMountedRef.current) {
                setData(processedData);
                setLastFetch(Date.now());
                setError(null);
                console.log(`[${dataType}] Data processed successfully:`, processedData);
            }

            return processedData;

        } catch (error) {
            if (!isMountedRef.current) return null;

            console.error(`[${dataType}] Failed to fetch data:`, error);
            setError(error);

            // Set fallback data for better UX
            const fallbackData = createFallbackData(dataType);
            setData(fallbackData);
            return fallbackData;

        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [authState?.isAuthenticated, apiCall, dataType, data, lastFetch, isLoading, processBackendData, createFallbackData]);

    /**
     * FIXED: Refresh data manually
     */
    const refreshData = useCallback(async () => {
        console.log(`[${dataType}] Manual refresh requested`);
        return await fetchData(true);
    }, [fetchData, dataType]);

    /**
     * Test server connectivity
     */
    const testConnection = useCallback(async () => {
        try {
            await apiCall('/health');
            return true;
        } catch (error) {
            console.error(`[${dataType}] Connection test failed:`, error);
            return false;
        }
    }, [apiCall, dataType]);

    // FIXED: Auto-fetch data with better dependency tracking
    useEffect(() => {
        if (authState?.isAuthenticated) {
            console.log(`[${dataType}] Auth state changed - fetching data`);
            fetchData();
        } else {
            console.log(`[${dataType}] Not authenticated - clearing data`);
            setData(null);
            setError(null);
        }
    }, [authState?.isAuthenticated, dataType, fetchData]);

    // FIXED: Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            console.log(`[${dataType}] Hook unmounting - cleaning up`);
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [dataType]);

    // Computed values
    const hasData = data && !data.isEmpty && !data.error;
    const dataQuality = data?.dataQuality || 'Unknown';

    // Debug logging
    useEffect(() => {
        const logData = {
            dataType,
            hasData,
            isLoading,
            error: error?.message,
            dataQuality,
            lastFetch: lastFetch ? new Date(lastFetch).toLocaleTimeString() : null,
            authenticated: authState?.isAuthenticated,
            dataKeys: data ? Object.keys(data) : null,
            isEmpty: data?.isEmpty
        };

        console.log(`[${dataType}] Hook state:`, logData);
    }, [dataType, hasData, isLoading, error?.message, dataQuality, lastFetch, authState?.isAuthenticated, data?.isEmpty]);

    return {
        // Data
        data,

        // State
        isLoading,
        error,
        hasData,
        dataQuality,
        lastFetch,

        // Actions
        fetchData,
        refreshData,
        testConnection
    };
};

export default usePredictionData;
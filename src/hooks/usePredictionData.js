
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for fetching and managing prediction analytics data
 * Properly sends authentication headers with all requests
 */
const usePredictionData = (dataType = 'dashboard') => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // Refs to prevent memory leaks and handle cleanup
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    // Get auth data properly
    const { user, isAuthenticated, accessToken, getAuthHeaders } = useAuth();

    // API configuration
    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';
    const REQUEST_TIMEOUT = 45000; // 45 seconds for server startup
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    /**
     * Enhanced API call with proper auth headers
     */
    const apiCall = useCallback(async (endpoint, retryCount = 0) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => abortControllerRef.current.abort(), REQUEST_TIMEOUT);

        try {
            const url = `${API_BASE}${endpoint}`;

            // Get auth headers properly
            let headers = {
                'Content-Type': 'application/json'
            };

            // Add auth token if available
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            } else if (typeof getAuthHeaders === 'function') {
                headers = getAuthHeaders();
            }

            console.log(`[${dataType}] API call attempt ${retryCount + 1} to: ${url}`);
            console.log(`[${dataType}] Using auth token: ${headers.Authorization ? 'Yes' : 'No'}`);

            const response = await fetch(url, {
                headers,
                method: 'GET',
                signal: abortControllerRef.current.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Handle specific HTTP errors
                if (response.status === 401) {
                    console.error(`[${dataType}] 401 Unauthorized - Token may be invalid or missing`);
                    throw new Error('Not authenticated');
                } else if (response.status === 403) {
                    throw new Error('Access denied. Insufficient permissions.');
                } else if (response.status === 404) {
                    throw new Error('Service endpoint not found.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please wait and try again.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. The service may be starting up. Please try again in a moment.');
                }

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
            console.log(`[${dataType}] Success on attempt ${retryCount + 1}:`, result);
            return result;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                if (retryCount < MAX_RETRIES) {
                    console.log(`[${dataType}] Request timeout, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                    await new Promise(resolve => {
                        retryTimeoutRef.current = setTimeout(resolve, RETRY_DELAY * (retryCount + 1));
                    });
                    return await apiCall(endpoint, retryCount + 1);
                } else {
                    throw new Error('Connection timeout. The server may be starting up. Please try again in a few minutes.');
                }
            }

            // Don't retry on authentication errors
            if (error.message === 'Not authenticated') {
                throw error;
            }

            if (error.message.includes('fetch') && retryCount < MAX_RETRIES) {
                console.log(`[${dataType}] Network error, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => {
                    retryTimeoutRef.current = setTimeout(resolve, RETRY_DELAY * (retryCount + 1));
                });
                return await apiCall(endpoint, retryCount + 1);
            }

            console.error(`[${dataType}] API call failed after ${retryCount + 1} attempts:`, error);
            throw error;
        }
    }, [API_BASE, accessToken, getAuthHeaders, dataType]);

    /**
     * Safe data processing with comprehensive validation
     */
    const processBackendData = useCallback((rawData, type) => {
        if (!rawData) {
            console.warn(`[${type}] No data received from backend`);
            return createEmptyData(type);
        }

        console.log(`[${type}] Processing backend data:`, rawData);

        try {
            switch (type) {
                case 'analytics':
                    return processAnalyticsData(rawData);
                case 'insights':
                    return processInsightsData(rawData);
                case 'dashboard':
                default:
                    return processDashboardData(rawData);
            }
        } catch (error) {
            console.error(`[${type}] Error processing backend data:`, error);
            return createEmptyData(type);
        }
    }, []);

    /**
     * Process analytics data with proper validation
     */
    const processAnalyticsData = (rawData) => {
        const keyMetrics = rawData.key_metrics || {};

        return {
            isEmpty: rawData.isEmpty || false,
            totalPredictions: keyMetrics.total_predictions || rawData.totalPredictions || 0,
            period_days: rawData.period_days || 30,
            date_range: rawData.date_range || {},
            key_metrics: {
                total_predictions: keyMetrics.total_predictions || 0,
                average_risk_score: Number(keyMetrics.average_risk_score || 0),
                risk_distribution: Array.isArray(keyMetrics.risk_distribution) ? keyMetrics.risk_distribution : [],
                data_quality: keyMetrics.data_quality || rawData.dataQuality || 'Unknown',
                health_score: Number(keyMetrics.health_score || 0)
            },
            riskDistribution: Array.isArray(keyMetrics.risk_distribution) ? keyMetrics.risk_distribution : [],
            risk_trend_analysis: Array.isArray(rawData.risk_trend_analysis) ? rawData.risk_trend_analysis : [],
            factor_contribution: Array.isArray(rawData.factor_contribution) ? rawData.factor_contribution : [],
            topRiskFactors: Array.isArray(rawData.factor_contribution) ? rawData.factor_contribution : [],
            monthlyTrends: Array.isArray(rawData.risk_trend_analysis) ? rawData.risk_trend_analysis : [],
            peer_comparison: rawData.peer_comparison || {},
            summary_insights: rawData.summary_insights || {},
            dataQuality: keyMetrics.data_quality || rawData.dataQuality || 'Unknown',
            lastUpdated: rawData.lastUpdated || new Date().toISOString()
        };
    };

    /**
     * Process insights data with proper validation
     */
    const processInsightsData = (rawData) => {
        const processRecommendations = (recommendations) => {
            if (!Array.isArray(recommendations)) return [];

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
                        title: String(rec.title || 'Recommendation'),
                        priority: String(rec.priority || 'Medium'),
                        action: String(rec.action || 'Action not specified'),
                        reason: String(rec.reason || 'Reason not provided'),
                        implementation: String(rec.implementation || ''),
                        expected_impact: String(rec.expected_impact || '')
                    };
                }
                return {
                    title: 'Invalid Recommendation',
                    priority: 'Low',
                    action: 'Review recommendation data',
                    reason: 'Data format issue',
                    implementation: '',
                    expected_impact: ''
                };
            });
        };

        const processRiskAlerts = (alerts) => {
            if (!Array.isArray(alerts)) return [];

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
                        title: String(alert.title || 'Risk Alert'),
                        severity: String(alert.severity || 'Medium'),
                        message: String(alert.message || 'Alert message not available'),
                        impact: String(alert.impact || 'Impact assessment pending'),
                        action: String(alert.action || 'Action required'),
                        timeline: String(alert.timeline || 'Timeline not specified')
                    };
                }
                return {
                    title: 'Invalid Alert',
                    severity: 'Low',
                    message: 'Alert data format issue',
                    impact: 'Data review needed',
                    action: 'Check alert data',
                    timeline: 'As needed'
                };
            });
        };

        const processMarketContext = (context) => {
            if (!Array.isArray(context)) return [];

            return context.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return {
                        trend: String(item.trend || item.title || item.name || 'Market Trend'),
                        impact: String(item.impact || item.level || 'Medium'),
                        description: String(item.description || item.desc || 'Description not available'),
                        recommendation: String(item.recommendation || item.action || 'No recommendation'),
                        source: String(item.source || 'Unknown Source')
                    };
                }
                return {
                    trend: String(item || 'Unknown Trend'),
                    impact: 'Medium',
                    description: 'Context data processing issue',
                    recommendation: 'Review data format',
                    source: 'Data Processing'
                };
            });
        };

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
    };

    /**
     * Process dashboard data with proper validation
     */
    const processDashboardData = (rawData) => {
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
    };

    /**
     * Create appropriate empty data structure
     */
    const createEmptyData = useCallback((type) => {
        const baseData = {
            isEmpty: true,
            dataQuality: 'No Data',
            lastUpdated: new Date().toISOString()
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
                        data_quality: 'No Data',
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
                        alert_level: 'None'
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
     * Main fetch function with proper authentication check
     */
    const fetchData = useCallback(async (forceRefresh = false) => {
        // Check authentication properly
        if (!isAuthenticated || !accessToken) {
            console.log(`[${dataType}] Not authenticated, clearing data`);
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

            // Check if request was aborted or component unmounted
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

            // Set empty data for better UX
            const emptyData = createEmptyData(dataType);
            setData(emptyData);
            return emptyData;

        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [isAuthenticated, accessToken, apiCall, dataType, data, lastFetch, isLoading, processBackendData, createEmptyData]);

    /**
     * Refresh data manually
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

    // Auto-fetch data when authentication state changes
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            console.log(`[${dataType}] Auth state changed - fetching data`);
            // Add a small delay to ensure token is properly set
            const timer = setTimeout(() => {
                fetchData();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            console.log(`[${dataType}] Not authenticated - clearing data`);
            setData(null);
            setError(null);
        }
    }, [isAuthenticated, accessToken, dataType, fetchData]);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            console.log(`[${dataType}] Hook unmounting - cleaning up`);
            isMountedRef.current = false;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [dataType]);

    // Computed values
    const hasData = data && !data.isEmpty;
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
            authenticated: isAuthenticated,
            hasToken: !!accessToken,
            dataKeys: data ? Object.keys(data) : null,
            isEmpty: data?.isEmpty
        };

        console.log(`[${dataType}] Hook state:`, logData);
    }, [dataType, hasData, isLoading, error?.message, dataQuality, lastFetch, isAuthenticated, accessToken, data?.isEmpty]);

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
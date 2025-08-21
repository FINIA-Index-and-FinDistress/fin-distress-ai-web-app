import React, { useState, useEffect, useCallback } from 'react';
import { Target, Award, Building2, Shield, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { usePrediction } from '../../context/PredictionContext';

const StatsCards = () => {
    const { addNotification } = useNotifications();
    const { authState } = useAuth();
    const { predictions } = usePrediction();
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

    const getAuthHeaders = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (authState.token) {
            headers.Authorization = `Bearer ${authState.token}`;
        }
        return headers;
    }, [authState.token]);

    const apiCall = useCallback(async (endpoint, retries = 1) => {
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(`${API_BASE}${endpoint}`, {
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.detail || errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = response.statusText || errorMessage;
                    }

                    if (response.status === 401 || response.status === 403) {
                        throw new Error(errorMessage);
                    }

                    if (response.status >= 500 && attempt < retries) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                        continue;
                    }

                    throw new Error(errorMessage);
                }

                return await response.json();
            } catch (error) {
                lastError = error;
                if (attempt < retries && !error.message.includes('401') && !error.message.includes('403')) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError;
    }, [API_BASE, getAuthHeaders]);

    const fetchStats = useCallback(async (showNotification = false) => {
        if (!authState.isAuthenticated) {
            setStats(getDefaultStats());
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await apiCall('/dashboard', 1);

            if (data?.mlInsights) {
                const insights = data.mlInsights;

                const transformedStats = [
                    {
                        label: 'Predictions Made',
                        value: 'Loading...',
                        icon: Target,
                        color: 'bg-blue-500',
                        trend: 'Fetching...',
                        description: 'Total predictions processed',
                        rawValue: 0
                    },
                    {
                        label: 'Model Accuracy',
                        value: `${insights.accuracy_rate?.toFixed(1) || '91.0'}%`,
                        icon: Award,
                        color: 'bg-green-500',
                        trend: insights.accuracy_rate >= 90 ? 'Excellent' : insights.accuracy_rate >= 80 ? 'Good' : 'Fair',
                        description: 'ML model prediction accuracy',
                        rawValue: insights.accuracy_rate || 91.0
                    },
                    {
                        label: 'Companies Analyzed',
                        value: insights.companies_analyzed?.toLocaleString() || '1,333',
                        icon: Building2,
                        color: 'bg-purple-500',
                        trend: 'Training data',
                        description: 'Total companies in dataset',
                        rawValue: insights.companies_analyzed || 1333
                    },
                    {
                        label: 'Risk Factors',
                        value: insights.risk_factors?.toString() || '21',
                        icon: Shield,
                        color: 'bg-orange-500',
                        trend: 'Multi-dimensional',
                        description: 'Financial indicators analyzed',
                        rawValue: insights.risk_factors || 21
                    }
                ];

                setStats(transformedStats);
                setLastUpdated(new Date());
                setRetryCount(0);
            } else {
                setStats(getDefaultStats());
            }

            if (showNotification) {
                addNotification('Dashboard data refreshed successfully', 'success');
            }

        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            setError(error);
            setStats(getDefaultStats());
            setRetryCount(prev => prev + 1);

            if (showNotification) {
                if (error.message.includes('Token has expired')) {
                    addNotification('Session expired. Please sign in again.', 'warning');
                } else if (error.message.includes('connect')) {
                    addNotification('Connection lost. Using cached data.', 'warning');
                } else {
                    addNotification('Unable to refresh data. Using defaults.', 'warning');
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [authState.isAuthenticated, apiCall, addNotification]);

    const getDefaultStats = useCallback(() => [
        {
            label: 'Predictions Made',
            value: '0',
            icon: Target,
            color: 'bg-gray-400',
            trend: 'No data',
            description: 'Sign in to view predictions',
            rawValue: 0
        },
        {
            label: 'Model Accuracy',
            value: '91.0%',
            icon: Award,
            color: 'bg-green-500',
            trend: 'Expected',
            description: 'System default accuracy',
            rawValue: 91.0
        },
        {
            label: 'Companies Analyzed',
            value: '1,333',
            icon: Building2,
            color: 'bg-purple-500',
            trend: 'Training data',
            description: 'Total companies in dataset',
            rawValue: 1333
        },
        {
            label: 'Risk Factors',
            value: '21',
            icon: Shield,
            color: 'bg-orange-500',
            trend: 'Available',
            description: 'Financial indicators',
            rawValue: 21
        }
    ], []);

    const getProgressWidth = useCallback((stat) => {
        switch (stat.label) {
            case 'Model Accuracy':
                return `${Math.min(stat.rawValue, 100)}%`;
            case 'Predictions Made':
                return `${Math.min((stat.rawValue / 100) * 100, 100)}%`;
            case 'Companies Analyzed':
                return stat.rawValue > 0 ? `${Math.min((stat.rawValue / 2000) * 100, 100)}%` : '75%';
            case 'Risk Factors':
                return `${Math.min((stat.rawValue / 25) * 100, 100)}%`;
            default:
                return '50%';
        }
    }, []);

    const handleRefresh = useCallback(async () => {
        await fetchStats(true);
    }, [fetchStats]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        if (!authState.isAuthenticated) return;

        const baseInterval = 30000;
        const interval = Math.min(baseInterval * Math.pow(2, retryCount), 300000);

        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchStats();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [authState.isAuthenticated, fetchStats, retryCount]);

    // 🔁 Update "Predictions Made" card when predictions change
    useEffect(() => {
        if (!authState.isAuthenticated) return;

        setStats((prevStats) =>
            prevStats.map((stat) => {
                if (stat.label === 'Predictions Made') {
                    return {
                        ...stat,
                        value: (predictions?.length || 0).toLocaleString(),
                        trend: predictions?.length > 0 ? 'Active' : 'No data',
                        rawValue: predictions?.length || 0
                    };
                }
                return stat;
            })
        );
    }, [predictions, authState.isAuthenticated]);

    if (isLoading && stats.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200/50 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error && error.message.includes('connect') && stats.length === 0) {
        return (
            <div className="grid grid-cols-1 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
                    <p className="text-red-600 mb-4">Unable to connect to the server. Please check your internet connection.</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? 'Retrying...' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Status bar */}
            <div className="col-span-full mb-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        Status:
                        <span className={`ml-1 font-medium ${error ? 'text-orange-600' : authState.isAuthenticated ? 'text-green-600' : 'text-blue-600'}`}>
                            {error ? 'Limited Data' : authState.isAuthenticated ? 'Connected' : 'Default View'}
                        </span>
                    </span>
                    <div className="flex items-center space-x-3">
                        {lastUpdated && (
                            <span className="text-gray-500 flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${error ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></div>
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={handleRefresh}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
                            disabled={isLoading}
                            title="Refresh data"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-200 group relative"
                    title={stat.description}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>

                            {stat.label === 'Predictions Made' && stat.value === 'Loading...' ? (
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {stat.value}
                                </p>
                            )}
                        </div>

                        <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-700 ${stat.color.replace('bg-', 'bg-opacity-70 bg-')}`}
                                style={{ width: getProgressWidth(stat) }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">{stat.trend}</p>

                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 rounded-2xl flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatsCards;

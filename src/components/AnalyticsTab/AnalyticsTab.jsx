import React, { useState, useCallback, useEffect } from 'react';
import { BarChart2, RefreshCw, Shield, AlertTriangle, TrendingUp, PieChart, LineChart, Activity, Target, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import usePredictionData from "../../hooks/usePredictionData";

/**
 * FIXED Analytics Tab with proper data handling and no object rendering
 */
const AnalyticsTab = () => {
    const { data, isLoading, error, refreshData, hasData, dataQuality } = usePredictionData('analytics');
    const { isAuthenticated } = useAuth();
    const { addNotification } = useNotifications();
    const [lastRefresh, setLastRefresh] = useState(null);

    /**
     * Handle data refresh with user feedback
     */
    const handleRefresh = useCallback(async () => {
        try {
            await refreshData();
            setLastRefresh(new Date().toLocaleTimeString());
            addNotification('Analytics data refreshed successfully', 'success');
        } catch (error) {
            addNotification('Failed to refresh analytics data', 'error');
        }
    }, [refreshData, addNotification]);

    /**
     * Debug effect to log data structure
     */
    useEffect(() => {
        if (data) {
            console.log('[AnalyticsTab] Current data structure:', data);
        }
    }, [data]);

    /**
     * Safe data extraction helper
     */
    const safeExtractData = useCallback((data, path, fallback = []) => {
        try {
            const keys = path.split('.');
            let current = data;
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return fallback;
                }
            }
            return Array.isArray(current) ? current : fallback;
        } catch (e) {
            console.warn(`Failed to extract path ${path}:`, e);
            return fallback;
        }
    }, []);

    /**
     * Safe value extraction helper
     */
    const safeExtractValue = useCallback((data, path, fallback = 0) => {
        try {
            const keys = path.split('.');
            let current = data;
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return fallback;
                }
            }
            return typeof current === 'number' ? current : fallback;
        } catch (e) {
            return fallback;
        }
    }, []);

    /**
     * Safe string extraction helper
     */
    const safeExtractString = useCallback((data, path, fallback = '') => {
        try {
            const keys = path.split('.');
            let current = data;
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return fallback;
                }
            }
            return typeof current === 'string' ? current : String(current || fallback);
        } catch (e) {
            return fallback;
        }
    }, []);

    // FIXED: Extract data quality at component level for global access
    const extractedDataQuality = data ?
        safeExtractString(data, 'key_metrics.data_quality',
            safeExtractString(data, 'dataQuality', 'Unknown')) : 'Unknown';

    /**
     * Render authentication requirement notice
     */
    const renderAuthRequired = () => (
        <div className="flex justify-center items-center h-96">
            <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-200 max-w-md">
                <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Authentication Required</h3>
                <p className="text-blue-700 mb-4">
                    Please sign in to access comprehensive financial analytics and market insights.
                </p>
            </div>
        </div>
    );

    /**
     * Render loading state
     */
    const renderLoading = () => (
        <div className="flex justify-center items-center h-96">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <TrendingUp className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Loading Analytics Dashboard</p>
                <p className="text-sm text-gray-500">Processing market data and prediction insights...</p>
            </div>
        </div>
    );

    /**
     * Render error state
     */
    const renderError = () => (
        <div className="flex justify-center items-center h-96">
            <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 max-w-md">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Analytics Unavailable</h3>
                <p className="text-red-700 text-sm mb-4">
                    {typeof error === 'string' ? error : error?.message || 'Failed to load analytics'}
                </p>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    disabled={isLoading}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    /**
     * Render no data state
     */
    const renderNoData = () => (
        <div className="flex justify-center items-center h-96">
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 max-w-md">
                <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analytics Data</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Start making predictions to generate analytics insights and visualizations.
                </p>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    disabled={isLoading}
                >
                    Check for Data
                </button>
            </div>
        </div>
    );

    const RiskDistributionChart = ({ data: chartData, title = "Risk Distribution" }) => {
        console.log('🔍 RiskDistributionChart received data:', chartData);

        // FIXED: Handle the data structure properly
        let riskData = [];

        if (Array.isArray(chartData)) {
            riskData = chartData;
        } else {
            riskData = [];
        }

        console.log('📊 Processed risk data:', riskData);

        if (!riskData || riskData.length === 0) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                    <div className="flex items-center mb-4">
                        <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No risk distribution data available</p>
                            <p className="text-xs mt-2">Data received: {JSON.stringify(chartData)}</p>
                        </div>
                    </div>
                </div>
            );
        }

        const processedData = riskData.map(item => ({
            name: item.name || 'Unknown',
            value: Number(item.value || 0),
            percentage: Number(item.percentage || 0)
        }));

        const total = processedData.reduce((sum, item) => sum + item.value, 0);

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Total: {total}
                    </span>
                </div>

                {/* Visual pie chart representation */}
                <div className="mb-6">
                    <div className="relative mx-auto w-48 h-48">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg"></div>
                        {processedData[1] && processedData[1].value > 0 && (
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (processedData[1].percentage || 0) * 0.5}% 0%, 100% 100%, 50% 100%)`
                                }}
                            ></div>
                        )}
                        {processedData[2] && processedData[2].value > 0 && (
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-red-500"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% ${processedData[2].percentage || 0}%, 50% 100%)`
                                }}
                            ></div>
                        )}
                        <div className="absolute inset-12 rounded-full bg-white shadow-inner flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{total}</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend and details */}
                <div className="space-y-4">
                    {processedData.map((item, index) => {
                        const percentage = item.percentage || (total > 0 ? ((item.value / total) * 100).toFixed(1) : 0);
                        const colors = [
                            { bg: 'bg-green-500', text: 'text-green-800', bgLight: 'bg-green-50', border: 'border-green-200' },
                            { bg: 'bg-yellow-500', text: 'text-yellow-800', bgLight: 'bg-yellow-50', border: 'border-yellow-200' },
                            { bg: 'bg-red-500', text: 'text-red-800', bgLight: 'bg-red-50', border: 'border-red-200' }
                        ];
                        const colorSet = colors[index] || colors[0];

                        return (
                            <div key={index} className={`p-4 rounded-lg border ${colorSet.bgLight} ${colorSet.border}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full ${colorSet.bg} mr-3`}></div>
                                        <span className={`text-sm font-semibold ${colorSet.text}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-lg font-bold ${colorSet.text}`}>{item.value}</span>
                                        <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                                    </div>
                                </div>
                                <div className={`w-full bg-gray-200 rounded-full h-3`}>
                                    <div
                                        className={`h-3 rounded-full ${colorSet.bg} transition-all duration-1000 ease-out`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // REPLACE the TrendsChart function in your AnalyticsTab.jsx with this:

    const TrendsChart = ({ data: chartData, title = "Risk Trends" }) => {
        console.log('📈 TrendsChart received data:', chartData);

        // FIXED: Handle the data structure properly
        let trendsData = [];

        if (Array.isArray(chartData)) {
            trendsData = chartData;
        } else {
            trendsData = [];
        }

        console.log('📊 Processed trends data:', trendsData);

        if (!trendsData || trendsData.length === 0) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                    <div className="flex items-center mb-4">
                        <LineChart className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No trend data available</p>
                            <p className="text-xs mt-2">Data received: {JSON.stringify(chartData)}</p>
                        </div>
                    </div>
                </div>
            );
        }

        const processedData = trendsData.map(item => ({
            period: item.period || 'Unknown',
            value: Number(item.health_score || item.risk_score || item.value || 0),
            predictionCount: Number(item.prediction_count || 0)
        }));

        const maxValue = Math.max(...processedData.map(item => Math.abs(item.value)));

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <LineChart className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {processedData.length} periods
                    </span>
                </div>

                {/* Chart visualization */}
                <div className="relative h-48 mb-6 bg-gray-50 rounded-lg p-4">
                    <div className="absolute inset-4">
                        {/* Grid lines */}
                        <div className="absolute inset-0">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute border-t border-gray-200"
                                    style={{ top: `${i * 25}%`, left: 0, right: 0 }}
                                ></div>
                            ))}
                            {[...Array(processedData.length + 1)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute border-l border-gray-200 h-full"
                                    style={{ left: `${(i / Math.max(processedData.length, 1)) * 100}%` }}
                                ></div>
                            ))}
                        </div>

                        {/* Data points and line */}
                        <svg className="absolute inset-0 w-full h-full">
                            {processedData.length > 1 && (
                                <polyline
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="3"
                                    points={processedData.map((item, index) => {
                                        const x = (index / Math.max(processedData.length - 1, 1)) * 100;
                                        const y = maxValue > 0 ? 100 - ((Math.abs(item.value) / maxValue) * 100) : 50;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                />
                            )}

                            {/* Data points */}
                            {processedData.map((item, index) => {
                                const x = (index / Math.max(processedData.length - 1, 1)) * 100;
                                const y = maxValue > 0 ? 100 - ((Math.abs(item.value) / maxValue) * 100) : 50;
                                const isPositive = item.value >= 0;

                                return (
                                    <circle
                                        key={index}
                                        cx={`${x}%`}
                                        cy={`${y}%`}
                                        r="4"
                                        fill={isPositive ? "#10b981" : "#ef4444"}
                                        stroke="white"
                                        strokeWidth="2"
                                        className="hover:r-6 transition-all cursor-pointer"
                                    />
                                );
                            })}

                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Data details */}
                <div className="space-y-3 max-h-32 overflow-y-auto">
                    {processedData.slice(0, 6).map((item, index) => {
                        const isPositive = item.value >= 0;

                        return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.period}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.value.toFixed(1)}
                                    </span>
                                    {item.predictionCount > 0 && (
                                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                            {item.predictionCount} predictions
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // REPLACE the FactorsChart function in your AnalyticsTab.jsx with this:

    const FactorsChart = ({ data: chartData, title = "Top Risk Factors" }) => {
        console.log('🔍 FactorsChart received data:', chartData);

        // FIXED: Handle the data structure properly
        let factorsData = [];

        if (Array.isArray(chartData)) {
            factorsData = chartData;
        } else {
            factorsData = [];
        }

        console.log('📊 Processed factors data:', factorsData);

        if (!factorsData || factorsData.length === 0) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                    <div className="flex items-center mb-4">
                        <Activity className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-500">
                            <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No factor analysis data available</p>
                            <p className="text-xs mt-2">Data received: {JSON.stringify(chartData)}</p>
                        </div>
                    </div>
                </div>
            );
        }

        const processedData = factorsData.map(item => ({
            factor: item.factor || item.name || 'Unknown Factor',
            impact: Number(item.average_impact || item.impact || item.contribution_percentage || 0),
            impactLevel: item.impact_level || 'Medium',
            explanation: item.explanation || item.description || 'Factor analysis'
        }));

        const maxImpact = Math.max(...processedData.map(item => item.impact));

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Activity className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Top {processedData.length}
                    </span>
                </div>

                <div className="space-y-4">
                    {processedData.slice(0, 8).map((item, index) => {
                        const percentage = maxImpact > 0 ? (item.impact / maxImpact) * 100 : 0;

                        const impactColors = {
                            'High': {
                                bg: 'bg-red-500',
                                text: 'text-red-600',
                                bgLight: 'bg-red-100',
                                border: 'border-red-200',
                                gradient: 'from-red-400 to-red-600'
                            },
                            'Medium': {
                                bg: 'bg-yellow-500',
                                text: 'text-yellow-600',
                                bgLight: 'bg-yellow-100',
                                border: 'border-yellow-200',
                                gradient: 'from-yellow-400 to-yellow-600'
                            },
                            'Low': {
                                bg: 'bg-green-500',
                                text: 'text-green-600',
                                bgLight: 'bg-green-100',
                                border: 'border-green-200',
                                gradient: 'from-green-400 to-green-600'
                            }
                        };

                        const colors = impactColors[item.impactLevel] || impactColors.Medium;

                        return (
                            <div key={index} className="group hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center flex-1">
                                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-white font-bold text-sm mr-3 group-hover:scale-110 transition-transform">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-gray-900 truncate">
                                                {item.factor}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {item.explanation}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4 flex flex-col items-end">
                                        <div className="text-xl font-bold text-indigo-600 mb-1">
                                            {(item.impact * 100).toFixed(1)}%
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors.text} ${colors.bgLight} ${colors.border}`}>
                                            {item.impactLevel}
                                        </span>
                                    </div>
                                </div>

                                {/* Visual impact bar */}
                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out shadow-sm`}
                                            style={{
                                                width: `${Math.min(100, Math.max(5, percentage))}%`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="absolute right-0 top-0 mt-4 text-xs text-gray-400">
                                        {percentage.toFixed(0)}% of max
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /**
     * FIXED: Summary insights component with safe data handling
     */
    const SummaryInsightsCard = ({ data: insightsData }) => {
        const summaryInsights = safeExtractData(insightsData, 'summary_insights', null);

        if (!summaryInsights) return null;

        const trendDirection = safeExtractString(summaryInsights, 'trend_direction', 'stable');
        const riskStability = safeExtractString(summaryInsights, 'risk_stability', 'stable');

        return (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-semibold text-indigo-900">Key Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Risk Trend:</span>
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${trendDirection === 'increasing' ? 'bg-red-500' :
                                    trendDirection === 'decreasing' ? 'bg-green-500' :
                                        'bg-yellow-500'
                                    }`}></div>
                                <span className={`text-sm font-bold capitalize ${trendDirection === 'increasing' ? 'text-red-600' :
                                    trendDirection === 'decreasing' ? 'text-green-600' :
                                        'text-yellow-600'
                                    }`}>
                                    {trendDirection}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Risk Stability:</span>
                            <span className={`text-sm font-bold capitalize ${riskStability === 'volatile' ? 'text-red-600' :
                                riskStability === 'moderate' ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                {riskStability}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // REPLACE the renderAnalyticsContent function in your AnalyticsTab.jsx with this FIXED version:

    const renderAnalyticsContent = () => {
        if (!data || data.isEmpty) {
            return renderNoData();
        }

        console.log('[AnalyticsTab] Rendering with data:', data);

        // FIXED: Direct data extraction without complex path traversal
        const keyMetrics = data.key_metrics || {};
        const totalPredictions = keyMetrics.total_predictions || data.totalPredictions || 0;
        const avgRiskScore = keyMetrics.average_risk_score || 0;
        const healthScore = keyMetrics.health_score || (100 - (avgRiskScore * 100));

        // FIXED: Direct array extractions
        const riskDistribution = keyMetrics.risk_distribution || data.riskDistribution || [];
        const trendAnalysis = data.risk_trend_analysis || data.monthlyTrends || [];
        const factorContribution = data.factor_contribution || data.topRiskFactors || [];

        // Add console logs to debug
        console.log('📊 Risk Distribution:', riskDistribution);
        console.log('📈 Trend Analysis:', trendAnalysis);
        console.log('🔍 Factor Contribution:', factorContribution);

        return (
            <div className="space-y-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-blue-100 mb-1">Total Predictions</h3>
                                <p className="text-3xl font-bold">{totalPredictions}</p>
                                <p className="text-xs text-blue-200 mt-1">Analytics available</p>
                            </div>
                            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                                <Target className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-green-100 mb-1">Health Score</h3>
                                <p className="text-3xl font-bold">{healthScore.toFixed(0)}</p>
                                <p className="text-xs text-green-200 mt-1">out of 100</p>
                            </div>
                            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <span className="text-2xl">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-orange-100 mb-1">Risk Score</h3>
                                <p className="text-3xl font-bold">{(avgRiskScore * 100).toFixed(1)}%</p>
                                <p className="text-xs text-orange-200 mt-1">Average risk</p>
                            </div>
                            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-purple-100 mb-1">Data Quality</h3>
                                <p className="text-2xl font-bold">{extractedDataQuality}</p>
                                <p className="text-xs text-purple-200 mt-1">Analysis grade</p>
                            </div>
                            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <span className="text-xl">★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Risk Distribution Chart */}
                    <RiskDistributionChart
                        data={riskDistribution}
                        title="Risk Distribution Analysis"
                    />

                    {/* Trends Chart */}
                    <TrendsChart
                        data={trendAnalysis}
                        title="Performance Trends"
                    />
                </div>

                {/* Factor Analysis - Full Width */}
                <FactorsChart
                    data={factorContribution}
                    title="Top Risk Factors Analysis"
                />

                {/* Summary Insights */}
                <SummaryInsightsCard data={data} />

                {/* Peer Comparison */}
                {data.peer_comparison && Object.keys(data.peer_comparison).length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Peer Comparison</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.peer_comparison.overall && (
                                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-3">Overall Performance</h4>
                                    <div className="text-3xl font-bold text-blue-800 mb-2">
                                        {safeExtractValue(data.peer_comparison.overall, 'percentile', 50)}%
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        You perform <strong className="text-blue-900">
                                            {safeExtractString(data.peer_comparison.overall, 'comparison', 'average')}
                                        </strong> than this percentile of peers
                                    </p>
                                </div>
                            )}
                            {data.peer_comparison.industry_benchmark && (
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <h4 className="font-semibold text-green-900 mb-3">Industry Benchmark</h4>
                                    <div className="text-2xl font-bold text-green-800 mb-2">
                                        {safeExtractString(data.peer_comparison.industry_benchmark, 'performance_rating', 'Good')}
                                    </div>
                                    <p className="text-sm text-green-700">Performance Rating</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };
    /**
     * Main render
     */
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            <BarChart2 className="h-8 w-8 mr-3" />
                            Financial Analytics Dashboard
                        </h2>
                        <p className="text-indigo-100 mt-2">
                            Advanced insights and comprehensive data visualization for strategic decisions
                        </p>
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={handleRefresh}
                            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all flex items-center space-x-2 text-sm font-medium hover:scale-105 transform"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">
                                {isLoading ? 'Refreshing...' : 'Refresh Data'}
                            </span>
                        </button>
                    )}
                </div>

                {lastRefresh && (
                    <div className="mt-4 flex items-center text-indigo-200 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Last updated: {lastRefresh}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-8 min-h-[700px] bg-gray-50">
                {!isAuthenticated ? renderAuthRequired() :
                    isLoading ? renderLoading() :
                        error ? renderError() :
                            renderAnalyticsContent()}
            </div>

            {/* Enhanced Footer */}
            {hasData && !isLoading && (
                <div className="px-8 py-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                <span>Live Analytics</span>
                            </div>
                            <span>🤖 ML-Powered</span>
                            <span>📊 Real-time Data</span>
                            <span>⚡ Advanced Insights</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                            <span>Quality: <strong>{extractedDataQuality}</strong></span>
                            <div className="px-3 py-1 bg-white/10 rounded-full">
                                FinDistress AI Analytics
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsTab;
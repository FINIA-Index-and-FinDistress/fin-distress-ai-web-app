import React, { useState, useCallback, useEffect } from 'react';
import { Lightbulb, RefreshCw, Shield, AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Target, Brain, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import usePredictionData from "../hooks/usePredictionData";

/**
 * FIXED Insights Tab with proper data handling and no object rendering
 */
const InsightsTab = () => {
    const { data, isLoading, error, refreshData, hasData, dataQuality } = usePredictionData('insights');
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
            addNotification('Insights data refreshed successfully', 'success');
        } catch (error) {
            addNotification('Failed to refresh insights data', 'error');
        }
    }, [refreshData, addNotification]);

    /**
     * Debug effect to log data structure
     */
    useEffect(() => {
        if (data) {
            console.log('[InsightsTab] Current data structure:', data);
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

    /**
     * Safe object extraction helper
     */
    const safeExtractObject = useCallback((data, path, fallback = null) => {
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
            return current && typeof current === 'object' ? current : fallback;
        } catch (e) {
            return fallback;
        }
    }, []);

    /**
     * Render authentication requirement notice
     */
    const renderAuthRequired = () => (
        <div className="flex justify-center items-center h-96">
            <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-200 max-w-md">
                <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Authentication Required</h3>
                <p className="text-blue-700 mb-4">
                    Please sign in to access personalized AI insights and recommendations.
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
                    <Brain className="absolute inset-0 m-auto h-6 w-6 text-indigo-600 animate-pulse" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Generating AI Insights</p>
                <p className="text-sm text-gray-500">Analyzing your data for personalized recommendations...</p>
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
                <h3 className="text-lg font-semibold text-red-800 mb-2">Insights Unavailable</h3>
                <p className="text-red-700 text-sm mb-4">
                    {typeof error === 'string' ? error : error?.message || 'Failed to load insights'}
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
                <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Insights Available</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Make some predictions to generate personalized AI insights and recommendations.
                </p>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    disabled={isLoading}
                >
                    Check for Insights
                </button>
            </div>
        </div>
    );

    /**
     * FIXED: Recommendations Component with safe data handling
     */
    const RecommendationsSection = ({ recommendations }) => {
        const safeRecommendations = safeExtractData({ recommendations }, 'recommendations', []);

        if (!safeRecommendations || safeRecommendations.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-lg border p-6">
                    <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h3>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p>No recommendations available</p>
                    </div>
                </div>
            );
        }

        const priorityColors = {
            'Critical': 'border-red-500 bg-red-50',
            'High': 'border-orange-500 bg-orange-50',
            'Medium': 'border-yellow-500 bg-yellow-50',
            'Low': 'border-green-500 bg-green-50'
        };

        const priorityIcons = {
            'Critical': <AlertCircle className="h-5 w-5 text-red-600" />,
            'High': <AlertTriangle className="h-5 w-5 text-orange-600" />,
            'Medium': <CheckCircle className="h-5 w-5 text-yellow-600" />,
            'Low': <CheckCircle className="h-5 w-5 text-green-600" />
        };

        const priorityBadges = {
            'Critical': 'bg-red-100 text-red-800 border border-red-200',
            'High': 'bg-orange-100 text-orange-800 border border-orange-200',
            'Medium': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            'Low': 'bg-green-100 text-green-800 border border-green-200'
        };

        return (
            <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center mb-6">
                    <Target className="h-6 w-6 text-indigo-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h3>
                    <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {safeRecommendations.length}
                    </span>
                </div>
                <div className="space-y-4">
                    {safeRecommendations.map((rec, index) => {
                        const title = safeExtractString(rec, 'title', `Recommendation ${index + 1}`);
                        const priority = safeExtractString(rec, 'priority', 'Medium');
                        const action = safeExtractString(rec, 'action', 'Action details not available');
                        const reason = safeExtractString(rec, 'reason', 'Reason not specified');
                        const implementation = safeExtractString(rec, 'implementation', '');
                        const expectedImpact = safeExtractString(rec, 'expected_impact', '');

                        return (
                            <div
                                key={index}
                                className={`border-l-4 p-5 rounded-r-lg transition-all hover:shadow-md ${priorityColors[priority] || priorityColors.Medium}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        {priorityIcons[priority] || priorityIcons.Medium}
                                        <h4 className="font-semibold text-gray-900 ml-2 text-lg">{title}</h4>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${priorityBadges[priority] || priorityBadges.Medium}`}>
                                        {priority} Priority
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="bg-white/70 p-3 rounded-lg border">
                                        <p className="font-medium text-gray-800 mb-1">Action Required:</p>
                                        <p className="text-gray-700">{action}</p>
                                    </div>

                                    <div className="bg-white/70 p-3 rounded-lg border">
                                        <p className="font-medium text-gray-800 mb-1">Why This Matters:</p>
                                        <p className="text-gray-700">{reason}</p>
                                    </div>

                                    {implementation && (
                                        <div className="bg-white/70 p-3 rounded-lg border">
                                            <p className="font-medium text-gray-800 mb-1">Implementation Steps:</p>
                                            <p className="text-gray-700">{implementation}</p>
                                        </div>
                                    )}

                                    {expectedImpact && (
                                        <div className="bg-white/70 p-3 rounded-lg border border-green-200">
                                            <p className="font-medium text-green-800 mb-1">Expected Impact:</p>
                                            <p className="text-green-700">{expectedImpact}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /**
     * FIXED: Risk Alerts Component with safe data handling
     */
    const RiskAlertsSection = ({ alerts }) => {
        const safeAlerts = safeExtractData({ alerts }, 'alerts', []);

        if (!safeAlerts || safeAlerts.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-lg border p-6">
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Risk Alerts</h3>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <p className="text-green-600 font-medium">No active risk alerts</p>
                        <p className="text-sm text-gray-500 mt-1">Your risk profile is within acceptable ranges</p>
                    </div>
                </div>
            );
        }

        const severityColors = {
            'Critical': 'bg-red-100 border-red-500 text-red-900',
            'High': 'bg-orange-100 border-orange-500 text-orange-900',
            'Medium': 'bg-yellow-100 border-yellow-500 text-yellow-900',
            'Low': 'bg-blue-100 border-blue-500 text-blue-900'
        };

        const severityIcons = {
            'Critical': <AlertCircle className="h-5 w-5 text-red-600" />,
            'High': <AlertTriangle className="h-5 w-5 text-orange-600" />,
            'Medium': <AlertCircle className="h-5 w-5 text-yellow-600" />,
            'Low': <AlertCircle className="h-5 w-5 text-blue-600" />
        };

        return (
            <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center mb-6">
                    <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Risk Alerts</h3>
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        {safeAlerts.length} Active
                    </span>
                </div>
                <div className="space-y-4">
                    {safeAlerts.map((alert, index) => {
                        const title = safeExtractString(alert, 'title', `Risk Alert ${index + 1}`);
                        const severity = safeExtractString(alert, 'severity', 'Medium');
                        const message = safeExtractString(alert, 'message', 'Alert details not available');
                        const impact = safeExtractString(alert, 'impact', 'Impact assessment not available');
                        const action = safeExtractString(alert, 'action', 'No action specified');
                        const timeline = safeExtractString(alert, 'timeline', 'Timeline not specified');

                        return (
                            <div
                                key={index}
                                className={`border-l-4 p-5 rounded-r-lg transition-all hover:shadow-md ${severityColors[severity] || severityColors.Medium}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        {severityIcons[severity] || severityIcons.Medium}
                                        <h4 className="font-semibold ml-2 text-lg">{title}</h4>
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/70 border">
                                        {severity} Risk
                                    </span>
                                </div>
                                <p className="text-sm mb-4 font-medium">{message}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div className="bg-white/70 p-3 rounded border">
                                        <p className="font-semibold mb-1">Impact:</p>
                                        <p>{impact}</p>
                                    </div>
                                    <div className="bg-white/70 p-3 rounded border">
                                        <p className="font-semibold mb-1">Action Required:</p>
                                        <p>{action}</p>
                                    </div>
                                    <div className="bg-white/70 p-3 rounded border">
                                        <p className="font-semibold mb-1">Timeline:</p>
                                        <p className="font-medium text-red-600">{timeline}</p>
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
     * FIXED: Market Context Component with safe data handling
     */
    const MarketContextSection = ({ marketContext }) => {
        const safeMarketContext = safeExtractData({ marketContext }, 'marketContext', []);

        if (!safeMarketContext || safeMarketContext.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-lg border p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Market Context</h3>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p>No market context data available</p>
                    </div>
                </div>
            );
        }

        const impactColors = {
            'High': 'bg-red-100 text-red-800 border-red-200',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Low': 'bg-green-100 text-green-800 border-green-200'
        };

        return (
            <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center mb-6">
                    <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Market Context</h3>
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {safeMarketContext.length} Trends
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safeMarketContext.map((context, index) => {
                        const trend = safeExtractString(context, 'trend', `Market Trend ${index + 1}`);
                        const impact = safeExtractString(context, 'impact', 'Medium');
                        const description = safeExtractString(context, 'description', 'Description not available');
                        const recommendation = safeExtractString(context, 'recommendation', 'No recommendation available');
                        const source = safeExtractString(context, 'source', 'Source not specified');

                        return (
                            <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900 text-lg">{trend}</h4>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${impactColors[impact] || impactColors.Medium}`}>
                                        {impact} Impact
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{description}</p>
                                <div className="space-y-2 text-xs">
                                    <div className="bg-white p-3 rounded border">
                                        <p className="font-semibold text-gray-800 mb-1">📋 Recommendation:</p>
                                        <p className="text-gray-700">{recommendation}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                        <p className="font-medium text-gray-600">
                                            <span className="text-gray-500">Source:</span> {source}
                                        </p>
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
     * FIXED: Key Factors Analysis Component with safe data handling
     */
    const KeyFactorsSection = ({ factors }) => {
        const safeFactors = safeExtractData({ factors }, 'factors', []);

        if (!safeFactors || safeFactors.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-lg border p-6">
                    <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Key Risk Factors Analysis</h3>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p>No risk factors analysis available</p>
                    </div>
                </div>
            );
        }

        const levelColors = {
            'High': 'bg-red-100 text-red-800 border-red-200',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Low': 'bg-green-100 text-green-800 border-green-200'
        };

        return (
            <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center mb-6">
                    <Zap className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Key Risk Factors Analysis</h3>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Top {safeFactors.length}
                    </span>
                </div>
                <div className="space-y-4">
                    {safeFactors.map((factor, index) => {
                        const factorName = safeExtractString(factor, 'factor', `Factor ${index + 1}`);
                        const impact = safeExtractValue(factor, 'impact', 0);
                        const level = safeExtractString(factor, 'level', 'Medium');
                        const explanation = safeExtractString(factor, 'explanation', 'Factor analysis not available');
                        const frequency = safeExtractValue(factor, 'frequency', 0);

                        return (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-lg font-semibold text-gray-900">{factorName}</div>
                                            <div className="text-sm text-gray-600 mt-1">{explanation}</div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-xl font-bold text-blue-600 mb-1">
                                            {(impact * 100).toFixed(1)}%
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${levelColors[level] || levelColors.Medium}`}>
                                            {level} Impact
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Impact Level</span>
                                        <span>Frequency: {frequency || 'N/A'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${level === 'High' ? 'bg-red-500' :
                                                    level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(100, Math.max(10, impact * 100))}%` }}
                                        ></div>
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
     * FIXED: Insights Summary Component with safe data handling
     */
    const InsightsSummarySection = ({ summary }) => {
        const safeSummary = safeExtractObject({ summary }, 'summary', null);

        if (!safeSummary) return null;

        const alertLevelColors = {
            'Critical': 'bg-red-100 text-red-800 border-red-200',
            'High': 'bg-orange-100 text-orange-800 border-orange-200',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Low': 'bg-green-100 text-green-800 border-green-200',
            'None': 'bg-gray-100 text-gray-800 border-gray-200',
            'Error': 'bg-red-100 text-red-800 border-red-200'
        };

        const totalInsights = safeExtractValue(safeSummary, 'total_insights', 0);
        const criticalRisks = safeExtractValue(safeSummary, 'critical_risks', 0);
        const recommendations = safeExtractValue(safeSummary, 'recommendations', 0);
        const alertLevel = safeExtractString(safeSummary, 'alert_level', 'None');
        const overallRiskTrend = safeExtractString(safeSummary, 'overall_risk_trend', '');
        const healthScore = safeExtractValue(safeSummary, 'health_score', 0);

        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-blue-900">AI Insights Summary</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                        <div className="text-3xl font-bold text-blue-900 mb-1">{totalInsights}</div>
                        <div className="text-sm text-blue-700">Total Insights</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                        <div className="text-3xl font-bold text-red-900 mb-1">{criticalRisks}</div>
                        <div className="text-sm text-red-700">Critical Risks</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                        <div className="text-3xl font-bold text-green-900 mb-1">{recommendations}</div>
                        <div className="text-sm text-green-700">Recommendations</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
                        <div className={`text-xl font-bold px-3 py-2 rounded-lg border ${alertLevelColors[alertLevel] || alertLevelColors.None}`}>
                            {alertLevel}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">Alert Level</div>
                    </div>
                </div>

                {(overallRiskTrend || healthScore > 0) && (
                    <div className="mt-6 p-4 bg-white rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {overallRiskTrend && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Risk Trend:</span>
                                    <div className="flex items-center">
                                        <TrendingUp className={`h-4 w-4 mr-1 ${overallRiskTrend === 'increasing' ? 'text-red-600' :
                                                overallRiskTrend === 'decreasing' ? 'text-green-600' :
                                                    'text-gray-600'
                                            }`} />
                                        <span className={`text-sm font-medium capitalize ${overallRiskTrend === 'increasing' ? 'text-red-600' :
                                                overallRiskTrend === 'decreasing' ? 'text-green-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {overallRiskTrend}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {healthScore > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Health Score:</span>
                                    <span className="text-sm font-bold text-blue-600">{healthScore}/100</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /**
     * FIXED: Render insights content with safe data handling
     */
    const renderInsightsContent = () => {
        if (!data || data.isEmpty) {
            return renderNoData();
        }

        console.log('[InsightsTab] Rendering with data:', data);

        // Safe data extraction
        const actionableRecommendations = safeExtractData(data, 'actionable_recommendations',
            safeExtractData(data, 'recommendations', []));
        const riskAlerts = safeExtractData(data, 'risk_alerts', []);
        const marketContext = safeExtractData(data, 'market_context',
            safeExtractData(data, 'marketTrends', []));
        const keyFactorsAnalysis = safeExtractData(data, 'key_factors_analysis', []);
        const insightSummary = safeExtractObject(data, 'insight_summary', null);
        const keyInsights = safeExtractData(data, 'keyInsights', []);

        return (
            <div className="space-y-6">
                {/* Insights Summary */}
                <InsightsSummarySection summary={insightSummary} />

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Recommendations */}
                    <RecommendationsSection recommendations={actionableRecommendations} />

                    {/* Risk Alerts */}
                    <RiskAlertsSection alerts={riskAlerts} />

                    {/* Market Context and Key Factors Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <MarketContextSection marketContext={marketContext} />
                        <KeyFactorsSection factors={keyFactorsAnalysis} />
                    </div>
                </div>

                {/* Key Insights Text */}
                {keyInsights && keyInsights.length > 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200 p-6">
                        <div className="flex items-center mb-4">
                            <Lightbulb className="h-6 w-6 text-indigo-600 mr-2" />
                            <h3 className="text-xl font-semibold text-indigo-900">Key Insights</h3>
                        </div>
                        <div className="space-y-3">
                            {keyInsights.map((insight, index) => {
                                const insightText = typeof insight === 'string' ? insight :
                                    safeExtractString(insight, 'text', 'Insight not available');

                                return (
                                    <div key={index} className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                                        <div className="flex items-start">
                                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 mt-0.5 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-indigo-900 leading-relaxed">{insightText}</p>
                                        </div>
                                    </div>
                                );
                            })}
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
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            <Lightbulb className="h-8 w-8 mr-3" />
                            AI Insights
                        </h2>
                        <p className="text-purple-100 mt-2">
                            Personalized recommendations and market intelligence powered by advanced AI
                        </p>
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors flex items-center space-x-2 text-sm font-medium"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </span>
                        </button>
                    )}
                </div>

                {lastRefresh && (
                    <div className="mt-3 flex items-center text-purple-200 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Last updated: {lastRefresh}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-8 min-h-[600px]">
                {!isAuthenticated ? renderAuthRequired() :
                    isLoading ? renderLoading() :
                        error ? renderError() :
                            renderInsightsContent()}
            </div>

            {/* Footer */}
            {hasData && !isLoading && (
                <div className="px-8 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-200">
                    <div className="flex items-center justify-between text-sm text-purple-800">
                        <div className="flex items-center space-x-4">
                            <span>AI-Powered Analysis</span>
                            <span>Data-Driven Insights</span>
                            <span>Real-time Recommendations</span>
                            <span>Actionable Guidance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Quality: {dataQuality || 'Good'}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsightsTab;
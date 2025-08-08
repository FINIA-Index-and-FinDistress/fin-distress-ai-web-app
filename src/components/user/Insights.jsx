import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Insights = () => {
    const { getInsights, isAuthenticated } = useAuth();
    const [insightsData, setInsightsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadInsights();
        }
    }, [isAuthenticated]);

    const loadInsights = async () => {
        setIsLoading(true);
        try {
            const data = await getInsights();
            setInsightsData(data);
        } catch (error) {
            console.error('Failed to load insights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-8">
                    <div className="text-yellow-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg">Please sign in to view insights.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h1>
                <button
                    onClick={loadInsights}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Refresh Insights
                </button>
            </div>

            {insightsData ? (
                <div className="space-y-6">
                    {/* Key Insights */}
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <div className="flex items-center mb-4">
                            <div className="text-blue-500 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Key Insights</h2>
                        </div>
                        {insightsData.key_insights && insightsData.key_insights.length > 0 ? (
                            <ul className="space-y-3">
                                {insightsData.key_insights.map((insight, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-500 mr-3 mt-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="text-gray-700">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No specific insights available at this time.</p>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                        <div className="flex items-center mb-4">
                            <div className="text-green-500 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
                        </div>
                        {insightsData.recommendations && insightsData.recommendations.length > 0 ? (
                            <ul className="space-y-3">
                                {insightsData.recommendations.map((recommendation, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-3 mt-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <span className="text-gray-700">{recommendation}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No specific recommendations available at this time.</p>
                        )}
                    </div>

                    {/* Market Trends */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <div className="text-purple-500 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Market Trends</h2>
                        </div>
                        {insightsData.market_trends && insightsData.market_trends.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {insightsData.market_trends.map((trend, index) => (
                                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{trend.trend}</h3>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${trend.impact === 'High' ? 'bg-red-100 text-red-800' :
                                                    trend.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {trend.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                                        <div className="border-t pt-2">
                                            <p className="text-sm text-blue-600 font-medium">💡 {trend.recommendation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No market trends data available at this time.</p>
                        )}
                    </div>

                    {/* Risk Alerts */}
                    {insightsData.risk_alerts && insightsData.risk_alerts.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center mb-4">
                                <div className="text-red-500 mr-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Risk Alerts</h2>
                            </div>
                            <div className="space-y-3">
                                {insightsData.risk_alerts.map((alert, index) => (
                                    <div key={index} className={`p-4 rounded-lg border-l-4 ${alert.level === 'High' ? 'bg-red-50 border-red-500' :
                                            alert.level === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                                                'bg-blue-50 border-blue-500'
                                        }`}>
                                        <div className="flex items-start">
                                            <div className={`mr-3 mt-1 ${alert.level === 'High' ? 'text-red-500' :
                                                    alert.level === 'Medium' ? 'text-yellow-500' :
                                                        'text-blue-500'
                                                }`}>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{alert.message}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Action Required:</span> {alert.action}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Tips */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <div className="flex items-center mb-3">
                            <div className="text-blue-600 mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Pro Tips</h3>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li>• Regularly monitor your financial metrics to identify trends early</li>
                            <li>• Compare your risk factors with industry benchmarks</li>
                            <li>• Use multiple prediction scenarios to validate your analysis</li>
                            <li>• Consider external economic factors when interpreting results</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                    <p className="text-gray-600 mb-4">Start making predictions to generate personalized insights.</p>
                    <button
                        onClick={() => window.location.href = '/predict'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Make Your First Prediction
                    </button>
                </div>
            )}
        </div>
    );
};

export default Insights;
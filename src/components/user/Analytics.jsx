import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Analytics = () => {
    const { getAnalytics, isAuthenticated } = useAuth();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(30);

    useEffect(() => {
        if (isAuthenticated) {
            loadAnalytics();
        }
    }, [isAuthenticated, timeRange]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const data = await getAnalytics(timeRange);
            setAnalyticsData(data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
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
                    <p className="text-gray-600 text-lg">Please sign in to view analytics.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="timeRange" className="text-sm text-gray-600">Time Range:</label>
                    <select
                        id="timeRange"
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                    </select>
                </div>
            </div>

            {analyticsData ? (
                <div className="space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Predictions</h3>
                                    <p className="text-3xl font-bold text-blue-600">{analyticsData.total_predictions}</p>
                                </div>
                                <div className="text-blue-500">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Success Rate</h3>
                                    <p className="text-3xl font-bold text-green-600">{analyticsData.success_rate}%</p>
                                </div>
                                <div className="text-green-500">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Risk Score</h3>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {(analyticsData.average_risk_score * 100).toFixed(1)}%
                                    </p>
                                </div>
                                <div className="text-orange-500">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Distribution Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {analyticsData.risk_distribution.map((item) => (
                                <div key={item.risk_level} className="text-center p-4 border rounded-lg">
                                    <div className={`text-2xl font-bold mb-2 ${item.risk_level === 'High' ? 'text-red-600' :
                                            item.risk_level === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                        }`}>
                                        {item.count}
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900">{item.risk_level} Risk</h4>
                                    <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                                    <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
                                        <div
                                            className={`h-2 rounded-full ${item.risk_level === 'High' ? 'bg-red-600' :
                                                    item.risk_level === 'Medium' ? 'bg-yellow-600' :
                                                        'bg-green-600'
                                                }`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    {analyticsData.monthly_trends && analyticsData.monthly_trends.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Month
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Predictions
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Average Risk
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analyticsData.monthly_trends.map((trend, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {trend.month}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {trend.predictions}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${trend.average_risk > 0.7 ? 'bg-red-100 text-red-800' :
                                                            trend.average_risk > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                        }`}>
                                                        {(trend.average_risk * 100).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Top Risk Factors */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Risk Factors</h3>
                        <div className="space-y-4">
                            {analyticsData.top_risk_factors.map((factor, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{factor.factor}</span>
                                            <span className="text-sm text-gray-500">{(factor.impact * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${factor.impact * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Available</h3>
                    <p className="text-gray-600">Start making predictions to see your analytics data here.</p>
                </div>
            )}
        </div>
    );
};

export default Analytics;
// MLInsightsCard.jsx - Enhanced insights card
import React from 'react';
import { LayoutDashboard, TrendingUp, TrendingDown, Target, Users, Brain } from 'lucide-react';
import ChartCard from './AnalyticsTab/ChartCard';

const MLInsightsCard = ({ data }) => {
    if (!data) return null;

    const {
        predictionsMade,
        accuracyRate,
        companiesAnalyzed,
        riskFactors,
        overallDistressRate,
        userDistressRate,
        performanceVsMarket,
        modelConfidence
    } = data;

    const isUserRiskier = userDistressRate > overallDistressRate;
    const riskDifference = Math.abs(userDistressRate - overallDistressRate);
    const riskDifferencePercent = (riskDifference).toFixed(1);

    // Performance indicators
    const getPerformanceColor = (performance) => {
        switch (performance) {
            case 'Excellent': return 'text-green-600 bg-green-50';
            case 'Good': return 'text-blue-600 bg-blue-50';
            case 'Average': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-red-600 bg-red-50';
        }
    };

    const getConfidenceLevel = (rate) => {
        if (rate >= 95) return { label: 'Excellent', color: 'text-green-600' };
        if (rate >= 90) return { label: 'Very Good', color: 'text-blue-600' };
        if (rate >= 85) return { label: 'Good', color: 'text-yellow-600' };
        return { label: 'Needs Improvement', color: 'text-red-600' };
    };

    const confidenceLevel = getConfidenceLevel(accuracyRate);

    return (
        <ChartCard title="ML Model Performance" icon={LayoutDashboard}>
            <div className="flex flex-col h-full">
                {/* Header Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <Target className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-indigo-800">Predictions Made</p>
                        <p className="text-2xl font-bold text-indigo-600">{predictionsMade.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <Brain className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-green-800">Model Accuracy</p>
                        <p className="text-2xl font-bold text-green-600">{accuracyRate.toFixed(1)}%</p>
                        <p className={`text-xs font-medium ${confidenceLevel.color}`}>{confidenceLevel.label}</p>
                    </div>
                </div>

                {/* Analysis Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Analysis Overview
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Companies Analyzed</p>
                            <p className="font-bold text-gray-800">{companiesAnalyzed.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Risk Factors</p>
                            <p className="font-bold text-gray-800">{riskFactors}</p>
                        </div>
                    </div>
                </div>

                {/* Risk Comparison */}
                <div className="flex-1 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Risk Rate Comparison</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                            <p className="text-blue-700 text-sm font-medium">Your Predictions</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">{userDistressRate.toFixed(1)}%</p>
                            <p className="text-xs text-blue-500 mt-1">Average Distress Rate</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                            <p className="text-gray-600 text-sm font-medium">Market Benchmark</p>
                            <p className="text-3xl font-bold text-gray-700 mt-1">{overallDistressRate.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500 mt-1">Training Dataset</p>
                        </div>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                        {isUserRiskier ? (
                            <TrendingUp className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                        ) : (
                            <TrendingDown className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-gray-800">Performance vs Market:</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(performanceVsMarket)}`}>
                                    {performanceVsMarket}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Your predictions show a distress rate that is{' '}
                                <span className={`font-bold ${isUserRiskier ? 'text-red-600' : 'text-green-600'}`}>
                                    {riskDifferencePercent}% {isUserRiskier ? 'higher' : 'lower'}
                                </span>{' '}
                                than the overall market benchmark.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {isUserRiskier
                                    ? 'Consider reviewing risk management strategies for your portfolio.'
                                    : 'Your portfolio demonstrates strong risk management practices.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ChartCard>
    );
};

export default MLInsightsCard;
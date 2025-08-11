import React, { useMemo } from 'react';
import { TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';

// Chart Components
import { DistressDistributionChart } from "./DistressDistributionChart";
import TopFeatureImportanceChart from './TopFeatureImportanceChart';
import PredictionTrendsChart from './PredictionTrendsChart';
import SectorRiskAnalysisChart from './SectorRiskAnalysisChart';
import OverallDistressDistributionChart from './OverallDistressDistributionChart';
import RiskFactorAssessmentChart from './RiskFactorAssessmentChart';

/**
 * Professional dashboard charts container for FinDistress AI
 * Orchestrates all analytics visualizations with proper data handling
 */

const DashboardCharts = ({ data }) => {
    /**
     * Validate and process dashboard data
     */
    const processedData = useMemo(() => {
        if (!data) return null;

        // ✅ Transform risk_distribution into array format for chart
        const riskDistRaw = data.risk_distribution || {};
        const distressDistribution = Object.entries(riskDistRaw).map(([key, value]) => ({
            name: key,
            value: value.count,
            percentage: value.percentage,
        }));

        return {
            // ✅ Transformed data for DistressDistributionChart
            distressDistribution,

            // Market-wide distribution from training data
            overallDistressDistribution: data.overallDistressDistribution || [],

            // Feature importance for ML insights
            topFeatures: data.topFeatures || [],

            // Prediction trends over time
            predictionTrends: data.predictionTrends || [],

            // Sector analysis breakdown
            sectorAnalysis: data.sectorAnalysis || [],

            // Comparative risk factors for radar chart
            comparativeRiskFactors: data.comparativeRiskFactors || [],

            // ML insights and metrics
            mlInsights: data.mlInsights || {},

            // Data quality indicators
            dataQuality: data.dataQuality || 'Unknown',
            isEmpty: data.isEmpty || false,
            lastUpdated: data.lastUpdated || new Date().toISOString()
        };
    }, [data]);

    /**
     * Calculate dashboard summary statistics
     */
    const dashboardStats = useMemo(() => {
        if (!processedData) return null;

        const stats = {
            totalPredictions: processedData.mlInsights.predictions_made || 0,
            companiesAnalyzed: processedData.mlInsights.companies_analyzed || 0,
            accuracyRate: processedData.mlInsights.accuracy_rate || 0,
            userDistressRate: processedData.mlInsights.userDistressRate || 0,
            marketDistressRate: processedData.mlInsights.overallDistressRate || 0
        };

        // Calculate trend direction
        stats.trendDirection = stats.userDistressRate > stats.marketDistressRate ? 'higher' : 'lower';
        stats.trendPercentage = Math.abs(
            ((stats.userDistressRate - stats.marketDistressRate) / stats.marketDistressRate) * 100
        ).toFixed(1);

        return stats;
    }, [processedData]);

    /**
     * Render no data state
     */
    if (!processedData || processedData.isEmpty) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 max-w-md">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Dashboard Data</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Dashboard charts will appear once prediction and market data becomes available.
                    </p>
                    <p className="text-xs text-gray-500">
                        Start by making predictions to populate analytics data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Dashboard Summary */}
            {dashboardStats && dashboardStats.totalPredictions > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Total Predictions</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {dashboardStats.totalPredictions.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500 opacity-75" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700">Model Accuracy</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {(dashboardStats.accuracyRate * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700">Companies Analyzed</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {dashboardStats.companiesAnalyzed.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">#</span>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-gradient-to-r p-4 rounded-xl border ${dashboardStats.trendDirection === 'higher'
                            ? 'from-orange-50 to-red-50 border-orange-200'
                            : 'from-green-50 to-emerald-50 border-green-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${dashboardStats.trendDirection === 'higher' ? 'text-orange-700' : 'text-green-700'
                                    }`}>
                                    vs Market
                                </p>
                                <p className={`text-2xl font-bold ${dashboardStats.trendDirection === 'higher' ? 'text-orange-900' : 'text-green-900'
                                    }`}>
                                    {dashboardStats.trendDirection === 'higher' ? '+' : '-'}{dashboardStats.trendPercentage}%
                                </p>
                            </div>
                            <AlertCircle className={`h-8 w-8 opacity-75 ${dashboardStats.trendDirection === 'higher' ? 'text-orange-500' : 'text-green-500'
                                }`} />
                        </div>
                    </div>
                </div>
            )}

            {/* Distribution Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="min-h-[520px]">
                    <DistressDistributionChart
                        data={processedData.distressDistribution}
                        title="User Prediction Distribution"
                        subtitle="Analysis of your prediction results"
                    />
                </div>
                <div className="min-h-[520px]">
                    <OverallDistressDistributionChart
                        data={processedData.overallDistressDistribution}
                        title="Market Benchmark Distribution"
                        subtitle="Training data market overview"
                    />
                </div>
            </div>

            {/* Trends Chart - Full Width */}
            {processedData.predictionTrends?.length > 0 && (
                <div className="w-full min-h-[480px]">
                    <PredictionTrendsChart
                        data={processedData.predictionTrends}
                        title="Financial Health Trends"
                        subtitle="Historical analysis of prediction patterns"
                    />
                </div>
            )}

            {/* Analysis Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {processedData.sectorAnalysis?.length > 0 && (
                    <div className="min-h-[620px]">
                        <SectorRiskAnalysisChart
                            data={processedData.sectorAnalysis}
                            title="Industry Sector Analysis"
                            subtitle="Risk distribution across sectors"
                        />
                    </div>
                )}

                {processedData.topFeatures?.length > 0 && (
                    <div className="min-h-[620px]">
                        <TopFeatureImportanceChart
                            data={processedData.topFeatures}
                            title="Key Risk Predictors"
                            subtitle="ML model feature importance"
                        />
                    </div>
                )}
            </div>

            {/* Risk Assessment Chart - Full Width */}
            {processedData.comparativeRiskFactors?.length > 0 && (
                <div className="w-full min-h-[620px]">
                    <RiskFactorAssessmentChart
                        data={processedData.comparativeRiskFactors}
                        title="Comparative Risk Assessment"
                        subtitle="Your performance vs market benchmarks"
                    />
                </div>
            )}

            {/* Data Quality Footer */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-600">
                        <span>Data Quality: <strong>{processedData.dataQuality}</strong></span>
                        <span>Last Updated: {new Date(processedData.lastUpdated).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                        <span>Powered by Advanced ML Analytics</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Target, Shield, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional risk factor assessment chart for comparative analysis
 * Shows user performance vs market benchmarks using radar visualization
 */

const RiskFactorAssessmentChart = ({
    data,
    title = "Comparative Risk Assessment",
    subtitle = "Your performance vs market benchmarks"
}) => {
    /**
     * Process and validate risk factor data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], isEmpty: true, riskInsights: null };
        }

        // Process comparative risk data
        const chartData = data.map(item => ({
            factor: (item.factor || 'Unknown Factor').replace(/_/g, ' '),
            current: Math.max(0, Math.min(1, Number(item.current || item.user_avg || 0))),
            optimal: Math.max(0, Math.min(1, Number(item.optimal || item.training_avg || 0))),
            risk: item.risk || 'Medium',
            difference: Number(item.difference || 0),
            recommendation: item.recommendation || 'Monitor this factor'
        })).slice(0, 12); // Limit to 12 factors for readability

        // Calculate risk insights
        const riskInsights = calculateRiskInsights(chartData);

        return {
            chartData,
            isEmpty: chartData.length === 0,
            riskInsights
        };
    }, [data]);

    /**
     * Calculate comprehensive risk insights
     */
    function calculateRiskInsights(data) {
        if (data.length === 0) return null;

        const highRiskFactors = data.filter(item => item.risk === 'High').length;
        const mediumRiskFactors = data.filter(item => item.risk === 'Medium').length;
        const lowRiskFactors = data.filter(item => item.risk === 'Low').length;

        const avgUserPerformance = data.reduce((sum, item) => sum + item.current, 0) / data.length;
        const avgMarketPerformance = data.reduce((sum, item) => sum + item.optimal, 0) / data.length;

        const overallPerformance = avgUserPerformance < avgMarketPerformance ? 'Below Market' :
            avgUserPerformance > avgMarketPerformance ? 'Above Market' : 'At Market';

        const performanceGap = ((avgUserPerformance - avgMarketPerformance) / avgMarketPerformance) * 100;

        // Find top risk areas
        const topRisks = data.filter(item => item.risk === 'High')
            .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
            .slice(0, 3);

        // Find top strengths  
        const topStrengths = data.filter(item => item.risk === 'Low')
            .sort((a, b) => (b.current - b.optimal) - (a.current - a.optimal))
            .slice(0, 3);

        return {
            highRiskFactors,
            mediumRiskFactors,
            lowRiskFactors,
            avgUserPerformance: (avgUserPerformance * 100).toFixed(1),
            avgMarketPerformance: (avgMarketPerformance * 100).toFixed(1),
            overallPerformance,
            performanceGap: performanceGap.toFixed(1),
            topRisks,
            topStrengths,
            totalFactors: data.length
        };
    }

    /**
     * Enhanced radar tooltip
     */
    const RadarTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const dataPoint = processedData.chartData.find(d => d.factor === label);
        if (!dataPoint) return null;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg max-w-xs">
                <p className="font-semibold text-gray-800 mb-3">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600">{entry.name}:</span>
                        </div>
                        <span className="font-semibold" style={{ color: entry.color }}>
                            {(entry.value * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
                <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Risk Level:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${dataPoint.risk === 'High' ? 'bg-red-100 text-red-700' :
                                dataPoint.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                            }`}>
                            {dataPoint.risk}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">
                        {dataPoint.recommendation}
                    </p>
                </div>
            </div>
        );
    };

    /**
     * Render empty state
     */
    if (processedData.isEmpty) {
        return (
            <ChartCard title={title} subtitle={subtitle} icon={Target}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Risk Data</p>
                        <p className="text-sm text-gray-500">
                            Risk factor comparison will appear after generating predictions
                        </p>
                    </div>
                </div>
            </ChartCard>
        );
    }

    const { chartData, riskInsights } = processedData;

    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            icon={Target}
            dataCount={chartData.length}
            exportable={true}
            expandable={true}
        >
            <div className="flex flex-col h-full">
                {/* Risk Summary */}
                {riskInsights && (
                    <div className="flex-shrink-0 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <div className="text-red-800 text-center">
                                    <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{riskInsights.highRiskFactors}</p>
                                    <p className="text-xs">High Risk</p>
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <div className="text-yellow-800 text-center">
                                    <Shield className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{riskInsights.mediumRiskFactors}</p>
                                    <p className="text-xs">Medium Risk</p>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="text-green-800 text-center">
                                    <TrendingDown className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{riskInsights.lowRiskFactors}</p>
                                    <p className="text-xs">Low Risk</p>
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${parseFloat(riskInsights.performanceGap) >= 0
                                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                                    : 'bg-orange-50 border-orange-200 text-orange-800'
                                }`}>
                                <div className="text-center">
                                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">
                                        {parseFloat(riskInsights.performanceGap) > 0 ? '+' : ''}{riskInsights.performanceGap}%
                                    </p>
                                    <p className="text-xs">vs Market</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Radar Chart */}
                <div className="flex-1 min-h-[400px] flex items-center justify-center mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={120} data={chartData}>
                            <PolarGrid
                                stroke="#E5E7EB"
                                strokeWidth={1}
                                radialLines={true}
                                gridType="polygon"
                            />
                            <PolarAngleAxis
                                dataKey="factor"
                                tick={{
                                    fontSize: 11,
                                    fill: '#6B7280',
                                    textAnchor: 'middle'
                                }}
                                className="text-xs font-medium"
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 1]}
                                tick={{
                                    fontSize: 10,
                                    fill: '#6B7280'
                                }}
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                axisLine={false}
                                tickCount={6}
                            />
                            <Tooltip content={<RadarTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="line"
                            />

                            {/* Your Performance */}
                            <Radar
                                name="Your Performance"
                                dataKey="current"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.25}
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                    fill: '#3B82F6',
                                    stroke: '#FFFFFF',
                                    strokeWidth: 2
                                }}
                            />

                            {/* Market Benchmark */}
                            <Radar
                                name="Market Benchmark"
                                dataKey="optimal"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.15}
                                strokeWidth={3}
                                strokeDasharray="8 4"
                                dot={{
                                    r: 3,
                                    fill: '#10B981',
                                    stroke: '#FFFFFF',
                                    strokeWidth: 2
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Factor Analysis */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3">Performance Gap Analysis</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {chartData.map((item, index) => {
                            const gap = item.optimal - item.current;
                            const gapPercentage = Math.abs(gap * 100).toFixed(1);
                            const isAboveMarket = gap < 0;

                            return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <span className="text-sm font-medium text-gray-800 truncate">
                                            {item.factor}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.risk === 'High' ? 'bg-red-100 text-red-700' :
                                                item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {item.risk}
                                        </span>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs text-gray-500">
                                                You: {(item.current * 100).toFixed(1)}% |
                                                Market: {(item.optimal * 100).toFixed(1)}%
                                            </div>
                                            <span className={`text-sm font-bold ${isAboveMarket ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {isAboveMarket ? '+' : '-'}{gapPercentage}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {isAboveMarket ? 'Above market' : 'Below market'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key Insights */}
                {riskInsights && (
                    <div className="flex-shrink-0 mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Top Risks */}
                            {riskInsights.topRisks.length > 0 && (
                                <div>
                                    <h5 className="font-semibold text-red-700 text-sm mb-2 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        Areas for Improvement
                                    </h5>
                                    <div className="space-y-1">
                                        {riskInsights.topRisks.map((risk, index) => (
                                            <p key={index} className="text-xs text-gray-600">
                                                • {risk.factor}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Top Strengths */}
                            {riskInsights.topStrengths.length > 0 && (
                                <div>
                                    <h5 className="font-semibold text-green-700 text-sm mb-2 flex items-center">
                                        <Shield className="h-4 w-4 mr-1" />
                                        Key Strengths
                                    </h5>
                                    <div className="space-y-1">
                                        {riskInsights.topStrengths.map((strength, index) => (
                                            <p key={index} className="text-xs text-gray-600">
                                                • {strength.factor}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default RiskFactorAssessmentChart;
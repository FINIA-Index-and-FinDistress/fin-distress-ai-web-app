import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Brain, TrendingUp, Star, Zap } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional feature importance chart for ML model insights
 * Shows key predictors of financial distress with business-friendly descriptions
 */

const TopFeatureImportanceChart = ({
    data,
    title = "Key Risk Predictors",
    subtitle = "ML model feature importance analysis"
}) => {
    /**
     * Process and validate feature importance data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], isEmpty: true, featureInsights: null };
        }

        // Process feature data with business context
        const chartData = data.map(item => ({
            name: item.name || 'Unknown Feature',
            fullName: item.fullName || item.name || 'Unknown Feature',
            value: Math.max(0, Math.min(1, Number(item.value || 0))),
            category: item.category || categorizeFeature(item.name || ''),
            description: item.description || getFeatureDescription(item.name || ''),
            color: getCategoryColor(item.category || categorizeFeature(item.name || ''))
        })).sort((a, b) => b.value - a.value) // Sort by importance
            .slice(0, 15); // Limit to top 15 features

        // Calculate feature insights
        const featureInsights = calculateFeatureInsights(chartData);

        return {
            chartData,
            isEmpty: chartData.length === 0,
            featureInsights
        };
    }, [data]);

    /**
     * Categorize features into business domains
     */
    function categorizeFeature(featureName) {
        if (!featureName) return 'Other';

        const name = featureName.toLowerCase();
        if (name.includes('fin_') || name.includes('credit') || name.includes('bank')) return 'Financial';
        if (name.includes('fem_') || name.includes('ceo') || name.includes('leadership')) return 'Leadership';
        if (name.includes('own') || name.includes('pvt') || name.includes('con')) return 'Ownership';
        if (name.includes('gdp') || name.includes('pol_') || name.includes('prime')) return 'Economic';
        if (name.includes('edu') || name.includes('innov') || name.includes('transp')) return 'Operational';
        if (name.includes('exports') || name.includes('market')) return 'Market';
        if (name.includes('sector') || name.includes('industry')) return 'Industry';
        if (name.includes('startup') || name.includes('age')) return 'Company';

        return 'Other';
    }

    /**
     * Get business-friendly descriptions for features
     */
    function getFeatureDescription(featureName) {
        const descriptions = {
            'Fin_bank': 'Dependency on traditional bank financing',
            'Credit': 'Access to credit markets and financing options',
            'GDP': 'Regional economic growth and stability',
            'Pol_Inst': 'Political and institutional stability',
            'startup': 'Early-stage company risk factors',
            'Fem_CEO': 'Female leadership and governance diversity',
            'Exports': 'International market exposure and revenue',
            'Innov': 'Innovation investment and R&D spending',
            'Pvt_Own': 'Private ownership concentration levels',
            'Con_Own': 'Ownership structure and control',
            'Edu': 'Workforce education and skill levels',
            'WSI': 'Economic strength indicators',
            'WUI': 'Economic uncertainty measures',
            'PRIME': 'Interest rate environment impact'
        };

        return descriptions[featureName] || `${featureName.replace(/_/g, ' ')} impact on financial health`;
    }

    /**
     * Get category-specific colors
     */
    function getCategoryColor(category) {
        const colorMap = {
            'Financial': '#F59E0B',     // Amber
            'Leadership': '#10B981',    // Emerald  
            'Ownership': '#3B82F6',     // Blue
            'Economic': '#8B5CF6',      // Violet
            'Operational': '#06B6D4',   // Cyan
            'Market': '#EF4444',        // Red
            'Industry': '#F97316',      // Orange
            'Company': '#84CC16',       // Lime
            'Other': '#6B7280'          // Gray
        };
        return colorMap[category] || colorMap.Other;
    }

    /**
     * Calculate comprehensive feature insights
     */
    function calculateFeatureInsights(data) {
        if (data.length === 0) return null;

        // Category distribution
        const categoryStats = data.reduce((acc, feature) => {
            acc[feature.category] = (acc[feature.category] || 0) + 1;
            return acc;
        }, {});

        const dominantCategory = Object.entries(categoryStats)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Importance thresholds
        const highImportance = data.filter(f => f.value >= 0.15);
        const mediumImportance = data.filter(f => f.value >= 0.08 && f.value < 0.15);
        const lowImportance = data.filter(f => f.value < 0.08);

        // Top predictors
        const topPredictor = data[0];
        const totalImportance = data.reduce((sum, f) => sum + f.value, 0);
        const topThreeImportance = data.slice(0, 3).reduce((sum, f) => sum + f.value, 0);

        return {
            totalFeatures: data.length,
            dominantCategory,
            categoryStats,
            highImportance: highImportance.length,
            mediumImportance: mediumImportance.length,
            lowImportance: lowImportance.length,
            topPredictor,
            totalImportance: (totalImportance * 100).toFixed(1),
            topThreeShare: ((topThreeImportance / totalImportance) * 100).toFixed(1),
            categories: Object.keys(categoryStats).length
        };
    }

    /**
     * Enhanced feature tooltip
     */
    const FeatureTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const feature = payload[0].payload;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg max-w-sm">
                <div className="flex items-center space-x-2 mb-3">
                    <div
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: feature.color }}
                    />
                    <p className="font-semibold text-gray-800">{feature.fullName}</p>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Importance:</span>
                        <span className="font-bold text-indigo-600">
                            {(feature.value * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium" style={{ color: feature.color }}>
                            {feature.category}
                        </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 leading-tight">
                            {feature.description}
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full"
                                style={{
                                    width: `${feature.value * 100}%`,
                                    backgroundColor: feature.color
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Render empty state
     */
    if (processedData.isEmpty) {
        return (
            <ChartCard title={title} subtitle={subtitle} icon={Sparkles}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Feature Data</p>
                        <p className="text-sm text-gray-500">
                            ML feature importance will appear after model analysis
                        </p>
                    </div>
                </div>
            </ChartCard>
        );
    }

    const { chartData, featureInsights } = processedData;

    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            icon={Sparkles}
            dataCount={chartData.length}
            exportable={true}
            expandable={true}
        >
            <div className="flex flex-col h-full">
                {/* Feature Overview */}
                {featureInsights && (
                    <div className="flex-shrink-0 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <div className="text-purple-800 text-center">
                                    <Brain className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{featureInsights.totalFeatures}</p>
                                    <p className="text-xs">Key Features</p>
                                </div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <div className="text-amber-800 text-center">
                                    <Star className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{featureInsights.highImportance}</p>
                                    <p className="text-xs">High Impact</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                <div className="text-emerald-800 text-center">
                                    <Zap className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{featureInsights.categories}</p>
                                    <p className="text-xs">Categories</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <div className="text-blue-800 text-center">
                                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{featureInsights.topThreeShare}%</p>
                                    <p className="text-xs">Top 3 Share</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feature Importance Chart */}
                <div className="flex-1 min-h-[350px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                tick={{ fontSize: 11 }}
                                stroke="#6B7280"
                                interval={0}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#6B7280"
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                label={{
                                    value: 'Importance (%)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }
                                }}
                            />
                            <Tooltip content={<FeatureTooltip />} />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                fill="#8884d8"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Legend */}
                <div className="flex-shrink-0 mb-4">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3">Feature Categories</h4>
                    <div className="flex flex-wrap gap-3">
                        {featureInsights && Object.entries(featureInsights.categoryStats).map(([category, count]) => (
                            <div key={category} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: getCategoryColor(category) }}
                                />
                                <span className="text-xs text-gray-600">
                                    {category} ({count})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Features Summary */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Top Predictor */}
                        {featureInsights && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                                <h5 className="font-semibold text-indigo-800 text-sm mb-2 flex items-center">
                                    <Star className="h-4 w-4 mr-2" />
                                    Top Predictor
                                </h5>
                                <p className="text-lg font-bold text-indigo-900 mb-1">
                                    {featureInsights.topPredictor.fullName}
                                </p>
                                <p className="text-sm text-indigo-700 mb-2">
                                    {(featureInsights.topPredictor.value * 100).toFixed(1)}% importance
                                </p>
                                <p className="text-xs text-indigo-600">
                                    {featureInsights.topPredictor.description}
                                </p>
                            </div>
                        )}

                        {/* Category Distribution */}
                        {featureInsights && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                                <h5 className="font-semibold text-emerald-800 text-sm mb-2 flex items-center">
                                    <Brain className="h-4 w-4 mr-2" />
                                    Dominant Category
                                </h5>
                                <p className="text-lg font-bold text-emerald-900 mb-1">
                                    {featureInsights.dominantCategory}
                                </p>
                                <p className="text-sm text-emerald-700 mb-2">
                                    {featureInsights.categoryStats[featureInsights.dominantCategory]} features
                                </p>
                                <p className="text-xs text-emerald-600">
                                    Most influential business domain for predictions
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Importance Breakdown */}
                {featureInsights && (
                    <div className="flex-shrink-0 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-bold text-red-600">{featureInsights.highImportance}</p>
                                <p className="text-xs text-gray-600">High Impact (≥15%)</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-yellow-600">{featureInsights.mediumImportance}</p>
                                <p className="text-xs text-gray-600">Medium Impact (8-15%)</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-600">{featureInsights.lowImportance}</p>
                                <p className="text-xs text-gray-600">Low Impact (&lt;8%)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default TopFeatureImportanceChart;
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Globe, TrendingDown, Building } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional market benchmark distribution chart
 * Shows overall market health from training data for comparison
 */

const OverallDistressDistributionChart = ({
    data,
    title = "Market Benchmark Distribution",
    subtitle = "Training dataset market overview"
}) => {
    /**
     * Process and validate market benchmark data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], total: 0, isEmpty: true };
        }

        // Process market data with enhanced formatting
        const chartData = data.map(item => ({
            name: item.name || item.status || 'Unknown',
            value: Math.max(0, Number(item.value || item.count || 0)),
            percentage: Math.max(0, Number(item.percentage || 0)),
            color: item.color || getMarketColor(item.name || item.status)
        })).filter(item => item.value > 0);

        const total = chartData.reduce((sum, item) => sum + item.value, 0);

        return {
            chartData,
            total,
            isEmpty: chartData.length === 0 || total === 0
        };
    }, [data]);

    /**
     * Get market-specific colors for categories
     */
    function getMarketColor(category) {
        const marketColorMap = {
            'Healthy': '#10b981',
            'At Risk': '#f87171',
            'Distressed': '#dc2626',
            'Stable': '#22c55e',
            'Vulnerable': '#f59e0b',
            'Critical': '#ef4444'
        };
        return marketColorMap[category] || '#6b7280';
    }

    /**
     * Calculate market insights
     */
    const marketInsights = useMemo(() => {
        if (processedData.isEmpty) return null;

        const { chartData, total } = processedData;
        const healthy = chartData.find(d => d.name === 'Healthy' || d.name === 'Stable');
        const atRisk = chartData.find(d => d.name === 'At Risk' || d.name === 'Vulnerable');
        const distressed = chartData.find(d => d.name === 'Distressed' || d.name === 'Critical');

        const healthyRate = healthy ? (healthy.value / total * 100) : 0;
        const riskRate = atRisk ? (atRisk.value / total * 100) : 0;
        const distressRate = distressed ? (distressed.value / total * 100) : 0;

        let marketHealth = 'Stable';
        if (distressRate > 30) marketHealth = 'Concerning';
        else if (distressRate > 15) marketHealth = 'Moderate Risk';
        else if (healthyRate > 70) marketHealth = 'Strong';

        return {
            healthyRate: healthyRate.toFixed(1),
            riskRate: riskRate.toFixed(1),
            distressRate: distressRate.toFixed(1),
            marketHealth,
            dominantSegment: chartData.reduce((a, b) => a.value > b.value ? a : b)
        };
    }, [processedData]);

    /**
     * Enhanced market tooltip
     */
    const MarketTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0];
        const item = data.payload;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-3">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: data.color }}
                    />
                    <p className="font-semibold text-gray-800">{item.name}</p>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Companies:</span>
                        <span className="font-bold text-gray-800">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Market Share:</span>
                        <span className="font-bold text-gray-800">{item.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Training Data:</span>
                        <span className="font-bold text-gray-800">
                            {((item.value / processedData.total) * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Market benchmark from {processedData.total.toLocaleString()} companies
                    </p>
                </div>
            </div>
        );
    };

    /**
     * Custom market label
     */
    const MarketLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.08) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-bold text-sm drop-shadow-lg"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    /**
     * Render empty state
     */
    if (processedData.isEmpty) {
        return (
            <ChartCard title={title} subtitle={subtitle} icon={Globe}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Market Data</p>
                        <p className="text-sm text-gray-500">
                            Market benchmark data is currently unavailable
                        </p>
                    </div>
                </div>
            </ChartCard>
        );
    }

    const { chartData, total } = processedData;

    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            icon={Globe}
            dataCount={chartData.length}
            exportable={true}
        >
            <div className="flex flex-col h-full">
                {/* Market Overview */}
                <div className="flex-shrink-0 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <Building className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    Market Sample: {total.toLocaleString()} Companies
                                </p>
                                {marketInsights && (
                                    <p className="text-xs text-blue-600">
                                        Market Health: <span className="font-medium">{marketInsights.marketHealth}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        {marketInsights && (
                            <div className="text-right">
                                <p className="text-sm font-semibold text-blue-700">
                                    {marketInsights.healthyRate}% Healthy
                                </p>
                                <p className="text-xs text-blue-500">Market Baseline</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Market Pie Chart */}
                <div className="flex-1 min-h-[280px] flex items-center justify-center mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={MarketLabel}
                                outerRadius={100}
                                innerRadius={30}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={200}
                                animationDuration={1000}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`market-cell-${index}`}
                                        fill={entry.color}
                                        stroke="rgba(255,255,255,0.9)"
                                        strokeWidth={3}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<MarketTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={40}
                                formatter={(value, entry) => (
                                    <span
                                        style={{ color: entry.color }}
                                        className="font-medium text-sm"
                                    >
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Market Breakdown */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Market Composition
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chartData.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.value.toLocaleString()} companies
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold" style={{ color: item.color }}>
                                        {item.percentage}%
                                    </p>
                                    <p className="text-xs text-gray-500">of market</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market Insights */}
                {marketInsights && (
                    <div className="flex-shrink-0 mt-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                        <h5 className="font-semibold text-gray-700 text-xs mb-2">Market Analysis:</h5>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-bold text-green-600">{marketInsights.healthyRate}%</p>
                                <p className="text-xs text-gray-600">Healthy</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-yellow-600">{marketInsights.riskRate}%</p>
                                <p className="text-xs text-gray-600">At Risk</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-red-600">{marketInsights.distressRate}%</p>
                                <p className="text-xs text-gray-600">Distressed</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default OverallDistressDistributionChart;
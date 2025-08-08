import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, Users } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional distribution chart for financial distress analysis  
 * Shows user prediction results in an intuitive pie chart format
 */

export const DistressDistributionChart = ({
    data,
    title = "Financial Health Distribution",
    subtitle = "Distribution of prediction results"
}) => {
    /**
     * Process and validate chart data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], total: 0, isEmpty: true };
        }

        // Ensure data has required properties and clean values
        const chartData = data.map(item => ({
            name: item.name || item.status || 'Unknown',
            value: Math.max(0, Number(item.value || item.count || 0)),
            percentage: Math.max(0, Number(item.percentage || 0)),
            color: item.color || getDefaultColor(item.name || item.status)
        })).filter(item => item.value > 0);

        const total = chartData.reduce((sum, item) => sum + item.value, 0);

        return {
            chartData,
            total,
            isEmpty: chartData.length === 0 || total === 0
        };
    }, [data]);

    /**
     * Get default colors for risk categories
     */
    function getDefaultColor(category) {
        const colorMap = {
            'Low Risk': '#22c55e',
            'Medium Risk': '#f59e0b',
            'High Risk': '#ef4444',
            'Very High Risk': '#dc2626',
            'Healthy': '#10b981',
            'At Risk': '#f87171',
            'Distressed': '#dc2626'
        };
        return colorMap[category] || '#6b7280';
    }

    /**
     * Calculate insights from data
     */
    const insights = useMemo(() => {
        if (processedData.isEmpty) return null;

        const { chartData, total } = processedData;
        const highRisk = chartData.find(d => d.name.includes('High') || d.name === 'At Risk' || d.name === 'Distressed');
        const lowRisk = chartData.find(d => d.name.includes('Low') || d.name === 'Healthy');

        return {
            dominantCategory: chartData.reduce((a, b) => a.value > b.value ? a : b),
            riskLevel: highRisk ?
                (highRisk.value / total > 0.5 ? 'High' : 'Moderate') :
                'Low',
            healthyPercentage: lowRisk ? (lowRisk.value / total * 100).toFixed(1) : '0.0'
        };
    }, [processedData]);

    /**
     * Custom tooltip for enhanced user experience
     */
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0];
        const item = data.payload;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: data.color }}
                    />
                    <p className="font-semibold text-gray-800">{item.name}</p>
                </div>
                <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                        Companies: <span className="font-medium text-gray-800">{item.value.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-600">
                        Percentage: <span className="font-medium text-gray-800">{item.percentage}%</span>
                    </p>
                    <p className="text-gray-600">
                        Share: <span className="font-medium text-gray-800">
                            {((item.value / processedData.total) * 100).toFixed(1)}% of total
                        </span>
                    </p>
                </div>
            </div>
        );
    };

    /**
     * Custom label for pie slices
     */
    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show label if slice is large enough
        if (percent < 0.05) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-semibold text-sm drop-shadow-lg"
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
            <ChartCard title={title} subtitle={subtitle} icon={PieChartIcon}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <PieChartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Distribution Data</p>
                        <p className="text-sm text-gray-500">
                            Chart will populate after predictions are generated
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
            icon={PieChartIcon}
            dataCount={chartData.length}
            exportable={true}
        >
            <div className="flex flex-col h-full">
                {/* Chart Summary */}
                <div className="flex-shrink-0 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-indigo-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Total Analyzed: {total.toLocaleString()}
                                </p>
                                {insights && (
                                    <p className="text-xs text-gray-600">
                                        Risk Level: <span className="font-medium">{insights.riskLevel}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        {insights && (
                            <div className="text-right">
                                <p className="text-sm font-semibold text-indigo-600">
                                    {insights.dominantCategory.name}
                                </p>
                                <p className="text-xs text-gray-500">Most Common</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="flex-1 min-h-[280px] flex items-center justify-center mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={CustomLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="rgba(255,255,255,0.8)"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
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

                {/* Detailed Breakdown */}
                <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    {chartData.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105"
                        >
                            <div className="text-center">
                                <div
                                    className="w-4 h-4 rounded-full mx-auto mb-2 shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                />
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                    {item.name}
                                </p>
                                <p className="text-xl font-bold mb-1" style={{ color: item.color }}>
                                    {item.value.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {((item.value / total) * 100).toFixed(1)}% of total
                                </p>
                                {insights && item.name === insights.dominantCategory.name && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Dominant
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
};

export default DistressDistributionChart;
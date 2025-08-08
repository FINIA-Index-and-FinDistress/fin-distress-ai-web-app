import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Activity, BarChart3 } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional prediction trends chart for financial health analysis
 * Shows temporal patterns and trends in prediction data
 */

const PredictionTrendsChart = ({
    data,
    title = "Financial Health Trends",
    subtitle = "Historical analysis of prediction patterns"
}) => {
    /**
     * Process and validate trends data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], isEmpty: true, trendInsights: null };
        }

        // Process and clean trend data
        const chartData = data.map(item => ({
            period: item.period || 'Unknown',
            distressRate: Math.max(0, Math.min(100, Number(item.distressRate || 0))),
            healthyRate: Math.max(0, Math.min(100, Number(item.healthyRate || 100 - (item.distressRate || 0)))),
            totalAnalyzed: Math.max(0, Number(item.totalAnalyzed || 0)),
            timestamp: item.timestamp || new Date().toISOString()
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Calculate trend insights
        const trendInsights = calculateTrendInsights(chartData);

        return {
            chartData,
            isEmpty: chartData.length === 0,
            trendInsights
        };
    }, [data]);

    /**
     * Calculate trend insights and statistics
     */
    function calculateTrendInsights(data) {
        if (data.length < 2) return null;

        const firstPoint = data[0];
        const lastPoint = data[data.length - 1];
        const totalCompanies = data.reduce((sum, item) => sum + item.totalAnalyzed, 0);

        const distressTrend = ((lastPoint.distressRate - firstPoint.distressRate) / firstPoint.distressRate) * 100;
        const volumeGrowth = data.length > 1 ?
            ((lastPoint.totalAnalyzed - firstPoint.totalAnalyzed) / firstPoint.totalAnalyzed) * 100 : 0;

        let trendDirection = 'stable';
        if (Math.abs(distressTrend) > 5) {
            trendDirection = distressTrend > 0 ? 'increasing' : 'decreasing';
        }

        const averageDistressRate = data.reduce((sum, item) => sum + item.distressRate, 0) / data.length;
        const peakDistressRate = Math.max(...data.map(item => item.distressRate));
        const lowestDistressRate = Math.min(...data.map(item => item.distressRate));

        return {
            distressTrend: distressTrend.toFixed(1),
            volumeGrowth: volumeGrowth.toFixed(1),
            trendDirection,
            totalCompanies,
            averageDistressRate: averageDistressRate.toFixed(1),
            peakDistressRate: peakDistressRate.toFixed(1),
            lowestDistressRate: lowestDistressRate.toFixed(1),
            dataPoints: data.length,
            timeSpan: `${firstPoint.period} - ${lastPoint.period}`
        };
    }

    /**
     * Enhanced trends tooltip
     */
    const TrendsTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg">
                <p className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600">{entry.name}:</span>
                        </div>
                        <span className="font-semibold" style={{ color: entry.color }}>
                            {entry.name === 'Total Analyzed'
                                ? entry.value.toLocaleString()
                                : `${entry.value.toFixed(1)}%`}
                        </span>
                    </div>
                ))}
                <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Click and drag to zoom</p>
                </div>
            </div>
        );
    };

    /**
     * Render empty state
     */
    if (processedData.isEmpty) {
        return (
            <ChartCard title={title} subtitle={subtitle} icon={TrendingUp}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Trend Data</p>
                        <p className="text-sm text-gray-500">
                            Historical trends will appear as prediction data accumulates over time
                        </p>
                    </div>
                </div>
            </ChartCard>
        );
    }

    const { chartData, trendInsights } = processedData;

    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            icon={TrendingUp}
            dataCount={chartData.length}
            exportable={true}
            expandable={true}
        >
            <div className="flex flex-col h-full">
                {/* Trends Overview */}
                {trendInsights && (
                    <div className="flex-shrink-0 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-3 rounded-lg border ${trendInsights.trendDirection === 'increasing'
                                    ? 'bg-red-50 border-red-200'
                                    : trendInsights.trendDirection === 'decreasing'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-blue-50 border-blue-200'
                                }`}>
                                <div className={`${trendInsights.trendDirection === 'increasing' ? 'text-red-800' :
                                        trendInsights.trendDirection === 'decreasing' ? 'text-green-800' :
                                            'text-blue-800'
                                    }`}>
                                    <h4 className="font-semibold text-sm flex items-center">
                                        <Activity className="h-4 w-4 mr-2" />
                                        Distress Trend
                                    </h4>
                                    <p className="text-xl font-bold">
                                        {parseFloat(trendInsights.distressTrend) > 0 ? '+' : ''}{trendInsights.distressTrend}%
                                    </p>
                                    <p className="text-xs capitalize">{trendInsights.trendDirection} trend</p>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                                <div className="text-indigo-800">
                                    <h4 className="font-semibold text-sm flex items-center">
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Analysis Volume
                                    </h4>
                                    <p className="text-xl font-bold">
                                        {trendInsights.totalCompanies.toLocaleString()}
                                    </p>
                                    <p className="text-xs">Total companies analyzed</p>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <div className="text-purple-800">
                                    <h4 className="font-semibold text-sm flex items-center">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Data Points
                                    </h4>
                                    <p className="text-xl font-bold">{trendInsights.dataPoints}</p>
                                    <p className="text-xs">{trendInsights.timeSpan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trends Chart */}
                <div className="flex-1 min-h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
                            <XAxis
                                dataKey="period"
                                stroke="#6B7280"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#6B7280"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value}%`}
                                label={{
                                    value: 'Risk Rate (%)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#3B82F6"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.toLocaleString()}
                                label={{
                                    value: 'Companies Analyzed',
                                    angle: 90,
                                    position: 'insideRight',
                                    style: { textAnchor: 'middle', fontSize: '12px', fill: '#3B82F6' }
                                }}
                            />
                            <Tooltip content={<TrendsTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="line"
                            />

                            {/* Distress Rate Line */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="distressRate"
                                stroke="#EF4444"
                                strokeWidth={3}
                                name="Distress Rate"
                                activeDot={{
                                    r: 6,
                                    stroke: '#EF4444',
                                    strokeWidth: 2,
                                    fill: '#FEE2E2'
                                }}
                                dot={{
                                    fill: '#EF4444',
                                    strokeWidth: 2,
                                    r: 4,
                                    stroke: '#FFFFFF'
                                }}
                            />

                            {/* Healthy Rate Line */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="healthyRate"
                                stroke="#10B981"
                                strokeWidth={3}
                                name="Healthy Rate"
                                activeDot={{
                                    r: 6,
                                    stroke: '#10B981',
                                    strokeWidth: 2,
                                    fill: '#D1FAE5'
                                }}
                                dot={{
                                    fill: '#10B981',
                                    strokeWidth: 2,
                                    r: 4,
                                    stroke: '#FFFFFF'
                                }}
                            />

                            {/* Volume Line */}
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="totalAnalyzed"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                strokeDasharray="8 8"
                                name="Total Analyzed"
                                activeDot={{
                                    r: 6,
                                    stroke: '#3B82F6',
                                    strokeWidth: 2,
                                    fill: '#DBEAFE'
                                }}
                                dot={{
                                    fill: '#3B82F6',
                                    strokeWidth: 2,
                                    r: 3,
                                    stroke: '#FFFFFF'
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Trend Statistics */}
                {trendInsights && (
                    <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 text-sm mb-3">Statistical Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Average Risk</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {trendInsights.averageDistressRate}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-600 mb-1">Peak Risk</p>
                                <p className="text-lg font-bold text-red-700">
                                    {trendInsights.peakDistressRate}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-600 mb-1">Lowest Risk</p>
                                <p className="text-lg font-bold text-green-700">
                                    {trendInsights.lowestDistressRate}%
                                </p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-600 mb-1">Volume Growth</p>
                                <p className="text-lg font-bold text-blue-700">
                                    {parseFloat(trendInsights.volumeGrowth) > 0 ? '+' : ''}{trendInsights.volumeGrowth}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default PredictionTrendsChart;
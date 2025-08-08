import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, AlertCircle, Award } from 'lucide-react';
import ChartCard from './ChartCard';

/**
 * Professional sector risk analysis chart
 * Shows financial health distribution across different industry sectors
 */

const SectorRiskAnalysisChart = ({
    data,
    title = "Industry Sector Analysis",
    subtitle = "Risk distribution across sectors"
}) => {
    /**
     * Process and validate sector data
     */
    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return { chartData: [], isEmpty: true, sectorInsights: null };
        }

        // Process sector risk data
        const chartData = data.map(item => ({
            sector: (item.sector || 'Unknown Sector').length > 20
                ? (item.sector || 'Unknown Sector').substring(0, 20) + '...'
                : (item.sector || 'Unknown Sector'),
            fullSectorName: item.sector || 'Unknown Sector',
            healthy: Math.max(0, Math.min(100, Number(item.healthy || 0))),
            distressed: Math.max(0, Math.min(100, Number(item.distressed || 0))),
            total: Math.max(0, Number(item.total || 0)),
            distressRate: item.distressRate || ((item.distressed || 0) / Math.max(1, item.total || 1)) * 100
        })).filter(item => item.total > 0)
            .sort((a, b) => b.distressRate - a.distressRate); // Sort by risk level

        // Calculate sector insights
        const sectorInsights = calculateSectorInsights(chartData);

        return {
            chartData,
            isEmpty: chartData.length === 0,
            sectorInsights
        };
    }, [data]);

    /**
     * Calculate comprehensive sector insights
     */
    function calculateSectorInsights(data) {
        if (data.length === 0) return null;

        const totalCompanies = data.reduce((sum, sector) => sum + sector.total, 0);
        const totalDistressed = data.reduce((sum, sector) => sum + (sector.total * sector.distressRate / 100), 0);
        const overallRiskRate = (totalDistressed / totalCompanies) * 100;

        // Risk categorization
        const highRiskSectors = data.filter(sector => sector.distressRate >= 40);
        const mediumRiskSectors = data.filter(sector => sector.distressRate >= 25 && sector.distressRate < 40);
        const lowRiskSectors = data.filter(sector => sector.distressRate < 25);

        // Top and bottom performers
        const riskiestSector = data[0]; // Already sorted by risk
        const safestSector = data[data.length - 1];
        const largestSector = data.reduce((a, b) => a.total > b.total ? a : b);

        return {
            totalCompanies,
            totalDistressed: Math.round(totalDistressed),
            overallRiskRate: overallRiskRate.toFixed(1),
            highRiskSectors: highRiskSectors.length,
            mediumRiskSectors: mediumRiskSectors.length,
            lowRiskSectors: lowRiskSectors.length,
            riskiestSector,
            safestSector,
            largestSector,
            totalSectors: data.length
        };
    }

    /**
     * Enhanced sector tooltip
     */
    const SectorTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        const sectorData = processedData.chartData.find(s => s.sector === label);
        if (!sectorData) return null;

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg max-w-xs">
                <p className="font-semibold text-gray-800 mb-3">{sectorData.fullSectorName}</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Companies:</span>
                        <span className="font-bold text-gray-800">{sectorData.total.toLocaleString()}</span>
                    </div>
                    {payload.reverse().map((entry, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-gray-600">{entry.name}:</span>
                            </div>
                            <span className="font-semibold" style={{ color: entry.color }}>
                                {entry.value.toFixed(1)}% ({Math.round(sectorData.total * entry.value / 100)} companies)
                            </span>
                        </div>
                    ))}
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Risk Level:</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${sectorData.distressRate >= 40 ? 'bg-red-100 text-red-700' :
                                    sectorData.distressRate >= 25 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                }`}>
                                {sectorData.distressRate >= 40 ? 'High Risk' :
                                    sectorData.distressRate >= 25 ? 'Medium Risk' : 'Low Risk'}
                            </span>
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
            <ChartCard title={title} subtitle={subtitle} icon={Building2}>
                <div className="flex items-center justify-center flex-1 text-gray-500">
                    <div className="text-center">
                        <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">No Sector Data</p>
                        <p className="text-sm text-gray-500">
                            Sector analysis will appear once industry data is collected
                        </p>
                    </div>
                </div>
            </ChartCard>
        );
    }

    const { chartData, sectorInsights } = processedData;

    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            icon={Building2}
            dataCount={chartData.length}
            exportable={true}
            expandable={true}
        >
            <div className="flex flex-col h-full">
                {/* Sector Overview */}
                {sectorInsights && (
                    <div className="flex-shrink-0 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <div className="text-blue-800 text-center">
                                    <Building2 className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{sectorInsights.totalSectors}</p>
                                    <p className="text-xs">Sectors</p>
                                </div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                                <div className="text-indigo-800 text-center">
                                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{sectorInsights.totalCompanies.toLocaleString()}</p>
                                    <p className="text-xs">Companies</p>
                                </div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <div className="text-red-800 text-center">
                                    <AlertCircle className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{sectorInsights.highRiskSectors}</p>
                                    <p className="text-xs">High Risk</p>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="text-green-800 text-center">
                                    <Award className="h-5 w-5 mx-auto mb-1" />
                                    <p className="text-lg font-bold">{sectorInsights.lowRiskSectors}</p>
                                    <p className="text-xs">Low Risk</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sector Bar Chart */}
                <div className="flex-1 min-h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.8} />
                            <XAxis
                                dataKey="sector"
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
                                tickFormatter={(value) => `${value}%`}
                                label={{
                                    value: 'Percentage (%)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }
                                }}
                            />
                            <Tooltip content={<SectorTooltip />} />
                            <Legend />

                            {/* Healthy Companies Bar */}
                            <Bar
                                dataKey="healthy"
                                stackId="sector"
                                fill="#10B981"
                                name="Financially Healthy"
                                radius={[0, 0, 0, 0]}
                            />

                            {/* Distressed Companies Bar */}
                            <Bar
                                dataKey="distressed"
                                stackId="sector"
                                fill="#EF4444"
                                name="At Financial Risk"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Sector Rankings */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3">Sector Risk Rankings</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {chartData.map((sector, index) => (
                            <div key={sector.fullSectorName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className={`text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-red-100 text-red-700' :
                                            index === 1 ? 'bg-orange-100 text-orange-700' :
                                                index === 2 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        #{index + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-800 truncate" title={sector.fullSectorName}>
                                            {sector.fullSectorName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {sector.total.toLocaleString()} companies
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${sector.distressRate >= 40 ? 'bg-red-100 text-red-700' :
                                            sector.distressRate >= 25 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {sector.distressRate >= 40 ? 'High Risk' :
                                            sector.distressRate >= 25 ? 'Medium Risk' : 'Low Risk'}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-600">
                                            {sector.distressRate.toFixed(1)}%
                                        </p>
                                        <p className="text-xs text-gray-500">at risk</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Insights */}
                {sectorInsights && (
                    <div className="flex-shrink-0 mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                        <h5 className="font-semibold text-gray-700 text-sm mb-3">Sector Intelligence</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-red-600 font-medium mb-1">Highest Risk Sector</p>
                                <p className="text-sm font-bold text-gray-800">{sectorInsights.riskiestSector.fullSectorName}</p>
                                <p className="text-xs text-gray-500">{sectorInsights.riskiestSector.distressRate.toFixed(1)}% distress rate</p>
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-medium mb-1">Safest Sector</p>
                                <p className="text-sm font-bold text-gray-800">{sectorInsights.safestSector.fullSectorName}</p>
                                <p className="text-xs text-gray-500">{sectorInsights.safestSector.distressRate.toFixed(1)}% distress rate</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-medium mb-1">Largest Sector</p>
                                <p className="text-sm font-bold text-gray-800">{sectorInsights.largestSector.fullSectorName}</p>
                                <p className="text-xs text-gray-500">{sectorInsights.largestSector.total.toLocaleString()} companies</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 text-center">
                                Overall market distress rate: <span className="font-semibold">{sectorInsights.overallRiskRate}%</span>
                                across {sectorInsights.totalCompanies.toLocaleString()} companies
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default SectorRiskAnalysisChart;
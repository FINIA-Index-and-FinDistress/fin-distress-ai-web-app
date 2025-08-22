import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Globe, AlertCircle, CheckCircle, Clock, Database, Zap, TrendingUp } from 'lucide-react';
import useWorldBankData from '../hooks/useWorldBankData';

/**
 * Macro Auto-Fill Component
 * Integrates with the existing form to auto-populate macroeconomic fields
 */
const MacroAutoFill = ({
    selectedCountry,
    currentFormData = {},
    onAutoFill,
    formErrors = {},
    className = ""
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [autoFillMode, setAutoFillMode] = useState('manual'); // 'manual' or 'auto'
    const [lastAutoFillCountry, setLastAutoFillCountry] = useState(null);

    // Use the World Bank data hook
    const {
        data: worldBankData,
        formData,
        isLoading,
        error,
        hasData,
        dataQuality,
        lastFetch,
        isSupported,
        fetchMacroData,
        refreshData
    } = useWorldBankData(selectedCountry);

    // Track which fields are auto-filled vs manually entered
    const [autoFilledFields, setAutoFilledFields] = useState(new Set());

    // Macro field definitions 
    const MACRO_FIELDS = {
        'GDP': {
            label: 'GDP Growth Rate (%)',
            description: 'Annual GDP growth rate percentage',
            unit: '%',
            typical_range: '0-10%'
        },
        'Credit': {
            label: 'Domestic Credit (%)',
            description: 'Domestic credit to private sector (% of GDP)',
            unit: '% of GDP',
            typical_range: '20-150%'
        },
        'MarketCap': {
            label: 'Market Capitalization (%)',
            description: 'Stock market capitalization (% of GDP)',
            unit: '% of GDP',
            typical_range: '10-200%'
        },
        'WUI': {
            label: 'Unemployment Rate (%)',
            description: 'World Uncertainty Index proxy - unemployment rate',
            unit: '%',
            typical_range: '0-25%'
        },
        'GPR': {
            label: 'Geopolitical Risk (%)',
            description: 'Military expenditure as proxy for geopolitical risk',
            unit: '% of GDP',
            typical_range: '0-10%'
        },
        'PRIME': {
            label: 'Prime Interest Rate (%)',
            description: 'Real interest rate',
            unit: '%',
            typical_range: '0-20%'
        },
        'WSI': {
            label: 'Trade Volume (%)',
            description: 'World Supply Index proxy - trade (% of GDP)',
            unit: '% of GDP',
            typical_range: '20-200%'
        }
    };

    // Handle auto-fill when data is available
    useEffect(() => {
        if (hasData && formData && onAutoFill && selectedCountry !== lastAutoFillCountry) {
            if (autoFillMode === 'auto' || (autoFillMode === 'manual' && selectedCountry)) {
                console.log('Auto-filling macro data:', formData);

                // Mark fields as auto-filled
                const newAutoFilledFields = new Set(Object.keys(formData));
                setAutoFilledFields(newAutoFilledFields);

                // Call the parent's auto-fill handler
                onAutoFill(formData, {
                    source: 'World Bank API',
                    country: selectedCountry,
                    quality: dataQuality,
                    timestamp: new Date().toISOString(),
                    autoFilledFields: Array.from(newAutoFilledFields)
                });

                setLastAutoFillCountry(selectedCountry);
            }
        }
    }, [hasData, formData, onAutoFill, selectedCountry, lastAutoFillCountry, autoFillMode, dataQuality]);

    // Manual fetch handler
    const handleManualFetch = async () => {
        if (selectedCountry && isSupported) {
            await fetchMacroData(selectedCountry);
        }
    };

    // Clear auto-filled data
    const handleClearAutoFill = () => {
        setAutoFilledFields(new Set());
        setLastAutoFillCountry(null);

        // Create empty data for macro fields
        const emptyData = {};
        Object.keys(MACRO_FIELDS).forEach(field => {
            emptyData[field] = '';
        });

        if (onAutoFill) {
            onAutoFill(emptyData, {
                source: 'manual_clear',
                action: 'clear_autofill'
            });
        }
    };

    // Get status information
    const getStatusInfo = () => {
        if (!selectedCountry) {
            return {
                icon: Globe,
                text: 'Select a country first',
                color: 'text-gray-500',
                bgColor: 'bg-gray-50'
            };
        }

        if (!isSupported) {
            return {
                icon: AlertCircle,
                text: 'Country not supported',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
            };
        }

        if (isLoading) {
            return {
                icon: RefreshCw,
                text: 'Fetching data...',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
            };
        }

        if (error && !hasData) {
            return {
                icon: AlertCircle,
                text: 'Failed to fetch data',
                color: 'text-red-600',
                bgColor: 'bg-red-50'
            };
        }

        if (error && hasData) {
            return {
                icon: AlertCircle,
                text: 'Partial data loaded',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
            };
        }

        if (hasData) {
            const year = worldBankData?.data ?
                Math.max(...Object.values(worldBankData.data).map(d => d.year)) :
                'Unknown';
            return {
                icon: CheckCircle,
                text: `Data loaded (${year})`,
                color: 'text-green-600',
                bgColor: 'bg-green-50'
            };
        }

        return {
            icon: Download,
            text: 'Ready to fetch',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        };
    };

    const statusInfo = getStatusInfo();
    const canFetch = selectedCountry && isSupported && !isLoading;
    const shouldShowFetchButton = canFetch && (!hasData || lastAutoFillCountry !== selectedCountry);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Control Panel */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-xl p-4 border border-indigo-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                Macroeconomic Data Auto-Fill
                                <Zap className="h-4 w-4 ml-1 text-yellow-500" />
                            </h3>
                            <p className="text-sm text-gray-600">
                                {selectedCountry ?
                                    `Auto-populate macro indicators for ${selectedCountry}` :
                                    'Select a country to auto-fill macroeconomic data'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Auto-fill mode toggle */}
                    <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-600 font-medium">Auto-mode:</label>
                        <button
                            onClick={() => setAutoFillMode(autoFillMode === 'auto' ? 'manual' : 'auto')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${autoFillMode === 'auto'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}
                        >
                            {autoFillMode === 'auto' ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {/* Status and Controls */}
                <div className="flex items-center justify-between">
                    {/* Status Indicator */}
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <statusInfo.icon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{statusInfo.text}</span>
                        {hasData && (
                            <span className="text-xs opacity-75">
                                • {Object.keys(worldBankData?.data || {}).length} indicators
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {shouldShowFetchButton && (
                            <button
                                onClick={handleManualFetch}
                                disabled={!canFetch}
                                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                            >
                                <Download className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
                                <span>{isLoading ? 'Fetching...' : 'Fetch Data'}</span>
                            </button>
                        )}

                        {hasData && (
                            <button
                                onClick={refreshData}
                                disabled={isLoading}
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                title="Refresh data"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        )}

                        {autoFilledFields.size > 0 && (
                            <button
                                onClick={handleClearAutoFill}
                                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Clear auto-filled data"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-yellow-800 font-medium">Data Fetch Warning</p>
                                <p className="text-yellow-700">{error}</p>
                                <p className="text-yellow-600 text-xs mt-1">
                                    {hasData ? 'Using available data with fallback values.' : 'Using default estimates.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto-fill Instructions */}
                {autoFillMode === 'auto' && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-green-800 font-medium">Auto-mode Enabled</p>
                                <p className="text-green-700">
                                    Macro fields will be automatically populated when you select a country.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Data Preview */}
            {hasData && worldBankData && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Database className="h-4 w-4 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                    Fetched Data Preview
                                </span>
                                <span className="text-xs text-gray-500">
                                    ({Object.keys(worldBankData.data || {}).length} indicators)
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${dataQuality === 'Complete' ? 'bg-green-100 text-green-700' :
                                        dataQuality === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {dataQuality}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                {showDetails ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {showDetails ? (
                            <div className="space-y-3">
                                {Object.entries(worldBankData.data || {}).map(([fieldName, fieldData]) => {
                                    const fieldInfo = MACRO_FIELDS[fieldName] || { label: fieldName, description: 'Unknown field' };
                                    const isAutoFilled = autoFilledFields.has(fieldName);
                                    const hasError = formErrors[fieldName];

                                    return (
                                        <div key={fieldName} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {fieldInfo.label}
                                                    </div>
                                                    {isAutoFilled && (
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                            Auto-filled
                                                        </span>
                                                    )}
                                                    {fieldData.is_fallback && (
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                                            Fallback
                                                        </span>
                                                    )}
                                                    {hasError && (
                                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                                            Error
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {fieldInfo.description}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {fieldData.source} • {fieldData.year} • {fieldInfo.typical_range}
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="font-mono text-sm font-medium text-gray-900">
                                                    {typeof fieldData.value === 'number' ?
                                                        fieldData.value.toFixed(2) : 'N/A'
                                                    } {fieldInfo.unit}
                                                </div>
                                                {fieldData.original_value !== fieldData.value && (
                                                    <div className="text-xs text-gray-400">
                                                        Raw: {typeof fieldData.original_value === 'number' ?
                                                            fieldData.original_value.toFixed(2) : 'N/A'}
                                                    </div>
                                                )}
                                                {fieldData.indicator && (
                                                    <div className="text-xs text-gray-400 truncate max-w-20">
                                                        {fieldData.indicator}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Object.entries(worldBankData.data || {}).slice(0, 4).map(([fieldName, fieldData]) => {
                                    const fieldInfo = MACRO_FIELDS[fieldName] || { label: fieldName };
                                    const isAutoFilled = autoFilledFields.has(fieldName);

                                    return (
                                        <div key={fieldName} className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {typeof fieldData.value === 'number' ?
                                                    fieldData.value.toFixed(1) : 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-600 font-medium">
                                                {fieldName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {fieldData.year}
                                            </div>
                                            {isAutoFilled && (
                                                <div className="text-xs text-blue-600 font-medium mt-1">
                                                    Auto-filled
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {lastFetch && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Last updated: {new Date(lastFetch).toLocaleString()}
                                </div>
                                {worldBankData.countryCode && (
                                    <div className="flex items-center">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {worldBankData.country} ({worldBankData.countryCode})
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* No Country Selected */}
            {!selectedCountry && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <h4 className="font-medium text-gray-700 mb-1">No Country Selected</h4>
                    <p className="text-sm">
                        Choose a country from the form to access World Bank macroeconomic data
                    </p>
                </div>
            )}

            {/* Unsupported Country */}
            {selectedCountry && !isSupported && (
                <div className="text-center py-8 text-orange-600 bg-orange-50 rounded-xl border border-orange-200">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3" />
                    <h4 className="font-medium text-orange-700 mb-1">Country Not Supported</h4>
                    <p className="text-sm">
                        World Bank data is not available for {selectedCountry}.
                        Please enter values manually or select a different country.
                    </p>
                </div>
            )}

            {/* Data Quality Notice */}
            {hasData && worldBankData?.hasErrors && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="text-amber-800 font-medium">Data Quality Notice</p>
                            <p className="text-amber-700">
                                Some indicators couldn't be fetched from World Bank.
                                Fallback estimates are used where data is unavailable.
                            </p>
                            <div className="mt-2 text-xs text-amber-600">
                                <p>Missing data: {Object.keys(worldBankData.errors || {}).join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MacroAutoFill;
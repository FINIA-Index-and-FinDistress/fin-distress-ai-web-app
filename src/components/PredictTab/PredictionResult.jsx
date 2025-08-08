import React from 'react';
import { AlertCircle, CheckCircle, Star, Lightbulb, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from "../common/Button";

const PredictionResult = ({ prediction }) => {
    if (!prediction) return null;

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel) {
            case 'High Risk':
                return 'text-red-600';
            case 'Medium Risk':
                return 'text-yellow-600';
            case 'Low Risk':
            case 'Very Low Risk':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'High':
                return 'text-red-600';
            case 'Medium':
                return 'text-yellow-600';
            case 'Low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`mt-8 rounded-3xl shadow-2xl border-2 transition-all duration-300 ${prediction.isDistressed
            ? 'bg-red-50/80 border-red-300'
            : 'bg-green-50/80 border-green-300'
            }`}>
            {/* Header */}
            <div className={`p-8 rounded-t-3xl ${prediction.isDistressed
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                <div className="flex items-center mb-4">
                    {prediction.isDistressed ? (
                        <AlertCircle className="h-10 w-10 text-white mr-4" />
                    ) : (
                        <CheckCircle className="h-10 w-10 text-white mr-4" />
                    )}
                    <div>
                        <h3 className="text-3xl font-bold text-white">
                            {prediction.isDistressed ? 'High Risk Detected' : 'Financial Health Stable'}
                        </h3>
                        <p className="text-white/90 mt-1">
                            Risk Level: <span className="font-semibold">{prediction.riskLevel}</span>
                        </p>
                    </div>
                </div>
                <p className="text-white/95 text-lg leading-relaxed">
                    {prediction.message}
                </p>
            </div>

            <div className="p-8 space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">Distress Probability</h4>
                            {prediction.isDistressed ? (
                                <TrendingUp className="h-5 w-5 text-red-500" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-green-500" />
                            )}
                        </div>
                        <div className="text-3xl font-bold">
                            <span className={prediction.probability > 0.5 ? 'text-red-600' : 'text-green-600'}>
                                {(prediction.probability * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-1000 ${prediction.probability > 0.5 ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(prediction.probability * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">Model Confidence</h4>
                            <PieChart className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="text-3xl font-bold text-indigo-600">
                            {(prediction.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${prediction.confidence * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">Risk Category</h4>
                            <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className={`text-3xl font-bold ${getRiskLevelColor(prediction.riskLevel)}`}>
                            {prediction.riskLevel}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {prediction.riskLevel === 'High Risk' && 'Immediate attention required'}
                            {prediction.riskLevel === 'Medium Risk' && 'Monitor closely'}
                            {(prediction.riskLevel === 'Low Risk' || prediction.riskLevel === 'Very Low Risk') && 'Maintain current practices'}
                        </p>
                    </div>
                </div>

                {/* Key Factors */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Key Influencing Factors
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {prediction.keyFactors.map((factor, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-gray-800 text-sm">{factor.factor}</h5>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                                        factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {factor.impact}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className={`font-semibold ${getImpactColor(factor.impact)}`}>
                                        {factor.impact} Impact
                                    </span>
                                    <span className="ml-auto text-sm text-gray-600">
                                        Weight: {(factor.value * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                        Strategic Recommendations
                    </h4>
                    <div className="space-y-3">
                        {prediction.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 mt-0.5 ${prediction.isDistressed ? 'bg-red-500' : 'bg-green-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timestamp */}
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Prediction generated on: <span className="font-medium">{formatTimestamp(prediction.timestamp)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PredictionResult;
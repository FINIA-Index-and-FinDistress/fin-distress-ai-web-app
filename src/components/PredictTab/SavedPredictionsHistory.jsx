import React from 'react';
import { BookOpen, Eye, Trash2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { usePrediction } from '../../context/PredictionContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from "../common/Button";

const SavedPredictionsHistory = () => {
    const { predictions, isLoading, error, setCurrentPrediction, deletePrediction } = usePrediction();
    const { authState } = useAuth();
    const { addNotification } = useNotifications();

    if (!authState.isAuthenticated) {
        return (
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Sign in to Save Predictions</h3>
                <p className="text-gray-600">
                    Create an account to automatically save your prediction history and access them anytime.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Predictions...</h3>
                <p className="text-gray-600">Please wait while we fetch your prediction history.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Predictions</h3>
                <p className="text-gray-600">{error.message || 'Failed to load prediction history. Please try again.'}</p>
            </div>
        );
    }

    if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
        return (
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Predictions Yet</h3>
                <p className="text-gray-600">
                    Your prediction history will appear here once you generate your first prediction.
                </p>
            </div>
        );
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRiskBadgeColor = (riskCategory) => {
        switch (riskCategory) {
            case 'High':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low':
            case 'Very Low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePrediction(id);
            addNotification('Prediction deleted successfully', 'success');
        } catch (error) {
            addNotification('Failed to delete prediction', 'error');
        }
    };

    return (
        <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                    <BookOpen className="h-6 w-6 mr-3" />
                    Prediction History
                </h3>
                <p className="text-indigo-100 mt-2">
                    {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            <div className="p-8">
                <div className="space-y-4">
                    {predictions.map((prediction) => (
                        <div
                            key={prediction.id}
                            className={`p-6 rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${prediction.risk_category === 'High'
                                    ? 'bg-red-50 border-red-200 hover:border-red-300'
                                    : 'bg-green-50 border-green-200 hover:border-green-300'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {prediction.risk_category === 'High' ? (
                                            <TrendingUp className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <TrendingDown className="h-5 w-5 text-green-500" />
                                        )}
                                        <h4 className="font-semibold text-gray-800">
                                            {prediction.risk_category} Detection
                                        </h4>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskBadgeColor(prediction.risk_category)}`}>
                                            {prediction.risk_category}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Probability:</span>{' '}
                                            <span className={`font-semibold ${prediction.financial_distress_probability > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                                                {(prediction.financial_distress_probability * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Confidence:</span>{' '}
                                            <span className="font-semibold text-indigo-600">
                                                {(prediction.model_confidence * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{formatTimestamp(prediction.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setCurrentPrediction(prediction)}
                                        variant="primary"
                                        icon={Eye}
                                    >
                                        <span className="hidden sm:inline">View Details</span>
                                    </Button>

                                    <Button
                                        onClick={() => handleDelete(prediction.id)}
                                        variant="danger"
                                        icon={Trash2}
                                    >
                                        <span className="hidden sm:inline">Delete</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-2 font-medium">Key Risk Factors:</p>
                                <div className="flex flex-wrap gap-2">
                                    {prediction.key_influencing_factors?.slice(0, 3).map((factor, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 text-xs rounded-full ${factor.impact_level === 'High' ? 'bg-red-100 text-red-700' :
                                                    factor.impact_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {factor.name}
                                        </span>
                                    ))}
                                    {prediction.key_influencing_factors?.length > 3 && (
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                            +{prediction.key_influencing_factors.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {predictions.length >= 10 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-700 text-center">
                            <strong>Note:</strong> Only the 10 most recent predictions are displayed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPredictionsHistory;
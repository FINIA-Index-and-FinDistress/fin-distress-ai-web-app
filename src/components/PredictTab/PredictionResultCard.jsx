import React from 'react';
// Ensure all used FA icons are imported from react-icons/fa
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import Card from '../common/Card';
// Removed Button import as the Save button is no longer needed here

const PredictionResultCard = ({ prediction }) => { // Changed prop from 'result' to 'prediction'
    if (!prediction) return null;

    // Map backend prediction data to display properties for this card
    const displayRiskLevel = prediction.riskCategory; // Use riskCategory directly from backend
    const displayProbability = (prediction.financial_distress_probability * 100).toFixed(1);
    const displayMessage = prediction.analysis_message;
    // Ensure timestamp is treated as UTC if it's an ISO string from backend
    const displayDate = new Date(prediction.created_at).toLocaleString();

    let riskColorClass = '';
    let riskIcon;

    // Adjusting switch cases to match backend's risk categories
    switch (displayRiskLevel) {
        case 'Very Low Risk':
        case 'Low Risk':
            riskColorClass = 'bg-green-500 text-white'; // Using a direct Tailwind color for simplicity
            riskIcon = <FaCheckCircle />;
            break;
        case 'Medium Risk':
            riskColorClass = 'bg-yellow-500 text-white';
            riskIcon = <FaExclamationTriangle />;
            break;
        case 'High Risk':
            riskColorClass = 'bg-red-500 text-white'; // Using a direct Tailwind color for simplicity
            riskIcon = <FaTimesCircle />;
            break;
        default:
            riskColorClass = 'bg-gray-500 text-white';
            riskIcon = <FaInfoCircle />;
    }

    return (
        <Card className="animate-popIn text-center">
            <div className={`p-4 rounded-t-lg ${riskColorClass} flex items-center justify-center space-x-2 text-2xl font-bold mb-4`}>
                {riskIcon}
                <span>Risk Level: {displayRiskLevel}</span>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Prediction Results</h3>
            <p className="text-4xl font-extrabold text-primary-indigo mb-4">
                Probability: {displayProbability}%
            </p>
            <p className="text-text-medium mb-4 italic">{displayMessage}</p>
            <p className="text-sm text-gray-500 mb-6">Predicted on: {displayDate}</p>

            {/* The "Save Prediction" button is removed here because prediction saving is now handled
                automatically by the generatePrediction function in PredictionContext, which
                persists the prediction to the backend database. */}
        </Card>
    );
};

export default PredictionResultCard;

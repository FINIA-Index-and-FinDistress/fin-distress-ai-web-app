

import React from 'react';
import HeroSection from './HeroSection';
import StatsCards from './StatsCards';
import PredictionForm from './PredictionForm';
import PredictionResult from './PredictionResult';
import SavedPredictionsHistory from './SavedPredictionsHistory';
import { usePrediction } from '../../context/PredictionContext';

/**
 * PredictTab - Main prediction interface component
 * Combines all prediction-related components in a cohesive layout
 */
const PredictTab = () => {
    const { currentPrediction } = usePrediction();

    return (
        <div className="space-y-8">
            {/* Hero section with welcome message and overview */}
            <HeroSection />

            {/* Statistics cards showing key metrics */}
            <StatsCards />

            {/* Main prediction form */}
            <PredictionForm />

            {/* Show prediction results when available */}
            {currentPrediction && (
                <PredictionResult prediction={currentPrediction} />
            )}

            {/* Historical predictions for authenticated users */}
            <SavedPredictionsHistory />
        </div>
    );
};

export default PredictTab;
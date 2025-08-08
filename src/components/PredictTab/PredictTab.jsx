import React from 'react';
import HeroSection from './HeroSection';
import StatsCards from './StatsCards';
import PredictionForm from './PredictionForm';
import PredictionResult from './PredictionResult';
import SavedPredictionsHistory from './SavedPredictionsHistory';
import { usePrediction } from '../../context/PredictionContext';

const PredictTab = () => {
    const { currentPrediction } = usePrediction();

    return (
        <div className="space-y-8">
            <HeroSection />
            <StatsCards />
            <PredictionForm />
            {currentPrediction && <PredictionResult prediction={currentPrediction} />}
            <SavedPredictionsHistory />
        </div>
    );
};

export default PredictTab;
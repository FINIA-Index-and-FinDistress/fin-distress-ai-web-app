import React from 'react';

const HeroSection = () => {
    return (
        <div className="text-center py-12 relative">
            <h2 className="text-5xl font-bold text-gradient-main mb-6 leading-tight">
                AI-Powered Financial Health Assessment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Leverage advanced machine learning to predict financial distress with{' '}
                <span className="font-semibold text-indigo-600">85%+ accuracy</span>.
                Make informed decisions with real-time risk assessment.
            </p>

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulseSlow"></div>
            </div>
        </div>
    );
};

export default HeroSection;
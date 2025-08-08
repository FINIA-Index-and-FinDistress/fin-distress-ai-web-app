// BackgroundShapes.jsx - Enhanced animated background
import React from 'react';

const BackgroundShapes = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary animated background elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full opacity-30 animate-pulse"
                style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full opacity-30 animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

            {/* Secondary floating elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full opacity-40 animate-bounce"
                style={{ animationDuration: '6s', animationDelay: '0s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-green-300/30 to-blue-300/30 rounded-full opacity-40 animate-bounce"
                style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full opacity-40 animate-bounce"
                style={{ animationDuration: '8s', animationDelay: '4s' }}></div>

            {/* Professional grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.3) 1px, transparent 0),
                        linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px, 50px 50px, 50px 50px'
                }}></div>
            </div>

            {/* Subtle corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full"></div>
        </div>
    );
};

export default BackgroundShapes;
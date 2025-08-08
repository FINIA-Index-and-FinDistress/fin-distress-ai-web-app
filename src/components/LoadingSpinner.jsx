import React from 'react';

/**
 * Loading Spinner Component for FinDistress AI
 * Provides consistent loading states across the application
 */
const LoadingSpinner = ({
    size = 'medium',
    color = 'indigo',
    text = null,
    className = '',
    fullScreen = false
}) => {
    // Size configurations
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    // Color configurations
    const colorClasses = {
        indigo: 'border-indigo-600',
        blue: 'border-blue-600',
        green: 'border-green-600',
        red: 'border-red-600',
        gray: 'border-gray-600',
        white: 'border-white'
    };

    // Text size based on spinner size
    const textSizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        xl: 'text-xl'
    };

    const spinnerClass = `
        ${sizeClasses[size]} 
        border-4 border-gray-200 
        ${colorClasses[color]} 
        border-t-transparent 
        rounded-full 
        animate-spin
        ${className}
    `.trim();

    const Spinner = () => (
        <div className="flex flex-col items-center justify-center space-y-4">
            {/* Spinner */}
            <div className={spinnerClass}></div>

            {/* Optional text */}
            {text && (
                <div className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
                    {text}
                </div>
            )}
        </div>
    );

    // Full screen loading overlay
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Spinner />
                </div>
            </div>
        );
    }

    return <Spinner />;
};

/**
 * Loading dots animation component
 */
export const LoadingDots = ({ className = '', color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-600',
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        red: 'bg-red-600',
        gray: 'bg-gray-600'
    };

    return (
        <div className={`flex space-x-1 ${className}`}>
            <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
    );
};

/**
 * Inline loading spinner for buttons
 */
export const ButtonSpinner = ({ size = 'small', color = 'white', className = '' }) => {
    return (
        <LoadingSpinner
            size={size}
            color={color}
            className={`inline-block ${className}`}
        />
    );
};

/**
 * Loading skeleton component
 */
export const LoadingSkeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
    return (
        <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
    );
};

/**
 * Card loading skeleton
 */
export const LoadingCard = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 ${className}`}>
            <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <LoadingSkeleton width="w-20" height="h-4" />
                    <LoadingSkeleton width="w-12" height="h-12" className="rounded-xl" />
                </div>
                <LoadingSkeleton width="w-16" height="h-8" className="mb-4" />
                <LoadingSkeleton width="w-full" height="h-1.5" className="mb-2" />
                <LoadingSkeleton width="w-24" height="h-3" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
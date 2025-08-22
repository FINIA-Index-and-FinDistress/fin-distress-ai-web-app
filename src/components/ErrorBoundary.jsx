

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component for handling React errors gracefully
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

      
        if (process.env.NODE_ENV === 'production') {
            
            console.error('Production error:', error.message);
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                        <div className="text-red-500 mb-6">
                            <AlertTriangle className="h-16 w-16 mx-auto" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We encountered an unexpected error. Don't worry, this has been logged
                            and our team will look into it.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
                                <p className="text-xs text-red-700 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo.componentStack && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-red-600 cursor-pointer">
                                            Component Stack
                                        </summary>
                                        <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Try Again</span>
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                            >
                                <Home className="h-4 w-4" />
                                <span>Go to Home</span>
                            </button>
                        </div>

                        {this.state.retryCount > 0 && (
                            <p className="text-xs text-gray-500 mt-4">
                                Retry attempts: {this.state.retryCount}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        // If no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;
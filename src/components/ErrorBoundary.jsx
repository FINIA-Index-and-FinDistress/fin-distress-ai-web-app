// // import React from 'react';

// // /**
// //  * Error Boundary Component for FinDistress AI
// //  * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
// //  */
// // class ErrorBoundary extends React.Component {
// //     constructor(props) {
// //         super(props);
// //         this.state = {
// //             hasError: false,
// //             error: null,
// //             errorInfo: null
// //         };
// //     }

// //     static getDerivedStateFromError(error) {
// //         // Update state so the next render will show the fallback UI
// //         return { hasError: true };
// //     }

// //     componentDidCatch(error, errorInfo) {
// //         // Log error details for debugging
// //         console.error('ErrorBoundary caught an error:', error, errorInfo);

// //         this.setState({
// //             error: error,
// //             errorInfo: errorInfo
// //         });

// //         // You can also log the error to an error reporting service here
// //         // reportErrorToService(error, errorInfo);
// //     }

// //     handleRetry = () => {
// //         this.setState({
// //             hasError: false,
// //             error: null,
// //             errorInfo: null
// //         });
// //     };

// //     handleReload = () => {
// //         window.location.reload();
// //     };

// //     render() {
// //         if (this.state.hasError) {
// //             return (
// //                 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
// //                     <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
// //                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
// //                             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
// //                             </svg>
// //                         </div>

// //                         <h2 className="text-2xl font-bold text-gray-900 mb-4">
// //                             Something went wrong
// //                         </h2>

// //                         <p className="text-gray-600 mb-6">
// //                             FinDistress AI encountered an unexpected error. Don't worry, your data is safe.
// //                         </p>

// //                         {/* Error details for development */}
// //                         {process.env.NODE_ENV === 'development' && this.state.error && (
// //                             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
// //                                 <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
// //                                 <pre className="text-xs text-red-700 overflow-auto max-h-32">
// //                                     {this.state.error.toString()}
// //                                     {this.state.errorInfo.componentStack}
// //                                 </pre>
// //                             </div>
// //                         )}

// //                         <div className="space-y-3">
// //                             <button
// //                                 onClick={this.handleRetry}
// //                                 className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
// //                             >
// //                                 Try Again
// //                             </button>

// //                             <button
// //                                 onClick={this.handleReload}
// //                                 className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
// //                             >
// //                                 Reload Page
// //                             </button>
// //                         </div>

// //                         <div className="mt-6 pt-6 border-t border-gray-200">
// //                             <p className="text-xs text-gray-500">
// //                                 If this problem persists, please contact support with the error details above.
// //                             </p>
// //                         </div>
// //                     </div>
// //                 </div>
// //             );
// //         }

// //         return this.props.children;
// //     }
// // }

// // export { ErrorBoundary };
// // export default ErrorBoundary;

// import React from 'react';
// import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// /**
//  * Error Boundary Component for handling React errors gracefully
//  */
// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             hasError: false,
//             error: null,
//             errorInfo: null,
//             retryCount: 0
//         };
//     }

//     static getDerivedStateFromError(error) {
//         // Update state so the next render will show the fallback UI
//         return { hasError: true };
//     }

//     componentDidCatch(error, errorInfo) {
//         // Log error details
//         console.error('Error Boundary caught an error:', error, errorInfo);

//         this.setState({
//             error: error,
//             errorInfo: errorInfo
//         });

//         // You can also log the error to an error reporting service here
//         if (process.env.NODE_ENV === 'production') {
//             // Log to external service in production
//             console.error('Production error:', error.message);
//         }
//     }

//     handleRetry = () => {
//         this.setState(prevState => ({
//             hasError: false,
//             error: null,
//             errorInfo: null,
//             retryCount: prevState.retryCount + 1
//         }));
//     };

//     handleGoHome = () => {
//         window.location.href = '/';
//     };

//     render() {
//         if (this.state.hasError) {
//             // Custom error UI
//             return (
//                 <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//                     <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
//                         <div className="text-red-500 mb-6">
//                             <AlertTriangle className="h-16 w-16 mx-auto" />
//                         </div>

//                         <h1 className="text-2xl font-bold text-gray-900 mb-4">
//                             Oops! Something went wrong
//                         </h1>

//                         <p className="text-gray-600 mb-6 leading-relaxed">
//                             We encountered an unexpected error. Don't worry, this has been logged
//                             and our team will look into it.
//                         </p>

//                         {process.env.NODE_ENV === 'development' && this.state.error && (
//                             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
//                                 <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
//                                 <p className="text-xs text-red-700 font-mono break-all">
//                                     {this.state.error.toString()}
//                                 </p>
//                                 {this.state.errorInfo.componentStack && (
//                                     <details className="mt-2">
//                                         <summary className="text-xs text-red-600 cursor-pointer">
//                                             Component Stack
//                                         </summary>
//                                         <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
//                                             {this.state.errorInfo.componentStack}
//                                         </pre>
//                                     </details>
//                                 )}
//                             </div>
//                         )}

//                         <div className="space-y-3">
//                             <button
//                                 onClick={this.handleRetry}
//                                 className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-medium"
//                             >
//                                 <RefreshCw className="h-4 w-4" />
//                                 <span>Try Again</span>
//                             </button>

//                             <button
//                                 onClick={this.handleGoHome}
//                                 className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-medium"
//                             >
//                                 <Home className="h-4 w-4" />
//                                 <span>Go to Home</span>
//                             </button>
//                         </div>

//                         {this.state.retryCount > 0 && (
//                             <p className="text-xs text-gray-500 mt-4">
//                                 Retry attempts: {this.state.retryCount}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             );
//         }

//         // If no error, render children normally
//         return this.props.children;
//     }
// }

// export default ErrorBoundary;

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

        // You can also log the error to an error reporting service here
        if (process.env.NODE_ENV === 'production') {
            // Log to external service in production
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
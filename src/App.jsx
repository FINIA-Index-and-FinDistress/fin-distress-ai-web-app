// // // import React, { useState, useEffect } from 'react';
// // // import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// // // import { AuthProvider, useAuth } from './context/AuthContext';
// // // import { NotificationProvider, useNotifications } from './context/NotificationContext';
// // // import { PredictionProvider } from './context/PredictionContext';
// // // import ErrorBoundary from './components/ErrorBoundary';
// // // import NotificationsContainer from './components/NotificationsContainer';
// // // import Header from './components/Header';
// // // import LoadingSpinner from './components/LoadingSpinner';
// // // import PredictTab from './components/PredictTab/PredictTab';
// // // import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
// // // import InsightsTab from './components/InsightsTab';
// // // import BackgroundShapes from './components/BackgroundShapes';
// // // import AuthModal from './components/AuthModal';
// // // import WelcomeScreen from './components/WelcomeScreen';
// // // import NavigationTabs from './components/NavigationTabs';
// // // import usePredictionData from './hooks/usePredictionData';
// // // import { Brain, BarChart2, Target, AlertCircle, RefreshCw, Lock, TrendingUp } from 'lucide-react';


// // // /**
// // //  * Protected Route Component
// // //  * Handles authentication checks for protected routes
// // //  */
// // // const ProtectedRoute = ({ children, requiresAuth = true, setShowAuthModal }) => {
// // //     const { user, loading } = useAuth();
// // //     const { addNotification } = useNotifications();

// // //     useEffect(() => {
// // //         if (!loading && requiresAuth && !user) {
// // //             addNotification('Please sign in to access this feature', 'warning');
// // //             setShowAuthModal(true);
// // //         }
// // //     }, [user, loading, requiresAuth, setShowAuthModal, addNotification]);

// // //     if (loading) {
// // //         return (
// // //             <div className="flex items-center justify-center py-16">
// // //                 <LoadingSpinner />
// // //             </div>
// // //         );
// // //     }

// // //     if (requiresAuth && !user) {
// // //         return <AuthRequiredMessage onSignIn={() => setShowAuthModal(true)} />;
// // //     }

// // //     return children;
// // // };

// // // /**
// // //  * Auth Required Message Component
// // //  */
// // // const AuthRequiredMessage = ({ onSignIn, tabName }) => (
// // //     <div className="text-center py-16">
// // //         <div className="max-w-md mx-auto">
// // //             <div className="mb-6">
// // //                 <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
// // //                     <Lock className="w-8 h-8 text-indigo-600" />
// // //                 </div>
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-gray-900 mb-2">
// // //                 Authentication Required
// // //             </h3>
// // //             <p className="text-gray-600 mb-6">
// // //                 Please sign in to access {tabName || 'this feature'} and view your personalized data.
// // //             </p>
// // //             <button
// // //                 onClick={onSignIn}
// // //                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// // //             >
// // //                 Sign In to Continue
// // //             </button>
// // //         </div>
// // //     </div>
// // // );

// // // /**
// // //  * Enhanced Analytics Tab with proper data handling
// // //  */
// // // const EnhancedAnalyticsTab = ({ setShowAuthModal }) => {
// // //     const { user } = useAuth();
// // //     const navigate = useNavigate();
// // //     const analyticsData = usePredictionData('analytics');

// // //     if (!user) {
// // //         return <AuthRequiredMessage tabName="Analytics" onSignIn={() => setShowAuthModal(true)} />;
// // //     }

// // //     if (analyticsData.isLoading) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
// // //                 <p className="text-gray-600">Loading analytics data...</p>
// // //             </div>
// // //         );
// // //     }

// // //     if (analyticsData.error) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <div className="text-red-600 mb-4">
// // //                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
// // //                     <p className="font-medium">Failed to load analytics</p>
// // //                     <p className="text-sm text-gray-600 mt-1">{analyticsData.error.message}</p>
// // //                 </div>
// // //                 <button
// // //                     onClick={analyticsData.refreshData}
// // //                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
// // //                 >
// // //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// // //                     Try Again
// // //                 </button>
// // //             </div>
// // //         );
// // //     }

// // //     if (!analyticsData.data || analyticsData.data.isEmpty) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// // //                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
// // //                 <p className="text-gray-600 mb-6">
// // //                     Make some predictions to see analytics and insights about your assessments.
// // //                 </p>
// // //                 <button
// // //                     onClick={() => navigate('/predict')}
// // //                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// // //                 >
// // //                     Start Predicting
// // //                 </button>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <div className="space-y-8">
// // //             <div className="flex justify-between items-center">
// // //                 <div>
// // //                     <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
// // //                     <p className="text-gray-600">Insights from your prediction history</p>
// // //                 </div>
// // //                 <button
// // //                     onClick={analyticsData.refreshData}
// // //                     className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
// // //                 >
// // //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// // //                     Refresh
// // //                 </button>
// // //             </div>

// // //             {/* Analytics Content */}
// // //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //                 {/* Key Metrics */}
// // //                 <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-sm font-medium text-gray-500">Total Predictions</h3>
// // //                         <p className="text-3xl font-bold text-gray-900">{analyticsData.data.totalPredictions || 0}</p>
// // //                     </div>
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-sm font-medium text-gray-500">Average Risk Score</h3>
// // //                         <p className="text-3xl font-bold text-gray-900">
// // //                             {((analyticsData.data.averageRiskScore || 0) * 100).toFixed(1)}%
// // //                         </p>
// // //                     </div>
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-sm font-medium text-gray-500">Data Quality</h3>
// // //                         <p className="text-3xl font-bold text-gray-900">{analyticsData.data.dataQuality || 'Unknown'}</p>
// // //                     </div>
// // //                 </div>

// // //                 {/* Risk Distribution Chart */}
// // //                 {analyticsData.data.riskDistribution && analyticsData.data.riskDistribution.length > 0 && (
// // //                     <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
// // //                         <div className="space-y-3">
// // //                             {analyticsData.data.riskDistribution.map((item, index) => (
// // //                                 <div key={index} className="flex items-center justify-between">
// // //                                     <span className="font-medium">{item.name}</span>
// // //                                     <span className="text-sm text-gray-600">
// // //                                         {item.value} ({item.percentage}%)
// // //                                     </span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Top Risk Factors */}
// // //                 {analyticsData.data.topRiskFactors && analyticsData.data.topRiskFactors.length > 0 && (
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4">Top Risk Factors</h3>
// // //                         <div className="space-y-3">
// // //                             {analyticsData.data.topRiskFactors.slice(0, 5).map((factor, index) => (
// // //                                 <div key={index} className="flex items-center justify-between">
// // //                                     <span className="text-sm font-medium">{factor.name}</span>
// // //                                     <span className={`text-xs px-2 py-1 rounded-full ${factor.impact === 'High' ? 'bg-red-100 text-red-800' :
// // //                                             factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
// // //                                                 'bg-green-100 text-green-800'
// // //                                         }`}>
// // //                                         {factor.impact}
// // //                                     </span>
// // //                                 </div>
// // //                             ))}
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // /**
// // //  * FIXED Enhanced Insights Tab with proper data handling and no object rendering
// // //  * This replaces the EnhancedInsightsTab component in your App.jsx file
// // //  */
// // // const EnhancedInsightsTab = ({ setShowAuthModal }) => {
// // //     const { user } = useAuth();
// // //     const navigate = useNavigate();
// // //     const insightsData = usePredictionData('insights');

// // //     if (!user) {
// // //         return <AuthRequiredMessage tabName="Insights" onSignIn={() => setShowAuthModal(true)} />;
// // //     }

// // //     if (insightsData.isLoading) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
// // //                 <p className="text-gray-600">Loading insights...</p>
// // //             </div>
// // //         );
// // //     }

// // //     if (insightsData.error) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <div className="text-red-600 mb-4">
// // //                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
// // //                     <p className="font-medium">Failed to load insights</p>
// // //                     <p className="text-sm text-gray-600 mt-1">
// // //                         {typeof insightsData.error === 'string' ? insightsData.error : insightsData.error?.message || 'Unknown error'}
// // //                     </p>
// // //                 </div>
// // //                 <button
// // //                     onClick={insightsData.refreshData}
// // //                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
// // //                 >
// // //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// // //                     Try Again
// // //                 </button>
// // //             </div>
// // //         );
// // //     }

// // //     if (!insightsData.data || insightsData.data.isEmpty) {
// // //         return (
// // //             <div className="text-center py-16">
// // //                 <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// // //                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Insights Available</h3>
// // //                 <p className="text-gray-600 mb-6">
// // //                     Generate some predictions to unlock personalized insights and recommendations.
// // //                 </p>
// // //                 <button
// // //                     onClick={() => navigate('/predict')}
// // //                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// // //                 >
// // //                     Start Predicting
// // //                 </button>
// // //             </div>
// // //         );
// // //     }

// // //     // CRITICAL FIX: Safe data extraction with proper fallbacks
// // //     const safeData = {
// // //         keyInsights: Array.isArray(insightsData.data.keyInsights) ? insightsData.data.keyInsights : [],
// // //         recommendations: Array.isArray(insightsData.data.recommendations) ? insightsData.data.recommendations :
// // //             Array.isArray(insightsData.data.actionable_recommendations) ? insightsData.data.actionable_recommendations : [],
// // //         riskAlerts: Array.isArray(insightsData.data.riskAlerts) ? insightsData.data.riskAlerts :
// // //             Array.isArray(insightsData.data.risk_alerts) ? insightsData.data.risk_alerts : [],
// // //         marketTrends: Array.isArray(insightsData.data.marketTrends) ? insightsData.data.marketTrends :
// // //             Array.isArray(insightsData.data.market_context) ? insightsData.data.market_context : []
// // //     };

// // //     return (
// // //         <div className="space-y-8">
// // //             <div className="flex justify-between items-center">
// // //                 <div>
// // //                     <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
// // //                     <p className="text-gray-600">Personalized recommendations and market intelligence</p>
// // //                 </div>
// // //                 <button
// // //                     onClick={insightsData.refreshData}
// // //                     className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
// // //                 >
// // //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// // //                     Refresh
// // //                 </button>
// // //             </div>

// // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //                 {/* Key Insights */}
// // //                 {safeData.keyInsights && safeData.keyInsights.length > 0 && (
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4 flex items-center">
// // //                             <Brain className="w-5 h-5 mr-2 text-blue-600" />
// // //                             Key Insights
// // //                         </h3>
// // //                         <div className="space-y-3">
// // //                             {safeData.keyInsights.map((insight, index) => {
// // //                                 // CRITICAL FIX: Ensure insight is rendered as string
// // //                                 const insightText = typeof insight === 'string' ? insight :
// // //                                     typeof insight === 'object' && insight?.text ? insight.text :
// // //                                         JSON.stringify(insight);

// // //                                 return (
// // //                                     <div key={index} className="p-3 bg-blue-50 rounded-lg">
// // //                                         <p className="text-sm text-gray-700">{insightText}</p>
// // //                                     </div>
// // //                                 );
// // //                             })}
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Recommendations */}
// // //                 {safeData.recommendations && safeData.recommendations.length > 0 && (
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4 flex items-center">
// // //                             <Target className="w-5 h-5 mr-2 text-green-600" />
// // //                             Recommendations
// // //                         </h3>
// // //                         <div className="space-y-3">
// // //                             {safeData.recommendations.map((rec, index) => {
// // //                                 // CRITICAL FIX: Ensure recommendation is rendered as string
// // //                                 let recText = '';

// // //                                 if (typeof rec === 'string') {
// // //                                     recText = rec;
// // //                                 } else if (typeof rec === 'object' && rec !== null) {
// // //                                     // Extract text from object safely
// // //                                     recText = rec.title || rec.action || rec.recommendation ||
// // //                                         (typeof rec.text === 'string' ? rec.text : '') ||
// // //                                         'Recommendation details not available';
// // //                                 } else {
// // //                                     recText = 'Invalid recommendation format';
// // //                                 }

// // //                                 return (
// // //                                     <div key={index} className="p-3 bg-green-50 rounded-lg">
// // //                                         <p className="text-sm text-gray-700">{recText}</p>
// // //                                     </div>
// // //                                 );
// // //                             })}
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Risk Alerts */}
// // //                 {safeData.riskAlerts && safeData.riskAlerts.length > 0 && (
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4 flex items-center">
// // //                             <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
// // //                             Risk Alerts
// // //                         </h3>
// // //                         <div className="space-y-3">
// // //                             {safeData.riskAlerts.map((alert, index) => {
// // //                                 // CRITICAL FIX: Ensure alert is rendered as string
// // //                                 let alertText = '';
// // //                                 let alertLevel = 'Medium';

// // //                                 if (typeof alert === 'string') {
// // //                                     alertText = alert;
// // //                                 } else if (typeof alert === 'object' && alert !== null) {
// // //                                     alertText = alert.message || alert.title || alert.alert ||
// // //                                         (typeof alert.text === 'string' ? alert.text : '') ||
// // //                                         'Alert details not available';
// // //                                     alertLevel = alert.level || alert.severity || 'Medium';
// // //                                 } else {
// // //                                     alertText = 'Invalid alert format';
// // //                                 }

// // //                                 const levelColors = {
// // //                                     'High': 'bg-red-50',
// // //                                     'Medium': 'bg-yellow-50',
// // //                                     'Low': 'bg-gray-50'
// // //                                 };

// // //                                 return (
// // //                                     <div key={index} className={`p-3 rounded-lg ${levelColors[alertLevel] || levelColors.Medium}`}>
// // //                                         <div className="flex justify-between items-start mb-1">
// // //                                             <span className={`text-xs font-medium px-2 py-1 rounded-full ${alertLevel === 'High' ? 'bg-red-100 text-red-800' :
// // //                                                     alertLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
// // //                                                         'bg-gray-100 text-gray-800'
// // //                                                 }`}>
// // //                                                 {alertLevel}
// // //                                             </span>
// // //                                         </div>
// // //                                         <p className="text-sm text-gray-700">{alertText}</p>
// // //                                     </div>
// // //                                 );
// // //                             })}
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Market Trends */}
// // //                 {safeData.marketTrends && safeData.marketTrends.length > 0 && (
// // //                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
// // //                         <h3 className="text-lg font-semibold mb-4 flex items-center">
// // //                             <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
// // //                             Market Trends
// // //                         </h3>
// // //                         <div className="space-y-4">
// // //                             {safeData.marketTrends.map((trend, index) => {
// // //                                 // CRITICAL FIX: Ensure trend is rendered as string
// // //                                 let trendTitle = '';
// // //                                 let trendDescription = '';
// // //                                 let trendImpact = 'Medium';
// // //                                 let trendRecommendation = '';

// // //                                 if (typeof trend === 'string') {
// // //                                     trendTitle = trend;
// // //                                     trendDescription = 'Market trend information';
// // //                                 } else if (typeof trend === 'object' && trend !== null) {
// // //                                     trendTitle = trend.trend || trend.title || trend.name || `Market Trend ${index + 1}`;
// // //                                     trendDescription = trend.description || trend.desc || 'Description not available';
// // //                                     trendImpact = trend.impact || trend.level || 'Medium';
// // //                                     trendRecommendation = trend.recommendation || trend.action || '';
// // //                                 } else {
// // //                                     trendTitle = 'Invalid trend format';
// // //                                     trendDescription = 'Trend data processing error';
// // //                                 }

// // //                                 return (
// // //                                     <div key={index} className="border-l-4 border-purple-300 pl-4">
// // //                                         <div className="flex justify-between items-start mb-2">
// // //                                             <h4 className="font-medium text-gray-900">{trendTitle}</h4>
// // //                                             <span className={`text-xs px-2 py-1 rounded-full ${trendImpact === 'High' ? 'bg-red-100 text-red-800' :
// // //                                                     trendImpact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
// // //                                                         'bg-green-100 text-green-800'
// // //                                                 }`}>
// // //                                                 {trendImpact} Impact
// // //                                             </span>
// // //                                         </div>
// // //                                         <p className="text-sm text-gray-600 mb-2">{trendDescription}</p>
// // //                                         {trendRecommendation && (
// // //                                             <p className="text-xs text-gray-500 italic">{trendRecommendation}</p>
// // //                                         )}
// // //                                     </div>
// // //                                 );
// // //                             })}
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //             </div>

// // //             {/* Show fallback message if no data */}
// // //             {(!safeData.keyInsights || safeData.keyInsights.length === 0) &&
// // //                 (!safeData.recommendations || safeData.recommendations.length === 0) &&
// // //                 (!safeData.riskAlerts || safeData.riskAlerts.length === 0) &&
// // //                 (!safeData.marketTrends || safeData.marketTrends.length === 0) && (
// // //                     <div className="text-center py-8">
// // //                         <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// // //                         <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Insights</h3>
// // //                         <p className="text-gray-600">
// // //                             AI insights are being generated from your prediction data.
// // //                         </p>
// // //                     </div>
// // //                 )}
// // //         </div>
// // //     );
// // // };
// // // /**
// // //  * Main application content component with navigation handling
// // //  */
// // // const AppContent = () => {
// // //     const [showAuthModal, setShowAuthModal] = useState(false);
// // //     const [isInitialized, setIsInitialized] = useState(false);
// // //     const { user, loading, error: authError } = useAuth();
// // //     const location = useLocation();
// // //     const navigate = useNavigate();

// // //     // Determine active tab based on current route
// // //     const getActiveTabFromRoute = (pathname) => {
// // //         if (pathname === '/' || pathname === '/predict') return 'predict';
// // //         if (pathname === '/analytics') return 'analytics';
// // //         if (pathname === '/insights') return 'insights';
// // //         return 'predict';
// // //     };

// // //     const activeTab = getActiveTabFromRoute(location.pathname);

// // //     // Initialize application and handle authentication state
// // //     useEffect(() => {
// // //         const initializeApp = async () => {
// // //             try {
// // //                 // Check if user should see welcome screen (first time visitor)
// // //                 const hasVisited = localStorage.getItem('hasVisited');

// // //                 if (!loading) {
// // //                     if (!user && !hasVisited) {
// // //                         // First time visitor - show welcome then auth
// // //                         localStorage.setItem('hasVisited', 'true');
// // //                     }

// // //                     if (!user) {
// // //                         setShowAuthModal(false); // Let WelcomeScreen handle showing auth
// // //                     } else {
// // //                         setShowAuthModal(false);
// // //                     }

// // //                     setIsInitialized(true);
// // //                 }
// // //             } catch (error) {
// // //                 console.error('App initialization error:', error);
// // //                 setIsInitialized(true);
// // //             }
// // //         };

// // //         initializeApp();
// // //     }, [loading, user]);

// // //     // Handle tab changes with proper routing
// // //     const handleTabChange = (newTab) => {
// // //         const routes = {
// // //             predict: '/predict',
// // //             analytics: '/analytics',
// // //             insights: '/insights'
// // //         };

// // //         navigate(routes[newTab] || '/predict');
// // //     };

// // //     // Handle authentication requirement from NavigationTabs
// // //     const handleAuthRequired = (tabId) => {
// // //         console.log(`Authentication required for tab: ${tabId}`);
// // //         setShowAuthModal(true);
// // //     };

// // //     // Auto-redirect to predict tab if user logs out and is on protected tab
// // //     useEffect(() => {
// // //         const protectedTabs = ['/analytics', '/insights'];
// // //         if (!loading && !user && protectedTabs.includes(location.pathname)) {
// // //             navigate('/predict');
// // //         }
// // //     }, [user, loading, location.pathname, navigate]);

// // //     // Show loading spinner during initial load
// // //     if (loading || !isInitialized) {
// // //         return (
// // //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// // //                 <div className="text-center space-y-4">
// // //                     <LoadingSpinner size="large" />
// // //                     <div className="space-y-2">
// // //                         <h2 className="text-xl font-semibold text-gray-800">
// // //                             Loading FinDistress AI
// // //                         </h2>
// // //                         <p className="text-gray-600">
// // //                             Preparing your AI-powered business insights...
// // //                         </p>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         );
// // //     }

// // //     // Show error state if authentication fails
// // //     if (authError) {
// // //         return (
// // //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// // //                 <div className="text-center space-y-4 max-w-md mx-auto px-4">
// // //                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
// // //                         <AlertCircle className="w-8 h-8 text-red-600" />
// // //                     </div>
// // //                     <h2 className="text-xl font-semibold text-gray-800">Connection Error</h2>
// // //                     <p className="text-gray-600">
// // //                         Unable to connect to our financial analysis service. Please check your internet connection and try again.
// // //                     </p>
// // //                     <button
// // //                         onClick={() => window.location.reload()}
// // //                         className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
// // //                     >
// // //                         Try Again
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //         );
// // //     }

// // //     return (
// // //         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans relative overflow-x-hidden">
// // //             <BackgroundShapes />

// // //             {/* Main Header Navigation - Only show when user is logged in */}
// // //             {user && (
// // //                 <Header
// // //                     activeTab={activeTab}
// // //                     setActiveTab={handleTabChange}
// // //                     setShowAuthModal={setShowAuthModal}
// // //                 />
// // //             )}

// // //             {/* Global Notifications */}
// // //             <NotificationsContainer />

// // //             {/* Main Content Area */}
// // //             <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${user ? 'py-6 sm:py-8' : 'py-12'} relative z-10`}>
// // //                 {!user ? (
// // //                     <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
// // //                 ) : (
// // //                     <ErrorBoundary>
// // //                         {/* Mobile Navigation Tabs - only show for authenticated users */}
// // //                         <NavigationTabs
// // //                             activeTab={activeTab}
// // //                             setActiveTab={handleTabChange}
// // //                             onAuthRequired={handleAuthRequired}
// // //                         />

// // //                         <div className="transition-all duration-300 ease-in-out">
// // //                             <Routes>
// // //                                 <Route
// // //                                     path="/"
// // //                                     element={
// // //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// // //                                             <PredictTab />
// // //                                         </ProtectedRoute>
// // //                                     }
// // //                                 />
// // //                                 <Route
// // //                                     path="/predict"
// // //                                     element={
// // //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// // //                                             <PredictTab />
// // //                                         </ProtectedRoute>
// // //                                     }
// // //                                 />
// // //                                 <Route
// // //                                     path="/analytics"
// // //                                     element={
// // //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// // //                                             <AnalyticsTab setShowAuthModal={setShowAuthModal} />
// // //                                         </ProtectedRoute>
// // //                                     }
// // //                                 />
// // //                                 <Route
// // //                                     path="/insights"
// // //                                     element={
// // //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// // //                                             <EnhancedInsightsTab setShowAuthModal={setShowAuthModal} />
// // //                                         </ProtectedRoute>
// // //                                     }
// // //                                 />
// // //                                 <Route path="*" element={<Navigate to="/" replace />} />
// // //                             </Routes>
// // //                         </div>
// // //                     </ErrorBoundary>
// // //                 )}
// // //             </main>

// // //             {/* Authentication Modal */}
// // //             <AuthModal
// // //                 showAuthModal={showAuthModal}
// // //                 setShowAuthModal={setShowAuthModal}
// // //                 onSuccess={() => {
// // //                     setShowAuthModal(false);
// // //                     // Optional: Show success notification or navigate to a specific tab
// // //                 }}
// // //             />

// // //             {/* Footer for Conference Presentation - Only show when user is logged in */}
// // //             {user && (
// // //                 <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
// // //                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// // //                         <div className="text-center text-sm text-gray-600">
// // //                             <p className="mb-2">
// // //                                 <span className="font-semibold text-indigo-600">FinDistress AI</span> -
// // //                                 Professional Financial Health Analysis Platform
// // //                             </p>
// // //                             <p className="text-xs">
// // //                                 Powered by Advanced Machine Learning •
// // //                                 Real-time Risk Assessment •
// // //                                 Business-Friendly Insights
// // //                             </p>
// // //                         </div>
// // //                     </div>
// // //                 </footer>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // // // MINOR UPDATE TO YOUR APP.JSX - REPLACE THE EXISTING AppContent COMPONENT

// // // // /**
// // // //  * Main application content component with navigation handling
// // // //  */
// // // // const AppContent = () => {
// // // //     const [showAuthModal, setShowAuthModal] = useState(false);
// // // //     const [isInitialized, setIsInitialized] = useState(false);
// // // //     const { user, loading, isAuthenticated } = useAuth(); // UPDATED: Use isAuthenticated instead of user check
// // // //     const location = useLocation();
// // // //     const navigate = useNavigate();

// // // //     // Determine active tab based on current route
// // // //     const getActiveTabFromRoute = (pathname) => {
// // // //         if (pathname === '/' || pathname === '/predict') return 'predict';
// // // //         if (pathname === '/analytics') return 'analytics';
// // // //         if (pathname === '/insights') return 'insights';
// // // //         return 'predict';
// // // //     };

// // // //     const activeTab = getActiveTabFromRoute(location.pathname);

// // // //     // Initialize application and handle authentication state
// // // //     useEffect(() => {
// // // //         const initializeApp = async () => {
// // // //             try {
// // // //                 // Check if user should see welcome screen (first time visitor)
// // // //                 const hasVisited = localStorage.getItem('hasVisited');

// // // //                 if (!loading) {
// // // //                     if (!isAuthenticated && !hasVisited) {
// // // //                         // First time visitor - show welcome then auth
// // // //                         localStorage.setItem('hasVisited', 'true');
// // // //                     }

// // // //                     if (!isAuthenticated) {
// // // //                         setShowAuthModal(false); // Let WelcomeScreen handle showing auth
// // // //                     } else {
// // // //                         setShowAuthModal(false);
// // // //                     }

// // // //                     setIsInitialized(true);
// // // //                 }
// // // //             } catch (error) {
// // // //                 console.error('App initialization error:', error);
// // // //                 setIsInitialized(true);
// // // //             }
// // // //         };

// // // //         initializeApp();
// // // //     }, [loading, isAuthenticated]);

// // // //     // Handle tab changes with proper routing
// // // //     const handleTabChange = (newTab) => {
// // // //         const routes = {
// // // //             predict: '/predict',
// // // //             analytics: '/analytics',
// // // //             insights: '/insights'
// // // //         };

// // // //         navigate(routes[newTab] || '/predict');
// // // //     };

// // // //     // Handle authentication requirement from NavigationTabs
// // // //     const handleAuthRequired = (tabId) => {
// // // //         console.log(`Authentication required for tab: ${tabId}`);
// // // //         setShowAuthModal(true);
// // // //     };

// // // //     // Auto-redirect to predict tab if user logs out and is on protected tab
// // // //     useEffect(() => {
// // // //         const protectedTabs = ['/analytics', '/insights'];
// // // //         if (!loading && !isAuthenticated && protectedTabs.includes(location.pathname)) {
// // // //             navigate('/predict');
// // // //         }
// // // //     }, [isAuthenticated, loading, location.pathname, navigate]);

// // // //     // Show loading spinner during initial load
// // // //     if (loading || !isInitialized) {
// // // //         return (
// // // //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// // // //                 <div className="text-center space-y-4">
// // // //                     <LoadingSpinner size="large" />
// // // //                     <div className="space-y-2">
// // // //                         <h2 className="text-xl font-semibold text-gray-800">
// // // //                             Loading FinDistress AI
// // // //                         </h2>
// // // //                         <p className="text-gray-600">
// // // //                             Preparing your AI-powered business insights...
// // // //                         </p>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans relative overflow-x-hidden">
// // // //             <BackgroundShapes />

// // // //             {/* Main Header Navigation - Only show when user is logged in */}
// // // //             {isAuthenticated && (
// // // //                 <Header
// // // //                     activeTab={activeTab}
// // // //                     setActiveTab={handleTabChange}
// // // //                     setShowAuthModal={setShowAuthModal}
// // // //                 />
// // // //             )}

// // // //             {/* Global Notifications */}
// // // //             <NotificationsContainer />

// // // //             {/* Main Content Area */}
// // // //             <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isAuthenticated ? 'py-6 sm:py-8' : 'py-12'} relative z-10`}>
// // // //                 {!isAuthenticated ? (
// // // //                     <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
// // // //                 ) : (
// // // //                     <ErrorBoundary>
// // // //                         {/* Mobile Navigation Tabs - only show for authenticated users */}
// // // //                         <NavigationTabs
// // // //                             activeTab={activeTab}
// // // //                             setActiveTab={handleTabChange}
// // // //                             onAuthRequired={handleAuthRequired}
// // // //                         />

// // // //                         <div className="transition-all duration-300 ease-in-out">
// // // //                             <Routes>
// // // //                                 <Route
// // // //                                     path="/"
// // // //                                     element={
// // // //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// // // //                                             <PredictTab />
// // // //                                         </ProtectedRoute>
// // // //                                     }
// // // //                                 />
// // // //                                 <Route
// // // //                                     path="/predict"
// // // //                                     element={
// // // //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// // // //                                             <PredictTab />
// // // //                                         </ProtectedRoute>
// // // //                                     }
// // // //                                 />
// // // //                                 <Route
// // // //                                     path="/analytics"
// // // //                                     element={
// // // //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// // // //                                             <EnhancedAnalyticsTab setShowAuthModal={setShowAuthModal} />
// // // //                                         </ProtectedRoute>
// // // //                                     }
// // // //                                 />
// // // //                                 <Route
// // // //                                     path="/insights"
// // // //                                     element={
// // // //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// // // //                                             <EnhancedInsightsTab setShowAuthModal={setShowAuthModal} />
// // // //                                         </ProtectedRoute>
// // // //                                     }
// // // //                                 />
// // // //                                 <Route path="*" element={<Navigate to="/" replace />} />
// // // //                             </Routes>
// // // //                         </div>
// // // //                     </ErrorBoundary>
// // // //                 )}
// // // //             </main>

// // // //             {/* Authentication Modal */}
// // // //             <AuthModal
// // // //                 showAuthModal={showAuthModal}
// // // //                 setShowAuthModal={setShowAuthModal}
// // // //                 onSuccess={() => {
// // // //                     setShowAuthModal(false);
// // // //                     // Optional: Show success notification or navigate to a specific tab
// // // //                 }}
// // // //             />

// // // //             {/* Footer for Conference Presentation - Only show when user is logged in */}
// // // //             {isAuthenticated && (
// // // //                 <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
// // // //                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// // // //                         <div className="text-center text-sm text-gray-600">
// // // //                             <p className="mb-2">
// // // //                                 <span className="font-semibold text-indigo-600">FinDistress AI</span> -
// // // //                                 Professional Financial Health Analysis Platform
// // // //                             </p>
// // // //                             <p className="text-xs">
// // // //                                 Powered by Advanced Machine Learning •
// // // //                                 Real-time Risk Assessment •
// // // //                                 Business-Friendly Insights
// // // //                             </p>
// // // //                         </div>
// // // //                     </div>
// // // //                 </footer>
// // // //             )}
// // // //         </div>
// // // //     );
// // // // };
// // // /**
// // //  * Root Application Component with Context Providers
// // //  * Sets up global state management and error boundaries
// // //  */
// // // const App = () => {
// // //     return (
// // //         <ErrorBoundary>
// // //             <BrowserRouter>
// // //                 <NotificationProvider>
// // //                     <AuthProvider>
// // //                         <PredictionProvider>
// // //                             <AppContent />
// // //                         </PredictionProvider>
// // //                     </AuthProvider>
// // //                 </NotificationProvider>
// // //             </BrowserRouter>
// // //         </ErrorBoundary>
// // //     );
// // // };

// // // export default App;

// // import React, { useState, useEffect } from 'react';
// // import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// // import { AuthProvider, useAuth } from './context/AuthContext';
// // import { NotificationProvider, useNotifications } from './context/NotificationContext';
// // import { PredictionProvider } from './context/PredictionContext';
// // import ErrorBoundary from './components/ErrorBoundary';
// // import NotificationsContainer from './components/NotificationsContainer';
// // import Header from './components/Header';
// // import LoadingSpinner from './components/LoadingSpinner';
// // import PredictTab from './components/PredictTab/PredictTab';
// // import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
// // import InsightsTab from './components/InsightsTab';
// // import BackgroundShapes from './components/BackgroundShapes';
// // import AuthModal from './components/AuthModal';
// // import WelcomeScreen from './components/WelcomeScreen';
// // import NavigationTabs from './components/NavigationTabs';
// // import usePredictionData from './hooks/usePredictionData';
// // import { Brain, BarChart2, Target, AlertCircle, RefreshCw, Lock, TrendingUp } from 'lucide-react';

// // /**
// //  * FIXED Protected Route Component
// //  */
// // const ProtectedRoute = ({ children, requiresAuth = true, setShowAuthModal }) => {
// //     const { user, loading } = useAuth();
// //     const { addNotification } = useNotifications();

// //     useEffect(() => {
// //         if (!loading && requiresAuth && !user) {
// //             if (addNotification) {
// //                 addNotification('Please sign in to access this feature', 'warning');
// //             }
// //             if (setShowAuthModal) {
// //                 setShowAuthModal(true);
// //             }
// //         }
// //     }, [user, loading, requiresAuth, setShowAuthModal, addNotification]);

// //     if (loading) {
// //         return (
// //             <div className="flex items-center justify-center py-16">
// //                 <LoadingSpinner />
// //             </div>
// //         );
// //     }

// //     if (requiresAuth && !user) {
// //         return <AuthRequiredMessage onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
// //     }

// //     return children;
// // };

// // /**
// //  * FIXED Auth Required Message Component
// //  */
// // const AuthRequiredMessage = ({ onSignIn, tabName }) => (
// //     <div className="text-center py-16">
// //         <div className="max-w-md mx-auto">
// //             <div className="mb-6">
// //                 <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
// //                     <Lock className="w-8 h-8 text-indigo-600" />
// //                 </div>
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-900 mb-2">
// //                 Authentication Required
// //             </h3>
// //             <p className="text-gray-600 mb-6">
// //                 Please sign in to access {tabName || 'this feature'} and view your personalized data.
// //             </p>
// //             <button
// //                 onClick={onSignIn}
// //                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// //             >
// //                 Sign In to Continue
// //             </button>
// //         </div>
// //     </div>
// // );

// // /**
// //  * FIXED Enhanced Analytics Tab with safe data handling
// //  */
// // const EnhancedAnalyticsTab = ({ setShowAuthModal }) => {
// //     const { user } = useAuth();
// //     const navigate = useNavigate();

// //     // Safe hook usage with error boundary
// //     let analyticsData = { isLoading: true, error: null, data: null };
// //     try {
// //         analyticsData = usePredictionData('analytics');
// //     } catch (error) {
// //         console.error('Analytics data hook error:', error);
// //         analyticsData = { isLoading: false, error: error.message, data: null };
// //     }

// //     if (!user) {
// //         return <AuthRequiredMessage tabName="Analytics" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
// //     }

// //     if (analyticsData.isLoading) {
// //         return (
// //             <div className="text-center py-16">
// //                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
// //                 <p className="text-gray-600">Loading analytics data...</p>
// //             </div>
// //         );
// //     }

// //     if (analyticsData.error) {
// //         return (
// //             <div className="text-center py-16">
// //                 <div className="text-red-600 mb-4">
// //                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
// //                     <p className="font-medium">Failed to load analytics</p>
// //                     <p className="text-sm text-gray-600 mt-1">{analyticsData.error}</p>
// //                 </div>
// //                 <button
// //                     onClick={() => analyticsData.refreshData && analyticsData.refreshData()}
// //                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
// //                 >
// //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// //                     Try Again
// //                 </button>
// //             </div>
// //         );
// //     }

// //     if (!analyticsData.data || analyticsData.data.isEmpty) {
// //         return (
// //             <div className="text-center py-16">
// //                 <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
// //                 <p className="text-gray-600 mb-6">
// //                     Make some predictions to see analytics and insights about your assessments.
// //                 </p>
// //                 <button
// //                     onClick={() => navigate('/predict')}
// //                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// //                 >
// //                     Start Predicting
// //                 </button>
// //             </div>
// //         );
// //     }

// //     // Use the actual AnalyticsTab component
// //     return <AnalyticsTab setShowAuthModal={setShowAuthModal} />;
// // };

// // /**
// //  * FIXED Enhanced Insights Tab with safe data handling
// //  */
// // const EnhancedInsightsTab = ({ setShowAuthModal }) => {
// //     const { user } = useAuth();
// //     const navigate = useNavigate();

// //     // Safe hook usage with error boundary
// //     let insightsData = { isLoading: true, error: null, data: null };
// //     try {
// //         insightsData = usePredictionData('insights');
// //     } catch (error) {
// //         console.error('Insights data hook error:', error);
// //         insightsData = { isLoading: false, error: error.message, data: null };
// //     }

// //     if (!user) {
// //         return <AuthRequiredMessage tabName="Insights" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
// //     }

// //     if (insightsData.isLoading) {
// //         return (
// //             <div className="text-center py-16">
// //                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
// //                 <p className="text-gray-600">Loading insights...</p>
// //             </div>
// //         );
// //     }

// //     if (insightsData.error) {
// //         return (
// //             <div className="text-center py-16">
// //                 <div className="text-red-600 mb-4">
// //                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
// //                     <p className="font-medium">Failed to load insights</p>
// //                     <p className="text-sm text-gray-600 mt-1">
// //                         {typeof insightsData.error === 'string' ? insightsData.error : insightsData.error?.message || 'Unknown error'}
// //                     </p>
// //                 </div>
// //                 <button
// //                     onClick={() => insightsData.refreshData && insightsData.refreshData()}
// //                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
// //                 >
// //                     <RefreshCw className="w-4 h-4 mr-2 inline" />
// //                     Try Again
// //                 </button>
// //             </div>
// //         );
// //     }

// //     if (!insightsData.data || insightsData.data.isEmpty) {
// //         return (
// //             <div className="text-center py-16">
// //                 <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Insights Available</h3>
// //                 <p className="text-gray-600 mb-6">
// //                     Generate some predictions to unlock personalized insights and recommendations.
// //                 </p>
// //                 <button
// //                     onClick={() => navigate('/predict')}
// //                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
// //                 >
// //                     Start Predicting
// //                 </button>
// //             </div>
// //         );
// //     }

// //     // Use the actual InsightsTab component
// //     return <InsightsTab setShowAuthModal={setShowAuthModal} />;
// // };

// // /**
// //  * FIXED Main application content component
// //  */
// // const AppContent = () => {
// //     const [showAuthModal, setShowAuthModal] = useState(false);
// //     const [isInitialized, setIsInitialized] = useState(false);
// //     const location = useLocation();
// //     const navigate = useNavigate();

// //     // Safe auth hook usage
// //     let authData = { user: null, loading: true, error: null };
// //     try {
// //         authData = useAuth();
// //     } catch (error) {
// //         console.error('Auth hook error:', error);
// //         authData = { user: null, loading: false, error: error.message };
// //     }

// //     const { user, loading, error: authError } = authData;

// //     // Determine active tab based on current route
// //     const getActiveTabFromRoute = (pathname) => {
// //         if (pathname === '/' || pathname === '/predict') return 'predict';
// //         if (pathname === '/analytics') return 'analytics';
// //         if (pathname === '/insights') return 'insights';
// //         return 'predict';
// //     };

// //     const activeTab = getActiveTabFromRoute(location.pathname);

// //     // Initialize application
// //     useEffect(() => {
// //         const initializeApp = async () => {
// //             try {
// //                 if (!loading) {
// //                     const hasVisited = localStorage.getItem('hasVisited');

// //                     if (!user && !hasVisited) {
// //                         localStorage.setItem('hasVisited', 'true');
// //                     }

// //                     if (!user) {
// //                         setShowAuthModal(false);
// //                     } else {
// //                         setShowAuthModal(false);
// //                     }

// //                     setIsInitialized(true);
// //                 }
// //             } catch (error) {
// //                 console.error('App initialization error:', error);
// //                 setIsInitialized(true);
// //             }
// //         };

// //         initializeApp();
// //     }, [loading, user]);

// //     // Handle tab changes
// //     const handleTabChange = (newTab) => {
// //         const routes = {
// //             predict: '/predict',
// //             analytics: '/analytics',
// //             insights: '/insights'
// //         };
// //         navigate(routes[newTab] || '/predict');
// //     };

// //     // Handle authentication requirement
// //     const handleAuthRequired = (tabId) => {
// //         console.log(`Authentication required for tab: ${tabId}`);
// //         setShowAuthModal(true);
// //     };

// //     // Auto-redirect if user logs out on protected tab
// //     useEffect(() => {
// //         const protectedTabs = ['/analytics', '/insights'];
// //         if (!loading && !user && protectedTabs.includes(location.pathname)) {
// //             navigate('/predict');
// //         }
// //     }, [user, loading, location.pathname, navigate]);

// //     // Show loading during initialization
// //     if (loading || !isInitialized) {
// //         return (
// //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// //                 <div className="text-center space-y-4">
// //                     <LoadingSpinner size="large" />
// //                     <div className="space-y-2">
// //                         <h2 className="text-xl font-semibold text-gray-800">
// //                             Loading FinDistress AI
// //                         </h2>
// //                         <p className="text-gray-600">
// //                             Preparing your AI-powered business insights...
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     // Show error state
// //     if (authError) {
// //         return (
// //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// //                 <div className="text-center space-y-4 max-w-md mx-auto px-4">
// //                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
// //                         <AlertCircle className="w-8 h-8 text-red-600" />
// //                     </div>
// //                     <h2 className="text-xl font-semibold text-gray-800">Connection Error</h2>
// //                     <p className="text-gray-600">
// //                         Unable to connect to our financial analysis service. Please check your internet connection and try again.
// //                     </p>
// //                     <button
// //                         onClick={() => window.location.reload()}
// //                         className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
// //                     >
// //                         Try Again
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans relative overflow-x-hidden">
// //             <BackgroundShapes />

// //             {/* Main Header Navigation */}
// //             {user && (
// //                 <Header
// //                     activeTab={activeTab}
// //                     setActiveTab={handleTabChange}
// //                     setShowAuthModal={setShowAuthModal}
// //                 />
// //             )}

// //             {/* Global Notifications */}
// //             <NotificationsContainer />

// //             {/* Main Content */}
// //             <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${user ? 'py-6 sm:py-8' : 'py-12'} relative z-10`}>
// //                 {!user ? (
// //                     <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
// //                 ) : (
// //                     <ErrorBoundary>
// //                         {/* Mobile Navigation Tabs */}
// //                         <NavigationTabs
// //                             activeTab={activeTab}
// //                             setActiveTab={handleTabChange}
// //                             onAuthRequired={handleAuthRequired}
// //                         />

// //                         <div className="transition-all duration-300 ease-in-out">
// //                             <Routes>
// //                                 <Route
// //                                     path="/"
// //                                     element={
// //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// //                                             <PredictTab />
// //                                         </ProtectedRoute>
// //                                     }
// //                                 />
// //                                 <Route
// //                                     path="/predict"
// //                                     element={
// //                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
// //                                             <PredictTab />
// //                                         </ProtectedRoute>
// //                                     }
// //                                 />
// //                                 <Route
// //                                     path="/analytics"
// //                                     element={
// //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// //                                             <EnhancedAnalyticsTab setShowAuthModal={setShowAuthModal} />
// //                                         </ProtectedRoute>
// //                                     }
// //                                 />
// //                                 <Route
// //                                     path="/insights"
// //                                     element={
// //                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
// //                                             <EnhancedInsightsTab setShowAuthModal={setShowAuthModal} />
// //                                         </ProtectedRoute>
// //                                     }
// //                                 />
// //                                 <Route path="*" element={<Navigate to="/" replace />} />
// //                             </Routes>
// //                         </div>
// //                     </ErrorBoundary>
// //                 )}
// //             </main>

// //             {/* Authentication Modal */}
// //             <AuthModal
// //                 showAuthModal={showAuthModal}
// //                 setShowAuthModal={setShowAuthModal}
// //                 onSuccess={() => {
// //                     setShowAuthModal(false);
// //                 }}
// //             />

// //             {/* Footer */}
// //             {user && (
// //                 <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
// //                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //                         <div className="text-center text-sm text-gray-600">
// //                             <p className="mb-2">
// //                                 <span className="font-semibold text-indigo-600">FinDistress AI</span> -
// //                                 Professional Financial Health Analysis Platform
// //                             </p>
// //                             <p className="text-xs">
// //                                 Powered by Advanced Machine Learning •
// //                                 Real-time Risk Assessment •
// //                                 Business-Friendly Insights
// //                             </p>
// //                         </div>
// //                     </div>
// //                 </footer>
// //             )}
// //         </div>
// //     );
// // };

// // /**
// //  * FIXED Root Application Component
// //  */
// // const App = () => {
// //     return (
// //         <ErrorBoundary>
// //             <BrowserRouter>
// //                 <NotificationProvider>
// //                     <AuthProvider>
// //                         <PredictionProvider>
// //                             <AppContent />
// //                         </PredictionProvider>
// //                     </AuthProvider>
// //                 </NotificationProvider>
// //             </BrowserRouter>
// //         </ErrorBoundary>
// //     );
// // };

// // export default App;

// // src/App.jsx - COMPLETE VERSION with Preferences Commented Out
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { NotificationProvider, useNotifications } from './context/NotificationContext';
// import { PredictionProvider } from './context/PredictionContext';
// import ErrorBoundary from './components/ErrorBoundary';
// import NotificationsContainer from './components/NotificationsContainer';
// import Header from './components/Header';
// import LoadingSpinner from './components/LoadingSpinner';
// import PredictTab from './components/PredictTab/PredictTab';
// import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
// import InsightsTab from './components/InsightsTab';
// import BackgroundShapes from './components/BackgroundShapes';
// import AuthModal from './components/AuthModal';
// import WelcomeScreen from './components/WelcomeScreen';
// import NavigationTabs from './components/NavigationTabs';
// import usePredictionData from './hooks/usePredictionData';
// import { Brain, BarChart2, Target, AlertCircle, RefreshCw, Lock, TrendingUp } from 'lucide-react';

// // Import Profile component only (Preferences commented out)
// import ProfileSettings from './components/user/ProfileSettings';
// // COMMENTED OUT: Preferences import
// // import UserPreferences from './components/user/UserPreferences';

// /**
//  * FIXED Protected Route Component
//  */
// const ProtectedRoute = ({ children, requiresAuth = true, setShowAuthModal }) => {
//     const { user, loading } = useAuth();
//     const { addNotification } = useNotifications();

//     useEffect(() => {
//         if (!loading && requiresAuth && !user) {
//             if (addNotification) {
//                 addNotification('Please sign in to access this feature', 'warning');
//             }
//             if (setShowAuthModal) {
//                 setShowAuthModal(true);
//             }
//         }
//     }, [user, loading, requiresAuth, setShowAuthModal, addNotification]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center py-16">
//                 <LoadingSpinner />
//             </div>
//         );
//     }

//     if (requiresAuth && !user) {
//         return <AuthRequiredMessage onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
//     }

//     return children;
// };

// /**
//  * FIXED Auth Required Message Component
//  */
// const AuthRequiredMessage = ({ onSignIn, tabName }) => (
//     <div className="text-center py-16">
//         <div className="max-w-md mx-auto">
//             <div className="mb-6">
//                 <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
//                     <Lock className="w-8 h-8 text-indigo-600" />
//                 </div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Authentication Required
//             </h3>
//             <p className="text-gray-600 mb-6">
//                 Please sign in to access {tabName || 'this feature'} and view your personalized data.
//             </p>
//             <button
//                 onClick={onSignIn}
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
//             >
//                 Sign In to Continue
//             </button>
//         </div>
//     </div>
// );

// /**
//  * Profile Page Component
//  */
// const ProfilePage = ({ setShowAuthModal }) => {
//     const { user } = useAuth();

//     if (!user) {
//         return <AuthRequiredMessage tabName="Profile Settings" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <ProfileSettings />
//         </div>
//     );
// };

// // COMMENTED OUT: Preferences Page Component
// /*
// const PreferencesPage = ({ setShowAuthModal }) => {
//     const { user } = useAuth();

//     if (!user) {
//         return <AuthRequiredMessage tabName="Preferences" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <UserPreferences />
//         </div>
//     );
// };
// */

// /**
//  * FIXED Enhanced Analytics Tab with safe data handling
//  */
// const EnhancedAnalyticsTab = ({ setShowAuthModal }) => {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     // Safe hook usage with error boundary
//     let analyticsData = { isLoading: true, error: null, data: null };
//     try {
//         analyticsData = usePredictionData('analytics');
//     } catch (error) {
//         console.error('Analytics data hook error:', error);
//         analyticsData = { isLoading: false, error: error.message, data: null };
//     }

//     if (!user) {
//         return <AuthRequiredMessage tabName="Analytics" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
//     }

//     if (analyticsData.isLoading) {
//         return (
//             <div className="text-center py-16">
//                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
//                 <p className="text-gray-600">Loading analytics data...</p>
//             </div>
//         );
//     }

//     if (analyticsData.error) {
//         return (
//             <div className="text-center py-16">
//                 <div className="text-red-600 mb-4">
//                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
//                     <p className="font-medium">Failed to load analytics</p>
//                     <p className="text-sm text-gray-600 mt-1">{analyticsData.error}</p>
//                 </div>
//                 <button
//                     onClick={() => analyticsData.refreshData && analyticsData.refreshData()}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                     <RefreshCw className="w-4 h-4 mr-2 inline" />
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     if (!analyticsData.data || analyticsData.data.isEmpty) {
//         return (
//             <div className="text-center py-16">
//                 <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
//                 <p className="text-gray-600 mb-6">
//                     Make some predictions to see analytics and insights about your assessments.
//                 </p>
//                 <button
//                     onClick={() => navigate('/predict')}
//                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
//                 >
//                     Start Predicting
//                 </button>
//             </div>
//         );
//     }

//     // Use the actual AnalyticsTab component
//     return <AnalyticsTab setShowAuthModal={setShowAuthModal} />;
// };

// /**
//  * FIXED Enhanced Insights Tab with safe data handling
//  */
// const EnhancedInsightsTab = ({ setShowAuthModal }) => {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     // Safe hook usage with error boundary
//     let insightsData = { isLoading: true, error: null, data: null };
//     try {
//         insightsData = usePredictionData('insights');
//     } catch (error) {
//         console.error('Insights data hook error:', error);
//         insightsData = { isLoading: false, error: error.message, data: null };
//     }

//     if (!user) {
//         return <AuthRequiredMessage tabName="Insights" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
//     }

//     if (insightsData.isLoading) {
//         return (
//             <div className="text-center py-16">
//                 <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
//                 <p className="text-gray-600">Loading insights...</p>
//             </div>
//         );
//     }

//     if (insightsData.error) {
//         return (
//             <div className="text-center py-16">
//                 <div className="text-red-600 mb-4">
//                     <AlertCircle className="w-12 h-12 mx-auto mb-2" />
//                     <p className="font-medium">Failed to load insights</p>
//                     <p className="text-sm text-gray-600 mt-1">
//                         {typeof insightsData.error === 'string' ? insightsData.error : insightsData.error?.message || 'Unknown error'}
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => insightsData.refreshData && insightsData.refreshData()}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                     <RefreshCw className="w-4 h-4 mr-2 inline" />
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     if (!insightsData.data || insightsData.data.isEmpty) {
//         return (
//             <div className="text-center py-16">
//                 <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Insights Available</h3>
//                 <p className="text-gray-600 mb-6">
//                     Generate some predictions to unlock personalized insights and recommendations.
//                 </p>
//                 <button
//                     onClick={() => navigate('/predict')}
//                     className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
//                 >
//                     Start Predicting
//                 </button>
//             </div>
//         );
//     }

//     // Use the actual InsightsTab component
//     return <InsightsTab setShowAuthModal={setShowAuthModal} />;
// };

// /**
//  * FIXED Main application content component
//  */
// const AppContent = () => {
//     const [showAuthModal, setShowAuthModal] = useState(false);
//     const [isInitialized, setIsInitialized] = useState(false);
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Safe auth hook usage
//     let authData = { user: null, loading: true, error: null };
//     try {
//         authData = useAuth();
//     } catch (error) {
//         console.error('Auth hook error:', error);
//         authData = { user: null, loading: false, error: error.message };
//     }

//     const { user, loading, error: authError } = authData;

//     // Determine active tab based on current route (PREFERENCES COMMENTED OUT)
//     const getActiveTabFromRoute = (pathname) => {
//         if (pathname === '/' || pathname === '/predict') return 'predict';
//         if (pathname === '/analytics') return 'analytics';
//         if (pathname === '/insights') return 'insights';
//         if (pathname === '/profile') return 'profile';
//         // COMMENTED OUT: if (pathname === '/preferences') return 'preferences';
//         return 'predict';
//     };

//     const activeTab = getActiveTabFromRoute(location.pathname);

//     // Initialize application
//     useEffect(() => {
//         const initializeApp = async () => {
//             try {
//                 if (!loading) {
//                     const hasVisited = localStorage.getItem('hasVisited');

//                     if (!user && !hasVisited) {
//                         localStorage.setItem('hasVisited', 'true');
//                     }

//                     if (!user) {
//                         setShowAuthModal(false);
//                     } else {
//                         setShowAuthModal(false);
//                     }

//                     setIsInitialized(true);
//                 }
//             } catch (error) {
//                 console.error('App initialization error:', error);
//                 setIsInitialized(true);
//             }
//         };

//         initializeApp();
//     }, [loading, user]);

//     // Handle tab changes (PREFERENCES COMMENTED OUT)
//     const handleTabChange = (newTab) => {
//         const routes = {
//             predict: '/predict',
//             analytics: '/analytics',
//             insights: '/insights',
//             profile: '/profile',
//             // COMMENTED OUT: preferences: '/preferences'
//         };
//         navigate(routes[newTab] || '/predict');
//     };

//     // Handle authentication requirement
//     const handleAuthRequired = (tabId) => {
//         console.log(`Authentication required for tab: ${tabId}`);
//         setShowAuthModal(true);
//     };

//     // Auto-redirect if user logs out on protected tab (PREFERENCES COMMENTED OUT)
//     useEffect(() => {
//         const protectedTabs = ['/analytics', '/insights', '/profile'];
//         // COMMENTED OUT: const protectedTabs = ['/analytics', '/insights', '/profile', '/preferences'];
//         if (!loading && !user && protectedTabs.includes(location.pathname)) {
//             navigate('/predict');
//         }
//     }, [user, loading, location.pathname, navigate]);

//     // Show loading during initialization
//     if (loading || !isInitialized) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                     <LoadingSpinner size="large" />
//                     <div className="space-y-2">
//                         <h2 className="text-xl font-semibold text-gray-800">
//                             Loading FinDistress AI
//                         </h2>
//                         <p className="text-gray-600">
//                             Preparing your AI-powered business insights...
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Show error state
//     if (authError) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//                 <div className="text-center space-y-4 max-w-md mx-auto px-4">
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
//                         <AlertCircle className="w-8 h-8 text-red-600" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800">Connection Error</h2>
//                     <p className="text-gray-600">
//                         Unable to connect to our financial analysis service. Please check your internet connection and try again.
//                     </p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans relative overflow-x-hidden">
//             <BackgroundShapes />

//             {/* Main Header Navigation */}
//             {user && (
//                 <Header
//                     activeTab={activeTab}
//                     setActiveTab={handleTabChange}
//                     setShowAuthModal={setShowAuthModal}
//                 />
//             )}

//             {/* Global Notifications */}
//             <NotificationsContainer />

//             {/* Main Content */}
//             <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${user ? 'py-6 sm:py-8' : 'py-12'} relative z-10`}>
//                 {!user ? (
//                     <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
//                 ) : (
//                     <ErrorBoundary>
//                         {/* Mobile Navigation Tabs - only show for main tabs (PREFERENCES CONDITION COMMENTED OUT) */}
//                         {!location.pathname.startsWith('/profile') && (
//                             // COMMENTED OUT: {!location.pathname.startsWith('/profile') && !location.pathname.startsWith('/preferences') && (
//                             <NavigationTabs
//                                 activeTab={activeTab}
//                                 setActiveTab={handleTabChange}
//                                 onAuthRequired={handleAuthRequired}
//                             />
//                         )}

//                         <div className="transition-all duration-300 ease-in-out">
//                             <Routes>
//                                 <Route
//                                     path="/"
//                                     element={
//                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
//                                             <PredictTab />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 <Route
//                                     path="/predict"
//                                     element={
//                                         <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
//                                             <PredictTab />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 <Route
//                                     path="/analytics"
//                                     element={
//                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
//                                             <EnhancedAnalyticsTab setShowAuthModal={setShowAuthModal} />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 <Route
//                                     path="/insights"
//                                     element={
//                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
//                                             <EnhancedInsightsTab setShowAuthModal={setShowAuthModal} />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 <Route
//                                     path="/profile"
//                                     element={
//                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
//                                             <ProfilePage setShowAuthModal={setShowAuthModal} />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 {/* COMMENTED OUT: Preferences Route
//                                 <Route
//                                     path="/preferences"
//                                     element={
//                                         <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
//                                             <PreferencesPage setShowAuthModal={setShowAuthModal} />
//                                         </ProtectedRoute>
//                                     }
//                                 />
//                                 */}
//                                 <Route path="*" element={<Navigate to="/" replace />} />
//                             </Routes>
//                         </div>
//                     </ErrorBoundary>
//                 )}
//             </main>

//             {/* Authentication Modal */}
//             <AuthModal
//                 showAuthModal={showAuthModal}
//                 setShowAuthModal={setShowAuthModal}
//                 onSuccess={() => {
//                     setShowAuthModal(false);
//                 }}
//             />

//             {/* Footer */}
//             {user && (
//                 <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                         <div className="text-center text-sm text-gray-600">
//                             <p className="mb-2">
//                                 <span className="font-semibold text-indigo-600">FinDistress AI</span> -
//                                 Professional Financial Health Analysis Platform
//                             </p>
//                             <p className="text-xs">
//                                 Powered by Advanced Machine Learning •
//                                 Real-time Risk Assessment •
//                                 Business-Friendly Insights
//                             </p>
//                         </div>
//                     </div>
//                 </footer>
//             )}
//         </div>
//     );
// };

// /**
//  * FIXED Root Application Component
//  */
// const App = () => {
//     return (
//         <ErrorBoundary>
//             <BrowserRouter>
//                 <NotificationProvider>
//                     <AuthProvider>
//                         <PredictionProvider>
//                             <AppContent />
//                         </PredictionProvider>
//                     </AuthProvider>
//                 </NotificationProvider>
//             </BrowserRouter>
//         </ErrorBoundary>
//     );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { PredictionProvider } from './context/PredictionContext';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationsContainer from './components/NotificationsContainer';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import PredictTab from './components/PredictTab/PredictTab';
import AnalyticsTab from './components/AnalyticsTab/AnalyticsTab';
import InsightsTab from './components/InsightsTab';
import BackgroundShapes from './components/BackgroundShapes';
import AuthModal from './components/AuthModal';
import WelcomeScreen from './components/WelcomeScreen';
import NavigationTabs from './components/NavigationTabs';
import usePredictionData from './hooks/usePredictionData';
import { Brain, BarChart2, Target, AlertCircle, RefreshCw, Lock, TrendingUp } from 'lucide-react';

// Import Profile component only (Preferences commented out)
import ProfileSettings from './components/user/ProfileSettings';
// COMMENTED OUT: Preferences import
// import UserPreferences from './components/user/UserPreferences';

/**
 * FIXED Protected Route Component
 */
const ProtectedRoute = ({ children, requiresAuth = true, setShowAuthModal }) => {
    const { user, loading } = useAuth();
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (!loading && requiresAuth && !user) {
            if (addNotification) {
                addNotification('Please sign in to access this feature', 'warning');
            }
            if (setShowAuthModal) {
                setShowAuthModal(true);
            }
        }
    }, [user, loading, requiresAuth, setShowAuthModal, addNotification]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <LoadingSpinner />
            </div>
        );
    }

    if (requiresAuth && !user) {
        return <AuthRequiredMessage onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
    }

    return children;
};

/**
 * FIXED Auth Required Message Component
 */
const AuthRequiredMessage = ({ onSignIn, tabName }) => (
    <div className="text-center py-16">
        <div className="max-w-md mx-auto">
            <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-indigo-600" />
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Required
            </h3>
            <p className="text-gray-600 mb-6">
                Please sign in to access {tabName || 'this feature'} and view your personalized data.
            </p>
            <button
                onClick={onSignIn}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
                Sign In to Continue
            </button>
        </div>
    </div>
);

/**
 * Profile Page Component
 */
const ProfilePage = ({ setShowAuthModal }) => {
    const { user } = useAuth();

    if (!user) {
        return <AuthRequiredMessage tabName="Profile Settings" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ProfileSettings />
        </div>
    );
};

// COMMENTED OUT: Preferences Page Component
/*
const PreferencesPage = ({ setShowAuthModal }) => {
    const { user } = useAuth();

    if (!user) {
        return <AuthRequiredMessage tabName="Preferences" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <UserPreferences />
        </div>
    );
};
*/

/**
 * FIXED Enhanced Analytics Tab with safe data handling
 */
const EnhancedAnalyticsTab = ({ setShowAuthModal }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Safe hook usage with error boundary
    let analyticsData = { isLoading: true, error: null, data: null };
    try {
        analyticsData = usePredictionData('analytics');
    } catch (error) {
        console.error('Analytics data hook error:', error);
        analyticsData = { isLoading: false, error: error.message, data: null };
    }

    if (!user) {
        return <AuthRequiredMessage tabName="Analytics" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
    }

    if (analyticsData.isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Loading analytics data...</p>
            </div>
        );
    }

    if (analyticsData.error) {
        return (
            <div className="text-center py-16">
                <div className="text-red-600 mb-4">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Failed to load analytics</p>
                    <p className="text-sm text-gray-600 mt-1">{analyticsData.error}</p>
                </div>
                <button
                    onClick={() => analyticsData.refreshData && analyticsData.refreshData()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2 inline" />
                    Try Again
                </button>
            </div>
        );
    }

    if (!analyticsData.data || analyticsData.data.isEmpty) {
        return (
            <div className="text-center py-16">
                <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                <p className="text-gray-600 mb-6">
                    Make some predictions to see analytics and insights about your assessments.
                </p>
                <button
                    onClick={() => navigate('/predict')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                    Start Predicting
                </button>
            </div>
        );
    }

    // Use the actual AnalyticsTab component
    return <AnalyticsTab setShowAuthModal={setShowAuthModal} />;
};

/**
 * FIXED Enhanced Insights Tab with safe data handling
 */
const EnhancedInsightsTab = ({ setShowAuthModal }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Safe hook usage with error boundary
    let insightsData = { isLoading: true, error: null, data: null };
    try {
        insightsData = usePredictionData('insights');
    } catch (error) {
        console.error('Insights data hook error:', error);
        insightsData = { isLoading: false, error: error.message, data: null };
    }

    if (!user) {
        return <AuthRequiredMessage tabName="Insights" onSignIn={() => setShowAuthModal && setShowAuthModal(true)} />;
    }

    if (insightsData.isLoading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Loading insights...</p>
            </div>
        );
    }

    if (insightsData.error) {
        return (
            <div className="text-center py-16">
                <div className="text-red-600 mb-4">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Failed to load insights</p>
                    <p className="text-sm text-gray-600 mt-1">
                        {typeof insightsData.error === 'string' ? insightsData.error : insightsData.error?.message || 'Unknown error'}
                    </p>
                </div>
                <button
                    onClick={() => insightsData.refreshData && insightsData.refreshData()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2 inline" />
                    Try Again
                </button>
            </div>
        );
    }

    if (!insightsData.data || insightsData.data.isEmpty) {
        return (
            <div className="text-center py-16">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600 mb-6">
                    Generate some predictions to unlock personalized insights and recommendations.
                </p>
                <button
                    onClick={() => navigate('/predict')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                    Start Predicting
                </button>
            </div>
        );
    }

    // Use the actual InsightsTab component
    return <InsightsTab setShowAuthModal={setShowAuthModal} />;
};

/**
 * FIXED Main application content component - PROPER ERROR HANDLING
 */
const AppContent = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [appError, setAppError] = useState(null); // NEW: Separate app-level errors from auth errors
    const location = useLocation();
    const navigate = useNavigate();

    // FIXED: Safe auth hook usage - don't catch auth errors here
    const { user, loading, error: authError } = useAuth();
    const { addNotification } = useNotifications();

    // FIXED: Listen for auth notifications from AuthContext
    useEffect(() => {
        const handleAuthNotification = (event) => {
            const { type, title, message, duration } = event.detail;
            addNotification(message, type, { title, duration });
        };

        window.addEventListener('auth-notification', handleAuthNotification);
        return () => window.removeEventListener('auth-notification', handleAuthNotification);
    }, [addNotification]);

    // Determine active tab based on current route (PREFERENCES COMMENTED OUT)
    const getActiveTabFromRoute = (pathname) => {
        if (pathname === '/' || pathname === '/predict') return 'predict';
        if (pathname === '/analytics') return 'analytics';
        if (pathname === '/insights') return 'insights';
        if (pathname === '/profile') return 'profile';
        // COMMENTED OUT: if (pathname === '/preferences') return 'preferences';
        return 'predict';
    };

    const activeTab = getActiveTabFromRoute(location.pathname);

    // Initialize application - REMOVED try/catch that was masking auth errors
    useEffect(() => {
        const initializeApp = async () => {
            if (!loading) {
                const hasVisited = localStorage.getItem('hasVisited');

                if (!user && !hasVisited) {
                    localStorage.setItem('hasVisited', 'true');
                }

                if (!user) {
                    setShowAuthModal(false);
                } else {
                    setShowAuthModal(false);
                }

                setIsInitialized(true);
            }
        };

        initializeApp();
    }, [loading, user]);

    // Handle tab changes (PREFERENCES COMMENTED OUT)
    const handleTabChange = (newTab) => {
        const routes = {
            predict: '/predict',
            analytics: '/analytics',
            insights: '/insights',
            profile: '/profile',
            // COMMENTED OUT: preferences: '/preferences'
        };
        navigate(routes[newTab] || '/predict');
    };

    // Handle authentication requirement
    const handleAuthRequired = (tabId) => {
        console.log(`Authentication required for tab: ${tabId}`);
        setShowAuthModal(true);
    };

    // Auto-redirect if user logs out on protected tab (PREFERENCES COMMENTED OUT)
    useEffect(() => {
        const protectedTabs = ['/analytics', '/insights', '/profile'];
        // COMMENTED OUT: const protectedTabs = ['/analytics', '/insights', '/profile', '/preferences'];
        if (!loading && !user && protectedTabs.includes(location.pathname)) {
            navigate('/predict');
        }
    }, [user, loading, location.pathname, navigate]);

    // Show loading during initialization
    if (loading || !isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <LoadingSpinner size="large" />
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Loading FinDistress AI
                        </h2>
                        <p className="text-gray-600">
                            Preparing your AI-powered business insights...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // FIXED: Only show connection error for actual app-level errors, not auth errors
    if (appError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Connection Error</h2>
                    <p className="text-gray-600">
                        Unable to connect to our financial analysis service. Please check your internet connection and try again.
                    </p>
                    <button
                        onClick={() => {
                            setAppError(null);
                            window.location.reload();
                        }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans relative overflow-x-hidden">
            <BackgroundShapes />

            {/* Main Header Navigation */}
            {user && (
                <Header
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    setShowAuthModal={setShowAuthModal}
                />
            )}

            {/* Global Notifications - FIXED: Always show notifications, even when not authenticated */}
            <NotificationsContainer />

            {/* Main Content */}
            <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${user ? 'py-6 sm:py-8' : 'py-12'} relative z-10`}>
                {!user ? (
                    <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
                ) : (
                    <ErrorBoundary>
                        {/* Mobile Navigation Tabs - only show for main tabs (PREFERENCES CONDITION COMMENTED OUT) */}
                        {!location.pathname.startsWith('/profile') && (
                            // COMMENTED OUT: {!location.pathname.startsWith('/profile') && !location.pathname.startsWith('/preferences') && (
                            <NavigationTabs
                                activeTab={activeTab}
                                setActiveTab={handleTabChange}
                                onAuthRequired={handleAuthRequired}
                            />
                        )}

                        <div className="transition-all duration-300 ease-in-out">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
                                            <PredictTab />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/predict"
                                    element={
                                        <ProtectedRoute requiresAuth={false} setShowAuthModal={setShowAuthModal}>
                                            <PredictTab />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/analytics"
                                    element={
                                        <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
                                            <EnhancedAnalyticsTab setShowAuthModal={setShowAuthModal} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/insights"
                                    element={
                                        <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
                                            <EnhancedInsightsTab setShowAuthModal={setShowAuthModal} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
                                            <ProfilePage setShowAuthModal={setShowAuthModal} />
                                        </ProtectedRoute>
                                    }
                                />
                                {/* COMMENTED OUT: Preferences Route
                                <Route
                                    path="/preferences"
                                    element={
                                        <ProtectedRoute requiresAuth={true} setShowAuthModal={setShowAuthModal}>
                                            <PreferencesPage setShowAuthModal={setShowAuthModal} />
                                        </ProtectedRoute>
                                    }
                                />
                                */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </ErrorBoundary>
                )}
            </main>

            {/* Authentication Modal - FIXED: Pass auth error and sessionExpired to modal */}
            <AuthModal
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
                authError={authError} // Pass the auth error to the modal
                onSuccess={() => {
                    setShowAuthModal(false);
                }}
            />

            {/* Footer */}
            {user && (
                <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="text-center text-sm text-gray-600">
                            <p className="mb-2">
                                <span className="font-semibold text-indigo-600">FinDistress AI</span> -
                                Professional Financial Health Analysis Platform
                            </p>
                            <p className="text-xs">
                                Powered by Advanced Machine Learning •
                                Real-time Risk Assessment •
                                Business-Friendly Insights
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

/**
 * FIXED Root Application Component
 */
const App = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <NotificationProvider>
                    <AuthProvider>
                        <PredictionProvider>
                            <AppContent />
                        </PredictionProvider>
                    </AuthProvider>
                </NotificationProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;
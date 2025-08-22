
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
import ProfileSettings from './components/user/ProfileSettings';
// COMMENTED OUT: Preferences import
// import UserPreferences from './components/user/UserPreferences';

/**
 * Protected Route Component
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
 * Auth Required Message Component
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
 * Enhanced Analytics Tab with safe data handling
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

    
    return <AnalyticsTab setShowAuthModal={setShowAuthModal} />;
};

/**
 * Enhanced Insights Tab with safe data handling
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

    
    return <InsightsTab setShowAuthModal={setShowAuthModal} />;
};

/**
 * Main application content component 
 */
const AppContent = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [appError, setAppError] = useState(null); // Separate app-level errors from auth errors
    const location = useLocation();
    const navigate = useNavigate();

    // Safe auth hook usage 
    const { user, loading, error: authError } = useAuth();
    const { addNotification } = useNotifications();

    // Listen for auth notifications from AuthContext
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

    // Initialize application 
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

    // Only show connection error for actual app-level errors, not auth errors
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

            {/* Global Notifications - Always show notifications, even when not authenticated */}
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

            {/* Authentication Modal - Pass auth error and sessionExpired to modal */}
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
 * Root Application Component
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
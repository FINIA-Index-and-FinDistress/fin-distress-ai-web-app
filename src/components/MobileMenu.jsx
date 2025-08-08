import React, { useState, useEffect, useCallback } from 'react';
import { X, Target, BarChart2, Brain, LogIn, LogOut, User, Loader2, Shield, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

/**
 * Professional mobile menu component for FinDistress AI
 * Features authentication, navigation, and user management
 */

const MobileMenu = ({ isOpen, onClose, activeTab, setActiveTab, onSignInClick }) => {
    const { isAuthenticated, user, signOut, loading, isAdmin } = useAuth();
    const { addNotification } = useNotifications();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    /**
     * Navigation configuration
     */
    const navigationItems = [
        {
            id: 'predict',
            label: 'Predict',
            icon: Target,
            description: 'Generate financial distress predictions',
            requiresAuth: false
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart2,
            description: 'View prediction analytics and insights',
            requiresAuth: true
        },
        {
            id: 'insights',
            label: 'Insights',
            icon: Brain,
            description: 'Deep ML analysis and market comparisons',
            requiresAuth: true
        }
    ];

    /**
     * Handle navigation with authentication check
     */
    const handleNavigation = useCallback((tabId) => {
        const navItem = navigationItems.find(item => item.id === tabId);

        if (!navItem) return;

        // Check authentication requirement
        if (navItem.requiresAuth && !isAuthenticated) {
            addNotification(`Please sign in to access ${navItem.label}`, 'warning');
            onSignInClick();
            onClose();
            return;
        }

        setActiveTab(tabId);
        onClose();
    }, [navigationItems, isAuthenticated, setActiveTab, onClose, onSignInClick, addNotification]);

    /**
     * Handle sign in/out actions
     */
    const handleAuthAction = useCallback(async () => {
        if (isAuthenticated) {
            setIsLoggingOut(true);
            try {
                await signOut();
                addNotification('Successfully signed out', 'success');
            } catch (error) {
                addNotification('Error signing out. Please try again.', 'error');
            } finally {
                setIsLoggingOut(false);
            }
        } else {
            onSignInClick();
        }
        onClose();
    }, [isAuthenticated, signOut, onSignInClick, onClose, addNotification]);

    /**
     * Handle escape key to close menu
     */
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
        >
            {/* Menu Panel */}
            <div
                className="fixed right-0 top-0 h-full w-80 max-w-full bg-white/95 backdrop-blur-md shadow-2xl transform transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Brain className="h-8 w-8 text-indigo-600" />
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    FinDistress AI
                                </h2>
                                <p className="text-xs text-gray-500">Mobile Menu</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* User Section */}
                    {isAuthenticated && user && (
                        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white font-semibold text-lg">
                                        {user.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {user.username}
                                    </h3>
                                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {isAdmin() && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Admin
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ● Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Section */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Navigation
                            </h3>
                            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                                {navigationItems.map(({ id, label, icon: Icon, description, requiresAuth }) => {
                                    const isActive = activeTab === id;
                                    const needsAuth = requiresAuth && !isAuthenticated;

                                    return (
                                        <button
                                            key={id}
                                            onClick={() => handleNavigation(id)}
                                            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${isActive
                                                    ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                                                } ${needsAuth ? 'opacity-75' : ''}`}
                                            disabled={loading}
                                        >
                                            <div className="relative">
                                                <Icon className="h-6 w-6 flex-shrink-0" />
                                                {needsAuth && (
                                                    <Lock className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">{label}</span>
                                                    {needsAuth && (
                                                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                                            Sign in required
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs opacity-75 mt-0.5 line-clamp-1">
                                                    {description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Auth Action Section */}
                    <div className="p-6 border-t border-gray-200/50 bg-gray-50/50">
                        <button
                            onClick={handleAuthAction}
                            className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAuthenticated
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus:ring-red-500'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105 focus:ring-indigo-500'
                                } ${(loading || isLoggingOut) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading || isLoggingOut}
                        >
                            {loading || isLoggingOut ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isAuthenticated ? (
                                <LogOut className="h-5 w-5" />
                            ) : (
                                <LogIn className="h-5 w-5" />
                            )}
                            <span>
                                {loading || isLoggingOut
                                    ? 'Processing...'
                                    : isAuthenticated
                                        ? 'Sign Out'
                                        : 'Sign In'
                                }
                            </span>
                        </button>

                        {/* Additional Info for Unauthenticated Users */}
                        {!isAuthenticated && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start space-x-2">
                                    <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">
                                            Sign in for full access
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">
                                            Access analytics, insights, and save your predictions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
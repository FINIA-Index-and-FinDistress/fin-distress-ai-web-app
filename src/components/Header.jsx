// import React, { useState, useCallback } from 'react';
// import { Brain, LogIn, Target, BarChart2, Menu, X, Settings, User } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useNotifications } from '../context/NotificationContext';
// import UserMenu from './UserMenu';

// /**
//  * Professional header component for FinDistress AI application
//  * Features responsive design, user authentication, and navigation
//  */

// const Header = ({ activeTab, setActiveTab, setShowAuthModal }) => {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const { user, isAuthenticated, signOut, loading, isAdmin } = useAuth();
//     const { addNotification } = useNotifications();

//     /**
//      * Navigation tabs configuration
//      */
//     const navigationTabs = [
//         {
//             id: 'predict',
//             label: 'Predict',
//             icon: Target,
//             description: 'Generate financial distress predictions',
//             requiresAuth: false
//         },
//         {
//             id: 'analytics',
//             label: 'Analytics',
//             icon: BarChart2,
//             description: 'View prediction analytics and insights',
//             requiresAuth: true
//         },
//         {
//             id: 'insights',
//             label: 'Insights',
//             icon: Brain,
//             description: 'AI-powered market insights and recommendations',
//             requiresAuth: true
//         }
//     ];

//     /**
//      * User profile/settings navigation items
//      */
//     const userMenuItems = [
//         {
//             id: 'profile',
//             label: 'Profile Settings',
//             icon: User,
//             description: 'Update your profile information',
//             requiresAuth: true,
//             path: '/profile'
//         },
//         {
//             id: 'preferences',
//             label: 'Preferences',
//             icon: Settings,
//             description: 'Customize your experience',
//             requiresAuth: true,
//             path: '/preferences'
//         }
//     ];

//     /**
//      * Handle tab navigation with authentication check
//      */
//     const handleTabChange = useCallback((tabId) => {
//         const tab = navigationTabs.find(t => t.id === tabId);

//         if (!tab) return;

//         // Check if tab requires authentication
//         if (tab.requiresAuth && !isAuthenticated) {
//             addNotification(`Please sign in to access ${tab.label}`, 'warning');
//             setShowAuthModal(true);
//             return;
//         }

//         setActiveTab(tabId);
//         setIsMobileMenuOpen(false);
//     }, [navigationTabs, isAuthenticated, setActiveTab, setShowAuthModal, addNotification]);

//     /**
//      * Handle user menu navigation
//      */
//     const handleUserMenuNavigation = useCallback((path) => {
//         if (!isAuthenticated) {
//             addNotification('Please sign in to access user settings', 'warning');
//             setShowAuthModal(true);
//             return;
//         }

//         // Navigate to the path (you'll need to implement this based on your routing solution)
//         window.location.href = path;
//         setIsMobileMenuOpen(false);
//     }, [isAuthenticated, setShowAuthModal, addNotification]);

//     /**
//      * Handle authentication action
//      */
//     const handleAuthAction = useCallback(async () => {
//         if (isAuthenticated) {
//             try {
//                 await signOut();
//                 // Redirect to predict tab after logout
//                 if (activeTab !== 'predict') {
//                     setActiveTab('predict');
//                 }
//             } catch (error) {
//                 addNotification('Error signing out. Please try again.', 'error');
//             }
//         } else {
//             setShowAuthModal(true);
//         }
//         setIsMobileMenuOpen(false);
//     }, [isAuthenticated, signOut, setShowAuthModal, activeTab, setActiveTab, addNotification]);

//     /**
//      * Toggle mobile menu
//      */
//     const toggleMobileMenu = useCallback(() => {
//         setIsMobileMenuOpen(prev => !prev);
//     }, []);

//     return (
//         <>
//             <header className="bg-white/90 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-4">

//                         {/* Logo and Brand */}
//                         <div className="flex items-center space-x-4">
//                             <div className="flex items-center">
//                                 <div className="relative">
//                                     <Brain className="h-10 w-10 text-indigo-600" />
//                                     <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                                         FinDistress AI
//                                     </h1>
//                                     <p className="text-xs text-gray-500 font-medium tracking-wide">
//                                         Professional Financial Risk Assessment
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
//                             {navigationTabs.map(({ id, label, icon: Icon, description, requiresAuth }) => (
//                                 <button
//                                     key={id}
//                                     onClick={() => handleTabChange(id)}
//                                     className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group ${activeTab === id
//                                         ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
//                                         : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
//                                         } ${requiresAuth && !isAuthenticated ? 'opacity-75' : ''}`}
//                                     disabled={loading}
//                                     aria-current={activeTab === id ? 'page' : undefined}
//                                     title={description}
//                                 >
//                                     <Icon className="h-4 w-4" />
//                                     <span className="hidden lg:inline">{label}</span>

//                                     {/* Authentication required indicator */}
//                                     {requiresAuth && !isAuthenticated && (
//                                         <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full"></div>
//                                     )}

//                                     {/* Tooltip for mobile-sized desktop screens */}
//                                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap lg:hidden">
//                                         {label}
//                                     </div>
//                                 </button>
//                             ))}
//                         </nav>

//                         {/* User Section */}
//                         <div className="flex items-center space-x-3">
//                             {/* Desktop User Menu */}
//                             <div className="hidden md:block">
//                                 {isAuthenticated && user ? (
//                                     <UserMenu
//                                         user={user}
//                                         handleLogout={signOut}
//                                         isLoggingOut={loading}
//                                         onNavigate={handleUserMenuNavigation}
//                                         userMenuItems={userMenuItems}
//                                     />
//                                 ) : (
//                                     <button
//                                         onClick={() => setShowAuthModal(true)}
//                                         className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                                         disabled={loading}
//                                     >
//                                         <LogIn className="h-4 w-4" />
//                                         <span>Sign In</span>
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Mobile Menu Toggle */}
//                             <button
//                                 onClick={toggleMobileMenu}
//                                 className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 aria-label="Toggle mobile menu"
//                                 aria-expanded={isMobileMenuOpen}
//                             >
//                                 {isMobileMenuOpen ? (
//                                     <X className="h-6 w-6" />
//                                 ) : (
//                                     <Menu className="h-6 w-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Mobile Menu Overlay */}
//             {isMobileMenuOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                     {/* Mobile Menu Panel */}
//                     <div
//                         className="fixed right-0 top-0 h-full w-80 max-w-full bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="p-6">
//                             {/* Mobile Menu Header */}
//                             <div className="flex items-center justify-between mb-8">
//                                 <div className="flex items-center space-x-3">
//                                     <Brain className="h-8 w-8 text-indigo-600" />
//                                     <span className="text-lg font-bold text-gray-900">FinDistress AI</span>
//                                 </div>
//                                 <button
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                     className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
//                                     aria-label="Close mobile menu"
//                                 >
//                                     <X className="h-5 w-5" />
//                                 </button>
//                             </div>

//                             {/* User Info Section */}
//                             {isAuthenticated && user && (
//                                 <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
//                                             <span className="text-white font-semibold text-sm">
//                                                 {user.username?.[0]?.toUpperCase() || 'U'}
//                                             </span>
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
//                                             <p className="text-sm text-gray-600">{user.email}</p>
//                                             {user.is_admin && (
//                                                 <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mt-1">
//                                                     Administrator
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Mobile Navigation */}
//                             <nav className="space-y-2 mb-8" role="navigation" aria-label="Mobile navigation">
//                                 {navigationTabs.map(({ id, label, icon: Icon, description, requiresAuth }) => (
//                                     <button
//                                         key={id}
//                                         onClick={() => handleTabChange(id)}
//                                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === id
//                                             ? 'bg-indigo-600 text-white shadow-md'
//                                             : 'text-gray-700 hover:bg-gray-100'
//                                             } ${requiresAuth && !isAuthenticated ? 'opacity-75' : ''}`}
//                                         disabled={loading}
//                                     >
//                                         <Icon className="h-5 w-5 flex-shrink-0" />
//                                         <div className="flex-1">
//                                             <div className="flex items-center space-x-2">
//                                                 <span className="font-medium">{label}</span>
//                                                 {requiresAuth && !isAuthenticated && (
//                                                     <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
//                                                 )}
//                                             </div>
//                                             <p className="text-xs opacity-75 mt-0.5">{description}</p>
//                                         </div>
//                                     </button>
//                                 ))}
//                             </nav>

//                             {/* User Menu Items - Mobile */}
//                             {isAuthenticated && (
//                                 <>
//                                     <div className="border-t border-gray-200 pt-6 mb-6">
//                                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
//                                             User Settings
//                                         </h3>
//                                         <div className="space-y-2">
//                                             {userMenuItems.map(({ id, label, icon: Icon, description, path }) => (
//                                                 <button
//                                                     key={id}
//                                                     onClick={() => handleUserMenuNavigation(path)}
//                                                     className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 text-left"
//                                                 >
//                                                     <Icon className="h-5 w-5 flex-shrink-0" />
//                                                     <div className="flex-1">
//                                                         <span className="font-medium">{label}</span>
//                                                         <p className="text-xs text-gray-500 mt-0.5">{description}</p>
//                                                     </div>
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}

//                             {/* Mobile Auth Button */}
//                             <div className="border-t border-gray-200 pt-6">
//                                 <button
//                                     onClick={handleAuthAction}
//                                     className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isAuthenticated
//                                         ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
//                                         : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
//                                         }`}
//                                     disabled={loading}
//                                 >
//                                     <LogIn className="h-5 w-5" />
//                                     <span>
//                                         {loading
//                                             ? 'Processing...'
//                                             : (isAuthenticated ? 'Sign Out' : 'Sign In')
//                                         }
//                                     </span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Header;

import React, { useState, useCallback } from 'react';
import { Brain, LogIn, Target, BarChart2, Menu, X, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import UserMenu from './UserMenu';

/**
 * Professional header component for FinDistress AI application
 * Features responsive design, user authentication, and navigation
 */

const Header = ({ activeTab, setActiveTab, setShowAuthModal }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, signOut, loading } = useAuth();
    const { addNotification } = useNotifications();

    /**
     * Navigation tabs configuration
     */
    const navigationTabs = [
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
            description: 'AI-powered market insights and recommendations',
            requiresAuth: true
        }
    ];

    /**
     * User profile/settings navigation items
     */
    const userMenuItems = [
        {
            id: 'profile',
            label: 'Profile Settings',
            icon: User,
            description: 'Update your profile information',
            requiresAuth: true,
            path: '/profile'
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Settings,
            description: 'Customize your experience',
            requiresAuth: true,
            path: '/preferences'
        }
    ];

    /**
     * Handle tab navigation with authentication check
     */
    const handleTabChange = useCallback((tabId) => {
        const tab = navigationTabs.find(t => t.id === tabId);

        if (!tab) return;

        // Check if tab requires authentication
        if (tab.requiresAuth && !isAuthenticated) {
            addNotification(`Please sign in to access ${tab.label}`, 'warning');
            setShowAuthModal(true);
            return;
        }

        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    }, [navigationTabs, isAuthenticated, setActiveTab, setShowAuthModal, addNotification]);

    /**
     * Handle user menu navigation
     */
    const handleUserMenuNavigation = useCallback((path) => {
        if (!isAuthenticated) {
            addNotification('Please sign in to access user settings', 'warning');
            setShowAuthModal(true);
            return;
        }

        // For now, just log the navigation - you can implement actual routing here
        console.log('Navigate to:', path);
        addNotification('User settings navigation not yet implemented', 'info');
        setIsMobileMenuOpen(false);
    }, [isAuthenticated, setShowAuthModal, addNotification]);

    /**
     * Handle logout with proper user-initiated flag
     */
    const handleLogout = useCallback(async () => {
        try {
            // Call signOut with userInitiated = true
            await signOut(true);
            // Redirect to predict tab after logout
            if (activeTab !== 'predict') {
                setActiveTab('predict');
            }
        } catch (error) {
            console.error('Logout error:', error);
            addNotification('Error signing out. Please try again.', 'error');
        }
        setIsMobileMenuOpen(false);
    }, [signOut, activeTab, setActiveTab, addNotification]);

    /**
     * Handle authentication action
     */
    const handleAuthAction = useCallback(async () => {
        if (isAuthenticated) {
            await handleLogout();
        } else {
            setShowAuthModal(true);
        }
        setIsMobileMenuOpen(false);
    }, [isAuthenticated, handleLogout, setShowAuthModal]);

    /**
     * Toggle mobile menu
     */
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    return (
        <>
            <header className="bg-white/90 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">

                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="relative">
                                    <Brain className="h-10 w-10 text-indigo-600" />
                                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        FinDistress AI
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                                        Professional Financial Risk Assessment
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
                            {navigationTabs.map(({ id, label, icon: Icon, description, requiresAuth }) => (
                                <button
                                    key={id}
                                    onClick={() => handleTabChange(id)}
                                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group ${activeTab === id
                                        ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                        } ${requiresAuth && !isAuthenticated ? 'opacity-75' : ''}`}
                                    disabled={loading}
                                    aria-current={activeTab === id ? 'page' : undefined}
                                    title={description}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden lg:inline">{label}</span>

                                    {/* Authentication required indicator */}
                                    {requiresAuth && !isAuthenticated && (
                                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full"></div>
                                    )}

                                    {/* Tooltip for mobile-sized desktop screens */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap lg:hidden">
                                        {label}
                                    </div>
                                </button>
                            ))}
                        </nav>

                        {/* User Section */}
                        <div className="flex items-center space-x-3">
                            {/* Desktop User Menu */}
                            <div className="hidden md:block">
                                {isAuthenticated && user ? (
                                    <UserMenu
                                        onNavigate={handleUserMenuNavigation}
                                        userMenuItems={userMenuItems}
                                    />
                                ) : (
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        disabled={loading}
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span>Sign In</span>
                                    </button>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Toggle mobile menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {/* Mobile Menu Panel */}
                    <div
                        className="fixed right-0 top-0 h-full w-80 max-w-full bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <Brain className="h-8 w-8 text-indigo-600" />
                                    <span className="text-lg font-bold text-gray-900">FinDistress AI</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                    aria-label="Close mobile menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* User Info Section */}
                            {isAuthenticated && user && (
                                <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {user.username?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.full_name || user.username}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            {user.is_admin && (
                                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mt-1">
                                                    Administrator
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Navigation */}
                            <nav className="space-y-2 mb-8" role="navigation" aria-label="Mobile navigation">
                                {navigationTabs.map(({ id, label, icon: Icon, description, requiresAuth }) => (
                                    <button
                                        key={id}
                                        onClick={() => handleTabChange(id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === id
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            } ${requiresAuth && !isAuthenticated ? 'opacity-75' : ''}`}
                                        disabled={loading}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{label}</span>
                                                {requiresAuth && !isAuthenticated && (
                                                    <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-xs opacity-75 mt-0.5">{description}</p>
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            {/* User Menu Items - Mobile */}
                            {isAuthenticated && (
                                <>
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                            User Settings
                                        </h3>
                                        <div className="space-y-2">
                                            {userMenuItems.map(({ id, label, icon: Icon, description, path }) => (
                                                <button
                                                    key={id}
                                                    onClick={() => handleUserMenuNavigation(path)}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 text-left"
                                                >
                                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <span className="font-medium">{label}</span>
                                                        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Mobile Auth Button */}
                            <div className="border-t border-gray-200 pt-6">
                                <button
                                    onClick={handleAuthAction}
                                    className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isAuthenticated
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                                        }`}
                                    disabled={loading}
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span>
                                        {loading
                                            ? 'Processing...'
                                            : (isAuthenticated ? 'Sign Out' : 'Sign In')
                                        }
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
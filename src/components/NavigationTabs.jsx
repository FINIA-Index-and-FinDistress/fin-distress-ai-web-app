// NavigationTabs.jsx 
import React, { useCallback } from 'react';
import { Target, BarChart2, Brain, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const NavigationTabs = ({ activeTab, setActiveTab, onAuthRequired }) => {
    const { isAuthenticated } = useAuth();
    const { addNotification } = useNotifications();

    const tabs = [
        {
            id: 'predict',
            label: 'Predict',
            icon: Target,
            description: 'Generate financial distress predictions',
            requiresAuth: false,
            color: 'text-blue-600'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart2,
            description: 'View prediction analytics and performance metrics',
            requiresAuth: true,
            color: 'text-green-600'
        },
        {
            id: 'insights',
            label: 'Insights',
            icon: Brain,
            description: 'Deep analysis and market insights',
            requiresAuth: true,
            color: 'text-purple-600'
        },
    ];

    const handleTabClick = useCallback((id) => {
        const tab = tabs.find(t => t.id === id);
        if (!tab) {
            console.warn(`Tab with id '${id}' not found`);
            return;
        }

        // Check authentication requirement
        if (tab.requiresAuth && !isAuthenticated) {
            addNotification(`Please sign in to access ${tab.label}`, 'warning');

            // Call parent handler to show auth modal if provided
            if (onAuthRequired) {
                onAuthRequired(id);
            }
            return;
        }

        // Set active tab
        setActiveTab(id);

        // Log tab change for debugging
        console.log(`Switching to ${tab.label} tab`);

        // Add success notification for authenticated tabs
        if (tab.requiresAuth && isAuthenticated) {
            addNotification(`${tab.label} loaded successfully`, 'success');
        }
    }, [tabs, isAuthenticated, setActiveTab, onAuthRequired, addNotification]);

    return (
        <nav className="md:hidden mb-6" aria-label="Main navigation">
            <div className="flex space-x-1 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm">
                {tabs.map(({ id, label, icon: Icon, description, requiresAuth, color }) => {
                    const isActive = activeTab === id;
                    const isDisabled = requiresAuth && !isAuthenticated;

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleTabClick(id)}
                            className={`
                                relative flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 
                                rounded-lg font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                    : isDisabled
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                }
                                ${isDisabled ? 'opacity-75' : 'hover:scale-102'}
                            `}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`${label} tab: ${description}`}
                            aria-disabled={isDisabled}
                            title={isDisabled ? `Sign in required for ${label}` : description}
                            disabled={false} // Don't disable the button, just handle the click
                        >
                            <Icon
                                className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-white' : isDisabled ? 'text-gray-400' : color
                                    }`}
                                aria-hidden="true"
                            />
                            <span className="text-sm font-medium">{label}</span>

                            {/* Authentication required indicator */}
                            {requiresAuth && !isAuthenticated && (
                                <Lock className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                            )}

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                            )}

                            {/* Hover tooltip for mobile */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                                {isDisabled ? `Sign in required` : description}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-b-gray-900" />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Tab descriptions for accessibility */}
            <div className="sr-only">
                <p>
                    Current tab: {tabs.find(t => t.id === activeTab)?.label}.
                    {tabs.find(t => t.id === activeTab)?.description}
                </p>
            </div>
        </nav>
    );
};

export default NavigationTabs;
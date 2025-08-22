/**
 * NotificationContext for FinDistress AI
 * Provides a robust notification system with proper error handling
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', options = {}) => {
        try {
            if (!message) {
                console.warn('Notification message is required');
                return null;
            }

            const id = Date.now() + Math.random();
            const notification = {
                id,
                message: String(message), 
                type: type || 'info',
                title: options.title,
                duration: options.duration !== undefined ? options.duration : 5000,
                data: options.data,
                action: options.action,
                timestamp: Date.now()
            };

            setNotifications(prev => {
                const newNotifications = [...prev, notification];
                return newNotifications.slice(-5);
            });

            // Auto remove notification after duration (if duration > 0)
            if (notification.duration > 0) {
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== id));
                }, notification.duration);
            }

            // Log to console for debugging
            console.log(`[${type.toUpperCase()}] ${message}`);

            return id;
        } catch (error) {
            console.error('Error adding notification:', error);
            return null;
        }
    }, []);

    const removeNotification = useCallback((id) => {
        try {
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    }, []);

    const clearNotifications = useCallback(() => {
        try {
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }, []);

    // Notification helpers
    const showSuccess = useCallback((message, options = {}) => {
        return addNotification(message, 'success', options);
    }, [addNotification]);

    const showError = useCallback((message, options = {}) => {
        return addNotification(message, 'error', options);
    }, [addNotification]);

    const showWarning = useCallback((message, options = {}) => {
        return addNotification(message, 'warning', options);
    }, [addNotification]);

    const showInfo = useCallback((message, options = {}) => {
        return addNotification(message, 'info', options);
    }, [addNotification]);

    const showPrediction = useCallback((message, options = {}) => {
        return addNotification(message, 'prediction', options);
    }, [addNotification]);

    const showAnalytics = useCallback((message, options = {}) => {
        return addNotification(message, 'analytics', options);
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        // Helper methods
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showPrediction,
        showAnalytics
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);

    // Provide fallback instead of throwing error to prevent crashes
    if (!context) {
        console.warn('useNotifications called outside NotificationProvider, using fallback');

        // Return a fallback object with the same interface
        const fallbackNotification = (message, type = 'info') => {
            console.log(`[${(type || 'INFO').toUpperCase()}] ${message}`);
            return null;
        };

        return {
            notifications: [],
            addNotification: fallbackNotification,
            removeNotification: () => { },
            clearNotifications: () => { },
            showSuccess: (message) => fallbackNotification(message, 'success'),
            showError: (message) => fallbackNotification(message, 'error'),
            showWarning: (message) => fallbackNotification(message, 'warning'),
            showInfo: (message) => fallbackNotification(message, 'info'),
            showPrediction: (message) => fallbackNotification(message, 'prediction'),
            showAnalytics: (message) => fallbackNotification(message, 'analytics')
        };
    }

    return context;
};

export default NotificationContext;
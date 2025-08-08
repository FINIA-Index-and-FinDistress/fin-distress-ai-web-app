import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Notification Context for FinDistress AI
 * Manages global notification state and provides notification functions
 */

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    /**
     * Add a new notification
     */
    const addNotification = useCallback((message, type = 'info', options = {}) => {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            title: options.title,
            duration: options.duration || 5000,
            data: options.data,
            action: options.action,
            timestamp: new Date().toISOString()
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove after duration (with extra buffer for animation)
        if (notification.duration > 0) {
            setTimeout(() => {
                removeNotification(notification.id);
            }, notification.duration + 500);
        }

        return notification.id;
    }, []);

    /**
     * Remove a notification by ID
     */
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    /**
     * Clear all notifications
     */
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    /**
     * Add success notification
     */
    const addSuccessNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'success', {
            title: options.title || 'Success',
            duration: options.duration || 4000,
            ...options
        });
    }, [addNotification]);

    /**
     * Add error notification
     */
    const addErrorNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'error', {
            title: options.title || 'Error',
            duration: options.duration || 6000,
            ...options
        });
    }, [addNotification]);

    /**
     * Add warning notification
     */
    const addWarningNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'warning', {
            title: options.title || 'Warning',
            duration: options.duration || 5000,
            ...options
        });
    }, [addNotification]);

    /**
     * Add info notification
     */
    const addInfoNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'info', {
            title: options.title || 'Information',
            duration: options.duration || 4000,
            ...options
        });
    }, [addNotification]);

    /**
     * Add prediction-specific notification
     */
    const addPredictionNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'prediction', {
            title: options.title || 'Prediction Update',
            duration: options.duration || 5000,
            ...options
        });
    }, [addNotification]);

    /**
     * Add analytics-specific notification
     */
    const addAnalyticsNotification = useCallback((message, options = {}) => {
        return addNotification(message, 'analytics', {
            title: options.title || 'Analytics Update',
            duration: options.duration || 4000,
            ...options
        });
    }, [addNotification]);

    /**
     * Handle API error notifications with detailed error parsing
     */
    const addApiErrorNotification = useCallback((error, options = {}) => {
        let message = 'An unexpected error occurred';
        let title = 'API Error';
        let data = null;

        // Parse different error types
        if (error?.response) {
            // Axios error with response
            const status = error.response.status;
            const responseData = error.response.data;

            title = `Error ${status}`;

            if (responseData?.detail) {
                message = responseData.detail;
            } else if (responseData?.message) {
                message = responseData.message;
            } else if (status === 401) {
                message = 'Authentication required. Please log in again.';
            } else if (status === 403) {
                message = 'You do not have permission to perform this action.';
            } else if (status === 404) {
                message = 'The requested resource was not found.';
            } else if (status === 500) {
                message = 'Server error. Please try again later.';
            } else {
                message = `HTTP ${status} error occurred`;
            }

            data = {
                status,
                url: error.response.config?.url,
                method: error.response.config?.method?.toUpperCase()
            };
        } else if (error?.request) {
            // Network error
            title = 'Network Error';
            message = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error?.message) {
            // JavaScript error
            message = error.message;
        }

        return addNotification(message, 'error', {
            title,
            duration: options.duration || 7000,
            data: options.includeDetails ? data : null,
            ...options
        });
    }, [addNotification]);

    /**
     * Add notification for authentication events
     */
    const addAuthNotification = useCallback((message, isSuccess = true, options = {}) => {
        const type = isSuccess ? 'success' : 'error';
        const title = isSuccess ? 'Authentication Success' : 'Authentication Failed';

        return addNotification(message, type, {
            title,
            duration: options.duration || 4000,
            ...options
        });
    }, [addNotification]);

    /**
     * Batch notifications (useful for form validation errors)
     */
    const addBatchNotifications = useCallback((notifications) => {
        const ids = [];
        notifications.forEach(({ message, type, options }) => {
            const id = addNotification(message, type, options);
            ids.push(id);
        });
        return ids;
    }, [addNotification]);

    const value = {
        // State
        notifications,

        // Core functions
        addNotification,
        removeNotification,
        clearAllNotifications,

        // Convenience functions
        addSuccessNotification,
        addErrorNotification,
        addWarningNotification,
        addInfoNotification,
        addPredictionNotification,
        addAnalyticsNotification,
        addApiErrorNotification,
        addAuthNotification,
        addBatchNotifications,

        // Utilities
        notificationCount: notifications.length,
        hasNotifications: notifications.length > 0
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Hook to use notification context
 */
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

/**
 * HOC for components that need notification functionality
 */
export const withNotifications = (Component) => {
    return (props) => {
        const notifications = useNotifications();
        return <Component {...props} notifications={notifications} />;
    };
};

export default NotificationContext;
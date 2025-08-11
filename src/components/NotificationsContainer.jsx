import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    CheckCircle,
    AlertCircle,
    Info,
    X,
    AlertTriangle,
    Target,
    TrendingUp
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

/**
 * CORRECTED NotificationsContainer Component for FinDistress AI
 * Displays toast notifications with proper error handling and animations
 */
const NotificationsContainer = () => {
    const notificationContext = useNotifications();
    const [mounted, setMounted] = useState(false);

    // Safely extract notifications with fallback
    const notifications = notificationContext?.notifications || [];
    const removeNotification = notificationContext?.removeNotification;

    // Safely handle notifications with fallback
    const safeNotifications = useMemo(() => {
        if (!notifications || !Array.isArray(notifications)) {
            return [];
        }
        return notifications.filter(notification =>
            notification &&
            notification.id &&
            notification.message
        );
    }, [notifications]);

    // Stable remove function with error handling
    const handleRemoveNotification = useCallback((id) => {
        try {
            if (removeNotification && typeof removeNotification === 'function') {
                removeNotification(id);
            }
        } catch (error) {
            console.warn('Error removing notification:', error);
        }
    }, [removeNotification]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render if not mounted or no notifications
    if (!mounted || safeNotifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
            {safeNotifications.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onRemove={handleRemoveNotification}
                />
            ))}
        </div>
    );
};

/**
 * CORRECTED Individual notification toast component
 */
const NotificationToast = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    // Safely extract notification properties with fallbacks
    const safeNotification = useMemo(() => ({
        id: notification?.id || Date.now(),
        message: notification?.message || 'Notification',
        type: notification?.type || 'info',
        title: notification?.title,
        duration: notification?.duration !== undefined ? notification?.duration : 5000,
        data: notification?.data,
        action: notification?.action
    }), [notification]);

    useEffect(() => {
        // Animate in
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        // Auto remove after duration
        let removeTimer;
        if (safeNotification.duration > 0) {
            removeTimer = setTimeout(() => {
                setIsRemoving(true);
                setTimeout(() => {
                    if (onRemove && typeof onRemove === 'function') {
                        onRemove(safeNotification.id);
                    }
                }, 300);
            }, safeNotification.duration);
        }

        return () => {
            clearTimeout(showTimer);
            if (removeTimer) {
                clearTimeout(removeTimer);
            }
        };
    }, [safeNotification.id, safeNotification.duration, onRemove]);

    // Get notification styling based on type
    const getNotificationStyle = useCallback((type) => {
        const styles = {
            success: {
                bg: 'bg-green-50 border-green-200',
                text: 'text-green-800',
                icon: CheckCircle,
                iconColor: 'text-green-500'
            },
            error: {
                bg: 'bg-red-50 border-red-200',
                text: 'text-red-800',
                icon: AlertCircle,
                iconColor: 'text-red-500'
            },
            warning: {
                bg: 'bg-yellow-50 border-yellow-200',
                text: 'text-yellow-800',
                icon: AlertTriangle,
                iconColor: 'text-yellow-500'
            },
            info: {
                bg: 'bg-blue-50 border-blue-200',
                text: 'text-blue-800',
                icon: Info,
                iconColor: 'text-blue-500'
            },
            prediction: {
                bg: 'bg-indigo-50 border-indigo-200',
                text: 'text-indigo-800',
                icon: Target,
                iconColor: 'text-indigo-500'
            },
            analytics: {
                bg: 'bg-purple-50 border-purple-200',
                text: 'text-purple-800',
                icon: TrendingUp,
                iconColor: 'text-purple-500'
            }
        };

        return styles[type] || styles.info;
    }, []);

    const style = getNotificationStyle(safeNotification.type);
    const Icon = style.icon;

    // Handle close button click
    const handleClose = useCallback(() => {
        setIsRemoving(true);
        setTimeout(() => {
            if (onRemove && typeof onRemove === 'function') {
                onRemove(safeNotification.id);
            }
        }, 300);
    }, [onRemove, safeNotification.id]);

    // Handle action button click
    const handleActionClick = useCallback(() => {
        try {
            if (safeNotification.action?.onClick && typeof safeNotification.action.onClick === 'function') {
                safeNotification.action.onClick();
            }
        } catch (error) {
            console.warn('Error executing notification action:', error);
        }
    }, [safeNotification.action]);

    return (
        <div
            className={`
                transform transition-all duration-300 ease-out pointer-events-auto
                ${isVisible && !isRemoving
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }
                ${style.bg} border ${style.text}
                rounded-xl p-4 shadow-lg backdrop-blur-sm
                max-w-sm w-full
            `}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${style.iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {safeNotification.title && (
                        <h4 className="text-sm font-semibold mb-1">
                            {safeNotification.title}
                        </h4>
                    )}
                    <p className="text-sm leading-relaxed">
                        {safeNotification.message}
                    </p>

                    {/* Additional data */}
                    {safeNotification.data && (
                        <div className="mt-2 text-xs opacity-75">
                            {typeof safeNotification.data === 'object'
                                ? JSON.stringify(safeNotification.data, null, 2)
                                : String(safeNotification.data)
                            }
                        </div>
                    )}

                    {/* Action button */}
                    {safeNotification.action && safeNotification.action.label && (
                        <button
                            onClick={handleActionClick}
                            className="mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded"
                        >
                            {safeNotification.action.label}
                        </button>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className={`
                        flex-shrink-0 ${style.iconColor} hover:opacity-75 
                        transition-opacity p-1 -m-1 rounded
                        focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50
                    `}
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar for auto-dismiss */}
            {safeNotification.duration && safeNotification.duration > 1000 && (
                <div className="mt-3 w-full bg-black bg-opacity-10 rounded-full h-1 overflow-hidden">
                    <div
                        className="bg-current h-1 rounded-full transition-all ease-linear"
                        style={{
                            width: '100%',
                            animation: `shrink ${safeNotification.duration}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Utility function to create notification objects
 */
export const createNotification = (type, message, options = {}) => {
    return {
        id: Date.now() + Math.random(),
        type: type || 'info',
        message: String(message || 'Notification'),
        title: options.title,
        duration: options.duration !== undefined ? options.duration : 5000,
        data: options.data,
        action: options.action
    };
};

/**
 * Predefined notification creators for common use cases
 */
export const notificationHelpers = {
    success: (message, options) => createNotification('success', message, options),
    error: (message, options) => createNotification('error', message, options),
    warning: (message, options) => createNotification('warning', message, options),
    info: (message, options) => createNotification('info', message, options),
    prediction: (message, options) => createNotification('prediction', message, options),
    analytics: (message, options) => createNotification('analytics', message, options)
};

/**
 * CSS Injection with better error handling
 */
const injectStyles = () => {
    if (typeof document === 'undefined') return;

    const styleId = 'findistress-notification-styles';

    // Check if styles already exist
    if (document.getElementById(styleId)) return;

    const styles = `
        @keyframes shrink {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }
        
        /* Additional animation styles for notifications */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;

    try {
        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    } catch (error) {
        console.warn('Failed to inject notification styles:', error);
    }
};

// Inject styles when module loads
injectStyles();

export default NotificationsContainer;
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
 * NotificationsContainer Component for FinDistress AI
 * Displays toast notifications with different types and animations
 */
const NotificationsContainer = () => {
    const { notifications, removeNotification } = useNotifications();
    const [mounted, setMounted] = useState(false);

    // Memoize notifications to prevent unnecessary re-renders
    const stableNotifications = useMemo(() => notifications, [notifications]);

    // Memoize removeNotification to ensure stability
    const stableRemoveNotification = useCallback(
        (id) => removeNotification(id),
        [removeNotification]
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !stableNotifications?.length) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
            {stableNotifications.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onRemove={stableRemoveNotification}
                />
            ))}
        </div>
    );
};

/**
 * Individual notification toast component
 */
const NotificationToast = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Animate in
        const showTimer = setTimeout(() => setIsVisible(true), 50);

        // Auto remove after duration
        const removeTimer = setTimeout(() => {
            setIsRemoving(true);
            setTimeout(() => {
                onRemove(notification.id);
            }, 300);
        }, notification.duration || 5000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(removeTimer);
        };
    }, [notification.id, notification.duration, onRemove]);

    // Get notification styling based on type
    const getNotificationStyle = (type) => {
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
    };

    const style = getNotificationStyle(notification.type);
    const Icon = style.icon;

    return (
        <div
            className={`
                transform transition-all duration-300 ease-out
                ${isVisible && !isRemoving
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }
                ${style.bg} border ${style.text}
                rounded-xl p-4 shadow-lg backdrop-blur-sm
                max-w-sm w-full
            `}
            role="alert"
        >
            <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${style.iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <h4 className="text-sm font-semibold mb-1">
                            {notification.title}
                        </h4>
                    )}
                    <p className="text-sm leading-relaxed">
                        {notification.message}
                    </p>

                    {/* Additional data */}
                    {notification.data && (
                        <div className="mt-2 text-xs opacity-75">
                            {typeof notification.data === 'object'
                                ? JSON.stringify(notification.data, null, 2)
                                : notification.data
                            }
                        </div>
                    )}

                    {/* Action button */}
                    {notification.action && (
                        <button
                            onClick={notification.action.onClick}
                            className="mt-2 text-xs font-medium underline hover:no-underline"
                        >
                            {notification.action.label}
                        </button>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={() => {
                        setIsRemoving(true);
                        setTimeout(() => onRemove(notification.id), 300);
                    }}
                    className={`
                        flex-shrink-0 ${style.iconColor} hover:opacity-75 
                        transition-opacity p-1 -m-1 rounded
                    `}
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar for auto-dismiss */}
            {notification.duration && notification.duration > 1000 && (
                <div className="mt-3 w-full bg-black bg-opacity-10 rounded-full h-1">
                    <div
                        className="bg-current h-1 rounded-full transition-all ease-linear"
                        style={{
                            width: '100%',
                            animation: `shrink ${notification.duration}ms linear forwards`
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
        type,
        message,
        title: options.title,
        duration: options.duration || 5000,
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

// Add required CSS for animations
const styles = `
@keyframes shrink {
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default NotificationsContainer;
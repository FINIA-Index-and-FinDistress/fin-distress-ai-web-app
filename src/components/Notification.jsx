import { useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Notification = ({ id, message, type }) => {
    const { removeNotification } = useNotifications();

    const getNotificationStyles = useCallback((type) => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="h-5 w-5" />,
                    bgColor: 'bg-green-500/90 border-green-600',
                };
            case 'error':
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    bgColor: 'bg-red-500/90 border-red-600',
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    bgColor: 'bg-yellow-500/90 border-yellow-600',
                };
            case 'info':
                return {
                    icon: <Info className="h-5 w-5" />,
                    bgColor: 'bg-indigo-600/90 border-indigo-700',
                };
            default:
                return {
                    icon: <Info className="h-5 w-5" />,
                    bgColor: 'bg-blue-500/90 border-blue-600',
                };
        }
    }, []);

    if (!message) return null;

    const { icon, bgColor } = getNotificationStyles(type);

    return (
        <div
            className={`relative flex items-center justify-between p-4 pr-10 rounded-xl shadow-md backdrop-blur-sm border animate-slideInRight ${bgColor} text-white`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center space-x-3">
                <span aria-hidden="true">{icon}</span>
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                type="button"
                onClick={() => removeNotification(id)}
                className="absolute top-2 right-2 p-1 rounded-full text-white/80 hover:bg-white/20 transition-colors"
                aria-label={`Close ${type} notification`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Notification;
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';

const UserMenu = ({ user, handleLogout, isLoggingOut, onNavigate, userMenuItems = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Default menu items if none provided
    const defaultMenuItems = [
        {
            id: 'profile',
            label: 'Profile Settings',
            icon: User,
            description: 'Update your profile information',
            path: '/profile'
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Settings,
            description: 'Customize your experience',
            path: '/preferences'
        }
    ];

    const menuItems = userMenuItems.length > 0 ? userMenuItems : defaultMenuItems;

    const handleMenuItemClick = (path) => {
        setIsOpen(false);
        if (onNavigate) {
            onNavigate(path);
        } else {
            // Fallback navigation
            window.location.href = path;
        }
    };

    const handleLogoutClick = async () => {
        setIsOpen(false);
        await handleLogout();
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                </div>
                <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                        {user?.full_name || user?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {user?.is_admin ? 'Administrator' : 'User'}
                    </p>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.full_name || user?.username || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                                {user?.is_admin && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <Shield className="h-3 w-3 text-purple-600" />
                                        <span className="text-xs text-purple-600 font-medium">
                                            Administrator
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {menuItems.map(({ id, label, icon: Icon, description, path }) => (
                            <button
                                key={id}
                                onClick={() => handleMenuItemClick(path)}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                                <Icon className="h-4 w-4 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-xs text-gray-500">{description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
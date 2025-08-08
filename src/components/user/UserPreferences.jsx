import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const UserPreferences = () => {
    const { userPreferences, updatePreferences, loadUserPreferences } = useAuth();
    const [preferences, setPreferences] = useState({
        theme: 'light',
        notifications: true,
        dashboard_layout: 'default',
        default_region: 'AFR',
        language: 'en',
        timezone: 'UTC'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

    useEffect(() => {
        const loadPrefs = async () => {
            setIsLoadingPrefs(true);
            const prefs = await loadUserPreferences();
            if (prefs) {
                setPreferences(prev => ({ ...prev, ...prefs }));
            }
            setIsLoadingPrefs(false);
        };

        loadPrefs();
    }, [loadUserPreferences]);

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updatePreferences(preferences);
        } catch (error) {
            console.error('Preferences update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingPrefs) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Preferences</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Appearance */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                        </label>
                        <div className="flex space-x-4">
                            {['light', 'dark', 'auto'].map((theme) => (
                                <label key={theme} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={theme}
                                        checked={preferences.theme === theme}
                                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="capitalize">{theme}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dashboard_layout" className="block text-sm font-medium text-gray-700">
                            Dashboard Layout
                        </label>
                        <select
                            id="dashboard_layout"
                            value={preferences.dashboard_layout}
                            onChange={(e) => handlePreferenceChange('dashboard_layout', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="default">Default</option>
                            <option value="compact">Compact</option>
                            <option value="expanded">Expanded</option>
                        </select>
                    </div>
                </div>

                {/* Notifications */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email Notifications
                            </label>
                            <p className="text-xs text-gray-500">
                                Receive notifications about predictions and system updates
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.notifications}
                                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Regional Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="default_region" className="block text-sm font-medium text-gray-700">
                                Default Region
                            </label>
                            <select
                                id="default_region"
                                value={preferences.default_region}
                                onChange={(e) => handlePreferenceChange('default_region', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="AFR">Africa (AFR)</option>
                                <option value="ROW">Rest of World (ROW)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                Language
                            </label>
                            <select
                                id="language"
                                value={preferences.language}
                                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                                Timezone
                            </label>
                            <select
                                id="timezone"
                                value={preferences.timezone}
                                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="UTC">UTC</option>
                                <option value="Africa/Lagos">Africa/Lagos</option>
                                <option value="Africa/Nairobi">Africa/Nairobi</option>
                                <option value="Africa/Cairo">Africa/Cairo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserPreferences;
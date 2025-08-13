import React, { useState, useEffect } from 'react';
import { Settings, Palette, Bell, Globe, Monitor, Moon, Sun, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const UserPreferences = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    const [preferences, setPreferences] = useState({
        theme: 'light',
        notifications: true,
        dashboard_layout: 'default',
        default_region: 'AFR',
        language: 'en',
        timezone: 'UTC',
        email_notifications: true,
        prediction_alerts: true,
        auto_save: true,
        data_retention_days: 365
    });

    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialPreferences, setInitialPreferences] = useState({});

    // Load preferences on component mount
    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            // Load from localStorage or API
            const savedPreferences = localStorage.getItem('userPreferences');
            if (savedPreferences) {
                const parsed = JSON.parse(savedPreferences);
                setPreferences(parsed);
                setInitialPreferences(parsed);
            } else {
                setInitialPreferences(preferences);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            addNotification('Failed to load preferences', 'error');
        }
    };

    const updatePreference = (key, value) => {
        setPreferences(prev => {
            const updated = { ...prev, [key]: value };
            setHasChanges(JSON.stringify(updated) !== JSON.stringify(initialPreferences));
            return updated;
        });
    };

    const savePreferences = async () => {
        setLoading(true);
        try {
            // Save to localStorage (in a real app, this would be an API call)
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            setInitialPreferences(preferences);
            setHasChanges(false);
            addNotification('Preferences saved successfully', 'success');
        } catch (error) {
            console.error('Error saving preferences:', error);
            addNotification('Failed to save preferences', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetPreferences = () => {
        setPreferences(initialPreferences);
        setHasChanges(false);
    };

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
        { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system preference' }
    ];

    const languageOptions = [
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'fr', label: 'Français', flag: '🇫🇷' },
        { value: 'es', label: 'Español', flag: '🇪🇸' },
        { value: 'ar', label: 'العربية', flag: '🇦🇪' }
    ];

    const regionOptions = [
        { value: 'AFR', label: 'Africa (AFR)', description: 'African market focus' },
        { value: 'ROW', label: 'Rest of World (ROW)', description: 'Global market focus' },
        { value: 'GLOBAL', label: 'Global', description: 'Combined analysis' }
    ];

    const layoutOptions = [
        { value: 'default', label: 'Default', description: 'Standard dashboard layout' },
        { value: 'compact', label: 'Compact', description: 'Dense information display' },
        { value: 'detailed', label: 'Detailed', description: 'Expanded view with more metrics' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
                        <p className="text-gray-600">Customize your FinDistress AI experience</p>
                    </div>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Palette className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                </div>

                <div className="space-y-6">
                    {/* Theme Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {themeOptions.map(({ value, label, icon: Icon, description }) => (
                                <div
                                    key={value}
                                    onClick={() => updatePreference('theme', value)}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${preferences.theme === value
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-5 h-5 ${preferences.theme === value ? 'text-indigo-600' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <p className={`font-medium ${preferences.theme === value ? 'text-indigo-900' : 'text-gray-900'
                                                }`}>
                                                {label}
                                            </p>
                                            <p className="text-xs text-gray-500">{description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                        <select
                            value={preferences.language}
                            onChange={(e) => updatePreference('language', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        >
                            {languageOptions.map(({ value, label, flag }) => (
                                <option key={value} value={value}>
                                    {flag} {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Dashboard Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Monitor className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                </div>

                <div className="space-y-6">
                    {/* Dashboard Layout */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Layout</label>
                        <div className="space-y-3">
                            {layoutOptions.map(({ value, label, description }) => (
                                <div
                                    key={value}
                                    onClick={() => updatePreference('dashboard_layout', value)}
                                    className={`cursor-pointer p-4 rounded-lg border transition-all ${preferences.dashboard_layout === value
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-medium ${preferences.dashboard_layout === value ? 'text-indigo-900' : 'text-gray-900'
                                                }`}>
                                                {label}
                                            </p>
                                            <p className="text-sm text-gray-500">{description}</p>
                                        </div>
                                        {preferences.dashboard_layout === value && (
                                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Default Region */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Default Analysis Region</label>
                        <div className="space-y-3">
                            {regionOptions.map(({ value, label, description }) => (
                                <div
                                    key={value}
                                    onClick={() => updatePreference('default_region', value)}
                                    className={`cursor-pointer p-4 rounded-lg border transition-all ${preferences.default_region === value
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-medium ${preferences.default_region === value ? 'text-indigo-900' : 'text-gray-900'
                                                }`}>
                                                {label}
                                            </p>
                                            <p className="text-sm text-gray-500">{description}</p>
                                        </div>
                                        {preferences.default_region === value && (
                                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Bell className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                </div>

                <div className="space-y-6">
                    {/* General Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications in the application</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.notifications}
                                onChange={(e) => updatePreference('notifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive important updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.email_notifications}
                                onChange={(e) => updatePreference('email_notifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Prediction Alerts */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Prediction Alerts</p>
                            <p className="text-sm text-gray-500">Get notified about high-risk predictions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.prediction_alerts}
                                onChange={(e) => updatePreference('prediction_alerts', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Data & Privacy Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <Globe className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Data & Privacy</h2>
                </div>

                <div className="space-y-6">
                    {/* Auto Save */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Auto-save Predictions</p>
                            <p className="text-sm text-gray-500">Automatically save prediction results</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.auto_save}
                                onChange={(e) => updatePreference('auto_save', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {/* Data Retention */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Data Retention Period
                        </label>
                        <select
                            value={preferences.data_retention_days}
                            onChange={(e) => updatePreference('data_retention_days', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        >
                            <option value={30}>30 days</option>
                            <option value={90}>90 days</option>
                            <option value={180}>6 months</option>
                            <option value={365}>1 year</option>
                            <option value={730}>2 years</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            How long to keep your prediction history
                        </p>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Timezone</label>
                        <select
                            value={preferences.timezone}
                            onChange={(e) => updatePreference('timezone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Africa/Cairo">Cairo (EET)</option>
                            <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">You have unsaved changes</span>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={resetPreferences}
                                disabled={loading}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={savePreferences}
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {!hasChanges && !loading && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">All preferences are saved</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPreferences;
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const ProfileSettings = () => {
    const { user, updateProfile } = useAuth();
    const { addNotification } = useNotifications();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [isEditing, setIsEditing] = useState({
        profile: false,
        password: false
    });

    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email || '',
                full_name: user.full_name || ''
            }));
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear errors for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateProfileForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        return newErrors;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!formData.current_password) {
            newErrors.current_password = 'Current password is required';
        }

        if (!formData.new_password) {
            newErrors.new_password = 'New password is required';
        } else if (formData.new_password.length < 6) {
            newErrors.new_password = 'Password must be at least 6 characters';
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please confirm your new password';
        } else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleProfileSave = async () => {
        const validationErrors = validateProfileForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                email: formData.email,
                full_name: formData.full_name
            };

            const result = await updateProfile(updateData);

            if (result.success) {
                addNotification('Profile updated successfully', 'success');
                setIsEditing(prev => ({ ...prev, profile: false }));
                setErrors({});
            } else {
                addNotification(result.error || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            addNotification('An error occurred while updating profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        const validationErrors = validatePasswordForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                current_password: formData.current_password,
                new_password: formData.new_password
            };

            const result = await updateProfile(updateData);

            if (result.success) {
                addNotification('Password updated successfully', 'success');
                setIsEditing(prev => ({ ...prev, password: false }));
                setFormData(prev => ({
                    ...prev,
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                }));
                setErrors({});
            } else {
                addNotification(result.error || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Password update error:', error);
            addNotification('An error occurred while updating password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (section) => {
        setIsEditing(prev => ({ ...prev, [section]: false }));
        setErrors({});

        if (section === 'profile' && user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email || '',
                full_name: user.full_name || ''
            }));
        } else if (section === 'password') {
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_password: ''
            }));
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-600">Manage your account information and security settings</p>
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    {!isEditing.profile && (
                        <button
                            onClick={() => setIsEditing(prev => ({ ...prev, profile: true }))}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.username}
                                disabled
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing.profile}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${isEditing.profile
                                        ? 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                        : 'border-gray-200 bg-gray-50 text-gray-600'
                                    } ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            disabled={!isEditing.profile}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${isEditing.profile
                                    ? 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                } ${errors.full_name ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.full_name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.full_name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Profile Action Buttons */}
                {isEditing.profile && (
                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={handleProfileSave}
                            disabled={loading}
                            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button
                            onClick={() => handleCancel('profile')}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Password Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    {!isEditing.password && (
                        <button
                            onClick={() => setIsEditing(prev => ({ ...prev, password: true }))}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {isEditing.password ? (
                    <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={formData.current_password}
                                    onChange={(e) => handleInputChange('current_password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.current_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.current_password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.current_password}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={formData.new_password}
                                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.new_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.new_password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.new_password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={formData.confirm_password}
                                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.confirm_password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.confirm_password}
                                </p>
                            )}
                        </div>

                        {/* Password Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handlePasswordSave}
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                <span>{loading ? 'Updating...' : 'Update Password'}</span>
                            </button>
                            <button
                                onClick={() => handleCancel('password')}
                                disabled={loading}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Lock className="h-6 w-6 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Password Protection</p>
                            <p className="text-xs text-gray-600">Your account is secured with a strong password</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Account Type</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {user.is_admin ? 'Administrator' : 'User'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Member Since</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
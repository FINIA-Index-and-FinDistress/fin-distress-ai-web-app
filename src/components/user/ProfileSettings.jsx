import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings = () => {
    const { user, updateProfile, loading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                full_name: user.full_name || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate password change if requested
            if (showPasswordChange) {
                if (!formData.current_password) {
                    alert('Current password is required to change password');
                    setIsLoading(false);
                    return;
                }
                if (!formData.new_password) {
                    alert('New password is required');
                    setIsLoading(false);
                    return;
                }
                if (formData.new_password !== formData.confirm_password) {
                    alert('New passwords do not match');
                    setIsLoading(false);
                    return;
                }
                if (formData.new_password.length < 6) {
                    alert('New password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }
            }

            const updateData = {
                email: formData.email,
                full_name: formData.full_name
            };

            // Add password fields if changing password
            if (showPasswordChange && formData.new_password) {
                updateData.current_password = formData.current_password;
                updateData.new_password = formData.new_password;
            }

            const result = await updateProfile(updateData);

            if (result.success) {
                // Clear password fields on success
                if (showPasswordChange) {
                    setFormData(prev => ({
                        ...prev,
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                    }));
                    setShowPasswordChange(false);
                }
            }
        } catch (error) {
            console.error('Profile update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={user?.username || ''}
                            disabled
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <div className="mt-1 flex items-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user?.is_admin
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {user?.is_admin ? 'Administrator' : 'User'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Password</h2>
                        <button
                            type="button"
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                        </button>
                    </div>

                    {showPasswordChange && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
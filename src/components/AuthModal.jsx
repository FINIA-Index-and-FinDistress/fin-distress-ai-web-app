

import React, { useState, useEffect, useCallback } from 'react';
import { X, Eye, EyeOff, Loader, AlertCircle, CheckCircle, Mail, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

/**
 * Professional authentication modal for financial distress prediction app
 * Supports both login and registration with comprehensive validation and proper error handling
 */

const AuthModal = ({ showAuthModal, setShowAuthModal, authError, onSuccess }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signIn, signUp, loading, error: contextError, clearError, sessionExpired, clearSessionExpired } = useAuth();
    const { addNotification } = useNotifications();

    /**
     * Reset form state
     */
    const resetForm = useCallback(() => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setValidationErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsSubmitting(false);
    }, []);

    /**
     * Handle modal close
     */
    const handleClose = useCallback(() => {
        if (loading || isSubmitting) return; // Prevent closing during operations

        setShowAuthModal(false);
        resetForm();
        clearError(); // Clear any auth errors when closing
        clearSessionExpired(); // Clear session expired flag
    }, [setShowAuthModal, resetForm, loading, isSubmitting, clearError, clearSessionExpired]);

    /**
     * Handle input changes with real-time validation
     */
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }

        // Clear auth errors when user starts typing
        if (contextError) {
            clearError();
        }
    }, [validationErrors, contextError, clearError]);

    /**
     * Comprehensive form validation
     */
    const validateForm = useCallback(() => {
        const errors = {};
        const { username, email, password, confirmPassword } = formData;

        // Username validation
        if (!username.trim()) {
            errors.username = 'Username is required';
        } else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        }

        // Email validation (for registration)
        if (authMode === 'register') {
            if (!email.trim()) {
                errors.email = 'Email address is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.email = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        } else if (authMode === 'register') {
            // Additional password strength for registration
            if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
                errors.password = 'Password should contain both uppercase and lowercase letters';
            }
        }

        // Confirm password validation (for registration)
        if (authMode === 'register') {
            if (!confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }

        return errors;
    }, [formData, authMode]);

    /**
     * Get the appropriate error message to display
     */
    const getErrorMessage = useCallback(() => {
        // Prioritize validation errors
        if (validationErrors.submit) return validationErrors.submit;

        // Then show auth context errors with enhanced messages
        if (authError || contextError) {
            const error = authError || contextError;

            // Handle specific error messages for better UX
            if (error.includes('Invalid username or password')) {
                return 'Invalid username or password. Please check your credentials and try again.';
            }
            if (error.includes('expired') || error.includes('inactive') || sessionExpired) {
                return 'Your session has expired. Please sign in again.';
            }
            if (error.includes('Registration failed')) {
                return 'Registration failed. This username or email may already be taken.';
            }
            if (error.includes('username')) {
                return 'Username already exists. Please choose a different username.';
            }
            if (error.includes('email')) {
                return 'Email already registered. Please use a different email or try signing in.';
            }
            if (error.includes('Server error') || error.includes('500')) {
                return 'Server error. Please try again later.';
            }
            return error;
        }

        return '';
    }, [validationErrors.submit, authError, contextError, sessionExpired]);

    /**
     * Show notification for authentication errors
     */
    const showAuthErrorNotification = useCallback((error) => {
        if (error.includes('Invalid username or password')) {
            addNotification('Invalid username or password. Please check your credentials and try again.', 'error', {
                title: 'Sign In Failed',
                duration: 6000
            });
        } else if (error.includes('username')) {
            addNotification('Username already exists. Please choose a different username.', 'error', {
                title: 'Registration Failed',
                duration: 5000
            });
        } else if (error.includes('email')) {
            addNotification('Email already registered. Please use a different email or try signing in.', 'error', {
                title: 'Registration Failed',
                duration: 5000
            });
        } else if (error.includes('Server error') || error.includes('500')) {
            addNotification('Server error occurred. Please try again later.', 'error', {
                title: 'Server Error',
                duration: 5000
            });
        } else if (error.includes('Network error') || error.includes('connection')) {
            addNotification('Network error. Please check your internet connection and try again.', 'error', {
                title: 'Connection Error',
                duration: 6000
            });
        } else {
            addNotification(error, 'error', {
                title: authMode === 'login' ? 'Sign In Failed' : 'Registration Failed',
                duration: 5000
            });
        }
    }, [addNotification, authMode]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (loading || isSubmitting) return;

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            addNotification('Please correct the errors in the form', 'warning', {
                title: 'Form Error',
                duration: 4000
            });
            return;
        }

        setIsSubmitting(true);
        setValidationErrors({});
        clearError(); // Clear any previous auth errors
        clearSessionExpired(); // Clear session expired flag

        try {
            const { username, email, password } = formData;
            let result;

            if (authMode === 'login') {
                result = await signIn(username.trim(), password);
            } else {
                result = await signUp(username.trim(), email.trim(), password, username.trim());
            }

            if (result.success) {
                // Show success notification
                addNotification(
                    `Successfully ${authMode === 'login' ? 'signed in' : 'registered'}! Welcome to FinDistress AI.`,
                    'success',
                    {
                        title: authMode === 'login' ? 'Welcome Back!' : 'Account Created!',
                        duration: 4000
                    }
                );
                resetForm();
                if (onSuccess) {
                    onSuccess();
                } else {
                    handleClose();
                }
            } else {
                // Show error notification - this is the key fix!
                if (result.error) {
                    showAuthErrorNotification(result.error);
                }
                console.error('Authentication failed:', result.error);
            }

        } catch (error) {
            console.error('Authentication error:', error);
            const errorMessage = 'An unexpected error occurred. Please try again.';
            setValidationErrors({ submit: errorMessage });
            addNotification(errorMessage, 'error', {
                title: 'Unexpected Error',
                duration: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, authMode, validateForm, signIn, signUp, loading, isSubmitting, addNotification, handleClose, onSuccess, resetForm, clearError, clearSessionExpired, showAuthErrorNotification]);

    /**
     * Toggle between login and register modes
     */
    const toggleAuthMode = useCallback(() => {
        setAuthMode(prev => prev === 'login' ? 'register' : 'login');
        resetForm();
        clearError(); // Clear auth errors when switching modes
        clearSessionExpired(); // Clear session expired flag
    }, [resetForm, clearError, clearSessionExpired]);

    /**
     * Handle keyboard shortcuts and modal effects
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showAuthModal) {
                handleClose();
            }
        };

        if (showAuthModal) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showAuthModal, handleClose]);

    /**
     * Clear errors when modal opens/closes or mode changes
     */
    useEffect(() => {
        if (showAuthModal) {
            setValidationErrors({});
            clearError();
            clearSessionExpired();
        }
    }, [showAuthModal, authMode, clearError, clearSessionExpired]);

    if (!showAuthModal) return null;

    const errorMessage = getErrorMessage();

    return (
        <div
            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200/50 relative transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    disabled={loading || isSubmitting}
                    aria-label="Close authentication modal"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {authMode === 'login' ? 'Welcome Back' : 'Join FinDistress AI'}
                    </h3>
                    <p className="text-gray-600">
                        {authMode === 'login'
                            ? 'Sign in to access your prediction history and insights'
                            : 'Create your account to save predictions and track financial health'
                        }
                    </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Session Expired Notice */}
                {sessionExpired && (
                    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-yellow-800 font-medium">Session Expired</p>
                                <p className="text-xs text-yellow-700 mt-1">Please sign in again to continue using FinDistress AI.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="auth-username" className="block text-sm font-semibold text-gray-700 mb-2">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                id="auth-username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${validationErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                placeholder="Enter your username"
                                disabled={loading || isSubmitting}
                                autoComplete="username"
                            />
                        </div>
                        {validationErrors.username && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {validationErrors.username}
                            </p>
                        )}
                    </div>

                    {/* Email (Register only) */}
                    {authMode === 'register' && (
                        <div>
                            <label htmlFor="auth-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="auth-email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="your.email@company.com"
                                    disabled={loading || isSubmitting}
                                    autoComplete="email"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label htmlFor="auth-password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="auth-password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                placeholder="Minimum 6 characters"
                                disabled={loading || isSubmitting}
                                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                minLength="6"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                disabled={loading || isSubmitting}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {validationErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password (Register only) */}
                    {authMode === 'register' && (
                        <div>
                            <label htmlFor="auth-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="auth-confirm-password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="Re-enter your password"
                                    disabled={loading || isSubmitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    disabled={loading || isSubmitting}
                                    aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading || isSubmitting}
                        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-white font-semibold rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading || isSubmitting
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 transform hover:scale-105'
                            }`}
                    >
                        {(loading || isSubmitting) && <Loader className="animate-spin h-5 w-5" />}
                        <span>
                            {loading || isSubmitting
                                ? 'Processing...'
                                : (authMode === 'login' ? 'Sign In' : 'Create Account')
                            }
                        </span>
                    </button>
                </form>

                {/* Toggle mode */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={toggleAuthMode}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:underline"
                            disabled={loading || isSubmitting}
                        >
                            {authMode === 'login' ? 'Create Account' : 'Sign In'}
                        </button>
                    </p>
                </div>

                {/* Demo notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-blue-800 font-medium mb-1">Get Started</p>
                            <p className="text-xs text-blue-700">
                                Use any username and secure password (min 6 characters) to test the application.
                                Your data will be securely stored and can be accessed later.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
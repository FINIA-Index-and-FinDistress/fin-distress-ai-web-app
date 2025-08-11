import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Simplified AuthContext to resolve build/runtime issues
const AuthContext = createContext(null);

// Storage utility with error handling
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Storage read error:', error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Storage write error:', error);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Storage remove error:', error);
        }
    },
    clear: () => {
        try {
            const keys = [
                'findistress_access_token',
                'findistress_refresh_token',
                'findistress_user_data',
                'findistress_token_expiry',
                'findistress_last_activity'
            ];
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.warn('Storage clear error:', error);
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

    // Update activity timestamp
    const updateActivity = useCallback(() => {
        storage.set('findistress_last_activity', Date.now());
    }, []);

    // Check if user should be logged out due to inactivity
    const checkInactivity = useCallback(() => {
        const lastActivity = storage.get('findistress_last_activity');
        const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

        if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
            console.log('Auto-logout due to inactivity');
            return false;
        }
        return true;
    }, []);

    // Get auth headers
    const getAuthHeaders = useCallback(() => {
        const token = accessToken || storage.get('findistress_access_token');
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }, [accessToken]);

    // Login function
    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔑 Attempting login...');

            // Try JSON login first
            const loginResponse = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            let data;
            if (loginResponse.ok) {
                data = await loginResponse.json();
            } else {
                // Try form data login
                console.log('Trying form data login...');
                const formData = new URLSearchParams();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);

                const formResponse = await fetch(`${API_BASE}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });

                if (!formResponse.ok) {
                    const errorData = await formResponse.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Login failed: ${formResponse.status}`);
                }

                data = await formResponse.json();
            }

            // Get user profile
            let userData;
            try {
                const userResponse = await fetch(`${API_BASE}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
                });

                if (userResponse.ok) {
                    userData = await userResponse.json();
                } else {
                    userData = {
                        username: credentials.username,
                        email: '',
                        full_name: credentials.username,
                        is_admin: false
                    };
                }
            } catch (error) {
                console.warn('Failed to fetch user profile:', error);
                userData = {
                    username: credentials.username,
                    email: '',
                    full_name: credentials.username,
                    is_admin: false
                };
            }

            // Calculate token expiry
            const tokenExpiry = Date.now() + (data.expires_in * 1000);

            // Store authentication data
            storage.set('findistress_access_token', data.access_token);
            storage.set('findistress_refresh_token', data.refresh_token);
            storage.set('findistress_user_data', userData);
            storage.set('findistress_token_expiry', tokenExpiry);
            storage.set('findistress_last_activity', Date.now());

            // Update state
            setUser(userData);
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token);
            setIsAuthenticated(true);
            setError(null);

            console.log('✅ Login successful');
            return { success: true, user: userData };

        } catch (error) {
            console.error('❌ Login failed:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    // Logout function
    const logout = useCallback(async (showNotification = true) => {
        try {
            // Clear storage
            storage.clear();

            // Update state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);

            console.log('🔒 Logout completed');

        } catch (error) {
            console.error('❌ Logout error:', error);
            // Still proceed with logout even if there's an error
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);
        }
    }, []);

    // Update user profile
    const updateUser = useCallback((updates) => {
        const updatedUser = { ...user, ...updates };
        storage.set('findistress_user_data', updatedUser);
        setUser(updatedUser);
    }, [user]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initialize authentication state from storage
    const initializeAuth = useCallback(async () => {
        try {
            console.log('🚀 Initializing authentication...');

            const storedToken = storage.get('findistress_access_token');
            const storedRefreshToken = storage.get('findistress_refresh_token');
            const storedUser = storage.get('findistress_user_data');
            const storedExpiry = storage.get('findistress_token_expiry');

            if (!storedToken || !storedRefreshToken || !storedUser) {
                console.log('🔍 No stored auth data found');
                setLoading(false);
                return;
            }

            // Check if user was inactive for too long
            if (!checkInactivity()) {
                setLoading(false);
                return;
            }

            const now = Date.now();

            // Check if token is expired
            if (storedExpiry && storedExpiry < now) {
                console.log('🔄 Token expired, clearing auth data');
                storage.clear();
                setLoading(false);
                return;
            }

            // Token is still valid, restore session
            setUser(storedUser);
            setAccessToken(storedToken);
            setRefreshToken(storedRefreshToken);
            setIsAuthenticated(true);

            console.log('✅ Authentication restored from storage');

        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
            storage.clear();
        } finally {
            setLoading(false);
        }
    }, [checkInactivity]);

    // Initialize auth on mount
    useEffect(() => {
        console.log('🚀 AuthProvider mounting...');
        initializeAuth();

        // Set up activity monitoring
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            updateActivity();
        };

        events.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            console.log('🧹 AuthProvider unmounting...');
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [initializeAuth, updateActivity]);

    // Context value
    const contextValue = {
        // State
        authState: {
            user,
            accessToken,
            refreshToken,
            isAuthenticated,
            isLoading: loading,
            error
        },
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        logout,
        updateUser,
        clearError,
        getAuthHeaders,
        updateActivity,

        // Computed values
        isAdmin: user?.is_admin || false,
        userName: user?.full_name || user?.username || 'User',
        userEmail: user?.email || ''
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
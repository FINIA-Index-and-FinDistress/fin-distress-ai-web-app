import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context with explicit default value to prevent undefined errors
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    authState: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        accessToken: null
    },
    login: () => Promise.resolve({ success: false }),
    logout: () => { },
    getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
    updateActivity: () => { },
    updateUser: () => { },
    clearError: () => { },
    isAdmin: false,
    userName: 'User',
    userEmail: ''
});

// FIXED: Simple, safe storage helper
const authStorage = {
    keys: {
        ACCESS_TOKEN: 'findistress_access_token',
        REFRESH_TOKEN: 'findistress_refresh_token',
        USER_DATA: 'findistress_user_data',
        TOKEN_EXPIRY: 'findistress_token_expiry',
        LAST_ACTIVITY: 'findistress_last_activity'
    },

    get: (key) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            }
        } catch (error) {
            console.warn('Storage get error:', error);
        }
        return null;
    },

    set: (key, value) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.warn('Storage set error:', error);
        }
    },

    remove: (key) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn('Storage remove error:', error);
        }
    },

    clear: () => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                Object.values(authStorage.keys).forEach(key => {
                    window.localStorage.removeItem(key);
                });
            }
        } catch (error) {
            console.warn('Storage clear error:', error);
        }
    }
};

// FIXED: AuthProvider component based on your endpoints.py structure
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API base URL matching your endpoints.py
    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

    // Activity tracking
    const updateActivity = useCallback(() => {
        authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());
    }, []);

    // Check inactivity (1 hour timeout matching your backend)
    const checkInactivity = useCallback(() => {
        const lastActivity = authStorage.get(authStorage.keys.LAST_ACTIVITY);
        const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour as per your requirements

        if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
            console.log('🔒 Auto-logout due to inactivity');
            return false;
        }
        return true;
    }, []);

    // Get auth headers for API requests
    const getAuthHeaders = useCallback(() => {
        const token = accessToken || authStorage.get(authStorage.keys.ACCESS_TOKEN);
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }, [accessToken]);

    // Login function matching your endpoints.py login flow
    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔑 Attempting login...');

            // Try JSON login first (matching your /api/v1/login endpoint)
            let response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password
                })
            });

            let data;
            if (response.ok) {
                data = await response.json();
            } else {
                // Try form data login (matching your /api/v1/token endpoint)
                console.log('Trying form data login...');
                const formData = new URLSearchParams();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);

                response = await fetch(`${API_BASE}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Login failed: ${response.status}`);
                }

                data = await response.json();
            }

            // Get user profile (matching your /api/v1/users/me endpoint)
            let userData = {
                username: credentials.username,
                email: '',
                full_name: credentials.username,
                is_admin: false,
                is_active: true
            };

            try {
                const userResponse = await fetch(`${API_BASE}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
                });

                if (userResponse.ok) {
                    userData = await userResponse.json();
                }
            } catch (userError) {
                console.warn('Failed to fetch user profile, using defaults:', userError);
            }

            // FIXED: Calculate token expiry safely
            let tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // Default 2 hours

            // Check if expires_in exists and is a number
            if (data.expires_in && typeof data.expires_in === 'number') {
                tokenExpiry = Date.now() + (data.expires_in * 1000);
            } else if (data.expires_in && typeof data.expires_in === 'string') {
                const expiresInNum = parseInt(data.expires_in, 10);
                if (!isNaN(expiresInNum)) {
                    tokenExpiry = Date.now() + (expiresInNum * 1000);
                }
            }

            // Store authentication data
            authStorage.set(authStorage.keys.ACCESS_TOKEN, data.access_token);
            authStorage.set(authStorage.keys.REFRESH_TOKEN, data.refresh_token || '');
            authStorage.set(authStorage.keys.USER_DATA, userData);
            authStorage.set(authStorage.keys.TOKEN_EXPIRY, tokenExpiry);
            authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());

            // Update state
            setUser(userData);
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token || '');
            setIsAuthenticated(true);
            setError(null);

            console.log('✅ Login successful');
            return { success: true, user: userData };

        } catch (loginError) {
            console.error('❌ Login failed:', loginError);
            const errorMessage = loginError.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    // Logout function
    const logout = useCallback(() => {
        try {
            // Clear storage
            authStorage.clear();

            // Reset state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);

            console.log('🔒 Logout completed');
        } catch (logoutError) {
            console.error('❌ Logout error:', logoutError);
            // Still proceed with logout
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);
        }
    }, []);

    // Update user profile
    const updateUser = useCallback((updates) => {
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        authStorage.set(authStorage.keys.USER_DATA, updatedUser);
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

            const storedToken = authStorage.get(authStorage.keys.ACCESS_TOKEN);
            const storedRefreshToken = authStorage.get(authStorage.keys.REFRESH_TOKEN);
            const storedUser = authStorage.get(authStorage.keys.USER_DATA);
            const storedExpiry = authStorage.get(authStorage.keys.TOKEN_EXPIRY);

            if (!storedToken || !storedUser) {
                console.log('🔍 No stored auth data found');
                setLoading(false);
                return;
            }

            // Check if user was inactive for too long
            if (!checkInactivity()) {
                authStorage.clear();
                setLoading(false);
                return;
            }

            const now = Date.now();

            // Check if token is expired
            if (storedExpiry && storedExpiry < now) {
                console.log('🔄 Token expired, clearing auth data');
                authStorage.clear();
                setLoading(false);
                return;
            }

            // Token is still valid, restore session
            setUser(storedUser);
            setAccessToken(storedToken);
            setRefreshToken(storedRefreshToken || '');
            setIsAuthenticated(true);

            console.log('✅ Authentication restored from storage');

        } catch (initError) {
            console.error('❌ Auth initialization failed:', initError);
            authStorage.clear();
        } finally {
            setLoading(false);
        }
    }, [checkInactivity]);

    // Initialize auth on mount
    useEffect(() => {
        console.log('🚀 AuthProvider mounting...');
        initializeAuth();

        // Set up activity monitoring
        const handleActivity = () => {
            updateActivity();
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

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

    // Create context value with all required properties
    const contextValue = {
        // Core state
        user,
        isAuthenticated,
        loading,
        error,
        accessToken,
        refreshToken,

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
        userEmail: user?.email || '',

        // Legacy compatibility for existing components
        authState: {
            user,
            isAuthenticated,
            isLoading: loading,
            error,
            accessToken,
            refreshToken
        }
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// FIXED: useAuth hook with safe error handling
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        console.error('useAuth must be used within an AuthProvider');
        // Return safe fallback to prevent crashes
        return {
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            accessToken: null,
            refreshToken: null,
            login: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
            logout: () => { },
            updateUser: () => { },
            clearError: () => { },
            getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
            updateActivity: () => { },
            isAdmin: false,
            userName: 'User',
            userEmail: '',
            authState: {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                accessToken: null,
                refreshToken: null
            }
        };
    }

    return context;
};

export default AuthContext;
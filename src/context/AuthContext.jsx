import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useNotifications } from './NotificationContext';

// Enhanced AuthContext with proper token persistence and auto-refresh
const AuthContext = createContext();

// Authentication states
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    TOKEN_REFRESH: 'TOKEN_REFRESH',
    SET_LOADING: 'SET_LOADING',
    UPDATE_USER: 'UPDATE_USER',
    RESET_ERROR: 'RESET_ERROR'
};

// Initial auth state
const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    tokenExpiry: null,
    lastActivity: null
};

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                tokenExpiry: action.payload.tokenExpiry,
                lastActivity: Date.now()
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
                tokenExpiry: null,
                lastActivity: null
            };

        case AUTH_ACTIONS.TOKEN_REFRESH:
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                tokenExpiry: action.payload.tokenExpiry,
                lastActivity: Date.now(),
                error: null
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
                lastActivity: Date.now()
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
                isLoading: false
            };

        case AUTH_ACTIONS.RESET_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// FIXED: Storage utilities for secure token management
const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: 'findistress_access_token',
    REFRESH_TOKEN: 'findistress_refresh_token',
    USER_DATA: 'findistress_user_data',
    TOKEN_EXPIRY: 'findistress_token_expiry',
    LAST_ACTIVITY: 'findistress_last_activity'
};

const storage = {
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    },

    getItem: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return null;
        }
    },

    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    },

    clear: () => {
        try {
            Object.values(AUTH_STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, initialState);

    // FIXED: Safe access to notifications context
    let addNotification = null;
    try {
        const notificationsContext = useNotifications();
        addNotification = notificationsContext?.addNotification || (() => { });
    } catch (error) {
        console.warn('Notifications context not available:', error);
        addNotification = () => { }; // Fallback function
    }

    // Refs for managing timers and preventing memory leaks
    const refreshTimerRef = useRef(null);
    const activityTimerRef = useRef(null);
    const isRefreshingRef = useRef(false);
    const isMountedRef = useRef(true);

    // FIXED: API Configuration
    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

    // CRITICAL FIX: Activity tracking to prevent auto-logout on active users
    const updateActivity = useCallback(() => {
        const now = Date.now();
        storage.setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, now);

        if (authState.isAuthenticated && isMountedRef.current) {
            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: { lastActivity: now }
            });
        }
    }, [authState.isAuthenticated]);

    // CRITICAL FIX: Check if user should be auto-logged out due to inactivity
    const checkInactivity = useCallback(() => {
        const lastActivity = storage.getItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY);
        const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

        if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
            console.log('🔒 Auto-logout due to inactivity');
            logout(false); // Silent logout without notification
            return false;
        }
        return true;
    }, []);

    // CRITICAL FIX: Enhanced token refresh with proper error handling
    const refreshAccessToken = useCallback(async () => {
        if (isRefreshingRef.current) {
            console.log('🔄 Token refresh already in progress');
            return false;
        }

        const refreshToken = storage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            console.log('❌ No refresh token available');
            logout(false);
            return false;
        }

        // Check inactivity before refreshing
        if (!checkInactivity()) {
            return false;
        }

        isRefreshingRef.current = true;

        try {
            console.log('🔄 Attempting token refresh...');

            const response = await fetch(`${API_BASE}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = await response.json();

            // Calculate new expiry time
            const newExpiry = Date.now() + (data.expires_in * 1000);

            // Store new tokens
            storage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
            storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
            storage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, newExpiry);

            // Update state
            if (isMountedRef.current) {
                dispatch({
                    type: AUTH_ACTIONS.TOKEN_REFRESH,
                    payload: {
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        tokenExpiry: newExpiry
                    }
                });
            }

            console.log('✅ Token refreshed successfully');

            // Schedule next refresh
            scheduleTokenRefresh(newExpiry);

            return true;

        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            logout(false); // Silent logout
            return false;
        } finally {
            isRefreshingRef.current = false;
        }
    }, [API_BASE, checkInactivity]);

    // CRITICAL FIX: Smart token refresh scheduling
    const scheduleTokenRefresh = useCallback((expiry) => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const now = Date.now();
        const timeUntilExpiry = expiry - now;
        const refreshTime = Math.max(0, timeUntilExpiry - (5 * 60 * 1000)); // Refresh 5 minutes before expiry

        console.log(`⏰ Scheduling token refresh in ${Math.round(refreshTime / 1000)}s`);

        if (refreshTime > 0) {
            refreshTimerRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    refreshAccessToken();
                }
            }, refreshTime);
        } else {
            // Token is about to expire or has expired
            refreshAccessToken();
        }
    }, [refreshAccessToken]);

    // CRITICAL FIX: Activity monitoring to reset inactivity timer
    const setupActivityMonitoring = useCallback(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            if (isMountedRef.current) {
                updateActivity();

                // Reset inactivity timer
                if (activityTimerRef.current) {
                    clearTimeout(activityTimerRef.current);
                }

                // Set up inactivity check for 1 hour + 1 minute
                activityTimerRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        checkInactivity();
                    }
                }, 61 * 60 * 1000);
            }
        };

        events.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [updateActivity, checkInactivity]);

    // FIXED: Enhanced login function with proper token storage
    const login = useCallback(async (credentials) => {
        if (!isMountedRef.current) return { success: false, error: 'Component unmounted' };

        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            console.log('🔑 Attempting JSON login...');

            // Try JSON login first
            let response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                timeout: 30000
            });

            // If JSON login fails, try form data
            if (!response.ok) {
                console.log('❌ JSON login failed, trying form data...');

                const formData = new URLSearchParams();
                formData.append('username', credentials.username);
                formData.append('password', credentials.password);

                response = await fetch(`${API_BASE}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                    timeout: 30000
                });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Login failed: ${response.status}`);
            }

            const data = await response.json();

            // Get user profile
            const userResponse = await fetch(`${API_BASE}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
            });

            const userData = userResponse.ok ? await userResponse.json() : {
                username: credentials.username,
                email: '',
                full_name: credentials.username
            };

            // Calculate token expiry
            const tokenExpiry = Date.now() + (data.expires_in * 1000);

            // Store authentication data
            storage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
            storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
            storage.setItem(AUTH_STORAGE_KEYS.USER_DATA, userData);
            storage.setItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY, tokenExpiry);
            storage.setItem(AUTH_STORAGE_KEYS.LAST_ACTIVITY, Date.now());

            // Update state
            if (isMountedRef.current) {
                dispatch({
                    type: AUTH_ACTIONS.LOGIN_SUCCESS,
                    payload: {
                        user: userData,
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token,
                        tokenExpiry
                    }
                });

                // Schedule token refresh
                scheduleTokenRefresh(tokenExpiry);
            }

            console.log('✅ Login successful');
            if (addNotification) {
                addNotification('Welcome back! You are now signed in.', 'success');
            }

            return { success: true, user: userData };

        } catch (error) {
            console.error('❌ Login failed:', error);

            if (isMountedRef.current) {
                dispatch({
                    type: AUTH_ACTIONS.LOGIN_FAILURE,
                    payload: error.message
                });
            }

            if (addNotification) {
                addNotification(
                    error.message.includes('timeout')
                        ? 'Connection timeout. Please check your internet connection and try again.'
                        : error.message || 'Login failed. Please check your credentials.',
                    'error'
                );
            }

            return { success: false, error: error.message };
        }
    }, [API_BASE, addNotification, scheduleTokenRefresh]);

    // FIXED: Enhanced logout function
    const logout = useCallback(async (showNotification = true) => {
        try {
            // Clear timers
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
                activityTimerRef.current = null;
            }

            // Clear storage
            storage.clear();

            // Update state
            if (isMountedRef.current) {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }

            if (showNotification && addNotification) {
                addNotification('You have been signed out successfully.', 'info');
            }

            console.log('🔒 Logout completed');

        } catch (error) {
            console.error('❌ Logout error:', error);
            // Still proceed with logout even if there's an error
            if (isMountedRef.current) {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        }
    }, [addNotification]);

    // CRITICAL FIX: Initialize authentication state from storage
    const initializeAuth = useCallback(async () => {
        if (!isMountedRef.current) return;

        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        try {
            const accessToken = storage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = storage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
            const userData = storage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
            const tokenExpiry = storage.getItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);

            console.log('🚀 Initializing authentication...');

            if (!accessToken || !refreshToken || !userData) {
                console.log('🔍 No stored auth data found');
                if (isMountedRef.current) {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
                return;
            }

            // Check if user was inactive for too long
            if (!checkInactivity()) {
                if (isMountedRef.current) {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
                return;
            }

            const now = Date.now();

            // Check if token is expired or about to expire
            if (tokenExpiry && tokenExpiry - now < 60000) { // Less than 1 minute left
                console.log('🔄 Token expired or expiring soon, attempting refresh...');
                const refreshSuccess = await refreshAccessToken();

                if (!refreshSuccess && isMountedRef.current) {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                    return;
                }
            } else {
                // Token is still valid
                if (isMountedRef.current) {
                    dispatch({
                        type: AUTH_ACTIONS.LOGIN_SUCCESS,
                        payload: {
                            user: userData,
                            accessToken,
                            refreshToken,
                            tokenExpiry
                        }
                    });

                    // Schedule refresh for this token
                    if (tokenExpiry) {
                        scheduleTokenRefresh(tokenExpiry);
                    }
                }
            }

            console.log('✅ Authentication initialized successfully');

        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
            storage.clear();
        } finally {
            if (isMountedRef.current) {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        }
    }, [checkInactivity, refreshAccessToken, scheduleTokenRefresh]);

    // Get auth headers for API requests
    const getAuthHeaders = useCallback(() => {
        const token = authState.accessToken || storage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }, [authState.accessToken]);

    // Update user profile
    const updateUser = useCallback((updates) => {
        if (!isMountedRef.current) return;

        const updatedUser = { ...authState.user, ...updates };
        storage.setItem(AUTH_STORAGE_KEYS.USER_DATA, updatedUser);
        dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: updates
        });
    }, [authState.user]);

    // Clear error
    const clearError = useCallback(() => {
        if (isMountedRef.current) {
            dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
        }
    }, []);

    // FIXED: Initialize auth and set up activity monitoring on mount
    useEffect(() => {
        console.log('🚀 AuthProvider mounting...');
        isMountedRef.current = true;

        const cleanup = setupActivityMonitoring();
        initializeAuth();

        return () => {
            console.log('🧹 AuthProvider unmounting...');
            isMountedRef.current = false;
            cleanup();
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
            }
        };
    }, [setupActivityMonitoring, initializeAuth]);

    // Computed values
    const isAuthenticated = authState.isAuthenticated;
    const user = authState.user;
    const loading = authState.isLoading;
    const error = authState.error;

    // Context value
    const contextValue = {
        // State
        authState,
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
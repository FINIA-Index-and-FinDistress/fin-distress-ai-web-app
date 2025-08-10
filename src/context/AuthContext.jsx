import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useNotifications } from './NotificationContext';

// CRITICAL FIX: Correct API base URL with /api/v1 suffix
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';
const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AUTH_STATES = {
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authState, setAuthState] = useState(AUTH_STATES.LOADING);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userPreferences, setUserPreferences] = useState(null);
    const { addNotification, addApiErrorNotification } = useNotifications();
    const initializationRef = useRef(false);
    const debugRef = useRef(false);

    const apiClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    const setAuthorizationHeader = (token) => {
        if (token) {
            apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            delete apiClient.defaults.headers.Authorization;
        }
    };

    // FIXED: Get authentication headers for API calls
    const getAuthHeaders = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return headers;
    }, [accessToken]);

    useEffect(() => {
        setAuthorizationHeader(accessToken);
    }, [accessToken]);

    // Enhanced response interceptor with better error handling
    useEffect(() => {
        const responseInterceptor = apiClient.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    if (refreshToken && originalRequest.url !== '/login') {
                        try {
                            console.log('🔄 Attempting token refresh...');
                            const refreshResponse = await axios.post(`${API_BASE_URL}/refresh`, {
                                refresh_token: refreshToken
                            }, {
                                headers: { 'Content-Type': 'application/json' }
                            });

                            const { access_token, refresh_token } = refreshResponse.data;
                            localStorage.setItem('accessToken', access_token);

                            if (refresh_token) {
                                localStorage.setItem('refreshToken', refresh_token);
                                setRefreshToken(refresh_token);
                            }

                            setAccessToken(access_token);
                            setAuthorizationHeader(access_token);
                            originalRequest.headers.Authorization = `Bearer ${access_token}`;

                            console.log('✅ Token refreshed successfully');
                            return apiClient(originalRequest);
                        } catch (refreshError) {
                            console.error('❌ Token refresh failed:', refreshError);
                            signOut();
                            return Promise.reject(refreshError);
                        }
                    } else {
                        console.log('❌ No refresh token available, signing out');
                        signOut();
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => apiClient.interceptors.response.eject(responseInterceptor);
    }, [refreshToken]);

    const signIn = useCallback(async (username, password) => {
        if (!username?.trim() || !password?.trim()) {
            addNotification('Please provide both username and password', 'error');
            return { success: false, error: 'Missing credentials' };
        }

        setAuthState(AUTH_STATES.LOADING);

        try {
            console.log('🔑 Attempting JSON login...');
            const response = await apiClient.post('/login', {
                username: username.trim(),
                password: password.trim(),
            });

            const { access_token, refresh_token } = response.data;

            if (!access_token) {
                throw new Error('No access token received');
            }

            localStorage.setItem('accessToken', access_token);
            if (refresh_token) {
                localStorage.setItem('refreshToken', refresh_token);
                setRefreshToken(refresh_token);
            }

            setAccessToken(access_token);
            setAuthorizationHeader(access_token);

            // Get user profile
            const userResponse = await apiClient.get('/users/me');
            const userData = userResponse.data;

            setUser(userData);
            setAuthState(AUTH_STATES.AUTHENTICATED);

            // Load user preferences
            try {
                await loadUserPreferences();
            } catch (prefError) {
                console.warn('Could not load user preferences:', prefError);
            }

            addNotification(`Welcome back, ${userData.full_name || userData.username}!`, 'success');
            console.log('✅ Login successful:', userData.username);

            return { success: true, user: userData };

        } catch (error) {
            console.error('❌ JSON login failed, trying form data:', error);

            try {
                const formData = qs.stringify({
                    username: username.trim(),
                    password: password.trim()
                });

                const response = await apiClient.post('/token', formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });

                const { access_token, refresh_token } = response.data;

                if (!access_token) {
                    throw new Error('No access token received');
                }

                localStorage.setItem('accessToken', access_token);
                if (refresh_token) {
                    localStorage.setItem('refreshToken', refresh_token);
                    setRefreshToken(refresh_token);
                }

                setAccessToken(access_token);
                setAuthorizationHeader(access_token);

                const userResponse = await apiClient.get('/users/me');
                const userData = userResponse.data;

                setUser(userData);
                setAuthState(AUTH_STATES.AUTHENTICATED);

                // Load user preferences
                try {
                    await loadUserPreferences();
                } catch (prefError) {
                    console.warn('Could not load user preferences:', prefError);
                }

                addNotification(`Welcome back, ${userData.full_name || userData.username}!`, 'success');
                console.log('✅ Form login successful:', userData.username);

                return { success: true, user: userData };

            } catch (formError) {
                console.error('❌ Both login methods failed:', formError);
                setAuthState(AUTH_STATES.UNAUTHENTICATED);

                let errorMessage = 'Login failed. Please check your credentials.';
                if (formError.response?.status === 401) {
                    errorMessage = 'Invalid username or password.';
                } else if (formError.code === 'ERR_NETWORK') {
                    errorMessage = 'Cannot connect to server. Please try again.';
                } else if (formError.response?.data?.detail) {
                    errorMessage = formError.response.data.detail;
                }

                addNotification(errorMessage, 'error');
                return { success: false, error: errorMessage };
            }
        }
    }, [addNotification, addApiErrorNotification]);

    const signUp = useCallback(async (username, email, password, fullName = null) => {
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            addNotification('Please fill in all required fields', 'error');
            return { success: false, error: 'Missing required fields' };
        }

        setAuthState(AUTH_STATES.LOADING);

        try {
            console.log('🔑 Attempting registration...');
            await apiClient.post('/register', {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                full_name: fullName?.trim() || username.trim(),
            });

            console.log('✅ Registration successful, attempting login...');
            addNotification('Registration successful! Logging you in...', 'success');

            return await signIn(username.trim(), password.trim());
        } catch (error) {
            console.error('❌ Registration failed:', error);
            setAuthState(AUTH_STATES.UNAUTHENTICATED);

            let errorMessage = 'Registration failed. Please try again.';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to server. Please try again.';
            }

            addNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        }
    }, [signIn, addNotification]);

    const signOut = useCallback(() => {
        console.log('🚪 Signing out...');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setUserPreferences(null);
        setAuthState(AUTH_STATES.UNAUTHENTICATED);
        setAuthorizationHeader(null);
        addNotification('Successfully signed out', 'info');
    }, [addNotification]);

    const isAdmin = useCallback(() => {
        return user?.is_admin === true;
    }, [user]);

    const getUserProfile = useCallback(async () => {
        if (!accessToken) return null;

        try {
            const response = await apiClient.get('/users/me');
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to get user profile:', error);
            if (error.response?.status === 401) {
                signOut();
            }
            return null;
        }
    }, [accessToken, signOut]);

    // Update user profile
    const updateProfile = useCallback(async (profileData) => {
        if (!accessToken) {
            addNotification('Please sign in first', 'error');
            return { success: false };
        }

        try {
            const response = await apiClient.put('/users/me', profileData);
            setUser(response.data);
            addNotification('Profile updated successfully!', 'success');
            return { success: true, user: response.data };
        } catch (error) {
            console.error('Profile update failed:', error);
            const errorMessage = error.response?.data?.detail || 'Profile update failed';
            addNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        }
    }, [accessToken, addNotification]);

    // Load user preferences - Fixed to avoid infinite loop
    const loadUserPreferences = useCallback(async () => {
        if (!accessToken) return null;

        try {
            const response = await apiClient.get('/users/me/preferences');
            setUserPreferences(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to load preferences:', error);
            // Don't show error notification for preferences as it's not critical
            return null;
        }
    }, [accessToken]);

    // Update user preferences
    const updatePreferences = useCallback(async (preferences) => {
        if (!accessToken) {
            addNotification('Please sign in first', 'error');
            return { success: false };
        }

        try {
            const response = await apiClient.put('/users/me/preferences', preferences);
            setUserPreferences(response.data.preferences);
            addNotification('Preferences updated successfully!', 'success');
            return { success: true, preferences: response.data.preferences };
        } catch (error) {
            console.error('Preferences update failed:', error);
            const errorMessage = error.response?.data?.detail || 'Preferences update failed';
            addNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        }
    }, [accessToken, addNotification]);

    // Get analytics data
    const getAnalytics = useCallback(async (days = 30) => {
        if (!accessToken) return null;

        try {
            console.log(`📊 Fetching analytics data for ${days} days...`);
            const response = await apiClient.get(`/analytics?days=${days}`);
            console.log('✅ Analytics data received:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get analytics:', error);
            const errorMessage = error.response?.data?.detail || 'Analytics unavailable';
            addNotification(errorMessage, 'error');
            return null;
        }
    }, [accessToken, addNotification]);

    // Get insights data
    const getInsights = useCallback(async () => {
        if (!accessToken) return null;

        try {
            console.log('🧠 Fetching insights data...');
            const response = await apiClient.get('/insights/fast');
            console.log('✅ Insights data received:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get insights:', error);
            const errorMessage = error.response?.data?.detail || 'Insights unavailable';
            addNotification(errorMessage, 'error');
            return null;
        }
    }, [accessToken, addNotification]);

    // Get dashboard data
    const getDashboard = useCallback(async () => {
        if (!accessToken) return null;

        try {
            console.log('📈 Fetching dashboard data...');
            const response = await apiClient.get('/dashboard');
            console.log('✅ Dashboard data received:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get dashboard:', error);
            const errorMessage = error.response?.data?.detail || 'Dashboard unavailable';
            addNotification(errorMessage, 'error');
            return null;
        }
    }, [accessToken, addNotification]);

    // Test server connectivity
    const testConnection = useCallback(async () => {
        try {
            console.log('🔍 Testing server connection...');
            const response = await fetch(`${API_BASE_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Server connection test passed:', data);
                return { success: true, data };
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Server connection test failed:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // Enhanced initialization
    useEffect(() => {
        const initializeAuth = async () => {
            if (initializationRef.current) return;
            initializationRef.current = true;

            console.log('🚀 Initializing authentication...');
            const token = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (!token) {
                console.log('🔍 No token found, user not authenticated');
                setAuthState(AUTH_STATES.UNAUTHENTICATED);
                return;
            }

            try {
                setAuthorizationHeader(token);
                console.log('🔍 Validating stored token...');

                const response = await apiClient.get('/users/me');
                const userData = response.data;

                setUser(userData);
                setAccessToken(token);
                setRefreshToken(storedRefreshToken);
                setAuthState(AUTH_STATES.AUTHENTICATED);

                // Load user preferences
                try {
                    const preferences = await apiClient.get('/users/me/preferences');
                    setUserPreferences(preferences.data);
                } catch (prefError) {
                    console.warn('Could not load user preferences during init:', prefError);
                }

                console.log('✅ Authentication initialized successfully for:', userData.username);
            } catch (error) {
                console.error('❌ Token validation failed:', error);
                // Clear invalid tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setAuthState(AUTH_STATES.UNAUTHENTICATED);
            } finally {
                initializationRef.current = false;
            }
        };

        initializeAuth();
    }, []); // Removed loadUserPreferences dependency to avoid infinite loop

    const debugApiConfiguration = useCallback(() => {
        if (debugRef.current) return;
        debugRef.current = true;

        console.log('🔧 API Configuration Debug:');
        console.log('Base URL:', apiClient.defaults.baseURL);
        console.log('Default headers:', apiClient.defaults.headers);
        console.log('Current token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
        console.log('User authenticated:', !!user);
        console.log('User is admin:', isAdmin());
        console.log('Auth state:', authState);

        // Test backend connection
        testConnection();
    }, [accessToken, user, authState, isAdmin, testConnection]);

    useEffect(() => {
        if (import.meta.env.MODE === 'development') {
            debugApiConfiguration();
        }
    }, [debugApiConfiguration]);

    const contextValue = {
        // User state
        user,
        userPreferences,
        loading: authState === AUTH_STATES.LOADING,
        accessToken,
        token: accessToken, // ADDED: For compatibility
        isAuthenticated: authState === AUTH_STATES.AUTHENTICATED && !!user && !!accessToken,

        // Auth state object for compatibility with usePredictionData hook
        authState: {
            isAuthenticated: authState === AUTH_STATES.AUTHENTICATED && !!user && !!accessToken,
            token: accessToken,
        },

        // Authentication methods
        signIn,
        signUp,
        signOut,

        // User methods
        isAdmin,
        getUserProfile,
        updateProfile,

        // Preferences methods
        loadUserPreferences,
        updatePreferences,

        // Data methods
        getAnalytics,
        getInsights,
        getDashboard,

        // Utility methods
        getAuthHeaders, // FIXED: This was missing and needed by usePredictionData
        testConnection,

        // API client for direct use
        apiClient,

        // Debug method
        debugApiConfiguration,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
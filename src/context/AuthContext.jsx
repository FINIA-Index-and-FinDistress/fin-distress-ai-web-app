// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// // Create context with explicit default value to prevent undefined errors
// const AuthContext = createContext({
//     user: null,
//     isAuthenticated: false,
//     loading: true,
//     error: null,
//     authState: {
//         user: null,
//         isAuthenticated: false,
//         isLoading: true,
//         error: null,
//         accessToken: null
//     },
//     login: () => Promise.resolve({ success: false }),
//     signIn: () => Promise.resolve({ success: false }),
//     signUp: () => Promise.resolve({ success: false }),
//     logout: () => { },
//     getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
//     updateActivity: () => { },
//     updateUser: () => { },
//     clearError: () => { },
//     isAdmin: false,
//     userName: 'User',
//     userEmail: ''
// });

// // FIXED: Simple, safe storage helper
// const authStorage = {
//     keys: {
//         ACCESS_TOKEN: 'findistress_access_token',
//         REFRESH_TOKEN: 'findistress_refresh_token',
//         USER_DATA: 'findistress_user_data',
//         TOKEN_EXPIRY: 'findistress_token_expiry',
//         LAST_ACTIVITY: 'findistress_last_activity'
//     },

//     get: (key) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 const item = window.localStorage.getItem(key);
//                 return item ? JSON.parse(item) : null;
//             }
//         } catch (error) {
//             console.warn('Storage get error:', error);
//         }
//         return null;
//     },

//     set: (key, value) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 window.localStorage.setItem(key, JSON.stringify(value));
//             }
//         } catch (error) {
//             console.warn('Storage set error:', error);
//         }
//     },

//     remove: (key) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 window.localStorage.removeItem(key);
//             }
//         } catch (error) {
//             console.warn('Storage remove error:', error);
//         }
//     },

//     clear: () => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 Object.values(authStorage.keys).forEach(key => {
//                     window.localStorage.removeItem(key);
//                 });
//             }
//         } catch (error) {
//             console.warn('Storage clear error:', error);
//         }
//     }
// };

// // FIXED: AuthProvider component with proper signIn/signUp methods
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [accessToken, setAccessToken] = useState(null);
//     const [refreshToken, setRefreshToken] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // API base URL matching your endpoints.py
//     const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

//     // Activity tracking
//     const updateActivity = useCallback(() => {
//         authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());
//     }, []);

//     // Check inactivity (1 hour timeout matching your backend)
//     const checkInactivity = useCallback(() => {
//         const lastActivity = authStorage.get(authStorage.keys.LAST_ACTIVITY);
//         const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

//         if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
//             console.log('Auto-logout due to inactivity');
//             return false;
//         }
//         return true;
//     }, []);

//     // Get auth headers for API requests
//     const getAuthHeaders = useCallback(() => {
//         const token = accessToken || authStorage.get(authStorage.keys.ACCESS_TOKEN);
//         return token ? {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         } : {
//             'Content-Type': 'application/json'
//         };
//     }, [accessToken]);

//     // FIXED: Sign In function (for login)
//     const signIn = useCallback(async (username, password) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.log('Attempting sign in...');

//             // Try JSON login first (matching your /api/v1/login endpoint)
//             let response = await fetch(`${API_BASE}/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username.trim(),
//                     password: password
//                 })
//             });

//             let data;
//             if (response.ok) {
//                 data = await response.json();
//             } else {
//                 // Try form data login (matching your /api/v1/token endpoint)
//                 console.log('Trying form data login...');
//                 const formData = new URLSearchParams();
//                 formData.append('username', username.trim());
//                 formData.append('password', password);

//                 response = await fetch(`${API_BASE}/token`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                     },
//                     body: formData
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({}));
//                     throw new Error(errorData.detail || 'Invalid username or password');
//                 }

//                 data = await response.json();
//             }

//             // Get user profile (matching your /api/v1/users/me endpoint)
//             let userData = {
//                 username: username.trim(),
//                 email: '',
//                 full_name: username.trim(),
//                 is_admin: false,
//                 is_active: true
//             };

//             try {
//                 const userResponse = await fetch(`${API_BASE}/users/me`, {
//                     headers: {
//                         'Authorization': `Bearer ${data.access_token}`
//                     }
//                 });

//                 if (userResponse.ok) {
//                     userData = await userResponse.json();
//                 }
//             } catch (userError) {
//                 console.warn('Failed to fetch user profile, using defaults:', userError);
//             }

//             // Calculate token expiry safely
//             let tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // Default 2 hours

//             if (data.expires_in && typeof data.expires_in === 'number') {
//                 tokenExpiry = Date.now() + (data.expires_in * 1000);
//             } else if (data.expires_in && typeof data.expires_in === 'string') {
//                 const expiresInNum = parseInt(data.expires_in, 10);
//                 if (!isNaN(expiresInNum)) {
//                     tokenExpiry = Date.now() + (expiresInNum * 1000);
//                 }
//             }

//             // Store authentication data
//             authStorage.set(authStorage.keys.ACCESS_TOKEN, data.access_token);
//             authStorage.set(authStorage.keys.REFRESH_TOKEN, data.refresh_token || '');
//             authStorage.set(authStorage.keys.USER_DATA, userData);
//             authStorage.set(authStorage.keys.TOKEN_EXPIRY, tokenExpiry);
//             authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());

//             // Update state
//             setUser(userData);
//             setAccessToken(data.access_token);
//             setRefreshToken(data.refresh_token || '');
//             setIsAuthenticated(true);
//             setError(null);

//             console.log('Sign in successful');
//             return { success: true, user: userData };

//         } catch (loginError) {
//             console.error('Sign in failed:', loginError);
//             const errorMessage = loginError.message || 'Sign in failed';
//             setError(errorMessage);
//             return { success: false, error: errorMessage };
//         } finally {
//             setLoading(false);
//         }
//     }, [API_BASE]);

//     // FIXED: Sign Up function (for registration)
//     const signUp = useCallback(async (username, email, password, fullName) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.log('Attempting registration...');

//             // Register the user (matching your /api/v1/register endpoint)
//             const registerResponse = await fetch(`${API_BASE}/register`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username.trim(),
//                     email: email.trim(),
//                     password: password,
//                     full_name: fullName?.trim() || username.trim()
//                 })
//             });

//             if (!registerResponse.ok) {
//                 const errorData = await registerResponse.json().catch(() => ({}));
//                 throw new Error(errorData.detail || 'Registration failed');
//             }

//             const registerData = await registerResponse.json();
//             console.log('Registration successful, now signing in...');

//             // After successful registration, sign in the user
//             const signInResult = await signIn(username, password);

//             if (signInResult.success) {
//                 return { success: true, user: signInResult.user };
//             } else {
//                 // Registration succeeded but sign in failed
//                 return {
//                     success: false,
//                     error: 'Registration successful but sign in failed. Please try signing in manually.'
//                 };
//             }

//         } catch (registerError) {
//             console.error('Registration failed:', registerError);
//             const errorMessage = registerError.message || 'Registration failed';
//             setError(errorMessage);
//             return { success: false, error: errorMessage };
//         } finally {
//             setLoading(false);
//         }
//     }, [API_BASE, signIn]);

//     // Alias login to signIn for compatibility
//     const login = signIn;

//     // Logout function
//     const logout = useCallback(() => {
//         try {
//             // Clear storage
//             authStorage.clear();

//             // Reset state
//             setUser(null);
//             setAccessToken(null);
//             setRefreshToken(null);
//             setIsAuthenticated(false);
//             setError(null);

//             console.log('Logout completed');
//         } catch (logoutError) {
//             console.error('Logout error:', logoutError);
//             // Still proceed with logout
//             setUser(null);
//             setAccessToken(null);
//             setRefreshToken(null);
//             setIsAuthenticated(false);
//             setError(null);
//         }
//     }, []);

//     // Update user profile
//     const updateUser = useCallback((updates) => {
//         if (!user) return;

//         const updatedUser = { ...user, ...updates };
//         authStorage.set(authStorage.keys.USER_DATA, updatedUser);
//         setUser(updatedUser);
//     }, [user]);

//     // Clear error
//     const clearError = useCallback(() => {
//         setError(null);
//     }, []);

//     // Initialize authentication state from storage
//     const initializeAuth = useCallback(async () => {
//         try {
//             console.log('Initializing authentication...');

//             const storedToken = authStorage.get(authStorage.keys.ACCESS_TOKEN);
//             const storedRefreshToken = authStorage.get(authStorage.keys.REFRESH_TOKEN);
//             const storedUser = authStorage.get(authStorage.keys.USER_DATA);
//             const storedExpiry = authStorage.get(authStorage.keys.TOKEN_EXPIRY);

//             if (!storedToken || !storedUser) {
//                 console.log('No stored auth data found');
//                 setLoading(false);
//                 return;
//             }

//             // Check if user was inactive for too long
//             if (!checkInactivity()) {
//                 authStorage.clear();
//                 setLoading(false);
//                 return;
//             }

//             const now = Date.now();

//             // Check if token is expired
//             if (storedExpiry && storedExpiry < now) {
//                 console.log('Token expired, clearing auth data');
//                 authStorage.clear();
//                 setLoading(false);
//                 return;
//             }

//             // Token is still valid, restore session
//             setUser(storedUser);
//             setAccessToken(storedToken);
//             setRefreshToken(storedRefreshToken || '');
//             setIsAuthenticated(true);

//             console.log('Authentication restored from storage');

//         } catch (initError) {
//             console.error('Auth initialization failed:', initError);
//             authStorage.clear();
//         } finally {
//             setLoading(false);
//         }
//     }, [checkInactivity]);

//     // Initialize auth on mount
//     useEffect(() => {
//         console.log('AuthProvider mounting...');
//         initializeAuth();

//         // Set up activity monitoring
//         const handleActivity = () => {
//             updateActivity();
//         };

//         const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

//         events.forEach(event => {
//             document.addEventListener(event, handleActivity, { passive: true });
//         });

//         return () => {
//             console.log('AuthProvider unmounting...');
//             events.forEach(event => {
//                 document.removeEventListener(event, handleActivity);
//             });
//         };
//     }, [initializeAuth, updateActivity]);

//     // Create context value with all required properties
//     const contextValue = {
//         // Core state
//         user,
//         isAuthenticated,
//         loading,
//         error,
//         accessToken,
//         refreshToken,

//         // Actions
//         login,      // Alias for signIn
//         signIn,     // Main sign in function
//         signUp,     // Sign up function
//         logout,
//         updateUser,
//         clearError,
//         getAuthHeaders,
//         updateActivity,

//         // Computed values
//         isAdmin: user?.is_admin || false,
//         userName: user?.full_name || user?.username || 'User',
//         userEmail: user?.email || '',

//         // Legacy compatibility for existing components
//         authState: {
//             user,
//             isAuthenticated,
//             isLoading: loading,
//             error,
//             accessToken,
//             refreshToken
//         }
//     };

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // FIXED: useAuth hook with all methods
// export const useAuth = () => {
//     const context = useContext(AuthContext);

//     if (context === undefined) {
//         console.error('useAuth must be used within an AuthProvider');
//         // Return safe fallback to prevent crashes
//         return {
//             user: null,
//             isAuthenticated: false,
//             loading: false,
//             error: null,
//             accessToken: null,
//             refreshToken: null,
//             login: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             signIn: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             signUp: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             logout: () => { },
//             updateUser: () => { },
//             clearError: () => { },
//             getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
//             updateActivity: () => { },
//             isAdmin: false,
//             userName: 'User',
//             userEmail: '',
//             authState: {
//                 user: null,
//                 isAuthenticated: false,
//                 isLoading: false,
//                 error: null,
//                 accessToken: null,
//                 refreshToken: null
//             }
//         };
//     }

//     return context;
// };

// export default AuthContext;

// // src/context/AuthContext.jsx - COMPLETE FIXED VERSION
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// // Create context with explicit default value to prevent undefined errors
// const AuthContext = createContext({
//     user: null,
//     isAuthenticated: false,
//     loading: true,
//     error: null,
//     authState: {
//         user: null,
//         isAuthenticated: false,
//         isLoading: true,
//         error: null,
//         accessToken: null
//     },
//     login: () => Promise.resolve({ success: false }),
//     signIn: () => Promise.resolve({ success: false }),
//     signUp: () => Promise.resolve({ success: false }),
//     updateProfile: () => Promise.resolve({ success: false }), // NEW: Added updateProfile
//     logout: () => { },
//     getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
//     updateActivity: () => { },
//     updateUser: () => { },
//     clearError: () => { },
//     isAdmin: false,
//     userName: 'User',
//     userEmail: ''
// });

// // FIXED: Simple, safe storage helper
// const authStorage = {
//     keys: {
//         ACCESS_TOKEN: 'findistress_access_token',
//         REFRESH_TOKEN: 'findistress_refresh_token',
//         USER_DATA: 'findistress_user_data',
//         TOKEN_EXPIRY: 'findistress_token_expiry',
//         LAST_ACTIVITY: 'findistress_last_activity'
//     },

//     get: (key) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 const item = window.localStorage.getItem(key);
//                 return item ? JSON.parse(item) : null;
//             }
//         } catch (error) {
//             console.warn('Storage get error:', error);
//         }
//         return null;
//     },

//     set: (key, value) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 window.localStorage.setItem(key, JSON.stringify(value));
//             }
//         } catch (error) {
//             console.warn('Storage set error:', error);
//         }
//     },

//     remove: (key) => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 window.localStorage.removeItem(key);
//             }
//         } catch (error) {
//             console.warn('Storage remove error:', error);
//         }
//     },

//     clear: () => {
//         try {
//             if (typeof window !== 'undefined' && window.localStorage) {
//                 Object.values(authStorage.keys).forEach(key => {
//                     window.localStorage.removeItem(key);
//                 });
//             }
//         } catch (error) {
//             console.warn('Storage clear error:', error);
//         }
//     }
// };

// // FIXED: AuthProvider component with proper signIn/signUp methods and NEW updateProfile
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [accessToken, setAccessToken] = useState(null);
//     const [refreshToken, setRefreshToken] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // API base URL matching your endpoints.py
//     const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

//     // Activity tracking
//     const updateActivity = useCallback(() => {
//         authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());
//     }, []);

//     // Check inactivity (1 hour timeout matching your backend)
//     const checkInactivity = useCallback(() => {
//         const lastActivity = authStorage.get(authStorage.keys.LAST_ACTIVITY);
//         const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

//         if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
//             console.log('Auto-logout due to inactivity');
//             return false;
//         }
//         return true;
//     }, []);

//     // Get auth headers for API requests
//     const getAuthHeaders = useCallback(() => {
//         const token = accessToken || authStorage.get(authStorage.keys.ACCESS_TOKEN);
//         return token ? {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         } : {
//             'Content-Type': 'application/json'
//         };
//     }, [accessToken]);

//     // FIXED: Sign In function (for login)
//     const signIn = useCallback(async (username, password) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.log('Attempting sign in...');

//             // Try JSON login first (matching your /api/v1/login endpoint)
//             let response = await fetch(`${API_BASE}/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username.trim(),
//                     password: password
//                 })
//             });

//             let data;
//             if (response.ok) {
//                 data = await response.json();
//             } else {
//                 // Try form data login (matching your /api/v1/token endpoint)
//                 console.log('Trying form data login...');
//                 const formData = new URLSearchParams();
//                 formData.append('username', username.trim());
//                 formData.append('password', password);

//                 response = await fetch(`${API_BASE}/token`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                     },
//                     body: formData
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({}));
//                     throw new Error(errorData.detail || 'Invalid username or password');
//                 }

//                 data = await response.json();
//             }

//             // Get user profile (matching your /api/v1/users/me endpoint)
//             let userData = {
//                 username: username.trim(),
//                 email: '',
//                 full_name: username.trim(),
//                 is_admin: false,
//                 is_active: true
//             };

//             try {
//                 const userResponse = await fetch(`${API_BASE}/users/me`, {
//                     headers: {
//                         'Authorization': `Bearer ${data.access_token}`
//                     }
//                 });

//                 if (userResponse.ok) {
//                     userData = await userResponse.json();
//                 }
//             } catch (userError) {
//                 console.warn('Failed to fetch user profile, using defaults:', userError);
//             }

//             // Calculate token expiry safely
//             let tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // Default 2 hours

//             if (data.expires_in && typeof data.expires_in === 'number') {
//                 tokenExpiry = Date.now() + (data.expires_in * 1000);
//             } else if (data.expires_in && typeof data.expires_in === 'string') {
//                 const expiresInNum = parseInt(data.expires_in, 10);
//                 if (!isNaN(expiresInNum)) {
//                     tokenExpiry = Date.now() + (expiresInNum * 1000);
//                 }
//             }

//             // Store authentication data
//             authStorage.set(authStorage.keys.ACCESS_TOKEN, data.access_token);
//             authStorage.set(authStorage.keys.REFRESH_TOKEN, data.refresh_token || '');
//             authStorage.set(authStorage.keys.USER_DATA, userData);
//             authStorage.set(authStorage.keys.TOKEN_EXPIRY, tokenExpiry);
//             authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());

//             // Update state
//             setUser(userData);
//             setAccessToken(data.access_token);
//             setRefreshToken(data.refresh_token || '');
//             setIsAuthenticated(true);
//             setError(null);

//             console.log('Sign in successful');
//             return { success: true, user: userData };

//         } catch (loginError) {
//             console.error('Sign in failed:', loginError);
//             const errorMessage = loginError.message || 'Sign in failed';
//             setError(errorMessage);
//             return { success: false, error: errorMessage };
//         } finally {
//             setLoading(false);
//         }
//     }, [API_BASE]);

//     // FIXED: Sign Up function (for registration)
//     const signUp = useCallback(async (username, email, password, fullName) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.log('Attempting registration...');

//             // Register the user (matching your /api/v1/register endpoint)
//             const registerResponse = await fetch(`${API_BASE}/register`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username.trim(),
//                     email: email.trim(),
//                     password: password,
//                     full_name: fullName?.trim() || username.trim()
//                 })
//             });

//             if (!registerResponse.ok) {
//                 const errorData = await registerResponse.json().catch(() => ({}));
//                 throw new Error(errorData.detail || 'Registration failed');
//             }

//             const registerData = await registerResponse.json();
//             console.log('Registration successful, now signing in...');

//             // After successful registration, sign in the user
//             const signInResult = await signIn(username, password);

//             if (signInResult.success) {
//                 return { success: true, user: signInResult.user };
//             } else {
//                 // Registration succeeded but sign in failed
//                 return {
//                     success: false,
//                     error: 'Registration successful but sign in failed. Please try signing in manually.'
//                 };
//             }

//         } catch (registerError) {
//             console.error('Registration failed:', registerError);
//             const errorMessage = registerError.message || 'Registration failed';
//             setError(errorMessage);
//             return { success: false, error: errorMessage };
//         } finally {
//             setLoading(false);
//         }
//     }, [API_BASE, signIn]);

//     // NEW: Update Profile function (matching your /api/v1/users/me endpoint)
//     const updateProfile = useCallback(async (updateData) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.log('Attempting profile update...');

//             const token = accessToken || authStorage.get(authStorage.keys.ACCESS_TOKEN);
//             if (!token) {
//                 throw new Error('No authentication token available');
//             }

//             const response = await fetch(`${API_BASE}/users/me`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updateData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.detail || 'Profile update failed');
//             }

//             const updatedUserData = await response.json();

//             // Update stored user data
//             authStorage.set(authStorage.keys.USER_DATA, updatedUserData);
//             setUser(updatedUserData);

//             console.log('Profile updated successfully');
//             return { success: true, user: updatedUserData };

//         } catch (updateError) {
//             console.error('Profile update failed:', updateError);
//             const errorMessage = updateError.message || 'Profile update failed';
//             setError(errorMessage);
//             return { success: false, error: errorMessage };
//         } finally {
//             setLoading(false);
//         }
//     }, [API_BASE, accessToken]);

//     // Alias login to signIn for compatibility
//     const login = signIn;

//     // Logout function
//     const logout = useCallback(() => {
//         try {
//             // Clear storage
//             authStorage.clear();

//             // Reset state
//             setUser(null);
//             setAccessToken(null);
//             setRefreshToken(null);
//             setIsAuthenticated(false);
//             setError(null);

//             console.log('Logout completed');
//         } catch (logoutError) {
//             console.error('Logout error:', logoutError);
//             // Still proceed with logout
//             setUser(null);
//             setAccessToken(null);
//             setRefreshToken(null);
//             setIsAuthenticated(false);
//             setError(null);
//         }
//     }, []);

//     // Update user profile
//     const updateUser = useCallback((updates) => {
//         if (!user) return;

//         const updatedUser = { ...user, ...updates };
//         authStorage.set(authStorage.keys.USER_DATA, updatedUser);
//         setUser(updatedUser);
//     }, [user]);

//     // Clear error
//     const clearError = useCallback(() => {
//         setError(null);
//     }, []);

//     // Initialize authentication state from storage
//     const initializeAuth = useCallback(async () => {
//         try {
//             console.log('Initializing authentication...');

//             const storedToken = authStorage.get(authStorage.keys.ACCESS_TOKEN);
//             const storedRefreshToken = authStorage.get(authStorage.keys.REFRESH_TOKEN);
//             const storedUser = authStorage.get(authStorage.keys.USER_DATA);
//             const storedExpiry = authStorage.get(authStorage.keys.TOKEN_EXPIRY);

//             if (!storedToken || !storedUser) {
//                 console.log('No stored auth data found');
//                 setLoading(false);
//                 return;
//             }

//             // Check if user was inactive for too long
//             if (!checkInactivity()) {
//                 authStorage.clear();
//                 setLoading(false);
//                 return;
//             }

//             const now = Date.now();

//             // Check if token is expired
//             if (storedExpiry && storedExpiry < now) {
//                 console.log('Token expired, clearing auth data');
//                 authStorage.clear();
//                 setLoading(false);
//                 return;
//             }

//             // Token is still valid, restore session
//             setUser(storedUser);
//             setAccessToken(storedToken);
//             setRefreshToken(storedRefreshToken || '');
//             setIsAuthenticated(true);

//             console.log('Authentication restored from storage');

//         } catch (initError) {
//             console.error('Auth initialization failed:', initError);
//             authStorage.clear();
//         } finally {
//             setLoading(false);
//         }
//     }, [checkInactivity]);

//     // Initialize auth on mount
//     useEffect(() => {
//         console.log('AuthProvider mounting...');
//         initializeAuth();

//         // Set up activity monitoring
//         const handleActivity = () => {
//             updateActivity();
//         };

//         const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

//         events.forEach(event => {
//             document.addEventListener(event, handleActivity, { passive: true });
//         });

//         return () => {
//             console.log('AuthProvider unmounting...');
//             events.forEach(event => {
//                 document.removeEventListener(event, handleActivity);
//             });
//         };
//     }, [initializeAuth, updateActivity]);

//     // Create context value with all required properties
//     const contextValue = {
//         // Core state
//         user,
//         isAuthenticated,
//         loading,
//         error,
//         accessToken,
//         refreshToken,

//         // Actions
//         login,          // Alias for signIn
//         signIn,         // Main sign in function
//         signUp,         // Sign up function
//         updateProfile,  // NEW: Profile update function
//         logout,
//         updateUser,
//         clearError,
//         getAuthHeaders,
//         updateActivity,

//         // Computed values
//         isAdmin: user?.is_admin || false,
//         userName: user?.full_name || user?.username || 'User',
//         userEmail: user?.email || '',

//         // Legacy compatibility for existing components
//         authState: {
//             user,
//             isAuthenticated,
//             isLoading: loading,
//             error,
//             accessToken,
//             refreshToken
//         }
//     };

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // FIXED: useAuth hook with all methods
// export const useAuth = () => {
//     const context = useContext(AuthContext);

//     if (context === undefined) {
//         console.error('useAuth must be used within an AuthProvider');
//         // Return safe fallback to prevent crashes
//         return {
//             user: null,
//             isAuthenticated: false,
//             loading: false,
//             error: null,
//             accessToken: null,
//             refreshToken: null,
//             login: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             signIn: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             signUp: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             updateProfile: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
//             logout: () => { },
//             updateUser: () => { },
//             clearError: () => { },
//             getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
//             updateActivity: () => { },
//             isAdmin: false,
//             userName: 'User',
//             userEmail: '',
//             authState: {
//                 user: null,
//                 isAuthenticated: false,
//                 isLoading: false,
//                 error: null,
//                 accessToken: null,
//                 refreshToken: null
//             }
//         };
//     }

//     return context;
// };

// export default AuthContext;

// src/context/AuthContext.jsx - COMPLETE FIXED VERSION with Enhanced Error Handling
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context with explicit default value to prevent undefined errors
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    sessionExpired: false,
    authState: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        accessToken: null
    },
    login: () => Promise.resolve({ success: false }),
    signIn: () => Promise.resolve({ success: false }),
    signUp: () => Promise.resolve({ success: false }),
    updateProfile: () => Promise.resolve({ success: false }),
    logout: () => { },
    getAuthHeaders: () => ({ 'Content-Type': 'application/json' }),
    updateActivity: () => { },
    updateUser: () => { },
    clearError: () => { },
    clearSessionExpired: () => { },
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

// ENHANCED: AuthProvider component with comprehensive error handling
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    // API base URL matching your endpoints.py
    const API_BASE = import.meta.env.VITE_API_BASE || 'https://findistress-ai-web-app-backend.onrender.com/api/v1';

    // Activity tracking
    const updateActivity = useCallback(() => {
        authStorage.set(authStorage.keys.LAST_ACTIVITY, Date.now());
    }, []);

    // ENHANCED: Better inactivity checking with proper error messages
    const checkInactivity = useCallback(() => {
        const lastActivity = authStorage.get(authStorage.keys.LAST_ACTIVITY);
        const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

        if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
            console.log('Auto-logout due to inactivity');
            setSessionExpired(true);
            setError('You have been signed out due to inactivity. Please sign in again.');

            // FIXED: Add notification for inactivity timeout
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('auth-notification', {
                    detail: {
                        type: 'warning',
                        title: 'Signed Out Due to Inactivity',
                        message: 'You have been signed out due to inactivity. Please sign in again.',
                        duration: 7000
                    }
                }));
            }

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

    // ENHANCED: Sign In with comprehensive error handling
    const signIn = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        setSessionExpired(false);

        try {
            console.log('Attempting sign in...');

            // Try JSON login first (matching your /api/v1/login endpoint)
            let response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password
                })
            });

            let data;
            if (response.ok) {
                data = await response.json();
            } else {
                // Try form data login (matching your /api/v1/token endpoint)
                console.log('Trying form data login...');
                const formData = new URLSearchParams();
                formData.append('username', username.trim());
                formData.append('password', password);

                response = await fetch(`${API_BASE}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));

                    // ENHANCED: More specific error messages
                    if (response.status === 401) {
                        throw new Error('Invalid username or password. Please check your credentials and try again.');
                    } else if (response.status === 403) {
                        throw new Error('Account access denied. Please contact support.');
                    } else if (response.status === 429) {
                        throw new Error('Too many login attempts. Please wait a moment and try again.');
                    } else if (response.status >= 500) {
                        throw new Error('Server error. Please try again later.');
                    } else if (response.status === 0 || !response.status) {
                        throw new Error('Network error. Please check your internet connection.');
                    } else {
                        throw new Error(errorData.detail || 'Sign in failed. Please try again.');
                    }
                }

                data = await response.json();
            }

            // Get user profile (matching your /api/v1/users/me endpoint)
            let userData = {
                username: username.trim(),
                email: '',
                full_name: username.trim(),
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

            // Calculate token expiry safely
            let tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // Default 2 hours

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
            setSessionExpired(false);

            console.log('Sign in successful');
            return { success: true, user: userData };

        } catch (loginError) {
            console.error('Sign in failed:', loginError);
            const errorMessage = loginError.message || 'Sign in failed. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    // ENHANCED: Sign Up with comprehensive error handling
    const signUp = useCallback(async (username, email, password, fullName) => {
        setLoading(true);
        setError(null);
        setSessionExpired(false);

        try {
            console.log('Attempting registration...');

            // Register the user (matching your /api/v1/register endpoint)
            const registerResponse = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password,
                    full_name: fullName?.trim() || username.trim()
                })
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json().catch(() => ({}));

                // ENHANCED: More specific error messages for registration
                if (registerResponse.status === 400) {
                    if (errorData.detail && errorData.detail.includes('username')) {
                        throw new Error('Username already exists. Please choose a different username.');
                    } else if (errorData.detail && errorData.detail.includes('email')) {
                        throw new Error('Email already registered. Please use a different email or try signing in.');
                    } else {
                        throw new Error(errorData.detail || 'Registration failed. Please check your information.');
                    }
                } else if (registerResponse.status === 422) {
                    throw new Error('Invalid registration data. Please check all fields and try again.');
                } else if (registerResponse.status >= 500) {
                    throw new Error('Server error during registration. Please try again later.');
                } else if (registerResponse.status === 0 || !registerResponse.status) {
                    throw new Error('Network error. Please check your internet connection.');
                } else {
                    throw new Error(errorData.detail || 'Registration failed. Please try again.');
                }
            }

            const registerData = await registerResponse.json();
            console.log('Registration successful, now signing in...');

            // After successful registration, sign in the user
            const signInResult = await signIn(username, password);

            if (signInResult.success) {
                return { success: true, user: signInResult.user };
            } else {
                return {
                    success: false,
                    error: 'Registration successful but sign in failed. Please try signing in manually.'
                };
            }

        } catch (registerError) {
            console.error('Registration failed:', registerError);
            const errorMessage = registerError.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [API_BASE, signIn]);

    // ENHANCED: Update Profile with error handling
    const updateProfile = useCallback(async (updateData) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Attempting profile update...');

            const token = accessToken || authStorage.get(authStorage.keys.ACCESS_TOKEN);
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await fetch(`${API_BASE}/users/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    setSessionExpired(true);
                    throw new Error('Your session has expired. Please sign in again.');
                } else if (response.status === 403) {
                    throw new Error('You do not have permission to update this profile.');
                } else if (response.status >= 500) {
                    throw new Error('Server error during profile update. Please try again later.');
                } else {
                    throw new Error(errorData.detail || 'Profile update failed');
                }
            }

            const updatedUserData = await response.json();

            // Update stored user data
            authStorage.set(authStorage.keys.USER_DATA, updatedUserData);
            setUser(updatedUserData);

            console.log('Profile updated successfully');
            return { success: true, user: updatedUserData };

        } catch (updateError) {
            console.error('Profile update failed:', updateError);
            const errorMessage = updateError.message || 'Profile update failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [API_BASE, accessToken]);

    // Alias login to signIn for compatibility
    const login = signIn;

    // ENHANCED: Logout with session expired handling
    const logout = useCallback((reason = null) => {
        try {
            // Clear storage
            authStorage.clear();

            // Reset state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);

            // Set appropriate error message based on logout reason
            if (reason === 'session_expired') {
                setSessionExpired(true);
                setError('Your session has expired. Please sign in again.');
            } else if (reason === 'inactivity') {
                setSessionExpired(true);
                setError('You have been signed out due to inactivity. Please sign in again.');
            } else {
                setSessionExpired(false);
            }

            console.log('Logout completed', reason ? `(${reason})` : '');
        } catch (logoutError) {
            console.error('Logout error:', logoutError);
            // Still proceed with logout
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);
            setError(null);
            setSessionExpired(false);
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

    // Clear session expired flag
    const clearSessionExpired = useCallback(() => {
        setSessionExpired(false);
    }, []);

    // ENHANCED: Initialize authentication with better error handling
    const initializeAuth = useCallback(async () => {
        try {
            console.log('Initializing authentication...');

            const storedToken = authStorage.get(authStorage.keys.ACCESS_TOKEN);
            const storedRefreshToken = authStorage.get(authStorage.keys.REFRESH_TOKEN);
            const storedUser = authStorage.get(authStorage.keys.USER_DATA);
            const storedExpiry = authStorage.get(authStorage.keys.TOKEN_EXPIRY);

            if (!storedToken || !storedUser) {
                console.log('No stored auth data found');
                setLoading(false);
                return;
            }

            const now = Date.now();

            // Check if token is expired
            if (storedExpiry && storedExpiry < now) {
                console.log('Token expired, clearing auth data');
                authStorage.clear();
                setSessionExpired(true);
                setError('Your session has expired. Please sign in again.');

                // FIXED: Add notification for session expiry
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('auth-notification', {
                        detail: {
                            type: 'warning',
                            title: 'Session Expired',
                            message: 'Your session has expired. Please sign in again to continue.',
                            duration: 7000
                        }
                    }));
                }

                setLoading(false);
                return;
            }

            // Check if user was inactive for too long
            if (!checkInactivity()) {
                authStorage.clear();
                logout('inactivity');
                setLoading(false);
                return;
            }

            // Token is still valid, restore session
            setUser(storedUser);
            setAccessToken(storedToken);
            setRefreshToken(storedRefreshToken || '');
            setIsAuthenticated(true);
            setSessionExpired(false);

            console.log('Authentication restored from storage');

        } catch (initError) {
            console.error('Auth initialization failed:', initError);
            authStorage.clear();
            setError('Failed to restore session. Please sign in again.');
        } finally {
            setLoading(false);
        }
    }, [checkInactivity, logout]);

    // Initialize auth on mount
    useEffect(() => {
        console.log('AuthProvider mounting...');
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
            console.log('AuthProvider unmounting...');
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
        sessionExpired,
        accessToken,
        refreshToken,

        // Actions
        login,              // Alias for signIn
        signIn,             // Main sign in function
        signUp,             // Sign up function
        updateProfile,      // Profile update function
        logout,
        updateUser,
        clearError,
        clearSessionExpired,
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

// ENHANCED: useAuth hook with comprehensive fallback
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
            sessionExpired: false,
            accessToken: null,
            refreshToken: null,
            login: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
            signIn: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
            signUp: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
            updateProfile: () => Promise.resolve({ success: false, error: 'AuthProvider not found' }),
            logout: () => { },
            updateUser: () => { },
            clearError: () => { },
            clearSessionExpired: () => { },
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
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// DEBUG: Log everything about API configuration
console.log('ENHANCED API Configuration Debug:');
console.log('Environment Mode:', import.meta.env.MODE);
console.log('VITE_API_BASE (raw):', import.meta.env.VITE_API_BASE);
console.log('All Environment Variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('Hard-coded API Base:', 'https://findistress-ai-web-app-backend.onrender.com/api/v1');

// Test the API endpoint directly
console.log('Testing API endpoint...');
fetch('https://findistress-ai-web-app-backend.onrender.com/api/v1/health')
    .then(response => {
        console.log('API Health Check Status:', response.status);
        return response.json();
    })
    .then(data => console.log('API Health Check Data:', data))
    .catch(error => console.error('API Health Check Failed:', error));
    
// Performance monitoring 
const startTime = performance.now();

// Enhanced error handling for production
const handleGlobalError = (error) => {
    console.error('Global application error:', error);

    
    if (import.meta.env.PROD) {
        
    }
};

// Global error handlers
window.addEventListener('error', (event) => {
    handleGlobalError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    handleGlobalError({
        type: 'unhandledrejection',
        reason: event.reason
    });
});

// React 18 Concurrent Features Configuration
const root = ReactDOM.createRoot(document.getElementById('root'));

// Enhanced rendering with error boundary and performance tracking
const renderApp = () => {
    try {
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

        // Performance tracking for conference metrics
        const endTime = performance.now();
        const loadTime = endTime - startTime;

        console.log(`FinDistress AI loaded in ${loadTime.toFixed(2)}ms`);

        // Optional: Track performance metrics
        if (window.gtag) {
            window.gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                event_category: 'Performance'
            });
        }

    } catch (error) {
        handleGlobalError({
            type: 'render_error',
            error: error.message,
            stack: error.stack
        });

        // Fallback UI for critical errors
        document.getElementById('root').innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #eef2ff 100%);
                color: #1e293b;
                text-align: center;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                ">
                    <div style="
                        width: 64px;
                        height: 64px;
                        background: #fee2e2;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1rem;
                    ">
                        <svg width="32" height="32" fill="#dc2626" viewBox="0 0 24 24">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                    <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">
                        Application Error
                    </h1>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">
                        We're sorry, but something went wrong loading the Financial Health Analyzer. 
                        Please refresh the page to try again.
                    </p>
                    <button onclick="window.location.reload()" style="
                        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.75rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
};

// Initialize application
renderApp();

// Hot module replacement for development
if (import.meta.hot) {
    import.meta.hot.accept('./App.jsx', () => {
        renderApp();
    });
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance observer for conference metrics
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log(`Navigation timing: ${entry.loadEventEnd - entry.loadEventStart}ms`);
            }
        });
    });

    perfObserver.observe({ entryTypes: ['navigation', 'measure'] });
}
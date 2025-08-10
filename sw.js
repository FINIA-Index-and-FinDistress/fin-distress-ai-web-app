// Basic service worker - place this in your public folder as sw.js
self.addEventListener('install', (event) => {
    console.log('Service Worker installing');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating');
    event.waitUntil(self.clients.claim());
});

// Optional: Basic caching strategy
self.addEventListener('fetch', (event) => {
    // Let the browser handle all fetch requests normally
    // You can add caching logic here if needed
});
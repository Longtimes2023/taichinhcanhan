// Service Worker cho PWA - Cache và Offline Support
const CACHE_NAME = 'finance-app-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files cần cache
const CACHE_FILES = [
    '/',
    '/index-complete.html',
    '/finance-app-simplified.js',
    '/styles-final.css',
    '/pwa-install.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('SW: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SW: Caching static files');
                return cache.addAll(CACHE_FILES);
            })
            .catch(error => {
                console.error('SW: Cache failed:', error);
            })
    );

    // Force activate immediately
    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('SW: Activating...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('SW: Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Claim all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-HTTP requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    event.respondWith(
        cacheFirst(request)
            .catch(() => networkFirst(request))
            .catch(() => offlineResponse(request))
    );
});

// Cache first strategy for static assets
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        // Update cache in background if it's an HTML file
        if (request.destination === 'document') {
            updateCache(request);
        }
        return cachedResponse;
    }
    throw new Error('Not in cache');
}

// Network first strategy with cache fallback
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        console.log('Background cache update failed:', error);
    }
}

// Offline response for when nothing is available
function offlineResponse(request) {
    if (request.destination === 'document') {
        return new Response(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Quản Lý Tài Chính</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        color: #2d3748;
                    }
                    .offline-content {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .offline-title {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                        color: #1e293b;
                    }
                    .offline-message {
                        color: #64748b;
                        margin-bottom: 1.5rem;
                    }
                    .retry-btn {
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }
                    .retry-btn:hover {
                        background: #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="offline-content">
                    <div class="offline-icon">📱</div>
                    <h1 class="offline-title">Đang Offline</h1>
                    <p class="offline-message">
                        Không thể kết nối đến internet. Vui lòng kiểm tra kết nối và thử lại.
                    </p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        Thử Lại
                    </button>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    }

    // For other resources, return a generic offline response
    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// Background sync for data updates when online
self.addEventListener('sync', event => {
    console.log('SW: Background sync triggered');

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync any pending data changes
        console.log('SW: Performing background sync');
        // This would sync with backend if you have one
    } catch (error) {
        console.error('SW: Background sync failed:', error);
    }
}

// Push notification support (for future features)
self.addEventListener('push', event => {
    console.log('SW: Push message received');

    const options = {
        body: event.data ? event.data.text() : 'Thông báo từ Quản Lý Tài Chính',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E💰%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E💰%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200],
        tag: 'finance-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('Quản Lý Tài Chính', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('SW: Notification clicked');

    event.notification.close();

    event.waitUntil(
        self.clients.openWindow('/')
    );
});

// Handle messages from main thread
self.addEventListener('message', event => {
    console.log('SW: Message received:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('SW: Service Worker loaded');
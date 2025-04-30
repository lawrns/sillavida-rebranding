/**
 * SillaVida Service Worker
 * 
 * This service worker provides offline capabilities and performance improvements
 * through caching strategies.
 */

const CACHE_NAME = 'sillavida-cache-v1';
const STATIC_CACHE_NAME = 'sillavida-static-v1';
const DYNAMIC_CACHE_NAME = 'sillavida-dynamic-v1';
const IMAGE_CACHE_NAME = 'sillavida-images-v1';
const API_CACHE_NAME = 'sillavida-api-v1';

// Resources that should be pre-cached during installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/favicon.ico',
  '/images/placeholder.svg',
  '/offline.html',
];

// Cache time limits (in milliseconds)
const CACHE_LIMITS = {
  [STATIC_CACHE_NAME]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [DYNAMIC_CACHE_NAME]: 7 * 24 * 60 * 60 * 1000, // 7 days
  [IMAGE_CACHE_NAME]: 14 * 24 * 60 * 60 * 1000, // 14 days
  [API_CACHE_NAME]: 1 * 60 * 60 * 1000, // 1 hour
};

// Install event - pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Pre-cache error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that don't match our current versions
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME &&
              cacheName !== API_CACHE_NAME
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        // Ensure the service worker takes control of all clients
        return self.clients.claim();
      })
  );
});

// Helper function to determine cache name based on request
const getCacheName = (request) => {
  const url = new URL(request.url);
  
  // API requests
  if (url.pathname.includes('/api/') || url.hostname.includes('myshopify.com')) {
    return API_CACHE_NAME;
  }
  
  // Image requests
  if (
    request.destination === 'image' ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp')
  ) {
    return IMAGE_CACHE_NAME;
  }
  
  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    return STATIC_CACHE_NAME;
  }
  
  // Default to dynamic cache
  return DYNAMIC_CACHE_NAME;
};

// Helper function to determine if a request should be cached
const shouldCache = (request) => {
  const url = new URL(request.url);
  
  // Don't cache POST requests
  if (request.method !== 'GET') {
    return false;
  }
  
  // Don't cache checkout URLs
  if (url.pathname.includes('/checkout')) {
    return false;
  }
  
  // Don't cache cart URLs
  if (url.pathname.includes('/cart')) {
    return false;
  }
  
  // Don't cache browser extensions
  if (url.protocol === 'chrome-extension:') {
    return false;
  }
  
  return true;
};

// Helper function to clean up old cache entries
const cleanupCache = async () => {
  const cacheNames = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const now = Date.now();
    
    for (const request of requests) {
      // Get the cache entry
      const response = await cache.match(request);
      
      // Skip if we can't get the response
      if (!response) continue;
      
      // Get the timestamp from the response headers
      const timestamp = response.headers.get('sw-timestamp');
      
      // Skip if no timestamp
      if (!timestamp) continue;
      
      // Check if the entry is expired
      const age = now - parseInt(timestamp, 10);
      const limit = CACHE_LIMITS[cacheName] || 0;
      
      if (age > limit) {
        console.log('[Service Worker] Removing expired cache entry:', request.url);
        await cache.delete(request);
      }
    }
  }
};

// Add timestamp to cached responses
const addTimestamp = (response) => {
  // Clone the response to modify it
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.append('sw-timestamp', Date.now().toString());
  
  // Create a new response with the timestamp
  return clonedResponse.blob().then((blob) => {
    return new Response(blob, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers,
    });
  });
};

// Fetch event - handle network requests with caching
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('myshopify.com')) {
    return;
  }
  
  // Apply different strategies based on the request type
  if (shouldCache(event.request)) {
    const cacheName = getCacheName(event.request);
    
    // API requests: Network first, then cache
    if (cacheName === API_CACHE_NAME) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Cache the fresh response
            if (response.ok) {
              const clonedResponse = response.clone();
              addTimestamp(clonedResponse).then((timestampedResponse) => {
                caches.open(cacheName).then((cache) => {
                  cache.put(event.request, timestampedResponse);
                });
              });
            }
            return response;
          })
          .catch(() => {
            // If network fails, try the cache
            return caches.match(event.request).then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
          })
      );
    }
    // Images: Cache first, then network
    else if (cacheName === IMAGE_CACHE_NAME) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response immediately
            return cachedResponse;
          }
          
          // If not in cache, fetch from network
          return fetch(event.request).then((response) => {
            if (!response || !response.ok) {
              return response || caches.match('/images/placeholder.svg');
            }
            
            // Cache the fresh response
            const clonedResponse = response.clone();
            addTimestamp(clonedResponse).then((timestampedResponse) => {
              caches.open(cacheName).then((cache) => {
                cache.put(event.request, timestampedResponse);
              });
            });
            
            return response;
          }).catch(() => {
            // If network fails, return placeholder
            return caches.match('/images/placeholder.svg');
          });
        })
      );
    }
    // Static assets: Cache first, then network
    else if (cacheName === STATIC_CACHE_NAME) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request).then((response) => {
            if (!response || !response.ok) {
              return response;
            }
            
            // Cache the fresh response
            const clonedResponse = response.clone();
            addTimestamp(clonedResponse).then((timestampedResponse) => {
              caches.open(cacheName).then((cache) => {
                cache.put(event.request, timestampedResponse);
              });
            });
            
            return response;
          });
        })
      );
    }
    // Dynamic content: Network first with cache fallback
    else {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Cache the fresh response
            if (response.ok) {
              const clonedResponse = response.clone();
              addTimestamp(clonedResponse).then((timestampedResponse) => {
                caches.open(cacheName).then((cache) => {
                  cache.put(event.request, timestampedResponse);
                });
              });
            }
            return response;
          })
          .catch(() => {
            // If network fails, try the cache
            return caches.match(event.request).then((cachedResponse) => {
              return cachedResponse || 
                // If it's a navigation request, return the offline page
                (event.request.mode === 'navigate' ? 
                  caches.match('/offline.html') : 
                  Promise.reject('Failed to fetch'));
            });
          })
      );
    }
    
    // Trigger cache cleanup (don't block the response)
    event.waitUntil(cleanupCache());
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart-updates') {
    event.waitUntil(syncCartUpdates());
  }
});

// Helper function to sync cart updates when back online
const syncCartUpdates = async () => {
  try {
    const db = await openDatabase();
    const pendingUpdates = await db.getAll('pendingCartUpdates');
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch(update.url, {
          method: update.method,
          headers: update.headers,
          body: update.body,
        });
        
        if (response.ok) {
          await db.delete('pendingCartUpdates', update.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync cart update:', error);
      }
    }
    
    db.close();
  } catch (error) {
    console.error('[Service Worker] Error syncing cart updates:', error);
  }
};

// Helper function to open IndexedDB
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sillavida-offline', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingCartUpdates')) {
        db.createObjectStore('pendingCartUpdates', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve({
        getAll: (storeName) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        },
        delete: (storeName, id) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        },
        close: () => {
          db.close();
        }
      });
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Novedades de SillaVida',
      icon: data.icon || '/images/logo.png',
      badge: '/images/badge.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'SillaVida', options)
    );
  } catch (error) {
    console.error('[Service Worker] Push notification error:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data.url || '/';
      
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

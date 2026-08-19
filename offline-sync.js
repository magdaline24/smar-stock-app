// ============================================
// OFFLINE SYNC MANAGER
// ============================================

// ===== Save Data Offline =====
function saveOfflineData(endpoint, data, method = 'POST') {
    // Get existing offline queue
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    
    // Add new item to queue
    queue.push({
        url: endpoint,
        method: method,
        data: data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    
    // Save to localStorage
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
    console.log('💾 Saved offline data:', data);
    
    // Try to sync immediately if online
    if (navigator.onLine) {
        syncOfflineData();
    } else {
        // Register background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.sync.register('sync-offline-data');
                console.log('📡 Background sync registered');
            });
        }
    }
}

// ===== Sync Offline Data =====
async function syncOfflineData() {
    if (!navigator.onLine) {
        console.log('📡 Still offline, waiting for connection...');
        return;
    }
    
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    
    if (queue.length === 0) {
        console.log('✅ No offline data to sync');
        return;
    }
    
    console.log(`🔄 Syncing ${queue.length} offline items...`);
    
    let synced = 0;
    let failed = 0;
    
    for (const item of queue) {
        try {
            // Get Firebase functions
            const response = await fetch(item.url, {
                method: item.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item.data)
            });
            
            if (response.ok) {
                synced++;
                // Remove from queue
                const index = queue.indexOf(item);
                queue.splice(index, 1);
                localStorage.setItem('offlineQueue', JSON.stringify(queue));
                console.log(`✅ Synced: ${item.url}`);
            } else {
                failed++;
                console.warn(`⚠️ Sync failed for: ${item.url}`, response.status);
            }
        } catch (error) {
            failed++;
            console.error('❌ Sync error:', error);
        }
    }
    
    // Show notification
    if (synced > 0) {
        console.log(`✅ Successfully synced ${synced} items`);
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📦 SmartStock Sync Complete', {
                body: `${synced} items synced successfully!`,
                icon: '/images/icon-192.png'
            });
        }
    }
    
    if (failed > 0) {
        console.warn(`⚠️ ${failed} items failed to sync`);
    }
}

// ===== Check Online Status =====
function checkOnlineStatus() {
    if (navigator.onLine) {
        document.body.classList.remove('offline-mode');
        document.body.classList.add('online-mode');
        console.log('🌐 Online - Data will sync automatically');
        // Auto sync when online
        syncOfflineData();
    } else {
        document.body.classList.remove('online-mode');
        document.body.classList.add('offline-mode');
        console.log('📡 Offline - Data will be saved locally');
    }
}

// ===== Add Offline Status Indicator =====
function addOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offlineIndicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        z-index: 9999;
        display: none;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(indicator);
    
    function updateIndicator() {
        if (navigator.onLine) {
            indicator.style.display = 'none';
        } else {
            indicator.style.display = 'block';
            indicator.style.background = '#ef4444';
            indicator.style.color = 'white';
            indicator.textContent = '📡 Offline Mode - Data saved locally';
        }
    }
    
    updateIndicator();
    window.addEventListener('online', function() {
        updateIndicator();
        syncOfflineData();
        alert('🌐 Back online! Your data is syncing...');
    });
    window.addEventListener('offline', function() {
        updateIndicator();
        alert('📡 You are offline. Your data will be saved locally.');
    });
}

// ===== Load on page load =====
document.addEventListener('DOMContentLoaded', function() {
    checkOnlineStatus();
    addOfflineIndicator();
    
    // Check for offline queue on load
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    if (queue.length > 0 && navigator.onLine) {
        syncOfflineData();
    }
});

// ===== Network status listener =====
window.addEventListener('online', function() {
    console.log('🌐 Online');
    document.dispatchEvent(new Event('online-status-change'));
});

window.addEventListener('offline', function() {
    console.log('📡 Offline');
    document.dispatchEvent(new Event('online-status-change'));
});

console.log('✅ Offline Sync Manager loaded!');
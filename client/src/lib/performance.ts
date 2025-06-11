
// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  navigationTime: number;
  memoryUsage?: number;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  
  static startTiming(label: string): () => void {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${label}: ${end - start}ms`);
    };
  }

  static trackPageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        this.metrics.push({
          loadTime,
          renderTime,
          navigationTime: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          memoryUsage: (performance as any).memory?.usedJSHeapSize,
        });

        // Report critical metrics
        if (loadTime > 3000) {
          console.warn(`Slow page load detected: ${loadTime}ms`);
        }
      });
    }
  }

  static getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  static reportWebVitals() {
    // Core Web Vitals reporting
    if ('web-vital' in window) {
      // This would integrate with real monitoring service
      console.log('Web Vitals ready for reporting');
    }
  }
}

// Resource preloading
export function preloadRoute(routePath: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  }
}

export function preloadCriticalResources() {
  const criticalUrls = [
    '/api/campaigns',
    '/api/user',
    '/api/notifications'
  ];

  criticalUrls.forEach(url => {
    fetch(url, { method: 'HEAD' }).catch(() => {
      // Silent fail for prefetch
    });
  });
}

// Memory management
export function cleanupUnusedData() {
  // Clean up expired cache entries
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old') || name.includes('expired')) {
          caches.delete(name);
        }
      });
    });
  }
  
  // Clear old localStorage entries
  if (typeof Storage !== 'undefined') {
    const expiredKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('temp_') && key.includes('_timestamp_')) {
        const timestamp = parseInt(key.split('_timestamp_')[1]);
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) { // 24 hours
          expiredKeys.push(key);
        }
      }
    }
    expiredKeys.forEach(key => localStorage.removeItem(key));
  }
}

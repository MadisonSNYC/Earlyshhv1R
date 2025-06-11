// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  navigationTime: number;
  memoryUsage?: number;
}

type Metric = {
  name: string;
  value: number;
  delta?: number;
};

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
    if (typeof window === 'undefined') return;

    // Track page load timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page Load Time: ${pageLoadTime}ms`);
      }, 0);
    });
  }

  static getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  static reportWebVitals() {
    if (typeof window === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const metric: Metric = {
            name: entry.name,
            value: entry.startTime,
            delta: entry.duration,
          };

          // Log metrics
          console.log(`Web Vital: ${metric.name}`, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            delta: Math.round(metric.delta ?? 0),
          });
        });
      });

      // Observe performance entries
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    } catch (err) {
      console.error('Failed to initialize performance monitoring:', err);
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

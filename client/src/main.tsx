import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient, warmCache } from "./lib/queryClient";
import { PerformanceMonitor, preloadCriticalResources, cleanupUnusedData } from "./lib/performance";

// Initialize performance monitoring
PerformanceMonitor.trackPageLoad();
PerformanceMonitor.reportWebVitals();

// Preload critical resources
preloadCriticalResources();

// Clean up old data
cleanupUnusedData();

// Register service worker
if ('serviceWorker' in navigator) {
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

// Mount React app
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Warm cache after initial load
setTimeout(() => {
  warmCache();
}, 1000);
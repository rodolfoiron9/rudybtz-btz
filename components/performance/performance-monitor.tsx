'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  enableDeviceInfo?: boolean;
  enableNetworkInfo?: boolean;
}

export function PerformanceMonitor({ 
  enableDeviceInfo = false,
  enableNetworkInfo = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    // Web Vitals monitoring
    const measureWebVitals = () => {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;

      const newMetrics: Partial<PerformanceMetrics> = {
        fcp: fcpEntry ? fcpEntry.startTime : 0,
        ttfb
      };

      setMetrics(prev => ({ ...prev, ...newMetrics }));
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Update:', newMetrics);
      }
    };

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          setMetrics(prev => ({ ...prev, lcp }));
          
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP Update:', { lcp });
          }
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fidEntry = entry as any;
          if (fidEntry.processingStart) {
            const fid = fidEntry.processingStart - entry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
            
            if (process.env.NODE_ENV === 'development') {
              console.log('FID Update:', { fid });
            }
          }
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach(entry => {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value || 0;
          }
        });
        
        setMetrics(prev => ({ ...prev, cls: clsValue }));
        
        if (process.env.NODE_ENV === 'development') {
          console.log('CLS Update:', { cls: clsValue });
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      measureWebVitals();

      // Cleanup
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    } else {
      measureWebVitals();
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (enableDeviceInfo) {
      setDeviceInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }
  }, [enableDeviceInfo]);

  useEffect(() => {
    if (enableNetworkInfo && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });
    }
  }, [enableNetworkInfo]);

  // Log performance data to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.keys(metrics).length > 0) {
      console.group('🚀 Performance Metrics');
      console.log('Web Vitals:', metrics);
      if (deviceInfo) console.log('Device Info:', deviceInfo);
      if (networkInfo) console.log('Network Info:', networkInfo);
      console.groupEnd();
    }
  }, [metrics, deviceInfo, networkInfo]);

  // Return null - this is a monitoring component
  return null;
}

// Hook for using performance metrics in components
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  return metrics;
}

// Performance score calculator
export function calculatePerformanceScore(metrics: Partial<PerformanceMetrics>): number {
  let score = 100;

  // FCP scoring (Good: < 1.8s, Needs Improvement: 1.8s - 3s, Poor: > 3s)
  if (metrics.fcp) {
    if (metrics.fcp > 3000) score -= 25;
    else if (metrics.fcp > 1800) score -= 10;
  }

  // LCP scoring (Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s)
  if (metrics.lcp) {
    if (metrics.lcp > 4000) score -= 25;
    else if (metrics.lcp > 2500) score -= 10;
  }

  // FID scoring (Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms)
  if (metrics.fid) {
    if (metrics.fid > 300) score -= 25;
    else if (metrics.fid > 100) score -= 10;
  }

  // CLS scoring (Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25)
  if (metrics.cls) {
    if (metrics.cls > 0.25) score -= 25;
    else if (metrics.cls > 0.1) score -= 10;
  }

  return Math.max(0, score);
}

// Analytics helper for sending performance data
export function sendPerformanceAnalytics(metrics: Partial<PerformanceMetrics>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'web_vitals', {
      event_category: 'Performance',
      event_label: 'Web Vitals',
      value: Math.round(calculatePerformanceScore(metrics)),
      custom_map: {
        metric_fcp: metrics.fcp,
        metric_lcp: metrics.lcp,
        metric_fid: metrics.fid,
        metric_cls: metrics.cls,
        metric_ttfb: metrics.ttfb
      }
    });
  }

  // Can also send to other analytics services
  console.log('Performance Analytics:', {
    score: calculatePerformanceScore(metrics),
    metrics
  });
}
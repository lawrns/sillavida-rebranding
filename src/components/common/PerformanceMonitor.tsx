import { useEffect, useRef } from 'react';
import { measureRouteChange, analyzeResourceTiming, monitorMemoryUsage } from '../../utils/webVitals';

interface PerformanceMonitorProps {
  routeName: string;
  children: React.ReactNode;
}

/**
 * PerformanceMonitor - Wraps components to measure performance metrics
 * 
 * This component automatically measures:
 * - Route change performance
 * - Component render time
 * - Memory usage monitoring
 * - Resource timing analysis
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  routeName, 
  children 
}) => {
  const measureRoute = useRef<(() => void) | null>(null);
  const renderStart = useRef<number>(performance.now());

  useEffect(() => {
    // Start measuring route change when component mounts
    measureRoute.current = measureRouteChange(routeName);
    renderStart.current = performance.now();

    return () => {
      // Stop measuring when component unmounts
      if (measureRoute.current) {
        measureRoute.current();
      }
    };
  }, [routeName]);

  useEffect(() => {
    // Measure component render time
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${routeName} render time: ${renderTime.toFixed(2)}ms`);
    }

    // Analyze resource timing after component renders
    const analysisTimer = setTimeout(() => {
      analyzeResourceTiming();
      monitorMemoryUsage();
    }, 1000); // Wait 1 second for resources to load

    return () => clearTimeout(analysisTimer);
  }, [routeName]);

  return <>{children}</>;
};

export default PerformanceMonitor;
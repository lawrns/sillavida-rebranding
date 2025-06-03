/**
 * Performance Monitoring Service
 * 
 * Extends the existing analytics infrastructure to track Judge.me API performance metrics,
 * widget loading times, error frequency, and performance trends over time.
 * 
 * Created as part of TASK-105 Phase 3 implementation.
 */

import { trackEvent } from '../utils/analytics';
import { logger } from '../utils/logger';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'judge_me' | 'shopify' | 'system' | 'user_experience';
  tags?: Record<string, string>;
}

interface AlertThreshold {
  metric: string;
  threshold: number;
  severity: ErrorSeverity;
  timeWindow: number; // in milliseconds
}

interface PerformanceTrend {
  metric: string;
  values: { timestamp: Date; value: number }[];
  trend: 'improving' | 'degrading' | 'stable';
  changePercent: number;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private alertThresholds: AlertThreshold[] = [];
  private isEnabled: boolean = true;
  private maxMetricsHistory: number = 1000;

  constructor() {
    this.initializeDefaultThresholds();
    this.setupPerformanceObserver();
  }

  /**
   * Initialize default alert thresholds
   */
  private initializeDefaultThresholds(): void {
    this.alertThresholds = [
      {
        metric: 'judge_me_widget_load_time',
        threshold: 3000,
        severity: ErrorSeverity.MEDIUM,
        timeWindow: 300000 // 5 minutes
      },
      {
        metric: 'judge_me_api_response_time',
        threshold: 2000,
        severity: ErrorSeverity.MEDIUM,
        timeWindow: 300000
      },
      {
        metric: 'judge_me_error_rate',
        threshold: 5, // 5% error rate
        severity: ErrorSeverity.HIGH,
        timeWindow: 300000
      },
      {
        metric: 'shopify_api_response_time',
        threshold: 1500,
        severity: ErrorSeverity.MEDIUM,
        timeWindow: 300000
      },
      {
        metric: 'page_load_time',
        threshold: 4000,
        severity: ErrorSeverity.MEDIUM,
        timeWindow: 300000
      },
      {
        metric: 'critical_error_rate',
        threshold: 1, // 1% critical error rate
        severity: ErrorSeverity.CRITICAL,
        timeWindow: 300000
      }
    ];
  }

  /**
   * Setup Performance Observer for automatic metrics collection
   */
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              name: 'page_load_time',
              value: navEntry.loadEventEnd - navEntry.navigationStart,
              category: 'user_experience',
              tags: { type: 'navigation' }
            });
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Observe resource timing for API calls
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Track Judge.me API calls
            if (resourceEntry.name.includes('judge.me') || resourceEntry.name.includes('judgeme')) {
              this.recordMetric({
                name: 'judge_me_api_response_time',
                value: resourceEntry.responseEnd - resourceEntry.requestStart,
                category: 'judge_me',
                tags: { 
                  url: resourceEntry.name,
                  type: 'api_call'
                }
              });
            }
            
            // Track Shopify API calls
            if (resourceEntry.name.includes('myshopify.com')) {
              this.recordMetric({
                name: 'shopify_api_response_time',
                value: resourceEntry.responseEnd - resourceEntry.requestStart,
                category: 'shopify',
                tags: { 
                  url: resourceEntry.name,
                  type: 'api_call'
                }
              });
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

    } catch (error) {
      logger.warn('Failed to setup Performance Observer', {
        component: 'PerformanceMonitoringService',
        action: 'setupPerformanceObserver',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    if (!this.isEnabled) return;

    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date()
    };

    this.metrics.push(fullMetric);

    // Maintain metrics history limit
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Check alert thresholds
    this.checkAlertThresholds(fullMetric);

    // Track in analytics
    trackEvent('performance_metric', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_category: metric.category,
      ...metric.tags
    });

    logger.debug(`Performance metric recorded: ${metric.name} = ${metric.value}`, {
      component: 'PerformanceMonitoringService',
      action: 'recordMetric',
      data: fullMetric
    });
  }

  /**
   * Record Judge.me widget loading time
   */
  recordJudgeMeWidgetLoadTime(loadTime: number, widgetType: string, success: boolean): void {
    this.recordMetric({
      name: 'judge_me_widget_load_time',
      value: loadTime,
      category: 'judge_me',
      tags: {
        widget_type: widgetType,
        success: success.toString()
      }
    });

    // Record success/failure rate
    this.recordMetric({
      name: 'judge_me_widget_success_rate',
      value: success ? 100 : 0,
      category: 'judge_me',
      tags: {
        widget_type: widgetType
      }
    });
  }

  /**
   * Record Judge.me API call performance
   */
  recordJudgeMeApiCall(endpoint: string, responseTime: number, success: boolean): void {
    this.recordMetric({
      name: 'judge_me_api_response_time',
      value: responseTime,
      category: 'judge_me',
      tags: {
        endpoint,
        success: success.toString()
      }
    });

    // Track error rate
    if (!success) {
      this.recordMetric({
        name: 'judge_me_error_rate',
        value: 1,
        category: 'judge_me',
        tags: { endpoint }
      });
    }
  }

  /**
   * Record Shopify API call performance
   */
  recordShopifyApiCall(operation: string, responseTime: number, success: boolean): void {
    this.recordMetric({
      name: 'shopify_api_response_time',
      value: responseTime,
      category: 'shopify',
      tags: {
        operation,
        success: success.toString()
      }
    });

    if (!success) {
      this.recordMetric({
        name: 'shopify_error_rate',
        value: 1,
        category: 'shopify',
        tags: { operation }
      });
    }
  }

  /**
   * Check if any metrics exceed alert thresholds
   */
  private checkAlertThresholds(metric: PerformanceMetric): void {
    const relevantThresholds = this.alertThresholds.filter(threshold => 
      threshold.metric === metric.name
    );

    for (const threshold of relevantThresholds) {
      const recentMetrics = this.getRecentMetrics(metric.name, threshold.timeWindow);
      
      if (recentMetrics.length === 0) continue;

      let shouldAlert = false;
      let alertMessage = '';

      if (metric.name.includes('_time')) {
        // For timing metrics, alert if average exceeds threshold
        const avgValue = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
        if (avgValue > threshold.threshold) {
          shouldAlert = true;
          alertMessage = `Average ${metric.name} (${avgValue.toFixed(0)}ms) exceeds threshold (${threshold.threshold}ms)`;
        }
      } else if (metric.name.includes('_rate')) {
        // For rate metrics, calculate percentage
        const errorCount = recentMetrics.filter(m => m.value > 0).length;
        const errorRate = (errorCount / recentMetrics.length) * 100;
        if (errorRate > threshold.threshold) {
          shouldAlert = true;
          alertMessage = `${metric.name} (${errorRate.toFixed(1)}%) exceeds threshold (${threshold.threshold}%)`;
        }
      }

      if (shouldAlert) {
        this.triggerAlert(threshold, alertMessage, metric);
      }
    }
  }

  /**
   * Trigger a performance alert
   */
  private triggerAlert(threshold: AlertThreshold, message: string, metric: PerformanceMetric): void {
    // Create error through error handler for consistent alerting
    errorHandler.handleError(
      errorHandler.createError('PERFORMANCE_DEGRADATION', {
        message,
        severity: threshold.severity,
        details: {
          metric: threshold.metric,
          threshold: threshold.threshold,
          actualValue: metric.value,
          category: metric.category,
          tags: metric.tags
        }
      }),
      {
        component: 'PerformanceMonitoringService',
        action: 'triggerAlert'
      }
    );

    // Track alert in analytics
    trackEvent('performance_alert', {
      metric: threshold.metric,
      severity: threshold.severity,
      threshold: threshold.threshold,
      actual_value: metric.value,
      category: metric.category
    });
  }

  /**
   * Get recent metrics for a specific metric name
   */
  private getRecentMetrics(metricName: string, timeWindow: number): PerformanceMetric[] {
    const now = Date.now();
    return this.metrics.filter(metric => 
      metric.name === metricName && 
      (now - metric.timestamp.getTime()) <= timeWindow
    );
  }

  /**
   * Get performance trends for a metric
   */
  getPerformanceTrend(metricName: string, timeWindow: number = 3600000): PerformanceTrend {
    const recentMetrics = this.getRecentMetrics(metricName, timeWindow);
    
    if (recentMetrics.length < 2) {
      return {
        metric: metricName,
        values: recentMetrics.map(m => ({ timestamp: m.timestamp, value: m.value })),
        trend: 'stable',
        changePercent: 0
      };
    }

    // Calculate trend
    const sortedMetrics = recentMetrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const firstHalf = sortedMetrics.slice(0, Math.floor(sortedMetrics.length / 2));
    const secondHalf = sortedMetrics.slice(Math.floor(sortedMetrics.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, m) => sum + m.value, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, m) => sum + m.value, 0) / secondHalf.length;

    const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    let trend: 'improving' | 'degrading' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 10) {
      // For timing metrics, lower is better
      if (metricName.includes('_time')) {
        trend = changePercent < 0 ? 'improving' : 'degrading';
      } else {
        // For rate metrics, depends on the metric
        trend = changePercent > 0 ? 'degrading' : 'improving';
      }
    }

    return {
      metric: metricName,
      values: sortedMetrics.map(m => ({ timestamp: m.timestamp, value: m.value })),
      trend,
      changePercent: Math.abs(changePercent)
    };
  }

  /**
   * Get current performance summary
   */
  getPerformanceSummary(): {
    judgeMeMetrics: any;
    shopifyMetrics: any;
    systemMetrics: any;
    alerts: number;
  } {
    const now = Date.now();
    const timeWindow = 300000; // 5 minutes

    const recentMetrics = this.metrics.filter(m => 
      (now - m.timestamp.getTime()) <= timeWindow
    );

    const judgeMeMetrics = this.calculateCategoryMetrics(recentMetrics, 'judge_me');
    const shopifyMetrics = this.calculateCategoryMetrics(recentMetrics, 'shopify');
    const systemMetrics = this.calculateCategoryMetrics(recentMetrics, 'system');

    return {
      judgeMeMetrics,
      shopifyMetrics,
      systemMetrics,
      alerts: this.getActiveAlertsCount()
    };
  }

  /**
   * Calculate metrics for a specific category
   */
  private calculateCategoryMetrics(metrics: PerformanceMetric[], category: string): any {
    const categoryMetrics = metrics.filter(m => m.category === category);
    
    const loadTimes = categoryMetrics.filter(m => m.name.includes('_time'));
    const errorRates = categoryMetrics.filter(m => m.name.includes('_rate'));
    const successRates = categoryMetrics.filter(m => m.name.includes('success_rate'));

    return {
      averageLoadTime: loadTimes.length > 0 
        ? loadTimes.reduce((sum, m) => sum + m.value, 0) / loadTimes.length 
        : 0,
      errorRate: errorRates.length > 0 
        ? (errorRates.filter(m => m.value > 0).length / errorRates.length) * 100 
        : 0,
      successRate: successRates.length > 0 
        ? successRates.reduce((sum, m) => sum + m.value, 0) / successRates.length 
        : 100,
      totalCalls: categoryMetrics.length
    };
  }

  /**
   * Get count of active alerts
   */
  private getActiveAlertsCount(): number {
    const errorMetrics = errorHandler.getPerformanceMetrics();
    return errorMetrics.criticalErrorCount + 
           (errorMetrics.errorCounts.get(ErrorCategory.PERFORMANCE) || 0);
  }

  /**
   * Enable or disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    logger.info(`Performance monitoring ${enabled ? 'enabled' : 'disabled'}`, {
      component: 'PerformanceMonitoringService',
      action: 'setEnabled'
    });
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clearMetrics(): void {
    this.metrics = [];
    logger.debug('Performance metrics cleared', {
      component: 'PerformanceMonitoringService',
      action: 'clearMetrics'
    });
  }

  /**
   * Get all metrics (for debugging)
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// Export singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();

// Export types
export type { PerformanceMetric, AlertThreshold, PerformanceTrend };

/**
 * Production Alerting Configuration
 * 
 * Defines alerting thresholds and notification settings for production monitoring.
 * Implements production alerting for Judge.me widget failures, API performance degradation,
 * and critical integration errors that affect user experience.
 * 
 * Created as part of TASK-105 Phase 3 implementation.
 */

import { ErrorSeverity } from '../utils/errorHandler';

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals';
  severity: ErrorSeverity;
  timeWindow: number; // in milliseconds
  enabled: boolean;
  notificationChannels: NotificationChannel[];
  cooldownPeriod: number; // in milliseconds
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'console';
  config: {
    url?: string;
    email?: string;
    slackChannel?: string;
    webhookUrl?: string;
  };
  enabled: boolean;
}

export interface AlertingConfig {
  enabled: boolean;
  defaultCooldownPeriod: number;
  maxAlertsPerHour: number;
  escalationRules: EscalationRule[];
  maintenanceMode: boolean;
}

export interface EscalationRule {
  severity: ErrorSeverity;
  escalateAfter: number; // in milliseconds
  escalateTo: NotificationChannel[];
}

/**
 * Default production alerting configuration
 */
export const PRODUCTION_ALERTING_CONFIG: AlertingConfig = {
  enabled: true,
  defaultCooldownPeriod: 300000, // 5 minutes
  maxAlertsPerHour: 20,
  maintenanceMode: false,
  escalationRules: [
    {
      severity: ErrorSeverity.CRITICAL,
      escalateAfter: 300000, // 5 minutes
      escalateTo: [
        {
          type: 'email',
          config: { email: 'alerts@sillavida.com' },
          enabled: true
        },
        {
          type: 'slack',
          config: { slackChannel: '#critical-alerts' },
          enabled: true
        }
      ]
    },
    {
      severity: ErrorSeverity.HIGH,
      escalateAfter: 900000, // 15 minutes
      escalateTo: [
        {
          type: 'slack',
          config: { slackChannel: '#alerts' },
          enabled: true
        }
      ]
    }
  ]
};

/**
 * Production alert rules for Judge.me and system monitoring
 */
export const PRODUCTION_ALERT_RULES: AlertRule[] = [
  // Judge.me Widget Performance Alerts
  {
    id: 'judge-me-widget-load-failure',
    name: 'Judge.me Widget Load Failure Rate',
    description: 'Alert when Judge.me widget loading failure rate exceeds acceptable threshold',
    metric: 'judge_me_widget_failure_rate',
    threshold: 10, // 10% failure rate
    operator: 'greater_than',
    severity: ErrorSeverity.HIGH,
    timeWindow: 300000, // 5 minutes
    enabled: true,
    cooldownPeriod: 600000, // 10 minutes
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#judge-me-alerts' },
        enabled: true
      },
      {
        type: 'console',
        config: {},
        enabled: true
      }
    ]
  },
  {
    id: 'judge-me-widget-load-time',
    name: 'Judge.me Widget Load Time Degradation',
    description: 'Alert when Judge.me widget loading time exceeds performance threshold',
    metric: 'judge_me_widget_load_time',
    threshold: 5000, // 5 seconds
    operator: 'greater_than',
    severity: ErrorSeverity.MEDIUM,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 300000,
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#performance-alerts' },
        enabled: true
      }
    ]
  },
  {
    id: 'judge-me-api-response-time',
    name: 'Judge.me API Response Time',
    description: 'Alert when Judge.me API response time exceeds acceptable threshold',
    metric: 'judge_me_api_response_time',
    threshold: 3000, // 3 seconds
    operator: 'greater_than',
    severity: ErrorSeverity.MEDIUM,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 300000,
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#api-alerts' },
        enabled: true
      }
    ]
  },
  {
    id: 'judge-me-script-load-failure',
    name: 'Judge.me Script Load Failure',
    description: 'Critical alert when Judge.me script fails to load',
    metric: 'judge_me_script_load_failure',
    threshold: 1, // Any failure
    operator: 'greater_than',
    severity: ErrorSeverity.CRITICAL,
    timeWindow: 60000, // 1 minute
    enabled: true,
    cooldownPeriod: 900000, // 15 minutes
    notificationChannels: [
      {
        type: 'email',
        config: { email: 'critical@sillavida.com' },
        enabled: true
      },
      {
        type: 'slack',
        config: { slackChannel: '#critical-alerts' },
        enabled: true
      }
    ]
  },

  // Shopify Integration Alerts
  {
    id: 'shopify-api-response-time',
    name: 'Shopify API Response Time',
    description: 'Alert when Shopify API response time exceeds threshold',
    metric: 'shopify_api_response_time',
    threshold: 2000, // 2 seconds
    operator: 'greater_than',
    severity: ErrorSeverity.MEDIUM,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 300000,
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#shopify-alerts' },
        enabled: true
      }
    ]
  },
  {
    id: 'shopify-cart-operation-failure',
    name: 'Shopify Cart Operation Failure Rate',
    description: 'Alert when cart operations fail at unacceptable rate',
    metric: 'shopify_cart_failure_rate',
    threshold: 5, // 5% failure rate
    operator: 'greater_than',
    severity: ErrorSeverity.HIGH,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 600000,
    notificationChannels: [
      {
        type: 'email',
        config: { email: 'ecommerce@sillavida.com' },
        enabled: true
      },
      {
        type: 'slack',
        config: { slackChannel: '#ecommerce-alerts' },
        enabled: true
      }
    ]
  },

  // System Performance Alerts
  {
    id: 'page-load-time-degradation',
    name: 'Page Load Time Degradation',
    description: 'Alert when page load times exceed user experience threshold',
    metric: 'page_load_time',
    threshold: 6000, // 6 seconds
    operator: 'greater_than',
    severity: ErrorSeverity.MEDIUM,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 300000,
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#performance-alerts' },
        enabled: true
      }
    ]
  },
  {
    id: 'critical-error-rate',
    name: 'Critical Error Rate',
    description: 'Alert when critical errors occur at unacceptable rate',
    metric: 'critical_error_rate',
    threshold: 2, // 2% critical error rate
    operator: 'greater_than',
    severity: ErrorSeverity.CRITICAL,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 600000,
    notificationChannels: [
      {
        type: 'email',
        config: { email: 'critical@sillavida.com' },
        enabled: true
      },
      {
        type: 'slack',
        config: { slackChannel: '#critical-alerts' },
        enabled: true
      },
      {
        type: 'webhook',
        config: { webhookUrl: 'https://hooks.sillavida.com/critical-alert' },
        enabled: true
      }
    ]
  },
  {
    id: 'error-spike-detection',
    name: 'Error Spike Detection',
    description: 'Alert when error rate increases significantly compared to baseline',
    metric: 'error_rate_spike',
    threshold: 200, // 200% increase from baseline
    operator: 'greater_than',
    severity: ErrorSeverity.HIGH,
    timeWindow: 180000, // 3 minutes
    enabled: true,
    cooldownPeriod: 600000,
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#alerts' },
        enabled: true
      }
    ]
  },

  // User Experience Alerts
  {
    id: 'user-session-failure-rate',
    name: 'User Session Failure Rate',
    description: 'Alert when user sessions fail at high rate',
    metric: 'user_session_failure_rate',
    threshold: 3, // 3% session failure rate
    operator: 'greater_than',
    severity: ErrorSeverity.HIGH,
    timeWindow: 300000,
    enabled: true,
    cooldownPeriod: 600000,
    notificationChannels: [
      {
        type: 'email',
        config: { email: 'ux@sillavida.com' },
        enabled: true
      },
      {
        type: 'slack',
        config: { slackChannel: '#ux-alerts' },
        enabled: true
      }
    ]
  },
  {
    id: 'checkout-abandonment-spike',
    name: 'Checkout Abandonment Spike',
    description: 'Alert when checkout abandonment rate spikes unexpectedly',
    metric: 'checkout_abandonment_rate',
    threshold: 85, // 85% abandonment rate
    operator: 'greater_than',
    severity: ErrorSeverity.MEDIUM,
    timeWindow: 600000, // 10 minutes
    enabled: true,
    cooldownPeriod: 1800000, // 30 minutes
    notificationChannels: [
      {
        type: 'slack',
        config: { slackChannel: '#ecommerce-alerts' },
        enabled: true
      }
    ]
  }
];

/**
 * Environment-specific alert configurations
 */
export const ENVIRONMENT_CONFIGS = {
  production: {
    enabled: true,
    strictThresholds: true,
    notificationsEnabled: true
  },
  staging: {
    enabled: true,
    strictThresholds: false,
    notificationsEnabled: false
  },
  development: {
    enabled: false,
    strictThresholds: false,
    notificationsEnabled: false
  }
};

/**
 * Get alert configuration for current environment
 */
export function getAlertConfigForEnvironment(): AlertingConfig {
  const env = import.meta.env.MODE || 'development';
  const envConfig = ENVIRONMENT_CONFIGS[env as keyof typeof ENVIRONMENT_CONFIGS] || ENVIRONMENT_CONFIGS.development;
  
  return {
    ...PRODUCTION_ALERTING_CONFIG,
    enabled: envConfig.enabled,
    escalationRules: envConfig.notificationsEnabled 
      ? PRODUCTION_ALERTING_CONFIG.escalationRules 
      : []
  };
}

/**
 * Get alert rules for current environment
 */
export function getAlertRulesForEnvironment(): AlertRule[] {
  const env = import.meta.env.MODE || 'development';
  const envConfig = ENVIRONMENT_CONFIGS[env as keyof typeof ENVIRONMENT_CONFIGS] || ENVIRONMENT_CONFIGS.development;
  
  if (!envConfig.enabled) {
    return [];
  }
  
  return PRODUCTION_ALERT_RULES.map(rule => ({
    ...rule,
    enabled: rule.enabled && envConfig.enabled,
    // Adjust thresholds for non-production environments
    threshold: envConfig.strictThresholds ? rule.threshold : rule.threshold * 1.5,
    notificationChannels: envConfig.notificationsEnabled 
      ? rule.notificationChannels 
      : rule.notificationChannels.filter(channel => channel.type === 'console')
  }));
}

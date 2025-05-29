/**
 * Development-only logging utility
 * Automatically stripped from production builds
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  data?: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const component = context?.component ? `[${context.component}]` : '';
    const action = context?.action ? `${context.action}:` : '';
    
    return `${timestamp} ${level.toUpperCase()} ${component} ${action} ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context), context?.data);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context), context?.data);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, context), context?.data);
    }
  }

  error(message: string, context?: LogContext): void {
    // Errors are always logged, even in production
    console.error(this.formatMessage('error', message, context), context?.data);
  }

  // Specialized logging for different domains
  shopify = {
    cart: (action: string, data?: any) => 
      this.debug(`Cart ${action}`, { component: 'Shopify', action: 'cart', data }),
    
    product: (action: string, data?: any) => 
      this.debug(`Product ${action}`, { component: 'Shopify', action: 'product', data }),
    
    checkout: (action: string, data?: any) => 
      this.debug(`Checkout ${action}`, { component: 'Shopify', action: 'checkout', data }),
  };

  analytics = {
    track: (event: string, data?: any) => 
      this.debug(`Tracking ${event}`, { component: 'Analytics', action: 'track', data }),
    
    pageView: (page: string) => 
      this.debug(`Page view: ${page}`, { component: 'Analytics', action: 'pageView' }),
  };

  ui = {
    interaction: (component: string, action: string, data?: any) => 
      this.debug(`${component} ${action}`, { component: 'UI', action, data }),
    
    render: (component: string, props?: any) => 
      this.debug(`Rendering ${component}`, { component: 'UI', action: 'render', data: props }),
  };
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in components
export type { LogLevel, LogContext };
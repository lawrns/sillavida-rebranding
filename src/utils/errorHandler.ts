/**
 * Standardized Error Handling System for SillaVida
 * Replaces 27 different error handling patterns with unified approach
 */

import { logger } from './logger';

// Error Categories for different types of failures
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation', 
  AUTHENTICATION = 'authentication',
  CART = 'cart',
  PRODUCT = 'product',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  USER_INPUT = 'user_input'
}

// Severity levels for error prioritization
export enum ErrorSeverity {
  LOW = 'low',        // Non-blocking, log only
  MEDIUM = 'medium',  // Show user notification
  HIGH = 'high',      // Block UI, show error modal
  CRITICAL = 'critical' // System failure, redirect to error page
}

// Recovery strategies for different error types
export enum RecoveryAction {
  NONE = 'none',
  RETRY = 'retry',
  FALLBACK = 'fallback',
  REDIRECT = 'redirect',
  REFRESH = 'refresh'
}

// Standardized error interface
export interface AppError {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string; // Spanish message for users
  details?: any;
  timestamp: Date;
  component?: string;
  action?: string;
  recovery?: RecoveryAction;
  retryCount?: number;
  maxRetries?: number;
}

// Error configuration for common scenarios
const ERROR_CONFIGS: Record<string, Partial<AppError>> = {
  // Network errors
  'NETWORK_TIMEOUT': {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    message: 'Request timed out',
    userMessage: 'La conexión tardó demasiado. Por favor, inténtalo de nuevo.',
    recovery: RecoveryAction.RETRY,
    maxRetries: 3
  },
  'NETWORK_OFFLINE': {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    message: 'Network is offline',
    userMessage: 'No hay conexión a internet. Verifica tu conexión y vuelve a intentar.',
    recovery: RecoveryAction.RETRY
  },
  
  // Cart errors
  'CART_ITEM_NOT_FOUND': {
    category: ErrorCategory.CART,
    severity: ErrorSeverity.MEDIUM,
    message: 'Cart item not found',
    userMessage: 'El producto no se encontró en tu carrito.',
    recovery: RecoveryAction.FALLBACK
  },
  'CART_UPDATE_FAILED': {
    category: ErrorCategory.CART,
    severity: ErrorSeverity.MEDIUM,
    message: 'Failed to update cart',
    userMessage: 'No se pudo actualizar el carrito. Inténtalo de nuevo.',
    recovery: RecoveryAction.RETRY,
    maxRetries: 2
  },
  
  // Product errors
  'PRODUCT_NOT_AVAILABLE': {
    category: ErrorCategory.PRODUCT,
    severity: ErrorSeverity.MEDIUM,
    message: 'Product not available',
    userMessage: 'Este producto no está disponible actualmente.',
    recovery: RecoveryAction.FALLBACK
  },
  'PRODUCT_LOAD_FAILED': {
    category: ErrorCategory.PRODUCT,
    severity: ErrorSeverity.MEDIUM,
    message: 'Failed to load product',
    userMessage: 'No se pudo cargar el producto. Inténtalo de nuevo.',
    recovery: RecoveryAction.RETRY,
    maxRetries: 2
  },
  
  // Validation errors
  'INVALID_INPUT': {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    message: 'Invalid input provided',
    userMessage: 'Por favor, verifica la información ingresada.',
    recovery: RecoveryAction.NONE
  },
  
  // Authentication errors
  'AUTH_FAILED': {
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Authentication failed',
    userMessage: 'Error de autenticación. Por favor, inicia sesión de nuevo.',
    recovery: RecoveryAction.REDIRECT
  },
  
  // Payment errors
  'PAYMENT_FAILED': {
    category: ErrorCategory.PAYMENT,
    severity: ErrorSeverity.HIGH,
    message: 'Payment processing failed',
    userMessage: 'No se pudo procesar el pago. Verifica tu información de pago.',
    recovery: RecoveryAction.RETRY,
    maxRetries: 1
  },
  
  // System errors
  'SYSTEM_ERROR': {
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.CRITICAL,
    message: 'System error occurred',
    userMessage: 'Ocurrió un error del sistema. Por favor, recarga la página.',
    recovery: RecoveryAction.REFRESH
  }
};

class ErrorHandler {
  private errorQueue: AppError[] = [];
  private retryAttempts: Map<string, number> = new Map();
  
  /**
   * Create a standardized error
   */
  createError(
    type: string,
    overrides?: Partial<AppError>,
    context?: { component?: string; action?: string; details?: any }
  ): AppError {
    const config = ERROR_CONFIGS[type] || ERROR_CONFIGS['SYSTEM_ERROR'];
    const errorId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const error: AppError = {
      id: errorId,
      category: config.category!,
      severity: config.severity!,
      message: config.message!,
      userMessage: config.userMessage!,
      timestamp: new Date(),
      recovery: config.recovery || RecoveryAction.NONE,
      maxRetries: config.maxRetries || 0,
      retryCount: 0,
      ...overrides,
      ...context
    };
    
    this.errorQueue.push(error);
    return error;
  }
  
  /**
   * Handle an error with standardized approach
   */
  async handleError(error: AppError | Error | string, context?: { component?: string; action?: string }): Promise<AppError> {
    let standardError: AppError;
    
    // Convert different error types to standardized format
    if (typeof error === 'string') {
      standardError = this.createError('SYSTEM_ERROR', { message: error, userMessage: error }, context);
    } else if (error instanceof Error) {
      // Try to categorize the error based on message
      const errorType = this.categorizeError(error);
      standardError = this.createError(errorType, { 
        message: error.message,
        details: { stack: error.stack }
      }, context);
    } else {
      standardError = error;
    }
    
    // Log the error
    logger.error(standardError.message, {
      component: standardError.component,
      action: standardError.action,
      data: {
        id: standardError.id,
        category: standardError.category,
        severity: standardError.severity,
        details: standardError.details
      }
    });
    
    // Handle based on severity
    await this.processError(standardError);
    
    return standardError;
  }
  
  /**
   * Process error based on severity and recovery strategy
   */
  private async processError(error: AppError): Promise<void> {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        // Just log, no user notification
        break;
        
      case ErrorSeverity.MEDIUM:
        // Show user notification
        this.showNotification(error);
        break;
        
      case ErrorSeverity.HIGH:
        // Block UI, show error modal
        this.showErrorModal(error);
        break;
        
      case ErrorSeverity.CRITICAL:
        // System failure handling
        this.handleCriticalError(error);
        break;
    }
    
    // Execute recovery action if specified
    if (error.recovery !== RecoveryAction.NONE) {
      await this.executeRecovery(error);
    }
  }
  
  /**
   * Categorize errors based on message content
   */
  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'NETWORK_TIMEOUT';
    }
    if (message.includes('cart')) {
      return 'CART_UPDATE_FAILED';
    }
    if (message.includes('product') || message.includes('variant')) {
      return 'PRODUCT_LOAD_FAILED';
    }
    if (message.includes('auth') || message.includes('login')) {
      return 'AUTH_FAILED';
    }
    if (message.includes('payment')) {
      return 'PAYMENT_FAILED';
    }
    
    return 'SYSTEM_ERROR';
  }
  
  /**
   * Show user notification for medium severity errors
   */
  private showNotification(error: AppError): void {
    // Create toast notification (non-blocking)
    const notification = document.createElement('div');
    notification.className = 'error-toast';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    notification.textContent = error.userMessage;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
  
  /**
   * Show error modal for high severity errors
   */
  private showErrorModal(error: AppError): void {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 500px;
      margin: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    `;
    
    modal.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #dc3545;">Error</h3>
      <p style="margin: 0 0 20px 0; line-height: 1.5;">${error.userMessage}</p>
      <button onclick="this.closest('[style*=position]').remove()" 
              style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Cerrar
      </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
  
  /**
   * Handle critical system errors
   */
  private handleCriticalError(error: AppError): void {
    // For critical errors, we might want to redirect to an error page
    // or force a page refresh
    this.showErrorModal(error);
    
    // Optionally refresh page after user acknowledgment
    setTimeout(() => {
      if (confirm('¿Deseas recargar la página para intentar resolver el problema?')) {
        window.location.reload();
      }
    }, 3000);
  }
  
  /**
   * Execute recovery actions
   */
  private async executeRecovery(error: AppError): Promise<void> {
    switch (error.recovery) {
      case RecoveryAction.RETRY:
        // Implement retry logic if max retries not exceeded
        break;
      case RecoveryAction.FALLBACK:
        // Implement fallback behavior
        break;
      case RecoveryAction.REDIRECT:
        // Redirect to appropriate page
        break;
      case RecoveryAction.REFRESH:
        // Refresh page
        window.location.reload();
        break;
    }
  }
  
  /**
   * Get all errors from queue
   */
  getErrors(): AppError[] {
    return [...this.errorQueue];
  }
  
  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }
  
  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errorQueue.filter(error => error.category === category);
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions for common error scenarios
export const handleNetworkError = (error: Error, context?: { component?: string; action?: string }) =>
  errorHandler.handleError(error, context);

export const handleCartError = (message: string, context?: { component?: string; action?: string }) =>
  errorHandler.handleError(errorHandler.createError('CART_UPDATE_FAILED', { message }), context);

export const handleProductError = (message: string, context?: { component?: string; action?: string }) =>
  errorHandler.handleError(errorHandler.createError('PRODUCT_LOAD_FAILED', { message }), context);

export const handleValidationError = (message: string, userMessage: string, context?: { component?: string; action?: string }) =>
  errorHandler.handleError(errorHandler.createError('INVALID_INPUT', { message, userMessage }), context);

// Type exports
export type { AppError };
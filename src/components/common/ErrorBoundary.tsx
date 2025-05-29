/**
 * React Error Boundary for component-level error handling
 * Catches JavaScript errors anywhere in the component tree
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  component?: string; // Component name for error tracking
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with full context
    logger.error('React Error Boundary caught an error', {
      component: this.props.component || 'ErrorBoundary',
      action: 'componentDidCatch',
      data: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }
    });

    // Create standardized error
    const standardError = errorHandler.createError('SYSTEM_ERROR', {
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.HIGH,
      message: `React component error: ${error.message}`,
      userMessage: 'Ocurrió un error inesperado. Por favor, recarga la página.',
      details: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        boundaryComponent: this.props.component
      }
    }, {
      component: this.props.component || 'ErrorBoundary',
      action: 'React Error Boundary'
    });

    // Handle the error through our standardized system
    errorHandler.handleError(standardError);

    // Store error ID for potential retry
    this.setState({ errorId: standardError.id });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Oops! Algo salió mal</h2>
            <p>
              Ocurrió un error inesperado en esta sección. 
              Puedes intentar recargar o contactar soporte si el problema persiste.
            </p>
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="btn btn-primary"
              >
                Reintentar
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Recargar Página
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>Detalles del Error (Desarrollo)</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
          </div>
          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 200px;
              padding: 2rem;
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              margin: 1rem 0;
            }
            
            .error-boundary-content {
              text-align: center;
              max-width: 500px;
            }
            
            .error-boundary-content h2 {
              color: #dc3545;
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }
            
            .error-boundary-content p {
              color: #6c757d;
              margin-bottom: 1.5rem;
              line-height: 1.5;
            }
            
            .error-boundary-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 1rem;
            }
            
            .btn {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.9rem;
              text-decoration: none;
              display: inline-block;
            }
            
            .btn-primary {
              background: #007bff;
              color: white;
            }
            
            .btn-primary:hover {
              background: #0056b3;
            }
            
            .btn-secondary {
              background: #6c757d;
              color: white;
            }
            
            .btn-secondary:hover {
              background: #545b62;
            }
            
            .error-boundary-details {
              margin-top: 1rem;
              text-align: left;
            }
            
            .error-boundary-details summary {
              cursor: pointer;
              color: #007bff;
              margin-bottom: 0.5rem;
            }
            
            .error-boundary-details pre {
              background: #f1f3f4;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.8rem;
              white-space: pre-wrap;
            }
            
            @media (max-width: 768px) {
              .error-boundary-actions {
                flex-direction: column;
              }
              
              .error-boundary {
                margin: 0.5rem 0;
                padding: 1rem;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Specialized error boundaries for different sections
export const CartErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    component="CartErrorBoundary"
    fallback={
      <div className="cart-error">
        <p>Error al cargar el carrito. <button onClick={() => window.location.reload()}>Reintentar</button></p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export const ProductErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    component="ProductErrorBoundary"
    fallback={
      <div className="product-error">
        <p>Error al cargar el producto. <button onClick={() => window.location.reload()}>Reintentar</button></p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export const NavigationErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    component="NavigationErrorBoundary"
    fallback={
      <div className="navigation-error">
        <p>Error en la navegación. <a href="/">Ir al inicio</a></p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
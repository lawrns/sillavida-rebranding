/**
 * ReactSafeJudgeMeWidget.tsx
 * 
 * A special wrapper component that safely initializes Judge.me widgets
 * in a way that avoids React Strict Mode warnings about legacy lifecycle methods.
 * This component uses React's refs and effects to properly manage widget lifecycle.
 */

import React, { useEffect, useRef, useState } from 'react';
import { loadJudgeMeScript } from '../../lib/judgeMe';
import { errorHandler } from '../../utils/errorHandler';
import { extractShopifyId } from '../../utils/business/productTransformer';

interface ReactSafeJudgeMeWidgetProps {
  productId: string | number;
  productTitle?: string;
  className?: string;
  widgetType?: 'review' | 'ugc-media' | 'preview-badge' | 'verified-badge';
  attributes?: Record<string, string>;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

const ReactSafeJudgeMeWidget: React.FC<ReactSafeJudgeMeWidgetProps> = ({
  productId,
  productTitle,
  className = '',
  widgetType = 'review',
  attributes = {},
  onReady,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize widget using global Judge.me script
  useEffect(() => {
    let isMounted = true;
    
    const initializeWidget = () => {
      try {
        // Check if global Judge.me object exists
        if (!window.jdgm) {
          console.warn('Judge.me global object not available yet, waiting...');
          // If not available, try again after a short delay
          setTimeout(initializeWidget, 500);
          return;
        }
        
        if (!isMounted || !containerRef.current) return;
        
        // Clear previous content
        containerRef.current.innerHTML = '';
                // Create the widget element with proper data attributes
        const widgetEl = document.createElement('div');
        
        // Core attributes for all widget types
        widgetEl.setAttribute('data-platform-independent', 'true');
        widgetEl.setAttribute('data-auto-install', 'false');
        
        // Add data-api-host attribute to help with platform-independent mode
        widgetEl.setAttribute('data-api-host', 'https://judge.me');
        
        // Debug attributes
        widgetEl.setAttribute('data-debug', 'true');
        
        // Extract numerical ID for Judge.me compatibility
        const numericProductId = extractShopifyId(productId);
        
        // Set appropriate class and data attribute based on widget type
        switch (widgetType) {
          case 'review':
            widgetEl.className = `jdgm-widget jdgm-review-widget ${className}`;
            widgetEl.setAttribute('data-id', numericProductId);
            // Extra attributes for review widget
            widgetEl.setAttribute('data-widget-type', 'review-widget');
            widgetEl.setAttribute('data-show-form-on-load', 'false'); // Don't show review form automatically
            break;
          case 'ugc-media':
            widgetEl.className = `jdgm-widget jdgm-ugc-media-wrapper ${className}`;
            widgetEl.setAttribute('data-product-id', numericProductId);
            widgetEl.setAttribute('data-widget-type', 'ugc-media-grid');
            break;
          case 'preview-badge':
            widgetEl.className = `jdgm-widget jdgm-preview-badge ${className}`;
            widgetEl.setAttribute('data-id', numericProductId);
            widgetEl.setAttribute('data-widget-type', 'preview-badge');
            break;
          case 'verified-badge':
            widgetEl.className = `jdgm-widget jdgm-verified-badge ${className}`;
            widgetEl.setAttribute('data-widget-type', 'verified-badge');
            break;
        }
        
        // Set the locale to Spanish for the Mexican market
        widgetEl.setAttribute('data-locale', 'es');
        
        // Set product title if provided
        if (productTitle) {
          widgetEl.setAttribute('data-product-title', productTitle);
        }
        
        // Add any additional attributes
        Object.entries(attributes).forEach(([key, value]) => {
          widgetEl.setAttribute(`data-${key}`, value);
        });
        
        // Append to container
        containerRef.current.appendChild(widgetEl);
        
        // Render widget
        if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
          // Use setTimeout to push rendering to next tick after DOM update
          setTimeout(() => {
            if (containerRef.current) {
              window.jdgm.renderWidgets(containerRef.current);
              if (isMounted) {
                setLoaded(true);
                if (onReady) onReady();
              }
            }
          }, 0);
        } else {
          if (isMounted) {
            const err = errorHandler.createError('SYSTEM_ERROR', {
              message: 'Judge.me widget render function not available',
              userMessage: 'No se pudo cargar el sistema de reseñas'
            }, { component: 'ReactSafeJudgeMeWidget', action: 'renderWidget' });
            setError(err);
            if (onError) onError(err);
          }
        }
      } catch (err) {
        errorHandler.handleError(err as Error, {
          component: 'ReactSafeJudgeMeWidget',
          action: 'renderWidget'
        }).then(handledError => {
          if (isMounted) {
            setError(handledError);
            if (onError) onError(handledError);
          }
        });
      }
    };
    
    initializeWidget();
    
    return () => {
      isMounted = false;
    };
  }, [productId, productTitle, className, widgetType, attributes, onReady, onError]);
  
  return (
    <div ref={containerRef} className={`react-safe-judgeme-widget ${error ? 'has-error' : ''}`}>
      {!loaded && !error && (
        <div className="judgeme-loading">
          <span>Cargando opiniones...</span>
        </div>
      )}
      {error && (
        <div className="judgeme-error">
          <span>Error al cargar las opiniones</span>
        </div>
      )}
    </div>
  );
};

export default ReactSafeJudgeMeWidget;

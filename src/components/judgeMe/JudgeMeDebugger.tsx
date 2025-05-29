import React, { useEffect, useState } from 'react';

/**
 * JudgeMeDebugger - Simple component to check Judge.me status
 */
const JudgeMeDebugger: React.FC = () => {
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    const checkStatus = () => {
      const info: any = {
        scriptLoaded: !!window.jdgm,
        hostname: window.location.hostname,
        timestamp: new Date().toISOString()
      };

      if (window.jdgm) {
        info.judgeMeAvailable = true;
        info.renderWidgets = typeof window.jdgm.renderWidgets === 'function';
        info.judgeMeMethods = Object.keys(window.jdgm || {});
        info.shopDomainUsed = window.location.hostname === 'localhost' ? 'sbz5wk-e9.myshopify.com' : window.location.hostname;
        
        // Check if PUBLIC_TOKEN exists (indicates connection to Shopify store)
        info.publicToken = window.jdgm.PUBLIC_TOKEN || 'Not found';
        info.shopDomain = window.jdgm.SHOP_DOMAIN || 'Not found';
        info.platform = window.jdgm.PLATFORM || 'Not found';
        info.isVersion3 = window.jdgm.isVersion3 || false;
        info.cacheServerHost = window.jdgm.CACHE_SERVER_HOST || 'Not found';
        
        if (typeof window.jdgm.renderWidgets === 'function') {
          setStatus('✅ Judge.me fully loaded with renderWidgets');
        } else if (typeof window.jdgm.docReady === 'function') {
          setStatus('⚠️ Judge.me loaded but renderWidgets not available - trying docReady');
          // Try using docReady to wait for full initialization
          window.jdgm.docReady(() => {
            if (typeof window.jdgm.renderWidgets === 'function') {
              console.log('renderWidgets became available after docReady!');
              setStatus('✅ Judge.me renderWidgets available after docReady');
            }
          });
        } else {
          setStatus('⚠️ Judge.me loaded but renderWidgets not available');
        }
      } else {
        info.judgeMeAvailable = false;
        setStatus('❌ Judge.me script not loaded');
      }

      setDetails(info);
    };

    // Check immediately
    checkStatus();

    // Check multiple times as Judge.me might load incrementally
    const timer1 = setTimeout(checkStatus, 1000);
    const timer2 = setTimeout(checkStatus, 3000);
    const timer3 = setTimeout(checkStatus, 5000);
    const timer4 = setTimeout(checkStatus, 10000);
    const timer5 = setTimeout(checkStatus, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const handleManualTest = () => {
    if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
      console.log('Manually triggering Judge.me widget render...');
      window.jdgm.renderWidgets();
      setStatus('✅ Manual render triggered');
    } else if (window.jdgm && typeof window.jdgm.loadScript === 'function') {
      console.log('Trying to load Judge.me widgets script...');
      // Try different widget script paths
      const scriptPaths = [
        'https://cdn.judge.me/widget_v3/widget.js',
        'https://cdnwidget.judge.me/widget.js',
        '/widget.js'
      ];
      
      let scriptIndex = 0;
      const tryNextScript = () => {
        if (scriptIndex < scriptPaths.length) {
          const scriptPath = scriptPaths[scriptIndex];
          console.log(`Attempting to load: ${scriptPath}`);
          
          window.jdgm.loadScript(scriptPath, () => {
            console.log(`Script loaded: ${scriptPath}, checking for renderWidgets...`);
            if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
              window.jdgm.renderWidgets();
              setStatus('✅ Widgets loaded and rendered');
            } else {
              scriptIndex++;
              tryNextScript();
            }
          });
        } else {
          setStatus('⚠️ All widget scripts tried but renderWidgets still not available');
        }
      };
      
      tryNextScript();
      setStatus('🔄 Attempting to load widget scripts...');
    } else {
      setStatus('❌ Cannot render - Judge.me not available');
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="font-bold text-yellow-800 mb-2">Judge.me Debug Status</h3>
      <p className="mb-2">{status}</p>
      
      <details className="mb-3">
        <summary className="cursor-pointer text-sm font-medium">Debug Details</summary>
        <pre className="text-xs bg-white p-2 mt-2 rounded border overflow-auto">
          {JSON.stringify(details, null, 2)}
        </pre>
      </details>

      <button 
        onClick={handleManualTest}
        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
      >
        Test Manual Render
      </button>

      {/* Judge.me Review Carousel Test */}
      <div className="mt-4 p-2 border border-gray-300 rounded">
        <p className="text-xs mb-2">Review Carousel Test (should show reviews if working):</p>
        <div className="jdgm-carousel-wrapper">
          <h2 className="jdgm-carousel-title">Featured Reviews</h2>
          <a href="/reviews" className="jdgm-all-reviews-rating-wrapper">
            <div data-score="" className="jdgm-all-reviews-rating"></div>
            from <span className="jdgm-all-reviews-count"></span> reviews
          </a>
        </div>
      </div>
    </div>
  );
};

export default JudgeMeDebugger;
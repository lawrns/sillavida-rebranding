/**
 * Judge.me Script Loader
 * 
 * This module handles loading the Judge.me script and verifies when it's ready to use.
 * It provides utilities for script loading with proper error handling and status tracking.
 */

import { getJudgeMeGlobal } from './types';
import type { JudgeMeGlobal } from './types';

// Constants for script management
const JUDGE_ME_SCRIPT_ID = 'judgeme-widget-script';
const JUDGE_ME_SCRIPT_URL = 'https://cdn.judge.me/widget_preloader.js';
const SCRIPT_LOAD_TIMEOUT_MS = 10000; // 10 seconds timeout

/**
 * Interface for script loading status
 */
interface ScriptLoadingStatus {
  loading: boolean;
  loaded: boolean;
  error: Error | null;
}

// Internal script loading status tracker
let scriptStatus: ScriptLoadingStatus = {
  loading: false,
  loaded: false,
  error: null
};

/**
 * Check if the Judge.me script is fully initialized and ready to use
 */
export function isJudgeMeReady(): boolean {
  const jdgm = getJudgeMeGlobal();
  return !!jdgm && !!jdgm.initialized;
}

/**
 * Get the current script loading status
 */
export function getScriptStatus(): ScriptLoadingStatus {
  return { ...scriptStatus };
}

/**
 * Initialize the Judge.me script if it's not already loaded
 * @returns Promise that resolves when the script is loaded and initialized
 */
export function initializeScript(): Promise<void> {
  // If already loaded, return resolved promise
  if (scriptStatus.loaded && isJudgeMeReady()) {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (scriptStatus.loading) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (isJudgeMeReady()) {
          clearInterval(checkInterval);
          resolve();
        } else if (scriptStatus.error) {
          clearInterval(checkInterval);
          reject(scriptStatus.error);
        }
      }, 100);

      // Set timeout for script loading
      setTimeout(() => {
        if (!isJudgeMeReady()) {
          clearInterval(checkInterval);
          const error = new Error('Judge.me script initialization timed out');
          scriptStatus.error = error;
          reject(error);
        }
      }, SCRIPT_LOAD_TIMEOUT_MS);
    });
  }

  // Start loading the script
  return new Promise<void>((resolve, reject) => {
    try {
      scriptStatus.loading = true;
      
      // Check if script already exists in DOM
      const existingScript = document.getElementById(JUDGE_ME_SCRIPT_ID) as HTMLScriptElement;
      
      if (existingScript) {
        // Script tag exists, monitor for readiness
        const checkExisting = setInterval(() => {
          if (isJudgeMeReady()) {
            clearInterval(checkExisting);
            scriptStatus.loaded = true;
            scriptStatus.loading = false;
            resolve();
          }
        }, 100);
        
        return;
      }
      
      // Create and append script element
      const script = document.createElement('script');
      script.id = JUDGE_ME_SCRIPT_ID;
      script.src = JUDGE_ME_SCRIPT_URL;
      script.async = true;
      
      // Setup event handlers
      script.onload = () => {
        const readyCheck = setInterval(() => {
          if (isJudgeMeReady()) {
            clearInterval(readyCheck);
            scriptStatus.loaded = true;
            scriptStatus.loading = false;
            resolve();
          }
        }, 100);
        
        // Set timeout for initialization
        setTimeout(() => {
          if (!isJudgeMeReady()) {
            clearInterval(readyCheck);
            const error = new Error('Judge.me script initialization timed out after load');
            scriptStatus.error = error;
            scriptStatus.loading = false;
            reject(error);
          }
        }, SCRIPT_LOAD_TIMEOUT_MS);
      };
      
      script.onerror = () => {
        const error = new Error('Failed to load Judge.me script');
        scriptStatus.error = error;
        scriptStatus.loading = false;
        reject(error);
      };
      
      // Append script to document head
      document.head.appendChild(script);
      
    } catch (error) {
      scriptStatus.error = error instanceof Error ? error : new Error(String(error));
      scriptStatus.loading = false;
      reject(scriptStatus.error);
    }
  });
}

/**
 * Remove Judge.me script from the document (useful for testing and cleanup)
 */
export function removeScript(): void {
  const script = document.getElementById(JUDGE_ME_SCRIPT_ID);
  if (script) {
    script.remove();
  }
  scriptStatus = {
    loading: false,
    loaded: false,
    error: null
  };
}

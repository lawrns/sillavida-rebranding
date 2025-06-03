#!/usr/bin/env node

/**
 * Health Check Script for Production Monitoring
 * 
 * Performs comprehensive health checks for the SillaVida application,
 * including Judge.me integration, Shopify API connectivity, and system health.
 * 
 * Created as part of TASK-105 Phase 3 implementation.
 */

const https = require('https');
const http = require('http');

// Configuration
const HEALTH_CHECK_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  endpoints: {
    main: process.env.SITE_URL || 'https://silla-vida.netlify.app',
    shopify: process.env.VITE_SHOPIFY_STORE_DOMAIN ? 
      `https://${process.env.VITE_SHOPIFY_STORE_DOMAIN}` : null,
    judgeme: 'https://judge.me/api/v1/widgets'
  },
  expectedResponses: {
    main: 200,
    shopify: 200,
    judgeme: 200
  }
};

/**
 * Make HTTP request with timeout and retries
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestModule = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || HEALTH_CHECK_CONFIG.timeout;
    
    const req = requestModule.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          responseTime: Date.now() - startTime
        });
      });
    });
    
    const startTime = Date.now();
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
  });
}

/**
 * Retry function with exponential backoff
 */
async function retryRequest(url, maxRetries = HEALTH_CHECK_CONFIG.retries) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await makeRequest(url);
      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Attempt ${attempt} failed for ${url}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Check main application health
 */
async function checkMainApplication() {
  console.log('🔍 Checking main application health...');
  
  try {
    const response = await retryRequest(HEALTH_CHECK_CONFIG.endpoints.main);
    
    if (response.statusCode === HEALTH_CHECK_CONFIG.expectedResponses.main) {
      console.log(`✅ Main application is healthy (${response.responseTime}ms)`);
      return {
        status: 'healthy',
        responseTime: response.responseTime,
        statusCode: response.statusCode
      };
    } else {
      console.log(`⚠️ Main application returned unexpected status: ${response.statusCode}`);
      return {
        status: 'degraded',
        responseTime: response.responseTime,
        statusCode: response.statusCode,
        issue: `Unexpected status code: ${response.statusCode}`
      };
    }
  } catch (error) {
    console.log(`❌ Main application health check failed: ${error.message}`);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Check Shopify API connectivity
 */
async function checkShopifyAPI() {
  console.log('🛒 Checking Shopify API connectivity...');
  
  if (!HEALTH_CHECK_CONFIG.endpoints.shopify) {
    console.log('⚠️ Shopify domain not configured, skipping check');
    return {
      status: 'skipped',
      reason: 'No Shopify domain configured'
    };
  }
  
  try {
    const response = await retryRequest(HEALTH_CHECK_CONFIG.endpoints.shopify);
    
    if (response.statusCode === HEALTH_CHECK_CONFIG.expectedResponses.shopify) {
      console.log(`✅ Shopify API is accessible (${response.responseTime}ms)`);
      return {
        status: 'healthy',
        responseTime: response.responseTime,
        statusCode: response.statusCode
      };
    } else {
      console.log(`⚠️ Shopify API returned status: ${response.statusCode}`);
      return {
        status: 'degraded',
        responseTime: response.responseTime,
        statusCode: response.statusCode
      };
    }
  } catch (error) {
    console.log(`❌ Shopify API check failed: ${error.message}`);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Check Judge.me API connectivity
 */
async function checkJudgeMeAPI() {
  console.log('⭐ Checking Judge.me API connectivity...');
  
  try {
    const response = await retryRequest(HEALTH_CHECK_CONFIG.endpoints.judgeme);
    
    if (response.statusCode === HEALTH_CHECK_CONFIG.expectedResponses.judgeme) {
      console.log(`✅ Judge.me API is accessible (${response.responseTime}ms)`);
      return {
        status: 'healthy',
        responseTime: response.responseTime,
        statusCode: response.statusCode
      };
    } else {
      console.log(`⚠️ Judge.me API returned status: ${response.statusCode}`);
      return {
        status: 'degraded',
        responseTime: response.responseTime,
        statusCode: response.statusCode
      };
    }
  } catch (error) {
    console.log(`❌ Judge.me API check failed: ${error.message}`);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Check system resources and performance
 */
async function checkSystemHealth() {
  console.log('🖥️ Checking system health...');
  
  const startTime = Date.now();
  
  try {
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };
    
    // Check CPU usage (simplified)
    const cpuUsage = process.cpuUsage();
    
    // Performance check
    const performanceCheckTime = Date.now() - startTime;
    
    console.log(`✅ System health check completed (${performanceCheckTime}ms)`);
    console.log(`   Memory: RSS ${memoryUsageMB.rss}MB, Heap ${memoryUsageMB.heapUsed}/${memoryUsageMB.heapTotal}MB`);
    
    return {
      status: 'healthy',
      checkTime: performanceCheckTime,
      memory: memoryUsageMB,
      cpu: cpuUsage
    };
  } catch (error) {
    console.log(`❌ System health check failed: ${error.message}`);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

/**
 * Generate health report
 */
function generateHealthReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    checks: results,
    summary: {
      total: results.length,
      healthy: 0,
      degraded: 0,
      unhealthy: 0,
      skipped: 0
    }
  };
  
  // Calculate summary
  results.forEach(result => {
    report.summary[result.status]++;
  });
  
  // Determine overall status
  if (report.summary.unhealthy > 0) {
    report.overall = 'unhealthy';
  } else if (report.summary.degraded > 0) {
    report.overall = 'degraded';
  } else if (report.summary.healthy === 0 && report.summary.skipped > 0) {
    report.overall = 'unknown';
  }
  
  return report;
}

/**
 * Main health check function
 */
async function runHealthChecks() {
  console.log('🏥 Starting comprehensive health checks...\n');
  
  const startTime = Date.now();
  const results = [];
  
  // Run all health checks
  const checks = [
    { name: 'main-application', check: checkMainApplication },
    { name: 'shopify-api', check: checkShopifyAPI },
    { name: 'judgeme-api', check: checkJudgeMeAPI },
    { name: 'system-health', check: checkSystemHealth }
  ];
  
  for (const { name, check } of checks) {
    try {
      const result = await check();
      results.push({
        name,
        ...result
      });
    } catch (error) {
      results.push({
        name,
        status: 'unhealthy',
        error: error.message
      });
    }
  }
  
  const totalTime = Date.now() - startTime;
  const report = generateHealthReport(results);
  
  console.log(`\n📊 Health Check Summary (${totalTime}ms total):`);
  console.log(`   Overall Status: ${report.overall.toUpperCase()}`);
  console.log(`   Healthy: ${report.summary.healthy}`);
  console.log(`   Degraded: ${report.summary.degraded}`);
  console.log(`   Unhealthy: ${report.summary.unhealthy}`);
  console.log(`   Skipped: ${report.summary.skipped}`);
  
  // Output JSON report for CI/CD
  if (process.env.CI) {
    console.log('\n📋 JSON Report:');
    console.log(JSON.stringify(report, null, 2));
  }
  
  // Exit with appropriate code
  const exitCode = report.overall === 'unhealthy' ? 1 : 0;
  
  if (exitCode === 0) {
    console.log('\n✅ All health checks passed!');
  } else {
    console.log('\n❌ Health checks failed!');
  }
  
  process.exit(exitCode);
}

// Run health checks if this script is executed directly
if (require.main === module) {
  runHealthChecks().catch(error => {
    console.error('❌ Health check script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runHealthChecks,
  checkMainApplication,
  checkShopifyAPI,
  checkJudgeMeAPI,
  checkSystemHealth
};

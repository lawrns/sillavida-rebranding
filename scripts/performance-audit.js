/**
 * Performance Audit Script
 * 
 * This script uses Lighthouse to audit the website's performance
 */

import * as lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reports directory
const REPORTS_DIR = path.join(__dirname, '../lighthouse-reports');
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const runLighthouse = async (url, options = {}) => {
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  // Set up Lighthouse options
  const lighthouseOptions = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    ...options
  };
  
  try {
    // Run Lighthouse
    const results = await lighthouse.default(url, lighthouseOptions);
    
    // Generate a filename based on the URL and date
    const hostname = new URL(url).hostname || 'localhost';
    const pathname = new URL(url).pathname.replace(/\//g, '-') || 'home';
    const date = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `${hostname}${pathname}-${date}.html`;
    
    // Write the report to a file
    const reportPath = path.join(REPORTS_DIR, filename);
    fs.writeFileSync(reportPath, results.report);
    
    console.log(`Report saved to ${reportPath}`);
    
    // Log performance metrics
    console.log('\nPerformance Metrics:');
    console.log(`- Performance Score: ${Math.round(results.lhr.categories.performance.score * 100)}/100`);
    console.log(`- First Contentful Paint: ${results.lhr.audits['first-contentful-paint'].displayValue}`);
    console.log(`- Largest Contentful Paint: ${results.lhr.audits['largest-contentful-paint'].displayValue}`);
    console.log(`- Time to Interactive: ${results.lhr.audits['interactive'].displayValue}`);
    console.log(`- Speed Index: ${results.lhr.audits['speed-index'].displayValue}`);
    console.log(`- Total Blocking Time: ${results.lhr.audits['total-blocking-time'].displayValue}`);
    console.log(`- Cumulative Layout Shift: ${results.lhr.audits['cumulative-layout-shift'].displayValue}`);
    
    return results;
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    throw error;
  } finally {
    // Always close Chrome
    await chrome.kill();
  }
};

const auditUrls = async (urls) => {
  console.log(`Starting performance audit for ${urls.length} URLs...`);
  
  for (const url of urls) {
    console.log(`\nAuditing: ${url}`);
    try {
      await runLighthouse(url);
    } catch (error) {
      console.error(`Failed to audit ${url}:`, error);
    }
  }
  
  console.log('\nAudit complete!');
};

// URLs to audit
const urlsToAudit = [
  'http://localhost:3000/',
  'http://localhost:3000/products/silla-ergonomica-vida',
  'http://localhost:3000/collections/all'
];

// Start the audit
auditUrls(urlsToAudit);

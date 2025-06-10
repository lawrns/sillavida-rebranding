#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure _headers file exists in dist directory for Netlify
const headersContent = `# Static asset headers
/assets/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/assets/*.css  
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/assets/*.png
  Content-Type: image/png
  Cache-Control: public, max-age=31536000, immutable

/assets/*.jpg
  Content-Type: image/jpeg
  Cache-Control: public, max-age=31536000, immutable

/assets/*.svg
  Content-Type: image/svg+xml
  Cache-Control: public, max-age=31536000, immutable

# HTML files
/*.html
  Content-Type: text/html; charset=utf-8
  Cache-Control: public, max-age=0, must-revalidate`;

const distPath = path.join(__dirname, '../dist');
const headersPath = path.join(distPath, '_headers');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Write headers file
fs.writeFileSync(headersPath, headersContent, 'utf8');
console.log('✅ _headers file created in dist directory');
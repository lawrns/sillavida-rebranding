/**
 * Script to check for hardcoded URLs in the codebase
 * 
 * This script searches for potential hardcoded URLs in the codebase
 * that might cause issues in production.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to search for
const patterns = [
  'http://',
  'https://',
  '.netlify.app',
  '.myshopify.com',
  'localhost',
  '127.0.0.1'
];

// Extensions to search in
const extensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.html',
  '.css',
  '.scss',
  '.json'
];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.context'
];

// Files that are allowed to have hardcoded URLs
const allowedFiles = [
  '.env',
  'netlify.toml',
  'check-hardcoded-urls.js',
  'environment-variables-guide.md',
  'hardcoded-urls-check.md',
  'pre-deployment-checklist.md'
];

console.log('Checking for hardcoded URLs in the codebase...');
console.log('This might take a few moments...');
console.log('');

// Create a function to check if a file should be excluded
function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  
  // Check if the file is in the allowed list
  if (allowedFiles.includes(fileName)) {
    return true;
  }
  
  // Check if the file has an allowed extension
  const ext = path.extname(filePath).toLowerCase();
  if (!extensions.includes(ext)) {
    return true;
  }
  
  // Check if the file is in an excluded directory
  const relativePath = path.relative(process.cwd(), filePath);
  return excludeDirs.some(dir => relativePath.startsWith(dir));
}

// Function to search for patterns in a file
function searchFileForPatterns(filePath) {
  if (shouldExcludeFile(filePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const matches = [];
    
    lines.forEach((line, lineNumber) => {
      patterns.forEach(pattern => {
        if (line.includes(pattern)) {
          // Check for common exceptions
          if (
            // Environment variable usage
            line.includes('import.meta.env') ||
            line.includes('process.env') ||
            // Dynamic URL construction
            line.includes('${window.location') ||
            // Comments
            line.trim().startsWith('//') ||
            line.trim().startsWith('/*') ||
            line.trim().startsWith('*') ||
            // JSDoc or other documentation
            line.includes('@example') ||
            // Template literals with dynamic values
            (line.includes('${') && line.includes('}'))
          ) {
            return;
          }
          
          matches.push({
            file: filePath,
            line: lineNumber + 1,
            content: line.trim(),
            pattern
          });
        }
      });
    });
    
    return matches;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Function to walk the directory and search for patterns
function walkAndSearch(dir) {
  let results = [];
  
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (!excludeDirs.includes(file)) {
        results = results.concat(walkAndSearch(filePath));
      }
    } else {
      results = results.concat(searchFileForPatterns(filePath));
    }
  });
  
  return results;
}

// Start the search
try {
  const matches = walkAndSearch(process.cwd());
  
  if (matches.length === 0) {
    console.log('✅ No hardcoded URLs found in the codebase!');
  } else {
    console.log(`⚠️ Found ${matches.length} potential hardcoded URLs:`);
    console.log('');
    
    matches.forEach(match => {
      console.log(`File: ${match.file}`);
      console.log(`Line: ${match.line}`);
      console.log(`Pattern: ${match.pattern}`);
      console.log(`Content: ${match.content}`);
      console.log('');
    });
    
    console.log('Please review these URLs and ensure they are properly configured for production.');
    console.log('Consider using environment variables for URLs that need to change between environments.');
  }
} catch (error) {
  console.error('Error searching for hardcoded URLs:', error.message);
}

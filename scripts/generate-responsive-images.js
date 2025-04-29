/**
 * Image Optimization Script
 * 
 * This script generates optimized responsive images in different formats and sizes.
 * It takes images from the src/assets/images directory and generates optimized versions
 * in the public/images/optimized directory.
 * 
 * Usage:
 * node scripts/generate-responsive-images.js
 * 
 * Options:
 * --source=<path>   Source directory (default: src/assets/images)
 * --output=<path>   Output directory (default: public/images/optimized)
 * --formats=<list>  Comma-separated list of formats to generate (default: webp,avif,jpg)
 * --quality=<num>   Quality setting for compression (default: 80)
 * --widths=<list>   Comma-separated list of widths to generate (default: 320,640,960,1280,1920)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');
const chalk = require('chalk');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    acc[key] = value;
  }
  return acc;
}, {});

// Configuration
const config = {
  sourceDir: args.source || 'src/assets/images',
  outputDir: args.output || 'public/images/optimized',
  formats: (args.formats || 'webp,avif,jpg').split(','),
  quality: parseInt(args.quality || 80, 10),
  widths: (args.widths || '320,640,960,1280,1920').split(',').map(w => parseInt(w, 10)),
};

// Ensure output directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Process a single image
async function processImage(imagePath) {
  const fileName = path.basename(imagePath, path.extname(imagePath));
  const outputDirForImage = path.join(config.outputDir, fileName);
  
  ensureDirectoryExists(outputDirForImage);
  
  console.log(chalk.blue(`Processing: ${imagePath}`));
  
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Generate images for each format and width
    for (const format of config.formats) {
      for (const width of config.widths) {
        // Skip if width is larger than original
        if (width > metadata.width) continue;
        
        const outputPath = path.join(outputDirForImage, `${fileName}_${width}.${format}`);
        
        // Skip if file already exists
        if (fs.existsSync(outputPath)) {
          console.log(chalk.yellow(`  Skipping existing: ${outputPath}`));
          continue;
        }
        
        console.log(chalk.green(`  Generating: ${outputPath}`));
        
        let pipeline = image.clone().resize(width);
        
        // Apply format-specific options
        switch (format) {
          case 'webp':
            pipeline = pipeline.webp({ quality: config.quality });
            break;
          case 'avif':
            pipeline = pipeline.avif({ quality: config.quality });
            break;
          case 'jpg':
          case 'jpeg':
            pipeline = pipeline.jpeg({ quality: config.quality, mozjpeg: true });
            break;
          case 'png':
            pipeline = pipeline.png({ quality: config.quality });
            break;
          default:
            pipeline = pipeline.toFormat(format, { quality: config.quality });
        }
        
        await pipeline.toFile(outputPath);
      }
    }
    
    // Generate a JSON manifest with image information
    const manifest = {
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
      responsive: {},
    };
    
    for (const format of config.formats) {
      manifest.responsive[format] = [];
      
      for (const width of config.widths) {
        if (width > metadata.width) continue;
        
        const outputPath = path.join(outputDirForImage, `${fileName}_${width}.${format}`);
        if (fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          manifest.responsive[format].push({
            width,
            path: `/images/optimized/${fileName}/${fileName}_${width}.${format}`,
            size: stats.size,
          });
        }
      }
    }
    
    fs.writeFileSync(
      path.join(outputDirForImage, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(chalk.green(`✓ Processed: ${imagePath}`));
  } catch (error) {
    console.error(chalk.red(`✗ Error processing ${imagePath}: ${error.message}`));
  }
}

// Process all images in the source directory
async function processAllImages() {
  ensureDirectoryExists(config.outputDir);
  
  const imageFiles = glob.sync(path.join(config.sourceDir, '**/*.{jpg,jpeg,png,gif}'));
  
  if (imageFiles.length === 0) {
    console.log(chalk.yellow(`No images found in ${config.sourceDir}`));
    return;
  }
  
  console.log(chalk.blue(`Found ${imageFiles.length} images to process`));
  
  for (const imagePath of imageFiles) {
    await processImage(imagePath);
  }
  
  console.log(chalk.green(`\n✓ All images processed successfully!`));
  console.log(chalk.blue(`Generated images can be found in: ${config.outputDir}`));
}

// Main function
async function main() {
  console.log(chalk.bold.blue('Responsive Image Generator'));
  console.log(chalk.blue('Configuration:'));
  console.log(chalk.blue(`  Source: ${config.sourceDir}`));
  console.log(chalk.blue(`  Output: ${config.outputDir}`));
  console.log(chalk.blue(`  Formats: ${config.formats.join(', ')}`));
  console.log(chalk.blue(`  Quality: ${config.quality}`));
  console.log(chalk.blue(`  Widths: ${config.widths.join(', ')}`));
  console.log('');
  
  await processAllImages();
}

// Run the script
main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  process.exit(1);
});

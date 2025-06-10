import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      // Exclude problematic images from optimization
      exclude: [
        'public/images/sand.png',
        'public/images/bundle.png'
      ]
    }),
    // Bundle analyzer (only in build mode)
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ].filter(Boolean),
  
  // Dependency optimization
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    force: true,
  },
  
  // Build optimization
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true, // Always strip console statements in builds
        drop_debugger: true, // Always strip debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'], // Remove specific console methods
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More granular chunking for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@shopify')) {
              return 'vendor-shopify';
            }
            // Group other node_modules into vendor chunk
            return 'vendor-libs';
          }
          // Split large components into separate chunks
          if (id.includes('src/pages/')) {
            return 'pages';
          }
          if (id.includes('src/components/product/')) {
            return 'product-components';
          }
          if (id.includes('src/components/homepage/')) {
            return 'homepage-components';
          }
          if (id.includes('src/components/judgeMe/')) {
            return 'judgeme-components';
          }
          if (id.includes('src/components/ugc/')) {
            return 'ugc-components';
          }
        },
        // Optimize asset filenames for better caching
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  
  // Server optimization
  server: {
    hmr: true,
    port: 3000,
    host: true,
    // Enable compression
    compress: true,
  },
});

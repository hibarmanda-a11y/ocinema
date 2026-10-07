import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',

      // ব্র্যান্ডিং আপডেট: SanuFlix → Ocinema
      manifest: {
        name: 'Ocinema',
        short_name: 'Ocinema',
        description: 'Watch the latest movies and TV shows online in HD',
        theme_color: '#E50914',
        background_color: '#0a0a0a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        id: '/',
        orientation: 'any',
        categories: ['entertainment', 'video'],
        lang: 'en',
        icons: [
          {
            src: '/assets/ocinemalogo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/ocinemalogo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/ocinemalogo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      // ⚠️ গুরুত্বপূর্ণ: devOptions বন্ধ রাখুন
      // এটি enabled: true থাকলে ডেভ মোডে Service Worker
      // সক্রিয় হয়ে "Offline page" দেখায়
      devOptions: {
        enabled: false,
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/downloader/, /^\/reeailer/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          {
            urlPattern: /^https:\/\/www\.youtube\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'assets/ocinemalogo.png',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Separate Framer Motion (large library)
          'framer': ['framer-motion'],

          // Swiper carousel
          'swiper': ['swiper'],

          // Icons
          'icons': ['react-icons'],

          // TMDB API and utilities
          'utils': ['axios', 'react-helmet-async'],
        },
      },
    },

    // Minification - use esbuild for better performance
    minify: 'esbuild',

    // Target modern browsers for smaller bundles
    target: 'es2015',

    // Generate source maps for debugging
    sourcemap: false, // Disable in production

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Report compressed size
    reportCompressedSize: false,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },

  // Server configuration
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },

  // Preview configuration
  preview: {
    port: 4173,
    host: true,
  },
})
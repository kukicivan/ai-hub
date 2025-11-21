import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');

// SSL certificate paths
const certPath = path.resolve(__dirname, 'certs/localhost.pem');
const keyPath = path.resolve(__dirname, 'certs/localhost-key.pem');
const hasSSL = fs.existsSync(certPath) && fs.existsSync(keyPath);

console.log('🔧 Vite Config:');
console.log('   Mode:', mode);
console.log('   SSL Certificates:', hasSSL ? '✅ Found' : '❌ Not found');
console.log('   API URL:', env.VITE_API_URL || 'Not set');

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    // Allow specific hosts
    allowedHosts: [
      'local.do-my-booking.com',
      'localhost',
      '127.0.0.1',
      'frontend-react-ten-beta.vercel.app'
    ],

  // Enable HTTPS if certificates are available (currently omitted to avoid type mismatch when false)
  // https: hasSSL && {
  //   key: fs.readFileSync(keyPath),
  //   cert: fs.readFileSync(certPath),
  // },

    // CORS configuration
    cors: {
      origin: [
        'http://localhost:5173',
        'https://local.do-my-booking.com:5173',
        'https://outsource-team.do-my-booking.com',
        'https://frontend-react-ten-beta.vercel.app'
      ],
      credentials: true,
    },

    // File watching for Docker
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux'],
  },

  define: {
    __DEV__: mode === 'development',
  },
});

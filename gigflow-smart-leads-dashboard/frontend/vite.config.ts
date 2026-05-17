import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env vars for the current mode so we can use them in the config itself.
  // loadEnv reads VITE_* vars from .env, .env.local, .env.[mode], etc.
  const env = loadEnv(mode, process.cwd(), '');

  // The dev proxy target: use the loaded env var, fall back to localhost.
  // In production (Docker / Vercel) the proxy block is never used —
  // nginx / Vercel's rewrites handle /api routing instead.
  const apiTarget = env.VITE_API_BASE_URL?.startsWith('http')
    ? env.VITE_API_BASE_URL.replace('/api', '')
    : 'http://localhost:5000';

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // Uncomment to debug proxy issues in development:
          // configure: (proxy) => { proxy.on('error', (err) => console.error('[proxy error]', err)); },
        },
      },
    },

    build: {
      outDir: 'dist',
      // Disable source maps in production — keeps bundle lean and avoids
      // exposing source to the public. Enable for staging if needed.
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libs into a separate chunk — better long-term caching
            // because they change far less often than app code.
            vendor: ['react', 'react-dom', 'react-router-dom'],
            forms:  ['react-hook-form', 'zod', '@hookform/resolvers'],
          },
        },
      },
    },
  };
});

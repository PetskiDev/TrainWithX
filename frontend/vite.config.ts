import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Pull in env vars for the current mode (development / production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@frontend': resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.API_URL,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.API_URL,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});

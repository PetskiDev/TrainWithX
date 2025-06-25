import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // built-in Node module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@frontend': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../shared'),
    },
  },
  server: {
    allowedHosts: true,
    port: 5173,
  },
});

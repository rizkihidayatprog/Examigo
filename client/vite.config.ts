import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy uploaded files (PDF/DOCX/etc.) to Express server
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('canvg') || id.includes('dompurify')) {
              return 'vendor-pdf';
            }
            if (id.includes('xlsx') || id.includes('papaparse')) {
              return 'vendor-sheets';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('@mantine')) {
              return 'vendor-mantine';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});

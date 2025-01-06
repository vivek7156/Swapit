import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split react-related libraries into their own chunk
          'react-vendors': ['react', 'react-dom'],
        },
      },
    },
    // Optional: increase warning limit if desired
    chunkSizeWarningLimit: 1500,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  build: {
    // Advertir si algún chunk supera 1 MB (pdfjs-dist es grande)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa React en su propio chunk para mejor cache
          react: ['react', 'react-dom', 'react-router-dom'],
          // Firebase dividido por módulo para tree-shaking eficiente
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
        },
      },
    },
  },
})

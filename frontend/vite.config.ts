import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },  
    hmr: {
      overlay: true, // Muestra errores en el navegador
    },      
    port: 5173,
    strictPort: true,
    open: true,    
  },
  build: {
    outDir: 'dist',
  },

})

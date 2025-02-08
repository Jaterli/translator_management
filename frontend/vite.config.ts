import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/api': 'http://localhost:8000', // Proxy hacia tu backend Django
    // },
    port: 5173,
    strictPort: true,
    open: true,    
  },
  build: {
    outDir: '../backend/static', // Asegura que la build se coloque en la carpeta estática del backend
  },

})

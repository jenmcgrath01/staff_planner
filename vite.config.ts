import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/staff_planner/',
  build: {
    outDir: 'dist',
    assetsDir: 'staff_planner/assets',
    rollupOptions: {
      output: {
        entryFileNames: 'staff_planner/assets/[name].[hash].js',
        chunkFileNames: 'staff_planner/assets/[name].[hash].js',
        assetFileNames: 'staff_planner/assets/[name].[hash].[ext]'
      }
    }
  }
})

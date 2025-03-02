import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/or-schedule/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@public': resolve(__dirname, 'public')
    }
  }
})

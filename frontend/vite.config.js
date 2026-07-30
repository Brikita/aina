import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Make sure the data folder is accessible
    fs: {
      allow: ['..']
    }
  }
})
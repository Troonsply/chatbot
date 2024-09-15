import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chatbot/',  // Убедитесь, что путь совпадает с вашим репозиторием
  build: {
    outDir: 'dist'
  }
})

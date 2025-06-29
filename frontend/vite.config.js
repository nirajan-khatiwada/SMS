import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate react-query (TanStack Query) into its own chunk
          'tanstack-query': ['@tanstack/react-query'],
          // Optional: Split React itself too
          'react-vendors': ['react', 'react-dom'],
        },
      },
    },
  },
   
})

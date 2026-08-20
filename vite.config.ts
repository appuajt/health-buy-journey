import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths so the build works from any base — root domain or a
  // GitHub Pages project subpath (/<repo>/) — without knowing the repo name.
  // Safe here because the app is a single page with no client-side router.
  base: './',
  plugins: [tailwindcss(), react()],
})

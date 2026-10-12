import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base` matters: a GitHub Pages *project* site is served from a subpath
// (https://rithviknimma.github.io/beppily/), so built asset URLs have to be
// prefixed or the page loads blank. `npm run dev` ignores this entirely.
// Change it if the repo is renamed or a custom domain is pointed here.
export default defineConfig({
  base: '/beppily/',
  plugins: [react()],
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// TODO: Import and configure workbox-webpack-plugin (or an alternative Vite plugin)

export default defineConfig({
  plugins: [react()],
  // TODO: Add Workbox plugin configuration for service worker generation
});

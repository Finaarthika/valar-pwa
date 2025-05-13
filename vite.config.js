import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        precacheManifestFilename: 'shell-manifest.json',
        // TODO: Configure runtime caching strategies if needed
      },
      manifest: {
        name: 'Valar – LTV Calculator',
        short_name: 'Valar',
        description: 'Valar LTV Calculator PWA',
        theme_color: '#ffffff', // TODO: Match Aarthika theme color
        background_color: '#ffffff', // TODO: Match Aarthika background color
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'icons/placeholder-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/placeholder-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
           // TODO: Add maskable and monochrome icons
        ],
      },
      // TODO: Configure other PWA options as needed (e.g., cache assets)
    })
  ],
});

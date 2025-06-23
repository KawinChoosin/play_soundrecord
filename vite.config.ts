// vite.config.js or vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, etc.
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), // your existing plugins
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/play_icon.jpg'],
      manifest: {
        name: 'PlayTranslate',
        short_name: 'PWA',
        start_url: '.',
        display: 'standalone',
        background_color: '#181c35',
        theme_color: '#181c35',
        icons: [
          {
            src: 'icons/play_icon.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: 'icons/play_icon.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          }
        ]
      }
    })
  ]
})

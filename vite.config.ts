import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        id: '/',
        name: 'WaterY',
        short_name: 'WaterY',
        description: 'A simple water consumption tracker',
        lang: 'en',
        dir: 'ltr',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        display: 'standalone',
        background_color: '#fcfbfb',
        theme_color: '#016dd6',
        launch_handler: {
          client_mode: 'auto'
        },
        categories: ["productivity"],
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 10 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
})

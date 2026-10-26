import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // --- TAMBAHKAN BLOK INI ---
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // Menaikkan limit ke 4 MB
      },
      // --------------------------
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PWA Maintenance POP Shelter',
        short_name: 'PM Shelter',
        description: 'Aplikasi Preventive Maintenance POP Shelter GI Rancaekek',
        theme_color: '#00A2E9',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
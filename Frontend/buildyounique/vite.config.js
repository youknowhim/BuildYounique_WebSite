import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,           // listen on all network interfaces
    allowedHosts: true,   // allow any host (ngrok, LAN, custom domains, etc.)
  },
});

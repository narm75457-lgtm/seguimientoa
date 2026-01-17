
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://sdpcyvpucoboagrswfvh.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('sb_publishable_KRyFghvta6bQTaKT3CsV-A_kwIsasvF')
  },
  server: {
    host: true
  }
});

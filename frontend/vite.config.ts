import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // <-- ✅ very important for Firebase!
  server: {
    proxy: {
      '/api': 'import.meta.env.VITE_API_URL',
    },
  },
});

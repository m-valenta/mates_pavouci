import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Web běží na GitHub Pages pod /mates_pavouci/, stejnou cestu používá i dev a preview server.
export default defineConfig({
  plugins: [react()],
  base: '/mates_pavouci/',
});

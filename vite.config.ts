import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site under /<repo>/, the dev server under /.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/mates_pavouci/' : '/',
}));

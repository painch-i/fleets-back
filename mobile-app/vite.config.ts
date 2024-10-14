import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react(), legacy()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@cypress': resolve(__dirname, 'cypress'),
    },
  },
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.VITE_MODE': JSON.stringify(mode),
  },
}));

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Preserve process.env.API_KEY for Gemini API as per prompt requirements
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || 'MOCK_GEMINI_API_KEY_NOT_USED_VITE'),
    }
  },
  build: {
    // Ensure JSON files can be imported
    assetsInlineLimit: 0, // This might help with JSON, or consider using `vite-plugin-json` if issues persist.
  },
  // Explicitly include JSON in optimizeDeps if needed, though Vite 3+ handles it better.
  // optimizeDeps: {
  //   include: ['**/*.json'],
  // },
  server: {
    watch: {
      // Watch JSON files if changes aren't picked up
      // ignored: ['!**/locales/**/*.json']
    }
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/SemanticAutocomplete.jsx',
      name: 'SemanticAutocomplete',
      // Output format options: "umd", "iife", "es"
      formats: ['es', 'umd'],
      fileName: (format) => `semantic-autocomplete.${format}.js`
    },
    rollupOptions: {
      // Explicitly specify external dependencies (if any)
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
  },
  optimizeDeps: {
    exclude: ['src/worker.js']
  }
});

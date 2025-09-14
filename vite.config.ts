import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    cssCodeSplit: false,
    minify: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "assets": path.resolve(__dirname, "src/assets"),
      "config": path.resolve(__dirname, "src/config"),
      "components": path.resolve(__dirname, "src/components"),
      "context": path.resolve(__dirname, "src/context"),
      "controllers": path.resolve(__dirname, "src/controllers"),
      "hooks": path.resolve(__dirname, "src/hooks"),
      "routing": path.resolve(__dirname, "src/routing"),
      "utils": path.resolve(__dirname, "src/utils"),
    }
  }
})

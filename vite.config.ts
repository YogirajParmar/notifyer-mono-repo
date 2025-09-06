import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src/frontend/renderer"),
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist/frontend"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/frontend/renderer/index.html"),
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});

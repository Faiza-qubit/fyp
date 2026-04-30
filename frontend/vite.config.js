import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [
    react(),           // Keep this as default (fast esbuild + SWC)
    basicSsl(),        // Keep for HTTPS
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    https: true,       // basicSsl() will handle this
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
    https: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssMinify: false,
  },
});
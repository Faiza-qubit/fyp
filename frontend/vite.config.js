import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),   // Local HTTPS certificate generator
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: "0.0.0.0",   // for local network testing (e.g. on mobile devices)
    port: 5173,
    https: true,
  },

  preview: {
    host: "0.0.0.0",   // for production preview testing
    port: 4173,
    https: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/static/dist/" : "/",
  build: {
    outDir: "dist", // غيرناها إلى dist لأننا سننشر الفرونت إند لوحده
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (info) => {
          if (info.name?.endsWith(".css")) return "assets/main.css";
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
}));

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.API_KEY": JSON.stringify("mock-api-key-for-demo"),
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});

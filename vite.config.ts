import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  assetsInclude: ["**/*.pdf"],
  worker: {
    format: "es",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("pdfjs-dist")) {
              return "pdfjs";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            return "vendor";
          }
        },
      },
    },
  },
});

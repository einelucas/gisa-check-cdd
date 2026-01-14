import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  /**
   * - GitHub Pages (produção): /gisa-check-cdd/
   * - Vercel e dev: /
   */
  base: mode === "production" ? "/gisa-check-cdd/" : "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));

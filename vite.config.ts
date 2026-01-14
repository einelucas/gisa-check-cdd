import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/gisa-check-cdd/", // 🔒 garante assets corretos no GitHub Pages
});

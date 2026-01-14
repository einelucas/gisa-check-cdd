import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => {
  const isVercel = process.env.VERCEL === "1";

  return {
    plugins: [react()],

    /**
     * GitHub Pages → /gisa-check-cdd/
     * Vercel / Local → /
     */
    base: isVercel ? "/" : "/gisa-check-cdd/",

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});

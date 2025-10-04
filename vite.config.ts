import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  root: "src/presentation",
  envDir: "../../",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../../dist/presentation",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/presentation"),
    },
  },
});

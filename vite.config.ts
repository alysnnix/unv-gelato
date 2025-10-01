import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  root: "src/presentation",
  envDir: "../../",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../../dist/presentation",
    emptyOutDir: true,
  },
});

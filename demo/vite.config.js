import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/demo/",
  server: { port: 5174 },
  build: {
    outDir: "../public/demo",
    emptyOutDir: true,
  },
});

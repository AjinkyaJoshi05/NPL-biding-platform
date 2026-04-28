import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  cacheDir: ".vite-cache",
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  }
});

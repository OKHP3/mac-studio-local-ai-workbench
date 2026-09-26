import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/mac-studio-local-ai-workbench/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
}));
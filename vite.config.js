import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ["**/public/cars/**", "**/public/tema-port.jpg", "**/public/port/**", "**/public/brand/steven.jpg", "**/public/work/cover.mp4", "**/.shots/**"],
      // Port photos are ignored so a locked file does not stop the server.
    },
  },
});

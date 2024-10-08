import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        // enable CSS in node_modules
        additionalData: '@import "swiper/css";',
      },
    },
  },
});

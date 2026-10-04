import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "dev.html",
      output: {
        entryFileNames: "assets/index.js",
        assetFileNames: "assets/index[extname]"
      }
    }
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"]
  }
});

import dts from "vite-plugin-dts";
import path from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [dts({ rollupTypes: true, insertTypesEntry: true })],
  resolve: {
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "hip", // Global variable name for IIFE
      formats: ["es", "cjs", "iife"], // ES/CJS for npm, IIFE for CDN
      fileName: (format) =>
        `index.${format === "es" ? "mjs" : format === "cjs" ? "cjs" : "iife.js"}`,
    },
  },
} satisfies UserConfig);

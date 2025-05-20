import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "c8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "dist/", ".yarn/"],
      all: true,
      include: ["src/**/*.{ts,js}"],
    },
  },
});

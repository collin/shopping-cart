import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    globalSetup: "./src/globalTestSetup.ts",
    setupFiles: ["./src/setupTests.ts"],
  },
});

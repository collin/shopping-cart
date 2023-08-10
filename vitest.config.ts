import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    globalSetup: "./src/testSupport/createTestData.ts",
    setupFiles: ["./src/testSupport/setupMockServiceWorker.ts"],
  },
});

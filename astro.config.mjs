import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://hevy-mcp.dev",
  output: "static",
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});

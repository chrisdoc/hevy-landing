import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hevy-mcp.dev",
  integrations: [sitemap()],
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

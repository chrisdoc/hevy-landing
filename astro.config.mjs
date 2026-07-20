import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://hevy-mcp.dev",
	trailingSlash: "always",
	output: "static",
	integrations: [
		sitemap({
			filter: (page) => !new URL(page).pathname.startsWith("/404"),
		}),
	],
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

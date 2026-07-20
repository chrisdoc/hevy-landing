# Hevy MCP landing page

The static marketing and setup site for [Hevy MCP](https://github.com/chrisdoc/hevy-mcp). It presents browser-based OAuth as the easiest path, documents direct HTTPS and local stdio setup, and keeps all configuration examples in typed shared data.

## Local development

```sh
npm install
npm run dev
```

The site uses Astro with strict TypeScript and small vanilla-TypeScript interactions. No client framework, server-side rendering, API route, database, or application secret is required.

## Validation

```sh
npm run check
export PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example/script.js
export PUBLIC_UMAMI_WEBSITE_ID=your-site-uuid
npm run build
npm run deploy:dry-run
```

The production output is generated in `dist/`. Wrangler publishes that directory through Cloudflare Workers Static Assets. Production deployments should run from the `main` branch only.

Umami is configured at build time through `PUBLIC_UMAMI_SCRIPT_URL` and `PUBLIC_UMAMI_WEBSITE_ID`. Set both as Cloudflare Workers Build variables; they are not runtime Worker bindings.

## Content maintenance

- Transport and client instructions live in `src/data/setup.ts` and feed the setup guide.
- Setup claims and commands should remain synchronized with the upstream Hevy MCP README.
- Public examples must use placeholders. The optional key check sends the entered value directly from the browser to Hevy's official `/v1/user/info` endpoint. The landing-site Worker never receives, proxies, stores, or records the key, and the page does not persist it.
- The demo video and poster remain static assets under `public/demo/` for direct viewing; the landing page links to the full-resolution recording instead of embedding it.

import {
	getClientGuide,
	getTransportBySlug,
	type ClientGuideSlug,
	type TransportSlug,
} from "./setup";

export interface NavigationLink {
	label: string;
	href: string;
}

export interface FooterGroup {
	label: string;
	links: readonly NavigationLink[];
}

export const githubUrl = "https://github.com/chrisdoc/hevy-mcp";
export const npmUrl = "https://www.npmjs.com/package/hevy-mcp";
export const issuesUrl = "https://github.com/chrisdoc/hevy-mcp/issues";
export const mitLicenseUrl = "https://github.com/chrisdoc/hevy-mcp/blob/main/LICENSE";

export const globalNavigation: readonly NavigationLink[] = [
	{ label: "Features", href: "/#features" },
	{ label: "Get started", href: "/docs/getting-started/" },
	{ label: "Security", href: "/security/" },
	{ label: "FAQ", href: "/faq/" },
];

export const methodOrder = ["browser", "https", "local"] satisfies readonly TransportSlug[];
export const clientOrder = ["claude-ai", "codex", "claude-desktop", "cursor"] satisfies readonly ClientGuideSlug[];

export const methodNavigation: readonly NavigationLink[] = methodOrder.map((slug) => {
	const mode = getTransportBySlug(slug);
	return { label: mode.label, href: `/docs/connect/${slug}/` };
});

export const clientNavigation: readonly NavigationLink[] = clientOrder.map((slug) => {
	const client = getClientGuide(slug);
	return { label: client.label, href: `/docs/clients/${slug}/` };
});

export const docsSidebarGroups = [
	{
		label: "Start here",
		links: [
			{ label: "Docs overview", href: "/docs/" },
			{ label: "Getting started", href: "/docs/getting-started/" },
		],
	},
	{
		label: "Connection methods",
		links: methodNavigation,
	},
	{
		label: "Client guides",
		links: clientNavigation,
	},
	{
		label: "Help and trust",
		links: [
			{ label: "Troubleshooting", href: "/docs/troubleshooting/" },
			{ label: "Security", href: "/security/" },
			{ label: "FAQ", href: "/faq/" },
		],
	},
] as const;

export const footerGroups: readonly FooterGroup[] = [
	{
		label: "Product",
		links: [
			{ label: "Features", href: "/#features" },
			{ label: "Getting started", href: "/docs/getting-started/" },
			{ label: "Security", href: "/security/" },
		],
	},
	{
		label: "Resources",
		links: [
			{ label: "Docs", href: "/docs/" },
			{ label: "FAQ", href: "/faq/" },
			{ label: "GitHub", href: githubUrl },
			{ label: "npm", href: npmUrl },
		],
	},
	{
		label: "Support",
		links: [
			{ label: "Troubleshooting", href: "/docs/troubleshooting/" },
			{ label: "Issues", href: issuesUrl },
		],
	},
	{
		label: "Trust / legal",
		links: [
			{ label: "Security", href: "/security/" },
			{ label: "MIT license", href: mitLicenseUrl },
		],
	},
];

export const getMethodNavigation = (slug: TransportSlug): NavigationLink => {
	const link = methodNavigation.find((candidate) => candidate.href === `/docs/connect/${slug}/`);
	if (!link) throw new Error(`Unable to resolve Hevy MCP method navigation "${slug}".`);
	return link;
};

export const getClientNavigation = (slug: ClientGuideSlug): NavigationLink => {
	const link = clientNavigation.find((candidate) => candidate.href === `/docs/clients/${slug}/`);
	if (!link) throw new Error(`Unable to resolve Hevy MCP client navigation "${slug}".`);
	return link;
};


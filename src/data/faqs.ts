export type FaqId =
	| "free"
	| "hevy-pro"
	| "assistants"
	| "api-key-storage"
	| "workout-changes"
	| "installation"
	| "revocation"
	| "affiliation"
	| "what-is";

export interface FaqItem {
	id: FaqId;
	question: string;
	answer: string;
	more?: { label: string; href: string };
}

export const faqs: readonly FaqItem[] = [
	{
		id: "free",
		question: "Is Hevy MCP free?",
		answer:
			"Hevy MCP is free and MIT licensed. Hevy PRO is required because Hevy API access currently requires PRO.",
		more: { label: "Read the security details", href: "/security/" },
	},
	{
		id: "hevy-pro",
		question: "Do I need Hevy PRO?",
		answer: "Yes. A Hevy API key is required, and API access currently requires a Hevy PRO subscription.",
		more: { label: "Choose a setup method", href: "/docs/getting-started/" },
	},
	{
		id: "assistants",
		question: "Which assistants work with Hevy MCP?",
		answer:
			"The setup includes paths for Claude.ai, Codex, Claude Desktop, Cursor, and other compatible MCP clients. The available connection method depends on whether your client supports browser OAuth, Streamable HTTP, or local stdio.",
		more: { label: "See client guides", href: "/docs/clients/" },
	},
	{
		id: "api-key-storage",
		question: "Is my Hevy API key stored?",
		answer:
			"The optional browser key check sends your key directly to Hevy and does not send it to this landing site. Browser sign-in validates the key and stores it encrypted inside the OAuth grant. Direct HTTPS validates the key per request without storing it. Local mode passes the key through your local process environment.",
		more: { label: "Read how credentials are handled", href: "/security/" },
	},
	{
		id: "workout-changes",
		question: "Can Hevy MCP change my workouts?",
		answer:
			"Yes. It can create and update workouts, routines, custom exercises, and body measurements. Compatible clients can request confirmation before mutation tools run, so review the proposed change before approving it.",
		more: { label: "Review mutation behavior", href: "/security/" },
	},
	{
		id: "installation",
		question: "Do I need to install anything?",
		answer:
			"No for browser sign-in. The hosted endpoint requires no Node.js, Bun, Docker, environment variables, or local server process. Local mode uses npx, Bun, or Docker; local npx usage requires Node.js 20 or newer.",
		more: { label: "Start the setup guide", href: "/docs/getting-started/" },
	},
	{
		id: "revocation",
		question: "How do I revoke access?",
		answer:
			"Rotate your Hevy API key to invalidate browser OAuth grants, then remove the Hevy MCP connector or client configuration. Direct HTTPS and local mode stop working when that key is removed or replaced.",
		more: { label: "Read revocation details", href: "/security/" },
	},
	{
		id: "affiliation",
		question: "Is this an official Hevy product?",
		answer:
			"No. Hevy MCP is an independent open-source project and is not affiliated with or endorsed by Hevy.",
		more: { label: "About this project", href: "/" },
	},
	{
		id: "what-is",
		question: "What is Hevy MCP?",
		answer:
			"Hevy MCP is an open-source connector that lets Claude, Cursor, Codex, and other MCP clients read, analyze, create, and update data in your Hevy account.",
		more: { label: "See what you can do", href: "/#features" },
	},
];

const featuredIds: readonly FaqId[] = [
	"free",
	"hevy-pro",
	"assistants",
	"api-key-storage",
	"workout-changes",
];

export const featured: readonly FaqItem[] = faqs.filter(({ id }) => featuredIds.includes(id));

export const getFaq = (id: FaqId): FaqItem => {
	const faq = faqs.find((candidate) => candidate.id === id);
	if (!faq) throw new Error(`Unable to resolve Hevy MCP FAQ "${id}".`);
	return faq;
};

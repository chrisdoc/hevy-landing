export type TransportId = "oauth" | "https" | "stdio";
export type TransportSlug = "browser" | "https" | "local";
export type ClientSetupId =
	| "claude-ai"
	| "oauth-client"
	| "codex"
	| "http-client"
	| "claude-desktop"
	| "cursor"
	| "any-stdio";

export interface ClientSetup {
	id: ClientSetupId;
	label: string;
	format: "url" | "shell" | "json" | "command";
	code: string;
	verificationLabel?: string;
	verification: string;
	configLocations?: readonly string[];
}

export interface TransportMode {
	id: TransportId;
	slug: TransportSlug;
	label: string;
	badge?: string;
	audience: string;
	summary: string;
	description: string;
	security: string;
	clients: readonly ClientSetup[];
}

export const hostedEndpoint = "https://hevy.chrisdoc.dev/mcp";
export const hevyApiKeyUrl = "https://hevy.com/settings?developer";
export const connectionPrompt = "Which Hevy account is connected?";

export const transportModes: readonly TransportMode[] = [
	{
		id: "oauth",
		slug: "browser",
		label: "Browser sign-in",
		badge: "Recommended",
		audience: "No install · Recommended for most people",
		summary: "No install. Best for most people.",
		description:
			"Add the hosted endpoint and your assistant opens a secure browser flow. There are no environment variables, JSON files, or local server processes to manage.",
		security:
			"Your Hevy API key is validated once and stored encrypted inside the OAuth grant. Rotating the key invalidates that grant.",
		clients: [
			{
				id: "claude-ai",
				label: "Claude.ai",
				format: "url",
				code: hostedEndpoint,
				verificationLabel: "Next",
				verification:
					"Add this URL as a custom connector. Continue in the browser, paste your Hevy API key once, and approve access.",
			},
			{
				id: "oauth-client",
				label: "Other OAuth clients",
				format: "url",
				code: hostedEndpoint,
				verificationLabel: "Next",
				verification:
					"Add this as a remote MCP server. Compatible OAuth 2.1 clients discover the authorization flow and open it in your browser.",
			},
		],
	},
	{
		id: "https",
		slug: "https",
		label: "Direct HTTPS",
		audience: "For clients that accept a fixed API key",
		summary: "For clients that accept a fixed API key.",
		description:
			"Nothing to install or keep running. Connect your client to the hosted endpoint and provide your Hevy key as a bearer credential.",
		security:
			"The hosted Worker validates the bearer key with Hevy on every request and does not store it.",
		clients: [
			{
				id: "codex",
				label: "Codex",
				format: "shell",
				code: String.raw`export HEVY_API_KEY=your-hevy-api-key
codex mcp add hevy \
  --url ${hostedEndpoint} \
  --bearer-token-env-var HEVY_API_KEY`,
				verification:
					"Restart Codex or begin a new session, then run codex mcp list to verify the server is configured.",
			},
			{
				id: "http-client",
				label: "Other HTTP clients",
				format: "json",
				code: `{
  "mcpServers": {
    "hevy": {
      "url": "${hostedEndpoint}",
      "headers": {
        "Authorization": "Bearer your-hevy-api-key"
      }
    }
  }
}`,
				verification:
					"Restart or reconnect the client. It must support Streamable HTTP and a fixed Authorization header.",
			},
		],
	},
	{
		id: "stdio",
		slug: "local",
		label: "Local stdio",
		audience: "For local control or clients without remote HTTP",
		summary: "For local control or clients without remote HTTP.",
		description:
			"Run the same server locally when your client cannot send a fixed authorization header or you prefer to control the process on your machine.",
		security:
			"The key is passed through your client’s child-process environment to the local server.",
		clients: [
			{
				id: "codex",
				label: "Codex",
				format: "shell",
				code: String.raw`codex mcp add hevy \
  --env HEVY_API_KEY=your-hevy-api-key \
  -- npx -y hevy-mcp`,
				verification:
					"Restart Codex or begin a new session, then run codex mcp list. Local npx usage requires Node.js 20 or newer.",
			},
			{
				id: "claude-desktop",
				label: "Claude Desktop",
				format: "json",
				code: `{
  "mcpServers": {
    "hevy": {
      "command": "npx",
      "args": ["-y", "hevy-mcp"],
      "env": {
        "HEVY_API_KEY": "your-hevy-api-key"
      }
    }
  }
}`,
				verification:
					"Save the Claude Desktop configuration, then restart or reconnect the client. Local npx usage requires Node.js 20 or newer.",
				configLocations: [
					"~/Library/Application Support/Claude/claude_desktop_config.json",
					"%APPDATA%\\Claude\\claude_desktop_config.json",
				],
			},
			{
				id: "cursor",
				label: "Cursor",
				format: "json",
				code: `{
  "mcpServers": {
    "hevy": {
      "command": "npx",
      "args": ["-y", "hevy-mcp"],
      "env": {
        "HEVY_API_KEY": "your-hevy-api-key"
      }
    }
  }
}`,
				verification:
					"Save the Cursor MCP configuration, then restart or reconnect the client. Local npx usage requires Node.js 20 or newer.",
				configLocations: ["~/.cursor/mcp.json"],
			},
			{
				id: "any-stdio",
				label: "Any stdio client",
				format: "command",
				code: "npx -y hevy-mcp",
				verification:
					"Configure the client to launch this command with HEVY_API_KEY in the child-process environment, then reconnect.",
			},
		],
	},
] as const;

export type ClientGuideSlug = "claude-ai" | "codex" | "claude-desktop" | "cursor";

export interface ClientSetupRef {
	transportId: TransportId;
	clientId: ClientSetupId;
}

export interface ClientGuide {
	slug: ClientGuideSlug;
	label: string;
	summary: string;
	setups: readonly ClientSetupRef[];
}

export const clientGuides: readonly ClientGuide[] = [
	{
		slug: "claude-ai",
		label: "Claude.ai",
		summary: "Connect Hevy to Claude.ai with browser OAuth and no local install.",
		setups: [{ transportId: "oauth", clientId: "claude-ai" }],
	},
	{
		slug: "codex",
		label: "Codex",
		summary: "Connect Hevy to Codex with Direct HTTPS or local stdio.",
		setups: [
			{ transportId: "https", clientId: "codex" },
			{ transportId: "stdio", clientId: "codex" },
		],
	},
	{
		slug: "claude-desktop",
		label: "Claude Desktop",
		summary: "Connect Hevy to Claude Desktop with local stdio.",
		setups: [{ transportId: "stdio", clientId: "claude-desktop" }],
	},
	{
		slug: "cursor",
		label: "Cursor",
		summary: "Connect Hevy to Cursor with local stdio.",
		setups: [{ transportId: "stdio", clientId: "cursor" }],
	},
] as const;

export const getTransportBySlug = (slug: TransportSlug): TransportMode => {
	const mode = transportModes.find((candidate) => candidate.slug === slug);
	if (!mode) {
		throw new Error(`Unable to resolve Hevy MCP transport slug "${slug}".`);
	}
	return mode;
};

export const getClientGuide = (slug: ClientGuideSlug): ClientGuide => {
	const guide = clientGuides.find((candidate) => candidate.slug === slug);
	if (!guide) {
		throw new Error(`Unable to resolve Hevy MCP client guide "${slug}".`);
	}
	return guide;
};

export const getClientSetup = ({
	transportId,
	clientId,
}: ClientSetupRef): { mode: TransportMode; client: ClientSetup } => {
	const mode = transportModes.find((candidate) => candidate.id === transportId);
	const client = mode?.clients.find((candidate) => candidate.id === clientId);
	if (!mode || !client) {
		throw new Error(
			`Unable to resolve Hevy MCP setup "${transportId}/${clientId}".`,
		);
	}
	return { mode, client };
};

export const toolGroups = [
	{
		label: "Analysis",
		tools: ["get-training-summary"],
	},
	{
		label: "Workouts",
		tools: [
			"get-workouts",
			"get-workout",
			"get-workout-count",
			"get-workout-events",
			"create-workout",
			"update-workout",
		],
	},
	{
		label: "Routines",
		tools: [
			"search-routines",
			"get-routines",
			"get-routine",
			"create-routine",
			"update-routine",
			"get-routine-folders",
			"get-routine-folder",
			"create-routine-folder",
		],
	},
	{
		label: "Exercises",
		tools: [
			"get-exercise-templates",
			"get-exercise-template",
			"search-exercise-templates",
			"create-exercise-template",
			"get-exercise-history",
		],
	},
	{
		label: "Measurements",
		tools: [
			"get-body-measurements",
			"get-body-measurement",
			"create-body-measurement",
			"update-body-measurement",
		],
	},
	{
		label: "Account",
		tools: ["get-user-info"],
	},
] as const;

export const toolCount = toolGroups.reduce((total, group) => total + group.tools.length, 0);

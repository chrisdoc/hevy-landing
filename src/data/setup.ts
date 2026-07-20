export type TransportId = "oauth" | "https" | "stdio";

export interface ClientSetup {
	id: string;
	label: string;
	format: "url" | "shell" | "json" | "command";
	code: string;
	verificationLabel?: string;
	verification: string;
}

export interface TransportMode {
	id: TransportId;
	label: string;
	badge?: string;
	audience: string;
	description: string;
	keyDescription: string;
	clients: readonly ClientSetup[];
}

export const transportModes: readonly TransportMode[] = [
	{
		id: "oauth",
		label: "Browser sign-in",
		badge: "Recommended",
		audience: "No install · Recommended for most people",
		description:
			"Add the hosted endpoint and your assistant opens a secure browser flow. There are no environment variables, JSON files, or local server processes to manage.",
		keyDescription:
			"Create a Hevy API key and keep it handy. The authorization page asks for it once, validates it with Hevy, and stores it encrypted inside your OAuth grant.",
		clients: [
			{
				id: "claude-ai",
				label: "Claude.ai",
				format: "url",
				code: "https://hevy.chrisdoc.dev/mcp",
				verificationLabel: "Next",
				verification:
					"Add this URL as a custom connector. Continue in the browser, paste your Hevy API key once, and approve access.",
			},
			{
				id: "oauth-client",
				label: "Other OAuth clients",
				format: "url",
				code: "https://hevy.chrisdoc.dev/mcp",
				verificationLabel: "Next",
				verification:
					"Add this as a remote MCP server. Compatible OAuth 2.1 clients discover the authorization flow and open it in your browser.",
			},
		],
	},
	{
		id: "https",
		label: "Direct HTTPS",
		audience: "For clients that accept a fixed API key",
		description:
			"Nothing to install or keep running. Connect your client to the hosted endpoint and provide your Hevy key as a bearer credential.",
		keyDescription:
			"Create a Hevy API key and keep it somewhere secure. Your client sends it to the hosted server as a bearer credential on each request.",
		clients: [
			{
				id: "codex",
				label: "Codex",
				format: "shell",
				code: "export HEVY_API_KEY=your-hevy-api-key\ncodex mcp add hevy \\\n  --url https://hevy.chrisdoc.dev/mcp \\\n  --bearer-token-env-var HEVY_API_KEY",
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
      "url": "https://hevy.chrisdoc.dev/mcp",
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
		label: "Run locally",
		audience: "For local control or clients without remote HTTP",
		description:
			"Run the same server locally when your client cannot send a fixed authorization header or you prefer to control the process on your machine.",
		keyDescription:
			"Create a Hevy API key and keep it somewhere secure. Your MCP client passes it to the local process through its environment.",
		clients: [
			{
				id: "codex",
				label: "Codex",
				format: "shell",
				code: "codex mcp add hevy \\\n  --env HEVY_API_KEY=your-hevy-api-key \\\n  -- npx -y hevy-mcp",
				verification:
					"Restart Codex or begin a new session, then run codex mcp list. Local npx usage requires Node.js 20 or newer.",
			},
			{
				id: "desktop",
				label: "Claude / Cursor",
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
					"Save the client configuration, then restart or reconnect the client. Local npx usage requires Node.js 20 or newer.",
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

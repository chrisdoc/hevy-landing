export type TransportId = "https" | "stdio";

export interface ClientSetup {
	id: string;
	label: string;
	format: "shell" | "json" | "command";
	code: string;
	verification: string;
}

export interface TransportMode {
	id: TransportId;
	label: string;
	shortLabel: string;
	recommended: boolean;
	description: string;
	route: readonly string[];
	clients: readonly ClientSetup[];
}

export const transportModes: readonly TransportMode[] = [
	{
		id: "https",
		label: "Hosted HTTPS",
		shortLabel: "HTTPS",
		recommended: true,
		description:
			"Nothing to install or keep running. Connect your client to the hosted Streamable HTTP endpoint and provide your Hevy key as a bearer credential.",
		route: ["AI assistant", "Streamable HTTPS", "Cloudflare Worker", "Hevy API"],
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
		label: "Local stdio",
		shortLabel: "stdio",
		recommended: false,
		description:
			"Run the same server locally when your client cannot send a fixed authorization header or you prefer to control the process on your machine.",
		route: ["AI assistant", "MCP over stdio", "Local hevy-mcp", "Hevy API"],
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

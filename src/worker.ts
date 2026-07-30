interface Fetcher {
	fetch(request: Request): Promise<Response>;
}

interface Env {
	ASSETS: Fetcher;
}

interface CloudflareRequest extends Request {
	cf?: { country?: string | null };
}

interface HTMLRewriterElement {
	append(content: string, options?: { html?: boolean }): void;
}

declare class HTMLRewriter {
	on(
		selector: string,
		handlers: { element(element: HTMLRewriterElement): void },
	): HTMLRewriter;
	transform(response: Response): Response;
}

type ExportedHandler<TEnv> = {
	fetch(request: CloudflareRequest, env: TEnv): Response | Promise<Response>;
};

const recorderScript =
	'<script defer src="https://a.chrisdoc.dev/recorder.js" data-website-id="d71bbc62-a277-4668-943c-3b1f23985f9f"></script>';

// Keep replay and heatmap collection disabled for EU/EEA, UK, Switzerland, and
// requests without a country signal. Those visitors can be handled by a
// consent mechanism later without accidentally recording before opt-in.
const consentRequiredCountries = new Set([
	"AT",
	"BE",
	"BG",
	"CH",
	"CY",
	"CZ",
	"DE",
	"DK",
	"EE",
	"ES",
	"FI",
	"FR",
	"GB",
	"GR",
	"HR",
	"HU",
	"IE",
	"IS",
	"IT",
	"LI",
	"LT",
	"LU",
	"LV",
	"MT",
	"NL",
	"NO",
	"PL",
	"PT",
	"RO",
	"SE",
	"SI",
	"SK",
	"XI",
]);

function canRecord(request: CloudflareRequest): boolean {
	const country = request.cf?.country;
	return country != null && !consentRequiredCountries.has(country);
}

export default {
	async fetch(request: CloudflareRequest, env: Env): Promise<Response> {
		const response = await env.ASSETS.fetch(request);
		const contentType = response.headers.get("content-type") ?? "";

		if (!canRecord(request) || !contentType.includes("text/html")) {
			return response;
		}

		return new HTMLRewriter()
			.on("body", {
				element(element) {
					element.append(recorderScript, { html: true });
				},
			})
			.transform(response);
	},
} satisfies ExportedHandler<Env>;

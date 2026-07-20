import type {
	ClientGuideSlug,
	ClientSetupId,
	TransportId,
} from "../data/setup";

type SetupCtaPlacement = "header" | "hero" | "capabilities" | "demo" | "final" | "mobile";
type SetupCtaMethod = Extract<TransportId, "oauth" | "stdio">;
type CopyOutcome = "clipboard" | "selection_fallback" | "unavailable";
type KeyCheckOutcome =
	| "success"
	| "rejected"
	| "account_not_found"
	| "rate_limited"
	| "hevy_error"
	| "timeout"
	| "network_error";

export type LandingEvent =
	| {
			name: "setup_cta_clicked";
			data: { placement: SetupCtaPlacement; method_id: SetupCtaMethod };
		}
	| { name: "setup_section_reached"; data: Record<string, never> }
	| { name: "transport_selected"; data: { method_id: TransportId } }
	| {
			name: "client_guide_opened";
			data: { client_id: ClientGuideSlug; method_id?: TransportId };
		}
	| {
			name: "config_copied";
			data: { method_id: TransportId; client_id: ClientSetupId; outcome: CopyOutcome };
		}
	| { name: "hevy_api_settings_opened"; data: { method_id: TransportId } }
	| { name: "key_check_started"; data: { method_id: TransportId } }
	| {
			name: "key_check_completed";
			data: { method_id: TransportId; outcome: KeyCheckOutcome };
		}
	| { name: "first_question_copied"; data: { outcome: CopyOutcome } }
	| { name: "demo_link_clicked"; data: Record<string, never> }
	| {
			name: "github_clicked";
			data: { placement: "header" | "hero" | "footer" | "docs" };
		};

declare global {
	interface Window {
		umami?: { track: (name: string, data?: Record<string, unknown>) => void };
		__hevyUmamiReady?: boolean;
	}
}

const pending: LandingEvent[] = [];
let umamiReady = false;
let flushed = false;

const dispatchDebugEvent = (event: LandingEvent) => {
	if (import.meta.env.DEV) {
		window.dispatchEvent(new CustomEvent("hevy:analytics", { detail: event }));
	}
};

const flush = () => {
	if (!umamiReady || !window.umami || flushed) return;
	flushed = true;
	while (pending.length > 0) {
		const event = pending.shift();
		if (event) window.umami.track(event.name, event.data);
	}
};

const markUmamiReady = () => {
	umamiReady = true;
	flush();
};

if (typeof window !== "undefined") {
	if (window.__hevyUmamiReady) markUmamiReady();
	window.addEventListener("hevy:umami-ready", markUmamiReady, { once: true });
}

export const track = (event: LandingEvent) => {
	if (typeof window === "undefined") return;
	dispatchDebugEvent(event);
	if (umamiReady && window.umami) {
		window.umami.track(event.name, event.data);
		return;
	}
	if (pending.length < 50) pending.push(event);
};

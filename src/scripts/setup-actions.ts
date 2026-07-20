import type {
	ClientGuideSlug,
	ClientSetupId,
	TransportId,
} from "../data/setup";
import { track } from "./analytics";

interface HevyUserInfoResponse {
	data?: {
		name?: string;
	};
}

const HEVY_USER_INFO_URL = "https://api.hevyapp.com/v1/user/info";
const transportIds: Record<TransportId, true> = { oauth: true, https: true, stdio: true };

const getTransportId = (value: string | undefined): TransportId | undefined =>
	value && value in transportIds ? (value as TransportId) : undefined;

const selectCopyTarget = (root: HTMLElement) => {
	const target = root.querySelector<HTMLElement>("[data-copy-target]");
	if (!target) return false;
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(target);
	selection?.removeAllRanges();
	selection?.addRange(range);
	target.focus();
	return true;
};

const copyStatusFor = (root: HTMLElement) => root.querySelector<HTMLElement>("[data-copy-status]");

const setCopyLabel = (button: HTMLButtonElement, value: string) => {
	const label = button.querySelector<HTMLElement>("[data-copy-label]");
	if (label) label.textContent = value;
};

const copyFrom = async (button: HTMLButtonElement) => {
	const root = button.closest<HTMLElement>("[data-copy-root]");
	const target = root?.querySelector<HTMLElement>("[data-copy-target]");
	const status = root ? copyStatusFor(root) : undefined;
	if (!root || !target) return;

	const copyValue = button.dataset.copyValue ?? target.textContent ?? "";
	const isQuestion = root.dataset.copyKind === "question";
	const defaultLabel = button.querySelector<HTMLElement>("[data-copy-label]")?.textContent ?? "Copy";
	let outcome: "clipboard" | "selection_fallback" | "unavailable" = "unavailable";

	try {
		if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
		await navigator.clipboard.writeText(copyValue);
		outcome = "clipboard";
		setCopyLabel(button, "Copied");
		if (status) {
			status.textContent = isQuestion
				? "Question copied. Paste it into your assistant after reconnecting."
				: copyValue.includes("your-hevy-api-key")
					? "Configuration copied. Replace the API-key placeholder before saving."
					: "Connection URL copied. Paste it into your client settings.";
		}
	} catch {
		const selected = selectCopyTarget(root);
		outcome = selected ? "selection_fallback" : "unavailable";
		setCopyLabel(button, selected ? "Selected" : "Copy unavailable");
		if (status) {
			const selectedContent = isQuestion ? "question" : "configuration";
			status.textContent = selected
				? `Clipboard access is blocked. The ${selectedContent} is selected; press Ctrl+C or Command+C to copy it.`
				: `Clipboard access is blocked. Select the ${selectedContent} and copy it manually.`;
		}
	}

	const methodId = getTransportId(root.dataset.methodId);
	if (isQuestion) {
		track({ name: "first_question_copied", data: { outcome } });
	} else if (methodId) {
		const clientId = root.dataset.clientId as ClientSetupId | undefined;
		if (clientId) track({ name: "config_copied", data: { method_id: methodId, client_id: clientId, outcome } });
	}
	window.setTimeout(() => setCopyLabel(button, defaultLabel), 1600);
};

const keyCheckOutcomeFor = (status: number): "rejected" | "account_not_found" | "rate_limited" | "hevy_error" => {
	if (status === 401 || status === 403) return "rejected";
	if (status === 404) return "account_not_found";
	if (status === 429) return "rate_limited";
	return "hevy_error";
};

const checkKey = async (form: HTMLFormElement) => {
	const keyCheck = form.closest<HTMLElement>("[data-key-check-root]");
	const input = form.querySelector<HTMLInputElement>('input[name="hevy-api-key"]');
	const button = form.querySelector<HTMLButtonElement>("[data-key-check-button]");
	const status = keyCheck?.querySelector<HTMLElement>("[data-key-check-status]");
	const methodId = getTransportId(keyCheck?.dataset.methodId);
	const apiKey = input?.value.trim();
	if (!keyCheck || !input || !button || !status || !apiKey || !methodId) return;

	const controller = new AbortController();
	const timeout = window.setTimeout(() => controller.abort(), 8000);
	let outcome: "success" | "rejected" | "account_not_found" | "rate_limited" | "hevy_error" | "timeout" | "network_error" = "network_error";
	track({ name: "key_check_started", data: { method_id: methodId } });
	keyCheck.dataset.state = "checking";
	form.setAttribute("aria-busy", "true");
	button.disabled = true;
	button.textContent = "Checking…";
	status.textContent = "Checking this key directly with Hevy…";

	try {
		const response = await fetch(HEVY_USER_INFO_URL, {
			cache: "no-store",
			credentials: "omit",
			headers: { "api-key": apiKey },
			referrerPolicy: "no-referrer",
			signal: controller.signal,
		});

		if (response.ok) {
			const payload = (await response.json()) as HevyUserInfoResponse;
			const accountName = payload.data?.name?.trim();
			outcome = "success";
			keyCheck.dataset.state = "success";
			status.textContent = accountName
				? `Key confirmed. Connected to Hevy as ${accountName}.`
				: "Key confirmed. Hevy accepted this account connection.";
		} else {
			outcome = keyCheckOutcomeFor(response.status);
			keyCheck.dataset.state = "error";
			if (outcome === "rejected") {
				status.textContent =
					"Hevy rejected this key. Create a fresh key in Hevy API settings and confirm that the account has PRO access.";
			} else if (outcome === "account_not_found") {
				status.textContent =
					"The key was accepted, but Hevy could not find its account. Create a new key and try again.";
			} else if (outcome === "rate_limited") {
				status.textContent = "Hevy is receiving too many checks right now. Wait a minute, then try again.";
			} else {
				status.textContent = "Hevy could not check this key right now. Keep the key private and try again shortly.";
			}
		}
	} catch (error) {
		keyCheck.dataset.state = "error";
		if (error instanceof DOMException && error.name === "AbortError") {
			outcome = "timeout";
			status.textContent = "The check took too long. Hevy may be temporarily unavailable; try again shortly.";
		} else {
			outcome = "network_error";
			status.textContent =
				"Your browser could not reach Hevy. Check your connection, disable request-blocking extensions for this page, and try again.";
		}
	} finally {
		window.clearTimeout(timeout);
		form.setAttribute("aria-busy", "false");
		button.disabled = false;
		button.textContent = "Check again";
		track({ name: "key_check_completed", data: { method_id: methodId, outcome } });
	}
};

const bindSetupActions = () => {
	if (document.documentElement.dataset.setupActionsBound === "true") return;
	document.documentElement.dataset.setupActionsBound = "true";

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const copyButton = target.closest<HTMLButtonElement>("[data-copy-button]");
		if (copyButton) {
			void copyFrom(copyButton);
			return;
		}

		const setupCta = target.closest<HTMLAnchorElement>("[data-setup-cta]");
		if (setupCta) {
			const methodId = getTransportId(setupCta.dataset.methodId);
			const placement = setupCta.dataset.placement as "header" | "hero" | "capabilities" | "demo" | "final" | "mobile" | undefined;
			if (methodId && placement) track({ name: "setup_cta_clicked", data: { placement, method_id: methodId as "oauth" | "stdio" } });
			return;
		}

		const transportChoice = target.closest<HTMLAnchorElement>("[data-transport-choice]");
		if (transportChoice) {
			const methodId = getTransportId(transportChoice.dataset.methodId);
			if (methodId) track({ name: "transport_selected", data: { method_id: methodId } });
			return;
		}

		const clientGuide = target.closest<HTMLAnchorElement>("[data-client-guide]");
		if (clientGuide) {
			const clientId = clientGuide.dataset.clientId as ClientGuideSlug | undefined;
			const methodId = getTransportId(clientGuide.dataset.methodId);
			if (clientId) {
				track({ name: "client_guide_opened", data: methodId ? { client_id: clientId, method_id: methodId } : { client_id: clientId } });
			}
			return;
		}

		const settingsLink = target.closest<HTMLAnchorElement>("[data-api-key-settings]");
		if (settingsLink) {
			const methodId = getTransportId(settingsLink.dataset.methodId);
			if (methodId) track({ name: "hevy_api_settings_opened", data: { method_id: methodId } });
			return;
		}

		if (target.closest("[data-demo-link]")) {
			track({ name: "demo_link_clicked", data: {} });
			return;
		}

		const githubLink = target.closest<HTMLAnchorElement>("[data-github-link]");
		if (githubLink) {
			const placement = githubLink.dataset.placement as "header" | "hero" | "footer" | "docs" | undefined;
			if (placement) track({ name: "github_clicked", data: { placement } });
		}
	});

	document.addEventListener("submit", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLFormElement) || !target.matches("[data-key-check-form]")) return;
		event.preventDefault();
		void checkKey(target);
	});

	window.addEventListener("pagehide", () => {
		document.querySelectorAll<HTMLInputElement>('[data-key-check-form] input[name="hevy-api-key"]').forEach((input) => {
			input.value = "";
		});
	});

	const setupSection = document.querySelector<HTMLElement>("[data-setup-section]");
	if (setupSection) {
		let reached = false;
		const markReached = () => {
			if (reached) return;
			reached = true;
			track({ name: "setup_section_reached", data: {} });
		};
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver((entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					markReached();
					observer.disconnect();
				}
			});
			observer.observe(setupSection);
		} else {
			markReached();
		}
	}
};

export const initializeSetupActions = bindSetupActions;

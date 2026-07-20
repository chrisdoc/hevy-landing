import { bindTabs } from "./tabs";

interface HevyUserInfoResponse {
	data?: {
		name?: string;
	};
}

const HEVY_USER_INFO_URL = "https://api.hevyapp.com/v1/user/info";

const selectCopyTarget = (button: HTMLButtonElement) => {
	const copySurface = button.closest(".client-panel, .setup-panel__finish");
	const target = copySurface?.querySelector<HTMLElement>("[data-copy-target]");
	if (!target) return false;

	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(target);
	selection?.removeAllRanges();
	selection?.addRange(range);
	target.focus();
	return true;
};

const copyStatusFor = (button: HTMLButtonElement) =>
	button
		.closest(".client-panel, .setup-panel__finish")
		?.querySelector<HTMLElement>("[data-copy-status]");

const bindCopyButtons = (setup: HTMLElement) => {
	setup.querySelectorAll<HTMLButtonElement>("[data-copy-button]").forEach((button) => {
		button.addEventListener("click", async () => {
			const label = button.querySelector<HTMLElement>("[data-copy-label]");
			const status = copyStatusFor(button);
			const defaultLabel = label?.textContent ?? "Copy";
			const copyValue = button.dataset.copyValue ?? "";
			const isPrompt = Boolean(button.closest(".setup-panel__finish"));
			try {
				await navigator.clipboard.writeText(copyValue);
				if (label) label.textContent = "Copied";
				if (status) {
					status.textContent = isPrompt
						? "Question copied. Paste it into your assistant after reconnecting."
						: copyValue.includes("your-hevy-api-key")
							? "Configuration copied. Replace the API-key placeholder before saving."
							: "Connection URL copied. Paste it into your client settings.";
				}
			} catch {
				const selected = selectCopyTarget(button);
				if (label) label.textContent = selected ? "Selected" : "Copy unavailable";
				if (status) {
					const selectedContent = isPrompt ? "question" : "configuration";
					status.textContent = selected
						? `Clipboard access is blocked. The ${selectedContent} is selected; press Ctrl+C or Command+C to copy it.`
						: `Clipboard access is blocked. Select the ${selectedContent} and copy it manually.`;
				}
			} finally {
				window.setTimeout(() => {
					if (label) label.textContent = defaultLabel;
				}, 1600);
			}
		});
	});
};

const bindKeyChecks = (setup: HTMLElement) => {
	setup.querySelectorAll<HTMLFormElement>("[data-key-check-form]").forEach((form) => {
		form.addEventListener("submit", async (event) => {
			event.preventDefault();
			const keyCheck = form.closest("[data-key-check]") as HTMLElement | null;
			const input = form.querySelector<HTMLInputElement>('input[name="hevy-api-key"]');
			const button = form.querySelector<HTMLButtonElement>("[data-key-check-button]");
			const status = keyCheck?.querySelector<HTMLElement>("[data-key-check-status]");
			const apiKey = input?.value.trim();
			if (!keyCheck || !input || !button || !status || !apiKey) return;

			const controller = new AbortController();
			const timeout = window.setTimeout(() => controller.abort(), 8000);
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
					keyCheck.dataset.state = "success";
					status.textContent = accountName
						? `Key confirmed. Connected to Hevy as ${accountName}.`
						: "Key confirmed. Hevy accepted this account connection.";
					return;
				}

				keyCheck.dataset.state = "error";
				if (response.status === 401 || response.status === 403) {
					status.textContent =
						"Hevy rejected this key. Create a fresh key in Hevy API settings and confirm that the account has PRO access.";
				} else if (response.status === 404) {
					status.textContent =
						"The key was accepted, but Hevy could not find its account. Create a new key and try again.";
				} else if (response.status === 429) {
					status.textContent =
						"Hevy is receiving too many checks right now. Wait a minute, then try again.";
				} else {
					status.textContent =
						"Hevy could not check this key right now. Keep the key private and try again shortly.";
				}
			} catch (error) {
				keyCheck.dataset.state = "error";
				status.textContent =
					error instanceof DOMException && error.name === "AbortError"
						? "The check took too long. Hevy may be temporarily unavailable; try again shortly."
						: "Your browser could not reach Hevy. Check your connection, disable request-blocking extensions for this page, and try again.";
			} finally {
				window.clearTimeout(timeout);
				form.setAttribute("aria-busy", "false");
				button.disabled = false;
				button.textContent = "Check again";
			}
		});
	});
};

export const initializeSetupGuide = () => {
	const setup = document.querySelector<HTMLElement>("[data-setup]");
	if (!setup) return;

	const transportController = bindTabs({
		root: setup,
		tabSelector: "[data-transport-tab]",
		panelSelector: "[data-transport-panel]",
		tabId: (tab) => tab.dataset.transportTab,
		panelId: (panel) => panel.dataset.transportPanel,
		initialId: "oauth",
	});

	document.querySelectorAll<HTMLAnchorElement>("[data-setup-mode]").forEach((link) => {
		link.addEventListener("click", () => {
			const mode = link.dataset.setupMode;
			if (mode) transportController.activate(mode);
		});
	});

	setup.querySelectorAll<HTMLElement>("[data-client-tabs]").forEach((group) => {
		bindTabs({
			root: group,
			tabSelector: "[data-client-tab]",
			panelSelector: "[data-client-panel]",
			tabId: (tab) => tab.dataset.clientTab,
			panelId: (panel) => panel.dataset.clientPanel,
		});
	});

	bindCopyButtons(setup);
	bindKeyChecks(setup);

	window.addEventListener("pagehide", () => {
		setup.querySelectorAll<HTMLInputElement>('input[name="hevy-api-key"]').forEach((input) => {
			input.value = "";
		});
	});

	setup.dataset.enhanced = "true";
};

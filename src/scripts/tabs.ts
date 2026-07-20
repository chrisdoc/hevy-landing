interface TabControllerOptions {
	root: ParentNode;
	tabSelector: string;
	panelSelector: string;
	tabId: (tab: HTMLButtonElement) => string | undefined;
	panelId: (panel: HTMLElement) => string | undefined;
	initialId?: string;
}

export const bindTabs = ({
	root,
	tabSelector,
	panelSelector,
	tabId,
	panelId,
	initialId,
}: TabControllerOptions) => {
	const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(tabSelector));
	const panels = Array.from(root.querySelectorAll<HTMLElement>(panelSelector));

	const activate = (id: string) => {
		tabs.forEach((tab) => {
			const active = tabId(tab) === id;
			tab.setAttribute("aria-selected", String(active));
			tab.tabIndex = active ? 0 : -1;
		});
		panels.forEach((panel) => {
			panel.hidden = panelId(panel) !== id;
		});
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			const id = tabId(tab);
			if (id) activate(id);
		});
		tab.addEventListener("keydown", (event) => {
			let nextIndex = index;
			if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
			if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
			if (event.key === "Home") nextIndex = 0;
			if (event.key === "End") nextIndex = tabs.length - 1;
			if (nextIndex === index) return;
			event.preventDefault();
			const nextTab = tabs[nextIndex];
			const id = nextTab ? tabId(nextTab) : undefined;
			if (!nextTab || !id) return;
			activate(id);
			nextTab.focus();
		});
	});

	const selectedId = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
	const firstId = tabs[0] ? tabId(tabs[0]) : undefined;
	const activeId = initialId ?? (selectedId ? tabId(selectedId) : undefined) ?? firstId;
	if (activeId) activate(activeId);

	return { activate };
};

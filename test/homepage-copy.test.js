import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

test("repeated copy clicks restore the original button label", async () => {
	const timers = new Map();
	let nextTimer = 0;
	let copy;
	const button = {
		dataset: { copy: "payload" },
		textContent: "Copy",
		addEventListener(_type, handler) {
			copy = handler;
		},
	};
	const targets = new Map([
		["payload", { textContent: "workout data" }],
		["copy-status", { textContent: "" }],
	]);
	const document = {
		querySelectorAll(selector) {
			return selector === '[role="tab"]' ? [] : [button];
		},
		getElementById: (id) => targets.get(id),
		querySelector: () => ({ hidden: true }),
		documentElement: { classList: { add() {} } },
	};
	const script = await readFile(new URL("../src/scripts/homepage.js", import.meta.url), "utf8");

	runInNewContext(script, {
		document,
		navigator: { clipboard: { writeText: async () => {} } },
		clearTimeout: (id) => timers.delete(id),
		setTimeout: (callback) => {
			const id = ++nextTimer;
			timers.set(id, callback);
			return id;
		},
		window: {},
	});

	await copy();
	const previousTimer = [...timers.keys()][0];
	await copy();

	assert.equal(button.textContent, "Copied!");
	assert.equal(timers.has(previousTimer), false);
	for (const callback of timers.values()) callback();
	assert.equal(button.textContent, "Copy");
});

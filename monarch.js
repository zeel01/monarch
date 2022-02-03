import Monarch from "./scripts/Monarch.js";
import { Controls, Badges, AppControls } from "./scripts/Components.js";


Hooks.on("init", Monarch.onInit.bind(Monarch));

Hooks.on("ready", Monarch.onReady.bind(Monarch));

window.Monarch = Monarch;

Hooks.on("devModeReady", async () => {
	// Set up dev mode module support
	const api = game.modules.get("_dev-mode")?.api;

	await api.registerPackageDebugFlag(Monarch.name, "level", { default: 1 });

	Hooks.on("getMonarchApplicationComponents", (app, components) => {
		// If the dev mode debug level is above zero, include the debug controls
		if (Monarch.debugLevel) components.controls.push({
			class: "debug-controls",
			controls: [
				Controls.consoleLog
			]
		});
	});
});
import Monarch from "./scripts/Monarch.js";
import { Controls, Badges, AppControls } from "./scripts/Components.js";


Hooks.on("init", Monarch.onInit.bind(Monarch));

Hooks.on("ready", Monarch.onReady.bind(Monarch));

window.Monarch = Monarch;

Hooks.on("getMonarchHandComponents", (monarch, components) => {
	if (Monarch.discardPile) 
		components.controls.find(c => c.class === "basic-controls")?.controls?.push(Controls.discard);
});

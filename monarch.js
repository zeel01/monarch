import * as utils from "./scripts/utils.js";
import Monarch from "./scripts/Monarch.js";
import MonarchCard from "./scripts/MonarchCard.js";
import MonarchHand from "./scripts/MonarchHand.js";
import MonarchDeck from "./scripts/MonarchDeck.js";
import MonarchPile from "./scripts/MonarchPile.js";
import { Controls, Badges } from "./scripts/Components.js";

Hooks.on("init", () => {
	game.settings.register(Monarch.name, "cardHeight", {
		name: game.i18n.localize("monarch.settings.cardHeight.name"),
		hint: game.i18n.localize("monarch.settings.cardHeight.hint"),
		scope: "world",
		config: true,
		type: Number,
		default: 200,
		onChange: () => {
			Object.values(ui.windows)
				.filter(w => w.isMonarch)
				.forEach(w => w.render(true));
		}
	});

	game.settings.register(Monarch.name, "discardPile", {
		name: game.i18n.localize("monarch.settings.discardPile.name"),
		hint: game.i18n.localize("monarch.settings.discardPile.hint"),
		scope: "world",
		config: true,
		type: String,
		default: "",
		onChange: () => {}
	});

	DocumentSheetConfig
		.registerSheet(Cards, Monarch.name, MonarchHand, {
			label: game.i18n.localize("monarch.sheetTitle.myHand"),
			types: ["hand"]
		})

	DocumentSheetConfig
		.registerSheet(Cards, Monarch.name, MonarchDeck, {
			label: game.i18n.localize("monarch.sheetTitle.deck"),
			types: ["deck"]
		})

	DocumentSheetConfig
		.registerSheet(Cards, Monarch.name, MonarchPile, {
			label: game.i18n.localize("monarch.sheetTitle.pile"),
			types: ["pile"]
		})

	DocumentSheetConfig
		.registerSheet(Card, Monarch.name, MonarchCard, {
			label: game.i18n.localize("monarch.sheetTitle.card")
		})
});

Hooks.on("ready", async () => {
	await utils.preLoadTemplates();
	utils.restoreWindows();
	console.log(game.i18n.localize("monarch.console.log.ready"));
});

Hooks.on("getMonarchHandComponents", (monarch, components) => {
	if (Monarch.discardPile) 
		components.controls.find(c => c.class === "basic-controls")?.controls?.push(Controls.discard);
});
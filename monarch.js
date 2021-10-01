import * as utils from "./scripts/utils.js";
import MonarchCard from "./scripts/MonarchCard.js";
import MonarchHand from "./scripts/MonarchHand.js";

Hooks.on("ready", () => {
	console.log(game.i18n.localize("monarch.console.log.ready"));

	DocumentSheetConfig
		.registerSheet(Cards, "monarch", MonarchHand, {
			label: game.i18n.localize("monarch.sheetTitle.myHand"),
			types: ["hand"]
		})

	DocumentSheetConfig
		.registerSheet(Card, "monarch", MonarchCard, {
			label: game.i18n.localize("monarch.sheetTitle.card"),
			types: ["base"]
		})

	utils.restoreWindows();
});
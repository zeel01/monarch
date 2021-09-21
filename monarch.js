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

	// For testing, open the test hand sheet
	game.cards.get("JZ9wbWp8U2aA6Nh4").sheet.render(true);
});
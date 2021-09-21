import MonarchHand from "scripts/hand.js";

Hooks.on("ready", () => {
	console.log(game.i18n.localize("monarch.console.log.ready"));

	DocumentSheetConfig
		.registerSheet(Cards, "monarch", MonarchHand, {
			label: game.i18n.localize("monarch.title"),
			types: ["hand"]
		})

	// For testing, open the test hand sheet
	game.cards.get("JZ9wbWp8U2aA6Nh4").sheet.render(true);
});
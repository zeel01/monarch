import * as utils from "./scripts/utils.js";
import MonarchCard from "./scripts/MonarchCard.js";
import MonarchHand from "./scripts/MonarchHand.js";
import MonarchDeck from "./scripts/MonarchDeck.js";
import MonarchPile from "./scripts/MonarchPile.js";

Hooks.on("init", () => {
	game.settings.register("monarch", "cardHeight", {
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

	DocumentSheetConfig
		.registerSheet(Cards, "monarch", MonarchHand, {
			label: game.i18n.localize("monarch.sheetTitle.myHand"),
			types: ["hand"]
		})

	DocumentSheetConfig
		.registerSheet(Cards, "monarch", MonarchDeck, {
			label: game.i18n.localize("monarch.sheetTitle.deck"),
			types: ["deck"]
		})

	DocumentSheetConfig
		.registerSheet(Cards, "monarch", MonarchPile, {
			label: game.i18n.localize("monarch.sheetTitle.pile"),
			types: ["pile"]
		})

	DocumentSheetConfig
		.registerSheet(Card, "monarch", MonarchCard, {
			label: game.i18n.localize("monarch.sheetTitle.card")
		})
});

Hooks.on("ready", () => {
	console.log(game.i18n.localize("monarch.console.log.ready"));

	utils.restoreWindows();
});

/**
 * A proof of concept for dropping cards onto the canvas as tiles.
 *//*
Hooks.on("dropCanvasData", async (canvas, data) => {
	if (data.type !== "Card") return;

	const pile = game.cards.get(data.cardsId);
	const card = pile.data.cards.get(data.cardId);
	const dims = await utils.getImageDimensions(card.img);

	const height = game.settings.get("monarch", "cardHeight");
	dims.width  = dims.width * (height / dims.height);;
	dims.height = height;
	
	const x = data.x - (dims.width / 2);
	const y = data.y - (dims.height / 2);

	await canvas.scene.createEmbeddedDocuments("Tile", [
		{
			img: card.img,
			x, y, ...dims
		}
	]);

	console.log(data, card);
});
*/
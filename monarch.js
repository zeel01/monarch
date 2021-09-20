Hooks.on("ready", () => {
	console.log(game.i18n.localize("monarch.console.log.ready"));

	DocumentSheetConfig
	.registerSheet(Cards, "monarch", MonarchHand, {
		label: game.i18n.localize("monarch.title"),
		types: ["hand"]
	})

	game.cards.get("JZ9wbWp8U2aA6Nh4").sheet.render(true);
});

class MonarchHand extends CardsHand {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/cards-hand.hbs",
			classes: ["monarch-hand", "sheet"],
			width: 600,
			resizable: true
		})
	}

	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];

		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("click", (event) => {
				event.stopPropagation();
				const cardDocumwnt = this.object.cards.get(card.dataset.cardId);
				//cardDocumwnt.sheet.render(true);
				new ImagePopout(cardDocumwnt.img, {
					title: cardDocumwnt.data.name,
					uuid: cardDocumwnt.data.uuid,
					sharable: true,
					editable: false
				}).render(true);
			});
		});
	}
}
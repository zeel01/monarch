import * as utils from "./utils.js";

export default class MonarchHand extends CardsHand {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-hand.hbs",
			classes: ["monarch", "monarch-hand", "sheet"],
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
				const cardDocument = this.object.cards.get(card.dataset.cardId);
				cardDocument.sheet.render(true);

				/*new ImagePopout(cardDocumwnt.img, {
					title: cardDocumwnt.data.name,
					uuid: cardDocumwnt.data.uuid,
					sharable: true,
					editable: false
				}).render(true);*/
			});
		});
	}

	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		buttons.unshift({
			class: "drag",
			icon: "fas fa-grip-horizontal",
			onclick: () => null
		});

		return buttons;
	}

	setPosition(...args) {
		const position = super.setPosition(...args);
		utils.storeWindowPosition(this.object.uuid, position);
		return position;
	}

	async close(...args) {
		utils.removePositon(this.object.uuid);
		return await super.close(args);
	}
}
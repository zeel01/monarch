import MonarchCardsConfig from "./MonarchCardsConfig.js";

/**
 * @typedef {import("./MonarchApplicationMixin.js").CardControl} CardControl
 * @typedef {import("./MonarchApplicationMixin.js").CardBadge} CardBadge
 */

export default class MonarchDeck extends MonarchCardsConfig {
	static appName = "Deck";
	
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-deck.hbs",
			classes: ["monarch", "monarch-deck", "sheet"],
			dragDrop: [{ dragSelector: "ol.cards li.card", dropSelector: "ol.cards" }],
			width: 660,
			height: "auto",
			resizable: true
		})
	}

	/** @type {Array<CardControl>} */
	get controls() {
		return [
			...super.controls,
			{
				class: "basic-controls",
				controls: [
					{
						tooltip: "CARD.Edit",
						icon: "fas fa-edit",
						class: "edit-card",
						onclick: (event, card) => card.sheet.render(true)
					},
					{
						tooltip: "CARD.Delete",
						icon: "fas fa-trash",
						class: "delete-card",
						onclick: (event, card) => card.deleteDialog()
					}
				]
			}
		];
	}

	/** @type {Array<CardBadge>} */
	get badges() {
		return [
			...super.badges,
			{
				tooltip: "CARD.Drawn",
				text: game.i18n.localize("CARD.Drawn"),
				hide: (card) => !card.data.drawn,
				class: "card-drawn"
			}
		];
	}
}
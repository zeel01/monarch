import MonarchCardsConfig from "./MonarchCardsConfig.js";

/**
 * @typedef {import("./MonarchApplicationMixin.js").CardControl} CardControl
 * @typedef {import("./MonarchApplicationMixin.js").CardBadge} CardBadge
 */

export default class MonarchPile extends MonarchCardsConfig {
	static appName = "Pile";
	
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-pile.hbs",
			classes: ["monarch", "monarch-pile", "sheet"],
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
						tooltip: "CARD.Play",
						aria: (card) => game.i18n.format("monarch.aria.playCard", { name: card.name }),
						icon: "fas fa-chevron-circle-right",
						class: "play-card",
						onclick: (event, card) => this.object.playDialog(card)
					}
				]
			}
		];
	}
}
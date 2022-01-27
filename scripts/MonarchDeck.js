import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, Badges } from "./Controls.js";

/**
 * @typedef {import("./Controls.js").CardControl} CardControl
 * @typedef {import("./Controls.js").CardBadge} CardBadge
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
					Controls.edit,
					Controls.delete,
				]
			}
		];
	}

	/** @type {Array<CardBadge>} */
	get badges() {
		return [
			Badges.name,
			...super.badges,
			Badges.drawn
		];
	}
}
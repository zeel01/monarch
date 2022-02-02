import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, Badges } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 */

export default class MonarchPile extends MonarchCardsConfig {
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
					Controls.play
				]
			}
		];
	}
}
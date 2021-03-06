import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, Badges, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
 */

export default class MonarchDeck extends MonarchCardsConfig {
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

	/** @type {Array<AppControl>} */
	get appControls() {
		return [
			AppControls.shuffle,
			AppControls.deal,
			AppControls.reset
		]
	}

	/**
	 * Optional CSS classes based on settings.
	 * @type {Object<string, boolean>}
	 */
	get classOptions() {
		return {
			"trans": Monarch.settings.transparentDeck,
			"no-fade": !Monarch.settings.fadeDeck
		};
	}
}
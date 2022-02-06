import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
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

	/** @type {Array<AppControl>} */
	get appControls() {
		return [
			AppControls.shuffle,
			AppControls.pass,
			AppControls.reset
		]
	}

	/**
	 * Optional CSS classes based on settings.
	 * @type {Object<string, boolean>}
	 */
	get classOptions() {
		return {
			"trans": Monarch.settings.transparentPile,
			"no-fade": !Monarch.settings.fadePile
		};
	}
}
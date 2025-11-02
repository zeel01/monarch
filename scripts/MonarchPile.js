import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
 */

export default class MonarchPile extends MonarchCardsConfig {
	static DEFAULT_OPTIONS = {
		form: {
			submitOnClose: true
		},
		position: {
			width: 660,
			height: "auto",
		},
		window: {
			icon: "fa-solid fa-cards"
		},
		classes: ["monarch", "monarch-pile", "sheet"],
		dragDrop: [{ dragSelector: "ol.cards li.card", dropSelector: "ol.cards" }],
		resizable: true
	}

	static PARTS = {
		cards: {
			template: "modules/monarch/templates/pile/pile.hbs",
			root: true,
			scrollable: ["ol[data-cards]"]
		},
		footer: { template: "modules/monarch/templates/parts/footer.hbs" }
	};

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
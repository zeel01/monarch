import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, Badges, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
 */

export default class MonarchDeck extends MonarchCardsConfig {
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
		classes: ["monarch", "monarch-deck", "sheet"],
		dragDrop: [{ dragSelector: "ol.cards li.card", dropSelector: "ol.cards" }],
		resizable: true
	}

	static PARTS = {
		header: { template: "templates/cards/deck/header.hbs" },
		tabs: { template: "templates/generic/tab-navigation.hbs" },
		details: { template: "templates/cards/deck/details.hbs" },
		cards: { template: "modules/monarch/templates/deck/cards.hbs", scrollable: ["ol[data-cards]"] },
		footer: { template: "templates/generic/form-footer.hbs" }
	};

	static TABS = {
		primary: {
			tabs: [
				{ id: "details", icon: "fa-solid fa-gears" },
				{ id: "cards", icon: "fa-solid fa-id-badge" }
			],
			initial: "cards",
			labelPrefix: "CARDS.TABS"
		}
	};

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
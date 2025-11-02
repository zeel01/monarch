import Monarch from "./Monarch.js";
import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
 */

export default class MonarchHand extends MonarchCardsConfig {
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
		classes: ["monarch", "monarch-hand", "sheet"],
		dragDrop: [{ dragSelector: "ol.cards li.card", dropSelector: "ol.cards" }],
		resizable: true
	}

	static PARTS = {
		cards: {
			template: "modules/monarch/templates/hand/hand.hbs",
			root: true,
			scrollable: ["ol[data-cards]"]
		},
		footer: { template: "modules/monarch/templates/hand/hand-footer.hbs" }
	};

	/**
	 * Action to perform when a card is clicked.
	 *
	 * @param {PointerEvent}    event - The click event
	 * @param {FormApplication} app   - The application object
	 * @param {Card}            card  - The card object
	 * @memberof MonarchHand
	 */
	_cardClickAction(event, app, card) {
		card.sheet.render(true);
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

	/** @override Stop event propogation after a button is clicked */
	async _onCardControl(event) {
		event.stopPropagation();
		return await super._onCardControl(event);
	}

	/** 
	 * Optional CSS classes based on settings.
	 * @type {Object<string, boolean>}
	 */
	get classOptions() {
		return {
			"trans": Monarch.settings.transparentHand,
			"no-fade": !Monarch.settings.fadeHand
		};
	}
	
	/**
	 * Add a class to the target element when a drag event enters it.
	 *
	 * @param {Event} event - The triggered drag event
	 * @memberof MonarchHand
	 */
	_onDragEnter(event) {
		const target = event.currentTarget;
		target.classList.add("drag-over");
	}

	/**
	 * Remove a class from the target element when a drag event leaves it.
	 *
	 * @param {Event} event - The triggered drag event
	 * @memberof MonarchHand
	 */
	_onDragLeave(event) {
		const target = event.currentTarget;
		target.classList.remove("drag-over");
	}

	/** @type {Array<CardControl>} */
	get controls() {
		return [
			...super.controls,
			{
				class: "basic-controls",
				controls: [
					Controls.play,
					...(Monarch.settings.discardPile ? [Controls.discard] : [])
				]
			}
		];
	}

	/** @type {Array<AppControl>} */
	get appControls() {
		return [
			AppControls.draw,
			AppControls.pass,
			...(Monarch.settings.handReset ? [AppControls.reset] : [])
		]
	}
}
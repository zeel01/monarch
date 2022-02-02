import MonarchCardsConfig from "./MonarchCardsConfig.js";
import { Controls, AppControls } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").AppControl} AppControl
 */

export default class MonarchHand extends MonarchCardsConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-hand.hbs",
			classes: ["monarch", "monarch-hand", "sheet"],
			dragDrop: [{ dragSelector: "ol.cards div.card", dropSelector: "ol.cards" }],
			width: 600,
			resizable: true
		})
	}

	/**
	 * Attach event handlers to the application.
	 *
	 * @param {HTMLElement} html - The element representing the application window
	 * @memberof MonarchCardsConfig
	 */
	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];

		// Clicking the card will open its sheet
		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("click", event => this._onClickCard(event, card));
		});
	}

	/**
	 * Handles click events on the card.
	 *
	 * @param {MouseEvent}  event - The click event
	 * @param {HTMLElement} card  - The element representing the card
	 * @memberof MonarchHand
	 */
	_onClickCard(event, card) {
		event.stopPropagation();
		const cardDocument = this.object.cards.get(card.dataset.cardId);
		cardDocument.sheet.render(true);
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
					Controls.play
				]
			}
		];
	}

	/** @type {Array<AppControl>} */
	get appControls() {
		return [
			AppControls.draw,
			AppControls.pass
		]
	}
}
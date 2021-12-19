import MonarchApplicationMixin from "./MonarchApplicationMixin.js";
import { getImageDimensions } from "./utils.js";

export default class MonarchHand extends MonarchApplicationMixin(CardsHand) {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-hand.hbs",
			classes: ["monarch", "monarch-hand", "sheet"],
			dragDrop: [{ dragSelector: "ol.cards div.card", dropSelector: "ol.cards" }],
			width: 600,
			resizable: true
		})
	}

	async getData(options) {
		const data = super.getData(options);

		await Promise.all(data.cards.map(this._calcCardDimensions.bind(this)));
		data.cardHeight = this.cardHeight;

		console.log(data);
		return data;
	}

	/** @type {number} The height of all cards in the hand */
	get cardHeight() { return 200; }


	/**
	 * Calculate the visual dimensions of a card, storing that
	 * data in the card object.
	 *
	 * If the card has an explicit width and height, these will be
	 * used in the calculation. Otherwise, the dimensions will be
	 * obtained from the image.
	 *
	 * The height will be set to a fixed value, and the width will
	 * be calculated to maintain the aspect ratio of the image.
	 *
	 * @param {object} card - The card data object
	 * @memberof MonarchHand
	 */
	async _calcCardDimensions(card) {
		let width  = card.data.width  ?? 0;
		let height = card.data.height ?? 0;

		if (!width || !height) {
			if (!card.img) width = height = this.cardHeight;
			else ({ width, height } = await getImageDimensions(card.img));
		}

		card.height = this.cardHeight;
		card.width = width * (this.cardHeight / height);
	}

	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];

		// Clicking the card will open its sheet
		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("click", (event) => {
				event.stopPropagation();
				const cardDocument = this.object.cards.get(card.dataset.cardId);
				cardDocument.sheet.render(true);
			});
		});

		// Handle drag and drop events
		html.querySelectorAll(".card-wrapper").forEach(wrap => {
			wrap.addEventListener("dragenter", this._onDragEnter.bind(this));
			wrap.addEventListener("dragleave", this._onDragLeave.bind(this));
		});
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
}
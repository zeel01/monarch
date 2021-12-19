import MonarchApplicationMixin from "./MonarchApplicationMixin.js";

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
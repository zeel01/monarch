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

	get cardHeight() { return 200; }

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

		html.querySelectorAll(".card").forEach(card => {
			card.addEventListener("click", (event) => {
				event.stopPropagation();
				const cardDocument = this.object.cards.get(card.dataset.cardId);
				cardDocument.sheet.render(true);
			});
		});

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

	async _onCardControl(event) {
		event.stopPropagation();
		return await super._onCardControl(event);
	}

	_onDragEnter(event) {
		const target = event.currentTarget;
		target.classList.add("drag-over");
	}
	_onDragLeave(event) {
		const target = event.currentTarget;
		target.classList.remove("drag-over");
	}
}
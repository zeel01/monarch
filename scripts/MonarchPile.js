import MonarchApplicationMixin from "./MonarchApplicationMixin.js";

export default class MonarchPile extends MonarchApplicationMixin(CardsConfig) {
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

	async getData(options) {
		const data = super.getData(options);

		await Promise.all(data.cards.map(this._calcCardDimensions.bind(this)));
		data.cardHeight = this.cardHeight;

		data.cardWidth = Math.max(...data.cards.map(card => card.width));

		return data;
	}
}
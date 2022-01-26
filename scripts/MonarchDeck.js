import MonarchCardsConfig from "./MonarchCardsConfig.js";

export default class MonarchDeck extends MonarchCardsConfig {
	static appName = "Deck";
	
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
}
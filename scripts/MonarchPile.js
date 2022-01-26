import MonarchCardsConfig from "./MonarchCardsConfig.js";

export default class MonarchPile extends MonarchCardsConfig {
	static appName = "Pile";
	
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
}
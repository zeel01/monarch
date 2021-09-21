export default class MonarchCard extends CardConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-card.hbs",
			classes: ["monarch", "monarch-card", "sheet"],
			//width: 600,
			resizable: true
		})
	}
}
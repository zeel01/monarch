export default class MonarchCard extends CardConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-card.hbs",
			classes: ["monarch", "monarch-card", "sheet"],
			width: 600,
			height: "auto",
			resizable: true
		})
	}

	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];

		html.querySelector(".card-display").addEventListener("click", (event) => {
			event.stopPropagation();
			const cardDocumwnt = this.object;

			new ImagePopout(cardDocumwnt.img, {
				title: cardDocumwnt.data.name,
				uuid: cardDocumwnt.data.uuid,
				sharable: true,
				editable: false
			}).render(true);
		});
	}
}
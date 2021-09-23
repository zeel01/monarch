export default class MonarchCard extends CardConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-card.hbs",
			classes: ["monarch", "monarch-card", "sheet"],
			width: 300,
			height: "auto",
			resizable: true,
			closeOnSubmit: false,
			submitOnClose: true,
		})
	}

	activateListeners(html) {
		super.activateListeners(html);
		
		new Draggable(this, html, 
			html.find(".card-display")[0], 
			false
		);
		
		html = html[0];


		html.querySelector(".card-display .magnify").addEventListener("click", (event) => {
			event.stopPropagation();
			const cardDocument = this.object;

			new ImagePopout(cardDocument.img, {
				title: cardDocument.data.name,
				uuid: cardDocument.data.uuid,
				sharable: true,
				editable: false
			}).render(true);
		});

		html.querySelectorAll(".config-button").forEach(button => {
			button.addEventListener("click", (event) => {
				event.stopPropagation();
				const element = event.currentTarget;
				const configRef = element.dataset.config;
		
				let configApp = null;

				switch (configRef) {
					case "faces": 
						configApp = new MonarchFaceConfig(this.object);
						break;
					case "back": 
						configApp = new MonarchBackConfig(this.object);
						break;
				}
				
				configApp.render(true);
			});
		});
	}

	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();

		// TODO: Needs an ownership check
		buttons.unshift({
			class: "save",
			icon: "fas fa-save",
			onclick: this._onSubmit.bind(this)
		});

		return buttons;
	}

	constructor(...args) {
		super(...args);

		this._getSubmitData = DocumentSheet.prototype._getSubmitData.bind(this);
	}
}

class MonarchCardConfigDialog extends CardConfig {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			width: 400,
			classes: ["monarch-face", "sheet"],
		})
	}
}
class MonarchFaceConfig extends MonarchCardConfigDialog {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			id: "monarch-face-config",
			template: "modules/monarch/templates/monarch-face.hbs"
		})
	}

	constructor(...args) {
		super(...args);

		this._getSubmitData = CardConfig.prototype._getSubmitData.bind(this);
	}
}

class MonarchBackConfig extends MonarchCardConfigDialog {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			id: "monarch-back-config",
			template: "modules/monarch/templates/monarch-back.hbs"
		})
	}
}
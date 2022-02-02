import MonarchApplicationMixin from "./MonarchApplicationMixin.js";
import { Controls, Badges } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 */

export default class MonarchCard extends MonarchApplicationMixin(CardConfig) {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			template: "modules/monarch/templates/monarch-card.hbs",
			classes: ["monarch", "monarch-card", "sheet"],
			width: 250,
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

			const popout = new ImagePopout(cardDocument.img, {
				title: cardDocument.data.name,
				uuid: cardDocument.data.uuid,
				shareable: true,
				editable: true
			}).render(true);

			if (event.shiftKey) popout.shareImage();
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

		html.querySelectorAll(".card-control").forEach(button => {
			button.addEventListener("click", (event) => {
				event.stopPropagation();
				if (button.disabled) return;
				button.classList.forEach(className => {
					if (this._controlFns[className])
						this._controlFns[className](event, this.object, this.object.parent);
				});
			});
		});

		html.addEventListener("contextmenu", event => {
			this.form.classList.remove("show-ctx");
			event.stopPropagation();
			event.preventDefault();
			this.form.classList.add("show-ctx");
			const menu = this.form.querySelector(".context-menu");
			menu.style.left = `${event.clientX}px`;
			menu.style.top = `${event.clientY}px`;
		});
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

	/** @override */
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

	async getData() {
		const data = await super.getData();

		this.applyComponents(data);

		return data;
	}

	applyComponents(data) {
		data.data.controls = this.applyCardControls(this.object, data.controls, this.object.parent);
		data.data.contextMenu = this.applyCardControls(this.object, data.contextMenu, this.object.parent);
		data.data.badges = this.applyCardBadges(this.object, data.badges, this.object.parent);
		data.data.markers = this.applyCardMarkers(this.object, data.markers, this.object.parent);
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
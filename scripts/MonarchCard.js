import Monarch from "./Monarch.js";
import MonarchApplicationMixin from "./MonarchApplicationMixin.js";
import { Controls, Badges } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 */

export default class MonarchCard extends MonarchApplicationMixin(foundry.applications.sheets.CardConfig) {
	static DEFAULT_OPTIONS = {
		form: {
			submitOnClose: true,
			closeOnSubmit: false
		},
		position: {
			width: 250,
			height: "auto",
		},
		window: {
			icon: "fa-solid fa-cards",
			resizable: true
		},
		classes: ["monarch", "monarch-card", "sheet", "trans"],
	}

	static get PARTS() {
		return {
			header: { template: "modules/monarch/templates/card/header.hbs" },
			display: { template: "modules/monarch/templates/card/display.hbs" },
			hud: { template: "modules/monarch/templates/parts/card-hud.hbs" },
			menu: { template: "modules/monarch/templates/parts/context-menu.hbs" },
			data: { template: "modules/monarch/templates/card/data.hbs" },
		};
	}

	/**
	 * Attach event handlers to the application.
	 *
	 * @param {HTMLElement} html - The element representing the application window
	 * @memberof MonarchCardsConfig
	 */
	_onRender(context, options) {
		super._onRender(context, options);
		let html = this.element;

		new foundry.applications.ux.Draggable.implementation(this, html, html.querySelector(".card-display"), false);

		html.querySelector(".card-display .magnify")
			.addEventListener("click", this._onDisplay.bind(this));

		html.querySelectorAll(".config-button").forEach(button => {
			button.addEventListener("click", this._onConfigButton.bind(this));
		});

		html.querySelectorAll(".card-control").forEach(button => {
			button.addEventListener("click", event => this._onControl(event, button));
		});

		html.addEventListener("contextmenu", this._onContextMenu.bind(this));
	}

	/**
	 * Handles clicking to magnify/display the card image.
	 *
	 * @param {PointerEvent} event - The click event.
	 * @memberof MonarchCard
	 */
	_onDisplay(event) {
		event.stopPropagation();
		const cardDocument = this.document;

		const popout = new foundry.applications.apps.ImagePopout({
			src: cardDocument.img,
			uuid: cardDocument.uuid,
			shareable: true,
			editable: true,
			window: {
				title: cardDocument.name,
			}
		}).render(true);

		if (event.shiftKey) popout.shareImage();
	}

	/**
	 * Handles clicking on the button to open one of the config dialogs.
	 *
	 * @param {PointerEvent} event - The click event.
	 * @memberof MonarchCard
	 */
	_onConfigButton(event) {
		event.stopPropagation();
		const element = event.currentTarget;
		const configRef = element.dataset.config;

		let configApp = null;

		switch (configRef) {
			case "faces":
				configApp = new MonarchFaceConfig(this.document);
				break;
			case "back":
				configApp = new MonarchBackConfig(this.document);
				break;
		}

		configApp.render(true);
	}

	/**
	 * Handles clicks on card controls
	 *
	 * Delegates the click event to the appropriate handler found in the `_controlFns` object,
	 * and passses the appropirate arguments.
	 *
	 * @param {PointerEvent}      event  - The click event
	 * @param {HTMLAnchorElement} button - The element that was clicked
	 * @return {void} 
	 * @memberof MonarchCardsConfig
	 */
	_onControl(event, button) {
		event.stopPropagation();
		if (button.dataset.disabled) return;
		button.classList.forEach(className => {
			if (this._controlFns[className])
				this._controlFns[className](event, this.document, this.document.parent);
		});
	}

	/**
	 * Handles the right click event.
	 *
	 * Displays a context menu for this card.
	 *
	 * @param {PointerEvent}  event - The click event
	 * @memberof MonarchCardsConfig
	 */
	_onContextMenu(event) {
		this.form.classList.remove("show-ctx");
		event.stopPropagation();
		event.preventDefault();
		this.form.classList.add("show-ctx");
		const menu = this.form.querySelector(".context-menu");
		menu.style.left = `${event.clientX}px`;
		menu.style.top = `${event.clientY}px`;
	}

	/** @type {Array<CardControl>} */
	get controls() {
		return [
			...super.controls,
			{
				class: "basic-controls",
				controls: [
					Controls.play,
					...(Monarch.settings.discardPile ? [Controls.discard] : []),
					...(Monarch.settings.showCard ? [Controls.showCard] : [])
				]
			}
		];
	}

	/** @override */
	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();

		if (this.document.source.isOwner) {
			buttons.unshift({
				class: "save",
				icon: "fas fa-save",
				onclick: this._onSubmit.bind(this)
			});
		}

		return buttons;
	}

	constructor(...args) {
		super(...args);

		this._getSubmitData = DocumentSheet.prototype._getSubmitData.bind(this);
	}

	async _prepareContext() {
		const context = await super._prepareContext();

		context.editable = this.document.source.isOwner;
		context.card = context.document;

		this.applyComponents(context);

		return context;
	}

	/**
	 * Construct all the data for each component for this card.
	 *
	 * @param {Object} context - The data for rendering the application template.
	 * @memberof MonarchCardsConfig
	 */
	applyComponents(context) {
		context.card.controls    = this.applyCardControls(this.document, context.controls, this.document.parent);
		context.card.contextMenu = this.applyCardControls(this.document, context.contextMenu, this.document.parent);
		context.card.badges      = this.applyCardBadges(this.document, context.badges, this.document.parent);
		context.card.markers     = this.applyCardMarkers(this.document, context.markers, this.document.parent);
		context.card.classes     = this.applyCardClasses(this.document, context.cardClasses, this.document.parent);
	}
}

class MonarchCardConfigDialog extends foundry.applications.sheets.CardConfig {
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

		this._getSubmitData = foundry.applications.sheets.CardConfig.prototype._getSubmitData.bind(this);
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
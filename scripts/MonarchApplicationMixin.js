import Monarch from "./Monarch.js";
import * as utils from "./utils.js";
import { Controls, Badges, Markers } from "./Components.js";

/**
 * @typedef {import("./Components.js").CardControl} CardControl
 * @typedef {import("./Components.js").CardBadge} CardBadge
 * @typedef {import("./Components.js").CardMarker} CardMarker
 * @typedef {import("./Components.js").AppControl} AppControl
 */

/**
 * @typedef  {Object} Components              An object containing the component arrays
 * @property {Array<CardBadge>}   badges      - The badges to display for each card
 * @property {Array<CardControl>} controls    - The controls to display for each card
 * @property {Array<CardMarker>}  markers     - The markers to display for each card
 * @property {Array<CardControl>} contextMenu - The controls to display for a card's context menu
 * @property {Array<AppControl>}  appControls - The controls to display on the application
 */

/** 
 * @param {typeof DocumentSheet} Base
 * @returns {typeof DocumentSheet}
 * @mixin
 * @augments DocumentSheet
 */
const MonarchApplicationMixin = Base => class extends Base {
	/**
	 * All the callback functions from the controls mapped to their class names.
	 *
	 * @type {Object<string, Function>}
	 */
	_controlFns = [];

	/** @override */
	setPosition(...args) {
		const position = super.setPosition(...args);
		utils.storeWindowPosition(this.object.uuid, position);
		return position;
	}

	/** @override */
	async close(...args) {
		utils.removePositon(this.object.uuid);
		return await super.close(args);
	}

	/** @type {boolean} */
	get isMonarch() { return true; }


	/**
	 * Handle sorting a Card relative to other siblings within this document
	 *
	 * @override Duplicates the functionality of the base method, but sorts the card *after* the target.
	 *
	 * @param {Event} event     The drag drop event
	 * @param {Card} card       The card being dragged
	 * @private
	 */
	_onSortCard(event, card) {
		const li = event.target.closest("[data-card-id]");
		const target = this.object.cards.get(li.dataset.cardId);
		const siblings = this.object.cards.filter(c => c.id !== card.id);
		const updateData = SortingHelpers.performIntegerSort(card, { target, siblings, sortBefore: false }).map(u => {
			return { _id: u.target.id, sort: u.update.sort }
		});
		return this.object.updateEmbeddedDocuments("Card", updateData);
	}

	/** 
	 * The height of all cards in the hand 
	 * @type {number} 
	 */
	get cardHeight() { return Monarch.settings.cardHeight; }


	/**
	 * Calculate the visual dimensions of a card, storing that
	 * data in the card object.
	 *
	 * If the card has an explicit width and height, these will be
	 * used in the calculation. Otherwise, the dimensions will be
	 * obtained from the image.
	 *
	 * The height will be set to a fixed value, and the width will
	 * be calculated to maintain the aspect ratio of the image.
	 *
	 * @param {object} card - The card data object
	 * @memberof MonarchApplicationMixin
	 */
	async _calcCardDimensions(card) {
		let width = card.data.width ?? 0;
		let height = card.data.height ?? 0;

		if (!width || !height) {
			if (!card.img) width = height = this.cardHeight;
			else ({ width, height } = await utils.getImageDimensions(card.img));
		}

		card.height = this.cardHeight;
		card.width = width * (this.cardHeight / height);
	}


	/**
	 * Creates a cssImage string on a card containing an
	 * appropriate CSS url() to reference the image.
	 *
	 * @param {object} card - The card data object
	 * @memberof MonarchApplicationMixin
	 */
	_getCssImageUrl(card) {
		const image = card.img;
		const prefix = (image.startsWith("/") ||  image.startsWith("http")) ? "" : "/";
		card.cssImage = `url('${prefix}${image}')`;
	}

	/** @type {Array<CardControl>} */
	get controls() {
		return Controls.default;
	}

	/** @type {Array<CardBadge>} */
	get badges() {
		return Badges.default;
	}

	/** @type {Array<CardMarker>} */
	get markers() {
		return Markers.default;
	}

	/** @type {Array<CardControl>} */
	get contextMenu() {
		return [
			Controls.colorToggles
		];
	}

	/** @type {Array<AppControl>} */
	get appControls() {
		return [];
	}

	
	/**
	 * Generate the data for controls on the provided card.
	 *
	 * @param {Card}               card     - The card to place the control on
	 * @param {Array<CardControl>} controls - The controls to generate
	 * @return {Array<CardControl>}
	 */
	applyCardControls(card, controls) {
		return controls.map(control => this.applyCardControl(card, control));
	}

	/**
	 * Obtain the strings for control labels, ensure that all three of
	 * label, tooltip, and aria have values. If no valid values is given,
	 * display an error message.
	 *
	 * @param {CardControl|AppControl} control - The control with labels to check
	 * @param {Array<any>}             args    - The arguments to pass to the string callbacks         
	 * @return {{ label: string, tooltip: string, aria: string }} }} 
	 */
	applyControlLabels(control, ...args) {
		// Generate labels
		let label   = utils.functionOrValue(control.label,   "")(...args);
		let tooltip = utils.functionOrValue(control.tooltip, "")(...args);
		let aria    = utils.functionOrValue(control.aria,    "")(...args);

		// If tooltip or label is empty, copy the other to it so they match
		if (!tooltip) tooltip = label;
		if (!label)   label   = tooltip;

		// If there aren't sub controls, and neither tooltip nor label have any text, show an error message
		if (!control.controls?.length && !tooltip && !label) {
			const error = game.i18n
				.format("monarch.console.error.noLabelTooltip", { class: control.class });
			console.error(error);
			ui.notifications.error(error);
		}

		// If the aria label isn't set, use the tooltip value for it.
		if (!aria) aria = tooltip;

		// Return the set of labels
		return { label, tooltip, aria };
	}

	/**
	 * Generate the data for a control on the provided card.
	 *
	 * @param {Card}               card      - The card to place the control on
	 * @param {Array<CardControl>} controls  - The controls to generate
	 * @param {Cards}              container - The cards container
	 * @return {Array<CardControl>}
	 */
	applyCardControl(card, control, container) {
		return {
			...this.applyControlLabels(control, card, container),
			icon:     utils.functionOrValue(control.icon, "")(card, container),
			color:    utils.functionOrValue(control.color, "#FFFFFF")(card, container),
			class:    control.class ?? "",
			disabled: utils.functionOrValue(control.disabled, false)(card, container),
			controls: control.controls ? this.applyCardControls(card, control.controls) : []
		};
	}

	/**
	 * Generate the data for a control on the provided container.
	 *
	 * @param {Array<AppControl>} controls  - The controls to generate
	 * @param {Cards}             container - The cards container
	 * @return {Array<AppControl>}
	 */
	applyApplicationControls(controls, container) {
		return controls.map(control => ({
			...this.applyControlLabels(control, this, container),
			icon:     utils.functionOrValue(control.icon, "")(this, container),
			class:    control.class ?? "",
			disabled: utils.functionOrValue(control.disabled, false)(this, container),
			hide:     utils.functionOrValue(control.hide, false)(this, container)
		}));
	}

	/**
	 * Generate the data for badges on the provided card.
	 *
	 * @param {Card}             card      - The card to place the badge on
	 * @param {Array<CardBadge>} badges    - The badge to generate
	 * @param {Cards}            container - The cards container
	 * @return {Array<CardBadge>} 
	 */
	applyCardBadges(card, badges, container) {
		return badges.map(badge => ({
			tooltip: utils.functionOrValue(badge.tooltip, "")(card, container),
			text:    utils.functionOrValue(badge.text, "")(card, container),
			hide:	 utils.functionOrValue(badge.hide, false)(card, container),
			class:   badge.class ?? "",
		}));
	}

	/**
	 * Generate the data for markers on the provided card.
	 *
	 * @param {Card}              card      - The card to place the marker on
	 * @param {Array<CardMarker>} markers   - The markers to generate
	 * @param {Cards}             container - The cards container
	 * @return {Array<CardMarker>} 
	 */
	applyCardMarkers(card, markers, container) {
		return markers.map(marker => ({
			tooltip: utils.functionOrValue(marker.tooltip, "")(card, container),
			icon:    utils.functionOrValue(marker.icon, "fa fas-circle")(card, container),
			color:   utils.functionOrValue(marker.color, "#FFFFFF")(card, container),
			show:    utils.functionOrValue(marker.show, false)(card, container),
			class:   marker.class ?? "",
		}));
	}

	/**
	 * Reduce a nested array of controls into a flat object of control functions.
	 *
	 * @param {Array<[string, Function]>} controls - Entries for each control function and its class
	 * @param {CardControl|AppControl}    control  - The control to extract the function from                    
	 * @return {Array<[string, Function]>} Entries for each control function and its class
	 */
	controlReducer(controls, control) {
		if (!control.class) {			
			const error = game.i18n.localize("monarch.console.error.noControlClass");
			console.error(error);
			ui.notifications.error(error);
			return controls;
		}

		if (control.onclick) {
			controls.push([control.class, control.onclick]);
		}

		if (control.controls) control.controls.reduce(this.controlReducer.bind(this), controls);

		return controls;
	}

	async getData(...args) {
		const data = await super.getData(...args);

		data.badges      = this.badges;
		data.controls    = this.controls;
		data.markers	 = this.markers;
		data.contextMenu = this.contextMenu;
		data.appControls = this.appControls;

		/** @type {Components} */
		const components = {
			badges: data.badges,
			controls: data.controls,
			markers: data.markers,
			contextMenu: data.contextMenu,
			appControls: data.appControls
		}

		const chain = this.constructor._getInheritanceChain();
		chain.push({ name: "MonarchApplication" });
		for (let cls of chain) {
			/**
			 *
			 * A hook that is called before this application is rendered which collects,
			 * a set of badges and controls to display on the application.
			 *
			 * @param {FormApplication} app        - The application object
			 * @param {Components}      components - An object containing the component arrays
			 */
			Hooks.call(`get${cls.name}Components`, this, components);
		}
		
		this._controlFns = {
			...Object.fromEntries(data.controls.reduce(this.controlReducer.bind(this), [])),
			...Object.fromEntries(data.contextMenu.reduce(this.controlReducer.bind(this), [])),
			...Object.fromEntries(data.appControls.reduce(this.controlReducer.bind(this), [])),
		}

		return data;
	}
}

export default MonarchApplicationMixin;
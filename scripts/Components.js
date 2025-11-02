import Monarch from "./Monarch.js";

/**
 * @callback stringCallback
 * @param {Card}  card      - The card to construct the string for
 * @param {Cards} container - The cards container
 * @returns {string}
 *
 * @callback booleanCallback
 * @param {Card}  card      - The card to determine the boolean for
 * @param {Cards} container - The cards container
 * @returns {boolean}
 *
 * @callback cardClickCallback
 * @param {Event} event     - The click event
 * @param {Card}  card      - The card to act upon
 * @param {Cards} container - The cards container
 * @returns {void}
 *
 * @callback appStringCallback
 * @param {FormApplication} app       - The Monarch application instance
 * @param {Cards}           container - The cards container
 * @returns {string}
 *
 * @callback appBooleanCallback
 * @param {FormApplication} app       - The Monarch application instance
 * @param {Cards}           container - The cards container
 * @returns {boolean}
 *
 * @callback appClickCallback
 * @param {Event}           event     - The click event
 * @param {FormApplication} app       - The Monarch application instance
 * @param {Cards}           container - The cards container
 * @returns {void}
 */
/**
 * @typedef  {Object} CardBadge                      An object defining a badge to display information on a card.
 * @property {string|stringCallback}      tooltip    - The tooltip of the badge, or a function that returns the tooltip
 * @property {string|stringCallback}      text       - The label of the badge, or a function that returns the label. May contain HTML.
 * @property {string}                     [class]    - The css class to apply to the badge
 * @property {boolean|booleanCallback}    [hide]     - Whether or not to hide (not display) the badge at all.
 *
 * @typedef  {Object} CardMarker                     An object defining a marker to display on a card.
 * @property {string|stringCallback}      tooltip    - The tooltip of the marker, or a function that returns the tooltip
 * @property {string}                     [class]    - The css class to apply to the marker
 * @property {string|stringCallback}      [icon]     - The icon to display for the marker, or a function that returns the icon. Default is a dot.
 * @property {string|stringCallback}      [color]    - The color of the marker, or a function that returns the color. Default is white.
 * @property {boolean|booleanCallback}    [show]     - Whether or not to show the marker. Default is false.
 *
 * @typedef  {Object} CardControl                    An object defining a control to display on a card.
 * @property {string|stringCallback}      [label]    - The label of the control
 * @property {string|stringCallback}      [tooltip]  - The tooltip of the control, or a function that returns the tooltip
 * @property {string|stringCallback}      [aria]     - The aria label (for screen readers) of the control, or a function that returns the aria label
 * @property {string|stringCallback}      [icon]     - The icon to display for the control, or a function that returns the icon
 * @property {string|stringCallback}      [color]    - The color of the icon, or a function that returns the color. Default is white.
 * @property {string}                     [class]    - The css class to apply to the control
 * @property {boolean|booleanCallback}    [disabled] - Whether the control is disabled, or a function that returns whether the control is disabled
 * @property {boolean|appBooleanCallback} [hide]     - Whether or not to hide (not display) the control at all.
 * @property {cardClickCallback}          [onclick]  - The function to call when the control is clicked
 * @property {Array<CardControl>}         [controls] - An array of controls to display as a group
 *
 * @typedef  {Object} AppControl                     An object defining a control to display on the application.
 * @property {string}                     label      - The label of the control
 * @property {string|appStringCallback}   [tooltip]  - The tooltip of the control, or a function that returns the tooltip
 * @property {string|appStringCallback}   [aria]     - The aria label (for screen readers) of the control, or a function that returns the aria label
 * @property {string}                     class      - The css class to apply to the control
 * @property {string|appStringCallback}   icon       - The icon to display for the control, or a function that returns the icon
 * @property {boolean|appBooleanCallback} [disabled] - Whether the control is disabled, or a function that returns whether the control is disabled
 * @property {boolean|appBooleanCallback} [hide]     - Whether or not to hide (not display) the control at all.
 * @property {Function}                   onclick    - The function to call when the control is clicked
 */

/** @type {Object<string, string>} */
export const colors = {
	red: "#ff0000",
	green: "#00ff00",
	blue: "#0000ff",
	yellow: "#ffff00",
	purple: "#800080",
	black: "#000000",
	white: "#ffffff"
}

export class Controls {
	/** @type {Array<CardControl>} */
	static get default() {
		return [
			this.faces
		];
	}

	/** @type {CardControl} */
	static get faces() {
		return {
			class: "card-faces",
				controls: [
					this.facePrevious,
					this.faceNext,
					this.flipFace
				]
		}
	}

	/** @type {CardControl} */
	static get faceNext() {
		return {
			tooltip: "CARD.FaceNext",
			icon: "fas fa-caret-up",
			class: "next-face",
			disabled: (card) => !card.hasNextFace || !card.isOwner,
			hide: (card) => card.faces?.length < 2,
			onclick: (event, card) => card.update({ face: card.face === null ? 0 : card.face + 1 })
		}
	}

	/** @type {CardControl} */
	static get facePrevious() {
		return {
			tooltip: "CARD.FacePrevious",
			icon: "fas fa-caret-down",
			class: "prev-face",
			disabled: (card) => !card.hasPreviousFace || !card.isOwner,
			hide: (card) => card.faces?.length < 2,
			onclick: (event, card) => card.update({ face: card.face === 0 ? null : card.face - 1 })
		}
	}

	/** @type {CardControl} */
	static get flipFace() {
		return {
			tooltip: "monarch.label.flipCard",
			icon: "fas fa-sync-alt fa-rotate-270",
			class: "flip-face",
			disabled: (card) => !card.isOwner && card.faces.length,
			hide: (card) => card.faces?.length > 1,
			onclick: (event, card) => card.update({ face: card.face === null ? 0 : null })
		}
	}

	/** @type {CardControl} */
	static get play() {
		return {
			tooltip: "CARD.Play",
			aria: (card) => game.i18n.format("monarch.aria.playCard", { name: card.name }),
			icon: "fas fa-chevron-circle-right",
			class: "play-card",
			disabled: (card) => !card.isOwner,
			onclick: (event, card, pile) => pile.playDialog(card)
		}
	}

	/** @type {CardControl} */
	static get edit() {
		return {
			tooltip: "CARD.Edit",
			icon: "fas fa-edit",
			class: "edit-card",
			onclick: (event, card) => card.sheet.render(true)
		}
	}

	/** @type {CardControl} */
	static get delete() {
		return {
			tooltip: "CARD.Delete",
			icon: "fas fa-trash",
			class: "delete-card",
			onclick: (event, card) => card.deleteDialog()
		}
	}

	/** @type {CardControl} */
	static get discard() {
		return {
			tooltip: "monarch.label.discard",
			icon: "fas fa-caret-square-down",
			class: "discard-card",
			disabled: (card) => !card.isOwner,
			onclick: (event, card) => card.pass(Monarch.discardPile)
		}
	}

	/** @type {CardControl} */
	static get showCard() {
		return {
			tooltip: "monarch.label.showCard",
			icon: "fas fa-eye",
			class: "show-card",
			disabled: (card) => !game.user.isGM,
			onclick: async (event, card) => await game.socket.emit("module.monarch", {
				command: "showCard",
				data: {
					card: card.id,
					pile: card.source.id
				}
			})
		}
	}

	/** 
	 * Returns a control definition to toggle a given color marker.
	 * 
	 * @param {string} color - The color of the marker
	 * @return {CardControl} 
	 */
	static _getColorToggle(color) {
		return {
			tooltip: `monarch.markerToggles.${color}`,
			icon: "fas fa-circle",
			color: colors[color],
			class: `toggle-marker-${color}`,
			onclick: (event, card) => card.setFlag(Monarch.name, `markers.${color}`, !card.getFlag(Monarch.name, `markers.${color}`)),
		}
	}

	/** @type {Object<string, CardControl>} */
	static get markerToggle() {
		return new Proxy(colors, {
			get: (target, color) => Controls._getColorToggle(color)
		});
	}

	/** @type {CardControl} */
	static get colorToggles() {
		return {
			class: "color-toggles",
			controls: [
				...Object.keys(colors).map(color => Controls.markerToggle[color]),
				Controls.clearColorMarkers
			]
		};
	}

	/** @type {CardControl} */
	static get clearColorMarkers() {
		return {
			tooltip: "monarch.label.clearColorMarkers",
			icon: "fas fa-times-circle",
			class: "clear-color-markers",
			color: "#BBBBBB",
			onclick: (event, card) => card.setFlag(Monarch.name, "markers", null)
		}
	}

	/** @type {CardControl} */
	static get consoleLog() {
		return {
			tooltip: "monarch.label.consoleLog",
			icon: "fas fa-terminal",
			class: "console-log",
			onclick: (event, card) => console.log(card, card.id)
		}
	}
}

export class AppControls {
	/** @type {AppControl} */
	static get shuffle() {
		return {
			label: "CARDS.Shuffle",
			icon: "fas fa-random",
			class: "shuffle-pile",
			onclick: (event, app, pile) => {
				app._sortStandard = false;
				return pile.shuffle();
			}
		}
	}

	/** @type {AppControl} */
	static get deal() {
		return {
			label: "CARDS.Deal",
			icon: "fas fa-share-square",
			class: "deal-pile",
			onclick: (event, app, pile) => pile.dealDialog()
		}
	}

	/** @type {AppControl} */
	static get reset() {
		return {
			label: "CARDS.Reset",
			icon: "fas fa-undo",
			class: "reset-pile",
			onclick: (event, app, pile) => pile.resetDialog()
		}
	}

	/** @type {AppControl} */
	static get draw() {
		return {
			label: "CARDS.Draw",
			icon: "fas fa-plus",
			class: "draw-cards",
			onclick: (event, app, pile) => pile.drawDialog()
		}
	}

	/** @type {AppControl} */
	static get pass() {
		return {
			label: "CARDS.Pass",
			icon: "fas fa-share-square",
			class: "pass-cards",
			onclick: (event, app, pile) => pile.passDialog()
		}
	}
}

export class Badges {
	/** @type {Array<CardBadge>} */
	static get default() {
		return [
			...(Monarch.settings.showSuit  ? [this.suit]  : []),
			...(Monarch.settings.showValue ? [this.value] : []),
			...(Monarch.settings.showType  ? [this.type]  : [])
		];
	}

	/** @type {CardBadge} */
	static get name() {
		return {
			tooltip: "CARD.Name",
			text: (card) => card.name,
			class: "card-name"
		}
	}

	/** @type {CardBadge} */
	static get suit() {
		return {
			tooltip: "CARD.Suit",
			text: card => card.suit,
			class: "card-suit"
		}
	}

	/** @type {CardBadge} */
	static get value() {
		return {
			tooltip: "CARD.Value",
			text: card => card.value,
			class: "card-value"
		}
	}

	/** @type {CardBadge} */
	static get type() {
		return {
			tooltip: "CARD.Type",
			text: card => card.type,
			class: "card-type"
		}
	}

	/** @type {CardBadge} */
	static get drawn() {
		return {
			tooltip: "CARD.Drawn",
			text: game.i18n.localize("CARD.Drawn"),
			hide: (card) => !card.drawn,
			class: "card-drawn"
		}
	}
}

export class Markers {
	/** @type {Array<CardMarker>} */
	static get default() {
		return Object.keys(colors).map(color => Markers.color[color]);
	}

	/**
	 * Returns a marker definition for a colored dot.
	 *
	 * @param {string} color - The color of the dot
	 * @returns {CardMarker}
	 */
	static _getColorMarker(color) {
		return {
			tooltip: `monarch.markers.${color}`,
			class: `marker-${color}`,
			icon: "fas fa-circle",
			color: colors[color],
			show: (card) => card.getFlag(Monarch.name, `markers.${color}`),
		}
	}

	/** @type {Object<string, CardMarker>} */
	static get color() {
		return new Proxy(colors, {
			get: (target, color) => Markers._getColorMarker(color)
		});
	}
}
/**
 * @typedef  {Object} CardBadge                     An object defining a badge to display information on a card.
 * @property {string|Function<string>}   tooltip    - The tooltip of the badge, or a function that returns the tooltip
 * @property {string|Function<string>}   text       - The label of the badge, or a function that returns the label. May contain HTML.
 * @property {string}                    class      - The css class to apply to the badge
 * @property {boolean|Function<boolean>} [hide]     - Whether or not to hide (not display) the badge at all.
 *
 * @typedef  {Object} CardControl                   An object defining a control to display on a card.
 * @property {string|Function<string>}   [tooltip]  - The tooltip of the control, or a function that returns the tooltip
 * @property {string|Function<string>}   [aria]     - The aria label (for screen readers) of the control, or a function that returns the aria label
 * @property {string|Function<string>}   [icon]     - The icon to display for the control, or a function that returns the icon
 * @property {string}                    [class]    - The css class to apply to the control
 * @property {boolean|Function<boolean>} [disabled] - Whether the control is disabled, or a function that returns whether the control is disabled
 * @property {Function}                  [onclick]  - The function to call when the control is clicked
 * @property {Array<CardControl>}        [controls] - An array of controls to display as a group
 *
 * @typedef  {Object} AppControl                    An object defining a control to display on the application.
 * @property {string}                    label      - The label of the control
 * @property {string|Function<string>}   tooltip    - The tooltip of the control, or a function that returns the tooltip
 * @property {string|Function<string>}   aria       - The aria label (for screen readers) of the control, or a function that returns the aria label
 * @property {string}                    class      - The css class to apply to the control
 * @property {string|Function<string>}   icon       - The icon to display for the control, or a function that returns the icon
 * @property {Function}                  onclick    - The function to call when the control is clicked
 */

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
					this.faceNext,
					this.facePrevious
				]
		}
	}

	/** @type {CardControl} */
	static get faceNext() {
		return {
			tooltip: "CARD.FaceNext",
			icon: "fas fa-caret-up",
			class: "next-face",
			disabled: (card) => !card.hasNextFace,
			onclick: (event, card) => card.update({ face: card.data.face === null ? 0 : card.data.face + 1 })
		}
	}

	/** @type {CardControl} */
	static get facePrevious() {
		return {
			tooltip: "CARD.FacePrevious",
			icon: "fas fa-caret-down",
			class: "prev-face",
			disabled: (card) => !card.hasPreviousFace,
			onclick: (event, card) => card.update({ face: card.data.face === 0 ? null : card.data.face - 1 })
		}
	}

	/** @type {CardControl} */
	static get play() {
		return {
			tooltip: "CARD.Play",
			aria: (card) => game.i18n.format("monarch.aria.playCard", { name: card.name }),
			icon: "fas fa-chevron-circle-right",
			class: "play-card",
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
			onclick: (event, card) => card.pass(game.cards.getName("Discard"))
		}
	}
}

export class Badges {
	/** @type {Array<CardBadge>} */
	static get default() {
		return [
			this.suit,
			this.value,
			this.type,
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
			text: card => card.data.suit,
			class: "card-suit"
		}
	}

	/** @type {CardBadge} */
	static get value() {
		return {
			tooltip: "CARD.Value",
			text: card => card.data.value,
			class: "card-value"
		}
	}

	/** @type {CardBadge} */
	static get type() {
		return {
			tooltip: "CARD.Type",
			text: card => card.data.type,
			class: "card-type"
		}
	}

	/** @type {CardBadge} */
	static get drawn() {
		return {
			tooltip: "CARD.Drawn",
			text: game.i18n.localize("CARD.Drawn"),
			hide: (card) => !card.data.drawn,
			class: "card-drawn"
		}
	}
}
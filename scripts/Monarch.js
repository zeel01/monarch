import MonarchApplicationMixin from "./MonarchApplicationMixin.js";
import MonarchCardsConfig from "./MonarchCardsConfig.js";
import MonarchDeck from "./MonarchDeck.js";
import MonarchPile from "./MonarchPile.js";
import MonarchHand from "./MonarchHand.js";
import MonarchCard from "./MonarchCard.js";
import MonarchSettings from "./MonarchSettings.js";
import { Controls, Markers, Badges, AppControls } from "./Components.js";
import * as utils from "./utils.js";

export default class Monarch {
	/** 
	 * The name of the module, used for flag and settings scopes.
	 * @type {string} 
	 */
	static get name() { return "monarch"; }

	static ApplicationMixin = MonarchApplicationMixin;

	static CardsConfig = MonarchCardsConfig;
	static Deck        = MonarchDeck;
	static Pile        = MonarchPile;
	static Hand        = MonarchHand;
	static Card        = MonarchCard;

	static Controls    = Controls;
	static Badges      = Badges;
	static Markers     = Markers;
	static AppControls = AppControls;

	static utils = utils;

	/**
	 * Convenience proxy getter for Monarch settings.
	 *
	 * @readonly
	 * @static
	 * @memberof Monarch
	 */
	static settings = new Proxy({}, {
		get: function (target, key) {
			try { return game.settings.get(Monarch.name, key); }
			catch (err) { 
				console.warn(err);	
				return undefined; 
			};
		}
	});

	static get settingDefinitions() {
		return {
			showSuit:  { type: Boolean, default: true },
			showValue: { type: Boolean, default: true },
			showType:  { type: Boolean, default: false },
			handReset: { type: Boolean, default: false },
			showCard:  { type: Boolean, default: true },
			cardHeight: {
				type: Number,
				default: 200
			},
			discardPile: {
				type: String,
				default: "",
				getChoices: () => ({
					"": "",
					...Object.fromEntries(
						game.cards
							.filter(pile => pile.type === "pile")
							.map(pile => [pile.id, pile.name])
					)
				})
			}
		};
	}

	/**
	 * The Cards pile designated as the discard pile.
	 *
	 * @type {Cards}
	 * @readonly
	 * @static
	 * @memberof Monarch
	 */
	static get discardPile() {
		return game.cards.get(this.settings.discardPile);
	}

	/**
	 * Re-renders all Monarch sheets to allow settings to take effect.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static refreshSheets() {
		Object.values(ui.windows)
			.filter(window => window.isMonarch)
			.forEach(window => window.render())
	}

	/**
	 * Refreshes Monarch sheets for all players.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static async refreshSheetsAll() {
		await game.socket.emit(this.socketName, {
			command: "refreshSheets"
		});

		this.refreshSheets();
	}

	/**
	 * Display the sheet for the card specified in the data
	 *
	 * @static
	 * @param {{ pile: string, card: string }} data - Ids of the card and its container
	 * @memberof Monarch
	 */
	static async showCard(data) {
		game.cards.get(data.pile)?.cards?.get(data.card)?.sheet?.render(true)
	}

	/**
	 * Load all the templates for handlebars partials.
	 *
	 * @return {Promise<Function[]>} An array of functions that render the partials.
	 * @memberof Monarch
	 */
	static async preLoadTemplates() {
		return loadTemplates([
			// Shared Partials
			"modules/monarch/templates/parts/card-badge.hbs",
			"modules/monarch/templates/parts/card-control.hbs",
			"modules/monarch/templates/parts/card-marker.hbs",
			"modules/monarch/templates/parts/control-block.hbs",
			"modules/monarch/templates/parts/context-menu.hbs",
			"modules/monarch/templates/parts/app-controls.hbs",
			"modules/monarch/templates/parts/card-hud.hbs"
		]);
	}

	/**
	 * Register all settings for this module.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static registerSettings() {
		Object.entries(this.settingDefinitions).forEach(([key, def]) => {
			game.settings.register(Monarch.name, key, {
				...def,
				scope: "world",
				config: false,
				name: `monarch.settings.${key}.name`,
				hint: `monarch.settings.${key}.hint`
			});
		})

		game.settings.registerMenu(this.name, 'settingsMenu', {
			name: game.i18n.localize("monarch.settings.label"),
			label: game.i18n.localize("monarch.settings.title"),
			type: MonarchSettings,
		});
	}

	/**
	 * Register all document sheets for this module.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static registerSheets() {
		DocumentSheetConfig
			.registerSheet(Cards, this.name, MonarchHand, {
				label: game.i18n.localize("monarch.sheetTitle.myHand"),
				types: ["hand"]
			})

		DocumentSheetConfig
			.registerSheet(Cards, this.name, MonarchDeck, {
				label: game.i18n.localize("monarch.sheetTitle.deck"),
				types: ["deck"]
			})

		DocumentSheetConfig
			.registerSheet(Cards, this.name, MonarchPile, {
				label: game.i18n.localize("monarch.sheetTitle.pile"),
				types: ["pile"]
			})

		DocumentSheetConfig
			.registerSheet(Card, this.name, MonarchCard, {
				label: game.i18n.localize("monarch.sheetTitle.card")
			})
	}

	/**
	 * Handles the init hook.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static onInit() {
		this.registerSettings();
		this.registerSheets();
	}

	/**
	 * Handles the ready hook.
	 *
	 * @static
	 * @memberof Monarch
	 */
	static async onReady() {
		await this.preLoadTemplates();

		utils.restoreWindows();

		// Event listener to close all context menus when the user clicks outside of them.
		document.addEventListener("click", event => {
			document.querySelectorAll(".monarch .card").forEach(card => card.classList.remove("show-ctx"));
		});

		game.socket.on(this.socketName, this._onSocketMessage.bind(this));

		console.log(game.i18n.localize("monarch.console.log.ready"));
	}

	/**
	 * The name of the web socket for this module
	 *
	 * @readonly
	 * @static
	 * @memberof Monarch
	 */
	static get socketName() {
		return `module.${this.name}`;
	}

	/**
	 * Handles socket messages.
	 *
	 * Delegates the message to the appropriate handler.
	 *
	 * @static
	 * @param {Object} message
	 * @param {String} message.command - The command to handle.
	 * @param {Object} message.data    - The data for the command.
	 * @memberof Monarch
	 */
	static async _onSocketMessage({ command, data }) {
		if (!this[command]) return;
		await this[command](data);
	}
}
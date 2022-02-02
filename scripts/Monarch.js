import MonarchApplicationMixin from "./MonarchApplicationMixin.js";
import MonarchCardsConfig from "./MonarchCardsConfig.js";
import MonarchDeck from "./MonarchDeck.js";
import MonarchPile from "./MonarchPile.js";
import MonarchHand from "./MonarchHand.js";
import MonarchCard from "./MonarchCard.js";
import { Controls, Markers, Badges, AppControls } from "./Components.js";
import * as utils from "./utils.js";

export default class Monarch {
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
	 * Set of convenience getters for Monarch settings.
	 *
	 * @readonly
	 * @static
	 * @memberof Monarch
	 */
	static get settings() {
		return {
			get cardHeight() {
				return game.settings.get(Monarch.name, "cardHeight");
			},
			get discardPile() {
				return game.settings.get(Monarch.name, "discardPile");
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
		game.settings.register(this.name, "cardHeight", {
			name: game.i18n.localize("monarch.settings.cardHeight.name"),
			hint: game.i18n.localize("monarch.settings.cardHeight.hint"),
			scope: "world",
			config: true,
			type: Number,
			default: 200,
			onChange: () => {
				Object.values(ui.windows)
					.filter(w => w.isMonarch)
					.forEach(w => w.render(true));
			}
		});

		game.settings.register(this.name, "discardPile", {
			name: game.i18n.localize("monarch.settings.discardPile.name"),
			hint: game.i18n.localize("monarch.settings.discardPile.hint"),
			scope: "world",
			config: true,
			type: String,
			default: "",
			onChange: () => { }
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

	static onInit() {
		this.registerSettings();
		this.registerSheets();
	}

	static async onReady() {
		await this.preLoadTemplates();

		utils.restoreWindows();

		document.addEventListener("click", (event) => {
			document.querySelectorAll(".monarch .card").forEach(card => card.classList.remove("show-ctx"));
		});

		console.log(game.i18n.localize("monarch.console.log.ready"));
	}
}
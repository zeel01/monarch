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
}
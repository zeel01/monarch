import * as utils from './utils.js';

export default class Monarch {
	static get name() { return "monarch"; }

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
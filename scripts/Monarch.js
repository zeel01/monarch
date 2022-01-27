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
}
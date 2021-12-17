import * as utils from "./utils.js";

/** 
 * @param {typeof DocumentSheet} Base
 * @returns {typeof DocumentSheet}
 * @mixin
 * @augments DocumentSheet
 */
const MonarchApplicationMixin = Base => class extends Base {
	setPosition(...args) {
		const position = super.setPosition(...args);
		utils.storeWindowPosition(this.object.uuid, position);
		return position;
	}

	async close(...args) {
		utils.removePositon(this.object.uuid);
		return await super.close(args);
	}


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
}

export default MonarchApplicationMixin;
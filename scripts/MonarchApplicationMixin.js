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
}

export default MonarchApplicationMixin;
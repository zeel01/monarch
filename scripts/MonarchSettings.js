import Monarch from "./Monarch.js";

/**
 * A form for inputting Monarch settings.
 *
 * @export
 * @class MonarchSettings
 * @extends {FormApplication}
 */
export default class MonarchSettings extends FormApplication {
	/**
	 * Default Options for this FormApplication
	 *
	 * @readonly
	 * @static
	 * @memberof MonarchSettings
	 */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: "monarch-settings",
			title: game.i18n.localize("monarch.settings.title"),
			template: "./modules/monarch/templates/monarch-settings.hbs",
			classes: ["monarch-settings", "sheet"],
			width: 500,
			height: 500,
			closeOnSubmit: true,
			submitOnClose: false,
			resizable: true
		});
	}

	/**
	 * Construct an object of data to be passed to this froms HTML template.
	 *
	 * @return {object} The data being supplied to the template.
	 * @memberof SettingsForm
	 */
	getData() {
		return {
			settings: Object.entries(Monarch.settingDefinitions)
				.map(([key, def]) => ({
					...def,
					id: key,
					type: def.type.name,
					name: game.i18n.localize(`monarch.settings.${key}.name`),
					hint: game.i18n.localize(`monarch.settings.${key}.hint`),
					value: Monarch.settings[key],
					choices: def.getChoices ? def.getChoices() : undefined
				}))
		};
	}

	/**
	 * Executes on form submission.
	 *
	 * @param {Event} event - the form submission event
	 * @param {object} data - the form data
	 * @memberof SettingsForm
	 */
	async _updateObject(event, data) {
		for (let [key, value] of Object.entries(data)) {
			await game.settings.set(Monarch.name, key, value);
		}
	}

	/**
	 * Handles form submission.
	 *
	 * @override Added sheet refresh
	 *
	 * @param {*} args
	 * @return {*} 
	 * @memberof MonarchSettings
	 */
	async _onSubmit(...args) {
		const ret = await super._onSubmit(...args);
		await Monarch.refreshSheetsAll();
		return ret;
	}
}

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
			height: "auto",
			closeOnSubmit: Monarch.debugLevel < 1,
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
		// All settings
		const all = Object.entries(Monarch.settingDefinitions);

		// Settings expanded with all the relevant data
		const expanded = all.map(([key, def]) => ({
			...def,
			id: key,
			type: def.type.name,
			scope: def.scope ?? "world",
			name: game.i18n.localize(`monarch.settings.${key}.name`),
			hint: game.i18n.localize(`monarch.settings.${key}.hint`),
			value: Monarch.settings[key],
			choices: def.getChoices ? def.getChoices() : undefined
		}));

		// Settings that are grouped
		const grouped = expanded.filter(setting => setting.group);
		
		// Settings that aren't grouped
		const settings = expanded.filter(setting => !setting.group);

		// Setting groups
		const groups = {};
		grouped.forEach(setting => {
			const group = setting.group;
			if (!groups[group]) {
				groups[group] = {
					scope: setting.scope,
					type: setting.type,
					name: game.i18n.localize(`monarch.settings.groups.${group}.name`),
					hint: game.i18n.localize(`monarch.settings.groups.${group}.hint`),
					settings: []
				}
			}

			groups[group].settings.push(setting);
		});

		const worldSettings = settings.filter(setting => setting.scope == "world");	
		const clientSettings = settings.filter(setting => setting.scope == "client");

		const worldGroups = Object.values(groups).filter(group => group.scope == "world");
		const clientGroups = Object.values(groups).filter(group => group.scope == "client");

		return {
			isGM: game.user.isGM,
			worldSettings,
			clientSettings,
			worldGroups,
			clientGroups 
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

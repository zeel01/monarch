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
	 * @static
	 * @memberof MonarchSettings
	 */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
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
		const allSettingEntries = Object.entries(Monarch.settingDefinitions);

		// Settings expanded with all the relevant data
		const expandedSettingData = allSettingEntries.map(([key, settingDefinition]) => ({
			...settingDefinition,
			id: key,
			type: settingDefinition.type.name,
			scope: settingDefinition.scope ?? "world",
			name: game.i18n.localize(`monarch.settings.${key}.name`),
			hint: game.i18n.localize(`monarch.settings.${key}.hint`),
			value: Monarch.settings[key],
			choices: settingDefinition.getChoices ? settingDefinition.getChoices() : undefined
		}));

		// Settings that are grouped
		const groupedSettings = expandedSettingData.filter(setting => setting.group);
		
		// Settings that aren't grouped
		const ungroupedSettings = expandedSettingData.filter(setting => !setting.group);

		// Setting groups
		const settingGroups = {};
		groupedSettings.forEach(setting => {
			const groupName = setting.group;
			if (!settingGroups[groupName]) {
				settingGroups[groupName] = {
					scope: setting.scope,
					type: setting.type,
					name: game.i18n.localize(`monarch.settings.groups.${groupName}.name`),
					hint: game.i18n.localize(`monarch.settings.groups.${groupName}.hint`),
					settings: []
				}
			}

			settingGroups[groupName].settings.push(setting);
		});

		const worldSettings = ungroupedSettings.filter(setting => setting.scope == "world");	
		const clientSettings = ungroupedSettings.filter(setting => setting.scope == "client");

		const worldGroups = Object.values(settingGroups).filter(settingGroup => settingGroup.scope == "world");
		const clientGroups = Object.values(settingGroups).filter(settingGroup => settingGroup.scope == "client");

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
		const submitResult = await super._onSubmit(...args);
		await Monarch.refreshSheetsAll();
		return submitResult;
	}

	/**
	 * Handles click events on buttons.
	 *
	 * Delegates handling to the appripiate method.
	 *
	 * @param {PointerEvent} event
	 * @memberof MonarchSettings
	 */
	_onButtonClick(event) {
		event.preventDefault();
		const action = event.currentTarget.dataset.action;
		if (this[action]) this[action](event);
	}

	/**
	 * Handles the enable sheet button.
	 *
	 * Set one or all of the Monarch sheets as default.
	 *
	 * @param {PointerEvent} event
	 * @memberof MonarchSettings
	 */
	async enableSheets(event) {
		const sheet = event.currentTarget.dataset.sheet;
		const settings = {
			card: { "Card.base": "monarch.MonarchCard" },
			hand: { "Cards.hand": "monarch.MonarchHand" },
			deck: { "Cards.deck": "monarch.MonarchDeck" },
			pile: { "Cards.pile": "monarch.MonarchPile" },
		}
		if (sheet == "all") await this._setSheets({
			...settings.card, ...settings.hand,
			...settings.deck, ...settings.pile
		});
		else await this._setSheets(settings[sheet]);

		ui.notifications.info(game.i18n.format(
			"monarch.settings.enableSheets.notification", {
				sheet: game.i18n.localize(`monarch.settings.enableSheets.${sheet}`)
			}
		));
	}

	/**
	 * Update the default sheet settings.
	 *
	 * @param {Object<string, string>} newSettings - The new settings
	 * @memberof MonarchSettings
	 */
	async _setSheets(newSettings) {
		const settings = game.settings.get("core", "sheetClasses") || {};
		foundry.utils.mergeObject(settings, newSettings);
		await game.settings.set("core", "sheetClasses", settings);
	} 

	/**
	 * Attach event handlers to the application.
	 *
	 * @param {HTMLElement} html - The element representing the application window
	 * @memberof MonarchCardsConfig
	 */
	activateListeners(html) {
		super.activateListeners(html);
		html = html[0];
		
		html.querySelectorAll("[data-action]").forEach(button => {
			button.addEventListener("click", this._onButtonClick.bind(this));
		});
	}
}
